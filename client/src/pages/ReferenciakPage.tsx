import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Target, Globe, BarChart3, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

const INDUSTRY_LABELS: Record<string, string> = {
  egeszsegugy: "Egészségügy",
  b2b: "B2B",
  szepsegipari: "Szépségipar",
  jogi: "Jogi",
  autoipari: "Autóipar",
  mernoki: "Mérnöki",
  technologia: "Technológia",
  onkormanyzat: "Önkormányzat",
};

const INDUSTRY_COLORS: Record<string, string> = {
  egeszsegugy: "#10b981",
  b2b: "#3b82f6",
  szepsegipari: "#ec4899",
  jogi: "#6366f1",
  autoipari: "#f59e0b",
  mernoki: "#8b5cf6",
  technologia: "#06b6d4",
  onkormanyzat: "#22c55e",
};

export default function ReferenciakPage() {
  const { data: caseStudies, isLoading } = trpc.content.caseStudies.useQuery();
  const { data: pageSeo } = trpc.content.pageSeo.useQuery({ slug: "/referenciak" });
  const [activeIndustry, setActiveIndustry] = useState("osszes");

  const industries = ["osszes", ...Array.from(new Set((caseStudies || []).map(cs => cs.industry).filter((x): x is string => Boolean(x))))];

  const filtered = activeIndustry === "osszes"
    ? (caseStudies || [])
    : (caseStudies || []).filter(cs => cs.industry === activeIndustry);

  return (
    <>
      <SeoHead
        title={pageSeo?.metaTitle || "Referenciák & Esettanulmányok – G2A Marketing | Valós Eredmények"}
        description={pageSeo?.metaDescription || "Valós marketing eredmények valós ügyfelektől. Esettanulmányok egészségügy, autóipar, B2B és más iparágakból."}
      />
      <ScrollProgressBar />
      <Navigation />

      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          minHeight: "45vh",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse at 60% 40%, rgba(233,17,48,0.08) 0%, transparent 55%), var(--g2a-bg)",
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <div className="g2a-section-label animate-fadeIn">Referenciák</div>
            <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "700px" }}>
              Valós eredmények,{" "}
              <span className="g2a-gradient-text">valós ügyfelektől</span>
            </h1>
            <p className="animate-fadeInUp" style={{
              animationDelay: "0.3s",
              fontSize: "1.1rem",
              color: "var(--g2a-text-secondary)",
              maxWidth: "560px",
              lineHeight: "1.7",
              marginBottom: "2rem",
            }}>
              Nem ígérünk – bizonyítunk. Íme néhány ügyfél esettanulmánya, ahol mérhető eredményeket értünk el.
            </p>
            <div className="animate-fadeInUp" style={{
              animationDelay: "0.45s",
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
            }}>
              {[
                { icon: <TrendingUp size={16} />, text: "150+ sikeres projekt" },
                { icon: <Target size={16} />, text: "8+ iparág" },
                { icon: <Globe size={16} />, text: "10+ ország" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--g2a-amber)" }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter + Cases */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {/* Industry Filter */}
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind)}
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "50px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: activeIndustry === ind ? "var(--g2a-amber)" : "var(--g2a-bg-card)",
                    color: activeIndustry === ind ? "#fff" : "var(--g2a-text-secondary)",
                    border: `1px solid ${activeIndustry === ind ? "var(--g2a-amber)" : "var(--g2a-border)"}`,
                  }}
                >
                  {ind === "osszes" ? "Összes" : (INDUSTRY_LABELS[ind] || ind)}
                </button>
              ))}
            </div>

            {/* Loading */}
            {isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.75rem" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="g2a-card" style={{ height: "380px", animation: "pulse 1.5s infinite" }} />
                ))}
              </div>
            )}

            {/* Case Studies Grid */}
            {!isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.75rem" }}>
                {filtered.map((cs, i) => {
                      const color = INDUSTRY_COLORS[(cs.industry ?? "")] || "var(--g2a-amber)";
                  let tags: string[] = [];
                  try { tags = JSON.parse(cs.tags || "[]"); } catch { tags = []; }
                  const resultLines = cs.results ? cs.results.split(",").map(r => r.trim()).filter(Boolean) : [];

                  return (
                    <div
                      key={cs.id}
                      className="g2a-card"
                      style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}
                    >
                      {/* Color top bar */}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: color }} />

                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", paddingTop: "0.5rem" }}>
                        <div>
                          <span style={{
                            display: "inline-block",
                            padding: "0.2rem 0.625rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            backgroundColor: `${color}18`,
                            color: color,
                            marginBottom: "0.5rem",
                          }}>
                            {INDUSTRY_LABELS[(cs.industry ?? "")] || cs.industry}
                          </span>
                          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", margin: 0, lineHeight: 1.3 }}>
                            {cs.client || cs.title}
                          </h3>
                        </div>
                        <span style={{
                          fontSize: "2.5rem",
                          fontWeight: 800,
                          color: `${color}18`,
                          fontFamily: "'JetBrains Mono', monospace",
                          lineHeight: 1,
                          flexShrink: 0,
                          marginLeft: "0.5rem",
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Challenge */}
                      {cs.challenge && (
                        <div style={{ marginBottom: "1rem" }}>
                          <div style={{ fontSize: "0.7rem", color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>
                            Kihívás
                          </div>
                          <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: "1.6" }}>
                            {cs.challenge.length > 120 ? cs.challenge.slice(0, 120) + "…" : cs.challenge}
                          </p>
                        </div>
                      )}

                      {/* Results */}
                      {resultLines.length > 0 && (
                        <div style={{
                          padding: "1rem",
                          borderRadius: "8px",
                          backgroundColor: `${color}10`,
                          border: `1px solid ${color}25`,
                          marginBottom: "1.25rem",
                          marginTop: "auto",
                        }}>
                          <div style={{ fontSize: "0.7rem", color: color, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
                            Eredmények
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                            {resultLines.slice(0, 3).map((r, j) => (
                              <div key={j} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle size={13} style={{ color, flexShrink: 0 }} />
                                <span style={{ fontWeight: 700, fontSize: "0.9rem", color }}>
                                  {r}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {tags.slice(0, 3).map((tag, j) => (
                            <span key={j} style={{
                              padding: "0.2rem 0.625rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              backgroundColor: "var(--g2a-bg)",
                              color: "var(--g2a-text-muted)",
                              border: "1px solid var(--g2a-border)",
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--g2a-text-muted)" }}>
                <BarChart3 size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <p>Ebben az iparágban jelenleg nincs esettanulmány.</p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label">Számokban</div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                Eredményeink összesítve
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              {[
                { value: "150+", label: "Sikeres projekt" },
                { value: "8+", label: "Iparág" },
                { value: "340%", label: "Átlagos forgalom növekedés" },
                { value: "4,2x", label: "Átlagos ROAS" },
              ].map((stat, i) => (
                <div key={i} className="g2a-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.5rem" }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>
              Te lehetsz a következő sikertörténet
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Kérj ingyenes marketing auditot és megmutatjuk, hogyan érhetünk el hasonló eredményeket a te vállalkozásodban.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/ingyenes-audit" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: "#fff", color: "var(--g2a-amber)",
                padding: "0.875rem 2rem", borderRadius: "6px",
                fontWeight: 700, textDecoration: "none",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Ingyenes Audit kérése <ArrowRight size={16} />
              </a>
              <Link href="/kapcsolat" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: "transparent", color: "var(--g2a-text-primary)",
                padding: "0.875rem 2rem", borderRadius: "6px",
                fontWeight: 600, textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.4)",
              }}>
                Kapcsolatfelvétel
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
