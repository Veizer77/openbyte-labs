import { mkdir, open } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();

/**
 * Downloads one encrypted backup from the backup-only bucket into a private
 * temporary folder and prints only the resulting path. Credentials are read from
 * the environment and never logged.
 */
async function main() {
  const account = process.env.BACKUP_R2_ACCOUNT_ID ?? "";
  const bucket = process.env.BACKUP_R2_BUCKET ?? "";
  const accessKeyId = process.env.BACKUP_R2_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.BACKUP_R2_SECRET_ACCESS_KEY ?? "";
  if (!/^[a-f0-9]{32}$/i.test(account) || !bucket || !accessKeyId || !secretAccessKey)
    throw new Error("Incomplete backup download configuration.");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${account}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });

  try {
    const requested = (process.env.BACKUP_KEY ?? "").trim();
    let key = requested;
    if (!key) {
      const listed = await client.send(
        new ListObjectsV2Command({ Bucket: bucket, Prefix: "database/" }),
      );
      const candidates = (listed.Contents ?? [])
        .filter((item) => item.Key?.endsWith(".dump.enc"))
        .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0));
      if (candidates.length === 0) throw new Error("No encrypted backup found in the bucket.");
      key = candidates[0].Key!;
    }
    if (!key.startsWith("database/") || !key.endsWith(".dump.enc"))
      throw new Error("Requested backup key is not an encrypted database backup.");

    const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!object.Body) throw new Error("Backup object has no body.");

    const folder = join(process.env.RUNNER_TEMP || tmpdir(), "openbyte-restore-download");
    await mkdir(folder, { recursive: true, mode: 0o700 });
    const destination = join(folder, basename(key));
    const handle = await open(destination, "w", 0o600);
    try {
      for await (const chunk of object.Body as AsyncIterable<Uint8Array>) await handle.write(chunk);
    } finally {
      await handle.close();
    }
    console.log(destination);
  } finally {
    client.destroy();
  }
}

main().catch(() => {
  console.error(
    "Backup download failed. Check the backup-only bucket, keys and network access. No credentials are logged.",
  );
  process.exitCode = 1;
});
