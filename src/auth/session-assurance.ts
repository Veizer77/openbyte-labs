import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { AccessDeniedError } from "@/access/rules";
import type { Database } from "@/db/connection";
import {
  authSession,
  authTwoFactor,
  authUser,
} from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { adminSessionAssurances } from "@/db/schema/admin-session-assurance";
import { auditLogs } from "@/db/schema/audit";

export type AssuranceMethod = "totp" | "recovery_code";

/**
 * Records that *this session* passed a second factor. A user-level flag is not
 * proof: a password-only session that existed before enrollment must stay
 * rejected, which is why the row is keyed by session id.
 */
export async function recordSessionAssurance(
  db: Database,
  input: { token: string | undefined; userId: string | undefined; method: AssuranceMethod },
): Promise<void> {
  const token = input.token;
  const userId = input.userId;
  if (!token || !userId) throw new AccessDeniedError();

  await db.transaction(async (tx) => {
    const now = new Date();
    const [session] = await tx
      .select({
        sessionId: authSession.id,
        profileId: adminProfiles.id,
        expiresAt: authSession.expiresAt,
      })
      .from(authSession)
      .innerJoin(authUser, eq(authUser.id, authSession.userId))
      .innerJoin(authTwoFactor, eq(authTwoFactor.userId, authUser.id))
      .innerJoin(adminProfiles, eq(adminProfiles.authUserId, authUser.id))
      .where(
        and(
          eq(authSession.token, token),
          eq(authUser.id, userId),
          eq(authUser.twoFactorEnabled, true),
          eq(authTwoFactor.verified, true),
          eq(adminProfiles.isActive, true),
          gt(authSession.expiresAt, now),
        ),
      )
      .for("update");
    if (!session) throw new AccessDeniedError();
    const inserted = await tx
      .insert(adminSessionAssurances)
      .values({
        sessionId: session.sessionId,
        adminProfileId: session.profileId,
        method: input.method,
        verifiedAt: now,
        expiresAt: session.expiresAt,
      })
      .onConflictDoNothing({ target: adminSessionAssurances.sessionId })
      .returning({ sessionId: adminSessionAssurances.sessionId });
    if (inserted.length !== 1) throw new AccessDeniedError();
    if (input.method === "recovery_code")
      await tx.insert(auditLogs).values({
        actorId: session.profileId,
        actorType: "admin",
        action: "login-recovery",
        collection: "users",
        docId: session.profileId,
        summary: "Login menggunakan recovery code",
      });
  });
}
