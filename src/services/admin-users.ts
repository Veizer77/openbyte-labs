import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  adminUserCreateInputSchema,
  adminUserListOptionsSchema,
  adminUserRecordSchema,
  adminUserUpdateInputSchema,
  type AdminUserCreateInput,
  type AdminUserListOptions,
  type AdminUserRecord,
  type AdminUserUpdateInput,
} from "@/schemas/admin-users";

export interface AdminUserStore {
  list(options: AdminUserListOptions): Promise<unknown[]>;
  transaction<T>(callback: (tx: {
    lockUsers(): Promise<void>;
    emailTaken(email: string, exceptAuthUserId?: string): Promise<boolean>;
    activeOwnerCount(): Promise<number>;
    create(input: AdminUserCreateInput & { userId: string; passwordHash: string; now: Date }): Promise<string>;
    read(id: string): Promise<{ authUserId: string; role: "owner" | "editor"; isActive: boolean } | null>;
    update(id: string, authUserId: string, input: AdminUserUpdateInput): Promise<boolean>;
    audit(actorId: string, action: "create" | "update", id: string): Promise<void>;
  }) => Promise<T>): Promise<T>;
}

function isDuplicateEmail(error: unknown): boolean {
  let current = error;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const value = current as { code?: unknown; constraint?: unknown; constraint_name?: unknown; cause?: unknown };
    const constraint = value.constraint ?? value.constraint_name;
    if (value.code === "23505" && typeof constraint === "string" && constraint.includes("auth_user_email")) return true;
    current = value.cause;
  }
  return false;
}

export async function listAdminUsers(
  store: AdminUserStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<AdminUserRecord[]> {
  authorize(principal, "users", "read");
  return z.array(adminUserRecordSchema).parse(await store.list(adminUserListOptionsSchema.parse(input)));
}

export async function createAdminUser(
  store: AdminUserStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<string> {
  authorize(principal, "users", "create");
  const value = adminUserCreateInputSchema.parse(input);
  const passwordHash = await hashPassword(value.password);
  const userId = randomUUID();
  const now = new Date();
  try {
    return await store.transaction(async (tx) => {
      await tx.lockUsers();
      if (await tx.emailTaken(value.email)) throw new Error("Email admin sudah digunakan.");
      const id = await tx.create({ ...value, userId, passwordHash, now });
      await tx.audit(principal.id, "create", id);
      return id;
    });
  } catch (error) {
    if (isDuplicateEmail(error)) throw new Error("Email admin sudah digunakan.");
    throw error;
  }
}

export async function updateAdminUser(
  store: AdminUserStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<void> {
  authorize(principal, "users", "update");
  z.string().min(1).max(100).parse(id);
  const value = adminUserUpdateInputSchema.parse(input);
  await store.transaction(async (tx) => {
    await tx.lockUsers();
    const current = await tx.read(id);
    if (!current) throw new Error("Pengguna admin tidak ditemukan.");
    if (id === principal.id && (value.role !== current.role || value.isActive !== current.isActive))
      throw new Error("Anda tidak dapat mengubah peran atau menonaktifkan akun sendiri.");
    if (await tx.emailTaken(value.email, current.authUserId))
      throw new Error("Email admin sudah digunakan.");
    if (
      current.role === "owner" && current.isActive &&
      (value.role !== "owner" || !value.isActive) &&
      await tx.activeOwnerCount() <= 1
    ) throw new Error("Owner aktif terakhir tidak dapat dinonaktifkan atau diturunkan perannya.");
    if (!(await tx.update(id, current.authUserId, value)))
      throw new Error("Pengguna admin tidak ditemukan.");
    await tx.audit(principal.id, "update", id);
  });
}
