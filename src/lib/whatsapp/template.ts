const allowedPlaceholders = new Set([
  'nama',
  'referensi',
  'platform',
  'rincian',
  'estimasi_harga',
  'estimasi_durasi',
  'tanggal',
  'jam',
  'meeting_url',
  'kode_tracking',
  'link_tracking',
  'nama_proyek',
  'judul_revisi',
  'sisa_kuota',
])

export function validateWhatsAppTemplate(value: unknown): true | string {
  if (value == null || value === '') return true
  if (typeof value !== 'string') return 'Template harus berupa teks.'

  const unknown = [...value.matchAll(/\{([^{}]*)\}/g)]
    .map((match) => match[1])
    .filter((placeholder) => !allowedPlaceholders.has(placeholder))

  if (!unknown.length) return true
  const formatted = [...new Set(unknown)].map((placeholder) => `{${placeholder}}`).join(', ')
  return `Placeholder tidak dikenal: ${formatted}.`
}
