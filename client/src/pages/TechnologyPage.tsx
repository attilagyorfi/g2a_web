import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { pickLocalized } from "@/../../shared/i18n";

const CATEGORY_LABELS: Record<"hu" | "en" | "zh", Record<string, string>> = {
  hu: {
    marketing: "Marketing Eszközök",
    ai: "Mesterséges Intelligencia",
    analytics: "Analitika",
    other: "Egyéb",
  },
  en: {
    marketing: "Marketing Tools",
    ai: "Artificial Intelligence",
    analytics: "Analytics",
    other: "Other",
  },
  zh: {
    marketing: "营销工具",
    ai: "人工智能",
    analytics: "分析工具",
    other: "其他",
  },
};

export default function TechnologyPage() {
  const { t, lang } = useLanguage();
  const { data: technologies } = trpc.content.technologies.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/technologia" });

  const categoryLabels = CATEGORY_LABELS[lang];

  const grouped = (technologies || []).reduce((acc, tech) => {
    const cat = tech.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <>
      <SeoHead title={pickLocalized(pageSeo, "metaTitle", lang) || t("technology.seoTitle")} description={pickLocalized(pageSeo, "metaDescription", lang) || t("technology.seoDesc")} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("technology.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem" }}>
              {t("technology.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("technology.desc")}
            </p>
          </div>
        </section>
        {/* Methodology / "why this stack" block — audit P2.
            Previously the page jumped straight from a one-paragraph
            intro to a flat tool grid, which read as a shopping list.
            This narrative bridge tells the visitor what the stack is
            actually for and how we pick tools. */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)", paddingTop: 0 }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: 1100 }}>
              <div>
                <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--g2a-brand-teal)" }}>01 </span>
                  {t("technology.methodology.fitTitle")}
                </h3>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                  {t("technology.methodology.fitDesc")}
                </p>
              </div>
              <div>
                <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--g2a-brand-teal)" }}>02 </span>
                  {t("technology.methodology.dataTitle")}
                </h3>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                  {t("technology.methodology.dataDesc")}
                </p>
              </div>
              <div>
                <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--g2a-brand-teal)" }}>03 </span>
                  {t("technology.methodology.ownTitle")}
                </h3>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                  {t("technology.methodology.ownDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {Object.entries(grouped).map(([cat, techs]) => (
              <div key={cat} style={{ marginBottom: "3rem" }}>
                <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: "var(--g2a-brand-teal)" }}>// </span>{categoryLabels[cat] || cat}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                  {(techs || []).map(tech => (
                    <div key={tech.id} style={{ backgroundColor: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: "8px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "border-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                      {tech.logo ? (
                        <img src={tech.logo} alt={tech.logoAlt || `${tech.name} logó`} style={{ height: "32px", objectFit: "contain", objectPosition: "left" }} />
                      ) : (
                        <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(20,184,166,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--g2a-brand-teal)" }} />
                        </div>
                      )}
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>{tech.name}</div>
                      {pickLocalized(tech, "description", lang) && (
                        <div style={{ color: "#666", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                          {pickLocalized(tech, "description", lang)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
