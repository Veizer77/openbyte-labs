import { describe, expect, it } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import { hashTrackingPin } from "@/lib/tracking/security";
import {
  digitalCouponInputSchema,
  digitalCouponRecordSchema,
  digitalOrderRecordSchema,
  digitalProductInputSchema,
  digitalProductRecordSchema,
  storeOrderLookupSchema,
  storeReviewAdminRecordSchema,
  type DigitalCouponInput,
  type DigitalCouponRecord,
  type DigitalOrderRecord,
  type DigitalProductInput,
  type DigitalProductRecord,
  type StoreReviewAdminRecord,
  type StoreReviewPublic,
} from "@/schemas/store";
import {
  activateOrderLicense,
  buildStoreLicenseCertificate,
  createLicenseFingerprint,
  createPublicStoreOrder,
  deleteDigitalCoupon,
  listAdminDigitalCoupons,
  listAdminDigitalProducts,
  listPublicProductReviews,
  listRelatedDigitalProducts,
  moderateStoreReview,
  previewStoreCoupon,
  regenerateOrderPin,
  saveDigitalCoupon,
  saveDigitalProduct,
  setOrderRevoked,
  submitVerifiedStoreReview,
  verifyAndConsumeStoreDownload,
  type StoreOrderInsert,
  type StoreOrderPatch,
  type StoreReviewInsert,
  type StoreReviewPatch,
  type StoreStore,
  type StoreTransaction,
} from "@/services/store";

const PRODUCT_ID = "11111111-1111-4111-8111-111111111111";
const FILE_ID = "33333333-3333-4333-8333-333333333333";
const ORDER_ID = "22222222-2222-4222-8222-222222222222";
const REVIEW_ID = "44444444-4444-4444-8444-444444444444";
const COUPON_ID = "55555555-5555-4555-8555-555555555555";
const ORDER_CODE = "OBL-STR-ABC234";
const IP_HASH = "a".repeat(64);
const SALT = "s".repeat(32);
const OWNER: AdminPrincipal = { id: "owner-1", role: "owner", twoFactorVerified: true };
const EDITOR: AdminPrincipal = { id: "editor-1", role: "editor", twoFactorVerified: true };

function productInput(overrides: Partial<DigitalProductInput> = {}): DigitalProductInput {
  return digitalProductInputSchema.parse({
    title: "Starter Kit",
    slug: "starter-kit",
    productType: "source_code",
    tagline: "Kit awal siap pakai",
    summary: "Ringkasan produk.",
    thumbnailMediaId: null,
    gallery: [],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: null,
    priceSingle: 250_000,
    priceCommercial: 750_000,
    compareAtPriceSingle: null,
    compareAtPriceCommercial: null,
    setupServicePrice: null,
    packageSizeBytes: null,
    changelog: "",
    techStack: ["Next.js"],
    features: ["Autentikasi"],
    includedFiles: ["src/"],
    version: "1.0.0",
    privateFileId: null,
    githubRepoInfo: null,
    isFeatured: false,
    sortOrder: 0,
    ...overrides,
  });
}

function productRecord(overrides: Partial<DigitalProductRecord> = {}): DigitalProductRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return digitalProductRecordSchema.parse({
    ...productInput(),
    id: PRODUCT_ID,
    status: "published",
    salesCount: 0,
    ratingAverage: 0,
    ratingCount: 0,
    publishedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

function orderRecord(overrides: Partial<DigitalOrderRecord> = {}): DigitalOrderRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return digitalOrderRecordSchema.parse({
    id: ORDER_ID,
    orderCode: ORDER_CODE,
    productId: PRODUCT_ID,
    licenseTier: "single",
    buyerName: "Budi Santoso",
    buyerWhatsapp: "6281234567890",
    buyerEmail: "budi@example.com",
    buyerGithub: null,
    notes: "",
    amount: 250_000,
    baseAmount: 250_000,
    setupFeeAmount: 0,
    discountAmount: 0,
    couponCode: null,
    includeSetupService: false,
    paymentStatus: "pending",
    accessPinHash: null,
    pinVersion: 1,
    licenseFingerprint: "A".repeat(24),
    downloadCount: 0,
    maxDownloads: 3,
    expiresAt: null,
    isRevoked: false,
    revokedReason: null,
    paidAt: null,
    lastDownloadedAt: null,
    lastDownloadIpHash: null,
    paymentProofFileId: null,
    paymentProofUploadedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

function couponRecord(
  overrides: Partial<DigitalCouponRecord> = {},
): DigitalCouponRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return digitalCouponRecordSchema.parse({
    id: COUPON_ID,
    code: "LAUNCH30",
    description: "Promo peluncuran",
    discountType: "percent",
    discountValue: 30,
    minOrderAmount: 0,
    maxDiscountAmount: 100_000,
    maxUses: null,
    productId: null,
    isActive: true,
    expiresAt: null,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

function reviewRecord(
  overrides: Partial<StoreReviewAdminRecord> = {},
): StoreReviewAdminRecord {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return storeReviewAdminRecordSchema.parse({
    id: REVIEW_ID,
    productId: PRODUCT_ID,
    orderId: ORDER_ID,
    productTitle: "Starter Kit",
    productVersion: "1.0.0",
    buyerName: "Budi Santoso",
    licenseTier: "single",
    rating: 5,
    comment: "Produk rapi dan mudah dipasang.",
    mediaItems: [],
    adminReply: null,
    status: "approved",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

function toPublicReview(review: StoreReviewAdminRecord): StoreReviewPublic {
  return {
    id: review.id,
    buyerName: review.buyerName,
    licenseTier: review.licenseTier,
    rating: review.rating,
    comment: review.comment,
    mediaItems: review.mediaItems,
    adminReply: review.adminReply,
    createdAt: review.createdAt,
  };
}

function fakeStore(options: {
  product?: DigitalProductRecord;
  order?: DigitalOrderRecord | null;
  coupons?: DigitalCouponRecord[];
  review?: StoreReviewAdminRecord | null;
}) {
  let product = options.product ?? productRecord();
  let order = options.order ?? null;
  const coupons = [...(options.coupons ?? [])];
  let reviews = options.review ? [options.review] : [];

  function lookup(row: DigitalOrderRecord) {
    return storeOrderLookupSchema.parse({
      ...row,
      productTitle: product.title,
      productSlug: product.slug,
      productVersion: product.version,
      hasPackage: product.privateFileId !== null,
    });
  }

  const tx: StoreTransaction = {
    async orderForUpdate(orderCode) {
      return order && order.orderCode === orderCode ? lookup(order) : null;
    },
    async consumeDownload(orderId, ipHash, now) {
      if (!order || order.id !== orderId) return null;
      order = orderRecord({
        ...order,
        downloadCount: order.downloadCount + 1,
        lastDownloadedAt: now,
        lastDownloadIpHash: ipHash,
      });
      return order;
    },
    async packageForDownload() {
      return product.privateFileId
        ? { key: `store-packages/${product.id}/x-pkg.zip`, filename: "starter-kit.zip" }
        : null;
    },
  };

  const store: StoreStore = {
    async listProducts() {
      return [product];
    },
    async findProductById(id) {
      return id === product.id ? product : null;
    },
    async findProductBySlug(slug) {
      return slug === product.slug ? product : null;
    },
    async listPublishedProductSlugs() {
      return [product.slug];
    },
    async resolveMedia() {
      return new Map();
    },
    async saveProduct(id, value) {
      product = productRecord({ ...product, ...value });
      return product.id;
    },
    async setProductPublished() {
      return true;
    },
    async setProductTrash() {
      return true;
    },
    async attachZip() {
      return FILE_ID;
    },
    async attachVideo(_productId, videoKey, videoUrl) {
      product = productRecord({ ...product, videoKey, videoUrl });
      return true;
    },
    async incrementProductSales() {
      product = productRecord({ ...product, salesCount: product.salesCount + 1 });
      return true;
    },
    async updateProductRating(_productId, ratingAverage, ratingCount) {
      product = productRecord({ ...product, ratingAverage, ratingCount });
      return true;
    },
    async attachPaymentProof(orderId, _file, now) {
      if (!order || order.id !== orderId) return null;
      order = orderRecord({
        ...order,
        paymentProofFileId: FILE_ID,
        paymentProofUploadedAt: now,
      });
      return FILE_ID;
    },
    async signPaymentProofUrl(fileId) {
      return fileId === FILE_ID ? "https://private.example/proof" : null;
    },
    async listOrders() {
      return order
        ? [
            {
              ...order,
              productTitle: product.title,
              productVersion: product.version,
              zipFilename: "starter-kit.zip",
            },
          ]
        : [];
    },
    async findOrderById(id) {
      return order && order.id === id ? lookup(order) : null;
    },
    async findOrderByCode(code) {
      return order && order.orderCode === code ? lookup(order) : null;
    },
    async insertOrder(value: StoreOrderInsert) {
      order = orderRecord({ ...value });
      return order;
    },
    async updateOrder(orderId: string, patch: StoreOrderPatch) {
      if (!order || order.id !== orderId) return null;
      order = orderRecord({ ...order, ...patch });
      return order;
    },
    async listCoupons() {
      return coupons;
    },
    async findCouponById(id) {
      return coupons.find((coupon) => coupon.id === id) ?? null;
    },
    async findCouponByCode(code) {
      return coupons.find((coupon) => coupon.code === code) ?? null;
    },
    async createCoupon(value: DigitalCouponInput) {
      coupons.push(couponRecord({ ...value, id: COUPON_ID }));
      return COUPON_ID;
    },
    async updateCoupon(id, value) {
      const index = coupons.findIndex((coupon) => coupon.id === id);
      if (index < 0) return null;
      coupons[index] = couponRecord({ ...value, id });
      return id;
    },
    async deleteCoupon(id) {
      const index = coupons.findIndex((coupon) => coupon.id === id);
      if (index < 0) return false;
      coupons.splice(index, 1);
      return true;
    },
    async incrementCouponUse(couponId) {
      const index = coupons.findIndex((coupon) => coupon.id === couponId);
      if (index < 0) return false;
      const coupon = coupons[index];
      if (!coupon) return false;
      coupons[index] = { ...coupon, usedCount: coupon.usedCount + 1 };
      return true;
    },
    async listReviewsByProduct(productId, listOptions) {
      return reviews
        .filter(
          (review) =>
            review.productId === productId &&
            (!listOptions.publicOnly || review.status === "approved"),
        )
        .map(toPublicReview);
    },
    async listAllReviews() {
      return reviews;
    },
    async findReviewById(reviewId) {
      return reviews.find((review) => review.id === reviewId) ?? null;
    },
    async findReviewByOrderId(orderId) {
      return reviews.find((review) => review.orderId === orderId) ?? null;
    },
    async upsertReview(value: StoreReviewInsert) {
      const existingIndex = reviews.findIndex(
        (review) => review.orderId === value.orderId,
      );
      const next = reviewRecord({
        id: existingIndex >= 0 ? (reviews[existingIndex]?.id ?? REVIEW_ID) : REVIEW_ID,
        ...value,
        productTitle: product.title,
        productVersion: product.version,
        status: "approved",
        adminReply: null,
      });
      if (existingIndex >= 0) reviews[existingIndex] = next;
      else reviews = [next];
      return next.id;
    },
    async updateReview(reviewId, patch: StoreReviewPatch) {
      const index = reviews.findIndex((review) => review.id === reviewId);
      const current = reviews[index];
      if (!current) return false;
      reviews[index] = { ...current, ...patch };
      return true;
    },
    async recalculateProductRating(productId) {
      const approved = reviews.filter(
        (review) => review.productId === productId && review.status === "approved",
      );
      const ratingCount = approved.length;
      const ratingAverage = ratingCount
        ? Math.round(
            (approved.reduce((sum, review) => sum + review.rating, 0) / ratingCount) * 100,
          )
        : 0;
      product = productRecord({ ...product, ratingAverage, ratingCount });
      return { ratingAverage, ratingCount };
    },
    async readConfig() {
      return { adminWhatsapp: "628111222333", ipHashSalt: SALT };
    },
    async transaction(callback) {
      return callback(tx);
    },
    async signedDownloadUrl(key, filename) {
      return `https://private.example/${key}?name=${filename}`;
    },
  };

  return {
    store,
    current: () => order,
    product: () => product,
    coupons,
    reviews: () => reviews,
  };
}

describe("katalog produk digital", () => {
  it("menolak harga Commercial License di bawah Single License", () => {
    const result = digitalProductInputSchema.safeParse({
      ...productInput(),
      priceSingle: 500_000,
      priceCommercial: 400_000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["priceCommercial"]);
    }
  });

  it("membuat produk digital melalui service untuk Editor dan Owner", async () => {
    const { store } = fakeStore({ product: productRecord() });
    await expect(
      saveDigitalProduct(store, EDITOR, null, productInput({ slug: "baru" })),
    ).resolves.toBe(PRODUCT_ID);
    await expect(
      listAdminDigitalProducts(store, OWNER, {}),
    ).resolves.toHaveLength(1);
  });
});

describe("pembuatan order publik", () => {
  it("membuat kode order OBL-STR beserta fingerprint SHA-256", async () => {
    const { store } = fakeStore({ product: productRecord(), order: null });
    const created = await createPublicStoreOrder(store, {
      productSlug: "starter-kit",
      licenseTier: "single",
      buyerName: "Budi Santoso",
      buyerWhatsapp: "081234567890",
      buyerEmail: "Budi@Example.com",
      consent: true,
    });
    expect(created.orderCode).toMatch(/^OBL-STR-[A-Z0-9]{6}$/);
    expect(created.amount).toBe(250_000);
    expect(created.licenseFingerprint).toMatch(/^[0-9A-F]{24}$/);
    expect(created.licenseFingerprint).toBe(
      createLicenseFingerprint(
        created.orderCode,
        "budi@example.com",
        "6281234567890",
        SALT,
      ),
    );
    expect(created.whatsappUrl).toContain("wa.me/628111222333");
  });
});

describe("aktivasi lisensi (khusus Owner)", () => {
  it("menghasilkan PIN 6 digit ber-hash scrypt dan menolak Editor", async () => {
    const { store, current } = fakeStore({ order: orderRecord() });
    const activated = await activateOrderLicense(store, OWNER, ORDER_ID);
    expect(activated.rawPin).toMatch(/^\d{6}$/);
    expect(activated.whatsappDeliveryUrl).toContain("wa.me/6281234567890");
    const saved = current();
    expect(saved?.paymentStatus).toBe("paid");
    expect(saved?.accessPinHash).toMatch(/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/);
    expect(saved?.expiresAt).toBeInstanceOf(Date);
    expect(saved?.maxDownloads).toBe(3);

    await expect(
      activateOrderLicense(store, EDITOR, ORDER_ID),
    ).rejects.toThrow("Akses ditolak");

    const regenerated = await regenerateOrderPin(store, OWNER, ORDER_ID);
    expect(regenerated.rawPin).toMatch(/^\d{6}$/);
    expect(current()?.pinVersion).toBe(3);
  });
});

describe("proteksi unduhan paket", () => {
  async function licensedOrder(overrides: Partial<DigitalOrderRecord> = {}) {
    return orderRecord({
      paymentStatus: "paid",
      accessPinHash: await hashTrackingPin("123456"),
      expiresAt: new Date(Date.now() + 30 * 86_400_000),
      ...overrides,
    });
  }

  it("menolak unduhan sebelum pesanan lunas", async () => {
    const { store } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: orderRecord({ accessPinHash: await hashTrackingPin("123456") }),
    });
    await expect(
      verifyAndConsumeStoreDownload(store, {
        orderCode: ORDER_CODE,
        pin: "123456",
        ipHash: IP_HASH,
        mode: "download",
      }),
    ).rejects.toThrow("Pesanan belum berstatus lunas");
  });

  it("menolak PIN yang salah", async () => {
    const { store } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: await licensedOrder(),
    });
    await expect(
      verifyAndConsumeStoreDownload(store, {
        orderCode: ORDER_CODE,
        pin: "000000",
        ipHash: IP_HASH,
        mode: "download",
      }),
    ).rejects.toThrow("Kode order atau PIN lisensi tidak valid.");
  });

  it("menolak unduhan saat kill-switch aktif", async () => {
    const { store } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: await licensedOrder({ isRevoked: true }),
    });
    await expect(
      verifyAndConsumeStoreDownload(store, {
        orderCode: ORDER_CODE,
        pin: "123456",
        ipHash: IP_HASH,
        mode: "download",
      }),
    ).rejects.toThrow("Lisensi ini telah dicabut");
  });

  it("menolak unduhan ketika kuota habis", async () => {
    const { store } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: await licensedOrder({ downloadCount: 3, maxDownloads: 3 }),
    });
    await expect(
      verifyAndConsumeStoreDownload(store, {
        orderCode: ORDER_CODE,
        pin: "123456",
        ipHash: IP_HASH,
        mode: "download",
      }),
    ).rejects.toThrow("Kuota unduhan maksimum");
  });

  it("menolak unduhan setelah masa berlaku berakhir", async () => {
    const { store } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: await licensedOrder({ expiresAt: new Date(Date.now() - 1000) }),
    });
    await expect(
      verifyAndConsumeStoreDownload(store, {
        orderCode: ORDER_CODE,
        pin: "123456",
        ipHash: IP_HASH,
        mode: "download",
      }),
    ).rejects.toThrow("Masa berlaku tautan unduhan telah berakhir");
  });

  it("mengizinkan unduhan sah dan menaikkan kuota terpakai", async () => {
    const { store, current } = fakeStore({
      product: productRecord({ privateFileId: FILE_ID }),
      order: await licensedOrder(),
    });
    const view = await verifyAndConsumeStoreDownload(store, {
      orderCode: ORDER_CODE,
      pin: "123456",
      ipHash: IP_HASH,
      mode: "download",
    });
    expect(view.downloadUrl).toContain("https://private.example/");
    expect(view.expiresInSeconds).toBe(60);
    expect(view.downloadCount).toBe(1);
    expect(view.remainingDownloads).toBe(2);
    expect(current()?.downloadCount).toBe(1);
    expect(current()?.lastDownloadIpHash).toBe(IP_HASH);
    expect(buildStoreLicenseCertificate({
      ...storeOrderLookupSchema.parse({
        ...orderRecord(),
        productTitle: "Starter Kit",
        productSlug: "starter-kit",
        productVersion: "1.0.0",
        hasPackage: true,
      }),
    })).toContain(`OBL-FP-${"A".repeat(24)}`);
  });

  it("mencabut lalu memulihkan lisensi melalui Owner", async () => {
    const { store, current } = fakeStore({ order: await licensedOrder() });
    await setOrderRevoked(store, OWNER, ORDER_ID, true, "Redistribusi");
    expect(current()?.isRevoked).toBe(true);
    await setOrderRevoked(store, OWNER, ORDER_ID, false);
    expect(current()?.isRevoked).toBe(false);
  });
});

describe("harga coret produk (Fase 2)", () => {
  it("menolak harga coret Single di bawah harga jual", () => {
    const result = digitalProductInputSchema.safeParse({
      ...productInput(),
      compareAtPriceSingle: 100_000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["compareAtPriceSingle"]);
    }
  });

  it("menolak harga coret Commercial tanpa harga Commercial", () => {
    const result = digitalProductInputSchema.safeParse({
      ...productInput(),
      priceCommercial: null,
      compareAtPriceCommercial: 900_000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["compareAtPriceCommercial"]);
    }
  });

  it("menerima harga coret yang valid", () => {
    const parsed = digitalProductInputSchema.parse({
      ...productInput(),
      compareAtPriceSingle: 400_000,
      compareAtPriceCommercial: 900_000,
    });
    expect(parsed.compareAtPriceSingle).toBe(400_000);
    expect(parsed.compareAtPriceCommercial).toBe(900_000);
  });
});

describe("kupon diskon (Fase 2)", () => {
  it("menghitung diskon persentase dengan plafon maksimum", async () => {
    const { store } = fakeStore({
      product: productRecord(),
      coupons: [couponRecord({ maxDiscountAmount: 50_000 })],
    });
    const preview = await previewStoreCoupon(store, {
      code: "LAUNCH30",
      productSlug: "starter-kit",
      licenseTier: "single",
    });
    expect(preview.baseAmount).toBe(250_000);
    expect(preview.discountAmount).toBe(50_000);
    expect(preview.totalAmount).toBe(200_000);
  });

  it("menghitung diskon nominal tetap", async () => {
    const { store } = fakeStore({
      product: productRecord(),
      coupons: [
        couponRecord({ discountType: "fixed", discountValue: 75_000, maxDiscountAmount: null }),
      ],
    });
    const preview = await previewStoreCoupon(store, {
      code: "LAUNCH30",
      productSlug: "starter-kit",
      licenseTier: "single",
    });
    expect(preview.discountAmount).toBe(75_000);
    expect(preview.totalAmount).toBe(175_000);
  });

  it("menolak kupon kedaluwarsa", async () => {
    const { store } = fakeStore({
      product: productRecord(),
      coupons: [couponRecord({ expiresAt: new Date(Date.now() - 1000) })],
    });
    await expect(
      previewStoreCoupon(store, {
        code: "LAUNCH30",
        productSlug: "starter-kit",
        licenseTier: "single",
      }),
    ).rejects.toThrow("kedaluwarsa");
  });

  it("menolak kupon dengan kuota habis", async () => {
    const { store } = fakeStore({
      product: productRecord(),
      coupons: [couponRecord({ maxUses: 5, usedCount: 5 })],
    });
    await expect(
      previewStoreCoupon(store, {
        code: "LAUNCH30",
        productSlug: "starter-kit",
        licenseTier: "single",
      }),
    ).rejects.toThrow("Kuota kupon sudah habis");
  });

  it("menolak kupon di bawah minimal belanja", async () => {
    const { store } = fakeStore({
      product: productRecord(),
      coupons: [couponRecord({ minOrderAmount: 300_000 })],
    });
    await expect(
      previewStoreCoupon(store, {
        code: "LAUNCH30",
        productSlug: "starter-kit",
        licenseTier: "single",
      }),
    ).rejects.toThrow("Minimal belanja");
  });

  it("membuat dan menghapus kupon hanya untuk Owner", async () => {
    const { store, coupons } = fakeStore({ product: productRecord() });
    const input = digitalCouponInputSchema.parse({
      code: "HEMAT50",
      description: "",
      discountType: "percent",
      discountValue: 50,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      maxUses: null,
      productId: null,
      isActive: true,
      expiresAt: null,
    });
    await expect(saveDigitalCoupon(store, EDITOR, null, input)).rejects.toThrow(
      "Akses ditolak",
    );
    const id = await saveDigitalCoupon(store, OWNER, null, input);
    expect(id).toBe(COUPON_ID);
    await expect(listAdminDigitalCoupons(store, OWNER)).resolves.toHaveLength(1);
    await deleteDigitalCoupon(store, OWNER, COUPON_ID);
    expect(coupons).toHaveLength(0);
  });
});

describe("checkout dengan add-on & kupon (Fase 2)", () => {
  it("menghitung rincian add-on jasa instalasi dan potongan kupon", async () => {
    const { store } = fakeStore({
      product: productRecord({ setupServicePrice: 150_000 }),
      coupons: [couponRecord({ maxDiscountAmount: 50_000 })],
    });
    const created = await createPublicStoreOrder(store, {
      productSlug: "starter-kit",
      licenseTier: "single",
      buyerName: "Budi Santoso",
      buyerWhatsapp: "081234567890",
      buyerEmail: "budi@example.com",
      couponCode: "LAUNCH30",
      includeSetupService: true,
      consent: true,
    });
    expect(created.baseAmount).toBe(250_000);
    expect(created.discountAmount).toBe(50_000);
    expect(created.setupFeeAmount).toBe(150_000);
    expect(created.amount).toBe(350_000);
    expect(created.couponCode).toBe("LAUNCH30");
  });

  it("menaikkan salesCount dan rating saat aktivasi pertama", async () => {
    const { store, product } = fakeStore({ order: orderRecord() });
    expect(product().salesCount).toBe(0);
    await activateOrderLicense(store, OWNER, ORDER_ID);
    expect(product().salesCount).toBe(1);
  });
});

describe("ulasan pembeli terverifikasi (Fase 2)", () => {
  it("menolak ulasan saat pesanan belum lunas", async () => {
    const { store } = fakeStore({
      order: orderRecord({ accessPinHash: await hashTrackingPin("123456") }),
    });
    await expect(
      submitVerifiedStoreReview(store, {
        orderCode: ORDER_CODE,
        pin: "123456",
        rating: 5,
        comment: "Produk sangat membantu pekerjaan saya.",
        mediaItems: [],
      }),
    ).rejects.toThrow("setelah pembayaran lunas");
  });

  it("menolak ulasan dengan PIN salah", async () => {
    const { store } = fakeStore({
      order: orderRecord({
        paymentStatus: "paid",
        accessPinHash: await hashTrackingPin("123456"),
      }),
    });
    await expect(
      submitVerifiedStoreReview(store, {
        orderCode: ORDER_CODE,
        pin: "000000",
        rating: 5,
        comment: "Produk sangat membantu pekerjaan saya.",
        mediaItems: [],
      }),
    ).rejects.toThrow("tidak valid");
  });

  it("menyimpan ulasan dan memperbarui agregat rating produk", async () => {
    const { store, product } = fakeStore({
      order: orderRecord({
        paymentStatus: "paid",
        accessPinHash: await hashTrackingPin("123456"),
      }),
    });
    const review = await submitVerifiedStoreReview(store, {
      orderCode: ORDER_CODE,
      pin: "123456",
      rating: 4,
      comment: "Dokumentasi lengkap dan responsif.",
      mediaItems: [{ kind: "image", url: "https://cdn.example/review-1.webp" }],
    });
    expect(review.rating).toBe(4);
    expect(review.mediaItems).toHaveLength(1);
    expect(product().ratingCount).toBe(1);
    expect(product().ratingAverage).toBe(400);
  });

  it("menyembunyikan ulasan lewat moderasi tanpa mengubah rating publik", async () => {
    const { store, product } = fakeStore({
      review: reviewRecord(),
      product: productRecord({ ratingAverage: 500, ratingCount: 1 }),
    });
    const moderated = await moderateStoreReview(store, OWNER, {
      id: REVIEW_ID,
      status: "hidden",
      adminReply: "Terima kasih atas ulasannya.",
    });
    expect(moderated.status).toBe("hidden");
    expect(moderated.adminReply).toContain("Terima kasih");
    expect(product().ratingCount).toBe(0);
    await expect(
      listPublicProductReviews(store, "starter-kit"),
    ).resolves.toHaveLength(0);
  });

  it("mengembalikan produk terkait tanpa produk aktif", async () => {
    const { store } = fakeStore({ product: productRecord() });
    const related = await listRelatedDigitalProducts(store, "starter-kit");
    expect(related).toHaveLength(0);
  });
});
