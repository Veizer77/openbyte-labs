import assert from "node:assert/strict";

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3002";
const trackingEnabled = process.env.SMOKE_TRACKING_ENABLED === "true";
// Saat indexing publik menyala (S7), header `x-robots-tag: noindex` hanya
// dipertahankan pada rute yang memang tidak boleh diindeks.
const indexingEnabled = process.env.SMOKE_INDEXING_ENABLED === "true";
const alwaysNoindex = (route) =>
  /^\/(admin|tracking|api)(\/|$)/.test(route);
const routes = [
  ["/", 200],
  ["/proyek", 200],
  ["/proyek/sipandu", 200],
  ["/paket", 200],
  ["/kalkulator", 200],
  ["/konsultasi", 200],
  ["/tentang-kami", 200],
  ["/layanan/sistem-informasi", 200],
  ["/ketentuan-layanan", 200],
  ["/pesan?paket=starter-umkm", 200],
  ["/pesan?paket=tidak-ada", 404],
  ["/kebijakan-privasi", 200],
  ["/admin/login", 200],
  ["/admin", 200],
  // /admin/settings adalah rute hidup; tanpa sesi ia 307 ke /admin/login.
  ["/admin/settings", 200],
  ["/preview", 404],
  ["/preview/cms/dashboard-cms-admin", 404],
  ["/tracking", trackingEnabled ? 200 : 404],
  ["/tracking/portal", 404],
  ["/tracking/auth", 404],
  ["/tracking/proyek", trackingEnabled ? 200 : 404],
  ["/tracking/proyek/detail", 404],
  ["/proyek/tidak-ada", 404],
  ["/portofolio", 200],
  ["/booking", 200],
  ["/health", 200],
];

for (const [route, expected] of routes) {
  const response = await fetch(new URL(route, base));
  // Anti soft-404: sebuah rute negatif tidak boleh dijawab 200 berisi halaman
  // 404. Status harus benar-benar 404 sejak header pertama.
  if (expected === 404) {
    assert.equal(
      response.status,
      404,
      `${route}: HTTP 404 diharapkan, bukan ${response.status} (soft-404)`,
    );
  } else {
    assert.equal(response.status, expected, `${route}: HTTP ${expected} diharapkan`);
  }
  if (trackingEnabled && ["/tracking", "/tracking/proyek"].includes(route)) {
    assert.equal(new URL(response.url).pathname, "/tracking");
    assert.match(await response.text(), /Verifikasi &amp; Buka Dasbor Proyek/);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  }
  // Saat indexing mati, seluruh respons wajib noindex. Saat indexing menyala,
  // hanya rute privat (/admin, /tracking, /api) yang tetap noindex.
  if (!indexingEnabled || alwaysNoindex(route)) {
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
  }
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=31536000/);
  if (route === "/health") {
    const health = await response.json();
    assert.equal(health.status, "ok");
    assert.equal(health.database, "connected");
  }
  console.log(`OK ${route} -> ${response.status}`);
}
console.log(`${routes.length} pemeriksaan HTTP produksi lulus.`);
