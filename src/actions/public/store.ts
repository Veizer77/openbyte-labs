"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { createStoreStore } from "@/db/store-store";
import { getEnv } from "@/env";
import { rateLimit } from "@/lib/rate-limit";
import { storeMediaStorage } from "@/lib/server/r2-store-media";
import { StoreLicenseError } from "@/lib/store/errors";
import { verifyChallenge } from "@/security/challenge";
import { clientIpHash } from "@/security/client-ip";
import {
  storeLicenseVerifyInputSchema,
  storePaymentProofFinalizeInputSchema,
  storePaymentProofUploadInputSchema,
  storeReviewMediaUploadInputSchema,
  storeReviewMediaVerifyInputSchema,
  type StoreCouponPreviewResult,
  type StoreLicenseView,
  type StoreReviewPublic,
} from "@/schemas/store";
import {
  attachOrderPaymentProof,
  createPublicStoreOrder,
  previewStoreCoupon,
  submitVerifiedStoreReview,
  verifyAndConsumeStoreDownload,
} from "@/services/store";
import { invalidateStoreCache } from "@/services/store-cache";
import { ok, toFailure, type ActionResult } from "../result";

export type StoreOrderResult = {
  orderCode: string;
  whatsappUrl: string | null;
  amount: number;
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  couponCode: string | null;
  productTitle: string;
  licenseTier: "single" | "commercial";
};

const CHECKOUT_MAX_REQUESTS = 5;
const LICENSE_MAX_REQUESTS = 8;
const REVIEW_MAX_REQUESTS = 8;
const PROOF_MAX_REQUESTS = 10;

/** Per IP + order code so one leaked code cannot exhaust the whole IP budget. */
function licenseRateKey(ipHash: string, orderCode: string): string {
  return createHash("sha256").update(`${ipHash}:${orderCode}`).digest("hex");
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function submitStoreOrderAction(
  input: unknown,
): Promise<ActionResult<StoreOrderResult>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const request = (input ?? {}) as Record<string, unknown>;
    const honeypot = readString(request.honeypot);
    const token = readString(request.turnstileToken);
    if (
      !(await verifyChallenge(env, {
        token,
        honeypot,
        action: "store_checkout",
      }))
    ) {
      throw new StoreLicenseError(
        "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.",
        "anti_spam",
      );
    }
    if (!(await rateLimit(db, "store-checkout", ipHash, CHECKOUT_MAX_REQUESTS))) {
      throw new StoreLicenseError(
        "Terlalu banyak permintaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    const created = await createPublicStoreOrder(createStoreStore(db), input);
    return ok({
      orderCode: created.orderCode,
      whatsappUrl: created.whatsappUrl,
      amount: created.amount,
      baseAmount: created.baseAmount,
      setupFeeAmount: created.setupFeeAmount,
      discountAmount: created.discountAmount,
      couponCode: created.couponCode,
      productTitle: created.productTitle,
      licenseTier: created.licenseTier,
    });
  } catch (error) {
    return toFailure(error);
  }
}

/** `inspect` mode: verifies the licence and returns quota + certificate only. */
export async function verifyStoreLicenseAction(
  input: unknown,
): Promise<ActionResult<StoreLicenseView>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storeLicenseVerifyInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      LICENSE_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak percobaan verifikasi. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    return ok(
      await verifyAndConsumeStoreDownload(createStoreStore(db), {
        ...value,
        ipHash,
        mode: "inspect",
      }),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** `download` mode: consumes one quota and returns a 60-second presigned URL. */
export async function requestStoreDownloadUrlAction(
  input: unknown,
): Promise<ActionResult<StoreLicenseView>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storeLicenseVerifyInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      LICENSE_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak percobaan verifikasi. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    return ok(
      await verifyAndConsumeStoreDownload(createStoreStore(db), {
        ...value,
        ipHash,
        mode: "download",
      }),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Validates a coupon for the checkout box without creating an order. */
export async function previewStoreCouponAction(
  input: unknown,
): Promise<ActionResult<StoreCouponPreviewResult>> {
  try {
    return ok(await previewStoreCoupon(createStoreStore(getDb()), input));
  } catch (error) {
    return toFailure(error);
  }
}

/** Paid, non-revoked buyers submit a verified review with optional media. */
export async function submitStoreReviewAction(
  input: unknown,
): Promise<ActionResult<StoreReviewPublic>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const orderCode = readString((input as Record<string, unknown>)?.orderCode);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, orderCode),
      REVIEW_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak percobaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    return ok(await submitVerifiedStoreReview(createStoreStore(db), input));
  } catch (error) {
    return toFailure(error);
  }
}

/** Grants a public PUT URL for buyer review photos/short videos. */
export async function prepareReviewMediaUploadAction(
  input: unknown,
): Promise<ActionResult<{ key: string; uploadUrl: string }>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storeReviewMediaUploadInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      REVIEW_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak percobaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    return ok(
      await storeMediaStorage().createReviewMediaUploadUrl(
        value.orderCode,
        value.filename,
        value.mimeType,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function finalizeReviewMediaUploadAction(
  input: unknown,
): Promise<ActionResult<{ kind: "image" | "video"; url: string }>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storeReviewMediaVerifyInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      REVIEW_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak percobaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    if (!value.key.startsWith(`store-reviews/${value.orderCode}/`)) {
      throw new StoreLicenseError(
        "Kunci media ulasan tidak valid.",
        "input_tidak_valid",
      );
    }
    return ok(await storeMediaStorage().verifyUploadedReviewMedia(value.key));
  } catch (error) {
    return toFailure(error);
  }
}

/** Grants a private PUT URL for a transfer proof (never a public object). */
export async function preparePaymentProofUploadAction(
  input: unknown,
): Promise<ActionResult<{ key: string; uploadUrl: string }>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storePaymentProofUploadInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      PROOF_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak permintaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    return ok(
      await storeMediaStorage().createPaymentProofUploadUrl(
        value.orderCode,
        value.filename,
        value.mimeType,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function finalizePaymentProofUploadAction(
  input: unknown,
): Promise<ActionResult<{ orderCode: string; fileId: string }>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const value = storePaymentProofFinalizeInputSchema.parse(input);
    const allowed = await rateLimit(
      db,
      "store-license-verify",
      licenseRateKey(ipHash, value.orderCode),
      PROOF_MAX_REQUESTS,
    );
    if (!allowed) {
      throw new StoreLicenseError(
        "Terlalu banyak permintaan. Coba lagi beberapa menit.",
        "rate_limit",
      );
    }
    if (!value.key.startsWith(`store-proofs/${value.orderCode}/`)) {
      throw new StoreLicenseError(
        "Kunci bukti bayar tidak valid.",
        "input_tidak_valid",
      );
    }
    const meta = await storeMediaStorage().verifyUploadedPaymentProof(value.key);
    return ok(
      await attachOrderPaymentProof(
        createStoreStore(db),
        {
          orderCode: value.orderCode,
          buyerWhatsapp: value.buyerWhatsapp,
          buyerEmail: value.buyerEmail,
          file: meta,
        },
        invalidateStoreCache,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}
