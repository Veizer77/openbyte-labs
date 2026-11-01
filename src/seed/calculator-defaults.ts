import "server-only";
import { randomUUID } from "node:crypto";
import { calculatorGroups, calculatorItems } from "@/fixtures/calculator";
import { calculatorConfigSchema } from "@/schemas/calculator-config";

const titles: Record<string, string> = {
  platform: "Platform",
  solution: "Jenis Solusi",
  modules: "Modul Tambahan",
};

export function defaultCalculatorRows() {
  const config = calculatorConfigSchema.parse({
    groups: calculatorGroups,
    items: calculatorItems,
    minimumPrice: 500_000,
  });
  const groupIds = new Map(
    config.groups.map((group) => [group.id, randomUUID()]),
  );
  const itemIds = new Map(config.items.map((item) => [item.id, randomUUID()]));
  const groupOrder = new Map<string, number>();
  const groups = config.groups.map((group, index) => ({
    id: groupIds.get(group.id)!,
    key: group.id,
    title: titles[group.id] ?? group.id,
    selectionType: group.selectionType,
    isRequired: group.isRequired,
    isActive: true,
    sortOrder: index + 1,
  }));
  const items = config.items.map((item) => {
    const sortOrder = (groupOrder.get(item.groupId) ?? 0) + 1;
    groupOrder.set(item.groupId, sortOrder);
    return {
      id: itemIds.get(item.id)!,
      groupId: groupIds.get(item.groupId)!,
      label: item.label,
      pricingType: item.pricingType ?? "flat",
      unitLabel: item.id === "halaman" ? "halaman" : null,
      maxUnits: item.maxUnits ?? null,
      priceMin: item.priceMin,
      priceMax: item.priceMax ?? null,
      daysMin: item.daysMin,
      daysMax: item.daysMax ?? null,
      isDefault: item.id === "web",
      isActive: item.isActive !== false,
      sortOrder,
    };
  });
  const rules = config.items.flatMap((item) => [
    ...(item.requires ?? []).map((target) => ({
      itemId: itemIds.get(item.id)!,
      relatedItemId: itemIds.get(target)!,
      ruleType: "requires" as const,
    })),
    ...(item.excludes ?? []).map((target) => ({
      itemId: itemIds.get(item.id)!,
      relatedItemId: itemIds.get(target)!,
      ruleType: "excludes" as const,
    })),
  ]);
  return { groups, items, rules };
}
