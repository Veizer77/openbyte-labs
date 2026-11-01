import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicHeader } from "@/components/public/PublicHeader";
import { isPublicNavigationTarget } from "@/lib/public-navigation";
import { toPublicSiteSettings } from "@/schemas/public-site-settings";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", props, children),
}));
vi.mock("@/components/preview/Controls", () => ({
  NavLink: ({ children, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", props, children),
}));
vi.mock("@/components/public/ReferenceImage", () => ({
  ReferenceImage: () => null,
}));

afterEach(() => vi.unstubAllEnvs());

const trackingTarget = "/tracking";

describe("menu Tracking Klien", () => {
  it("tidak menautkan portal demo saat settings belum tersedia", () => {
    vi.stubEnv("NODE_ENV", "development");
    const html = renderToStaticMarkup(createElement(PublicHeader));
    expect(html).not.toContain("Tracking Klien");
    expect(html).not.toContain("/preview/site/portal-pelacakan-proyek-klien");
    expect(html).not.toContain('href="/tracking"');
  });

  it("menautkan portal nyata ketika diaktifkan melalui settings database", () => {
    vi.stubEnv("NODE_ENV", "development");
    const settings = toPublicSiteSettings(defaultSiteSettings());
    settings.trackingEnabled = true;
    settings.navigation.menuItems = [{ label: "Beranda", target: "/" }];
    const html = renderToStaticMarkup(createElement(PublicHeader, { settings }));
    expect(html).toContain(`href="${trackingTarget}"`);
    expect(html).toContain(">Beranda<");
  });

  it("tidak menduplikasi atau mengarahkan menu tracking ke portal demo", () => {
    vi.stubEnv("NODE_ENV", "development");
    const settings = toPublicSiteSettings(defaultSiteSettings());
    settings.trackingEnabled = true;
    settings.navigation.menuItems = [
      { label: "Tracking Klien", target: "/tracking" },
      { label: "Tracking Klien", target: "/preview/site/portal-pelacakan-proyek-klien" },
    ];
    const html = renderToStaticMarkup(createElement(PublicHeader, { settings }));
    expect(html.match(/>Tracking Klien</g)).toHaveLength(1);
    expect(html).toContain(`href="${trackingTarget}"`);
    expect(html).not.toContain('href="/preview/site/portal-pelacakan-proyek-klien"');
  });

  it("menyembunyikan tracking di produksi selama belum diaktifkan", () => {
    vi.stubEnv("NODE_ENV", "production");
    const settings = toPublicSiteSettings(defaultSiteSettings());
    settings.navigation.menuItems = [
      { label: "Beranda", target: "/" },
      { label: "Tracking Klien", target: "/tracking" },
      { label: "Tracking Klien", target: trackingTarget },
    ];
    const html = renderToStaticMarkup(createElement(PublicHeader, { settings }));
    expect(html).not.toContain("Tracking Klien");
    expect(html).not.toContain(trackingTarget);
    expect(html).toContain(">Beranda<");
  });
  it("menampilkan tracking nyata pada produksi setelah diaktifkan", () => {
    vi.stubEnv("NODE_ENV", "production");
    const settings = toPublicSiteSettings(defaultSiteSettings());
    settings.trackingEnabled = true;
    const html = renderToStaticMarkup(createElement(PublicHeader, { settings }));
    expect(html).toContain('href="/tracking"');
    expect(html.match(/>Tracking Klien</g)).toHaveLength(1);
  });
});

describe("public navigation target allowlist", () => {
  it("allows public paths and HTTPS destinations, but blocks admin and gated paths", () => {
    expect(isPublicNavigationTarget("/layanan-baru", false)).toBe(true);
    expect(isPublicNavigationTarget("https://example.com/layanan", false)).toBe(true);
    expect(isPublicNavigationTarget("/admin/settings", false)).toBe(false);
    expect(isPublicNavigationTarget("/preview/site/beranda", false)).toBe(false);
    expect(isPublicNavigationTarget("/tracking", false)).toBe(false);
    expect(isPublicNavigationTarget("/tracking", true)).toBe(true);
    expect(isPublicNavigationTarget("//evil.example", false)).toBe(false);
  });
});
