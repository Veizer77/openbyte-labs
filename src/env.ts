import "server-only";
import { z } from "zod";

const postgresUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      return ["postgres:", "postgresql:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "DATABASE_URI harus berupa URL PostgreSQL.");

const httpUrl = z.url().refine((value) => {
  // Zod v4 still runs refinements when the base check fails, so never throw here.
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}, "URL harus http atau https.");

/** Deployment panels often emit `KEY=` instead of omitting the variable. */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SITE_URL: httpUrl.default("http://localhost:3000"),
    BETTER_AUTH_URL: optional(httpUrl),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET minimal 32 karakter."),
    DATABASE_URI: postgresUrl,
    IP_HASH_SALT: z.string().min(32, "IP_HASH_SALT minimal 32 karakter."),
    TRUSTED_IP_HEADER: z
      .string()
      .min(1)
      .max(64)
      .regex(/^[a-z0-9-]+$/i, "Nama header tidak valid.")
      .default("x-forwarded-for"),
    TURNSTILE_SECRET_KEY: optional(z.string().min(1)),
    // Development-only quick login. Ignored entirely when NODE_ENV=production.
    DEV_ADMIN_QUICK_LOGIN: optional(z.enum(["true", "false"])),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional(z.string().min(1)),
    R2_ACCOUNT_ID: optional(z.string().regex(/^[a-f0-9]{32}$/i)),
    R2_ACCESS_KEY_ID: optional(z.string().min(1)),
    R2_SECRET_ACCESS_KEY: optional(z.string().min(1)),
    R2_BUCKET_STAGING: optional(z.string().min(1)),
    R2_BUCKET_PUBLIC: optional(z.string().min(1)),
    R2_PUBLIC_BASE_URL: optional(httpUrl),
    SENTRY_DSN: optional(httpUrl),
  })
  .superRefine((value, ctx) => {
    // Both halves of Turnstile are mandatory in production; development may run without keys.
    if (value.NODE_ENV === "production") {
      try {
        const site = new URL(value.SITE_URL);
        if (
          site.protocol !== "https:" ||
          ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
            site.hostname.toLowerCase(),
          ) ||
          site.hostname.toLowerCase().endsWith(".localhost")
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["SITE_URL"],
            message: "SITE_URL produksi harus memakai HTTPS dan bukan alamat loopback.",
          });
        }
        if (
          value.BETTER_AUTH_URL &&
          new URL(value.BETTER_AUTH_URL).origin !== site.origin
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["BETTER_AUTH_URL"],
            message: "BETTER_AUTH_URL harus satu origin dengan SITE_URL.",
          });
        }
      } catch {
        // The URL schemas report malformed values without leaking their contents.
      }
      if (!value.TURNSTILE_SECRET_KEY) {
        ctx.addIssue({
          code: "custom",
          path: ["TURNSTILE_SECRET_KEY"],
          message: "TURNSTILE_SECRET_KEY wajib di produksi.",
        });
      }
      if (!value.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        ctx.addIssue({
          code: "custom",
          path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
          message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY wajib di produksi.",
        });
      }
      if (value.R2_PUBLIC_BASE_URL) {
        try {
          if (new URL(value.R2_PUBLIC_BASE_URL).protocol !== "https:") {
            ctx.addIssue({
              code: "custom",
              path: ["R2_PUBLIC_BASE_URL"],
              message: "R2_PUBLIC_BASE_URL produksi harus memakai HTTPS.",
            });
          }
        } catch {
          // The URL schema reports malformed values without leaking contents.
        }
      }
    }

    const r2Keys = [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_STAGING",
      "R2_BUCKET_PUBLIC",
      "R2_PUBLIC_BASE_URL",
    ] as const;
    const hasAnyR2Value = r2Keys.some((key) => Boolean(value[key]));
    if (hasAnyR2Value) {
      for (const key of r2Keys) {
        if (!value[key]) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Konfigurasi R2 harus diisi lengkap atau dikosongkan seluruhnya.",
          });
        }
      }
    }
  });

export type ServerEnv = z.output<typeof schema>;

let cached: ServerEnv | null = null;

/**
 * Validated lazily so `next build` and unit tests do not require production
 * secrets. Every HTTP entry point calls this before touching the database.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = schema.safeParse({
    ...process.env,
    R2_BUCKET_STAGING:
      process.env.R2_BUCKET_STAGING || process.env.R2_BUCKET_PRIVATE,
  });
  if (!parsed.success) {
    const fields = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean);
    throw new Error(
      `Konfigurasi lingkungan tidak valid: ${[...new Set(fields)].join(", ")}.`,
    );
  }
  cached = parsed.data;
  return cached;
}

/** Auth origin must equal the public site origin so cookies stay on one host. */
export function authBaseUrl(env: ServerEnv): string {
  return new URL(env.BETTER_AUTH_URL ?? env.SITE_URL).origin;
}

/** Test helper: forget the cached env after mutating `process.env`. */
export function resetEnvCache(): void {
  cached = null;
}
