import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
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
  "marketing-ugyvedii-irodaknak": { icon: <Scale size={32} />, color: "#6366f1" },
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
      title: "Marketing egészségügyi cégeknek",
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
        client: "Magánklinika — Pécs",
        problem: "Alacsony online foglalások, gyenge SEO jelenlét, nincs reputáció-stratégia",
        solution: "Teljes SEO + Google Ads + új konverzió-optimalizált weboldal foglalási rendszerrel",
        result: "+340% organikus forgalom, +180% online foglalás 6 hónap alatt",
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
      title: "Marketing szépségipari cégeknek",
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
        client: "Szépségszalon lánc — 3 telephellyel",
        problem: "Alacsony közösségi média jelenlét, nincs online foglalási rendszer, telefonos akadály",
        solution: "Instagram stratégia + Meta Ads + Booksy integráció + lokális SEO",
        result: "+520% Instagram követő, +190% online foglalás 4 hónap alatt",
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
      title: "Marketing mérnöki és építőipari cégeknek",
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
        client: "Statikai tervezőiroda — Pécs",
        problem: "Nincs online jelenlét, minden ügyfél referencia alapján — nem skálázható",
        solution: "Új portfólió weboldal + technikai SEO + LinkedIn stratégia + 4 fős thought leadership csapat",
        result: "+15 új ügyfél/hónap, Top 3 Google pozíció 4 kulcsszóra 8 hónap alatt",
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
      title: "Marketing autóipari cégeknek",
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
        client: "Multimárka autókereskedő hálózat — 4 telephely",
        problem: "Magas Google Ads költés (havi 2.5M Ft), alacsony konverzió, nincs lead-minősítés",
        solution: "PPC audit + kampányrestruktúra (Performance Max + Shopping feed) + új landing page-ek + HubSpot lead scoring",
        result: "-45% CPA, +220% minősített lead 3 hónap alatt — havi költés 30%-kal csökkent, eladás +35%",
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
    "marketing-ugyvedii-irodaknak": {
      title: "Marketing ügyvédi és jogi irodáknak",
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
        client: "Ügyvédi iroda — Budapest",
        problem: "Elavult honlap, alacsony presztízs-érzet, „ügyvédkereső”-ben láthatatlan",
        solution: "Prémium brand redesign + új weboldal + szakterületi SEO + Google Ads (engedélyezett kategóriák)",
        result: "+250% organikus forgalom, Top 1 Google pozíció 3 fő szakterületen 5 hónap alatt",
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
      title: "Marketing technológiai és SaaS cégeknek",
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
        client: "B2B SaaS vállalat — magyar startup",
        problem: "Nemzetközi piacra lépés, brand awareness hiánya, demo-funnel konverzió 1.2%",
        solution: "Brand-stratégia + multilingual SEO (HU/EN/DE) + LinkedIn ABM + HubSpot integráció + demo CRO",
        result: "+5 új piac (DE, AT, CH, PL, CZ), +280% demo foglalás, 4.1% demo-funnel konverzió 12 hónap alatt",
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
      title: "Marketing önkormányzati és közintézményi projekteknek",
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
        client: "Dél-dunántúli kisváros — 8.000 lakos",
        problem: "Elavult, nem mobilbarát weboldal, alacsony közösségi bevonás, krízis-kommunikáció hiányzik",
        solution: "Új akadálymentes weboldal + social media stratégia + krízis-kit-ek + lakossági hírlevél rendszer",
        result: "+400% közösségi elérés, +250% weboldal látogatók, 92%-os lakossági elégedettség éves felmérésben",
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
      title: "Marketing B2B vállalatoknak",
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
        client: "B2B szoftver vállalat — 35 fős, közepes méretű enterprise SaaS",
        problem: "Alacsony lead-minőség, 9 hónap átlag sales-cycle, sales-marketing alignment hiányzik",
        solution: "ABM stratégia + HubSpot marketing automation + sales enablement + multi-touch attribúció",
        result: "+180% qualified lead, -40% sales-cycle (9→5.4 hónap), 6 hónap alatt 12% revenue növekedés",
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
