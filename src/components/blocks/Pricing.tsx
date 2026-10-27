import type { PageBlockDto } from '@/lib/content/types'
import { PackageCard } from '@/components/public/package-card'

type PricingBlock = Extract<PageBlockDto, { type: 'pricing' }>

/** Blok paket harga (F3-02) dari `service-packages` aktif. */
export function Pricing({ block }: { block: PricingBlock }) {
  if (!block.packages.length) return null

  return (
    <section className="package-section section--subtle" aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="section-heading section-heading--split">
          <div>
            <span className="section-kicker">Paket layanan</span>
            <h2 id="pricing-title">{block.title ?? 'Paket layanan'}</h2>
          </div>
        </div>
        <div className="package-grid">
          {block.packages.map((servicePackage) => (
            <PackageCard key={servicePackage.slug} servicePackage={servicePackage} />
          ))}
        </div>
      </div>
    </section>
  )
}
