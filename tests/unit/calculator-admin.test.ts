import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  listCalculatorConfig,
  readPublicCalculatorConfig,
  saveCalculatorConfig,
  type CalculatorAdminStore,
} from "@/services/calculator-admin";
import { calculatorAdminConfigSchema } from "@/schemas/calculator-admin";

const editor: AdminPrincipal = { id: "editor-id", role: "editor", twoFactorVerified: true };
const groupId = "03a45fa0-3b54-4d51-ac21-335a00655744";
const itemA = "64f83a30-f94b-4da1-a2e0-3cf7e43de702";
const itemB = "b5f106fb-b888-4f12-90d0-e4282e0d8918";
const config = () => ({
  groups: [{ id: groupId, key: "platform", title: "Platform", description: "Pilih platform", selectionType: "multiple" as const, isRequired: true, isActive: true, sortOrder: 0 }],
  items: [
    { id: itemA, groupId, label: "Web", description: "", pricingType: "flat" as const, unitLabel: null, maxUnits: null, priceMin: 100_000, priceMax: null, daysMin: 1, daysMax: null, isDefault: true, isActive: true, sortOrder: 0, rules: [{ relatedItemId: itemB, ruleType: "requires" as const }] },
    { id: itemB, groupId, label: "Database", description: "", pricingType: "per_unit" as const, unitLabel: "modul", maxUnits: 5, priceMin: 200_000, priceMax: 300_000, daysMin: 2, daysMax: 4, isDefault: false, isActive: true, sortOrder: 1, rules: [] },
  ],
});

function setup(value: unknown = config()) {
  const order: string[] = [];
  const read = vi.fn().mockResolvedValue(value);
  const lockConfiguration = vi.fn(async () => { order.push("lock"); });
  const replace = vi.fn(async () => { order.push("replace"); });
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ lockConfiguration, replace, audit }));
  return { store: { read, transaction } as CalculatorAdminStore, read, order, lockConfiguration, replace, audit, transaction };
}

describe("admin kalkulator", () => {
  it("menerima graf valid dan menolak siklus/rujukan palsu sebelum transaksi", async () => {
    expect(calculatorAdminConfigSchema.safeParse(config()).success).toBe(true);
    const cyclic = config();
    cyclic.items[1].rules = [{ relatedItemId: itemA, ruleType: "requires" }];
    expect(calculatorAdminConfigSchema.safeParse(cyclic).success).toBe(false);
    const missing = config();
    missing.items[0].rules = [{ relatedItemId: "7d198a99-2222-4af7-9104-1a70767d1d16", ruleType: "requires" }];
    const noActiveChoices = config();
    noActiveChoices.items.forEach((item) => {
      item.isActive = false;
      item.isDefault = false;
    });
    expect(calculatorAdminConfigSchema.safeParse(noActiveChoices).success).toBe(false);
    const ctx = setup();
    await expect(saveCalculatorConfig(ctx.store, editor, missing, vi.fn())).rejects.toThrow();
    await expect(saveCalculatorConfig(ctx.store, editor, noActiveChoices, vi.fn())).rejects.toThrow("Grup wajib harus memiliki item aktif");
    expect(ctx.transaction).not.toHaveBeenCalled();
  });

  it("menyimpan satu konfigurasi dan audit dalam transaksi, lalu menginvalidasi cache", async () => {
    const ctx = setup();
    const invalidate = vi.fn();
    await expect(saveCalculatorConfig(ctx.store, editor, config(), invalidate)).resolves.toBeUndefined();
    expect(ctx.order.slice(0, 2)).toEqual(["lock", "replace"]);
    expect(ctx.replace).toHaveBeenCalledWith(config());
    expect(ctx.audit).toHaveBeenCalledWith(editor.id);
    expect(invalidate).toHaveBeenCalledOnce();
    await expect(listCalculatorConfig(ctx.store, editor)).resolves.toEqual(config());
  });

  it("mengembalikan DTO publik tanpa konfigurasi nonaktif", async () => {
    const data = config();
    data.items[1].isActive = false;
    data.items[0].rules = [];
    const result = await readPublicCalculatorConfig(setup(data).store);
    expect(result.groups).toHaveLength(1);
    expect(result.items).toHaveLength(1);
    expect(result.groups[0]).toMatchObject({ id: groupId, key: "platform" });
    expect(result.items[0]).toMatchObject({ id: itemA, isActive: true, requires: [] });
    expect(result.items[0].isDefault).toBe(true);
  });

  it("menolak grup wajib yang tidak punya item aktif untuk publik", async () => {
    const data = config();
    data.items.forEach((item) => {
      item.isActive = false;
      item.isDefault = false;
    });
    await expect(readPublicCalculatorConfig(setup(data).store)).rejects.toThrow("Grup wajib harus memiliki item aktif");
  });
});
