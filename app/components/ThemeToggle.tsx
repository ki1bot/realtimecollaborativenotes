"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ThemeToggle({
  variant = "default",
}: {
  variant?: "default" | "floating";
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={
        variant === "floating" ? "theme-toggle theme-floating" : "theme-toggle"
      }
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
    >
      {isDark ? (
        <Sun className="theme-icon" size={18} strokeWidth={2.2} />
      ) : (
        <Moon className="theme-icon" size={18} strokeWidth={2.2} />
      )}
      <span>{isDark ? "Terang" : "Gelap"}</span>
    </button>
  );
}
