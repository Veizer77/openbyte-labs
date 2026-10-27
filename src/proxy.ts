import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Komponen server admin (termasuk payload-totp 3.0.6) membaca pathname aktif
 * dari header `x-pathname` — tanpa ini redirect wajib setup/verify TOTP
 * berputar tanpa akhir karena pathname selalu terbaca '/'. Konvensi Next.js 16:
 * middleware dinamai proxy.ts (middleware.ts sudah deprecated).
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.append('x-pathname', request.nextUrl.pathname)
  return response
}
