import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import {
  calculatorGroups,
  calculatorItems,
  calculatorRules,
  quoteRequests,
} from "./schema/calculator";
import { siteSettings } from "./schema/settings";
import { settingsSchemas } from "@/schemas/site-settings";
import type { QuoteStore } from "@/services/create-quote";

export function createQuoteStore(db: Database): QuoteStore {
  return {
    transaction: (callback) =>
      db.transaction(async (tx) =>
        callback({
          async readConfiguration() {
            const [settings] = await tx
              .select({ data: siteSettings.data })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .for("update");
            if (!settings)
              throw new Error("Site Settings belum diinisialisasi.");
            const calculator = settingsSchemas.calculator.parse(
              settings.data.calculator,
            );
            const general = settingsSchemas.general.parse(
              settings.data.general,
            );
            const whatsapp = settingsSchemas.whatsapp.parse(
              settings.data.whatsapp,
            );
            const groups = await tx
              .select({
                id: calculatorGroups.id,
                key: calculatorGroups.key,
                selectionType: calculatorGroups.selectionType,
                isRequired: calculatorGroups.isRequired,
              })
              .from(calculatorGroups)
              .where(eq(calculatorGroups.isActive, true))
              .orderBy(
                asc(calculatorGroups.sortOrder),
                asc(calculatorGroups.id),
              );
            const rows = await tx
              .select({
                id: calculatorItems.id,
                groupId: calculatorItems.groupId,
                label: calculatorItems.label,
                priceMin: calculatorItems.priceMin,
                priceMax: calculatorItems.priceMax,
                daysMin: calculatorItems.daysMin,
                daysMax: calculatorItems.daysMax,
                pricingType: calculatorItems.pricingType,
                maxUnits: calculatorItems.maxUnits,
                isActive: calculatorItems.isActive,
              })
              .from(calculatorItems)
              .innerJoin(
                calculatorGroups,
                eq(calculatorGroups.id, calculatorItems.groupId),
              )
              .where(
                and(
                  eq(calculatorItems.isActive, true),
                  eq(calculatorGroups.isActive, true),
                ),
              )
              .orderBy(asc(calculatorItems.sortOrder), asc(calculatorItems.id));
            const rules = rows.length
              ? await tx
                  .select({
                    itemId: calculatorRules.itemId,
                    relatedItemId: calculatorRules.relatedItemId,
                    ruleType: calculatorRules.ruleType,
                  })
                  .from(calculatorRules)
                  .where(
                    inArray(
                      calculatorRules.itemId,
                      rows.map((row) => row.id),
                    ),
                  )
              : [];
            const byItem = new Map<
              string,
              { requires: string[]; excludes: string[] }
            >();
            for (const rule of rules) {
              const entry = byItem.get(rule.itemId) ?? {
                requires: [],
                excludes: [],
              };
              entry[rule.ruleType].push(rule.relatedItemId);
              byItem.set(rule.itemId, entry);
            }
            const items = rows.map((row) => ({
              id: row.id,
              groupId: row.groupId,
              label: row.label,
              priceMin: row.priceMin,
              priceMax: row.priceMax ?? undefined,
              daysMin: row.daysMin,
              daysMax: row.daysMax ?? undefined,
              pricingType: row.pricingType,
              maxUnits: row.maxUnits ?? undefined,
              isActive: row.isActive,
              requires: byItem.get(row.id)?.requires ?? [],
              excludes: byItem.get(row.id)?.excludes ?? [],
            }));
            return {
              groups,
              items,
              minimumPrice: calculator.minimumPrice,
              showRange: calculator.showRange,
              whatsappNumber: general.whatsappNumber,
              template: whatsapp.tplCalculator,
            };
          },
          async tryInsert(record) {
            const [inserted] = await tx
              .insert(quoteRequests)
              .values(record)
              .onConflictDoNothing({ target: quoteRequests.reference })
              .returning({ id: quoteRequests.id });
            return inserted?.id ?? null;
          },
          async insertAudit(quoteId) {
            await tx
              .insert(auditLogs)
              .values({
                actorType: "system",
                action: "create",
                collection: "quote-requests",
                docId: quoteId,
                summary: "Quote kalkulator dibuat",
              });
          },
        }),
      ),
  };
}
