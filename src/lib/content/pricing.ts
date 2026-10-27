/**
 * Aturan harga paket (F3-03, F3-04).
 *
 * Diskon hanya berlaku bila `discountPrice` bilangan bulat positif di bawah
 * harga normal dan `discountEndsAt` belum lewat. Perbandingan memakai instan
 * UTC; tampilan tanggal tetap Asia/Jakarta.
 */

export type PriceInput = {
  price: number
  discountPrice?: number | null
  discountEndsAt?: string | null
}

export type ResolvedPrice = {
  /** Harga yang berlaku sekarang. */
  price: number
  /** Harga normal bila diskon aktif; null bila tidak. */
  originalPrice: number | null
  isDiscounted: boolean
  discountEndsAt: string | null
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

export function resolvePrice(input: PriceInput, now: Date = new Date()): ResolvedPrice {
  const basePrice = Number.isInteger(input.price) && input.price >= 0 ? input.price : 0
  const discountPrice = input.discountPrice
  const endsAt = input.discountEndsAt ?? null

  if (!isPositiveInteger(discountPrice) || discountPrice >= basePrice) {
    return { price: basePrice, originalPrice: null, isDiscounted: false, discountEndsAt: null }
  }

  if (endsAt) {
    const endsAtTime = new Date(endsAt).getTime()
    if (Number.isNaN(endsAtTime) || endsAtTime <= now.getTime()) {
      return { price: basePrice, originalPrice: null, isDiscounted: false, discountEndsAt: null }
    }
  }

  return {
    price: discountPrice,
    originalPrice: basePrice,
    isDiscounted: true,
    discountEndsAt: endsAt,
  }
}

/**
 * Sisa detik sampai diskon berakhir. Dipakai untuk menetapkan batas cache agar
 * harga tidak bertahan melewati `discountEndsAt` tanpa scheduler (F3-04).
 */
export function secondsUntil(isoDate: string | null | undefined, now: Date = new Date()): number | null {
  if (!isoDate) return null
  const time = new Date(isoDate).getTime()
  if (Number.isNaN(time)) return null
  return Math.max(0, Math.ceil((time - now.getTime()) / 1000))
}
