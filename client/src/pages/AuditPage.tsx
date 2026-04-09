import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  CheckCircle, ArrowRight, ArrowLeft, Search, BarChart3, Globe, Code, Target, TrendingUp,
  Building2, ShoppingCart, Stethoscope, Car, Utensils, Briefcase, Home, Zap,
  Users, Megaphone, Mail, Phone, Clock
} from "lucide-react";

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

const INDUSTRIES = [
  { id: "egeszsegugy", label: "Egészségügy", icon: <Stethoscope size={20} /> },
  { id: "autoipar", label: "Autóipar", icon: <Car size={20} /> },
  { id: "etterem", label: "Étterem / Élelmiszer", icon: <Utensils size={20} /> },
  { id: "ingatlan", label: "Ingatlan", icon: <Home size={20} /> },
  { id: "e-kereskedelem", label: "E-kereskedelem", icon: <ShoppingCart size={20} /> },
  { id: "b2b-szolgaltatas", label: "B2B Szolgáltatás", icon: <Briefcase size={20} /> },
  { id: "technologia", label: "Technológia / SaaS", icon: <Zap size={20} /> },
  { id: "egyeb", label: "Egyéb iparág", icon: <Building2 size={20} /> },
];

const BUDGETS = [
  { id: "under-100k", label: "100 000 Ft alatt", desc: "Kis vállalkozás, kezdeti lépések" },
  { id: "100k-300k", label: "100 000 – 300 000 Ft", desc: "Növekvő vállalkozás" },
  { id: "300k-500k", label: "300 000 – 500 000 Ft", desc: "Komoly marketing befektetés" },
  { id: "500k-1m", label: "500 000 – 1 000 000 Ft", desc: "Skálázódó vállalkozás" },
  { id: "over-1m", label: "1 000 000 Ft felett", desc: "Enterprise szintű marketing" },
  { id: "not-sure", label: "Még nem tudom", desc: "Segítségre van szükségem a tervezéshez" },
];

const GOALS = [
  { id: "seo", label: "Több organikus látogató (SEO)", icon: <Search size={18} /> },
  { id: "ads", label: "Hatékonyabb hirdetések (PPC)", icon: <Target size={18} /> },
  { id: "social", label: "Közösségi média jelenlét", icon: <Users size={18} /> },
  { id: "conversion", label: "Több konverzió / lead", icon: <TrendingUp size={18} /> },
  { id: "brand", label: "Márkaépítés & arculat", icon: <Megaphone size={18} /> },
  { id: "analytics", label: "Adatelemzés & riportálás", icon: <BarChart3 size={18} /> },
  { id: "web", label: "Weboldal fejlesztés", icon: <Code size={18} /> },
  { id: "international", label: "Nemzetközi terjeszkedés", icon: <Globe size={18} /> },
];

const STEPS = ["Iparág", "Büdzsé", "Célok", "Kapcsolat"];

type FormData = {
  industry: string;
  budget: string;
  goals: string[];
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  currentChallenges: string;
};

export default function AuditPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<FormData>({
    industry: "", budget: "", goals: [],
    name: "", email: "", phone: "", company: "", website: "", currentChallenges: "",
  });

  const auditMutation = trpc.audit.submit.useMutation({
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  });

  const goNext = () => { setAnimDir("forward"); setAnimating(true); setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 180); };
  const goPrev = () => { setAnimDir("backward"); setAnimating(true); setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 180); };
  const toggleGoal = (id: string) => setForm(f => ({ ...f, goals: f.goals.includes(id) ? f.goals.filter(g => g !== id) : [...f.goals, id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    auditMutation.mutate({
      name: form.name, email: form.email,
      phone: form.phone || undefined, company: form.company || undefined,
      website: form.website || undefined, monthlyBudget: form.budget || undefined,
      currentChallenges: [
        form.industry ? `Iparág: ${form.industry}` : "",
        form.goals.length ? `Célok: ${form.goals.join(", ")}` : "",
        form.currentChallenges,
      ].filter(Boolean).join(" | ") || undefined,
    });
  };

  const stepStyle: React.CSSProperties = {
    transition: animating ? "opacity 0.18s, transform 0.18s" : "none",
    opacity: animating ? 0 : 1,
    transform: animating ? (animDir === "forward" ? "translateX(16px)" : "translateX(-16px)") : "translateX(0)",
  };

  return (
    <>
      <SeoHead
        title="Ingyenes Marketing Audit – G2A Marketing | Weboldal & SEO Elemzés"
        description="Kérj ingyenes marketing auditot! Megvizsgáljuk a weboldaladat, SEO jelenlétét, hirdetési kampányaidat és megmutatjuk, hol veszítész el ügyfeleket. Teljesen ingyenes."
      />
      <ScrollProgressBar />
      <Navigation />
      <div ref={pageRef}>
        <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", background: "radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.1) 0%, transparent 55%), var(--g2a-bg)", paddingTop: "6rem" }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label animate-fadeIn">Ingyenes Audit</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
                  Tudd meg, hol <span className="g2a-gradient-text">veszítész el ügyfeleket</span>
                </h1>
                <p className="animate-fadeInUp" style={{ animationDelay: "0.3s", fontSize: "1.1rem", color: "var(--g2a-text-secondary)", lineHeight: "1.7" }}>
                  Ingyenes, személyre szabott marketing audit – 5–7 munkanapon belül. Nincs kötelezettség, csak valódi értéket adunk.
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.45s", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
                  {[
                    { icon: <Code size={18} />, title: "Technikai audit", desc: "Core Web Vitals, sebesség, mobilbarátság" },
                    { icon: <Search size={18} />, title: "SEO elemzés", desc: "Kulcsszó pozíciók, backlink profil" },
                    { icon: <BarChart3 size={18} />, title: "Hirdetési kampányok", desc: "Google Ads, Meta Ads hatékonyság" },
                    { icon: <Target size={18} />, title: "Versenytárs-elemzés", desc: "Piaci pozíció, differenciálás" },
                  ].map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--g2a-amber-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--g2a-amber)", flexShrink: 0 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--g2a-text-primary)" }}>{a.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.6s", display: "flex", gap: "1.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
                  {[
                    { icon: <CheckCircle size={13} />, text: "100% ingyenes" },
                    { icon: <Clock size={13} />, text: "24h válaszidő" },
                    { icon: <CheckCircle size={13} />, text: "Kötelezettség nélkül" },
                  ].map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--g2a-text-secondary)", fontSize: "0.85rem" }}>
                      <span style={{ color: "#10b981" }}>{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <div style={{ background: "var(--g2a-bg-2)", border: "1px solid var(--g2a-border)", borderRadius: "20px", padding: "2rem", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    {STEPS.map((s, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ height: "3px", borderRadius: "2px", marginBottom: "0.4rem", backgroundColor: i <= step ? "var(--g2a-amber)" : "var(--g2a-border)", transition: "background-color 0.3s" }} />
                        <span style={{ fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", color: i === step ? "var(--g2a-amber)" : i < step ? "var(--g2a-text-secondary)" : "var(--g2a-text-muted)", fontWeight: i === step ? 700 : 400 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--g2a-text-muted)", textAlign: "right", marginBottom: "1.25rem", fontFamily: "'JetBrains Mono', monospace" }}>{step + 1} / {STEPS.length}</div>
                  {status === "success" ? (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                      <CheckCircle size={52} style={{ color: "#10b981", margin: "0 auto 1.25rem", display: "block" }} />
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>Köszönjük a kérést!</h3>
                      <p style={{ color: "var(--g2a-text-secondary)", marginBottom: "2rem", fontSize: "0.9rem" }}>24 órán belül felvesszük veled a kapcsolatot az audit részleteivel.</p>
                      <Link href="/" style={{ textDecoration: "none" }}><span className="g2a-btn-secondary">Vissza a főoldalra</span></Link>
                    </div>
                  ) : (
                    <div style={stepStyle}>
                      {step === 0 && (
                        <div>
                          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>Melyik iparágban tevékenykedsz?</h2>
                          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.78rem", marginBottom: "1.1rem" }}>Válassz egyet az alábbiak közül</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            {INDUSTRIES.map(ind => (
                              <button key={ind.id} type="button" onClick={() => setForm(f => ({ ...f, industry: ind.id }))}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.75rem", borderRadius: "8px", cursor: "pointer", border: `1px solid ${form.industry === ind.id ? "var(--g2a-amber)" : "var(--g2a-border)"}`, backgroundColor: form.industry === ind.id ? "var(--g2a-amber-light)" : "transparent", color: form.industry === ind.id ? "var(--g2a-amber)" : "var(--g2a-text-secondary)", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", transition: "all 0.15s", textAlign: "left" }}>
                                <span style={{ flexShrink: 0 }}>{ind.icon}</span>{ind.label}
                              </button>
                            ))}
                          </div>
                          <button className="g2a-btn-primary" onClick={goNext} disabled={!form.industry} style={{ width: "100%", marginTop: "1.1rem", justifyContent: "center", opacity: form.industry ? 1 : 0.5 }}>
                            Következő <ArrowRight size={15} />
                          </button>
                        </div>
                      )}
                      {step === 1 && (
                        <div>
                          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>Mi a havi marketing büdzsé?</h2>
                          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.78rem", marginBottom: "1.1rem" }}>Hirdetési + ügynökségi díjak összesen</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {BUDGETS.map(b => (
                              <button key={b.id} type="button" onClick={() => setForm(f => ({ ...f, budget: b.id }))}
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0.875rem", borderRadius: "8px", cursor: "pointer", border: `1px solid ${form.budget === b.id ? "var(--g2a-amber)" : "var(--g2a-border)"}`, backgroundColor: form.budget === b.id ? "var(--g2a-amber-light)" : "transparent", transition: "all 0.15s", textAlign: "left" }}>
                                <div>
                                  <div style={{ color: form.budget === b.id ? "var(--g2a-amber)" : "var(--g2a-text-primary)", fontSize: "0.85rem", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{b.label}</div>
                                  <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.72rem", marginTop: "0.1rem" }}>{b.desc}</div>
                                </div>
                                {form.budget === b.id && <CheckCircle size={15} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} />}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.1rem" }}>
                            <button type="button" className="g2a-btn-secondary" onClick={goPrev} style={{ flexShrink: 0 }}><ArrowLeft size={15} /></button>
                            <button className="g2a-btn-primary" onClick={goNext} disabled={!form.budget} style={{ flex: 1, justifyContent: "center", opacity: form.budget ? 1 : 0.5 }}>Következő <ArrowRight size={15} /></button>
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div>
                          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>Mik a fő marketing célok?</h2>
                          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.78rem", marginBottom: "1.1rem" }}>Több is kiválasztható</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                            {GOALS.map(g => (
                              <button key={g.id} type="button" onClick={() => toggleGoal(g.id)}
                                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.625rem 0.75rem", borderRadius: "8px", cursor: "pointer", border: `1px solid ${form.goals.includes(g.id) ? "var(--g2a-amber)" : "var(--g2a-border)"}`, backgroundColor: form.goals.includes(g.id) ? "var(--g2a-amber-light)" : "transparent", color: form.goals.includes(g.id) ? "var(--g2a-amber)" : "var(--g2a-text-secondary)", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", transition: "all 0.15s", textAlign: "left" }}>
                                <span style={{ flexShrink: 0 }}>{g.icon}</span>{g.label}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.1rem" }}>
                            <button type="button" className="g2a-btn-secondary" onClick={goPrev} style={{ flexShrink: 0 }}><ArrowLeft size={15} /></button>
                            <button className="g2a-btn-primary" onClick={goNext} disabled={form.goals.length === 0} style={{ flex: 1, justifyContent: "center", opacity: form.goals.length > 0 ? 1 : 0.5 }}>Következő <ArrowRight size={15} /></button>
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <form onSubmit={handleSubmit}>
                          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>Hova küldjük az auditot?</h2>
                          <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.78rem", marginBottom: "1.1rem" }}>Utolsó lépés – 2 perc és kész!</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                              <div><label className="g2a-label">Teljes név *</label><input className="g2a-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Kovács János" /></div>
                              <div><label className="g2a-label">Email cím *</label><input className="g2a-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@ceg.hu" /></div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                              <div><label className="g2a-label">Telefonszám</label><input className="g2a-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30 190 2575" /></div>
                              <div><label className="g2a-label">Cég neve</label><input className="g2a-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Cég Kft." /></div>
                            </div>
                            <div><label className="g2a-label">Weboldal URL</label><input className="g2a-input" type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://www.ceg.hu" /></div>
                            <div><label className="g2a-label">Egyéb megjegyzés (opcionális)</label><textarea className="g2a-input" rows={2} value={form.currentChallenges} onChange={e => setForm(f => ({ ...f, currentChallenges: e.target.value }))} placeholder="Pl.: Csökkenteni szeretnénk a hirdetési költségeket..." style={{ resize: "vertical" }} /></div>
                          </div>
                          <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.1rem" }}>
                            <button type="button" className="g2a-btn-secondary" onClick={goPrev} style={{ flexShrink: 0 }}><ArrowLeft size={15} /></button>
                            <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ flex: 1, justifyContent: "center" }}>{status === "loading" ? "Küldés..." : "Audit kérése – Ingyenes"}</button>
                          </div>
                          {status === "error" && <p style={{ color: "var(--g2a-amber)", fontSize: "0.78rem", textAlign: "center", marginTop: "0.625rem" }}>Hiba történt. Kérjük, próbáld újra.</p>}
                          <p style={{ fontSize: "0.72rem", color: "var(--g2a-text-muted)", textAlign: "center", marginTop: "0.625rem" }}>Adataidat bizalmasan kezelljük. <Link href="/adatvedelmi-iranyelvek" style={{ color: "var(--g2a-amber)" }}>Adatvédelmi irányelvek</Link></p>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="g2a-section-label reveal">Folyamat</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Hogyan zajlik?</h2>
            </div>
            <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "1rem" }}>
              {[
                { step: "01", title: "Kérés beküldése", desc: "Töltsd ki a fenti űrlapot – 2 perc az egész." },
                { step: "02", title: "Kapcsolatfelvétel", desc: "24 órán belül felvesszük veled a kapcsolatot." },
                { step: "03", title: "Adatgyűjtés", desc: "Hozzáférést kérünk az Analytics és Ads fiókokhoz." },
                { step: "04", title: "Audit elkészítése", desc: "5–7 munkanapon belül elkészítjük a részletes auditot." },
                { step: "05", title: "Prezentáció", desc: "Online meetingen bemutatjuk az eredményeket." },
              ].map((p, i) => (
                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ flex: "1 0 160px", textAlign: "center", padding: "0 1rem", position: "relative", minWidth: "140px" }}>
                  {i < 4 && <div style={{ position: "absolute", top: "1.5rem", left: "60%", right: "-40%", height: "2px", backgroundColor: "var(--g2a-border)", zIndex: 0 }} />}
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--g2a-amber-light)", border: "2px solid var(--g2a-amber-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", position: "relative", zIndex: 1, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.875rem", color: "var(--g2a-amber)" }}>{p.step}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: "1.5" }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "2rem 0", backgroundColor: "var(--g2a-bg)", borderTop: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
              {[
                { icon: <Phone size={14} />, text: "+36 30 190 2575" },
                { icon: <Mail size={14} />, text: "info@g2amarketing.hu" },
                { icon: <Clock size={14} />, text: "Hétfő–Péntek: 08:00–17:00" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--g2a-amber)" }}>{c.icon}</span> {c.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
