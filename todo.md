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
- [ ] Admin: képfeltöltés S3-ra (CDN)

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
- [ ] Képfeltöltés CDN-re (jövőbeli fejlesztés)

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
