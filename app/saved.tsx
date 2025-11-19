import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ArticleCard from '../components/ArticleCard';
import { getSavedArticles } from '../utils/storage';

export default function SavedScreen() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSaved = async () => {
    const data = await getSavedArticles();
    setSavedArticles(data);
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Articles ❤️</Text>

      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadSaved} />
        }
        renderItem={({ item }) => (
          <ArticleCard
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/article/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            😕 No saved articles yet. Save one!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: 'gray',
  },
});
