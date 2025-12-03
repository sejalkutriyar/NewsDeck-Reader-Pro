import React, { useEffect, useRef } from "react";
import { Text, Pressable, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

interface CategoryPillProps {
    name: string;
    isSelected: boolean;
    onPress: () => void;
}

export default function CategoryPill({ name, isSelected, onPress }: CategoryPillProps) {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isSelected ? 1.1 : 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, [isSelected]);

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                style={[
                    styles.pill,
                    {
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        { color: isSelected ? "#fff" : theme.text },
                    ]}
                >
                    {name}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "transparent", // or theme.border
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    text: {
        fontWeight: "600",
        fontSize: 14,
    },
});
