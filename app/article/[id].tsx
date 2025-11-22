import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, Share } from 'react-native';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { articles as mockData } from '@utils/mockData';
import { saveArticle } from '@utils/storage';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const article = mockData.find((item) => item.id.toString() === id);

  const speak = () => {
    Speech.speak(article?.description || "");
  };

  const stopSpeak = () => {
    Speech.stop();
  };

  const shareArticle = async () => {
    try {
      await Share.share({
        message: `${article?.title}\n\n${article?.description}`,
      });
    } catch (error) {
      console.log("Share error: ", error);
    }
  };

  useEffect(() => {
    return () => Speech.stop(); // stop speaking when leaving screen
  }, []);

  if (!article) return <Text>Article Not Found</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        <Image
          source={{ uri: article.imageUrl }}
          style={{ width: "100%", height: 250, borderRadius: 12 }}
        />

        <Text style={{ fontSize: 28, fontWeight: "800", marginVertical: 12, color: "#1A1A1A" }}>
          {article.title}
        </Text>

        <Text style={{ fontSize: 16, color: "#333", lineHeight: 24 }}>
          {article.description.repeat(6)}
        </Text>

        {/* Buttons */}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 25,
          right: 20,
          gap: 12,
        }}
      >
        {/* Speak Button */}
        <Pressable
          onPress={speak}
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            backgroundColor: "#007BFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, color: "#fff" }}>🔊</Text>
        </Pressable>

        {/* Save Button */}
        <Pressable
          onPress={async () => {
            const ok = await saveArticle(article);
            alert(ok ? "Saved ❤️" : "Already Saved ✔");
          }}
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            backgroundColor: "crimson",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, color: "#fff" }}>❤️</Text>
        </Pressable>

        {/* Share Button */}
        <Pressable
          onPress={shareArticle}
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            backgroundColor: "#222",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22, color: "#fff" }}>📤</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          onPress={() => {
            stopSpeak();
            router.back();
          }}
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            backgroundColor: "#444",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>⬅</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
