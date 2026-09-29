"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { resolvedTheme, toggleTheme, theme } = useTheme();

  if (!isClient) {
    return (
      <div className={`h-9 w-9 rounded-full border border-border bg-surface ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode (Currently ${theme === "auto" ? "Automatic" : isDark ? "Dark" : "Light"})`}
      title={theme === "auto" ? `Auto (based on local time) — Click to switch` : `Mode: ${isDark ? "Dark" : "Light"}`}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-all hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
