import Link from "next/link";
import { NavLink } from "@/components/preview/Controls";
import { ReferenceImage } from "./ReferenceImage";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { isPublicNavigationTarget } from "@/lib/public-navigation";

const fallbackNavigation = [
  { label: "Beranda", target: "/" },
  { label: "Proyek Portofolio", target: "/proyek" },
  { label: "Paket Layanan", target: "/paket" },
  { label: "Store", target: "/store" },
  { label: "Kalkulator Estimasi", target: "/kalkulator" },
];

export function PublicFooter({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  const brandName = settings?.general.brandName ?? "OpenByte Labs";
  const preview = process.env.NODE_ENV === "development";
  const contactEmail =
    settings?.general.contactEmail ?? "";
  const whatsappNumber =
    settings?.general.whatsappNumber ?? "";
  const whatsappDigits = whatsappNumber
    ? normalizeWhatsapp(whatsappNumber)
    : null;
  const footerText = settings?.navigation.footerText.trim() ||
    `© ${new Date().getFullYear()} ${brandName}.`;
  const navigationItems = [
    ...(settings?.navigation.menuItems ?? (preview ? fallbackNavigation : [])),
  ];
  if (!navigationItems.some((item) => item.target === "/store")) {
    navigationItems.push({ label: "Store", target: "/store" });
  }
  const menuItems = navigationItems
    .filter((item) => isPublicNavigationTarget(item.target, settings?.trackingEnabled ?? false))
    .slice(0, 8);

  return (
    <footer
      className={
        "box-border w-full h-fit shrink-0 [box-shadow:0px_-1px_0px_#eaeaea] flex flex-col gap-0 justify-start items-center bg-[#ffffff] relative [z-index:1] mt-auto"
      }
      data-pencil-name={"footer"}
    >
      <div
        className={
          "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-[24px] px-4 sm:px-6 lg:px-8 pt-12 pb-8 justify-start items-stretch"
        }
        data-pencil-name={"div"}
      >
        <div
          className={
            "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-start items-start"
          }
          data-pencil-name={"div"}
        >
          {/* Column 1: Brand & Status */}
          <div
            className={
              "box-border w-full h-auto flex flex-col gap-0 justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"div"}
            >
              <ReferenceImage
                src={"/brand/openbyte-labs-square-icon-1-1-logo-only.svg"}
                alt={brandName}
                contain={true}
                className={
                  "box-border w-[32px] shrink-0 h-[32px] bg-no-repeat bg-contain bg-center rounded-[8px]"
                }
                data-pencil-name={"img"}
              />
              <div
                className={
                  "box-border min-w-0 flex-1 min-h-[34px] h-auto flex flex-col gap-[2px] justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "text-[18px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                  }
                  data-pencil-name={brandName}
                  data-text="true"
                >
                  {brandName}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                  }
                  data-pencil-name={"WEBSITE, APLIKASI & SISTEM INFORMASI"}
                  data-text="true"
                >
                  {"WEBSITE, APLIKASI & SISTEM INFORMASI"}
                </div>
              </div>
            </div>
            <div
              className={"box-border w-full h-[8px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
              }
                data-pencil-name={"Layanan perangkat lunak sesuai ruang lingkup proyek."}
              data-text="true"
            >
                {"Layanan perangkat lunak sesuai ruang lingkup proyek."}
            </div>
            <div
              className={"box-border w-full h-[12px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "box-border w-fit max-w-full h-fit flex flex-row gap-[8px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
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
                  "text-[11px]/[14px] box-border min-w-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                }
                data-pencil-name={"Layanan perangkat lunak & konsultasi proyek"}
                data-text="true"
              >
                {"Layanan perangkat lunak & konsultasi proyek"}
              </div>
            </div>
          </div>

          {/* Column 2: Direct Communication */}
          <div
            className={
              "box-border w-full h-auto flex flex-col gap-[12px] justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <div
              className={
                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"DIRECT COMMUNICATION"}
              data-text="true"
            >
              {"DIRECT COMMUNICATION"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
              }
              data-pencil-name={"ul"}
            >
              {contactEmail ? <div
                className={
                  "box-border w-full min-h-[24px] h-auto flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"li"}
              >
                <div
                  className={
                    "text-[16px]/[24px] box-border shrink-0 text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"mail"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"mail"}
                </div>
                <a
                  href={`mailto:${contactEmail}`}
                  className="min-w-0 break-all text-[13px]/[18px] font-[var(--font-inter),system-ui,sans-serif] font-medium text-[#52525b]"
                >
                  {contactEmail}
                </a>
              </div> : null}
              {whatsappNumber ? <div
                className={
                  "box-border w-full min-h-[24px] h-auto flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"li"}
              >
                <div
                  className={
                    "text-[16px]/[24px] box-border shrink-0 text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"call"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"call"}
                </div>
                {whatsappDigits ? (
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    className="min-w-0 text-[13px]/[18px] font-[var(--font-inter),system-ui,sans-serif] font-medium text-[#52525b]"
                  >
                    {whatsappNumber}
                  </a>
                ) : <span>{whatsappNumber}</span>}
              </div> : null}
              {settings?.general.address ? <p className="m-0 text-[13px] leading-5 text-[#52525b]">{settings.general.address}</p> : null}
              {settings?.general.socialLinks.length ? (
                <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
                  {settings.general.socialLinks.map((item, index) => (
                    <li key={`${item.url}-${index}`}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-[#52525b] underline underline-offset-2">{item.label}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* Column 3: Sitemap & Nav */}
          <div
            className={
              "box-border w-full h-auto flex flex-col gap-[12px] justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <div
              className={
                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"SITEMAP & SERVIS"}
              data-text="true"
            >
              {"SITEMAP & SERVIS"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
              }
              data-pencil-name={"ul"}
            >
              {menuItems.map((item, index) => (
                <div key={`${item.target}:${index}`} className="box-border flex min-h-[18px] h-auto w-full flex-col items-start justify-start">
                  <NavLink
                    href={item.target}
                    className="text-[13px]/[18px] font-[var(--font-inter),system-ui,sans-serif] font-medium text-[#52525b]"
                    data-pencil-name={item.label}
                    data-text="true"
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Infrastructure & Delivery */}
          <div
            className={
              "box-border w-full h-auto flex flex-col gap-[12px] justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <div
              className={
                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"SEBELUM MEMULAI PROYEK"}
              data-text="true"
            >
              {"SEBELUM MEMULAI PROYEK"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                }
                  data-pencil-name={"Ruang Lingkup"}
                data-text="true"
              >
                  {"Ruang Lingkup"}
              </div>
              <div
                className={"box-border w-full h-[4px] shrink-0"}
                data-pencil-name={"spacer"}
              ></div>
              <div
                className={
                  "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                }
                data-pencil-name={"Bahas kebutuhan, ruang lingkup, dan estimasi proyek."}
                data-text="true"
              >
                {"Bahas kebutuhan, ruang lingkup, dan estimasi proyek."}
              </div>
              <div
                className={"box-border w-full h-[8px] shrink-0"}
                data-pencil-name={"spacer"}
              ></div>
              <Link
                href={"/konsultasi"}
                className={
                  "box-border w-fit max-w-full min-h-[20px] h-auto flex flex-row gap-[4px] justify-start items-center hover:opacity-80 transition-opacity"
                }
                data-pencil-name={"a"}
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-pencil-name={"Ajukan konsultasi"}
                  data-text="true"
                >
                  {"Ajukan konsultasi"}
                </div>
                <div
                  className={
                    "text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"arrow_forward"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"arrow_forward"}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div
          className={
            "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_-1px_0px_#f0f0f0)] flex flex-col sm:flex-row gap-[12px] pt-6 justify-between items-center border-t border-[#f0f0f0]"
          }
          data-pencil-name={"div"}
        >
          <div
            className={
              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-center sm:text-left"
            }
            data-pencil-name={footerText}
            data-text="true"
          >
            {footerText}
          </div>
          <div
            className={
              "box-border w-full sm:w-fit shrink-0 h-fit flex flex-row flex-wrap gap-x-[20px] gap-y-2 justify-center sm:justify-end items-center"
            }
            data-pencil-name={"div"}
          >
            <NavLink
              href={"/kebijakan-privasi"}
              className={
                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap] hover:text-[#18181a]"
              }
              data-pencil-name={"Privacy Policy"}
              data-text="true"
            >
              {"Privacy Policy"}
            </NavLink>
            <NavLink
              href="/ketentuan-layanan"
              className="text-[11px]/[14px] font-medium tracking-[0.22px] text-[#52525b] hover:text-[#18181a]"
            >
              Ketentuan
            </NavLink>
            <NavLink
              href="/tentang-kami"
              className="text-[11px]/[14px] font-medium tracking-[0.22px] text-[#52525b] hover:text-[#18181a]"
            >
              Tentang
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
