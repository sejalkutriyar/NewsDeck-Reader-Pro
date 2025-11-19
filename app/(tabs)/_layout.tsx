import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Feed" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved ❤️" }} />
    </Tabs>
  );
}
