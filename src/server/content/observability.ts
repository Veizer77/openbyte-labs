/**
 * Pelaporan blok halaman yang tidak dikenali (F3-02).
 *
 * Halaman tidak boleh jatuh karena satu blok asing, tetapi kejadiannya harus
 * tercatat agar bisa diperbaiki. Pesan hanya berisi slug halaman dan tipe blok
 * — tidak ada isi konten, data pribadi, atau konfigurasi.
 *
 * Duplikasi dicegah per proses: satu kombinasi slug+tipe dilaporkan sekali,
 * sehingga `generateMetadata` dan render halaman tidak mengirim pesan ganda
 * setiap kali cache direvalidasi.
 */

import * as Sentry from '@sentry/nextjs'

const reported = new Set<string>()

export function reportUnknownBlocks(slug: string, types: readonly string[]): void {
  if (!types.length) return

  const unique = Array.from(new Set(types)).sort()
  const key = `${slug}:${unique.join(',')}`
  if (reported.has(key)) return
  reported.add(key)

  try {
    Sentry.captureMessage('Blok halaman tidak dikenali dilewati', {
      level: 'warning',
      tags: { area: 'page-blocks', page: slug },
      extra: { unknownBlockTypes: unique },
    })
  } catch {
    // Sentry tidak tersedia (tanpa DSN / di luar runtime Next.js): jangan
    // sampai kegagalan pelaporan menjatuhkan render halaman.
  }
}
