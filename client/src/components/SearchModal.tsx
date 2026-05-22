/**
 * Site-wide search dialog. Open via Cmd/Ctrl+K or the magnifier button in nav.
 *
 * - Type-ahead: queries `content.search` after a 250ms debounce
 * - Results split between blog posts and case studies
 * - Keyboard: Esc to close, ↑↓ to navigate, Enter to open
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Search, X, FileText, Briefcase, Loader2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const { lang, t } = useLanguage();
  const [, navigate] = useLocation();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  const results = trpc.content.search.useQuery(
    { q: debouncedQ, limit: 8 },
    { enabled: debouncedQ.length >= 2, staleTime: 30 * 1000 },
  );

  // Focus input on open + reset state
  useEffect(() => {
    if (!open) return;
    setQ("");
    setDebouncedQ("");
    setActiveIdx(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Flat list of results for keyboard nav (posts first, then case studies)
  const flat: Array<{ kind: "post" | "caseStudy"; id: number; slug: string; title: string; sub: string }> = [];
  if (results.data) {
    for (const p of results.data.posts) {
      flat.push({
        kind: "post",
        id: p.id,
        slug: p.slug,
        title: pickLocalized(p, "title", lang) || p.title,
        sub: pickLocalized(p, "excerpt", lang) || p.excerpt || "",
      });
    }
    for (const c of results.data.caseStudies) {
      flat.push({
        kind: "caseStudy",
        id: c.id,
        slug: c.slug,
        title: pickLocalized(c, "title", lang) || c.title,
        sub: [pickLocalized(c, "client", lang) || c.client, c.industry].filter(Boolean).join(" · "),
      });
    }
  }

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flat.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); return; }
      if (e.key === "Enter" && flat[activeIdx]) {
        e.preventDefault();
        const r = flat[activeIdx];
        const path = r.kind === "post" ? `/hirek/${r.slug}` : `/referenciak/${r.slug}`;
        navigate(path);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeIdx, flat, navigate, onClose]);

  // Reset active idx when results change
  useEffect(() => { setActiveIdx(0); }, [debouncedQ, results.data]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      role="presentation"
      className="g2a-popup-overlay"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "10vh 1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={t("search.title")}
        style={{
          width: "100%", maxWidth: 600,
          background: "var(--g2a-bg-card)",
          border: "1px solid var(--g2a-border)",
          borderRadius: 12,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.5)",
          overflow: "hidden",
          fontFamily: "Geist, sans-serif",
        }}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.25rem", borderBottom: "1px solid var(--g2a-border)" }}>
          <Search size={18} style={{ color: "var(--g2a-text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--g2a-text-primary)", fontSize: "1rem",
              fontFamily: "Geist, sans-serif",
            }}
            autoComplete="off"
          />
          {results.isFetching && <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite", color: "var(--g2a-brand-teal)" }} />}
          <button onClick={onClose} aria-label={t("common.close")} style={{ background: "transparent", border: "none", color: "var(--g2a-text-muted)", cursor: "pointer", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {q.trim().length < 2 ? (
            <div style={{ padding: "2.5rem 1.25rem", textAlign: "center", color: "var(--g2a-text-muted)", fontSize: "0.85rem" }}>
              {t("search.minChars")}
            </div>
          ) : results.isLoading ? (
            <div style={{ padding: "2.5rem 1.25rem", textAlign: "center", color: "var(--g2a-text-muted)", fontSize: "0.85rem" }}>
              {t("common.loading")}
            </div>
          ) : flat.length === 0 ? (
            <div style={{ padding: "2.5rem 1.25rem", textAlign: "center", color: "var(--g2a-text-muted)", fontSize: "0.85rem" }}>
              {t("search.noResults").replace("{q}", debouncedQ)}
            </div>
          ) : (
            <>
              {results.data && results.data.posts.length > 0 && (
                <div>
                  <SectionLabel icon={<FileText size={11} />} label={t("blog.title")} count={results.data.posts.length} />
                  {results.data.posts.map((p, i) => (
                    <ResultRow
                      key={`post-${p.id}`}
                      title={pickLocalized(p, "title", lang) || p.title}
                      sub={pickLocalized(p, "excerpt", lang) || p.excerpt || ""}
                      icon={<FileText size={14} />}
                      active={activeIdx === i}
                      onClick={() => { navigate(`/hirek/${p.slug}`); onClose(); }}
                      onMouseEnter={() => setActiveIdx(i)}
                    />
                  ))}
                </div>
              )}
              {results.data && results.data.caseStudies.length > 0 && (
                <div>
                  <SectionLabel icon={<Briefcase size={11} />} label={t("references.title")} count={results.data.caseStudies.length} />
                  {results.data.caseStudies.map((c, i) => {
                    const idx = (results.data?.posts.length ?? 0) + i;
                    return (
                      <ResultRow
                        key={`cs-${c.id}`}
                        title={pickLocalized(c, "title", lang) || c.title}
                        sub={[pickLocalized(c, "client", lang) || c.client, c.industry].filter(Boolean).join(" · ")}
                        icon={<Briefcase size={14} />}
                        active={activeIdx === idx}
                        onClick={() => { navigate(`/referenciak/${c.slug}`); onClose(); }}
                        onMouseEnter={() => setActiveIdx(idx)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer keyboard hint */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1.25rem", background: "var(--g2a-tile)", borderTop: "1px solid var(--g2a-border)", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-muted)" }}>
          <span>↑↓ {t("search.navigate")}</span>
          <span>↵ {t("search.open")}</span>
          <span>Esc {t("search.close")}</span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 1.25rem 6px", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
      {icon}
      <span>{label}</span>
      <span style={{ color: "var(--g2a-text-secondary)" }}>· {count}</span>
    </div>
  );
}

function ResultRow({
  title, sub, icon, active, onClick, onMouseEnter,
}: {
  title: string; sub: string; icon: React.ReactNode; active: boolean;
  onClick: () => void; onMouseEnter: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "12px 1.25rem", textAlign: "left",
        background: active ? "rgba(20,184,166,0.10)" : "transparent",
        border: "none", borderLeft: active ? "2px solid var(--g2a-brand-teal)" : "2px solid transparent",
        cursor: "pointer", color: "var(--g2a-text-primary)",
        fontFamily: "Geist, sans-serif", transition: "background 0.1s",
      }}
    >
      <span style={{ color: active ? "var(--g2a-brand-teal)" : "var(--g2a-text-muted)", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 500, color: "var(--g2a-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        {sub && <span style={{ display: "block", fontSize: "0.75rem", color: "var(--g2a-text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</span>}
      </span>
      <ArrowRight size={13} style={{ color: active ? "var(--g2a-brand-teal)" : "transparent", flexShrink: 0 }} />
    </button>
  );
}
