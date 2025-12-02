import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, Share, Alert } from "react-native";
import * as Speech from "expo-speech";            // 🔊 For Text-to-Speech (TTS)
import { useLocalSearchParams, useRouter } from "expo-router"; // For getting params + back navigation
import { saveArticle } from "@/utils/storage";    // ❤️ To save article in AsyncStorage
import { SafeAreaView } from "react-native-safe-area-context";
import { ArticleStyles } from "@/styles/ArticleStyles";

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

  // Safely parse the incoming `article` param. expo-router sometimes passes
  // a JSON string, an object, or an array containing a JSON string.
  const parseArticleParam = (param: any) => {
    try {
      if (!param) return null;
      if (typeof param === "string") {
        // Try parse JSON string, otherwise return as text-only object
        try {
          return JSON.parse(param);
        } catch {
          return { title: String(param) };
        }
      }
      if (Array.isArray(param)) {
        if (param.length === 0) return null;
        const first = param[0];
        if (typeof first === "string") {
          try {
            return JSON.parse(first);
          } catch {
            return { title: String(first) };
          }
        }
        return first;
      }
      if (typeof param === "object") return param;
      return null;
    } catch {
      return null;
    }
  };

  const parsed = parseArticleParam(article);
  // Debug logs to help identify invalid values causing Text rendering errors

  if (!parsed) return <Text>{`No Article Found`}</Text>;

  // Normalize fields to strings so Text components never receive undefined/null
  const toStr = (v: any) => (v === null || v === undefined ? "" : String(v));
  const data = parsed as Record<string, any>;
  const title = toStr(data.title ?? data.headline ?? data.name);
  const description = toStr(
    data.description ?? data.summary ?? data.content ?? data.desc
  );

  const imageUrl = toStr(
    data.image_url ?? data.imageUrl ?? data.image ?? data.thumbnail
  );

  // Text-to-Speech start function — accepts text to speak
  const speak = (text?: string) => {
    Speech.speak(text || "");
  };

  // Text-to-Speech stop function
  const stopSpeak = () => {
    Speech.stop();
  };

  // Share Article — accepts title and description
  const shareArticle = async (title?: string, desc?: string) => {
    try {
      await Share.share({
        message: `${title || ""}\n\n${desc || ""}`,
      });
    } catch (error) {
      console.log("Share error: ", error);
    }
  };

  return (
    <SafeAreaView style={ArticleStyles.safeArea}>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={ArticleStyles.scrollContent}>

        {/* Article Image */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={ArticleStyles.image}
          />
        ) : null}

        {/* Title */}
        <Text style={ArticleStyles.title}>
          {`${title}`}
        </Text>

        {/* Description */}
        <Text style={ArticleStyles.description}>
          {`${description}`}
        </Text>

        {/* Space for floating buttons */}
        <View style={ArticleStyles.spacer} />
      </ScrollView>

      {/* Floating action buttons */}
      <View style={ArticleStyles.floatingContainer}>
        {/* Speak Button */}
        <Pressable
          onPress={() => speak(description)}
          style={[ArticleStyles.floatingButton, ArticleStyles.speakButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`🔊`}</Text>
        </Pressable>

        {/* Save Button */}
        <Pressable
          onPress={async () => {
            const ok = await saveArticle(parsed);
            if (ok) {
              Alert.alert("Success", "Article saved! ❤️");
            } else {
              Alert.alert("Info", "Already saved ✔");
            }
          }}
          style={[ArticleStyles.floatingButton, ArticleStyles.saveButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`❤️`}</Text>
        </Pressable>

        {/* Share Button */}
        <Pressable
          onPress={() => shareArticle(title, description)}
          style={[ArticleStyles.floatingButton, ArticleStyles.shareButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`📤`}</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          onPress={() => {
            console.log("Navigating back from article");
            stopSpeak();     // Leaving screen → Stop speaking
            router.back();   // Go back to previous screen
          }}
          style={[ArticleStyles.floatingButton, ArticleStyles.backButton]}
        >
          <Text style={ArticleStyles.backButtonText}>{`⬅`}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
