import { describe, expect, it } from 'vitest'
import {
  bookingSubmissionSchema,
  inquirySubmissionSchema,
  isHoneypotFilled,
  quoteSubmissionSchema,
} from '../../src/lib/security/submissions'

const shared = {
  name: 'Budi Santoso',
  whatsapp: '081234567890',
  consent: true,
  turnstileToken: 'token-uji',
  website: '',
}

describe('public submission schemas', () => {
  it('normalizes a valid inquiry WhatsApp number and blank optional fields', () => {
    const result = inquirySubmissionSchema.parse({
      ...shared,
      email: '   ',
      organizationOrBusiness: '  ',
      message: 'Saya ingin bertanya tentang layanan.',
      packageSlug: 'website-company',
    })

    expect(result.whatsapp).toBe('6281234567890')
    expect(result.email).toBeUndefined()
    expect(result.organizationOrBusiness).toBeUndefined()
  })

  it('returns Indonesian field validation messages', () => {
    const result = inquirySubmissionSchema.safeParse({
      ...shared,
      name: ' ',
      whatsapp: 'nomor-rahasia',
      message: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message).join(' ')
      expect(messages).toMatch(/Nama|WhatsApp|pesan/i)
    }
  })

  it('rejects untrusted operational fields rather than accepting client authority', () => {
    const result = inquirySubmissionSchema.safeParse({
      ...shared,
      message: 'Mohon informasi layanan lebih lanjut.',
      status: 'converted',
      consentAt: '2000-01-01T00:00:00.000Z',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message === 'Permintaan berisi isian yang tidak dikenal.'),
        JSON.stringify(result.error.issues),
      ).toBe(true)
      expect(result.error.issues.map((issue) => issue.message).join(' ')).not.toContain('Invalid input')
    }
  })

  it('requires explicit consent and a non-empty Turnstile token', () => {
    const result = inquirySubmissionSchema.safeParse({
      ...shared,
      consent: false,
      turnstileToken: '',
      message: 'Mohon informasi layanan lebih lanjut.',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message).join(' ')
      expect(messages).toMatch(/persetujuan/i)
      expect(messages).toContain('Turnstile')
    }
  })

  it('accepts valid quote selections but rejects duplicate item ids and forged prices', () => {
    const valid = quoteSubmissionSchema.parse({
      selections: [{ itemId: 'landing', units: 1 }, { itemId: 'module-report' }],
      contactName: 'Budi Santoso',
      contactWhatsapp: '081234567890',
      consent: true,
      turnstileToken: 'token-uji',
      website: '',
    })
    expect(valid.contactWhatsapp).toBe('6281234567890')

    expect(quoteSubmissionSchema.safeParse({
      ...valid,
      selections: [{ itemId: 'landing' }, { itemId: 'landing' }],
    }).success).toBe(false)

    expect(quoteSubmissionSchema.safeParse({ ...valid, priceMin: 1 }).success).toBe(false)
  })

  it('requires quote contact name and WhatsApp together when either is supplied', () => {
    const result = quoteSubmissionSchema.safeParse({
      selections: [{ itemId: 'landing' }],
      contactName: 'Budi Santoso',
      consent: true,
      turnstileToken: 'token-uji',
      website: '',
    })

    expect(result.success).toBe(false)
  })

  it('requires a timezone-aware booking slot and valid consultation mode', () => {
    const valid = bookingSubmissionSchema.parse({
      ...shared,
      serviceInterest: 'website-company',
      slotStart: '2027-01-10T02:00:00.000Z',
      consultationMode: 'google_meet',
      projectBrief: 'Website katalog untuk usaha.',
    })
    expect(valid.slotStart).toBe('2027-01-10T02:00:00.000Z')

    expect(bookingSubmissionSchema.safeParse({
      ...valid,
      slotStart: '2027-01-10 02:00',
    }).success).toBe(false)

    expect(bookingSubmissionSchema.safeParse({
      ...valid,
      consultationMode: 'unknown',
    }).success).toBe(false)
  })

  it('keeps honeypot detection separate from shape validation', () => {
    const result = inquirySubmissionSchema.parse({
      ...shared,
      message: 'Mohon informasi layanan lebih lanjut.',
      website: 'filled by bot',
    })

    expect(isHoneypotFilled(result.website)).toBe(true)
    expect(isHoneypotFilled('   ')).toBe(false)
    expect(isHoneypotFilled(undefined)).toBe(false)
  })
})
