import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const HERO_IMAGE = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop";

const INDUSTRY_ICONS: Record<string, string> = {
  "Egészségügy": "🏥",
  "Szépségipar": "💄",
  "Mérnöki irodák": "⚙️",
  "Autóipar": "🚗",
  "Ügyvédi irodák": "⚖️",
  "Technológia": "💻",
  "Önkormányzat": "🏛️",
  "B2B cégek": "🤝",
  "Vendéglátás": "🍽️",
  "Ingatlan": "🏠",
  "Oktatás": "📚",
  "Sport": "⚽",
  "Divat": "👗",
  "Logisztika": "🚚",
  "Pénzügy": "💰",
  "Fitness": "💪",
};

export default function ExpertisePage() {
  const { data: industries } = trpc.content.industries.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szakertelem" });

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || "Szakterületek – G2A Marketing Pécs"} description={pageSeo?.metaDescription || "Iparágak, ahol a G2A Marketing otthon van: egészségügy, autóipar, technológia, B2B, vendéglátás és még sok más szektorban szerzett tapasztalat."} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* Hero Section */}
        <section style={{
          position: "relative",
          minHeight: "50vh",
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
                <div className="g2a-section-label animate-fadeIn">Szakterületek</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "600px" }}>
                  Iparágak, ahol{" "}
                  <span className="g2a-gradient-text">otthon vagyunk</span>
                </h1>
                <p className="animate-fadeInUp" style={{
                  animationDelay: "0.3s",
                  fontSize: "1.1rem",
                  color: "var(--g2a-text-secondary)",
                  maxWidth: "520px",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}>
                  Tapasztalatunk számos szektorra kiterjed. Pontosan értjük az adott piac kihívásait, vásárlói szokásait és a versenyhelyzetet – ezért tudunk valóban hatékony stratégiát alkotni.
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    "Iparág-specifikus kulcsszó-kutatás és SEO",
                    "Célcsoport-elemzés és buyer persona felépítés",
                    "Versenytárs-analízis és piaci pozicionálás",
                    "Bizonyított eredmények 15+ szektorban",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                      <CheckCircle2 size={16} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.4)", border: "1px solid var(--g2a-border)" }}>
                  <img
                    src={HERO_IMAGE}
                    alt="Iparági szakértelem – G2A Marketing csapat"
                    style={{ width: "100%", height: "380px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">Tapasztalatunk</div>
              <h2 className="g2a-section-title">15+ iparágban szerzett tudás</h2>
              <p style={{ color: "var(--g2a-text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
                Minden szektornak megvannak a saját törvényszerűségei. Mi pontosan értjük ezeket – és erre alapozzuk a stratégiát.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {(industries || []).map(ind => (
                <div key={ind.id} className="g2a-card" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    {INDUSTRY_ICONS[ind.name] || "🎯"}
                  </div>
                  <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.75rem" }}>{ind.name}</h2>
                  {ind.description && <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>{ind.description}</p>}
                  <div style={{ marginTop: "1.25rem" }}>
                    <Link href={`/iparagi/marketing-${ind.name.toLowerCase().replace(/\s+/g, '-').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ő/g, 'o').replace(/ű/g, 'u')}-cegeknek`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-amber)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                      Részletek <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">Együttműködés</div>
            <h2 className="g2a-section-title">Dolgozzunk együtt!</h2>
            <p style={{ color: "var(--g2a-text-muted)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Akármelyik iparágban tevékenykedsz, segítünk a digitális marketing stratégia kidolgozásában és megvalósításában.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/kapcsolat" className="g2a-btn-primary">
                Ingyenes Konzultáció <ArrowRight size={16} />
              </Link>
              <Link href="/ingyenes-audit" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", borderRadius: "8px", border: "1px solid var(--g2a-border)", color: "var(--g2a-text-primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9375rem", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--g2a-amber)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}>
                Marketing Audit Kérése
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
