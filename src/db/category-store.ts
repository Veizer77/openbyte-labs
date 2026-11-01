import "server-only";
import { and, asc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { categories } from "./schema/packages";
import type { CategoryStore } from "@/services/categories";

const fields = {
  id: categories.id,
  name: categories.name,
  slug: categories.slug,
  icon: categories.icon,
  showInFilter: categories.showInFilter,
  isActive: categories.isActive,
  sortOrder: categories.sortOrder,
};
export function createCategoryStore(db: Database): CategoryStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(categories)
        .where(
          options.publicOnly
            ? and(
                eq(categories.isActive, true),
                eq(categories.showInFilter, true),
              )
            : undefined,
        )
        .orderBy(asc(categories.sortOrder), asc(categories.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async save(id, value) {
            const rows =
              id === null
                ? await tx
                    .insert(categories)
                    .values(value)
                    .returning({ id: categories.id })
                : await tx
                    .update(categories)
                    .set({ ...value, updatedAt: new Date() })
                    .where(eq(categories.id, id))
                    .returning({ id: categories.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            return (
              (
                await tx
                  .delete(categories)
                  .where(eq(categories.id, id))
                  .returning({ id: categories.id })
              ).length === 1
            );
          },
          async audit(actorId, action, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action,
                collection: "categories",
                docId: id,
                summary: "Kategori diperbarui",
              });
          },
        }),
      ),
  };
}
