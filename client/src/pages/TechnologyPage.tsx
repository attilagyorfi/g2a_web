import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const categoryLabels: Record<string, string> = {
  marketing: "Marketing Eszközök",
  ai: "Mesterséges Intelligencia",
  analytics: "Analitika",
  other: "Egyéb",
};

const categoryIcons: Record<string, string> = {
  marketing: "📣",
  ai: "🤖",
  analytics: "📊",
  other: "🔧",
};

export default function TechnologyPage() {
  const { data: technologies } = trpc.content.technologies.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/technologia" });

  const grouped = (technologies || []).reduce((acc, t) => {
    const cat = t.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {} as Record<string, typeof technologies>);

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "Technológia – G2A Marketing Pécs"}
        description={pageSeo?.metaDescription || "A G2A Marketing a legmodernebb marketing és AI eszközöket alkalmazza: Google Ads, Meta Business, HubSpot, ChatGPT, Semrush és még sok más platform."}
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
                <div className="g2a-section-label animate-fadeIn">Eszközök</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
                  Technológiák, amelyekkel{" "}
                  <span className="g2a-gradient-text">dolgozunk</span>
                </h1>
                <p className="animate-fadeInUp" style={{
                  animationDelay: "0.3s",
                  fontSize: "1.1rem",
                  color: "var(--g2a-text-secondary)",
                  maxWidth: "520px",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}>
                  A legmodernebb marketing és AI eszközöket alkalmazzuk, hogy ügyfeleink mindig a legjobb eredményeket kapják. Adatokra épített döntések, valós időben követett kampányok.
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  {[
                    { num: "30+", label: "Eszköz" },
                    { num: "4", label: "Kategória" },
                    { num: "100%", label: "Adatvezérelt" },
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
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop"
                    alt="Marketing technológiák – G2A Marketing eszköztár"
                    style={{ width: "100%", height: "360px", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Grid */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {Object.entries(grouped).map(([cat, techs]) => (
              <div key={cat} style={{ marginBottom: "3.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--g2a-border)" }}>
                  <span style={{ fontSize: "1.5rem" }}>{categoryIcons[cat] || "🔧"}</span>
                  <h2 style={{ color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 600 }}>
                    {categoryLabels[cat] || cat}
                  </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                  {(techs || []).map(tech => (
                    <div key={tech.id}
                      className="g2a-card"
                      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--g2a-amber)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--g2a-border)"; }}>
                      {tech.logo ? (
                        <img src={tech.logo} alt={tech.logoAlt || `${tech.name} logó`} style={{ height: "32px", objectFit: "contain", objectPosition: "left", marginBottom: "0.75rem" }} />
                      ) : (
                        <div style={{ width: "36px", height: "36px", backgroundColor: "var(--g2a-amber-light)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--g2a-amber)" }} />
                        </div>
                      )}
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "0.375rem" }}>{tech.name}</div>
                      {tech.description && <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>{tech.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <div className="g2a-section-label">Kezdjük el</div>
            <h2 className="g2a-section-title">Készen állsz az adatvezérelt marketingre?</h2>
            <p style={{ color: "var(--g2a-text-muted)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Ezekkel az eszközökkel dolgozunk a te kampányaidon is – átlátható riportokkal és valós eredményekkel.
            </p>
            <Link href="/kapcsolat" className="g2a-btn-primary">
              Konzultáció Kérése <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
