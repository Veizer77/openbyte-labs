import "server-only";
import { and, asc, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { siteSettings } from "./schema/settings";
import { digitalCoupons, digitalOrders, digitalProducts, digitalReviews } from "./schema/store";
import { privateFiles } from "./schema/portal";
import { getEnv } from "@/env";
import { storePackageStorage } from "@/lib/server/r2-store-packages";
import { storeMediaStorage } from "@/lib/server/r2-store-media";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import type {
  StoreConfig,
  StoreMediaAsset,
  StoreOrderInsert,
  StoreOrderPatch,
  StoreReviewInsert,
  StoreReviewPatch,
  StoreStore,
} from "@/services/store";
import type {
  DigitalProductInput,
  StorePaymentProofFile,
  StoreZipAttachment,
} from "@/schemas/store";

const productColumns = {
  id: digitalProducts.id,
  title: digitalProducts.title,
  slug: digitalProducts.slug,
  productType: digitalProducts.productType,
  tagline: digitalProducts.tagline,
  summary: digitalProducts.summary,
  thumbnailMediaId: digitalProducts.thumbnailMediaId,
  gallery: digitalProducts.gallery,
  demoUrl: digitalProducts.demoUrl,
  videoUrl: digitalProducts.videoUrl,
  videoKey: digitalProducts.videoKey,
  relatedProjectId: digitalProducts.relatedProjectId,
  priceSingle: digitalProducts.priceSingle,
  priceCommercial: digitalProducts.priceCommercial,
  compareAtPriceSingle: digitalProducts.compareAtPriceSingle,
  compareAtPriceCommercial: digitalProducts.compareAtPriceCommercial,
  setupServicePrice: digitalProducts.setupServicePrice,
  techStack: digitalProducts.techStack,
  features: digitalProducts.features,
  includedFiles: digitalProducts.includedFiles,
  version: digitalProducts.version,
  packageSizeBytes: digitalProducts.packageSizeBytes,
  changelog: digitalProducts.changelog,
  privateFileId: digitalProducts.privateFileId,
  githubRepoInfo: digitalProducts.githubRepoInfo,
  isFeatured: digitalProducts.isFeatured,
  salesCount: digitalProducts.salesCount,
  ratingAverage: digitalProducts.ratingAverage,
  ratingCount: digitalProducts.ratingCount,
  status: digitalProducts.status,
  publishedAt: digitalProducts.publishedAt,
  sortOrder: digitalProducts.sortOrder,
  deletedAt: digitalProducts.deletedAt,
  createdAt: digitalProducts.createdAt,
  updatedAt: digitalProducts.updatedAt,
};

const reviewColumns = {
  id: digitalReviews.id,
  productId: digitalReviews.productId,
  orderId: digitalReviews.orderId,
  buyerName: digitalReviews.buyerName,
  licenseTier: digitalReviews.licenseTier,
  rating: digitalReviews.rating,
  comment: digitalReviews.comment,
  mediaItems: digitalReviews.mediaItems,
  status: digitalReviews.status,
  adminReply: digitalReviews.adminReply,
  createdAt: digitalReviews.createdAt,
  updatedAt: digitalReviews.updatedAt,
};

const reviewAdminColumns = {
  ...reviewColumns,
  productTitle: digitalProducts.title,
  productVersion: digitalProducts.version,
};

const orderColumns = {
  id: digitalOrders.id,
  orderCode: digitalOrders.orderCode,
  productId: digitalOrders.productId,
  licenseTier: digitalOrders.licenseTier,
  buyerName: digitalOrders.buyerName,
  buyerWhatsapp: digitalOrders.buyerWhatsapp,
  buyerEmail: digitalOrders.buyerEmail,
  buyerGithub: digitalOrders.buyerGithub,
  notes: digitalOrders.notes,
  amount: digitalOrders.amount,
  baseAmount: digitalOrders.baseAmount,
  setupFeeAmount: digitalOrders.setupFeeAmount,
  discountAmount: digitalOrders.discountAmount,
  couponCode: digitalOrders.couponCode,
  includeSetupService: digitalOrders.includeSetupService,
  paymentStatus: digitalOrders.paymentStatus,
  accessPinHash: digitalOrders.accessPinHash,
  pinVersion: digitalOrders.pinVersion,
  licenseFingerprint: digitalOrders.licenseFingerprint,
  downloadCount: digitalOrders.downloadCount,
  maxDownloads: digitalOrders.maxDownloads,
  expiresAt: digitalOrders.expiresAt,
  isRevoked: digitalOrders.isRevoked,
  revokedReason: digitalOrders.revokedReason,
  paidAt: digitalOrders.paidAt,
  lastDownloadedAt: digitalOrders.lastDownloadedAt,
  lastDownloadIpHash: digitalOrders.lastDownloadIpHash,
  paymentProofFileId: digitalOrders.paymentProofFileId,
  paymentProofUploadedAt: digitalOrders.paymentProofUploadedAt,
  createdAt: digitalOrders.createdAt,
  updatedAt: digitalOrders.updatedAt,
};

export function createStoreStore(db: Database): StoreStore {
  async function orderLookup(
    row: Record<string, unknown> | undefined,
  ): Promise<unknown | null> {
    if (!row) return null;
    return { ...row, ...(await readProductMeta(String(row.productId))) };
  }

  async function readProductMeta(productId: string) {
    const [product] = await db
      .select({
        title: digitalProducts.title,
        slug: digitalProducts.slug,
        version: digitalProducts.version,
        privateFileId: digitalProducts.privateFileId,
      })
      .from(digitalProducts)
      .where(eq(digitalProducts.id, productId))
      .limit(1);
    return {
      productTitle: product?.title ?? "Produk Digital",
      productSlug: product?.slug ?? "",
      productVersion: product?.version ?? "1.0.0",
      hasPackage: product?.privateFileId !== null && product?.privateFileId !== undefined,
    };
  }

  return {
    async listProducts(options) {
      const conditions = [
        options.publicOnly
          ? and(
              eq(digitalProducts.status, "published"),
              isNull(digitalProducts.deletedAt),
            )
          : options.trashOnly
            ? isNotNull(digitalProducts.deletedAt)
            : isNull(digitalProducts.deletedAt),
      ];
      if (!options.publicOnly && options.status) {
        conditions.push(eq(digitalProducts.status, options.status));
      }
      if (options.productType) {
        conditions.push(eq(digitalProducts.productType, options.productType));
      }
      if (options.query) {
        const pattern = `%${options.query}%`;
        conditions.push(
          or(
            ilike(digitalProducts.title, pattern),
            ilike(digitalProducts.tagline, pattern),
          ),
        );
      }
      return db
        .select(productColumns)
        .from(digitalProducts)
        .where(and(...conditions))
        .orderBy(asc(digitalProducts.sortOrder), desc(digitalProducts.createdAt))
        .limit(options.limit)
        .offset(options.offset);
    },

    async findProductById(id) {
      const [row] = await db
        .select(productColumns)
        .from(digitalProducts)
        .where(eq(digitalProducts.id, id))
        .limit(1);
      return row ?? null;
    },

    async findProductBySlug(slug) {
      const [row] = await db
        .select(productColumns)
        .from(digitalProducts)
        .where(eq(digitalProducts.slug, slug))
        .orderBy(desc(digitalProducts.createdAt))
        .limit(1);
      return row ?? null;
    },

    async listPublishedProductSlugs() {
      const rows = await db
        .select({ slug: digitalProducts.slug })
        .from(digitalProducts)
        .where(
          and(
            eq(digitalProducts.status, "published"),
            isNull(digitalProducts.deletedAt),
          ),
        )
        .orderBy(asc(digitalProducts.sortOrder));
      return rows.map((row) => row.slug);
    },

    async resolveMedia(ids) {
      const assets = await getPublicMediaAssets(db, ids);
      const result = new Map<string, StoreMediaAsset>();
      for (const [id, asset] of assets) {
        result.set(id, {
          alt: asset.alt,
          card: asset.urls.card,
          hero: asset.urls.hero,
        });
      }
      return result;
    },

    async saveProduct(id: string | null, value: DigitalProductInput) {
      const rows =
        id === null
          ? await db
              .insert(digitalProducts)
              .values(value)
              .returning({ id: digitalProducts.id })
          : await db
              .update(digitalProducts)
              .set({ ...value, updatedAt: new Date() })
              .where(eq(digitalProducts.id, id))
              .returning({ id: digitalProducts.id });
      return rows[0]?.id ?? null;
    },

    async setProductPublished(id, published, now) {
      const rows = await db
        .update(digitalProducts)
        .set({
          status: published ? "published" : "draft",
          publishedAt: published ? now : null,
          updatedAt: now,
        })
        .where(eq(digitalProducts.id, id))
        .returning({ id: digitalProducts.id });
      return rows.length === 1;
    },

    async setProductTrash(id, trashed, now) {
      const rows = await db
        .update(digitalProducts)
        .set({
          deletedAt: trashed ? now : null,
          status: trashed ? "draft" : digitalProducts.status,
          updatedAt: now,
        })
        .where(
          and(
            eq(digitalProducts.id, id),
            trashed
              ? isNull(digitalProducts.deletedAt)
              : isNotNull(digitalProducts.deletedAt),
          ),
        )
        .returning({ id: digitalProducts.id });
      return rows.length === 1;
    },

    async attachZip(productId: string, file: StoreZipAttachment) {
      return db.transaction(async (tx) => {
        const [row] = await tx
          .insert(privateFiles)
          .values({
            key: file.key,
            filename: file.filename,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            uploadedByType: "admin",
            verifiedAt: new Date(),
          })
          .returning({ id: privateFiles.id });
        if (!row) return null;
        await tx
          .update(digitalProducts)
          .set({
            privateFileId: row.id,
            packageSizeBytes: file.sizeBytes,
            updatedAt: new Date(),
          })
          .where(eq(digitalProducts.id, productId));
        return row.id;
      });
    },

    async attachVideo(productId, videoKey, videoUrl) {
      const rows = await db
        .update(digitalProducts)
        .set({ videoKey, videoUrl, updatedAt: new Date() })
        .where(eq(digitalProducts.id, productId))
        .returning({ id: digitalProducts.id });
      return rows.length === 1;
    },

    async incrementProductSales(productId) {
      const rows = await db
        .update(digitalProducts)
        .set({
          salesCount: sql`${digitalProducts.salesCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(digitalProducts.id, productId))
        .returning({ id: digitalProducts.id });
      return rows.length === 1;
    },

    async updateProductRating(productId, ratingAverage, ratingCount) {
      const rows = await db
        .update(digitalProducts)
        .set({ ratingAverage, ratingCount, updatedAt: new Date() })
        .where(eq(digitalProducts.id, productId))
        .returning({ id: digitalProducts.id });
      return rows.length === 1;
    },

    async attachPaymentProof(orderId, file: StorePaymentProofFile, now) {
      return db.transaction(async (tx) => {
        const [row] = await tx
          .insert(privateFiles)
          .values({
            key: file.key,
            filename: file.filename,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            uploadedByType: "client",
            verifiedAt: now,
          })
          .returning({ id: privateFiles.id });
        if (!row) return null;
        await tx
          .update(digitalOrders)
          .set({
            paymentProofFileId: row.id,
            paymentProofUploadedAt: now,
            updatedAt: now,
          })
          .where(eq(digitalOrders.id, orderId));
        return row.id;
      });
    },

    async signPaymentProofUrl(fileId) {
      const [row] = await db
        .select({ key: privateFiles.key })
        .from(privateFiles)
        .where(eq(privateFiles.id, fileId))
        .limit(1);
      if (!row) return null;
      return storeMediaStorage().createSignedProofViewUrl(row.key);
    },

    async listOrders(options) {
      const conditions = [];
      if (options.paymentStatus) {
        conditions.push(eq(digitalOrders.paymentStatus, options.paymentStatus));
      }
      if (options.revoked !== undefined) {
        conditions.push(eq(digitalOrders.isRevoked, options.revoked));
      }
      if (options.query) {
        const pattern = `%${options.query}%`;
        conditions.push(
          or(
            ilike(digitalOrders.orderCode, pattern),
            ilike(digitalOrders.buyerName, pattern),
            ilike(digitalOrders.buyerEmail, pattern),
          ),
        );
      }
      return db
        .select({
          ...orderColumns,
          productTitle: digitalProducts.title,
          productVersion: digitalProducts.version,
          zipFilename: privateFiles.filename,
        })
        .from(digitalOrders)
        .innerJoin(
          digitalProducts,
          eq(digitalOrders.productId, digitalProducts.id),
        )
        .leftJoin(
          privateFiles,
          eq(digitalProducts.privateFileId, privateFiles.id),
        )
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(digitalOrders.createdAt))
        .limit(options.limit)
        .offset(options.offset);
    },

    async findOrderById(orderId) {
      const [row] = await db
        .select(orderColumns)
        .from(digitalOrders)
        .where(eq(digitalOrders.id, orderId))
        .limit(1);
      return orderLookup(row);
    },

    async findOrderByCode(orderCode) {
      const [row] = await db
        .select(orderColumns)
        .from(digitalOrders)
        .where(eq(digitalOrders.orderCode, orderCode))
        .limit(1);
      return orderLookup(row);
    },

    async insertOrder(value: StoreOrderInsert) {
      const [row] = await db
        .insert(digitalOrders)
        .values(value)
        .returning(orderColumns);
      return row ?? null;
    },

    async updateOrder(orderId: string, patch: StoreOrderPatch) {
      const [row] = await db
        .update(digitalOrders)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(digitalOrders.id, orderId))
        .returning(orderColumns);
      return row ?? null;
    },

    async listCoupons() {
      return db
        .select()
        .from(digitalCoupons)
        .orderBy(desc(digitalCoupons.createdAt));
    },

    async findCouponById(id) {
      const [row] = await db
        .select()
        .from(digitalCoupons)
        .where(eq(digitalCoupons.id, id))
        .limit(1);
      return row ?? null;
    },

    async findCouponByCode(code) {
      const [row] = await db
        .select()
        .from(digitalCoupons)
        .where(eq(digitalCoupons.code, code))
        .limit(1);
      return row ?? null;
    },

    async createCoupon(value) {
      const [row] = await db
        .insert(digitalCoupons)
        .values(value)
        .returning({ id: digitalCoupons.id });
      return row?.id ?? null;
    },

    async updateCoupon(id, value) {
      const [row] = await db
        .update(digitalCoupons)
        .set({ ...value, updatedAt: new Date() })
        .where(eq(digitalCoupons.id, id))
        .returning({ id: digitalCoupons.id });
      return row?.id ?? null;
    },

    async deleteCoupon(id) {
      const rows = await db
        .delete(digitalCoupons)
        .where(eq(digitalCoupons.id, id))
        .returning({ id: digitalCoupons.id });
      return rows.length === 1;
    },

    async incrementCouponUse(couponId) {
      const rows = await db
        .update(digitalCoupons)
        .set({
          usedCount: sql`${digitalCoupons.usedCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(digitalCoupons.id, couponId))
        .returning({ id: digitalCoupons.id });
      return rows.length === 1;
    },

    async listReviewsByProduct(productId, options) {
      const conditions = [eq(digitalReviews.productId, productId)];
      if (options.publicOnly) {
        conditions.push(eq(digitalReviews.status, "approved"));
      }
      return db
        .select(reviewColumns)
        .from(digitalReviews)
        .where(and(...conditions))
        .orderBy(desc(digitalReviews.createdAt));
    },

    async listAllReviews() {
      return db
        .select(reviewAdminColumns)
        .from(digitalReviews)
        .innerJoin(
          digitalProducts,
          eq(digitalReviews.productId, digitalProducts.id),
        )
        .orderBy(desc(digitalReviews.createdAt));
    },

    async findReviewById(reviewId) {
      const [row] = await db
        .select(reviewAdminColumns)
        .from(digitalReviews)
        .innerJoin(
          digitalProducts,
          eq(digitalReviews.productId, digitalProducts.id),
        )
        .where(eq(digitalReviews.id, reviewId))
        .limit(1);
      return row ?? null;
    },

    async findReviewByOrderId(orderId) {
      const [row] = await db
        .select(reviewColumns)
        .from(digitalReviews)
        .where(eq(digitalReviews.orderId, orderId))
        .limit(1);
      return row ?? null;
    },

    async upsertReview(value: StoreReviewInsert) {
      const [row] = await db
        .insert(digitalReviews)
        .values(value)
        .onConflictDoUpdate({
          target: digitalReviews.orderId,
          set: {
            buyerName: value.buyerName,
            licenseTier: value.licenseTier,
            rating: value.rating,
            comment: value.comment,
            mediaItems: value.mediaItems,
            updatedAt: new Date(),
          },
        })
        .returning({ id: digitalReviews.id });
      return row?.id ?? null;
    },

    async updateReview(reviewId, patch: StoreReviewPatch) {
      const rows = await db
        .update(digitalReviews)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(digitalReviews.id, reviewId))
        .returning({ id: digitalReviews.id });
      return rows.length === 1;
    },

    async recalculateProductRating(productId) {
      const [row] = await db
        .select({
          average: sql<string | null>`avg(${digitalReviews.rating})`,
          count: sql<number>`count(*)::int`,
        })
        .from(digitalReviews)
        .where(eq(digitalReviews.productId, productId))
        .limit(1);
      const ratingCount = Number(row?.count ?? 0);
      const ratingAverage =
        row?.average === null || row?.average === undefined
          ? 0
          : Math.round(Number(row.average) * 100);
      await db
        .update(digitalProducts)
        .set({ ratingAverage, ratingCount, updatedAt: new Date() })
        .where(eq(digitalProducts.id, productId));
      return { ratingAverage, ratingCount };
    },

    async readConfig(): Promise<StoreConfig> {
      const [row] = await db
        .select({ data: siteSettings.data })
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1);
      const document = row?.data as
        | { general?: { whatsappNumber?: string } }
        | undefined;
      return {
        adminWhatsapp: document?.general?.whatsappNumber ?? "",
        ipHashSalt: getEnv().IP_HASH_SALT,
      };
    },

    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async orderForUpdate(orderCode) {
            const [row] = await tx
              .select(orderColumns)
              .from(digitalOrders)
              .where(eq(digitalOrders.orderCode, orderCode))
              .for("update")
              .limit(1);
            if (!row) return null;
            return { ...row, ...(await productMeta(tx, row.productId)) };
          },
          async consumeDownload(orderId, ipHash, now) {
            const [row] = await tx
              .update(digitalOrders)
              .set({
                downloadCount: sql`${digitalOrders.downloadCount} + 1`,
                lastDownloadedAt: now,
                lastDownloadIpHash: ipHash,
                updatedAt: now,
              })
              .where(eq(digitalOrders.id, orderId))
              .returning(orderColumns);
            return row ?? null;
          },
          async packageForDownload(productId) {
            const [row] = await tx
              .select({
                key: privateFiles.key,
                filename: privateFiles.filename,
              })
              .from(digitalProducts)
              .innerJoin(
                privateFiles,
                eq(digitalProducts.privateFileId, privateFiles.id),
              )
              .where(eq(digitalProducts.id, productId))
              .limit(1);
            return row ?? null;
          },
        }),
      ),

    async signedDownloadUrl(key, filename) {
      return storePackageStorage().createSignedDownloadUrl(key, filename);
    },
  };
}

type TransactionClient = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

async function productMeta(tx: TransactionClient, productId: string) {
  const [product] = await tx
    .select({
      title: digitalProducts.title,
      slug: digitalProducts.slug,
      version: digitalProducts.version,
      privateFileId: digitalProducts.privateFileId,
    })
    .from(digitalProducts)
    .where(eq(digitalProducts.id, productId))
    .limit(1);
  return {
    productTitle: product?.title ?? "Produk Digital",
    productSlug: product?.slug ?? "",
    productVersion: product?.version ?? "1.0.0",
    hasPackage:
      product?.privateFileId !== null && product?.privateFileId !== undefined,
  };
}
