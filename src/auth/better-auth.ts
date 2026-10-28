import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { twoFactor } from 'better-auth/plugins/two-factor'
import { getDatabase } from '../db'
import { user, session, account, verification, twoFactor as twoFactorTable } from '../db/schema/auth'
import { getEnvironment } from '../lib/env'

export function createAuth() {
  const env = getEnvironment()

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDatabase(), {
      provider: 'pg',
      schema: {
        user,
        session,
        account,
        verification,
        twoFactor: twoFactorTable,
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true, // Pendaftaran publik DITUTUP total
    },
    plugins: [
      twoFactor({
        issuer: 'OpenByte Labs',
      }),
    ],
    advanced: {
      useSecureCookies: process.env.NODE_ENV === 'production',
    },
  })
}

let authInstance: ReturnType<typeof createAuth> | undefined

export function getAuth() {
  authInstance ??= createAuth()
  return authInstance
}
