import { describe, expect, it } from 'vitest'
import { formatRupiah, formatWibDate, formatWibDateTime, getWibMonthRange } from '../../src/lib/format/date'

describe('WIB date and currency formatters', () => {
  it('computes exact UTC boundaries for current WIB month', () => {
    // 2026-10-27 14:00:00Z = 2026-10-27 21:00:00 WIB
    const testDate = new Date('2026-10-27T14:00:00.000Z')
    const { startUtc, endUtc } = getWibMonthRange(testDate)

    // Month start: 2026-10-01 00:00:00 WIB = 2026-09-30 17:00:00.000Z
    expect(startUtc).toBe('2026-09-30T17:00:00.000Z')
    // Month end: 2026-11-01 00:00:00 WIB = 2026-10-31 17:00:00.000Z
    expect(endUtc).toBe('2026-10-31T17:00:00.000Z')
  })

  it('formats dates in Asia/Jakarta Indonesian format', () => {
    const testDate = new Date('2026-10-19T03:00:00.000Z') // 10:00 WIB
    const formatted = formatWibDate(testDate)
    expect(formatted).toMatch(/19 Oktober 2026/)

    const formattedTime = formatWibDateTime(testDate)
    expect(formattedTime).toMatch(/19 Oktober 2026/)
    expect(formattedTime).toMatch(/10\.00|10:00/)
  })

  it('formats Rupiah integers without decimals', () => {
    expect(formatRupiah(4000000)).toBe('Rp 4.000.000')
    expect(formatRupiah(0)).toBe('Rp 0')
    expect(formatRupiah(undefined)).toBe('Rp 0')
  })
})
