"use server";

import { z } from "zod";
import { authorize } from "@/access/rules";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createStoreStore } from "@/db/store-store";
import { storePackageStorage } from "@/lib/server/r2-store-packages";
import { storeMediaStorage } from "@/lib/server/r2-store-media";
import {
  storeVideoFinalizeInputSchema,
  storeVideoUploadInputSchema,
  storeZipFinalizeInputSchema,
  storeZipUploadInputSchema,
  type DigitalCouponRecord,
  type DigitalOrderAdminRecord,
  type DigitalProductRecord,
  type StoreReviewAdminRecord,
} from "@/schemas/store";
import {
  activateOrderLicense,
  addOrderDownloadQuota,
  attachProductVideo,
  attachProductZipFile,
  deleteDigitalCoupon,
  getOrderPaymentProofUrl,
  listAdminDigitalCoupons,
  listAdminDigitalOrders,
  listAdminDigitalProducts,
  listAdminStoreReviews,
  moderateStoreReview,
  publishDigitalProduct,
  regenerateOrderPin,
  saveDigitalCoupon,
  saveDigitalProduct,
  setDigitalProductTrash,
  setOrderRevoked,
} from "@/services/store";
import { invalidateStoreCache } from "@/services/store-cache";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listDigitalProductsAction(
  input: unknown,
): Promise<ActionResult<DigitalProductRecord[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminDigitalProducts(createStoreStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveDigitalProductAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(
      await saveDigitalProduct(
        createStoreStore(getDb()),
        principal,
        id,
        value,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function publishDigitalProductAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, published } = z
      .object({ id: idSchema, published: z.boolean() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await publishDigitalProduct(
      createStoreStore(getDb()),
      principal,
      id,
      published,
      invalidateStoreCache,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function trashDigitalProductAction(
  input: unknown,
): Promise<ActionResult<{ id: string; trashed: boolean }>> {
  try {
    const { id, trashed } = z
      .object({ id: idSchema, trashed: z.boolean() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await setDigitalProductTrash(
      createStoreStore(getDb()),
      principal,
      id,
      trashed,
      invalidateStoreCache,
    );
    return ok({ id, trashed });
  } catch (error) {
    return toFailure(error);
  }
}

/** Grants a short-lived PUT URL; the browser uploads the .zip straight to R2 private. */
export async function prepareStoreZipUploadAction(
  input: unknown,
): Promise<ActionResult<{ key: string; uploadUrl: string }>> {
  try {
    const value = storeZipUploadInputSchema.parse(input);
    const principal = await requireAdmin();
    authorize(principal, "digital-products", "update");
    return ok(
      await storePackageStorage().createUploadUrl(value.productId, value.filename),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Confirms size + ZIP magic bytes, then records the private file and links it. */
export async function finalizeStoreZipUploadAction(
  input: unknown,
): Promise<ActionResult<{ fileId: string; filename: string }>> {
  try {
    const value = storeZipFinalizeInputSchema.parse(input);
    const principal = await requireAdmin();
    const meta = await storePackageStorage().verifyUploadedZip(value.key);
    const fileId = await attachProductZipFile(
      createStoreStore(getDb()),
      principal,
      value.productId,
      {
        key: meta.key,
        filename: meta.filename || value.filename,
        mimeType: "application/zip",
        sizeBytes: meta.sizeBytes,
      },
      invalidateStoreCache,
    );
    return ok({ fileId, filename: meta.filename || value.filename });
  } catch (error) {
    return toFailure(error);
  }
}

// ---------------------------------------------------------------------------
// Orders & licences (Owner only; the service enforces the role)
// ---------------------------------------------------------------------------

export async function listDigitalOrdersAction(
  input: unknown,
): Promise<ActionResult<DigitalOrderAdminRecord[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminDigitalOrders(createStoreStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

const activationInputSchema = z
  .object({
    id: idSchema,
    maxDownloads: z.number().int().min(0).max(100).optional(),
    validDays: z.number().int().min(1).max(365).optional(),
  })
  .strict();

export async function activateOrderLicenseAction(
  input: unknown,
): Promise<
  ActionResult<{
    orderCode: string;
    rawPin: string;
    whatsappDeliveryUrl: string | null;
  }>
> {
  try {
    const { id, ...options } = activationInputSchema.parse(input);
    const principal = await requireAdmin();
    return ok(
      await activateOrderLicense(
        createStoreStore(getDb()),
        principal,
        id,
        options,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function regenerateOrderPinAction(
  input: unknown,
): Promise<
  ActionResult<{
    orderCode: string;
    rawPin: string;
    whatsappDeliveryUrl: string | null;
  }>
> {
  try {
    const { id } = z.object({ id: idSchema }).strict().parse(input);
    const principal = await requireAdmin();
    return ok(
      await regenerateOrderPin(
        createStoreStore(getDb()),
        principal,
        id,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function addOrderDownloadQuotaAction(
  input: unknown,
): Promise<ActionResult<{ orderId: string; maxDownloads: number }>> {
  try {
    const { id, additionalQuota } = z
      .object({
        id: idSchema,
        additionalQuota: z.number().int().min(1).max(100).optional(),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(
      await addOrderDownloadQuota(
        createStoreStore(getDb()),
        principal,
        id,
        additionalQuota ?? 3,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function setOrderRevokedAction(
  input: unknown,
): Promise<ActionResult<{ orderId: string; isRevoked: boolean }>> {
  try {
    const { id, revoked, reason } = z
      .object({
        id: idSchema,
        revoked: z.boolean(),
        reason: z.string().trim().max(500).optional(),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(
      await setOrderRevoked(
        createStoreStore(getDb()),
        principal,
        id,
        revoked,
        reason,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Short-lived signed PUT so Admin can upload a product showcase video. */
export async function prepareStoreVideoUploadAction(
  input: unknown,
): Promise<ActionResult<{ key: string; uploadUrl: string }>> {
  try {
    const value = storeVideoUploadInputSchema.parse(input);
    authorize(await requireAdmin(), "digital-products", "update");
    return ok(
      await storeMediaStorage().createProductVideoUploadUrl(
        value.productId,
        value.filename,
        value.mimeType,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function finalizeStoreVideoUploadAction(
  input: unknown,
): Promise<ActionResult<{ url: string }>> {
  try {
    const value = storeVideoFinalizeInputSchema.parse(input);
    const principal = await requireAdmin();
    authorize(principal, "digital-products", "update");
    if (!value.key.startsWith(`store-videos/${value.productId}/`)) {
      throw new Error("Kunci video tidak sesuai produk.");
    }
    const meta = await storeMediaStorage().verifyUploadedProductVideo(
      value.key,
    );
    await attachProductVideo(
      createStoreStore(getDb()),
      principal,
      value.productId,
      { key: meta.key, url: meta.url },
      invalidateStoreCache,
    );
    return ok({ url: meta.url });
  } catch (error) {
    return toFailure(error);
  }
}

export async function listDigitalCouponsAction(): Promise<
  ActionResult<DigitalCouponRecord[]>
> {
  try {
    return ok(
      await listAdminDigitalCoupons(createStoreStore(getDb()), await requireAdmin()),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveDigitalCouponAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const request = (input ?? {}) as Record<string, unknown>;
    const id = idSchema.nullable().optional().parse(request.id ?? null);
    const rest: Record<string, unknown> = { ...request };
    delete rest.id;
    const principal = await requireAdmin();
    return ok({
      id: await saveDigitalCoupon(
        createStoreStore(getDb()),
        principal,
        id ?? null,
        rest,
        invalidateStoreCache,
      ),
    });
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteDigitalCouponAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id } = z.object({ id: idSchema }).strict().parse(input);
    await deleteDigitalCoupon(
      createStoreStore(getDb()),
      await requireAdmin(),
      id,
      invalidateStoreCache,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function listStoreReviewsAction(): Promise<
  ActionResult<StoreReviewAdminRecord[]>
> {
  try {
    return ok(
      await listAdminStoreReviews(createStoreStore(getDb()), await requireAdmin()),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function moderateStoreReviewAction(
  input: unknown,
): Promise<ActionResult<StoreReviewAdminRecord>> {
  try {
    return ok(
      await moderateStoreReview(
        createStoreStore(getDb()),
        await requireAdmin(),
        input,
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Five-minute signed link so Admin can view a buyer's transfer proof. */
export async function getOrderPaymentProofUrlAction(
  input: unknown,
): Promise<ActionResult<{ url: string }>> {
  try {
    const { id } = z.object({ id: idSchema }).strict().parse(input);
    return ok(
      await getOrderPaymentProofUrl(
        createStoreStore(getDb()),
        await requireAdmin(),
        id,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}
