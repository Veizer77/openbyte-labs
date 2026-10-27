/**
 * Mesin slot booking konsultasi (PRD 4.6, Lampiran G.2).
 * Pure TypeScript, tidak mengimpor Payload/Next.js/React.
 *
 * Konvensi:
 * - weekday: 0=Minggu, 1=Senin, ..., 6=Sabtu
 * - Semua jam WIB (UTC+7, tanpa DST)
 * - Interval setengah terbuka: [start, end)
 * - Slots bersebelahan tidak beririsan
 *
 * Algoritma:
 * 1. Cek rentang minDaysAhead/maxDaysAhead (hari WIB)
 * 2. Generate slots dari rules dengan weekday cocok
 * 3. Filter overlap dengan blocked dates & active bookings
 * 4. Sort by start time
 */

import type { SlotGenerationInput, TimeSlot } from './types'

const WIB_OFFSET = 7 * 60 * 60 * 1000 // UTC+7

/**
 * Convert YYYY-MM-DD WIB date + HH:mm time ke ISO UTC.
 */
function toUtcIso(dateWib: string, timeWib: string): string {
  const [year, month, day] = dateWib.split('-').map(Number)
  const [hour, minute] = timeWib.split(':').map(Number)
  
  // Buat Date di WIB lalu convert ke UTC
  // WIB = UTC+7, jadi kurangi 7 jam
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0))
  return utcDate.toISOString()
}

/**
 * Get weekday (0=Sun, 6=Sat) dari YYYY-MM-DD WIB.
 */
function getWeekdayWib(dateWib: string): number {
  const [year, month, day] = dateWib.split('-').map(Number)
  // Date constructor: month is 0-indexed
  return new Date(year, month - 1, day).getDay()
}

/**
 * Convert YYYY-MM-DD WIB ke start of day UTC ISO.
 */
function dateWibToUtc(dateWib: string): string {
  return toUtcIso(dateWib, '00:00')
}

/**
 * Get hari ini dalam WIB (YYYY-MM-DD).
 */
function getTodayWib(now: Date): string {
  const wibMs = now.getTime() + WIB_OFFSET
  const d = new Date(wibMs)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Cek apakah dua interval overlap (setengah terbuka).
 * [a, b) dan [c, d) overlap jika a < d AND c < b.
 */
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Generate available slots untuk satu tanggal WIB.
 */
export function generateSlots(input: SlotGenerationInput): TimeSlot[] {
  const { dateWib, rules, blocked, bookings, settings, now = new Date() } = input
  const { slotDurationMinutes, bufferMinutes, minDaysAhead, maxDaysAhead } = settings

  // 1. Cek rentang hari
  const todayWib = getTodayWib(now)
  const targetDate = new Date(dateWibToUtc(dateWib))
  const todayDate = new Date(dateWibToUtc(todayWib))
  
  const daysDiff = Math.floor((targetDate.getTime() - todayDate.getTime()) / (24 * 60 * 60 * 1000))
  
  if (daysDiff < minDaysAhead || daysDiff > maxDaysAhead) {
    return []
  }

  // 2. Generate slots dari rules
  const weekday = getWeekdayWib(dateWib)
  const activeRules = rules.filter((r) => r.isActive && r.weekday === weekday)
  
  if (activeRules.length === 0) {
    return []
  }

  const candidateSlots: TimeSlot[] = []
  
  for (const rule of activeRules) {
    const [startHour, startMin] = rule.startTime.split(':').map(Number)
    const [endHour, endMin] = rule.endTime.split(':').map(Number)
    
    let cursorMin = startHour * 60 + startMin
    const endMin_total = endHour * 60 + endMin
    
    while (cursorMin + slotDurationMinutes <= endMin_total) {
      const slotStartHour = Math.floor(cursorMin / 60)
      const slotStartMin = cursorMin % 60
      const slotStart = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}`
      
      const slotEndMin = cursorMin + slotDurationMinutes
      const slotEndHour = Math.floor(slotEndMin / 60)
      const slotEndMin_mod = slotEndMin % 60
      const slotEnd = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin_mod).padStart(2, '0')}`
      
      candidateSlots.push({
        start: toUtcIso(dateWib, slotStart),
        end: toUtcIso(dateWib, slotEnd),
      })
      
      cursorMin += slotDurationMinutes + bufferMinutes
    }
  }

  // 3. Filter blocked dates
  const activeBlocked = blocked.filter((b) => b.isActive)
  const filteredByBlocked = candidateSlots.filter((slot) => {
    for (const block of activeBlocked) {
      // Full day block
      if (!block.startTime || !block.endTime) {
        const blockDateUtc = dateWibToUtc(block.date)
        const nextDayUtc = new Date(new Date(blockDateUtc).getTime() + 24 * 60 * 60 * 1000).toISOString()
        if (overlaps(slot.start, slot.end, blockDateUtc, nextDayUtc)) {
          return false
        }
      } else {
        // Partial block
        const blockStart = toUtcIso(block.date, block.startTime)
        const blockEnd = toUtcIso(block.date, block.endTime)
        if (overlaps(slot.start, slot.end, blockStart, blockEnd)) {
          return false
        }
      }
    }
    return true
  })

  // 4. Filter active bookings
  const activeBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed')
  const availableSlots = filteredByBlocked.filter((slot) => {
    for (const booking of activeBookings) {
      if (overlaps(slot.start, slot.end, booking.slotStart, booking.slotEnd)) {
        return false
      }
    }
    return true
  })

  // 5. Sort by start time
  availableSlots.sort((a, b) => a.start.localeCompare(b.start))

  return availableSlots
}
