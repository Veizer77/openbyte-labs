import { describe, expect, it } from "vitest";
import { wibMonthRange, wibDateKey, daysBetween } from "@/lib/format/business-time";

/**
 * Server produksi berjalan pada UTC, sedangkan bisnis berjalan pada WIB (UTC+7).
 *
 * Bug yang dijaga di sini nyata dan tidak terlihat: `new Date(y, m, 1)` memakai
 * zona waktu proses, sehingga "booking bulan ini" menghitung rentang yang
 * bergeser tujuh jam. Akibatnya transaksi tanggal 1 pukul 06:00 WIB masuk
 * hitungan bulan lalu, dan transaksi tanggal 1 pukul 00:30 WIB hilang dari
 * hitungan bulan berjalan. Angkanya tetap tampil wajar, jadi tidak ada yang
 * menyadari sampai rekap bulanan tidak cocok.
 */

describe("batas bulan WIB", () => {
  it("memulai bulan pada 00:00 WIB, yaitu 17:00 UTC hari sebelumnya", () => {
    // 15 November 2026 10:00 WIB = 03:00 UTC
    const { start } = wibMonthRange(new Date("2026-11-15T03:00:00Z"));
    expect(start.toISOString()).toBe("2026-10-31T17:00:00.000Z");
  });

  it("mengakhiri bulan tepat pada awal bulan berikutnya WIB", () => {
    const { end } = wibMonthRange(new Date("2026-11-15T03:00:00Z"));
    expect(end.toISOString()).toBe("2026-11-30T17:00:00.000Z");
  });

  it("menghitung transaksi 1 November 00:30 WIB sebagai bulan November", () => {
    // 1 Nov 2026 00:30 WIB = 31 Okt 2026 17:30 UTC
    const event = new Date("2026-10-31T17:30:00Z");
    const { start, end } = wibMonthRange(event);
    expect(event.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(event.getTime()).toBeLessThan(end.getTime());
  });

  it("menghitung transaksi 31 Oktober 23:30 WIB sebagai bulan Oktober", () => {
    // 31 Okt 2026 23:30 WIB = 31 Okt 2026 16:30 UTC
    const event = new Date("2026-10-31T16:30:00Z");
    // Rentang November dihitung dari acuan di dalam November.
    const { start, end } = wibMonthRange(new Date("2026-11-15T03:00:00Z"));
    const inNovember =
      event.getTime() >= start.getTime() && event.getTime() < end.getTime();
    expect(inNovember).toBe(false);
  });

  it("tidak bergeser ketika diminta pada akhir bulan UTC", () => {
    // 1 Des 2026 05:00 WIB = 30 Nov 2026 22:00 UTC — masih November di UTC
    const { start } = wibMonthRange(new Date("2026-11-30T22:00:00Z"));
    expect(start.toISOString()).toBe("2026-11-30T17:00:00.000Z");
  });

  it("menangani pergantian tahun", () => {
    // 1 Jan 2027 02:00 WIB = 31 Des 2026 19:00 UTC
    const { start, end } = wibMonthRange(new Date("2026-12-31T19:00:00Z"));
    expect(start.toISOString()).toBe("2026-12-31T17:00:00.000Z");
    expect(end.toISOString()).toBe("2027-01-31T17:00:00.000Z");
  });

  it("menghasilkan rentang satu bulan penuh", () => {
    const { start, end } = wibMonthRange(new Date("2026-11-15T03:00:00Z"));
    expect(end.getTime() - start.getTime()).toBe(30 * 24 * 60 * 60 * 1000);
  });
});

describe("tanggal WIB", () => {
  it("memakai tanggal WIB, bukan tanggal UTC", () => {
    // 2 Nov 2026 01:00 WIB = 1 Nov 2026 18:00 UTC
    expect(wibDateKey(new Date("2026-11-01T18:00:00Z"))).toBe("2026-11-02");
  });

  it("tetap pada tanggal yang sama saat siang hari", () => {
    expect(wibDateKey(new Date("2026-11-02T05:00:00Z"))).toBe("2026-11-02");
  });
});

describe("selisih hari", () => {
  it("menghitung hari penuh", () => {
    expect(
      daysBetween(
        new Date("2026-11-01T00:00:00Z"),
        new Date("2026-11-04T00:00:00Z"),
      ),
    ).toBe(3);
  });

  it("tidak membulatkan ke atas untuk sebagian hari", () => {
    expect(
      daysBetween(
        new Date("2026-11-01T00:00:00Z"),
        new Date("2026-11-01T23:00:00Z"),
      ),
    ).toBe(0);
  });
});
