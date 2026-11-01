import { describe, expect, it } from "vitest";
import { normalizeWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import { contactSchema } from "@/schemas/contact";

describe("Normalisasi WhatsApp PRD F.3", () => {
  it.each([
    ["081234567890", "6281234567890"],
    ["+62 895-3860-11371", "62895386011371"],
    ["62812345678", "62812345678"],
    ["895386011371", "62895386011371"],
    ["(0812) 3456-7890", "6281234567890"],
    ["081234", null],
    ["0212345678", null],
    ["08123abc4567890", null],
    ["+1 415 555 0100", null],
    ["", null],
  ])("%s", (input, output) => expect(normalizeWhatsapp(input)).toBe(output));
  it("meng-encode pesan", () =>
    expect(
      new URL(whatsappUrl("Nama & rincian\nBaris kedua", "081234567890")).searchParams.get(
        "text",
      ),
    ).toBe("Nama & rincian\nBaris kedua"));
  it("menolak nomor tujuan invalid atau tidak dikonfigurasi", () => {
    expect(() => whatsappUrl("pesan", "javascript:foo")).toThrow();
    expect(() => whatsappUrl("pesan", "")).toThrow();
  });
});
describe("Form publik", () => {
  const valid = {
    name: "Izzat",
    whatsapp: "081234567890",
    email: "",
    organization: "",
    service: "Web",
    message: "Sistem informasi untuk UMKM",
    consent: true,
  };
  it("email opsional dan consent wajib", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(
      false,
    );
  });
  it("menolak WhatsApp invalid dan pesan kosong", () => {
    expect(contactSchema.safeParse({ ...valid, whatsapp: "123" }).success).toBe(
      false,
    );
    expect(contactSchema.safeParse({ ...valid, message: "" }).success).toBe(
      false,
    );
  });
});
