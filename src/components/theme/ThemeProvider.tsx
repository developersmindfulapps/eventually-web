"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";

type ThemeMode = "auto" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getTimeBasedTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  const hour = new Date().getHours();
  // 6 AM <= local hour < 6 PM (06:00 to 17:59) -> Light mode
  // 6 PM <= local hour < 6 AM (18:00 to 05:59) -> Dark mode
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem("eventually_theme") as ThemeMode | null;
  return stored && ["auto", "light", "dark"].includes(stored) ? stored : "auto";
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  const interval = setInterval(callback, 60000);
  return () => {
    window.removeEventListener("storage", callback);
    clearInterval(interval);
  };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribe,
    getStoredTheme,
    () => "auto"
  );

  const resolvedTheme: ResolvedTheme = theme === "auto" ? getTimeBasedTheme() : theme;

  const setTheme = useCallback((newTheme: ThemeMode) => {
    localStorage.setItem("eventually_theme", newTheme);
    const resolved = newTheme === "auto" ? getTimeBasedTheme() : newTheme;
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // trigger custom event to notify external store subscribers
    window.dispatchEvent(new Event("storage"));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "light" ? "dark" : "light";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export const ThemeScript = () => {
  const scriptContent = `
    (function() {
      try {
        var stored = localStorage.getItem('eventually_theme');
        var isDark = false;
        if (stored === 'dark') {
          isDark = true;
        } else if (stored === 'light') {
          isDark = false;
        } else {
          var h = new Date().getHours();
          isDark = (h < 6 || h >= 18);
        }
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
};
