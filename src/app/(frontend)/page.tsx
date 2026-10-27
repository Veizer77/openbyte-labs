import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HomeView } from '@/components/pages/home-view'
import { getHomePageData } from '@/server/content'

/** Batas kesegaran PRD 60 detik (F3-04). */
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData()
  if (!data) return { title: 'Beranda' }

  const { page, settings } = data
  const title = page.meta.title ?? settings.seo.defaultTitle ?? settings.brandName
  const description = page.meta.description ?? settings.seo.defaultDescription ?? undefined
  const ogImage = page.meta.ogImage ?? settings.seo.ogImage

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/',
      ...(ogImage ? { images: [{ url: ogImage.url, alt: ogImage.alt }] } : {}),
    },
  }
}

export default async function HomePage() {
  const data = await getHomePageData()
  if (!data) notFound()

  return <HomeView data={data} />
}
