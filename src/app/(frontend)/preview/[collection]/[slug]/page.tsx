import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { hasAdminSession } from '@/access/roles'
import { PageBlocks } from '@/components/blocks'
import { HomeView } from '@/components/pages/home-view'
import { ProjectDetailView } from '@/components/pages/project-detail-view'
import { PreviewBanner } from '@/components/public/preview-banner'
import { getPageViewData, getPublicSettings, getPublishedProjectBySlug } from '@/server/content'
import { getContentPayload } from '@/server/content/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pratinjau',
  robots: { index: false, follow: false, nocache: true },
}

const PREVIEWABLE_COLLECTIONS = ['pages', 'projects'] as const
type PreviewableCollection = (typeof PREVIEWABLE_COLLECTIONS)[number]

type PreviewPageProps = { params: Promise<{ collection: string; slug: string }> }

function isPreviewableCollection(value: string): value is PreviewableCollection {
  return (PREVIEWABLE_COLLECTIONS as readonly string[]).includes(value)
}

/**
 * Renderer pratinjau (F2-04 + F3).
 *
 * Setiap permintaan memverifikasi ulang Draft Mode dan sesi admin yang sudah
 * lolos 2FA. Konten dirender dengan komponen yang sama seperti halaman publik,
 * tetapi seluruh pembacaan memakai `preview: true` dan tidak menyentuh cache
 * publik — pengunjung lain tetap menerima versi statis.
 */
export default async function PreviewPage({ params }: PreviewPageProps) {
  const { collection, slug } = await params
  if (!isPreviewableCollection(collection) || !slug) notFound()

  const draft = await draftMode()
  if (!draft.isEnabled) notFound()

  const payload = await getContentPayload()
  const { user } = await payload.auth({ headers: await headers() })
  if (!hasAdminSession(user)) notFound()

  const options = { preview: true }

  if (collection === 'projects') {
    const [data, settings] = await Promise.all([
      getPublishedProjectBySlug(slug, options),
      getPublicSettings(options),
    ])

    if (!data) return <PreviewMissing collection={collection} slug={slug} />

    return (
      <>
        <PreviewBanner label={`Pratinjau draft proyek: ${data.project.title}`} />
        <ProjectDetailView project={data.project} related={data.related} settings={settings} />
      </>
    )
  }

  const data = await getPageViewData(slug, options)
  if (!data) return <PreviewMissing collection={collection} slug={slug} />

  if (slug === 'home') {
    return (
      <>
        <PreviewBanner label="Pratinjau draft beranda" />
        <HomeView data={data} />
      </>
    )
  }

  return (
    <>
      <PreviewBanner label={`Pratinjau draft halaman: ${data.page.title}`} />
      <section className="page-hero page-hero--compact wrap" aria-labelledby="preview-title">
        <span className="section-kicker">Pratinjau</span>
        <h1 id="preview-title">{data.page.title}</h1>
      </section>
      <PageBlocks blocks={data.page.blocks} settings={data.settings} />
    </>
  )
}

function PreviewMissing({ collection, slug }: { collection: string; slug: string }) {
  return (
    <>
      <PreviewBanner label="Pratinjau draft" />
      <section className="page-hero page-hero--compact wrap">
        <span className="section-kicker">Pratinjau</span>
        <h1>Dokumen belum tersedia.</h1>
        <p>
          Tidak ada dokumen <code>{collection}</code> dengan slug <code>{slug}</code>. Simpan
          dokumen di admin terlebih dahulu.
        </p>
      </section>
    </>
  )
}
