"use client";

import * as React from "react";

/**
 * ThemeToggle — flips the `.light` class on <html> and persists the choice.
 * Pairs with the no-flash init script in layout.tsx (THEME_INIT). Dark is the
 * default (Design Law #4: Dark First); light is the opt-in token override set.
 */
const STORAGE_KEY = "chromatic-theme";

function getInitial(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  // Sync from the DOM after hydration (the init script set the real value).
  React.useEffect(() => setTheme(getInitial()), []);

  const toggle = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      const root = document.documentElement;
      root.classList.toggle("light", next === "light");
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage may be unavailable (private mode) — non-fatal */
      }
      return next;
    });
  }, []);

  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-default " +
        "bg-surface-default text-text-secondary transition duration-fast ease-easeOut " +
        "hover:text-text-primary hover:border-border-hover " +
        "focus-visible:outline-none focus-visible:shadow-glow-focus " +
        className
      }
    >
      <span aria-hidden className="text-base leading-none">
        {isLight ? "☾" : "☀"}
      </span>
    </button>
  );
}

export default ThemeToggle;
