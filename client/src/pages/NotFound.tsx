import { Link, useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Home, Search, FileText, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import BrokenConstellation from "@/components/illustrations/BrokenConstellation";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { pickLocalized } from "@/../../shared/i18n";

/**
 * Brand-aligned 404 page. Replaces the old shadcn-based light-theme card with
 * an obsidian-style hero featuring the BrokenConstellation illustration on the
 * right and helpful navigation suggestions on the left.
 */
export default function NotFound() {
  const [location] = useLocation();
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();

  // Pull the latest 3 published posts as dynamic "you may also like"
  // suggestions — better internal-link discovery than static labels.
  // The query is small (only 3 rows, content excerpts stripped) so it
  // doesn't slow down the 404 render meaningfully.
  const { data: latestPostsData } = trpc.content.posts.useQuery({ page: 1, limit: 3 });
  const latestPosts = latestPostsData?.posts ?? [];

  // Static suggestions — the four pages that drive most "lost visitor"
  // recovery on a marketing-agency site. Kept short on purpose.
  const suggestions = [
    { href: "/", label: t("notfound.suggestHome") },
    { href: "/szolgaltatasok", label: t("notfound.suggestServices") },
    { href: "/referenciak", label: t("notfound.suggestReferences") },
    { href: "/kapcsolat", label: t("notfound.suggestContact") },
  ];

  return (
    <>
      <SeoHead
        title={t("notfound.seoTitle")}
        description={t("notfound.seoDesc")}
        noIndex
      />
      <Navigation />
      <main
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(20,184,166,0.10) 0%, transparent 55%), var(--g2a-bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="g2a-grid-pattern"
          style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}
        />
        <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
          <div
            className="g2a-service-hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 360px)",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            {/* Left — copy + suggestions */}
            <div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="g2a-section-label"
              >
                {t("notfound.label")}
              </motion.div>

              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="g2a-headline-xl"
                style={{ marginBottom: "1.25rem" }}
              >
                {t("notfound.title1")} <span className="g2a-gradient-text">{t("notfound.title2")}</span>
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                style={{
                  fontSize: "1.05rem",
                  color: "var(--g2a-text-secondary)",
                  lineHeight: "1.7",
                  maxWidth: "540px",
                  marginBottom: "0.75rem",
                  fontFamily: "Geist, sans-serif",
                }}
              >
                {t("notfound.subtitle")}
              </motion.p>

              {location && (
                <motion.div
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.7rem",
                    color: "var(--g2a-text-muted)",
                    marginBottom: "2rem",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Search size={11} style={{ color: "var(--g2a-brand-teal)", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {location}
                  </span>
                </motion.div>
              )}

              {/* CTAs — Home, Back, and "Open search" (Cmd/Ctrl+K). The
                   search opens the existing global SearchModal via the
                   same custom event Navigation's search button dispatches. */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}
              >
                <Link href="/" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Home size={16} /> {t("notfound.ctaHome")}
                  </span>
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="g2a-btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", border: "none", font: "inherit" }}
                >
                  <ArrowLeft size={16} /> {t("notfound.ctaBack")}
                </button>
                <button
                  onClick={() => window.dispatchEvent(new Event("g2a:open-search"))}
                  className="g2a-btn-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", border: "none", font: "inherit" }}
                >
                  <Search size={16} /> Keresés (Ctrl+K)
                </button>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.62rem",
                    color: "var(--g2a-text-muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {t("notfound.suggestionsLabel")}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {suggestions.map((s) => (
                    <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          background: "rgba(20,184,166,0.08)",
                          border: "1px solid rgba(20,184,166,0.25)",
                          color: "var(--g2a-brand-teal)",
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                          transition: "background 0.2s, transform 0.2s",
                          display: "inline-block",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(20,184,166,0.16)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(20,184,166,0.08)";
                          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        }}
                      >
                        {s.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Latest blog posts — internal-link discovery for SEO crawlers
                     and a friendly "maybe you wanted this" for visitors who hit
                     a stale or mistyped article URL. Hidden if no posts loaded
                     (DB unavailable in dev, fresh deploy with no content). */}
                {latestPosts.length > 0 && (
                  <div style={{ marginTop: "1.75rem" }}>
                    <div
                      style={{
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "0.62rem",
                        color: "var(--g2a-text-muted)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      Friss a blogon
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {latestPosts.map((p) => {
                        const title = pickLocalized(p, "title", lang);
                        return (
                          <Link key={p.id} href={`/hirek/${p.slug}`} style={{ textDecoration: "none" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "8px 12px",
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "var(--g2a-text-secondary)",
                                fontFamily: "Geist, sans-serif",
                                fontSize: "0.88rem",
                                cursor: "pointer",
                                transition: "background 0.18s, color 0.18s",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(20,184,166,0.08)";
                                (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-primary)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                                (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-secondary)";
                              }}
                            >
                              <FileText size={13} style={{ color: "var(--g2a-brand-teal)", flexShrink: 0 }} />
                              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {title}
                              </span>
                              <ArrowRight size={12} style={{ color: "var(--g2a-text-muted)", flexShrink: 0 }} />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right — illustration */}
            <div className="g2a-service-hero-demo" style={{ display: "flex", justifyContent: "center" }}>
              <BrokenConstellation size={340} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
