import "server-only";
import { readFile } from "node:fs/promises";
import postgres from "postgres";
import {
  COUNTED_TABLES,
  EXPECTED_TABLES,
  type PreflightFacts,
} from "./preflight-rules";

async function expectedMigrationCount(): Promise<number> {
  const journal = JSON.parse(
    await readFile("src/db/migrations/meta/_journal.json", "utf8"),
  ) as { entries?: unknown[] };
  const count = journal.entries?.length ?? 0;
  if (!count) throw new Error("Jurnal migrasi kosong.");
  return count;
}

/**
 * Read-only inspection of a database. The session is set read-only first so a
 * mistake in this module cannot alter the inspected target.
 */
export async function inspectDatabase(uri: string): Promise<PreflightFacts> {
  const sql = postgres(uri, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
  });
  try {
    await sql`SET default_transaction_read_only = on`;
    const [identity] = await sql<
      { database: string; role: string; version: string }[]
    >`SELECT current_database() AS database, current_user AS role,
        current_setting('server_version') AS version`;
    const tables = await sql<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`;
    const existingTables = tables.map((row) => row.table_name);

    const [migrations] = await sql<{ exists: boolean }[]>`
      SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS exists`;
    let appliedMigrations: number | null = null;
    if (migrations.exists) {
      const [row] = await sql<{ value: string }[]>`
        SELECT count(*)::text AS value FROM drizzle.__drizzle_migrations`;
      appliedMigrations = Number(row.value);
    }

    // to_regclass avoids a hard error when the table itself is missing.
    const constraints = await sql<{ conname: string }[]>`
      SELECT conname FROM pg_constraint
      WHERE conrelid = to_regclass('public.consultation_bookings')
        AND contype = 'x' AND conname = 'consultation_bookings_no_overlap'`;

    const markers = existingTables.includes("seed_state")
      ? (
          await sql<{ key: string }[]>`SELECT key FROM seed_state ORDER BY key`
        ).map((row) => row.key)
      : [];

    const counts: Record<string, number> = {};
    for (const table of COUNTED_TABLES) {
      if (!existingTables.includes(table)) {
        counts[table] = 0;
        continue;
      }
      const [row] = await sql<{ value: string }[]>`
        SELECT count(*)::text AS value FROM ${sql(table)}`;
      counts[table] = Number(row.value);
    }

    return {
      database: identity.database,
      role: identity.role,
      version: identity.version,
      expectedTables: EXPECTED_TABLES,
      existingTables,
      expectedMigrations: await expectedMigrationCount(),
      appliedMigrations,
      hasNoOverlap: constraints.length === 1,
      seedMarkers: markers,
      counts,
    };
  } finally {
    await sql.end({ timeout: 5 });
  }
}
