import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Star, TrendingUp,
  BarChart3, Search, Globe, Megaphone, Palette, Code2, Cpu,
  Target, Zap, Shield, Users, Award, Clock, ChevronDown, ChevronUp,
  Building2, Stethoscope, Car, Scale, Wrench, ShoppingBag, Landmark, Briefcase,
  X, Play, Quote, ChevronRight
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";

// ─── Icon map ──────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  search: <Search size={22} />, target: <Target size={22} />, megaphone: <Megaphone size={22} />,
  globe: <Globe size={22} />, code: <Code2 size={22} />, cpu: <Cpu size={22} />,
  palette: <Palette size={22} />, chart: <BarChart3 size={22} />, zap: <Zap size={22} />,
  trending: <TrendingUp size={22} />, shield: <Shield size={22} />, award: <Award size={22} />,
  users: <Users size={22} />, clock: <Clock size={22} />,
  building: <Building2 size={22} />, stethoscope: <Stethoscope size={22} />,
  car: <Car size={22} />, scale: <Scale size={22} />, wrench: <Wrench size={22} />,
  shopping: <ShoppingBag size={22} />, landmark: <Landmark size={22} />, briefcase: <Briefcase size={22} />,
};

// ─── Translations ──────────────────────────────────────────────────────────
const T = {
  hu: {
    announcementText: "Ingyenes marketing audit – Derítsd ki, hol veszítesz ügyfeleket",
    announcementCta: "Kérd most",
    heroLabel: "Adatvezérelt Marketing Ügynökség",
    heroTitle1: "Marketing, ami",
    heroTitle2: "valódi eredményt",
    heroTitle3: "hoz",
    heroSubtitle: "Segítünk B2B és B2C vállalkozásoknak növelni bevételüket adatvezérelt stratégiákkal, SEO-val, PPC-vel és AI-alapú marketing megoldásokkal.",
    heroCta1: "Ingyenes audit kérése",
    heroCta2: "Referenciák megtekintése",
    stat1Value: "150+", stat1Label: "Sikeres projekt",
    stat2Value: "8+", stat2Label: "Év tapasztalat",
    stat3Value: "95%", stat3Label: "Ügyfél-elégedettség",
    stat4Value: "3×", stat4Label: "Átlagos ROI",
    trustLabel: "Megbíznak bennünk",
    problemLabel: "Felismered magad?",
    problemTitle: "Ezek a problémák ismerősek?",
    problemSubtitle: "Ha igen, nem vagy egyedül – és pontosan ezeket oldjuk meg.",
    problems: [
      { title: "Nem jönnek az organikus látogatók", desc: "A weboldalad szinte láthatatlan a Google-ben, miközben a versenytársaid az első helyen vannak." },
      { title: "A hirdetések nem térülnek meg", desc: "Sokat költesz Google Ads-re vagy Meta hirdetésekre, de az eredmény messze elmarad az elvárástól." },
      { title: "Nincs konzisztens marketing stratégia", desc: "Próbálsz mindent egyszerre, de nincs összehangolt rendszer, ami valóban működik." },
      { title: "Az ügyfélszerzés drága és lassú", desc: "Magas az ügyfélszerzési költséged, és nem látod, melyik csatorna hozza a legjobb eredményt." },
      { title: "A weboldal nem konvertál", desc: "Jönnek a látogatók, de nem lesznek belőlük ügyfelek – a konverziós ráta alacsony." },
      { title: "Nincs idő a marketingre", desc: "A napi operatív munkában elvész a marketing, és nem jut kapacitás a stratégiai gondolkodásra." },
    ],
    solutionLabel: "Hogyan segítünk",
    solutionTitle: "Komplex megoldás, mért eredmények",
    services: [
      { icon: "search", title: "Keresőoptimalizálás", desc: "Organikus forgalom növelése, első oldali pozíciók, technikai SEO audit.", slug: "kereses-optimalizalas" },
      { icon: "target", title: "PPC / Google Ads", desc: "Profitábilis hirdetési kampányok, ROAS optimalizálás, konverziókövetés.", slug: "ppc-google-ads" },
      { icon: "megaphone", title: "Meta Hirdetések", desc: "Facebook és Instagram kampányok, célzott közönségek, remarketing.", slug: "meta-hirdetesek" },
      { icon: "globe", title: "Közösségi Média", desc: "Organikus közösségi média kezelés, tartalom stratégia, engagement növelés.", slug: "kozossegi-media" },
      { icon: "code", title: "Webfejlesztés", desc: "Konverzióra optimalizált weboldalak, landing page-ek, CRO.", slug: "webfejlesztes" },
      { icon: "cpu", title: "AI Marketing", desc: "Mesterséges intelligencia alapú marketing automatizáció és tartalom.", slug: "ai-marketing" },
    ],
    industriesLabel: "Szakterületek",
    industriesTitle: "Iparágak, ahol otthon vagyunk",
    industries: [
      { icon: "building", title: "B2B Vállalatok", slug: "b2b-cegeknek" },
      { icon: "stethoscope", title: "Egészségügy", slug: "egeszsegugyi-cegeknek" },
      { icon: "car", title: "Autóipar", slug: "autoipari-cegeknek" },
      { icon: "scale", title: "Jogi szolgáltatások", slug: "ugyvedi-irodaknak" },
      { icon: "wrench", title: "Mérnöki irodák", slug: "mernoki-irodaknak" },
      { icon: "shopping", title: "E-kereskedelem", slug: "b2b-cegeknek" },
      { icon: "landmark", title: "Önkormányzatok", slug: "onkormanyzati-projekteknek" },
      { icon: "briefcase", title: "Technológia", slug: "technologiai-cegeknek" },
    ],
    processLabel: "Folyamatunk",
    processTitle: "Hogyan dolgozunk együtt",
    processSteps: [
      { num: "01", title: "Ingyenes audit", desc: "Megvizsgáljuk a jelenlegi marketing helyzetét és azonosítjuk a fejlesztési lehetőségeket." },
      { num: "02", title: "Stratégia tervezés", desc: "Személyre szabott marketing stratégiát készítünk a célok és a budget alapján." },
      { num: "03", title: "Implementáció", desc: "A stratégiát tapasztalt csapatunk hajtja végre, folyamatos optimalizálással." },
      { num: "04", title: "Mérés és riportálás", desc: "Átlátható riportok, valós idejű adatok, és folyamatos fejlesztés az eredmények alapján." },
    ],
    whyLabel: "Miért mi?",
    whyTitle: "Amit máshol nem kapsz meg",
    whyItems: [
      { icon: "trending", title: "Adatvezérelt döntések", desc: "Minden döntés mögött adat áll – nem megérzés." },
      { icon: "shield", title: "Átlátható riportálás", desc: "Havi részletes riportok, valós idejű dashboard hozzáférés." },
      { icon: "zap", title: "Gyors implementáció", desc: "Nem hetek, hanem napok alatt elindulnak a kampányok." },
      { icon: "award", title: "Iparági tapasztalat", desc: "8+ év tapasztalat, 150+ sikeres projekt különböző iparágakban." },
      { icon: "users", title: "Dedikált csapat", desc: "Minden ügyfélnek saját account managere és szakértői csapata van." },
      { icon: "chart", title: "Mért eredmények", desc: "Csak olyan munkát vállalunk, ahol mérhetők az eredmények." },
    ],
    auditLabel: "Ingyenes ajánlat",
    auditTitle: "Kérd ingyenes marketing auditod",
    auditSubtitle: "30 perces stratégiai konzultáció – teljesen ingyenes, kötelezettség nélkül.",
    auditItems: ["Weboldal és SEO elemzés", "Hirdetési fiók audit", "Versenytárs elemzés", "Konkrét fejlesztési javaslatok"],
    auditCta: "Ingyenes audit kérése",
    testimonialsLabel: "Vélemények",
    testimonialsTitle: "Mit mondanak ügyfeleink",
    caseStudiesLabel: "Referenciák",
    caseStudiesTitle: "Valós eredmények, valós ügyfelek",
    caseStudiesCta: "Összes referencia megtekintése",
    faqLabel: "GYIK",
    faqTitle: "Gyakran ismételt kérdések",
    faqs: [
      { q: "Mennyi idő alatt láthatók az eredmények?", a: "SEO esetén általában 3-6 hónap, PPC és Meta hirdetéseknél már az első héten láthatók az eredmények. Az audit után pontosabb becslést adunk." },
      { q: "Milyen méretű cégeknek dolgoztok?", a: "Kis- és középvállalkozásoktól a nagyvállalatokig mindenki számára kínálunk megoldást. A stratégiát mindig az adott cég méretéhez és céljaihoz igazítjuk." },
      { q: "Hogyan méritek az eredményeket?", a: "Minden kampányhoz egyedi KPI-okat határozunk meg, és havi részletes riportokat küldünk. Valós idejű dashboard hozzáférést is biztosítunk." },
      { q: "Mi a minimális szerződési időszak?", a: "Nincs kötelező minimális időszak – de a legjobb eredmények 3-6 hónapos együttműködés után láthatók. Rugalmas szerződési feltételeket kínálunk." },
    ],
    newsletterTitle: "Iratkozz fel hírlevelünkre",
    newsletterSubtitle: "Heti marketing tippek, iparági hírek és exkluzív tartalmak.",
    newsletterPlaceholder: "E-mail cím",
    newsletterCta: "Feliratkozás",
    ctaTitle: "Készen állsz a növekedésre?",
    ctaSubtitle: "Vedd fel velünk a kapcsolatot, és derítsd ki, hogyan segíthetünk elérni a céljaidat.",
    ctaCta1: "Ingyenes audit kérése",
    ctaCta2: "Kapcsolatfelvétel",
  },
  en: {
    announcementText: "Free marketing audit – Find out where you're losing customers",
    announcementCta: "Get it now",
    heroLabel: "Data-Driven Marketing Agency",
    heroTitle1: "Marketing that",
    heroTitle2: "delivers real",
    heroTitle3: "results",
    heroSubtitle: "We help B2B and B2C businesses grow their revenue with data-driven strategies, SEO, PPC, and AI-powered marketing solutions.",
    heroCta1: "Get a free audit",
    heroCta2: "View case studies",
    stat1Value: "150+", stat1Label: "Successful projects",
    stat2Value: "8+", stat2Label: "Years experience",
    stat3Value: "95%", stat3Label: "Client satisfaction",
    stat4Value: "3×", stat4Label: "Average ROI",
    trustLabel: "Trusted by",
    problemLabel: "Sound familiar?",
    problemTitle: "Do these problems sound familiar?",
    problemSubtitle: "If yes, you're not alone – and these are exactly what we solve.",
    problems: [
      { title: "No organic traffic", desc: "Your website is nearly invisible on Google while competitors rank on page one." },
      { title: "Ads not converting", desc: "You're spending on Google Ads or Meta but results fall far short of expectations." },
      { title: "No consistent strategy", desc: "You're trying everything at once but there's no coordinated system that actually works." },
      { title: "Expensive customer acquisition", desc: "High CAC and you can't tell which channel brings the best results." },
      { title: "Website doesn't convert", desc: "Visitors come but don't become customers – conversion rate is too low." },
      { title: "No time for marketing", desc: "Daily operations consume all capacity, leaving no room for strategic thinking." },
    ],
    solutionLabel: "How we help",
    solutionTitle: "Complete solutions, measurable results",
    services: [
      { icon: "search", title: "Search Engine Optimization", desc: "Organic traffic growth, first-page rankings, technical SEO audits.", slug: "kereses-optimalizalas" },
      { icon: "target", title: "PPC / Google Ads", desc: "Profitable ad campaigns, ROAS optimization, conversion tracking.", slug: "ppc-google-ads" },
      { icon: "megaphone", title: "Meta Advertising", desc: "Facebook and Instagram campaigns, targeted audiences, remarketing.", slug: "meta-hirdetesek" },
      { icon: "globe", title: "Social Media", desc: "Organic social media management, content strategy, engagement growth.", slug: "kozossegi-media" },
      { icon: "code", title: "Web Development", desc: "Conversion-optimized websites, landing pages, CRO.", slug: "webfejlesztes" },
      { icon: "cpu", title: "AI Marketing", desc: "AI-powered marketing automation and content generation.", slug: "ai-marketing" },
    ],
    industriesLabel: "Expertise",
    industriesTitle: "Industries we specialize in",
    industries: [
      { icon: "building", title: "B2B Companies", slug: "b2b-cegeknek" },
      { icon: "stethoscope", title: "Healthcare", slug: "egeszsegugyi-cegeknek" },
      { icon: "car", title: "Automotive", slug: "autoipari-cegeknek" },
      { icon: "scale", title: "Legal Services", slug: "ugyvedi-irodaknak" },
      { icon: "wrench", title: "Engineering Firms", slug: "mernoki-irodaknak" },
      { icon: "shopping", title: "E-commerce", slug: "b2b-cegeknek" },
      { icon: "landmark", title: "Public Sector", slug: "onkormanyzati-projekteknek" },
      { icon: "briefcase", title: "Technology", slug: "technologiai-cegeknek" },
    ],
    processLabel: "Our process",
    processTitle: "How we work together",
    processSteps: [
      { num: "01", title: "Free audit", desc: "We analyze your current marketing situation and identify growth opportunities." },
      { num: "02", title: "Strategy planning", desc: "We create a customized marketing strategy based on your goals and budget." },
      { num: "03", title: "Implementation", desc: "Our experienced team executes the strategy with continuous optimization." },
      { num: "04", title: "Measurement & reporting", desc: "Transparent reports, real-time data, and continuous improvement based on results." },
    ],
    whyLabel: "Why us?",
    whyTitle: "What you won't find elsewhere",
    whyItems: [
      { icon: "trending", title: "Data-driven decisions", desc: "Every decision is backed by data – not gut feeling." },
      { icon: "shield", title: "Transparent reporting", desc: "Monthly detailed reports, real-time dashboard access." },
      { icon: "zap", title: "Fast implementation", desc: "Campaigns launch in days, not weeks." },
      { icon: "award", title: "Industry experience", desc: "8+ years, 150+ successful projects across various industries." },
      { icon: "users", title: "Dedicated team", desc: "Every client has their own account manager and expert team." },
      { icon: "chart", title: "Measured results", desc: "We only take on work where results can be measured." },
    ],
    auditLabel: "Free offer",
    auditTitle: "Get your free marketing audit",
    auditSubtitle: "30-minute strategic consultation – completely free, no obligation.",
    auditItems: ["Website and SEO analysis", "Ad account audit", "Competitor analysis", "Concrete improvement suggestions"],
    auditCta: "Get free audit",
    testimonialsLabel: "Testimonials",
    testimonialsTitle: "What our clients say",
    caseStudiesLabel: "Case Studies",
    caseStudiesTitle: "Real results, real clients",
    caseStudiesCta: "View all case studies",
    faqLabel: "FAQ",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "How long until results are visible?", a: "For SEO, typically 3-6 months. For PPC and Meta ads, results are visible within the first week. We'll give a more precise estimate after the audit." },
      { q: "What size companies do you work with?", a: "We offer solutions for everyone from small businesses to large enterprises. We always tailor the strategy to the company's size and goals." },
      { q: "How do you measure results?", a: "We define custom KPIs for every campaign and send monthly detailed reports. We also provide real-time dashboard access." },
      { q: "What is the minimum contract period?", a: "There's no mandatory minimum period – but the best results are seen after 3-6 months of collaboration. We offer flexible contract terms." },
    ],
    newsletterTitle: "Subscribe to our newsletter",
    newsletterSubtitle: "Weekly marketing tips, industry news, and exclusive content.",
    newsletterPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    ctaTitle: "Ready to grow?",
    ctaSubtitle: "Get in touch with us and find out how we can help you achieve your goals.",
    ctaCta1: "Get a free audit",
    ctaCta2: "Contact us",
  },
};

// ─── Animated Counter ──────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Section Fade-in ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Home() {
  const { lang } = useLanguage();
  const t = T[lang as keyof typeof T] || T.hu;
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");

  const { data: seoData } = trpc.content.pageSeo.useQuery({ slug: "home" });
  const { data: testimonialsData } = trpc.content.testimonials.useQuery();
  const { data: partnersData } = trpc.content.partners.useQuery();
  const { data: caseStudiesData } = trpc.content.caseStudies.useQuery();

  const newsletterMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => { setNewsletterStatus("success"); setEmail(""); },
    onError: () => setNewsletterStatus("error"),
  });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    newsletterMutation.mutate({ email });
  };

  const partners = partnersData || [];
  const testimonials = testimonialsData || [];
  const caseStudies = (caseStudiesData || []).slice(0, 3);

  // ─── Styles ──────────────────────────────────────────────────────────────
  const sectionPadding = { padding: "5rem 0" };
  const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" };
  const labelStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    padding: "0.375rem 0.875rem", borderRadius: "100px",
    background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
    color: "var(--g2a-amber)", fontSize: "0.75rem", fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: "1rem",
  };
  const h2Style: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
    fontWeight: 800, lineHeight: 1.15,
    color: "var(--g2a-text-primary)",
    marginBottom: "1rem",
    letterSpacing: "-0.02em",
  };
  const cardStyle: React.CSSProperties = {
    background: "var(--g2a-bg-card)",
    border: "1px solid var(--g2a-border)",
    borderRadius: "16px",
    padding: "1.75rem",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <ScrollProgressBar />
      <SeoHead
        title={seoData?.metaTitle || (lang === "hu" ? "G2A Marketing – Adatvezérelt Marketing Ügynökség" : "G2A Marketing – Data-Driven Marketing Agency")}
        description={seoData?.metaDescription || t.heroSubtitle}
        canonicalUrl="https://g2amarketing.hu"
      />

      {/* ── Announcement Bar ─────────────────────────────────────────────── */}
      {announcementVisible && (
        <div style={{
          background: "var(--g2a-amber)", color: "#000",
          padding: "0.625rem 1rem", textAlign: "center",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
          position: "relative", zIndex: 50,
        }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
            {t.announcementText}
          </span>
          <Link href="/audit" style={{
            fontSize: "0.8125rem", fontWeight: 700, color: "#000",
            textDecoration: "underline", fontFamily: "'Inter', sans-serif",
          }}>
            {t.announcementCta} →
          </Link>
          <button onClick={() => setAnnouncementVisible(false)}
            style={{ position: "absolute", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#000", opacity: 0.6 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--g2a-bg)",
        paddingTop: "6rem", paddingBottom: "5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, var(--g2a-amber-glow) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--g2a-blue-light) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(var(--g2a-border) 1px, transparent 1px), linear-gradient(90deg, var(--g2a-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
          pointerEvents: "none",
        }} />

        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
            className="hero-grid">
            {/* Left */}
            <div>
              <FadeIn>
                <div style={labelStyle}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--g2a-amber)", display: "inline-block" }} />
                  {t.heroLabel}
                </div>
                <h1 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                  fontWeight: 800, lineHeight: 1.1,
                  color: "var(--g2a-text-primary)",
                  letterSpacing: "-0.03em",
                  marginBottom: "1.5rem",
                }}>
                  {t.heroTitle1}{" "}
                  <span style={{
                    color: "var(--g2a-amber)",
                    position: "relative",
                  }}>
                    {t.heroTitle2}
                    <svg style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "8px" }} viewBox="0 0 200 8" fill="none">
                      <path d="M0 6 Q50 2 100 6 Q150 10 200 6" stroke="var(--g2a-amber)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </span>{" "}
                  {t.heroTitle3}
                </h1>
                <p style={{
                  fontSize: "1.0625rem", lineHeight: 1.7,
                  color: "var(--g2a-text-secondary)",
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "2rem",
                  maxWidth: "520px",
                }}>
                  {t.heroSubtitle}
                </p>
                <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  <Link href="/audit" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.875rem 1.75rem", borderRadius: "10px",
                    background: "var(--g2a-amber)", color: "#000",
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9375rem",
                    textDecoration: "none", transition: "all 0.2s",
                    boxShadow: "0 4px 20px var(--g2a-amber-glow)",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                    {t.heroCta1} <ArrowRight size={16} />
                  </Link>
                  <Link href="/referenciak" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.875rem 1.75rem", borderRadius: "10px",
                    background: "transparent", color: "var(--g2a-text-primary)",
                    border: "1px solid var(--g2a-border)",
                    fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9375rem",
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-amber)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-amber)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-border)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-primary)"; }}>
                    {t.heroCta2}
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right – Stats card */}
            <FadeIn delay={200}>
              <div style={{
                background: "var(--g2a-bg-card)",
                border: "1px solid var(--g2a-border)",
                borderRadius: "20px",
                padding: "2rem",
                backdropFilter: "blur(12px)",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {[
                    { value: 150, suffix: "+", label: t.stat1Label },
                    { value: 8, suffix: "+", label: t.stat2Label },
                    { value: 95, suffix: "%", label: t.stat3Label },
                    { value: 3, suffix: "×", label: t.stat4Label },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      padding: "1.25rem",
                      background: "var(--g2a-bg-2)",
                      borderRadius: "12px",
                      border: "1px solid var(--g2a-border)",
                      textAlign: "center",
                    }}>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "2rem", fontWeight: 800,
                        color: "var(--g2a-amber)",
                        lineHeight: 1,
                        marginBottom: "0.375rem",
                      }}>
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div style={{
                        fontSize: "0.8rem", color: "var(--g2a-text-secondary)",
                        fontFamily: "'Inter', sans-serif", fontWeight: 500,
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini testimonial */}
                <div style={{
                  marginTop: "1.5rem", padding: "1rem 1.25rem",
                  background: "var(--g2a-amber-light)",
                  border: "1px solid var(--g2a-amber-border)",
                  borderRadius: "10px",
                  display: "flex", gap: "0.75rem", alignItems: "flex-start",
                }}>
                  <Quote size={18} color="var(--g2a-amber)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.5, marginBottom: "0.375rem" }}>
                      {lang === "hu" ? "A G2A Marketing segítségével 3 hónap alatt 180%-kal nőtt az organikus forgalmunk." : "With G2A Marketing's help, our organic traffic grew by 180% in 3 months."}
                    </p>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--g2a-amber)" color="var(--g2a-amber)" />)}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR (Partner logos) ─────────────────────────────────────── */}
      {partners.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--g2a-border)",
          borderBottom: "1px solid var(--g2a-border)",
          background: "var(--g2a-bg-2)",
          padding: "1.5rem 0",
          overflow: "hidden",
        }}>
          <div style={containerStyle}>
            <p style={{
              textAlign: "center", fontSize: "0.75rem", fontWeight: 700,
              color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}>
              {t.trustLabel}
            </p>
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              {partners.slice(0, 8).map((p: { id: number; name: string; logo?: string | null }) => (
                <div key={p.id} style={{ opacity: 0.5, transition: "opacity 0.2s", filter: "grayscale(1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.filter = "grayscale(0)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.5"; (e.currentTarget as HTMLElement).style.filter = "grayscale(1)"; }}>
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} style={{ height: "32px", width: "auto", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif" }}>{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROBLEMS ─────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.problemLabel}</div>
              <h2 style={h2Style}>{t.problemTitle}</h2>
              <p style={{ color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}>{t.problemSubtitle}</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {t.problems.map((problem, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  ...cardStyle,
                  display: "flex", gap: "1rem", alignItems: "flex-start",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-amber-border)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-border)"; el.style.transform = "translateY(0)"; }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "var(--g2a-amber)", flexShrink: 0, marginTop: "6px",
                  }} />
                  <div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{problem.title}</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{problem.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg-2)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.solutionLabel}</div>
              <h2 style={h2Style}>{t.solutionTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {t.services.map((service, i) => (
              <FadeIn key={i} delay={i * 80}>
                <Link href={`/szolgaltatasok/${service.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    ...cardStyle, cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "1rem",
                    height: "100%",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-amber-border)"; el.style.background = "var(--g2a-bg-card-hover)"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-border)"; el.style.background = "var(--g2a-bg-card)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "12px",
                      background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--g2a-amber)",
                    }}>
                      {ICON_MAP[service.icon]}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{service.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{service.desc}</p>
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-amber)", fontSize: "0.8125rem", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                      {lang === "hu" ? "Részletek" : "Learn more"} <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/szolgaltatasok" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1.5rem", borderRadius: "10px",
              border: "1px solid var(--g2a-border)", color: "var(--g2a-text-secondary)",
              fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-amber)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-amber)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--g2a-border)"; (e.currentTarget as HTMLElement).style.color = "var(--g2a-text-secondary)"; }}>
              {lang === "hu" ? "Összes szolgáltatás" : "All services"} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.processLabel}</div>
              <h2 style={h2Style}>{t.processTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {t.processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{ position: "relative" }}>
                  {i < t.processSteps.length - 1 && (
                    <div style={{
                      position: "absolute", top: "28px", left: "calc(100% - 12px)",
                      width: "24px", height: "2px",
                      background: "var(--g2a-border)",
                      display: "none",
                    }} className="process-connector" />
                  )}
                  <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "14px",
                      background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 1rem",
                    }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-amber)" }}>{step.num}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)", marginBottom: "0.5rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section style={{ ...sectionPadding, background: "var(--g2a-bg-2)" }}>
          <div style={containerStyle}>
            <FadeIn>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={labelStyle}>{t.caseStudiesLabel}</div>
                  <h2 style={{ ...h2Style, marginBottom: 0 }}>{t.caseStudiesTitle}</h2>
                </div>
                <Link href="/referenciak" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--g2a-amber)", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                  {t.caseStudiesCta} <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {caseStudies.map((cs: { id: number; title: string; industry?: string | null; results?: string | null; description?: string | null }, i) => (
                <FadeIn key={cs.id} delay={i * 100}>
                  <div style={{
                    ...cardStyle,
                    display: "flex", flexDirection: "column", gap: "1rem",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-amber-border)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-border)"; el.style.transform = "translateY(0)"; }}>
                    {cs.industry && (
                      <span style={{
                        display: "inline-block", padding: "0.25rem 0.625rem",
                        background: "var(--g2a-blue-light)", border: "1px solid var(--g2a-blue-border)",
                        borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600,
                        color: "var(--g2a-blue)", fontFamily: "'JetBrains Mono', monospace",
                        width: "fit-content",
                      }}>
                        {cs.industry}
                      </span>
                    )}
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.0625rem", color: "var(--g2a-text-primary)" }}>{cs.title}</h3>
                    {cs.description && <p style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{cs.description}</p>}
                    {cs.results && (
                      <div style={{
                        padding: "0.875rem 1rem",
                        background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                        borderRadius: "8px",
                      }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--g2a-amber)", fontFamily: "'Inter', sans-serif" }}>{cs.results}</p>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INDUSTRIES ───────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.industriesLabel}</div>
              <h2 style={h2Style}>{t.industriesTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {t.industries.map((ind, i) => (
              <FadeIn key={i} delay={i * 60}>
                <Link href={`/iparagi/${ind.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    ...cardStyle,
                    display: "flex", alignItems: "center", gap: "1rem",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-amber-border)"; el.style.background = "var(--g2a-bg-card-hover)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--g2a-border)"; el.style.background = "var(--g2a-bg-card)"; }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--g2a-amber)", flexShrink: 0,
                    }}>
                      {ICON_MAP[ind.icon]}
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--g2a-text-primary)" }}>{ind.title}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg-2)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.whyLabel}</div>
              <h2 style={h2Style}>{t.whyTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {t.whyItems.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{ ...cardStyle, display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px",
                    background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--g2a-amber)", flexShrink: 0,
                  }}>
                    {ICON_MAP[item.icon]}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--g2a-text-primary)", marginBottom: "0.375rem" }}>{item.title}</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section style={{ ...sectionPadding, background: "var(--g2a-bg)" }}>
          <div style={containerStyle}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={labelStyle}>{t.testimonialsLabel}</div>
                <h2 style={h2Style}>{t.testimonialsTitle}</h2>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {testimonials.slice(0, 3).map((testimonial, i) => (
                <FadeIn key={testimonial.id} delay={i * 100}>
                  <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill="var(--g2a-amber)" color="var(--g2a-amber)" />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7, fontStyle: "italic" }}>
                      "{testimonial.quote}"
                    </p>
                    <div style={{ marginTop: "auto", borderTop: "1px solid var(--g2a-border)", paddingTop: "1rem" }}>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--g2a-text-primary)" }}>{testimonial.authorName}</div>
                      {(testimonial.authorTitle || testimonial.authorCompany) && (
                        <div style={{ fontSize: "0.8rem", color: "var(--g2a-text-muted)", fontFamily: "'Inter', sans-serif" }}>
                          {testimonial.authorTitle}{testimonial.authorTitle && testimonial.authorCompany ? " – " : ""}{testimonial.authorCompany}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── AUDIT CTA ────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg-2)" }}>
        <div style={containerStyle}>
          <FadeIn>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center",
            }} className="audit-grid">
              <div>
                <div style={labelStyle}>{t.auditLabel}</div>
                <h2 style={h2Style}>{t.auditTitle}</h2>
                <p style={{ color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", fontSize: "1rem", marginBottom: "1.5rem" }}>{t.auditSubtitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {t.auditItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <CheckCircle2 size={18} color="var(--g2a-amber)" />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", color: "var(--g2a-text-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                background: "var(--g2a-bg-card)",
                border: "1px solid var(--g2a-border)",
                borderRadius: "20px", padding: "2.5rem",
                textAlign: "center",
              }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "18px",
                  background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--g2a-amber)", margin: "0 auto 1.5rem",
                }}>
                  <Play size={32} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.375rem", color: "var(--g2a-text-primary)", marginBottom: "0.75rem" }}>
                  {lang === "hu" ? "30 perces ingyenes konzultáció" : "30-minute free consultation"}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", marginBottom: "1.5rem" }}>
                  {lang === "hu" ? "Kötelezettség nélkül, azonnal foglalhatsz időpontot." : "No obligation, book an appointment immediately."}
                </p>
                <Link href="/audit" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 2rem", borderRadius: "10px",
                  background: "var(--g2a-amber)", color: "#000",
                  fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9375rem",
                  textDecoration: "none", transition: "all 0.2s",
                  boxShadow: "0 4px 20px var(--g2a-amber-glow)",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--g2a-amber)"; }}>
                  {t.auditCta} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg)" }}>
        <div style={{ ...containerStyle, maxWidth: "760px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={labelStyle}>{t.faqLabel}</div>
              <h2 style={h2Style}>{t.faqTitle}</h2>
            </div>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {t.faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  ...cardStyle,
                  padding: "0",
                  overflow: "hidden",
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", padding: "1.25rem 1.5rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "none", border: "none", cursor: "pointer",
                      textAlign: "left",
                    }}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "var(--g2a-text-primary)" }}>{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={18} color="var(--g2a-amber)" /> : <ChevronDown size={18} color="var(--g2a-text-muted)" />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid var(--g2a-border)" }}>
                      <p style={{ paddingTop: "1rem", fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "var(--g2a-bg-2)" }}>
        <div style={{ ...containerStyle, maxWidth: "600px", textAlign: "center" }}>
          <FadeIn>
            <h2 style={h2Style}>{t.newsletterTitle}</h2>
            <p style={{ color: "var(--g2a-text-secondary)", fontFamily: "'Inter', sans-serif", marginBottom: "2rem" }}>{t.newsletterSubtitle}</p>
            {newsletterStatus === "success" ? (
              <div style={{ padding: "1.25rem", background: "var(--g2a-amber-light)", border: "1px solid var(--g2a-amber-border)", borderRadius: "12px", color: "var(--g2a-amber)", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                {lang === "hu" ? "Sikeresen feliratkoztál!" : "Successfully subscribed!"}
              </div>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t.newsletterPlaceholder} required
                  style={{
                    flex: 1, minWidth: "200px", padding: "0.875rem 1.25rem",
                    borderRadius: "10px", border: "1px solid var(--g2a-border)",
                    background: "var(--g2a-bg-card)", color: "var(--g2a-text-primary)",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
                    outline: "none",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--g2a-amber)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}
                />
                <button type="submit" disabled={newsletterMutation.isPending} style={{
                  padding: "0.875rem 1.5rem", borderRadius: "10px",
                  background: "var(--g2a-amber)", color: "#000",
                  fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9375rem",
                  border: "none", cursor: "pointer", transition: "background 0.2s",
                  opacity: newsletterMutation.isPending ? 0.7 : 1,
                }}>
                  {newsletterMutation.isPending ? "..." : t.newsletterCta}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{
        padding: "5rem 0",
        background: "var(--g2a-amber)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div style={{ ...containerStyle, textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800, color: "#000",
              marginBottom: "1rem", letterSpacing: "-0.02em",
            }}>
              {t.ctaTitle}
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "rgba(0,0,0,0.7)", fontFamily: "'Inter', sans-serif", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
              {t.ctaSubtitle}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/audit" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 1.75rem", borderRadius: "10px",
                background: "#000", color: "var(--g2a-text-primary)",
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9375rem",
                textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}>
                {t.ctaCta1} <ArrowRight size={16} />
              </Link>
              <Link href="/kapcsolat" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 1.75rem", borderRadius: "10px",
                background: "transparent", color: "#000",
                border: "2px solid rgba(0,0,0,0.3)",
                fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9375rem",
                textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#000"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.3)"}>
                {t.ctaCta2}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .audit-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </>
  );
}
