import "server-only";
import { eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { categories, inquiries, servicePackages } from "./schema/packages";
import { siteSettings } from "./schema/settings";
import { settingsSchemas } from "@/schemas/site-settings";
import type { InquiryStore } from "@/services/create-inquiry";

export function createInquiryStore(db: Database): InquiryStore {
  return {
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async readPackageForUpdate(id) {
            const [row] = await tx
              .select({
                id: servicePackages.id,
                name: servicePackages.name,
                price: servicePackages.price,
                discountPrice: servicePackages.discountPrice,
                discountEndsAt: servicePackages.discountEndsAt,
                billingType: servicePackages.billingType,
                isActive: servicePackages.isActive,
                categoryActive: categories.isActive,
                deletedAt: servicePackages.deletedAt,
              })
              .from(servicePackages)
              .innerJoin(
                categories,
                eq(categories.id, servicePackages.categoryId),
              )
              .where(eq(servicePackages.id, id))
              .for("update");
            return row ?? null;
          },
          async readWhatsappConfig() {
            const [settings] = await tx
              .select({ data: siteSettings.data })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .limit(1);
            if (!settings)
              throw new Error("Site Settings belum diinisialisasi.");
            return {
              number: settingsSchemas.general.parse(settings.data.general)
                .whatsappNumber,
              template: settingsSchemas.whatsapp.parse(settings.data.whatsapp)
                .tplPackageOrder,
            };
          },
          async tryInsert(record) {
            const [inserted] = await tx
              .insert(inquiries)
              .values(record)
              .onConflictDoNothing({ target: inquiries.reference })
              .returning({ id: inquiries.id });
            return inserted?.id ?? null;
          },
          async insertAudit(inquiryId) {
            await tx
              .insert(auditLogs)
              .values({
                actorType: "system",
                action: "create",
                collection: "inquiries",
                docId: inquiryId,
                summary: "Inquiry dibuat",
              });
          },
        }),
      ),
  };
}
