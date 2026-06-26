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
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      className={
        variant === "floating"
          ? "fixed right-5 top-5 z-30 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
          : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
      }
    >
      {isDark ? (
        <Sun className="text-blue-400" size={18} strokeWidth={2.3} />
      ) : (
        <Moon className="text-blue-600" size={18} strokeWidth={2.3} />
      )}
      <span>{isDark ? "Terang" : "Gelap"}</span>
    </button>
  );
}
