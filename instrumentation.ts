import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

/**
 * Menangkap galat server Next.js (App Router) ke Sentry (PRD 6.7).
 * Tanpa SENTRY_DSN, init di config server/edge bersifat no-op.
 */
export const onRequestError = Sentry.captureRequestError
