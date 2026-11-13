import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { formatPublicPageTitle } from "@/lib/seo-title";
import { WebSiteJsonLd } from "@/components/public/JsonLd";

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
});
