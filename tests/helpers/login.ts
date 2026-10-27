import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { totpCode } from './totp-code'

export interface LoginOptions {
  page: Page
  serverURL?: string
  user: {
    email: string
    password: string
  }
  /**
   * Secret TOTP fixture (base32) milik user. User yang terdaftar TOTP
   * diarahkan admin ke halaman verifikasi setelah login password; helper
   * mengisi kode hasil RFC 6238 dan form mengirimnya sendiri ke
   * /api/verify-totp. TOTP tidak dinonaktifkan agar tes lulus.
   */
  totpSecret?: string
}

/**
 * Logs the user into the admin panel via the login page, including the
 * real TOTP verification step when the user is enrolled.
 */
export async function login({
  page,
  serverURL = 'http://localhost:3000',
  user,
  totpSecret,
}: LoginOptions): Promise<void> {
  await page.goto(`${serverURL}/admin/login`)

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  if (totpSecret) {
    await page.waitForURL(/\/admin\/verify-totp/)
    // Input tersembunyi `name="token"` membawa kode ke /api/verify-totp;
    // mengisinya menyebarkan digit ke kotak OTP dan mengirim form otomatis.
    await page.locator('input[name="token"]').fill(totpCode(totpSecret))
  }

  await page.waitForURL(`${serverURL}/admin`)

  const dashboardArtifact = page.locator('span[title="Dasbor"]')
  await expect(dashboardArtifact).toBeVisible()
}
