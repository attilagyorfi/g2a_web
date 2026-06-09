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
};

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
    model: getAiModel(),
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
  // Target 900-1200 words (HubSpot-style B2B post). Hungarian/English
  // ≈ 220 wpm, Chinese ≈ 300 chars/min — both land around 4-6 min read
  // at this length. 1050 is the midpoint we ask for.
  const wordCount = input.wordCount ?? 1050;
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

SZERKEZET (kötelező):

1. CÍM (SEO cím) — figyelemfelkeltő, konkrét, üzleti szempontból releváns; max 65 karakter; NE legyen általános.
2. META LEÍRÁS — max 155 karakter; tartalmazza a fő problémát és az olvasói hasznot.
3. KIVONAT (lead) — 1-2 mondat (max 200 karakter), a teljes cikk lényege.
4. BEVEZETŐ (a content elején) — 2-3 bekezdés. NE definícióval kezdj. Kezdj egy életszerű üzleti helyzettel, provokatív megállapítással vagy gyakori vezetői tévedéssel. Mutasd meg, miért fontos a téma a célközönségnek.
5. FŐ RÉSZ — 5-7 nagyobb tartalmi blokk (<h2> alfejezet). Minden blokkban:
   - erős, konkrét alcím
   - magyarázd el a problémát emberi, üzleti nyelven
   - adj konkrét példát vagy tipikus magyar KKV-helyzetet
   - írd le, mit érdemes másképp csinálni
   - kerüld a túl hosszú felsorolásokat
   NE írj minden ponthoz külön "tippek" listát. Csak akkor használj <ul>/<ol> listát, ha tényleg segíti az olvashatóságot. A cikk alapvetően folyó, összefüggő szöveg legyen.
6. GYAKORLATI RÉSZ (utolsó előtti blokk) — "Mit tegyél most?" alcím alatt egy rövid <ol> ellenőrzőlista 4-6 konkrét lépéssel.
7. ZÁRÁS (utolsó <h2>) — NE általános motivációs mondattal zárj. Foglald össze erős szakmai állítással, mi a téma valódi tanulsága. A végén legyen természetes, NEM tolakodó CTA a G2A Marketing felé. CTA példa: "Ha szeretnéd látni, hogy a te céged esetében hol akad el a növekedés, a G2A Marketing segít feltérképezni a piacot, az üzeneteket és a digitális jelenlét gyenge pontjait."

⚠ TERJEDELEM: ${wordCount} szó (a 900-1200 sávban). Ne rövidíts. Ne túlozz, ne ígérj garantált sikert.

⚠ HTML FORMÁTUM (content mező)
A "content" mezőben TISZTA HTML markup. SZIGORÚAN TILOS markdown szintaxis ("##", "**...**", "- ", backtick). A BlogPostPage \`dangerouslySetInnerHTML\`-lel rendereli — a markdown szóról szóra megjelenne.

Engedett tagek: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">.
NE add hozzá a H1-et — azt a cikk \`title\` mezője adja.
Minden bekezdést <p>...</p> tag fogjon közre.

KIMENETI JSON — CSAK ezt a sémát add vissza:
{
  "title": "...",                     // SEO cím, max 65 karakter
  "excerpt": "...",                   // Lead / kivonat, max 200 karakter
  "content": "<p>...</p>...",         // Teljes HTML blogbejegyzés, ~${wordCount} szó, a CTA-val a végén
  "metaTitle": "...",                 // SEO meta cím, max 60 karakter
  "metaDescription": "...",           // Meta leírás, 140-155 karakter
  "cta": "...",                       // A javasolt CTA mondatban-két mondatban (ugyanaz, ami a content végén szerepel)
  "alternativeTitles": ["...", "...", "...", "...", "..."]  // 5 alternatív címötlet
}
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
  const rawAlts = Array.isArray(parsed.alternativeTitles) ? parsed.alternativeTitles : [];
  return {
    title: parsed.title?.trim() ?? "",
    excerpt: parsed.excerpt?.trim() ?? "",
    content: markdownToHtml(parsed.content?.trim() ?? ""),
    metaTitle: parsed.metaTitle?.trim() ?? "",
    metaDescription: parsed.metaDescription?.trim() ?? "",
    cta: parsed.cta?.trim() ?? "",
    // Defensive: take up to 5 strings, trim each, drop empties.
    alternativeTitles: rawAlts.map((t) => String(t).trim()).filter(Boolean).slice(0, 5),
  };
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

NE rövidítsd túl a cikket — TARTSD a 900-1200 szavas terjedelmet. NE alakítsd át akadémiai tanulmánnyá. A cél: szakmailag erős, emberi, üzleti blogbejegyzés. NE találj ki konkrét statisztikákat vagy számokat, ha az eredeti cikk nem tartalmazta.

⚠ HTML FORMÁTUM
A "content" mező maradjon TISZTA HTML (<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">). NE használj markdown szintaxist. NE add hozzá H1-et.

KIMENETI JSON — ugyanaz a séma, mint az eredeti, plusz egy "editorNotes" tömb:
{
  "title": "...",
  "excerpt": "...",
  "content": "<p>...</p>...",
  "metaTitle": "...",
  "metaDescription": "...",
  "cta": "...",
  "alternativeTitles": ["...", "...", "...", "...", "..."],
  "editorNotes": ["...", "...", "...", "...", "..."]  // 5 rövid megjegyzés arról, MIT javítottál (max 1 mondat/jegyzet)
}`;

  const userPayload = JSON.stringify({
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    cta: draft.cta,
    alternativeTitles: draft.alternativeTitles,
  });

  const raw = await chat(
    [
      { role: "system", content: system },
      { role: "user", content: `Vizsgáld felül és javítsd ezt a draft-ot:\n\n${userPayload}` },
    ],
    { temperature: 0.6, maxTokens: 6000, jsonMode: true },
  );

  let parsed: BlogDraft & { editorNotes?: string[] };
  try {
    parsed = JSON.parse(raw) as BlogDraft & { editorNotes?: string[] };
  } catch {
    // If the editor pass returns bad JSON, fall back to the original
    // draft rather than blowing up — the structural pass already gave
    // us usable output.
    return draft;
  }

  const rawAlts = Array.isArray(parsed.alternativeTitles) ? parsed.alternativeTitles : draft.alternativeTitles;
  const rawNotes = Array.isArray(parsed.editorNotes) ? parsed.editorNotes : [];
  return {
    title: parsed.title?.trim() || draft.title,
    excerpt: parsed.excerpt?.trim() || draft.excerpt,
    content: markdownToHtml((parsed.content?.trim() || draft.content) ?? ""),
    metaTitle: parsed.metaTitle?.trim() || draft.metaTitle,
    metaDescription: parsed.metaDescription?.trim() || draft.metaDescription,
    cta: parsed.cta?.trim() || draft.cta,
    alternativeTitles: rawAlts.map((t) => String(t).trim()).filter(Boolean).slice(0, 5),
    editorNotes: rawNotes.map((n) => String(n).trim()).filter(Boolean).slice(0, 5),
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
 */
export async function generateMultilangBlogDraft(
  input: Omit<BlogDraftInput, "lang">,
): Promise<MultilangBlogDraft> {
  // Phase 1: structural drafts in parallel.
  const [huDraft, enDraft, zhDraft] = await Promise.all([
    generateBlogDraft({ ...input, lang: "hu" }),
    generateBlogDraft({ ...input, lang: "en" }),
    generateBlogDraft({ ...input, lang: "zh" }),
  ]);
  // Phase 2: editorial review in parallel.
  const [hu, en, zh] = await Promise.all([
    editorialReview(huDraft, "hu"),
    editorialReview(enDraft, "en"),
    editorialReview(zhDraft, "zh"),
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
