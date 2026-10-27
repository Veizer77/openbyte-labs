import type { MetadataRoute } from 'next'
import { getPublishedPageSlugs, listPublishedProjects } from '@/server/content'

/**
 * Sitemap (F3-05). Hanya route yang benar-benar ada dan konten published yang
 * sudah waktunya. `/tracking*`, `/admin*`, dan dokumen draft tidak pernah masuk.
 * `revalidate` menjaga daftar tetap segar tanpa deploy ulang.
 */
export const revalidate = 60

const CORE_ROUTES = ['/', '/proyek', '/paket', '/kalkulator', '/konsultasi'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
  const [projects, pageSlugs] = await Promise.all([listPublishedProjects(), getPublishedPageSlugs()])

  const coreEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))

  const pageEntries: MetadataRoute.Sitemap = pageSlugs
    .filter((slug) => slug !== 'home')
    .map((slug) => ({
      url: new URL(`/${slug}`, siteUrl).toString(),
      changeFrequency: 'yearly',
      priority: 0.4,
    }))

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: new URL(`/proyek/${project.slug}`, siteUrl).toString(),
    lastModified: project.publishedAt ?? undefined,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...coreEntries, ...pageEntries, ...projectEntries]
}
