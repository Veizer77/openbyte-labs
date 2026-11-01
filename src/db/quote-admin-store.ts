import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { quoteRequests } from "./schema/calculator";
import type { QuoteAdminStore } from "@/services/quote-admin";

export function createQuoteAdminStore(db: Database): QuoteAdminStore {
  return {
    async list(options) {
      return db
        .select({
          id: quoteRequests.id,
          reference: quoteRequests.reference,
          selection: quoteRequests.selection,
          priceMin: quoteRequests.priceMin,
          priceMax: quoteRequests.priceMax,
          daysMin: quoteRequests.daysMin,
          daysMax: quoteRequests.daysMax,
          contactName: quoteRequests.contactName,
          contactWhatsapp: quoteRequests.contactWhatsapp,
          status: quoteRequests.status,
          createdAt: quoteRequests.createdAt,
        })
        .from(quoteRequests)
        .where(
          options.status ? eq(quoteRequests.status, options.status) : undefined,
        )
        .orderBy(desc(quoteRequests.createdAt), asc(quoteRequests.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async changeStatus(id, status) {
            const rows = await tx
              .update(quoteRequests)
              .set({ status, updatedAt: new Date() })
              .where(eq(quoteRequests.id, id))
              .returning({ id: quoteRequests.id });
            return rows.length === 1;
          },
          async audit(actorId, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action: "update",
                collection: "quote-requests",
                docId: id,
                summary: "Status quote diperbarui",
              });
          },
        }),
      ),
  };
}
