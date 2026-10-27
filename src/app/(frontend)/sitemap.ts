import type { MetadataRoute } from 'next'
import { publicProjects } from '@/lib/public-content'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const coreRoutes = ['/', '/proyek', '/paket', '/kalkulator', '/konsultasi']

  return [
    ...coreRoutes.map((route) => ({
      url: new URL(route, siteUrl).toString(),
      changeFrequency: 'monthly' as const,
      priority: route === '/' ? 1 : 0.7,
    })),
    ...publicProjects.map((project) => ({
      url: new URL(`/proyek/${project.slug}`, siteUrl).toString(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
