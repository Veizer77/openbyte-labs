/**
 * Cache konten publik (F3-04).
 *
 * Setiap pembacaan dibungkus `unstable_cache` dengan:
 * - tag per entitas + tag `content` sebagai jaring pengaman relasi
 *   (media, kategori, teknologi) yang memengaruhi banyak halaman;
 * - `revalidate: 60` sehingga publikasi berbasis waktu (`publishedAt` di masa
 *   depan, `discountEndsAt`) mulai berlaku tanpa scheduler dan tanpa edit admin.
 *
 * Mode pratinjau tidak pernah menulis ke cache: bila `preview` aktif, fungsi
 * asli dipanggil langsung.
 */

import { unstable_cache } from 'next/cache'

/** Batas kesegaran PRD: perubahan CMS tampil di publik maksimal 60 detik. */
export const CONTENT_REVALIDATE_SECONDS = 60

export const CONTENT_TAGS = {
  content: 'content',
  settings: 'settings',
  pages: 'pages',
  projects: 'projects',
  packages: 'packages',
  services: 'services',
  faqs: 'faqs',
  testimonials: 'testimonials',
  categories: 'categories',
  calculator: 'calculator',
} as const

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS]

type PreviewAware = { preview?: boolean }

function isPreviewRequest(args: readonly unknown[]): boolean {
  return args.some(
    (arg) => Boolean(arg && typeof arg === 'object' && (arg as PreviewAware).preview === true),
  )
}

export function cacheContent<Args extends unknown[], Result>(
  key: string,
  tags: readonly ContentTag[],
  fn: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  const cached = unstable_cache(fn, [key], {
    tags: Array.from(new Set<string>([CONTENT_TAGS.content, ...tags])),
    revalidate: CONTENT_REVALIDATE_SECONDS,
  })

  return async (...args: Args): Promise<Result> => {
    if (isPreviewRequest(args)) return fn(...args)
    return cached(...args)
  }
}
