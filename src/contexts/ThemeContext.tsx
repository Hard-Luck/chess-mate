import { createContext } from "react";
import { ThemeType } from "./ThemeProvider";

export type ThemeContextType = {
  theme: { dark: string; light: string };
  setTheme: (themeName: ThemeType) => void;
  themeChoices: ThemeType[];
  currentTheme: ThemeType;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
