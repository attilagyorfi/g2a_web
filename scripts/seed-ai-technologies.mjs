/**
 * Seed / upsert AI + creative tools into the `technologies` table.
 *
 * Idempotent: looks up each tool by exact name match. If found, only updates
 * `description*` / `website` / `category` so re-running is safe; never
 * overwrites the admin-managed `sortOrder` or `logo` once those have been
 * curated. New tools insert with default sortOrder = 0.
 *
 * Run with the project's TiDB connection string:
 *   node --env-file=.env scripts/seed-ai-technologies.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set — run with `node --env-file=.env scripts/seed-ai-technologies.mjs`");
  process.exit(1);
}

// ─── Tool catalogue ──────────────────────────────────────────────────────
// Categories: ai | marketing | analytics | other
//
// Phrasing rule: each Hungarian description names the tool, the family it
// belongs to, and ONE concrete way the G2A team uses it on client work.
// Keep under 200 chars so the cards stay readable on mobile.

const TOOLS = [
  // ── LLM / Asszisztens / Kódolás ─────────────────────────────────────────
  {
    name: "Claude",
    category: "ai",
    website: "https://claude.com",
    description:
      "Anthropic LLM-je hosszú kontextusra optimalizálva (1M token). Belső eszközünk dokumentumelemzéshez, AI ügynökök futtatásához és ügyfélanyagok minőségi review-jához.",
    descriptionEn:
      "Anthropic's long-context LLM (1M tokens). We use it internally for document analysis, AI agent runs, and quality review of client deliverables.",
    descriptionZh:
      "Anthropic 的长上下文 LLM(100 万 token)。用于文档分析、AI 代理运行与客户交付物的质量复核。",
  },
  {
    name: "Manus",
    category: "ai",
    website: "https://manus.im",
    description:
      "AI agent platform önvezérlésre képes folyamatok futtatásához (kutatás, tartalomgyártás, kódgenerálás). A G2A admin OAuth-os bejelentkezés is rajta megy.",
    descriptionEn:
      "Autonomous AI agent platform for research, content production and code generation. Powers our admin OAuth login as well.",
    descriptionZh:
      "用于研究、内容生产和代码生成的自主 AI 代理平台。也为我们的管理员 OAuth 登录提供支持。",
  },
  {
    name: "GitHub Copilot",
    category: "ai",
    website: "https://github.com/features/copilot",
    description:
      "GitHub natív AI kódoló asszisztense (Codex motoron). Webfejlesztési projekteknél napi munkaeszköz, kódkiegészítéshez és teszt-skeleton generáláshoz.",
    descriptionEn:
      "GitHub's native AI coding assistant (Codex-powered). Daily tool for completion, refactor and test-skeleton generation in our web dev work.",
    descriptionZh:
      "GitHub 原生 AI 编码助手(Codex 驱动)。我们网站开发中的日常工具,用于代码补全、重构与生成测试骨架。",
  },
  {
    name: "Cursor",
    category: "ai",
    website: "https://cursor.com",
    description:
      "AI-first kódszerkesztő multi-fájl szerkesztéssel és Agent móddal. Komplex frontend feladatoknál (új komponens egész stack-en át) gyorsít drámaian.",
    descriptionEn:
      "AI-first code editor with multi-file edits and Agent mode. Drastically speeds up cross-stack frontend work.",
    descriptionZh:
      "AI 优先的代码编辑器,支持多文件编辑与 Agent 模式。大幅加速跨技术栈的前端开发。",
  },
  {
    name: "Gemini",
    category: "ai",
    website: "https://gemini.google.com",
    description:
      "Google multimodális modellje, amely a Google Workspace-be is integrált. Email-, dokumentum- és Sheet-alapú ügyfél-deliverable-ekhez használjuk.",
    descriptionEn:
      "Google's multimodal model, integrated into Workspace. We use it for email, doc and Sheet-based client deliverables.",
    descriptionZh:
      "Google 多模态模型,深度集成于 Workspace。我们用于电子邮件、文档与 Sheet 形式的客户交付物。",
  },
  {
    name: "ChatGPT",
    category: "ai",
    website: "https://chat.openai.com",
    description:
      "OpenAI általános LLM-je, GPT-5/o3 modellekkel. Brainstorming, ügyfél-pitch előkészítés, gyors prompt-iterálás. Az admin AI-funkcióit is GPT-mini hajtja a háttérben.",
    descriptionEn:
      "OpenAI's flagship LLM (GPT-5/o3 family). Brainstorming, pitch prep, prompt iteration. Also powers our admin AI features in the background.",
    descriptionZh:
      "OpenAI 的旗舰 LLM(GPT-5/o3 系列)。用于头脑风暴、提案准备、提示词迭代。后台也为我们的管理员 AI 功能提供支持。",
  },
  {
    name: "Perplexity",
    category: "ai",
    website: "https://www.perplexity.ai",
    description:
      "Forrásmegjelölő AI-kereső, Pro modellválasztással. Iparági kutatás (versenytárs-elemzés, piaci tendenciák) első körös eszköze — fact-check-elhető válaszokkal.",
    descriptionEn:
      "Citation-grounded AI search with Pro model selection. Our first-pass tool for industry research and competitive analysis.",
    descriptionZh:
      "带引用的 AI 搜索,可选择 Pro 模型。我们做行业调研与竞争分析的首选工具,答案可核实。",
  },
  {
    name: "v0 by Vercel",
    category: "ai",
    website: "https://v0.dev",
    description:
      "Generatív AI UI-kódoló, közvetlen React/Tailwind kimenettel. Kezdeti landing-prototípusok és A/B variánsok gyors gyártására.",
    descriptionEn:
      "Generative AI UI coder with direct React/Tailwind output. Used for landing prototypes and rapid A/B variants.",
    descriptionZh:
      "生成式 AI UI 编码器,直接输出 React/Tailwind。用于落地页原型与快速 A/B 变体。",
  },

  // ── Kép / Videó / Generatív vizuál ──────────────────────────────────────
  {
    name: "Midjourney",
    category: "ai",
    website: "https://www.midjourney.com",
    description:
      "Vezető generatív kép-AI (v7 modell), művészi konzisztencia karakter-referenciával. Hero vizuálokhoz, social tartalom-illusztrációkhoz használjuk.",
    descriptionEn:
      "Leading generative image AI (v7), artistic consistency via character reference. We use it for hero visuals and social illustrations.",
    descriptionZh:
      "领先的生成式图像 AI(v7),通过角色参考实现艺术一致性。用于英雄区视觉与社媒插画。",
  },
  {
    name: "DALL·E 3",
    category: "ai",
    website: "https://openai.com/index/dall-e-3",
    description:
      "OpenAI kép-generátora, OG image-ekhez és blog featured képekhez integráltuk az admin „AI image\" gombba — Cloudinary-ra is auto-rehost.",
    descriptionEn:
      "OpenAI's image model, integrated into our admin 'AI image' button for OG images and blog featured shots, auto-rehosted to Cloudinary.",
    descriptionZh:
      "OpenAI 图像模型,已集成到管理员的「AI 图像」按钮,用于 OG 图与博客特色图,并自动转存至 Cloudinary。",
  },
  {
    name: "Adobe Firefly",
    category: "ai",
    website: "https://firefly.adobe.com",
    description:
      "Adobe szabadon-licencelt képzéssel készült generatív modellje. Ügyfélkommunikációban használjuk, ahol a kereskedelmi felhasználás jogi tisztasága kritikus.",
    descriptionEn:
      "Adobe's generative model trained on commercially-licensed data. We use it where the legal cleanliness of commercial use is critical.",
    descriptionZh:
      "Adobe 的生成模型,采用合规授权数据训练。在客户沟通中需要商用法律清洁性的场景使用。",
  },
  {
    name: "Runway",
    category: "ai",
    website: "https://runwayml.com",
    description:
      "Generatív videó (Gen-3, Gen-4 Alpha) — szöveg-kép-videó konverziók, social hirdetésekhez 5–10 mp-es animált tartalmak.",
    descriptionEn:
      "Generative video (Gen-3, Gen-4 Alpha) — text-to-video and image-to-video for 5–10s social ad creatives.",
    descriptionZh:
      "生成式视频(Gen-3、Gen-4 Alpha)— 文转视频与图转视频,用于 5–10 秒的社媒广告创意。",
  },
  {
    name: "Sora",
    category: "ai",
    website: "https://openai.com/sora",
    description:
      "OpenAI hosszabb, koherens videó-modellje. Premium ügyfeleknek készülő, narratív hangsúlyú spotokhoz szelektíven használjuk.",
    descriptionEn:
      "OpenAI's longer-form, coherent video model. Used selectively for narrative-driven spots for premium clients.",
    descriptionZh:
      "OpenAI 更长、更连贯的视频模型。在为高端客户制作叙事型短片时选择性使用。",
  },
  {
    name: "Leonardo.Ai",
    category: "ai",
    website: "https://leonardo.ai",
    description:
      "Style-konzisztens kép-generátor saját finomhangolt modellekkel. Brand-konzisztens vizuális családokhoz, ahol minden képnek hasonló esztétikája kell legyen.",
    descriptionEn:
      "Style-consistent image generator with custom fine-tuned models. Used for brand-consistent visual families.",
    descriptionZh:
      "风格一致的图像生成器,支持自定义微调模型。用于需要统一美学的品牌视觉系列。",
  },
  {
    name: "Flux",
    category: "ai",
    website: "https://blackforestlabs.ai",
    description:
      "Black Forest Labs nyílt képgenerátor modellje. Fotorealisztikus kontent-vizualizációkhoz és karakter-referenciás kreatívokhoz.",
    descriptionEn:
      "Black Forest Labs' open image generator. For photorealistic content visuals and character-reference creatives.",
    descriptionZh:
      "Black Forest Labs 的开源图像生成器。用于照片级写实的内容视觉与角色参考创意。",
  },

  // ── Hang / Beszéd ───────────────────────────────────────────────────────
  {
    name: "ElevenLabs",
    category: "ai",
    website: "https://elevenlabs.io",
    description:
      "Vezető beszéd-szintézis (29+ nyelv, hangklónozás). Magyar és angol video-narrációkhoz, podcast-szegmensekhez, interaktív audiókhoz.",
    descriptionEn:
      "Leading speech synthesis (29+ languages, voice cloning). For Hungarian + English video narration, podcast segments and interactive audio.",
    descriptionZh:
      "领先的语音合成(29+ 语言,声音克隆)。用于匈牙利语与英语视频旁白、播客片段、交互式音频。",
  },
  {
    name: "Suno",
    category: "ai",
    website: "https://suno.com",
    description:
      "Generatív zene szöveges promptból, ügyfél-brief stílusra. Social videóinkhoz egyedi, jogtiszta zenét generálunk vele.",
    descriptionEn:
      "Generative music from text prompts, matched to client brief style. We generate royalty-clean music for our social videos.",
    descriptionZh:
      "从文本提示生成与客户简报风格匹配的音乐。为社媒视频生成版权清洁的原创音乐。",
  },
  {
    name: "Adobe Podcast",
    category: "ai",
    website: "https://podcast.adobe.com",
    description:
      "AI-alapú audio-tisztítás (Enhance Speech) — gyenge mikrofonnal készült interjúk stúdió-minőségűvé alakítása.",
    descriptionEn:
      "AI audio cleanup (Enhance Speech) — converts low-quality mic interviews to studio-grade clarity.",
    descriptionZh:
      "基于 AI 的音频清理(Enhance Speech)— 将低质量麦克风访谈提升至录音棚级清晰度。",
  },

  // ── Design / Kreatív ────────────────────────────────────────────────────
  {
    name: "Figma",
    category: "marketing",
    website: "https://figma.com",
    description:
      "Tervező-platformunk wireframekhez, web-design rendszerekhez, UI komponens-könyvtárakhoz. Figma AI generatív komponens-javaslatokkal segít.",
    descriptionEn:
      "Our design platform for wireframes, web design systems and UI component libraries. Figma AI helps with generative suggestions.",
    descriptionZh:
      "我们的设计平台,用于线框图、网页设计系统与 UI 组件库。Figma AI 提供生成式建议。",
  },
  {
    name: "Artlist",
    category: "marketing",
    website: "https://artlist.io",
    description:
      "Subscription-alapú stock zene, hangeffekt és videó stock. Ügyfél-videókhoz használt jogtiszta forrás, korlátlan licenccel.",
    descriptionEn:
      "Subscription-based stock music, sound effects and video. Royalty-clean source for client videos with unlimited licensing.",
    descriptionZh:
      "订阅制图库音乐、音效与视频。客户视频的版权清洁来源,具备无限授权。",
  },
  {
    name: "Framer",
    category: "marketing",
    website: "https://framer.com",
    description:
      "No-code design-to-deploy platform, beépített CMS-szel és AI workshop módddal. Gyors prototípusoknak és tematikus mikrohonlapoknak ideális.",
    descriptionEn:
      "No-code design-to-deploy platform with built-in CMS and AI workshop mode. Ideal for fast prototypes and themed micro-sites.",
    descriptionZh:
      "无代码设计即部署平台,内置 CMS 与 AI 工作坊模式。适合快速原型与主题微站点。",
  },
  {
    name: "Adobe Express",
    category: "marketing",
    website: "https://www.adobe.com/express",
    description:
      "Adobe könnyű kreatív szerkesztője Firefly AI integrációval. Social poszt sablonok és gyors brand-konform vizuális anyagok.",
    descriptionEn:
      "Adobe's lightweight creative editor with Firefly AI integration. Social post templates and fast brand-consistent visuals.",
    descriptionZh:
      "Adobe 轻量创意编辑器,集成 Firefly AI。用于社媒模板与快速品牌一致视觉。",
  },

  // ── Marketing / SEO / Tartalom ──────────────────────────────────────────
  {
    name: "Copy.ai",
    category: "ai",
    website: "https://copy.ai",
    description:
      "Marketing-szöveg generátor és workflow-platform. Email kampány-szekvenciák, ad copy variánsok és landing page szöveg-vázak gyártásához.",
    descriptionEn:
      "Marketing copy generator and workflow platform. For email sequence drafts, ad copy variants and landing page outlines.",
    descriptionZh:
      "营销文案生成与工作流平台。用于邮件序列、广告文案变体与落地页大纲。",
  },
  {
    name: "Frase",
    category: "ai",
    website: "https://www.frase.io",
    description:
      "SEO-orientált AI tartalomgyártás, SERP-elemzéssel. Cikkvázlatok, optimalizációs javaslatok versenyző URL-ek alapján.",
    descriptionEn:
      "SEO-oriented AI content tool with SERP analysis. Article outlines and optimization based on competing URLs.",
    descriptionZh:
      "面向 SEO 的 AI 内容工具,内置 SERP 分析。基于竞品 URL 提供文章大纲与优化建议。",
  },
  {
    name: "Clearscope",
    category: "ai",
    website: "https://www.clearscope.io",
    description:
      "Tartalomoptimalizáló — Google top-10 alapján generál relevancia-grade és kulcsszó-térképet. Long-form blog cikkek SEO-fókuszú szerkesztéséhez.",
    descriptionEn:
      "Content optimizer — relevance grading and keyword maps from Google's top-10. For SEO-focused long-form editing.",
    descriptionZh:
      "内容优化器 — 基于 Google top-10 的相关度评级与关键词地图。用于长文章的 SEO 编辑。",
  },

  // ── Produktivitás ───────────────────────────────────────────────────────
  {
    name: "Notion AI",
    category: "ai",
    website: "https://www.notion.so/product/ai",
    description:
      "Notion natív AI-asszisztense — ügyfél-dokumentumok, projekt-meetings összefoglalói, action item-ek auto-extraction.",
    descriptionEn:
      "Notion's native AI — client document drafting, meeting summaries, action item auto-extraction.",
    descriptionZh:
      "Notion 原生 AI — 客户文档撰写、会议摘要、自动提取行动事项。",
  },
  {
    name: "Otter.ai",
    category: "ai",
    website: "https://otter.ai",
    description:
      "Valós idejű meeting-átírás és összegzés (angol elsősorban). Ügyfél-konzultációkhoz használjuk, ahol szó szerinti emlékezet kritikus.",
    descriptionEn:
      "Real-time meeting transcription and summary (mostly English). Used for client calls where verbatim recall matters.",
    descriptionZh:
      "实时会议转录与摘要(以英语为主)。用于需要逐字回忆的客户通话。",
  },
  {
    name: "Fireflies.ai",
    category: "ai",
    website: "https://fireflies.ai",
    description:
      "Meeting-átírás és kereshető hangtár (Zoom/Meet/Teams). Belső riportokhoz és kampány-szakmai döntések visszanézéséhez.",
    descriptionEn:
      "Meeting transcription and searchable audio archive (Zoom/Meet/Teams). For internal reports and replaying campaign decisions.",
    descriptionZh:
      "会议转录与可搜索音频库(Zoom/Meet/Teams)。用于内部报告与回顾活动决策。",
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────
const conn = await mysql.createConnection({
  uri: DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

let inserted = 0;
let updated = 0;
let skipped = 0;

try {
  for (const tool of TOOLS) {
    const [rows] = await conn.execute("SELECT id FROM technologies WHERE name = ? LIMIT 1", [tool.name]);
    if (rows.length > 0) {
      // Update only descriptive columns; preserve admin-curated logo + sortOrder
      await conn.execute(
        `UPDATE technologies
           SET category = ?, website = ?,
               description = ?, descriptionEn = ?, descriptionZh = ?
         WHERE id = ?`,
        [tool.category, tool.website, tool.description, tool.descriptionEn, tool.descriptionZh, rows[0].id],
      );
      updated++;
      console.log(`  ↻ updated:  ${tool.name} (${tool.category})`);
    } else {
      await conn.execute(
        `INSERT INTO technologies (name, category, website, description, descriptionEn, descriptionZh, isActive, sortOrder, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, 1, 0, NOW())`,
        [tool.name, tool.category, tool.website, tool.description, tool.descriptionEn, tool.descriptionZh],
      );
      inserted++;
      console.log(`  ✓ inserted: ${tool.name} (${tool.category})`);
    }
  }

  console.log(`\nDone — inserted: ${inserted}, updated: ${updated}, skipped: ${skipped}`);
} finally {
  await conn.end();
}
