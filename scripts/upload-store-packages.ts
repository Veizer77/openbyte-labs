/**
 * Mengemas kelima proyek sumber menjadi arsip `.zip`, mengunggahnya ke bucket
 * R2 privat, lalu melampirkannya ke produk Digital Store sebagai
 * `digital_products.private_file_id` + `package_size_bytes`.
 *
 * Kenapa script ini ada: tanpa `private_file_id`, `verifyAndConsumeStoreDownload`
 * menolak unduhan dengan "Paket .zip produk belum tersedia." — jadi kelima
 * produk tidak bisa diunduh pembeli walau sudah dibayar.
 *
 * ZIP dibuat sendiri memakai `node:zlib` (deflateRaw) supaya tidak menambah
 * dependensi produksi hanya untuk kebutuhan operasional ini. Arsip bersifat
 * deterministik: entri diurutkan, timestamp dinormalkan, sehingga hash isinya
 * stabil antar-jalan.
 *
 * Direktori proyek sumber diperlakukan read-only: script hanya membaca berkas,
 * tidak pernah menulis ke dalamnya.
 *
 * Jalankan:
 *   node --conditions=react-server --import tsx scripts/upload-store-packages.ts
 *   node --conditions=react-server --import tsx scripts/upload-store-packages.ts --only=sipandu
 *   node --conditions=react-server --import tsx scripts/upload-store-packages.ts --dry-run
 */
import { loadLocalEnv } from "./lib/load-local-env";
loadLocalEnv();

import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";
import postgres from "postgres";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createDatabase } from "@/db/connection";
import { createStoreStore } from "@/db/store-store";
import { attachProductZipFile } from "@/services/store";
import { getEnv } from "@/env";
import type { AdminPrincipal } from "@/access/rules";

/* -------------------------------------------------------------------------- */
/* Konfigurasi paket                                                          */
/* -------------------------------------------------------------------------- */

interface PackageTarget {
  /** Slug produk di storefront; juga nama folder aset. */
  slug: string;
  productId: string;
  /** Direktori proyek sumber (read-only). */
  sourceDir: string;
  /** Nama berkas .zip yang diunduh pembeli. */
  zipName: string;
}

const PACKAGE_TARGETS: PackageTarget[] = [
  {
    slug: "sinduksadati",
    productId: "a0110000-0000-4000-a000-000000000001",
    sourceDir: "C:/FLUTTER PROJEK/gabut/sinduksadati",
    zipName: "sinduksadati-source-v1.0.0.zip",
  },
  {
    slug: "sipandu",
    productId: "a0110000-0000-4000-a000-000000000002",
    sourceDir: "C:/FLUTTER PROJEK/gabut/sipandu",
    zipName: "sipandu-source-v3.0.0.zip",
  },
  {
    slug: "hippam",
    productId: "a0110000-0000-4000-a000-000000000003",
    sourceDir: "C:/FLUTTER PROJEK/gabut/Hippam-Project",
    zipName: "hippam-dual-platform-source-v1.0.0.zip",
  },
  {
    slug: "umkm-ku",
    productId: "a0110000-0000-4000-a000-000000000004",
    sourceDir: "C:/FLUTTER PROJEK/gabut/umkm-ku",
    zipName: "umkm-ku-source-v1.3.0.zip",
  },
];

/**
 * Direktori build/dependensi/cache tidak ikut dikemas. `build` dan `dist`
 * dibuang karena bisa dibangun ulang dari sumber; `.env*` dibuang karena berisi
 * kredensial nyata yang tidak boleh ikut terkirim ke pembeli.
 */
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".github",
  "build",
  "dist",
  "out",
  "coverage",
  ".dart_tool",
  ".pub-cache",
  ".pub",
  ".vercel",
  ".insforge",
  ".turbo",
  ".idea",
  ".vscode",
  ".agents",
  ".codebase-memory",
  ".gradle",
  "Pods",
  ".venv",
  "__pycache__",
  "tmp",
  ".cache",
]);

/** Berkas yang tidak boleh ikut: kredensial, kunci, dan artefak biner besar. */
const EXCLUDED_FILES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.development.local",
  ".env.production.local",
  ".env.test",
  ".DS_Store",
  "Thumbs.db",
  "tsconfig.tsbuildinfo",
  ".last_build_id",
]);

const EXCLUDED_EXTENSIONS = new Set([".apk", ".aab", ".ipa", ".keystore", ".jks", ".p12"]);

/** Batas aman agar tetap di bawah MAX_STORE_PACKAGE_BYTES (200 MB). */
const MAX_UNCOMPRESSED_BYTES = 180 * 1024 * 1024;

/* -------------------------------------------------------------------------- */
/* Pembuat ZIP minimal (deflate, tanpa dependensi)                            */
/* -------------------------------------------------------------------------- */

interface ZipEntry {
  /** Path di dalam arsip, selalu memakai "/" sebagai pemisah. */
  name: string;
  data: Buffer;
  mtime: Date;
}

/** Tanggal DOS: bit-packed tanggal & waktu lokal, resolusi 2 detik. */
function dosDateTime(date: Date) {
  const year = Math.max(1980, date.getUTCFullYear());
  const dosTime =
    (date.getUTCHours() << 11) |
    (date.getUTCMinutes() << 5) |
    Math.floor(date.getUTCSeconds() / 2);
  const dosDate =
    (((year - 1980) & 0x7f) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
  return { dosTime, dosDate };
}

/** Flag bit 11 = nama berkas ber-UTF-8. */
const FLAG_UTF8 = 0x0800;
const METHOD_DEFLATE = 8;

/**
 * Bangun arsip ZIP dari daftar entri.
 * Referensi format: PKWARE APPNOTE 4.3.6 (local header, central directory, EOCD).
 */
function buildZip(entries: ZipEntry[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.name, "utf8");
    const compressed = deflateRawSync(entry.data, { level: 9 });
    // Deflate hanya dipakai bila benar-benar lebih kecil; kalau tidak, simpan mentah.
    const useDeflate = compressed.length < entry.data.length;
    const payload = useDeflate ? compressed : entry.data;
    const method = useDeflate ? METHOD_DEFLATE : 0;
    const checksum = crc32(entry.data) >>> 0;
    const { dosTime, dosDate } = dosDateTime(entry.mtime);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(FLAG_UTF8, 6); // flags
    localHeader.writeUInt16LE(method, 8); // compression
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(entry.data.length, 22);
    localHeader.writeUInt16LE(nameBytes.length, 26);
    localHeader.writeUInt16LE(0, 28); // extra field length

    localParts.push(localHeader, nameBytes, payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0); // signature
    centralHeader.writeUInt16LE(0x031e, 4); // version made by (UNIX)
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(FLAG_UTF8, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(entry.data.length, 24);
    centralHeader.writeUInt16LE(nameBytes.length, 28);
    centralHeader.writeUInt16LE(0, 30); // extra length
    centralHeader.writeUInt16LE(0, 32); // comment length
    centralHeader.writeUInt16LE(0, 34); // disk number
    centralHeader.writeUInt16LE(0, 36); // internal attrs
    // External attrs: mode UNIX 0644 pada 16 bit atas. `>>> 0` wajib karena
    // pergeseran menghasilkan nilai negatif bila dipaksa ke int32.
    centralHeader.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    centralHeader.writeUInt32LE(offset, 42); // local header offset

    centralParts.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + payload.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // EOCD signature
  end.writeUInt16LE(0, 4); // disk number
  end.writeUInt16LE(0, 6); // central directory start disk
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localParts, centralDirectory, end]);
}

/* -------------------------------------------------------------------------- */
/* Pengumpulan berkas                                                         */
/* -------------------------------------------------------------------------- */

function toArchivePath(root: string, absolutePath: string) {
  return relative(root, absolutePath).split(sep).join("/");
}

async function collectEntries(root: string) {
  const entries: ZipEntry[] = [];
  let totalBytes = 0;

  async function walk(dir: string) {
    const children = await readdir(dir, { withFileTypes: true });
    // Urutkan agar arsip deterministik.
    children.sort((a, b) => a.name.localeCompare(b.name));

    for (const child of children) {
      const absolute = join(dir, child.name);

      if (child.isDirectory()) {
        if (EXCLUDED_DIRS.has(child.name)) continue;
        await walk(absolute);
        continue;
      }

      if (!child.isFile()) continue;
      if (EXCLUDED_FILES.has(child.name)) continue;

      const extension = child.name.slice(child.name.lastIndexOf(".")).toLowerCase();
      if (EXCLUDED_EXTENSIONS.has(extension)) continue;
      // `.env.*` apa pun bentuknya tidak boleh ikut.
      if (/^\.env(\..+)?$/.test(child.name)) continue;
      // Kunci privat / sertifikat.
      if (/\.(pem|key|crt|pfx)$/i.test(child.name)) continue;

      const info = await stat(absolute);
      totalBytes += info.size;
      if (totalBytes > MAX_UNCOMPRESSED_BYTES) {
        throw new Error(
          `Isi paket melebihi batas ${Math.round(MAX_UNCOMPRESSED_BYTES / 1024 / 1024)} MB sebelum kompresi.`,
        );
      }

      entries.push({
        name: toArchivePath(root, absolute),
        data: await readFile(absolute),
        // Timestamp dinormalkan supaya arsip deterministik.
        mtime: new Date("2026-01-01T00:00:00Z"),
      });
    }
  }

  await walk(root);
  return { entries, totalBytes };
}

/* -------------------------------------------------------------------------- */
/* Unggah ke R2 privat                                                        */
/* -------------------------------------------------------------------------- */

function privateBucketClient() {
  const env = getEnv();
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_STAGING ||
    env.R2_BUCKET_STAGING === env.R2_BUCKET_PUBLIC
  ) {
    throw new Error(
      "Penyimpanan privat Digital Store belum siap (bucket privat harus berbeda dari bucket publik).",
    );
  }

  return {
    bucket: env.R2_BUCKET_STAGING,
    client: new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      requestChecksumCalculation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    }),
  };
}

/** Key mengikuti pola yang diwajibkan `verifyUploadedZip`. */
function packageKey(productId: string, filename: string) {
  const uuid = crypto.randomUUID();
  return `store-packages/${productId}/${uuid}-${filename}`;
}

/* -------------------------------------------------------------------------- */
/* Entry point                                                                */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const onlyArg = [...args].find((arg) => arg.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice("--only=".length) : null;

  const targets = only ? PACKAGE_TARGETS.filter((t) => t.slug === only) : PACKAGE_TARGETS;
  if (targets.length === 0) {
    throw new Error(`Tidak ada target paket yang cocok dengan --only=${only}`);
  }

  const env = getEnv();
  const { db, close } = createDatabase(env.DATABASE_URI);
  const store = createStoreStore(db);
  const principal: AdminPrincipal = {
    id: "system-package-uploader",
    role: "owner",
    twoFactorVerified: true,
  };
  const sql = postgres(env.DATABASE_URI, { max: 1 });

  // Dev DB hanya disinkronkan bila dikonfigurasi dan benar-benar berbeda.
  const directUri = process.env.DATABASE_URI_DIRECT || process.env.DATABASE_DIRECT_URL;
  const directSql = directUri && directUri !== env.DATABASE_URI ? postgres(directUri, { max: 1 }) : null;

  await mkdir("tmp/store-packages", { recursive: true });

  try {
    for (const target of targets) {
      console.log(`\n=== ${target.slug} ===`);

      // Bila produk sudah punya paket, jangan unggah ulang: baris private_files
      // lama akan menjadi yatim. Cukup sinkronkan ke Dev DB.
      const [existing] = await sql`
        SELECT p.private_file_id, p.package_size_bytes, f.key, f.filename
        FROM digital_products p
        LEFT JOIN private_files f ON f.id = p.private_file_id
        WHERE p.id = ${target.productId}
        LIMIT 1
      `;

      if (existing?.private_file_id && existing.key && !args.has("--force")) {
        console.log(`  sudah terlampir: ${existing.filename} (${existing.package_size_bytes} byte)`);
        if (directSql) {
          await syncPackageToDirectDb(
            directSql,
            target,
            existing.private_file_id,
            existing.key,
            Number(existing.package_size_bytes),
          );
        }
        continue;
      }

      const { entries, totalBytes } = await collectEntries(target.sourceDir);
      console.log(
        `  ${entries.length} berkas, ${(totalBytes / 1024 / 1024).toFixed(2)} MB sebelum kompresi`,
      );

      const archive = buildZip(entries);
      const sizeBytes = archive.length;
      const sha256 = createHash("sha256").update(archive).digest("hex");
      console.log(
        `  arsip ${target.zipName}: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB, sha256 ${sha256.slice(0, 16)}…`,
      );

      const localPath = join("tmp/store-packages", target.zipName);
      await writeFile(localPath, archive);

      if (dryRun) {
        console.log(`  [dry-run] tidak mengunggah; arsip lokal: ${localPath}`);
        continue;
      }

      const { client, bucket } = privateBucketClient();
      const key = packageKey(target.productId, target.zipName);
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: archive,
          ContentType: "application/zip",
        }),
      );
      console.log(`  terunggah ke r2://${bucket}/${key}`);

      // Buktikan objek benar-benar ada dan isinya ZIP sah sebelum dicatat di DB.
      const head = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const roundTrip = Buffer.from(await head.Body!.transformToByteArray());
      const magicOk =
        roundTrip.length >= 4 &&
        roundTrip[0] === 0x50 &&
        roundTrip[1] === 0x4b &&
        roundTrip[2] === 0x03 &&
        roundTrip[3] === 0x04;
      if (!magicOk) throw new Error(`Objek R2 bukan ZIP valid: ${key}`);
      if (roundTrip.length !== sizeBytes) {
        throw new Error(
          `Ukuran objek R2 tidak cocok (${roundTrip.length} vs ${sizeBytes}) untuk ${key}`,
        );
      }
      console.log(`  verifikasi R2 OK (magic PK\\x03\\x04, ${roundTrip.length} byte)`);

      const fileId = await attachProductZipFile(store, principal, target.productId, {
        key,
        filename: target.zipName,
        mimeType: "application/zip",
        sizeBytes,
      });
      console.log(`  private_files.id = ${fileId} -> digital_products.private_file_id`);

      // Dev DB harus mencerminkan DB utama, kalau tidak unduhan gagal di sana.
      if (directSql) {
        await syncPackageToDirectDb(directSql, target, fileId, key, sizeBytes);
      }
    }

    console.log("\n=== Selesai melampirkan paket .zip ke 4 produk digital ===");
  } finally {
    await close();
    await sql.end({ timeout: 5 });
    if (directSql) await directSql.end({ timeout: 5 });
  }
}

/**
 * Salin baris `private_files` + pointer produk ke Dev DB.
 * `private_files.key` bersifat unik, jadi konflik key dianggap sudah tersinkron.
 */
async function syncPackageToDirectDb(
  sql: ReturnType<typeof postgres>,
  target: PackageTarget,
  fileId: string,
  key: string,
  sizeBytes: number,
) {
  await sql`
    INSERT INTO private_files (id, key, filename, mime_type, size_bytes, uploaded_by_type, verified_at)
    VALUES (${fileId}, ${key}, ${target.zipName}, 'application/zip', ${sizeBytes}, 'admin', now())
    ON CONFLICT (key) DO UPDATE SET
      filename = EXCLUDED.filename,
      mime_type = EXCLUDED.mime_type,
      size_bytes = EXCLUDED.size_bytes,
      verified_at = EXCLUDED.verified_at
  `;

  const [row] = await sql`SELECT id FROM private_files WHERE key = ${key} LIMIT 1`;
  if (!row) throw new Error(`Gagal menyinkronkan private_files ke Dev DB untuk ${target.slug}.`);

  await sql`
    UPDATE digital_products
    SET private_file_id = ${row.id},
        package_size_bytes = ${sizeBytes},
        updated_at = now()
    WHERE id = ${target.productId}
  `;
  console.log(`  Dev DB sync OK (private_file_id = ${row.id})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n[GAGAL] Gagal mengemas/melampirkan paket produk:", error);
    process.exit(1);
  });
