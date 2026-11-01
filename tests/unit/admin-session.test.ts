import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";
import { requireAdminSession } from "@/auth/require-admin";
import type { createAdminAuth } from "@/auth/configuration";
import type { Database } from "@/db/connection";

const headers = new Headers({ cookie: "session=test" });
const validSession = {
  user: { id: "identity-1", twoFactorEnabled: true },
  session: { id: "session-1", expiresAt: new Date("2100-01-01T00:00:00Z") },
};

function setup(session: unknown, rows: unknown[]) {
  const getSession = vi.fn().mockResolvedValue(session);
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn((condition: SQL | undefined) => {
    void condition;
    return { limit };
  });
  const innerJoin = vi.fn(() => ({ where }));
  const from = vi.fn(() => ({ innerJoin }));
  const select = vi.fn(() => ({ from }));
  return {
    auth: { api: { getSession } } as unknown as ReturnType<
      typeof createAdminAuth
    >,
    db: { select } as unknown as Database,
    getSession,
    select,
    where,
  };
}

describe("pemeriksaan sesi admin", () => {
  it("menolak sesi anonim, belum setup TOTP, atau kedaluwarsa tanpa query profil", async () => {
    for (const session of [
      null,
      {
        ...validSession,
        user: { ...validSession.user, twoFactorEnabled: false },
      },
      {
        ...validSession,
        session: { ...validSession.session, expiresAt: new Date("2000-01-01") },
      },
    ]) {
      const ctx = setup(session, []);
      await expect(
        requireAdminSession(ctx.auth, ctx.db, headers),
      ).rejects.toThrow("Akses ditolak");
      expect(ctx.select).not.toHaveBeenCalled();
      expect(ctx.getSession).toHaveBeenCalledWith({
        headers,
        query: { disableCookieCache: true },
      });
    }
  });
  it("tidak menganggap 2FA di akun sebagai bukti MFA untuk sesi tersebut", async () => {
    const ctx = setup(validSession, []);
    await expect(
      requireAdminSession(ctx.auth, ctx.db, headers),
    ).rejects.toThrow("Akses ditolak");
    const condition = ctx.where.mock.calls[0][0];
    const query = new PgDialect().sqlToQuery(condition!);
    expect(query.sql).toContain('"admin_session_assurances"."session_id"');
    expect(query.sql).toContain('"admin_session_assurances"."expires_at"');
    expect(query.sql).toContain('"admin_profiles"."auth_user_id"');
    expect(query.sql).toContain('"admin_profiles"."is_active"');
    expect(query.params).toContain("session-1");
    expect(query.params).toContain("identity-1");
  });
  it("menghasilkan principal hanya dari profil aktif yang cocok dengan assurance", async () => {
    const ctx = setup(validSession, [{ id: "profile-1", role: "editor" }]);
    await expect(
      requireAdminSession(ctx.auth, ctx.db, headers),
    ).resolves.toEqual({
      id: "profile-1",
      role: "editor",
      twoFactorVerified: true,
    });
    const invalid = setup(validSession, [{ id: "profile-1", role: "other" }]);
    await expect(
      requireAdminSession(invalid.auth, invalid.db, headers),
    ).rejects.toThrow("Akses ditolak");
  });
});
