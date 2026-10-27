import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { assertTestDatabaseTargetIsDisposable } from './db-target'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'TestOwner123456!',
}

/**
 * Secret TOTP fixture (base32, hanya A-Z2-7) khusus tes. Tidak pernah
 * dipakai di lingkungan nyata: helper ini hanya berjalan pada database
 * disposable (lihat guard di atas).
 */
export const testTotpSecret = 'OBLETESTSECRETABCD234567'

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  await assertTestDatabaseTargetIsDisposable()
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    overrideAccess: true,
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  const created = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: { ...testUser, name: 'Test User', roles: ['owner'] },
  })

  // Daftarkan TOTP dengan secret fixture: penulisan `totpSecret` lewat
  // Local API dengan overrideAccess, alur yang sama seperti endpoint
  // setup-totp plugin. Setelah ini user terhitung enrolled (hasTotp
  // turunan virtual dari totpSecret) dan verifikasi login E2E memakai
  // TOTP nyata, bukan TOTP yang dinonaktifkan.
  await payload.update({
    collection: 'users',
    id: created.id,
    data: { totpSecret: testTotpSecret },
    overrideAccess: true,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    overrideAccess: true,
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
