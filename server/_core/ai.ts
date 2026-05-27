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

const LANG_NAMES: Record<Lang, string> = { hu: "magyar", en: "English", zh: "中文" };

export async function generateBlogDraft(input: BlogDraftInput): Promise<BlogDraft> {
  const lang = input.lang ?? "hu";
  const wordCount = input.wordCount ?? 600;
  const tone = input.tone ?? "professional";
  const audience = input.audience || "kis- és középvállalati döntéshozók";

  // Brand voice — loaded fresh on every call so admin edits take effect
  // without a restart. When unset, the prompt below still produces a
  // reasonable G2A-flavoured draft using the inline boilerplate.
  // Note: avoid circular import (brandVoice → db → schema is fine, but ai.ts
  // is imported from many places). We use a dynamic import.
  const { loadBrandVoice, renderBrandContext } = await import("./brandVoice");
  const brandContext = renderBrandContext(await loadBrandVoice(), "blog");

  const baseSystem = `Te a G2A Marketing pécsi B2B marketing ügynökség blog-szerzője vagy. A G2A magyar marketing tanácsadás, SEO, közösségi média, weboldal-fejlesztés és AI-megoldások területén ad szolgáltatást. Mindig a látogatót szólítjuk meg te-formában (NEM önözünk).

Szabályok:
- A teljes válasz ${LANG_NAMES[lang]} nyelven.
- Hangnem: ${tone}.
- Cél olvasó: ${audience}.
- A "content" mezőben strukturált markdown (## fejezetek, bullet listák, kiemelt szakaszok) ~${wordCount} szóval.
- A "title" SEO-barát, max 65 karakter, az olvasó hasznát ígéri.
- "excerpt" 1-2 mondat (max 200 karakter), a teljes cikk lényege.
- "metaTitle" max 60 char, kulcsszót tartalmaz.
- "metaDescription" 140-160 char közt, hívószóval.
- NE találj ki konkrét statisztikákat vagy számokat, ha nem vagy biztos bennük.

Csak JSON-t adj vissza ezzel a sémával: { "title": "...", "excerpt": "...", "content": "...", "metaTitle": "...", "metaDescription": "..." }`;

  const system = brandContext ? `${brandContext}\n\n${baseSystem}` : baseSystem;

  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Téma: ${input.topic}` },
    ],
    { temperature: 0.7, maxTokens: 2500, jsonMode: true },
  );

  let parsed: BlogDraft;
  try {
    parsed = JSON.parse(raw) as BlogDraft;
  } catch {
    throw new Error("OpenAI invalid JSON response");
  }
  // Defensive defaults
  return {
    title: parsed.title?.trim() ?? "",
    excerpt: parsed.excerpt?.trim() ?? "",
    content: parsed.content?.trim() ?? "",
    metaTitle: parsed.metaTitle?.trim() ?? "",
    metaDescription: parsed.metaDescription?.trim() ?? "",
  };
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
  /** "1024x1024" (square) | "1792x1024" (wide, hero) | "1024x1792" (tall). Default: 1792x1024. */
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  /** "standard" (cheaper, ~$0.04) or "hd" (more detail, ~$0.08). Default: standard. */
  quality?: "standard" | "hd";
  /** "vivid" (hyper-real, dramatic) or "natural" (more realistic, less stylized). Default: natural. */
  style?: "vivid" | "natural";
};

export type GenerateImageResult = {
  /** Direct URL to the generated image (Azure CDN, valid for ~1 hour). */
  url: string;
  /** Revised prompt OpenAI actually used (it adds safety phrasing). */
  revisedPrompt: string;
};

const DALL_E_ENDPOINT = "https://api.openai.com/v1/images/generations";
const DALL_E_MODEL = "dall-e-3";

/**
 * Generate an image via OpenAI DALL·E 3.
 *
 * Cost (2026-04 pricing):
 *  - 1024×1024 standard: $0.040
 *  - 1792×1024 standard: $0.080  ← default for service hero images (16:9)
 *  - 1024×1024 HD: $0.080
 *  - 1792×1024 HD: $0.120
 *
 * Returns a URL to the image. The URL is short-lived (~1 hour) — caller
 * should download the bytes and re-host (typically on Cloudinary).
 */
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set — image generation disabled");

  const res = await fetch(DALL_E_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DALL_E_MODEL,
      prompt: input.prompt,
      n: 1,
      size: input.size ?? "1792x1024",
      quality: input.quality ?? "standard",
      style: input.style ?? "natural",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI Images ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }

  const json = (await res.json()) as { data?: { url?: string; revised_prompt?: string }[] };
  const item = json.data?.[0];
  if (!item?.url) throw new Error("OpenAI returned no image URL");
  return {
    url: item.url,
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
