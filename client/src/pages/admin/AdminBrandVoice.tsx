/**
 * Brand voice admin — the input that makes every AI text generator
 * (social copy, blog draft, SEO meta, text improve) write in the actual
 * G2A house style instead of generic B2B agency tone.
 *
 * Loaded into the prompt of every generation as a "BRAND CONTEXT" prefix.
 * See `server/_core/brandVoice.ts` for the prompt-render logic.
 *
 * Form structure:
 *   - Company description, audience, tone of voice  → free-form textareas
 *   - Do's / Don'ts                                 → editable list (+ button)
 *   - Few-shot examples per platform                → list of {context?, text}
 *
 * The save mutation overwrites the whole document, so any edit triggers a
 * full re-save — simpler than per-field patching, and the JSON payload is
 * small (~few KB).
 */
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2, MessageSquare, Linkedin, Facebook, Instagram, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Example = { context?: string; text: string };

type BrandVoice = {
  companyDescription: string;
  audience: string;
  toneOfVoice: string;
  dos: string[];
  donts: string[];
  examples: {
    linkedin: Example[];
    facebook: Example[];
    instagram: Example[];
    blog?: Example[];
  };
};

const EMPTY: BrandVoice = {
  companyDescription: "",
  audience: "",
  toneOfVoice: "",
  dos: [],
  donts: [],
  examples: { linkedin: [], facebook: [], instagram: [], blog: [] },
};

const PLACEHOLDERS = {
  companyDescription:
    "B2B marketing ügynökség Pécsen. 2018-ban alapított Bt., fókusz: adatvezérelt kampányok és AI-eszközök magyar KKV-knak és középvállalatoknak. Ügyfeleink között szerepel...",
  audience:
    "Magyar KKV-k és középvállalatok marketing- és értékesítési vezetői (30-55 év). Specifikusan: 20-500 fős cégek, B2B vagy magasabb átlagos kosárértékű B2C piacokon. Általában 1-3M Ft/hó marketing-büdzsével.",
  toneOfVoice:
    "Te-formát használunk. Szakmai, de barátságos hangon. Közvetlen, magyarosan szellemes. Konkrét számokkal és példákkal dolgozunk. Kerüljük a corporate-szakzsargont és a clickbait-et.",
};

const platformIcons = {
  linkedin: <Linkedin size={14} />,
  facebook: <Facebook size={14} />,
  instagram: <Instagram size={14} />,
  blog: <FileText size={14} />,
};

const platformColors = {
  linkedin: "#0a66c2",
  facebook: "#1877f2",
  instagram: "#e1306c",
  blog: "#14b8a6",
};

export default function AdminBrandVoice() {
  const { data, isLoading, refetch } = trpc.admin.brandVoice.get.useQuery();
  const update = trpc.admin.brandVoice.update.useMutation({
    onSuccess: () => {
      toast.success("Brand voice elmentve. A változás azonnal érvényes minden AI-generálásra.");
      refetch();
    },
    onError: (err) => toast.error(`Mentés sikertelen: ${err.message}`),
  });

  const [form, setForm] = useState<BrandVoice>(EMPTY);

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        examples: {
          linkedin: data.examples?.linkedin ?? [],
          facebook: data.examples?.facebook ?? [],
          instagram: data.examples?.instagram ?? [],
          blog: data.examples?.blog ?? [],
        },
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(form);
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.5rem", fontWeight: 700, marginBottom: 6 }}>
          Brand voice
        </h1>
        <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 760 }}>
          Az itt megadott adatok minden AI-generáláskor (social copy, blog draft, SEO meta) bekerülnek a prompt-ba — így a generikus B2B-tone helyett a tényleges G2A-hangon szól. Minél több részletet és konkrét sikeres példát adsz meg, annál hűebb output.
        </p>
      </div>

      {isLoading && (
        <div style={{ color: "#666", fontFamily: "Geist Mono, monospace", padding: "2rem" }}>Betöltés…</div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 920 }}>

          {/* Company description */}
          <Field
            label="Cégleírás"
            help="1-2 bekezdés a cégről, küldetésről, főbb tevékenységekről."
          >
            <textarea
              value={form.companyDescription}
              onChange={(e) => setForm((p) => ({ ...p, companyDescription: e.target.value }))}
              placeholder={PLACEHOLDERS.companyDescription}
              rows={4}
              style={textareaStyle}
            />
          </Field>

          {/* Audience */}
          <Field
            label="Célközönség"
            help="Kihez beszélünk? Demográfia, szektor, döntéshozói szerep, méret."
          >
            <textarea
              value={form.audience}
              onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
              placeholder={PLACEHOLDERS.audience}
              rows={3}
              style={textareaStyle}
            />
          </Field>

          {/* Tone of voice */}
          <Field
            label="Hang / stílus"
            help="Hogyan szólunk? Példa: te-forma, szakmai-de-barátságos, konkrét számokkal."
          >
            <textarea
              value={form.toneOfVoice}
              onChange={(e) => setForm((p) => ({ ...p, toneOfVoice: e.target.value }))}
              placeholder={PLACEHOLDERS.toneOfVoice}
              rows={3}
              style={textareaStyle}
            />
          </Field>

          {/* Do's */}
          <Field label="MINDIG csináld" help="Pozitív irányelvek — az AI minden generálásnál ezeket fogja követni.">
            <BulletList
              items={form.dos}
              placeholder="pl. konkrét magyar piaci példák"
              onChange={(items) => setForm((p) => ({ ...p, dos: items }))}
              accent="#10b981"
            />
          </Field>

          {/* Don'ts */}
          <Field label="SOSE csináld" help="Negatív irányelvek — kerülendő szavak, állítások, klisék.">
            <BulletList
              items={form.donts}
              placeholder="pl. kerüld a 'leverage / synergia' szavakat"
              onChange={(items) => setForm((p) => ({ ...p, donts: items }))}
              accent="#ef4444"
            />
          </Field>

          {/* Examples per platform */}
          {(["linkedin", "facebook", "instagram", "blog"] as const).map((platform) => (
            <Field
              key={platform}
              label={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: platformColors[platform] }}>{platformIcons[platform]}</span>
                  Korábbi sikeres {platform === "blog" ? "blog cikkek" : `${platform} posztok`}
                </span>
              }
              help={`Max 10 példa. Az AI ezeket fogja mintaként venni a ${platform} stílusához. Minél specifikusabb (pl. "best-performer", "kampány-záró"), annál pontosabb az illesztés.`}
            >
              <ExampleList
                items={form.examples[platform] ?? []}
                placeholder={
                  platform === "linkedin"
                    ? "Másold ide a korábbi LinkedIn poszt szövegét…"
                    : platform === "facebook"
                    ? "Másold ide a korábbi Facebook poszt szövegét…"
                    : platform === "instagram"
                    ? "Másold ide a korábbi Instagram caption szövegét…"
                    : "Másold ide egy korábbi blog cikk bevezető részét vagy fő gondolatát…"
                }
                onChange={(items) =>
                  setForm((p) => ({
                    ...p,
                    examples: { ...p.examples, [platform]: items },
                  }))
                }
              />
            </Field>
          ))}

          {/* Submit */}
          <div style={{ position: "sticky", bottom: 0, padding: "1rem", background: "rgba(15,15,15,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="submit"
              disabled={update.isPending}
              className="g2a-btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {update.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Mentés
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────

function Field({ label, help, children }: { label: React.ReactNode; help: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.25rem" }}>
      <div style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.9rem", fontWeight: 600, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#666", fontSize: "0.78rem", marginBottom: "0.875rem", lineHeight: 1.5 }}>
        {help}
      </div>
      {children}
    </div>
  );
}

function BulletList({
  items,
  placeholder,
  onChange,
  accent,
}: {
  items: string[];
  placeholder: string;
  onChange: (items: string[]) => void;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 4, background: accent, borderRadius: 2, flexShrink: 0 }} />
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            style={iconButtonStyle("#ef4444")}
            title="Törlés"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        style={addButtonStyle}
      >
        <Plus size={12} /> Új elem
      </button>
    </div>
  );
}

function ExampleList({
  items,
  placeholder,
  onChange,
}: {
  items: Example[];
  placeholder: string;
  onChange: (items: Example[]) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "0.75rem" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              type="text"
              value={item.context ?? ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...next[i], context: e.target.value };
                onChange(next);
              }}
              placeholder="Opcionális — kontextus (pl. 'kampány-záró poszt', 'best-performer 2025 Q3')"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={iconButtonStyle("#ef4444")}
              title="Törlés"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <textarea
            value={item.text}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], text: e.target.value };
              onChange(next);
            }}
            placeholder={placeholder}
            rows={5}
            style={textareaStyle}
          />
          <div style={{ color: "#555", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem", marginTop: 4, textAlign: "right" }}>
            {item.text.length} karakter
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { context: "", text: "" }])}
        style={addButtonStyle}
      >
        <Plus size={12} /> Új példa
      </button>
    </div>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "#222",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 5,
  padding: "0.55rem 0.75rem",
  color: "#fff",
  fontFamily: "Geist Mono, monospace",
  fontSize: "0.82rem",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  width: "100%",
  lineHeight: 1.55,
  resize: "vertical",
};

const addButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  alignSelf: "flex-start",
  padding: "6px 12px",
  borderRadius: 5,
  background: "rgba(20,184,166,0.12)",
  border: "1px solid rgba(20,184,166,0.3)",
  color: "#5eead4",
  fontFamily: "Geist Mono, monospace",
  fontSize: "0.7rem",
  fontWeight: 600,
  cursor: "pointer",
};

function iconButtonStyle(color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 5,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color,
    cursor: "pointer",
    flexShrink: 0,
  };
}

// Unused but kept for parity with MessageSquare import (could be used for a future
// "compact mode" toggle that shows just the structured fields).
void MessageSquare;
