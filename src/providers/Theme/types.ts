export type Theme = "dark" | "light";

export interface ThemeContextType {
  theme: Theme | undefined;
  setTheme: (theme: Theme | null) => void;
}

export function themeIsValid(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}
