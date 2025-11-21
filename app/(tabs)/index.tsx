import React from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/utils/mockData";
import { getSavedArticles } from "@/utils/storage";
import { FeedStyles } from "@/styles/FeedStyles";

export default function FeedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={FeedStyles.container}>
      <Text style={FeedStyles.heading}>NewsDeck Feed</Text>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
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
