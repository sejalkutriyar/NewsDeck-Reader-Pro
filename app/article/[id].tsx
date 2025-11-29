import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, Share, Alert } from "react-native";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { saveArticle } from "@/utils/storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticleDetailsScreen() {
  const { article } = useLocalSearchParams();
  const router = useRouter();

  // stop TTS when leaving screen - must be called before early return
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (!article) return <Text>No Article Found</Text>;

  // parse incoming article from FeedScreen
  const articleStr = typeof article === 'string' ? article : article[0];
  const data = JSON.parse(articleStr);

  const speak = () => {
    Speech.speak(data?.description || "");
  };

  const stopSpeak = () => {
    Speech.stop();
  };

  const shareArticle = async () => {
    try {
      await Share.share({
        message: `${data?.title}\n\n${data?.description}`,
      });
    } catch (error) {
      console.log("Share error: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {data.image_url && (
          <Image
            source={{ uri: data.image_url }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              backgroundColor: "#ccc",
            }}
          />
        )}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            marginVertical: 12,
            color: "#1A1A1A",
          }}
        >
          {data.title}
        </Text>

        <Text style={{ fontSize: 16, color: "#333", lineHeight: 24 }}>
          {data.description}
        </Text>

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
        {/* Speak */}
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

        {/* Save */}
        <Pressable
          onPress={async () => {
            const ok = await saveArticle(data);
            if (ok) {
              Alert.alert("Success", "Article saved! ❤️");
            } else {
              Alert.alert("Info", "Already saved ✔");
            }
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

        {/* Share */}
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

        {/* Back */}
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
