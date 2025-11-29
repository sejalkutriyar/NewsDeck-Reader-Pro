// app/(tabs)/index.tsx

import React, { useEffect, useCallback, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import { fetchNews } from "@/utils/newsApi";

interface Article {
  title?: string;
  description?: string;
  image_url?: string;
  article_id?: string;
  [key: string]: any;
}

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

  const [category, setCategory] = useState("all");
  const [news, setNews] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [isOfflineCache, setIsOfflineCache] = useState(false);

  // LOAD NEWS (supports category + pagination)
  const loadNews = useCallback(
    async (pageToLoad = 1, replace = false) => {
      try {
        if (pageToLoad === 1) setLoading(true);
        else setLoadingMore(true);

        const items = await fetchNews(pageToLoad, category);
        const isFromCache = items.length > 0 && pageToLoad === 1;
        setIsOfflineCache(isFromCache);
        
        const more = items.length >= 10;

        if (replace) setNews(items);
        else setNews((prev) => [...prev, ...items]);

        setHasMore(more);
        setPage(pageToLoad);
      } catch (error) {
        console.log("Load error", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [category]
  );

  // Reload data when category changes
  useEffect(() => {
    loadNews(1, true);
  }, [loadNews]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadNews(1, true);
  };

  // Infinite loadMore
  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      loadNews(page + 1, false);
    }
  };

  // Search filtering
  const filteredArticles = news.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>NewsDeck Feed</Text>

      {/* 🔍 Search Bar */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />

      {/* CATEGORY BAR */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCategory(item.key);
                loadNews(1, true);
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

      {/* 🔄 Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item, index) => {
              // Combine article_id + title + index to ensure uniqueness
              const id = item.article_id || item.title || '';
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
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color={theme.text} />
              ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <Text style={{ color: theme.secondaryText, textAlign: "center", marginTop: 50 }}>
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
  offlineIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
