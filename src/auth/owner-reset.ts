import "server-only";
import { z } from "zod";

const inputSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    password: z.string().min(12).max(128),
  })
  .strict();

export interface OwnerResetTransaction {
  /** Only an active `owner` profile may be reset through this path. */
  findOwner(
    email: string,
  ): Promise<{ profileId: string; userId: string } | null>;
  replacePassword(input: {
    userId: string;
    passwordHash: string;
    now: Date;
  }): Promise<boolean>;
  disableTwoFactor(userId: string): Promise<void>;
  revokeSessions(userId: string): Promise<void>;
  audit(input: {
    profileId: string;
    userId: string;
    email: string;
    now: Date;
  }): Promise<void>;
}
export interface OwnerResetStore {
  transaction<T>(
    callback: (tx: OwnerResetTransaction) => Promise<T>,
  ): Promise<T>;
}

export class OwnerResetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OwnerResetError";
  }
}

/**
 * Break-glass recovery for the single owner account: sets a new password, turns
 * 2FA off so the next login can enrol a fresh authenticator, and revokes every
 * session. Runs only from the audited CLI, never from HTTP.
 */
export async function resetOwnerCredentials(
  store: OwnerResetStore,
  input: unknown,
  hashPassword: (password: string) => Promise<string>,
): Promise<{ profileId: string }> {
  const parsed = inputSchema.parse(input);
  const passwordHash = await hashPassword(parsed.password);
  const now = new Date();
  if (!Number.isFinite(now.getTime())) throw new OwnerResetError("Jam tidak valid.");

  return store.transaction(async (tx) => {
    const owner = await tx.findOwner(parsed.email);
    if (!owner)
      throw new OwnerResetError(
        "Owner aktif dengan email tersebut tidak ditemukan.",
      );
    const replaced = await tx.replacePassword({
      userId: owner.userId,
      passwordHash,
      now,
    });
    if (!replaced)
      throw new OwnerResetError("Akun kredensial owner tidak ditemukan.");
    await tx.disableTwoFactor(owner.userId);
    await tx.revokeSessions(owner.userId);
    await tx.audit({
      profileId: owner.profileId,
      userId: owner.userId,
      email: parsed.email,
      now,
    });
    return { profileId: owner.profileId };
  });
}
