const WIB_OFFSET_HOURS = 7
const WIB_OFFSET_MS = WIB_OFFSET_HOURS * 60 * 60 * 1000

export function getWibMonthRange(referenceDate = new Date()): { startUtc: string; endUtc: string } {
  const wibTime = new Date(referenceDate.getTime() + WIB_OFFSET_MS)
  const year = wibTime.getUTCFullYear()
  const month = wibTime.getUTCMonth()

  const startUtcDate = new Date(Date.UTC(year, month, 1, 0, 0, 0) - WIB_OFFSET_MS)
  const endUtcDate = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0) - WIB_OFFSET_MS)

  return {
    startUtc: startUtcDate.toISOString(),
    endUtc: endUtcDate.toISOString(),
  }
}

export function formatWibDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-'
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)
}

export function formatWibDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-'
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatRupiah(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return 'Rp 0'
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`
}
