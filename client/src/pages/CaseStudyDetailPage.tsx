import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Target, Lightbulb, TrendingUp } from "lucide-react";
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

export default function CaseStudyDetailPage() {
  const [, params] = useRoute("/referenciak/:id");
  const id = params?.id ? parseInt(params.id) : null;

  const { data: caseStudies, isLoading } = trpc.content.caseStudies.useQuery();
  const cs = caseStudies?.find(c => c.id === id);

  if (isLoading) {
    return (
      <>
        <ScrollProgressBar />
        <Navigation />
        <main style={{ paddingTop: "100px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--g2a-text-secondary)" }}>Betöltés...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!cs) {
    return (
      <>
        <ScrollProgressBar />
        <Navigation />
        <main style={{ paddingTop: "100px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "var(--g2a-text-primary)", marginBottom: "1rem" }}>Esettanulmány nem található</h1>
            <Link href="/referenciak">
              <span className="g2a-btn-primary">Vissza a referenciákhoz</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const color = INDUSTRY_COLORS[(cs.industry ?? "")] || "var(--g2a-amber)";
  let tags: string[] = [];
  try { tags = JSON.parse(cs.tags || "[]"); } catch { tags = []; }
  const resultLines = cs.results ? cs.results.split(",").map(r => r.trim()).filter(Boolean) : [];

  return (
    <>
      <SeoHead
        title={`${cs.client || cs.title} – Esettanulmány | G2A Marketing`}
        description={cs.challenge ? cs.challenge.slice(0, 160) : `${cs.client || cs.title} marketing esettanulmány – G2A Marketing`}
      />
      <ScrollProgressBar />
      <Navigation />

      <main style={{ paddingTop: "100px" }}>
        {/* Hero */}
        <section style={{
          padding: "4rem 0",
          background: "linear-gradient(135deg, var(--g2a-bg-1) 0%, var(--g2a-bg-2) 100%)",
          position: "relative",
          overflow: "hidden",
          borderBottom: `3px solid ${color}`,
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <Link href="/referenciak">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", cursor: "pointer" }}>
                  <ArrowLeft size={14} /> Vissza a referenciákhoz
                </span>
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "flex-start" }}>
              <div>
                <span style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  backgroundColor: `${color}18`,
                  color: color,
                  marginBottom: "1rem",
                }}>
                  {INDUSTRY_LABELS[(cs.industry ?? "")] || cs.industry || "Marketing"}
                </span>
                <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "var(--g2a-text-primary)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
                  {cs.client || cs.title}
                </h1>
                {cs.title !== cs.client && (
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.1rem", lineHeight: "1.6" }}>{cs.title}</p>
                )}
              </div>

              {resultLines.length > 0 && (
                <div style={{
                  background: `${color}12`,
                  border: `2px solid ${color}40`,
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  textAlign: "center",
                  minWidth: "160px",
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color, lineHeight: 1 }}>
                    {resultLines[0].split(" ")[0]}
                  </div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    {resultLines[0].split(" ").slice(1).join(" ")}
                  </div>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                {tags.map((tag, i) => (
                  <span key={i} style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    backgroundColor: "var(--g2a-bg-1)",
                    color: "var(--g2a-text-secondary)",
                    border: "1px solid var(--g2a-border)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Main content */}
        <section style={{ padding: "4rem 0", backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {cs.challenge && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <Target size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Kihívás</h2>
                    </div>
                    <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", margin: 0 }}>{cs.challenge}</p>
                  </div>
                )}

                {cs.solution && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <Lightbulb size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Megoldás</h2>
                    </div>
                    <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", margin: 0 }}>{cs.solution}</p>
                  </div>
                )}

                {resultLines.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: `${color}18`, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        <TrendingUp size={16} />
                      </div>
                      <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Eredmények</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {resultLines.map((r, i) => (
                        <div key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "8px",
                          backgroundColor: `${color}10`,
                          border: `1px solid ${color}25`,
                        }}>
                          <CheckCircle size={18} style={{ color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color, fontSize: "1rem" }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="g2a-card">
                  <h3 style={{ color: "var(--g2a-text-primary)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                    Projekt adatok
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Ügyfél</div>
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600 }}>{cs.client || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Iparág</div>
                      <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600 }}>{INDUSTRY_LABELS[(cs.industry ?? "")] || cs.industry || "—"}</div>
                    </div>

                  </div>
                </div>

                <div className="g2a-card" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}30` }}>
                  <h3 style={{ color: "var(--g2a-text-primary)", fontWeight: 700, marginBottom: "0.75rem" }}>
                    Hasonló eredményeket szeretnél?
                  </h3>
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                    Kérj ingyenes konzultációt és megmutatjuk, hogyan érhetünk el mérhető növekedést a te vállalkozásodban.
                  </p>
                  <Link href="/ingyenes-audit">
                    <span className="g2a-btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                      Ingyenes Audit <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back nav */}
        <section style={{ padding: "3rem 0", backgroundColor: "var(--g2a-bg-1)", borderTop: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <Link href="/referenciak">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", cursor: "pointer", fontWeight: 600 }}>
                <ArrowLeft size={16} /> Összes referencia
              </span>
            </Link>
            <Link href="/kapcsolat">
              <span className="g2a-btn-primary">Kapcsolatfelvétel <ArrowRight size={14} /></span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
