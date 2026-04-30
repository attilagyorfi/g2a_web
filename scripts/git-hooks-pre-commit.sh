#!/bin/sh
# G2A Marketing — pre-commit hook
#
# Runs `tsc --noEmit` if any staged file is a .ts / .tsx so type errors
# never reach origin. To bypass in an emergency: `git commit --no-verify`.
#
# Set up automatically by .git/hooks (no husky dep needed).

set -e

# Find staged TypeScript files
TS_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx)$' || true)

if [ -z "$TS_FILES" ]; then
  echo "[pre-commit] No .ts/.tsx files staged — skipping tsc."
  exit 0
fi

echo "[pre-commit] Staged TS files detected — running tsc --noEmit..."

# Run from repo root regardless of where git was invoked
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

# tsc reads the whole project (not just staged files) — it has to,
# because TS errors in unstaged code would still break the build.
if ! npx --no-install tsc --noEmit 2>&1; then
  echo ""
  echo "[pre-commit] ✗ TypeScript errors detected — commit aborted."
  echo "  · Fix the errors above, then re-stage and commit"
  echo "  · Or bypass (NOT recommended): git commit --no-verify"
  exit 1
fi

echo "[pre-commit] ✓ tsc clean — commit proceeding"
exit 0
