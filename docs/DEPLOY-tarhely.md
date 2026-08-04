# Telepítés tarhely.eu-ra (cPanel + Passenger)

*A g2amarketing.hu új (React + Node) oldalának élesítése a tarhely.eu-n. A kód már Passenger-kész (commit 944d8b8).*

A munka két oldalon zajlik: **helyi build** (a gépeden / itt) → **feltöltés + cPanel-beállítás** (a te tárhelyeden). A szerveren NEM buildelünk (kevés a memória) — a kész `dist/`-et töltjük fel.

---

## 0. Előfeltétel — Node.js támogatás
cPanel → keresd a **„Setup Node.js App"** menüt. Ha nincs, nyiss egy support-ticketet, hogy kapcsolják be. Jegyezd fel a választható **Node-verziót** (18 vagy 20 LTS ideális).

## 1. MySQL adatbázis létrehozása
cPanel → **MySQL® Databases**:
1. Hozz létre egy adatbázist (pl. `g2a_prod`).
2. Hozz létre egy felhasználót erős jelszóval.
3. Rendeld a felhasználót az adatbázishoz **ALL PRIVILEGES** joggal.
4. Jegyezd fel: **host** (általában `localhost`), **db-név**, **user**, **jelszó**.

> A `DATABASE_URL` ebből: `mysql://<user>:<jelszó>@<host>:3306/<db>` (a jelszóban a speciális karaktereket URL-kódold).

## 2. Adatok átköltöztetése (TiDB → tarhely.eu MySQL)
A jelenlegi adatok a TiDB Cloudon vannak. Két út:
- **Ajánlott:** kapsz tőlem egy `g2a_dump.sql`-t (szerkezet + adat). cPanel → **phpMyAdmin** → válaszd a `g2a_prod`-ot → **Import** → töltsd fel a `.sql`-t.
- **Vagy:** a Node-app első indítása előtt `npm run db:push` (drizzle) létrehozza a szerkezetet, és külön adat-másoló scripttel visszük át a sorokat.

## 3. A build feltöltése
Helyben (itt) lefut: `npm run build` → létrejön a `dist/` (server-bundle + `dist/public/` a prerender-elt oldalakkal). Feltöltendő az app gyökerébe:
- `dist/` (a teljes mappa)
- `package.json` + `pnpm-lock.yaml` (a függőségekhez)
- `.env` **NE** — a titkokat a cPanel env-mezőin át add meg (4. lépés)

Feltöltés: cPanel **File Manager** (zip-feltöltés + kicsomagolás) vagy FTP/SFTP.

## 4. Node.js app létrehozása
cPanel → **Setup Node.js App** → **Create Application**:
- **Node version:** 18/20 LTS
- **Application mode:** Production
- **Application root:** ahova a fájlokat töltötted (pl. `g2a_app`)
- **Application URL:** g2amarketing.hu (vagy előbb egy aldomain, lásd 7.)
- **Application startup file:** `dist/index.js`
- **Port:** ha kéri, `0` (a Passenger kezeli)

Mentés után a felület ad egy **„Enter to the virtual environment"** parancsot. Abban:
```
npm install --omit=dev
```
(csak a futásidejű függőségek — a build-eszközök nem kellenek a szerverre.)

## 5. Környezeti változók (Environment variables)
A Node.js App felületén add hozzá (Vercel-ről átemelve + az újak):

| Változó | Érték |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | a 1. pont szerinti MySQL-URL |
| `JWT_SECRET` | 32+ karakter random (erős!) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | a tulajdonos belépése (erős jelszó) |
| `RESEND_API_KEY` | a Resend kulcs |
| `RESEND_FROM_EMAIL` | `G2A Marketing <noreply@g2amarketing.hu>` |
| `RESEND_NOTIFY_EMAIL` | `info@g2amarketing.hu` |
| `RESEND_WEBHOOK_SECRET` | a Resend-webhook signing secret |
| `CRON_SECRET` | erős random (a cron-okhoz) |
| `OPENAI_API_KEY`, `OPENAI_BLOG_MODEL` | AI blog |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | képek |
| `DEEPL_API_KEY` | fordítás (opcionális) |

Mentés → **Restart** az appon.

## 6. Cron-ok (a Vercel-cronok pótlása)
cPanel → **Cron Jobs**. Mindegyik a `CRON_SECRET`-tel hívja a végpontot. Cseréld a `<SECRET>`-et:

```bash
# Heti hírlevél-digest — péntek 7:00
0 7 * * 5 curl -s -H "Authorization: Bearer <SECRET>" https://g2amarketing.hu/api/cron/weekly-digest

# Automatizmus-motor (nurture + churn) — naponta 8:00
0 8 * * * curl -s -H "Authorization: Bearer <SECRET>" https://g2amarketing.hu/api/cron/automations

# Időzített kampányok (pl. a launch-email) — 10 percenként
*/10 * * * * curl -s -H "Authorization: Bearer <SECRET>" https://g2amarketing.hu/api/cron/scheduled-campaigns
```
*(A `scheduled-campaigns` végpontot a launch-emailhez külön bekötöm.)*

## 7. Tesztelés élesítés ELŐTT (aldomainen)
Erősen ajánlott: előbb egy **aldomainen** (pl. `uj.g2amarketing.hu`) állítsd be az app URL-jét, és nézd végig:
- Betölt a főoldal, működik a nyelvváltás, a formok, az admin-belépés.
- Egy prerender-elt oldal (pl. `/kapcsolat`) forrásában jó a `<title>`.
- Egy teszt-form beküldés → megérkezik az email.

Csak ha minden zöld, jön a 8. lépés.

## 8. DNS-átállás
A DNS-t átirányítod a tarhely.eu app-jára (a régi WordPress helyett). A cPanel-en belüli hostingnál ez általában az **A-rekord** / a domain hozzárendelése az app URL-jéhez. A terjedés pár óráig tarthat.

## 9. Élesítés utáni ellenőrzés
- `RESEND_WEBHOOK_SECRET` be van-e állítva → a Resend-webhook (már a `g2amarketing.hu/api/webhooks/resend`-re mutat) magától élesedik → lead-pontozás + churn indul.
- A cron-ok futnak-e (nézd a cPanel cron-logot / a végpontok válaszát).
- 404-redirectek (pl. `/marketing-audit`), sitemap, RSS.
- Mérőeszközök: a GTM-playbook szerinti ellenőrzés (most már challenge-mód nélkül, tisztán mérhető).

---

### Megjegyzések
- **Backup:** a régi WordPress-mentés megvan (cPanel). Az új app adatai a MySQL-ben + a kód a GitHubon.
- **Frissítés a jövőben:** helyben `npm run build` → a `dist/` feltöltése → az appon **Restart**.
- **Ha a build a szerveren fut ki a memóriából:** mindig helyben buildelj, csak a `dist/`-et töltsd fel.
