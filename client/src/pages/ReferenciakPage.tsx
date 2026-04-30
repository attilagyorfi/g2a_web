import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ReferencesHeroDemo from "@/components/page-demos/ReferencesHeroDemo";
import EmptyState from "@/components/illustrations/EmptyState";
import CloudinaryImage from "@/components/CloudinaryImage";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Target, Globe, CheckCircle, ExternalLink, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";

const INDUSTRY_LABELS: Record<string, string> = {
  egeszsegugy: "Egészségügy",
  b2b: "B2B",
  szepsegipari: "Szépségipar",
  jogi: "Jogi",
  autoipari: "Autóipar",
  mernoki: "Mérnöki",
  technologia: "Technológia",
  onkormanyzat: "Önkormányzat",
};

const INDUSTRY_COLORS: Record<string, string> = {
  egeszsegugy: "#10b981",
  b2b: "#3b82f6",
  szepsegipari: "#ec4899",
  jogi: "#6366f1",
  autoipari: "#f59e0b",
  mernoki: "#8b5cf6",
  technologia: "#06b6d4",
  onkormanyzat: "#22c55e",
};

/**
 * Renders the small icon-only link bar for a case study card.
 * Maps known social platform keys to their respective Lucide icons; everything
 * else (e.g. "tiktok", "x") falls back to a generic external-link arrow.
 */
function CardExternalLinks({
  links,
  clientName,
  accent,
}: {
  links: Record<string, string>;
  clientName: string;
  accent: string;
}) {
  const ICON_MAP: Record<string, React.ReactNode> = {
    website: <ExternalLink size={13} />,
    facebook: <Facebook size={13} />,
    instagram: <Instagram size={13} />,
    linkedin: <Linkedin size={13} />,
    youtube: <Youtube size={13} />,
  };
  const ariaLabelFor = (key: string) =>
    `${clientName} – ${key.charAt(0).toUpperCase() + key.slice(1)}`;

  const entries = Object.entries(links).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabelFor(key)}
          title={ariaLabelFor(key)}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "var(--g2a-tile)",
            border: "1px solid var(--g2a-tile-border)",
            color: "var(--g2a-text-muted)",
            transition: "all 0.18s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${accent}1a`;
            e.currentTarget.style.borderColor = `${accent}55`;
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--g2a-tile)";
            e.currentTarget.style.borderColor = "var(--g2a-tile-border)";
            e.currentTarget.style.color = "var(--g2a-text-muted)";
          }}
        >
          {ICON_MAP[key] ?? <ExternalLink size={13} />}
        </a>
      ))}
    </div>
  );
}

export default function ReferenciakPage() {
  const { t, lang } = useLanguage();
  const { data: caseStudies, isLoading } = trpc.content.caseStudies.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/referenciak" });
  const [activeIndustry, setActiveIndustry] = useState("osszes");

  const industries = ["osszes", ...Array.from(new Set((caseStudies || []).map(cs => cs.industry).filter((x): x is string => Boolean(x))))];

  const filtered = activeIndustry === "osszes"
    ? (caseStudies || [])
    : (caseStudies || []).filter(cs => cs.industry === activeIndustry);

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "Referenciák & Esettanulmányok – G2A Marketing | Valós Eredmények"}
        description={pageSeo?.metaDescription || "Valós marketing eredmények valós ügyfelektől. Esettanulmányok egészségügy, autóipar, B2B és más iparágakból."}
      />
      <ScrollProgressBar />
      <Navigation />

      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, var(--g2a-bg-1) 0%, var(--g2a-bg-2) 100%)",
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="g2a-service-hero-grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 460px)", gap: "3rem", alignItems: "center" }}
            >
              <div>
                <div className="g2a-section-label animate-fadeIn">{t("references.sectionLabel")}</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "640px" }}>
                  {t("references.heroTitle1")}{" "}
                  <span className="g2a-gradient-text">{t("references.heroTitle2")}</span>
                </h1>
                <p className="animate-fadeInUp" style={{
                  animationDelay: "0.3s",
                  fontSize: "1.1rem",
                  color: "var(--g2a-text-secondary)",
                  maxWidth: "540px",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}>
                  {t("references.heroDesc")}
                </p>
                <div className="animate-fadeInUp" style={{
                  animationDelay: "0.45s",
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}>
                  {[
                    { icon: <TrendingUp size={16} />, text: t("references.badge.partners") },
                    { icon: <Target size={16} />, text: t("references.badge.industries") },
                    { icon: <Globe size={16} />, text: t("references.badge.results") },
                  ].map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--g2a-amber)" }}>{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="g2a-service-hero-demo">
                <ReferencesHeroDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Cases */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {/* Industry Filter */}
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind)}
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "50px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: activeIndustry === ind ? "var(--g2a-amber)" : "var(--g2a-bg-card)",
                    color: activeIndustry === ind ? "#000" : "var(--g2a-text-secondary)",
                    border: `1px solid ${activeIndustry === ind ? "var(--g2a-amber)" : "var(--g2a-border)"}`,
                  }}
                >
                  {ind === "osszes" ? t("references.filterAll") : (INDUSTRY_LABELS[ind] || ind)}
                </button>
              ))}
            </div>

            {/* Loading */}
            {isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.75rem" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="g2a-card" style={{ height: "280px", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            )}

            {/* Case Studies Grid – visual cards with logo + screenshot + links */}
            {!isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.75rem" }}>
                {filtered.map((cs) => {
                  const color = INDUSTRY_COLORS[(cs.industry ?? "")] || "var(--g2a-amber)";
                  const title = pickLocalized(cs, "title", lang);
                  const client = pickLocalized(cs, "client", lang);
                  const industry = pickLocalized(cs, "industry", lang);
                  const challenge = pickLocalized(cs, "challenge", lang);
                  const results = pickLocalized(cs, "results", lang);
                  let tags: string[] = [];
                  try { tags = JSON.parse(cs.tags || "[]"); } catch { tags = []; }
                  let externalLinks: Record<string, string> = {};
                  try { externalLinks = JSON.parse(cs.externalLinks || "{}"); } catch { externalLinks = {}; }
                  const resultLines = results ? results.split(",").map(r => r.trim()).filter(Boolean) : [];
                  const summaryText = challenge
                    ? (challenge.length > 130 ? challenge.slice(0, 130) + "…" : challenge)
                    : "";

                  return (
                    <Link
                      key={cs.id}
                      href={`/referenciak/${cs.slug}`}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                    <div
                      className="g2a-card"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                        cursor: "pointer",
                        height: "100%",
                      }}
                    >
                      {/* Color top bar */}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: color, zIndex: 2 }} />

                      {/* Hero strip — featured screenshot with logo overlay */}
                      {cs.featuredImage && (
                        <div style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 9",
                          overflow: "hidden",
                          background: `linear-gradient(135deg, ${color}18, var(--g2a-tile))`,
                        }}>
                          <CloudinaryImage
                            src={cs.featuredImage}
                            alt={cs.featuredImageAlt || title}
                            widths={[480, 768, 1024]}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", opacity: 0.85 }}
                          />
                          {/* Bottom-fade so the logo chip sits on a darker base */}
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
                          {/* Logo chip — bottom-left over the screenshot */}
                          {cs.logoImage && (
                            <div style={{
                              position: "absolute",
                              left: 12,
                              bottom: 12,
                              width: 56,
                              height: 56,
                              padding: 8,
                              borderRadius: 10,
                              background: "rgba(255,255,255,0.95)",
                              boxShadow: "0 10px 24px -8px rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              <CloudinaryImage
                                src={cs.logoImage}
                                alt={cs.logoImageAlt || `${client || title} logó`}
                                width={56}
                                height={56}
                                widths={[56, 112]}
                                sizes="56px"
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                              />
                            </div>
                          )}
                          {/* Project year badge — top-right */}
                          {cs.projectYear && (
                            <span style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              padding: "3px 8px",
                              borderRadius: 999,
                              background: "rgba(0,0,0,0.55)",
                              backdropFilter: "blur(6px)",
                              color: "#fff",
                              fontFamily: "Geist Mono, monospace",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                            }}>{cs.projectYear}</span>
                          )}
                        </div>
                      )}

                      {/* Body */}
                      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem", flexGrow: 1 }}>
                        {/* Industry badge + client name */}
                        <div>
                          <span style={{
                            display: "inline-block",
                            padding: "0.2rem 0.625rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            backgroundColor: `${color}18`,
                            color: color,
                            marginBottom: "0.5rem",
                          }}>
                            {lang === "hu" ? (INDUSTRY_LABELS[(cs.industry ?? "")] || industry || "Marketing") : (industry || "Marketing")}
                          </span>
                          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", margin: 0, lineHeight: 1.3 }}>
                            {client || title}
                          </h3>
                        </div>

                        {/* Short summary */}
                        {summaryText && (
                          <p style={{ fontSize: "0.85rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: "1.6", flexGrow: 1 }}>
                            {summaryText}
                          </p>
                        )}

                        {/* Key result highlight */}
                        {resultLines.length > 0 && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.625rem 0.875rem",
                            borderRadius: "6px",
                            backgroundColor: `${color}12`,
                            border: `1px solid ${color}25`,
                          }}>
                            <CheckCircle size={14} style={{ color, flexShrink: 0 }} />
                            <span style={{ fontWeight: 700, fontSize: "0.83rem", color }}>
                              {resultLines[0]}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {tags.slice(0, 3).map((tag, j) => (
                              <span key={j} style={{
                                padding: "0.2rem 0.625rem",
                                borderRadius: "4px",
                                fontSize: "0.68rem",
                                backgroundColor: "var(--g2a-tile)",
                                color: "var(--g2a-text-muted)",
                                border: "1px solid var(--g2a-tile-border)",
                                fontFamily: "Geist Mono, monospace",
                                letterSpacing: "0.02em",
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer row — external links + view details */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid var(--g2a-tile-border)",
                          marginTop: "auto",
                        }}>
                          <CardExternalLinks links={externalLinks} clientName={client || title} accent={color} />
                          {/* Visual "view details" hint — actual navigation is on the parent Link
                              wrapping the whole card, so this is just an affordance, not a link. */}
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            color: "var(--g2a-text-accent)",
                            fontSize: "0.83rem",
                            fontWeight: 600,
                          }}>
                            {t("references.viewDetails")} <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <EmptyState
                variant={activeIndustry === "osszes" ? "no-content" : "no-results"}
                title={
                  activeIndustry === "osszes"
                    ? t("references.empty.allTitle")
                    : t("references.empty.industryTitle")
                }
                description={
                  activeIndustry === "osszes"
                    ? t("references.empty.allDesc")
                    : t("references.empty.industryDesc")
                }
                action={
                  activeIndustry !== "osszes" ? (
                    <button
                      onClick={() => setActiveIndustry("osszes")}
                      className="g2a-btn-secondary"
                      style={{ cursor: "pointer", border: "none", font: "inherit" }}
                    >
                      {t("references.empty.viewAll")}
                    </button>
                  ) : (
                    <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                      <span className="g2a-btn-primary">{t("nav.contact")} <ArrowRight size={16} /></span>
                    </Link>
                  )
                }
              />
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-1)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">{t("references.statsLabel")}</div>
              <h2 className="g2a-section-title">{t("references.statsTitle")}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              {[
                { value: "23+", label: t("references.stats.partners") },
                { value: "8+", label: t("references.stats.industries") },
                { value: "340%", label: t("references.stats.traffic") },
                { value: "4,2x", label: t("references.stats.roas") },
              ].map((stat, i) => (
                <div key={i} className="g2a-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--g2a-amber)", marginBottom: "0.5rem" }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", marginBottom: "1rem" }}>
              {t("references.finalCta.title")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              {t("references.finalCta.desc")}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit">
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: "#fff", color: "#000",
                  padding: "0.875rem 2rem", borderRadius: "6px",
                  fontWeight: 700, textDecoration: "none", cursor: "pointer",
                }}>
                  {t("nav.freeAuditFull")} <ArrowRight size={16} />
                </span>
              </Link>
              <Link href="/kapcsolat">
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: "transparent", color: "var(--g2a-text-primary)",
                  padding: "0.875rem 2rem", borderRadius: "6px",
                  fontWeight: 600, textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.4)", cursor: "pointer",
                }}>
                  {t("references.contactCta")}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
