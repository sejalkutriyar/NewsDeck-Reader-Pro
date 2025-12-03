import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { LightTheme, DarkTheme } from "./colors";

type ThemeType = "light" | "dark";

const ThemeContext = createContext({
  theme: LightTheme,
  mode: "light" as ThemeType,
  toggleTheme: () => { },
  fontSize: 16,
  setFontSize: (size: number) => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  const [mode, setMode] = useState<ThemeType>("light");
  const [fontSize, setFontSizeState] = useState<number>(16);

  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await AsyncStorage.getItem("app_theme");
      if (savedTheme) setMode(savedTheme as ThemeType);
      else {
        const system = Appearance.getColorScheme();
        setMode(system === "dark" ? "dark" : "light");
      }

      const savedFontSize = await AsyncStorage.getItem("app_font_size");
      if (savedFontSize) {
        const parsed = parseInt(savedFontSize, 10);
        if (!isNaN(parsed)) {
          setFontSizeState(parsed);
        } else {
          // Reset to default if invalid (e.g. legacy "medium" string)
          setFontSizeState(16);
          AsyncStorage.setItem("app_font_size", "16");
        }
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    await AsyncStorage.setItem("app_theme", next);
  };

  const setFontSize = async (size: number) => {
    setFontSizeState(size);
    await AsyncStorage.setItem("app_font_size", String(size));
  };

  const theme = mode === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};
