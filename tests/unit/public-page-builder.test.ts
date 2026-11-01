import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PublicPageBuilder } from "@/components/public/PublicPageBuilder";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import type { PublicPageView } from "@/lib/server/public-pages";
import { toPublicSiteSettings } from "@/schemas/public-site-settings";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", props, children),
}));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imageProps = { ...props };
    delete imageProps.fill;
    delete imageProps.unoptimized;
    delete imageProps.sizes;
    return createElement("img", imageProps);
  },
}));
vi.mock("@/components/preview/Controls", () => ({
  NavLink: ({ children, ...props }: { children: ReactNode; href: string }) =>
    createElement("a", props, children),
}));
vi.mock("@/components/public/ReferenceImage", () => ({
  ReferenceImage: () => null,
}));

describe("public page block renderer", () => {
  it("renders published block content without emitting page, block, or media IDs", () => {
    const mediaId = "3de9e7de-0d17-4bb7-a855-6af168bd8841";
    const settings = toPublicSiteSettings(defaultSiteSettings());
    const catalog = {
      settings,
      categories: [],
      packages: [],
      faqs: [],
      services: [],
      projects: [],
      testimonials: [],
      addons: [],
    } as PublicCatalog;
    const page: PublicPageView = {
      slug: "layanan-baru",
      title: "Layanan baru",
      metaTitle: null,
      metaDescription: null,
      ogImageUrl: null,
      media: new Map([[mediaId, {
        alt: "Ilustrasi layanan",
        urls: {
          thumb: "https://cdn.example.com/thumb.webp",
          card: "https://cdn.example.com/card.webp",
          hero: "https://cdn.example.com/hero.webp",
          og: "https://cdn.example.com/og.webp",
        },
      }]]),
      layout: [
        {
          id: "block-private-key",
          isVisible: true,
          type: "hero",
          headline: "Solusi yang diterbitkan",
          subheadline: "Ringkasan publik halaman.",
          primaryCtaLabel: "Konsultasi",
          secondaryCtaLabel: "Lihat paket",
          heroImageId: mediaId,
          trustMetrics: [],
        },
      ],
    };

    const html = renderToStaticMarkup(
      createElement(PublicPageBuilder, { page, catalog }),
    );

    expect(html).toContain("Solusi yang diterbitkan");
    expect(html).toContain("https://cdn.example.com/hero.webp");
    expect(html).not.toContain(mediaId);
    expect(html).not.toContain("block-private-key");
    expect(html).not.toContain(page.slug);
  });
});
