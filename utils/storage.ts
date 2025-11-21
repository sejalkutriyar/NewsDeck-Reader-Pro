import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'saved_articles';

export async function saveArticle(article: any) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];

    // Normalize id to string to keep comparisons consistent
    const normalized = { ...article, id: article.id?.toString() };

    const alreadySaved = existing.find((item: any) => item.id === normalized.id);
    if (alreadySaved) return false; // avoid duplicates

    existing.push(normalized);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return true;
  } catch (err) {
    console.log("Save Error: ", err);
    return false;
  }
}

export async function getSavedArticles() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function removeArticle(id: string) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const existing = stored ? JSON.parse(stored) : [];
  const filtered = existing.filter((item: any) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
