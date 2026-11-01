import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { expect, type Page } from "@playwright/test";
import type { Database } from "../../src/db/connection";
import { contentVersions, pages } from "../../src/db/schema/content";
import { faqs } from "../../src/db/schema/faqs";
import { siteSettings } from "../../src/db/schema/settings";

export async function checkCmsBrowser(page: Page, db: Database, origin: string) {
  const slug = `browser-${randomUUID()}`;
  const anonymous = await page.context().browser()!.newContext();
  const visitor = await anonymous.newPage();
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  let pageId: string | undefined;
  let stage = "settings";
  try {
    page.setDefaultTimeout(60000);
    await page.goto(`${origin}/admin/settings`);
    await page.getByRole("button", { name: "Hero", exact: true }).click();
    await page.getByLabel("Headline", { exact: true }).fill("CMS browser headline");
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Pengaturan berhasil" })).toBeVisible();
    await visitor.goto(origin);
    await expect(visitor.getByRole("heading", { name: "CMS browser headline", exact: true })).toBeVisible();
    console.log("PASS: admin Settings updates the real public homepage without deployment.");
    stage = "page builder";
    await page.goto(`${origin}/admin/pages`);
    await page.getByLabel("Judul halaman", { exact: true }).fill("Browser CMS page");
    await page.getByLabel(/^Slug URL/).fill(slug);
    await page.getByRole("button", { name: "Tambah blok", exact: true }).click();
    await page.getByLabel("Headline", { exact: true }).fill("Browser draft content");
    await page.getByRole("button", { name: "Simpan sebagai draft", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Draft halaman berhasil" })).toBeVisible();
    const [record] = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug)); pageId = record.id;
    await visitor.goto(`${origin}/${slug}`);
    await expect(visitor.getByRole("heading", { name: "Halaman Tidak Ditemukan atau Sesi Kedaluwarsa" })).toBeVisible();
    stage = "draft preview";
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Preview tersimpan", exact: true }).click();
    const popup = await popupPromise;
    await popup.getByRole("button", { name: "Buka preview draft", exact: true }).click();
    await expect(popup.getByRole("heading", { name: "Browser draft content", exact: true })).toBeVisible();
    await visitor.goto(`${origin}/admin/preview/${slug}`);
    await expect(visitor).toHaveURL(/\/admin\/login$/);
    await popup.getByRole("button", { name: "Keluar Draft Mode", exact: true }).click();
    await popup.close();
    page.on("dialog", (dialog) => void dialog.accept());
    await page.getByRole("listitem").filter({ hasText: "Browser CMS page" }).getByRole("button", { name: "Terbitkan", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Halaman berhasil diterbitkan" })).toBeVisible();
    await visitor.goto(`${origin}/${slug}`);
    await expect(visitor.getByRole("heading", { name: "Browser draft content", exact: true })).toBeVisible();
    console.log("PASS: Page Builder saves a private draft, authorizes session-bound Draft Mode, and publishes to the real public route.");
    stage = "draft and layout changes";
    await page.getByLabel("Headline", { exact: true }).fill("Unpublished changed content");
    await page.getByRole("button", { name: "Simpan sebagai draft", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Draft halaman berhasil" })).toBeVisible();
    await visitor.reload();
    await expect(visitor.getByRole("heading", { name: "Browser draft content", exact: true })).toBeVisible();
    await expect(visitor.getByText("Unpublished changed content", { exact: true })).toHaveCount(0);
    for (const width of [360, 768, 1440]) {
      await visitor.setViewportSize({ width, height: 900 });
      expect(await visitor.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    console.log("PASS: unpublished edits stay private and published blocks fit 360/768/1440px viewports.");
    stage = "FAQ";
    await page.goto(`${origin}/admin/faqs`);
    await page.getByLabel("Pertanyaan", { exact: true }).fill(slug);
    await page.getByLabel(/^Jawaban/).fill("Test-only FAQ answer");
    await page.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "berhasil disimpan" })).toBeVisible({ timeout: 20000 });
    await expect
      .poll(async () => (await db.select().from(faqs)).some((row) => row.question === slug), { timeout: 20000 })
      .toBe(true);
    console.log("PASS: FAQ admin form persists a database record (inactive test fixture).");
    stage = "admin routes";
    for (const route of ["dashboard", "packages", "addons", "testimonials", "users", "audit-logs", "invoice", "template-tahap", "berkas"]) {
      await page.goto(`${origin}/admin/${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
    }
    console.log("PASS: new CMS, staff, audit, invoice, template and private-file admin routes load with an MFA owner session.");
  } catch (error) {
    const visible = await page.locator("body").innerText().catch(() => "");
    throw new Error(`CMS browser verification failed at ${stage}: ${error instanceof Error ? error.message.slice(0, 400).replace(/\s+/g, " ") : "unknown error"} | url=${page.url()} | page=${visible.replace(/\s+/g, " ").slice(0, 1000)}`);
  }
  finally {
    await anonymous.close();
    await db.delete(faqs).where(eq(faqs.question, slug));
    if (pageId) { await db.delete(contentVersions).where(eq(contentVersions.docId, pageId)); await db.delete(pages).where(eq(pages.id, pageId)); }
    if (settings) await db.update(siteSettings).set({ data: settings.data }).where(eq(siteSettings.id, 1));
  }
}
