import { PageBlocks } from '@/components/blocks'
import type { PageViewData } from '@/server/content'

/**
 * Halaman legal (F3-03).
 *
 * Sumber otoritatif: halaman CMS (`pages` slug `kebijakan-privasi`). Selama
 * halaman belum published atau masih memuat penanda `[ISI]`, yang dirender
 * adalah pemberitahuan draf — bukan isi yang belum disetujui pemilik.
 */
export function LegalView({
  data,
  isPublished,
  title,
  subtitle,
}: {
  data: PageViewData | null
  isPublished: boolean
  title: string
  subtitle: string
}) {
  if (!isPublished || !data) {
    return (
      <>
        <section className="page-hero page-hero--compact wrap" aria-labelledby="legal-title">
          <span className="section-kicker">Informasi</span>
          <h1 id="legal-title">{title}</h1>
          <p>{subtitle}</p>
        </section>
        <article className="legal-page wrap">
          <aside className="legal-draft" role="status">
            <span className="material-symbols-outlined" aria-hidden="true">
              info
            </span>
            <div>
              <strong>Konten masih dalam peninjauan.</strong>
              <p>
                Draf belum diterbitkan. Informasi kontak, masa simpan, dan detail operasional perlu
                dikonfirmasi pemilik sebelum halaman ini dipublikasikan.
              </p>
            </div>
          </aside>
        </article>
      </>
    )
  }

  return (
    <>
      <section className="page-hero page-hero--compact wrap" aria-labelledby="legal-title">
        <span className="section-kicker">Informasi</span>
        <h1 id="legal-title">{data.page.title}</h1>
        <p>{subtitle}</p>
      </section>
      <div className="legal-page wrap">
        <PageBlocks blocks={data.page.blocks} settings={data.settings} />
      </div>
    </>
  )
}
