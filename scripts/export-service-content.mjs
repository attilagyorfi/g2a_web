/**
 * Export the hard-coded HU service configs from
 * client/src/data/serviceConfigs.ts into a Word document the editor
 * can fill in / rewrite and hand back to us.
 *
 * Why a script rather than copy-paste: the 8 services live inside a
 * 700-line TypeScript file mixed with EN/ZH copies, so manually
 * locating just the HU half is error-prone. This script dynamically
 * imports the compiled module, walks the HU export, and writes a
 * structured .docx with proper headings, bullet lists, and tables for
 * the FAQ / process / benefits sections.
 *
 * Run: node scripts/export-service-content.mjs
 * Output: docs/szolgaltatas-tartalmak.docx
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  PageOrientation,
  PageBreak,
} from "docx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SOURCE = resolve(REPO_ROOT, "client/src/data/serviceConfigs.ts");
const OUT_DIR = resolve(REPO_ROOT, "docs");
const OUT_FILE = resolve(OUT_DIR, "szolgaltatas-tartalmak.docx");

// ─── Step 1: compile serviceConfigs.ts to JS ────────────────────────
// esbuild bundles the entire module including dependencies. We strip
// the @/contexts/LanguageContext type-only import — it's not needed at
// runtime since ServiceConfig is a structural type.
const tmpBundle = resolve(OUT_DIR, ".serviceConfigs.compiled.mjs");
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

await build({
  entryPoints: [SOURCE],
  outfile: tmpBundle,
  format: "esm",
  bundle: true,
  platform: "neutral",
  // Path alias used by client code (@/contexts/...) — resolve to the
  // actual file so esbuild doesn't choke. The import is type-only and
  // gets erased anyway, but the alias still needs to be resolvable.
  alias: {
    "@": resolve(REPO_ROOT, "client/src"),
  },
  logLevel: "silent",
});

const moduleUrl = pathToFileURL(tmpBundle).href;
const mod = await import(moduleUrl);

// Module default-exports SERVICE_CONFIGS_I18N: Record<"hu"|"en"|"zh", Record<slug, ServiceConfig>>.
const SERVICE_CONFIGS = mod.default;
const HU = SERVICE_CONFIGS?.hu;
if (!HU) {
  throw new Error("HU section not found in serviceConfigs default export — check the module shape.");
}

// ─── Step 2: build the .docx ────────────────────────────────────────
const sectionHeading = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });

const fieldLabel = (label, value) =>
  new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: value || "—", size: 22 }),
    ],
  });

const longField = (label, value) => [
  new Paragraph({
    spacing: { before: 80, after: 40 },
    children: [new TextRun({ text: label, bold: true, size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: value || "—", size: 22 })],
  }),
];

const slugs = Object.keys(HU);
const children = [];

// Title page
children.push(
  new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: "G2A Marketing — Szolgáltatás aloldal tartalmak", bold: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [
      new TextRun({ text: "Magyar nyelvű szövegezések szerkesztésre", italics: true, color: "666666" }),
    ],
  }),
  new Paragraph({
    spacing: { after: 240 },
    children: [
      new TextRun({
        text:
          "Ez a dokumentum a 8 hard-coded szolgáltatás aloldal jelenlegi magyar nyelvű tartalmát tartalmazza, abban a sorrendben, ahogy az oldalon megjelenik. Minden bejegyzés a serviceConfigs.ts-ben szerkesztendő — szerkeszthetsz közvetlenül ebbe a dokumentumba (track changes vagy szöveg-csere), és visszaadhatod nekem feltöltésre. ",
        size: 22,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 240 },
    children: [
      new TextRun({ text: "Szolgáltatások a dokumentumban:", bold: true, size: 22 }),
    ],
  }),
);

// TOC-style list
slugs.forEach((slug, i) => {
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: `${i + 1}. `, bold: true, size: 22 }),
        new TextRun({ text: HU[slug].title, size: 22 }),
        new TextRun({ text: `  (slug: ${slug})`, color: "888888", size: 20 }),
      ],
    }),
  );
});

children.push(new Paragraph({ children: [new PageBreak()] }));

// ─── Per-service content ────────────────────────────────────────────
slugs.forEach((slug, idx) => {
  const svc = HU[slug];

  // Service title block
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      children: [new TextRun({ text: `${idx + 1}. ${svc.title}`, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: "URL: ", bold: true, color: "888888", size: 20 }),
        new TextRun({ text: `/szolgaltatasok/${svc.slug}`, color: "555555", size: 20 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Alcím: ", bold: true, size: 22 }),
        new TextRun({ text: svc.subtitle, size: 22 }),
      ],
    }),
  );

  // SEO block
  children.push(sectionHeading("SEO meta-adatok"));
  children.push(fieldLabel("Meta cím", svc.metaTitle));
  children.push(fieldLabel("Meta leírás", svc.metaDesc));

  // Hero block
  children.push(sectionHeading("Hero leírás"));
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: svc.heroDesc, size: 22 })],
    }),
  );

  // Intro block
  children.push(sectionHeading("Bevezető (intro)"));
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: svc.intro, size: 22 })],
    }),
  );

  // Benefits block
  children.push(sectionHeading(`Előnyök (${svc.benefits.length} db)`));
  svc.benefits.forEach((b, i) => {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({ text: `${i + 1}. ${b.title}`, bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: b.desc, size: 22 })],
      }),
    );
  });

  // Process block
  children.push(sectionHeading(`Folyamat (${svc.process.length} lépés)`));
  svc.process.forEach((p) => {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({ text: `${p.step} — `, bold: true, color: "14B8A6", size: 22 }),
          new TextRun({ text: p.title, bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: p.desc, size: 22 })],
      }),
    );
  });

  // FAQ block
  children.push(sectionHeading(`GYIK (${svc.faq.length} kérdés)`));
  svc.faq.forEach((f, i) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: `K${i + 1}: `, bold: true, color: "14B8A6", size: 22 }),
          new TextRun({ text: f.q, bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: "V: ", bold: true, size: 22 }),
          new TextRun({ text: f.a, size: 22 }),
        ],
      }),
    );
  });

  // CTA block
  children.push(sectionHeading("Záró CTA mondat"));
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: svc.cta, italics: true, size: 22 })],
    }),
  );

  // Page break between services (not after the last)
  if (idx < slugs.length - 1) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Calibri" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 30, bold: true, font: "Calibri", color: "14B8A6" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "555555" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }, // 2cm
        },
      },
      children,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT_FILE, buffer);

// Clean up tmp bundle
import("node:fs").then(({ unlinkSync }) => {
  try { unlinkSync(tmpBundle); } catch {}
});

console.log(`✓ ${slugs.length} szolgáltatás exportálva: ${OUT_FILE}`);
console.log(`  Méret: ${(buffer.length / 1024).toFixed(1)} KB`);
