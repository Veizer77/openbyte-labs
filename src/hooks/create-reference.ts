import { randomInt } from 'node:crypto'
import type { CollectionBeforeValidateHook } from 'payload'

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

export function createReference(prefix: 'INQ' | 'QTE' | 'BKG'): CollectionBeforeValidateHook {
  return async ({ data, operation, req }) => {
    if (operation !== 'create') return data

    const now = new Date()
    const dateParts = new Intl.DateTimeFormat('en', {
      timeZone: 'Asia/Jakarta',
      year: '2-digit',
      month: '2-digit',
    }).formatToParts(now)
    const month = `${dateParts.find((part) => part.type === 'year')?.value}${dateParts.find((part) => part.type === 'month')?.value}`

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const suffix = Array.from({ length: 4 }, () => alphabet[randomInt(alphabet.length)]).join('')
      const reference = `${prefix}-${month}-${suffix}`
      const existing = await req.payload.find({
        collection:
          prefix === 'INQ'
            ? 'inquiries'
            : prefix === 'QTE'
              ? 'quote-requests'
              : 'consultation-bookings',
        where: { reference: { equals: reference } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.totalDocs === 0) return { ...data, reference }
    }

    throw new Error('Tidak dapat membuat nomor referensi unik. Silakan coba kembali.')
  }
}
