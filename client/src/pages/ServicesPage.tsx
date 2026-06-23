import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized, pickLocalizedStrict } from "@/../../shared/i18n";
import ProcessIllustration from "@/components/illustrations/ProcessIllustration";
import ServiceIcon from "@/components/illustrations/ServiceIcon";
import SERVICE_CONFIGS_I18N from "@/data/serviceConfigs";

/**
 * Normalised card shape — covers both data sources (DB services + the
 * hand-curated SERVICE_CONFIGS_I18N entries that live as orphan routes
 * under /szolgaltatasok/{slug}). Audit §3.5 caught that the index only
 * listed the 7 DB services; the other 8 service routes existed and were
 * footer-linked but never surfaced here.
 */
type ServiceCard = {
  slug: string;
  title: string;
  shortDescription: string;
  number: string;
};

export default function ServicesPage() {
  const { t, lang } = useLanguage();
  const { data: services } = trpc.content.services.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szolgaltatasok" });

  // Merge: DB-driven services first (preserve their numbering), then the
  // SERVICE_CONFIGS_I18N entries by slug. Dedupe by slug — if a config
  // entry has the same slug as a DB service, the DB version wins.
  const dbCards: ServiceCard[] = (services || []).map((s) => ({
    slug: s.slug,
    title: pickLocalized(s, "title", lang) ?? s.title,
    shortDescription: pickLocalized(s, "shortDescription", lang) ?? "",
    number: s.number || "01",
  }));
  const dbSlugs = new Set(dbCards.map((c) => c.slug));
  const configMap = SERVICE_CONFIGS_I18N[lang] ?? SERVICE_CONFIGS_I18N.hu;
  const configCards: ServiceCard[] = Object.values(configMap)
    .filter((c) => !dbSlugs.has(c.slug))
    .map((c, i) => ({
      slug: c.slug,
      title: c.title,
      shortDescription: c.subtitle,
      // Continue numbering past the DB cards: 08, 09, 10…
      number: String(dbCards.length + 1 + i).padStart(2, "0"),
    }));
  const allCards = [...dbCards, ...configCards];

  return (
    <>
      <SeoHead
        title={pickLocalizedStrict(pageSeo, "metaTitle", lang) || t("services.seoTitle")}
        description={pickLocalizedStrict(pageSeo, "metaDescription", lang) || t("services.desc")}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">
              {t("services.sectionLabel")}
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              {t("services.title")}
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("services.desc")}
            </p>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {allCards.map(card => (
                <Link key={card.slug} href={`/szolgaltatasok/${card.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ height: "100%", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "10px", background: "rgba(20,184,166,0.1)" }}>
                        <ServiceIcon slug={card.slug} size={26} />
                      </span>
                      <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "3rem", fontWeight: 700, color: "rgba(20,184,166,0.12)", lineHeight: 1 }}>
                        {card.number}
                      </span>
                    </div>
                    <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                      {card.title}
                    </h2>
                    <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                      {card.shortDescription}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-brand-teal)", fontSize: "0.875rem", fontWeight: 500 }}>
                      {t("services.details")} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hogyan dolgozunk — 4 lépés ───────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">{t("process.label")}</div>
              <h2 className="g2a-section-title" style={{ textAlign: "center" }}>{t("process.title")}</h2>
              <p className="g2a-section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
                {t("process.subtitle")}
              </p>
            </div>
            <ProcessIllustration />
          </div>
        </section>

        <section style={{ backgroundColor: "var(--g2a-brand-teal)", padding: "4rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, marginBottom: "1rem" }}>
              {t("services.freeConsultationCta")}
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
