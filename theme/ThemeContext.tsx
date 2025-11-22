import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { LightTheme, DarkTheme } from "./colors";

type ThemeType = "light" | "dark";

const ThemeContext = createContext({
  theme: LightTheme,
  mode: "light" as ThemeType,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  const [mode, setMode] = useState<ThemeType>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("app_theme");
      if (saved) setMode(saved as ThemeType);
      else {
        const system = Appearance.getColorScheme();
        setMode(system === "dark" ? "dark" : "light");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    await AsyncStorage.setItem("app_theme", next);
  };

  const theme = mode === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
