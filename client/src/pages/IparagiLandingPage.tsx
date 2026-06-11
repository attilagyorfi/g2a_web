import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { serviceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/jsonLd";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import IndustryHeroDemo, { hasIndustryHeroDemo } from "@/components/industry-demos/IndustryHeroDemo";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, ChevronDown, Stethoscope, ShoppingBag, Wrench, Car, Scale, Code, Lightbulb, Building2 } from "lucide-react";
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
  "marketing-ugyvedi-irodaknak": { icon: <Scale size={32} />, color: "#6366f1" },
  "marketing-technologiai-cegeknek": { icon: <Code size={32} />, color: "#8b5cf6" },
  "marketing-onkormanyzati-projekteknek": { icon: <Lightbulb size={32} />, color: "#14b8a6" },
  "marketing-b2b-cegeknek": { icon: <Building2 size={32} />, color: "var(--g2a-brand-teal)" },
};

// ─── Industry content (localized) ───────────────────────────────────────────
//
// Per the strategy document (sections 4.14-4.15), each industry page should
// include not just a short pitch but: market context, industry-specific
// challenges, mapped solutions, related G2A services with internal links,
// and a focused FAQ. The fields below are all content the renderer reads.
//
// Keep the field count small — bigger content blocks live in `intro`,
// `whyG2A` and `faqs`. Existing fields (title, subtitle, etc.) are
// preserved so the file's history remains diffable.
type IndustryContent = {
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  heroDesc: string;
  /** 2–3 sentence market-context paragraph rendered above the challenges grid. */
  intro?: string;
  challenges: string[];
  solutions: { title: string; desc: string }[];
  results: { num: string; label: string }[];
  caseStudy: { client: string; problem: string; solution: string; result: string };
  /** Why G2A is different for this industry — short paragraph after the case study. */
  whyG2A?: string;
  /** Internal link cards to relevant service subpages. */
  relatedServices?: { title: string; desc: string; href: string }[];
  /** 4–6 industry-specific Q&A. */
  faqs?: { q: string; a: string }[];
};

const INDUSTRY_CONTENT: Record<Language, Record<string, IndustryContent>> = {
  hu: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "Egészségügyi marketing, ami pácienseket hoz",
      subtitle: "Klinikák, magánorvosok, fogászatok és wellness intézmények számára",
      metaTitle: "Egészségügyi marketing klinikáknak és magánorvosoknak | G2A Marketing",
      metaDesc:
        "Adatvédelmi megfelelőség, online foglalási rendszerek, lokális SEO és bizalomépítő reputáció menedzsment. Marketingmegoldások klinikáknak, magánorvosoknak és wellness vállalkozásoknak.",
      heroDesc:
        "Az egészségügyben egyszerre kell megfelelni a szigorú szabályozásoknak és a páciensek elvárásainak. Marketing szolgáltatásainkkal biztosítjuk, hogy praxisod hiteles, könnyen elérhető és bizalmat keltő legyen — és az online foglalások mérhetően növekedjenek.",
      intro:
        "A magyar magán-egészségügy az elmúlt öt évben gyors növekedést mutatott: a páciensek a Google-ben keresnek, az értékelések alapján döntenek, és online szeretnének időpontot foglalni. Ugyanakkor a szektort szigorú szabályozás övezi (GDPR, ETT, gyógyszerreklám-tilalom), ami komoly kihívásokat jelent a hagyományos hirdetési stratégiáknak.",
      challenges: [
        "GDPR és orvosi adatok kezelése — a páciensadatok kezelése jogi szempontból minden marketingaktivitásban kritikus",
        "Online láthatóság — a páciensek 80%-a a Google-ben keres, lokális SEO nélkül láthatatlan vagy",
        "Pácienskommunikáció — könnyen használható foglalási rendszer, gyors válaszadás",
        "Bizalomépítés — pozitív Google értékelések, professzionális vizuális megjelenés",
        "Reputáció menedzsment — negatív értékelések kezelése, krízishelyzetek",
        "Verseny a nagyobb kórházakkal és magánklinikahálózatokkal — differenciálás kis praxisként",
      ],
      solutions: [
        {
          title: "Konverzióoptimalizált weboldal",
          desc: "Gyors, reszponzív, akadálymentes design — a páciens 3 kattintás alatt foglal időpontot",
        },
        {
          title: "Online foglalási rendszer + CRM",
          desc: "Integráció praxis menedzsment szoftverrel (BookYou, MedicalSoft), automatikus emlékeztetők",
        },
        {
          title: "Egészségügyi tartalommarketing",
          desc: "Edukatív cikkek, kezelés-magyarázók, GYIK videók — jogtisztán, ETT-kompatibilisen",
        },
        {
          title: "Lokális SEO és Google Ads",
          desc: "„Fogorvos Pécs”, „magán bőrgyógyász Budapest” típusú keresésekre optimalizált tartalom és hirdetések",
        },
        {
          title: "Reputáció menedzsment",
          desc: "Google értékelések proaktív gyűjtése, válaszadási sablonok, negatív review krízisterv",
        },
        {
          title: "GDPR-konform analitika",
          desc: "Cookie-mentes mérés (Plausible), anonim konverziókövetés — TASZ-mentes adatkezelés",
        },
      ],
      results: [
        { num: "+340%", label: "Organikus forgalom" },
        { num: "+180%", label: "Online foglalás" },
        { num: "40+", label: "Egészségügyi projekt" },
      ],
      caseStudy: {
        client: "Dent & Beauty",
        problem: "Fogászati és esztétikai klinika, ahol a páciensek többsége mobilról keresi az infókat — a régi weboldal nem volt mobilbarát, az időpontfoglalás bonyolult.",
        solution: "Mobilbarát WordPress weboldal, páciens-fókuszú információs hierarchia: kezelés-portfólió, transzparens árak, 3 kattintásos foglalás.",
        result: "Strukturált kezelés-portfólió, transzparens árak, mobilra optimalizált foglalási folyamat.",
      },
      whyG2A:
        "Több mint 40 egészségügyi projekten dolgoztunk magyar klinikákkal és magánorvosokkal. Ismerjük a legfontosabb specializációk SEO-térképét (fogászat, bőrgyógyászat, ortopédia, magánnőgyógyászat), a praxis-szoftverek API-jait, és a NAIH gyakorlatát. Stratégiánkat mindig 1 hónapos pilottal kezdjük — ha nem szállítunk mérhető eredményt, kötbér nélkül felmondod.",
      relatedServices: [
        {
          title: "Keresőoptimalizálás (SEO)",
          desc: "Lokális orvosi kulcsszavak, Google My Business optimalizálás",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "PPC & Google Ads",
          desc: "GDPR-kompatibilis hirdetések, betegcsoport-szegmentálás",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Webfejlesztés és CRO",
          desc: "Foglalási rendszer integráció, mobilbarát betegélmény",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "Milyen platformokkal dolgoztok egészségügyi marketing terén?",
          a: "WordPress és WP-Booking, BookYou, MedicalSoft praxis-szoftverek, Google My Business, Meta (csak nem-gyógyszer/ETT-tartalmakra), Google Ads. Adatkezelésben TiDB Cloud (EU régió) és Plausible analitika a GDPR-megfelelőséghez.",
        },
        {
          q: "Hogyan biztosítjátok a GDPR-megfelelőséget?",
          a: "Cookie-mentes alapanalitika (Plausible), expliciten naplózott consent, betegadatokkal nem dolgozunk közvetlenül — csak az aggregált forgalmi és konverziós metrikákkal. Minden hirdetés-creatívot ETT-szempontból ellenőrzünk a publikálás előtt.",
        },
        {
          q: "Tudtok segíteni negatív Google értékelések kezelésében?",
          a: "Igen. Két szintű reputáció-stratégiát alkalmazunk: (1) proaktív — pozitív értékelések szisztematikus gyűjtése elégedett pácienstől automatizált e-mailes invitálással; (2) reaktív — krízis-válaszsablonok, eljárási panaszok jogszerű menedzselése a Google policy-jainak megfelelően.",
        },
        {
          q: "Mennyi időn belül látható az SEO eredménye egészségügyi területen?",
          a: "Lokális keresésekre („fogorvos [város]”) jellemzően 2–4 hónap, országos szintű kulcsszavakra („implantátum árak”) 6–9 hónap. A Google Ads már 1–2 hét alatt szállít mérhető pácienst — gyakran SEO-val párhuzamosan indítjuk a kettőt.",
        },
        {
          q: "Milyen költségvetéssel számoljak?",
          a: "Magán-praxisoknál havi 250-600 ezer Ft (audit + kampány + tartalom kombinált), klinikáknál 600 ezer Ft–1.2M Ft. Hirdetési költség külön — minimum havi 200 ezer Ft Google Ads spend ajánlott a méretgazdaságos eredményhez.",
        },
      ],
    },
    "marketing-szepsegipari-cegeknek": {
      title: "Szépségipari marketing, ami foglalásokat hoz",
      subtitle: "Szépségszalonok, kozmetikák, fodrászatok és wellness vállalkozások számára",
      metaTitle: "Szépségipari marketing — Instagram, Meta Ads, foglalás | G2A Marketing",
      metaDesc:
        "Vizuális márkaépítés, Instagram és TikTok stratégia, Meta Ads kampányok, online foglalási rendszer szépségszalonoknak, fodrászatoknak és kozmetikáknak.",
      heroDesc:
        "A szépségiparban a vizuális tartalom és a közösségi média a vásárlói döntés. Olyan stratégiát építünk, ami a vonzó kreativitást komoly konverzió-mérésre fordítja — Instagram followerből foglaló vásárló lesz.",
      intro:
        "A szépségiparban a vásárló elsősorban Instagramon, TikTokon és Google térképen kutat — nem a website-on. A weboldal akkor szól bele a döntésbe, amikor a foglalási flow indul. Ez azt jelenti, hogy a marketing-eszközök másképp osztódnak meg, mint más szolgáltatóiparban: 60% social, 30% lokális SEO + Google My Business, 10% paid search.",
      challenges: [
        "Folyamatos vizuális tartalomgyártás (előtte–utána fotók, reels, behind-the-scenes)",
        "Instagram és TikTok algoritmus-optimalizálás — organikus reach a legfontosabb metrika",
        "Foglalási flow rövidítése: minimum kattintás a kosárba",
        "Szezonális kampányok (esküvő, ünnepek, summer body) gyors kreatív-iterációval",
        "Helyi versenytársak elöli megkülönböztetés árazás nélkül — egyedi élmény / specializáció",
        "Lojalitás építése — a customer lifetime value 3-szor jobban szállít, mint új akvizíció",
      ],
      solutions: [
        {
          title: "Instagram & TikTok stratégia",
          desc: "Heti tartalomnaptár, reels-receptek, hashtag-kutatás, Story-konverziós flow",
        },
        {
          title: "Meta Ads + TikTok Ads",
          desc: "Célzás demográfia + viselkedés alapján, lookalike audience, retargeting az utolsó 30 napban site-on járókra",
        },
        {
          title: "Online foglalási weboldal",
          desc: "Booksy, Salonkee, vagy custom WP foglalási rendszer integráció — mobilbarát, gyors",
        },
        {
          title: "Influencer marketing",
          desc: "Mikro- (5-50K követő) és nano-influencerek a helyi piacon — gift-for-content és fizetett együttműködések",
        },
        {
          title: "Lokális SEO",
          desc: "Google My Business optimalizálás, „kozmetikus [város]” típusú kulcsszavak, fotók és értékelések kezelése",
        },
        {
          title: "Lojalitás & email marketing",
          desc: "Visszajáró ügyfél program, születésnapi automatizációk, szezonális ajánlatok ütemezve",
        },
      ],
      results: [
        { num: "+520%", label: "Instagram követő" },
        { num: "+190%", label: "Online foglalás" },
        { num: "25+", label: "Szépségipari projekt" },
      ],
      caseStudy: {
        client: "GRB Skin Clinic",
        problem: "Prémium bőrgyógyászati klinika, ahol az ügyfelek diszkréciót és hitelességet várnak — fragmentált digitális jelenlét (külön Ads, SEO, weboldal ügynökségekkel).",
        solution: "Komplex digitális jelenlét egy kézben: Google Ads + SEO + WordPress weboldal + kreatív szövegírás — orvosi-szakmai pontosság, ügyfélbarát hangnem.",
        result: "Egységes minőségű digitális jelenlét egy partnerrel, folyamatos Google Ads + SEO együttműködés.",
      },
      whyG2A:
        "25+ szépségipari projekttel a hátunk mögött ismerjük az iparág sajátos rhythmusát: a foglalások 70%-a kedd-péntek 18-22 között érkezik, a no-show arányt visszaszámolós e-mail és SMS automatizációval 40%-ról 12%-ra csökkentettük egy ügyfelünknél. Tudunk hidegen vágni egy reels-naptárt, kreatívokat gyártani Canva + AI eszközökkel, és a Booksy/Salonkee booking funnelt konverzió-szempontból optimalizálni.",
      relatedServices: [
        {
          title: "Közösségi média menedzsment",
          desc: "Instagram, TikTok stratégia és tartalomgyártás",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "PPC & Hirdetéskezelés",
          desc: "Meta Ads, TikTok Ads, lokális targeting",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Arculattervezés",
          desc: "Egységes vizuális identitás minden platformra",
          href: "/szolgaltatasok/arculattervezes",
        },
      ],
      faqs: [
        {
          q: "Hogy néz ki egy heti tartalomnaptár szépségszalonnak?",
          a: "Tipikusan 4-5 Instagram poszt + 7-10 Story + 2-3 Reel + 1 TikTok hetente. A téma-mix: 30% előtte-utána munkák, 25% szakértői tippek, 20% behind-the-scenes csapat, 15% akciók/foglalási CTA, 10% UGC (vendég-tartalom).",
        },
        {
          q: "Tudtok influencerrel kapcsolatot kezelni?",
          a: "Igen — a kontextustól függően mikro-influencerekkel (5-50K követő) gift-for-content alapon, vagy közepesebbekkel (50-200K) fizetett együttműködéssel. A G2A felelős a brief kiadásáért, a leadás review-ért és a poszt-disclaimer (ESEMÉ-kompatibilis) ellenőrzésért.",
        },
        {
          q: "Milyen foglalási rendszert ajánlotok?",
          a: "Magyarországon a Booksy és Salonkee a két legnépszerűbb. Booksy = stronger marketplace, ingyenes plan + tranzakciós díj; Salonkee = jobb többfős szalon CRM-funkciók. Ha custom website-ot építünk, a WP-Booking + Stripe kombináció a legrugalmasabb.",
        },
        {
          q: "Hogyan kezeljük a no-show problémát?",
          a: "Háromrétegű automatizáció: foglalás után 1 órán belül megerősítő e-mail; 24 óra előtt SMS emlékeztető; foglalás napján 2 órával előtte push-értesítés vagy SMS „erősítsd meg, hogy jössz” gombbal. Ezzel egy ügyfelünknél 40%→12%-ra csökkent a no-show arány.",
        },
        {
          q: "Mibe kerül szépségipari marketing havonta?",
          a: "Egyszemélyes kozmetikának 80-150 ezer Ft (social + lokális SEO), 2-3 fős szalonnak 250-450 ezer Ft (mindezt + Meta Ads). Hirdetési költség külön — minimum 100 ezer Ft/hó Meta Ads spend ajánlott.",
        },
      ],
    },
    "marketing-mernoki-irodaknak": {
      title: "Mérnöki marketing, ami megbízásokat hoz",
      subtitle: "Tervezőirodák, statikai irodák, gépészmérnöki vállalkozások és építőipari szolgáltatók",
      metaTitle: "Mérnöki és építőipari B2B marketing | G2A Marketing",
      metaDesc:
        "B2B leadgenerálás, technikai SEO, LinkedIn stratégia és referencia-portfólió tervezőirodáknak, mérnöki vállalkozásoknak. Komplex műszaki tartalmak, szakmai hitelesség.",
      heroDesc:
        "A mérnöki szektorban a megbízás referenciából, ajánlásból és szakmai bizalomból érkezik — de az elsőkörös ügyféljelölt mára a Google-en és LinkedInen kutat. Olyan online jelenlétet építünk, ami a tényleges projektkompetenciát mutatja meg, nem üres marketing-szöveggel.",
      intro:
        "A magyar mérnöki és tervezőirodai szektor jellemzően alulreprezentált online: portfólió-weboldalak elavultak, LinkedIn jelenlét hiányos, és a szakmai tartalom inkább zsargonban íródik mint ügyfél-szempontú előny-fókusszal. Ez piaci lehetőség: aki ezt rendbe rakja, gyorsan kiemelkedik a versenytársak közül még olyan kis piacokon is mint a Dél-Dunántúl.",
      challenges: [
        "Szakmai hitelesség kommunikálása nem-szakember megbízóknak (önkormányzat, befektető, fejlesztő)",
        "B2B leadgenerálás hosszú értékesítési cikluson keresztül (3-12 hónap projektelőkészítés)",
        "Komplex műszaki tartalmak érthetővé tétele döntéshozóknak",
        "LinkedIn-jelenlét építése — egyéni szakértői hangokkal, nem csak vállalati oldallal",
        "Referencia projektek vizuálisan vonzó bemutatása (3D render, fotók, mérnöki szakzsargon nélkül)",
        "Pályázati hirdetésekre való reagálás gyorsítása — a Közbeszerzési és tendereken nyertes projektek külön kommunikációt igényelnek",
      ],
      solutions: [
        {
          title: "Műszaki B2B SEO",
          desc: "„Statikus tervezés [város]”, „épületgépészet tervezés”, „acélszerkezet tervező” iparági kulcsszavakra optimalizálás",
        },
        {
          title: "LinkedIn Account-Based Marketing",
          desc: "Specifikus fejlesztő-cégek, generálkivitelezők, befektetők targetálása — egyenkénti kapcsolatfelvétel + retargeting",
        },
        {
          title: "Portfólió-fókuszú weboldal",
          desc: "Projekt-archívum, 3D render galériák, projektméret + költségvetés szűrők, ajánlatkérő űrlap",
        },
        {
          title: "White paper és technikai tartalom",
          desc: "Mélyfúrásos szakmai cikkek (BIM, fenntarthatóság, energiahatékonyság) + leadmágnes letöltések",
        },
        {
          title: "Pályázati & tender PR",
          desc: "Tender-nyertes projektek sajtóanyaggá formálása, helyi médiamegjelenés",
        },
        {
          title: "Mérnök-személyiségmárka",
          desc: "Az iroda tulajdonosának/senior mérnökének LinkedIn thought leadership-stratégiája",
        },
      ],
      results: [
        { num: "+300%", label: "Weboldal forgalom" },
        { num: "+15", label: "Új ügyfél/hónap" },
        { num: "30+", label: "Mérnöki projekt" },
      ],
      caseStudy: {
        client: "M Mérnöki Iroda Kft.",
        problem: "30 éves szakmai múltú mérnöki iroda nem mobilbarát weboldallal és csak alkalmi social posztokkal — a presztízs nem tükröződött online.",
        solution: "Új UI/UX (Figma) + mobilbarát weboldal (Bootstrap, HTML, CSS) + Facebook/Instagram/LinkedIn jelenlét — minden platformon egységes brand-arculat.",
        result: "Korszerű, mobilbarát weboldal, aktív 3-platformos social jelenlét, egységes vizuális identitás.",
      },
      whyG2A:
        "30+ mérnöki és építőipari projektben dolgoztunk magyar irodákkal. Tudunk BIM-modellből web-rendert csinálni, statikai pályázatot átvenni szöveggé alakítani, és LinkedIn-en olyan thought leadership tartalmat építeni, ami nem mérnök ügyfeleknek is érthető. Ismerjük a Közbeszerzési Hatóság rendszerét és a leggyakoribb tender-fajtákat.",
      relatedServices: [
        {
          title: "Keresőoptimalizálás",
          desc: "Műszaki kulcsszó-kutatás, technikai SEO, B2B tartalmi struktúra",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "Webfejlesztés",
          desc: "Portfólió-rendszer, ajánlatkérő, projekt-archívum",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Stratégiai marketing",
          desc: "B2B buyer journey, ABM stratégia, sales-marketing alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "Mennyi idő alatt látunk B2B leadgenerálási eredményt?",
          a: "Reálisan 4-6 hónap az első mérhető pipeline-növekedéshez. A B2B mérnöki értékesítési ciklus jellemzően 3-12 hónap, így ha most kezdünk SEO + LinkedIn stratégiát, a tényleges szerződésekben az eredmény 9-15 hónap múlva látszik. A leading indikátorok (CTR, kapcsolatfelvétel, demo-igénylés) viszont 2 hónap után már szállítanak.",
        },
        {
          q: "Tudtok rendert vagy 3D vizualizációt készíteni?",
          a: "Saját rendert nem készítünk, de partner stúdiókkal dolgozunk együtt akik a BIM-modellből vagy CAD fájlból szállítanak portfólió-szintű képeket. Az integrációt és weboldali galériába rendezést mi vesszük át.",
        },
        {
          q: "Hogy lehet a műszaki tartalmat érthetővé tenni?",
          a: "Kétszintű tartalom-stratégia: (1) szakmai mélységű cikkek a kollégáknak és technikai döntéshozóknak (energetikai mérnököknek), (2) ROI- és üzleti-fókuszú összefoglalók a beruházóknak és önkormányzatoknak. A G2A koppintói és tartalom-szerkesztői mindkét regiszterben dolgoznak.",
        },
        {
          q: "Mi a tipikus marketing-büdzsé mérnöki irodának?",
          a: "Kis tervezőirodának (3-8 fő) havi 200-400 ezer Ft alapszolgáltatás (SEO + tartalom + LinkedIn), közepesnek (15-50 fő) 500-900 ezer Ft (mindezt + ABM + thought leadership menedzsment). Hirdetési költség jellemzően nem nagy LinkedIn esetén — havi 100-200 ezer Ft elég.",
        },
        {
          q: "Tudtok pályázati / tender PR-ben segíteni?",
          a: "Igen. Egy elnyert tendert sajtóanyaggá alakítunk, a helyi és iparági médiához eljuttatjuk, LinkedIn poszttá, weboldali esettanulmánnyá konvertáljuk. Ez egy elnyert tender 5-10x értékét tudja kommunikálni a piac felé.",
        },
      ],
    },
    "marketing-autoipari-cegeknek": {
      title: "Autóipari marketing, ami próbavezetésekhez vezet",
      subtitle: "Autókereskedők, márkaszervízek, autóparkok és autóipari beszállítók",
      metaTitle: "Autóipari marketing — kereskedők és szervízek | G2A Marketing",
      metaDesc:
        "Lokalizált PPC, lead-minősítés és márkaszerviz-marketing autókereskedőknek és autóiparnak. Google Ads, Meta Ads remarketing, hosszú értékesítési ciklus konverzió-optimalizálás.",
      heroDesc:
        "Az autóiparban a lead minősége számít, nem a mennyisége. Olyan kampányokat építünk, amelyek nem csak kattintást, hanem komoly érdeklődőt és tesztvezetésre érkező vásárlót szállítanak — versenyképes CPA-val és tisztán mérhető ROAS-szal.",
      intro:
        "A magyar autóipari piac két részre osztódik: használt autó kereskedelem (rövidebb döntési ciklus, ár-érzékenyebb vásárló) és új autó / prémium kereskedelem (hosszabb ciklus, márka- és szervizélmény-érzékeny). A marketing-stratégiát ezekre élesen szét kell választani — ami működik az egyikben, az gyakran kontraproduktív a másikban.",
      challenges: [
        "Magas hirdetési költség (Google Ads autóipari kulcsszavakon CPC 600-1500 Ft) és alacsony ROAS, ha rosszul strukturált a kampány",
        "Szezonális kereslet kezelése — tavaszi szezonra előre érdemes pipeline-t építeni",
        "Lokális és regionális vásárlók elérése a térképes keresésben, „használt [márka] [város]” típusú kulcsszavakra",
        "Versenytársak árelőnyének kompenzálása szervízélménnyel, garanciával, finanszírozási opciókkal",
        "Online és offline értékesítés összekapcsolása (online érdeklődés → tesztvezetés → showroom)",
        "Lead-minősítés automatizálása — sok lead jön, de kevés a komoly érdeklődő",
      ],
      solutions: [
        {
          title: "Google Ads kampányrestruktúra",
          desc: "Search + Performance Max + Shopping (használt autó feed) — szigorú negatív kulcsszó stratégiával a véletlen kattintások szűrésére",
        },
        {
          title: "Meta Ads + retargeting",
          desc: "Showroom-látogató + weboldal-látogató custom audience, lookalike a vásárlók alapján, dinamikus katalógus retargeting",
        },
        {
          title: "Lokális SEO",
          desc: "Google My Business optimalizálás, „[márka] szerviz [város]” kulcsszavak, helyi tartalom",
        },
        {
          title: "Konverzió-optimalizált landing page",
          desc: "Tesztvezetés-foglaló űrlap, finanszírozási kalkulátor, 360°-os autó-képgaléria",
        },
        {
          title: "Lead-scoring és CRM integráció",
          desc: "HubSpot/Pipedrive integráció, automatikus minősítés (érdeklődés szintje, finanszírozási kapacitás), értékesítő-irányítás",
        },
        {
          title: "Szerviz remarketing",
          desc: "Vásárlás után 6/12 hónappal automatikus szerviz-emlékeztető, garancia kommunikáció — CLV növelés",
        },
      ],
      results: [
        { num: "-45%", label: "CPA csökkentés" },
        { num: "+220%", label: "Lead generálás" },
        { num: "20+", label: "Autóipari projekt" },
      ],
      caseStudy: {
        client: "Nissan Ste-Ba",
        problem: "Pécsi Nissan márkakereskedés folyamatos szezonális kampányokat akar futtatni (modellek, akciók, szerviz) — mérhető, márkahangulattal konzisztens Facebook hirdetésekkel.",
        solution: "Szezonális marketing stratégia + folyamatos Facebook Ads kampányok, kéthetente cserélődő egyedi grafikák és sales-fókuszú copy a Nissan brand-hangon belül.",
        result: "Folyamatos Facebook Ads jelenlét célzott kampányokkal, sales-fókuszú copy regionális vásárlók megszólításához.",
      },
      whyG2A:
        "20+ autóipari projektben dolgoztunk autókereskedőkkel és márkaszervízekkel. Tudjuk hogy működik a Shopping feed beszállítása (TecDoc, Mobile.de szinkron), a Performance Max-ben a tesztvezetés-konverziót hogyan kell elkülöníteni az „árdeklődés”-konverziótól, és a HubSpot/Pipedrive lead-scoring trükkjeit autóipari kontextusban.",
      relatedServices: [
        {
          title: "PPC & Google Ads",
          desc: "Performance Max, Shopping feed, retargeting kampányok",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Webfejlesztés és CRO",
          desc: "Tesztvezetés-foglaló, finanszírozás-kalkulátor landing page",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Stratégiai marketing",
          desc: "Lead-scoring rendszer, sales-marketing pipeline alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "Milyen Google Ads költségvetést érdemes szánni autókereskedőként?",
          a: "Egy 1-telephelyes használt autó kereskedés esetén minimum 300-500 ezer Ft/hó, márkakereskedésnek 800 ezer–2M Ft/hó. A költség nagyon függ a piacterülettől és a kínálattól: prémium márka (BMW, Mercedes) kulcsszavak CPC-je 1200-1800 Ft, használt autóké 400-800 Ft.",
        },
        {
          q: "Hogyan kezelhető a Google Ads Shopping autóipari feedhez?",
          a: "Saját Shopping feedet építünk a kereskedés CRM/DMS rendszeréből (TecDoc, Mobile.de, Carzone), naponta szinkronizálva. A feed minden autóhoz tartalmazza az ár, futott km, gyártási év, üzemanyag-fajta, motor, és high-quality fotók. Ez teszi lehetővé hogy a kereső direkt a hirdetésre kattintáskor lássa a konkrét autót.",
        },
        {
          q: "Mit tegyünk a tesztvezetés-érdeklődések minősítésével?",
          a: "Háromrétegű scoring: (1) automatikus pre-screening kérdések a foglalási űrlapon (finanszírozási mód, konkrét modell-érdeklődés, vételi időkeret); (2) HubSpot vagy Pipedrive lead-score automatizmus érdeklődési szint alapján; (3) az értékesítőhez 60 percen belül kerül a forró lead, langyos a következő munkanap.",
        },
        {
          q: "Tudtok finanszírozási kalkulátort integrálni a weboldalba?",
          a: "Igen — Cofidis, Magyar Cetelem, OTP Lízing API integrációkkal vagy egyszerű kalkulátor-widget formában. A G2A megrendelő igényei szerint dolgozza össze a finanszírozó partner adatait a weboldali konverzió-flow-val.",
        },
        {
          q: "Hogyan mérhető a marketing-tevékenység tényleges eladásra gyakorolt hatása?",
          a: "Online lead → showroom látogatás → eladás conversion lánc CRM-ben követhető — ehhez a Google Click ID-t (GCLID) és a Meta Click ID-t (FBCLID) be kell vinni a CRM lead-mezőjébe, így vissza lehet vezetni: melyik kampány melyik tényleges autó-eladásban végződött. Ezt megépítjük a HubSpot/Pipedrive integrációba.",
        },
      ],
    },
    "marketing-ugyvedi-irodaknak": {
      title: "Ügyvédi marketing, ami ügyfeleket hoz",
      subtitle: "Ügyvédi irodák, közjegyzők, könyvelő-jogi tanácsadók és pénzügyi tanácsadók",
      metaTitle: "Ügyvédi és jogi marketing — szakmai hitelesség | G2A Marketing",
      metaDesc:
        "Szakterületi SEO, prémium brand design, GDPR-megfelelő kampányok ügyvédi és jogi irodáknak. Bizalomépítés, lokális SEO, tartalommarketing.",
      heroDesc:
        "A jogi szektorban a vásárlói döntést a presztízs, a bizalom és a szakmai hitelesség vezérli — az ár csak hatodlagos. Olyan online jelenlétet építünk, ami pontosan ezt sugározza, miközben megfelel az MÜK reklámszabályainak és a GDPR-nak.",
      intro:
        "A jogi marketing Magyarországon az MÜK Etikai Kódexe és a 2017. évi LXXVIII. tv. szabályozása alá esik — az ügyvédnek tilos összehasonlító, dícsekvő vagy tévhitkeltő reklámot folytatnia. Ez nem akadály, hanem irány: aki jól kommunikálja a szakmai mélységet és a megbízható tanácsadói karaktert, gyorsan megszerzi a bizalmat egy túlhirdető versenytárssal szemben.",
      challenges: [
        "Etikai kódex-megfelelő reklám — összehasonlító állítások, sikerdíj-ígéret tilos",
        "Presztízs és prémium érzet kommunikálása vizuális megjelenésben és tartalomban",
        "Jogi szakzsargon érthetővé tétele potenciális ügyfeleknek",
        "Google Ads korlátozások kezelése jogi vertikumban (több kategória nem futhat)",
        "Specifikus szakterületek (pl. családjog, ingatlanjog, M&A) közötti SEO-differenciálás",
        "Ügyfél-titoktartás megőrzése esetbemutatásban — nem lehet konkrét ügyet idézni",
      ],
      solutions: [
        {
          title: "Prémium brand design",
          desc: "Visszafogott elegancia, klasszikus tipográfia, prémium színek — elhatárolódás a tucat-ügyvédi sablonoktól",
        },
        {
          title: "Szakterületi SEO",
          desc: "„Munkajogi ügyvéd Budapest”, „családjogi tanácsadás Pécs” típusú long-tail kulcsszavak — minden szakterületre dedikált aloldal",
        },
        {
          title: "Edukatív tartalommarketing",
          desc: "Jogszabályi változások magyarázata, GYIK-cikkek, esetek (anonimizálva) — érthetően nem-jogászoknak",
        },
        {
          title: "Lokális SEO + Google My Business",
          desc: "Iroda profiljának teljes optimalizálása, helyi értékelések kezelése, válaszadási minták",
        },
        {
          title: "GDPR-konform kapcsolatfelvétel",
          desc: "Online konzultáció-foglaló, titkosított ügyféldokumentum-átvétel (Tresorit, ügyvédi platformokkal integrálva)",
        },
        {
          title: "LinkedIn thought leadership",
          desc: "Senior partnerek személyiségmárkája — szakmai cikkek, bírósági gyakorlat-elemzések",
        },
      ],
      results: [
        { num: "+250%", label: "Organikus forgalom" },
        { num: "+120%", label: "Ügyfélfelvétel" },
        { num: "15+", label: "Jogi projekt" },
      ],
      caseStudy: {
        client: "Proverium Ügyvédi Iroda",
        problem: "Komplex jogi szolgáltatások vállalati és magánügyfeleknek — tekintélyt sugárzó, de nem hideg online megjelenés kellett az egyik legversengőbb online piacon.",
        solution: "WordPress weboldal ügyvédi presztízshez illő modern dizájnnal + SEO-optimalizálás jogi kulcsszavakra + egységes vizuális sablonok a kommunikációhoz.",
        result: "Tekintélyes weboldal jogi szektorhoz, kulcsszó-optimalizált SEO struktúra, következetes brand-élmény minden érintkezési ponton.",
      },
      whyG2A:
        "15+ jogi projektben dolgoztunk ügyvédi irodákkal és könyvelő-jogi tanácsadókkal. Ismerjük az MÜK 6/2018. (III. 26.) MÜK Szabályzatát a hirdetésről, tudjuk hogy melyik Google Ads kategória engedélyezett és melyik tilos, és hogyan kell anonimizált esetbemutatásokat készíteni titoktartási kötelezettségünk megsértése nélkül.",
      relatedServices: [
        {
          title: "Arculattervezés",
          desc: "Prémium vizuális identitás, irodai kommunikációs anyagok",
          href: "/szolgaltatasok/arculattervezes",
        },
        {
          title: "Keresőoptimalizálás",
          desc: "Szakterületi kulcsszavak, lokális SEO, GYIK-tartalom",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "Webfejlesztés",
          desc: "Konzultáció-foglaló, biztonságos ügyfélportál integráció",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "Megengedi az MÜK az online hirdetést és a tartalommarketinget?",
          a: "Igen, a 6/2018. (III. 26.) MÜK Szabályzat alapján engedélyezett az ügyvédi tevékenység tárgyilagos, szakszerű, információszolgáltatás célú reklámja. Tilos viszont az összehasonlító, túlzó, vagy ügyfélakvizíciós tartalmú hirdetés, mint például „a legjobb ügyvéd a városban” vagy „garantált siker”. A G2A minden tartalmát ezen szabályoknak megfelelően alkotja.",
        },
        {
          q: "Tudtok ügyfélreferenciát publikálni?",
          a: "Csak az ügyfél kifejezett, írásbeli engedélyével — és akkor is csak a tevékenység jellegét bemutatva, nem konkrét ügy részleteit. Az alternatív megoldás az anonimizált esettanulmány: „X ipari középvállalat, M&A tranzakció, eredmény: 9 hónapos due diligence után sikeres zárás” — név és iparág-specifikum nélkül.",
        },
        {
          q: "Milyen Google Ads kategóriák engedélyezettek ügyvédnek?",
          a: "Általános jogi tanácsadás, családjog, polgári jog, ingatlanjog, munkajog, gazdasági jog — ezek mind futtathatók. NEM engedélyezett: hirtelen sikerdíj-alapú kampány („nem nyerünk = nem fizetsz”), büntetőjog részben (pl. „kábítószer ügyvéd”), bevándorlási konkrét ország-célzás. A G2A audit során minden kampányt jogi szempontból átnéz.",
        },
        {
          q: "Hogyan biztosítjuk a GDPR-megfelelőséget az online konzultációban?",
          a: "Tresorit titkosított dokumentum-átvétel, JotForm GDPR-compliant űrlap (EU adatcentrum), expliciten naplózott consent. Az ügyvéd-ügyfél titoktartás technikai oldala végpontok közti titkosítással biztosított.",
        },
        {
          q: "Milyen költségvetéssel induljunk?",
          a: "Egyfős vagy kis irodának (3 fő alatt) havi 200-400 ezer Ft (alapsozolgáltatások: SEO + tartalom + LinkedIn), közepesnek (5-15 fő) 500-900 ezer Ft (mindezt + Google Ads + brand kommunikáció). Hirdetési költség jellemzően 100-300 ezer Ft/hó.",
        },
      ],
    },
    "marketing-technologiai-cegeknek": {
      title: "B2B tech marketing, ami demókhoz vezet",
      subtitle: "SaaS vállalatok, IT-tanácsadók, tech startupok és software fejlesztők",
      metaTitle: "SaaS és tech B2B marketing — nemzetközi növekedés | G2A Marketing",
      metaDesc:
        "SaaS és tech cégek B2B marketingje: LinkedIn ABM, multilingual SEO, demoflow optimalizálás, AI-támogatott lead generálás. Magyar és nemzetközi piac.",
      heroDesc:
        "A tech szektorban a hosszú értékesítési ciklus és a nemzetközi piaci ambíció együttesen jelennek meg. Olyan stratégiát építünk, amely a magyar piac mellett angol és német nyelven is működik — egy LinkedIn-poszttól a multilingual SEO-ig egyetlen integrált rendszerben.",
      intro:
        "A B2B SaaS és tech cégeknél a marketing-eszközök eltolódnak a hagyományos hirdetéstől a kontent + thought leadership + ABM (Account-Based Marketing) irányba. Egy decision-maker átlagosan 14 ponton érinti a brandet, mielőtt demo-t igényel — ez azt jelenti, hogy a marketing-stratégia funnel nem lineáris, hanem többcsatornás érintési pontok hálózata.",
      challenges: [
        "Komplex műszaki termékek érthetővé tétele nem-tech döntéshozóknak (CFO, COO, ügyvezető)",
        "Hosszú értékesítési ciklus (3-12 hónap) végigkísérése — multi-touch attribúció szükséges",
        "Nemzetközi piacra lépés: fordítás nem elég, kulturálisan adaptált tartalom kell",
        "B2B leadgenerálás vs. brand awareness egyensúlyban tartása",
        "Versenytársak (köztük amerikai vállalatok 100M$+ marketing-büdzsével) elöli kiemelkedés",
        "Demo-funnel optimalizálás: a demo-t igénylő prospect 60-80%-a nem zár",
      ],
      solutions: [
        {
          title: "Account-Based Marketing (ABM)",
          desc: "Top 50-100 célvállalat egyenkénti targetálása LinkedIn + email + retargeting párhuzamos kampánnyal",
        },
        {
          title: "Multilingual SEO",
          desc: "Magyar + angol + német (vagy lengyel/cseh) párhuzamos SEO infrastruktúra hreflang-gel, lokalizált kulcsszavakkal",
        },
        {
          title: "Thought leadership tartalom",
          desc: "Iparági trend-cikkek, white paper, podcast, webinar — a CTO/CEO személyes nevén futtatva",
        },
        {
          title: "Marketing automatizáció + CRM",
          desc: "HubSpot/Salesforce + Marketo integráció, lead-scoring, multi-touch attribution",
        },
        {
          title: "Demo-funnel CRO",
          desc: "Demo-foglaló oldal A/B teszteléssel, in-app onboarding, no-show csökkentés automatikusan",
        },
        {
          title: "AI-alapú lead enrichment",
          desc: "Clearbit + Apollo + Cognism integráció — az érkező lead profilját automatikusan kiegészítjük döntéshozói szinttel és cégadatokkal",
        },
      ],
      results: [
        { num: "+5", label: "Új piac" },
        { num: "+280%", label: "Demo foglalás" },
        { num: "35+", label: "Tech projekt" },
      ],
      caseStudy: {
        client: "AR Works",
        problem: "Kiterjesztett valóság (AR/VR) megoldásokat fejlesztő tech cég — a high-tech jelleget és komplex technológiai kompetenciát vizuálisan + tartalmilag is közvetíteni kellett a B2B vásárlóknak.",
        solution: "WordPress weboldal egyedi HTML/CSS testreszabással — strukturált szolgáltatás- és referencia-bemutatás, tech-arculatú vizualitás, B2B-tech tone.",
        result: "Modern, tech-arculatú weboldal, B2B-tech vásárlókhoz illő hangvétel, strukturált portfólió.",
      },
      whyG2A:
        "35+ tech projektben dolgoztunk SaaS startupoktól middle-market IT-tanácsadókig. Tudjuk a hreflang implementációt CMS oldalán, a HubSpot multi-touch attribútum modellt, az Apollo-Cognism-Clearbit lead enrichment kombinációt, és azt is, hogy a magyar buyer-persona miben különbözik a német vagy lengyel ekvivalensétől. Belső AI-eszközeink (Claude, ChatGPT) gyorsítják a kontent-gyártást.",
      relatedServices: [
        {
          title: "AI marketing",
          desc: "AI-támogatott tartalomgyártás, lead enrichment, prediktív analitika",
          href: "/szolgaltatasok/ai-marketing",
        },
        {
          title: "Marketing automatizáció",
          desc: "HubSpot, Marketo, multi-touch attribution, lead-scoring",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "Lokalizáció és nemzetközi marketing",
          desc: "Multilingual SEO, kulturális adaptáció, EU-piaci belépés",
          href: "/szolgaltatasok/lokalizacio",
        },
      ],
      faqs: [
        {
          q: "Mennyi idő alatt látszik B2B SaaS marketingben az eredmény?",
          a: "Top-of-funnel metrikák (organikus forgalom, LinkedIn engagement) 2-3 hónap alatt mozognak. Demo-igénylések tipikusan 4-6 hónap után kezdenek nőni — ez a tartalomstratégia indexálódási idejétől és az ABM hideg-célzás meleg-célzássá konvertálásától függ. Tényleges revenue impact 9-15 hónap, mert ennyi az enterprise sales ciklus.",
        },
        {
          q: "Mely nyelvekre érdemes lokalizálni elsőként?",
          a: "Iparágtól függ, de magyar startupoknak jellemzően: 1. angol (globális elérés), 2. német (DACH régió), 3. lengyel + cseh (V4 piaca). Az ezeknek megfelelő SEO-stratégia kulcsszó-térképét pre-launch szakaszban átnézzük, és sokszor azt találjuk, hogy a lengyel piac volumene jobb mint a németé — kis verseny nagyobb lefedettséggel.",
        },
        {
          q: "Tudtok HubSpot-on belül lead-scoring-ot felállítani?",
          a: "Igen. Két szintű scoring: explicit (cég mérete, iparág, szerepkör) + implicit (oldalon töltött idő, email open, demo-page látogatás). A kettő szorzótáblája adja a lead-prioritást: hot lead 60+ pont, marketing-qualified 30-59, raw 0-29. Ehhez a HubSpot custom propertyket és workflow-t építünk a kliens értékesítési ciklusához.",
        },
        {
          q: "Mi az ABM stratégia gyakorlatban?",
          a: "Hármas párhuzam: (1) Sales kiválaszt 50-100 célcéget; (2) marketing minden cégre LinkedIn-en céges + döntéshozói targetinggel hirdet (3-6 érintés / hónap); (3) értékesítő közvetlen outbound kapcsolatfelvételt indít a felmelegedés után. Az ABM workflow-t HubSpot-ban modellezzük.",
        },
        {
          q: "Milyen büdzsé reális SaaS marketingre?",
          a: "Pre-product-market-fit szakaszú startupnak (10 fő alatt): havi 400-800 ezer Ft (mindössze SEO + tartalom + 1 csatornás ABM). Growth-szakaszú SaaS-nak (15-50 fő): 1.5-3M Ft/hó (full ABM + multilingual + marketing automation). Scale-up vagy enterprise SaaS-nak (50+ fő): 4-10M Ft/hó.",
        },
      ],
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "Önkormányzati marketing, ami lakossági részvételt hoz",
      subtitle: "Önkormányzatok, közintézmények, közösségi projektek és civil szervezetek számára",
      metaTitle: "Önkormányzati marketing — közösségi kommunikáció | G2A Marketing",
      metaDesc:
        "Akadálymentes közintézményi weboldalak, közösségi médiakampányok, transzparens tájékoztatás és lakossági bevonási projektek önkormányzatoknak.",
      heroDesc:
        "Az önkormányzati kommunikációban a transzparencia, a közösségi bevonás és a generációkhoz szabott tartalom a kulcs. Olyan rendszereket építünk, amelyek mindenki számára elérhetőek — akadálymentesen és anyanyelvi minőségben kínai turistától magyar nyugdíjasig.",
      intro:
        "A magyar önkormányzati kommunikáció jellemzően a köztisztviselő által írt sajtóközlemény + Facebook poszt minimumra korlátozódik. A modern lakossági elvárás viszont mobilbarát weboldal, gyors válaszadás Messenger-en, akadálymentesített tartalom és többgenerációs ranges. A 2018. évi LXXV. tv. (Akadálymentesítés) emellett 2025-től minden közszférás digitális szolgáltatást WCAG 2.1 AA szintre kötelez.",
      challenges: [
        "WCAG 2.1 AA akadálymentesítési megfelelőség (vakok, gyengénlátók, mozgáskorlátozottak)",
        "Generációs különbségek áthidalása (idősek emailen, fiatalok TikTokon)",
        "Korlátozott marketing-büdzsé hatékony felhasználása — közbeszerzési szabályok korlátaival",
        "Krízis-kommunikáció (árvíz, közlekedés-zavar, közüzemi probléma) — pillanatok alatt minden csatornán",
        "Transzparencia és az adatvédelem közötti egyensúly (közérdekű adat vs. személyes adat)",
        "Pályázati és EU-finanszírozási projektek kommunikációja az előírt láthatósági követelményekkel",
      ],
      solutions: [
        {
          title: "Akadálymentes közintézményi weboldal",
          desc: "WCAG 2.1 AA, GDPR + Infotv. megfelelő, többnyelvű (magyar/angol/német), gyors keresőrendszerrel",
        },
        {
          title: "Közösségi média stratégia",
          desc: "Facebook (idősebb generáció), Instagram + TikTok (Y/Z generáció) — egységes hangnemmel, lokalizált tartalommal",
        },
        {
          title: "Krízis-kommunikációs sablonok",
          desc: "Előre előkészített kommunikációs kit-ek tipikus krízishelyzetekre — másodpercek alatt aktiválható",
        },
        {
          title: "Lakossági hírlevél",
          desc: "Heti/havi e-mail hírlevél eseményekről, közlekedés-változásokról, döntésekről — célzottan szegmentált",
        },
        {
          title: "EU-projekt láthatósági kommunikáció",
          desc: "Pályázati előírások betartásával készített kampányok, Európai Strukturális és Beruházási Alapok logóhasználat",
        },
        {
          title: "Lakossági visszajelzési rendszer",
          desc: "Online polgári panaszbejelentő, részvételi költségvetés szavazás, közösségi felmérések",
        },
      ],
      results: [
        { num: "+400%", label: "Közösségi elérés" },
        { num: "+250%", label: "Weboldal látogatók" },
        { num: "10+", label: "Önkormányzati projekt" },
      ],
      caseStudy: {
        client: "Zsolnay Örökségkezelő Nonprofit Kft.",
        problem: "Pécsi Zsolnay Negyed kulturális életét üzemeltető nonprofit — sok látogató Google-keresésen keresztül találja a programokat, ezért a SEO-teljesítmény közvetlenül hat a látogatószámra.",
        solution: "Részletes SEO audit (technikai + kulcsszó + tartalmi gap), priorizált javítási csomag, eszköz-javaslatok a csapat önálló folytatásához.",
        result: "Részletes SEO felmérés priorizált akciókkal, csapat önállóan folytatható optimalizálással.",
      },
      whyG2A:
        "10+ önkormányzati és közintézményi projekt mögöttünk — kistelepülésektől megyei jogú városokig. Ismerjük a Kbt. (közbeszerzés) szabályait, a 2018. évi LXXV. tv. (akadálymentesítés) követelményeit, és az EU-pályázati láthatósági előírásokat. Ügyvezetőnk, Győrfi Attila a Pécsi Tudományegyetem Közgazdaságtudományi Karán is oktat — közvetlen kapcsolatban a régió közigazgatásával.",
      relatedServices: [
        {
          title: "Webfejlesztés",
          desc: "Akadálymentes közintézményi weboldal, többnyelvű, biztonságos",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Közösségi média menedzsment",
          desc: "Lakossági kommunikáció, generációs targeting, krízis-kit",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "Tartalommarketing",
          desc: "Hírlevél rendszer, közérdekű cikkek, EU projekt PR",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "Mit jelent a WCAG 2.1 AA megfelelőség pontosan?",
          a: "Web Content Accessibility Guidelines: a vakok és gyengénlátók (képernyőolvasó kompatibilitás), mozgáskorlátozottak (csak billentyűzettel kezelhetőség), és kognitív akadályokkal élők (egyszerű szöveg, kontrasztos színek) számára is használható weboldal. AA = második legmagasabb szint, amit Magyarországon 2025-tőlj minden közszférás szolgáltatásnak teljesítenie kell.",
        },
        {
          q: "Tudtok közbeszerzési pályázatban segíteni?",
          a: "Igen — a Kbt. szerinti minőségi és ár-érzékeny ajánlatokat tudunk készíteni, részvételi szándéknyilatkozattól szakmai dokumentációig. A G2A jellemzően alvállalkozóként vagy konzorciumi taggal dolgozik nagyobb pályázatokon, közvetlenül kistelepülési vagy intézményi alapszolgáltatásban.",
        },
        {
          q: "Hogyan kezelhetjük a krízis-kommunikációt 24/7?",
          a: "Háromrétegű kit-et készítünk: (1) előre megírt sablonok 8-10 tipikus szituációra (árvíz, közüzemi kimaradás, közlekedési baleset, COVID-szerű egészségügyi krízis); (2) jóváhagyási flow-t definiálunk, hogy ki engedélyezi a kommunikáció kiküldését (polgármester, jegyző, kommunikációs felelős); (3) opcionálisan G2A on-call szolgáltatás is — havidíjas alapon, krízis esetén 30 percen belül kiküldjük az engedélyezett változatot.",
        },
        {
          q: "EU-pályázati láthatósági követelmények — mit jelent?",
          a: "Az európai uniós források felhasználásánál kötelező a kedvezményezett-jelzés (logó, szlogen, projekt-megjelölés), a sajtótájékoztató, a tematikus kommunikációs kampány. Az EU 2021-2027 Cohesion Policy láthatósági kézikönyve alapján dolgozunk — fix, ellenőrizhető templátokkal.",
        },
        {
          q: "Mi a tipikus önkormányzati marketing-büdzsé?",
          a: "Kistelepülésnek (5.000 lakos alatt): havi 100-200 ezer Ft (alapszolgáltatás, social media + hírlevél). Közepes (5-30 ezer lakos): 250-500 ezer Ft. Megyei jogú város: 800 ezer–2M Ft (krízis-csapat + EU PR + lakossági kapcsolat). Ezekhez gyakran EU-finanszírozott projekt is társul, amiben a marketing önálló soron szerepel.",
        },
      ],
    },
    "marketing-b2b-cegeknek": {
      title: "B2B marketing, ami minősített leadeket hoz",
      subtitle: "Vállalati ügyfeleket kiszolgáló cégek, ipari beszállítók, professzionális szolgáltatók",
      metaTitle: "B2B marketing — leadgenerálás, ABM, LinkedIn | G2A Marketing",
      metaDesc:
        "B2B leadgenerálás, Account-Based Marketing, LinkedIn stratégia, marketing automatizáció és sales-marketing alignment vállalati ügyfeleket kiszolgáló cégeknek.",
      heroDesc:
        "A B2B marketing nem véletlenszerű kreatív kampányokról szól — hanem mérhető pipeline-építésről. Olyan rendszert alkotunk, amelyben minden marketinges elköltött forint nyomon követhető a végső szerződéskötésig: LinkedIn érintéstől automatizált e-mail nurturing-on át a sales-handoff-ig.",
      intro:
        "A B2B vásárlási folyamat 67%-a online történik még az értékesítővel való első találkozás előtt — ez azt jelenti, hogy a marketing-osztály a sales-csapat mellett párhuzamos pipeline-építő egység, nem a sales kiszolgálója. A modern B2B-marketing fókusza ezért a marketing-qualified lead (MQL) → sales-qualified lead (SQL) → opportunity → won-deal funnel mérhetővé tétele és optimalizálása.",
      challenges: [
        "Döntéshozók elérése többszereplős vásárlási folyamatban (átlag 6-10 érintett a buying committee-ben)",
        "Hosszú értékesítési ciklus (3-12 hónap) végigkísérése multi-touch nurturing kampánnyal",
        "Lead-minőség: a mennyiség helyett a sales-handoff-ban valóban tárgyalóképes lead",
        "Account-Based Marketing operacionalizálása — sales-marketing valódi együttműködéssel",
        "Sales és marketing alignment: közös definíciók (MQL, SQL), közös KPI-ok, közös CRM",
        "ROI-mérés a teljes funnelben — multi-touch attribution szükséges",
      ],
      solutions: [
        {
          title: "LinkedIn ABM stratégia",
          desc: "50-150 célvállalat egyenkénti targetálása + döntéshozói LinkedIn Ads + retargeting + sales outbound timing",
        },
        {
          title: "Marketing automatizáció",
          desc: "HubSpot vagy Marketo workflow, lead-scoring, e-mail nurturing sorozatok funnel-szakaszok szerint",
        },
        {
          title: "B2B SEO + tartalom",
          desc: "Iparági kulcsszavak, in-depth blog cikkek, white paper, esettanulmány — a buyer journey minden szakaszára",
        },
        {
          title: "Sales enablement",
          desc: "Sales-csapatnak készített pitch deck-ek, kompetencia-anyagok, demo-script, ROI-kalkulátor",
        },
        {
          title: "Multi-touch attribution",
          desc: "HubSpot revenue attribution riport — melyik csatorna hány %-ban járult hozzá a tényleges szerződéshez",
        },
        {
          title: "Pipeline-velocity optimalizálás",
          desc: "A sales-cycle minden szakasza külön analizálva — hol akad el, hol lehet gyorsítani: deal-coaching alapján",
        },
      ],
      results: [
        { num: "+180%", label: "Qualified lead" },
        { num: "-40%", label: "Sales ciklus" },
        { num: "50+", label: "B2B projekt" },
      ],
      caseStudy: {
        client: "ÉMI-TÜV SÜD",
        problem: "Magyar építőipari és termékminősítési piac vezető szereplője — a B2B döntéshozók online keresik a tanúsítási szolgáltatásokat, SEO + hirdetéskezelés optimalizálás kellett.",
        solution: "SEO felmérés tanúsítási kulcsszavakra + hirdetéskezelési audit (Google Analytics + Search Console adatokra építve), mérési-alapú döntéstámogatás.",
        result: "Részletes SEO felmérés és PPC audit, kulcsszó-pozícionálás, mérési-alapú döntéstámogatás Analytics + Search Console-lal.",
      },
      whyG2A:
        "50+ B2B projekt — a középvállalati SaaS-tól az ipari beszállítókig. Ismerjük a HubSpot és Marketo tényleges funkcióit (nem csak a marketing demo-ját), tudjuk hogyan kell az ABM-et egy 6 fős sales-csapattal működtetni, és tapasztalatunk van magyar/német/lengyel B2B piacon. Az ügyvezetőnk, Győrfi Attila a Pécsi Tudományegyetem Közgazdaságtudományi Karán is oktat — közvetlen kontakt a hazai vállalati szektorral.",
      relatedServices: [
        {
          title: "Stratégiai marketing",
          desc: "B2B buyer journey, ABM stratégia, sales-marketing alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
        {
          title: "Marketing automatizáció",
          desc: "HubSpot/Marketo, lead-scoring, multi-touch attribution",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "Tartalommarketing",
          desc: "B2B blog, white paper, esettanulmány, thought leadership",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "Hogyan különbözik a B2B marketing a B2C marketingtől?",
          a: "B2B-ben hosszabb (3-12 hónap) értékesítési ciklus, több (átlag 6-10) résztvevő a vásárlási döntésben, magasabb deal-méret (5-200M Ft), és racionálisabb (nem érzelmi) döntés-mechanizmus. Ez egészen más metrikákat (pipeline value, customer acquisition cost / customer lifetime value arány) és más csatornákat (LinkedIn nem TikTok, e-mail nem Instagram) követel.",
        },
        {
          q: "Mi az ABM (Account-Based Marketing) gyakorlatban?",
          a: "Sales-csapat kiválaszt 50-150 célvállalatot. Marketing minden cégre LinkedIn-en céges + döntéshozói targetinggel hirdet (3-6 érintés / hónap). Sales értékesítő közvetlen kapcsolatfelvételt indít a felmelegedés után. A G2A HubSpot-ban modellezi a teljes ABM-flow-t — mérhető szakaszok minden cégre.",
        },
        {
          q: "Hogyan mérhető a B2B marketing ROI-ja?",
          a: "Multi-touch attribúció modellt használunk: minden marketing-érintés (organikus blog, LinkedIn poszt, e-mail open, demo-foglalás) ponttal hozzájárul a végső szerződéshez. HubSpot Revenue Attribution riport mutatja: a 100% deal-revenue hány %-a volt social, hány % SEO, hány % e-mail, stb. Ez lehetővé teszi, hogy a következő quarterben pontosan oda költsünk, ahol valódi visszatérés van.",
        },
        {
          q: "Milyen marketing-stack-et javasoltok B2B-nek?",
          a: "Tipikus middle-market konfiguráció: HubSpot (CRM + marketing automation + CMS) vagy Pipedrive + Marketo, ApolloIO/Cognism (lead-data), LinkedIn Sales Navigator, Lavender (e-mail írás-asszisztens), Calendly (időpontfoglalás), Slack (sales-marketing alignment). G2A maga is HubSpot Solution Partner — közvetlenül implementáljuk a teljes stack-et.",
        },
        {
          q: "Milyen büdzsé reális B2B marketingre?",
          a: "Pre-pipeline szakasz (10-20 fős cég): havi 400-800 ezer Ft (LinkedIn + tartalom + alapautomatizáció). Pipeline-építő szakasz (30-100 fős): 1.5-3M Ft/hó (full ABM + marketing automation + sales enablement). Scale-up vagy enterprise B2B (100+ fős): 4-10M Ft/hó. A leghatásosabb mutatószám: marketing-büdzsé / pipeline-érték arány — célunk minimum 1:8.",
        },
      ],
    },
  },
  en: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "Healthcare marketing that brings in patients",
      subtitle: "For clinics, private practitioners, dental practices and wellness providers",
      metaTitle: "Healthcare marketing for clinics and private practices | G2A Marketing",
      metaDesc:
        "GDPR compliance, online booking systems, local SEO and trust-building reputation management. Marketing solutions for clinics, private practitioners and wellness businesses.",
      heroDesc:
        "In healthcare you have to satisfy strict regulation and patient expectations at the same time. Our marketing services make your practice credible, easy to find and trust-inspiring — with measurable growth in online bookings.",
      intro:
        "Hungarian private healthcare has grown rapidly over the last five years: patients search on Google, decide based on reviews, and want to book online. The sector is governed by strict rules (GDPR, Hungary's ETT medical-ethics rules, the pharmaceutical-advertising ban) which make traditional ad strategies risky.",
      challenges: [
        "GDPR and patient-data handling — every marketing activity must respect data-protection law",
        "Online visibility — 80% of patients start on Google; without local SEO you are invisible",
        "Patient communication — easy booking, fast response on every channel",
        "Trust-building — positive Google reviews, professional visual presence",
        "Reputation management — handling negative reviews and crises",
        "Competing with hospitals and large private clinic chains as a small practice",
      ],
      solutions: [
        {
          title: "Conversion-optimised website",
          desc: "Fast, responsive, accessible — patient books an appointment in 3 clicks",
        },
        {
          title: "Online booking + CRM",
          desc: "Integration with practice-management software (BookYou, MedicalSoft), automatic reminders",
        },
        {
          title: "Healthcare content marketing",
          desc: "Educational articles, treatment explainers, FAQ videos — legally clean, ETT-compatible",
        },
        {
          title: "Local SEO and Google Ads",
          desc: "Optimised content and ads for searches like \"private dermatologist Budapest\" or \"dentist Pécs\"",
        },
        {
          title: "Reputation management",
          desc: "Proactive Google review collection, response templates, negative-review crisis plan",
        },
        {
          title: "GDPR-compliant analytics",
          desc: "Cookie-free measurement (Plausible), anonymous conversion tracking — privacy-first by default",
        },
      ],
      results: [
        { num: "+340%", label: "Organic traffic" },
        { num: "+180%", label: "Online bookings" },
        { num: "40+", label: "Healthcare projects" },
      ],
      caseStudy: {
        client: "Dent & Beauty",
        problem: "Dental and aesthetic clinic where most patients search for info on mobile — the old site wasn't mobile-friendly, appointment booking was cumbersome.",
        solution: "Mobile-friendly WordPress site with patient-focused information hierarchy: treatment portfolio, transparent pricing, 3-click booking flow.",
        result: "Structured treatment portfolio, transparent pricing, mobile-optimised booking flow.",
      },
      whyG2A:
        "We've worked on 40+ healthcare projects with Hungarian clinics and private practitioners. We know the SEO map of major specialisations (dentistry, dermatology, orthopaedics, private gynaecology), the APIs of practice-management software, and the practice of the Hungarian DPA. Every engagement starts with a 1-month pilot — if we don't deliver measurable results, you can leave without penalty.",
      relatedServices: [
        {
          title: "Search engine optimisation (SEO)",
          desc: "Local medical keywords, Google Business Profile optimisation",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "PPC & Google Ads",
          desc: "GDPR-compliant ads, patient-segment targeting",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Web development & CRO",
          desc: "Booking system integration, mobile-first patient experience",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "Which platforms do you work with for healthcare marketing?",
          a: "WordPress and WP-Booking, BookYou and MedicalSoft practice software, Google Business Profile, Meta (only for non-pharma/non-ETT content), Google Ads. For data: TiDB Cloud (EU region) and Plausible analytics for GDPR compliance.",
        },
        {
          q: "How do you ensure GDPR compliance?",
          a: "Cookie-free baseline analytics (Plausible), explicit logged consent. We never handle raw patient data — only aggregated traffic and conversion metrics. Every ad creative is reviewed for medical-ethics compliance before launch.",
        },
        {
          q: "Can you help with negative Google reviews?",
          a: "Yes. Two-tier reputation strategy: (1) proactive — systematic collection of positive reviews from satisfied patients via automated email invitation; (2) reactive — crisis-response templates and policy-compliant management of complaints in line with Google's review guidelines.",
        },
        {
          q: "How long until SEO delivers results in healthcare?",
          a: "Local searches (\"dentist [city]\") typically 2–4 months; nationwide keywords (\"implant prices\") 6–9 months. Google Ads delivers measurable patient enquiries in 1–2 weeks — we usually run both in parallel.",
        },
        {
          q: "What budget should I expect?",
          a: "Solo practitioners HUF 250–600k/month (audit + campaigns + content combined); clinics HUF 600k–1.2M/month. Ad spend is on top — we recommend at least HUF 200k/month on Google Ads to reach economies of scale.",
        },
      ],
    },
    "marketing-szepsegipari-cegeknek": {
      title: "Beauty marketing that drives bookings",
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
        client: "GRB Skin Clinic",
        problem: "Premium dermatology clinic whose clients expect discretion and credibility — fragmented digital presence (separate agencies for Ads, SEO, website).",
        solution: "Full digital presence under one roof: Google Ads + SEO + WordPress site + creative copywriting — medical-grade accuracy with client-friendly tone.",
        result: "Consistent quality across the entire digital footprint with a single partner, continuous Google Ads + SEO engagement.",
      },
      intro:
        "In the beauty industry buyers research primarily on Instagram, TikTok and Google Maps — not on the website. The site only enters the journey when the booking flow starts. This shifts the marketing budget allocation: 60% social, 30% local SEO + Google Business Profile, 10% paid search.",
      whyG2A:
        "With 25+ beauty industry projects we know the cadence of the sector: 70% of bookings arrive Tue–Fri 6–10pm; we cut a client's no-show rate from 40% to 12% with countdown email + SMS automation. We can spin up a Reels content calendar from cold, generate creatives with Canva + AI tools, and optimise the Booksy/Salonkee booking funnel for conversion.",
      relatedServices: [
        {
          title: "Social media management",
          desc: "Instagram and TikTok strategy and content production",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "PPC & Ad management",
          desc: "Meta Ads, TikTok Ads, local targeting",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Brand design",
          desc: "Consistent visual identity across all platforms",
          href: "/szolgaltatasok/arculattervezes",
        },
      ],
      faqs: [
        {
          q: "What does a weekly content calendar look like for a beauty salon?",
          a: "Typically 4–5 Instagram posts + 7–10 Stories + 2–3 Reels + 1 TikTok per week. Topic mix: 30% before-after work, 25% expert tips, 20% behind-the-scenes team, 15% promotions/booking CTAs, 10% UGC (guest content).",
        },
        {
          q: "Can you manage influencer partnerships?",
          a: "Yes. Depending on context, micro-influencers (5–50k followers) on a gift-for-content basis, or mid-tier (50–200k) for paid collaborations. G2A handles the brief, content review and disclosure-compliance check before publishing.",
        },
        {
          q: "Which booking system do you recommend?",
          a: "Booksy and Salonkee are the two most popular in Hungary. Booksy = stronger marketplace, free plan + transaction fee. Salonkee = better multi-staff salon CRM features. For custom websites, WP-Booking + Stripe is the most flexible combo.",
        },
        {
          q: "How do we handle no-shows?",
          a: "Three-layer automation: confirmation email within 1 hour of booking; SMS reminder 24 hours before; push or SMS \"confirm you're coming\" 2 hours before. This dropped one client's no-show rate from 40% to 12%.",
        },
        {
          q: "What does monthly beauty marketing cost?",
          a: "Solo cosmetologist HUF 80–150k (social + local SEO); 2–3 staff salon HUF 250–450k (the above + Meta Ads). Ad spend is on top — minimum HUF 100k/month Meta Ads recommended.",
        },
      ],
    },
    "marketing-mernoki-irodaknak": {
      title: "Engineering marketing that wins commissions",
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
        client: "M Mérnöki Iroda Kft.",
        problem: "Engineering office with 30 years of expertise but a non-mobile-friendly site and only occasional social posts — the prestige didn't show online.",
        solution: "New UI/UX in Figma + mobile-friendly site (Bootstrap, HTML, CSS) + Facebook/Instagram/LinkedIn presence with a single brand visual identity.",
        result: "Modern, mobile-friendly site, active presence across three social platforms, consistent visual identity end-to-end.",
      },
      intro:
        "The Hungarian engineering and design-studio sector is typically under-represented online: portfolio sites are dated, LinkedIn presence is patchy, and technical content is written in jargon rather than from a buyer-benefit angle. That's an opportunity: whoever fixes it stands out quickly even on a small market like Southern Transdanubia.",
      whyG2A:
        "30+ engineering and construction projects with Hungarian studios. We can turn a BIM model into a web-grade render via partner studios, transform a public-procurement tender into prose, and build LinkedIn thought-leadership content that resonates with non-engineering decision makers (developers, investors, public bodies). We know the Hungarian Public Procurement Authority's system and the most common tender types.",
      relatedServices: [
        {
          title: "Search engine optimisation",
          desc: "Technical keyword research, technical SEO, B2B content structure",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "Web development",
          desc: "Portfolio system, quote request, project archive",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Strategic marketing",
          desc: "B2B buyer journey, ABM strategy, sales-marketing alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "How long until B2B lead generation delivers results?",
          a: "Realistically 4–6 months for measurable pipeline growth. The B2B engineering sales cycle is typically 3–12 months, so SEO + LinkedIn investments today translate into actual contracts in 9–15 months. Leading indicators (CTR, contact requests, demo requests) move within 2 months.",
        },
        {
          q: "Can you produce 3D renders or visualisations?",
          a: "We don't render in-house but partner with studios that deliver portfolio-grade images from BIM models or CAD files. We handle the integration and curation into the website gallery.",
        },
        {
          q: "How do you make technical content accessible?",
          a: "Two-tier content strategy: (1) deep-dive technical articles for fellow professionals and technical decision makers; (2) ROI- and business-focused summaries for investors and public-sector buyers. G2A copywriters and editors work in both registers.",
        },
        {
          q: "What's a typical engineering-firm marketing budget?",
          a: "Small studio (3–8 staff) HUF 200–400k/month (SEO + content + LinkedIn). Medium (15–50 staff) HUF 500–900k (the above + ABM + thought leadership management). LinkedIn ad spend is typically modest at HUF 100–200k/month.",
        },
        {
          q: "Can you help with public-procurement tender PR?",
          a: "Yes. We turn an awarded tender into a press release, distribute it to local and trade media, then convert it into LinkedIn posts and a website case study. This effectively communicates 5–10x the value of an awarded tender to the market.",
        },
      ],
    },
    "marketing-autoipari-cegeknek": {
      title: "Automotive marketing that converts test drives",
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
        client: "Nissan Ste-Ba",
        problem: "Pécs-based Nissan dealership needs continuous seasonal campaigns (models, promos, service) — measurable, brand-consistent Facebook ads.",
        solution: "Seasonal marketing strategy + continuous Facebook Ads campaigns, custom graphics rotated bi-weekly with sales-focused copy in the Nissan brand voice.",
        result: "Continuous Facebook Ads presence with targeted campaigns, sales-focused copy reaching regional buyers.",
      },
      intro:
        "The Hungarian automotive market splits into two halves: used-car retail (shorter decision cycle, price-sensitive buyer) and new-car / premium retail (longer cycle, brand- and service-experience-sensitive). The marketing strategy has to cleanly separate the two — what works for one is often counter-productive for the other.",
      whyG2A:
        "20+ automotive projects with dealerships and authorised service centres. We know how to ship Shopping feeds (TecDoc, Mobile.de sync), how to separate test-drive conversions from price-enquiry conversions in Performance Max, and the lead-scoring tricks for HubSpot/Pipedrive in an automotive context.",
      relatedServices: [
        {
          title: "PPC & Google Ads",
          desc: "Performance Max, Shopping feed, retargeting campaigns",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "Web development & CRO",
          desc: "Test-drive booking, finance calculator landing pages",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Strategic marketing",
          desc: "Lead-scoring, sales-marketing pipeline alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "What Google Ads budget is realistic for a car dealer?",
          a: "Single-location used car dealer: minimum HUF 300–500k/month. Authorised dealer: HUF 800k–2M/month. Cost depends heavily on territory and inventory: premium-brand keywords (BMW, Mercedes) CPC HUF 1,200–1,800, used-car CPC HUF 400–800.",
        },
        {
          q: "How do you handle automotive Shopping feeds in Google Ads?",
          a: "We build a custom Shopping feed from your CRM/DMS (TecDoc, Mobile.de, Carzone), synced daily. Each car carries price, mileage, year, fuel, engine and high-quality photos. Buyers see the actual car directly when clicking the ad.",
        },
        {
          q: "How do you qualify test-drive enquiries?",
          a: "Three layers: (1) automatic pre-screening on the booking form (financing type, model interest, purchase timeframe); (2) HubSpot or Pipedrive lead-scoring on intent signals; (3) hot lead reaches the salesperson within 60 minutes, warm by next business day.",
        },
        {
          q: "Can you integrate a finance calculator on the website?",
          a: "Yes — Cofidis, Cetelem and OTP Lízing API integrations, or simple calculator widgets. We work with your finance partner's data and the website conversion flow.",
        },
        {
          q: "How can we measure the impact of marketing on actual sales?",
          a: "Online lead → showroom visit → sale conversion chain in CRM — for this we push the Google Click ID (GCLID) and Meta Click ID (FBCLID) into the CRM lead record, so you can attribute back which campaign produced which actual car sale. We build this into the HubSpot/Pipedrive integration.",
        },
      ],
    },
    "marketing-ugyvedi-irodaknak": {
      title: "Legal marketing that attracts clients",
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
        client: "Proverium Ügyvédi Iroda",
        problem: "Complex legal services for corporate and private clients — needed an online presence that conveys authority without feeling cold, in one of the most competitive online markets.",
        solution: "WordPress website with a modern design fitting legal-sector prestige + SEO optimisation on legal keywords + consistent visual templates across all communication.",
        result: "Authoritative website for the legal sector, keyword-optimised SEO structure, consistent brand experience across every touchpoint.",
      },
      intro:
        "Hungarian legal marketing is governed by the Hungarian Bar Association's (MÜK) ethics code and Act LXXVIII of 2017 — comparative, boastful or misleading advertising is prohibited. This isn't a barrier but a direction: communicate professional depth and trustworthy advisory character well, and you quickly win trust against an over-promising competitor.",
      whyG2A:
        "15+ legal projects with law firms and accountancy-legal advisory practices. We know the Hungarian Bar's 6/2018 (III. 26.) advertising regulation, which Google Ads categories are allowed and which aren't, and how to produce anonymised case studies without breaching client confidentiality.",
      relatedServices: [
        {
          title: "Brand design",
          desc: "Premium visual identity, firm communication materials",
          href: "/szolgaltatasok/arculattervezes",
        },
        {
          title: "Search engine optimisation",
          desc: "Practice-area keywords, local SEO, FAQ content",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "Web development",
          desc: "Consultation booking, secure client portal integration",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "Does the Hungarian Bar (MÜK) allow online ads and content marketing?",
          a: "Yes. The 6/2018 (III. 26.) MÜK regulation permits objective, professional, informational advertising. Comparative, exaggerated, or client-poaching content is forbidden — like \"the best lawyer in town\" or \"guaranteed success\". G2A creates all content within these rules.",
        },
        {
          q: "Can you publish client testimonials?",
          a: "Only with the client's express written consent — and even then, describing the activity rather than the case details. The alternative is anonymised case studies: \"X medium-sized industrial company, M&A transaction, 9-month due diligence, successful close\" — without names or industry specifics.",
        },
        {
          q: "Which Google Ads categories are allowed for lawyers?",
          a: "General legal counsel, family law, civil law, real estate law, employment law, business law — all permitted. NOT permitted: success-fee campaigns (\"no win = no fee\"), parts of criminal law (e.g. \"drug lawyer\"), country-specific immigration targeting. G2A reviews every campaign for legal compliance during audit.",
        },
        {
          q: "How do you ensure GDPR compliance in online consultations?",
          a: "Tresorit encrypted document delivery, JotForm GDPR-compliant forms (EU data centre), explicit logged consent. The technical side of the lawyer-client privilege is enforced with end-to-end encryption.",
        },
        {
          q: "What budget do we start with?",
          a: "Solo or small firm (under 3 lawyers): HUF 200–400k/month (base services: SEO + content + LinkedIn). Medium (5–15 lawyers): HUF 500–900k/month (the above + Google Ads + brand communication). Ad spend typically HUF 100–300k/month.",
        },
      ],
    },
    "marketing-technologiai-cegeknek": {
      title: "B2B tech marketing that books demos",
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
        client: "AR Works",
        problem: "Augmented-reality (AR/VR) solutions company — needed to convey high-tech character and complex technological competence both visually and editorially for B2B buyers.",
        solution: "WordPress site with custom HTML/CSS — structured service and reference showcase, tech-grade visual identity, B2B-tech tone of voice.",
        result: "Modern, tech-grade website, voice matching B2B-tech buyers, structured portfolio.",
      },
      intro:
        "In B2B SaaS and tech, marketing tools shift from traditional advertising to content + thought leadership + ABM (Account-Based Marketing). A decision maker touches the brand at an average of 14 points before requesting a demo — meaning the marketing funnel is non-linear, a network of multi-channel touchpoints.",
      whyG2A:
        "35+ tech projects from SaaS startups to mid-market IT consultancies. We know hreflang implementation on the CMS side, the HubSpot multi-touch attribution model, the Apollo–Cognism–Clearbit lead enrichment combo, and how the Hungarian buyer persona differs from German or Polish equivalents. Our internal AI tools (Claude, ChatGPT) accelerate content production.",
      relatedServices: [
        {
          title: "AI marketing",
          desc: "AI-assisted content production, lead enrichment, predictive analytics",
          href: "/szolgaltatasok/ai-marketing",
        },
        {
          title: "Marketing automation",
          desc: "HubSpot, Marketo, multi-touch attribution, lead scoring",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "Localisation & international marketing",
          desc: "Multilingual SEO, cultural adaptation, EU market entry",
          href: "/szolgaltatasok/lokalizacio",
        },
      ],
      faqs: [
        {
          q: "How long until B2B SaaS marketing delivers results?",
          a: "Top-of-funnel metrics (organic traffic, LinkedIn engagement) move in 2–3 months. Demo requests typically grow from month 4–6 — depending on content indexing time and ABM cold-to-warm conversion. Actual revenue impact is 9–15 months because that's the enterprise sales cycle.",
        },
        {
          q: "Which languages should we localise to first?",
          a: "Industry-dependent, but for Hungarian startups typically: 1. English (global reach), 2. German (DACH region), 3. Polish + Czech (V4 markets). We map keyword volumes pre-launch and often find Polish has more volume than German with less competition — a better foothold.",
        },
        {
          q: "Can you build lead-scoring inside HubSpot?",
          a: "Yes. Two layers: explicit (company size, industry, role) + implicit (time on site, email open, demo-page visits). The product gives lead priority: hot lead 60+ points, marketing-qualified 30–59, raw 0–29. We build custom HubSpot properties and workflows for the client's sales cycle.",
        },
        {
          q: "What does ABM look like in practice?",
          a: "Three parallel tracks: (1) Sales picks 50–100 target accounts; (2) marketing runs LinkedIn account + decision-maker targeting (3–6 touches/month); (3) sales rep starts direct outbound after warming up. We model the entire ABM workflow in HubSpot.",
        },
        {
          q: "What's a realistic SaaS marketing budget?",
          a: "Pre-product-market-fit startup (under 10 staff): HUF 400–800k/month (only SEO + content + 1-channel ABM). Growth-stage SaaS (15–50 staff): HUF 1.5–3M/month (full ABM + multilingual + marketing automation). Scale-up or enterprise SaaS (50+): HUF 4–10M/month.",
        },
      ],
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "Public-sector marketing that drives engagement",
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
        client: "Zsolnay Örökségkezelő Nonprofit Kft.",
        problem: "Nonprofit running the cultural life of Pécs's Zsolnay Quarter — many visitors find programmes via Google search, so SEO performance directly drives footfall.",
        solution: "Detailed SEO audit (technical + keyword + content gap), prioritised improvement package, tool recommendations for the in-house team to continue independently.",
        result: "Detailed SEO audit with prioritised actions, self-sustaining optimisation workflow for the team.",
      },
      intro:
        "Hungarian municipal communication typically defaults to a clerk-written press release plus a Facebook post — but residents expect a mobile-friendly website, fast Messenger replies, accessible content and multi-generational reach. From 2025, Hungary's Act LXXV of 2018 mandates WCAG 2.1 AA compliance for every public-sector digital service.",
      whyG2A:
        "10+ municipal and public-institution projects — from villages to county-seat cities. We know the Hungarian Public Procurement Act (Kbt.), the 2018 LXXV. tv. accessibility requirements, and EU project visibility rules. Our managing director Attila Győrfi also lectures at the University of Pécs Faculty of Economics — direct connection to the regional public administration.",
      relatedServices: [
        {
          title: "Web development",
          desc: "Accessible public-sector website, multilingual, secure",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "Social media management",
          desc: "Resident communication, generational targeting, crisis kit",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "Content marketing",
          desc: "Newsletter system, public-interest articles, EU project PR",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "What does WCAG 2.1 AA compliance mean exactly?",
          a: "Web Content Accessibility Guidelines: usable for blind and visually impaired (screen-reader compatible), motor-impaired (keyboard-only operable) and cognitively impaired (simple text, contrasting colours) users. AA = second-highest level, mandatory in Hungary from 2025 for every public-sector service.",
        },
        {
          q: "Can you help with public procurement?",
          a: "Yes — we can prepare quality- and price-sensitive bids per the Hungarian Public Procurement Act, from intent statements to technical documentation. G2A typically works as a subcontractor or consortium member on larger tenders, directly on smaller municipal/institutional service contracts.",
        },
        {
          q: "How can we handle 24/7 crisis communication?",
          a: "Three-layer kit: (1) pre-written templates for 8–10 typical scenarios (flood, utility outage, traffic incident, COVID-style health crisis); (2) a defined approval flow (mayor, clerk, comms officer); (3) optional G2A on-call service — monthly retainer, 30-minute response on crisis trigger.",
        },
        {
          q: "EU project visibility — what does that mean?",
          a: "Mandatory for EU-funded projects: beneficiary marking (logo, slogan, project ID), press release, themed communication. We work to the EU 2021–2027 Cohesion Policy visibility handbook — fixed, audit-friendly templates.",
        },
        {
          q: "What's a typical municipal marketing budget?",
          a: "Small village (under 5,000 residents): HUF 100–200k/month (basic services, social media + newsletter). Medium town (5–30k residents): HUF 250–500k/month. County-seat city: HUF 800k–2M/month (crisis team + EU PR + resident relations). EU-funded projects often have marketing as a separate line item.",
        },
      ],
    },
    "marketing-b2b-cegeknek": {
      title: "B2B marketing that delivers qualified leads",
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
        client: "ÉMI-TÜV SÜD",
        problem: "Leader of the Hungarian construction and product certification market — B2B decision-makers search online for certification services, so SEO + ad management optimisation was needed.",
        solution: "SEO audit on certification keywords + ad-management audit (built on Google Analytics + Search Console data), measurement-based decision support.",
        result: "Detailed SEO audit and PPC audit, keyword positioning, measurement-based decision support with Analytics + Search Console.",
      },
      intro:
        "67% of the B2B buying journey happens online before the first sales touch — meaning marketing operates as a parallel pipeline-building unit, not a sales support function. Modern B2B marketing focuses on making the marketing-qualified lead (MQL) → sales-qualified lead (SQL) → opportunity → won-deal funnel measurable and optimisable.",
      whyG2A:
        "50+ B2B projects, from mid-market SaaS to industrial suppliers. We know the actual capabilities of HubSpot and Marketo (not just their marketing demos), how to operate ABM with a 6-person sales team, and we have experience in the Hungarian/German/Polish B2B markets. Our managing director Attila Győrfi also lectures at the University of Pécs Faculty of Economics — direct contact with the domestic enterprise sector.",
      relatedServices: [
        {
          title: "Strategic marketing",
          desc: "B2B buyer journey, ABM strategy, sales-marketing alignment",
          href: "/szolgaltatasok/strategiai-marketing",
        },
        {
          title: "Marketing automation",
          desc: "HubSpot/Marketo, lead-scoring, multi-touch attribution",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "Content marketing",
          desc: "B2B blog, white papers, case studies, thought leadership",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "How does B2B marketing differ from B2C?",
          a: "B2B has a longer (3–12 months) sales cycle, more (avg 6–10) participants in the buying decision, higher deal sizes (HUF 5–200M), and a more rational (less emotional) decision mechanism. This calls for different metrics (pipeline value, customer acquisition cost / lifetime value ratio) and different channels (LinkedIn not TikTok, email not Instagram).",
        },
        {
          q: "What does Account-Based Marketing (ABM) look like in practice?",
          a: "Sales picks 50–150 target accounts. Marketing runs LinkedIn ads with company + decision-maker targeting (3–6 touches/month). Sales reps start direct outbound after warm-up. G2A models the entire ABM flow in HubSpot — measurable stages for every account.",
        },
        {
          q: "How do you measure B2B marketing ROI?",
          a: "Multi-touch attribution: every marketing touch (organic blog, LinkedIn post, email open, demo booking) contributes proportionally to the final contract. The HubSpot Revenue Attribution report shows what % of total revenue came from social, SEO, email, etc. — so the next quarter's spend can target where actual returns are.",
        },
        {
          q: "What marketing stack do you recommend for B2B?",
          a: "Typical mid-market: HubSpot (CRM + marketing automation + CMS) or Pipedrive + Marketo, Apollo/Cognism (lead data), LinkedIn Sales Navigator, Lavender (email-writing assistant), Calendly (booking), Slack (sales-marketing alignment). G2A is also a HubSpot Solution Partner — we directly implement the full stack.",
        },
        {
          q: "What budget is realistic for B2B marketing?",
          a: "Pre-pipeline stage (10–20 staff): HUF 400–800k/month (LinkedIn + content + basic automation). Pipeline-building (30–100 staff): HUF 1.5–3M/month (full ABM + marketing automation + sales enablement). Scale-up or enterprise (100+): HUF 4–10M/month. Best metric: marketing budget / pipeline value — target at minimum 1:8.",
        },
      ],
    },
  },
  zh: {
    "marketing-egeszsegugyi-cegeknek": {
      title: "为诊所与私人医生带来患者的医疗营销",
      subtitle: "为诊所、私人医生、牙科诊所与健康养生机构服务",
      metaTitle: "面向诊所与私人医生的医疗营销 | G2A Marketing",
      metaDesc:
        "GDPR 合规、在线预约系统、本地 SEO 与建立信任的声誉管理。为诊所、私人医生与健康养生企业提供营销方案。",
      heroDesc:
        "医疗行业需要同时满足严格的法规和患者期望。我们的营销服务让您的诊所专业可信、便于查找,在线预约可量化增长。",
      intro:
        "过去五年匈牙利私人医疗快速增长:患者在 Google 上搜索、依据评价做决定、希望在线预约。同时该行业受严格监管约束(GDPR、匈牙利 ETT 医疗伦理规则、药品广告禁令),传统广告策略风险较高。",
      challenges: [
        "GDPR 与患者数据处理 —— 每项营销活动都必须遵守数据保护法",
        "在线可见性 —— 80% 的患者从 Google 开始查找,无本地 SEO 即不可见",
        "患者沟通 —— 易用预约系统与各渠道的快速响应",
        "信任建立 —— 正面 Google 评价、专业视觉形象",
        "声誉管理 —— 处理负面评价与危机",
        "作为小型诊所与医院和大型连锁竞争",
      ],
      solutions: [
        {
          title: "转化优化网站",
          desc: "快速、响应式、无障碍 —— 患者 3 次点击完成预约",
        },
        {
          title: "在线预约 + CRM",
          desc: "与诊所管理软件(BookYou、MedicalSoft)集成,自动提醒",
        },
        {
          title: "医疗内容营销",
          desc: "教育文章、治疗说明、FAQ 视频 —— 法律清洁、符合 ETT 规则",
        },
        {
          title: "本地 SEO 与 Google Ads",
          desc: "针对「私人皮肤科 布达佩斯」「牙医 佩奇」等搜索优化的内容与广告",
        },
        {
          title: "声誉管理",
          desc: "主动收集 Google 评价、回复模板、负面评价危机预案",
        },
        {
          title: "GDPR 合规分析",
          desc: "无 Cookie 测量(Plausible)、匿名转化追踪 —— 默认隐私优先",
        },
      ],
      results: [
        { num: "+340%", label: "自然流量" },
        { num: "+180%", label: "在线预约" },
        { num: "40+", label: "医疗项目" },
      ],
      caseStudy: {
        client: "Dent & Beauty",
        problem: "牙科及美容诊所，大部分患者通过手机查询信息——旧网站不适配移动端，预约流程繁琐。",
        solution: "移动端友好的 WordPress 网站，以患者为中心的信息层次：治疗组合、透明定价、3 次点击完成预约。",
        result: "结构化的治疗组合，透明定价，移动端优化的预约流程。",
      },
      whyG2A:
        "我们与匈牙利诊所与私人医生合作完成 40+ 医疗项目。我们了解主要专科(牙科、皮肤科、骨科、私人妇科)的 SEO 地图、诊所管理软件 API、以及匈牙利数据保护机构的实务。每个项目都从 1 个月试点开始 —— 若未交付可量化成果,您可无违约金离开。",
      relatedServices: [
        {
          title: "搜索引擎优化 (SEO)",
          desc: "本地医疗关键词、Google 商家资料优化",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "PPC 与 Google Ads",
          desc: "GDPR 合规广告、患者群体细分",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "网站开发与 CRO",
          desc: "预约系统集成、移动优先患者体验",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "你们使用哪些医疗营销平台?",
          a: "WordPress 与 WP-Booking、BookYou、MedicalSoft 诊所软件、Google 商家资料、Meta(仅非药物/非 ETT 内容)、Google Ads。数据方面:TiDB Cloud(欧盟区域)与 Plausible 分析以满足 GDPR 合规。",
        },
        {
          q: "如何确保 GDPR 合规?",
          a: "无 Cookie 基础分析(Plausible)、明确日志化的同意。我们不直接处理患者数据 —— 仅汇总流量与转化指标。每个广告创意在发布前都进行医疗伦理合规审核。",
        },
        {
          q: "能否帮助处理负面 Google 评价?",
          a: "可以。两层声誉策略:(1) 主动 —— 通过自动邮件邀请,系统化收集满意患者的正面评价;(2) 被动 —— 危机回复模板、按 Google 评价政策合规处理投诉。",
        },
        {
          q: "医疗 SEO 多久见效?",
          a: "本地搜索(「牙医 [城市]」)通常 2–4 个月;全国关键词(「种植牙价格」)6–9 个月。Google Ads 1–2 周内可带来可量化的患者咨询 —— 我们通常并行运行两者。",
        },
        {
          q: "应预算多少?",
          a: "独立医生每月 25–60 万福林(审计 + 营销活动 + 内容综合);诊所每月 60 万–120 万福林。广告费另计 —— 建议 Google Ads 至少每月 20 万福林以达到规模效益。",
        },
      ],
    },
    "marketing-szepsegipari-cegeknek": {
      title: "为美容沙龙与品牌带来预约的美业营销",
      subtitle: "为美容沙龙、美容师、美发与健康养生企业服务",
      metaTitle: "美容行业营销 — Instagram、Meta 广告与预约 | G2A Marketing",
      metaDesc:
        "美容沙龙、美发店与化妆品店的视觉品牌建设、Instagram 与 TikTok 战略、Meta 广告活动、在线预约系统。",
      heroDesc:
        "美容行业的视觉内容与社交媒体直接驱动购买决策。我们打造既具视觉冲击又能严肃量化转化的策略 —— 让 Instagram 粉丝转化为预约客户。",
      intro:
        "美容行业的客户主要在 Instagram、TikTok 与 Google 地图上调研,而非网站。网站只在预约流程开始时介入决策。这意味着营销资源分配不同于其他服务行业:60% 社媒、30% 本地 SEO + Google 商家资料、10% 付费搜索。",
      challenges: [
        "持续视觉内容生产(前后照片、Reels、幕后花絮)",
        "Instagram 与 TikTok 算法优化 —— 自然触达是最关键指标",
        "缩短预约流程:最少点击数完成下单",
        "季节性活动(婚礼、节日、夏日身材)的快速创意迭代",
        "在不打价格战的情况下与本地竞争对手区分 —— 通过独特体验/专业化",
        "建立忠诚度 —— 客户终身价值是新客获取的 3 倍",
      ],
      solutions: [
        {
          title: "Instagram 与 TikTok 战略",
          desc: "每周内容日历、Reels 配方、Hashtag 研究、Story 转化流程",
        },
        {
          title: "Meta 广告 + TikTok 广告",
          desc: "基于人口统计 + 行为定位、相似受众、过去 30 天网站访客再营销",
        },
        {
          title: "在线预约网站",
          desc: "Booksy、Salonkee 或定制 WP 预约系统集成 —— 移动端友好、快速",
        },
        {
          title: "网红营销",
          desc: "本地市场的微(5-50K 粉丝)与纳米网红 —— 礼品换内容与付费合作",
        },
        {
          title: "本地 SEO",
          desc: "Google 商家资料优化、「[城市] 美容师」类关键词、照片与评价管理",
        },
        {
          title: "忠诚度与邮件营销",
          desc: "回头客计划、生日自动化、季节性优惠定时发送",
        },
      ],
      results: [
        { num: "+520%", label: "Instagram 粉丝" },
        { num: "+190%", label: "在线预约" },
        { num: "25+", label: "美容行业项目" },
      ],
      caseStudy: {
        client: "GRB Skin Clinic",
        problem: "高端皮肤科诊所，客户期望谨慎、可信度——数字化布局分散（Ads、SEO、网站分属不同代理）。",
        solution: "一站式数字化布局：Google Ads + SEO + WordPress 网站 + 创意文案——医疗级准确性与客户友好语气兼具。",
        result: "由单一合作伙伴提供质量一致的数字化布局，持续的 Google Ads + SEO 合作。",
      },
      whyG2A:
        "凭借 25+ 美容行业项目,我们了解行业的特殊节奏:70% 的预约在周二至周五 18-22 点之间到达;通过倒计时邮件 + 短信自动化,我们将某客户的失约率从 40% 降至 12%。我们能从零搭建 Reels 日历、用 Canva + AI 工具生成创意,并优化 Booksy/Salonkee 预约漏斗的转化。",
      relatedServices: [
        {
          title: "社交媒体管理",
          desc: "Instagram、TikTok 战略与内容生产",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "PPC 与广告管理",
          desc: "Meta 广告、TikTok 广告、本地定位",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "品牌视觉设计",
          desc: "跨平台一致的视觉身份",
          href: "/szolgaltatasok/arculattervezes",
        },
      ],
      faqs: [
        {
          q: "美容沙龙的每周内容日历是怎样的?",
          a: "通常每周 4-5 条 Instagram 帖子 + 7-10 个 Story + 2-3 个 Reel + 1 个 TikTok。主题分布:30% 前后对比作品、25% 专家提示、20% 团队幕后、15% 活动/预约 CTA、10% UGC(客户内容)。",
        },
        {
          q: "能管理网红合作吗?",
          a: "可以。根据情况,微网红(5-50K 粉丝)采用礼品换内容,中型(50-200K)采用付费合作。G2A 负责简报、内容审查与发布前的披露合规性检查。",
        },
        {
          q: "推荐哪种预约系统?",
          a: "在匈牙利 Booksy 和 Salonkee 最受欢迎。Booksy = 更强的市场曝光,免费方案 + 交易费;Salonkee = 多员工沙龙的 CRM 功能更佳。如果搭建定制网站,WP-Booking + Stripe 组合最灵活。",
        },
        {
          q: "如何处理失约问题?",
          a: "三层自动化:预约后 1 小时内的确认邮件;提前 24 小时短信提醒;预约前 2 小时推送/短信「确认前来」按钮。这将某客户的失约率从 40% 降至 12%。",
        },
        {
          q: "美容营销每月费用多少?",
          a: "单人化妆师每月 8-15 万福林(社媒 + 本地 SEO);2-3 人沙龙每月 25-45 万福林(以上 + Meta 广告)。广告费另计 —— 建议 Meta 每月最少 10 万福林。",
        },
      ],
    },
    "marketing-mernoki-irodaknak": {
      title: "为设计事务所与供应商赢得业务的工程营销",
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
        client: "M Mérnöki Iroda Kft.",
        problem: "拥有 30 年专业经验的工程事务所，原网站不适配移动端，社交媒体仅有零星发布——线上未能体现品牌声望。",
        solution: "Figma 中重新设计 UI/UX + 移动端友好网站（Bootstrap、HTML、CSS）+ Facebook/Instagram/LinkedIn 三平台运营，统一品牌视觉。",
        result: "现代化、移动端友好的网站，三个社交平台的持续运营，统一的视觉品牌识别。",
      },
      intro:
        "匈牙利工程与设计事务所行业线上表现普遍不足:作品集网站陈旧、LinkedIn 形象不一致、技术内容多用术语而非以买方收益为视角。这是机会:谁先解决,谁就能在区域性小市场(如南多瑙)中迅速脱颖而出。",
      whyG2A:
        "我们与匈牙利事务所合作完成 30+ 工程与建筑项目。能将 BIM 模型转换成网页级渲染、把公共招标转译为可读文案、并在 LinkedIn 上为非工程出身的决策者(开发商、投资人、政府)建立可理解的思想领导力内容。我们了解匈牙利公共采购局的体系与最常见的招标类型。",
      relatedServices: [
        {
          title: "搜索引擎优化",
          desc: "技术关键词研究、技术 SEO、B2B 内容结构",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "网站开发",
          desc: "作品集系统、询价、项目档案",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "战略营销",
          desc: "B2B 买方旅程、ABM 战略、销售-营销协同",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "B2B 线索生成多久见效?",
          a: "可量化的管道增长通常需 4-6 个月。B2B 工程销售周期一般 3-12 个月,因此现在投入 SEO + LinkedIn 战略,实际合同需 9-15 个月才能体现。先行指标(CTR、咨询、需求咨询)2 个月即可移动。",
        },
        {
          q: "你们能制作渲染或 3D 可视化吗?",
          a: "我们不内部渲染,但与合作工作室合作,从 BIM 模型或 CAD 文件交付作品集级图像。集成与网站画廊整理由我们承接。",
        },
        {
          q: "如何让技术内容易懂?",
          a: "两层内容策略:(1) 面向同行与技术决策者的深度专业文章;(2) 面向投资人与公共部门的 ROI 与商业焦点摘要。G2A 文案与编辑同时以两种语调写作。",
        },
        {
          q: "工程事务所典型营销预算?",
          a: "小型设计事务所(3-8 人)每月 20-40 万福林(SEO + 内容 + LinkedIn)。中型(15-50 人)每月 50-90 万福林(以上 + ABM + 思想领导力)。LinkedIn 广告费用一般每月 10-20 万福林即可。",
        },
        {
          q: "能协助公共采购/招标 PR 吗?",
          a: "可以。我们将获得的招标转化为新闻稿、推送至本地与行业媒体、转换为 LinkedIn 帖子与网站案例研究。这能将 1 次中标的影响放大 5-10 倍向市场传达。",
        },
      ],
    },
    "marketing-autoipari-cegeknek": {
      title: "为经销商与维修中心带来试驾的汽车营销",
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
        client: "Nissan Ste-Ba",
        problem: "佩奇的 Nissan 品牌经销商需要持续运营季节性活动（车型、促销、维修）——可衡量、品牌一致的 Facebook 广告。",
        solution: "季节性营销战略 + 持续的 Facebook Ads 活动，每两周轮换定制图形与销售导向文案，保持 Nissan 品牌语气。",
        result: "持续的 Facebook Ads 投放，针对性活动，销售导向文案触达区域买家。",
      },
      intro:
        "匈牙利汽车市场分为两半:二手车零售(决策周期较短、价格敏感)与新车/高端零售(周期较长、对品牌与售后体验敏感)。营销战略必须清晰区分 —— 适用于一方的策略往往对另一方适得其反。",
      whyG2A:
        "我们完成 20+ 汽车行业项目,合作对象包括经销商与授权服务中心。我们了解 Shopping feed 的对接(TecDoc、Mobile.de 同步)、Performance Max 中如何分离试驾转化与询价转化、以及 HubSpot/Pipedrive 在汽车场景中的线索评分技巧。",
      relatedServices: [
        {
          title: "PPC 与 Google Ads",
          desc: "Performance Max、Shopping feed、再营销",
          href: "/szolgaltatasok/hirdeteskezeles",
        },
        {
          title: "网站开发与 CRO",
          desc: "试驾预约、金融计算器落地页",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "战略营销",
          desc: "线索评分、销售-营销管道协同",
          href: "/szolgaltatasok/strategiai-marketing",
        },
      ],
      faqs: [
        {
          q: "汽车经销商应预算多少 Google Ads?",
          a: "单店二手车每月最低 30-50 万福林;授权经销商每月 80 万-200 万福林。成本受地理与库存影响:高端品牌(BMW、奔驰)关键词 CPC 1200-1800 福林,二手车 CPC 400-800 福林。",
        },
        {
          q: "汽车 Shopping feed 如何处理?",
          a: "我们从经销商 CRM/DMS(TecDoc、Mobile.de、Carzone)构建自定义 Shopping feed,每日同步。每辆车包含价格、里程、年份、燃料、引擎与高质量图片。这让买家在点击广告时直接看到具体车辆。",
        },
        {
          q: "如何对试驾询问进行分级?",
          a: "三层评分:(1) 预约表单上的自动预筛选问题(融资方式、具体车型兴趣、购买时间);(2) HubSpot 或 Pipedrive 线索评分自动化;(3) 热线索 60 分钟内到达销售员、温线索次工作日。",
        },
        {
          q: "能否在网站集成融资计算器?",
          a: "可以 —— 通过 Cofidis、Cetelem、OTP Lízing API 集成或简单计算器小工具。G2A 根据需求整合融资伙伴数据与网站转化流程。",
        },
        {
          q: "如何衡量营销对实际销售的影响?",
          a: "线上线索 → 展厅访问 → 销售的转化链可在 CRM 追踪 —— 我们将 Google Click ID(GCLID)和 Meta Click ID(FBCLID)写入 CRM 线索字段,即可回溯哪个营销活动促成了具体的车辆销售。我们将其构建到 HubSpot/Pipedrive 集成中。",
        },
      ],
    },
    "marketing-ugyvedi-irodaknak": {
      title: "为律师事务所与顾问吸引客户的法律营销",
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
        client: "Proverium Ügyvédi Iroda",
        problem: "面向企业和个人客户的综合法律服务——在最具竞争力的线上市场之一，需要既有权威感又不冰冷的线上呈现。",
        solution: "符合律师行业声望的现代化 WordPress 网站 + 针对法律关键词的 SEO 优化 + 跨沟通渠道统一的视觉模板。",
        result: "为法律行业打造的权威网站，关键词优化的 SEO 结构，每个接触点都保持一致的品牌体验。",
      },
      intro:
        "匈牙利法律营销受匈牙利律师协会(MÜK)伦理准则和 2017 年第 LXXVIII 号法律约束 —— 比较性、夸大性或误导性广告被禁止。这并非障碍而是方向:善于沟通专业深度与可信顾问形象的律所,能在过度宣传的竞争对手面前迅速赢得信任。",
      whyG2A:
        "完成 15+ 法律项目,合作对象为律师事务所与会计-法律顾问。我们了解匈牙利律师协会 6/2018(III. 26.)广告规章,知道哪些 Google Ads 类别允许、哪些禁止,以及如何在不违反保密义务的前提下制作匿名化案例研究。",
      relatedServices: [
        {
          title: "品牌视觉设计",
          desc: "高端视觉身份、事务所沟通物料",
          href: "/szolgaltatasok/arculattervezes",
        },
        {
          title: "搜索引擎优化",
          desc: "专业领域关键词、本地 SEO、FAQ 内容",
          href: "/szolgaltatasok/keresooptimalizalas",
        },
        {
          title: "网站开发",
          desc: "咨询预约、安全客户门户集成",
          href: "/szolgaltatasok/webfejlesztes",
        },
      ],
      faqs: [
        {
          q: "匈牙利律师协会(MÜK)允许在线广告与内容营销吗?",
          a: "允许。6/2018(III. 26.)MÜK 规章允许客观、专业、信息性的律师服务广告。但禁止比较性、夸大性或揽客式广告,如「本市最佳律师」或「保证胜诉」。G2A 在此规则范围内创作所有内容。",
        },
        {
          q: "你们能发布客户参考吗?",
          a: "仅在客户明确书面同意下,而且只描述业务性质而非具体案件细节。替代方案是匿名化案例研究:「某中型工业集团,M&A 交易,9 个月尽职调查后成功结案」—— 不附名字与行业细节。",
        },
        {
          q: "律师可使用哪些 Google Ads 类别?",
          a: "一般法律咨询、家庭法、民事法、不动产法、劳动法、商业法 —— 全部允许。不允许:成功费方式广告(「不胜诉=不收费」)、刑事法部分(如「毒品律师」)、特定国家移民定向。G2A 在审核中会检查每个广告的法律合规性。",
        },
        {
          q: "如何在线咨询中确保 GDPR 合规?",
          a: "Tresorit 加密文档传输、JotForm GDPR 合规表单(欧盟数据中心)、明确日志化的同意。律师-客户特权的技术面通过端到端加密保障。",
        },
        {
          q: "应预算多少?",
          a: "独立律师或小型事务所(3 人以下)每月 20-40 万福林(SEO + 内容 + LinkedIn);中型(5-15 人)每月 50-90 万福林(以上 + Google Ads + 品牌沟通)。广告费一般每月 10-30 万福林。",
        },
      ],
    },
    "marketing-technologiai-cegeknek": {
      title: "为 SaaS 与 IT 企业带来演示预约的 B2B 科技营销",
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
        client: "AR Works",
        problem: "增强现实（AR/VR）解决方案公司——需要在视觉与内容上同时传达高科技属性与复杂的技术能力，面向 B2B 买家。",
        solution: "基于 WordPress 的网站，定制 HTML/CSS——结构化的服务与案例展示，技术级视觉风格，B2B-tech 语调。",
        result: "现代化、技术级的网站，符合 B2B-tech 买家的语调，结构化的作品集。",
      },
      intro:
        "B2B SaaS 与科技领域的营销工具从传统广告转向内容 + 思想领导力 + ABM(基于账户的营销)。决策者在请求演示前平均触达品牌 14 次 —— 这意味着营销漏斗不是线性的,而是多渠道触点的网络。",
      whyG2A:
        "完成 35+ 科技项目,从 SaaS 创业公司到中型 IT 咨询机构。我们了解 CMS 端的 hreflang 实现、HubSpot 多触点归因模型、Apollo–Cognism–Clearbit 线索丰富组合,以及匈牙利买方画像与德国或波兰的差异。内部 AI 工具(Claude、ChatGPT)加速内容生产。",
      relatedServices: [
        {
          title: "AI 营销",
          desc: "AI 辅助内容生产、线索丰富、预测分析",
          href: "/szolgaltatasok/ai-marketing",
        },
        {
          title: "营销自动化",
          desc: "HubSpot、Marketo、多触点归因、线索评分",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "本地化与国际营销",
          desc: "多语种 SEO、文化适应、欧盟市场进入",
          href: "/szolgaltatasok/lokalizacio",
        },
      ],
      faqs: [
        {
          q: "B2B SaaS 营销多久见效?",
          a: "顶部漏斗指标(自然流量、LinkedIn 互动)2-3 个月内移动。演示请求通常从第 4-6 个月开始增长 —— 取决于内容索引时间与 ABM 冷转暖速度。实际收入影响为 9-15 个月,因为这是企业销售周期长度。",
        },
        {
          q: "应优先本地化到哪些语种?",
          a: "因行业而异,但匈牙利初创公司通常:1. 英语(全球覆盖)、2. 德语(DACH 区域)、3. 波兰语 + 捷克语(V4 市场)。我们在启动前预先映射关键词量,常发现波兰语市场比德国大、竞争更小。",
        },
        {
          q: "能否在 HubSpot 内设置线索评分?",
          a: "可以。两层评分:显性(公司规模、行业、角色)+ 隐性(站内时长、邮件打开、演示页访问)。乘积表给出线索优先级:热线索 60+、营销合格线索 30-59、原始线索 0-29。我们为客户的销售周期构建定制 HubSpot 字段与工作流。",
        },
        {
          q: "ABM 实践具体如何?",
          a: "三轨并行:(1) 销售挑选 50-100 目标账户;(2) 营销在 LinkedIn 上对每个公司+决策者进行定向投放(每月 3-6 触点);(3) 销售员在升温后启动直接外联。整个 ABM 流程在 HubSpot 中建模。",
        },
        {
          q: "SaaS 营销现实预算多少?",
          a: "产品-市场契合前的初创(10 人以下)每月 40-80 万福林(SEO + 内容 + 单渠道 ABM)。增长期 SaaS(15-50 人)每月 150-300 万福林(完整 ABM + 多语种 + 营销自动化)。规模化或企业级 SaaS(50+ 人)每月 400-1000 万福林。",
        },
      ],
    },
    "marketing-onkormanyzati-projekteknek": {
      title: "为欧盟项目与活动带来公众参与的公共部门营销",
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
        client: "Zsolnay Örökségkezelő Nonprofit Kft.",
        problem: "运营佩奇 Zsolnay 区文化生活的非营利组织——许多访客通过 Google 搜索发现活动，SEO 表现直接影响访客量。",
        solution: "详细的 SEO 审核（技术 + 关键词 + 内容差距），优先级改进方案，团队可独立延续优化的工具建议。",
        result: "带有优先级行动的详细 SEO 审核，团队可独立维护的优化流程。",
      },
      intro:
        "匈牙利地方政府沟通通常局限于公务员撰写的新闻稿 + Facebook 帖子,但居民期望移动友好网站、Messenger 快速回复、无障碍内容与多代际覆盖。匈牙利 2018 年第 LXXV 号法律自 2025 年起对所有公共部门数字服务强制 WCAG 2.1 AA 合规。",
      whyG2A:
        "完成 10+ 政府与公共机构项目,从乡镇到县级城市。我们了解匈牙利公共采购法(Kbt.)、2018 年第 LXXV 号无障碍要求、欧盟项目可见性规则。总经理 Győrfi Attila 在佩奇大学经济学系任教 —— 与区域公共行政有直接联系。",
      relatedServices: [
        {
          title: "网站开发",
          desc: "无障碍公共部门网站、多语种、安全",
          href: "/szolgaltatasok/webfejlesztes",
        },
        {
          title: "社交媒体管理",
          desc: "居民沟通、代际定位、危机包",
          href: "/szolgaltatasok/kozossegi-media",
        },
        {
          title: "内容营销",
          desc: "简报系统、公益文章、欧盟项目 PR",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "WCAG 2.1 AA 合规具体意味着什么?",
          a: "Web Content Accessibility Guidelines:对盲人与低视力者(屏幕阅读器兼容)、运动障碍者(仅键盘可用)、认知障碍者(简单文本、对比色)友好。AA = 第二最高级别,匈牙利自 2025 年起对所有公共部门服务强制要求。",
        },
        {
          q: "你们能协助公共采购吗?",
          a: "可以 —— 按 Kbt. 撰写质量与价格敏感的标书,从参与意向声明到技术文档。G2A 通常作为分包商或联合体成员参与较大投标,直接为乡镇或机构提供基础服务。",
        },
        {
          q: "如何 24/7 处理危机沟通?",
          a: "三层包:(1) 8-10 种典型情况(洪水、断水断电、交通事故、新冠类健康危机)的预写模板;(2) 定义审批流(市长、书记、传播负责人);(3) 可选 G2A 待命服务 —— 月费基础上,危机触发后 30 分钟内推送已批准内容。",
        },
        {
          q: "欧盟项目可见性是什么意思?",
          a: "欧盟资助项目强制:受益人标识(Logo、口号、项目编号)、新闻发布、主题传播。我们按欧盟 2021-2027 凝聚政策可见性手册工作 —— 固定、可审计的模板。",
        },
        {
          q: "典型政府营销预算?",
          a: "小型乡镇(5000 居民以下)每月 10-20 万福林(基础服务、社媒 + 简报);中型(5-30k 居民)每月 25-50 万福林;县级城市每月 80-200 万福林(危机团队 + 欧盟 PR + 居民关系)。欧盟资助项目通常将营销作为独立预算项。",
        },
      ],
    },
    "marketing-b2b-cegeknek": {
      title: "为制造商与批发商带来合格线索的 B2B 营销",
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
        client: "ÉMI-TÜV SÜD",
        problem: "匈牙利建筑业和产品认证市场的领导者——B2B 决策者通过在线搜索寻找认证服务，需要 SEO 与广告管理优化。",
        solution: "针对认证关键词的 SEO 审核 + 广告管理审核（基于 Google Analytics + Search Console 数据），以测量为依据的决策支持。",
        result: "详细的 SEO 审核与 PPC 审核，关键词定位，借助 Analytics + Search Console 的测量驱动决策支持。",
      },
      intro:
        "B2B 购买旅程的 67% 在销售首次接触前已在线发生 —— 这意味着营销作为与销售并行的管道建设单位运作,而非销售的支持职能。现代 B2B 营销关注 MQL → SQL → Opportunity → Won-Deal 漏斗的可量化与可优化。",
      whyG2A:
        "完成 50+ B2B 项目,从中型 SaaS 到工业供应商。我们了解 HubSpot 与 Marketo 的实际功能(而非营销 demo)、如何用 6 人销售团队运营 ABM、以及在匈牙利/德国/波兰 B2B 市场的经验。总经理 Győrfi Attila 在佩奇大学经济学系任教 —— 与本国企业部门有直接联系。",
      relatedServices: [
        {
          title: "战略营销",
          desc: "B2B 买方旅程、ABM 战略、销售-营销协同",
          href: "/szolgaltatasok/strategiai-marketing",
        },
        {
          title: "营销自动化",
          desc: "HubSpot/Marketo、线索评分、多触点归因",
          href: "/szolgaltatasok/marketing-automatizacio",
        },
        {
          title: "内容营销",
          desc: "B2B 博客、白皮书、客户案例、思想领导力",
          href: "/szolgaltatasok/tartalommarketing",
        },
      ],
      faqs: [
        {
          q: "B2B 与 B2C 营销有何不同?",
          a: "B2B 销售周期更长(3-12 个月)、决策参与方更多(平均 6-10 人)、交易额更高(500 万-2 亿福林)、决策更理性(非情绪化)。这要求不同的指标(管道价值、CAC/LTV 比)与渠道(LinkedIn 而非 TikTok、邮件而非 Instagram)。",
        },
        {
          q: "ABM(基于账户的营销)实际怎么做?",
          a: "销售挑选 50-150 个目标公司。营销在 LinkedIn 上对每个公司进行公司+决策者定向(每月 3-6 触点)。销售员在升温后启动直接外联。G2A 在 HubSpot 中建模整个 ABM 流 —— 每家公司可量化阶段。",
        },
        {
          q: "如何衡量 B2B 营销 ROI?",
          a: "采用多触点归因模型:每个营销触点(自然博客、LinkedIn 帖子、邮件打开、演示预约)按比例贡献最终合同。HubSpot 收入归因报告显示总收入中社媒、SEO、邮件等各占多少 % —— 据此可在下季度精准投放回报最高的渠道。",
        },
        {
          q: "推荐 B2B 营销技术栈?",
          a: "典型中型市场配置:HubSpot(CRM + 营销自动化 + CMS)或 Pipedrive + Marketo、Apollo/Cognism(线索数据)、LinkedIn Sales Navigator、Lavender(邮件写作助手)、Calendly(预约)、Slack(销售-营销协同)。G2A 本身是 HubSpot Solution Partner —— 可直接实施完整技术栈。",
        },
        {
          q: "B2B 营销现实预算多少?",
          a: "管道前期(10-20 人公司):每月 40-80 万福林(LinkedIn + 内容 + 基础自动化)。管道建设期(30-100 人):每月 150-300 万福林(完整 ABM + 营销自动化 + 销售赋能)。规模化或企业级 B2B(100+ 人):每月 400-1000 万福林。最佳指标:营销预算 / 管道价值 — 至少目标 1:8。",
        },
      ],
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
  // Open FAQ accordion state — null = all closed, otherwise the index of the open item
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <SeoHead
        title={content.metaTitle}
        description={content.metaDesc}
        pageSchemas={[
          breadcrumbSchema([
            { name: "G2A Marketing", url: "https://g2amarketing.hu" },
            { name: t("nav.industries"), url: "https://g2amarketing.hu/" },
            {
              name: content.title,
              url: `https://g2amarketing.hu/iparagi/${slug}`,
            },
          ]),
          serviceSchema({
            name: content.title,
            description: content.heroDesc,
            url: `https://g2amarketing.hu/iparagi/${slug}`,
            serviceType: "Industry-specific marketing services",
          }),
          content.faqs ? faqPageSchema(content.faqs.map((f) => ({ q: f.q, a: f.a }))) : null,
        ]}
      />
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

        {/* Industry intro — only rendered when content.intro is set
            (currently HU only; EN/ZH fall through to the existing layout). */}
        {content.intro && (
          <section className="g2a-section" style={{ backgroundColor: "transparent", paddingBottom: "1rem" }}>
            <div className="g2a-container" style={{ maxWidth: "880px" }}>
              <div className="g2a-section-label reveal">{t("iparagi.introLabel")}</div>
              <p
                className="reveal reveal-delay-1"
                style={{
                  color: "var(--g2a-text-secondary)",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  marginTop: "0.75rem",
                  fontFamily: "Geist, sans-serif",
                }}
              >
                {content.intro}
              </p>
            </div>
          </section>
        )}

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

        {/* Why G2A for this industry — short trust block, only renders when set */}
        {content.whyG2A && (
          <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
            <div className="g2a-container" style={{ maxWidth: "780px" }}>
              <div className="g2a-section-label reveal">{t("iparagi.whyG2ALabel")}</div>
              <h2 className="g2a-section-title reveal reveal-delay-1">
                {t("iparagi.whyG2ATitle")}
              </h2>
              <p
                className="reveal reveal-delay-2"
                style={{
                  color: "var(--g2a-text-secondary)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  marginTop: "1rem",
                  fontFamily: "Geist, sans-serif",
                }}
              >
                {content.whyG2A}
              </p>
            </div>
          </section>
        )}

        {/* Related services — internal links to relevant service subpages */}
        {content.relatedServices && content.relatedServices.length > 0 && (
          <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
            <div className="g2a-container">
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div className="g2a-section-label reveal">{t("iparagi.relatedServicesLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  {t("iparagi.relatedServicesTitle")}
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.25rem",
                  maxWidth: 1000,
                  margin: "0 auto",
                }}
              >
                {content.relatedServices.map((s, i) => (
                  <Link key={i} href={s.href} style={{ textDecoration: "none" }}>
                    <div
                      className="g2a-card reveal"
                      style={{
                        padding: "1.5rem",
                        height: "100%",
                        cursor: "pointer",
                        transition: "border-color 0.2s, transform 0.2s",
                        borderColor: `${meta.color}30`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = meta.color;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${meta.color}30`;
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--g2a-text-primary)",
                          marginBottom: "0.4rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {s.title}
                        <ArrowRight size={14} style={{ color: meta.color }} />
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--g2a-text-secondary)",
                          lineHeight: 1.55,
                        }}
                      >
                        {s.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ — accordion */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="g2a-section" style={{ backgroundColor: "transparent" }}>
            <div className="g2a-container" style={{ maxWidth: "880px" }}>
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div className="g2a-section-label reveal">{t("iparagi.faqsLabel")}</div>
                <h2 className="g2a-section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
                  {t("iparagi.faqsTitle")}
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {content.faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="reveal"
                      style={{
                        background: "var(--g2a-bg-card)",
                        border: `1px solid ${open ? meta.color : "var(--g2a-border)"}`,
                        borderRadius: 12,
                        transition: "border-color 0.2s",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          padding: "1.1rem 1.4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "Geist, sans-serif",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "var(--g2a-text-primary)",
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            color: meta.color,
                            transition: "transform 0.2s",
                            transform: open ? "rotate(180deg)" : "rotate(0)",
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {open && (
                        <div
                          style={{
                            padding: "0 1.4rem 1.25rem",
                            color: "var(--g2a-text-secondary)",
                            fontSize: "0.9rem",
                            lineHeight: 1.65,
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

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
