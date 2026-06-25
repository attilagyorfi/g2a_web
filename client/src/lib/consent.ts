/**
 * Cookie / privacy consent — single source of truth.
 *
 * Storage: localStorage key `g2a_consent_v2` holds a JSON object.
 * Schema bumps require a `version` change so the banner re-prompts.
 *
 * Categories:
 *   - necessary  — always true (admin session, theme, consent record itself)
 *   - functional — locale memory, layout fine-tuning
 *   - thirdParty — Calendly badge / embedded booking widget
 *   - marketing  — Google Analytics 4 + Google Tag Manager + Meta (Facebook)
 *                  Pixel; these tags inject only after this category is granted
 *
 * Components subscribe to changes via the "g2a:consent-change" CustomEvent
 * (detail = full ConsentState). The footer's "Cookie settings" link
 * dispatches "g2a:open-cookie-settings" to re-show the banner.
 */

export type ConsentState = {
  version: number;
  timestamp: string; // ISO 8601 — when the user last decided
  necessary: true; // always
  functional: boolean;
  thirdParty: boolean;
  marketing: boolean;
};

// Bumped 1 → 2 (2026-06): Google Analytics 4 / GTM / Meta Pixel newly
// disclosed and consent-gated under the marketing category — re-prompt
// everyone so prior decisions (made before these tags existed) are refreshed.
export const CONSENT_VERSION = 2;
const STORAGE_KEY = "g2a_consent_v2";
const LEGACY_KEY = "g2a_cookie_consent"; // pre-granular "accepted"|"declined"
export const CONSENT_CHANGE_EVENT = "g2a:consent-change";

export function defaultDeclined(): ConsentState {
  return {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true,
    functional: false,
    thirdParty: false,
    marketing: false,
  };
}

export function defaultAccepted(): ConsentState {
  return {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true,
    functional: true,
    thirdParty: true,
    marketing: true,
  };
}

/**
 * Read consent. Returns `null` when no decision has been made yet — the
 * caller should show the banner. Performs a one-shot migration of the
 * legacy boolean key.
 */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ConsentState;
      // Re-prompt if we bumped the schema (new processor, retention change…)
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    }
  } catch {
    // Corrupt JSON — treat as no decision and let the banner re-prompt.
    return null;
  }

  // Migrate the old boolean cookie consent key
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy === "accepted") {
    const migrated = defaultAccepted();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_KEY);
    return migrated;
  }
  if (legacy === "declined") {
    const migrated = defaultDeclined();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_KEY);
    return migrated;
  }

  return null;
}

export function writeConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const stamped: ConsentState = { ...state, timestamp: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: stamped }),
  );
}

/**
 * Convenience boolean check. Always true for `necessary`. For unknown /
 * missing consent (no decision yet) returns false except for necessary.
 */
export function hasConsent(category: keyof ConsentState): boolean {
  if (category === "necessary") return true;
  const c = readConsent();
  if (!c) return false;
  return Boolean(c[category]);
}
