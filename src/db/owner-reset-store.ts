import "server-only";
import { and, eq } from "drizzle-orm";
import type { Database } from "./connection";
import {
  authAccount,
  authSession,
  authTwoFactor,
  authUser,
} from "./schema/admin-identity";
import { adminProfiles } from "./schema/admin-profile";
import { auditLogs } from "./schema/audit";
import type { OwnerResetStore } from "@/auth/owner-reset";

export function createOwnerResetStore(db: Database): OwnerResetStore {
  return {
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async findOwner(email) {
            const [row] = await tx
              .select({
                profileId: adminProfiles.id,
                userId: authUser.id,
              })
              .from(authUser)
              .innerJoin(
                adminProfiles,
                eq(adminProfiles.authUserId, authUser.id),
              )
              .where(
                and(
                  eq(authUser.email, email),
                  eq(adminProfiles.role, "owner"),
                  eq(adminProfiles.isActive, true),
                ),
              )
              .for("update");
            return row ?? null;
          },
          async replacePassword({ userId, passwordHash, now }) {
            const updated = await tx
              .update(authAccount)
              .set({ password: passwordHash, updatedAt: now })
              .where(
                and(
                  eq(authAccount.userId, userId),
                  eq(authAccount.providerId, "credential"),
                ),
              )
              .returning({ id: authAccount.id });
            return updated.length > 0;
          },
          async disableTwoFactor(userId) {
            await tx
              .update(authUser)
              .set({ twoFactorEnabled: false, updatedAt: new Date() })
              .where(eq(authUser.id, userId));
            await tx.delete(authTwoFactor).where(eq(authTwoFactor.userId, userId));
          },
          async revokeSessions(userId) {
            // Session rows cascade to admin_session_assurances.
            await tx.delete(authSession).where(eq(authSession.userId, userId));
          },
          async audit({ profileId, userId }) {
            await tx.insert(auditLogs).values({
              actorId: profileId,
              actorType: "system",
              action: "reset",
              collection: "users",
              docId: userId,
              summary: "Reset kredensial owner; 2FA dimatikan dan sesi dicabut",
            });
          },
        }),
      ),
  };
}
