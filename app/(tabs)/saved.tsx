import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { getSavedArticles } from "../../utils/storage";
import ArticleCard from "../../components/ArticleCard";

export default function SavedScreen() {
  const [saved, setSaved] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadSaved = async () => {
    const data = await getSavedArticles();
    setSaved(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSaved();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Saved Articles ❤️
      </Text>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ marginTop: 20, color: "#666" }}>
            You have not saved anything yet! 📭
          </Text>
        }
      />
    </View>
  );
}
