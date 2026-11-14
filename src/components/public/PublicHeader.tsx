import Link from "next/link";
import { NavLink } from "@/components/preview/Controls";
import { PublicHeaderNav } from "./PublicHeaderNav";
import { ReferenceImage } from "./ReferenceImage";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { isPublicNavigationTarget } from "@/lib/public-navigation";

const previewNavigation = [
  { label: "Beranda", target: "/" },
  { label: "Proyek Portofolio", target: "/proyek" },
  { label: "Paket Layanan", target: "/paket" },
  { label: "Estimasi Biaya", target: "/kalkulator" },
  { label: "Konsultasi", target: "/konsultasi" },
];

export function PublicHeader({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  const preview = process.env.NODE_ENV === "development";
  const configuredItems =
    settings?.navigation.menuItems ?? (preview ? previewNavigation : []);
  const menuItems = configuredItems.filter(
    (item) =>
      !item.label.toLowerCase().includes("tracking") &&
      !/^\/tracking(?:\/|$)/i.test(item.target) &&
      isPublicNavigationTarget(item.target, false),
  );
  if (settings?.trackingEnabled) {
    menuItems.push({ label: "Tracking Klien", target: "/tracking" });
  }
  if (!menuItems.some((item) => item.target === "/store")) {
    menuItems.push({ label: "Store", target: "/store" });
  }
  const whatsappNumber = settings?.general.whatsappNumber ?? "";
  const whatsappDigits = whatsappNumber
    ? normalizeWhatsapp(whatsappNumber)
    : null;
  const brandName = settings?.general.brandName ?? "OpenByte Labs";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#eaeaea] bg-[#ffffff]/95 backdrop-blur-md public-header editorial-navbar"
      data-pencil-name="header"
      data-layout="canvas-content"
    >
      <div className="flex w-full flex-col lg:grid lg:h-[68px] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-3 xl:gap-6 px-4 sm:px-6 xl:px-10">
        {/* Top Row on Mobile / Far-Left Brand on Desktop */}
        <div className="flex h-[56px] lg:h-full items-center justify-between lg:justify-start lg:justify-self-start gap-2 sm:gap-4 shrink-0 min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              href="/"
              aria-label={`${brandName}, beranda`}
              className="flex items-center shrink-0"
            >
              <ReferenceImage
                src={
                  settings?.general.logoUrl ?? "/images/openbyte_labs_logo.svg"
                }
                alt={brandName}
                contain
                objectPosition="left center"
                className="w-[140px] min-[375px]:w-[152px] xl:w-[176px] h-[36px] xl:h-[40px] bg-no-repeat bg-contain bg-left shrink-0"
                data-pencil-name="img"
              />
            </Link>
            <span
              className="hidden 2xl:inline-block h-4 w-px bg-[#eaeaea]"
              aria-hidden="true"
            />
            <span className="hidden 2xl:inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.08em] uppercase text-[#52525b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#82b440]" />
              Engineering Studio
            </span>
          </div>

          {/* Compact CTA for mobile/tablet top bar */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <Link
              href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "/konsultasi"}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] bg-[#18181a] px-3 sm:px-3.5 py-1.5 text-[12px] font-semibold text-white no-underline transition-colors hover:bg-[#242427] whitespace-nowrap"
            >
              <span>{whatsappDigits ? "WhatsApp" : "Konsultasi"}</span>
              <span className="symbol text-[14px] text-[#e2e89d]" aria-hidden="true">
                arrow_outward
              </span>
            </Link>
          </div>
        </div>

        {/* Center Navigation: Balanced Wide Track on Desktop, Edge-to-Edge Strip on Mobile */}
        {menuItems.length ? (
          <PublicHeaderNav>
            {menuItems.map((item) => (
              <NavLink
                key={`${item.target}:${item.label}`}
                href={item.target}
                className="shrink-0 min-h-[34px] inline-flex items-center justify-center rounded-[7px] px-2.5 sm:px-3.5 lg:px-2 xl:px-3.5 2xl:px-4 py-1.5 transition-colors"
                data-pencil-name={item.label}
              >
                <span
                  className="text-[12px] sm:text-[13px] lg:text-[12px] xl:text-[13px] leading-none text-[#52525b] font-medium whitespace-nowrap"
                  data-pencil-name={item.label}
                  data-text="true"
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </PublicHeaderNav>
        ) : null}

        {/* Far-Right Actions on Desktop */}
        <div
          className="hidden lg:flex lg:col-start-3 lg:justify-self-end items-center gap-2 xl:gap-3 shrink-0 header-actions"
          data-pencil-name="div"
        >
          {whatsappDigits ? (
            <Link
              href={`https://wa.me/${whatsappDigits}`}
              aria-label="Hubungi Kami"
              title="Hubungi Kami"
              className="inline-flex min-h-[38px] items-center gap-2 rounded-[9px] border border-[#eaeaea] bg-white px-2.5 xl:px-4 py-1.5 text-[13px] font-medium text-[#18181a] transition-colors hover:bg-[#f0f0f0]"
              data-pencil-name="a"
            >
              <span
                className="symbol text-[16px] text-[#82b440]"
                aria-hidden="true"
              >
                chat
              </span>
              <span className="hidden xl:inline whitespace-nowrap">
                Hubungi Kami
              </span>
            </Link>
          ) : null}

          <Link
            href="/kalkulator"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[9px] bg-[#18181a] px-3 xl:px-[18px] py-1.5 text-[12px] xl:text-[13px] font-semibold text-white transition-colors hover:bg-[#242427] whitespace-nowrap"
          >
            <span>Simulasi Biaya</span>
            <span className="symbol text-[15px] text-[#e2e89d]" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
