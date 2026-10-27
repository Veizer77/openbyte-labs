import { describe, expect, it } from 'vitest'
import {
  calculatePaymentStatus,
  calculateCurrentStep,
  generateTrackingCode,
  generatePin,
  generateReference,
  isValidTrackingCode,
  isValidReference,
} from '../../src/lib/format'
import referenceFixtures from '../fixtures/reference.json'

/**
 * Test reference utilities dengan fixture Lampiran G.5.
 */

describe('Reference Utilities - Lampiran G.5', () => {
  describe('Payment Status', () => {
    referenceFixtures.paymentStatus.forEach((fixture) => {
      it(`${fixture.id}: ${fixture.description}`, () => {
        const result = calculatePaymentStatus(fixture.totalCost, fixture.paidAmount)
        expect(result).toBe(fixture.expected)
      })
    })
  })

  describe('Current Step', () => {
    referenceFixtures.currentStep.forEach((fixture) => {
      it(`${fixture.id}: ${fixture.description}`, () => {
        const result = calculateCurrentStep(fixture.steps)
        expect(result).toBe(fixture.expected)
      })
    })
  })

  describe('Tracking Code Generation', () => {
    it('generates PRJ-XXXXXXXX format with 8 chars from alphabet', () => {
      const code = generateTrackingCode()
      expect(code).toMatch(/^PRJ-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/)
    })

    it('generates unique codes', () => {
      const codes = new Set<string>()
      for (let i = 0; i < 100; i++) {
        codes.add(generateTrackingCode())
      }
      expect(codes.size).toBe(100)
    })

    it('validates tracking code format', () => {
      expect(isValidTrackingCode('PRJ-ABCD2345')).toBe(true)
      expect(isValidTrackingCode('PRJ-12345678')).toBe(false) // no 1
      expect(isValidTrackingCode('PRJ-ABCDOEFG')).toBe(false) // no O
      expect(isValidTrackingCode('prj-abcd2345')).toBe(false) // lowercase
      expect(isValidTrackingCode('PRJ-ABC123')).toBe(false) // too short
    })
  })

  describe('PIN Generation', () => {
    it('generates 6-digit PIN', () => {
      const pin = generatePin()
      expect(pin).toMatch(/^\d{6}$/)
    })

    it('pads with leading zeros', () => {
      // Run multiple times to increase chance of getting small numbers
      let hasLeadingZero = false
      for (let i = 0; i < 50; i++) {
        const pin = generatePin()
        if (pin.startsWith('0')) {
          hasLeadingZero = true
          break
        }
      }
      // Statistical test: at least one PIN should start with 0 in 50 tries
      expect(hasLeadingZero).toBe(true)
    })

    it('generates diverse PINs', () => {
      const pins = new Set<string>()
      for (let i = 0; i < 100; i++) {
        pins.add(generatePin())
      }
      // Should have at least 95 unique PINs out of 100
      expect(pins.size).toBeGreaterThanOrEqual(95)
    })
  })

  describe('Reference Generation', () => {
    it('generates INQ reference with YYMM-XXXX format', () => {
      const ref = generateReference('INQ', new Date('2026-10-27T03:00:00.000Z'))
      expect(ref).toMatch(/^INQ-2610-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/)
    })

    it('generates QTE reference', () => {
      const ref = generateReference('QTE', new Date('2026-10-27T03:00:00.000Z'))
      expect(ref).toMatch(/^QTE-2610-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/)
    })

    it('generates BKG reference', () => {
      const ref = generateReference('BKG', new Date('2026-10-27T03:00:00.000Z'))
      expect(ref).toMatch(/^BKG-2610-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/)
    })

    it('uses WIB timezone for YYMM', () => {
      // 2026-10-31T18:00:00.000Z = 2026-11-01 01:00 WIB
      const ref = generateReference('INQ', new Date('2026-10-31T18:00:00.000Z'))
      expect(ref).toMatch(/^INQ-2611-/)
    })

    it('validates reference format', () => {
      expect(isValidReference('INQ-2610-A3F9')).toBe(true)
      expect(isValidReference('QTE-2610-B7K2')).toBe(true)
      expect(isValidReference('BKG-2610-M8N4')).toBe(true)
      expect(isValidReference('INQ-261-A3F9')).toBe(false) // wrong YYMM
      expect(isValidReference('INQ-2610-ABCDE')).toBe(false) // too long
      expect(isValidReference('INV-2610-A3F9')).toBe(false) // wrong prefix
      expect(isValidReference('INQ-2610-O123')).toBe(false) // has O
    })

    it('generates unique references', () => {
      const refs = new Set<string>()
      const date = new Date('2026-10-27T03:00:00.000Z')
      for (let i = 0; i < 100; i++) {
        refs.add(generateReference('INQ', date))
      }
      expect(refs.size).toBe(100)
    })
  })

  describe('Edge Cases', () => {
    it('payment status handles negative amounts', () => {
      expect(calculatePaymentStatus(1000000, -100)).toBe('unpaid')
    })

    it('current step handles empty array', () => {
      expect(calculateCurrentStep([])).toBe(6)
    })

    it('current step handles unordered steps', () => {
      const result = calculateCurrentStep([
        { stepNumber: 3, status: 'done' },
        { stepNumber: 1, status: 'done' },
        { stepNumber: 2, status: 'pending' },
      ])
      expect(result).toBe(2)
    })
  })
})
