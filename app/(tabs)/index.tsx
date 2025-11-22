import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/utils/mockData";

export default function FeedScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        NewsDeck Feed
      </Text>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <ArticleCard
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});
