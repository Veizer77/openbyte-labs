import { describe, expect, it } from "vitest";
import { validateTestDatabase } from "@/db/test-target";

const safe = {
  TEST_DATABASE_URL:
    "postgres://user:secret@test-db.example.test/openbyte_test",
  TEST_DATABASE_TARGET: "test-db.example.test/openbyte_test",
  TEST_DATABASE_WRITE_CONFIRM: "I_CONFIRM_ISOLATED_TEST_DATABASE",
};

describe("guard database integrasi", () => {
  it("menerima hanya target test yang dikonfirmasi tanpa mengembalikan kredensial", () => {
    const result = validateTestDatabase(safe);
    expect(result).toEqual({
      uri: safe.TEST_DATABASE_URL,
      host: "test-db.example.test",
      database: "openbyte_test",
    });
    expect(JSON.stringify({ host: result.host, database: result.database }))
      .not.toContain("secret");
    expect(() =>
      validateTestDatabase({ ...safe, TEST_DATABASE_WRITE_CONFIRM: "" }),
    ).toThrow();
    expect(() =>
      validateTestDatabase({
        ...safe,
        TEST_DATABASE_TARGET: "other/openbyte_test",
      }),
    ).toThrow();
    expect(() =>
      validateTestDatabase({
        ...safe,
        TEST_DATABASE_URL: "postgres://u:p@test-db.example.test/openbyte_prod",
        TEST_DATABASE_TARGET: "test-db.example.test/openbyte_prod",
      }),
    ).toThrow();
    expect(() =>
      validateTestDatabase({
        ...safe,
        TEST_DATABASE_URL: "postgres://u:p@test-db.example.test/openbyte_test2",
        TEST_DATABASE_TARGET: "test-db.example.test/openbyte_test2",
      }),
    ).toThrow();
  });
  it("menolak target test yang sama dengan konfigurasi database aplikasi", () => {
    for (const key of [
      "DATABASE_URL",
      "DATABASE_URI",
      "DATABASE_URI_DIRECT",
      "DATABASE_DIRECT_URL",
    ]) {
      expect(() =>
        validateTestDatabase({ ...safe, [key]: safe.TEST_DATABASE_URL }),
      ).toThrow("Target test sama dengan konfigurasi database lain.");
    }
  });
  it("membandingkan host dan database, bukan string mentah", () => {
    expect(() =>
      validateTestDatabase({
        ...safe,
        DATABASE_URL:
          "postgresql://other:other@TEST-DB.example.test:5432/openbyte_test?sslmode=require",
      }),
    ).toThrow("Target test sama dengan konfigurasi database lain.");
  });
});
