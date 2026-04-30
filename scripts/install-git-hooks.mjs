#!/usr/bin/env node
/**
 * One-shot installer that copies tracked git-hook scripts from `scripts/`
 * into `.git/hooks/`. Run this once after cloning the repo, or whenever the
 * source hooks are updated.
 *
 *   node scripts/install-git-hooks.mjs
 *
 * Why a script and not `core.hooksPath`: setting `core.hooksPath` in repo
 * config requires every contributor to opt-in via `git config`, which is
 * fiddly on Windows. Copying is portable and idempotent.
 */
import { copyFileSync, existsSync, chmodSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SOURCE_DIR = join(REPO_ROOT, "scripts");
const TARGET_DIR = join(REPO_ROOT, ".git", "hooks");

if (!existsSync(join(REPO_ROOT, ".git"))) {
  console.error("✗ Not a git repo — aborting.");
  process.exit(1);
}
mkdirSync(TARGET_DIR, { recursive: true });

const HOOK_PREFIX = "git-hooks-";
const installed = [];

for (const file of readdirSync(SOURCE_DIR)) {
  if (!file.startsWith(HOOK_PREFIX) || !file.endsWith(".sh")) continue;
  const hookName = file.slice(HOOK_PREFIX.length, -3); // strip prefix + .sh
  const src = join(SOURCE_DIR, file);
  const dst = join(TARGET_DIR, hookName);
  copyFileSync(src, dst);
  try { chmodSync(dst, 0o755); } catch { /* Windows ignores chmod, that's fine */ }
  installed.push(hookName);
}

if (installed.length === 0) {
  console.log("⚠ No git-hooks-*.sh files found in scripts/ — nothing installed.");
} else {
  console.log(`✓ Installed ${installed.length} git hook(s): ${installed.join(", ")}`);
}
