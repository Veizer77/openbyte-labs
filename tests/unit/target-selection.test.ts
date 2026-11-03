import { describe, expect, it } from "vitest";
import { selectDatabaseTarget } from "@/db/target-selection";

describe("pemilihan target operator", () => {
  it("memprioritaskan database test hanya untuk seed dan preflight", () => {
    const env = {
      TEST_DATABASE_URL: "postgres://u:p@test-db/openbyte_test",
      TEST_DATABASE_TARGET: "test-db/openbyte_test",
      DATABASE_URI_DIRECT: "postgres://u:p@prod-db/openbyte",
      DATABASE_SEED_TARGET: "prod-db/openbyte",
    };
    for (const role of ["seed", "preflight"] as const) {
      expect(selectDatabaseTarget(env, role)).toEqual({
        uri: "postgres://u:p@test-db/openbyte_test",
        approvedTarget: "test-db/openbyte_test",
        source: "test",
      });
    }
  });
  it("bootstrap owner memakai direct meskipun URL test tersedia", () => {
    expect(
      selectDatabaseTarget(
        {
          TEST_DATABASE_URL: "postgres://u:p@test-db/openbyte_test",
          TEST_DATABASE_TARGET: "test-db/openbyte_test",
          DATABASE_URI_DIRECT: "postgres://u:p@dev-db/openbyte_labs_dev",
          OWNER_BOOTSTRAP_TARGET: "dev-db/openbyte_labs_dev",
        },
        "owner",
      ),
    ).toEqual({
      uri: "postgres://u:p@dev-db/openbyte_labs_dev",
      approvedTarget: "dev-db/openbyte_labs_dev",
      source: "direct",
    });
  });
  it("selalu memakai koneksi langsung untuk migrasi", () => {
    expect(
      selectDatabaseTarget(
        {
          TEST_DATABASE_URL: "postgres://u:p@test-db/openbyte_test",
          TEST_DATABASE_TARGET: "test-db/openbyte_test",
          DATABASE_URI_DIRECT: "postgres://u:p@dev-db/openbyte_dev",
          DATABASE_MIGRATION_TARGET: "dev-db/openbyte_dev",
        },
        "migrate",
      ),
    ).toEqual({
      uri: "postgres://u:p@dev-db/openbyte_dev",
      approvedTarget: "dev-db/openbyte_dev",
      source: "direct",
    });
  });
  it("memakai variabel konfirmasi sesuai peran dan tetap membaca nama lama", () => {
    const env = {
      DATABASE_DIRECT_URL: "postgres://u:p@dev-db/openbyte_dev",
      DATABASE_SEED_TARGET: "dev-db/openbyte_dev",
      OWNER_BOOTSTRAP_TARGET: "other/openbyte_dev",
    };
    expect(selectDatabaseTarget(env, "seed")).toMatchObject({
      approvedTarget: "dev-db/openbyte_dev",
      source: "direct",
    });
    expect(selectDatabaseTarget(env, "owner")).toMatchObject({
      approvedTarget: "other/openbyte_dev",
    });
  });
  it("tidak menebak target ketika konfigurasi kosong", () => {
    expect(selectDatabaseTarget({}, "preflight")).toEqual({
      uri: "",
      approvedTarget: "",
      source: "direct",
    });
  });
  it("preflight produksi tidak jatuh ke database test meski TEST_DATABASE_URL ada", () => {
    const env = {
      TEST_DATABASE_URL: "postgres://u:p@test-db/openbyte_test",
      TEST_DATABASE_TARGET: "test-db/openbyte_test",
      DATABASE_URI_DIRECT: "postgres://u:p@prod-db/openbyte_labs",
      DATABASE_PREFLIGHT_TARGET: "prod-db/openbyte_labs",
    };
    expect(selectDatabaseTarget(env, "preflight", { requireDirect: true })).toEqual({
      uri: "postgres://u:p@prod-db/openbyte_labs",
      approvedTarget: "prod-db/openbyte_labs",
      source: "direct",
    });
  });
});
