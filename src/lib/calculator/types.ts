/**
 * Pure TypeScript types untuk kalkulator (PRD 4.4, Lampiran G.1).
 * Tidak mengimpor Payload atau Next.js.
 */

export interface CalculatorGroup {
  id: string
  name: string
  slug: string
  displayType: 'single' | 'multiple'
  isRequired: boolean
  isActive: boolean
}

export interface CalculatorItem {
  id: string
  name: string
  slug: string
  description?: string | null
  priceMin: number
  priceMax?: number | null
  daysMin: number
  daysMax?: number | null
  pricingType: 'fixed' | 'per_unit'
  maxUnits?: number | null
  isActive: boolean
  group: string // group id
}

export interface CalculatorRule {
  id: string
  item: string // item id
  requiresItems: string[] // item ids
  excludesItems: string[] // item ids
  isActive: boolean
}

export interface CalculatorConfig {
  groups: CalculatorGroup[]
  items: CalculatorItem[]
  rules: CalculatorRule[]
  minimumPrice?: number
}

export interface CalculatorSelection {
  itemId: string
  units?: number | null
}

export interface CalculatorResult {
  success: true
  priceMin: number
  priceMax: number
  daysMin: number
  daysMax: number
  selections: Array<{
    itemId: string
    itemName: string
    units: number
    priceMin: number
    priceMax: number
    daysMin: number
    daysMax: number
  }>
}

export interface CalculatorError {
  success: false
  error:
    | 'item_tidak_dikenal'
    | 'grup_single_lebih_dari_satu'
    | 'grup_wajib_kosong'
    | 'jumlah_unit_tidak_valid'
    | 'requires_belum_dipilih'
    | 'excludes_bentrok'
  details?: string
}

export type CalculatorOutput = CalculatorResult | CalculatorError
