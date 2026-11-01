import { describe, expect, it } from "vitest";
import { calculatorGroups, calculatorItems } from "@/fixtures/calculator";
import { calculatorConfigSchema } from "@/schemas/calculator-config";

const validConfig = () => ({
  groups: structuredClone(calculatorGroups),
  items: structuredClone(calculatorItems),
  minimumPrice: 500_000,
});

describe("validasi konfigurasi kalkulator", () => {
  it("menerima konfigurasi awal PRD", () => {
    expect(calculatorConfigSchema.safeParse(validConfig()).success).toBe(true);
  });
  it("menolak siklus requires dan item yang tidak ada", () => {
    const config = validConfig();
    config.items.find((item) => item.id === "sidb")!.requires = ["rbac"];
    expect(calculatorConfigSchema.safeParse(config).success).toBe(false);
    const missing = validConfig();
    missing.items.find((item) => item.id === "rbac")!.requires = ["tidak-ada"];
    expect(calculatorConfigSchema.safeParse(missing).success).toBe(false);
  });
  it("menolak kontradiksi langsung dan tidak langsung, termasuk grup single", () => {
    const direct = validConfig();
    direct.items.find((item) => item.id === "rbac")!.excludes = ["sidb"];
    expect(calculatorConfigSchema.safeParse(direct).success).toBe(false);
    const indirect = validConfig();
    indirect.items.find((item) => item.id === "gis")!.requires = ["rbac"];
    indirect.items.find((item) => item.id === "sidb")!.excludes = ["gis"];
    expect(calculatorConfigSchema.safeParse(indirect).success).toBe(false);
    const single = validConfig();
    single.items.find((item) => item.id === "web")!.requires = ["android"];
    expect(calculatorConfigSchema.safeParse(single).success).toBe(false);
  });
  it("menolak harga salah, unit tanpa batas, grup asing, dan ketergantungan nonaktif", () => {
    const price = validConfig();
    price.items.find((item) => item.id === "landing")!.priceMax = 1;
    expect(calculatorConfigSchema.safeParse(price).success).toBe(false);
    const units = validConfig();
    units.items.find((item) => item.id === "halaman")!.maxUnits = undefined;
    expect(calculatorConfigSchema.safeParse(units).success).toBe(false);
    const group = validConfig();
    group.items[0].groupId = "tidak-ada";
    expect(calculatorConfigSchema.safeParse(group).success).toBe(false);
    const inactive = validConfig();
    inactive.items.find((item) => item.id === "sidb")!.isActive = false;
    expect(calculatorConfigSchema.safeParse(inactive).success).toBe(false);
  });
});
