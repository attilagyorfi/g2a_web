/**
 * CloudinaryImage — drop-in <img> replacement that auto-applies WebP/AVIF
 * + responsive srcSet when the source is a Cloudinary URL.
 *
 * For non-Cloudinary URLs (e.g. /case-studies/foo/desktop.png served from
 * /public), it falls back to a plain <img> with no transforms.
 *
 * Usage:
 *   <CloudinaryImage src={caseStudy.image} alt="…" widths={[480, 768, 1280]} />
 */
import { ImgHTMLAttributes, useMemo } from "react";
import { cloudinarySrcSet, cloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "srcSet"> & {
  src: string;
  alt: string;
  /** Default render width (also used for the `src` URL). */
  width?: number;
  /** Heights stay aspect-correct via `c_limit` unless you pass `crop`. */
  height?: number;
  /** Widths to generate srcSet for. Default: [480, 768, 1280, 1920]. */
  widths?: number[];
  /** Quality — defaults to "auto" (Cloudinary picks). */
  quality?: "auto" | number;
  /** Sizes attr for responsive selection. Default: "100vw". */
  sizes?: string;
};

const DEFAULT_WIDTHS = [480, 768, 1280, 1920];

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  widths = DEFAULT_WIDTHS,
  quality = "auto",
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  ...rest
}: Props) {
  const isCld = isCloudinaryUrl(src);

  const finalSrc = useMemo(
    () => (isCld ? cloudinaryUrl(src, { width, height, quality }) : src),
    [src, width, height, quality, isCld],
  );

  const srcSet = useMemo(
    () => (isCld ? cloudinarySrcSet(src, widths, { quality }) : undefined),
    [src, widths, quality, isCld],
  );

  return (
    <img
      src={finalSrc}
      srcSet={srcSet}
      sizes={isCld ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
