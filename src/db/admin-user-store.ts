import "server-only";
import { and, asc, count, eq, ilike, ne, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { Database } from "./connection";
import { adminProfiles } from "./schema/admin-profile";
import { authAccount, authUser } from "./schema/admin-identity";
import { auditLogs } from "./schema/audit";
import type { AdminUserStore } from "@/services/admin-users";

export function createAdminUserStore(db: Database): AdminUserStore {
  return {
    async list(options) {
      const search = options.query ? `%${options.query}%` : null;
      return db
        .select({
          id: adminProfiles.id,
          name: authUser.name,
          email: authUser.email,
          role: adminProfiles.role,
          isActive: adminProfiles.isActive,
          twoFactorEnabled: authUser.twoFactorEnabled,
          createdAt: adminProfiles.createdAt,
          updatedAt: adminProfiles.updatedAt,
        })
        .from(adminProfiles)
        .innerJoin(authUser, eq(authUser.id, adminProfiles.authUserId))
        .where(search ? or(ilike(authUser.name, search), ilike(authUser.email, search)) : undefined)
        .orderBy(asc(authUser.name), asc(adminProfiles.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async lockUsers() {
            await tx.execute(sql`SELECT pg_advisory_xact_lock(525183970018766)`);
          },
          async emailTaken(email, exceptAuthUserId) {
            const predicate = exceptAuthUserId
              ? and(sql`lower(${authUser.email}) = lower(${email})`, ne(authUser.id, exceptAuthUserId))
              : sql`lower(${authUser.email}) = lower(${email})`;
            const [row] = await tx.select({ id: authUser.id }).from(authUser).where(predicate).limit(1);
            return Boolean(row);
          },
          async activeOwnerCount() {
            const [row] = await tx.select({ value: count() }).from(adminProfiles)
              .where(and(eq(adminProfiles.role, "owner"), eq(adminProfiles.isActive, true)));
            return Number(row?.value ?? 0);
          },
          async create(input) {
            await tx.insert(authUser).values({
              id: input.userId,
              name: input.name,
              email: input.email,
              emailVerified: false,
              image: null,
              createdAt: input.now,
              updatedAt: input.now,
              twoFactorEnabled: false,
            });
            await tx.insert(authAccount).values({
              id: randomUUID(),
              accountId: input.userId,
              providerId: "credential",
              userId: input.userId,
              password: input.passwordHash,
              createdAt: input.now,
              updatedAt: input.now,
            });
            const [profile] = await tx.insert(adminProfiles).values({
              authUserId: input.userId,
              role: input.role,
              isActive: true,
            }).returning({ id: adminProfiles.id });
            if (!profile) throw new Error("Profil admin gagal dibuat.");
            return profile.id;
          },
          async read(id) {
            const [row] = await tx.select({
              authUserId: adminProfiles.authUserId,
              role: adminProfiles.role,
              isActive: adminProfiles.isActive,
            }).from(adminProfiles).where(eq(adminProfiles.id, id)).for("update");
            return row ?? null;
          },
          async update(id, authUserId, input) {
            const profiles = await tx.update(adminProfiles)
              .set({ role: input.role, isActive: input.isActive, updatedAt: new Date() })
              .where(eq(adminProfiles.id, id)).returning({ id: adminProfiles.id });
            if (!profiles.length) return false;
            const users = await tx.update(authUser)
              .set({ name: input.name, email: input.email, updatedAt: new Date() })
              .where(eq(authUser.id, authUserId)).returning({ id: authUser.id });
            return users.length === 1;
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "users",
              docId: id,
              summary: action === "create" ? "Pengguna admin dibuat" : "Pengguna admin diperbarui",
            });
          },
        }),
      ),
  };
}
