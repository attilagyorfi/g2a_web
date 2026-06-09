/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Renders the Turnstile CAPTCHA challenge on public forms (contact,
 * audit, careers, newsletter). On success the widget calls our
 * `onToken` prop with a one-time verification token that the form
 * then sends to the server alongside the form data — the server
 * verifies it against the secret key (server/_core/turnstile.ts).
 *
 * Feature flag: if `VITE_TURNSTILE_SITE_KEY` is unset, the component
 * renders nothing and `onToken` is never called. The parent form's
 * onSubmit treats a missing token as acceptable, and the server
 * (which is also unconfigured) soft-passes. This lets us deploy the
 * full code path before Attila has the Cloudflare account set up,
 * and keeps local dev working without keys.
 *
 * Widget JS is loaded lazily on first mount of the first widget on
 * the page, never blocking initial paint.
 */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

type TurnstileOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  language?: string;
  appearance?: "always" | "execute" | "interaction-only";
};

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const SCRIPT_ID = "cf-turnstile-script";

/** Lazily inject the Turnstile JS once per page. Returns a promise
 *  that resolves when window.turnstile is ready. */
function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Turnstile script failed to load")), { once: true });
    document.head.appendChild(script);
  });
}

const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();

export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}

type Props = {
  /** Called with the verification token on success. */
  onToken: (token: string) => void;
  /** Optional handler for widget errors / expiry — usually clear the token in the parent. */
  onExpire?: () => void;
};

/**
 * Drop-in widget for any form. Renders nothing when Turnstile isn't
 * configured. Use isTurnstileEnabled() at the form level if you want
 * to skip submit-button gating when the feature is off.
 */
export default function TurnstileWidget({ onToken, onExpire }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!SITE_KEY) return; // feature flag off
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        // Theme follows the document data-theme set by ThemeToggle.
        const docTheme = document.documentElement.dataset.theme;
        const theme: TurnstileOptions["theme"] = docTheme === "light" ? "light" : docTheme === "dark" ? "dark" : "auto";
        const id = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => onToken(token),
          "expired-callback": () => onExpire?.(),
          "error-callback": () => onExpire?.(),
          theme,
          size: "flexible",
          language: lang === "zh" ? "zh-cn" : lang,
          appearance: "interaction-only",
        });
        widgetIdRef.current = id;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("[turnstile] failed to load:", err);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
    // Lang-change re-renders the widget so its UI strings update.
  }, [lang, onToken, onExpire]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} style={{ minHeight: 0 }} />;
}
