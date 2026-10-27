import { buildWhatsAppMessageUrl } from './builder'
import { formatRupiah, formatWibDate } from '../format/date'

export function isValidHttpsMeetingUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'https:' && parsed.hostname.length > 0
  } catch {
    return false
  }
}

export interface BookingConfirmationPayload {
  reference: string
  name: string
  whatsapp: string
  slotStart: string
  slotEnd?: string
  meetingUrl?: string
}

export function buildBookingConfirmationWhatsAppAction({
  booking,
  template,
}: {
  booking: BookingConfirmationPayload
  template: string
}): { url?: string; error?: string; message?: string } {
  if (!booking.meetingUrl || !isValidHttpsMeetingUrl(booking.meetingUrl)) {
    return { error: 'Tautan meeting harus berupa URL HTTPS yang valid (mis. https://meet.google.com/xxx).' }
  }

  const slotStartDate = new Date(booking.slotStart)
  const tanggal = formatWibDate(slotStartDate)
  const jam = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(slotStartDate)

  return buildWhatsAppMessageUrl({
    phone: booking.whatsapp,
    template,
    variables: {
      nama: booking.name,
      referensi: booking.reference,
      tanggal,
      jam: `${jam} WIB`,
      meeting_url: booking.meetingUrl,
    },
  })
}

export function buildInquiryWhatsAppAction({
  inquiry,
  template = 'Halo {nama}, terima kasih telah menghubungi OpenByte Labs (Ref: {referensi}). Mengenai kebutuhan sistem Anda, ada yang dapat kami bantu diskusikan?',
}: {
  inquiry: {
    reference: string
    name: string
    whatsapp: string
    packageName?: string
  }
  template?: string
}): { url?: string; error?: string; message?: string } {
  return buildWhatsAppMessageUrl({
    phone: inquiry.whatsapp,
    template,
    variables: {
      nama: inquiry.name,
      referensi: inquiry.reference,
      platform: inquiry.packageName ?? 'Custom Web/Sistem',
    },
  })
}

export function buildQuoteWhatsAppAction({
  quote,
  template = 'Halo {nama}, terima kasih telah melakukan estimasi di kalkulator OpenByte Labs (Ref: {referensi}). Estimasi biaya berkisar {estimasi_harga} dengan durasi {estimasi_durasi}. Mari diskusikan detail kebutuhan Anda.',
}: {
  quote: {
    reference: string
    name: string
    whatsapp: string
    calculatedMinPrice?: number
    calculatedMaxPrice?: number
    estimatedDaysMin?: number
    estimatedDaysMax?: number
  }
  template?: string
}): { url?: string; error?: string; message?: string } {
  const estimasiHarga =
    quote.calculatedMinPrice && quote.calculatedMaxPrice
      ? `${formatRupiah(quote.calculatedMinPrice)} - ${formatRupiah(quote.calculatedMaxPrice)}`
      : formatRupiah(quote.calculatedMinPrice ?? quote.calculatedMaxPrice ?? 0)

  const estimasiDurasi =
    quote.estimatedDaysMin && quote.estimatedDaysMax
      ? `${quote.estimatedDaysMin} - ${quote.estimatedDaysMax} hari kerja`
      : `${quote.estimatedDaysMin ?? quote.estimatedDaysMax ?? 0} hari kerja`

  return buildWhatsAppMessageUrl({
    phone: quote.whatsapp,
    template,
    variables: {
      nama: quote.name,
      referensi: quote.reference,
      estimasi_harga: estimasiHarga,
      estimasi_durasi: estimasiDurasi,
    },
  })
}
