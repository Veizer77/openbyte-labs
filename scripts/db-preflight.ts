import { stdout } from "node:process";
import { inspectDatabase } from "@/db/preflight-inspect";
import { classifyDatabaseName, summarizePreflight } from "@/db/preflight-rules";
import { confirmTarget } from "./lib/confirm-target";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();

async function main(): Promise<void> {
  const allowProduction = process.argv.includes("--allow-production");
  const target = await confirmTarget("preflight", {
    label: allowProduction ? "Preflight produksi (read-only)" : "Preflight",
    keyword: allowProduction ? "PRODUCTION-READONLY" : undefined,
    expectedSource: allowProduction ? "direct" : undefined,
  });
  const kind = classifyDatabaseName(target.database, allowProduction);
  if (!kind) {
    throw new Error(
      "Preflight normal hanya untuk database *_test atau *_dev. Untuk target produksi, gunakan --allow-production dan konfirmasi PRODUCTION-READONLY.",
    );
  }
  if (kind === "production" && target.source !== "direct") {
    throw new Error("Preflight produksi memerlukan koneksi direct yang disetujui.");
  }
  const report = summarizePreflight(await inspectDatabase(target.uri), kind);
  for (const line of report.lines) stdout.write(`${line}\n`);
  if (!report.ok) process.exitCode = 1;
}

main().catch(() => {
  // Driver errors can echo host/user details; keep the output generic.
  process.stderr.write(
    "Preflight gagal. Periksa target, migrasi, dan konfigurasi tanpa membagikan kredensial.\n",
  );
  process.exitCode = 1;
});
