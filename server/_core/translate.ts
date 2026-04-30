/**
 * Translation bridge — DeepL API.
 *
 * Env:
 *   DEEPL_API_KEY           API key from deepl.com (free tier = api-free.deepl.com host)
 *   DEEPL_API_URL           (optional) override; auto-chosen based on key suffix
 *
 * DeepL free keys end with ":fx" — we route those to the free endpoint.
 *
 * Supported language pairs in use here: HU → EN, HU → ZH.
 * Returns the original text when the key is missing (callers surface a toast).
 */

type DeeplResponse = {
  translations: { detected_source_language: string; text: string }[];
};

export type TranslateTarget = "en" | "zh";

const DEEPL_FREE_HOST = "https://api-free.deepl.com/v2/translate";
const DEEPL_PRO_HOST = "https://api.deepl.com/v2/translate";

export function isTranslateConfigured(): boolean {
  return !!process.env.DEEPL_API_KEY;
}

export async function translate(
  text: string,
  target: TranslateTarget,
  sourceLang: "hu" = "hu",
): Promise<string> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) {
    throw new Error("DEEPL_API_KEY not set — auto-translate is disabled");
  }
  const trimmed = text.trim();
  if (!trimmed) return "";

  const host =
    process.env.DEEPL_API_URL ||
    (key.endsWith(":fx") ? DEEPL_FREE_HOST : DEEPL_PRO_HOST);

  const body = new URLSearchParams();
  body.set("text", trimmed);
  body.set("source_lang", sourceLang.toUpperCase());
  body.set("target_lang", target === "zh" ? "ZH" : "EN-US");
  // Preserve HTML when content contains tags — DeepL will keep them intact
  if (/<[a-z][^>]*>/i.test(trimmed)) body.set("tag_handling", "html");

  const res = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`DeepL ${res.status}: ${errorText.slice(0, 200) || res.statusText}`);
  }

  const data = (await res.json()) as DeeplResponse;
  return data.translations[0]?.text ?? "";
}
