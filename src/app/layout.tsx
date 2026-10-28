import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenByte Labs • Rekayasa Perangkat Lunak & Sistem Presisi Tinggi',
  description:
    'Membangun arsitektur web dan mobile modern untuk instansi dan bisnis. Skalabilitas tinggi, performa tanpa kompromi, dan jaminan kode produksi yang siap diaudit.',
  icons: {
    icon: '/brand/openbyte-labs-square-icon-1-1-logo-only.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#ffffff] text-[#18181a] antialiased">
        {children}
      </body>
    </html>
  )
}
