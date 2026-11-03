import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

afterEach(() => vi.unstubAllEnvs());
describe("private R2 upload CSP", () => {
  it("permits only the configured account and private bucket, including the existing PRIVATE alias", () => {
    const account = "a".repeat(32);
    vi.stubEnv("R2_ACCOUNT_ID", account);
    vi.stubEnv("R2_BUCKET_STAGING", undefined);
    vi.stubEnv("R2_BUCKET_PRIVATE", "private-uploads");
    const policy = proxy(
      new NextRequest("https://example.test/tracking"),
    ).headers.get("Content-Security-Policy")!;
    expect(policy).toContain(`https://${account}.r2.cloudflarestorage.com`);
    expect(policy).toContain(
      `https://private-uploads.${account}.r2.cloudflarestorage.com`,
    );
    expect(policy).not.toContain("*.r2.cloudflarestorage.com");
  });
  it("allows the Turnstile challenge iframe and its per-customer subdomains", () => {
    const policy = proxy(
      new NextRequest("https://example.test/konsultasi"),
    ).headers.get("Content-Security-Policy")!;
    expect(policy).toContain(
      "frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
    );
    expect(policy).toContain(
      "connect-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
    );
  });
  it("keeps nonce-only styles outside development so inline <style> stays blocked", () => {
    vi.stubEnv("NODE_ENV", "production");
    const policy = proxy(
      new NextRequest("https://example.test/konsultasi"),
    ).headers.get("Content-Security-Policy")!;
    expect(policy).toMatch(/style-src 'self' 'nonce-[^']+'/);
    // A nonce makes browsers ignore 'unsafe-inline', so it must not be advertised.
    expect(policy).not.toContain("style-src 'self' 'unsafe-inline'");
  });
  it("allows inline styles in development so Next.js dev tools can style themselves", () => {
    vi.stubEnv("NODE_ENV", "development");
    const policy = proxy(
      new NextRequest("https://example.test/konsultasi"),
    ).headers.get("Content-Security-Policy")!;
    // The overlay and indicator inject <style> without the request nonce; a nonce
    // here would silently drop 'unsafe-inline' and leave them unstyled.
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).not.toMatch(/style-src 'self' 'nonce-/);
    // Scripts keep the nonce in development too.
    expect(policy).toMatch(/script-src 'self' 'nonce-[^']+'/);
  });
  it("does not let a malformed environment value add CSP sources or directives", () => {
    vi.stubEnv("R2_ACCOUNT_ID", "a".repeat(32));
    vi.stubEnv("R2_BUCKET_STAGING", "bad; connect-src https://evil.example");
    const policy = proxy(
      new NextRequest("https://example.test/tracking"),
    ).headers.get("Content-Security-Policy")!;
    expect(policy).not.toContain("evil.example");
    expect(policy).not.toContain("cloudflarestorage.com");
  });
});
