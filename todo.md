# G2A Marketing – Project TODO

## Adatbázis séma
- [x] users tábla (meglévő, admin role)
- [x] pages tábla (SEO meta, tartalom)
- [x] posts tábla (blog cikkek)
- [x] categories tábla (blog kategóriák)
- [x] services tábla (szolgáltatások)
- [x] testimonials tábla (vélemények)
- [x] partners tábla (partnerek logókkal)
- [x] contact_submissions tábla (kapcsolati üzenetek)
- [x] newsletter_subscribers tábla (feliratkozók)
- [x] hero_slides tábla (hero slideshow)
- [x] site_settings tábla (globális beállítások)
- [x] industries tábla (szakterületek)
- [x] technologies tábla (technológiák)
- [x] values tábla (értékek accordion)

## Backend API (tRPC)
- [x] Publikus: oldalak lekérdezése (SEO meta)
- [x] Publikus: blog cikkek listája (lapozással, kategória szűrővel)
- [x] Publikus: egyedi blog cikk lekérdezése
- [x] Publikus: kategóriák listája
- [x] Publikus: szolgáltatások listája
- [x] Publikus: testimonials listája
- [x] Publikus: partnerek listája
- [x] Publikus: hero slides listája
- [x] Publikus: site settings lekérdezése
- [x] Publikus: industries listája
- [x] Publikus: technologies listája
- [x] Publikus: values listája
- [x] Publikus: kapcsolati form küldése (+ admin email értesítés)
- [x] Publikus: newsletter feliratkozás (+ admin email értesítés)
- [x] Admin: blog cikk CRUD
- [x] Admin: kategória CRUD
- [x] Admin: szolgáltatás CRUD
- [x] Admin: testimonial CRUD
- [x] Admin: partner CRUD
- [x] Admin: hero slide CRUD
- [x] Admin: industry CRUD
- [x] Admin: technology CRUD
- [x] Admin: value CRUD
- [x] Admin: kapcsolati üzenetek listája
- [x] Admin: newsletter feliratkozók listája
- [x] Admin: oldal SEO meta szerkesztése
- [x] Admin: site settings szerkesztése
- [x] Admin: képfeltöltés S3-ra (CDN)

## Frontend – Globális
- [x] Globális CSS stílus (sötét téma, #1a1a1a, #e91130, Roboto Mono)
- [x] Navigáció (header, dropdown menü, mobil hamburger)
- [x] Footer (elérhetőségek, linkek, social ikonok)
- [x] Cookie consent banner
- [x] SEO Head komponens (meta title, description, OG tags, JSON-LD)
- [x] 404 oldal

## Frontend – Főoldal
- [x] Hero slideshow szekció
- [x] Idézet szekció
- [x] About szekció
- [x] Szolgáltatások szekció (7 kártya)
- [x] Szakterületek szekció (iparágak grid)
- [x] Értékek accordion szekció
- [x] Vélemények szekció
- [x] Partnerek logo slider
- [x] Newsletter feliratkozás form

## Frontend – Szolgáltatás oldalak (7 db)
- [x] Lokalizáció aloldal
- [x] Arculattervezés aloldal
- [x] Hirdetéskezelés aloldal
- [x] Közösségi Média aloldal
- [x] Stratégiai Marketing aloldal
- [x] Keresőoptimalizálás aloldal
- [x] Webfejlesztés aloldal

## Frontend – Egyéb oldalak
- [x] Szakértelem oldal (iparágak grid)
- [x] Technológia oldal (tech logók)
- [x] Partnereink oldal (partner referenciák)
- [x] Kapcsolat oldal (form + elérhetőségek)
- [x] Adatvédelmi irányelvek oldal
- [x] Blog lista oldal (lapozással, kategória szűrővel)
- [x] Blog cikk oldal

## Admin panel
- [x] Admin bejelentkezés (Manus OAuth)
- [x] Dashboard (statisztikák)
- [x] Blog cikkek kezelése (lista, létrehozás, szerkesztés, törlés)
- [x] Kategóriák kezelése
- [x] Szolgáltatások kezelése
- [x] Testimonials kezelése
- [x] Partnerek kezelése
- [x] Hero slides kezelése
- [x] Iparágak kezelése
- [x] Technológiák kezelése
- [x] Értékek kezelése
- [x] Kapcsolati üzenetek megtekintése
- [x] Newsletter feliratkozók listája
- [x] Oldal SEO meta szerkesztése
- [x] Site settings szerkesztése
- [x] Képfeltöltés CDN-re (ImageUploader komponens: blog, hero, partnerek)

## SEO / AEO
- [x] sitemap.xml
- [x] robots.txt
- [x] JSON-LD schema (Organization, WebSite, Service, Article)
- [x] Open Graph meta tagek
- [x] Canonical URL-ek
- [x] WebP képek alt szövegekkel

## Értesítések
- [x] Kapcsolati form → admin email értesítés
- [x] Newsletter feliratkozás → admin email értesítés

## Tesztelés
- [x] auth.logout teszt
- [x] auth.me teszt (hitelesített és nem hitelesített)
- [x] content.services teszt
- [x] content.posts teszt (lapozás, kategória szűrő)
- [x] content.categories teszt
- [x] content.partners teszt
- [x] content.testimonials teszt
- [x] content.heroSlides teszt
- [x] contact.submit teszt
- [x] newsletter.subscribe teszt
- [x] admin access control tesztek (3 db)
- [x] Összes teszt átment: 16/16 ✓

## V2 – Prémium B2B Modernizáció

### Globális stílus
- [x] Dark/light mode kapcsoló implementálása
- [x] Scroll progress indicator (piros vonal a teten)n)
- [x] Smooth scroll animációk (framer-motion fade-in on scroll)
- [x] Sticky CTA gomb (lebegő "Ingyenes Audit" gomb)
- [x] Roboto Mono + Inter/Outfit kombinált tipográfia

### Főoldal újraírása
- [x] Hero szekció – erős headline, motion design háttér, bizalmi elemek (ügyfélloggók, projektek száma, iparágak)- [x] "Kinek segítünk" szekció – 8 iparági blokk kártyákkal
- [x] Szolgáltatások probléma-alapú megjelenítéssel (6 probléma blokk)
- [x] Esettanulmányok mini preview (3 kiemelt case study)
- [x] AI és innováció szekció
- [x] "Miért minket válassz" szekció – 8 érv
- [x] Ingyenes marketing audit szekció – lead form
- [x] Testimonials frissítése
- [x] Partner loggók slider
### Új aloldalak
- [x] Rólunk oldal (About page)
- [x] Ingyenes Marketing Audit oldal
- [x] AI Marketing oldal
- [x] PPC / Google Ads oldal
- [x] Meta Hirdetések oldal
- [x] Tartalommarketing oldal
- [x] Marketing Automatizáció oldal
- [x] ESG Kommunikáció oldal
- [x] Employer Branding oldal
- [x] Nemzetközi Marketing oldal
- [x] Referenciák / Esettanulmányok oldal iparági szűrővel

### Iparági SEO landing oldalak (8 db)
- [x] Marketing egészségügyi cégeknek
- [x] Marketing szépségipari cégeknek
- [x] Marketing mérnöki irodaknak
- [x] Marketing autóipari cégeknek
- [x] Marketing ügyvédi irodaknak
- [x] Marketing technológiai cégeknek
- [x] Marketing önkormányzati projekteknek
- [x] Marketing B2B cégeknek

### Backend bővítés
- [x] Case studies adatbázis tábla és admin kezelés
- [x] Audit leads adatbázis tábla és admin kezelés
- [x] GTM/GA4 script integráció (admin beállítható)
- [x] Többnyelvűség előkészítés (hu/en route struktúra – hu route struktúra kész, en bővíthető)

### Navigáció frissítése
- [x] Mega menü Szolgáltatásokhoz (összes aloldal)
- [x] Iparágak dropdown a navigációban

## V2 Elvégzett feladatok

- [x] Rólunk oldal (csapat, értékek, időszalag, CTA)
- [x] Ingyenes Marketing Audit oldal (form, folyamat, tartalom)
- [x] Referenciák / Esettanulmányok oldal (6 case study, iparági szűrő)
- [x] 8 iparági SEO landing oldal (egészségügy, szépségipar, mérnöki, autóipar, ügyvédi, tech, önkormányzat, B2B)
- [x] Navigation frissítve – Rólunk, Iparágak dropdown, Ingyenes Audit CTA
- [x] App.tsx frissítve – összes új route
- [x] sitemap.xml frissítve – 30+ URL
- [x] Tesztek frissítve – 21/21 zöld
- [x] TypeScript 0 hiba
- [x] Scroll progress indicator
- [x] Scroll reveal animációk
- [x] Dark/light mode kapcsoló (switchable ThemeProvider)
- [x] Roboto Mono + Inter/Outfit kombinált tipográfia

## V2 Legújabb elvégzett feladatok (2026-04-08 – 2. kör)

- [x] case_studies és audit_leads adatbázis táblák létrehozva
- [x] Case studies DB helpers és tRPC routerek (admin + publikus)
- [x] Audit leads DB helpers és tRPC routerek (admin.auditLeads + audit.submit)
- [x] AuditPage frissítve – audit.submit router használata
- [x] AdminCaseStudies oldal (CRUD, ImageUploader, SEO mezők)
- [x] AdminAuditLeads oldal (lista, kapcsolatba lépett jelölés, törlés)
- [x] AdminLayout frissítve – Esettanulmányok és Audit Kérések menüpontok
- [x] AdminSettings frissítve – GTM ID, GA4 ID, Meta Pixel ID, Google Search Console
- [x] index.html frissítve – Roboto Mono, JSON-LD Organization schema, Open Graph, lang="hu", GTM placeholder
- [x] App.tsx frissítve – AdminCaseStudies és AdminAuditLeads route-ok
- [x] 21/21 vitest teszt zöld
- [x] TypeScript 0 hibával fordult le

## V5 – Hibajavítások és Kétnyelvűség

- [ ] Responsive CSS javítás – asztali és mobil layout túlfolyás megszüntetése
- [ ] Szöveg és blokk csúszások javítása minden oldalon
- [ ] Emoji eltávolítás az összes oldalról (NewServicePage, Home, stb.)
- [ ] Footer linkek kattinthatóvá tétele (wouter Link komponens)
- [ ] Referenciák / Esettanulmányok seed adatok pótlása az adatbázisba
- [ ] Referenciák oldal megjelenítés javítása
- [ ] Kétnyelvűség (HU/EN) – i18n rendszer implementálása
- [ ] Nyelvválasztó gomb a navigációban
- [ ] Angol fordítások az összes főbb oldalhoz
- [ ] URL struktúra: /en/* és /hu/* (vagy lang paraméter)
