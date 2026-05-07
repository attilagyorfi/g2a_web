import type { Language } from "@/contexts/LanguageContext";

/**
 * Multi-language service configuration for the 8 hard-coded service detail
 * pages rendered by `NewServicePage`. Each service has full HU/EN/ZH content
 * for: title, subtitle, heroDesc, intro, 6 benefits, 4 process steps, 3 FAQs,
 * cta. Shared (language-invariant): slug, icon, color.
 *
 * Lookup pattern: `SERVICE_CONFIGS[lang][slug]`. Slug-level fallback to HU
 * if a translation is missing (defensive — should never trigger in prod).
 */

export type ServiceConfig = {
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

// ─── HU ─────────────────────────────────────────────────────────────────────
const HU: Record<string, ServiceConfig> = {
  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI Marketing",
    subtitle: "Mesterséges intelligencia a marketing minden szakaszában",
    heroDesc:
      "A mesterséges intelligencia új távlatokat nyit a marketingben: pontosabb célzás, személyre szabott tartalom, prediktív elemzés. Csökkentjük a manuális munkát, és új bevételi lehetőségeket teremtünk.",
    metaTitle: "AI Marketing – Mesterséges intelligencia a marketingben | G2A Marketing",
    metaDesc:
      "Személyre szabott tartalmak, prediktív elemzés, automatizált hirdetésoptimalizáció és chatbotok. Tedd adatvezéreltté marketinged mesterséges intelligenciával.",
    icon: "bot",
    color: "#7c3aed",
    intro:
      "Az AI 2024-2026 között lett operatívan használható eszköz a marketingben — a hype-ot felváltotta a reális ROI. A G2A Marketing belső munkafolyamataiban napi szinten dolgozunk Claude, ChatGPT, Manus, Gemini, Midjourney, Runway, ElevenLabs és Cursor eszközökkel — a tartalomgyártástól az ügyfélprojektek auditjáig. Ezt a tapasztalatot hozzuk az ügyfél-projektekbe: nem ígéretként, hanem konkrét, mérhető folyamat-gyorsításként.",
    benefits: [
      {
        title: "Prediktív elemzés",
        desc: "Vásárlói minták előrejelzése (mikor vásárol legközelebb, mikor lemorzsolódik), kampány-eredmények szimulálása indítás előtt — Google AI + saját modellek alapján.",
      },
      {
        title: "Személyre szabott tartalom",
        desc: "Dinamikus email- és webtartalom: minden látogató a viselkedése alapján mást lát. HubSpot Smart Content + Mutiny + saját workflow alapján.",
      },
      {
        title: "Automatizált hirdetésoptimalizáció",
        desc: "Performance Max, Smart Bidding, Meta Advantage+ kampányok mesterséges intelligenciával — a kreatívokat és a célzást a Google/Meta AI iterálja, mi a stratégiai keretet és a tiltólistákat adjuk.",
      },
      {
        title: "Chatbot és AI ügynök integráció",
        desc: "24/7 ügyfélszolgálat AI chatbotokkal (Intercom Fin, Drift, vagy custom Claude API alapú megoldás). Tipikusan 60-70%-os first-touch resolution rate az 1. hónap után.",
      },
      {
        title: "AI-támogatott tartalomgyártás",
        desc: "Blog drafts, social copy, ad creatives — Claude + Midjourney + Runway hibrid pipeline-on. Heti tartalom-output 3-5x növelhető a minőség megtartásával.",
      },
      {
        title: "Konverzióoptimalizáció gépi tanulással",
        desc: "Prediktív A/B tesztek (előre megsaccoljuk melyik variáns nyer), AI-alapú UX heatmap-elemzés, dinamikus landing page elemek látogató-szegmens szerint.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Igényfelmérés és AI audit",
        desc: "Feltérképezzük a marketingfolyamataidat, megnézzük hol a legmagasabb ROI az AI-integrációnak — és hol fals barát. Konkrét javaslat-csomag KPI-okkal.",
      },
      {
        step: "02",
        title: "Adatstratégia és platform-választás",
        desc: "Az AI csak annyira jó amennyi tiszta adatod van. Adat-pipeline-t építünk (CDP, GA4, CRM event tracking) és kiválasztjuk a feladathoz illő AI eszközöket.",
      },
      {
        step: "03",
        title: "AI megoldások integrálása",
        desc: "Step-by-step bevezetés — egy folyamatot egyszerre. Pilot-tal kezdünk, mérünk, csak utána skálázunk. Soha nem 5 párhuzamos AI projekt egyszerre.",
      },
      {
        step: "04",
        title: "Mérés és iteráció",
        desc: "Havi review riport: az AI által hozott idő- és költségmegtakarítás vs. a beállítási költség. Kvartális stratégiai felülvizsgálat új eszközökkel.",
      },
    ],
    faq: [
      {
        q: "Mekkora cégeknek ajánlott az AI marketing?",
        a: "Minden méretnek, de más-más eszközökkel. KKV-knál a content + ad creative AI-támogatás (Claude + Midjourney + Runway) hozza a leggyorsabb megtérülést. Középvállalatnál a prediktív analitika és a CRM-AI integráció. Enterprise-nál a custom modell-fine-tuning saját adatra.",
      },
      {
        q: "Mennyi idő alatt láthatók az eredmények?",
        a: "Tartalom-pipeline gyorsítás: 2-3 hét. AI-támogatott hirdetés-optimalizáció: 4-6 hét. Prediktív analitika és személyre szabás: 3-4 hónap (mert adat kell hozzá). Custom AI ügynök: 6-9 hónap teljes ROI-hoz.",
      },
      {
        q: "Milyen AI eszközöket használtok konkrétan?",
        a: "LLM: Claude (1M token kontextushoz), ChatGPT (általános), Gemini (Workspace integráció), Manus (autonom ügynökök). Kép: Midjourney v7, DALL·E 3, Adobe Firefly. Videó: Runway Gen-4, Sora. Hang: ElevenLabs. Marketing-specifikus: HubSpot AI, Surfer, Frase, Clearscope. Részletes lista: /technologia oldal.",
      },
      {
        q: "Növeli-e az AI a hirdetések költségét?",
        a: "Rövid távon van egy beállítási költség (audit, integráció, tréning) — jellemzően egyszeri 300-800 ezer Ft. Hosszabb távon 20-40%-os hatékonyság-növekedést hoz: ugyanannyi spendből több konverzió, vagy ugyanannyi konverzió kevesebb spendből.",
      },
      {
        q: "Hogyan integrálható a meglévő rendszereinkkel?",
        a: "API-integrációval. A leggyakoribb: HubSpot/Salesforce CRM + Claude API ügyfél-emailezésre, GA4 + Google AI prediktív analitikára, Intercom + custom RAG (saját ügyféldokumentum-bázis) chatbothoz. A G2A írja meg a workflow-kat, te csak a végén kapod a kész integrációt.",
      },
      {
        q: "Mi a helyzet a GDPR-ral és az adatvédelemmel?",
        a: "Az AI eszközök közül kiválasztjuk azokat, amelyek EU-régióban dolgoznak vagy szerződéses garanciával nem használják az adataidat tréningre. OpenAI, Anthropic és Google enterprise verziói mind biztosítanak ilyen opciót. A G2A nem küld ügyfél-adatot OpenAI free tieres végpontra — kizárólag enterprise/zero-retention végpontokon.",
      },
    ],
    cta: "Kérd az ingyenes AI marketing auditot",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC és Google Ads",
    subtitle: "Fizetett hirdetés, ami megtérül — minden Google csatornán",
    heroDesc:
      "Fizetett hirdetések nélkülözhetetlenek, ha gyorsan akarsz új ügyfeleket. Adatvezérelt PPC kampányokat építünk a Google keresőben, Display Networkön, Shoppingon és YouTube-on — mindig az üzleti céljaidhoz igazítva.",
    metaTitle: "PPC és Google Ads szakértői szolgáltatás | G2A Marketing",
    metaDesc:
      "Adatvezérelt PPC kampányok: Search, Display, Shopping, YouTube és Performance Max. Több platform, egyetlen stratégia — mérhető ROI a G2A Marketinggel.",
    icon: "target",
    color: "#ea4335",
    intro:
      "A Google Ads 2026-ra szinte mindenhol „smart bidding” alapú lett — ami azt jelenti, hogy a manuális bid menedzsment kora véget ért, és helyébe a stratégia, a struktúra és a konverzió-jelek minősége lépett. A modern Google Ads ügynökség munkája ma 30%-ban kreatív, 30%-ban adat-engineering, 20%-ban tracking-setup és 20%-ban stratégia. A G2A pontosan ezt a kombinációt szállítja.",
    benefits: [
      {
        title: "Search Ads",
        desc: "Kulcsszó-alapú hirdetések kereső szándékkal. SKAG vagy SPAG kampánystruktúra, broad match + audience signal, dinamikus search ads (DSA) hosszú-tail keresésre.",
      },
      {
        title: "Display Network és YouTube",
        desc: "Vizuális hirdetések a Google partnerhálózatán + YouTube-on. TrueView for Action és Demand Gen kampányok, retargeting az egész web-en.",
      },
      {
        title: "Shopping (e-kereskedelem)",
        desc: "Termék-alapú hirdetések webshopoknak. Merchant Center feed-optimalizálás, kategória-szintű tender stratégia, custom labels szezonalitásra.",
      },
      {
        title: "Performance Max",
        desc: "Cross-channel AI-kampány. Asset group struktúra ügyfél-szegmensenként, audience signal stratégia, brand exclusion + tiltólista — hogy ne kannibalizálja a Search-öt.",
      },
      {
        title: "Remarketing és audience",
        desc: "Customer Match listák (e-mail upload), website-visitor remarketing, similar audience, lookalike. A LTV-alapú szegmens stratégia.",
      },
      {
        title: "Konverziókövetés és tracking",
        desc: "GA4 + Google Tag Manager + enhanced conversions + offline conversion import (CRM-ből visszaszinkronizálva). Pontos attribution az értékesítésig.",
      },
    ],
    process: [
      {
        step: "01",
        title: "PPC audit",
        desc: "Szabad fiók-átvilágítás (vagy ha nincs, kulcsszó-térkép). Mérjük a Quality Score-t, a wasted spend %-ot, a konverzió-tracking pontosságát. Azonnal használható javaslatlista.",
      },
      {
        step: "02",
        title: "Kulcsszó- és audience-kutatás",
        desc: "Iparág-specifikus kulcsszó-térkép, intent-szegmenseléssel. Versenytárs ad copy elemzés. Audience-listák felépítése (1st party + Customer Match + similar).",
      },
      {
        step: "03",
        title: "Kampányfelépítés és launch",
        desc: "SKAG/SPAG struktúra, ad copy variánsok (4-6 / ad group), responsive search ads, image extension. Indulás előtt teljes tracking-validation.",
      },
      {
        step: "04",
        title: "Heti optimalizáció és riport",
        desc: "Heti negative keyword bővítés, ad copy iteráció, audience tuning. Havi teljes riport: Search Term riport, Auction Insights, ROAS trend. Kvartálos stratégiai review.",
      },
    ],
    faq: [
      {
        q: "Mekkora költségvetséggel érdemes kezdeni?",
        a: "Iparágtól függ erősen. Helyi szolgáltatás (fodrász, autószerviz): 100-200 ezer Ft/hó. KKV B2B vagy webshop: 300-800 ezer Ft. Középvállalat / e-commerce: 1-3M Ft+. A magas CPC-jű iparágakban (jog, biztosítás, finanszírozás) 800 ezer Ft alatt nehéz mérhető eredményt elérni.",
      },
      {
        q: "Mi a különbség a Search és a Performance Max között?",
        a: "Search = pontos kulcsszó-célzás keresési szándékkal — több kontroll, alacsonyabb skálázhatóság. Performance Max = AI-vezérelt cross-channel — kevesebb kontroll, sokkal nagyobb skálázhatóság. Optimális stratégia: Search a brand + magas-intent kulcsszókra, Performance Max a discovery + új ügyfél-akvizícióra.",
      },
      {
        q: "Kezeltek YouTube és Shopping kampányt is?",
        a: "Igen, mind a négy fő kampánytípust (Search, Display + YouTube, Shopping, Performance Max). YouTube-ra dedikált videós kreatív partnert is tudunk hozni, Shopping-hoz Merchant Center feed optimalizálás (TecDoc/Carzone autóipari, vagy custom WooCommerce/Shopify feed).",
      },
      {
        q: "Hogyan mérjük a kampány sikerét?",
        a: "Konverziók, CPA (cost per acquisition), ROAS (return on ad spend) — alapokon. Plus: Quality Score átlag, Search Impression Share, brand vs non-brand revenue split. Webshopnak: CLV-alapú ROAS (nem csak az első vásárlás, hanem 12 hónapos érték).",
      },
      {
        q: "Mennyi az ügynökségi díj?",
        a: "Két modell: (1) fix retainer (200-600 ezer Ft/hó a kampány-méret függvényében); (2) media spend %-a (10-15%, jellemzően nagyobb kampányoknál). A G2A nem rejt el platform-számlát — minden hirdetési költés közvetlenül a te kártyádról megy a Google-nek.",
      },
      {
        q: "Szükséges-e hosszú távú szerződés?",
        a: "Nem, 30 napos felmondási idővel működünk. De őszintén: Google Ads-ben 2-3 hónap kell ahhoz hogy a smart bidding tanuljon, a Quality Score stabilizálódjon, és valódi optimalizációs munka történjen. 1-hónapos kísérletezés ritkán szállít.",
      },
    ],
    cta: "Kérd az ingyenes Google Ads auditot",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta Ads (Facebook + Instagram)",
    subtitle: "Közösségi média hirdetés, ami konverziót szállít",
    heroDesc:
      "A közösségi média hirdetésekkel pontosan azt a célcsoportot érjük el, amely a legnagyobb valószínűséggel válik ügyféllé. Kreatív és adatvezérelt kampányokat tervezünk a Meta (Facebook, Instagram) és LinkedIn platformokon — amelyek nem csak elérést, hanem valódi konverziót hoznak.",
    metaTitle: "Meta Ads és közösségi média hirdetés | G2A Marketing",
    metaDesc:
      "Eredményorientált Facebook, Instagram és LinkedIn hirdetéskezelés. Célközönség-szegmentálás, kreatív készítés, A/B tesztelés és ROI-optimalizálás.",
    icon: "smartphone",
    color: "#1877f2",
    intro:
      "A Meta platformokon (Facebook + Instagram) magyar viszonylatban naponta 6+ millió aktív felhasználó mozog. A 2021-es Apple iOS 14.5 ATT-változás óta a célzás bizonytalanabb lett — emiatt 2026-ban a Meta Ads sikere kulcsban a kreatívra és a Conversion API-ra esik. A G2A pontosan ezekre fókuszál: gyors kreatív-iteráció + tiszta server-side conversion tracking.",
    benefits: [
      {
        title: "Facebook Ads (CBO + ASC)",
        desc: "Campaign Budget Optimization vagy Advantage+ Shopping Campaigns. Audience signal stratégia, cold + warm + hot funnel-szakaszok elkülönítése.",
      },
      {
        title: "Instagram Ads (Stories + Reels)",
        desc: "Reels-first kreatív stratégia (a Reels-eken jelenleg legolcsóbb a CPM). Stories swipe-up integráció, mobil-first élmény.",
      },
      {
        title: "LinkedIn Ads (B2B)",
        desc: "Sponsored Content, Message Ads, Lead Gen Forms B2B targeting-gel. Cég-méret, szerepkör, iparág + matched audience kombinációk.",
      },
      {
        title: "Lookalike és Custom Audience",
        desc: "1%-os, 3%-os, 5%-os lookalike szegmensek, a legjobb 10% LTV-jű ügyfél seed-jén. Customer Match e-mail upload + website visitor.",
      },
      {
        title: "Lead Generation Ads",
        desc: "On-platform lead form-ok — a felhasználó nem hagyja el a Facebookot. Magasabb konverzió, alacsonyabb CPL, de gyengébb lead-minőség (pre-screening kérdések kellenek).",
      },
      {
        title: "Conversion API + Pixel",
        desc: "Server-side esemény-küldés (post-iOS14 megoldás). Stripe/HubSpot/Shopify integráció + offline conversion import a CRM-ből.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pixel + CAPI telepítés",
        desc: "Meta Pixel + Conversion API beállítása teljes server-side eseménysorral. Event Match Quality 70%+ cél (a 30%-os átlaggal szemben) — ez 20-30%-kal javítja a kampány-teljesítményt.",
      },
      {
        step: "02",
        title: "Audience-térkép és kreatív brief",
        desc: "Cold + warm + hot szegmens definíció. Versenytárs ad library mining (Meta Ad Library + Foreplay). Kreatív brief 5-8 koncepcióval.",
      },
      {
        step: "03",
        title: "Kreatív gyártás és launch",
        desc: "5-8 kreatív variáns / ad set (statikus + video + carousel + UGC stílus). Indulás 50/50 cold-warm split, gyors első hét tanulása.",
      },
      {
        step: "04",
        title: "Iteráció és skálázás",
        desc: "Heti kreatív rotáció (creative fatigue elleni stratégia), audience expansion. Skálázás CBO-n keresztül, ad set duplikáció a winning kreatívokra.",
      },
    ],
    faq: [
      {
        q: "Mennyi idő alatt kezdhetünk hirdetni?",
        a: "1-2 héten belül felépítjük a struktúrát: Pixel + Conversion API setup (3-4 nap), audience-térkép (2 nap), első kreatív-batch (5-7 nap). Indulás után az első tanuló-fázis 7-14 nap.",
      },
      {
        q: "Mitől függ a kampány költségvetése?",
        a: "Iparág (CPM 600-3500 Ft, jellemzően), célcsoport-méret (kisebb = drágább kreatív kell), és a funnel-szakasz. Reális minimum: havi 200-400 ezer Ft helyi vállalkozásnak; 600 ezer–1.5M Ft webshopnak vagy B2B leadgennek.",
      },
      {
        q: "Milyen kreatívokra van szükség?",
        a: "2026-ban Reels-first: 9:16 vertikális videó (15-30 mp), feliratokkal (a 80% mute néz), gyors hook (első 1-2 mp). Mellé statikus carousel és UGC stílusú felvételek. A G2A vagy partner-stúdióval gyártjuk, vagy a saját anyagaidat optimalizáljuk.",
      },
      {
        q: "Tudtok organikus social media stratégiában is segíteni?",
        a: "Igen, dedikált közösségi média menedzsment szolgáltatás van: tartalomnaptár, content gyártás, közösség-moderáció, influencer-kapcsolatok. A két szolgáltatás (organikus + paid) együtt 2-3x hatékonyabb mint külön-külön.",
      },
      {
        q: "Hogyan mérjük a sikerességet?",
        a: "CPC (kattintási költség), CPM (ezer megjelenés ár), CTR, CPA (cost per acquisition), ROAS (return on ad spend) — alapokon. Plus: Brand Lift Study (nagyobb kampányoknál), iOS 14.5 utáni privacy-conscious attribution model.",
      },
      {
        q: "Mi a helyzet az iOS 14.5 utáni nyomon-követéssel?",
        a: "Az ATT (App Tracking Transparency) miatt a Pixel csak részleges adatot kap. Ezért fontos a Conversion API: server-side eseménykövetés, ami iOS-en is működik. A G2A minden új projekten alapból CAPI-t telepít (nem opcióként).",
      },
    ],
    cta: "Kérd az ingyenes Meta Ads auditot",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "Tartalommarketing",
    subtitle: "Értékteremtő történetek, amelyek eladnak",
    heroDesc:
      "A tartalommarketing nem csak cikkek gyártásáról szól; stratégiát alkotunk, amely hitelesen közvetíti márkád értékeit és a közönséged problémáira kínál megoldást. Blogtól videóig, podcasttől hírlevélig — segítünk a tervezésben, gyártásban és terjesztésben.",
    metaTitle: "Tartalommarketing és szövegírás | G2A Marketing",
    metaDesc:
      "Építs márkahitelességet és organikus forgalmat. Blogírás, videó- és podcast-tartalom, hírlevelek, edukatív anyagok KKV-knak és B2B cégeknek.",
    icon: "pen",
    color: "#10b981",
    intro:
      "A B2B és KKV-szegmensben a tartalommarketing a legjobb hosszú-távú befektetés: 1 jól megírt long-form cikk 3-5 évig hozhat organikus forgalmat. Ugyanakkor 2026-ban a Google AI Overviews és a ChatGPT-keresés átalakítja a játékot — most már nem elég jó tartalmat írni, hanem strukturáltan, schema-val, kérdés-választos formában kell, hogy az AI-keresés is referenciának használja.",
    benefits: [
      {
        title: "Blogstratégia és long-form cikkek",
        desc: "Kulcsszó-térkép és cluster-stratégia (pillar + cluster), 1500-3500 szavas cikkek. Schema.org Article/FAQ markup, AI Overviews-ra optimalizált formátum.",
      },
      {
        title: "Videó és podcast",
        desc: "Forgatókönyvírás, YouTube SEO (cím, leírás, fejezet-jelölők), thumbnail A/B teszt. Podcast: téma-strukturálás, gyártás, vágás, terjesztés (Spotify/Apple/YouTube).",
      },
      {
        title: "Hírlevél és leadmágnes",
        desc: "Heti/havi hírlevél stratégia (témaválasztó automatizációval), e-book és whitepaper-gyártás email-feliratkozással szemben. Resend/Mailchimp integrációval.",
      },
      {
        title: "Thought leadership és LinkedIn",
        desc: "A vezető személyiség nevén futó cikkek és LinkedIn-poszt sorozatok. Iparági trend-elemzések, vélemény-cikkek, élethelyzet-narratívák — a brandet humanizálva.",
      },
      {
        title: "Tartalomterjesztés és PR",
        desc: "Owned (saját) + earned (PR) + paid (boost) háromrétegű terjesztés. Outreach iparági médiához, vendégblogolás, performance PR.",
      },
      {
        title: "Esettanulmány és portfólió",
        desc: "Strukturált case study sablonok: kihívás → megoldás → eredmény → tanulság. Anonimizált verzió szigorú titkosítási megállapodásokhoz.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Kutatás és téma-térkép",
        desc: "Kulcsszó-kutatás (Ahrefs/Semrush + AlsoAsked), versenytárs gap-elemzés, ICP interjú (3-5 ügyfél). Output: 6-12 hónapra szóló téma-térkép.",
      },
      {
        step: "02",
        title: "Stratégia és tartalomkalendárium",
        desc: "Pillar-cluster struktúra, cikk-szintű brief minden témára (kulcsszó, cél, struktúra, belső link). Megkapod a tartalomnaptárt, te jóváhagyod.",
      },
      {
        step: "03",
        title: "Gyártás és optimalizáció",
        desc: "Cikk-gyártás (AI-asszisztált, de mindig emberi végszerkesztéssel), SEO-szerkesztés (Surfer/Frase), schema markup, belső link háló. Heti 1-3 cikk.",
      },
      {
        step: "04",
        title: "Terjesztés és mérés",
        desc: "Owned (saját csatornák), earned (PR outreach), paid (boost). Havi riport: organikus forgalom, ranking, engagement, konverzió. Kvartálos téma-pivot.",
      },
    ],
    faq: [
      {
        q: "Mennyi idő alatt jelennek meg az első eredmények?",
        a: "Long-tail kulcsszavakra 3-4 hónap (Google indexelés + ranking-növekedés). Versenyzettebb kulcsszavakra 6-9 hónap. Brandépítés és authority: 12-18 hónap. Az első hónapokban a folyamatos publikálás a kritikus, nem a forgalom.",
      },
      {
        q: "Tudtok videós tartalom gyártásban is segíteni?",
        a: "Igen. Két modell: (1) full-service partner videós stúdióval (forgatókönyv → forgatás → vágás → SEO); (2) AI-asszisztált gyártás (Claude script + ElevenLabs voice + Runway visual). A választás a brand-igényen és a büdzsén múlik.",
      },
      {
        q: "Milyen kulcsszó-stratégiát követtek?",
        a: "Pillar-cluster modell. 1 fő pillar-oldal (széles téma, pl. „digitális marketing KKV-knak”) + 8-15 cluster-cikk (specifikus al-témák, pl. „lokális SEO tippek”, „Meta Ads kis cégeknek”). Belső linkkel minden cluster a pillar-ra mutat. AI Overviews-okra optimalizált FAQ-section minden cikkben.",
      },
      {
        q: "Hogyan mérjük a tartalom sikerét?",
        a: "Top-of-funnel: organikus forgalom, kulcsszó-ranking, content sharing. Middle-of-funnel: page-engagement (idő az oldalon, scroll-mélység), email-feliratkozás. Bottom-of-funnel: blog-attribution (HubSpot multi-touch) — melyik cikk hány %-ban hozzájárult a tényleges szerződéshez.",
      },
      {
        q: "Mekkora befektetés szükséges?",
        a: "Belépő szint (havi 2 cikk + tartalomnaptár): 200-300 ezer Ft/hó. Komoly tartalom-engine (heti 1-2 cikk + LinkedIn + hírlevél): 500-900 ezer Ft. Premium (heti 3 cikk + videó + podcast): 1.2-2.5M Ft.",
      },
      {
        q: "Mit jelent az AI Overviews-ra optimalizálás?",
        a: "A Google 2024-2025-ben bevezetett AI Overviews (és a ChatGPT-keresés) másféleképpen idéz cikkeket: rövid, kérdés-válasz alapú, autoritás-jelekkel ellátott szakaszokat keres. Tehát ma a long-form cikknek kell strukturáltan tartalmaznia FAQ-section-t, lépéssorrendet, és listákat — különben az AI-keresés átugrik rajta.",
      },
    ],
    cta: "Kérd az ingyenes tartalom auditot",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "Marketing Automatizáció",
    subtitle: "Hatékonyság mesterséges intelligenciával támogatva",
    heroDesc:
      "Időt és erőforrást takaríthatsz meg, ha ismétlődő marketingfolyamataidat automatizálod. Felépítjük az email- és CRM rendszeredet úgy, hogy minden érdeklődő a megfelelő üzenetet kapja a megfelelő pillanatban.",
    metaTitle: "Marketing automatizáció — Email és CRM | G2A Marketing",
    metaDesc:
      "Építs automatizált marketingfolyamatokat: email automatizáció, CRM integráció, lead nurturing, sales funnel és szegmentálás. AI-támogatott szegmentáció.",
    icon: "zap",
    color: "#f59e0b",
    intro:
      "A marketing automatizáció akkor működik, ha a teljes ügyfélút (lead → érdeklődő → vevő → ismétlődő vásárló) többszereplős workflow-ja le van modellezve. A G2A először a sales-marketing alignment-tel kezd: definiáljuk az MQL-SQL-Opportunity-Won definíciókat, és csak utána épít automatizációt — különben hiába az okos workflow, ha a sales és a marketing más nyelven beszél.",
    benefits: [
      {
        title: "Email automatizáció",
        desc: "Üdvözlő sorozatok, lead nurturing flow-k, vásárlás utáni follow-up, win-back kampányok. Trigger: weboldal-viselkedés, e-mail open, demo-igénylés, vásárlás-összeg.",
      },
      {
        title: "CRM integráció",
        desc: "HubSpot, Salesforce, ActiveCampaign, Pipedrive, Odoo, Zoho beállítás és kétirányú szinkronizáció. Custom field térkép a konkrét ügyfél igénye szerint.",
      },
      {
        title: "Lead scoring és minősítés",
        desc: "Explicit (cégméret, szerepkör) + implicit (oldalviselkedés, e-mail engagement) szorzós scoring rendszer. Hot lead 60+, MQL 30-59, raw 0-29.",
      },
      {
        title: "Sales funnel és pipeline",
        desc: "Konverzióorientált útvonalak (lead → demo → POC → szerződés), upsell és cross-sell automatizációk. HubSpot Deal-stage workflow.",
      },
      {
        title: "Szegmentáció (AI-támogatott)",
        desc: "Viselkedés-alapú dinamikus szegmensek: a Claude/GPT API-t használjuk e-mail content-perszonalizációhoz minden szegmensnek. Optimális küldési időpont prediktív modellel.",
      },
      {
        title: "Reporting és dashboard",
        desc: "Automatikus heti/havi riport (Looker Studio + HubSpot Reports). Multi-touch attribution: melyik csatorna hány %-ban járult hozzá a végső szerződéshez.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Folyamat-feltérképezés",
        desc: "Sales-marketing együtt-ülés (1-2 nap): jelenlegi lead-flow rajzolása, szakaszok definiálása, gyenge pontok azonosítása. Output: konkrét automatizálási roadmap.",
      },
      {
        step: "02",
        title: "Platform-választás",
        desc: "HubSpot vs Marketo vs ActiveCampaign vs Mailchimp döntés a cég-méretre, IT-stack-re és CRM-szükségletre szabva. Migrációs terv, ha váltani kell.",
      },
      {
        step: "03",
        title: "Workflow-fejlesztés",
        desc: "1 workflow / 2 hét tempóban épülnek a folyamatok. Welcome series → lead nurture → handoff to sales → onboarding → upsell. Tesztelés minden lépés után.",
      },
      {
        step: "04",
        title: "Tesztelés és iteráció",
        desc: "A/B teszt minden subject line + CTA + send time. Havi review-meeting: KPI-növekedés, hibátlan workflow ellenőrzés, új use-case-ek priorizálása.",
      },
    ],
    faq: [
      {
        q: "Milyen platformokkal dolgoztok?",
        a: "HubSpot (kis-középvállalat full-stack), Marketo (enterprise), ActiveCampaign (KKV email + CRM), Mailchimp (alap email), Klaviyo (e-commerce), Pipedrive + Mailchimp combo (sales-első), Odoo (ERP-első), Zoho (cost-effective full-stack). Custom integrációkban: Zapier, Make.com, n8n.",
      },
      {
        q: "Mennyi idő az implementáció?",
        a: "Alap email automatizáció + CRM integráció: 2-4 hét. Lead-scoring + sales funnel: 4-6 hét. Multi-touch attribution + revenue dashboard: 6-8 hét. Komplex enterprise migráció (pl. Salesforce-ról HubSpot-ra): 3-6 hónap.",
      },
      {
        q: "Mi kell az induláshoz?",
        a: "Meglévő ügyféladatbázis (akár Excel — segítünk a migrálásban), üzleti folyamat-térkép (ha nincs, közösen rajzoljuk), és sales-marketing együttműködési készség (ez a legfontosabb). Tech-stack alapra még nem kell előre dönteni — kiválasztjuk együtt.",
      },
      {
        q: "Hogyan segít az AI a szegmentálásban?",
        a: "Két szinten: (1) prediktív modellek (mikor lép vásárlóra, mikor lemorzsolódik, mi a legjobb send time per ügyfél); (2) generatív személyre-szabás (Claude API-val a base e-mail templátot átírjuk minden szegmens igényére, anélkül hogy 20 verziót kéne kézzel írni).",
      },
      {
        q: "Mennyibe kerül havonta?",
        a: "Setup: egyszeri 600 ezer–2.5M Ft a komplexitástól függően. Havi management: 200-600 ezer Ft (alap WF-k karbantartása, új kampányok, riport). Platform-licenc külön — HubSpot Pro 50 ezer Ft/hó környékén indul, Marketo 200+ ezer Ft.",
      },
      {
        q: "Hogyan mérjük a marketing automatizáció ROI-ját?",
        a: "Idő-megtakarítás: hány óra manuális munka váltódott workflow-ra (jellemzően 30-50% csökkenés a marketing-csapat manuális idejében). Konverziós hatás: lead → SQL és SQL → won deal arány javulása (jellemzően 15-30% lift). Pipeline-velocity: átlagos sales-cycle rövidülése (10-25%).",
      },
    ],
    cta: "Kérd az ingyenes automatizáció auditot",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG Kommunikáció",
    subtitle: "Fenntarthatóság hitelesen — greenwashing nélkül",
    heroDesc:
      "A fenntarthatósági erőfeszítéseidet úgy kommunikáljuk, hogy a vásárlók, befektetők és a beszállítói lánc ténylegesen elhiggyék — adatokkal alátámasztva, az EU Green Claims Directive és a hazai jogszabályi környezet szellemében. A hivatalos ESG-jelentéstételt és -tanúsítást SZTFH-regisztrált partnerek végzik.",
    metaTitle: "ESG Kommunikáció és fenntarthatósági marketing | G2A Marketing",
    metaDesc:
      "Greenwashing-mentes ESG és CSR kommunikáció: stakeholder üzenetek, zöld marketing, weboldali ESG-szekció, rating-előkészítés. Hivatalos ESG-jelentést SZTFH-regisztrált partnerek készítenek.",
    icon: "leaf",
    color: "#22c55e",
    intro:
      "Tisztázzuk a hatáskört rögtön az elején: a G2A Marketing Bt. NEM rendelkezik a Szabályozott Tevékenységek Felügyeleti Hatósága (SZTFH) általi regisztrációval, ezért a 2023. évi CVIII. törvény szerinti hivatalos ESG-tanácsadói és ESG-tanúsítási tevékenységet nem végezzük — a kötelező CSRD-jelentés készítését és tanúsítását SZTFH-regisztrált partnerekre bízzuk vagy ajánljuk hozzá szakértőt. Amit mi vállalunk: az ESG-stratégia kommunikációs oldala, a stakeholder-üzenetek megfogalmazása, a brand-narratíva, a marketing-szintű content és a rating-előkészítés. Ügyvezetőnk, Győrfi Attila ESG specialistaként hozzáadott háttérrel ad informális szakmai tanácsot — de ez nem helyettesíti a hivatalos, regisztrált ESG-tanácsadást.",
    benefits: [
      {
        title: "ESG kommunikációs stratégia",
        desc: "A regisztrált tanácsadód által készített double materiality assessment OUTPUT-ját átfordítjuk hiteles külső kommunikációvá. Stakeholder-térkép és priorizált üzenethierarchia.",
      },
      {
        title: "ESG kommunikációs anyagok és design",
        desc: "Weboldali ESG-szekció, a hivatalos éves jelentés design-ja és narratív oldala (a hivatalos tartalmat a regisztrált auditor adja, mi olvashatóvá és brand-konzisztenssé tesszük), social media + LinkedIn poszt-sorozatok.",
      },
      {
        title: "Greenwashing-mentes zöld marketing",
        desc: "ISO 14021 Type II environmental claims szerint hiteles, adatokkal alátámasztott állítások. EU Green Claims Directive 2026-os követelményeire felkészített megfogalmazás.",
      },
      {
        title: "Stakeholder kommunikáció",
        desc: "Befektetői IR-kommunikáció, ügyfél-irányú zöld marketing, munkavállalói belső ESG-kampányok — mindegyik más nyelven, más csatornán, jogi felülvizsgálattal.",
      },
      {
        title: "CSR tartalmak és kampányok",
        desc: "Volunteer-day storytelling, partnership case study, helyi közösségi projekt kommunikáció. A CSR-t a brandet építő narratívává formáljuk — ez tisztán kommunikációs munka, nem szabályozott terület.",
      },
      {
        title: "Rating-előkészítés (kommunikációs oldal)",
        desc: "EcoVadis / CDP / MSCI ESG önértékelési kérdőívek kommunikációs oldalának előkészítése: a válaszok strukturált megfogalmazása. A tényleges adatokat és értékelést a vállalat vagy a regisztrált tanácsadó szállítja.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Hatáskör-tisztázás és gap-elemzés",
        desc: "Első találkozón egyértelműen elhatároljuk: mit végez a regisztrált ESG-tanácsadó / auditor (vagy melyik partnerünket ajánljuk), és mit veszünk át mi a kommunikációs oldalon. Output: szerepkör-mátrix, hogy a határvonalak érthetőek legyenek minden érintettnek.",
      },
      {
        step: "02",
        title: "Kommunikációs stratégia és üzenetrendszer",
        desc: "A regisztrált tanácsadó által szolgáltatott ESRS-adatokat átfordítjuk publikus kommunikációra. Üzenethierarchia: enterprise → ágazat → konkrét akció. Kockázat-elemzés: mit lehet és mit nem szabad jogszerűen állítani.",
      },
      {
        step: "03",
        title: "Tartalom-fejlesztés és design",
        desc: "Az éves jelentés vizuális design-ja és narratívája (a hivatalos szakmai tartalmat a regisztrált auditor szállítja), weboldali ESG-szekció, LinkedIn-kampány, ügyfél-levelek, sajtóanyag. EU Taxonomy összhang ellenőrzés.",
      },
      {
        step: "04",
        title: "Terjesztés és stakeholder-engagement",
        desc: "Befektetői road-show prezentáció, ügyfél-newsletter, sajtótájékoztató. Évente megújuló kommunikációs tartalom. EcoVadis / CDP / MSCI rating-előkészítés a kommunikációs oldalon.",
      },
    ],
    faq: [
      {
        q: "Készítenek hivatalos ESG-jelentést cégünknek?",
        a: "Nem, és ezt egyértelműen tisztázzuk: a G2A Marketing Bt. NEM rendelkezik az SZTFH által kiadott ESG-tanácsadói vagy ESG-tanúsítási regisztrációval (2023. évi CVIII. tv.), ezért hivatalos CSRD-jelentés készítését és tanúsítását nem vállaljuk. Mi a kommunikációs oldalon dolgozunk: a regisztrált tanácsadó / auditor által készített hivatalos dokumentumot olvashatóvá és brand-konzisztenssé tesszük, stakeholder-üzeneteket fogalmazunk, weboldali ESG-szekciót és kampányt építünk. A hivatalos jelentéstételhez SZTFH-regisztrált partnereket javasolunk.",
      },
      {
        q: "Kötelező-e nekünk a CSRD szerinti ESG-jelentés?",
        a: "A magyar átültetés (2023. évi CVIII. tv.) alapján 2024-től fokozatosan kötelező: nagyvállalatok (250+ fő, 40+ M € forgalom, 20+ M € mérlegfőösszeg — legalább 2 a 3-ból) elsőként, majd 2026-tól a tőzsdei KKV-k. Kis cégek számára egyelőre önkéntes, de a B2B beszállítói láncon keresztül a nagyok elvárják. A pontos kötelezettség-meghatározáshoz mindenképp regisztrált ESG-tanácsadót vagy könyvvizsgálót keressetek — mi nem adunk jogi minősítést.",
      },
      {
        q: "Mi a különbség az ESG és a CSR között?",
        a: "CSR (Corporate Social Responsibility): önkéntes, narratíva-alapú vállalati felelősségvállalás — ezzel kapcsolatban tisztán kommunikációs munkát végzünk, nincs szabályozási korlát. ESG (Environmental, Social, Governance): jogszabály által szabályozott, KPI-okkal és kötelező auditálással ellátott keretrendszer — ennek hivatalos része SZTFH-regisztrált szakértőkre tartozik, mi csak a kommunikációs oldalt vesszük át.",
      },
      {
        q: "Hogyan kerüljük el a greenwashing-ot?",
        a: "Három alapelv a kommunikációban: (1) Csak adatokkal igazolt állítás (nincs „természet-barát”, csak „95% újrahasznosított anyag, ISO 14021 Type II tanúsítva”); (2) Teljes lifecycle-szemlélet a fogalmazásban; (3) Független audit-ra történő hivatkozás minden konkrét számnál. Az EU Green Claims Directive 2026-tól ezeket törvényileg is kikényszeríti — ezért minden zöld kommunikációs anyagunkat ezen elvek szerint formáljuk meg.",
      },
      {
        q: "Tudtok-e ESG-rátingen javítani?",
        a: "EcoVadis, CDP, MSCI ESG Ratings esetén a kommunikációs oldalon segítünk: az önértékelési kérdőívek válaszainak megfogalmazása úgy, hogy a tényleges teljesítményt a legjobb fényben mutassa be. A számszerű adatokat és a tényleges értékelést a cég maga vagy a regisztrált ESG-tanácsadó szállítja. Ha az alap-aktivitás megvan és csak a dokumentáció + kommunikáció gyenge, jellemzően EcoVadis Bronze → Silver lift 6-12 hónap alatt elérhető.",
      },
      {
        q: "Mibe kerül az ESG kommunikáció?",
        a: "Kis vállalat (önkéntes ESG-kommunikáció, weboldali ESG-szekció + 1 éves anyag): 600 ezer–1.5M Ft. Nagy KKV (a regisztrált auditor jelentése köré épített kommunikációs csomag): 1.5-3M Ft. Enterprise (folyamatos IR és stakeholder-kommunikáció): 3-7M Ft / év. A regisztrált ESG-tanácsadó / könyvvizsgáló díja (1-15M Ft a méret függvényében) ezen felül és tőlünk függetlenül merül fel.",
      },
      {
        q: "Hogyan találunk SZTFH-regisztrált ESG-tanácsadót vagy auditort?",
        a: "Az SZTFH nyilvánosan vezeti az ESG-tanácsadói és ESG-tanúsítói névjegyzéket — érdemes a hatóság hivatalos honlapján ellenőrizni. Mi nem szerepelünk a listán, de partnerként több regisztrált auditor-céggel együtt dolgozunk hosszabb ideje, és igény esetén bemutatunk olyat, amelyik az iparágadhoz és a cég-méretedhez illik. A választás és a szerződéskötés köztetek történik, mi nem közvetítünk jutalékért.",
      },
    ],
    cta: "Kérd az ingyenes ESG kommunikációs tanácsadást",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "Employer Branding",
    subtitle: "Munkáltatói márka, ami tehetséget vonz",
    heroDesc:
      "A magyar munkaerő-piac 2025-2026-ban historikus kihívást támasztott: 2.5%-os munkanélküliségi ráta, magas fluktuáció, generációs különbségek a Z és Y munkavállalók között. Az erős munkáltatói márka nem luxus — kritikus üzleti előny.",
    metaTitle: "Employer Branding — munkáltatói márkaépítés | G2A Marketing",
    metaDesc:
      "EVP-fejlesztés, karrieroldal, toborzási marketing, Glassdoor + Profession.hu reputáció. Vonzd és tartsd meg a legjobb tehetségeket.",
    icon: "users",
    color: "#8b5cf6",
    intro:
      "A magyar HR-piac mostanra ugyanolyan versenyzett mint az ügyfél-piac: aki nem hirdet, az nem talál jelölteket. Az employer branding a HR és a marketing határterülete — a G2A azt a hidat építi, amelyen az „employer brand” mint koncepció valódi toborzási és megtartási eszközzé válik. ESG-megfelelőséggel, generációs adaptációval, és a Profession.hu / LinkedIn / Glassdoor hármason mért teljesítménnyel.",
    benefits: [
      {
        title: "EVP-fejlesztés (Employer Value Proposition)",
        desc: "Saját munkavállalói interjúkon alapuló, hiteles EVP. Nem PR-szöveg, hanem amit valóban kapnak az emberek. 4-6 hét alatt készül.",
      },
      {
        title: "Karrieroldal és jelentkezési flow",
        desc: "Konverzió-optimalizált karrieroldal pozíciónkénti landing page-ekkel. Greenhouse / Workable / saját ATS integráció. Mobil-first design (Z generáció).",
      },
      {
        title: "Toborzási marketing",
        desc: "LinkedIn, Profession.hu, Facebook, Instagram, TikTok kampányok pozíció szerint. Sponsored Content B2B, Reels Z generációnak — különböző creatívokkal.",
      },
      {
        title: "Munkavállalói storytelling",
        desc: "„Egy nap az életünkben” videók, day-in-the-life Reels, csapat-bemutató cikkek. A munkatárs maga a brand-nagykövet — nem egy marketinges szlogen.",
      },
      {
        title: "Glassdoor + Profession.hu reputáció",
        desc: "Munkáltatói profil optimalizálás, válaszadási stratégia értékelésekre (jó és rossz egyaránt), proaktív review-szerzés elégedett dolgozóktól.",
      },
      {
        title: "Belső kommunikáció és onboarding",
        desc: "Az új belépőtől az első 90 napig strukturált onboarding flow. Belső hírlevél, sikertörténetek, csapatépítés-kommunikáció.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Employer brand audit",
        desc: "Mai jelölt-élmény térképezése: miért lépnek ki, miért jönnek be, mi a Glassdoor/Profession-rating. 5-8 munkavállalói interjú, 2-3 ex-munkavállalói. Output: realitás-térkép.",
      },
      {
        step: "02",
        title: "EVP-megfogalmazás",
        desc: "A munkavállalói „tényleges mit kapok itt” listából kondenzáljuk a 3-4 legerősebb pillért. Tesztelés célcsoport-fókuszcsoportokkal. Final EVP statement.",
      },
      {
        step: "03",
        title: "Kommunikáció és kampány",
        desc: "Karrieroldal redesign, LinkedIn/Profession content-naptár, video story-pipeline, Glassdoor profil revízió. Toborzási kampányok pozíció szerint.",
      },
      {
        step: "04",
        title: "Mérés és iteráció",
        desc: "Time-to-hire, cost-per-hire, offer acceptance rate, employee NPS havonta. Glassdoor / Profession.hu rating trend. Kvartálos EVP-validation.",
      },
    ],
    faq: [
      {
        q: "Mikor érdemes employer brandinggel foglalkozni?",
        a: "3 jelzés: (1) több mint 3 hónapja nem találtok megfelelő jelöltet egy nyitott pozícióra; (2) a fluktuáció meghaladja az iparági átlagot (jellemzően 15% feletti évente); (3) a Glassdoor/Profession.hu rating-etek 3 csillag alatt van. Bármelyik jelzés esetén az EB már nem opció, hanem szükséglet.",
      },
      {
        q: "Mennyi idő alatt láthatók az eredmények?",
        a: "Karrieroldal redesign: 4-6 hét. Első toborzási kampány-eredmény: 6-8 hét. EVP-megfogalmazás teljes hatása (jelentkezés-szám + minőség): 4-6 hónap. Glassdoor rating javulás: 6-12 hónap (review-k szerveződnek időben).",
      },
      {
        q: "Hogyan mérjük az employer branding sikerét?",
        a: "5 fő KPI: time-to-hire (csökken 15-30%), cost-per-hire (csökken 20-40%), offer acceptance rate (nő 60-tól 80%-ra), employee NPS (nő 6-7-ről 8-9-re), Glassdoor rating (nő 0.5-1 csillagot). Ezek mind 12-18 hónapos időtávon mérhetők.",
      },
      {
        q: "Mi van, ha kicsi cég vagyunk?",
        a: "Az employer branding KKV-szinten is működik — sőt, ott a legintimebb és leghitelesebb. 5-30 fős cégnek nem kell milliós költségvetéssel induljon: alap karrieroldal + Profession.hu profil + LinkedIn-poszt-kalendárium tulajdonos/HR-vezető nevén havi 150-250 ezer Ft-ból szállít.",
      },
      {
        q: "Tudtok influencer / employee advocacy programot indítani?",
        a: "Igen. Munkatársak (5-10 önkéntes „brand ambassador”) képzése LinkedIn-poszt-receptekkel, content-kalendáriummal. Egy 5 fős advocacy-program szerves elérése jellemzően 3-5x nagyobb mint maga a vállalati LinkedIn-fiók.",
      },
      {
        q: "Mibe kerül havi szinten?",
        a: "KKV alap (karrier oldal + Profession + havi 4 LinkedIn poszt): 200-400 ezer Ft. Közepes vállalat (full EB stack: karrier + LinkedIn + Profession + Glassdoor management + storytelling): 500-900 ezer Ft. Enterprise (advocacy program + video pipeline): 1.2-2.5M Ft.",
      },
    ],
    cta: "Kérd az ingyenes employer branding konzultációt",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "Nemzetközi Marketing",
    subtitle: "Globális piac, lokális szemlélet",
    heroDesc:
      "Külföldi piacokra lépnél? A siker titka a lokalizáció: nem elég lefordítani a weboldalt, a kulturális sajátosságokhoz és helyi keresőmotorokhoz kell igazodnunk. Magyar + nemzetközi tapasztalat, közvetlen kínai piaci kapcsolatokkal.",
    metaTitle: "Nemzetközi marketing és piaci belépés | G2A Marketing",
    metaDesc:
      "Multilingvális SEO, cross-border kampányok, lokalizáció, piaci belépési stratégia. DACH, CEE, BeNeLux, UK és kínai piacok. Helyi szemlélettel.",
    icon: "globe",
    color: "#06b6d4",
    intro:
      "A magyar KKV-k 2025-2026-ban egyre inkább a régiós piac (DACH, CEE) felé orientálódnak, mert a hazai piac telített és a forint-volatilitás kockázatot jelent. A G2A ügyvezetője, Győrfi Attila a Varsói Egyetem vendégoktatója és nemzetközi marketing-specialista — közvetlen kapcsolatokkal a lengyel, cseh és kínai piaci szereplők felé. Ez nem ügynöki kapcsolat, hanem operatív tudás.",
    benefits: [
      {
        title: "Piacra lépési stratégia",
        desc: "Mélyfúrásos piac-elemzés: kereslet, versenyhelyzet, csatornastruktúra, szabályozás. Go-to-market roadmap 12 hónapra.",
      },
      {
        title: "Lokalizáció (nem fordítás)",
        desc: "Kulturálisan adaptált tartalom: nem szó szerinti, hanem helyi viszonyok közé átültetett üzenet. Anyanyelvi szerkesztők minden célnyelvre.",
      },
      {
        title: "Multilingvális SEO",
        desc: "Hreflang implementáció helyes ccTLD vagy aldomén stratégiával. Nyelvenkénti kulcsszó-kutatás (a németben más a kifejezés mint a magyarban). Lokális link-építés.",
      },
      {
        title: "Cross-border PPC",
        desc: "Google Ads + Meta cross-country kampányok. Külön valuta-kezelés, ország-specifikus billing flow, GDPR-megfelelés EU-szerte.",
      },
      {
        title: "Kínai piaci specializáció",
        desc: "WeChat, Baidu, Xiaohongshu (Little Red Book), Douyin (kínai TikTok) marketing. Sino-magyar üzleti partnerségek tanácsadása.",
      },
      {
        title: "Helyi partnerségek és influencer",
        desc: "Lengyel, cseh, német és kínai influencer kapcsolatok. Helyi nagykereskedők és viszonteladók azonosítása. PR a célpiacokon.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Piac-elemzés és target country pick",
        desc: "Top 3-5 célország értékelése: piacméret, kereslet, verseny-intenzitás, TAM (Total Addressable Market) becslés. Win-rate kalkulátor országonként.",
      },
      {
        step: "02",
        title: "Lokalizációs stratégia",
        desc: "Domain stratégia (.de vs /de, ccTLD vs aldomén), hreflang setup, anyanyelvi tartalom-szerkesztők kiválasztása. Cégbejegyzés vagy local entity ha kell.",
      },
      {
        step: "03",
        title: "Tartalom és weboldal lokalizáció",
        desc: "Weboldal multilingvális verziók, marketing-anyagok (e-mail, social) lokalizációja, kulcsszó-térkép országonként. Pilot ország 2-3 hónap.",
      },
      {
        step: "04",
        title: "Kampányok és skálázás",
        desc: "Lokális Google Ads + Meta launching. Lokális PR és influencer outreach. Havi review: melyik ország skálázódik, melyik csökkenjen vagy bukjon.",
      },
    ],
    faq: [
      {
        q: "Milyen piacokra segítitek a terjeszkedést?",
        a: "Elsősorban: DACH (Németország, Ausztria, Svájc), CEE (Lengyelország, Csehország, Szlovákia, Románia), BeNeLux és UK. Speciális: Kína (WeChat + Baidu + helyi partnerségek). Globális terjeszkedésben (USA, India, MENA) partner ügynökségekkel dolgozunk.",
      },
      {
        q: "Mi a különbség a fordítás és a lokalizáció között?",
        a: "Fordítás = szó szerinti átalakítás (gyakran gépi fordítóval kezdve). Lokalizáció = teljes adaptáció, beleértve a humor, az utalások, a vizuális elemek (modellek, színek), a fizetési módok, a jogi szöveg. Egy „best in class” szlogen ami magyarul jól szól, németül nyelvtanilag rossz, lengyelül pedig kulturálisan idegen lehet.",
      },
      {
        q: "Kell-e új domain regisztrálni?",
        a: "Két stratégia: (1) ccTLD (országkódos domain): a saját domain.hu mellett domain.de, domain.cz — legjobb local SEO, de drága és komplex. (2) Aldomén vagy alkönyvtár: de.domain.com vagy domain.com/de — egyszerűbb, de gyengébb local ranking. Általában az aldomén/alkönyvtár megoldást javasoljuk a 2-3. piacig, és csak utána ccTLD-t.",
      },
      {
        q: "Milyen hosszú a folyamat?",
        a: "Pilot piac (1 új ország): 4-12 hét teljes lokalizációs folyamat. Skálázás további piacokra: 6-8 hét / új piac, ha a pilot sikeres. Cégalapítás vagy local entity kell-e: külön tanácsadás, 3-6 hónap.",
      },
      {
        q: "Tudtok kínai piaci tanácsadásban segíteni?",
        a: "Igen. Ügyvezetőnk Győrfi Attila a Varsói Egyetem vendégoktatója és kínai piaci szakértő. WeChat-en közvetlenül elérhető a kínai partnereinkkel. WeChat marketing, Baidu SEO, Tmall/JD listing, Xiaohongshu (Little Red Book) influencer kampányok. Kínai piacra-lépéshez tipikusan magyar+kínai joggyakorlót is bevonunk a regulációs része miatt.",
      },
      {
        q: "Mibe kerül a nemzetközi terjeszkedés marketingje?",
        a: "Pilot ország launch (DACH/CEE): egyszeri 1.5-3M Ft (lokalizáció + setup + első kampányok). Havi management: 400-900 ezer Ft / ország. Kínai piaci pilot: 3-6M Ft (komplexebb a regulációs része). Hirdetési költség külön, jellemzően havi 300-1500 ezer Ft / ország a piacméret függvényében.",
      },
    ],
    cta: "Kérd az ingyenes nemzetközi marketing konzultációt",
  },
};

// ─── EN ─────────────────────────────────────────────────────────────────────
const EN: Record<string, ServiceConfig> = {
  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI Marketing",
    subtitle: "Artificial intelligence at every stage of marketing",
    heroDesc:
      "AI opens new horizons in marketing: more accurate targeting, personalised content, predictive analytics. We reduce manual work and create new revenue opportunities.",
    metaTitle: "AI Marketing – Artificial intelligence in marketing | G2A Marketing",
    metaDesc:
      "Personalised content, predictive analytics, automated ad optimisation and chatbots. Make your marketing data-driven with artificial intelligence.",
    icon: "bot",
    color: "#7c3aed",
    intro:
      "AI matured into an operationally usable tool between 2024-2026 — the hype gave way to real ROI. The G2A team uses Claude, ChatGPT, Manus, Gemini, Midjourney, Runway, ElevenLabs and Cursor in daily workflows — from content production to client project audits. We bring this experience to client projects: not as a promise, but as concrete, measurable workflow acceleration.",
    benefits: [
      {
        title: "Predictive analytics",
        desc: "Forecast buyer patterns (when next purchase, when churn risk), simulate campaign results before launch — based on Google AI + custom models.",
      },
      {
        title: "Personalised content",
        desc: "Dynamic email and web content: every visitor sees something different based on behaviour. HubSpot Smart Content + Mutiny + custom workflows.",
      },
      {
        title: "Automated ad optimisation",
        desc: "Performance Max, Smart Bidding, Meta Advantage+ campaigns with AI — Google/Meta AI iterates creatives and targeting, we provide the strategic frame and exclusion lists.",
      },
      {
        title: "Chatbot and AI agent integration",
        desc: "24/7 customer support with AI chatbots (Intercom Fin, Drift, or custom Claude-API solution). Typically 60-70% first-touch resolution rate after month 1.",
      },
      {
        title: "AI-assisted content production",
        desc: "Blog drafts, social copy, ad creatives — Claude + Midjourney + Runway hybrid pipeline. Weekly content output 3-5x with quality preserved.",
      },
      {
        title: "Conversion optimisation with machine learning",
        desc: "Predictive A/B tests (forecasting which variant wins), AI-driven UX heatmap analysis, dynamic landing page elements per visitor segment.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Needs assessment and AI audit",
        desc: "We map your marketing workflows, identify highest-ROI AI integration spots — and where it's a false friend. Concrete recommendation pack with KPIs.",
      },
      {
        step: "02",
        title: "Data strategy and platform choice",
        desc: "AI is only as good as your clean data. We build the data pipeline (CDP, GA4, CRM event tracking) and select AI tools fit for the task.",
      },
      {
        step: "03",
        title: "AI solution integration",
        desc: "Step-by-step rollout — one workflow at a time. We start with a pilot, measure, then scale. Never 5 parallel AI projects at once.",
      },
      {
        step: "04",
        title: "Measurement and iteration",
        desc: "Monthly review report: time and cost savings AI delivered vs. setup cost. Quarterly strategic review with new tool evaluation.",
      },
    ],
    faq: [
      {
        q: "What size of company is AI marketing for?",
        a: "Every size, but with different tools. For SMBs the content + ad-creative AI assist (Claude + Midjourney + Runway) delivers the fastest ROI. For mid-market, predictive analytics and CRM-AI integration. For enterprise, custom model fine-tuning on first-party data.",
      },
      {
        q: "How soon can results be seen?",
        a: "Content pipeline acceleration: 2-3 weeks. AI-assisted ad optimisation: 4-6 weeks. Predictive analytics and personalisation: 3-4 months (data is required). Custom AI agent: 6-9 months for full ROI.",
      },
      {
        q: "Which AI tools do you use specifically?",
        a: "LLM: Claude (1M token context), ChatGPT (general), Gemini (Workspace integration), Manus (autonomous agents). Image: Midjourney v7, DALL·E 3, Adobe Firefly. Video: Runway Gen-4, Sora. Voice: ElevenLabs. Marketing-specific: HubSpot AI, Surfer, Frase, Clearscope. Detailed list at /technologia.",
      },
      {
        q: "Will AI increase ad costs?",
        a: "Short-term, there's a setup cost (audit, integration, training) — typically a one-off HUF 300-800k. Long-term it delivers 20-40% efficiency gains: more conversions for the same spend, or the same conversions for less spend.",
      },
      {
        q: "How does it integrate with existing systems?",
        a: "Via API integration. Most common: HubSpot/Salesforce CRM + Claude API for client emailing, GA4 + Google AI for predictive analytics, Intercom + custom RAG (own client document base) for chatbots. G2A writes the workflows; you receive the finished integration.",
      },
      {
        q: "What about GDPR and data protection?",
        a: "We pick AI tools that operate in EU regions or contractually guarantee not to use your data for training. Enterprise versions of OpenAI, Anthropic and Google all offer this. G2A never sends client data to free-tier OpenAI endpoints — only enterprise/zero-retention endpoints.",
      },
    ],
    cta: "Request a free AI marketing audit",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC and Google Ads",
    subtitle: "Paid advertising that pays back — across every Google channel",
    heroDesc:
      "Paid ads are essential when you need new customers fast. We build data-driven PPC campaigns across Google Search, Display, Shopping and YouTube — always aligned with your business goals.",
    metaTitle: "PPC and Google Ads expert services | G2A Marketing",
    metaDesc:
      "Data-driven PPC campaigns: Search, Display, Shopping, YouTube and Performance Max. Multiple platforms, one strategy — measurable ROI with G2A Marketing.",
    icon: "target",
    color: "#ea4335",
    intro:
      "By 2026 Google Ads has gone almost entirely smart-bidding-driven — meaning the era of manual bid management is over, replaced by strategy, structure and the quality of conversion signals. Modern Google Ads work is 30% creative, 30% data engineering, 20% tracking setup and 20% strategy. G2A delivers exactly this combination.",
    benefits: [
      {
        title: "Search Ads",
        desc: "Keyword-based ads with search intent. SKAG or SPAG structure, broad match + audience signals, dynamic search ads (DSA) for long-tail.",
      },
      {
        title: "Display Network and YouTube",
        desc: "Visual ads on Google's partner network + YouTube. TrueView for Action and Demand Gen campaigns, retargeting across the web.",
      },
      {
        title: "Shopping (e-commerce)",
        desc: "Product-based ads for webshops. Merchant Center feed optimisation, category-level bidding strategy, custom labels for seasonality.",
      },
      {
        title: "Performance Max",
        desc: "Cross-channel AI campaign. Asset group structure per customer segment, audience signal strategy, brand exclusion + tiltóra — so it doesn't cannibalise Search.",
      },
      {
        title: "Remarketing and audiences",
        desc: "Customer Match lists (email upload), website visitor remarketing, similar audience, lookalike. LTV-based segment strategy.",
      },
      {
        title: "Conversion tracking and tagging",
        desc: "GA4 + Google Tag Manager + enhanced conversions + offline conversion import (sync from CRM). Accurate attribution all the way to actual sales.",
      },
    ],
    process: [
      {
        step: "01",
        title: "PPC audit",
        desc: "Free account review (or, if no account, keyword map). We measure Quality Score, wasted spend %, conversion-tracking accuracy. Immediately actionable recommendations.",
      },
      {
        step: "02",
        title: "Keyword and audience research",
        desc: "Industry-specific keyword map with intent segmentation. Competitor ad copy analysis. Audience list build (1st party + Customer Match + similar).",
      },
      {
        step: "03",
        title: "Campaign build and launch",
        desc: "SKAG/SPAG structure, ad copy variants (4-6 per ad group), responsive search ads, image extensions. Full tracking validation before go-live.",
      },
      {
        step: "04",
        title: "Weekly optimisation and reporting",
        desc: "Weekly negative keyword expansion, ad copy iteration, audience tuning. Monthly full report: Search Term report, Auction Insights, ROAS trend. Quarterly strategic review.",
      },
    ],
    faq: [
      {
        q: "What budget should we start with?",
        a: "Industry-dependent. Local services (hairdresser, car repair): HUF 100-200k/month. SMB B2B or webshop: HUF 300-800k. Mid-market e-commerce: HUF 1-3M+. In high-CPC verticals (legal, insurance, finance) it's hard to deliver measurable results below HUF 800k.",
      },
      {
        q: "What's the difference between Search and Performance Max?",
        a: "Search = precise keyword targeting with search intent — more control, lower scalability. Performance Max = AI-driven cross-channel — less control, much higher scalability. Optimal strategy: Search for brand + high-intent keywords, Performance Max for discovery + new customer acquisition.",
      },
      {
        q: "Do you also handle YouTube and Shopping campaigns?",
        a: "Yes, all four main campaign types (Search, Display + YouTube, Shopping, Performance Max). For YouTube we can bring in a dedicated video creative partner; for Shopping we optimise Merchant Center feeds (TecDoc/Carzone for automotive, or custom WooCommerce/Shopify feeds).",
      },
      {
        q: "How do we measure campaign success?",
        a: "Conversions, CPA (cost per acquisition), ROAS (return on ad spend) — basics. Plus: average Quality Score, Search Impression Share, brand vs non-brand revenue split. For e-commerce: LTV-based ROAS (not just first-purchase, but 12-month value).",
      },
      {
        q: "What's the agency fee?",
        a: "Two models: (1) flat retainer (HUF 200-600k/month based on campaign size); (2) % of media spend (10-15%, typically for larger campaigns). G2A doesn't hide platform invoices — every advertising cost goes directly from your card to Google.",
      },
      {
        q: "Is a long-term contract required?",
        a: "No, we work on a 30-day notice period. Honestly though: Google Ads needs 2-3 months for smart bidding to learn, Quality Score to stabilise, and real optimisation work to happen. One-month experiments rarely deliver.",
      },
    ],
    cta: "Request a free Google Ads audit",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta Ads (Facebook + Instagram)",
    subtitle: "Social media advertising that delivers conversions",
    heroDesc:
      "Social media ads let us reach exactly the audience most likely to convert. We design creative, data-driven campaigns on Meta (Facebook, Instagram) and LinkedIn — campaigns that deliver real conversions, not just reach.",
    metaTitle: "Meta Ads and social media advertising | G2A Marketing",
    metaDesc:
      "Results-oriented Facebook, Instagram and LinkedIn ad management. Audience segmentation, creative production, A/B testing and ROI optimisation.",
    icon: "smartphone",
    color: "#1877f2",
    intro:
      "On Meta platforms (Facebook + Instagram), 6+ million active Hungarian users move daily. Since Apple's iOS 14.5 ATT change in 2021, targeting has become less certain — making 2026 Meta Ads success hinge on creative and the Conversion API. G2A focuses precisely on these: rapid creative iteration + clean server-side conversion tracking.",
    benefits: [
      {
        title: "Facebook Ads (CBO + ASC)",
        desc: "Campaign Budget Optimization or Advantage+ Shopping Campaigns. Audience signal strategy, separating cold + warm + hot funnel stages.",
      },
      {
        title: "Instagram Ads (Stories + Reels)",
        desc: "Reels-first creative strategy (Reels currently has the lowest CPM). Stories swipe-up integration, mobile-first experience.",
      },
      {
        title: "LinkedIn Ads (B2B)",
        desc: "Sponsored Content, Message Ads, Lead Gen Forms with B2B targeting. Company size, role, industry + matched audience combinations.",
      },
      {
        title: "Lookalike and Custom Audience",
        desc: "1%, 3%, 5% lookalike segments seeded by top-10% LTV customers. Customer Match email upload + website visitor.",
      },
      {
        title: "Lead Generation Ads",
        desc: "On-platform lead forms — the user never leaves Facebook. Higher conversion, lower CPL, but weaker lead quality (pre-screening questions needed).",
      },
      {
        title: "Conversion API + Pixel",
        desc: "Server-side event push (post-iOS14 solution). Stripe/HubSpot/Shopify integration + offline conversion import from CRM.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pixel + CAPI install",
        desc: "Meta Pixel + Conversion API setup with full server-side event flow. Target Event Match Quality 70%+ (vs the 30% average) — improves campaign performance by 20-30%.",
      },
      {
        step: "02",
        title: "Audience map and creative brief",
        desc: "Cold + warm + hot segment definition. Competitor ad library mining (Meta Ad Library + Foreplay). Creative brief with 5-8 concepts.",
      },
      {
        step: "03",
        title: "Creative production and launch",
        desc: "5-8 creative variants per ad set (static + video + carousel + UGC style). Launch with 50/50 cold-warm split, learn fast in week 1.",
      },
      {
        step: "04",
        title: "Iterate and scale",
        desc: "Weekly creative rotation (creative-fatigue strategy), audience expansion. Scale via CBO, ad set duplication for winning creatives.",
      },
    ],
    faq: [
      {
        q: "How long until we can start advertising?",
        a: "We build the structure within 1-2 weeks: Pixel + Conversion API setup (3-4 days), audience map (2 days), first creative batch (5-7 days). The first learning phase post-launch is 7-14 days.",
      },
      {
        q: "What does ad budget depend on?",
        a: "Industry (CPM HUF 600-3,500 typically), audience size (smaller = costlier creative needed), and funnel stage. Realistic minimum: HUF 200-400k/month for local business; HUF 600k-1.5M for webshops or B2B lead gen.",
      },
      {
        q: "What creatives do we need?",
        a: "In 2026 it's Reels-first: 9:16 vertical video (15-30s), with captions (80% watch on mute), strong hook (first 1-2 seconds). Plus static carousels and UGC-style footage. We can produce in-house, with partner studios, or optimise your existing material.",
      },
      {
        q: "Can you also help with organic social media?",
        a: "Yes, we have a dedicated social media management service: content calendar, content production, community moderation, influencer relations. The two services (organic + paid) together are 2-3x more effective than separately.",
      },
      {
        q: "How do we measure success?",
        a: "CPC (cost per click), CPM (cost per thousand impressions), CTR, CPA (cost per acquisition), ROAS (return on ad spend) — basics. Plus: Brand Lift Studies (for larger campaigns), iOS 14.5+ privacy-conscious attribution model.",
      },
      {
        q: "What about post-iOS 14.5 tracking?",
        a: "Due to ATT (App Tracking Transparency), the Pixel only receives partial data. That's why the Conversion API matters: server-side event tracking that works on iOS too. G2A installs CAPI by default on every new project (not as an option).",
      },
    ],
    cta: "Request a free Meta Ads audit",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "Content Marketing",
    subtitle: "Valuable content that attracts customers",
    heroDesc: "Build authority and organic traffic with valuable content. Blog, video, podcast, infographic — across every channel.",
    metaTitle: "Content marketing and copywriting | G2A Marketing",
    metaDesc:
      "Build brand authority and organic traffic. Blog writing, video and podcast content, newsletters, educational material for SMBs and B2B companies.",
    icon: "pen",
    color: "#10b981",
    intro:
      "In B2B and SMB segments, content marketing is the best long-term investment: a single well-written long-form article can drive organic traffic for 3-5 years. Yet 2026 brings Google AI Overviews and ChatGPT-powered search, transforming the game — it's no longer enough to write good content; it must be structured with schema and FAQ-style formatting so AI search uses it as a reference.",
    benefits: [
      {
        title: "Blog strategy and long-form articles",
        desc: "Keyword map and cluster strategy (pillar + cluster), 1,500-3,500-word articles. Schema.org Article/FAQ markup, AI Overviews-optimised format.",
      },
      {
        title: "Video and podcast",
        desc: "Scriptwriting, YouTube SEO (title, description, chapter markers), thumbnail A/B testing. Podcast: topic structure, production, editing, distribution (Spotify/Apple/YouTube).",
      },
      {
        title: "Newsletter and lead magnets",
        desc: "Weekly/monthly newsletter strategy (with topic-picker automation), e-books and whitepapers in exchange for email sign-up. Resend/Mailchimp integration.",
      },
      {
        title: "Thought leadership and LinkedIn",
        desc: "Articles and LinkedIn post sequences under the leader's personal name. Industry trend analysis, opinion pieces, life-situation narratives — humanising the brand.",
      },
      {
        title: "Content distribution and PR",
        desc: "Owned (own channels) + earned (PR) + paid (boost) three-tier distribution. Outreach to industry media, guest blogging, performance PR.",
      },
      {
        title: "Case studies and portfolio",
        desc: "Structured case study templates: challenge → solution → result → lesson. Anonymised version for tight NDA contexts.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Research and topic map",
        desc: "Keyword research (Ahrefs/Semrush + AlsoAsked), competitor gap analysis, ICP interviews (3-5 customers). Output: 6-12 month topic map.",
      },
      {
        step: "02",
        title: "Strategy and content calendar",
        desc: "Pillar-cluster structure, article-level brief for every topic (keyword, goal, structure, internal links). You receive the calendar; you approve.",
      },
      {
        step: "03",
        title: "Production and optimisation",
        desc: "Article production (AI-assisted but always human-edited), SEO editing (Surfer/Frase), schema markup, internal link network. 1-3 articles per week.",
      },
      {
        step: "04",
        title: "Distribution and measurement",
        desc: "Owned (own channels), earned (PR outreach), paid (boost). Monthly report: organic traffic, ranking, engagement, conversion. Quarterly topic pivot.",
      },
    ],
    faq: [
      {
        q: "How soon do first results appear?",
        a: "Long-tail keywords: 3-4 months (Google indexing + ranking growth). More competitive keywords: 6-9 months. Brand and authority building: 12-18 months. In the first months, consistent publishing — not traffic — is critical.",
      },
      {
        q: "Can you also help with video content?",
        a: "Yes. Two models: (1) full-service with partner video studios (script → shoot → edit → SEO); (2) AI-assisted production (Claude script + ElevenLabs voice + Runway visuals). The choice depends on brand needs and budget.",
      },
      {
        q: "What keyword strategy do you follow?",
        a: "Pillar-cluster model. 1 pillar page (broad topic, e.g. \"digital marketing for SMBs\") + 8-15 cluster articles (specific subtopics, e.g. \"local SEO tips\", \"Meta Ads for small businesses\"). Every cluster links internally to the pillar. AI Overviews-optimised FAQ section in every article.",
      },
      {
        q: "How do we measure content success?",
        a: "Top-of-funnel: organic traffic, keyword rankings, content sharing. Middle-of-funnel: page engagement (time on page, scroll depth), email sign-ups. Bottom-of-funnel: blog attribution (HubSpot multi-touch) — what % each article contributed to actual contracts.",
      },
      {
        q: "What investment is needed?",
        a: "Entry level (2 articles + content calendar / month): HUF 200-300k/month. Serious content engine (1-2 articles + LinkedIn + newsletter / week): HUF 500-900k. Premium (3 articles + video + podcast / week): HUF 1.2-2.5M.",
      },
      {
        q: "What does AI Overviews optimisation mean?",
        a: "The Google AI Overviews (and ChatGPT-search) introduced in 2024-2025 cite articles differently: they look for short, question-answer-based, authority-signalled sections. So today a long-form article must contain structured FAQ sections, step sequences, and lists — otherwise AI search skips over it.",
      },
    ],
    cta: "Request a free content audit",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "Marketing Automation",
    subtitle: "Efficiency, AI-supported",
    heroDesc:
      "Save time and resources by automating repetitive marketing workflows. We build your email and CRM system so every prospect receives the right message at the right time.",
    metaTitle: "Marketing automation — Email and CRM | G2A Marketing",
    metaDesc:
      "Build automated marketing workflows: email automation, CRM integration, lead nurturing, sales funnel and segmentation. AI-assisted segmentation.",
    icon: "zap",
    color: "#f59e0b",
    intro:
      "Marketing automation works when the entire customer journey (lead → prospect → buyer → repeat customer) is modelled as a multi-actor workflow. G2A starts with sales-marketing alignment: defining MQL-SQL-Opportunity-Won and only then building automation — otherwise the smartest workflow is wasted if sales and marketing speak different languages.",
    benefits: [
      {
        title: "Email automation",
        desc: "Welcome sequences, lead nurturing flows, post-purchase follow-up, win-back campaigns. Triggers: website behaviour, email open, demo request, purchase amount.",
      },
      {
        title: "CRM integration",
        desc: "HubSpot, Salesforce, ActiveCampaign, Pipedrive, Odoo, Zoho setup with two-way sync. Custom field mapping per client need.",
      },
      {
        title: "Lead scoring and qualification",
        desc: "Explicit (company size, role) + implicit (page behaviour, email engagement) multiplied scoring. Hot lead 60+, MQL 30-59, raw 0-29.",
      },
      {
        title: "Sales funnel and pipeline",
        desc: "Conversion-oriented paths (lead → demo → POC → contract), upsell and cross-sell automations. HubSpot Deal-stage workflows.",
      },
      {
        title: "Segmentation (AI-assisted)",
        desc: "Behaviour-based dynamic segments: we use the Claude/GPT API to personalise email content per segment. Optimal send-time prediction model.",
      },
      {
        title: "Reporting and dashboards",
        desc: "Automated weekly/monthly reports (Looker Studio + HubSpot Reports). Multi-touch attribution: what % each channel contributed to final contracts.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Process mapping",
        desc: "Joint sales-marketing session (1-2 days): drawing the current lead flow, defining stages, identifying weak points. Output: concrete automation roadmap.",
      },
      {
        step: "02",
        title: "Platform selection",
        desc: "HubSpot vs Marketo vs ActiveCampaign vs Mailchimp decision based on company size, IT stack, CRM needs. Migration plan if switching.",
      },
      {
        step: "03",
        title: "Workflow development",
        desc: "1 workflow per 2 weeks: welcome series → lead nurture → handoff to sales → onboarding → upsell. Testing after each step.",
      },
      {
        step: "04",
        title: "Testing and iteration",
        desc: "A/B test every subject line + CTA + send time. Monthly review: KPI growth, workflow integrity check, prioritising new use-cases.",
      },
    ],
    faq: [
      {
        q: "Which platforms do you work with?",
        a: "HubSpot (SMB-mid full-stack), Marketo (enterprise), ActiveCampaign (SMB email + CRM), Mailchimp (basic email), Klaviyo (e-commerce), Pipedrive + Mailchimp combo (sales-first), Odoo (ERP-first), Zoho (cost-effective full-stack). Custom integrations: Zapier, Make.com, n8n.",
      },
      {
        q: "How long does implementation take?",
        a: "Basic email automation + CRM integration: 2-4 weeks. Lead scoring + sales funnel: 4-6 weeks. Multi-touch attribution + revenue dashboard: 6-8 weeks. Complex enterprise migration (e.g. Salesforce → HubSpot): 3-6 months.",
      },
      {
        q: "What do we need to start?",
        a: "Existing customer database (even Excel — we help migrate), business process map (or we draw one together), and sales-marketing willingness to collaborate (most important). Tech stack doesn't need to be decided upfront — we choose together.",
      },
      {
        q: "How does AI help with segmentation?",
        a: "Two layers: (1) predictive models (when next purchase, when churn, optimal send-time per customer); (2) generative personalisation (Claude API rewrites the base email template per segment, so we don't manually write 20 variants).",
      },
      {
        q: "What does it cost monthly?",
        a: "Setup: one-off HUF 600k–2.5M depending on complexity. Monthly management: HUF 200-600k (workflow maintenance, new campaigns, reporting). Platform licence separate — HubSpot Pro ~HUF 50k/month, Marketo HUF 200k+.",
      },
      {
        q: "How do we measure marketing automation ROI?",
        a: "Time savings: hours of manual work shifted to workflows (typically 30-50% reduction in marketing team manual time). Conversion impact: lead → SQL and SQL → won deal rate improvement (typically 15-30% lift). Pipeline velocity: average sales-cycle shortening (10-25%).",
      },
    ],
    cta: "Request a free automation audit",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG Communications",
    subtitle: "Sustainability told credibly — without greenwashing",
    heroDesc:
      "We communicate your sustainability efforts so customers, investors and supply chains genuinely believe them — backed by data, in line with the EU Green Claims Directive and Hungarian regulation. Official ESG reporting and certification are handled by SZTFH-registered partners.",
    metaTitle: "ESG Communications and sustainability marketing | G2A Marketing",
    metaDesc:
      "Greenwashing-free ESG and CSR communications: stakeholder messaging, green marketing, website ESG section, rating preparation. Official reports filed by registered partners.",
    icon: "leaf",
    color: "#22c55e",
    intro:
      "Important boundary upfront: G2A Marketing Bt. is NOT registered with the Hungarian Authority of Regulated Activities (SZTFH), so under Hungarian Act CVIII of 2023 we do not perform official ESG advisory or ESG certification — mandatory CSRD reporting and certification are entrusted to SZTFH-registered partners or recommended auditors. What we do: the communication side of ESG strategy, stakeholder messaging, brand narrative, marketing-grade content and rating preparation. Our managing director Attila Győrfi as an ESG specialist provides informal expert advice, but this does not replace official registered ESG advisory.",
    benefits: [
      {
        title: "ESG communication strategy",
        desc: "We translate the double materiality assessment OUTPUT (delivered by your registered advisor) into credible external communication. Stakeholder map and prioritised message hierarchy.",
      },
      {
        title: "ESG communication materials and design",
        desc: "Website ESG section, annual report design and narrative (the official content comes from the registered auditor; we make it readable and brand-consistent), social media + LinkedIn post sequences.",
      },
      {
        title: "Greenwashing-free green marketing",
        desc: "ISO 14021 Type II environmental claims — credible, data-backed statements. Phrasing prepared for the EU Green Claims Directive 2026 requirements.",
      },
      {
        title: "Stakeholder communication",
        desc: "Investor IR communications, customer-facing green marketing, internal employee ESG campaigns — each in different language, on different channels, with legal review.",
      },
      {
        title: "CSR content and campaigns",
        desc: "Volunteer-day storytelling, partnership case studies, local community project communication. We turn CSR into a brand-building narrative — pure communication work, not regulated territory.",
      },
      {
        title: "Rating preparation (communication side)",
        desc: "EcoVadis / CDP / MSCI ESG self-assessment questionnaire communication preparation: drafting answer wording. The actual data and assessment come from the company or the registered advisor.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Scope clarification and gap analysis",
        desc: "First meeting: clearly demarcating what the registered ESG advisor / auditor handles (or which partner we recommend), and what we cover on the communications side. Output: role matrix so the boundaries are clear.",
      },
      {
        step: "02",
        title: "Communications strategy and message system",
        desc: "We translate ESRS data delivered by the registered advisor into public communication. Message hierarchy: enterprise → industry → concrete action. Risk analysis: what may and may not be claimed legally.",
      },
      {
        step: "03",
        title: "Content development and design",
        desc: "Annual report visual design and narrative (registered auditor delivers the official professional content), website ESG section, LinkedIn campaign, customer letters, press kit. EU Taxonomy alignment review.",
      },
      {
        step: "04",
        title: "Distribution and stakeholder engagement",
        desc: "Investor roadshow presentation, customer newsletter, press conference. Yearly refreshed communication content. EcoVadis / CDP / MSCI rating preparation on the communications side.",
      },
    ],
    faq: [
      {
        q: "Do you produce official ESG reports for our company?",
        a: "No, and we're explicit about this: G2A Marketing Bt. is NOT registered with the Hungarian Authority of Regulated Activities (SZTFH) for ESG advisory or ESG certification (Act CVIII of 2023), so we don't undertake official CSRD report production or certification. We work on the communications side: making the official document produced by your registered advisor / auditor readable and brand-consistent, drafting stakeholder messaging, building the website ESG section and campaign. For official reporting we recommend SZTFH-registered partners.",
      },
      {
        q: "Is CSRD-mandated ESG reporting required for us?",
        a: "Under the Hungarian transposition (Act CVIII of 2023), it's gradually mandatory from 2024: large enterprises (250+ staff, €40M+ revenue, €20M+ balance sheet — at least 2 of 3) first, then listed SMEs from 2026. Smaller companies still voluntary, but B2B supply chains push the requirement down. For exact applicability check with a registered advisor or auditor — we don't provide legal qualification.",
      },
      {
        q: "What's the difference between ESG and CSR?",
        a: "CSR (Corporate Social Responsibility): voluntary, narrative-based corporate responsibility — pure communications work for us, no regulatory limit. ESG (Environmental, Social, Governance): legally regulated framework with KPIs and mandatory auditing — the official part is for SZTFH-registered experts; we only handle the communication side.",
      },
      {
        q: "How do we avoid greenwashing?",
        a: "Three principles in communication: (1) only data-backed claims (no \"nature-friendly\", only \"95% recycled material, ISO 14021 Type II certified\"); (2) full lifecycle thinking in phrasing; (3) reference to independent audit for every concrete number. The EU Green Claims Directive 2026 will enforce these in law — we shape every green communication piece accordingly.",
      },
      {
        q: "Can you help improve our ESG rating?",
        a: "On the communications side, yes — for EcoVadis, CDP, MSCI ESG Ratings: drafting the self-assessment questionnaire answers to present actual performance in best light. The numerical data and actual assessment come from the company or registered advisor. If base activity exists and only documentation + communication is weak, EcoVadis Bronze → Silver lift is typically achievable in 6-12 months.",
      },
      {
        q: "What does ESG communication cost?",
        a: "Small company (voluntary ESG comms, website ESG section + 1 annual piece): HUF 600k–1.5M. Large SMB (communication package built around the registered auditor's report): HUF 1.5-3M. Enterprise (continuous IR + stakeholder communication): HUF 3-7M / year. The registered ESG advisor / auditor fee (HUF 1-15M depending on size) is on top and independent of us.",
      },
      {
        q: "How do we find an SZTFH-registered ESG advisor or auditor?",
        a: "SZTFH publicly maintains the ESG advisor and ESG auditor registry — check the authority's official website. We're not on the list, but we work as a partner with several registered audit firms and can introduce one fitting your industry and size. The selection and contract are between you two; we don't take referral commissions.",
      },
    ],
    cta: "Request free ESG communications consulting",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "Employer Branding",
    subtitle: "Employer brand that attracts talent",
    heroDesc:
      "The Hungarian labour market 2025-2026 presented a historic challenge: 2.5% unemployment, high turnover, generational gaps between Gen Z and Y workers. A strong employer brand isn't a luxury — it's a critical business advantage.",
    metaTitle: "Employer Branding — employer brand building | G2A Marketing",
    metaDesc:
      "EVP development, careers page, recruitment marketing, Glassdoor + Profession.hu reputation. Attract and retain top talent.",
    icon: "users",
    color: "#8b5cf6",
    intro:
      "The Hungarian HR market is now as competitive as the customer market: if you don't advertise, you don't find candidates. Employer branding sits between HR and marketing — G2A builds the bridge that turns the abstract \"employer brand\" into real recruitment and retention tools. With ESG compliance, generational adaptation, and performance measured across the Profession.hu / LinkedIn / Glassdoor triad.",
    benefits: [
      {
        title: "EVP development (Employer Value Proposition)",
        desc: "Authentic EVP based on real employee interviews. Not a PR slogan — what people actually receive. Ready in 4-6 weeks.",
      },
      {
        title: "Careers page and application flow",
        desc: "Conversion-optimised careers page with per-position landing pages. Greenhouse / Workable / custom ATS integration. Mobile-first design (Gen Z).",
      },
      {
        title: "Recruitment marketing",
        desc: "LinkedIn, Profession.hu, Facebook, Instagram, TikTok campaigns by position. Sponsored Content for B2B, Reels for Gen Z — different creatives.",
      },
      {
        title: "Employee storytelling",
        desc: "\"Day in the life\" videos, behind-the-scenes Reels, team profile articles. The employee is the brand ambassador — not a marketing slogan.",
      },
      {
        title: "Glassdoor + Profession.hu reputation",
        desc: "Employer profile optimisation, response strategy for reviews (good and bad alike), proactive review collection from satisfied staff.",
      },
      {
        title: "Internal communication and onboarding",
        desc: "Structured onboarding flow from new hire to first 90 days. Internal newsletter, success stories, team-building communication.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Employer brand audit",
        desc: "Map today's candidate experience: why people leave, why they join, what's the Glassdoor/Profession rating. 5-8 employee interviews, 2-3 ex-employee. Output: reality map.",
      },
      {
        step: "02",
        title: "EVP articulation",
        desc: "Condense the \"what people actually receive\" list into 3-4 strongest pillars. Test with target-audience focus groups. Final EVP statement.",
      },
      {
        step: "03",
        title: "Communication and campaign",
        desc: "Careers page redesign, LinkedIn/Profession content calendar, video story pipeline, Glassdoor profile revision. Recruitment campaigns by position.",
      },
      {
        step: "04",
        title: "Measurement and iteration",
        desc: "Time-to-hire, cost-per-hire, offer acceptance rate, employee NPS monthly. Glassdoor / Profession.hu rating trend. Quarterly EVP validation.",
      },
    ],
    faq: [
      {
        q: "When is it time for employer branding?",
        a: "Three signals: (1) you've spent over 3 months unable to fill an open position; (2) your turnover exceeds the industry average (typically over 15% annually); (3) your Glassdoor/Profession.hu rating is below 3 stars. Any signal makes EB no longer optional but necessary.",
      },
      {
        q: "How soon do results appear?",
        a: "Careers page redesign: 4-6 weeks. First recruitment campaign result: 6-8 weeks. Full EVP impact (application volume + quality): 4-6 months. Glassdoor rating improvement: 6-12 months (reviews accumulate over time).",
      },
      {
        q: "How do we measure employer branding success?",
        a: "5 main KPIs: time-to-hire (drops 15-30%), cost-per-hire (drops 20-40%), offer acceptance rate (rises from 60% to 80%), employee NPS (rises 6-7 to 8-9), Glassdoor rating (rises 0.5-1 stars). All measurable on a 12-18 month horizon.",
      },
      {
        q: "What if we're a small company?",
        a: "Employer branding works at SMB scale too — in fact it's most intimate and credible there. A 5-30 person company doesn't need a million-forint budget: basic careers page + Profession.hu profile + LinkedIn post calendar under owner/HR director name delivers from HUF 150-250k/month.",
      },
      {
        q: "Can you set up an influencer / employee advocacy program?",
        a: "Yes. Train employees (5-10 volunteer brand ambassadors) with LinkedIn post recipes and content calendars. A 5-person advocacy program's organic reach is typically 3-5x larger than the corporate LinkedIn page itself.",
      },
      {
        q: "What does it cost monthly?",
        a: "SMB basic (careers page + Profession + 4 LinkedIn posts/month): HUF 200-400k. Mid-sized company (full EB stack: career + LinkedIn + Profession + Glassdoor management + storytelling): HUF 500-900k. Enterprise (advocacy + video pipeline): HUF 1.2-2.5M.",
      },
    ],
    cta: "Request a free employer branding consultation",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "International Marketing",
    subtitle: "Global markets, local perspective",
    heroDesc:
      "Entering foreign markets? Localisation is the key to success: a website translation isn't enough — you need to adapt to cultural particularities and local search engines. Hungarian + international experience with direct Chinese-market connections.",
    metaTitle: "International marketing and market entry | G2A Marketing",
    metaDesc:
      "Multilingual SEO, cross-border campaigns, localisation, market entry strategy. DACH, CEE, BeNeLux, UK and Chinese markets — with local perspective.",
    icon: "globe",
    color: "#06b6d4",
    intro:
      "Hungarian SMBs in 2025-2026 are increasingly looking towards regional markets (DACH, CEE) — the domestic market is saturated and HUF volatility creates risk. Our managing director Attila Győrfi is a guest lecturer at the University of Warsaw and an international marketing specialist with direct connections to Polish, Czech and Chinese-market actors. This isn't agent relationships; it's operational knowledge.",
    benefits: [
      {
        title: "Market entry strategy",
        desc: "Deep market analysis: demand, competition, channel structure, regulation. Go-to-market roadmap for 12 months.",
      },
      {
        title: "Localisation (not translation)",
        desc: "Culturally adapted content: not literal but transferred to local context. Native-speaker editors for every target language.",
      },
      {
        title: "Multilingual SEO",
        desc: "Hreflang implementation with the right ccTLD or subdomain strategy. Per-language keyword research (German uses different phrasing than Hungarian). Local link building.",
      },
      {
        title: "Cross-border PPC",
        desc: "Google Ads + Meta cross-country campaigns. Separate currency handling, country-specific billing flow, EU-wide GDPR compliance.",
      },
      {
        title: "Chinese market specialisation",
        desc: "WeChat, Baidu, Xiaohongshu (Little Red Book), Douyin (Chinese TikTok) marketing. Sino-Hungarian business partnership consulting.",
      },
      {
        title: "Local partnerships and influencer",
        desc: "Polish, Czech, German and Chinese influencer connections. Identifying local wholesalers and resellers. PR in target markets.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Market analysis and target country pick",
        desc: "Top 3-5 target country evaluation: market size, demand, competition intensity, TAM (Total Addressable Market) estimation. Win-rate calculator per country.",
      },
      {
        step: "02",
        title: "Localisation strategy",
        desc: "Domain strategy (.de vs /de, ccTLD vs subdomain), hreflang setup, native content editor selection. Company registration or local entity if needed.",
      },
      {
        step: "03",
        title: "Content and website localisation",
        desc: "Multilingual website versions, marketing materials (email, social) localisation, per-country keyword map. Pilot country 2-3 months.",
      },
      {
        step: "04",
        title: "Campaigns and scaling",
        desc: "Local Google Ads + Meta launch. Local PR and influencer outreach. Monthly review: which country scales, which scales down or fails.",
      },
    ],
    faq: [
      {
        q: "Which markets do you support for expansion?",
        a: "Primarily: DACH (Germany, Austria, Switzerland), CEE (Poland, Czech Republic, Slovakia, Romania), BeNeLux and UK. Special: China (WeChat + Baidu + local partnerships). For global expansion (US, India, MENA) we work with partner agencies.",
      },
      {
        q: "What's the difference between translation and localisation?",
        a: "Translation = literal conversion (often starting with machine translation). Localisation = full adaptation including humour, references, visual elements (models, colours), payment methods, legal text. A \"best in class\" slogan that works in Hungarian may be grammatically wrong in German and culturally alien in Polish.",
      },
      {
        q: "Do we need a new domain?",
        a: "Two strategies: (1) ccTLD (country domain): alongside domain.hu, domain.de, domain.cz — best local SEO but expensive and complex. (2) Subdomain or subdirectory: de.domain.com or domain.com/de — simpler but weaker local ranking. We typically recommend subdomain/subdirectory up to the 2-3rd market, then ccTLD.",
      },
      {
        q: "How long is the process?",
        a: "Pilot market (1 new country): 4-12 weeks full localisation flow. Scaling to additional markets: 6-8 weeks per new market if pilot is successful. Whether company formation or local entity is needed: separate consulting, 3-6 months.",
      },
      {
        q: "Can you help with Chinese market consulting?",
        a: "Yes. Our managing director Attila Győrfi is a guest lecturer at the University of Warsaw and a Chinese market specialist. He's reachable on WeChat with our Chinese partners directly. WeChat marketing, Baidu SEO, Tmall/JD listings, Xiaohongshu (Little Red Book) influencer campaigns. For Chinese market entry we typically also bring a Hungarian-Chinese legal practitioner due to the regulatory aspect.",
      },
      {
        q: "What does international expansion marketing cost?",
        a: "Pilot country launch (DACH/CEE): one-off HUF 1.5-3M (localisation + setup + first campaigns). Monthly management: HUF 400-900k / country. Chinese market pilot: HUF 3-6M (more complex regulatory side). Ad spend separate, typically HUF 300k-1.5M/month per country depending on market size.",
      },
    ],
    cta: "Request a free international marketing consultation",
  },
};

// ─── ZH ─────────────────────────────────────────────────────────────────────
const ZH: Record<string, ServiceConfig> = {
  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI 营销",
    subtitle: "营销中的人工智能",
    heroDesc: "自动化您的营销,通过个性化内容与 AI 驱动的分析提升转化率。",
    metaTitle: "AI 营销 —— 营销中的人工智能 | G2A Marketing",
    metaDesc: "基于 AI 的营销解决方案:自动化营销活动、个性化内容、预测性分析。借助人工智能提升效率。",
    icon: "bot",
    color: "#7c3aed",
    intro: "人工智能正在革新营销领域。借助 AI 工具,我们能够实现更精准的定向、个性化的沟通和自动化的工作流程 —— 时间和成本仅为传统方式的一小部分。",
    benefits: [
      { title: "预测性分析", desc: "AI 驱动的数据分析提前预测购买行为并优化营销活动。" },
      { title: "个性化内容", desc: "为每位用户自动呈现相关内容,提升参与度。" },
      { title: "自动化广告", desc: "智能出价与自动化广告活动管理,实现 ROI 最大化。" },
      { title: "聊天机器人集成", desc: "24/7 AI 客服机器人,创造真正的价值。" },
      { title: "内容生成", desc: "AI 辅助内容创作,加速营销工作流程。" },
      { title: "转化优化", desc: "基于机器学习的 A/B 测试与落地页优化。" },
    ],
    process: [
      { step: "01", title: "AI 审计", desc: "审查您当前的营销流程,识别 AI 集成机会。" },
      { step: "02", title: "战略", desc: "根据您的目标制定个性化的 AI 营销战略。" },
      { step: "03", title: "实施", desc: "部署 AI 工具,与您现有的系统集成。" },
      { step: "04", title: "优化", desc: "持续监控与微调,实现最佳效果。" },
    ],
    faq: [
      { q: "AI 营销适合多大规模的公司?", a: "AI 营销适合各种规模的企业。中小企业可从自动化中获益最多,大型企业则在预测性分析和个性化方面收效最大。" },
      { q: "多久能看到效果?", a: "首批效果通常在 4–8 周内显现,但完整潜力在 3–6 个月后才会充分释放。" },
      { q: "你们使用哪些 AI 工具?", a: "我们集成 Google AI、Meta AI 广告系统、OpenAI API、HubSpot AI、Jasper 等领先平台。" },
    ],
    cta: "申请免费 AI 营销评估",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC / Google Ads",
    subtitle: "付费搜索广告的专业管理",
    heroDesc: "通过专业的广告活动管理、精准定向和持续优化,最大化 Google Ads 投资回报。",
    metaTitle: "PPC Google Ads 管理 —— 付费广告 | G2A Marketing",
    metaDesc: "专业的 Google Ads 广告活动管理。Search、Display、Shopping、YouTube 广告。可衡量的成果,最大化 ROI。",
    icon: "target",
    color: "#ea4335",
    intro: "Google Ads 是提升即时可见度与转化的最有效工具之一。我们的专业团队精通各类广告活动 —— 从搜索广告到购物广告。",
    benefits: [
      { title: "Google Search Ads", desc: "在潜在客户搜索时精准出现的定向搜索广告。" },
      { title: "Google Display Network", desc: "Google 网络上的视觉广告,具备高效的再营销能力。" },
      { title: "Google Shopping", desc: "面向电商企业的产品广告,实现最大化转化。" },
      { title: "YouTube Ads", desc: "在全球第二大搜索引擎上的视频广告。" },
      { title: "Performance Max", desc: "AI 驱动的广告活动,跨所有 Google 渠道优化。" },
      { title: "再营销", desc: "通过定向广告找回未转化的网站访客。" },
    ],
    process: [
      { step: "01", title: "账户审计", desc: "审查现有广告活动并识别改进机会。" },
      { step: "02", title: "关键词调研", desc: "深入的关键词分析,实现最有效的定向。" },
      { step: "03", title: "广告活动构建", desc: "搭建最佳广告活动结构、广告组与创意。" },
      { step: "04", title: "优化", desc: "每周优化、出价管理和绩效报告。" },
    ],
    faq: [
      { q: "起步预算应该是多少?", a: "通常 Google Ads 广告活动从每月 100,000 福林起步比较合适,但实际取决于行业与目标。" },
      { q: "代理费用是多少?", a: "我们的费用基于管理预算。请预约免费咨询了解详情。" },
      { q: "我能拿到什么报告?", a: "我们每月发送详细的绩效报告,并提供 Google Ads 账户访问权限。" },
    ],
    cta: "申请免费 Google Ads 评估",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta 广告",
    subtitle: "Facebook 与 Instagram 广告管理",
    heroDesc: "在全球最大的社交平台上触达您的目标受众。精准定向、创意广告、可衡量的成果。",
    metaTitle: "Meta 广告 —— Facebook 与 Instagram 广告 | G2A Marketing",
    metaDesc: "专业的 Meta(Facebook、Instagram)广告管理。定向营销活动、再营销、转化优化。",
    icon: "smartphone",
    color: "#1877f2",
    intro: "Meta 平台(Facebook、Instagram、WhatsApp)拥有超过 30 亿活跃用户。借助其精准定向能力,您可以以外科手术般的精度触达理想客户。",
    benefits: [
      { title: "Facebook 广告", desc: "基于人口、兴趣与行为的 Facebook 定向广告。" },
      { title: "Instagram 广告", desc: "Instagram 上视觉冲击力强的广告,涵盖 Stories 和 Reels。" },
      { title: "Lookalike 受众", desc: "基于您最优质客户的相似受众定向。" },
      { title: "再营销", desc: "找回离开网站的访客和弃购用户。" },
      { title: "Lead Generation 广告", desc: "在平台内直接获取线索,转化率高。" },
      { title: "Catalog 广告", desc: "面向电商企业的动态产品广告。" },
    ],
    process: [
      { step: "01", title: "Pixel 部署", desc: "Meta Pixel 与 Conversion API 配置,实现精准测量。" },
      { step: "02", title: "受众构建", desc: "定义目标受众并创建 lookalike 受众。" },
      { step: "03", title: "创意开发", desc: "设计高效的广告创意与文案。" },
      { step: "04", title: "测试与优化", desc: "A/B 测试、广告活动优化与月度报告。" },
    ],
    faq: [
      { q: "Facebook 还是 Instagram —— 哪个更好?", a: "取决于您的受众。B2B 场景下 Facebook 更有效,年轻受众则适合 Instagram。通常两个平台都值得布局。" },
      { q: "我需要自己提供创意吗?", a: "不需要 —— 创意开发是我们服务的一部分。我们负责制作广告素材。" },
      { q: "如何衡量效果?", a: "通过 Meta Pixel 与 Conversion API 精准测量转化率、ROAS 与其他 KPI。" },
    ],
    cta: "申请免费 Meta 广告评估",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "内容营销",
    subtitle: "吸引客户的优质内容",
    heroDesc: "通过优质内容建立权威与自然流量。博客、视频、播客、信息图 —— 覆盖每个渠道。",
    metaTitle: "内容营销代理机构 —— 博客、SEO 内容 | G2A Marketing",
    metaDesc: "专业的内容营销:SEO 优化的博客文章、视频、社交媒体内容。提升自然流量与客户信任。",
    icon: "pen",
    color: "#10b981",
    intro: "内容营销是提升自然流量与客户信任最具成本效益的方式之一。我们用优质、SEO 优化的内容吸引潜在客户。",
    benefits: [
      { title: "SEO 博客文章", desc: "关键词优化的长篇文章,带来自然流量。" },
      { title: "社交媒体内容", desc: "为 Facebook、Instagram、LinkedIn 量身定制的内容。" },
      { title: "邮件营销", desc: "维系客户关系的优质简报内容。" },
      { title: "视频内容", desc: "面向 YouTube 与社交媒体的短视频与长视频。" },
      { title: "信息图", desc: "视觉冲击力强的数据可视化与信息图设计。" },
      { title: "客户案例", desc: "证明专业能力的有说服力的案例内容。" },
    ],
    process: [
      { step: "01", title: "内容审计", desc: "审查现有内容,识别改进机会。" },
      { step: "02", title: "战略", desc: "围绕受众制定内容日历与主题结构。" },
      { step: "03", title: "内容生产", desc: "兼顾 SEO 与转化的优质内容创作。" },
      { step: "04", title: "传播", desc: "多渠道传播与绩效测量。" },
    ],
    faq: [
      { q: "多久能看到效果?", a: "内容营销是长期投入。首批自然流量成果在 3–6 个月后显现,价值随时间呈指数增长。" },
      { q: "你们每月写多少篇文章?", a: "取决于套餐与预算。通常推荐每月 4–8 篇博客以达到最佳效果。" },
      { q: "谁来撰写内容?", a: "我们经验丰富的文案与行业专家撰写内容,SEO 专员负责优化。" },
    ],
    cta: "申请免费内容评估",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "营销自动化",
    subtitle: "更高效营销的自动化工作流",
    heroDesc: "通过自动化营销工作流节省时间、提升收入。CRM 集成、邮件自动化、线索培育。",
    metaTitle: "营销自动化 —— CRM、邮件、线索培育 | G2A Marketing",
    metaDesc: "营销自动化:CRM 集成、邮件自动化、线索培育、销售漏斗优化。借助自动化流程提升效率。",
    icon: "zap",
    color: "#f59e0b",
    intro: "营销自动化让您能够在合适的时间向合适的人传递合适的信息 —— 无需人工介入。它提升效率,减少手工工作。",
    benefits: [
      { title: "邮件自动化", desc: "基于触发器的邮件序列,自动响应用户行为。" },
      { title: "CRM 集成", desc: "HubSpot、Salesforce、ActiveCampaign 等 CRM 系统的配置与集成。" },
      { title: "线索培育", desc: "自动化的线索培育流程,引导潜在客户走向购买决策。" },
      { title: "销售漏斗", desc: "从线索生成到转化的完整销售漏斗自动化。" },
      { title: "细分", desc: "基于行为与人口的动态细分。" },
      { title: "报告", desc: "自动化的绩效报告与仪表板。" },
    ],
    process: [
      { step: "01", title: "流程梳理", desc: "审查当前营销流程,识别自动化机会。" },
      { step: "02", title: "平台选型", desc: "选择并配置最符合您目标的自动化平台。" },
      { step: "03", title: "工作流开发", desc: "设计并实施自动化工作流。" },
      { step: "04", title: "测试与优化", desc: "持续监控与微调,达到最佳效果。" },
    ],
    faq: [
      { q: "你们使用哪些平台?", a: "HubSpot、ActiveCampaign、Mailchimp、Klaviyo、Salesforce 等领先平台。" },
      { q: "实施需要多长时间?", a: "基础自动化系统 2–4 周可上线;复杂方案需要 6–8 周。" },
      { q: "需要现有的 CRM 系统吗?", a: "不强制但建议。如果没有,我们可以协助选型与配置。" },
    ],
    cta: "申请免费自动化评估",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG 传播",
    subtitle: "可持续与企业责任传播",
    heroDesc: "高效传播企业的可持续发展努力。ESG 报告、绿色营销、利益相关方沟通。",
    metaTitle: "ESG 传播 —— 可持续发展营销 | G2A Marketing",
    metaDesc: "ESG 与可持续发展传播:ESG 报告、绿色营销战略、利益相关方沟通、CSR 内容。",
    icon: "leaf",
    color: "#22c55e",
    intro: "ESG(环境、社会、治理)因素对投资人、客户与员工而言越来越重要。我们帮助您高效传播企业的可持续发展努力。",
    benefits: [
      { title: "ESG 战略", desc: "围绕公司价值观构建的全面 ESG 传播战略。" },
      { title: "可持续发展报告", desc: "专业的 ESG 与可持续发展报告。" },
      { title: "绿色营销", desc: "可信、有效的绿色营销活动,避免漂绿。" },
      { title: "利益相关方沟通", desc: "面向投资人、客户与员工的定向传播。" },
      { title: "CSR 内容", desc: "企业社会责任内容与营销活动。" },
      { title: "影响力测量", desc: "ESG 表现的测量与传播。" },
    ],
    process: [
      { step: "01", title: "ESG 审计", desc: "审查当前 ESG 活动与传播。" },
      { step: "02", title: "战略", desc: "ESG 传播战略与信息体系。" },
      { step: "03", title: "内容开发", desc: "ESG 内容、报告与营销活动。" },
      { step: "04", title: "传播", desc: "多渠道传播与利益相关方互动。" },
    ],
    faq: [
      { q: "ESG 报告是强制的吗?", a: "欧盟监管对越来越多的公司强制要求 ESG 报告。我们帮助您应对相关要求。" },
      { q: "ESG 与 CSR 的区别是什么?", a: "CSR 是自愿性的企业责任,ESG 则是面向投资人与监管的结构化、可衡量的框架。" },
      { q: "如何避免漂绿?", a: "通过可信、数据驱动的传播与透明度。我们帮助您展示真正的 ESG 表现。" },
    ],
    cta: "申请免费 ESG 传播咨询",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "雇主品牌",
    subtitle: "构建有吸引力的雇主品牌",
    heroDesc: "凭借强大的雇主品牌吸引顶尖人才并留住团队。EVP、招聘页、招聘营销。",
    metaTitle: "雇主品牌 —— 雇主品牌建设 | G2A Marketing",
    metaDesc: "雇主品牌:EVP 开发、招聘页、招聘营销、雇主传播。吸引顶尖人才。",
    icon: "users",
    color: "#8b5cf6",
    intro: "对优秀员工的争夺前所未有地激烈。强大的雇主品牌不仅简化招聘,更能降低离职率、提升员工敬业度。",
    benefits: [
      { title: "EVP 开发", desc: "Employer Value Proposition —— 我们定义您作为雇主的独特之处。" },
      { title: "招聘页", desc: "可转化候选人的招聘页设计与开发。" },
      { title: "招聘营销", desc: "面向 LinkedIn、Facebook 等平台的定向招聘活动。" },
      { title: "员工内容", desc: "真实的员工故事与内容。" },
      { title: "Glassdoor 管理", desc: "雇主资料优化与评论管理。" },
      { title: "内部传播", desc: "提升留任的内部雇主品牌活动。" },
    ],
    process: [
      { step: "01", title: "审计", desc: "评估当前雇主品牌与招聘流程。" },
      { step: "02", title: "EVP 开发", desc: "打造独特的雇主价值主张。" },
      { step: "03", title: "传播", desc: "创建雇主品牌内容与营销活动。" },
      { step: "04", title: "测量", desc: "测量招聘指标与员工满意度。" },
    ],
    faq: [
      { q: "什么时候应该重视雇主品牌?", a: "当您难以吸引合适的候选人、离职率高,或希望强化企业文化时。" },
      { q: "多久能看到效果?", a: "雇主品牌是长期投入。首批效果(更多、更优质的候选人)在 3–6 个月后显现。" },
      { q: "如何衡量雇主品牌的成效?", a: "通过招聘周期、单次招聘成本、offer 接受率、员工 NPS 与 Glassdoor 评分。" },
    ],
    cta: "申请免费雇主品牌咨询",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "国际营销",
    subtitle: "本地专业知识支持的全球扩张",
    heroDesc: "高效进入新市场。本地化、多语种 SEO、跨境营销活动与文化适配的传播。",
    metaTitle: "国际营销 —— 全球扩张 | G2A Marketing",
    metaDesc: "国际营销:本地化、多语种 SEO、跨境营销活动、文化适配传播。实现全球扩张。",
    icon: "globe",
    color: "#06b6d4",
    intro: "全球扩张面临严峻挑战 —— 不同的文化、语言、法规与消费者习惯。我们帮助您高效进入新市场,并适配营销信息。",
    benefits: [
      { title: "市场进入战略", desc: "针对新市场进入的详细分析与战略。" },
      { title: "本地化", desc: "文化适配的内容与传播 —— 不仅仅是翻译。" },
      { title: "多语种 SEO", desc: "带 hreflang 标签的多语种 SEO 战略与实施。" },
      { title: "跨境营销活动", desc: "多国广告活动管理。" },
      { title: "文化适配", desc: "根据文化背景调整营销信息。" },
      { title: "本地合作", desc: "在新市场中引入本地网红与合作伙伴。" },
    ],
    process: [
      { step: "01", title: "市场分析", desc: "目标市场分析:竞争格局、消费者习惯、监管。" },
      { step: "02", title: "战略", desc: "制定市场进入与营销战略。" },
      { step: "03", title: "本地化", desc: "本地化内容、广告与网站。" },
      { step: "04", title: "营销活动", desc: "启动并优化本地营销活动。" },
    ],
    faq: [
      { q: "你们支持向哪些市场扩张?", a: "我们主要专注于欧洲市场(DACH、CEE、Benelux、UK),也能支持全球扩张。" },
      { q: "翻译与本地化有什么区别?", a: "翻译是字面转换,本地化则在文化层面适配信息 —— 考虑当地习俗、幽默与价值观。" },
      { q: "需要在新市场设立本地办公室吗?", a: "不一定。借助数字营销工具,无需物理存在也能在新市场高效销售。" },
    ],
    cta: "申请免费国际营销咨询",
  },
};

const SERVICE_CONFIGS_I18N: Record<Language, Record<string, ServiceConfig>> = {
  hu: HU,
  en: EN,
  zh: ZH,
};

/**
 * Returns the service config for the given slug + language. Falls back to HU
 * if the language entry is missing — defensive only; should never trigger
 * since all 8 services have full HU/EN/ZH content.
 */
export function getServiceConfig(slug: string, lang: Language): ServiceConfig | undefined {
  return SERVICE_CONFIGS_I18N[lang]?.[slug] ?? SERVICE_CONFIGS_I18N.hu[slug];
}

export function hasServiceConfig(slug: string): boolean {
  return slug in SERVICE_CONFIGS_I18N.hu;
}

export default SERVICE_CONFIGS_I18N;
