/**
 * Per-platform social media share UI for a blog post.
 *
 * Renders three cards (LinkedIn / Facebook / Instagram), each with:
 *   - Topic header with platform icon
 *   - AI-generated copy in an editable textarea
 *   - "Generálj AI-val" button (calls /api/trpc/social.generateCopy)
 *   - "Mentés draft-ként" button (calls /api/trpc/social.saveDraft)
 *   - "Posztolás" button (disabled in phase 1 — appears in phase 2 after
 *     LinkedIn/Meta OAuth + app review is complete)
 *
 * State: the latest draft per platform is loaded from `social.listForPost`
 * on mount. Generating new copy replaces the textarea content (with a
 * confirm if the textarea has unsaved changes). Saving stores the current
 * textarea content as a fresh row — earlier iterations remain in the DB
 * for audit but are hidden from the UI.
 */
import { useState, useEffect } from "react";
import { Sparkles, Save, Linkedin, Facebook, Instagram, Loader2, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Site origin used to build canonical post URLs from a slug. In the browser
 * we just use `window.location.origin`, which is correct for both prod
 * (g2amarketing.hu) and preview deployments. SSR/prerender doesn't hit this
 * file because admin pages aren't prerendered.
 */
function postPublicUrl(slug: string): string {
  if (!slug) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/blog/${slug}`;
}

/**
 * Build the platform-specific external share dialog URL. We don't have
 * a server-side publish integration yet (OAuth phase 2), but each platform
 * exposes a parameterised share dialog that opens in a new tab and lets
 * the admin paste the pre-copied caption.
 *
 * Notes per platform:
 *   - LinkedIn: only accepts a URL — caption must be pasted manually
 *   - Facebook: same — sharer.php only accepts a URL
 *   - Instagram: no public web share URL at all. We open Meta Business
 *     Suite where the admin can attach the caption and image.
 */
function shareUrl(platform: "linkedin" | "facebook" | "instagram", url: string): string {
  const encoded = encodeURIComponent(url);
  switch (platform) {
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
    case "instagram":
      // Instagram has no web sharer; open Meta Business Suite composer.
      return "https://business.facebook.com/latest/composer";
  }
}

type Platform = "linkedin" | "facebook" | "instagram";

const PLATFORMS: Array<{
  key: Platform;
  label: string;
  icon: React.ReactNode;
  color: string;
  charTarget: string;
}> = [
  { key: "linkedin", label: "LinkedIn", icon: <Linkedin size={16} />, color: "#0a66c2", charTarget: "800-1300" },
  { key: "facebook", label: "Facebook", icon: <Facebook size={16} />, color: "#1877f2", charTarget: "300-500" },
  { key: "instagram", label: "Instagram", icon: <Instagram size={16} />, color: "#e1306c", charTarget: "800-1500" },
];

export default function SocialShareSection({
  postId,
  slug,
  status,
}: {
  postId: number;
  slug: string;
  status: "draft" | "published";
}) {
  const utils = trpc.useUtils();
  const { data: drafts, isLoading } = trpc.social.listForPost.useQuery({ postId });
  const { data: accounts } = trpc.social.listAccounts.useQuery();
  const generate = trpc.social.generateCopy.useMutation();
  const saveDraft = trpc.social.saveDraft.useMutation({
    onSuccess: () => utils.social.listForPost.invalidate({ postId }),
  });

  // Per-platform local textarea state — initialised from DB drafts when they
  // load. We keep edits local until the admin clicks "Save draft".
  const [copies, setCopies] = useState<Record<Platform, string>>({
    linkedin: "",
    facebook: "",
    instagram: "",
  });
  const [savedLength, setSavedLength] = useState<Record<Platform, number>>({
    linkedin: 0,
    facebook: 0,
    instagram: 0,
  });

  useEffect(() => {
    if (!drafts) return;
    const next: Record<Platform, string> = { linkedin: "", facebook: "", instagram: "" };
    const lengths: Record<Platform, number> = { linkedin: 0, facebook: 0, instagram: 0 };
    for (const d of drafts) {
      next[d.platform as Platform] = d.copy;
      lengths[d.platform as Platform] = d.copy.length;
    }
    setCopies(next);
    setSavedLength(lengths);
  }, [drafts]);

  const handleGenerate = async (platform: Platform) => {
    if (copies[platform].trim().length > 0) {
      const ok = window.confirm(
        `Van már mentett vagy szerkesztett tartalom ezen a platformon. Felülírjuk az AI-val generált új verzióval?`,
      );
      if (!ok) return;
    }
    try {
      const result = await generate.mutateAsync({ postId, platform });
      setCopies((p) => ({ ...p, [platform]: result.copy }));
      toast.success(`${PLATFORMS.find((x) => x.key === platform)?.label} copy generálva — szerkesztheted, mentés után tárolódik.`);
    } catch (err) {
      toast.error(`AI generálás sikertelen: ${err instanceof Error ? err.message : "ismeretlen hiba"}`);
    }
  };

  const handleSave = async (platform: Platform) => {
    const copy = copies[platform].trim();
    if (!copy) {
      toast.error("Üres szöveget nem lehet menteni.");
      return;
    }
    try {
      await saveDraft.mutateAsync({ postId, platform, copy });
      setSavedLength((p) => ({ ...p, [platform]: copy.length }));
      toast.success(`${PLATFORMS.find((x) => x.key === platform)?.label} draft mentve.`);
    } catch (err) {
      toast.error(`Mentés sikertelen: ${err instanceof Error ? err.message : "ismeretlen hiba"}`);
    }
  };

  const isAccountConnected = (platform: Platform) =>
    accounts?.some((a) => a.platform === platform && a.isActive && a.accessToken) ?? false;

  /**
   * Manual share path — until the OAuth phase 2 integration lands, the
   * admin can still get the post out the door in one click: we copy the
   * generated caption to the clipboard and pop open the platform's share
   * dialog with the post URL pre-filled. They paste, attach the image,
   * and hit publish on the platform side.
   *
   * If the post is still a draft, we warn first since the share dialog
   * would link to a 404 (drafts don't render publicly).
   */
  const handleShare = async (platform: Platform) => {
    const copy = copies[platform].trim();
    if (!copy) {
      toast.error("Nincs copy ezen a platformon — generálj előbb.");
      return;
    }
    if (!slug) {
      toast.error("Mentsd el a cikket (slug szükséges) a megosztáshoz.");
      return;
    }
    if (status !== "published") {
      const ok = window.confirm(
        "A cikk még nincs közzétéve (draft) — a megosztott link 404-et fog adni a látogatóknak. Folytatod?",
      );
      if (!ok) return;
    }
    const url = postPublicUrl(slug);
    try {
      await navigator.clipboard.writeText(copy);
      toast.success(`${PLATFORMS.find((x) => x.key === platform)?.label}: copy a vágólapon, dialógus nyílik új ablakban.`);
    } catch {
      // Clipboard can be blocked by permissions — fall through to the
      // popup anyway so the admin can still complete the share manually.
      toast.message("Vágólap nem elérhető — másold ki kézzel a textarea-ból.");
    }
    window.open(shareUrl(platform, url), "_blank", "noopener,noreferrer,width=720,height=720");
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>
          Megosztás közösségi médián
        </h2>
        <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.5 }}>
          AI-vel generált platform-specifikus copy mindegyik csatornára. <strong style={{ color: "#ccc" }}>Másol + megnyit</strong> gombbal a copy a vágólapra kerül és új ablakban nyílik a platform megosztó dialógusa — beilleszted és postolod. (Az automatikus, egy-kattintásos publikálás OAuth-fázis 2-ben aktiválódik.)
        </p>
      </div>

      {isLoading && (
        <div style={{ color: "#666", fontFamily: "Geist Mono, monospace", fontSize: "0.82rem", padding: "1rem" }}>
          Betöltés…
        </div>
      )}

      {!isLoading && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {PLATFORMS.map((p) => {
            const copy = copies[p.key];
            const isGenerating = generate.isPending && generate.variables?.platform === p.key;
            const isSaving = saveDraft.isPending && saveDraft.variables?.platform === p.key;
            const isDirty = copy.length !== savedLength[p.key];
            const connected = isAccountConnected(p.key);

            return (
              <div key={p.key} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem 1.25rem" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: p.color, display: "flex" }}>{p.icon}</span>
                    <span style={{ color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: "0.95rem", fontWeight: 600 }}>{p.label}</span>
                    <span style={{ color: "#555", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>· {p.charTarget} karakter</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {connected ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#10b981", fontFamily: "Geist Mono, monospace", fontSize: "0.68rem" }}>
                        <CheckCircle2 size={11} /> CSATLAKOZTATVA
                      </span>
                    ) : (
                      <span style={{ color: "#666", fontFamily: "Geist Mono, monospace", fontSize: "0.68rem" }}>
                        FIÓK NINCS CSATLAKOZTATVA
                      </span>
                    )}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  value={copy}
                  onChange={(e) => setCopies((prev) => ({ ...prev, [p.key]: e.target.value }))}
                  placeholder={`Kattints az "AI generálj copy-t" gombra, vagy írd be saját szöveged. ${p.label}-stílus.`}
                  rows={8}
                  style={{
                    width: "100%",
                    background: "#222",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "0.75rem 1rem",
                    color: "#fff",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                  <div style={{ color: "#555", fontFamily: "Geist Mono, monospace", fontSize: "0.7rem" }}>
                    {copy.length} karakter {isDirty && <span style={{ color: "#fbbf24" }}>· mentetlen változás</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleGenerate(p.key)}
                      disabled={isGenerating}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "7px 12px", borderRadius: 5,
                        background: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(20,184,166,0.18))",
                        border: "1px solid rgba(168,85,247,0.4)",
                        color: "#c084fc",
                        fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", fontWeight: 600,
                        cursor: isGenerating ? "not-allowed" : "pointer",
                        opacity: isGenerating ? 0.6 : 1,
                      }}
                    >
                      {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isGenerating ? "Generálás…" : "AI generálj copy-t"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(p.key)}
                      disabled={isSaving || !isDirty || copy.trim().length === 0}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "7px 12px", borderRadius: 5,
                        background: isDirty ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isDirty ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: isDirty ? "#5eead4" : "#666",
                        fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", fontWeight: 600,
                        cursor: !isDirty || copy.trim().length === 0 ? "not-allowed" : "pointer",
                        opacity: isSaving ? 0.6 : 1,
                      }}
                    >
                      {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Mentés draft-ként
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(p.key)}
                      disabled={copy.trim().length === 0 || !slug}
                      title={
                        !slug
                          ? "Mentsd el a cikket előbb"
                          : copy.trim().length === 0
                          ? "Generálj copy-t előbb"
                          : `Másol a vágólapra + megnyitja a ${p.label} megosztás dialógust új ablakban`
                      }
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "7px 12px", borderRadius: 5,
                        background: copy.trim().length > 0 && slug ? `${p.color}28` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${copy.trim().length > 0 && slug ? `${p.color}66` : "rgba(255,255,255,0.06)"}`,
                        color: copy.trim().length > 0 && slug ? "#fff" : "#444",
                        fontFamily: "Geist Mono, monospace", fontSize: "0.72rem", fontWeight: 600,
                        cursor: copy.trim().length === 0 || !slug ? "not-allowed" : "pointer",
                      }}
                    >
                      <Copy size={11} />
                      <ExternalLink size={11} />
                      Másol + megnyit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
