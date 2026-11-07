import { describe, expect, it } from "vitest";
import { monitoringEnvironment, monitoringEnvironmentForHost } from "@/lib/monitoring";

/**
 * Label environment Sentry pernah salah: build produksi yang dijalankan di
 * mesin Windows pemilik mengirim event dengan `environment: production`, lalu
 * terbaca sebagai insiden produksi padahal hanya smoke test lokal
 * (`OPENBYTE-LABS-3`). Tes ini menjaga agar label ditentukan eksplisit dan
 * hanya deployment Vercel yang dianggap produksi.
 */
describe("monitoringEnvironment", () => {
  it("menghormati SENTRY_ENVIRONMENT bila diisi eksplisit", () => {
    expect(
      monitoringEnvironment({ SENTRY_ENVIRONMENT: "staging", VERCEL: "1", VERCEL_ENV: "production" }),
    ).toBe("staging");
  });

  it("menandai deployment Vercel produksi sebagai production", () => {
    expect(monitoringEnvironment({ VERCEL: "1", VERCEL_ENV: "production", NODE_ENV: "production" })).toBe(
      "production",
    );
  });

  it("menandai preview Vercel sebagai preview, bukan production", () => {
    expect(monitoringEnvironment({ VERCEL: "1", VERCEL_ENV: "preview", NODE_ENV: "production" })).toBe(
      "preview",
    );
  });

  it("tidak menyebut production untuk build produksi di mesin lokal", () => {
    expect(monitoringEnvironment({ NODE_ENV: "production" })).toBe("development-local");
  });

  it("memakai development untuk proses non-produksi biasa", () => {
    expect(monitoringEnvironment({ NODE_ENV: "development" })).toBe("development");
  });

  it("memakai test saat NODE_ENV=test", () => {
    expect(monitoringEnvironment({ NODE_ENV: "test" })).toBe("test");
  });

  it("tidak pernah mengembalikan string kosong", () => {
    expect(monitoringEnvironment({}).length).toBeGreaterThan(0);
  });
});

describe("monitoringEnvironmentForHost", () => {
  it("menandai host vercel.app sebagai production", () => {
    expect(monitoringEnvironmentForHost("openbyte-labs.vercel.app")).toBe("production");
  });

  it("menandai localhost sebagai development-local walau build produksi", () => {
    expect(monitoringEnvironmentForHost("localhost")).toBe("development-local");
    expect(monitoringEnvironmentForHost("127.0.0.1")).toBe("development-local");
  });

  it("menandai host tak dikenal sebagai development-local, bukan production", () => {
    expect(monitoringEnvironmentForHost(undefined)).toBe("development-local");
    expect(monitoringEnvironmentForHost("WIN-HRI5K8PH2V3")).toBe("development-local");
  });
});
