/**
 * Validasi tautan untuk konten CMS (F3-02, F3-03, F3-05).
 *
 * Semua tautan yang berasal dari CMS (menu, CTA blok, tautan proyek, tautan di
 * rich text, media sosial) melewati modul ini. Hanya `https`, `http`, `mailto`,
 * `tel`, dan path internal yang diizinkan; `javascript:`, `data:`, `vbscript:`,
 * path protokol-relatif (`//host`), serta backslash ditolak.
 *
 * Rilis 1 tidak boleh menautkan `/tracking*` (PRD 9.4) maupun area admin/API,
 * sehingga target tersebut selalu dibuang walau pemilik mengetiknya di CMS.
 */

import type { LinkDto, SiteMenuItem } from './types'

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

/** Area yang tidak boleh ditautkan dari navigasi atau konten publik. */
const BLOCKED_PATH_PREFIXES = ['/admin', '/api', '/preview', '/_next', '/tracking']

function stripQueryAndHash(value: string): string {
  const hashIndex = value.indexOf('#')
  const withoutHash = hashIndex === -1 ? value : value.slice(0, hashIndex)
  const queryIndex = withoutHash.indexOf('?')
  return queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex)
}

function hasControlCharacters(value: string): boolean {
  return /[\u0000-\u001F\u007F]/.test(value)
}

/** Path internal yang dilarang untuk tautan publik (tracking, admin, API). */
export function isBlockedPublicPath(value: string): boolean {
  const pathname = stripQueryAndHash(value).toLowerCase()
  if (!pathname.startsWith('/')) return false
  return BLOCKED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/** `/tracking` dan seluruh turunannya harus 404 selama portal belum aktif. */
export function isTrackingPath(value: string): boolean {
  const pathname = stripQueryAndHash(value).toLowerCase()
  return pathname === '/tracking' || pathname.startsWith('/tracking/')
}

/**
 * Href aman: path internal, anchor, atau URL dengan protokol yang diizinkan.
 * Nilai `javascript:`/`data:`/protokol-relatif ditolak.
 */
export function isSafeHref(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const href = value.trim()
  if (!href) return false
  if (hasControlCharacters(href)) return false
  if (href.includes('\\')) return false

  if (href.startsWith('#')) return /^#[A-Za-z0-9_-]+$/.test(href)
  if (href.startsWith('/')) return !href.startsWith('//')

  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }

  return SAFE_PROTOCOLS.has(url.protocol)
}

export function isExternalHref(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

/**
 * Membentuk DTO tautan. Mengembalikan null bila label kosong atau target tidak
 * aman/dilarang, supaya komponen tidak pernah merender tautan rusak.
 */
export function toLinkDto(label: unknown, target: unknown): LinkDto | null {
  if (typeof label !== 'string' || !label.trim()) return null
  if (!isSafeHref(target)) return null

  const href = target.trim()
  if (!isExternalHref(href) && isBlockedPublicPath(href)) return null

  return { label: label.trim(), href, external: isExternalHref(href) }
}

/**
 * Tujuan pratinjau harus path internal publik: bukan URL eksternal, bukan
 * area admin/API/pratinjau itu sendiri (mencegah loop dan eskalasi).
 */
export function isSafePreviewPath(value: unknown): value is string {
  if (!isSafeHref(value)) return false
  if (!value.startsWith('/') || value.startsWith('//')) return false
  return !isBlockedPublicPath(value)
}

/**
 * Menyaring menu CMS: hanya target yang aman dan benar-benar ada yang dipakai.
 * `allowedPaths` diisi route statis yang tersedia ditambah slug halaman yang
 * sudah published, sehingga menu tidak pernah menautkan halaman tidak ada.
 */
export function sanitizeMenuItems(
  items: unknown,
  allowedPaths: ReadonlySet<string>,
  limit = 12,
): SiteMenuItem[] {
  if (!Array.isArray(items)) return []

  const seen = new Set<string>()
  const result: SiteMenuItem[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const record = item as { label?: unknown; target?: unknown; isActive?: unknown }
    if (record.isActive === false) continue

    const link = toLinkDto(record.label, record.target)
    if (!link || link.external) continue

    const pathname = stripQueryAndHash(link.href) || '/'
    if (!allowedPaths.has(pathname)) continue
    if (seen.has(link.href)) continue

    seen.add(link.href)
    result.push(link)
    if (result.length >= limit) break
  }

  return result
}

/** Normalisasi teks untuk perbandingan sederhana (dipakai pemetaan blok). */
export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

/**
 * Navigasi struktural bawaan, dipakai hanya bila CMS belum memiliki satu pun
 * menu aktif. Labelnya nama route yang memang ada (bukan klaim/testimoni) agar
 * situs tetap dapat dijelajahi saat Settings baru dibuat. Begitu pemilik
 * mengisi menu di admin, menu CMS sepenuhnya menggantikan daftar ini.
 */
export const FALLBACK_MENU: readonly SiteMenuItem[] = [
  { label: 'Beranda', href: '/', external: false },
  { label: 'Layanan', href: '/#layanan', external: false },
  { label: 'Portofolio', href: '/proyek', external: false },
  { label: 'Paket', href: '/paket', external: false },
  { label: 'Kalkulator', href: '/kalkulator', external: false },
  { label: 'Konsultasi', href: '/konsultasi', external: false },
]
