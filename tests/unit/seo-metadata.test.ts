import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { formatPublicPageTitle } from "@/lib/seo-title";
import { StoreProductJsonLd, WebSiteJsonLd } from "@/components/public/JsonLd";
import type { PublicStoreProduct } from "@/schemas/store";

describe("SEO title & WebSite JSON-LD", () => {
  it("prepends brand name to homepage title when missing", () => {
    expect(
      formatPublicPageTitle("Website, Aplikasi & Sistem Informasi", "OpenByte Labs", {
        isHome: true,
      }),
    ).toEqual({
      absolute: "OpenByte Labs — Website, Aplikasi & Sistem Informasi",
    });
  });

  it("appends brand suffix to subpage titles when missing", () => {
    expect(formatPublicPageTitle("Paket Layanan & Harga")).toEqual({
      absolute: "Paket Layanan & Harga | OpenByte Labs",
    });
  });

  it("does not duplicate brand name if already present", () => {
    expect(
      formatPublicPageTitle("Tentang OpenByte Labs", "OpenByte Labs"),
    ).toEqual({
      absolute: "Tentang OpenByte Labs",
    });
    expect(
      formatPublicPageTitle("OpenByteLabs Portal", "OpenByte Labs"),
    ).toEqual({
      absolute: "OpenByteLabs Portal",
    });
  });

  it("renders WebSite schema with brand name and alternate compact name", () => {
    const html = renderToStaticMarkup(createElement(WebSiteJsonLd, {}));
    const jsonText = html
      .replace(/^<script[^>]*>/, "")
      .replace(/<\/script>$/, "");
    const payload = JSON.parse(jsonText) as Record<string, unknown>;
    expect(payload["@type"]).toBe("WebSite");
    expect(payload.name).toBe("OpenByte Labs");
    expect(payload.alternateName).toEqual(["OpenByteLabs"]);
    expect(payload.url).toBe("https://www.openbyte-labs.web.id/");
  });

  it("renders StoreProductJsonLd offers with shippingDetails and hasMerchantReturnPolicy", () => {
    const product: PublicStoreProduct = {
      id: "11111111-1111-4111-8111-111111111111",
      slug: "sinduksadati-sistem-informasi-kependudukan",
      title: "SINDUKSADATI — Sistem Informasi Kependudukan",
      productType: "source_code",
      tagline: "Satu data wilayah",
      summary: "Sistem informasi kependudukan.",
      version: "1.0.0",
      priceSingle: 490000,
      priceCommercial: 1290000,
      compareAtPriceSingle: 750000,
      compareAtPriceCommercial: 1850000,
      setupServicePrice: 200000,
      packageSizeBytes: 1024,
      videoUrl: null,
      changelog: "",
      salesCount: 0,
      ratingAverage: 0,
      ratingCount: 0,
      techStack: ["Next.js"],
      features: ["GIS"],
      includedFiles: ["Source"],
      demoUrl: null,
      githubRepoInfo: null,
      isFeatured: true,
      sortOrder: 1,
      thumbnail: null,
      gallery: [],
      hasPackage: true,
    };

    const html = renderToStaticMarkup(createElement(StoreProductJsonLd, { product }));
    const payload = JSON.parse(
      html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""),
    ) as {
      offers: {
        shippingDetails: Record<string, unknown>;
        hasMerchantReturnPolicy: Record<string, unknown>;
      };
    };

    expect(payload.offers.shippingDetails).toEqual({
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "IDR",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "ID",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
      },
    });

    expect(payload.offers.hasMerchantReturnPolicy).toEqual({
      "@type": "MerchantReturnPolicy",
      applicableCountry: "ID",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: "https://www.openbyte-labs.web.id/ketentuan-layanan",
    });
  });
});
