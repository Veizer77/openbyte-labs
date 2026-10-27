import type { PageBlockDto } from '@/lib/content/types'
import { RichText } from '@/components/public/rich-text'

type AboutBlock = Extract<PageBlockDto, { type: 'about' }>

/** Blok tentang (F3-02). Body dirender sebagai node React, bukan HTML mentah. */
export function About({ block }: { block: AboutBlock }) {
  if (!block.title && !block.body) return null

  return (
    <section className="section about-block" aria-labelledby="about-title">
      <div className="wrap about-block__inner">
        <div>
          <span className="section-kicker">Tentang kami</span>
          {block.title ? <h2 id="about-title">{block.title}</h2> : null}
        </div>
        <RichText value={block.body} className="about-block__body" />
      </div>
    </section>
  )
}
