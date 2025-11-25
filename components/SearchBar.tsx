import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Ionicons name="search" size={22} color={theme.secondaryText} />

      <TextInput
        placeholder="Search articles..."
        placeholderTextColor={theme.secondaryText}
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});
