import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, Share, Alert } from "react-native";
import * as Speech from "expo-speech";            // 🔊 For Text-to-Speech (TTS)
import { useLocalSearchParams, useRouter } from "expo-router"; // For getting params + back navigation
import { saveArticle } from "@/utils/storage";    // ❤️ To save article in AsyncStorage
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticleDetailsScreen() {
  // Article data FeedScreen se params me aa raha hai
  const { article } = useLocalSearchParams();
  const router = useRouter();

  // Screen se bahar jaate hi TTS ko stop kar dete hain
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Agar article nahi mila to message
  if (!article) return <Text>No Article Found</Text>;

  // Article ko string se object me convert karna
  const articleStr = typeof article === "string" ? article : article[0];
  const data = JSON.parse(articleStr);

  // Text-to-Speech start function
  const speak = () => {
    Speech.speak(data?.description || "");
  };

  // Text-to-Speech stop function
  const stopSpeak = () => {
    Speech.stop();
  };

  // Share Article
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
      
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        {/* Article Image */}
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

        {/* Title */}
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

        {/* Description */}
        <Text style={{ fontSize: 16, color: "#333", lineHeight: 24 }}>
          {data.description}
        </Text>

        <View style={{ height: 60 }} />  {/* Space for floating buttons */}
      </ScrollView>

      {/* Floating action buttons */}
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
            stopSpeak();     // Leaving screen → Stop speaking
            router.back();   // Go back to previous screen
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
