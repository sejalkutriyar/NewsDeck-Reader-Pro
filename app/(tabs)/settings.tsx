import React from "react";
import { View, Text, Switch, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";
import { SettingsStyles } from "@/styles/SettingsStyles";

export default function SettingsScreen() {
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <SafeAreaView style={[SettingsStyles.container, { backgroundColor: theme.background }]}>

      <Text style={[SettingsStyles.heading, { color: theme.text }]}>
        Settings ⚙️
      </Text>

      {/* THEME SWITCH */}
      <View style={SettingsStyles.row}>
        <Text style={[SettingsStyles.label, { color: theme.text }]}>
          Dark Mode 🌙
        </Text>
        <Switch
          value={mode === "dark"}
          onValueChange={toggleTheme}
          trackColor={{ true: "#007BFF", false: "#ccc" }}
        />
      </View>

      {/* ABOUT SECTION */}
      <Text
        style={[
          SettingsStyles.subHeading,
          { color: theme.text, marginTop: 30 }
        ]}
      >
        About App ℹ️
      </Text>

      <Text style={[SettingsStyles.aboutText, { color: theme.secondaryText }]}>
        NewsDeck is a modern React Native news application built using:
        {"\n"}• Expo Router
        {"\n"}• Offline Caching
        {"\n"}• TTS Reader
        {"\n"}• Theme Switching
        {"\n"}• Category Filters
      </Text>

      <Pressable onPress={() => Linking.openURL("mailto:developer@email.com")}>
        <Text style={[SettingsStyles.link, { color: "#007BFF" }]}>
          📩 Contact Developer
        </Text>
      </Pressable>

      <Text style={[SettingsStyles.version, { color: theme.secondaryText }]}>
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}
