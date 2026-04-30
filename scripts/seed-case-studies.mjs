import mysql from "mysql2/promise";

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Case studies: NO seed data — kitöltés kizárólag az admin felületen valós projektek alapján.
// Korábbi fiktív minta-adat törölve 2026-04-21.
const caseStudies = [];

// (alábbi blokk megőrizve referenciaként, de nem aktív)
const _SAMPLE_CASE_STUDIES_REFERENCE_ONLY = [
  {
    title: "Egészségügyi klinika – 340% organikus forgalom növekedés",
    slug: "egeszsegugyi-klinika-seo",
    client: "Pécsi Magánklinika",
    industry: "egeszsegugy",
    challenge: "A klinika szinte láthatatlan volt a keresőkben. Helyi versenytársak megelőzték minden releváns kulcsszón, a weboldal elavult volt és nem volt mobilbarát.",
    solution: "Teljes SEO audit és technikai optimalizálás, helyi SEO stratégia kidolgozása, Google Business Profile optimalizálás, havi 8 SEO-optimalizált blogcikk, backlink építési kampány.",
    results: "340%-os organikus forgalom növekedés 12 hónap alatt, #1 pozíció 23 helyi kulcsszón, 67%-kal több online időpontfoglalás.",
    tags: JSON.stringify(["Keresőoptimalizálás", "Tartalommarketing", "Technikai SEO"]),
    metaTitle: "Egészségügyi klinika SEO esettanulmány – 340% forgalom növekedés | G2A Marketing",
    metaDescription: "Hogyan értünk el 340%-os organikus forgalom növekedést egy pécsi magánklinikának 12 hónap alatt?",
    isActive: 1,
    sortOrder: 1,
  },
  {
    title: "B2B ipari vállalat – 280% lead generálás növekedés",
    slug: "b2b-ipari-vallalat-lead-gen",
    client: "Pécs-Baranya Ipari Kft.",
    industry: "b2b",
    challenge: "Az ipari vállalat kizárólag hagyományos értékesítési csatornákon dolgozott. Digitális jelenlétük minimális volt, nem volt rendszeres lead generálás.",
    solution: "LinkedIn B2B kampányok, Google Ads Search kampányok ipari kulcsszavakra, landing oldal optimalizálás, CRM integráció és lead nurturing automatizálás.",
    results: "280%-os lead növekedés 6 hónap alatt, 45%-kal csökkent az értékesítési ciklus hossza, 3,2x ROI az első évben.",
    tags: JSON.stringify(["LinkedIn Hirdetések", "Google Ads", "Marketing Automatizáció"]),
    metaTitle: "B2B ipari vállalat lead generálás esettanulmány – 280% növekedés | G2A Marketing",
    metaDescription: "Hogyan növeltük 280%-kal egy B2B ipari vállalat lead generálását 6 hónap alatt LinkedIn és Google Ads kampányokkal?",
    isActive: 1,
    sortOrder: 2,
  },
  {
    title: "Szépségipari márka – 520% közösségi média növekedés",
    slug: "szepsegipari-marka-social-media",
    client: "BeautyLux Salon",
    industry: "szepsegipari",
    challenge: "A szalonlánc Instagram és Facebook jelenléte stagnált. Az organikus elérés minimális volt, a hirdetések nem hoztak megfelelő megtérülést.",
    solution: "Teljes közösségi média stratégia újratervezése, professzionális tartalom gyártás, Meta hirdetési kampányok optimalizálása, influencer együttműködések koordinálása.",
    results: "520%-os követő növekedés 8 hónap alatt, 4,8x ROAS a Meta hirdetéseken, 89%-kal több online foglalás közösségi médiából.",
    tags: JSON.stringify(["Közösségi Média", "Meta Hirdetések", "Tartalomgyártás"]),
    metaTitle: "Szépségipari márka közösségi média esettanulmány – 520% növekedés | G2A Marketing",
    metaDescription: "Hogyan értünk el 520%-os közösségi média növekedést egy szépségipari márkának 8 hónap alatt?",
    isActive: 1,
    sortOrder: 3,
  },
  {
    title: "Jogi iroda – Prémium ügyfélszerzés Google Ads-szel",
    slug: "jogi-iroda-google-ads",
    client: "Dr. Nagy és Társai Ügyvédi Iroda",
    industry: "jogi",
    challenge: "Az ügyvédi iroda kizárólag ajánlásokra támaszkodott. Növelni akarták az ügyfélkört, de a jogi szektorban a hirdetés rendkívül versenyképes és drága.",
    solution: "Célzott Google Ads Search kampányok jogi kulcsszavakra, negatív kulcsszó lista optimalizálás, landing oldal A/B tesztelés, konverziókövetés beállítása.",
    results: "67 új ügyfél az első 3 hónapban, 38%-kal alacsonyabb CPA az iparági átlagnál, 5,1x ROAS.",
    tags: JSON.stringify(["Google Ads", "Landing Oldal Optimalizálás", "Konverziókövetés"]),
    metaTitle: "Jogi iroda Google Ads esettanulmány – 67 új ügyfél 3 hónap alatt | G2A Marketing",
    metaDescription: "Hogyan szereztünk 67 új ügyfelet egy ügyvédi irodának 3 hónap alatt Google Ads kampányokkal?",
    isActive: 1,
    sortOrder: 4,
  },
  {
    title: "Autóipari kereskedő – Teljes digitális transzformáció",
    slug: "autoipari-kereskedő-digitalis-transzformacio",
    client: "AutoPremium Kft.",
    industry: "autoipari",
    challenge: "Az autókereskedő weboldala elavult volt, nem volt mobilbarát, és az online hirdetések nem hoztak megfelelő eredményt.",
    solution: "Új, mobilbarát weboldal fejlesztése, Google Ads Display és Search kampányok, YouTube videóhirdetések, remarketing kampányok, SEO optimalizálás.",
    results: "156%-kal több online érdeklődő, 43%-kal több próbaút foglalás online, 2,9x ROI az első évben.",
    tags: JSON.stringify(["Webfejlesztés", "Google Ads", "YouTube Hirdetések", "SEO"]),
    metaTitle: "Autóipari kereskedő digitális transzformáció esettanulmány | G2A Marketing",
    metaDescription: "Hogyan növeltük 156%-kal egy autókereskedő online érdeklődőit webfejlesztéssel és Google Ads kampányokkal?",
    isActive: 1,
    sortOrder: 5,
  },
  {
    title: "Mérnöki iroda – Szakmai tekintély építése tartalommarketinggel",
    slug: "mernoki-iroda-tartalommarketing",
    client: "TechBuild Mérnöki Iroda",
    industry: "mernoki",
    challenge: "A mérnöki iroda szakmai tekintélye lokálisan erős volt, de online szinte ismeretlen. Nagyobb projektekhez kellett növelni az online láthatóságot.",
    solution: "Szakmai blogcikkek és esettanulmányok írása, LinkedIn tartalomstratégia, iparági PR cikkek elhelyezése, SEO optimalizálás műszaki kulcsszavakra.",
    results: "890%-os organikus LinkedIn elérés növekedés, 12 új nagyprojekt ajánlatkérés 6 hónap alatt, 4 iparági díj és elismerés.",
    tags: JSON.stringify(["Tartalommarketing", "LinkedIn Marketing", "PR", "SEO"]),
    metaTitle: "Mérnöki iroda tartalommarketing esettanulmány – 890% LinkedIn növekedés | G2A Marketing",
    metaDescription: "Hogyan építettünk szakmai tekintélyt egy mérnöki irodának tartalommarketinggel és LinkedIn stratégiával?",
    isActive: 1,
    sortOrder: 6,
  },
];

try {
  await db.execute("DELETE FROM case_studies");
  
  for (const cs of caseStudies) {
    await db.execute(
      `INSERT INTO case_studies 
       (title, slug, client, industry, challenge, solution, results, tags, metaTitle, metaDescription, isActive, sortOrder, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [cs.title, cs.slug, cs.client, cs.industry, cs.challenge, cs.solution, cs.results, cs.tags, cs.metaTitle, cs.metaDescription, cs.isActive, cs.sortOrder]
    );
  }
  
  console.log(`${caseStudies.length} case study sikeresen feltöltve`);
} catch (err) {
  console.error("Hiba:", err.message);
} finally {
  await db.end();
}
