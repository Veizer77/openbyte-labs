import Link from "next/link";
import { NavLink } from "@/components/preview/Controls";
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
      <div className="flex w-full flex-col lg:grid lg:h-[68px] lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4 xl:gap-8 px-4 sm:px-6 lg:px-6 xl:px-10">
        {/* Top Row on Mobile / Far-Left Brand on Desktop */}
        <div className="flex h-[56px] lg:h-full items-center justify-between lg:justify-start lg:justify-self-start gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              aria-label={`${brandName}, beranda`}
              className="flex items-center shrink-0"
            >
              <ReferenceImage
                src={
                  settings?.general.logoUrl ??
                  "/images/OpenByte%20Labs%20Tech%20Logo-1.png"
                }
                alt={brandName}
                contain
                objectPosition="left center"
                className="w-[156px] sm:w-[176px] h-[40px] bg-no-repeat bg-contain bg-left shrink-0"
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
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "/konsultasi"}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[8px] bg-[#18181a] px-3.5 py-1.5 text-[12px] font-semibold text-white no-underline transition-colors hover:bg-[#242427]"
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
          <div className="border-t border-[#eaeaea] lg:border-t-0 py-1.5 lg:py-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:justify-self-center">
            <nav
              aria-label="Navigasi utama"
              className="flex items-center gap-1 lg:gap-1 xl:gap-2 2xl:gap-3 overflow-x-auto no-scrollbar lg:rounded-[10px] lg:border lg:border-[#eaeaea] lg:bg-[#f0f0f0]/75 lg:px-1.5 lg:py-1"
              data-pencil-name="nav"
            >
              {menuItems.map((item) => (
                <NavLink
                  key={`${item.target}:${item.label}`}
                  href={item.target}
                  className="shrink-0 min-h-[36px] lg:min-h-[34px] inline-flex items-center justify-center rounded-[7px] px-3.5 lg:px-3 xl:px-4 py-1.5 transition-colors"
                  data-pencil-name={item.label}
                >
                  <span
                    className="text-[13px] leading-none text-[#52525b] font-medium whitespace-nowrap"
                    data-pencil-name={item.label}
                    data-text="true"
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}

        {/* Far-Right Actions on Desktop */}
        <div
          className="hidden lg:flex lg:col-start-3 lg:justify-self-end items-center gap-2.5 xl:gap-3 shrink-0 header-actions"
          data-pencil-name="div"
        >
          {whatsappDigits ? (
            <Link
              href={`https://wa.me/${whatsappDigits}`}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-[9px] border border-[#eaeaea] bg-white px-3.5 xl:px-4 py-1.5 text-[13px] font-medium text-[#18181a] transition-colors hover:bg-[#f0f0f0]"
              data-pencil-name="a"
            >
              <span
                className="symbol text-[16px] text-[#82b440]"
                aria-hidden="true"
              >
                chat
              </span>
              <span data-text="true" className="whitespace-nowrap">
                Hubungi Kami
              </span>
            </Link>
          ) : null}

          <Link
            href="/kalkulator"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[9px] bg-[#18181a] px-4 xl:px-[18px] py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#242427] whitespace-nowrap"
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
