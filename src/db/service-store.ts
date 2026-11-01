import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { services } from "./schema/content";
import type { ServiceStore } from "@/services/services";

const fields = {
  id: services.id,
  title: services.title,
  description: services.description,
  highlights: services.highlights,
  icon: services.icon,
  isActive: services.isActive,
  sortOrder: services.sortOrder,
};

export function createServiceStore(db: Database): ServiceStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(services)
        .where(options.publicOnly ? eq(services.isActive, true) : undefined)
        .orderBy(asc(services.sortOrder), desc(services.updatedAt), asc(services.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async save(id, value) {
            const rows = id === null
              ? await tx.insert(services).values(value).returning({ id: services.id })
              : await tx.update(services)
                  .set({ ...value, updatedAt: new Date() })
                  .where(eq(services.id, id))
                  .returning({ id: services.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            return (await tx.delete(services).where(eq(services.id, id)).returning({ id: services.id })).length === 1;
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "services",
              docId: id,
              summary: "Layanan diperbarui",
            });
          },
        }),
      ),
  };
}
