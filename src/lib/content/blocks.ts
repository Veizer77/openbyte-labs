/**
 * Pemilihan blok Page Builder (F3-02).
 *
 * Urutan mengikuti array CMS, blok dengan `isVisible === false` dilewati, dan
 * blok dengan tipe yang tidak dikenali dilewati sambil dilaporkan agar bisa
 * dicatat ke Sentry — halaman tidak boleh jatuh hanya karena satu blok asing.
 */

export const KNOWN_PAGE_BLOCK_TYPES = [
  'hero',
  'servicesGrid',
  'portfolioShowcase',
  'calculator',
  'pricing',
  'testimonials',
  'faq',
  'about',
  'ctaBanner',
  'richText',
] as const

export type KnownPageBlockType = (typeof KNOWN_PAGE_BLOCK_TYPES)[number]

const KNOWN_PAGE_BLOCK_SET: ReadonlySet<string> = new Set(KNOWN_PAGE_BLOCK_TYPES)

export type RawBlockLike = {
  blockType?: unknown
  isVisible?: unknown
}

export type BlockSelection<T> = {
  blocks: T[]
  unknownTypes: string[]
  hiddenCount: number
}

export function selectRenderableBlocks<T extends RawBlockLike>(
  blocks: readonly T[] | null | undefined,
): BlockSelection<T> {
  if (!Array.isArray(blocks)) return { blocks: [], unknownTypes: [], hiddenCount: 0 }

  const visible: T[] = []
  const unknownTypes: string[] = []
  let hiddenCount = 0

  for (const block of blocks) {
    const blockType = typeof block?.blockType === 'string' ? block.blockType : ''
    if (!KNOWN_PAGE_BLOCK_SET.has(blockType)) {
      if (blockType) unknownTypes.push(blockType)
      continue
    }
    if (block.isVisible === false) {
      hiddenCount += 1
      continue
    }
    visible.push(block)
  }

  return { blocks: visible, unknownTypes, hiddenCount }
}

/**
 * Penanda konten yang belum boleh terbit: `[ISI]` dari PRD dan placeholder
 * serupa. Dipakai untuk menahan halaman legal/`about` yang masih draf.
 */
export function containsUnpublishedPlaceholder(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /\[ISI\]|\bTODO\b|\bTBD\b/i.test(value)
}

/** Mengambil semua teks dari nilai rich text Lexical untuk pemeriksaan placeholder. */
export function collectRichText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const parts: string[] = []

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    if (typeof record.text === 'string') parts.push(record.text)
    if (record.children) walk(record.children)
    if (record.root) walk(record.root)
  }

  walk(value)
  return parts.join(' ')
}
