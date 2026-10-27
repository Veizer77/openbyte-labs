import type { PageBlockDto, SiteSettingsDto } from '@/lib/content/types'
import { About } from './About'
import { CalculatorTeaser } from './CalculatorTeaser'
import { CtaBanner } from './CtaBanner'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { PortfolioShowcase } from './PortfolioShowcase'
import { Pricing } from './Pricing'
import { RichTextBlock } from './RichTextBlock'
import { ServicesGrid } from './ServicesGrid'
import { Testimonials } from './Testimonials'

/**
 * Pemetaan blok -> komponen (F3-02).
 *
 * Urutan mengikuti array CMS. Blok yang tidak dikenali sudah dibuang oleh
 * `selectRenderableBlocks` dan dilaporkan ke Sentry oleh pemanggil, sehingga
 * halaman tidak pernah jatuh karena satu blok asing.
 */
export function PageBlocks({
  blocks,
  settings,
}: {
  blocks: PageBlockDto[]
  settings: SiteSettingsDto
}) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`
        switch (block.type) {
          case 'hero':
            return <Hero key={key} block={block} settings={settings} />
          case 'servicesGrid':
            return <ServicesGrid key={key} block={block} />
          case 'portfolioShowcase':
            return <PortfolioShowcase key={key} block={block} />
          case 'calculator':
            return <CalculatorTeaser key={key} block={block} />
          case 'pricing':
            return <Pricing key={key} block={block} />
          case 'testimonials':
            return <Testimonials key={key} block={block} />
          case 'faq':
            return <Faq key={key} block={block} />
          case 'about':
            return <About key={key} block={block} />
          case 'ctaBanner':
            return <CtaBanner key={key} block={block} />
          case 'richText':
            return <RichTextBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
