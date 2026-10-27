'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Error boundary rute publik (F3-05). Detail internal (stack, SQL, pesan
 * database) tidak pernah ditampilkan ke pengunjung.
 */
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hanya id galat yang aman dicatat di klien; Sentry menangkap detailnya.
    if (error.digest) console.error(`Kesalahan halaman (${error.digest})`)
  }, [error])

  return (
    <section className="not-found wrap" aria-labelledby="error-title">
      <span className="not-found__code">500</span>
      <span className="section-kicker">Terjadi kendala</span>
      <h1 id="error-title">Halaman ini gagal dimuat.</h1>
      <p>
        Ada gangguan saat memuat konten. Silakan coba lagi; bila masih gagal, kembali ke beranda
        atau hubungi kami lewat WhatsApp.
      </p>
      <div className="hero__actions">
        <button className="button button--dark" onClick={reset} type="button">
          Coba lagi
        </button>
        <Link className="button button--light" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </section>
  )
}
