import { mkdtemp, rm, stat, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";
import { loadLocalEnv } from "./lib/load-local-env";
import { encryptBackup } from "./lib/backup-crypto";
import { postgresCommand } from "./lib/postgres-command";

loadLocalEnv();
async function main() {
  const uri = process.env.BACKUP_DATABASE_URL ?? "";
  validateBootstrapTarget(uri, process.env.BACKUP_DATABASE_TARGET ?? "");
  const account = process.env.BACKUP_R2_ACCOUNT_ID ?? "";
  const bucket = process.env.BACKUP_R2_BUCKET ?? "";
  const password = process.env.BACKUP_ENCRYPTION_KEY ?? "";
  if (!/^[a-f0-9]{32}$/i.test(account) || !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket) || password.length < 32 || !process.env.BACKUP_R2_ACCESS_KEY_ID || !process.env.BACKUP_R2_SECRET_ACCESS_KEY) throw new Error("Incomplete backup configuration.");
  if ([process.env.R2_BUCKET_PUBLIC, process.env.R2_BUCKET_STAGING, process.env.R2_BUCKET_PRIVATE].filter(Boolean).includes(bucket)) throw new Error("Backup bucket must be separate from application buckets.");
  const root = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Temp", "opencode") : tmpdir();
  await mkdir(root, { recursive: true });
  const folder = await mkdtemp(join(root, "openbyte-backup-"));
  try {
    const dump = join(folder, "database.dump");
    const encrypted = join(folder, "database.dump.enc");
    await postgresCommand(process.env.PG_DUMP_BIN || "pg_dump", ["--format=custom", "--no-owner", "--no-privileges", "--file", dump], uri);
    await encryptBackup(dump, encrypted, password);
    const client = new S3Client({ region: "auto", endpoint: `https://${account}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.BACKUP_R2_ACCESS_KEY_ID!, secretAccessKey: process.env.BACKUP_R2_SECRET_ACCESS_KEY! }, requestChecksumCalculation: "WHEN_REQUIRED" });
    const key = `database/${new Date().toISOString().replace(/[:.]/g, "-")}.dump.enc`;
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: createReadStream(encrypted), ContentLength: (await stat(encrypted)).size, ContentType: "application/octet-stream" }));
    client.destroy();
    console.log(`Encrypted PostgreSQL backup uploaded: ${key}`);
  } finally { await rm(folder, { recursive: true, force: true }); }
}
main().catch(() => { console.error("Backup failed. Check the approved target, PostgreSQL client and backup-only secrets. No credentials are logged."); process.exitCode = 1; });
