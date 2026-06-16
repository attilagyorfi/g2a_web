/**
 * Általános Szerződési Feltételek (ÁSZF) / Terms of Service / 服务条款
 *
 * B2B-fókuszú, de tartalmaz B2C-rendelkezéseket is (eltérő szakaszok jelölve)
 * a Ptk., 45/2014. (II. 26.) Korm. rendelet (fogyasztói távollévők közötti
 * szerződések), a 2001. évi CVIII. törvény (Eker. tv.) és a 2008. évi
 * XLVII. törvény (Fttv.) követelményei szerint.
 *
 * Update LAST_UPDATED on any material change. The company-identification
 * block is shared with PrivacyPage; keep them in sync if the registry
 * details change.
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { breadcrumbSchema } from "@/lib/jsonLd";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

const COMPANY_NAME = "G2A Marketing Bt.";
const COMPANY_FULL_ADDRESS = "7625 Pécs, Péter utca 1. fszt. 1.";
const COMPANY_REG_NUMBER = "02-06-075160";
const COMPANY_TAX_NUMBER = "32070325-1-02";
const REGISTRATION_COURT = "Pécsi Törvényszék Cégbírósága";
const EMAIL = "info@g2amarketing.hu";
const PHONE = "+36 30 190 2575";

const LAST_UPDATED_HU = "2026. május 5.";
const LAST_UPDATED_EN = "5 May 2026";
const LAST_UPDATED_ZH = "2026 年 5 月 5 日";

type AszfDoc = {
  label: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  intro: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
};

const DOCS: Record<Language, AszfDoc> = {
  // ────────────────────────────────────────────────────────────────────────
  hu: {
    label: "Jogi tájékoztató",
    title: "Általános Szerződési Feltételek",
    seoTitle: "Általános Szerződési Feltételek – G2A Marketing",
    seoDesc:
      "A G2A Marketing Bt. szolgáltatásaira vonatkozó általános szerződési feltételek (ÁSZF) — szerződéskötés, díjazás, szavatosság, panaszkezelés.",
    lastUpdatedLabel: "Hatályos:",
    lastUpdatedValue: LAST_UPDATED_HU,
    intro: (
      <>
        <p>
          Jelen Általános Szerződési Feltételek (a továbbiakban: „ÁSZF")
          szabályozzák a {COMPANY_NAME} (a továbbiakban: „Szolgáltató") és
          a Megrendelő közötti, a Szolgáltató marketing szolgáltatásai
          tárgyában létrejövő szerződéses kapcsolat általános feltételeit.
        </p>
        <p>
          Az ÁSZF a Polgári Törvénykönyvről szóló 2013. évi V. törvény
          (Ptk.), az elektronikus kereskedelmi szolgáltatásokról szóló
          2001. évi CVIII. törvény (Eker. tv.), a fogyasztó és a vállalkozás
          közötti szerződések részletes szabályairól szóló 45/2014. (II. 26.)
          Korm. rendelet, valamint a fogyasztókkal szembeni tisztességtelen
          kereskedelmi gyakorlat tilalmáról szóló 2008. évi XLVII. törvény
          (Fttv.) rendelkezéseinek figyelembevételével készült.
        </p>
        <p>
          A Megrendelő a megrendelés elküldésével (e-mailben, online űrlapon
          vagy aláírt szerződés visszaküldésével) elismeri, hogy az ÁSZF
          tartalmát megismerte, megértette és magára nézve kötelezőnek
          fogadja el.
        </p>
      </>
    ),
    sections: [
      {
        heading: "1. A Szolgáltató adatai",
        body: (
          <p>
            <strong>Cégnév:</strong> {COMPANY_NAME}
            <br />
            <strong>Székhely:</strong> {COMPANY_FULL_ADDRESS}
            <br />
            <strong>Cégjegyzékszám:</strong> {COMPANY_REG_NUMBER}
            <br />
            <strong>Nyilvántartó bíróság:</strong> {REGISTRATION_COURT}
            <br />
            <strong>Adószám:</strong> {COMPANY_TAX_NUMBER}
            <br />
            <strong>Képviselő:</strong> Győrfi Attila
            <br />
            <strong>E-mail:</strong>{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <br />
            <strong>Telefon:</strong>{" "}
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            <br />
            <strong>Tárhelyszolgáltató:</strong> Vercel Inc., 340 S Lemon Ave
            #4133, Walnut, CA 91789, USA — adattárolás Frankfurt (EU)
          </p>
        ),
      },
      {
        heading: "2. Az ÁSZF hatálya",
        body: (
          <>
            <p>
              <strong>Tárgyi hatály:</strong> az ÁSZF a Szolgáltató által
              nyújtott valamennyi marketing szolgáltatásra (keresőoptimalizálás,
              hirdetéskezelés, közösségi média, webfejlesztés, tartalommarketing,
              stratégiai marketing, AI-marketing, ESG kommunikáció, employer
              branding, nemzetközi marketing, valamint az ezekhez kapcsolódó
              kiegészítő szolgáltatásokra) kiterjed.
            </p>
            <p>
              <strong>Személyi hatály:</strong> az ÁSZF a Szolgáltató és a
              Megrendelő — legyen az gazdasági társaság, egyéni vállalkozó,
              költségvetési szerv, civil szervezet vagy fogyasztó (a Ptk.
              8:1. § (1) bek. 3. pontja szerint) — közötti szerződésekre
              alkalmazandó.
            </p>
            <p>
              <strong>Időbeli hatály:</strong> a fent megjelölt hatályosulási
              naptól kezdődően, a következő módosítás közzétételéig. A korábbi
              szerződésekre azok megkötésekor hatályos ÁSZF rendelkezései
              irányadók.
            </p>
            <p>
              A felek egyedi szerződésben az ÁSZF-től eltérhetnek; eltérés
              esetén az egyedi szerződés rendelkezései elsőbbséget élveznek.
            </p>
          </>
        ),
      },
      {
        heading: "3. Definíciók",
        body: (
          <ul>
            <li>
              <strong>Szolgáltató:</strong> {COMPANY_NAME}, az ÁSZF 1. pontja
              szerinti adatokkal.
            </li>
            <li>
              <strong>Megrendelő:</strong> az a természetes vagy jogi
              személy, jogi személyiség nélküli szervezet, aki/amely a
              Szolgáltatóval szerződést köt.
            </li>
            <li>
              <strong>Fogyasztó:</strong> a Ptk. 8:1. § (1) bek. 3. pontja
              szerinti, szakmája, önálló foglalkozása vagy üzleti tevékenysége
              körén kívül eljáró természetes személy.
            </li>
            <li>
              <strong>Szolgáltatás:</strong> a Szolgáltató ÁSZF 2. pont szerinti
              tevékenységei, ideértve a tanácsadási, kreatív és technikai
              kivitelezési munkákat.
            </li>
            <li>
              <strong>Egyedi szerződés:</strong> a felek közötti, írásban
              (papíron vagy elektronikusan), illetve e-mailben létrejött
              megállapodás, amely a konkrét szolgáltatás körét, díját és
              határidejét rögzíti.
            </li>
            <li>
              <strong>Munkaóra:</strong> a Szolgáltató munkatársának egy
              óra ráfordítása, kerekítve negyed órára.
            </li>
            <li>
              <strong>Sürgősségi felár:</strong> a 48 órán belüli
              megrendelésre vagy normál munkaidőn kívüli teljesítésre
              alkalmazott pótdíj.
            </li>
          </ul>
        ),
      },
      {
        heading: "4. A szolgáltatás megrendelése, a szerződés létrejötte",
        body: (
          <>
            <p>
              <strong>4.1.</strong> A Megrendelő a szolgáltatások iránti
              érdeklődést a Szolgáltató weboldalán elérhető űrlapon
              (kapcsolatfelvétel, ingyenes audit), e-mailben, telefonon
              vagy személyes egyeztetés útján jelezheti.
            </p>
            <p>
              <strong>4.2.</strong> A Szolgáltató az érdeklődés alapján
              díjmentes konzultációt tart, majd egyedi árajánlatot készít.
              Az árajánlat 30 napig érvényes, kivéve ha az ajánlat ettől
              eltérő érvényességi időt jelöl meg.
            </p>
            <p>
              <strong>4.3.</strong> A szerződés a felek közös akaratából
              jön létre, az alábbi módok valamelyikén:
            </p>
            <ul>
              <li>az árajánlat e-mailen történő, kifejezett (igen, megrendelem) elfogadásával;</li>
              <li>az írásban — papíron vagy elektronikus aláírással — kötött egyedi szerződés mindkét fél által aláírt példányának visszaérkezésével;</li>
              <li>a Szolgáltató által kiállított díjbekérő (proforma) megfizetésével (ráutaló magatartás).</li>
            </ul>
            <p>
              <strong>4.4.</strong> A Szolgáltató fenntartja a jogot, hogy
              indokolt esetben (pl. kapacitáshiány, érdekellentét, jogellenes
              tartalmú projekt) a megrendelést visszautasítsa.
            </p>
            <p>
              <strong>4.5.</strong> A szerződés tartalmát a felek között
              létrejött egyedi szerződés és jelen ÁSZF együttesen képezi.
              Eltérés esetén az egyedi szerződés rendelkezései az
              irányadók.
            </p>
          </>
        ),
      },
      {
        heading: "5. Szolgáltatási díjak, fizetési feltételek",
        body: (
          <>
            <p>
              <strong>5.1.</strong> A szolgáltatási díjat az egyedi szerződés
              vagy az elfogadott árajánlat tartalmazza. A díj nettó értéken
              kerül megállapításra; a hatályos ÁFA mindenkor a vonatkozó
              jogszabály (jelenleg az általános ÁFA-tv. szerinti 27%) alapján
              hozzáadódik.
            </p>
            <p>
              <strong>5.2. Számlázási modellek:</strong>
            </p>
            <ul>
              <li>
                <strong>Egyszeri (project-fee):</strong> a teljes díj 50%-a
                a megrendeléskor, fennmaradó 50% a teljesítés után.
              </li>
              <li>
                <strong>Havidíjas (retainer):</strong> előre, a tárgyhónap
                10. napjáig, banki átutalással.
              </li>
              <li>
                <strong>Hirdetési költség (Google Ads, Meta):</strong> a
                hirdetési platformnak közvetlenül a Megrendelő által fizetett
                költségek nem képezik a Szolgáltató díjazásának részét.
              </li>
            </ul>
            <p>
              <strong>5.3.</strong> A számlát a Szolgáltató elektronikus
              úton, NAV által befogadott elektronikus számlaként
              (Számlázz.hu vagy Billingo) állítja ki. A fizetési határidő
              — eltérő megállapodás hiányában — 8 naptári nap.
            </p>
            <p>
              <strong>5.4. Késedelem.</strong> Késedelmes fizetés esetén a
              Szolgáltató a Ptk. 6:155. § szerinti törvényes késedelmi
              kamatra és behajtási költségátalányra (a 2016. évi IX. törvény
              szerint) jogosult. Vállalkozások közötti szerződéseknél a
              késedelmi kamat mértéke a jegybanki alapkamat + 8 százalékpont.
              30 napon túli késedelem esetén a Szolgáltató a teljesítést a
              hátralék rendezéséig felfüggesztheti.
            </p>
            <p>
              <strong>5.5.</strong> A Megrendelő a számla ellen — az átvétel
              napjától számított 8 munkanapon belül — írásban kifogással
              élhet. Késedelmes kifogás esetén a számla elfogadottnak
              tekintendő.
            </p>
          </>
        ),
      },
      {
        heading: "6. Teljesítés, határidők",
        body: (
          <>
            <p>
              <strong>6.1.</strong> A Szolgáltató a szolgáltatást az egyedi
              szerződésben foglalt határidők és minőségi követelmények
              szerint nyújtja.
            </p>
            <p>
              <strong>6.2.</strong> A Megrendelő köteles a teljesítéshez
              szükséges adatokat, anyagokat, hozzáféréseket (pl. weboldal
              admin, hirdetési fiók) határidőre rendelkezésre bocsátani.
              A Megrendelő késedelme esetén a teljesítési határidő a
              Megrendelő késedelmével arányosan meghosszabbodik.
            </p>
            <p>
              <strong>6.3.</strong> A teljesítés helye a Szolgáltató
              székhelye, a teljesítés módja főszabály szerint elektronikus
              úton (e-mail, felhőszolgáltatás, webes admin felület).
            </p>
            <p>
              <strong>6.4. Részteljesítés:</strong> a Szolgáltató jogosult
              részteljesítésre, amennyiben az egyedi szerződés ezt
              megengedi. Részteljesítés esetén a részszámla az adott
              részmunkára vonatkozik.
            </p>
            <p>
              <strong>6.5. Átadás-átvétel:</strong> a Szolgáltató a
              teljesítésről írásban (e-mailben) értesíti a Megrendelőt.
              A Megrendelő 5 munkanapon belül köteles az átvételt
              megerősíteni vagy indokolt kifogást emelni; ennek elmaradása
              esetén a teljesítés elfogadottnak minősül.
            </p>
          </>
        ),
      },
      {
        heading:
          "7. Felmondás, elállás (fogyasztói külön-rendelkezésekkel)",
        body: (
          <>
            <p>
              <strong>7.1. Határozatlan idejű szerződés (havidíjas).</strong>{" "}
              Bármelyik fél írásban, 30 napos felmondási idővel, a hónap
              utolsó napjára felmondhatja a szerződést.
            </p>
            <p>
              <strong>7.2. Határozott idejű szerződés.</strong> Rendes
              felmondásra nincs lehetőség. Rendkívüli (azonnali) felmondás
              csak a másik fél súlyos szerződésszegése esetén, írásban,
              indokolással lehetséges (Ptk. 6:140. §).
            </p>
            <p>
              <strong>7.3. Súlyos szerződésszegés esetei:</strong> a fizetési
              kötelezettség 30 napot meghaladó elmulasztása; a teljesítéshez
              szükséges adatszolgáltatás 30 napot meghaladó elmulasztása;
              jogszabálysértő tartalom megrendelése.
            </p>
            <p>
              <strong>7.4. Fogyasztói elállási jog (csak fogyasztói
              megrendelő esetén).</strong> A 45/2014. (II. 26.) Korm. r. 20. §
              alapján a fogyasztó a szerződéskötéstől számított 14 napon
              belül indokolás nélkül elállhat. Ha a szolgáltatás teljesítése
              a 14 napos határidőn belül elkezdődött a fogyasztó kifejezett
              kérésére, az elállási jog a teljesítés befejezéséig gyakorolható;
              de a fogyasztó köteles megtéríteni a már teljesített szolgáltatás
              arányos díját.
            </p>
            <p>
              Az elállás bejelenthető e-mailben a {EMAIL} címen, vagy a
              45/2014. (II. 26.) Korm. r. 2. mellékletében szereplő
              minta-nyilatkozattal. A Szolgáltató 14 napon belül visszafizeti
              a fogyasztó által kifizetett összeget (kivéve az időarányos
              díjat).
            </p>
          </>
        ),
      },
      {
        heading: "8. Szerzői és felhasználási jogok",
        body: (
          <>
            <p>
              <strong>8.1.</strong> A Szolgáltató által készített szellemi
              alkotások (kreatív anyagok, szövegek, képek, kódok, stratégiai
              dokumentumok) szerzői jogi védelem alatt állnak.
            </p>
            <p>
              <strong>8.2.</strong> A Megrendelő — a teljes szolgáltatási díj
              maradéktalan megfizetését követően — területileg korlátlan,
              időben a Szolgáltató szerzői jogi védelmével azonos
              időtartamú, nem-kizárólagos felhasználási jogot szerez a
              megrendelt szellemi alkotás üzleti célú felhasználására.
            </p>
            <p>
              <strong>8.3.</strong> A teljes díj megfizetéséig a felhasználási
              jog átadása nem történik meg; a Szolgáltató jogosult a már
              közzétett anyagok eltávolítását kérni.
            </p>
            <p>
              <strong>8.4.</strong> A Szolgáltató fenntartja a jogot, hogy
              a Megrendelő részére készített munkáit referenciaként,
              esettanulmányként portfóliójában, weboldalán és közösségi
              média felületein bemutassa, kivéve ha a felek titoktartási
              megállapodást kötnek.
            </p>
            <p>
              <strong>8.5.</strong> A Megrendelő által átadott anyagok
              (logó, fotók, márkaarculati elemek) szerzői jogi tisztaságáért
              a Megrendelő szavatol.
            </p>
          </>
        ),
      },
      {
        heading: "9. Titoktartás",
        body: (
          <>
            <p>
              <strong>9.1.</strong> A felek a szerződéses kapcsolat során
              tudomásukra jutott üzleti titkokat (Ptk. 2:47. §) és bizalmas
              információkat — különösen pénzügyi adatok, ügyféllista,
              technológiai megoldások — kötelesek megőrizni.
            </p>
            <p>
              <strong>9.2.</strong> A titoktartás a szerződés megszűnését
              követő 5 évig fennáll.
            </p>
            <p>
              <strong>9.3.</strong> Nem minősül szerződésszegésnek, ha a
              fél jogszabály vagy hatósági határozat alapján köteles
              információt szolgáltatni.
            </p>
          </>
        ),
      },
      {
        heading: "10. Felelősség, kárfelelősség",
        body: (
          <>
            <p>
              <strong>10.1.</strong> A Szolgáltató a tőle elvárható
              gondossággal jár el. Tevékenységét eredményorientált, de
              gondossági kötelmen alapuló jelleggel látja el — a marketing
              eredmények (rangsorolás, konverzió, ROI) sok külső tényezőtől
              függnek, ezért konkrét eredmény elérésére csak akkor
              vállalkozik, ha azt az egyedi szerződés kifejezetten
              tartalmazza.
            </p>
            <p>
              <strong>10.2. Felelősség korlátozása (B2B).</strong> Vállalkozások
              közötti jogviszony esetén a Szolgáltató kárfelelőssége — a
              Ptk. 6:152. § és 6:526. § kereteinek megfelelően — legfeljebb
              a károkozást megelőző 6 hónapban kifizetett szolgáltatási
              díjak összegére korlátozódik. Közvetett károk (elmaradt
              haszon, jó hírnév csorbulása) tekintetében a Szolgáltató
              felelősségét kifejezetten kizárja, kivéve szándékos károkozás
              vagy életet, testi épséget, egészséget megkárosító károkozás
              esetén.
            </p>
            <p>
              <strong>10.3. Fogyasztói korlátozás.</strong> Fogyasztói
              megrendelő esetén a Ptk. 6:152. § alapján a felelősség
              szándékosan vagy súlyos gondatlansággal okozott, illetve
              életet, testi épséget, egészséget megkárosító károkért nem
              korlátozható; ezt jelen ÁSZF nem érinti.
            </p>
            <p>
              <strong>10.4. Hirdetési platformok.</strong> A Szolgáltató
              nem felel a hirdetési platformok (Google, Meta, LinkedIn,
              TikTok stb.) szabályzati változtatásaiból, fiók-felfüggesztéséből
              vagy algoritmus-változásaiból eredő károkért.
            </p>
          </>
        ),
      },
      {
        heading: "11. Adatkezelés",
        body: (
          <p>
            A Szolgáltató a Megrendelő és kapcsolattartói személyes adatait
            az{" "}
            <a href="/adatvedelmi-iranyelvek">Adatvédelmi tájékoztató</a>{" "}
            szerint kezeli, az EU 2016/679 GDPR és a 2011. évi CXII. tv.
            (Infotv.) rendelkezéseivel összhangban.
          </p>
        ),
      },
      {
        heading: "12. Panaszkezelés",
        body: (
          <>
            <p>
              <strong>12.1.</strong> A Megrendelő panaszát szóban (telefonon
              vagy személyesen), valamint írásban (e-mailben, postai úton)
              közölheti a Szolgáltató 1. pontban megjelölt elérhetőségein.
            </p>
            <p>
              <strong>12.2.</strong> A Szolgáltató a szóbeli panaszt — ha
              azt a helyszínen nem tudja orvosolni — jegyzőkönyvbe veszi.
              Az írásbeli panaszt a beérkezéstől számított{" "}
              <strong>30 napon belül</strong> érdemben megválaszolja a
              fogyasztóvédelemről szóló 1997. évi CLV. törvény 17/A. §
              szerint.
            </p>
            <p>
              <strong>12.3.</strong> A panasz elutasítása esetén a Szolgáltató
              a választ írásban indokolja, és tájékoztatja a Megrendelőt
              a vitarendezési lehetőségekről.
            </p>
          </>
        ),
      },
      {
        heading: "13. Vitarendezés (csak fogyasztói megrendelő esetén)",
        body: (
          <>
            <p>
              <strong>13.1. Békéltető testület.</strong> A panasza elutasítása
              esetén Ön — fogyasztóként — a lakóhelye szerint illetékes
              megyei (fővárosi) kereskedelmi és iparkamarák mellett működő
              békéltető testülethez fordulhat. A Szolgáltatót együttműködési
              kötelezettség terheli a békéltető testületi eljárásban
              (Fttv. 27. §).
            </p>
            <p>
              <strong>
                Baranya Vármegyei Békéltető Testület (Szolgáltató szerint
                illetékes):
              </strong>
              <br />
              Cím: 7625 Pécs, Majorossy Imre u. 36.
              <br />
              Levelezési cím: 7602 Pécs, Pf.: 109.
              <br />
              Telefon: +36 72 507 154
              <br />
              E-mail:{" "}
              <a href="mailto:info@baranyabekeltetes.hu">
                info@baranyabekeltetes.hu
              </a>
            </p>
            <p>
              <strong>13.2. Online vitarendezési platform (ODR).</strong> Az
              EU 524/2013/EU rendelete alapján a fogyasztó a következő
              online platformon kezdeményezhet vitarendezést:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p>
              <strong>13.3. Bíróság.</strong> A felek között esetlegesen
              felmerülő, peres úton érvényesítendő igényekre — a felek
              eltérő megállapodása hiányában — a Pp. szerinti általános
              illetékességi szabályok az irányadók.
            </p>
          </>
        ),
      },
      {
        heading: "14. Vis maior",
        body: (
          <p>
            Egyik fél sem felel a szerződésszegésért, ha az neki fel nem
            róható, előre nem látható, elháríthatatlan külső esemény (vis
            maior) — pl. természeti katasztrófa, háború, terrorcselekmény,
            kibertámadás, jogszabályi tilalom, kritikus szolgáltató teljes
            kiesése — következménye. A vis maior érintett fél haladéktalanul
            tájékoztatja a másik felet, és minden ésszerű intézkedést megtesz
            a kár csökkentésére.
          </p>
        ),
      },
      {
        heading: "15. Az ÁSZF módosítása",
        body: (
          <p>
            A Szolgáltató fenntartja a jogot az ÁSZF egyoldalú módosítására,
            különösen jogszabályi változás vagy az árazási, szolgáltatási
            kínálat változása esetén. A módosítást a Szolgáltató a
            weboldalán közzéteszi, és a hatálybalépést megelőzően legalább
            15 nappal e-mailben értesíti a határozatlan idejű szerződéssel
            rendelkező Megrendelőit. Ha a Megrendelő a módosítást nem
            fogadja el, a 7. pont szerinti felmondási joggal élhet.
          </p>
        ),
      },
      {
        heading: "16. Záró rendelkezések",
        body: (
          <>
            <p>
              <strong>16.1.</strong> A jelen ÁSZF-re és a felek
              jogviszonyára a magyar jog rendelkezései az irányadók. A
              kollíziós szabályok kizártak.
            </p>
            <p>
              <strong>16.2.</strong> Az ÁSZF magyar nyelvű változata az
              irányadó. Az angol és kínai változatok kizárólag tájékoztató
              jellegűek; eltérés esetén a magyar szöveg az irányadó.
            </p>
            <p>
              <strong>16.3.</strong> Amennyiben az ÁSZF valamely rendelkezése
              érvénytelennek vagy végrehajthatatlannak bizonyul, ez a többi
              rendelkezés érvényességét nem érinti.
            </p>
            <p>
              <strong>16.4.</strong> A felek kapcsolattartása elsősorban
              elektronikus úton (e-mail) történik. A felek a megadott
              elérhetőség változását haladéktalanul kötelesek egymással
              közölni.
            </p>
          </>
        ),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  en: {
    label: "Legal notice",
    title: "General Terms and Conditions",
    seoTitle: "Terms and Conditions – G2A Marketing",
    seoDesc:
      "G2A Marketing Bt. general terms and conditions: contracting, pricing, warranty, complaint handling.",
    lastUpdatedLabel: "Effective from:",
    lastUpdatedValue: LAST_UPDATED_EN,
    intro: (
      <>
        <p>
          These General Terms and Conditions (hereinafter: "GTC") govern the
          general terms of the contractual relationship between {COMPANY_NAME}{" "}
          (hereinafter: "Service Provider") and the Customer regarding the
          marketing services provided by the Service Provider.
        </p>
        <p>
          The GTC has been drafted with reference to Act V of 2013 on the Civil
          Code (Ptk.), Act CVIII of 2001 on Electronic Commerce Services
          (Eker. tv.), Government Decree 45/2014 (II. 26.) on detailed rules
          for contracts between consumers and traders, and Act XLVII of 2008
          on the Prohibition of Unfair Commercial Practices (Fttv.).
        </p>
        <p>
          By submitting an order (via email, an online form, or returning a
          signed contract), the Customer acknowledges having read, understood
          and accepted the GTC as binding.
        </p>
        <p>
          This English version is for information purposes only; in case of
          discrepancy the Hungarian original shall prevail.
        </p>
      </>
    ),
    sections: [
      {
        heading: "1. Service Provider details",
        body: (
          <p>
            <strong>Company name:</strong> {COMPANY_NAME}
            <br />
            <strong>Registered office:</strong> {COMPANY_FULL_ADDRESS}
            <br />
            <strong>Company registration number:</strong> {COMPANY_REG_NUMBER}
            <br />
            <strong>Registry court:</strong> Court of Registration of Pécs
            <br />
            <strong>Tax number:</strong> {COMPANY_TAX_NUMBER}
            <br />
            <strong>Represented by:</strong> Attila Győrfi
            <br />
            <strong>Email:</strong>{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <br />
            <strong>Phone:</strong>{" "}
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            <br />
            <strong>Hosting:</strong> Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, USA — data stored in Frankfurt (EU)
          </p>
        ),
      },
      {
        heading: "2. Scope of the GTC",
        body: (
          <>
            <p>
              <strong>Subject scope:</strong> the GTC covers all marketing
              services provided by the Service Provider (search engine
              optimisation, ad management, social media, web development,
              content marketing, strategic marketing, AI marketing, ESG
              communication, employer branding, international marketing, and
              related supplementary services).
            </p>
            <p>
              <strong>Personal scope:</strong> the GTC applies to contracts
              between the Service Provider and the Customer — whether a
              business entity, sole trader, public-budget body, NGO or
              consumer (per Ptk. 8:1(1)3).
            </p>
            <p>
              <strong>Temporal scope:</strong> from the effective date
              indicated above until the next published amendment. Earlier
              contracts remain governed by the GTC in force at the time of
              their conclusion.
            </p>
            <p>
              The parties may deviate from the GTC in an individual
              agreement; in case of conflict, the individual contract
              prevails.
            </p>
          </>
        ),
      },
      {
        heading: "3. Definitions",
        body: (
          <ul>
            <li>
              <strong>Service Provider:</strong> {COMPANY_NAME}, with the
              data set out in section 1.
            </li>
            <li>
              <strong>Customer:</strong> the natural or legal person, or
              entity without legal personality, that contracts with the
              Service Provider.
            </li>
            <li>
              <strong>Consumer:</strong> a natural person acting outside
              their trade, business or profession (Ptk. 8:1(1)3).
            </li>
            <li>
              <strong>Service:</strong> the activities of the Service
              Provider as listed in section 2, including consulting,
              creative and technical execution.
            </li>
            <li>
              <strong>Individual contract:</strong> a written agreement
              (paper or electronic, including email) between the parties
              defining the specific service scope, fees and deadlines.
            </li>
            <li>
              <strong>Working hour:</strong> one hour of staff time, rounded
              to the nearest quarter hour.
            </li>
            <li>
              <strong>Rush surcharge:</strong> the additional fee for
              orders to be delivered within 48 hours or for performance
              outside normal working hours.
            </li>
          </ul>
        ),
      },
      {
        heading: "4. Ordering and contract formation",
        body: (
          <>
            <p>
              <strong>4.1.</strong> The Customer may submit an enquiry via
              the contact form, free audit form, email, phone, or in
              person.
            </p>
            <p>
              <strong>4.2.</strong> Based on the enquiry, the Service
              Provider holds a free consultation and prepares an individual
              quote, valid for 30 days unless otherwise stated.
            </p>
            <p>
              <strong>4.3.</strong> The contract is concluded by:
            </p>
            <ul>
              <li>express acceptance of the quote by email (e.g. "yes, I order");</li>
              <li>signing and returning the individual contract on paper or by electronic signature;</li>
              <li>payment of the proforma invoice issued by the Service Provider (implied conduct).</li>
            </ul>
            <p>
              <strong>4.4.</strong> The Service Provider reserves the right
              to refuse an order in justified cases (capacity, conflict of
              interest, illegal content).
            </p>
            <p>
              <strong>4.5.</strong> The contract consists of the individual
              agreement and the GTC together. In case of conflict, the
              individual agreement prevails.
            </p>
          </>
        ),
      },
      {
        heading: "5. Fees and payment",
        body: (
          <>
            <p>
              <strong>5.1.</strong> The fee is set out in the individual
              agreement or accepted quote, in net terms; statutory VAT
              (currently 27%) is added.
            </p>
            <p>
              <strong>5.2. Billing models:</strong>
            </p>
            <ul>
              <li>
                <strong>One-off (project-fee):</strong> 50% on order, 50%
                on completion.
              </li>
              <li>
                <strong>Monthly (retainer):</strong> in advance, by the
                10th of the current month, by bank transfer.
              </li>
              <li>
                <strong>Ad spend (Google Ads, Meta):</strong> paid by the
                Customer directly to the platform, not part of the Service
                Provider's fees.
              </li>
            </ul>
            <p>
              <strong>5.3.</strong> Invoices are issued electronically
              (NAV-compliant e-invoice via Számlázz.hu or Billingo). Default
              payment term is 8 calendar days unless agreed otherwise.
            </p>
            <p>
              <strong>5.4. Default.</strong> In case of late payment the
              Service Provider is entitled to statutory default interest
              (Ptk. 6:155) and the recovery cost flat rate (Act IX of
              2016). For B2B contracts, the default rate is the central
              bank's base rate plus 8 percentage points. After 30 days of
              default the Service Provider may suspend performance until
              the arrears are paid.
            </p>
            <p>
              <strong>5.5.</strong> The Customer may object to an invoice
              in writing within 8 working days of receipt; otherwise the
              invoice is deemed accepted.
            </p>
          </>
        ),
      },
      {
        heading: "6. Performance and deadlines",
        body: (
          <>
            <p>
              <strong>6.1.</strong> The Service Provider performs in line
              with the deadlines and quality standards in the individual
              agreement.
            </p>
            <p>
              <strong>6.2.</strong> The Customer must provide the data,
              materials and access (e.g. website admin, ad account)
              necessary for performance on time. Customer delay extends
              the performance deadline proportionally.
            </p>
            <p>
              <strong>6.3.</strong> Place of performance is the Service
              Provider's registered seat; performance is, by default,
              electronic (email, cloud services, web admin).
            </p>
            <p>
              <strong>6.4. Partial performance:</strong> permitted where the
              individual agreement allows; partial invoices apply to the
              respective milestone.
            </p>
            <p>
              <strong>6.5. Acceptance:</strong> the Service Provider
              notifies the Customer of completion in writing. The Customer
              has 5 working days to confirm or raise a justified
              objection; absent that, performance is deemed accepted.
            </p>
          </>
        ),
      },
      {
        heading: "7. Termination, withdrawal (with consumer-only provisions)",
        body: (
          <>
            <p>
              <strong>7.1. Open-ended contract (retainer).</strong> Either
              party may terminate in writing with 30 days' notice, effective
              the last day of the month.
            </p>
            <p>
              <strong>7.2. Fixed-term contract.</strong> Ordinary
              termination is excluded. Extraordinary (immediate) termination
              is allowed only for material breach by the other party,
              given in writing with reasons (Ptk. 6:140).
            </p>
            <p>
              <strong>7.3. Material breach</strong> includes payment delay
              over 30 days, failure to provide required data over 30 days,
              or ordering content that violates the law.
            </p>
            <p>
              <strong>7.4. Consumer right of withdrawal.</strong> Under
              Government Decree 45/2014 (II. 26.) Article 20, a consumer
              may withdraw without justification within 14 days of contract
              formation. If, at the consumer's express request, performance
              has begun within the 14-day period, the right of withdrawal
              applies until performance is complete; the consumer must,
              however, pay the proportional fee for services already
              rendered.
            </p>
            <p>
              Withdrawal can be declared by email at {EMAIL} or using the
              model statement in Annex 2 of Government Decree 45/2014. The
              Service Provider refunds the consumer within 14 days
              (excluding the proportional fee).
            </p>
          </>
        ),
      },
      {
        heading: "8. Copyright and licence",
        body: (
          <>
            <p>
              <strong>8.1.</strong> Intellectual works produced by the
              Service Provider (creative materials, copy, images, code,
              strategy documents) are protected by copyright.
            </p>
            <p>
              <strong>8.2.</strong> Upon full payment, the Customer
              receives a non-exclusive licence — territorially unlimited
              and for the full term of copyright protection — to use the
              ordered work for business purposes.
            </p>
            <p>
              <strong>8.3.</strong> Until full payment, the licence is not
              transferred; the Service Provider may demand removal of any
              already-published material.
            </p>
            <p>
              <strong>8.4.</strong> The Service Provider may use the work
              as a reference, case study or portfolio piece on its
              website, social media and offline materials, unless the
              parties have signed a confidentiality agreement.
            </p>
            <p>
              <strong>8.5.</strong> The Customer warrants the copyright
              clearance of materials supplied (logo, photos, brand
              elements).
            </p>
          </>
        ),
      },
      {
        heading: "9. Confidentiality",
        body: (
          <>
            <p>
              <strong>9.1.</strong> The parties shall keep confidential
              all business secrets (Ptk. 2:47) and confidential
              information disclosed during the contractual relationship —
              especially financial data, customer lists, technical
              solutions.
            </p>
            <p>
              <strong>9.2.</strong> Confidentiality survives termination
              for 5 years.
            </p>
            <p>
              <strong>9.3.</strong> Disclosure required by law or
              authority does not breach this obligation.
            </p>
          </>
        ),
      },
      {
        heading: "10. Liability",
        body: (
          <>
            <p>
              <strong>10.1.</strong> The Service Provider acts with the
              diligence expected from it. Marketing services are
              result-oriented but obligation-of-means in nature — actual
              outcomes (rankings, conversion, ROI) depend on many external
              factors, so a specific result is undertaken only if expressly
              stated in the individual agreement.
            </p>
            <p>
              <strong>10.2. B2B liability cap.</strong> In B2B contracts,
              consistent with Ptk. 6:152 and 6:526, the Service Provider's
              liability is capped at the service fees paid in the 6 months
              preceding the damaging event. Indirect damages (lost profit,
              reputational harm) are expressly excluded, except for
              wilful misconduct or harm to life, bodily integrity or
              health.
            </p>
            <p>
              <strong>10.3. Consumer limit.</strong> For consumers,
              liability cannot be limited for wilful or grossly negligent
              acts, or for harm to life, bodily integrity or health (Ptk.
              6:152); the GTC does not affect this.
            </p>
            <p>
              <strong>10.4. Ad platforms.</strong> The Service Provider is
              not liable for damages arising from policy changes, account
              suspensions or algorithm changes by ad platforms (Google,
              Meta, LinkedIn, TikTok, etc.).
            </p>
          </>
        ),
      },
      {
        heading: "11. Data protection",
        body: (
          <p>
            The Service Provider processes the personal data of the
            Customer and its contacts in accordance with the{" "}
            <a href="/adatvedelmi-iranyelvek">Privacy Policy</a>, in line
            with EU Regulation 2016/679 (GDPR) and Hungarian Act CXII of
            2011.
          </p>
        ),
      },
      {
        heading: "12. Complaint handling",
        body: (
          <>
            <p>
              <strong>12.1.</strong> The Customer may submit a complaint
              orally (phone or in person) and in writing (email or post)
              using the contact details in section 1.
            </p>
            <p>
              <strong>12.2.</strong> Oral complaints, if not resolved on
              the spot, are recorded in a memo. Written complaints are
              answered substantively <strong>within 30 days</strong> of
              receipt, per Hungarian Act CLV of 1997 on Consumer Protection,
              section 17/A.
            </p>
            <p>
              <strong>12.3.</strong> If the complaint is rejected, the
              Service Provider provides written reasoning and informs the
              Customer of dispute resolution options.
            </p>
          </>
        ),
      },
      {
        heading: "13. Dispute resolution (consumers only)",
        body: (
          <>
            <p>
              <strong>13.1. Conciliation board.</strong> If a complaint is
              rejected, you — as a consumer — may turn to the conciliation
              board attached to the regional chamber of commerce of your
              place of residence. The Service Provider has a duty to
              cooperate in such proceedings (Fttv. 27).
            </p>
            <p>
              <strong>
                Baranya County Conciliation Board (competent for the
                Service Provider):
              </strong>
              <br />
              Address: H-7625 Pécs, Majorossy Imre u. 36.
              <br />
              Postal: H-7602 Pécs, Pf.: 109.
              <br />
              Phone: +36 72 507 154
              <br />
              Email:{" "}
              <a href="mailto:info@baranyabekeltetes.hu">
                info@baranyabekeltetes.hu
              </a>
            </p>
            <p>
              <strong>13.2. Online Dispute Resolution (ODR) platform.</strong>{" "}
              Under EU Regulation 524/2013, consumers may file disputes via{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p>
              <strong>13.3. Court.</strong> Otherwise, court jurisdiction
              is governed by the general rules of the Hungarian Civil
              Procedure Code, unless agreed otherwise.
            </p>
          </>
        ),
      },
      {
        heading: "14. Force majeure",
        body: (
          <p>
            Neither party is liable for breach caused by an unforeseeable,
            unavoidable external event (force majeure) — e.g. natural
            disaster, war, terrorism, cyber attack, statutory prohibition,
            total outage of a critical provider. The affected party
            notifies the other promptly and takes reasonable steps to
            mitigate damage.
          </p>
        ),
      },
      {
        heading: "15. Amendment of the GTC",
        body: (
          <p>
            The Service Provider may unilaterally amend the GTC, especially
            following statutory changes or changes to pricing/services.
            The amendment is published on the website; for open-ended
            contracts the Service Provider notifies Customers by email at
            least 15 days before the effective date. If a Customer does
            not accept the amendment, they may exercise the termination
            right under section 7.
          </p>
        ),
      },
      {
        heading: "16. Final provisions",
        body: (
          <>
            <p>
              <strong>16.1.</strong> Hungarian law applies to the GTC and
              the parties' relationship; conflict-of-laws rules are
              excluded.
            </p>
            <p>
              <strong>16.2.</strong> The Hungarian version is authoritative;
              English and Chinese versions are for information only.
            </p>
            <p>
              <strong>16.3.</strong> If a provision of the GTC is held
              invalid or unenforceable, this does not affect the remaining
              provisions.
            </p>
            <p>
              <strong>16.4.</strong> Communication is primarily electronic
              (email). The parties shall promptly notify each other of any
              change to the contact details provided.
            </p>
          </>
        ),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  zh: {
    label: "法律声明",
    title: "通用服务条款",
    seoTitle: "服务条款 – G2A Marketing",
    seoDesc:
      "G2A Marketing Bt. 通用服务条款:订立合同、收费、保修与投诉处理。",
    lastUpdatedLabel: "生效日期:",
    lastUpdatedValue: LAST_UPDATED_ZH,
    intro: (
      <>
        <p>
          本通用服务条款(下称「服务条款」)规范 {COMPANY_NAME}(下称「服务方」)
          与客户之间就服务方所提供市场营销服务而成立的合同关系的一般条件。
        </p>
        <p>
          本服务条款依据匈牙利 2013 年第 V 号民法典 (Ptk.)、2001 年第 CVIII
          号电子商务法 (Eker. tv.)、关于消费者与商户合同详细规则的
          45/2014. (II. 26.) 政府令,以及 2008 年第 XLVII 号反不正当商业
          实践法 (Fttv.) 制定。
        </p>
        <p>
          客户提交订单(电子邮件、在线表单或回签合同)即表示已阅读、理解并
          接受本服务条款,并同意受其约束。
        </p>
        <p>
          中文版本仅供参考,如有歧义以匈牙利文版本为准。
        </p>
      </>
    ),
    sections: [
      {
        heading: "1. 服务方信息",
        body: (
          <p>
            <strong>公司名称:</strong>{COMPANY_NAME}
            <br />
            <strong>注册地址:</strong>{COMPANY_FULL_ADDRESS}
            <br />
            <strong>公司登记号:</strong>{COMPANY_REG_NUMBER}
            <br />
            <strong>登记法院:</strong>佩奇法院
            <br />
            <strong>税号:</strong>{COMPANY_TAX_NUMBER}
            <br />
            <strong>代表人:</strong>Győrfi Attila
            <br />
            <strong>邮箱:</strong>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <br />
            <strong>电话:</strong>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            <br />
            <strong>托管商:</strong>Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, 美国 — 数据存储于法兰克福(欧盟)
          </p>
        ),
      },
      {
        heading: "2. 服务条款适用范围",
        body: (
          <>
            <p>
              <strong>事项范围:</strong>本服务条款适用于服务方提供的所有营销服务
              (搜索引擎优化、广告投放、社交媒体、网站开发、内容营销、战略营销、
              AI 营销、ESG 传播、雇主品牌、国际营销及其相关辅助服务)。
            </p>
            <p>
              <strong>主体范围:</strong>本服务条款适用于服务方与客户之间的合同,
              客户可为公司、个体经营者、预算单位、非营利组织或消费者(Ptk. 8:1(1)3)。
            </p>
            <p>
              <strong>时间范围:</strong>自上述生效日起至下一次修订发布前。
              较早的合同适用其订立时有效的服务条款。
            </p>
            <p>
              双方可在单独协议中偏离本服务条款;发生冲突时以单独协议为准。
            </p>
          </>
        ),
      },
      {
        heading: "3. 定义",
        body: (
          <ul>
            <li>
              <strong>服务方:</strong>{COMPANY_NAME},按第 1 节所列。
            </li>
            <li>
              <strong>客户:</strong>与服务方签订合同的自然人、法人或无法人资格的组织。
            </li>
            <li>
              <strong>消费者:</strong>在其行业、商业或职业范围之外行事的自然人(Ptk. 8:1(1)3)。
            </li>
            <li>
              <strong>服务:</strong>第 2 节所列服务方的活动,包括咨询、创意与技术执行。
            </li>
            <li>
              <strong>单独合同:</strong>双方以书面形式(纸质或电子,含电子邮件)
              达成的协议,确定具体服务范围、费用与期限。
            </li>
            <li>
              <strong>工时:</strong>员工 1 小时投入,按每 15 分钟取整。
            </li>
            <li>
              <strong>加急附加费:</strong>48 小时内交付或非常规工作时间履行的额外费用。
            </li>
          </ul>
        ),
      },
      {
        heading: "4. 订购与合同订立",
        body: (
          <>
            <p>
              <strong>4.1.</strong> 客户可通过联系表单、免费审计表单、电子邮件、
              电话或当面方式提交咨询。
            </p>
            <p>
              <strong>4.2.</strong> 服务方根据咨询提供免费咨询并准备个性化报价,
              报价有效期 30 天(除非另有说明)。
            </p>
            <p>
              <strong>4.3.</strong> 合同通过以下方式订立:
            </p>
            <ul>
              <li>通过电子邮件明确接受报价(如「是的,下单」);</li>
              <li>签署并寄回纸质或电子签名的单独合同;</li>
              <li>支付服务方开具的形式发票(默示行为)。</li>
            </ul>
            <p>
              <strong>4.4.</strong> 服务方在合理理由下(产能不足、利益冲突、
              非法内容)有权拒绝订单。
            </p>
            <p>
              <strong>4.5.</strong> 合同由单独协议与本服务条款共同构成。
              发生冲突时以单独协议为准。
            </p>
          </>
        ),
      },
      {
        heading: "5. 费用与付款条件",
        body: (
          <>
            <p>
              <strong>5.1.</strong> 费用由单独协议或已接受的报价确定,以净额计算;
              另加现行法定增值税(目前为 27%)。
            </p>
            <p>
              <strong>5.2. 计费模式:</strong>
            </p>
            <ul>
              <li>
                <strong>一次性(项目费):</strong>下单时支付 50%,完成时支付 50%。
              </li>
              <li>
                <strong>月度(顾问费):</strong>预付,每月 10 日前,银行转账。
              </li>
              <li>
                <strong>广告费(Google Ads、Meta):</strong>由客户直接向广告平台支付,
                不属于服务方费用。
              </li>
            </ul>
            <p>
              <strong>5.3.</strong> 发票以电子方式开具(经 NAV 认证的电子发票,
              通过 Számlázz.hu 或 Billingo)。除非另有约定,默认付款期限为 8 个日历日。
            </p>
            <p>
              <strong>5.4. 违约。</strong>逾期付款时服务方有权按 Ptk. 6:155 的法定
              违约利率与 2016 年第 IX 号法律的回收成本固定费收取费用。B2B 合同的
              违约利率为基础利率加 8 个百分点。逾期超过 30 天,服务方可暂停履行直至清偿。
            </p>
            <p>
              <strong>5.5.</strong> 客户可在收到发票后 8 个工作日内书面提出异议;
              否则发票视为接受。
            </p>
          </>
        ),
      },
      {
        heading: "6. 履行与期限",
        body: (
          <>
            <p>
              <strong>6.1.</strong> 服务方按单独协议中的期限与质量要求履行。
            </p>
            <p>
              <strong>6.2.</strong> 客户须按时提供履行所需的数据、材料与访问权限
              (例如网站管理员、广告账户)。客户延误,履行期限按比例延长。
            </p>
            <p>
              <strong>6.3.</strong> 履行地点为服务方注册地址;履行方式默认为电子方式
              (电子邮件、云服务、网页管理界面)。
            </p>
            <p>
              <strong>6.4. 部分履行:</strong>单独协议允许时可进行;部分发票针对相应里程碑。
            </p>
            <p>
              <strong>6.5. 验收:</strong>服务方书面通知客户履行完毕。客户应在 5 个
              工作日内确认或提出有理由的异议;否则视为已接受。
            </p>
          </>
        ),
      },
      {
        heading: "7. 解除与撤回(含消费者特别条款)",
        body: (
          <>
            <p>
              <strong>7.1. 不定期合同(顾问费)。</strong>任一方可书面提前 30 天通知,
              在月底生效解除合同。
            </p>
            <p>
              <strong>7.2. 定期合同。</strong>不可常规解除。仅在对方重大违约时,
              可书面附理由立即解除(Ptk. 6:140)。
            </p>
            <p>
              <strong>7.3. 重大违约</strong>包括逾期付款超 30 天、所需数据延迟超 30 天,
              或订购违法内容。
            </p>
            <p>
              <strong>7.4. 消费者撤回权。</strong>根据 45/2014. (II. 26.) 政府令第 20 条,
              消费者可在合同订立后 14 天内无理由撤回。如服务在 14 天内已应消费者明确请求开始,
              撤回权可行使至履行完成,但消费者须按已履行服务的比例支付费用。
            </p>
            <p>
              撤回可发送电子邮件至 {EMAIL},或使用 45/2014. (II. 26.) 政府令附件 2 的
              声明范本。服务方将在 14 天内退还消费者已支付款项(扣除按比例费用)。
            </p>
          </>
        ),
      },
      {
        heading: "8. 著作权与使用权",
        body: (
          <>
            <p>
              <strong>8.1.</strong> 服务方制作的智力成果(创意素材、文案、图片、代码、
              战略文档)受著作权法保护。
            </p>
            <p>
              <strong>8.2.</strong> 客户在全额支付服务费后,获得地域不限、期限与服务方
              著作权保护期相同的非独占使用权,用于商业目的。
            </p>
            <p>
              <strong>8.3.</strong> 全额付款前不转让使用权;服务方有权要求移除已发布材料。
            </p>
            <p>
              <strong>8.4.</strong> 服务方有权在其官网、社交媒体与线下材料中将作品作为
              参考案例展示,除非双方签署保密协议。
            </p>
            <p>
              <strong>8.5.</strong> 客户须保证其提供材料(标志、照片、品牌元素)
              的著作权清洁。
            </p>
          </>
        ),
      },
      {
        heading: "9. 保密义务",
        body: (
          <>
            <p>
              <strong>9.1.</strong> 双方对合同关系中获得的商业秘密(Ptk. 2:47)
              与机密信息——尤其是财务数据、客户名单、技术方案——负有保密义务。
            </p>
            <p>
              <strong>9.2.</strong> 保密义务在合同终止后持续 5 年。
            </p>
            <p>
              <strong>9.3.</strong> 法律或主管机关要求披露不构成违约。
            </p>
          </>
        ),
      },
      {
        heading: "10. 责任",
        body: (
          <>
            <p>
              <strong>10.1.</strong> 服务方以应有谨慎履行义务。营销服务为结果导向但
              性质上属手段债务——具体成果(排名、转化、ROI)取决于多种外部因素,
              因此特定结果仅在单独协议明确约定时方为承担。
            </p>
            <p>
              <strong>10.2. B2B 责任上限。</strong>B2B 合同中,符合 Ptk. 6:152 与 6:526,
              服务方责任上限为损害发生前 6 个月内已支付的服务费总额。除故意或导致
              生命、人身、健康损害的情形外,间接损害(利润损失、商誉损害)明示排除。
            </p>
            <p>
              <strong>10.3. 消费者限制。</strong>对消费者,故意或重大过失行为以及
              对生命、人身、健康造成损害的责任不可限制(Ptk. 6:152);本服务条款
              不影响该规则。
            </p>
            <p>
              <strong>10.4. 广告平台。</strong>服务方对因广告平台(Google、Meta、
              LinkedIn、TikTok 等)政策变更、账户暂停或算法变更所致损害不承担责任。
            </p>
          </>
        ),
      },
      {
        heading: "11. 数据保护",
        body: (
          <p>
            服务方按
            <a href="/adatvedelmi-iranyelvek">隐私政策</a>处理客户及其联系人的
            个人数据,符合 GDPR((欧盟)2016/679)与匈牙利 2011 年第 CXII 号法律规定。
          </p>
        ),
      },
      {
        heading: "12. 投诉处理",
        body: (
          <>
            <p>
              <strong>12.1.</strong> 客户可通过第 1 节联系方式以口头(电话或当面)或书面
              (邮件或邮寄)方式提交投诉。
            </p>
            <p>
              <strong>12.2.</strong> 现场无法解决的口头投诉将记入备忘录。书面投诉
              将在收到后<strong>30 天内</strong>实质回复(匈牙利 1997 年第 CLV 号
              消费者保护法第 17/A 条)。
            </p>
            <p>
              <strong>12.3.</strong> 投诉被驳回时,服务方将书面说明理由,并告知
              客户的争议解决渠道。
            </p>
          </>
        ),
      },
      {
        heading: "13. 争议解决(仅消费者)",
        body: (
          <>
            <p>
              <strong>13.1. 调解委员会。</strong>投诉被驳回时,作为消费者您可向
              居住地所在县商会附属调解委员会申请。服务方依 Fttv. 第 27 条
              负有合作义务。
            </p>
            <p>
              <strong>巴拉尼亚州调解委员会(对服务方有管辖权):</strong>
              <br />
              地址:H-7625 Pécs, Majorossy Imre u. 36.
              <br />
              邮政地址:H-7602 Pécs, Pf.: 109.
              <br />
              电话:+36 72 507 154
              <br />
              邮箱:
              <a href="mailto:info@baranyabekeltetes.hu">
                info@baranyabekeltetes.hu
              </a>
            </p>
            <p>
              <strong>13.2. 在线争议解决 (ODR) 平台。</strong>根据(欧盟)
              524/2013 号条例,消费者可通过
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              平台提起争议解决。
            </p>
            <p>
              <strong>13.3. 法院。</strong>除非另有约定,法院管辖按匈牙利民事诉讼
              法的一般规则确定。
            </p>
          </>
        ),
      },
      {
        heading: "14. 不可抗力",
        body: (
          <p>
            任一方对因不可预见、不可避免的外部事件(不可抗力)——如自然灾害、战争、
            恐怖袭击、网络攻击、法律禁令、关键服务商完全停运——所致违约不承担责任。
            受影响方应及时通知对方并采取一切合理措施减少损失。
          </p>
        ),
      },
      {
        heading: "15. 服务条款修改",
        body: (
          <p>
            服务方有权单方面修改本服务条款,尤其在法律变化或定价/服务变化时。
            修改将在官网公布,对不定期合同的客户,服务方将在生效前至少 15 天
            通过电子邮件通知。客户不接受修改的,可依第 7 节行使解除权。
          </p>
        ),
      },
      {
        heading: "16. 最终条款",
        body: (
          <>
            <p>
              <strong>16.1.</strong> 本服务条款及双方关系适用匈牙利法律,
              排除冲突法规则。
            </p>
            <p>
              <strong>16.2.</strong> 匈牙利文版本为准,英文与中文版本仅供参考。
            </p>
            <p>
              <strong>16.3.</strong> 本服务条款中任一条款无效或不可执行的,
              不影响其余条款效力。
            </p>
            <p>
              <strong>16.4.</strong> 双方主要通过电子方式(电子邮件)沟通。
              联系方式变更应及时相互通知。
            </p>
          </>
        ),
      },
    ],
  },
};

export default function AszfPage() {
  const { lang } = useLanguage();
  const doc = DOCS[lang];

  return (
    <>
      <SeoHead
        title={doc.seoTitle}
        description={doc.seoDesc}
        noIndex={false}
        pageSchemas={[
          breadcrumbSchema([
            { name: "G2A Marketing", url: "https://g2amarketing.hu" },
            { name: doc.title, url: "https://g2amarketing.hu/aszf" },
          ]),
        ]}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "4rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">{doc.label}</div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                fontFamily: "Geist Mono, monospace",
              }}
            >
              {doc.title}
            </h1>
          </div>
        </section>
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: "880px" }}>
            <div className="g2a-prose">
              <p>
                <strong>{doc.lastUpdatedLabel}</strong> {doc.lastUpdatedValue}
              </p>
              {doc.intro}
              {doc.sections.map((s, i) => (
                <div key={i}>
                  <h2>{s.heading}</h2>
                  {s.body}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
