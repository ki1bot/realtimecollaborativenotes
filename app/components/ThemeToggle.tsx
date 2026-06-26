"use client";

import { useTheme } from "@/app/components/ThemeProvider";

export default function ThemeToggle({
  variant = "default",
}: {
  variant?: "default" | "floating";
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={
        variant === "floating" ? "theme-toggle theme-floating" : "theme-toggle"
      }
      onClick={toggleTheme}
      aria-label="Ganti tema"
    >
      <span>{theme === "dark" ? "☀️" : "🌙"}</span>
      <span>{theme === "dark" ? "Terang" : "Gelap"}</span>
    </button>
  );
}
