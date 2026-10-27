/** Compare the browser Origin to the configured site origin without trusting Referer. */
export function isSameOriginRequest(originHeader: string | null | undefined, siteUrl: string): boolean {
  if (!originHeader || originHeader === 'null') return false

  try {
    const requestOrigin = new URL(originHeader)
    const configuredSite = new URL(siteUrl)
    if (requestOrigin.username || requestOrigin.password) return false
    if (!['http:', 'https:'].includes(requestOrigin.protocol)) return false
    return requestOrigin.origin === configuredSite.origin
  } catch {
    return false
  }
}
