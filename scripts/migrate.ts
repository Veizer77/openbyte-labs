import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { stdout } from "node:process";
import { confirmTarget } from "./lib/confirm-target";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();

async function main(): Promise<void> {
  const target = await confirmTarget("migrate", {
    label: "Migrasi",
    keyword: "MIGRATE",
  });

  const binary = join(
    dirname(createRequire(import.meta.url).resolve("drizzle-kit")),
    "bin.cjs",
  );
  const child = spawn(
    process.execPath,
    [binary, "migrate", "--config=drizzle.migrate.config.ts"],
    {
      env: { ...process.env, DATABASE_DIRECT_URL: target.uri },
      stdio: "ignore",
    },
  );
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", resolve);
  });
  if (exitCode !== 0) throw new Error("Migrasi gagal.");
  stdout.write(
    "Migrasi selesai. Jalankan preflight sebelum memakai target tersebut.\n",
  );
}

main().catch(() => {
  // Driver diagnostics can contain connection details; never echo them here.
  process.stderr.write(
    "Migrasi gagal atau dibatalkan. Periksa target dan konfigurasi tanpa membagikan kredensial.\n",
  );
  process.exitCode = 1;
});
