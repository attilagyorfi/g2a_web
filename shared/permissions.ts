/**
 * Admin permission catalogue — the single source of truth for both the
 * server-side guards (server/routers.ts) and the admin UI (checkbox groups,
 * sidebar filtering).
 *
 * A staff user's `users.permissions` column stores a JSON array of these keys.
 * The owner (ADMIN_EMAIL / `isOwner`) implicitly holds every permission and is
 * never filtered — see `hasPermission`.
 */

export const PERMISSION_KEYS = [
  // Tartalom
  "posts",
  "categories",
  "case_studies",
  "services",
  "industries",
  // Weboldal elemek
  "hero_slides",
  "partners",
  "testimonials",
  "technologies",
  "values",
  // Megkeresések
  "contacts",
  "audit_leads",
  // Marketing
  "newsletter",
  "seo",
  "brand_voice",
  // Rendszer
  "settings",
  "users",
] as const;

export type Permission = (typeof PERMISSION_KEYS)[number];

export type PermissionGroup = {
  title: string;
  hint?: string;
  items: { key: Permission; label: string; desc: string }[];
};

/** Grouped for the "Felhasználó hozzáadása" checkbox UI. */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    title: "Tartalom",
    items: [
      { key: "posts", label: "Blog cikkek", desc: "Cikkek írása, szerkesztése, publikálása" },
      { key: "categories", label: "Kategóriák", desc: "Blog kategóriák kezelése" },
      { key: "case_studies", label: "Esettanulmányok", desc: "Referenciák és partner-esetek" },
      { key: "services", label: "Szolgáltatások", desc: "Szolgáltatás-oldalak tartalma" },
      { key: "industries", label: "Iparágak", desc: "Iparági oldalak" },
    ],
  },
  {
    title: "Weboldal elemek",
    items: [
      { key: "hero_slides", label: "Hero slide-ok", desc: "Főoldali kiemelt sávok" },
      { key: "partners", label: "Partnerek", desc: "Partner-logók a főoldalon" },
      { key: "testimonials", label: "Vélemények", desc: "Ügyfél-vélemények" },
      { key: "technologies", label: "Technológiák", desc: "Technológia-lista" },
      { key: "values", label: "Értékek", desc: "Céges értékek blokk" },
    ],
  },
  {
    title: "Megkeresések",
    hint: "Beérkező személyes adatokat tartalmaz",
    items: [
      { key: "contacts", label: "Kapcsolatfelvételek", desc: "Beérkezett üzenetek olvasása" },
      { key: "audit_leads", label: "Audit kérések", desc: "Ingyenes audit igénylések" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { key: "newsletter", label: "Hírlevél", desc: "Feliratkozók és email kampányok küldése" },
      { key: "seo", label: "SEO oldalak", desc: "Oldal-meta adatok" },
      { key: "brand_voice", label: "Brand voice", desc: "AI hangnem-beállítások" },
    ],
  },
  {
    title: "Rendszer",
    hint: "Csak megbízható munkatársnak",
    items: [
      { key: "settings", label: "Beállítások", desc: "Oldalbeállítások, integrációk, kulcsok" },
      { key: "users", label: "Felhasználók", desc: "Munkatársak meghívása és jogosultságaik" },
    ],
  },
];

/** Sensible starting set for a new content editor. */
export const DEFAULT_PERMISSIONS: Permission[] = ["posts", "categories", "case_studies"];

const VALID = new Set<string>(PERMISSION_KEYS);

/** Parse the stored JSON column into a clean, validated key list. */
export function parsePermissions(raw: unknown): Permission[] {
  if (Array.isArray(raw)) return raw.filter((k): k is Permission => typeof k === "string" && VALID.has(k));
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((k): k is Permission => typeof k === "string" && VALID.has(k));
  } catch {
    return [];
  }
}

/**
 * Permission check used by both layers. Owners bypass the list entirely so an
 * owner can never lock themselves out of their own admin.
 */
export function hasPermission(
  user: { isOwner?: boolean | number | null; permissions?: unknown } | null | undefined,
  permission: Permission,
): boolean {
  if (!user) return false;
  if (user.isOwner) return true;
  return parsePermissions(user.permissions).includes(permission);
}
