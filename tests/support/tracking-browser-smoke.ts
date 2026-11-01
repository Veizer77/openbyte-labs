import { randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, inArray, or, like } from "drizzle-orm";
import { chromium } from "@playwright/test";
import { hashPassword } from "better-auth/crypto";
import { validateTestDatabase } from "../../src/db/test-target";
import { createAdminAuth } from "../../src/auth/configuration";
import {
  authUser,
  authAccount,
  authSession,
  authTwoFactor,
} from "../../src/db/schema/admin-identity";
import { adminProfiles } from "../../src/db/schema/admin-profile";
import { adminSessionAssurances } from "../../src/db/schema/admin-session-assurance";
import { siteSettings } from "../../src/db/schema/settings";
import { clientProjects, projectApprovals } from "../../src/db/schema/portal";
import { auditLogs } from "../../src/db/schema/audit";
import { rateLimits } from "../../src/db/schema/rate-limits";
import { defaultSiteSettings } from "../../src/seed/site-settings-defaults";
import { trackingRateKey } from "../../src/lib/tracking/security";
import { hashClientIp } from "../../src/security/client-ip-hash";
import { checkAuthBrowser } from "./auth-browser-check";
import { checkCmsBrowser } from "./cms-browser-check";

loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const target = validateTestDatabase(process.env);
const connection = postgres(target.uri, {
  max: 4,
  prepare: false,
  connect_timeout: 10,
});
const db = drizzle(connection);
const origin = "http://127.0.0.1:3102";
const secret = "isolated-browser-tracking-test-secret-32-characters";
const marker = `tracking-browser-${randomUUID()}`;
const actor = randomUUID();
const password = `test-${randomUUID()}`;
let child: ChildProcess | undefined;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
let projectId: string | undefined;
let trackingCode: string | undefined;
let originalSettings: typeof siteSettings.$inferSelect | undefined;
let createdSettings = false;
let stage = "database fixture";
let serverError = "";
const runtimeErrors: string[] = [];
const assert = (value: unknown, message: string) => {
  if (!value) throw new Error(message);
};

async function main() {
  [originalSettings] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  if (!originalSettings) {
    await db
      .insert(siteSettings)
      .values({ id: 1, data: defaultSiteSettings() });
    createdSettings = true;
  }
  const browserSettings = originalSettings?.data ?? defaultSiteSettings();
  await db.update(siteSettings).set({ data: { ...browserSettings, tracking: { ...browserSettings.tracking, revisionWindowDays: 14, bugWarrantyDays: 30 } } }).where(eq(siteSettings.id, 1));
  await db.insert(authUser).values({
    id: actor,
    name: "Tracking browser owner",
    email: `${marker}@example.test`,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db
    .insert(adminProfiles)
    .values({ id: actor, authUserId: actor, role: "owner" });
  await db.insert(authAccount).values({
    id: randomUUID(),
    accountId: actor,
    userId: actor,
    providerId: "credential",
    password: await hashPassword(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const auth = createAdminAuth(db, {
    baseURL: origin,
    secret,
    production: false,
  });
  stage = "test admin session";
  const response = await auth.api.signInEmail({
    body: { email: `${marker}@example.test`, password },
    asResponse: true,
  });
  assert(response.ok, "Test admin session could not be created.");
  const setCookies = response.headers.getSetCookie();
  const [session] = await db
    .select()
    .from(authSession)
    .where(eq(authSession.userId, actor));
  assert(session, "Test session not found.");
  await db
    .update(authUser)
    .set({ twoFactorEnabled: true })
    .where(eq(authUser.id, actor));
  await db.insert(authTwoFactor).values({
    id: randomUUID(),
    userId: actor,
    secret: "test-only-assurance-fixture",
    backupCodes: "test-only",
    verified: true,
  });
  await db.insert(adminSessionAssurances).values({
    sessionId: session.id,
    adminProfileId: actor,
    method: "totp",
    verifiedAt: new Date(),
    expiresAt: session.expiresAt,
  });
  stage = "isolated server startup";
  child = spawn(
    process.execPath,
    ["--import", "tsx", "tests/support/tracking-browser-server.ts"],
    {
      env: {
        ...process.env,
        NODE_ENV: "development",
        DATABASE_URI: target.uri,
        SITE_URL: origin,
        BETTER_AUTH_URL: origin,
        BETTER_AUTH_SECRET: secret,
        NEXT_OUTPUT_DIR: ".next/tracking-browser",
        TRACKING_ISOLATED_BROWSER_TEST: "confirmed",
      },
      stdio: ["ignore", "pipe", "pipe", "ipc"],
    },
  );
  // Only compiler progress is forwarded; request bodies, cookies, PINs and URLs are never logged.
  child.stdout?.on("data", () => {});
  child.stderr?.on("data", (chunk: Buffer) => {
    serverError = (serverError + chunk.toString()).slice(-4000);
  });
  await Promise.race([
    once(child, "message"),
    once(child, "exit").then(() => {
      throw new Error(
        `Isolated server startup: ${serverError.replace(/\s+/g, " ")}`,
      );
    }),
  ]);
  stage = "browser launch";
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const owner = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await owner.addCookies(
    setCookies.map((value) => {
      const pair = value.split(";")[0];
      const at = pair.indexOf("=");
      return {
        name: pair.slice(0, at),
        value: pair.slice(at + 1),
        url: origin,
        httpOnly: true,
        sameSite: "Lax" as const,
      };
    }),
  );
  const admin = await owner.newPage();
  const errors: string[] = [];
  admin.on("pageerror", (error) => {
    errors.push(error.message);
    runtimeErrors.push(error.message);
  });
  if (process.argv.includes("--cms-only")) {
    stage = "CMS browser verification";
    await checkCmsBrowser(admin, db, origin);
    stage = "HTTP auth browser verification";
    await checkAuthBrowser(browser, db, origin, secret);
    assert(runtimeErrors.length === 0, "CMS browser runtime errors.");
    return;
  }
  stage = "admin page";
  await admin.goto(`${origin}/admin/proyek-klien`);
  await admin
    .getByRole("button", { name: "Buat Proyek Klien", exact: true })
    .waitFor();
  await admin
    .getByRole("button", { name: "Buat Proyek Klien", exact: true })
    .click();
  stage = "project form";
  const form = admin
    .getByRole("heading", { name: "Proyek Klien Baru" })
    .locator("..");
  await form.getByLabel("Nama proyek", { exact: true }).fill(marker);
  await form.getByLabel("Nama klien", { exact: true }).fill(marker);
  await form.getByLabel("WhatsApp klien", { exact: true }).fill("081234567890");
  await form.getByLabel("Total biaya (Rp)", { exact: true }).fill("1000000");
  await form.getByLabel("Pembayaran", { exact: true }).check();
  await form.getByLabel("Dokumen", { exact: true }).check();
  await form.getByLabel("Timeline", { exact: true }).check();
  await form
    .getByRole("button", { name: "Buat Proyek & PIN", exact: true })
    .click();
  const credentials = admin.getByRole("region", { name: "Kredensial baru" });
  stage = "project creation";
  await credentials.waitFor();
  const text = await credentials.innerText();
  const code = /PRJ-[A-HJ-NP-Z2-9]{8}/.exec(text)?.[0];
  trackingCode = code;
  const pin = /PIN:\s*(\d{6})/.exec(text)?.[1];
  assert(
    code && pin,
    "The created project did not return one-time credentials.",
  );
  const [project] = await db
    .select({ id: clientProjects.id })
    .from(clientProjects)
    .where(eq(clientProjects.trackingCode, code!));
  projectId = project.id;
  console.log(
    "PASS: authenticated owner creates a database project and one-time PIN.",
  );
  await admin.getByRole("button", { name: "Saya sudah menyimpan PIN" }).click();
  admin.on("dialog", (dialog) => void dialog.accept());
  const enable = admin.getByRole("button", {
    name: "Aktifkan Portal",
    exact: true,
  });
  if (await enable.count()) {
    await enable.click();
    await admin
      .getByRole("button", { name: "Nonaktifkan Portal", exact: true })
      .waitFor();
  }
  console.log(
    "PASS: owner activates tracking through the guarded settings action.",
  );
  const client = await browser.newContext({
    viewport: { width: 360, height: 900 },
  });
  const page = await client.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  assert(
    (await page
      .getByRole("link", { name: "Tracking Klien", exact: true })
      .getAttribute("href")) === "/tracking",
    "Navbar still links to a demo instead of tracking.",
  );
  await page.getByRole("link", { name: "Tracking Klien", exact: true }).click();
  await page.getByLabel("KODE TRACKING PROYEK").fill(code!);
  await page.getByLabel("PIN AKSES KEAMANAN (6 digit)").fill(pin!);
  await page
    .getByRole("button", { name: "Verifikasi & Buka Dasbor Proyek" })
    .click();
  await page.waitForURL("**/tracking/proyek");
  await page.getByRole("heading", { name: marker, exact: true }).waitFor();
  assert(
    !(await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    )),
    "Mobile portal overflows.",
  );
  console.log(
    "PASS: real code/PIN login, scoped cookie, database portal and 360px layout.",
  );
  await admin.getByRole("button", { name: "Revisi", exact: true }).click();
  await admin
    .getByRole("button", { name: "Buka Review Klien", exact: true })
    .click();
  await admin
    .getByText("Perubahan proyek sudah tersimpan.", { exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Review & Revisi", exact: true })
    .click();
  await page
    .getByLabel("Judul revisi", { exact: true })
    .fill("Browser revision");
  await page
    .getByLabel("Rincian perubahan", { exact: true })
    .fill("Database-backed browser revision test.");
  await page
    .getByRole("button", { name: "Kirim Pengajuan", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Browser revision", exact: true })
    .waitFor();
  await admin.getByRole("button", { name: "Muat ulang", exact: true }).click();
  await admin.getByRole("button").filter({ hasText: marker }).first().click();
  await admin.getByRole("button", { name: "Revisi", exact: true }).click();
  await admin
    .getByRole("heading", { name: "Browser revision", exact: true })
    .waitFor();
  await admin
    .getByRole("button", { name: "Proses Revisi #1", exact: true })
    .click();
  await admin
    .getByText("Perubahan proyek sudah tersimpan.", { exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Review & Revisi", exact: true })
    .click();
  assert(
    (await page.locator("main").innerText()).includes("1 dari 2"),
    "Accepted revision quota was not updated.",
  );
  console.log(
    "PASS: client revision appears in admin and consumes quota only after acceptance.",
  );
  await page
    .getByRole("button", { name: "Diskusi Proyek", exact: true })
    .click();
  await page
    .getByLabel("Pesan untuk pengembang")
    .fill("CLIENT_BROWSER_COMMENT");
  await page
    .getByRole("button", { name: "Kirim Komentar", exact: true })
    .click();
  await page.getByText("CLIENT_BROWSER_COMMENT", { exact: true }).waitFor();
  await admin.getByRole("button", { name: "Diskusi", exact: true }).click();
  // Re-read the project after the separate client session writes its comment.
  await admin.getByRole("button").filter({ hasText: marker }).first().click();
  await admin.getByRole("button", { name: "Diskusi", exact: true }).click();
  await admin.getByText("CLIENT_BROWSER_COMMENT", { exact: true }).waitFor();
  await admin
    .getByLabel("Tanggapan atau catatan")
    .fill("INTERNAL_BROWSER_NOTE");
  await admin
    .getByLabel("Catatan internal (jangan tampilkan ke klien)")
    .check();
  await admin
    .getByRole("button", { name: "Kirim Tanggapan", exact: true })
    .click();
  await admin.getByText("INTERNAL_BROWSER_NOTE", { exact: true }).waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Diskusi Proyek", exact: true })
    .click();
  assert(
    !(await page.locator("body").innerText()).includes("INTERNAL_BROWSER_NOTE"),
    "Internal note leaked into the client portal.",
  );
  console.log(
    "PASS: client/admin discussion persists and internal notes stay hidden.",
  );
  stage = "payment form";
  await admin.getByRole("button", { name: "Pembayaran", exact: true }).click();
  await admin.getByLabel("Jumlah (Rp)", { exact: true }).fill("1000000");
  await admin
    .getByLabel("Tanggal dan jam pembayaran (waktu perangkat)")
    .fill("2026-10-31T10:00");
  await admin
    .getByRole("button", { name: "Simpan Pembayaran", exact: true })
    .click();
  await admin
    .getByText("Perubahan proyek sudah tersimpan.", { exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "Ringkasan Pembayaran", exact: true })
    .waitFor();
  assert(
    (await page.locator("main").innerText()).includes("Lunas"),
    "Payment was not reflected in the client portal.",
  );
  stage = "document form";
  await admin.getByRole("button", { name: "Dokumen", exact: true }).click();
  await admin
    .getByLabel("Judul dokumen", { exact: true })
    .fill("Browser document");
  await admin
    .getByLabel("URL HTTPS (kosongkan jika mengunggah berkas)")
    .fill("https://example.test/client-document");
  await admin
    .getByRole("button", { name: "Tambahkan Dokumen", exact: true })
    .click();
  await admin.getByText("Browser document · Tampil", { exact: true }).waitFor();
  stage = "timeline form";
  await admin.getByRole("button", { name: "Timeline", exact: true }).click();
  await admin
    .getByLabel("Judul pembaruan", { exact: true })
    .fill("Browser timeline update");
  await admin
    .getByLabel("Isi pembaruan", { exact: true })
    .fill("Database-backed project update.");
  await admin
    .getByRole("button", { name: "Terbitkan Pembaruan", exact: true })
    .click();
  await admin
    .getByRole("heading", { name: "Browser timeline update", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Dokumen & Timeline", exact: true })
    .click();
  assert(
    (await page
      .getByRole("link", { name: "Browser document", exact: true })
      .getAttribute("href")) === "https://example.test/client-document",
    "Document link was not persisted.",
  );
  await page
    .getByRole("heading", { name: "Browser timeline update", exact: true })
    .waitFor();
  console.log(
    "PASS: payment balance, shared document and project timeline persist across admin/client browsers.",
  );
  stage = "starting accepted revision";
  await admin.getByRole("button", { name: "Revisi", exact: true }).click();
  await admin
    .getByRole("button", { name: "Proses Revisi #1", exact: true })
    .click();
  await admin
    .getByText("#1 · revision · in_progress", { exact: true })
    .waitFor();
  stage = "finishing revision";
  await admin
    .getByRole("button", { name: "Proses Revisi #1", exact: true })
    .click();
  await admin.getByText("#1 · revision · done", { exact: true }).waitFor();
  await admin
    .getByRole("button", { name: "Tahap & Milestone", exact: true })
    .click();
  for (let step = 1; step <= 4; step++) {
    stage = `saving project step ${step}`;
    const details = admin.locator("details").filter({
      has: admin.getByRole("button", {
        name: `Simpan Tahap ${step}`,
        exact: true,
        includeHidden: true,
      }),
    });
    await details.locator("summary").click();
    await details.locator('select[name="status"]').selectOption("done");
    await details
      .getByRole("button", { name: `Simpan Tahap ${step}`, exact: true })
      .click();
    await details.locator("summary").filter({ hasText: "(done)" }).waitFor();
  }
  stage = "review approval";
  await page.reload();
  await page
    .getByRole("button", { name: "Review & Revisi", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Setujui Hasil Pekerjaan", exact: true })
    .click();
  await page.getByLabel("Masukkan ulang PIN", { exact: true }).fill(pin!);
  await page
    .getByRole("button", { name: "Catat Persetujuan", exact: true })
    .click();
  await page.getByText("Hasil review disetujui", { exact: true }).waitFor();
  stage = "final handover approval";
  await page
    .getByRole("button", { name: "Setujui Hasil Pekerjaan", exact: true })
    .click();
  await page.getByLabel("Jenis persetujuan").selectOption("final_handover");
  await page.getByLabel("Masukkan ulang PIN", { exact: true }).fill(pin!);
  await page
    .getByRole("button", { name: "Catat Persetujuan", exact: true })
    .click();
  await page.getByText("Serah terima disetujui", { exact: true }).waitFor();
  console.log(
    "PASS: step updates, revision completion, PIN-confirmed review and final handover work through real forms.",
  );
  for (const width of [1440, 768, 360]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )),
      `Portal overflows at ${width}px.`,
    );
  }
  await admin.setViewportSize({ width: 360, height: 900 });
  assert(
    !(await admin.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    )),
    "Admin tracking overflows at 360px.",
  );
  const protectedResponse = await page.request.get(`${origin}/tracking/proyek`);
  assert(
    /no-store/.test(protectedResponse.headers()["cache-control"] ?? ""),
    "Tracking response lacks no-store.",
  );
  assert(
    /noindex/.test(protectedResponse.headers()["x-robots-tag"] ?? ""),
    "Tracking response lacks noindex.",
  );
  console.log(
    "PASS: client layouts at 1440/768/360px, admin at 360px, no-store and noindex headers.",
  );
  stage = "logout and PIN revocation";
  await page.getByRole("button", { name: "Keluar Sesi", exact: true }).click();
  await page.waitForURL("**/tracking");
  await page.goto(`${origin}/tracking/proyek`);
  await page.waitForURL("**/tracking");
  console.log(
    "PASS: logout clears the session and unauthenticated portal access redirects.",
  );
  await page.getByLabel("KODE TRACKING PROYEK").fill(code!);
  await page.getByLabel("PIN AKSES KEAMANAN (6 digit)").fill(pin!);
  await page
    .getByRole("button", { name: "Verifikasi & Buka Dasbor Proyek" })
    .click();
  await page.waitForURL("**/tracking/proyek");
  await admin.setViewportSize({ width: 1440, height: 1000 });
  await admin
    .getByRole("button", { name: "Regenerasi PIN", exact: true })
    .click();
  await admin.getByRole("region", { name: "Kredensial baru" }).waitFor();
  await page.reload();
  await page.waitForURL("**/tracking");
  console.log(
    "PASS: rotating the PIN revokes an already active browser session.",
  );
  stage = "CMS browser verification";
  await checkCmsBrowser(admin, db, origin);
  stage = "HTTP auth browser verification";
  await checkAuthBrowser(browser, db, origin, secret);
  assert(errors.length === 0, `Browser runtime errors: ${errors.length}`);
  console.log(
    "PASS: no browser runtime errors. Test data will now be removed.",
  );
}

async function cleanup() {
  await browser?.close();
  if (child?.connected) {
    child.send("stop");
    await once(child, "exit");
  }
  const rows = await db
    .select({ id: clientProjects.id })
    .from(clientProjects)
    .where(eq(clientProjects.clientName, marker));
  const ids = [
    ...new Set([...rows.map((r) => r.id), ...(projectId ? [projectId] : [])]),
  ];
  if (ids.length) {
    await db
      .delete(projectApprovals)
      .where(inArray(projectApprovals.clientProjectId, ids));
    await db.delete(clientProjects).where(inArray(clientProjects.id, ids));
  }
  await db
    .delete(auditLogs)
    .where(
      or(
        eq(auditLogs.actorId, actor),
        ...(ids.length ? [inArray(auditLogs.docId, ids)] : []),
      ),
    );
  await db.delete(authSession).where(eq(authSession.userId, actor));
  await db.delete(adminProfiles).where(eq(adminProfiles.id, actor));
  await db.delete(authUser).where(eq(authUser.id, actor));
  const ipHash = hashClientIp("127.0.0.1", process.env.IP_HASH_SALT!);
  const rateKeys = [
    trackingRateKey(secret, `ip:${ipHash}`),
    ...(trackingCode
      ? [
          trackingRateKey(secret, `code:${trackingCode}`),
          trackingRateKey(secret, `pair:${trackingCode}:${ipHash}`),
        ]
      : []),
  ];
  await db
    .delete(rateLimits)
    .where(
      or(
        inArray(rateLimits.keyHash, rateKeys),
        ...ids.map((id) => like(rateLimits.keyHash, `${id}:%`)),
      ),
    );
  if (originalSettings)
    await db
      .update(siteSettings)
      .set({ data: originalSettings.data })
      .where(eq(siteSettings.id, 1));
  else if (createdSettings)
    await db.delete(siteSettings).where(eq(siteSettings.id, 1));
  await connection.end();
}
void main()
  .catch((error: unknown) => {
    let message =
      (error instanceof Error
        ? error.message.split("\n")[0]
        : "Unknown error") +
      ` Runtime: ${runtimeErrors.join(" | ")} Server: ${serverError.replace(/\s+/g, " ")}`;
    for (const [key, value] of Object.entries(process.env))
      if (
        value &&
        value.length > 3 &&
        /SECRET|KEY|DATABASE|TOKEN|PASSWORD/.test(key)
      )
        message = message.replaceAll(value, "[redacted]");
    message = message
      .replaceAll(secret, "[redacted]")
      .replaceAll(password, "[redacted]")
      .replace(/\b\d{6}\b/g, "[redacted]")
      .replace(/(?:https?|postgres(?:ql)?):\/\/\S+/g, "[url]")
      .replace(/\b[A-Za-z0-9_-]{24,}\b/g, "[redacted]");
    console.error(`Tracking browser smoke failed at ${stage}: ${message}`);
    process.exitCode = 1;
  })
  .finally(cleanup);
