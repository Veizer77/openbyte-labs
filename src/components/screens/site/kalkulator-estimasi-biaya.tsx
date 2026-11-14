// Ported from prototype/stitch/site/kalkulator-estimasi-biaya.html. Prototype remains read-only.
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
import { getPublicCalculatorConfig } from "@/lib/server/public-calculator";
import {
  CalculatorProvider,
  CalculatorOption,
  CalculatorRadioIndicator,
  CalculatorValue,
  CalculatorItemPrice,
  CalculatorItemDays,
  CalculatorUnits,
  CalculatorBreakdown,
  CalculatorContact,
  CalculatorSend,
  CalculatorExtraItems,
} from "@/components/public/Calculator";
export default async function SiteKalkulatorEstimasiBiaya() {
  let calculatorConfig;
  try {
    calculatorConfig = await getPublicCalculatorConfig();
  } catch {
    return (
      <main id="konten" className="mx-auto my-16 w-full max-w-2xl px-4 sm:px-6">
        <section
          role="alert"
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[#71717a]">
            OpenByte Labs
          </p>
          <h1 className="mb-3 mt-2 text-2xl font-semibold text-[#18181a]">
            Kalkulator sementara tidak tersedia
          </h1>
          <p className="m-0 text-sm leading-6 text-[#52525b]">
            Konfigurasi harga belum dapat dimuat. Tidak ada harga contoh yang
            ditampilkan. Silakan coba lagi nanti atau ajukan konsultasi.
          </p>
          <Link
            href="/konsultasi"
            className="mt-5 inline-flex rounded-lg bg-[#18181a] px-4 py-3 text-sm font-medium text-white"
          >
            Ajukan konsultasi
          </Link>
        </section>
      </main>
    );
  }
  return (
    <ScreenState screen={"site/kalkulator-estimasi-biaya"}>
      <CalculatorProvider config={calculatorConfig}>
        <div
          className={
            "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-clip relative screen public-screen has-editorial-hero"
          }
          data-pencil-name={"Public / 05 - Kalkulator Estimasi Biaya"}
          data-screen={"site/kalkulator-estimasi-biaya"}
          id="konten"
          tabIndex={-1}
        >
          <PublicHeader settings={calculatorConfig.settings} />
          <main
            className={
              "box-border w-full h-fit shrink-0 flex flex-col gap-0 pt-[104px] lg:pt-[68px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
            }
            data-pencil-name={"main"}
          >
            {/* Architectural Header Band */}
            <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
              <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
                <div className="max-w-3xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
                    <span className="h-2 w-2 rounded-full bg-[#82b440]" />
                    <span>Konfigurator Spesifikasi &amp; Anggaran</span>
                  </div>
                  <h1
                    className="text-[32px]/[1.14] sm:text-[42px]/[1.1] lg:text-[48px]/[1.08] text-[#18181a] font-semibold tracking-[-0.03em] m-0"
                    data-heading="true"
                  >
                    Kalkulator Estimasi Biaya Proyek
                  </h1>
                  <p className="text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#52525b] font-normal m-0 max-w-2xl">
                    Susun kombinasi platform, jenis arsitektur, dan modul fungsional untuk melihat simulasi rentang investasi serta durasi pengerjaan secara langsung.
                  </p>
                </div>

                <Link
                  href="/paket"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] border border-[#eaeaea] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0] shrink-0"
                >
                  <span>Bandingkan Paket Standar</span>
                  <span className="symbol text-[16px]" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </section>

            <div
              className={
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-6 px-4 sm:px-6 lg:px-8 pt-8 justify-start items-stretch"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full lg:col-span-7 flex flex-col gap-[24px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <section
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[20px] p-4 sm:p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"section"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-3 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border min-w-0 flex-1 h-fit flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[24px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] flex flex-col gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                            }
                            data-pencil-name={"1"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"1"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                            }
                            data-pencil-name={"Platform Utama"}
                            data-text="true"
                          >
                            {"Platform Utama"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_0px_28px] justify-start items-start"
                          }
                        >
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Pilih media target rilis aplikasi Anda"
                            }
                            data-text="true"
                          >
                            {"Pilih media target rilis aplikasi Anda"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                        }
                        data-pencil-name={"WAJIB"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"WAJIB"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-[12px] items-stretch"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <CalculatorOption
                        itemId={"web"}
                        className={
                          "box-border w-full min-h-[140px] h-full flex flex-col gap-0 p-[20px] justify-start items-start bg-[#e2e2e2] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[32px] h-auto shrink-0 flex flex-row gap-0 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[24px]/[32px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"desktop_windows"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"desktop_windows"}
                          </div>
                          <CalculatorRadioIndicator itemId={"web"} />
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[15px]/[21px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Web Saja"}
                          data-text="true"
                        >
                          {"Web Saja"}
                        </div>
                        <div
                          className={"box-border w-full h-[4px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Responsive Browser"}
                          data-text="true"
                        >
                          {"Responsive Browser"}
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 mt-auto flex flex-row flex-wrap gap-2 p-[4px_0px_0px_0px] justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Termasuk"}
                            data-text="true"
                          >
                            {"Termasuk"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Standar"}
                            data-text="true"
                          >
                            {"Standar"}
                          </div>
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"android"}
                        className={
                          "box-border w-full min-h-[140px] h-full flex flex-col gap-0 p-[20px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[32px] h-auto shrink-0 flex flex-row gap-0 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[24px]/[32px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"phone_android"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"phone_android"}
                          </div>
                          <CalculatorRadioIndicator itemId={"android"} />
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[15px]/[21px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Android Saja"}
                          data-text="true"
                        >
                          {"Android Saja"}
                        </div>
                        <div
                          className={"box-border w-full h-[4px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Native Flutter APK"}
                          data-text="true"
                        >
                          {"Native Flutter APK"}
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 mt-auto flex flex-row flex-wrap gap-2 p-[4px_0px_0px_0px] justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="android" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"android"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"+10-14 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"webandr"}
                        className={
                          "box-border w-full min-h-[140px] h-full flex flex-col gap-0 p-[20px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[32px] h-auto shrink-0 flex flex-row gap-0 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[24px]/[32px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"devices"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"devices"}
                          </div>
                          <CalculatorRadioIndicator itemId={"webandr"} />
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[15px]/[21px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Web + Android"}
                          data-text="true"
                        >
                          {"Web + Android"}
                        </div>
                        <div
                          className={"box-border w-full h-[4px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Cross-platform Apps"}
                          data-text="true"
                        >
                          {"Cross-platform Apps"}
                        </div>
                        <div
                          className={"box-border w-full h-[12px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 mt-auto flex flex-row flex-wrap gap-2 p-[4px_0px_0px_0px] justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="webandr" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"webandr"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"+14-21 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                    </div>
                    <CalculatorExtraItems groupKey="platform" />
                  </section>
                  <section
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"section"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-3 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border min-w-0 flex-1 h-fit flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[24px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] flex flex-col gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                            }
                            data-pencil-name={"2"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"2"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                            }
                            data-pencil-name={"Jenis Solusi Sistem"}
                            data-text="true"
                          >
                            {"Jenis Solusi Sistem"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_0px_28px] justify-start items-start"
                          }
                        >
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Pilih kategori arsitektur aplikasi sesua"
                            }
                            data-text="true"
                          >
                            {
                              "Pilih kategori arsitektur aplikasi sesuai target kebutuhan"
                            }
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                        }
                        data-pencil-name={"WAJIB"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"WAJIB"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-auto shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-[12px] items-stretch"
                        }
                        data-responsive="row"
                      >
                        <CalculatorOption
                          itemId={"landing"}
                          className={
                            "box-border w-full min-h-[118px] h-full flex flex-col gap-[10px] p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-3 justify-between items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border min-w-0 flex-1 h-auto flex flex-col gap-[6px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                                }
                                data-pencil-name={"Landing Page Profil"}
                                data-text="true"
                              >
                                {"Landing Page Profil"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={
                                  "Profil korporat & portfolio showcase int"
                                }
                                data-text="true"
                              >
                                {
                                  "Profil korporat & portfolio showcase interaktif."
                                }
                              </div>
                            </div>
                            <CalculatorRadioIndicator itemId={"landing"} />
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 p-[8px_0px_0px_0px] justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"Harga dari konfigurasi"}
                              data-text="true"
                            >
                              <CalculatorItemPrice itemId="landing" />
                            </div>
                            <CalculatorItemDays
                              itemId={"landing"}
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"5 – 7 Hari"}
                              data-text="true"
                            />
                          </div>
                        </CalculatorOption>
                        <CalculatorOption
                          itemId={"katalog"}
                          className={
                            "box-border w-full min-h-[118px] h-full flex flex-col gap-[10px] p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-3 justify-between items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border min-w-0 flex-1 h-auto flex flex-col gap-[6px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                                }
                                data-pencil-name={"Katalog & Toko WA"}
                                data-text="true"
                              >
                                {"Katalog & Toko WA"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={
                                  "Etalase produk dan checkout otomatis ke "
                                }
                                data-text="true"
                              >
                                {
                                  "Etalase produk dan checkout otomatis ke WhatsApp."
                                }
                              </div>
                            </div>
                            <CalculatorRadioIndicator itemId={"katalog"} />
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 p-[8px_0px_0px_0px] justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"Harga dari konfigurasi"}
                              data-text="true"
                            >
                              <CalculatorItemPrice itemId="katalog" />
                            </div>
                            <CalculatorItemDays
                              itemId={"katalog"}
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"10 – 14 Hari"}
                              data-text="true"
                            />
                          </div>
                        </CalculatorOption>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-[12px] items-stretch"
                        }
                        data-responsive="row"
                      >
                        <CalculatorOption
                          itemId={"sidb"}
                          className={
                            "box-border w-full min-h-[118px] h-full flex flex-col gap-[10px] p-[20px] justify-between items-start bg-[#e2e2e2] rounded-[12px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-3 justify-between items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border min-w-0 flex-1 h-auto flex flex-col gap-[6px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[6px] justify-start items-center"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                                  }
                                  data-pencil-name={
                                    "Sistem Informasi / Web App"
                                  }
                                  data-text="true"
                                >
                                  {"Sistem Informasi / Web App"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#18181a] rounded-[4px]"
                                  }
                                  data-pencil-name={"POPULER"}
                                >
                                  <div
                                    className={
                                      "text-[10px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"POPULER"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={
                                  "Dashboard analitik, manajemen data, dan "
                                }
                                data-text="true"
                              >
                                {
                                  "Dashboard analitik, manajemen data, dan hak akses."
                                }
                              </div>
                            </div>
                            <CalculatorRadioIndicator itemId={"sidb"} />
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 p-[8px_0px_0px_0px] justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"Harga dari konfigurasi"}
                              data-text="true"
                            >
                              <CalculatorItemPrice itemId="sidb" />
                            </div>
                            <CalculatorItemDays
                              itemId={"sidb"}
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"14 – 21 Hari"}
                              data-text="true"
                            />
                          </div>
                        </CalculatorOption>
                        <CalculatorOption
                          itemId={"undangan"}
                          className={
                            "box-border w-full min-h-[118px] h-full flex flex-col gap-[10px] p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-3 justify-between items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border min-w-0 flex-1 h-auto flex flex-col gap-[6px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                                }
                                data-pencil-name={"Undangan Digital"}
                                data-text="true"
                              >
                                {"Undangan Digital"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={
                                  "Reservasi tamu RSVP, galeri musik, dan g"
                                }
                                data-text="true"
                              >
                                {
                                  "Reservasi tamu RSVP, galeri musik, dan gift transfer."
                                }
                              </div>
                            </div>
                            <CalculatorRadioIndicator itemId={"undangan"} />
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 p-[8px_0px_0px_0px] justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"Harga dari konfigurasi"}
                              data-text="true"
                            >
                              <CalculatorItemPrice itemId="undangan" />
                            </div>
                            <CalculatorItemDays
                              itemId={"undangan"}
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={"3 – 5 Hari"}
                              data-text="true"
                            />
                          </div>
                        </CalculatorOption>
                      </div>
                    </div>
                    <CalculatorExtraItems groupKey="productType" />
                  </section>
                  <section
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"section"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-3 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border min-w-0 flex-1 h-fit flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[24px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] flex flex-col gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                            }
                            data-pencil-name={"3"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"3"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                            }
                            data-pencil-name={"Modul Tambahan"}
                            data-text="true"
                          >
                            {"Modul Tambahan"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_0px_28px] justify-start items-start"
                          }
                        >
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Pilih integrasi fitur lanjutan opsional"
                            }
                            data-text="true"
                          >
                            {"Pilih integrasi fitur lanjutan opsional"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                        }
                        data-pencil-name={"OPSIONAL"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"OPSIONAL"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <CalculatorOption
                        itemId={"rbac"}
                        className={
                          "box-border w-full h-auto shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-[14px_16px] sm:p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-row gap-[12px] justify-start items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] mt-0.5 sm:mt-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#000000] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border min-w-0 flex-1 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={"Multi-User RBAC & Autentikasi"}
                              data-text="true"
                            >
                              {"Multi-User RBAC & Autentikasi"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Hierarki hak akses Admin, Operator & Sta"
                              }
                              data-text="true"
                            >
                              {"Hierarki hak akses Admin, Operator & Staff"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row flex-wrap gap-x-[12px] gap-y-1 pl-[32px] sm:pl-[8px] justify-between sm:justify-end items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left sm:text-right"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="rbac" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"rbac"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                            }
                            data-pencil-name={"+3-4 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"gis"}
                        className={
                          "box-border w-full h-auto shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-[14px_16px] sm:p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-row gap-[12px] justify-start items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] mt-0.5 sm:mt-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#000000] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border min-w-0 flex-1 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={"Peta & Geolocation GIS"}
                              data-text="true"
                            >
                              {"Peta & Geolocation GIS"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Visualisasi polygon, radius lokasi & mar"
                              }
                              data-text="true"
                            >
                              {
                                "Visualisasi polygon, radius lokasi & marker peta"
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row flex-wrap gap-x-[12px] gap-y-1 pl-[32px] sm:pl-[8px] justify-between sm:justify-end items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left sm:text-right"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="gis" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"gis"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                            }
                            data-pencil-name={"+5-7 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"laporan"}
                        className={
                          "box-border w-full h-auto shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-[14px_16px] sm:p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-row gap-[12px] justify-start items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] mt-0.5 sm:mt-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#000000] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border min-w-0 flex-1 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={"Export Dokumen PDF & Excel"}
                              data-text="true"
                            >
                              {"Export Dokumen PDF & Excel"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Generator invoice, rekap laporan berkala"
                              }
                              data-text="true"
                            >
                              {
                                "Generator invoice, rekap laporan berkala & watermark"
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row flex-wrap gap-x-[12px] gap-y-1 pl-[32px] sm:pl-[8px] justify-between sm:justify-end items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left sm:text-right"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="laporan" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"laporan"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                            }
                            data-pencil-name={"+2-3 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"wa"}
                        className={
                          "box-border w-full h-auto shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-[14px_16px] sm:p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-row gap-[12px] justify-start items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] mt-0.5 sm:mt-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#000000] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border min-w-0 flex-1 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={"Notifikasi Otomatis WhatsApp"}
                              data-text="true"
                            >
                              {"Notifikasi Otomatis WhatsApp"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Trigger instant reminder & konfirmasi pe"
                              }
                              data-text="true"
                            >
                              {
                                "Trigger instant reminder & konfirmasi pemesanan"
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row flex-wrap gap-x-[12px] gap-y-1 pl-[32px] sm:pl-[8px] justify-between sm:justify-end items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left sm:text-right"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="wa" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"wa"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                            }
                            data-pencil-name={"+3-4 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                      <CalculatorOption
                        itemId={"pay"}
                        className={
                          "box-border w-full h-auto shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3 p-[14px_16px] sm:p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"label"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-row gap-[12px] justify-start items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] mt-0.5 sm:mt-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#000000] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border min-w-0 flex-1 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={
                                "Integrasi Payment Gateway QRIS"
                              }
                              data-text="true"
                            >
                              {"Integrasi Payment Gateway QRIS"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Integrasi Midtrans / Xendit dengan webho"
                              }
                              data-text="true"
                            >
                              {
                                "Integrasi Midtrans / Xendit dengan webhook otomatis"
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row flex-wrap gap-x-[12px] gap-y-1 pl-[32px] sm:pl-[8px] justify-between sm:justify-end items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left sm:text-right"
                            }
                            data-pencil-name={"Harga dari konfigurasi"}
                            data-text="true"
                          >
                            <CalculatorItemPrice itemId="pay" prefix="+" />
                          </div>
                          <CalculatorItemDays
                            itemId={"pay"}
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                            }
                            data-pencil-name={"+3-5 Hari"}
                            data-text="true"
                          />
                        </div>
                      </CalculatorOption>
                    </div>
                    <CalculatorExtraItems groupKey="modules" />
                  </section>
                  <section
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[12px] p-4 sm:p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"section"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start sm:items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full sm:min-w-0 sm:flex-1 h-fit flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full min-h-[24px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[20px] shrink-0 h-[20px] flex flex-col gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                            }
                            data-pencil-name={"4"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"4"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                            }
                            data-pencil-name={"Ekspansi Halaman Tambahan"}
                            data-text="true"
                          >
                            {"Ekspansi Halaman Tambahan"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_0px_28px] justify-start items-start"
                          }
                        >
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Penambahan view interface di luar paket "
                            }
                            data-text="true"
                          >
                            {"Penambahan view interface di luar paket bawaan"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border shrink-0 pl-[28px] sm:pl-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left sm:text-right"
                        }
                        data-pencil-name={"Tarif per halaman dari konfigurasi"}
                        data-text="true"
                      >
                        <CalculatorItemPrice itemId="halaman" suffix=" / halaman" />
                      </div>
                    </div>
                    <CalculatorUnits
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-4 sm:p-[20px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    />
                  </section>
                </div>
                <div
                  className={
                    "box-border w-full lg:col-span-5 self-start lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto no-scrollbar overscroll-contain flex flex-col gap-[20px] p-4 sm:p-[24px] justify-start items-start bg-[#18181a] rounded-[22px] [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] z-10"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_1px_0px_#2e2e32)] flex flex-row flex-wrap gap-2 p-[0px_0px_8px_0px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border min-w-0 flex-1 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[10px] shrink-0 h-[10px] opacity-[0.51] bg-[#82b440] rounded-[50%]"
                        }
                        data-pencil-name={"span"}
                      ></div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[1.1px] text-left"
                        }
                        data-pencil-name={"RINGKASAN ESTIMASI REAL-TIME"}
                        data-text="true"
                      >
                        {"RINGKASAN ESTIMASI REAL-TIME"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border shrink-0 text-[#a8a8ad] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"v1.2"}
                      data-text="true"
                    >
                      {"v1.2"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                      }
                      data-pencil-name={"ESTIMASI INVESTASI PROYEK"}
                      data-text="true"
                    >
                      {"ESTIMASI INVESTASI PROYEK"}
                    </div>
                    <div
                      className={"box-border w-full h-fit shrink-0 flex flex-row flex-wrap items-baseline gap-[6px]"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[22px] sm:text-[18px]/[24px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                      >
                        {"Rp"}
                      </div>
                      <CalculatorValue
                        kind="price"
                        className={
                          "text-[26px]/[32px] min-[400px]:text-[30px]/[36px] sm:text-[36px]/[42px] lg:text-[34px]/[40px] xl:text-[40px]/[44px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[-0.03em] text-left break-words"
                        }
                        data-pencil-name={"2.500.000 - 4.000.000"}
                        data-text="true"
                      />
                    </div>
                    <div
                      className={
                        "box-border w-full h-auto min-h-[20px] shrink-0 flex flex-row gap-[6px] pt-0.5 justify-start items-start sm:items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[14px]/[20px] box-border shrink-0 text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[15px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                        }
                        data-pencil-name={
                          "Rincian penyerahan sesuai penawaran"
                        }
                        data-text="true"
                      >
                        {"Penyerahan dan hak penggunaan dicantumkan di penawaran"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-3 p-[12px] justify-between items-center bg-[#242427] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border min-w-0 flex-1 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181a] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[28px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"schedule"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"schedule"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border min-w-0 flex-1 h-fit flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Estimasi Waktu Pengerjaan"}
                          data-text="true"
                        >
                          {"Estimasi Waktu Pengerjaan"}
                        </div>
                        <CalculatorValue
                          kind="days"
                          className={
                            "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left"
                          }
                          data-pencil-name={"14 - 21 Hari Kerja"}
                          data-text="true"
                        />
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-auto shrink-0 h-auto min-h-[34px] flex flex-col gap-[4px] justify-start items-end"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                        }
                        data-pencil-name={"Metodologi"}
                        data-text="true"
                      >
                        {"Metodologi"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-right"
                        }
                        data-pencil-name={"Estimasi awal"}
                        data-text="true"
                      >
                        {"Estimasi awal"}
                      </div>
                    </div>
                  </div>
                  <CalculatorBreakdown
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  />
                  <CalculatorContact
                    className={
                      "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_-1px_0px_#2e2e32)] flex flex-col gap-[8px] p-[12px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  />
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <CalculatorSend
                      className={
                        "box-border w-full min-h-[56px] h-auto shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[14px_12px] justify-center items-center bg-[#e2e89d] hover:bg-[#d4da8f] active:scale-[0.99] rounded-[12px] cursor-pointer transition-all"
                      }
                      data-pencil-name={"button"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[18px]/[28px] box-border shrink-0 text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"send"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"send"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] sm:text-[14px]/[20px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center"
                        }
                        data-pencil-name={"Kirim Rincian Estimasi ke WhatsApp"}
                        data-text="true"
                      >
                        {"Kirim Rincian Estimasi ke WhatsApp"}
                      </div>
                    </CalculatorSend>
                    <div
                      className={
                        "box-border w-full h-auto min-h-[20px] shrink-0 flex flex-row gap-[6px] justify-center items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border shrink-0 text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"lock"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"lock"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-center"
                        }
                        data-pencil-name={
                          "Konsultasi direct langsung via WhatsApp"
                        }
                        data-text="true"
                      >
                        {"Konsultasi direct langsung via WhatsApp"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full min-h-[178px] h-full [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-4 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"terminal"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"terminal"}
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                      }
                      data-pencil-name={"Ruang lingkup teknis"}
                      data-text="true"
                    >
                      {"Ruang lingkup teknis"}
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[14px]/[20px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Ditenagai stack TypeScript murni, Tailwi"
                      }
                      data-text="true"
                    >
                      {
                        "Pilihan teknologi dan arsitektur dibahas sesuai kebutuhan proyek."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[4px_0px_0px_0px] justify-center items-start"
                    }
                    data-pencil-name={"Sesuai kebutuhan proyek"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                      }
                      data-text="true"
                    >
                      {"Sesuai kebutuhan proyek"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[178px] h-full [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-4 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"shield_with_heart"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"shield_with_heart"}
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                      }
                      data-pencil-name={"Standard Garansi Bug 60 Hari"}
                      data-text="true"
                    >
                      {"Standard Garansi Bug 60 Hari"}
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[14px]/[20px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Setiap delivery disertai garansi hotfix "
                      }
                      data-text="true"
                    >
                      {
                        "Setiap delivery disertai garansi hotfix stabilitas sistem serta pendampingan deploy cloud production."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[4px_0px_0px_0px] justify-center items-start"
                    }
                    data-pencil-name={"Production-Ready Reliability"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                      }
                      data-text="true"
                    >
                      {"Production-Ready Reliability"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[178px] h-full [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-4 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"swap_horiz"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"swap_horiz"}
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                      }
                      data-pencil-name={"Tahapan Pembayaran Termin"}
                      data-text="true"
                    >
                      {"Tahapan Pembayaran Termin"}
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[14px]/[20px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Skema pembayaran fleksibel: DP 40% Kick-"
                      }
                      data-text="true"
                    >
                      {
                        "Skema pembayaran fleksibel: DP 40% Kick-off, 30% Milestone Demo Prototype, 30% Final Production Sign-off."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[4px_0px_0px_0px] justify-center items-start"
                    }
                    data-pencil-name={"Milestone-Driven Security"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                      }
                      data-text="true"
                    >
                      {"Milestone-Driven Security"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <PublicFooter settings={calculatorConfig.settings} />
        </div>
      </CalculatorProvider>
    </ScreenState>
  );
}
