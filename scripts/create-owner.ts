import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { bootstrapInitialOwner } from "@/auth/owner-bootstrap";
import { createDatabase } from "@/db/connection";
import { createOwnerBootstrapStore } from "@/db/owner-bootstrap-store";
import { confirmTarget } from "./lib/confirm-target";
import { loadLocalEnv } from "./lib/load-local-env";
import { OperatorInputError, ownerBootstrapFailure } from "./lib/operator-error";
import { readSecret } from "./lib/read-secret";

async function main(): Promise<void> {
  loadLocalEnv();
  const target = await confirmTarget("owner", {
    label: "Bootstrap owner",
    keyword: "CREATE-OWNER",
    expectedSource: "direct",
  });
  if (!stdin.isTTY || !stdout.isTTY)
    throw new OperatorInputError(
      "Bootstrap owner memerlukan terminal interaktif untuk nama, email, dan password tersembunyi. Jalankan pnpm owner:create di PowerShell lokal.",
    );
  if (process.env.TEST_DATABASE_URL)
    stdout.write("TEST_DATABASE_URL diabaikan; bootstrap hanya memakai koneksi direct yang disetujui.\n");
  const terminal = createInterface({ input: stdin, output: stdout });
  let name: string;
  let email: string;
  try {
    name = await terminal.question("Nama owner: ");
    email = await terminal.question("Email owner: ");
  } finally {
    terminal.close();
  }
  let password = await readSecret("Kata sandi owner: ");
  let confirmation = await readSecret("Ulangi kata sandi: ");
  if (password !== confirmation)
    throw new OperatorInputError("Konfirmasi kata sandi tidak cocok.");
  confirmation = "";
  const connection = createDatabase(target.uri);
  try {
    await bootstrapInitialOwner(createOwnerBootstrapStore(connection.db), {
      name,
      email,
      password,
    });
    stdout.write(
      "Owner dibuat. Setup TOTP masih harus diselesaikan sebelum admin dibuka.\n",
    );
  } finally {
    password = "";
    await connection.close();
  }
}

main().catch((error: unknown) => {
  // Database errors may include connection details, so avoid echoing raw errors.
  process.stderr.write(
    `${ownerBootstrapFailure(error)}\n`,
  );
  process.exitCode = 1;
});
