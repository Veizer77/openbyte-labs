import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { hashPassword } from "better-auth/crypto";
import { OwnerResetError, resetOwnerCredentials } from "@/auth/owner-reset";
import { createDatabase } from "@/db/connection";
import { createOwnerResetStore } from "@/db/owner-reset-store";
import { confirmTarget } from "./lib/confirm-target";
import { loadLocalEnv } from "./lib/load-local-env";
import { readSecret } from "./lib/read-secret";

loadLocalEnv();

async function main(): Promise<void> {
  const target = await confirmTarget("owner", {
    label: "Reset owner",
    keyword: "RESET",
  });
  const terminal = createInterface({ input: stdin, output: stdout });
  let email: string;
  try {
    email = (await terminal.question("Email owner: ")).trim();
  } finally {
    terminal.close();
  }

  let password = await readSecret("Kata sandi baru: ");
  let confirmation = await readSecret("Ulangi kata sandi baru: ");
  if (password !== confirmation)
    throw new OwnerResetError("Konfirmasi kata sandi tidak cocok.");
  confirmation = "";

  const connection = createDatabase(target.uri);
  try {
    await resetOwnerCredentials(
      createOwnerResetStore(connection.db),
      { email, password },
      hashPassword,
    );
    stdout.write(
      "Kredensial owner direset. 2FA dimatikan dan semua sesi dicabut.\n" +
        "Login berikutnya harus menyelesaikan pendaftaran TOTP sebelum dashboard dapat dipakai.\n",
    );
  } finally {
    password = "";
    await connection.close();
  }
}

main().catch((error: unknown) => {
  if (error instanceof OwnerResetError) {
    process.stderr.write(`${error.message}\n`);
  } else {
    // Database errors may contain connection details; never echo them raw.
    process.stderr.write(
      "Reset gagal atau dibatalkan. Periksa target dan input tanpa membagikan kredensial.\n",
    );
  }
  process.exitCode = 1;
});
