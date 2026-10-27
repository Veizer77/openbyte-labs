import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Informasi mengenai kebijakan privasi OpenByte Labs.',
  alternates: { canonical: '/kebijakan-privasi' },
  robots: { index: false, follow: false },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero page-hero--compact wrap" aria-labelledby="privacy-title">
        <span className="section-kicker">Informasi</span>
        <h1 id="privacy-title">Kebijakan Privasi</h1>
        <p>Bagaimana informasi yang Anda berikan akan dikelola.</p>
      </section>
      <article className="legal-page wrap">
        <aside className="legal-draft" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">
            info
          </span>
          <div>
            <strong>Konten masih dalam peninjauan.</strong>
            <p>
              Draf kebijakan belum diterbitkan. Informasi kontak, masa simpan, dan detail
              operasional perlu dikonfirmasi sebelum halaman ini dipublikasikan.
            </p>
          </div>
        </aside>
        <div className="legal-document" aria-hidden="true">
          <div className="legal-document__line legal-document__line--short" />
          <div className="legal-document__line" />
          <div className="legal-document__line" />
          <div className="legal-document__line legal-document__line--medium" />
          <div className="legal-document__gap" />
          <div className="legal-document__line legal-document__line--short" />
          <div className="legal-document__line" />
          <div className="legal-document__line legal-document__line--medium" />
        </div>
      </article>
    </>
  )
}
