/**
 * Brand voice profile — loaded from `site_settings.brand_voice` JSON blob.
 *
 * Used by every AI text generator (`socialCopy`, `generateBlogDraft`,
 * `improveText`) to inject company context, tone, do/don'ts, and few-shot
 * example posts into the prompt. This is the difference between generic
 * "B2B marketing agency" output and copy that sounds like the actual brand.
 *
 * Stored as JSON to avoid a per-field migration every time we add a new
 * input. The admin UI maps the structured form back to this shape.
 *
 * Falls back to `null` gracefully so the AI helpers still work (with the
 * generic prompt) if brand voice isn't configured yet.
 */
import * as db from "../db";

export type BrandVoiceExample = {
  /** Context for the AI ("Posted on launch day", "best-performer Q3 2025"). */
  context?: string;
  /** The actual published copy that worked. */
  text: string;
};

export type BrandVoice = {
  /** 1-2 paragraph description of the company. */
  companyDescription: string;
  /** Who the content is written for. */
  audience: string;
  /** Tone of voice notes — first-person guidance for the model. */
  toneOfVoice: string;
  /** Positive guidance — things we always do. */
  dos: string[];
  /** Negative guidance — things to avoid. */
  donts: string[];
  /** Few-shot examples per platform — direct samples for the AI to mimic. */
  examples: {
    linkedin: BrandVoiceExample[];
    facebook: BrandVoiceExample[];
    instagram: BrandVoiceExample[];
    blog?: BrandVoiceExample[];
  };
};

export const EMPTY_BRAND_VOICE: BrandVoice = {
  companyDescription: "",
  audience: "",
  toneOfVoice: "",
  dos: [],
  donts: [],
  examples: { linkedin: [], facebook: [], instagram: [], blog: [] },
};

const SETTING_KEY = "brand_voice";

/** Load brand voice from DB. Returns `null` (NOT defaults) so callers can
 *  decide whether to use the generic prompt or fail. */
export async function loadBrandVoice(): Promise<BrandVoice | null> {
  // `getSiteSetting` returns the raw `value` string (or null), not the row.
  const raw = await db.getSiteSetting(SETTING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<BrandVoice>;
    // Defensive defaults — older saves might be missing fields
    return {
      companyDescription: parsed.companyDescription ?? "",
      audience: parsed.audience ?? "",
      toneOfVoice: parsed.toneOfVoice ?? "",
      dos: Array.isArray(parsed.dos) ? parsed.dos : [],
      donts: Array.isArray(parsed.donts) ? parsed.donts : [],
      examples: {
        linkedin: parsed.examples?.linkedin ?? [],
        facebook: parsed.examples?.facebook ?? [],
        instagram: parsed.examples?.instagram ?? [],
        blog: parsed.examples?.blog ?? [],
      },
    };
  } catch (err) {
    console.warn("[brandVoice] Failed to parse brand_voice setting:", err);
    return null;
  }
}

export async function saveBrandVoice(voice: BrandVoice): Promise<void> {
  await db.upsertSiteSetting(SETTING_KEY, JSON.stringify(voice));
}

/**
 * Render the brand-voice context as a system-prompt prefix. Callers
 * concatenate this in front of their platform-specific instructions.
 *
 * `platform` parameter selects which examples to surface — only the relevant
 * platform's few-shot samples land in the prompt (otherwise irrelevant
 * examples would just confuse the model).
 *
 * Returns an empty string when brand voice isn't configured — the AI
 * helper then falls back to its generic baseline prompt.
 */
export function renderBrandContext(
  voice: BrandVoice | null,
  platform?: "linkedin" | "facebook" | "instagram" | "blog",
): string {
  if (!voice) return "";

  const sections: string[] = ["=== BRAND KONTEXTUS ==="];

  if (voice.companyDescription.trim()) {
    sections.push(`CÉGLEÍRÁS:\n${voice.companyDescription.trim()}`);
  }
  if (voice.audience.trim()) {
    sections.push(`CÉLKÖZÖNSÉG:\n${voice.audience.trim()}`);
  }
  if (voice.toneOfVoice.trim()) {
    sections.push(`HANG / STÍLUS:\n${voice.toneOfVoice.trim()}`);
  }
  if (voice.dos.length > 0) {
    sections.push(`MINDIG csináld:\n${voice.dos.map((d) => `- ${d}`).join("\n")}`);
  }
  if (voice.donts.length > 0) {
    sections.push(`SOSE csináld:\n${voice.donts.map((d) => `- ${d}`).join("\n")}`);
  }

  if (platform) {
    const examples = voice.examples[platform] ?? [];
    if (examples.length > 0) {
      const exampleText = examples
        .map((e, i) => {
          const header = e.context
            ? `--- Példa ${i + 1} (${e.context}) ---`
            : `--- Példa ${i + 1} ---`;
          return `${header}\n${e.text.trim()}`;
        })
        .join("\n\n");
      sections.push(
        `KORÁBBI SIKERES ${platform.toUpperCase()} POSZTOK (ezeket vedd mintaként a stílushoz, NE másold szó szerint):\n\n${exampleText}`,
      );
    }
  }

  sections.push("=== /BRAND KONTEXTUS ===\n");
  return sections.join("\n\n");
}
