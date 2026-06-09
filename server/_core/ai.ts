/**
 * OpenAI bridge — chat/completions REST.
 *
 * Env:
 *   OPENAI_API_KEY    sk-... key (https://platform.openai.com/api-keys)
 *   OPENAI_MODEL      (optional) default: "gpt-4o-mini" — cheapest competent model
 *                     for HU/EN/ZH content. Override with "gpt-4o" for higher quality.
 *
 * Why no SDK: REST is stable, the SDK is heavy, our use cases (3 procedures)
 * don't need streaming or tool-use. If we ever need those, swap in `openai` npm.
 *
 * Cost orientation (gpt-4o-mini, 2026-04 pricing):
 *   $0.15 / 1M input tokens · $0.60 / 1M output tokens
 *   ≈ HUF 0.5 per blog draft (1500 tokens) · HUF 0.05 per SEO meta (200 tokens)
 */

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export type Lang = "hu" | "en" | "zh";

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getAiModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type ChatOptions = {
  /** 0-2; lower = more deterministic. Default 0.7 (balanced creativity). */
  temperature?: number;
  /** Hard cap on response tokens. Default 2000 (~1500 HU words). */
  maxTokens?: number;
  /** Force JSON mode — model must return parseable JSON. */
  jsonMode?: boolean;
};

async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set — AI features are disabled");

  const body: Record<string, unknown> = {
    model: getAiModel(),
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 2000,
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("OpenAI returned empty response");
  return text;
}

// ─── Use case 1: Blog draft generation ────────────────────────────────────────

export type BlogDraftInput = {
  topic: string;
  /** Target audience (e.g. "B2B kkv tulajdonosok", "marketing managers"). */
  audience?: string;
  /** Approx target length in words. Default 600. */
  wordCount?: number;
  /** Output language. Default HU. */
  lang?: Lang;
  /** Tone — "professional" (default), "conversational", "technical". */
  tone?: "professional" | "conversational" | "technical";
};

export type BlogDraft = {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

/** One blog draft per locale — what the admin Post editor fills in. */
export type MultilangBlogDraft = {
  hu: BlogDraft;
  en: BlogDraft;
  zh: BlogDraft;
};

const LANG_NAMES: Record<Lang, string> = { hu: "magyar", en: "English", zh: "中文" };

/**
 * Convert leftover markdown syntax to HTML. The prompt instructs the
 * model to emit clean HTML, but in practice it sometimes regresses to
 * markdown — especially when older brand-voice example posts were
 * authored in markdown style. This converter runs as a safety net so
 * the blog page never renders raw "##" or "**bold**" to visitors.
 *
 * We only handle the syntax the model actually produces in regressions:
 * ATX headings (## / ###), bullet & numbered lists (- / 1.), bold
 * (**...**), italic (*...*), and double-newline paragraph splitting.
 * Anything that already looks like HTML passes through untouched.
 */
function markdownToHtml(raw: string): string {
  if (!raw) return raw;
  // If the content already starts with a real HTML tag AND contains no
  // markdown heading/list markers, treat it as clean HTML and skip the
  // conversion. This avoids touching well-formed output.
  const looksHtml = /^\s*<(p|h2|h3|ul|ol|div)\b/i.test(raw);
  const hasMdMarkers = /(^|\n)\s{0,3}(#{2,3}\s|[-*]\s|\d+\.\s)/.test(raw) || /\*\*[^*]+\*\*/.test(raw);
  if (looksHtml && !hasMdMarkers) return raw;

  // Split into blocks on blank lines, then classify each block.
  const blocks = raw.replace(/\r\n/g, "\n").split(/\n\s*\n+/);
  const out: string[] = [];

  for (const blockRaw of blocks) {
    const block = blockRaw.trim();
    if (!block) continue;

    // ATX headings
    const h3 = block.match(/^###\s+(.+)$/);
    if (h3) { out.push(`<h3>${inlineMd(h3[1])}</h3>`); continue; }
    const h2 = block.match(/^##\s+(.+)$/);
    if (h2) { out.push(`<h2>${inlineMd(h2[1])}</h2>`); continue; }
    const h1 = block.match(/^#\s+(.+)$/);
    if (h1) { out.push(`<h2>${inlineMd(h1[1])}</h2>`); continue; } // demote h1 → h2

    // Bullet list — every line starts with "-" or "*"
    const bulletLines = block.split("\n");
    if (bulletLines.every((l) => /^\s{0,3}[-*]\s+/.test(l))) {
      const items = bulletLines.map((l) => `<li>${inlineMd(l.replace(/^\s{0,3}[-*]\s+/, ""))}</li>`).join("");
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    // Numbered list — every line starts with "1.", "2." etc.
    if (bulletLines.every((l) => /^\s{0,3}\d+\.\s+/.test(l))) {
      const items = bulletLines.map((l) => `<li>${inlineMd(l.replace(/^\s{0,3}\d+\.\s+/, ""))}</li>`).join("");
      out.push(`<ol>${items}</ol>`);
      continue;
    }

    // Block that contains an existing HTML opening tag — keep as-is.
    if (/^<(p|h2|h3|ul|ol|div|blockquote)/i.test(block)) {
      out.push(block);
      continue;
    }

    // Default — wrap as paragraph, convert single newlines to spaces.
    out.push(`<p>${inlineMd(block.replace(/\n/g, " "))}</p>`);
  }
  return out.join("\n");
}

/** Inline markdown: **bold**, *italic*, [text](url). Strips backticks. */
function inlineMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "$1");
}

/**
 * Lock the model into the requested output language. This is prepended
 * BEFORE any other instructions so it can't be drowned out by the
 * Hungarian boilerplate further down. We've seen the model regress to
 * Hungarian when asked for Chinese — a strong, native-language opener
 * fixes that reliably.
 */
function languageLock(lang: Lang): string {
  switch (lang) {
    case "zh":
      return "⚠ 关键语言要求 ⚠\n你必须用简体中文撰写所有输出内容。title、excerpt、content、metaTitle、metaDescription 字段中的每一个字都必须是简体中文。绝对不能使用匈牙利语、英语或任何其他语言。即使下面的指令是匈牙利语写的，你的回答也必须完全是简体中文。\n";
    case "en":
      return "⚠ CRITICAL LANGUAGE REQUIREMENT ⚠\nYou MUST write ALL output in English. Every field (title, excerpt, content, metaTitle, metaDescription) must be in English only. Do NOT use Hungarian or any other language. Even though the instructions below are in Hungarian, your entire response must be in English.\n";
    case "hu":
    default:
      return "";
  }
}

export async function generateBlogDraft(input: BlogDraftInput): Promise<BlogDraft> {
  const lang = input.lang ?? "hu";
  // Target reading time ~7-9 min. Hungarian/English ≈ 220 wpm, so a
  // typical post lands around 1500-2000 words. Chinese is character-
  // based (≈ 300 chars/min), so we ask for the same "word count" target
  // and let the model treat it as character count for zh.
  const wordCount = input.wordCount ?? 1700;
  const tone = input.tone ?? "professional";
  const audience = input.audience || "kis- és középvállalati döntéshozók";

  // Brand voice — loaded fresh on every call so admin edits take effect
  // without a restart. When unset, the prompt below still produces a
  // reasonable G2A-flavoured draft using the inline boilerplate.
  // Note: avoid circular import (brandVoice → db → schema is fine, but ai.ts
  // is imported from many places). We use a dynamic import.
  const { loadBrandVoice, renderBrandContext } = await import("./brandVoice");
  const brandContext = renderBrandContext(await loadBrandVoice(), "blog");

  const baseSystem = `${languageLock(lang)}Te a G2A Marketing pécsi B2B marketing ügynökség blog-szerzője vagy. A G2A magyar marketing tanácsadás, SEO, közösségi média, weboldal-fejlesztés és AI-megoldások területén ad szolgáltatást. Mindig a látogatót szólítjuk meg te-formában (NEM önözünk).

Szabályok:
- A teljes válasz ${LANG_NAMES[lang]} nyelven. ${lang === "zh" ? "(必须是简体中文 — Simplified Chinese.)" : lang === "en" ? "(English only.)" : ""}
- Hangnem: ${tone}.
- Cél olvasó: ${audience}.

⚠ KRITIKUS FORMÁTUM-SZABÁLY ⚠
A "content" mezőben **TISZTA HTML markup**-ot adj vissza. SZIGORÚAN TILOS bárhol markdown szintaxist használni: TILOS a "##", "###", "**...**", "- " sorkezdés, "> " idézet, "\`...\`" backtick. Ezek a karakterek SOHA nem jelenhetnek meg a content-ben szerkezet-jelölőként. Ez kötelező: a BlogPostPage \`dangerouslySetInnerHTML\`-lel rendereli, a markdown szóról szóra megjelenne a látogatónak.

Kötelező struktúra (pontosan így nézzen ki, ne másképp):

  <p>Nyitó bekezdés — 2-3 mondat, ami megfogja az olvasót.</p>
  <h2>Első alfejezet címe</h2>
  <p>Magyarázó bekezdés.</p>
  <ul><li>Lista elem 1</li><li>Lista elem 2</li></ul>
  <h2>Második alfejezet</h2>
  <p>További tartalom.</p>
  <h3>Részletek (opcionális)</h3>
  <p>Stb.</p>

- KIZÁRÓLAG ezek a tagek engedettek: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">.
- A H1-et NE add hozzá — azt a cikk \`title\` mezője adja.
- ⚠ TERJEDELEM: 8-12 <h2> alfejezet, ~${wordCount} szó össz (kb. 7-9 perc olvasási idő). Ez kötelező minimum — NE adj rövidebb cikket. Minden alfejezetben legyen 2-4 érdemi bekezdés és/vagy lista, ne csupán egy mondat. Hozz konkrét példákat, mini-eseteket, lépés-listákat, gyakori buktatókat és cselekvési ajánlásokat.
- Minden bekezdést <p>...</p> tag fogjon közre. Soron belüli kiemelést <strong> vagy <em> tag adjon, NEM ** vagy *.
- "title" SEO-barát, max 65 karakter, az olvasó hasznát ígéri.
- "excerpt" 1-2 mondat (max 200 karakter), a teljes cikk lényege.
- "metaTitle" max 60 char, kulcsszót tartalmaz.
- "metaDescription" 140-160 char közt, hívószóval.
- NE találj ki konkrét statisztikákat vagy számokat, ha nem vagy biztos bennük.

Csak JSON-t adj vissza ezzel a sémával: { "title": "...", "excerpt": "...", "content": "<p>...</p>...", "metaTitle": "...", "metaDescription": "..." }
A "content" érték HTML stringként szerepeljen (escape-elve a JSON-ban).`;

  const system = brandContext ? `${brandContext}\n\n${baseSystem}` : baseSystem;

  // maxTokens budget for a ~1700-word HTML post: words → ~1.3-1.5 tokens
  // each (Hungarian/English), plus HTML markup overhead (~+15%) and the
  // JSON envelope. Chinese is tokenised per character at ~1 token each.
  // 6000 tokens leaves comfortable headroom for the largest case.
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Téma: ${input.topic}` },
    ],
    { temperature: 0.7, maxTokens: 6000, jsonMode: true },
  );

  let parsed: BlogDraft;
  try {
    parsed = JSON.parse(raw) as BlogDraft;
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  // Defensive defaults + safety-net markdown→HTML conversion. The
  // prompt insists on HTML, but if the model regresses (especially when
  // brand-voice examples were written in markdown), this guarantees
  // the content actually renders correctly.
  return {
    title: parsed.title?.trim() ?? "",
    excerpt: parsed.excerpt?.trim() ?? "",
    content: markdownToHtml(parsed.content?.trim() ?? ""),
    metaTitle: parsed.metaTitle?.trim() ?? "",
    metaDescription: parsed.metaDescription?.trim() ?? "",
  };
}

/**
 * Generate a blog draft in all three site languages in parallel.
 *
 * The site is HU/EN/ZH everywhere, and the admin used to manually write
 * each translation (or run translations after the HU was done). This
 * function fans out one prompt per locale to OpenAI in parallel so the
 * Post editor can populate every language tab from a single button click.
 *
 * Roughly 3× the token cost of a single-language draft but completes in
 * essentially the same wall-clock time (OpenAI's parallel-request handling
 * is fast). On gpt-4o-mini that's still well under 1 cent per article.
 */
export async function generateMultilangBlogDraft(
  input: Omit<BlogDraftInput, "lang">,
): Promise<MultilangBlogDraft> {
  const [hu, en, zh] = await Promise.all([
    generateBlogDraft({ ...input, lang: "hu" }),
    generateBlogDraft({ ...input, lang: "en" }),
    generateBlogDraft({ ...input, lang: "zh" }),
  ]);
  return { hu, en, zh };
}

// ─── Use case 2: SEO meta generation ──────────────────────────────────────────

export type SeoMetaInput = {
  /** Page topic / context (what is the page about?). */
  topic: string;
  /** Optional URL slug for context (e.g. "/szolgaltatasok/seo"). */
  slug?: string;
  /** Optional existing content the meta should summarize. */
  context?: string;
  lang?: Lang;
};

export type SeoMeta = { title: string; description: string };

export async function generateSeoMeta(input: SeoMetaInput): Promise<SeoMeta> {
  const lang = input.lang ?? "hu";
  const teFormRule = lang === "hu"
    ? "- Magyar nyelven KÖTELEZŐEN te-formát használj (NEM önözést). Pl. 'Tudd meg', 'Kérj ajánlatot', 'Indítsd el'."
    : "";
  const system = `Te SEO szakértő vagy a G2A Marketing pécsi B2B ügynökségnél. ${LANG_NAMES[lang]} nyelven írj.

Szabályok:
- "title" 50-60 karakter, fő kulcsszó az elején, márka a végén opcionálisan.
- "description" 140-160 karakter, hívószóval / CTA-val, természetesen tartalmazza a kulcsszót.
- Soha ne használj hype szavakat ("legjobb!", "csodás!"), maradj profi.
${teFormRule}

Csak JSON: { "title": "...", "description": "..." }`;

  const userParts = [`Téma / oldal: ${input.topic}`];
  if (input.slug) userParts.push(`URL slug: ${input.slug}`);
  if (input.context) userParts.push(`Kontextus:\n${input.context.slice(0, 2000)}`);

  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: userParts.join("\n\n") },
    ],
    { temperature: 0.5, maxTokens: 400, jsonMode: true },
  );

  let parsed: SeoMeta;
  try {
    parsed = JSON.parse(raw) as SeoMeta;
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  return {
    title: parsed.title?.trim() ?? "",
    description: parsed.description?.trim() ?? "",
  };
}

// ─── Use case 3: Improve / rewrite an existing text ───────────────────────────

export type ImproveTextInput = {
  text: string;
  /** "tighten" (shorter, punchier), "expand" (more detail), "rephrase" (same length). */
  mode?: "tighten" | "expand" | "rephrase";
  lang?: Lang;
  /** Optional instruction (e.g. "make it more conversational"). */
  instruction?: string;
};

// ─── Use case 4: Image generation ────────────────────────────────────────────

export type GenerateImageInput = {
  /** Plain text prompt — describes the image content. Best results from concrete, visual descriptions. */
  prompt: string;
  /**
   * Legacy DALL·E 3 sizes accepted for backwards-compat with existing
   * callers; mapped to the closest gpt-image-1 aspect internally:
   *   1024x1024 → 1024x1024 (square)
   *   1792x1024 → 1536x1024 (landscape hero)
   *   1024x1792 → 1024x1536 (portrait)
   */
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  /** "standard" → gpt-image-1 "medium", "hd" → "high". */
  quality?: "standard" | "hd";
};

export type GenerateImageResult = {
  /** PNG bytes of the generated image. Caller decides where to host it. */
  imageBuffer: Buffer;
  /** Revised prompt OpenAI actually used (it adds safety phrasing). */
  revisedPrompt: string;
};

const OPENAI_IMAGES_ENDPOINT = "https://api.openai.com/v1/images/generations";
const IMAGE_MODEL = "gpt-image-1";

// gpt-image-1 native sizes — we map the older DALL·E 3 dimensions to the
// closest supported aspect.
const SIZE_MAP: Record<NonNullable<GenerateImageInput["size"]>, string> = {
  "1024x1024": "1024x1024",
  "1792x1024": "1536x1024",
  "1024x1792": "1024x1536",
};

/**
 * Generate an image via OpenAI's gpt-image-1 model.
 *
 * Why gpt-image-1 (not dall-e-3): OpenAI released gpt-image-1 in April
 * 2025 as the recommended successor. DALL·E 3 still exists but newer
 * API keys / accounts often hit 400s on its endpoint (parameter schema
 * drift, content-policy regressions). gpt-image-1 is the stable path
 * forward — same /v1/images/generations endpoint, same auth, different
 * model name and response shape (base64 instead of an ephemeral URL).
 *
 * Cost (2026 pricing, approx):
 *  - 1024×1024 medium: ~$0.04
 *  - 1536×1024 medium: ~$0.06
 *  - high tier: roughly 2× medium
 *
 * Returns the PNG bytes directly. Callers can pipe them into Cloudinary
 * or save them however they want — no separate download step needed.
 */
/**
 * Always-appended suffix that suppresses text/typography in the output.
 * gpt-image-1 (and DALL·E before it) loves to drop logos, captions, or
 * heading-style text into hero images even when the prompt doesn't ask
 * for any — bad for editorial blog/feature images, where any embedded
 * text reads as a watermark or distracts from the headline overlay we
 * compose separately. Repeating the instruction multiple ways is the
 * most reliable lever; a single "no text" sometimes gets ignored.
 */
const NO_TEXT_SUFFIX =
  " IMPORTANT: the image must contain NO text, NO letters, NO numbers, NO words, NO captions, NO labels, NO logos, NO typography, NO writing of any kind anywhere in the image. No signs, no posters, no UI text, no watermarks. Pure visual composition only.";

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set — image generation disabled");

  const size = SIZE_MAP[input.size ?? "1792x1024"];
  const quality = input.quality === "hd" ? "high" : "medium";
  const finalPrompt = `${input.prompt}${NO_TEXT_SUFFIX}`;

  const res = await fetch(OPENAI_IMAGES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt: finalPrompt,
      n: 1,
      size,
      quality,
      // gpt-image-1 always returns base64. The response_format param
      // was removed from this model — we don't send it.
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI Images ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }

  const json = (await res.json()) as {
    data?: { b64_json?: string; revised_prompt?: string }[];
  };
  const item = json.data?.[0];
  if (!item?.b64_json) throw new Error("OpenAI returned no image data");
  return {
    imageBuffer: Buffer.from(item.b64_json, "base64"),
    revisedPrompt: item.revised_prompt ?? input.prompt,
  };
}

export async function improveText(input: ImproveTextInput): Promise<string> {
  const mode = input.mode ?? "rephrase";
  const lang = input.lang ?? "hu";

  const modeDesc: Record<typeof mode, string> = {
    tighten: "Tömörítsd: vágd le a tölteléket, rövidítsd 30-50%-kal, tartsd meg a tartalmat.",
    expand: "Bővítsd: adj hozzá konkrét példákat, részleteket. Cél a duplázott hossz.",
    rephrase: "Fogalmazd át: ugyanolyan hossz, ugyanaz a jelentés, friss megfogalmazás.",
  };

  const system = `Te marketing copywriter vagy. ${LANG_NAMES[lang]} nyelven írj.

Feladat: ${modeDesc[mode]}
${input.instruction ? `Külön instrukció: ${input.instruction}` : ""}

Szabályok:
- Tartsd meg a markdown formázást (##, **, listák) ha van.
- Te-formát használj (NEM önözés).
- Csak a végleges szöveget add vissza, semmi magyarázat, semmi kommentár.`;

  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: input.text },
    ],
    { temperature: 0.6, maxTokens: Math.max(500, Math.ceil(input.text.length / 2)) },
  );
  return raw;
}
