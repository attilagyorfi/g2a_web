/**
 * Code-defined email automations (drip / nurture sequences).
 *
 * A sequence is an ordered list of steps; each step has a `dayOffset` (days
 * from enrollment) and builds its own subject + HTML. The cron
 * (/api/cron/automations) advances each enrollment when its `nextRunAt` is due.
 *
 * HU-only — these run off the AI Marketing Csomag funnel. Copy is from the
 * client's "email_sorozat" + "elagazo_emailek" kit, in the approved voice.
 */
import { renderSimpleEmailHtml } from "./emailTemplates";

const SITE = "https://g2amarketing.hu";
const CHECKLIST = `${SITE}/marketing-teszt`;
const PROMPTS = `${SITE}/letoltesek/G2A_Prompt_gyujtemeny_2026.pdf`;
const CONSULT = `${SITE}/ingyenes-audit`;

export type EnrollmentCtx = { name?: string | null; band?: string | null; unsubscribeUrl: string };
export type AutomationStep = {
  /** Days from enrollment when this step is due. */
  dayOffset: number;
  build: (ctx: EnrollmentCtx) => { subject: string; html: string };
};
export type Automation = { key: string; name: string; steps: AutomationStep[] };

/** Band-aware closing offer (step 4). Defaults to the "Jó úton" variant when
 *  no band is known (plain landing opt-in) — the kit's recommended default. */
function offerStep(ctx: EnrollmentCtx) {
  const band = ctx.band ?? "Jó úton vagy";
  if (band === "Erős alapok") {
    return {
      subject: "Erős alapok — most jön a neheze",
      paragraphs: [
        "Az elmúlt két hétben végigvettük az eszközöket, a promptokat és a mérést. A teszted alapján nálad az alapok rendben vannak — ez több, mint amit a legtöbb cégnél látunk.",
        "Innen megváltozik a játék: nem újabb csatornákat kell nyitni, hanem a meglévőkből többet kihozni. Mérj mélyebben (melyik csatorna hozza a legjobb ügyfeleket), optimalizálj a bővítés helyett, és tedd folyamattá, ami eddig ad hoc ment.",
        "Ezen a szinten a részletek döntenek. Ha szeretnéd, egy 30 perces ingyenes konzultáción megnézzük, hol van nálad a legnagyobb kiaknázatlan tartalék.",
      ],
    };
  }
  if (band === "Sok a lehetőség" || band === "Nagy potenciál") {
    return {
      subject: "Ha elakadtál, itt vagyunk",
      paragraphs: [
        "Az elmúlt két hétben sok inputot kaptál — eszközök, promptok, mérés. Ha most azt érzed, hogy sok, és nem tudod, mivel kezdd, az teljesen természetes.",
        "A legjobb hír: neked hoznak a legtöbbet az első lépések, mert minden javítás azonnal érezhető. Nem kell egyszerre az egész — elég egyetlen alap: működő weboldal, a mérés bekötése, vagy egy következetesen vitt csatorna.",
        "Ha szeretnéd, egy 30 perces ingyenes konzultáción kijelöljük együtt az első 1-2 lépést — kötetlenül, konkrét javaslatokkal.",
      ],
    };
  }
  // Jó úton (default)
  return {
    subject: "Megnézzük együtt a marketinged?",
    paragraphs: [
      "Az elmúlt két hétben végigvettük az eszközöket, a promptokat és a mérést. Remélem, volt köztük olyan, amit már használsz is.",
      "A teszted alapján jó úton vagy: az alapok nagyrészt megvannak, csak pár rés van, ahol elszivárog az eredmény. A legtöbb cégnél 3-4 jól megválasztott javítás hozza az eredmény nagy részét — nem a mennyiség számít, hanem a sorrend.",
      "Ha elakadnál abban, mit tegyél előre, egy 30 perces ingyenes konzultáción szívesen segítünk priorizálni — kötetlenül, konkrét javaslatokkal.",
    ],
  };
}

export const AUTOMATIONS: Record<string, Automation> = {
  "leadmagnet-nurture": {
    key: "leadmagnet-nurture",
    name: "AI Marketing Csomag — nurture",
    steps: [
      {
        dayOffset: 2,
        build: (ctx) => ({
          subject: "Hol kezdd a csomagot?",
          html: renderSimpleEmailHtml({
            name: ctx.name, tag: "AI Marketing Csomag", unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Ne az egészet edd meg egyszerre — kezdd itt, 15 perc az egész.",
            paragraphs: [
              "Remélem, sikerült letöltened a csomagot. Négy anyag elsőre soknak tűnhet, ezért egy tanács: ne akard egyszerre az egészet.",
              "Ha csak egy dologra van ma 15 perced, ezt válaszd: a 34 pontos önellenőrző checklistát. Menj végig rajta őszintén, és a végén pontszámot kapsz — és fekete-fehéren látod, hol a legnagyobb a rés.",
              "A legtöbb marketing nem egy nagy dolgon bukik el, hanem sok apró résen szivárog el az eredmény. A checklista pont ezeket teszi láthatóvá — a következő levelekben pedig épp az ilyenekhez adok konkrét segítséget.",
            ],
            cta: { label: "Ugrás a checklistához →", href: CHECKLIST },
          }),
        }),
      },
      {
        dayOffset: 5,
        build: (ctx) => ({
          subject: "A leggyakoribb AI-hiba a marketingben",
          html: renderSimpleEmailHtml({
            name: ctx.name, tag: "AI józanul", unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Az AI nem attól jó, hogy megnyitod. Hanem ahogy kéred.",
            paragraphs: [
              "Egy dolog, amit a legtöbb AI-tipp elhallgat: az AI önmagában általánosat ír. Semlegeset, sablonosat — pont azt, amit mindenki más is kap.",
              "A különbség nem a szuper eszközben van, hanem a kontextusban, amit adsz neki. Három dolog, amitől azonnal jobb lesz az eredmény:\n1. Szerep — mondd meg, ki legyen az AI.\n2. Célközönség — kinek szól a szöveg, milyen hangnemben.\n3. Példa — illessz be egy korábbi, jól sikerült saját szöveget.",
              "A csomagban lévő 50 prompt pont így épül fel. És egy őszinte megjegyzés: az AI gyors, de nem tévedhetetlen — a tényeket, számokat, neveket mindig ellenőrizd. Az AI eszköz, nem varázslat.",
            ],
            cta: { label: "Nézd meg a promptokat →", href: PROMPTS },
          }),
        }),
      },
      {
        dayOffset: 9,
        build: (ctx) => ({
          subject: "3 szám, amit havonta nézz (a többit hagyd)",
          html: renderSimpleEmailHtml({
            name: ctx.name, tag: "Stratégia-első", unsubscribeUrl: ctx.unsubscribeUrl,
            preheader: "Kevesebb táblázat, jobb döntések.",
            paragraphs: [
              "Sok eszközről és promptról volt szó az elmúlt hetekben. De legyünk őszinték: az eszköz önmagában nem csinál marketinget. A stratégia és a következetes mérés teszi.",
              "Nálunk van egy mondás: „Ha nincs stratégia, nincs G2A.” A gyakorlatban ez azt jelenti, hogy nem eszközlistával kezdünk, hanem a céllal — és utána nézzük, mi méri vissza.",
              "Ha egyetlen dolgot viszel el ebből a levélből: válassz 3 kulcsmutatót, és havonta csak azokat nézd. Például hány új érdeklődő jött, mennyi volt a megnyitási/átkattintási arány, és ebből hány lett tényleges ügyfél. A többi szám érdekes, de ez a három visz döntésre.",
            ],
            cta: { label: "Vissza a checklistához →", href: CHECKLIST },
          }),
        }),
      },
      {
        dayOffset: 14,
        build: (ctx) => {
          const o = offerStep(ctx);
          return {
            subject: o.subject,
            html: renderSimpleEmailHtml({
              name: ctx.name, tag: "Ingyenes konzultáció", unsubscribeUrl: ctx.unsubscribeUrl,
              preheader: "Nincs kötelezettség, nincs süket duma — csak konkrét javaslatok.",
              paragraphs: o.paragraphs,
              cta: { label: "Ingyenes konzultáció →", href: CONSULT },
            }),
          };
        },
      },
    ],
  },
};

export function getAutomation(key: string): Automation | undefined {
  return AUTOMATIONS[key];
}
