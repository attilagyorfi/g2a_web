/**
 * Karrier (Careers) page — /karrier.
 *
 * G2A is a small (currently 2-person) team without a permanent open
 * positions board. The page is therefore structured around culture,
 * differentiators, and openness to spontaneous applications. The
 * "open positions" section is a config-driven array — empty by
 * default, with a graceful empty-state message and a CTA to apply
 * spontaneously.
 *
 * Backend: reuses the existing contact.submit tRPC endpoint with a
 * "Karrier jelentkezés" subject prefix. No new schema or admin UI
 * needed — applications land in /admin/contacts the same way regular
 * contact submissions do.
 *
 * Add open positions later by editing the OPEN_POSITIONS arrays per
 * language (or migrate to DB if hiring becomes regular).
 */
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { CAREER_AREAS } from "@shared/careerAreas";
import { useState } from "react";
import TurnstileWidget, { useTurnstileGate } from "@/components/TurnstileWidget";
import {
  Briefcase,
  Heart,
  Sparkles,
  TrendingUp,
  Globe,
  Coffee,
  Loader2,
  Send,
  ChevronDown,
} from "lucide-react";
import { Link } from "wouter";
import { breadcrumbSchema } from "@/lib/jsonLd";

type KarrierDoc = {
  seoTitle: string;
  seoDesc: string;
  badge: string;
  title: string;
  lead: string;

  workWithUs: { heading: string; intro: string; perks: { icon: React.ReactNode; title: string; desc: string }[] };

  openPositions: { heading: string; emptyState: string; emptyCta: string; positions: OpenPosition[] };

  process: { heading: string; steps: { step: string; title: string; desc: string }[] };

  applyForm: {
    heading: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    positionLabel: string;
    positionPlaceholder: string;
    cvLabel: string;
    cvPlaceholder: string;
    motivationLabel: string;
    motivationPlaceholder: string;
    cta: string;
    submitting: string;
    successHeading: string;
    successBody: string;
    error: string;
    consentBefore: string;
    consentLink: string;
    consentAfter: string;
  };

  faqs: { heading: string; items: { q: string; a: string }[] };
};

type OpenPosition = {
  title: string;
  type: string; // "Full-time" / "Részmunkaidős" / etc.
  location: string; // "Pécs / remote" stb.
  desc: string;
};

const DOCS: Record<Language, KarrierDoc> = {
  // ────────────────────────────────────────────────────────────────────────
  hu: {
    // Audit B1: ≤ 60 / ≤ 155 char + the docx tightening
    seoTitle: "Karrier — Csatlakozz a G2A csapathoz | G2A Marketing",
    seoDesc:
      "Kis, AI-eszközöket napi szinten használó marketingcsapat Pécsen (hibrid). Konkrét projektek, prémium AI-stack, fizetett munkapróba. Nézd meg a pozíciókat.",
    badge: "Karrier",
    title: "Csatlakozz a G2A csapathoz",
    lead:
      "Egy kis, fókuszált csapat vagyunk, ami AI-eszközöket használ napi szinten — Claude, Manus, Midjourney, Runway, ElevenLabs. Olyan kollégákat keresünk, akiket a stratégiai marketing + tech-fókuszú megközelítés vonz, és Pécsen vagy hibrid módon (PTE-régió + remote) tudnának dolgozni.",
    workWithUs: {
      heading: "Miért érdemes nálunk dolgozni?",
      intro:
        "Hatféle dolgot szállítunk a kollégáknak, amit egy klasszikus ügynökség többnyire nem:",
      perks: [
        {
          icon: <Sparkles size={20} />,
          title: "AI-eszközök premium szinten",
          desc: "Claude Pro, ChatGPT Plus, Midjourney, Runway, ElevenLabs, Manus, Cursor — mindegyik céges előfizetéssel a kezedben. Az AI-tapasztalat, amit nálunk építesz, piacképes minden következő pozíciódhoz.",
        },
        {
          icon: <Heart size={20} />,
          title: "Konkrét, nem fluff projektek",
          desc: "Magyar KKV-k és B2B cégek valódi kihívásain dolgozol — nem fiktív gyakorló-feladatokon. Az első hónapban megnézed, hogy egy ügyfelünk hogy nőtt 3x az általad épített kampány miatt.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Mérhető szakmai fejlődés",
          desc: "Negyedéves szakmai fejlődési terv, ügyfél-projektenkénti retro, dedikált tanulási büdzsé (kurzusok, könyvek, konferenciák). 12 hónap után CV-d konkrét projektszámokat mutat.",
        },
        {
          icon: <Globe size={20} />,
          title: "Nemzetközi kitekintés",
          desc: "Lengyel, cseh és kínai partnereinkkel közvetlen munkakapcsolat. Az alapítónk az IBS Budapest, a PTE Közgazdaságtudományi Kar és a Varsovia Egyetem vendégoktatója — útközben, együtt-iskolázás potenciál.",
        },
        {
          icon: <Coffee size={20} />,
          title: "Hibrid + Pécs központ",
          desc: "Kéthetente egy közös nap a pécsi irodában (7625 Péter utca 1.), a többi remote. Rugalmas: 9-17 vagy 11-19, ahogy neked jó. Nincs micromanagement — output-alapú.",
        },
        {
          icon: <Briefcase size={20} />,
          title: "Hosszú táv, nem projekt-cég",
          desc: "Nem akarunk lufi-növekedést. Akit felveszünk, 2+ éves távra tervezünk. Ennek megfelelően az interjú is komoly: 2-3 kör, valódi munkapróba, bér- és karrierút-átláthatóság.",
        },
      ],
    },
    openPositions: {
      heading: "Nyitott pozíciók",
      emptyState:
        "Jelenleg nincs konkrét, lezárt pozíció hirdetve — de spontán pályázatot mindig fogadunk. Ha az alábbi területek közül bármelyik érdekel, küldd át a CV-d és pár sort arról, miért minket választanál: SEO-tartalomgyártó, PPC-szakember, social media menedzser, AI marketing operator, B2B account manager.",
      emptyCta: "Pályázz spontán",
      positions: [],
    },
    process: {
      heading: "A jelentkezés menete",
      steps: [
        {
          step: "1",
          title: "Pályázat beküldése",
          desc: "Az alábbi űrlapon vagy emailben (info@g2amarketing.hu): CV + 1-2 bekezdéses motivációs szöveg + ha van, portfolió-link. Word/PDF.",
        },
        {
          step: "2",
          title: "Visszajelzés 5 munkanapon belül",
          desc: "Minden pályázatra válaszolunk — akkor is, ha most nem jövünk össze. Ha megfelelőnek látunk, 30 perces ismerkedő hívás következik.",
        },
        {
          step: "3",
          title: "Munkapróba (fizetett)",
          desc: "Egy konkrét feladaton (~4-6 óra) megnézzük hogy dolgozunk együtt. Ezt kifizetjük függetlenül attól, mi lesz a végeredmény — komoly időbefektetést kérünk, komolyan vesszük.",
        },
        {
          step: "4",
          title: "Ajánlat és start",
          desc: "Bér, juttatások, szerepkör, fejlődési útterv egyértelműen leírva az ajánlatban. 2 hét döntési idő.",
        },
      ],
    },
    applyForm: {
      heading: "Pályázom",
      subtitle: "Konkrét pozícióra vagy spontán — küldd át a részleteket.",
      nameLabel: "Teljes név",
      emailLabel: "E-mail cím",
      phoneLabel: "Telefonszám (opcionális)",
      positionLabel: "Melyik pozícióra pályázol?",
      positionPlaceholder: "Pl. PPC-szakember, vagy „spontán pályázat”",
      cvLabel: "CV link (LinkedIn / Google Drive / portfólió URL)",
      cvPlaceholder: "https://...",
      motivationLabel: "Pár sor: miért minket választanál? (kötelező)",
      motivationPlaceholder:
        "Mi vonz a G2A-ban? Mit szeretnél tanulni / mihez tudnál hozzájárulni?",
      cta: "Pályázat elküldése",
      submitting: "Küldés...",
      successHeading: "Köszönjük a pályázatod!",
      successBody:
        "5 munkanapon belül jelentkezünk e-mailben. Addig is: nézz körül a /technologia oldalon a stack-ünkkel, vagy a /referenciak között az ügyfél-projektjeinkkel.",
      error: "Hiba történt a küldés során. Próbáld újra, vagy írj az info@g2amarketing.hu címre.",
      consentBefore:
        "Hozzájárulok, hogy a G2A Marketing Bt. a jelentkezésem adatait a kiválasztási folyamat lebonyolításához kezelje az",
      consentLink: "Adatvédelmi tájékoztató",
      consentAfter: " szerint. Az adatokat a folyamat végét követő 6 hónapig őrizzük meg.",
    },
    faqs: {
      heading: "Gyakori kérdések",
      items: [
        {
          q: "Csak Pécsen dolgozó kollégákat kerestek?",
          a: "Hibrid modellben dolgozunk: kéthetente egy közös nap a pécsi irodában, a többi remote. Pécsi környékről ideális — de Magyarország bármely városából tudunk együttműködni, ha az utazás kéthetente megvalósítható.",
        },
        {
          q: "Junior pozíciókra is felvesztek?",
          a: "Igen — az AI-eszközöket napi szinten használó junior kollégák tipikusan a senior generációnál gyorsabban dolgoznak. Ha még nincs 3 év tapasztalatod, de tudsz Claude-dal vagy ChatGPT-vel komoly tartalom-pipeline-okat építeni, mutasd meg portfólióban.",
        },
        {
          q: "Milyen bér-tartomány?",
          a: "Az interjú elején tisztázzuk a tartományt — pozíciónként eltér. Általánosan: a magyar piaci átlag felett vagyunk, de nem agency-csúcson. Cserébe a tanulási büdzsé, a tool-stack és a hosszú-távú szerepkör kiemelt. Konkrét számokat az ismerkedő hívás alatt.",
        },
        {
          q: "Lehet részmunkaidőben dolgozni?",
          a: "Néhány szerepkörben (pl. tartalomgyártás, design) igen. Mások (pl. account manager) full-time-ot kívánnak. Pályázatban jelezd preferenciádat, és visszajelzünk, hogy mi reális.",
        },
        {
          q: "Van határidő a pályázatra?",
          a: "Nincs — folyamatosan fogadunk pályázatokat. Konkrét nyitott pozíciónál ott jelöljük meg a határidőt, ha van.",
        },
        {
          q: "Mi van, ha nem felelek meg most, de később igen?",
          a: "Ha úgy látjuk, hogy 6-12 hónap múlva érdekes lehet, kifejezetten jelezzük és kérjük az engedélyed, hogy felvehessük veled a kapcsolatot. Az adatkezelési hozzájárulás 6 hónapig szól, ami után újra kell jelentkezned (ha ez számodra is rendben van).",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  en: {
    seoTitle: "Careers — Join the G2A Team | AI-Focused Agency",
    seoDesc:
      "A small, focused marketing team using AI tools daily in Pécs (hybrid). Real projects, measurable growth, a premium AI stack, a paid work trial. See open positions.",
    badge: "Careers",
    title: "Join the G2A team",
    lead:
      "We're a small, focused team using AI tools daily — Claude, Manus, Midjourney, Runway, ElevenLabs. We look for colleagues drawn to strategic marketing + tech-forward thinking who can work in Pécs or hybrid (Pécs region + remote).",
    workWithUs: {
      heading: "Why work with us?",
      intro: "Six things we deliver that a classical agency mostly doesn't:",
      perks: [
        {
          icon: <Sparkles size={20} />,
          title: "AI tools at premium tier",
          desc: "Claude Pro, ChatGPT Plus, Midjourney, Runway, ElevenLabs, Manus, Cursor — all on company subscription in your hands. The AI experience you build here is marketable for every next role.",
        },
        {
          icon: <Heart size={20} />,
          title: "Real projects, not fluff",
          desc: "You work on real challenges of Hungarian SMEs and B2B companies — not fictional practice tasks. In month one you see one of our clients' 3x growth from a campaign you built.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Measurable professional growth",
          desc: "Quarterly development plan, retro after every client project, dedicated learning budget (courses, books, conferences). After 12 months your CV shows concrete project numbers.",
        },
        {
          icon: <Globe size={20} />,
          title: "International exposure",
          desc: "Direct working relationships with Polish, Czech and Chinese partners. Our founder is a guest lecturer at IBS Budapest, the University of Pécs Faculty of Business and Economics, and the University of Warsaw — co-learning potential along the way.",
        },
        {
          icon: <Coffee size={20} />,
          title: "Hybrid + Pécs base",
          desc: "Bi-weekly team day at the Pécs office (7625 Péter utca 1.), the rest remote. Flexible 9-5 or 11-7, your preference. No micromanagement — output-based.",
        },
        {
          icon: <Briefcase size={20} />,
          title: "Long-term, not project shop",
          desc: "We don't aim for balloon growth. People we hire we plan for 2+ years. The interview matches: 2-3 rounds, real work trial, salary and career-path transparency.",
        },
      ],
    },
    openPositions: {
      heading: "Open positions",
      emptyState:
        "No specific finalised position posted right now — but spontaneous applications are always welcome. If any of these areas interest you, send your CV with a few lines on why us: SEO content producer, PPC specialist, social media manager, AI marketing operator, B2B account manager.",
      emptyCta: "Apply spontaneously",
      positions: [],
    },
    process: {
      heading: "How to apply",
      steps: [
        {
          step: "1",
          title: "Submit your application",
          desc: "Use the form below or email (info@g2amarketing.hu): CV + 1-2 paragraph motivation + portfolio link if any. Word/PDF.",
        },
        {
          step: "2",
          title: "Response within 5 business days",
          desc: "We respond to every application — even if it's not a fit now. If we see a match, a 30-minute introductory call follows.",
        },
        {
          step: "3",
          title: "Paid work trial",
          desc: "On a concrete task (~4-6 hours) we see how we work together. We pay regardless of outcome — we're asking for serious time, we take it seriously.",
        },
        {
          step: "4",
          title: "Offer and start",
          desc: "Salary, benefits, role and growth path written clearly in the offer. 2 weeks decision time.",
        },
      ],
    },
    applyForm: {
      heading: "Apply",
      subtitle: "For a specific role or spontaneously — share your details.",
      nameLabel: "Full name",
      emailLabel: "Email",
      phoneLabel: "Phone (optional)",
      positionLabel: "Which position?",
      positionPlaceholder: "e.g. PPC specialist, or \"spontaneous application\"",
      cvLabel: "CV link (LinkedIn / Google Drive / portfolio URL)",
      cvPlaceholder: "https://...",
      motivationLabel: "Few lines: why us? (required)",
      motivationPlaceholder:
        "What draws you to G2A? What would you like to learn / contribute?",
      cta: "Send application",
      submitting: "Sending...",
      successHeading: "Thank you for applying!",
      successBody:
        "We'll respond within 5 business days. Meanwhile: browse /technologia for our stack, or /referenciak for client projects.",
      error: "Something went wrong. Please try again or email info@g2amarketing.hu.",
      consentBefore:
        "I consent to G2A Marketing Bt. processing my application data for the selection process per the",
      consentLink: "Privacy Policy",
      consentAfter: ". Data is retained for 6 months after the process ends.",
    },
    faqs: {
      heading: "FAQ",
      items: [
        {
          q: "Do you only hire Pécs-based colleagues?",
          a: "We work hybrid: bi-weekly team day at the Pécs office, the rest remote. Pécs region is ideal — but anywhere in Hungary works if the bi-weekly travel is feasible.",
        },
        {
          q: "Do you hire juniors?",
          a: "Yes — AI-tool-fluent junior colleagues typically work faster than the senior generation. If you don't have 3 years experience but can build serious content pipelines with Claude or ChatGPT, show it in a portfolio.",
        },
        {
          q: "What's the salary range?",
          a: "We clarify the range early in the interview — varies by role. Generally: above Hungarian market average, but not at agency-peak. In exchange, the learning budget, tool stack and long-term role are foregrounded. Specific numbers in the introductory call.",
        },
        {
          q: "Is part-time possible?",
          a: "In some roles (content production, design) yes. Others (account manager) require full-time. State your preference in the application; we'll respond on what's realistic.",
        },
        {
          q: "Is there an application deadline?",
          a: "No — we accept applications continuously. For specific open positions we mark the deadline if any.",
        },
        {
          q: "What if I'm not a fit now but might be later?",
          a: "If we see fit in 6-12 months, we explicitly mention it and ask permission to keep your contact. Data consent runs 6 months, after which you'd reapply (if that works for you).",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  zh: {
    seoTitle: "招聘 — 加入 G2A 团队 | 以 AI 为核心的营销代理",
    seoDesc:
      "一支在佩奇每天使用 AI 工具的小型专注营销团队（混合办公）。真实项目、可衡量的成长、高端 AI 工具栈、带薪试岗。查看空缺职位。",
    badge: "招聘",
    title: "加入 G2A 团队",
    lead:
      "我们是一支小型聚焦团队,日常使用 AI 工具 — Claude、Manus、Midjourney、Runway、ElevenLabs。我们寻找被战略营销 + 技术导向思维吸引,可在佩奇或混合(佩奇地区 + 远程)工作的同事。",
    workWithUs: {
      heading: "为何与我们合作?",
      intro: "六件传统代理机构通常做不到的事:",
      perks: [
        {
          icon: <Sparkles size={20} />,
          title: "高级 AI 工具",
          desc: "Claude Pro、ChatGPT Plus、Midjourney、Runway、ElevenLabs、Manus、Cursor — 全部公司订阅交付到您手中。在这里积累的 AI 经验对每一个下一份工作都有市场价值。",
        },
        {
          icon: <Heart size={20} />,
          title: "真实项目,而非套路",
          desc: "您处理匈牙利中小企业与 B2B 公司的真实挑战 —— 不是虚构的练习任务。第一个月即可看到我们某客户因您搭建的活动实现 3 倍增长。",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "可衡量的专业成长",
          desc: "季度发展计划、每个客户项目的复盘、专项学习预算(课程、书籍、会议)。12 个月后您的简历会展示具体项目数据。",
        },
        {
          icon: <Globe size={20} />,
          title: "国际视野",
          desc: "与波兰、捷克、中国合作伙伴的直接工作关系。创始人是 IBS Budapest、佩奇大学经济学院与华沙大学客座讲师 —— 路上的共同学习潜力。",
        },
        {
          icon: <Coffee size={20} />,
          title: "混合 + 佩奇基地",
          desc: "每两周一次在佩奇办公室(7625 Péter utca 1.)的团队日,其余远程。灵活 9-5 或 11-7,按您偏好。无微观管理 —— 以产出为基础。",
        },
        {
          icon: <Briefcase size={20} />,
          title: "长期,非项目公司",
          desc: "我们不追求泡沫式增长。我们招聘的人按 2+ 年规划。面试也相符:2-3 轮、真实工作试做、薪资与职业路径透明。",
        },
      ],
    },
    openPositions: {
      heading: "公开职位",
      emptyState:
        "目前未发布具体已确定的职位 —— 但欢迎随时投递自荐申请。如果以下任一领域引起您的兴趣,请发送简历及几句关于为何选择我们的理由:SEO 内容生产、PPC 专家、社交媒体经理、AI 营销运营、B2B 客户经理。",
      emptyCta: "自荐申请",
      positions: [],
    },
    process: {
      heading: "申请流程",
      steps: [
        {
          step: "1",
          title: "提交申请",
          desc: "通过下方表单或邮件(info@g2amarketing.hu):简历 + 1-2 段动机说明 + 如有作品集链接。Word/PDF。",
        },
        {
          step: "2",
          title: "5 个工作日内回复",
          desc: "我们会回应每一份申请 —— 即使现在不合适。如发现匹配,接下来是 30 分钟介绍性通话。",
        },
        {
          step: "3",
          title: "付费工作试做",
          desc: "通过具体任务(约 4-6 小时)看看我们的合作方式。无论结果如何我们都付费 —— 我们要求认真投入,我们也认真对待。",
        },
        {
          step: "4",
          title: "录用与入职",
          desc: "薪资、福利、角色、发展路径在录用书中清晰列出。2 周决定时间。",
        },
      ],
    },
    applyForm: {
      heading: "申请",
      subtitle: "针对特定职位或自荐 — 请分享您的详情。",
      nameLabel: "全名",
      emailLabel: "电子邮箱",
      phoneLabel: "电话(选填)",
      positionLabel: "申请哪个职位?",
      positionPlaceholder: "如:PPC 专家,或「自荐申请」",
      cvLabel: "简历链接(LinkedIn / Google Drive / 作品集 URL)",
      cvPlaceholder: "https://...",
      motivationLabel: "几句话:为何选择我们?(必填)",
      motivationPlaceholder: "什么吸引您加入 G2A?您希望学到 / 贡献什么?",
      cta: "发送申请",
      submitting: "发送中...",
      successHeading: "感谢您的申请!",
      successBody:
        "我们将在 5 个工作日内回复。同时:浏览 /technologia 了解我们的技术栈,或在 /referenciak 查看客户项目。",
      error: "出错了。请重试,或邮件至 info@g2amarketing.hu。",
      consentBefore:
        "我同意 G2A Marketing Bt. 按",
      consentLink: "隐私政策",
      consentAfter: "处理我的申请数据用于选拔流程。数据在流程结束后保留 6 个月。",
    },
    faqs: {
      heading: "常见问题",
      items: [
        {
          q: "你们只招聘佩奇本地员工吗?",
          a: "我们采用混合模式:每两周一次在佩奇办公室的团队日,其余远程。佩奇地区最理想 —— 但若每两周往返可行,匈牙利任何城市都可。",
        },
        {
          q: "你们招初级员工吗?",
          a: "招 —— 日常使用 AI 工具的初级同事通常比资深一代工作更快。即使您没有 3 年经验,但能用 Claude 或 ChatGPT 搭建认真的内容流水线,请通过作品集展示。",
        },
        {
          q: "薪资范围是多少?",
          a: "我们在面试早期澄清范围 —— 因职位而异。总体上:高于匈牙利市场平均水平,但不在代理巅峰。作为交换,学习预算、工具栈与长期角色是重点。具体数字在介绍性通话中。",
        },
        {
          q: "可以兼职吗?",
          a: "某些角色(内容生产、设计)可以;另一些(客户经理)需要全职。请在申请中说明偏好,我们会回复什么是现实可行的。",
        },
        {
          q: "申请截止日期是?",
          a: "没有 —— 我们持续接受申请。具体公开职位若有截止,会在那里标注。",
        },
        {
          q: "如果我现在不合适,但以后可能合适怎么办?",
          a: "如果我们看到 6-12 个月后可能合适,会明确告知并请求许可保留您的联系方式。数据同意期为 6 个月,之后您需重新申请(如果对您也合适)。",
        },
      ],
    },
  },
};

/** Trilingual labels for the structured application fields (areas + CV upload +
 *  position select) that aren't in the legacy DOCS copy. */
const CAREER_FORM_COPY = {
  hu: {
    areasLabel: "Milyen területeken dolgoznál szívesen?",
    areasHint: "Válaszd ki, ami érdekel — több is lehet.",
    positionSelectLabel: "Melyik pozícióra jelentkezel?",
    positionSpontaneous: "Spontán jelentkezés (nincs konkrét pozíció)",
    cvUploadLabel: "Önéletrajz (PDF/DOC, max. 3 MB)",
    cvChoose: "Fájl kiválasztása",
    cvNone: "Nincs fájl kiválasztva",
    tooLarge: "A fájl túl nagy (max. 3 MB).",
    readError: "A fájlt nem sikerült beolvasni.",
  },
  en: {
    areasLabel: "What would you enjoy working on?",
    areasHint: "Pick anything that interests you — more than one is fine.",
    positionSelectLabel: "Which position are you applying for?",
    positionSpontaneous: "Spontaneous application (no specific role)",
    cvUploadLabel: "CV / résumé (PDF/DOC, max 3 MB)",
    cvChoose: "Choose file",
    cvNone: "No file selected",
    tooLarge: "The file is too large (max 3 MB).",
    readError: "Could not read the file.",
  },
  zh: {
    areasLabel: "您希望从事哪些方向的工作？",
    areasHint: "选择您感兴趣的——可多选。",
    positionSelectLabel: "您应聘哪个职位？",
    positionSpontaneous: "主动申请（无特定职位）",
    cvUploadLabel: "简历（PDF/DOC，最大 3 MB）",
    cvChoose: "选择文件",
    cvNone: "未选择文件",
    tooLarge: "文件过大（最大 3 MB）。",
    readError: "无法读取文件。",
  },
} as const;

export default function KarrierPage() {
  const { lang, t } = useLanguage();
  const doc = DOCS[lang];

  // Dedicated careers backend: careers.apply stores metadata + emails the CV to
  // the owner as an attachment; the applicant gets the career confirmation email.
  const positionsQuery = trpc.careers.positions.useQuery(undefined, { staleTime: 60_000 });
  const positions = positionsQuery.data ?? [];

  const cvCopy = CAREER_FORM_COPY[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [positionId, setPositionId] = useState<number | "">("");
  const [areas, setAreas] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<{ filename: string; contentBase64: string; contentType?: string } | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [motivation, setMotivation] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstile = useTurnstileGate(turnstileToken);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const CV_MAX_BYTES = 3 * 1024 * 1024; // 3 MB — stays under the Vercel body limit

  const onCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError(null);
    const file = e.target.files?.[0];
    if (!file) { setCvFile(null); return; }
    if (file.size > CV_MAX_BYTES) {
      setCvError(cvCopy.tooLarge);
      setCvFile(null);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setCvFile({ filename: file.name, contentBase64: base64, contentType: file.type || undefined });
    };
    reader.onerror = () => setCvError(cvCopy.readError);
    reader.readAsDataURL(file);
  };

  const toggleArea = (key: string) =>
    setAreas((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const submit = trpc.careers.submit.useMutation({
    onSuccess: () => {
      setStatus("success");
      setName(""); setEmail(""); setPhone(""); setPositionId(""); setAreas([]);
      setCvFile(null); setMotivation(""); setConsent(false);
    },
    onError: () => setStatus("error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    if (turnstile.waiting) return;
    setStatus("loading");
    submit.mutate({
      name,
      email,
      phone: phone || undefined,
      positionId: positionId === "" ? undefined : Number(positionId),
      areas: areas.length ? areas : undefined,
      message: motivation || undefined,
      cv: cvFile ?? undefined,
      website: honeypot, // server-side HONEYPOT_FIELD === "website"
      lang,
      turnstileToken: turnstileToken || undefined,
    });
  };

  const hasOpenPositions = positions.length > 0;

  return (
    <>
      <SeoHead
        title={doc.seoTitle}
        description={doc.seoDesc}
        pageSchemas={[
          breadcrumbSchema([
            { name: "G2A Marketing", url: "https://g2amarketing.hu" },
            { name: doc.title, url: "https://g2amarketing.hu/karrier" },
          ]),
        ]}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "var(--g2a-bg)", padding: "4rem 0 3rem" }}>
          <div className="g2a-container" style={{ maxWidth: 880 }}>
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
                maxWidth: "62ch",
              }}
            >
              {doc.lead}
            </p>
          </div>
        </section>

        {/* ── WHY WORK WITH US ─────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 1100 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              {doc.workWithUs.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                marginBottom: "2rem",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              {doc.workWithUs.intro}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {doc.workWithUs.perks.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 12,
                    padding: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(20,184,166,0.12)",
                      color: "var(--g2a-brand-teal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.875rem",
                    }}
                  >
                    {p.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--g2a-text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--g2a-text-secondary)",
                      fontSize: "0.85rem",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OPEN POSITIONS ─────────────────────────────────────────── */}
        <section className="g2a-section" style={{ backgroundColor: "var(--g2a-bg)" }}>
          <div className="g2a-container" style={{ maxWidth: 880 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              {doc.openPositions.heading}
            </h2>
            {hasOpenPositions ? (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {doc.openPositions.positions.map((p, i) => (
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
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem 1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "var(--g2a-text-primary)",
                          margin: 0,
                        }}
                      >
                        {p.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "0.75rem",
                          color: "var(--g2a-brand-teal)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 999,
                          background: "rgba(20,184,166,0.12)",
                        }}
                      >
                        {p.type}
                      </span>
                      <span
                        style={{
                          fontFamily: "Geist Mono, monospace",
                          fontSize: "0.75rem",
                          color: "var(--g2a-text-muted)",
                        }}
                      >
                        {p.location}
                      </span>
                    </div>
                    <p
                      style={{
                        color: "var(--g2a-text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "var(--g2a-bg-2)",
                  border: "1px dashed var(--g2a-border)",
                  borderRadius: 12,
                  padding: "1.75rem",
                }}
              >
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    margin: "0 0 1.25rem",
                  }}
                >
                  {doc.openPositions.emptyState}
                </p>
                <a
                  href="#apply"
                  className="g2a-btn-primary"
                  style={{ display: "inline-flex" }}
                >
                  {doc.openPositions.emptyCta}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ── PROCESS ──────────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 880 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              {doc.process.heading}
            </h2>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "1rem",
              }}
            >
              {doc.process.steps.map((s, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1rem",
                    alignItems: "start",
                    background: "var(--g2a-bg-card)",
                    border: "1px solid var(--g2a-border)",
                    borderRadius: 12,
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--g2a-brand-teal)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Geist Mono, monospace",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "var(--g2a-text-primary)",
                        marginBottom: "0.3rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--g2a-text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── APPLY FORM ───────────────────────────────────────────────── */}
        <section
          id="apply"
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 720 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {doc.applyForm.heading}
            </h2>
            <p
              style={{
                color: "var(--g2a-text-secondary)",
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
              }}
            >
              {doc.applyForm.subtitle}
            </p>
            {status === "success" ? (
              <div
                style={{
                  background: "var(--g2a-bg-card)",
                  border: "1px solid var(--g2a-brand-teal)",
                  borderRadius: 16,
                  padding: "2rem",
                }}
              >
                <h3
                  style={{
                    color: "var(--g2a-brand-teal)",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 700,
                    marginTop: 0,
                    marginBottom: "0.75rem",
                  }}
                >
                  {doc.applyForm.successHeading}
                </h3>
                <p
                  style={{
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {doc.applyForm.successBody}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "var(--g2a-bg-card)",
                  border: "1px solid var(--g2a-border)",
                  borderRadius: 16,
                  padding: "1.75rem",
                  position: "relative",
                }}
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />

                <FormField label={doc.applyForm.nameLabel} required>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="g2a-input"
                    style={{ width: "100%" }}
                  />
                </FormField>
                <FormField label={doc.applyForm.emailLabel} required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="g2a-input"
                    style={{ width: "100%" }}
                  />
                </FormField>
                <FormField label={doc.applyForm.phoneLabel}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="g2a-input"
                    style={{ width: "100%" }}
                  />
                </FormField>
                {positions.length > 0 && (
                  <FormField label={cvCopy.positionSelectLabel}>
                    <select
                      value={positionId}
                      onChange={(e) => setPositionId(e.target.value === "" ? "" : Number(e.target.value))}
                      className="g2a-input"
                      style={{ width: "100%" }}
                    >
                      <option value="">{cvCopy.positionSpontaneous}</option>
                      {positions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {(lang === "en" && p.titleEn) || (lang === "zh" && p.titleZh) || p.titleHu}
                        </option>
                      ))}
                    </select>
                  </FormField>
                )}

                <FormField label={cvCopy.areasLabel}>
                  <div style={{ fontSize: "0.78rem", color: "var(--g2a-text-muted)", marginBottom: "0.6rem" }}>{cvCopy.areasHint}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
                    {CAREER_AREAS.map((a) => {
                      const checked = areas.includes(a.key);
                      return (
                        <label key={a.key} style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.6rem 0.75rem", borderRadius: 8, cursor: "pointer",
                          border: `1px solid ${checked ? "var(--g2a-brand-teal)" : "var(--g2a-border)"}`,
                          background: checked ? "rgba(20,184,166,0.08)" : "transparent",
                          fontSize: "0.85rem", color: "var(--g2a-text-secondary)",
                        }}>
                          <input type="checkbox" checked={checked} onChange={() => toggleArea(a.key)}
                            style={{ accentColor: "var(--g2a-brand-teal)", flexShrink: 0 }} />
                          {a.label[lang]}
                        </label>
                      );
                    })}
                  </div>
                </FormField>

                <FormField label={cvCopy.cvUploadLabel}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <label className="g2a-btn-secondary" style={{ cursor: "pointer", margin: 0 }}>
                      {cvCopy.cvChoose}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={onCvChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    <span style={{ fontSize: "0.82rem", color: "var(--g2a-text-muted)" }}>
                      {cvFile ? cvFile.filename : cvCopy.cvNone}
                    </span>
                  </div>
                  {cvError && <div style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "0.4rem" }}>{cvError}</div>}
                </FormField>
                <FormField label={doc.applyForm.motivationLabel} required>
                  <textarea
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder={doc.applyForm.motivationPlaceholder}
                    className="g2a-input"
                    rows={5}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </FormField>

                <label
                  style={{
                    display: "flex",
                    gap: "0.625rem",
                    alignItems: "flex-start",
                    color: "var(--g2a-text-secondary)",
                    fontSize: "0.78rem",
                    lineHeight: 1.55,
                    marginBottom: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    style={{
                      marginTop: "0.18rem",
                      accentColor: "var(--g2a-brand-teal)",
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    {doc.applyForm.consentBefore}{" "}
                    <Link
                      href="/adatvedelmi-iranyelvek"
                      style={{
                        color: "var(--g2a-brand-teal)",
                        textDecoration: "underline",
                      }}
                    >
                      {doc.applyForm.consentLink}
                    </Link>
                    {doc.applyForm.consentAfter}
                  </span>
                </label>

                <TurnstileWidget
                  onToken={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                  onError={turnstile.markFailed}
                />
                {turnstile.failed && (
                  <p role="status" style={{ margin: 0, fontSize: "0.78rem", lineHeight: 1.5, color: "#fbbf24" }}>
                    {t("contact.turnstileUnavailable")}
                  </p>
                )}

                <button
                  type="submit"
                  className="g2a-btn-primary"
                  disabled={status === "loading" || !consent || turnstile.waiting}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {status === "loading" ? (
                    <Loader2
                      size={16}
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                  ) : (
                    <Send size={16} />
                  )}
                  {status === "loading" ? doc.applyForm.submitting : doc.applyForm.cta}
                </button>

                {status === "error" && (
                  <p
                    role="alert"
                    style={{
                      color: "#ef4444",
                      marginTop: "0.875rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {doc.applyForm.error}
                  </p>
                )}
              </form>
            )}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section
          className="g2a-section"
          style={{ backgroundColor: "var(--g2a-bg-2)" }}
        >
          <div className="g2a-container" style={{ maxWidth: 880 }}>
            <h2
              style={{
                fontFamily: "Geist, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--g2a-text-primary)",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              {doc.faqs.heading}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {doc.faqs.items.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={i}
                    style={{
                      background: "var(--g2a-bg-card)",
                      border: `1px solid ${open ? "var(--g2a-brand-teal)" : "var(--g2a-border)"}`,
                      borderRadius: 12,
                      transition: "border-color 0.2s",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "1.1rem 1.4rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "Geist, sans-serif",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "var(--g2a-text-primary)",
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          color: "var(--g2a-brand-teal)",
                          transition: "transform 0.2s",
                          transform: open ? "rotate(180deg)" : "rotate(0)",
                          flexShrink: 0,
                        }}
                      />
                    </button>
                    {open && (
                      <div
                        style={{
                          padding: "0 1.4rem 1.25rem",
                          color: "var(--g2a-text-secondary)",
                          fontSize: "0.9rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: "0.875rem" }}>
      <span
        style={{
          display: "block",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--g2a-text-muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
