import { isIP } from 'node:net'

const supportedProxyHeaders = new Set([
  'cf-connecting-ip',
  'x-forwarded-for',
  'x-real-ip',
])

type HeaderSource = Headers | Readonly<Record<string, string | undefined>>

export interface ResolveTrustedClientIpOptions {
  headers: HeaderSource
  trustedHeader: string | undefined
  trustedProxyHops?: number
}

export function resolveTrustedClientIp({
  headers,
  trustedHeader,
  trustedProxyHops,
}: ResolveTrustedClientIpOptions): string {
  const headerName = trustedHeader?.trim().toLowerCase()
  if (!headerName || !supportedProxyHeaders.has(headerName)) {
    throw new Error('Trusted client IP header is not configured')
  }

  const rawValue = headers instanceof Headers
    ? headers.get(headerName)
    : headers[headerName]
  if (!rawValue) throw new Error('Trusted client IP header is missing')

  if (headerName !== 'x-forwarded-for') {
    const directIp = rawValue.trim()
    if (isIP(directIp) === 0) throw new Error('Trusted client IP header is invalid')
    return directIp
  }

  if (!Number.isSafeInteger(trustedProxyHops) || !trustedProxyHops || trustedProxyHops < 1) {
    throw new Error('Trusted proxy hop count is not configured')
  }

  const addresses = rawValue.split(',').map((address) => address.trim())
  if (addresses.some((address) => isIP(address) === 0) || addresses.length < trustedProxyHops) {
    throw new Error('Trusted client IP chain is invalid')
  }

  const clientIndex = addresses.length - trustedProxyHops
  return addresses[clientIndex]
}
