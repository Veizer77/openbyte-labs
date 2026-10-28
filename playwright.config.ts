import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3105' },
  webServer: {
    command: 'node .next/standalone/server.js',
    url: 'http://127.0.0.1:3105/robots.txt',
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      HOSTNAME: '127.0.0.1',
      PORT: '3105',
      SITE_URL: 'http://127.0.0.1:3105',
      BETTER_AUTH_URL: 'http://127.0.0.1:3105',
      BETTER_AUTH_SECRET: 'test-only-auth-secret-not-a-production-credential',
      DATABASE_URI: 'postgres://test:test@127.0.0.1:1/openbyte_test',
      DATABASE_URI_DIRECT: 'postgres://test:test@127.0.0.1:1/openbyte_test',
      R2_ACCOUNT_ID: '',
      R2_ACCESS_KEY_ID: '',
      R2_SECRET_ACCESS_KEY: '',
      R2_BUCKET_PUBLIC: '',
      R2_PUBLIC_BASE_URL: '',
    },
  },
})
