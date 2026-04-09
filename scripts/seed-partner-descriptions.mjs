import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection(process.env.DATABASE_URL);

const partnerUpdates = [
  {
    name: "Vidashop",
    description: "A Vidashop egy dinamikusan növekvő hazai e-kereskedelmi platform, amely prémium minőségű termékeket kínál online vásárlóinak. A G2A Marketing komplex digitális marketing stratégiát dolgozott ki számukra: Google Shopping kampányok optimalizálásával 43%-kal növeltük a konverziós rátát, míg a Meta hirdetések célzott retargeting stratégiájával 2,8-szorosára emeltük a ROAS mutatót. A tartalommarketing és SEO együttes alkalmazásával az organikus forgalom 67%-kal nőtt 6 hónap alatt.",
    category: "E-kereskedelem"
  },
  {
    name: "Rehab Designer",
    description: "A Rehab Designer egyedi, ergonómikus bútor- és lakberendezési megoldásokat kínál rehabilitációs és egészségügyi intézmények számára. A G2A Marketing B2B lead generálási stratégiát dolgozott ki: LinkedIn kampányok és iparági tartalommarketing segítségével 156%-kal növeltük a minősített érdeklődők számát. Az egyedi landing oldalak és a többlépéses email automatizáció révén az értékesítési ciklus 35%-kal rövidült.",
    category: "B2B / Egészségügy"
  },
  {
    name: "AR Works",
    description: "Az AR Works Magyarország vezető kiterjesztett valóság (AR) és virtuális valóság (VR) megoldásokat nyújtó technológiai vállalata. A G2A Marketing thought leadership stratégiát épített fel számukra: iparági cikkek, webináriumok és LinkedIn content marketing révén 89%-kal növeltük a brand awareness mutatót a célpiacon. A Google Ads és programmatic hirdetések kombinációjával az inbound lead-ek száma megháromszorozódott.",
    category: "Technológia / AR-VR"
  },
  {
    name: "Webzperx",
    description: "A Webzperx prémium webfejlesztési és digitális transzformációs szolgáltatásokat nyújt KKV-k és nagyvállalatok számára. A G2A Marketing komplex SEO és PPC stratégiát implementált: kulcsszó-kutatás alapú tartalomstratégiával az organikus keresési forgalom 112%-kal nőtt, míg a Google Ads kampányok optimalizálásával a cost-per-lead 38%-kal csökkent. A referral marketing program bevezetésével az ügyfélszerzési költség felére csökkent.",
    category: "Webfejlesztés / IT"
  },
  {
    name: "GRB Skin Clinic",
    description: "A GRB Skin Clinic Budapest egyik legelismertebb bőrgyógyászati és esztétikai klinikája, ahol a legmodernebb lézer- és esztétikai kezelések érhetők el. A G2A Marketing lokális SEO és social media stratégiával 78%-kal növelte az online foglalások számát. Az Instagram és Facebook kampányok vizuális storytelling megközelítésével a követőbázis 234%-kal bővült, a Google My Business optimalizálással pedig az organikus lokális keresési láthatóság megduplázódott.",
    category: "Egészségügy / Szépségipar"
  },
  {
    name: "Tüke Busz Zrt.",
    description: "A Tüke Busz Zrt. Pécs és Baranya megye meghatározó tömegközlekedési vállalata, amely több mint 50 éves tapasztalattal szolgálja az utazóközönséget. A G2A Marketing digitális kommunikációs stratégiát dolgozott ki: a közösségi média jelenlét megújításával és a menetrend-információk digitalizálásával az online ügyfélinterakciók 145%-kal nőttek. A kríziskommunikációs protokoll és az automatizált ügyfélszolgálati rendszer bevezetésével az ügyfélelégedettségi mutató 28%-kal javult.",
    category: "Közlekedés / Önkormányzat"
  },
  {
    name: "Cafe Frei",
    description: "A Cafe Frei Magyarország egyik legismertebb kávézólánca, amely autentikus, világjáró kávékultúrát hoz el vendégeinek több mint 50 helyszínen. A G2A Marketing franchise marketing stratégiát implementált: egységes brand kommunikáció mellett lokalizált kampányokkal minden egyes helyszín egyedi közönségét is elérte. A hűségprogram digitalizálásával és a social media aktivációkkal az ismételt vásárlások aránya 34%-kal nőtt, a franchise érdeklődők száma pedig megkétszereződött.",
    category: "Vendéglátás / Franchise"
  },
  {
    name: "Royal Sports",
    description: "A Royal Sports prémium sportfelszereléseket és fitneszeszközöket forgalmazó hazai kereskedő, amely profi sportolók és hobbisportolók igényeit egyaránt kielégíti. A G2A Marketing omnichannel marketing stratégiát épített fel: az e-commerce SEO optimalizálással az organikus bevétel 89%-kal nőtt, a szezonális PPC kampányok ROAS mutatója elérte a 6,2-t. Az influencer marketing program bevezetésével a brand awareness a célcsoportban 67%-kal javult.",
    category: "Sport / E-kereskedelem"
  },
  {
    name: "ENO Ceramics",
    description: "Az ENO Ceramics egyedi, kézzel készített kerámia termékeket tervez és gyárt, amelyek otthonok és üzleti terek díszítésére egyaránt alkalmasak. A G2A Marketing vizuális storytelling és e-commerce stratégiával segítette a brand nemzetközi terjeszkedését: Pinterest és Instagram kampányokkal a webshop forgalma 178%-kal nőtt, az export értékesítés pedig 45%-kal bővült. A Google Shopping és Meta Dynamic Ads kombinációjával a kosárelhagyási ráta 23%-kal csökkent.",
    category: "Kézműves / E-kereskedelem"
  },
  {
    name: "Dent & Beauty",
    description: "A Dent & Beauty prémium fogászati és esztétikai kezeléseket kínáló magánklinika, amely a legmodernebb technológiával és személyre szabott ellátással várja pácienseit. A G2A Marketing lokális SEO és Google Ads stratégiával 92%-kal növelte az online időpontfoglalások számát. A betegvélemény-kezelési program és a Google My Business optimalizálás eredményeként a klinika átlagos értékelése 4,2-ről 4,8-ra emelkedett, ami közvetlen hatással volt az új páciens szerzésre.",
    category: "Egészségügy / Fogászat"
  },
  {
    name: "Buborékpark",
    description: "A Buborékpark egy innovatív szabadidős és élménypark, amely egyedi buborékos aktivitásokkal és interaktív játékokkal nyújt felejthetetlen élményt gyerekeknek és felnőtteknek egyaránt. A G2A Marketing szezonális marketing stratégiát dolgozott ki: Facebook és Instagram kampányokkal a látogatószám 123%-kal nőtt a nyitást követő évben. A Google Ads helyi célzással és az influencer együttműködésekkel a brand ismertség a célpiacon 89%-kal emelkedett.",
    category: "Szabadidő / Élménypark"
  },
  {
    name: "Donkey Pizza",
    description: "A Donkey Pizza egy trendi, minőségi alapanyagokból készülő pizza étteremhálózat, amely egyedi ízvilágával és barátságos hangulatával hódít a vendégek körében. A G2A Marketing lokális digitális marketing stratégiát implementált: Google My Business optimalizálással és lokális SEO-val az organikus keresési forgalom 156%-kal nőtt. A Wolt és Foodpanda platformokon futó promóciós kampányokkal a delivery rendelések száma megduplázódott, a visszatérő vendégek aránya pedig 41%-kal emelkedett.",
    category: "Vendéglátás / Delivery"
  },
  {
    name: "Alkatrészvadász",
    description: "Az Alkatrészvadász Magyarország egyik legnagyobb online autóalkatrész-kereskedője, amely több mint 500.000 terméket kínál gyors szállítással. A G2A Marketing e-commerce SEO és PPC stratégiával 234%-kal növelte az organikus forgalmat: long-tail kulcsszó stratégiával több mint 12.000 termékoldalt optimalizáltunk. A Google Shopping kampányok és a remarketing stratégia együttes alkalmazásával a bevétel 67%-kal nőtt, a vásárlói visszatérési ráta pedig 38%-kal javult.",
    category: "Autóipar / E-kereskedelem"
  },
  {
    name: "Balatoni Szaki",
    description: "A Balatoni Szaki a Balaton régió megbízható szakipari és épületgépészeti szolgáltatója, amely lakóépületek és nyaralók komplex felújítását és karbantartását végzi. A G2A Marketing lokális SEO és Google Ads stratégiával 145%-kal növelte az online megkeresések számát a szezonális csúcsidőszakban. A Google My Business profil optimalizálásával és az ügyfélvélemény-kezelési programmal a helyi keresési láthatóság megduplázódott, az átlagos értékelés 4,9-re emelkedett.",
    category: "Szakipar / Lokális"
  },
  {
    name: "Időszerződés",
    description: "Az Időszerződés innovatív HR-tech megoldásokat kínál, amelyek segítségével a vállalatok rugalmasan kezelhetik ideiglenes és projektalapon foglalkoztatott munkatársaikat. A G2A Marketing B2B lead generálási és thought leadership stratégiát implementált: LinkedIn content marketing és webinárium sorozattal 189%-kal növeltük a minősített érdeklődők számát. Az email automatizációs rendszer és a CRM integráció révén az értékesítési konverzió 52%-kal javult.",
    category: "HR-tech / B2B SaaS"
  },
  {
    name: "Sensodome",
    description: "A Sensodome prémium szenzoros és relaxációs élményeket kínáló wellness központ, amely innovatív float terápiával és szenzoros deprivációs kezelésekkel segíti a stressz oldását és a mentális regenerációt. A G2A Marketing digitális marketing stratégiával 167%-kal növelte az online foglalások számát: Instagram és Facebook kampányokkal a brand awareness a célcsoportban 89%-kal emelkedett, a Google Ads lokális célzással pedig az új ügyfelek száma megkétszereződött.",
    category: "Wellness / Egészségügy"
  },
  {
    name: "M Mérnöki Iroda Kft.",
    description: "Az M Mérnöki Iroda Kft. komplex mérnöki tervezési és projektmenedzsment szolgáltatásokat nyújt ipari és infrastrukturális beruházásokhoz. A G2A Marketing B2B digitális marketing stratégiát dolgozott ki: iparági tartalommarketing és LinkedIn kampányokkal 78%-kal növeltük a minősített ajánlatkérések számát. A vállalati weboldal SEO optimalizálásával és a Google Ads célzott kampányaival az organikus és fizetett forgalom együttesen 134%-kal bővült.",
    category: "Mérnöki Iroda / B2B"
  },
  {
    name: "Childéric Hungary",
    description: "A Childéric Hungary prémium lovassport felszereléseket és kiegészítőket forgalmaz, kiszolgálva a hazai és közép-európai versenysport piacot. A G2A Marketing niche e-commerce marketing stratégiát implementált: célzott Facebook és Instagram kampányokkal a webshop forgalma 112%-kal nőtt, a Google Shopping optimalizálással pedig a konverziós ráta 45%-kal javult. A szakmai közösségépítés és az influencer marketing révén a brand a régió meghatározó lovassport márkájává vált.",
    category: "Lovassport / E-kereskedelem"
  },
  {
    name: "Honda Ste-Ba",
    description: "A Honda Ste-Ba a Honda márka hivatalos magyarországi márkakereskedése és szervizközpontja, amely személyautók, motorkerékpárok és szabadidős járművek értékesítésével és szervizével foglalkozik. A G2A Marketing autóipari digitális marketing stratégiát dolgozott ki: Google Ads és Meta kampányokkal a tesztvezetési foglalások száma 89%-kal nőtt, a szervizidőpont-foglalások online aránya 67%-kal emelkedett. A lokális SEO és Google My Business optimalizálással a helyi keresési láthatóság megduplázódott.",
    category: "Autóipar / Márkakereskedés"
  },
  {
    name: "Nissan Ste-Ba",
    description: "A Nissan Ste-Ba a Nissan márka hivatalos magyarországi márkakereskedése, amely elektromos és hibrid járművek értékesítésére specializálódott. A G2A Marketing elektromos mobilitás fókuszú digitális marketing stratégiát implementált: az EV-specifikus kampányokkal és tartalommarketinggel a tesztvezetési érdeklődők száma 134%-kal nőtt. A Google Ads és Meta kampányok kombinációjával az online lead generálás 78%-kal javult, a brand pozicionálás a fenntartható közlekedés területén erőteljesen megerősödött.",
    category: "Autóipar / Elektromos Járművek"
  },
  {
    name: "Variatok",
    description: "A Variatok egyedi, személyre szabott ajándéktárgyakat és promóciós termékeket gyárt és forgalmaz vállalatok és magánszemélyek számára. A G2A Marketing B2B és B2C kombinált marketing stratégiát dolgozott ki: a vállalati ajándékozási szezonban futtatott LinkedIn és Google Ads kampányokkal az üzleti megrendelések 156%-kal nőttek. Az e-commerce SEO és a vizuális tartalommarketing révén az organikus webshop forgalom 89%-kal bővült.",
    category: "Ajándéktárgyak / Nyomda"
  },
  {
    name: "Vapor Spirit",
    description: "A Vapor Spirit Magyarország vezető e-cigaretta és vaping termékeket forgalmazó online és offline kereskedője, amely prémium minőségű termékeket kínál a dohányzásról leszokni kívánóknak. A G2A Marketing szigorú szabályozási környezetben is hatékony digitális marketing stratégiát dolgozott ki: SEO-fókuszú tartalommarketinggel az organikus forgalom 178%-kal nőtt, az email marketing automatizációval a visszatérő vásárlók aránya 43%-kal emelkedett.",
    category: "Vaping / E-kereskedelem"
  },
  {
    name: "Royal Portrait",
    description: "A Royal Portrait prémium portré- és eseményfotózási szolgáltatásokat kínál magánszemélyeknek és vállalatok számára, egyedi, festményszerű képfeldolgozási technikájával. A G2A Marketing vizuális storytelling és social media marketing stratégiával 234%-kal növelte az online foglalások számát: Instagram és Pinterest kampányokkal a brand követőbázis megötszöröződött. A Google Ads és a lokális SEO kombinációjával az organikus keresési forgalom 112%-kal nőtt.",
    category: "Fotózás / Kreatív"
  }
];

let updated = 0;
for (const partner of partnerUpdates) {
  const [result] = await db.execute(
    "UPDATE partners SET description = ?, category = ? WHERE name = ?",
    [partner.description, partner.category, partner.name]
  );
  if (result.affectedRows > 0) {
    updated++;
    console.log(`✓ Updated: ${partner.name}`);
  } else {
    console.log(`⚠ Not found: ${partner.name}`);
  }
}

console.log(`\nDone: ${updated}/${partnerUpdates.length} partners updated`);
await db.end();
