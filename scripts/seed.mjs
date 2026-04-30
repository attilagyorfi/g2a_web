import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected. Seeding database...');

// Helper
async function insertIfEmpty(table, rows) {
  const [existing] = await conn.execute(`SELECT COUNT(*) as cnt FROM \`${table}\``);
  if (existing[0].cnt > 0) {
    console.log(`⚠ ${table} already has data, skipping`);
    return;
  }
  for (const row of rows) {
    const cols = Object.keys(row).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(row).map(() => '?').join(', ');
    const vals = Object.values(row);
    await conn.execute(`INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`, vals);
  }
  console.log(`✓ Seeded ${rows.length} rows into ${table}`);
}

// Hero Slides
await insertIfEmpty('hero_slides', [
  { title: 'G2A MARKETING ÜGYNÖKSÉG', subtitle: 'Kreatív online marketing ügynökség', backgroundImage: 'https://g2amarketing.hu/wp-content/uploads/2024/08/Away.webp', backgroundImageAlt: 'G2A Marketing ügynökség háttér – adatvezérelt marketing Pécs', ctaPrimaryText: 'Ingyenes Marketing Felmérés', ctaPrimaryUrl: '/kapcsolat', ctaSecondaryText: 'Brosúra', ctaSecondaryUrl: '/brosura', sortOrder: 0, isActive: 1 },
]);

// Services
await insertIfEmpty('services', [
  { slug: 'lokalizacio', number: '01', title: 'Lokalizáció', shortDescription: 'Hogyan segítjük a vállalatokat a nemzetközi piacokon való eligazodásban', heroTitle: 'Lokalizáció – Globális piacok, helyi megközelítés', heroSubtitle: 'Segítünk vállalatodnak sikeresen megjelenni a nemzetközi piacokon, kulturálisan releváns és nyelvileg pontos tartalmakkal.', content: '<p>A lokalizáció több mint egyszerű fordítás. A G2A Marketing lokalizációs szolgáltatása segít vállalatodnak kulturálisan releváns módon kommunikálni a célpiacodon.</p><h2>Mit nyújtunk?</h2><ul><li>Szakmai fordítás és lokalizáció</li><li>Kulturális adaptáció</li><li>Piaci belépési stratégia</li><li>Multilinguális SEO</li></ul>', icon: 'Globe', metaTitle: 'Lokalizáció – G2A Marketing Pécs', metaDescription: 'Professzionális lokalizációs szolgáltatás: fordítás, kulturális adaptáció, multilinguális SEO. Lépj be az új piacokra a G2A Marketinggel!', sortOrder: 1 },
  { slug: 'arculattervezes', number: '02', title: 'Arculattervezés', shortDescription: 'Logo, brosúra, roll-up? Nálunk egy helyen mindent megtalálsz.', heroTitle: 'Arculattervezés – Egyedi vizuális identitás', heroSubtitle: 'Erős, emlékezetes márkaidentitást építünk, amely megkülönbözteti vállalkozásodat a versenytársaktól.', content: '<p>A professzionális arculat az első benyomás, amelyet vállalkozásod tesz a potenciális ügyfelekre. A G2A Marketing kreatív csapata egyedi, átfogó arculati rendszereket tervez.</p><h2>Szolgáltatásaink:</h2><ul><li>Logo tervezés</li><li>Arculati kézikönyv</li><li>Nyomtatott anyagok (névjegy, brosúra, roll-up)</li><li>Digitális arculati elemek</li></ul>', icon: 'Palette', metaTitle: 'Arculattervezés – G2A Marketing Pécs', metaDescription: 'Egyedi arculattervezés: logo, brosúra, roll-up és teljes brand identity. Professzionális vizuális identitás a G2A Marketingtől!', sortOrder: 2 },
  { slug: 'hirdeteskezeles', number: '03', title: 'Hirdetéskezelés', shortDescription: 'Teljeskörű szolgáltatást nyújtunk tervezéstől a kivitelezésig.', heroTitle: 'Hirdetéskezelés – Maximális ROI', heroSubtitle: 'Adatvezérelt hirdetési kampányokat tervezünk és kezelünk, amelyek valódi eredményeket hoznak.', content: '<p>A hatékony hirdetéskezelés kulcsa az adatvezérelt döntéshozatal és a folyamatos optimalizálás. A G2A Marketing teljes körű hirdetéskezelési szolgáltatást nyújt.</p><h2>Platformok:</h2><ul><li>Google Ads (Search, Display, Shopping)</li><li>Facebook & Instagram Ads</li><li>LinkedIn Ads</li><li>TikTok Ads</li></ul>', icon: 'TrendingUp', metaTitle: 'Hirdetéskezelés – G2A Marketing Pécs', metaDescription: 'Professzionális Google Ads, Facebook és Instagram hirdetéskezelés. Maximalizáld ROI-dat a G2A Marketing adatvezérelt kampányaival!', sortOrder: 3 },
  { slug: 'kozossegi-media', number: '04', title: 'Közösségi Média', shortDescription: 'Bővítsd vevőköröd a social media használatával. A G2A segít mindenben.', heroTitle: 'Közösségi Média – Épülj fel a digitális térben', heroSubtitle: 'Stratégiai közösségi média jelenléttel növeljük márkád ismertségét és vevőkörödet.', content: '<p>A közösségi média ma már nélkülözhetetlen eszköz minden vállalkozás számára. A G2A Marketing átfogó social media stratégiát és menedzsmentet kínál.</p><h2>Szolgáltatásaink:</h2><ul><li>Social media stratégia</li><li>Tartalom tervezés és gyártás</li><li>Közösség kezelés</li><li>Influencer marketing</li></ul>', icon: 'Share2', metaTitle: 'Közösségi Média Kezelés – G2A Marketing Pécs', metaDescription: 'Professzionális közösségi média kezelés: Facebook, Instagram, LinkedIn. Növeld márkád ismertségét a G2A Marketing social media szakértőivel!', sortOrder: 4 },
  { slug: 'strategiai-marketing', number: '05', title: 'Stratégiai Marketing', shortDescription: 'Amivel vállalkozásod eredményessé válhat.', heroTitle: 'Stratégiai Marketing – Az alapoktól a csúcsig', heroSubtitle: 'Átfogó marketing stratégiát dolgozunk ki, amely hosszú távú növekedést biztosít vállalkozásodnak.', content: '<p>A sikeres marketing alapja egy jól átgondolt stratégia. A G2A Marketing tapasztalt csapata elemzi a piacot, a versenytársakat és a célközönséget, majd személyre szabott stratégiát dolgoz ki.</p><h2>Mit tartalmaz?</h2><ul><li>Piacelemzés és versenytárselemzés</li><li>Célcsoport meghatározás</li><li>Marketing mix tervezés</li><li>KPI meghatározás és mérés</li></ul>', icon: 'Target', metaTitle: 'Stratégiai Marketing – G2A Marketing Pécs', metaDescription: 'Átfogó marketing stratégia tervezés: piacelemzés, célcsoport meghatározás, KPI mérés. Tedd eredményessé vállalkozásodat a G2A Marketinggel!', sortOrder: 5 },
  { slug: 'keresooptimalizalas', number: '06', title: 'Keresőoptimalizálás', shortDescription: 'Ha a kereső első oldalán akarsz megjelenni.', heroTitle: 'Keresőoptimalizálás (SEO) – Légy az első!', heroSubtitle: 'Technikai és tartalmi SEO megoldásokkal juttatjuk weboldalad a Google első oldalára.', content: '<p>A keresőoptimalizálás az egyik legköltséghatékonyabb digitális marketing eszköz. A G2A Marketing SEO szakértői technikai és tartalmi optimalizálással segítik weboldalad előrejutását.</p><h2>SEO szolgáltatásaink:</h2><ul><li>Technikai SEO audit</li><li>On-page optimalizálás</li><li>Tartalommarketing</li><li>Link building</li><li>Lokális SEO</li></ul>', icon: 'Search', metaTitle: 'Keresőoptimalizálás (SEO) – G2A Marketing Pécs', metaDescription: 'Professzionális SEO szolgáltatás: technikai audit, on-page optimalizálás, link building. Kerülj a Google első oldalára a G2A Marketing segítségével!', sortOrder: 6 },
  { slug: 'webfejlesztes', number: '07', title: 'Webfejlesztés', shortDescription: 'Optimalizált, reszponzív, akadálymentes weboldal.', heroTitle: 'Webfejlesztés – Modern, gyors, reszponzív', heroSubtitle: 'Egyedi fejlesztésű weboldalakat és webáruházakat készítünk, amelyek konvertálnak és jól teljesítenek a keresőkben.', content: '<p>A weboldal ma az üzleti jelenlét alapköve. A G2A Marketing fejlesztői modern, gyors és SEO-barát weboldalakat készítenek, amelyek mobilon is tökéletesen működnek.</p><h2>Fejlesztési területeink:</h2><ul><li>Egyedi weboldal fejlesztés</li><li>WordPress fejlesztés</li><li>Webáruház fejlesztés</li><li>Landing page készítés</li><li>Weboldal karbantartás</li></ul>', icon: 'Code', metaTitle: 'Webfejlesztés – G2A Marketing Pécs', metaDescription: 'Egyedi weboldal fejlesztés: reszponzív, gyors, SEO-optimalizált. WordPress, webáruház, landing page – a G2A Marketing webfejlesztési csapatával!', sortOrder: 7 },
]);

// Categories
await insertIfEmpty('categories', [
  { name: 'Marketing', slug: 'marketing', description: 'Marketing tippek és stratégiák' },
  { name: 'SEO', slug: 'seo', description: 'Keresőoptimalizálási útmutatók' },
  { name: 'Közösségi Média', slug: 'kozossegi-media', description: 'Social media trendek és tippek' },
  { name: 'Mesterséges Intelligencia', slug: 'mesterseges-intelligencia', description: 'AI a marketingben' },
  { name: 'Webfejlesztés', slug: 'webfejlesztes', description: 'Weboldal fejlesztési tippek' },
]);

// Posts
await insertIfEmpty('posts', [
  { title: 'Nem az a kérdés, használ-e AI-t a céged, hanem az, hogy gyorsabban nősz-e tőle', slug: 'nem-az-a-kerdes-hasznal-e-ai-t-a-ceged', excerpt: 'A mesterséges intelligencia már nem a jövő – hanem a jelen. De a valódi kérdés nem az, hogy bevezeted-e, hanem az, hogy valóban növekedést hoz-e.', content: '<p>A mesterséges intelligencia már nem a jövő – hanem a jelen. De a valódi kérdés nem az, hogy bevezeted-e, hanem az, hogy valóban növekedést hoz-e.</p><p>Sok vállalkozás esik abba a csapdába, hogy az AI-t önmagáért alkalmazza, nem pedig konkrét üzleti célok elérésére. A G2A Marketing tapasztalata szerint az AI akkor hoz valódi értéket, ha:</p><ul><li>Konkrét folyamatokat automatizál</li><li>Adatvezérelt döntéshozatalt támogat</li><li>Személyre szabott ügyfélélményt tesz lehetővé</li></ul><p>A legfontosabb kérdés: milyen KPI-kat javít az AI bevezetése a te vállalkozásodban?</p>', categoryId: 4, authorName: 'G2A Marketing', status: 'published', metaTitle: 'AI és üzleti növekedés – G2A Marketing Blog', metaDescription: 'Nem az a kérdés, hogy használsz-e AI-t, hanem hogy növekedést hoz-e. Olvasd el a G2A Marketing elemzését!', publishedAt: new Date('2026-03-18') },
  { title: 'Mesterséges intelligencia marketing: Amit 2026-ban tudnod kell', slug: 'mesterseges-intelligencia-marketing-2026', excerpt: 'Az AI-alapú marketing eszközök 2026-ban már nem opcionálisak – ezek a legfontosabb trendek, amelyeket ismerned kell.', content: '<p>Az AI-alapú marketing eszközök 2026-ban már nem opcionálisak. Azok a vállalkozások, amelyek nem adaptálják ezeket az eszközöket, lemaradnak a versenytársaikhoz képest.</p><h2>A legfontosabb AI marketing trendek 2026-ban:</h2><ol><li><strong>Generatív AI tartalom:</strong> Az AI-generált tartalom minősége elérte az emberi szintet</li><li><strong>Prediktív analitika:</strong> Az AI előre jelzi a vásárlói viselkedést</li><li><strong>Személyre szabott hirdetések:</strong> Valós idejű, egyéni szintű személyre szabás</li><li><strong>Chatbotok és virtuális asszisztensek:</strong> 24/7 ügyfélszolgálat</li></ol>', categoryId: 4, authorName: 'G2A Marketing', status: 'published', metaTitle: 'AI Marketing 2026 – G2A Marketing Blog', metaDescription: 'A legfontosabb mesterséges intelligencia marketing trendek 2026-ban. Maradj lépést a G2A Marketing útmutatójával!', publishedAt: new Date('2026-03-18') },
  { title: 'Miért bukik el a legtöbb „marketingkampány", mielőtt elindulna?', slug: 'miert-bukik-el-a-legtobb-marketingkampany', excerpt: 'A legtöbb marketingkampány nem a kivitelezésnél bukik el, hanem már a tervezési fázisban. Mutatjuk a leggyakoribb hibákat.', content: '<p>A legtöbb marketingkampány nem a kivitelezésnél bukik el, hanem már a tervezési fázisban. A G2A Marketing tapasztalata szerint a következő hibák a leggyakoribbak:</p><h2>A 5 leggyakoribb tervezési hiba:</h2><ol><li><strong>Nincs konkrét célcsoport:</strong> "Mindenki a célközönségem" – ez a legnagyobb hiba</li><li><strong>Hiányzó KPI-ok:</strong> Ha nem méred, nem tudod javítani</li><li><strong>Irreális elvárások:</strong> A marketing nem csodaszer, de hosszú távon megtérül</li><li><strong>Nincs egyedi értékajánlat:</strong> Miért válasszanak téged?</li><li><strong>Nem megfelelő csatorna:</strong> Nem minden platform való minden vállalkozásnak</li></ol>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'Miért buknak el a marketingkampányok? – G2A Marketing Blog', metaDescription: 'A leggyakoribb marketingkampány hibák és hogyan kerüld el őket. Olvasd el a G2A Marketing szakértői tanácsait!', publishedAt: new Date('2026-01-29') },
  { title: 'A vásárló nem hülye – de elfoglalt', slug: 'a-vasarlo-nem-hulye-de-elfoglalt', excerpt: 'A modern fogyasztó nem azért nem vesz tőled, mert nem érti az ajánlatodat. Azért nem vesz, mert nincs ideje megérteni.', content: '<p>A modern fogyasztó nem azért nem vesz tőled, mert nem érti az ajánlatodat. Azért nem vesz, mert nincs ideje megérteni. Ez alapvetően megváltoztatja, hogyan kell kommunikálnod.</p><h2>Mit jelent ez a gyakorlatban?</h2><p>Az üzeneted legyen egyszerű, gyors és egyértelmű. A vásárló 3 másodperc alatt dönt arról, hogy érdemes-e tovább olvasni. Ha nem ragadod meg a figyelmét azonnal, elveszítetted.</p><p>Tippek az egyszerűbb kommunikációhoz:</p><ul><li>Egy üzenet, egy oldal</li><li>Vizuális tartalom a szöveg helyett</li><li>Egyértelmű CTA (cselekvésre felhívás)</li><li>Mobilra optimalizált megjelenés</li></ul>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'Egyszerű marketing kommunikáció – G2A Marketing Blog', metaDescription: 'A modern vásárló elfoglalt. Így kommunikálj egyszerűen és hatékonyan a G2A Marketing tippjeivel!', publishedAt: new Date('2026-01-26') },
  { title: 'Miért ég el a marketingbüdzsé nagy része mérés nélkül?', slug: 'miert-eg-el-a-marketingbudzse-meres-nelkul', excerpt: 'Ha nem méred a marketinged hatékonyságát, vakon költesz. Mutatjuk, hogyan állíts fel mérési rendszert.', content: '<p>Ha nem méred a marketinged hatékonyságát, vakon költesz. A G2A Marketing tapasztalata szerint a vállalkozások 70%-a nem rendelkezik megfelelő mérési rendszerrel.</p><h2>Alapvető mérési eszközök:</h2><ul><li><strong>Google Analytics 4:</strong> Weboldal forgalom és konverziók</li><li><strong>Google Search Console:</strong> Keresési teljesítmény</li><li><strong>Facebook Pixel:</strong> Social media konverziók</li><li><strong>CRM rendszer:</strong> Ügyfélút követés</li></ul><p>A mérés nem opcionális – ez az alapja minden hatékony marketing döntésnek.</p>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'Marketing mérés és analitika – G2A Marketing Blog', metaDescription: 'Miért fontos a marketing mérése? Eszközök és módszerek a hatékony analitikához. G2A Marketing útmutató!', publishedAt: new Date('2026-01-22') },
  { title: 'Miért nem konvertál a weboldalad, még akkor sem, ha „szép"?', slug: 'miert-nem-konvertal-a-weboldalad', excerpt: 'Egy szép weboldal önmagában nem elég. A konverzió optimalizálás tudománya és művészete.', content: '<p>Egy szép weboldal önmagában nem elég. A konverzió optimalizálás (CRO) a látogatókat vásárlókká alakítja – és ez nem csak a design kérdése.</p><h2>A konverzió 5 alappillére:</h2><ol><li><strong>Sebesség:</strong> 3 másodpercnél lassabb oldal = elveszített látogató</li><li><strong>Egyértelmű CTA:</strong> Mit tegyen a látogató?</li><li><strong>Bizalom jelzők:</strong> Vélemények, tanúsítványok, garanciák</li><li><strong>Mobilbarát design:</strong> A forgalom 60%+ mobilról érkezik</li><li><strong>A/B tesztelés:</strong> Folyamatos optimalizálás adatok alapján</li></ol>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'Weboldal konverzió optimalizálás – G2A Marketing Blog', metaDescription: 'Miért nem konvertál a weboldalad? CRO tippek és trükkök a G2A Marketing szakértőitől!', publishedAt: new Date('2026-01-19') },
  { title: 'Marketing ügynökség vs. belsős marketinges: melyiket válaszd?', slug: 'marketing-ugynokseg-vs-belsos-marketinges', excerpt: 'Belsős marketingest alkalmazz vagy ügynökséget bízz meg? Mindkettőnek megvannak az előnyei és hátrányai.', content: '<p>Ez az egyik leggyakoribb kérdés, amelyet a vállalkozóktól kapunk. A válasz: attól függ. De segítünk eldönteni!</p><h2>Mikor válassz ügynökséget?</h2><ul><li>Komplex, többcsatornás kampányokhoz</li><li>Speciális szaktudás szükséges (SEO, PPC, stb.)</li><li>Rugalmas büdzsé kezelés</li><li>Gyors beindulás szükséges</li></ul><h2>Mikor válassz belsős marketingest?</h2><ul><li>Nagy mennyiségű napi tartalom</li><li>Szoros iparági ismeret szükséges</li><li>Hosszú távú, stabil stratégia</li></ul>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'Marketing ügynökség vs. belsős marketinges – G2A Marketing Blog', metaDescription: 'Melyiket válaszd: marketing ügynökséget vagy belsős marketingest? A G2A Marketing segít a döntésben!', publishedAt: new Date('2026-01-15') },
  { title: 'AI a marketingben: hatékony eszköz vagy drága önámítás?', slug: 'ai-a-marketingben-hatekonysag-vagy-onamitas', excerpt: 'Az AI marketing eszközök valóban megtérülnek, vagy csak marketing fogások? Objektív elemzés.', content: '<p>Az AI marketing eszközök valóban megtérülnek, vagy csak marketing fogások? A G2A Marketing objektíven elemzi a helyzetet.</p><h2>Ahol az AI valóban segít:</h2><ul><li>Tartalom generálás és optimalizálás</li><li>Hirdetési célzás finomítása</li><li>Ügyfélszolgálat automatizálása</li><li>Adatelemzés és predikció</li></ul><h2>Ahol az AI nem helyettesíti az embert:</h2><ul><li>Kreatív stratégia alkotás</li><li>Érzelmi kapcsolat építés</li><li>Komplex üzleti döntések</li></ul>', categoryId: 4, authorName: 'G2A Marketing', status: 'published', metaTitle: 'AI a marketingben – G2A Marketing Blog', metaDescription: 'Az AI marketing eszközök valóban hatékonyak? Objektív elemzés a G2A Marketingtől!', publishedAt: new Date('2026-01-08') },
  { title: 'Miért nem működik a legtöbb KKV marketingje 2026-ban', slug: 'miert-nem-mukodik-a-legtobb-kkv-marketingje-2026', excerpt: 'A kis- és középvállalkozások marketingje sokszor hatástalan. Ezek a leggyakoribb okok és megoldások.', content: '<p>A kis- és középvállalkozások marketingje sokszor hatástalan – nem azért, mert nincs büdzsé, hanem mert rossz stratégiát alkalmaznak.</p><h2>A leggyakoribb KKV marketing hibák:</h2><ol><li>Nincs következetes márkaidentitás</li><li>Szórják a büdzsét minden platformra</li><li>Nem mérik az eredményeket</li><li>Nem ismerik a célközönségüket</li><li>Egyszeri kampányokban gondolkodnak, nem folyamatokban</li></ol><p>A megoldás: fókuszált, adatvezérelt, következetes marketing stratégia.</p>', categoryId: 1, authorName: 'G2A Marketing', status: 'published', metaTitle: 'KKV marketing hibák 2026 – G2A Marketing Blog', metaDescription: 'Miért nem működik a KKV marketing? A leggyakoribb hibák és megoldások a G2A Marketing szakértőitől!', publishedAt: new Date('2026-01-05') },
]);

// Testimonials
await insertIfEmpty('testimonials', [
  { quote: 'A G2A Marketing gyors, megbízható és minőségi munkát adott ki a kezei közül. Csak ajánlani tudom, hisz a legtöbb vállalkozónak pont erre van szüksége.', authorName: 'Sándor Diána', authorTitle: 'Tulajdonos', authorCompany: 'Rehab Designer', isActive: 1, sortOrder: 0 },
  // Testimonials: NO seed data — kitöltés kizárólag az admin felületen valós ügyfelek nyilatkozataival.
]);

// Partners
await insertIfEmpty('partners', [
  { name: 'Vidashop', slug: 'vidashop', isActive: 1, sortOrder: 1 },
  { name: 'Rehab Designer', slug: 'rehab-designer', isActive: 1, sortOrder: 2 },
  { name: 'AR Works', slug: 'ar-works', isActive: 1, sortOrder: 3 },
  { name: 'Webzperx', slug: 'webzperx', isActive: 1, sortOrder: 4 },
  { name: 'GRB Skin Clinic', slug: 'grb-skin-clinic', isActive: 1, sortOrder: 5 },
  { name: 'Tüke Busz Zrt.', slug: 'tuke-busz', isActive: 1, sortOrder: 6 },
  { name: 'Cafe Frei', slug: 'cafe-frei', isActive: 1, sortOrder: 7 },
  { name: 'Royal Sports', slug: 'royal-sports', isActive: 1, sortOrder: 8 },
  { name: 'M Mérnöki Iroda Kft.', slug: 'm-mernoki-iroda', isActive: 1, sortOrder: 9 },
  { name: 'Childéric Hungary', slug: 'childeric-hungary', isActive: 1, sortOrder: 10 },
  { name: 'Honda Ste-Ba', slug: 'honda-ste-ba', isActive: 1, sortOrder: 11 },
  { name: 'Nissan Ste-Ba', slug: 'nissan-ste-ba', isActive: 1, sortOrder: 12 },
  { name: 'Variatok', slug: 'variatok', isActive: 1, sortOrder: 13 },
  { name: 'Vapor Spirit', slug: 'vapor-spirit', isActive: 1, sortOrder: 14 },
  { name: 'Royal Portrait', slug: 'royal-portrait', isActive: 1, sortOrder: 15 },
  { name: 'ENO Ceramics', slug: 'eno-ceramics', isActive: 1, sortOrder: 16 },
  { name: 'Dent & Beauty', slug: 'dent-beauty', isActive: 1, sortOrder: 17 },
  { name: 'Buborékpark', slug: 'buborekpark', isActive: 1, sortOrder: 18 },
  { name: 'Donkey Pizza', slug: 'donkey-pizza', isActive: 1, sortOrder: 19 },
  { name: 'Alkatrészvadász', slug: 'alkatreszvadasz', isActive: 1, sortOrder: 20 },
  { name: 'Balatoni Szaki', slug: 'balatoni-szaki', isActive: 1, sortOrder: 21 },
  { name: 'Időszerződés', slug: 'idoszerzodes', isActive: 1, sortOrder: 22 },
  { name: 'Sensodome', slug: 'sensodome', isActive: 1, sortOrder: 23 },
]);

// Industries
await insertIfEmpty('industries', [
  { name: 'Technológia', slug: 'technologia', description: 'Technológiai vállalatok és IT cégek marketing megoldásai', icon: 'Cpu', sortOrder: 1, isActive: 1 },
  { name: 'Szolgáltatóipar', slug: 'szolgaltatoipar', description: 'Szolgáltató vállalkozások digitális marketing stratégiái', icon: 'Briefcase', sortOrder: 2, isActive: 1 },
  { name: 'Lokalizáció', slug: 'lokalizacio', description: 'Nemzetközi piacra lépés és lokalizációs megoldások', icon: 'Globe', sortOrder: 3, isActive: 1 },
  { name: 'Kereskedelem', slug: 'kereskedelem', description: 'Kiskereskedelem és e-commerce marketing', icon: 'ShoppingCart', sortOrder: 4, isActive: 1 },
  { name: 'Jog és pénzügy', slug: 'jog-es-penzugy', description: 'Jogi és pénzügyi szolgáltatók marketing kommunikációja', icon: 'Scale', sortOrder: 5, isActive: 1 },
  { name: 'Építőipar', slug: 'epitoipar', description: 'Építőipari vállalkozások digitális jelenléte', icon: 'Building', sortOrder: 6, isActive: 1 },
  { name: 'Egészségügy és szépségipar', slug: 'egeszsegugy-es-szepsegipar', description: 'Egészségügyi és szépségipari cégek marketing stratégiái', icon: 'Heart', sortOrder: 7, isActive: 1 },
  { name: 'Autóipar', slug: 'autoipar', description: 'Autóipari vállalkozások és márkák digitális marketingje', icon: 'Car', sortOrder: 8, isActive: 1 },
]);

// Technologies
await insertIfEmpty('technologies', [
  { name: 'Google Analytics', category: 'analytics', description: 'Weboldal forgalom és felhasználói viselkedés elemzése', sortOrder: 1, isActive: 1 },
  { name: 'Google Ads', category: 'marketing', description: 'Keresési és display hirdetések kezelése', sortOrder: 2, isActive: 1 },
  { name: 'SEMrush', category: 'analytics', description: 'SEO és versenytárselemzés eszköze', sortOrder: 3, isActive: 1 },
  { name: 'HubSpot', category: 'marketing', description: 'CRM és marketing automatizálás', sortOrder: 4, isActive: 1 },
  { name: 'Hootsuite', category: 'marketing', description: 'Közösségi média kezelő platform', sortOrder: 5, isActive: 1 },
  { name: 'Canva', category: 'marketing', description: 'Vizuális tartalom tervezés', sortOrder: 6, isActive: 1 },
  { name: 'Mailchimp', category: 'marketing', description: 'Email marketing és automatizálás', sortOrder: 7, isActive: 1 },
  { name: 'Ahrefs', category: 'analytics', description: 'SEO elemzés és link building', sortOrder: 8, isActive: 1 },
  { name: 'WordPress', category: 'other', description: 'Weboldal fejlesztési platform', sortOrder: 9, isActive: 1 },
  { name: 'Adobe Creative Cloud', category: 'marketing', description: 'Professzionális kreatív eszközök', sortOrder: 10, isActive: 1 },
  { name: 'ChatGPT (OpenAI)', category: 'ai', description: 'AI-alapú tartalom generálás', sortOrder: 11, isActive: 1 },
  { name: 'Jasper AI', category: 'ai', description: 'AI marketing szövegírás', sortOrder: 12, isActive: 1 },
  { name: 'Surfer SEO', category: 'ai', description: 'AI-alapú SEO optimalizálás', sortOrder: 13, isActive: 1 },
  { name: 'DeepL Translator', category: 'ai', description: 'Professzionális AI fordítás', sortOrder: 14, isActive: 1 },
]);

// Values
await insertIfEmpty('values', [
  { title: 'Tervezés és Kivitelezés', description: 'Minden projektet alaposan megtervezünk, majd precízen kivitelezünk. Nem hagyunk semmit a véletlenre.', icon: 'Compass', sortOrder: 1, isActive: 1 },
  { title: 'Megbízhatóság és Maximalizmus', description: 'Ügyfeleink számíthatnak ránk. Minden feladatot a maximális odafigyeléssel és szakértelemmel végzünk el.', icon: 'Shield', sortOrder: 2, isActive: 1 },
  { title: 'Lekövethetőség és Eredményesség', description: 'Minden kampány és projekt mérhető eredményekkel jár. Transzparens riportálással követjük a teljesítményt.', icon: 'BarChart2', sortOrder: 3, isActive: 1 },
  { title: 'Érthetőség és Egyszerűség', description: 'Bonyolult marketing fogalmakat egyszerű, érthető nyelven kommunikálunk ügyfeleinknek.', icon: 'MessageSquare', sortOrder: 4, isActive: 1 },
  { title: 'Minőség és Precizitás', description: 'Nem fogadunk el kompromisszumot a minőségben. Minden részletre odafigyelünk.', icon: 'Award', sortOrder: 5, isActive: 1 },
  { title: 'Kreativitás és Megjelenés', description: 'Egyedi, kreatív megoldásokkal teszük emlékezetessé ügyfeleinket a piacon.', icon: 'Lightbulb', sortOrder: 6, isActive: 1 },
  { title: 'Határidő és Pontosság', description: 'A határidők betartása nem opcionális számunkra – ez az alapvető szakmai tisztelet jele.', icon: 'Clock', sortOrder: 7, isActive: 1 },
]);

// Site Settings
await insertIfEmpty('site_settings', [
  { key: 'site_name', value: 'G2A Marketing' },
  { key: 'site_tagline', value: 'Adatvezérelt Ügynökség' },
  { key: 'site_description', value: 'A G2A Marketing egy adatvezérelt, kreatív online marketing ügynökség, akik segítik a márkák fejlődését.' },
  { key: 'contact_phone', value: '+36301902575' },
  { key: 'contact_email', value: 'info@g2amarketing.hu' },
  { key: 'contact_hours', value: '08:00 – 17:00' },
  { key: 'contact_address', value: 'Pécs, Magyarország' },
  { key: 'social_facebook', value: 'https://facebook.com/g2amarketing' },
  { key: 'social_youtube', value: 'https://youtube.com/g2amarketing' },
  { key: 'social_linkedin', value: 'https://linkedin.com/company/g2amarketing' },
  { key: 'homepage_quote', value: '"A marketing az, amikor a józan paraszti gondolkodást egy csipetnyi kreativitással fűszerezed."' },
  { key: 'homepage_about_title', value: 'Adatvezérelt marketing, amivel a márkád nem csak látható, hanem kiemelkedő lesz.' },
  { key: 'homepage_about_text', value: 'A G2A Marketing egy adatvezérelt, kreatív online marketing ügynökség, akik segítik a márkák fejlődését. Nem félünk a számoktól, hiszen azokból tanulhatunk a legtöbbet. A legtöbb cég már ott elbukik, hogy nem a megfelelő ügynökséget bízza meg a tervezéssel, kivitelezéssel és elemzéssel. Ha úgy gondolja, hogy vállalkozása a maximumot érdemli - válasszon minket.' },
]);

// Pages SEO
await insertIfEmpty('pages', [
  { slug: '/', title: 'Főoldal', metaTitle: 'G2A Marketing Pécs – Adatvezérelt Online Marketing Ügynökség', metaDescription: 'A G2A Marketing adatvezérelt, kreatív online marketing ügynökség Pécsről. Keresőoptimalizálás, hirdetéskezelés, webfejlesztés, közösségi média és arculattervezés.', ogTitle: 'G2A Marketing – Adatvezérelt Ügynökség', ogDescription: 'Kreatív online marketing ügynökség Pécsről. SEO, PPC, social media, webfejlesztés és arculattervezés.' },
  { slug: '/szolgaltatasok', title: 'Szolgáltatások', metaTitle: 'Szolgáltatások – G2A Marketing Pécs', metaDescription: 'A G2A Marketing teljes körű marketing szolgáltatásai: SEO, hirdetéskezelés, közösségi média, webfejlesztés, arculattervezés, stratégiai marketing és lokalizáció.' },
  { slug: '/szakertelem', title: 'Szakértelem', metaTitle: 'Szakértelem – G2A Marketing Pécs', metaDescription: 'A G2A Marketing szaktudása és iparági tapasztalata. Marketing megoldások technológia, kereskedelem, egészségügy, autóipar és más szektorokban.' },
  { slug: '/technologia', title: 'Technológia', metaTitle: 'Technológia – G2A Marketing Pécs', metaDescription: 'A G2A Marketing által használt marketing és AI eszközök: Google Analytics, Google Ads, SEMrush, HubSpot, ChatGPT és más professzionális platformok.' },
  { slug: '/hirek', title: 'Hírek', metaTitle: 'Marketing Hírek és Blog – G2A Marketing Pécs', metaDescription: 'Marketing tippek, SEO útmutatók, AI a marketingben és iparági hírek a G2A Marketing szakértőitől.' },
  { slug: '/partnereink', title: 'Partnereink', metaTitle: 'Partnereink – G2A Marketing Pécs', metaDescription: 'A G2A Marketing elégedett partnerei és referenciái. Ismerd meg, kikkel dolgoztunk együtt!' },
  { slug: '/kapcsolat', title: 'Kapcsolat', metaTitle: 'Kapcsolat – G2A Marketing Pécs', metaDescription: 'Vedd fel a kapcsolatot a G2A Marketing csapatával! Telefon: +36301902575, Email: info@g2amarketing.hu. Ingyenes marketing felmérés!' },
  { slug: '/adatvedelmi-iranyelvek', title: 'Adatvédelmi Irányelvek', metaTitle: 'Adatvédelmi Irányelvek – G2A Marketing Pécs', metaDescription: 'A G2A Marketing adatvédelmi irányelvei és GDPR megfelelőségi tájékoztatója.' },
]);

await conn.end();
console.log('\n✅ Seeding complete!');
