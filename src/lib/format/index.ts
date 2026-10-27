/**
 * Format tampilan Rilis 1 (PRD 6.6): Rupiah tanpa desimal dan tanggal/jam
 * selalu Asia/Jakarta, tidak bergantung zona waktu perangkat atau proses server.
 */

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** `1500000` -> `Rp 1.500.000`. */
export function formatRupiah(value: number): string {
  const amount = Number.isFinite(value) ? Math.round(value) : 0
  return rupiahFormatter.format(amount)
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** `2026-10-19T...` -> `19 Oktober 2026` (WIB). */
export function formatTanggalWib(value: string | Date | null | undefined): string | null {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : null
}

/** `2026-10-19T03:00:00Z` -> `10.00` (WIB). */
export function formatJamWib(value: string | Date | null | undefined): string | null {
  const date = toDate(value)
  if (!date) return null
  return timeFormatter.format(date).replace(':', '.')
}

/** `19 Oktober 2026, 10.00 WIB`. */
export function formatTanggalJamWib(value: string | Date | null | undefined): string | null {
  const tanggal = formatTanggalWib(value)
  const jam = formatJamWib(value)
  if (!tanggal || !jam) return null
  return `${tanggal}, ${jam} WIB`
}

/** Rentang hari kerja, mis. `7 hari kerja`. */
export function formatDurasiHari(days: number | null | undefined): string | null {
  if (typeof days !== 'number' || !Number.isFinite(days) || days <= 0) return null
  return `${days} hari kerja`
}

// Re-export reference utilities
export {
  calculatePaymentStatus,
  calculateCurrentStep,
  generateTrackingCode,
  generatePin,
  generateReference,
  isValidTrackingCode,
  isValidReference,
} from './reference'
