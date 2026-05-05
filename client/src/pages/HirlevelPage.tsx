/**
 * Dedicated newsletter signup landing page (/hirlevel).
 *
 * Long-form pitch: hero with headline + benefits, full signup card on the
 * right (or below on mobile), a sample-content / what-to-expect block, and
 * an FAQ-ish section about cadence + privacy. The Footer that wraps this
 * page is told to hide its own newsletter band so we don't show two forms.
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import NewsletterForm from "@/components/NewsletterForm";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { Sparkles, Zap, Shield, Clock } from "lucide-react";

type HirlevelDoc = {
  seoTitle: string;
  seoDesc: string;
  badge: string;
  title: string;
  lead: string;
  formTitle: string;
  formSubtitle: string;
  expect: { heading: string; intro: string; items: string[] };
  rules: { heading: string; items: { icon: React.ReactNode; title: string; desc: string }[] };
  whyTrust: { heading: string; body: string };
};

const DOCS: Record<Language, HirlevelDoc> = {
  hu: {
    seoTitle: "Hírlevél – G2A Marketing | Heti B2B marketing tippek",
    seoDesc:
      "Iratkozz fel a G2A Marketing heti hírlevelére: B2B marketing trendek, AI-eszközök, gyakorlati taktikák. Spam-mentes, egy kattintással leiratkozhatsz.",
    badge: "Hírlevél",
    title: "Heti egy email — semmi más",
    lead:
      "Pénteken reggel egy email a postafiókodban: 1 stratégiai gondolat, 1 konkrét taktika és 1 AI- vagy marketing-eszköz, amit aznap el tudsz kezdeni használni. Spam-mentes, és egyetlen kattintással leiratkozhatsz.",
    formTitle: "Iratkozz fel",
    formSubtitle:
      "Több mint 600 marketinges és KKV-tulajdonos olvas — csatlakozz hozzájuk.",
    expect: {
      heading: "Mire számíthatsz",
      intro: "Pénteki adagok, mindig konkrét és azonnal használható tartalom:",
      items: [
        "B2B marketing trendek értelmezése — nem csak a hír, hanem a Te munkádra való hatás",
        "AI-eszközök és prompt-receptek, amiket valóban használunk az ügyfeleinknél",
        "Esettanulmányok: kampánystruktúra, eredmény, tanulság — anonimizált forma, valós számokkal",
        "Heti 1 darab gyors taktika, amit 30 perc alatt be tudsz vetni",
        "Új cikkeink előzetese mielőtt felkerül a blogra",
      ],
    },
    rules: {
      heading: "Játékszabályok",
      items: [
        {
          icon: <Clock size={18} />,
          title: "Heti 1 — sose több",
          desc:
            "Sosem küldünk napi spamet. Pénteken reggel egy email, kész. Ha nincs érdemi mondanivalónk, kihagyjuk a hetet.",
        },
        {
          icon: <Sparkles size={18} />,
          title: "Konkrét, nem generikus",
          desc:
            "Nem ChatGPT-vel írt töltelékszöveg. Minden anyag az ügyfélprojektjeink valós tapasztalatából származik.",
        },
        {
          icon: <Zap size={18} />,
          title: "Egy kattintás a leiratkozás",
          desc:
            "Minden hírlevél alján található egy linkre kattintva azonnal leiratkozhatsz. Nem kell jelszót megadni, nincs labirintus.",
        },
        {
          icon: <Shield size={18} />,
          title: "Adataidat sose adjuk át",
          desc:
            "Az e-mail címedet kizárólag a hírlevélhez használjuk. Nem osztjuk meg, nem adjuk el harmadik félnek. Részletek az adatvédelmi tájékoztatóban.",
        },
      ],
    },
    whyTrust: {
      heading: "Miért hallgass ránk?",
      body:
        "A G2A Marketing 2022 óta foglalkozik B2B és KKV-marketinggel — Pécsen működünk, de magyar és nemzetközi ügyfeleink is vannak. Mielőtt egy ötletet a hírlevélbe írnánk, vagy egy ügyfélnél már működik, vagy minimum házon belül teszteltük. Ezért rövid: nincs filler, csak arany.",
    },
  },
  en: {
    seoTitle: "Newsletter – G2A Marketing | Weekly B2B marketing insights",
    seoDesc:
      "Subscribe to the G2A Marketing weekly newsletter: B2B marketing trends, AI tooling, practical tactics. Spam-free, one-click unsubscribe.",
    badge: "Newsletter",
    title: "One email a week — nothing else",
    lead:
      "Friday morning, one email in your inbox: 1 strategic thought, 1 concrete tactic and 1 AI or marketing tool you can start using the same day. Spam-free, with a one-click unsubscribe.",
    formTitle: "Subscribe",
    formSubtitle:
      "Over 600 marketers and SMB owners read along — join them.",
    expect: {
      heading: "What to expect",
      intro: "Friday doses, always concrete and immediately usable:",
      items: [
        "B2B marketing trends framed for what they mean for your work — not the news itself",
        "AI tooling and prompt recipes we actually run on client projects",
        "Case studies: campaign structure, outcome, lesson — anonymised, real numbers",
        "One quick tactic per week you can deploy in 30 minutes",
        "Sneak peeks of upcoming blog posts before they go live",
      ],
    },
    rules: {
      heading: "Ground rules",
      items: [
        {
          icon: <Clock size={18} />,
          title: "Weekly — never more",
          desc:
            "Never daily spam. One email Friday morning, that's it. If we have nothing substantial to say, we skip the week.",
        },
        {
          icon: <Sparkles size={18} />,
          title: "Concrete, not generic",
          desc:
            "Not ChatGPT-generated filler. Every piece comes from our real client engagements.",
        },
        {
          icon: <Zap size={18} />,
          title: "One-click unsubscribe",
          desc:
            "Every email has a single link at the bottom that unsubscribes you instantly. No login, no maze.",
        },
        {
          icon: <Shield size={18} />,
          title: "We never share your data",
          desc:
            "We use your email solely for the newsletter. Not shared, not sold to third parties. Details in our privacy policy.",
        },
      ],
    },
    whyTrust: {
      heading: "Why listen to us?",
      body:
        "G2A Marketing has been doing B2B and SMB marketing since 2022 — based in Pécs, Hungary, but with both Hungarian and international clients. We don't write a newsletter idea unless it's already working at a client account or at least tested in-house. That's why it's short: no filler, just gold.",
    },
  },
  zh: {
    seoTitle: "通讯订阅 – G2A Marketing | 每周 B2B 营销洞察",
    seoDesc:
      "订阅 G2A Marketing 每周通讯:B2B 营销趋势、AI 工具与可操作战术。无垃圾邮件,一键退订。",
    badge: "通讯",
    title: "每周一封 — 仅此而已",
    lead:
      "周五早晨,一封邮件抵达邮箱:1 个战略思考、1 个可操作战术、1 款当天即可上手的 AI 或营销工具。无垃圾邮件,一键退订。",
    formTitle: "立即订阅",
    formSubtitle: "超过 600 位营销人与中小企业主在读 — 一起加入。",
    expect: {
      heading: "您将获得",
      intro: "周五的固定份额,始终具体并可立即使用:",
      items: [
        "B2B 营销趋势 — 不只看新闻,更看对您工作的实际影响",
        "我们在客户项目中真实使用的 AI 工具与提示词配方",
        "案例研究:活动结构、成果、教训 — 匿名化但带真实数据",
        "每周 1 个可在 30 分钟内落地的战术",
        "新博客文章上线前的预览",
      ],
    },
    rules: {
      heading: "我们的规则",
      items: [
        {
          icon: <Clock size={18} />,
          title: "每周一封 — 绝不更多",
          desc:
            "绝不每日骚扰。周五早晨一封,完毕。无实质内容时直接跳过当周。",
        },
        {
          icon: <Sparkles size={18} />,
          title: "具体而非泛泛",
          desc: "非 ChatGPT 套话。每一篇都源自真实客户经历。",
        },
        {
          icon: <Zap size={18} />,
          title: "一键退订",
          desc: "每封邮件底部有专门链接,点击即刻退订。无需登录、无迷宫流程。",
        },
        {
          icon: <Shield size={18} />,
          title: "我们绝不共享您的数据",
          desc:
            "您的邮箱仅用于本通讯。不共享、不出售。详见隐私政策。",
        },
      ],
    },
    whyTrust: {
      heading: "为什么值得一读?",
      body:
        "G2A Marketing 自 2022 年起为 B2B 与中小企业提供营销服务 — 总部位于匈牙利佩奇,服务匈牙利及国际客户。我们只在某创意已在客户账户落地或至少内部测试过后,才会写入通讯。所以内容简短:无水分,只剩干货。",
    },
  },
};

export default function HirlevelPage() {
  const { lang } = useLanguage();
  const doc = DOCS[lang];

  return (
    <>
      <SeoHead title={doc.seoTitle} description={doc.seoDesc} />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: "var(--g2a-bg)",
            padding: "4rem 0 3rem",
          }}
        >
          <div className="g2a-container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
                gap: "3rem",
                alignItems: "start",
              }}
              className="g2a-hirlevel-grid"
            >
              <div>
                <div className="g2a-section-label">{doc.badge}</div>
                <h1
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                    color: "var(--g2a-text-primary)",
                    fontFamily: "Geist, sans-serif",
                    lineHeight: 1.15,
                    marginBottom: "1.25rem",
                  }}
                >
                  {doc.title}
                </h1>
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "1.05rem",
                    lineHeight: 1.65,
                    maxWidth: "55ch",
                  }}
                >
                  {doc.lead}
                </p>
              </div>

              {/* Signup card */}
              <div>
                <h2
                  style={{
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--g2a-brand-teal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {doc.formTitle}
                </h2>
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.9rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {doc.formSubtitle}
                </p>
                <NewsletterForm
                  variant="full"
                  surface="card"
                  showBenefits={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPECT ───────────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 760 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {doc.expect.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              {doc.expect.intro}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "grid",
                gap: "0.75rem",
              }}
            >
              {doc.expect.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.55,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "var(--g2a-brand-teal)",
                      flexShrink: 0,
                      marginTop: "0.55rem",
                    }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── RULES ────────────────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container">
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                textAlign: "center",
                marginBottom: "2.5rem",
              }}
            >
              {doc.rules.heading}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
                maxWidth: 980,
                margin: "0 auto",
              }}
            >
              {doc.rules.items.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 12,
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(20,184,166,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--g2a-brand-teal)",
                      marginBottom: "1rem",
                    }}
                  >
                    {r.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "var(--g2a-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--g2a-text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY TRUST ────────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{
            backgroundColor: "var(--g2a-bg-2)",
            borderTop: "1px solid var(--g2a-border)",
          }}
        >
          <div className="g2a-container" style={{ maxWidth: 720, textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {doc.whyTrust.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              {doc.whyTrust.body}
            </p>
          </div>
        </section>
      </main>
      {/* Hide the auto footer newsletter band — this whole page IS the form. */}
      <Footer hideNewsletter />
      <style>{`
        @media (max-width: 860px) {
          .g2a-hirlevel-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
