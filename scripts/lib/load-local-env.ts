import { loadEnvConfig } from "@next/env";
import { OperatorInputError } from "./operator-error";

/** Use Next.js env precedence and expansion without logging file contents. */
export function loadLocalEnv(directory = process.cwd()): void {
  let failed = false;
  loadEnvConfig(directory, process.env.NODE_ENV !== "production", {
    info() {},
    error() {
      failed = true;
    },
  });
  if (failed)
    throw new OperatorInputError(
      "Konfigurasi environment gagal dibaca. Periksa izin file dan referensi variabel .env* tanpa membagikan nilainya.",
    );
}
