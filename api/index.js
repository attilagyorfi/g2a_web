/**
 * STUB — overwritten by `pnpm run build:vercel` (esbuild bundle of
 * server/_core/serverless.ts) at deploy time.
 *
 * Why committed: Vercel scans `api/` for serverless functions BEFORE the
 * buildCommand runs. Without a placeholder file at this exact path,
 * vercel.json's `functions: { "api/index.js": ... }` errors with
 * "pattern doesn't match any Serverless Functions". The build then
 * replaces this stub with the real ~110 KB Express-app bundle.
 *
 * Don't edit by hand — run `pnpm run build:vercel` to regenerate.
 */
export default function handler(req, res) {
  res.statusCode = 503;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    "Build artifact stub — should be replaced by build:vercel during deploy."
  );
}
