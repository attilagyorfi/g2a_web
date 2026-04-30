/**
 * Generate docs/brand-brief.docx from the Markdown source.
 * Run: node docs/.build-brand-brief-docx.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType,
  PageOrientation, LevelFormat, TabStopType, TabStopPosition,
  ExternalHyperlink, PageBreak,
} from "docx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "brand-brief.docx");

// ─── Style helpers ───────────────────────────────────────────────────────────
const BRAND_TEAL = "14B8A6";
const TEXT_PRIMARY = "1f2937";
const TEXT_SECONDARY = "6b7280";
const TEXT_MUTED = "9ca3af";
const ACCENT_BG = "F0FDFA"; // teal-50

const FONT = "Arial"; // safest fallback; Geist not installed by default in Word

const border = { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" };
const cellBorders = { top: border, bottom: border, left: border, right: border };

function p(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text, font: FONT, size: opts.size ?? 22, color: opts.color ?? TEXT_PRIMARY, bold: opts.bold, italics: opts.italics })];
  return new Paragraph({
    children: runs,
    spacing: opts.spacing ?? { before: 60, after: 80, line: 320 },
    alignment: opts.align ?? AlignmentType.LEFT,
    indent: opts.indent,
  });
}

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 44, bold: true, color: TEXT_PRIMARY })],
    spacing: { before: 320, after: 180 },
    heading: HeadingLevel.HEADING_1,
  });
}
function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 32, bold: true, color: TEXT_PRIMARY })],
    spacing: { before: 280, after: 140 },
    heading: HeadingLevel.HEADING_2,
  });
}
function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: TEXT_PRIMARY })],
    spacing: { before: 240, after: 100 },
    heading: HeadingLevel.HEADING_3,
  });
}
function h4(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: BRAND_TEAL })],
    spacing: { before: 180, after: 60 },
    heading: HeadingLevel.HEADING_4,
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, color: TEXT_PRIMARY, ...opts })],
    bullet: { level: 0 },
    spacing: { before: 30, after: 30, line: 320 },
  });
}

function num(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22, color: TEXT_PRIMARY })],
    numbering: { reference: "ord", level: 0 },
    spacing: { before: 30, after: 30, line: 320 },
  });
}

function divider() {
  return new Paragraph({
    children: [new TextRun({ text: "" })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_TEAL, space: 1 } },
    spacing: { before: 200, after: 200 },
  });
}

function code(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Consolas", size: 18, color: TEXT_PRIMARY })],
    spacing: { before: 60, after: 60, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: "F4F4F5" },
    indent: { left: 200, right: 200 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 4 },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 4 },
      left: { style: BorderStyle.SINGLE, size: 6, color: BRAND_TEAL, space: 4 },
      right: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 4 },
    },
  });
}

function muted(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 18, color: TEXT_MUTED, italics: true })],
    spacing: { before: 40, after: 40 },
  });
}

// Table builder — header row teal, body rows alternating
function table(headers, rows) {
  const totalWidth = 9000; // DXA, US Letter content width minus margin
  const colCount = headers.length;
  const colWidth = Math.floor(totalWidth / colCount);

  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: Array(colCount).fill(colWidth),
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h) => new TableCell({
          borders: cellBorders,
          width: { size: colWidth, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: BRAND_TEAL },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: FONT, size: 20, bold: true, color: "FFFFFF" })], spacing: { before: 0, after: 0 } })],
        })),
      }),
      ...rows.map((r, i) => new TableRow({
        children: r.map((cell) => new TableCell({
          borders: cellBorders,
          width: { size: colWidth, type: WidthType.DXA },
          shading: i % 2 === 1 ? { type: ShadingType.CLEAR, fill: "F9FAFB" } : undefined,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: cellToParas(cell),
        })),
      })),
    ],
  });
}

function cellToParas(cell) {
  if (Array.isArray(cell)) return cell;
  const text = String(cell ?? "");
  // Detect inline `code` (backticks) and emphasize
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return [new Paragraph({
    children: parts.map((part) => part.startsWith("`") && part.endsWith("`")
      ? new TextRun({ text: part.slice(1, -1), font: "Consolas", size: 18, color: BRAND_TEAL })
      : new TextRun({ text: part, font: FONT, size: 18, color: TEXT_PRIMARY })
    ),
    spacing: { before: 0, after: 0, line: 280 },
  })];
}

// ─── Document body ───────────────────────────────────────────────────────────
const children = [
  // Title page
  new Paragraph({
    children: [new TextRun({ text: "G2A Marketing", font: FONT, size: 28, bold: true, color: BRAND_TEAL })],
    spacing: { before: 1800, after: 100 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [new TextRun({ text: "Arculati kézikönyv brief", font: FONT, size: 56, bold: true, color: TEXT_PRIMARY })],
    spacing: { before: 0, after: 200 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [new TextRun({ text: "Készítette: G2A Marketing Bt.", font: FONT, size: 22, color: TEXT_SECONDARY })],
    spacing: { before: 400, after: 60 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [new TextRun({ text: "Verzió 1.0 · 2026", font: FONT, size: 22, color: TEXT_SECONDARY })],
    spacing: { before: 0, after: 60 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [new TextRun({ text: "Címzett: Arculattervező / Brand Designer", font: FONT, size: 22, color: TEXT_SECONDARY })],
    spacing: { before: 0, after: 1800 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({ children: [new PageBreak()] }),

  // 0
  h1("0. A megrendelt feladat összefoglalása"),
  p("A weboldal (https://g2amarketing.hu) jelenleg él, és tartalmazza a kialakult vizuális nyelv 90%-át. A te feladatod ennek a meglévő nyelvnek a kodifikálása — szabványosítása, kiterjesztése nyomdai/printes/merchandise használatra, valamint a brand-tér letisztázása és bővítése (logó-családra, példákra, do/don't iránymutatásra)."),
  p("A cél: olyan PDF kézikönyv (~30-50 oldal), amelyet egy másik designer, nyomdai partner vagy social media kezelő pillanatok alatt tudja használni."),
  h3("A kézikönyvben szerepeljen:"),
  num("Brand pozicionálás összefoglaló (1 oldal)"),
  num("Logó-rendszer (alap + variációk + minimum méret + clear space + tiltott használatok)"),
  num("Színpaletta (primer + szekunder + tonal + funkcionális hibajelző színek, HEX/RGB/CMYK/Pantone)"),
  num("Tipográfia (font család, hierarchia, fő- és másodlagos formátumok)"),
  num("Ikonográfia stílus"),
  num("Képi világ irányelvek"),
  num("Komponens-galéria"),
  num("Hangnem (te-forma magyarul, példák jó/rossz copyra)"),
  num("Alkalmazási példák — letterhead, névjegy, prezentáció, social sablonok, e-mail aláírás, merchandise"),
  num("Mit kerülni kell (anti-patterns)"),
  p([new TextRun({ text: "Output formátum: ", font: FONT, size: 22, bold: true, color: TEXT_PRIMARY }), new TextRun({ text: "PDF (nyomdai print-ready + képernyős verzió), forrásfájlok (Figma vagy Adobe Illustrator/InDesign), letölthető logó-csomag (SVG, PNG transparent, EPS, Pantone-os).", font: FONT, size: 22, color: TEXT_PRIMARY })]),
  divider(),

  // 1
  h1("1. Cég-háttér"),
  table(
    ["Adat", "Érték"],
    [
      ["Cégnév (jogi)", "G2A Marketing Betéti Társaság"],
      ["Cégnév (rövid)", "G2A Marketing"],
      ["Alapítva", "2022"],
      ["Székhely", "Pécs, Magyarország"],
      ["Iparág", "B2B marketing ügynökség"],
      ["Méret", "Kis cég (boutique agency)"],
      ["Vezérigazgató", "Győrfi Attila"],
      ["Kapcsolat", "info@g2amarketing.hu · +36 30 190 2575"],
      ["Web", "https://g2amarketing.hu"],
      ["Domain-struktúra", "hu (alap), /en, /zh (angol és kínai oldal)"],
    ],
  ),
  h3("Mit kínál"),
  p("12 szolgáltatási vertikál: Lokalizáció, Arculattervezés, Hirdetéskezelés (PPC/Meta), Közösségi média, Stratégiai marketing, SEO, Webfejlesztés, AI Marketing, Marketing Automatizáció, ESG Kommunikáció, Employer Branding, Nemzetközi marketing."),
  h3("Iparági fókuszok (8)"),
  p("Egészségügy, Szépségipar, Mérnöki irodák, Autóipar, Jogi, Technológia, Önkormányzati projektek, B2B általában."),
  divider(),

  // 2
  h1("2. Brand pozicionálás"),
  h3("Egy mondatban"),
  p([new TextRun({ text: "Adatvezérelt, AI-alapú prémium B2B marketing ügynökség, amely Pécsről és Magyarországról szolgál ki közép- és nagyvállalati ügyfeleket — magyar, angol és kínai nyelven egyaránt.", font: FONT, size: 22, italics: true, color: TEXT_PRIMARY })]),
  h3("Brand-személyiség (5 jelző)"),
  num("Profi — nem amatőr, nem hipszter; olyan partnernek látszunk, aki mérlegelt döntéseket hoz"),
  num("Adatvezérelt — minden állítás mérhető eredménnyel támasztott alá; nincsenek üres marketing-szlogenek"),
  num("Nyitott / megközelíthető — te-forma, közvetlen, nem önözős"),
  num("Modern / előremutató — AI, automatizáció, multilingual workflow integrálva"),
  num("Pécsi gyökerek, nemzetközi nyitottság — büszke a vidéki bázisra, de nem provincial"),
  h3("Brand-tónus a versenytársakhoz képest"),
  bullet("NEM start-up \"diszruptív\" energiabomba"),
  bullet("NEM korporatív szürke"),
  bullet("NEM \"marketing-bullshit\" túlcsorduló buzzword-zuhatag"),
  p([new TextRun({ text: "Inkább: ", font: FONT, size: 22, color: TEXT_PRIMARY }), new TextRun({ text: "érett, mértéktartó, kompetens", font: FONT, size: 22, bold: true, color: BRAND_TEAL }), new TextRun({ text: " — mint egy senior tanácsadó, aki tényleg tudja a számokat.", font: FONT, size: 22, color: TEXT_PRIMARY })]),
  h3("Mit ígérünk az ügyfélnek"),
  bullet("Mérhető növekedés — KPI-k, riportok, ROI"),
  bullet("Stratégiai szemlélet — nem hirdetésvásárlás, hanem rendszer"),
  bullet("Egy kézből — full-stack: stratégia → kreatív → implementáció → mérés"),
  bullet("Multikulturális kompetencia — magyar/EU/nemzetközi/kínai piacok"),
  divider(),

  // 3
  h1("3. Célközönség"),
  table(
    ["Persona", "Profil"],
    [
      ["Elsődleges", "KKV ügyvezető vagy marketing-vezető, 35-55 év, Magyarország, 2-50 M Ft/év marketing-büdzsé"],
      ["Másodlagos", "Nemzetközi expanziót tervező magyar cég vezetője (EN/ZH oldalakat ezeknek készítettük)"],
      ["Iparági fókusz", "Egészségügy, mérnöki, jogi, technológia, autóipari, szépségipari, önkormányzati B2B"],
    ],
  ),
  p([new TextRun({ text: "Kommunikációs preferencia: ", font: FONT, size: 22, bold: true, color: TEXT_PRIMARY }), new TextRun({ text: "Te-forma, magyaros, professzionális. Jellemző érintési pont: LinkedIn, Google keresés, ajánlás. NEM TikTok-natív Z-gen.", font: FONT, size: 22, color: TEXT_PRIMARY })]),
  divider(),

  // 4
  h1("4. Logó"),
  h3("Jelenlegi állapot"),
  p('A jelenlegi logó egy fehér színű, transzparens hátterű "G2A" betűkombináció. Tárolva: Cloudinary CDN-en (g2a/og/default-logo.png — 512×512 PNG, fehér-on-átlátszó).'),
  p([new TextRun({ text: "URL: ", font: FONT, size: 20, color: TEXT_SECONDARY }), new ExternalHyperlink({ children: [new TextRun({ text: "https://res.cloudinary.com/dzh1unb6d/image/upload/g2a/og/default-logo.png", font: FONT, size: 20, color: BRAND_TEAL, underline: {} })], link: "https://res.cloudinary.com/dzh1unb6d/image/upload/g2a/og/default-logo.png" })]),
  h3("Mit várunk a designertől"),
  num("Vektorizálás — vector forma (SVG + AI/EPS) létrehozása. Ha a meglévő tetszik: 100% Pantone + CMYK-ra konvertálva."),
  num("Logó-család (variációk):"),
  bullet("Primary (alapforma, sötét háttéren fehér)"),
  bullet("Sötét háttéren teal (a brand szín, kiemelten)"),
  bullet("Világos háttéren sötét (print, levélpapír, fehér háttér)"),
  bullet("Monogramma / favicon (csak \"G\" vagy \"G2A\" rövid forma — app icon, social profile)"),
  bullet("Vízszintes / lockup variáció (logó + tagline egy sorban, levélpapírhoz)"),
  bullet("Vertikális variáció (logó felett/alatt tagline, social profile)"),
  num("Clear space szabály — minimum üres tér a logó körül (pl. fél × az \"G\" magasság minden irányban)"),
  num("Minimum méret — print és digital külön (pl. min. 24px digital, min. 12mm print)"),
  num("Tiltott használatok példákkal: ne torzítsd, ne forgasd random szögbe, ne színezd át, ne tedd alacsony kontrasztú háttérre"),
  divider(),

  // 5
  h1("5. Színpaletta"),
  p("A weboldalon dual-mode (sötét + világos) működik. Mindkettő teljesen egyenrangú — a designernek mindkettőt szabványosítania kell."),
  h3("Primary (jelszín)"),
  table(
    ["Token", "Sötét mód", "Világos mód", "Megjegyzés"],
    [
      ["Brand teal", "#14B8A6 (teal-500)", "#14B8A6 (közös)", "Gomb, link, kiemelés, CTA"],
      ["Brand teal — dark/hover", "#0D9488 (teal-600)", "#0F766E (teal-700)", "Hover, gradiens vége"],
    ],
  ),
  p([new TextRun({ text: "OKLCH egyenérték: ", font: FONT, size: 20, color: TEXT_SECONDARY }), new TextRun({ text: "oklch(0.71 0.13 184)", font: "Consolas", size: 20, color: BRAND_TEAL })]),
  p([new TextRun({ text: "Pantone közelítés: ", font: FONT, size: 20, color: TEXT_SECONDARY }), new TextRun({ text: "3262 C / 3265 C tájékán — a designer véglegesíti", font: FONT, size: 20, color: TEXT_PRIMARY })]),

  h3("Háttér / felület — sötét mód"),
  table(
    ["Token", "HEX", "Felhasználás"],
    [
      ["Background base", "#0f0f0f", "Oldal háttér"],
      ["Background secondary", "#141414", "Section váltás"],
      ["Background tertiary", "#1a1a1a", "Admin sidebar, kártya csoport"],
      ["Card", "#1e1e1e", "Kártya alap"],
      ["Card hover", "#242424", "Kártya hover"],
      ["Border", "rgba(255,255,255,0.08)", "Vékony elválasztó"],
    ],
  ),

  h3("Háttér / felület — világos mód"),
  table(
    ["Token", "HEX", "Felhasználás"],
    [
      ["Background base", "#f8f9fa", "Oldal háttér"],
      ["Background secondary", "#ffffff", "Section váltás"],
      ["Background tertiary", "#f0f1f3", "Csoport háttér"],
      ["Card", "#ffffff", "Kártya alap"],
      ["Card hover", "#f5f6f8", "Kártya hover"],
      ["Border", "rgba(15,15,15,0.08)", "Vékony elválasztó"],
    ],
  ),

  h3("Szöveg színek"),
  table(
    ["Mód", "Primary", "Secondary", "Muted", "Accent"],
    [
      ["Sötét", "#ffffff", "#b0b0b0", "#666666", "#14B8A6"],
      ["Világos", "#0f172a", "#475569", "#94a3b8", "#0d9488"],
    ],
  ),

  h3("Funkcionális (állapot) színek"),
  table(
    ["Állapot", "HEX", "Felhasználás"],
    [
      ["Hiba", "#ef4444 (red-500)", "Form-validáció, törlés gomb"],
      ["Figyelmeztetés", "#f59e0b (amber-500)", "Vázlat státusz"],
      ["Siker", "#10b981 (emerald-500)", "Form siker"],
      ["Info", "#3b82f6 (blue-500)", "Kék kiegészítő"],
    ],
  ),

  h3("Glass-morphism kártya (üveg-effekt)"),
  p("A weboldal egyik vizuális védjegye a félig átlátszó \"üveg\" kártya gauss blur + vékony border + szubtilis teal glow-val:"),
  code("Sötét: rgba(20,20,22,0.75) + backdrop-blur(18px) + 1px border rgba(255,255,255,0.08)"),
  code("Világos: rgba(255,255,255,0.78) + backdrop-blur(18px) + 1px border rgba(15,23,42,0.10)"),
  muted("Designernek: ezt nyomtatott felületekre nem közvetlenül lehet leképezni; ott vékony border + finom árnyék formára kell egyszerűsíteni."),
  divider(),

  // 6
  h1("6. Tipográfia"),
  h3("Font család"),
  table(
    ["Szerep", "Font", "Forrás"],
    [
      ["Primer (sans)", "Geist", "Vercel — Google Fonts (Geist:wght@100..900)"],
      ["Mono (display + kód)", "Geist Mono", "Vercel — Google Fonts (Geist+Mono:wght@100..900)"],
    ],
  ),
  p("Mind a kettő változó (variable) font, ingyenes (SIL OFL licenc). Latin-1 + cyrillic + cjk fallback (Noto Sans CJK kínai oldalon)."),

  h3("Tipográfiai hierarchia"),
  table(
    ["Stílus", "Font", "Méret", "Súly", "Felhasználás"],
    [
      ["Hero H1", "Geist", "40-80px (clamp 6vw)", "700-800", "Oldal főcím"],
      ["Section H2", "Geist", "32-56px (clamp 4vw)", "700", "Szekció címe"],
      ["Sub H3", "Geist", "20-28px (clamp 2vw)", "600-700", "Alpont"],
      ["Body", "Geist", "15px", "400", "Bekezdés"],
      ["Body small", "Geist", "14px", "400", "Méta, hint"],
      ["Section label", "Geist Mono", "12px UPPERCASE", "600", "\"SZOLGÁLTATÁSOK\", \"REFERENCIÁK\""],
      ["KPI nagy szám", "Geist", "40-56px", "700-800", "+340%, 98%"],
      ["Tag / chip", "Geist Mono", "10-11px UPPERCASE", "600", "AI, SEO, PPC"],
    ],
  ),

  h3("Hangsúlyok"),
  bullet("Letter-spacing: section label-eken 0.08-0.1em (légiesség); minden más default"),
  bullet("Line-height: bekezdésen 1.7-1.85 (kiemelten olvasható), címsorban 1.1-1.3"),
  bullet("Font features: tabular-nums KPI számokon (mind egy szélességű)"),
  divider(),

  // 7
  h1("7. Ikonográfia"),
  bullet("Stílus: minden ikon line-style (vékony körvonalas), nem solid"),
  bullet("Forrás: Lucide Icons (lucide.dev) — ingyenes, MIT licenc, ~1500+ ikon"),
  bullet("Stroke: 1.5-2px (Lucide alapértelmezett); print esetén min. 0.75pt"),
  bullet("Színhasználat: ikonok currentColor-t öröklik a környező szövegtől"),

  h3("Standard méretek"),
  table(
    ["Kontextus", "Méret"],
    [
      ["Inline szöveg", "11-13px"],
      ["Gomb / link", "14-16px"],
      ["Kártya kiemelés", "22-28px"],
      ["Hero illusztráció", "40-64px"],
    ],
  ),
  divider(),

  // 8
  h1("8. Vizuális minták / kompozíciós elemek"),
  h3("Animált háttér-elemek"),
  bullet("AnimatedBlobs: 3-4 organikus radial-gradient blob lassú lebegéssel. Print-ben: szubtilis halvány teal sugárzó pötty hideg sarokban"),
  bullet("PolygonNetwork: vékony vonalakkal összekötött pontok (sci-fi networking esztétika). Print-ben: 3pt grid sub-tilis árnyalattal"),
  bullet("GrainOverlay: 5%-os film grain — designer adjon analóg, papírosabb érzetet a printnek is"),

  h3("Hero illusztrációk"),
  p("FloatingDashboard: lebegő \"dashboard kártyák\" gyűjteménye (KPI, mini bar chart, AI badge, lead notification, progress ring). Designer ezt prezentációba és case study sablonba is beleépítheti."),

  h3("Case study screenshot komponálás"),
  p("16:9 desktop screenshot, tetején színes kis sáv (iparág-szín), sarokban kerek/lekerekített négyzet logó-keret, fehér háttér. Designer feladata egységes laptop / mobile mockup sablon."),
  divider(),

  // 9
  h1("9. UI komponens-galéria"),
  h3("Gombok"),
  table(
    ["Gomb", "Háttér", "Border", "Szín", "Border-radius"],
    [
      ["Primary", "#14B8A6 (solid teal)", "nincs", "#ffffff", "6px"],
      ["Secondary (sötét)", "transparent", "1px rgba(255,255,255,0.15)", "#b0b0b0", "6px"],
      ["Secondary (világos)", "transparent", "1px rgba(15,15,15,0.15)", "#475569", "6px"],
      ["Destructive", "#ef4444", "nincs", "#ffffff", "5px"],
      ["Linkkel", "transparent", "nincs", "#14B8A6 underline", "—"],
    ],
  ),
  p([new TextRun({ text: "Padding: ", font: FONT, size: 20, bold: true, color: TEXT_PRIMARY }), new TextRun({ text: "0.9rem × 1.875rem (≈ 14×30px)", font: FONT, size: 20, color: TEXT_PRIMARY })]),
  p([new TextRun({ text: "Hover: ", font: FONT, size: 20, bold: true, color: TEXT_PRIMARY }), new TextRun({ text: "2px translateY-up + sötétebb háttér + box-shadow 0 6px 20px -4px rgba(20,184,166,0.4)", font: FONT, size: 20, color: TEXT_PRIMARY })]),
  p([new TextRun({ text: "Font: ", font: FONT, size: 20, bold: true, color: TEXT_PRIMARY }), new TextRun({ text: "Geist 600 / 0.9375rem (15px)", font: FONT, size: 20, color: TEXT_PRIMARY })]),

  h3("Kártyák"),
  bullet("Standard kártya: radial-gradient teal sub-tilis sarokból + linear-gradient világos felülről + var(--g2a-bg-card) háttér. Border-radius 12px, padding 1.5-2rem"),
  bullet("Glass-morphism kártya (a hős szekciók védjegye): félig átlátszó + backdrop-blur 18px"),

  h3("Tag / kategória chip színváltozatok"),
  table(
    ["Kategória", "HEX"],
    [
      ["AI", "#8b5cf6 (violet-500)"],
      ["SEO", "#14B8A6 (teal-500) ← brand"],
      ["PPC", "#3b82f6 (blue-500)"],
      ["Tartalom", "#f59e0b (amber-500)"],
      ["Brand", "#ec4899 (pink-500)"],
      ["Stratégia", "#10b981 (emerald-500)"],
    ],
  ),
  muted("Designer kibővítheti ezt egy formális kategóriás színrendszerre (pl. ESG kommunikációhoz külön zöld)."),

  h3("Layout grid"),
  bullet("Kontener max-width: 1200-1280px (centered)"),
  bullet("Padding: 2rem (≈ 32px) bal/jobb mobile-on, csökken desktop-on"),
  bullet("Breakpointok: 640 / 768 / 1024 / 1280px (Tailwind alap)"),
  bullet("Vertical rhythm: szekciók közt 5rem (80px) padding"),
  divider(),

  // 10
  h1("10. Hangnem (Tone of Voice)"),
  h3("Magyar nyelvű kommunikáció"),
  p([new TextRun({ text: "KÖTELEZŐ szabály: TE-FORMA. ", font: FONT, size: 22, bold: true, color: "EF4444" }), new TextRun({ text: "SOHA NEM \"ön\"-formát használunk a látogató felé.", font: FONT, size: 22, color: TEXT_PRIMARY })]),
  p([new TextRun({ text: "✅ Helyes: ", font: FONT, size: 22, bold: true, color: "10B981" }), new TextRun({ text: "\"Tudd meg, hogyan\", \"Kérj ajánlatot\", \"Indítsd el\", \"Hozzunk eredményt\"", font: FONT, size: 22, color: TEXT_PRIMARY })]),
  p([new TextRun({ text: "❌ Helytelen: ", font: FONT, size: 22, bold: true, color: "EF4444" }), new TextRun({ text: "\"Tudja meg\", \"Kérjen ajánlatot\", \"Indítsa el\"", font: FONT, size: 22, color: TEXT_PRIMARY })]),

  h3("Hangulat"),
  bullet("Profi, de barátságos"),
  bullet("Konkrét számokra utal: \"+340% organikus forgalom\", \"67% több időpontfoglalás\""),
  bullet("Kerüli a szuperlatívuszokat: \"legjobb!\", \"csodás!\", \"fantasztikus!\""),
  bullet("Magabiztos, de nem agresszív"),

  h3("Példák jó copyra"),
  bullet("\"Stratégiai marketing, mérhető növekedés\" — érték + bizonyíték"),
  bullet("\"Hozzunk eredményt — egy kézből\" — közös vállalás + USP"),
  bullet("\"30 perces ingyenes konzultáció — kötelezettség nélkül, az időpontot te választod\" — kötetlenség + felhasználói kontroll"),

  h3("Példák rossz (kerülendő) copyra"),
  bullet("\"🚀 Robbantsd fel a marketinged 🚀\" — túl emoji-gazdag, túl start-up"),
  bullet("\"Tisztelt Cégvezető Úr! Ön a legjobb döntést hozhatja meg ma...\" — fagyos, magázós, hosszú"),
  bullet("\"Garantáljuk a #1 helyet a Google-ben!\" — semmit nem garantálhatunk"),

  h3("Idegen nyelvi változatok"),
  bullet("EN: same vibe, \"you\" form (which English defaults to)"),
  bullet("ZH (kínai): formálisabb hangnem (\"您\" formal you) — kulturálisan elvárt"),
  divider(),

  // 11
  h1("11. Jelenlegi alkalmazási példák"),
  h3("Digitális — kész"),
  bullet("Weboldal (élő)"),
  bullet("Admin felület"),
  bullet("Email kampány HTML sablon"),
  bullet("Welcome email transzakcionális"),
  bullet("Cookie banner"),
  bullet("Open Graph image (1200×630, sötét + középre helyezett logo)"),
  bullet("Favicon (kerek 256×256)"),

  h3("Hiányzó alkalmazások — ezeket a kézikönyv tartalmazza majd"),
  bullet("Levélpapír (A4)"),
  bullet("Névjegykártya (85×55mm)"),
  bullet("Mappa / dosszié borító"),
  bullet("Prezentáció master (PowerPoint / Keynote / Google Slides)"),
  bullet("E-mail signature sablon"),
  bullet("LinkedIn cég cover (1192×220)"),
  bullet("Facebook cég cover (820×312)"),
  bullet("Instagram poszt sablon (1080×1080) + story (1080×1920)"),
  bullet("Google Profile cover, YouTube banner (2560×1440)"),
  bullet("Polo / pulóver hímzés-elrendezés"),
  bullet("Toll, jegyzetfüzet branding"),
  bullet("Konferenciai roll-up (85×200cm)"),
  bullet("Print magazinhirdetés (A5 + A4)"),
  divider(),

  // 12
  h1("12. Mit kerülni kell (anti-patterns)"),
  table(
    ["Tilos", "Miért", "Helyett"],
    [
      ["Logót gradient-tel kitölteni", "A meglévő solid teal a brand-jel", "Solid #14B8A6"],
      ["Comic Sans / Times New Roman", "Off-brand", "Geist + Geist Mono"],
      ["Stock fotó \"üzletemberek kézzel mutogatnak\"", "Klisé, korporatív", "Saját case study screenshot, dashboard mockup"],
      ["Felirat csupa nagybetűvel egész bekezdésen", "Nehéz olvasni", "Csak section label / tag chipek"],
      ["Élénk magenta / sárga / lila a brand mellett", "Szín-keverés", "Tartsd a teal vezérszínhez"],
      ["3+ font keverése egy felületen", "Vizuális zaj", "Max 2 font: Geist + Geist Mono"],
      ["\"Kattints ide!\" CTA", "Nem érthető önmagában (a11y)", "\"Kérj ingyenes auditot\""],
    ],
  ),
  divider(),

  // 13
  h1("13. Időkeret és deliverable struktúra"),
  h3("Javasolt menetrend (irányadó)"),
  table(
    ["Fázis", "Időtartam", "Output"],
    [
      ["1. Felfedezés (kickoff, brainstorm, mood board)", "1 hét", "Mood board + 3 logó-irány"],
      ["2. Logó iteráció", "1-2 hét", "Végleges logó vector + család"],
      ["3. Színpaletta & tipográfia formalizálás", "1 hét", "Pantone / CMYK / RGB chart"],
      ["4. Komponens-galéria és print sablonok", "2 hét", "Levélpapír, névjegy, social, prezentáció master"],
      ["5. Brand book összeszerkesztés (PDF)", "1 hét", "Végleges 30-50 oldalas PDF + forrásfájlok"],
    ],
  ),

  h3("Deliverable csomag"),
  bullet("Brand Book PDF (nyomdai print-ready + képernyős verzió)"),
  bullet("Forrásfájlok (Figma vagy Adobe Illustrator/InDesign — szerkeszthető)"),
  bullet("Logó-csomag: SVG, PNG (1×, 2×, 3×, transparent), EPS (vector, print-ready), Pantone-os AI"),
  bullet("Font-license dokumentáció (Geist a SIL OFL alatt szabad — print-re is)"),
  bullet("Color tokens JSON (a fejlesztők importálni fogják, hogy design-tokenek és kód szinkron maradjon)"),
  divider(),

  // 14
  h1("14. Költségvetés és kapcsolat"),
  p("A designer ajánlatát kérjük a fenti deliverable csomag alapján."),
  h3("Kontakt"),
  bullet("Győrfi Attila"),
  bullet("info@g2amarketing.hu"),
  bullet("+36 30 190 2575"),

  h3("Referenciák"),
  bullet("Élő weboldal: https://g2amarketing.hu"),
  bullet("Admin felület designja: a tervezőnek videó-bemutató küldhető"),
  bullet("28 esettanulmány a referenciák oldalon — ügyfél-oldali branding mintaként"),
  divider(),

  // Summary
  h1("Függelék — gyors hivatkozási pont"),
  h3("Brand-szín színek egy mondatban"),
  p([new TextRun({ text: "Sötét teal (#14B8A6) brand teal-500 alapszín, sötét háttéren #0f0f0f, világos háttéren #f8f9fa. Geist sans + Geist Mono fontok. Lucide line ikonok. Glass-morphism kártyák. Te-formás magyar copy.", font: FONT, size: 22, bold: true, color: TEXT_PRIMARY })]),

  h3("A weboldalon megfigyelhető védjegyek"),
  num("Sötét default mód (a látogatók 90%-a így lát)"),
  num("Glass-morphism kártya halvány teal glow-val"),
  num("Animált blobok lebegnek a hős szekciókban"),
  num("Section label Geist Mono UPPERCASE, letter-spacing 0.1em"),
  num("KPI nagy szám (+340%, 98%) Geist 700, percent kis méretben teal-ben"),
  num("Te-forma mindenhol magyarul"),

  new Paragraph({
    children: [new TextRun({ text: "Jelen brief verzió: 1.0 — 2026.04.30", font: FONT, size: 18, italics: true, color: TEXT_MUTED })],
    spacing: { before: 600 },
    alignment: AlignmentType.CENTER,
  }),
];

const doc = new Document({
  creator: "G2A Marketing Bt.",
  title: "G2A Marketing — Arculati kézikönyv brief",
  description: "Brief a brand designer számára, a meglévő weboldal vizuális nyelvének kodifikálásához.",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 44, bold: true, font: FONT, color: TEXT_PRIMARY },
        paragraph: { spacing: { before: 320, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: TEXT_PRIMARY },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: FONT, color: TEXT_PRIMARY },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2 } },
      { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: FONT, color: BRAND_TEAL },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 3 } },
    ],
  },
  numbering: {
    config: [
      { reference: "ord",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter (or close to A4)
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }, // 0.75" margins
      },
    },
    children,
  }],
});

const buf = await Packer.toBuffer(doc);
writeFileSync(OUT, buf);
console.log("✓ Wrote", OUT, `(${(buf.length / 1024).toFixed(1)} KB)`);
