/**
 * Adatvédelmi irányelvek / Privacy Policy / 隐私政策
 *
 * GDPR (EU 2016/679) + 2011. évi CXII. tv. (Info tv.) + ePrivacy + cookie-rules
 * compliant. Lists every data category, every processor, retention period,
 * legal basis (Art. 6 GDPR) and data-subject rights.
 *
 * Update LAST_UPDATED whenever the underlying data flows change (new
 * processor, new cookie, retention change, etc.). Update the company
 * identification block (address, reg number, tax number) only on a real
 * registry change — these are required by Ekertv. 4. § c-d and GDPR
 * Art. 13(1)(a).
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

// ─── Company identification ──────────────────────────────────────────────
const COMPANY_NAME = "G2A Marketing Bt.";
const COMPANY_FULL_ADDRESS = "7625 Pécs, Péter utca 1. fszt. 1.";
const COMPANY_REG_NUMBER = "02-06-075160";
const COMPANY_TAX_NUMBER = "32070325-1-02";
const EMAIL = "info@g2amarketing.hu";
const PHONE = "+36 30 190 2575";

// ─── Last updated ─────────────────────────────────────────────────────────
const LAST_UPDATED_HU = "2026. május 5.";
const LAST_UPDATED_EN = "5 May 2026";
const LAST_UPDATED_ZH = "2026 年 5 月 5 日";

// ─── Data processors actually in use (matches DEPLOY.md) ──────────────────
type Processor = {
  name: string;
  purpose: { hu: string; en: string; zh: string };
  country: string;
  /** Where data resides — for the international-transfer section. */
  location: { hu: string; en: string; zh: string };
  privacy: string;
  /** Transfer mechanism for non-EEA destinations. */
  transferBasis?: { hu: string; en: string; zh: string };
};

const PROCESSORS: Processor[] = [
  {
    name: "Vercel Inc.",
    purpose: {
      hu: "Webszerver hosting (statikus oldal + serverless API)",
      en: "Web hosting (static site + serverless API)",
      zh: "网站托管(静态站点 + 无服务器 API)",
    },
    country: "USA",
    location: {
      hu: "Frankfurt (EU régió: fra1) elsődleges; USA fallback",
      en: "Frankfurt (EU region: fra1) primary; US fallback",
      zh: "法兰克福(欧盟区域:fra1)主用;美国备用",
    },
    privacy: "https://vercel.com/legal/privacy-policy",
    transferBasis: {
      hu: "EU–USA Data Privacy Framework + Általános Szerződési Feltételek (SCC)",
      en: "EU–US Data Privacy Framework + Standard Contractual Clauses (SCC)",
      zh: "欧美数据隐私框架 + 标准合同条款 (SCC)",
    },
  },
  {
    name: "PingCAP, Inc. (TiDB Cloud)",
    purpose: {
      hu: "Adatbázis hosting (kapcsolatfelvételi üzenetek, hírlevél feliratkozók, blog tartalom)",
      en: "Database hosting (contact messages, newsletter subscribers, blog content)",
      zh: "数据库托管(联系信息、简报订阅、博客内容)",
    },
    country: "USA / Németország",
    location: {
      hu: "Frankfurt (EU) — szerződéses választással",
      en: "Frankfurt (EU) — by contractual choice",
      zh: "法兰克福(欧盟)— 合同选择",
    },
    privacy: "https://www.pingcap.com/privacy-policy/",
    transferBasis: {
      hu: "Általános Szerződési Feltételek (SCC) + EU régiós tárolás",
      en: "Standard Contractual Clauses (SCC) + EU region storage",
      zh: "标准合同条款 (SCC) + 欧盟区域存储",
    },
  },
  {
    name: "Cloudinary Ltd.",
    purpose: {
      hu: "Képfeltöltés és CDN (esettanulmányok, blog, profil képek)",
      en: "Image upload and CDN (case studies, blog, profile photos)",
      zh: "图像上传与 CDN(案例研究、博客、头像)",
    },
    country: "Izrael / EU",
    location: {
      hu: "EU régiós feldolgozás (Frankfurt)",
      en: "EU regional processing (Frankfurt)",
      zh: "欧盟区域处理(法兰克福)",
    },
    privacy: "https://cloudinary.com/privacy",
    transferBasis: {
      hu: "Bizottsági megfelelőségi határozat (Izrael) + SCC",
      en: "Adequacy decision (Israel) + SCC",
      zh: "充分性决定(以色列)+ SCC",
    },
  },
  {
    name: "Resend Inc.",
    purpose: {
      hu: "Tranzakciós e-mail küldés (kapcsolat-, audit-űrlap értesítések, hírlevél)",
      en: "Transactional email delivery (contact/audit notifications, newsletter)",
      zh: "事务性电子邮件投递(联系/审计通知、简报)",
    },
    country: "USA",
    location: {
      hu: "USA (Delaware)",
      en: "USA (Delaware)",
      zh: "美国(特拉华州)",
    },
    privacy: "https://resend.com/legal/privacy-policy",
    transferBasis: {
      hu: "EU–USA Data Privacy Framework + SCC",
      en: "EU–US Data Privacy Framework + SCC",
      zh: "欧美数据隐私框架 + SCC",
    },
  },
  {
    name: "DeepL SE",
    purpose: {
      hu: "Gépi fordítás (admin tartalomszerkesztő — HU↔EN/ZH)",
      en: "Machine translation (admin content editor — HU↔EN/ZH)",
      zh: "机器翻译(管理员内容编辑器 — 匈↔英/中)",
    },
    country: "Németország (EU)",
    location: {
      hu: "Köln, Németország",
      en: "Cologne, Germany",
      zh: "德国科隆",
    },
    privacy: "https://www.deepl.com/privacy",
  },
  {
    name: "OpenAI Ireland Ltd.",
    purpose: {
      hu: "AI tartalomgenerálás (csak admin felületen — blog draftok, SEO meta szövegek). Látogatói adatokat NEM dolgozza fel.",
      en: "AI content generation (admin-only — blog drafts, SEO meta). Does NOT process visitor data.",
      zh: "AI 内容生成(仅管理员界面 — 博客草稿、SEO 元描述)。不处理访客数据。",
    },
    country: "Írország (EU) / USA",
    location: {
      hu: "EU adattárolás OpenAI Ireland Ltd. szerződéssel",
      en: "EU data storage under OpenAI Ireland Ltd. contract",
      zh: "通过 OpenAI Ireland Ltd. 合同的欧盟数据存储",
    },
    privacy: "https://openai.com/policies/privacy-policy",
    transferBasis: {
      hu: "EU–USA Data Privacy Framework (USA visszaesés esetén)",
      en: "EU–US Data Privacy Framework (US fallback)",
      zh: "欧美数据隐私框架(美国备用时)",
    },
  },
  {
    name: "Calendly LLC",
    purpose: {
      hu: "Időpontfoglalás (csak ha kattintasz a „Foglalj időpontot” gombra)",
      en: "Appointment scheduling (only when clicking the “Book a slot” button)",
      zh: "预约安排(仅当您点击「预约」按钮时)",
    },
    country: "USA",
    location: {
      hu: "USA (Atlanta)",
      en: "USA (Atlanta)",
      zh: "美国(亚特兰大)",
    },
    privacy: "https://calendly.com/privacy",
    transferBasis: {
      hu: "EU–USA Data Privacy Framework + SCC",
      en: "EU–US Data Privacy Framework + SCC",
      zh: "欧美数据隐私框架 + SCC",
    },
  },
  {
    name: "Manus AI",
    purpose: {
      hu: "OAuth bejelentkezés admin felületen (csak munkatársak)",
      en: "OAuth authentication on the admin panel (staff only)",
      zh: "管理后台 OAuth 登录(仅员工)",
    },
    country: "USA",
    location: {
      hu: "USA",
      en: "USA",
      zh: "美国",
    },
    privacy: "https://manus.im/privacy",
    transferBasis: {
      hu: "EU–USA Data Privacy Framework + SCC",
      en: "EU–US Data Privacy Framework + SCC",
      zh: "欧美数据隐私框架 + SCC",
    },
  },
];

// ─── Cookies actually set by the site ─────────────────────────────────────
type CookieRow = {
  name: string;
  type: "necessary" | "functional" | "third-party";
  purpose: { hu: string; en: string; zh: string };
  duration: { hu: string; en: string; zh: string };
};

const COOKIES: CookieRow[] = [
  {
    name: "g2a_cookie_consent",
    type: "necessary",
    purpose: {
      hu: "Cookie hozzájárulás állapotának tárolása (localStorage, nem cookie technikailag)",
      en: "Stores cookie consent state (localStorage, technically not a cookie)",
      zh: "存储 Cookie 同意状态(localStorage,技术上非 Cookie)",
    },
    duration: {
      hu: "Korlátlan, manuális törlésig",
      en: "Persistent, until manually cleared",
      zh: "持久,直至手动清除",
    },
  },
  {
    name: "g2a-theme",
    type: "functional",
    purpose: {
      hu: "Sötét/világos téma választás megőrzése (localStorage)",
      en: "Remembers dark/light theme choice (localStorage)",
      zh: "记住深色/浅色主题选择(localStorage)",
    },
    duration: {
      hu: "Korlátlan, manuális törlésig",
      en: "Persistent, until manually cleared",
      zh: "持久,直至手动清除",
    },
  },
  {
    name: "g2a_session",
    type: "necessary",
    purpose: {
      hu: "Admin bejelentkezési session token (csak /admin felületen). HttpOnly, Secure, SameSite=None.",
      en: "Admin login session token (admin panel only). HttpOnly, Secure, SameSite=None.",
      zh: "管理员登录会话令牌(仅管理面板)。HttpOnly、Secure、SameSite=None。",
    },
    duration: {
      hu: "7 nap, vagy kijelentkezésig",
      en: "7 days, or until logout",
      zh: "7 天,或直至退出登录",
    },
  },
  {
    name: "_calendly_session, *_calendly_*",
    type: "third-party",
    purpose: {
      hu: "Calendly időpontfoglaló session — csak akkor settelődik, ha megnyitod a foglaló popupot",
      en: "Calendly booking session — only set if you open the booking popup",
      zh: "Calendly 预约会话 — 仅在打开预约弹窗时设置",
    },
    duration: {
      hu: "1 nap (Calendly szabályzata szerint)",
      en: "1 day (per Calendly's policy)",
      zh: "1 天(根据 Calendly 政策)",
    },
  },
];

// ─── Shared table styles (referenced from each language doc) ─────────────
const tableTh: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  borderBottom: "2px solid var(--g2a-border)",
  fontWeight: 600,
  fontSize: "0.85rem",
  fontFamily: "Geist Mono, monospace",
  color: "var(--g2a-text-primary)",
};

const tableTd: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid var(--g2a-border)",
  verticalAlign: "top",
  color: "var(--g2a-text-secondary)",
};

// ─── Page content per language ────────────────────────────────────────────
type PrivacyDoc = {
  label: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  intro: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
};

const DOCS: Record<Language, PrivacyDoc> = {
  // ────────────────────────────────────────────────────────────────────────
  hu: {
    label: "Jogi tájékoztató",
    title: "Adatvédelmi és cookie tájékoztató",
    seoTitle: "Adatvédelmi tájékoztató – G2A Marketing",
    seoDesc:
      "GDPR-, Info tv.- és ePrivacy-megfelelő adatvédelmi és sütihasználati tájékoztató a g2amarketing.hu látogatói részére.",
    lastUpdatedLabel: "Utolsó módosítás:",
    lastUpdatedValue: LAST_UPDATED_HU,
    intro: (
      <p>
        Ez a tájékoztató a természetes személyeknek a személyes adatok kezelése
        tekintetében történő védelméről szóló <strong>(EU) 2016/679 rendelet
        (GDPR)</strong>, az információs önrendelkezési jogról és az
        információszabadságról szóló <strong>2011. évi CXII. törvény (Infotv.)</strong>,
        valamint az elektronikus kereskedelmi szolgáltatásokról szóló
        <strong> 2001. évi CVIII. törvény (Eker. tv.)</strong> alapján készült.
        Célja, hogy átláthatóan bemutassuk, milyen személyes adatait, milyen
        célból, mennyi ideig és milyen jogalapon kezeljük, valamint mely
        szolgáltatókkal osztjuk meg.
      </p>
    ),
    sections: [
      {
        heading: "1. Az adatkezelő",
        body: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              Székhely: {COMPANY_FULL_ADDRESS}
              <br />
              Cégjegyzékszám: {COMPANY_REG_NUMBER}
              <br />
              Adószám: {COMPANY_TAX_NUMBER}
              <br />
              Képviselő: Győrfi Attila ügyvezető
              <br />
              E-mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              Telefon: <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
              <br />
              Webcím: <a href="https://g2amarketing.hu">g2amarketing.hu</a>
            </p>
            <p>
              Adatvédelmi tisztviselő (DPO) kijelölésére nem vagyunk kötelezve a
              GDPR 37. cikk alapján; kérdéseivel közvetlenül a fenti
              elérhetőségeken kereshet meg minket.
            </p>
          </>
        ),
      },
      {
        heading: "2. A tájékoztató hatálya",
        body: (
          <p>
            Jelen tájékoztató a <strong>g2amarketing.hu</strong> domainen elérhető
            weboldal és az azon működő űrlapok (kapcsolatfelvétel, ingyenes SEO
            audit kérelem, hírlevél feliratkozás), valamint az időpontfoglaló
            (Calendly) használatára terjed ki. Az adminisztrációs felület
            (/admin) csak a munkatársaink számára elérhető, oda látogatói
            személyes adat nem kerül.
          </p>
        ),
      },
      {
        heading: "3. Definíciók",
        body: (
          <ul>
            <li>
              <strong>Személyes adat:</strong> bármely információ, amely egy
              azonosított vagy azonosítható természetes személyre vonatkozik.
            </li>
            <li>
              <strong>Adatkezelés:</strong> a személyes adatokon végzett
              bármely művelet (gyűjtés, tárolás, felhasználás, törlés stb.).
            </li>
            <li>
              <strong>Adatkezelő:</strong> a {COMPANY_NAME}, aki meghatározza
              az adatkezelés céljait és eszközeit.
            </li>
            <li>
              <strong>Adatfeldolgozó:</strong> az a szolgáltató, aki az
              adatkezelő nevében dolgozza fel az adatokat (pl. e-mail küldő
              szolgáltató, hosting szolgáltató).
            </li>
            <li>
              <strong>Érintett:</strong> Ön — az a természetes személy, akinek
              adatait kezeljük.
            </li>
          </ul>
        ),
      },
      {
        heading: "4. A kezelt adatok kategóriái, célja, jogalapja, megőrzési ideje",
        body: (
          <>
            <h3>4.1 Kapcsolatfelvételi űrlap (/kapcsolat)</h3>
            <ul>
              <li>
                <strong>Adatkör:</strong> név, e-mail cím, opcionálisan
                telefonszám, az üzenet tartalma, beküldés időpontja, IP cím
                (kéretlen tömeges üzenet elleni védelem céljából, naplóban
                tárolva).
              </li>
              <li>
                <strong>Cél:</strong> kapcsolatfelvétel, ajánlatadás,
                érdeklődésre válaszadás.
              </li>
              <li>
                <strong>Jogalap:</strong> az érintett kérése alapján
                szerződéskötést megelőző lépések megtétele (GDPR 6. cikk
                (1) bek. b) pont); IP cím esetén jogos érdek (GDPR 6. cikk
                (1) bek. f) pont) — az érdekmérlegelés szerint a spam-szűrés
                a szolgáltatás biztosításához szükséges.
              </li>
              <li>
                <strong>Megőrzés:</strong> 2 év, vagy ha üzleti kapcsolat
                jön létre, az ahhoz tartozó számviteli megőrzési idő
                (8 év a 2000. évi C. tv. 169. § alapján).
              </li>
            </ul>

            <h3>4.2 Ingyenes SEO audit kérelem (/ingyenes-audit)</h3>
            <ul>
              <li>
                <strong>Adatkör:</strong> név, e-mail, weboldal URL,
                opcionális kontextus, IP cím.
              </li>
              <li>
                <strong>Cél:</strong> az audit elkészítése és visszaküldése.
              </li>
              <li>
                <strong>Jogalap:</strong> az érintett hozzájárulása (GDPR
                6. cikk (1) bek. a) pont).
              </li>
              <li>
                <strong>Megőrzés:</strong> az audit kézbesítése után 12 hónap
                (utánkövetés céljából), majd törlés.
              </li>
            </ul>

            <h3>4.3 Hírlevél feliratkozás</h3>
            <ul>
              <li>
                <strong>Adatkör:</strong> e-mail cím, opcionálisan
                keresztnév, feliratkozás időpontja, IP cím (DOI igazolásához).
              </li>
              <li>
                <strong>Cél:</strong> elektronikus reklámküldés (GVH
                gyakorlat: Grtv. 6. § (1) szerinti előzetes hozzájárulás).
              </li>
              <li>
                <strong>Jogalap:</strong> az érintett hozzájárulása (GDPR
                6. cikk (1) bek. a) pont és Grtv. 6. § (1) bek.).
              </li>
              <li>
                <strong>Megőrzés:</strong> a leiratkozásig (minden hírlevélben
                egyetlen kattintással lehetővé tesszük), vagy a hozzájárulás
                visszavonásáig.
              </li>
            </ul>

            <h3>4.4 Időpontfoglalás (Calendly widget)</h3>
            <ul>
              <li>
                <strong>Adatkör:</strong> név, e-mail, választott időpont,
                opcionálisan az általad megadott egyéb mezők. Ezeket
                közvetlenül a Calendly LLC tárolja, mi csak a foglalási
                visszaigazolást kapjuk meg.
              </li>
              <li>
                <strong>Cél:</strong> tanácsadói időpont egyeztetése.
              </li>
              <li>
                <strong>Jogalap:</strong> hozzájárulás (GDPR 6. cikk (1) bek.
                a) pont) — a widget csak akkor töltődik be, ha rákattintasz.
              </li>
              <li>
                <strong>Megőrzés:</strong> Calendly oldalán a saját
                szabályzatuk szerint; a foglalási rekord nálunk az időpont
                lebonyolítását követő 12 hónapig.
              </li>
            </ul>

            <h3>4.5 Szervernaplók (technikai adatok)</h3>
            <ul>
              <li>
                <strong>Adatkör:</strong> IP cím, böngésző User-Agent, kérés
                időpontja és HTTP útja, válaszidő, válasz-státuszkód.
              </li>
              <li>
                <strong>Cél:</strong> üzemeltetés, hibaelhárítás,
                visszaélés-felderítés (DDoS, scraping).
              </li>
              <li>
                <strong>Jogalap:</strong> jogos érdek (GDPR 6. cikk (1) bek.
                f) pont) — szolgáltatás-biztonság fenntartása.
              </li>
              <li>
                <strong>Megőrzés:</strong> 30 nap.
              </li>
            </ul>

            <h3>4.6 Cookie-k és helyi tároló</h3>
            <p>Lásd a 8. fejezetet a teljes listáért.</p>
          </>
        ),
      },
      {
        heading: "5. Adattovábbítás — adatfeldolgozók (alvállalkozók)",
        body: (
          <>
            <p>
              Az alábbi szolgáltatókkal működünk együtt a fenti célok
              megvalósítása érdekében. Mindegyikkel írásos
              adatfeldolgozói szerződés (DPA) van érvényben a GDPR 28. cikk
              alapján.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>Szolgáltató</th>
                    <th style={tableTh}>Cél</th>
                    <th style={tableTh}>Adatkezelés helye</th>
                    <th style={tableTh}>Szabályzat</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESSORS.map((p) => (
                    <tr key={p.name}>
                      <td style={tableTd}>{p.name}</td>
                      <td style={tableTd}>{p.purpose.hu}</td>
                      <td style={tableTd}>{p.location.hu}</td>
                      <td style={tableTd}>
                        <a href={p.privacy} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: "6. Harmadik országba történő adattovábbítás",
        body: (
          <>
            <p>
              Néhány szolgáltatónk székhelye az Európai Gazdasági Térségen
              kívül van (USA). Ilyen esetben az adattovábbítás jogalapját
              minden esetben biztosítjuk:
            </p>
            <ul>
              {PROCESSORS.filter((p) => p.transferBasis).map((p) => (
                <li key={p.name}>
                  <strong>{p.name}:</strong> {p.transferBasis!.hu}
                </li>
              ))}
            </ul>
            <p>
              Az SCC-k (Standard Contractual Clauses, Általános Szerződési
              Feltételek) az Európai Bizottság 2021/914 határozata szerinti,
              a megfelelő szintű védelem garantálását szolgáló szerződéses
              kikötések.
            </p>
          </>
        ),
      },
      {
        heading: "7. Az érintettek jogai",
        body: (
          <>
            <p>A GDPR 15–22. cikkei alapján Önt megilletik az alábbi jogok:</p>
            <ul>
              <li>
                <strong>Hozzáférés:</strong> tájékoztatást kérhet a kezelt
                adatairól és másolatot igényelhet.
              </li>
              <li>
                <strong>Helyesbítés:</strong> kérheti pontatlan adatainak
                javítását.
              </li>
              <li>
                <strong>Törlés („elfeledtetéshez való jog”):</strong> kérheti
                adatainak törlését, ha nincs egyéb jogalapunk a kezelésre.
              </li>
              <li>
                <strong>Korlátozás:</strong> bizonyos esetekben kérheti az
                adatkezelés korlátozását.
              </li>
              <li>
                <strong>Adathordozhatóság:</strong> géppel olvasható
                formátumban (JSON) megkaphatja adatait, és átviheti más
                szolgáltatóhoz.
              </li>
              <li>
                <strong>Tiltakozás:</strong> tiltakozhat a jogos érdeken
                alapuló adatkezelés ellen — különösen direkt marketing esetén
                feltétel nélkül.
              </li>
              <li>
                <strong>Hozzájárulás visszavonása:</strong> hozzájárulását
                bármikor díjmentesen, indokolás nélkül visszavonhatja
                (a visszavonás a korábbi adatkezelés jogszerűségét nem
                érinti).
              </li>
              <li>
                <strong>Panaszjog:</strong> panaszt nyújthat be a
                felügyeleti hatóságnál (lásd 11. pont).
              </li>
            </ul>
            <p>
              Kérelmét a fenti e-mail címre küldheti. Indokolatlan késedelem
              nélkül, de legkésőbb <strong>30 napon belül</strong> érdemben
              válaszolunk. A kérelem teljesítése díjmentes.
            </p>
          </>
        ),
      },
      {
        heading: "8. Cookie-k és helyi tároló (localStorage)",
        body: (
          <>
            <p>
              Az alábbi cookie-kat és localStorage kulcsokat használjuk.
              A nem feltétlenül szükséges elemek („Marketing”, „Calendly”)
              csak akkor töltődnek be, ha a sütisávban hozzájárulsz vagy
              ténylegesen használod a kapcsolódó funkciót (pl. rákattintasz
              a Calendly gombra).
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>Név</th>
                    <th style={tableTh}>Típus</th>
                    <th style={tableTh}>Cél</th>
                    <th style={tableTh}>Élettartam</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name}>
                      <td style={{ ...tableTd, fontFamily: "Geist Mono, monospace", fontSize: "0.8rem" }}>
                        {c.name}
                      </td>
                      <td style={tableTd}>
                        {c.type === "necessary"
                          ? "Szükséges"
                          : c.type === "functional"
                            ? "Funkcionális"
                            : "Harmadik fél"}
                      </td>
                      <td style={tableTd}>{c.purpose.hu}</td>
                      <td style={tableTd}>{c.duration.hu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "1rem" }}>
              A böngészője beállításaiban bármikor letilthatod a cookie-kat,
              illetve törölheted a localStorage tartalmát. Ezzel egyes
              funkciók (pl. téma választás megőrzése, admin bejelentkezés)
              nem fognak működni.
            </p>
          </>
        ),
      },
      {
        heading: "9. Adatbiztonság",
        body: (
          <>
            <p>A személyes adatok védelme érdekében:</p>
            <ul>
              <li>HTTPS (TLS 1.3) titkosítás minden kommunikációhoz</li>
              <li>
                Az adatbázisban a kapcsolatfelvételi üzenetek és hírlevél
                lista tárolt formában (TiDB Cloud encryption-at-rest)
              </li>
              <li>
                Admin bejelentkezés OAuth 2.0 alapon, JWT session,
                HttpOnly + Secure cookie-val
              </li>
              <li>
                Spam- és visszaélés-szűrés rate-limiterrel
                (kapcsolatfelvétel max. 5/óra/IP, audit max. 5/óra/IP)
              </li>
              <li>
                Hozzáférés a háttérrendszerhez kizárólag a szükséges
                munkatársak részére (least-privilege elv)
              </li>
              <li>Adatbázis biztonsági mentés napi rendszerességgel</li>
            </ul>
          </>
        ),
      },
      {
        heading: "10. Automatizált döntéshozatal és profilalkotás",
        body: (
          <p>
            <strong>Nem alkalmazunk</strong> kizárólag automatizált
            adatkezelésen alapuló, az érintettre nézve joghatással járó
            vagy hasonlóan jelentős mértékben érintő döntéshozatalt
            (GDPR 22. cikk). A weboldalon nincs profilalkotás
            látogatói viselkedés alapján.
          </p>
        ),
      },
      {
        heading: "11. Felügyeleti hatóság, panasztétel",
        body: (
          <>
            <p>
              Ha úgy érzi, hogy az adatkezeléssel kapcsolatos jogai sérültek,
              elsőként szívesen segítünk a fenti elérhetőségeken. Független
              felügyeleti hatóságnál is panaszt tehet:
            </p>
            <p>
              <strong>
                Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)
              </strong>
              <br />
              Cím: 1055 Budapest, Falk Miksa utca 9–11.
              <br />
              Postacím: 1363 Budapest, Pf.: 9.
              <br />
              Telefon: +36 1 391 1400
              <br />
              E-mail:{" "}
              <a href="mailto:ugyfelszolgalat@naih.hu">
                ugyfelszolgalat@naih.hu
              </a>
              <br />
              Honlap:{" "}
              <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
                www.naih.hu
              </a>
            </p>
            <p>
              Bírósági jogorvoslattal is élhet a Pp. 22. § alapján a
              lakóhelye szerint illetékes törvényszéken.
            </p>
          </>
        ),
      },
      {
        heading: "12. Gyermekek adatai",
        body: (
          <p>
            A weboldalt nem 16 éven aluliaknak szánjuk. Tudatosan nem
            gyűjtünk személyes adatot 16 év alatti személyektől. Ha
            tudomásunkra jut, hogy ilyen adat került hozzánk, haladéktalanul
            töröljük.
          </p>
        ),
      },
      {
        heading: "13. A tájékoztató módosítása",
        body: (
          <p>
            Fenntartjuk a jogot, hogy a jelen tájékoztatót egyoldalúan
            módosítsuk, különösen ha új szolgáltatást vezetünk be, megváltozik
            a feldolgozók köre, vagy jogszabályi változás indokolja. A
            módosítás dátumát az oldal tetején a „Utolsó módosítás” mezőben
            jelezzük. Lényeges változás esetén a hírlevél-feliratkozóinkat
            külön értesítjük.
          </p>
        ),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  en: {
    label: "Legal notice",
    title: "Privacy & cookie policy",
    seoTitle: "Privacy Policy – G2A Marketing",
    seoDesc:
      "GDPR-, Hungarian Info Act- and ePrivacy-compliant privacy and cookie policy for visitors of g2amarketing.hu.",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedValue: LAST_UPDATED_EN,
    intro: (
      <p>
        This policy is issued under the <strong>EU General Data Protection
        Regulation (Regulation (EU) 2016/679 — GDPR)</strong>, the Hungarian
        <strong> Act CXII of 2011 on Informational Self-Determination and
        Freedom of Information</strong>, and the Hungarian <strong>Act CVIII
        of 2001 on Electronic Commerce</strong>. It explains transparently what
        personal data we process about you, for which purposes, on what legal
        basis, for how long, and which sub-processors are involved.
      </p>
    ),
    sections: [
      {
        heading: "1. Data controller",
        body: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              Registered office: {COMPANY_FULL_ADDRESS}
              <br />
              Company registration number: {COMPANY_REG_NUMBER}
              <br />
              Tax number: {COMPANY_TAX_NUMBER}
              <br />
              Represented by: Attila Győrfi, managing director
              <br />
              Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              Phone: <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
              <br />
              Web: <a href="https://g2amarketing.hu">g2amarketing.hu</a>
            </p>
            <p>
              We are not required to appoint a Data Protection Officer (DPO)
              under GDPR Art. 37; please use the contact details above for
              any privacy enquiry.
            </p>
          </>
        ),
      },
      {
        heading: "2. Scope",
        body: (
          <p>
            This policy covers the website at <strong>g2amarketing.hu</strong>,
            its forms (contact, free SEO audit, newsletter signup) and the
            embedded Calendly booking widget. The admin panel (/admin) is
            staff-only — no visitor personal data is collected there.
          </p>
        ),
      },
      {
        heading: "3. Definitions",
        body: (
          <ul>
            <li>
              <strong>Personal data:</strong> any information relating to an
              identified or identifiable natural person.
            </li>
            <li>
              <strong>Processing:</strong> any operation performed on personal
              data (collection, storage, use, erasure, etc.).
            </li>
            <li>
              <strong>Controller:</strong> {COMPANY_NAME}, who determines
              the purposes and means of processing.
            </li>
            <li>
              <strong>Processor:</strong> a service provider that processes
              data on behalf of the controller (e.g. email-sending service,
              hosting provider).
            </li>
            <li>
              <strong>Data subject:</strong> you — the natural person whose
              data we process.
            </li>
          </ul>
        ),
      },
      {
        heading:
          "4. Categories of data, purpose, legal basis, retention",
        body: (
          <>
            <h3>4.1 Contact form (/kapcsolat)</h3>
            <ul>
              <li>
                <strong>Data:</strong> name, email, optional phone, message
                content, submission timestamp, IP address (logged for spam
                protection).
              </li>
              <li>
                <strong>Purpose:</strong> to respond, prepare a quote, or
                handle the enquiry.
              </li>
              <li>
                <strong>Legal basis:</strong> taking pre-contractual steps
                at the data subject's request (GDPR Art. 6(1)(b)); for the
                IP address, legitimate interest (GDPR Art. 6(1)(f)) — the
                balancing test concludes that spam filtering is necessary
                for service delivery.
              </li>
              <li>
                <strong>Retention:</strong> 2 years; if a business
                relationship is established, retention extends to the
                bookkeeping period required by Hungarian law (8 years per
                Act C of 2000, s. 169).
              </li>
            </ul>

            <h3>4.2 Free SEO audit request (/ingyenes-audit)</h3>
            <ul>
              <li>
                <strong>Data:</strong> name, email, website URL, optional
                context, IP address.
              </li>
              <li>
                <strong>Purpose:</strong> to deliver the audit.
              </li>
              <li>
                <strong>Legal basis:</strong> consent (GDPR Art. 6(1)(a)).
              </li>
              <li>
                <strong>Retention:</strong> 12 months after delivery (for
                follow-up), then deletion.
              </li>
            </ul>

            <h3>4.3 Newsletter signup</h3>
            <ul>
              <li>
                <strong>Data:</strong> email, optional first name, signup
                timestamp, IP address (for double-opt-in proof).
              </li>
              <li>
                <strong>Purpose:</strong> sending marketing emails (per
                Hungarian Grtv. s. 6(1) requiring prior consent).
              </li>
              <li>
                <strong>Legal basis:</strong> consent (GDPR Art. 6(1)(a) and
                Grtv. s. 6(1)).
              </li>
              <li>
                <strong>Retention:</strong> until you unsubscribe (one-click
                from every email) or otherwise withdraw consent.
              </li>
            </ul>

            <h3>4.4 Appointment booking (Calendly widget)</h3>
            <ul>
              <li>
                <strong>Data:</strong> name, email, chosen time slot, any
                other fields you fill in. These are stored directly by
                Calendly LLC; we only receive the booking confirmation.
              </li>
              <li>
                <strong>Purpose:</strong> scheduling a consultation.
              </li>
              <li>
                <strong>Legal basis:</strong> consent (GDPR Art. 6(1)(a))
                — the widget loads only when you click on it.
              </li>
              <li>
                <strong>Retention:</strong> Calendly's own retention rules
                apply on their side; on our side the booking record is
                kept for 12 months after the meeting.
              </li>
            </ul>

            <h3>4.5 Server logs (technical data)</h3>
            <ul>
              <li>
                <strong>Data:</strong> IP address, browser User-Agent,
                request timestamp and HTTP path, response time and status
                code.
              </li>
              <li>
                <strong>Purpose:</strong> operations, troubleshooting,
                abuse detection (DDoS, scraping).
              </li>
              <li>
                <strong>Legal basis:</strong> legitimate interest (GDPR
                Art. 6(1)(f)) — service security.
              </li>
              <li>
                <strong>Retention:</strong> 30 days.
              </li>
            </ul>

            <h3>4.6 Cookies and local storage</h3>
            <p>See section 8 for the full list.</p>
          </>
        ),
      },
      {
        heading: "5. Sub-processors",
        body: (
          <>
            <p>
              We work with the providers below to deliver the above
              purposes. Each is bound by a written Data Processing Agreement
              under GDPR Art. 28.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>Provider</th>
                    <th style={tableTh}>Purpose</th>
                    <th style={tableTh}>Processing location</th>
                    <th style={tableTh}>Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESSORS.map((p) => (
                    <tr key={p.name}>
                      <td style={tableTd}>{p.name}</td>
                      <td style={tableTd}>{p.purpose.en}</td>
                      <td style={tableTd}>{p.location.en}</td>
                      <td style={tableTd}>
                        <a href={p.privacy} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: "6. Transfers to third countries",
        body: (
          <>
            <p>
              Some of our providers are based outside the EEA (USA). We
              ensure a lawful basis for every such transfer:
            </p>
            <ul>
              {PROCESSORS.filter((p) => p.transferBasis).map((p) => (
                <li key={p.name}>
                  <strong>{p.name}:</strong> {p.transferBasis!.en}
                </li>
              ))}
            </ul>
            <p>
              SCCs (Standard Contractual Clauses) are EU Commission Decision
              2021/914 contractual safeguards designed to ensure an
              appropriate level of protection.
            </p>
          </>
        ),
      },
      {
        heading: "7. Your rights",
        body: (
          <>
            <p>Under GDPR Articles 15–22 you have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> request information about and a copy
                of the data we hold about you.
              </li>
              <li>
                <strong>Rectification:</strong> ask us to correct inaccurate
                data.
              </li>
              <li>
                <strong>Erasure (“right to be forgotten”):</strong> request
                deletion if no other legal basis applies.
              </li>
              <li>
                <strong>Restriction:</strong> in certain cases, request that
                processing be restricted.
              </li>
              <li>
                <strong>Data portability:</strong> receive your data in a
                machine-readable format (JSON) and transfer it to another
                provider.
              </li>
              <li>
                <strong>Objection:</strong> object to processing based on
                legitimate interest — unconditionally for direct marketing.
              </li>
              <li>
                <strong>Withdraw consent:</strong> at any time, free of
                charge, without justification (does not affect prior lawful
                processing).
              </li>
              <li>
                <strong>Complaint:</strong> lodge a complaint with the
                supervisory authority (see section 11).
              </li>
            </ul>
            <p>
              Send your request to the email above. We respond without undue
              delay, and at the latest <strong>within 30 days</strong>.
              Handling your request is free of charge.
            </p>
          </>
        ),
      },
      {
        heading: "8. Cookies and local storage",
        body: (
          <>
            <p>
              The cookies and localStorage keys we use are listed below.
              Items that are not strictly necessary (“Marketing”, “Calendly”)
              are loaded only after you accept on the consent banner or
              actively use the related feature.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>Name</th>
                    <th style={tableTh}>Type</th>
                    <th style={tableTh}>Purpose</th>
                    <th style={tableTh}>Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name}>
                      <td style={{ ...tableTd, fontFamily: "Geist Mono, monospace", fontSize: "0.8rem" }}>
                        {c.name}
                      </td>
                      <td style={tableTd}>
                        {c.type === "necessary"
                          ? "Necessary"
                          : c.type === "functional"
                            ? "Functional"
                            : "Third-party"}
                      </td>
                      <td style={tableTd}>{c.purpose.en}</td>
                      <td style={tableTd}>{c.duration.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "1rem" }}>
              You may block cookies and clear localStorage in your browser
              settings at any time. Some features (theme persistence, admin
              login) won't work without them.
            </p>
          </>
        ),
      },
      {
        heading: "9. Security measures",
        body: (
          <>
            <p>To protect your personal data we use:</p>
            <ul>
              <li>HTTPS (TLS 1.3) for all communication</li>
              <li>
                Encryption at rest in the database (TiDB Cloud) for contact
                messages and the newsletter list
              </li>
              <li>
                OAuth 2.0 admin authentication with JWT session in
                HttpOnly + Secure cookies
              </li>
              <li>
                Spam and abuse rate-limiting (max 5/hour/IP for contact
                form, max 5/hour/IP for audit form)
              </li>
              <li>
                Backend access restricted to staff who need it
                (least-privilege)
              </li>
              <li>Daily database backups</li>
            </ul>
          </>
        ),
      },
      {
        heading: "10. Automated decision-making and profiling",
        body: (
          <p>
            We do <strong>not</strong> carry out automated decision-making
            with legal or similarly significant effects on data subjects
            (GDPR Art. 22). The website performs no behavioural profiling
            of visitors.
          </p>
        ),
      },
      {
        heading: "11. Supervisory authority, complaints",
        body: (
          <>
            <p>
              If you believe your data protection rights have been infringed,
              we are happy to assist via the contact channels above. You may
              also lodge a complaint with the independent supervisory
              authority:
            </p>
            <p>
              <strong>
                Hungarian National Authority for Data Protection and Freedom
                of Information (NAIH)
              </strong>
              <br />
              Address: H-1055 Budapest, Falk Miksa utca 9–11., Hungary
              <br />
              Postal address: H-1363 Budapest, Pf.: 9.
              <br />
              Phone: +36 1 391 1400
              <br />
              Email:{" "}
              <a href="mailto:ugyfelszolgalat@naih.hu">
                ugyfelszolgalat@naih.hu
              </a>
              <br />
              Website:{" "}
              <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
                www.naih.hu
              </a>
            </p>
            <p>
              You also have the right to a judicial remedy at the court of
              your place of residence under Hungarian Civil Procedure law.
            </p>
          </>
        ),
      },
      {
        heading: "12. Children's data",
        body: (
          <p>
            The website is not directed at children under 16. We do not
            knowingly collect personal data from people under 16. If we
            become aware of such data we delete it without delay.
          </p>
        ),
      },
      {
        heading: "13. Changes to this policy",
        body: (
          <p>
            We may update this policy unilaterally — for example when we
            add a new sub-processor, change retention rules, or to follow
            legal changes. The “Last updated” date at the top of the page
            reflects this. For significant changes we additionally notify
            our newsletter subscribers.
          </p>
        ),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  zh: {
    label: "法律声明",
    title: "隐私与 Cookie 政策",
    seoTitle: "隐私政策 – G2A Marketing",
    seoDesc:
      "g2amarketing.hu 网站访客的隐私与 Cookie 政策,符合 GDPR、匈牙利信息法及 ePrivacy 指令。",
    lastUpdatedLabel: "最近更新:",
    lastUpdatedValue: LAST_UPDATED_ZH,
    intro: (
      <p>
        本政策依据{" "}
        <strong>欧盟一般数据保护条例((欧盟)2016/679 — GDPR)</strong>、匈牙利
        <strong>2011 年第 CXII 号信息自决与信息自由法</strong>以及匈牙利
        <strong>2001 年第 CVIII 号电子商务法</strong>制定。其目的在于以透明的方式说明
        我们处理您哪些个人数据、用于何种目的、依据何种法律基础、保留多久,以及涉及哪些数据处理者。
      </p>
    ),
    sections: [
      {
        heading: "1. 数据控制者",
        body: (
          <>
            <p>
              <strong>{COMPANY_NAME}</strong>
              <br />
              注册地址:{COMPANY_FULL_ADDRESS}
              <br />
              公司登记号:{COMPANY_REG_NUMBER}
              <br />
              税号:{COMPANY_TAX_NUMBER}
              <br />
              代表人:Győrfi Attila 总经理
              <br />
              邮箱:<a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              电话:<a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
              <br />
              网站:<a href="https://g2amarketing.hu">g2amarketing.hu</a>
            </p>
            <p>
              根据 GDPR 第 37 条,我们无须任命数据保护官 (DPO)。任何隐私相关问题请通过上述方式联系我们。
            </p>
          </>
        ),
      },
      {
        heading: "2. 适用范围",
        body: (
          <p>
            本政策适用于域名 <strong>g2amarketing.hu</strong> 下的网站、其表单(联系、免费 SEO
            审计、简报订阅)及嵌入的 Calendly 预约小工具。管理后台 (/admin) 仅供员工使用,不收集访客的个人数据。
          </p>
        ),
      },
      {
        heading: "3. 定义",
        body: (
          <ul>
            <li>
              <strong>个人数据:</strong>与已识别或可识别的自然人有关的任何信息。
            </li>
            <li>
              <strong>处理:</strong>对个人数据进行的任何操作(收集、存储、使用、删除等)。
            </li>
            <li>
              <strong>控制者:</strong>{COMPANY_NAME},决定处理目的与方式。
            </li>
            <li>
              <strong>处理者:</strong>代控制者处理数据的服务提供商(如电子邮件发送服务、托管服务)。
            </li>
            <li>
              <strong>数据主体:</strong>您——其数据由我们处理的自然人。
            </li>
          </ul>
        ),
      },
      {
        heading: "4. 数据类别、目的、法律依据、保留期限",
        body: (
          <>
            <h3>4.1 联系表单 (/kapcsolat)</h3>
            <ul>
              <li>
                <strong>数据范围:</strong>姓名、电子邮箱、可选电话、留言内容、提交时间、IP 地址(用于反垃圾日志)。
              </li>
              <li>
                <strong>目的:</strong>回复您的咨询、出具报价。
              </li>
              <li>
                <strong>法律依据:</strong>应数据主体请求采取的合同前措施(GDPR 第 6(1)(b) 条);IP 地址基于合法利益(GDPR 第 6(1)(f) 条)。
              </li>
              <li>
                <strong>保留期限:</strong>2 年;若建立业务关系,则延长至匈牙利法律要求的会计保留期(根据 2000 年第 C 号法第 169 条为 8 年)。
              </li>
            </ul>

            <h3>4.2 免费 SEO 审计请求 (/ingyenes-audit)</h3>
            <ul>
              <li>
                <strong>数据范围:</strong>姓名、邮箱、网站 URL、可选说明、IP 地址。
              </li>
              <li>
                <strong>目的:</strong>交付审计报告。
              </li>
              <li>
                <strong>法律依据:</strong>同意(GDPR 第 6(1)(a) 条)。
              </li>
              <li>
                <strong>保留期限:</strong>交付后 12 个月(用于跟进),之后删除。
              </li>
            </ul>

            <h3>4.3 简报订阅</h3>
            <ul>
              <li>
                <strong>数据范围:</strong>邮箱、可选名字、订阅时间、IP 地址(用于双重确认证明)。
              </li>
              <li>
                <strong>目的:</strong>发送营销邮件(根据匈牙利广告法第 6(1) 条须事先同意)。
              </li>
              <li>
                <strong>法律依据:</strong>同意(GDPR 第 6(1)(a) 条 与广告法第 6(1) 条)。
              </li>
              <li>
                <strong>保留期限:</strong>直至您退订(每封邮件均含一键退订)或撤回同意为止。
              </li>
            </ul>

            <h3>4.4 预约 (Calendly 小工具)</h3>
            <ul>
              <li>
                <strong>数据范围:</strong>姓名、邮箱、所选时段及您填写的其他字段。这些数据由 Calendly LLC 直接存储,我们只收到预约确认。
              </li>
              <li>
                <strong>目的:</strong>安排咨询会面。
              </li>
              <li>
                <strong>法律依据:</strong>同意(GDPR 第 6(1)(a) 条)— 仅在您点击时小工具才会加载。
              </li>
              <li>
                <strong>保留期限:</strong>Calendly 侧依其自身政策;我方记录在会议后保留 12 个月。
              </li>
            </ul>

            <h3>4.5 服务器日志(技术数据)</h3>
            <ul>
              <li>
                <strong>数据范围:</strong>IP 地址、浏览器 User-Agent、请求时间与 HTTP 路径、响应时间与状态码。
              </li>
              <li>
                <strong>目的:</strong>运营、故障排除、滥用检测(DDoS、爬虫)。
              </li>
              <li>
                <strong>法律依据:</strong>合法利益(GDPR 第 6(1)(f) 条)— 服务安全。
              </li>
              <li>
                <strong>保留期限:</strong>30 天。
              </li>
            </ul>

            <h3>4.6 Cookie 与本地存储</h3>
            <p>详见第 8 节。</p>
          </>
        ),
      },
      {
        heading: "5. 数据处理者(转交方)",
        body: (
          <>
            <p>
              我们与下列服务商合作以实现上述目的。每一方均依 GDPR 第 28 条签署书面数据处理协议 (DPA)。
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>提供商</th>
                    <th style={tableTh}>目的</th>
                    <th style={tableTh}>处理地点</th>
                    <th style={tableTh}>政策</th>
                  </tr>
                </thead>
                <tbody>
                  {PROCESSORS.map((p) => (
                    <tr key={p.name}>
                      <td style={tableTd}>{p.name}</td>
                      <td style={tableTd}>{p.purpose.zh}</td>
                      <td style={tableTd}>{p.location.zh}</td>
                      <td style={tableTd}>
                        <a href={p.privacy} target="_blank" rel="noopener noreferrer">
                          链接
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: "6. 跨境数据传输",
        body: (
          <>
            <p>
              我们的部分服务商位于欧洲经济区之外(美国)。对每一项跨境传输,我们均确保有合法依据:
            </p>
            <ul>
              {PROCESSORS.filter((p) => p.transferBasis).map((p) => (
                <li key={p.name}>
                  <strong>{p.name}:</strong> {p.transferBasis!.zh}
                </li>
              ))}
            </ul>
            <p>
              SCC(标准合同条款)为欧盟委员会 2021/914 号决定通过的合同保障措施,旨在确保适当的保护水平。
            </p>
          </>
        ),
      },
      {
        heading: "7. 您的权利",
        body: (
          <>
            <p>根据 GDPR 第 15–22 条,您享有以下权利:</p>
            <ul>
              <li>
                <strong>访问权:</strong>请求我们提供有关您数据的信息及副本。
              </li>
              <li>
                <strong>更正权:</strong>请求更正不准确的数据。
              </li>
              <li>
                <strong>删除权(被遗忘权):</strong>在无其他法律依据时请求删除数据。
              </li>
              <li>
                <strong>限制权:</strong>在特定情形下请求限制处理。
              </li>
              <li>
                <strong>可携权:</strong>以机器可读格式 (JSON) 接收您的数据并转交其他服务商。
              </li>
              <li>
                <strong>反对权:</strong>反对基于合法利益的处理 — 直接营销情形下无条件适用。
              </li>
              <li>
                <strong>撤回同意权:</strong>随时免费、无需说明理由撤回同意(不影响在此之前合法的处理)。
              </li>
              <li>
                <strong>申诉权:</strong>向监管机构提起申诉(见第 11 节)。
              </li>
            </ul>
            <p>
              请将请求发送至上述邮箱。我们将尽快回复,最迟<strong>30 天内</strong>给出实质答复。处理请求免费。
            </p>
          </>
        ),
      },
      {
        heading: "8. Cookie 与本地存储",
        body: (
          <>
            <p>
              下列为我们使用的 Cookie 与 localStorage 键。非严格必要的项(「营销」、「Calendly」)仅在您于同意条上接受,或主动使用相关功能时才会加载。
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={tableTh}>名称</th>
                    <th style={tableTh}>类型</th>
                    <th style={tableTh}>目的</th>
                    <th style={tableTh}>有效期</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name}>
                      <td style={{ ...tableTd, fontFamily: "Geist Mono, monospace", fontSize: "0.8rem" }}>
                        {c.name}
                      </td>
                      <td style={tableTd}>
                        {c.type === "necessary"
                          ? "必要"
                          : c.type === "functional"
                            ? "功能"
                            : "第三方"}
                      </td>
                      <td style={tableTd}>{c.purpose.zh}</td>
                      <td style={tableTd}>{c.duration.zh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "1rem" }}>
              您可随时在浏览器设置中阻止 Cookie 或清除 localStorage。某些功能(如主题偏好、管理员登录)将无法工作。
            </p>
          </>
        ),
      },
      {
        heading: "9. 数据安全",
        body: (
          <>
            <p>为保护您的个人数据,我们采取以下措施:</p>
            <ul>
              <li>所有通信均采用 HTTPS(TLS 1.3)加密</li>
              <li>数据库 (TiDB Cloud) 中的联系留言与简报列表采用静态加密</li>
              <li>
                管理员认证基于 OAuth 2.0,使用 HttpOnly + Secure Cookie 保存 JWT 会话
              </li>
              <li>
                反垃圾与滥用速率限制(联系表单每 IP 每小时最多 5 次,审计表单每 IP 每小时最多 5 次)
              </li>
              <li>后台访问仅限必要员工(最小权限)</li>
              <li>每日数据库备份</li>
            </ul>
          </>
        ),
      },
      {
        heading: "10. 自动化决策与画像",
        body: (
          <p>
            我们<strong>不</strong>实施仅基于自动化处理且对数据主体产生法律或类似重大影响的决策(GDPR 第 22 条)。本网站不对访客行为进行画像。
          </p>
        ),
      },
      {
        heading: "11. 监管机构与申诉",
        body: (
          <>
            <p>
              若您认为数据保护权利受到侵害,欢迎首先通过上述方式联系我们。您也可向独立监管机构申诉:
            </p>
            <p>
              <strong>
                匈牙利国家数据保护与信息自由管理局 (NAIH)
              </strong>
              <br />
              地址:H-1055 Budapest, Falk Miksa utca 9–11., 匈牙利
              <br />
              邮政地址:H-1363 Budapest, Pf.: 9.
              <br />
              电话:+36 1 391 1400
              <br />
              邮箱:<a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>
              <br />
              网站:
              <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
                www.naih.hu
              </a>
            </p>
            <p>
              依据匈牙利民事诉讼法,您还有权向居住地法院寻求司法救济。
            </p>
          </>
        ),
      },
      {
        heading: "12. 未成年人数据",
        body: (
          <p>
            本网站不面向 16 岁以下未成年人。我们不会有意收集 16 岁以下人员的个人数据。如发现此类数据,我们将立即删除。
          </p>
        ),
      },
      {
        heading: "13. 政策变更",
        body: (
          <p>
            我们保留单方面修改本政策的权利,例如新增数据处理者、调整保留期或因法律变化所需。修改日期会反映在页面顶部的「最近更新」字段。重大变更将另行通知简报订阅用户。
          </p>
        ),
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const doc = DOCS[lang];

  return (
    <>
      <SeoHead
        title={doc.seoTitle}
        description={doc.seoDesc}
        noIndex={false}
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
