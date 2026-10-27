import type { PageBlockDto } from '@/lib/content/types'
import { CtaButton } from '@/components/public/cta-button'

type CtaBlock = Extract<PageBlockDto, { type: 'ctaBanner' }>

/** Banner CTA (F3-02). Target tautan divalidasi saat pemetaan DTO. */
export function CtaBanner({ block }: { block: CtaBlock }) {
  return (
    <section className="closing-cta wrap" aria-labelledby="closing-title">
      <div>
        <span className="section-kicker">Mulai dari percakapan</span>
        <h2 id="closing-title">{block.headline}</h2>
        {block.body ? <p>{block.body}</p> : null}
      </div>
      {block.cta ? <CtaButton link={block.cta} variant="lime" icon="arrow_forward" /> : null}
    </section>
  )
}
