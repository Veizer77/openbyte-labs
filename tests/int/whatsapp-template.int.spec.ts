import { describe, expect, it } from 'vitest'
import { validateWhatsAppTemplate } from '../../src/lib/whatsapp/template'

describe('WhatsApp template validation', () => {
  it('accepts placeholders documented by the PRD', () => {
    expect(
      validateWhatsAppTemplate(
        '{nama} {referensi} {platform} {rincian} {estimasi_harga} {estimasi_durasi} {tanggal} {jam} {meeting_url} {kode_tracking} {link_tracking} {nama_proyek} {judul_revisi} {sisa_kuota}',
      ),
    ).toBe(true)
  })

  it('rejects unsupported placeholder names', () => {
    expect(validateWhatsAppTemplate('Halo {nama}, {nomor_rahasia}')).toBe(
      'Placeholder tidak dikenal: {nomor_rahasia}.',
    )
  })

  it('allows literal text without placeholders', () => {
    expect(validateWhatsAppTemplate('Silakan hubungi kami untuk informasi lebih lanjut.')).toBe(true)
  })

  it('allows an empty optional template', () => {
    expect(validateWhatsAppTemplate(undefined)).toBe(true)
    expect(validateWhatsAppTemplate('')).toBe(true)
  })

  it('requires a string value', () => {
    expect(validateWhatsAppTemplate(42)).toBe('Template harus berupa teks.')
  })
})
