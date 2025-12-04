import React, { useEffect, useCallback, useState } from "react";
import {FlatList, Text, ActivityIndicator, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

import ArticleCard from "@/components/ArticleCard";
import CategoryPill from "@/components/CategoryPill";
import SearchBar from "@/components/SearchBar";
import { fetchNews } from "@/utils/newsApi";
import { FeedStyles } from "@/styles/FeedStyles";

interface Article {
  title?: string;
  description?: string;
  image_url?: string;
  article_id?: string;
  [key: string]: any;
}

// All category options
const CATEGORIES = [
  { name: "All", key: "all" },
  { name: "Business", key: "business" },
  { name: "Technology", key: "technology" },
  { name: "Sports", key: "sports" },
  { name: "Entertainment", key: "entertainment" },
  { name: "Politics", key: "politics" },
];

export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // fallback theme for safety
  const safeTheme = theme || {
    background: "#F5F6FA",
    text: "#1C1C1E",
    secondaryText: "#6E6E73",
    primary: "#007BFF",
    card: "#FFFFFF",
  };

  // UI + Fetch states
  const [category, setCategory] = useState("all");
  const [news, setNews] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [isOfflineCache, setIsOfflineCache] = useState(false);

  const PAGE_SIZE = 10; // news API returns ~10 per page

  // Load news (called on category/page refresh)
  const loadNews = useCallback(
    async (pageToLoad = 1, replace = false) => {
      try {
        if (pageToLoad === 1 && !replace) setLoading(true);
        if (pageToLoad > 1) setLoadingMore(true);

        const items = await fetchNews(pageToLoad, category);

        // offline indicator
        const isFromCache = items.length > 0 && pageToLoad === 1;
        setIsOfflineCache(isFromCache);

        const more = items.length >= PAGE_SIZE;

        if (replace) {
          setNews(items);
        } else {
          setNews((prev) =>
            pageToLoad === 1 ? items : [...prev, ...items]
          );
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
    [category]
  );

  // Load whenever category changes
  useEffect(() => {
    loadNews(1, true);
  }, [loadNews]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews(1, true);
  }, [loadNews]);

  // Infinite scroll load
  const onEndReached = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      loadNews(page + 1, false);
    }
  }, [loading, loadingMore, hasMore, loadNews, page]);

  // Search filter (safe array fallback)
  const filtered = (news ?? []).filter((item) => {
    const t = String(item.title || "").toLowerCase();
    const d = String(item.description || "").toLowerCase();
    const q = search.toLowerCase();
    return t.includes(q) || d.includes(q);
  });

  return (
    <SafeAreaView
      style={[FeedStyles.container, { backgroundColor: safeTheme.background }]}
    >
      <Text style={[FeedStyles.heading, { color: safeTheme.text }]}>NewsDeck Feed</Text>

      <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />

      {/* CATEGORY SELECTOR */}
      <View style={FeedStyles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <CategoryPill
              name={item.name}
              isSelected={category === item.key}
              onPress={() => setCategory(item.key)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
        />
      </View>

      {/* LOADING INDICATOR */}
      {loading ? (
        <ActivityIndicator size="large" color={safeTheme.text} style={FeedStyles.loader} />
      ) : (
        <>
          {isOfflineCache && (
            <View
              style={[FeedStyles.offlineIndicator, { backgroundColor: safeTheme.primary }]}
            >
              <Text style={FeedStyles.offlineText}>
                📡 Showing cached content (offline mode)
              </Text>
            </View>
          )}

          <FlatList
            style={{ flex: 1 }}
            data={filtered}
            keyExtractor={(item, index) => `${item.article_id ?? item.title}-${index}`}
            renderItem={({ item }) => (
              <ArticleCard
                title={item.title ?? "Untitled"}
                description={item.description ?? ""}
                imageUrl={item.image_url}
                onPress={() => {
                  console.log("Opening article:", item.title);
                  router.push({
                    pathname: "/article/[id]",
                    params: {
                      id: String(item.article_id ?? "unknown"),
                      article: JSON.stringify(item),
                    },
                  });
                }}
              />
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            contentContainerStyle={FeedStyles.listContent}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color={safeTheme.text} style={FeedStyles.footerLoader} />
              ) : null
            }
            ListEmptyComponent={
              <Text style={[FeedStyles.emptyText, { color: safeTheme.secondaryText }]}>
                No articles found ❌
              </Text>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}
