import { describe, expect, it, vi } from "vitest";

vi.mock("better-auth/crypto", () => ({ hashPassword: vi.fn(async (value: string) => `hashed:${value}`) }));

import type { AdminPrincipal } from "@/access/rules";
import {
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
  type AdminUserStore,
} from "@/services/admin-users";

const owner: AdminPrincipal = { id: "owner-profile", role: "owner", twoFactorVerified: true };
const editor: AdminPrincipal = { id: "editor-profile", role: "editor", twoFactorVerified: true };
const userId = "user-auth-id";
const input = { name: "Editor Satu", email: "EDITOR@EXAMPLE.TEST", password: "a-long-integration-password", role: "editor" as const };

function setup() {
  const lockUsers = vi.fn().mockResolvedValue(undefined);
  const emailTaken = vi.fn().mockResolvedValue(false);
  const activeOwnerCount = vi.fn().mockResolvedValue(2);
  const create = vi.fn().mockResolvedValue("profile-new");
  const read = vi.fn().mockResolvedValue({ authUserId: userId, role: "editor" as const, isActive: true });
  const update = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ lockUsers, emailTaken, activeOwnerCount, create, read, update, audit }));
  const rows = [{ id: "profile-new", name: "Editor Satu", email: "editor@example.test", role: "editor", isActive: true, twoFactorEnabled: false, createdAt: new Date(), updatedAt: new Date() }];
  const list = vi.fn().mockResolvedValue(rows);
  return { store: { list, transaction } as AdminUserStore, list, rows, lockUsers, emailTaken, activeOwnerCount, create, read, update, audit, transaction };
}

describe("pengguna admin", () => {
  it("membatasi list/create/update ke owner dan menormalkan email saat create", async () => {
    const ctx = setup();
    await expect(listAdminUsers(ctx.store, editor, { limit: 20, offset: 0 })).rejects.toThrow("Akses ditolak");
    await expect(createAdminUser(ctx.store, editor, input)).rejects.toThrow("Akses ditolak");
    await expect(updateAdminUser(ctx.store, editor, "profile-new", { name: "x", email: "x@example.test", role: "editor", isActive: true })).rejects.toThrow("Akses ditolak");
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(createAdminUser(ctx.store, owner, input)).resolves.toBe("profile-new");
    expect(ctx.create).toHaveBeenCalledWith(expect.objectContaining({
      email: "editor@example.test",
      passwordHash: `hashed:${input.password}`,
      role: "editor",
      userId: expect.any(String),
    }));
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "create", "profile-new");
  });

  it("menolak email duplikat dan mempertahankan owner aktif terakhir", async () => {
    const ctx = setup();
    ctx.emailTaken.mockResolvedValue(true);
    await expect(createAdminUser(ctx.store, owner, input)).rejects.toThrow("Email admin sudah digunakan");
    expect(ctx.create).not.toHaveBeenCalled();

    ctx.emailTaken.mockResolvedValue(false);
    ctx.read.mockResolvedValue({ authUserId: userId, role: "owner", isActive: true });
    ctx.activeOwnerCount.mockResolvedValue(1);
    await expect(updateAdminUser(ctx.store, owner, "another-profile", {
      name: "Owner", email: "owner@example.test", role: "editor", isActive: true,
    })).rejects.toThrow("Owner aktif terakhir");
    expect(ctx.update).not.toHaveBeenCalled();
  });

  it("mencegah self-lockout dan menampilkan data publik profil tanpa kredensial", async () => {
    const ctx = setup();
    ctx.read.mockResolvedValue({ authUserId: userId, role: "owner", isActive: true });
    await expect(updateAdminUser(ctx.store, owner, owner.id, {
      name: "Owner", email: "owner@example.test", role: "editor", isActive: true,
    })).rejects.toThrow("akun sendiri");
    await expect(listAdminUsers(ctx.store, owner, { limit: 20, offset: 0 })).resolves.toEqual(ctx.rows);
    expect(ctx.list).toHaveBeenCalledWith({ limit: 20, offset: 0 });
  });
});
