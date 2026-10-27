import type { PageBlockDto } from '@/lib/content/types'
import { RichText } from '@/components/public/rich-text'

type RichTextContentBlock = Extract<PageBlockDto, { type: 'richText' }>

/** Blok teks bebas (F3-02). */
export function RichTextBlock({ block }: { block: RichTextContentBlock }) {
  return (
    <section className="section rich-text-section">
      <div className="wrap">
        <RichText value={block.content} />
      </div>
    </section>
  )
}
