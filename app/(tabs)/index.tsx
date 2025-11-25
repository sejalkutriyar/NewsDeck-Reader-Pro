import React, { useState, useMemo } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import { articles } from "@/utils/mockData";


export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [search, setSearch] = useState("");

  // Optimized filtering
  const filteredArticles = useMemo(() => {
    if (!search.trim()) return articles;

    return articles.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <Text style={[styles.heading, { color: theme.text }]}>NewsDeck Feed</Text>

      <SearchBar value={search} onChange={setSearch} />

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArticleCard
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: theme.secondaryText }}>
            No articles found ❌
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});
