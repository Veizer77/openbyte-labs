/**
 * Mesin kalkulator estimasi proyek (PRD 4.4, Lampiran G.1).
 * Pure TypeScript, tidak mengimpor Payload/Next.js/React.
 *
 * Aturan validasi (berurutan):
 * 1. item_tidak_dikenal
 * 2. grup_single_lebih_dari_satu & grup_wajib_kosong
 * 3. jumlah_unit_tidak_valid
 * 4. requires_belum_dipilih
 * 5. excludes_bentrok
 *
 * Perhitungan:
 * - k = units bila per_unit, selain itu 1
 * - priceMin = Σ priceMin·k, lalu max(sum, minimumPrice)
 * - priceMax = Σ (priceMax ?? priceMin)·k, lalu max(sum, minimumPrice)
 * - daysMin = Σ daysMin (TIDAK dikali unit)
 * - daysMax = Σ (daysMax ?? daysMin) (TIDAK dikali unit)
 */

import type {
  CalculatorConfig,
  CalculatorSelection,
  CalculatorOutput,
} from './types'

export function calculate(
  selections: CalculatorSelection[],
  config: CalculatorConfig,
): CalculatorOutput {
  const { groups, items, rules, minimumPrice = 500000 } = config

  // Map untuk lookup cepat
  const itemMap = new Map(items.map((i) => [i.id, i]))
  const ruleMap = new Map(rules.filter((r) => r.isActive).map((r) => [r.item, r]))

  // 1. Validasi: item_tidak_dikenal
  const selectedIds = new Set<string>()
  for (const sel of selections) {
    const item = itemMap.get(sel.itemId)
    if (!item || !item.isActive) {
      return {
        success: false,
        error: 'item_tidak_dikenal',
        details: `Item ${sel.itemId} tidak dikenal atau tidak aktif`,
      }
    }
    selectedIds.add(sel.itemId)
  }

  // 2. Validasi: grup single & required
  const groupItemCount = new Map<string, number>()
  for (const sel of selections) {
    const item = itemMap.get(sel.itemId)!
    const count = groupItemCount.get(item.group) || 0
    groupItemCount.set(item.group, count + 1)
  }

  for (const group of groups) {
    if (!group.isActive) continue
    const count = groupItemCount.get(group.id) || 0

    if (group.displayType === 'single' && count > 1) {
      return {
        success: false,
        error: 'grup_single_lebih_dari_satu',
        details: `Grup "${group.name}" hanya boleh memilih satu item`,
      }
    }

    if (group.isRequired && count === 0) {
      return {
        success: false,
        error: 'grup_wajib_kosong',
        details: `Grup "${group.name}" wajib dipilih minimal satu item`,
      }
    }
  }

  // 3. Validasi: jumlah_unit_tidak_valid
  for (const sel of selections) {
    const item = itemMap.get(sel.itemId)!
    if (item.pricingType === 'per_unit') {
      const units = sel.units ?? 0
      const max = item.maxUnits ?? 1
      if (!Number.isInteger(units) || units < 1 || units > max) {
        return {
          success: false,
          error: 'jumlah_unit_tidak_valid',
          details: `Item "${item.name}" memerlukan unit antara 1 sampai ${max}`,
        }
      }
    }
  }

  // 4. Validasi: requires_belum_dipilih
  for (const sel of selections) {
    const rule = ruleMap.get(sel.itemId)
    if (rule && rule.requiresItems.length > 0) {
      for (const reqId of rule.requiresItems) {
        if (!selectedIds.has(reqId)) {
          const reqItem = itemMap.get(reqId)
          return {
            success: false,
            error: 'requires_belum_dipilih',
            details: `Item "${itemMap.get(sel.itemId)!.name}" memerlukan "${reqItem?.name || reqId}"`,
          }
        }
      }
    }
  }

  // 5. Validasi: excludes_bentrok
  for (const sel of selections) {
    const rule = ruleMap.get(sel.itemId)
    if (rule && rule.excludesItems.length > 0) {
      for (const excId of rule.excludesItems) {
        if (selectedIds.has(excId)) {
          const excItem = itemMap.get(excId)
          return {
            success: false,
            error: 'excludes_bentrok',
            details: `Item "${itemMap.get(sel.itemId)!.name}" tidak dapat dikombinasikan dengan "${excItem?.name || excId}"`,
          }
        }
      }
    }
  }

  // Perhitungan
  let priceMinSum = 0
  let priceMaxSum = 0
  let daysMinSum = 0
  let daysMaxSum = 0

  const details = selections.map((sel) => {
    const item = itemMap.get(sel.itemId)!
    const k = item.pricingType === 'per_unit' ? (sel.units ?? 1) : 1

    const itemPriceMin = item.priceMin * k
    const itemPriceMax = (item.priceMax ?? item.priceMin) * k
    const itemDaysMin = item.daysMin
    const itemDaysMax = item.daysMax ?? item.daysMin

    priceMinSum += itemPriceMin
    priceMaxSum += itemPriceMax
    daysMinSum += itemDaysMin
    daysMaxSum += itemDaysMax

    return {
      itemId: item.id,
      itemName: item.name,
      units: k,
      priceMin: itemPriceMin,
      priceMax: itemPriceMax,
      daysMin: itemDaysMin,
      daysMax: itemDaysMax,
    }
  })

  // Apply minimum price
  const finalPriceMin = Math.max(priceMinSum, minimumPrice)
  const finalPriceMax = Math.max(priceMaxSum, minimumPrice)

  return {
    success: true,
    priceMin: finalPriceMin,
    priceMax: finalPriceMax,
    daysMin: daysMinSum,
    daysMax: daysMaxSum,
    selections: details,
  }
}
