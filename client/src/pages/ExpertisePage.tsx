import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

export default function ExpertisePage() {
  const { data: industries } = trpc.content.industries.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/szakertelem" });

  return (
    <>
      <SeoHead title={pageSeo?.metaTitle || "Szakértelem – G2A Marketing Pécs"} description={pageSeo?.metaDescription || ""} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "5rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">Szakterületek</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace", marginBottom: "1.25rem", maxWidth: "700px" }}>
              Iparágak, ahol otthon vagyunk
            </h1>
            <p style={{ color: "#b0b0b0", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "600px" }}>
              Tapasztalatunk számos szektorra kiterjed. Pontosan értjük az adott piac kihívásait és lehetőségeit.
            </p>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {(industries || []).map(ind => (
                <div key={ind.id} className="g2a-card">
                  <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(233,17,48,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#e91130" }} />
                  </div>
                  <h2 style={{ color: "#ffffff", fontFamily: "Roboto Mono, monospace", fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.75rem" }}>{ind.name}</h2>
                  {ind.description && <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6 }}>{ind.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "#161616" }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">Együttműködés</div>
            <h2 className="g2a-section-title">Dolgozzunk együtt!</h2>
            <p style={{ color: "#888", maxWidth: "480px", margin: "0 auto 2rem" }}>
              Akármelyik iparágban tevékenykedsz, segítünk a digitális marketing stratégia kidolgozásában.
            </p>
            <Link href="/kapcsolat" className="g2a-btn-primary">
              Ingyenes Konzultáció <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
