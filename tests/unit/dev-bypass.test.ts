import { describe, expect, it } from "vitest";
import { quickLoginEnabled } from "@/auth/dev-bypass";

describe("gerbang login cepat pengembangan", () => {
  it("mati bila operator tidak memilih ikut", () => {
    expect(quickLoginEnabled({ NODE_ENV: "development" })).toBe(false);
    expect(
      quickLoginEnabled({ NODE_ENV: "development", DEV_ADMIN_QUICK_LOGIN: "false" }),
    ).toBe(false);
    expect(
      quickLoginEnabled({ NODE_ENV: "development", DEV_ADMIN_QUICK_LOGIN: "" }),
    ).toBe(false);
  });

  it("menyala hanya di luar produksi dengan opt-in eksplisit", () => {
    expect(
      quickLoginEnabled({ NODE_ENV: "development", DEV_ADMIN_QUICK_LOGIN: "true" }),
    ).toBe(true);
    expect(
      quickLoginEnabled({ NODE_ENV: "test", DEV_ADMIN_QUICK_LOGIN: "true" }),
    ).toBe(true);
  });

  it("tidak pernah menyala di produksi, bahkan bila flag diset true", () => {
    expect(
      quickLoginEnabled({
        NODE_ENV: "production",
        DEV_ADMIN_QUICK_LOGIN: "true",
      }),
    ).toBe(false);
    expect(
      quickLoginEnabled({
        NODE_ENV: "production",
        DEV_ADMIN_QUICK_LOGIN: "1",
      }),
    ).toBe(false);
  });

  it("hanya menerima nilai 'true' literal, bukan string lain", () => {
    for (const value of ["1", "yes", "TRUE", "True", "on", " true"]) {
      expect(
        quickLoginEnabled({ NODE_ENV: "development", DEV_ADMIN_QUICK_LOGIN: value }),
      ).toBe(false);
    }
  });
});
