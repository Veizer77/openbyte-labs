import { describe, expect, it } from "vitest";
import {
  classifyDatabaseName,
  summarizePreflight,
  type PreflightFacts,
} from "@/db/preflight-rules";

const facts = (overrides: Partial<PreflightFacts> = {}): PreflightFacts => ({
  database: "openbyte_test",
  role: "neondb_owner",
  version: "17.2",
  expectedTables: ["site_settings", "audit_logs", "consultation_bookings"],
  existingTables: ["site_settings", "audit_logs", "consultation_bookings"],
  expectedMigrations: 14,
  appliedMigrations: 14,
  hasNoOverlap: true,
  seedMarkers: ["availability-v1", "faq-v1", "calculator-v1", "packages-v1"],
  counts: {
    site_settings: 1,
    availability_rules: 20,
    faqs: 10,
    calculator_items: 13,
    service_packages: 3,
    service_addons: 4,
    consultation_bookings: 0,
    inquiries: 0,
    quote_requests: 0,
    auth_user: 0,
  },
  ...overrides,
});

describe("preflight database", () => {
  it("hanya mengizinkan nama database test atau dev", () => {
    expect(classifyDatabaseName("openbyte_test")).toBe("test");
    expect(classifyDatabaseName("openbyte-dev")).toBe("dev");
    for (const name of ["openbyte", "neondb", "production", "openbyte_test_backup"]) {
      expect(classifyDatabaseName(name)).toBeNull();
    }
  });
  it("lulus hanya bila skema, migrasi, constraint, marker, dan seed lengkap", () => {
    const report = summarizePreflight(facts());
    expect(report.ok).toBe(true);
    expect(report.lines.some((line) => line.startsWith("OK"))).toBe(true);
  });
  it("gagal bila tabel hilang dan menyebut nama tabel yang belum ada", () => {
    const report = summarizePreflight(facts({ existingTables: ["site_settings"] }));
    expect(report.ok).toBe(false);
    expect(report.lines.join("\n")).toContain("audit_logs");
    expect(report.lines.join("\n")).toContain("consultation_bookings");
  });
  it("gagal bila migrasi belum lengkap atau riwayat migrasi tidak ada", () => {
    expect(summarizePreflight(facts({ appliedMigrations: 13 })).ok).toBe(false);
    expect(summarizePreflight(facts({ appliedMigrations: null })).ok).toBe(false);
    expect(summarizePreflight(facts({ appliedMigrations: 15 })).ok).toBe(false);
  });
  it("gagal bila exclusion constraint atau seed belum ada", () => {
    expect(summarizePreflight(facts({ hasNoOverlap: false })).ok).toBe(false);
    const report = summarizePreflight(
      facts({ seedMarkers: ["faq-v1"], counts: { ...facts().counts, faqs: 0, site_settings: 0 } }),
    );
    expect(report.ok).toBe(false);
    const text = report.lines.join("\n");
    expect(text).toContain("availability-v1");
    expect(text).toContain("calculator-v1");
    expect(text).toContain("packages-v1");
    expect(text).toContain("Settings");
    expect(text).toContain("faqs");
  });
  it("memberi peringatan bila database berisi data operasional atau akun admin", () => {
    const report = summarizePreflight(
      facts({
        counts: { ...facts().counts, consultation_bookings: 3, auth_user: 1 },
      }),
    );
    expect(report.ok).toBe(true);
    expect(report.lines.filter((line) => line.startsWith("PERINGATAN"))).toHaveLength(2);
  });
});
