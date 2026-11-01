import { describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import type { createAdminAuth } from "@/auth/configuration";
import { completeAdminTotp } from "@/auth/complete-totp";
import type { Database } from "@/db/connection";

function setup(existingSession: unknown, matchingRows: unknown[]) {
  const getSession = vi.fn().mockResolvedValue(existingSession);
  const verifyTOTP = vi
    .fn()
    .mockResolvedValue({
      response: { token: "private-token", user: { id: "identity-1" } },
      headers: new Headers(),
    });
  const returning = vi.fn().mockResolvedValue([{ sessionId: "session-1" }]);
  const values = vi.fn(() => ({ onConflictDoNothing: () => ({ returning }) }));
  const where = vi.fn((condition: SQL | undefined) => {
    void condition;
    return { for: vi.fn().mockResolvedValue(matchingRows) };
  });
  const innerJoin = vi.fn();
  innerJoin.mockImplementation(() => ({ innerJoin, where }));
  const tx = {
    select: () => ({ from: () => ({ innerJoin }) }),
    insert: () => ({ values }),
  };
  const db = {
    transaction: (callback: (value: typeof tx) => Promise<unknown>) =>
      callback(tx),
  } as unknown as Database;
  const auth = { api: { getSession, verifyTOTP } } as unknown as ReturnType<
    typeof createAdminAuth
  >;
  return { auth, db, getSession, verifyTOTP, values, where };
}

describe("bukti TOTP per sesi", () => {
  const headers = new Headers();
  it("menolak sesi password-only dan input OTP rusak sebelum verifikasi", async () => {
    const existing = setup({ user: {} }, []);
    await expect(
      completeAdminTotp(existing.auth, existing.db, headers, "123456"),
    ).rejects.toThrow("Akses ditolak");
    expect(existing.verifyTOTP).not.toHaveBeenCalled();
    const malformed = setup(null, []);
    await expect(
      completeAdminTotp(malformed.auth, malformed.db, headers, "12345x"),
    ).rejects.toThrow();
    expect(malformed.getSession).not.toHaveBeenCalled();
  });
  it("tidak meneruskan cookie bila sesi atau profil tidak cocok di database", async () => {
    const ctx = setup(null, []);
    await expect(
      completeAdminTotp(ctx.auth, ctx.db, headers, "123456"),
    ).rejects.toThrow("Akses ditolak");
    expect(ctx.verifyTOTP).toHaveBeenCalledWith({
      headers,
      body: { code: "123456", trustDevice: false },
      returnHeaders: true,
    });
    expect(ctx.values).not.toHaveBeenCalled();
  });
  it("mengikat bukti ke token sesi, identitas aktif, dan TOTP terverifikasi", async () => {
    const ctx = setup(null, [
      {
        sessionId: "session-1",
        profileId: "profile-1",
        expiresAt: new Date("2100-01-01"),
      },
    ]);
    await expect(
      completeAdminTotp(ctx.auth, ctx.db, headers, "123456"),
    ).resolves.toBeInstanceOf(Headers);
    const query = new PgDialect().sqlToQuery(ctx.where.mock.calls[0][0]!);
    expect(query.sql).toContain('"auth_session"."token"');
    expect(query.sql).toContain('"auth_user"."id"');
    expect(query.sql).toContain('"auth_two_factor"."verified"');
    expect(query.sql).toContain('"admin_profiles"."is_active"');
    expect(query.sql).toContain('"auth_session"."expires_at"');
    expect(query.params).toContain("private-token");
    expect(query.params).toContain("identity-1");
    expect(ctx.values).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: "session-1",
        adminProfileId: "profile-1",
        method: "totp",
      }),
    );
  });
});
