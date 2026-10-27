import type { PageBlockDto } from '@/lib/content/types'

type ServicesBlock = Extract<PageBlockDto, { type: 'servicesGrid' }>

const ICON_MAP: Record<string, string> = {
  database: 'database',
  smartphone: 'smartphone',
  globe: 'language',
  mail: 'mail',
}

/** Blok layanan bento (F3-02) dari koleksi `services` aktif. */
export function ServicesGrid({ block }: { block: ServicesBlock }) {
  if (!block.services.length) return null

  return (
    <section
      className="services-section section section--subtle"
      id="layanan"
      aria-labelledby="services-title"
    >
      <div className="wrap">
        <div className="section-heading section-heading--split">
          <div>
            <span className="section-kicker">Yang kami kerjakan</span>
            <h2 id="services-title">{block.title ?? 'Layanan kami'}</h2>
          </div>
          {block.description ? <p>{block.description}</p> : null}
        </div>
        <div className="service-grid">
          {block.services.map((service, index) => (
            <article className={`service-card service-card--${service.size}`} key={service.title}>
              <div className="service-card__top">
                <span className="service-card__icon material-symbols-outlined" aria-hidden="true">
                  {ICON_MAP[service.icon] ?? 'apps'}
                </span>
                <span className="service-card__index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {service.highlights.length ? (
                <ul>
                  {service.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
