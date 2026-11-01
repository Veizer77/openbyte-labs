import "server-only";
import { createHmac } from "node:crypto";
import { z } from "zod";

const credentialsSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();

export interface AdminLoginTransaction {
  isLocked(): Promise<boolean>;
  pruneFailures(): Promise<void>;
  countFailures(): Promise<number>;
  recordFailure(): Promise<void>;
  lock(): Promise<void>;
}
export interface AdminLoginStore {
  /** Must serialize verification for the same key and use a different pool from Better Auth. */
  transaction<T>(
    keyHash: string,
    callback: (tx: AdminLoginTransaction) => Promise<T>,
  ): Promise<T>;
}
export interface AdminLoginResult {
  headers: Headers;
  requiresTwoFactor: boolean;
}
export class AdminLoginDeniedError extends Error {
  constructor() {
    super("Login tidak berhasil. Periksa kredensial atau coba lagi nanti.");
    this.name = "AdminLoginDeniedError";
  }
}

export async function signInAdmin(
  store: AdminLoginStore,
  input: unknown,
  secret: string,
  verifyCredentials: (
    email: string,
    password: string,
  ) => Promise<AdminLoginResult>,
): Promise<AdminLoginResult> {
  const { email, password } = credentialsSchema.parse(input);
  if (secret.length < 32)
    throw new Error("Secret hash login harus minimal 32 karakter.");
  const keyHash = createHmac("sha256", secret)
    .update(`admin-login:v1:${email}`, "utf8")
    .digest("hex");
  const result = await store.transaction(keyHash, async (tx) => {
    if (await tx.isLocked()) return { ok: false as const };
    await tx.pruneFailures();
    const failures = await tx.countFailures();
    if (failures >= 5) {
      await tx.lock();
      return { ok: false as const };
    }
    try {
      return {
        ok: true as const,
        value: await verifyCredentials(email, password),
      };
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("statusCode" in error) ||
        error.statusCode !== 401
      )
        throw error;
      await tx.recordFailure();
      if (failures + 1 >= 5) await tx.lock();
      return { ok: false as const };
    }
  });
  if (!result.ok) throw new AdminLoginDeniedError();
  return result.value;
}
