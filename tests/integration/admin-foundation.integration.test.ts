import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAdminLoginStore } from "@/db/admin-login-store";
import type { Database } from "@/db/connection";
import { createOwnerBootstrapStore } from "@/db/owner-bootstrap-store";
import { bootstrapInitialOwner } from "@/auth/owner-bootstrap";
import { signInAdmin } from "@/auth/admin-login";
import { requireTestDatabaseUri } from "./target";

let sql: postgres.Sql;
let db: Database;

beforeAll(async () => {
  sql = postgres(requireTestDatabaseUri(process.env), {
    max: 8,
    prepare: false,
    connect_timeout: 10,
  });
  db = drizzle(sql);
  const owners = await sql`
    SELECT id FROM admin_profiles WHERE role = 'owner' LIMIT 1`;
  if (owners.length) {
    throw new Error(
      "Database test sudah berisi owner. Kosongkan target test sebelum menjalankan tes ini.",
    );
  }
});
afterAll(async () => {
  await sql?.end({ timeout: 5 });
});

describe("fondasi admin pada PostgreSQL", () => {
  it("membuat owner sekali saja dan menggagalkan percobaan kedua", async () => {
    const store = createOwnerBootstrapStore(db);
    const email = `owner-${randomUUID()}@example.test`;
    const profileId = await bootstrapInitialOwner(store, {
      name: "Integration Owner",
      email,
      password: "integration-password-123",
    });
    try {
      const [profile] = await sql`
        SELECT role, auth_user_id FROM admin_profiles WHERE id = ${profileId}`;
      expect(profile.role).toBe("owner");
      const [account] = await sql`
        SELECT password FROM auth_account WHERE user_id = ${profile.auth_user_id}`;
      expect(account.password).not.toContain("integration-password-123");
      const audit = await sql`
        SELECT action, collection FROM audit_logs WHERE doc_id = ${profileId}`;
      expect(audit).toHaveLength(1);
      // Second bootstrap must fail because the marker and owner already exist.
      await expect(
        bootstrapInitialOwner(store, {
          name: "Second Owner",
          email: `second-${randomUUID()}@example.test`,
          password: "integration-password-456",
        }),
      ).rejects.toThrow("Bootstrap owner sudah dilakukan");
    } finally {
      await sql`DELETE FROM audit_logs WHERE doc_id = ${profileId}`;
      await sql`DELETE FROM admin_profiles WHERE id = ${profileId}`;
      await sql`DELETE FROM auth_account WHERE user_id IN
        (SELECT id FROM auth_user WHERE email = ${email})`;
      await sql`DELETE FROM auth_user WHERE email = ${email}`;
      // Test-only cleanup so this suite can be rerun on a disposable database.
      await sql`DELETE FROM seed_state WHERE key = 'owner-bootstrap-v1'`;
    }
  });

  it("menyerialkan percobaan login sehingga hanya lima verifikasi berjalan", async () => {
    const store = createAdminLoginStore(db);
    const email = `login-${randomUUID()}@example.test`;
    const secret = "integration-login-secret-for-hmac-32";
    const input = { email, password: "integration-password-123" };
    const { createHmac } = await import("node:crypto");
    const keyHash = createHmac("sha256", secret)
      .update(`admin-login:v1:${email.toLowerCase()}`, "utf8")
      .digest("hex");
    let attempts = 0;
    try {
      const results = await Promise.allSettled(
        Array.from({ length: 10 }, () =>
          signInAdmin(store, input, secret, async () => {
            attempts += 1;
            throw { statusCode: 401 };
          }),
        ),
      );
      expect(results.every((result) => result.status === "rejected")).toBe(
        true,
      );
      expect(attempts).toBe(5);
      const [failure] = await sql`
        SELECT count(*)::int AS value FROM admin_login_failures WHERE key_hash = ${keyHash}`;
      expect(failure.value).toBe(5);
      const [lock] = await sql`
        SELECT locked_until FROM rate_limits
        WHERE scope = 'admin-login' AND key_hash = ${keyHash}`;
      expect(lock.locked_until).not.toBeNull();

      // While locked, even a correct password is not verified.
      let verified = 0;
      await expect(
        signInAdmin(store, input, secret, async () => {
          verified += 1;
          return { headers: new Headers(), requiresTwoFactor: true };
        }),
      ).rejects.toThrow("Login tidak berhasil");
      expect(verified).toBe(0);
    } finally {
      await sql`DELETE FROM admin_login_failures WHERE key_hash = ${keyHash}`;
      await sql`DELETE FROM rate_limits
        WHERE scope = 'admin-login' AND key_hash = ${keyHash}`;
    }
  });
});
