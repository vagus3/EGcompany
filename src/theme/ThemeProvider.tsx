"use client";

import { createContext, useContext, type ReactNode } from "react";
import { corporateTheme, cx, terminalTheme } from "@/theme/classes";

const themes = {
  corporate: corporateTheme,
  terminal: terminalTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type AppTheme = (typeof themes)[ThemeName];

interface ThemeContextValue {
  name: ThemeName;
  classes: AppTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, theme }: { children: ReactNode; theme: ThemeName }) {
  return <ThemeContext value={{ name: theme, classes: themes[theme] }}>{children}</ThemeContext>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return value;
}

export function useCorporateTheme() {
  const value = useAppTheme();

  if (value.name !== "corporate") {
    throw new Error("useCorporateTheme must be used inside a corporate ThemeProvider");
  }

  return { name: value.name, classes: themes.corporate };
}

export function ThemedFrame({ children, className }: { children: ReactNode; className?: string }) {
  const { classes } = useAppTheme();

  return <div className={cx(className, classes.page)}>{children}</div>;
}
