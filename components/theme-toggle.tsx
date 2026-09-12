"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@/components/icons";

const STORAGE_KEY = "solor.theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* privacy mode — theme just won't persist across visits */
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-bone/80 ring-1 ring-white/[0.08] transition-colors duration-500 ease-fluid hover:bg-white/[0.1] hover:text-bone"
    >
      {theme === "dark" ? (
        <Sun size={14} weight="light" aria-hidden />
      ) : (
        <Moon size={14} weight="light" aria-hidden />
      )}
    </button>
  );
}
