import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/connection";
import { siteSettings } from "@/db/schema/settings";
import { settingsDocumentSchema } from "@/schemas/site-settings";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";
import { initializeSiteSettings } from "@/seed/site-settings-store";

describe("nilai awal Site Settings", () => {
  it("sesuai kontrak dan menyimpan draf legal sebagai dokumen terstruktur", () => {
    const defaults = defaultSiteSettings();
    expect(settingsDocumentSchema.safeParse(defaults).success).toBe(true);
    expect(defaults.general.brandName).toBe("OpenByte Labs");
    expect(defaults.general.whatsappNumber).toBe("");
    expect(defaults.general.contactEmail).toBe("");
    expect(defaults.booking).toMatchObject({
      slotDurationMinutes: 60,
      minDaysAhead: 1,
      maxDaysAhead: 30,
    });
    expect(defaults.tracking.trackingEnabled).toBe(false);
    expect(JSON.stringify(defaults.legal.privacyPolicy)).toContain("[ISI:");
    defaults.hero.headline = "diubah";
    expect(defaultSiteSettings().hero.headline).not.toBe("diubah");
  });
  it("menggunakan INSERT ON CONFLICT DO NOTHING, bukan menimpa pengaturan", async () => {
    const returning = vi
      .fn()
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([]);
    const onConflictDoNothing = vi.fn(() => ({ returning }));
    const values = vi.fn(() => ({ onConflictDoNothing }));
    const insert = vi.fn(() => ({ values }));
    const db = { insert } as unknown as Database;
    expect(await initializeSiteSettings(db)).toBe(true);
    expect(await initializeSiteSettings(db)).toBe(false);
    expect(insert).toHaveBeenCalledWith(siteSettings);
    expect(values).toHaveBeenCalledWith({ id: 1, data: defaultSiteSettings() });
    expect(onConflictDoNothing).toHaveBeenCalledWith({
      target: siteSettings.id,
    });
  });
});
