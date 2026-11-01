import { createHmac, randomUUID } from "node:crypto";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { expect, type Browser } from "@playwright/test";
import type { Database } from "../../src/db/connection";
import { authUser, authAccount, authSession } from "../../src/db/schema/admin-identity";
import { adminProfiles } from "../../src/db/schema/admin-profile";
import { auditLogs } from "../../src/db/schema/audit";
import { rateLimits } from "../../src/db/schema/rate-limits";
import { adminLoginFailures } from "../../src/db/schema/admin-login-failures";

function totp(secret: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const letter of secret.toUpperCase().replace(/=+$/, "")) bits += alphabet.indexOf(letter).toString(2).padStart(5, "0");
  const key = Buffer.from(bits.match(/.{8}/g)!.map((byte) => parseInt(byte, 2)));
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const digest = createHmac("sha1", key).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, "0");
}

export async function checkAuthBrowser(browser: Browser, db: Database, origin: string, secret: string) {
  const id = randomUUID(); const email = `auth-browser-${id}@example.test`; const password = `test-${randomUUID()}`;
  const keyHash = createHmac("sha256", secret).update(`admin-login:v1:${email}`).digest("hex");
  const context = await browser.newContext();
  let stage = "fixture";
  try {
    await db.insert(authUser).values({ id, name: "Isolated editor", email, createdAt: new Date(), updatedAt: new Date() });
    await db.insert(adminProfiles).values({ id, authUserId: id, role: "editor" });
    await db.insert(authAccount).values({ id: randomUUID(), accountId: id, userId: id, providerId: "credential", password: await hashPassword(password), createdAt: new Date(), updatedAt: new Date() });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    stage = "password and enrollment";
    await page.goto(`${origin}/admin/login`);
    await page.getByLabel("EMAIL / USERNAME ADMIN").fill(email);
    await page.getByLabel("KATA SANDI UTAMA").fill(password);
    const enrollmentResponse = page.waitForResponse((response) => response.url().endsWith("/api/admin/enroll/start"));
    await page.getByRole("button", { name: "Lanjutkan ke Verifikasi 2FA" }).click();
    const enrollment = await (await enrollmentResponse).json();
    const seed = new URL(enrollment.totpURI).searchParams.get("secret")!;
    const recovery = enrollment.backupCodes[0];
    const protectedPage = await context.newPage();
    await protectedPage.goto(`${origin}/admin/settings`);
    await expect(protectedPage).toHaveURL(/\/admin\/login$/);
    await protectedPage.close();
    await page.getByLabel("Masukkan 6-Digit Kode Konfirmasi dari Authenticator:").fill(totp(seed));
    await page.getByRole("button", { name: "Konfirmasi & Aktifkan", exact: true }).click();
    await page.waitForURL("**/admin/dashboard");
    console.log("PASS: real password login, TOTP enrollment, and password-only session denial through HTTP/browser.");
    stage = "editor restrictions and CSRF";
    await page.goto(`${origin}/admin/proyek-klien`);
    await expect(page.getByRole("heading", { name: "Halaman Tidak Ditemukan atau Sesi Kedaluwarsa" })).toBeVisible();
    const csrf = await context.request.post(`${origin}/api/admin/login`, { headers: { Origin: "https://foreign.example.test" }, data: { email, password } });
    expect(csrf.status()).toBe(403);
    const signup = await context.request.post(`${origin}/api/auth/sign-up/email`, { headers: { Origin: origin }, data: { email: "nobody@example.test", name: "Denied", password } });
    expect(signup.ok()).toBe(false);
    console.log("PASS: editor cannot access client operations, cross-origin login is denied, public signup is closed.");
    stage = "second login and recovery";
    const signedOut = await context.request.post(`${origin}/api/admin/logout`, { headers: { Origin: origin }, data: {} });
    if (!signedOut.ok()) throw new Error(`sign-out status=${signedOut.status()} body=${(await signedOut.text()).slice(0, 200).replace(/\s+/g, " ")}`);
    await page.goto(`${origin}/admin/login`);
    await page.getByLabel("EMAIL / USERNAME ADMIN").fill(email);
    await page.getByLabel("KATA SANDI UTAMA").fill(password);
    await page.getByRole("button", { name: "Lanjutkan ke Verifikasi 2FA" }).click();
    await page.getByRole("heading", { name: "Verifikasi Dua Langkah (TOTP)" }).waitFor();
    await page.getByRole("button", { name: "Gunakan kode pemulihan cadangan?", exact: true }).click();
    await page.getByLabel("KODE PEMULIHAN CADANGAN (RECOVERY CODE)").fill(recovery);
    await page.getByRole("button", { name: "Masuk ke Dashboard CMS" }).click();
    await page.waitForURL("**/admin/dashboard");
    await context.request.post(`${origin}/api/admin/logout`, { headers: { Origin: origin }, data: {} });
    await context.request.post(`${origin}/api/admin/login`, { headers: { Origin: origin }, data: { email, password } });
    const replay = await context.request.post(`${origin}/api/admin/totp`, { headers: { Origin: origin }, data: { method: "recovery", code: recovery } });
    expect(replay.status()).toBe(401);
    console.log("PASS: subsequent login requires MFA, recovery succeeds once, and replay is rejected.");
  } catch (error) {
    const activePage = context.pages()[context.pages().length - 1];
    const visible = await activePage?.locator("body").innerText().catch(() => "");
    throw new Error(
      `Isolated auth browser verification failed at ${stage}: ${
        error instanceof Error ? error.message.slice(0, 400).replace(/\s+/g, " ") : "unknown error"
      } | url=${activePage?.url() ?? ""} | page=${(visible ?? "").replace(/\s+/g, " ").slice(0, 800)}`,
    );
  }
  finally {
    await context.close();
    await db.delete(auditLogs).where(eq(auditLogs.actorId, id));
    await db.delete(authSession).where(eq(authSession.userId, id));
    await db.delete(adminProfiles).where(eq(adminProfiles.id, id));
    await db.delete(authUser).where(eq(authUser.id, id));
    await db.delete(adminLoginFailures).where(eq(adminLoginFailures.keyHash, keyHash));
    await db.delete(rateLimits).where(or(eq(rateLimits.keyHash, keyHash), eq(rateLimits.keyHash, id)));
  }
}
