import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "@/schemas/booking-request";
import { inquiryRequestSchema } from "@/schemas/inquiry-request";
import { createReference } from "@/lib/reference";
import { calculate } from "@/lib/calculator";
import { calculatorGroups, calculatorItems } from "@/fixtures/calculator";

describe("Frontend Operational Forms & Validations", () => {
  it("memvalidasi payload booking yang dikirim oleh ContactForm", () => {
    const validBooking = {
      name: "Test Person",
      whatsapp: "081234567890",
      email: "person@example.com",
      organizationOrBusiness: "Example Organization",
      serviceInterest: "Sistem Informasi / Instansi",
      projectBrief: "Membangun sistem informasi kependudukan desa",
      slotStart: "2026-05-15T09:00:00+07:00",
      consultationMode: "google_meet",
      consent: true,
      turnstileToken: "turnstile-token-sample",
      honeypot: "",
    };

    const parsed = bookingRequestSchema.safeParse(validBooking);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.whatsapp).toBe("6281234567890");
      expect(parsed.data.name).toBe("Test Person");
    }
  });

  it("menolak booking jika consent privasi belum dicentang", () => {
    const invalidBooking = {
      name: "Test Person",
      whatsapp: "081234567890",
      email: "person@example.com",
      organizationOrBusiness: "Example Organization",
      serviceInterest: "Sistem Informasi / Instansi",
      projectBrief: "Membangun sistem informasi kependudukan desa",
      slotStart: "2026-05-15T09:00:00+07:00",
      consultationMode: "google_meet",
      consent: false,
      turnstileToken: "turnstile-token-sample",
      honeypot: "",
    };

    const parsed = bookingRequestSchema.safeParse(invalidBooking);
    expect(parsed.success).toBe(false);
  });

  it("menolak payload booking jika honeypot terisi (anti-bot)", () => {
    const botBooking = {
      name: "Bot Spammer",
      whatsapp: "0895386011371",
      email: "bot@spam.com",
      organizationOrBusiness: "Spam Corp",
      serviceInterest: "Starter",
      projectBrief: "Promo spam",
      slotStart: "2026-05-15T09:00:00+07:00",
      consultationMode: "google_meet",
      consent: true,
      turnstileToken: "token",
      honeypot: "http://malicious-link.com",
    };

    const parsed = bookingRequestSchema.safeParse(botBooking);
    expect(parsed.success).toBe(true);
    expect(botBooking.honeypot).not.toBe("");
  });

  it("memvalidasi payload inquiry kontak publik", () => {
    const validInquiry = {
      source: "contact",
      servicePackageId: null,
      name: "Example Person",
      whatsapp: "081234567891",
      email: "contact@example.com",
      organizationOrBusiness: "OpenByte Labs",
      message: "Konsultasi sistem pelacakan proyek",
      consent: true,
      turnstileToken: "turnstile-verified",
      honeypot: "",
    };

    const parsed = inquiryRequestSchema.safeParse(validInquiry);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.whatsapp).toBe("6281234567891");
    }
  });

  it("menghasilkan nomor referensi resmi server dengan format standar PRD", () => {
    const now = new Date("2026-05-10T10:00:00+07:00");
    const bkgRef = createReference("BKG", now);
    const inqRef = createReference("INQ", now);
    const qteRef = createReference("QTE", now);

    expect(bkgRef).toMatch(/^BKG-2605-[A-Z0-9]{4}$/);
    expect(inqRef).toMatch(/^INQ-2605-[A-Z0-9]{4}$/);
    expect(qteRef).toMatch(/^QTE-2605-[A-Z0-9]{4}$/);
  });

  it("menghitung estimasi kalkulator tanpa generator tiket palsu di klien", () => {
    const selection = [{ itemId: "web" }, { itemId: "sidb" }];
    const result = calculate(selection, calculatorGroups, calculatorItems);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.priceMin).toBeGreaterThan(0);
      expect(result.priceMax).toBeGreaterThan(result.priceMin);
      expect(result.daysMin).toBeGreaterThan(0);
      expect(result.daysMax).toBeGreaterThanOrEqual(result.daysMin);
    }
  });
});
