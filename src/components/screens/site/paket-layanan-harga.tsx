// Ported from prototype/stitch/site/paket-layanan-harga.html. Prototype remains read-only.
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  UiAction,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import { normalizeWhatsapp } from "@/lib/whatsapp";

export default function SitePaketLayananHarga({
  catalog,
}: {
  catalog?: PublicCatalog;
} = {}) {
  const whatsappNumber = catalog?.settings?.general.whatsappNumber ?? "";
  const whatsappDigits = whatsappNumber ? normalizeWhatsapp(whatsappNumber) : null;
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Halo OpenByte Labs, saya ingin mendiskusikan paket layanan.")}`
    : "/konsultasi";

  return (
    <ScreenState screen={"site/paket-layanan-harga"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 02 - Paket Layanan & Harga"}
        data-screen={"site/paket-layanan-harga"}
        id="konten"
        tabIndex={-1}
      >
        <PublicHeader settings={catalog?.settings} />
        <main
          className={
            "box-border w-full flex-1 flex flex-col gap-0 pt-[72px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-8 px-4 sm:px-6 lg:px-8 justify-start items-stretch"
            }
            data-pencil-name={"div"}
          >
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end py-2"
              }
              data-pencil-name={"section"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-full max-w-[672px] h-auto flex flex-col gap-[4px] justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
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
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={
                      "KATALOG RESMI & PENAWARAN TERSTANDAR PRD"
                    }
                    data-text="true"
                  >
                    {"KATALOG RESMI & PENAWARAN TERSTANDAR PRD V1.1"}
                  </div>
                </div>
                <h1
                  className={
                    "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                  }
                  data-pencil-name={"Pilihan Paket Layanan & Investasi Sistem"}
                  data-text="true"
                  data-heading="true"
                >
                  {"Pilihan Paket Layanan & Investasi Sistem"}
                </h1>
                <div
                  className={
                    "text-[14px]/[23px] box-border w-full h-[45.5px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-pencil-name={"Transparansi spesifikasi teknis, jangka "}
                  data-text="true"
                >
                  {
                    "Transparansi spesifikasi teknis, jangka waktu kerja terjamin, serta kuota revisi definitif tanpa biaya tersembunyi. Didukung standar arsitektur modular, audit keamanan, dan jaminan purna jual."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[6px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[10px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"verified_user"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"verified_user"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Garansi Purna Jual"}
                      data-text="true"
                    >
                      {"Garansi Purna Jual"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"30 Hari Bug-Free"}
                      data-text="true"
                    >
                      {"30 Hari Bug-Free"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[10px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"contract_edit"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"contract_edit"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Legalitas Kerja"}
                      data-text="true"
                    >
                      {"Legalitas Kerja"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"SLA & SPK Resmi"}
                      data-text="true"
                    >
                      {"SLA & SPK Resmi"}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-4"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] order-1"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"TIER 01 • WEB PRESENTASI"}
                      data-text="true"
                    >
                      {"TIER 01 • WEB PRESENTASI"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 7 Hari"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Estimasi 7 Hari"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[66px] shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Starter UMKM & Bisnis"}
                      data-text="true"
                    >
                      {"Starter UMKM & Bisnis"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Landing page konversi tinggi dengan arsi"
                      }
                      data-text="true"
                    >
                      {
                        "Landing page konversi tinggi dengan arsitektur modern & loading sub-detik."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[72px] shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={"box-border w-full h-[44px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border absolute left-0 top-[24px] text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap] [z-index:0]"
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          "text-[40px]/[44px] box-border absolute left-[19.31px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left [white-space:nowrap] [z-index:1]"
                        }
                        data-pencil-name={"1.000.000"}
                        data-text="true"
                      >
                        {"1.000.000"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Investasi awal • One-time payment"}
                      data-text="true"
                    >
                      {"Investasi awal • One-time payment"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Revisi Gratis"}
                        data-text="true"
                      >
                        {"Revisi Gratis"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"2x Sesi"}
                        data-text="true"
                      >
                        {"2x Sesi"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Ekstra Revisi"}
                        data-text="true"
                      >
                        {"Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 100.000/sesi"}
                        data-text="true"
                      >
                        {"Rp 100.000/sesi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"SPESIFIKASI DELIVERABLE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI DELIVERABLE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Landing page / profil instansi hingga 5 "
                        }
                        data-text="true"
                      >
                        {
                          "Landing page / profil instansi hingga 5 halaman modular"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Desain responsif mobile-first & ultra-fa"
                        }
                        data-text="true"
                      >
                        {
                          "Desain responsif mobile-first & ultra-fast Core Web Vitals"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Integrasi tombol interaktif WhatsApp Dir"
                        }
                        data-text="true"
                      >
                        {
                          "Integrasi tombol interaktif WhatsApp Direct order router"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "SEO on-page dasar (Schema JSON-LD, OpenG"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "SEO on-page dasar (Schema JSON-LD, OpenGraph, Sitemap)"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Setup domain, DNS management, & SSL Clou"
                        }
                        data-text="true"
                      >
                        {"Setup domain, DNS management, & SSL Cloudflare"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={"/pesan?paket=starter-umkm"}
                    className={
                      "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Starter"}
                      data-text="true"
                    >
                      {"Pilih Paket Starter"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
              <div
                className={
                  "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] order-3"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"TIER 03 • MULTIPLATFORM"}
                      data-text="true"
                    >
                      {"TIER 03 • MULTIPLATFORM"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 30 Hari"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Estimasi 30 Hari"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[66px] shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Mobile Application Flutter"}
                      data-text="true"
                    >
                      {"Mobile Application Flutter"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Aplikasi ponsel berperforma 60fps dengan"
                      }
                      data-text="true"
                    >
                      {
                        "Aplikasi ponsel berperforma 60fps dengan kemampuan sinkronisasi offline-first."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[72px] shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={"box-border w-full h-[44px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border absolute left-0 top-[24px] text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap] [z-index:0]"
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          "text-[40px]/[44px] box-border absolute left-[19.31px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left [white-space:nowrap] [z-index:1]"
                        }
                        data-pencil-name={"4.500.000"}
                        data-text="true"
                      >
                        {"4.500.000"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Siap rilis produksi Android"}
                      data-text="true"
                    >
                      {"Siap rilis produksi Android"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Revisi Gratis"}
                        data-text="true"
                      >
                        {"Revisi Gratis"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"4x Sesi"}
                        data-text="true"
                      >
                        {"4x Sesi"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Ekstra Revisi"}
                        data-text="true"
                      >
                        {"Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 300.000/sesi"}
                        data-text="true"
                      >
                        {"Rp 300.000/sesi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"SPESIFIKASI MOBILE NATIVE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI MOBILE NATIVE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Aplikasi Android native-feel dibangun de"
                        }
                        data-text="true"
                      >
                        {
                          "Aplikasi Android native-feel dibangun dengan Flutter & Dart"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Arsitektur offline-first berbasis local "
                        }
                        data-text="true"
                      >
                        {
                          "Arsitektur offline-first berbasis local database SQLite / Hive"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "Akses hardware teruji: Geolocation GPS &"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Akses hardware teruji: Geolocation GPS & integrasi modul kamera"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "Integrasi REST API backend, token refres"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Integrasi REST API backend, token refresh, & data sync queue"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "Build APK produksi tersign & panduan pub"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Build APK produksi tersign & panduan publish Google Play Store"
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={"/pesan?paket=mobile-flutter"}
                    className={
                      "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Mobile App"}
                      data-text="true"
                    >
                      {"Pilih Paket Mobile App"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
              <div
                className={
                  "box-border w-full h-auto [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden relative order-2 lg:-translate-y-2"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[224px] h-[224px] [filter:blur(32px)] absolute right-[-40px] top-[-96px] bg-[#e1e89c26] rounded-[50%] [z-index:0]"
                  }
                  data-pencil-name={"div"}
                ></div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start relative [z-index:1]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[139.75px] shrink-0 h-[24px] flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e2e89d] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"star"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"star"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.28px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Paling Populer"}
                        data-text="true"
                      >
                        {"Paling Populer"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#242427] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 21 Hari"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Estimasi 21 Hari"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[66px] shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "text-[20px]/[26px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Sistem Informasi / Instansi"}
                      data-text="true"
                    >
                      {"Sistem Informasi / Instansi"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Solusi operasional otomatis, basis data "
                      }
                      data-text="true"
                    >
                      {
                        "Solusi operasional otomatis, basis data relasional stabil, dan kontrol akses berjenjang."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[72px] shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={"box-border w-full h-[44px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border absolute left-0 top-[24px] text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap] [z-index:0]"
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          "text-[40px]/[44px] box-border absolute left-[19.31px] top-0 text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left [white-space:nowrap] [z-index:1]"
                        }
                        data-pencil-name={"3.500.000"}
                        data-text="true"
                      >
                        {"3.500.000"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={
                        "Direkomendasikan untuk Efisiensi Bisnis"
                      }
                      data-text="true"
                    >
                      {"Direkomendasikan untuk Efisiensi Bisnis"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[8px] justify-start items-start bg-[#242427] rounded-[8px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Kuota Revisi Gratis"}
                        data-text="true"
                      >
                        {"Kuota Revisi Gratis"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"3x Sesi Penuh"}
                        data-text="true"
                      >
                        {"3x Sesi Penuh"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[34px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Biaya Ekstra Revisi"}
                        data-text="true"
                      >
                        {"Biaya Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 250.000/sesi"}
                        data-text="true"
                      >
                        {"Rp 250.000/sesi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"SPESIFIKASI ARSITEKTUR CORE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI ARSITEKTUR CORE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"verified"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "Database relasional terintegrasi ACID (P"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Database relasional terintegrasi ACID (PostgreSQL / Supabase)"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={"box-border w-full h-[36px] shrink-0 relative"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border absolute left-0 top-[2px] text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"verified"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[calc(100%-26px)] h-[36px] absolute left-[26px] top-0 text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [z-index:1]"
                        }
                        data-pencil-name={
                          "Manajemen otentikasi multi-role RBAC (Su"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Manajemen otentikasi multi-role RBAC (SuperAdmin, Staff, Client)"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"verified"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Dashboard admin analitik komprehensif & "
                        }
                        data-text="true"
                      >
                        {
                          "Dashboard admin analitik komprehensif & KPI metrik visual"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"verified"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Engine ekspor laporan PDF terstruktur & "
                        }
                        data-text="true"
                      >
                        {
                          "Engine ekspor laporan PDF terstruktur & spreadsheet Excel"
                        }
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-[26px] shrink-0 flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"verified"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Audit trail log aktivitas user & mitigas"
                        }
                        data-text="true"
                      >
                        {
                          "Audit trail log aktivitas user & mitigasi data rollback"
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start relative [z-index:2]"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={"/pesan?paket=sistem-informasi"}
                    className={
                      "box-border w-full h-[52px] shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-row gap-[7.99px] p-[14px_16px] justify-center items-center bg-[#e2e89d] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Sistem Informasi"}
                      data-text="true"
                    >
                      {"Pilih Paket Sistem Informasi"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"bolt"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"bolt"}
                    </div>
                  </Link>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch py-2"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"timer"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"timer"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[42px] flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Timeline Presisi"}
                    data-text="true"
                  >
                    {"Timeline Presisi"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={
                      "Siklus sprint terpantau via portal live-"
                    }
                    data-text="true"
                  >
                    {
                      "Siklus sprint terpantau via portal live-tracking real-time."
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"security"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"security"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-1 h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Kepemilikan Penuh"}
                    data-text="true"
                  >
                    {"Kepemilikan Penuh"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Seluruh source code repository diserahte"
                    }
                    data-text="true"
                  >
                    {
                      "Seluruh source code repository diserahterimakan seutuhnya."
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"support_agent"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"support_agent"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-1 h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Konsultasi Teknis"}
                    data-text="true"
                  >
                    {"Konsultasi Teknis"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Dukungan arsitektur langsung oleh Senior"
                    }
                    data-text="true"
                  >
                    {
                      "Dukungan arsitektur langsung oleh Senior System Specialist."
                    }
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[12px] overflow-hidden"
              }
              data-pencil-name={"section"}
              data-section-padding="true"
              data-table-scroll="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[54px] flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"FLEKSIBILITAS SKALABILITAS"}
                    data-text="true"
                  >
                    {"FLEKSIBILITAS SKALABILITAS"}
                  </div>
                  <h2
                    className={
                      "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left [white-space:nowrap] m-0"
                    }
                    data-pencil-name={"Katalog Add-on Layanan Tambahan"}
                    data-text="true"
                    data-heading="true"
                  >
                    {"Katalog Add-on Layanan Tambahan"}
                  </h2>
                </div>
                <div
                  className={
                    "text-[13px]/[18px] box-border w-[384px] shrink-0 h-[36px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-pencil-name={"Tingkatkan kapabilitas sistem Anda sesua"}
                  data-text="true"
                  data-responsive="fixed"
                >
                  {
                    "Tingkatkan kapabilitas sistem Anda sesuai kebutuhan operasional dan ketersediaan sumber daya internal."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-col gap-0 justify-start items-start overflow-hidden"
                }
                data-pencil-name={"table"}
                role="table"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start bg-[#f0f0f0]"
                  }
                  data-pencil-name={"tr"}
                >
                  <div
                    className={
                      "box-border w-[268.58px] shrink-0 h-fit flex flex-col gap-0 p-[14px_12px] justify-center items-start rounded-[8px_0px_0px_8px]"
                    }
                    data-pencil-name={"LAYANAN TAMBAHAN"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"LAYANAN TAMBAHAN"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[821.69px] shrink-0 h-fit flex flex-col gap-0 p-[14px_12px] justify-center items-start"
                    }
                    data-pencil-name={"CAKUPAN TEKNIS & DESKRIPSI PEKERJAAN"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"CAKUPAN TEKNIS & DESKRIPSI PEKERJAAN"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[122.3px] shrink-0 h-fit flex flex-col gap-0 p-[14px_12px] justify-center items-start"
                    }
                    data-pencil-name={"INVESTASI"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"INVESTASI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[131.44px] shrink-0 h-fit flex flex-col gap-0 p-[14px_12px] justify-center items-end rounded-[0px_8px_8px_0px]"
                    }
                    data-pencil-name={"TINDAKAN"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-right [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"TINDAKAN"}
                    </div>
                  </div>
                </div>
                <DataRows
                  texts={[
                    "build    Maintenance Bulanan      Pemantauan proaktif, penanganan bug fixing operasional, automated database backup berkala, dan update library minor.     Rp 150.000   / bulan      Pilih Add-on   add",
                    "workspace_premium     Maintenance Tahunan    Hemat 17%        Semua fitur paket bulanan ditambah jalur prioritas penanganan insiden 24/7, review keamanan per kuartal, dan alokasi resource siaga.     Rp 1.500.000   / tahun      Pilih Add-on   add",
                    "cast_for_education    Pelatihan Admin & Operator      Sesi pelatihan interaktif komprehensif selama 2 jam (Google Meet/Zoom), simulasi skenario riil, panduan booklet PDF, & rekaman video.     Rp 250.000   / sesi transfer ilmu      Pilih Add-on   add",
                    "dns    Setup Domain & Cloud Server      Penyusunan arsitektur Docker containerized pada cloud provider (Render / VPS Ubuntu), konfigurasi SSL/TLS, edge caching, & Cloudflare firewall.     Rp 200.000   / instalasi setup      Pilih Add-on   add",
                  ]}
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"tbody"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start"
                    }
                    data-pencil-name={"tr"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[22px_12px_22.5px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "box-border w-[244.58px] h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"build"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"build"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Maintenance Bulanan"}
                          data-text="true"
                        >
                          {"Maintenance Bulanan"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[821.69px] shrink-0 h-[76.5px] flex flex-col gap-0 p-[16px_12px] justify-center items-start"
                      }
                      data-pencil-name={
                        "Pemantauan proaktif, penanganan bug fixi"
                      }
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {
                          "Pemantauan proaktif, penanganan bug fixing operasional, automated database backup berkala, dan update library minor."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[122.3px] shrink-0 h-fit flex flex-col gap-0 p-[21px_12px_21.5px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 150.000"}
                        data-text="true"
                      >
                        {"Rp 150.000"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"/ bulan"}
                        data-text="true"
                      >
                        {"/ bulan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[16px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <UiAction
                        label={"Pilih Add-on"}
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border w-[65.44px] shrink-0 h-[32px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right"
                          }
                          data-pencil-name={"Pilih Add-on"}
                          data-text="true"
                        >
                          {"Pilih Add-on"}
                        </div>
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                    }
                    data-pencil-name={"tr"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[25px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[29.63px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"workspace_premium"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"workspace_premium"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] p-[0px_65.68px_0px_0px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Maintenance Tahunan"}
                            data-text="true"
                          >
                            {"Maintenance Tahunan"}
                          </div>
                          <div
                            className={
                              "box-border w-fit h-[18px] shrink-0 flex flex-col gap-0 p-[0px_8px_0px_16px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                            }
                            data-pencil-name={"Hemat 17%"}
                          >
                            <div
                              className={
                                "text-[10px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Hemat 17%"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[821.69px] shrink-0 h-[87px] flex flex-col gap-0 p-[16px_12px] justify-center items-start"
                      }
                      data-pencil-name={
                        "Semua fitur paket bulanan ditambah jalur"
                      }
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[797.69px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-text="true"
                      >
                        {
                          "Semua fitur paket bulanan ditambah jalur prioritas penanganan insiden 24/7, review keamanan per kuartal, dan alokasi resource siaga."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[122.3px] shrink-0 h-fit flex flex-col gap-0 p-[16px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border w-[77.08px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left"
                        }
                        data-pencil-name={"Rp 1.500.000"}
                        data-text="true"
                      >
                        {"Rp 1.500.000"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"/ tahun"}
                        data-text="true"
                      >
                        {"/ tahun"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[21.5px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <UiAction
                        label={"Pilih Add-on"}
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border w-[65.44px] shrink-0 h-[32px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right"
                          }
                          data-pencil-name={"Pilih Add-on"}
                          data-text="true"
                        >
                          {"Pilih Add-on"}
                        </div>
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                    }
                    data-pencil-name={"tr"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[24.5px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "box-border w-[244.58px] h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"cast_for_education"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"cast_for_education"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Pelatihan Admin & Operator"}
                          data-text="true"
                        >
                          {"Pelatihan Admin & Operator"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[821.69px] shrink-0 h-[81px] flex flex-col gap-0 p-[16px_12px] justify-center items-start"
                      }
                      data-pencil-name={
                        "Sesi pelatihan interaktif komprehensif s"
                      }
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[797.69px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-text="true"
                      >
                        {
                          "Sesi pelatihan interaktif komprehensif selama 2 jam (Google Meet/Zoom), simulasi skenario riil, panduan booklet PDF, & rekaman video."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[122.3px] shrink-0 h-fit flex flex-col gap-0 p-[16px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 250.000"}
                        data-text="true"
                      >
                        {"Rp 250.000"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                        }
                        data-pencil-name={"/ sesi transfer ilmu"}
                        data-text="true"
                      >
                        {"/ sesi transfer ilmu"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[81px] flex flex-col gap-0 p-[16px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <UiAction
                        label={"Pilih Add-on"}
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border w-[65.44px] shrink-0 h-[32px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right"
                          }
                          data-pencil-name={"Pilih Add-on"}
                          data-text="true"
                        >
                          {"Pilih Add-on"}
                        </div>
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                    }
                    data-pencil-name={"tr"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[22.5px_12px_22px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "box-border w-[244.58px] h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"dns"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"dns"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Setup Domain & Cloud Server"}
                          data-text="true"
                        >
                          {"Setup Domain & Cloud Server"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[821.69px] shrink-0 h-[76.5px] flex flex-col gap-0 p-[16px_12px] justify-center items-start"
                      }
                      data-pencil-name={
                        "Penyusunan arsitektur Docker containeriz"
                      }
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[797.69px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-text="true"
                      >
                        {
                          "Penyusunan arsitektur Docker containerized pada cloud provider (Render / VPS Ubuntu), konfigurasi SSL/TLS, edge caching, & Cloudflare firewall."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[122.3px] shrink-0 h-fit flex flex-col gap-0 p-[21.5px_12px_21px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 200.000"}
                        data-text="true"
                      >
                        {"Rp 200.000"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"/ instalasi setup"}
                        data-text="true"
                      >
                        {"/ instalasi setup"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[16px_12px] justify-start items-start"
                      }
                      data-pencil-name={"td"}
                    >
                      <UiAction
                        label={"Pilih Add-on"}
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border w-[65.44px] shrink-0 h-[32px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right"
                          }
                          data-pencil-name={"Pilih Add-on"}
                          data-text="true"
                        >
                          {"Pilih Add-on"}
                        </div>
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                </DataRows>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-[24px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
              }
              data-pencil-name={"section"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-[768px] h-[106px] shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start mobile-auto-height"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
              >
                <div
                  className={
                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"KEPASTIAN REGULASI KERJA"}
                  data-text="true"
                >
                  {"KEPASTIAN REGULASI KERJA"}
                </div>
                <h2
                  className={
                    "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left [white-space:nowrap] m-0"
                  }
                  data-pencil-name={"Kebijakan Revisi & Standar Garansi Bug 3"}
                  data-text="true"
                  data-heading="true"
                >
                  {"Kebijakan Revisi & Standar Garansi Bug 30 Hari"}
                </h2>
                <div
                  className={
                    "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-pencil-name={"Proses rekayasa perangkat lunak mengacu "}
                  data-text="true"
                >
                  {
                    "Proses rekayasa perangkat lunak mengacu pada batasan ruang lingkup kerja (Scope of Work) yang disepakati guna mencegah terjadinya scope creep dan memastikan ketepatan jadwal rilis."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start"
                }
                data-pencil-name={"div"}
                data-responsive="row"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border [flex:1_1_0] h-[278.25px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-[32px] shrink-0 flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[24px]/[32px] box-border text-[#f97316] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"published_with_changes"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"published_with_changes"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Kerangka Kuota Revisi"}
                      data-text="true"
                    >
                      {"Kerangka Kuota Revisi"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[13px]/[21px] box-border w-full h-[42.25px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Satu sesi revisi didefinisikan sebagai 1"
                    }
                    data-text="true"
                  >
                    {
                      "Satu sesi revisi didefinisikan sebagai 1 batch dokumen feedback yang memuat daftar perbaikan minor. Modifikasi yang tercakup dalam revisi meliputi:"
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"•"}
                        data-text="true"
                      >
                        {"•"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Penyesuaian tata letak (layout), tipogra"
                        }
                        data-text="true"
                      >
                        {
                          "Penyesuaian tata letak (layout), tipografi, dan skema warna tanpa merombak wireframe inti."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"•"}
                        data-text="true"
                      >
                        {"•"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Penggantian aset grafis, teks/konten (co"
                        }
                        data-text="true"
                      >
                        {
                          "Penggantian aset grafis, teks/konten (copywriting), dan label interaktif antarmuka."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"•"}
                        data-text="true"
                      >
                        {"•"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Validasi field form dan responsivitas el"
                        }
                        data-text="true"
                      >
                        {
                          "Validasi field form dan responsivitas elemen pada viewport perangkat spesifik."
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px] justify-center items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={
                      "Catatan: Perubahan logika bisnis fundame"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border w-[606px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-text="true"
                      data-responsive="fixed"
                    >
                      {
                        "Catatan: Perubahan logika bisnis fundamental atau penambahan modul di luar perjanjian awal dihitung sebagai Change Request (CR) terpisah."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[278.25px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-[32px] shrink-0 flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[24px]/[32px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"verified_user"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified_user"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Klausul Garansi Purna Jual 30 Hari"}
                      data-text="true"
                    >
                      {"Klausul Garansi Purna Jual 30 Hari"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[13px]/[21px] box-border w-full h-[42.25px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Terhitung sejak penandatanganan Berita A"
                    }
                    data-text="true"
                  >
                    {
                      "Terhitung sejak penandatanganan Berita Acara Serah Terima (BAST) dan perilisan ke environment production, klien terlindungi klausul perlindungan teknis mutlak:"
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"✓"}
                        data-text="true"
                      >
                        {"✓"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[604.25px] shrink-0 h-[36px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-pencil-name={
                          "Perbaikan 100% bebas biaya untuk anomali"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Perbaikan 100% bebas biaya untuk anomali, crash, query timeout, atau error fungsional yang tidak sesuai spesifikasi."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"✓"}
                        data-text="true"
                      >
                        {"✓"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Respon SLA darurat maksimal 4 jam untuk "
                        }
                        data-text="true"
                      >
                        {
                          "Respon SLA darurat maksimal 4 jam untuk insiden server fatal (down/unresponsive)."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"li"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"✓"}
                        data-text="true"
                      >
                        {"✓"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Audit integritas data dan backup snapsho"
                        }
                        data-text="true"
                      >
                        {
                          "Audit integritas data dan backup snapshot mingguan selama periode masa garansi aktif."
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px] justify-center items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={
                      "Syarat Garansi: Berlaku selama source co"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border w-[606px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-text="true"
                      data-responsive="fixed"
                    >
                      {
                        "Syarat Garansi: Berlaku selama source code tidak dimodifikasi oleh pihak ketiga tanpa otorisasi tertulis pengembang."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] p-[24px] justify-between items-center bg-[#18181a] rounded-[12px]"
              }
              data-pencil-name={"section"}
              data-responsive="row"
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-[576px] shrink-0 h-[90px] flex flex-col gap-0 p-[4px_0px_0px_0px] justify-start items-start mobile-auto-height"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
              >
                <div
                  className={
                    "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"KUSTOMISASI SKALA ENTERPRISE"}
                  data-text="true"
                >
                  {"KUSTOMISASI SKALA ENTERPRISE"}
                </div>
                <div
                  className={"box-border w-full h-[6px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[20px]/[26px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Butuh arsitektur khusus di luar paket st"}
                  data-text="true"
                >
                  {"Butuh arsitektur khusus di luar paket standar?"}
                </div>
                <div
                  className={"box-border w-full h-[4px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-pencil-name={"Konsultasikan kebutuhan infrastruktur mi"}
                  data-text="true"
                >
                  {
                    "Konsultasikan kebutuhan infrastruktur microservices, migrasi database legacy, atau arsitektur multi-tenant dengan estimasi transparan."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-center items-center"
                }
                data-pencil-name={"div"}
              >
                <a
                  href={whatsappUrl}
                  target={whatsappDigits ? "_blank" : undefined}
                  rel={whatsappDigits ? "noopener noreferrer" : undefined}
                  className={
                    "box-border w-fit shrink-0 h-[52px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#242427] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"chat"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Diskusi via WhatsApp"}
                    data-text="true"
                  >
                    {"Diskusi via WhatsApp"}
                  </div>
                </a>
                <Link
                  href={"/konsultasi"}
                  className={
                    "box-border w-fit shrink-0 h-[52px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#e2e89d] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Isi Form Spesifikasi Kustom"}
                    data-text="true"
                  >
                    {"Isi Form Spesifikasi Kustom"}
                  </div>
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"arrow_forward"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"arrow_forward"}
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </main>
        <PublicFooter settings={catalog?.settings} />
      </div>
    </ScreenState>
  );
}
