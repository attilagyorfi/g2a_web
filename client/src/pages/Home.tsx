import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CookieBanner from "@/components/CookieBanner";
import SeoHead from "@/components/SeoHead";
import {
  ArrowRight, CheckCircle, ChevronRight, Play, Zap, Target, TrendingUp,
  Globe, Code, Megaphone, Search, Palette, Users, Bot, BarChart3,
  Building2, Stethoscope, Car, Wrench, Lightbulb, Scale, ShoppingBag,
  Star, Quote, Phone, Mail, Clock, Award, Shield, Rocket, Brain,
  ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────
function useRevealAll(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const el = containerRef.current;
    if (el) {
      el.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [containerRef]);
}

// ─── Stat Counter ──────────────────────────────────────────────────────────
function StatCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: <Target size={24} />,
    problem: "Nem jön elég érdeklődő",
    desc: "A weboldal látogatói nem konvertálnak, az ajánlatkérések száma alacsony.",
    services: ["SEO", "Google Ads", "Landing Page"],
    slug: "seo",
  },
  {
    icon: <BarChart3 size={24} />,
    problem: "Nem hoz eredményt a hirdetés",
    desc: "Magas hirdetési költség, alacsony megtérülés, átláthatatlan riportok.",
    services: ["PPC Audit", "Meta Ads", "Kampányoptimalizálás"],
    slug: "hirdeteskezeles",
  },
  {
    icon: <Code size={24} />,
    problem: "Elavult a weboldal",
    desc: "Lassú, nem mobilbarát, rossz UX – elvesznek a potenciális ügyfelek.",
    services: ["Webfejlesztés", "UX Design", "Core Web Vitals"],
    slug: "webfejlesztes",
  },
  {
    icon: <Search size={24} />,
    problem: "Nem találnak rá a Google-ben",
    desc: "A versenytársak megelőznek a keresési találatokban, elvesznek az organikus látogatók.",
    services: ["SEO Stratégia", "Tartalommarketing", "Technikai SEO"],
    slug: "seo",
  },
  {
    icon: <Rocket size={24} />,
    problem: "Nincs marketingstratégia",
    desc: "Ad-hoc kampányok, egységes stratégia nélkül – az erőforrások szétforgácsolódnak.",
    services: ["Marketing Stratégia", "Brand Pozicionálás", "Roadmap"],
    slug: "strategiai-marketing",
  },
  {
    icon: <Brain size={24} />,
    problem: "Nem használják ki az AI-t",
    desc: "A versenytársak AI-alapú eszközökkel gyorsabban és olcsóbban dolgoznak.",
    services: ["AI Marketing", "Automatizáció", "AI Tartalom"],
    slug: "ai-marketing",
  },
];

const INDUSTRIES = [
  { icon: <Stethoscope size={22} />, label: "Egészségügy", slug: "marketing-egeszsegugyi-cegeknek", count: "40+ projekt" },
  { icon: <ShoppingBag size={22} />, label: "Szépségipar", slug: "marketing-szepsegipari-cegeknek", count: "25+ projekt" },
  { icon: <Wrench size={22} />, label: "Mérnöki irodák", slug: "marketing-mernoki-irodaknak", count: "30+ projekt" },
  { icon: <Car size={22} />, label: "Autóipar", slug: "marketing-autoipari-cegeknek", count: "20+ projekt" },
  { icon: <Scale size={22} />, label: "Ügyvédi irodák", slug: "marketing-ugyvedii-irodaknak", count: "15+ projekt" },
  { icon: <Code size={22} />, label: "Technológia", slug: "marketing-technologiai-cegeknek", count: "35+ projekt" },
  { icon: <Lightbulb size={22} />, label: "Önkormányzat", slug: "marketing-onkormanyzati-projekteknek", count: "10+ projekt" },
  { icon: <Building2 size={22} />, label: "B2B cégek", slug: "marketing-b2b-cegeknek", count: "50+ projekt" },
];

const AI_FEATURES = [
  { icon: <Bot size={20} />, title: "AI Tartalomgyártás", desc: "Gyorsabb, SEO-optimalizált tartalom generálás AI segítségével" },
  { icon: <Search size={20} />, title: "AI SEO Elemzés", desc: "Automatikus kulcsszókutatás és versenytárs-elemzés" },
  { icon: <BarChart3 size={20} />, title: "Kampányoptimalizálás", desc: "Valós idejű AI-alapú bid management és targeting" },
  { icon: <TrendingUp size={20} />, title: "Prediktív Reporting", desc: "Előrejelzések és automatikus teljesítmény-riportok" },
  { icon: <Zap size={20} />, title: "Workflow Automatizáció", desc: "Ismétlődő feladatok automatizálása, több idő a stratégiára" },
  { icon: <Globe size={20} />, title: "Nemzetközi Kommunikáció", desc: "AI-alapú fordítás és lokalizáció 20+ nyelven" },
];

const WHY_US = [
  { icon: <Brain size={20} />, title: "Stratégiai gondolkodás", desc: "Nem csak kivitelezünk – üzleti célokat értünk el" },
  { icon: <Zap size={20} />, title: "Gyors reakcióidő", desc: "24 órán belül válaszolunk minden megkeresésre" },
  { icon: <Globe size={20} />, title: "Nemzetközi tapasztalat", desc: "Több mint 10 országban szerzett marketing tapasztalat" },
  { icon: <Bot size={20} />, title: "AI-alapú működés", desc: "Minden folyamatunkba integrálva van az AI" },
  { icon: <Shield size={20} />, title: "Átlátható riportok", desc: "Heti és havi részletes teljesítmény-riportok" },
  { icon: <Award size={20} />, title: "Teljes ökoszisztéma", desc: "Stratégiától a kivitelezésig – egy kézből" },
  { icon: <Users size={20} />, title: "Több iparági tapasztalat", desc: "8+ iparágban bizonyított eredmények" },
  { icon: <Target size={20} />, title: "Mérhető eredmények", desc: "Minden kampánynál KPI-alapú célkitűzések" },
];

const AUDIT_ITEMS = [
  "Weboldal technikai állapota (Core Web Vitals, sebesség)",
  "SEO jelenlét és kulcsszó pozíciók",
  "Google Ads és Meta kampányok hatékonysága",
  "Közösségi média jelenlét és engagement",
  "Versenytárs-elemzés és piaci pozíció",
  "Konverziós ráta és UX problémák",
];

const CASE_STUDIES = [
  {
    industry: "Egészségügy",
    client: "Magánklinika",
    problem: "Alacsony online foglalások száma, gyenge SEO jelenlét",
    solution: "Teljes SEO stratégia + Google Ads + weboldal optimalizálás",
    result: "+340% organikus forgalom, +180% online foglalás",
    platforms: ["Google Ads", "SEO", "Web"],
    color: "#10b981",
  },
  {
    industry: "Autóipar",
    client: "Autókereskedő hálózat",
    problem: "Magas hirdetési költség, alacsony konverzió",
    solution: "PPC audit + kampányrestruktúra + landing page optimalizálás",
    result: "-45% CPA, +220% lead generálás",
    platforms: ["Google Ads", "Meta Ads", "Analytics"],
    color: "#3b82f6",
  },
  {
    industry: "B2B Technológia",
    client: "SaaS vállalat",
    problem: "Nemzetközi piacra lépés, brand awareness hiánya",
    solution: "Teljes brand stratégia + multilingual SEO + LinkedIn kampányok",
    result: "+5 új piac, +280% demo foglalás",
    platforms: ["LinkedIn Ads", "SEO", "Content"],
    color: "#8b5cf6",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  useRevealAll(pageRef);

  const { data: seoData } = trpc.content.pageSeo.useQuery({ slug: "fooldal" });
  const { data: testimonialsList } = trpc.content.testimonials.useQuery();
  const { data: partnersList } = trpc.content.partners.useQuery();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const newsletterMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => { setNewsletterStatus("success"); setNewsletterEmail(""); },
    onError: () => setNewsletterStatus("error"),
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    newsletterMutation.mutate({ email: newsletterEmail });
  };

  const faqs = [
    { q: "Mennyi idő alatt láthatók az eredmények?", a: "SEO esetén 3–6 hónap, PPC kampányoknál 2–4 hét alatt mérhető eredmények jelennek meg. Az ingyenes audit során pontosabb becslést adunk." },
    { q: "Milyen méretű cégeknek dolgoztok?", a: "KKV-któl nagyvállalatig minden méretű ügyféllel dolgozunk. Tapasztalatunk van egyszemélyes vállalkozásoktól multinacionális cégekig." },
    { q: "Mi az ingyenes marketing audit folyamata?", a: "Kitöltöd az audit kérő űrlapot, 24 órán belül felvesszük veled a kapcsolatot, majd 5–7 munkanapon belül elkészítjük a részletes auditot." },
    { q: "Hogyan méritek a kampányok sikerét?", a: "Minden kampányhoz egyedi KPI-okat határozunk meg (ROAS, CPA, CTR, konverziós ráta stb.) és heti/havi riportokban számolunk be az eredményekről." },
    { q: "Dolgoztok nemzetközi piacokon is?", a: "Igen, több mint 10 országban van tapasztalatunk. Lokalizáció, multilingual SEO és nemzetközi PPC kampányok terén egyaránt segítünk." },
  ];

  return (
    <>
      <SeoHead
        title={seoData?.metaTitle || "G2A Marketing – Adatvezérelt B2B Marketing Ügynökség | Pécs"}
        description={seoData?.metaDescription || "Stratégiai marketing, AI-alapú megoldások és mérhető növekedés. SEO, PPC, webfejlesztés és teljes marketing ökoszisztéma B2B cégeknek."}
      />
      <ScrollProgressBar />
      <Navigation />
      <CookieBanner />

      <div ref={pageRef}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          background: "radial-gradient(ellipse at 70% 40%, rgba(233,17,48,0.1) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(233,17,48,0.06) 0%, transparent 45%), var(--g2a-bg)",
          position: "relative", overflow: "hidden",
          paddingTop: "6rem",
        }}>
          {/* Grid pattern */}
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />

          {/* Decorative circles */}
          <div style={{
            position: "absolute", right: "-10%", top: "10%",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,17,48,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div style={{ maxWidth: "820px" }}>
              <div className="g2a-section-label animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                🚀 Prémium B2B Marketing Ügynökség
              </div>

              <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.2s", marginBottom: "1.5rem" }}>
                Stratégiai marketing,{" "}
                <span className="g2a-gradient-text">mérhető növekedés</span>
              </h1>

              <p className="animate-fadeInUp" style={{
                animationDelay: "0.35s", fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
                color: "var(--g2a-text-secondary)", lineHeight: "1.7",
                maxWidth: "640px", marginBottom: "2.5rem",
                fontFamily: "Inter, sans-serif",
              }}>
                AI-alapú megoldások és stratégiai marketing azoknak a cégeknek, akik nem akarnak elveszni a zajban. SEO, PPC, webfejlesztés és teljes marketing ökoszisztéma – egy kézből.
              </p>

              <div className="animate-fadeInUp" style={{ animationDelay: "0.5s", display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
                <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                    Ingyenes Marketing Audit <ArrowRight size={18} />
                  </span>
                </Link>
                <Link href="/referenciank" style={{ textDecoration: "none" }}>
                  <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                    <Play size={16} /> Referenciáink
                  </span>
                </Link>
              </div>

              {/* Trust stats */}
              <div className="animate-fadeIn" style={{
                animationDelay: "0.65s",
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem",
                maxWidth: "580px",
              }}>
                {[
                  { num: 150, suffix: "+", label: "Sikeres projekt" },
                  { num: 8, suffix: "+", label: "Iparág" },
                  { num: 10, suffix: "+", label: "Ország" },
                  { num: 98, suffix: "%", label: "Elégedett ügyfél" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div className="g2a-stat-number">
                      <StatCounter target={s.num} suffix={s.suffix} />
                    </div>
                    <div className="g2a-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            color: "var(--g2a-text-muted)", fontSize: "0.75rem", fontFamily: "Roboto Mono, monospace",
            letterSpacing: "0.1em", textTransform: "uppercase",
            animation: "float 2.5s ease-in-out infinite",
          }}>
            <span>Görgess</span>
            <ChevronDown size={16} />
          </div>
        </section>

        {/* ── PARTNER LOGOS ─────────────────────────────────────────────── */}
        {partnersList && partnersList.length > 0 && (
          <section style={{
            padding: "2.5rem 0",
            backgroundColor: "var(--g2a-bg-2)",
            borderTop: "1px solid var(--g2a-border)",
            borderBottom: "1px solid var(--g2a-border)",
            overflow: "hidden",
          }}>
            <div style={{ overflow: "hidden" }}>
              <div className="animate-marquee" style={{ display: "flex", gap: "3rem", width: "max-content", alignItems: "center" }}>
                {[...partnersList, ...partnersList].map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: 0.5, filter: "grayscale(1)", transition: "opacity 0.2s, filter 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.filter = "grayscale(0)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.5"; (e.currentTarget as HTMLElement).style.filter = "grayscale(1)"; }}>
                    {p.logo ? (
                      <img src={p.logo} alt={p.logoAlt || p.name} style={{ height: "32px", width: "auto", maxWidth: "120px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-secondary)", whiteSpace: "nowrap" }}>{p.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── KINEK SEGÍTÜNK ────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">Célcsoportjaink</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                Kinek segítünk?
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                KKV-któl nagyvállalatig, egészségügytől autóiparig – 8+ iparágban bizonyított tapasztalattal
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {INDUSTRIES.map((ind, i) => (
                <Link key={ind.slug} href={`/iparagi/${ind.slug}`} style={{ textDecoration: "none" }}>
                  <div className={`g2a-card reveal reveal-delay-${(i % 4) + 1}`} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="g2a-icon-box">{ind.icon}</div>
                    <div>
                      <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{ind.label}</div>
                      <div style={{ fontFamily: "Roboto Mono, monospace", fontSize: "0.7rem", color: "#e91130", letterSpacing: "0.05em" }}>{ind.count}</div>
                    </div>
                    <ChevronRight size={16} style={{ marginLeft: "auto", color: "var(--g2a-text-muted)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLÉMA-ALAPÚ SZOLGÁLTATÁSOK ────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">Megoldások</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                Mi a te problémád?
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                Nem hagyományos kategóriák szerint gondolkodunk – a te üzleti kihívásaidból indulunk ki
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {PROBLEMS.map((p, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <div className="g2a-icon-box-lg">{p.icon}</div>
                    <div>
                      <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{p.problem}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6", margin: 0 }}>{p.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {p.services.map((s, j) => <span key={j} className="g2a-tag-neutral">{s}</span>)}
                  </div>
                  <Link href={`/szolgaltatasok/${p.slug}`} style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-ghost" style={{ padding: "0.5rem 0", fontSize: "0.875rem" }}>
                      Megoldás megtekintése <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ESETTANULMÁNYOK ───────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div className="g2a-section-label reveal">Referenciák</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ marginBottom: "0.5rem" }}>
                  Valós eredmények
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2">
                  Nem ígérünk – bizonyítunk. Íme néhány ügyfél eredménye.
                </p>
              </div>
              <Link href="/referenciank" style={{ textDecoration: "none" }} className="reveal">
                <span className="g2a-btn-secondary" style={{ fontSize: "0.875rem" }}>
                  Összes referencia <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {CASE_STUDIES.map((cs, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${i + 1}`} style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: cs.color }} />
                  <div style={{ marginBottom: "1rem" }}>
                    <span className="g2a-tag" style={{ marginBottom: "0.75rem", display: "inline-block" }}>{cs.industry}</span>
                    <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{cs.client}</h3>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>Kihívás</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: 0 }}>{cs.problem}</p>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>Megoldás</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", margin: 0 }}>{cs.solution}</p>
                  </div>
                  <div style={{
                    padding: "0.875rem 1rem", borderRadius: "8px",
                    backgroundColor: `${cs.color}12`, border: `1px solid ${cs.color}30`,
                    marginBottom: "1rem",
                  }}>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: cs.color }}>{cs.result}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {cs.platforms.map((pl, j) => <span key={j} className="g2a-tag-neutral">{pl}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI & INNOVÁCIÓ ────────────────────────────────────────────── */}
        <section className="g2a-section" style={{
          background: "linear-gradient(135deg, #0a0005 0%, #0f0f0f 40%, #050010 100%)",
          borderTop: "1px solid rgba(233,17,48,0.15)",
          borderBottom: "1px solid rgba(233,17,48,0.15)",
        }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">AI & Innováció</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">
                  Hogyan használjuk az AI-t?
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ marginBottom: "2rem" }}>
                  Az AI nem a jövő – a mi napi eszközünk. Minden folyamatunkba integrálva van, hogy gyorsabban és hatékonyabban dolgozzunk az ügyfelekért.
                </p>
                <div className="reveal reveal-delay-3">
                  <Link href="/szolgaltatasok/ai-marketing" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-primary">
                      AI Marketing megoldások <ArrowRight size={16} />
                    </span>
                  </Link>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {AI_FEATURES.map((f, i) => (
                  <div key={i} className={`g2a-card-red reveal reveal-delay-${(i % 3) + 1}`}>
                    <div style={{ color: "#e91130", marginBottom: "0.75rem" }}>{f.icon}</div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-secondary)", lineHeight: "1.5" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MIÉRT MINKET ─────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="g2a-section-label reveal">Miért G2A?</div>
              <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                Miért válassz minket?
              </h2>
              <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>
                Nem csak egy ügynökség vagyunk – stratégiai partnerek vagyunk a növekedésedben
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {WHY_US.map((w, i) => (
                <div key={i} className={`g2a-card reveal reveal-delay-${(i % 4) + 1}`} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div className="g2a-icon-box" style={{ flexShrink: 0 }}>{w.icon}</div>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{w.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", lineHeight: "1.6" }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INGYENES AUDIT ────────────────────────────────────────────── */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <div>
                <div className="g2a-section-label reveal">Ingyenes ajánlat</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">
                  Ingyenes Marketing Audit
                </h2>
                <p className="g2a-section-subtitle reveal reveal-delay-2" style={{ marginBottom: "2rem" }}>
                  Megvizsgáljuk a teljes online jelenlétedet és megmutatjuk, hol veszítesz el ügyfeleket – teljesen ingyenesen.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }} className="reveal reveal-delay-3">
                  {AUDIT_ITEMS.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle size={16} style={{ color: "#e91130", flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "Inter, sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="g2a-card reveal reveal-delay-2" style={{ padding: "2.5rem" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.375rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>
                  Kérd az ingyenes auditot
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", marginBottom: "1.75rem" }}>
                  24 órán belül felvesszük veled a kapcsolatot.
                </p>
                <AuditForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        {testimonialsList && testimonialsList.length > 0 && (
          <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
            <div className="g2a-container">
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <div className="g2a-section-label reveal">Vélemények</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  Mit mondanak az ügyfeleink?
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {testimonialsList.slice(0, 3).map((t, i) => (
                  <div key={t.id} className={`g2a-card reveal reveal-delay-${i + 1}`}>
                    <Quote size={28} style={{ color: "#e91130", marginBottom: "1rem", opacity: 0.7 }} />
                    <p style={{ fontSize: "0.95rem", color: "var(--g2a-text-secondary)", lineHeight: "1.75", marginBottom: "1.5rem", fontStyle: "italic" }}>
                      "{t.quote}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        backgroundColor: "rgba(233,17,48,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#e91130",
                      }}>
                        {t.authorName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)" }}>{t.authorName}</div>
                        {t.authorCompany && <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)" }}>{t.authorCompany}</div>}
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div className="g2a-section-label reveal">GYIK</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  Gyakori kérdések
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {faqs.map((faq, i) => (
                  <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ padding: "1.25rem 1.5rem", cursor: "pointer" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                      <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--g2a-text-primary)", margin: 0 }}>{faq.q}</h3>
                      <div style={{ color: "#e91130", flexShrink: 0 }}>
                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    {openFaq === i && (
                      <p style={{ marginTop: "0.875rem", fontSize: "0.9rem", color: "var(--g2a-text-secondary)", lineHeight: "1.7", marginBottom: 0 }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
        <section className="g2a-section-sm" style={{
          backgroundColor: "var(--g2a-bg)",
          borderTop: "1px solid var(--g2a-border)",
        }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
              <div className="g2a-section-label reveal">Hírlevél</div>
              <h2 className="reveal reveal-delay-1" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>
                Marketing trendek, minden héten
              </h2>
              <p className="reveal reveal-delay-2" style={{ color: "var(--g2a-text-secondary)", marginBottom: "1.75rem", fontSize: "0.95rem" }}>
                Iratkozz fel hírlevelünkre és kapj heti marketing tippeket, esettanulmányokat és AI-újdonságokat.
              </p>
              <form onSubmit={handleNewsletter} className="reveal reveal-delay-3" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="email" required value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Email cím"
                  className="g2a-input"
                  style={{ flex: 1, minWidth: "220px" }}
                />
                <button type="submit" className="g2a-btn-primary" disabled={newsletterStatus === "loading"} style={{ flexShrink: 0 }}>
                  {newsletterStatus === "loading" ? "Feliratkozás..." : "Feliratkozás"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p style={{ color: "#10b981", marginTop: "0.75rem", fontSize: "0.875rem" }}>✓ Sikeresen feliratkoztál!</p>
              )}
              {newsletterStatus === "error" && (
                <p style={{ color: "#e91130", marginTop: "0.75rem", fontSize: "0.875rem" }}>Hiba történt. Kérjük, próbáld újra.</p>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA BOTTOM ───────────────────────────────────────────────── */}
        <section className="g2a-section" style={{
          background: "linear-gradient(135deg, rgba(233,17,48,0.08) 0%, var(--g2a-bg) 50%, rgba(233,17,48,0.05) 100%)",
          borderTop: "1px solid var(--g2a-border)",
        }}>
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1.25rem" }}>
              Készen állsz a növekedésre?
            </h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              Vedd fel velünk a kapcsolatot és indítsuk el a közös munkát egy ingyenes konzultációval.
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  Ingyenes Audit kérése <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  <Phone size={16} /> Kapcsolatfelvétel
                </span>
              </Link>
            </div>
            <div className="reveal reveal-delay-3" style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
              {[
                { icon: <Phone size={14} />, text: "+36 30 190 2575" },
                { icon: <Mail size={14} />, text: "info@g2amarketing.hu" },
                { icon: <Clock size={14} />, text: "08:00 – 17:00" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--g2a-text-muted)", fontSize: "0.875rem", fontFamily: "Inter, sans-serif" }}>
                  <span style={{ color: "#e91130" }}>{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <StickyAuditCTA />

      <Footer />
    </>
  );
}

// ─── Audit Form ────────────────────────────────────────────────────────────
function AuditForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    contactMutation.mutate({ ...form, subject: "Ingyenes Marketing Audit kérés" });
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <CheckCircle size={48} style={{ color: "#10b981", margin: "0 auto 1rem" }} />
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>Köszönjük!</h3>
        <p style={{ color: "var(--g2a-text-secondary)", fontSize: "0.9rem" }}>24 órán belül felvesszük veled a kapcsolatot.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className="g2a-label">Név *</label>
          <input className="g2a-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Kovács János" />
        </div>
        <div>
          <label className="g2a-label">Email *</label>
          <input className="g2a-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@ceg.hu" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className="g2a-label">Telefon</label>
          <input className="g2a-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30..." />
        </div>
        <div>
          <label className="g2a-label">Cég neve</label>
          <input className="g2a-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Cég Kft." />
        </div>
      </div>
      <div>
        <label className="g2a-label">Rövid leírás (opcionális)</label>
        <textarea className="g2a-input" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Miben segíthetünk?" style={{ resize: "vertical" }} />
      </div>
      <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center" }}>
        {status === "loading" ? "Küldés..." : "Audit kérése – Ingyenesen"}
      </button>
      {status === "error" && <p style={{ color: "#e91130", fontSize: "0.875rem", textAlign: "center" }}>Hiba történt. Kérjük, próbáld újra.</p>}
    </form>
  );
}

// ─── Sticky CTA ────────────────────────────────────────────────────────────
function StickyAuditCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta">
      <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
        <span className="g2a-btn-primary animate-pulse-red" style={{ fontSize: "0.875rem", padding: "0.875rem 1.5rem", borderRadius: "50px" }}>
          <Zap size={15} /> Ingyenes Audit
        </span>
      </Link>
    </div>
  );
}
