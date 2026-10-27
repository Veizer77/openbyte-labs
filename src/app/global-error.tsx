'use client'

/**
 * Fallback terakhir bila root layout ikut gagal (F3-05). Wajib merender
 * html/body sendiri dan tidak boleh membocorkan detail internal.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          background: '#ffffff',
          color: '#18181a',
        }}
      >
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Aplikasi gagal dimuat.
          </h1>
          <p style={{ color: '#52525b', marginBottom: '1.5rem' }}>
            Terjadi kendala teknis. Coba muat ulang halaman ini.
          </p>
          <button
            onClick={reset}
            style={{
              border: 0,
              borderRadius: '999px',
              padding: '0.75rem 1.5rem',
              background: '#18181a',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
            type="button"
          >
            Muat ulang
          </button>
        </main>
      </body>
    </html>
  )
}
