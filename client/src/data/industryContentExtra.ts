/**
 * Five additional industry landing-page content blocks (HU/EN/ZH),
 * merged into IparagiLandingPage's INDUSTRY_CONTENT at render time.
 *
 * Kept in a separate module so the (already large) page file stays
 * diffable and the content is editable in one place. Shape matches the
 * page's IndustryContent type exactly; the page casts on merge.
 *
 * Categories added per the partner list (Partnerek.docx):
 *   marketing-kreativ-cegeknek         — Kreatív (Royal Portrait)
 *   marketing-vendeglatas-cegeknek     — Vendéglátás (Cafe Frei, Donkey Pizza, Buborékpark)
 *   marketing-webshopoknak             — Webshop (Childéric, Vidashop, ENO Ceramics … 7)
 *   marketing-szolgaltato-cegeknek     — Szolgáltatóipar (Senzortech, Adept Electric)
 *   marketing-kozlekedesi-cegeknek     — Közlekedés (Tüke Busz)
 *
 * `results` deliberately uses VERIFIABLE numbers only — the real
 * partner count in the category, the 3 languages we work in, and the
 * 2022 founding year — never invented client-result percentages.
 */

type IndustryContentLike = {
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDesc: string;
  heroDesc: string;
  intro?: string;
  challenges: string[];
  solutions: { title: string; desc: string }[];
  results: { num: string; label: string }[];
  caseStudy: { client: string; problem: string; solution: string; result: string };
  whyG2A?: string;
  relatedServices?: { title: string; desc: string; href: string }[];
  faqs?: { q: string; a: string }[];
};

type LocaleMap = Record<string, IndustryContentLike>;

// ─── HU ──────────────────────────────────────────────────────────────────────
const hu: LocaleMap = {
  "marketing-kreativ-cegeknek": {
    title: "Kreatív marketing, ami megkülönböztet",
    subtitle: "Fotósoknak, stúdióknak, kreatív vállalkozásoknak és portfólió-alapú szakembereknek",
    metaTitle: "Kreatív marketing fotósoknak és stúdióknak | G2A",
    metaDesc: "Vizuális-első marketing kreatív vállalkozásoknak: portfólió-weboldal, képközpontú arculat, közösségi jelenlét. A munka beszéljen helyetted.",
    heroDesc: "A kreatív szakmában a munkád a legjobb hirdetésed — de csak akkor, ha jól van bemutatva. Olyan online jelenlétet építünk, amely a portfóliódat helyezi a középpontba, és a látogatóból megrendelőt csinál.",
    intro: "A kreatív vállalkozások — fotósok, dizájnerek, stúdiók — egyedi helyzetben vannak: a termékük vizuális, a döntés érzelmi, a verseny pedig a látvány szintjén dől el. Egy gyenge weboldal vagy rendezetlen portfólió azonnal hitelteleníti a legjobb munkát is.",
    challenges: [
      "A portfólió a döntő — egy lassú vagy rendezetlen galéria elriasztja a megrendelőt",
      "Vizuális minőség online — a képeknek gyorsan kell töltődniük a minőség elvesztése nélkül",
      "Differenciálás — sok a hasonló stílusú kreatív, ki kell tűnni",
      "Árazás kommunikációja — a prémium munka prémium pozícionálást kíván",
      "Megkereséstől a foglalásig — egyszerű, súrlódásmentes kapcsolatfelvétel",
    ],
    solutions: [
      { title: "Portfólió-első weboldal", desc: "Képközpontú, gyorsan töltődő galéria-élmény, amely a munkádat emeli ki" },
      { title: "Vizuális arculat", desc: "Konzisztens megjelenés a weboldaltól a közösségi médiáig — felismerhető kreatív identitás" },
      { title: "Közösségi jelenlét", desc: "Instagram- és portfólió-fókuszú tartalom, amely a stílusodat közvetíti" },
      { title: "Konverziós kapcsolatfelvétel", desc: "Egyszerű ajánlatkérő és foglalási folyamat — a megkeresésből megrendelés" },
    ],
    results: [
      { num: "1+", label: "kreatív partner" },
      { num: "3", label: "nyelven dolgozunk" },
      { num: "2022", label: "óta" },
    ],
    caseStudy: {
      client: "Royal Portrait",
      problem: "Fotográfiai vállalkozás, ahol a portfólió és a vizuális megjelenés a teljes üzlet alapja — egy kép-központú, minőséget tükröző online felület kellett.",
      solution: "Kép-központú weboldal és egységes vizuális arculat WordPress alapon, a fotográfiai munka kiemelésére tervezve.",
      result: "Kép-központú, a portfóliót középpontba helyező online megjelenés és konzisztens vizuális identitás.",
    },
    whyG2A: "A kreatív szakmában tudjuk, hogy a munka beszél — a mi dolgunk, hogy a keret ne vonja el róla a figyelmet. Gyors galéria-élményt, tiszta arculatot és súrlódásmentes kapcsolatfelvételt építünk, hogy a tehetséged megrendeléssé váljon.",
    relatedServices: [
      { title: "Webfejlesztés és CRO", desc: "Portfólió-weboldal, gyors galéria, foglalási folyamat", href: "/szolgaltatasok/webfejlesztes" },
      { title: "Arculattervezés", desc: "Vizuális identitás, logó, konzisztens megjelenés", href: "/szolgaltatasok/arculattervezes" },
      { title: "Közösségi média", desc: "Instagram-fókuszú, vizuális tartalomstratégia", href: "/szolgaltatasok/kozossegi-media" },
    ],
    faqs: [
      { q: "Mi a legfontosabb egy kreatív vállalkozás weboldalán?", a: "A portfólió: gyorsan töltődő, jól rendezett, mobilon is kiváló galéria. A látogató másodpercek alatt eldönti, hogy a stílusod illik-e hozzá — ezt nem szabad lassú betöltéssel vagy rossz elrendezéssel elrontani." },
      { q: "Tudtok segíteni a vizuális arculatban is?", a: "Igen — a weboldaltól a közösségi médiáig egységes, felismerhető vizuális identitást építünk, amely a kreatív munkád stílusát tükrözi." },
      { q: "Hogyan lesz a látogatóból megrendelő?", a: "Egyszerű, súrlódásmentes ajánlatkérő és foglalási folyamattal, jól elhelyezett cselekvésre ösztönzéssel — a portfólió melletti egyértelmű következő lépéssel." },
    ],
  },
  "marketing-vendeglatas-cegeknek": {
    title: "Vendéglátó marketing, ami megtölti az asztalokat",
    subtitle: "Éttermeknek, kávézóknak, pizzériáknak és élményhelyeknek",
    metaTitle: "Vendéglátó marketing éttermeknek és kávézóknak | G2A",
    metaDesc: "Helyi, vizuális marketing vendéglátóhelyeknek: közösségi média, Google-jelenlét, foglalás és rendelés. Több vendég, erősebb helyi márka.",
    heroDesc: "A vendéglátásban a vendég a telefonján dönt — egy étvágygerjesztő poszt, egy jó értékelés vagy egy gyors foglalás dönti el, hova ül be. Olyan jelenlétet építünk, amely a helyedet választatja.",
    intro: "A vendéglátóhelyek versenye a helyi figyelemért zajlik: a vendég a Google-ben, az Instagramon és a foglalási platformokon dönt, gyakran percek alatt. A jó étel önmagában nem elég, ha online láthatatlan vagy nehezen elérhető.",
    challenges: [
      "Helyi láthatóság — a „közeli étterem” keresésekben meg kell jelenni",
      "Vizuális étvágygerjesztés — minőségi étel- és hangulatfotók, videók",
      "Értékelés-menedzsment — a Google és a foglalási platformok véleményei döntenek",
      "Foglalás és rendelés — egyszerű online foglalási és rendelési folyamat",
      "Szezonalitás és akciók — gyorsan kommunikálható menü- és eseményváltozások",
    ],
    solutions: [
      { title: "Google Cégprofil és helyi SEO", desc: "Megjelenés a „közeli” keresésekben, naprakész nyitvatartás, menü és fotók" },
      { title: "Étvágygerjesztő közösségi tartalom", desc: "Instagram/Facebook-fókuszú étel- és hangulattartalom, Reels-first megközelítés" },
      { title: "Foglalási és rendelési folyamat", desc: "Egyszerű online foglalás, rendelési integráció, súrlódásmentes vendégút" },
      { title: "Értékelés- és reputáció-menedzsment", desc: "Pozitív vélemények gyűjtése, válaszadás, krízishelyzetek kezelése" },
    ],
    results: [
      { num: "3", label: "vendéglátó partner" },
      { num: "3", label: "nyelven dolgozunk" },
      { num: "2021", label: "óta" },
    ],
    caseStudy: {
      client: "Cafe Frei",
      problem: "Kávézó, amelynek modern, élményközpontú online megjelenésre volt szüksége, amely a márka hangulatát közvetíti.",
      solution: "Modern, UX/UI-fókuszú weboldal Figma-tervezéssel és WIX-megvalósítással, a vendégélmény köré építve.",
      result: "Modern, a márkahangulatot tükröző online megjelenés, letisztult vendégélménnyel.",
    },
    whyG2A: "A vendéglátásban a vizuális minőség és a helyi jelenlét a két fő tényező. Étvágygerjesztő tartalmat, naprakész Google-profilt és súrlódásmentes foglalási folyamatot építünk — hogy a vendég a te helyedet válassza.",
    relatedServices: [
      { title: "Közösségi média", desc: "Étel- és hangulattartalom, Reels, helyi célzás", href: "/szolgaltatasok/kozossegi-media" },
      { title: "Meta hirdetés", desc: "Helyi Instagram/Facebook kampányok, esemény-promóció", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "Webfejlesztés és CRO", desc: "Foglalási és rendelési folyamat, mobilbarát menü", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "Miért fontos a Google Cégprofil egy étteremnek?", a: "Mert a vendégek nagy része a „közeli étterem” vagy konkrét helynév keresésével talál rád. A naprakész profil — nyitvatartás, menü, fotók, értékelések — gyakran a foglalás előtti utolsó döntési pont." },
      { q: "Kell-e profi fotó/videó a tartalomhoz?", a: "A minőségi vizuális tartalom a vendéglátásban kulcsfontosságú. Partnerrel gyártunk, vagy a meglévő anyagaidat optimalizáljuk és szerkesztjük közösségi felhasználásra." },
      { q: "Tudtok foglalási vagy rendelési rendszert integrálni?", a: "Igen — a weboldalba egyszerű online foglalási és rendelési folyamatot építünk, hogy a vendég néhány kattintással lefoglaljon vagy rendeljen." },
    ],
  },
  "marketing-webshopoknak": {
    title: "Webshop marketing, ami eladásokat hoz",
    subtitle: "Webáruházaknak, e-commerce és kiskereskedelmi márkáknak",
    metaTitle: "Webshop marketing és e-commerce hirdetés | G2A",
    metaDesc: "Konverzió-fókuszú webshop marketing: Google és Meta hirdetés, termék-feed, SEO, CRO. Több forgalom, magasabb kosárérték, mérhető ROAS.",
    heroDesc: "Egy webshopnál minden a számokon múlik: forgalom, konverzió, kosárérték, visszatérő vásárló. Adatvezérelt hirdetést és folyamatos optimalizálást építünk, hogy a látogatóból vásárló, a vásárlóból visszatérő ügyfél legyen.",
    intro: "A magyar e-commerce verseny éles: a vásárló árat, szállítást és bizalmat hasonlít össze, gyakran több fülön egyszerre. A webshop sikere a forgalom minőségén, a konverziós folyamaton és a mérhető megtérülésen áll vagy bukik.",
    challenges: [
      "Minőségi forgalom — a rossz célzású hirdetés pénzt éget, nem vásárlót hoz",
      "Konverziós folyamat — a kosárelhagyás és a bonyolult checkout eladásokat öl",
      "Termék-feed és láthatóság — Google Shopping és Meta katalógus karbantartása",
      "Kosárérték és visszatérés — keresztértékesítés, remarketing, hűségépítés",
      "Mérhetőség — pontos konverziókövetés és ROAS a valós döntésekhez",
    ],
    solutions: [
      { title: "Google és Meta hirdetés", desc: "Search, Shopping, Performance Max és Advantage+ kampányok termék-feeddel" },
      { title: "Termék-feed optimalizálás", desc: "Tiszta, naprakész katalógus, kategóriastruktúra, kép- és cím-optimalizálás" },
      { title: "Konverzióoptimalizálás (CRO)", desc: "Checkout-egyszerűsítés, kosárelhagyás-csökkentés, A/B tesztelés" },
      { title: "Remarketing és hűség", desc: "Visszatérő vásárlók megszólítása, keresztértékesítés, e-mail automatizáció" },
    ],
    results: [
      { num: "7", label: "webshop partner" },
      { num: "3", label: "nyelven dolgozunk" },
      { num: "2021", label: "óta" },
    ],
    caseStudy: {
      client: "Vidashop",
      problem: "Webáruház, amelynek mérhető, megtérülő hirdetési jelenlétre volt szüksége — a forgalmat valós vásárlássá kellett alakítani.",
      solution: "Google Ads hirdetéskezelés és értékesítés-orientált kreatív szövegírás, a termékkínálatra és a vásárlói szándékra hangolva.",
      result: "Folyamatos, mérhető Google Ads jelenlét, a termékkínálatra és a vásárlói szándékra optimalizált kampányokkal.",
    },
    whyG2A: "A webshopnál nem a kattintás, hanem az eladás a cél. Adatvezérelt hirdetést, tiszta termék-feedet és folyamatos konverzióoptimalizálást építünk — minden forintot a megtérülésig követünk, átlátható havi riportban.",
    relatedServices: [
      { title: "PPC & Google Ads", desc: "Search, Shopping, Performance Max termék-feeddel", href: "/szolgaltatasok/ppc-google-ads" },
      { title: "Meta hirdetés", desc: "Advantage+, katalógus-hirdetés, remarketing", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "Webfejlesztés és CRO", desc: "Checkout-optimalizálás, kosárelhagyás-csökkentés", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "Melyik hirdetési platform a legjobb egy webshopnak?", a: "Általában a Google (Search + Shopping + Performance Max) és a Meta (Advantage+ katalógus) kombinációja működik a legjobban — a Google a vásárlási szándékot, a Meta a felfedezést és a remarketinget fedi le. A pontos arányt az adatok és a termékkör dönti el." },
      { q: "Mit jelent a ROAS és miért fontos?", a: "A ROAS (Return on Ad Spend) megmutatja, hogy minden elköltött hirdetési forint hány forint bevételt hoz. Ez a webshop-marketing legfontosabb mutatója — minden döntést erre építünk, pontos konverziókövetéssel." },
      { q: "Tudtok a meglévő webshop-platformommal dolgozni?", a: "Igen — Shopify, WooCommerce, OpenCart és más rendszerekkel egyaránt dolgozunk. A hirdetést, a termék-feedet és a konverziós folyamatot a meglévő platformodhoz igazítjuk." },
    ],
  },
  "marketing-szolgaltato-cegeknek": {
    title: "Marketing szolgáltató cégeknek, ami bizalmat épít",
    subtitle: "Ipari, műszaki és B2B szolgáltatóknak, szakvállalkozásoknak",
    metaTitle: "Marketing szolgáltató és ipari cégeknek | G2A",
    metaDesc: "B2B marketing szolgáltató és ipari cégeknek: hiteles weboldal, szakmai tartalom, leadgenerálás. A szakértelmedből megrendelés.",
    heroDesc: "A szolgáltató és ipari cégeknél a bizalom és a szakértelem hitelessége dönt. Olyan online jelenlétet építünk, amely a tudásodat érthetővé és megbízhatóvá teszi a döntéshozók szemében.",
    intro: "Az ipari és szolgáltató cégek gyakran komplex, magyarázatot igénylő terméket vagy szolgáltatást kínálnak, hosszú döntési ciklussal és több szereplős beszerzéssel. Az online jelenlét feladata a szakértelem hiteles bemutatása és a minőségi érdeklődők becsatornázása.",
    challenges: [
      "Komplex szolgáltatás érthetővé tétele a nem-szakértő döntéshozónak",
      "Hitelesség és bizalom — referenciák, tanúsítványok, szakmai múlt bemutatása",
      "Hosszú, többszereplős értékesítési ciklus támogatása",
      "Minőségi leadgenerálás — kevés, de értékes érdeklődő",
      "Differenciálás — szakmai erősségek kiemelése a versenytársakkal szemben",
    ],
    solutions: [
      { title: "Hiteles, szakmai weboldal", desc: "Tiszta szolgáltatás-struktúra, referenciák, tanúsítványok, bizalmi elemek" },
      { title: "Szakmai tartalommarketing", desc: "Esettanulmányok, edukatív anyagok, amelyek a szakértelmet közvetítik" },
      { title: "B2B leadgenerálás", desc: "Célzott kampányok és ajánlatkérési folyamat a döntéshozói körre" },
      { title: "Katalógus és termékanyag", desc: "Letisztult termék- és szolgáltatás-bemutató anyagok, online és nyomtatható formában" },
    ],
    results: [
      { num: "2", label: "szolgáltató partner" },
      { num: "3", label: "nyelven dolgozunk" },
      { num: "2022", label: "óta" },
    ],
    caseStudy: {
      client: "Senzortech",
      problem: "Ipari szenzortechnológiai vállalkozás, amelynek a komplex műszaki kínálatát érthetően és hitelesen kellett bemutatnia a szakmai döntéshozóknak.",
      solution: "Szakmai bemutatkozó anyagok és vizuális arculat a műszaki kínálat érthető, megbízható kommunikációjához.",
      result: "Letisztult, szakmailag hiteles megjelenés a komplex műszaki kínálat bemutatására.",
    },
    whyG2A: "Az ipari és szolgáltató szektorban tudjuk, hogy a döntés bizalmon és bizonyítékon múlik. A szakértelmedet érthető, hiteles formába öntjük — weboldaltól a szakmai tartalomig —, hogy a megfelelő döntéshozók megtaláljanak és megbízzanak benned.",
    relatedServices: [
      { title: "Webfejlesztés és CRO", desc: "Hiteles szolgáltatás-weboldal, ajánlatkérési folyamat", href: "/szolgaltatasok/webfejlesztes" },
      { title: "Tartalommarketing", desc: "Szakmai tartalom, esettanulmányok, edukáció", href: "/szolgaltatasok/tartalommarketing" },
      { title: "Stratégiai marketing", desc: "B2B pozícionálás, leadgenerálási stratégia", href: "/szolgaltatasok/strategiai-marketing" },
    ],
    faqs: [
      { q: "Hogyan lehet egy komplex műszaki szolgáltatást eladhatóvá tenni online?", a: "Úgy, hogy a szakmai tartalmat a döntéshozó nyelvére fordítjuk: érthető magyarázatok, konkrét esettanulmányok, bizalmi elemek (referenciák, tanúsítványok). A cél, hogy a nem-szakértő is megértse az értéket." },
      { q: "Mennyi idő alatt hoz eredményt a B2B marketing?", a: "A B2B-ben a hitelesség- és kapcsolatépítés hosszabb folyamat, jellemzően több hónap. A weboldal és a szakmai tartalom alapozza meg, a leadgenerálás pedig folyamatosan táplálja az értékesítést." },
      { q: "Dolgoztok ipari és műszaki cégekkel?", a: "Igen — ipari, szenzortechnológiai és műszaki szolgáltató vállalkozásokkal egyaránt. Ismerjük a komplex termék hiteles, érthető kommunikációjának kihívásait." },
    ],
  },
  "marketing-kozlekedesi-cegeknek": {
    title: "Közlekedési és közszolgáltatói kommunikáció",
    subtitle: "Közlekedési vállalatoknak és közszolgáltatóknak",
    metaTitle: "Közlekedési és közszolgáltatói marketing | G2A",
    metaDesc: "Közérthető, megbízható kommunikáció közlekedési és közszolgáltató vállalatoknak: lakossági tájékoztatás, közösségi média, arculat.",
    heroDesc: "A közlekedési és közszolgáltató vállalatoknál a kommunikáció a mindennapi utasok és a lakosság bizalmáról szól. Közérthető, naprakész és megbízható jelenlétet építünk, amely a sokféle érintettet eléri.",
    intro: "A közlekedési vállalatok széles, heterogén közönséggel kommunikálnak — napi utasok, alkalmi utazók, döntéshozók —, és a megbízhatóság, az átláthatóság, valamint a naprakész tájékoztatás alapvető elvárás. A közösségi média a leggyorsabb csatorna a változások és hírek közlésére.",
    challenges: [
      "Sokféle érintett — napi utasok, alkalmi utazók, lakosság, döntéshozók",
      "Naprakész tájékoztatás — menetrend-, útvonal- és szolgáltatásváltozások gyors közlése",
      "Megbízhatóság és átláthatóság — a közszolgáltatói szerep elvárásai",
      "Vizuális konzisztencia — egységes arculat a kommunikáció minden pontján",
      "Krízis- és eseménykommunikáció — gyors, higgadt reagálás",
    ],
    solutions: [
      { title: "Közösségi média menedzsment", desc: "Naprakész tájékoztatás, bejegyzések, gyors reagálás az utasok felé" },
      { title: "Vizuális arculat és grafika", desc: "Egységes, felismerhető megjelenés a kommunikáció minden csatornáján" },
      { title: "Lakossági tájékoztatás", desc: "Közérthető anyagok a változások, fejlesztések és események kommunikálására" },
      { title: "Krízis- és eseménykommunikáció", desc: "Felkészült, higgadt reagálás váratlan helyzetekben" },
    ],
    results: [
      { num: "1+", label: "közlekedési partner" },
      { num: "3", label: "nyelven dolgozunk" },
      { num: "2021", label: "óta" },
    ],
    caseStudy: {
      client: "Tüke Busz Zrt.",
      problem: "Helyi közlekedési vállalat, amelynek naprakész, megbízható közösségi média jelenlétre volt szüksége az utasok tájékoztatására.",
      solution: "Facebook fiók kezelése, rendszeres bejegyzések és egységes grafikai megjelenés az utas-kommunikációhoz.",
      result: "Naprakész, konzisztens közösségi média jelenlét és egységes vizuális kommunikáció az utasok felé.",
    },
    whyG2A: "A közlekedési és közszolgáltatói kommunikációban a közérthetőség és a megbízhatóság a kulcs. Naprakész, egységes és higgadt kommunikációt építünk, amely a napi utasoktól a döntéshozókig mindenkit elér.",
    relatedServices: [
      { title: "Közösségi média", desc: "Utas-tájékoztatás, bejegyzések, gyors reagálás", href: "/szolgaltatasok/kozossegi-media" },
      { title: "Arculattervezés", desc: "Egységes vizuális identitás, grafikai anyagok", href: "/szolgaltatasok/arculattervezes" },
      { title: "Tartalommarketing", desc: "Lakossági tájékoztató anyagok, eseménykommunikáció", href: "/szolgaltatasok/tartalommarketing" },
    ],
    faqs: [
      { q: "Miért fontos a közösségi média egy közlekedési vállalatnak?", a: "Mert ez a leggyorsabb csatorna a menetrend-, útvonal- és szolgáltatásváltozások közlésére, valamint az utasok kérdéseinek megválaszolására. A naprakész, megbízható jelenlét közvetlenül erősíti az utasok bizalmát." },
      { q: "Tudtok krízishelyzetben kommunikálni?", a: "Igen — felkészült, higgadt eseménykommunikációt biztosítunk váratlan helyzetekre (forgalmi fennakadás, szolgáltatáskiesés), hogy az utasok időben és pontosan kapjanak tájékoztatást." },
      { q: "Dolgoztok közszolgáltató és közszférás szervezetekkel?", a: "Igen — közlekedési vállalatokkal és közszolgáltatókkal egyaránt. Ismerjük a közérthető, átlátható és megbízható kommunikáció elvárásait." },
    ],
  },
};

// ─── EN ──────────────────────────────────────────────────────────────────────
const en: LocaleMap = {
  "marketing-kreativ-cegeknek": {
    title: "Creative marketing that sets you apart",
    subtitle: "For photographers, studios, creative businesses and portfolio-based professionals",
    metaTitle: "Creative Marketing for Photographers & Studios | G2A",
    metaDesc: "Visual-first marketing for creative businesses: portfolio website, image-led brand, social presence. Let the work speak for you.",
    heroDesc: "In the creative field your work is your best advertisement — but only if it's presented well. We build an online presence that puts your portfolio centre stage and turns visitors into clients.",
    intro: "Creative businesses — photographers, designers, studios — are in a unique position: the product is visual, the decision is emotional, and the competition is decided on appearance. A weak website or messy portfolio instantly undermines even the best work.",
    challenges: [
      "The portfolio decides — a slow or messy gallery drives clients away",
      "Visual quality online — images must load fast without losing quality",
      "Differentiation — many similar-style creatives, you need to stand out",
      "Communicating pricing — premium work needs premium positioning",
      "From enquiry to booking — a simple, frictionless way to get in touch",
    ],
    solutions: [
      { title: "Portfolio-first website", desc: "Image-led, fast-loading gallery experience that highlights your work" },
      { title: "Visual identity", desc: "Consistent look from website to social — a recognisable creative identity" },
      { title: "Social presence", desc: "Instagram- and portfolio-focused content that conveys your style" },
      { title: "Conversion-focused contact", desc: "Simple enquiry and booking flow — from enquiry to commission" },
    ],
    results: [
      { num: "1+", label: "creative partner" },
      { num: "3", label: "languages we work in" },
      { num: "2022", label: "since" },
    ],
    caseStudy: {
      client: "Royal Portrait",
      problem: "A photography business where the portfolio and visual presentation are the whole business — it needed an image-led online presence reflecting that quality.",
      solution: "An image-led website and unified visual identity on WordPress, designed to showcase the photographic work.",
      result: "An image-led online presence putting the portfolio centre stage, with a consistent visual identity.",
    },
    whyG2A: "In the creative field we know the work speaks — our job is to keep the frame from distracting from it. We build a fast gallery experience, a clean identity and a frictionless contact flow so your talent turns into commissions.",
    relatedServices: [
      { title: "Web Development & CRO", desc: "Portfolio website, fast gallery, booking flow", href: "/szolgaltatasok/webfejlesztes" },
      { title: "Brand Design", desc: "Visual identity, logo, consistent appearance", href: "/szolgaltatasok/arculattervezes" },
      { title: "Social Media", desc: "Instagram-focused, visual content strategy", href: "/szolgaltatasok/kozossegi-media" },
    ],
    faqs: [
      { q: "What matters most on a creative business's website?", a: "The portfolio: a fast-loading, well-organised gallery that's excellent on mobile too. Visitors decide in seconds whether your style fits — don't ruin that with slow loading or poor layout." },
      { q: "Can you help with visual identity too?", a: "Yes — from website to social we build a unified, recognisable visual identity that reflects the style of your creative work." },
      { q: "How does a visitor become a client?", a: "With a simple, frictionless enquiry and booking flow and well-placed calls to action — a clear next step right alongside the portfolio." },
    ],
  },
  "marketing-vendeglatas-cegeknek": {
    title: "Hospitality marketing that fills tables",
    subtitle: "For restaurants, cafés, pizzerias and experience venues",
    metaTitle: "Hospitality Marketing for Restaurants & Cafés | G2A",
    metaDesc: "Local, visual marketing for hospitality venues: social media, Google presence, booking and ordering. More guests, a stronger local brand.",
    heroDesc: "In hospitality the guest decides on their phone — an appetising post, a good review or a quick booking decides where they sit down. We build a presence that gets your place chosen.",
    intro: "Hospitality venues compete for local attention: the guest decides on Google, Instagram and booking platforms, often within minutes. Great food alone isn't enough if you're invisible or hard to reach online.",
    challenges: [
      "Local visibility — you must show up in 'restaurant near me' searches",
      "Visual appetite appeal — quality food and ambience photos and videos",
      "Review management — Google and booking-platform reviews decide",
      "Booking and ordering — a simple online booking and ordering flow",
      "Seasonality and offers — fast-to-communicate menu and event changes",
    ],
    solutions: [
      { title: "Google Business Profile & local SEO", desc: "Show up in 'near me' searches with up-to-date hours, menu and photos" },
      { title: "Appetising social content", desc: "Instagram/Facebook-focused food and ambience content, Reels-first" },
      { title: "Booking and ordering flow", desc: "Simple online booking, ordering integration, frictionless guest journey" },
      { title: "Review and reputation management", desc: "Collecting positive reviews, responding, handling crises" },
    ],
    results: [
      { num: "3", label: "hospitality partners" },
      { num: "3", label: "languages we work in" },
      { num: "2021", label: "since" },
    ],
    caseStudy: {
      client: "Cafe Frei",
      problem: "A café that needed a modern, experience-focused online presence conveying the brand's atmosphere.",
      solution: "A modern, UX/UI-focused website with Figma design and WIX build, centred on the guest experience.",
      result: "A modern online presence reflecting the brand atmosphere, with a clean guest experience.",
    },
    whyG2A: "In hospitality, visual quality and local presence are the two main factors. We build appetising content, an up-to-date Google profile and a frictionless booking flow — so guests choose your place.",
    relatedServices: [
      { title: "Social Media", desc: "Food and ambience content, Reels, local targeting", href: "/szolgaltatasok/kozossegi-media" },
      { title: "Meta Ads", desc: "Local Instagram/Facebook campaigns, event promotion", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "Web Development & CRO", desc: "Booking and ordering flow, mobile-friendly menu", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "Why is a Google Business Profile important for a restaurant?", a: "Because most guests find you by searching 'restaurant near me' or a specific name. An up-to-date profile — hours, menu, photos, reviews — is often the final decision point before booking." },
      { q: "Do we need professional photos/video?", a: "Quality visual content is key in hospitality. We produce with a partner, or optimise and edit your existing material for social use." },
      { q: "Can you integrate a booking or ordering system?", a: "Yes — we build a simple online booking and ordering flow into the website so guests can book or order in a few clicks." },
    ],
  },
  "marketing-webshopoknak": {
    title: "Webshop marketing that drives sales",
    subtitle: "For online stores, e-commerce and retail brands",
    metaTitle: "Webshop Marketing & E-commerce Advertising | G2A",
    metaDesc: "Conversion-focused webshop marketing: Google and Meta ads, product feed, SEO, CRO. More traffic, higher cart value, measurable ROAS.",
    heroDesc: "For a webshop everything comes down to the numbers: traffic, conversion, cart value, returning customers. We build data-driven advertising and continuous optimization so visitors become buyers and buyers become repeat customers.",
    intro: "Hungarian e-commerce competition is fierce: the buyer compares price, shipping and trust, often across several tabs at once. A webshop's success rises or falls on traffic quality, the conversion flow and measurable return.",
    challenges: [
      "Quality traffic — poorly targeted ads burn money, not buyers",
      "Conversion flow — cart abandonment and complex checkout kill sales",
      "Product feed and visibility — maintaining Google Shopping and Meta catalogue",
      "Cart value and retention — cross-selling, remarketing, loyalty",
      "Measurability — accurate conversion tracking and ROAS for real decisions",
    ],
    solutions: [
      { title: "Google and Meta advertising", desc: "Search, Shopping, Performance Max and Advantage+ campaigns with product feed" },
      { title: "Product feed optimization", desc: "Clean, up-to-date catalogue, category structure, image and title optimization" },
      { title: "Conversion optimization (CRO)", desc: "Checkout simplification, cart-abandonment reduction, A/B testing" },
      { title: "Remarketing and loyalty", desc: "Re-engaging returning customers, cross-selling, email automation" },
    ],
    results: [
      { num: "7", label: "webshop partners" },
      { num: "3", label: "languages we work in" },
      { num: "2021", label: "since" },
    ],
    caseStudy: {
      client: "Vidashop",
      problem: "An online store that needed a measurable, profitable advertising presence — traffic had to be turned into actual sales.",
      solution: "Google Ads management and sales-oriented creative copywriting, tuned to the product range and buyer intent.",
      result: "A continuous, measurable Google Ads presence with campaigns optimised to the product range and buyer intent.",
    },
    whyG2A: "For a webshop the goal isn't the click but the sale. We build data-driven advertising, a clean product feed and continuous conversion optimization — tracking every forint to the return, in a transparent monthly report.",
    relatedServices: [
      { title: "PPC & Google Ads", desc: "Search, Shopping, Performance Max with product feed", href: "/szolgaltatasok/ppc-google-ads" },
      { title: "Meta Ads", desc: "Advantage+, catalogue ads, remarketing", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "Web Development & CRO", desc: "Checkout optimization, cart-abandonment reduction", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "Which ad platform is best for a webshop?", a: "Usually a combination of Google (Search + Shopping + Performance Max) and Meta (Advantage+ catalogue) works best — Google covers buying intent, Meta covers discovery and remarketing. The exact mix is decided by the data and the product range." },
      { q: "What is ROAS and why does it matter?", a: "ROAS (Return on Ad Spend) shows how much revenue each forint of ad spend brings. It's the most important webshop-marketing metric — we base every decision on it, with accurate conversion tracking." },
      { q: "Can you work with my existing webshop platform?", a: "Yes — we work with Shopify, WooCommerce, OpenCart and others. We adapt the advertising, product feed and conversion flow to your existing platform." },
    ],
  },
  "marketing-szolgaltato-cegeknek": {
    title: "Marketing for service companies that builds trust",
    subtitle: "For industrial, technical and B2B service providers and specialist businesses",
    metaTitle: "Marketing for Service & Industrial Companies | G2A",
    metaDesc: "B2B marketing for service and industrial companies: credible website, expert content, lead generation. Turn your expertise into commissions.",
    heroDesc: "For service and industrial companies, trust and the credibility of expertise decide. We build an online presence that makes your knowledge clear and trustworthy in the eyes of decision-makers.",
    intro: "Industrial and service companies often offer a complex product or service that needs explaining, with a long decision cycle and multi-stakeholder procurement. The job of the online presence is to present expertise credibly and channel in quality leads.",
    challenges: [
      "Making a complex service understandable to the non-expert decision-maker",
      "Credibility and trust — presenting references, certifications, track record",
      "Supporting a long, multi-stakeholder sales cycle",
      "Quality lead generation — few but valuable enquiries",
      "Differentiation — highlighting professional strengths against competitors",
    ],
    solutions: [
      { title: "Credible, professional website", desc: "Clean service structure, references, certifications, trust signals" },
      { title: "Expert content marketing", desc: "Case studies and educational material that convey expertise" },
      { title: "B2B lead generation", desc: "Targeted campaigns and an enquiry flow aimed at the decision-maker circle" },
      { title: "Catalogue and product material", desc: "Clean product and service presentation, online and printable" },
    ],
    results: [
      { num: "2", label: "service partners" },
      { num: "3", label: "languages we work in" },
      { num: "2022", label: "since" },
    ],
    caseStudy: {
      client: "Senzortech",
      problem: "An industrial sensor-technology business that needed to present its complex technical range clearly and credibly to professional decision-makers.",
      solution: "Professional presentation materials and visual identity for clear, trustworthy communication of the technical range.",
      result: "A clean, professionally credible presentation for the complex technical range.",
    },
    whyG2A: "In the industrial and service sector we know decisions rest on trust and proof. We cast your expertise into a clear, credible form — from website to expert content — so the right decision-makers find you and trust you.",
    relatedServices: [
      { title: "Web Development & CRO", desc: "Credible service website, enquiry flow", href: "/szolgaltatasok/webfejlesztes" },
      { title: "Content Marketing", desc: "Expert content, case studies, education", href: "/szolgaltatasok/tartalommarketing" },
      { title: "Strategic Marketing", desc: "B2B positioning, lead-generation strategy", href: "/szolgaltatasok/strategiai-marketing" },
    ],
    faqs: [
      { q: "How do you make a complex technical service sellable online?", a: "By translating the expert content into the decision-maker's language: clear explanations, concrete case studies, trust signals (references, certifications). The goal is for even a non-expert to understand the value." },
      { q: "How long does B2B marketing take to show results?", a: "In B2B, building credibility and relationships is a longer process, typically several months. The website and expert content lay the foundation, and lead generation continuously feeds sales." },
      { q: "Do you work with industrial and technical companies?", a: "Yes — with industrial, sensor-technology and technical service businesses alike. We understand the challenge of communicating a complex product credibly and clearly." },
    ],
  },
  "marketing-kozlekedesi-cegeknek": {
    title: "Transport and public-service communication",
    subtitle: "For transport companies and public service providers",
    metaTitle: "Transport & Public-Service Marketing | G2A",
    metaDesc: "Clear, reliable communication for transport and public-service companies: citizen information, social media, identity.",
    heroDesc: "For transport and public-service companies, communication is about the trust of everyday passengers and the public. We build a clear, up-to-date and reliable presence that reaches a diverse set of stakeholders.",
    intro: "Transport companies communicate with a broad, heterogeneous audience — daily passengers, occasional travellers, decision-makers — where reliability, transparency and up-to-date information are basic expectations. Social media is the fastest channel for announcing changes and news.",
    challenges: [
      "Diverse stakeholders — daily passengers, occasional travellers, the public, decision-makers",
      "Up-to-date information — fast announcement of schedule, route and service changes",
      "Reliability and transparency — the expectations of a public-service role",
      "Visual consistency — a unified identity across every communication point",
      "Crisis and event communication — fast, calm response",
    ],
    solutions: [
      { title: "Social media management", desc: "Up-to-date information, posts, fast response to passengers" },
      { title: "Visual identity and graphics", desc: "A unified, recognisable look across every communication channel" },
      { title: "Citizen information", desc: "Plain-language material to communicate changes, developments and events" },
      { title: "Crisis and event communication", desc: "Prepared, calm response to unexpected situations" },
    ],
    results: [
      { num: "1+", label: "transport partner" },
      { num: "3", label: "languages we work in" },
      { num: "2021", label: "since" },
    ],
    caseStudy: {
      client: "Tüke Busz Zrt.",
      problem: "A local transport company that needed an up-to-date, reliable social media presence to inform passengers.",
      solution: "Facebook account management, regular posts and a unified graphic look for passenger communication.",
      result: "An up-to-date, consistent social media presence and unified visual communication toward passengers.",
    },
    whyG2A: "In transport and public-service communication, clarity and reliability are the key. We build up-to-date, unified and calm communication that reaches everyone from daily passengers to decision-makers.",
    relatedServices: [
      { title: "Social Media", desc: "Passenger information, posts, fast response", href: "/szolgaltatasok/kozossegi-media" },
      { title: "Brand Design", desc: "Unified visual identity, graphic material", href: "/szolgaltatasok/arculattervezes" },
      { title: "Content Marketing", desc: "Citizen-information material, event communication", href: "/szolgaltatasok/tartalommarketing" },
    ],
    faqs: [
      { q: "Why is social media important for a transport company?", a: "Because it's the fastest channel for announcing schedule, route and service changes and answering passenger questions. An up-to-date, reliable presence directly strengthens passenger trust." },
      { q: "Can you communicate in a crisis?", a: "Yes — we provide prepared, calm event communication for unexpected situations (traffic disruption, service outage) so passengers get timely, accurate information." },
      { q: "Do you work with public-service and public-sector organisations?", a: "Yes — with transport companies and public-service providers alike. We understand the expectations of clear, transparent and reliable communication." },
    ],
  },
};

// ─── ZH ──────────────────────────────────────────────────────────────────────
const zh: LocaleMap = {
  "marketing-kreativ-cegeknek": {
    title: "让你脱颖而出的创意营销",
    subtitle: "面向摄影师、工作室、创意企业与作品集型专业人士",
    metaTitle: "面向摄影师与工作室的创意营销 | G2A",
    metaDesc: "为创意企业提供视觉优先的营销：作品集网站、以图像为主的品牌、社媒形象。让作品替你说话。",
    heroDesc: "在创意领域，你的作品就是最好的广告——但前提是要展示得当。我们打造以作品集为核心的线上形象，把访客变成客户。",
    intro: "创意企业——摄影师、设计师、工作室——处境独特：产品是视觉的，决策是情感的，竞争在外观层面见分晓。糟糕的网站或杂乱的作品集会立刻削弱最好的作品。",
    challenges: [
      "作品集决定一切——加载慢或杂乱的图库会赶走客户",
      "线上视觉质量——图片须快速加载且不损失质量",
      "差异化——同类风格的创意者众多，需要脱颖而出",
      "定价沟通——高端作品需要高端定位",
      "从咨询到预约——简单、无摩擦的联系方式",
    ],
    solutions: [
      { title: "作品集优先的网站", desc: "以图像为主、加载迅速的图库体验，突出你的作品" },
      { title: "视觉识别", desc: "从网站到社媒的一致外观——可辨识的创意身份" },
      { title: "社媒形象", desc: "以 Instagram 与作品集为核心、传达你风格的内容" },
      { title: "以转化为导向的联系", desc: "简单的咨询与预约流程——从咨询到委托" },
    ],
    results: [
      { num: "1+", label: "创意合作伙伴" },
      { num: "3", label: "种工作语言" },
      { num: "2022", label: "年起" },
    ],
    caseStudy: {
      client: "Royal Portrait",
      problem: "一家摄影企业，作品集与视觉呈现是全部业务——需要一个以图像为主、体现该品质的线上形象。",
      solution: "基于 WordPress 的以图像为主的网站与统一视觉识别，专为展示摄影作品而设计。",
      result: "以图像为主、把作品集置于中心的线上形象，以及一致的视觉识别。",
    },
    whyG2A: "在创意领域我们深知作品会说话——我们的工作是让画框不分散对它的注意。我们打造快速的图库体验、干净的识别与无摩擦的联系流程，让你的才华转化为委托。",
    relatedServices: [
      { title: "网站开发与 CRO", desc: "作品集网站、快速图库、预约流程", href: "/szolgaltatasok/webfejlesztes" },
      { title: "品牌设计", desc: "视觉识别、logo、一致外观", href: "/szolgaltatasok/arculattervezes" },
      { title: "社交媒体", desc: "以 Instagram 为核心的视觉内容策略", href: "/szolgaltatasok/kozossegi-media" },
    ],
    faqs: [
      { q: "创意企业网站上最重要的是什么？", a: "作品集：加载迅速、组织良好、在移动端也出色的图库。访客在几秒内判断你的风格是否合适——别用缓慢加载或糟糕布局毁了它。" },
      { q: "你们也能帮助视觉识别吗？", a: "可以——从网站到社媒，我们打造统一、可辨识、反映你创意作品风格的视觉识别。" },
      { q: "访客如何变成客户？", a: "通过简单、无摩擦的咨询与预约流程以及放置得当的行动号召——在作品集旁提供明确的下一步。" },
    ],
  },
  "marketing-vendeglatas-cegeknek": {
    title: "填满餐桌的餐饮营销",
    subtitle: "面向餐厅、咖啡馆、披萨店与体验场所",
    metaTitle: "面向餐厅与咖啡馆的餐饮营销 | G2A",
    metaDesc: "为餐饮场所提供本地化、视觉化营销：社媒、Google 形象、预订与点餐。更多顾客，更强的本地品牌。",
    heroDesc: "在餐饮业，顾客在手机上做决定——一张诱人的帖子、一条好评或一次快速预订就决定了去哪儿坐。我们打造让人选择你的形象。",
    intro: "餐饮场所争夺本地注意力：顾客在 Google、Instagram 与预订平台上做决定，常常几分钟内完成。光有好菜还不够，如果你在线上不可见或难以联系。",
    challenges: [
      "本地可见性——必须出现在“附近的餐厅”搜索中",
      "视觉食欲吸引——高质量的美食与氛围照片、视频",
      "评价管理——Google 与预订平台的评价决定成败",
      "预订与点餐——简单的在线预订与点餐流程",
      "季节性与优惠——可快速传达的菜单与活动变更",
    ],
    solutions: [
      { title: "Google 商家资料与本地 SEO", desc: "在“附近”搜索中出现，营业时间、菜单与照片保持更新" },
      { title: "诱人的社媒内容", desc: "以 Instagram/Facebook 为核心的美食与氛围内容，Reels 优先" },
      { title: "预订与点餐流程", desc: "简单的在线预订、点餐集成、无摩擦的顾客旅程" },
      { title: "评价与声誉管理", desc: "收集正面评价、回复、处理危机" },
    ],
    results: [
      { num: "3", label: "餐饮合作伙伴" },
      { num: "3", label: "种工作语言" },
      { num: "2021", label: "年起" },
    ],
    caseStudy: {
      client: "Cafe Frei",
      problem: "一家咖啡馆，需要现代、以体验为核心、传达品牌氛围的线上形象。",
      solution: "以 UX/UI 为核心的现代网站，采用 Figma 设计与 WIX 实现，围绕顾客体验构建。",
      result: "反映品牌氛围的现代线上形象，带来干净的顾客体验。",
    },
    whyG2A: "在餐饮业，视觉质量与本地形象是两大要素。我们打造诱人的内容、保持更新的 Google 资料与无摩擦的预订流程——让顾客选择你的场所。",
    relatedServices: [
      { title: "社交媒体", desc: "美食与氛围内容、Reels、本地定位", href: "/szolgaltatasok/kozossegi-media" },
      { title: "Meta 广告", desc: "本地 Instagram/Facebook 活动、活动推广", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "网站开发与 CRO", desc: "预订与点餐流程、移动端友好菜单", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "为什么 Google 商家资料对餐厅很重要？", a: "因为大多数顾客通过搜索“附近的餐厅”或具体名称找到你。保持更新的资料——营业时间、菜单、照片、评价——往往是预订前最后的决策点。" },
      { q: "需要专业摄影/视频吗？", a: "高质量的视觉内容在餐饮业至关重要。我们与合作方制作，或优化、剪辑你现有的素材用于社媒。" },
      { q: "你们能集成预订或点餐系统吗？", a: "可以——我们在网站中构建简单的在线预订与点餐流程，让顾客几次点击即可预订或下单。" },
    ],
  },
  "marketing-webshopoknak": {
    title: "带来销售的网店营销",
    subtitle: "面向在线商店、电商与零售品牌",
    metaTitle: "网店营销与电商广告 | G2A",
    metaDesc: "以转化为核心的网店营销：Google 与 Meta 广告、商品 feed、SEO、CRO。更多流量、更高客单价、可衡量的 ROAS。",
    heroDesc: "对网店而言一切取决于数字：流量、转化、客单价、回头客。我们打造数据驱动的广告与持续优化，让访客成为买家、买家成为回头客。",
    intro: "匈牙利电商竞争激烈：买家比较价格、配送与信任，常常同时打开多个标签页。网店的成败取决于流量质量、转化流程与可衡量的回报。",
    challenges: [
      "优质流量——定向不佳的广告烧钱而非带来买家",
      "转化流程——弃购与复杂结账扼杀销售",
      "商品 feed 与可见性——维护 Google Shopping 与 Meta 目录",
      "客单价与复购——交叉销售、再营销、忠诚度",
      "可衡量性——准确的转化追踪与 ROAS 以支持真实决策",
    ],
    solutions: [
      { title: "Google 与 Meta 广告", desc: "带商品 feed 的 Search、Shopping、Performance Max 与 Advantage+ 活动" },
      { title: "商品 feed 优化", desc: "干净、更新的目录，类目结构，图片与标题优化" },
      { title: "转化优化（CRO）", desc: "简化结账、降低弃购、A/B 测试" },
      { title: "再营销与忠诚度", desc: "重新触达回头客、交叉销售、邮件自动化" },
    ],
    results: [
      { num: "7", label: "网店合作伙伴" },
      { num: "3", label: "种工作语言" },
      { num: "2021", label: "年起" },
    ],
    caseStudy: {
      client: "Vidashop",
      problem: "一家在线商店，需要可衡量、有回报的广告存在——必须把流量转化为实际销售。",
      solution: "Google Ads 广告管理与以销售为导向的创意文案，针对产品范围与购买意图进行调优。",
      result: "持续、可衡量的 Google Ads 存在，活动针对产品范围与购买意图优化。",
    },
    whyG2A: "对网店而言目标不是点击而是销售。我们打造数据驱动的广告、干净的商品 feed 与持续的转化优化——把每一福林追踪到回报，呈现在透明的月度报告中。",
    relatedServices: [
      { title: "PPC 与 Google Ads", desc: "带商品 feed 的 Search、Shopping、Performance Max", href: "/szolgaltatasok/ppc-google-ads" },
      { title: "Meta 广告", desc: "Advantage+、目录广告、再营销", href: "/szolgaltatasok/meta-hirdetes" },
      { title: "网站开发与 CRO", desc: "结账优化、降低弃购", href: "/szolgaltatasok/webfejlesztes" },
    ],
    faqs: [
      { q: "网店最适合哪个广告平台？", a: "通常 Google（Search + Shopping + Performance Max）与 Meta（Advantage+ 目录）的组合效果最佳——Google 覆盖购买意图，Meta 覆盖发现与再营销。具体比例由数据与产品范围决定。" },
      { q: "什么是 ROAS，为何重要？", a: "ROAS（广告支出回报率）显示每一福林广告支出带来多少收入。它是网店营销最重要的指标——我们据此做出每个决策，并配以准确的转化追踪。" },
      { q: "你们能配合我现有的网店平台吗？", a: "可以——我们与 Shopify、WooCommerce、OpenCart 等合作。我们将广告、商品 feed 与转化流程适配到你现有的平台。" },
    ],
  },
  "marketing-szolgaltato-cegeknek": {
    title: "建立信任的服务企业营销",
    subtitle: "面向工业、技术与 B2B 服务商及专业企业",
    metaTitle: "面向服务与工业企业的营销 | G2A",
    metaDesc: "为服务与工业企业提供 B2B 营销：可信网站、专家内容、线索生成。把你的专业转化为委托。",
    heroDesc: "对服务与工业企业而言，信任与专业的可信度决定成败。我们打造让你的知识在决策者眼中清晰可信的线上形象。",
    intro: "工业与服务企业常提供需要解释的复杂产品或服务，决策周期长、采购涉及多方。线上形象的任务是可信地呈现专业，并引入优质线索。",
    challenges: [
      "向非专家决策者讲清复杂的服务",
      "可信度与信任——呈现案例、认证、专业积累",
      "支持长周期、多方参与的销售",
      "优质线索生成——少而有价值的询盘",
      "差异化——相对竞争对手突出专业优势",
    ],
    solutions: [
      { title: "可信、专业的网站", desc: "清晰的服务结构、案例、认证、信任要素" },
      { title: "专家内容营销", desc: "传达专业的案例研究与教育材料" },
      { title: "B2B 线索生成", desc: "面向决策者圈层的定向活动与询盘流程" },
      { title: "目录与产品材料", desc: "干净的产品与服务展示，线上与可打印" },
    ],
    results: [
      { num: "2", label: "服务合作伙伴" },
      { num: "3", label: "种工作语言" },
      { num: "2022", label: "年起" },
    ],
    caseStudy: {
      client: "Senzortech",
      problem: "一家工业传感器技术企业，需要向专业决策者清晰、可信地呈现其复杂的技术产品。",
      solution: "专业展示材料与视觉识别，用于清晰、可信地传达技术产品。",
      result: "为复杂技术产品打造的干净、专业可信的呈现。",
    },
    whyG2A: "在工业与服务领域我们深知决策取决于信任与证据。我们把你的专业铸成清晰、可信的形式——从网站到专家内容——让合适的决策者找到并信任你。",
    relatedServices: [
      { title: "网站开发与 CRO", desc: "可信的服务网站、询盘流程", href: "/szolgaltatasok/webfejlesztes" },
      { title: "内容营销", desc: "专家内容、案例、教育", href: "/szolgaltatasok/tartalommarketing" },
      { title: "战略营销", desc: "B2B 定位、线索生成战略", href: "/szolgaltatasok/strategiai-marketing" },
    ],
    faqs: [
      { q: "如何让复杂的技术服务在线可售？", a: "把专家内容翻译成决策者的语言：清晰的解释、具体的案例、信任要素（案例、认证）。目标是让非专家也能理解价值。" },
      { q: "B2B 营销多久见效？", a: "在 B2B 中，建立可信度与关系是较长的过程，通常需数月。网站与专家内容打基础，线索生成则持续滋养销售。" },
      { q: "你们与工业和技术企业合作吗？", a: "是的——工业、传感器技术与技术服务企业均有合作。我们了解可信、清晰地传达复杂产品的挑战。" },
    ],
  },
  "marketing-kozlekedesi-cegeknek": {
    title: "交通与公共服务传播",
    subtitle: "面向交通运输企业与公共服务提供方",
    metaTitle: "交通与公共服务营销 | G2A",
    metaDesc: "为交通与公共服务企业提供清晰、可靠的传播：市民告知、社媒、形象。",
    heroDesc: "对交通与公共服务企业而言，传播关乎日常乘客与公众的信任。我们打造清晰、及时、可靠的形象，触达多元的利益相关方。",
    intro: "交通运输企业面向广泛、异质的受众——日常乘客、临时旅客、决策者——可靠性、透明度与及时信息是基本要求。社媒是发布变更与新闻的最快渠道。",
    challenges: [
      "多元利益相关方——日常乘客、临时旅客、公众、决策者",
      "及时信息——快速发布班次、路线与服务变更",
      "可靠与透明——公共服务角色的要求",
      "视觉一致性——在每个传播点保持统一形象",
      "危机与事件传播——快速、冷静的反应",
    ],
    solutions: [
      { title: "社媒管理", desc: "及时信息、帖子、对乘客的快速回应" },
      { title: "视觉识别与图形", desc: "在每个传播渠道保持统一、可辨识的外观" },
      { title: "市民告知", desc: "用通俗语言传达变更、发展与活动的材料" },
      { title: "危机与事件传播", desc: "对突发情况有准备、冷静地回应" },
    ],
    results: [
      { num: "1+", label: "交通合作伙伴" },
      { num: "3", label: "种工作语言" },
      { num: "2021", label: "年起" },
    ],
    caseStudy: {
      client: "Tüke Busz Zrt.",
      problem: "一家本地交通运输企业，需要及时、可靠的社媒形象来告知乘客。",
      solution: "Facebook 账户管理、定期帖子与统一的图形外观用于乘客传播。",
      result: "及时、一致的社媒形象与面向乘客的统一视觉传播。",
    },
    whyG2A: "在交通与公共服务传播中，通俗易懂与可靠是关键。我们打造及时、统一、冷静的传播，触达从日常乘客到决策者的每个人。",
    relatedServices: [
      { title: "社交媒体", desc: "乘客告知、帖子、快速回应", href: "/szolgaltatasok/kozossegi-media" },
      { title: "品牌设计", desc: "统一视觉识别、图形材料", href: "/szolgaltatasok/arculattervezes" },
      { title: "内容营销", desc: "市民告知材料、事件传播", href: "/szolgaltatasok/tartalommarketing" },
    ],
    faqs: [
      { q: "为什么社媒对交通运输企业很重要？", a: "因为这是发布班次、路线与服务变更以及回答乘客问题的最快渠道。及时、可靠的形象直接增强乘客信任。" },
      { q: "你们能在危机中传播吗？", a: "能——我们为突发情况（交通中断、服务停运）提供有准备、冷静的事件传播，让乘客及时、准确地获知信息。" },
      { q: "你们与公共服务与公共部门组织合作吗？", a: "是的——交通运输企业与公共服务提供方均有合作。我们了解清晰、透明、可靠传播的要求。" },
    ],
  },
};

export const INDUSTRY_CONTENT_EXTRA = { hu, en, zh };
