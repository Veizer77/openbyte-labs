import { describe, expect, it } from "vitest";
import { calculate, type Selection } from "@/lib/calculator";
import { calculatorGroups, calculatorItems } from "@/fixtures/calculator";

const run = (ids: (string | Selection)[]) =>
  calculate(
    ids.map((id) => (typeof id === "string" ? { itemId: id } : id)),
    calculatorGroups,
    calculatorItems,
  );
describe("Kalkulator PRD F.1", () => {
  it.each([
    ["C1", ["web", "landing"], [600_000, 1_200_000, 3, 5]],
    ["C2", ["web", "sidb", "rbac", "laporan"], [3_400_000, 5_800_000, 18, 27]],
    ["C3", ["web", "undangan"], [500_000, 1_000_000, 2, 4]],
    [
      "C4",
      ["web", "landing", { itemId: "halaman", units: 5 }],
      [975_000, 1_950_000, 3, 5],
    ],
    ["C10", ["webandr", "sidb", "gis", "pay"], [6_700_000, 11_500_000, 35, 53]],
  ] as [string, (string | Selection)[], number[]][])("%s", (_, ids, values) => {
    const [priceMin, priceMax, daysMin, daysMax] = values;
    expect(run(ids)).toEqual({
      ok: true,
      priceMin,
      priceMax,
      daysMin,
      daysMax,
    });
  });
  it.each([
    ["C5", ["android", "landing"], "excludes_bentrok"],
    ["C6", ["web", "landing", "rbac"], "requires_belum_dipilih"],
    ["C7", ["landing"], "grup_wajib_kosong"],
    [
      "C8",
      ["web", "landing", { itemId: "halaman", units: 21 }],
      "jumlah_unit_tidak_valid",
    ],
    ["C9", ["web", "landing", "katalog"], "grup_single_lebih_dari_satu"],
  ] as [string, (string | Selection)[], string][])("%s", (_, ids, error) =>
    expect(run(ids)).toEqual({ ok: false, error }),
  );
  it("menolak ID asing, duplikat, dan unit pecahan", () => {
    expect(run(["foreign"])).toEqual({
      ok: false,
      error: "item_tidak_dikenal",
    });
    expect(run(["web", "web", "sidb"])).toEqual({
      ok: false,
      error: "item_tidak_dikenal",
    });
    expect(run(["web", "landing", { itemId: "halaman", units: 1.5 }])).toEqual({
      ok: false,
      error: "jumlah_unit_tidak_valid",
    });
  });
  it("tidak mengalikan durasi dengan unit", () => {
    const items = calculatorItems.map((item) =>
      item.id === "halaman" ? { ...item, daysMin: 2, daysMax: 4 } : item,
    );
    expect(
      calculate(
        [
          { itemId: "web" },
          { itemId: "landing" },
          { itemId: "halaman", units: 5 },
        ],
        calculatorGroups,
        items,
      ),
    ).toMatchObject({ daysMin: 5, daysMax: 9 });
  });
});
