// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Article details screen */}
      <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
