// utils/newsApi.ts
// Handles all News API calls + Offline Caching + Fallbacks

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your API Key
const API_KEY = "pub_c9107702fbf34dc18a975e1455c8e015";

// Base URL for API
const BASE_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=in&language=en`;

// Cache valid for 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

// When API returns 429 (Rate Limit)
const RATE_LIMIT_KEY = "rate_limit_reset";

// Generate cache keys for each category
// Example: feed_cache_sports, feed_cache_expiry_sports
function getCacheKeys(category: string) {
  return {
    dataKey: `feed_cache_${category}`,
    expiryKey: `feed_cache_expiry_${category}`,
  };
}

// Save API results to category-specific cache
async function cacheFeed(category: string, articles: any[]) {
  try {
    const keys = getCacheKeys(category);
    const now = Date.now();

    await AsyncStorage.multiSet([
      [keys.dataKey, JSON.stringify(articles)],
      [keys.expiryKey, now.toString()],
    ]);

    console.log(`📦 Cached ${category} articles successfully`);
  } catch (err) {
    console.warn("Cache error:", err);
  }
}

// Load cached data for that category
async function getCachedFeed(category: string) {
  try {
    const keys = getCacheKeys(category);
    const [data, expiry] = await AsyncStorage.multiGet([
      keys.dataKey,
      keys.expiryKey,
    ]);

    if (!data[1] || !expiry[1]) return null;

    const now = Date.now();
    const lastSaved = Number(expiry[1]);

    // Cache expired?
    if (now - lastSaved > CACHE_DURATION) {
      console.log(`⚠ Cache expired for ${category}`);
      return null;
    }

    const parsed = JSON.parse(data[1]);
    console.log(`📡 Loaded cached ${category} (${parsed.length} articles)`);

    return parsed;
  } catch (err) {
    console.warn("Cache read error:", err);
    return null;
  }
}

// Check if user is temporarily rate limited (429 error)
async function isRateLimited() {
  try {
    const resetTime = await AsyncStorage.getItem(RATE_LIMIT_KEY);
    if (!resetTime) return false;

    const now = Date.now();
    const reset = Number(resetTime);

    if (now < reset) {
      const waitSec = Math.ceil((reset - now) / 1000);
      console.log(`⛔ Rate Limited — wait ${waitSec}s`);
      return true;
    }

    // Rate limit expired -> remove
    await AsyncStorage.removeItem(RATE_LIMIT_KEY);
    return false;
  } catch {
    return false;
  }
}

// Save new rate limit time
async function setRateLimit(waitSeconds = 60) {
  const resetTime = Date.now() + waitSeconds * 1000;
  await AsyncStorage.setItem(RATE_LIMIT_KEY, resetTime.toString());
  console.log(`⏳ Rate limit set for ${waitSeconds}s`);
}

// Main API Fetch Function (with category + fallback + cache)
export async function fetchNews(page = 1, category = "all") {
  // If rate limited → return cached
  if (await isRateLimited()) {
    const cached = await getCachedFeed(category);
    return cached || [];
  }

  try {
    // Build request URL
    let url = `${BASE_URL}&page=${page}`;
    if (category !== "all") {
      url += `&category=${category}`;
    }

    console.log("🌍 Fetching online:", url);

    const response = await axios.get(url, { timeout: 10000 });
    const results = response.data?.results || [];

    // Save into category cache
    if (results.length > 0) {
      await cacheFeed(category, results);
    }

    return results;
  } catch (err: any) {
    const status = err?.response?.status;

    // Handle 429 (Rate Limit)
    if (status === 429) {
      const retry = err.response?.headers?.["retry-after"];
      const waitTime = retry ? parseInt(retry) : 60;
      await setRateLimit(waitTime);

      const cached = await getCachedFeed(category);
      return cached || [];
    }

    // Handle 422 (Pagination unsupported)
    if (status === 422) {
      try {
        console.log("⚠ 422 received — retrying without page param");

        let fallbackUrl = BASE_URL;
        if (category !== "all") fallbackUrl += `&category=${category}`;

        const fallbackRes = await axios.get(fallbackUrl);
        const fallbackResults = fallbackRes.data?.results || [];

        if (fallbackResults.length > 0) {
          await cacheFeed(category, fallbackResults);
          return fallbackResults;
        }
      } catch {
        const cached = await getCachedFeed(category);
        return cached || [];
      }
    }

    // Any other error -> offline mode
    console.log("❌ API failed — loading cache...");
    const cached = await getCachedFeed(category);
    return cached || [];
  }
}
