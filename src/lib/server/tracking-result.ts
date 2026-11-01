import "server-only";
import { ZodError } from "zod";
import { AccessDeniedError } from "@/access/rules";
import { TrackingError } from "@/lib/tracking/errors";
import { InvoiceError } from "@/lib/invoices/errors";
import { fail, toFailure, type ActionFailure } from "@/actions/result";

/** Database/SDK exceptions can contain bound hashes, session tokens and client data. */
export function trackingFailure(
  error: unknown,
  code:
    | "input_tidak_valid"
    | "akses_ditolak"
    | "media_invalid" = "input_tidak_valid",
): ActionFailure {
  if (error instanceof TrackingError) return fail(code, error.message);
  if (error instanceof InvoiceError)
    return fail("input_tidak_valid", error.message);
  if (error instanceof ZodError || error instanceof AccessDeniedError)
    return toFailure(error);
  console.error("[tracking] server operation failed");
  return fail("gagal", "Permintaan tidak dapat diproses. Coba lagi.");
}
