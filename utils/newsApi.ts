// utils/newsApi.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "pub_c9107702fbf34dc18a975e1455c8e015";
const BASE_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=in&language=en`;

const FEED_CACHE_KEY = "feed_cache";
const FEED_CACHE_EXPIRY_KEY = "feed_cache_expiry";
const CACHE_DURATION = 10 * 60 * 1000;

const RATE_LIMIT_KEY = "rate_limit_reset";

/**
 * Check if we're rate limited
 */
async function isRateLimited() {
  try {
    const resetTime = await AsyncStorage.getItem(RATE_LIMIT_KEY);
    if (!resetTime) return false;
    
    const now = Date.now();
    const reset = parseInt(resetTime, 10);
    
    if (now < reset) {
      const waitTime = Math.ceil((reset - now) / 1000);
      console.log(`Rate limited. Wait ${waitTime}s before retry`);
      return true;
    }
    
    await AsyncStorage.removeItem(RATE_LIMIT_KEY);
    return false;
  } catch (err) {
    console.warn("Failed to check rate limit:", err);
    return false;
  }
}

/**
 * Set rate limit flag
 */
async function setRateLimit(retryAfterSeconds = 60) {
  try {
    const resetTime = Date.now() + retryAfterSeconds * 1000;
    await AsyncStorage.setItem(RATE_LIMIT_KEY, resetTime.toString());
    console.log(`Rate limit set. Reset at: ${new Date(resetTime).toLocaleTimeString()}`);
  } catch (err) {
    console.warn("Failed to set rate limit:", err);
  }
}

async function cacheFeed(articles: any[]) {
  try {
    const now = Date.now();
    await AsyncStorage.multiSet([
      [FEED_CACHE_KEY, JSON.stringify(articles)],
      [FEED_CACHE_EXPIRY_KEY, now.toString()],
    ]);
    console.log("Feed cached successfully");
  } catch (err) {
    console.warn("Failed to cache feed:", err);
  }
}

async function getCachedFeed() {
  try {
    const [cachedData, expiryTime] = await AsyncStorage.multiGet([
      FEED_CACHE_KEY,
      FEED_CACHE_EXPIRY_KEY,
    ]);

    if (!cachedData[1] || !expiryTime[1]) {
      return null;
    }

    const now = Date.now();
    const lastCacheTime = parseInt(expiryTime[1], 10);

    if (now - lastCacheTime > CACHE_DURATION) {
      console.log("Feed cache expired");
      return null;
    }

    const articles = JSON.parse(cachedData[1]);
    console.log("Feed cache retrieved:", articles.length, "articles");
    return articles;
  } catch (err) {
    console.warn("Failed to retrieve cached feed:", err);
    return null;
  }
}

export async function clearFeedCache() {
  try {
    await AsyncStorage.multiRemove([FEED_CACHE_KEY, FEED_CACHE_EXPIRY_KEY]);
    console.log("Feed cache cleared");
  } catch (err) {
    console.warn("Failed to clear feed cache:", err);
  }
}

export async function fetchNews(page = 1, category = "all") {
  // Check rate limit first
  if (await isRateLimited()) {
    console.log("Rate limited - returning cached content");
    const cached = await getCachedFeed();
    return cached || [];
  }

  try {
    let url = `${BASE_URL}&page=${page}`;

    if (category !== "all") {
      url += `&category=${category}`;
    }

    const response = await axios.get(url, {
      timeout: 10000,
    });
    const data = response.data;

    if (data.results && Array.isArray(data.results)) {
      await cacheFeed(data.results);
      return data.results;
    }

    console.warn("API returned unexpected format:", data);
    return [];
  } catch (err: any) {
    const status = err?.response?.status;
    
    // Handle rate limiting (429)
    if (status === 429) {
      const retryAfter = err.response?.headers?.["retry-after"];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) : 60;
      
      console.log(`API rate limited (429). Retry after ${waitTime}s`);
      await setRateLimit(waitTime);
      
      const cached = await getCachedFeed();
      return cached || [];
    }
    
    // Handle 422 pagination error with fallback
    if (status === 422) {
      try {
        console.log('API returned 422, retrying without page parameter');
        let fallbackUrl = BASE_URL;
        if (category !== "all") {
          fallbackUrl += `&category=${category}`;
        }
        const fallbackRes = await axios.get(fallbackUrl, { timeout: 10000 });
        const fallbackData = fallbackRes.data;
        if (fallbackData?.results && Array.isArray(fallbackData.results)) {
          await cacheFeed(fallbackData.results);
          return fallbackData.results;
        }
        console.warn('Fallback returned unexpected format:', fallbackData);
        const cached = await getCachedFeed();
        return cached || [];
      } catch (fallbackErr: any) {
        console.log('Fallback request failed:', fallbackErr?.response?.status || fallbackErr?.message);
        const cached = await getCachedFeed();
        return cached || [];
      }
    }
    
    console.log('API fetch error:', status || err?.message);
    const cached = await getCachedFeed();
    return cached || [];
  }
}
