/**
 * Utilitas nilai turunan, kode, dan referensi (PRD Lampiran G.5).
 * Pure TypeScript, tidak mengimpor Payload/Next.js/React.
 */

/**
 * Alfabet 32 karakter tanpa I, O, 0, 1 untuk kode tracking dan referensi.
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * Hitung payment status berdasarkan totalCost dan paidAmount.
 */
export function calculatePaymentStatus(
  totalCost: number,
  paidAmount: number,
): 'unpaid' | 'down_payment' | 'paid_off' {
  if (paidAmount <= 0) {
    return 'unpaid'
  }
  if (totalCost > 0 && paidAmount >= totalCost) {
    return 'paid_off'
  }
  return 'down_payment'
}

/**
 * Hitung current step: stepNumber terkecil yang bukan 'done', atau 6 bila semua done.
 */
export function calculateCurrentStep(
  steps: Array<{ stepNumber: number; status: string }>,
): number {
  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber)
  for (const step of sorted) {
    if (step.status !== 'done') {
      return step.stepNumber
    }
  }
  return 6
}

/**
 * Generate random string dari ALPHABET dengan panjang tertentu.
 * Menggunakan crypto.getRandomValues untuk CSPRNG.
 */
function generateRandomCode(length: number): string {
  const bytes = new Uint8Array(length)
  
  // Node.js dan browser modern
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    throw new Error('crypto.getRandomValues tidak tersedia')
  }

  let result = ''
  for (let i = 0; i < length; i++) {
    // 32 membagi 256 tanpa bias modulo
    result += ALPHABET[bytes[i] % 32]
  }
  return result
}

/**
 * Generate tracking code PRJ-XXXXXXXX (8 char random).
 */
export function generateTrackingCode(): string {
  return `PRJ-${generateRandomCode(8)}`
}

/**
 * Generate 6-digit PIN dari CSPRNG.
 * Menggunakan crypto untuk generate angka 0-999999.
 */
export function generatePin(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const num = array[0] % 1000000
    return String(num).padStart(6, '0')
  }
  throw new Error('crypto.getRandomValues tidak tersedia')
}

/**
 * Generate reference number: PREFIX-YYMM-XXXX.
 * YYMM dalam WIB, XXXX dari ALPHABET.
 */
export function generateReference(
  prefix: 'INQ' | 'QTE' | 'BKG',
  date: Date = new Date(),
): string {
  // Convert ke WIB (UTC+7)
  const wibMs = date.getTime() + 7 * 60 * 60 * 1000
  const wibDate = new Date(wibMs)
  
  const year = String(wibDate.getUTCFullYear()).slice(-2)
  const month = String(wibDate.getUTCMonth() + 1).padStart(2, '0')
  const code = generateRandomCode(4)
  
  return `${prefix}-${year}${month}-${code}`
}

/**
 * Validasi format tracking code.
 */
export function isValidTrackingCode(code: string): boolean {
  const pattern = /^PRJ-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/
  return pattern.test(code)
}

/**
 * Validasi format reference.
 */
export function isValidReference(ref: string): boolean {
  const pattern = /^(INQ|QTE|BKG)-\d{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/
  return pattern.test(ref)
}
