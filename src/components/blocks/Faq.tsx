import type { PageBlockDto } from '@/lib/content/types'
import { RichText } from '@/components/public/rich-text'

type FaqBlock = Extract<PageBlockDto, { type: 'faq' }>

/** Blok FAQ (F3-02) dari koleksi `faqs` aktif, urut sesuai admin. */
export function Faq({ block }: { block: FaqBlock }) {
  if (!block.items.length) return null

  return (
    <section className="section faq-section" aria-labelledby="faq-title">
      <div className="wrap faq-layout">
        <div className="faq-intro">
          <span className="section-kicker">Pertanyaan umum</span>
          <h2 id="faq-title">{block.title ?? 'Pertanyaan yang sering diajukan'}</h2>
        </div>
        <div className="faq-list">
          {block.items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                {item.question}
                <span className="material-symbols-outlined" aria-hidden="true">
                  add
                </span>
              </summary>
              <RichText value={item.answer} className="faq-answer" />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
