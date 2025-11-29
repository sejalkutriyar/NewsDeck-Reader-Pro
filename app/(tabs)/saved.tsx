import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ArticleCard from "../../components/ArticleCard";
import { getSavedArticles, removeArticle } from "../../utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>❤️ Saved Articles</Text>

      <FlatList
        data={savedArticles}
        keyExtractor={(item, index) => {
          const id = item.article_id || item.id || '';
          return `saved-${id}-${index}`;
        }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <ArticleCard
              title={item.title}
              description={item.description}
              imageUrl={item.image_url || item.imageUrl}
              onPress={() => router.push({ pathname: '/article/[id]', params: { id: item.article_id || item.id, article: JSON.stringify(item) } })}
            />

            <Pressable
              style={styles.deleteBtn}
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
              <Text style={styles.deleteText}>🗑 Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Saved Articles Yet 😕</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2C3E50",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "gray",
  },
  deleteBtn: {
    marginTop: 6,
    backgroundColor: "#e63946",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});
