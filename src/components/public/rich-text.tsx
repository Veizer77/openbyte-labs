import Image from 'next/image'
import Link from 'next/link'
import { isExternalHref, isSafeHref } from '@/lib/content/links'
import type { RichTextValue } from '@/lib/content/types'

/**
 * Renderer rich text Lexical (F3-02, F3-05).
 *
 * Hanya node yang dikenal yang dirender sebagai elemen React. Tidak ada
 * `dangerouslySetInnerHTML`: HTML mentah dari CMS tidak pernah dieksekusi.
 * Tautan divalidasi (`https`/`http`/`mailto`/`tel`/path internal); tautan yang
 * tidak lolos dirender sebagai teks biasa. Node tak dikenal dirender sebagai
 * anak-anaknya agar isi tidak hilang.
 */

type LexicalNode = {
  type?: unknown
  children?: unknown
  text?: unknown
  format?: unknown
  tag?: unknown
  listType?: unknown
  fields?: unknown
  value?: unknown
  url?: unknown
  alt?: unknown
  width?: unknown
  height?: unknown
  newTab?: unknown
  root?: unknown
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_STRIKETHROUGH = 4
const FORMAT_UNDERLINE = 8
const FORMAT_CODE = 16
const FORMAT_SUBSCRIPT = 32
const FORMAT_SUPERSCRIPT = 64

const HEADING_TAGS = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

function asNode(value: unknown): LexicalNode | null {
  return value && typeof value === 'object' ? (value as LexicalNode) : null
}

function asNodes(value: unknown): LexicalNode[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const node = asNode(item)
    return node ? [node] : []
  })
}

function renderText(node: LexicalNode, key: string): React.ReactNode {
  const text = typeof node.text === 'string' ? node.text : ''
  if (!text) return null

  const format = typeof node.format === 'number' ? node.format : 0
  let element: React.ReactNode = text

  if (format & FORMAT_CODE) element = <code>{element}</code>
  if (format & FORMAT_BOLD) element = <strong>{element}</strong>
  if (format & FORMAT_ITALIC) element = <em>{element}</em>
  if (format & FORMAT_UNDERLINE) element = <u>{element}</u>
  if (format & FORMAT_STRIKETHROUGH) element = <s>{element}</s>
  if (format & FORMAT_SUBSCRIPT) element = <sub>{element}</sub>
  if (format & FORMAT_SUPERSCRIPT) element = <sup>{element}</sup>

  return <span key={key}>{element}</span>
}

function renderLink(node: LexicalNode, key: string): React.ReactNode {
  const fields = asNode(node.fields)
  const url = typeof fields?.url === 'string' ? fields.url : null
  const children = renderChildren(node, key)

  if (!url || !isSafeHref(url)) return <span key={key}>{children}</span>

  const newTab = fields?.newTab === true
  const external = isExternalHref(url)

  if (external || !url.startsWith('/')) {
    return (
      <a
        key={key}
        href={url}
        rel={newTab || external ? 'noopener noreferrer' : undefined}
        target={newTab ? '_blank' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link key={key} href={url}>
      {children}
    </Link>
  )
}

function renderUpload(node: LexicalNode, key: string): React.ReactNode {
  const media = asNode(node.value)
  const url = typeof media?.url === 'string' ? media.url : null
  if (!url) return null

  const alt = typeof media?.alt === 'string' ? media.alt : ''
  const width = typeof media?.width === 'number' && media.width > 0 ? media.width : 1200
  const height = typeof media?.height === 'number' && media.height > 0 ? media.height : 800

  return (
    <span className="rich-text__media" key={key}>
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 900px) 100vw, 800px"
        style={{ height: 'auto', maxWidth: '100%' }}
      />
    </span>
  )
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br key={key} />

    case 'paragraph': {
      const children = renderChildren(node, key)
      return <p key={key}>{children}</p>
    }

    case 'heading': {
      const tag = typeof node.tag === 'string' && HEADING_TAGS.has(node.tag) ? node.tag : 'h2'
      const children = renderChildren(node, key)
      if (tag === 'h3') return <h3 key={key}>{children}</h3>
      if (tag === 'h4') return <h4 key={key}>{children}</h4>
      if (tag === 'h5') return <h5 key={key}>{children}</h5>
      if (tag === 'h6') return <h6 key={key}>{children}</h6>
      return <h2 key={key}>{children}</h2>
    }

    case 'quote': {
      const children = renderChildren(node, key)
      return <blockquote key={key}>{children}</blockquote>
    }

    case 'list': {
      const ordered = node.listType === 'number'
      const children = renderChildren(node, key)
      return ordered ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
    }

    case 'listitem': {
      const children = renderChildren(node, key)
      return <li key={key}>{children}</li>
    }

    case 'link':
    case 'autolink':
      return renderLink(node, key)

    case 'upload':
      return renderUpload(node, key)

    case 'horizontalrule':
      return <hr key={key} />

    default: {
      const children = renderChildren(node, key)
      if (!children.length) return null
      return <span key={key}>{children}</span>
    }
  }
}

function renderChildren(node: LexicalNode, keyPrefix: string): React.ReactNode[] {
  return asNodes(node.children).map((child, index) => renderNode(child, `${keyPrefix}-${index}`))
}

export function RichText({
  value,
  className,
}: {
  value: RichTextValue | null | undefined
  className?: string
}) {
  const root = asNode(value)?.root
  const rootNode = asNode(root)
  if (!rootNode) return null

  const content = renderChildren(rootNode, 'rt')
  if (!content.length) return null

  return <div className={className ? `rich-text ${className}` : 'rich-text'}>{content}</div>
}
