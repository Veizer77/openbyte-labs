import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";

const ownerInput = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    password: z.string().min(12).max(128),
  })
  .strict();

export interface OwnerBootstrapTransaction {
  claimBootstrap(): Promise<boolean>;
  hasOwner(): Promise<boolean>;
  insertOwner(input: {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    now: Date;
  }): Promise<string>;
  audit(profileId: string): Promise<void>;
}
export interface OwnerBootstrapStore {
  transaction<T>(
    callback: (tx: OwnerBootstrapTransaction) => Promise<T>,
  ): Promise<T>;
}

/** Bootstrap only; recovery and additional admin creation need separately authorized flows. */
export async function bootstrapInitialOwner(
  store: OwnerBootstrapStore,
  input: unknown,
): Promise<string> {
  const parsed = ownerInput.parse(input);
  const passwordHash = await hashPassword(parsed.password);
  const userId = randomUUID();
  const now = new Date();
  return store.transaction(async (tx) => {
    if (!(await tx.claimBootstrap()) || (await tx.hasOwner()))
      throw new Error("Bootstrap owner sudah dilakukan atau owner sudah ada.");
    const profileId = await tx.insertOwner({
      userId,
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      now,
    });
    await tx.audit(profileId);
    return profileId;
  });
}
