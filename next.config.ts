import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * Allowlist gambar remote (F3-03): hanya host R2 dari environment yang
 * diizinkan, bukan seluruh host internet. Bila R2 belum dikonfigurasi, media
 * dilayani dari `/api/media/file/**` sehingga allowlist remote tidak dibutuhkan.
 */
function r2RemotePatterns(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL
  if (!baseUrl) return []

  try {
    const url = new URL(baseUrl)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return []
    return [
      {
        protocol: url.protocol === 'https:' ? ('https' as const) : ('http' as const),
        hostname: url.hostname,
        pathname: '/**',
      },
    ]
  } catch {
    return []
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  // Preview Vercel tidak boleh terindeks mesin pencari (F0-05). Header hanya
  // aktif ketika bukan deploy produksi Vercel; lokal ikut noindex karena
  // VERCEL_ENV tidak disetel di luar Vercel.
  ...(process.env.VERCEL_ENV === 'production'
    ? {}
    : {
        headers: async () => [
          {
            source: '/:path*',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
          },
        ],
      }),
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
        search: '',
      },
    ],
    remotePatterns: r2RemotePatterns(),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
