import type { Language } from "@/contexts/LanguageContext";

/**
 * Multi-language service configuration for the 8 hard-coded service detail
 * pages rendered by `NewServicePage`. Each service has full HU/EN/ZH content
 * for: title, subtitle, heroDesc, intro, 6 benefits, 4 process steps, 3 FAQs,
 * cta. Shared (language-invariant): slug, icon, color.
 *
 * Lookup pattern: `SERVICE_CONFIGS[lang][slug]`. Slug-level fallback to HU
 * if a translation is missing (defensive — should never trigger in prod).
 */

export type ServiceConfig = {
  slug: string;
  title: string;
  subtitle: string;
  heroDesc: string;
  metaTitle: string;
  metaDesc: string;
  icon: string;
  color: string;
  intro: string;
  benefits: Array<{ title: string; desc: string }>;
  process: Array<{ step: string; title: string; desc: string }>;
  faq: Array<{ q: string; a: string }>;
  cta: string;
};

// ─── HU ─────────────────────────────────────────────────────────────────────
const HU: Record<string, ServiceConfig> = {  "arculattervezes": {
    "slug": "arculattervezes",
    "title": "Arculattervezés és branding KKV-knak és B2B cégeknek",
    "subtitle": "Egyedi vizuális identitás logótól az arculati kézikönyvig — következetes minden felületeden.",
    "heroDesc": "A márkád vizuális identitása többet mond ezer szónál — és sokszor ez az első benyomás, amit egy potenciális ügyfél kap rólad. Logót, színpalettát, tipográfiát és grafikai rendszert tervezünk, ami minden felületeden ugyanazt az üzenetet közvetíti. Nem dekoráció: stratégiára épülő, felismerhető és bizalmat építő arculat.",
    "metaTitle": "Arculattervezés és branding 2026 – Vizuális identitás | G2A Marketing",
    "metaDesc": "Logó, arculati kézikönyv, nyomtatott és digitális anyagok tervezése KKV-knak és B2B cégeknek. Építs következetes, bizalmat építő vizuális identitást. Kérd az ajánlatot!",
    "icon": "brand",
    "color": "#ec4899",
    "intro": "Az arculat 2026-ban nem luxus, hanem üzleti alap: a vásárlók másodpercek alatt döntenek arról, megbíznak-e benned, és ennek nagy részét a vizuális megjelenés határozza meg. Egy következetlen logó, kapkodó színhasználat vagy hat különböző betűtípus a felületeiden azonnal érzékelhető — még ha a néző nem is tudja megnevezni, mi a baj. A G2A Marketingnél az arculatot mindig stratégiából vezetjük le: előbb megértjük, kik a vásárlóid, mitől különbözöl a versenytársaktól és milyen pozíciót akarsz elfoglalni — utána tervezünk. Az eredmény nem csak egy szép logó, hanem egy működő rendszer: arculati kézikönyv, ami minden jövőbeli anyagodat keretezi, a névjegykártyától a weboldalig. Ha nincs stratégia, nincs arculat.",
    "benefits": [
      {
        "title": "Egyedi, védhető logó",
        "desc": "Nem sablon, nem klipart. Több koncepció-irányból dolgozunk, majd a kiválasztottat letisztult, skálázható vektoros formátumban szállítjuk — minden méretben és minden háttéren működik, kicsiben (favicon) és nagyban (homlokzati tábla) egyaránt."
      },
      {
        "title": "Átfogó arculati kézikönyv",
        "desc": "Leírjuk a logóhasználatot, védőzónát, tiltott alkalmazásokat, a teljes színpalettát (HEX, RGB, CMYK, Pantone), a tipográfiát és a grafikai elemeket. Ez az a dokumentum, amivel bárki — belső csapat vagy külső partner — következetesen tud dolgozni."
      },
      {
        "title": "Következetesség minden felületen",
        "desc": "A weboldaltól a közösségi médián át a nyomtatott névjegyig ugyanaz a vizuális nyelv. A következetes megjelenés a felismerhetőség alapja: a többszöri találkozás építi a bizalmat és a márka-emlékezést."
      },
      {
        "title": "Kész nyomtatott anyagok",
        "desc": "Névjegykártya, brosúra, roll-up, mappa, prezentáció-sablon — nyomdakész fájlokban, a kivitelezéshez szükséges műszaki paraméterekkel (kifutó, vágójelek, színprofil). Ha kéred, megbízható nyomdai partnert is ajánlunk."
      },
      {
        "title": "Digitális arculati eszköztár",
        "desc": "Közösségi média sablonok, e-mail aláírás, prezentáció-master, social poszt-keretek és borítók. Olyan szerkeszthető sablonokat adunk át (pl. Canva vagy Figma), amelyekkel a napi tartalmaidat magad is gyorsan, márkahűen készíted."
      },
      {
        "title": "Stratégiai pozícionálás, nem dekoráció",
        "desc": "Az arculat nálunk a márkastratégiából következik — célközönség, versenytárs-kontextus, üzenet. Ezért nem ízlés-vita lesz a folyamatból, hanem indokolható döntések sora, amelyek a te üzleti céljaidat szolgálják."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Felmérés és márka-brief",
        "desc": "Megértjük a vállalkozásod: kik a vásárlóid, mitől különbözöl, milyen érzést akarsz kelteni, és hová pozícionálod magad a piacon. Áttekintjük a meglévő anyagaidat és a versenytársak vizuális világát. Ez a brief a teljes folyamat iránytűje."
      },
      {
        "step": "02",
        "title": "Koncepció és logótervezés",
        "desc": "Több, egymástól markánsan eltérő vizuális irányt mutatunk be — moodboarddal és indoklással, miért működik az adott koncepció a célközönségednél. Te választasz irányt, mi pedig azt csiszoljuk tovább a végleges logóig."
      },
      {
        "step": "03",
        "title": "Arculati rendszer kiépítése",
        "desc": "A logó köré felépítjük a teljes rendszert: színpaletta, tipográfiai hierarchia, grafikai elemek, képi világ. Mindezt arculati kézikönyvbe foglaljuk, hogy a megjelenés a jövőben is következetes maradjon."
      },
      {
        "step": "04",
        "title": "Alkalmazás és átadás",
        "desc": "Legyártjuk a konkrét anyagokat — nyomdakész névjegyet, brosúrát, roll-upot és a digitális sablonokat. Átadjuk a teljes forrásfájl-csomagot és egy átadási konzultáción végigvesszük, hogyan használd magabiztosan."
      }
    ],
    "faq": [
      {
        "q": "Mennyi ideig tart egy teljes arculat elkészítése?",
        "a": "A logó és az alapvető arculati rendszer jellemzően 3-5 hét. A teljes csomag (kézikönyv, nyomtatott és digitális anyagok együtt) általában 5-8 hét, a terjedelemtől és a visszajelzési körök gyorsaságától függően. A felmérés után konkrét ütemtervet adunk."
      },
      {
        "q": "Csak logót szeretnék, nem a teljes csomagot. Lehetséges?",
        "a": "Igen. Sokan logóval indulnak, és később bővítik a rendszert. Reálisan elmondjuk: önmagában a logó kevés a következetes megjelenéshez, ezért legalább egy alap színpaletta és tipográfia definiálását javasoljuk mellé. Mer nemet mondunk arra, ami szerintünk nem szolgálja a céljaidat."
      },
      {
        "q": "Mit kapok pontosan a végén, milyen fájlformátumban?",
        "a": "A logót vektorosan (SVG, AI, EPS) és kész képformátumokban (PNG, JPG) különböző változatokban és háttereken, az arculati kézikönyvet PDF-ben, a nyomtatott anyagokat nyomdakész PDF-ben, a digitális sablonokat pedig szerkeszthető formában (pl. Canva/Figma). Minden forrásfájl a tiéd."
      },
      {
        "q": "Van már logóm, csak frissíteni szeretném. Ezzel is foglalkoztok?",
        "a": "Igen, rebranding és arculat-frissítés is a profilunk. Megnézzük, mi működik a meglévő identitásból és mi nem, majd evolúciós vagy teljes újratervezést javasolunk — attól függően, mennyi márkaérték van a jelenlegi megjelenésben. Nem dobunk ki feleslegesen felépített felismerhetőséget."
      },
      {
        "q": "Hogyan biztosítjátok, hogy az arculat tényleg illik a vállalkozásomhoz?",
        "a": "Azzal, hogy nem ízlésből, hanem stratégiából indulunk. A márka-briefben rögzítjük a célközönséget, a pozíciót és az üzenetet, és minden vizuális döntést ehhez kötünk. A koncepciókat indoklással mutatjuk be, így a választás nem érzés, hanem informált döntés lesz."
      },
      {
        "q": "Az arculat elkészülte után tudtok segíteni az alkalmazásban is?",
        "a": "Igen. Mivel a G2A Marketing teljes körű ügynökség, az arculatot zökkenőmentesen visszük tovább weboldalra, közösségi médiára, hirdetésekre és tartalomra. Az átadáskor minden szükséges sablont megkapsz, de a folyamatos alkalmazásban is mellédállunk, ha kéred."
      }
    ],
    "cta": "Kérj egyedi arculat-ajánlatot"
  },
  "hirdeteskezeles": {
    "slug": "hirdeteskezeles",
    "title": "PPC & Hirdetéskezelés — egy stratégia, minden platformon",
    "subtitle": "Adatvezérelt fizetett kampányok Google Ads, Meta, LinkedIn és TikTok felületeken, egységes ROI-fókusszal.",
    "heroDesc": "A fizetett hirdetés akkor működik, ha nem platformonként foltozod, hanem egy közös stratégia mentén kezeled. Csapatunk teljes körű, több-platformos PPC menedzsmentet épít: oda tesszük a büdzsét, ahol a célközönséged tényleg dönt, és minden forint mögé mérhető cél kerül. Ha nincs stratégia, nincs G2A.",
    "metaTitle": "PPC & Hirdetéskezelés 2026 — több-platformos kampánymenedzsment | G2A Marketing",
    "metaDesc": "Több-platformos PPC menedzsment: Google Ads, Meta, LinkedIn, TikTok egy stratégiában. Adatvezérelt struktúra, A/B tesztek, konverziókövetés. Kérd az ingyenes audit!",
    "icon": "ads",
    "color": "#f43f5e",
    "intro": "A fizetett hirdetés 2026-ban már nem egyetlen platform kérdése: az ügyfeleid a Google keresőjében, a Meta hírfolyamában, a LinkedIn B2B teréből és a TikTok videóiból egyaránt érkeznek. A PPC és hirdetéskezelés akkor hoz valódi megtérülést, ha ezeket a csatornákat nem külön-külön optimalizálod, hanem egyetlen, adatvezérelt struktúrában. A G2A Marketing platform-átfogó kampánymenedzsmentet épít: a büdzsét folyamatosan oda csoportosítjuk, ahol a legjobb a konverziós költség, az üzeneteket A/B tesztekkel élesítjük, az eredményt pedig pontos konverziókövetéssel mérjük. Nem ígéreteket adunk, hanem átlátható, havi riportban követhető folyamatot — rejtett platform-számla nélkül.",
    "benefits": [
      {
        "title": "Egy stratégia, több platform",
        "desc": "Google Ads, Meta, LinkedIn és TikTok nem külön szigetek: közös célrendszerben, egységes attribúcióval kezeljük őket, hogy lásd, melyik csatorna mire jó a vásárlói úton."
      },
      {
        "title": "Adatvezérelt fiókstruktúra",
        "desc": "Kampány- és hirdetéscsoport-felépítés a tényleges keresési és vásárlási szándék köré — tiszta szegmensek, hogy a büdzsé a profitábilis irányba menjen, ne szétfolyjon."
      },
      {
        "title": "Platformok közti büdzsé-allokáció",
        "desc": "A keretet ott növeljük, ahol a konverziós költség a legjobb, és ott húzzuk vissza, ahol gyengül a megtérülés — heti felülvizsgálat alapján, nem megérzésből."
      },
      {
        "title": "A/B tesztek és kreatívok",
        "desc": "Hirdetésszövegeket, kreatívokat és landing-irányokat strukturáltan tesztelünk. Csak az nyer, amit a számok igazolnak — a vesztes variánst lecseréljük."
      },
      {
        "title": "Pontos konverziókövetés",
        "desc": "GA4, platform-pixelek és szerver-oldali mérés beállítása, hogy a riportban valós leadek és vásárlások szerepeljenek, ne félrevezető kattintásszámok."
      },
      {
        "title": "Átlátható havi riport",
        "desc": "Egyszerű, érthető riport: mire ment a büdzsé, mi a konverziós költség, mi a következő lépés. Tudod, miért fizetsz — rejtett tételek nélkül."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit és célkijelölés",
        "desc": "Átnézzük a meglévő fiókokat, a mérési rendszert és a versenykörnyezetet. Tisztázzuk az üzleti célt és a reális KPI-okat (CPA, ROAS), majd kijelöljük, mely platformok relevánsak — ha valamelyik nem éri meg, megmondjuk."
      },
      {
        "step": "02",
        "title": "Stratégia és struktúra",
        "desc": "Felépítjük a platform-átfogó kampánytervet: kit, hol, milyen üzenettel érünk el, és hogyan oszlik meg a büdzsé. Beállítjuk a tiszta fiókstruktúrát és a konverziókövetést a méréshez."
      },
      {
        "step": "03",
        "title": "Indítás és tesztelés",
        "desc": "Élesítjük a kampányokat, és az első hetekben strukturált A/B teszteket futtatunk a kreatívokra, üzenetekre és célzásokra. A korai adatból kiszűrjük, mi működik valójában."
      },
      {
        "step": "04",
        "title": "Optimalizálás és skálázás",
        "desc": "Folyamatosan finomítjuk a célzást, ajánlatokat és büdzsé-elosztást, a jól teljesítő irányokat felskálázzuk. Havi riportban mutatjuk az eredményt és a következő lépéseket."
      }
    ],
    "faq": [
      {
        "q": "Miben más ez, mint a Google Ads vagy a Meta hirdetés külön?",
        "a": "Ez a platform-átfogó menedzsment: nem egyetlen felületet kezelünk, hanem a Google, Meta, LinkedIn és TikTok kampányokat egy közös stratégiában, egységes büdzsé-elosztással és attribúcióval. Ha kifejezetten csak Google Ads vagy csak Meta kell, arra külön szolgáltatásunk van — itt a teljes mixet hangoljuk össze."
      },
      {
        "q": "Mennyi büdzsé kell, hogy érdemes legyen elindulni?",
        "a": "Nincs egyetlen kötelező összeg, mert iparágonként és platformonként más a verseny. Az auditon megmondjuk, mekkora keret szükséges ahhoz, hogy a teszteléshez elég adat gyűljön — és ha a célodhoz a büdzsé kevés, inkább szólunk, minthogy elköltsük eredmény nélkül."
      },
      {
        "q": "Mikor láthatók az első eredmények?",
        "a": "A tanulási és tesztelési fázis jellemzően 4-6 hét, mire stabil adat alapján optimalizálhatunk. A keresési kampányok általában gyorsabban hoznak konverziót, a Display és a közösségi márkaépítő irányok tovább érnek be. Reális időtávot az auditkor adunk."
      },
      {
        "q": "Melyik platformokon érdemes hirdetnem?",
        "a": "Az nem rólunk, hanem rólad szól: hol vannak a vevőid és mi a céljuk. B2B-nél gyakran a Google kereső és a LinkedIn a fő irány, B2C-nél a Meta és a TikTok erősebb. Az auditon platformonként indokoljuk a javaslatot — nem mindenhol kell egyszerre jelen lenni."
      },
      {
        "q": "Ki birtokolja a hirdetési fiókokat és az adatokat?",
        "a": "Mindig te. A fiókokat a te tulajdonodban hozzuk létre vagy a meglévőkön dolgozunk, a hozzáférést te adod nekünk. Így az adatod és a felépített struktúra nálad marad akkor is, ha később máshogy döntesz — nincs bezárás."
      },
      {
        "q": "Hogyan méritek és riportoltok?",
        "a": "Konverziókövetést állítunk be GA4-gyel, platform-pixelekkel és ahol kell, szerver-oldali méréssel, hogy valós leadek és vásárlások legyenek a számokban. Havi, érthető riportot kapsz: hova ment a büdzsé, mi a konverziós költség platformonként, és mi a következő lépés."
      }
    ],
    "cta": "Kérd az ingyenes PPC auditot"
  },
  "kozossegi-media": {
    "slug": "kozossegi-media",
    "title": "Közösségi média menedzsment — követőkből lojális közösség",
    "subtitle": "Stratégia, tartalom, közösségkezelés és influencer együttműködések egy kézben, KKV-knak és B2B cégeknek.",
    "heroDesc": "A közösségi média nem posztok véletlenszerű publikálása, hanem rendszer: stratégia, tartalom-naptár, konzisztens márkahang és napi szintű közösségkezelés. A G2A Marketing a célok kijelölésétől a moderálásig viszi a folyamatot — Facebookon, Instagramon, LinkedInen és TikTokon. Ha nincs stratégia, nincs G2A: előbb a célközönséget és a mérőszámokat tisztázzuk, csak utána posztolunk.",
    "metaTitle": "Közösségi média menedzsment 2026 — márkaépítés | G2A Marketing",
    "metaDesc": "Social media stratégia, tartalomgyártás, közösségkezelés és influencer marketing Facebookon, Instagramon, LinkedInen és TikTokon. Kérd a díjmentes social auditot!",
    "icon": "social",
    "color": "#3b82f6",
    "intro": "A közösségi média 2026-ra a márkaépítés egyik legfontosabb organikus csatornája lett — ugyanakkor a platformok algoritmusai szigorúbbak, a felhasználók pedig azonnal kiszúrják az üres marketinget. Ma nem a posztgyár nyer, hanem a következetes, hiteles jelenlét, ami valódi közösséget épít. A G2A Marketing nem külön-külön kezeli a csatornákat, hanem egy stratégiára fűzi fel: tartalom-naptárral, márkahanggal, közösségkezeléssel és — ahol indokolt — influencer együttműködésekkel. Facebook, Instagram, LinkedIn és TikTok: mindegyiket a saját logikája szerint, de egységes márkaüzenettel. AI-eszközöket józanul használunk a tartalomötletelésben és az ütemezésben, de a hang és a moderálás emberi marad. Átlátható havi riportot adunk: mit posztoltunk, mi működött, mi nem, és mi a következő hónap terve.",
    "benefits": [
      {
        "title": "Stratégia, nem véletlenszerű posztolás",
        "desc": "Először a célközönséget, a pozícionálást és a mérőszámokat tisztázzuk, csak utána készül tartalom. Minden poszt egy üzleti célt szolgál — ismertség, közösségépítés vagy lead —, nem önmagáért van."
      },
      {
        "title": "Tartalom-naptár és konzisztens márkahang",
        "desc": "Heti-havi tartalom-naptárt építünk, hogy a megjelenés kiszámítható és tervezhető legyen. Egységes vizuális stílus és márkahang minden platformon, így a márkád felismerhető marad a görgetés zajában is."
      },
      {
        "title": "Platform-specifikus tartalom",
        "desc": "Nem ugyanazt a posztot toljuk ki mindenhová. A LinkedIn szakmai, a TikTok rövid és lendületes, az Instagram vizuális, a Facebook közösségi — minden csatornára a saját formátumában gyártunk tartalmat."
      },
      {
        "title": "Aktív közösségkezelés és moderálás",
        "desc": "Kommentekre, üzenetekre és értékelésekre időben reagálunk a márkahangod szerint. A moderálás a negatív hangokat is kezeli — higgadtan, professzionálisan —, mert egy jól kezelt panasz bizalmat épít."
      },
      {
        "title": "Influencer marketing valódi illeszkedéssel",
        "desc": "Nem követőszám alapján választunk influencert, hanem releváns, a célközönségeddel valóban átfedő partnereket keresünk. A kreatív briefet, az együttműködés kereteit és a mérést mi koordináljuk."
      },
      {
        "title": "Átlátható mérés és havi riport",
        "desc": "Elérés, interakció, közönségnövekedés és — ahol értelmezhető — a weboldalra terelt forgalom: minden hónapban érthető riportot kapsz. Nincs rejtett platform-számla, az árazás előre tiszta."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit és stratégia",
        "desc": "Feltérképezzük a jelenlegi jelenléted, a versenytársakat és a célközönséged. Kiválasztjuk a releváns platformokat (nem mindegyik kell mindenkinek), és lefektetjük a célokat, a hangnemet és a KPI-okat."
      },
      {
        "step": "02",
        "title": "Tartalom-naptár és kreatív",
        "desc": "Összeállítjuk a havi tartalom-naptárt: témák, formátumok, ütemezés. Legyártjuk a posztokat, vizuálokat és szövegeket platformra szabva, a jóváhagyásod beépített pontjaival."
      },
      {
        "step": "03",
        "title": "Publikálás és közösségkezelés",
        "desc": "Ütemezetten publikálunk, és napi szinten kezeljük a közösséget: kommentek, üzenetek, moderálás. Ahol indokolt, influencer együttműködéseket koordinálunk."
      },
      {
        "step": "04",
        "title": "Mérés, riport és optimalizálás",
        "desc": "Havonta kiértékeljük az eredményeket, megnézzük mi működött, és ennek mentén finomhangoljuk a következő hónap tartalmát. Folyamatos, adatvezérelt iteráció."
      }
    ],
    "faq": [
      {
        "q": "Mennyi idő alatt látható eredmény a közösségi médiában?",
        "a": "Az organikus márkaépítés türelemjáték: a konzisztens jelenlét és a közösségnövekedés jellemzően 3-6 hónap alatt válik igazán láthatóvá. Az első hetekben a tartalom-rendszer és a hang beállítása zajlik, az érdemi lendület utána épül."
      },
      {
        "q": "Melyik platformokat érdemes használni?",
        "a": "Azt, ahol a célközönséged ténylegesen jelen van. B2B-ben gyakran a LinkedIn a fő csatorna, fogyasztói márkáknál az Instagram és a TikTok, lokális vállalkozásnál a Facebook. Az auditban közösen döntjük el — nem kell mindenhol jelen lenni."
      },
      {
        "q": "Ti gyártjátok a tartalmat, vagy nekünk kell?",
        "a": "Mi gyártjuk: szöveget, vizuált, tartalom-naptárt. Ha van saját anyagod (fotó, videó, termékkép), azt beépítjük. A márkád belső tudására építünk, de a kivitelezés a mi dolgunk — neked csak jóváhagynod kell."
      },
      {
        "q": "Hogyan kezelitek a negatív kommenteket és a kríziseket?",
        "a": "Előre egyeztetett moderálási elvek mentén, a márkahangod szerint. A jogos panaszt higgadtan, érdemben kezeljük, a trollkodást szabály szerint. Komolyabb krízis esetén azonnal egyeztetünk veled, mielőtt bármit közölnénk."
      },
      {
        "q": "Az influencer marketing benne van a szolgáltatásban?",
        "a": "Igen, ahol indokolt. Releváns partnereket keresünk (nem puszta követőszám alapján), kezeljük a briefet, az együttműködés kereteit és a mérést. Az influencer-díjak külön költségek, ezeket előre, átláthatóan tervezzük."
      },
      {
        "q": "Használtok AI-t a tartalomgyártáshoz?",
        "a": "Igen, józanul: ötleteléshez, vázlatokhoz és ütemezéshez. A végső márkahang, a szerkesztés és a közösségi interakció emberi marad — az AI gyorsít, de nem helyettesíti a hiteles jelenlétet."
      }
    ],
    "cta": "Kérd a díjmentes social media auditot"
  },
  "strategiai-marketing": {
    "slug": "strategiai-marketing",
    "title": "Stratégiai marketing KKV-knak és B2B cégeknek",
    "subtitle": "Audittól az akciótervig: adatvezérelt marketingstratégia, amire mérhetően lehet építeni.",
    "heroDesc": "A stratégia az egyetlen pont, ahol minden marketingforint sorsa eldől. Feltérképezzük a piacodat, a versenytársaidat és a célközönségedet, majd ebből építünk pozicionálást, marketing mixet és KPI-vezérelt akciótervet. Nem kampányt adunk el, hanem irányt — mert nálunk ha nincs stratégia, nincs G2A.",
    "metaTitle": "Stratégiai marketing tanácsadás 2026 – Audit, KPI, akcióterv | G2A Marketing",
    "metaDesc": "Marketing audit, piac- és versenytárselemzés, persona, marketing mix és KPI-vezérelt akcióterv KKV-knak és B2B cégeknek. Kérd az ingyenes konzultációt.",
    "icon": "strategy",
    "color": "#6366f1",
    "intro": "A stratégiai marketing 2026-ban nem PowerPoint-os vízió, hanem működő rendszer: tiszta pozicionálás, mért célcsoport és számon kérhető KPI-ok. A legtöbb KKV és B2B cég nem azért költ rosszul, mert kevés a büdzsé, hanem mert nincs döntési keret — kampányról kampányra reagál, mérés és irány nélkül. A G2A Marketing filozófiája ezért stratégia-első: minden szolgáltatásunk — SEO, PPC, social, web — egy auditált stratégiára épül, nem fordítva. Pécsi gyökerekkel, országos és nemzetközi kiszolgálással dolgozunk; átlátható árazással, havi riporttal és reális időtávokkal. Ez az oldal a zászlóshajónk: itt dől el, hogy a marketinged kiszolgálja az üzleti céljaidat, vagy csak pénzt éget.",
    "benefits": [
      {
        "title": "Marketing audit",
        "desc": "Átvilágítjuk a jelenlegi marketinged: csatornák, üzenetek, weboldal, analitika, költés és eredmények. Megmutatjuk, mi működik, mi szivárogtatja a büdzsét, és hol van a legnagyobb kiaknázatlan lehetőség."
      },
      {
        "title": "Piac- és versenytárselemzés",
        "desc": "Feltérképezzük a piaci pozíciódat és a fő versenytársaid stratégiáját — üzenet, árazás, csatornák, gyenge pontok. Konkrét rést keresünk, ahol meg tudsz különböztetni magad, nem üres SWOT-táblát töltünk ki."
      },
      {
        "title": "Célcsoport és persona",
        "desc": "Adatból és interjúkból építünk 2-3 valós vásárlói personát: ki ő, mi a fájdalompontja, hol érhető el és mi mozgatja a döntését. Minden üzenet és csatorna ezekre épül, nem feltételezésekre."
      },
      {
        "title": "Pozicionálás és üzenetrendszer",
        "desc": "Megfogalmazzuk, miért téged válasszanak a versenytársak helyett. Tiszta értékajánlat és üzeneti pillérek, amelyek minden felületeden — weboldal, hirdetés, ajánlat — következetesen szólalnak meg."
      },
      {
        "title": "Marketing mix és csatornaterv",
        "desc": "Eldöntjük, mely csatornák hozzák a célközönségedet a legjobb megtérüléssel (SEO, PPC, social, e-mail, tartalom), és priorizált terv készül arról, mibe és milyen sorrendben érdemes befektetned."
      },
      {
        "title": "KPI-rendszer és akcióterv",
        "desc": "Mérhető célokat tűzünk ki (lead, CAC, ROAS, konverzió) és priorizált 6-12 hónapos roadmapet építünk. Tudni fogod, mi a következő lépés, mit mérünk és mikor értékelünk újra — havi riporttal."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Felmérés és audit",
        "desc": "Megismerjük az üzleti céljaidat, átvizsgáljuk a jelenlegi marketinged, az analitikádat és az értékesítési folyamatodat. Tényalapú képet kapsz arról, hol állsz ma — szépítés nélkül."
      },
      {
        "step": "02",
        "title": "Piac, versenytárs és célcsoport",
        "desc": "Elemezzük a piacodat és a versenytársaidat, és megépítjük a valós personákat. Itt derül ki, hol van a megkülönböztetési rés, és kihez pontosan érdemes szólnod."
      },
      {
        "step": "03",
        "title": "Stratégia, pozicionálás, marketing mix",
        "desc": "Megfogalmazzuk a pozicionálást és az üzenetrendszert, kiválasztjuk a megfelelő csatornákat, és priorizált marketing mixet tervezünk a büdzséd mellé igazítva."
      },
      {
        "step": "04",
        "title": "KPI, akcióterv és mérés",
        "desc": "Mérhető célokat és KPI-okat rögzítünk, priorizált akciótervet és roadmapet adunk, majd havi riportban követjük az eredményt és finomhangolunk. A stratégia élő dokumentum marad."
      }
    ],
    "faq": [
      {
        "q": "Mennyi idő egy marketingstratégia elkészítése?",
        "a": "Egy fókuszált stratégia audittal, piac- és versenytárselemzéssel, personákkal és akciótervvel jellemzően 3-5 hét. Komplexebb, több üzletágat érintő esetben 6-8 hét — a tempót az határozza meg, milyen gyorsan kapunk hozzáférést az adataidhoz és a csapatodhoz."
      },
      {
        "q": "Mikorra látszik az eredmény?",
        "a": "Maga a stratégia azonnal használható döntési keret. A megvalósítás eredménye csatornafüggő: a fizetett kampányok pár hét alatt mérhetők, egy SEO- vagy tartalmi irány jellemzően 3-6 hónap alatt hoz mérhető organikus növekedést. Reális időtávokat ígérünk, nem csodát."
      },
      {
        "q": "Mennyibe kerül a stratégiai marketing?",
        "a": "Az ár a cég méretétől, a piac komplexitásától és a kívánt mélységtől függ. Az első konzultáció ingyenes, utána fix árú stratégiai csomagot ajánlunk — átlátható, előre rögzített díjjal, rejtett platform-számla nélkül. Pontos ajánlatot a felmérés után adunk."
      },
      {
        "q": "Mire jó nekem konkrétan a stratégia?",
        "a": "Arra, hogy ne kampányról kampányra égesd a pénzt. Tudni fogod, kinek, milyen üzenettel, melyik csatornán és milyen sorrendben érdemes költened — és lesz KPI-d, amin lemérheted, működik-e. Ez a kapacitásod legjobb hozamú befektetése."
      },
      {
        "q": "Csak a stratégiát kapom, vagy a megvalósítást is?",
        "a": "Ahogy neked jobb. Sok ügyfél a stratégiát viszi és saját csapatával valósítja meg — ez teljesen rendben van, a roadmap erre is alkalmas. Ha kéred, a megvalósítást is mi visszük: SEO, PPC, social, web — mind ugyanarra a stratégiára épül."
      },
      {
        "q": "Használtok AI-t a stratégiakészítéshez?",
        "a": "Igen, eszközként. AI-t használunk piac- és versenytárs-adatok gyorsabb feldolgozására és forgatókönyvek modellezésére, de a pozicionálás és a döntések emberi szakértelemen alapulnak. Az AI gyorsít, nem helyettesít — józanul integráljuk, nem varázslatként áruljuk."
      }
    ],
    "cta": "Kérd az ingyenes stratégiai konzultációt"
  },
  "keresooptimalizalas": {
    "slug": "keresooptimalizalas",
    "title": "Keresőoptimalizálás (SEO), ami mérhető organikus növekedést hoz",
    "subtitle": "Technikai SEO, tartalom és linképítés egy stratégiában — hogy a megfelelő emberek megtaláljanak a Google-ben és az AI-keresőkben is.",
    "heroDesc": "Az organikus keresés a leghosszabb távon megtérülő marketing-csatorna: nem a hirdetési kattintást fizeted, hanem a láthatóságot építed. Technikai SEO audittal, on-page optimalizálással, tartalom-SEO-val és linképítéssel hozzuk fel a weboldaladat a Google találati listáján — és 2026-ban már az AI-válaszokban is. Stratégia nélkül nem kezdünk bele, és minden hónapban átlátható riportban látod, mi mozdult.",
    "metaTitle": "Keresőoptimalizálás (SEO) szakértőkkel 2026 – G2A Marketing",
    "metaDesc": "Technikai SEO audit, on-page, tartalom-SEO, linképítés és lokális SEO mérhető organikus növekedésért. Átlátható havi riport, AI-keresés. Kérd az auditot!",
    "icon": "seo",
    "color": "#0891b2",
    "intro": "A keresőoptimalizálás 2026-ban már nem csak a Google tíz kék linkjéről szól: a Google AI Overviews, a ChatGPT és a Perplexity is válaszforrásokat idéz, és neked ott is láthatónak kell lenned (AEO/GEO). Ettől függetlenül az alap változatlan: gyors, technikailag tiszta weboldal, hasznos tartalom és hiteles hivatkozások. A G2A Marketingnél stratégiával kezdünk — kulcsszó-kutatással, versenytárs-elemzéssel és technikai audittal feltérképezzük, hol állsz —, majd a technikai SEO, az on-page optimalizálás, a tartalommarketing és a linképítés egy rendszerbe áll össze. Nincs rejtett platform-számla, nincs üres ígéret: egy SEO-stratégia jellemzően 3-6 hónap alatt hoz mérhető organikus növekedést, és minden hónapban átlátható riportban követed, mi történik a kulcsszavaiddal, a forgalmaddal és a Core Web Vitals-mutatóiddal.",
    "benefits": [
      {
        "title": "Technikai SEO audit",
        "desc": "Feltérképezzük, mi tartja vissza a weboldaladat: indexelési és crawl-problémák, sebesség, struktúra, hibás átirányítások, duplikált tartalom, strukturált adatok. Priorizált hibalistát kapsz, fontossági sorrendben."
      },
      {
        "title": "On-page optimalizálás",
        "desc": "Címsorok, meta-elemek, belső linkstruktúra, URL-ek és kulcsszó-térkép a keresési szándékhoz igazítva — hogy a Google pontosan értse, miről szól minden oldalad, és kinek szól."
      },
      {
        "title": "Tartalom-SEO és tartalommarketing",
        "desc": "Kulcsszó-kutatásból induló tartalomstratégia: olyan cikkek és oldalak, amelyek a vásárlói kérdésekre válaszolnak. Ez az alapja annak is, hogy az AI-keresők (AI Overviews, ChatGPT, Perplexity) idézzenek."
      },
      {
        "title": "Linképítés (link building)",
        "desc": "Hiteles, releváns hivatkozások építése fokozatosan, kockázat nélkül. Minőség mennyiség helyett — nincs spamlink, nincs büntetést kockáztató rövidítés, mert a Google azt előbb-utóbb leszámolja."
      },
      {
        "title": "Lokális SEO",
        "desc": "Google Business Profile, lokális kulcsszavak, vélemények és helyi említések — hogy a környékeden és a célvárosaidban is megtaláljanak, amikor épp keresnek. Pécsi gyökerekkel, országos kiszolgálással."
      },
      {
        "title": "Core Web Vitals és AI-láthatóság",
        "desc": "A betöltési sebesség, stabilitás és reszponzivitás ma rangsoroló tényező és felhasználói élmény egyben. Emellett felkészítjük a tartalmadat az AI-válaszokban való megjelenésre (AEO/GEO)."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit és kulcsszó-kutatás",
        "desc": "Technikai SEO audittal, versenytárs-elemzéssel és kulcsszó-kutatással kezdünk: hol állsz most, mire keresnek a vásárlóid, és hol a legnagyobb a kihasználatlan lehetőség. Innen születik a stratégia."
      },
      {
        "step": "02",
        "title": "Stratégia és priorizálás",
        "desc": "Összeállítjuk a SEO-roadmapet: mit javítunk először (jellemzően a technikai akadályok), milyen tartalom kell, és hogyan épül a linkprofil. Reális ütemezéssel és mérhető KPI-okkal — nincs stratégia, nincs G2A."
      },
      {
        "step": "03",
        "title": "Megvalósítás",
        "desc": "Technikai hibák javítása, on-page optimalizálás, tartalomgyártás és linképítés lépésről lépésre. Folyamatosan dolgozunk a Core Web Vitals-on és az AI-keresőkre való felkészítésen is."
      },
      {
        "step": "04",
        "title": "Mérés és havi riport",
        "desc": "Minden hónapban átlátható riportot kapsz: kulcsszó-pozíciók, organikus forgalom, konverziók és a következő lépések. A stratégiát az adatok alapján finomítjuk — nem érzésre."
      }
    ],
    "faq": [
      {
        "q": "Mennyi idő alatt láthatók az első eredmények?",
        "a": "A SEO közép- és hosszú távú befektetés. A technikai javítások hatása már 4-8 hét alatt jelentkezhet, de egy SEO-stratégia jellemzően 3-6 hónap alatt hoz mérhető organikus növekedést. Verseny, kiindulási állapot és tartalom-tempó függvénye."
      },
      {
        "q": "Garantáltok első helyet a Google-ben?",
        "a": "Nem — és aki garantál, attól óvakodj. A rangsorolás a Google algoritmusától függ, amit senki nem irányít. Amit garantálunk: priorizált, szakszerű munka, mérhető folyamat és átlátható riport. Reálisan beszélünk a vártható eredményekről."
      },
      {
        "q": "Mi az a Core Web Vitals, és miért fontos?",
        "a": "A Core Web Vitals a Google felhasználói-élmény mutatói: betöltési sebesség, interaktivitás és vizuális stabilitás. Rangsoroló tényezők, és közvetlenül befolyásolják a konverziót — egy lassú oldalt a látogató elhagy, mielőtt a tartalmat látná."
      },
      {
        "q": "Az AI-keresők korában van még értelme a SEO-nak?",
        "a": "Igen, sőt felértékelődött. A Google AI Overviews, a ChatGPT és a Perplexity is a jól strukturált, hiteles tartalmakat idézi forrásként. Aki a klasszikus SEO-alapokat jól csinálja, az az AI-válaszokban (AEO/GEO) is láthatóbb lesz."
      },
      {
        "q": "Mit kapok a havi riportban?",
        "a": "Kulcsszó-pozíciókat, organikus forgalmi és konverziós adatokat, az elvégzett munkát és a következő hónap terveit — érthető nyelven, nem csak grafikonokkal. Bármikor látod, mi történt és miért, rejtett platform-számla nélkül."
      },
      {
        "q": "A linképítés nem kockázatos? Nem büntet érte a Google?",
        "a": "A spam-jellegű, vásárolt tömeglink kockázatos és a Google leszámolja. Mi hiteles, releváns hivatkozásokat építünk fokozatosan — minőséget mennyiség helyett. Ez tartós eredményt ad, nem rövid életű ugrást, amit egy frissítés visszavesz."
      }
    ],
    "cta": "Kérd az ingyenes SEO auditot"
  },
  "webfejlesztes": {
    "slug": "webfejlesztes",
    "title": "Webfejlesztés és CRO — weboldal, ami nem csak szép, hanem konvertál",
    "subtitle": "Egyedi weboldalak, webáruházak és landing oldalak, amelyeket a látogatóból vásárlóvá tett konverzió köré építünk.",
    "heroDesc": "A weboldalad nem dekoráció, hanem értékesítési eszköz. Gyors, mobilbarát és kereshető felületeket fejlesztünk — egyedi kódtól WordPressig és webáruházig —, majd folyamatos konverzió-optimalizálással (CRO) javítjuk az eredményt. A cél nem a tetszetős design, hanem a mérhető több érdeklődő és vásárló.",
    "metaTitle": "Webfejlesztés és CRO 2026 — konverzióra optimalizált weboldalak | G2A Marketing",
    "metaDesc": "Egyedi weboldal, WordPress, Shopify és WooCommerce webáruház, landing page és CRO. Gyors, reszponzív, SEO-barát fejlesztés mérhető konverzióval. Kérj auditot!",
    "icon": "web",
    "color": "#f97316",
    "intro": "2026-ban a weboldal a legtöbb KKV legfontosabb értékesítési csatornája — mégis a legtöbb honlap látogatókat veszít: lassú, mobilon töredezik, és a felhasználó nem találja meg, mit kell tennie. A Google a Core Web Vitals mérőszámokat rangsorolási tényezőként használja, így a lassú oldal kétszeresen büntet: rosszabb helyezés és kevesebb konverzió. A G2A Marketing nem „weboldalt csinál”, hanem konverziós rendszert épít: egyedi fejlesztés, WordPress vagy webáruház (Shopify, WooCommerce) a feladathoz illesztve, technikai SEO-val a kódban és folyamatos CRO-val a launch után. Ha nincs stratégia és mérés, nincs G2A — a design eszköz, nem a végeredmény.",
    "benefits": [
      {
        "title": "Konverzióra tervezve, nem csak szépségre",
        "desc": "A design a cél felé tereli a látogatót: tiszta információs hierarchia, erős CTA-k, súrlódásmentes űrlapok. A szép felület alap, a konverzió a mérce — minden elemnek üzleti funkciója van."
      },
      {
        "title": "A feladathoz illő technológia",
        "desc": "Nem mindenre WordPress, és nem mindenre egyedi kód. Tartalmas oldalra WordPress, webáruházra Shopify vagy WooCommerce, komplex igényre custom fejlesztés — azt választjuk, ami a te eseteddel a legjobb ár-érték arányt adja."
      },
      {
        "title": "Sebesség és Core Web Vitals",
        "desc": "Optimalizált kód, képek és betöltés, hogy az oldal gyorsan jelenjen meg mobilon is. A jó Core Web Vitals értékek egyszerre javítják a Google-helyezést és csökkentik a lemorzsolódást a betöltés alatt."
      },
      {
        "title": "Reszponzív, mobil-első felület",
        "desc": "A forgalom java mobilról érkezik, ezért mobil-első szemlélettel fejlesztünk. Minden képernyőméreten olvasható, kattintható és vásárolható marad a felület — telefonon, tableten, asztali gépen."
      },
      {
        "title": "SEO-barát alap a kódban",
        "desc": "Tiszta, szemantikus kód, helyes címkézés, gyors betöltés és strukturált adatok — hogy a keresőoptimalizálás ne utólagos toldozás legyen, hanem már az alapokban benne legyen."
      },
      {
        "title": "Átlátható árazás és karbantartás",
        "desc": "Előre tisztázott hatókör és ár, nincs rejtett platform-számla. Indulás után frissítések, biztonsági mentések, hibajavítás és teljesítmény-felügyelet — a weboldal hosszú távon is karbantartott eszköz marad."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Felmérés és konverziós cél",
        "desc": "Megnézzük a jelenlegi oldalt (vagy a nulláról induló igényt), a célközönséget és az üzleti célt. Tisztázzuk, mit jelent a „siker”: ajánlatkérés, vásárlás, foglalás — és milyen KPI-okkal mérjük."
      },
      {
        "step": "02",
        "title": "Architektúra, UX és technológiaválasztás",
        "desc": "Felépítjük az oldalstruktúrát és a felhasználói utat a konverzió köré, majd kiválasztjuk a platformot (egyedi, WordPress, Shopify, WooCommerce). A wireframe és a tartalmi terv jóváhagyásával indul a fejlesztés."
      },
      {
        "step": "03",
        "title": "Fejlesztés, tartalom és tesztelés",
        "desc": "Reszponzív, gyors és SEO-barát kódot írunk, feltöltjük a tartalmat, és minden eszközön teszteljük. A Core Web Vitals értékeket és az űrlapok, fizetés, kosár működését élesítés előtt ellenőrizzük."
      },
      {
        "step": "04",
        "title": "Élesítés, mérés és folyamatos CRO",
        "desc": "Indítás után beállítjuk a mérést (analitika, konverziókövetés), és elkezdődik a konverzió-optimalizálás: A/B tesztek, viselkedés-elemzés, finomítás. Havi riportban átlátható, mi javult."
      }
    ],
    "faq": [
      {
        "q": "Mennyi idő egy weboldal elkészítése?",
        "a": "Egy egyszerű landing page vagy bemutatkozó oldal jellemzően 2-4 hét, egy összetettebb céges weboldal 4-8 hét, egy webáruház pedig a termékkört és integrációkat tekintve általában 6-12 hét. A pontos ütemtervet a felmérés után adjuk, mert a tartalom és a döntési körök gyakran többet nyomnak, mint maga a fejlesztés."
      },
      {
        "q": "WordPress, Shopify, WooCommerce vagy egyedi fejlesztés legyen?",
        "a": "Attól függ, mire használod. Tartalmas, gyakran frissülő oldalra a WordPress praktikus; webáruházhoz a Shopify gyors indulást, a WooCommerce nagyobb szabadságot ad; egyedi, sok logikát igénylő igényre custom fejlesztést javaslunk. A felmérés után azt ajánljuk, ami a te eseteddel a legjobb ár-érték arányt hozza — és ha valamire nincs szükséged, megmondjuk."
      },
      {
        "q": "Mit jelent pontosan a CRO, és miért fontos?",
        "a": "A CRO (konverzió-optimalizálás) az a folyamat, amelyben a meglévő forgalomból több látogatót teszünk vásárlóvá vagy érdeklődővé — anélkül, hogy több hirdetést kellene venned. Méréssel, A/B tesztekkel és viselkedés-elemzéssel finomítjuk az oldalt. Ezért nem áll meg a munkánk a launch-nál: a szép oldal csak a kiindulás, az eredményt a folyamatos optimalizálás hozza."
      },
      {
        "q": "Miért számít a sebesség és a Core Web Vitals?",
        "a": "A lassú oldalról a látogatók egy része még betöltés előtt elnavigál, a Google pedig a Core Web Vitals mérőszámokat rangsorolási tényezőként veszi figyelembe. Egy lassú oldal tehát kétszeresen büntet: rosszabb keresőhelyezés és alacsonyabb konverzió. Optimalizált kóddal, képekkel és betöltéssel ezt javítjuk."
      },
      {
        "q": "A meglévő weboldalamat is tudjátok javítani, vagy csak újat építetek?",
        "a": "Mindkettő működik. Sok esetben egy technikai és CRO-audit után a meglévő oldalon is jelentős javulás érhető el (sebesség, mobilélmény, konverziós pontok). Ha viszont az alaprendszer elavult vagy nehezen karbantartható, gyakran az újraépítés a gazdaságosabb. A felmérésen őszintén megmondjuk, melyik az értelmes út."
      },
      {
        "q": "Mi van a weboldallal az átadás után?",
        "a": "Kérhetsz folyamatos karbantartást: frissítések, biztonsági mentések, hibajavítás, teljesítmény- és biztonsági felügyelet, valamint a CRO-folyamat továbbvitele. Az árazás előre tisztázott, nincs rejtett platform-számla — és ha a saját csapatod viszi tovább, az átadást rendezetten, dokumentációval készítjük elő."
      }
    ],
    "cta": "Kérd az ingyenes weboldal- és CRO-auditot"
  },

  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI Marketing",
    subtitle: "Mesterséges intelligencia a marketing minden szakaszában",
    heroDesc:
      "A mesterséges intelligencia új távlatokat nyit a marketingben: pontosabb célzás, személyre szabott tartalom, prediktív elemzés. Csökkentjük a manuális munkát, és új bevételi lehetőségeket teremtünk.",
    metaTitle: "AI Marketing Ügynökség 2026 | G2A Marketing",
    metaDesc:
      "AI marketing, ami megtérül: prediktív elemzés, személyre szabott tartalom, automatizált hirdetésoptimalizáció. Megmutatjuk, hol gyorsít az AI — és hol nem.",
    icon: "bot",
    color: "#7c3aed",
    intro:
      "Az AI 2024-2026 között lett operatívan használható eszköz a marketingben — a hype-ot felváltotta a reális ROI. A G2A Marketing belső munkafolyamataiban napi szinten dolgozunk Claude, ChatGPT, Manus, Gemini, Midjourney, Runway, ElevenLabs és Cursor eszközökkel — a tartalomgyártástól az ügyfélprojektek auditjáig. Ezt a tapasztalatot hozzuk az ügyfél-projektekbe: nem ígéretként, hanem konkrét, mérhető folyamat-gyorsításként.",
    benefits: [
      {
        title: "Prediktív elemzés",
        desc: "Vásárlói minták előrejelzése (mikor vásárol legközelebb, mikor lemorzsolódik), kampány-eredmények szimulálása indítás előtt — Google AI + saját modellek alapján.",
      },
      {
        title: "Személyre szabott tartalom",
        desc: "Dinamikus email- és webtartalom: minden látogató a viselkedése alapján mást lát. HubSpot Smart Content + Mutiny + saját workflow alapján.",
      },
      {
        title: "Automatizált hirdetésoptimalizáció",
        desc: "Performance Max, Smart Bidding, Meta Advantage+ kampányok mesterséges intelligenciával — a kreatívokat és a célzást a Google/Meta AI iterálja, mi a stratégiai keretet és a tiltólistákat adjuk.",
      },
      {
        title: "Chatbot és AI ügynök integráció",
        desc: "24/7 ügyfélszolgálat AI chatbotokkal (Intercom Fin, Drift, vagy custom Claude API alapú megoldás). Tipikusan 60-70%-os first-touch resolution rate az 1. hónap után.",
      },
      {
        title: "AI-támogatott tartalomgyártás",
        desc: "Blog drafts, social copy, ad creatives — Claude + Midjourney + Runway hibrid pipeline-on. Heti tartalom-output 3-5x növelhető a minőség megtartásával.",
      },
      {
        title: "Konverzióoptimalizáció gépi tanulással",
        desc: "Prediktív A/B tesztek (előre megsaccoljuk melyik variáns nyer), AI-alapú UX heatmap-elemzés, dinamikus landing page elemek látogató-szegmens szerint.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Igényfelmérés és AI audit",
        desc: "Feltérképezzük a marketingfolyamataidat, megnézzük hol a legmagasabb ROI az AI-integrációnak — és hol fals barát. Konkrét javaslat-csomag KPI-okkal.",
      },
      {
        step: "02",
        title: "Adatstratégia és platform-választás",
        desc: "Az AI csak annyira jó amennyi tiszta adatod van. Adat-pipeline-t építünk (CDP, GA4, CRM event tracking) és kiválasztjuk a feladathoz illő AI eszközöket.",
      },
      {
        step: "03",
        title: "AI megoldások integrálása",
        desc: "Step-by-step bevezetés — egy folyamatot egyszerre. Pilot-tal kezdünk, mérünk, csak utána skálázunk. Soha nem 5 párhuzamos AI projekt egyszerre.",
      },
      {
        step: "04",
        title: "Mérés és iteráció",
        desc: "Havi review riport: az AI által hozott idő- és költségmegtakarítás vs. a beállítási költség. Kvartális stratégiai felülvizsgálat új eszközökkel.",
      },
    ],
    faq: [
      {
        q: "Mekkora cégeknek ajánlott az AI marketing?",
        a: "Minden méretnek, de más-más eszközökkel. KKV-knál a content + ad creative AI-támogatás (Claude + Midjourney + Runway) hozza a leggyorsabb megtérülést. Középvállalatnál a prediktív analitika és a CRM-AI integráció. Enterprise-nál a custom modell-fine-tuning saját adatra.",
      },
      {
        q: "Mennyi idő alatt láthatók az eredmények?",
        a: "Tartalom-pipeline gyorsítás: 2-3 hét. AI-támogatott hirdetés-optimalizáció: 4-6 hét. Prediktív analitika és személyre szabás: 3-4 hónap (mert adat kell hozzá). Custom AI ügynök: 6-9 hónap teljes ROI-hoz.",
      },
      {
        q: "Milyen AI eszközöket használtok konkrétan?",
        a: "LLM: Claude (1M token kontextushoz), ChatGPT (általános), Gemini (Workspace integráció), Manus (autonom ügynökök). Kép: Midjourney v7, DALL·E 3, Adobe Firefly. Videó: Runway Gen-4, Sora. Hang: ElevenLabs. Marketing-specifikus: HubSpot AI, Surfer, Frase, Clearscope. Részletes lista: /technologia oldal.",
      },
      {
        q: "Növeli-e az AI a hirdetések költségét?",
        a: "Rövid távon van egy beállítási költség (audit, integráció, tréning) — jellemzően egyszeri 300-800 ezer Ft. Hosszabb távon 20-40%-os hatékonyság-növekedést hoz: ugyanannyi spendből több konverzió, vagy ugyanannyi konverzió kevesebb spendből.",
      },
      {
        q: "Hogyan integrálható a meglévő rendszereinkkel?",
        a: "API-integrációval. A leggyakoribb: HubSpot/Salesforce CRM + Claude API ügyfél-emailezésre, GA4 + Google AI prediktív analitikára, Intercom + custom RAG (saját ügyféldokumentum-bázis) chatbothoz. A G2A írja meg a workflow-kat, te csak a végén kapod a kész integrációt.",
      },
      {
        q: "Mi a helyzet a GDPR-ral és az adatvédelemmel?",
        a: "Az AI eszközök közül kiválasztjuk azokat, amelyek EU-régióban dolgoznak vagy szerződéses garanciával nem használják az adataidat tréningre. OpenAI, Anthropic és Google enterprise verziói mind biztosítanak ilyen opciót. A G2A nem küld ügyfél-adatot OpenAI free tieres végpontra — kizárólag enterprise/zero-retention végpontokon.",
      },
    ],
    cta: "Kérd az ingyenes AI marketing auditot",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC és Google Ads",
    subtitle: "Fizetett hirdetés, ami megtérül — minden Google csatornán",
    heroDesc:
      "Fizetett hirdetések nélkülözhetetlenek, ha gyorsan akarsz új ügyfeleket. Adatvezérelt PPC kampányokat építünk a Google keresőben, Display Networkön, Shoppingon és YouTube-on — mindig az üzleti céljaidhoz igazítva.",
    metaTitle: "Google Ads & PPC Ügynökség 2026 — Mérhető ROI | G2A",
    metaDesc:
      "Adatvezérelt Google Ads kampányok: Search, Shopping, YouTube, Performance Max. Átlátható árazás, heti optimalizáció. Kérd az ingyenes Google Ads auditot.",
    icon: "target",
    color: "#ea4335",
    intro:
      "A Google Ads 2026-ra szinte mindenhol „smart bidding” alapú lett — ami azt jelenti, hogy a manuális bid menedzsment kora véget ért, és helyébe a stratégia, a struktúra és a konverzió-jelek minősége lépett. A modern Google Ads ügynökség munkája ma 30%-ban kreatív, 30%-ban adat-engineering, 20%-ban tracking-setup és 20%-ban stratégia. A G2A pontosan ezt a kombinációt szállítja.",
    benefits: [
      {
        title: "Search Ads",
        desc: "Kulcsszó-alapú hirdetések kereső szándékkal. SKAG vagy SPAG kampánystruktúra, broad match + audience signal, dinamikus search ads (DSA) hosszú-tail keresésre.",
      },
      {
        title: "Display Network és YouTube",
        desc: "Vizuális hirdetések a Google partnerhálózatán + YouTube-on. TrueView for Action és Demand Gen kampányok, retargeting az egész web-en.",
      },
      {
        title: "Shopping (e-kereskedelem)",
        desc: "Termék-alapú hirdetések webshopoknak. Merchant Center feed-optimalizálás, kategória-szintű tender stratégia, custom labels szezonalitásra.",
      },
      {
        title: "Performance Max",
        desc: "Cross-channel AI-kampány. Asset group struktúra ügyfél-szegmensenként, audience signal stratégia, brand exclusion + tiltólista — hogy ne kannibalizálja a Search-öt.",
      },
      {
        title: "Remarketing és audience",
        desc: "Customer Match listák (e-mail upload), website-visitor remarketing, similar audience, lookalike. A LTV-alapú szegmens stratégia.",
      },
      {
        title: "Konverziókövetés és tracking",
        desc: "GA4 + Google Tag Manager + enhanced conversions + offline conversion import (CRM-ből visszaszinkronizálva). Pontos attribution az értékesítésig.",
      },
    ],
    process: [
      {
        step: "01",
        title: "PPC audit",
        desc: "Szabad fiók-átvilágítás (vagy ha nincs, kulcsszó-térkép). Mérjük a Quality Score-t, a wasted spend %-ot, a konverzió-tracking pontosságát. Azonnal használható javaslatlista.",
      },
      {
        step: "02",
        title: "Kulcsszó- és audience-kutatás",
        desc: "Iparág-specifikus kulcsszó-térkép, intent-szegmenseléssel. Versenytárs ad copy elemzés. Audience-listák felépítése (1st party + Customer Match + similar).",
      },
      {
        step: "03",
        title: "Kampányfelépítés és launch",
        desc: "SKAG/SPAG struktúra, ad copy variánsok (4-6 / ad group), responsive search ads, image extension. Indulás előtt teljes tracking-validation.",
      },
      {
        step: "04",
        title: "Heti optimalizáció és riport",
        desc: "Heti negative keyword bővítés, ad copy iteráció, audience tuning. Havi teljes riport: Search Term riport, Auction Insights, ROAS trend. Kvartálos stratégiai review.",
      },
    ],
    faq: [
      {
        q: "Mekkora költségvetséggel érdemes kezdeni?",
        a: "Iparágtól függ erősen. Helyi szolgáltatás (fodrász, autószerviz): 100-200 ezer Ft/hó. KKV B2B vagy webshop: 300-800 ezer Ft. Középvállalat / e-commerce: 1-3M Ft+. A magas CPC-jű iparágakban (jog, biztosítás, finanszírozás) 800 ezer Ft alatt nehéz mérhető eredményt elérni.",
      },
      {
        q: "Mi a különbség a Search és a Performance Max között?",
        a: "Search = pontos kulcsszó-célzás keresési szándékkal — több kontroll, alacsonyabb skálázhatóság. Performance Max = AI-vezérelt cross-channel — kevesebb kontroll, sokkal nagyobb skálázhatóság. Optimális stratégia: Search a brand + magas-intent kulcsszókra, Performance Max a discovery + új ügyfél-akvizícióra.",
      },
      {
        q: "Kezeltek YouTube és Shopping kampányt is?",
        a: "Igen, mind a négy fő kampánytípust (Search, Display + YouTube, Shopping, Performance Max). YouTube-ra dedikált videós kreatív partnert is tudunk hozni, Shopping-hoz Merchant Center feed optimalizálás (TecDoc/Carzone autóipari, vagy custom WooCommerce/Shopify feed).",
      },
      {
        q: "Hogyan mérjük a kampány sikerét?",
        a: "Konverziók, CPA (cost per acquisition), ROAS (return on ad spend) — alapokon. Plus: Quality Score átlag, Search Impression Share, brand vs non-brand revenue split. Webshopnak: CLV-alapú ROAS (nem csak az első vásárlás, hanem 12 hónapos érték).",
      },
      {
        q: "Mennyi az ügynökségi díj?",
        a: "Két modell: (1) fix retainer (200-600 ezer Ft/hó a kampány-méret függvényében); (2) media spend %-a (10-15%, jellemzően nagyobb kampányoknál). A G2A nem rejt el platform-számlát — minden hirdetési költés közvetlenül a te kártyádról megy a Google-nek.",
      },
      {
        q: "Szükséges-e hosszú távú szerződés?",
        a: "Nem, 30 napos felmondási idővel működünk. De őszintén: Google Ads-ben 2-3 hónap kell ahhoz hogy a smart bidding tanuljon, a Quality Score stabilizálódjon, és valódi optimalizációs munka történjen. 1-hónapos kísérletezés ritkán szállít.",
      },
    ],
    cta: "Kérd az ingyenes Google Ads auditot",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta Ads (Facebook + Instagram)",
    subtitle: "Közösségi média hirdetés, ami konverziót szállít",
    heroDesc:
      "A közösségi média hirdetésekkel pontosan azt a célcsoportot érjük el, amely a legnagyobb valószínűséggel válik ügyféllé. Kreatív és adatvezérelt kampányokat tervezünk a Meta (Facebook, Instagram) és LinkedIn platformokon — amelyek nem csak elérést, hanem valódi konverziót hoznak.",
    metaTitle: "Meta Ads Ügynökség 2026 — Hirdetés, ami konvertál | G2A",
    metaDesc:
      "Eredményorientált Facebook, Instagram és LinkedIn hirdetéskezelés: Reels-first kreatív, Conversion API, A/B teszt. Kérd az ingyenes Meta Ads auditot.",
    icon: "smartphone",
    color: "#1877f2",
    intro:
      "A Meta platformokon (Facebook + Instagram) magyar viszonylatban naponta 6+ millió aktív felhasználó mozog. A 2021-es Apple iOS 14.5 ATT-változás óta a célzás bizonytalanabb lett — emiatt 2026-ban a Meta Ads sikere kulcsban a kreatívra és a Conversion API-ra esik. A G2A pontosan ezekre fókuszál: gyors kreatív-iteráció + tiszta server-side conversion tracking.",
    benefits: [
      {
        title: "Facebook Ads (CBO + ASC)",
        desc: "Campaign Budget Optimization vagy Advantage+ Shopping Campaigns. Audience signal stratégia, cold + warm + hot funnel-szakaszok elkülönítése.",
      },
      {
        title: "Instagram Ads (Stories + Reels)",
        desc: "Reels-first kreatív stratégia (a Reels-eken jelenleg legolcsóbb a CPM). Stories swipe-up integráció, mobil-first élmény.",
      },
      {
        title: "LinkedIn Ads (B2B)",
        desc: "Sponsored Content, Message Ads, Lead Gen Forms B2B targeting-gel. Cég-méret, szerepkör, iparág + matched audience kombinációk.",
      },
      {
        title: "Lookalike és Custom Audience",
        desc: "1%-os, 3%-os, 5%-os lookalike szegmensek, a legjobb 10% LTV-jű ügyfél seed-jén. Customer Match e-mail upload + website visitor.",
      },
      {
        title: "Lead Generation Ads",
        desc: "On-platform lead form-ok — a felhasználó nem hagyja el a Facebookot. Magasabb konverzió, alacsonyabb CPL, de gyengébb lead-minőség (pre-screening kérdések kellenek).",
      },
      {
        title: "Conversion API + Pixel",
        desc: "Server-side esemény-küldés (post-iOS14 megoldás). Stripe/HubSpot/Shopify integráció + offline conversion import a CRM-ből.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pixel + CAPI telepítés",
        desc: "Meta Pixel + Conversion API beállítása teljes server-side eseménysorral. Event Match Quality 70%+ cél (a 30%-os átlaggal szemben) — ez 20-30%-kal javítja a kampány-teljesítményt.",
      },
      {
        step: "02",
        title: "Audience-térkép és kreatív brief",
        desc: "Cold + warm + hot szegmens definíció. Versenytárs ad library mining (Meta Ad Library + Foreplay). Kreatív brief 5-8 koncepcióval.",
      },
      {
        step: "03",
        title: "Kreatív gyártás és launch",
        desc: "5-8 kreatív variáns / ad set (statikus + video + carousel + UGC stílus). Indulás 50/50 cold-warm split, gyors első hét tanulása.",
      },
      {
        step: "04",
        title: "Iteráció és skálázás",
        desc: "Heti kreatív rotáció (creative fatigue elleni stratégia), audience expansion. Skálázás CBO-n keresztül, ad set duplikáció a winning kreatívokra.",
      },
    ],
    faq: [
      {
        q: "Mennyi idő alatt kezdhetünk hirdetni?",
        a: "1-2 héten belül felépítjük a struktúrát: Pixel + Conversion API setup (3-4 nap), audience-térkép (2 nap), első kreatív-batch (5-7 nap). Indulás után az első tanuló-fázis 7-14 nap.",
      },
      {
        q: "Mitől függ a kampány költségvetése?",
        a: "Iparág (CPM 600-3500 Ft, jellemzően), célcsoport-méret (kisebb = drágább kreatív kell), és a funnel-szakasz. Reális minimum: havi 200-400 ezer Ft helyi vállalkozásnak; 600 ezer–1.5M Ft webshopnak vagy B2B leadgennek.",
      },
      {
        q: "Milyen kreatívokra van szükség?",
        a: "2026-ban Reels-first: 9:16 vertikális videó (15-30 mp), feliratokkal (a 80% mute néz), gyors hook (első 1-2 mp). Mellé statikus carousel és UGC stílusú felvételek. A G2A vagy partner-stúdióval gyártjuk, vagy a saját anyagaidat optimalizáljuk.",
      },
      {
        q: "Tudtok organikus social media stratégiában is segíteni?",
        a: "Igen, dedikált közösségi média menedzsment szolgáltatás van: tartalomnaptár, content gyártás, közösség-moderáció, influencer-kapcsolatok. A két szolgáltatás (organikus + paid) együtt 2-3x hatékonyabb mint külön-külön.",
      },
      {
        q: "Hogyan mérjük a sikerességet?",
        a: "CPC (kattintási költség), CPM (ezer megjelenés ár), CTR, CPA (cost per acquisition), ROAS (return on ad spend) — alapokon. Plus: Brand Lift Study (nagyobb kampányoknál), iOS 14.5 utáni privacy-conscious attribution model.",
      },
      {
        q: "Mi a helyzet az iOS 14.5 utáni nyomon-követéssel?",
        a: "Az ATT (App Tracking Transparency) miatt a Pixel csak részleges adatot kap. Ezért fontos a Conversion API: server-side eseménykövetés, ami iOS-en is működik. A G2A minden új projekten alapból CAPI-t telepít (nem opcióként).",
      },
    ],
    cta: "Kérd az ingyenes Meta Ads auditot",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "Tartalommarketing",
    subtitle: "Értékteremtő történetek, amelyek eladnak",
    heroDesc:
      "A tartalommarketing nem csak cikkek gyártásáról szól; stratégiát alkotunk, amely hitelesen közvetíti márkád értékeit és a közönséged problémáira kínál megoldást. Blogtól videóig, podcasttől hírlevélig — segítünk a tervezésben, gyártásban és terjesztésben.",
    metaTitle: "Tartalommarketing 2026 — SEO és AI-keresőkre | G2A",
    metaDesc:
      "Márkahitelesség és organikus forgalom: blog, videó, podcast, hírlevél. Pillar-cluster stratégia, AI-keresőre optimalizált tartalom. Ingyenes tartalom audit.",
    icon: "pen",
    color: "#10b981",
    intro:
      "A B2B és KKV-szegmensben a tartalommarketing a legjobb hosszú-távú befektetés: 1 jól megírt long-form cikk 3-5 évig hozhat organikus forgalmat. Ugyanakkor 2026-ban a Google AI Overviews és a ChatGPT-keresés átalakítja a játékot — most már nem elég jó tartalmat írni, hanem strukturáltan, schema-val, kérdés-választos formában kell, hogy az AI-keresés is referenciának használja.",
    benefits: [
      {
        title: "Blogstratégia és long-form cikkek",
        desc: "Kulcsszó-térkép és cluster-stratégia (pillar + cluster), 1500-3500 szavas cikkek. Schema.org Article/FAQ markup, AI Overviews-ra optimalizált formátum.",
      },
      {
        title: "Videó és podcast",
        desc: "Forgatókönyvírás, YouTube SEO (cím, leírás, fejezet-jelölők), thumbnail A/B teszt. Podcast: téma-strukturálás, gyártás, vágás, terjesztés (Spotify/Apple/YouTube).",
      },
      {
        title: "Hírlevél és leadmágnes",
        desc: "Heti/havi hírlevél stratégia (témaválasztó automatizációval), e-book és whitepaper-gyártás email-feliratkozással szemben. Resend/Mailchimp integrációval.",
      },
      {
        title: "Thought leadership és LinkedIn",
        desc: "A vezető személyiség nevén futó cikkek és LinkedIn-poszt sorozatok. Iparági trend-elemzések, vélemény-cikkek, élethelyzet-narratívák — a brandet humanizálva.",
      },
      {
        title: "Tartalomterjesztés és PR",
        desc: "Owned (saját) + earned (PR) + paid (boost) háromrétegű terjesztés. Outreach iparági médiához, vendégblogolás, performance PR.",
      },
      {
        title: "Esettanulmány és portfólió",
        desc: "Strukturált case study sablonok: kihívás → megoldás → eredmény → tanulság. Anonimizált verzió szigorú titkosítási megállapodásokhoz.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Kutatás és téma-térkép",
        desc: "Kulcsszó-kutatás (Ahrefs/Semrush + AlsoAsked), versenytárs gap-elemzés, ICP interjú (3-5 ügyfél). Output: 6-12 hónapra szóló téma-térkép.",
      },
      {
        step: "02",
        title: "Stratégia és tartalomkalendárium",
        desc: "Pillar-cluster struktúra, cikk-szintű brief minden témára (kulcsszó, cél, struktúra, belső link). Megkapod a tartalomnaptárt, te jóváhagyod.",
      },
      {
        step: "03",
        title: "Gyártás és optimalizáció",
        desc: "Cikk-gyártás (AI-asszisztált, de mindig emberi végszerkesztéssel), SEO-szerkesztés (Surfer/Frase), schema markup, belső link háló. Heti 1-3 cikk.",
      },
      {
        step: "04",
        title: "Terjesztés és mérés",
        desc: "Owned (saját csatornák), earned (PR outreach), paid (boost). Havi riport: organikus forgalom, ranking, engagement, konverzió. Kvartálos téma-pivot.",
      },
    ],
    faq: [
      {
        q: "Mennyi idő alatt jelennek meg az első eredmények?",
        a: "Long-tail kulcsszavakra 3-4 hónap (Google indexelés + ranking-növekedés). Versenyzettebb kulcsszavakra 6-9 hónap. Brandépítés és authority: 12-18 hónap. Az első hónapokban a folyamatos publikálás a kritikus, nem a forgalom.",
      },
      {
        q: "Tudtok videós tartalom gyártásban is segíteni?",
        a: "Igen. Két modell: (1) full-service partner videós stúdióval (forgatókönyv → forgatás → vágás → SEO); (2) AI-asszisztált gyártás (Claude script + ElevenLabs voice + Runway visual). A választás a brand-igényen és a büdzsén múlik.",
      },
      {
        q: "Milyen kulcsszó-stratégiát követtek?",
        a: "Pillar-cluster modell. 1 fő pillar-oldal (széles téma, pl. „digitális marketing KKV-knak”) + 8-15 cluster-cikk (specifikus al-témák, pl. „lokális SEO tippek”, „Meta Ads kis cégeknek”). Belső linkkel minden cluster a pillar-ra mutat. AI Overviews-okra optimalizált FAQ-section minden cikkben.",
      },
      {
        q: "Hogyan mérjük a tartalom sikerét?",
        a: "Top-of-funnel: organikus forgalom, kulcsszó-ranking, content sharing. Middle-of-funnel: page-engagement (idő az oldalon, scroll-mélység), email-feliratkozás. Bottom-of-funnel: blog-attribution (HubSpot multi-touch) — melyik cikk hány %-ban hozzájárult a tényleges szerződéshez.",
      },
      {
        q: "Mekkora befektetés szükséges?",
        a: "Belépő szint (havi 2 cikk + tartalomnaptár): 200-300 ezer Ft/hó. Komoly tartalom-engine (heti 1-2 cikk + LinkedIn + hírlevél): 500-900 ezer Ft. Premium (heti 3 cikk + videó + podcast): 1.2-2.5M Ft.",
      },
      {
        q: "Mit jelent az AI Overviews-ra optimalizálás?",
        a: "A Google 2024-2025-ben bevezetett AI Overviews (és a ChatGPT-keresés) másféleképpen idéz cikkeket: rövid, kérdés-válasz alapú, autoritás-jelekkel ellátott szakaszokat keres. Tehát ma a long-form cikknek kell strukturáltan tartalmaznia FAQ-section-t, lépéssorrendet, és listákat — különben az AI-keresés átugrik rajta.",
      },
    ],
    cta: "Kérd az ingyenes tartalom auditot",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "Marketing Automatizáció",
    subtitle: "Hatékonyság mesterséges intelligenciával támogatva",
    heroDesc:
      "Időt és erőforrást takaríthatsz meg, ha ismétlődő marketingfolyamataidat automatizálod. Felépítjük az email- és CRM rendszeredet úgy, hogy minden érdeklődő a megfelelő üzenetet kapja a megfelelő pillanatban.",
    metaTitle: "Marketing Automatizáció 2026 — Email, CRM | G2A",
    metaDesc:
      "Automatizált marketingfolyamatok: email automatizáció, CRM integráció, lead scoring és AI-szegmentáció. Kevesebb kézi munka, több konverzió.",
    icon: "zap",
    color: "#f59e0b",
    intro:
      "A marketing automatizáció akkor működik, ha a teljes ügyfélút (lead → érdeklődő → vevő → ismétlődő vásárló) többszereplős workflow-ja le van modellezve. A G2A először a sales-marketing alignment-tel kezd: definiáljuk az MQL-SQL-Opportunity-Won definíciókat, és csak utána épít automatizációt — különben hiába az okos workflow, ha a sales és a marketing más nyelven beszél.",
    benefits: [
      {
        title: "Email automatizáció",
        desc: "Üdvözlő sorozatok, lead nurturing flow-k, vásárlás utáni follow-up, win-back kampányok. Trigger: weboldal-viselkedés, e-mail open, demo-igénylés, vásárlás-összeg.",
      },
      {
        title: "CRM integráció",
        desc: "HubSpot, Salesforce, ActiveCampaign, Pipedrive, Odoo, Zoho beállítás és kétirányú szinkronizáció. Custom field térkép a konkrét ügyfél igénye szerint.",
      },
      {
        title: "Lead scoring és minősítés",
        desc: "Explicit (cégméret, szerepkör) + implicit (oldalviselkedés, e-mail engagement) szorzós scoring rendszer. Hot lead 60+, MQL 30-59, raw 0-29.",
      },
      {
        title: "Sales funnel és pipeline",
        desc: "Konverzióorientált útvonalak (lead → demo → POC → szerződés), upsell és cross-sell automatizációk. HubSpot Deal-stage workflow.",
      },
      {
        title: "Szegmentáció (AI-támogatott)",
        desc: "Viselkedés-alapú dinamikus szegmensek: a Claude/GPT API-t használjuk e-mail content-perszonalizációhoz minden szegmensnek. Optimális küldési időpont prediktív modellel.",
      },
      {
        title: "Reporting és dashboard",
        desc: "Automatikus heti/havi riport (Looker Studio + HubSpot Reports). Multi-touch attribution: melyik csatorna hány %-ban járult hozzá a végső szerződéshez.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Folyamat-feltérképezés",
        desc: "Sales-marketing együtt-ülés (1-2 nap): jelenlegi lead-flow rajzolása, szakaszok definiálása, gyenge pontok azonosítása. Output: konkrét automatizálási roadmap.",
      },
      {
        step: "02",
        title: "Platform-választás",
        desc: "HubSpot vs Marketo vs ActiveCampaign vs Mailchimp döntés a cég-méretre, IT-stack-re és CRM-szükségletre szabva. Migrációs terv, ha váltani kell.",
      },
      {
        step: "03",
        title: "Workflow-fejlesztés",
        desc: "1 workflow / 2 hét tempóban épülnek a folyamatok. Welcome series → lead nurture → handoff to sales → onboarding → upsell. Tesztelés minden lépés után.",
      },
      {
        step: "04",
        title: "Tesztelés és iteráció",
        desc: "A/B teszt minden subject line + CTA + send time. Havi review-meeting: KPI-növekedés, hibátlan workflow ellenőrzés, új use-case-ek priorizálása.",
      },
    ],
    faq: [
      {
        q: "Milyen platformokkal dolgoztok?",
        a: "HubSpot (kis-középvállalat full-stack), Marketo (enterprise), ActiveCampaign (KKV email + CRM), Mailchimp (alap email), Klaviyo (e-commerce), Pipedrive + Mailchimp combo (sales-első), Odoo (ERP-első), Zoho (cost-effective full-stack). Custom integrációkban: Zapier, Make.com, n8n.",
      },
      {
        q: "Mennyi idő az implementáció?",
        a: "Alap email automatizáció + CRM integráció: 2-4 hét. Lead-scoring + sales funnel: 4-6 hét. Multi-touch attribution + revenue dashboard: 6-8 hét. Komplex enterprise migráció (pl. Salesforce-ról HubSpot-ra): 3-6 hónap.",
      },
      {
        q: "Mi kell az induláshoz?",
        a: "Meglévő ügyféladatbázis (akár Excel — segítünk a migrálásban), üzleti folyamat-térkép (ha nincs, közösen rajzoljuk), és sales-marketing együttműködési készség (ez a legfontosabb). Tech-stack alapra még nem kell előre dönteni — kiválasztjuk együtt.",
      },
      {
        q: "Hogyan segít az AI a szegmentálásban?",
        a: "Két szinten: (1) prediktív modellek (mikor lép vásárlóra, mikor lemorzsolódik, mi a legjobb send time per ügyfél); (2) generatív személyre-szabás (Claude API-val a base e-mail templátot átírjuk minden szegmens igényére, anélkül hogy 20 verziót kéne kézzel írni).",
      },
      {
        q: "Mennyibe kerül havonta?",
        a: "Setup: egyszeri 600 ezer–2.5M Ft a komplexitástól függően. Havi management: 200-600 ezer Ft (alap WF-k karbantartása, új kampányok, riport). Platform-licenc külön — HubSpot Pro 50 ezer Ft/hó környékén indul, Marketo 200+ ezer Ft.",
      },
      {
        q: "Hogyan mérjük a marketing automatizáció ROI-ját?",
        a: "Idő-megtakarítás: hány óra manuális munka váltódott workflow-ra (jellemzően 30-50% csökkenés a marketing-csapat manuális idejében). Konverziós hatás: lead → SQL és SQL → won deal arány javulása (jellemzően 15-30% lift). Pipeline-velocity: átlagos sales-cycle rövidülése (10-25%).",
      },
    ],
    cta: "Kérd az ingyenes automatizáció auditot",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG Kommunikáció",
    subtitle: "Fenntarthatóság hitelesen — greenwashing nélkül",
    heroDesc:
      "A fenntarthatósági erőfeszítéseidet úgy kommunikáljuk, hogy a vásárlók, befektetők és a beszállítói lánc ténylegesen elhiggyék — adatokkal alátámasztva, az EU Green Claims Directive és a hazai jogszabályi környezet szellemében. A hivatalos ESG-jelentéstételt és -tanúsítást SZTFH-regisztrált partnerek végzik.",
    metaTitle: "ESG Kommunikáció 2026 — Greenwashing nélkül | G2A",
    metaDesc:
      "Hiteles, adatokkal alátámasztott ESG- és CSR-kommunikáció: stakeholder-üzenetek, zöld marketing, rating-előkészítés — greenwashing nélkül.",
    icon: "leaf",
    color: "#22c55e",
    intro:
      "Tisztázzuk a hatáskört rögtön az elején: a G2A Marketing Bt. NEM rendelkezik a Szabályozott Tevékenységek Felügyeleti Hatósága (SZTFH) általi regisztrációval, ezért a 2023. évi CVIII. törvény szerinti hivatalos ESG-tanácsadói és ESG-tanúsítási tevékenységet nem végezzük — a kötelező CSRD-jelentés készítését és tanúsítását SZTFH-regisztrált partnerekre bízzuk vagy ajánljuk hozzá szakértőt. Amit mi vállalunk: az ESG-stratégia kommunikációs oldala, a stakeholder-üzenetek megfogalmazása, a brand-narratíva, a marketing-szintű content és a rating-előkészítés. Alapítónk, Győrfi Attila ESG specialistaként hozzáadott háttérrel ad informális szakmai tanácsot — de ez nem helyettesíti a hivatalos, regisztrált ESG-tanácsadást.",
    benefits: [
      {
        title: "ESG kommunikációs stratégia",
        desc: "A regisztrált tanácsadód által készített double materiality assessment OUTPUT-ját átfordítjuk hiteles külső kommunikációvá. Stakeholder-térkép és priorizált üzenethierarchia.",
      },
      {
        title: "ESG kommunikációs anyagok és design",
        desc: "Weboldali ESG-szekció, a hivatalos éves jelentés design-ja és narratív oldala (a hivatalos tartalmat a regisztrált auditor adja, mi olvashatóvá és brand-konzisztenssé tesszük), social media + LinkedIn poszt-sorozatok.",
      },
      {
        title: "Greenwashing-mentes zöld marketing",
        desc: "ISO 14021 Type II environmental claims szerint hiteles, adatokkal alátámasztott állítások. EU Green Claims Directive 2026-os követelményeire felkészített megfogalmazás.",
      },
      {
        title: "Stakeholder kommunikáció",
        desc: "Befektetői IR-kommunikáció, ügyfél-irányú zöld marketing, munkavállalói belső ESG-kampányok — mindegyik más nyelven, más csatornán, jogi felülvizsgálattal.",
      },
      {
        title: "CSR tartalmak és kampányok",
        desc: "Volunteer-day storytelling, partnership case study, helyi közösségi projekt kommunikáció. A CSR-t a brandet építő narratívává formáljuk — ez tisztán kommunikációs munka, nem szabályozott terület.",
      },
      {
        title: "Rating-előkészítés (kommunikációs oldal)",
        desc: "EcoVadis / CDP / MSCI ESG önértékelési kérdőívek kommunikációs oldalának előkészítése: a válaszok strukturált megfogalmazása. A tényleges adatokat és értékelést a vállalat vagy a regisztrált tanácsadó szállítja.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Hatáskör-tisztázás és gap-elemzés",
        desc: "Első találkozón egyértelműen elhatároljuk: mit végez a regisztrált ESG-tanácsadó / auditor (vagy melyik partnerünket ajánljuk), és mit veszünk át mi a kommunikációs oldalon. Output: szerepkör-mátrix, hogy a határvonalak érthetőek legyenek minden érintettnek.",
      },
      {
        step: "02",
        title: "Kommunikációs stratégia és üzenetrendszer",
        desc: "A regisztrált tanácsadó által szolgáltatott ESRS-adatokat átfordítjuk publikus kommunikációra. Üzenethierarchia: enterprise → ágazat → konkrét akció. Kockázat-elemzés: mit lehet és mit nem szabad jogszerűen állítani.",
      },
      {
        step: "03",
        title: "Tartalom-fejlesztés és design",
        desc: "Az éves jelentés vizuális design-ja és narratívája (a hivatalos szakmai tartalmat a regisztrált auditor szállítja), weboldali ESG-szekció, LinkedIn-kampány, ügyfél-levelek, sajtóanyag. EU Taxonomy összhang ellenőrzés.",
      },
      {
        step: "04",
        title: "Terjesztés és stakeholder-engagement",
        desc: "Befektetői road-show prezentáció, ügyfél-newsletter, sajtótájékoztató. Évente megújuló kommunikációs tartalom. EcoVadis / CDP / MSCI rating-előkészítés a kommunikációs oldalon.",
      },
    ],
    faq: [
      {
        q: "Készítenek hivatalos ESG-jelentést cégünknek?",
        a: "Nem, és ezt egyértelműen tisztázzuk: a G2A Marketing Bt. NEM rendelkezik az SZTFH által kiadott ESG-tanácsadói vagy ESG-tanúsítási regisztrációval (2023. évi CVIII. tv.), ezért hivatalos CSRD-jelentés készítését és tanúsítását nem vállaljuk. Mi a kommunikációs oldalon dolgozunk: a regisztrált tanácsadó / auditor által készített hivatalos dokumentumot olvashatóvá és brand-konzisztenssé tesszük, stakeholder-üzeneteket fogalmazunk, weboldali ESG-szekciót és kampányt építünk. A hivatalos jelentéstételhez SZTFH-regisztrált partnereket javasolunk.",
      },
      {
        q: "Kötelező-e nekünk a CSRD szerinti ESG-jelentés?",
        a: "A magyar átültetés (2023. évi CVIII. tv.) alapján 2024-től fokozatosan kötelező: nagyvállalatok (250+ fő, 40+ M € forgalom, 20+ M € mérlegfőösszeg — legalább 2 a 3-ból) elsőként, majd 2026-tól a tőzsdei KKV-k. Kis cégek számára egyelőre önkéntes, de a B2B beszállítói láncon keresztül a nagyok elvárják. A pontos kötelezettség-meghatározáshoz mindenképp regisztrált ESG-tanácsadót vagy könyvvizsgálót keressetek — mi nem adunk jogi minősítést.",
      },
      {
        q: "Mi a különbség az ESG és a CSR között?",
        a: "CSR (Corporate Social Responsibility): önkéntes, narratíva-alapú vállalati felelősségvállalás — ezzel kapcsolatban tisztán kommunikációs munkát végzünk, nincs szabályozási korlát. ESG (Environmental, Social, Governance): jogszabály által szabályozott, KPI-okkal és kötelező auditálással ellátott keretrendszer — ennek hivatalos része SZTFH-regisztrált szakértőkre tartozik, mi csak a kommunikációs oldalt vesszük át.",
      },
      {
        q: "Hogyan kerüljük el a greenwashing-ot?",
        a: "Három alapelv a kommunikációban: (1) Csak adatokkal igazolt állítás (nincs „természet-barát”, csak „95% újrahasznosított anyag, ISO 14021 Type II tanúsítva”); (2) Teljes lifecycle-szemlélet a fogalmazásban; (3) Független audit-ra történő hivatkozás minden konkrét számnál. Az EU Green Claims Directive 2026-tól ezeket törvényileg is kikényszeríti — ezért minden zöld kommunikációs anyagunkat ezen elvek szerint formáljuk meg.",
      },
      {
        q: "Tudtok-e ESG-rátingen javítani?",
        a: "EcoVadis, CDP, MSCI ESG Ratings esetén a kommunikációs oldalon segítünk: az önértékelési kérdőívek válaszainak megfogalmazása úgy, hogy a tényleges teljesítményt a legjobb fényben mutassa be. A számszerű adatokat és a tényleges értékelést a cég maga vagy a regisztrált ESG-tanácsadó szállítja. Ha az alap-aktivitás megvan és csak a dokumentáció + kommunikáció gyenge, jellemzően EcoVadis Bronze → Silver lift 6-12 hónap alatt elérhető.",
      },
      {
        q: "Mibe kerül az ESG kommunikáció?",
        a: "Kis vállalat (önkéntes ESG-kommunikáció, weboldali ESG-szekció + 1 éves anyag): 600 ezer–1.5M Ft. Nagy KKV (a regisztrált auditor jelentése köré épített kommunikációs csomag): 1.5-3M Ft. Enterprise (folyamatos IR és stakeholder-kommunikáció): 3-7M Ft / év. A regisztrált ESG-tanácsadó / könyvvizsgáló díja (1-15M Ft a méret függvényében) ezen felül és tőlünk függetlenül merül fel.",
      },
      {
        q: "Hogyan találunk SZTFH-regisztrált ESG-tanácsadót vagy auditort?",
        a: "Az SZTFH nyilvánosan vezeti az ESG-tanácsadói és ESG-tanúsítói névjegyzéket — érdemes a hatóság hivatalos honlapján ellenőrizni. Mi nem szerepelünk a listán, de partnerként több regisztrált auditor-céggel együtt dolgozunk hosszabb ideje, és igény esetén bemutatunk olyat, amelyik az iparágadhoz és a cég-méretedhez illik. A választás és a szerződéskötés köztetek történik, mi nem közvetítünk jutalékért.",
      },
    ],
    cta: "Kérd az ingyenes ESG kommunikációs tanácsadást",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "Employer Branding",
    subtitle: "Munkáltatói márka, ami tehetséget vonz",
    heroDesc:
      "A magyar munkaerő-piac 2025-2026-ban historikus kihívást támasztott: 2.5%-os munkanélküliségi ráta, magas fluktuáció, generációs különbségek a Z és Y munkavállalók között. Az erős munkáltatói márka nem luxus — kritikus üzleti előny.",
    metaTitle: "Employer Branding 2026 — Vonzó munkáltatói márka | G2A",
    metaDesc:
      "EVP-fejlesztés, karrieroldal, toborzási marketing és munkavállalói storytelling. Vonzd és tartsd meg a legjobbakat. Ingyenes employer branding konzultáció.",
    icon: "users",
    color: "#8b5cf6",
    intro:
      "A magyar HR-piac mostanra ugyanolyan versenyzett mint az ügyfél-piac: aki nem hirdet, az nem talál jelölteket. Az employer branding a HR és a marketing határterülete — a G2A azt a hidat építi, amelyen az „employer brand” mint koncepció valódi toborzási és megtartási eszközzé válik. ESG-megfelelőséggel, generációs adaptációval, és a Profession.hu / LinkedIn / Glassdoor hármason mért teljesítménnyel.",
    benefits: [
      {
        title: "EVP-fejlesztés (Employer Value Proposition)",
        desc: "Saját munkavállalói interjúkon alapuló, hiteles EVP. Nem PR-szöveg, hanem amit valóban kapnak az emberek. 4-6 hét alatt készül.",
      },
      {
        title: "Karrieroldal és jelentkezési flow",
        desc: "Konverzió-optimalizált karrieroldal pozíciónkénti landing page-ekkel. Greenhouse / Workable / saját ATS integráció. Mobil-first design (Z generáció).",
      },
      {
        title: "Toborzási marketing",
        desc: "LinkedIn, Profession.hu, Facebook, Instagram, TikTok kampányok pozíció szerint. Sponsored Content B2B, Reels Z generációnak — különböző creatívokkal.",
      },
      {
        title: "Munkavállalói storytelling",
        desc: "„Egy nap az életünkben” videók, day-in-the-life Reels, csapat-bemutató cikkek. A munkatárs maga a brand-nagykövet — nem egy marketinges szlogen.",
      },
      {
        title: "Glassdoor + Profession.hu reputáció",
        desc: "Munkáltatói profil optimalizálás, válaszadási stratégia értékelésekre (jó és rossz egyaránt), proaktív review-szerzés elégedett dolgozóktól.",
      },
      {
        title: "Belső kommunikáció és onboarding",
        desc: "Az új belépőtől az első 90 napig strukturált onboarding flow. Belső hírlevél, sikertörténetek, csapatépítés-kommunikáció.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Employer brand audit",
        desc: "Mai jelölt-élmény térképezése: miért lépnek ki, miért jönnek be, mi a Glassdoor/Profession-rating. 5-8 munkavállalói interjú, 2-3 ex-munkavállalói. Output: realitás-térkép.",
      },
      {
        step: "02",
        title: "EVP-megfogalmazás",
        desc: "A munkavállalói „tényleges mit kapok itt” listából kondenzáljuk a 3-4 legerősebb pillért. Tesztelés célcsoport-fókuszcsoportokkal. Final EVP statement.",
      },
      {
        step: "03",
        title: "Kommunikáció és kampány",
        desc: "Karrieroldal redesign, LinkedIn/Profession content-naptár, video story-pipeline, Glassdoor profil revízió. Toborzási kampányok pozíció szerint.",
      },
      {
        step: "04",
        title: "Mérés és iteráció",
        desc: "Time-to-hire, cost-per-hire, offer acceptance rate, employee NPS havonta. Glassdoor / Profession.hu rating trend. Kvartálos EVP-validation.",
      },
    ],
    faq: [
      {
        q: "Mikor érdemes employer brandinggel foglalkozni?",
        a: "3 jelzés: (1) több mint 3 hónapja nem találtok megfelelő jelöltet egy nyitott pozícióra; (2) a fluktuáció meghaladja az iparági átlagot (jellemzően 15% feletti évente); (3) a Glassdoor/Profession.hu rating-etek 3 csillag alatt van. Bármelyik jelzés esetén az EB már nem opció, hanem szükséglet.",
      },
      {
        q: "Mennyi idő alatt láthatók az eredmények?",
        a: "Karrieroldal redesign: 4-6 hét. Első toborzási kampány-eredmény: 6-8 hét. EVP-megfogalmazás teljes hatása (jelentkezés-szám + minőség): 4-6 hónap. Glassdoor rating javulás: 6-12 hónap (review-k szerveződnek időben).",
      },
      {
        q: "Hogyan mérjük az employer branding sikerét?",
        a: "5 fő KPI: time-to-hire (csökken 15-30%), cost-per-hire (csökken 20-40%), offer acceptance rate (nő 60-tól 80%-ra), employee NPS (nő 6-7-ről 8-9-re), Glassdoor rating (nő 0.5-1 csillagot). Ezek mind 12-18 hónapos időtávon mérhetők.",
      },
      {
        q: "Mi van, ha kicsi cég vagyunk?",
        a: "Az employer branding KKV-szinten is működik — sőt, ott a legintimebb és leghitelesebb. 5-30 fős cégnek nem kell milliós költségvetéssel induljon: alap karrieroldal + Profession.hu profil + LinkedIn-poszt-kalendárium tulajdonos/HR-vezető nevén havi 150-250 ezer Ft-ból szállít.",
      },
      {
        q: "Tudtok influencer / employee advocacy programot indítani?",
        a: "Igen. Munkatársak (5-10 önkéntes „brand ambassador”) képzése LinkedIn-poszt-receptekkel, content-kalendáriummal. Egy 5 fős advocacy-program szerves elérése jellemzően 3-5x nagyobb mint maga a vállalati LinkedIn-fiók.",
      },
      {
        q: "Mibe kerül havi szinten?",
        a: "KKV alap (karrier oldal + Profession + havi 4 LinkedIn poszt): 200-400 ezer Ft. Közepes vállalat (full EB stack: karrier + LinkedIn + Profession + Glassdoor management + storytelling): 500-900 ezer Ft. Enterprise (advocacy program + video pipeline): 1.2-2.5M Ft.",
      },
    ],
    cta: "Kérd az ingyenes employer branding konzultációt",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "Nemzetközi Marketing",
    subtitle: "Globális piac, lokális szemlélet",
    heroDesc:
      "Külföldi piacokra lépnél? A siker titka a lokalizáció: nem elég lefordítani a weboldalt, a kulturális sajátosságokhoz és helyi keresőmotorokhoz kell igazodnunk. Magyar + nemzetközi tapasztalat, közvetlen kínai piaci kapcsolatokkal.",
    metaTitle: "Nemzetközi Marketing 2026 — DACH, CEE, Kína | G2A",
    metaDesc:
      "Multilingvális SEO, cross-border kampányok, lokalizáció és piaci belépési stratégia: DACH, CEE, UK és Kína — közvetlen kínai kapcsolatokkal.",
    icon: "globe",
    color: "#06b6d4",
    intro:
      "A magyar KKV-k 2025-2026-ban egyre inkább a régiós piac (DACH, CEE) felé orientálódnak, mert a hazai piac telített és a forint-volatilitás kockázatot jelent. A G2A alapítója, Győrfi Attila az IBS Budapest, a PTE Közgazdaságtudományi Kar és a Varsovia Egyetem vendégoktatója és nemzetközi marketing-specialista — közvetlen kapcsolatokkal a lengyel, cseh és kínai piaci szereplők felé. Ez nem ügynöki kapcsolat, hanem operatív tudás.",
    benefits: [
      {
        title: "Piacra lépési stratégia",
        desc: "Mélyfúrásos piac-elemzés: kereslet, versenyhelyzet, csatornastruktúra, szabályozás. Go-to-market roadmap 12 hónapra.",
      },
      {
        title: "Lokalizáció (nem fordítás)",
        desc: "Kulturálisan adaptált tartalom: nem szó szerinti, hanem helyi viszonyok közé átültetett üzenet. Anyanyelvi szerkesztők minden célnyelvre.",
      },
      {
        title: "Multilingvális SEO",
        desc: "Hreflang implementáció helyes ccTLD vagy aldomén stratégiával. Nyelvenkénti kulcsszó-kutatás (a németben más a kifejezés mint a magyarban). Lokális link-építés.",
      },
      {
        title: "Cross-border PPC",
        desc: "Google Ads + Meta cross-country kampányok. Külön valuta-kezelés, ország-specifikus billing flow, GDPR-megfelelés EU-szerte.",
      },
      {
        title: "Kínai piaci specializáció",
        desc: "WeChat, Baidu, Xiaohongshu (Little Red Book), Douyin (kínai TikTok) marketing. Sino-magyar üzleti partnerségek tanácsadása.",
      },
      {
        title: "Helyi partnerségek és influencer",
        desc: "Lengyel, cseh, német és kínai influencer kapcsolatok. Helyi nagykereskedők és viszonteladók azonosítása. PR a célpiacokon.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Piac-elemzés és target country pick",
        desc: "Top 3-5 célország értékelése: piacméret, kereslet, verseny-intenzitás, TAM (Total Addressable Market) becslés. Win-rate kalkulátor országonként.",
      },
      {
        step: "02",
        title: "Lokalizációs stratégia",
        desc: "Domain stratégia (.de vs /de, ccTLD vs aldomén), hreflang setup, anyanyelvi tartalom-szerkesztők kiválasztása. Cégbejegyzés vagy local entity ha kell.",
      },
      {
        step: "03",
        title: "Tartalom és weboldal lokalizáció",
        desc: "Weboldal multilingvális verziók, marketing-anyagok (e-mail, social) lokalizációja, kulcsszó-térkép országonként. Pilot ország 2-3 hónap.",
      },
      {
        step: "04",
        title: "Kampányok és skálázás",
        desc: "Lokális Google Ads + Meta launching. Lokális PR és influencer outreach. Havi review: melyik ország skálázódik, melyik csökkenjen vagy bukjon.",
      },
    ],
    faq: [
      {
        q: "Milyen piacokra segítitek a terjeszkedést?",
        a: "Elsősorban: DACH (Németország, Ausztria, Svájc), CEE (Lengyelország, Csehország, Szlovákia, Románia), BeNeLux és UK. Speciális: Kína (WeChat + Baidu + helyi partnerségek). Globális terjeszkedésben (USA, India, MENA) partner ügynökségekkel dolgozunk.",
      },
      {
        q: "Mi a különbség a fordítás és a lokalizáció között?",
        a: "Fordítás = szó szerinti átalakítás (gyakran gépi fordítóval kezdve). Lokalizáció = teljes adaptáció, beleértve a humor, az utalások, a vizuális elemek (modellek, színek), a fizetési módok, a jogi szöveg. Egy „best in class” szlogen ami magyarul jól szól, németül nyelvtanilag rossz, lengyelül pedig kulturálisan idegen lehet.",
      },
      {
        q: "Kell-e új domain regisztrálni?",
        a: "Két stratégia: (1) ccTLD (országkódos domain): a saját domain.hu mellett domain.de, domain.cz — legjobb local SEO, de drága és komplex. (2) Aldomén vagy alkönyvtár: de.domain.com vagy domain.com/de — egyszerűbb, de gyengébb local ranking. Általában az aldomén/alkönyvtár megoldást javasoljuk a 2-3. piacig, és csak utána ccTLD-t.",
      },
      {
        q: "Milyen hosszú a folyamat?",
        a: "Pilot piac (1 új ország): 4-12 hét teljes lokalizációs folyamat. Skálázás további piacokra: 6-8 hét / új piac, ha a pilot sikeres. Cégalapítás vagy local entity kell-e: külön tanácsadás, 3-6 hónap.",
      },
      {
        q: "Tudtok kínai piaci tanácsadásban segíteni?",
        a: "Igen. Alapítónk Győrfi Attila az IBS Budapest, a PTE Közgazdaságtudományi Kar és a Varsovia Egyetem vendégoktatója és kínai piaci szakértő. WeChat-en közvetlenül elérhető a kínai partnereinkkel. WeChat marketing, Baidu SEO, Tmall/JD listing, Xiaohongshu (Little Red Book) influencer kampányok. Kínai piacra-lépéshez tipikusan magyar+kínai joggyakorlót is bevonunk a regulációs része miatt.",
      },
      {
        q: "Mibe kerül a nemzetközi terjeszkedés marketingje?",
        a: "Pilot ország launch (DACH/CEE): egyszeri 1.5-3M Ft (lokalizáció + setup + első kampányok). Havi management: 400-900 ezer Ft / ország. Kínai piaci pilot: 3-6M Ft (komplexebb a regulációs része). Hirdetési költség külön, jellemzően havi 300-1500 ezer Ft / ország a piacméret függvényében.",
      },
    ],
    cta: "Kérd az ingyenes nemzetközi marketing konzultációt",
  },
};

// ─── EN ─────────────────────────────────────────────────────────────────────
const EN: Record<string, ServiceConfig> = {  "arculattervezes": {
    "slug": "arculattervezes",
    "title": "Brand Design & Identity for SMBs and B2B Companies",
    "subtitle": "A unique visual identity — from logo to brand guidelines — consistent across every surface.",
    "heroDesc": "Your brand's visual identity speaks louder than words — and it's often the first impression a prospect ever gets of you. We design the logo, colour palette, typography and graphic system that carry the same message across every touchpoint. Not decoration: a strategy-led identity that's recognisable and builds trust.",
    "metaTitle": "Brand Design & Identity 2026 – Visual Identity | G2A Marketing",
    "metaDesc": "Logo, brand guidelines, print and digital materials for SMBs and B2B companies. Build a consistent visual identity that differentiates and earns trust. Get a quote!",
    "icon": "brand",
    "color": "#ec4899",
    "intro": "In 2026 brand identity isn't a luxury — it's a business fundamental. Buyers decide within seconds whether they trust you, and visual appearance drives much of that judgement. An inconsistent logo, scattershot colours or six different fonts across your materials register instantly — even if the viewer can't name what's wrong. At G2A Marketing we always derive identity from strategy: first we understand who your buyers are, what sets you apart from competitors and the position you want to own — then we design. The outcome isn't just a good-looking logo, but a working system: a brand guideline that frames every future asset, from business card to website. No strategy, no brand.",
    "benefits": [
      {
        "title": "A unique, defensible logo",
        "desc": "No template, no clipart. We work from several concept directions, then deliver the chosen one as clean, scalable vector files that work at every size and on any background — small (favicon) and large (signage) alike."
      },
      {
        "title": "A complete brand guideline",
        "desc": "We document logo usage, clear space, prohibited applications, the full colour palette (HEX, RGB, CMYK, Pantone), typography and graphic elements. This is the document that lets anyone — your internal team or an outside partner — work consistently."
      },
      {
        "title": "Consistency across every surface",
        "desc": "From website to social media to printed business card, one visual language throughout. Consistency is the foundation of recognition: repeated exposure is what builds trust and brand recall over time."
      },
      {
        "title": "Ready-to-print materials",
        "desc": "Business card, brochure, roll-up, folder, presentation template — supplied as print-ready files with the technical specs production needs (bleed, crop marks, colour profile). On request we can also recommend a reliable print partner."
      },
      {
        "title": "A digital brand toolkit",
        "desc": "Social media templates, email signature, presentation master, post frames and cover images. We hand over editable templates (e.g. Canva or Figma) so you can produce your day-to-day content yourself — fast and on-brand."
      },
      {
        "title": "Strategic positioning, not decoration",
        "desc": "For us, identity follows brand strategy — audience, competitive context, message. So the process isn't a matter of taste but a chain of defensible decisions that serve your actual business goals."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Discovery and brand brief",
        "desc": "We get to know your business: who your buyers are, what sets you apart, the feeling you want to evoke and where you position yourself in the market. We review your existing materials and the competitive visual landscape. This brief is the compass for the whole project."
      },
      {
        "step": "02",
        "title": "Concept and logo design",
        "desc": "We present several markedly different visual directions — with moodboards and a rationale for why each concept works for your audience. You pick a direction, and we refine it through to the final logo."
      },
      {
        "step": "03",
        "title": "Building the identity system",
        "desc": "Around the logo we build the full system: colour palette, typographic hierarchy, graphic elements, imagery. We compile it all into a brand guideline so your appearance stays consistent into the future."
      },
      {
        "step": "04",
        "title": "Application and handover",
        "desc": "We produce the concrete assets — print-ready business card, brochure, roll-up and the digital templates. We hand over the complete source-file package and, in a handover session, walk you through how to use it with confidence."
      }
    ],
    "faq": [
      {
        "q": "How long does a full brand identity take?",
        "a": "The logo and core identity system typically take 3-5 weeks. The full package (guideline, print and digital materials together) usually runs 5-8 weeks, depending on scope and how quickly feedback rounds move. After the discovery phase we give you a concrete timeline."
      },
      {
        "q": "I only want a logo, not the full package. Is that possible?",
        "a": "Yes. Many clients start with a logo and expand the system later. We'll tell you honestly: a logo alone isn't enough for a consistent appearance, so we recommend at least defining a base colour palette and typography alongside it. We're willing to say no to what we don't think serves your goals."
      },
      {
        "q": "What exactly do I receive, and in what file formats?",
        "a": "The logo in vector (SVG, AI, EPS) and finished image formats (PNG, JPG) in several variants and on different backgrounds, the brand guideline as a PDF, the print materials as print-ready PDFs, and the digital templates in editable form (e.g. Canva/Figma). All source files are yours."
      },
      {
        "q": "I already have a logo and just want to refresh it. Do you do that?",
        "a": "Yes, rebranding and identity refreshes are part of what we do. We assess what works in your existing identity and what doesn't, then recommend either an evolution or a full redesign — depending on how much brand equity lives in the current look. We don't throw away recognition you've already built."
      },
      {
        "q": "How do you make sure the identity actually fits my business?",
        "a": "By starting from strategy, not taste. In the brand brief we lock down the audience, position and message, and we tie every visual decision to that. We present concepts with reasoning, so the choice becomes an informed decision rather than a gut feeling."
      },
      {
        "q": "After the identity is done, can you help apply it too?",
        "a": "Yes. Because G2A Marketing is a full-service agency, we carry the identity seamlessly onto your website, social media, ads and content. At handover you receive every template you need, but we'll stay alongside you for ongoing application if you'd like."
      }
    ],
    "cta": "Request a custom brand quote"
  },
  "hirdeteskezeles": {
    "slug": "hirdeteskezeles",
    "title": "PPC & Ad Management — one strategy, every platform",
    "subtitle": "Data-driven paid campaigns across Google Ads, Meta, LinkedIn and TikTok, unified around ROI.",
    "heroDesc": "Paid advertising works when you run it from one shared strategy, not by patching each platform in isolation. Our team builds full multi-platform PPC management: budget goes where your audience actually decides, and every euro sits behind a measurable goal. No strategy, no G2A.",
    "metaTitle": "PPC & Ad Management 2026 — multi-platform campaign management | G2A Marketing",
    "metaDesc": "Multi-platform PPC management: Google Ads, Meta, LinkedIn and TikTok in one strategy. Data-driven structure, A/B tests, conversion tracking. Book your free audit!",
    "icon": "ads",
    "color": "#f43f5e",
    "intro": "In 2026, paid advertising is no longer a single-platform question: your customers arrive from Google Search, the Meta feed, the B2B space of LinkedIn and TikTok videos alike. PPC and ad management deliver real return only when these channels are optimised inside one data-driven structure, not separately. G2A Marketing builds platform-spanning campaign management: we continuously shift budget toward the best cost per conversion, sharpen messaging with A/B tests, and measure results with precise conversion tracking. We don't sell promises — we deliver a transparent process you can follow in a monthly report, with no hidden platform invoice.",
    "benefits": [
      {
        "title": "One strategy, many platforms",
        "desc": "Google Ads, Meta, LinkedIn and TikTok aren't separate islands: we run them under shared goals and unified attribution, so you can see what each channel does along the buyer journey."
      },
      {
        "title": "Data-driven account structure",
        "desc": "Campaigns and ad groups built around real search and purchase intent — clean segments so budget flows toward what's profitable instead of leaking everywhere."
      },
      {
        "title": "Cross-platform budget allocation",
        "desc": "We scale spend where cost per conversion is best and pull back where return weakens — based on weekly review, not gut feeling."
      },
      {
        "title": "A/B tests and creatives",
        "desc": "We test ad copy, creatives and landing directions in a structured way. Only what the numbers prove wins — losing variants get replaced."
      },
      {
        "title": "Accurate conversion tracking",
        "desc": "We set up GA4, platform pixels and server-side measurement so reports show real leads and purchases, not misleading click counts."
      },
      {
        "title": "Transparent monthly reporting",
        "desc": "A simple, readable report: where the budget went, what the cost per conversion is, and the next step. You know what you pay for — no hidden line items."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit and goal setting",
        "desc": "We review existing accounts, the measurement setup and the competitive landscape. We clarify the business goal and realistic KPIs (CPA, ROAS), then decide which platforms are relevant — if one isn't worth it, we'll say so."
      },
      {
        "step": "02",
        "title": "Strategy and structure",
        "desc": "We build the platform-spanning campaign plan: who we reach, where, with what message, and how the budget is split. We set up a clean account structure and conversion tracking for measurement."
      },
      {
        "step": "03",
        "title": "Launch and testing",
        "desc": "We go live and run structured A/B tests on creatives, messaging and targeting in the first weeks. From early data we filter out what actually works."
      },
      {
        "step": "04",
        "title": "Optimisation and scaling",
        "desc": "We continuously refine targeting, bids and budget allocation, scaling up the winning directions. We show results and next steps in a monthly report."
      }
    ],
    "faq": [
      {
        "q": "How is this different from Google Ads or Meta ads on their own?",
        "a": "This is platform-spanning management: instead of running a single surface, we coordinate Google, Meta, LinkedIn and TikTok campaigns within one shared strategy, with unified budget allocation and attribution. If you need only Google Ads or only Meta, we have dedicated services for those — here we tune the full mix together."
      },
      {
        "q": "How much budget do I need to make it worthwhile?",
        "a": "There's no single mandatory amount, because competition differs by industry and platform. In the audit we tell you how much spend is needed to gather enough data for testing — and if your budget is too low for the goal, we'll say so rather than spend it without results."
      },
      {
        "q": "When will I see the first results?",
        "a": "The learning and testing phase typically runs 4-6 weeks before we can optimise on stable data. Search campaigns usually convert faster; Display and social brand-building directions take longer to mature. We give a realistic timeline at the audit."
      },
      {
        "q": "Which platforms should I advertise on?",
        "a": "That's about you, not us: where your buyers are and what their intent is. For B2B, Google Search and LinkedIn are often the core; for B2C, Meta and TikTok tend to be stronger. In the audit we justify the recommendation platform by platform — you don't need to be everywhere at once."
      },
      {
        "q": "Who owns the ad accounts and the data?",
        "a": "Always you. We create accounts under your ownership or work on your existing ones, and you grant us access. So your data and the structure we build stay with you even if you later decide differently — no lock-in."
      },
      {
        "q": "How do you measure and report?",
        "a": "We set up conversion tracking with GA4, platform pixels and, where needed, server-side measurement, so real leads and purchases appear in the numbers. You get a clear monthly report: where the budget went, the cost per conversion per platform, and the next step."
      }
    ],
    "cta": "Book your free PPC audit"
  },
  "kozossegi-media": {
    "slug": "kozossegi-media",
    "title": "Social media management — turning followers into a loyal community",
    "subtitle": "Strategy, content, community management and influencer collaborations in one place, for SMBs and B2B companies.",
    "heroDesc": "Social media isn't random posting — it's a system: strategy, content calendar, a consistent brand voice and daily community management. G2A Marketing runs the whole process, from setting goals to moderation, across Facebook, Instagram, LinkedIn and TikTok. No strategy, no G2A: first we define your audience and your metrics, then we post.",
    "metaTitle": "Social Media Management 2026 — Brand Building | G2A Marketing",
    "metaDesc": "Social media strategy, content production, community management and influencer marketing on Facebook, Instagram, LinkedIn and TikTok. Get your free social audit!",
    "icon": "social",
    "color": "#3b82f6",
    "intro": "By 2026, social media has become one of the most important organic channels for brand building — but the algorithms are stricter and audiences instantly spot empty marketing. Today it isn't the content factory that wins; it's a consistent, credible presence that builds a real community. G2A Marketing doesn't treat your channels in isolation — we tie them to a single strategy with a content calendar, a defined brand voice, active community management and, where it genuinely fits, influencer collaborations. Facebook, Instagram, LinkedIn and TikTok: each on its own terms, but with one unified brand message. We use AI sensibly for content ideation and scheduling, but the voice and the moderation stay human. And you get a transparent monthly report: what we posted, what worked, what didn't, and the plan for the next month.",
    "benefits": [
      {
        "title": "Strategy, not random posting",
        "desc": "We define your audience, positioning and metrics first, then create content. Every post serves a business goal — awareness, community or leads — instead of existing for its own sake."
      },
      {
        "title": "Content calendar and a consistent brand voice",
        "desc": "We build a weekly and monthly content calendar so publishing is predictable and planned. A unified visual style and brand voice across every platform keeps your brand recognisable in a noisy feed."
      },
      {
        "title": "Platform-specific content",
        "desc": "We don't push the same post everywhere. LinkedIn is professional, TikTok is short and dynamic, Instagram is visual, Facebook is community-driven — we produce content in each channel's native format."
      },
      {
        "title": "Active community management and moderation",
        "desc": "We respond to comments, messages and reviews on time, in your brand voice. Moderation handles the negative voices too — calmly and professionally — because a well-managed complaint builds trust."
      },
      {
        "title": "Influencer marketing with real fit",
        "desc": "We don't pick influencers by follower count; we look for relevant partners whose audience genuinely overlaps with yours. We coordinate the creative brief, the terms of the collaboration and the measurement."
      },
      {
        "title": "Transparent measurement and monthly reporting",
        "desc": "Reach, engagement, audience growth and — where it's meaningful — traffic driven to your website: every month you get a clear report. No hidden platform invoices; pricing is clear upfront."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit and strategy",
        "desc": "We map your current presence, your competitors and your audience. We pick the relevant platforms (not everyone needs all of them) and set the goals, tone and KPIs."
      },
      {
        "step": "02",
        "title": "Content calendar and creative",
        "desc": "We assemble the monthly content calendar: topics, formats, scheduling. We produce the posts, visuals and copy tailored to each platform, with built-in approval points for you."
      },
      {
        "step": "03",
        "title": "Publishing and community management",
        "desc": "We publish on schedule and manage the community daily: comments, messages, moderation. Where it makes sense, we coordinate influencer collaborations."
      },
      {
        "step": "04",
        "title": "Measurement, reporting and optimisation",
        "desc": "Each month we evaluate the results, see what worked, and fine-tune the next month's content accordingly. Continuous, data-driven iteration."
      }
    ],
    "faq": [
      {
        "q": "How long before social media shows results?",
        "a": "Organic brand building takes patience: consistent presence and community growth typically become genuinely visible over 3-6 months. The first weeks are about setting up the content system and the voice; real momentum builds after that."
      },
      {
        "q": "Which platforms should we be on?",
        "a": "The ones where your audience actually is. In B2B, LinkedIn is often the main channel; for consumer brands, Instagram and TikTok; for local businesses, Facebook. We decide together in the audit — you don't need to be everywhere."
      },
      {
        "q": "Do you produce the content, or do we?",
        "a": "We produce it: copy, visuals, content calendar. If you have your own material (photos, video, product shots), we build it in. We draw on your brand's internal knowledge, but the execution is on us — you just approve."
      },
      {
        "q": "How do you handle negative comments and crises?",
        "a": "By moderation principles agreed in advance, in your brand voice. We address legitimate complaints calmly and substantively, and handle trolling by the rules. For a serious crisis we consult you immediately before publishing anything."
      },
      {
        "q": "Is influencer marketing included?",
        "a": "Yes, where it fits. We find relevant partners (not by follower count alone), and manage the brief, the terms of the collaboration and the measurement. Influencer fees are a separate cost, planned transparently upfront."
      },
      {
        "q": "Do you use AI for content production?",
        "a": "Yes, sensibly: for ideation, drafts and scheduling. The final brand voice, the editing and the community interaction stay human — AI speeds things up, but it doesn't replace a credible presence."
      }
    ],
    "cta": "Get your free social media audit"
  },
  "strategiai-marketing": {
    "slug": "strategiai-marketing",
    "title": "Strategic Marketing for SMBs and B2B Companies",
    "subtitle": "From audit to action plan: a data-driven marketing strategy you can measurably build on.",
    "heroDesc": "Strategy is the single point where the fate of every marketing forint is decided. We map your market, competitors and target audience, then build positioning, a marketing mix and a KPI-driven action plan on top. We don't sell you a campaign — we give you direction. Because here, no strategy means no G2A.",
    "metaTitle": "Strategic Marketing Consulting 2026 – Audit, KPIs, Action Plan | G2A Marketing",
    "metaDesc": "Marketing audit, market and competitor analysis, personas, marketing mix and a KPI-driven action plan for SMBs and B2B. Book your free strategy consultation.",
    "icon": "strategy",
    "color": "#6366f1",
    "intro": "In 2026, strategic marketing isn't a PowerPoint vision — it's a working system: clear positioning, a measured target audience and accountable KPIs. Most SMBs and B2B companies don't spend badly because budgets are small, but because there's no decision framework — they react campaign to campaign, with no measurement and no direction. That's why G2A Marketing is strategy-first: every service we offer — SEO, PPC, social, web — is built on an audited strategy, not the other way around. With roots in Pécs, we serve clients nationally and internationally, with transparent pricing, monthly reporting and realistic timelines. This is our flagship page: here is where it's decided whether your marketing serves your business goals or simply burns money.",
    "benefits": [
      {
        "title": "Marketing audit",
        "desc": "We review your current marketing end to end: channels, messaging, website, analytics, spend and results. You'll see what's working, where budget is leaking, and where the biggest untapped opportunity sits."
      },
      {
        "title": "Market and competitor analysis",
        "desc": "We map your market position and your main competitors' strategies — messaging, pricing, channels, weak spots. We look for a concrete gap where you can differentiate, not fill in an empty SWOT grid."
      },
      {
        "title": "Target audience and personas",
        "desc": "From data and interviews we build 2-3 real buyer personas: who they are, their pain point, where to reach them and what drives their decision. Every message and channel is built on these, not on assumptions."
      },
      {
        "title": "Positioning and messaging",
        "desc": "We define why customers should choose you over competitors. A clear value proposition and messaging pillars that speak consistently across every surface — website, ads, proposals."
      },
      {
        "title": "Marketing mix and channel plan",
        "desc": "We decide which channels reach your audience with the best return (SEO, PPC, social, email, content) and produce a prioritised plan of what to invest in and in what order."
      },
      {
        "title": "KPI framework and action plan",
        "desc": "We set measurable goals (leads, CAC, ROAS, conversion) and build a prioritised 6-12 month roadmap. You'll know the next step, what we measure and when we reassess — backed by monthly reporting."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Discovery and audit",
        "desc": "We learn your business goals and review your current marketing, analytics and sales process. You get a fact-based picture of where you stand today — no sugar-coating."
      },
      {
        "step": "02",
        "title": "Market, competitors and audience",
        "desc": "We analyse your market and competitors and build real personas. This is where the differentiation gap emerges and exactly who you should be speaking to becomes clear."
      },
      {
        "step": "03",
        "title": "Strategy, positioning, marketing mix",
        "desc": "We define positioning and messaging, select the right channels, and design a prioritised marketing mix aligned with your budget."
      },
      {
        "step": "04",
        "title": "KPIs, action plan and measurement",
        "desc": "We lock in measurable goals and KPIs, deliver a prioritised action plan and roadmap, then track results in monthly reports and fine-tune. The strategy stays a living document."
      }
    ],
    "faq": [
      {
        "q": "How long does it take to build a marketing strategy?",
        "a": "A focused strategy with audit, market and competitor analysis, personas and an action plan typically takes 3-5 weeks. For more complex cases spanning several business lines, 6-8 weeks — the pace depends on how quickly we get access to your data and team."
      },
      {
        "q": "When will I see results?",
        "a": "The strategy itself is an immediately usable decision framework. Implementation results are channel-dependent: paid campaigns are measurable within weeks, while an SEO or content direction typically delivers measurable organic growth in 3-6 months. We promise realistic timelines, not miracles."
      },
      {
        "q": "How much does strategic marketing cost?",
        "a": "Pricing depends on company size, market complexity and the depth you need. The first consultation is free; after that we propose a fixed-price strategy package — transparent, agreed up front, with no hidden platform invoices. We give an exact quote after the discovery phase."
      },
      {
        "q": "What does a strategy actually do for me?",
        "a": "It stops you burning money campaign to campaign. You'll know who to target, with what message, on which channel and in what order — and you'll have KPIs to check whether it works. It's the highest-return investment of your capacity."
      },
      {
        "q": "Do I get only the strategy, or implementation too?",
        "a": "Whichever suits you. Many clients take the strategy and execute it with their own team — that's completely fine, the roadmap is built for it. If you prefer, we handle execution too: SEO, PPC, social, web — all built on the same strategy."
      },
      {
        "q": "Do you use AI to build the strategy?",
        "a": "Yes, as a tool. We use AI to process market and competitor data faster and to model scenarios, but positioning and decisions rest on human expertise. AI accelerates, it doesn't replace — we integrate it soberly, not sell it as magic."
      }
    ],
    "cta": "Book your free strategy consultation"
  },
  "keresooptimalizalas": {
    "slug": "keresooptimalizalas",
    "title": "SEO that delivers measurable organic growth",
    "subtitle": "Technical SEO, content and link building in one strategy — so the right people find you on Google and in AI search.",
    "heroDesc": "Organic search is the channel with the longest-lasting return: you're not paying per click, you're building visibility you own. With a technical SEO audit, on-page optimisation, content SEO and link building, we move your site up Google's results — and in 2026, into AI answers too. We don't start without a strategy, and every month you see exactly what moved in a transparent report.",
    "metaTitle": "Search Engine Optimisation (SEO) Experts 2026 – G2A Marketing",
    "metaDesc": "Technical SEO audit, on-page, content SEO, link building and local SEO for measurable organic growth. Transparent monthly reports, AI-search ready. Get an audit!",
    "icon": "seo",
    "color": "#0891b2",
    "intro": "In 2026, SEO is no longer just about Google's ten blue links: Google AI Overviews, ChatGPT and Perplexity all cite sources in their answers, and you need to be visible there too (AEO/GEO). Yet the fundamentals haven't changed: a fast, technically clean site, genuinely useful content and credible links. At G2A Marketing we start with strategy — keyword research, competitor analysis and a technical audit to map where you stand — then bring technical SEO, on-page optimisation, content marketing and link building together into one system. No hidden platform invoices, no empty promises: an SEO strategy typically delivers measurable organic growth within 3-6 months, and every month you track what's happening with your keywords, traffic and Core Web Vitals in a clear report.",
    "benefits": [
      {
        "title": "Technical SEO audit",
        "desc": "We map what's holding your site back: indexing and crawl issues, speed, structure, broken redirects, duplicate content, structured data. You get a prioritised issue list, ordered by impact."
      },
      {
        "title": "On-page optimisation",
        "desc": "Headings, meta elements, internal link structure, URLs and a keyword map aligned to search intent — so Google understands exactly what each page is about and who it's for."
      },
      {
        "title": "Content SEO and content marketing",
        "desc": "A content strategy that starts from keyword research: articles and pages that answer your customers' real questions. This is also the foundation for AI search engines (AI Overviews, ChatGPT, Perplexity) citing you."
      },
      {
        "title": "Link building",
        "desc": "Building credible, relevant links gradually and without risk. Quality over quantity — no spam links, no shortcuts that risk a penalty, because Google catches up with those sooner or later."
      },
      {
        "title": "Local SEO",
        "desc": "Google Business Profile, local keywords, reviews and local citations — so people find you in your area and target cities the moment they search. Rooted in Pécs, serving the whole country."
      },
      {
        "title": "Core Web Vitals and AI visibility",
        "desc": "Loading speed, stability and responsiveness are both a ranking factor and a user-experience factor today. We also prepare your content to appear in AI-generated answers (AEO/GEO)."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Audit and keyword research",
        "desc": "We start with a technical SEO audit, competitor analysis and keyword research: where you stand now, what your customers search for, and where the biggest untapped opportunity is. The strategy is born here."
      },
      {
        "step": "02",
        "title": "Strategy and prioritisation",
        "desc": "We build the SEO roadmap: what we fix first (usually the technical blockers), what content is needed and how the link profile grows. With a realistic timeline and measurable KPIs — no strategy, no G2A."
      },
      {
        "step": "03",
        "title": "Execution",
        "desc": "Fixing technical issues, on-page optimisation, content production and link building, step by step. We work continuously on Core Web Vitals and on preparing your content for AI search engines."
      },
      {
        "step": "04",
        "title": "Measurement and monthly report",
        "desc": "Every month you get a transparent report: keyword positions, organic traffic, conversions and the next steps. We refine the strategy based on data — not on gut feeling."
      }
    ],
    "faq": [
      {
        "q": "How soon will I see the first results?",
        "a": "SEO is a mid- to long-term investment. Technical fixes can show effects within 4-8 weeks, but an SEO strategy typically delivers measurable organic growth within 3-6 months. It depends on competition, your starting point and content pace."
      },
      {
        "q": "Do you guarantee the number-one spot on Google?",
        "a": "No — and be wary of anyone who does. Rankings depend on Google's algorithm, which nobody controls. What we do guarantee: prioritised, expert work, a measurable process and transparent reporting. We talk about expected results realistically."
      },
      {
        "q": "What are Core Web Vitals, and why do they matter?",
        "a": "Core Web Vitals are Google's user-experience metrics: loading speed, interactivity and visual stability. They are ranking factors and they directly affect conversion — a slow page loses the visitor before they ever see the content."
      },
      {
        "q": "Does SEO still make sense in the age of AI search?",
        "a": "Yes — in fact it matters more. Google AI Overviews, ChatGPT and Perplexity all cite well-structured, credible content as sources. Doing the classic SEO fundamentals well makes you more visible in AI answers too (AEO/GEO)."
      },
      {
        "q": "What do I get in the monthly report?",
        "a": "Keyword positions, organic traffic and conversion data, the work completed and the plan for next month — in plain language, not just charts. You always see what happened and why, with no hidden platform invoice."
      },
      {
        "q": "Isn't link building risky? Won't Google penalise it?",
        "a": "Spammy, bought bulk links are risky and Google catches up with them. We build credible, relevant links gradually — quality over quantity. That delivers lasting results, not a short-lived spike that the next update takes back."
      }
    ],
    "cta": "Get your free SEO audit"
  },
  "webfejlesztes": {
    "slug": "webfejlesztes",
    "title": "Web Development & CRO — a website that doesn't just look good, it converts",
    "subtitle": "Custom websites, online stores and landing pages built around the conversion that turns a visitor into a customer.",
    "heroDesc": "Your website isn't decoration — it's a sales tool. We build fast, mobile-friendly, searchable sites — from custom code to WordPress and online stores — then improve the results with continuous conversion optimisation (CRO). The goal isn't a pretty design, it's measurably more leads and customers.",
    "metaTitle": "Web Development & CRO 2026 — conversion-optimised websites | G2A Marketing",
    "metaDesc": "Custom sites, WordPress, Shopify and WooCommerce stores, landing pages and CRO. Fast, responsive, SEO-friendly builds with measurable conversion. Get an audit.",
    "icon": "web",
    "color": "#f97316",
    "intro": "In 2026 the website is the most important sales channel for most SMBs — yet most sites lose visitors: they're slow, break on mobile, and users can't find what to do next. Google uses Core Web Vitals as a ranking factor, so a slow page is penalised twice: worse rankings and fewer conversions. G2A Marketing doesn't just 'make a website' — we build a conversion system: custom development, WordPress or an online store (Shopify, WooCommerce) matched to the task, technical SEO baked into the code, and ongoing CRO after launch. No strategy and no measurement means no G2A — design is a tool, not the outcome.",
    "benefits": [
      {
        "title": "Designed to convert, not just to impress",
        "desc": "The design guides visitors toward the goal: clear information hierarchy, strong CTAs, frictionless forms. A polished interface is the baseline; conversion is the measure — every element has a business purpose."
      },
      {
        "title": "The right technology for the job",
        "desc": "Not everything needs WordPress, and not everything needs custom code. WordPress for content-heavy sites, Shopify or WooCommerce for stores, custom development for complex requirements — we pick what gives your case the best value for money."
      },
      {
        "title": "Speed and Core Web Vitals",
        "desc": "Optimised code, images and loading so the site appears fast on mobile too. Good Core Web Vitals scores improve your Google ranking and reduce drop-off during loading at the same time."
      },
      {
        "title": "Responsive, mobile-first interface",
        "desc": "Most traffic comes from mobile, so we develop mobile-first. The interface stays readable, tappable and purchasable on every screen size — phone, tablet, desktop."
      },
      {
        "title": "SEO-friendly foundation in the code",
        "desc": "Clean, semantic code, correct markup, fast loading and structured data — so search optimisation isn't a bolt-on afterthought but is built into the foundations."
      },
      {
        "title": "Transparent pricing and maintenance",
        "desc": "Scope and price agreed up front, no hidden platform invoices. After launch: updates, backups, bug fixes and performance monitoring — the website stays a maintained asset over the long term."
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "Assessment and conversion goal",
        "desc": "We review the current site (or the from-scratch brief), the target audience and the business goal. We define what success means — quote request, purchase, booking — and which KPIs we'll measure it by."
      },
      {
        "step": "02",
        "title": "Architecture, UX and technology choice",
        "desc": "We build the site structure and user journey around conversion, then select the platform (custom, WordPress, Shopify, WooCommerce). Development starts once the wireframe and content plan are approved."
      },
      {
        "step": "03",
        "title": "Development, content and testing",
        "desc": "We write responsive, fast, SEO-friendly code, load the content and test on every device. Core Web Vitals scores and the forms, checkout and cart are all verified before go-live."
      },
      {
        "step": "04",
        "title": "Launch, measurement and continuous CRO",
        "desc": "After launch we set up measurement (analytics, conversion tracking) and start conversion optimisation: A/B tests, behaviour analysis, refinement. A monthly report shows transparently what improved."
      }
    ],
    "faq": [
      {
        "q": "How long does it take to build a website?",
        "a": "A simple landing page or brochure site typically takes 2-4 weeks, a more complex company website 4-8 weeks, and an online store generally 6-12 weeks depending on the product range and integrations. We give the exact timeline after the assessment, because content and decision rounds often weigh more than the development itself."
      },
      {
        "q": "Should I use WordPress, Shopify, WooCommerce or custom development?",
        "a": "It depends on what you use it for. WordPress is practical for content-heavy, frequently updated sites; for a store, Shopify offers a fast launch while WooCommerce gives more freedom; for custom, logic-heavy needs we recommend custom development. After the assessment we recommend what gives your case the best value for money — and if you don't need something, we'll tell you."
      },
      {
        "q": "What exactly is CRO, and why does it matter?",
        "a": "CRO (conversion rate optimisation) is the process of turning more of your existing traffic into customers or leads — without having to buy more ads. We refine the site through measurement, A/B tests and behaviour analysis. That's why our work doesn't stop at launch: a pretty site is just the starting point, and the results come from continuous optimisation."
      },
      {
        "q": "Why do speed and Core Web Vitals matter?",
        "a": "On a slow site, some visitors navigate away before it even loads, and Google treats Core Web Vitals as a ranking factor. So a slow page penalises you twice: worse search ranking and lower conversion. We fix this with optimised code, images and loading."
      },
      {
        "q": "Can you improve my existing website, or do you only build new ones?",
        "a": "Both work. In many cases a technical and CRO audit yields significant improvement on the existing site (speed, mobile experience, conversion points). But if the underlying system is outdated or hard to maintain, rebuilding is often more economical. At the assessment we'll honestly tell you which path makes sense."
      },
      {
        "q": "What happens to the website after handover?",
        "a": "You can request ongoing maintenance: updates, backups, bug fixes, performance and security monitoring, plus carrying the CRO process forward. Pricing is agreed up front with no hidden platform invoices — and if your own team takes it over, we prepare a clean, documented handover."
      }
    ],
    "cta": "Request your free website & CRO audit"
  },

  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI Marketing",
    subtitle: "Artificial intelligence at every stage of marketing",
    heroDesc:
      "AI opens new horizons in marketing: more accurate targeting, personalised content, predictive analytics. We reduce manual work and create new revenue opportunities.",
    metaTitle: "AI Marketing Agency 2026 | G2A Marketing",
    metaDesc:
      "AI marketing that pays off: predictive analytics, personalized content, automated ad optimization. We show where AI speeds you up — and where it doesn't.",
    icon: "bot",
    color: "#7c3aed",
    intro:
      "AI matured into an operationally usable tool between 2024-2026 — the hype gave way to real ROI. The G2A team uses Claude, ChatGPT, Manus, Gemini, Midjourney, Runway, ElevenLabs and Cursor in daily workflows — from content production to client project audits. We bring this experience to client projects: not as a promise, but as concrete, measurable workflow acceleration.",
    benefits: [
      {
        title: "Predictive analytics",
        desc: "Forecast buyer patterns (when next purchase, when churn risk), simulate campaign results before launch — based on Google AI + custom models.",
      },
      {
        title: "Personalised content",
        desc: "Dynamic email and web content: every visitor sees something different based on behaviour. HubSpot Smart Content + Mutiny + custom workflows.",
      },
      {
        title: "Automated ad optimisation",
        desc: "Performance Max, Smart Bidding, Meta Advantage+ campaigns with AI — Google/Meta AI iterates creatives and targeting, we provide the strategic frame and exclusion lists.",
      },
      {
        title: "Chatbot and AI agent integration",
        desc: "24/7 customer support with AI chatbots (Intercom Fin, Drift, or custom Claude-API solution). Typically 60-70% first-touch resolution rate after month 1.",
      },
      {
        title: "AI-assisted content production",
        desc: "Blog drafts, social copy, ad creatives — Claude + Midjourney + Runway hybrid pipeline. Weekly content output 3-5x with quality preserved.",
      },
      {
        title: "Conversion optimisation with machine learning",
        desc: "Predictive A/B tests (forecasting which variant wins), AI-driven UX heatmap analysis, dynamic landing page elements per visitor segment.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Needs assessment and AI audit",
        desc: "We map your marketing workflows, identify highest-ROI AI integration spots — and where it's a false friend. Concrete recommendation pack with KPIs.",
      },
      {
        step: "02",
        title: "Data strategy and platform choice",
        desc: "AI is only as good as your clean data. We build the data pipeline (CDP, GA4, CRM event tracking) and select AI tools fit for the task.",
      },
      {
        step: "03",
        title: "AI solution integration",
        desc: "Step-by-step rollout — one workflow at a time. We start with a pilot, measure, then scale. Never 5 parallel AI projects at once.",
      },
      {
        step: "04",
        title: "Measurement and iteration",
        desc: "Monthly review report: time and cost savings AI delivered vs. setup cost. Quarterly strategic review with new tool evaluation.",
      },
    ],
    faq: [
      {
        q: "What size of company is AI marketing for?",
        a: "Every size, but with different tools. For SMBs the content + ad-creative AI assist (Claude + Midjourney + Runway) delivers the fastest ROI. For mid-market, predictive analytics and CRM-AI integration. For enterprise, custom model fine-tuning on first-party data.",
      },
      {
        q: "How soon can results be seen?",
        a: "Content pipeline acceleration: 2-3 weeks. AI-assisted ad optimisation: 4-6 weeks. Predictive analytics and personalisation: 3-4 months (data is required). Custom AI agent: 6-9 months for full ROI.",
      },
      {
        q: "Which AI tools do you use specifically?",
        a: "LLM: Claude (1M token context), ChatGPT (general), Gemini (Workspace integration), Manus (autonomous agents). Image: Midjourney v7, DALL·E 3, Adobe Firefly. Video: Runway Gen-4, Sora. Voice: ElevenLabs. Marketing-specific: HubSpot AI, Surfer, Frase, Clearscope. Detailed list at /technologia.",
      },
      {
        q: "Will AI increase ad costs?",
        a: "Short-term, there's a setup cost (audit, integration, training) — typically a one-off HUF 300-800k (≈ €750–2,000). Long-term it delivers 20-40% efficiency gains: more conversions for the same spend, or the same conversions for less spend.",
      },
      {
        q: "How does it integrate with existing systems?",
        a: "Via API integration. Most common: HubSpot/Salesforce CRM + Claude API for client emailing, GA4 + Google AI for predictive analytics, Intercom + custom RAG (own client document base) for chatbots. G2A writes the workflows; you receive the finished integration.",
      },
      {
        q: "What about GDPR and data protection?",
        a: "We pick AI tools that operate in EU regions or contractually guarantee not to use your data for training. Enterprise versions of OpenAI, Anthropic and Google all offer this. G2A never sends client data to free-tier OpenAI endpoints — only enterprise/zero-retention endpoints.",
      },
    ],
    cta: "Request a free AI marketing audit",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC and Google Ads",
    subtitle: "Paid advertising that pays back — across every Google channel",
    heroDesc:
      "Paid ads are essential when you need new customers fast. We build data-driven PPC campaigns across Google Search, Display, Shopping and YouTube — always aligned with your business goals.",
    metaTitle: "Google Ads & PPC Agency 2026 — Measurable ROI | G2A",
    metaDesc:
      "Data-driven Google Ads campaigns: Search, Shopping, YouTube, Performance Max. Transparent pricing, weekly optimization. Get your free Google Ads audit.",
    icon: "target",
    color: "#ea4335",
    intro:
      "By 2026 Google Ads has gone almost entirely smart-bidding-driven — meaning the era of manual bid management is over, replaced by strategy, structure and the quality of conversion signals. Modern Google Ads work is 30% creative, 30% data engineering, 20% tracking setup and 20% strategy. G2A delivers exactly this combination.",
    benefits: [
      {
        title: "Search Ads",
        desc: "Keyword-based ads with search intent. SKAG or SPAG structure, broad match + audience signals, dynamic search ads (DSA) for long-tail.",
      },
      {
        title: "Display Network and YouTube",
        desc: "Visual ads on Google's partner network + YouTube. TrueView for Action and Demand Gen campaigns, retargeting across the web.",
      },
      {
        title: "Shopping (e-commerce)",
        desc: "Product-based ads for webshops. Merchant Center feed optimisation, category-level bidding strategy, custom labels for seasonality.",
      },
      {
        title: "Performance Max",
        desc: "Cross-channel AI campaign. Asset group structure per customer segment, audience signal strategy, brand exclusion + tiltóra — so it doesn't cannibalise Search.",
      },
      {
        title: "Remarketing and audiences",
        desc: "Customer Match lists (email upload), website visitor remarketing, similar audience, lookalike. LTV-based segment strategy.",
      },
      {
        title: "Conversion tracking and tagging",
        desc: "GA4 + Google Tag Manager + enhanced conversions + offline conversion import (sync from CRM). Accurate attribution all the way to actual sales.",
      },
    ],
    process: [
      {
        step: "01",
        title: "PPC audit",
        desc: "Free account review (or, if no account, keyword map). We measure Quality Score, wasted spend %, conversion-tracking accuracy. Immediately actionable recommendations.",
      },
      {
        step: "02",
        title: "Keyword and audience research",
        desc: "Industry-specific keyword map with intent segmentation. Competitor ad copy analysis. Audience list build (1st party + Customer Match + similar).",
      },
      {
        step: "03",
        title: "Campaign build and launch",
        desc: "SKAG/SPAG structure, ad copy variants (4-6 per ad group), responsive search ads, image extensions. Full tracking validation before go-live.",
      },
      {
        step: "04",
        title: "Weekly optimisation and reporting",
        desc: "Weekly negative keyword expansion, ad copy iteration, audience tuning. Monthly full report: Search Term report, Auction Insights, ROAS trend. Quarterly strategic review.",
      },
    ],
    faq: [
      {
        q: "What budget should we start with?",
        a: "Industry-dependent. Local services (hairdresser, car repair): HUF 100-200k (≈ €250–500)/month. SMB B2B or webshop: HUF 300-800k (≈ €750–2,000). Mid-market e-commerce: HUF 1-3M+ (≈ €2,500–7,500+). In high-CPC verticals (legal, insurance, finance) it's hard to deliver measurable results below HUF 800k (≈ €2,000).",
      },
      {
        q: "What's the difference between Search and Performance Max?",
        a: "Search = precise keyword targeting with search intent — more control, lower scalability. Performance Max = AI-driven cross-channel — less control, much higher scalability. Optimal strategy: Search for brand + high-intent keywords, Performance Max for discovery + new customer acquisition.",
      },
      {
        q: "Do you also handle YouTube and Shopping campaigns?",
        a: "Yes, all four main campaign types (Search, Display + YouTube, Shopping, Performance Max). For YouTube we can bring in a dedicated video creative partner; for Shopping we optimise Merchant Center feeds (TecDoc/Carzone for automotive, or custom WooCommerce/Shopify feeds).",
      },
      {
        q: "How do we measure campaign success?",
        a: "Conversions, CPA (cost per acquisition), ROAS (return on ad spend) — basics. Plus: average Quality Score, Search Impression Share, brand vs non-brand revenue split. For e-commerce: LTV-based ROAS (not just first-purchase, but 12-month value).",
      },
      {
        q: "What's the agency fee?",
        a: "Two models: (1) flat retainer (HUF 200-600k (≈ €500–1,500)/month based on campaign size); (2) % of media spend (10-15%, typically for larger campaigns). G2A doesn't hide platform invoices — every advertising cost goes directly from your card to Google.",
      },
      {
        q: "Is a long-term contract required?",
        a: "No, we work on a 30-day notice period. Honestly though: Google Ads needs 2-3 months for smart bidding to learn, Quality Score to stabilise, and real optimisation work to happen. One-month experiments rarely deliver.",
      },
    ],
    cta: "Request a free Google Ads audit",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta Ads (Facebook + Instagram)",
    subtitle: "Social media advertising that delivers conversions",
    heroDesc:
      "Social media ads let us reach exactly the audience most likely to convert. We design creative, data-driven campaigns on Meta (Facebook, Instagram) and LinkedIn — campaigns that deliver real conversions, not just reach.",
    metaTitle: "Meta Ads Agency 2026 — Ads That Convert | G2A",
    metaDesc:
      "Results-focused Facebook, Instagram and LinkedIn ad management: Reels-first creative, Conversion API, A/B testing. Get your free Meta Ads audit.",
    icon: "smartphone",
    color: "#1877f2",
    intro:
      "On Meta platforms (Facebook + Instagram), 6+ million active Hungarian users move daily. Since Apple's iOS 14.5 ATT change in 2021, targeting has become less certain — making 2026 Meta Ads success hinge on creative and the Conversion API. G2A focuses precisely on these: rapid creative iteration + clean server-side conversion tracking.",
    benefits: [
      {
        title: "Facebook Ads (CBO + ASC)",
        desc: "Campaign Budget Optimization or Advantage+ Shopping Campaigns. Audience signal strategy, separating cold + warm + hot funnel stages.",
      },
      {
        title: "Instagram Ads (Stories + Reels)",
        desc: "Reels-first creative strategy (Reels currently has the lowest CPM). Stories swipe-up integration, mobile-first experience.",
      },
      {
        title: "LinkedIn Ads (B2B)",
        desc: "Sponsored Content, Message Ads, Lead Gen Forms with B2B targeting. Company size, role, industry + matched audience combinations.",
      },
      {
        title: "Lookalike and Custom Audience",
        desc: "1%, 3%, 5% lookalike segments seeded by top-10% LTV customers. Customer Match email upload + website visitor.",
      },
      {
        title: "Lead Generation Ads",
        desc: "On-platform lead forms — the user never leaves Facebook. Higher conversion, lower CPL, but weaker lead quality (pre-screening questions needed).",
      },
      {
        title: "Conversion API + Pixel",
        desc: "Server-side event push (post-iOS14 solution). Stripe/HubSpot/Shopify integration + offline conversion import from CRM.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pixel + CAPI install",
        desc: "Meta Pixel + Conversion API setup with full server-side event flow. Target Event Match Quality 70%+ (vs the 30% average) — improves campaign performance by 20-30%.",
      },
      {
        step: "02",
        title: "Audience map and creative brief",
        desc: "Cold + warm + hot segment definition. Competitor ad library mining (Meta Ad Library + Foreplay). Creative brief with 5-8 concepts.",
      },
      {
        step: "03",
        title: "Creative production and launch",
        desc: "5-8 creative variants per ad set (static + video + carousel + UGC style). Launch with 50/50 cold-warm split, learn fast in week 1.",
      },
      {
        step: "04",
        title: "Iterate and scale",
        desc: "Weekly creative rotation (creative-fatigue strategy), audience expansion. Scale via CBO, ad set duplication for winning creatives.",
      },
    ],
    faq: [
      {
        q: "How long until we can start advertising?",
        a: "We build the structure within 1-2 weeks: Pixel + Conversion API setup (3-4 days), audience map (2 days), first creative batch (5-7 days). The first learning phase post-launch is 7-14 days.",
      },
      {
        q: "What does ad budget depend on?",
        a: "Industry (CPM HUF 600-3,500  (≈ €1.5–9)typically), audience size (smaller = costlier creative needed), and funnel stage. Realistic minimum: HUF 200-400k (≈ €500–1,000)/month for local business; HUF 600k-1.5M (≈ €1,500–3,750) for webshops or B2B lead gen.",
      },
      {
        q: "What creatives do we need?",
        a: "In 2026 it's Reels-first: 9:16 vertical video (15-30s), with captions (80% watch on mute), strong hook (first 1-2 seconds). Plus static carousels and UGC-style footage. We can produce in-house, with partner studios, or optimise your existing material.",
      },
      {
        q: "Can you also help with organic social media?",
        a: "Yes, we have a dedicated social media management service: content calendar, content production, community moderation, influencer relations. The two services (organic + paid) together are 2-3x more effective than separately.",
      },
      {
        q: "How do we measure success?",
        a: "CPC (cost per click), CPM (cost per thousand impressions), CTR, CPA (cost per acquisition), ROAS (return on ad spend) — basics. Plus: Brand Lift Studies (for larger campaigns), iOS 14.5+ privacy-conscious attribution model.",
      },
      {
        q: "What about post-iOS 14.5 tracking?",
        a: "Due to ATT (App Tracking Transparency), the Pixel only receives partial data. That's why the Conversion API matters: server-side event tracking that works on iOS too. G2A installs CAPI by default on every new project (not as an option).",
      },
    ],
    cta: "Request a free Meta Ads audit",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "Content Marketing",
    subtitle: "Valuable content that attracts customers",
    heroDesc: "Build authority and organic traffic with valuable content. Blog, video, podcast, infographic — across every channel.",
    metaTitle: "Content Marketing 2026 — SEO & AI Overviews | G2A",
    metaDesc:
      "Brand authority and organic traffic: blog, video, podcast, newsletter. Pillar-cluster strategy and AI-search-optimized content. Get a free content audit.",
    icon: "pen",
    color: "#10b981",
    intro:
      "In B2B and SMB segments, content marketing is the best long-term investment: a single well-written long-form article can drive organic traffic for 3-5 years. Yet 2026 brings Google AI Overviews and ChatGPT-powered search, transforming the game — it's no longer enough to write good content; it must be structured with schema and FAQ-style formatting so AI search uses it as a reference.",
    benefits: [
      {
        title: "Blog strategy and long-form articles",
        desc: "Keyword map and cluster strategy (pillar + cluster), 1,500-3,500-word articles. Schema.org Article/FAQ markup, AI Overviews-optimised format.",
      },
      {
        title: "Video and podcast",
        desc: "Scriptwriting, YouTube SEO (title, description, chapter markers), thumbnail A/B testing. Podcast: topic structure, production, editing, distribution (Spotify/Apple/YouTube).",
      },
      {
        title: "Newsletter and lead magnets",
        desc: "Weekly/monthly newsletter strategy (with topic-picker automation), e-books and whitepapers in exchange for email sign-up. Resend/Mailchimp integration.",
      },
      {
        title: "Thought leadership and LinkedIn",
        desc: "Articles and LinkedIn post sequences under the leader's personal name. Industry trend analysis, opinion pieces, life-situation narratives — humanising the brand.",
      },
      {
        title: "Content distribution and PR",
        desc: "Owned (own channels) + earned (PR) + paid (boost) three-tier distribution. Outreach to industry media, guest blogging, performance PR.",
      },
      {
        title: "Case studies and portfolio",
        desc: "Structured case study templates: challenge → solution → result → lesson. Anonymised version for tight NDA contexts.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Research and topic map",
        desc: "Keyword research (Ahrefs/Semrush + AlsoAsked), competitor gap analysis, ICP interviews (3-5 customers). Output: 6-12 month topic map.",
      },
      {
        step: "02",
        title: "Strategy and content calendar",
        desc: "Pillar-cluster structure, article-level brief for every topic (keyword, goal, structure, internal links). You receive the calendar; you approve.",
      },
      {
        step: "03",
        title: "Production and optimisation",
        desc: "Article production (AI-assisted but always human-edited), SEO editing (Surfer/Frase), schema markup, internal link network. 1-3 articles per week.",
      },
      {
        step: "04",
        title: "Distribution and measurement",
        desc: "Owned (own channels), earned (PR outreach), paid (boost). Monthly report: organic traffic, ranking, engagement, conversion. Quarterly topic pivot.",
      },
    ],
    faq: [
      {
        q: "How soon do first results appear?",
        a: "Long-tail keywords: 3-4 months (Google indexing + ranking growth). More competitive keywords: 6-9 months. Brand and authority building: 12-18 months. In the first months, consistent publishing — not traffic — is critical.",
      },
      {
        q: "Can you also help with video content?",
        a: "Yes. Two models: (1) full-service with partner video studios (script → shoot → edit → SEO); (2) AI-assisted production (Claude script + ElevenLabs voice + Runway visuals). The choice depends on brand needs and budget.",
      },
      {
        q: "What keyword strategy do you follow?",
        a: "Pillar-cluster model. 1 pillar page (broad topic, e.g. \"digital marketing for SMBs\") + 8-15 cluster articles (specific subtopics, e.g. \"local SEO tips\", \"Meta Ads for small businesses\"). Every cluster links internally to the pillar. AI Overviews-optimised FAQ section in every article.",
      },
      {
        q: "How do we measure content success?",
        a: "Top-of-funnel: organic traffic, keyword rankings, content sharing. Middle-of-funnel: page engagement (time on page, scroll depth), email sign-ups. Bottom-of-funnel: blog attribution (HubSpot multi-touch) — what % each article contributed to actual contracts.",
      },
      {
        q: "What investment is needed?",
        a: "Entry level (2 articles + content calendar / month): HUF 200-300k (≈ €500–750)/month. Serious content engine (1-2 articles + LinkedIn + newsletter / week): HUF 500-900k (≈ €1,250–2,250). Premium (3 articles + video + podcast / week): HUF 1.2-2.5M (≈ €3,000–6,250).",
      },
      {
        q: "What does AI Overviews optimisation mean?",
        a: "The Google AI Overviews (and ChatGPT-search) introduced in 2024-2025 cite articles differently: they look for short, question-answer-based, authority-signalled sections. So today a long-form article must contain structured FAQ sections, step sequences, and lists — otherwise AI search skips over it.",
      },
    ],
    cta: "Request a free content audit",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "Marketing Automation",
    subtitle: "Efficiency, AI-supported",
    heroDesc:
      "Save time and resources by automating repetitive marketing workflows. We build your email and CRM system so every prospect receives the right message at the right time.",
    metaTitle: "Marketing Automation 2026 — Email, CRM | G2A",
    metaDesc:
      "Automated marketing processes: email automation, CRM integration, lead scoring and AI-assisted segmentation. Less manual work, more conversions.",
    icon: "zap",
    color: "#f59e0b",
    intro:
      "Marketing automation works when the entire customer journey (lead → prospect → buyer → repeat customer) is modelled as a multi-actor workflow. G2A starts with sales-marketing alignment: defining MQL-SQL-Opportunity-Won and only then building automation — otherwise the smartest workflow is wasted if sales and marketing speak different languages.",
    benefits: [
      {
        title: "Email automation",
        desc: "Welcome sequences, lead nurturing flows, post-purchase follow-up, win-back campaigns. Triggers: website behaviour, email open, demo request, purchase amount.",
      },
      {
        title: "CRM integration",
        desc: "HubSpot, Salesforce, ActiveCampaign, Pipedrive, Odoo, Zoho setup with two-way sync. Custom field mapping per client need.",
      },
      {
        title: "Lead scoring and qualification",
        desc: "Explicit (company size, role) + implicit (page behaviour, email engagement) multiplied scoring. Hot lead 60+, MQL 30-59, raw 0-29.",
      },
      {
        title: "Sales funnel and pipeline",
        desc: "Conversion-oriented paths (lead → demo → POC → contract), upsell and cross-sell automations. HubSpot Deal-stage workflows.",
      },
      {
        title: "Segmentation (AI-assisted)",
        desc: "Behaviour-based dynamic segments: we use the Claude/GPT API to personalise email content per segment. Optimal send-time prediction model.",
      },
      {
        title: "Reporting and dashboards",
        desc: "Automated weekly/monthly reports (Looker Studio + HubSpot Reports). Multi-touch attribution: what % each channel contributed to final contracts.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Process mapping",
        desc: "Joint sales-marketing session (1-2 days): drawing the current lead flow, defining stages, identifying weak points. Output: concrete automation roadmap.",
      },
      {
        step: "02",
        title: "Platform selection",
        desc: "HubSpot vs Marketo vs ActiveCampaign vs Mailchimp decision based on company size, IT stack, CRM needs. Migration plan if switching.",
      },
      {
        step: "03",
        title: "Workflow development",
        desc: "1 workflow per 2 weeks: welcome series → lead nurture → handoff to sales → onboarding → upsell. Testing after each step.",
      },
      {
        step: "04",
        title: "Testing and iteration",
        desc: "A/B test every subject line + CTA + send time. Monthly review: KPI growth, workflow integrity check, prioritising new use-cases.",
      },
    ],
    faq: [
      {
        q: "Which platforms do you work with?",
        a: "HubSpot (SMB-mid full-stack), Marketo (enterprise), ActiveCampaign (SMB email + CRM), Mailchimp (basic email), Klaviyo (e-commerce), Pipedrive + Mailchimp combo (sales-first), Odoo (ERP-first), Zoho (cost-effective full-stack). Custom integrations: Zapier, Make.com, n8n.",
      },
      {
        q: "How long does implementation take?",
        a: "Basic email automation + CRM integration: 2-4 weeks. Lead scoring + sales funnel: 4-6 weeks. Multi-touch attribution + revenue dashboard: 6-8 weeks. Complex enterprise migration (e.g. Salesforce → HubSpot): 3-6 months.",
      },
      {
        q: "What do we need to start?",
        a: "Existing customer database (even Excel — we help migrate), business process map (or we draw one together), and sales-marketing willingness to collaborate (most important). Tech stack doesn't need to be decided upfront — we choose together.",
      },
      {
        q: "How does AI help with segmentation?",
        a: "Two layers: (1) predictive models (when next purchase, when churn, optimal send-time per customer); (2) generative personalisation (Claude API rewrites the base email template per segment, so we don't manually write 20 variants).",
      },
      {
        q: "What does it cost monthly?",
        a: "Setup: one-off HUF 600k–2.5M (≈ €1,500–6,250) depending on complexity. Monthly management: HUF 200-600k (≈ €500–1,500) (workflow maintenance, new campaigns, reporting). Platform licence separate — HubSpot Pro ~HUF 50k (≈ €130)/month, Marketo HUF 200k+ (≈ €500+).",
      },
      {
        q: "How do we measure marketing automation ROI?",
        a: "Time savings: hours of manual work shifted to workflows (typically 30-50% reduction in marketing team manual time). Conversion impact: lead → SQL and SQL → won deal rate improvement (typically 15-30% lift). Pipeline velocity: average sales-cycle shortening (10-25%).",
      },
    ],
    cta: "Request a free automation audit",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG Communications",
    subtitle: "Sustainability told credibly — without greenwashing",
    heroDesc:
      "We communicate your sustainability efforts so customers, investors and supply chains genuinely believe them — backed by data, in line with the EU Green Claims Directive and Hungarian regulation. Official ESG reporting and certification are handled by SZTFH-registered partners.",
    metaTitle: "ESG Communication 2026 — Without Greenwashing | G2A",
    metaDesc:
      "Credible, data-backed ESG and CSR communication: stakeholder messaging, green marketing and rating preparation — without greenwashing.",
    icon: "leaf",
    color: "#22c55e",
    intro:
      "Important boundary upfront: G2A Marketing Bt. is NOT registered with the Hungarian Authority of Regulated Activities (SZTFH), so under Hungarian Act CVIII of 2023 we do not perform official ESG advisory or ESG certification — mandatory CSRD reporting and certification are entrusted to SZTFH-registered partners or recommended auditors. What we do: the communication side of ESG strategy, stakeholder messaging, brand narrative, marketing-grade content and rating preparation. Our founder Attila Győrfi as an ESG specialist provides informal expert advice, but this does not replace official registered ESG advisory.",
    benefits: [
      {
        title: "ESG communication strategy",
        desc: "We translate the double materiality assessment OUTPUT (delivered by your registered advisor) into credible external communication. Stakeholder map and prioritised message hierarchy.",
      },
      {
        title: "ESG communication materials and design",
        desc: "Website ESG section, annual report design and narrative (the official content comes from the registered auditor; we make it readable and brand-consistent), social media + LinkedIn post sequences.",
      },
      {
        title: "Greenwashing-free green marketing",
        desc: "ISO 14021 Type II environmental claims — credible, data-backed statements. Phrasing prepared for the EU Green Claims Directive 2026 requirements.",
      },
      {
        title: "Stakeholder communication",
        desc: "Investor IR communications, customer-facing green marketing, internal employee ESG campaigns — each in different language, on different channels, with legal review.",
      },
      {
        title: "CSR content and campaigns",
        desc: "Volunteer-day storytelling, partnership case studies, local community project communication. We turn CSR into a brand-building narrative — pure communication work, not regulated territory.",
      },
      {
        title: "Rating preparation (communication side)",
        desc: "EcoVadis / CDP / MSCI ESG self-assessment questionnaire communication preparation: drafting answer wording. The actual data and assessment come from the company or the registered advisor.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Scope clarification and gap analysis",
        desc: "First meeting: clearly demarcating what the registered ESG advisor / auditor handles (or which partner we recommend), and what we cover on the communications side. Output: role matrix so the boundaries are clear.",
      },
      {
        step: "02",
        title: "Communications strategy and message system",
        desc: "We translate ESRS data delivered by the registered advisor into public communication. Message hierarchy: enterprise → industry → concrete action. Risk analysis: what may and may not be claimed legally.",
      },
      {
        step: "03",
        title: "Content development and design",
        desc: "Annual report visual design and narrative (registered auditor delivers the official professional content), website ESG section, LinkedIn campaign, customer letters, press kit. EU Taxonomy alignment review.",
      },
      {
        step: "04",
        title: "Distribution and stakeholder engagement",
        desc: "Investor roadshow presentation, customer newsletter, press conference. Yearly refreshed communication content. EcoVadis / CDP / MSCI rating preparation on the communications side.",
      },
    ],
    faq: [
      {
        q: "Do you produce official ESG reports for our company?",
        a: "No, and we're explicit about this: G2A Marketing Bt. is NOT registered with the Hungarian Authority of Regulated Activities (SZTFH) for ESG advisory or ESG certification (Act CVIII of 2023), so we don't undertake official CSRD report production or certification. We work on the communications side: making the official document produced by your registered advisor / auditor readable and brand-consistent, drafting stakeholder messaging, building the website ESG section and campaign. For official reporting we recommend SZTFH-registered partners.",
      },
      {
        q: "Is CSRD-mandated ESG reporting required for us?",
        a: "Under the Hungarian transposition (Act CVIII of 2023), it's gradually mandatory from 2024: large enterprises (250+ staff, €40M+ revenue, €20M+ balance sheet — at least 2 of 3) first, then listed SMEs from 2026. Smaller companies still voluntary, but B2B supply chains push the requirement down. For exact applicability check with a registered advisor or auditor — we don't provide legal qualification.",
      },
      {
        q: "What's the difference between ESG and CSR?",
        a: "CSR (Corporate Social Responsibility): voluntary, narrative-based corporate responsibility — pure communications work for us, no regulatory limit. ESG (Environmental, Social, Governance): legally regulated framework with KPIs and mandatory auditing — the official part is for SZTFH-registered experts; we only handle the communication side.",
      },
      {
        q: "How do we avoid greenwashing?",
        a: "Three principles in communication: (1) only data-backed claims (no \"nature-friendly\", only \"95% recycled material, ISO 14021 Type II certified\"); (2) full lifecycle thinking in phrasing; (3) reference to independent audit for every concrete number. The EU Green Claims Directive 2026 will enforce these in law — we shape every green communication piece accordingly.",
      },
      {
        q: "Can you help improve our ESG rating?",
        a: "On the communications side, yes — for EcoVadis, CDP, MSCI ESG Ratings: drafting the self-assessment questionnaire answers to present actual performance in best light. The numerical data and actual assessment come from the company or registered advisor. If base activity exists and only documentation + communication is weak, EcoVadis Bronze → Silver lift is typically achievable in 6-12 months.",
      },
      {
        q: "What does ESG communication cost?",
        a: "Small company (voluntary ESG comms, website ESG section + 1 annual piece): HUF 600k–1.5M (≈ €1,500–3,750). Large SMB (communication package built around the registered auditor's report): HUF 1.5-3M (≈ €3,750–7,500). Enterprise (continuous IR + stakeholder communication): HUF 3-7M (≈ €7,500–17,500) / year. The registered ESG advisor / auditor fee (HUF 1-15M (≈ €2,500–37,500) depending on size) is on top and independent of us.",
      },
      {
        q: "How do we find an SZTFH-registered ESG advisor or auditor?",
        a: "SZTFH publicly maintains the ESG advisor and ESG auditor registry — check the authority's official website. We're not on the list, but we work as a partner with several registered audit firms and can introduce one fitting your industry and size. The selection and contract are between you two; we don't take referral commissions.",
      },
    ],
    cta: "Request free ESG communications consulting",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "Employer Branding",
    subtitle: "Employer brand that attracts talent",
    heroDesc:
      "The Hungarian labour market 2025-2026 presented a historic challenge: 2.5% unemployment, high turnover, generational gaps between Gen Z and Y workers. A strong employer brand isn't a luxury — it's a critical business advantage.",
    metaTitle: "Employer Branding 2026 — Attract Top Talent | G2A",
    metaDesc:
      "EVP development, career site, recruitment marketing and employee storytelling. Attract and keep the best. Get a free employer branding consultation.",
    icon: "users",
    color: "#8b5cf6",
    intro:
      "The Hungarian HR market is now as competitive as the customer market: if you don't advertise, you don't find candidates. Employer branding sits between HR and marketing — G2A builds the bridge that turns the abstract \"employer brand\" into real recruitment and retention tools. With ESG compliance, generational adaptation, and performance measured across the Profession.hu / LinkedIn / Glassdoor triad.",
    benefits: [
      {
        title: "EVP development (Employer Value Proposition)",
        desc: "Authentic EVP based on real employee interviews. Not a PR slogan — what people actually receive. Ready in 4-6 weeks.",
      },
      {
        title: "Careers page and application flow",
        desc: "Conversion-optimised careers page with per-position landing pages. Greenhouse / Workable / custom ATS integration. Mobile-first design (Gen Z).",
      },
      {
        title: "Recruitment marketing",
        desc: "LinkedIn, Profession.hu, Facebook, Instagram, TikTok campaigns by position. Sponsored Content for B2B, Reels for Gen Z — different creatives.",
      },
      {
        title: "Employee storytelling",
        desc: "\"Day in the life\" videos, behind-the-scenes Reels, team profile articles. The employee is the brand ambassador — not a marketing slogan.",
      },
      {
        title: "Glassdoor + Profession.hu reputation",
        desc: "Employer profile optimisation, response strategy for reviews (good and bad alike), proactive review collection from satisfied staff.",
      },
      {
        title: "Internal communication and onboarding",
        desc: "Structured onboarding flow from new hire to first 90 days. Internal newsletter, success stories, team-building communication.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Employer brand audit",
        desc: "Map today's candidate experience: why people leave, why they join, what's the Glassdoor/Profession rating. 5-8 employee interviews, 2-3 ex-employee. Output: reality map.",
      },
      {
        step: "02",
        title: "EVP articulation",
        desc: "Condense the \"what people actually receive\" list into 3-4 strongest pillars. Test with target-audience focus groups. Final EVP statement.",
      },
      {
        step: "03",
        title: "Communication and campaign",
        desc: "Careers page redesign, LinkedIn/Profession content calendar, video story pipeline, Glassdoor profile revision. Recruitment campaigns by position.",
      },
      {
        step: "04",
        title: "Measurement and iteration",
        desc: "Time-to-hire, cost-per-hire, offer acceptance rate, employee NPS monthly. Glassdoor / Profession.hu rating trend. Quarterly EVP validation.",
      },
    ],
    faq: [
      {
        q: "When is it time for employer branding?",
        a: "Three signals: (1) you've spent over 3 months unable to fill an open position; (2) your turnover exceeds the industry average (typically over 15% annually); (3) your Glassdoor/Profession.hu rating is below 3 stars. Any signal makes EB no longer optional but necessary.",
      },
      {
        q: "How soon do results appear?",
        a: "Careers page redesign: 4-6 weeks. First recruitment campaign result: 6-8 weeks. Full EVP impact (application volume + quality): 4-6 months. Glassdoor rating improvement: 6-12 months (reviews accumulate over time).",
      },
      {
        q: "How do we measure employer branding success?",
        a: "5 main KPIs: time-to-hire (drops 15-30%), cost-per-hire (drops 20-40%), offer acceptance rate (rises from 60% to 80%), employee NPS (rises 6-7 to 8-9), Glassdoor rating (rises 0.5-1 stars). All measurable on a 12-18 month horizon.",
      },
      {
        q: "What if we're a small company?",
        a: "Employer branding works at SMB scale too — in fact it's most intimate and credible there. A 5-30 person company doesn't need a million-forint budget: basic careers page + Profession.hu profile + LinkedIn post calendar under owner/HR director name delivers from HUF 150-250k (≈ €380–630)/month.",
      },
      {
        q: "Can you set up an influencer / employee advocacy program?",
        a: "Yes. Train employees (5-10 volunteer brand ambassadors) with LinkedIn post recipes and content calendars. A 5-person advocacy program's organic reach is typically 3-5x larger than the corporate LinkedIn page itself.",
      },
      {
        q: "What does it cost monthly?",
        a: "SMB basic (careers page + Profession + 4 LinkedIn posts/month): HUF 200-400k (≈ €500–1,000). Mid-sized company (full EB stack: career + LinkedIn + Profession + Glassdoor management + storytelling): HUF 500-900k (≈ €1,250–2,250). Enterprise (advocacy + video pipeline): HUF 1.2-2.5M (≈ €3,000–6,250).",
      },
    ],
    cta: "Request a free employer branding consultation",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "International Marketing",
    subtitle: "Global markets, local perspective",
    heroDesc:
      "Entering foreign markets? Localisation is the key to success: a website translation isn't enough — you need to adapt to cultural particularities and local search engines. Hungarian + international experience with direct Chinese-market connections.",
    metaTitle: "International Marketing 2026 — DACH, CEE, China | G2A",
    metaDesc:
      "Multilingual SEO, cross-border campaigns, localization and market-entry strategy: DACH, CEE, UK and China — with direct China connections.",
    icon: "globe",
    color: "#06b6d4",
    intro:
      "Hungarian SMBs in 2025-2026 are increasingly looking towards regional markets (DACH, CEE) — the domestic market is saturated and HUF volatility creates risk. Our founder Attila Győrfi is a guest lecturer at IBS Budapest, the University of Pécs Faculty of Business and Economics, and the University of Warsaw, and an international marketing specialist with direct connections to Polish, Czech and Chinese-market actors. This isn't agent relationships; it's operational knowledge.",
    benefits: [
      {
        title: "Market entry strategy",
        desc: "Deep market analysis: demand, competition, channel structure, regulation. Go-to-market roadmap for 12 months.",
      },
      {
        title: "Localisation (not translation)",
        desc: "Culturally adapted content: not literal but transferred to local context. Native-speaker editors for every target language.",
      },
      {
        title: "Multilingual SEO",
        desc: "Hreflang implementation with the right ccTLD or subdomain strategy. Per-language keyword research (German uses different phrasing than Hungarian). Local link building.",
      },
      {
        title: "Cross-border PPC",
        desc: "Google Ads + Meta cross-country campaigns. Separate currency handling, country-specific billing flow, EU-wide GDPR compliance.",
      },
      {
        title: "Chinese market specialisation",
        desc: "WeChat, Baidu, Xiaohongshu (Little Red Book), Douyin (Chinese TikTok) marketing. Sino-Hungarian business partnership consulting.",
      },
      {
        title: "Local partnerships and influencer",
        desc: "Polish, Czech, German and Chinese influencer connections. Identifying local wholesalers and resellers. PR in target markets.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Market analysis and target country pick",
        desc: "Top 3-5 target country evaluation: market size, demand, competition intensity, TAM (Total Addressable Market) estimation. Win-rate calculator per country.",
      },
      {
        step: "02",
        title: "Localisation strategy",
        desc: "Domain strategy (.de vs /de, ccTLD vs subdomain), hreflang setup, native content editor selection. Company registration or local entity if needed.",
      },
      {
        step: "03",
        title: "Content and website localisation",
        desc: "Multilingual website versions, marketing materials (email, social) localisation, per-country keyword map. Pilot country 2-3 months.",
      },
      {
        step: "04",
        title: "Campaigns and scaling",
        desc: "Local Google Ads + Meta launch. Local PR and influencer outreach. Monthly review: which country scales, which scales down or fails.",
      },
    ],
    faq: [
      {
        q: "Which markets do you support for expansion?",
        a: "Primarily: DACH (Germany, Austria, Switzerland), CEE (Poland, Czech Republic, Slovakia, Romania), BeNeLux and UK. Special: China (WeChat + Baidu + local partnerships). For global expansion (US, India, MENA) we work with partner agencies.",
      },
      {
        q: "What's the difference between translation and localisation?",
        a: "Translation = literal conversion (often starting with machine translation). Localisation = full adaptation including humour, references, visual elements (models, colours), payment methods, legal text. A \"best in class\" slogan that works in Hungarian may be grammatically wrong in German and culturally alien in Polish.",
      },
      {
        q: "Do we need a new domain?",
        a: "Two strategies: (1) ccTLD (country domain): alongside domain.hu, domain.de, domain.cz — best local SEO but expensive and complex. (2) Subdomain or subdirectory: de.domain.com or domain.com/de — simpler but weaker local ranking. We typically recommend subdomain/subdirectory up to the 2-3rd market, then ccTLD.",
      },
      {
        q: "How long is the process?",
        a: "Pilot market (1 new country): 4-12 weeks full localisation flow. Scaling to additional markets: 6-8 weeks per new market if pilot is successful. Whether company formation or local entity is needed: separate consulting, 3-6 months.",
      },
      {
        q: "Can you help with Chinese market consulting?",
        a: "Yes. Our founder Attila Győrfi is a guest lecturer at IBS Budapest, the University of Pécs Faculty of Business and Economics, and the University of Warsaw, and a Chinese market specialist. He's reachable on WeChat with our Chinese partners directly. WeChat marketing, Baidu SEO, Tmall/JD listings, Xiaohongshu (Little Red Book) influencer campaigns. For Chinese market entry we typically also bring a Hungarian-Chinese legal practitioner due to the regulatory aspect.",
      },
      {
        q: "What does international expansion marketing cost?",
        a: "Pilot country launch (DACH/CEE): one-off HUF 1.5-3M (≈ €3,750–7,500) (localisation + setup + first campaigns). Monthly management: HUF 400-900k (≈ €1,000–2,250) / country. Chinese market pilot: HUF 3-6M (≈ €7,500–15,000) (more complex regulatory side). Ad spend separate, typically HUF 300k-1.5M (≈ €750–3,750)/month per country depending on market size.",
      },
    ],
    cta: "Request a free international marketing consultation",
  },
};

// ─── ZH ─────────────────────────────────────────────────────────────────────
const ZH: Record<string, ServiceConfig> = {  "arculattervezes": {
    "slug": "arculattervezes",
    "title": "面向中小企业与 B2B 公司的品牌视觉设计",
    "subtitle": "从标志到品牌手册的独特视觉身份 —— 在每一处保持一致。",
    "heroDesc": "品牌的视觉身份胜过千言万语 —— 它往往是潜在客户对您的第一印象。我们设计标志、色彩体系、字体与图形系统,让同一个信息贯穿每一个接触点。这不是装饰:而是从战略出发、易于识别、能够建立信任的视觉身份。",
    "metaTitle": "品牌视觉设计 2026 – 视觉身份 | G2A Marketing",
    "metaDesc": "为中小企业与 B2B 公司提供标志、品牌手册、印刷与数字物料设计。打造与众不同、赢得信任的一致视觉身份。立即获取报价!",
    "icon": "brand",
    "color": "#ec4899",
    "intro": "在 2026 年,品牌视觉不是奢侈品,而是经营的基础:客户会在几秒内判断是否信任您,而这种判断很大程度上由视觉呈现决定。标志不统一、用色随意、各处出现六种不同字体 —— 即使观看者说不出问题所在,也能立刻察觉到不协调。在 G2A Marketing,我们始终从战略推导视觉:先理解您的客户是谁、您与竞争对手的差异、您希望占据什么定位,然后才开始设计。最终交付的不只是一个好看的标志,而是一套可运作的系统:一份品牌手册,为您未来的每一份物料定调,从名片到网站。没有战略,就没有品牌。",
    "benefits": [
      {
        "title": "独特且可保护的标志",
        "desc": "不用模板,不用素材库。我们从多个概念方向出发,再将选定方案以简洁、可缩放的矢量格式交付 —— 在任何尺寸、任何背景下都适用,小至网站图标,大至门头招牌。"
      },
      {
        "title": "完整的品牌手册",
        "desc": "我们规范标志用法、安全留白、禁止用法、完整色彩体系(HEX、RGB、CMYK、Pantone)、字体与图形元素。有了这份文件,无论是内部团队还是外部合作方,都能保持一致地使用您的品牌。"
      },
      {
        "title": "在每一处保持一致",
        "desc": "从网站到社交媒体,再到印刷名片,统一的视觉语言贯穿始终。一致性是识别度的基础:反复的接触才能逐步建立信任与品牌记忆。"
      },
      {
        "title": "可直接付印的物料",
        "desc": "名片、宣传册、易拉宝、文件夹、演示模板 —— 以可付印文件交付,并附上生产所需的技术参数(出血、裁切线、色彩配置)。如有需要,我们也可推荐可靠的印刷合作伙伴。"
      },
      {
        "title": "数字品牌工具包",
        "desc": "社交媒体模板、电子邮件签名、演示母版、帖子框与封面图。我们交付可编辑的模板(如 Canva 或 Figma),让您能够自行快速制作日常内容,并保持品牌一致。"
      },
      {
        "title": "战略定位,而非装饰",
        "desc": "对我们而言,视觉身份源自品牌战略 —— 目标受众、竞争背景、核心信息。因此整个过程不是口味之争,而是一连串有理有据、服务于您实际业务目标的决策。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "调研与品牌简报",
        "desc": "我们深入了解您的业务:客户是谁、您的差异点、您想唤起的感受,以及您在市场中的定位。我们梳理您现有的物料以及竞争对手的视觉风格。这份简报是整个项目的指南针。"
      },
      {
        "step": "02",
        "title": "概念与标志设计",
        "desc": "我们呈现多个差异鲜明的视觉方向 —— 配以情绪板,并说明每个概念为何适合您的受众。您选定方向后,我们再细化打磨,直至最终标志。"
      },
      {
        "step": "03",
        "title": "搭建视觉识别系统",
        "desc": "围绕标志,我们构建完整体系:色彩、字体层级、图形元素与图像风格。我们将这一切整理成品牌手册,确保您的视觉呈现在未来也保持一致。"
      },
      {
        "step": "04",
        "title": "应用与交付",
        "desc": "我们制作具体物料 —— 可付印的名片、宣传册、易拉宝以及数字模板。我们交付完整的源文件包,并在交付沟通中带您逐一了解,助您自信地使用。"
      }
    ],
    "faq": [
      {
        "q": "完成一整套品牌视觉需要多长时间?",
        "a": "标志与核心识别系统通常需要 3-5 周。完整套餐(手册、印刷与数字物料一并)一般为 5-8 周,具体取决于范围与反馈轮次的推进速度。调研阶段结束后,我们会给出明确的时间表。"
      },
      {
        "q": "我只想要一个标志,不要整套,可以吗?",
        "a": "可以。许多客户先从标志开始,之后再扩展系统。我们会如实告知:仅有标志不足以实现一致的视觉呈现,因此建议至少同时定义基础色彩与字体。对于我们认为无助于您目标的事,我们也会直说不。"
      },
      {
        "q": "最终我会拿到什么,文件是什么格式?",
        "a": "标志包含矢量(SVG、AI、EPS)与成品图像格式(PNG、JPG),涵盖多种变体与背景;品牌手册为 PDF;印刷物料为可付印 PDF;数字模板为可编辑形式(如 Canva/Figma)。所有源文件都归您所有。"
      },
      {
        "q": "我已经有标志了,只想更新一下,你们做吗?",
        "a": "做,品牌重塑与视觉焕新也是我们的专长。我们会评估现有识别中哪些有效、哪些无效,再根据当前形象中沉淀的品牌资产多少,建议渐进式调整或彻底重新设计。我们不会随意丢弃您已经建立起来的识别度。"
      },
      {
        "q": "你们如何确保视觉身份真正契合我的业务?",
        "a": "靠的是从战略而非口味出发。在品牌简报中我们锁定受众、定位与核心信息,并将每一个视觉决策与之关联。我们在呈现概念时附上理由,让选择成为有依据的决策,而非凭感觉。"
      },
      {
        "q": "视觉身份完成后,你们也能帮助落地应用吗?",
        "a": "可以。由于 G2A Marketing 是全案代理,我们能将视觉身份无缝延伸到您的网站、社交媒体、广告与内容上。交付时您会获得所需的全部模板;如有需要,我们也会在持续应用中与您并肩同行。"
      }
    ],
    "cta": "获取定制品牌报价"
  },
  "hirdeteskezeles": {
    "slug": "hirdeteskezeles",
    "title": "PPC 与广告管理 —— 一套战略,贯通所有平台",
    "subtitle": "在 Google Ads、Meta、LinkedIn 与 TikTok 上运行数据驱动的付费广告,以 ROI 为统一核心。",
    "heroDesc": "付费广告的成效,来自一套统一战略的统筹,而非各平台各自为政的修补。我们的团队提供全面的多平台 PPC 管理:让预算投向客户真正做决定的地方,让每一分投入都对应可衡量的目标。没有战略,就没有 G2A。",
    "metaTitle": "PPC 与广告管理 2026 —— 多平台投放管理 | G2A Marketing",
    "metaDesc": "多平台 PPC 管理:Google Ads、Meta、LinkedIn 与 TikTok 统一于一套战略。数据驱动结构、A/B 测试、转化追踪。立即预约免费审计!",
    "icon": "ads",
    "color": "#f43f5e",
    "intro": "在 2026 年,付费广告早已不是单一平台的命题:您的客户同样来自 Google 搜索、Meta 信息流、LinkedIn 的 B2B 场景与 TikTok 视频。只有把这些渠道放进同一套数据驱动的结构中统筹,而非各自分散优化,PPC 与广告管理才能带来真正的回报。G2A Marketing 提供贯通各平台的投放管理:持续把预算调向单次转化成本最优的方向,用 A/B 测试打磨信息,用精准的转化追踪衡量结果。我们不兜售承诺,而是交付一套可在月度报告中跟踪的透明流程 —— 没有隐藏的平台账单。",
    "benefits": [
      {
        "title": "一套战略,多个平台",
        "desc": "Google Ads、Meta、LinkedIn 与 TikTok 并非彼此孤立的孤岛:我们在共同目标与统一归因下运行它们,让您看清每个渠道在购买旅程中的作用。"
      },
      {
        "title": "数据驱动的账户结构",
        "desc": "围绕真实的搜索与购买意图搭建广告系列与广告组 —— 清晰的细分,让预算流向有利可图的方向,而非四处流失。"
      },
      {
        "title": "跨平台预算分配",
        "desc": "在单次转化成本最优处加大投入,在回报转弱处收回 —— 基于每周复盘,而非凭感觉。"
      },
      {
        "title": "A/B 测试与创意",
        "desc": "我们对广告文案、创意与落地方向进行结构化测试。只有数据验证的版本才胜出 —— 落败的变体随即替换。"
      },
      {
        "title": "精准的转化追踪",
        "desc": "配置 GA4、平台像素以及必要时的服务器端衡量,让报告呈现真实的销售线索与成交,而非误导性的点击数。"
      },
      {
        "title": "透明的月度报告",
        "desc": "一份简明易懂的报告:预算去向、单次转化成本、下一步动作。您清楚为什么付费 —— 没有隐藏项目。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "审计与目标设定",
        "desc": "我们梳理现有账户、衡量体系与竞争环境,厘清业务目标与切合实际的 KPI(CPA、ROAS),再确定哪些平台真正相关 —— 若某个平台不值得投,我们会直说。"
      },
      {
        "step": "02",
        "title": "战略与结构",
        "desc": "搭建贯通各平台的投放方案:在何处、用何种信息触达何人,以及预算如何分配。建立清晰的账户结构与转化追踪以供衡量。"
      },
      {
        "step": "03",
        "title": "上线与测试",
        "desc": "投放上线,并在最初几周对创意、信息与定向进行结构化 A/B 测试。从早期数据中筛出真正有效的方向。"
      },
      {
        "step": "04",
        "title": "优化与扩量",
        "desc": "持续优化定向、出价与预算分配,把表现优异的方向放大投放。在月度报告中呈现成效与下一步动作。"
      }
    ],
    "faq": [
      {
        "q": "这与单独投放 Google Ads 或 Meta 广告有何不同?",
        "a": "这是贯通各平台的管理:我们不是只运行单一渠道,而是在同一套战略下统筹 Google、Meta、LinkedIn 与 TikTok 广告,采用统一的预算分配与归因。如果您只需要 Google Ads 或只需要 Meta,我们另有专门服务 —— 这里则是把整体组合协调到一起。"
      },
      {
        "q": "需要多少预算才值得开始?",
        "a": "没有唯一的固定金额,因为不同行业与平台的竞争各不相同。审计时我们会告诉您,需要多少投入才能积累足够的测试数据 —— 若预算不足以支撑目标,我们会直说,而不是无果地花掉。"
      },
      {
        "q": "多久能看到初步成效?",
        "a": "学习与测试阶段通常为 4-6 周,才能基于稳定数据进行优化。搜索广告一般转化更快;展示广告与社交品牌建设方向则需要更长时间成熟。具体时间表会在审计时给出。"
      },
      {
        "q": "我该在哪些平台投放?",
        "a": "这取决于您,而非我们:您的买家在哪里、意图是什么。B2B 通常以 Google 搜索与 LinkedIn 为主;B2C 则 Meta 与 TikTok 更强。审计时我们会逐个平台说明建议理由 —— 您不必同时出现在所有平台。"
      },
      {
        "q": "广告账户与数据归谁所有?",
        "a": "始终归您。我们在您名下创建账户,或在您现有账户上工作,由您授予我们访问权限。因此即使日后您另有打算,您的数据与我们搭建的结构仍归您所有 —— 没有锁定。"
      },
      {
        "q": "你们如何衡量与报告?",
        "a": "我们用 GA4、平台像素以及必要时的服务器端衡量来配置转化追踪,让真实的销售线索与成交体现在数据中。您会收到清晰的月度报告:预算去向、各平台的单次转化成本,以及下一步动作。"
      }
    ],
    "cta": "预约免费 PPC 审计"
  },
  "kozossegi-media": {
    "slug": "kozossegi-media",
    "title": "社交媒体管理 —— 把粉丝转化为忠实社区",
    "subtitle": "战略、内容、社区管理与红人合作一站式服务,面向中小企业与 B2B 公司。",
    "heroDesc": "社交媒体不是随意发帖,而是一套体系:战略、内容日历、一致的品牌语调以及每日的社区管理。G2A Marketing 在 Facebook、Instagram、LinkedIn 与 TikTok 上,从设定目标到内容审核,负责完整流程。没有战略,就没有 G2A:我们先明确受众与衡量指标,然后才发布内容。",
    "metaTitle": "社交媒体管理 2026 —— 品牌建设 | G2A Marketing",
    "metaDesc": "在 Facebook、Instagram、LinkedIn 与 TikTok 上提供社媒战略、内容生产、社区管理与红人营销。立即领取免费社媒诊断!",
    "icon": "social",
    "color": "#3b82f6",
    "intro": "到 2026 年,社交媒体已成为品牌建设最重要的自然渠道之一 —— 但平台算法更严格,用户也能立刻识破空洞的营销。如今取胜的不是内容工厂,而是能建立真实社区的、持续且可信的存在。G2A Marketing 不会孤立地运营各个渠道,而是把它们统一到一套战略之中:内容日历、明确的品牌语调、积极的社区管理,以及在真正契合时的红人合作。Facebook、Instagram、LinkedIn 与 TikTok,各按其逻辑运营,但传递统一的品牌信息。我们理性地运用 AI 进行内容构思与排期,但语调与审核始终由人来把控。我们还会提供透明的月度报告:发布了什么、什么有效、什么无效,以及下个月的计划。",
    "benefits": [
      {
        "title": "战略先行,而非随意发帖",
        "desc": "我们先明确受众、定位与衡量指标,然后才创作内容。每条帖子都服务于一个业务目标 —— 知名度、社区建设或获客 —— 而不是为发而发。"
      },
      {
        "title": "内容日历与一致的品牌语调",
        "desc": "我们搭建周度与月度内容日历,让发布可预期、可规划。跨平台统一的视觉风格与品牌语调,让您的品牌在喧嚣的信息流中依然清晰可辨。"
      },
      {
        "title": "针对平台量身定制的内容",
        "desc": "我们不会把同一条帖子推向所有渠道。LinkedIn 专业、TikTok 短而有冲击力、Instagram 重视觉、Facebook 偏社区 —— 我们为每个渠道生产其原生格式的内容。"
      },
      {
        "title": "积极的社区管理与审核",
        "desc": "我们按您的品牌语调,及时回应评论、私信与评价。审核也会处理负面声音 —— 冷静而专业 —— 因为妥善处理的投诉能赢得信任。"
      },
      {
        "title": "真正契合的红人营销",
        "desc": "我们不以粉丝数量挑选红人,而是寻找受众与您真正重叠的相关合作伙伴。创意 brief、合作框架与效果衡量均由我们协调。"
      },
      {
        "title": "透明的衡量与月度报告",
        "desc": "触达、互动、受众增长,以及在有意义时引导至网站的流量:每月您都会收到清晰的报告。没有隐藏的平台账单,价格事先透明。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "诊断与战略",
        "desc": "我们梳理您当前的存在、竞争对手与目标受众,选定相关平台(并非每个平台都适合每个品牌),并确定目标、语调与 KPI。"
      },
      {
        "step": "02",
        "title": "内容日历与创意",
        "desc": "我们编制月度内容日历:主题、格式、排期。按平台定制地生产帖子、视觉与文案,并设有供您审批的内置节点。"
      },
      {
        "step": "03",
        "title": "发布与社区管理",
        "desc": "我们按排期发布,并每日管理社区:评论、私信、审核。在适合的情况下,协调红人合作。"
      },
      {
        "step": "04",
        "title": "衡量、报告与优化",
        "desc": "我们每月评估结果,分析哪些有效,并据此微调下个月的内容。持续、数据驱动的迭代。"
      }
    ],
    "faq": [
      {
        "q": "社交媒体多久能见到效果?",
        "a": "自然品牌建设需要耐心:持续的存在与社区增长通常在 3-6 个月内才真正显现。最初几周主要在搭建内容体系与语调,实质性的势头会在此之后形成。"
      },
      {
        "q": "我们应该用哪些平台?",
        "a": "用您受众真正所在的平台。B2B 中 LinkedIn 往往是主渠道;消费品牌适合 Instagram 与 TikTok;本地企业适合 Facebook。我们会在诊断中共同决定 —— 您无需出现在每个平台上。"
      },
      {
        "q": "内容是你们生产,还是我们来?",
        "a": "由我们生产:文案、视觉、内容日历。如果您有自己的素材(照片、视频、产品图),我们会整合进来。我们依托您品牌的内部知识,但执行由我们负责 —— 您只需审批。"
      },
      {
        "q": "你们如何处理负面评论与危机?",
        "a": "依照事先约定的审核原则,并按您的品牌语调处理。对合理投诉冷静而务实地回应,对恶意攻击按规则处理。遇到严重危机时,我们会在发布任何内容前立即与您沟通。"
      },
      {
        "q": "红人营销包含在服务里吗?",
        "a": "包含,在契合的前提下。我们寻找相关的合作伙伴(不只看粉丝数量),并管理 brief、合作框架与效果衡量。红人费用为单独成本,事先透明地规划。"
      },
      {
        "q": "你们会用 AI 来生产内容吗?",
        "a": "会,但是理性地用:用于构思、草稿与排期。最终的品牌语调、编辑与社区互动仍由人来完成 —— AI 提升效率,但不会取代可信的存在。"
      }
    ],
    "cta": "领取免费社交媒体诊断"
  },
  "strategiai-marketing": {
    "slug": "strategiai-marketing",
    "title": "面向中小企业与 B2B 公司的战略营销",
    "subtitle": "从审计到行动计划:可衡量、可落地的数据驱动营销战略。",
    "heroDesc": "战略是决定每一分营销预算去向的唯一关键点。我们梳理您的市场、竞争对手与目标受众,在此基础上构建定位、营销组合与以 KPI 为核心的行动计划。我们不是向您推销一场活动,而是给您方向 —— 因为在我们这里,没有战略,就没有 G2A。",
    "metaTitle": "战略营销咨询 2026 – 审计、KPI、行动计划 | G2A Marketing",
    "metaDesc": "面向中小企业与 B2B 的营销审计、市场与竞品分析、用户画像、营销组合与 KPI 行动计划。预约免费战略咨询。",
    "icon": "strategy",
    "color": "#6366f1",
    "intro": "在 2026 年,战略营销不是一份 PPT 愿景,而是一套可运转的系统:清晰的定位、可衡量的目标受众与可追责的 KPI。多数中小企业与 B2B 公司花钱不当,并非因为预算少,而是因为缺乏决策框架 —— 一场活动接一场活动地被动应对,没有衡量,也没有方向。正因如此,G2A Marketing 坚持战略优先:我们的每一项服务 —— SEO、PPC、社媒、网站 —— 都建立在经过审计的战略之上,而非相反。我们扎根于佩奇,服务覆盖全国与国际,定价透明、按月报告、周期务实。这是我们的旗舰页面:您的营销究竟是服务于业务目标,还是只在烧钱,正是在这里见分晓。",
    "benefits": [
      {
        "title": "营销审计",
        "desc": "我们对您现有营销进行全面体检:渠道、信息、网站、数据分析、投入与成效。让您看清什么有效、预算在哪里流失,以及最大的未开发机会在何处。"
      },
      {
        "title": "市场与竞品分析",
        "desc": "我们梳理您的市场定位与主要竞争对手的战略 —— 信息、定价、渠道、薄弱点。我们寻找您能差异化突围的具体缺口,而不是填一张空洞的 SWOT 表。"
      },
      {
        "title": "目标受众与用户画像",
        "desc": "我们基于数据与访谈,构建 2-3 个真实买家画像:他是谁、痛点是什么、在哪里能触达、决策由什么驱动。每条信息与渠道都基于此,而非凭空假设。"
      },
      {
        "title": "定位与信息体系",
        "desc": "我们明确客户为何应选择您而非竞争对手。清晰的价值主张与信息支柱,在每一处触点 —— 网站、广告、方案 —— 都保持一致表达。"
      },
      {
        "title": "营销组合与渠道规划",
        "desc": "我们判断哪些渠道能以最佳回报触达您的受众(SEO、PPC、社媒、邮件、内容),并制定优先级清晰的计划:先投什么、按何顺序投入。"
      },
      {
        "title": "KPI 体系与行动计划",
        "desc": "我们设定可衡量的目标(线索、CAC、ROAS、转化),并构建 6-12 个月的优先级路线图。您将清楚下一步是什么、衡量什么、何时复盘 —— 并有月度报告支撑。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "调研与审计",
        "desc": "我们了解您的业务目标,审视现有营销、数据分析与销售流程。您将得到一幅基于事实的现状图景 —— 不加粉饰。"
      },
      {
        "step": "02",
        "title": "市场、竞品与受众",
        "desc": "我们分析您的市场与竞争对手,并构建真实用户画像。差异化缺口在此浮现,该向谁精准发声也由此变得清晰。"
      },
      {
        "step": "03",
        "title": "战略、定位、营销组合",
        "desc": "我们确立定位与信息体系,选择合适的渠道,并设计与您预算相匹配、优先级清晰的营销组合。"
      },
      {
        "step": "04",
        "title": "KPI、行动计划与衡量",
        "desc": "我们锁定可衡量的目标与 KPI,提供优先级清晰的行动计划与路线图,随后在月度报告中追踪成效并持续微调。战略始终是一份活的文档。"
      }
    ],
    "faq": [
      {
        "q": "制定一份营销战略需要多长时间?",
        "a": "一份聚焦的战略,包含审计、市场与竞品分析、用户画像与行动计划,通常需要 3-5 周。涉及多条业务线的复杂情形需 6-8 周 —— 进度取决于我们获取您数据与团队配合的速度。"
      },
      {
        "q": "多久能看到成效?",
        "a": "战略本身就是一套可立即使用的决策框架。落地成效因渠道而异:付费活动数周内即可衡量,而 SEO 或内容方向通常在 3-6 个月内带来可衡量的自然增长。我们承诺务实的周期,而非奇迹。"
      },
      {
        "q": "战略营销的费用是多少?",
        "a": "价格取决于公司规模、市场复杂度与所需深度。首次咨询免费,之后我们提供固定价格的战略套餐 —— 透明、预先约定,没有隐藏的平台账单。确切报价在调研阶段后给出。"
      },
      {
        "q": "战略对我具体有什么用?",
        "a": "它让您不再一场接一场地烧钱。您将清楚该面向谁、用什么信息、在哪个渠道、按何顺序投入 —— 并有 KPI 来检验它是否奏效。这是对您资源回报最高的投资。"
      },
      {
        "q": "我只拿到战略,还是也包含落地执行?",
        "a": "由您决定。许多客户拿走战略,由自己团队执行 —— 这完全可以,路线图正为此而设计。如您愿意,落地也可由我们承接:SEO、PPC、社媒、网站 —— 全部建立在同一份战略之上。"
      },
      {
        "q": "你们会用 AI 来制定战略吗?",
        "a": "会,作为工具。我们用 AI 更快处理市场与竞品数据并模拟情景,但定位与决策依靠人的专业判断。AI 是加速,而非替代 —— 我们理性地整合它,而不是当作魔法来兜售。"
      }
    ],
    "cta": "预约免费战略咨询"
  },
  "keresooptimalizalas": {
    "slug": "keresooptimalizalas",
    "title": "带来可衡量自然增长的 SEO",
    "subtitle": "技术 SEO、内容与链接建设统一为一套战略 —— 让对的人在 Google 和 AI 搜索中都能找到您。",
    "heroDesc": "自然搜索是回报最持久的渠道:您投入的不是每次点击的广告费,而是属于自己的长期曝光。通过技术 SEO 审计、On-page 优化、内容 SEO 与链接建设,我们提升您的网站在 Google 上的排名 —— 在 2026 年,还包括 AI 答案中的曝光。没有战略,我们不会开始;每月您都能在透明报告中清楚看到哪些指标在变化。",
    "metaTitle": "搜索引擎优化 (SEO) 专家服务 2026 – G2A Marketing",
    "metaDesc": "技术 SEO 审计、On-page、内容 SEO、链接建设与本地 SEO,带来可衡量的自然增长。透明月度报告,适配 AI 搜索。立即获取审计!",
    "icon": "seo",
    "color": "#0891b2",
    "intro": "进入 2026 年,SEO 已不只关乎 Google 的十个蓝色链接:Google AI Overviews、ChatGPT 与 Perplexity 都会在回答中引用来源,您也必须在这些场景中获得曝光(AEO/GEO)。但根本逻辑并未改变:一个快速、技术干净的网站,真正有用的内容,以及可信的外链。在 G2A Marketing,我们从战略入手 —— 通过关键词研究、竞品分析与技术审计梳理您的现状 —— 然后把技术 SEO、On-page 优化、内容营销与链接建设整合为一套系统。没有隐藏的平台账单,也没有空洞承诺:一套 SEO 战略通常在 3 至 6 个月内带来可衡量的自然增长,每月您都能在清晰报告中追踪关键词、流量与 Core Web Vitals 的变化。",
    "benefits": [
      {
        "title": "技术 SEO 审计",
        "desc": "我们梳理拖累网站的问题:索引与抓取障碍、速度、结构、错误重定向、重复内容、结构化数据。您将获得一份按影响排序的优先级问题清单。"
      },
      {
        "title": "On-page 优化",
        "desc": "标题、Meta 元素、内链结构、URL 与关键词地图,全部对齐搜索意图 —— 让 Google 准确理解每个页面讲什么、面向谁。"
      },
      {
        "title": "内容 SEO 与内容营销",
        "desc": "从关键词研究出发的内容战略:撰写真正回答客户问题的文章与页面。这也是让 AI 搜索引擎(AI Overviews、ChatGPT、Perplexity)引用您的基础。"
      },
      {
        "title": "链接建设",
        "desc": "循序渐进、无风险地建立可信且相关的外链。重质不重量 —— 不做垃圾链接,不走可能招致惩罚的捷径,因为 Google 迟早会识破它们。"
      },
      {
        "title": "本地 SEO",
        "desc": "Google 商家资料、本地关键词、评价与本地引用 —— 让客户在您所在区域和目标城市搜索时就能找到您。植根佩奇,服务全国。"
      },
      {
        "title": "Core Web Vitals 与 AI 曝光",
        "desc": "如今加载速度、稳定性与响应性既是排名因素,也是用户体验因素。同时,我们让您的内容为出现在 AI 生成的答案中做好准备(AEO/GEO)。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "审计与关键词研究",
        "desc": "我们从技术 SEO 审计、竞品分析与关键词研究入手:您当前处于什么位置、客户在搜什么、最大的未开发机会在哪里。战略由此诞生。"
      },
      {
        "step": "02",
        "title": "战略与优先级",
        "desc": "我们制定 SEO 路线图:先修什么(通常是技术障碍)、需要什么内容、外链档案如何成长。配以现实的时间表与可衡量的 KPI —— 没有战略,就没有 G2A。"
      },
      {
        "step": "03",
        "title": "落地执行",
        "desc": "修复技术问题、On-page 优化、内容生产与链接建设,逐步推进。我们持续优化 Core Web Vitals,并为 AI 搜索引擎做内容准备。"
      },
      {
        "step": "04",
        "title": "测量与月度报告",
        "desc": "每月您都会收到透明报告:关键词排名、自然流量、转化与下一步计划。我们依据数据而非凭感觉来优化战略。"
      }
    ],
    "faq": [
      {
        "q": "多久能看到首批结果?",
        "a": "SEO 是中长期投资。技术修复的效果可能在 4 至 8 周内显现,但一套 SEO 战略通常在 3 至 6 个月内带来可衡量的自然增长。具体取决于竞争状况、起点与内容节奏。"
      },
      {
        "q": "你们保证 Google 第一名吗?",
        "a": "不保证 —— 对承诺保证的人请保持警惕。排名取决于 Google 的算法,没有人能操控它。我们保证的是:有优先级的专业工作、可衡量的流程与透明的报告。我们会现实地谈论预期结果。"
      },
      {
        "q": "什么是 Core Web Vitals,为什么重要?",
        "a": "Core Web Vitals 是 Google 的用户体验指标:加载速度、交互性与视觉稳定性。它们是排名因素,并直接影响转化 —— 访客在看到内容之前就会离开一个缓慢的页面。"
      },
      {
        "q": "在 AI 搜索时代,SEO 还有意义吗?",
        "a": "有,而且更重要。Google AI Overviews、ChatGPT 与 Perplexity 都会引用结构清晰、可信的内容作为来源。把经典 SEO 基础做扎实,也会让您在 AI 答案中更有曝光(AEO/GEO)。"
      },
      {
        "q": "月度报告里有什么?",
        "a": "关键词排名、自然流量与转化数据、已完成的工作以及下月计划 —— 用通俗语言呈现,而不只是图表。您随时能看到发生了什么、为什么,没有隐藏的平台账单。"
      },
      {
        "q": "链接建设有风险吗?Google 会惩罚吗?",
        "a": "垃圾式、购买的批量外链有风险,Google 终会识破。我们循序渐进地建立可信且相关的外链 —— 重质不重量。这带来持久的结果,而非被下一次算法更新收回的短暂跃升。"
      }
    ],
    "cta": "获取免费 SEO 审计"
  },
  "webfejlesztes": {
    "slug": "webfejlesztes",
    "title": "网站开发与 CRO —— 不只是好看，更要带来转化",
    "subtitle": "围绕“把访客变成客户”的转化目标，构建定制网站、电商与落地页。",
    "heroDesc": "您的网站不是装饰品，而是销售工具。我们构建快速、移动友好、易被搜索的网站 —— 从定制开发到 WordPress 与电商 —— 再通过持续的转化优化（CRO）提升成效。目标不是漂亮的设计，而是可衡量的更多询盘与客户。",
    "metaTitle": "网站开发与 CRO 2026 —— 转化优化网站 | G2A Marketing",
    "metaDesc": "定制网站、WordPress、Shopify 与 WooCommerce 电商、落地页与 CRO。快速、响应式、SEO 友好，带来可衡量的转化。立即申请审计。",
    "icon": "web",
    "color": "#f97316",
    "intro": "2026 年，网站是多数中小企业最重要的销售渠道 —— 但大多数网站却在流失访客：加载慢、移动端错位、用户找不到下一步该做什么。Google 将 Core Web Vitals 作为排名因素，因此慢速页面受到双重惩罚：排名更差，转化更少。G2A Marketing 不只是“做一个网站”，而是构建转化系统：根据任务选择定制开发、WordPress 或电商（Shopify、WooCommerce），将技术 SEO 写入代码，并在上线后持续进行 CRO。没有战略、没有衡量，就没有 G2A —— 设计是工具，而非最终结果。",
    "benefits": [
      {
        "title": "为转化而设计，而非只为好看",
        "desc": "设计引导访客走向目标：清晰的信息层级、有力的行动号召、无摩擦的表单。精致的界面是基线，转化才是标准 —— 每个元素都有其业务用途。"
      },
      {
        "title": "为任务选对技术",
        "desc": "并非所有项目都需要 WordPress，也并非都需要定制代码。内容繁多的网站用 WordPress，电商用 Shopify 或 WooCommerce，复杂需求用定制开发 —— 我们选择对您而言性价比最高的方案。"
      },
      {
        "title": "速度与 Core Web Vitals",
        "desc": "优化代码、图片与加载，让网站在移动端也能快速呈现。良好的 Core Web Vitals 分数能同时提升 Google 排名并减少加载过程中的流失。"
      },
      {
        "title": "响应式、移动优先的界面",
        "desc": "大部分流量来自移动端，因此我们以移动优先的理念开发。界面在任何屏幕尺寸上都保持可读、可点击、可购买 —— 手机、平板、桌面皆然。"
      },
      {
        "title": "代码层面的 SEO 友好基础",
        "desc": "干净的语义化代码、正确的标记、快速加载与结构化数据 —— 让搜索优化不是事后补丁，而是融入根基之中。"
      },
      {
        "title": "透明的定价与维护",
        "desc": "范围与价格预先约定，没有隐藏的平台账单。上线后提供更新、备份、修复与性能监控 —— 让网站长期保持为得到维护的资产。"
      }
    ],
    "process": [
      {
        "step": "01",
        "title": "评估与转化目标",
        "desc": "我们审视现有网站（或从零开始的需求）、目标受众与业务目标。明确“成功”意味着什么 —— 询价、购买、预约 —— 以及用哪些 KPI 来衡量。"
      },
      {
        "step": "02",
        "title": "架构、UX 与技术选型",
        "desc": "围绕转化构建网站结构与用户路径，然后选择平台（定制、WordPress、Shopify、WooCommerce）。在线框图与内容方案获批后即开始开发。"
      },
      {
        "step": "03",
        "title": "开发、内容与测试",
        "desc": "我们编写响应式、快速、SEO 友好的代码，导入内容，并在每种设备上测试。上线前会验证 Core Web Vitals 分数以及表单、结账与购物车的运行。"
      },
      {
        "step": "04",
        "title": "上线、衡量与持续 CRO",
        "desc": "上线后我们配置衡量体系（分析、转化跟踪），并启动转化优化：A/B 测试、行为分析、持续打磨。每月报告透明地呈现改善之处。"
      }
    ],
    "faq": [
      {
        "q": "做一个网站需要多长时间？",
        "a": "一个简单的落地页或展示型网站通常需要 2-4 周，较复杂的企业网站需 4-8 周，电商则视产品范围与集成一般需 6-12 周。准确的时间表在评估后给出，因为内容与决策环节往往比开发本身更耗时。"
      },
      {
        "q": "我该用 WordPress、Shopify、WooCommerce 还是定制开发？",
        "a": "取决于您的用途。内容繁多、频繁更新的网站适合 WordPress；电商方面，Shopify 上线快，WooCommerce 自由度更高；逻辑复杂的定制需求我们建议定制开发。评估之后，我们会推荐对您而言性价比最高的方案 —— 若某项您并不需要，我们会直说。"
      },
      {
        "q": "CRO 究竟是什么，为何重要？",
        "a": "CRO（转化率优化）是在不增加广告投放的前提下，把更多现有流量变为客户或询盘的过程。我们通过衡量、A/B 测试与行为分析来打磨网站。这正是我们的工作不止于上线的原因：漂亮的网站只是起点，成效来自持续优化。"
      },
      {
        "q": "速度与 Core Web Vitals 为何重要？",
        "a": "在慢速网站上，部分访客还没加载完就已离开，而 Google 又将 Core Web Vitals 视为排名因素。因此慢速页面受到双重惩罚：搜索排名更差、转化更低。我们通过优化代码、图片与加载来改善这一点。"
      },
      {
        "q": "你们能优化我现有的网站，还是只做新的？",
        "a": "两者皆可。许多情况下，一次技术与 CRO 审计就能让现有网站显著改善（速度、移动体验、转化点）。但如果底层系统已过时或难以维护，重建往往更经济。评估时我们会坦诚地告诉您哪条路更合理。"
      },
      {
        "q": "网站交付之后呢？",
        "a": "您可以申请持续维护：更新、备份、修复、性能与安全监控，以及继续推进 CRO 流程。定价预先约定，没有隐藏的平台账单 —— 若由您自己的团队接手，我们会准备规整且有文档的交接。"
      }
    ],
    "cta": "申请免费的网站与 CRO 审计"
  },

  "ai-marketing": {
    slug: "ai-marketing",
    title: "AI 营销",
    subtitle: "人工智能贯穿营销每一阶段",
    heroDesc:
      "AI 为营销开启新视野:更精准的定向、个性化内容、预测性分析。我们减少手工工作并创造新的收入机会。",
    metaTitle: "AI 营销 — 营销中的人工智能 | G2A Marketing",
    metaDesc:
      "个性化内容、预测性分析、自动化广告优化与聊天机器人。让您的营销借助人工智能实现数据驱动。",
    icon: "bot",
    color: "#7c3aed",
    intro:
      "AI 在 2024-2026 年间从炒作过渡到可量化 ROI 的实用工具。G2A 团队在日常工作中使用 Claude、ChatGPT、Manus、Gemini、Midjourney、Runway、ElevenLabs 与 Cursor —— 从内容生产到客户项目审计。我们将这种经验带到客户项目中:不是承诺,而是具体、可衡量的工作流程加速。",
    benefits: [
      {
        title: "预测性分析",
        desc: "预测购买模式(下次购买时机、流失风险)、活动启动前模拟结果 —— 基于 Google AI + 自有模型。",
      },
      {
        title: "个性化内容",
        desc: "动态邮件与网页内容:每位访客根据行为看到不同内容。HubSpot Smart Content + Mutiny + 自定义工作流。",
      },
      {
        title: "自动化广告优化",
        desc: "AI 驱动的 Performance Max、Smart Bidding、Meta Advantage+ 活动 —— Google/Meta AI 迭代创意与定向,我们提供战略框架与排除清单。",
      },
      {
        title: "聊天机器人与 AI 代理集成",
        desc: "AI 聊天机器人提供 24/7 客户支持(Intercom Fin、Drift、或基于 Claude API 的定制方案)。月度首次接触解决率通常 60-70%。",
      },
      {
        title: "AI 辅助内容生产",
        desc: "博客草稿、社媒文案、广告创意 —— Claude + Midjourney + Runway 混合流水线。每周内容产出 3-5 倍提升,质量保持不变。",
      },
      {
        title: "机器学习驱动的转化优化",
        desc: "预测性 A/B 测试(预先估算获胜变体)、AI 驱动的 UX 热图分析、按访客细分的动态落地页元素。",
      },
    ],
    process: [
      {
        step: "01",
        title: "需求评估与 AI 审计",
        desc: "梳理营销流程,识别 AI 集成的最高 ROI 节点 —— 以及哪些是表象。具体建议包附带 KPI。",
      },
      {
        step: "02",
        title: "数据战略与平台选择",
        desc: "AI 的水平取决于您数据的清洁度。我们构建数据流水线(CDP、GA4、CRM 事件追踪)并为任务选择合适的 AI 工具。",
      },
      {
        step: "03",
        title: "AI 方案集成",
        desc: "逐步推进 —— 一次一个工作流。从试点开始、衡量、再扩展。绝不同时进行 5 个 AI 项目。",
      },
      {
        step: "04",
        title: "衡量与迭代",
        desc: "月度审查报告:AI 带来的时间与成本节省 vs 设置成本。季度战略复审,评估新工具。",
      },
    ],
    faq: [
      {
        q: "AI 营销适合多大规模的公司?",
        a: "各种规模均适用,但工具不同。中小企业方面,内容 + 广告创意 AI 辅助(Claude + Midjourney + Runway)回报最快。中型企业方面,预测分析和 CRM-AI 集成。企业级方面,基于第一方数据的定制模型微调。",
      },
      {
        q: "多久能见效?",
        a: "内容流水线加速:2-3 周。AI 辅助广告优化:4-6 周。预测分析与个性化:3-4 个月(需要数据)。定制 AI 代理:6-9 个月达到完整 ROI。",
      },
      {
        q: "你们具体使用哪些 AI 工具?",
        a: "LLM:Claude(100 万 token 上下文)、ChatGPT(通用)、Gemini(Workspace 集成)、Manus(自主代理)。图像:Midjourney v7、DALL·E 3、Adobe Firefly。视频:Runway Gen-4、Sora。语音:ElevenLabs。营销专用:HubSpot AI、Surfer、Frase、Clearscope。详见 /technologia 页面。",
      },
      {
        q: "AI 会增加广告成本吗?",
        a: "短期有设置成本(审计、集成、培训) —— 通常一次性 30-80 万福林。长期带来 20-40% 效率提升:相同支出更多转化,或相同转化更少支出。",
      },
      {
        q: "如何与现有系统集成?",
        a: "通过 API 集成。最常见:HubSpot/Salesforce CRM + Claude API 用于客户邮件、GA4 + Google AI 用于预测分析、Intercom + 定制 RAG(自有客户文档库)用于聊天机器人。G2A 编写工作流,您只需在最终接收完成的集成。",
      },
      {
        q: "GDPR 与数据保护如何处理?",
        a: "我们选择在欧盟区域运行或合同保证不使用您数据训练的 AI 工具。OpenAI、Anthropic、Google 的企业版均提供此选项。G2A 绝不向 OpenAI 免费版端点发送客户数据 —— 仅使用企业级/零保留端点。",
      },
    ],
    cta: "申请免费 AI 营销评估",
  },
  "ppc-google-ads": {
    slug: "ppc-google-ads",
    title: "PPC / Google Ads",
    subtitle: "付费搜索广告的专业管理",
    heroDesc: "通过专业的广告活动管理、精准定向和持续优化,最大化 Google Ads 投资回报。",
    metaTitle: "PPC Google Ads 管理 —— 付费广告 | G2A Marketing",
    metaDesc:
      "数据驱动的 PPC 活动:Search、Display、Shopping、YouTube 与 Performance Max。多平台、统一战略 —— G2A Marketing 带来可衡量的 ROI。",
    icon: "target",
    color: "#ea4335",
    intro:
      "到 2026 年 Google Ads 几乎全部转向智能出价 —— 意味着手动出价管理时代终结,取而代之的是战略、结构与转化信号质量。现代 Google Ads 工作 30% 是创意、30% 是数据工程、20% 是追踪设置、20% 是战略。G2A 提供这种组合。",
    benefits: [
      {
        title: "Search 广告",
        desc: "基于关键词的搜索意图广告。SKAG 或 SPAG 活动结构、广泛匹配 + 受众信号、用于长尾搜索的动态搜索广告 (DSA)。",
      },
      {
        title: "Display 网络与 YouTube",
        desc: "Google 合作伙伴网络 + YouTube 上的视觉广告。TrueView for Action 与 Demand Gen 活动,全网再营销。",
      },
      {
        title: "Shopping(电商)",
        desc: "为网店提供基于产品的广告。Merchant Center feed 优化、按类别的出价策略、用于季节性的自定义标签。",
      },
      {
        title: "Performance Max",
        desc: "跨渠道 AI 活动。按客户细分的 asset group 结构、受众信号策略、品牌排除 + 排除清单 —— 防止吞噬 Search 流量。",
      },
      {
        title: "再营销与受众",
        desc: "Customer Match 列表(邮箱上传)、网站访客再营销、相似受众、相似群体。基于 LTV 的细分策略。",
      },
      {
        title: "转化追踪与标签",
        desc: "GA4 + Google Tag Manager + 增强转化 + 离线转化导入(从 CRM 同步)。准确归因到实际销售。",
      },
    ],
    process: [
      {
        step: "01",
        title: "PPC 审计",
        desc: "免费账户审查(若无账户则提供关键词地图)。我们衡量质量得分、浪费支出 %、转化追踪准确性。立即可执行的建议清单。",
      },
      {
        step: "02",
        title: "关键词与受众调研",
        desc: "行业特定关键词地图,带意图细分。竞争对手广告文案分析。受众列表构建(第一方 + Customer Match + 相似群体)。",
      },
      {
        step: "03",
        title: "活动构建与上线",
        desc: "SKAG/SPAG 结构、广告文案变体(每个广告组 4-6 个)、响应式搜索广告、图片扩展。上线前完整追踪验证。",
      },
      {
        step: "04",
        title: "每周优化与报告",
        desc: "每周扩展否定关键词、迭代广告文案、调整受众。月度完整报告:搜索词报告、Auction Insights、ROAS 趋势。季度战略复审。",
      },
    ],
    faq: [
      {
        q: "起步预算应该是多少?",
        a: "因行业差异较大。本地服务(理发师、汽车维修):每月 10-20 万福林。中小企业 B2B 或网店:每月 30-80 万福林。中型电商:每月 100-300 万福林+。在高 CPC 行业(法律、保险、金融),每月低于 80 万福林难以达到可衡量结果。",
      },
      {
        q: "Search 与 Performance Max 有何区别?",
        a: "Search = 精确关键词定位与搜索意图 —— 控制力更强但扩展性较低。Performance Max = AI 驱动的跨渠道 —— 控制力较低但扩展性更高。最佳策略:Search 用于品牌 + 高意图关键词,Performance Max 用于发现 + 新客户获取。",
      },
      {
        q: "你们也管理 YouTube 与 Shopping 活动吗?",
        a: "是的,所有四种主要活动类型(Search、Display + YouTube、Shopping、Performance Max)。YouTube 可引入专门的视频创意合作伙伴;Shopping 我们优化 Merchant Center feed(汽车行业的 TecDoc/Carzone,或定制 WooCommerce/Shopify feed)。",
      },
      {
        q: "如何衡量活动成功?",
        a: "转化、CPA(获客成本)、ROAS(广告支出回报率) —— 基础指标。加上:平均质量得分、Search Impression Share、品牌 vs 非品牌收入分摊。电商:基于 LTV 的 ROAS(不仅是首次购买,而是 12 个月价值)。",
      },
      {
        q: "代理费用是多少?",
        a: "两种模式:(1)固定月费(根据活动规模 20-60 万福林/月);(2)媒体支出 % (10-15%,通常用于较大活动)。G2A 不隐藏平台账单 —— 每笔广告费直接从您的卡支付给 Google。",
      },
      {
        q: "需要长期合同吗?",
        a: "不需要,我们以 30 天通知期工作。但坦诚地说:Google Ads 需要 2-3 个月让智能出价学习、质量得分稳定、真正的优化工作发生。1 个月的实验很少能交付。",
      },
    ],
    cta: "申请免费 Google Ads 评估",
  },
  "meta-hirdetes": {
    slug: "meta-hirdetes",
    title: "Meta 广告",
    subtitle: "Facebook 与 Instagram 广告管理",
    heroDesc: "在全球最大的社交平台上触达您的目标受众。精准定向、创意广告、可衡量的成果。",
    metaTitle: "Meta 广告与社交媒体广告 | G2A Marketing",
    metaDesc:
      "结果导向的 Facebook、Instagram 与 LinkedIn 广告管理。受众细分、创意制作、A/B 测试与 ROI 优化。",
    icon: "smartphone",
    color: "#1877f2",
    intro:
      "在 Meta 平台(Facebook + Instagram)上,匈牙利每日活跃用户超过 600 万。自 2021 年 Apple iOS 14.5 ATT 变更以来,定向变得不那么确定 —— 因此 2026 年 Meta 广告的成功关键在于创意与 Conversion API。G2A 专注于此:快速创意迭代 + 干净的服务器端转化追踪。",
    benefits: [
      {
        title: "Facebook 广告(CBO + ASC)",
        desc: "Campaign Budget Optimization 或 Advantage+ Shopping Campaigns。受众信号策略、冷 + 暖 + 热漏斗阶段分离。",
      },
      {
        title: "Instagram 广告(Stories + Reels)",
        desc: "Reels 优先创意策略(目前 Reels 的 CPM 最低)。Stories 上滑集成、移动优先体验。",
      },
      {
        title: "LinkedIn 广告(B2B)",
        desc: "Sponsored Content、Message Ads、Lead Gen Forms 与 B2B 定向。公司规模、角色、行业 + 匹配受众组合。",
      },
      {
        title: "Lookalike 与自定义受众",
        desc: "1%、3%、5% 相似受众,基于前 10% LTV 客户。Customer Match 邮件上传 + 网站访客。",
      },
      {
        title: "Lead Generation 广告",
        desc: "平台内 lead form —— 用户不离开 Facebook。转化更高、CPL 更低,但线索质量较弱(需预筛选问题)。",
      },
      {
        title: "Conversion API + Pixel",
        desc: "服务器端事件推送(iOS14 后解决方案)。Stripe/HubSpot/Shopify 集成 + 从 CRM 离线转化导入。",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pixel + CAPI 安装",
        desc: "Meta Pixel + Conversion API 设置,完整服务器端事件流。Event Match Quality 目标 70%+(对比 30% 平均水平) —— 提升活动表现 20-30%。",
      },
      {
        step: "02",
        title: "受众地图与创意简报",
        desc: "冷 + 暖 + 热细分定义。竞争对手广告库挖掘(Meta Ad Library + Foreplay)。创意简报 5-8 个概念。",
      },
      {
        step: "03",
        title: "创意制作与上线",
        desc: "每个广告组 5-8 个创意变体(静态 + 视频 + 轮播 + UGC 风格)。50/50 冷-暖比例上线,第一周快速学习。",
      },
      {
        step: "04",
        title: "迭代与扩展",
        desc: "每周创意轮换(对抗创意疲劳策略)、受众扩展。通过 CBO 扩展、为获胜创意进行广告组复制。",
      },
    ],
    faq: [
      {
        q: "多久能开始投放?",
        a: "1-2 周内搭建结构:Pixel + Conversion API 设置(3-4 天)、受众地图(2 天)、首批创意(5-7 天)。上线后第一学习阶段 7-14 天。",
      },
      {
        q: "广告预算受什么因素影响?",
        a: "行业(CPM 通常 600-3500 福林)、目标受众规模(越小创意成本越高)、漏斗阶段。现实最低:本地企业每月 20-40 万福林;网店或 B2B 线索生成每月 60-150 万福林。",
      },
      {
        q: "需要什么样的创意?",
        a: "2026 年 Reels 优先:9:16 竖屏视频(15-30 秒)、带字幕(80% 静音观看)、强钩子(前 1-2 秒)。加上静态轮播和 UGC 风格素材。G2A 可与合作工作室一起制作,或优化您现有素材。",
      },
      {
        q: "你们也帮助自然社交媒体战略吗?",
        a: "是的,我们有专门的社交媒体管理服务:内容日历、内容生产、社区调节、网红关系。两个服务(自然 + 付费)结合比单独使用效果高 2-3 倍。",
      },
      {
        q: "如何衡量成功?",
        a: "CPC(每次点击成本)、CPM(每千次展示成本)、CTR、CPA(获客成本)、ROAS(广告支出回报率) —— 基础指标。加上:Brand Lift Study(较大活动)、iOS 14.5 后隐私意识归因模型。",
      },
      {
        q: "iOS 14.5 后追踪情况如何?",
        a: "由于 ATT(应用追踪透明度),Pixel 仅接收部分数据。这就是 Conversion API 的重要性:服务器端事件追踪在 iOS 上也能工作。G2A 在每个新项目默认安装 CAPI(非可选)。",
      },
    ],
    cta: "申请免费 Meta 广告评估",
  },
  "tartalommarketing": {
    slug: "tartalommarketing",
    title: "内容营销",
    subtitle: "讲述有价值的故事,促成销售",
    heroDesc:
      "内容营销不只是文章生产;我们制定能真实传递品牌价值、为受众痛点提供解决方案的战略。从博客到视频、从播客到简报 —— 我们协助规划、生产与分发。",
    metaTitle: "内容营销与文案撰写 | G2A Marketing",
    metaDesc:
      "建立品牌权威与自然流量。为中小企业与 B2B 公司提供博客撰写、视频与播客内容、简报、教育材料。",
    icon: "pen",
    color: "#10b981",
    intro:
      "在 B2B 与中小企业领域,内容营销是最佳长期投资:一篇优质长文可带来 3-5 年的自然流量。然而 2026 年 Google AI Overviews 与 ChatGPT 搜索改变了游戏 —— 仅写好内容已不够,必须以模式 (schema) 与 FAQ 风格的结构编写,让 AI 搜索将其作为参考。",
    benefits: [
      {
        title: "博客战略与长文",
        desc: "关键词地图与集群战略(pillar + cluster)、1500-3500 字文章。Schema.org Article/FAQ 标记、AI Overviews 优化格式。",
      },
      {
        title: "视频与播客",
        desc: "脚本撰写、YouTube SEO(标题、描述、章节标记)、缩略图 A/B 测试。播客:主题结构、制作、剪辑、分发(Spotify/Apple/YouTube)。",
      },
      {
        title: "简报与线索磁石",
        desc: "每周/每月简报战略(带主题选择自动化)、电子书与白皮书换邮件订阅。Resend/Mailchimp 集成。",
      },
      {
        title: "思想领导力与 LinkedIn",
        desc: "以领导者个人名义发布的文章与 LinkedIn 帖子序列。行业趋势分析、观点文章、生活情境叙事 —— 让品牌人性化。",
      },
      {
        title: "内容分发与 PR",
        desc: "Owned(自有渠道) + earned(PR 外联) + paid(推广)三层分发。行业媒体外联、客座博客、绩效 PR。",
      },
      {
        title: "客户案例与作品集",
        desc: "结构化案例模板:挑战 → 方案 → 结果 → 教训。严格保密协议下的匿名版本。",
      },
    ],
    process: [
      {
        step: "01",
        title: "调研与主题地图",
        desc: "关键词调研(Ahrefs/Semrush + AlsoAsked)、竞争对手差距分析、ICP 访谈(3-5 位客户)。输出:6-12 个月主题地图。",
      },
      {
        step: "02",
        title: "战略与内容日历",
        desc: "Pillar-cluster 结构、每个主题的文章级简报(关键词、目标、结构、内部链接)。您收到日历,您审批。",
      },
      {
        step: "03",
        title: "生产与优化",
        desc: "文章生产(AI 辅助但始终人工最终编辑)、SEO 编辑(Surfer/Frase)、schema 标记、内部链接网。每周 1-3 篇文章。",
      },
      {
        step: "04",
        title: "分发与衡量",
        desc: "Owned(自有渠道)、earned(PR 外联)、paid(推广)。月度报告:自然流量、排名、参与度、转化。季度主题转向。",
      },
    ],
    faq: [
      {
        q: "首批结果多久出现?",
        a: "长尾关键词 3-4 个月(Google 索引 + 排名增长)。竞争更激烈的关键词 6-9 个月。品牌建设与权威:12-18 个月。前几个月持续发布是关键,而非流量。",
      },
      {
        q: "你们也能协助视频内容生产吗?",
        a: "可以。两种模式:(1) 全方位服务,合作视频工作室(脚本 → 拍摄 → 剪辑 → SEO);(2) AI 辅助生产(Claude 脚本 + ElevenLabs 配音 + Runway 视觉)。选择取决于品牌需求与预算。",
      },
      {
        q: "你们采用什么关键词战略?",
        a: "Pillar-cluster 模型。1 个 pillar 页面(广义主题,如「中小企业数字营销」)+ 8-15 个 cluster 文章(具体子主题,如「本地 SEO 技巧」、「小企业 Meta 广告」)。每个 cluster 内部链接到 pillar。每篇文章带 AI Overviews 优化的 FAQ 部分。",
      },
      {
        q: "如何衡量内容成功?",
        a: "Top-of-funnel:自然流量、关键词排名、内容分享。Middle-of-funnel:页面参与(停留时间、滚动深度)、邮件订阅。Bottom-of-funnel:博客归因(HubSpot 多触点) —— 每篇文章对实际合同贡献的 %。",
      },
      {
        q: "需要多少投入?",
        a: "入门级(每月 2 篇 + 内容日历):每月 20-30 万福林。认真的内容引擎(每周 1-2 篇 + LinkedIn + 简报):50-90 万福林。高级(每周 3 篇 + 视频 + 播客):120-250 万福林。",
      },
      {
        q: "AI Overviews 优化是什么意思?",
        a: "Google 在 2024-2025 推出的 AI Overviews(以及 ChatGPT 搜索)以不同方式引用文章:寻找简短的、问答式的、带权威信号的段落。所以今天长文必须包含结构化 FAQ 部分、步骤序列与列表 —— 否则 AI 搜索会跳过它。",
      },
    ],
    cta: "申请免费内容评估",
  },
  "marketing-automatizacio": {
    slug: "marketing-automatizacio",
    title: "营销自动化",
    subtitle: "AI 支持的高效率",
    heroDesc:
      "通过自动化重复性营销流程节省时间与资源。我们搭建邮件与 CRM 系统,让每位潜在客户在合适时刻收到合适信息。",
    metaTitle: "营销自动化 — 邮件与 CRM | G2A Marketing",
    metaDesc:
      "构建自动化营销流程:邮件自动化、CRM 集成、线索培育、销售漏斗与细分。AI 辅助细分。",
    icon: "zap",
    color: "#f59e0b",
    intro:
      "营销自动化在整个客户旅程(线索 → 潜在客户 → 买家 → 重复客户)被建模为多角色工作流时才生效。G2A 从销售-营销协同开始:定义 MQL-SQL-Opportunity-Won,然后才构建自动化 —— 否则,即使最聪明的工作流,在销售与营销说不同语言时也是徒劳。",
    benefits: [
      {
        title: "邮件自动化",
        desc: "欢迎序列、线索培育流、购买后跟进、win-back 活动。触发条件:网站行为、邮件打开、演示请求、购买金额。",
      },
      {
        title: "CRM 集成",
        desc: "HubSpot、Salesforce、ActiveCampaign、Pipedrive、Odoo、Zoho 配置与双向同步。按客户需求定制字段映射。",
      },
      {
        title: "线索评分与资格审核",
        desc: "显性(公司规模、角色)+ 隐性(页面行为、邮件参与)乘积评分系统。热线索 60+、MQL 30-59、原始 0-29。",
      },
      {
        title: "销售漏斗与管道",
        desc: "转化导向路径(线索 → 演示 → POC → 合同)、追加销售与交叉销售自动化。HubSpot Deal-stage 工作流。",
      },
      {
        title: "细分(AI 辅助)",
        desc: "基于行为的动态细分:使用 Claude/GPT API 进行邮件内容个性化。最佳发送时间预测模型。",
      },
      {
        title: "报告与仪表板",
        desc: "自动化每周/每月报告(Looker Studio + HubSpot Reports)。多触点归因:每个渠道对最终合同的贡献 %。",
      },
    ],
    process: [
      {
        step: "01",
        title: "流程梳理",
        desc: "销售-营销联合会议(1-2 天):绘制当前线索流、定义阶段、识别弱点。输出:具体自动化路线图。",
      },
      {
        step: "02",
        title: "平台选择",
        desc: "HubSpot vs Marketo vs ActiveCampaign vs Mailchimp 决定,基于公司规模、IT 栈、CRM 需求。如需切换的迁移计划。",
      },
      {
        step: "03",
        title: "工作流开发",
        desc: "每 2 周 1 个工作流:欢迎系列 → 线索培育 → 销售交接 → onboarding → 追加销售。每步后测试。",
      },
      {
        step: "04",
        title: "测试与迭代",
        desc: "每个主题行 + CTA + 发送时间 A/B 测试。月度复审:KPI 增长、工作流完整性检查、新用例优先级排序。",
      },
    ],
    faq: [
      {
        q: "你们使用哪些平台?",
        a: "HubSpot(中小企业-中型全栈)、Marketo(企业级)、ActiveCampaign(中小企业邮件 + CRM)、Mailchimp(基础邮件)、Klaviyo(电商)、Pipedrive + Mailchimp 组合(销售优先)、Odoo(ERP 优先)、Zoho(经济实惠全栈)。定制集成:Zapier、Make.com、n8n。",
      },
      {
        q: "实施需多长时间?",
        a: "基础邮件自动化 + CRM 集成:2-4 周。线索评分 + 销售漏斗:4-6 周。多触点归因 + 收入仪表板:6-8 周。复杂企业级迁移(如 Salesforce → HubSpot):3-6 个月。",
      },
      {
        q: "需要什么开始?",
        a: "现有客户数据库(Excel 即可 —— 我们协助迁移)、业务流程地图(若无,共同绘制)、销售-营销协作意愿(最重要)。技术栈无需提前决定 —— 共同选择。",
      },
      {
        q: "AI 如何辅助细分?",
        a: "两个层级:(1) 预测模型(下次购买时机、流失时机、每位客户的最佳发送时间);(2) 生成式个性化(Claude API 重写每个细分的邮件模板,无需手写 20 个版本)。",
      },
      {
        q: "每月费用多少?",
        a: "设置:一次性 60 万-250 万福林,根据复杂度。每月管理:20-60 万福林(工作流维护、新活动、报告)。平台许可证另计 —— HubSpot Pro 约每月 5 万福林,Marketo 20 万+。",
      },
      {
        q: "如何衡量营销自动化 ROI?",
        a: "时间节省:手工工作转为工作流的小时数(营销团队手工时间通常减少 30-50%)。转化影响:线索 → SQL 与 SQL → 成交率改善(通常 15-30% 提升)。管道速度:平均销售周期缩短(10-25%)。",
      },
    ],
    cta: "申请免费自动化评估",
  },
  "esg-kommunikacio": {
    slug: "esg-kommunikacio",
    title: "ESG 传播",
    subtitle: "真实可信的可持续传播 — 杜绝漂绿",
    heroDesc:
      "我们以让客户、投资人与供应链真正信服的方式传播您的可持续努力 —— 以数据为支撑,符合欧盟绿色声明指令与匈牙利法规精神。官方 ESG 报告与认证由 SZTFH 注册合作伙伴执行。",
    metaTitle: "ESG 传播与可持续发展营销 | G2A Marketing",
    metaDesc:
      "无漂绿的 ESG 与 CSR 传播:利益相关方信息、绿色营销、网站 ESG 板块、评级准备。官方报告由注册合作伙伴提交。",
    icon: "leaf",
    color: "#22c55e",
    intro:
      "首先明确边界:G2A Marketing Bt. 未取得匈牙利监管活动监督管理局 (SZTFH) 注册,因此根据匈牙利 2023 年第 CVIII 号法律,我们不从事官方 ESG 咨询或 ESG 认证 —— 强制性 CSRD 报告的编制与认证由 SZTFH 注册合作伙伴负责或我们推荐审计师。我们承担:ESG 战略的传播侧、利益相关方信息、品牌叙事、营销级内容与评级准备。我们的创始人 Győrfi Attila 作为 ESG 专家提供非正式专业建议,但不替代官方注册 ESG 咨询。",
    benefits: [
      {
        title: "ESG 传播战略",
        desc: "我们将注册顾问交付的双重重要性评估 OUTPUT 转化为可信的对外传播。利益相关方地图与优先级信息层级。",
      },
      {
        title: "ESG 传播材料与设计",
        desc: "网站 ESG 板块、年度报告设计与叙事(官方内容由注册审计师提供,我们使其可读且品牌一致)、社交媒体 + LinkedIn 帖子序列。",
      },
      {
        title: "无漂绿的绿色营销",
        desc: "依 ISO 14021 Type II 环境主张 —— 可信、数据支持的声明。为欧盟绿色声明指令 2026 年要求做好的措辞准备。",
      },
      {
        title: "利益相关方沟通",
        desc: "投资人 IR 沟通、客户向绿色营销、员工内部 ESG 活动 —— 各以不同语言、不同渠道,带法律审查。",
      },
      {
        title: "CSR 内容与活动",
        desc: "志愿者日故事、合作案例研究、当地社区项目沟通。我们将 CSR 转化为品牌建设叙事 —— 纯粹传播工作,非受监管领域。",
      },
      {
        title: "评级准备(传播侧)",
        desc: "EcoVadis / CDP / MSCI ESG 自评估问卷的传播侧准备:答案的措辞结构化。实际数据与评估由公司或注册顾问提供。",
      },
    ],
    process: [
      {
        step: "01",
        title: "范围澄清与差距分析",
        desc: "首次会议明确划定:注册 ESG 顾问 / 审计师承担什么(或我们推荐哪位合作伙伴),以及我们在传播侧承担什么。输出:角色矩阵,使各方边界清晰。",
      },
      {
        step: "02",
        title: "传播战略与信息体系",
        desc: "将注册顾问交付的 ESRS 数据转化为公开传播。信息层级:企业 → 行业 → 具体行动。风险分析:法律上可声明与不可声明。",
      },
      {
        step: "03",
        title: "内容开发与设计",
        desc: "年度报告视觉设计与叙事(官方专业内容由注册审计师交付)、网站 ESG 板块、LinkedIn 活动、客户函、新闻稿。欧盟分类法对齐审查。",
      },
      {
        step: "04",
        title: "分发与利益相关方互动",
        desc: "投资人路演演示、客户简报、新闻发布会。每年更新的传播内容。EcoVadis / CDP / MSCI 评级准备的传播侧。",
      },
    ],
    faq: [
      {
        q: "你们为公司编制官方 ESG 报告吗?",
        a: "不,我们对此非常明确:G2A Marketing Bt. 未取得 SZTFH 颁发的 ESG 顾问或 ESG 认证注册(2023 年第 CVIII 号法律),因此不承担官方 CSRD 报告的编制与认证。我们在传播侧工作:将注册顾问 / 审计师交付的官方文件转化为可读且品牌一致、撰写利益相关方信息、构建网站 ESG 板块与活动。官方报告我们推荐 SZTFH 注册合作伙伴。",
      },
      {
        q: "我们必须按 CSRD 编制 ESG 报告吗?",
        a: "根据匈牙利转译(2023 年第 CVIII 号法律),自 2024 年起逐步强制:大型企业(250+ 员工、4000 万欧元+ 营业额、2000 万欧元+ 资产负债表 — 至少满足三项中的两项)首先适用,然后是 2026 年起的上市中小企业。小企业目前自愿,但通过 B2B 供应链大型企业会要求。具体义务务必咨询注册顾问或审计师 —— 我们不提供法律资格鉴定。",
      },
      {
        q: "ESG 与 CSR 的区别?",
        a: "CSR(企业社会责任):自愿、基于叙事的企业责任 —— 我们对此进行纯粹传播工作,无监管限制。ESG(环境、社会、治理):带 KPI 与强制审计的法律监管框架 —— 其官方部分属于 SZTFH 注册专家,我们仅承担传播侧。",
      },
      {
        q: "如何避免漂绿?",
        a: "传播中三原则:(1) 仅数据支持的声明(无「自然友好」,只有「95% 再生材料,经 ISO 14021 Type II 认证」);(2) 措辞中的全生命周期思维;(3) 每个具体数字的独立审计引用。欧盟绿色声明指令 2026 年起在法律上强制执行 —— 因此我们按这些原则塑造每份绿色传播材料。",
      },
      {
        q: "你们能提升 ESG 评级吗?",
        a: "在传播侧可以 —— EcoVadis、CDP、MSCI ESG 评级时,以最佳光线呈现实际表现的自评问卷答案措辞。数值数据与实际评估由公司或注册顾问提供。如果基础活动到位,仅文档与传播薄弱,EcoVadis Bronze → Silver 提升通常在 6-12 个月内可达成。",
      },
      {
        q: "ESG 传播费用多少?",
        a: "小企业(自愿 ESG 传播,网站 ESG 板块 + 1 份年度材料):60-150 万福林。大型中小企业(围绕注册审计师报告构建的传播包):150-300 万福林。企业级(持续 IR 与利益相关方沟通):每年 300-700 万福林。注册 ESG 顾问 / 审计师费用(根据规模 100-1500 万福林)在此之外且独立。",
      },
      {
        q: "如何找到 SZTFH 注册的 ESG 顾问或审计师?",
        a: "SZTFH 公开维护 ESG 顾问与 ESG 审计师注册名册 —— 建议在主管部门官网核查。我们不在名单上,但作为合作伙伴与多家注册审计公司长期合作,可根据您的行业与公司规模引介合适的合作方。选择与签约由您与对方进行,我们不收取转介佣金。",
      },
    ],
    cta: "申请免费 ESG 传播咨询",
  },
  "employer-branding": {
    slug: "employer-branding",
    title: "雇主品牌",
    subtitle: "吸引人才的雇主品牌",
    heroDesc:
      "匈牙利 2025-2026 年劳动力市场带来历史性挑战:2.5% 失业率、高离职率、Z 世代与 Y 世代员工的代际差异。强大的雇主品牌不是奢侈品 —— 而是关键的商业优势。",
    metaTitle: "雇主品牌 — 雇主品牌建设 | G2A Marketing",
    metaDesc:
      "EVP 开发、招聘页、招聘营销、Profession.hu 与 Glassdoor 声誉。吸引并留住顶尖人才。",
    icon: "users",
    color: "#8b5cf6",
    intro:
      "匈牙利 HR 市场如今与客户市场一样竞争激烈:不投放广告就找不到候选人。雇主品牌位于 HR 与营销的交界 —— G2A 搭建桥梁,将抽象的「雇主品牌」转化为真实的招聘与留任工具。包括 ESG 合规、代际适应、以及在 Profession.hu / LinkedIn / Glassdoor 三角衡量的表现。",
    benefits: [
      {
        title: "EVP 开发(Employer Value Proposition)",
        desc: "基于真实员工访谈的真实 EVP。不是 PR 口号 —— 而是人们实际获得的。4-6 周内完成。",
      },
      {
        title: "招聘页与申请流程",
        desc: "转化优化的招聘页,带按职位的落地页。Greenhouse / Workable / 定制 ATS 集成。移动优先设计(Z 世代)。",
      },
      {
        title: "招聘营销",
        desc: "按职位投放 LinkedIn、Profession.hu、Facebook、Instagram、TikTok 活动。Sponsored Content 用于 B2B,Reels 用于 Z 世代 — 不同创意。",
      },
      {
        title: "员工故事讲述",
        desc: "「日常生活」视频、幕后 Reels、团队介绍文章。员工本身就是品牌大使 —— 而非营销口号。",
      },
      {
        title: "Glassdoor + Profession.hu 声誉",
        desc: "雇主资料优化、对评价(好坏皆然)的回复策略、从满意员工主动收集评价。",
      },
      {
        title: "内部沟通与入职",
        desc: "从新员工到前 90 天的结构化入职流程。内部简报、成功故事、团队建设沟通。",
      },
    ],
    process: [
      {
        step: "01",
        title: "雇主品牌审计",
        desc: "梳理今日候选人体验:为什么离职、为什么加入、Glassdoor/Profession 评分如何。5-8 位员工访谈、2-3 位前员工访谈。输出:现实地图。",
      },
      {
        step: "02",
        title: "EVP 阐述",
        desc: "从「人们实际得到什么」清单浓缩为 3-4 个最强支柱。与目标受众焦点小组测试。最终 EVP 声明。",
      },
      {
        step: "03",
        title: "沟通与活动",
        desc: "招聘页重新设计、LinkedIn/Profession 内容日历、视频故事流水线、Glassdoor 资料修订。按职位的招聘活动。",
      },
      {
        step: "04",
        title: "测量与迭代",
        desc: "每月招聘周期、单次招聘成本、offer 接受率、员工 NPS。Glassdoor / Profession.hu 评分趋势。季度 EVP 验证。",
      },
    ],
    faq: [
      {
        q: "什么时候应该重视雇主品牌?",
        a: "三个信号:(1) 一个开放职位 3 个月以上找不到合适候选人;(2) 离职率超过行业平均水平(通常每年 15% 以上);(3) Glassdoor/Profession.hu 评分低于 3 星。任一信号出现时,EB 不再是可选项,而是必需。",
      },
      {
        q: "多久能见效?",
        a: "招聘页重设计:4-6 周。首次招聘活动结果:6-8 周。完整 EVP 影响(申请数量 + 质量):4-6 个月。Glassdoor 评分提升:6-12 个月(评论需要时间累积)。",
      },
      {
        q: "如何衡量雇主品牌成功?",
        a: "5 个主要 KPI:招聘周期(下降 15-30%)、单次招聘成本(下降 20-40%)、offer 接受率(从 60% 升至 80%)、员工 NPS(从 6-7 升至 8-9)、Glassdoor 评分(提升 0.5-1 星)。均可在 12-18 个月时间段衡量。",
      },
      {
        q: "如果我们是小公司怎么办?",
        a: "雇主品牌在中小企业层面也有效 —— 实际上那里最亲密、最真实。5-30 人公司无需百万预算:基础招聘页 + Profession.hu 资料 + 创始人/HR 主管名义的 LinkedIn 帖子日历每月 15-25 万福林即可。",
      },
      {
        q: "你们能启动网红 / 员工倡导计划吗?",
        a: "可以。培训员工(5-10 位志愿者「品牌大使」)使用 LinkedIn 帖子配方与内容日历。一个 5 人倡导计划的有机覆盖率通常是公司 LinkedIn 主页的 3-5 倍。",
      },
      {
        q: "每月费用多少?",
        a: "中小企业基础(招聘页 + Profession + 每月 4 篇 LinkedIn):20-40 万福林。中型公司(完整 EB 栈:招聘 + LinkedIn + Profession + Glassdoor 管理 + 故事讲述):50-90 万福林。企业级(倡导计划 + 视频流水线):120-250 万福林。",
      },
    ],
    cta: "申请免费雇主品牌咨询",
  },
  "nemzetkozi-marketing": {
    slug: "nemzetkozi-marketing",
    title: "国际营销",
    subtitle: "本地专业知识支持的全球扩张",
    heroDesc: "高效进入新市场。本地化、多语种 SEO、跨境营销活动与文化适配的传播。",
    metaTitle: "国际营销与市场进入 | G2A Marketing",
    metaDesc:
      "多语种 SEO、跨境营销活动、本地化、市场进入战略。DACH、CEE、BeNeLux、UK 与中国市场 —— 本地视角。",
    icon: "globe",
    color: "#06b6d4",
    intro:
      "匈牙利中小企业 2025-2026 越来越多地转向区域市场（DACH、CEE）—— 本国市场已饱和、福林波动带来风险。我们的创始人 Győrfi Attila 是 IBS Budapest、佩奇大学经济学院与华沙大学客座讲师、国际营销专家，与波兰、捷克与中国市场参与者有直接联系。这不是代理关系，而是运营知识。",
    benefits: [
      {
        title: "市场进入战略",
        desc: "深度市场分析:需求、竞争格局、渠道结构、监管。12 个月的进入市场路线图。",
      },
      {
        title: "本地化(非翻译)",
        desc: "文化适应的内容:不仅是字面翻译,而是转移到本地语境。每种目标语言的母语编辑。",
      },
      {
        title: "多语种 SEO",
        desc: "正确的 ccTLD 或子域名战略下的 hreflang 实施。每种语言的关键词调研(德语用词与匈牙利语不同)。本地链接建设。",
      },
      {
        title: "跨境 PPC",
        desc: "Google Ads + Meta 跨国活动。独立币种处理、按国家计费流程、欧盟范围 GDPR 合规。",
      },
      {
        title: "中国市场专业化",
        desc: "微信、百度、小红书、抖音(中国 TikTok)营销。中匈商业合作伙伴关系咨询。",
      },
      {
        title: "本地合作伙伴与网红",
        desc: "波兰、捷克、德国与中国网红人脉。识别本地批发商与经销商。目标市场 PR。",
      },
    ],
    process: [
      {
        step: "01",
        title: "市场分析与目标国家选择",
        desc: "前 3-5 个目标国家评估:市场规模、需求、竞争强度、TAM(总可寻址市场)估算。每国胜率计算器。",
      },
      {
        step: "02",
        title: "本地化战略",
        desc: "域名战略(.de vs /de、ccTLD vs 子域名)、hreflang 设置、母语内容编辑选择。如有需要的公司注册或本地实体。",
      },
      {
        step: "03",
        title: "内容与网站本地化",
        desc: "多语种网站版本、营销材料(邮件、社媒)本地化、按国家关键词地图。试点国家 2-3 个月。",
      },
      {
        step: "04",
        title: "活动与扩展",
        desc: "本地 Google Ads + Meta 上线。本地 PR 与网红外联。月度复审:哪个国家扩展、哪个降级或失败。",
      },
    ],
    faq: [
      {
        q: "你们支持向哪些市场扩张?",
        a: "主要:DACH(德国、奥地利、瑞士)、CEE(波兰、捷克、斯洛伐克、罗马尼亚)、BeNeLux 和英国。专门:中国(微信 + 百度 + 本地合作伙伴)。全球扩张(美国、印度、中东北非)我们与合作代理机构合作。",
      },
      {
        q: "翻译与本地化有何不同?",
        a: "翻译 = 字面转换(常以机器翻译开始)。本地化 = 完整适应,包括幽默、暗示、视觉元素(模特、颜色)、支付方式、法律文本。一句在匈牙利语中朗朗上口的「best in class」标语,在德语中可能语法错误,在波兰语中文化上格格不入。",
      },
      {
        q: "需要注册新域名吗?",
        a: "两种战略:(1) ccTLD(国家代码域名):除 domain.hu 外还有 domain.de、domain.cz —— 最佳本地 SEO,但昂贵且复杂。(2) 子域名或子目录:de.domain.com 或 domain.com/de —— 更简单,但本地排名较弱。我们通常建议前 2-3 个市场用子域名/子目录,然后再用 ccTLD。",
      },
      {
        q: "流程多长?",
        a: "试点市场(1 个新国家):4-12 周完整本地化流程。扩展到其他市场:试点成功后每个新市场 6-8 周。是否需要公司成立或本地实体:单独咨询,3-6 个月。",
      },
      {
        q: "你们能协助中国市场咨询吗?",
        a: "可以。创始人 Győrfi Attila 是 IBS Budapest、佩奇大学经济学院与华沙大学客座讲师、中国市场专家。可通过微信直接联系我们的中国合作伙伴。微信营销、百度 SEO、天猫/京东上架、小红书网红活动。中国市场进入，我们通常因监管侧也引入匈牙利-中国法律实务者。",
      },
      {
        q: "国际扩张营销费用多少?",
        a: "试点国家上线(DACH/CEE):一次性 150-300 万福林(本地化 + 设置 + 首批活动)。每月管理:每个国家 40-90 万福林。中国市场试点:300-600 万福林(监管侧更复杂)。广告费另计,通常每个国家每月 30-150 万福林,取决于市场规模。",
      },
    ],
    cta: "申请免费国际营销咨询",
  },
};

const SERVICE_CONFIGS_I18N: Record<Language, Record<string, ServiceConfig>> = {
  hu: HU,
  en: EN,
  zh: ZH,
};

/**
 * Returns the service config for the given slug + language. Falls back to HU
 * if the language entry is missing — defensive only; should never trigger
 * since all 8 services have full HU/EN/ZH content.
 */
export function getServiceConfig(slug: string, lang: Language): ServiceConfig | undefined {
  return SERVICE_CONFIGS_I18N[lang]?.[slug] ?? SERVICE_CONFIGS_I18N.hu[slug];
}

export function hasServiceConfig(slug: string): boolean {
  return slug in SERVICE_CONFIGS_I18N.hu;
}

export default SERVICE_CONFIGS_I18N;
