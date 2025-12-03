import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadArticleContent } from './articleDownloader';

const STORAGE_KEY = 'saved_articles';

// Helper: get normalized ID from article (handles both 'id' and 'article_id')
function getArticleId(article: any): string {
  const id = article.article_id || article.id;
  return String(id);
}

export async function saveArticle(article: any) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];

    const articleId = getArticleId(article);

    // Check if already saved
    const alreadySaved = existing.find((item: any) => getArticleId(item) === articleId);
    if (alreadySaved) {
      console.log("Article already saved:", articleId);
      return false; // avoid duplicates
    }

    // 1. Save immediately without offline content
    const articleToSave = {
      ...article,
      offline_content: null, // initially null
      saved_at: new Date().toISOString(),
    };

    existing.push(articleToSave);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    console.log("Article saved (initial):", articleId);

    // 2. Trigger background download and update
    // We do NOT await this, so the UI gets immediate feedback
    downloadAndSaveContent(articleId, article.url || article.link);

    return true;
  } catch (err) {
    console.log("Save Error: ", err);
    return false;
  }
}

// Helper to download and update storage in the background
async function downloadAndSaveContent(id: string, url: string) {
  if (!url) return;
  try {
    console.log("Starting background download for:", id);
    const content = await downloadArticleContent(url);
    if (!content) return;

    // Re-read storage to ensure we don't overwrite other changes
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let currentArticles = stored ? JSON.parse(stored) : [];

    const index = currentArticles.findIndex((item: any) => getArticleId(item) === id);
    if (index !== -1) {
      currentArticles[index].offline_content = content;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentArticles));
      console.log("Background download completed for:", id);
    }
  } catch (err) {
    console.log("Background download failed:", err);
  }
}


export async function getSavedArticles() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const articles = stored ? JSON.parse(stored) : [];
    console.log("Retrieved saved articles:", articles.length);
    return articles;
  } catch (err) {
    console.log("Get Saved Error: ", err);
    return [];
  }
}

export async function removeArticle(id: string | number) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];

    const idToRemove = String(id);
    const filtered = existing.filter((item: any) => getArticleId(item) !== idToRemove);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log("Article removed:", idToRemove);
  } catch (err) {
    console.log("Remove Error: ", err);
  }
}

export async function clearAllArticles() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("All articles cleared");
  } catch (err) {
    console.log("Clear All Error: ", err);
  }
}

