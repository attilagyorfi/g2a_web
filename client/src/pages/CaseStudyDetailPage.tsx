import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CloudinaryImage from "@/components/CloudinaryImage";
import { ogImageUrl } from "@/lib/cloudinary";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Target, Lightbulb, TrendingUp, Briefcase, Tag as TagIcon, ExternalLink, Facebook, Instagram, Linkedin, Youtube, Calendar } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";
import { translateCaseStudyTag } from "@/lib/caseStudyTags";

const INDUSTRY_LABELS: Record<string, string> = {
  egeszsegugy: "Egészségügy",
  b2b: "B2B",
  szepsegipari: "Szépségipar",
  jogi: "Jogi",
  autoipari: "Autóipar",
  mernoki: "Mérnöki",
  technologia: "Technológia",
  onkormanyzat: "Önkormányzat",
  // Audit fix: missing curated labels for industries the admin had
  // added with bare ascii slugs. Restores proper Hungarian spelling.
  kereskedelem: "Kereskedelem",
  vendeglatas: "Vendéglátás",
  kozlekedes: "Közlekedés",
  kreativ: "Kreatív",
  ipari: "Ipari",
  fintech: "Fintech",
  saas: "SaaS",
};

/** Fallback formatter for industry slugs not listed above — capitalise
 *  the first letter so freshly-added slugs render reasonably. */
function prettifySlug(slug: string): string {
  if (!slug) return slug;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

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
 * Renders the icon + label external link buttons in the case study hero.
 * Each link opens in a new tab with proper rel attrs. Unknown platform keys
 * fall back to a generic external-link icon.
 */
function DetailLinkBar({
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
  const LABEL_MAP: Record<string, string> = {
    website: "Weboldal",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
  };
  const entries = Object.entries(links).filter(([, url]) => Boolean(url));
  return (
    <>
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${clientName} – ${LABEL_MAP[key] ?? key}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "var(--g2a-tile)",
            border: "1px solid var(--g2a-tile-border)",
            color: "var(--g2a-text-secondary)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textDecoration: "none",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${accent}1a`;
            e.currentTarget.style.borderColor = `${accent}55`;
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--g2a-tile)";
            e.currentTarget.style.borderColor = "var(--g2a-tile-border)";
            e.currentTarget.style.color = "var(--g2a-text-secondary)";
          }}
        >
          {ICON_MAP[key] ?? <ExternalLink size={13} />}
          {LABEL_MAP[key] ?? key}
        </a>
      ))}
    </>
  );
}

export default function CaseStudyDetailPage() {
  const [, params] = useRoute("/referenciak/:slug");
  const slug = params?.slug || "";
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();

  // Single tRPC query reused — fetches all case studies and we filter by slug
  // client-side. With ~28 case studies this is cheaper than a per-slug RPC,
  // and the list is also already cached for the listing page.
  const { data: caseStudies, isLoading } = trpc.content.caseStudies.useQuery();
  const cs = caseStudies?.find(c => c.slug === slug);

  if (isLoading) {
    return (
      <>
        <ScrollProgressBar />
        <Navigation />
        <main style={{ paddingTop: "100px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--g2a-text-secondary)" }}>{t("common.loading")}</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!cs) {
    return (
      <>
        {/* Mistyped slug — don't let crawlers index the empty shell. */}
        <SeoHead
          title={`${t("cs.notFound")} — G2A Marketing`}
          description={t("cs.notFound")}
          noIndex
        />
        <ScrollProgressBar />
        <Navigation />
        <main style={{ paddingTop: "100px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "var(--g2a-text-primary)", marginBottom: "1rem" }}>{t("cs.notFound")}</h1>
            <Link href="/referenciak">
              <span className="g2a-btn-primary">{t("references.back")}</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const title = pickLocalized(cs, "title", lang);
  const client = pickLocalized(cs, "client", lang);
  const industry = pickLocalized(cs, "industry", lang);
  const challenge = pickLocalized(cs, "challenge", lang);
  const solution = pickLocalized(cs, "solution", lang);
  const results = pickLocalized(cs, "results", lang);
  const metaTitle = pickLocalized(cs, "metaTitle", lang);
  const metaDesc = pickLocalized(cs, "metaDescription", lang);

  const color = INDUSTRY_COLORS[(cs.industry ?? "")] || "var(--g2a-amber)";
  let tags: string[] = [];
  try { tags = JSON.parse(cs.tags || "[]"); } catch { tags = []; }
  let externalLinks: Record<string, string> = {};
  try { externalLinks = JSON.parse(cs.externalLinks || "{}"); } catch { externalLinks = {}; }
  // Results render as checkmark chips. The field historically held
  // comma-separated phrases, but the real content is full sentences
  // (with internal commas) or semicolon-separated clauses — splitting
  // on commas broke chips mid-sentence ("Korszerű" / "mobilbarát
  // weboldal" / …). Split on semicolons when the author used them,
  // otherwise on sentence boundaries; trailing periods are stripped
  // per chip. Handles both Latin (". ") and CJK ("。") sentences.
  const splitResults = (s: string) =>
    /[;；]/.test(s) ? s.split(/[;；]/) : s.split(/\.\s+|。/);
  const resultLines = results
    ? splitResults(results).map(r => r.trim().replace(/[.。]\s*$/, "")).filter(Boolean)
    : [];

  return (
    <>
      <SeoHead
        title={metaTitle || `${client || title} – ${t("references.title")} | G2A Marketing`}
        description={metaDesc || (challenge ? challenge.slice(0, 160) : `${client || title} – G2A Marketing`)}
        ogImage={cs.featuredImage || ogImageUrl(client || title, t("references.title"))}
      />
      <ScrollProgressBar />
      <Navigation />

      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          padding: "4rem 0",
          background: `radial-gradient(ellipse at 70% 30%, ${color}1f, transparent 55%), radial-gradient(ellipse at 20% 70%, ${color}10, transparent 55%), var(--g2a-bg)`,
          position: "relative",
          overflow: "hidden",
          borderBottom: `3px solid ${color}`,
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
          {/* Soft accent glow blob */}
          <div style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: 320,
            height: 320,
            background: `radial-gradient(circle, ${color}24 0%, transparent 65%)`,
            filter: "blur(50px)",
            pointerEvents: "none",
          }} />

          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            {/* Back link */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: "1.75rem" }}
            >
              <Link href="/referenciak" style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                  <ArrowLeft size={13} /> {t("references.back")}
                </span>
              </Link>
            </motion.div>

            <div className="g2a-service-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 280px)", gap: "2.5rem", alignItems: "center" }}>
              <div>
                {/* Logo + meta row */}
                {(cs.logoImage || cs.projectYear) && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}
                  >
                    {cs.logoImage && (
                      <div style={{
                        width: 64,
                        height: 64,
                        padding: 10,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid var(--g2a-tile-border)",
                        boxShadow: "0 8px 18px -8px rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <CloudinaryImage
                          src={cs.logoImage}
                          alt={cs.logoImageAlt || `${client || title} logó`}
                          width={64}
                          height={64}
                          widths={[64, 128]}
                          sizes="64px"
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                        />
                      </div>
                    )}
                    {cs.projectYear && (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        borderRadius: 999,
                        background: "var(--g2a-tile)",
                        border: "1px solid var(--g2a-tile-border)",
                        color: "var(--g2a-text-secondary)",
                        fontFamily: "Geist Mono, monospace",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                      }}>
                        <Calendar size={11} style={{ color }} />
                        {cs.projectYear}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Industry badge */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ marginBottom: "1.25rem" }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: `${color}1f`,
                    border: `1px solid ${color}40`,
                    color,
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                    <Briefcase size={9} />
                    {lang === "hu" ? (INDUSTRY_LABELS[(cs.industry ?? "")] || prettifySlug(industry || "") || "Marketing") : (industry || "Marketing")}
                  </span>
                </motion.div>

                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  style={{
                    fontSize: "clamp(1.85rem, 3.8vw, 2.85rem)",
                    fontWeight: 800,
                    color: "var(--g2a-text-primary)",
                    fontFamily: "Geist, sans-serif",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    marginBottom: title !== client ? "0.75rem" : "0",
                  }}
                >
                  {client || title}
                </motion.h1>
                {title !== client && (
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    style={{ color: "var(--g2a-text-secondary)", fontSize: "1.1rem", lineHeight: "1.6", fontFamily: "Geist, sans-serif" }}
                  >
                    {title}
                  </motion.p>
                )}

                {/* External links bar */}
                {Object.keys(externalLinks).length > 0 && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ display: "flex", gap: 8, marginTop: "1.25rem", flexWrap: "wrap" }}
                  >
                    <DetailLinkBar links={externalLinks} clientName={client || title} accent={color} />
                  </motion.div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1.5rem", alignItems: "center" }}
                  >
                    <TagIcon size={11} style={{ color: "var(--g2a-text-muted)" }} />
                    {tags.map((tag, i) => (
                      <span key={i} style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: "0.68rem",
                        backgroundColor: "var(--g2a-tile)",
                        color: "var(--g2a-text-secondary)",
                        border: "1px solid var(--g2a-tile-border)",
                        fontFamily: "Geist Mono, monospace",
                        letterSpacing: "0.02em",
                      }}>
                        {translateCaseStudyTag(tag, lang)}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Headline result KPI card */}
              {resultLines.length > 0 && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: `linear-gradient(135deg, ${color}14, transparent)`,
                    border: `1px solid ${color}40`,
                    borderRadius: 18,
                    padding: "1.75rem 1.5rem",
                    textAlign: "center",
                    minWidth: 200,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 48px -16px rgba(0,0,0,0.5), 0 0 32px -8px ${color}55`,
                  }}
                >
                  <div style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.6rem",
                    color: "var(--g2a-text-muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}>
                    <TrendingUp size={11} style={{ color }} />
                    Eredmény
                  </div>
                  <div style={{
                    fontFamily: "Geist, sans-serif",
                    fontSize: "2.4rem",
                    fontWeight: 800,
                    color,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    filter: `drop-shadow(0 0 12px ${color}55)`,
                  }}>
                    {resultLines[0].split(" ")[0]}
                  </div>
                  <div style={{
                    color: "var(--g2a-text-secondary)",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.72rem",
                    marginTop: 8,
                    letterSpacing: "0.04em",
                  }}>
                    {resultLines[0].split(" ").slice(1).join(" ")}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section style={{ padding: "4rem 0", backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {challenge && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <Target size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{t("references.challenge")}</h2>
                    </div>
                    <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", margin: 0 }}>{challenge}</p>
                  </div>
                )}

                {solution && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <Lightbulb size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{t("references.solution")}</h2>
                    </div>
                    <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", margin: 0 }}>{solution}</p>
                  </div>
                )}

                {resultLines.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <TrendingUp size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{t("references.results")}</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {resultLines.map((r, i) => (
                        <div key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "8px",
                          backgroundColor: `${color}10`,
                          border: `1px solid ${color}25`,
                        }}>
                          <CheckCircle size={18} style={{ color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color, fontSize: "1rem" }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="g2a-card">
                  <h3 style={{ color: "var(--g2a-text-primary)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                    {t("cs.projectData")}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("iparagi.caseClient")}</div>
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600 }}>{client || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("cs.industryLabel")}</div>
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600 }}>{lang === "hu" ? (INDUSTRY_LABELS[(cs.industry ?? "")] || prettifySlug(industry || "") || "—") : (industry || "—")}</div>
                    </div>
                    {cs.projectYear && (
                      <div>
                        <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{t("cs.startYear")}</div>
                        <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600 }}>{cs.projectYear}</div>
                      </div>
                    )}
                    {Object.keys(externalLinks).length > 0 && (
                      <div>
                        <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>{t("cs.links")}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <DetailLinkBar links={externalLinks} clientName={client || title} accent={color} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="g2a-card" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}>
                  <h3 style={{ color: "var(--g2a-text-primary)", fontWeight: 700, marginBottom: "0.75rem" }}>
                    {t("cs.similarResultsTitle")}
                  </h3>
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                    {t("cs.similarResultsDesc")}
                  </p>
                  <Link href="/ingyenes-audit">
                    <span className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                      {t("nav.freeAudit")} <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back nav */}
        <section style={{ padding: "3rem 0", backgroundColor: "var(--g2a-bg-1)", borderTop: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <Link href="/referenciak">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", cursor: "pointer", fontWeight: 600 }}>
                <ArrowLeft size={16} /> {t("home.allReferences")}
              </span>
            </Link>
            <Link href="/kapcsolat">
              <span className="g2a-btn-primary">{t("references.contactCta")} <ArrowRight size={14} /></span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
