import { loadLocalEnv } from "./lib/load-local-env";
loadLocalEnv();

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import sharp from "sharp";
import { createDatabase } from "@/db/connection";
import { createMediaStore } from "@/db/media-store";
import { createR2MediaStorage } from "@/lib/server/r2-media-storage";
import { importMediaAsset } from "@/services/media";
import { getEnv } from "@/env";
import type { MediaVariant } from "@/schemas/media";

export interface MediaUploadItem {
  id: string;
  slug: string;
  filename: string;
  localPath: string;
  alt: string;
}

const variantsConfig = {
  thumb: { width: 320, height: 240 },
  card: { width: 800, height: 600 },
  hero: { width: 1920, height: 1200 },
  og: { width: 1200, height: 630 },
} as const satisfies Record<MediaVariant, { width: number; height: number }>;

export const STORE_SHOWCASE_MEDIA: MediaUploadItem[] = [
  // 1. SINDUKSADATI
  {
    id: "e0110000-0000-4000-a000-000000000101",
    slug: "sinduksadati",
    filename: "sinduksadati-thumbnail.png",
    localPath: "tmp/store-assets/sinduksadati/sinduksadati-thumbnail.png",
    alt: "SINDUKSADATI - Dasbor Demografi & Infografis Kependudukan RW 06 Desa Mojorejo",
  },
  {
    id: "e0110000-0000-4000-a000-000000000102",
    slug: "sinduksadati",
    filename: "sinduksadati-gis-peta-warga.png",
    localPath: "tmp/store-assets/sinduksadati/sinduksadati-gis-peta-warga.png",
    alt: "SINDUKSADATI - Pemetaan Spasial GIS Sebaran Hunian & Titik Rumah Warga RW 06 (Leaflet)",
  },
  {
    id: "e0110000-0000-4000-a000-000000000103",
    slug: "sinduksadati",
    filename: "sinduksadati-manajemen-kk-surat.png",
    localPath: "tmp/store-assets/sinduksadati/sinduksadati-manajemen-kk-surat.png",
    alt: "SINDUKSADATI - Database Induk Kartu Keluarga & Generator Surat Pengantar PDF dengan Barcode",
  },
  {
    id: "e0110000-0000-4000-a000-000000000104",
    slug: "sinduksadati",
    filename: "sinduksadati-keuangan-import-excel.png",
    localPath: "tmp/store-assets/sinduksadati/sinduksadati-keuangan-import-excel.png",
    alt: "SINDUKSADATI - Modul Transparansi Kas Iuran Warga & Impor Massal Data Excel SheetJS",
  },

  // 2. SIPANDU
  {
    id: "e0110000-0000-4000-a000-000000000201",
    slug: "sipandu",
    filename: "sipandu-thumbnail.png",
    localPath: "tmp/store-assets/sipandu/sipandu-thumbnail.png",
    alt: "SIPANDU - Dasbor Monitoring Posyandu ILP Flamboyan RW 06 & Deteksi Dini Risiko Stunting",
  },
  {
    id: "e0110000-0000-4000-a000-000000000202",
    slug: "sipandu",
    filename: "sipandu-kms-kurva-pertumbuhan.png",
    localPath: "tmp/store-assets/sipandu/sipandu-kms-kurva-pertumbuhan.png",
    alt: "SIPANDU - Profil Balita, Kurva Pertumbuhan KMS WHO 2006 & Matriks Imunisasi Dasar",
  },
  {
    id: "e0110000-0000-4000-a000-000000000203",
    slug: "sipandu",
    filename: "sipandu-penimbangan-kader.png",
    localPath: "tmp/store-assets/sipandu/sipandu-penimbangan-kader.png",
    alt: "SIPANDU - Alur 5 Meja Hari H: Pengukuran Antropometri & Kalkulator Z-Score Real-Time",
  },
  {
    id: "e0110000-0000-4000-a000-000000000204",
    slug: "sipandu",
    filename: "sipandu-laporan-puskesmas-pdf.png",
    localPath: "tmp/store-assets/sipandu/sipandu-laporan-puskesmas-pdf.png",
    alt: "SIPANDU - Generator Laporan Resmi L-01 Berkop Pemkot Batu Siap Cetak PDF",
  },

  // 3. HIPPAM
  {
    id: "e0110000-0000-4000-a000-000000000301",
    slug: "hippam",
    filename: "hippam-thumbnail.png",
    localPath: "tmp/store-assets/hippam/hippam-thumbnail.png",
    alt: "HIPPAM Dual-Platform - Dasbor Admin Next.js 16 Billing Air Bersih & Analitik M3",
  },
  {
    id: "e0110000-0000-4000-a000-000000000302",
    slug: "hippam",
    filename: "hippam-catat-meter-mandiri.png",
    localPath: "tmp/store-assets/hippam/hippam-catat-meter-mandiri.png",
    alt: "HIPPAM Dual-Platform - Portal Warga Catat Meter Mandiri & Verifikasi Foto Fisik",
  },
  {
    id: "e0110000-0000-4000-a000-000000000303",
    slug: "hippam",
    filename: "hippam-ai-copilot-tagihan.png",
    localPath: "tmp/store-assets/hippam/hippam-ai-copilot-tagihan.png",
    alt: "HIPPAM Dual-Platform - Asisten AI Copilot Deteksi Kebocoran Pipa & Invoice WhatsApp",
  },
  {
    id: "e0110000-0000-4000-a000-000000000304",
    slug: "hippam",
    filename: "hippam-mobile-flutter-app.png",
    localPath: "tmp/store-assets/hippam/hippam-mobile-flutter-app.png",
    alt: "HIPPAM Dual-Platform - Aplikasi Flutter Mobile Petugas Catat Meter & Portal Warga",
  },

  // 4. UMKM-KU
  {
    id: "e0110000-0000-4000-a000-000000000401",
    slug: "umkm-ku",
    filename: "umkm-ku-thumbnail.png",
    localPath: "tmp/store-assets/umkm-ku/umkm-ku-thumbnail.png",
    alt: "UMKM-KU - Portal Direktori Usaha Warga RW 06 & Filter Kategori Usaha Terpadu",
  },
  {
    id: "e0110000-0000-4000-a000-000000000402",
    slug: "umkm-ku",
    filename: "umkm-ku-gis-peta-usaha.png",
    localPath: "tmp/store-assets/umkm-ku/umkm-ku-gis-peta-usaha.png",
    alt: "UMKM-KU - Pemetaan Spasial GIS Lokasi Usaha Warga & Penunjuk Radius Jarak (Leaflet)",
  },
  {
    id: "e0110000-0000-4000-a000-000000000403",
    slug: "umkm-ku",
    filename: "umkm-ku-detail-usaha-kontak.png",
    localPath: "tmp/store-assets/umkm-ku/umkm-ku-detail-usaha-kontak.png",
    alt: "UMKM-KU - Profil Lengkap Toko Usaha, Katalog Menu Produk & Direct Chat WhatsApp",
  },
  {
    id: "e0110000-0000-4000-a000-000000000404",
    slug: "umkm-ku",
    filename: "umkm-ku-dashboard-pemilik-operator.png",
    localPath: "tmp/store-assets/umkm-ku/umkm-ku-dashboard-pemilik-operator.png",
    alt: "UMKM-KU - Dasbor Pemilik Usaha Mandiri & Alur Verifikasi Operator Berjenjang RW/Desa",
  },
];

async function main() {
  console.log("=== Mengunggah 16 Aset Media Showcase Asli ke Cloudflare R2 & Database ===");
  const env = getEnv();

  const { db, close } = createDatabase(env.DATABASE_URI);
  const rawClient1 = postgres(env.DATABASE_URI);
  const directUri = process.env.DATABASE_URI_DIRECT || process.env.DATABASE_DIRECT_URL;
  const directClient = directUri && directUri !== env.DATABASE_URI ? postgres(directUri) : null;

  try {
    const store = createMediaStore(db);
    const storage = createR2MediaStorage();

    for (let i = 0; i < STORE_SHOWCASE_MEDIA.length; i++) {
      const item = STORE_SHOWCASE_MEDIA[i];
      const absPath = join(process.cwd(), item.localPath);
      console.log(`[${i + 1}/${STORE_SHOWCASE_MEDIA.length}] Memproses ${item.filename} (ID: ${item.id})...`);

      const fileBuffer = await readFile(absPath);
      const bytes = new Uint8Array(fileBuffer);
      const inputBuffer = Buffer.from(bytes);

      // Cek apakah media record sudah ada di database
      const [existingRow] = await rawClient1`SELECT * FROM media WHERE id = ${item.id} LIMIT 1`;

      if (existingRow) {
        console.log(`   * Memperbarui aset media yang sudah ada di R2 & DB...`);
        // Generate new variants & upload to R2
        const meta = await sharp(inputBuffer).metadata();
        const width = meta.width || 1600;
        const height = meta.height || 1000;
        const attemptId = randomUUID();
        const variantKeys = {} as Record<MediaVariant, string>;

        for (const variant of Object.keys(variantsConfig) as MediaVariant[]) {
          const dims = variantsConfig[variant];
          const key = `media/${item.id}/${attemptId}/${variant}.webp`;
          const output = await sharp(inputBuffer)
            .rotate()
            .resize({
              width: dims.width,
              height: dims.height,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();
          await storage.put(key, output, "image/webp");
          variantKeys[variant] = key;
        }

        // Update DB1
        await rawClient1`
          UPDATE media SET
            key = ${variantKeys.hero},
            filename = ${item.filename},
            mime_type = 'image/png',
            size_bytes = ${bytes.byteLength},
            width = ${width},
            height = ${height},
            alt = ${item.alt},
            variants = ${JSON.stringify(variantKeys)},
            finalized_at = NOW(),
            updated_at = NOW()
          WHERE id = ${item.id}
        `;
        console.log(`   ✓ R2 & DB1 Update OK: (${width}x${height}, ${bytes.byteLength} bytes)`);
      } else {
        // Import baru via importMediaAsset
        const asset = await importMediaAsset(store, storage, {
          id: item.id,
          filename: item.filename,
          mimeType: "image/png",
          bytes,
          alt: item.alt,
        });
        console.log(`   ✓ R2 & DB1 Import OK: ${asset.id} (${asset.width}x${asset.height}, ${asset.sizeBytes} bytes)`);
      }

      // Sync record ke Dev DB (directClient) jika dikonfigurasi
      if (directClient) {
        const [row] = await rawClient1`SELECT * FROM media WHERE id = ${item.id} LIMIT 1`;
        if (row) {
          await directClient`
            INSERT INTO media (
              id, key, filename, mime_type, size_bytes, width, height, alt,
              variants, uploaded_by, finalized_at, deleted_at, created_at, updated_at
            ) VALUES (
              ${row.id}, ${row.key}, ${row.filename}, ${row.mime_type}, ${row.size_bytes},
              ${row.width}, ${row.height}, ${row.alt}, ${JSON.stringify(row.variants)},
              ${row.uploaded_by}, ${row.finalized_at}, ${row.deleted_at},
              ${row.created_at}, ${row.updated_at}
            )
            ON CONFLICT (id) DO UPDATE SET
              key = EXCLUDED.key,
              filename = EXCLUDED.filename,
              mime_type = EXCLUDED.mime_type,
              size_bytes = EXCLUDED.size_bytes,
              width = EXCLUDED.width,
              height = EXCLUDED.height,
              alt = EXCLUDED.alt,
              variants = EXCLUDED.variants,
              finalized_at = EXCLUDED.finalized_at,
              updated_at = EXCLUDED.updated_at
          `;
          console.log(`   ✓ DB2 (Dev DB) Sync OK`);
        }
      }
    }

    console.log("\n=== Semua 16 Aset Media Showcase Asli Berhasil Diunggah ke R2 & Disinkronkan ke Kedua Database! ===\n");
  } finally {
    await close();
    await rawClient1.end({ timeout: 5 });
    if (directClient) {
      await directClient.end({ timeout: 5 });
    }
  }
}

main().catch((err) => {
  console.error("Gagal mengunggah aset media ke R2:", err);
  process.exit(1);
});
