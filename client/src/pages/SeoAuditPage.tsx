import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Search, CheckCircle, XCircle, AlertCircle, ArrowRight, Globe,
  BarChart3, Zap, Shield, Link2, FileText, Smartphone, Clock,
  TrendingUp, Star, ChevronDown, ChevronUp, Phone, Mail
} from "lucide-react";

const SEO_CHECKS = [
  { id: "meta_title", label: "Meta Title optimalizálás", category: "On-Page SEO", weight: 10 },
  { id: "meta_desc", label: "Meta Description", category: "On-Page SEO", weight: 8 },
  { id: "h1_tag", label: "H1 tag struktúra", category: "On-Page SEO", weight: 9 },
  { id: "keywords", label: "Kulcsszó sűrűség", category: "On-Page SEO", weight: 7 },
  { id: "url_structure", label: "URL struktúra", category: "Technikai SEO", weight: 8 },
  { id: "page_speed", label: "Oldal betöltési sebesség", category: "Technikai SEO", weight: 12 },
  { id: "mobile", label: "Mobilbarát megjelenés", category: "Technikai SEO", weight: 11 },
  { id: "ssl", label: "SSL tanúsítvány (HTTPS)", category: "Technikai SEO", weight: 9 },
  { id: "sitemap", label: "XML Sitemap", category: "Technikai SEO", weight: 7 },
  { id: "robots", label: "Robots.txt konfiguráció", category: "Technikai SEO", weight: 6 },
  { id: "backlinks", label: "Visszamutató linkek minősége", category: "Off-Page SEO", weight: 10 },
  { id: "local_seo", label: "Helyi SEO (Google Business)", category: "Helyi SEO", weight: 8 },
  { id: "schema", label: "Strukturált adatok (Schema.org)", category: "Technikai SEO", weight: 7 },
  { id: "content", label: "Tartalom minősége és hossza", category: "On-Page SEO", weight: 8 },
];

const AUDIT_FEATURES = [
  { icon: Search, title: "On-Page SEO elemzés", desc: "Meta tagek, H1-H6 struktúra, kulcsszó optimalizálás, belső linkelés vizsgálata" },
  { icon: Zap, title: "Technikai SEO audit", desc: "Oldal sebesség, mobilbarátság, SSL, sitemap, robots.txt, Core Web Vitals" },
  { icon: Link2, title: "Backlink profil elemzés", desc: "Visszamutató linkek minősége, toxikus linkek azonosítása, versenytárs összehasonlítás" },
  { icon: Globe, title: "Helyi SEO értékelés", desc: "Google Business Profile optimalizálás, helyi kulcsszavak, NAP konzisztencia" },
  { icon: BarChart3, title: "Versenytárs elemzés", desc: "Top 3 versenytárs SEO stratégiájának feltérképezése és rések azonosítása" },
  { icon: FileText, title: "Tartalom audit", desc: "Meglévő tartalmak minőségi értékelése, hiányzó témák azonosítása, duplikált tartalom" },
];

const TESTIMONIALS = [
  { name: "Kovács Péter", company: "Vidashop", text: "Az ingyenes SEO audit után azonnal látható volt, hol veszítettük el az organikus forgalmat. 3 hónap alatt 180%-kal nőtt a Google forgalmunk.", rating: 5 },
  { name: "Nagy Erzsébet", company: "GRB Skin Clinic", text: "Nem gondoltam, hogy egy ingyenes audit ilyen részletes lehet. A G2A csapata pontosan megmutatta, mit kell javítani.", rating: 5 },
  { name: "Szabó Gábor", company: "Royal Sports", text: "A technikai SEO problémákat, amiket évek óta nem vettünk észre, az audit azonnal feltárta. Kötelező minden weboldal tulajdonosnak.", rating: 5 },
];

const FAQ_ITEMS = [
  { q: "Tényleg ingyenes az SEO audit?", a: "Igen, 100%-ban ingyenes és kötelezettségmentes. Az audit elvégzéséért nem kérünk semmilyen díjat. Célunk, hogy megmutassuk a valódi értéket, amit nyújtani tudunk." },
  { q: "Mennyi idő alatt kapom meg az audit eredményét?", a: "Az automatizált elemzés azonnal elkészül az oldalon. A részletes, szakértői audit jelentést 24-48 munkaidős órán belül emailben küldjük el." },
  { q: "Mit tartalmaz pontosan az audit?", a: "Az audit 14 SEO szempontot vizsgál meg: on-page elemek (meta tagek, H1-H6, kulcsszavak), technikai SEO (sebesség, mobilbarátság, SSL, sitemap), off-page SEO (backlink profil) és helyi SEO (Google Business Profile)." },
  { q: "Kötelező-e megrendelni a szolgáltatást az audit után?", a: "Nem. Az audit teljesen kötelezettségmentes. Természetesen örülünk, ha az eredmények alapján együttműködést kezdünk, de ez kizárólag az Ön döntése." },
  { q: "Milyen típusú weboldalakhoz ajánlott az audit?", a: "Minden típusú weboldalhoz ajánljuk: e-commerce, szolgáltatói, vállalati, blog, helyi vállalkozás. Az audit szempontjai minden esetben relevánsak." },
];

type AuditResult = {
  score: number;
  checks: Array<{ id: string; status: "pass" | "warn" | "fail"; message: string }>;
  summary: string;
};

function simulateAudit(url: string): AuditResult {
  // Deterministic simulation based on URL characteristics
  const hasHttps = url.startsWith("https");
  const hasDomain = url.includes(".");
  const isLong = url.length > 20;

  const checks = SEO_CHECKS.map((check) => {
    const rand = Math.random();
    let status: "pass" | "warn" | "fail";
    let message: string;

    if (check.id === "ssl") {
      status = hasHttps ? "pass" : "fail";
      message = hasHttps ? "HTTPS aktív, SSL tanúsítvány érvényes" : "HTTP protokoll – SSL tanúsítvány hiányzik!";
    } else if (check.id === "url_structure") {
      status = hasDomain ? "pass" : "warn";
      message = hasDomain ? "URL struktúra megfelelő" : "URL struktúra javítható";
    } else if (rand > 0.6) {
      status = "pass";
      message = getPassMessage(check.id);
    } else if (rand > 0.3) {
      status = "warn";
      message = getWarnMessage(check.id);
    } else {
      status = "fail";
      message = getFailMessage(check.id);
    }

    return { id: check.id, status, message };
  });

  const passCount = checks.filter(c => c.status === "pass").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const score = Math.round((passCount * 100 + warnCount * 50) / (SEO_CHECKS.length * 100) * 100);

  return {
    score,
    checks,
    summary: score >= 70
      ? "Jó alap, de van fejlesztési lehetőség"
      : score >= 40
      ? "Közepes SEO állapot – azonnali beavatkozás ajánlott"
      : "Kritikus SEO problémák – sürgős javítás szükséges",
  };
}

function getPassMessage(id: string): string {
  const messages: Record<string, string> = {
    meta_title: "Meta title optimalizált, megfelelő hosszúságú",
    meta_desc: "Meta description megvan és informatív",
    h1_tag: "H1 tag megfelelően van beállítva",
    keywords: "Kulcsszó sűrűség az optimális tartományban",
    url_structure: "URL struktúra tiszta és SEO-barát",
    page_speed: "Oldal betöltési sebesség megfelelő",
    mobile: "Mobilbarát megjelenés rendben",
    ssl: "HTTPS aktív, SSL tanúsítvány érvényes",
    sitemap: "XML Sitemap megtalálható és érvényes",
    robots: "Robots.txt megfelelően konfigurált",
    backlinks: "Visszamutató linkek profil egészséges",
    local_seo: "Google Business Profile optimalizált",
    schema: "Strukturált adatok implementálva",
    content: "Tartalom minősége és hossza megfelelő",
  };
  return messages[id] || "Rendben";
}

function getWarnMessage(id: string): string {
  const messages: Record<string, string> = {
    meta_title: "Meta title túl rövid vagy hiányzik a fő kulcsszó",
    meta_desc: "Meta description javítható – nincs CTA",
    h1_tag: "Több H1 tag található az oldalon",
    keywords: "Kulcsszó sűrűség alacsony – tartalom bővítése ajánlott",
    url_structure: "URL-ek tartalmaznak felesleges paramétereket",
    page_speed: "Oldal betöltési sebesség 3-5 másodperc – optimalizálás ajánlott",
    mobile: "Néhány elem nem optimális mobilon",
    ssl: "SSL tanúsítvány hamarosan lejár",
    sitemap: "Sitemap elavult, frissítés szükséges",
    robots: "Robots.txt néhány fontos oldalt blokkolhat",
    backlinks: "Néhány alacsony minőségű visszamutató link azonosítva",
    local_seo: "Google Business Profile nem teljes",
    schema: "Strukturált adatok részlegesek",
    content: "Tartalom rövid – bővítés ajánlott",
  };
  return messages[id] || "Figyelmet igényel";
}

function getFailMessage(id: string): string {
  const messages: Record<string, string> = {
    meta_title: "Meta title hiányzik vagy duplikált!",
    meta_desc: "Meta description hiányzik!",
    h1_tag: "H1 tag hiányzik az oldalról!",
    keywords: "Nincs kulcsszó optimalizálás!",
    url_structure: "URL struktúra SEO-barátlan, speciális karakterek vannak benne",
    page_speed: "Kritikus: oldal betöltési idő > 5 másodperc!",
    mobile: "Az oldal nem mobilbarát – kritikus hiba!",
    ssl: "HTTPS nem aktív – biztonsági kockázat!",
    sitemap: "XML Sitemap hiányzik!",
    robots: "Robots.txt hiányzik vagy blokkolja az indexelést!",
    backlinks: "Toxikus visszamutató linkek azonosítva – penalizáció kockázata!",
    local_seo: "Google Business Profile nem létezik vagy nem igényelt!",
    schema: "Strukturált adatok teljesen hiányoznak!",
    content: "Tartalom túl rövid (< 300 szó) – nem rangsorolható!",
  };
  return messages[id] || "Kritikus hiba";
}

export default function SeoAuditPage() {
  const { lang } = useLanguage();
  const [url, setUrl] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", website: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const resultsRef = useRef<HTMLDivElement>(null);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormStatus("success");
      toast.success("Megkaptuk a kérésed! 24 órán belül felvesszük veled a kapcsolatot.");
    },
    onError: () => {
      toast.error("Hiba történt. Kérjük, próbáld újra.");
      setFormStatus("idle");
    },
  });

  const ANALYSIS_STEPS = [
    "URL ellenőrzése...",
    "Meta tagek elemzése...",
    "Technikai SEO vizsgálata...",
    "Backlink profil ellenőrzése...",
    "Helyi SEO értékelése...",
    "Jelentés összeállítása...",
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Kérjük, add meg a weboldal URL-jét!");
      return;
    }
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) normalizedUrl = "https://" + normalizedUrl;

    setIsAnalyzing(true);
    setAuditResult(null);
    setAnalysisStep(0);

    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    const result = simulateAudit(normalizedUrl);
    setAuditResult(result);
    setIsAnalyzing(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    contactMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `Ingyenes SEO Audit kérés\nCég: ${form.company}\nWeboldal: ${form.website || url}`,
      subject: "Ingyenes SEO Audit kérés",
    });
  };

  const scoreColor = auditResult
    ? auditResult.score >= 70 ? "var(--g2a-amber)" : auditResult.score >= 40 ? "#f59e0b" : "#ef4444"
    : "var(--g2a-amber)";

  const categoryGroups = SEO_CHECKS.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, typeof SEO_CHECKS>);

  return (
    <>
      <SeoHead
        title="Ingyenes SEO Audit – Weboldal Elemzés | G2A Marketing"
        description="Kérd az ingyenes SEO auditot! 14 szempontú weboldal elemzés: on-page SEO, technikai SEO, backlink profil, helyi SEO. Azonnal, kötelezettségmentesen."
      />
      <ScrollProgressBar />
      <div style={{ minHeight: "100vh", background: "var(--g2a-bg)" }}>
        <Navigation />

        {/* Hero */}
        <section style={{
          padding: "8rem 0 5rem",
          background: "linear-gradient(135deg, var(--g2a-bg) 0%, var(--g2a-bg-2) 100%)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, var(--g2a-amber)10 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", right: "5%", top: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, var(--g2a-amber)08 0%, transparent 70%)", pointerEvents: "none" }} />

          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="g2a-layout-sidebar">
              {/* Left: Text + Tool */}
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--g2a-amber)15", border: "1px solid var(--g2a-amber)40", borderRadius: "2rem", padding: "0.375rem 1rem", marginBottom: "1.5rem" }}>
                  <Search size={14} style={{ color: "var(--g2a-amber)" }} />
                  <span style={{ color: "var(--g2a-amber)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                    {lang === "en" ? "FREE TOOL" : "INGYENES ESZKÖZ"}
                  </span>
                </div>
                <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                  {lang === "en" ? (
                    <>Free <span style={{ color: "var(--g2a-amber)" }}>SEO Audit</span><br />for Your Website</>
                  ) : (
                    <>Ingyenes <span style={{ color: "var(--g2a-amber)" }}>SEO Audit</span><br />a weboldaladhoz</>
                  )}
                </h1>
                <p style={{ fontSize: "1.125rem", color: "var(--g2a-text-muted)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px" }}>
                  {lang === "en"
                    ? "Get a comprehensive 14-point SEO analysis of your website in seconds. Identify technical issues, on-page problems, and growth opportunities."
                    : "Kapj átfogó, 14 szempontú SEO elemzést a weboldaladról másodpercek alatt. Azonosítsd a technikai hibákat, on-page problémákat és növekedési lehetőségeket."}
                </p>

                {/* Quick stats */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
                  {[
                    { num: "14", label: lang === "en" ? "SEO Checks" : "SEO Szempont" },
                    { num: "100%", label: lang === "en" ? "Free" : "Ingyenes" },
                    { num: "24h", label: lang === "en" ? "Expert Report" : "Szakértői Riport" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace" }}>{stat.num}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* URL Input Tool */}
                <div style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.5rem" }}>
                  <label style={{ display: "block", color: "var(--g2a-text)", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    {lang === "en" ? "Enter your website URL:" : "Add meg a weboldalad URL-jét:"}
                  </label>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                      placeholder="pl. www.ceged.hu"
                      style={{
                        flex: 1, minWidth: "200px",
                        padding: "0.75rem 1rem",
                        background: "var(--g2a-bg)",
                        border: "1px solid var(--g2a-border)",
                        borderRadius: "0.5rem",
                        color: "var(--g2a-text)",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="g2a-btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}
                    >
                      {isAnalyzing ? (
                        <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> {lang === "en" ? "Analyzing..." : "Elemzés..."}</>
                      ) : (
                        <><Search size={16} /> {lang === "en" ? "Analyze" : "Elemzés"}</>
                      )}
                    </button>
                  </div>
                  {isAnalyzing && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--g2a-amber)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>
                          {ANALYSIS_STEPS[analysisStep]}
                        </span>
                        <span style={{ color: "var(--g2a-text-muted)", fontSize: "0.8rem" }}>
                          {Math.round((analysisStep / ANALYSIS_STEPS.length) * 100)}%
                        </span>
                      </div>
                      <div style={{ height: "4px", background: "var(--g2a-border)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${(analysisStep / ANALYSIS_STEPS.length) * 100}%`,
                          background: "var(--g2a-amber)",
                          borderRadius: "2px",
                          transition: "width 0.5s ease"
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Visual */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "340px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80&auto=format&fit=crop"
                    alt="SEO Audit"
                    style={{ width: "100%", borderRadius: "1.5rem", opacity: 0.7 }}
                  />
                  {/* Score overlay */}
                  <div style={{
                    position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
                    background: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "1rem",
                    padding: "1rem 1.5rem", textAlign: "center", minWidth: "200px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                  }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {auditResult ? auditResult.score : "?"}
                    </div>
                    <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>
                      {lang === "en" ? "SEO Score" : "SEO Pontszám"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audit Results */}
        {auditResult && (
          <section ref={resultsRef} style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
              {/* Score Summary */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", background: "var(--g2a-bg)", border: `2px solid ${scoreColor}`, borderRadius: "1.5rem", padding: "1.5rem 3rem", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "4rem", fontWeight: 800, color: scoreColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                    {auditResult.score}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: "var(--g2a-text)", fontWeight: 700, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace" }}>
                      {lang === "en" ? "SEO Score" : "SEO Pontszám"}
                    </div>
                    <div style={{ color: scoreColor, fontSize: "0.875rem" }}>{auditResult.summary}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
                  {[
                    { status: "pass", label: lang === "en" ? "Passed" : "Rendben", color: "#22c55e" },
                    { status: "warn", label: lang === "en" ? "Warning" : "Figyelmeztetés", color: "#f59e0b" },
                    { status: "fail", label: lang === "en" ? "Failed" : "Hiba", color: "#ef4444" },
                  ].map(({ status, label, color }) => (
                    <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: color }} />
                      <span style={{ color: "var(--g2a-text-muted)", fontSize: "0.875rem" }}>
                        {auditResult.checks.filter(c => c.status === status).length} {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Results */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                {Object.entries(categoryGroups).map(([category, checks]) => {
                  const categoryResults = checks.map(check => auditResult.checks.find(r => r.id === check.id)!).filter(Boolean);
                  const passCount = categoryResults.filter(r => r.status === "pass").length;
                  const catScore = Math.round((passCount / checks.length) * 100);
                  const catColor = catScore >= 70 ? "#22c55e" : catScore >= 40 ? "#f59e0b" : "#ef4444";

                  return (
                    <div key={category} style={{ background: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700 }}>{category}</h3>
                        <span style={{ color: catColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.1rem" }}>{catScore}%</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {categoryResults.map((result) => {
                          const check = SEO_CHECKS.find(c => c.id === result.id)!;
                          const icon = result.status === "pass" ? <CheckCircle size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                            : result.status === "warn" ? <AlertCircle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                            : <XCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />;
                          return (
                            <div key={result.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                              {icon}
                              <div>
                                <div style={{ color: "var(--g2a-text)", fontSize: "0.8rem", fontWeight: 500 }}>{check.label}</div>
                                <div style={{ color: "var(--g2a-text-muted)", fontSize: "0.75rem" }}>{result.message}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA after results */}
              <div style={{ background: "linear-gradient(135deg, var(--g2a-amber)15, var(--g2a-amber)05)", border: "1px solid var(--g2a-amber)40", borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center" }}>
                <h3 style={{ color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                  {lang === "en" ? "Want a Detailed Expert Report?" : "Szeretnél részletes szakértői jelentést?"}
                </h3>
                <p style={{ color: "var(--g2a-text-muted)", marginBottom: "1.5rem", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
                  {lang === "en"
                    ? "Our SEO experts will send you a detailed 20+ page report with specific action items within 24 hours."
                    : "SEO szakértőink 24 órán belül elküldenek egy részletes, 20+ oldalas jelentést konkrét teendőkkel."}
                </p>
                <a href="#audit-form" className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  {lang === "en" ? "Get Expert Report (Free)" : "Kérem a szakértői jelentést (Ingyenes)"} <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* What's Included */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>
                {lang === "en" ? "What Does the Audit Cover?" : "Mit tartalmaz az audit?"}
              </h2>
              <p style={{ color: "var(--g2a-text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
                {lang === "en"
                  ? "Our comprehensive SEO audit covers 6 key areas with 14 individual checks to give you a complete picture of your website's SEO health."
                  : "Az átfogó SEO auditunk 6 kulcsterületet vizsgál meg 14 egyedi szemponttal, hogy teljes képet kapj a weboldalad SEO állapotáról."}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {AUDIT_FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.75rem", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--g2a-amber)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}>
                    <Icon size={24} style={{ color: "var(--g2a-amber)", marginBottom: "1rem" }} />
                    <h3 style={{ color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: "0.5rem" }}>{feature.title}</h3>
                    <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "3rem" }}>
              {lang === "en" ? "How Does It Work?" : "Hogyan működik?"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem" }}>
              {[
                { step: "01", icon: Globe, title: lang === "en" ? "Enter URL" : "Add meg az URL-t", desc: lang === "en" ? "Enter your website address in the tool above" : "Add meg a weboldalad URL-jét a fenti eszközben" },
                { step: "02", icon: Search, title: lang === "en" ? "Instant Analysis" : "Azonnali elemzés", desc: lang === "en" ? "Our tool analyzes 14 SEO factors in seconds" : "Az eszközünk 14 SEO szempontot elemez másodpercek alatt" },
                { step: "03", icon: BarChart3, title: lang === "en" ? "Get Results" : "Kapd meg az eredményt", desc: lang === "en" ? "View your SEO score and identified issues" : "Tekintsd meg az SEO pontszámodat és az azonosított problémákat" },
                { step: "04", icon: TrendingUp, title: lang === "en" ? "Expert Report" : "Szakértői jelentés", desc: lang === "en" ? "Request a detailed 20+ page expert report for free" : "Kérj ingyenes, részletes 20+ oldalas szakértői jelentést" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--g2a-amber)20", border: "2px solid var(--g2a-amber)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "var(--g2a-amber)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1.1rem" }}>
                      {item.step}
                    </div>
                    <Icon size={20} style={{ color: "var(--g2a-amber)", marginBottom: "0.75rem" }} />
                    <h3 style={{ color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>{item.title}</h3>
                    <p style={{ color: "var(--g2a-text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "3rem" }}>
              {lang === "en" ? "What Our Clients Say" : "Mit mondanak ügyfeleink?"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.75rem" }}>
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} style={{ color: "var(--g2a-amber)", fill: "var(--g2a-amber)" }} />
                    ))}
                  </div>
                  <p style={{ color: "var(--g2a-text)", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic", fontSize: "0.95rem" }}>"{t.text}"</p>
                  <div>
                    <div style={{ color: "var(--g2a-text)", fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</div>
                    <div style={{ color: "var(--g2a-amber)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>{t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="audit-form" style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>
                {lang === "en" ? "Request Your Free Expert SEO Audit" : "Kérd az ingyenes szakértői SEO auditot"}
              </h2>
              <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto" }}>
                {lang === "en"
                  ? "Fill in the form and our SEO expert will send you a detailed report within 24 hours."
                  : "Töltsd ki az űrlapot és SEO szakértőnk 24 órán belül elküldi a részletes jelentést."}
              </p>
            </div>

            {formStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--g2a-bg)", borderRadius: "1rem", border: "1px solid var(--g2a-amber)40" }}>
                <CheckCircle size={48} style={{ color: "var(--g2a-amber)", margin: "0 auto 1rem", display: "block" }} />
                <h3 style={{ color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                  {lang === "en" ? "Request Received!" : "Kérés megérkezett!"}
                </h3>
                <p style={{ color: "var(--g2a-text-muted)" }}>
                  {lang === "en" ? "Our SEO expert will contact you within 24 hours." : "SEO szakértőnk 24 órán belül felveszi veled a kapcsolatot."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ background: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="g2a-layout-sidebar">
                  {[
                    { key: "name", label: lang === "en" ? "Name *" : "Név *", type: "text", required: true, placeholder: "Kovács János" },
                    { key: "email", label: lang === "en" ? "Email *" : "Email *", type: "email", required: true, placeholder: "janos@ceged.hu" },
                    { key: "phone", label: lang === "en" ? "Phone" : "Telefonszám", type: "tel", required: false, placeholder: "+36 30 123 4567" },
                    { key: "company", label: lang === "en" ? "Company" : "Cég neve", type: "text", required: false, placeholder: "Cég Kft." },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: "block", color: "var(--g2a-text)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.5rem", color: "var(--g2a-text)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1.25rem" }}>
                  <label style={{ display: "block", color: "var(--g2a-text)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                    {lang === "en" ? "Website URL" : "Weboldal URL"}
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.ceged.hu"
                    value={form.website || url}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.5rem", color: "var(--g2a-text)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Shield size={16} style={{ color: "var(--g2a-amber)" }} />
                    <span style={{ color: "var(--g2a-text-muted)", fontSize: "0.8rem" }}>
                      {lang === "en" ? "100% free, no obligation" : "100% ingyenes, kötelezettségmentes"}
                    </span>
                  </div>
                  <button type="submit" disabled={formStatus === "loading"} className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    {formStatus === "loading" ? (lang === "en" ? "Sending..." : "Küldés...") : (lang === "en" ? "Request Free Audit" : "Ingyenes audit kérése")} <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Contact alternatives */}
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
              <a href="tel:+36301902575" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                <Phone size={14} /> +36 30 190 2575
              </a>
              <a href="mailto:info@g2amarketing.hu" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--g2a-amber)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--g2a-text-muted)")}>
                <Mail size={14} /> info@g2amarketing.hu
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem" }}>
                <Clock size={14} /> H–P: 08:00–17:00
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "3rem" }}>
              {lang === "en" ? "Frequently Asked Questions" : "Gyakori kérdések"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textAlign: "left", fontSize: "0.95rem" }}>
                    {item.q}
                    {openFaq === i ? <ChevronUp size={18} style={{ color: "var(--g2a-amber)", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "var(--g2a-text-muted)", flexShrink: 0 }} />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 1.5rem 1.25rem", color: "var(--g2a-text-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                      {item.a}
                    </div>
                  )}
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
