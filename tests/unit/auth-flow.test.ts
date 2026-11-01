import { describe, expect, it, vi } from "vitest";
import { convertSetCookieToCookie } from "better-auth/test";
import { symmetricDecrypt } from "better-auth/crypto";
import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import type { Database } from "@/db/connection";

const { memory } = vi.hoisted(() => ({
  memory: {
    user: [],
    session: [],
    account: [],
    verification: [],
    twoFactor: [],
  } as Record<string, Record<string, unknown>[]>,
}));

// Exercise Better Auth itself against its in-memory adapter, never a real database.
vi.mock("better-auth/adapters/drizzle", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return { drizzleAdapter: () => memoryAdapter(memory) };
});

import { createAdminAuth } from "@/auth/configuration";
import {
  confirmTotpEnrollment,
  startTotpEnrollment,
} from "@/auth/enroll-totp";
import {
  completeAdminRecoveryCode,
  completeAdminTotp,
} from "@/auth/complete-totp";
import { requireAdminSession } from "@/auth/require-admin";

describe("Better Auth con adapter in-memory", () => {
  it("menutup signup, mengaktifkan TOTP, dan tetap menolak sesi tanpa assurance", async () => {
    for (const rows of Object.values(memory)) rows.length = 0;
    const db = {} as Database;
    const auth = createAdminAuth(db, {
      baseURL: "http://localhost:3000",
      secret: "test-only-secret-value-with-enough-length-123456789",
      production: false,
    });
    const response = await auth.handler(
      new Request("http://localhost:3000/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify({
          name: "Test",
          email: "owner@example.test",
          password: "temporary-test-password-123",
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(memory.user).toHaveLength(0);

    // Direct creation is confined to this test; no application signup route is enabled.
    const context = await auth.$context;
    const password = "temporary-test-password-123";
    const user = await context.internalAdapter.createUser(
      { name: "Test", email: "owner@example.test", emailVerified: false },
      { method: "email-password" },
    );
    await context.internalAdapter.linkAccount({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: await context.password.hash(password),
    });
    await expect(
      auth.api.signInEmail({
        body: { email: user.email, password: "wrong-password-123" },
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
    const firstLogin = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    const headers = convertSetCookieToCookie(firstLogin.headers);
    const otherLogin = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    const otherHeaders = convertSetCookieToCookie(otherLogin.headers);
    expect(
      (await auth.api.getSession({ headers }))?.user.twoFactorEnabled,
    ).toBe(false);
    await expect(requireAdminSession(auth, db, headers)).rejects.toThrow(
      "Akses ditolak",
    );

    const enabled = await auth.api.enableTwoFactor({
      headers,
      body: { password },
      returnHeaders: true,
    });
    expect(enabled.response.method).toBe("totp");
    const recoveryCode =
      "backupCodes" in enabled.response
        ? enabled.response.backupCodes?.[0]
        : undefined;
    expect(recoveryCode).toBeTruthy();
    expect(
      (await auth.api.getSession({ headers }))?.user.twoFactorEnabled,
    ).toBe(false);
    const encrypted = memory.twoFactor[0]?.secret;
    expect(typeof encrypted).toBe("string");
    const secret = await symmetricDecrypt({
      key: context.secretConfig,
      data: encrypted as string,
    });
    const { code } = await auth.api.generateTOTP({ body: { secret } });
    const verified = await auth.api.verifyTOTP({
      headers,
      body: { code },
      returnHeaders: true,
    });
    const verifiedHeaders = convertSetCookieToCookie(verified.headers);
    expect(
      (await auth.api.getSession({ headers: verifiedHeaders }))?.user
        .twoFactorEnabled,
    ).toBe(true);
    // No assurance writer exists yet, so the guard must still refuse this session.
    const emptyDb = {
      select: () => ({
        from: () => ({
          innerJoin: () => ({ where: () => ({ limit: async () => [] }) }),
        }),
      }),
    } as unknown as Database;
    await expect(
      requireAdminSession(auth, emptyDb, verifiedHeaders),
    ).rejects.toThrow("Akses ditolak");
    // Another password-only session may survive enrollment, so the account flag is insufficient.
    expect(
      (await auth.api.getSession({ headers: otherHeaders }))?.user
        .twoFactorEnabled,
    ).toBe(true);
    await expect(
      requireAdminSession(auth, emptyDb, otherHeaders),
    ).rejects.toThrow("Akses ditolak");

    const challenge = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    expect(challenge.response).toMatchObject({ twoFactorRedirect: true });
    const challengeHeaders = convertSetCookieToCookie(challenge.headers);
    expect(await auth.api.getSession({ headers: challengeHeaders })).toBeNull();
    const insertValues = vi.fn((value: { sessionId: string }) => ({
      onConflictDoNothing: () => ({
        returning: async () => [{ sessionId: value.sessionId }],
      }),
    }));
    const tx = {
      select: () => ({
        from: () => ({
          innerJoin: () => ({
            innerJoin: () => ({
              innerJoin: () => ({
                where: () => ({
                  for: async () => {
                    const session = memory.session.at(-1)!;
                    return [
                      {
                        sessionId: session.id,
                        profileId: "profile-1",
                        expiresAt: session.expiresAt,
                      },
                    ];
                  },
                }),
              }),
            }),
          }),
        }),
      }),
      insert: () => ({ values: insertValues }),
    };
    const assuranceDb = {
      transaction: (callback: (value: typeof tx) => Promise<unknown>) =>
        callback(tx),
    } as unknown as Database;
    await expect(
      completeAdminTotp(auth, assuranceDb, otherHeaders, code),
    ).rejects.toThrow("Akses ditolak");
    const wrongCode = code === "000000" ? "000001" : "000000";
    await expect(
      completeAdminTotp(auth, assuranceDb, challengeHeaders, wrongCode),
    ).rejects.toThrow();
    expect(insertValues).not.toHaveBeenCalled();
    const completed = await completeAdminTotp(
      auth,
      assuranceDb,
      challengeHeaders,
      code,
    );
    const completedHeaders = convertSetCookieToCookie(completed);
    expect(
      (await auth.api.getSession({ headers: completedHeaders }))?.user
        .twoFactorEnabled,
    ).toBe(true);
    expect(insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ adminProfileId: "profile-1", method: "totp" }),
    );
    await expect(
      requireAdminSession(auth, emptyDb, completedHeaders),
    ).rejects.toThrow("Akses ditolak");

    const recoveryChallenge = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    const recoveryHeaders = convertSetCookieToCookie(recoveryChallenge.headers);
    const recoveryResult = await completeAdminRecoveryCode(
      auth,
      assuranceDb,
      recoveryHeaders,
      recoveryCode,
    );
    expect(
      (
        await auth.api.getSession({
          headers: convertSetCookieToCookie(recoveryResult),
        })
      )?.user.twoFactorEnabled,
    ).toBe(true);
    expect(insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        adminProfileId: "profile-1",
        method: "recovery_code",
      }),
    );
    expect(insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "login-recovery",
        actorId: "profile-1",
      }),
    );
    const replayChallenge = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    await expect(
      completeAdminRecoveryCode(
        auth,
        assuranceDb,
        convertSetCookieToCookie(replayChallenge.headers),
        recoveryCode,
      ),
    ).rejects.toThrow();
  });

  it("menyelesaikan enrollment dengan sesi hasil verifikasi dan cookie respons", async () => {
    for (const rows of Object.values(memory)) rows.length = 0;
    const db = {} as Database;
    const auth = createAdminAuth(db, {
      baseURL: "http://localhost:3000",
      secret: "test-only-secret-value-with-enough-length-123456789",
      production: false,
    });
    const context = await auth.$context;
    const password = "temporary-enrollment-password-123";
    const user = await context.internalAdapter.createUser(
      { name: "Enrollment", email: "enrollment@example.test", emailVerified: false },
      { method: "email-password" },
    );
    await context.internalAdapter.linkAccount({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: await context.password.hash(password),
    });
    const login = await auth.api.signInEmail({
      body: { email: user.email, password },
      returnHeaders: true,
    });
    const requestHeaders = convertSetCookieToCookie(login.headers);

    const selectResults: unknown[][] = [
      [{ id: "profile-enrollment" }],
      [],
      [{ id: "profile-enrollment" }],
      [{ verified: false }],
    ];
    const assuranceValues: Record<string, unknown>[] = [];
    const auditValues: Record<string, unknown>[] = [];
    const query = {
      innerJoin: () => query,
      where: (condition: SQL) => ({
        for: async () => {
          const { params } = new PgDialect().sqlToQuery(condition);
          const session = memory.session.find((row) => params.includes(row.token));
          return session ? [{
            sessionId: session.id,
            profileId: "profile-enrollment",
            expiresAt: session.expiresAt,
          }] : [];
        },
      }),
    };
    const tx = {
      select: () => ({ from: () => query }),
      insert: () => ({
        values: (value: Record<string, unknown>) => {
          assuranceValues.push(value);
          return {
            onConflictDoNothing: () => ({
              returning: async () => [{ sessionId: memory.session.at(-1)!.id }],
            }),
          };
        },
      }),
    };
    const enrollmentDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: async () => selectResults.shift() ?? [],
          }),
        }),
      }),
      insert: () => ({
        values: async (value: Record<string, unknown>) => {
          auditValues.push(value);
        },
      }),
      transaction: async (callback: (value: typeof tx) => Promise<unknown>) =>
        callback(tx),
    } as unknown as Database;

    const enrollment = await startTotpEnrollment(
      auth,
      enrollmentDb,
      requestHeaders,
      { password },
    );
    expect(enrollment.totpURI).toContain("otpauth://totp/");
    const encryptedSecret = memory.twoFactor.at(-1)?.secret;
    expect(typeof encryptedSecret).toBe("string");
    const secret = await symmetricDecrypt({
      key: context.secretConfig,
      data: encryptedSecret as string,
    });
    const { code } = await auth.api.generateTOTP({ body: { secret } });

    const responseHeaders = await confirmTotpEnrollment(
      auth,
      enrollmentDb,
      requestHeaders,
      { code },
    );
    const refreshedRequestHeaders = convertSetCookieToCookie(responseHeaders);
    const verifiedSession = await auth.api.getSession({
      headers: refreshedRequestHeaders,
      query: { disableCookieCache: true },
    });

    expect(verifiedSession?.user.twoFactorEnabled).toBe(true);
    expect(memory.session).toHaveLength(1);
    expect(memory.session[0].token).not.toBe(login.response.token);
    expect(verifiedSession?.session.id).toBe(memory.session[0].id);
    expect(assuranceValues).toEqual([
      expect.objectContaining({
        sessionId: verifiedSession?.session.id,
        adminProfileId: "profile-enrollment",
        method: "totp",
      }),
    ]);
    expect(auditValues).toEqual([
      expect.objectContaining({ action: "enroll-start" }),
      expect.objectContaining({ action: "enroll-confirm" }),
    ]);
  });
});
