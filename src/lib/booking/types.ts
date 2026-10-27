/**
 * Pure TypeScript types untuk booking slots (PRD 4.6, Lampiran G.2).
 * Tidak mengimpor Payload atau Next.js.
 */

export interface AvailabilityRule {
  id: string
  weekday: number // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string // HH:mm (WIB)
  endTime: string // HH:mm (WIB)
  isActive: boolean
}

export interface BlockedDate {
  id: string
  date: string // YYYY-MM-DD (WIB)
  startTime?: string | null // HH:mm or null = full day
  endTime?: string | null
  isActive: boolean
}

export interface Booking {
  id: string
  slotStart: string // ISO UTC
  slotEnd: string // ISO UTC
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface BookingSettings {
  slotDurationMinutes: number
  bufferMinutes: number
  minDaysAhead: number
  maxDaysAhead: number
}

export interface SlotGenerationInput {
  dateWib: string // YYYY-MM-DD
  rules: AvailabilityRule[]
  blocked: BlockedDate[]
  bookings: Booking[]
  settings: BookingSettings
  now?: Date // for testing
}

export interface TimeSlot {
  start: string // ISO UTC
  end: string // ISO UTC
}
