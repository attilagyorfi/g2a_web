/**
 * Password hashing for staff accounts.
 *
 * Uses Node's built-in `scrypt` (no extra dependency, memory-hard, fine for
 * the handful of admin logins this app sees). Stored format:
 *
 *     scrypt$<saltHex>$<keyHex>
 *
 * Verification is constant-time via `timingSafeEqual`. Unknown/legacy formats
 * verify to `false` rather than throwing, so a malformed row can't 500 the
 * login endpoint.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LEN = 64;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(plain, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(plain: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[1], "hex");
    const expected = Buffer.from(parts[2], "hex");
    if (expected.length !== KEY_LEN) return false;
    const actual = await scrypt(plain, salt, KEY_LEN);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** URL-safe single-use token for invite / password-reset links. */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

// Policy lives in shared/ so the admin UI can state the same rule.
export { MIN_PASSWORD_LENGTH, passwordPolicyError } from "@shared/passwordPolicy";
