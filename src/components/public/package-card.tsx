import Link from 'next/link'
import type { ServicePackage } from '@/lib/public-content'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function PackageCard({ servicePackage }: { servicePackage: ServicePackage }) {
  return (
    <article className="package-card">
      <div className="package-card__top">
        <div>
          <span className="section-kicker">{servicePackage.category}</span>
          <h2>{servicePackage.name}</h2>
        </div>
      </div>
      <p className="package-card__description">{servicePackage.description}</p>
      <div className="package-price">
        <strong>{rupiah.format(servicePackage.price)}</strong>
        <span>per proyek</span>
      </div>
      <div className="package-stats">
        <div>
          <span className="material-symbols-outlined" aria-hidden="true">
            calendar_month
          </span>
          <span>{servicePackage.durationDays} hari kerja</span>
        </div>
        <div>
          <span className="material-symbols-outlined" aria-hidden="true">
            edit_note
          </span>
          <span>{servicePackage.revisions}x revisi</span>
        </div>
      </div>
      <div className="package-card__features">
        <span className="package-card__label">Yang termasuk</span>
        <ul>
          {servicePackage.features.map((feature) => (
            <li key={feature}>
              <span className="material-symbols-outlined" aria-hidden="true">
                check
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <p className="package-card__fineprint">
        Revisi tambahan {rupiah.format(servicePackage.extraRevisionPrice)} per revisi.
      </p>
      <Link
        className="button button--light package-card__cta"
        href={`/pesan?paket=${servicePackage.slug}`}
      >
        Pilih paket{' '}
        <span className="material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </Link>
    </article>
  )
}
