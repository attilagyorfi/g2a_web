/**
 * Brand-aligned confirmation dialog. Replaces the native browser `confirm()`
 * which renders unstyled and inconsistent across OSes.
 *
 * Two ways to use:
 *
 * 1) **Hook (recommended for ad-hoc)** — async/await pattern that mirrors
 *    `window.confirm()` semantics, but renders a styled modal:
 *    ```tsx
 *    const confirm = useConfirm();
 *    const ok = await confirm({ title: "Törlés?", message: "..." });
 *    if (ok) deleteMutation.mutate(...);
 *    ```
 *    Mount `<ConfirmDialogHost />` once at app root for the hook to work.
 *
 * 2) **Component (controlled)** — for cases where you want to bind it to
 *    your own state:
 *    ```tsx
 *    <ConfirmDialog open={...} onConfirm={...} onCancel={...} ... />
 *    ```
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";

export type ConfirmOptions = {
  title: string;
  /** Body text — supports newlines. */
  message?: string;
  /** Confirm button label. Default: "Törlés" if `destructive`, else "Megerősítés". */
  confirmLabel?: string;
  /** Cancel button label. Default: "Mégse". */
  cancelLabel?: string;
  /** Red destructive styling on confirm button. Default: true. */
  destructive?: boolean;
};

type Props = ConfirmOptions & {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Mégse",
  destructive = true,
  onConfirm,
  onCancel,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus trap: focus cancel button on open (safest default — Enter-key auto-cancel)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const finalConfirmLabel = confirmLabel ?? (destructive ? "Törlés" : "Megerősítés");

  return (
    <div
      onClick={onCancel}
      role="presentation"
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        style={{
          background: "#1a1a1a",
          border: `1px solid ${destructive ? "rgba(239,68,68,0.4)" : "rgba(20,184,166,0.4)"}`,
          borderRadius: 10,
          padding: "1.5rem 1.5rem 1.25rem",
          maxWidth: 460, width: "100%",
          boxShadow: `0 24px 60px -12px ${destructive ? "rgba(239,68,68,0.3)" : "rgba(20,184,166,0.3)"}`,
          fontFamily: "Geist, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: 8,
            background: destructive ? "rgba(239,68,68,0.15)" : "rgba(20,184,166,0.15)",
            color: destructive ? "#ef4444" : "var(--g2a-brand-teal)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id="confirm-title" style={{
              margin: 0, color: "#fff", fontSize: "1rem", fontWeight: 600,
              fontFamily: "Geist Mono, monospace",
            }}>{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Bezárás"
            style={{
              background: "transparent", border: "none", color: "#888",
              cursor: "pointer", padding: 4, marginRight: -4, marginTop: -4,
            }}
          ><X size={16} /></button>
        </div>
        {message && (
          <p id="confirm-message" style={{
            margin: "0 0 1.25rem", color: "#aaa",
            fontSize: "0.875rem", lineHeight: 1.55, whiteSpace: "pre-line",
          }}>{message}</p>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 16px", borderRadius: 5,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#aaa", cursor: "pointer",
              fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", fontWeight: 600,
            }}
          >{cancelLabel}</button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "9px 18px", borderRadius: 5,
              background: destructive ? "#ef4444" : "linear-gradient(135deg,#14B8A6,#0D9488)",
              border: "none", color: "#fff", cursor: "pointer",
              fontFamily: "Geist Mono, monospace", fontSize: "0.78rem", fontWeight: 700,
            }}
          >{finalConfirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Hook + Host (mounted once at root) ──────────────────────────────────────
type ConfirmContextValue = (opts: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmDialogHost({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; opts: ConfirmOptions; resolve: (ok: boolean) => void } | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, opts, resolve });
    });
  }, []);

  const close = (result: boolean) => {
    if (state) state.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <ConfirmDialog
          open={state.open}
          {...state.opts}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Graceful fallback to native confirm if Host isn't mounted (eg. tests)
    // eslint-disable-next-line no-console
    console.warn("[ConfirmDialog] <ConfirmDialogHost> not mounted — falling back to window.confirm()");
    return async (opts) => window.confirm(`${opts.title}${opts.message ? `\n\n${opts.message}` : ""}`);
  }
  return ctx;
}
