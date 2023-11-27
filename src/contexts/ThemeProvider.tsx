import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
export type ThemeType = keyof typeof themes;
const themes = {
  standard: { dark: "bg-black", light: "bg-white" },
  red: { dark: "bg-red-600", light: "bg-red-100" },
  camo: { dark: "bg-orange-700", light: "bg-green-700" },
  blue: { dark: "bg-blue-600", light: "bg-blue-100" },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeType>(() => {
    const storedThemeName = getCurrentTheme();
    return storedThemeName || "standard";
  });

  useEffect(() => {
    localStorage.setItem("chessTheme", themeName);
  }, [themeName]);

  const themeChoices = Object.keys(themes) as ThemeType[];
  function getCurrentTheme() {
    return localStorage.getItem("chessTheme") as ThemeType;
  }
  const value = {
    theme: themes[themeName],
    setTheme: setThemeName,
    themeChoices,
    currentTheme: getCurrentTheme(),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
