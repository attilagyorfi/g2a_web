/**
 * Generate platform-specific social media copy for a blog post.
 *
 * Each platform has different norms — character limits, hashtag conventions,
 * tone, link-handling, emoji density — so we prompt OpenAI separately per
 * platform with a tight system message that codifies house style + the
 * platform's specific best practices.
 *
 * Inputs we feed the model:
 *   - title + excerpt + first ~500 chars of content (stripped to plain text)
 *   - the canonical blog URL
 *   - the platform key
 *
 * Returns a single string ready to paste/post. The admin UI shows it in a
 * textarea so the user can tweak before saving as a draft.
 */
import { Lang } from "./ai";
import { loadBrandVoice, renderBrandContext } from "./brandVoice";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type Platform = "linkedin" | "facebook" | "instagram";

export type GenerateSocialCopyInput = {
  platform: Platform;
  title: string;
  excerpt?: string | null;
  /** Plain-text or HTML excerpt of the article — model converts as needed. */
  content?: string | null;
  url: string;
  /** Optional locale for the copy. Defaults to Hungarian. */
  lang?: Lang;
};

const PLATFORM_PROMPTS: Record<Platform, (lang: string) => string> = {
  linkedin: (lang) => `Te a G2A Marketing LinkedIn copy-írója vagy — magyar B2B marketing ügynökség Pécsen. ${lang === "hu" ? "Magyarul írj." : lang === "en" ? "Write in English." : "用中文写作。"}

Cél: egy LinkedIn poszt, amely egy új blog cikkre hívja fel a figyelmet, de nem clickbait — érdemi inzájt-ot is hordoz a cikkből.

STRUKTÚRA (pontosan kövesd):
1. ELSŐ MONDAT: erős hook — egy meglepő statisztika, kérdés, vagy provokatív megfigyelés a témáról. Maximum 12 szó. Ez fog megjelenni a feed-en a "...see more" előtt.
2. ÜRES SOR
3. 3-5 mondatos érdemi szöveg: röviden összefoglalja a cikk fő gondolatát + 1-2 konkrét takeaway-t. Te-formát használj. Konkrét számok, példák ha vannak.
4. ÜRES SOR
5. CTA: "Részletek a cikkben:" + a teljes URL
6. ÜRES SOR
7. 4-6 releváns hashtag — kis betűk, magyar B2B-relevánsak (#b2bmarketing, #marketing, #aimarketing, stb.). Speciális témákhoz iparági hashtag.

SZABÁLYOK:
- Hossz: 800-1300 karakter (közepes-hosszú LinkedIn poszt mély-engagement-hez)
- NE használj emoji-t (B2B context, professzionális hang)
- NE használj clickbait-et ("This will SHOCK you!" stb.)
- NE emlegesd magunkat ("a G2A...", "csapatunk...") — a céges page-en posztolunk, ez nyilvánvaló
- NE rakj ## vagy ** formázást
- KIZÁRÓLAG a kész poszt-szöveget add vissza, semmi magyarázat`,

  facebook: (lang) => `Te a G2A Marketing Facebook copy-írója vagy. ${lang === "hu" ? "Magyarul írj." : lang === "en" ? "Write in English." : "用中文写作。"}

Cél: egy Facebook poszt egy új blog cikkről. Facebook-on a copy rövid, beszélgetős, érzelmesebb mint LinkedIn-en.

STRUKTÚRA:
1. ELSŐ MONDAT/KÉRDÉS: egy konkrét kérdés vagy állítás ami az olvasót a saját helyzetébe helyezi (max 15 szó).
2. ÜRES SOR
3. 2-3 mondat: röviden összefoglalja a cikk fő üzenetét, miért érdemes elolvasni.
4. ÜRES SOR
5. CTA: "👉 Olvasd el a cikket:" + a teljes URL
6. ÜRES SOR
7. 2-3 releváns hashtag (Facebook-on a hashtag-ek visszafogottabbak mint Instagram-on)

SZABÁLYOK:
- Hossz: 300-500 karakter (Facebook algoritmusa a rövidebb posztokat preferálja)
- 1-2 emoji OK, de ne légy túlzott
- Beszélgetős, közvetlen hangnem (te-forma)
- NE emlegesd magunkat ("a G2A...", "csapatunk...")
- KIZÁRÓLAG a kész poszt-szöveget add vissza, semmi magyarázat`,

  instagram: (lang) => `Te a G2A Marketing Instagram copy-írója vagy. ${lang === "hu" ? "Magyarul írj." : lang === "en" ? "Write in English." : "用中文写作。"}

Cél: egy Instagram caption egy új blog cikkről. Instagram-on a tipográfia + emoji + hashtag dominál.

STRUKTÚRA:
1. ELSŐ SOR (the "hook"): emoji + figyelemfelkeltő mondat (max 10 szó). Az Instagram a "...more" előtt csak ezt mutatja.
2. ÜRES SOR
3. 2-4 rövid bekezdés, mindegyik 1-2 mondat. Soronként 1-1 emoji a sorok elején (✨ 💡 🔥 📊 stb.). Magyarázza a cikk értékét, fő insight-jait.
4. ÜRES SOR
5. CTA: "🔗 A linket a bio-ban találod / Részletek: [URL]" (Instagram nem klikkelheti a linkeket a captionben, de tegyük be a teljes URL-t).
6. ÜRES SOR
7. 8-15 releváns hashtag — keverve szélesebb (#marketing #b2b) és niche (#aimarketing #kkvmarketing #pécs) hashtag-eket.

SZABÁLYOK:
- Hossz: 800-1500 karakter
- Emoji-k bőven (sortörés, hangsúly)
- Te-forma, baráti hangnem
- NE emlegesd magunkat névvel
- KIZÁRÓLAG a kész caption-t add vissza`,
};

/** Strip HTML, trim to ~500 chars — keeps the prompt input manageable. */
function summarizeContent(html: string | null | undefined, maxChars = 500): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const period = cut.lastIndexOf(".");
  return period > maxChars - 100 ? cut.slice(0, period + 1) : cut.trimEnd() + "…";
}

export async function generateSocialCopy(input: GenerateSocialCopyInput): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");

  const lang = input.lang ?? "hu";
  // Brand voice — loaded fresh on every call so admin edits take effect
  // immediately without restarting the server. Falls back to "" if not
  // configured (the platform-specific prompt still produces reasonable output).
  const brandVoice = await loadBrandVoice();
  const brandContext = renderBrandContext(brandVoice, input.platform);
  const platformPrompt = PLATFORM_PROMPTS[input.platform](lang);
  const system = brandContext
    ? `${brandContext}\n\n${platformPrompt}`
    : platformPrompt;

  const userParts = [
    `BLOG CIKK CÍME: ${input.title}`,
    input.excerpt ? `LEAD/EXCERPT: ${input.excerpt}` : "",
    input.content ? `CIKK TARTALMÁNAK ÖSSZEFOGLALÓJA (első ~500 karakter):\n${summarizeContent(input.content)}` : "",
    `URL: ${input.url}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userParts },
      ],
      // Slightly higher temp for social copy — these benefit from variety
      temperature: 0.75,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 300) || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("OpenAI returned empty copy");

  // Strip surrounding code-fence / quotes if the model wrapped them. The
  // `[\s\S]*?` makes the dot match newlines without needing the `s` regex
  // flag (which requires ES2018+ target).
  return text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/\n?```$/i, "")
    .replace(/^["']([\s\S]*)["']$/, "$1")
    .trim();
}
