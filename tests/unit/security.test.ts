import { describe, expect, it, vi } from "vitest";
import { hashClientIp } from "@/security/client-ip-hash";
import { consumePublicFormBudget } from "@/security/public-form-rate-limit";
import { verifyTurnstile } from "@/security/turnstile";
import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import type { Database } from "@/db/connection";

const input = {
  token: "test-token",
  secret: "test-secret",
  expectedHostname: "example.com",
  expectedAction: "booking",
  honeypot: "",
};

describe("verifikasi Turnstile", () => {
  it("hanya menerima respons sukses untuk hostname dan action yang diharapkan", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            hostname: "example.com",
            action: "booking",
          }),
          { status: 200 },
        ),
      );
    expect(await verifyTurnstile(input, fetcher)).toBe(true);
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(init.method).toBe("POST");
    expect(init.cache).toBe("no-store");
    expect(init.body.get("response")).toBe(input.token);
    for (const payload of [
      { success: false },
      { success: true, hostname: "elsewhere.example", action: "booking" },
      { success: true, hostname: "example.com", action: "contact" },
      { success: true },
    ]) {
      expect(
        await verifyTurnstile(
          input,
          vi
            .fn()
            .mockResolvedValue(
              new Response(JSON.stringify(payload), { status: 200 }),
            ),
        ),
      ).toBe(false);
    }
  });
  it("gagal tertutup untuk honeypot, input rusak, HTTP error, dan gangguan jaringan", async () => {
    const fetcher = vi.fn();
    expect(await verifyTurnstile({ ...input, honeypot: "spam" }, fetcher)).toBe(
      false,
    );
    expect(await verifyTurnstile({ ...input, honeypot: " " }, fetcher)).toBe(
      false,
    );
    expect(await verifyTurnstile({ ...input, token: "" }, fetcher)).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
    expect(
      await verifyTurnstile(
        input,
        vi.fn().mockResolvedValue(new Response("error", { status: 500 })),
      ),
    ).toBe(false);
    expect(
      await verifyTurnstile(
        input,
        vi.fn().mockRejectedValue(new Error("unavailable")),
      ),
    ).toBe(false);
    expect(
      await verifyTurnstile(
        input,
        vi.fn().mockResolvedValue(new Response("not json")),
      ),
    ).toBe(false);
  });
});

describe("batas form publik", () => {
  it("memakai satu upsert dengan syarat atomik dan kunci terparameterisasi", async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce([{ count: 1 }])
      .mockResolvedValueOnce([]);
    const db = { execute } as unknown as Database;
    const key = "a".repeat(64);
    expect(await consumePublicFormBudget(db, key)).toBe(true);
    expect(await consumePublicFormBudget(db, key)).toBe(false);
    const query = new PgDialect().sqlToQuery(execute.mock.calls[0][0] as SQL);
    expect(query.sql).toContain("ON CONFLICT");
    expect(query.sql).toContain('"rate_limits"."count" < 5');
    expect(query.sql).toContain("interval '15 minutes'");
    expect(query.params).toEqual([key]);
    await expect(consumePublicFormBudget(db, "raw-ip")).rejects.toThrow();
    expect(execute).toHaveBeenCalledTimes(2);
  });
});

describe("hash IP", () => {
  const key = "long-test-secret-used-only-for-unit-tests";
  it("menghasilkan HMAC stabil tanpa menyimpan alamat mentah", () => {
    const hash = hashClientIp("192.0.2.1", key);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain("192.0.2.1");
    expect(hashClientIp("192.0.2.1", key)).toBe(hash);
    expect(hashClientIp("192.0.2.2", key)).not.toBe(hash);
    expect(hashClientIp("2001:0db8:0:0:0:0:0:1", key)).toBe(
      hashClientIp("2001:db8::1", key),
    );
    expect(hashClientIp("::ffff:192.0.2.1", key)).toBe(hash);
  });
  it("menolak IP dan secret yang tidak valid", () => {
    expect(() => hashClientIp("forwarded, 192.0.2.1", key)).toThrow();
    expect(() => hashClientIp("192.0.2.1", "short")).toThrow();
  });
});
