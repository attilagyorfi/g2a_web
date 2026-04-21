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

    // Blog
    "blog.title": "Marketing Hírek & Tippek",
    "blog.subtitle": "Naprakész tartalmak a digitális marketing világából.",
    "blog.readMore": "Tovább olvasom",
    "blog.allCategories": "Összes kategória",
    "blog.latestPosts": "Legújabb cikkek",

    // About
    "about.title": "Rólunk",
    "about.subtitle": "Adatvezérelt marketing ügynökség, amely valódi eredményeket hoz.",

    // References
    "references.title": "Referenciák & Esettanulmányok",
    "references.subtitle": "Valós eredmények, valós ügyfelektől.",
    "references.challenge": "Kihívás",
    "references.solution": "Megoldás",
    "references.results": "Eredmények",
    "references.all": "Összes",

    // Audit
    "audit.title": "Ingyenes Marketing Audit",
    "audit.subtitle": "Derítsd ki, mi tartja vissza vállalkozásod növekedését.",
    "audit.cta": "Audit kérése",
    "audit.currentChallenges": "Jelenlegi kihívások",
    "audit.currentBudget": "Jelenlegi marketing büdzsé",
    "audit.website": "Weboldal URL",

    // Cookie
    "cookie.text": "Weboldalunk sütiket használ a jobb felhasználói élmény érdekében.",
    "cookie.accept": "Elfogadom",
    "cookie.decline": "Elutasítom",
    "cookie.learnMore": "Tudj meg többet",
    // Expertise page
    "expertise.sectionLabel": "Szakterületek",
    "expertise.title": "Iparágak, ahol otthon vagyunk",
    "expertise.desc": "Tapasztalatunk számos szektorra kiterjed. Pontosan értjük az adott piac kihívásait és lehetőségeit.",
    // Partners page
    "partners.sectionLabel": "Referenciák",
    "partners.title": "Partnereink és referenciáink",
    "partners.desc": "Büszkék vagyunk arra, hogy számos sikeres vállalkozás bízta ránk digitális marketing feladatait.",
    "partners.visitWebsite": "Weboldal megtekintése",
    // Technology page
    "technology.sectionLabel": "Eszközök",
    "technology.title": "Technológiák, amelyeket használunk",
    "technology.desc": "A legmodernebb marketing és AI eszközöket alkalmazzuk, hogy ügyfeleink mindig a legjobb eredményeket kapják.",
    // Services page
    "services.sectionLabel": "Amit kínálunk",
    "services.title": "Teljes körű digitális marketing megoldások",
    "services.desc": "Minden, amire vállalkozásodnak szüksége van a digitális sikerhez – egy helyen.",
    // About page extra
    "about.sectionLabel": "Rólunk",
    "about.tagline": "Stratégiai partnerek a növekedésedben",
    "about.desc": "2022 óta segítünk B2B cégeknek mérhető marketing eredményeket elérni.",
    "about.founded": "Alapítva",
    "about.team": "Csapatunk",
    "about.values": "Értékeink",
    "about.milestones": "Mérföldkövek",
    // References page extra
    "references.sectionLabel": "Esettanulmányok",
    "references.viewDetails": "Részletek megtekintése",
    "references.filterAll": "Összes iparág",
    "references.readMore": "Teljes esettanulmány",
    "references.back": "Vissza a referenciákhoz",
    // Blog page extra
    "blog.sectionLabel": "Blog",
    "blog.allPosts": "Összes",
    "blog.noResults": "Nem találhatók cikkek ebben a kategóriában.",
    "blog.read": "Olvasás",
    // Audit page extra
    "audit.sectionLabel": "Ingyenes ajánlat",
    "audit.submit": "Audit kérése – Teljesen Ingyenes",
    "audit.submitting": "Küldés folyamatban...",
    // SEO Audit page
    "seoAudit.title": "Ingyenes SEO Audit",
    "seoAudit.subtitle": "Derítsd ki, mi akadályozza Google rangsorolásodat",
    "seoAudit.placeholder": "https://cegedneve.hu",
    "seoAudit.cta": "Ingyenes SEO Audit kérése",
    // Popup
    "popup.title": "Mielőtt elmész...",
    "popup.desc": "Kérd az ingyenes marketing auditot és derítsd ki, hogyan növelheted bevételeidet 30%-kal!",
    "popup.cta": "Igen, kérem az ingyenes auditot!",
    "popup.decline": "Nem, köszönöm",
    // Sticky CTA
    "stickyCta.text": "Ingyenes Audit",
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

    // Blog
    "blog.title": "Marketing News & Tips",
    "blog.subtitle": "Up-to-date content from the world of digital marketing.",
    "blog.readMore": "Read More",
    "blog.allCategories": "All Categories",
    "blog.latestPosts": "Latest Posts",

    // About
    "about.title": "About Us",
    "about.subtitle": "A data-driven marketing agency that delivers real results.",

    // References
    "references.title": "References & Case Studies",
    "references.subtitle": "Real results from real clients.",
    "references.challenge": "Challenge",
    "references.solution": "Solution",
    "references.results": "Results",
    "references.all": "All",

    // Audit
    "audit.title": "Free Marketing Audit",
    "audit.subtitle": "Find out what's holding back your business growth.",
    "audit.cta": "Request Audit",
    "audit.currentChallenges": "Current Challenges",
    "audit.currentBudget": "Current Marketing Budget",
    "audit.website": "Website URL",

    // Cookie
    "cookie.text": "Our website uses cookies to enhance your browsing experience.",
    "cookie.accept": "Accept",
    "cookie.decline": "Decline",
    "cookie.learnMore": "Learn More",
    // Expertise page
    "expertise.sectionLabel": "Specialties",
    "expertise.title": "Industries we know inside out",
    "expertise.desc": "Our experience spans many sectors. We understand the specific challenges and opportunities of each market.",
    // Partners page
    "partners.sectionLabel": "References",
    "partners.title": "Our Partners & References",
    "partners.desc": "We are proud that many successful businesses have entrusted us with their digital marketing.",
    "partners.visitWebsite": "Visit Website",
    // Technology page
    "technology.sectionLabel": "Tools",
    "technology.title": "Technologies we use",
    "technology.desc": "We use the most advanced marketing and AI tools to ensure our clients always get the best results.",
    // Services page
    "services.sectionLabel": "What we offer",
    "services.title": "Full-service digital marketing solutions",
    "services.desc": "Everything your business needs for digital success – all in one place.",
    // About page extra
    "about.sectionLabel": "About Us",
    "about.tagline": "Strategic partners in your growth",
    "about.desc": "Since 2022, we have been helping B2B companies achieve measurable marketing results.",
    "about.founded": "Founded",
    "about.team": "Our Team",
    "about.values": "Our Values",
    "about.milestones": "Milestones",
    // References page extra
    "references.sectionLabel": "Case Studies",
    "references.viewDetails": "View Details",
    "references.filterAll": "All Industries",
    "references.readMore": "Full Case Study",
    "references.back": "Back to References",
    // Blog page extra
    "blog.sectionLabel": "Blog",
    "blog.allPosts": "All",
    "blog.noResults": "No articles found in this category.",
    "blog.read": "Read",
    // Audit page extra
    "audit.sectionLabel": "Free offer",
    "audit.submit": "Request Audit – Completely Free",
    "audit.submitting": "Sending...",
    // SEO Audit page
    "seoAudit.title": "Free SEO Audit",
    "seoAudit.subtitle": "Find out what's blocking your Google rankings",
    "seoAudit.placeholder": "https://yourcompany.com",
    "seoAudit.cta": "Request Free SEO Audit",
    // Popup
    "popup.title": "Before you leave...",
    "popup.desc": "Request your free marketing audit and find out how to grow your revenue by 30%!",
    "popup.cta": "Yes, I want the free audit!",
    "popup.decline": "No, thanks",
    // Sticky CTA
    "stickyCta.text": "Free Audit",
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
