import { describe, expect, it, vi } from "vitest";
import type { TrackingStore } from "@/db/tracking-store";
import type { AdminPrincipal } from "@/access/rules";
import {
  createClientProject,
  listClientProjects,
  readAdminClientProject,
  mutateAdminClientProject,
  loginTracking,
  mutateClientPortal,
} from "@/services/tracking";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";
import { settingsDocumentSchema } from "@/schemas/site-settings";
import { toPublicSiteSettings } from "@/schemas/public-site-settings";
import { adminMutationSchema, clientMutationSchema } from "@/schemas/tracking";
import type { TrackingSession } from "@/lib/tracking/security";
import { trackingFailure } from "@/lib/server/tracking-result";

const id = "11111111-1111-4111-8111-111111111111";
describe("portal service authorization", () => {
  it("does not log or return bound credentials from an unexpected database error", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const result = trackingFailure(
        new Error("params: PIN_HASH_AND_SESSION_SECRET"),
      );
      expect(result.ok).toBe(false);
      expect(JSON.stringify(result)).not.toContain(
        "PIN_HASH_AND_SESSION_SECRET",
      );
      expect(log).toHaveBeenCalledWith("[tracking] server operation failed");
      expect(JSON.stringify(log.mock.calls)).not.toContain(
        "PIN_HASH_AND_SESSION_SECRET",
      );
    } finally {
      log.mockRestore();
    }
  });
  it.each([
    null,
    { id: "editor", role: "editor", twoFactorVerified: true },
    { id: "owner", role: "owner", twoFactorVerified: false },
  ] as (AdminPrincipal | null)[])(
    "rejects unauthorized principals before touching the store",
    async (principal) => {
      const store = {
        listAdmin: vi.fn(),
        adminDetail: vi.fn(),
        createProject: vi.fn(),
        adminMutate: vi.fn(),
      } as unknown as TrackingStore;
      await expect(listClientProjects(store, principal)).rejects.toThrow(
        "Akses ditolak",
      );
      await expect(
        readAdminClientProject(store, principal, id),
      ).rejects.toThrow("Akses ditolak");
      await expect(createClientProject(store, principal, {})).rejects.toThrow(
        "Akses ditolak",
      );
      await expect(
        mutateAdminClientProject(store, principal, id, {}),
      ).rejects.toThrow("Akses ditolak");
      for (const method of [
        store.listAdmin,
        store.adminDetail,
        store.createProject,
        store.adminMutate,
      ])
        expect(method).not.toHaveBeenCalled();
    },
  );
  it("returns the same login message for unknown codes and wrong PINs", async () => {
    const store = {
      login: vi.fn().mockResolvedValue(null),
    } as unknown as TrackingStore;
    await expect(
      loginTracking(
        store,
        { code: "PRJ-ABCDEFGH", pin: "123456" },
        "ip",
        "secret",
      ),
    ).rejects.toThrow("Kode atau PIN tidak sesuai.");
    await expect(
      loginTracking(store, { code: "bad", pin: "bad" }, "ip", "secret"),
    ).rejects.toThrow("Kode atau PIN tidak sesuai.");
  });
  it("consumes a committed budget before a failed mutation, with an extra PIN budget for approvals", async () => {
    const consumeBudget = vi.fn().mockResolvedValue(undefined);
    const clientMutate = vi.fn().mockRejectedValue(new Error("wrong PIN"));
    const store = { consumeBudget, clientMutate } as unknown as TrackingStore;
    const session = { projectId: id } as TrackingSession;
    await expect(
      mutateClientPortal(store, session, { kind: "approve" }, "ip", "agent"),
    ).rejects.toThrow();
    expect(consumeBudget.mock.calls).toEqual([
      [session, "ip"],
      [session, "ip", true],
    ]);
    expect(consumeBudget.mock.invocationCallOrder[1]).toBeLessThan(
      clientMutate.mock.invocationCallOrder[0],
    );
  });
  it("allows enabling tracking but exposes only a boolean, never its private settings", () => {
    const settings = defaultSiteSettings();
    settings.tracking.trackingEnabled = true;
    expect(settingsDocumentSchema.safeParse(settings).success).toBe(true);
    const publicSettings = toPublicSiteSettings(settings);
    expect(publicSettings.trackingEnabled).toBe(true);
    expect(publicSettings).not.toHaveProperty("tracking");
    expect(publicSettings).not.toHaveProperty("sessionMinutes");
  });
  it("does not accept project identities, internal comments or approval edits in a client payload", () => {
    expect(
      clientMutationSchema.safeParse({
        kind: "comment",
        body: "test",
        revisionRequestId: null,
        fileIds: [],
        projectId: id,
      }).success,
    ).toBe(false);
    expect(
      clientMutationSchema.safeParse({
        kind: "comment",
        body: "test",
        revisionRequestId: null,
        fileIds: [],
        isInternal: true,
      }).success,
    ).toBe(false);
    expect(adminMutationSchema.safeParse({ kind: "approve", id }).success).toBe(
      false,
    );
  });
});
