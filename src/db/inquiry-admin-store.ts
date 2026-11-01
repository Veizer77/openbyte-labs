import "server-only";
import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { inquiries } from "./schema/packages";
import type { InquiryAdminStore } from "@/services/inquiry-admin";

const fields = {
  id: inquiries.id,
  reference: inquiries.reference,
  servicePackageId: inquiries.servicePackageId,
  quoteRequestId: inquiries.quoteRequestId,
  packageName: inquiries.packageName,
  packagePrice: inquiries.packagePrice,
  packageBillingType: inquiries.packageBillingType,
  name: inquiries.name,
  whatsapp: inquiries.whatsapp,
  email: inquiries.email,
  organizationOrBusiness: inquiries.organizationOrBusiness,
  message: inquiries.message,
  source: inquiries.source,
  status: inquiries.status,
  adminNotes: inquiries.adminNotes,
  consentAt: inquiries.consentAt,
  createdAt: inquiries.createdAt,
};
export function createInquiryAdminStore(db: Database): InquiryAdminStore {
  return {
    async list(options) {
      const filters: SQL[] = [];
      if (options.status) filters.push(eq(inquiries.status, options.status));
      if (options.source) filters.push(eq(inquiries.source, options.source));
      if (options.search)
        filters.push(
          or(
            ilike(inquiries.name, `%${options.search}%`),
            ilike(inquiries.reference, `%${options.search}%`),
          )!,
        );
      return db
        .select(fields)
        .from(inquiries)
        .where(and(...filters))
        .orderBy(desc(inquiries.createdAt), asc(inquiries.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    async get(id) {
      const [row] = await db
        .select(fields)
        .from(inquiries)
        .where(eq(inquiries.id, id))
        .limit(1);
      return row ?? null;
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async update(id, value) {
            const rows = await tx
              .update(inquiries)
              .set({ ...value, updatedAt: new Date() })
              .where(eq(inquiries.id, id))
              .returning({ id: inquiries.id });
            return rows.length === 1;
          },
          async audit(actorId, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action: "update",
                collection: "inquiries",
                docId: id,
                summary: "Status atau catatan inquiry diperbarui",
              });
          },
        }),
      ),
  };
}
