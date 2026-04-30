/**
 * Cloudinary bridge — image uploads + delivery URL transforms.
 *
 * Env:
 *   CLOUDINARY_URL          cloudinary://<api_key>:<api_secret>@<cloud_name>
 *   VITE_CLOUDINARY_CLOUD_NAME  (browser-side; mirror of cloud_name from above)
 *
 * Server-side signed upload — no SDK dependency, uses crypto.createHash("sha1").
 * Cloudinary signature spec: https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
 */
import { createHash } from "node:crypto";
import { ENV } from "./env";

type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };

let cached: CloudinaryConfig | null = null;

export function isCloudinaryConfigured(): boolean {
  return Boolean(ENV.cloudinaryUrl) || Boolean(parseConfig());
}

function parseConfig(): CloudinaryConfig | null {
  if (cached) return cached;
  const raw = ENV.cloudinaryUrl;
  if (!raw) return null;
  // cloudinary://<api_key>:<api_secret>@<cloud_name>
  const m = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) {
    console.warn("[Cloudinary] Invalid CLOUDINARY_URL format — expected cloudinary://key:secret@cloud_name");
    return null;
  }
  cached = { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  return cached;
}

function getConfig(): CloudinaryConfig {
  const c = parseConfig();
  if (!c) throw new Error("Cloudinary not configured — set CLOUDINARY_URL in .env");
  return c;
}

/** Sort params alphabetically, build the signing string `k1=v1&k2=v2` + secret, SHA1. */
function signParams(params: Record<string, string | number>, secret: string): string {
  const sorted = Object.keys(params).sort();
  const toSign = sorted.map((k) => `${k}=${params[k]}`).join("&") + secret;
  return createHash("sha1").update(toSign).digest("hex");
}

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

/**
 * Upload an image buffer to Cloudinary. `folder` is appended to the public_id
 * so assets are organized (e.g. "g2a/case-studies").
 *
 * @param data  Image data (Buffer / Uint8Array)
 * @param contentType  MIME type (image/png, image/jpeg, …)
 * @param fileName  Original filename — used to derive public_id (sanitized)
 * @param folder  Cloudinary folder path (default "g2a-uploads")
 */
export async function cloudinaryUpload(
  data: Buffer | Uint8Array,
  contentType: string,
  fileName: string,
  folder = "g2a-uploads",
): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000);

  // Public ID = sanitized filename (no extension); folder is separate param
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .slice(0, 100) || `upload_${timestamp}`;
  const publicId = `${baseName}_${timestamp}`;

  // Params to sign — include everything EXCEPT api_key, file, resource_type
  const signedParams: Record<string, string | number> = {
    folder,
    public_id: publicId,
    timestamp,
  };
  const signature = signParams(signedParams, apiSecret);

  const form = new FormData();
  const blob = new Blob([data as any], { type: contentType });
  form.append("file", blob, fileName);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    public_id: string;
    url: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  };
  return {
    publicId: json.public_id,
    url: json.url,
    secureUrl: json.secure_url,
    width: json.width,
    height: json.height,
    format: json.format,
    bytes: json.bytes,
  };
}

/**
 * Build a Cloudinary delivery URL with auto format/quality transforms.
 * Accepts either a publicId or an existing Cloudinary URL.
 *
 *   buildDeliveryUrl("foo/bar")        → https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/foo/bar
 *   buildDeliveryUrl("...", { width: 800 }) → adds w_800,c_limit
 */
export function buildCloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: "auto" | number; format?: "auto" | string } = {},
): string {
  const c = parseConfig();
  if (!c) return publicId; // fail-soft
  const transforms: string[] = [];
  transforms.push(`f_${opts.format ?? "auto"}`);
  transforms.push(`q_${opts.quality ?? "auto"}`);
  if (opts.width) transforms.push(`w_${opts.width}`, "c_limit");
  if (opts.height) transforms.push(`h_${opts.height}`);
  return `https://res.cloudinary.com/${c.cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
