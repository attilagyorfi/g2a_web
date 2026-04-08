import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { ArrowRight, Target, Brain, Globe, Zap, Shield, Award, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const el = ref.current;
    if (el) el.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

const TEAM = [
  { name: "Gál Gábor", role: "Alapító & Stratégiai Vezető", desc: "10+ év B2B marketing tapasztalat, 8+ iparágban.", initial: "G" },
  { name: "Marketing Csapat", role: "PPC & SEO Specialisták", desc: "Google Ads, Meta Ads és SEO szakértők.", initial: "M" },
  { name: "Kreatív Csapat", role: "Design & Webfejlesztés", desc: "Brand design, UX és modern webfejlesztés.", initial: "K" },
  { name: "Stratégiai Csapat", role: "Tartalom & AI Specialisták", desc: "AI-alapú tartalomgyártás és marketing automatizáció.", initial: "S" },
];

const VALUES_LIST = [
  { icon: <Target size={20} />, title: "Eredményorientált", desc: "Minden döntésünket az üzleti eredmény vezérli, nem a látszat." },
  { icon: <Brain size={20} />, title: "Stratégiai gondolkodás", desc: "Nem csak kivitelezünk – üzleti stratégiát alkotunk." },
  { icon: <Globe size={20} />, title: "Globális szemlélet", desc: "Lokális tudás, nemzetközi tapasztalat." },
  { icon: <Zap size={20} />, title: "Agilis működés", desc: "Gyors reakcióidő és rugalmas alkalmazkodás." },
  { icon: <Shield size={20} />, title: "Átláthatóság", desc: "Részletes riportok, nyílt kommunikáció." },
  { icon: <Award size={20} />, title: "Minőség", desc: "Prémium minőség minden projektnél, kompromisszumok nélkül." },
];

const MILESTONES = [
  { year: "2018", event: "G2A Marketing megalapítása Pécsett" },
  { year: "2019", event: "Első 20 ügyfél, egészségügyi és autóipari specializáció" },
  { year: "2020", event: "Digitális transzformáció – teljes online marketing ökoszisztéma" },
  { year: "2021", event: "Nemzetközi terjeszkedés – 5+ ország" },
  { year: "2022", event: "AI integráció a marketing folyamatokba" },
  { year: "2023", event: "100+ sikeres projekt mérföldkő" },
  { year: "2024", event: "B2B specializáció és employer branding divízió" },
  { year: "2025", event: "150+ projekt, 8 iparág, 10+ ország" },
];

export default function RolunkPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);

  return (
    <>
      <SeoHead
        title="Rólunk – G2A Marketing | Adatvezérelt B2B Marketing Ügynökség"
        description="Ismerd meg a G2A Marketing csapatát. 2018 óta segítünk B2B cégeknek mérhető marketing eredményeket elérni. Stratégiai gondolkodás, AI-alapú megoldások, 150+ sikeres projekt."
      />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 60% 40%, rgba(233,17,48,0.08) 0%, transparent 60%), var(--g2a-bg)",
          paddingTop: "6rem",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div className="g2a-section-label animate-fadeIn">Rólunk</div>
            <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "700px" }}>
              Stratégiai partnerek a <span className="g2a-gradient-text">növekedésedben</span>
            </h1>
            <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.15rem", color: "var(--g2a-text-secondary)", maxWidth: "600px", lineHeight: "1.7", fontFamily: "Inter, sans-serif" }}>
              2018 óta segítünk B2B cégeknek mérhető marketing eredményeket elérni. Nem csak ügynökség vagyunk – stratégiai partnerek vagyunk a hosszú távú növekedésben.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "3rem 0", backgroundColor: "var(--g2a-bg-2)", borderTop: "1px solid var(--g2a-border)", borderBottom: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
              {[
                { num: "2018", label: "Alapítás éve" },
                { num: "150+", label: "Sikeres projekt" },
                { num: "8+", label: "Iparág" },
                { num: "10+", label: "Ország" },
                { num: "98%", label: "Elégedett ügyfél" },
              ].map((s, i) => (
                <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="g2a-stat-number">{s.num}</div>
                  <div className="g2a-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">Történetünk</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">Hogyan kezdődött?</h2>
                <p className="reveal reveal-delay-2" style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem", fontFamily: "Inter, sans-serif" }}>
                  A G2A Marketing 2018-ban alakult Pécsett, azzal a céllal, hogy a kis- és középvállalkozásoknak is elérhető legyen a prémium minőségű, adatvezérelt marketing.
                </p>
                <p className="reveal reveal-delay-3" style={{ color: "var(--g2a-text-secondary)", lineHeight: "1.8", marginBottom: "2rem", fontFamily: "Inter, sans-serif" }}>
                  Ma már 8+ iparágban, 10+ országban dolgozunk, és minden projektünkbe integráljuk a legújabb AI-alapú megoldásokat. Büszkék vagyunk arra, hogy ügyfeleink 98%-a elégedett az eredményekkel.
                </p>
                <div className="reveal reveal-delay-4">
                  <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-primary">Dolgozzunk együtt <ArrowRight size={16} /></span>
                  </Link>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {MILESTONES.map((m, i) => (
                  <div key={i} className={`reveal reveal-delay-${(i % 4) + 1}`} style={{ display: "flex", gap: "1.25rem", paddingBottom: "1.25rem", position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#e91130", flexShrink: 0, marginTop: "0.35rem" }} />
                      {i < MILESTONES.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "var(--g2a-border)", marginTop: "4px" }} />}
                    </div>
                    <div style={{ paddingBottom: "0.5rem" }}>
                      <span style={{ fontFamily: "Roboto Mono, monospace", fontSize: "0.75rem", color: "#e91130", fontWeight: 600, letterSpacing: "0.08em" }}>{m.year}</span>
                      <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: "0.25rem 0 0" }}>{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">Értékeink</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Amiben hiszünk</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {VALUES_LIST.map((v, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", gap: "1rem" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{v.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{v.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">Csapat</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Kik vagyunk?</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {TEAM.map((member, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${i + 1}`} style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    backgroundColor: "rgba(233,17,48,0.12)", border: "2px solid rgba(233,17,48,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#e91130",
                  }}>
                    {member.initial}
                  </div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{member.name}</div>
                  <div style={{ fontFamily: "Roboto Mono, monospace", fontSize: "0.75rem", color: "#e91130", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{member.role}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{member.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1.25rem" }}>Dolgozzunk együtt!</h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              Vedd fel velünk a kapcsolatot és indítsuk el a közös munkát egy ingyenes konzultációval.
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  Ingyenes Audit <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  Kapcsolatfelvétel
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
