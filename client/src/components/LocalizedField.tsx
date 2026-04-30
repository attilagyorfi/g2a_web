import { useState, CSSProperties, ReactNode } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { parseFormError } from "@/lib/utils";
import { useConfirm } from "@/components/ConfirmDialog";

type ImproveMode = "tighten" | "expand" | "rephrase";
const IMPROVE_LABELS: Record<ImproveMode, string> = {
  tighten: "Tömörítés",
  expand: "Bővítés",
  rephrase: "Átfogalmazás",
};

type Lang = "hu" | "en" | "zh";

const LANG_LABELS: Record<Lang, { label: string; flag: string }> = {
  hu: { label: "Magyar", flag: "🇭🇺" },
  en: { label: "English", flag: "🇬🇧" },
  zh: { label: "中文", flag: "🇨🇳" },
};

type Props<T extends Record<string, unknown>> = {
  label: ReactNode;
  /** Base field name, e.g. "title". EN reads `${field}En`, ZH reads `${field}Zh`. */
  field: keyof T & string;
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  type?: "text" | "textarea" | "rich";
  placeholder?: string;
  placeholderEn?: string;
  placeholderZh?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
  style?: CSSProperties;
};

export default function LocalizedField<T extends Record<string, unknown>>({
  label,
  field,
  form,
  setForm,
  type = "text",
  placeholder,
  placeholderEn,
  placeholderZh,
  required,
  rows = 4,
  hint,
  style,
}: Props<T>) {
  const confirm = useConfirm();
  const [activeLang, setActiveLang] = useState<Lang>("hu");
  const [improveOpen, setImproveOpen] = useState(false);
  const translateStatus = trpc.admin.translate.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const translateMutation = trpc.admin.translate.run.useMutation();
  const aiStatus = trpc.admin.ai.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const improveMutation = trpc.admin.ai.improveText.useMutation();

  const fieldMap: Record<Lang, string> = {
    hu: field,
    en: `${field}En`,
    zh: `${field}Zh`,
  };

  const placeholderMap: Record<Lang, string | undefined> = {
    hu: placeholder,
    en: placeholderEn ?? placeholder,
    zh: placeholderZh ?? placeholder,
  };

  const currentKey = fieldMap[activeLang];
  const rawValue = (form as Record<string, unknown>)[currentKey];
  const currentValue = typeof rawValue === "string" ? rawValue : "";

  const huValue = (() => {
    const v = (form as Record<string, unknown>)[field];
    return typeof v === "string" ? v : "";
  })();

  const handleChange = (value: string) => {
    setForm((prev) => ({ ...prev, [currentKey]: value }) as T);
  };

  const hasValue = (lang: Lang): boolean => {
    const v = (form as Record<string, unknown>)[fieldMap[lang]];
    return typeof v === "string" && v.trim().length > 0;
  };

  const handleTranslate = async () => {
    if (activeLang === "hu") return;
    if (!huValue.trim()) {
      toast.error("A HU mező üres — először töltsd ki a magyar változatot.");
      return;
    }
    if (hasValue(activeLang)) {
      const ok = await confirm({ title: "Felülírás megerősítése", message: "A mező nem üres — felülírja a meglévő fordítást?", destructive: false, confirmLabel: "Felülírás" });
      if (!ok) return;
    }
    try {
      const { text } = await translateMutation.mutateAsync({ text: huValue, target: activeLang });
      handleChange(text);
      toast.success(`HU → ${activeLang.toUpperCase()} fordítás kész.`);
    } catch (err) {
      toast.error(`Fordítás nem sikerült: ${parseFormError(err, "Ismeretlen hiba")}`);
    }
  };

  const translateConfigured = translateStatus.data?.configured ?? false;
  const translateDisabled = translateMutation.isPending || !translateConfigured || !huValue.trim();

  const aiConfigured = aiStatus.data?.configured ?? false;
  const showImproveButton = (type === "textarea" || type === "rich") && currentValue.trim().length >= 20;

  const handleImprove = async (mode: ImproveMode) => {
    setImproveOpen(false);
    if (!currentValue.trim()) { toast.error("A mező üres."); return; }
    const ok = await confirm({ title: `AI ${IMPROVE_LABELS[mode].toLowerCase()}`, message: `A jelenlegi ${activeLang.toUpperCase()} szöveg felülíródik (${IMPROVE_LABELS[mode]} mód). Folytatod?`, destructive: false, confirmLabel: "Folytatás" });
    if (!ok) return;
    try {
      const { text } = await improveMutation.mutateAsync({
        text: currentValue,
        mode,
        lang: activeLang,
      });
      handleChange(text);
      toast.success(`AI ${IMPROVE_LABELS[mode].toLowerCase()} kész.`);
    } catch (err) {
      toast.error(`AI javítás sikertelen: ${parseFormError(err, "Ismeretlen hiba")}`);
    }
  };

  return (
    <div style={style}>
      <label className="g2a-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span>
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </span>
        <div style={{ display: "inline-flex", gap: 4, padding: 2, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
          {(["hu", "en", "zh"] as Lang[]).map((l) => {
            const active = l === activeLang;
            const filled = hasValue(l);
            return (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLang(l)}
                title={LANG_LABELS[l].label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: active ? "#14B8A6" : "transparent",
                  color: active ? "#fff" : filled ? "var(--g2a-text-secondary)" : "var(--g2a-text-muted)",
                  border: "none",
                  fontFamily: "Geist Mono, monospace",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>{LANG_LABELS[l].flag}</span>
                <span>{l.toUpperCase()}</span>
                {l !== "hu" && filled && !active && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--g2a-brand-teal)", display: "inline-block" }} />
                )}
              </button>
            );
          })}
        </div>
      </label>

      <div style={{ position: "relative" }}>
        {type === "textarea" || type === "rich" ? (
          <textarea
            className="g2a-input"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholderMap[activeLang]}
            required={required && activeLang === "hu"}
            rows={rows}
            style={{ resize: "vertical", fontFamily: type === "rich" ? "Geist Mono, monospace" : undefined }}
          />
        ) : (
          <input
            type="text"
            className="g2a-input"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholderMap[activeLang]}
            required={required && activeLang === "hu"}
          />
        )}

        {/* Auto-translate button — only in EN/ZH tabs */}
        {activeLang !== "hu" && (
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translateDisabled}
            title={
              !translateConfigured
                ? "DeepL API kulcs nincs beállítva (.env: DEEPL_API_KEY)"
                : !huValue.trim()
                ? "Először töltsd ki a HU mezőt"
                : `Fordítás HU → ${activeLang.toUpperCase()} DeepL-lel`
            }
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 4,
              background: translateDisabled ? "rgba(255,255,255,0.04)" : "rgba(20,184,166,0.15)",
              border: `1px solid ${translateDisabled ? "rgba(255,255,255,0.06)" : "rgba(20,184,166,0.35)"}`,
              color: translateDisabled ? "var(--g2a-text-muted)" : "var(--g2a-brand-teal)",
              cursor: translateDisabled ? "not-allowed" : "pointer",
              fontFamily: "Geist Mono, monospace",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 0.15s",
            }}
          >
            {translateMutation.isPending ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={11} />}
            HU → {activeLang.toUpperCase()}
          </button>
        )}

        {/* AI improve text — for textarea/rich fields once content has any meaningful length */}
        {showImproveButton && aiConfigured && (
          <div style={{ position: "absolute", top: 6, right: activeLang !== "hu" ? 132 : 6 }}>
            <button
              type="button"
              onClick={() => setImproveOpen((v) => !v)}
              disabled={improveMutation.isPending}
              title="AI átírás (OpenAI gpt-4o-mini)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: 4,
                background: improveMutation.isPending ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.4)",
                color: "#c084fc",
                cursor: improveMutation.isPending ? "wait" : "pointer",
                fontFamily: "Geist Mono, monospace",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {improveMutation.isPending ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : <Wand2 size={11} />}
              AI: javítás
            </button>
            {improveOpen && !improveMutation.isPending && (
              <div
                onMouseLeave={() => setImproveOpen(false)}
                style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0,
                  display: "flex", flexDirection: "column", gap: 2,
                  minWidth: 180, padding: 4, borderRadius: 6,
                  background: "#1a1a1a", border: "1px solid rgba(168,85,247,0.35)",
                  boxShadow: "0 18px 36px -12px rgba(0,0,0,0.7)",
                  zIndex: 50,
                }}
              >
                {(["tighten", "expand", "rephrase"] as ImproveMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleImprove(m)}
                    style={{
                      textAlign: "left", padding: "7px 10px", borderRadius: 4,
                      background: "transparent", border: "none", color: "#fff",
                      cursor: "pointer", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem",
                      display: "flex", flexDirection: "column", gap: 2,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontWeight: 600 }}>{IMPROVE_LABELS[m]}</span>
                    <span style={{ color: "#888", fontSize: "0.6rem", fontWeight: 400 }}>
                      {m === "tighten" && "Rövidítés 30-50%-kal"}
                      {m === "expand" && "Bővítés példákkal, részletekkel"}
                      {m === "rephrase" && "Új megfogalmazás, ugyanaz a hossz"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 4, fontFamily: "Geist Mono, monospace", fontSize: "0.65rem", color: "var(--g2a-text-muted)" }}>
        <span>
          {activeLang !== "hu" && !hasValue(activeLang) && (
            <em style={{ fontStyle: "normal" }}>Üresen hagyva a HU érték jelenik meg fallback-ként.</em>
          )}
          {activeLang !== "hu" && !translateConfigured && (
            <em style={{ fontStyle: "normal", marginLeft: 8 }}>
              Auto-fordításhoz állítsd be a <code>DEEPL_API_KEY</code>-t a .env-ben.
            </em>
          )}
        </span>
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}
