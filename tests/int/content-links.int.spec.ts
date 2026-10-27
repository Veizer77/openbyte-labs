import { describe, expect, it } from 'vitest'
import {
  isBlockedPublicPath,
  isSafeHref,
  isSafePreviewPath,
  isTrackingPath,
  sanitizeMenuItems,
  toLinkDto,
} from '../../src/lib/content/links'

describe('validasi tautan CMS', () => {
  it('menerima protokol dan path internal yang diizinkan', () => {
    for (const href of [
      'https://example.com/proyek',
      'http://example.com',
      'mailto:halo@example.com',
      'tel:+628123456789',
      '/proyek',
      '/#layanan',
      '#kontak',
    ]) {
      expect(isSafeHref(href), href).toBe(true)
    }
  })

  it('menolak skema berbahaya, path protokol-relatif, dan karakter kontrol', () => {
    for (const href of [
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      'data:text/html;base64,PHNjcmlwdD4=',
      'vbscript:msgbox(1)',
      '//evil.example.com',
      '/\\evil.example.com',
      'java\nscript:alert(1)',
      '',
      '   ',
    ]) {
      expect(isSafeHref(href), JSON.stringify(href)).toBe(false)
    }
  })

  it('menolak nilai non-string', () => {
    expect(isSafeHref(null)).toBe(false)
    expect(isSafeHref(42)).toBe(false)
    expect(isSafeHref({ href: '/proyek' })).toBe(false)
  })

  it('menolak target area admin, API, pratinjau, dan tracking', () => {
    expect(isBlockedPublicPath('/admin')).toBe(true)
    expect(isBlockedPublicPath('/admin/collections/pages')).toBe(true)
    expect(isBlockedPublicPath('/api/media/file/x.jpg')).toBe(true)
    expect(isBlockedPublicPath('/preview')).toBe(true)
    expect(isBlockedPublicPath('/tracking/proyek')).toBe(true)
    expect(isBlockedPublicPath('/proyek')).toBe(false)
    expect(isTrackingPath('/tracking')).toBe(true)
    expect(isTrackingPath('/tracking?x=1')).toBe(true)
    expect(isTrackingPath('/proyek')).toBe(false)
  })

  it('toLinkDto membuang tautan tracking walau pemilik mengetiknya di CMS', () => {
    expect(toLinkDto('Lacak proyek', '/tracking/proyek')).toBeNull()
    expect(toLinkDto('Admin', '/admin')).toBeNull()
    expect(toLinkDto('', '/proyek')).toBeNull()
    expect(toLinkDto('Portofolio', '/proyek')).toEqual({
      label: 'Portofolio',
      href: '/proyek',
      external: false,
    })
    expect(toLinkDto('Situs luar', 'https://example.com')).toEqual({
      label: 'Situs luar',
      href: 'https://example.com',
      external: true,
    })
  })

  it('isSafePreviewPath hanya menerima path internal publik', () => {
    expect(isSafePreviewPath('/proyek/sipandu')).toBe(true)
    expect(isSafePreviewPath('/')).toBe(true)
    expect(isSafePreviewPath('/preview/proyek')).toBe(false)
    expect(isSafePreviewPath('/admin')).toBe(false)
    expect(isSafePreviewPath('https://evil.example.com')).toBe(false)
    expect(isSafePreviewPath('//evil.example.com')).toBe(false)
  })
})

describe('menu navigasi CMS', () => {
  const allowed = new Set(['/', '/proyek', '/paket', '/konsultasi'])

  it('mengikuti urutan CMS, melewati item nonaktif dan target yang tidak ada', () => {
    const menu = sanitizeMenuItems(
      [
        { label: 'Beranda', target: '/', isActive: true },
        { label: 'Portofolio', target: '/proyek', isActive: true },
        { label: 'Tersembunyi', target: '/paket', isActive: false },
        { label: 'Halaman hilang', target: '/tentang', isActive: true },
        { label: 'Tracking', target: '/tracking', isActive: true },
        { label: 'Beranda lagi', target: '/', isActive: true },
      ],
      allowed,
    )

    expect(menu.map((item) => item.href)).toEqual(['/', '/proyek'])
  })

  it('mengembalikan daftar kosong untuk data tidak valid', () => {
    expect(sanitizeMenuItems(null, allowed)).toEqual([])
    expect(sanitizeMenuItems([{ label: 1, target: 2 }], allowed)).toEqual([])
  })
})
