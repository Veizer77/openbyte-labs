import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { confirmTarget } from "../../scripts/lib/confirm-target";

afterEach(() => vi.unstubAllEnvs());
beforeEach(() => {
  for (const key of [
    "DATABASE_URI_DIRECT",
    "DATABASE_DIRECT_URL",
    "TEST_DATABASE_URL",
    "OWNER_BOOTSTRAP_TARGET",
  ]) vi.stubEnv(key, "");
});

describe("guard target bootstrap owner", () => {
  it("tidak fallback ke URL test ketika koneksi direct belum diatur", async () => {
    vi.stubEnv("TEST_DATABASE_URL", "postgres://user:pass@test-db/openbyte_r1_test");
    vi.stubEnv("TEST_DATABASE_TARGET", "test-db/openbyte_r1_test");

    await expect(
      confirmTarget("owner", {
        label: "Bootstrap owner",
        expectedSource: "direct",
        expectedHostname: "ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech",
        expectedDatabase: "openbyte_labs_dev",
      }),
    ).rejects.toThrow("Koneksi database belum diatur.");
  });

  it("menolak database direct selain openbyte_labs_dev", async () => {
    vi.stubEnv(
      "DATABASE_URI_DIRECT",
      "postgres://user:pass@ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech/openbyte_labs_test",
    );
    vi.stubEnv(
      "OWNER_BOOTSTRAP_TARGET",
      "ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech/openbyte_labs_test",
    );

    await expect(
      confirmTarget("owner", {
        label: "Bootstrap owner",
        expectedSource: "direct",
        expectedHostname: "ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech",
        expectedDatabase: "openbyte_labs_dev",
      }),
    ).rejects.toThrow(
      "Bootstrap owner hanya diizinkan pada database openbyte_labs_dev.",
    );
  });

  it("menolak host lain meskipun nama database sama", async () => {
    vi.stubEnv(
      "DATABASE_URI_DIRECT",
      "postgres://user:pass@other-db/openbyte_labs_dev",
    );
    vi.stubEnv("OWNER_BOOTSTRAP_TARGET", "other-db/openbyte_labs_dev");

    await expect(
      confirmTarget("owner", {
        label: "Bootstrap owner",
        expectedSource: "direct",
        expectedHostname: "ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech",
        expectedDatabase: "openbyte_labs_dev",
      }),
    ).rejects.toThrow(
      "Bootstrap owner hanya diizinkan pada host yang disetujui.",
    );
  });

  it("menjelaskan variabel konfirmasi yang belum diatur", async () => {
    vi.stubEnv("DATABASE_URI_DIRECT", "postgres://user:pass@dev-db/openbyte_labs_dev");
    await expect(
      confirmTarget("owner", { label: "Bootstrap owner" }),
    ).rejects.toThrow("OWNER_BOOTSTRAP_TARGET belum diatur.");
  });

  it("tidak membocorkan URL ketika validasi target gagal", async () => {
    vi.stubEnv("DATABASE_URI_DIRECT", "postgres://user:secret-password@dev-db/openbyte_labs_dev");
    vi.stubEnv("OWNER_BOOTSTRAP_TARGET", "other-db/openbyte_labs_dev");
    await expect(
      confirmTarget("owner", { label: "Bootstrap owner" }),
    ).rejects.toThrow(
      "URL database tidak valid atau tidak cocok dengan target yang dikonfirmasi.",
    );
  });
});
