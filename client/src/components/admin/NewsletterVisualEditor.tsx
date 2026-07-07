import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, Heading2, Pilcrow, List, ListOrdered, Link2, Eraser } from "lucide-react";

/**
 * Lightweight WYSIWYG editor for the newsletter composer. Renders the email
 * HTML in a contentEditable surface (inline styles apply, so it looks close
 * to the sent email) with a small formatting toolbar. Edits sync back to the
 * parent `html` state on every input.
 *
 * It is mounted only while the "visual" tab is active, so it seeds its content
 * once from `html` on mount and never re-renders from state afterwards — this
 * is what keeps the caret from jumping while typing (the classic React +
 * contentEditable pitfall). Switching tabs unmounts/remounts it, re-seeding
 * from the latest html.
 *
 * document.execCommand is deprecated but universally supported and perfectly
 * adequate for an internal admin tool; no heavy rich-text dependency needed.
 */
export default function NewsletterVisualEditor({
  html,
  onChange,
}: {
  html: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Seed once on mount (entering the visual tab).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(command, false, value);
    sync();
  };

  const addLink = () => {
    const url = window.prompt("Link URL:", "https://");
    if (url) exec("createLink", url);
  };

  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 30, height: 30, borderRadius: 4, background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", cursor: "pointer",
  };
  const Tool = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onClick} style={btn}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(20,184,166,0.5)"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#ccc"; }}>
      {children}
    </button>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px", background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", borderRadius: "5px 5px 0 0" }}>
        <Tool title="Félkövér" onClick={() => exec("bold")}><Bold size={15} /></Tool>
        <Tool title="Dőlt" onClick={() => exec("italic")}><Italic size={15} /></Tool>
        <Tool title="Aláhúzott" onClick={() => exec("underline")}><Underline size={15} /></Tool>
        <span style={{ width: 1, background: "rgba(255,255,255,0.12)", margin: "2px 2px" }} />
        <Tool title="Címsor (H2)" onClick={() => exec("formatBlock", "<h2>")}><Heading2 size={15} /></Tool>
        <Tool title="Bekezdés" onClick={() => exec("formatBlock", "<p>")}><Pilcrow size={15} /></Tool>
        <Tool title="Felsorolás" onClick={() => exec("insertUnorderedList")}><List size={15} /></Tool>
        <Tool title="Számozott lista" onClick={() => exec("insertOrderedList")}><ListOrdered size={15} /></Tool>
        <span style={{ width: 1, background: "rgba(255,255,255,0.12)", margin: "2px 2px" }} />
        <Tool title="Link beszúrása" onClick={addLink}><Link2 size={15} /></Tool>
        <Tool title="Formázás törlése" onClick={() => exec("removeFormat")}><Eraser size={15} /></Tool>
      </div>
      {/* Editable surface — white like the email, inline styles render as-is. */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        style={{
          minHeight: 420, maxHeight: 560, overflow: "auto", padding: "20px 24px",
          background: "#fff", color: "#1f2937", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0 0 5px 5px", outline: "none", lineHeight: 1.6, fontSize: 15,
          fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      />
      <p style={{ marginTop: 6, fontSize: "0.65rem", color: "#666", fontFamily: "Geist Mono, monospace" }}>
        Vizuális szerkesztés — a formázás azonnal a HTML-be íródik. Bonyolultabb elrendezéshez válts a „Kód" fülre.
      </p>
    </div>
  );
}
