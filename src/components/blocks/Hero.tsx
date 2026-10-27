import type { SiteSettingsDto } from '@/lib/content/types'
import type { PageBlockDto } from '@/lib/content/types'
import { CtaButton } from '@/components/public/cta-button'
import { ContentImage } from '@/components/public/media-image'

type HeroBlock = Extract<PageBlockDto, { type: 'hero' }>

/**
 * Blok Hero (F3-02).
 *
 * Field otoritatif: blok `hero` pada `pages.layout`. `site-settings.hero`
 * hanya menjadi cadangan ketika field blok kosong (mis. trust metrics belum
 * diisi), sehingga pemilik tidak perlu menyunting dua tempat sekaligus.
 */
export function Hero({ block, settings }: { block: HeroBlock; settings: SiteSettingsDto }) {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero__copy">
        <div className="status-pill">
          <span aria-hidden="true" /> {settings.brandName} • Digital Systems
        </div>
        <h1 id="hero-title">{block.headline}</h1>
        {block.subheadline ? <p>{block.subheadline}</p> : null}

        {block.primaryCta || block.secondaryCta ? (
          <div className="hero__actions">
            {block.primaryCta ? (
              <CtaButton link={block.primaryCta} variant="dark" icon="arrow_forward" />
            ) : null}
            {block.secondaryCta ? (
              <CtaButton link={block.secondaryCta} variant="light" icon="north_east" />
            ) : null}
          </div>
        ) : null}

        {block.trustMetrics.length ? (
          <div className="hero__facts" aria-label="Ringkasan">
            {block.trustMetrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {block.image ? (
        <div className="hero-visual">
          <div className="hero-visual__topline">
            <span>
              <span className="material-symbols-outlined" aria-hidden="true">
                data_object
              </span>{' '}
              {settings.brandName}
            </span>
          </div>
          <div className="hero-visual__image">
            <ContentImage
              image={block.image}
              variant="hero"
              sizes="(max-width: 900px) 100vw, 48vw"
              priority
            />
            <span className="hero-visual__image-label">{block.headline}</span>
          </div>
        </div>
      ) : null}
    </section>
  )
}
