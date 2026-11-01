import "server-only";
import { asc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { calculatorGroups, calculatorItems, calculatorRules } from "./schema/calculator";
import { siteSettings } from "./schema/settings";
import type { CalculatorAdminStore } from "@/services/calculator-admin";

export function createCalculatorAdminStore(db: Database): CalculatorAdminStore {
  return {
    async read() {
      const [groups, items, rules] = await Promise.all([
        db.select({
          id: calculatorGroups.id,
          key: calculatorGroups.key,
          title: calculatorGroups.title,
          description: calculatorGroups.description,
          selectionType: calculatorGroups.selectionType,
          isRequired: calculatorGroups.isRequired,
          isActive: calculatorGroups.isActive,
          sortOrder: calculatorGroups.sortOrder,
        }).from(calculatorGroups)
          .orderBy(asc(calculatorGroups.sortOrder), asc(calculatorGroups.id)),
        db.select({
          id: calculatorItems.id,
          groupId: calculatorItems.groupId,
          label: calculatorItems.label,
          description: calculatorItems.description,
          pricingType: calculatorItems.pricingType,
          unitLabel: calculatorItems.unitLabel,
          maxUnits: calculatorItems.maxUnits,
          priceMin: calculatorItems.priceMin,
          priceMax: calculatorItems.priceMax,
          daysMin: calculatorItems.daysMin,
          daysMax: calculatorItems.daysMax,
          isDefault: calculatorItems.isDefault,
          isActive: calculatorItems.isActive,
          sortOrder: calculatorItems.sortOrder,
        }).from(calculatorItems)
          .orderBy(asc(calculatorItems.groupId), asc(calculatorItems.sortOrder), asc(calculatorItems.id)),
        db.select({
          itemId: calculatorRules.itemId,
          relatedItemId: calculatorRules.relatedItemId,
          ruleType: calculatorRules.ruleType,
        }).from(calculatorRules),
      ]);
      const byItem = new Map<string, Array<{ relatedItemId: string; ruleType: "requires" | "excludes" }>>();
      for (const rule of rules) {
        const related = byItem.get(rule.itemId) ?? [];
        related.push({ relatedItemId: rule.relatedItemId, ruleType: rule.ruleType });
        byItem.set(rule.itemId, related);
      }
      return {
        groups,
        items: items.map((item) => ({ ...item, rules: byItem.get(item.id) ?? [] })),
      };
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async lockConfiguration() {
            const [settings] = await tx
              .select({ id: siteSettings.id })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .for("update");
            if (!settings) throw new Error("Site Settings belum diinisialisasi.");
          },
          async replace(config) {
            await tx.delete(calculatorRules);
            await tx.delete(calculatorItems);
            await tx.delete(calculatorGroups);

            if (config.groups.length)
              await tx.insert(calculatorGroups).values(
                config.groups.map(({ id, ...group }) => ({ id, ...group })),
              );
            if (config.items.length)
              await tx.insert(calculatorItems).values(
                config.items.map((item) => ({
                  id: item.id,
                  groupId: item.groupId,
                  label: item.label,
                  description: item.description,
                  pricingType: item.pricingType,
                  unitLabel: item.unitLabel,
                  maxUnits: item.maxUnits,
                  priceMin: item.priceMin,
                  priceMax: item.priceMax,
                  daysMin: item.daysMin,
                  daysMax: item.daysMax,
                  isDefault: item.isDefault,
                  isActive: item.isActive,
                  sortOrder: item.sortOrder,
                })),
              );

            const rules = config.items.flatMap((item) =>
              item.rules.map((rule) => ({
                itemId: item.id,
                relatedItemId: rule.relatedItemId,
                ruleType: rule.ruleType,
              })),
            );
            if (rules.length) await tx.insert(calculatorRules).values(rules);
          },
          async audit(actorId) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action: "update",
              collection: "calculator-config",
              docId: "calculator",
              summary: "Konfigurasi kalkulator diperbarui",
            });
          },
        }),
      ),
  };
}
