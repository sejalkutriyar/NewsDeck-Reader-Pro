// utils/newsApi.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  "https://newsdata.io/api/1/latest?apikey=pub_c9107702fbf34dc18a975e1455c8e015&country=in&language=en";

const FEED_CACHE_KEY = "feed_cache";
const FEED_CACHE_EXPIRY_KEY = "feed_cache_expiry";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Cache feed articles to AsyncStorage
 */
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

/**
 * Retrieve cached feed from AsyncStorage if valid
 */
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

    // Check if cache is still valid (within 10 minutes)
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

/**
 * Clear feed cache (optional utility)
 */
export async function clearFeedCache() {
  try {
    await AsyncStorage.multiRemove([FEED_CACHE_KEY, FEED_CACHE_EXPIRY_KEY]);
    console.log("Feed cache cleared");
  } catch (err) {
    console.warn("Failed to clear feed cache:", err);
  }
}

/**
 * Fetch news page from API with offline fallback.
 * @param page page number (1-based)
 * @param pageSize items per page (optional; depends on API support)
 * @returns array of articles (or empty array)
 */
export async function fetchNews(page = 1, pageSize = 20) {
  try {
    // newsdata.io supports `page` — avoid sending pageSize which some plans/APIs reject
    const url = `${BASE_URL}&page=${page}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.results && Array.isArray(data.results)) {
      // Cache the fetched feed
      await cacheFeed(data.results);
      return data.results;
    }

    console.warn("API returned unexpected format:", data);
    return [];
  } catch (err: any) {
    // Improved error handling: if the API rejects pagination (422), retry without `page`
    if (err?.response) {
      console.log('API fetch error:', err.response.status, err.response.data);

      if (err.response.status === 422) {
        try {
          console.log('Retrying without page parameter (fallback)');
          const fallbackRes = await axios.get(BASE_URL);
          const fallbackData = fallbackRes.data;
          if (fallbackData?.results && Array.isArray(fallbackData.results)) {
            // Cache the fallback results
            await cacheFeed(fallbackData.results);
            return fallbackData.results;
          }
          console.warn('Fallback returned unexpected format:', fallbackData);
          return [];
        } catch (fallbackErr: any) {
          console.log('Fallback request failed:', fallbackErr?.response?.status || fallbackErr?.message || fallbackErr);
          // If both API and fallback fail, try to load cached feed
          const cached = await getCachedFeed();
          return cached || [];
        }
      }
    } else {
      console.log('API fetch error:', err?.message || err);
      // Network error (no response) — try cached feed
      const cached = await getCachedFeed();
      return cached || [];
    }
    return [];
  }
}
