import { test, expect } from "@playwright/test";
import inventory from "../../src/fixtures/screens.json";

async function expectRenderedNotFound(response: {
  status: () => number;
  text: () => Promise<string>;
}) {
  // Next.js may preserve HTTP 200 after streaming has begun; the not-found UI
  // remains the authoritative behavior in that case.
  expect([200, 404]).toContain(response.status());
  expect(await response.text()).toContain(
    "Halaman Tidak Ditemukan atau Sesi Kedaluwarsa",
  );
}

for (const screen of inventory) {
  test(`layar ${screen.key}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(`/preview/${screen.key}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("[data-screen]").first()).toBeVisible();
    await expect(page.getByTestId("preview-indicator")).toBeVisible();
    expect(errors).toEqual([]);
  });
  test(`mobile ${screen.key}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/preview/${screen.key}`);
    await expect(page.locator("[data-screen]").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("navigasi publik dan status aktivasi tracking", async ({ page, request }) => {
  await page.goto("/");
  await page
    .locator("header nav")
    .getByRole("link", { name: "Proyek Portofolio", exact: true })
    .click();
  await expect(page).toHaveURL(/\/proyek$/);
  const tracking = page.getByRole("link", {
    name: "Tracking Klien",
    exact: true,
  });
  const response = await request.get("/tracking");
  const enabled = !(await response.text()).includes("Halaman Tidak Ditemukan atau Sesi Kedaluwarsa");
  if (enabled) {
    await expect(tracking).toHaveAttribute("href", "/tracking");
    await tracking.click();
    await expect(page.getByRole("heading", { name: "Portal Pelacakan Proyek Klien", exact: true })).toBeVisible();
    await page.goto("/tracking/proyek");
    await expect(page).toHaveURL(/\/tracking$/);
  } else {
    await expect(tracking).toHaveCount(0);
    await expectRenderedNotFound(await request.get("/tracking"));
    await expectRenderedNotFound(await request.get("/tracking/proyek"));
  }
  await expectRenderedNotFound(await request.get("/tracking/portal"));
  await expectRenderedNotFound(await request.get("/tracking/auth"));
});

for (const width of [360, 768]) {
  test(`navbar Tracking Klien pada ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const response = await request.get("/tracking");
    const enabled = !(await response.text()).includes("Halaman Tidak Ditemukan atau Sesi Kedaluwarsa");
    const tracking = page.getByRole("link", { name: "Tracking Klien", exact: true });
    if (enabled) {
      await tracking.click();
      await expect(page).toHaveURL(/\/tracking$/);
      await expect(page.getByRole("heading", { name: "Portal Pelacakan Proyek Klien", exact: true })).toBeVisible();
    } else {
      await expect(tracking).toHaveCount(0);
    }
  });
}

test("kalkulator bereaksi, rules, dan units", async ({ page }) => {
  await page.goto("/kalkulator");
  await expect(
    page.getByRole("radio", { name: "Web Saja", exact: true }),
  ).toBeChecked();
  await page
    .getByRole("radio", { name: "Landing Page Profil", exact: true })
    .click();
  await expect(
    page.getByText("600.000 - 1.200.000", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("radio", { name: "Android Saja", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Tambah halaman", exact: true })
    .click();
  await expect(
    page.getByText("675.000 - 1.350.000", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "Multi-User RBAC & Autentikasi",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("radio", {
      name: "Sistem Informasi / Web App",
      exact: true,
    }),
  ).toBeChecked();
});

test("form inquiry: validasi input dan retensi saat kirim", async ({
  page,
}) => {
  await page.goto("/pesan");
  await page
    .getByRole("button", { name: "Kirim Permintaan Penawaran" })
    .click();
  await expect(page.getByText("Nama minimal 2 karakter.")).toBeVisible();
  await page.getByRole("textbox", { name: "NAMA LENGKAP" }).fill("Izzat");
  await page
    .getByRole("textbox", { name: "NOMOR WHATSAPP" })
    .fill("0895386011371");
  await page
    .getByRole("textbox", { name: "RINGKASAN KEBUTUHAN" })
    .fill("Website katalog produk UMKM");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Kirim Permintaan Penawaran" })
    .click();
  // Isian pengguna tetap dipertahankan dan tidak menampilkan sukses palsu tanpa respons server valid
  await expect(page.getByRole("textbox", { name: "NAMA LENGKAP" })).toHaveValue(
    "Izzat",
  );
  await expect(
    page.getByRole("textbox", { name: "NOMOR WHATSAPP" }),
  ).toHaveValue("0895386011371");
});

test("booking: tanggal, slot, validasi", async ({ page }) => {
  await page.goto("/konsultasi");
  await expect(
    page.getByRole("button", { name: "Bulan berikutnya" }),
  ).toBeVisible();
  await page
    .getByRole("button")
    .filter({ hasText: /^SESI 1/ })
    .first()
    .click();
  await page.getByRole("button", { name: "WA Call", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "WA Call", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Konfirmasi Reservasi Jadwal" })
    .click();
  await expect(page.getByText("Nama minimal 2 karakter.")).toBeVisible();
});

test("admin: tanpa sesi MFA diarahkan ke login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: "Masuk ke CMS Admin" }),
  ).toBeVisible();
});

test("FAQ dan filter portofolio", async ({ page }) => {
  await page.goto("/");
  const question = page
    .locator("summary")
    .filter({ hasText: "Berapa lama masa garansi" });
  await question.click();
  await expect(page.getByText(/Garansi bug awal mengikuti PRD/)).toBeVisible();
  await question.click();
  await expect(
    page.getByText(/Garansi bug awal mengikuti PRD/),
  ).not.toBeVisible();
  await page.goto("/preview/site/daftar-portofolio");
  await page
    .getByRole("button", { name: "Bisnis & UMKM 2", exact: true })
    .click();
  await expect(page.locator("article")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Semua Proyek 6", exact: true })
    .click();
  await expect(page.locator("article")).toHaveCount(6);
});

test("katalog publik hanya menautkan proyek yang diterbitkan", async ({
  page,
  request,
}) => {
  const response = await page.goto("/proyek");
  expect(response?.status()).toBe(200);
  const listing = page.getByRole("heading", {
    name: "Proyek yang telah diterbitkan",
  });
  if (await listing.count()) {
    const cards = page.locator("article");
    const count = await cards.count();
    for (let index = 0; index < count; index++) {
      const href = await cards
        .nth(index)
        .getByRole("link")
        .getAttribute("href");
      expect(href).toMatch(/^\/proyek\/[a-z0-9-]+$/);
      expect((await request.get(href!)).status(), href!).toBe(200);
    }
    await expectRenderedNotFound(
      await request.get("/proyek/e2e-proyek-yang-tidak-diterbitkan"),
    );
  } else {
    await expect(page.getByRole("alert")).toBeVisible();
  }
  await page.goto("/preview/site/beranda");
  const links = await page
    .locator("a[href^='/']")
    .evaluateAll((elements) => [
      ...new Set(elements.map((element) => element.getAttribute("href")!)),
    ]);
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
});

test("menu admin mobile bisa dibuka, navigasi, dan Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/preview/cms/dashboard-cms-admin");
  await page.getByRole("button", { name: "Buka menu admin" }).click();
  const menu = page.getByRole("dialog", { name: "Navigasi admin" });
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("link", { name: "Media", exact: false }),
  ).toHaveAttribute("href", "/admin/media");
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
});

test("media lokal: tolak SVG, preview dan alt", async ({ page }) => {
  await page.goto("/preview/cms/media");
  const input = page.locator("input[type=file]");
  await input.setInputFiles({
    name: "icon.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  });
  await expect(
    page.getByRole("alert").filter({ hasText: "SVG tidak diizinkan" }),
  ).toBeVisible();
  await input.setInputFiles("public/images/OpenByte Labs Tech Logo-1.png");
  await page
    .getByRole("textbox", { name: "Teks alternatif" })
    .fill("Dashboard contoh");
  await expect(
    page.getByRole("img", { name: "Dashboard contoh" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hapus dari preview" }).click();
  await expect(
    page.getByText("Belum ada media di preview.", { exact: false }),
  ).toBeVisible();
});

for (const width of [360, 768, 1024, 1440]) {
  for (const route of [
    "/",
    "/proyek",
    "/paket",
    "/kalkulator",
    "/konsultasi",
    "/admin",
    "/admin/login",
  ]) {
    test(`${route} viewport ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
      if (route === "/proyek" || route === "/paket") {
        await expect(page.locator("main").first()).toBeVisible();
      } else {
        await expect(page.locator("[data-screen]").first()).toBeVisible();
      }
    });
  }
}
