/**
 * Calendly embed — inline + popup variants.
 *
 * Setup:
 *   1. Create a Calendly event type at https://calendly.com/event_types/user/me
 *   2. Set VITE_CALENDLY_URL in .env (e.g. https://calendly.com/g2amarketing/30min)
 *   3. Drop <CalendlyEmbed /> anywhere; it auto-hides if URL not configured
 *
 * The widget loads the Calendly assets lazily — no external script in <head>,
 * no impact on page-load perf.
 */
import { useEffect, useRef, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { hasConsent, CONSENT_CHANGE_EVENT, type ConsentState } from "@/lib/consent";

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? "";
const CALENDLY_SCRIPT_URL = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS_URL = "https://assets.calendly.com/assets/external/widget.css";

let scriptPromise: Promise<void> | null = null;

function loadCalendlyScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    // CSS
    if (!document.querySelector(`link[href="${CALENDLY_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CALENDLY_CSS_URL;
      document.head.appendChild(link);
    }
    // JS
    if (window.Calendly) return resolve();
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Calendly script"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement; prefill?: Record<string, string>; utm?: Record<string, string>; pageSettings?: Record<string, unknown> }) => void;
      initPopupWidget: (opts: { url: string; prefill?: Record<string, string>; utm?: Record<string, string> }) => void;
      initBadgeWidget: (opts: { url: string; text: string; color: string; textColor: string; branding?: boolean; position?: "bottom-right" | "bottom-left" }) => void;
      closePopupWidget: () => void;
    };
  }
}

export function isCalendlyConfigured(): boolean {
  return Boolean(CALENDLY_URL);
}

type Prefill = {
  /** Pre-fills name on the booking form. */
  name?: string;
  /** Pre-fills email. */
  email?: string;
  /** Optional first/last name overrides if you want them split. */
  firstName?: string;
  lastName?: string;
};

type Props = {
  /** Override the env URL (e.g. for a service-specific event type). */
  url?: string;
  /** Prefill name + email on the booking form for known leads. */
  prefill?: Prefill;
  /** Inline embed height in px. Default 700. */
  height?: number;
  /** Hide the G2A theming bits (page details, branding). */
  hideEventTypeDetails?: boolean;
  hideLandingPageDetails?: boolean;
};

/**
 * Inline Calendly widget. Renders a placeholder if not configured;
 * shows a loader while Calendly's script loads.
 */
export default function CalendlyEmbed({
  url = CALENDLY_URL,
  prefill,
  height = 700,
  hideEventTypeDetails = false,
  hideLandingPageDetails = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !containerRef.current) return;
    loadCalendlyScript()
      .then(() => {
        if (!containerRef.current || !window.Calendly) {
          setError("Calendly betöltési hiba.");
          return;
        }
        // Clear any previous render
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
          prefill: prefill ? {
            name: prefill.name,
            email: prefill.email,
            firstName: prefill.firstName,
            lastName: prefill.lastName,
          } as Record<string, string> : undefined,
          pageSettings: {
            hideEventTypeDetails,
            hideLandingPageDetails,
            primaryColor: "14B8A6",
            textColor: "1f2937",
            backgroundColor: "ffffff",
          },
        });
        setLoaded(true);
      })
      .catch((err) => setError(err.message || "Calendly betöltési hiba"));
  }, [url, prefill, hideEventTypeDetails, hideLandingPageDetails]);

  if (!url) {
    return (
      <div style={{
        padding: "2rem", textAlign: "center", borderRadius: 10,
        border: "1px dashed var(--g2a-border)", color: "var(--g2a-text-muted)",
        fontFamily: "Geist Mono, monospace", fontSize: "0.85rem",
      }}>
        <Calendar size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
        <div>Calendly nincs konfigurálva</div>
        <div style={{ fontSize: "0.7rem", marginTop: 4, opacity: 0.7 }}>
          Állítsd be: <code>VITE_CALENDLY_URL</code> a .env-ben
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#ef4444", textAlign: "center", fontSize: "0.85rem" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: height, width: "100%" }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "var(--g2a-text-muted)", gap: 8,
        }}>
          <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "0.85rem" }}>
            Naptár betöltése...
          </span>
        </div>
      )}
      <div ref={containerRef} style={{ minWidth: 320, height }} />
    </div>
  );
}

/**
 * "Book a meeting" CTA button that opens the Calendly popup.
 * Hidden entirely if Calendly isn't configured.
 */
export function CalendlyPopupButton({
  url = CALENDLY_URL,
  prefill,
  children,
  className,
  style,
}: {
  url?: string;
  prefill?: Prefill;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!url) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await loadCalendlyScript();
      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url,
          prefill: prefill ? {
            name: prefill.name,
            email: prefill.email,
            firstName: prefill.firstName,
            lastName: prefill.lastName,
          } as Record<string, string> : undefined,
        });
      }
    } catch (err) {
      console.error("[Calendly] popup load failed:", err);
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}

/**
 * Floating badge widget — Calendly's `initBadgeWidget` renders a fixed-position
 * pill in the bottom-right corner that opens the Calendly popup on click.
 *
 * Mount once at the app root (we do it in PublicOnlyChrome). Hides on /admin
 * and on the contact page (which already has an inline embed) to avoid
 * duplicate booking entry points.
 *
 * UX notes:
 * - Color follows brand teal (#14B8A6) instead of Calendly's default #0069ff
 * - Hidden on viewport <= 768px to avoid overlapping mobile chat buttons
 *   (WhatsApp / WeChat live in the same corner)
 */
export function CalendlyBadge({
  text,
  hideOnPaths = ["/kapcsolat", "/admin"],
}: {
  text?: string;
  hideOnPaths?: string[];
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!CALENDLY_URL) return;
    if (typeof window === "undefined") return;

    // Don't render on admin or contact page (the inline embed there is enough)
    const path = window.location.pathname;
    if (hideOnPaths.some((p) => path === p || path.startsWith(p + "/") || path.startsWith("/en" + p) || path.startsWith("/zh" + p))) {
      return;
    }

    // Defer mounting until idle so we don't compete for main-thread time on
    // initial paint. Calendly itself loads ~150 KB of JS + CSS — not worth
    // blocking LCP for.
    const idle = (cb: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as Window & typeof globalThis).requestIdleCallback(cb, { timeout: 3000 });
      } else {
        setTimeout(cb, 1500);
      }
    };

    const initBadge = () => {
      if (initialized.current) return;
      // Granular consent gate — Calendly drops third-party cookies when its
      // assets load, so we wait for explicit `thirdParty` opt-in. The user
      // can still flip the switch in the footer's "Cookie settings" link
      // and we'll re-init via the consent-change listener below.
      if (!hasConsent("thirdParty")) return;
      loadCalendlyScript()
        .then(() => {
          if (!window.Calendly || initialized.current) return;
          window.Calendly.initBadgeWidget({
            url: CALENDLY_URL,
            text: text ?? "Foglalj időpontot",
            color: "14B8A6",     // brand teal — Calendly accepts hex without #
            textColor: "ffffff",
            branding: true,      // small Calendly logo (free tier requires it)
            position: "bottom-left", // bottom-RIGHT is reserved for chat (WhatsApp / WeChat)
          });
          initialized.current = true;
        })
        .catch((err) => console.error("[CalendlyBadge] load failed:", err));
    };

    idle(initBadge);

    // If the user grants thirdParty consent later (via footer "Cookie
    // settings" → toggle on → save), pick it up and mount the badge.
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail?.thirdParty) idle(initBadge);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);

    // Cleanup: badge widget is sticky so removing the script doesn't remove
    // the DOM. We handle this by checking initialized.current on re-mount.
  }, [text, hideOnPaths]);

  return null;
}

/**
 * Inline text-style trigger — anchor that opens Calendly popup on click.
 * Use anywhere a "Schedule a slot" link makes sense (footer, service CTAs,
 * blog post sidebars). Renders nothing if Calendly URL not configured.
 */
export function CalendlyTextLink({
  text,
  prefill,
  className,
  style,
}: {
  text?: string;
  prefill?: Prefill;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!CALENDLY_URL) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await loadCalendlyScript();
      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url: CALENDLY_URL,
          prefill: prefill ? {
            name: prefill.name,
            email: prefill.email,
            firstName: prefill.firstName,
            lastName: prefill.lastName,
          } as Record<string, string> : undefined,
        });
      }
    } catch (err) {
      console.error("[CalendlyTextLink] popup load failed:", err);
    }
  };

  return (
    <a
      href="#book"
      onClick={handleClick}
      className={className}
      style={{
        color: "var(--g2a-brand-teal)",
        textDecoration: "underline",
        cursor: "pointer",
        ...style,
      }}
    >
      {text ?? "Foglalj időpontot"}
    </a>
  );
}
