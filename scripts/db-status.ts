import postgres from "postgres";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { loadLocalEnv } from "./lib/load-local-env";
import { validateTestDatabase } from "@/db/test-target";
import { directDatabaseUri } from "@/db/target-selection";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";

loadLocalEnv();
async function inspect(label: string, uri: string) {
  const client = postgres(uri, { max: 1, prepare: false, connect_timeout: 10 });
  try {
    await client`SET default_transaction_read_only = on`;
    const migrations = await client<{ hash: string; created_at: string }[]>`SELECT hash, created_at::text FROM drizzle.__drizzle_migrations ORDER BY created_at`;
    const expected = readMigrationFiles({ migrationsFolder: "src/db/migrations" });
    const mismatches = migrations.filter((row) => !expected.some((item) => String(item.folderMillis) === row.created_at && item.hash === row.hash)).length;
    const [info] = await client`SELECT to_regclass('public.project_invoices') IS NOT NULL AS invoices, EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='publication_enabled') AS publication`;
    console.log(`${label}: ${migrations.length}/${expected.length} migrations; hash mismatches=${mismatches}; invoice=${info.invoices}; publication=${info.publication}`);
  } finally { await client.end({ timeout: 5 }); }
}
async function main() {
  if (process.env.TEST_DATABASE_URL) await inspect("isolated test", validateTestDatabase(process.env).uri);
  const uri = directDatabaseUri(process.env);
  if (uri && process.env.DATABASE_MIGRATION_TARGET) {
    const target = validateBootstrapTarget(uri, process.env.DATABASE_MIGRATION_TARGET);
    console.log(`application target classification: ${/[_-]dev$/i.test(target.database) ? "dev" : /[_-]test$/i.test(target.database) ? "test" : "requires production confirmation"}`);
    await inspect("application (read-only)", uri);
  }
}
main().catch(() => { console.error("Database status failed; details withheld to protect connection credentials."); process.exitCode = 1; });
