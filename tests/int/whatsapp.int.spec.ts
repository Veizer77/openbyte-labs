import { describe, expect, it } from 'vitest'
import { normalizeWhatsAppNumber } from '../../src/lib/whatsapp/normalize'
import { buildWhatsAppLink, buildWhatsAppMessageUrl, renderWhatsAppTemplate } from '../../src/lib/whatsapp/builder'
import {
  buildBookingConfirmationWhatsAppAction,
  buildInquiryWhatsAppAction,
  buildQuoteWhatsAppAction,
  isValidHttpsMeetingUrl,
} from '../../src/lib/whatsapp/admin'

describe('WhatsApp module and Lampiran G.3 parity', () => {
  describe('Lampiran G.3 Phone Normalization Vectors', () => {
    it('normalizes 0895386011371 to 62895386011371', () => {
      expect(normalizeWhatsAppNumber('0895386011371')).toBe('62895386011371')
    })

    it('normalizes +62 895-3860-11371 to 62895386011371', () => {
      expect(normalizeWhatsAppNumber('+62 895-3860-11371')).toBe('62895386011371')
    })

    it('preserves valid 62812345678', () => {
      expect(normalizeWhatsAppNumber('62812345678')).toBe('62812345678')
    })

    it('normalizes 895386011371 to 62895386011371', () => {
      expect(normalizeWhatsAppNumber('895386011371')).toBe('62895386011371')
    })

    it('normalizes (0812) 3456-7890 to 6281234567890', () => {
      expect(normalizeWhatsAppNumber('(0812) 3456-7890')).toBe('6281234567890')
    })

    it('rejects 081234 (too short)', () => {
      expect(normalizeWhatsAppNumber('081234')).toBeNull()
    })

    it('rejects 0212345678 (landline prefix 021)', () => {
      expect(normalizeWhatsAppNumber('0212345678')).toBeNull()
    })

    it('rejects 08123abc4567890 (invalid characters)', () => {
      expect(normalizeWhatsAppNumber('08123abc4567890')).toBeNull()
    })

    it('rejects +1 415 555 0100 (non-Indonesian phone)', () => {
      expect(normalizeWhatsAppNumber('+1 415 555 0100')).toBeNull()
    })

    it('rejects empty and whitespace inputs', () => {
      expect(normalizeWhatsAppNumber('')).toBeNull()
      expect(normalizeWhatsAppNumber('   ')).toBeNull()
      expect(normalizeWhatsAppNumber(null)).toBeNull()
    })
  })

  describe('Template rendering and URL encoding', () => {
    it('interpolates placeholders cleanly', () => {
      const rendered = renderWhatsAppTemplate('Halo {nama}, ref {referensi}.', {
        nama: 'Budi Santoso',
        referensi: 'INQ-20261027-ABCD',
      })
      expect(rendered).toBe('Halo Budi Santoso, ref INQ-20261027-ABCD.')
    })

    it('builds wa.me URL with encoded message', () => {
      const result = buildWhatsAppLink({
        phone: '0895386011371',
        message: 'Halo Budi, terima kasih!',
      })
      expect(result.error).toBeUndefined()
      expect(result.url).toBe(
        'https://wa.me/62895386011371?text=Halo%20Budi%2C%20terima%20kasih!',
      )
    })

    it('rejects message generation if template has invalid placeholders', () => {
      const result = buildWhatsAppMessageUrl({
        phone: '0895386011371',
        template: 'Halo {nama}, PIN kamu {pin_rahasia}',
        variables: { nama: 'Budi' },
      })
      expect(result.error).toContain('Placeholder tidak dikenal: {pin_rahasia}')
    })
  })

  describe('Admin actions and HTTPS meeting URL validation', () => {
    it('validates meeting URL protocol', () => {
      expect(isValidHttpsMeetingUrl('https://meet.google.com/abc-defg-hij')).toBe(true)
      expect(isValidHttpsMeetingUrl('http://meet.google.com/insecure')).toBe(false)
      expect(isValidHttpsMeetingUrl('javascript:alert(1)')).toBe(false)
      expect(isValidHttpsMeetingUrl('')).toBe(false)
    })

    it('builds booking confirmation wa.me URL with validated meetingUrl', () => {
      const action = buildBookingConfirmationWhatsAppAction({
        booking: {
          reference: 'BKG-20261027-XYZ1',
          name: 'Dewi Lestari',
          whatsapp: '081234567890',
          slotStart: '2026-10-28T03:00:00.000Z',
          meetingUrl: 'https://meet.google.com/xyz-uvw-rst',
        },
        template:
          'Halo {nama}, booking konsultasi Anda (Ref: {referensi}) pada {tanggal} pukul {jam} telah dikonfirmasi. Tautan pertemuan: {meeting_url}',
      })

      expect(action.error).toBeUndefined()
      expect(action.url).toContain('https://wa.me/6281234567890?text=')
      expect(decodeURIComponent(action.url!)).toContain('https://meet.google.com/xyz-uvw-rst')
      expect(decodeURIComponent(action.url!)).toContain('BKG-20261027-XYZ1')
    })

    it('rejects booking confirmation when meetingUrl is missing or invalid', () => {
      const action = buildBookingConfirmationWhatsAppAction({
        booking: {
          reference: 'BKG-20261027-XYZ1',
          name: 'Dewi Lestari',
          whatsapp: '081234567890',
          slotStart: '2026-10-28T03:00:00.000Z',
          meetingUrl: 'http://insecure-link.com',
        },
        template: 'Halo {nama}, {meeting_url}',
      })

      expect(action.error).toContain('Tautan meeting harus berupa URL HTTPS')
      expect(action.url).toBeUndefined()
    })

    it('builds inquiry contact URL', () => {
      const action = buildInquiryWhatsAppAction({
        inquiry: {
          reference: 'INQ-20261027-9999',
          name: 'Pak Ahmad',
          whatsapp: '081398765432',
          packageName: 'Paket Startup',
        },
      })
      expect(action.error).toBeUndefined()
      expect(action.url).toContain('https://wa.me/6281398765432')
      expect(decodeURIComponent(action.url!)).toContain('Pak Ahmad')
      expect(decodeURIComponent(action.url!)).toContain('INQ-20261027-9999')
    })

    it('builds quote contact URL with formatted Rupiah without decimals', () => {
      const action = buildQuoteWhatsAppAction({
        quote: {
          reference: 'QTE-20261027-1111',
          name: 'Ibu Ratna',
          whatsapp: '081234567890',
          calculatedMinPrice: 2500000,
          calculatedMaxPrice: 4000000,
          estimatedDaysMin: 7,
          estimatedDaysMax: 14,
        },
      })
      expect(action.error).toBeUndefined()
      expect(action.url).toContain('https://wa.me/6281234567890')
      expect(decodeURIComponent(action.url!)).toContain('Rp 2.500.000 - Rp 4.000.000')
      expect(decodeURIComponent(action.url!)).toContain('7 - 14 hari kerja')
    })
  })
})
