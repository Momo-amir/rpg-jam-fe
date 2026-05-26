"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

import type { Theme, ThemeContextType } from "./types";
import { defaultTheme, themeStorageKey, getImplicitPreference } from "./shared";
import { themeIsValid } from "./types";

export type { Theme } from "./types";
export { themes } from "./shared";

const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  setTheme: () => null,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(() => {
    if (typeof document === "undefined") return undefined;
    const stored = document.documentElement.getAttribute("data-theme");
    return themeIsValid(stored) ? stored : defaultTheme;
  });

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      localStorage.removeItem(themeStorageKey);
      const resolved = getImplicitPreference() ?? defaultTheme;
      document.documentElement.setAttribute("data-theme", resolved);
      setThemeState(resolved);
    } else {
      localStorage.setItem(themeStorageKey, themeToSet);
      document.documentElement.setAttribute("data-theme", themeToSet);
      setThemeState(themeToSet);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
