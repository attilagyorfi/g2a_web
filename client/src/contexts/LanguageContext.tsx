import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "hu" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "hu",
  setLang: () => {},
  t: (key) => key,
});

// ─── Translations ────────────────────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  hu: {
    // Navigation
    "nav.services": "Szolgáltatások",
    "nav.expertise": "Szakértelem",
    "nav.technology": "Technológia",
    "nav.partners": "Partnereink",
    "nav.blog": "Blog",
    "nav.about": "Rólunk",
    "nav.references": "Referenciák",
    "nav.contact": "Kapcsolat",
    "nav.freeAudit": "Ingyenes Audit",
    "nav.industries": "Iparágak",

    // Services
    "service.localization": "Lokalizáció",
    "service.branding": "Arculattervezés",
    "service.ads": "Hirdetéskezelés",
    "service.social": "Közösségi Média",
    "service.strategy": "Stratégiai Marketing",
    "service.seo": "Keresőoptimalizálás",
    "service.webdev": "Webfejlesztés",
    "service.aiMarketing": "AI Marketing",
    "service.ppc": "PPC / Google Ads",
    "service.meta": "Meta Hirdetések",
    "service.content": "Tartalommarketing",
    "service.automation": "Marketing Automatizáció",
    "service.esg": "ESG Kommunikáció",
    "service.employerBranding": "Employer Branding",
    "service.international": "Nemzetközi Marketing",

    // Industries
    "industry.healthcare": "Egészségügy",
    "industry.beauty": "Szépségipar",
    "industry.engineering": "Mérnöki irodák",
    "industry.automotive": "Autóipar",
    "industry.legal": "Ügyvédi irodák",
    "industry.technology": "Technológia",
    "industry.government": "Önkormányzat",
    "industry.b2b": "B2B vállalatok",
    "industry.hairdresser": "Fodrászat",
    "industry.fitness": "Fitness & Sport",
    "industry.realestate": "Ingatlan",
    "industry.education": "Oktatás",
    "industry.hospitality": "Vendéglátás",
    "industry.logistics": "Logisztika",
    "industry.finance": "Pénzügy",
    "industry.fashion": "Divat",

    // Hero
    "hero.badge": "Adatvezérelt Marketing Ügynökség",
    "hero.title1": "Növeljük vállalkozásod",
    "hero.title2": "digitális jelenlétét",
    "hero.subtitle": "Stratégiai marketing megoldások, amelyek valódi eredményeket hoznak. SEO, hirdetések, közösségi média és webfejlesztés – egy helyen.",
    "hero.cta1": "Ingyenes konzultáció",
    "hero.cta2": "Referenciáink",

    // Common
    "common.readMore": "Tovább olvasom",
    "common.contactUs": "Kapcsolatfelvétel",
    "common.freeAudit": "Ingyenes Audit kérése",
    "common.learnMore": "Tudj meg többet",
    "common.allServices": "Összes szolgáltatás",
    "common.back": "Vissza",
    "common.send": "Küldés",
    "common.name": "Név",
    "common.email": "E-mail",
    "common.phone": "Telefon",
    "common.message": "Üzenet",
    "common.company": "Cég neve",
    "common.website": "Weboldal",
    "common.loading": "Betöltés...",
    "common.success": "Sikeresen elküldve!",
    "common.error": "Hiba történt. Kérjük próbálja újra.",
    "common.required": "Kötelező mező",
    "common.viewAll": "Összes megtekintése",
    "common.getStarted": "Kezdjük el",
    "common.ourWork": "Munkáink",
    "common.freeConsultation": "Ingyenes konzultáció",

    // Footer
    "footer.rights": "Minden jog fenntartva.",
    "footer.privacy": "Adatvédelmi irányelvek",
    "footer.services": "Szolgáltatások",
    "footer.company": "Cég",
    "footer.contact": "Kapcsolat",
    "footer.workingHours": "Munkaidő",
    "footer.workingHoursValue": "H–P: 08:00–17:00",

    // Contact
    "contact.title": "Lépjünk kapcsolatba",
    "contact.subtitle": "Készen állunk segíteni. Töltsd ki az alábbi űrlapot és hamarosan felvesszük veled a kapcsolatot.",
    "contact.formTitle": "Írj nekünk",
    "contact.subject": "Tárgy",
    "contact.send": "Üzenet küldése",
    "contact.address": "Cím",
    "contact.addressValue": "7621 Pécs, Rákóczi út 30.",
    "contact.emailLabel": "E-mail",
    "contact.phoneLabel": "Telefon",
    "contact.officeHours": "Irodai munkaidő",
    "contact.officeHoursValue": "Hétfő–Péntek: 08:00–17:00",
    "contact.successTitle": "Üzenet elküldve!",
    "contact.successText": "Hamarosan felvesszük veled a kapcsolatot.",

    // Blog
    "blog.title": "Marketing Hírek & Tippek",
    "blog.subtitle": "Naprakész tartalmak a digitális marketing világából.",
    "blog.readMore": "Tovább olvasom",
    "blog.allCategories": "Összes kategória",
    "blog.latestPosts": "Legújabb cikkek",
    "blog.minRead": "perc olvasás",
    "blog.relatedPosts": "Kapcsolódó cikkek",
    "blog.tableOfContents": "Tartalomjegyzék",
    "blog.share": "Megosztás",
    "blog.backToBlog": "Vissza a bloghoz",
    "blog.noPosts": "Még nincsenek cikkek ebben a kategóriában.",
    "blog.searchPlaceholder": "Keresés a cikkek között...",

    // About
    "about.title": "Rólunk",
    "about.subtitle": "Adatvezérelt marketing ügynökség, amely valódi eredményeket hoz.",
    "about.mission": "Küldetésünk",
    "about.missionText": "Segítünk a vállalkozásoknak digitális jelenlétük maximalizálásában, mérhető eredmények és adatvezérelt stratégiák segítségével.",
    "about.team": "Csapatunk",
    "about.values": "Értékeink",
    "about.story": "Történetünk",
    "about.founded": "Alapítva",
    "about.clients": "Elégedett ügyfél",
    "about.projects": "Sikeres projekt",
    "about.years": "év tapasztalat",

    // References
    "references.title": "Referenciák & Esettanulmányok",
    "references.subtitle": "Valós eredmények, valós ügyfelektől.",
    "references.challenge": "Kihívás",
    "references.solution": "Megoldás",
    "references.results": "Eredmények",
    "references.all": "Összes",
    "references.viewCase": "Esettanulmány megtekintése",
    "references.industry": "Iparág",
    "references.duration": "Időtartam",
    "references.services": "Alkalmazott szolgáltatások",

    // Audit
    "audit.title": "Ingyenes Marketing Audit",
    "audit.subtitle": "Derítsd ki, mi tartja vissza vállalkozásod növekedését.",
    "audit.cta": "Audit kérése",
    "audit.currentChallenges": "Jelenlegi kihívások",
    "audit.currentBudget": "Jelenlegi marketing büdzsé",
    "audit.website": "Weboldal URL",
    "audit.step1": "Iparág",
    "audit.step2": "Büdzsé",
    "audit.step3": "Célok",
    "audit.step4": "Kapcsolat",
    "audit.next": "Következő",
    "audit.back": "Vissza",
    "audit.submit": "Audit kérése",
    "audit.successTitle": "Köszönjük!",
    "audit.successText": "Hamarosan felvesszük veled a kapcsolatot az ingyenes audit eredményeivel.",

    // Partners
    "partners.title": "Partnereink",
    "partners.subtitle": "Büszkék vagyunk ügyfeleinkre, akik megbíznak bennünk.",
    "partners.allIndustries": "Összes iparág",
    "partners.viewWebsite": "Weboldal megtekintése",
    "partners.results": "Eredmények",
    "partners.joinUs": "Csatlakozz partnereinkhez",
    "partners.joinUsText": "Készen állsz a növekedésre?",

    // Expertise
    "expertise.title": "Szakértelmünk",
    "expertise.subtitle": "Mélyreható tudás a digitális marketing minden területén.",
    "expertise.certifications": "Tanúsítványaink",
    "expertise.tools": "Eszközeink",
    "expertise.methodology": "Módszertanunk",

    // Technology
    "technology.title": "Technológiánk",
    "technology.subtitle": "A legmodernebb eszközök a legjobb eredményekért.",
    "technology.stack": "Tech Stack",
    "technology.integrations": "Integrációk",
    "technology.analytics": "Analitika",

    // Cookie
    "cookie.text": "Weboldalunk sütiket használ a jobb felhasználói élmény érdekében.",
    "cookie.accept": "Elfogadom",
    "cookie.decline": "Elutasítom",
    "cookie.learnMore": "Tudj meg többet",

    // SEO Audit Tool
    "seoAudit.title": "Ingyenes SEO Audit Eszköz",
    "seoAudit.subtitle": "Elemezd weboldalad SEO teljesítményét másodpercek alatt.",
    "seoAudit.placeholder": "https://pelda.hu",
    "seoAudit.analyze": "Elemzés indítása",
    "seoAudit.analyzing": "Elemzés folyamatban...",
    "seoAudit.score": "SEO Pontszám",
    "seoAudit.technical": "Technikai SEO",
    "seoAudit.onPage": "On-Page SEO",
    "seoAudit.performance": "Teljesítmény",
    "seoAudit.mobile": "Mobilbarátság",
    "seoAudit.issues": "Talált problémák",
    "seoAudit.recommendations": "Javaslatok",
    "seoAudit.getFullAudit": "Teljes audit kérése",
  },

  en: {
    // Navigation
    "nav.services": "Services",
    "nav.expertise": "Expertise",
    "nav.technology": "Technology",
    "nav.partners": "Partners",
    "nav.blog": "Blog",
    "nav.about": "About Us",
    "nav.references": "References",
    "nav.contact": "Contact",
    "nav.freeAudit": "Free Audit",
    "nav.industries": "Industries",

    // Services
    "service.localization": "Localization",
    "service.branding": "Brand Design",
    "service.ads": "Ad Management",
    "service.social": "Social Media",
    "service.strategy": "Strategic Marketing",
    "service.seo": "SEO",
    "service.webdev": "Web Development",
    "service.aiMarketing": "AI Marketing",
    "service.ppc": "PPC / Google Ads",
    "service.meta": "Meta Ads",
    "service.content": "Content Marketing",
    "service.automation": "Marketing Automation",
    "service.esg": "ESG Communication",
    "service.employerBranding": "Employer Branding",
    "service.international": "International Marketing",

    // Industries
    "industry.healthcare": "Healthcare",
    "industry.beauty": "Beauty Industry",
    "industry.engineering": "Engineering Firms",
    "industry.automotive": "Automotive",
    "industry.legal": "Law Firms",
    "industry.technology": "Technology",
    "industry.government": "Government",
    "industry.b2b": "B2B Companies",
    "industry.hairdresser": "Hairdressing",
    "industry.fitness": "Fitness & Sports",
    "industry.realestate": "Real Estate",
    "industry.education": "Education",
    "industry.hospitality": "Hospitality",
    "industry.logistics": "Logistics",
    "industry.finance": "Finance",
    "industry.fashion": "Fashion",

    // Hero
    "hero.badge": "Data-Driven Marketing Agency",
    "hero.title1": "We grow your business'",
    "hero.title2": "digital presence",
    "hero.subtitle": "Strategic marketing solutions that deliver real results. SEO, advertising, social media and web development – all in one place.",
    "hero.cta1": "Free Consultation",
    "hero.cta2": "Our References",

    // Common
    "common.readMore": "Read More",
    "common.contactUs": "Contact Us",
    "common.freeAudit": "Request Free Audit",
    "common.learnMore": "Learn More",
    "common.allServices": "All Services",
    "common.back": "Back",
    "common.send": "Send",
    "common.name": "Name",
    "common.email": "Email",
    "common.phone": "Phone",
    "common.message": "Message",
    "common.company": "Company Name",
    "common.website": "Website",
    "common.loading": "Loading...",
    "common.success": "Successfully sent!",
    "common.error": "An error occurred. Please try again.",
    "common.required": "Required field",
    "common.viewAll": "View All",
    "common.getStarted": "Get Started",
    "common.ourWork": "Our Work",
    "common.freeConsultation": "Free Consultation",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.workingHours": "Working Hours",
    "footer.workingHoursValue": "Mon–Fri: 08:00–17:00",

    // Contact
    "contact.title": "Get in Touch",
    "contact.subtitle": "We're ready to help. Fill out the form below and we'll get back to you shortly.",
    "contact.formTitle": "Send Us a Message",
    "contact.subject": "Subject",
    "contact.send": "Send Message",
    "contact.address": "Address",
    "contact.addressValue": "30 Rákóczi Street, Pécs 7621, Hungary",
    "contact.emailLabel": "Email",
    "contact.phoneLabel": "Phone",
    "contact.officeHours": "Office Hours",
    "contact.officeHoursValue": "Monday–Friday: 08:00–17:00",
    "contact.successTitle": "Message Sent!",
    "contact.successText": "We'll get back to you shortly.",

    // Blog
    "blog.title": "Marketing News & Tips",
    "blog.subtitle": "Up-to-date content from the world of digital marketing.",
    "blog.readMore": "Read More",
    "blog.allCategories": "All Categories",
    "blog.latestPosts": "Latest Posts",
    "blog.minRead": "min read",
    "blog.relatedPosts": "Related Articles",
    "blog.tableOfContents": "Table of Contents",
    "blog.share": "Share",
    "blog.backToBlog": "Back to Blog",
    "blog.noPosts": "No articles in this category yet.",
    "blog.searchPlaceholder": "Search articles...",

    // About
    "about.title": "About Us",
    "about.subtitle": "A data-driven marketing agency that delivers real results.",
    "about.mission": "Our Mission",
    "about.missionText": "We help businesses maximize their digital presence through measurable results and data-driven strategies.",
    "about.team": "Our Team",
    "about.values": "Our Values",
    "about.story": "Our Story",
    "about.founded": "Founded",
    "about.clients": "Happy Clients",
    "about.projects": "Successful Projects",
    "about.years": "Years of Experience",

    // References
    "references.title": "References & Case Studies",
    "references.subtitle": "Real results from real clients.",
    "references.challenge": "Challenge",
    "references.solution": "Solution",
    "references.results": "Results",
    "references.all": "All",
    "references.viewCase": "View Case Study",
    "references.industry": "Industry",
    "references.duration": "Duration",
    "references.services": "Services Applied",

    // Audit
    "audit.title": "Free Marketing Audit",
    "audit.subtitle": "Find out what's holding back your business growth.",
    "audit.cta": "Request Audit",
    "audit.currentChallenges": "Current Challenges",
    "audit.currentBudget": "Current Marketing Budget",
    "audit.website": "Website URL",
    "audit.step1": "Industry",
    "audit.step2": "Budget",
    "audit.step3": "Goals",
    "audit.step4": "Contact",
    "audit.next": "Next",
    "audit.back": "Back",
    "audit.submit": "Request Audit",
    "audit.successTitle": "Thank You!",
    "audit.successText": "We'll contact you shortly with your free audit results.",

    // Partners
    "partners.title": "Our Partners",
    "partners.subtitle": "We're proud of our clients who trust us.",
    "partners.allIndustries": "All Industries",
    "partners.viewWebsite": "View Website",
    "partners.results": "Results",
    "partners.joinUs": "Join Our Partners",
    "partners.joinUsText": "Ready to grow?",

    // Expertise
    "expertise.title": "Our Expertise",
    "expertise.subtitle": "Deep knowledge across all areas of digital marketing.",
    "expertise.certifications": "Certifications",
    "expertise.tools": "Our Tools",
    "expertise.methodology": "Our Methodology",

    // Technology
    "technology.title": "Our Technology",
    "technology.subtitle": "The most modern tools for the best results.",
    "technology.stack": "Tech Stack",
    "technology.integrations": "Integrations",
    "technology.analytics": "Analytics",

    // Cookie
    "cookie.text": "Our website uses cookies to enhance your browsing experience.",
    "cookie.accept": "Accept",
    "cookie.decline": "Decline",
    "cookie.learnMore": "Learn More",

    // SEO Audit Tool
    "seoAudit.title": "Free SEO Audit Tool",
    "seoAudit.subtitle": "Analyze your website's SEO performance in seconds.",
    "seoAudit.placeholder": "https://example.com",
    "seoAudit.analyze": "Start Analysis",
    "seoAudit.analyzing": "Analyzing...",
    "seoAudit.score": "SEO Score",
    "seoAudit.technical": "Technical SEO",
    "seoAudit.onPage": "On-Page SEO",
    "seoAudit.performance": "Performance",
    "seoAudit.mobile": "Mobile Friendliness",
    "seoAudit.issues": "Issues Found",
    "seoAudit.recommendations": "Recommendations",
    "seoAudit.getFullAudit": "Request Full Audit",
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    // 1. Check URL param ?lang=en or ?lang=hu
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang");
      if (urlLang === "hu" || urlLang === "en") return urlLang;
    } catch {}
    // 2. Check localStorage
    try {
      const stored = localStorage.getItem("g2a-lang");
      if (stored === "hu" || stored === "en") return stored;
    } catch {}
    // 3. Auto-detect from browser
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("hu") ? "hu" : "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try { localStorage.setItem("g2a-lang", newLang); } catch {}
    // Update URL param without page reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", newLang);
      window.history.replaceState({}, "", url.toString());
    } catch {}
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    // Sync URL param on mount
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("lang")) {
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang][key] ?? translations["hu"][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
