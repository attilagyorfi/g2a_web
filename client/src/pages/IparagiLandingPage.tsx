import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import IndustryHeroDemo, { hasIndustryHeroDemo } from "@/components/industry-demos/IndustryHeroDemo";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Stethoscope, ShoppingBag, Wrench, Car, Scale, Code, Lightbulb, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

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

// ─── Industry meta (language-invariant) ─────────────────────────────────────
type IndustryMeta = { icon: React.ReactNode; color: string };
const INDUSTRY_META: Record<string, IndustryMeta> = {
  "marketing-egeszsegugyi-cegeknek": { icon: <Stethoscope size={32} />, color: "#10b981" },
  "marketing-szepsegipari-cegeknek": { icon: <ShoppingBag size={32} />, color: "#ec4899" },
  "marketing-mernoki-irodaknak": { icon: <Wrench size={32} />, color: "#f59e0b" },
  "marketing-autoipari-cegeknek": { icon: <Car size={32} />, color: "#3b82f6" },
  "marketing-ugyvedii-irodaknak": { icon: <Scale size={32} />, color: "#6366f1" },
  "marketing-technologiai-cegeknek": { icon: <Code size={32} />, color: "#8b5cf6" },
  "marketing-onkormanyzati-projekteknek": { icon: <Lightbulb size={32} />, color: "#14b8a6" },
  "marketing-b2b-cegeknek": { icon: <Building2 size={32} />, color: "var(--g2a-brand-teal)" },
};

// ─── Industry content (localized) ───────────────────────────────────────────
type IndustryContent = {
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  heroDesc: string;
  challenges: string[];
  solutions: { title: string; desc: string }[];
  results: { num: string; label: string }[];
  caseStudy: { client: string; problem: string; solution: string; result: string };
};

const INDUSTRY_CONTENT: Record<Language, Record<string, IndustryContent>> = {
  hu: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "Marketing egészségügyi cégeknek",
      subtitle: "Klinikák, magánorvosok és egészségügyi vállalkozások számára",
      metaTitle: "Marketing Egészségügyi Cégeknek – G2A Marketing | SEO, Google Ads, Webfejlesztés",
      metaDesc: "Speciális marketing megoldások klinikáknak, magánorvosoknak és egészségügyi vállalkozásoknak. SEO, Google Ads, webfejlesztés és online foglalási rendszer.",
      heroDesc: "Az egészségügyi szektor speciális marketing kihívásokat jelent. GDPR-kompatibilis kampányok, bizalomépítés és online foglalási rendszerek – mindezt értjük.",
      challenges: [
        "GDPR-kompatibilis hirdetési kampányok kezelése",
        "Bizalomépítés és presztízs kommunikáció",
        "Online foglalások növelése",
        "Lokális SEO – körzetes betegek elérése",
        "Verseny a nagyobb kórházakkal és klinikákkal",
      ],
      solutions: [
        { title: "Egészségügyi SEO", desc: "Lokális kulcsszavak, Google My Business optimalizálás, orvosi tartalmak" },
        { title: "Google Ads kampányok", desc: "GDPR-kompatibilis, célzott kampányok a megfelelő betegcsoportoknak" },
        { title: "Weboldal fejlesztés", desc: "Online foglalási rendszer, GDPR-kompatibilis, mobilbarát" },
        { title: "Reputáció menedzsment", desc: "Google értékelések kezelése, bizalomépítő tartalmak" },
      ],
      results: [
        { num: "+340%", label: "Organikus forgalom" },
        { num: "+180%", label: "Online foglalás" },
        { num: "40+", label: "Egészségügyi projekt" },
      ],
      caseStudy: {
        client: "Magánklinika – Pécs",
        problem: "Alacsony online foglalások, gyenge SEO jelenlét",
        solution: "Teljes SEO + Google Ads + weboldal optimalizálás",
        result: "+340% organikus forgalom, +180% online foglalás 6 hónap alatt",
      },
    },
    "marketing-szepsegipari-cegeknek": {
      title: "Marketing szépségipari cégeknek",
      subtitle: "Szépségszalonok, kozmetikusok és wellness vállalkozások számára",
      metaTitle: "Marketing Szépségipari Cégeknek – G2A Marketing | Social Media, Instagram, Meta Ads",
      metaDesc: "Speciális marketing megoldások szépségszalonoknak, kozmetikusoknak. Instagram, Meta Ads, online foglalási rendszer és social media stratégia.",
      heroDesc: "A szépségiparban a vizuális megjelenés és a közösségi média a legfontosabb csatorna. Instagram-stratégiától Meta Ads-ig – mindezt értjük.",
      challenges: [
        "Vizuálisan vonzó tartalom gyártása",
        "Instagram és TikTok jelenlét kiépítése",
        "Online foglalási rendszer integrálása",
        "Szezonális kampányok kezelése",
        "Helyi versenytársakkal szembeni differenciálás",
      ],
      solutions: [
        { title: "Social Media Stratégia", desc: "Instagram, TikTok és Facebook jelenlét, tartalom stratégia" },
        { title: "Meta Ads kampányok", desc: "Célzott hirdetések a megfelelő demográfiai csoportoknak" },
        { title: "Online foglalás", desc: "Weboldal fejlesztés beépített foglalási rendszerrel" },
        { title: "Influencer Marketing", desc: "Helyi influencer együttműködések szervezése" },
      ],
      results: [
        { num: "+520%", label: "Instagram követő" },
        { num: "+190%", label: "Online foglalás" },
        { num: "25+", label: "Szépségipari projekt" },
      ],
      caseStudy: {
        client: "Szépségszalon lánc",
        problem: "Alacsony közösségi média jelenlét, nincs online foglalás",
        solution: "Social media stratégia + Meta Ads + online foglalás",
        result: "+520% Instagram követő, +190% online foglalás 4 hónap alatt",
      },
    },
    "marketing-mernoki-irodaknak": {
      title: "Marketing mérnöki irodáknak",
      subtitle: "Tervező irodák, mérnöki vállalkozások és műszaki cégek számára",
      metaTitle: "Marketing Mérnöki Irodáknak – G2A Marketing | B2B Lead Generálás, SEO, LinkedIn",
      metaDesc: "Speciális B2B marketing mérnöki irodáknak és tervező vállalkozásoknak. SEO, LinkedIn, webfejlesztés és lead generálás.",
      heroDesc: "A mérnöki szektorban a szakmai hitelesség és a B2B kapcsolatok a legfontosabbak. LinkedIn-stratégiától technikai SEO-ig – mindezt értjük.",
      challenges: [
        "Szakmai hitelesség online kommunikálása",
        "B2B lead generálás és ügyfélszerzés",
        "Technikai tartalmak érthetővé tétele",
        "LinkedIn jelenlét kiépítése",
        "Referencia projektek bemutatása",
      ],
      solutions: [
        { title: "B2B SEO", desc: "Technikai kulcsszavak, szakmai tartalmak, Google pozíciók" },
        { title: "LinkedIn Marketing", desc: "Vállalati oldal, thought leadership, B2B hirdetések" },
        { title: "Weboldal fejlesztés", desc: "Prémium megjelenés, referencia portfólió, ajánlatkérő" },
        { title: "Tartalommarketing", desc: "Szakmai cikkek, esettanulmányok, fehér könyvek" },
      ],
      results: [
        { num: "+300%", label: "Weboldal forgalom" },
        { num: "+15", label: "Új ügyfél/hónap" },
        { num: "30+", label: "Mérnöki projekt" },
      ],
      caseStudy: {
        client: "Tervező iroda",
        problem: "Nincs online jelenlét, minden ügyfél referencia alapján",
        solution: "Weboldal + SEO + LinkedIn jelenlét",
        result: "+15 új ügyfél/hónap, Top 3 Google pozíció 8 hónap alatt",
      },
    },
    "marketing-autoipari-cegeknek": {
      title: "Marketing autóipari cégeknek",
      subtitle: "Autókereskedők, szervizek és autóipari vállalkozások számára",
      metaTitle: "Marketing Autóipari Cégeknek – G2A Marketing | Google Ads, Meta Ads, SEO",
      metaDesc: "Speciális marketing autókereskedőknek és autóipari vállalkozásoknak. Google Ads, Meta Ads, SEO és lead generálás.",
      heroDesc: "Az autóiparban a lead generálás és a konverzió optimalizálás a kulcs. Google Ads-től Meta Ads-ig – mindezt értjük.",
      challenges: [
        "Magas hirdetési költség, alacsony ROAS",
        "Szezonális kereslet kezelése",
        "Lokális és regionális vásárlók elérése",
        "Versenytársak árelőnyének kompenzálása",
        "Online és offline értékesítés összekapcsolása",
      ],
      solutions: [
        { title: "Google Ads PPC", desc: "Kampányrestruktúra, bid management, Quality Score optimalizálás" },
        { title: "Meta Ads", desc: "Facebook és Instagram hirdetések, remarketing, lookalike audience" },
        { title: "Lokális SEO", desc: "Google My Business, lokális kulcsszavak, térkép megjelenés" },
        { title: "Landing Page", desc: "Konverzió optimalizált oldalak, A/B tesztelés" },
      ],
      results: [
        { num: "-45%", label: "CPA csökkentés" },
        { num: "+220%", label: "Lead generálás" },
        { num: "20+", label: "Autóipari projekt" },
      ],
      caseStudy: {
        client: "Autókereskedő hálózat",
        problem: "Magas hirdetési költség, alacsony konverzió",
        solution: "PPC audit + kampányrestruktúra + landing page",
        result: "-45% CPA, +220% lead generálás 3 hónap alatt",
      },
    },
    "marketing-ugyvedii-irodaknak": {
      title: "Marketing ügyvédi irodáknak",
      subtitle: "Ügyvédi irodák és jogi vállalkozások számára",
      metaTitle: "Marketing Ügyvédi Irodáknak – G2A Marketing | SEO, Google Ads, Brand Design",
      metaDesc: "Speciális marketing ügyvédi irodáknak. SEO, Google Ads, prémium brand design és tartalommarketing.",
      heroDesc: "Az ügyvédi szektorban a presztízs, a bizalom és a szakmai hitelesség a legfontosabb. Prémium brand design-tól SEO-ig – mindezt értjük.",
      challenges: [
        "Presztízs és bizalom kommunikálása online",
        "Jogi tartalmak érthetővé tétele",
        "Google Ads korlátozások kezelése jogi területen",
        "Versenytársak erős SEO jelenlétével való verseny",
        "Ügyféladatok biztonságos kezelése",
      ],
      solutions: [
        { title: "Prémium Brand Design", desc: "Presztízst sugárzó vizuális identitás, weboldal redesign" },
        { title: "Jogi SEO", desc: "Szakterületi kulcsszavak, lokális SEO, Google My Business" },
        { title: "Tartalommarketing", desc: "Jogi cikkek, GYIK, esettanulmányok – érthetően" },
        { title: "Google Ads", desc: "Jogi területre optimalizált kampányok, GDPR-kompatibilis" },
      ],
      results: [
        { num: "+250%", label: "Organikus forgalom" },
        { num: "+120%", label: "Ügyfélfelvétel" },
        { num: "15+", label: "Jogi projekt" },
      ],
      caseStudy: {
        client: "Ügyvédi iroda – Budapest",
        problem: "Nem megfelelő online megjelenés, alacsony presztízs érzet",
        solution: "Brand redesign + SEO + Google Ads",
        result: "+250% organikus forgalom, Top 1 Google pozíció 5 hónap alatt",
      },
    },
    "marketing-technologiai-cegeknek": {
      title: "Marketing technológiai cégeknek",
      subtitle: "SaaS vállalatok, tech startupok és IT cégek számára",
      metaTitle: "Marketing Technológiai Cégeknek – G2A Marketing | B2B SaaS, LinkedIn, SEO",
      metaDesc: "Speciális B2B marketing technológiai cégeknek és SaaS vállalatoknak. LinkedIn Ads, SEO, tartalommarketing és nemzetközi terjeszkedés.",
      heroDesc: "A tech szektorban a gyors növekedés és a nemzetközi terjeszkedés a cél. LinkedIn-stratégiától multilingual SEO-ig – mindezt értjük.",
      challenges: [
        "Komplex termékek érthetővé tétele",
        "Hosszú értékesítési ciklus kezelése",
        "Nemzetközi piacra lépés",
        "B2B lead generálás és demo foglalások",
        "Versenytársak erős marketing jelenlétével való verseny",
      ],
      solutions: [
        { title: "B2B LinkedIn Marketing", desc: "Thought leadership, LinkedIn Ads, decision maker targeting" },
        { title: "Multilingual SEO", desc: "Több nyelven, több piacon – egységes SEO stratégia" },
        { title: "Tartalommarketing", desc: "White paper, case study, blog – B2B buyer journey" },
        { title: "Marketing Automatizáció", desc: "Lead nurturing, email workflow, CRM integráció" },
      ],
      results: [
        { num: "+5", label: "Új piac" },
        { num: "+280%", label: "Demo foglalás" },
        { num: "35+", label: "Tech projekt" },
      ],
      caseStudy: {
        client: "SaaS vállalat",
        problem: "Nemzetközi piacra lépés, brand awareness hiánya",
        solution: "Brand stratégia + multilingual SEO + LinkedIn",
        result: "+5 új piac, +280% demo foglalás 12 hónap alatt",
      },
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "Marketing önkormányzati projekteknek",
      subtitle: "Önkormányzatok, közintézmények és közösségi projektek számára",
      metaTitle: "Marketing Önkormányzati Projekteknek – G2A Marketing | Közösségi Kommunikáció",
      metaDesc: "Speciális marketing önkormányzatoknak és közintézményeknek. Közösségi kommunikáció, webfejlesztés, social media és tájékoztatási kampányok.",
      heroDesc: "Az önkormányzati kommunikációban az átláthatóság, a közösségi bevonás és az elérhetőség a kulcs. Webfejlesztéstől social media-ig – mindezt értjük.",
      challenges: [
        "Közösségi bevonás és részvétel növelése",
        "Átlátható kommunikáció biztosítása",
        "Különböző korosztályok elérése",
        "Korlátozott büdzsé hatékony felhasználása",
        "GDPR-kompatibilis adatkezelés",
      ],
      solutions: [
        { title: "Közösségi Weboldal", desc: "Akadálymentesített, mobilbarát, GDPR-kompatibilis" },
        { title: "Social Media", desc: "Facebook, Instagram – közösségi bevonás és tájékoztatás" },
        { title: "Tájékoztató Kampányok", desc: "Célzott kampányok specifikus közösségi ügyekhez" },
        { title: "Email Kommunikáció", desc: "Hírlevél rendszer, esemény értesítések" },
      ],
      results: [
        { num: "+400%", label: "Közösségi elérés" },
        { num: "+250%", label: "Weboldal látogatók" },
        { num: "10+", label: "Önkormányzati projekt" },
      ],
      caseStudy: {
        client: "Dél-dunántúli önkormányzat",
        problem: "Alacsony közösségi bevonás, elavult kommunikáció",
        solution: "Weboldal redesign + social media + kampányok",
        result: "+400% közösségi elérés, +250% weboldal látogatók",
      },
    },
    "marketing-b2b-cegeknek": {
      title: "Marketing B2B cégeknek",
      subtitle: "Vállalati ügyfeleket kiszolgáló cégek és B2B vállalkozások számára",
      metaTitle: "Marketing B2B Cégeknek – G2A Marketing | Lead Generálás, LinkedIn, SEO",
      metaDesc: "Speciális B2B marketing megoldások vállalati ügyfeleket kiszolgáló cégeknek. Lead generálás, LinkedIn Ads, SEO és marketing automatizáció.",
      heroDesc: "A B2B marketingben a hosszú értékesítési ciklus, a döntéshozók elérése és a mérhető ROI a legfontosabb. LinkedIn-től marketing automatizációig – mindezt értjük.",
      challenges: [
        "Döntéshozók elérése és megszólítása",
        "Hosszú értékesítési ciklus kezelése",
        "Mérhető ROI és lead minőség",
        "Account-based marketing (ABM)",
        "Sales és marketing összehangolása",
      ],
      solutions: [
        { title: "LinkedIn Marketing", desc: "Thought leadership, LinkedIn Ads, decision maker targeting" },
        { title: "Marketing Automatizáció", desc: "Lead nurturing, email workflow, CRM integráció" },
        { title: "B2B SEO & Tartalom", desc: "Iparági kulcsszavak, white paper, case study" },
        { title: "Account-Based Marketing", desc: "Célzott kampányok specifikus vállalatoknak" },
      ],
      results: [
        { num: "+180%", label: "Qualified lead" },
        { num: "-40%", label: "Sales ciklus" },
        { num: "50+", label: "B2B projekt" },
      ],
      caseStudy: {
        client: "B2B szoftver vállalat",
        problem: "Alacsony lead minőség, hosszú értékesítési ciklus",
        solution: "LinkedIn + marketing automatizáció + ABM",
        result: "+180% qualified lead, -40% sales ciklus 6 hónap alatt",
      },
    },
  },
  en: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "Marketing for Healthcare Companies",
      subtitle: "For clinics, private practitioners and healthcare businesses",
      metaTitle: "Healthcare Marketing – G2A Marketing | SEO, Google Ads, Web Development",
      metaDesc: "Specialised marketing solutions for clinics, private practitioners and healthcare businesses. SEO, Google Ads, web development and online booking systems.",
      heroDesc: "The healthcare sector brings specific marketing challenges. GDPR-compliant campaigns, trust building and online booking systems — we understand all of it.",
      challenges: [
        "GDPR-compliant advertising campaigns",
        "Building trust and prestige",
        "Growing online bookings",
        "Local SEO – reaching patients in your catchment area",
        "Competing with larger hospitals and clinics",
      ],
      solutions: [
        { title: "Healthcare SEO", desc: "Local keywords, Google Business Profile optimisation, medical content" },
        { title: "Google Ads campaigns", desc: "GDPR-compliant targeted campaigns for the right patient segments" },
        { title: "Website development", desc: "Online booking system, GDPR-compliant, mobile-friendly" },
        { title: "Reputation management", desc: "Google review handling and trust-building content" },
      ],
      results: [
        { num: "+340%", label: "Organic traffic" },
        { num: "+180%", label: "Online bookings" },
        { num: "40+", label: "Healthcare projects" },
      ],
      caseStudy: {
        client: "Private clinic – Pécs",
        problem: "Low online bookings, weak SEO presence",
        solution: "Full SEO + Google Ads + website optimisation",
        result: "+340% organic traffic, +180% online bookings in 6 months",
      },
    },
    "marketing-szepsegipari-cegeknek": {
      title: "Marketing for the Beauty Industry",
      subtitle: "For beauty salons, cosmetologists and wellness businesses",
      metaTitle: "Beauty Industry Marketing – G2A Marketing | Social Media, Instagram, Meta Ads",
      metaDesc: "Specialised marketing solutions for beauty salons and cosmetologists. Instagram, Meta Ads, online booking systems and social media strategy.",
      heroDesc: "In the beauty industry, visual presence and social media are the key channels. From Instagram strategy to Meta Ads — we understand it all.",
      challenges: [
        "Producing visually compelling content",
        "Building an Instagram and TikTok presence",
        "Integrating online booking systems",
        "Running seasonal campaigns",
        "Differentiating from local competitors",
      ],
      solutions: [
        { title: "Social Media Strategy", desc: "Instagram, TikTok and Facebook presence, content strategy" },
        { title: "Meta Ads campaigns", desc: "Targeted ads for the right demographic segments" },
        { title: "Online booking", desc: "Website development with built-in booking system" },
        { title: "Influencer Marketing", desc: "Organising local influencer partnerships" },
      ],
      results: [
        { num: "+520%", label: "Instagram followers" },
        { num: "+190%", label: "Online bookings" },
        { num: "25+", label: "Beauty industry projects" },
      ],
      caseStudy: {
        client: "Beauty salon chain",
        problem: "Low social media presence, no online booking",
        solution: "Social media strategy + Meta Ads + online booking",
        result: "+520% Instagram followers, +190% online bookings in 4 months",
      },
    },
    "marketing-mernoki-irodaknak": {
      title: "Marketing for Engineering Firms",
      subtitle: "For design studios, engineering firms and technical companies",
      metaTitle: "Engineering Firm Marketing – G2A Marketing | B2B Lead Generation, SEO, LinkedIn",
      metaDesc: "Specialised B2B marketing for engineering firms and design studios. SEO, LinkedIn, web development and lead generation.",
      heroDesc: "In engineering, professional credibility and B2B relationships are paramount. From LinkedIn strategy to technical SEO — we understand it all.",
      challenges: [
        "Communicating professional credibility online",
        "B2B lead generation and client acquisition",
        "Making technical content digestible",
        "Building a LinkedIn presence",
        "Showcasing reference projects",
      ],
      solutions: [
        { title: "B2B SEO", desc: "Technical keywords, expert content, Google rankings" },
        { title: "LinkedIn Marketing", desc: "Company page, thought leadership, B2B ads" },
        { title: "Website development", desc: "Premium look, reference portfolio, quote request" },
        { title: "Content Marketing", desc: "Industry articles, case studies, white papers" },
      ],
      results: [
        { num: "+300%", label: "Website traffic" },
        { num: "+15", label: "New clients / month" },
        { num: "30+", label: "Engineering projects" },
      ],
      caseStudy: {
        client: "Design studio",
        problem: "No online presence, every client via referral",
        solution: "Website + SEO + LinkedIn presence",
        result: "+15 new clients/month, Top 3 Google ranking in 8 months",
      },
    },
    "marketing-autoipari-cegeknek": {
      title: "Marketing for the Automotive Industry",
      subtitle: "For car dealerships, service centres and automotive businesses",
      metaTitle: "Automotive Marketing – G2A Marketing | Google Ads, Meta Ads, SEO",
      metaDesc: "Specialised marketing for car dealerships and automotive businesses. Google Ads, Meta Ads, SEO and lead generation.",
      heroDesc: "In the automotive industry, lead generation and conversion optimisation are the key. From Google Ads to Meta Ads — we understand it all.",
      challenges: [
        "High ad spend, low ROAS",
        "Managing seasonal demand",
        "Reaching local and regional buyers",
        "Countering competitors' price advantage",
        "Connecting online and offline sales",
      ],
      solutions: [
        { title: "Google Ads PPC", desc: "Campaign restructure, bid management, Quality Score optimisation" },
        { title: "Meta Ads", desc: "Facebook and Instagram ads, remarketing, lookalike audiences" },
        { title: "Local SEO", desc: "Google Business Profile, local keywords, map presence" },
        { title: "Landing Page", desc: "Conversion-optimised pages, A/B testing" },
      ],
      results: [
        { num: "-45%", label: "CPA reduction" },
        { num: "+220%", label: "Lead generation" },
        { num: "20+", label: "Automotive projects" },
      ],
      caseStudy: {
        client: "Car dealership network",
        problem: "High ad spend, low conversion",
        solution: "PPC audit + campaign restructure + landing pages",
        result: "-45% CPA, +220% lead generation in 3 months",
      },
    },
    "marketing-ugyvedii-irodaknak": {
      title: "Marketing for Law Firms",
      subtitle: "For law firms and legal practices",
      metaTitle: "Law Firm Marketing – G2A Marketing | SEO, Google Ads, Brand Design",
      metaDesc: "Specialised marketing for law firms. SEO, Google Ads, premium brand design and content marketing.",
      heroDesc: "In the legal sector, prestige, trust and professional credibility matter most. From premium brand design to SEO — we understand it all.",
      challenges: [
        "Communicating prestige and trust online",
        "Making legal content accessible",
        "Navigating Google Ads restrictions for legal",
        "Competing with rivals' strong SEO presence",
        "Handling client data securely",
      ],
      solutions: [
        { title: "Premium Brand Design", desc: "Prestigious visual identity, website redesign" },
        { title: "Legal SEO", desc: "Practice-area keywords, local SEO, Google Business Profile" },
        { title: "Content Marketing", desc: "Legal articles, FAQs, case studies — accessible" },
        { title: "Google Ads", desc: "Legal-optimised campaigns, GDPR-compliant" },
      ],
      results: [
        { num: "+250%", label: "Organic traffic" },
        { num: "+120%", label: "New client intake" },
        { num: "15+", label: "Legal projects" },
      ],
      caseStudy: {
        client: "Law firm – Budapest",
        problem: "Inadequate online presence, low prestige perception",
        solution: "Brand redesign + SEO + Google Ads",
        result: "+250% organic traffic, Top 1 Google ranking in 5 months",
      },
    },
    "marketing-technologiai-cegeknek": {
      title: "Marketing for Technology Companies",
      subtitle: "For SaaS companies, tech startups and IT firms",
      metaTitle: "Tech Marketing – G2A Marketing | B2B SaaS, LinkedIn, SEO",
      metaDesc: "Specialised B2B marketing for technology companies and SaaS businesses. LinkedIn Ads, SEO, content marketing and international expansion.",
      heroDesc: "In tech, fast growth and international expansion are the goal. From LinkedIn strategy to multilingual SEO — we understand it all.",
      challenges: [
        "Making complex products accessible",
        "Managing a long sales cycle",
        "Entering international markets",
        "B2B lead generation and demo bookings",
        "Competing with strong marketing presences",
      ],
      solutions: [
        { title: "B2B LinkedIn Marketing", desc: "Thought leadership, LinkedIn Ads, decision maker targeting" },
        { title: "Multilingual SEO", desc: "Multiple languages, multiple markets, unified SEO strategy" },
        { title: "Content Marketing", desc: "White papers, case studies, blog — B2B buyer journey" },
        { title: "Marketing Automation", desc: "Lead nurturing, email workflows, CRM integration" },
      ],
      results: [
        { num: "+5", label: "New markets" },
        { num: "+280%", label: "Demo bookings" },
        { num: "35+", label: "Tech projects" },
      ],
      caseStudy: {
        client: "SaaS company",
        problem: "International market entry, lack of brand awareness",
        solution: "Brand strategy + multilingual SEO + LinkedIn",
        result: "+5 new markets, +280% demo bookings in 12 months",
      },
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "Marketing for Municipal Projects",
      subtitle: "For municipalities, public institutions and community projects",
      metaTitle: "Municipal Marketing – G2A Marketing | Community Communication",
      metaDesc: "Specialised marketing for municipalities and public institutions. Community communication, web development, social media and information campaigns.",
      heroDesc: "In municipal communication, transparency, community engagement and accessibility are key. From web development to social media — we understand it all.",
      challenges: [
        "Growing community engagement and participation",
        "Ensuring transparent communication",
        "Reaching different age groups",
        "Using a limited budget effectively",
        "GDPR-compliant data handling",
      ],
      solutions: [
        { title: "Community Website", desc: "Accessible, mobile-friendly, GDPR-compliant" },
        { title: "Social Media", desc: "Facebook, Instagram — community engagement and information" },
        { title: "Awareness Campaigns", desc: "Targeted campaigns for specific community issues" },
        { title: "Email Communication", desc: "Newsletter system, event notifications" },
      ],
      results: [
        { num: "+400%", label: "Community reach" },
        { num: "+250%", label: "Website visitors" },
        { num: "10+", label: "Municipal projects" },
      ],
      caseStudy: {
        client: "Southern Transdanubian municipality",
        problem: "Low community engagement, outdated communication",
        solution: "Website redesign + social media + campaigns",
        result: "+400% community reach, +250% website visitors",
      },
    },
    "marketing-b2b-cegeknek": {
      title: "Marketing for B2B Companies",
      subtitle: "For companies serving enterprise clients and B2B businesses",
      metaTitle: "B2B Marketing – G2A Marketing | Lead Generation, LinkedIn, SEO",
      metaDesc: "Specialised B2B marketing solutions for companies serving enterprise clients. Lead generation, LinkedIn Ads, SEO and marketing automation.",
      heroDesc: "In B2B marketing, long sales cycles, reaching decision makers and measurable ROI are what matter. From LinkedIn to marketing automation — we understand it all.",
      challenges: [
        "Reaching and engaging decision makers",
        "Managing a long sales cycle",
        "Measurable ROI and lead quality",
        "Account-based marketing (ABM)",
        "Aligning sales and marketing",
      ],
      solutions: [
        { title: "LinkedIn Marketing", desc: "Thought leadership, LinkedIn Ads, decision maker targeting" },
        { title: "Marketing Automation", desc: "Lead nurturing, email workflows, CRM integration" },
        { title: "B2B SEO & Content", desc: "Industry keywords, white papers, case studies" },
        { title: "Account-Based Marketing", desc: "Targeted campaigns for specific companies" },
      ],
      results: [
        { num: "+180%", label: "Qualified leads" },
        { num: "-40%", label: "Sales cycle" },
        { num: "50+", label: "B2B projects" },
      ],
      caseStudy: {
        client: "B2B software company",
        problem: "Low lead quality, long sales cycle",
        solution: "LinkedIn + marketing automation + ABM",
        result: "+180% qualified leads, -40% sales cycle in 6 months",
      },
    },
  },
  zh: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "医疗健康行业营销",
      subtitle: "为诊所、私人医生与医疗健康企业提供",
      metaTitle: "医疗健康行业营销 – G2A Marketing | SEO、Google Ads、网站开发",
      metaDesc: "为诊所、私人医生与医疗健康企业提供专业营销方案。SEO、Google Ads、网站开发与在线预约系统。",
      heroDesc: "医疗健康行业有其独特的营销挑战。GDPR 合规的营销活动、信任建立与在线预约系统 —— 我们深谙其道。",
      challenges: [
        "GDPR 合规的广告活动",
        "建立信任与品牌声誉",
        "提升在线预约量",
        "本地 SEO —— 覆盖区域内的患者",
        "与大型医院与诊所竞争",
      ],
      solutions: [
        { title: "医疗健康 SEO", desc: "本地关键词、Google 商家资料优化、医疗内容" },
        { title: "Google Ads 营销活动", desc: "GDPR 合规、精准定位目标患者群体" },
        { title: "网站开发", desc: "在线预约系统、GDPR 合规、移动端友好" },
        { title: "声誉管理", desc: "Google 评价管理与信任建设内容" },
      ],
      results: [
        { num: "+340%", label: "自然流量" },
        { num: "+180%", label: "在线预约" },
        { num: "40+", label: "医疗项目" },
      ],
      caseStudy: {
        client: "私立诊所 – 佩奇",
        problem: "在线预约量低、SEO 表现弱",
        solution: "完整 SEO + Google Ads + 网站优化",
        result: "6 个月内自然流量 +340%、在线预约 +180%",
      },
    },
    "marketing-szepsegipari-cegeknek": {
      title: "美容行业营销",
      subtitle: "为美容沙龙、美容师与 wellness 企业提供",
      metaTitle: "美容行业营销 – G2A Marketing | 社交媒体、Instagram、Meta 广告",
      metaDesc: "为美容沙龙与美容师提供专业营销方案。Instagram、Meta 广告、在线预约系统与社交媒体战略。",
      heroDesc: "在美容行业,视觉表现与社交媒体是最关键的渠道。从 Instagram 战略到 Meta 广告 —— 我们深谙其道。",
      challenges: [
        "制作具有视觉吸引力的内容",
        "建立 Instagram 与 TikTok 影响力",
        "整合在线预约系统",
        "运营季节性营销活动",
        "与本地竞争对手差异化",
      ],
      solutions: [
        { title: "社交媒体战略", desc: "Instagram、TikTok 与 Facebook 运营、内容战略" },
        { title: "Meta 广告活动", desc: "针对合适人群的精准广告" },
        { title: "在线预约", desc: "带集成预约系统的网站开发" },
        { title: "网红营销", desc: "组织本地网红合作" },
      ],
      results: [
        { num: "+520%", label: "Instagram 粉丝" },
        { num: "+190%", label: "在线预约" },
        { num: "25+", label: "美容行业项目" },
      ],
      caseStudy: {
        client: "美容沙龙连锁",
        problem: "社交媒体影响力弱、无在线预约",
        solution: "社交媒体战略 + Meta 广告 + 在线预约",
        result: "4 个月内 Instagram 粉丝 +520%、在线预约 +190%",
      },
    },
    "marketing-mernoki-irodaknak": {
      title: "工程咨询公司营销",
      subtitle: "为设计事务所、工程公司与技术企业提供",
      metaTitle: "工程公司营销 – G2A Marketing | B2B 线索生成、SEO、LinkedIn",
      metaDesc: "为工程公司与设计事务所提供专业 B2B 营销。SEO、LinkedIn、网站开发与线索生成。",
      heroDesc: "工程行业中,专业公信力与 B2B 关系至关重要。从 LinkedIn 战略到技术性 SEO —— 我们深谙其道。",
      challenges: [
        "在网上传递专业公信力",
        "B2B 线索生成与获客",
        "让技术内容易于理解",
        "建立 LinkedIn 影响力",
        "展示参考项目",
      ],
      solutions: [
        { title: "B2B SEO", desc: "技术关键词、专业内容、Google 排名" },
        { title: "LinkedIn 营销", desc: "企业主页、思想领导力、B2B 广告" },
        { title: "网站开发", desc: "高端呈现、参考项目、询价系统" },
        { title: "内容营销", desc: "行业文章、客户案例、白皮书" },
      ],
      results: [
        { num: "+300%", label: "网站流量" },
        { num: "+15", label: "每月新客户" },
        { num: "30+", label: "工程项目" },
      ],
      caseStudy: {
        client: "设计事务所",
        problem: "无线上表现,客户全部来自转介绍",
        solution: "网站 + SEO + LinkedIn 布局",
        result: "每月新客户 +15、8 个月内 Google 前三",
      },
    },
    "marketing-autoipari-cegeknek": {
      title: "汽车行业营销",
      subtitle: "为汽车经销商、维修中心与汽车行业企业提供",
      metaTitle: "汽车行业营销 – G2A Marketing | Google Ads、Meta 广告、SEO",
      metaDesc: "为汽车经销商与汽车行业企业提供专业营销。Google Ads、Meta 广告、SEO 与线索生成。",
      heroDesc: "汽车行业中,线索生成与转化优化是关键。从 Google Ads 到 Meta 广告 —— 我们深谙其道。",
      challenges: [
        "广告成本高、ROAS 低",
        "应对季节性需求波动",
        "触达本地与区域买家",
        "应对竞争对手的价格优势",
        "打通线上与线下销售",
      ],
      solutions: [
        { title: "Google Ads PPC", desc: "广告活动重构、出价管理、质量分优化" },
        { title: "Meta 广告", desc: "Facebook 与 Instagram 广告、再营销、相似受众" },
        { title: "本地 SEO", desc: "Google 商家资料、本地关键词、地图曝光" },
        { title: "落地页", desc: "转化优化页面、A/B 测试" },
      ],
      results: [
        { num: "-45%", label: "CPA 下降" },
        { num: "+220%", label: "线索生成" },
        { num: "20+", label: "汽车行业项目" },
      ],
      caseStudy: {
        client: "汽车经销商网络",
        problem: "广告成本高、转化率低",
        solution: "PPC 审核 + 广告重构 + 落地页",
        result: "3 个月内 CPA -45%、线索生成 +220%",
      },
    },
    "marketing-ugyvedii-irodaknak": {
      title: "律师事务所营销",
      subtitle: "为律师事务所与法律服务机构提供",
      metaTitle: "律师事务所营销 – G2A Marketing | SEO、Google Ads、品牌设计",
      metaDesc: "为律师事务所提供专业营销。SEO、Google Ads、高端品牌设计与内容营销。",
      heroDesc: "法律行业中,声望、信任与专业公信力最为重要。从高端品牌设计到 SEO —— 我们深谙其道。",
      challenges: [
        "在网上传递声望与信任",
        "让法律内容易于理解",
        "应对法律领域的 Google Ads 限制",
        "与竞争对手强大的 SEO 布局抗衡",
        "客户数据的安全处理",
      ],
      solutions: [
        { title: "高端品牌设计", desc: "彰显声望的视觉识别、网站重塑" },
        { title: "法律 SEO", desc: "专业领域关键词、本地 SEO、Google 商家资料" },
        { title: "内容营销", desc: "法律文章、常见问题、客户案例 —— 易于理解" },
        { title: "Google Ads", desc: "针对法律行业优化的营销活动、GDPR 合规" },
      ],
      results: [
        { num: "+250%", label: "自然流量" },
        { num: "+120%", label: "新客户接待" },
        { num: "15+", label: "法律项目" },
      ],
      caseStudy: {
        client: "律师事务所 – 布达佩斯",
        problem: "线上表现不足、品牌声望感低",
        solution: "品牌重塑 + SEO + Google Ads",
        result: "5 个月内自然流量 +250%、Google 第一位",
      },
    },
    "marketing-technologiai-cegeknek": {
      title: "科技公司营销",
      subtitle: "为 SaaS 公司、科技创业公司与 IT 企业提供",
      metaTitle: "科技公司营销 – G2A Marketing | B2B SaaS、LinkedIn、SEO",
      metaDesc: "为科技公司与 SaaS 企业提供专业 B2B 营销。LinkedIn 广告、SEO、内容营销与国际化拓展。",
      heroDesc: "科技行业追求的是快速增长与国际化扩展。从 LinkedIn 战略到多语种 SEO —— 我们深谙其道。",
      challenges: [
        "让复杂产品易于理解",
        "应对较长的销售周期",
        "进入国际市场",
        "B2B 线索生成与演示预约",
        "与营销实力强劲的对手竞争",
      ],
      solutions: [
        { title: "B2B LinkedIn 营销", desc: "思想领导力、LinkedIn 广告、决策者精准触达" },
        { title: "多语种 SEO", desc: "多语言、多市场 —— 统一的 SEO 战略" },
        { title: "内容营销", desc: "白皮书、客户案例、博客 —— 覆盖 B2B 决策旅程" },
        { title: "营销自动化", desc: "线索培育、邮件工作流、CRM 集成" },
      ],
      results: [
        { num: "+5", label: "新开拓市场" },
        { num: "+280%", label: "演示预约" },
        { num: "35+", label: "科技项目" },
      ],
      caseStudy: {
        client: "SaaS 公司",
        problem: "国际市场进入、品牌知名度不足",
        solution: "品牌战略 + 多语种 SEO + LinkedIn",
        result: "12 个月内新开拓 5 个市场、演示预约 +280%",
      },
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "政府机构与公共项目营销",
      subtitle: "为地方政府、公共机构与社区项目提供",
      metaTitle: "政府机构营销 – G2A Marketing | 社区沟通",
      metaDesc: "为地方政府与公共机构提供专业营销。社区沟通、网站开发、社交媒体与信息宣传活动。",
      heroDesc: "在政府机构沟通中,透明度、社区参与与可达性是关键。从网站开发到社交媒体 —— 我们深谙其道。",
      challenges: [
        "提升社区参与度与互动",
        "确保透明的沟通",
        "触达不同年龄段的人群",
        "有限预算的高效使用",
        "GDPR 合规的数据处理",
      ],
      solutions: [
        { title: "社区网站", desc: "无障碍、移动端友好、GDPR 合规" },
        { title: "社交媒体", desc: "Facebook、Instagram —— 社区参与与信息发布" },
        { title: "宣传活动", desc: "针对具体社区议题的定向营销活动" },
        { title: "邮件沟通", desc: "简报系统、活动通知" },
      ],
      results: [
        { num: "+400%", label: "社区触达" },
        { num: "+250%", label: "网站访客" },
        { num: "10+", label: "政府项目" },
      ],
      caseStudy: {
        client: "南多瑙河地区地方政府",
        problem: "社区参与度低、沟通方式过时",
        solution: "网站重塑 + 社交媒体 + 营销活动",
        result: "社区触达 +400%、网站访客 +250%",
      },
    },
    "marketing-b2b-cegeknek": {
      title: "B2B 企业营销",
      subtitle: "为服务企业客户的公司与 B2B 企业提供",
      metaTitle: "B2B 营销 – G2A Marketing | 线索生成、LinkedIn、SEO",
      metaDesc: "为服务企业客户的公司提供专业 B2B 营销方案。线索生成、LinkedIn 广告、SEO 与营销自动化。",
      heroDesc: "B2B 营销中,较长的销售周期、触达决策者与可衡量 ROI 是重中之重。从 LinkedIn 到营销自动化 —— 我们深谙其道。",
      challenges: [
        "触达与打动决策者",
        "应对较长的销售周期",
        "可衡量的 ROI 与线索质量",
        "基于账户的营销(ABM)",
        "销售与营销的协同",
      ],
      solutions: [
        { title: "LinkedIn 营销", desc: "思想领导力、LinkedIn 广告、决策者精准触达" },
        { title: "营销自动化", desc: "线索培育、邮件工作流、CRM 集成" },
        { title: "B2B SEO 与内容", desc: "行业关键词、白皮书、客户案例" },
        { title: "基于账户的营销", desc: "针对特定企业的定向营销活动" },
      ],
      results: [
        { num: "+180%", label: "合格线索" },
        { num: "-40%", label: "销售周期" },
        { num: "50+", label: "B2B 项目" },
      ],
      caseStudy: {
        client: "B2B 软件公司",
        problem: "线索质量低、销售周期长",
        solution: "LinkedIn + 营销自动化 + ABM",
        result: "6 个月内合格线索 +180%、销售周期 -40%",
      },
    },
  },
};

export default function IparagiLandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [, params] = useRoute("/iparagi/:slug");
  const slug = params?.slug || "";
  const meta = INDUSTRY_META[slug];
  const { t, lang } = useLanguage();
  const content = INDUSTRY_CONTENT[lang]?.[slug];

  if (!meta || !content) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ color: "var(--g2a-text-primary)", fontFamily: "Geist, sans-serif" }}>{t("iparagi.notFound")}</h1>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="g2a-btn-primary">{t("iparagi.backHome")}</span>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead title={content.metaTitle} description={content.metaDesc} />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          background: `radial-gradient(ellipse at 60% 40%, ${meta.color}15 0%, transparent 55%), var(--g2a-bg)`,
          paddingTop: "6rem",
          position: "relative", overflow: "hidden",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div
              className="g2a-service-hero-grid"
              style={{
                display: "grid",
                gridTemplateColumns: hasIndustryHeroDemo(slug) ? "minmax(0, 1fr) minmax(0, 460px)" : "1fr",
                gap: "3rem",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ color: meta.color, backgroundColor: `${meta.color}15`, padding: "0.75rem", borderRadius: "12px", border: `1px solid ${meta.color}30` }}>
                    {meta.icon}
                  </div>
                </div>
                <div className="g2a-section-label animate-fadeIn">{t("iparagi.label")}</div>
                <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "640px" }}>
                  {content.title}
                </h1>
                <p className="animate-fadeInUp" style={{ animationDelay: "0.25s", fontSize: "1rem", color: meta.color, fontFamily: "Geist Mono, monospace", marginBottom: "1rem" }}>
                  {content.subtitle}
                </p>
                <p className="animate-fadeInUp" style={{ animationDelay: "0.35s", fontSize: "1.1rem", color: "var(--g2a-text-secondary)", maxWidth: "580px", lineHeight: "1.7", fontFamily: "Geist, sans-serif", marginBottom: "2.5rem" }}>
                  {content.heroDesc}
                </p>
                <div className="animate-fadeInUp" style={{ animationDelay: "0.5s", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-primary">{t("nav.freeAudit")} <ArrowRight size={16} /></span>
                  </Link>
                  <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                    <span className="g2a-btn-secondary">{t("common.contactUs")}</span>
                  </Link>
                </div>
              </div>
              {hasIndustryHeroDemo(slug) && (
                <div className="g2a-service-hero-demo">
                  <IndustryHeroDemo slug={slug} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "2.5rem 0", backgroundColor: "var(--g2a-bg-2)", borderTop: "1px solid var(--g2a-border)", borderBottom: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
              {content.results.map((r, i) => (
                <div key={i} className="reveal" style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "2.5rem", color: meta.color }}>{r.num}</div>
                  <div className="g2a-stat-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenges + Solutions */}
        <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div className="g2a-section-label reveal">{t("iparagi.challengesLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">{t("iparagi.challengesTitle")}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
                  {content.challenges.map((c, i) => (
                    <div key={i} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle size={16} style={{ color: meta.color, flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "Geist, sans-serif" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="g2a-section-label reveal">{t("iparagi.solutionsLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">{t("iparagi.solutionsTitle")}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                  {content.solutions.map((s, i) => (
                    <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{s.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--g2a-text-secondary)" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container">
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div className="g2a-section-label reveal">{t("iparagi.caseStudyLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>{t("iparagi.caseStudyTitle")}</h2>
              </div>
              <div className="g2a-card reveal" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: meta.color }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{t("iparagi.caseClient")}</div>
                    <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)" }}>{content.caseStudy.client}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{t("iparagi.caseProblem")}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)" }}>{content.caseStudy.problem}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{t("iparagi.caseSolution")}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)" }}>{content.caseStudy.solution}</div>
                  </div>
                </div>
                <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", borderRadius: "10px", backgroundColor: `${meta.color}10`, border: `1px solid ${meta.color}25` }}>
                  <div style={{ fontSize: "0.75rem", color: meta.color, fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>{t("iparagi.caseResult")}</div>
                  <div style={{ fontFamily: "Geist, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: meta.color }}>{content.caseStudy.result}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1rem" }}>{t("iparagi.finalCtaTitle")}</h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              {t("iparagi.finalCtaDesc")}
            </p>
            <div className="reveal reveal-delay-2" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  {t("nav.freeAudit")} <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  {t("common.contactUs")}
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
