import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { PublicProjectDetail } from "@/services/public-projects";
import type { PublicStoreProduct } from "@/schemas/store";
import { publicSiteOrigin } from "@/lib/indexing";

/**
 * Origin kanonik untuk data terstruktur. `publicSiteOrigin()` memvalidasi
 * `SITE_URL` (https, bukan localhost) sehingga JSON-LD tidak pernah menunjuk
 * ke domain pratinjau atau localhost saat crawler membacanya.
 */
function siteOrigin(): string {
  return publicSiteOrigin() ?? "https://www.openbyte-labs.web.id";
}

export function OrganizationJsonLd({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  const brandName = settings?.general.brandName || "OpenByte Labs";
  const payload = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brandName,
    url: siteOrigin(),
    description:
      settings?.seo.defaultDescription ||
      "Pengembangan website, aplikasi mobile, dan sistem informasi kustom.",
    email: settings?.general.contactEmail || undefined,
    telephone: settings?.general.whatsappNumber || undefined,
    address: settings?.general.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.general.address,
          addressCountry: "ID",
        }
      : undefined,
    sameAs: settings?.general.socialLinks.map((item) => item.url) ?? [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Skema `WebSite` di beranda agar Google Search mengenali Site Name resmi
 * ("OpenByte Labs") alih-alih hanya menampilkan domain mentah.
 */
export function WebSiteJsonLd({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  const brandName = settings?.general.brandName || "OpenByte Labs";
  const compactBrand = brandName.replace(/\s+/g, "");
  const alternateName =
    compactBrand && compactBrand.toLowerCase() !== brandName.toLowerCase()
      ? [compactBrand]
      : undefined;

  const payload = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    alternateName,
    url: `${siteOrigin()}/`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function ProjectJsonLd({
  project,
  settings,
}: {
  project: PublicProjectDetail;
  settings?: PublicSiteSettings;
}) {
  const siteUrl = siteOrigin();
  const payload = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline || project.title,
    description: project.summary,
    url: `${siteUrl}/proyek/${project.slug}`,
    datePublished: project.year ? `${project.year}-01-01` : undefined,
    genre: project.categories,
    keywords: project.technologies.join(", "),
    creator: {
      "@type": "Organization",
      name: settings?.general.brandName || "OpenByte Labs",
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Data terstruktur `Product` untuk /store/[slug]. Harga memakai IDR tanpa
 * pecahan (schema.org mewajibkan string desimal), `availability` diambil
 * dari `hasPackage`, dan `offers` menyertakan pengiriman digital gratis (0 hari)
 * serta kebijakan non-retur produk digital untuk memenuhi validasi GSC Merchant Listings.
 */
export function StoreProductJsonLd({
  product,
  settings,
}: {
  product: PublicStoreProduct;
  settings?: PublicSiteSettings;
}) {
  const siteUrl = siteOrigin();
  const brandName = settings?.general.brandName || "OpenByte Labs";
  const offers = {
    "@type": "Offer",
    url: `${siteUrl}/store/${product.slug}`,
    priceCurrency: "IDR",
    price: product.priceSingle.toFixed(2),
    availability: product.hasPackage
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: brandName, url: siteUrl },
    shippingDetails: {
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
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "ID",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: `${siteUrl}/ketentuan-layanan`,
    },
  };
  const payload = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.summary,
    sku: product.id,
    url: `${siteUrl}/store/${product.slug}`,
    image: product.thumbnail?.url ? [product.thumbnail.url] : undefined,
    brand: { "@type": "Brand", name: brandName },
    category:
      product.productType === "source_code" ? "Source Code" : "UI/UX Template",
    offers,
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (product.ratingAverage / 100).toFixed(2),
            reviewCount: product.ratingCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
