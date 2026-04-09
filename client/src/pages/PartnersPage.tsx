import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

export default function PartnersPage() {
  const { data: partners } = trpc.content.partners.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/partnereink" });

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || "Partnereink – G2A Marketing Pécs"} description={pageSeo?.metaDescription || ""} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">Referenciák</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1.25rem" }}>
              Partnereink és referenciáink
            </h1>
            <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Büszkék vagyunk arra, hogy számos sikeres vállalkozás bízta ránk digitális marketing feladatait.
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
              {(partners || []).map(partner => (
                <div key={partner.id} style={{ backgroundColor: "#1e1e1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px", gap: "0.75rem", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(233,17,48,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.logoAlt || `${partner.name} logó – G2A Marketing partner`} style={{ maxHeight: "48px", maxWidth: "140px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ color: "var(--g2a-text-secondary)", fontWeight: 600, fontSize: "0.9375rem", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{partner.name}</span>
                  )}
                  {partner.website && (
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                      Weboldal →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section style={{ backgroundColor: "var(--g2a-amber)", padding: "4rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Légy a következő sikertörténetünk!
            </h2>
            <Link href="/kapcsolat" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#fff", color: "var(--g2a-amber)", padding: "0.875rem 2rem", borderRadius: "5px", fontWeight: 600, textDecoration: "none" }}>
              Kapcsolatfelvétel <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
