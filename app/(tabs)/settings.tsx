import React from "react";
import { View, Text, Switch, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";
import { SettingsStyles } from "@/styles/SettingsStyles";

export default function SettingsScreen() {
  const { mode, toggleTheme, theme, fontSize, setFontSize } = useTheme();

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

      {/* FONT SIZE SELECTOR */}
      <View style={[SettingsStyles.row, { marginTop: 20 }]}>
        <Text style={[SettingsStyles.label, { color: theme.text }]}>
          Font Size 🔠
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Pressable
            onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            style={{
              width: 40,
              height: 40,
              backgroundColor: theme.card,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.secondaryText
            }}
          >
            <Text style={{ fontSize: 24, color: theme.text, lineHeight: 28 }}>-</Text>
          </Pressable>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, minWidth: 30, textAlign: 'center' }}>
            {fontSize}
          </Text>

          <Pressable
            onPress={() => setFontSize(Math.min(30, fontSize + 2))}
            style={{
              width: 40,
              height: 40,
              backgroundColor: theme.card,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.secondaryText
            }}
          >
            <Text style={{ fontSize: 24, color: theme.text, lineHeight: 28 }}>+</Text>
          </Pressable>
        </View>
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
