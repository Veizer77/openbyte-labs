import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { serviceAddons } from "./schema/packages";
import type { ServiceAddonStore } from "@/services/service-addons";

const fields = {
  id: serviceAddons.id,
  name: serviceAddons.name,
  description: serviceAddons.description,
  price: serviceAddons.price,
  billingType: serviceAddons.billingType,
  isActive: serviceAddons.isActive,
  sortOrder: serviceAddons.sortOrder,
};

export function createServiceAddonStore(db: Database): ServiceAddonStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(serviceAddons)
        .where(options.publicOnly ? eq(serviceAddons.isActive, true) : undefined)
        .orderBy(asc(serviceAddons.sortOrder), desc(serviceAddons.updatedAt), asc(serviceAddons.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async save(id, value) {
            const rows = id === null
              ? await tx.insert(serviceAddons).values(value).returning({ id: serviceAddons.id })
              : await tx.update(serviceAddons)
                  .set({ ...value, updatedAt: new Date() })
                  .where(eq(serviceAddons.id, id))
                  .returning({ id: serviceAddons.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            return (await tx.delete(serviceAddons).where(eq(serviceAddons.id, id)).returning({ id: serviceAddons.id })).length === 1;
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "service-addons",
              docId: id,
              summary: "Add-on layanan diperbarui",
            });
          },
        }),
      ),
  };
}
