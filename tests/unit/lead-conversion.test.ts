import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { leadConversionSchema } from "@/schemas/tracking";

/**
 * Konversi lead menjadi proyek klien pernah berarti admin mengetik ulang nama,
 * WhatsApp, dan harga dari layar inquiry ke form proyek. Dua kesalahan yang
 * paling mahal dari cara itu:
 *
 * 1. Nomor WhatsApp salah ketik → klien tidak bisa login ke portalnya, dan
 *    tidak ada yang menyadarinya sampai klien mengeluh.
 * 2. Harga proyek berbeda dari yang dijanjikan → nilai kontrak di portal dan
 *    invoice tidak cocok dengan kesepakatan.
 *
 * Karena itu identitas klien **tidak** boleh menjadi bagian dari input konversi:
 * server membacanya ulang dari baris lead. Tes ini mengunci bentuk input itu.
 */

const source = readFileSync(
  join(process.cwd(), "src/schemas/tracking.ts"),
  "utf8",
);
const store = readFileSync(
  join(process.cwd(), "src/db/tracking-store.ts"),
  "utf8",
);
const service = readFileSync(
  join(process.cwd(), "src/services/tracking.ts"),
  "utf8",
);

const valid = {
  source: "inquiry" as const,
  sourceId: "11111111-1111-4111-8111-111111111111",
  projectTitle: "Sistem Informasi Inventori",
  totalCost: 5_000_000,
  categoryId: null,
  servicePackageId: null,
  startDate: "",
  targetCompletionDate: "",
  internalNotes: "",
};

describe("skema konversi lead", () => {
  it("menerima input minimal yang sah", () => {
    expect(leadConversionSchema.safeParse(valid).success).toBe(true);
  });

  it("menolak identitas klien yang dikirim dari browser", () => {
    for (const extra of [
      { clientName: "Nama Palsu" },
      { clientWhatsapp: "081200000000" },
      { clientEmail: "palsu@contoh.test" },
      { trackingCode: "PRJ-ABCDEFGH" },
      { accessPinHash: "x" },
    ]) {
      expect(leadConversionSchema.safeParse({ ...valid, ...extra }).success).toBe(
        false,
      );
    }
  });

  it("menolak sumber yang tidak dikenal", () => {
    expect(
      leadConversionSchema.safeParse({ ...valid, source: "booking" }).success,
    ).toBe(false);
  });

  it("menolak nilai kontrak negatif atau pecahan", () => {
    expect(
      leadConversionSchema.safeParse({ ...valid, totalCost: -1 }).success,
    ).toBe(false);
    expect(
      leadConversionSchema.safeParse({ ...valid, totalCost: 1.5 }).success,
    ).toBe(false);
  });

  it("menolak target selesai sebelum tanggal mulai", () => {
    expect(
      leadConversionSchema.safeParse({
        ...valid,
        startDate: "2026-11-10",
        targetCompletionDate: "2026-11-01",
      }).success,
    ).toBe(false);
  });

  it("menerima target selesai setelah tanggal mulai", () => {
    expect(
      leadConversionSchema.safeParse({
        ...valid,
        startDate: "2026-11-01",
        targetCompletionDate: "2026-11-20",
      }).success,
    ).toBe(true);
  });
});

describe("implementasi konversi lead", () => {
  it("membaca identitas klien dari baris lead, bukan dari input", () => {
    expect(store).toContain("clientName = row.name");
    expect(store).toContain("clientWhatsapp = row.whatsapp");
    expect(store).toContain("clientName = row.contactName");
    expect(store).toContain("clientWhatsapp = row.contactWhatsapp");
  });

  it("menjalankan seluruh konversi dalam satu transaksi", () => {
    expect(store).toMatch(/async convertLead\(input: unknown, actorId: string\)/);
    expect(store).toMatch(/db\.transaction\(async \(tx\) => \{/);
  });

  it("menolak konversi ganda atas lead yang sama", () => {
    expect(store).toContain("Lead ini sudah dikonversi menjadi proyek");
  });

  it("menandai lead sebagai terkonversi di transaksi yang sama", () => {
    expect(store).toMatch(/status: "converted"/);
  });

  it("mewajibkan izin proyek klien dan izin ubah inquiry", () => {
    expect(service).toContain('authorize(principal, "client-projects", "create")');
    expect(service).toContain('authorize(principal, "inquiries", "update")');
  });

  it("tidak memakai harga paket atau rentang kalkulator sebagai nilai kontrak", () => {
    expect(source).toContain("totalCost: money");
    expect(store).not.toMatch(/totalCost: row\.packagePrice/);
    expect(store).not.toMatch(/totalCost: row\.priceMin/);
  });
});
