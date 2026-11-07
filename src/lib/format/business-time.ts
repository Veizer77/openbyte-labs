/**
 * Batas bulan dalam zona waktu bisnis.
 *
 * Server produksi berjalan pada UTC. Menghitung awal bulan dengan
 * `new Date(y, m, 1)` memakai zona waktu server, sehingga "bulan ini" bergeser
 * tujuh jam: transaksi tanggal 1 pukul 06:00 WIB masih terhitung bulan lalu, dan
 * transaksi tanggal 1 pukul 00:30 WIB hilang dari hitungan bulan berjalan.
 *
 * Fungsi ini menghitung batas bulan menurut offset WIB tetap (+07:00) tanpa
 * bergantung pada zona waktu proses. Indonesia tidak memakai DST, jadi offset
 * tetap aman dan tidak perlu basis data zona waktu.
 */

/** Offset WIB terhadap UTC dalam menit. */
const WIB_OFFSET_MINUTES = 7 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Rentang [mulai, sebelum) untuk bulan yang memuat `reference` menurut WIB.
 * Batas dikembalikan sebagai `Date` UTC agar bisa langsung dipakai di kueri.
 */
export function wibMonthRange(reference: Date = new Date()): {
  start: Date;
  end: Date;
} {
  const shifted = new Date(reference.getTime() + WIB_OFFSET_MINUTES * 60_000);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth();
  const startUtc = Date.UTC(year, month, 1) - WIB_OFFSET_MINUTES * 60_000;
  const endUtc = Date.UTC(year, month + 1, 1) - WIB_OFFSET_MINUTES * 60_000;
  return { start: new Date(startUtc), end: new Date(endUtc) };
}

/** Tanggal (YYYY-MM-DD) menurut WIB, dipakai untuk pengelompokan harian. */
export function wibDateKey(reference: Date = new Date()): string {
  return new Date(reference.getTime() + WIB_OFFSET_MINUTES * 60_000)
    .toISOString()
    .slice(0, 10);
}

/** Umur dalam hari penuh antara dua waktu, dihitung pada resolusi hari. */
export function daysBetween(from: Date, to: Date = new Date()): number {
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
}
