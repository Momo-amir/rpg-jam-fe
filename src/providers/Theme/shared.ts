import type { Theme } from "./types";

export const themeStorageKey = "theme";

export const defaultTheme: Theme = "light";

export const themes: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function getImplicitPreference(): Theme | null {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  return typeof mql.matches === "boolean" ? (mql.matches ? "dark" : "light") : null;
}
