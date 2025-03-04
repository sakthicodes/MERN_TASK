import { create } from "zustand";

const useThemeStore = create((set) => {
  const storedTheme = localStorage.getItem("theme") || "light";

  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    darkMode: storedTheme === "dark",
    toggleDarkMode: () =>
      set((state) => {
        const newMode = state.darkMode ? "light" : "dark";
        localStorage.setItem("theme", newMode);
        document.documentElement.classList.toggle("dark", newMode === "dark");
        return { darkMode: newMode === "dark" };
      }),
  };
});

export default useThemeStore;
