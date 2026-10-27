import Link from 'next/link'
import { formatDurasiHari, formatRupiah, formatTanggalWib } from '@/lib/format'
import type { PackageDto } from '@/lib/content/types'

const BILLING_LABEL: Record<PackageDto['billingType'], string> = {
  one_time: 'per proyek',
  subscription_yearly: 'per tahun',
  custom: 'sesuai kesepakatan',
}

/**
 * Kartu paket dari `service-packages` aktif (F3-03). Jumlah kartu bebas dan
 * lencana "Populer" mengikuti data CMS, bukan posisi tengah grid.
 */
export function PackageCard({ servicePackage }: { servicePackage: PackageDto }) {
  const duration = formatDurasiHari(servicePackage.estimatedDays)
  const discountEnds = formatTanggalWib(servicePackage.discountEndsAt)

  return (
    <article className="package-card">
      <div className="package-card__top">
        <div>
          {servicePackage.categoryName ? (
            <span className="section-kicker">{servicePackage.categoryName}</span>
          ) : null}
          <h2>{servicePackage.name}</h2>
        </div>
        {servicePackage.isPopular ? <span className="eyebrow-chip">Populer</span> : null}
      </div>

      <div className="package-price">
        <strong>{formatRupiah(servicePackage.price)}</strong>
        {servicePackage.originalPrice ? (
          <s className="package-price__original">{formatRupiah(servicePackage.originalPrice)}</s>
        ) : null}
        <span>{BILLING_LABEL[servicePackage.billingType]}</span>
      </div>

      {servicePackage.isDiscounted && discountEnds ? (
        <p className="package-card__fineprint">Harga khusus berlaku sampai {discountEnds}.</p>
      ) : null}

      {duration || servicePackage.includedRevisions > 0 ? (
        <div className="package-stats">
          {duration ? (
            <div>
              <span className="material-symbols-outlined" aria-hidden="true">
                calendar_month
              </span>
              <span>{duration}</span>
            </div>
          ) : null}
          {servicePackage.includedRevisions > 0 ? (
            <div>
              <span className="material-symbols-outlined" aria-hidden="true">
                edit_note
              </span>
              <span>{servicePackage.includedRevisions}x revisi</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {servicePackage.features.length ? (
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
      ) : null}

      {servicePackage.extraRevisionPrice ? (
        <p className="package-card__fineprint">
          Revisi tambahan {formatRupiah(servicePackage.extraRevisionPrice)} per revisi.
        </p>
      ) : null}

      <Link
        className="button button--light package-card__cta"
        href={`/pesan?paket=${encodeURIComponent(servicePackage.slug)}`}
      >
        {servicePackage.ctaLabel ?? 'Pilih paket'}{' '}
        <span className="material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </Link>
    </article>
  )
}
