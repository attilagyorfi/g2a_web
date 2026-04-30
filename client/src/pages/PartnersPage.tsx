import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { pickLocalized } from "@/../../shared/i18n";

export default function PartnersPage() {
  const { t, lang } = useLanguage();
  const { data: partners } = trpc.content.partners.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/partnereink" });

  const seoTitle = pickLocalized(pageSeo, "metaTitle", lang) || t("partners.seoTitle");
  const seoDesc = pickLocalized(pageSeo, "metaDescription", lang) || t("partners.seoDesc");

  return (
    <>
      <SeoHead title={seoTitle} description={seoDesc} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("partners.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem" }}>
              {t("partners.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("partners.desc")}
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {(partners || []).map(partner => {
                const desc = pickLocalized(partner, "description", lang);
                return (
                  <div key={partner.id} style={{ backgroundColor: "var(--g2a-bg-card)", border: "1px solid var(--g2a-border)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px", gap: "0.75rem", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.logoAlt || `${partner.name} – G2A Marketing`} style={{ maxHeight: "48px", maxWidth: "140px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "var(--g2a-text-secondary)", fontWeight: 600, fontSize: "0.9375rem", textAlign: "center", fontFamily: "Geist Mono, monospace" }}>{partner.name}</span>
                    )}
                    {desc && (
                      <span style={{ color: "#666", fontSize: "0.75rem", textAlign: "center", lineHeight: 1.4 }}>{desc}</span>
                    )}
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" style={{ color: "#666", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#14B8A6")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                        {t("partners.visitWebsite")} →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section style={{ backgroundColor: "var(--g2a-brand-teal)", padding: "4rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
              {t("partners.nextStoryTitle")}
            </h2>
            <Link href="/kapcsolat" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#fff", color: "var(--g2a-brand-teal)", padding: "0.875rem 2rem", borderRadius: "5px", fontWeight: 600, textDecoration: "none" }}>
              {t("common.contactUs")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
