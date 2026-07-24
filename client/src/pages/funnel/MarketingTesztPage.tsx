/**
 * /marketing-teszt — interactive 34-point marketing self-check (HU-only).
 * Computes a score + band + 3 weakest areas, then the opt-in passes them to
 * leadmagnet.subscribe (source: marketing-teszt) so the subscriber is
 * segmented for the later nurture/branching layer.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { track } from "@/lib/analytics";
import SeoHead from "@/components/SeoHead";
import { FunnelShell, C, MONO, wrap, eyebrow, field, primaryBtn } from "@/components/funnel/FunnelShell";

type Section = { cn: string; t: string; items: [string, string][] };

const DATA: Section[] = [
  { cn: "01", t: "Weboldal & élmény", items: [
    ["Mobilon is jól használható", "Reszponzív, telefonon sem csúszik szét, könnyű navigálni."],
    ["3 másodperc alatt betölt", "A főoldal és a fő aloldalak gyorsan megjelennek."],
    ["Egyértelmű a következő lépés", "Minden fő oldalon van világos, kiemelt CTA."],
    ["Könnyen elérhető a kapcsolat", "Jól látható elérhetőség és gyorsan megtalálható kapcsolati oldal."],
    ["Biztonságos és hibamentes", "HTTPS fut, nincsenek törött linkek vagy hiányzó képek."],
  ] },
  { cn: "02", t: "SEO alapok", items: [
    ["Egyedi title és leírás", "Minden fontos oldalnak saját, kulcsszavas címe és meta leírása van."],
    ["Kulcsszavas címsorok", "A H1/H2 a valós keresési kifejezéseket tükrözi."],
    ["Optimalizált képek", "A képeknek van alt-szövege és értelmes fájlneve."],
    ["Search Console + sitemap", "Regisztrálva a Google Search Console-ban, van sitemap."],
    ["Rendszeres tartalom", "Van rendszeresen frissülő, kulcsszavakra épülő tartalom."],
  ] },
  { cn: "03", t: "Tartalom", items: [
    ["Van tartalomterv", "Létezik dokumentált tartalomnaptár, nem kapkodva születik minden."],
    ["Az ügyfélről szól", "A tartalom a célközönség kérdéseire válaszol, nem csak magadról."],
    ["Újrahasznosítod", "Egy tartalomból több formátumot készítesz."],
    ["Minden tartalomnak van célja", "Tudod a célt, és van benne egy egyértelmű következő lépés."],
  ] },
  { cn: "04", t: "Közösségi média", items: [
    ["Következetes arculat", "Egységes logó, színek, hangnem minden profilon."],
    ["Tervezett, rendszeres posztolás", "Kiszámítható ritmus, nem hullámzó jelenlét."],
    ["Válaszolsz időben", "A kommentekre és üzenetekre érdemben, gyorsan reagálsz."],
    ["Egyértelmű bió és link", "A leírás elmondja, mit kínálsz, és van benne működő link."],
  ] },
  { cn: "05", t: "E-mail marketing", items: [
    ["Aktívan gyűjtöd a listát", "Van jól látható feliratkozási lehetőség és ok rá."],
    ["Van üdvözlő e-mail", "Az új feliratkozó automatikus welcome levelet kap."],
    ["Rendszeres, értékes levél", "Nem csak akciózol: adsz értéket is."],
    ["Méred a teljesítményt", "Figyeled a megnyitási és átkattintási arányt."],
  ] },
  { cn: "06", t: "Hirdetés & PPC", items: [
    ["Cél és keret minden kampányon", "Tudod a célt és a költségkeretet minden hirdetésnél."],
    ["Célzott közönség", "A hirdetés konkrét célközönségnek megy, nem mindenkinek."],
    ["Dedikált landing oldal", "A hirdetés célzott oldalra visz, nem a főoldalra."],
    ["Konverziót mérsz", "Az eredményt méred, nem csak a kattintást."],
  ] },
  { cn: "07", t: "Analitika & mérés", items: [
    ["Be van kötve a mérés", "Működik az analitika (GA4) és a konverziókövetés."],
    ["Van 3-5 kulcsmutatód", "Kiválasztottad a néhány fontos KPI-t."],
    ["Havi rendszeres átnézés", "Havonta ránézel a számokra és döntesz alapján."],
    ["Tudod, honnan jön az ügyfél", "Ismered, melyik csatorna hozza a legjobb ügyfeleket."],
  ] },
  { cn: "08", t: "Konverzió & bizalom", items: [
    ["Van társadalmi bizonyíték", "Vélemények, referenciák, esettanulmányok láthatók."],
    ["Azonnal érthető az értékajánlat", "Az első képernyőn világos, kinek mit kínálsz."],
    ["Rövid a vásárlás útja", "Kevés lépés, felesleges súrlódás nélkül."],
    ["Kezeled a kifogásokat", "A gyakori kételyeket előre megválaszolod."],
  ] },
];
const TOTAL = DATA.reduce((s, x) => s + x.items.length, 0);

function band(score: number) {
  if (score >= 28) return { label: "Erős alapok", desc: "A gépezet működik — innen a finomhangolás és a skálázás jön. Nem az alapokon kell dolgoznod, hanem azon, hogy a meglévőkből többet hozz ki: mélyebb mérés, optimalizálás, rendszerezés." };
  if (score >= 18) return { label: "Jó úton vagy", desc: "Az alapok nagyrészt megvannak, de van pár rés, amit betömve aránytalanul sokat nyersz. Válaszd ki a 3 leggyengébb pontod (lent kiemeltük), és a következő hónapban csak azokra fókuszálj." };
  if (score >= 8) return { label: "Sok a lehetőség", desc: "Több területen van tennivaló — ez nem kudarc, hanem térkép. Ne akard egyszerre az egészet: priorizálj, és havonta 3 javítás bőven elég a látható előrelépéshez." };
  return { label: "Nagy potenciál", desc: "Itt a legnagyobb a növekedési pontod: minden javítás azonnal érezhető különbséget hoz. Kezdd egyetlen alappal — működő weboldal, mérés bekötése, vagy egy következetesen vitt csatorna — és onnan építkezz." };
}

export default function MarketingTesztPage() {
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");

  const total = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const b = band(total);
  const ranked = useMemo(
    () => DATA.map((sec, si) => {
      const got = sec.items.filter((_, ii) => checked[`${si}_${ii}`]).length;
      return { name: sec.t, got, max: sec.items.length, ratio: got / sec.items.length };
    }).sort((x, y) => x.ratio - y.ratio),
    [checked],
  );
  const weakest3 = ranked.slice(0, 3);

  const subscribe = trpc.leadmagnet.subscribe.useMutation({
    onSuccess: () => { track.newsletterSignup("marketing-teszt"); setLocation("/koszonjuk"); },
  });

  const toggle = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <SeoHead
        title="Marketing önellenőrző teszt — 15 perc, 34 pont | G2A"
        description="Kattintható teszt: 15 perc alatt átvilágítod a marketinged, pontszámot kapsz és megtudod, hol a legnagyobb lehetőséged. Ingyenes, magyarul."
      />
      <FunnelShell>
        {/* score bar */}
        <div style={{ position: "sticky", top: 66, zIndex: 40, background: "rgba(15,15,15,.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`, padding: "12px 0" }}>
          <div style={{ ...wrap, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: MONO, fontSize: 14, color: "#fff", whiteSpace: "nowrap" }}><b>{total}</b>/{TOTAL} pont</div>
            <div style={{ flex: 1, height: 8, background: C.panel2, borderRadius: 100, overflow: "hidden", border: `1px solid ${C.line}` }}>
              <div style={{ height: "100%", width: `${(total / TOTAL) * 100}%`, background: C.teal, transition: "width .2s" }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.teal, whiteSpace: "nowrap" }}>{total === 0 ? "Kezdd a pipálást" : b.label}</div>
          </div>
        </div>

        <div style={{ ...wrap, paddingTop: 40 }}>
          <div style={eyebrow}>Ingyenes · 15 perc</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1px", color: "#fff", margin: "12px 0 8px", lineHeight: 1.08 }}>Hol tart most a marketinged?</h1>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 620 }}>Pipáld ki, ami már megvan. A végén pontszámot kapsz, megmutatjuk a 3 leggyengébb pontod, és e-mailben a rád szabott következő lépéseket.</p>
        </div>

        <div style={{ ...wrap, paddingTop: 28, paddingBottom: 20 }}>
          {DATA.map((sec, si) => {
            const got = sec.items.filter((_, ii) => checked[`${si}_${ii}`]).length;
            return (
              <section key={sec.cn} style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: C.teal }}>{sec.cn}</span>
                  <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{sec.t}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: got === sec.items.length ? C.teal : C.muted2, marginLeft: "auto" }}>{got}/{sec.items.length}</span>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {sec.items.map((it, ii) => {
                    const key = `${si}_${ii}`;
                    const on = !!checked[key];
                    return (
                      <div key={key} onClick={() => toggle(key)} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: on ? "rgba(20,184,166,.08)" : C.panel, border: `1px solid ${on ? C.teal : C.line}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: on ? C.teal : "transparent", border: `1px solid ${on ? C.teal : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#06201d", fontWeight: 800, fontSize: 14 }}>{on ? "✓" : ""}</div>
                        <div>
                          <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{it[0]}</div>
                          <div style={{ fontSize: 13, color: C.muted }}>{it[1]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <button type="button" onClick={() => { setShown(true); setTimeout(() => document.getElementById("teszt-eredmeny")?.scrollIntoView({ behavior: "smooth" }), 50); }} style={{ ...primaryBtn, marginTop: 8 }}>
            Mutasd az eredményem →
          </button>
        </div>

        {shown && (
          <div id="teszt-eredmeny" style={{ ...wrap, paddingBottom: 40 }}>
            <div style={{ background: "radial-gradient(460px 320px at 88% 0%,rgba(20,184,166,.16),transparent 60%),#131313", border: `1px solid ${C.line}`, borderRadius: 20, padding: "34px 32px" }}>
              <div style={eyebrow}>Az eredményed</div>
              <div style={{ fontFamily: MONO, fontSize: 66, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-2px", marginTop: 12 }}>{total}<span style={{ fontSize: 28, color: C.muted }}>/{TOTAL} pont</span></div>
              <div style={{ fontSize: 22, color: C.teal, fontWeight: 800, margin: "14px 0 8px" }}>{b.label}</div>
              <div style={{ fontSize: 15, color: C.text, lineHeight: 1.65, maxWidth: 620 }}>{b.desc}</div>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: C.muted2, marginBottom: 12 }}>— Itt a legnagyobb lehetőséged</div>
                {weakest3.map((r) => (
                  <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#fff", minWidth: 160 }}>{r.name}</span>
                    <span style={{ flex: 1, height: 6, background: C.panel2, borderRadius: 100, overflow: "hidden", maxWidth: 180 }}><i style={{ display: "block", height: "100%", width: `${r.ratio * 100}%`, background: C.teal }} /></span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted, marginLeft: "auto" }}>{r.got}/{r.max}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: "26px 28px", marginTop: 16 }}>
              <h3 style={{ fontSize: 20, color: "#fff", fontWeight: 800, marginBottom: 6 }}>Kérd a személyre szabott javaslatokat</h3>
              <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 16 }}>Add meg az e-mail-címed, és elküldjük a pontszámodhoz igazított következő lépéseket — plusz a 4 anyagot az AI Marketing Csomagból. Nincs spam, bármikor leiratkozhatsz.</p>
              <form onSubmit={(e) => { e.preventDefault(); if (!email || !consent) return; subscribe.mutate({ email, source: "marketing-teszt", score: total, band: b.label, weakestAreas: weakest3.map((r) => r.name).join(", "), website }); }}>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <input style={field} type="email" required placeholder="E-mail-címed" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: C.muted, margin: "2px 0 12px", cursor: "pointer", lineHeight: 1.5 }}>
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ accentColor: C.teal, marginTop: 2, flexShrink: 0 }} />
                  <span>Hozzájárulok, hogy a G2A Marketing e-mailben elküldje az anyagokat és a javaslatokat, az <a href="/adatvedelmi-iranyelvek" style={{ color: C.teal }}>Adatvédelmi tájékoztató</a> szerint.</span>
                </label>
                <button style={{ ...primaryBtn, opacity: subscribe.isPending ? 0.6 : 1 }} type="submit" disabled={subscribe.isPending}>{subscribe.isPending ? "Küldés…" : "Kérem a javaslatokat →"}</button>
                {subscribe.isError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>Hiba történt. Próbáld újra, vagy írj az info@g2amarketing.hu címre.</div>}
                <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.muted2, marginTop: 12 }}>A pontszámod automatikusan csatolódik — így pont a rád illő tippeket kapod.</div>
              </form>
            </div>
          </div>
        )}
      </FunnelShell>
    </>
  );
}
