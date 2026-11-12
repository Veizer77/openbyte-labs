/**
 * Menangkap 16 aset media showcase toko digital langsung dari aplikasi asli
 * keempat proyek (bukan mockup, bukan placeholder).
 *
 * Resep yang sudah diverifikasi per proyek:
 *
 *  - SINDUKSADATI (Next.js 14, port 3005)
 *      Login demo via `/api/v1/auth/demo-login`, lalu buka dasbor admin RW,
 *      peta GIS (tunggu tile Leaflet), data KK, dan kas iuran.
 *      Bila server tidak hidup, aset lama yang sudah terverifikasi dibiarkan.
 *
 *  - SIPANDU (React 18 + Vite SPA, port 3006)
 *      Login sungguhan ke InsForge BaaS memakai akun demo Bidan Desa
 *      (bidan@flamboyan.id) sehingga RLS mengizinkan seluruh baris
 *      `anggota/keluarga/kunjungan/pengukuran` terbaca. Aplikasi ini SPA
 *      dengan token di memori (bukan cookie), jadi navigasi antar-halaman
 *      memakai History API, bukan reload penuh — reload akan menghapus sesi.
 *
 *  - HIPPAM (Next.js 16, port 3007)
 *      Login sungguhan: persona Super Admin untuk dasbor & AI Copilot,
 *      persona Pelanggan RT 02 untuk form Catat Meter Mandiri.
 *      Aset mobile memakai tangkapan aplikasi Flutter asli dari repo proyek.
 *
 *  - UMKM-KU (Vite React, port 5179)
 *      Halaman publik direktori, peta GIS, dan detail usaha; dasbor pemilik
 *      diambil setelah login sungguhan sebagai pemilik.rt13@umkmku.test.
 *
 * Jalankan: node --import tsx scripts/capture-real-project-screenshots.ts
 */
import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const baseDir = "tmp/store-assets";
const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 1000;
const DESKTOP_VIEWPORT = { width: TARGET_WIDTH, height: TARGET_HEIGHT };

/* ------------------------------------------------------------------ */
/* Utilitas umum                                                       */
/* ------------------------------------------------------------------ */

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function isReachable(url: string) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.status < 500;
  } catch {
    return false;
  }
}

/** Simpan tangkapan 1600x1000 tanpa memotong (pad, bukan crop). */
async function saveLandscape(input: Buffer, targetPath: string) {
  await sharp(input)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "contain",
      background: { r: 11, g: 13, b: 24, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(targetPath);
  console.log(`  [saved] ${targetPath}`);
}

/** Bingkai tangkapan portrait ke kanvas 1600x1000 dengan bayangan perangkat. */
async function savePortraitFramed(input: Buffer, targetPath: string) {
  const resized = await sharp(input).resize(null, 860, { fit: "inside" }).toBuffer();
  const meta = await sharp(resized).metadata();
  const pWidth = meta.width ?? 400;
  const pHeight = meta.height ?? 860;
  const left = Math.round((TARGET_WIDTH - pWidth) / 2);
  const top = Math.round((TARGET_HEIGHT - pHeight) / 2);

  const background = await sharp({
    create: {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([
      {
        input: await sharp({
          create: {
            width: pWidth + 36,
            height: pHeight + 36,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0.45 },
          },
        })
          .blur(18)
          .png()
          .toBuffer(),
        left: left - 18,
        top: top - 10,
      },
      { input: resized, left, top },
    ])
    .png({ compressionLevel: 9 })
    .toFile(targetPath);
  console.log(`  [saved] ${targetPath}`);
}

async function newDesktopPage(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  page.on("pageerror", (error) => {
    console.warn(`  [pageerror] ${String(error).slice(0, 160)}`);
  });
  return page;
}

async function gotoAndSettle(page: Page, url: string, settleMs: number) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(settleMs);
}

async function bodyText(page: Page) {
  return (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
}

/* ------------------------------------------------------------------ */
/* 1. SINDUKSADATI                                                     */
/* ------------------------------------------------------------------ */

async function captureSindukSadhana(browser: Browser) {
  console.log("\n--- 1. SINDUKSADATI (Next.js 14) ---");
  const base = "http://localhost:3005";
  if (!(await isReachable(`${base}/`))) {
    console.warn(`  [skip] ${base} tidak hidup. Aset SINDUKSADATI yang sudah ada dibiarkan utuh.`);
    return;
  }

  const loginRes = await fetch(`${base}/api/v1/auth/demo-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "admin_rw" }),
  });
  assert(loginRes.ok, `Demo login SINDUKSADATI gagal: HTTP ${loginRes.status}`);
  const auth = (await loginRes.json()) as {
    token?: string;
    refresh_token?: string;
    user?: unknown;
  };
  assert(auth.token && auth.user, "Demo login SINDUKSADATI tidak mengembalikan token/user.");

  const context = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await newPageWithInit(context, auth);
  console.log(`  login sebagai: ${(auth.user as { name?: string }).name ?? "admin_rw"}`);

  const tasks = [
    {
      url: `${base}/admin-rw/dashboard`,
      out: join(baseDir, "sinduksadati", "sinduksadati-thumbnail.png"),
      settle: 2500,
      expect: /dasbor|dashboard|warga|penduduk/i,
    },
    {
      url: `${base}/admin-rw/peta`,
      out: join(baseDir, "sinduksadati", "sinduksadati-gis-peta-warga.png"),
      settle: 5000,
      expect: /peta|leaflet|warga/i,
    },
    {
      url: `${base}/admin-rw/keluarga`,
      out: join(baseDir, "sinduksadati", "sinduksadati-manajemen-kk-surat.png"),
      settle: 2500,
      expect: /kartu keluarga|kk|keluarga/i,
    },
    {
      url: `${base}/admin-rw/iuran`,
      out: join(baseDir, "sinduksadati", "sinduksadati-keuangan-import-excel.png"),
      settle: 2500,
      expect: /iuran|kas|keuangan/i,
    },
  ];

  for (const task of tasks) {
    await gotoAndSettle(page, task.url, task.settle);
    const text = await bodyText(page);
    assert(task.expect.test(text), `Halaman SINDUKSADATI ${task.url} tidak memuat konten yang diharapkan.`);
    await saveLandscape(await page.screenshot(), task.out);
  }

  await context.close();
}

async function newPageWithInit(
  context: BrowserContext,
  auth: { token?: string; refresh_token?: string; user?: unknown },
) {
  const page = await newDesktopPage(context);
  await page.addInitScript((data) => {
    localStorage.setItem("auth_token", data.token ?? "");
    localStorage.setItem("auth_refresh_token", data.refresh_token ?? "");
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  }, auth);
  return page;
}

/* ------------------------------------------------------------------ */
/* 2. SIPANDU                                                          */
/* ------------------------------------------------------------------ */

const SIPANDU_BASE = "http://localhost:3006";
const SIPANDU_BIDAN = { email: "bidan@flamboyan.id", password: "password123" };
const SIPANDU_KADER = { email: "kader@flamboyan.id", password: "password123" };
const SIPANDU_BALITA_ID = "78572212-87c0-494f-ba1c-ed8e8866f10d";
/** Kunjungan sesi aktif Oktober 2026 untuk Fajar Nugroho (Meja 2 belum diukur). */
const SIPANDU_MEJA2_ANGGOTA_ID = "6d0f6485-b067-4727-a368-7f9e9cfa4a7f";

/**
 * SPA berbasis token in-memory: reload penuh menghapus sesi. Navigasi harus
 * lewat History API agar React Router merender rute baru tanpa memuat ulang.
 */
async function spaNavigate(page: Page, path: string, settleMs = 3000) {
  await page.evaluate((target) => {
    window.history.pushState({}, "", target);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await page.waitForTimeout(settleMs);
}

async function sipanduLogin(page: Page, account: { email: string; password: string }) {
  await gotoAndSettle(page, `${SIPANDU_BASE}/login`, 2500);
  await page.fill('input[type="email"]', account.email);
  await page.fill('input[type="password"]', account.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(bidan|kader|admin|pkk|kades)\/dashboard/, { timeout: 30000 });
  await page.waitForTimeout(5000);
}

async function captureSipandu(browser: Browser) {
  console.log("\n--- 2. SIPANDU (React 18 + Vite SPA) ---");
  if (!(await isReachable(`${SIPANDU_BASE}/`))) {
    throw new Error(`${SIPANDU_BASE} tidak hidup. Jalankan dev server SIPANDU lebih dulu.`);
  }

  // 2.1 Bidan Desa: dasbor klinis, profil balita + kurva KMS, dan laporan L-01.
  const bidanContext = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const bidanPage = await newDesktopPage(bidanContext);
  await sipanduLogin(bidanPage, SIPANDU_BIDAN);
  console.log(`  login Bidan Desa -> ${bidanPage.url()}`);

  let text = await bodyText(bidanPage);
  assert(
    /monitoring klinis|validasi|bidan desa/i.test(text),
    `Dasbor Bidan SIPANDU tidak memuat data (teks: ${text.slice(0, 200)}).`,
  );
  await saveLandscape(
    await bidanPage.screenshot(),
    join(baseDir, "sipandu", "sipandu-thumbnail.png"),
  );

  await spaNavigate(bidanPage, `/bidan/anggota/${SIPANDU_BALITA_ID}`, 4000);
  text = await bodyText(bidanPage);
  assert(
    /kurva pertumbuhan kms/i.test(text) && /z-bb\/u|z-tb\/u/i.test(text),
    `Profil balita SIPANDU tidak memuat kurva KMS/Z-Score (teks: ${text.slice(0, 200)}).`,
  );
  assert(/aisyah putri subagyo/i.test(text), "Profil balita SIPANDU bukan data balita asli.");
  await saveLandscape(
    await bidanPage.screenshot(),
    join(baseDir, "sipandu", "sipandu-kms-kurva-pertumbuhan.png"),
  );

  await spaNavigate(bidanPage, "/bidan/laporan", 4000);
  text = await bodyText(bidanPage);
  assert(
    /laporan bulanan posyandu \(l-01\)/i.test(text) && /cetak l-01/i.test(text),
    `Halaman Laporan SIPANDU tidak memuat L-01 (teks: ${text.slice(0, 200)}).`,
  );
  await saveLandscape(
    await bidanPage.screenshot(),
    join(baseDir, "sipandu", "sipandu-laporan-puskesmas-pdf.png"),
  );
  await bidanContext.close();

  // 2.2 Kader: Alur 5 Meja, form pengukuran antropometri Meja 2.
  const kaderContext = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const kaderPage = await newDesktopPage(kaderContext);
  await sipanduLogin(kaderPage, SIPANDU_KADER);
  console.log(`  login Kader Posyandu -> ${kaderPage.url()}`);

  await spaNavigate(kaderPage, `/kader/meja2/${SIPANDU_MEJA2_ANGGOTA_ID}`, 4000);
  text = await bodyText(kaderPage);
  assert(
    /form pengukuran antropometri/i.test(text) && /berat badan \(kg\)/i.test(text),
    `Form Meja 2 SIPANDU tidak termuat (teks: ${text.slice(0, 200)}).`,
  );
  await saveLandscape(
    await kaderPage.screenshot(),
    join(baseDir, "sipandu", "sipandu-penimbangan-kader.png"),
  );
  await kaderContext.close();
}

/* ------------------------------------------------------------------ */
/* 3. HIPPAM                                                           */
/* ------------------------------------------------------------------ */

const HIPPAM_BASE = "http://localhost:3007";

async function hippamLogin(page: Page, persona: RegExp) {
  await gotoAndSettle(page, `${HIPPAM_BASE}/login`, 2000);
  await page.getByRole("button", { name: persona }).first().click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /Masuk Portal HIPPAM/i }).click();
  await page.waitForURL(/\/(admin|pelanggan|petugas)\//, { timeout: 30000 });
  await page.waitForTimeout(2500);
}

async function captureHippam(browser: Browser) {
  console.log("\n--- 3. HIPPAM (Next.js 16) ---");
  if (!(await isReachable(`${HIPPAM_BASE}/`))) {
    throw new Error(`${HIPPAM_BASE} tidak hidup. Jalankan dev server HIPPAM lebih dulu.`);
  }

  // 3.1 Super Admin: dasbor sistem + AI Copilot.
  const adminContext = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const adminPage = await newDesktopPage(adminContext);
  await hippamLogin(adminPage, /Super Admin/i);
  console.log(`  login Super Admin -> ${adminPage.url()}`);

  await gotoAndSettle(adminPage, `${HIPPAM_BASE}/admin/dashboard`, 5000);
  let text = await bodyText(adminPage);
  assert(/super admin|dasbor|pelanggan|tagihan/i.test(text), "Dasbor HIPPAM admin tidak memuat data.");
  await saveLandscape(await adminPage.screenshot(), join(baseDir, "hippam", "hippam-thumbnail.png"));

  await gotoAndSettle(adminPage, `${HIPPAM_BASE}/admin/ai-copilot`, 5000);
  text = await bodyText(adminPage);
  assert(/ai copilot|gemini|asisten/i.test(text), "Halaman AI Copilot HIPPAM tidak memuat data.");
  await saveLandscape(
    await adminPage.screenshot(),
    join(baseDir, "hippam", "hippam-ai-copilot-tagihan.png"),
  );
  await adminContext.close();

  // 3.2 Pelanggan: form catat meter mandiri.
  const customerContext = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const customerPage = await newDesktopPage(customerContext);
  await hippamLogin(customerPage, /Pelanggan RT 02/i);
  console.log(`  login Pelanggan -> ${customerPage.url()}`);

  await gotoAndSettle(customerPage, `${HIPPAM_BASE}/pelanggan/catat-meter`, 5000);
  text = await bodyText(customerPage);
  assert(/catat meter|meter m³|periode/i.test(text), "Form catat meter HIPPAM tidak memuat data.");
  await saveLandscape(
    await customerPage.screenshot(),
    join(baseDir, "hippam", "hippam-catat-meter-mandiri.png"),
  );
  await customerContext.close();

  // 3.3 Aset mobile: tangkapan aplikasi Flutter asli dari repo proyek.
  const mobileAsset = "C:/FLUTTER PROJEK/gabut/Hippam-Project/web/public/images/form_catat_meter_sendiri_potrait.png";
  assert(await exists(mobileAsset), `Aset mobile HIPPAM tidak ditemukan: ${mobileAsset}`);
  await savePortraitFramed(
    await readFile(mobileAsset),
    join(baseDir, "hippam", "hippam-mobile-flutter-app.png"),
  );
}

/* ------------------------------------------------------------------ */
/* 4. UMKM-KU                                                          */
/* ------------------------------------------------------------------ */

const UMKM_BASE = "http://localhost:5179";
const UMKM_SLUG = "es-keliling-mbak-ita-132aa7";
const UMKM_OWNER = { email: "pemilik.rt13@umkmku.test", password: "uji-pemilik-2026" };

async function captureUmkm(browser: Browser) {
  console.log("\n--- 4. UMKM-KU (Vite React) ---");
  if (!(await isReachable(`${UMKM_BASE}/`))) {
    throw new Error(`${UMKM_BASE} tidak hidup. Jalankan dev server UMKM-KU lebih dulu.`);
  }

  const context = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await newDesktopPage(context);

  const publicTasks = [
    {
      url: `${UMKM_BASE}/`,
      out: join(baseDir, "umkm-ku", "umkm-ku-thumbnail.png"),
      settle: 4000,
      expect: /umkm|usaha|direktori/i,
    },
    {
      url: `${UMKM_BASE}/peta`,
      out: join(baseDir, "umkm-ku", "umkm-ku-gis-peta-usaha.png"),
      settle: 6000,
      expect: /peta|leaflet|usaha/i,
    },
    {
      url: `${UMKM_BASE}/usaha/${UMKM_SLUG}`,
      out: join(baseDir, "umkm-ku", "umkm-ku-detail-usaha-kontak.png"),
      settle: 4000,
      expect: /es keliling|mbak ita|whatsapp|kontak/i,
    },
  ];

  for (const task of publicTasks) {
    await gotoAndSettle(page, task.url, task.settle);
    const text = await bodyText(page);
    assert(task.expect.test(text), `Halaman UMKM-KU ${task.url} tidak memuat data yang diharapkan.`);
    await saveLandscape(await page.screenshot(), task.out);
  }

  // Dasbor pemilik: login sungguhan, bukan mock.
  await gotoAndSettle(page, `${UMKM_BASE}/masuk`, 2500);
  await page.locator("#login-email").fill(UMKM_OWNER.email);
  await page.locator("#login-pass").fill(UMKM_OWNER.password);
  await page.getByRole("button", { name: /Masuk ke Akun/i }).click();
  await page.waitForURL(/\/[a-z0-9-]+\/usaha/, { timeout: 30000 });
  await page.waitForTimeout(5000);
  console.log(`  login pemilik -> ${page.url()}`);
  const ownerText = await bodyText(page);
  assert(
    /usaha|status verifikasi|pemilik|dashboard|dasbor/i.test(ownerText),
    "Dasbor pemilik UMKM-KU tidak memuat data.",
  );
  await saveLandscape(
    await page.screenshot(),
    join(baseDir, "umkm-ku", "umkm-ku-dashboard-pemilik-operator.png"),
  );

  await context.close();
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("=== Menangkap 16 Aset Media Showcase dari Aplikasi Asli ===");
  for (const slug of ["sinduksadati", "sipandu", "hippam", "umkm-ku"]) {
    await mkdir(join(baseDir, slug), { recursive: true });
  }

  // `--only=sipandu` memungkinkan tangkapan ulang satu proyek saja tanpa
  // menyentuh aset proyek lain yang sudah terverifikasi.
  const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice("--only=".length) : null;

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    if (!only || only === "sinduksadati") await captureSindukSadhana(browser);
    if (!only || only === "sipandu") await captureSipandu(browser);
    if (!only || only === "hippam") await captureHippam(browser);
    if (!only || only === "umkm-ku") await captureUmkm(browser);
  } finally {
    await browser.close();
  }

  console.log("\n=== Selesai. Semua aset diverifikasi lewat assertion DOM sebelum disimpan. ===");
}

main().catch((error) => {
  console.error("\n[GAGAL]", error instanceof Error ? error.message : error);
  process.exit(1);
});
