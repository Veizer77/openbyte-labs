import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import { listAuditLogs, type AuditLogStore } from "@/services/audit-logs";

const owner: AdminPrincipal = { id: "owner-id", role: "owner", twoFactorVerified: true };
const editor: AdminPrincipal = { id: "editor-id", role: "editor", twoFactorVerified: true };

describe("pembacaan audit log", () => {
  it("hanya mengizinkan owner serta menyaring field rahasia dari diff", async () => {
    const row = {
      id: "03a45fa0-3b54-4d51-ac21-335a00655744",
      actorId: owner.id,
      actorName: "Owner",
      actorEmail: "owner@example.test",
      actorType: "admin",
      action: "update",
      collection: "users",
      docId: "profile-id",
      summary: "Profil admin diperbarui",
      diff: { role: { before: "editor", after: "owner" }, passwordHash: "must-hide", nested: { apiToken: "must-hide", label: "safe" } },
      ipHash: "a".repeat(64),
      createdAt: new Date("2026-10-30T00:00:00Z"),
    };
    const list = vi.fn().mockResolvedValue([row]);
    const store = { list } as AuditLogStore;
    await expect(listAuditLogs(store, editor, { limit: 20, offset: 0 })).rejects.toThrow("Akses ditolak");
    const result = await listAuditLogs(store, owner, { limit: 20, offset: 0 });
    expect(result[0].diff).toEqual({ role: { before: "editor", after: "owner" }, nested: { label: "safe" } });
    expect(list).toHaveBeenCalledWith({ limit: 20, offset: 0 });
  });

  it("memvalidasi rentang tanggal sebelum menyentuh store", async () => {
    const list = vi.fn();
    await expect(listAuditLogs({ list } as AuditLogStore, owner, {
      limit: 10, offset: 0, from: "2026-11-01T00:00:00Z", to: "2026-10-01T00:00:00Z",
    })).rejects.toThrow("Batas akhir harus setelah batas awal");
    expect(list).not.toHaveBeenCalled();
  });
});
