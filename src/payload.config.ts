import 'dotenv/config'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadTotp } from 'payload-totp'
import { id } from '@payloadcms/translations/languages/id'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Technologies } from './collections/Technologies'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { ServicePackages } from './collections/ServicePackages'
import { ServiceAddons } from './collections/ServiceAddons'
import { Inquiries } from './collections/Inquiries'
import { CalculatorGroups } from './collections/CalculatorGroups'
import { CalculatorItems } from './collections/CalculatorItems'
import { QuoteRequests } from './collections/QuoteRequests'
import { AvailabilityRules } from './collections/AvailabilityRules'
import { BlockedDates } from './collections/BlockedDates'
import { ConsultationBookings } from './collections/ConsultationBookings'
import { AuditLogs } from './collections/AuditLogs'
import { RateLimits } from './collections/RateLimits'
import { SiteSettings } from './globals/SiteSettings'
import { env, resolveDatabaseConnectionString } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteOrigins = Array.from(
  new Set(
    [env.SITE_URL, env.NEXT_PUBLIC_SITE_URL].filter(
      (origin): origin is string => Boolean(origin),
    ),
  ),
)
const hasPublicStorage = Boolean(
  env.R2_ACCOUNT_ID &&
  env.R2_ACCESS_KEY_ID &&
  env.R2_SECRET_ACCESS_KEY &&
  env.R2_BUCKET_PUBLIC &&
  env.R2_PUBLIC_BASE_URL,
)

const storagePlugin = s3Storage({
  alwaysInsertFields: true,
  bucket: env.R2_BUCKET_PUBLIC ?? 'openbyte-public',
  clientUploads: true,
  config: {
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? '',
    },
    endpoint: env.R2_ACCOUNT_ID
      ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined,
    forcePathStyle: true,
    region: 'auto',
  },
  collections: {
    media: {
      generateFileURL: ({ filename, prefix }) => {
        const key = [prefix, filename]
          .filter(Boolean)
          .flatMap((part) => part!.split('/'))
          .map(encodeURIComponent)
          .join('/')

        return `${env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '') ?? ''}/${key}`
      },
      prefix: 'media',
    },
  },
  enabled: hasPublicStorage,
})

export function databaseAdapterArgs() {
  return {
    pool: {
      connectionString: resolveDatabaseConnectionString({
        migrateDirect: process.env.PAYLOAD_MIGRATE_DIRECT === '1',
        pooledUri: env.DATABASE_URI,
        directUri: env.DATABASE_URI_DIRECT,
      }),
    },
    // Skema hanya berubah lewat migrasi Payload. Tanpa ini, adaptor mem-push
    // skema di development dan dapat membuang objek SQL kustom seperti
    // kendala eksklusi booking (PRD 2.2).
    push: false as const,
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Technologies,
    Services,
    Testimonials,
    FAQs,
    Pages,
    Projects,
    ServicePackages,
    ServiceAddons,
    Inquiries,
    CalculatorGroups,
    CalculatorItems,
    QuoteRequests,
    AvailabilityRules,
    BlockedDates,
    ConsultationBookings,
    AuditLogs,
    RateLimits,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter(databaseAdapterArgs()),
  serverURL: env.SITE_URL,
  cors: siteOrigins,
  csrf: siteOrigins,
  sharp,
  graphQL: {
    disable: true,
  },
  i18n: {
    supportedLanguages: { id },
  },
  plugins: [
    storagePlugin,
    payloadTotp({
      collection: 'users',
      forceSetup: true,
    }),
  ],
})
