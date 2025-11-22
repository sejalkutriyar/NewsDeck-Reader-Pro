// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { StatusBar } from "expo-status-bar";

function NavigationStack() {
  const { mode } = useTheme(); // for dynamic status bar style

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Article details screen */}
        <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigationStack />
    </ThemeProvider>
  );
}
