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
  const whatsappNumber =
    settings?.general.whatsappNumber ?? "";
  const whatsappDigits = whatsappNumber
    ? normalizeWhatsapp(whatsappNumber)
    : null;
  return (
    <header
      className={
        "box-border w-full h-fit [box-shadow:0px_1px_8px_#0000000a] [backdrop-filter:blur(12px)] fixed top-0 left-0 right-0 flex flex-col gap-0 justify-start items-center bg-[#ffffffe6] [z-index:50] public-header"
      }
      data-pencil-name={"header"}
      data-layout="canvas-content"
    >
      <div
        className={
          "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-[64px] shrink-0 flex flex-row gap-[12px] px-4 sm:px-6 lg:px-8 justify-between items-center"
        }
        data-pencil-name={"div"}
        data-responsive="flow"
      >
        <Link
          href="/"
          aria-label={`${settings?.general.brandName ?? "OpenByte Labs"}, beranda`}
        >
          <ReferenceImage
            src={settings?.general.logoUrl ?? "/images/OpenByte%20Labs%20Tech%20Logo-1.png"}
            alt={settings?.general.brandName ?? "OpenByte Labs"}
            contain
            objectPosition="left center"
            className={
              "box-border w-[193px] shrink-0 h-[49px] bg-no-repeat bg-contain bg-left"
            }
            data-pencil-name={"img"}
          />
        </Link>
        <div
          className={
            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[0px_8px] justify-center items-center"
          }
          data-pencil-name={"div"}
        >
          {menuItems.length ? <nav
            className={
              "box-border w-fit shrink-0 h-[40px] flex flex-row gap-[2px] p-[4px] justify-start items-center bg-[#F4F4F5] rounded-[12px]"
            }
            data-pencil-name={"nav"}
          >
            {menuItems.map((item) => (
              <NavLink
                key={`${item.target}:${item.label}`}
                href={item.target}
                className="box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_14px] justify-center items-center rounded-[8px] transition-colors"
                data-pencil-name={item.label}
              >
                <div
                  className="text-[13px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  data-pencil-name={item.label}
                  data-text="true"
                >
                  {item.label}
                </div>
              </NavLink>
            ))}
          </nav> : null}
        </div>
        <div
          className={
            "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center header-actions"
          }
          data-pencil-name={"div"}
        >
          {preview ? <div
            className={
              "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[4px_10px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
            }
            data-pencil-name={"div"}
          >
            <div
              className={
                "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
              }
              data-pencil-name={"span"}
            ></div>
            <div
              className={
                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"Preview development"}
              data-text="true"
            >
              {"Preview development"}
            </div>
          </div> : null}
          {whatsappDigits ? <Link
            href={`https://wa.me/${whatsappDigits}`}
            className={
              "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_4px_#0000000f] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#ffffff] rounded-[9999px]"
            }
            data-pencil-name={"a"}
          >
            <div
              className={
                "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
              }
              data-pencil-name={"chat"}
              data-text="true"
              aria-hidden="true"
            >
              {"chat"}
            </div>
            <div
              className={
                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
              }
              data-pencil-name={"Hubungi Kami"}
              data-text="true"
            >
              {"Hubungi Kami"}
            </div>
          </Link> : null}
          {preview ? <div
            className={
              "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[0px_0px_0px_4px] justify-start items-center"
            }
            data-pencil-name={"div"}
          >
            <ReferenceImage
              src={"/images/5f9e6a2ac345b8dc.png"}
              alt={"OpenByte Labs"}
              contain={false}
              className={
                "box-border w-[32px] shrink-0 h-[32px]  bg-no-repeat bg-cover bg-center rounded-[9999px]"
              }
              data-pencil-name={"img"}
            />
          </div> : null}
        </div>
      </div>
    </header>
  );
}
