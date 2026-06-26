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

  const className =
    variant === "floating"
      ? "fixed right-5 top-5 z-30 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-black/30"
      : "inline-flex h-11 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-lg shadow-slate-200/60 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-black/30";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      className={className}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
        {isDark ? (
          <Sun size={17} strokeWidth={2.4} />
        ) : (
          <Moon size={17} strokeWidth={2.4} />
        )}
      </span>

      <span className="hidden sm:inline">{isDark ? "Terang" : "Gelap"}</span>
    </button>
  );
}
