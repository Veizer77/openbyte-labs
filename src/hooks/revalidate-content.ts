import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Invalidasi cache konten (F3-04).
 *
 * Tag yang dipakai pembacaan ada di `src/server/content/cache.ts`. Setiap
 * perubahan menyegarkan tag entitasnya **dan** tag `content` sebagai jaring
 * pengaman relasi (media, kategori, teknologi) yang memengaruhi banyak halaman.
 *
 * `{ expire: 0 }` dipakai agar permintaan berikutnya menunggu revalidasi dan
 * langsung mendapat data baru — bukan menyajikan versi lama tanpa batas.
 */
function refreshTag(tag: string): void {
  if (process.env.PAYLOAD_SEEDING === '1' || process.env.PAYLOAD_MIGRATING === 'true') return
  try {
    revalidateTag(tag, { expire: 0 })
  } catch {
    // Di luar konteks request Next.js (seeder, test, CLI)
  }
}

function refreshContentTags(tag: string): void {
  refreshTag(tag)
  refreshTag('content')
}

export function revalidateCollectionTag(tag: string): {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  return {
    afterChange: ({ doc }) => {
      refreshContentTags(tag)
      return doc
    },
    afterDelete: ({ doc }) => {
      refreshContentTags(tag)
      return doc
    },
  }
}

export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  refreshContentTags('settings')
  return doc
}
