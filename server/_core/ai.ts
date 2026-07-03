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
  /** Per-call timeout in ms. Default 50_000 (50s). */
  timeoutMs?: number;
  /** Override the model for this call (defaults to getAiModel()). */
  model?: string;
};

/**
 * Model for long-form blog generation. gpt-4o-mini badly undershoots the
 * 1500-2000-word target (JSON mode makes it terse), so blog drafts use a
 * stronger model that actually holds length and writes engaging long-form.
 * Env-overridable if cost needs dialling back.
 */
function getBlogModel(): string {
  return process.env.OPENAI_BLOG_MODEL || "gpt-4o";
}

/**
 * Per-call hard ceiling. The multi-pass blog generator parallels six
 * OpenAI calls and the Vercel function has a 300s budget — but a
 * single elephant tail-end request can still hog the function until
 * the entire budget is gone. 50s per call leaves headroom for retry
 * + the second phase to start, while the slowest acceptable response
 * we've seen empirically is ~45s.
 */
const DEFAULT_CHAT_TIMEOUT_MS = 50_000;

async function chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set — AI features are disabled");

  const body: Record<string, unknown> = {
    model: opts.model ?? getAiModel(),
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 2000,
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };

  // AbortController-driven per-call timeout so a single stuck request
  // can't drain the Vercel function budget. Using AbortSignal.timeout
  // would be cleaner but it's flaky on the Node.js 18 baseline; manual
  // setTimeout + abort is portable everywhere.
  const timeoutMs = opts.timeoutMs ?? DEFAULT_CHAT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`OpenAI timeout after ${timeoutMs}ms — try a shorter prompt or smaller maxTokens`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

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
  /** Suggested call-to-action paragraph at the end of the post. */
  cta: string;
  /** 5 alternative headline ideas the admin can pick from. */
  alternativeTitles: string[];
  /**
   * 5 short editorial notes describing what the second-pass review
   * changed (AI-tells removed, tone tightened, etc). Surfaced in the
   * admin UI as a collapsible info panel.
   */
  editorNotes?: string[];
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
    // `table` included so a comparison table survives the markdown
    // safety-net path with its markup (and the FAQ <h2 id="faq"> anchor
    // is preserved by the h2 branch above).
    if (/^<(p|h2|h3|ul|ol|div|blockquote|table)/i.test(block)) {
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
  // Target 1500-2000 words (deep, SEO+GEO-optimised B2B pillar post).
  // Hungarian/English ≈ 220 wpm, Chinese ≈ 300 chars/min — this length
  // lands around a 7-9 min read, which is what drives dwell-time and AI
  // citations (long-form structured content is the top GEO signal). 1700
  // is the midpoint we ask for. Short 1-minute drafts are NOT acceptable.
  const wordCount = input.wordCount ?? 1700;
  const tone = input.tone ?? "professional";
  const audience = input.audience || "magyar KKV-tulajdonosok, cégvezetők, marketingvezetők és döntéshozók";

  // Brand voice — loaded fresh on every call so admin edits take effect
  // without a restart. When unset, the prompt below still produces a
  // reasonable G2A-flavoured draft using the inline boilerplate.
  // Note: avoid circular import (brandVoice → db → schema is fine, but ai.ts
  // is imported from many places). We use a dynamic import.
  const { loadBrandVoice, renderBrandContext } = await import("./brandVoice");
  const brandContext = renderBrandContext(await loadBrandVoice(), "blog");

  // System prompt is intentionally written in Hungarian (the brief was
  // authored that way) and `languageLock(lang)` forces the output to
  // the requested locale. Keeping the brief monolingual avoids drift
  // between the three localised copies.
  const baseSystem = `${languageLock(lang)}Te a G2A Marketing pécsi B2B marketing ügynökség senior tartalom-stratégája és blog-szerzője vagy. A G2A magyar marketing tanácsadás, SEO, közösségi média, weboldal-fejlesztés és AI-megoldások területén ad szolgáltatást. Mindig a látogatót szólítjuk meg te-formában (NEM önözünk).

⚠ KIMENETI NYELV
A teljes válasz ${LANG_NAMES[lang]} nyelven. ${lang === "zh" ? "(必须是简体中文 — Simplified Chinese.)" : lang === "en" ? "(English only — no Hungarian leakage.)" : ""}

KÖZÖNSÉG
${audience}. Gyakorlati, üzletileg hasznos tanácsokat keresnek — NEM akadémiai szöveget. A cél: segíteni tisztábban látni a problémát és döntést hozni.

STÍLUS — HubSpot-szerű, emberi B2B hangvétel:
- erős, problémaorientált nyitás (NEM definíció)
- közvetlen, de nem túl laza megszólalás (te-formában)
- gyakorlati példák, magyar KKV-kontextusból
- jól tagolt, mégis ÖSSZEFÜGGŐ gondolatmenet — egyik gondolat vezessen a másikhoz
- minden alcím alatt VALÓDI magyarázat legyen, ne csak felsorolás
- legyen benne szakmai vélemény, NE csak semleges összefoglalás
- változatos mondathossz
- üzleti realitás: költség, kapacitás, piacismeret, döntéshozói bizonytalanság, verseny, marketingcsatornák, márkapozicionálás

🚫 SZIGORÚAN TILTOTT AI-SZAGÚ FORDULATOK (NE használd egyiket sem):
- "napjainkban egyre fontosabb"
- "kulcsfontosságú szerepet játszik"
- "számos kihívás áll előttük"
- "a megfelelő stratégia elengedhetetlen"
- "a digitális kor"
- "a mai gyorsan változó világban"
- "felfedezzük", "feltárjuk", "elmélyedünk"
- "fontos megjegyezni, hogy", "érdemes kiemelni"
- "összefoglalva", "konklúzióként"
- generikus tanácsadói közhelyek

✅ HELYETTE: konkrét, természetes, emberi logikájú megfogalmazás. Életszerű üzleti helyzet, provokatív megállapítás, gyakori vezetői tévedés.

SZERKEZET (kötelező, EBBEN a sorrendben — SEO + GEO / AI-kereső optimalizált):

1. CÍM (SEO cím) — figyelemfelkeltő, konkrét, kulcsszó-gazdag; max 65 karakter; NE legyen általános.
2. META LEÍRÁS — max 155 karakter; tartalmazza a fő problémát és az olvasói hasznot.
3. KIVONAT (lead) — 1-2 mondat (max 200 karakter), a teljes cikk lényege.
4. BEVEZETŐ (a content elején) — 2 bekezdés. NE definícióval kezdj. Kezdj életszerű üzleti helyzettel, provokatív megállapítással vagy gyakori vezetői tévedéssel. FRONT-LOADING: már az első 2-3 mondatban derüljön ki a cikk fő állítása / közvetlen válasza a témára — az AI-keresők (ChatGPT, Perplexity, Google AI Overviews) az elöl álló, tömör választ idézik.
5. KULCS TANULSÁGOK — közvetlenül a bevezető után egy <h2>Kulcs tanulságok</h2> blokk, alatta egy <ul> 3-5 ponttal. MINDEN pont önmagában is érthető, teljes állítás legyen (az AI-keresők pontosan az ilyen önálló, idézhető állításokat emelik ki). NE általánosság — konkrét, a cikkből fakadó tanulság.
6. FŐ RÉSZ — 6-8 nagyobb tartalmi blokk (<h2>). Ahol természetes, a H2 legyen KÉRDÉS formájú (illeszkedik az AI-keresők lekérdezéseihez, pl. "Miért nem hoz eredményt a hirdetésed?"). MINDEN blokk 180-280 szó, és tartalmazzon:
   - erős, konkrét alcím
   - a probléma emberi, üzleti magyarázata
   - konkrét magyar KKV-példa vagy tipikus helyzet
   - mit érdemes másképp csinálni
   Legalább EGY blokkban legyen egy jól strukturált <ul>/<ol> lista VAGY egy egyszerű összehasonlító <table> (pl. „gyakori hiba" vs. „jobb megközelítés" — <thead>/<tbody>/<tr>/<th>/<td>). Az AI-keresők a strukturált adatot (lista, táblázat) preferálják kiemeléshez. De NE legyen minden blokk listás — a cikk gerince folyó, összefüggő szöveg.
7. MIT TEGYÉL MOST? — az utolsó tartalmi blokk előtt egy <h2>Mit tegyél most?</h2>, alatta <ol> 4-6 konkrét, végrehajtható lépéssel.
8. ZÁRÁS — utolsó tartalmi <h2>. NE motivációs közhely. Erős szakmai állítással foglald össze a téma valódi tanulságát. A végén természetes, segítő hangú (NEM tolakodó) CTA a G2A Marketing felé. Példa: "Ha szeretnéd látni, hol akad el a te cégednél a növekedés, a G2A Marketing segít feltérképezni a piacot, az üzeneteket és a digitális jelenlét gyenge pontjait."
9. GYAKORI KÉRDÉSEK — a cikk LEGVÉGÉN egy <h2 id="faq">Gyakori kérdések</h2> szekció (az id="faq" KÖTELEZŐ és pontosan így). Alatta 4-6 valódi, a témában ténylegesen keresett kérdés, mindegyik: <h3>A kérdés?</h3> majd <p>2-4 mondatos, önmagában is teljes, konkrét válasz</p>. Ebből épül a FAQPage structured data, amit az AI-keresők és a Google kiemelt találatai a leggyakrabban idéznek — ezért legyen tartalmilag erős, ne töltelék.

⚠ TERJEDELEM: 1500-2000 szó a cél (~${wordCount}), hogy mély, 7-9 perces, versenyképes pillér-cikk legyen. Ez a MINIMUM elvárás — az 1 perces, felszínes cikk NEM elfogadható. Minden <h2> blokk legyen legalább 180 szó, ténylegesen kifejtve. A hosszt mélységgel, példával és konkrétsággal töltsd meg, NE üres frázisokkal vagy ismétléssel. Ne túlozz, ne ígérj garantált sikert, ne találj ki statisztikát.

⚠ HTML FORMÁTUM (content mező)
A "content" mezőben TISZTA HTML markup. SZIGORÚAN TILOS markdown szintaxis ("##", "**...**", "- ", backtick). A BlogPostPage \`dangerouslySetInnerHTML\`-lel rendereli — a markdown szóról szóra megjelenne.

Engedett tagek: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">, valamint táblázathoz <table>, <thead>, <tbody>, <tr>, <th>, <td>.
NE add hozzá a H1-et — azt a cikk \`title\` mezője adja.
Minden bekezdést <p>...</p> tag fogjon közre. A "Gyakori kérdések" szekció H2-je KÖTELEZŐEN <h2 id="faq">.

A CIKK TARTALMI SZABÁLYAI:
- A törzs TISZTA HTML (a fent engedett tagekkel). A H1 főcímet NE tedd bele — az külön mezőben lesz.
- A „Gyakori kérdések" szekció H2-je KÖTELEZŐEN <h2 id="faq">.
- HOSSZ: a teljes kész cikk 1500-2000 szó legyen, ténylegesen kifejtve. A rövid, felszínes cikk hibás.`;

  const system = brandContext ? `${brandContext}\n\n${baseSystem}` : baseSystem;

  // Phase 1a — CONTENT generation WITHOUT JSON mode. Both gpt-4o and
  // gpt-4o-mini badly undershoot the 1500-2000-word target when the whole
  // article must be a single JSON string field (they wrap up early, ~700
  // words). Free-form HTML output holds the length reliably. 110s timeout:
  // a long draft takes ~60-100s; the multilang pipeline runs the 3 drafts
  // in parallel then the 3 edits in parallel (wall ≈ 2×110s < 300s Vercel).
  // CONTENT in TWO continuation passes. A single call — even non-JSON on
  // gpt-4o — tops out around ~800 words; splitting into "first half" +
  // "finish it" reliably lands 1500-2000 words (the 6+ min / dwell-time /
  // AI-citation target). Both halves run on the stronger blog model; each
  // is capped short enough that half1 + half2 + meta stays well under the
  // 300s Vercel budget even with the 3 locales running in parallel.
  // JSON mode ({ "content": "<html>" }) rather than free-form: gpt-4o
  // refuses free-form Chinese generation under this heavily-prohibitive
  // Hungarian brief (returns "很抱歉，我无法…"), but complies happily when the
  // output is a constrained JSON object. Same envelope for all locales.
  const JSON_ENVELOPE = `\n\nA választ EGY JSON objektumként add vissza: { "content": "…a fenti szabályok szerinti HTML string…" }. Csak a "content" mező legyen benne, a content értéke JSON-escape-elt HTML.`;
  const half1 = await chat(
    [
      { role: "system", content: `${system}\n\n⚠ MOST CSAK A CIKK ELSŐ FELÉT ÍRD MEG: a bevezetőt (front-loadolt válasszal), a <h2>Kulcs tanulságok</h2> listát, majd az első 4 nagyobb <h2> tartalmi blokkot (mindegyik 200-300 szó, valódi kifejtéssel, példával). NE írd meg a „Mit tegyél most?"-ot, a záró CTA-t és a Gyakori kérdéseket — azok a második félbe jönnek. Az első fél HTML törzse ~1000 szó legyen.${JSON_ENVELOPE}` },
      { role: "user", content: `Téma: ${input.topic}` },
    ],
    { temperature: 0.75, maxTokens: 6000, timeoutMs: 85_000, model: getBlogModel(), jsonMode: true },
  );
  const part1 = extractContentField(half1);
  const half2 = await chat(
    [
      { role: "system", content: `${system}\n\n⚠ MOST A CIKK MÁSODIK FELÉT (BEFEJEZÉSÉT) ÍRD MEG. Megkapod a már megírt első felet — folytasd ZÖKKENŐMENTESEN, NE ismételd meg. Írj még 3-4 nagyobb <h2> tartalmi blokkot (200-300 szó), majd a <h2>Mit tegyél most?</h2> lépéslistát (<ol>), egy záró <h2>-t természetes, segítő CTA-val, végül a <h2 id="faq">Gyakori kérdések</h2> szekciót (4-6 valódi kérdés, <h3> kérdés + <p> válasz). Valamelyik blokkban legyen egy lista vagy összehasonlító táblázat. A folytatás ~1000 szó legyen, az első felet NE ismételd.${JSON_ENVELOPE}` },
      { role: "user", content: `Téma: ${input.topic}\n\nA cikk eddig megírt első fele (folytasd, ne ismételd):\n${part1}` },
    ],
    { temperature: 0.75, maxTokens: 6000, timeoutMs: 85_000, model: getBlogModel(), jsonMode: true },
  );
  const part2 = extractContentField(half2);
  const content = markdownToHtml(`${part1}\n${part2}`.trim());

  // Metadata off the finished article (small, fast JSON call, mini model).
  const meta = await generateBlogMeta(content, input.topic, lang);

  return {
    title: meta.title,
    excerpt: meta.excerpt,
    content,
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    cta: meta.cta,
    alternativeTitles: meta.alternativeTitles,
  };
}

/** Strip a leading/trailing ```html … ``` (or ```) code fence the model
 *  sometimes wraps free-form HTML output in. */
function stripCodeFences(s: string): string {
  return s
    .replace(/^\s*```(?:html|json)?\s*\n?/i, "")
    .replace(/\n?\s*```\s*$/i, "")
    .trim();
}

/** Pull the HTML out of a `{ "content": "…" }` JSON response, falling back
 *  to the raw (fence-stripped) text if the model didn't wrap it in JSON. */
function extractContentField(raw: string): string {
  try {
    const p = JSON.parse(raw) as { content?: unknown; html?: unknown };
    const v = p.content ?? p.html;
    if (typeof v === "string" && v.trim()) return v.trim();
  } catch {
    /* not JSON — fall through to the raw text */
  }
  return stripCodeFences(raw).trim();
}

/**
 * Small, cheap JSON call that produces the post's metadata from the
 * already-written article. Runs on the default (mini) model — the meta is
 * short, so it's fast and doesn't need the stronger blog model.
 */
async function generateBlogMeta(
  content: string,
  topic: string,
  lang: Lang,
): Promise<Pick<BlogDraft, "title" | "excerpt" | "metaTitle" | "metaDescription" | "cta" | "alternativeTitles">> {
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2500);
  const system = `${languageLock(lang)}Te SEO-szerkesztő vagy. Egy kész blogcikk alapján készíts metaadatokat ${LANG_NAMES[lang]} nyelven. CSAK JSON-t adj vissza:
{
  "title": "...",                 // SEO cikk-cím, max 65 karakter, figyelemfelkeltő, kulcsszó-gazdag
  "excerpt": "...",               // lead/kivonat, max 200 karakter
  "metaTitle": "...",             // SEO meta cím, max 60 karakter
  "metaDescription": "...",       // meta leírás, 140-155 karakter, olvasói haszonnal
  "cta": "...",                   // 1-2 mondatos, segítő hangú CTA a G2A Marketing felé
  "alternativeTitles": ["...","...","...","...","..."]  // 5 alternatív cím
}`;
  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Téma: ${topic}\n\nA cikk szövege:\n${plain}` },
    ],
    { temperature: 0.6, maxTokens: 900, jsonMode: true },
  );
  try {
    const p = JSON.parse(raw) as Partial<BlogDraft>;
    const alts = Array.isArray(p.alternativeTitles) ? p.alternativeTitles : [];
    return {
      title: p.title?.trim() || topic,
      excerpt: p.excerpt?.trim() || "",
      metaTitle: p.metaTitle?.trim() || p.title?.trim() || topic,
      metaDescription: p.metaDescription?.trim() || "",
      cta: p.cta?.trim() || "",
      alternativeTitles: alts.map((t) => String(t).trim()).filter(Boolean).slice(0, 5),
    };
  } catch {
    return { title: topic, excerpt: "", metaTitle: topic, metaDescription: "", cta: "", alternativeTitles: [] };
  }
}

/**
 * Editorial review pass — takes a freshly generated draft and rewrites
 * it with a human editor's eye. This is phase 2 of our two-pass blog
 * pipeline: phase 1 (generateBlogDraft) hits the structural brief,
 * phase 2 (this function) strips AI tells, tightens transitions,
 * converts excessive bullet lists back to flowing prose, and grounds
 * vague claims with concrete examples.
 *
 * The second pass costs another OpenAI call per locale but produces
 * dramatically better output — single-shot generation tends to hit the
 * structure right but the prose stays "AI-shaped". A separate editorial
 * pass with a fresh prompt and the draft as input lets the model
 * actually critique its own output instead of just continuing it.
 *
 * Returns a refined BlogDraft with the same shape plus an `editorNotes`
 * array (5 short notes about what changed).
 */
async function editorialReview(draft: BlogDraft, lang: Lang): Promise<BlogDraft> {
  const system = `${languageLock(lang)}Te szenior szerkesztő vagy a G2A Marketing pécsi B2B marketing ügynökségnél. Most egy AI által generált blogbejegyzést kapsz felülvizsgálatra.

⚠ KIMENETI NYELV
A teljes válasz ${LANG_NAMES[lang]} nyelven. ${lang === "zh" ? "(必须是简体中文 — Simplified Chinese.)" : lang === "en" ? "(English only.)" : ""}

FELADATOD szerkesztői szemmel javítani a cikket:

1. Törölj vagy írj át minden AI-szagú, általános mondatot. Tipikusan:
   - "napjainkban egyre fontosabb"
   - "kulcsfontosságú szerepet játszik"
   - "számos kihívás áll előttük"
   - "a megfelelő stratégia elengedhetetlen"
   - "összefoglalva", "konklúzióként"
   - "felfedezzük", "elmélyedünk", "feltárjuk"
2. Erősítsd meg a nyitást — ha definícióval kezdődik, írd át életszerű üzleti helyzetre, provokatív állításra vagy gyakori vezetői tévedésre.
3. Javítsd az átvezetéseket a bekezdések között — egyik gondolat vezessen át a másikba, ne legyenek független listák egymás után.
4. Ahol túl listás a szöveg, alakítsd folyó, olvasmányos bekezdéssé. Csak ott hagyj listát, ahol tényleg segíti az olvashatóságot (pl. a "Mit tegyél most?" ellenőrzőlista).
5. Ahol túl általános az állítás, adj hozzá konkrét magyar KKV-kontextusú példát vagy mini-esetet.
6. Ahol túl reklámos a CTA, tedd természetesebbé. A CTA legyen segítő hangú, ne nyomulós.
7. Ellenőrizd, hogy a cikk valóban hasznos-e egy magyar KKV-vezető számára. Ha nincs benne üzleti realitás (költség, kapacitás, kockázat, döntéshozói bizonytalanság), tegyél bele.
8. Változtasd meg a mondathosszokat — legyenek változatosak. Felváltva rövid (3-6 szó) és hosszabb mondatok.

⚠ NE RÖVIDÍTS. TARTSD az 1500-2000 szavas terjedelmet — ha az eredeti draft ennél rövidebb vagy felszínes, BŐVÍTSD (mélyebb magyarázat, konkrét példa, üzleti realitás), ne vágd. NE alakítsd át akadémiai tanulmánnyá. A cél: szakmailag erős, emberi, üzleti pillér-cikk. NE találj ki konkrét statisztikákat vagy számokat, ha az eredeti nem tartalmazta.

⚠ KÖTELEZŐ MEGŐRIZNI (a SEO/GEO struktúra miatt): a <h2>Kulcs tanulságok</h2> lista a bevezető után; a <h2 id="faq">Gyakori kérdések</h2> szekció a cikk végén (a kérdés/válasz párokkal, az id="faq" attribútummal); a "Mit tegyél most?" lépéslista; és minden meglévő <table>. Ezeket ne töröld — legfeljebb csiszold a szövegüket.

⚠ HTML FORMÁTUM
A "content" mező maradjon TISZTA HTML (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">, <table>/<thead>/<tbody>/<tr>/<th>/<td>). NE használj markdown szintaxist. NE add hozzá H1-et.

VÁLASZ FORMÁTUM: CSAK a javított, teljes HTML cikk-törzset add vissza — semmi mást (se JSON, se \`\`\` kód-keret, se magyarázat). A cikk a <h2 id="faq">Gyakori kérdések</h2> szekcióval érjen véget. A H1 főcímet NE tedd bele.`;

  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Javítsd ezt a cikket. A cikk HTML törzse:\n\n${draft.content}` },
    ],
    // Non-JSON so the editor can keep (and expand) the full length — a JSON
    // string field made both models regress to ~700 words. Content only;
    // the metadata from phase 1b is preserved unchanged.
    { temperature: 0.6, maxTokens: 9000, timeoutMs: 110_000, model: getBlogModel() },
  );
  const refined = markdownToHtml(stripCodeFences(raw).trim());
  // Guard against a regression that loses length: keep the original if the
  // "refined" version came back much shorter.
  const content = refined.length > draft.content.length * 0.65 ? refined : draft.content;
  return {
    ...draft,
    content,
    editorNotes: [
      lang === "en"
        ? "Editorial pass: AI-tells removed, transitions tightened, SEO/GEO structure (key takeaways, FAQ, tables) preserved."
        : lang === "zh"
        ? "编辑校订:去除 AI 腔调,优化过渡,保留 SEO/GEO 结构(要点、常见问题、表格)。"
        : "Szerkesztői pass: AI-fordulatok kigyomlálva, átvezetések feszesebbek, a SEO/GEO-struktúra (kulcs tanulságok, GYIK, táblázat) megőrizve.",
    ],
  };
}

/**
 * Generate a blog draft in all three site languages in parallel,
 * each going through the two-pass pipeline:
 *   phase 1 — structural draft (generateBlogDraft)
 *   phase 2 — editorial polish (editorialReview)
 *
 * Wall clock ≈ max(draft) + max(edit) since phase 2 needs phase 1's
 * output. Total OpenAI cost: ~6 calls (3 locales × 2 passes), still
 * well under a few cents on gpt-4o-mini.
 *
 * Progress tracking (opt-in via `jobId`): the admin UI generates a
 * UUID client-side, the mutation passes it here, and we tick the
 * `ai_jobs.completedSteps` counter from 0 → 6 as each OpenAI call
 * resolves. A separate polling endpoint reads the row 1×/second so
 * the modal shows real progress instead of a static spinner.
 *
 * The progress writes are fire-and-forget — a DB hiccup never
 * fails the actual generation. If `jobId` is omitted the pipeline
 * runs unchanged.
 */
export async function generateMultilangBlogDraft(
  input: Omit<BlogDraftInput, "lang">,
  jobId?: string,
): Promise<MultilangBlogDraft> {
  // Lazy dynamic import — ai.ts is imported widely and pulling in
  // the full db module would broaden the bundle for every caller.
  const dbPromise = jobId ? import("../db").catch(() => null) : null;

  let stepsDone = 0;
  const tick = async (phase: "draft" | "editor") => {
    if (!jobId || !dbPromise) return;
    stepsDone++;
    try {
      const db = await dbPromise;
      if (db) await db.updateAiJob(jobId, { phase, completedSteps: stepsDone });
    } catch {
      /* swallow — progress is best-effort */
    }
  };

  // Each locale's draft internally runs two content passes (first half +
  // finish) plus a small metadata pass. The separate editorial phase was
  // folded away: the two-pass content prompt already strips AI-tells and
  // holds the 1500-2000-word length, and dropping it keeps the 3 parallel
  // locales comfortably inside the 300s Vercel budget.
  const [hu, en, zh] = await Promise.all([
    generateBlogDraft({ ...input, lang: "hu" }).then(async (d) => { await tick("draft"); return d; }),
    generateBlogDraft({ ...input, lang: "en" }).then(async (d) => { await tick("draft"); return d; }),
    generateBlogDraft({ ...input, lang: "zh" }).then(async (d) => { await tick("draft"); return d; }),
  ]);

  // Mark the job complete after all three locales land.
  if (jobId && dbPromise) {
    try {
      const db = await dbPromise;
      if (db) await db.updateAiJob(jobId, { status: "completed", completedSteps: 3, phase: "draft" });
    } catch {
      /* swallow */
    }
  }

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
