import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert any thrown value (tRPC / Zod / plain Error) into a user-readable string.
 *
 * Handles three common shapes:
 *  1. tRPC client error with `data.zodError.fieldErrors` (preferred — set when the
 *     server uses an errorFormatter that exposes Zod issues).
 *  2. A message that is itself a JSON-encoded array of Zod issues (the default
 *     when the server has no custom formatter — the case showing in our toasts).
 *  3. A plain `Error` with a normal message.
 *
 * Returns multi-line "• issue 1 \n • issue 2" for multiple validation errors,
 * or a single-line message otherwise. Falls back to `fallback`.
 */
export function parseFormError(err: unknown, fallback = "Hiba történt — próbáld újra."): string {
  // tRPC client error → data.zodError.fieldErrors: Record<string, string[]>
  if (err && typeof err === "object" && "data" in err) {
    const data = (err as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } }).data;
    const fieldErrors = data?.zodError?.fieldErrors;
    if (fieldErrors) {
      const flat = Object.values(fieldErrors).flat().filter(Boolean);
      if (flat.length > 0) return flat.length === 1 ? flat[0] : flat.map((m) => `• ${m}`).join("\n");
    }
  }

  if (err instanceof Error) {
    const raw = err.message?.trim();
    if (!raw) return fallback;

    // Looks like a JSON Zod issue array? Parse and extract messages.
    if (raw.startsWith("[") && raw.includes('"message"')) {
      try {
        const issues = JSON.parse(raw) as Array<{ message?: string }>;
        if (Array.isArray(issues)) {
          const msgs = issues.map((i) => i?.message).filter((m): m is string => Boolean(m));
          if (msgs.length === 1) return msgs[0];
          if (msgs.length > 1) return msgs.map((m) => `• ${m}`).join("\n");
        }
      } catch {
        /* fall through to raw message */
      }
    }
    return raw;
  }

  return fallback;
}
