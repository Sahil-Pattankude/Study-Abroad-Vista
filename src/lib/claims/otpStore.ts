// ============================================================
// OTP store for university profile claims.
//
// Deliberately in-memory: there is no email service wired up yet
// and no claims_otp table, so codes live in the server process and
// are cleared on restart. When a real mail provider is integrated,
// this should move to a table with the same key/expiry semantics.
// ============================================================

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_ATTEMPTS = 5;

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Survives dev hot-reloads, which otherwise re-evaluate this module
// and drop every pending code.
const globalForOtp = globalThis as unknown as {
  __claimOtpStore?: Map<string, OtpRecord>;
};

const store: Map<string, OtpRecord> =
  globalForOtp.__claimOtpStore ?? new Map<string, OtpRecord>();
globalForOtp.__claimOtpStore = store;

/** Codes are scoped to one email + university pair. */
export function otpKey(officialEmail: string, universityId: string): string {
  return `${officialEmail.trim().toLowerCase()}::${(universityId || "").trim().toLowerCase()}`;
}

function purgeExpired() {
  const now = Date.now();
  for (const [key, record] of store) {
    if (record.expiresAt <= now) store.delete(key);
  }
}

export function createOtp(key: string): { code: string; expiresAt: number } {
  purgeExpired();

  // 6 digits, never leading-zero-trimmed.
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + OTP_TTL_MS;

  store.set(key, { code, expiresAt, attempts: 0 });
  return { code, expiresAt };
}

export type OtpResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "expired" | "too_many_attempts" | "mismatch" };

export function verifyOtp(key: string, submitted: string): OtpResult {
  purgeExpired();

  const record = store.get(key);
  if (!record) return { ok: false, reason: "missing" };

  if (record.expiresAt <= Date.now()) {
    store.delete(key);
    return { ok: false, reason: "expired" };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: "too_many_attempts" };
  }

  if (record.code !== String(submitted || "").trim()) {
    record.attempts += 1;
    return { ok: false, reason: "mismatch" };
  }

  // Single use.
  store.delete(key);
  return { ok: true };
}
