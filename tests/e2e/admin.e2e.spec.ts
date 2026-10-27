import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser, testTotpSecret } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser, totpSecret: testTotpSecret })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dasbor"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page).toHaveURL('http://localhost:3000/admin/collections/users')
    // Label koleksi di admin berbahasa Indonesia (Users.ts: 'Pengguna').
    const listViewArtifact = page.locator('h1', { hasText: 'Pengguna' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    // Pada Payload 3.92, view create tetap berada di URL /create sampai
    // dokumen disimpan (tidak dialihkan ke URL id).
    await page.goto('http://localhost:3000/admin/collections/users/create')
    await expect(page).toHaveURL(/\/admin\/collections\/users\/create/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })
})
