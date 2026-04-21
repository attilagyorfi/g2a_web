# G2A Marketing – Projekt Dokumentáció

> **Verzió:** 1.0 | **Utolsó frissítés:** 2026. április | **Státusz:** Aktív fejlesztés

---

## 1. A projekt célja

A G2A Marketing weboldal egy **teljes körű, adatvezérelt marketing ügynökségi platform**, amelynek célja, hogy a pécsi székhelyű G2A Marketing Kft. digitális jelenlétét professzionálisan és hatékonyan képviselje. A projekt három fő pillérre épül:

**Ügyfélszerzés és lead generálás.** Az oldal elsődleges funkciója, hogy potenciális ügyfeleket vonzzon és konvertáljon – ingyenes marketing audit kéréseken, SEO audit eszközön és kapcsolatfelvételi űrlapokon keresztül. Minden oldal CTA-vezérelt, és az üzleti célokat helyezi előtérbe.

**Szakmai hitelesség és tartalommarketing.** A blog, az esettanulmányok és a referenciák szekció azt hivatott bizonyítani, hogy a G2A Marketing valódi eredményeket hoz valódi ügyfeleknek. Az esettanulmányok konkrét iparágakra (egészségügy, autóipar, szépségipar, B2B) fókuszálnak, mérőszámokkal alátámasztva.

**Admin és tartalom-menedzsment.** A beépített admin felület lehetővé teszi, hogy a csapat programozói tudás nélkül kezelje az összes tartalmat: blog cikkeket, referenciákat, hírlevél feliratkozókat, SEO beállításokat és oldal-metaadatokat.

---

## 2. Kiindulási alap és technológiai stack

### 2.1 Architektúra

A projekt a **Manus Web App Template** alapján készült, amely egy React + Express + tRPC fullstack keretrendszert biztosít. A stack minden rétege típusbiztos, és a fejlesztési sebesség maximalizálására van optimalizálva.

| Réteg | Technológia | Megjegyzés |
|---|---|---|
| Frontend | React 19 + Vite 7 | SPA, TypeScript, Tailwind CSS 4 |
| Backend | Express 4 + tRPC 11 | Type-safe API, nincs REST boilerplate |
| Adatbázis | MySQL / TiDB (Drizzle ORM) | Séma-first, migrációs workflow |
| Autentikáció | Manus OAuth | Session cookie alapú, JWT aláírással |
| Fájltárolás | S3-kompatibilis objektumtár | Képek, média feltöltés |
| Hosting | Manus Cloud | Automatikus deploy, egyedi domain |
| Verziókövetés | Git (Manus + GitHub mirror) | `attilagyorfi/g2a_web` |

### 2.2 Főbb függőségek

- **shadcn/ui** – hozzáférhető, testreszabható UI komponensek
- **Drizzle ORM** – típusbiztos adatbázis-kezelés
- **Wouter** – könnyűsúlyú React router
- **Sonner** – toast értesítések
- **Lucide React** – ikonkönyvtár
- **Streamdown** – markdown streaming megjelenítő

### 2.3 Dizájn rendszer

Az oldal egyedi, **G2A brand-specifikus** dizájn rendszert használ:

- **Elsődleges szín:** `#e91130` (G2A piros)
- **Háttér:** sötét téma (`#0a0a0a`, `#111`, `#1a1a1a`)
- **Tipográfia:** Roboto Mono (fejlécek, monospace elemek), Outfit (szövegtörzs), Inter (navigáció, UI)
- **Stílusjegyek:** terminál-esztétika, kód-szerű elemek, animált szekciók

---

## 3. Jelenlegi állapot – implementált funkciók

### 3.1 Publikus oldalak

| Oldal | URL | Státusz |
|---|---|---|
| Főoldal | `/` | ✅ Kész |
| Szolgáltatások (lista) | `/szolgaltatasok` | ✅ Kész |
| Szolgáltatás részletek | `/szolgaltatasok/:slug` | ✅ Kész (12 szolgáltatás) |
| Iparági landing oldalak | `/iparagi/:slug` | ✅ Kész (10 iparág) |
| Rólunk | `/rolunk` | ✅ Kész |
| Referenciák | `/referenciak` | ✅ Kész |
| Esettanulmány részlet | `/referenciak/:slug` | ✅ Kész |
| Blog (lista) | `/hirek` | ✅ Kész |
| Blog cikk | `/hirek/:slug` | ✅ Kész |
| Kapcsolat | `/kapcsolat` | ✅ Kész |
| Ingyenes Marketing Audit | `/ingyenes-audit` | ✅ Kész |
| Ingyenes SEO Audit | `/ingyenes-seo-audit` | ✅ Kész |
| Szakértelem / Iparágak | `/szakertelem` | ✅ Kész |
| Partnerek | `/partnerek` | ✅ Kész |
| Technológia | `/technologia` | ✅ Kész |

### 3.2 Admin felület (`/admin`)

| Modul | Funkció | Státusz |
|---|---|---|
| Irányítópult | Statisztikák, gyors áttekintés | ✅ Kész |
| Blog cikkek | CRUD, kategóriák, publikálás | ✅ Kész |
| Kategóriák | Blog kategória kezelés | ✅ Kész |
| Szolgáltatások | Tartalom szerkesztés | ✅ Kész |
| Partnerek | Partner logók, leírások | ✅ Kész |
| Vélemények | Ügyfélvélemények kezelése | ✅ Kész |
| Iparágak | Iparági oldalak tartalma | ✅ Kész |
| Technológiák | Eszközök, kategóriák | ✅ Kész |
| Esettanulmányok | Referenciák CRUD | ✅ Kész |
| Audit kérések | Beérkező audit lead-ek | ✅ Kész |
| Kapcsolatfelvételek | Beérkező üzenetek | ✅ Kész |
| Hírlevél | Feliratkozók, szegmentálás, törlés | ✅ Kész |
| SEO Oldalak | Meta adatok, kulcsszavak, új oldal | ✅ Kész |
| Beállítások | GTM, GA4, Crisp chat, WhatsApp | ✅ Kész |

### 3.3 Technikai funkciók

- **Kétnyelvűség (HU/EN):** Teljes fordítási rendszer `LanguageContext`-tel, minden oldal és komponens lefordítva
- **SEO:** Dinamikus meta tagek (`SeoHead` komponens), oldalankénti SEO admin
- **Cookie banner:** GDPR-kompatibilis, elfogad/elutasít
- **Crisp live chat:** Admin beállításból aktiválható
- **GTM / GA4:** Dinamikus script betöltés admin beállításból
- **WhatsApp gomb:** Lebegő gomb, admin oldalon nem jelenik meg
- **Exit intent popup:** Kilépési szándék detektálás, admin oldalon nem jelenik meg
- **Scroll progress bar:** Olvasási haladás jelző
- **Animált szekciók:** IntersectionObserver alapú reveal animációk
- **Témaváltó:** Sötét/világos téma (kísérleti)
- **Hírlevél szegmentálás:** Feliratkozók szegmens, forrás és tag alapján csoportosíthatók

---

## 4. Adatbázis séma – főbb táblák

```
users                  – Felhasználók (Manus OAuth)
blog_posts             – Blog cikkek
categories             – Blog kategóriák
services               – Szolgáltatások
partners               – Partnerek / referenciák
testimonials           – Ügyfélvélemények
industries             – Iparági oldalak
technologies           – Technológia stack elemek
case_studies           – Esettanulmányok
audit_leads            – Ingyenes audit kérések
contact_submissions    – Kapcsolatfelvételi üzenetek
newsletter_subscribers – Hírlevél feliratkozók (szegmentálással)
pages                  – SEO metaadatok oldalanként (kulcsszavakkal)
site_settings          – Oldal beállítások (GTM, GA4, Crisp, WhatsApp)
values                 – Értékek / accordion elemek (Rólunk oldal)
```

---

## 5. A kész projekt – végső állapot leírása

Amikor a projekt teljesen elkészül, a G2A Marketing weboldal egy **önállóan üzemeltethető, teljes körű marketing ügynökségi platform** lesz, amely a következő képességekkel rendelkezik:

### 5.1 Üzleti célok

A kész rendszer képes lesz arra, hogy a G2A Marketing csapata **programozói segítség nélkül** kezelje a teljes digitális jelenlétét. Ez magában foglalja az összes tartalom (blog, referenciák, szolgáltatások) szerkesztését, a beérkező lead-ek kezelését, a hírlevél kampányok szegmentálását és az SEO optimalizálást.

### 5.2 Tervezett fejlesztések (következő körök)

Az alábbi funkciók a következő fejlesztési iterációkban kerülnek megvalósításra:

| Prioritás | Fejlesztés | Leírás |
|---|---|---|
| Magas | Brevo hírlevél integráció | Automatikus szinkronizáció a Brevo listával, welcome email |
| Magas | Referenciák – teljes szöveg | Esettanulmány részletes oldalak teljes tartalommal |
| Magas | Blog – teljes tartalom | SEO-optimalizált cikkek feltöltése |
| Közepes | Többnyelvű tartalom (DB) | Blog cikkek és esettanulmányok EN változata |
| Közepes | AI tartalom generátor | Blog cikkek és meta leírások AI-alapú generálása |
| Közepes | Analitika dashboard | Látogatói statisztikák az admin felületen |
| Alacsony | Árajánlat kalkulátor | Interaktív marketing csomag kalkulátor |
| Alacsony | Ügyfélportál | Bejelentkező ügyfelek számára riport megtekintés |

### 5.3 Deployment

Az oldal a **Manus Cloud** platformon fut, egyedi domainnel (`g2amarketing.manus.space`). Éles üzembe helyezéshez a saját domain (`g2amarketing.hu`) bekötése szükséges a Manus Settings → Domains menüpontban.

---

## 6. Fejlesztési workflow

```bash
# Lokális fejlesztés
pnpm dev

# Adatbázis séma módosítás
pnpm drizzle-kit generate
# → generált SQL futtatása a webdev_execute_sql eszközzel

# TypeScript ellenőrzés
npx tsc --noEmit

# Tesztek futtatása
pnpm test

# Checkpoint mentés
# → Manus admin felületen vagy webdev_save_checkpoint eszközzel
```

---

## 7. Könyvtárstruktúra

```
g2a-marketing/
├── client/
│   ├── src/
│   │   ├── components/       # Újrafelhasználható UI komponensek
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CookieBanner.tsx
│   │   │   ├── ExitIntentPopup.tsx
│   │   │   ├── StickyCTA.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx  # HU/EN fordítások
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── RolunkPage.tsx
│   │   │   ├── ReferenciakPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── AuditPage.tsx
│   │   │   └── admin/              # Admin felület oldalai
│   │   ├── App.tsx                 # Routing
│   │   └── index.css               # Globális stílusok, G2A design tokens
├── server/
│   ├── routers.ts                  # tRPC procedure-ök
│   ├── db.ts                       # Adatbázis lekérdezések
│   └── _core/                      # Framework infrastruktúra
├── drizzle/
│   └── schema.ts                   # Adatbázis séma
├── PROJECT.md                      # Ez a dokumentum
└── todo.md                         # Fejlesztési feladatlista
```

---

## 8. Kapcsolat és felelősök

| Szerep | Név | Elérhetőség |
|---|---|---|
| Ügyfél / Tulajdonos | Győrfi Attila | attila@g2amarketing.hu |
| Fejlesztés | Manus AI | — |
| GitHub repo | attilagyorfi/g2a_web | https://github.com/attilagyorfi/g2a_web |
| Élő oldal | g2amarketing.manus.space | https://g2amarketing.manus.space |

---

*Dokumentum generálva: Manus AI | G2A Marketing projekt*
