// app/(tabs)/index.tsx

import React, { useEffect, useCallback, useState } from "react";
import {FlatList,Text,StyleSheet,ActivityIndicator,View,TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import { fetchNews } from "@/utils/newsApi";

// Article type for safety
interface Article {
  title?: string;
  description?: string;
  image_url?: string;
  article_id?: string;
  [key: string]: any;
}

// Static list of categories for filtering
const CATEGORIES = [
  { name: "All", key: "all" },
  { name: "General", key: "general" },
  { name: "Business", key: "business" },
  { name: "Technology", key: "technology" },
  { name: "Sports", key: "sports" },
  { name: "Entertainment", key: "entertainment" },
  { name: "Politics", key: "politics" },
];

export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // STATES
  const [category, setCategory] = useState("all"); // selected category
  const [news, setNews] = useState<Article[]>([]); // all news items
  const [page, setPage] = useState(1); // pagination page
  const [loading, setLoading] = useState(true); // first load loader
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [loadingMore, setLoadingMore] = useState(false); // pagination loader
  const [hasMore, setHasMore] = useState(true); // more pages available?
  const [search, setSearch] = useState(""); // search input
  const [isOfflineCache, setIsOfflineCache] = useState(false); // if cache loaded

  // NEWS LOADER (Category + Pagination)
  const loadNews = useCallback(
    async (pageToLoad = 1, replace = false) => {
      try {
        // show loader depending on page
        if (pageToLoad === 1) setLoading(true);
        else setLoadingMore(true);

        // fetch data from API
        // passing page + category
        const items = await fetchNews(pageToLoad, category);

        // if API failed & cache loaded → isOffline = true
        const isFromCache = items.length > 0 && pageToLoad === 1;
        setIsOfflineCache(isFromCache);

        // if API returned < 10 items → no more pages
        const more = items.length >= 10;

        // replace list (for refresh/category change)
        if (replace) setNews(items);
        else setNews((prev) => [...prev, ...items]); // add more pages

        setHasMore(more);
        setPage(pageToLoad);
      } catch (error) {
        console.log("Load error", error);
      } finally {
        // stop loaders
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [category]
  );

  // Reload when category changes
  useEffect(() => {
    loadNews(1, true); // reset to page 1 whenever category changes
  }, [loadNews]);

  // 🔄 Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadNews(1, true); // reload page 1 fresh
  };

  // Infinite scroll (load more)
  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      loadNews(page + 1, false); // load next page
    }
  };

  // Search filter (client-side)
  const filteredArticles = news.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* PAGE TITLE */}
      <Text style={[styles.heading, { color: theme.text }]}>NewsDeck Feed</Text>

      {/* SEARCH BAR */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />

      {/* CATEGORY FILTER ROW */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCategory(item.key); // update selected category
                loadNews(1, true); // reload news fresh
              }}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    category === item.key ? theme.primary : theme.card,
                },
              ]}
            >
              <Text
                style={{
                  color: category === item.key ? "#fff" : theme.text,
                  fontWeight: "600",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* LOADING SPINNER */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => {
            // unique key generation
            const id = item.article_id || item.title || "";
            return `${id}-${index}`;
          }}
          renderItem={({ item }) => (
            <ArticleCard
              title={item.title ?? "Untitled"}
              description={item.description ?? ""}
              imageUrl={item.image_url}
              onPress={() =>
                router.push({
                  pathname: "/article/[id]",
                  params: {
                    id: String(item.article_id ?? "unknown"),
                    article: JSON.stringify(item),
                  },
                })
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={theme.text} />
            ) : null
          }
          ListEmptyComponent={
            <Text
              style={{
                color: theme.secondaryText,
                textAlign: "center",
                marginTop: 50,
              }}
            >
              No articles found ❌
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
});
