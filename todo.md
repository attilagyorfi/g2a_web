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
- [ ] Dark/light mode kapcsoló implementálása
- [ ] Scroll progress indicator (piros vonal a tetején)
- [ ] Smooth scroll animációk (framer-motion fade-in on scroll)
- [ ] Sticky CTA gomb (lebegő "Ingyenes Audit" gomb)
- [ ] Roboto Mono + Inter/Outfit kombinált tipográfia

### Főoldal újraírása
- [ ] Hero szekció – erős headline, motion design háttér, bizalmi elemek (ügyféllogók, projektek száma, iparágak)
- [ ] "Kinek segítünk" szekció – 8 iparági blokk kártyákkal
- [ ] Szolgáltatások probléma-alapú megjelenítéssel (6 probléma blokk)
- [ ] Esettanulmányok mini preview (3 kiemelt case study)
- [ ] AI és innováció szekció
- [ ] "Miért minket válassz" szekció – 8 érv
- [ ] Ingyenes marketing audit szekció – lead form
- [ ] Testimonials frissítése
- [ ] Partner logók slider

### Új aloldalak
- [ ] Rólunk oldal (About page)
- [ ] Ingyenes Marketing Audit oldal
- [ ] AI Marketing oldal
- [ ] PPC / Google Ads oldal
- [ ] Meta Hirdetések oldal
- [ ] Tartalommarketing oldal
- [ ] Marketing Automatizáció oldal
- [ ] ESG Kommunikáció oldal
- [ ] Employer Branding oldal
- [ ] Nemzetközi Marketing oldal
- [ ] Referenciák / Esettanulmányok oldal iparági szűrővel

### Iparági SEO landing oldalak (8 db)
- [ ] Marketing egészségügyi cégeknek
- [ ] Marketing szépségipari cégeknek
- [ ] Marketing mérnöki irodáknak
- [ ] Marketing autóipari cégeknek
- [ ] Marketing ügyvédi irodáknak
- [ ] Marketing technológiai cégeknek
- [ ] Marketing önkormányzati projekteknek
- [ ] Marketing B2B cégeknek

### Backend bővítés
- [ ] Case studies adatbázis tábla és admin kezelés
- [ ] Audit leads adatbázis tábla és admin kezelés
- [ ] GTM/GA4 script integráció (admin beállítható)
- [ ] Többnyelvűség előkészítés (hu/en route struktúra)

### Navigáció frissítése
- [ ] Mega menü Szolgáltatásokhoz (összes aloldal)
- [ ] Iparágak dropdown a navigációban

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
