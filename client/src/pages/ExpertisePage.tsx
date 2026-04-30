import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { pickLocalized } from "@/../../shared/i18n";

export default function ExpertisePage() {
  const { t, lang } = useLanguage();
  const { data: industries } = trpc.content.industries.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szakertelem" });

  const seoTitle = pickLocalized(pageSeo, "metaTitle", lang) || "Szakértelem – G2A Marketing Pécs";
  const seoDesc = pickLocalized(pageSeo, "metaDescription", lang);

  return (
    <>
      <SeoHead title={seoTitle} description={seoDesc} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("expertise.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              {t("expertise.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("expertise.desc")}
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {(industries || []).map(ind => (
                <div key={ind.id} className="g2a-card">
                  <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(20,184,166,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--g2a-brand-teal)" }} />
                  </div>
                  <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                    {pickLocalized(ind, "name", lang)}
                  </h2>
                  {pickLocalized(ind, "description", lang) && (
                    <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      {pickLocalized(ind, "description", lang)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-3)" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">{t("about.finalCta.title")}</div>
            <h2 className="g2a-section-title">{t("about.finalCta.title")}</h2>
            <p style={{ color: "#888", maxWidth: "480px", margin: "0 auto 2rem" }}>
              {t("about.finalCta.desc")}
            </p>
            <Link href="/kapcsolat" className="g2a-btn-primary">
              {t("common.contactUs")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
