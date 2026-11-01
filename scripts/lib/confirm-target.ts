import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";
import { hasOperatorConfirmation } from "./operator-confirmation";
import { OperatorInputError } from "./operator-error";
import {
  selectDatabaseTarget,
  type TargetRole,
} from "@/db/target-selection";

export interface ConfirmedTarget {
  uri: string;
  host: string;
  database: string;
  source: "test" | "direct";
}

/**
 * Prints only host/database, never credentials, and requires the operator to retype
 * the database name. Destructive commands additionally require an exact keyword.
 */
export async function confirmTarget(
  role: TargetRole,
  options: {
    keyword?: string;
    label: string;
    expectedSource?: ConfirmedTarget["source"];
    expectedHostname?: string;
    expectedDatabase?: string;
  },
): Promise<ConfirmedTarget> {
  const selected = selectDatabaseTarget(process.env, role);
  if (!selected.uri)
    throw new OperatorInputError(
      "Koneksi database belum diatur. Isi DATABASE_URI_DIRECT (atau DATABASE_DIRECT_URL) pada environment lokal.",
    );
  if (!selected.approvedTarget)
    throw new OperatorInputError(
      role === "owner"
        ? "OWNER_BOOTSTRAP_TARGET belum diatur. Isi host/nama_database yang disetujui."
        : "Konfirmasi target database belum diatur pada environment lokal.",
    );
  let target: { host: string; database: string };
  try {
    target = validateBootstrapTarget(selected.uri, selected.approvedTarget);
  } catch {
    throw new OperatorInputError(
      "URL database tidak valid atau tidak cocok dengan target yang dikonfirmasi. Periksa host/nama_database pada konfigurasi lokal.",
    );
  }
  if (options.expectedSource && selected.source !== options.expectedSource)
    throw new OperatorInputError(`${options.label} memerlukan koneksi ${options.expectedSource}.`);
  if (
    options.expectedHostname &&
    new URL(selected.uri).hostname.toLowerCase() !==
      options.expectedHostname.toLowerCase()
  )
    throw new OperatorInputError(
      `${options.label} hanya diizinkan pada host yang disetujui.`,
    );
  if (
    options.expectedDatabase &&
    target.database !== options.expectedDatabase
  )
    throw new OperatorInputError(
      `${options.label} hanya diizinkan pada database ${options.expectedDatabase}.`,
    );
  if (!stdin.isTTY || !stdout.isTTY) {
    if (!hasOperatorConfirmation(process.argv, target.database, options.keyword))
      throw new OperatorInputError(
        "Jalankan perintah dari terminal interaktif atau berikan konfirmasi target yang diwajibkan. Input password tetap harus melalui terminal interaktif.",
      );
    return {
      uri: selected.uri,
      host: target.host,
      database: target.database,
      source: selected.source,
    };
  }

  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    stdout.write(
      `${options.label} (${selected.source}): ${target.host}/${target.database}\n`,
    );
    const confirmation = await terminal.question(
      "Ketik nama database untuk mengonfirmasi target: ",
    );
    if (confirmation !== target.database)
      throw new OperatorInputError("Konfirmasi target tidak cocok.");
    if (options.keyword) {
      const answer = await terminal.question(
        `Ketik ${options.keyword} untuk melanjutkan: `,
      );
      if (answer !== options.keyword)
        throw new OperatorInputError(`${options.label} dibatalkan.`);
    }
  } finally {
    terminal.close();
  }
  return {
    uri: selected.uri,
    host: target.host,
    database: target.database,
    source: selected.source,
  };
}
