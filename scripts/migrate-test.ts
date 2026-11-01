import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { validateTestDatabase } from "@/db/test-target";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();
async function main() {
  const target = validateTestDatabase(process.env);
  if (!process.argv.includes("--confirm-keyword=MIGRATE-TEST")) throw new Error("Explicit test migration confirmation required.");
  const client = postgres(target.uri, { max: 1, prepare: false, connect_timeout: 10 });
  try {
    const [existing] = await client`SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS present`;
    if (existing.present) {
      const applied = await client<{ hash: string; created_at: string }[]>`SELECT hash, created_at::text FROM drizzle.__drizzle_migrations`;
      const expected = readMigrationFiles({ migrationsFolder: "src/db/migrations" });
      if (applied.some((row) => !expected.some((item) => item.hash === row.hash && String(item.folderMillis) === row.created_at))) throw new Error("Historical migration mismatch.");
    }
    await migrate(drizzle(client), { migrationsFolder: "src/db/migrations" });
    console.log("Isolated test database migrated successfully.");
  } finally { await client.end({ timeout: 5 }); }
}
main().catch(() => { console.error("Test migration stopped. Check target confirmation and historical migrations without sharing credentials."); process.exitCode = 1; });
