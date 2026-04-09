import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Stethoscope, ShoppingBag, Wrench, Car, Scale, Code, Lightbulb, Building2 } from "lucide-react";

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

type IndustryData = {
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  icon: React.ReactNode;
  color: string;
  heroDesc: string;
  challenges: string[];
  solutions: { title: string; desc: string }[];
  results: { num: string; label: string }[];
  caseStudy: { client: string; problem: string; solution: string; result: string };
};

const INDUSTRY_DATA: Record<string, IndustryData> = {
  "marketing-egeszsegugyi-cegeknek": {
    title: "Marketing egészségügyi cégeknek",
    subtitle: "Klinikák, magánorvosok és egészségügyi vállalkozások számára",
    metaTitle: "Marketing Egészségügyi Cégeknek – G2A Marketing | SEO, Google Ads, Webfejlesztés",
    metaDesc: "Speciális marketing megoldások klinikáknak, magánorvosoknak és egészségügyi vállalkozásoknak. SEO, Google Ads, webfejlesztés és online foglalási rendszer.",
    icon: <Stethoscope size={32} />,
    color: "#10b981",
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
    icon: <ShoppingBag size={32} />,
    color: "#ec4899",
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
    icon: <Wrench size={32} />,
    color: "#f59e0b",
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
    icon: <Car size={32} />,
    color: "#3b82f6",
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
    icon: <Scale size={32} />,
    color: "#6366f1",
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
    icon: <Code size={32} />,
    color: "#8b5cf6",
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
    icon: <Lightbulb size={32} />,
    color: "#14b8a6",
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
    icon: <Building2 size={32} />,
    color: "var(--g2a-amber)",
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
  "marketing-fodraszatoknak": {
    title: "Marketing fodrászatoknak és szépségszalonoknak",
    subtitle: "Fodrászatok, körömszalonok és szépségszalonok számára",
    metaTitle: "Marketing Fodrászatoknak – G2A Marketing | Helyi SEO, Instagram, Google Ads",
    metaDesc: "Fodrászatok és szépségszalonok marketing megoldásai: helyi SEO, Instagram marketing, online foglalás, Google Ads kampanyok.",
    icon: <span style={{fontSize:'1.75rem'}}>✂️</span>,
    color: "#f472b6",
    heroDesc: "A szépségipar a vizualitásról szól. Segítünk, hogy az Instagram-feed, a Google-profil és az online foglalási rendszer egyetlen erős márkává álljon össze.",
    challenges: ["Helyi verseny – több szalon ugyanazon a területen","Visszatérő vendégek megőrzése","Online foglalás növelése","Instagram és TikTok jelenlét építése","Szezonális kampanyok kezelése"],
    solutions: [
      { title: "Helyi SEO & Google My Business", desc: "Körzetes keresések, értékelések kezelése, térkép-optimalizalás" },
      { title: "Instagram & TikTok marketing", desc: "Before/after tartalmak, Reels, influencer egyuttműködés" },
      { title: "Online foglalási rendszer", desc: "Automatikus emlékeztetők, visszajelzés kérés, hűségprogramok" },
      { title: "Google Ads", desc: "Helyi hirdetések, akció-kampanyok, üj vendég akvizíció" },
    ],
    results: [{num:"+220%",label:"Online foglalás"},{num:"+180%",label:"Instagram követők"},{num:"+95%",label:"Visszatérő vendégek"}],
    caseStudy: { client: "Budapest belvárosi fodrászat", problem: "Alacsony online jelenlét, kevés új vendég", solution: "Instagram marketing + Google My Business + online foglalás", result: "+220% online foglalás 4 hónap alatt" },
  },
  "marketing-fitnesz-studionak": {
    title: "Marketing fitnesz studióknak és edzőtermeknek",
    subtitle: "Edzőtermek, jóga studiók, crossfit box-ok számára",
    metaTitle: "Marketing Fitnesz Studióknak – G2A Marketing | Tagság növelés, Facebook Ads",
    metaDesc: "Fitnesz studiók és edzőtermek marketing megoldásai: tagság növelés, Facebook Ads, email marketing, hűségprogramok.",
    icon: <span style={{fontSize:'1.75rem'}}>🏋️</span>,
    color: "#f59e0b",
    heroDesc: "A fitneszipar az eredményekről szól. Segítünk új tagokat szerezni, a meglévőket megőrizni és a márkádat az edzőtermen túl is építeni.",
    challenges: ["Magas tagság lemorzsólódás","Új tagok szerzése versenyés piacon","Szezonális ingadozás","Online vs. offline verseny","Közösség építése"],
    solutions: [
      { title: "Facebook & Instagram Ads", desc: "Tagság akciók, trial ajánlatok, retargeting kampanyok" },
      { title: "Email marketing automatizáció", desc: "Onboarding sorozat, reaktiválás, hűségprogramok" },
      { title: "Közösségi média menedzsment", desc: "Eredmény-sztori, edző bemutató, challenge kampanyok" },
      { title: "Weboldal & SEO", desc: "Helyi SEO, online órarend, online bérlet vásárlás" },
    ],
    results: [{num:"+310%",label:"Új tagok"},{num:"-45%",label:"Lemorzsólódás"},{num:"3.2x",label:"ROI"}],
    caseStudy: { client: "Budapest CrossFit Box", problem: "Magas churn, alacsony új tag szerzés", solution: "Facebook Ads + email automatizáció", result: "+310% új tag, -45% lemorzsólódás 5 hónap alatt" },
  },
  "marketing-jogi-irodaknak": {
    title: "Marketing jogi irodaknak és ügyvédeknek",
    subtitle: "Jogi irodak, ügyvédek és jogi tanácsadók számára",
    metaTitle: "Marketing Jogi Irodaknak – G2A Marketing | SEO, Google Ads, Bizalomépítés",
    metaDesc: "Jogi irodak és ügyvédek marketing megoldásai: SEO, Google Ads, bizalomépítés, tartalommarketing, lead gen.",
    icon: <span style={{fontSize:'1.75rem'}}>⚖️</span>,
    color: "#6366f1",
    heroDesc: "A jogi szektor marketingében a bizalom az első. Segítünk, hogy a potenciális ügyfelek megtaláljanak és azonnal megbízzának benned.",
    challenges: ["Etikai korlátok a jogi reklámozásban","Bizalomépítés online környezetben","Verseny a nagy irodakkal","Szakterület-specifikus kulcsszavak","Lead minőség"],
    solutions: [
      { title: "Jogi SEO", desc: "Szakterület-specifikus kulcsszavak, helyi keresések, Google My Business" },
      { title: "Tartalommarketing", desc: "Jogi blog, GYIK oldalak, ügyvédi cikkek – bizalomépítés" },
      { title: "Google Ads", desc: "Célzott kampanyok, minősített leadek, etikai megfelelés" },
      { title: "Weboldal fejlesztés", desc: "Professzionális megjelenés, ügyvéd bemutató, kapcsolatfelvétel" },
    ],
    results: [{num:"+280%",label:"Organikus forgalom"},{num:"+190%",label:"Kapcsolatfelvétel"},{num:"+150%",label:"Minősített lead"}],
    caseStudy: { client: "Budapest-i ügyvédi iroda", problem: "Alacsony online láthatóság", solution: "SEO + tartalommarketing + Google Ads", result: "+280% organikus forgalom 6 hónap alatt" },
  },
  "marketing-ingatlan-cegeknek": {
    title: "Marketing ingatlan cégeknek és ügynökségeknek",
    subtitle: "Ingatlaniroda, fejlesztő és ingatlanügynök számára",
    metaTitle: "Marketing Ingatlan Cégeknek – G2A Marketing | SEO, Facebook Ads, Lead Gen",
    metaDesc: "Ingatlan cégek marketing megoldásai: Facebook Ads, Google Ads, SEO, lead gen, ingatlan portál integráció.",
    icon: <span style={{fontSize:'1.75rem'}}>🏠</span>,
    color: "#0ea5e9",
    heroDesc: "Az ingatlanpiac versenyében az első benyomás dönt. Segítünk, hogy a vevők és bérlők megtaláljanak és azonnal cselekedjenek.",
    challenges: ["Magas verseny az ingatlanpiacon","Hosszú értékesítési ciklus","Minősített vevők vs. érdeklődők","Vizuális tartalom igény","Szezonális piac"],
    solutions: [
      { title: "Facebook & Instagram Ads", desc: "Ingatlan hirdetések, retargeting, lookalike közönség" },
      { title: "Google Ads", desc: "Keresési kampanyok, Display, YouTube videó hirdetések" },
      { title: "SEO & tartalommarketing", desc: "Ingatlanpiac blog, helyi SEO, portál integráció" },
      { title: "CRM & lead menedzsment", desc: "Automatikus követés, lead minősítés, értékesítési tölcsér" },
    ],
    results: [{num:"+340%",label:"Minősített lead"},{num:"-30%",label:"Lead költség"},{num:"4.2x",label:"ROI"}],
    caseStudy: { client: "Budapest-i ingatlaniroda", problem: "Drága, alacsony minőségű leadek", solution: "Facebook Ads + CRM automatizáció + SEO", result: "+340% minősített lead 4 hónap alatt" },
  },
  "marketing-oktatas-cegeknek": {
    title: "Marketing oktatási intézményeknek és kurzusoknak",
    subtitle: "Iskolák, tanfolyamok, online kurzusok és oktatási cégek számára",
    metaTitle: "Marketing Oktatási Cégeknek – G2A Marketing | SEO, Facebook Ads, Bejratkozás",
    metaDesc: "Oktatási intézmények és kurzusok marketing megoldásai: SEO, Facebook Ads, email marketing, bejratkozás növelés.",
    icon: <span style={{fontSize:'1.75rem'}}>🎓</span>,
    color: "#8b5cf6",
    heroDesc: "Az oktatási szektor marketingében a bizalom és a hitelesség az első. Segítünk, hogy a diákok megtaláljanak és beiratkozzanak.",
    challenges: ["Szezonális bejratkozási időszakok","Verseny az online kurzusplatformokkal","Szülők és diákok egyszerre","Hosszú döntési folyamat","Akkreditáció kommunikációja"],
    solutions: [
      { title: "SEO & tartalommarketing", desc: "Kurzus-specifikus kulcsszavak, oktatási blog, FAQ oldalak" },
      { title: "Facebook & Instagram Ads", desc: "Célzott kampanyok diákoknak és szülőknek" },
      { title: "Email marketing", desc: "Bejratkozási sorozat, open house meghívók, alumni kommunikáció" },
      { title: "Weboldal fejlesztés", desc: "Online bejratkozás, kurzus katalógus, eredmény-bemutató" },
    ],
    results: [{num:"+290%",label:"Bejratkozás"},{num:"+220%",label:"Weboldal forgalom"},{num:"3.8x",label:"ROI"}],
    caseStudy: { client: "Budapest-i nyelviskolai hálózat", problem: "Alacsony online bejratkozás", solution: "SEO + Facebook Ads + email automatizáció", result: "+290% bejratkozás 5 hónap alatt" },
  },
  "marketing-vendeglatas-cegeknek": {
    title: "Marketing vendéglátóhelyek és éttermek számára",
    subtitle: "Éttermek, kávézók, bárok és vendéglátó láncok számára",
    metaTitle: "Marketing Éttermeknek – G2A Marketing | Helyi SEO, Instagram, Google Ads",
    metaDesc: "Vendéglátóhelyek és éttermek marketing megoldásai: helyi SEO, Instagram, Google Ads, asztalfoglalás növelés.",
    icon: <span style={{fontSize:'1.75rem'}}>🍽️</span>,
    color: "#ef4444",
    heroDesc: "A vendéglátás az élményekről szól. Segítünk, hogy az éttermed tele legyen vendégekkel – hétköznap és hétvégén egyaránt.",
    challenges: ["Helyi verseny","Hétköznapi forgalom növelése","Online értékelések kezelése","Szezonális kampanyok","Delivery és elvitel forgalom"],
    solutions: [
      { title: "Helyi SEO & Google My Business", desc: "Térkép-optimalizalás, értékelések, nyíltártás" },
      { title: "Instagram & TikTok marketing", desc: "Ételfotók, Reels, influencer egyuttműködés" },
      { title: "Google Ads", desc: "Helyi keresési kampanyok, akciók, hétköznapi promociók" },
      { title: "Email & SMS marketing", desc: "Hűségprogramok, születésnap kampanyok, foglalás emlékeztetők" },
    ],
    results: [{num:"+260%",label:"Online foglalás"},{num:"+190%",label:"Instagram követők"},{num:"+140%",label:"Hétköznapi forgalom"}],
    caseStudy: { client: "Budapest belvárosi étterem", problem: "Alacsony hétköznapi forgalom", solution: "Instagram + Google My Business + Google Ads", result: "+260% online foglalás 3 hónap alatt" },
  },
  "marketing-logisztikai-cegeknek": {
    title: "Marketing logisztikai és szállítmányozási cégeknek",
    subtitle: "Logisztikai vállalatok, futárszolgálatok és szállítmányozók számára",
    metaTitle: "Marketing Logisztikai Cégeknek – G2A Marketing | B2B Lead Gen, SEO, LinkedIn",
    metaDesc: "Logisztikai cégek marketing megoldásai: B2B lead gen, LinkedIn marketing, SEO, tartalommarketing.",
    icon: <span style={{fontSize:'1.75rem'}}>🚚</span>,
    color: "#f97316",
    heroDesc: "A logisztika a megbízhatóságról szól. Segítünk, hogy a potenciális üzleti partnerek megtaláljanak és megbízzának benned.",
    challenges: ["B2B értékesítési ciklus","Verseny a nagy logisztikai láncokkal","Szakember hiány – toborzás","Komplex portfólió kommunikáció","Nemzetközi terjeszkedés"],
    solutions: [
      { title: "LinkedIn B2B marketing", desc: "Cégdöntéshozók elérése, thought leadership tartalmak" },
      { title: "SEO & tartalommarketing", desc: "Logisztikai blog, esettanulmányok, iparági cikkek" },
      { title: "Google Ads B2B", desc: "Keresési kampanyok, remarketing, lead gen formátumok" },
      { title: "Email marketing", desc: "Nurturing sorozat, ügyfél hírlével, partnerprogramok" },
    ],
    results: [{num:"+240%",label:"B2B lead"},{num:"+180%",label:"LinkedIn követők"},{num:"3.5x",label:"ROI"}],
    caseStudy: { client: "Magyar logisztikai vállalat", problem: "Alacsony B2B lead szám", solution: "LinkedIn + SEO + Google Ads", result: "+240% B2B lead 5 hónap alatt" },
  },
  "marketing-penzugyi-cegeknek": {
    title: "Marketing pénzügyi szolgáltatóknak és tanácsadóknak",
    subtitle: "Befektetési tanácsadók, biztosítók és pénzügyi tervezők számára",
    metaTitle: "Marketing Pénzügyi Cégeknek – G2A Marketing | Bizalomépítés, SEO, Lead Gen",
    metaDesc: "Pénzügyi szolgáltatók marketing megoldásai: bizalomépítés, SEO, Google Ads, GDPR-kompatibilis lead gen.",
    icon: <span style={{fontSize:'1.75rem'}}>💰</span>,
    color: "#22c55e",
    heroDesc: "A pénzügyi szektorban a bizalom és a hitelesség az első. Segítünk, hogy a potenciális ügyfelek megtaláljanak és megbízzának benned.",
    challenges: ["Szigorú szabályozási környezet","Bizalomépítés online","Komplex termékek kommunikációja","Minősített leadek","Verseny a bankokkal"],
    solutions: [
      { title: "SEO & tartalommarketing", desc: "Pénzügyi blog, GYIK, kalkulátorok – bizalomépítés" },
      { title: "Google Ads", desc: "GDPR-kompatibilis, minősített lead gen kampanyok" },
      { title: "LinkedIn marketing", desc: "B2B pénzügyi tanácsadás, thought leadership" },
      { title: "Email marketing", desc: "Nurturing sorozat, piaci hírek, ügyfél kommunikáció" },
    ],
    results: [{num:"+270%",label:"Minősített lead"},{num:"+200%",label:"Organikus forgalom"},{num:"4.1x",label:"ROI"}],
    caseStudy: { client: "Magyar befektetési tanácsadó iroda", problem: "Alacsony minőségű leadek", solution: "SEO + tartalommarketing + Google Ads", result: "+270% minősített lead 6 hónap alatt" },
  },
  "marketing-sport-cegeknek": {
    title: "Marketing sport cégeknek és sportkluboknak",
    subtitle: "Sportklubbok, sportszer boltók és sport rendezvények számára",
    metaTitle: "Marketing Sport Cégeknek – G2A Marketing | Social Media, Szponzoráció, Jegyeladás",
    metaDesc: "Sport cégek és sportklubbok marketing megoldásai: social media, szponzoráció, jegyeladás növelés.",
    icon: <span style={{fontSize:'1.75rem'}}>⚽</span>,
    color: "#3b82f6",
    heroDesc: "A sport a szenvedélyekről szól. Segítünk, hogy a rajongók elkötelezettekké váljanak és a szponzorok megtalálják a klubot.",
    challenges: ["Szurkolói elkötelezettség","Szponzorzációs érték kommunikáció","Jegyeladás növelése","Fiatal szurkolók elérése","Szezonális tartalom"],
    solutions: [
      { title: "Social media menedzsment", desc: "TikTok, Instagram, Facebook – szurkolói tartalmak" },
      { title: "Szponzorációs anyagok", desc: "Szponzori csomag, média kit, ROI riport" },
      { title: "Jegyeladás kampanyok", desc: "Facebook Ads, email marketing, early bird akciók" },
      { title: "Weboldal & SEO", desc: "Eredmények, játékosok, jegy vásárlás" },
    ],
    results: [{num:"+350%",label:"Social elérés"},{num:"+230%",label:"Jegyeladás"},{num:"+180%",label:"Szponzorációs bevétel"}],
    caseStudy: { client: "Magyar labdarúgó klub", problem: "Alacsony szurkolói elkötelezettség", solution: "Social media + jegyeladás kampanyok", result: "+350% social elérés, +230% jegyeladás 4 hónap alatt" },
  },
  "marketing-divat-cegeknek": {
    title: "Marketing divat márkáknak és ruházati cégeknek",
    subtitle: "Divat márkák, ruházati boltok és online divat áruházak számára",
    metaTitle: "Marketing Divat Cégeknek – G2A Marketing | Instagram, TikTok, E-commerce",
    metaDesc: "Divat márkák és ruházati cégek marketing megoldásai: Instagram, TikTok, e-commerce SEO, influencer marketing.",
    icon: <span style={{fontSize:'1.75rem'}}>👗</span>,
    color: "#ec4899",
    heroDesc: "A divat a vizualitásról és az identitásról szól. Segítünk, hogy a márkád kitűnjön a zaj közül és hű követőkre tegyen szert.",
    challenges: ["Magas verseny az e-commerce piacon","Szezonális kampanyok","Influencer hitelesség","Visszaküldési ráta","Márkaépítés vs. azonnali eladás"],
    solutions: [
      { title: "Instagram & TikTok marketing", desc: "Kollekció bemutató, Reels, influencer egyuttműködés" },
      { title: "E-commerce SEO", desc: "Termék oldal optimalizalás, kategória SEO, blog" },
      { title: "Facebook & Instagram Ads", desc: "Dinamikus termék hirdetések, retargeting, lookalike" },
      { title: "Email marketing", desc: "Kollekció launch, elhagyott kosár, hűségprogramok" },
    ],
    results: [{num:"+380%",label:"E-commerce forgalom"},{num:"+290%",label:"Instagram követők"},{num:"4.5x",label:"ROAS"}],
    caseStudy: { client: "Magyar divat márka", problem: "Alacsony online eladás", solution: "Instagram + TikTok + Facebook Ads + email", result: "+380% e-commerce forgalom 5 hónap alatt" },
  },
};

export default function IparagiLandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);
  const [, params] = useRoute("/iparagi/:slug");
  const slug = params?.slug || "";
  const data = INDUSTRY_DATA[slug];

  if (!data) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ color: "var(--g2a-text-primary)", fontFamily: "Outfit, sans-serif" }}>Az oldal nem található</h1>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="g2a-btn-primary">Vissza a főoldalra</span>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead title={data.metaTitle} description={data.metaDesc} />
      <ScrollProgressBar />
      <Navigation />

      <div ref={pageRef}>
        {/* Hero */}
        <section style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          background: `radial-gradient(ellipse at 60% 40%, ${data.color}15 0%, transparent 55%), var(--g2a-bg)`,
          paddingTop: "6rem",
        }}>
          <div className="g2a-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="g2a-container" style={{ position: "relative", zIndex: 1, padding: "4rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ color: data.color, backgroundColor: `${data.color}15`, padding: "0.75rem", borderRadius: "12px", border: `1px solid ${data.color}30` }}>
                {data.icon}
              </div>
            </div>
            <div className="g2a-section-label animate-fadeIn">Iparági specializáció</div>
            <h1 className="g2a-headline-xl animate-fadeInUp" style={{ animationDelay: "0.15s", maxWidth: "750px" }}>
              {data.title}
            </h1>
            <p className="animate-fadeInUp" style={{ animationDelay: "0.25s", fontSize: "1rem", color: data.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>
              {data.subtitle}
            </p>
            <p className="animate-fadeInUp" style={{ animationDelay: "0.35s", fontSize: "1.1rem", color: "var(--g2a-text-secondary)", maxWidth: "580px", lineHeight: "1.7", fontFamily: "Inter, sans-serif", marginBottom: "2.5rem" }}>
              {data.heroDesc}
            </p>
            <div className="animate-fadeInUp" style={{ animationDelay: "0.5s", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-primary">Ingyenes Audit <ArrowRight size={16} /></span>
              </Link>
              <Link href="/kapcsolat" style={{ textDecoration: "none" }}>
                <span className="g2a-btn-secondary">Kapcsolatfelvétel</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: "2.5rem 0", backgroundColor: "var(--g2a-bg-2)", borderTop: "1px solid var(--g2a-border)", borderBottom: "1px solid var(--g2a-border)" }}>
          <div className="g2a-container">
            <div style={{ display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
              {data.results.map((r, i) => (
                <div key={i} className="reveal" style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "2.5rem", color: data.color }}>{r.num}</div>
                  <div className="g2a-stat-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <div className="g2a-section-label reveal">Kihívások</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">Milyen kihívásokkal szembesülsz?</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
                  {data.challenges.map((c, i) => (
                    <div key={i} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle size={16} style={{ color: data.color, flexShrink: 0, marginTop: "0.2rem" }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--g2a-text-secondary)", fontFamily: "Inter, sans-serif" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="g2a-section-label reveal">Megoldásaink</div>
                <h2 className="g2a-section-title reveal reveal-delay-1">Hogyan segítünk?</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                  {data.solutions.map((s, i) => (
                    <div key={i} className={`g2a-card reveal reveal-delay-${(i % 3) + 1}`} style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--g2a-text-primary)", marginBottom: "0.25rem" }}>{s.title}</div>
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
                <div className="g2a-section-label reveal">Esettanulmány</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>Valós eredmény ebből az iparágból</h2>
              </div>
              <div className="g2a-card reveal" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: data.color }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Ügyfél</div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--g2a-text-primary)" }}>{data.caseStudy.client}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Kihívás</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)" }}>{data.caseStudy.problem}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--g2a-text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Megoldás</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--g2a-text-secondary)" }}>{data.caseStudy.solution}</div>
                  </div>
                </div>
                <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", borderRadius: "10px", backgroundColor: `${data.color}10`, border: `1px solid ${data.color}25` }}>
                  <div style={{ fontSize: "0.75rem", color: data.color, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>Eredmény</div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.25rem", color: data.color }}>{data.caseStudy.result}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="g2a-section g2a-cta-gradient">
          <div className="g2a-container" style={{ textAlign: "center" }}>
            <h2 className="g2a-headline-lg reveal" style={{ marginBottom: "1rem" }}>Készen állsz a növekedésre?</h2>
            <p className="g2a-section-subtitle reveal reveal-delay-1" style={{ margin: "0 auto 2.5rem", textAlign: "center" }}>
              Kérj ingyenes marketing auditot és megmutatjuk, hogyan érhetünk el hasonló eredményeket a te vállalkozásodban.
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
