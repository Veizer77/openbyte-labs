import { stdout } from "node:process";
import postgres from "postgres";
import { symmetricDecrypt } from "better-auth/crypto";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";
import { hasOperatorConfirmation } from "./lib/operator-confirmation";
import { OperatorInputError } from "./lib/operator-error";
import { loadLocalEnv } from "./lib/load-local-env";

/**
 * Copies the admin identity from the development database to production.
 *
 * Only identity rows move: auth_user, auth_account, auth_two_factor and
 * admin_profiles. Sessions, audit history and rate limits stay behind, because
 * they belong to a different environment.
 *
 * The TOTP secret is stored encrypted with BETTER_AUTH_SECRET. Copying it into a
 * deployment that uses a different secret would produce an account that can
 * never pass the second factor, so the script decrypts the secret with the
 * destination secret before writing anything and aborts when that fails.
 */

const CONFIRM_KEYWORD = "COPY-OWNER";

async function main(): Promise<void> {
  loadLocalEnv();
  const dryRun = process.argv.includes("--dry-run");

  const sourceUri = process.env.OWNER_COPY_SOURCE_URI ?? "";
  const destinationUri = process.env.OWNER_COPY_DEST_URI ?? "";
  const destinationSecret = process.env.BETTER_AUTH_SECRET ?? "";
  if (!sourceUri || !destinationUri)
    throw new OperatorInputError(
      "OWNER_COPY_SOURCE_URI dan OWNER_COPY_DEST_URI wajib diisi.",
    );
  if (destinationSecret.length < 32)
    throw new OperatorInputError(
      "BETTER_AUTH_SECRET tujuan minimal 32 karakter agar TOTP bisa diverifikasi.",
    );

  const source = validateBootstrapTarget(
    sourceUri,
    process.env.OWNER_COPY_SOURCE_TARGET ?? "",
  );
  const destination = validateBootstrapTarget(
    destinationUri,
    process.env.OWNER_COPY_DEST_TARGET ?? "",
  );
  if (source.database === destination.database)
    throw new OperatorInputError("Sumber dan tujuan tidak boleh database sama.");
  if (!hasOperatorConfirmation(process.argv, destination.database, CONFIRM_KEYWORD))
    throw new OperatorInputError(
      `Konfirmasi target wajib: --confirm-target=${destination.database} --confirm-keyword=${CONFIRM_KEYWORD}.`,
    );

  stdout.write(
    `Sumber ${source.host}/${source.database} -> tujuan ${destination.host}/${destination.database}${dryRun ? " (dry-run)" : ""}\n`,
  );

  const reader = postgres(sourceUri, { max: 1, prepare: false, connect_timeout: 10 });
  const writer = postgres(destinationUri, { max: 1, prepare: false, connect_timeout: 10 });

  try {
    const users = await reader<
      { id: string; name: string; email: string; email_verified: boolean; image: string | null; created_at: Date; updated_at: Date; two_factor_enabled: boolean }[]
    >`SELECT id, name, email, email_verified, image, created_at, updated_at, two_factor_enabled FROM auth_user ORDER BY created_at`;

    const accounts = await reader<
      { id: string; account_id: string; provider_id: string; user_id: string; password: string | null; created_at: Date; updated_at: Date }[]
    >`SELECT id, account_id, provider_id, user_id, password, created_at, updated_at FROM auth_account WHERE provider_id = 'credential'`;

    const factors = await reader<
      { id: string; secret: string; backup_codes: string; user_id: string; verified: boolean; failed_verification_count: number }[]
    >`SELECT id, secret, backup_codes, user_id, verified, failed_verification_count FROM auth_two_factor`;

    const profiles = await reader<
      { id: string; auth_user_id: string; role: string; is_active: boolean }[]
    >`SELECT id, auth_user_id, role, is_active FROM admin_profiles`;

    const [existing] = await writer<{ users: string; profiles: string }[]>`
      SELECT (SELECT count(*)::text FROM auth_user) AS users,
             (SELECT count(*)::text FROM admin_profiles) AS profiles
    `;
    stdout.write(
      `Tujuan sebelum copy: auth_user=${existing.users} admin_profiles=${existing.profiles}\n`,
    );
    if (Number(existing.users) > 0 || Number(existing.profiles) > 0)
      throw new OperatorInputError(
        "Tujuan sudah memiliki akun admin. Copy dibatalkan agar akun yang ada tidak tertimpa.",
      );

    if (users.length !== 1 || profiles.length !== 1 || factors.length !== 1 || accounts.length !== 1)
      throw new OperatorInputError(
        `Sumber harus berisi tepat 1 user, 1 profil, 1 faktor TOTP, dan 1 akun credential (ditemukan ${users.length}/${profiles.length}/${factors.length}/${accounts.length}).`,
      );

    // Prove the TOTP secret is readable with the destination secret.
    const factor = factors[0];
    try {
      const plain = await symmetricDecrypt({ key: destinationSecret, data: factor.secret });
      if (plain.length !== 32)
        throw new Error("panjang secret tidak wajar");
      stdout.write("Verifikasi TOTP: secret dapat didekripsi dengan BETTER_AUTH_SECRET tujuan.\n");
    } catch {
      throw new OperatorInputError(
        "BETTER_AUTH_SECRET tujuan tidak dapat mendekripsi secret TOTP sumber. Copy dibatalkan: akun akan terkunci di halaman verifikasi. Samakan secret terlebih dahulu.",
      );
    }

    if (dryRun) {
      stdout.write("Dry-run: tidak ada perubahan ditulis.\n");
      return;
    }

    const user = users[0];
    const account = accounts[0];
    const profile = profiles[0];

    await writer.begin(async (tx) => {
      await tx`
        INSERT INTO auth_user (id, name, email, email_verified, image, created_at, updated_at, two_factor_enabled)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.email_verified}, ${user.image},
                ${user.created_at}, ${user.updated_at}, ${user.two_factor_enabled})
      `;
      await tx`
        INSERT INTO auth_account (id, account_id, provider_id, user_id, password, created_at, updated_at)
        VALUES (${account.id}, ${account.account_id}, ${account.provider_id}, ${account.user_id},
                ${account.password}, ${account.created_at}, ${account.updated_at})
      `;
      await tx`
        INSERT INTO auth_two_factor (id, secret, backup_codes, user_id, verified, failed_verification_count)
        VALUES (${factor.id}, ${factor.secret}, ${factor.backup_codes}, ${factor.user_id},
                ${factor.verified}, ${factor.failed_verification_count})
      `;
      await tx`
        INSERT INTO admin_profiles (id, auth_user_id, role, is_active)
        VALUES (${profile.id}, ${profile.auth_user_id}, ${profile.role}, ${profile.is_active})
      `;
    });

    const [after] = await writer<{ users: string; profiles: string; factors: string; accounts: string }[]>`
      SELECT (SELECT count(*)::text FROM auth_user) AS users,
             (SELECT count(*)::text FROM admin_profiles) AS profiles,
             (SELECT count(*)::text FROM auth_two_factor) AS factors,
             (SELECT count(*)::text FROM auth_account) AS accounts
    `;
    stdout.write(
      `Tujuan sesudah copy: auth_user=${after.users} admin_profiles=${after.profiles} auth_two_factor=${after.factors} auth_account=${after.accounts}\n`,
    );
    stdout.write("Copy identitas admin selesai. Login memakai email dan TOTP yang sudah ada.\n");
  } finally {
    await reader.end({ timeout: 5 });
    await writer.end({ timeout: 5 });
  }
}

main().catch((error) => {
  if (error instanceof OperatorInputError) process.stderr.write(`${error.message}\n`);
  else
    process.stderr.write(
      "Copy identitas admin gagal. Periksa target dan konfigurasi tanpa membagikan kredensial.\n",
    );
  process.exitCode = 1;
});
