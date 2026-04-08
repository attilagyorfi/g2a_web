import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Target, BarChart3, Globe } from "lucide-react";

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

const CASE_STUDIES = [
  {
    industry: "Egészségügy",
    client: "Magánklinika – Pécs",
    problem: "Alacsony online foglalások száma, gyenge SEO jelenlét, elavult weboldal",
    solution: "Teljes SEO stratégia, Google Ads kampányok, weboldal újratervezés és konverzió optimalizálás",
    results: ["+340% organikus forgalom", "+180% online foglalás", "-35% bounce rate"],
    platforms: ["Google Ads", "SEO", "Webfejlesztés"],
    color: "#10b981",
    duration: "6 hónap",
  },
  {
    industry: "Autóipar",
    client: "Autókereskedő hálózat",
    problem: "Magas hirdetési költség, alacsony konverzió, nem hatékony kampánystruktúra",
    solution: "PPC audit, kampányrestruktúra, landing page optimalizálás, remarketing bevezetése",
    results: ["-45% CPA", "+220% lead generálás", "+3.2x ROAS"],
    platforms: ["Google Ads", "Meta Ads", "Analytics"],
    color: "#3b82f6",
    duration: "3 hónap",
  },
  {
    industry: "B2B Technológia",
    client: "SaaS vállalat",
    problem: "Nemzetközi piacra lépés, brand awareness hiánya, alacsony demo foglalások",
    solution: "Teljes brand stratégia, multilingual SEO, LinkedIn kampányok, tartalommarketing",
    results: ["+5 új piac", "+280% demo foglalás", "+450% LinkedIn engagement"],
    platforms: ["LinkedIn Ads", "SEO", "Content Marketing"],
    color: "#8b5cf6",
    duration: "12 hónap",
  },
  {
    industry: "Szépségipar",
    client: "Szépségszalon lánc",
    problem: "Alacsony közösségi média jelenlét, nincs online foglalási rendszer",
    solution: "Social media stratégia, Instagram és Facebook kampányok, online foglalás integráció",
    results: ["+520% Instagram követő", "+190% online foglalás", "+85% bevétel növekedés"],
    platforms: ["Meta Ads", "Instagram", "Social Media"],
    color: "#ec4899",
    duration: "4 hónap",
  },
  {
    industry: "Mérnöki irodák",
    client: "Tervező iroda",
    problem: "Nincs online jelenlét, minden ügyfél referencia alapján érkezik",
    solution: "Weboldal fejlesztés, SEO, LinkedIn jelenlét, B2B lead generálás",
    results: ["+15 új ügyfél/hónap", "Top 3 Google pozíció", "+300% weboldal forgalom"],
    platforms: ["SEO", "LinkedIn", "Webfejlesztés"],
    color: "#f59e0b",
    duration: "8 hónap",
  },
  {
    industry: "Ügyvédi irodák",
    client: "Ügyvédi iroda – Budapest",
    problem: "Nem megfelelő online megjelenés, alacsony presztízs érzet",
    solution: "Prémium brand redesign, SEO optimalizálás, Google Ads, tartalommarketing",
    results: ["+250% organikus forgalom", "+120% ügyfélfelvétel", "Top 1 Google pozíció"],
    platforms: ["SEO", "Google Ads", "Brand Design"],
    color: "#6366f1",
    duration: "5 hónap",
  },
];

const INDUSTRIES = ["Összes", "Egészségügy", "Autóipar", "B2B Technológia", "Szépségipar", "Mérnöki irodák", "Ügyvédi irodák"];

export default function ReferenciakPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [activeIndustry, setActiveIndustry] = useState("Összes");

  const filtered = activeIndustry === "Összes" ? CASE_STUDIES : CASE_STUDIES.filter(cs => cs.industry === activeIndustry);

  return (
    <>
      <SeoHead
        title="Referenciák & Esettanulmányok – G2A Marketing | Valós Eredmények"
        description="Valós marketing eredmények valós ügyfelektől. Esettanulmányok egészségügy, autóipar, B2B technológia és más iparágakból. Nézd meg, hogyan segítettünk növekedni!"
      />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "50vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 60% 40%, rgba(233,17,48,0.08) 0%, transparent 55%), var(--g2a-bg)",
          paddingTop: "6rem",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div className="g2a-section-label animate-fadeIn">Referenciák</div>
            <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "700px" }}>
              Valós eredmények, <span className="g2a-gradient-text">valós ügyfelektől</span>
            </h1>
            <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.1rem", color: "var(--g2a-text-secondary)", maxWidth: "560px", lineHeight: "1.7", fontFamily: "Inter, sans-serif" }}>
              Nem ígérünk – bizonyítunk. Íme néhány ügyfél esettanulmánya, ahol mérhető eredményeket értünk el.
            </p>
            <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", gap: "2.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {[
                { icon: <TrendingUp size={16} />, text: "150+ sikeres projekt" },
                { icon: <Target size={16} />, text: "8+ iparág" },
                { icon: <Globe size={16} />, text: "10+ ország" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>
                  <span style={{ color: "#e91130" }}>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter + Cases */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            {/* Filter */}
            <div className="reveal" style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setActiveIndustry(ind)}
                  style={{
                    padding: "0.5rem 1.125rem", borderRadius: "50px",
                    fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s",
                    backgroundColor: activeIndustry === ind ? "#e91130" : "var(--g2a-bg-card)",
                    color: activeIndustry === ind ? "#fff" : "var(--g2a-text-secondary)",
                    border: `1px solid ${activeIndustry === ind ? "#e91130" : "var(--g2a-border)"}`,
                  }}>
                  {ind}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem" }}>
              {filtered.map((cs, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: cs.color }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <div>
                      <span className="g2a-tag" style={{ marginBottom: "0.5rem", display: "inline-block" }}>{cs.industry}</span>
                      <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "var(--g2a-text-primary)", margin: 0 }}>{cs.client}</h3>
                    </div>
                    <span style={{ fontFamily: "Roboto Mono, monospace", fontSize: "0.7rem", color: "var(--g2a-text-muted)", backgroundColor: "var(--g2a-bg)", padding: "0.25rem 0.625rem", borderRadius: "4px", border: "1px solid var(--g2a-border)", whiteSpace: "nowrap" }}>
                      {cs.duration}
                    </span>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>Kihívás</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: "1.6" }}>{cs.problem}</p>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>Megoldás</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: 0, lineHeight: "1.6" }}>{cs.solution}</p>
                  </div>

                  <div style={{
                    padding: "1rem", borderRadius: "10px",
                    backgroundColor: `${cs.color}10`, border: `1px solid ${cs.color}25`,
                    marginBottom: "1.25rem",
                  }}>
                    <div style={{ fontSize: "0.75rem", color: cs.color, fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>Eredmények</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {cs.results.map((r, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <BarChart3 size={13} style={{ color: cs.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: cs.color }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {cs.platforms.map((pl, j) => <span key={j} className="g2a-tag-neutral">{pl}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1rem" }}>Te lehetsz a következő sikertörténet</h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              Kérj ingyenes marketing auditot és megmutatjuk, hogyan érhetünk el hasonló eredményeket a te vállalkozásodban.
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  Ingyenes Audit kérése <ArrowRight size={18} />
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
