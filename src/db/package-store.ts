import "server-only";
import { and, asc, eq, isNotNull, isNull } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { categories, servicePackages } from "./schema/packages";
import type { PackageStore } from "@/services/packages";

const fields = {
  id: servicePackages.id,
  categoryId: servicePackages.categoryId,
  name: servicePackages.name,
  slug: servicePackages.slug,
  targetMarket: servicePackages.targetMarket,
  price: servicePackages.price,
  discountPrice: servicePackages.discountPrice,
  discountEndsAt: servicePackages.discountEndsAt,
  billingType: servicePackages.billingType,
  estimatedDays: servicePackages.estimatedDays,
  features: servicePackages.features,
  includedRevisions: servicePackages.includedRevisions,
  extraRevisionPrice: servicePackages.extraRevisionPrice,
  revisionPolicy: servicePackages.revisionPolicy,
  ctaLabel: servicePackages.ctaLabel,
  isPopular: servicePackages.isPopular,
  isActive: servicePackages.isActive,
  sortOrder: servicePackages.sortOrder,
  deletedAt: servicePackages.deletedAt,
  categoryActive: categories.isActive,
};
export function createPackageStore(db: Database): PackageStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(servicePackages)
        .innerJoin(categories, eq(categories.id, servicePackages.categoryId))
        .where(
          options.publicOnly
            ? and(
                eq(servicePackages.isActive, true),
                eq(categories.isActive, true),
                isNull(servicePackages.deletedAt),
              )
            : undefined,
        )
        .orderBy(asc(servicePackages.sortOrder), asc(servicePackages.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async categoryForUpdate(id) {
            const [row] = await tx
              .select({ isActive: categories.isActive })
              .from(categories)
              .where(eq(categories.id, id))
              .for("update");
            return row ?? null;
          },
          async packageForUpdate(id) {
            const [row] = await tx
              .select({ deletedAt: servicePackages.deletedAt })
              .from(servicePackages)
              .where(eq(servicePackages.id, id))
              .for("update");
            return row ?? null;
          },
          async save(id, value) {
            const rows =
              id === null
                ? await tx
                    .insert(servicePackages)
                    .values(value)
                    .returning({ id: servicePackages.id })
                : await tx
                    .update(servicePackages)
                    .set({ ...value, updatedAt: new Date() })
                    .where(eq(servicePackages.id, id))
                    .returning({ id: servicePackages.id });
            return rows[0]?.id ?? null;
          },
          async setDeleted(id, deleted) {
            const rows = await tx
              .update(servicePackages)
              .set({
                deletedAt: deleted ? new Date() : null,
                isActive: false,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(servicePackages.id, id),
                  deleted
                    ? isNull(servicePackages.deletedAt)
                    : isNotNull(servicePackages.deletedAt),
                ),
              )
              .returning({ id: servicePackages.id });
            return rows.length === 1;
          },
          async audit(actorId, action, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action,
                collection: "service-packages",
                docId: id,
                summary: "Paket layanan diperbarui",
              });
          },
        }),
      ),
  };
}
