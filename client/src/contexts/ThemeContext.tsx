import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

/** Optional origin point — when provided, the theme transition reveals
 *  in a circular sweep from {x,y} (in viewport pixels). Used by the toggle
 *  button so the brush-like wipe radiates from the icon the user clicked. */
type ToggleOrigin = { x: number; y: number };

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: ToggleOrigin) => void;
  setTheme: (theme: Theme) => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "g2a-theme";

/**
 * Read the persisted theme from localStorage. Falls back to defaultTheme.
 * Safe to call during render — we know `window` exists since this is a CSR app.
 */
function readStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage may be blocked (e.g. private mode + 3rd-party cookies off) */
  }
  return defaultTheme;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  /** When true, exposes a working toggleTheme() and persists to localStorage. */
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  switchable = false,
}: ThemeProviderProps) {
  // Initialize from localStorage so we don't flash the wrong theme on mount.
  // The pre-hydration script in index.html already set the html class — we
  // just need to mirror it in React state so the toggle UI shows the right icon.
  const [theme, setThemeState] = useState<Theme>(() =>
    switchable ? readStoredTheme(defaultTheme) : defaultTheme
  );

  // Apply the theme class to <html>. We use both `light` and `dark` as
  // explicit classes so CSS rules can target either selector cleanly.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    if (switchable) {
      try { window.localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
    }
    // Update color-scheme so native form controls / scrollbars match
    root.style.colorScheme = theme;
  }, [theme, switchable]);

  const setTheme = useCallback((next: Theme) => {
    if (!switchable) return;
    setThemeState(next);
  }, [switchable]);

  /**
   * Toggle the theme with an animated circular reveal originating from
   * `origin` (in viewport coords). Falls back to an instant swap when:
   *   - the View Transitions API is unavailable (Firefox, older browsers)
   *   - the user prefers reduced motion
   *   - no origin is provided (e.g. keyboard / programmatic toggle)
   *
   * The CSS for the actual wipe lives in index.css (look for
   * `::view-transition-new(root)`).
   */
  const toggleTheme = useCallback((origin?: ToggleOrigin) => {
    if (!switchable) return;

    const flip = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Defensive feature-detect — the API is only on Chrome/Edge/Safari TP.
    const supportsViewTransition =
      typeof document !== "undefined" &&
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === "function";

    if (!origin || reduce || !supportsViewTransition) {
      flip();
      return;
    }

    // Compute a radius that reaches the farthest viewport corner from the
    // click point, so the wipe always covers the screen exactly once.
    const { x, y } = origin;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${x}px`);
    root.style.setProperty("--theme-toggle-y", `${y}px`);
    root.style.setProperty("--theme-toggle-r", `${maxRadius}px`);

    (document as Document & {
      startViewTransition: (cb: () => void) => { ready: Promise<void> };
    }).startViewTransition(flip);
  }, [switchable]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
