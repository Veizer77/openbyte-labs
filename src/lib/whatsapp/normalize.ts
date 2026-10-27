/**
 * Normalisasi nomor WhatsApp Indonesia sesuai PRD Lampiran G.3.
 *
 * Aturan:
 * 1. Pangkas spasi. Tolak bila ada karakter selain `+`, angka, spasi, `-`, `(`, `)`.
 * 2. Buang semua non-angka. Awalan `0` diganti `62`; awalan `8` diberi awalan `62`.
 * 3. Valid bila cocok `^628\d{8,11}$`; selain itu `null` (tolak).
 */
export function normalizeWhatsAppNumber(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim()
  if (!trimmed) return null

  // Tolak jika ada karakter selain `+`, angka, spasi, `-`, `(`, `)`
  if (!/^[+\d\s\-()]+$/.test(trimmed)) {
    return null
  }

  // Buang semua non-angka
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (!digitsOnly) return null

  let normalized = digitsOnly
  if (normalized.startsWith('0')) {
    normalized = `62${normalized.slice(1)}`
  } else if (normalized.startsWith('8')) {
    normalized = `62${normalized}`
  }

  // Valid bila cocok ^628\d{8,11}$ (total panjang 11 s/d 14 digit)
  if (!/^628\d{8,11}$/.test(normalized)) {
    return null
  }

  return normalized
}
