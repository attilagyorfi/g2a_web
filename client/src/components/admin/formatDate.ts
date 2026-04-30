/**
 * Unified date formatters for admin lists. Three forms:
 *   - `formatAdminDate(d)`        → "2026.04.21" (compact, table cells)
 *   - `formatAdminDateTime(d)`    → "2026.04.21 14:32" (with time, detail views)
 *   - `formatAdminRelative(d)`    → "5 perce", "3 napja" (recent activity)
 *
 * All accept `Date | string | null | undefined`. Returns "—" for missing values.
 */
type DateInput = Date | string | number | null | undefined;

function toDate(v: DateInput): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatAdminDate(v: DateInput): string {
  const d = toDate(v);
  if (!d) return "—";
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function formatAdminDateTime(v: DateInput): string {
  const d = toDate(v);
  if (!d) return "—";
  return `${formatAdminDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const RELATIVE_THRESHOLDS: Array<[number, (n: number) => string]> = [
  [60, (n) => `${n} mp${n === 1 ? "" : ""}`],
  [60 * 60, (n) => `${n} perce`],
  [24 * 60 * 60, (n) => `${n} órája`],
  [7 * 24 * 60 * 60, (n) => `${n} napja`],
  [30 * 24 * 60 * 60, (n) => `${n} hete`],
  [365 * 24 * 60 * 60, (n) => `${n} hónapja`],
];

export function formatAdminRelative(v: DateInput): string {
  const d = toDate(v);
  if (!d) return "—";
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 30) return "most";
  for (const [threshold, fn] of RELATIVE_THRESHOLDS) {
    if (diffSec < threshold) {
      const prev = RELATIVE_THRESHOLDS[RELATIVE_THRESHOLDS.indexOf([threshold, fn] as never) - 1];
      const divisor = prev ? prev[0] : 1;
      return fn(Math.floor(diffSec / divisor));
    }
  }
  return formatAdminDate(d);
}
