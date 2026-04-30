import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalized } from "@/../../shared/i18n";
import ProcessIllustration from "@/components/illustrations/ProcessIllustration";
import ServiceIcon from "@/components/illustrations/ServiceIcon";

export default function ServicesPage() {
  const { t, lang } = useLanguage();
  const { data: services } = trpc.content.services.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szolgaltatasok" });

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || t("services.seoTitle")}
        description={pageSeo?.metaDescription || t("services.desc")}
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
              {(services || []).map(service => (
                <Link key={service.id} href={`/szolgaltatasok/${service.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ height: "100%", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "10px", background: "rgba(20,184,166,0.1)" }}>
                        <ServiceIcon slug={service.slug} size={26} />
                      </span>
                      <span style={{ fontFamily: "Geist Mono, monospace", fontSize: "3rem", fontWeight: 700, color: "rgba(20,184,166,0.12)", lineHeight: 1 }}>
                        {service.number || "01"}
                      </span>
                    </div>
                    <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                      {pickLocalized(service, "title", lang)}
                    </h2>
                    <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                      {pickLocalized(service, "shortDescription", lang)}
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
