import { beforeEach, describe, expect, it, vi } from "vitest";
import type { createAdminAuth } from "@/auth/configuration";
import type { Database } from "@/db/connection";

const { recordSessionAssurance } = vi.hoisted(() => ({
  recordSessionAssurance: vi.fn(),
}));
vi.mock("@/auth/session-assurance", () => ({ recordSessionAssurance }));

import { confirmTotpEnrollment } from "@/auth/enroll-totp";

beforeEach(() => {
  recordSessionAssurance.mockReset();
});

function setup() {
  const current = {
    user: { id: "user-1", twoFactorEnabled: false },
    session: { token: "old-deleted-token" },
  };
  const renewed = {
    user: { id: "user-1", twoFactorEnabled: true },
    session: { token: "new-active-token" },
  };
  const getSession = vi.fn()
    .mockResolvedValueOnce(current)
    .mockResolvedValueOnce(renewed);
  const responseHeaders = new Headers();
  responseHeaders.append("Set-Cookie", "better-auth.session_token=new-signed-cookie; Path=/; HttpOnly; SameSite=Lax");
  const verifyTOTP = vi.fn().mockResolvedValue({
    response: { token: current.session.token, user: current.user },
    headers: responseHeaders,
  });
  const limit = vi.fn()
    .mockResolvedValueOnce([{ id: "profile-1" }])
    .mockResolvedValueOnce([{ verified: false }]);
  const audit = vi.fn().mockResolvedValue(undefined);
  const db = {
    select: () => ({ from: () => ({ where: () => ({ limit }) }) }),
    insert: () => ({ values: audit }),
  } as unknown as Database;
  const auth = { api: { getSession, verifyTOTP } } as unknown as ReturnType<typeof createAdminAuth>;
  const headers = new Headers({ Cookie: "better-auth.session_token=old-signed-cookie; other=preserved" });
  return { auth, db, headers, responseHeaders, getSession, verifyTOTP, limit, audit };
}

describe("konfirmasi enrollment memakai sesi hasil rotasi", () => {
  it("mengabaikan token JSON lama, membaca cookie baru, dan meneruskan Set-Cookie", async () => {
    const ctx = setup();
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .resolves.toBe(ctx.responseHeaders);
    const verifiedHeaders = ctx.getSession.mock.calls[1][0].headers as Headers;
    expect(verifiedHeaders.get("cookie")).toContain("better-auth.session_token=new-signed-cookie");
    expect(verifiedHeaders.get("cookie")).toContain("other=preserved");
    expect(ctx.headers.get("cookie")).toContain("old-signed-cookie");
    expect(ctx.getSession.mock.calls[1][0].query).toEqual({ disableCookieCache: true });
    expect(recordSessionAssurance).toHaveBeenCalledExactlyOnceWith(ctx.db, {
      token: "new-active-token", userId: "user-1", method: "totp",
    });
    expect(ctx.audit).toHaveBeenCalledWith(expect.objectContaining({ action: "enroll-confirm" }));
  });

  it("menolak cookie baru yang tidak menghasilkan sesi aktif", async () => {
    const ctx = setup();
    ctx.getSession.mockReset()
      .mockResolvedValueOnce({ user: { id: "user-1" } })
      .mockResolvedValueOnce(null);
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .rejects.toThrow("Akses ditolak");
    expect(recordSessionAssurance).not.toHaveBeenCalled();
    expect(ctx.audit).not.toHaveBeenCalled();
  });

  it("menolak sesi hasil verifikasi milik identitas lain", async () => {
    const ctx = setup();
    ctx.getSession.mockReset()
      .mockResolvedValueOnce({ user: { id: "user-1" } })
      .mockResolvedValueOnce({ user: { id: "other-user" }, session: { token: "other-token" } });
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .rejects.toThrow("Akses ditolak");
    expect(recordSessionAssurance).not.toHaveBeenCalled();
    expect(ctx.audit).not.toHaveBeenCalled();
  });

  it("tidak memberikan assurance ketika verifikasi TOTP gagal", async () => {
    const ctx = setup();
    ctx.verifyTOTP.mockRejectedValue(new Error("Invalid test code"));
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .rejects.toThrow("Invalid test code");
    expect(ctx.getSession).toHaveBeenCalledTimes(1);
    expect(recordSessionAssurance).not.toHaveBeenCalled();
    expect(ctx.audit).not.toHaveBeenCalled();
  });

  it("flag faktor yang sudah aktif tidak dapat dipakai untuk melewati login MFA", async () => {
    const ctx = setup();
    ctx.limit.mockReset()
      .mockResolvedValueOnce([{ id: "profile-1" }])
      .mockResolvedValueOnce([{ verified: true }]);
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .rejects.toThrow("Akses ditolak");
    expect(ctx.verifyTOTP).not.toHaveBeenCalled();
    expect(recordSessionAssurance).not.toHaveBeenCalled();
  });

  it("kegagalan pencatatan assurance tidak dilaporkan sebagai enrollment sukses", async () => {
    const ctx = setup();
    recordSessionAssurance.mockRejectedValue(new Error("Assurance failed"));
    await expect(confirmTotpEnrollment(ctx.auth, ctx.db, ctx.headers, { code: "123456" }))
      .rejects.toThrow("Assurance failed");
    expect(ctx.audit).not.toHaveBeenCalled();
  });
});
