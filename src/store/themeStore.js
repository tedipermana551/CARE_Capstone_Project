import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem("theme") === "dark",

  toggleTheme: () => {
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", newIsDarkMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newIsDarkMode);
      return { isDarkMode: newIsDarkMode };
    });
  },

  initializeTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", isDarkMode);
    set({ isDarkMode });
  },
}));

export default useThemeStore;