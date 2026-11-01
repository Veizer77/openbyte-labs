import { mkdtemp, rm, mkdir, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import postgres from "postgres";
import { validateTestDatabase } from "@/db/test-target";
import { loadLocalEnv } from "./lib/load-local-env";
import { decryptBackup } from "./lib/backup-crypto";
import { postgresCommand } from "./lib/postgres-command";
import { readMigrationFiles } from "drizzle-orm/migrator";

loadLocalEnv();
async function main() {
  if (!process.argv.includes("--confirm-keyword=RESTORE-EMPTY-TEST")) throw new Error("Explicit restore confirmation required.");
  const uri = process.env.RESTORE_DATABASE_URL ?? "";
  const target = validateTestDatabase({ ...process.env, TEST_DATABASE_URL: uri, TEST_DATABASE_TARGET: process.env.RESTORE_DATABASE_TARGET, TEST_DATABASE_WRITE_CONFIRM: process.env.RESTORE_WRITE_CONFIRM });
  if (process.env.TEST_DATABASE_URL) {
    const active = new URL(process.env.TEST_DATABASE_URL);
    const restore = new URL(uri);
    if (active.hostname === restore.hostname && active.pathname === restore.pathname) throw new Error("Restore requires a separate empty test database.");
  }
  const source = resolve(process.argv.find((arg) => arg.startsWith("--file="))?.slice(7) ?? "");
  await access(source);
  const client = postgres(target.uri, { max: 1, prepare: false, connect_timeout: 10 });
  const root = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Temp", "opencode") : tmpdir();
  await mkdir(root, { recursive: true });
  const folder = await mkdtemp(join(root, "openbyte-restore-"));
  try {
    const [existing] = await client`SELECT count(*)::int AS total FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema') AND table_type='BASE TABLE'`;
    if (existing.total !== 0) throw new Error("Restore target is not empty; refusing to overwrite it.");
    const dump = join(folder, "verified.dump");
    await decryptBackup(source, dump, process.env.BACKUP_ENCRYPTION_KEY ?? "");
    await postgresCommand(process.env.PG_RESTORE_BIN || "pg_restore", ["--exit-on-error", "--single-transaction", "--no-owner", "--no-privileges", "--dbname", target.database, dump], uri);
    const migrations = await client<{ hash: string; created_at: string }[]>`SELECT hash, created_at::text FROM drizzle.__drizzle_migrations`;
    const expected = readMigrationFiles({ migrationsFolder: "src/db/migrations" });
    if (migrations.length !== expected.length || migrations.some((row) => !expected.some((item) => row.hash === item.hash && row.created_at === String(item.folderMillis)))) throw new Error("Restored migration journal differs from this release.");
    const [constraint] = await client`SELECT count(*)::int AS total FROM pg_constraint WHERE conrelid=to_regclass('public.consultation_bookings') AND conname='consultation_bookings_no_overlap' AND contype='x'`;
    if (constraint.total !== 1) throw new Error("Booking exclusion constraint missing after restore.");
    console.log(`Restore drill passed: ${migrations.length} migration hashes and booking exclusion constraint verified. Keep the isolated target for additional data checks; no cleanup database was dropped.`);
  } finally { await client.end({ timeout: 5 }); await rm(folder, { recursive: true, force: true }); }
}
main().catch(() => { console.error("Restore drill failed or was refused. Use an empty, separately approved test database and an authentic encrypted backup. Details withheld to protect secrets."); process.exitCode = 1; });
