import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

const LANGS: { code: Language; label: string; flag: string; full: string }[] = [
  { code: "hu", label: "HU", flag: "🇭🇺", full: "Magyar" },
  { code: "en", label: "EN", flag: "🇬🇧", full: "English" },
  { code: "zh", label: "中文", flag: "🇨🇳", full: "简体中文" },
];

type Props = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export default function LanguageSwitcher({ lang, setLang }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Language / 语言"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.35rem 0.625rem",
          borderRadius: "6px",
          backgroundColor: "var(--g2a-bg-card)",
          border: "1px solid var(--g2a-border)",
          color: "var(--g2a-text-secondary)",
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#14B8A6";
          e.currentTarget.style.color = "#14B8A6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--g2a-border)";
          e.currentTarget.style.color = "var(--g2a-text-secondary)";
        }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>{current.flag}</span>
        {current.label}
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: 160,
            backgroundColor: "var(--g2a-bg-card)",
            border: "1px solid var(--g2a-border)",
            borderRadius: 10,
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            padding: "0.25rem",
            zIndex: 1001,
            animation: "scaleIn 0.18s ease",
          }}
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: 6,
                  background: active ? "rgba(20,184,166,0.12)" : "transparent",
                  border: "none",
                  color: active ? "#14B8A6" : "var(--g2a-text-primary)",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{l.flag}</span>
                <span>{l.full}</span>
                <span style={{ marginLeft: "auto", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", color: "var(--g2a-text-muted)" }}>
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
