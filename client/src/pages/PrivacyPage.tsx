import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

type PrivacyDoc = {
  label: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  /** Each section renders as <h2>{heading}</h2> followed by body. */
  sections: { heading: string; body: React.ReactNode }[];
};

const EMAIL = "info@g2amarketing.hu";
const PHONE = "+36301902575";

const DOCS: Record<Language, PrivacyDoc> = {
  hu: {
    label: "Jogi",
    title: "Adatvédelmi Irányelvek",
    seoTitle: "Adatvédelmi Irányelvek – G2A Marketing",
    seoDesc: "A G2A Marketing adatvédelmi irányelvei és cookie kezelési szabályzata.",
    lastUpdatedLabel: "Utolsó frissítés:",
    lastUpdatedValue: "2024. január 1.",
    sections: [
      {
        heading: "1. Adatkezelő",
        body: (
          <p>
            G2A Marketing<br />
            Székhely: Pécs, Magyarország<br />
            Email: {EMAIL}<br />
            Telefon: {PHONE}
          </p>
        ),
      },
      {
        heading: "2. Kezelt adatok köre",
        body: (
          <>
            <p>Weboldalunk használata során az alábbi személyes adatokat kezeljük:</p>
            <ul>
              <li>Kapcsolatfelvételi adatok: név, email cím, telefonszám, üzenet tartalma</li>
              <li>Hírlevél feliratkozás: email cím, opcionálisan név</li>
              <li>Technikai adatok: IP cím, böngésző típusa, látogatás időpontja (cookie-k révén)</li>
            </ul>
          </>
        ),
      },
      {
        heading: "3. Adatkezelés célja",
        body: (
          <>
            <p>Az adatokat az alábbi célokból kezeljük:</p>
            <ul>
              <li>Kapcsolatfelvételi kérelmek megválaszolása</li>
              <li>Hírlevél küldése (csak feliratkozás esetén)</li>
              <li>Weboldal működésének biztosítása és fejlesztése</li>
              <li>Jogi kötelezettségek teljesítése</li>
            </ul>
          </>
        ),
      },
      {
        heading: "4. Adatkezelés jogalapja",
        body: (
          <p>
            Az adatkezelés jogalapja az Ön hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont),
            illetve a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont).
          </p>
        ),
      },
      {
        heading: "5. Adatmegőrzési idő",
        body: (
          <p>
            A kapcsolatfelvételi üzeneteket 2 évig őrizzük meg. A hírlevél feliratkozókat
            a leiratkozásig kezeljük. A technikai naplókat 30 napig tároljuk.
          </p>
        ),
      },
      {
        heading: "6. Cookie-k (sütik)",
        body: (
          <>
            <p>Weboldalunk az alábbi típusú cookie-kat használja:</p>
            <ul>
              <li><strong>Szükséges cookie-k:</strong> A weboldal alapvető működéséhez szükségesek</li>
              <li><strong>Analitikai cookie-k:</strong> A weboldal forgalmának mérésére (Google Analytics)</li>
              <li><strong>Marketing cookie-k:</strong> Célzott hirdetések megjelenítéséhez</li>
            </ul>
            <p>A cookie-k kezelését a böngészőjében bármikor módosíthatja.</p>
          </>
        ),
      },
      {
        heading: "7. Adatai védelme",
        body: (
          <p>
            Megfelelő technikai és szervezési intézkedésekkel gondoskodunk az adatok biztonságáról.
            Adatait harmadik félnek nem adjuk át, kivéve ha ezt jogszabály kötelezi.
          </p>
        ),
      },
      {
        heading: "8. Az Ön jogai",
        body: (
          <>
            <p>Önnek joga van:</p>
            <ul>
              <li>Hozzáférni a kezelt adataihoz</li>
              <li>Kérni az adatok helyesbítését</li>
              <li>Kérni az adatok törlését</li>
              <li>Tiltakozni az adatkezelés ellen</li>
              <li>Adathordozhatósághoz való jog</li>
            </ul>
          </>
        ),
      },
      {
        heading: "9. Kapcsolat",
        body: (
          <p>
            Adatvédelmi kérdéseivel forduljon hozzánk:<br />
            Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
            Telefon: <a href={`tel:${PHONE}`}>{PHONE}</a>
          </p>
        ),
      },
      {
        heading: "10. Panasztétel",
        body: (
          <p>
            Jogsértés esetén panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH):{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a>
          </p>
        ),
      },
    ],
  },
  en: {
    label: "Legal",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy – G2A Marketing",
    seoDesc: "G2A Marketing's privacy policy and cookie handling rules.",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedValue: "1 January 2024",
    sections: [
      {
        heading: "1. Data Controller",
        body: (
          <p>
            G2A Marketing<br />
            Registered office: Pécs, Hungary<br />
            Email: {EMAIL}<br />
            Phone: {PHONE}
          </p>
        ),
      },
      {
        heading: "2. Scope of Processed Data",
        body: (
          <>
            <p>When you use our website we process the following personal data:</p>
            <ul>
              <li>Contact details: name, email, phone number, message content</li>
              <li>Newsletter signup: email address, optionally name</li>
              <li>Technical data: IP address, browser type, visit timestamp (via cookies)</li>
            </ul>
          </>
        ),
      },
      {
        heading: "3. Purpose of Processing",
        body: (
          <>
            <p>We process data for the following purposes:</p>
            <ul>
              <li>Responding to inquiries</li>
              <li>Sending newsletters (only upon signup)</li>
              <li>Maintaining and improving the website</li>
              <li>Fulfilling legal obligations</li>
            </ul>
          </>
        ),
      },
      {
        heading: "4. Legal Basis for Processing",
        body: (
          <p>
            Processing is based on your consent (GDPR Art. 6(1)(a)) and the performance of a contract (GDPR Art. 6(1)(b)).
          </p>
        ),
      },
      {
        heading: "5. Data Retention Period",
        body: (
          <p>
            We retain contact messages for 2 years. Newsletter subscribers are processed until they unsubscribe.
            Technical logs are stored for 30 days.
          </p>
        ),
      },
      {
        heading: "6. Cookies",
        body: (
          <>
            <p>Our website uses the following types of cookies:</p>
            <ul>
              <li><strong>Necessary cookies:</strong> required for basic website operation</li>
              <li><strong>Analytical cookies:</strong> measure website traffic (Google Analytics)</li>
              <li><strong>Marketing cookies:</strong> enable targeted advertising</li>
            </ul>
            <p>You can manage cookie settings in your browser at any time.</p>
          </>
        ),
      },
      {
        heading: "7. Data Protection",
        body: (
          <p>
            We apply appropriate technical and organisational measures to safeguard your data.
            We do not share your data with third parties, except where required by law.
          </p>
        ),
      },
      {
        heading: "8. Your Rights",
        body: (
          <>
            <p>You have the right to:</p>
            <ul>
              <li>Access your processed data</li>
              <li>Request rectification of your data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing</li>
              <li>Data portability</li>
            </ul>
          </>
        ),
      },
      {
        heading: "9. Contact",
        body: (
          <p>
            For data protection questions, contact us at:<br />
            Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
            Phone: <a href={`tel:${PHONE}`}>{PHONE}</a>
          </p>
        ),
      },
      {
        heading: "10. Filing a Complaint",
        body: (
          <p>
            In case of infringement, you may file a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH):{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a>
          </p>
        ),
      },
    ],
  },
  zh: {
    label: "法律",
    title: "隐私政策",
    seoTitle: "隐私政策 – G2A Marketing",
    seoDesc: "G2A Marketing 的隐私政策与 Cookie 使用规则。",
    lastUpdatedLabel: "最近更新:",
    lastUpdatedValue: "2024 年 1 月 1 日",
    sections: [
      {
        heading: "1. 数据控制方",
        body: (
          <p>
            G2A Marketing<br />
            注册地:匈牙利佩奇<br />
            邮箱:{EMAIL}<br />
            电话:{PHONE}
          </p>
        ),
      },
      {
        heading: "2. 处理的数据范围",
        body: (
          <>
            <p>您使用本网站时,我们处理以下个人数据:</p>
            <ul>
              <li>联系信息:姓名、邮箱、电话、留言内容</li>
              <li>简报订阅:邮箱,可选姓名</li>
              <li>技术数据:IP 地址、浏览器类型、访问时间(通过 Cookie)</li>
            </ul>
          </>
        ),
      },
      {
        heading: "3. 数据处理目的",
        body: (
          <>
            <p>我们出于以下目的处理数据:</p>
            <ul>
              <li>回复您的咨询</li>
              <li>发送简报(仅在订阅后)</li>
              <li>维护和改进网站</li>
              <li>履行法律义务</li>
            </ul>
          </>
        ),
      },
      {
        heading: "4. 数据处理法律依据",
        body: (
          <p>
            数据处理基于您的同意(GDPR 第 6 条第 1 款 a 项)及合同履行(GDPR 第 6 条第 1 款 b 项)。
          </p>
        ),
      },
      {
        heading: "5. 数据保留期限",
        body: (
          <p>
            联系留言保留 2 年。简报订阅者的数据在退订前持续处理。技术日志保留 30 天。
          </p>
        ),
      },
      {
        heading: "6. Cookie",
        body: (
          <>
            <p>本网站使用以下类型的 Cookie:</p>
            <ul>
              <li><strong>必要 Cookie:</strong>确保网站基本运行</li>
              <li><strong>分析 Cookie:</strong>衡量网站流量(Google Analytics)</li>
              <li><strong>营销 Cookie:</strong>展示定向广告</li>
            </ul>
            <p>您可以随时在浏览器中管理 Cookie 设置。</p>
          </>
        ),
      },
      {
        heading: "7. 数据保护",
        body: (
          <p>
            我们采取适当的技术与组织措施保障数据安全。除法律要求外,我们不会向第三方提供您的数据。
          </p>
        ),
      },
      {
        heading: "8. 您的权利",
        body: (
          <>
            <p>您有权:</p>
            <ul>
              <li>访问我们处理的您的数据</li>
              <li>要求更正您的数据</li>
              <li>要求删除您的数据</li>
              <li>反对数据处理</li>
              <li>行使数据可携权</li>
            </ul>
          </>
        ),
      },
      {
        heading: "9. 联系方式",
        body: (
          <p>
            如有数据保护相关问题,请联系我们:<br />
            邮箱:<a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
            电话:<a href={`tel:${PHONE}`}>{PHONE}</a>
          </p>
        ),
      },
      {
        heading: "10. 投诉",
        body: (
          <p>
            如发生侵权,您可以向匈牙利国家数据保护与信息自由管理局(NAIH)投诉:{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a>
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
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--g2a-text-primary)", fontFamily: "Geist Mono, monospace" }}>
              {doc.title}
            </h1>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg-2)" }}>
          <div className="g2a-container" style={{ maxWidth: "800px" }}>
            <div className="g2a-prose">
              <p><strong>{doc.lastUpdatedLabel}</strong> {doc.lastUpdatedValue}</p>
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
