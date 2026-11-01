/**
 * Pure rules for the read-only database preflight. No connection handling here so
 * the rules can be unit tested without a database.
 */

export const REQUIRED_SEED_MARKERS = [
  "availability-v1",
  "faq-v1",
  "calculator-v1",
  "packages-v1",
] as const;

/**
 * Kept next to the rules so a test can compare it against `src/db/schema/*` and
 * fail when a new table is added without updating preflight.
 */
export const EXPECTED_TABLES = [
  // Fondasi & autentikasi admin (Better Auth + kebijakan aplikasi)
  "site_settings",
  "auth_user",
  "auth_session",
  "auth_account",
  "auth_two_factor",
  "auth_verification",
  "admin_profiles",
  "admin_session_assurances",
  "admin_login_failures",
  "audit_logs",
  "rate_limits",
  "seed_state",
  // Konten website (Rilis 1)
  "media",
  "pages",
  "services",
  "technologies",
  "projects",
  "project_categories",
  "project_technologies",
  "testimonials",
  "content_versions",
  "faqs",
  "categories",
  "service_packages",
  "service_addons",
  // Kalkulator, inquiry, booking
  "calculator_groups",
  "calculator_items",
  "calculator_rules",
  "quote_requests",
  "inquiries",
  "availability_rules",
  "blocked_dates",
  "consultation_bookings",
  // Portal klien (Rilis 2)
  "step_templates",
  "private_files",
  "client_projects",
  "project_steps",
  "project_milestones",
  "payments",
  "project_updates",
  "project_documents",
  "project_invoices",
  "revision_requests",
  "project_comments",
  "project_approvals",
] as const;

export const COUNTED_TABLES = [
  "site_settings",
  "availability_rules",
  "faqs",
  "calculator_items",
  "service_packages",
  "service_addons",
  "consultation_bookings",
  "inquiries",
  "quote_requests",
  "auth_user",
] as const;

export type DatabaseKind = "test" | "dev" | "production";

/** Production targets require a separate explicit operator opt-in. */
export function classifyDatabaseName(
  name: string,
  allowProduction = false,
): DatabaseKind | null {
  if (/[_-]test$/i.test(name)) return "test";
  if (/[_-]dev$/i.test(name)) return "dev";
  return allowProduction ? "production" : null;
}

export interface PreflightFacts {
  database: string;
  role: string;
  version: string;
  expectedTables: readonly string[];
  existingTables: readonly string[];
  expectedMigrations: number;
  appliedMigrations: number | null;
  hasNoOverlap: boolean;
  seedMarkers: readonly string[];
  counts: Readonly<Record<string, number>>;
}

export interface PreflightReport {
  ok: boolean;
  lines: string[];
}

const fail = (message: string) => `GAGAL      ${message}`;
const pass = (message: string) => `OK         ${message}`;
const info = (message: string) => `INFO       ${message}`;
const warn = (message: string) => `PERINGATAN ${message}`;

function summarizeList(values: readonly string[]): string {
  const shown = values.slice(0, 6).join(", ");
  return values.length > 6 ? `${shown}, dan ${values.length - 6} lainnya` : shown;
}

export function summarizePreflight(
  facts: PreflightFacts,
  kind: DatabaseKind = "test",
): PreflightReport {
  const lines: string[] = [];
  let ok = true;
  const require = (condition: boolean, success: string, failure: string) => {
    if (condition) lines.push(pass(success));
    else {
      ok = false;
      lines.push(fail(failure));
    }
  };

  lines.push(info(`Database ${facts.database} sebagai ${facts.role}, PostgreSQL ${facts.version}`));

  const missing = facts.expectedTables.filter(
    (table) => !facts.existingTables.includes(table),
  );
  require(
    missing.length === 0,
    `${facts.expectedTables.length} tabel yang diharapkan tersedia`,
    `Tabel belum tersedia: ${summarizeList(missing)}`,
  );

  if (facts.appliedMigrations === null) {
    ok = false;
    lines.push(fail("Tabel riwayat migrasi Drizzle tidak ditemukan; database belum dimigrasi."));
  } else {
    require(
      facts.appliedMigrations === facts.expectedMigrations,
      `${facts.appliedMigrations} migrasi tercatat sesuai ${facts.expectedMigrations} berkas di jurnal`,
      `Migrasi tercatat ${facts.appliedMigrations}, jurnal berisi ${facts.expectedMigrations}.`,
    );
  }

  require(
    facts.hasNoOverlap,
    "Exclusion constraint booking aktif tersedia",
    "Constraint consultation_bookings_no_overlap tidak ditemukan.",
  );

  const missingMarkers = REQUIRED_SEED_MARKERS.filter(
    (marker) => !facts.seedMarkers.includes(marker),
  );
  require(
    missingMarkers.length === 0,
    "Marker seed tersedia",
    `Marker seed belum ada: ${summarizeList(missingMarkers)}.`,
  );

  require(
    facts.counts.site_settings === 1,
    "Settings singleton berisi tepat satu baris",
    `Baris Settings berjumlah ${facts.counts.site_settings ?? 0}; seed Settings belum berjalan.`,
  );

  for (const [table, minimum] of [
    ["availability_rules", 1],
    ["faqs", 1],
    ["calculator_items", 1],
    ["service_packages", 1],
  ] as const) {
    require(
      (facts.counts[table] ?? 0) >= minimum,
      `${table} berisi ${facts.counts[table] ?? 0} baris`,
      `${table} masih kosong; seed awal belum berjalan.`,
    );
  }

  const populated = ["consultation_bookings", "inquiries", "quote_requests"].filter(
    (table) => (facts.counts[table] ?? 0) > 0,
  );
  if (populated.length) {
    lines.push(
      warn(
        kind === "production"
          ? `Database berisi data operasional (${summarizeList(populated)}); pemeriksaan ini read-only dan tidak boleh diikuti tes integrasi.`
          : `Database berisi data operasional (${summarizeList(populated)}). Tes integrasi menulis dan menghapus data; pastikan ini bukan target bersama.`,
      ),
    );
  }
  if ((facts.counts.auth_user ?? 0) > 0) {
    lines.push(
      warn(
        kind === "production"
          ? "Akun admin sudah ada; pastikan akses owner dan MFA telah diverifikasi secara terpisah."
          : "Sudah ada akun admin pada database ini; jangan pakai database bersama untuk uji auth.",
      ),
    );
  }

  lines.push(
    ok
      ? pass(
          kind === "production"
            ? "Preflight read-only lulus. Database memenuhi pemeriksaan skema dan seed; tetap verifikasi backup, owner, dan konfigurasi operasional."
            : "Preflight lulus. Database siap untuk tes integrasi.",
        )
      : fail(
          kind === "production"
            ? "Preflight belum lulus; jangan aktifkan traffic produksi."
            : "Preflight belum lulus; jangan jalankan tes integrasi.",
        ),
  );
  return { ok, lines };
}
