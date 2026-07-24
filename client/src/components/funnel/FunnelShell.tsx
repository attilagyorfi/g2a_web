/**
 * Minimal chrome for the AI Marketing Csomag funnel pages (/ai-csomag,
 * /marketing-teszt, /koszonjuk). Deliberately NOT the site Navigation — a
 * lead-magnet funnel keeps the header distraction-free (logo + one CTA) to
 * maximise the opt-in. Always dark, HU-only; self-contained so it doesn't
 * depend on the site's theme toggle.
 */
import type { CSSProperties, ReactNode } from "react";

/** Palette from the supplied funnel design. */
export const C = {
  teal: "#14B8A6",
  tealD: "#0D9488",
  base: "#0F0F0F",
  panel: "#161616",
  panel2: "#1B1B1B",
  line: "#282828",
  lineSoft: "#202020",
  text: "#D6D9DE",
  muted: "#8A8F98",
  muted2: "#6A6F78",
  white: "#ffffff",
};

export const MONO = "'Geist Mono', ui-monospace, monospace";
export const SANS = "'Geist', 'Segoe UI', Arial, sans-serif";

const LOGO_URL = "https://g2amarketing.hu/wp-content/uploads/2022/06/g2a_512x512_transparent_feher.png";

export function FunnelShell({ children, navCta }: { children: ReactNode; navCta?: { label: string; href: string } }) {
  return (
    <div style={{ background: C.base, color: C.text, minHeight: "100vh", fontFamily: SANS, lineHeight: 1.6 }}>
      <nav style={{ borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: "rgba(15,15,15,.85)", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          <a href="/ai-csomag" style={{ textDecoration: "none" }}>
            <img src={LOGO_URL} alt="G2A Marketing" style={{ height: 30, width: "auto", display: "block" }} />
          </a>
          {navCta && (
            <a href={navCta.href} style={{ fontFamily: MONO, fontSize: 12.5, color: C.teal, border: "1px solid rgba(20,184,166,.4)", padding: "8px 16px", borderRadius: 100, textDecoration: "none" }}>
              {navCta.label}
            </a>
          )}
        </div>
      </nav>

      {children}

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "34px 0", marginTop: 20 }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <img src={LOGO_URL} alt="G2A Marketing" style={{ height: 26, width: "auto" }} />
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.muted2, lineHeight: 1.7 }}>
            <span style={{ color: C.teal }}>info@g2amarketing.hu</span> · +36 30 190 2575<br />
            g2amarketing.hu · Pécs · © 2026 G2A Marketing Bt.
          </div>
        </div>
      </footer>
    </div>
  );
}

export const wrap: CSSProperties = { maxWidth: 1080, margin: "0 auto", padding: "0 24px" };
export const eyebrow: CSSProperties = { fontFamily: MONO, fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: C.teal, fontWeight: 500 };

/** Shared input + primary button styles. */
export const field: CSSProperties = { width: "100%", background: "#0C0C0C", border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 15px", color: "#fff", fontSize: 14, fontFamily: SANS, marginBottom: 10 };
export const primaryBtn: CSSProperties = { width: "100%", background: C.teal, color: "#06201d", fontWeight: 800, fontSize: 15, border: "none", borderRadius: 11, padding: 14, fontFamily: MONO, letterSpacing: ".4px", cursor: "pointer" };
