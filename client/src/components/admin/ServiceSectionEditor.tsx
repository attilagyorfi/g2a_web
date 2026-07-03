import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

/** A localized subfield value. */
export type LocStr = { hu?: string; en?: string; zh?: string };

type FieldDef = {
  key: string;
  label: string;
  /** Render as a textarea instead of a single-line input. */
  textarea?: boolean;
  /** Non-localized plain string (e.g. the process step "01"). */
  plain?: boolean;
};

type Props = {
  label: string;
  hint?: string;
  /** Array of item objects. Localized fields are `{hu,en,zh}`, plain fields are strings. */
  items: Record<string, unknown>[];
  fields: FieldDef[];
  onChange: (items: Record<string, unknown>[]) => void;
  /** Factory for a fresh blank item. */
  emptyItem: () => Record<string, unknown>;
};

const LANGS: Array<{ code: "hu" | "en" | "zh"; label: string }> = [
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", backgroundColor: "#222", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 5, padding: "0.5rem 0.7rem", color: "#fff",
  fontFamily: "Geist Mono, monospace", fontSize: "0.82rem", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", color: "#888", fontSize: "0.68rem", textTransform: "uppercase",
  letterSpacing: "0.05em", marginBottom: "0.3rem", fontFamily: "Geist Mono, monospace",
};

/**
 * Repeatable, inline-localized list editor for the service-detail sections
 * (benefits / process / faq). Each item carries its localized subfields as
 * `{ hu, en, zh }` objects so the three languages can never drift out of sync
 * row-wise. Emits the full updated array on every keystroke.
 */
export default function ServiceSectionEditor({ label, hint, items, fields, onChange, emptyItem }: Props) {
  const update = (idx: number, mutate: (item: Record<string, unknown>) => void) => {
    const next = items.map((it) => ({ ...it }));
    mutate(next[idx]);
    onChange(next);
  };
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, emptyItem()]);

  return (
    <div style={{ gridColumn: "1/-1", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "1rem", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
        <label style={{ ...labelStyle, marginBottom: 0, color: "#bbb", fontSize: "0.8rem" }}>{label} <span style={{ color: "#555" }}>({items.length})</span></label>
        {hint && <span style={{ color: "#666", fontSize: "0.7rem", fontFamily: "Geist Mono, monospace" }}>{hint}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "0.75rem", background: "#161616" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <span style={{ color: "var(--g2a-brand-teal)", fontFamily: "Geist Mono, monospace", fontSize: "0.72rem" }}>#{idx + 1}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0} title="Fel" style={{ background: "none", border: "none", color: idx === 0 ? "#444" : "#888", cursor: idx === 0 ? "default" : "pointer", display: "flex" }}><ChevronUp size={14} /></button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} title="Le" style={{ background: "none", border: "none", color: idx === items.length - 1 ? "#444" : "#888", cursor: idx === items.length - 1 ? "default" : "pointer", display: "flex" }}><ChevronDown size={14} /></button>
                <button type="button" onClick={() => remove(idx)} title="Törlés" style={{ background: "none", border: "none", color: "#666", cursor: "pointer", display: "flex" }} onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {fields.map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.plain ? (
                    <input
                      value={String(item[f.key] ?? "")}
                      onChange={(e) => update(idx, (it) => { it[f.key] = e.target.value; })}
                      style={{ ...inputStyle, maxWidth: 120 }}
                    />
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                      {LANGS.map((lng) => {
                        const v = (item[f.key] as LocStr) || {};
                        return f.textarea ? (
                          <textarea
                            key={lng.code}
                            value={v[lng.code] ?? ""}
                            onChange={(e) => update(idx, (it) => { it[f.key] = { ...(it[f.key] as LocStr), [lng.code]: e.target.value }; })}
                            placeholder={lng.label}
                            rows={2}
                            style={{ ...inputStyle, resize: "vertical" }}
                          />
                        ) : (
                          <input
                            key={lng.code}
                            value={v[lng.code] ?? ""}
                            onChange={(e) => update(idx, (it) => { it[f.key] = { ...(it[f.key] as LocStr), [lng.code]: e.target.value }; })}
                            placeholder={lng.label}
                            style={inputStyle}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 5, color: "var(--g2a-brand-teal)", cursor: "pointer", padding: "7px 12px", fontFamily: "Geist Mono, monospace", fontSize: "0.78rem" }}
      >
        <Plus size={14} /> Új elem
      </button>
    </div>
  );
}
