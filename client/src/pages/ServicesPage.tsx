import { Link } from "wouter";
import { ArrowRight, Globe, Palette, BarChart3, Share2, Target, Search, Code2, Bot, MousePointerClick, Facebook, FileText, Zap, Leaf, Users, Globe2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const serviceIconMap: Record<string, React.ReactNode> = {
  lokalizacio: <Globe size={24} />,
  arculattervezes: <Palette size={24} />,
  hirdeteskezeles: <BarChart3 size={24} />,
  "kozossegi-media": <Share2 size={24} />,
  "strategiai-marketing": <Target size={24} />,
  "keresőoptimalizálas": <Search size={24} />,
  webfejlesztes: <Code2 size={24} />,
  "ai-marketing": <Bot size={24} />,
  "ppc-google-ads": <MousePointerClick size={24} />,
  "meta-hirdetes": <Facebook size={24} />,
  tartalommarketing: <FileText size={24} />,
  "marketing-automatizacio": <Zap size={24} />,
  "esg-kommunikacio": <Leaf size={24} />,
  "employer-branding": <Users size={24} />,
  "nemzetkozi-marketing": <Globe2 size={24} />,
};

export default function ServicesPage() {
  const { data: services } = trpc.content.services.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szolgaltatasok" });

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || "Szolgáltatások – G2A Marketing Pécs"} description={pageSeo?.metaDescription || ""} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">Amit kínálunk</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              Teljes körű digitális marketing megoldások
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Minden, amire vállalkozásodnak szüksége van a digitális sikerhez – egy helyen.
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {(services || []).map(service => (
                <Link key={service.id} href={`/szolgaltatasok/${service.slug}`} style={{ textDecoration: "none" }}>
                  <div className="g2a-card" style={{ height: "100%", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "10px", background: "rgba(233,17,48,0.1)", color: "#e91130" }}>{serviceIconMap[service.slug] || <Target size={24} />}</span>
                      <span style={{ fontFamily: "Roboto Mono, monospace", fontSize: "3rem", fontWeight: 700, color: "rgba(233,17,48,0.12)", lineHeight: 1 }}>{service.number || "01"}</span>
                    </div>
                    <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>{service.title}</h2>
                    <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{service.shortDescription}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#e91130", fontSize: "0.875rem", fontWeight: 500 }}>
                      Részletek <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section style={{ backgroundColor: "#e91130", padding: "4rem 0" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontFamily: "Roboto Mono, monospace", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Kérj ingyenes konzultációt!</h2>
            <Link href="/kapcsolat" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#fff", color: "#e91130", padding: "0.875rem 2rem", borderRadius: "5px", fontWeight: 600, textDecoration: "none" }}>
              Kapcsolatfelvétel <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
