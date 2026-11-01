import { ZodError } from "zod";

/** Only explicitly constructed operator messages may be shown by the CLI. */
export class OperatorInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperatorInputError";
  }
}

export function ownerBootstrapFailure(error: unknown): string {
  if (error instanceof ZodError)
    return "Data owner tidak valid. Nama wajib diisi (maksimal 100 karakter), email harus valid, dan password harus 12–128 karakter. Tidak ada nilai input yang ditampilkan.";
  return error instanceof OperatorInputError
    ? error.message
    : "Bootstrap gagal saat mengakses database atau menyimpan akun. Periksa koneksi, migrasi, dan status owner; jangan membagikan kredensial atau mengulang jika akun mungkin sudah terbentuk.";
}
