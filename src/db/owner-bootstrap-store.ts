import "server-only";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Database } from "./connection";
import { authAccount, authUser } from "./schema/admin-identity";
import { adminProfiles } from "./schema/admin-profile";
import { auditLogs } from "./schema/audit";
import { seedState } from "./schema/seed-state";
import type { OwnerBootstrapStore } from "@/auth/owner-bootstrap";

export function createOwnerBootstrapStore(db: Database): OwnerBootstrapStore {
  return {
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async claimBootstrap() {
            const rows = await tx
              .insert(seedState)
              .values({ key: "owner-bootstrap-v1" })
              .onConflictDoNothing({ target: seedState.key })
              .returning({ key: seedState.key });
            return rows.length === 1;
          },
          async hasOwner() {
            const rows = await tx
              .select({ id: adminProfiles.id })
              .from(adminProfiles)
              .where(eq(adminProfiles.role, "owner"))
              .limit(1);
            return rows.length > 0;
          },
          async insertOwner(input) {
            await tx
              .insert(authUser)
              .values({
                id: input.userId,
                name: input.name,
                email: input.email,
                emailVerified: false,
                createdAt: input.now,
                updatedAt: input.now,
              });
            await tx
              .insert(authAccount)
              .values({
                id: randomUUID(),
                userId: input.userId,
                accountId: input.userId,
                providerId: "credential",
                password: input.passwordHash,
                createdAt: input.now,
                updatedAt: input.now,
              });
            const [profile] = await tx
              .insert(adminProfiles)
              .values({ authUserId: input.userId, role: "owner" })
              .returning({ id: adminProfiles.id });
            if (!profile) throw new Error("Profil owner tidak dapat dibuat.");
            return profile.id;
          },
          async audit(profileId) {
            await tx
              .insert(auditLogs)
              .values({
                actorType: "system",
                action: "create",
                collection: "users",
                docId: profileId,
                summary: "Bootstrap owner",
              });
          },
        }),
      ),
  };
}
