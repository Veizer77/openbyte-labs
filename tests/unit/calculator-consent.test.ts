import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Persetujuan pemrosesan data di kalkulator pernah tidak nyata.
 *
 * Kalkulator menyimpan `consent` di state dan meneruskan `consentText` lewat
 * context, tetapi tidak pernah merender checkbox: nilainya selalu `true` karena
 * di-hardcode saat memanggil `submitQuoteAction`. Akibatnya `consent_at` di
 * database tercatat untuk pengunjung yang tidak pernah menyetujui apa pun —
 * cacat kepatuhan UU PDP, bukan sekadar cacat UI.
 *
 * Skema server sudah benar (`consent: z.literal(true)`), jadi perbaikannya harus
 * di klien: checkbox yang dirender, submit yang diblokir saat belum dicentang,
 * dan nilai state yang dikirim — bukan literal `true`.
 *
 * Tes ini membaca sumber karena komponennya memakai context provider dan
 * Turnstile; menguncinya di tingkat sumber mencegah regresi termudah: literal
 * `true` kembali tanpa ada error yang terlihat.
 */

const source = readFileSync(
  join(process.cwd(), "src/components/public/Calculator.tsx"),
  "utf8",
);

describe("persetujuan kalkulator", () => {
  it("tidak lagi mengirim persetujuan sebagai literal true", () => {
    expect(source).not.toMatch(/consent:\s*true/);
  });

  it("mengirim nilai state persetujuan ke server", () => {
    expect(source).toMatch(/consent,\s*\r?\n\s*turnstileToken,/);
  });

  it("merender checkbox persetujuan yang terikat ke state", () => {
    expect(source).toContain('id="calc-consent"');
    expect(source).toContain('type="checkbox"');
    expect(source).toContain("checked={consent}");
    expect(source).toContain("onChange={(event) => setConsent(event.target.checked)}");
  });

  it("memulai tanpa persetujuan", () => {
    expect(source).toMatch(/const \[consent, setConsent\] = useState\(false\)/);
  });

  it("memblokir pengiriman sebelum persetujuan dicentang", () => {
    expect(source).toMatch(/if \(!consent\) \{/);
  });

  it("menampilkan teks persetujuan dari pengaturan situs, bukan teks mati", () => {
    expect(source).toContain("{consentText}");
  });
});
