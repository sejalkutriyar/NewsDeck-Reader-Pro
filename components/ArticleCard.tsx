import React, { useEffect, useRef } from "react";
import { View, Text, Image, Pressable, Animated, StyleSheet } from "react-native";
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
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
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
          <Image source={{ uri: imageUrl }} style={styles.image} />
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
