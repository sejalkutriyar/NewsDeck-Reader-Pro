import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import ArticleCard from '../../components/ArticleCard';
import { getSavedArticles, removeArticle } from '../../utils/storage';

export default function SavedScreen() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSaved = async () => {
    setRefreshing(true);
    try {
      const data = await getSavedArticles();
      setSavedArticles(data);
    } catch (err) {
      console.log('Load saved error', err);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>❤️ Saved Articles</Text>

      <FlatList
        data={savedArticles}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={loadSaved}
        renderItem={({ item }) => (
          <>
            <ArticleCard
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              onPress={() => router.push(`/article/${item.id}`)}
            />

            {/* Remove Button */}
            <Pressable
              style={styles.deleteBtn}
              onPress={() => {
                Alert.alert('Remove', 'Remove this saved article?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                      await removeArticle(item.id.toString());
                      loadSaved();
                    },
                  },
                ]);
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>🗑 Remove</Text>
            </Pressable>
          </>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Saved Articles 😕</Text>
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
    fontSize: 18,
    color: 'gray',
  },
  deleteBtn: {
    backgroundColor: '#222',
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
  },
});
