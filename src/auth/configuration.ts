import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins/two-factor";
import { z } from "zod";
import type { Database } from "@/db/connection";
import {
  authAccount,
  authSession,
  authTwoFactor,
  authUser,
  authVerification,
} from "@/db/schema/admin-identity";

const configSchema = z
  .object({
    baseURL: z.url(),
    secret: z.string().min(32),
    production: z.boolean(),
  })
  .strict()
  .superRefine((value, ctx) => {
    let url: URL;
    try {
      url = new URL(value.baseURL);
    } catch {
      return;
    }
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    // Loopback stays reachable for local `next start` smoke tests; every other
    // origin must be HTTPS in production.
    const allowedProtocol =
      url.protocol === "https:" || (url.protocol === "http:" && local);
    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      !allowedProtocol
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["baseURL"],
        message:
          "Origin auth harus HTTPS, kecuali localhost untuk development.",
      });
    }
  });

/**
 * HTTP sign-in and factor verification are exposed only through guarded app
 * routes. Session-level MFA assurance and application lockout remain required.
 */
export function createAdminAuth(
  db: Database,
  input: z.input<typeof configSchema>,
) {
  const config = configSchema.parse(input);
  const origin = new URL(config.baseURL).origin;
  return betterAuth({
    appName: "OpenByte Labs",
    baseURL: origin,
    secret: config.secret,
    trustedOrigins: [origin],
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: authUser,
        session: authSession,
        account: authAccount,
        verification: authVerification,
        twoFactor: authTwoFactor,
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    plugins: [
      twoFactor({
        issuer: "OpenByte Labs",
        skipVerificationOnEnable: false,
        trustDeviceMaxAge: 0,
        accountLockout: {
          enabled: true,
          maxFailedAttempts: 5,
          durationSeconds: 900,
        },
      }),
    ],
    session: { expiresIn: 60 * 60 * 12, cookieCache: { enabled: false } },
    advanced: {
      useSecureCookies: config.production || origin.startsWith("https:"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      ipAddress: { disableIpTracking: true },
    },
  });
}
