import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  deleteService,
  listPublicServices,
  saveService,
  type ServiceStore,
} from "@/services/services";
import {
  saveTestimonial,
  type TestimonialStore,
} from "@/services/testimonials";
import {
  deleteTechnology,
  saveTechnology,
  type TechnologyStore,
} from "@/services/technologies";
import {
  listPublicServiceAddons,
  saveServiceAddon,
  type ServiceAddonStore,
} from "@/services/service-addons";

const editor: AdminPrincipal = { id: "editor-id", role: "editor", twoFactorVerified: true };
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const photoId = "64f83a30-f94b-4da1-a2e0-3cf7e43de702";
const projectId = "b5f106fb-b888-4f12-90d0-e4282e0d8918";

function serviceStore(rows: unknown[] = []) {
  const list = vi.fn().mockResolvedValue(rows);
  const save = vi.fn().mockResolvedValue(id);
  const remove = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ save, remove, audit }));
  return { store: { list, transaction } as ServiceStore, list, save, remove, audit, transaction };
}

describe("CRUD layanan", () => {
  const input = { title: "Website", description: "Web untuk bisnis", highlights: ["Responsif"], icon: "Globe", isActive: true, sortOrder: 0 };

  it("memvalidasi, mengaudit, dan invalidasi setelah commit", async () => {
    const ctx = serviceStore();
    const invalidate = vi.fn();
    await expect(saveService(ctx.store, null, null, input, invalidate)).rejects.toThrow("Akses ditolak");
    await expect(saveService(ctx.store, editor, null, { ...input, icon: "../../malicious" }, invalidate)).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(saveService(ctx.store, editor, null, input, invalidate)).resolves.toBe(id);
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "create", id);
    expect(invalidate).toHaveBeenCalledOnce();
  });

  it("menampilkan layanan aktif ke publik dan mengaudit penghapusan", async () => {
    const ctx = serviceStore([{ ...input, id }, { ...input, id: projectId, isActive: false }]);
    await expect(listPublicServices(ctx.store, { limit: 20, offset: 0 })).resolves.toEqual([{ ...input, id }]);
    await deleteService(ctx.store, editor, id, vi.fn());
    expect(ctx.remove).toHaveBeenCalledWith(id);
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "delete", id);
  });
});

describe("CRUD testimoni", () => {
  it("memverifikasi media/proyek sebelum menyimpan dan mengaudit perubahan", async () => {
    const ensurePhotoReady = vi.fn().mockResolvedValue(undefined);
    const ensureProjectAvailable = vi.fn().mockResolvedValue(undefined);
    const save = vi.fn().mockResolvedValue(id);
    const audit = vi.fn().mockResolvedValue(undefined);
    const transaction = vi.fn((callback) => callback({ ensurePhotoReady, ensureProjectAvailable, save, remove: vi.fn(), audit }));
    const store = { list: vi.fn(), transaction } as TestimonialStore;
    const input = { authorName: "Nadia", authorRole: "Direktur", quote: "Sangat membantu", photoId, projectId, isActive: true, sortOrder: 1 };
    await saveTestimonial(store, editor, null, input, vi.fn());
    expect(ensurePhotoReady).toHaveBeenCalledWith(photoId);
    expect(ensureProjectAvailable).toHaveBeenCalledWith(projectId);
    expect(audit).toHaveBeenCalledWith(editor.id, "create", id);
  });

  it("tidak menulis bila referensi foto belum siap", async () => {
    const save = vi.fn();
    const transaction = vi.fn((callback) => callback({
      ensurePhotoReady: vi.fn().mockRejectedValue(new Error("Media belum final")),
      ensureProjectAvailable: vi.fn(), save, remove: vi.fn(), audit: vi.fn(),
    }));
    await expect(saveTestimonial({ list: vi.fn(), transaction } as TestimonialStore, editor, null, {
      authorName: "Nadia", authorRole: "", quote: "Bagus", photoId, projectId: null, isActive: true, sortOrder: 0,
    }, vi.fn())).rejects.toThrow("Media belum final");
    expect(save).not.toHaveBeenCalled();
  });
});

describe("CRUD teknologi", () => {
  it("mencegah nama duplikat tanpa menyimpan dan mencatat audit", async () => {
    const lockNames = vi.fn();
    const nameTaken = vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const save = vi.fn().mockResolvedValue(id);
    const audit = vi.fn().mockResolvedValue(undefined);
    const transaction = vi.fn((callback) => callback({ lockNames, nameTaken, save, remove: vi.fn(), audit }));
    const store = { list: vi.fn(), transaction } as TechnologyStore;
    const input = { name: "React", slug: "react", icon: "Atom", color: "#123ABC" };
    await expect(saveTechnology(store, editor, null, input, vi.fn())).rejects.toThrow("Nama teknologi sudah digunakan");
    expect(save).not.toHaveBeenCalled();
    await expect(saveTechnology(store, editor, null, input, vi.fn())).resolves.toBe(id);
    expect(lockNames).toHaveBeenCalledTimes(2);
    expect(audit).toHaveBeenCalledWith(editor.id, "create", id);
  });

  it("memetakan FK proyek saat teknologi masih dipakai", async () => {
    const transaction = vi.fn((callback) => callback({
      lockNames: vi.fn(), nameTaken: vi.fn(), save: vi.fn(),
      remove: vi.fn().mockRejectedValue({ cause: { code: "23503", constraint_name: "project_technologies_technology_id_technologies_id_fk" } }),
      audit: vi.fn(),
    }));
    await expect(deleteTechnology({ list: vi.fn(), transaction } as TechnologyStore, editor, id, vi.fn())).rejects.toThrow("masih digunakan oleh proyek");
  });
});

describe("CRUD add-on layanan", () => {
  it("memvalidasi dan menampilkan hanya add-on aktif untuk publik", async () => {
    const input = { name: "Maintenance", description: "Dukungan rutin", price: 100_000, billingType: "monthly" as const, isActive: true, sortOrder: 0 };
    const list = vi.fn().mockResolvedValue([{ ...input, id }, { ...input, id: projectId, isActive: false }]);
    const save = vi.fn().mockResolvedValue(id);
    const audit = vi.fn().mockResolvedValue(undefined);
    const transaction = vi.fn((callback) => callback({ save, remove: vi.fn(), audit }));
    const store = { list, transaction } as ServiceAddonStore;
    await expect(listPublicServiceAddons(store, { limit: 10, offset: 0 })).resolves.toEqual([{ ...input, id }]);
    await expect(saveServiceAddon(store, editor, null, { ...input, price: -1 }, vi.fn())).rejects.toThrow();
    await saveServiceAddon(store, editor, null, input, vi.fn());
    expect(audit).toHaveBeenCalledWith(editor.id, "create", id);
  });
});
