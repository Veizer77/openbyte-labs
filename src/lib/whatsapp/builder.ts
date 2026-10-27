import { normalizeWhatsAppNumber } from './normalize'
import { validateWhatsAppTemplate } from './template'

export function renderWhatsAppTemplate(
  template: string,
  variables: Record<string, string | number | null | undefined>,
): string {
  return template.replace(/\{([^{}]+)\}/g, (_, key: string) => {
    const value = variables[key]
    if (value == null) return ''
    return String(value)
  })
}

export function buildWhatsAppLink({
  phone,
  message,
}: {
  phone: string
  message: string
}): { url?: string; error?: string } {
  const normalized = normalizeWhatsAppNumber(phone)
  if (!normalized) {
    return { error: 'Nomor WhatsApp tidak valid (harus nomor seluler Indonesia yang sah).' }
  }

  const encoded = encodeURIComponent(message)
  return {
    url: `https://wa.me/${normalized}?text=${encoded}`,
  }
}

export function buildWhatsAppMessageUrl({
  phone,
  template,
  variables,
}: {
  phone: string
  template: string
  variables: Record<string, string | number | null | undefined>
}): { url?: string; error?: string; message?: string } {
  const templateValidation = validateWhatsAppTemplate(template)
  if (templateValidation !== true) {
    return { error: templateValidation }
  }

  const message = renderWhatsAppTemplate(template, variables)
  const link = buildWhatsAppLink({ phone, message })
  if (link.error) {
    return { error: link.error }
  }

  return { url: link.url, message }
}
