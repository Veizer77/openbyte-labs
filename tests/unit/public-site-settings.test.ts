import { describe, expect, it } from "vitest";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";
import { toPublicSiteSettings } from "@/schemas/public-site-settings";

describe("public site settings projection", () => {
  it("returns only public fields and normalizes the WhatsApp number", () => {
    const input = defaultSiteSettings();
    input.general.whatsappNumber = "081234567890";
    input.navigation.menuItems[0].isActive = false;

    const settings = toPublicSiteSettings(input);

    expect(settings.general.whatsappNumber).toBe("6281234567890");
    expect(settings.navigation.menuItems.map((item) => item.label)).not.toContain(
      "Beranda",
    );
    expect(settings).not.toHaveProperty("whatsapp");
    expect(settings).not.toHaveProperty("tracking");
    expect(settings.seo).not.toHaveProperty("analyticsId");
    expect(settings.general).not.toHaveProperty("logoId");
    expect(settings.general.logoUrl).toBeNull();
    expect(settings.hero.heroImageUrl).toBeNull();
    expect(settings.seo.defaultOgImageUrl).toBeNull();
    expect(settings.legal.privacyPolicy).toBeNull();
    expect(JSON.stringify(settings)).not.toContain("Muhammad Izzat Farahidi");
  });

  it("resolves selected media to public URLs without leaking media IDs", () => {
    const input = defaultSiteSettings();
    const logoId = "3de9e7de-0d17-4bb7-a855-6af168bd8841";
    const heroId = "dd3c40bb-d01d-4e55-9762-71a22e26466a";
    const ogId = "741609fc-acbd-4315-a6e4-d6e53049b7ec";
    input.general.logoId = logoId;
    input.hero.heroImageId = heroId;
    input.seo.defaultOgImageId = ogId;
    const makeMedia = (id: string) => ({
      alt: "Gambar publik",
      urls: {
        thumb: `https://cdn.example.com/${id}/thumb.webp`,
        card: `https://cdn.example.com/${id}/card.webp`,
        hero: `https://cdn.example.com/${id}/hero.webp`,
        og: `https://cdn.example.com/${id}/og.webp`,
      },
    });

    const settings = toPublicSiteSettings(
      input,
      new Map([[logoId, makeMedia(logoId)], [heroId, makeMedia(heroId)], [ogId, makeMedia(ogId)]]),
    );

    expect(settings.general.logoUrl).toContain("/card.webp");
    expect(settings.hero.heroImageUrl).toContain("/hero.webp");
    expect(settings.seo.defaultOgImageUrl).toContain("/og.webp");
    expect(settings.general).not.toHaveProperty("logoId");
    expect(settings.hero).not.toHaveProperty("heroImageId");
    expect(settings.seo).not.toHaveProperty("defaultOgImageId");
  });

  it("fails closed for an invalid persisted Settings document", () => {
    expect(() => toPublicSiteSettings({ tracking: { trackingEnabled: true } })).toThrow();
  });

  it("keeps public contact channels empty until they are configured", () => {
    const settings = toPublicSiteSettings(defaultSiteSettings());

    expect(settings.general.whatsappNumber).toBe("");
    expect(settings.general.contactEmail).toBe("");
  });
});
