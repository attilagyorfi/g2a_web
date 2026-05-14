# G2A Marketing – Deploy checklist

Gyors ellenőrzőlista éles indítás előtt. Kövesd sorrendben.

---

## 1. Környezeti változók

Másold le a [`.env.example`](.env.example) fájlt `.env`-re, és töltsd ki mindegyiket. A **kötelező** csoportban lévők nélkül a szerver nem indul el vagy kritikus funkciók kikapcsolnak.

### Kötelező

| Változó | Honnan | Ellenőrzés |
|---|---|---|
| `DATABASE_URL` | TiDB Cloud konzol → Connect → General | `node -e "require('mysql2/promise').createConnection(process.env.DATABASE_URL).then(c=>c.query('SELECT 1').then(console.log))"` |
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Min. 32 karakter |

### Admin login (válassz egyet)

Az admin felület (`/admin`) eléréséhez vagy a Manus OAuth-ot, vagy a beépített jelszó-fallback-et kell beállítani. A kettőt egyszerre is be lehet kapcsolni — a frontend a Manus OAuth-ot preferálja, ha mindkét konfig megvan.

**Opció A — Manus OAuth (preferált, ha a Manus app már megvan):**

| Változó | Honnan | Megjegyzés |
|---|---|---|
| `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID` | Manus Settings → App Registration | Redirect URI = `https://g2amarketing.hu/api/oauth/callback` |

**Opció B — Jelszó-fallback (használj, amíg az OAuth nincs beállítva):**

| Változó | Mi az | Megjegyzés |
|---|---|---|
| `ADMIN_EMAIL` | Belépési email cím | bármilyen — csak helyileg ellenőrzött, nem küld emailt |
| `ADMIN_PASSWORD` | Belépési jelszó | min. 12 karakter, generálva `node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"` |

A jelszó-flow rate-limit-elve van (IP-nként 5 próbálkozás / 15 perc DB-backed limiterben). Sikeres belépés után ugyanazt a `app_session_id` cookie-t kapja a böngésző, mint OAuth-flow esetén. Mindkét vált. törlésével a fallback inaktívvá válik.

### Opcionális

| Változó | Mi nélkül | Javaslat |
|---|---|---|
| `DEEPL_API_KEY` | Admin UI auto-fordító gombok szürkék | Ingyenes: https://www.deepl.com/signup (500k karakter/hó, `:fx` végű kulcs = free tier auto-detect) |
| `CLOUDINARY_URL` + `VITE_CLOUDINARY_CLOUD_NAME` | Admin képfeltöltés a Forge storage-ra megy (lassabb), nincs auto WebP/AVIF | Ingyenes: https://cloudinary.com/users/register/free (25 GB tárhely + 25 GB sávszél/hó) |
| `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `RESEND_NOTIFY_EMAIL` | Contact / audit / hírlevél form-ok DB-be mennek, de email-értesítés nincs | Ingyenes: https://resend.com/signup (3000 email/hó). DEV: `onboarding@resend.dev` OK; PROD: hitelesített saját domain kell |
| `RESEND_WEBHOOK_SECRET` | Hírlevél kampány-stat (megnyitás, kattintás, bounce) nem mérhető — `/admin/newsletter/campaigns` „stat" gombja 0-kat mutat | Resend Dashboard → Webhooks → **Add Endpoint** → URL: `https://g2amarketing.hu/api/webhooks/resend`, Events: minden `email.*` típus. A „Signing Secret" (whsec_...) → `RESEND_WEBHOOK_SECRET` env. Részletek: 1.c szekció |
| `OPENAI_API_KEY` | Admin AI gombok ("AI: blog draft", "AI: SEO meta") szürkék | https://platform.openai.com/api-keys — default `gpt-4o-mini` (~5 HUF/draft, ~0.5 HUF/SEO meta). Felülírható: `OPENAI_MODEL=gpt-4o` |
| `BUILT_IN_FORGE_API_KEY` | Manus Forge értesítés nem megy (ha Resend van, nincs hatása) | Manus Forge — ha Resend be van állítva, ez már nem szükséges |

### ⚠ Dev-only

```
DEV_ADMIN_BYPASS=false   # Production-ben MINDIG false/üres
```
A bypass csak akkor aktiválódik, ha `NODE_ENV=development` **ÉS** `DEV_ADMIN_BYPASS=true`. Production build `NODE_ENV=production`-ra állítja, így első szinten is deaktív — mégis hagyd false-n, double safety.

### Env doctor

Bármikor lefuttatható audit:

```bash
node scripts/check-env.mjs           # csak figyelmeztet a hiányzó OAuth-ra
node scripts/check-env.mjs --prod    # strict — minden hiányzó kötelező = exit 1
```
A `--prod` mód CI/CD-ben használandó deploy előtt.

---

## 1.b Manus OAuth setup — lépésről lépésre

A 4 OAuth változó (`VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`) nélkül **a /admin elérhetetlen** production-ben (a publikus oldalak működnek).

### 1. lépés — App Registration a Manus felületén

1. Lépj be a Manus Cloud konzolba.
2. **Settings → App Registration → Create App**.
3. Töltsd ki:
   - **App Name**: `G2A Marketing` (csak a Manus dashboardon látszik)
   - **Redirect URI**: `https://g2amarketing.hu/api/oauth/callback`
   - *Lokális teszthez vegyél fel másodikat*: `http://localhost:3000/api/oauth/callback`
   - **Login Methods**: aminek be akarsz engedni belépni (email/Google/stb.)
4. Mentés után a Manus kiad három értéket — másold be őket az `.env`-be:

   | Manus mező | `.env` változó |
   |---|---|
   | App ID | `VITE_APP_ID` |
   | OAuth Portal URL (frontend redirect) | `VITE_OAUTH_PORTAL_URL` |
   | OAuth Server URL (backend token endpoint) | `OAUTH_SERVER_URL` |

### 2. lépés — Az `OWNER_OPEN_ID` megszerzése

Az `OWNER_OPEN_ID` az a Manus user, akinek **első belépéskor automatikusan admin** szerepkört adunk. Manus felületén ez a `openId` mező — de nincs mindig nyilvánvaló helyen, ezért épített eszköz van rá:

1. Indítsd el a szervert (akár `OWNER_OPEN_ID=` üresen).
2. Nyisd meg `https://g2amarketing.hu/admin` (vagy `http://localhost:3000/admin`).
3. Jelentkezz be Manus-szal — a callback létrehoz egy session cookie-t.
4. Hívd meg ugyanabból a böngészőből: `https://g2amarketing.hu/api/_diag/me`
5. A JSON `openId` mezőjét másold az `.env`-be `OWNER_OPEN_ID=` után.
6. Indítsd újra a szervert — innentől ez a user `role=admin`.

> 💡 Az `/api/_diag/me` endpoint csak a saját openId-det adja vissza — nem szivárogtat secret-et, production-ban is bekapcsolva maradhat. 401-et ad, ha nincs aktív session.

### 3. lépés — Verifikálás

```bash
node scripts/check-env.mjs --prod    # mind a 4 OAuth változó zöld?
```

Manuálisan a böngészőben:
- `/admin` → ne legyen sárga `DEV MODE` banner
- `/api/_diag/me` → `"role": "admin"` JSON-ban

Ha bármi `Forbidden` vagy `Invalid session` hibát kapsz: ellenőrizd hogy a Manus app redirect URI-je **pontosan** `/api/oauth/callback`-re mutat-e (nem `/api/oauth/callback/` slash-sel a végén).

---

## 1.c Resend webhook setup — kampány-stat (megnyitás, kattintás, bounce)

Hírlevél kampány-küldés (`/admin/newsletter/campaigns`) Resend-en megy. A **megnyitás / kattintás / bounce / spam-jelölés** statisztikákhoz be kell kötni a Resend webhook-ját — anélkül a stat gomb mindenhol 0-t mutat.

### 1. lépés — Webhook endpoint regisztrálása Resend-ben

1. Lépj be a [Resend Dashboard](https://resend.com/webhooks)-ba.
2. **Webhooks → Add Endpoint**.
3. Töltsd ki:
   - **Endpoint URL**: `https://g2amarketing.hu/api/webhooks/resend`
   - **Events**: jelöld be **mind** az alábbiakat: `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`, `email.delivery_delayed`
4. **Create**.
5. A létrehozott endpoint oldalán másold ki a **Signing Secret**-et (`whsec_...` formátumú).

### 2. lépés — Env var beállítása

Vidd fel a Vercel projekthez (Settings → Environment Variables, **Production + Preview** mind a kettőre):

```
RESEND_WEBHOOK_SECRET=whsec_<base64-string-amit-Resend-ad>
```

Mentés után a Vercel automatikusan újraépít.

### 3. lépés — Verifikáció

1. A Resend webhook oldalán kattints a **Send test event** gombra.
2. A G2A admin felületen `/admin/newsletter/campaigns` → bármelyik kampány „stat" gombja → ha az értékek 0 vannak, az még normális teszt-eseménynél (a teszt-eseményhez nem tartozik valós kampány-tag).
3. Indíts el egy valós teszt-kampányt magadnak (test send → utána sendCampaign 1 fős szegmensen). 5-30 másodpercen belül a webhook-történet rögzítődik a Resend-ben (látható: Webhook → Recent deliveries → 200 status).
4. Az admin „stat" gombnál a **Kézbesítve = 1**, és ha megnyitod, **Megnyitva = 1**. Kattints egy linkre, **Kattintva = 1** is megjelenik.

### Kapcsolódó szabályozási megjegyzés

A megnyitás-követés (open tracking) a Resend-ben alapból bekapcsolt: 1×1 átlátszó pixelt szúr be minden HTML email aljára. Az EU ePrivacy értelmezés szerint ez egy „technikai sütihez hasonló" tracker — a hírlevél-feliratkozási űrlapon a felhasználó már hozzájárult ehhez (l. /adatvedelmi-iranyelvek 4.3 pont). Production-ben **nincs külön consent banner** szükséges a megnyitás-követéshez, mert a feliratkozás aktusa már fedi.

---

## 2. Adatbázis migrációk

Új DB-re inicializálás:

```bash
# Környezet: DATABASE_URL be van állítva
node scripts/run-migrations.mjs       # Táblák létrehozása (drizzle SQL-ek)
node --env-file=.env scripts/seed.mjs  # Alap seed adatok
node --env-file=.env scripts/seed-case-studies.mjs  # Esettanulmányok
```

Meglévő DB-re (séma-frissítéskor): `node scripts/run-migrations.mjs` idempotens, meglévő oszlopokat skipeli.

---

## 3. Sitemap regenerálás

Ha új oldal vagy szolgáltatás kerül a site-ra, frissítsd a sitemap.xml-t:

```bash
node scripts/generate-sitemap.mjs
```

Kimenet: `client/public/sitemap.xml` — 35 path × 3 nyelv = 105 URL, hreflang alternates-szel.

---

## 4. Build

```bash
pnpm build
# kimenet:
#   dist/public/  — kliens bundle (Vite → Express serve)
#   dist/index.js — szerver (esbuild bundle)
```

Ellenőrzés build után:

- ✅ `dist/index.js` létezik (~77KB)
- ✅ `dist/public/index.html` létezik
- ✅ `dist/public/assets/index-*.js` bundle (~300KB gzip)
- ✅ TypeScript: `pnpm check` → 0 hiba

---

## 5. Éles indítás

```bash
NODE_ENV=production node dist/index.js
```

Vagy Manus Cloud deploy: `pnpm start` parancs a package.json-ban már konfigurálva van.

### 5.b Vercel deploy (staging / preview)

A repo Vercel-kompatibilis: `vercel.json` + `api/[[...path]].ts` katchall serverless function + `dist/public/` static export.

#### Első deploy

```bash
# Egyszer telepítsd a Vercel CLI-t globálisan
npm i -g vercel

# A repo gyökerében:
vercel login              # GitHub / Email / SSO bejelentkezés
vercel                    # interaktív első setup — válaszd: New project, scope, name
```

#### Env vars beállítása

A `.env` változókat a Vercel dashboardon vagy CLI-n kell felvinni:

```bash
# Egyenként:
vercel env add DATABASE_URL production
# (paste-elsd a TiDB Cloud connection string-et)

vercel env add JWT_SECRET production
vercel env add OPENAI_API_KEY production
# ... mind a többi a .env-ből
```

Vagy gyorsabban: **Vercel dashboard → Project → Settings → Environment Variables → "Bulk Edit"** → másold be az egész `.env` tartalmat.

**FONTOS:**
- A `VITE_*` prefixű változókat **build-time** veszik fel — minden ilyen változónál legyen `Environment` = `Production` ÉS `Preview` ÉS `Development` (mind a 3 csekkbox)
- A backend változókat (DATABASE_URL stb.) elég csak `Production`-ben

#### Subsequent deploy

```bash
vercel              # preview deploy (random URL pl. g2a-web-xyz.vercel.app)
vercel --prod       # éles deploy (a beállított production domain-re)
```

Vagy GitHub integráció — minden push automatikusan deployol egy preview URL-t.

#### Vercel limitációk amit tudni kell

| Limitáció | Hatás | Megoldás |
|---|---|---|
| **10s function timeout** (Hobby) / 30s (Pro) | Bulk Resend kampány >15-20 feliratkozónak time-out-ol | Pro tier ($20/hó) vagy queue-alapú worker (későbbre) |
| **Stateless serverless** | Az in-memory rate limiter cold-start után reset → bot 5+5+5 küldést tud csinálni gyors egymás után | Staging-re OK; production-höz Upstash Redis-t kell adni |
| **4.5 MB body limit** | Admin képfeltöltés base64-en >3 MB-os képpel hibázik | A "AI image" gomb és Cloudinary direct upload nem érinti |
| **Cold start ~500-1000ms** | Első request idle után lassú | Üzemmenetessé válik forgalom alatt |

#### Verifikálás deploy után

- `https://<deploy-url>/` → magyar főoldal
- `https://<deploy-url>/en/` → angol
- `https://<deploy-url>/admin` → DEV bypass nélkül 401 (várt) — Manus OAuth setup után jelentkezhetsz be
- `https://<deploy-url>/api/trpc/content.services?...` → DB-ből válaszol
- `https://<deploy-url>/api/_diag/me` → 401 (nincs session) — várt

Ha 500-as hiba: `vercel logs <deployment-url>` megmutatja a serverless function stderr-jét.

---



**Ellenőrzés indulás után:**

- `GET /` → 200, magyar főoldal
- `GET /en` → 200, angol főoldal
- `GET /zh` → 200, kínai főoldal
- `GET /api/trpc/content.services?input=...` → DB-ből válaszol
- `GET /admin` → OAuth redirect (vagy 401, ha nincs cookie)

---

## 6. DNS / Domain

Éles domain `g2amarketing.hu` bekötése:

1. **Manus Cloud**: Settings → Domains → Add custom domain
2. **DNS szolgáltatónál**: CNAME `g2amarketing.hu` → `<manus-cloud-hostname>`
3. **SSL**: Manus automatikusan ad Let's Encrypt tanúsítványt
4. **Tesztelés**:
   - https://g2amarketing.hu/ (200)
   - https://www.g2amarketing.hu/ → redirect non-www-ra (HSTS-kompatibilis)
   - https://g2amarketing.hu/admin → Manus OAuth login

---

## 7. Google Search Console

1. https://search.google.com/search-console → Add property
2. DNS TXT verifikáció (Manus Cloud adja a rekordot)
3. Submit sitemap: `https://g2amarketing.hu/sitemap.xml`
4. Külön propertyk: ha a **`/en`** és **`/zh`** nyelvi verziókat is külön monitoroznád (Google Search Console támogatja az URL-prefix property-ket).

### Hreflang ellenőrzés
A deploy után pár órán belül Googe Search Console → International Targeting → Language tab-on validálja a hreflang cross-linkeket. Ha hibát jelez, ellenőrizd hogy minden oldal `<link rel="alternate" hreflang="..." />` tag-jei ugyanarra mutatnak-e.

---

## 8. Analytics (opcionális)

A kódban van Umami analytics placeholder (`%VITE_ANALYTICS_ENDPOINT%` a `client/index.html`-ben). Ha használni akarod:

```
VITE_ANALYTICS_ENDPOINT=https://analytics.yourdomain.com
VITE_ANALYTICS_WEBSITE_ID=abcd1234-...
```

Ha nem kell, ezek a placeholder-ek warningot dobnak build-kor, de a build lefut.

---

## 9. Production-only ellenőrzések

Utolsó gyors audit éles indítás előtt:

- [ ] `.env` tartalmaz minden kötelező változót
- [ ] `DEV_ADMIN_BYPASS=false` (vagy sor eltávolítva)
- [ ] Manus OAuth app regisztrálva és a redirect URI stimmel
- [ ] DeepL kulcs (ha használjuk) → `/admin/services` szerkesztőben `HU → EN` gomb élénk zöld
- [ ] Cloudinary konfigurált → admin képfeltöltés `provider: "cloudinary"` választ ad (nem `"forge"`); case study képek `res.cloudinary.com`-ról jönnek
- [ ] Resend konfigurált → kapcsolat / audit form küldés után érkezik értesítés `RESEND_NOTIFY_EMAIL`-re; PROD-ban `RESEND_FROM_EMAIL` saját hitelesített domain (nem `onboarding@resend.dev`)
- [ ] OpenAI kulcs (ha használjuk) → `/admin/posts/new` jobb felső sarokban a "AI: blog draft" gomb lila (nem szürke)
- [ ] OG image preview (Facebook Sharing Debugger / LinkedIn Post Inspector) — 1200×630-as Cloudinary URL-t mutat, nem WP-t
- [ ] `dist/` build friss
- [ ] Admin dashboard elérhető login után, nincs sárga `DEV MODE` banner
- [ ] WeChat QR kép a helyén: `client/public/wechat-qr.png`
- [ ] Sitemap naprakész (`node scripts/generate-sitemap.mjs` utoljára lefutott)
- [ ] `robots.txt` production-like (nincs `Disallow: /`)
- [ ] Case study képek **NEM** a `client/public/case-studies/`-ból szolgálódnak (a mappa törölve van) — minden URL `https://res.cloudinary.com/...` formátumú

---

## 10. Kapcsolat / hibaelhárítás

- **Adatbázis timeout**: TiDB free tier cold-start lehet ~3s. Első request néha lassú; utána warm.
- **OAuth callback 404**: az Express `oauth.ts` regisztrálja `/api/oauth/callback`-et; ellenőrizd hogy a Manus app redirect URI-je **pontosan** ezt a path-ot tartalmazza.
- **Admin access denied "nem admin"**: a `users` táblában manuálisan állítsd át a saját openId-dhez tartozó `role`-t `admin`-ra, vagy jelentkezz ki-be (az első belépésnél `OWNER_OPEN_ID`-s user auto-admin lesz).
- **hreflang hiba Google-ben**: ellenőrizd a `SeoHead.tsx` canonicalUrl számítását — kézi `canonicalUrl` prop felülírja az autót, vigyázz velük.

Kérdés esetén: Győrfi Attila — info@g2amarketing.hu
