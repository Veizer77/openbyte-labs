import { describe, expect, it, vi } from "vitest";
import { canAccess, type AdminPrincipal } from "@/access/rules";
import { settingsSchemas } from "@/schemas/site-settings";
import {
  readSettingsSection,
  updateSettingsSection,
  type SettingsStore,
} from "@/services/site-settings";
import {
  renderWhatsappTemplate,
  validateWhatsappTemplate,
  unknownPlaceholders,
  whatsappUrl,
} from "@/lib/whatsapp";

const owner: AdminPrincipal = {
  id: "owner-1",
  role: "owner",
  twoFactorVerified: true,
};
const editor: AdminPrincipal = {
  id: "editor-1",
  role: "editor",
  twoFactorVerified: true,
};
const booking = {
  slotDurationMinutes: 60,
  bufferMinutes: 0,
  minDaysAhead: 1,
  maxDaysAhead: 30,
  availableModes: ["google_meet"],
};

describe("kebijakan akses backend", () => {
  it("menolak anonim, 2FA belum selesai, role, resource, dan action yang tidak dikenal", () => {
    expect(canAccess(null, "projects", "read")).toBe(false);
    expect(
      canAccess({ ...owner, twoFactorVerified: false }, "projects", "read"),
    ).toBe(false);
    expect(
      canAccess({ ...owner, role: "admin" as "owner" }, "projects", "read"),
    ).toBe(false);
    expect(canAccess(owner, "secret", "read")).toBe(false);
    expect(canAccess(owner, "projects", "export")).toBe(false);
    expect(canAccess(owner, "users", "publish")).toBe(false);
    expect(canAccess(owner, "inquiries", "create")).toBe(false);
  });
  it("menerapkan batas editor dan audit append-only", () => {
    for (const resource of [
      "inquiries",
      "quote-requests",
      "consultation-bookings",
      "users",
      "audit-logs",
      "blocked-dates",
    ]) {
      expect(canAccess(editor, resource, "read")).toBe(false);
    }
    expect(canAccess(editor, "projects", "update")).toBe(true);
    expect(canAccess(owner, "audit-logs", "read")).toBe(true);
    for (const action of ["create", "update", "delete", "publish", "restore"])
      expect(canAccess(owner, "audit-logs", action)).toBe(false);
  });
  it("menerapkan keamanan field settings secara eksplisit", () => {
    expect(canAccess(editor, "site-settings", "update", ["hero"])).toBe(true);
    expect(
      canAccess(editor, "site-settings", "read", ["hero", "whatsapp"]),
    ).toBe(false);
    expect(canAccess(editor, "site-settings", "read", ["tracking"])).toBe(
      false,
    );
    expect(canAccess(owner, "site-settings", "read", [])).toBe(false);
    expect(canAccess(owner, "site-settings", "update", ["unknown"])).toBe(
      false,
    );
    expect(canAccess(editor, "site-settings", "read", ["booking"])).toBe(true);
    expect(canAccess(editor, "site-settings", "update", ["booking"])).toBe(
      false,
    );
    expect(canAccess(owner, "site-settings", "update", ["booking"])).toBe(true);
  });
});

describe("validasi settings", () => {
  it("menolak booking invalid, mode duplikat, field asing, dan aktivasi tracking", () => {
    expect(settingsSchemas.booking.safeParse(booking).success).toBe(true);
    expect(
      settingsSchemas.booking.safeParse({ ...booking, minDaysAhead: 31 })
        .success,
    ).toBe(false);
    expect(
      settingsSchemas.booking.safeParse({
        ...booking,
        availableModes: ["google_meet", "google_meet"],
      }).success,
    ).toBe(false);
    expect(
      settingsSchemas.booking.safeParse({ ...booking, surprise: true }).success,
    ).toBe(false);
    expect(
      settingsSchemas.tracking.safeParse({ trackingEnabled: true }).success,
    ).toBe(false);
  });
  it("hanya menerima tautan navigasi aman", () => {
    const navigation = (target: string) => ({
      menuItems: [{ label: "Menu", target, isActive: true }],
      footerText: "",
    });
    expect(
      settingsSchemas.navigation.safeParse(navigation("/proyek")).success,
    ).toBe(true);
    expect(
      settingsSchemas.navigation.safeParse(navigation("https://example.com"))
        .success,
    ).toBe(true);
    for (const target of [
      "javascript:alert(1)",
      "//example.com",
      "/\\example.com",
      "https://",
    ])
      expect(
        settingsSchemas.navigation.safeParse(navigation(target)).success,
      ).toBe(false);
  });
  it("menolak placeholder asing dan meng-encode pesan WhatsApp", () => {
    expect(unknownPlaceholders("Halo {nama}, {asing}, {asing}")).toEqual([
      "asing",
    ]);
    expect(() => renderWhatsappTemplate("Halo {asing}", {})).toThrow();
    expect(() => renderWhatsappTemplate("Halo {nama}", {})).toThrow();
    const message = renderWhatsappTemplate("Halo {nama}", { nama: "A & B" });
    expect(new URL(whatsappUrl(message, "081234567890")).searchParams.get("text")).toBe(
      "Halo A & B",
    );
  });
  it("menolak kurung rusak dan placeholder di luar konteks template", () => {
    const templates = {
      tplCalculator:
        "Halo {nama}, {rincian}: {estimasi_harga} ({estimasi_durasi}), {referensi}",
      tplPackageOrder: "{nama} memilih {platform}, {referensi}",
      tplBookingConfirm: "{nama}, {tanggal} {jam} {meeting_url}, {referensi}",
      tplTrackingLink:
        "{nama}, {nama_proyek}: {link_tracking}, {kode_tracking}",
      tplRevisionNotice: "{nama}: {judul_revisi}, {sisa_kuota}",
    };
    expect(settingsSchemas.whatsapp.safeParse(templates).success).toBe(true);
    for (const invalid of [
      "Halo {asing",
      "Halo nama}",
      "Halo {{nama}}",
      "Halo {}",
      "{nama}{",
    ]) {
      expect(validateWhatsappTemplate(invalid)).toBe(false);
      expect(
        settingsSchemas.whatsapp.safeParse({
          ...templates,
          tplCalculator: invalid,
        }).success,
      ).toBe(false);
      expect(() => renderWhatsappTemplate(invalid, { nama: "Budi" })).toThrow();
    }
    expect(
      settingsSchemas.whatsapp.safeParse({
        ...templates,
        tplBookingConfirm: "{kode_tracking}",
      }).success,
    ).toBe(false);
    expect(
      settingsSchemas.whatsapp.safeParse({
        ...templates,
        tplCalculator: "{meeting_url}",
      }).success,
    ).toBe(false);
    expect(
      renderWhatsappTemplate(templates.tplBookingConfirm, {
        nama: "Budi",
        tanggal: "01/11/2026",
        jam: "10:00",
        meeting_url: "https://example.com",
        referensi: "BKG-1",
      }),
    ).toContain("BKG-1");
  });
  it("memakai dokumen rich text terbatas dan menolak HTML/URL tidak aman", () => {
    const document = {
      version: 1,
      blocks: [
        {
          type: "heading",
          level: 2,
          children: [{ type: "text", text: "Kebijakan Privasi" }],
        },
        {
          type: "paragraph",
          children: [
            { type: "link", text: "Kontak", url: "mailto:contact@example.com" },
          ],
        },
        {
          type: "list",
          ordered: false,
          items: [[{ type: "text", text: "Data kontak" }]],
        },
      ],
    };
    expect(
      settingsSchemas.legal.safeParse({
        privacyPolicy: document,
        consentText: "Setuju",
      }).success,
    ).toBe(true);
    expect(
      settingsSchemas.legal.safeParse({
        privacyPolicy: "<script>alert(1)</script>",
        consentText: "",
      }).success,
    ).toBe(false);
    const unsafe = {
      version: 1,
      blocks: [
        {
          type: "paragraph",
          children: [
            { type: "link", text: "Klik", url: "javascript:alert(1)" },
          ],
        },
      ],
    };
    expect(
      settingsSchemas.legal.safeParse({
        privacyPolicy: unsafe,
        consentText: "",
      }).success,
    ).toBe(false);
    expect(
      settingsSchemas.legal.safeParse({
        privacyPolicy: { ...document, html: "<script>" },
        consentText: "",
      }).success,
    ).toBe(false);
  });
});

describe("service settings", () => {
  it("menolak akses dan input invalid sebelum memanggil store", async () => {
    const store: SettingsStore = { readSection: vi.fn(), transaction: vi.fn() };
    await expect(
      updateSettingsSection(store, editor, "whatsapp", {}, vi.fn()),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      updateSettingsSection(store, editor, "booking", booking, vi.fn()),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      updateSettingsSection(
        store,
        owner,
        "booking",
        {
          ...booking,
          slotDurationMinutes: 0,
        },
        vi.fn(),
      ),
    ).rejects.toThrow();
    expect(store.transaction).not.toHaveBeenCalled();
    await expect(
      readSettingsSection(store, editor, "tracking"),
    ).rejects.toThrow("Akses ditolak");
    expect(store.readSection).not.toHaveBeenCalled();
  });
  it("menyimpan dan mencatat audit di transaksi yang sama", async () => {
    const replace = vi.fn().mockResolvedValue(undefined);
    const audit = vi.fn().mockResolvedValue(undefined);
    const commit = vi.fn();
    const store: SettingsStore = {
      readSection: vi.fn(),
      transaction: async (callback) => {
        const result = await callback({
          ensureMediaReady: vi.fn(),
          lockAndReplaceSection: replace,
          insertAudit: audit,
        });
        commit();
        return result;
      },
    };
    const invalidate = vi.fn();
    expect(
      await updateSettingsSection(store, owner, "booking", booking, invalidate),
    ).toEqual(booking);
    expect(replace).toHaveBeenCalledWith("booking", booking);
    expect(audit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: owner.id,
        collection: "site-settings",
      }),
    );
    expect(invalidate).toHaveBeenCalledOnce();
    expect(audit.mock.invocationCallOrder[0]).toBeLessThan(
      commit.mock.invocationCallOrder[0],
    );
    expect(commit.mock.invocationCallOrder[0]).toBeLessThan(
      invalidate.mock.invocationCallOrder[0],
    );
  });
  it("meneruskan kegagalan audit agar transaksi dapat rollback", async () => {
    const store: SettingsStore = {
      readSection: vi.fn(),
      transaction: (callback) =>
        callback({
          ensureMediaReady: vi.fn(),
          lockAndReplaceSection: vi.fn().mockResolvedValue(undefined),
          insertAudit: vi.fn().mockRejectedValue(new Error("audit gagal")),
        }),
    };
    const invalidate = vi.fn();
    await expect(
      updateSettingsSection(store, owner, "booking", booking, invalidate),
    ).rejects.toThrow("audit gagal");
    expect(invalidate).not.toHaveBeenCalled();
  });
  it("membedakan kegagalan cache setelah commit dari kegagalan transaksi", async () => {
    const store: SettingsStore = {
      readSection: vi.fn(),
      transaction: (callback) =>
        callback({
          ensureMediaReady: vi.fn(),
          lockAndReplaceSection: vi.fn().mockResolvedValue(undefined),
          insertAudit: vi.fn().mockResolvedValue(undefined),
        }),
    };
    await expect(
      updateSettingsSection(store, owner, "booking", booking, () => {
        throw new Error("cache");
      }),
    ).rejects.toThrow(
      "Pengaturan sudah disimpan, tetapi cache belum berhasil diperbarui.",
    );
  });
  it("menolak referensi media yang belum lolos verifikasi sebelum menulis", async () => {
    const ensureMediaReady = vi
      .fn()
      .mockRejectedValue(new Error("Media belum diverifikasi"));
    const replace = vi.fn();
    const audit = vi.fn();
    const store: SettingsStore = {
      readSection: vi.fn(),
      transaction: (callback) =>
        callback({
          ensureMediaReady,
          lockAndReplaceSection: replace,
          insertAudit: audit,
        }),
    };
    const invalidate = vi.fn();
    const hero = {
      headline: "Judul",
      subheadline: "",
      primaryCtaLabel: "",
      secondaryCtaLabel: "",
      heroImageId: "03a45fa0-3b54-4d51-ac21-335a00655744",
      trustMetrics: [],
    };
    await expect(
      updateSettingsSection(store, owner, "hero", hero, invalidate),
    ).rejects.toThrow("Media belum diverifikasi");
    expect(ensureMediaReady).toHaveBeenCalledWith([hero.heroImageId]);
    expect(replace).not.toHaveBeenCalled();
    expect(audit).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });
});
