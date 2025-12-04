import React, { useEffect, useRef } from "react";
import { View, Text, Image, Pressable, Animated, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

interface ArticleCardProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  onPress?: () => void;
}

export default function ArticleCard({
  title,
  description = "",
  imageUrl,
  onPress,
}: ArticleCardProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  const safeDescription = String(description || "");
  const preview =
    safeDescription.length > 80
      ? safeDescription.substring(0, 80) + "..."
      : safeDescription;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Pressable onPress={onPress}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
        )}

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.desc, { color: theme.secondaryText }]}>
            {preview}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      }
    }),
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
