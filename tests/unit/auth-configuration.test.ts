import { describe, expect, it } from "vitest";
import { createAdminAuth } from "@/auth/configuration";
import type { Database } from "@/db/connection";

// A schema/config test only: this object must never be queried as a database.
const noDatabase = {} as Database;
const config = {
  baseURL: "https://example.test",
  secret: "test-secret-value-at-least-thirty-two-characters",
  production: true,
};

describe("konfigurasi auth yang belum diekspos", () => {
  it("menutup signup dan mewajibkan pengaturan TOTP", () => {
    const auth = createAdminAuth(noDatabase, config);
    expect(auth.options.emailAndPassword).toMatchObject({
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
    });
    expect(auth.options.session?.cookieCache?.enabled).toBe(false);
    expect(auth.options.advanced).toMatchObject({
      useSecureCookies: true,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      ipAddress: { disableIpTracking: true },
    });
    expect(
      auth.options.plugins?.find((plugin) => plugin.id === "two-factor")
        ?.options,
    ).toMatchObject({
      skipVerificationOnEnable: false,
      trustDeviceMaxAge: 0,
      accountLockout: {
        enabled: true,
        maxFailedAttempts: 5,
        durationSeconds: 900,
      },
    });
  });
  it("menolak origin tidak aman dan secret pendek", () => {
    for (const baseURL of [
      "http://example.com",
      "https://example.com/path",
      "https://user:pass@example.com",
      "not-a-url",
    ]) {
      expect(() =>
        createAdminAuth(noDatabase, { ...config, baseURL }),
      ).toThrow();
    }
    expect(() =>
      createAdminAuth(noDatabase, { ...config, secret: "short" }),
    ).toThrow();
    // Loopback stays usable for local `next start` smoke tests, but any real
    // host over plain HTTP must be rejected in production.
    expect(() =>
      createAdminAuth(noDatabase, {
        ...config,
        baseURL: "http://192.168.1.10:3000",
      }),
    ).toThrow();
    expect(() =>
      createAdminAuth(noDatabase, {
        ...config,
        baseURL: "http://localhost:3000",
      }),
    ).not.toThrow();
    expect(() =>
      createAdminAuth(noDatabase, {
        ...config,
        baseURL: "http://127.0.0.1:3000",
      }),
    ).not.toThrow();
    expect(() =>
      createAdminAuth(noDatabase, {
        ...config,
        baseURL: "http://localhost:3000",
        production: false,
      }),
    ).not.toThrow();
  });
});
