/**
 * /ai-csomag — AI Marketing Csomag lead-magnet landing (HU-only).
 * Opt-in → leadmagnet.subscribe (source: ai-csomag) → /koszonjuk. The welcome
 * email delivers the 4 PDFs.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { track } from "@/lib/analytics";
import SeoHead from "@/components/SeoHead";
import { FunnelShell, C, MONO, wrap, eyebrow, field, primaryBtn } from "@/components/funnel/FunnelShell";

const ITEMS = [
  { n: "01", meta: "Mini e-book · 10 oldal", h: "AI eszközriport 2026", p: "A legjobb AI marketingeszközök hat kategóriában — tartalom, kép, videó, SEO, e-mail, elemzés — valós árakkal és tippekkel." },
  { n: "02", meta: "50 prompt · 13 oldal", h: "Marketinges prompt-gyűjtemény", p: "50 kész, magyar nyelvű AI-prompt, amivel feleannyi idő alatt írsz posztot, hírlevelet, hirdetést és cikket." },
  { n: "03", meta: "34 pont · 8 oldal", h: "Marketing önellenőrző checklista", p: "Nézd át 15 perc alatt, hol szivárog el a pénz a marketingedből — és pontozd le magad, hogy tudd, mit erősíts." },
  { n: "04", meta: "Sablon-kit · 8 oldal", h: "Tartalom sablon-csomag", p: "Tartalompillérek, kitölthető naptár, 12 posztsablon, hook- és CTA-formulák — soha többé üres vászon." },
];
const WHY = [
  { ic: "Gyakorlati", h: "Sablon, nem elmélet", p: "Minden anyag valami kézzelfoghatót ad: egy listát, egy promptot, egy kitölthető keretet, amit ma használhatsz." },
  { ic: "Őszinte", h: "AI józanul", p: "Az AI eszköz, nem varázslat. Megmondjuk, hol éri meg és hol nem — így nem égeted el a pénzt hype-ra." },
  { ic: "Adatvezérelt", h: "Mérhető szemlélet", p: "Nem trükköket adunk, hanem szemléletet: kevés kulcsmutató, rendszeres mérés, tudatos döntés." },
];
const WHO = [
  { h: "Egyedül viszed a marketinged", p: "Vállalkozóként kevés az időd — a csomag megmutatja, mely eszközökkel és sablonokkal spórolhatsz órákat hetente." },
  { h: "Céget vagy csapatot vezetsz", p: "Látni akarod, hol gyorsíthat és hol csökkenthet költséget az AI — konkrétan, a saját folyamataidban." },
  { h: "Most ismerkednél az AI-jal", p: "Nem tudod, hol kezdd — a csomag rendszerbe teszi, és lépésről lépésre elindít, felesleges kiadás nélkül." },
  { h: "Elakadtál a tartalomgyártásban", p: "Kifogytál az ötletekből — a sablonok és promptok újraindítják a tartalomnaptárad percek alatt." },
];
const FAQ = [
  { q: "Tényleg ingyenes?", a: "Igen, teljesen. Cserébe csak az e-mail-címedet kérjük, hogy elküldhessük az anyagokat, és időnként egy-egy hasznos marketingtippet. Bármikor leiratkozhatsz." },
  { q: "Kezdőként is hasznos?", a: "Igen. Az anyagok úgy készültek, hogy egy átlagos érdeklődő és egy tapasztalt marketinges is talál bennük azonnal használható részt." },
  { q: "Milyen formátumban kapom?", a: "Négy letölthető PDF-ként, amelyeket bármikor megnyithatsz telefonon vagy számítógépen." },
  { q: "Mi történik a feliratkozás után?", a: "Egy üdvözlő e-mailt kapsz a letöltési linkekkel, azonnal. Utána időnként jelentkezünk egy-egy tömör, gyakorlati tippel — soha nem spammelünk." },
];

function OptInForm({ showName }: { showName: boolean }) {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const subscribe = trpc.leadmagnet.subscribe.useMutation({
    onSuccess: () => { track.newsletterSignup("ai-csomag"); setLocation("/koszonjuk"); },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email || !consent) return;
        subscribe.mutate({ email, name: name || undefined, source: "ai-csomag", website });
      }}
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {showName && <input style={field} type="text" placeholder="Keresztneved" value={name} onChange={(e) => setName(e.target.value)} />}
      <input style={field} type="email" required placeholder="E-mail-címed" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: C.muted, margin: "2px 0 12px", cursor: "pointer", lineHeight: 1.5 }}>
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ accentColor: C.teal, marginTop: 2, flexShrink: 0 }} />
        <span>Hozzájárulok, hogy a G2A Marketing e-mailben elküldje az anyagokat és időnként marketingtippeket, az <a href="/adatvedelmi-iranyelvek" style={{ color: C.teal }}>Adatvédelmi tájékoztató</a> szerint.</span>
      </label>
      <button style={{ ...primaryBtn, opacity: subscribe.isPending ? 0.6 : 1 }} type="submit" disabled={subscribe.isPending}>
        {subscribe.isPending ? "Küldés…" : "Kérem a 4 anyagot →"}
      </button>
      {subscribe.isError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>Hiba történt. Próbáld újra, vagy írj az info@g2amarketing.hu címre.</div>}
      <div style={{ fontSize: 11.5, color: C.muted2, marginTop: 12, textAlign: "center", fontFamily: MONO }}>Nincs spam. Egy kattintással bármikor leiratkozhatsz.</div>
    </form>
  );
}

const block: React.CSSProperties = { padding: "56px 0", borderTop: `1px solid ${C.lineSoft}` };
const secKick: React.CSSProperties = { fontFamily: MONO, fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: C.teal };
const h2: React.CSSProperties = { fontSize: 32, fontWeight: 800, letterSpacing: "-.8px", color: "#fff", margin: "8px 0 10px", lineHeight: 1.12 };
const secLead: React.CSSProperties = { fontSize: 16, color: C.muted, maxWidth: 640 };

export default function AiCsomagPage() {
  return (
    <>
      <SeoHead
        title="Ingyenes AI Marketing Csomag 2026 — G2A Marketing"
        description="Négy gyakorlati anyag, magyarul: AI eszközriport, 50 prompt, önellenőrző checklista és tartalomsablonok. Add meg az e-mail-címed, és pár percen belül a postaládádban."
      />
      <FunnelShell navCta={{ label: "Kérem a csomagot →", href: "#letoltes" }}>
        {/* HERO */}
        <header style={{ position: "relative", overflow: "hidden", padding: "70px 0 60px", background: "radial-gradient(760px 480px at 82% -6%,rgba(20,184,166,.16),transparent 60%),radial-gradient(560px 460px at 0% 110%,rgba(13,148,136,.13),transparent 60%)" }}>
          <div style={{ ...wrap, display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 48, alignItems: "center" }} className="g2a-keep-cols funnel-hero">
            <div>
              <div style={eyebrow}>Ingyenes letölthető csomag · 2026</div>
              <h1 style={{ fontSize: 50, lineHeight: 1.03, fontWeight: 800, letterSpacing: "-1.6px", color: "#fff", margin: "18px 0 0" }}>Állítsd az <span style={{ color: C.teal }}>AI-t</span> a marketinged mellé</h1>
              <div style={{ fontSize: 18, color: "#AEB3BB", marginTop: 20, maxWidth: 520 }}>Négy gyakorlati anyag, magyarul — eszközriport, 50 kész prompt, önellenőrző checklista és tartalomsablonok. Add meg az e-mail-címed, és pár percen belül a postaládádban van az egész csomag.</div>
              <ul style={{ listStyle: "none", margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 9, padding: 0 }}>
                {["Azonnal használható — nem elmélet, hanem sablonok, listák, promptok.", "Kezdőnek és cégnek is — a magánvállalkozótól a marketingcsapatig.", "Nincs mellébeszélés — megmondjuk azt is, hol nem éri meg az AI."].map((t, i) => (
                  <li key={i} style={{ fontSize: 14.5, color: C.text, display: "flex", gap: 10, alignItems: "flex-start" }}><span style={{ color: C.teal, fontWeight: 700 }}>✓</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div id="letoltes" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 20, padding: "30px 28px", position: "relative" }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: C.teal }}>Ingyenes letöltés</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "8px 0 4px", letterSpacing: "-.4px" }}>Kérem a csomagot</h3>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Írd be az e-mail-címed, és elküldjük mind a négy anyagot — plusz időnként egy-egy hasznos, tömör marketingtippet.</p>
              <OptInForm showName />
            </div>
          </div>
        </header>

        {/* MIT KAPSZ */}
        <section style={block}><div style={wrap}>
          <div style={secKick}>— Mit kapsz</div>
          <h2 style={h2}>Négy anyag, egy csomagban</h2>
          <div style={secLead}>Együtt egy teljes kis eszköztár a 2026-os marketinghez. Külön-külön is megállják a helyüket, együtt viszont végigkísérnek a tervezéstől a napi végrehajtásig.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 34 }}>
            {ITEMS.map((it) => (
              <div key={it.n} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 22, display: "flex", gap: 16 }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#06201d", background: C.teal, width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 30px" }}>{it.n}</div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "1px", textTransform: "uppercase", color: C.muted2, marginBottom: 8 }}>{it.meta}</div>
                  <div style={{ fontSize: 17, color: "#fff", fontWeight: 700, marginBottom: 5 }}>{it.h}</div>
                  <p style={{ fontSize: 13.5, color: C.muted }}>{it.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div></section>

        {/* MIÉRT */}
        <section style={block}><div style={wrap}>
          <div style={secKick}>— Miért éri meg</div>
          <h2 style={h2}>Nem PDF a fióknak</h2>
          <div style={secLead}>Olyan anyagokat állítottunk össze, amiket tényleg használni fogsz — mert konkrétak, gyakorlatiasak és őszinték.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 32 }}>
            {WHY.map((c) => (
              <div key={c.h} style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: C.teal }}>{c.ic}</div>
                <div style={{ fontSize: 16, color: "#fff", margin: "8px 0 5px", fontWeight: 700 }}>{c.h}</div>
                <p style={{ fontSize: 13, color: C.muted }}>{c.p}</p>
              </div>
            ))}
          </div>
        </div></section>

        {/* KINEK */}
        <section style={block}><div style={wrap}>
          <div style={secKick}>— Kinek szól</div>
          <h2 style={h2}>Neked, ha…</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
            {WHO.map((w) => (
              <div key={w.h} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: "20px 22px", background: C.panel }}>
                <div style={{ color: "#fff", fontSize: 16, marginBottom: 6, fontWeight: 700 }}>{w.h}</div>
                <p style={{ color: C.muted, fontSize: 13.5 }}>{w.p}</p>
              </div>
            ))}
          </div>
        </div></section>

        {/* FOUNDER */}
        <section style={block}><div style={wrap}>
          <div style={{ display: "flex", gap: 22, alignItems: "center", background: "linear-gradient(180deg,rgba(20,184,166,.06),transparent)", border: `1px solid ${C.line}`, borderRadius: 18, padding: "26px 28px" }} className="g2a-keep-cols">
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${C.teal},${C.tealD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#06201d", flex: "0 0 64px" }}>G</div>
            <div>
              <p style={{ fontSize: 15, color: C.text, fontStyle: "italic" }}>„Nem újabb eszközlistát akartunk adni, hanem valamit, amit tényleg használni fogsz. Ha nincs stratégia, nincs G2A — ezért mindegyik anyag a gyakorlatra és a mérhető eredményre épül, nem a divatszavakra."</p>
              <div style={{ fontFamily: MONO, fontSize: 12, color: C.teal, marginTop: 8 }}>Győrfi Attila · Alapító, G2A Marketing</div>
            </div>
          </div>
        </div></section>

        {/* FAQ */}
        <section style={block}><div style={wrap}>
          <div style={secKick}>— Gyakori kérdések</div>
          <h2 style={h2}>Mielőtt letöltöd</h2>
          <div style={{ marginTop: 26, borderTop: `1px solid ${C.line}` }}>
            {FAQ.map((f) => (
              <div key={f.q} style={{ padding: "18px 2px", borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontSize: 16, color: "#fff", marginBottom: 5, fontWeight: 600 }}>{f.q}</div>
                <p style={{ fontSize: 13.5, color: C.muted }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div></section>

        {/* FINAL CTA */}
        <section style={block}><div style={wrap}>
          <div style={{ background: "radial-gradient(500px 360px at 88% 0%,rgba(20,184,166,.18),transparent 60%),#131313", border: `1px solid ${C.line}`, borderRadius: 22, padding: "46px 40px", textAlign: "center" }}>
            <div style={{ ...eyebrow, textAlign: "center" }}>Ingyenes · azonnali letöltés</div>
            <h2 style={{ ...h2, fontSize: 30, marginTop: 8 }}>Kérd a 4 anyagot most</h2>
            <p style={{ color: C.muted, fontSize: 16, maxWidth: 460, margin: "0 auto 20px" }}>Add meg az e-mail-címed, és pár percen belül a postaládádban az egész AI Marketing Csomag.</p>
            <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}><OptInForm showName={false} /></div>
          </div>
        </div></section>
      </FunnelShell>
    </>
  );
}
