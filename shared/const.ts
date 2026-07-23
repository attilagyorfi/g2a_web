export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
/**
 * Admin session lifetime. Deliberately short (was ONE_YEAR_MS): a stolen or
 * leaked session cookie stays usable only this long, and it bounds how long a
 * compromised session survives even without an explicit password reset.
 */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
