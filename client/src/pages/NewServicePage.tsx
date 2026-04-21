import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";

type ServiceConfig = {
  slug: string;
  title: string;
  subtitle: string;
  heroDesc: string;
  metaTitle: string;
  metaDesc: string;
  icon: string;
  color: string;
  intro: string;
  benefits: Array<{ title: string; desc: string }>;
  process: Array<{ step: string; title: string; desc: string }>;
  faq: Array<{ q: string; a: string }>;
  cta: string;
};

const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI Marketing",
    subtitle: "Mesterséges intelligencia a marketingben",
    heroDesc: "Automatizáld a marketingedet, személyre szabott tartalmakkal és AI-alapú elemzésekkel növeld a konverzióidat.",
    metaTitle: "AI Marketing – Mesterséges Intelligencia a Marketingben | G2A Marketing",
    metaDesc: "AI-alapú marketing megoldások: automatizált kampányok, személyre szabott tartalmak, prediktív elemzés. Növeld a hatékonyságot mesterséges intelligenciával.",
    icon: "bot",
    color: "#7c3aed",
    intro: "A mesterséges intelligencia forradalmasítja a marketinget. Az AI-alapú eszközök segítségével pontosabb célzást, személyre szabott kommunikációt és automatizált folyamatokat valósíthatunk meg – mindezt töredék idő és költség alatt.",
    benefits: [
      { title: "Prediktív elemzés", desc: "AI-alapú adatelemzéssel előre jelezzük a vásárlói viselkedést és optimalizáljuk a kampányokat." },
      { title: "Személyre szabott tartalom", desc: "Minden felhasználónak releváns tartalmakat jelenítünk meg automatikusan, növelve az elköteleződést." },
      { title: "Automatizált hirdetések", desc: "Smart bidding és automatizált kampánykezelés a maximális ROI érdekében." },
      { title: "Chatbot integráció", desc: "24/7 ügyfélszolgálat AI chatbotokkal, amelyek valódi értéket teremtenek." },
      { title: "Tartalomgenerálás", desc: "AI-asszisztált tartalomlétrehozás, amely gyorsítja a marketingfolyamatokat." },
      { title: "Konverzióoptimalizálás", desc: "Gépi tanulás alapú A/B tesztelés és landing page optimalizálás." },
    ],
    process: [
      { step: "01", title: "AI Audit", desc: "Megvizsgáljuk a jelenlegi marketing folyamataidat és azonosítjuk az AI-integrációs lehetőségeket." },
      { step: "02", title: "Stratégia", desc: "Személyre szabott AI marketing stratégiát dolgozunk ki a céljaid alapján." },
      { step: "03", title: "Implementáció", desc: "Bevezetjük az AI eszközöket és integráljuk a meglévő rendszereiddel." },
      { step: "04", title: "Optimalizálás", desc: "Folyamatos monitoring és finomhangolás a legjobb eredmények érdekében." },
    ],
    faq: [
      { q: "Mekkora cégeknek ajánlott az AI marketing?", a: "Az AI marketing minden méretű vállalkozásnak elérhető. Kis cégeknek az automatizálás, nagyobb vállalatoknál a prediktív elemzés és személyre szabás jelenti a legnagyobb értéket." },
      { q: "Mennyi idő alatt láthatók az eredmények?", a: "Az első eredmények általában 4-8 héten belül láthatók, de a teljes potenciál 3-6 hónap után bontakozik ki." },
      { q: "Milyen AI eszközöket használtok?", a: "Google AI, Meta AI hirdetési rendszerek, OpenAI API, HubSpot AI, Jasper és egyéb vezető platformokat integrálunk." },
    ],
    cta: "Kérd az ingyenes AI marketing auditot",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC / Google Ads",
    subtitle: "Fizetett keresési hirdetések szakértői kezelése",
    heroDesc: "Maximalizáld a Google Ads befektetés megtérülését profi kampánykezeléssel, precíz célzással és folyamatos optimalizálással.",
    metaTitle: "PPC Google Ads Kezelés – Fizetett Hirdetések | G2A Marketing",
    metaDesc: "Professzionális Google Ads kampánykezelés. Search, Display, Shopping, YouTube hirdetések. Mérhető eredmények, maximális ROI.",
    icon: "target",
    color: "#ea4335",
    intro: "A Google Ads az egyik leghatékonyabb eszköz az azonnali láthatóság és konverziók növelésére. Szakértő csapatunk minden kampánytípusban jártas – a keresési hirdetésektől a Shopping kampányokig.",
    benefits: [
      { title: "Google Search Ads", desc: "Célzott keresési hirdetések, amelyek pontosan akkor jelennek meg, amikor a potenciális ügyfelek keresnek." },
      { title: "Google Display Network", desc: "Vizuális hirdetések a Google hálózatán, hatékony remarketing lehetőségekkel." },
      { title: "Google Shopping", desc: "Termék-alapú hirdetések e-kereskedelmi vállalkozásoknak a maximális konverzióért." },
      { title: "YouTube Ads", desc: "Videó hirdetések a világ második legnagyobb keresőjén." },
      { title: "Performance Max", desc: "AI-vezérelt kampányok, amelyek az összes Google csatornán optimalizálnak." },
      { title: "Remarketing", desc: "Visszahozza a weboldaladat elhagyó látogatókat célzott hirdetésekkel." },
    ],
    process: [
      { step: "01", title: "Fiók audit", desc: "Megvizsgáljuk a jelenlegi kampányokat és azonosítjuk a fejlesztési lehetőségeket." },
      { step: "02", title: "Kulcsszókutatás", desc: "Részletes kulcsszóelemzés a leghatékonyabb célzás érdekében." },
      { step: "03", title: "Kampányfelépítés", desc: "Optimális kampánystruktúra, hirdetéscsoportok és kreatívok létrehozása." },
      { step: "04", title: "Optimalizálás", desc: "Heti szintű optimalizálás, bid management és teljesítményjelentések." },
    ],
    faq: [
      { q: "Mekkora büdzsével érdemes elkezdeni?", a: "Általában havi 100.000 Ft-tól érdemes Google Ads kampányokat futtatni, de ez iparágtól és céloktól függ." },
      { q: "Mennyi az ügynökségi díj?", a: "Díjazásunk a kezelt büdzsé alapján kerül meghatározásra. Részletekért kérj ingyenes konzultációt." },
      { q: "Milyen riportokat kapok?", a: "Havi részletes teljesítményjelentést küldünk, és hozzáférést biztosítunk a Google Ads fiókhoz." },
    ],
    cta: "Kérd az ingyenes Google Ads auditot",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta Hirdetések",
    subtitle: "Facebook és Instagram hirdetések kezelése",
    heroDesc: "Érd el célközönségedet a világ legnagyobb közösségi platformjain. Precíz célzás, kreatív hirdetések, mérhető eredmények.",
    metaTitle: "Meta Hirdetések – Facebook és Instagram Ads | G2A Marketing",
    metaDesc: "Professzionális Meta (Facebook, Instagram) hirdetéskezelés. Célzott kampányok, remarketing, konverzióoptimalizálás.",
    icon: "smartphone",
    color: "#1877f2",
    intro: "A Meta platformok (Facebook, Instagram, WhatsApp) több mint 3 milliárd aktív felhasználóval rendelkeznek. Precíz célzási lehetőségeikkel pontosan elérheted az ideális ügyfeleidet.",
    benefits: [
      { title: "Facebook Ads", desc: "Célzott hirdetések Facebookon – demográfia, érdeklődés és viselkedés alapján." },
      { title: "Instagram Ads", desc: "Vizuálisan erős hirdetések Instagramon, Stories és Reels formátumban." },
      { title: "Lookalike Audiences", desc: "Hasonló közönségek megcélzása a legjobb ügyfeleid alapján." },
      { title: "Retargeting", desc: "Visszahozza a weboldalt elhagyó látogatókat és kosárelhagyókat." },
      { title: "Lead Generation Ads", desc: "Direkt lead gyűjtés a platformon belül, magas konverzióval." },
      { title: "Catalog Ads", desc: "Dinamikus termék hirdetések e-kereskedelmi vállalkozásoknak." },
    ],
    process: [
      { step: "01", title: "Pixel telepítés", desc: "Meta Pixel és Conversion API beállítása a pontos méréshez." },
      { step: "02", title: "Közönség felépítés", desc: "Célközönségek definiálása és lookalike audience-ek létrehozása." },
      { step: "03", title: "Kreatív fejlesztés", desc: "Hatékony hirdetési kreatívok tervezése és szövegírása." },
      { step: "04", title: "Tesztelés és optimalizálás", desc: "A/B tesztelés, kampányoptimalizálás és havi riportok." },
    ],
    faq: [
      { q: "Facebook vagy Instagram – melyik a jobb?", a: "Ez a célközönségtől függ. B2B esetén Facebook, fiatalabb közönségnél Instagram a hatékonyabb. Általában mindkét platformon érdemes jelen lenni." },
      { q: "Kell-e saját kreatívokat készítenem?", a: "Nem – a kreatív fejlesztés részét képezi a szolgáltatásunknak. Elkészítjük a hirdetési anyagokat." },
      { q: "Hogyan mérik az eredményeket?", a: "Meta Pixel és Conversion API segítségével pontosan mérjük a konverziókat, ROAS-t és egyéb KPI-okat." },
    ],
    cta: "Kérd az ingyenes Meta Ads auditot",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "Tartalommarketing",
    subtitle: "Értékes tartalmak, amelyek vonzzák az ügyfeleket",
    heroDesc: "Építs tekintélyt és organikus forgalmat értékes tartalmakkal. Blog, videó, podcast, infografika – minden csatornán.",
    metaTitle: "Tartalommarketing Ügynökség – Blog, SEO Tartalom | G2A Marketing",
    metaDesc: "Professzionális tartalommarketing: SEO-optimalizált blogcikkek, videók, közösségi média tartalmak. Növeld az organikus forgalmat és az ügyfélbizalmat.",
    icon: "pen",
    color: "#10b981",
    intro: "A tartalommarketing az egyik legköltséghatékonyabb módszer az organikus forgalom és az ügyfélbizalom növelésére. Értékes, SEO-optimalizált tartalmakkal vonzzuk a potenciális ügyfeleket.",
    benefits: [
      { title: "SEO blogcikkek", desc: "Kulcsszóoptimalizált, hosszú formátumú cikkek, amelyek organikus forgalmat hoznak." },
      { title: "Közösségi média tartalom", desc: "Platformra szabott tartalmak Facebookra, Instagramra és LinkedInre." },
      { title: "Email marketing", desc: "Értékes hírlevél tartalmak, amelyek fenntartják az ügyfélkapcsolatot." },
      { title: "Videó tartalom", desc: "Rövid és hosszú formátumú videók YouTube-ra és közösségi médiára." },
      { title: "Infografika", desc: "Vizuálisan vonzó adatvizualizáció és infografika tervezés." },
      { title: "Esettanulmányok", desc: "Meggyőző case study tartalmak, amelyek bizonyítják a szakértelmet." },
    ],
    process: [
      { step: "01", title: "Tartalom audit", desc: "Megvizsgáljuk a meglévő tartalmakat és azonosítjuk a fejlesztési lehetőségeket." },
      { step: "02", title: "Stratégia", desc: "Tartalomkalendárium és témastruktúra kialakítása a célközönség alapján." },
      { step: "03", title: "Tartalom gyártás", desc: "Minőségi tartalmak létrehozása SEO és konverzió szempontok szerint." },
      { step: "04", title: "Terjesztés", desc: "Multichannel terjesztés és teljesítménymérés." },
    ],
    faq: [
      { q: "Mennyi idő alatt láthatók az eredmények?", a: "A tartalommarketing hosszú távú befektetés. Az első organikus eredmények 3-6 hónap után jelennek meg, de az értéke idővel exponenciálisan növekszik." },
      { q: "Hány cikket írnak havonta?", a: "Ez a csomagtól és a büdzsétől függ. Általában havi 4-8 blogcikket ajánlunk az optimális eredményekhez." },
      { q: "Ki írja a tartalmakat?", a: "Tapasztalt copywritereink és iparági szakértőink írják a tartalmakat, amelyeket SEO specialistáink optimalizálnak." },
    ],
    cta: "Kérd az ingyenes tartalom auditot",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "Marketing Automatizáció",
    subtitle: "Automatizált folyamatok a hatékonyabb marketingért",
    heroDesc: "Spórolj időt és növeld a bevételt automatizált marketing folyamatokkal. CRM integráció, email automatizálás, lead nurturing.",
    metaTitle: "Marketing Automatizáció – CRM, Email, Lead Nurturing | G2A Marketing",
    metaDesc: "Marketing automatizáció: CRM integráció, email automatizálás, lead nurturing, sales funnel optimalizálás. Növeld a hatékonyságot automatizált folyamatokkal.",
    icon: "zap",
    color: "#f59e0b",
    intro: "A marketing automatizáció lehetővé teszi, hogy a megfelelő üzenetet a megfelelő időben juttasd el a megfelelő embernek – emberi beavatkozás nélkül. Ez növeli a hatékonyságot és csökkenti a manuális munkát.",
    benefits: [
      { title: "Email automatizálás", desc: "Trigger-alapú email sorozatok, amelyek automatikusan reagálnak a felhasználói viselkedésre." },
      { title: "CRM integráció", desc: "HubSpot, Salesforce, ActiveCampaign és más CRM rendszerek beállítása és integrálása." },
      { title: "Lead nurturing", desc: "Automatizált lead gondozási folyamatok, amelyek végigvezetik az érdeklődőket a vásárlási döntésig." },
      { title: "Sales funnel", desc: "Teljes értékesítési tölcsér automatizálása a lead generálástól a konverzióig." },
      { title: "Szegmentálás", desc: "Dinamikus szegmentálás viselkedés és demográfia alapján." },
      { title: "Reporting", desc: "Automatizált teljesítményjelentések és dashboard-ok." },
    ],
    process: [
      { step: "01", title: "Folyamat feltérképezés", desc: "Megvizsgáljuk a jelenlegi marketing folyamatokat és azonosítjuk az automatizálási lehetőségeket." },
      { step: "02", title: "Platform kiválasztás", desc: "A céljaidnak megfelelő automatizálási platform kiválasztása és beállítása." },
      { step: "03", title: "Workflow fejlesztés", desc: "Automatizált folyamatok tervezése és implementálása." },
      { step: "04", title: "Tesztelés és optimalizálás", desc: "Folyamatos monitoring és finomhangolás a legjobb eredményekért." },
    ],
    faq: [
      { q: "Milyen platformokkal dolgoztok?", a: "HubSpot, ActiveCampaign, Mailchimp, Klaviyo, Salesforce és más vezető platformokkal dolgozunk." },
      { q: "Mennyi idő az implementáció?", a: "Egy alap automatizálási rendszer 2-4 hét alatt bevezethető, komplexebb megoldások 6-8 hetet igényelnek." },
      { q: "Kell-e meglévő CRM rendszer?", a: "Nem kötelező, de ajánlott. Ha nincs, segítünk a megfelelő platform kiválasztásában és beállításában." },
    ],
    cta: "Kérd az ingyenes automatizáció auditot",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG Kommunikáció",
    subtitle: "Fenntarthatósági és felelős vállalati kommunikáció",
    heroDesc: "Kommunikáld hatékonyan a vállalat fenntarthatósági törekvéseit. ESG jelentések, zöld marketing, stakeholder kommunikáció.",
    metaTitle: "ESG Kommunikáció – Fenntarthatósági Marketing | G2A Marketing",
    metaDesc: "ESG és fenntarthatósági kommunikáció: ESG jelentések, zöld marketing stratégia, stakeholder kommunikáció, CSR tartalmak.",
    icon: "leaf",
    color: "#22c55e",
    intro: "Az ESG (Environmental, Social, Governance) szempontok egyre fontosabbak a befektetők, ügyfelek és munkavállalók számára. Segítünk hatékonyan kommunikálni a vállalat fenntarthatósági törekvéseit.",
    benefits: [
      { title: "ESG stratégia", desc: "Átfogó ESG kommunikációs stratégia kialakítása a vállalat értékei alapján." },
      { title: "Fenntarthatósági jelentés", desc: "Professzionális ESG és fenntarthatósági jelentések készítése." },
      { title: "Zöld marketing", desc: "Hiteles és hatékony zöld marketing kampányok, greenwashing elkerülésével." },
      { title: "Stakeholder kommunikáció", desc: "Célzott kommunikáció befektetők, ügyfelek és munkavállalók felé." },
      { title: "CSR tartalmak", desc: "Vállalati felelősségvállalási tartalmak és kampányok." },
      { title: "Impact mérés", desc: "ESG teljesítmény mérése és kommunikálása." },
    ],
    process: [
      { step: "01", title: "ESG audit", desc: "Megvizsgáljuk a jelenlegi ESG tevékenységeket és kommunikációt." },
      { step: "02", title: "Stratégia", desc: "ESG kommunikációs stratégia és üzenetrendszer kialakítása." },
      { step: "03", title: "Tartalom fejlesztés", desc: "ESG tartalmak, jelentések és kampányok létrehozása." },
      { step: "04", title: "Terjesztés", desc: "Multichannel terjesztés és stakeholder engagement." },
    ],
    faq: [
      { q: "Kötelező-e az ESG jelentés?", a: "Az EU szabályozás egyre több vállalat számára teszi kötelezővé az ESG jelentést. Segítünk felkészülni a követelményekre." },
      { q: "Mi a különbség az ESG és CSR között?", a: "A CSR önkéntes vállalati felelősségvállalás, míg az ESG egy strukturált, mérhető keretrendszer befektetői és szabályozói célokra." },
      { q: "Hogyan kerüljük el a greenwashingot?", a: "Hiteles, adatokon alapuló kommunikációval és transzparenciával. Segítünk a valódi ESG teljesítmény bemutatásában." },
    ],
    cta: "Kérd az ingyenes ESG kommunikációs tanácsadást",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "Employer Branding",
    subtitle: "Vonzó munkáltatói márka felépítése",
    heroDesc: "Vonzd a legjobb tehetségeket és tartsd meg a munkatársaidat erős munkáltatói márkával. EVP, karrieroldal, toborzási marketing.",
    metaTitle: "Employer Branding – Munkáltatói Márka Építés | G2A Marketing",
    metaDesc: "Employer branding: EVP fejlesztés, karrieroldal, toborzási marketing, munkáltatói kommunikáció. Vonzd a legjobb tehetségeket.",
    icon: "users",
    color: "#8b5cf6",
    intro: "A tehetséges munkavállalókért folyó verseny soha nem volt akkora, mint ma. Az erős munkáltatói márka nemcsak a toborzást könnyíti meg, hanem csökkenti a fluktuációt és növeli a munkavállalói elköteleződést.",
    benefits: [
      { title: "EVP fejlesztés", desc: "Employer Value Proposition – meghatározzuk, mi teszi egyedivé a munkáltatódat." },
      { title: "Karrieroldal", desc: "Vonzó karrieroldal tervezése és fejlesztése, amely konvertálja a jelölteket." },
      { title: "Toborzási marketing", desc: "Célzott toborzási kampányok LinkedIn, Facebook és egyéb platformokon." },
      { title: "Munkavállalói tartalmak", desc: "Autentikus munkavállalói történetek és tartalmak." },
      { title: "Glassdoor kezelés", desc: "Munkáltatói profil optimalizálása és vélemény kezelés." },
      { title: "Belső kommunikáció", desc: "Belső employer branding kampányok a megtartás növelésére." },
    ],
    process: [
      { step: "01", title: "Audit", desc: "Jelenlegi munkáltatói márka és toborzási folyamatok felmérése." },
      { step: "02", title: "EVP fejlesztés", desc: "Egyedi munkáltatói értékajánlat kidolgozása." },
      { step: "03", title: "Kommunikáció", desc: "Employer branding tartalmak és kampányok létrehozása." },
      { step: "04", title: "Mérés", desc: "Toborzási metrikák és munkavállalói elégedettség mérése." },
    ],
    faq: [
      { q: "Mikor érdemes employer brandinggel foglalkozni?", a: "Akkor, ha nehézségeid vannak a megfelelő jelöltek vonzásával, magas a fluktuáció, vagy szeretnéd megerősíteni a vállalati kultúrát." },
      { q: "Mennyi idő alatt láthatók az eredmények?", a: "Az employer branding hosszú távú befektetés. Az első eredmények (több és jobb minőségű jelöltek) 3-6 hónap után láthatók." },
      { q: "Hogyan mérik az employer branding sikerét?", a: "Time-to-hire, cost-per-hire, offer acceptance rate, employee NPS és Glassdoor értékelések alapján." },
    ],
    cta: "Kérd az ingyenes employer branding konzultációt",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "Nemzetközi Marketing",
    subtitle: "Globális terjeszkedés lokális szakértelemmel",
    heroDesc: "Lépj be új piacokra hatékonyan. Lokalizáció, multilingvális SEO, cross-border kampányok és kulturálisan adaptált kommunikáció.",
    metaTitle: "Nemzetközi Marketing – Globális Terjeszkedés | G2A Marketing",
    metaDesc: "Nemzetközi marketing: lokalizáció, multilingvális SEO, cross-border kampányok, kulturálisan adaptált kommunikáció. Terjeszkedj globálisan.",
    icon: "globe",
    color: "#06b6d4",
    intro: "A globális terjeszkedés komoly kihívásokat jelent – különböző kultúrák, nyelvek, szabályozások és fogyasztói szokások. Segítünk hatékonyan belépni új piacokra és adaptálni a marketing üzeneteket.",
    benefits: [
      { title: "Piacra lépési stratégia", desc: "Részletes elemzés és stratégia az új piacra való belépéshez." },
      { title: "Lokalizáció", desc: "Kulturálisan adaptált tartalmak és kommunikáció, nem csak fordítás." },
      { title: "Multilingvális SEO", desc: "Több nyelvű SEO stratégia és implementáció hreflang tagekkel." },
      { title: "Cross-border kampányok", desc: "Több országra kiterjedő hirdetési kampányok kezelése." },
      { title: "Kulturális adaptáció", desc: "A marketing üzenetek kulturális szempontok szerinti adaptálása." },
      { title: "Helyi partnerségek", desc: "Helyi influencerek és partnerek bevonása az új piacokon." },
    ],
    process: [
      { step: "01", title: "Piac elemzés", desc: "Célpiacok elemzése: versenyhelyzet, fogyasztói szokások, szabályozás." },
      { step: "02", title: "Stratégia", desc: "Piacra lépési és marketing stratégia kidolgozása." },
      { step: "03", title: "Lokalizáció", desc: "Tartalmak, hirdetések és weboldal lokalizálása." },
      { step: "04", title: "Kampányok", desc: "Helyi kampányok indítása és optimalizálása." },
    ],
    faq: [
      { q: "Milyen piacokra segítitek a terjeszkedést?", a: "Elsősorban európai piacokra specializálódtunk (DACH, CEE, Benelux, UK), de globális terjeszkedésben is tudunk segíteni." },
      { q: "Mi a különbség a fordítás és a lokalizáció között?", a: "A fordítás szó szerinti átalakítás, míg a lokalizáció kulturálisan adaptálja az üzenetet – figyelembe véve a helyi szokásokat, humor és értékeket." },
      { q: "Kell-e helyi iroda az új piacon?", a: "Nem feltétlenül. Digitális marketing eszközökkel fizikai jelenlét nélkül is hatékonyan lehet új piacokon értékesíteni." },
    ],
    cta: "Kérd az ingyenes nemzetközi marketing konzultációt",
  },
};

type Props = {
  params: { slug: string };
};

export default function NewServicePage({ params }: Props) {
  const config = SERVICE_CONFIGS[params.slug];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => { setStatus("success"); toast.success("Üzeneted megkaptuk! Hamarosan felvesszük veled a kapcsolatot."); },
    onError: () => { setStatus("error"); toast.error("Hiba történt. Kérjük, próbáld újra."); },
  });

  if (!config) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--g2a-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Navigation />
        <div style={{ textAlign: "center", color: "var(--g2a-text)" }}>
          <h1>Oldal nem található</h1>
          <Link href="/szolgaltatasok" style={{ color: "#e91130" }}>Vissza a szolgáltatásokhoz</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    contactMutation.mutate({ ...form, subject: `Érdeklődés: ${config.title}` });
  };

  return (
    <>
      <SeoHead title={config.metaTitle} description={config.metaDesc} />
      <div style={{ minHeight: "100vh", background: "var(--g2a-bg)" }}>
        <Navigation />

        {/* Hero */}
        <section style={{ padding: "8rem 0 5rem", background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${config.color}15 0%, transparent 60%)` }} />
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Link href="/szolgaltatasok" style={{ color: "var(--g2a-text-muted)", textDecoration: "none", fontSize: "0.875rem", fontFamily: "Roboto Mono, monospace" }}>
                Szolgáltatások
              </Link>
              <span style={{ color: "var(--g2a-text-muted)" }}>/</span>
              <span style={{ color: config.color, fontSize: "0.875rem", fontFamily: "Roboto Mono, monospace" }}>{config.title}</span>
            </div>
            <div style={{ width: "64px", height: "64px", borderRadius: "12px", background: `${config.color}18`, border: `1px solid ${config.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", color: config.color }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "Roboto Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{config.icon.slice(0, 3).toUpperCase()}</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", marginBottom: "1rem", lineHeight: 1.1 }}>
              {config.title}
            </h1>
            <p style={{ fontSize: "1.25rem", color: config.color, fontFamily: "Roboto Mono, monospace", marginBottom: "1.5rem" }}>
              {config.subtitle}
            </p>
            <p style={{ fontSize: "1.125rem", color: "var(--g2a-text-muted)", maxWidth: "600px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              {config.heroDesc}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/ingyenes-audit" className="g2a-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {config.cta} <ArrowRight size={16} />
              </Link>
              <a href="tel:+36301902575" className="g2a-btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <Phone size={16} /> Hívj minket
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <p style={{ fontSize: "1.2rem", color: "var(--g2a-text)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              {config.intro}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              Mit kapunk tőlünk?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {config.benefits.map((b, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "1.75rem", transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = config.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--g2a-border)")}>
                  <CheckCircle size={20} style={{ color: config.color, marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "0.5rem", fontFamily: "Roboto Mono, monospace" }}>{b.title}</h3>
                  <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              Hogyan dolgozunk?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
              {config.process.map((p, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${config.color}20`, border: `2px solid ${config.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontFamily: "Roboto Mono, monospace", fontWeight: 700, color: config.color, fontSize: "1.1rem" }}>
                    {p.step}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--g2a-text)", marginBottom: "0.75rem", fontFamily: "Roboto Mono, monospace" }}>{p.title}</h3>
                  <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.6, fontSize: "0.9rem" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", textAlign: "center", marginBottom: "3rem" }}>
              Gyakori kérdések
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {config.faq.map((f, i) => (
                <div key={i} style={{ background: "var(--g2a-surface)", border: "1px solid var(--g2a-border)", borderRadius: "0.75rem", overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", fontWeight: 600, textAlign: "left", fontSize: "0.95rem" }}>
                    {f.q}
                    {openFaq === i ? <ChevronUp size={18} style={{ color: config.color, flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "var(--g2a-text-muted)", flexShrink: 0 }} />}
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 1.5rem 1.25rem", color: "var(--g2a-text-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section style={{ padding: "5rem 0", background: "var(--g2a-surface)" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "clamp(1fr, 50%, 1fr) 1fr", gap: "4rem", alignItems: "start" }} className="g2a-layout-sidebar">
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", marginBottom: "1.5rem" }}>
                  Vegyük fel a kapcsolatot!
                </h2>
                <p style={{ color: "var(--g2a-text-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                  Töltsd ki az alábbi űrlapot, és 24 órán belül felvesszük veled a kapcsolatot egy ingyenes konzultáció egyeztetéséhez.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Phone size={16} style={{ color: "#e91130" }} />
                    <a href="tel:+36301902575" style={{ color: "var(--g2a-text)", textDecoration: "none" }}>+36 30 190 2575</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Mail size={16} style={{ color: "#e91130" }} />
                    <a href="mailto:info@g2amarketing.hu" style={{ color: "var(--g2a-text)", textDecoration: "none" }}>info@g2amarketing.hu</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--g2a-text-muted)" }}>
                    <Clock size={16} style={{ color: "#e91130" }} />
                    <span style={{ color: "var(--g2a-text)" }}>H–P: 08:00–17:00</span>
                  </div>
                </div>
              </div>
              <div style={{ background: "var(--g2a-bg)", border: "1px solid var(--g2a-border)", borderRadius: "1rem", padding: "2rem" }}>
                {status === "success" ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <CheckCircle size={48} style={{ color: "#22c55e", margin: "0 auto 1rem", display: "block" }} />
                    <h3 style={{ color: "var(--g2a-text)", fontFamily: "Roboto Mono, monospace", marginBottom: "0.5rem" }}>Köszönjük!</h3>
                    <p style={{ color: "var(--g2a-text-muted)" }}>Hamarosan felvesszük veled a kapcsolatot.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="g2a-label">Név *</label>
                      <input className="g2a-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Kovács János" />
                    </div>
                    <div>
                      <label className="g2a-label">Email *</label>
                      <input className="g2a-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="kovacs@ceg.hu" />
                    </div>
                    <div>
                      <label className="g2a-label">Telefon</label>
                      <input className="g2a-input" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+36 30 123 4567" />
                    </div>
                    <div>
                      <label className="g2a-label">Üzenet</label>
                      <textarea className="g2a-input" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={`Érdeklődöm a ${config.title} szolgáltatás iránt...`} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="g2a-btn-primary" disabled={status === "loading"} style={{ justifyContent: "center" }}>
                      {status === "loading" ? "Küldés..." : "Üzenet küldése"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
