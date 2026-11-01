import "server-only";
import { and, asc, eq, ilike, type SQL } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { faqs } from "./schema/faqs";
import type { FaqStore } from "@/services/faqs";

export function createFaqStore(db: Database): FaqStore {
  return {
    async list(options) {
      const filters: SQL[] = [];
      if (options.activeOnly) filters.push(eq(faqs.isActive, true));
      if (options.activeOnly) filters.push(eq(faqs.requiresTracking, false));
      if (options.search)
        filters.push(ilike(faqs.question, `%${options.search}%`));
      return db
        .select({
          id: faqs.id,
          question: faqs.question,
          answer: faqs.answer,
          isActive: faqs.isActive,
          requiresTracking: faqs.requiresTracking,
          sortOrder: faqs.sortOrder,
        })
        .from(faqs)
        .where(and(...filters))
        .orderBy(asc(faqs.sortOrder), asc(faqs.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async save(id, value) {
            const rows =
              id === null
                ? await tx.insert(faqs).values(value).returning({ id: faqs.id })
                : await tx
                    .update(faqs)
                    .set({ ...value, updatedAt: new Date() })
                    .where(eq(faqs.id, id))
                    .returning({ id: faqs.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            const rows = await tx
              .delete(faqs)
              .where(eq(faqs.id, id))
              .returning({ id: faqs.id });
            return rows.length === 1;
          },
          async audit(actorId, action, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action,
                collection: "faqs",
                docId: id,
                summary: "FAQ diperbarui",
              });
          },
        }),
      ),
  };
}
