import React, { useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { articles as mockData } from '../../utils/mockData';

export default function ArticleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const article = mockData.find((item) => item.id === id);

  const speak = () => {
    Speech.speak(article?.description || '');
  };

  useEffect(() => {
    return () => {
      Speech.stop(); // Stop when leaving screen
    };
  }, []);

  return (
    <View style={{ padding: 16 }}>
      {article ? (
        <>
          <Image source={{ uri: article.imageUrl }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 12 }}>{article.title}</Text>
          <Text style={{ marginBottom: 20 }}>{article.description}</Text>

          <Pressable
            onPress={speak}
            style={{ backgroundColor: 'green', padding: 12, borderRadius: 8, marginBottom: 10 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>🔊 SPEAK</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{ backgroundColor: '#007bff', padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>⬅ BACK</Text>
          </Pressable>
        </>
      ) : (
        <Text>Article Not Found</Text>
      )}
    </View>
  );
}
