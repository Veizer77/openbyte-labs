import { afterEach, describe, expect, it } from "vitest";
import { toFailure } from "@/actions/result";
import { AccessDeniedError } from "@/access/rules";
import { BookingSubmissionError } from "@/services/create-booking";
import { InquirySubmissionError } from "@/services/create-inquiry";
import { QuoteSubmissionError } from "@/services/create-quote";
import { authBaseUrl, getEnv, resetEnvCache } from "@/env";
import { isSameOrigin } from "@/security/origin";
import { normalizeAddress } from "@/security/client-ip";
import { z } from "zod";

const baseEnv = {
  NODE_ENV: "development",
  SITE_URL: "https://openbytelabs.example",
  BETTER_AUTH_SECRET: "x".repeat(40),
  DATABASE_URI: "postgres://user:pass@db.example:5432/openbyte_dev",
  IP_HASH_SALT: "y".repeat(40),
  TRUSTED_IP_HEADER: "x-forwarded-for",
} as const;

const r2Env = {
  R2_ACCOUNT_ID: "a".repeat(32),
  R2_ACCESS_KEY_ID: "test-access-key",
  R2_SECRET_ACCESS_KEY: "test-secret-key",
  R2_BUCKET_PUBLIC: "public-assets",
  R2_PUBLIC_BASE_URL: "https://cdn.example.com",
} as const;

function setEnv(values: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  resetEnvCache();
}

afterEach(() => {
  for (const key of [
    ...Object.keys(baseEnv),
    "BETTER_AUTH_URL",
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "SENTRY_DSN",
    ...Object.keys(r2Env),
    "R2_BUCKET_STAGING",
    "R2_BUCKET_PRIVATE",
  ]) {
    delete process.env[key];
  }
  resetEnvCache();
});

describe("validasi environment", () => {
  it.each([undefined, ""])(
    "menerima R2_BUCKET_PRIVATE saat staging bernilai %s",
    (staging) => {
      setEnv({
        ...baseEnv,
        ...r2Env,
        R2_BUCKET_STAGING: staging,
        R2_BUCKET_PRIVATE: "private-uploads",
      });
      expect(getEnv().R2_BUCKET_STAGING).toBe("private-uploads");
    },
  );

  it("mengutamakan R2_BUCKET_STAGING jika kedua nama bucket diisi", () => {
    setEnv({
      ...baseEnv,
      ...r2Env,
      R2_BUCKET_STAGING: "staging-uploads",
      R2_BUCKET_PRIVATE: "private-uploads",
    });
    expect(getEnv().R2_BUCKET_STAGING).toBe("staging-uploads");
  });

  it("tetap menolak R2 yang tidak memiliki bucket privat maupun staging", () => {
    setEnv({
      ...baseEnv,
      ...r2Env,
      R2_BUCKET_STAGING: undefined,
      R2_BUCKET_PRIVATE: undefined,
    });
    expect(() => getEnv()).toThrow(/R2_BUCKET_STAGING/);
  });

  it("menerima nama bucket privat di produksi tanpa melewati validasi Turnstile", () => {
    setEnv({
      ...baseEnv,
      ...r2Env,
      NODE_ENV: "production",
      R2_BUCKET_PRIVATE: "private-uploads",
      TURNSTILE_SECRET_KEY: "test-secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-site-key",
    });
    expect(getEnv().R2_BUCKET_STAGING).toBe("private-uploads");
    setEnv({ TURNSTILE_SECRET_KEY: undefined });
    expect(() => getEnv()).toThrow(/TURNSTILE_SECRET_KEY/);
  });

  it("menerima konfigurasi minimal dan menurunkan origin auth dari SITE_URL", () => {
    setEnv({ ...baseEnv });
    const env = getEnv();
    expect(authBaseUrl(env)).toBe("https://openbytelabs.example");
  });

  it("menolak secret pendek dan URL database non-postgres", () => {
    setEnv({
      ...baseEnv,
      BETTER_AUTH_SECRET: "pendek",
      DATABASE_URI: "https://db.example/openbyte",
    });
    expect(() => getEnv()).toThrow(/Konfigurasi lingkungan tidak valid/);
  });

  it("memperlakukan variabel opsional kosong sebagai tidak diatur", () => {
    setEnv({
      ...baseEnv,
      SENTRY_DSN: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
      BETTER_AUTH_URL: "",
    });
    const env = getEnv();
    expect(env.SENTRY_DSN).toBeUndefined();
    expect(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBeUndefined();
    expect(authBaseUrl(env)).toBe("https://openbytelabs.example");
  });

  it("mewajibkan secret dan site key Turnstile di produksi", () => {
    setEnv({ ...baseEnv, NODE_ENV: "production" });
    expect(() => getEnv()).toThrow(/TURNSTILE_SECRET_KEY/);

    setEnv({
      ...baseEnv,
      NODE_ENV: "production",
      TURNSTILE_SECRET_KEY: "secret",
    });
    expect(() => getEnv()).toThrow(/NEXT_PUBLIC_TURNSTILE_SITE_KEY/);

    setEnv({
      ...baseEnv,
      NODE_ENV: "production",
      TURNSTILE_SECRET_KEY: "secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
    });
    expect(getEnv().NODE_ENV).toBe("production");
  });
});

describe("normalisasi alamat proxy", () => {
  it("membuang port IPv4 dan bracket IPv6", () => {
    expect(normalizeAddress("203.0.113.7:443")).toBe("203.0.113.7");
    expect(normalizeAddress("[2001:db8::1]:8080")).toBe("2001:db8::1");
    expect(normalizeAddress(" 203.0.113.7 ")).toBe("203.0.113.7");
  });
});

describe("pemeriksaan origin", () => {
  it("hanya menerima origin yang sama dan menolak permintaan tanpa Origin", () => {
    const site = "https://openbytelabs.example";
    const make = (origin?: string) =>
      new Request("https://openbytelabs.example/api/admin/login", {
        method: "POST",
        headers: origin ? { origin } : {},
      });
    expect(isSameOrigin(make("https://openbytelabs.example"), site)).toBe(true);
    expect(isSameOrigin(make("https://evil.example"), site)).toBe(false);
    expect(isSameOrigin(make(), site)).toBe(false);
  });
});

describe("pemetaan galat action", () => {
  it("tidak membocorkan pesan internal untuk galat tak dikenal", () => {
    const result = toFailure(new Error("password=rahasia koneksi gagal"));
    expect(result).toEqual({
      ok: false,
      code: "gagal",
      message: "Permintaan tidak dapat diproses. Coba lagi.",
    });
  });

  it("memetakan galat domain ke kode stabil", () => {
    expect(toFailure(new AccessDeniedError()).code).toBe("akses_ditolak");
    expect(toFailure(new BookingSubmissionError("slot_unavailable")).code).toBe(
      "slot_unavailable",
    );
    expect(toFailure(new InquirySubmissionError("rate_limit")).code).toBe(
      "rate_limit",
    );
    expect(toFailure(new QuoteSubmissionError("selection_invalid")).code).toBe(
      "selection_invalid",
    );
  });

  it("memakai pesan Zod pertama untuk input tidak valid", () => {
    const parsed = z
      .object({ name: z.string().min(2, "Nama minimal 2 karakter.") })
      .safeParse({ name: "a" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(toFailure(parsed.error)).toEqual({
      ok: false,
      code: "input_tidak_valid",
      message: "Nama minimal 2 karakter.",
    });
  });
});
