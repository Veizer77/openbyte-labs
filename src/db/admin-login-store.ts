import "server-only";
import { and, count, eq, lte, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { adminLoginFailures } from "./schema/admin-login-failures";
import { rateLimits } from "./schema/rate-limits";
import type { AdminLoginStore } from "@/auth/admin-login";

export function createAdminLoginStore(lockDb: Database): AdminLoginStore {
  return {
    transaction: (keyHash, callback) =>
      lockDb.transaction(async (tx) => {
        await tx
          .insert(rateLimits)
          .values({
            scope: "admin-login",
            keyHash,
            count: 0,
            windowStartedAt: sql`clock_timestamp()`,
          })
          .onConflictDoNothing({
            target: [rateLimits.scope, rateLimits.keyHash],
          });
        const [entry] = await tx
          .select({ keyHash: rateLimits.keyHash })
          .from(rateLimits)
          .where(
            and(
              eq(rateLimits.scope, "admin-login"),
              eq(rateLimits.keyHash, keyHash),
            ),
          )
          .for("update");
        if (!entry) throw new Error("Pengunci login tidak tersedia.");
        return callback({
          async isLocked() {
            const [current] = await tx
              .select({
                locked: sql<boolean>`${rateLimits.lockedUntil} > clock_timestamp()`,
              })
              .from(rateLimits)
              .where(
                and(
                  eq(rateLimits.scope, "admin-login"),
                  eq(rateLimits.keyHash, keyHash),
                ),
              );
            if (!current) throw new Error("Pengunci login tidak tersedia.");
            return current.locked === true;
          },
          async pruneFailures() {
            await tx
              .delete(adminLoginFailures)
              .where(
                and(
                  eq(adminLoginFailures.keyHash, keyHash),
                  lte(
                    adminLoginFailures.occurredAt,
                    sql`clock_timestamp() - interval '15 minutes'`,
                  ),
                ),
              );
          },
          async countFailures() {
            const [row] = await tx
              .select({ value: count() })
              .from(adminLoginFailures)
              .where(eq(adminLoginFailures.keyHash, keyHash));
            return row?.value ?? 0;
          },
          async recordFailure() {
            await tx
              .insert(adminLoginFailures)
              .values({ keyHash, occurredAt: sql`clock_timestamp()` });
          },
          async lock() {
            await tx
              .update(rateLimits)
              .set({
                lockedUntil: sql`clock_timestamp() + interval '15 minutes'`,
                updatedAt: sql`clock_timestamp()`,
              })
              .where(
                and(
                  eq(rateLimits.scope, "admin-login"),
                  eq(rateLimits.keyHash, keyHash),
                ),
              );
          },
        });
      }),
  };
}
