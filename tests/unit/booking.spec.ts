import { describe, expect, it } from 'vitest'
import { generateSlots } from '../../src/lib/booking'
import type { SlotGenerationInput } from '../../src/lib/booking'
import bookingFixtures from '../fixtures/booking.json'

/**
 * Test booking slot generation dengan fixture Lampiran G.2.
 * Semua tes memakai now = 2026-10-26T03:00:00.000Z (26 Okt 2026 10:00 WIB).
 */

const NOW = new Date('2026-10-26T03:00:00.000Z')

const DEFAULT_SETTINGS = {
  slotDurationMinutes: 60,
  bufferMinutes: 0,
  minDaysAhead: 1,
  maxDaysAhead: 30,
}

// Rules Mon-Fri: 09:00-11:00, 13:00-15:00, 16:00-18:00, 19:30-21:30 WIB
const DEFAULT_RULES = [
  { id: 'r1', weekday: 1, startTime: '09:00', endTime: '11:00', isActive: true },
  { id: 'r2', weekday: 1, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'r3', weekday: 1, startTime: '16:00', endTime: '18:00', isActive: true },
  { id: 'r4', weekday: 1, startTime: '19:30', endTime: '21:30', isActive: true },
  { id: 'r5', weekday: 2, startTime: '09:00', endTime: '11:00', isActive: true },
  { id: 'r6', weekday: 2, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'r7', weekday: 2, startTime: '16:00', endTime: '18:00', isActive: true },
  { id: 'r8', weekday: 2, startTime: '19:30', endTime: '21:30', isActive: true },
  { id: 'r9', weekday: 3, startTime: '09:00', endTime: '11:00', isActive: true },
  { id: 'r10', weekday: 3, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'r11', weekday: 3, startTime: '16:00', endTime: '18:00', isActive: true },
  { id: 'r12', weekday: 3, startTime: '19:30', endTime: '21:30', isActive: true },
  { id: 'r13', weekday: 4, startTime: '09:00', endTime: '11:00', isActive: true },
  { id: 'r14', weekday: 4, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'r15', weekday: 4, startTime: '16:00', endTime: '18:00', isActive: true },
  { id: 'r16', weekday: 4, startTime: '19:30', endTime: '21:30', isActive: true },
  { id: 'r17', weekday: 5, startTime: '09:00', endTime: '11:00', isActive: true },
  { id: 'r18', weekday: 5, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'r19', weekday: 5, startTime: '16:00', endTime: '18:00', isActive: true },
  { id: 'r20', weekday: 5, startTime: '19:30', endTime: '21:30', isActive: true },
]

describe('Booking Slot Generation - Lampiran G.2', () => {
  bookingFixtures.vectors.forEach((fixture) => {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const settings = { ...DEFAULT_SETTINGS, ...fixture.settings }
      
      // Helper: convert UTC ISO to WIB date/time
      const utcToWib = (utcIso: string) => {
        const utc = new Date(utcIso)
        const wibMs = utc.getTime() + 7 * 60 * 60 * 1000
        const wib = new Date(wibMs)
        const date = wib.toISOString().split('T')[0]
        const time = wib.toISOString().split('T')[1].substring(0, 5)
        return { date, time }
      }
      
      const input: SlotGenerationInput = {
        dateWib: fixture.dateWib,
        rules: DEFAULT_RULES,
        blocked: fixture.blocked.map((b: { start?: string; end?: string }) => {
          if (b.start && b.end) {
            const start = utcToWib(b.start)
            const end = utcToWib(b.end)
            // Check if full day: start 00:00, end 00:00 next day
            const isFullDay = start.time === '00:00' && end.time === '00:00'
            return {
              id: `block-${Math.random()}`,
              date: start.date,
              startTime: isFullDay ? null : start.time,
              endTime: isFullDay ? null : end.time,
              isActive: true,
            }
          }
          return {
            id: `block-${Math.random()}`,
            date: fixture.dateWib,
            startTime: null,
            endTime: null,
            isActive: true,
          }
        }),
        bookings: fixture.bookings.map((b: { start: string; end: string }) => ({
          id: `booking-${Math.random()}`,
          slotStart: b.start,
          slotEnd: b.end,
          status: 'pending' as const,
        })),
        settings,
        now: NOW,
      }

      const result = generateSlots(input)
      
      expect(result.length).toBe(fixture.expected.slots.length)
      
      result.forEach((slot, idx) => {
        const expected = fixture.expected.slots[idx]
        expect(slot.start).toBe(expected.start)
        expect(slot.end).toBe(expected.end)
      })
    })
  })

  it('handles edge case: overlapping bookings', () => {
    const input: SlotGenerationInput = {
      dateWib: '2026-11-02',
      rules: DEFAULT_RULES,
      blocked: [],
      bookings: [
        { id: 'b1', slotStart: '2026-11-02T02:00:00.000Z', slotEnd: '2026-11-02T03:00:00.000Z', status: 'pending' },
        { id: 'b2', slotStart: '2026-11-02T02:30:00.000Z', slotEnd: '2026-11-02T03:30:00.000Z', status: 'confirmed' },
      ],
      settings: DEFAULT_SETTINGS,
      now: NOW,
    }

    const result = generateSlots(input)
    
    // Both 09:00 and 10:00 slots should be blocked
    const has9am = result.some((s) => s.start === '2026-11-02T02:00:00.000Z')
    const has10am = result.some((s) => s.start === '2026-11-02T03:00:00.000Z')
    
    expect(has9am).toBe(false)
    expect(has10am).toBe(false)
  })

  it('handles edge case: cancelled booking does not block', () => {
    const input: SlotGenerationInput = {
      dateWib: '2026-11-02',
      rules: DEFAULT_RULES,
      blocked: [],
      bookings: [
        { id: 'b1', slotStart: '2026-11-02T02:00:00.000Z', slotEnd: '2026-11-02T03:00:00.000Z', status: 'cancelled' },
      ],
      settings: DEFAULT_SETTINGS,
      now: NOW,
    }

    const result = generateSlots(input)
    
    // 09:00 slot should be available
    const has9am = result.some((s) => s.start === '2026-11-02T02:00:00.000Z')
    expect(has9am).toBe(true)
  })

  it('handles edge case: adjacent slots do not overlap', () => {
    const input: SlotGenerationInput = {
      dateWib: '2026-11-02',
      rules: DEFAULT_RULES,
      blocked: [],
      bookings: [
        { id: 'b1', slotStart: '2026-11-02T02:00:00.000Z', slotEnd: '2026-11-02T03:00:00.000Z', status: 'pending' },
      ],
      settings: DEFAULT_SETTINGS,
      now: NOW,
    }

    const result = generateSlots(input)
    
    // 10:00 slot (adjacent) should be available
    const has10am = result.some((s) => s.start === '2026-11-02T03:00:00.000Z')
    expect(has10am).toBe(true)
  })

  it('handles inactive rules', () => {
    const inactiveRules = DEFAULT_RULES.map((r) => ({ ...r, isActive: false }))
    
    const input: SlotGenerationInput = {
      dateWib: '2026-11-02',
      rules: inactiveRules,
      blocked: [],
      bookings: [],
      settings: DEFAULT_SETTINGS,
      now: NOW,
    }

    const result = generateSlots(input)
    expect(result.length).toBe(0)
  })
})
