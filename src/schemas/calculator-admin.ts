import { z } from "zod";
import { calculatorConfigSchema } from "./calculator-config";

const amount = z.number().int().min(0).max(2_147_483_647);

const calculatorAdminGroupSchema = z
  .object({
    id: z.uuid(),
    key: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().max(1_000),
    selectionType: z.enum(["single", "multiple"]),
    isRequired: z.boolean(),
    isActive: z.boolean(),
    sortOrder: amount,
  })
  .strict();

const calculatorAdminRuleSchema = z
  .object({
    relatedItemId: z.uuid(),
    ruleType: z.enum(["requires", "excludes"]),
  })
  .strict();

const calculatorAdminItemSchema = z
  .object({
    id: z.uuid(),
    groupId: z.uuid(),
    label: z.string().trim().min(1).max(250),
    description: z.string().trim().max(1_000),
    pricingType: z.enum(["flat", "per_unit"]),
    unitLabel: z.string().trim().min(1).max(80).nullable(),
    maxUnits: z.number().int().min(1).max(1_000).nullable(),
    priceMin: amount,
    priceMax: amount.nullable(),
    daysMin: amount,
    daysMax: amount.nullable(),
    isDefault: z.boolean(),
    isActive: z.boolean(),
    sortOrder: amount,
    rules: z.array(calculatorAdminRuleSchema).max(100),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.pricingType === "per_unit" && (!item.unitLabel || item.maxUnits === null)) {
      ctx.addIssue({ code: "custom", path: ["maxUnits"], message: "Harga per unit memerlukan satuan dan batas unit." });
    }
    if (item.pricingType === "flat" && (item.unitLabel !== null || item.maxUnits !== null)) {
      ctx.addIssue({ code: "custom", path: ["pricingType"], message: "Harga flat tidak boleh mengatur satuan atau batas unit." });
    }
    const keys = item.rules.map((rule) => `${rule.ruleType}:${rule.relatedItemId}`);
    if (new Set(keys).size !== keys.length) {
      ctx.addIssue({ code: "custom", path: ["rules"], message: "Aturan kalkulator duplikat." });
    }
    if (item.rules.some((rule) => rule.relatedItemId === item.id)) {
      ctx.addIssue({ code: "custom", path: ["rules"], message: "Item tidak boleh merujuk dirinya sendiri." });
    }
  });

export const calculatorAdminConfigSchema = z
  .object({
    groups: z.array(calculatorAdminGroupSchema).max(100),
    items: z.array(calculatorAdminItemSchema).max(200),
  })
  .strict()
  .superRefine(({ groups, items }, ctx) => {
    const groupIds = new Set(groups.map((group) => group.id));
    const groupKeys = groups.map((group) => group.key);
    const itemIds = new Set(items.map((item) => item.id));
    if (groupIds.size !== groups.length)
      ctx.addIssue({ code: "custom", path: ["groups"], message: "ID grup kalkulator duplikat." });
    if (new Set(groupKeys).size !== groupKeys.length)
      ctx.addIssue({ code: "custom", path: ["groups"], message: "Kunci grup kalkulator duplikat." });
    if (itemIds.size !== items.length)
      ctx.addIssue({ code: "custom", path: ["items"], message: "ID item kalkulator duplikat." });

    const defaults = new Set<string>();
    items.forEach((item, index) => {
      if (!groupIds.has(item.groupId)) {
        ctx.addIssue({ code: "custom", path: ["items", index, "groupId"], message: "Grup item tidak ditemukan." });
      }
      if (item.isDefault) {
        if (defaults.has(item.groupId))
          ctx.addIssue({ code: "custom", path: ["items", index, "isDefault"], message: "Setiap grup hanya boleh memiliki satu item default." });
        defaults.add(item.groupId);
      }
      const group = groups.find((entry) => entry.id === item.groupId);
      if (item.isActive && group && !group.isActive)
        ctx.addIssue({ code: "custom", path: ["items", index, "isActive"], message: "Item aktif tidak boleh berada di grup nonaktif." });
      if (item.isDefault && !item.isActive)
        ctx.addIssue({ code: "custom", path: ["items", index, "isDefault"], message: "Item default harus aktif." });
    });

    groups.forEach((group, index) => {
      if (
        group.isActive && group.isRequired &&
        !items.some((item) => item.groupId === group.id && item.isActive)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["groups", index],
          message: "Grup wajib harus memiliki item aktif.",
        });
      }
    });

    const graphItems = items.map((item) => ({
      id: item.id,
      groupId: item.groupId,
      label: item.label,
      priceMin: item.priceMin,
      ...(item.priceMax === null ? {} : { priceMax: item.priceMax }),
      daysMin: item.daysMin,
      ...(item.daysMax === null ? {} : { daysMax: item.daysMax }),
      pricingType: item.pricingType,
      ...(item.maxUnits === null ? {} : { maxUnits: item.maxUnits }),
      isActive: item.isActive,
      requires: item.rules.filter((rule) => rule.ruleType === "requires").map((rule) => rule.relatedItemId),
      excludes: item.rules.filter((rule) => rule.ruleType === "excludes").map((rule) => rule.relatedItemId),
    }));
    const graphValidation = calculatorConfigSchema.safeParse({
      groups: groups.map(({ id, selectionType, isRequired }) => ({ id, selectionType, isRequired })),
      items: graphItems,
      minimumPrice: 0,
    });
    if (!graphValidation.success) {
      for (const issue of graphValidation.error.issues) {
        ctx.addIssue({ code: "custom", path: issue.path, message: issue.message });
      }
    }
  });

export type CalculatorAdminConfig = z.output<typeof calculatorAdminConfigSchema>;
