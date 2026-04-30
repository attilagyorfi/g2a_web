import "dotenv/config";
import mysql from "mysql2/promise";

/**
 * Portfolio migration script — imports case studies from the legacy
 * g2amarketing.hu/portfolios/* WordPress pages into the new case_studies table.
 *
 * Process:
 *  1. Bullet-point keywords from the old page are rewritten as flowing prose
 *     in challenge/solution/results fields (no invented numbers — kept
 *     qualitative when source had no metrics).
 *  2. Images are downloaded by hand into client/public/case-studies/<slug>/
 *     and referenced as absolute paths (no dependency on the old WP CDN).
 *  3. Slugs match the legacy URL slug exactly so existing inbound links keep
 *     resolving (after we wire up redirects / a Wouter route).
 *
 * Usage:
 *   node scripts/migrate-portfolios.mjs
 *
 * Idempotent: uses INSERT ... ON DUPLICATE KEY UPDATE on slug, so re-runs
 * refresh content without duplicating rows.
 */

const CASES = [
  // ───────────────────────────────────────────────────────────────────────
  // 1. M Mérnöki Iroda Kft. — sample / template entry
  //    Source: https://g2amarketing.hu/portfolios/m-mernoki-iroda-kft/
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "m-mernoki-iroda-kft",
    client: "M Mérnöki Iroda Kft.",
    title: "M Mérnöki Iroda – Modern online arculat egy 30 éves szakmai múltnak",
    industry: "mernoki",
    industryLabel: "Mérnöki / Építészet",
    projectYear: "2021",
    featuredImage: "/case-studies/m-mernoki-iroda-kft/desktop.png",
    featuredImageAlt: "M Mérnöki Iroda Kft. weboldal képernyőképe asztali nézetben",
    logoImage: "/case-studies/m-mernoki-iroda-kft/logo.png",
    logoImageAlt: "M Mérnöki Iroda Kft. logó",
    // gallery field intentionally omitted — the gallery section was removed
    // from the detail page, so we don't download or reference extra screenshots.
    externalLinks: {
      website: "https://mmernoki.hu",
      facebook: "https://www.facebook.com/mmernoki",
      instagram: "https://www.instagram.com/mmernoki/",
      linkedin: "https://www.linkedin.com/company/mmernoki/",
    },

    // Challenge — what the client faced before us
    challenge: [
      "Az M Mérnöki Iroda három évtizedes szakmai tapasztalattal rendelkező cég, amely",
      "projektmenedzsmentet, építészetet, általános tervezést és statikai feladatokat lát el.",
      "Online jelenlétük azonban nem tükrözte ezt a presztízst: a meglévő weboldal nem volt",
      "mobilbarát, a közösségi médiában pedig csak alkalmi posztok jelentek meg. A cél olyan",
      "korszerű digitális arculat megalkotása volt, amely megszólítja a nagyobb beruházókat",
      "és építtetőket, és bizalmat épít a lehetséges partnerek felé.",
    ].join(" "),

    // Solution — what we did, in flowing prose (rewritten from bullet keywords)
    solution: [
      "Először átfogó marketing stratégiát dolgoztunk ki, amely a cég 30 éves múltjára és",
      "műszaki kompetenciájára építve pozicionálja az irodát. Ezt követte a teljes",
      "UI/UX újratervezése Figma-ban, majd a weboldal mobilbarát fejlesztése Bootstrap,",
      "HTML és CSS technológiákkal. Párhuzamosan elindítottuk a céget Facebook-on,",
      "Instagramon és LinkedIn-en, ahol kreatív szövegírással és egyedi grafikákkal",
      "támogattuk a folyamatos jelenlétet — minden poszt és vizuál egységes",
      "brand-arculatot követ, amely mérnöki precizitást és modernséget sugároz.",
    ].join(" "),

    // Results — qualitative only (source had no metrics; we don't invent numbers)
    results: [
      "Korszerű, mobilbarát weboldal,",
      "amely tükrözi a 30 éves szakmai múltat.",
      "Aktív közösségi média jelenlét három platformon.",
      "Egységes vizuális identitás minden online érintkezési ponton.",
    ].join(" "),

    tags: [
      "Marketing stratégia",
      "UI/UX",
      "Webfejlesztés",
      "Közösségi média",
      "Brand design",
    ],

    metaTitle: "M Mérnöki Iroda Kft. – Mérnöki cég modern arculata és weboldala | G2A Marketing",
    metaDescription:
      "Hogyan modernizáltuk egy 30 éves múltú mérnöki iroda online jelenlétét? Marketing stratégia, UI/UX, webfejlesztés és közösségi média esettanulmány a G2A Marketingtől.",

    isActive: 1,
    sortOrder: 1,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 2. Nissan Ste-Ba — autóipar, Pécsi Nissan márkakereskedő
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "nissan-ste-ba",
    client: "Nissan Ste-Ba",
    title: "Nissan Ste-Ba – Pécsi Nissan márkakereskedő közösségi kampányai",
    industry: "autoipari",
    industryLabel: "Autóipar",
    projectYear: "2021",
    featuredImage: "/case-studies/nissan-ste-ba/desktop.png",
    featuredImageAlt: "Nissan Ste-Ba weboldal képernyőképe",
    logoImage: "/case-studies/nissan-ste-ba/logo.png",
    logoImageAlt: "Nissan Ste-Ba logó",
    challenge: [
      "A pécsi Nissan márkakereskedés célja, hogy a regionális vásárlók elérjék az aktuális",
      "akciókat, modellkínálatot és szervizajánlatokat a megfelelő pillanatban — folyamatos,",
      "mérhető Facebook hirdetésekkel és kreatívan megfogalmazott posztokkal.",
    ].join(" "),
    solution: [
      "Részletes marketing stratégiát építettünk a kereskedés szezonális prioritásai köré,",
      "majd elindítottuk a folyamatos Facebook Ads kampányokat — célzott kreatívokkal és",
      "kéthetente cserélődő szövegvariációkkal. Minden hirdetéshez egyedi grafikát és",
      "értékesítés-orientált copy-t készítettünk, amely megőrzi a Nissan márkahangulatot.",
    ].join(" "),
    results: [
      "Folyamatos Facebook Ads jelenlét célzott kampányokkal.",
      "Egységes vizuális identitás minden hirdetésen és posztban.",
      "Értékesítés-orientált copy a régiós vásárlók megszólításához.",
    ].join(" "),
    tags: ["Marketing stratégia", "Facebook Ads", "Kreatív szövegírás", "Grafika"],
    externalLinks: {
      website: "http://nissansteba.hu/",
      facebook: "https://www.facebook.com/nissanpecs",
      instagram: "https://www.instagram.com/nissan.pecs/",
    },
    metaTitle: "Nissan Ste-Ba – Autóipari Facebook Ads esettanulmány | G2A Marketing",
    metaDescription:
      "Hogyan építettünk fel egy folyamatos Facebook Ads jelenlétet egy pécsi Nissan márkakereskedésnek? Marketing stratégia, kreatív szövegírás és grafika.",
    isActive: 1,
    sortOrder: 2,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 3. Honda Ste-Ba — autóipar, Pécsi Honda márkakereskedő
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "honda-ste-ba",
    client: "Honda Ste-Ba",
    title: "Honda Ste-Ba – Folyamatos Facebook jelenlét egy márkakereskedésnek",
    industry: "autoipari",
    industryLabel: "Autóipar",
    projectYear: "2021",
    featuredImage: "/case-studies/honda-ste-ba/desktop.png",
    featuredImageAlt: "Honda Ste-Ba weboldal képernyőképe",
    logoImage: "/case-studies/honda-ste-ba/logo.png",
    logoImageAlt: "Honda Ste-Ba logó",
    challenge: [
      "A pécsi Honda márkakereskedés rendszeres modelldebütálásokat, akciókat és szerviz",
      "ajánlatokat kommunikál — ehhez olyan közösségi média jelenlét kellett, amely a Honda",
      "globális arculatát követi, de helyi nyelven, helyi vásárlókhoz szól.",
    ].join(" "),
    solution: [
      "A Nissan testvérprojekttel párhuzamosan átfogó marketing stratégiát alakítottunk ki,",
      "majd elindítottuk a folyamatos Facebook Ads kampányokat. Minden poszthoz egyedi",
      "kreatív grafikát terveztünk — mindegyik a Honda brand-keretrendszerén belül marad,",
      "miközben a helyi pécsi vásárlóknak szól. A kreatív szövegírás során külön figyelmet",
      "fordítottunk arra, hogy az ajánlatok azonnal érthetőek és cselekvésre ösztönzőek legyenek.",
    ].join(" "),
    results: [
      "Folyamatos, márkanévhez illő Facebook hirdetési jelenlét.",
      "Helyi vásárlókhoz szóló copy és vizuális elemek.",
      "Egységes brand-arculat a Honda globális standardjén belül.",
    ].join(" "),
    tags: ["Marketing stratégia", "Facebook Ads", "Kreatív szövegírás", "Grafika"],
    externalLinks: {
      website: "https://steba.honda.hu/",
      facebook: "https://www.facebook.com/hondasteba",
      instagram: "https://www.instagram.com/honda.pecs/",
    },
    metaTitle: "Honda Ste-Ba – Honda márkakereskedés Facebook kampányai | G2A Marketing",
    metaDescription:
      "Hogyan építettük fel egy pécsi Honda márkakereskedés folyamatos Facebook jelenlétét? Marketing stratégia, kreatív szövegírás és grafika.",
    isActive: 1,
    sortOrder: 3,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 4. Childéric Hungary — kereskedelem / divat, lovas-felszerelés disztribúció
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "childeric-hungary",
    client: "Childéric Hungary",
    title: "Childéric Hungary – Új márka piacra vezetése a hazai piacra",
    industry: "kereskedelem",
    industryLabel: "Kereskedelem / Lovas-felszerelés",
    projectYear: "2021",
    featuredImage: "/case-studies/childeric-hungary/desktop.png",
    featuredImageAlt: "Childéric Hungary weboldal képernyőképe",
    logoImage: "/case-studies/childeric-hungary/logo.png",
    logoImageAlt: "Childéric Hungary logó",
    challenge: [
      "A Childéric francia márka magyar disztribúcióját nulláról kellett felépíteni — nem volt",
      "weboldal, nem volt közösségi média jelenlét, nem volt mérhető online forgalom.",
      "Komplett brand-bevezetésre volt szükség: arculattól a Search Console-ig.",
    ].join(" "),
    solution: [
      "Először a brand-arculatot építettük fel a magyar piacra adaptálva, majd WordPress-en",
      "elkészítettük az új weboldalt, amely tükrözi a Childéric prémium pozicionálását.",
      "Párhuzamosan létrehoztuk és menedzselni kezdtük a Facebook és Instagram fiókokat,",
      "valamint beállítottuk a Google Analytics és Search Console méréseket — így első naptól",
      "követni tudtuk a látogatottságot és optimalizálni a tartalmat a valós adatok alapján.",
    ].join(" "),
    results: [
      "Komplett brand-bevezetés nulláról: arculat, weboldal, közösségi média.",
      "Mérhető online jelenlét Google Analytics + Search Console integrációval.",
      "Aktív Facebook és Instagram menedzsment a hazai célcsoport felé.",
    ].join(" "),
    tags: ["Brand építés", "Webfejlesztés", "Arculat", "Közösségi média", "Analytics"],
    externalLinks: {
      website: "https://childeric.hu",
      facebook: "https://www.facebook.com/Childéric-Hungary-111238404779261",
      instagram: "https://www.instagram.com/childeric.hungary/",
    },
    metaTitle: "Childéric Hungary – Francia márka magyar piacra vezetése | G2A Marketing",
    metaDescription:
      "Hogyan vezettünk be egy francia márkát a magyar piacra a nulláról? Arculat, webfejlesztés, közösségi média és analytics esettanulmány.",
    isActive: 1,
    sortOrder: 4,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 5. Royal Sports — sportszer kereskedelem
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "royal-sports",
    client: "Royal Sports",
    title: "Royal Sports – Több csatornás hirdetéskezelés egy sportmárkának",
    industry: "kereskedelem",
    industryLabel: "Kereskedelem / Sportszer",
    projectYear: "2021",
    featuredImage: "/case-studies/royal-sports/desktop.png",
    featuredImageAlt: "Royal Sports weboldal képernyőképe",
    // logoImage omitted — source page didn't have a separate logo asset
    challenge: [
      "A Royal Sports célja a hazai sportcikk-kínálat hatékonyabb online megjelenítése volt,",
      "olyan többcsatornás kampányrendszerrel, amely Facebook és Google felületeken egyaránt",
      "értelmes ROI-t produkál — a versengő sportszer-piacon.",
    ].join(" "),
    solution: [
      "Marketing stratégiánk a csatorna-mix optimalizálására fókuszált: Facebook Ads-zel",
      "az érzelmi megszólítást és a brand-építést, Google Ads-zel a keresési szándék",
      "kihasználását célozzuk. Mindkét platformra egyedi kreatív szövegeket és grafikákat",
      "készítünk — minden hirdetéshez olyan vizuált, amely a sportos lendületet közvetíti.",
    ].join(" "),
    results: [
      "Egyidejű Facebook Ads + Google Ads jelenlét.",
      "Többcsatornás kampánystratégia.",
      "Egységes vizuális identitás a sportos brand-személyiséghez illeszkedve.",
    ].join(" "),
    tags: ["Marketing stratégia", "Facebook Ads", "Google Ads", "Kreatív szövegírás", "Grafika"],
    externalLinks: {
      website: "https://royalsports.eu/",
      facebook: "https://www.facebook.com/profile.php?id=100082136171215",
    },
    metaTitle: "Royal Sports – Sportmárka többcsatornás hirdetéskezelése | G2A Marketing",
    metaDescription:
      "Hogyan kezeltük egy sportmárka Facebook és Google hirdetéseit párhuzamosan? Esettanulmány több csatornás kampánystratégiáról.",
    isActive: 1,
    sortOrder: 5,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 6. Cafe Frei — vendéglátás, kávézó
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "cafe-frei",
    client: "Cafe Frei",
    title: "Cafe Frei – Modern, élményalapú weboldal a kávé szerelmeseinek",
    industry: "vendeglatas",
    industryLabel: "Vendéglátás / Kávézó",
    projectYear: "2021",
    featuredImage: "/case-studies/cafe-frei/desktop.png",
    featuredImageAlt: "Cafe Frei weboldal képernyőképe",
    logoImage: "/case-studies/cafe-frei/logo.png",
    logoImageAlt: "Cafe Frei logó",
    challenge: [
      "A Cafe Frei a világ kávékultúráját közvetíti, ezt a sokszínű élményt kellett egy",
      "modern weboldalon megragadni. Cél: olyan UX, amely a vendéget már a böngészés",
      "során belehúzza a Cafe Frei világába és könnyen átlátható menüt nyújt.",
    ].join(" "),
    solution: [
      "Az UX/UI tervezést Figma-ban indítottuk: a wireframe-ektől a részletes mockupokig.",
      "A vizuális koncepció a kávé érzelmi megélésére épít — gazdag képhasználat, áttekinthető",
      "menü és gyors navigáció. A weboldalt WIX-en valósítottuk meg, ami lehetővé teszi a",
      "Cafe Frei csapatának, hogy önállóan tudják frissíteni az új termékeket és akciókat.",
    ].join(" "),
    results: [
      "Modern UX/UI a kávé élményvilágát közvetítve.",
      "Áttekinthető menüszerkezet, gyors navigáció.",
      "Önállóan kezelhető tartalmi felület a Cafe Frei csapatnak.",
    ].join(" "),
    tags: ["Webfejlesztés", "UX/UI", "Figma", "WIX"],
    externalLinks: {
      website: "https://www.cafefrei.hu/",
      facebook: "https://www.facebook.com/cafefrei/",
    },
    metaTitle: "Cafe Frei – Kávézó modern UX/UI weboldala | G2A Marketing",
    metaDescription:
      "Hogyan terveztük újra a Cafe Frei weboldalát? UX/UI design Figma-ban, megvalósítás WIX-en — élményalapú kávé-weboldal esettanulmány.",
    isActive: 1,
    sortOrder: 6,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 7. Tüke Busz Zrt. — közösségi közlekedés, helyi pécsi vállalat
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "tuke-busz-zrt",
    client: "Tüke Busz Zrt.",
    title: "Tüke Busz – Közösségi közlekedés Facebook arculata",
    industry: "kozlekedes",
    industryLabel: "Közlekedés / Közszolgáltatás",
    projectYear: "2021",
    featuredImage: "/case-studies/tuke-busz-zrt/desktop.png",
    featuredImageAlt: "Tüke Busz weboldal képernyőképe",
    logoImage: "/case-studies/tuke-busz-zrt/logo.png",
    logoImageAlt: "Tüke Busz Zrt. logó",
    challenge: [
      "A Tüke Busz Pécs város közösségi közlekedését üzemelteti, ahol az utasok napi szinten",
      "tájékoztatást igényelnek menetrendi változásokról, vonalfejlesztésekről és üzembiztos",
      "információkról. A Facebook az elsődleges csatorna ehhez a kommunikációhoz, ami állandó,",
      "jól szerkesztett jelenlétet igényel.",
    ].join(" "),
    solution: [
      "Átvettük a teljes Facebook fiók üzemeltetését: napi szintű bejegyzések tervezése és",
      "publikálása, az utasforgalmat érintő hírek vizuális közvetítése, valamint a városi",
      "kommunikáció vizuális keretrendszerébe illeszkedő grafikák készítése. Minden poszt",
      "azonnal érthető, akkor is, ha az utas csak egy másodpercre néz a hírfolyamra.",
    ].join(" "),
    results: [
      "Folyamatos, hetente több posztos Facebook jelenlét.",
      "Egységes vizuális arculat a városi közlekedés brand-jén belül.",
      "Tájékoztatás-fókuszú kommunikáció az utasok számára.",
    ].join(" "),
    tags: ["Közösségi média", "Facebook menedzsment", "Grafika", "Bejegyzés készítés"],
    externalLinks: {
      website: "http://tukebusz.hu",
      facebook: "https://www.facebook.com/tukebuszzrt/",
    },
    metaTitle: "Tüke Busz Zrt. – Közlekedési Facebook arculat | G2A Marketing",
    metaDescription:
      "Hogyan kezeljük egy városi közösségi közlekedési vállalat Facebook fiókját? Napi tartalom, grafikák és utas-fókuszú kommunikáció.",
    isActive: 1,
    sortOrder: 7,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 8. GRB Skin Clinic — szépségipari / egészségügyi klinika
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "grb-skin-clinic",
    client: "GRB Skin Clinic",
    title: "GRB Skin Clinic – Komplex digitális jelenlét egy bőrgyógyászati klinikának",
    industry: "szepsegipari",
    industryLabel: "Szépségipar / Egészségügy",
    projectYear: "2022",
    featuredImage: "/case-studies/grb-skin-clinic/desktop.png",
    featuredImageAlt: "GRB Skin Clinic weboldal képernyőképe",
    logoImage: "/case-studies/grb-skin-clinic/logo.png",
    logoImageAlt: "GRB Skin Clinic logó",
    challenge: [
      "A GRB Skin Clinic prémium bőrgyógyászati és esztétikai szolgáltatásokat nyújt — olyan",
      "ügyfélkörnek, amely diszkréciót, hitelességet és professzionális információt vár.",
      "Komplex digitális marketing kellett, amely egyszerre kezeli a hirdetéseket, a SEO-t,",
      "a tartalmat és a weboldalt — egységes minőségben.",
    ].join(" "),
    solution: [
      "Egy kézben kezeljük a teljes digitális jelenlétet: a Google Ads kampányokat (kezelt",
      "költségvetés és kulcsszavak), a SEO-t (tartalmi optimalizálás, technikai audit), a",
      "WordPress-alapú weboldal fejlesztését és a kreatív szövegírást. Minden tartalom",
      "orvosi-szakmai pontosság és ügyfélbarát hangnem között egyensúlyoz.",
    ].join(" "),
    results: [
      "Komplex digitális jelenlét egy ügynökség kezében.",
      "WordPress-alapú modern weboldal.",
      "Folyamatos Google Ads + SEO együttműködés.",
    ].join(" "),
    tags: ["Hirdetéskezelés", "SEO", "Webfejlesztés", "Kreatív szövegírás"],
    externalLinks: {
      website: "https://grbbeauty.com/",
      facebook: "https://www.facebook.com/grbskinclinic/",
    },
    metaTitle: "GRB Skin Clinic – Bőrgyógyászati klinika digitális jelenléte | G2A Marketing",
    metaDescription:
      "Komplex digitális marketing egy bőrgyógyászati klinikának: Google Ads, SEO, webfejlesztés és tartalom egy ügynökségtől.",
    isActive: 1,
    sortOrder: 8,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 9. WebZperX — pécsi tech / digitális platform
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "webzperx",
    client: "WebZperX",
    title: "WebZperX – Google hirdetéskezelés és kreatív tartalom",
    industry: "technologia",
    industryLabel: "Technológia",
    projectYear: "2022",
    featuredImage: "/case-studies/webzperx/desktop.png",
    featuredImageAlt: "WebZperX weboldal képernyőképe",
    challenge: [
      "A WebZperX olyan célközönséget szólít meg, akik aktívan keresnek megoldásokat —",
      "vagyis a Google Search a legmegtérülőbb csatorna. Olyan kampányt kellett építeni,",
      "amely a megfelelő pillanatban, megfelelő üzenettel jelenik meg a keresési találatok",
      "között.",
    ].join(" "),
    solution: [
      "A teljes Google Ads kampánystruktúrát mi építettük fel: kulcsszó-stratégia,",
      "ad-csoportok, kreatív szövegek és landing oldal-illesztés. Minden hirdetéshez egyedi",
      "copy-t írunk, amely a felhasználói szándékhoz illeszkedik — nem általánosságban szól,",
      "hanem közvetlenül a keresési kifejezésre válaszol.",
    ].join(" "),
    results: [
      "Strukturált, mérhető Google Ads kampány.",
      "Keresési szándékhoz illeszkedő kreatív szövegek.",
      "Folyamatos kampányoptimalizálás a teljesítmény alapján.",
    ].join(" "),
    tags: ["Google Ads", "Hirdetéskezelés", "Kreatív szövegírás"],
    externalLinks: {
      website: "https://webzperx.hu/",
      facebook: "https://www.facebook.com/WebZperX/",
    },
    metaTitle: "WebZperX – Google Ads esettanulmány | G2A Marketing",
    metaDescription:
      "Hogyan építettük fel egy tech cég Google Ads kampányát kulcsszó-stratégiától a kreatív szövegekig? Esettanulmány.",
    isActive: 1,
    sortOrder: 9,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 10. AR Works — XR / kiterjesztett valóság technológia
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "ar-works",
    client: "AR Works",
    title: "AR Works – Kiterjesztett valóság szakcég modern weboldala",
    industry: "technologia",
    industryLabel: "Technológia / XR",
    projectYear: "2022",
    featuredImage: "/case-studies/ar-works/desktop.png",
    featuredImageAlt: "AR Works weboldal képernyőképe",
    logoImage: "/case-studies/ar-works/logo.png",
    logoImageAlt: "AR Works logó",
    challenge: [
      "Az AR Works kiterjesztett valóság (AR/VR) megoldásokat fejleszt vállalati ügyfeleknek.",
      "Olyan weboldalra volt szükségük, amely a high-tech jelleget és a komplex technológiai",
      "kompetenciát egyaránt közvetíti — vizuálisan és tartalmilag is megfelel a B2B-tech",
      "vásárlók elvárásainak.",
    ].join(" "),
    solution: [
      "WordPress-alapra építettünk egy teljesen újragondolt weboldalt, ahol a tartalmi",
      "struktúra tisztán mutatja az AR Works szolgáltatásportfólióját és referenciáit. Az",
      "egyedi HTML/CSS testreszabás technológiailag korrekt, a megjelenés pedig megfelel egy",
      "innovatív tech cég önképének.",
    ].join(" "),
    results: [
      "Modern, tech-arculatú WordPress weboldal.",
      "Strukturált szolgáltatás- és referencia-bemutatás.",
      "B2B-tech vásárlókhoz illeszkedő vizuális hangvétel.",
    ].join(" "),
    tags: ["Webfejlesztés", "WordPress", "HTML/CSS"],
    externalLinks: {
      website: "https://arworks.hu",
      youtube: "https://www.youtube.com/user/ARworksReality",
      linkedin: "https://www.linkedin.com/in/szabolcs-budahazy-74468812/",
    },
    metaTitle: "AR Works – AR/VR cég modern weboldala | G2A Marketing",
    metaDescription:
      "Kiterjesztett valóság cég weboldal-fejlesztése WordPress-en, HTML és CSS testreszabással. B2B-tech esettanulmány.",
    isActive: 1,
    sortOrder: 10,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 11. Rehab Designer — akadálymentes tervezés
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "rehab-designer",
    client: "Rehab Designer",
    title: "Rehab Designer – Akadálymentes tervezés komplett digitális arculattal",
    industry: "egeszsegugy",
    industryLabel: "Egészségügy / Akadálymentesítés",
    projectYear: "2021",
    featuredImage: "/case-studies/rehab-designer/desktop.png",
    featuredImageAlt: "Rehab Designer weboldal képernyőképe",
    logoImage: "/case-studies/rehab-designer/logo.png",
    logoImageAlt: "Rehab Designer logó",
    challenge: [
      "A Rehab Designer akadálymentes lakás- és intézménytervezést kínál — olyan szolgáltatás,",
      "amelyet kifejezetten a célcsoportnak (mozgáskorlátozottak, idősek, családok) kell",
      "érthetően kommunikálni. Nulláról kellett felépíteni a teljes digitális jelenlétet:",
      "arculattól a Google Ads-ig.",
    ].join(" "),
    solution: [
      "Először a brand-építést és vizuális identitást alakítottuk ki, majd a WordPress-alapú",
      "weboldal következett Figma-tervek alapján. Létrehoztuk a Facebook és LinkedIn jelenlétet,",
      "elindítottuk a Google Ads kampányokat, és beállítottuk a Google Analytics + Search",
      "Console méréseket. Az egész egy ügynökségi csomag — egységes brand-élmény minden",
      "érintkezési ponton.",
    ].join(" "),
    results: [
      "Teljes brand-bevezetés nulláról: arculat, web, közösségi média, hirdetés.",
      "WordPress weboldal Figma-tervek alapján.",
      "Mérhető online jelenlét Analytics + Search Console-lal.",
    ].join(" "),
    tags: ["Webfejlesztés", "Brand", "Vizuális identitás", "Közösségi média", "Google Ads", "Analytics"],
    externalLinks: {
      website: "https://rehabdesigner.hu",
      facebook: "https://www.facebook.com/akadalymentestervezo",
      linkedin: "https://www.linkedin.com/company/rehab-designer",
    },
    metaTitle: "Rehab Designer – Akadálymentes tervező cég komplett digitális arculata | G2A Marketing",
    metaDescription:
      "Egy akadálymentesítési szakcég teljes digitális arculatának építése: brand, weboldal, közösségi média, Google Ads és analytics.",
    isActive: 1,
    sortOrder: 11,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 12. Vidashop — kereskedelem, e-commerce
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "vidashop",
    client: "Vidashop",
    title: "Vidashop – Hirdetéskezelés és kreatív szövegírás egy webáruháznak",
    industry: "kereskedelem",
    industryLabel: "E-commerce",
    projectYear: "2022",
    featuredImage: "/case-studies/vidashop/desktop.png",
    featuredImageAlt: "Vidashop weboldal képernyőképe",
    logoImage: "/case-studies/vidashop/logo.webp",
    logoImageAlt: "Vidashop logó",
    challenge: [
      "A Vidashop webáruház rendszeres, mérhető Google Ads kampányokat igényelt, amelyek",
      "a konverziós potenciál maximalizálására fókuszálnak — kreatív, kattintásra ösztönző",
      "szövegekkel és relevánsan szegmentált célzással.",
    ].join(" "),
    solution: [
      "A teljes Google Ads hirdetéskezelést átvettük: a kulcsszó-stratégiától a hirdetés-",
      "csoportokon át a landing oldal-illesztésig. Minden kampányhoz egyedi szövegeket",
      "írunk — olyan formában, amely közvetlenül megszólítja a vásárlói szándékot, és",
      "megerősíti a Vidashop pozicionálását.",
    ].join(" "),
    results: [
      "Folyamatos Google Ads jelenlét.",
      "Kreatív, konverzió-fókuszú szövegezés.",
      "Mérhető hirdetéskezelés és optimalizálás.",
    ].join(" "),
    tags: ["Hirdetéskezelés", "Google Ads", "Kreatív szövegírás"],
    externalLinks: {
      website: "https://vidashop.hu/",
      facebook: "https://www.facebook.com/vidashophu",
    },
    metaTitle: "Vidashop – Webáruház Google Ads esettanulmány | G2A Marketing",
    metaDescription:
      "Hogyan kezeljük egy webáruház teljes Google Ads stratégiáját kreatív szövegekkel és optimalizált kampányokkal?",
    isActive: 1,
    sortOrder: 12,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 13. Alkatrészvadász — autóipari alkatrész webáruház
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "alkatreszvadasz",
    client: "Alkatrészvadász",
    title: "Alkatrészvadász – Egyedi OpenCart webáruház autóalkatrészekhez",
    industry: "autoipari",
    industryLabel: "Autóipar / E-commerce",
    projectYear: "2023",
    featuredImage: "/case-studies/alkatreszvadasz/desktop.png",
    featuredImageAlt: "Alkatrészvadász weboldal képernyőképe",
    logoImage: "/case-studies/alkatreszvadasz/logo.png",
    logoImageAlt: "Alkatrészvadász logó",
    challenge: [
      "Az Alkatrészvadász egy speciális e-commerce: szakértő autósoknak és szervizeseknek",
      "ad el alkatrészeket. A standard webshop-sablonok nem feleltek meg a komplex",
      "termékkínálat és szűrési igények miatt — egyedi megoldás kellett.",
    ].join(" "),
    solution: [
      "A teljes webáruházat OpenCart platformra építettük, egyedi testreszabással:",
      "nagy mennyiségű alkatrész-katalógus kezelése, gyors szűrők, könnyen átlátható",
      "termékadatlap. A platform robusztus alapot ad a folyamatos termékbővítéshez,",
      "miközben gyorsan tölt és mobilbarát.",
    ].join(" "),
    results: [
      "Egyedi OpenCart webáruház autóalkatrész-szektorhoz.",
      "Nagy termékkínálat hatékony kezelése.",
      "Mobilbarát, gyors felhasználói élmény.",
    ].join(" "),
    tags: ["Webfejlesztés", "OpenCart", "E-commerce"],
    externalLinks: {
      website: "https://alkatreszvadasz.hu/",
    },
    metaTitle: "Alkatrészvadász – OpenCart autóalkatrész webáruház | G2A Marketing",
    metaDescription:
      "Egyedi OpenCart-alapú webáruház autóalkatrészekhez. Komplex termékkatalógus, gyors szűrés, mobilbarát UX esettanulmány.",
    isActive: 1,
    sortOrder: 13,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 14. Donkey Pizza — vendéglátás, pizzéria
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "donkey-pizza",
    client: "Donkey Pizza",
    title: "Donkey Pizza – Több platformos közösségi és hirdetési stratégia egy pizzériának",
    industry: "vendeglatas",
    industryLabel: "Vendéglátás / Pizzéria",
    projectYear: "2023",
    featuredImage: "/case-studies/donkey-pizza/desktop.png",
    featuredImageAlt: "Donkey Pizza weboldal képernyőképe",
    logoImage: "/case-studies/donkey-pizza/logo.png",
    logoImageAlt: "Donkey Pizza logó",
    challenge: [
      "A Donkey Pizza pécsi pizzéria, ahol a fiatal célközönség elérése az elsődleges szempont.",
      "TikTok, Instagram, Facebook és Google — egyszerre több platformon kellett egységes",
      "marketing stratégiát működtetni, miközben mindegyik csatorna saját vizuális nyelvét",
      "követi.",
    ].join(" "),
    solution: [
      "Komplex marketing stratégiát építettünk: Facebook + Instagram + TikTok jelenlét",
      "kreatív szövegírással és platform-specifikus grafikákkal, mellette folyamatos Google",
      "hirdetések és Rillgo platform integráció. Minden poszt a Donkey Pizza laza, fiatalos",
      "brand-hangulatában készül — a vásárlók ugyanazt a karaktert kapják, akármilyen",
      "csatornán találkoznak vele.",
    ].join(" "),
    results: [
      "Egyidejű Facebook + Instagram + TikTok jelenlét.",
      "Folyamatos Google hirdetési kampányok.",
      "Egységes laza, fiatalos brand-hangulat minden csatornán.",
    ].join(" "),
    tags: ["Hirdetéskezelés", "Marketing stratégia", "Közösségi média", "TikTok", "Grafika"],
    externalLinks: {
      website: "https://pizzadonkey.hu/",
      facebook: "https://www.facebook.com/pizzadonkeypecs",
      instagram: "https://www.instagram.com/donkey.pizza/",
    },
    metaTitle: "Donkey Pizza – Pizzéria többplatformos közösségi marketingje | G2A Marketing",
    metaDescription:
      "Hogyan kezeljük egy pizzéria Facebook, Instagram, TikTok és Google jelenlétét egyszerre? Egységes brand-hang több csatornán.",
    isActive: 1,
    sortOrder: 14,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 15. Buborékpark — szabadidős attrakció
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "buborekpark",
    client: "Buborékpark",
    title: "Buborékpark – Szabadidős attrakció modern weboldala és hirdetései",
    industry: "vendeglatas",
    industryLabel: "Szabadidő / Vendéglátás",
    projectYear: "2023",
    featuredImage: "/case-studies/buborekpark/desktop.png",
    featuredImageAlt: "Buborékpark weboldal képernyőképe",
    logoImage: "/case-studies/buborekpark/logo.png",
    logoImageAlt: "Buborékpark logó",
    challenge: [
      "A Buborékpark családi szabadidős attrakció, ahol a látogatók online tájékozódnak",
      "az árakról, nyitvatartásról és élményekről. Olyan weboldal kellett, amely vidám,",
      "családbarát hangvételével azonnal eladja az élményt — és Google Ads kampányok,",
      "amelyek pontosan a megfelelő érdeklődőket vonzzák.",
    ].join(" "),
    solution: [
      "WordPress-alapra építettünk egy responsive weboldalt, amely mobilon és asztalon",
      "ugyanúgy jól néz ki — fontos, mert a foglalások nagy része mobilról jön. A Google Ads",
      "kampányokat lokális targetinggel és játékos hirdetésszövegekkel indítottuk, amelyek",
      "kifejezetten a családokat és iskolai csoportokat célozzák.",
    ].join(" "),
    results: [
      "Mobilbarát, family-friendly WordPress weboldal.",
      "Lokális Google Ads kampány célzott szegmensekre.",
      "Játékos hangvétel a hirdetésekben és a weboldalon.",
    ].join(" "),
    tags: ["Hirdetéskezelés", "Webfejlesztés", "WordPress", "Google Ads", "Responsive design"],
    externalLinks: {
      website: "https://www.buborekpark.hu/",
    },
    metaTitle: "Buborékpark – Szabadidős attrakció weboldala és hirdetései | G2A Marketing",
    metaDescription:
      "Mobilbarát WordPress weboldal és lokális Google Ads kampányok egy családi szabadidős attrakciónak. Esettanulmány.",
    isActive: 1,
    sortOrder: 15,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 16. Dent & Beauty — fogászati és esztétikai klinika
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "dent-beauty",
    client: "Dent & Beauty",
    title: "Dent & Beauty – Fogászati és esztétikai klinika weboldala",
    industry: "egeszsegugy",
    industryLabel: "Egészségügy / Esztétika",
    projectYear: "2022",
    featuredImage: "/case-studies/dent-beauty/desktop.png",
    featuredImageAlt: "Dent & Beauty weboldal képernyőképe",
    logoImage: "/case-studies/dent-beauty/logo.png",
    logoImageAlt: "Dent & Beauty logó",
    challenge: [
      "A Dent & Beauty fogászati és esztétikai szolgáltatásokat kínál. Olyan weboldal kellett,",
      "amely egyszerre érzékelteti a klinikai szakértelmet és a kényelmes, prémium élményt —",
      "miközben a páciensek számára gyorsan átlátható információt nyújt.",
    ].join(" "),
    solution: [
      "WordPress-alapú responsive weboldalt fejlesztettünk, ahol a kezelés-portfólió",
      "tisztán strukturált, az árak és időpontok könnyen elérhetőek. Asztali és mobilra",
      "egyaránt optimalizálva — a legtöbb páciens a telefonján keresi a klinikát, ezt vettük",
      "alapnak.",
    ].join(" "),
    results: [
      "Mobilbarát klinikai weboldal WordPress-en.",
      "Strukturált kezelés-portfólió.",
      "Páciens-fókuszú információs hierarchia.",
    ].join(" "),
    tags: ["Webfejlesztés", "WordPress", "Responsive design"],
    externalLinks: {
      website: "https://dentbeauty.eu/",
    },
    metaTitle: "Dent & Beauty – Fogászati klinika modern weboldala | G2A Marketing",
    metaDescription:
      "Mobilbarát WordPress weboldal egy fogászati és esztétikai klinikának. Páciens-fókuszú UX esettanulmány.",
    isActive: 1,
    sortOrder: 16,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 17. Vapor Spirit — CBD termék webshop
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "vapor-spirit",
    client: "Vapor Spirit",
    title: "Vapor Spirit – Shopify webáruház CBD termékekhez",
    industry: "kereskedelem",
    industryLabel: "E-commerce / CBD",
    projectYear: "2023",
    featuredImage: "/case-studies/vapor-spirit/desktop.png",
    featuredImageAlt: "Vapor Spirit Shopify webáruház képernyőképe",
    logoImage: "/case-studies/vapor-spirit/logo.png",
    logoImageAlt: "Vapor Spirit logó",
    challenge: [
      "A Vapor Spirit CBD-olaj és kapcsolódó termékek értékesítésére építette webshopját.",
      "Specializált terület, ahol a webáruháznak megbízhatóságot kell sugároznia, miközben",
      "a fizetés és a termékadatlap kezelése zökkenőmentes — mindezt egy könnyen bővíthető",
      "platformon.",
    ].join(" "),
    solution: [
      "A teljes webshopot Shopify-ra építettük, ami robust e-commerce alapot ad: integrált",
      "fizetés, termékkezelés, marketing eszközök. A Vapor Spirit csapat önállóan tudja",
      "frissíteni a termékkínálatot, kampányokat indítani és követni a teljesítményt — mi",
      "az alapot tettük le, ők működtetik.",
    ].join(" "),
    results: [
      "Stabil, skálázható Shopify webáruház.",
      "Önállóan kezelhető termék- és kampányadminisztráció.",
      "Integrált fizetési és marketing eszközök.",
    ].join(" "),
    tags: ["Webfejlesztés", "Shopify", "E-commerce"],
    externalLinks: {
      website: "https://vaporspiritcbdolaj.com/",
    },
    metaTitle: "Vapor Spirit – Shopify CBD webáruház | G2A Marketing",
    metaDescription:
      "Shopify-alapú webáruház egy CBD termékekkel foglalkozó cégnek. Integrált fizetés, könnyen bővíthető termékkatalógus.",
    isActive: 1,
    sortOrder: 17,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 18. Royal Portrait — fotográfiai szolgáltatás
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "royal-portrait",
    client: "Royal Portrait",
    title: "Royal Portrait – Fotográfiai szolgáltatás vizuális weboldala",
    industry: "kreativ",
    industryLabel: "Kreatív / Fotográfia",
    projectYear: "2022",
    featuredImage: "/case-studies/royal-portrait/desktop.png",
    featuredImageAlt: "Royal Portrait weboldal képernyőképe",
    logoImage: "/case-studies/royal-portrait/logo.png",
    logoImageAlt: "Royal Portrait logó",
    challenge: [
      "Egy portré-fotográfus weboldalának a képeknek kell beszélnie. A kihívás: olyan",
      "WordPress sablon és webdesign, amely a vizuális tartalom köré épül, gyorsan tölt,",
      "és lehetővé teszi a portfólió rendszeres bővítését — mindezt minimalista, prémium",
      "élményként.",
    ].join(" "),
    solution: [
      "WordPress-en készítettünk egy kép-központú weboldalt, ahol a portré-galéria a",
      "központi élmény. A grafikai feladatokat (logó, vizuális elemek) is mi készítettük,",
      "így a teljes brand-élmény egy kézből áll össze. Az asztali és mobil nézet egyaránt",
      "úgy mutatja a fotókat, hogy az ügyfél azonnal érzi a stílust.",
    ].join(" "),
    results: [
      "Kép-központú WordPress weboldal.",
      "Egyedi grafikai elemek és vizuális identitás.",
      "Mobilbarát portfólió-megjelenítés.",
    ].join(" "),
    tags: ["Webdesign", "Webfejlesztés", "Grafika", "WordPress"],
    externalLinks: {
      website: "https://royal-portrait.at/",
    },
    metaTitle: "Royal Portrait – Fotográfiai weboldal és arculat | G2A Marketing",
    metaDescription:
      "Kép-központú WordPress weboldal egy portré-fotográfusnak. Vizuális identitás, grafikai elemek és portfólió-élmény.",
    isActive: 1,
    sortOrder: 18,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 19. ENO Ceramics — kerámia gyártás / dizájn
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "eno-ceramics",
    client: "ENO Ceramics",
    title: "ENO Ceramics – Prémium kerámia márka weboldala SEO-stratégiával",
    industry: "kereskedelem",
    industryLabel: "Dizájn / Kerámia",
    projectYear: "2023",
    featuredImage: "/case-studies/eno-ceramics/desktop.png",
    featuredImageAlt: "ENO Ceramics weboldal képernyőképe",
    logoImage: "/case-studies/eno-ceramics/logo.png",
    logoImageAlt: "ENO Ceramics logó",
    challenge: [
      "Az ENO Ceramics prémium kerámia termékeket gyárt és értékesít — olyan célközönségnek,",
      "amely az anyagminőséget és a kézműves jelleget keresi. A weboldalnak ezt az",
      "értékközösséget kellett azonnal közvetítenie, miközben a SEO-strukúra megalapozza a",
      "hosszú távú organikus láthatóságot.",
    ].join(" "),
    solution: [
      "WordPress-en készült a webdesign, ahol a termékek minőségi fotográfia köré épülnek.",
      "Párhuzamosan átfogó SEO-stratégiát dolgoztunk ki: kulcsszó-kutatás, tartalmi struktúra,",
      "technikai optimalizálás. Ez azt jelenti, hogy az ENO Ceramics nemcsak szépen néz ki",
      "online, hanem a Google szempontjából is megalapozott — első naptól optimalizálva van.",
    ].join(" "),
    results: [
      "Prémium dizájn-fókuszú WordPress weboldal.",
      "Átfogó SEO-stratégia kulcsszó-kutatástól a technikai optimalizálásig.",
      "Hosszú távú organikus növekedési alap.",
    ].join(" "),
    tags: ["Webdesign", "SEO", "WordPress"],
    externalLinks: {
      website: "https://enoceramics.com/",
    },
    metaTitle: "ENO Ceramics – Prémium kerámia márka weboldala és SEO | G2A Marketing",
    metaDescription:
      "WordPress webdesign és átfogó SEO-stratégia egy prémium kerámia márkának. Dizájn-fókuszú esettanulmány.",
    isActive: 1,
    sortOrder: 19,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 20. Variatok — webfejlesztés
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "variatok",
    client: "Variatok",
    title: "Variatok – WordPress weboldal egyedi fejlesztéssel",
    industry: "kereskedelem",
    industryLabel: "Általános",
    projectYear: "2022",
    featuredImage: "/case-studies/variatok/desktop.png",
    featuredImageAlt: "Variatok weboldal képernyőképe",
    logoImage: "/case-studies/variatok/logo.png",
    logoImageAlt: "Variatok logó",
    challenge: [
      "A Variatok számára olyan webes platform kellett, amely megbízható alapot ad a",
      "tartalmi bővítéshez, és a vásárlók könnyen tudnak benne tájékozódni — anélkül, hogy",
      "minden frissítéshez fejlesztőre lenne szükség.",
    ].join(" "),
    solution: [
      "A teljes weboldalt WordPress-re építettük, az ügyfél igényeihez szabott struktúrával",
      "és tartalomtípusokkal. A felület úgy van összerakva, hogy a Variatok csapata önállóan",
      "tudja kezelni a tartalmat — nem ragad le a fejlesztői kapcsolatban a hosszú távra.",
    ].join(" "),
    results: [
      "Egyedi WordPress weboldal.",
      "Önállóan szerkeszthető tartalom.",
      "Bővíthető struktúra a hosszú távú tartalom-stratégiához.",
    ].join(" "),
    tags: ["Webfejlesztés", "WordPress"],
    externalLinks: {
      website: "https://variatok.hu/",
    },
    metaTitle: "Variatok – WordPress weboldal fejlesztés | G2A Marketing",
    metaDescription:
      "Egyedi WordPress weboldal a Variatok számára, könnyen kezelhető tartalmi struktúrával.",
    isActive: 1,
    sortOrder: 20,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 21. Granvisus — szemüveg / lencse webshop, közösségi média
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "granvisus",
    client: "Granvisus",
    title: "Granvisus – Szemüveg-márka közösségi média menedzsmentje",
    industry: "kereskedelem",
    industryLabel: "Optika / Egészség",
    projectYear: "2023",
    featuredImage: "/case-studies/granvisus/desktop.webp",
    featuredImageAlt: "Granvisus weboldal képernyőképe",
    logoImage: "/case-studies/granvisus/logo.png",
    logoImageAlt: "Granvisus logó",
    challenge: [
      "A Granvisus prémium szemüvegeket és lencséket forgalmaz. A célközönsége vizuálisan",
      "érzékeny — Instagramon és Facebookon keresi a stílusos megoldásokat. A márkának olyan",
      "közösségi média jelenlét kellett, amely tükrözi a termék minőségét és a vásárlói",
      "életstílust.",
    ].join(" "),
    solution: [
      "Átvettük a Facebook és Instagram fiókok teljes menedzsmentjét. Heti tartalmi tervet",
      "készítünk, posztokat tervezünk és publikálunk, válaszolunk a kommentekre és üzenetekre.",
      "Minden vizuál a Granvisus prémium hangulatában készül — letisztult, minőségi,",
      "életstílus-fókuszú.",
    ].join(" "),
    results: [
      "Folyamatos Facebook + Instagram jelenlét.",
      "Heti tartalmi tervezés és publikálás.",
      "Letisztult, prémium vizuális stílus minden poszton.",
    ].join(" "),
    tags: ["Közösségi média", "Facebook menedzsment", "Instagram menedzsment"],
    externalLinks: {
      website: "https://granvisus.com",
    },
    metaTitle: "Granvisus – Szemüveg-márka közösségi média menedzsmentje | G2A Marketing",
    metaDescription:
      "Hogyan kezeljük egy prémium szemüveg-márka Facebook és Instagram jelenlétét? Életstílus-fókuszú közösségi média esettanulmány.",
    isActive: 1,
    sortOrder: 21,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 22. ZSÖK — Zsolnay Örökségkezelő, kulturális nonprofit
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "zsok",
    client: "Zsolnay Örökségkezelő Nonprofit Kft.",
    title: "ZSÖK – SEO audit és optimalizáció a Zsolnay örökségnek",
    industry: "onkormanyzat",
    industryLabel: "Kultúra / Nonprofit",
    projectYear: "2023",
    featuredImage: "/case-studies/zsok/desktop.webp",
    featuredImageAlt: "ZSÖK weboldal képernyőképe",
    logoImage: "/case-studies/zsok/logo.jpg",
    logoImageAlt: "Zsolnay Örökségkezelő logó",
    challenge: [
      "A Zsolnay Örökségkezelő Nonprofit Kft. (ZSÖK) a pécsi Zsolnay Negyed kulturális életét",
      "működteti — múzeumok, kiállítások, programok. Sok látogató Google-keresésen keresztül",
      "találja meg az aktuális eseményeket, ezért a weboldal SEO-teljesítménye direkt hatással",
      "van a látogatószámra.",
    ].join(" "),
    solution: [
      "Részletes SEO felmérést végeztünk a teljes weboldalra: technikai audit, kulcsszó-",
      "elemzés, tartalmi gap-analízis. Konkrét, prioritizált javítási javaslatokat adtunk át",
      "a ZSÖK csapatának, amelyek a leglátványosabb eredményt hozhatják — és olyan SEO",
      "eszközöket javasoltunk, amelyekkel a csapat önállóan tudja folytatni az optimalizálást.",
    ].join(" "),
    results: [
      "Részletes SEO felmérés és prioritizált javaslatlista.",
      "Önállóan folytatható optimalizálási folyamat.",
      "Eszköz-javaslatok a csapat számára.",
    ].join(" "),
    tags: ["SEO audit", "SEO stratégia", "Tanácsadás"],
    externalLinks: {
      website: "https://www.zsokkft.hu/",
    },
    metaTitle: "ZSÖK – Zsolnay Örökségkezelő SEO audit | G2A Marketing",
    metaDescription:
      "SEO audit és optimalizációs javaslatok a Zsolnay Örökségkezelő Nonprofit Kft. számára. Kulturális nonprofit esettanulmány.",
    isActive: 1,
    sortOrder: 22,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 23. Proverium Ügyvédi Iroda — jogi szektor
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "proverium-ugyvedi-iroda",
    client: "Proverium Ügyvédi Iroda",
    title: "Proverium Ügyvédi Iroda – Komplex digitális megjelenés egy ügyvédi irodának",
    industry: "jogi",
    industryLabel: "Jogi szektor",
    projectYear: "2024",
    featuredImage: "/case-studies/proverium-ugyvedi-iroda/desktop.png",
    featuredImageAlt: "Proverium Ügyvédi Iroda weboldal képernyőképe",
    logoImage: "/case-studies/proverium-ugyvedi-iroda/logo.webp",
    logoImageAlt: "Proverium Ügyvédi Iroda logó",
    challenge: [
      "A Proverium Ügyvédi Iroda komplex jogi szolgáltatásokat kínál vállalati és magánügyfeleknek.",
      "Olyan digitális megjelenés kellett, amely tekintélyt sugároz, de nem hideg — és az",
      "online keresőkben is jól helyezkedik, hiszen az ügyvédi szektor egyik legversengőbb",
      "online piaca.",
    ].join(" "),
    solution: [
      "WordPress-alapú weboldalt fejlesztettünk modern, ügyvédi presztízshez illő dizájnnal.",
      "Párhuzamosan SEO-optimalizálást végeztünk a kulcsfontosságú jogi kulcsszavakra, és",
      "egységes vizuális sablonokat készítettünk a kommunikációhoz — minden grafikai elem és",
      "online érintkezési pont következetes brand-élményt nyújt.",
    ].join(" "),
    results: [
      "Tekintélyes WordPress weboldal jogi szektorhoz.",
      "Kulcsszó-optimalizált SEO struktúra.",
      "Egységes vizuális sablon a kommunikációhoz.",
    ].join(" "),
    tags: ["Webfejlesztés", "SEO", "Grafika", "Sablon készítés"],
    externalLinks: {
      website: "https://proverium.eu/",
    },
    metaTitle: "Proverium Ügyvédi Iroda – Komplex digitális megjelenés | G2A Marketing",
    metaDescription:
      "WordPress weboldal, SEO és grafikai sablonok egy ügyvédi irodának. Tekintélyes online jelenlét a jogi szektorban.",
    isActive: 1,
    sortOrder: 23,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 24. Aktuál Mérnökiroda Kft. — mérnöki tervezés
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "aktual-mernokiroda-kft",
    client: "Aktuál Mérnökiroda Kft.",
    title: "Aktuál Mérnökiroda – WordPress weboldal és SEO mérnöki cégnek",
    industry: "mernoki",
    industryLabel: "Mérnöki / Tervezés",
    projectYear: "2024",
    featuredImage: "/case-studies/aktual-mernokiroda-kft/desktop.png",
    featuredImageAlt: "Aktuál Mérnökiroda Kft. weboldal képernyőképe",
    logoImage: "/case-studies/aktual-mernokiroda-kft/logo.webp",
    logoImageAlt: "Aktuál Mérnökiroda Kft. logó",
    challenge: [
      "Az Aktuál Mérnökiroda olyan tervezési és műszaki feladatokat lát el, ahol a leendő",
      "ügyfelek (építtetők, fejlesztők) a Google-ban keresik az ajánlattevőt. A meglévő",
      "weboldal nem tükrözte a cég kompetenciáját, és a SEO-pozícióik is gyengék voltak —",
      "új alapokra volt szükség.",
    ].join(" "),
    solution: [
      "WordPress-re építettünk egy új, mobilbarát weboldalt, amely tisztán mutatja az iroda",
      "szakterületeit és referenciáit. Párhuzamosan SEO-stratégiát alakítottunk ki: a",
      "releváns mérnöki és tervezési kulcsszavakra optimalizáltuk a tartalmat, és technikai",
      "audittal alapoztuk meg a hosszú távú láthatóságot.",
    ].join(" "),
    results: [
      "Korszerű, mobilbarát WordPress weboldal.",
      "SEO-optimalizált tartalom mérnöki kulcsszavakra.",
      "Hosszú távú organikus láthatóság alapozása.",
    ].join(" "),
    tags: ["Webfejlesztés", "SEO", "WordPress"],
    externalLinks: {
      website: "http://www.aktual-mki.hu/",
    },
    metaTitle: "Aktuál Mérnökiroda – WordPress + SEO esettanulmány | G2A Marketing",
    metaDescription:
      "Korszerű WordPress weboldal és SEO-stratégia egy mérnöki tervező irodának. Mérhető online láthatóság esettanulmány.",
    isActive: 1,
    sortOrder: 24,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 25. Korean Autóház Kft. — autóipar
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "korean-autohaz-kft",
    client: "Korean Autóház Kft.",
    title: "Korean Autóház – Komplex marketing autókereskedésnek",
    industry: "autoipari",
    industryLabel: "Autóipar",
    projectYear: "2024",
    featuredImage: "/case-studies/korean-autohaz-kft/desktop.webp",
    featuredImageAlt: "Korean Autóház weboldal képernyőképe",
    logoImage: "/case-studies/korean-autohaz-kft/logo.png",
    logoImageAlt: "Korean Autóház Kft. logó",
    challenge: [
      "A Korean Autóház koreai autómárkák hivatalos magyar disztribútora. Olyan",
      "marketing-stratégia kellett, amely az új modellek bevezetését, a tesztvezetés-",
      "kérelmeket és a szervizes ügyfélkört is támogatja — egyetlen, koherens rendszerben.",
    ].join(" "),
    solution: [
      "Komplex marketing-csomagot alakítottunk ki: WordPress weboldal, Google Ads kampányok,",
      "Facebook + Instagram menedzsment, SEO-optimalizálás. Minden csatorna egy közös",
      "stratégia mentén dolgozik — a látogató ugyanazt a brand-üzenetet kapja, akár a",
      "weboldalon, akár a hirdetésen, akár a közösségi média posztján találkozik vele.",
    ].join(" "),
    results: [
      "Komplex marketing-rendszer egy autókereskedésnek.",
      "Egyidejű weboldal + hirdetés + közösségi média kezelés.",
      "Egységes brand-üzenet minden csatornán.",
    ].join(" "),
    tags: ["Webfejlesztés", "Hirdetéskezelés", "Közösségi média", "Marketing stratégia", "SEO"],
    externalLinks: {
      website: "https://www.koreanautohaz.hu/",
    },
    metaTitle: "Korean Autóház – Komplex autóipari marketing | G2A Marketing",
    metaDescription:
      "Komplex marketing csomag egy autókereskedésnek: WordPress, Google Ads, közösségi média és SEO egy stratégia mentén.",
    isActive: 1,
    sortOrder: 25,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 26. ÉMI-TÜV SÜD — tanúsítás, B2B
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "emi-tuv-sud",
    client: "ÉMI-TÜV SÜD",
    title: "ÉMI-TÜV SÜD – SEO és hirdetési tanácsadás egy tanúsító cégnek",
    industry: "b2b",
    industryLabel: "B2B / Tanúsítás",
    projectYear: "2024",
    featuredImage: "/case-studies/emi-tuv-sud/desktop.png",
    featuredImageAlt: "ÉMI-TÜV SÜD weboldal képernyőképe",
    logoImage: "/case-studies/emi-tuv-sud/logo.jpg",
    logoImageAlt: "ÉMI-TÜV SÜD logó",
    challenge: [
      "Az ÉMI-TÜV SÜD a magyar építőipari és termékminősítési piac egyik vezető szereplője.",
      "A B2B döntéshozók online keresik az ipari tanúsítási szolgáltatásokat — a meglévő",
      "online jelenlét teljesítményét kellett mérni, kulcsszavak alapján optimalizálni, és",
      "a hirdetéskezelést szakmai szempontból átvilágítani.",
    ].join(" "),
    solution: [
      "Részletes SEO felmérést és stratégiát készítettünk: a tanúsítási kulcsszavakra való",
      "pozícionálás, technikai audit, tartalmi gap-analízis. Párhuzamosan hirdetéskezelési",
      "tanácsadást nyújtunk: Google Analytics + Search Console adatok elemzése, kampány-",
      "audit, javaslatok a megtérülés javítására. Minden ajánlás SEO és PPC eszközökkel",
      "megalapozott — nem érzés-alapú, hanem mérési-alapú döntésekre épül.",
    ].join(" "),
    results: [
      "Részletes SEO felmérés tanúsítási kulcsszavakra.",
      "Hirdetéskezelési audit és optimalizációs javaslatok.",
      "Mérési-alapú döntéstámogatás Analytics + Search Console-lal.",
    ].join(" "),
    tags: ["SEO", "SEO stratégia", "Hirdetéskezelési tanácsadás", "Analytics"],
    externalLinks: {
      website: "https://www.tuvsud.com/hu-hu",
    },
    metaTitle: "ÉMI-TÜV SÜD – SEO és hirdetési tanácsadás | G2A Marketing",
    metaDescription:
      "SEO felmérés és hirdetéskezelési tanácsadás egy tanúsító B2B cégnek. Mérési-alapú döntéstámogatás esettanulmány.",
    isActive: 1,
    sortOrder: 26,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 27. InnoK Tudásmenedzsment Intézet Nonprofit Kft. — komplex projekt
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "innok-tudasmenedzsment-intezet-nonprofit-kft",
    client: "InnoK Tudásmenedzsment Intézet Nonprofit Kft.",
    title: "InnoK – Teljes brand- és tartalmi ökoszisztéma egy tudásmenedzsment intézetnek",
    industry: "b2b",
    industryLabel: "Nonprofit / Tudásmenedzsment",
    projectYear: "2025",
    featuredImage: "/case-studies/innok-tudasmenedzsment-intezet-nonprofit-kft/desktop.png",
    featuredImageAlt: "InnoK weboldal képernyőképe",
    logoImage: "/case-studies/innok-tudasmenedzsment-intezet-nonprofit-kft/logo.png",
    logoImageAlt: "InnoK Tudásmenedzsment Intézet logó",
    challenge: [
      "Az InnoK Tudásmenedzsment Intézet komplex, többrétegű kommunikációval dolgozik:",
      "konferenciák, kutatási anyagok, közösségépítés, PR. Ehhez nem egy szolgáltatás",
      "kellett, hanem egy teljes ökoszisztéma — webes alaptól a fotó- és videótartalmon át",
      "a PR-tevékenységig.",
    ].join(" "),
    solution: [
      "A teljes brand-ökoszisztémát egy kézben építettük: arculattervezés, WordPress weboldal",
      "fejlesztés, Adobe Creative Cloud-alapú grafikai anyagok, közösségi média fiókok",
      "létrehozása és menedzsmentje. Mellette fotó- és videókészítést, szerkesztést és vágást",
      "is biztosítunk — minden vizuális tartalom ugyanabban a hangulatban készül. PR-",
      "tevékenységgel támogatjuk a hosszú távú láthatóságot, Analytics + Search Console pedig",
      "a mérhető döntéstámogatást.",
    ].join(" "),
    results: [
      "Teljes brand-ökoszisztéma egy kézben.",
      "Arculat, weboldal, közösségi média, fotó/videó és PR egységben.",
      "Mérési-alapú döntéstámogatás Analytics + Search Console-lal.",
    ].join(" "),
    tags: ["Webfejlesztés", "Arculat", "Grafika", "Közösségi média", "Fotó/Videó", "PR"],
    externalLinks: {
      website: "https://www.urbanlab.hu",
    },
    metaTitle: "InnoK – Teljes brand-ökoszisztéma egy tudásmenedzsment intézetnek | G2A Marketing",
    metaDescription:
      "Arculat, weboldal, közösségi média, fotó/videó és PR — egy kézből egy tudásmenedzsment intézetnek. Komplex esettanulmány.",
    isActive: 1,
    sortOrder: 27,
  },

  // ───────────────────────────────────────────────────────────────────────
  // 28. FinAdin Solutions — pénzügyi / üzleti megoldás
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: "finadin-solutions",
    client: "FinAdin Solutions",
    title: "FinAdin Solutions – SEO, hirdetési és CRM tanácsadás egy pénzügyi cégnek",
    industry: "b2b",
    industryLabel: "Pénzügy / B2B",
    projectYear: "2025",
    featuredImage: "/case-studies/finadin-solutions/desktop.png",
    featuredImageAlt: "FinAdin Solutions weboldal képernyőképe",
    logoImage: "/case-studies/finadin-solutions/logo.webp",
    logoImageAlt: "FinAdin Solutions logó",
    challenge: [
      "A FinAdin Solutions pénzügyi és üzleti megoldásokat kínál vállalati ügyfeleknek. Itt",
      "nem egyszerű hirdetés-kampányról van szó, hanem komplex értékesítési és ügyfélkezelési",
      "ökoszisztémáról — ahol az online jelenlét, a hirdetések és a CRM összhangban kell, hogy",
      "működjenek.",
    ].join(" "),
    solution: [
      "Részletes SEO felmérést és stratégiát adtunk át, mellette hirdetéskezelési tanácsadást",
      "végeztünk a Google Ads optimalizálására. Az értékesítési csatorna-menedzsment és a CRM",
      "rendszer optimalizálása biztosítja, hogy a beérkező leadek ne vesszenek el — minden lépés",
      "mérhető és nyomon követhető. WordPress + Analytics + Search Console alapozza meg a",
      "stabil mérési rendszert.",
    ].join(" "),
    results: [
      "SEO felmérés és stratégia pénzügyi szektorhoz.",
      "Hirdetéskezelési és CRM-optimalizálási tanácsadás.",
      "Lead-átvétel és mérhető értékesítési csatorna.",
    ].join(" "),
    tags: ["SEO", "Hirdetéskezelési tanácsadás", "Értékesítési csatorna", "CRM"],
    externalLinks: {
      website: "https://finadinsolutions.com/",
    },
    metaTitle: "FinAdin Solutions – SEO, hirdetés és CRM tanácsadás | G2A Marketing",
    metaDescription:
      "SEO felmérés, hirdetéskezelési tanácsadás és CRM-optimalizálás egy pénzügyi B2B cégnek. Komplex esettanulmány.",
    isActive: 1,
    sortOrder: 28,
  },
];

const db = await mysql.createConnection(process.env.DATABASE_URL);

try {
  let inserted = 0;
  let updated = 0;

  for (const cs of CASES) {
    const tagsJson = JSON.stringify(cs.tags);
    const galleryJson = cs.gallery ? JSON.stringify(cs.gallery) : null;
    const externalLinksJson = cs.externalLinks ? JSON.stringify(cs.externalLinks) : null;

    const [result] = await db.execute(
      `INSERT INTO case_studies
         (slug, title, client, industry, challenge, solution, results,
          featuredImage, featuredImageAlt,
          logoImage, logoImageAlt, gallery, externalLinks, projectYear,
          tags, metaTitle, metaDescription,
          isActive, sortOrder, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         client = VALUES(client),
         industry = VALUES(industry),
         challenge = VALUES(challenge),
         solution = VALUES(solution),
         results = VALUES(results),
         featuredImage = VALUES(featuredImage),
         featuredImageAlt = VALUES(featuredImageAlt),
         logoImage = VALUES(logoImage),
         logoImageAlt = VALUES(logoImageAlt),
         gallery = VALUES(gallery),
         externalLinks = VALUES(externalLinks),
         projectYear = VALUES(projectYear),
         tags = VALUES(tags),
         metaTitle = VALUES(metaTitle),
         metaDescription = VALUES(metaDescription),
         isActive = VALUES(isActive),
         sortOrder = VALUES(sortOrder),
         updatedAt = NOW()`,
      [
        cs.slug, cs.title, cs.client, cs.industry,
        cs.challenge, cs.solution, cs.results,
        cs.featuredImage, cs.featuredImageAlt,
        cs.logoImage ?? null, cs.logoImageAlt ?? null,
        galleryJson, externalLinksJson, cs.projectYear ?? null,
        tagsJson, cs.metaTitle, cs.metaDescription,
        cs.isActive, cs.sortOrder,
      ]
    );

    // mysql2 returns affectedRows = 1 on insert, 2 on update with ON DUPLICATE KEY
    if (result.affectedRows === 1) inserted++;
    else updated++;
    console.log(`  ✓ ${cs.slug} (${result.affectedRows === 1 ? "új" : "frissítve"})`);
  }

  console.log(`\nKész: ${inserted} új, ${updated} frissítve.`);
} catch (err) {
  console.error("Hiba:", err.message);
  process.exit(1);
} finally {
  await db.end();
}
