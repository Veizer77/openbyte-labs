import { z } from 'zod'
import { normalizeWhatsAppNumber } from '../whatsapp/normalize'

const requiredName = z.string({ error: 'Nama wajib diisi.' })
  .trim()
  .min(2, 'Nama minimal 2 karakter.')
  .max(100, 'Nama maksimal 100 karakter.')

const requiredWhatsApp = z.string({ error: 'Nomor WhatsApp wajib diisi.' })
  .trim()
  .min(8, 'Nomor WhatsApp wajib diisi.')
  .max(25, 'Nomor WhatsApp maksimal 25 karakter.')
  .refine((value) => normalizeWhatsAppNumber(value) !== null, 'Nomor WhatsApp tidak valid.')
  .transform((value) => normalizeWhatsAppNumber(value) as string)

function optionalText(maximum: number, label: string) {
  return z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string({ error: `${label} tidak valid.` }).trim().max(maximum, `${label} maksimal ${maximum} karakter.`).optional(),
  )
}

const optionalEmail = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === ''
    ? undefined
    : typeof value === 'string'
      ? value.trim()
      : value,
  z.string({ error: 'Alamat email tidak valid.' })
    .max(254, 'Email maksimal 254 karakter.')
    .pipe(z.email({ error: 'Alamat email tidak valid.' }))
    .optional(),
)

const consent = z.literal(true, { error: 'Persetujuan penggunaan data wajib dicentang.' })
const turnstileToken = z.string({ error: 'Verifikasi Turnstile wajib dilakukan.' })
  .trim()
  .min(1, 'Verifikasi Turnstile wajib dilakukan.')
  .max(2048, 'Token Turnstile tidak valid.')
const honeypot = z.string({ error: 'Permintaan tidak valid.' }).max(256, 'Permintaan tidak valid.').optional().default('')

function strictObject<Shape extends z.ZodRawShape>(shape: Shape) {
  return z.strictObject(shape, { error: 'Permintaan berisi isian yang tidak dikenal.' })
}

const sharedContactFields = {
  name: requiredName,
  whatsapp: requiredWhatsApp,
  email: optionalEmail,
  organizationOrBusiness: optionalText(160, 'Nama instansi/usaha'),
  consent,
  turnstileToken,
  website: honeypot,
}

export const inquirySubmissionSchema = strictObject({
  ...sharedContactFields,
  message: z.string({ error: 'Pesan wajib diisi.' })
    .trim()
    .min(10, 'Pesan minimal 10 karakter.')
    .max(3000, 'Pesan maksimal 3.000 karakter.'),
  packageSlug: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string({ error: 'Paket tidak valid.' })
      .trim()
      .min(1, 'Paket tidak valid.')
      .max(100, 'Paket tidak valid.')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Paket tidak valid.')
      .optional(),
  ),
}).strict()

const quoteSelection = strictObject({
  itemId: z.string({ error: 'Pilihan kalkulator tidak valid.' }).trim().min(1, 'Pilihan kalkulator tidak valid.').max(100, 'Pilihan kalkulator tidak valid.'),
  units: z.number({ error: 'Jumlah unit harus berupa bilangan bulat.' }).int('Jumlah unit harus berupa bilangan bulat.').min(1, 'Jumlah unit minimal 1.').max(1000, 'Jumlah unit melebihi batas.').optional(),
})

export const quoteSubmissionSchema = strictObject({
  selections: z.array(quoteSelection, { error: 'Pilihan kalkulator tidak valid.' })
    .min(1, 'Pilih minimal satu item kalkulator.')
    .max(50, 'Jumlah pilihan kalkulator melebihi batas.'),
  contactName: optionalText(100, 'Nama'),
  contactWhatsapp: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    requiredWhatsApp.optional(),
  ),
  consent,
  turnstileToken,
  website: honeypot,
}).superRefine((value, context) => {
  const itemIds = value.selections.map(({ itemId }) => itemId)
  if (new Set(itemIds).size !== itemIds.length) {
    context.addIssue({
      code: 'custom',
      path: ['selections'],
      message: 'Item kalkulator yang sama tidak boleh dikirim lebih dari sekali.',
    })
  }

  if (Boolean(value.contactName) !== Boolean(value.contactWhatsapp)) {
    context.addIssue({
      code: 'custom',
      path: value.contactName ? ['contactWhatsapp'] : ['contactName'],
      message: 'Nama dan nomor WhatsApp harus diisi bersama.',
    })
  }
})

export const bookingSubmissionSchema = strictObject({
  ...sharedContactFields,
  serviceInterest: z.string({ error: 'Kategori layanan wajib dipilih.' })
    .trim()
    .min(1, 'Kategori layanan wajib dipilih.')
    .max(120, 'Kategori layanan tidak valid.'),
  slotStart: z.iso.datetime({
    offset: true,
    error: 'Waktu booking harus memiliki zona waktu yang valid.',
  }),
  consultationMode: z.enum(['google_meet', 'whatsapp_call', 'offline'], {
    error: 'Pilih metode konsultasi yang tersedia.',
  }),
  projectBrief: optionalText(4000, 'Ringkasan kebutuhan'),
}).strict()

export type InquirySubmission = z.output<typeof inquirySubmissionSchema>
export type QuoteSubmission = z.output<typeof quoteSubmissionSchema>
export type BookingSubmission = z.output<typeof bookingSubmissionSchema>

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}
