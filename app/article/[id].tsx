import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Share, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // For getting params + back navigation
import * as Linking from 'expo-linking';
import { saveArticle, getSavedArticle } from "@/utils/storage";    // ❤️ To save article in AsyncStorage
import { SafeAreaView } from "react-native-safe-area-context";
import { ArticleStyles } from "@/styles/ArticleStyles";
import { useTheme } from "@/theme/ThemeContext";
import { useTTS } from "@/utils/TTSContext";
import { SharePreviewModal } from "@/components/SharePreviewModal";

export default function ArticleDetailsScreen() {
  // Article data FeedScreen se params me aa raha hai
  const { article } = useLocalSearchParams();
  const router = useRouter();
  const { play, addToQueue } = useTTS();
  const [shareModalVisible, setShareModalVisible] = useState(false);

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
  const [articleData, setArticleData] = useState<any>(parsed);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (parsed) {
      setArticleData(parsed);
      const id = parsed.article_id || parsed.id;
      if (id) {
        getSavedArticle(String(id)).then((saved) => {
          if (saved) {
            setArticleData((prev: any) => ({ ...prev, ...saved }));
          }
        });
      }
    }
  }, [article]);

  // Debug logs to help identify invalid values causing Text rendering errors

  if (!articleData) return <Text>{`No Article Found`}</Text>;

  // Normalize fields to strings so Text components never receive undefined/null
  const toStr = (v: any) => (v === null || v === undefined ? "" : String(v));
  const data = articleData as Record<string, any>;
  const title = toStr(data.title ?? data.headline ?? data.name);
  const description = toStr(
    data.description ?? data.summary ?? data.content ?? data.desc
  );

  const imageUrl = toStr(
    data.image_url ?? data.imageUrl ?? data.image ?? data.thumbnail
  );

  // Share Article — accepts title and description
  const shareArticle = async (title?: string, desc?: string) => {
    try {
      // Create a deep link to this article
      const id = data.article_id || data.id;
      const link = Linking.createURL(`article/${id}`);

      await Share.share({
        message: `${title || ""}\n\n${desc || ""}\n\nRead more: ${link}`,
      });
    } catch (error) {
      console.log("Share error: ", error);
    }
  };

  const { theme, fontSize } = useTheme();

  const getFontSize = (baseSize: number) => {
    // baseSize is assumed to be designed for "16px" standard
    // scale = current / 16
    const scale = fontSize / 16;
    return baseSize * scale;
  };

  return (
    <SafeAreaView style={ArticleStyles.safeArea}>
      <SharePreviewModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        article={articleData}
      />

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={ArticleStyles.scrollContent}>

        {/* Article Image */}
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={ArticleStyles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[ArticleStyles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 60 }}>📰</Text>
          </View>
        )}

        {/* Title */}
        <Text style={[ArticleStyles.title, { fontSize: getFontSize(24), lineHeight: getFontSize(32) }]}>
          {`${title}`}
        </Text>

        {/* Description */}
        <Text style={[ArticleStyles.description, { fontSize: getFontSize(16), lineHeight: getFontSize(24) }]}>
          {`${description}`}
        </Text>

        {/* Offline Content */}
        {data.offline_content ? (
          <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8, fontSize: getFontSize(16) }}>📖 Offline Reading Mode</Text>
            <Text style={[ArticleStyles.description, { fontSize: getFontSize(16), lineHeight: getFontSize(24) }]}>
              {data.offline_content}
            </Text>
          </View>
        ) : null}

        {/* Space for floating buttons */}
        <View style={ArticleStyles.spacer} />
      </ScrollView>

      {/* Floating action buttons */}
      <View style={ArticleStyles.floatingContainer}>
        {/* Play Button */}
        <Pressable
          onPress={() => play(articleData)}
          style={[ArticleStyles.floatingButton, ArticleStyles.speakButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`▶️`}</Text>
        </Pressable>

        {/* Queue Button */}
        <Pressable
          onPress={() => {
            addToQueue(articleData);
            if (Platform.OS === 'web') {
              window.alert("Added to queue 🎵");
            } else {
              Alert.alert("Added to queue 🎵");
            }
          }}
          style={[ArticleStyles.floatingButton, { backgroundColor: '#9C27B0' }]}
        >
          <Text style={ArticleStyles.buttonText}>{`➕`}</Text>
        </Pressable>

        {/* Save Button */}
        <Pressable
          onPress={async () => {
            const ok = await saveArticle(articleData);
            if (ok) {
              if (Platform.OS === 'web') {
                window.alert("Article saved! ❤️");
              } else {
                Alert.alert("Success", "Article saved! ❤️");
              }
            } else {
              if (Platform.OS === 'web') {
                window.alert("Already saved ✔");
              } else {
                Alert.alert("Info", "Already saved ✔");
              }
            }
          }}
          style={[ArticleStyles.floatingButton, ArticleStyles.saveButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`❤️`}</Text>
        </Pressable>

        {/* Share Image Button */}
        <Pressable
          onPress={() => setShareModalVisible(true)}
          style={[ArticleStyles.floatingButton, { backgroundColor: '#FF9800' }]}
        >
          <Text style={ArticleStyles.buttonText}>{`📸`}</Text>
        </Pressable>

        {/* Share Link Button */}
        <Pressable
          onPress={() => shareArticle(title, description)}
          style={[ArticleStyles.floatingButton, ArticleStyles.shareButton]}
        >
          <Text style={ArticleStyles.buttonText}>{`🔗`}</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          onPress={() => {
            console.log("Navigating back from article");
            if (Platform.OS === 'web') {
              // Blur the active element to prevent "aria-hidden" warnings
              // when the screen transitions out while an element still has focus.
              (document.activeElement as HTMLElement)?.blur();
            }
            // stopSpeak(); // Don't stop on back, let it play!
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
