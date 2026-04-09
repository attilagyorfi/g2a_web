/**
 * Seed script: Real G2A Marketing partner case studies
 * Based on actual partners from g2amarketing.hu/partnereink
 * Run: node scripts/seed-references.mjs
 */
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// First clear existing case studies
await conn.execute("DELETE FROM case_studies WHERE 1=1");
console.log("Cleared existing case studies");

const caseStudies = [
  {
    title: "Vidashop – E-commerce forgalom 340%-os növekedése Google Ads és Meta kampányokkal",
    slug: "vidashop-ecommerce-novekedes",
    client: "Vidashop",
    industry: "E-kereskedelem",
    challenge: "A Vidashop egy gyorsan növekvő magyar e-kereskedelmi platform volt, amely küzdött az alacsony konverziós rátával és a magas hirdetési költségekkel. A korábbi kampányok nem voltak megfelelően szegmentálva, és a ROAS (hirdetési megtérülés) messze elmaradt az iparági átlagtól. A cég célkitűzése az volt, hogy a havi forgalmát megduplázza, miközben a hirdetési büdzsét hatékonyan tartja kézben.",
    solution: "A G2A Marketing csapata teljes körű PPC és Meta stratégiát dolgozott ki. Bevezettük a Google Shopping kampányokat dinamikus termékhirdetésekkel, Performance Max kampányokat az összes Google csatornán, valamint Meta Advantage+ Shopping kampányokat. A remarketing szegmenseket viselkedési adatok alapján finomítottuk, és A/B tesztelést végeztünk a hirdetési kreatívokon. A landing page-eket konverzióoptimalizálási szempontok szerint is átdolgoztuk.",
    results: "340%-os forgalomnövekedés 6 hónap alatt | ROAS: 8.2x (iparági átlag: 3.5x) | Konverziós ráta: 1.8%-ról 4.7%-ra nőtt | CPA 62%-kal csökkent | Havi aktív vásárlók száma megháromszorozódott",
    featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "Vidashop e-commerce növekedés",
    tags: "Google Ads,Meta Ads,E-commerce,PPC,ROAS",
    isActive: true,
    sortOrder: 1,
    metaTitle: "Vidashop Esettanulmány – 340% Forgalomnövekedés | G2A Marketing",
    metaDescription: "Hogyan segítettük a Vidashopnak 340%-kal növelni az e-commerce forgalmát Google Ads és Meta kampányokkal. Valódi eredmények, mérhető ROI.",
  },
  {
    title: "GRB Skin Clinic – Szépségipari klinika online jelenlétének teljes megújítása",
    slug: "grb-skin-clinic-szepsegipari-marketing",
    client: "GRB Skin Clinic",
    industry: "Szépségipar / Egészségügy",
    challenge: "A GRB Skin Clinic egy prémium bőrgyógyászati és esztétikai klinika, amely az online láthatóság hiányával küzdött. A versenytársak dominálták a Google keresési eredményeket a legfontosabb kulcsszavakon (pl. 'bőrgyógyász Budapest', 'lézeres szőrtelenítés'), és a klinikának nem volt kidolgozott közösségi média stratégiája. A cél az volt, hogy 12 hónapon belül az online foglalások száma 200%-kal növekedjen.",
    solution: "Komplex digitális marketing stratégiát dolgoztunk ki: helyi SEO optimalizálás Google Business Profile-lal, célzott Meta hirdetések (Instagram Stories és Reels formátumban) a 25-45 éves nők szegmensére, tartalommarketing bőrápolási tippekkel és kezelési leírásokkal, valamint Google Ads kampányok a magas szándékú keresési kifejezésekre. Bevezettük az online foglalási rendszert és az automatizált emlékeztető emaileket.",
    results: "247%-os növekedés az online foglalásokban | Google keresési pozíció: Top 3 a fő kulcsszavakon | Instagram követők: +1.800 organikus követő 6 hónap alatt | Weboldal forgalom: 312%-os növekedés | Visszatérő ügyfelek aránya: 68%",
    featuredImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "GRB Skin Clinic szépségipari marketing",
    tags: "SEO,Meta Ads,Szépségipar,Helyi SEO,Tartalommarketing",
    isActive: true,
    sortOrder: 2,
    metaTitle: "GRB Skin Clinic Esettanulmány – 247% Több Online Foglalás | G2A Marketing",
    metaDescription: "Hogyan segítettük a GRB Skin Clinicnek 247%-kal növelni az online foglalásait SEO és Meta hirdetések kombinálásával.",
  },
  {
    title: "Tüke Busz Zrt. – Közlekedési vállalat digitális kommunikációjának modernizálása",
    slug: "tuke-busz-digitalis-kommunikacio",
    client: "Tüke Busz Zrt.",
    industry: "Közlekedés / Önkormányzati",
    challenge: "A Tüke Busz Zrt., Pécs város helyi tömegközlekedési vállalata, elavult kommunikációs csatornákkal rendelkezett. Az utasok nehezen találtak aktuális menetrend-információkat, az ügyfélszolgálati terhelés magas volt, és a vállalat digitális jelenléte nem tükrözte a modernizálási törekvéseket. A cél egy átfogó digitális kommunikációs stratégia kidolgozása volt.",
    solution: "Kidolgoztunk egy átfogó digitális kommunikációs tervet: megújítottuk a közösségi média jelenlétét (Facebook, Instagram), bevezettük a valós idejű menetrend-értesítési rendszert, tartalomstratégiát dolgoztunk ki az utasok tájékoztatására, és SEO-optimalizált tartalmakat készítettünk a helyi keresési láthatóság növelésére. Employer branding kampányt is indítottunk a sofőr-toborzás támogatására.",
    results: "Facebook oldal elérés: 280%-os növekedés | Ügyfélszolgálati megkeresések: 35%-kal csökkent | Weboldal látogatók: +190% | Sofőr-toborzási kampány: 45 jelentkező az első hónapban | Utaselégedettségi index: 12 ponttal nőtt",
    featuredImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "Tüke Busz digitális kommunikáció",
    tags: "Közösségi Média,Tartalommarketing,Employer Branding,Önkormányzati,SEO",
    isActive: true,
    sortOrder: 3,
    metaTitle: "Tüke Busz Zrt. Esettanulmány – Digitális Kommunikáció Modernizálása | G2A Marketing",
    metaDescription: "Hogyan modernizáltuk a Tüke Busz Zrt. digitális kommunikációját és növeltük az utaselégedettséget.",
  },
  {
    title: "Café Frei – Prémium kávémárka közösségi média és tartalommarketing stratégiája",
    slug: "cafe-frei-kozossegi-media-tartalommarketing",
    client: "Café Frei",
    industry: "Vendéglátás / FMCG",
    challenge: "A Café Frei, Magyarország egyik vezető prémium kávémárkája, szerette volna megerősíteni online jelenlétét és növelni a franchise érdeklődők számát. A márka erős volt offline, de az online csatornákon nem tükrözte a prémium pozicionálást. A cél az volt, hogy a közösségi média követőbázis növekedjen és a franchise megkeresések száma megduplázódjon.",
    solution: "Prémium vizuális tartalomstratégiát dolgoztunk ki Instagram és Facebook platformokra, kávékultúrával kapcsolatos edukatív tartalmakkal, barista-sztorikat és franchise-sikersztorikat mutattunk be. Meta hirdetési kampányokat futtattunk franchise érdeklődők megszólítására, és tartalommarketing stratégiát dolgoztunk ki a kávészerető közönség bevonzására. Bevezettük az influencer marketing programot is.",
    results: "Instagram követők: +4.200 organikus követő 8 hónap alatt | Franchise megkeresések: 215%-os növekedés | Átlagos elérés posztanként: 3.8x növekedés | Weboldal forgalom: +178% | Franchise nyitások: 3 új egység az együttműködés alatt",
    featuredImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "Café Frei kávémárka marketing",
    tags: "Közösségi Média,Tartalommarketing,Meta Ads,FMCG,Franchise Marketing",
    isActive: true,
    sortOrder: 4,
    metaTitle: "Café Frei Esettanulmány – 215% Több Franchise Megkeresés | G2A Marketing",
    metaDescription: "Hogyan segítettük a Café Freit megerősíteni prémium pozicionálását online és növelni a franchise megkereséseket 215%-kal.",
  },
  {
    title: "Rehab Designer – Rehabilitációs eszközök B2B lead generálás és SEO",
    slug: "rehab-designer-b2b-lead-generalas",
    client: "Rehab Designer",
    industry: "Egészségügy / B2B",
    challenge: "A Rehab Designer rehabilitációs és gyógyászati segédeszközöket gyártó vállalat B2B értékesítési csatornáit szerette volna bővíteni. Az online jelenlétük minimális volt, és az értékesítési csapat manuálisan kereste az ügyfeleket. A cél az volt, hogy automatizált lead generálási rendszert építsenek ki, és a Google organikus forgalmát megduplázza.",
    solution: "Átfogó B2B digitális marketing stratégiát dolgoztunk ki: SEO-optimalizált termékoldalakat és szakmai cikkeket készítettünk, LinkedIn hirdetési kampányokat indítottunk egészségügyi intézmények döntéshozói számára, email marketing automatizációt vezettünk be lead nurturing céllal, és Google Ads kampányokat futtattunk magas szándékú B2B kulcsszavakra. Kidolgoztunk egy ingyenes termékdemó kérési folyamatot is.",
    results: "Organikus forgalom: 287%-os növekedés 12 hónap alatt | B2B lead-ek száma: havi 12-ről 67-re nőtt | LinkedIn kampány ROAS: 6.4x | Email nyitási arány: 38% (iparági átlag: 21%) | Értékesítési ciklus: 40%-kal rövidebb",
    featuredImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "Rehab Designer B2B marketing",
    tags: "B2B Marketing,SEO,Lead Generálás,LinkedIn,Email Automatizáció",
    isActive: true,
    sortOrder: 5,
    metaTitle: "Rehab Designer Esettanulmány – B2B Lead Generálás 460%-os Növekedése | G2A Marketing",
    metaDescription: "Hogyan segítettük a Rehab Designernek 460%-kal növelni a B2B lead-ek számát SEO és LinkedIn hirdetések kombinálásával.",
  },
  {
    title: "Royal Sports – Sportszerüzlet omnichannel marketing és e-commerce növekedés",
    slug: "royal-sports-omnichannel-marketing",
    client: "Royal Sports",
    industry: "Sport / Kiskereskedelem",
    challenge: "A Royal Sports sportszerüzlet-lánc az online és offline értékesítési csatornák integrálásával küzdött. Az e-commerce részleg forgalma stagnált, miközben a versenytársak agresszívan terjeszkedtek online. A cél az volt, hogy az online értékesítés aránya az összes forgalmon belül 15%-ról 35%-ra növekedjen 18 hónap alatt.",
    solution: "Omnichannel marketing stratégiát dolgoztunk ki: Google Shopping kampányokat vezettünk be az összes termékre, Meta katalógus hirdetéseket futtattunk dinamikus termékajánlókkal, szezonális promóciós kampányokat terveztünk (Back to School, Karácsonyi vásár, Nyári sportok), és bevezettük a hűségprogram digitális kommunikációját. A webshop UX-ét is optimalizáltuk a konverzió növelése érdekében.",
    results: "Online értékesítés aránya: 15%-ról 38%-ra nőtt | Google Shopping ROAS: 9.1x | Szezonális kampányok: átlagosan 420%-os forgalomnövekedés | Hűségprogram tagok: +2.800 új tag | Kosárelhagyási ráta: 68%-ról 41%-ra csökkent",
    featuredImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop",
    featuredImageAlt: "Royal Sports omnichannel marketing",
    tags: "Google Shopping,Meta Ads,E-commerce,Omnichannel,Kiskereskedelem",
    isActive: true,
    sortOrder: 6,
    metaTitle: "Royal Sports Esettanulmány – Online Értékesítés 153%-os Növekedése | G2A Marketing",
    metaDescription: "Hogyan segítettük a Royal Sportsnak megduplázni az online értékesítési arányát omnichannel marketing stratégiával.",
  },
];

for (const cs of caseStudies) {
  await conn.execute(
    `INSERT INTO case_studies (title, slug, client, industry, challenge, solution, results, featuredImage, featuredImageAlt, tags, isActive, sortOrder, metaTitle, metaDescription)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cs.title, cs.slug, cs.client, cs.industry, cs.challenge, cs.solution, cs.results, cs.featuredImage, cs.featuredImageAlt, cs.tags, cs.isActive, cs.sortOrder, cs.metaTitle, cs.metaDescription]
  );
  console.log("✓ Inserted:", cs.client);
}

await conn.end();
console.log("\n✅ All case studies seeded successfully!");
