import path from 'path'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { assertTestDatabaseTargetIsDisposable } from './db-target'

/**
 * Helper koleksi admin untuk E2E 12.3 butir 2 (aksi daftar: orderable, trash,
 * publish massal). Hanya berjalan pada database disposable — guard menolak
 * database dev Neon.
 */

async function payloadClient() {
  return getPayload({ config })
}

/** Media fixture dari berkas jpeg di repositori (upload lewat Local API). */
export async function seedMedia(alt: string): Promise<number> {
  await assertTestDatabaseTargetIsDisposable()
  const payload = await payloadClient()
  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt },
    filePath: path.resolve('public/images/a0f92bdabdc2ba59.jpg'),
  })
  return created.id as number
}

/** Menghapus dokumen media fixture (hard delete via Local API). */
export async function cleanupMedia(mediaId: number): Promise<void> {
  const payload = await payloadClient()
  await payload.delete({ collection: 'media', id: mediaId, overrideAccess: true })
}

/** Hapus kategori uji berdasarkan slug. */
export async function deleteCategoryBySlug(slug: string): Promise<void> {
  const payload = await payloadClient()
  const found = await payload.find({
    collection: 'categories',
    depth: 0,
    overrideAccess: true,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  for (const doc of found.docs) {
    await payload.delete({ collection: 'categories', id: doc.id, overrideAccess: true })
  }
}

/** Hapus semua project uji berdasarkan awalan slug. */
export async function deleteProjectsBySlugPrefix(prefix: string): Promise<void> {
  const payload = await payloadClient()
  const found = await payload.find({
    collection: 'projects',
    depth: 0,
    overrideAccess: true,
    pagination: false,
    trash: true,
    where: { slug: { like: `${prefix}%` } },
  })
  for (const doc of found.docs) {
    await payload.delete({ collection: 'projects', id: doc.id, overrideAccess: true, trash: true })
  }
}

/** Hapus fixture kalkulator uji: item kalkulator dan grup berdasarkan awalan. */
export async function deleteCalculatorFixture(prefix: string): Promise<void> {
  const payload = await payloadClient()
  const items = await payload.find({
    collection: 'calculator-items',
    depth: 0,
    overrideAccess: true,
    pagination: false,
    where: { label: { like: `${prefix}%` } },
  })
  for (const doc of items.docs) {
    await payload.delete({ collection: 'calculator-items', id: doc.id, overrideAccess: true })
  }
  const groups = await payload.find({
    collection: 'calculator-groups',
    depth: 0,
    overrideAccess: true,
    pagination: false,
    where: { title: { like: `${prefix}%` } },
  })
  for (const doc of groups.docs) {
    await payload.delete({ collection: 'calculator-groups', id: doc.id, overrideAccess: true })
  }
}
