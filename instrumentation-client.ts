import * as Sentry from '@sentry/nextjs'

/**
 * Monitoring klien: galat browser dilaporkan ke Sentry bila DSN disetel
 * (PRD 6.7). DSN memang dirancang publik sehingga aman dibundel ke klien;
 * tanpa nilai, init bersifat no-op seperti sisi server.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.1,
})
