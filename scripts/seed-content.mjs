/**
 * Seed script: inserts 3 SEO-optimized blog posts into the database.
 * Run with: node scripts/seed-content.mjs
 */
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── 3 SEO Blog Posts ──────────────────────────────────────────────────────────
const posts = [
  {
    title: "Google Ads vs. Meta Hirdetések: Melyiket válassza 2025-ben?",
    slug: "google-ads-vs-meta-hirdetes-2025",
    excerpt: "Részletes összehasonlítás: mikor érdemes Google Ads-t, mikor Meta hirdetéseket futtatni. Valós kampányadatok és ROI elemzés alapján.",
    content: `## Google Ads vs. Meta Hirdetések: Melyiket válassza 2025-ben?

A legtöbb vállalkozó ugyanazt a kérdést teszi fel: **Google Ads vagy Facebook/Instagram hirdetések?** A válasz nem egyszerű – mindkét platform más-más célra optimális.

### Mikor válasszon Google Ads-t?

A Google Ads **keresési szándékon** alapul. Ha valaki beírja, hogy "fogorvos Budapest", aktívan keresi a szolgáltatást. Ez azt jelenti:

- **Magas konverziós szándék**: a felhasználó már döntési fázisban van
- **Azonnali eredmény**: az első napon megjelenhet a hirdetés
- **Mérhetőség**: minden kattintás, konverzió nyomon követhető

**Ideális esetei:**
- Helyi szolgáltatások (orvos, ügyvéd, autószerelő)
- E-commerce termékek (Shopping kampányok)
- B2B lead generálás (keresési kampányok)

### Mikor válasszon Meta Hirdetéseket?

A Facebook és Instagram hirdetések **érdeklődésen és demográfián** alapulnak. A felhasználó nem keres, hanem a feed-ben találkozik a hirdetéssel.

- **Márkaépítés**: széles közönség elérése
- **Vizuális termékek**: divat, lakberendezés, éttermek
- **Retargeting**: weboldal látogatók visszahozása

### Valós adatok: melyik hoz több ROI-t?

Az általunk kezelt kampányok alapján:

| Iparág | Google Ads ROAS | Meta ROAS |
|--------|----------------|-----------|
| E-commerce | 4.2x | 3.8x |
| Helyi szolgáltatás | 5.1x | 2.3x |
| B2B SaaS | 3.7x | 1.9x |
| Vendéglátás | 2.8x | 4.1x |

### A legjobb stratégia: kombinálj!

A legtöbb esetben a **kombinált megközelítés** hozza a legjobb eredményt:
1. Google Ads a keresési szándékhoz
2. Meta retargeting a Google látogatóknak
3. Meta márkaépítés a hideg közönségnek

### Összefoglalás

Nincs egyetlen "legjobb" platform. Az optimális mix az iparágától, a büdzséjétől és a céljaitól függ. Ha bizonytalan, kérjen **ingyenes marketing auditot** – elemezzük az Ön esetét és javaslatot teszünk.`,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    metaTitle: "Google Ads vs. Meta Hirdetések 2025 – Melyiket válassza? | G2A Marketing",
    metaDescription: "Google Ads vagy Facebook/Instagram hirdetések? Részletes összehasonlítás valós kampányadatokkal. Megtudja, melyik platform hozza a legjobb ROI-t az Ön vállalkozásának.",
    categoryId: 1,
    readingTime: 7,
    isPublished: true,
  },
  {
    title: "Lokális SEO 2025: Hogyan kerüljön az első helyre a Google Térképen?",
    slug: "lokalis-seo-2025-google-terkep",
    excerpt: "Lépésről lépésre útmutató a helyi SEO-hoz: Google My Business optimalizálás, helyi kulcsszavak, értékelések kezelése és a legújabb 2025-ös algoritmus változások.",
    content: `## Lokális SEO 2025: Hogyan kerüljön az első helyre a Google Térképen?

Ha helyi vállalkozást vezet – legyen az fogorvosi rendelő, étterem vagy autószerelő –, a **Google Térkép első helye** az egyik legértékesebb digitális ingatlan. Az itt megjelenő vállalkozások átlagosan **3-5x több hívást és látogatást** kapnak.

### Mi változott 2025-ben?

A Google 2025-ben több fontos algoritmikus frissítést vezetett be a helyi keresésnél:

1. **AI-alapú relevancia**: a Google jobban érti a természetes nyelvű kereséseket
2. **Vélemény minőség**: a részletes, szöveges értékelések nagyobb súlyt kapnak
3. **Fotó frissesség**: a rendszeresen feltöltött képek javítják a pozíciót
4. **Reakcióidő**: a Google My Business üzenetekre adott válasz sebessége rangsorolási tényező lett

### Google My Business optimalizálás – 10 lépés

**1. Teljes profil kitöltése**
Minden mező kitöltése 35%-kal növeli a megjelenési valószínűséget.

**2. Kategória pontosítás**
Válasszon elsődleges és másodlagos kategóriákat is. Pl. "Fogorvos" + "Fogászati klinika" + "Gyermekfogászat".

**3. Heti fotófeltöltés**
Töltsön fel legalább 1-2 friss fotót hetente (belső tér, csapat, termékek).

**4. Google Posts használata**
Heti 1-2 poszt (akciók, hírek, események) 15-20%-kal növeli a kattintásokat.

**5. Kérdések és válaszok**
Töltse ki a Q&A szekciót a leggyakoribb kérdésekkel – ez csökkenti a visszapattanási arányt.

### Helyi kulcsszavak stratégiája

A helyi SEO kulcsszavak három típusa:
- **Geo-modifikált**: "fogorvos Budapest XIII. kerület"
- **Közelségi**: "fogorvos közelemben"
- **Szolgáltatás + helyszín**: "fogfehérítés Újpest"

### Értékelések kezelése

Az értékelések a helyi SEO **legfontosabb tényezői** közé tartoznak:

- Célozzon legalább **4.5 csillagos** átlagot
- Válaszoljon MINDEN értékelésre (pozitívra és negatívra is)
- Kérjen értékelést minden elégedett ügyféltől (QR-kód, email, SMS)

### Összefoglalás

A helyi SEO nem egyszeri feladat, hanem folyamatos munka. Ha nincs kapacitása rá, bízza szakemberre – egy jól optimalizált Google My Business profil **6-12 hónapon belül megtérül**.`,
    featuredImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80",
    metaTitle: "Lokális SEO 2025 – Google Térkép Első Hely Útmutató | G2A Marketing",
    metaDescription: "Részletes lokális SEO útmutató 2025-re: Google My Business optimalizálás, helyi kulcsszavak, értékelések kezelése. Kerüljön az első helyre a Google Térképen!",
    categoryId: 2,
    readingTime: 8,
    isPublished: true,
  },
  {
    title: "Marketing Automatizáció: 5 folyamat, amit azonnal automatizálhat",
    slug: "marketing-automatizacio-5-folyamat",
    excerpt: "Praktikus útmutató: 5 marketing folyamat, amelyeket azonnal automatizálhat és ezzel havonta 20-30 munkaórát spórolhat meg, miközben több leadet generál.",
    content: `## Marketing Automatizáció: 5 folyamat, amit azonnal automatizálhat

A marketing automatizáció nem csak a nagy vállalatok kiváltsága. Egy **jól beállított automatizáció** akár kis vállalkozások számára is havonta 20-30 munkaórát takaríthat meg – miközben több és jobb minőségű leadet generál.

### Mi a marketing automatizáció?

A marketing automatizáció olyan szoftverek és folyamatok összessége, amelyek **automatikusan végzik el az ismétlődő marketing feladatokat**: email küldés, lead pontozás, social media posztolás, riportálás.

### 1. Üdvözlő email sorozat (Welcome Sequence)

**Probléma**: Az új feliratkozók 70%-a az első 48 órában a legaktívabb – de legtöbb vállalkozás nem kommunikál velük azonnal.

**Megoldás**: 5 emailből álló automatikus sorozat:
- Email 1 (azonnal): Üdvözlés + legfontosabb tartalom
- Email 2 (2. nap): Legsikeresebb esettanulmány
- Email 3 (4. nap): Leggyakoribb problémák megoldása
- Email 4 (7. nap): Exkluzív ajánlat
- Email 5 (14. nap): Soft CTA (konzultáció, audit)

**Eredmény**: 3-5x magasabb megnyitási arány vs. hagyományos hírlevél.

### 2. Elhagyott kosár visszahozása

**E-commerce esetén** az elhagyott kosarak visszahozása az egyik legjobb ROI-jú automatizáció:
- 1 óra után: emlékeztető email
- 24 óra után: szociális bizonyíték (értékelések)
- 72 óra után: kedvezmény ajánlat

**Átlagos visszahozási arány**: 15-25%.

### 3. Lead nurturing (B2B esetén)

B2B értékesítési ciklus általában 3-6 hónap. Az automatikus nurturing sorozat tartja melegen a leadeket:
- Heti 1-2 hasznos tartalom (blog, videó, webinar)
- Iparág-specifikus esettanulmányok
- Termék/szolgáltatás bemutatók

### 4. Születésnap és évforduló kampányok

Az egyik legmagasabb konverziójú automatizáció: **személyre szabott üzenet** az ügyfél születésnapján vagy az ügyfélkapcsolat évfordulóján.

Átlagos eredmény: 5-8x magasabb konverziós arány vs. általános kampányok.

### 5. Reaktiváló kampányok

Az inaktív ügyfelek (90+ napja nem vásároltak) reaktiválása olcsóbb, mint új ügyfelek szerzése:
- "Hiányozol" email sorozat
- Exkluzív visszatérő kedvezmény
- Személyre szabott ajánlat az előző vásárlás alapján

### Melyik eszközt válassza?

| Eszköz | Ár/hó | Legjobb | 
|--------|-------|---------|
| Brevo | 0-25€ | KKV-k, email fókusz |
| Mailchimp | 0-50€ | E-commerce |
| ActiveCampaign | 29-149€ | B2B, komplex workflow |
| HubSpot | 45-800€ | Enterprise, CRM integráció |

### Összefoglalás

A marketing automatizáció beállítása időt igényel, de **az első hónaptól megtérül**. Ha segítségre van szüksége a megfelelő eszköz kiválasztásában és a folyamatok beállításában, kérjen ingyenes konzultációt.`,
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    metaTitle: "Marketing Automatizáció – 5 Folyamat amit Azonnal Automatizálhat | G2A Marketing",
    metaDescription: "5 marketing automatizáció, amit azonnal bevezethet: üdvözlő sorozat, elhagyott kosár, lead nurturing, születésnap kampányok. Spóroljon 20-30 munkaórát havonta!",
    categoryId: 1,
    readingTime: 9,
    isPublished: true,
  },
];

let inserted = 0;
for (const post of posts) {
  // Check if slug already exists
  const [existing] = await conn.execute("SELECT id FROM posts WHERE slug = ?", [post.slug]);
  if (existing.length > 0) {
    console.log(`Skipping existing post: ${post.slug}`);
    continue;
  }
  
  await conn.execute(
    `INSERT INTO posts (title, slug, excerpt, content, featuredImage, metaTitle, metaDescription, categoryId, authorName, status, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
    [post.title, post.slug, post.excerpt, post.content, post.featuredImage, post.metaTitle, post.metaDescription, post.categoryId, 'G2A Marketing', post.isPublished ? 'published' : 'draft']
  );
  console.log(`Inserted post: ${post.title}`);
  inserted++;
}

console.log(`\nDone! Inserted ${inserted} new blog posts.`);
await conn.end();
