import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  getAdminInquiry,
  listAdminInquiries,
  updateAdminInquiry,
  type InquiryAdminStore,
} from "@/services/inquiry-admin";

const owner: AdminPrincipal = {
  id: "owner-id",
  role: "owner",
  twoFactorVerified: true,
};
const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const record = {
  id,
  reference: "INQ-2610-ABCD",
  servicePackageId: null,
  quoteRequestId: null,
  packageName: null,
  packagePrice: null,
  packageBillingType: null,
  name: "Budi",
  whatsapp: "6281234567890",
  email: null,
  organizationOrBusiness: "",
  message: "Pesan",
  source: "contact",
  status: "new",
  adminNotes: "",
  consentAt: new Date(),
  createdAt: new Date(),
  ipHash: "private",
};
function setup() {
  const list = vi.fn().mockResolvedValue([record]);
  const get = vi.fn().mockResolvedValue(record);
  const update = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ update, audit }));
  return {
    store: { list, get, transaction } as InquiryAdminStore,
    list,
    get,
    update,
    audit,
    transaction,
  };
}

describe("inquiry admin", () => {
  it("hanya owner membaca detail atau daftar dan tidak menerima hash IP", async () => {
    const ctx = setup();
    await expect(getAdminInquiry(ctx.store, editor, id)).rejects.toThrow(
      "Akses ditolak",
    );
    await expect(
      listAdminInquiries(ctx.store, null, { limit: 10, offset: 0 }),
    ).rejects.toThrow("Akses ditolak");
    expect(ctx.get).not.toHaveBeenCalled();
    expect(await getAdminInquiry(ctx.store, owner, id)).not.toHaveProperty(
      "ipHash",
    );
    expect(
      (await listAdminInquiries(ctx.store, owner, { limit: 10, offset: 0 }))[0],
    ).not.toHaveProperty("ipHash");
  });
  it("memvalidasi dan mengaudit perubahan status/catatan owner", async () => {
    const ctx = setup();
    await expect(
      updateAdminInquiry(ctx.store, editor, id, {
        status: "contacted",
        adminNotes: "",
      }),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      updateAdminInquiry(ctx.store, owner, id, {
        status: "paid",
        adminNotes: "",
      }),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      updateAdminInquiry(ctx.store, owner, id, {
        status: "contacted",
        adminNotes: "Sudah dihubungi",
      }),
    ).resolves.toBeUndefined();
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, id);
    ctx.audit.mockRejectedValue(new Error("audit gagal"));
    await expect(
      updateAdminInquiry(ctx.store, owner, id, {
        status: "contacted",
        adminNotes: "",
      }),
    ).rejects.toThrow("audit gagal");
  });
});
