import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, BarChart2, Globe, Zap, Shield, TrendingUp } from "lucide-react";

const SEO_CHECKS = [
  { id: "title", label: "Meta Title optimalizáció", desc: "Ellenőrizzük a cím hosszát, kulcsszó-elhelyezést és kattintási arányt." },
  { id: "meta", label: "Meta Description", desc: "Vizsgáljuk a leírás relevanciáját és CTA-tartalmát." },
  { id: "h1", label: "H1 struktúra", desc: "Egyetlen, kulcsszó-gazdag H1 cím megléte." },
  { id: "speed", label: "Oldal betöltési sebesség", desc: "Core Web Vitals: LCP, FID, CLS mérőszámok." },
  { id: "mobile", label: "Mobilbarát megjelenés", desc: "Responsive design és mobil UX ellenőrzése." },
  { id: "ssl", label: "SSL / HTTPS biztonság", desc: "Biztonságos kapcsolat és tanúsítvány érvényessége." },
  { id: "sitemap", label: "XML Sitemap", desc: "Sitemap megléte és Google Search Console beküldése." },
  { id: "schema", label: "Strukturált adatok (Schema)", desc: "JSON-LD implementáció és rich snippet lehetőségek." },
  { id: "backlinks", label: "Backlinkek minősége", desc: "Hivatkozó domainek száma és Domain Authority." },
  { id: "content", label: "Tartalmi relevancia", desc: "Kulcsszó-sűrűség, tartalom mélysége és frissessége." },
];

const BENEFITS = [
  { icon: <BarChart2 size={24} />, title: "Azonnali diagnózis", desc: "Percek alatt megkapod, mi akadályozza a Google rangsorolást." },
  { icon: <TrendingUp size={24} />, title: "Versenyképes elemzés", desc: "Látod, hol állsz a versenytársaidhoz képest." },
  { icon: <Zap size={24} />, title: "Prioritizált teendők", desc: "Konkrét, sorrendbe állított fejlesztési javaslatok." },
  { icon: <Shield size={24} />, title: "Gyors eredmények", desc: "Az első javítások már 2–4 héten belül érezhetők." },
];

export default function SeoAuditPage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <SeoHead
        title="Ingyenes SEO Audit – Weboldal Elemzés | G2A Marketing"
        description="Kérd az ingyenes SEO audit eszközünket! 10 pontos ellenőrzés: meta tagek, sebesség, mobilbarát megjelenés, strukturált adatok és backlinkek. Azonnali diagnózis."
      />
      <ScrollProgressBar />
      <Navigation />

      {/* Hero */}
      <section style={{ paddingTop: "7rem", paddingBottom: "5rem", background: "linear-gradient(135deg, var(--g2a-bg-1) 0%, var(--g2a-bg-2) 100%)", position: "relative", overflow: "hidden" }}>
        <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }} />
        <div className="g2a-container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div className="g2a-section-label" style={{ marginBottom: "1rem" }}>Ingyenes Eszköz</div>
              <h1 className="g2a-headline-xl" style={{ marginBottom: "1.5rem" }}>
                Ingyenes <span className="g2a-gradient-text">SEO Audit</span> – Tudd meg, miért nem rangsorol a weboldalad!
              </h1>
              <p style={{ color: "var(--g2a-text-secondary)", fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2rem" }}>
                10 pontos ellenőrzőlistánk azonnal megmutatja, hol veszíted el a Google forgalmat. Ingyenes, azonnali, konkrét javaslatok.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {["100% ingyenes", "Azonnali eredmény", "Nincs kötelezettség"].map(tag => (
                  <span key={tag} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-amber)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <CheckCircle size={16} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <CheckCircle size={64} style={{ color: "var(--g2a-amber)", margin: "0 auto 1.5rem", display: "block" }} />
                  <h3 style={{ color: "var(--g2a-text-primary)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                    Audit kérés elküldve!
                  </h3>
                  <p style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    24 órán belül elküldjük a részletes SEO audit jelentést a <strong>{email}</strong> email címre.
                  </p>
                  <Link href="/kapcsolat">
                    <span className="g2a-btn-primary">Konzultáció foglalása <ArrowRight size={16} /></span>
                  </Link>
                </div>
              ) : (
                <>
                  <h2 style={{ color: "var(--g2a-text-primary)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Kérd az ingyenes SEO auditot
                  </h2>
                  <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                    Add meg a weboldalad URL-jét és email címed – 24 órán belül elküldjük a részletes elemzést.
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                        Weboldal URL *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Globe size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--g2a-text-secondary)", pointerEvents: "none" }} />
                        <input
                          type="url"
                          placeholder="https://ceged.hu"
                          value={url}
                          onChange={e => setUrl(e.target.value)}
                          required
                          style={{
                            width: "100%", padding: "0.75rem 0.875rem 0.75rem 2.5rem",
                            background: "var(--g2a-bg-1)", border: "1px solid var(--g2a-border)",
                            borderRadius: "0.5rem", color: "var(--g2a-text-primary)",
                            fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", color: "var(--g2a-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                        Email cím *
                      </label>
                      <input
                        type="email"
                        placeholder="nev@ceg.hu"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                          width: "100%", padding: "0.75rem 0.875rem",
                          background: "var(--g2a-bg-1)", border: "1px solid var(--g2a-border)",
                          borderRadius: "0.5rem", color: "var(--g2a-text-primary)",
                          fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="g2a-btn-primary"
                      style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? "Elemzés folyamatban..." : "SEO Audit kérése →"}
                    </button>
                    <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.75rem", textAlign: "center" }}>
                      Adataidat bizalmasan kezeljük. Spam-mentes.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section style={{ padding: "5rem 0", backgroundColor: "var(--g2a-bg-1)" }}>
        <div className="g2a-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="g2a-section-label">10 Pontos Ellenőrzés</div>
            <h2 className="g2a-section-title">Mit vizsgál az SEO audit?</h2>
            <p style={{ color: "var(--g2a-text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>
              Szakértőink minden kritikus SEO tényezőt megvizsgálnak, és prioritizált fejlesztési javaslatokat adnak.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {SEO_CHECKS.map((check, i) => (
              <div key={check.id} style={{
                background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)",
                borderRadius: "0.75rem", padding: "1.25rem",
                display: "flex", gap: "1rem", alignItems: "flex-start",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid var(--g2a-amber)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "var(--g2a-amber)", fontSize: "0.75rem", fontWeight: 700,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ color: "var(--g2a-text-primary)", fontWeight: 600, marginBottom: "0.25rem" }}>{check.label}</div>
                  <div style={{ color: "var(--g2a-text-secondary)", fontSize: "0.875rem", lineHeight: "1.5" }}>{check.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "5rem 0", backgroundColor: "var(--g2a-bg-2)" }}>
        <div className="g2a-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="g2a-section-label">Miért érdemes?</div>
            <h2 className="g2a-section-title">Az audit előnyei</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid var(--g2a-amber)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "var(--g2a-amber)" }}>
                  {b.icon}
                </div>
                <h3 style={{ color: "var(--g2a-text-primary)", fontWeight: 700, marginBottom: "0.5rem" }}>{b.title}</h3>
                <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0", background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)", borderTop: "1px solid var(--g2a-border)" }}>
        <div className="g2a-container" style={{ textAlign: "center" }}>
          <h2 className="g2a-section-title">Készen állsz a növekedésre?</h2>
          <p style={{ color: "var(--g2a-text-secondary)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: "1.7" }}>
            Az ingyenes SEO audit az első lépés a több organikus forgalom és magasabb konverzió felé.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="g2a-btn-primary">
              Ingyenes audit kérése →
            </button>
            <Link href="/kapcsolat">
              <span className="g2a-btn-secondary">Konzultáció foglalása</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
