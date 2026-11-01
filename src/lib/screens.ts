import type { ComponentType } from "react";

// Literal, per-route imports keep dashboard and preview screens out of public bundles.
export const screenLoaders = {
  "site/beranda": () => import("@/components/screens/site/beranda"),
  "site/daftar-portofolio": () =>
    import("@/components/screens/site/daftar-portofolio"),
  "site/detail-proyek-contoh": () =>
    import("@/components/screens/site/detail-proyek-contoh"),
  "site/detail-layanan": () =>
    import("@/components/screens/site/detail-layanan"),
  "site/paket-layanan-harga": () =>
    import("@/components/screens/site/paket-layanan-harga"),
  "site/kalkulator-estimasi-biaya": () =>
    import("@/components/screens/site/kalkulator-estimasi-biaya"),
  "site/booking-konsultasi": () =>
    import("@/components/screens/site/booking-konsultasi"),
  "site/tentang-kami": () => import("@/components/screens/site/tentang-kami"),
  "site/ketentuan-layanan": () =>
    import("@/components/screens/site/ketentuan-layanan"),
  "site/404": () => import("@/components/screens/site/404"),
  "site/blog": () => import("@/components/screens/site/blog"),
  "site/otentikasi-tracking-klien": () =>
    import("@/components/screens/site/otentikasi-tracking-klien"),
  "site/portal-pelacakan-proyek-klien": () =>
    import("@/components/screens/site/portal-pelacakan-proyek-klien"),
  "cms/login-admin": () => import("@/components/screens/cms/login-admin"),
  "cms/dashboard-cms-admin": () =>
    import("@/components/screens/cms/dashboard-cms-admin"),
  "cms/proyek-showcase": () =>
    import("@/components/screens/cms/proyek-showcase"),
  "cms/proyek-klien-tracking": () =>
    import("@/components/screens/cms/proyek-klien-tracking"),
  "cms/booking-konsultasi": () =>
    import("@/components/screens/cms/booking-konsultasi"),
  "cms/site-settings": () => import("@/components/screens/cms/site-settings"),
  "cms/layanan-bento": () => import("@/components/screens/cms/layanan-bento"),
  "cms/inquiry-pemesanan": () =>
    import("@/components/screens/cms/inquiry-pemesanan"),
  "cms/quote-kalkulator": () =>
    import("@/components/screens/cms/quote-kalkulator"),
  "cms/paket-layanan-addon": () =>
    import("@/components/screens/cms/paket-layanan-addon"),
  "cms/kategori-teknologi": () =>
    import("@/components/screens/cms/kategori-teknologi"),
  "cms/template-tahap": () => import("@/components/screens/cms/template-tahap"),
  "cms/testimoni-faq": () => import("@/components/screens/cms/testimoni-faq"),
  "cms/invoice-penagihan": () =>
    import("@/components/screens/cms/invoice-penagihan"),
  "cms/manajemen-staf": () => import("@/components/screens/cms/manajemen-staf"),
  "cms/log-aktivitas-2fa": () =>
    import("@/components/screens/cms/log-aktivitas-2fa"),
  "system/design-system-guidelines": () =>
    import("@/components/screens/system/design-system-guidelines"),
  "system/overview-architecture": () =>
    import("@/components/screens/system/overview-architecture"),
  "system/route-map-architecture": () =>
    import("@/components/screens/system/route-map-architecture"),
  "system/tokens-color-swatches": () =>
    import("@/components/screens/system/tokens-color-swatches"),
} satisfies Record<string, () => Promise<{ default: ComponentType }>>;
export type ScreenKey = keyof typeof screenLoaders;
export function isScreenKey(key: string): key is ScreenKey {
  return Object.hasOwn(screenLoaders, key);
}
