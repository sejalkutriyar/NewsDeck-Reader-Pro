// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { TTSProvider } from "@/utils/TTSContext";
import { MiniPlayer } from "@/components/MiniPlayer";

function NavigationStack() {
  const { mode } = useTheme(); // for dynamic status bar style

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs group */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />

        {/* Article details screen */}
        <Stack.Screen
          name="article/[id]"
          options={{
            headerShown: false,
            animation: "slide_from_right",
            presentation: "card",
            animationDuration: 400,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TTSProvider>
        <NavigationStack />
        <MiniPlayer />
      </TTSProvider>
    </ThemeProvider>
  );
}
