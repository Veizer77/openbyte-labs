import { describe, expect, it } from 'vitest'
import { calculate } from '../../src/lib/calculator'
import type { CalculatorConfig } from '../../src/lib/calculator'
import calculatorFixtures from '../fixtures/calculator.json'

/**
 * Test calculator engine dengan fixture Lampiran G.1.
 * Data konfigurasi sesuai PRD 8.4 dan seeder.
 */

// Mock config sesuai PRD 8.4
const mockConfig: CalculatorConfig = {
  minimumPrice: 500000,
  groups: [
    { id: 'platform', name: 'Platform', slug: 'platform', displayType: 'single', isRequired: true, isActive: true },
    { id: 'fitur', name: 'Jenis Solusi', slug: 'jenis-solusi', displayType: 'single', isRequired: true, isActive: true },
    { id: 'modul', name: 'Modul Tambahan', slug: 'modul', displayType: 'multiple', isRequired: false, isActive: true },
  ],
  items: [
    // Platform (single, wajib)
    { id: 'web', name: 'Web Saja', slug: 'web', priceMin: 0, priceMax: 0, daysMin: 0, daysMax: 0, pricingType: 'fixed', isActive: true, group: 'platform' },
    { id: 'android', name: 'Android', slug: 'android', priceMin: 1500000, priceMax: 2500000, daysMin: 10, daysMax: 14, pricingType: 'fixed', isActive: true, group: 'platform' },
    { id: 'webandr', name: 'Web+Android', slug: 'web-android', priceMin: 2500000, priceMax: 4000000, daysMin: 14, daysMax: 21, pricingType: 'fixed', isActive: true, group: 'platform' },
    
    // Jenis Solusi (single, wajib)
    { id: 'landing', name: 'Landing Page', slug: 'landing', priceMin: 600000, priceMax: 1200000, daysMin: 3, daysMax: 5, pricingType: 'fixed', isActive: true, group: 'fitur' },
    { id: 'katalog', name: 'Katalog Produk', slug: 'katalog', priceMin: 1500000, priceMax: 2500000, daysMin: 7, daysMax: 10, pricingType: 'fixed', isActive: true, group: 'fitur' },
    { id: 'sidb', name: 'Sistem Informasi Database', slug: 'sistem-informasi', priceMin: 2500000, priceMax: 4000000, daysMin: 14, daysMax: 21, pricingType: 'fixed', isActive: true, group: 'fitur' },
    { id: 'undangan', name: 'Undangan Digital', slug: 'undangan', priceMin: 400000, priceMax: 1000000, daysMin: 2, daysMax: 4, pricingType: 'fixed', isActive: true, group: 'fitur' },
    
    // Modul Tambahan (multiple, opsional)
    { id: 'rbac', name: 'RBAC Multi-User', slug: 'rbac', priceMin: 500000, priceMax: 1000000, daysMin: 2, daysMax: 3, pricingType: 'fixed', isActive: true, group: 'modul' },
    { id: 'gis', name: 'Peta GIS', slug: 'gis', priceMin: 1000000, priceMax: 2000000, daysMin: 4, daysMax: 6, pricingType: 'fixed', isActive: true, group: 'modul' },
    { id: 'laporan', name: 'Laporan Excel/PDF', slug: 'laporan', priceMin: 400000, priceMax: 800000, daysMin: 2, daysMax: 3, pricingType: 'fixed', isActive: true, group: 'modul' },
    { id: 'pay', name: 'Payment Gateway', slug: 'payment', priceMin: 700000, priceMax: 1500000, daysMin: 3, daysMax: 5, pricingType: 'fixed', isActive: true, group: 'modul' },
    { id: 'halaman', name: 'Halaman Tambahan', slug: 'halaman', priceMin: 75000, priceMax: 150000, daysMin: 0, daysMax: 0, pricingType: 'per_unit', maxUnits: 20, isActive: true, group: 'modul' },
  ],
  rules: [
    { id: 'r1', item: 'rbac', requiresItems: ['sidb'], excludesItems: [], isActive: true },
    { id: 'r2', item: 'laporan', requiresItems: ['sidb'], excludesItems: [], isActive: true },
    { id: 'r3', item: 'android', requiresItems: [], excludesItems: ['landing', 'undangan'], isActive: true },
    { id: 'r4', item: 'landing', requiresItems: [], excludesItems: ['android'], isActive: true },
    { id: 'r5', item: 'undangan', requiresItems: [], excludesItems: ['android'], isActive: true },
    { id: 'r6', item: 'webandr', requiresItems: [], excludesItems: ['landing', 'undangan'], isActive: true },
  ],
}

describe('Calculator Engine - Lampiran G.1', () => {
  calculatorFixtures.vectors.forEach((fixture) => {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const result = calculate(fixture.items, mockConfig)

      if (fixture.expected.success) {
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.priceMin).toBe(fixture.expected.priceMin)
          expect(result.priceMax).toBe(fixture.expected.priceMax)
          expect(result.daysMin).toBe(fixture.expected.daysMin)
          expect(result.daysMax).toBe(fixture.expected.daysMax)
        }
      } else {
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error).toBe(fixture.expected.error)
        }
      }
    })
  })

  it('handles edge case: non-finite units', () => {
    const result = calculate(
      [
        { itemId: 'web', units: null },
        { itemId: 'landing', units: null },
        { itemId: 'halaman', units: Infinity },
      ],
      mockConfig,
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('jumlah_unit_tidak_valid')
    }
  })

  it('handles edge case: duplicate item selection', () => {
    const result = calculate(
      [
        { itemId: 'web', units: null },
        { itemId: 'web', units: null },
        { itemId: 'landing', units: null },
      ],
      mockConfig,
    )
    // Platform is single, web chosen twice = error
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('grup_single_lebih_dari_satu')
    }
  })

  it('handles inactive item', () => {
    const configWithInactive = {
      ...mockConfig,
      items: mockConfig.items.map((item) =>
        item.id === 'web' ? { ...item, isActive: false } : item
      ),
    }
    const result = calculate([{ itemId: 'web', units: null }], configWithInactive)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('item_tidak_dikenal')
    }
  })
})
