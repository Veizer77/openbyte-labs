export interface CalculatorGroup {
  id: string;
  selectionType: "single" | "multiple";
  isRequired: boolean;
}
export interface CalculatorItem {
  id: string;
  groupId: string;
  label: string;
  priceMin: number;
  priceMax?: number;
  daysMin: number;
  daysMax?: number;
  pricingType?: "flat" | "per_unit";
  maxUnits?: number;
  isActive?: boolean;
  requires?: string[];
  excludes?: string[];
}
export interface Selection {
  itemId: string;
  units?: number;
}
export type CalculatorError =
  | "item_tidak_dikenal"
  | "grup_single_lebih_dari_satu"
  | "grup_wajib_kosong"
  | "jumlah_unit_tidak_valid"
  | "requires_belum_dipilih"
  | "excludes_bentrok";
export type Calculation =
  | {
      ok: true;
      priceMin: number;
      priceMax: number;
      daysMin: number;
      daysMax: number;
    }
  | { ok: false; error: CalculatorError };

export function calculate(
  selection: Selection[],
  groups: readonly CalculatorGroup[],
  items: readonly CalculatorItem[],
  minimumPrice = 500_000,
): Calculation {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ids = new Set(selection.map((item) => item.itemId));
  if (
    selection.some(
      (item) =>
        !byId.has(item.itemId) || byId.get(item.itemId)?.isActive === false,
    ) ||
    ids.size !== selection.length
  ) {
    return { ok: false, error: "item_tidak_dikenal" };
  }
  for (const group of groups) {
    const count = selection.filter(
      (item) => byId.get(item.itemId)?.groupId === group.id,
    ).length;
    if (group.selectionType === "single" && count > 1)
      return { ok: false, error: "grup_single_lebih_dari_satu" };
    if (group.isRequired && count === 0)
      return { ok: false, error: "grup_wajib_kosong" };
  }
  for (const selected of selection) {
    const item = byId.get(selected.itemId)!;
    if (
      item.pricingType === "per_unit" &&
      (!Number.isInteger(selected.units) ||
        selected.units! < 1 ||
        selected.units! > (item.maxUnits ?? 1))
    ) {
      return { ok: false, error: "jumlah_unit_tidak_valid" };
    }
  }
  if (
    selection.some((selected) =>
      byId.get(selected.itemId)!.requires?.some((id) => !ids.has(id)),
    )
  ) {
    return { ok: false, error: "requires_belum_dipilih" };
  }
  if (
    items.some(
      (item) => ids.has(item.id) && item.excludes?.some((id) => ids.has(id)),
    )
  ) {
    return { ok: false, error: "excludes_bentrok" };
  }
  let priceMin = 0,
    priceMax = 0,
    daysMin = 0,
    daysMax = 0;
  for (const selected of selection) {
    const item = byId.get(selected.itemId)!;
    const units = item.pricingType === "per_unit" ? selected.units! : 1;
    priceMin += item.priceMin * units;
    priceMax += (item.priceMax ?? item.priceMin) * units;
    daysMin += item.daysMin;
    daysMax += item.daysMax ?? item.daysMin;
  }
  return {
    ok: true,
    priceMin: Math.max(priceMin, minimumPrice),
    priceMax: Math.max(priceMax, minimumPrice),
    daysMin,
    daysMax,
  };
}
