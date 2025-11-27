import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";

import { fetchNews } from "@/utils/newsApi";

interface Article {
  title: string;
  description: string;
  image_url: string;
  article_id: string;
  [key: string]: any;
}

export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [news, setNews] = useState<Article[]>([]);        // 🔥 API data here
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch API on screen load
  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const data = await fetchNews();
      setNews(data || []);
      setLoading(false);
    }
    loadNews();
  }, []);

  // Filter logic
  const filteredArticles = news.filter((item) =>
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.heading, { color: theme.text }]}>
        NewsDeck Feed
      </Text>

      {/* 🔍 Search Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search articles..."
      />

      {/* // Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ArticleCard
              title={item.title}
              description={item.description}
              imageUrl={item.image_url}
              onPress={() => router.push({ pathname: '/article/[id]', params: { id: item.article_id || index, article: JSON.stringify(item) } })}
            />
          )}
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
    marginBottom: 16,
  },
});
