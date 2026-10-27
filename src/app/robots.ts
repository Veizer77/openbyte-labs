import type { MetadataRoute } from 'next'

/**
 * `robots.txt` bukan pengganti noindex: area admin, API, pratinjau, dan portal
 * tracking juga diberi metadata/header noindex di masing-masing route (F3-05).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/preview', '/tracking'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
