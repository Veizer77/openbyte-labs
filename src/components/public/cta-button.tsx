import Link from 'next/link'
import type { LinkDto } from '@/lib/content/types'

const ICON_LABELS: Record<string, string> = {
  arrow_forward: 'arrow_forward',
  north_east: 'north_east',
  arrow_outward: 'arrow_outward',
}

/**
 * Tombol CTA dari CMS. Href sudah divalidasi `toLinkDto` (protokol aman, bukan
 * `/tracking*`), jadi di sini hanya memilih elemen yang tepat.
 */
export function CtaButton({
  link,
  variant = 'dark',
  icon = 'arrow_forward',
}: {
  link: LinkDto
  variant?: 'dark' | 'light' | 'lime'
  icon?: keyof typeof ICON_LABELS
}) {
  const className = `button button--${variant}`
  const content = (
    <>
      {link.label}{' '}
      <span className="material-symbols-outlined" aria-hidden="true">
        {ICON_LABELS[icon] ?? 'arrow_forward'}
      </span>
    </>
  )

  if (link.external) {
    return (
      <a className={className} href={link.href} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    )
  }

  return (
    <Link className={className} href={link.href}>
      {content}
    </Link>
  )
}
