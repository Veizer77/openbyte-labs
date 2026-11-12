import "server-only";
import { ZodError } from "zod";
import { AccessDeniedError } from "@/access/rules";
import { BookingSubmissionError } from "@/services/create-booking";
import { InquirySubmissionError } from "@/services/create-inquiry";
import { QuoteSubmissionError } from "@/services/create-quote";
import { MediaServiceError } from "@/services/media-errors";
import { SettingsCacheInvalidationError } from "@/services/site-settings";
import { InvoiceError } from "@/lib/invoices/errors";
import { StoreLicenseError } from "@/lib/store/errors";

export type ActionErrorCode =
  | "input_tidak_valid"
  | "akses_ditolak"
  | "anti_spam"
  | "rate_limit"
  | "slot_unavailable"
  | "mode_unavailable"
  | "package_unavailable"
  | "selection_invalid"
  | "range_exceeded"
  | "reference_exhausted"
  | "cache_gagal"
  | "media_invalid"
  | "media_not_found"
  | "media_unavailable"
  | "gagal";

export type ActionFailure = {
  ok: false;
  code: ActionErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ActionResult<T> = { ok: true; data: T } | ActionFailure;

const genericMessage = "Permintaan tidak dapat diproses. Coba lagi.";

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(
  code: ActionErrorCode,
  message: string,
  fieldErrors?: Record<string, string>,
): ActionFailure {
  return {
    ok: false,
    code,
    message,
    ...(fieldErrors && Object.keys(fieldErrors).length > 0
      ? { fieldErrors }
      : {}),
  };
}

/**
 * Converts thrown domain errors into a stable, non-leaking result. Unknown
 * errors are logged server-side and reported generically so database messages
 * and stack traces never reach the browser.
 */
export function toFailure(error: unknown): ActionFailure {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return fail(
      "input_tidak_valid",
      error.issues[0]?.message ?? "Data yang dikirim tidak valid.",
      fieldErrors,
    );
  }
  if (error instanceof AccessDeniedError) {
    return fail("akses_ditolak", "Akses ditolak.");
  }
  if (error instanceof BookingSubmissionError) {
    return fail(error.code, error.message);
  }
  if (error instanceof InquirySubmissionError) {
    return fail(error.code, error.message);
  }
  if (error instanceof QuoteSubmissionError) {
    return fail(error.code, error.message);
  }
  if (error instanceof SettingsCacheInvalidationError) {
    return fail("cache_gagal", error.message);
  }
  if (error instanceof InvoiceError) {
    return fail("input_tidak_valid", error.message);
  }
  if (error instanceof StoreLicenseError) {
    return fail(error.code, error.message);
  }
  if (error instanceof MediaServiceError) {
    return fail(error.code, error.message);
  }
  console.error("[action] unhandled error", error);
  return fail("gagal", genericMessage);
}
