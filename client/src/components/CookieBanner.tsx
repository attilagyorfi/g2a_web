/**
 * GDPR + ePrivacy cookie consent banner with granular categories.
 *
 * Shows when no decision exists (or when version was bumped). Three top
 * actions — accept all / reject all / customise — plus an in-banner expanded
 * panel with per-category toggles. The "Cookie settings" link in the footer
 * dispatches `g2a:open-cookie-settings` to re-open this UI.
 *
 * Categories and what they actually unlock today:
 *  - necessary  — always on (admin session, theme, consent record itself)
 *  - functional — language memory, layout fine-tuning
 *  - thirdParty — Calendly badge widget initialization
 *  - marketing  — Google Analytics 4 + Google Tag Manager + Meta (Facebook)
 *                 Pixel; these load only after this category is granted
 *
 * While the banner is on screen, body.g2a-has-cookie-banner hides the
 * Calendly pill + StickyCTA pill so they don't obscure the privacy link
 * (ePrivacy requires unobstructed consent collection).
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { X, ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  readConsent,
  writeConsent,
  defaultAccepted,
  defaultDeclined,
  CONSENT_VERSION,
  type ConsentState,
} from "@/lib/consent";

type Category = "necessary" | "functional" | "thirdParty" | "marketing";

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(defaultDeclined());

  // Show on first paint if no decision has been recorded yet.
  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
      setDraft(defaultDeclined());
    }
  }, []);

  // Re-open from the footer "Cookie settings" link — preload current values.
  useEffect(() => {
    const onOpen = () => {
      const current = readConsent();
      setDraft(current ?? defaultDeclined());
      setExpanded(true); // open the customise panel directly
      setVisible(true);
    };
    window.addEventListener(
      "g2a:open-cookie-settings",
      onOpen as EventListener,
    );
    return () =>
      window.removeEventListener(
        "g2a:open-cookie-settings",
        onOpen as EventListener,
      );
  }, []);

  // Hide overlapping bottom-fixed pills (Calendly, StickyCTA) while the
  // banner is up so the privacy link stays unobstructed (ePrivacy).
  useEffect(() => {
    if (visible) {
      document.body.classList.add("g2a-has-cookie-banner");
    } else {
      document.body.classList.remove("g2a-has-cookie-banner");
    }
    return () => document.body.classList.remove("g2a-has-cookie-banner");
  }, [visible]);

  const persist = (state: ConsentState) => {
    writeConsent(state);
    setVisible(false);
    setExpanded(false);
  };

  const acceptAll = () => persist(defaultAccepted());
  const rejectAll = () => persist(defaultDeclined());
  const saveCustom = () =>
    persist({
      ...draft,
      version: CONSENT_VERSION,
      necessary: true,
    });

  const toggle = (cat: Category) => {
    if (cat === "necessary") return; // locked on
    setDraft((d) => ({ ...d, [cat]: !d[cat] }));
  };

  if (!visible) return null;

  // ─── Styles ────────────────────────────────────────────────────────────
  const wrap: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "#111111",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
  };
  const inner: React.CSSProperties = {
    padding: "1.25rem 1.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };
  const summaryRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
    flexWrap: "wrap",
  };
  const message: React.CSSProperties = {
    color: "#b0b0b0",
    fontSize: "0.875rem",
    margin: 0,
    flex: 1,
    minWidth: 280,
    lineHeight: 1.55,
  };
  const btnGroup: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  };
  const btnGhost: React.CSSProperties = {
    background: "none",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#b0b0b0",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.825rem",
    fontFamily: "Geist Mono, monospace",
    whiteSpace: "nowrap",
  };
  const btnPrimary: React.CSSProperties = {
    background: "var(--g2a-brand-teal)",
    border: "1px solid var(--g2a-brand-teal)",
    color: "#fff",
    padding: "0.5rem 1.1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.825rem",
    fontFamily: "Geist Mono, monospace",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };
  const closeBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
  };

  return (
    <div style={wrap} role="dialog" aria-labelledby="cookie-banner-title">
      <div style={inner}>
        <div style={summaryRow}>
          <p style={message}>
            <strong
              id="cookie-banner-title"
              style={{
                color: "#fff",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.825rem",
                letterSpacing: "0.02em",
                marginRight: "0.5rem",
              }}
            >
              {t("cookie.title")}.
            </strong>
            {t("cookie.message")}{" "}
            <Link
              href="/adatvedelmi-iranyelvek"
              style={{
                color: "var(--g2a-brand-teal)",
                textDecoration: "underline",
              }}
            >
              {t("cookie.link")}
            </Link>
          </p>

          <div style={btnGroup}>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={btnGhost}
              aria-expanded={expanded}
            >
              {t("cookie.customize")}
              {expanded ? (
                <ChevronUp size={14} style={{ marginLeft: 6, verticalAlign: -2 }} />
              ) : (
                <ChevronDown size={14} style={{ marginLeft: 6, verticalAlign: -2 }} />
              )}
            </button>
            <button type="button" onClick={rejectAll} style={btnGhost}>
              {t("cookie.rejectAll")}
            </button>
            <button type="button" onClick={acceptAll} style={btnPrimary}>
              {t("cookie.acceptAll")}
            </button>
            <button
              type="button"
              onClick={rejectAll}
              aria-label={t("cookie.close")}
              style={closeBtn}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ─── Customise panel (collapsible) ─────────────────────────── */}
        {expanded && (
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <CategoryRow
              label={t("cookie.cat.necessary")}
              desc={t("cookie.cat.necessary.desc")}
              checked={true}
              locked={true}
              alwaysOnLabel={t("cookie.alwaysOn")}
              onToggle={() => {}}
            />
            <CategoryRow
              label={t("cookie.cat.functional")}
              desc={t("cookie.cat.functional.desc")}
              checked={draft.functional}
              onToggle={() => toggle("functional")}
            />
            <CategoryRow
              label={t("cookie.cat.thirdParty")}
              desc={t("cookie.cat.thirdParty.desc")}
              checked={draft.thirdParty}
              onToggle={() => toggle("thirdParty")}
            />
            <CategoryRow
              label={t("cookie.cat.marketing")}
              desc={t("cookie.cat.marketing.desc")}
              checked={draft.marketing}
              onToggle={() => toggle("marketing")}
            />
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "0.5rem",
              }}
            >
              <button type="button" onClick={saveCustom} style={btnPrimary}>
                <Check
                  size={14}
                  style={{ marginRight: 6, verticalAlign: -2 }}
                />
                {t("cookie.savePreferences")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category row with toggle ────────────────────────────────────────────
function CategoryRow({
  label,
  desc,
  checked,
  locked = false,
  onToggle,
  alwaysOnLabel,
}: {
  label: string;
  desc: string;
  checked: boolean;
  locked?: boolean;
  onToggle: () => void;
  alwaysOnLabel?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "0.875rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "0.4rem",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.825rem",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        {locked ? (
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "Geist Mono, monospace",
              color: "var(--g2a-brand-teal)",
              padding: "0.15rem 0.5rem",
              borderRadius: 999,
              background: "rgba(20,184,166,0.12)",
              border: "1px solid rgba(20,184,166,0.3)",
            }}
          >
            {alwaysOnLabel}
          </span>
        ) : (
          <ToggleSwitch checked={checked} onClick={onToggle} label={label} />
        )}
      </div>
      <p
        style={{
          color: "#9a9a9a",
          fontSize: "0.78rem",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// ─── Toggle switch (a11y: button with aria-checked) ──────────────────────
function ToggleSwitch({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      style={{
        position: "relative",
        width: 38,
        height: 22,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.2)",
        background: checked ? "var(--g2a-brand-teal)" : "rgba(255,255,255,0.08)",
        cursor: "pointer",
        padding: 0,
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}
