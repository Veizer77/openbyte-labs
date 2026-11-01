import { describe, expect, it, vi } from "vitest";
import {
  createQuote,
  type QuoteConfiguration,
  type QuoteStore,
} from "@/services/create-quote";

const ids = {
  platform: "03a45fa0-3b54-4d51-ac21-335a00655744",
  solution: "64f83a30-f94b-4da1-a2e0-3cf7e43de702",
  modules: "cfa09082-8b42-4195-a501-67fb0c47ee71",
  web: "2a304058-26b1-4386-a9e7-f05713dfe8e9",
  landing: "da3510c7-31fa-402a-989d-dc9f41d9db55",
  pages: "d10597da-7f95-4dda-bdc3-6eb356f6476a",
};
const request = {
  selection: [
    { itemId: ids.web },
    { itemId: ids.landing },
    { itemId: ids.pages, units: 2 },
  ],
  contactName: " Budi ",
  contactWhatsapp: "081234567890",
  consent: true,
  turnstileToken: "token",
  honeypot: "",
};
const configuration = (): QuoteConfiguration => ({
  groups: [
    {
      id: ids.platform,
      key: "platform",
      selectionType: "single",
      isRequired: true,
    },
    {
      id: ids.solution,
      key: "solution",
      selectionType: "single",
      isRequired: true,
    },
    {
      id: ids.modules,
      key: "modules",
      selectionType: "multiple",
      isRequired: false,
    },
  ],
  items: [
    {
      id: ids.web,
      groupId: ids.platform,
      label: "Web",
      priceMin: 0,
      daysMin: 0,
    },
    {
      id: ids.landing,
      groupId: ids.solution,
      label: "Landing",
      priceMin: 600_000,
      priceMax: 1_200_000,
      daysMin: 3,
      daysMax: 5,
    },
    {
      id: ids.pages,
      groupId: ids.modules,
      label: "Halaman",
      priceMin: 75_000,
      priceMax: 150_000,
      daysMin: 0,
      pricingType: "per_unit",
      maxUnits: 20,
    },
  ],
  minimumPrice: 500_000,
  showRange: true,
  whatsappNumber: "0895386011371",
  template:
    "Halo {nama}, {platform}\n{rincian}\n{estimasi_harga} ({estimasi_durasi})\n{referensi}",
});
const ipHash = "a".repeat(64);
const now = new Date("2026-10-26T03:00:00Z");

function setup(config = configuration()) {
  const readConfiguration = vi.fn().mockResolvedValue(config);
  const tryInsert = vi.fn().mockResolvedValue("quote-id");
  const insertAudit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ readConfiguration, tryInsert, insertAudit }),
  );
  return {
    store: { transaction } as QuoteStore,
    readConfiguration,
    tryInsert,
    insertAudit,
    transaction,
    verifyChallenge: vi.fn().mockResolvedValue(true),
    consumeBudget: vi.fn().mockResolvedValue(true),
    reference: vi.fn().mockReturnValue("QTE-2610-ABCD"),
    now: () => now,
  };
}

describe("quote kalkulator server", () => {
  it("menghitung dari konfigurasi server dan menyimpan snapshot serta audit", async () => {
    const ctx = setup();
    const result = await createQuote(request, ipHash, ctx);
    expect(result.calculation).toEqual({
      ok: true,
      priceMin: 750_000,
      priceMax: 1_500_000,
      daysMin: 3,
      daysMax: 5,
    });
    expect(ctx.tryInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        reference: "QTE-2610-ABCD",
        priceMin: 750_000,
        priceMax: 1_500_000,
        contactName: "Budi",
        contactWhatsapp: "6281234567890",
        ipHash,
        consentAt: now,
        selection: [
          { itemId: ids.web, label: "Web", units: 1 },
          { itemId: ids.landing, label: "Landing", units: 1 },
          { itemId: ids.pages, label: "Halaman", units: 2 },
        ],
      }),
    );
    expect(ctx.insertAudit).toHaveBeenCalledWith("quote-id");
    const message = new URL(result.whatsappUrl).searchParams.get("text");
    expect(message).toContain("Budi, Web");
    expect(message).toContain("Rp 750.000 - Rp 1.500.000");
    expect(message).toContain("QTE-2610-ABCD");
  });
  it("menolak harga kiriman browser dan pilihan tidak valid", async () => {
    const ctx = setup();
    await expect(
      createQuote({ ...request, priceMin: 1 }, ipHash, ctx),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      createQuote(
        { ...request, selection: [{ itemId: ids.web }] },
        ipHash,
        ctx,
      ),
    ).rejects.toMatchObject({ code: "selection_invalid" });
    expect(ctx.tryInsert).not.toHaveBeenCalled();
  });
  it("menggunakan harga terbaru, bukan fixture di browser", async () => {
    const config = configuration();
    config.items[1].priceMin = 900_000;
    config.items[1].priceMax = 1_400_000;
    const ctx = setup(config);
    const result = await createQuote(request, ipHash, ctx);
    expect(result.calculation).toMatchObject({
      priceMin: 1_050_000,
      priceMax: 1_700_000,
    });
  });
  it("memeriksa spam dan batas form sebelum transaksi", async () => {
    const ctx = setup();
    ctx.verifyChallenge.mockResolvedValue(false);
    await expect(createQuote(request, ipHash, ctx)).rejects.toMatchObject({
      code: "anti_spam",
    });
    expect(ctx.consumeBudget).not.toHaveBeenCalled();
    ctx.verifyChallenge.mockResolvedValue(true);
    ctx.consumeBudget.mockResolvedValue(false);
    await expect(createQuote(request, ipHash, ctx)).rejects.toMatchObject({
      code: "rate_limit",
    });
    expect(ctx.transaction).not.toHaveBeenCalled();
  });
  it("menolak total di luar batas integer database dan meneruskan kegagalan audit", async () => {
    const config = configuration();
    config.items[1].priceMin = 2_147_483_000;
    config.items[1].priceMax = 2_147_483_647;
    const large = setup(config);
    await expect(createQuote(request, ipHash, large)).rejects.toMatchObject({
      code: "range_exceeded",
    });
    expect(large.tryInsert).not.toHaveBeenCalled();
    const failure = setup();
    failure.insertAudit.mockRejectedValue(new Error("audit gagal"));
    await expect(createQuote(request, ipHash, failure)).rejects.toThrow(
      "audit gagal",
    );
  });
  it("mengulang nomor referensi yang bentrok maksimal lima kali", async () => {
    const ctx = setup();
    ctx.tryInsert.mockResolvedValueOnce(null).mockResolvedValueOnce("quote-id");
    ctx.reference
      .mockReturnValueOnce("QTE-2610-AAAA")
      .mockReturnValueOnce("QTE-2610-BBBB");
    await expect(createQuote(request, ipHash, ctx)).resolves.toMatchObject({
      reference: "QTE-2610-BBBB",
    });
    const exhausted = setup();
    exhausted.tryInsert.mockResolvedValue(null);
    await expect(createQuote(request, ipHash, exhausted)).rejects.toMatchObject(
      { code: "reference_exhausted" },
    );
    expect(exhausted.tryInsert).toHaveBeenCalledTimes(5);
    expect(exhausted.insertAudit).not.toHaveBeenCalled();
  });
});
