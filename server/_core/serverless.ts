/**
 * Vercel serverless entry — bundled to `api/index.js` at build time.
 *
 * Vercel's @vercel/node runtime traces ESM imports without bundling, and
 * Node ESM requires explicit `.js` extensions on relative imports — which
 * the rest of the codebase doesn't carry (it relies on tsx/Vite forgiving
 * resolution in dev). To avoid sprinkling `.js` everywhere, the build
 * command bundles this entry with esbuild (`--packages=external`), which
 * resolves all relative imports inline so runtime doesn't care.
 *
 * Source lives outside `api/` so Vercel doesn't see both the `.ts` source
 * and the `.js` bundle and pick the wrong one.
 *
 * Limits to be aware of:
 *   - 30s function timeout — bulk Resend campaigns to >50 subscribers may hit it.
 *   - Stateless: in-memory rate limiter resets every cold start.
 *   - 4.5 MB body limit — admin base64 uploads >3 MB will fail; use Cloudinary
 *     direct upload via the AI image button instead.
 */
import "dotenv/config";
import { createApp } from "./app";

const app = createApp();

export default app;
