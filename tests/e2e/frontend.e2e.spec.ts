import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/OpenByte Labs/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Bangun sistem, aplikasi, dan website yang benar-benar dipakai.',
      }),
    ).toBeVisible()
  })

  test('can filter the public project gallery', async ({ page }) => {
    await page.goto('http://localhost:3000/proyek')
    await page.getByRole('button', { name: 'Aplikasi Mobile (Flutter)' }).click()

    await expect(page.getByRole('heading', { name: 'HIPPAM Web & Mobile' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'SINDUKSADATI' })).toHaveCount(0)
  })

  test('tracking stays unavailable in release 1', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/tracking')

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole('heading', { name: 'Sepertinya halaman ini berpindah.' }),
    ).toBeVisible()
  })

  test('package cards lead to the selected package preview', async ({ page }) => {
    await page.goto('http://localhost:3000/paket')
    await page.getByRole('link', { name: 'Pilih paket' }).first().click()

    await expect(page).toHaveURL(/\/pesan\?paket=starter-umkm-bisnis/)
    await expect(page.getByRole('heading', { name: 'Starter UMKM & Bisnis' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pemesanan belum tersedia' })).toBeDisabled()
  })

  test('calculator selections work without presenting a price', async ({ page }) => {
    await page.goto('http://localhost:3000/kalkulator')
    await page.getByLabel(/Mobile Android Saja/).check()

    await expect(page.getByLabel(/Mobile Android Saja/)).toBeChecked()
    // Panel estimasi memuat dua label 'Belum tersedia' (rentang dan durasi);
    // asersi di-scope ke panel agar tidak ambiguity strict-mode.
    const estimatePanel = page.locator('.estimate-panel')
    await expect(estimatePanel.getByText('Belum tersedia').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Kirim Rincian Estimasi/ })).toBeDisabled()
  })

  test('consultation preview does not show fabricated availability', async ({ page }) => {
    await page.goto('http://localhost:3000/konsultasi')

    await expect(page.getByRole('heading', { name: 'Jadwal belum tersedia.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Jadwal konsultasi belum aktif' })).toBeDisabled()
  })
})
