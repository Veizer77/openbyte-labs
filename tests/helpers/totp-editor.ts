import path from 'path'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { assertTestDatabaseTargetIsDisposable } from './db-target'

/**
 * Kredensial editor khusus E2E D-05. Terpisah dari user owner fixture
 * (seedUser) agar uji editor tidak mengubah perilaku owner.
 */
export const editorCredentials = { email: 'editor-totp@payloadcms.com', password: 'TestEditor123456!' }
export const editorLockedCredentials = { email: 'editor-totp-locked@payloadcms.com', password: 'TestEditor123456!' }

/**
 * Membuat user editor baru untuk E2E D-05. Tanpa TOTP kecuali `totpSecret`
 * diberikan (untuk alur verify). Hanya berjalan pada database disposable;
 * guard menolak database dev Neon.
 */
export async function seedTestEditor(email: string, totpSecret?: string): Promise<number> {
  await assertTestDatabaseTargetIsDisposable()
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    overrideAccess: true,
    where: { email: { equals: email } },
  })

  const created = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: { email, password: 'TestEditor123456!', name: 'Editor TOTP', roles: ['editor'] },
  })

  if (totpSecret) {
    // Penulisan secret lewat Local API overrideAccess, alur yang sama dengan
    // endpoint setup-totp plugin (lihat seedUser.ts).
    await payload.update({
      collection: 'users',
      id: created.id,
      data: { totpSecret },
      overrideAccess: true,
    })
  }

  return created.id
}

export async function cleanupTestUserByEmail(email: string): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'users',
    overrideAccess: true,
    where: { email: { equals: email } },
  })
}

/**
 * Reset 2FA oleh owner (Local API overrideAccess): menghapus secret agar user
 * kembali memakai alur forced setup tanpa email (F0-04 butir 1).
 */
export async function resetEditorTotp(userId: number): Promise<void> {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'users',
    id: userId,
    data: { totpSecret: '' },
    overrideAccess: true,
  })
}

/** Dokumen media (jpeg dari repositori) sebagai sasaran PATCH uji D-05. */
export async function seedTestMedia(): Promise<number> {
  await assertTestDatabaseTargetIsDisposable()
  const payload = await getPayload({ config })
  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt: 'Media E2E TOTP D-05' },
    filePath: path.resolve('public/images/a0f92bdabdc2ba59.jpg'),
  })
  return created.id
}

export async function cleanupTestMedia(mediaId: number): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'media', id: mediaId, overrideAccess: true })
}
