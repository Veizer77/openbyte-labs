import type { PageBlockDto } from '@/lib/content/types'
import { ContentImage, MediaPlaceholder } from '@/components/public/media-image'

type TestimonialsBlock = Extract<PageBlockDto, { type: 'testimonials' }>

/**
 * Blok testimoni (F3-02). Hanya testimoni `isActive` dari CMS yang tampil.
 * Bila belum ada, blok tidak dirender sama sekali — tidak ada testimoni rekaan
 * (PRD 9.1).
 */
export function Testimonials({ block }: { block: TestimonialsBlock }) {
  if (!block.items.length) return null

  return (
    <section className="section testimonials-section" aria-labelledby="testimonials-title">
      <div className="wrap">
        <div className="section-heading">
          <span className="section-kicker">Kata klien</span>
          <h2 id="testimonials-title">{block.title ?? 'Testimoni'}</h2>
        </div>
        <div className="testimonial-grid">
          {block.items.map((item) => (
            <figure className="testimonial-card" key={`${item.authorName}-${item.quote.slice(0, 24)}`}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="testimonial-card__photo">
                  {item.photo ? (
                    <ContentImage
                      image={item.photo}
                      variant="thumb"
                      sizes="56px"
                    />
                  ) : (
                    <MediaPlaceholder label={`Foto ${item.authorName} belum tersedia`} />
                  )}
                </span>
                <span>
                  <strong>{item.authorName}</strong>
                  {item.authorRole ? <span>{item.authorRole}</span> : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
