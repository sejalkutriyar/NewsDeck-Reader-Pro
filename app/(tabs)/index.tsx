// app/(tabs)/index.tsx
import React, { useEffect, useCallback, useState } from "react";
import { FlatList, Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from "react-native";
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

export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [news, setNews] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); // initial loader
  const [refreshing, setRefreshing] = useState<boolean>(false); // pull-to-refresh
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // pagination loader
  const [hasMore, setHasMore] = useState<boolean>(true); // whether next page likely exists
  const [search, setSearch] = useState<string>("");
  const [isOfflineCache, setIsOfflineCache] = useState<boolean>(false); // flag for offline cache

  const PAGE_SIZE = 20; // adjust as needed

  // load page (replace = true => reset list)
  const loadNews = useCallback(
    async (pageToLoad = 1, replace = false) => {
      try {
        if (pageToLoad === 1 && !replace) setLoading(true);
        if (pageToLoad > 1) setLoadingMore(true);

        const items = await fetchNews(pageToLoad, PAGE_SIZE);
        
        // Check if items came from cache (simple heuristic: if fetch returns data despite network error)
        const isFromCache = items.length > 0 && pageToLoad === 1;
        setIsOfflineCache(isFromCache);

        // If API returns fewer items than PAGE_SIZE, assume no more pages
        const more = items.length >= PAGE_SIZE;

        if (replace) {
          setNews(items);
        } else {
          setNews((prev) => (pageToLoad === 1 ? items : [...prev, ...items]));
        }

        setHasMore(more);
        setPage(pageToLoad);
      } catch (err) {
        console.log("loadNews error", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // initial load
  useEffect(() => {
    loadNews(1, true);
  }, [loadNews]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews(1, true);
  }, [loadNews]);

  // Load more when reaching end
  const onEndReached = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    loadNews(page + 1, false);
  }, [loadingMore, loading, hasMore, loadNews, page]);

  // Filtered list by search string
  const filtered = news.filter((item) => {
    const t = (item.title || "").toString().toLowerCase();
    const d = (item.description || "").toString().toLowerCase();
    const q = search.toLowerCase();
    return t.includes(q) || d.includes(q);
  });

  // Footer component for pagination loader
  const ListFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 12 }}>
        <ActivityIndicator size="small" color={theme.text} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>NewsDeck Feed</Text>

      <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />

      {loading && news.length === 0 ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      ) : (
        <>
          {isOfflineCache && (
            <View style={[styles.offlineIndicator, { backgroundColor: theme.primary }]}>
              <Text style={[styles.offlineText, { color: "#fff" }]}>
                📡 Showing cached content (offline mode)
              </Text>
            </View>
          )}
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => String(item.article_id ?? item.title ?? index)}
            renderItem={({ item }) => (
              <ArticleCard
                title={item.title ?? "Untitled"}
                description={item.description ?? ""}
                imageUrl={item.image_url ?? item.imageUrl ?? item.urlToImage ?? undefined}
                onPress={() =>
                  router.push({
                    pathname: "/article/[id]",
                    params: { 
                      id: String(item.article_id ?? item.title ?? "unknown"), 
                      article: JSON.stringify(item) 
                    },
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={<ListFooter />}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <Text style={{ color: theme.secondaryText, textAlign: "center", marginTop: 50 }}>
                No articles found ❌
              </Text>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
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
