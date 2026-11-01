import { describe, expect, it } from "vitest";
import { defaultPackageRows } from "@/seed/package-defaults";

describe("seed paket", () => {
  it("menggunakan empat kategori dan harga awal PRD tanpa mengarang isi", () => {
    const data = defaultPackageRows();
    expect(data.categories).toHaveLength(4);
    expect(data.packages.map((entry) => entry.price)).toEqual([
      1_000_000, 3_500_000, 4_500_000,
    ]);
    expect(data.packages.map((entry) => entry.includedRevisions)).toEqual([
      2, 3, 4,
    ]);
    expect(data.addons.map((entry) => entry.price)).toEqual([
      150_000, 1_500_000, 250_000, 200_000,
    ]);
    const categoryIds = new Set(data.categories.map((entry) => entry.id));
    expect(
      data.packages.every((entry) => categoryIds.has(entry.categoryId)),
    ).toBe(true);
    expect(data.packages.every((entry) => !entry.isActive)).toBe(true);
    expect(data.addons.every((entry) => !entry.isActive)).toBe(true);
  });
});
