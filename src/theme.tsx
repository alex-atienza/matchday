/**
 * Theme plumbing for the two design directions.
 *
 * "lights" is Direction A, "Under the Lights" — the original prototype. Its token
 * values live in the plain `:root` block in index.css, so A renders identically
 * whether or not the data-theme attribute is ever set. Nothing here can break it.
 *
 * "draft" is Direction D, "Sunday Draft", applied as a `:root[data-theme="draft"]`
 * override block.
 *
 * Selecting a theme: `?theme=draft` in the URL, the switch in the corner, or "T".
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const THEMES = ["lights", "draft"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABEL: Record<Theme, string> = {
  lights: "Under the Lights",
  draft: "Sunday Draft",
};

/** Short label for the corner switch, where horizontal room is tight. */
export const THEME_SHORT: Record<Theme, string> = {
  lights: "Lights",
  draft: "Draft",
};

const STORAGE_KEY = "matchday:theme";
const META_COLOR: Record<Theme, string> = { lights: "#05070A", draft: "#FFFFFF" };

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

/** URL param wins, then last choice, then Direction A. */
export function initialTheme(): Theme {
  const fromUrl = new URLSearchParams(window.location.search).get("theme");
  if (isTheme(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Safari private mode throws on localStorage; the default is fine.
  }
  return "lights";
}

/**
 * Write the theme to the document. Called once before React mounts so the first
 * paint is already correct, then again on every change.
 */
export function applyThemeToDom(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLOR[theme]);

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Not being able to remember the choice is not worth failing over.
  }

  // Keep the URL in step so the address bar is always a shareable link to what
  // is on screen — the point is being able to send someone one direction or the
  // other, or open both side by side.
  const url = new URL(window.location.href);
  url.searchParams.set("theme", theme);
  window.history.replaceState(null, "", url);
}

type ThemeValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  /** the in-app direction picker, opened from the profile avatar */
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
};

const ThemeContext = createContext<ThemeValue>({
  theme: "lights",
  setTheme: () => {},
  pickerOpen: false,
  setPickerOpen: () => {},
});

/** Read the active direction. Component-level variants will hang off this. */
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [pickerOpen, setPickerOpen] = useState(false);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyThemeToDom(next);
  }, []);

  // "T" toggles, for flipping between directions mid-conversation without
  // reaching for the mouse.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Don't hijack the keystroke while someone is typing into the composer.
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;

      setTheme(theme === "lights" ? "draft" : "lights");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, pickerOpen, setPickerOpen }}>
      {children}
    </ThemeContext.Provider>
  );
}
