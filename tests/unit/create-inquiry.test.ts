import { describe, expect, it, vi } from "vitest";
import { createInquiry, type InquiryStore } from "@/services/create-inquiry";

const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const now = new Date("2026-10-26T03:00:00Z");
const ipHash = "a".repeat(64);
const input = {
  source: "package",
  servicePackageId: id,
  name: " Budi ",
  whatsapp: "081234567890",
  email: "",
  organizationOrBusiness: "",
  message: "Butuh website",
  consent: true,
  turnstileToken: "token",
  honeypot: "",
};
const pack = {
  id,
  name: "Starter",
  price: 1_000_000,
  discountPrice: 800_000,
  discountEndsAt: new Date("2026-11-01T00:00:00Z"),
  billingType: "one_time",
  isActive: true,
  categoryActive: true,
  deletedAt: null,
};

function setup() {
  const readPackageForUpdate = vi.fn().mockResolvedValue(pack);
  const readWhatsappConfig = vi
    .fn()
    .mockResolvedValue({
      number: "0895386011371",
      template: "{nama}: {platform}, {rincian}, {referensi}",
    });
  const tryInsert = vi.fn().mockResolvedValue("inquiry-id");
  const insertAudit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({
      readPackageForUpdate,
      readWhatsappConfig,
      tryInsert,
      insertAudit,
    }),
  );
  return {
    store: { transaction } as InquiryStore,
    readPackageForUpdate,
    readWhatsappConfig,
    tryInsert,
    insertAudit,
    transaction,
    verifyChallenge: vi.fn().mockResolvedValue(true),
    consumeBudget: vi.fn().mockResolvedValue(true),
    reference: vi.fn().mockReturnValue("INQ-2610-ABCD"),
    now: () => now,
  };
}

describe("inquiry server", () => {
  it("menggunakan paket dan diskon server, menyimpan consent serta audit", async () => {
    const ctx = setup();
    const result = await createInquiry(input, ipHash, ctx);
    expect(ctx.tryInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "package",
        servicePackageId: id,
        packageName: "Starter",
        packagePrice: 800_000,
        packageBillingType: "one_time",
        name: "Budi",
        whatsapp: "6281234567890",
        email: null,
        consentAt: now,
        ipHash,
      }),
    );
    expect(ctx.insertAudit).toHaveBeenCalledWith("inquiry-id");
    expect(new URL(result.whatsappUrl!).searchParams.get("text")).toContain(
      "Budi: Starter, Butuh website, INQ-2610-ABCD",
    );
  });
  it("menolak paket nonaktif dan tidak menerima harga atau quote ID dari browser", async () => {
    const ctx = setup();
    await expect(
      createInquiry({ ...input, packagePrice: 1 }, ipHash, ctx),
    ).rejects.toThrow();
    await expect(
      createInquiry(
        { ...input, source: "calculator", quoteRequestId: id },
        ipHash,
        ctx,
      ),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    ctx.readPackageForUpdate.mockResolvedValue({ ...pack, isActive: false });
    await expect(createInquiry(input, ipHash, ctx)).rejects.toMatchObject({
      code: "package_unavailable",
    });
    expect(ctx.tryInsert).not.toHaveBeenCalled();
  });
  it("tidak memakai diskon setelah kedaluwarsa dan mendukung inquiry kontak", async () => {
    const ctx = setup();
    ctx.readPackageForUpdate.mockResolvedValue({
      ...pack,
      discountEndsAt: new Date("2026-10-01T00:00:00Z"),
    });
    await createInquiry(input, ipHash, ctx);
    expect(ctx.tryInsert).toHaveBeenCalledWith(
      expect.objectContaining({ packagePrice: 1_000_000 }),
    );
    const contact = setup();
    const result = await createInquiry(
      { ...input, source: "contact", servicePackageId: null },
      ipHash,
      contact,
    );
    expect(result.whatsappUrl).toBeNull();
    expect(contact.readPackageForUpdate).not.toHaveBeenCalled();
    expect(contact.tryInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "contact",
        packageName: null,
        packagePrice: null,
      }),
    );
  });
  it("membatasi spam, collision reference, dan kegagalan audit", async () => {
    const ctx = setup();
    ctx.verifyChallenge.mockResolvedValue(false);
    await expect(createInquiry(input, ipHash, ctx)).rejects.toMatchObject({
      code: "anti_spam",
    });
    expect(ctx.transaction).not.toHaveBeenCalled();
    const collision = setup();
    collision.tryInsert.mockResolvedValue(null);
    await expect(createInquiry(input, ipHash, collision)).rejects.toMatchObject(
      { code: "reference_exhausted" },
    );
    expect(collision.tryInsert).toHaveBeenCalledTimes(5);
    const failure = setup();
    failure.insertAudit.mockRejectedValue(new Error("audit gagal"));
    await expect(createInquiry(input, ipHash, failure)).rejects.toThrow(
      "audit gagal",
    );
  });
});
