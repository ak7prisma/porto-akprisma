import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
