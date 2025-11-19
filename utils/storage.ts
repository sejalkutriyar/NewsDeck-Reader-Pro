import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'saved_articles';

export async function saveArticle(article: any) {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];

    const alreadySaved = existing.find((item: any) => item.id === article.id);
    if (alreadySaved) return; // avoid duplicates

    existing.push(article);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.log("Save Error: ", err);
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
