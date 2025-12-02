import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ArticleCard from "../../components/ArticleCard";
import { getSavedArticles, removeArticle } from "../../utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { SavedStyles } from "@/styles/SavedStyles";

export default function SavedScreen() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);

  const loadSaved = async () => {
    const data = await getSavedArticles();
    setSavedArticles(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  return (
    <SafeAreaView style={SavedStyles.container}>
      <Text style={SavedStyles.heading}>❤️ Saved Articles</Text>

      <FlatList
        data={savedArticles}
        keyExtractor={(item, index) => {
          const id = item.article_id || item.id || '';
          return `saved-${id}-${index}`;
        }}
        renderItem={({ item }) => (
          <View style={SavedStyles.itemContainer}>
            <ArticleCard
              title={item.title}
              description={item.description}
              imageUrl={item.image_url || item.imageUrl}
              onPress={() => {
                console.log("Opening saved article:", item.title);
                router.push({ pathname: '/article/[id]', params: { id: item.article_id || item.id, article: JSON.stringify(item) } });
              }}
            />

            <Pressable
              style={SavedStyles.deleteBtn}
              onPress={() =>
                Alert.alert("Remove", "Delete this saved article?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                      await removeArticle(item.article_id || item.id);
                      loadSaved();
                    },
                  },
                ])
              }
            >
              <Text style={SavedStyles.deleteText}>🗑 Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={SavedStyles.emptyText}>No Saved Articles Yet 😕</Text>
        }
      />
    </SafeAreaView>
  );
}
