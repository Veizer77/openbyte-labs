/**
 * Kesalahan media terstruktur (F0-13).
 *
 * Kontrak error ini dipakai ulang oleh F0-14 (signed upload/finalisasi) dan
 * route handler media. Pesan berbahasa Indonesia, tanpa detail internal
 * (path, stack, isi byte) yang bisa membocorkan informasi server.
 */

export type MediaErrorCode =
  | 'EMPTY_FILE'
  | 'TOO_LARGE'
  | 'UNSUPPORTED_TYPE'
  | 'SVG_REJECTED'
  | 'TYPE_MISMATCH'
  | 'DECODE_FAILED'
  | 'DIMENSION_TOO_SMALL'
  | 'DIMENSION_TOO_LARGE'
  | 'UNSAFE_FILENAME'
  | 'INVALID_MEDIA_ID'
  | 'VARIANT_FAILED'

const STATUS_BY_CODE: Record<MediaErrorCode, number> = {
  EMPTY_FILE: 400,
  TOO_LARGE: 413,
  UNSUPPORTED_TYPE: 415,
  SVG_REJECTED: 415,
  TYPE_MISMATCH: 415,
  DECODE_FAILED: 422,
  DIMENSION_TOO_SMALL: 422,
  DIMENSION_TOO_LARGE: 422,
  UNSAFE_FILENAME: 400,
  INVALID_MEDIA_ID: 400,
  VARIANT_FAILED: 500,
}

export class MediaValidationError extends Error {
  readonly code: MediaErrorCode
  /** Saran status HTTP; keputusan akhir tetap di route/service pemanggil. */
  readonly status: number

  constructor(code: MediaErrorCode, message: string) {
    super(message)
    this.name = 'MediaValidationError'
    this.code = code
    this.status = STATUS_BY_CODE[code]
  }
}

export function isMediaValidationError(value: unknown): value is MediaValidationError {
  return value instanceof MediaValidationError
}
