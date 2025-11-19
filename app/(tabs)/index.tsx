import React from "react";
import { SafeAreaView, FlatList, Text } from "react-native";
import { useRouter } from "expo-router";
import ArticleCard from "../../components/ArticleCard";
import { articles } from "../../utils/mockData";
import { FeedStyles } from "../styles/FeedStyles";

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
