import { expect, Page, test } from '@playwright/test'

import { totpCode } from '../helpers/totp-code'
import {
  cleanupTestMedia,
  cleanupTestUserByEmail,
  editorCredentials,
  editorLockedCredentials,
  resetEditorTotp,
  seedTestEditor,
  seedTestMedia,
} from '../helpers/totp-editor'
import { testTotpSecret } from '../helpers/seedUser'

const serverURL = 'http://localhost:3000'

/**
 * PATCH dokumen media lewat fetch di dalam halaman (bukan APIRequestContext
 * Playwright) supaya Origin dan cookie dikirim seperti panggilan admin UI
 * sungguhan — termasuk pemeriksaan CSRF Payload.
 */
async function patchMedia(page: Page, mediaId: number, alt: string): Promise<number> {
  return page.evaluate(async ({ alt: value, id }: { alt: string; id: number }) => {
    const res = await fetch(`/api/media/${id}`, {
      body: JSON.stringify({ alt: value }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    return res.status
  }, { alt, id: mediaId })
}

test.describe('TOTP D-05: editor', () => {
  let page: Page
  let editorId: number
  let mediaId: number

  test.beforeAll(async ({ browser }) => {
    editorId = await seedTestEditor(editorCredentials.email)
    mediaId = await seedTestMedia()

    const context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterAll(async () => {
    if (typeof mediaId === 'number') await cleanupTestMedia(mediaId).catch(() => undefined)
    await cleanupTestUserByEmail(editorCredentials.email).catch(() => undefined)
  })

  test('editor baru dipaksa ke halaman setup TOTP', async () => {
    await page.goto(`${serverURL}/admin/login`)
    await page.fill('#field-email', editorCredentials.email)
    await page.fill('#field-password', editorCredentials.password)
    await page.click('button[type="submit"]')

    // forceSetup (D-05): sesi tanpa TOTP ditahan di halaman setup, bukan dasbor.
    await page.waitForURL(/\/admin\/setup-totp/)
    // Timpaan terjemahan id untuk namespace totpPlugin (12.3 butir 8).
    await expect(page.locator('h1')).toHaveText('Pengaturan Autentikasi Dua Faktor')
    await expect(page.locator('input[name="token"]')).toBeVisible()
  })

  test('sesi password tanpa 2FA ditolak mengubah media', async () => {
    // Koleksi media membypass wrapper TOTP (contentTotpWrapperBypass), sehingga
    // penolakan HARUS datang dari fungsi akses isAdmin (D-05), bukan wrapper.
    expect(await patchMedia(page, mediaId, 'diubah-tanpa-2fa')).toBe(403)
  })

  test('kode TOTP pertama menyelesaikan enrollment', async () => {
    // Secret acak per render halaman tersedia di input hidden form.
    const secret = await page.locator('input[name="secret"]').inputValue()
    expect(secret.length).toBeGreaterThanOrEqual(16)

    const setupResponse = page.waitForResponse(
      (res) => res.url().includes('/api/setup-totp') && res.request().method() === 'POST',
    )
    await page.locator('input[name="token"]').fill(totpCode(secret))
    const res = await setupResponse
    expect(((await res.json()) as { ok?: boolean }).ok).toBe(true)

    // Setelah setup, auth strategy dijalankan ulang dan kembali ke /admin.
    await page.waitForURL(`${serverURL}/admin`)
    await expect(page.locator('span[title="Dasbor"]').first()).toBeVisible()
  })

  test('sesi terverifikasi TOTP boleh mengubah media', async () => {
    expect(await patchMedia(page, mediaId, 'diubah-sesudah-2fa')).toBe(200)
  })

  test('Keluar mengakhiri sesi admin', async () => {
    await page.goto(`${serverURL}/admin`)
    await page.locator('a.nav__log-out').click()
    await page.waitForURL(/\/admin\/login/)

    // Sesi sudah hilang: membuka admin kembali diarahkan ke login.
    await page.goto(`${serverURL}/admin`)
    await page.waitForURL(/\/admin\/login/)
  })

  test('reset 2FA memulihkan tanpa email: forced setup lagi', async () => {
    await resetEditorTotp(editorId)

    await page.goto(`${serverURL}/admin/login`)
    await page.fill('#field-email', editorCredentials.email)
    await page.fill('#field-password', editorCredentials.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/setup-totp/)
    await expect(page.locator('input[name="token"]')).toBeVisible()
  })
})

test.describe('TOTP: lockout kode salah', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    // User terpisah agar lockout (15 menit) tidak meracuni tes lain.
    await seedTestEditor(editorLockedCredentials.email, testTotpSecret)

    const context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterAll(async () => {
    await cleanupTestUserByEmail(editorLockedCredentials.email).catch(() => undefined)
  })

  test('lima kode salah mengunci akun', async () => {
    await page.goto(`${serverURL}/admin/login`)
    await page.fill('#field-email', editorLockedCredentials.email)
    await page.fill('#field-password', editorLockedCredentials.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin\/verify-totp/)

    for (let i = 1; i <= 5; i += 1) {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/verify-totp') && res.request().method() === 'POST',
      )
      // Kode dari waktu lain di luar jendela verifikasi (window 1) pasti salah.
      await page
        .locator('input[name="token"]')
        .fill(totpCode(testTotpSecret, { atMs: Date.now() - i * 61_000 }))
      const res = await responsePromise
      expect(((await res.json()) as { ok?: boolean }).ok).toBe(false)
    }

    // Lockout disalin ke user: password login pun ditolak dengan pesan terkunci.
    await page.goto(`${serverURL}/admin/login`)
    await page.fill('#field-email', editorLockedCredentials.email)
    await page.fill('#field-password', editorLockedCredentials.password)
    await page.click('button[type="submit"]')
    await expect(
      page.getByText('Pengguna ini terkunci karena terlalu banyak upaya masuk yang gagal.'),
    ).toBeVisible()
  })
})
