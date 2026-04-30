/**
 * Cloudinary delivery URL builder (browser-side).
 *
 * Reads cloud name from VITE_CLOUDINARY_CLOUD_NAME at build time.
 * Pass either a publicId (e.g. "g2a-uploads/foo_123") or an existing
 * Cloudinary secure_url — the helper detects and rewrites either.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_HOST = "res.cloudinary.com";

export type CloudinaryOpts = {
  width?: number;
  height?: number;
  /** "auto" → q_auto (Cloudinary picks). Number 1-100 → q_<n>. */
  quality?: "auto" | number;
  /** "auto" → f_auto (browser picks WebP/AVIF). Or "webp" / "avif" / "jpg". */
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  /** Crop strategy — "limit" (don't enlarge), "fill" (crop to fit), "scale" (stretch). */
  crop?: "limit" | "fill" | "scale" | "fit";
  /** DPR multiplier — "auto" or a number. */
  dpr?: "auto" | number;
};

export function isCloudinaryUrl(url: string): boolean {
  return typeof url === "string" && url.includes(CLOUDINARY_HOST);
}

function buildTransforms(opts: CloudinaryOpts): string {
  const parts: string[] = [];
  parts.push(`f_${opts.format ?? "auto"}`);
  parts.push(`q_${opts.quality ?? "auto"}`);
  if (opts.dpr) parts.push(`dpr_${opts.dpr}`);
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  if (opts.width || opts.height) parts.push(`c_${opts.crop ?? "limit"}`);
  return parts.join(",");
}

/**
 * Returns a transformed Cloudinary URL.
 *  - If `src` is a publicId → builds `https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<publicId>`
 *  - If `src` is already a Cloudinary URL → injects transforms into the existing path
 *  - If `src` is a non-Cloudinary URL or no cloud configured → returns `src` unchanged
 */
export function cloudinaryUrl(src: string, opts: CloudinaryOpts = {}): string {
  if (!src) return src;
  if (!CLOUD_NAME) return src; // no cloud configured → passthrough

  const transforms = buildTransforms(opts);

  if (isCloudinaryUrl(src)) {
    // Inject transforms after `/image/upload/` (replacing any existing transforms)
    return src.replace(
      /\/image\/upload\/(?:[^/]+\/)?/,
      `/image/upload/${transforms}/`,
    );
  }

  // Treat as publicId
  return `https://${CLOUDINARY_HOST}/${CLOUD_NAME}/image/upload/${transforms}/${src.replace(/^\/+/, "")}`;
}

/**
 * Build a srcSet for responsive images at multiple widths.
 * Returns "<url1> 480w, <url2> 768w, <url3> 1280w" — pair with `sizes` attr.
 */
export function cloudinarySrcSet(src: string, widths: number[], opts: Omit<CloudinaryOpts, "width"> = {}): string {
  if (!CLOUD_NAME || !isCloudinaryUrl(src) && !src.includes("/")) return "";
  return widths.map((w) => `${cloudinaryUrl(src, { ...opts, width: w })} ${w}w`).join(", ");
}

/**
 * Generate a per-page Open Graph image (1200×630) with the page title rendered
 * on top of the G2A dark-padded logo background.
 *
 * Renders entirely via Cloudinary URL transformations — no server roundtrip,
 * no image baking. Browsers/Facebook/LinkedIn fetch the URL on demand.
 *
 * @param title  Title text (URL-encoded automatically). Max ~80 chars wraps OK.
 * @param subtitle  Optional smaller line (e.g. category, author). Default empty.
 *
 * @example
 *   ogImageUrl("Hogyan érdemes Google Ads-et indítani 2026-ban")
 *   → 1200×630 dark image, white centered title, G2A logo above it
 */
export function ogImageUrl(title: string, subtitle?: string): string {
  if (!CLOUD_NAME) return "";
  // Cloudinary text layers need URL-encoded text; commas become %2C, slashes %2F
  const enc = (s: string) => encodeURIComponent(s).replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/'/g, "%27");

  // Layers stacked on top of default-logo.png base:
  // - Base padded to 1200×630 with dark bg
  // - Text layer (Arial 56 bold, white) anchored south with 100px y-offset (text bottom area)
  // - Optional subtitle layer (Arial 28 regular, teal) anchored south with 60px offset
  const layers: string[] = [];
  layers.push(`l_text:Arial_56_bold:${enc(title)},co_rgb:ffffff,w_1000,c_fit,g_south,y_120`);
  if (subtitle) {
    layers.push(`l_text:Arial_28_normal:${enc(subtitle)},co_rgb:14B8A6,w_1000,c_fit,g_south,y_70`);
  }

  return `https://${CLOUDINARY_HOST}/${CLOUD_NAME}/image/upload/w_1200,h_630,c_pad,b_rgb:0a0a0a,q_auto,f_auto/${layers.join("/")}/g2a/og/default-logo.png`;
}
