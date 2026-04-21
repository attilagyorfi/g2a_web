import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const categoryLabelsHu: Record<string, string> = {
  marketing: "Marketing Eszközök",
  ai: "Mesterséges Intelligencia",
  analytics: "Analitika",
  other: "Egyéb",
};
const categoryLabelsEn: Record<string, string> = {
  marketing: "Marketing Tools",
  ai: "Artificial Intelligence",
  analytics: "Analytics",
  other: "Other",
};

export default function TechnologyPage() {
  const { t, lang } = useLanguage();
  const { data: technologies } = trpc.content.technologies.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/technologia" });

  const categoryLabels = lang === "en" ? categoryLabelsEn : categoryLabelsHu;

  const grouped = (technologies || []).reduce((acc, tech) => {
    const cat = tech.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || (lang === "en" ? "Technology – G2A Marketing" : "Technológia – G2A Marketing Pécs")} description={pageSeo?.metaDescription || ""} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{t("technology.sectionLabel")}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem" }}>
              {t("technology.title")}
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              {t("technology.desc")}
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            {Object.entries(grouped).map(([cat, techs]) => (
              <div key={cat} style={{ marginBottom: "3rem" }}>
                <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: "#e91130" }}>// </span>{categoryLabels[cat] || cat}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                  {(techs || []).map(tech => (
                    <div key={tech.id} style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "border-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(233,17,48,0.3)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                      {tech.logo ? (
                        <img src={tech.logo} alt={tech.logoAlt || `${tech.name} logó`} style={{ height: "32px", objectFit: "contain", objectPosition: "left" }} />
                      ) : (
                        <div style={{ width: "32px", height: "32px", backgroundColor: "rgba(233,17,48,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#e91130" }} />
                        </div>
                      )}
                      <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.9rem" }}>{tech.name}</div>
                      {tech.description && <div style={{ color: "#666", fontSize: "0.8125rem", lineHeight: 1.5 }}>{tech.description}</div>}
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
