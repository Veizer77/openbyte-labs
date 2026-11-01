import { z } from "zod";

const id = z.string().min(1).max(100);
const amount = z.number().int().min(0).max(2_147_483_647);
const group = z
  .object({
    id,
    selectionType: z.enum(["single", "multiple"]),
    isRequired: z.boolean(),
  })
  .strict();
const item = z
  .object({
    id,
    groupId: id,
    label: z.string().trim().min(1).max(250),
    priceMin: amount,
    priceMax: amount.optional(),
    daysMin: amount,
    daysMax: amount.optional(),
    pricingType: z.enum(["flat", "per_unit"]).optional(),
    maxUnits: z.number().int().min(1).max(1000).optional(),
    isActive: z.boolean().optional(),
    requires: z.array(id).max(50).optional(),
    excludes: z.array(id).max(50).optional(),
  })
  .strict();

/** Validate the exact data passed to the shared calculator before it is persisted or used. */
export const calculatorConfigSchema = z
  .object({
    groups: z.array(group).max(100),
    items: z.array(item).max(200),
    minimumPrice: amount,
  })
  .strict()
  .superRefine(({ groups, items }, ctx) => {
    if (
      groups.length > 100 ||
      items.length > 200 ||
      items.some(
        (entry) =>
          (entry.requires?.length ?? 0) > 50 ||
          (entry.excludes?.length ?? 0) > 50,
      )
    )
      return;
    const groupIds = new Set<string>();
    const groupMap = new Map<string, z.output<typeof group>>();
    groups.forEach((entry, index) => {
      if (groupIds.has(entry.id))
        ctx.addIssue({
          code: "custom",
          path: ["groups", index, "id"],
          message: "ID grup duplikat.",
        });
      groupIds.add(entry.id);
      groupMap.set(entry.id, entry);
    });
    const byId = new Map<string, z.output<typeof item>>();
    items.forEach((entry, index) => {
      const issue = (field: string, message: string) =>
        ctx.addIssue({
          code: "custom",
          path: ["items", index, field],
          message,
        });
      if (byId.has(entry.id)) issue("id", "ID item duplikat.");
      byId.set(entry.id, entry);
      if (!groupIds.has(entry.groupId))
        issue("groupId", "Grup item tidak ditemukan.");
      if ((entry.priceMax ?? entry.priceMin) < entry.priceMin)
        issue("priceMax", "Harga maksimum lebih kecil dari minimum.");
      if ((entry.daysMax ?? entry.daysMin) < entry.daysMin)
        issue("daysMax", "Durasi maksimum lebih kecil dari minimum.");
      if (entry.pricingType === "per_unit" && entry.maxUnits === undefined)
        issue("maxUnits", "Jumlah maksimum unit wajib diisi.");
      for (const field of ["requires", "excludes"] as const) {
        const values = entry[field] ?? [];
        if (new Set(values).size !== values.length)
          issue(field, "Aturan duplikat.");
      }
    });

    items.forEach((entry, index) => {
      const issue = (field: string, message: string) =>
        ctx.addIssue({
          code: "custom",
          path: ["items", index, field],
          message,
        });
      for (const field of ["requires", "excludes"] as const) {
        for (const target of entry[field] ?? []) {
          if (!byId.has(target))
            issue(field, "Item yang dirujuk tidak ditemukan.");
          if (target === entry.id)
            issue(field, "Item tidak boleh merujuk dirinya sendiri.");
        }
      }

      const required = new Set<string>();
      const queue = [...(entry.requires ?? [])];
      while (queue.length) {
        const target = queue.pop()!;
        if (required.has(target)) continue;
        required.add(target);
        const referenced = byId.get(target);
        if (referenced) queue.push(...(referenced.requires ?? []));
      }
      if (required.has(entry.id))
        issue("requires", "Aturan requires membentuk siklus.");
      if (
        entry.isActive !== false &&
        [...required].some((target) => byId.get(target)?.isActive === false)
      ) {
        issue("requires", "Item aktif tidak boleh memerlukan item nonaktif.");
      }
      const selected = [entry.id, ...required]
        .map((key) => byId.get(key))
        .filter((value): value is z.output<typeof item> => !!value);
      const selectedIds = new Set(selected.map((value) => value.id));
      if (
        selected.some((value) =>
          (value.excludes ?? []).some((target) => selectedIds.has(target)),
        )
      ) {
        issue("requires", "Aturan requires dan excludes saling bertentangan.");
      }
      const singleGroups = new Set<string>();
      for (const value of selected) {
        if (groupMap.get(value.groupId)?.selectionType !== "single") continue;
        if (singleGroups.has(value.groupId)) {
          issue(
            "requires",
            "Requires memilih beberapa item dalam grup single.",
          );
          break;
        }
        singleGroups.add(value.groupId);
      }
    });
  });
