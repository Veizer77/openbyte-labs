import "server-only";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { applySetCookies } from "better-auth/cookies";
import { AccessDeniedError } from "@/access/rules";
import type { Database } from "@/db/connection";
import { authTwoFactor } from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { auditLogs } from "@/db/schema/audit";
import type { createAdminAuth } from "./configuration";
import { recordSessionAssurance } from "./session-assurance";

type Auth = ReturnType<typeof createAdminAuth>;

const startSchema = z
  .object({ password: z.string().min(1).max(128) })
  .strict();
const confirmSchema = z.object({ code: z.string().regex(/^\d{6}$/) }).strict();

export class EnrollmentError extends Error {
  constructor(public readonly code: "already_enrolled" | "not_enrolled") {
    super(
      code === "already_enrolled"
        ? "TOTP sudah aktif pada akun ini."
        : "Akun belum memulai pendaftaran TOTP.",
    );
    this.name = "EnrollmentError";
  }
}

export interface EnrollmentResult {
  totpURI: string;
  backupCodes: string[];
}

async function requireActiveProfile(
  db: Database,
  userId: string,
): Promise<{ id: string }> {
  const [profile] = await db
    .select({ id: adminProfiles.id })
    .from(adminProfiles)
    .where(
      and(
        eq(adminProfiles.authUserId, userId),
        eq(adminProfiles.isActive, true),
      ),
    )
    .limit(1);
  if (!profile) throw new AccessDeniedError();
  return profile;
}

/**
 * Step 1: issues a new TOTP secret for a signed-in admin that has not enrolled
 * yet. Better Auth itself refuses to rotate an already-verified secret, so a
 * lost device must go through `pnpm owner:reset`.
 */
export async function startTotpEnrollment(
  auth: Auth,
  db: Database,
  headers: Headers,
  input: unknown,
): Promise<EnrollmentResult> {
  const { password } = startSchema.parse(input);
  const session = await auth.api.getSession({
    headers,
    query: { disableCookieCache: true },
  });
  if (!session) throw new AccessDeniedError();
  const profile = await requireActiveProfile(db, session.user.id);

  const [existing] = await db
    .select({ verified: authTwoFactor.verified })
    .from(authTwoFactor)
    .where(eq(authTwoFactor.userId, session.user.id))
    .limit(1);
  if (existing?.verified) throw new EnrollmentError("already_enrolled");

  const result = await auth.api.enableTwoFactor({ body: { password }, headers });
  // This deployment only configures TOTP; the OTP branch has no sender.
  if (result.method !== "totp") throw new EnrollmentError("not_enrolled");
  await db.insert(auditLogs).values({
    actorId: profile.id,
    actorType: "admin",
    action: "enroll-start",
    collection: "users",
    docId: profile.id,
    summary: "Memulai pendaftaran TOTP",
  });
  return { totpURI: result.totpURI, backupCodes: result.backupCodes };
}

/**
 * Step 2: verifies the first code, which also flips the factor to verified, then
 * records MFA assurance for the current session so the dashboard can be used
 * immediately. Returns the refreshed cookie headers.
 */
export async function confirmTotpEnrollment(
  auth: Auth,
  db: Database,
  headers: Headers,
  input: unknown,
): Promise<Headers> {
  const { code } = confirmSchema.parse(input);
  const session = await auth.api.getSession({
    headers,
    query: { disableCookieCache: true },
  });
  if (!session) throw new AccessDeniedError();
  const profile = await requireActiveProfile(db, session.user.id);

  const [factor] = await db
    .select({ verified: authTwoFactor.verified })
    .from(authTwoFactor)
    .where(eq(authTwoFactor.userId, session.user.id))
    .limit(1);
  if (!factor) throw new EnrollmentError("not_enrolled");
  // A verified factor means this is a login challenge, not enrollment.
  if (factor.verified) throw new AccessDeniedError();

  const result = await auth.api.verifyTOTP({
    headers,
    body: { code, trustDevice: false },
    returnHeaders: true,
  });

  // Enrollment rotates the session. Better Auth 1.7.14 can still return the
  // deleted token in its JSON body, so resolve the session from its new cookies.
  const verifiedHeaders = new Headers(headers);
  applySetCookies(verifiedHeaders, result.headers.getSetCookie());
  const verifiedSession = await auth.api.getSession({
    headers: verifiedHeaders,
    query: { disableCookieCache: true },
  });
  if (!verifiedSession || verifiedSession.user.id !== session.user.id)
    throw new AccessDeniedError();
  await recordSessionAssurance(db, {
    token: verifiedSession.session.token,
    userId: verifiedSession.user.id,
    method: "totp",
  });
  await db.insert(auditLogs).values({
    actorId: profile.id,
    actorType: "admin",
    action: "enroll-confirm",
    collection: "users",
    docId: profile.id,
    summary: "Menyelesaikan pendaftaran TOTP",
  });
  return result.headers;
}
