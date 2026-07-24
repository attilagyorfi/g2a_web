# G2A Marketing — Mérőeszköz- és tag-útmutató

*Utolsó frissítés: 2026-07 · Készítette: fejlesztői audit*

Ez a dokumentum összefoglalja, **mi van bekötve**, **mi hiányzik**, és **lépésről lépésre** hogyan állítsd be a Google Tag Managert, a GA4-et és a Meta Pixelt úgy, hogy a weboldal fő konverzióit (leadek, audit-kérések, feliratkozások) megbízhatóan mérd.

---

## 1. Jelenlegi állapot (audit)

| Eszköz | Állapot | Honnan jön az azonosító |
|---|---|---|
| **Google Tag Manager** | ✅ Bekötve (`GTM-PWR78N…`) | Admin → Beállítások → `gtm_id` |
| **Google Analytics 4** | ✅ Azonosító beállítva (`G-KVFNBKJY…`) | Admin → Beállítások → `ga4_id` |
| **Meta (Facebook) Pixel** | ✅ Bekötve (`4936…`) | Admin → Beállítások → `meta_pixel_id` |
| **Crisp chat** | ⬜ Nincs beállítva | `crisp_website_id` |
| **Google Ads** | ⬜ Nincs beállítva | `google_ads_id` (Ads a GTM-ben) |
| **Google Search Console** | ⬜ Nincs beállítva | `google_search_console` |

**Hogyan tölt be minden mérőkód (fontos a teszteléshez):**
- A szkriptek **csak az első interakció után** (kattintás/görgetés) vagy ~3 mp tétlenség után töltődnek be — ez teljesítmény-optimalizálás. Frissen betöltött oldalon a Pixel/GA4 nem azonnal indul.
- Minden mérőkód **süti-hozzájáruláshoz kötött**: a GTM/GA4/Pixel csak **„marketing" hozzájárulás** után, a Crisp csak **„harmadik fél" hozzájárulás** után indul. Amíg a látogató nem fogadja el a sütiket, semmi sem mér.

---

## 2. ⚠️ A legfontosabb tudnivaló: a GA4 a GTM-en keresztül fut

Mivel a `gtm_id` **be van állítva**, a weboldal **NEM tölti be külön a GA4-et** (szándékosan, hogy ne legyen dupla betöltés). Ez azt jelenti:

> **A GA4 CSAK akkor mér, ha a GTM-konténeren belül létrehozol egy „GA4 Configuration" (Google Tag) taget a `G-KVFNBKJY…` Measurement ID-vel.** Ha ez a tag nincs a GTM-ben, a GA4 semmit nem lát — hiába van kitöltve a `ga4_id` az adminban.

Az első teendő tehát: ellenőrizd a GTM-konténerben, hogy van-e GA4 Config tag. Ha nincs, hozd létre (lásd 4. pont).

---

## 3. Mit küld a weboldal a dataLayerbe (már be van építve)

A weboldal egy **kliens-oldali SPA**, ahol az űrlapok háttérben (tRPC-vel) küldenek — emiatt a GTM **beépített „Form Submission" és „History Change" triggerei nem megbízhatók**. Ezért a kód **explicit, szemantikus eseményeket** küld a `dataLayer`-be a pontos sikeres pillanatokban. Ezeket kell a GTM-ben felhasználni:

| `event` (dataLayer) | Mikor fut | Paraméterek | Marketing jelentés |
|---|---|---|---|
| `virtual_page_view` | **Minden oldalváltáskor** (SPA-navigáció) | `page_path`, `page_location`, `page_title` | Enélkül a GA4 csak a belépő oldalt látná |
| `generate_lead` | Kapcsolati űrlap sikeres beküldése | `form`, `lead_source` | **Fő konverzió** |
| `audit_request` | Ingyenes audit űrlap beküldése | `form`, `lead_source` | **Fő konverzió** (magas szándék) |
| `newsletter_signup` | Hírlevél-feliratkozás | `form`, `signup_source` | Tölcsér-teteji konverzió |
| `job_application` | Karrier-jelentkezés | `form` | HR, nem marketing (külön kezelendő) |

> A kezdő oldalbetöltéskor a `virtual_page_view` **nem** fut (azt a GA4 Config tag saját `page_view`-ja adja) — így nincs dupla számolás. Minden **további** navigáció küld egyet.

---

## 4. GTM beállítás — lépésről lépésre

Nyisd meg a GTM-konténert (`GTM-PWR78N…`) a [tagmanager.google.com](https://tagmanager.google.com) oldalon.

### 4.1. GA4 alap (Configuration)
1. **Tags → New → Google Tag (Google Analytics: GA4 Configuration)**.
2. Tag ID / Measurement ID: `G-KVFNBKJY…`.
3. Trigger: **Initialization – All Pages**.
4. Mentés. *(Ez adja a belépő oldal `page_view`-ját.)*

### 4.2. SPA-oldalnézetek (virtual_page_view)
1. **Triggers → New → Custom Event**, Event name: `virtual_page_view`.
2. **Tags → New → GA4 Event**, Config tag: az előbbi.
   - Event Name: `page_view`
   - Event Parameters: `page_location` = `{{DLV - page_location}}`, `page_path` = `{{DLV - page_path}}`, `page_title` = `{{DLV - page_title}}`
   - *(Készíts hozzá Data Layer Variable-öket: `page_location`, `page_path`, `page_title`.)*
   - Trigger: a `virtual_page_view` custom event.
3. **FONTOS a dupla-számolás ellen:** a GA4 adatfolyamban (Admin → Data Streams → Enhanced measurement) **kapcsold KI** a *„Page changes based on browser history events"* opciót — különben a GA4 automatikusan is számolna SPA-oldalnézetet a mi eseményünk mellett.

### 4.3. Konverziós események
Minden alábbi eseményhez: **Custom Event trigger** (a fenti event-névvel) + **GA4 Event tag** (a Config taggel), az azonos nevű GA4-eseménnyel:

| dataLayer event | GA4 event név | GA4-ben jelöld be |
|---|---|---|
| `generate_lead` | `generate_lead` | **Key event (konverzió)** |
| `audit_request` | `audit_request` | **Key event (konverzió)** |
| `newsletter_signup` | `newsletter_signup` | Opció: key event |
| `job_application` | `job_application` | Nem konverzió (HR) |

A GA4-ben: **Admin → Events → Mark as key event** a `generate_lead` és `audit_request` mellett.

### 4.4. Meta Pixel konverziók
A weboldal a Pixel alapkódját és a `PageView`-t már kezeli (oldalváltáskor is). A **Lead** eseményhez:
1. **Tags → New → Custom HTML**: `<script>fbq('track','Lead');</script>`
2. Trigger: `generate_lead` (és/vagy `audit_request`) custom event.
3. *(Feliratkozáshoz: `fbq('track','CompleteRegistration')` a `newsletter_signup` eseményen.)*

### 4.5. Google Ads (ha lesz Ads-fiók)
1. Állítsd be a `google_ads_id`-t az adminban (nem kötelező a kódhoz, de dokumentáció).
2. Ads → Conversions → új konverzió → GTM „Google Ads Conversion Tracking" tag, trigger: `generate_lead` / `audit_request`.

---

## 5. Marketing-ajánlások (mit érdemes mérni és miért)

- **Elsődleges konverziók:** `generate_lead` (kapcsolat) és `audit_request` (audit). Ezek a valódi üzleti értékű események — jelöld őket GA4 key eventnek és Ads-konverziónak. Az auditkérés magasabb szándékú, érdemes külön is nézni.
- **Tölcsér-teteje:** `newsletter_signup` — remarketing-közönség építésére jó (feliratkozók újracélzása).
- **Elköteleződés (GA4 Enhanced Measurement, kapcsold be):** görgetési mélység, kimenő linkek, oldalon belüli keresés (a weboldalon **van kereső** — a „site search" hasznos). Ezek automatikusak, nem kell kód.
- **Telefon/email kattintás:** GTM „Just Links" click trigger a `tel:` és `mailto:` linkekre → GA4 event (`contact_click`). Ez méri, hányan hívnak/írnak közvetlenül.
- **Közönségek:** GA4-ben építs közönséget a `generate_lead`/`audit_request` eseményekből (meleg leadek) és a `newsletter_signup`-ból (érdeklődők) — ezek Ads/Meta remarketingre exportálhatók.
- **Ne** állíts be „garantált" jellegű mikrokonverziót minden kattintásra — a jelfrissesség fontosabb, mint a mennyiség.

---

## 6. Hogyan teszteld

1. **GTM Preview mód** (Tag Assistant): connect a `g2amarketing.hu`-ra.
2. **Fogadd el a süti-bannert** (marketing) — enélkül a GTM el sem indul.
3. **Kattints/görgess** egyszer — a szkriptek csak interakció után töltődnek.
4. Navigálj oldalak között → nézd, hogy a `virtual_page_view` beérkezik a Preview „Data Layer" fülén.
5. Küldj be egy tesztet a kapcsolati űrlapon → `generate_lead` esemény.
6. **GA4 DebugView** (Admin → DebugView): élőben látod a beérkező eseményeket.
7. **Meta Pixel Helper** (Chrome-bővítmény): a PageView és Lead eseményekhez.

---

## 7. Amit be kell / lehet állítani (Admin → Beállítások)

| Kulcs | Állapot | Teendő |
|---|---|---|
| `gtm_id`, `ga4_id`, `meta_pixel_id` | ✅ kész | — |
| `google_ads_id` | ⬜ | Ha indul Ads-kampány |
| `crisp_website_id` | ⬜ | Ha kell élő chat |
| `google_search_console` | ⬜ | SEO-verifikációhoz (a `<meta>` tag automatikusan kikerül) |

> Megjegyzés a migrációhoz: a Vercel-staging Cloudflare „Attack Challenge Mode"-ja blokkolhatja a GTM/GA4 debug- és crawler-forgalmat. Éles (tarhely.eu) környezetben ez nem lesz gond; a mérés hitelesítését a végleges domainen, a challenge nélkül érdemes elvégezni.
