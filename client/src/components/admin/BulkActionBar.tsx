/**
 * Sticky bar that appears when one or more rows are selected in an admin list.
 * Shows the count + a destructive action button + a clear-selection button.
 *
 * Designed to slide in from the top so it doesn't reflow the table layout.
 */
import { ReactNode } from "react";
import { CheckSquare, Trash2, X, Loader2 } from "lucide-react";

type Props = {
  count: number;
  itemLabel: string; // e.g. "kiválasztott feliratkozó"
  onClear: () => void;
  onDelete: () => void | Promise<void>;
  deleting?: boolean;
  /** Optional extra actions (e.g. mark all read). */
  extraActions?: ReactNode;
};

export default function BulkActionBar({ count, itemLabel, onClear, onDelete, deleting, extraActions }: Props) {
  if (count === 0) return null;
  return (
    <div
      role="region"
      aria-label="Tömeges műveletek"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        background: "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(20,184,166,0.08))",
        border: "1px solid rgba(20,184,166,0.4)",
        borderRadius: 8,
        backdropFilter: "blur(12px)",
        boxShadow: "0 12px 28px -12px rgba(20,184,166,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        animation: "fadeInUp 0.18s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--g2a-brand-teal)", fontFamily: "Geist Mono, monospace", fontSize: "0.82rem", fontWeight: 600 }}>
        <CheckSquare size={16} />
        <span>{count} {itemLabel}</span>
      </div>
      <div style={{ flex: 1 }} />
      {extraActions}
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 5,
          background: deleting ? "rgba(239,68,68,0.3)" : "#ef4444",
          border: "none",
          color: "#fff",
          cursor: deleting ? "wait" : "pointer",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        {deleting ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <Trash2 size={13} />}
        {deleting ? "Törlés..." : "Kijelöltek törlése"}
      </button>
      <button
        type="button"
        onClick={onClear}
        title="Kijelölés törlése"
        style={{
          padding: "6px 10px",
          borderRadius: 5,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--g2a-text-muted)",
          cursor: "pointer",
          fontFamily: "Geist Mono, monospace",
          fontSize: "0.7rem",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <X size={12} /> Mégse
      </button>
    </div>
  );
}

/**
 * Tri-state checkbox header used in the column-1 cell of selectable tables.
 * Renders a `-` when partially selected, ✓ when fully selected, empty otherwise.
 */
export function BulkSelectAllCheckbox({
  allSelected,
  someSelected,
  onToggle,
}: {
  allSelected: boolean;
  someSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={allSelected}
      ref={(el) => { if (el) el.indeterminate = someSelected; }}
      onChange={onToggle}
      aria-label={allSelected ? "Kijelölés törlése" : "Mind kijelölése"}
      style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--g2a-brand-teal)" }}
    />
  );
}

export function BulkSelectCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      onClick={(e) => e.stopPropagation()}
      aria-label={checked ? "Kijelölés visszavonása" : "Kijelölés"}
      style={{ width: 15, height: 15, cursor: "pointer", accentColor: "var(--g2a-brand-teal)" }}
    />
  );
}
