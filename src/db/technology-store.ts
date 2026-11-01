import "server-only";
import { and, asc, eq, ne, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { technologies } from "./schema/content";
import type { TechnologyStore } from "@/services/technologies";

const fields = {
  id: technologies.id,
  name: technologies.name,
  slug: technologies.slug,
  icon: technologies.icon,
  color: technologies.color,
};

export function createTechnologyStore(db: Database): TechnologyStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(technologies)
        .orderBy(asc(technologies.name), asc(technologies.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction(async (tx) =>
        callback({
          async lockNames() {
            // Serialize case-insensitive name checks; slug uniqueness remains DB-enforced.
            await tx.execute(sql`SELECT pg_advisory_xact_lock(525183970018765)`);
          },
          async nameTaken(name, exceptId) {
            const predicate = exceptId
              ? and(sql`lower(${technologies.name}) = lower(${name})`, ne(technologies.id, exceptId))
              : sql`lower(${technologies.name}) = lower(${name})`;
            const [row] = await tx.select({ id: technologies.id }).from(technologies).where(predicate).limit(1);
            return Boolean(row);
          },
          async save(id, value) {
            const rows = id === null
              ? await tx.insert(technologies).values(value).returning({ id: technologies.id })
              : await tx.update(technologies)
                  .set({ ...value, updatedAt: new Date() })
                  .where(eq(technologies.id, id))
                  .returning({ id: technologies.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            return (await tx.delete(technologies).where(eq(technologies.id, id)).returning({ id: technologies.id })).length === 1;
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "technologies",
              docId: id,
              summary: "Teknologi diperbarui",
            });
          },
        }),
      ),
  };
}
