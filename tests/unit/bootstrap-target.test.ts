import { describe, expect, it } from "vitest";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";

describe("konfirmasi target bootstrap", () => {
  it("hanya menerima host dan database yang cocok tanpa mengembalikan kredensial", () => {
    expect(
      validateBootstrapTarget(
        "postgresql://user:password@db.example.test:5432/openbyte_test",
        "db.example.test:5432/openbyte_test",
      ),
    ).toEqual({ host: "db.example.test:5432", database: "openbyte_test" });
  });
  it("menolak target berbeda, nama database tidak sah, dan protokol lain", () => {
    for (const [uri, target] of [
      [
        "postgres://user:password@db.example.test/openbyte_prod",
        "db.example.test/openbyte_test",
      ],
      ["postgres://user:password@db.example.test/", "db.example.test/"],
      [
        "postgres://user:password@db.example.test/name%2Fother",
        "db.example.test/name/other",
      ],
      [
        "https://db.example.test/openbyte_test",
        "db.example.test/openbyte_test",
      ],
    ])
      expect(() => validateBootstrapTarget(uri, target)).toThrow();
  });
});
