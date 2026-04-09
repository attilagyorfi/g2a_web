import { Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

export default function PartnersPage() {
  const { data: partners } = trpc.content.partners.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/partnereink" });

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "Partnereink – G2A Marketing Pécs"}
        description={pageSeo?.metaDescription || "A G2A Marketing 23 sikeres partner digitális marketing stratégiáját valósította meg. Ismerd meg referenciáinkat és eredményeinket."}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          position: "relative",
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse at 60% 40%, rgba(245,158,11,0.08) 0%, transparent 55%), var(--g2a-bg)",
          padding: "5rem 0",
          overflow: "hidden",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label animate-fadeIn">Referenciák</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
                  Partnereink és{" "}
                  <span className="g2a-gradient-text">referenciáink</span>
                </h1>
                <p className="animate-fadeInUp" style={{
                  animationDelay: "0.3s",
                  fontSize: "1.1rem",
                  color: "var(--g2a-text-secondary)",
                  maxWidth: "520px",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}>
                  Büszkék vagyunk arra, hogy 23 sikeres vállalkozás bízta ránk digitális marketing feladatait. Minden partner egy-egy sikertörténet – valós számokkal, valós eredményekkel.
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                  {[
                    { num: "23+", label: "Aktív partner" },
                    { num: "150+", label: "Sikeres projekt" },
                    { num: "8+", label: "Iparág" },
                    { num: "5+", label: "Év tapasztalat" },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace" }}>{s.num}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", border: "1px solid var(--g2a-border)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop"
                    alt="G2A Marketing partnerek – sikeres együttműködések"
                    style={{ width: "100%", height: "360px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">Ügyfeleink</div>
              <h2 className="g2a-section-title">Akik megbíztak bennünk</h2>
              <p style={{ color: "var(--g2a-text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
                Különböző iparágakból, különböző méretű vállalkozások – de mindegyikük közös célja volt: mérhető marketing eredmények elérése.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {(partners || []).map(partner => (
                <div key={partner.id}
                  className="g2a-card"
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.logoAlt || `${partner.name} logó`}
                        style={{ maxHeight: "40px", maxWidth: "120px", objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "10px",
                        background: "var(--g2a-amber-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--g2a-amber)", fontWeight: 800, fontSize: "1.1rem",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    {partner.category && (
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600, padding: "0.25rem 0.625rem",
                        borderRadius: "20px", backgroundColor: "var(--g2a-amber-light)",
                        color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        {partner.category}
                      </span>
                    )}
                  </div>
                  <h3 style={{ color: "var(--g2a-text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "0.625rem" }}>
                    {partner.name}
                  </h3>
                  {partner.description && (
                    <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                      {partner.description.length > 180 ? partner.description.substring(0, 180) + "..." : partner.description}
                    </p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-amber)", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                      Weboldal <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">Csatlakozz</div>
            <h2 className="g2a-section-title">Légy a következő sikertörténetünk!</h2>
            <p style={{ color: "var(--g2a-text-muted)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Készen állsz arra, hogy a te vállalkozásod is felkerüljön a sikeres partnerek listájára?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/kapcsolat" className="g2a-btn-primary">
                Kapcsolatfelvétel <ArrowRight size={16} />
              </Link>
              <Link href="/ingyenes-audit" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", borderRadius: "8px", border: "1px solid var(--g2a-border)", color: "var(--g2a-text-primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9375rem", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--g2a-amber)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}>
                Ingyenes Marketing Audit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
