import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Search, BarChart3, Globe, Code, Target, TrendingUp, Clock, Phone, Mail } from "lucide-react";

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

const AUDIT_INCLUDES = [
  { icon: <Code size={20} />, title: "Weboldal technikai audit", desc: "Core Web Vitals, betöltési sebesség, mobilbarátság, HTTPS, strukturált adatok" },
  { icon: <Search size={20} />, title: "SEO elemzés", desc: "Kulcsszó pozíciók, on-page SEO, backlink profil, versenytárs-elemzés" },
  { icon: <BarChart3 size={20} />, title: "Hirdetési kampányok", desc: "Google Ads és Meta Ads hatékonyság, ROAS, CPA, Quality Score elemzés" },
  { icon: <Globe size={20} />, title: "Közösségi média", desc: "Jelenlét, engagement ráta, tartalom minőség, követőszám trend" },
  { icon: <Target size={20} />, title: "Versenytárs-elemzés", desc: "Top 3 versenytárs összehasonlítása, piaci pozíció, differenciálási lehetőségek" },
  { icon: <TrendingUp size={20} />, title: "Konverzió optimalizálás", desc: "Konverziós ráta, UX problémák, A/B tesztelési lehetőségek" },
];

const PROCESS = [
  { step: "01", title: "Kérés beküldése", desc: "Töltsd ki az alábbi űrlapot – 2 perc az egész." },
  { step: "02", title: "Kapcsolatfelvétel", desc: "24 órán belül felvesszük veled a kapcsolatot." },
  { step: "03", title: "Adatgyűjtés", desc: "Hozzáférést kérünk az Analytics és Ads fiókokhoz." },
  { step: "04", title: "Audit elkészítése", desc: "5–7 munkanapon belül elkészítjük a részletes auditot." },
  { step: "05", title: "Prezentáció", desc: "Online meetingen bemutatjuk az eredményeket és javaslatokat." },
];

export default function AuditPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", website: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    contactMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: "Ingyenes Marketing Audit kérés",
      message: `Cég: ${form.company}\nWeboldal: ${form.website}\n\n${form.message}`,
    });
  };

  return (
    <>
      <SeoHead
        title="Ingyenes Marketing Audit – G2A Marketing | Weboldal & SEO Elemzés"
        description="Kérj ingyenes marketing auditot! Megvizsgáljuk a weboldaladat, SEO jelenlétét, hirdetési kampányaidat és megmutatjuk, hol veszítesz el ügyfeleket. Teljesen ingyenes."
      />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "55vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 70% 30%, rgba(233,17,48,0.1) 0%, transparent 55%), var(--g2a-bg)",
          paddingTop: "6rem",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div className="g2a-section-label animate-fadeIn">Ingyenes ajánlat</div>
            <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "700px" }}>
              Ingyenes <span className="g2a-gradient-text">Marketing Audit</span>
            </h1>
            <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.15rem", color: "var(--g2a-text-secondary)", maxWidth: "580px", lineHeight: "1.7", fontFamily: "Inter, sans-serif" }}>
              Megvizsgáljuk a teljes online jelenlétedet és megmutatjuk, hol veszítesz el ügyfeleket – teljesen ingyenesen, kötelezettség nélkül.
            </p>
            <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {[
                { icon: <CheckCircle size={14} />, text: "100% ingyenes" },
                { icon: <Clock size={14} />, text: "24h válaszidő" },
                { icon: <CheckCircle size={14} />, text: "Kötelezettség nélkül" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-secondary)", fontSize: "0.9rem", fontFamily: "Inter, sans-serif" }}>
                  <span style={{ color: "#10b981" }}>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">Mit tartalmaz?</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Az audit tartalma</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {AUDIT_INCLUDES.map((item, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", gap: "1rem" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">Folyamat</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Hogyan zajlik?</h2>
            </div>
            <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "1rem" }}>
              {PROCESS.map((p, i) => (
                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ flex: "1 1 180px", textAlign: "center", padding: "0 1rem", position: "relative", minWidth: "160px" }}>
                  {i < PROCESS.length - 1 && (
                    <div style={{ position: "absolute", top: "1.5rem", left: "60%", right: "-40%", height: "2px", backgroundColor: "var(--g2a-border)", zIndex: 0 }} />
                  )}
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    backgroundColor: "rgba(233,17,48,0.12)", border: "2px solid rgba(233,17,48,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem", position: "relative", zIndex: 1,
                    fontFamily: "Roboto Mono, monospace", fontWeight: 700, fontSize: "0.875rem", color: "#e91130",
                  }}>
                    {p.step}
                  </div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: "1.5" }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div className="g2a-section-label reveal">Kérés</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Kérd az ingyenes auditot</h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ textAlign: "center", margin: "0 auto" }}>
                  Töltsd ki az alábbi űrlapot és 24 órán belül felvesszük veled a kapcsolatot.
                </p>
              </div>

              {status === "success" ? (
                <div className="g2a-card reveal" style={{ textAlign: "center", padding: "3rem" }}>
                  <CheckCircle size={56} style={{ color: "#10b981", margin: "0 auto 1.25rem" }} />
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>Köszönjük a kérést!</h3>
                  <p style={{ color: "var(--g2a-text-secondary)", marginBottom: "2rem" }}>24 órán belül felvesszük veled a kapcsolatot az audit részleteivel kapcsolatban.</p>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-secondary">Vissza a főoldalra</span>
                  </Link>
                </div>
              ) : (
                <div className="g2a-card reveal">
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">Teljes név *</label>
                        <input className="g2a-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Kovács János" />
                      </div>
                      <div>
                        <label className="g2a-label">Email cím *</label>
                        <input className="g2a-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@ceg.hu" />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="g2a-label">Telefonszám</label>
                        <input className="g2a-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30 190 2575" />
                      </div>
                      <div>
                        <label className="g2a-label">Cég neve</label>
                        <input className="g2a-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Cég Kft." />
                      </div>
                    </div>
                    <div>
                      <label className="g2a-label">Weboldal URL</label>
                      <input className="g2a-input" type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://www.ceg.hu" />
                    </div>
                    <div>
                      <label className="g2a-label">Miben segíthetünk? (opcionális)</label>
                      <textarea className="g2a-input" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Pl.: Növelni szeretnénk az organikus forgalmat és csökkenteni a hirdetési költségeket..." style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
                      {status === "loading" ? "Küldés folyamatban..." : "Audit kérése – Teljesen Ingyenes"}
                    </button>
                    {status === "error" && <p style={{ color: "#e91130", fontSize: "0.875rem", textAlign: "center" }}>Hiba történt. Kérjük, próbáld újra vagy írj nekünk emailt.</p>}
                    <p style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", textAlign: "center" }}>
                      Az adataidat bizalmasan kezeljük. Részletek az <Link href="/adatvedelmi-iranyelvek" style={{ color: "#e91130" }}>Adatvédelmi irányelvekben</Link>.
                    </p>
                  </form>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
                {[
                  { icon: <Phone size={14} />, text: "+36 30 190 2575" },
                  { icon: <Mail size={14} />, text: "info@g2amarketing.hu" },
                  { icon: <Clock size={14} />, text: "08:00 – 17:00" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem" }}>
                    <span style={{ color: "#e91130" }}>{c.icon}</span> {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
