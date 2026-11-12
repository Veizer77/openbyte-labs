export type StoreErrorCode =
  | "input_tidak_valid"
  | "akses_ditolak"
  | "anti_spam"
  | "rate_limit"
  | "gagal";

/** Carries a safe, human-readable licence-gate message to the browser. */
export class StoreLicenseError extends Error {
  readonly code: StoreErrorCode;

  constructor(message: string, code: StoreErrorCode = "akses_ditolak") {
    super(message);
    this.name = "StoreLicenseError";
    this.code = code;
  }
}
