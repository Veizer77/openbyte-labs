import "server-only";
import { createHash, randomInt } from "node:crypto";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import { rupiah } from "@/lib/format";
import { StoreLicenseError } from "@/lib/store/errors";
import {
  generateTrackingPin,
  hashTrackingPin,
  verifyTrackingPin,
} from "@/lib/tracking/security";
import { normalizeWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import {
  digitalCouponRecordSchema,
  digitalCouponInputSchema,
  digitalOrderAdminRecordSchema,
  digitalOrderRecordSchema,
  digitalProductInputSchema,
  digitalProductRecordSchema,
  publicStoreProductSchema,
  storeCheckoutInputSchema,
  storeCouponPreviewInputSchema,
  storeCouponPreviewResultSchema,
  storeLicenseAccessInputSchema,
  storeLicenseVerifyInputSchema,
  storeLicenseViewSchema,
  storeOrderListOptionsSchema,
  storeOrderLookupSchema,
  storePaymentProofAttachInputSchema,
  storeProductListOptionsSchema,
  storeReviewAdminRecordSchema,
  storeReviewModerationInputSchema,
  storeReviewPublicSchema,
  storeReviewSubmitInputSchema,
  storeZipAttachmentSchema,
  type DigitalCouponInput,
  type DigitalCouponRecord,
  type DigitalOrderAdminRecord,
  type DigitalOrderRecord,
  type DigitalProductInput,
  type DigitalProductRecord,
  type PublicStoreProduct,
  type StoreCouponPreviewResult,
  type StoreLicenseView,
  type StoreOrderListOptions,
  type StoreOrderLookup,
  type StorePaymentProofFile,
  type StoreProductListOptions,
  type StoreReviewAdminRecord,
  type StoreReviewPublic,
  type StoreZipAttachment,
} from "@/schemas/store";

const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEFAULT_MAX_DOWNLOADS = 3;
const DEFAULT_VALID_DAYS = 30;
const DOWNLOAD_URL_TTL_SECONDS = 60;
const LICENSE_ACCESS_URL = "https://www.openbyte-labs.web.id/store/akses";

export type StoreCacheInvalidator = () => void | Promise<void>;
const noInvalidation: StoreCacheInvalidator = () => {};

export type StoreMediaAsset = { alt: string; card: string; hero: string };
export type StorePackageMeta = { key: string; filename: string };
export type StoreConfig = { adminWhatsapp: string; ipHashSalt: string };

export interface StoreOrderInsert {
  orderCode: string;
  productId: string;
  licenseTier: "single" | "commercial";
  buyerName: string;
  buyerWhatsapp: string;
  buyerEmail: string;
  buyerGithub: string | null;
  notes: string;
  amount: number;
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  couponCode: string | null;
  includeSetupService: boolean;
  licenseFingerprint: string;
}

export type StoreOrderPatch = Partial<{
  paymentStatus: DigitalOrderRecord["paymentStatus"];
  paidAt: Date | null;
  isRevoked: boolean;
  revokedReason: string | null;
  accessPinHash: string | null;
  pinVersion: number;
  expiresAt: Date | null;
  maxDownloads: number;
  lastDownloadIpHash: string | null;
  paymentProofFileId: string | null;
  paymentProofUploadedAt: Date | null;
}>;

export interface StoreReviewInsert {
  productId: string;
  orderId: string;
  buyerName: string;
  licenseTier: "single" | "commercial";
  rating: number;
  comment: string;
  mediaItems: StoreReviewPublic["mediaItems"];
}

export type StoreReviewPatch = Partial<{
  rating: number;
  comment: string;
  mediaItems: StoreReviewPublic["mediaItems"];
  status: "approved" | "hidden";
  adminReply: string | null;
}>;

export interface StoreTransaction {
  /** SELECT ... FOR UPDATE inside the same transaction as the quota increment. */
  orderForUpdate(orderCode: string): Promise<unknown | null>;
  consumeDownload(
    orderId: string,
    ipHash: string,
    now: Date,
  ): Promise<unknown | null>;
  packageForDownload(productId: string): Promise<StorePackageMeta | null>;
}

/** Everything touches this abstraction, so services are unit-testable without a DB. */
export interface StoreStore {
  listProducts(options: StoreProductListOptions): Promise<unknown[]>;
  findProductById(id: string): Promise<unknown | null>;
  findProductBySlug(slug: string): Promise<unknown | null>;
  listPublishedProductSlugs(): Promise<string[]>;
  resolveMedia(
    ids: readonly (string | null)[],
  ): Promise<ReadonlyMap<string, StoreMediaAsset>>;
  saveProduct(
    id: string | null,
    value: DigitalProductInput,
  ): Promise<string | null>;
  setProductPublished(
    id: string,
    published: boolean,
    now: Date,
  ): Promise<boolean>;
  setProductTrash(id: string, trashed: boolean, now: Date): Promise<boolean>;
  attachZip(productId: string, file: StoreZipAttachment): Promise<string | null>;
  attachVideo(
    productId: string,
    videoKey: string,
    videoUrl: string,
  ): Promise<boolean>;
  incrementProductSales(productId: string): Promise<boolean>;
  updateProductRating(
    productId: string,
    ratingAverage: number,
    ratingCount: number,
  ): Promise<boolean>;
  attachPaymentProof(
    orderId: string,
    file: StorePaymentProofFile,
    now: Date,
  ): Promise<string | null>;
  signPaymentProofUrl(fileId: string): Promise<string | null>;
  listOrders(options: StoreOrderListOptions): Promise<unknown[]>;
  findOrderById(orderId: string): Promise<unknown | null>;
  findOrderByCode(orderCode: string): Promise<unknown | null>;
  insertOrder(value: StoreOrderInsert): Promise<unknown>;
  updateOrder(orderId: string, patch: StoreOrderPatch): Promise<unknown | null>;
  listCoupons(): Promise<unknown[]>;
  findCouponById(id: string): Promise<unknown | null>;
  findCouponByCode(code: string): Promise<unknown | null>;
  createCoupon(value: DigitalCouponInput): Promise<string | null>;
  updateCoupon(id: string, value: DigitalCouponInput): Promise<string | null>;
  deleteCoupon(id: string): Promise<boolean>;
  incrementCouponUse(couponId: string): Promise<boolean>;
  listReviewsByProduct(
    productId: string,
    options: { publicOnly: boolean },
  ): Promise<unknown[]>;
  listAllReviews(): Promise<unknown[]>;
  findReviewById(reviewId: string): Promise<unknown | null>;
  findReviewByOrderId(orderId: string): Promise<unknown | null>;
  upsertReview(value: StoreReviewInsert): Promise<string | null>;
  updateReview(reviewId: string, patch: StoreReviewPatch): Promise<boolean>;
  recalculateProductRating(
    productId: string,
  ): Promise<{ ratingAverage: number; ratingCount: number }>;
  readConfig(): Promise<StoreConfig>;
  transaction<T>(callback: (tx: StoreTransaction) => Promise<T>): Promise<T>;
  signedDownloadUrl(key: string, filename: string): Promise<string>;
}

async function invalidate(fn: StoreCacheInvalidator): Promise<void> {
  try {
    await fn();
  } catch {
    throw new Error("Data tersimpan, tetapi cache belum berhasil diperbarui.");
  }
}

function generateOrderCode(): string {
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += ORDER_ALPHABET[randomInt(ORDER_ALPHABET.length)];
  }
  return `OBL-STR-${suffix}`;
}

/** SHA-256 forensic fingerprint: 24 uppercase hex chars, salted with IP_HASH_SALT. */
export function createLicenseFingerprint(
  orderCode: string,
  buyerEmail: string,
  buyerWhatsapp: string,
  salt: string,
): string {
  return createHash("sha256")
    .update(`${orderCode}|${buyerEmail}|${buyerWhatsapp}|${salt}`)
    .digest("hex")
    .slice(0, 24)
    .toUpperCase();
}

function readProduct(raw: unknown): DigitalProductRecord {
  return digitalProductRecordSchema.parse(raw);
}

function toPublicProduct(
  row: DigitalProductRecord,
  media: ReadonlyMap<string, StoreMediaAsset>,
): PublicStoreProduct {
  const thumbnail = row.thumbnailMediaId
    ? media.get(row.thumbnailMediaId)
    : undefined;
  return publicStoreProductSchema.parse({
    id: row.id,
    slug: row.slug,
    title: row.title,
    productType: row.productType,
    tagline: row.tagline,
    summary: row.summary,
    version: row.version,
    priceSingle: row.priceSingle,
    priceCommercial: row.priceCommercial,
    compareAtPriceSingle: row.compareAtPriceSingle,
    compareAtPriceCommercial: row.compareAtPriceCommercial,
    setupServicePrice: row.setupServicePrice,
    packageSizeBytes: row.packageSizeBytes,
    videoUrl:
      row.videoUrl && z.url().safeParse(row.videoUrl).success
        ? row.videoUrl
        : null,
    changelog: row.changelog,
    salesCount: row.salesCount,
    ratingAverage: row.ratingAverage,
    ratingCount: row.ratingCount,
    techStack: row.techStack,
    features: row.features,
    includedFiles: row.includedFiles,
    demoUrl: row.demoUrl && z.url().safeParse(row.demoUrl).success ? row.demoUrl : null,
    githubRepoInfo: row.githubRepoInfo,
    isFeatured: row.isFeatured,
    sortOrder: row.sortOrder,
    thumbnail: thumbnail
      ? { url: thumbnail.hero, alt: thumbnail.alt || row.title }
      : null,
    gallery: row.gallery.flatMap((item) => {
      const asset = media.get(item.mediaId);
      return asset
        ? [
            {
              url: asset.hero,
              alt: asset.alt || row.title,
              ...(item.caption ? { caption: item.caption } : {}),
            },
          ]
        : [];
    }),
    hasPackage: row.privateFileId !== null,
  });
}

async function publicProjection(
  store: StoreStore,
  row: DigitalProductRecord,
): Promise<PublicStoreProduct> {
  const ids = [
    row.thumbnailMediaId,
    ...row.gallery.map((item) => item.mediaId),
  ];
  return toPublicProduct(row, await store.resolveMedia(ids));
}

/** Text certificate with buyer identity, licence scope, and forensic fingerprint. */
export function buildStoreLicenseCertificate(
  order: Omit<StoreOrderLookup, "productSlug"> & { productSlug?: string },
): string {
  const tier =
    order.licenseTier === "commercial"
      ? "Commercial / Agency License (multi-proyek klien)"
      : "Single Project License (1 proyek pribadi/klien)";
  const expires = order.expiresAt
    ? order.expiresAt.toISOString()
    : "Belum diaktifkan (menunggu pembayaran lunas)";
  return [
    "OPENBYTE LABS - SERTIFIKAT LISENSI DIGITAL RESMI",
    "================================================================",
    `Kode Order / Lisensi   : ${order.orderCode}`,
    `Produk                 : ${order.productTitle} (v${order.productVersion})`,
    `Pemegang Lisensi       : ${order.buyerName}`,
    `Email Pembeli          : ${order.buyerEmail}`,
    `WhatsApp Pembeli       : ${order.buyerWhatsapp}`,
    `Tipe Lisensi           : ${tier}`,
    `Nominal Transaksi      : ${rupiah(order.amount)}`,
    `SHA-256 License Fingerprint : OBL-FP-${order.licenseFingerprint}`,
    `Status Pembayaran      : ${order.paymentStatus.toUpperCase()}`,
    `Kuota Unduhan          : ${order.downloadCount} / ${order.maxDownloads}`,
    `Masa Berlaku Tautan    : ${expires}`,
    `Status Lisensi         : ${order.isRevoked ? "DICABUT" : "AKTIF"}`,
    "",
    "KETENTUAN LISENSI & ANTI-REDISTRIBUSI",
    "----------------------------------------------------------------",
    "1. Lisensi diberikan kepada pemegang yang namanya tercantum di atas",
    "   dan tidak dapat dipindahtangankan tanpa persetujuan tertulis.",
    "2. Single Project License hanya untuk satu proyek pribadi/klien.",
    "   Commercial/Agency License dapat dipakai pada banyak proyek klien,",
    "   namun TETAP dilarang menjual ulang, membagikan, mempublikasikan,",
    "   atau menjadikan source code/HTML ini sebagai template marketplace.",
    "3. Dilarang menghapus fingerprint lisensi, membagikan PIN, atau",
    "   mendistribusikan ulang tautan unduhan Presigned R2 Private.",
    "4. Pelanggaran distribusi dikenakan pencabutan lisensi (kill-switch)",
    "   serta proses hukum sesuai UU Hak Cipta No. 28 Tahun 2014.",
    "",
    "Dokumen ini dibangkitkan secara dinamis oleh sistem OpenByte Labs.",
    `Portal unduhan resmi: ${LICENSE_ACCESS_URL}`,
  ].join("\n");
}

function licenceView(
  order: StoreOrderLookup | DigitalOrderRecord,
  productTitle: string,
  productVersion: string,
  hasPackage: boolean,
  extra: { downloadUrl?: string; expiresInSeconds?: number } = {},
): StoreLicenseView {
  return storeLicenseViewSchema.parse({
    orderCode: order.orderCode,
    productTitle,
    productSlug:
      "productSlug" in order && typeof order.productSlug === "string"
        ? order.productSlug
        : "",
    productVersion,
    licenseTier: order.licenseTier,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    licenseFingerprint: order.licenseFingerprint,
    maxDownloads: order.maxDownloads,
    downloadCount: order.downloadCount,
    remainingDownloads: Math.max(0, order.maxDownloads - order.downloadCount),
    expiresAt: order.expiresAt ? order.expiresAt.toISOString() : null,
    certificate: buildStoreLicenseCertificate({
      ...order,
      productTitle,
      productVersion,
      hasPackage,
    }),
    hasPackage,
    ...extra,
  });
}

/** Rejection messages are part of the public contract; keep them verbatim. */
async function assertLicenceCanDownload(
  order: StoreOrderLookup,
  pin: string,
  ipHash: string,
  now: Date,
): Promise<void> {
  if (!(await verifyTrackingPin(pin, order.accessPinHash ?? undefined))) {
    throw new StoreLicenseError("Kode order atau PIN lisensi tidak valid.");
  }
  if (order.paymentStatus !== "paid") {
    throw new StoreLicenseError(
      "Pesanan belum berstatus lunas. Hubungi Admin untuk aktivasi lisensi.",
    );
  }
  if (order.isRevoked) {
    throw new StoreLicenseError(
      "Lisensi ini telah dicabut karena pelanggaran ketentuan distribusi.",
    );
  }
  if (order.expiresAt && order.expiresAt.getTime() <= now.getTime()) {
    throw new StoreLicenseError(
      "Masa berlaku tautan unduhan telah berakhir. Hubungi Admin untuk perpanjangan kuota.",
    );
  }
  if (order.downloadCount >= order.maxDownloads) {
    throw new StoreLicenseError(
      "Kuota unduhan maksimum (3x) telah habis. Hubungi Admin bila membutuhkan unduhan ulang.",
    );
  }
  // IP anomaly lock: a changed address must be cleared by an Owner PIN reset.
  if (order.lastDownloadIpHash && order.lastDownloadIpHash !== ipHash) {
    throw new StoreLicenseError(
      "Alamat IP berubah sejak unduhan terakhir. Hubungi Admin untuk reset PIN lisensi.",
    );
  }
}

function deliveryMessage(
  order: StoreOrderLookup,
  rawPin: string,
): string {
  return [
    "Halo, lisensi Digital Store OpenByte Labs Anda sudah AKTIF.",
    "",
    `Produk      : ${order.productTitle} (v${order.productVersion})`,
    `Kode Order  : ${order.orderCode}`,
    `PIN Lisensi : ${rawPin}`,
    `Tipe        : ${order.licenseTier === "commercial" ? "Commercial" : "Single Project"}`,
    "",
    `Buka portal unduhan: ${LICENSE_ACCESS_URL}`,
    "Masukkan Kode Order dan PIN di atas. Tautan unduhan hanya aktif 60 detik",
    "dan jangan pernah dibagikan kepada pihak lain.",
    "",
    "Terima kasih,",
    "Tim OpenByte Labs",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Admin: product catalogue (Editor & Owner)
// ---------------------------------------------------------------------------

export async function listAdminDigitalProducts(
  store: StoreStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<DigitalProductRecord[]> {
  authorize(principal, "digital-products", "read");
  const options = storeProductListOptionsSchema.parse(input ?? {});
  return z
    .array(digitalProductRecordSchema)
    .parse(await store.listProducts({ ...options, publicOnly: false }));
}

export async function saveDigitalProduct(
  store: StoreStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<string> {
  authorize(principal, "digital-products", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = digitalProductInputSchema.parse(input);
  if (id !== null) {
    const existing = await store.findProductById(id);
    if (!existing) throw new Error("Produk digital tidak ditemukan.");
    if (readProduct(existing).deletedAt) {
      throw new Error("Pulihkan produk dari Trash sebelum mengubahnya.");
    }
  }
  const saved = await store.saveProduct(id, value);
  if (!saved) throw new Error("Produk digital tidak ditemukan.");
  await invalidate(invalidateCache);
  return saved;
}

export async function publishDigitalProduct(
  store: StoreStore,
  principal: AdminPrincipal | null,
  id: string,
  isPublished: boolean,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<void> {
  authorize(principal, "digital-products", "publish");
  z.uuid().parse(id);
  const published = z.boolean().parse(isPublished);
  const existing = await store.findProductById(id);
  if (!existing) throw new Error("Produk digital tidak ditemukan.");
  if (readProduct(existing).deletedAt) {
    throw new Error("Pulihkan produk dari Trash sebelum menerbitkannya.");
  }
  if (!(await store.setProductPublished(id, published, new Date()))) {
    throw new Error("Status produk tidak berubah.");
  }
  await invalidate(invalidateCache);
}

export async function setDigitalProductTrash(
  store: StoreStore,
  principal: AdminPrincipal | null,
  id: string,
  trashed: boolean,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<void> {
  const isTrashing = z.boolean().parse(trashed);
  authorize(principal, "digital-products", isTrashing ? "delete" : "restore");
  z.uuid().parse(id);
  if (!(await store.setProductTrash(id, isTrashing, new Date()))) {
    throw new Error("Produk tidak ditemukan atau status Trash tidak berubah.");
  }
  await invalidate(invalidateCache);
}

export async function attachProductZipFile(
  store: StoreStore,
  principal: AdminPrincipal | null,
  productId: string,
  fileMeta: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<string> {
  authorize(principal, "digital-products", "update");
  z.uuid().parse(productId);
  const file = storeZipAttachmentSchema.parse(fileMeta);
  const existing = await store.findProductById(productId);
  if (!existing) throw new Error("Produk digital tidak ditemukan.");
  if (readProduct(existing).deletedAt) {
    throw new Error("Pulihkan produk dari Trash sebelum mengunggah paket.");
  }
  const fileId = await store.attachZip(productId, file);
  if (!fileId) throw new Error("Produk digital tidak ditemukan.");
  await invalidate(invalidateCache);
  return fileId;
}

// ---------------------------------------------------------------------------
// Admin: orders & licences (Owner only)
// ---------------------------------------------------------------------------

const activationOptionsSchema = z
  .object({
    maxDownloads: z.number().int().min(0).max(100).optional(),
    validDays: z.number().int().min(1).max(365).optional(),
  })
  .strict();

export async function listAdminDigitalOrders(
  store: StoreStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<DigitalOrderAdminRecord[]> {
  authorize(principal, "digital-orders", "read");
  const options = storeOrderListOptionsSchema.parse(input ?? {});
  return z
    .array(digitalOrderAdminRecordSchema)
    .parse(await store.listOrders(options));
}

async function ownerOrder(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
): Promise<StoreOrderLookup> {
  authorize(principal, "digital-orders", "update");
  z.uuid().parse(orderId);
  const raw = await store.findOrderById(orderId);
  if (!raw) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  return storeOrderLookupSchema.parse(raw);
}

export async function activateOrderLicense(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
  options: unknown = {},
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<{ orderCode: string; rawPin: string; whatsappDeliveryUrl: string | null }> {
  const order = await ownerOrder(store, principal, orderId);
  const settings = activationOptionsSchema.parse(options ?? {});
  const now = new Date();
  const rawPin = generateTrackingPin();
  const accessPinHash = await hashTrackingPin(rawPin);
  const firstActivation = order.paymentStatus !== "paid";
  const updated = await store.updateOrder(order.id, {
    paymentStatus: "paid",
    paidAt: now,
    isRevoked: false,
    revokedReason: null,
    accessPinHash,
    pinVersion: order.pinVersion + 1,
    expiresAt: new Date(
      now.getTime() + (settings.validDays ?? DEFAULT_VALID_DAYS) * 86_400_000,
    ),
    maxDownloads: settings.maxDownloads ?? DEFAULT_MAX_DOWNLOADS,
    lastDownloadIpHash: null,
  });
  if (!updated) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  if (firstActivation) await store.incrementProductSales(order.productId);
  await invalidate(invalidateCache);
  return {
    orderCode: order.orderCode,
    rawPin,
    whatsappDeliveryUrl: safeWhatsappUrl(order.buyerWhatsapp, deliveryMessage(order, rawPin)),
  };
}

export async function regenerateOrderPin(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<{ orderCode: string; rawPin: string; whatsappDeliveryUrl: string | null }> {
  const order = await ownerOrder(store, principal, orderId);
  const rawPin = generateTrackingPin();
  const updated = await store.updateOrder(order.id, {
    accessPinHash: await hashTrackingPin(rawPin),
    pinVersion: order.pinVersion + 1,
    lastDownloadIpHash: null,
  });
  if (!updated) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  await invalidate(invalidateCache);
  return {
    orderCode: order.orderCode,
    rawPin,
    whatsappDeliveryUrl: safeWhatsappUrl(order.buyerWhatsapp, deliveryMessage(order, rawPin)),
  };
}

export async function addOrderDownloadQuota(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
  additionalQuota = 3,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<{ orderId: string; maxDownloads: number }> {
  const order = await ownerOrder(store, principal, orderId);
  const addition = z.number().int().min(1).max(100).parse(additionalQuota);
  const updated = await store.updateOrder(order.id, {
    maxDownloads: order.maxDownloads + addition,
  });
  if (!updated) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  await invalidate(invalidateCache);
  return { orderId: order.id, maxDownloads: order.maxDownloads + addition };
}

export async function setOrderRevoked(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
  isRevoked: boolean,
  reason?: string,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<{ orderId: string; isRevoked: boolean }> {
  const order = await ownerOrder(store, principal, orderId);
  const revoked = z.boolean().parse(isRevoked);
  const note = reason === undefined ? null : z.string().trim().max(500).parse(reason);
  const updated = await store.updateOrder(order.id, {
    isRevoked: revoked,
    revokedReason: revoked ? note : null,
  });
  if (!updated) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  await invalidate(invalidateCache);
  return { orderId: order.id, isRevoked: revoked };
}

function safeWhatsappUrl(number: string, message: string): string | null {
  if (!normalizeWhatsapp(number)) return null;
  return whatsappUrl(message, number);
}

// ---------------------------------------------------------------------------
// Public store catalogue & licence claim
// ---------------------------------------------------------------------------

export async function listPublicDigitalProducts(
  store: StoreStore,
  filter: unknown = {},
): Promise<PublicStoreProduct[]> {
  const options = storeProductListOptionsSchema.parse({
    ...(filter as Record<string, unknown>),
    publicOnly: true,
  });
  const rows = z
    .array(digitalProductRecordSchema)
    .parse(await store.listProducts(options));
  const visible = rows.filter(
    (row) => row.status === "published" && row.deletedAt === null,
  );
  const media = await store.resolveMedia(
    visible.flatMap((row) => [
      row.thumbnailMediaId,
      ...row.gallery.map((item) => item.mediaId),
    ]),
  );
  return visible.map((row) => toPublicProduct(row, media));
}

export async function getPublicDigitalProductBySlug(
  store: StoreStore,
  slug: unknown,
): Promise<PublicStoreProduct | null> {
  const parsedSlug = z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .parse(slug);
  const raw = await store.findProductBySlug(parsedSlug);
  if (!raw) return null;
  const row = readProduct(raw);
  if (row.status !== "published" || row.deletedAt !== null) return null;
  return publicProjection(store, row);
}

export async function listPublishedStoreSlugs(
  store: StoreStore,
): Promise<string[]> {
  return z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    .parse(await store.listPublishedProductSlugs());
}

type StorePricing = {
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  totalAmount: number;
  coupon: DigitalCouponRecord | null;
};

function licenceBaseAmount(
  product: DigitalProductRecord,
  tier: "single" | "commercial",
): number {
  const amount =
    tier === "commercial" ? product.priceCommercial : product.priceSingle;
  if (amount === null || amount === undefined) {
    throw new StoreLicenseError(
      "Lisensi Commercial belum tersedia untuk produk ini.",
      "input_tidak_valid",
    );
  }
  return amount;
}

async function computePricing(
  store: StoreStore,
  product: DigitalProductRecord,
  tier: "single" | "commercial",
  includeSetupService: boolean,
  couponCode: string | undefined,
  now: Date,
): Promise<StorePricing> {
  const baseAmount = licenceBaseAmount(product, tier);
  const setupFeeAmount =
    includeSetupService && product.setupServicePrice !== null
      ? product.setupServicePrice
      : 0;
  let coupon: DigitalCouponRecord | null = null;
  let discountAmount = 0;

  if (couponCode) {
    const raw = await store.findCouponByCode(couponCode);
    if (!raw) {
      throw new StoreLicenseError(
        "Kode kupon tidak ditemukan atau sudah tidak aktif.",
        "input_tidak_valid",
      );
    }
    coupon = digitalCouponRecordSchema.parse(raw);
    if (!coupon.isActive) {
      throw new StoreLicenseError("Kode kupon sudah tidak aktif.", "input_tidak_valid");
    }
    if (coupon.expiresAt && coupon.expiresAt.getTime() <= now.getTime()) {
      throw new StoreLicenseError("Kode kupon sudah kedaluwarsa.", "input_tidak_valid");
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new StoreLicenseError("Kuota kupon sudah habis.", "input_tidak_valid");
    }
    if (coupon.productId !== null && coupon.productId !== product.id) {
      throw new StoreLicenseError(
        "Kode kupon tidak berlaku untuk produk ini.",
        "input_tidak_valid",
      );
    }
    if (baseAmount < coupon.minOrderAmount) {
      throw new StoreLicenseError(
        "Minimal belanja untuk kupon ini belum terpenuhi.",
        "input_tidak_valid",
      );
    }
    const rawDiscount =
      coupon.discountType === "percent"
        ? Math.floor((baseAmount * coupon.discountValue) / 100)
        : Math.min(baseAmount, coupon.discountValue);
    const capped =
      coupon.maxDiscountAmount === null
        ? rawDiscount
        : Math.min(rawDiscount, coupon.maxDiscountAmount);
    discountAmount = Math.max(0, Math.min(baseAmount, capped));
  }

  return {
    baseAmount,
    setupFeeAmount,
    discountAmount,
    totalAmount: Math.max(0, baseAmount - discountAmount) + setupFeeAmount,
    coupon,
  };
}

/** Preview a coupon for the checkout box without creating an order. */
export async function previewStoreCoupon(
  store: StoreStore,
  input: unknown,
): Promise<StoreCouponPreviewResult> {
  const value = storeCouponPreviewInputSchema.parse(input);
  const raw = await store.findProductBySlug(value.productSlug);
  if (!raw) throw new StoreLicenseError("Produk tidak tersedia.", "gagal");
  const product = readProduct(raw);
  if (product.status !== "published" || product.deletedAt !== null) {
    throw new StoreLicenseError("Produk tidak tersedia.", "gagal");
  }
  const pricing = await computePricing(
    store,
    product,
    value.licenseTier,
    value.includeSetupService === true,
    value.code,
    new Date(),
  );
  return storeCouponPreviewResultSchema.parse({
    code: value.code,
    description: pricing.coupon?.description ?? "",
    discountType: pricing.coupon?.discountType ?? "percent",
    discountValue: pricing.coupon?.discountValue ?? 0,
    baseAmount: pricing.baseAmount,
    setupFeeAmount: pricing.setupFeeAmount,
    discountAmount: pricing.discountAmount,
    totalAmount: pricing.totalAmount,
  });
}

export async function createPublicStoreOrder(
  store: StoreStore,
  input: unknown,
): Promise<{
  orderCode: string;
  whatsappUrl: string | null;
  amount: number;
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  couponCode: string | null;
  productTitle: string;
  licenseTier: "single" | "commercial";
  licenseFingerprint: string;
}> {
  const value = storeCheckoutInputSchema.parse(input);
  const raw = await store.findProductBySlug(value.productSlug);
  if (!raw) throw new StoreLicenseError("Produk tidak tersedia.", "gagal");
  const product = readProduct(raw);
  if (product.status !== "published" || product.deletedAt !== null) {
    throw new StoreLicenseError("Produk tidak tersedia.", "gagal");
  }
  const now = new Date();
  const pricing = await computePricing(
    store,
    product,
    value.licenseTier,
    value.includeSetupService === true,
    value.couponCode,
    now,
  );

  const config = await store.readConfig();
  let orderCode = "";
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = generateOrderCode();
    if (!(await store.findOrderByCode(candidate))) {
      orderCode = candidate;
      break;
    }
  }
  if (!orderCode) {
    throw new StoreLicenseError(
      "Kode order tidak dapat dibuat. Coba lagi beberapa saat.",
      "gagal",
    );
  }
  const licenseFingerprint = createLicenseFingerprint(
    orderCode,
    value.buyerEmail,
    value.buyerWhatsapp,
    config.ipHashSalt,
  );
  const record = digitalOrderRecordSchema.parse(
    await store.insertOrder({
      orderCode,
      productId: product.id,
      licenseTier: value.licenseTier,
      buyerName: value.buyerName,
      buyerWhatsapp: value.buyerWhatsapp,
      buyerEmail: value.buyerEmail,
      buyerGithub: value.buyerGithub ?? null,
      notes: value.notes ?? "",
      amount: pricing.totalAmount,
      baseAmount: pricing.baseAmount,
      setupFeeAmount: pricing.setupFeeAmount,
      discountAmount: pricing.discountAmount,
      couponCode: pricing.coupon?.code ?? null,
      includeSetupService: pricing.setupFeeAmount > 0,
      licenseFingerprint,
    }),
  );
  if (pricing.coupon) await store.incrementCouponUse(pricing.coupon.id);

  const message = [
    "Halo OpenByte Labs, saya ingin memesan produk Digital Store:",
    "",
    `Kode Order : ${orderCode}`,
    `Produk     : ${product.title} (v${product.version})`,
    `Lisensi    : ${value.licenseTier === "commercial" ? "Commercial / Agency" : "Single Project"}`,
    `Harga      : ${rupiah(pricing.baseAmount)}`,
    ...(pricing.discountAmount > 0
      ? [`Kupon      : ${pricing.coupon?.code} (-${rupiah(pricing.discountAmount)})`]
      : []),
    ...(pricing.setupFeeAmount > 0
      ? [`Instalasi  : ${rupiah(pricing.setupFeeAmount)}`]
      : []),
    `Total      : ${rupiah(pricing.totalAmount)}`,
    "",
    `Nama       : ${value.buyerName}`,
    `WhatsApp   : ${value.buyerWhatsapp}`,
    `Email      : ${value.buyerEmail}`,
    ...(value.buyerGithub ? [`GitHub     : ${value.buyerGithub}`] : []),
    ...(value.notes ? [`Catatan    : ${value.notes}`] : []),
    "",
    "Saya menyetujui ketentuan lisensi dan larangan redistribusi.",
    "Mohon konfirmasi pembayaran dan aktivasi PIN lisensi.",
  ].join("\n");
  return {
    orderCode: record.orderCode,
    whatsappUrl: config.adminWhatsapp
      ? safeWhatsappUrl(config.adminWhatsapp, message)
      : null,
    amount: pricing.totalAmount,
    baseAmount: pricing.baseAmount,
    setupFeeAmount: pricing.setupFeeAmount,
    discountAmount: pricing.discountAmount,
    couponCode: pricing.coupon?.code ?? null,
    productTitle: product.title,
    licenseTier: value.licenseTier,
    licenseFingerprint,
  };
}

/**
 * `inspect` only reports licence state; `download` re-checks inside a
 * SELECT ... FOR UPDATE transaction, consumes exactly one quota, and returns
 * a 60-second presigned R2 URL. No private key appears in the result.
 */
export async function verifyAndConsumeStoreDownload(
  store: StoreStore,
  input: unknown,
): Promise<StoreLicenseView> {
  const value = storeLicenseAccessInputSchema.parse(input);
  const now = new Date();

  if (value.mode === "inspect") {
    const raw = await store.findOrderByCode(value.orderCode);
    if (!raw) {
      throw new StoreLicenseError("Kode order atau PIN lisensi tidak valid.");
    }
    const order = storeOrderLookupSchema.parse(raw);
    await assertLicenceCanDownload(order, value.pin, value.ipHash, now);
    return licenceView(
      order,
      order.productTitle,
      order.productVersion,
      order.hasPackage,
    );
  }

  const result = await store.transaction(async (tx) => {
    const raw = await tx.orderForUpdate(value.orderCode);
    if (!raw) {
      throw new StoreLicenseError("Kode order atau PIN lisensi tidak valid.");
    }
    const locked = storeOrderLookupSchema.parse(raw);
    await assertLicenceCanDownload(locked, value.pin, value.ipHash, now);
    const pkg = await tx.packageForDownload(locked.productId);
    if (!pkg || !locked.hasPackage) {
      throw new StoreLicenseError(
        "Paket .zip produk belum tersedia. Hubungi Admin.",
        "gagal",
      );
    }
    const consumedRaw = await tx.consumeDownload(
      locked.id,
      value.ipHash,
      now,
    );
    if (!consumedRaw) {
      throw new StoreLicenseError("Kuota unduhan tidak dapat diperbarui.", "gagal");
    }
    const consumed = digitalOrderRecordSchema.parse(consumedRaw);
    const downloadUrl = await store.signedDownloadUrl(pkg.key, pkg.filename);
    return { locked, consumed, downloadUrl };
  });

  return licenceView(
    result.consumed,
    result.locked.productTitle,
    result.locked.productVersion,
    result.locked.hasPackage,
    {
      downloadUrl: result.downloadUrl,
      expiresInSeconds: DOWNLOAD_URL_TTL_SECONDS,
    },
  );
}

// ---------------------------------------------------------------------------
// Fase 2: video produk, bukti bayar, kupon, dan ulasan
// ---------------------------------------------------------------------------

/** Links a verified public-bucket video to its product. */
export async function attachProductVideo(
  store: StoreStore,
  principal: AdminPrincipal | null,
  productId: string,
  meta: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<void> {
  authorize(principal, "digital-products", "update");
  z.uuid().parse(productId);
  const value = z
    .object({ key: z.string().min(1).max(512), url: z.url().max(2048) })
    .strict()
    .parse(meta);
  const existing = await store.findProductById(productId);
  if (!existing) throw new Error("Produk digital tidak ditemukan.");
  if (!(await store.attachVideo(productId, value.key, value.url))) {
    throw new Error("Video produk tidak dapat dipasang.");
  }
  await invalidate(invalidateCache);
}

/** Buyer uploads a transfer proof; verified against the stored buyer identity. */
export async function attachOrderPaymentProof(
  store: StoreStore,
  input: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<{ orderCode: string; fileId: string }> {
  const value = storePaymentProofAttachInputSchema.parse(input);
  const raw = await store.findOrderByCode(value.orderCode);
  if (!raw) {
    throw new StoreLicenseError(
      "Kode order tidak valid.",
      "input_tidak_valid",
    );
  }
  const order = storeOrderLookupSchema.parse(raw);
  if (
    value.buyerWhatsapp &&
    normalizeWhatsapp(value.buyerWhatsapp) !== order.buyerWhatsapp
  ) {
    throw new StoreLicenseError(
      "Nomor WhatsApp tidak cocok dengan pesanan.",
      "input_tidak_valid",
    );
  }
  if (
    value.buyerEmail &&
    value.buyerEmail.toLowerCase() !== order.buyerEmail.toLowerCase()
  ) {
    throw new StoreLicenseError(
      "Email tidak cocok dengan pesanan.",
      "input_tidak_valid",
    );
  }
  if (order.paymentStatus === "cancelled" || order.paymentStatus === "refunded") {
    throw new StoreLicenseError(
      "Pesanan ini tidak dapat menerima bukti pembayaran.",
      "input_tidak_valid",
    );
  }
  const fileId = await store.attachPaymentProof(order.id, value.file, new Date());
  if (!fileId) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  await invalidate(invalidateCache);
  return { orderCode: order.orderCode, fileId };
}

/** Owner-only 5-minute signed URL so Admin can inspect a transfer proof. */
export async function getOrderPaymentProofUrl(
  store: StoreStore,
  principal: AdminPrincipal | null,
  orderId: string,
): Promise<{ url: string }> {
  authorize(principal, "digital-orders", "read");
  z.uuid().parse(orderId);
  const raw = await store.findOrderById(orderId);
  if (!raw) throw new StoreLicenseError("Pesanan tidak ditemukan.", "gagal");
  const order = storeOrderLookupSchema.parse(raw);
  if (!order.paymentProofFileId) {
    throw new StoreLicenseError("Bukti bayar belum diunggah.", "gagal");
  }
  const url = await store.signPaymentProofUrl(order.paymentProofFileId);
  if (!url) throw new StoreLicenseError("Bukti bayar tidak ditemukan.", "gagal");
  return { url };
}

/** Only a paid, non-revoked licence may leave a review. */
export async function submitVerifiedStoreReview(
  store: StoreStore,
  input: unknown,
): Promise<StoreReviewPublic> {
  const value = storeReviewSubmitInputSchema.parse(input);
  const raw = await store.findOrderByCode(value.orderCode);
  if (!raw) {
    throw new StoreLicenseError("Kode order atau PIN lisensi tidak valid.");
  }
  const order = storeOrderLookupSchema.parse(raw);
  if (!(await verifyTrackingPin(value.pin, order.accessPinHash ?? undefined))) {
    throw new StoreLicenseError("Kode order atau PIN lisensi tidak valid.");
  }
  if (order.paymentStatus !== "paid") {
    throw new StoreLicenseError(
      "Ulasan hanya dapat dikirim setelah pembayaran lunas.",
    );
  }
  if (order.isRevoked) {
    throw new StoreLicenseError(
      "Lisensi ini telah dicabut karena pelanggaran ketentuan distribusi.",
    );
  }
  const reviewId = await store.upsertReview({
    productId: order.productId,
    orderId: order.id,
    buyerName: order.buyerName,
    licenseTier: order.licenseTier,
    rating: value.rating,
    comment: value.comment,
    mediaItems: value.mediaItems,
  });
  if (!reviewId) throw new StoreLicenseError("Ulasan tidak dapat disimpan.", "gagal");
  await store.recalculateProductRating(order.productId);
  const stored = await store.findReviewById(reviewId);
  if (!stored) throw new StoreLicenseError("Ulasan tidak ditemukan.", "gagal");
  const record = storeReviewAdminRecordSchema.parse(stored);
  return storeReviewPublicSchema.parse({
    id: record.id,
    buyerName: record.buyerName,
    licenseTier: record.licenseTier,
    rating: record.rating,
    comment: record.comment,
    mediaItems: record.mediaItems,
    adminReply: record.adminReply,
    createdAt: record.createdAt,
  });
}

function toPublicReview(raw: unknown): StoreReviewPublic {
  const row = raw as Record<string, unknown>;
  return storeReviewPublicSchema.parse({
    id: row.id,
    buyerName: row.buyerName,
    licenseTier: row.licenseTier,
    rating: row.rating,
    comment: row.comment,
    mediaItems: row.mediaItems,
    adminReply: row.adminReply,
    createdAt: row.createdAt,
  });
}

export async function listPublicProductReviews(
  store: StoreStore,
  productSlug: unknown,
): Promise<StoreReviewPublic[]> {
  const slug = z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .parse(productSlug);
  const raw = await store.findProductBySlug(slug);
  if (!raw) return [];
  const product = readProduct(raw);
  const list = await store.listReviewsByProduct(product.id, { publicOnly: true });
  return list.map(toPublicReview);
}

export async function listAdminStoreReviews(
  store: StoreStore,
  principal: AdminPrincipal | null,
): Promise<StoreReviewAdminRecord[]> {
  authorize(principal, "digital-reviews", "read");
  return z.array(storeReviewAdminRecordSchema).parse(await store.listAllReviews());
}

export async function moderateStoreReview(
  store: StoreStore,
  principal: AdminPrincipal | null,
  input: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<StoreReviewAdminRecord> {
  authorize(principal, "digital-reviews", "update");
  const value = storeReviewModerationInputSchema.parse(input);
  const existing = await store.findReviewById(value.id);
  if (!existing) throw new Error("Ulasan tidak ditemukan.");
  const patch: StoreReviewPatch = {};
  if (value.status !== undefined) patch.status = value.status;
  if (value.adminReply !== undefined) patch.adminReply = value.adminReply;
  if (!(await store.updateReview(value.id, patch))) {
    throw new Error("Ulasan tidak dapat diperbarui.");
  }
  const updated = await store.findReviewById(value.id);
  if (!updated) throw new Error("Ulasan tidak ditemukan.");
  const record = storeReviewAdminRecordSchema.parse(updated);
  await store.recalculateProductRating(record.productId);
  await invalidate(invalidateCache);
  return record;
}

export async function listAdminDigitalCoupons(
  store: StoreStore,
  principal: AdminPrincipal | null,
): Promise<DigitalCouponRecord[]> {
  authorize(principal, "digital-coupons", "read");
  return z.array(digitalCouponRecordSchema).parse(await store.listCoupons());
}

export async function saveDigitalCoupon(
  store: StoreStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<string> {
  authorize(principal, "digital-coupons", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = digitalCouponInputSchema.parse(input);
  const saved =
    id === null
      ? await store.createCoupon(value)
      : await store.updateCoupon(id, value);
  if (!saved) throw new Error("Kupon tidak ditemukan.");
  await invalidate(invalidateCache);
  return saved;
}

export async function deleteDigitalCoupon(
  store: StoreStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: StoreCacheInvalidator = noInvalidation,
): Promise<void> {
  authorize(principal, "digital-coupons", "delete");
  z.uuid().parse(id);
  if (!(await store.deleteCoupon(id))) throw new Error("Kupon tidak ditemukan.");
  await invalidate(invalidateCache);
}

/** Same catalogue, minus the current product, ordered by social proof. */
export async function listRelatedDigitalProducts(
  store: StoreStore,
  slug: string,
  limit = 3,
): Promise<PublicStoreProduct[]> {
  const products = await listPublicDigitalProducts(store);
  return products
    .filter((product) => product.slug !== slug)
    .sort(
      (a, b) =>
        b.ratingAverage - a.ratingAverage || b.salesCount - a.salesCount,
    )
    .slice(0, limit);
}

export { storeLicenseVerifyInputSchema };
