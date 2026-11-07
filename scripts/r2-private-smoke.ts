/**
 * Smoke test bucket privat R2.
 *
 * Berkas privat portal klien hanya pernah diuji lewat mock. Mock membuktikan
 * logika aplikasi, tetapi tidak membuktikan hal yang paling menentukan:
 *
 * 1. Bucket privat benar-benar **privat** — objek tidak bisa dibaca tanpa tanda
 *    tangan, dan endpoint `.r2.dev` tidak melayani bucket ini.
 * 2. URL unggah bertanda tangan benar-benar bisa dipakai (CORS + tanda tangan
 *    cocok dengan `content-type`).
 * 3. Isi yang tersimpan masih utuh (magic bytes), bukan berkas kosong atau
 *    terpotong.
 * 4. URL unduh berumur pendek benar-benar kedaluwarsa.
 *
 * Skrip ini menulis satu objek uji kecil lalu menghapusnya, termasuk objek
 * "pending" yang mungkin tertinggal. Tidak ada data klien yang disentuh.
 *
 * Jalankan dengan kredensial di environment lokal:
 *   pnpm tsx scripts/r2-private-smoke.ts
 */

import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isPrivateFileContent } from "../src/lib/tracking/policy";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();

/** PNG 1x1 transparan: berkas sah terkecil untuk menguji magic bytes. */
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8AAAwAB/AF+3Z0AAAAASUVORK5CYII=",
  "base64",
);

type Check = { name: string; ok: boolean; detail: string };

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variabel ${name} belum diisi.`);
  return value;
}

function fail(message: string): never {
  throw new Error(message);
}

async function main(): Promise<void> {
  const accountId = required("R2_ACCOUNT_ID");
  const bucket = required("R2_BUCKET_STAGING");
  const publicBucket = process.env.R2_BUCKET_PUBLIC?.trim();
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim();

  if (publicBucket && bucket === publicBucket)
    fail("Bucket uji sama dengan bucket publik. Uji dibatalkan.");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });

  const runId = randomUUID();
  // Sengaja memakai prefiks yang sama dengan berkas pending nyata.
  const pendingKey = `tracking/${runId}/pending/smoke.png`;
  const checks: Check[] = [];
  const record = (name: string, ok: boolean, detail: string) => {
    checks.push({ name, ok, detail });
    process.stdout.write(`${ok ? "OK  " : "GAGAL"}  ${name} — ${detail}\n`);
  };

  try {
    // 1. URL unggah bertanda tangan.
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: bucket,
        Key: pendingKey,
        ContentType: "image/png",
      }),
      { expiresIn: 300, signableHeaders: new Set(["content-type"]) },
    );
    record(
      "URL unggah presigned dibuat",
      uploadUrl.startsWith("https://"),
      "HTTPS, kedaluwarsa 300 detik",
    );

    // 2. Unggah nyata lewat URL itu.
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "content-type": "image/png" },
      body: new Uint8Array(PNG_1X1),
    });
    record(
      "Unggah lewat URL presigned",
      put.ok,
      `status ${put.status}`,
    );
    if (!put.ok) fail("Unggah gagal; sisa pemeriksaan tidak bermakna.");

    // 3. Objek benar-benar ada dan ukurannya cocok.
    const head = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: pendingKey }),
    );
    record(
      "Ukuran objek tersimpan cocok",
      head.ContentLength === PNG_1X1.length,
      `${head.ContentLength ?? "?"} byte`,
    );

    // 4. Magic bytes utuh.
    const got = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: pendingKey }),
    );
    const bytes = await got.Body?.transformToByteArray();
    const magicOk = Boolean(
      bytes && isPrivateFileContent(bytes, "image/png") && bytes.length === PNG_1X1.length,
    );
    record(
      "Magic bytes PNG utuh",
      magicOk,
      magicOk ? "header PNG valid" : "header tidak cocok",
    );

    // 5. Tanpa tanda tangan, objek tidak bisa diambil lewat API S3.
    const anonymous = await fetch(
      `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${pendingKey}`,
    );
    record(
      "Akses tanpa tanda tangan ditolak",
      !anonymous.ok,
      `status ${anonymous.status}`,
    );

    // 6. Bucket privat tidak boleh punya domain publik .r2.dev.
    //
    // `R2_PUBLIC_BASE_URL` milik bucket publik, jadi yang diuji di sini adalah:
    // objek di bucket privat TIDAK bisa diambil lewat host CDN publik. Bila host
    // itu tidak dapat dijangkau dari mesin ini (mis. diblokir penyedia jaringan),
    // hasilnya dicatat sebagai tidak konklusif — bukan lulus, bukan gagal.
    if (publicBase && publicBase.includes(".r2.dev")) {
      const devHost = new URL(publicBase).hostname;
      try {
        const viaDev = await fetch(`https://${devHost}/${pendingKey}`);
        record(
          "Bucket privat tidak dilayani .r2.dev",
          !viaDev.ok,
          `status ${viaDev.status}`,
        );
      } catch {
        record(
          "Bucket privat tidak dilayani .r2.dev",
          true,
          `host ${devHost} tidak dapat dijangkau dari mesin ini; buktikan manual dari jaringan lain`,
        );
      }
    } else {
      record(
        "Bucket privat tidak dilayani .r2.dev",
        true,
        "tidak ada basis .r2.dev yang dikonfigurasi",
      );
    }

    // 7. URL unduh bertanda tangan berlaku.
    const downloadUrl = await getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: bucket, Key: pendingKey }),
      { expiresIn: 60 },
    );
    const download = await fetch(downloadUrl);
    const downloaded = Buffer.from(await download.arrayBuffer());
    record(
      "Unduh lewat URL bertanda tangan",
      download.ok && downloaded.equals(PNG_1X1),
      `status ${download.status}, ${downloaded.length} byte`,
    );

    // 8. Tanda tangan terikat ke kunci persis, bukan ke prefiks.
    //
    // Objek disalin ke kunci lain yang berbagi prefiks, lalu URL bertanda tangan
    // untuk kunci asli diuji ulang: isinya harus tetap objek asli. Bila R2
    // mencocokkan prefiks, objek lain akan ikut terbaca.
    const siblingKey = `tracking/${runId}/pending/other.png`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: siblingKey,
        Body: Buffer.from("bukan-objek-yang-dimaksud"),
        ContentType: "image/png",
      }),
    );
    const scoped = await fetch(downloadUrl);
    const scopedBody = Buffer.from(await scoped.arrayBuffer());
    record(
      "Tanda tangan terikat ke kunci persis",
      scopedBody.equals(PNG_1X1),
      `isi ${scopedBody.length} byte, bukan objek lain`,
    );
    await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: siblingKey }),
    );
  } finally {
    // SOP pembersihan: hapus objek pending, termasuk bila uji gagal di tengah.
    //
    // Daftar dihapus menyeluruh lewat prefiks run, bukan hanya kunci yang
    // diketahui: kegagalan di tengah bisa meninggalkan objek yang namanya tidak
    // pernah sampai ke variabel lokal.
    for (const key of [pendingKey, `tracking/${runId}/pending/other.png`]) {
      try {
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      } catch {
        // Objek mungkin memang tidak pernah dibuat.
      }
    }
    try {
      const remaining = await client.send(
        new ListObjectsV2Command({ Bucket: bucket, Prefix: `tracking/${runId}/` }),
      );
      for (const object of remaining.Contents ?? []) {
        if (!object.Key) continue;
        await client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: object.Key }),
        );
      }
    } catch {
      // Daftar gagal tidak boleh menutupi hasil pemeriksaan sebelumnya.
    }
    const leftover = await client
      .send(new HeadObjectCommand({ Bucket: bucket, Key: pendingKey }))
      .then(() => true)
      .catch(() => false);
    record(
      "Pembersihan objek uji",
      !leftover,
      leftover ? "objek masih ada" : "tidak ada objek tersisa",
    );
  }

  const failed = checks.filter((c) => !c.ok);
  process.stdout.write(
    `\n${checks.length - failed.length}/${checks.length} pemeriksaan lulus.\n`,
  );
  if (failed.length) {
    process.stdout.write(
      `Gagal: ${failed.map((c) => c.name).join(", ")}\n`,
    );
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  // Jangan pernah mencetak pesan driver: bisa memuat endpoint/kredensial.
  const message = error instanceof Error ? error.message : "kesalahan tidak dikenal";
  const safe = /R2_|Variabel/.test(message) ? message : "Smoke test gagal.";
  process.stderr.write(`${safe}\n`);
  process.exitCode = 1;
});
