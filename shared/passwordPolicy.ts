/**
 * Staff password policy — shared so the admin UI states the same rule the
 * server enforces. Kept free of Node built-ins so the client can import it.
 */
export const MIN_PASSWORD_LENGTH = 10;

/** Returns a human-readable reason, or null when the password is acceptable. */
export function passwordPolicyError(plain: string): string | null {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `A jelszó legalább ${MIN_PASSWORD_LENGTH} karakter legyen.`;
  }
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain)) {
    return "A jelszó tartalmazzon betűt és számot is.";
  }
  return null;
}
