"use client";

// Ported from prototype/stitch/cms/booking-konsultasi.html. Prototype remains read-only.
import { useState } from "react";
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import { UiAction, ScreenState } from "@/components/preview/Controls";

const bookingTabs = ["Daftar Reservasi", "Slot Mingguan", "Tanggal Libur"];

export default function CmsBookingKonsultasi() {
  const [activeBookingTab, setActiveBookingTab] = useState("Daftar Reservasi");
  return (
    <ScreenState screen={"cms/booking-konsultasi"}>
      <div
        className={
          "box-border w-full min-h-screen bg-[#f9f9f9] relative screen admin-screen flex flex-col"
        }
        data-pencil-name={"CMS / 04 - Booking Konsultasi"}
        data-screen={"cms/booking-konsultasi"}
        id="konten"
        tabIndex={-1}
      >
        <AdminSidebar />
        <div
          className={
            "box-border w-full min-h-screen flex flex-col lg:pl-[288px] relative z-0"
          }
          data-pencil-name={"div"}
          data-layout="canvas-content"
        >
          <AdminHeader />
          <main
            className={
              "box-border w-full h-fit flex flex-col gap-0 pt-16 pb-16 bg-[#f9f9f9] relative z-0 flex-1"
            }
            data-pencil-name={"main"}
          >
            <div
              className={
                "box-border w-full max-w-[1920px] mx-auto flex flex-col gap-6 p-4 sm:p-6 lg:p-8 justify-start items-start"
              }
              data-pencil-name={"div"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-between items-end"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-[768px] shrink-0 h-[98px] flex flex-col gap-[4px] justify-start items-start mobile-auto-height"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Admin"}
                      data-text="true"
                    >
                      {"Admin"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[12px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"chevron_right"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"chevron_right"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Operasional Klien"}
                      data-text="true"
                    >
                      {"Operasional Klien"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[12px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"chevron_right"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"chevron_right"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Booking Konsultasi"}
                      data-text="true"
                    >
                      {"Booking Konsultasi"}
                    </div>
                  </div>
                  <h1
                    className={
                      "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                    }
                    data-pencil-name={"Manajemen Booking & Jadwal Konsultasi"}
                    data-text="true"
                    data-heading="true"
                  >
                    {"Manajemen Booking & Jadwal Konsultasi"}
                  </h1>
                  <div
                    className={
                      "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={
                      "Verifikasi reservasi klien, atur link Go"
                    }
                    data-text="true"
                  >
                    {
                      "Tampilan contoh untuk reservasi dan ketersediaan. Data, tautan rapat, dan status slot bukan data operasional."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-[8px] shrink-0 h-[8px] opacity-[0.64] bg-[#82b440] rounded-[50%]"
                    }
                    data-pencil-name={"span"}
                  ></div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[25px] flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[11px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Status mekanisme slot"}
                      data-text="true"
                    >
                      {"Status mekanisme slot"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Belum diverifikasi"}
                      data-text="true"
                    >
                      {"Belum diverifikasi"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#00000008] flex flex-col gap-[16px] p-[16px_20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[0px_0px_4px_0px] justify-between items-center"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <nav
                    className={
                      "box-border w-fit shrink-0 h-[40px] flex flex-row gap-[2px] p-[4px] justify-start items-center bg-[#F4F4F5] rounded-[12px]"
                    }
                    data-pencil-name={"nav"}
                  >
                    {bookingTabs.map((tab) => {
                      const isActive = activeBookingTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveBookingTab(tab)}
                          className={`box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_14px] justify-center items-center rounded-[8px] transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#18181A] [box-shadow:0px_1px_2px_#00000014] text-[#FFFFFF]"
                              : "text-[#52525B] hover:text-[#18181a] hover:bg-[#e4e4e7]"
                          }`}
                          data-pencil-name={tab}
                        >
                          <div
                            className={`text-[13px]/[normal] box-border font-[var(--font-inter),system-ui,sans-serif] text-left [white-space:nowrap] ${
                              isActive ? "font-semibold" : "font-medium"
                            }`}
                            data-pencil-name={tab}
                            data-text="true"
                          >
                            {tab}
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                  <UiAction
                    label={"Refresh Cal.com Sync"}
                    className={
                      "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[6px] p-[8px_12px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"sync"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"sync"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Refresh Cal.com Sync"}
                      data-text="true"
                    >
                      {"Refresh Cal.com Sync"}
                    </div>
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[4px_0px_0px_0px] justify-between items-center"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-col gap-0 p-[4px_12px] justify-center items-center bg-[#18181a] rounded-[9999px]"
                      }
                      data-pencil-name={"Semua (28)"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Semua (28)"}
                      </div>
                    </div>
                    <UiAction
                      label={"Menunggu konfirmasi • data contoh"}
                      className={
                        "box-border w-[167.02px] shrink-0 h-[28px] flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"button"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "box-border w-[6px] shrink-0 h-[6px] bg-[#f97316] rounded-[50%]"
                        }
                        data-pencil-name={"span"}
                      ></div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"Menunggu konfirmasi • data contoh"}
                        data-text="true"
                      >
                        {"Menunggu konfirmasi • data contoh"}
                      </div>
                    </UiAction>
                    <UiAction
                      label={"Konfirmasi • status belum diverifikasi"}
                      className={
                        "box-border w-[115.45px] shrink-0 h-[28px] flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"button"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "box-border w-[6px] shrink-0 h-[6px] bg-[#82b440] rounded-[50%]"
                        }
                        data-pencil-name={"span"}
                      ></div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"Konfirmasi • status belum diverifikasi"}
                        data-text="true"
                      >
                        {"Konfirmasi • status belum diverifikasi"}
                      </div>
                    </UiAction>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-col gap-0 p-[4px_12px] justify-center items-center bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Selesai • status belum diverifikasi"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Selesai • status belum diverifikasi"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-col gap-0 p-[4px_12px] justify-center items-center bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Pembatalan • status belum diverifikasi"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Pembatalan • status belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_8px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"calendar_month"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"calendar_month"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"18 Mei 2026 - 31 Mei 2026"}
                      data-text="true"
                    >
                      {"18 Mei 2026 - 31 Mei 2026"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_4px] justify-center items-start bg-[#ffffff] rounded-[4px]"
                      }
                      data-pencil-name={"WIB"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"WIB"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"arrow_drop_down"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"arrow_drop_down"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
                }
                data-pencil-name={"div"}
                data-responsive="row"
                data-section-padding="true"
              >
                <section
                  className={
                    "box-border xl:col-span-8 flex flex-col gap-[16px] justify-start items-start w-full"
                  }
                  data-pencil-name={"section"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_4px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Daftar Reservasi Konsultasi Masuk"}
                        data-text="true"
                      >
                        {"Daftar Reservasi Konsultasi Masuk"}
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                        }
                        data-pencil-name={"3 Item Prioritas"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"3 Item Prioritas"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"TERURUT WAKTU TERDEKAT"}
                      data-text="true"
                    >
                      {"TERURUT WAKTU TERDEKAT"}
                    </div>
                  </div>
                  <article
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_2px_12px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px] overflow-hidden relative"
                    }
                    data-pencil-name={"article"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-[710px] h-[4px] absolute left-0 top-0 bg-[#f97316] [z-index:0]"
                      }
                      data-pencil-name={"div"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-start relative [z-index:1]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[72px] flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-fit h-[22px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                            }
                            data-pencil-name={"BKG-2605-89FX"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"BKG-2605-89FX"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[174.19px] shrink-0 h-[18px] flex flex-row gap-[6px] p-[2px_10px] justify-start items-center bg-[#f9731626] rounded-[9999px]"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "box-border w-[6px] shrink-0 h-[6px] bg-[#f97316] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"MENUNGGU KONFIRMASI"}
                              data-text="true"
                            >
                              {"MENUNGGU KONFIRMASI"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Diajukan 12 menit lalu"}
                            data-text="true"
                          >
                            {"Diajukan 12 menit lalu"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kontak Demo"}
                          data-text="true"
                        >
                          {"Kontak Demo"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Perwakilan Organisasi Demo"
                          }
                          data-text="true"
                        >
                          {"Perwakilan Organisasi Demo"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[210px] shrink-0 h-fit flex flex-col gap-[2px] p-[8px] justify-start items-end bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"event"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"event"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Senin, 18 Mei 2026"}
                            data-text="true"
                          >
                            {"Senin, 18 Mei 2026"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-[20px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"schedule"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"schedule"}
                          </div>
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"09:00 - 11:00 WIB"}
                            data-text="true"
                          >
                            {"09:00 - 11:00 WIB"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[159.48px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#ffffff] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[12px]/[12px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"videocam"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"videocam"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Google Meet Online HD"}
                            data-text="true"
                          >
                            {"Google Meet Online HD"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#f0f0f0b3] rounded-[12px] relative [z-index:2]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[18px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"MINAT LAYANAN:"}
                          data-text="true"
                        >
                          {"MINAT LAYANAN:"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Sistem Informasi Database & Cloud Archit"
                          }
                          data-text="true"
                        >
                          {"Sistem Informasi Database & Cloud Architecture"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[14px]/[23px] box-border w-full h-[45.5px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "“Kebutuhan migrasi sistem pencatatan met"
                        }
                        data-text="true"
                      >
                        {
                          "“Kebutuhan migrasi sistem pencatatan meter air manual ke platform web terpusat dan notifikasi WhatsApp tagihan otomatis untuk 4.200 kepala keluarga.”"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#18181a] rounded-[12px] relative [z-index:3]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-row gap-[6px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"verified_user"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"verified_user"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Tindakan Cepat: Set Link & Kirim Undanga"
                            }
                            data-text="true"
                          >
                            {"Tindakan Cepat: Set Link & Kirim Undangan Klien"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Template ID: #WA-BKG-CONFIRM-01"}
                          data-text="true"
                        >
                          {"Template ID: #WA-BKG-CONFIRM-01"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-[38px] shrink-0 flex flex-row gap-[12px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[38px] flex flex-row gap-[8px] p-[8px_12px] justify-start items-center bg-[#242427] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"link"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"link"}
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[20px] flex flex-col gap-0 justify-center items-start overflow-hidden"
                            }
                            data-pencil-name={
                              "https://example.com/meeting-demo"
                            }
                          >
                            <div
                              className={
                                "text-[14px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"https://example.com/meeting-demo"}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={"/konsultasi"}
                          className={
                            "box-border w-fit shrink-0 h-[38px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[8px_16px] justify-center items-center bg-[#D2D88F] rounded-[8px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"send"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"send"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-center [white-space:nowrap]"
                            }
                            data-pencil-name={"Konfirmasi & Buka WhatsApp"}
                            data-text="true"
                          >
                            {"Konfirmasi & Buka WhatsApp"}
                          </div>
                        </Link>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Integrasi WhatsApp belum diverifikasi"
                          }
                          data-text="true"
                        >
                          {"Integrasi WhatsApp belum diverifikasi"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kirim Cal.ics Attachment Otomatis"}
                          data-text="true"
                        >
                          {"Kirim Cal.ics Attachment Otomatis"}
                        </div>
                      </div>
                    </div>
                  </article>
                  <article
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#00000008] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[72px] flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-fit h-[22px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                            }
                            data-pencil-name={"BKG-2605-77AK"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"BKG-2605-77AK"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[114.69px] shrink-0 h-[18px] flex flex-row gap-[6px] p-[2px_10px] justify-start items-center bg-[#82b44026] rounded-[9999px]"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "box-border w-[6px] shrink-0 h-[6px] bg-[#82b440] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"DIKONFIRMASI"}
                              data-text="true"
                            >
                              {"DIKONFIRMASI"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Integrasi kalender belum diverifikasi"}
                            data-text="true"
                          >
                            {"Integrasi kalender belum diverifikasi"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kontak Demo"}
                          data-text="true"
                        >
                          {"Kontak Demo"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                             "Perwakilan Organisasi Demo"
                          }
                          data-text="true"
                        >
                           {"Perwakilan Organisasi Demo"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[210px] shrink-0 h-fit flex flex-col gap-[2px] p-[8px] justify-start items-end bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"event"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"event"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Rabu, 20 Mei 2026"}
                            data-text="true"
                          >
                            {"Rabu, 20 Mei 2026"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-[20px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"schedule"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"schedule"}
                          </div>
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"13:00 - 15:00 WIB"}
                            data-text="true"
                          >
                            {"13:00 - 15:00 WIB"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[159.48px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#ffffff] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[12px]/[12px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"videocam"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"videocam"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Google Meet Online HD"}
                            data-text="true"
                          >
                            {"Google Meet Online HD"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[18px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"MINAT LAYANAN:"}
                          data-text="true"
                        >
                          {"MINAT LAYANAN:"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                             "Contoh kebutuhan layanan digital"
                          }
                          data-text="true"
                        >
                          {
                             "Contoh kebutuhan layanan digital"
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "text-[14px]/[23px] box-border w-full h-[45.5px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "“Membutuhkan perancangan sistem antrean "
                        }
                        data-text="true"
                      >
                        {
                           "“Contoh ringkasan kebutuhan. Detail dan persetujuan belum diverifikasi.”"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[4px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border [flex:1_1_0] h-fit flex flex-row gap-[4px] p-[6px_8px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"videocam"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"videocam"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border [flex:1_1_0] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={"Tautan rapat demo disamarkan"}
                          data-text="true"
                        >
                          {"Tautan rapat demo disamarkan"}
                        </div>
                        <UiAction
                          label={"content_copy"}
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_0px_6px_0px] justify-start items-start"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"content_copy"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"content_copy"}
                          </div>
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <Link
                          href={"/konsultasi"}
                          className={
                            "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"a"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#25d366] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
                            data-pencil-name={"Buka WhatsApp"}
                            data-text="true"
                          >
                            {"Buka WhatsApp"}
                          </div>
                        </Link>
                        <UiAction
                          label={"Tandai Selesai"}
                          className={
                            "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"task_alt"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"task_alt"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-pencil-name={"Tandai Selesai"}
                            data-text="true"
                          >
                            {"Tandai Selesai"}
                          </div>
                        </UiAction>
                      </div>
                    </div>
                  </article>
                  <article
                    className={
                      "box-border w-full h-fit shrink-0 opacity-[0.85] [box-shadow:0px_1px_4px_#00000005] flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#ffffffb3] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[72px] flex flex-col gap-[4px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-fit h-[22px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                            }
                            data-pencil-name={"BKG-2604-12MN"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"BKG-2604-12MN"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[78.33px] shrink-0 h-[18px] flex flex-row gap-[6px] p-[2px_10px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                            }
                            data-pencil-name={"span"}
                          >
                            <div
                              className={
                                "box-border w-[6px] shrink-0 h-[6px] bg-[#9ca3af] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"SELESAI"}
                              data-text="true"
                            >
                              {"SELESAI"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Dilaksanakan 14 Mei 2026"}
                            data-text="true"
                          >
                            {"Dilaksanakan 14 Mei 2026"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kontak Demo"}
                          data-text="true"
                        >
                          {"Kontak Demo"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Perwakilan Organisasi Demo"
                          }
                          data-text="true"
                        >
                          {"Perwakilan Organisasi Demo"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[210px] shrink-0 h-fit flex flex-col gap-[2px] p-[8px] justify-start items-end bg-[#f0f0f099] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"event_available"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"event_available"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"14 Mei 2026"}
                            data-text="true"
                          >
                            {"14 Mei 2026"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"schedule"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"schedule"}
                          </div>
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"16:00 - 18:00 WIB"}
                            data-text="true"
                          >
                            {"16:00 - 18:00 WIB"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Hasil Sesi: Proposal Penawaran Sistem To"
                        }
                        data-text="true"
                      >
                        {
                          "Hasil Sesi: Proposal Penawaran Sistem Toko Online Ekspor terkirim via Email."
                        }
                      </div>
                      <UiAction
                        label={"Buka Log Notulensi"}
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Buka Log Notulensi"}
                          data-text="true"
                        >
                          {"Buka Log Notulensi"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[14px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"arrow_forward"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"arrow_forward"}
                        </div>
                      </UiAction>
                    </div>
                  </article>
                </section>
                <aside
                  data-pencil-name="aside"
                  className="box-border xl:col-span-4 flex flex-col gap-[20px] justify-start items-start w-full"
                >
                  <div
                    data-pencil-name="div"
                    className="box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#00000008] flex flex-col gap-0 p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                  >
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-center"
                    >
                      <div
                        data-pencil-name="Card Title"
                        className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                      >
                        <div
                          data-pencil-name="Icon"
                          className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#F0F0F0] rounded-[8px]"
                        >
                          <div
                            data-pencil-name="icon"
                            className="text-[18px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            aria-hidden="true"
                          >
                            {"calendar_month"}
                          </div>
                        </div>
                        <div
                          data-pencil-name="Text Col"
                          className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                        >
                          <div
                            data-pencil-name="Title"
                            className="text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"Jadwal Slot Mingguan"}
                          </div>
                          <div
                            data-pencil-name="Sub"
                            className="text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"Senin s/d Jumat (4 Sesi/Hari)"}
                          </div>
                        </div>
                      </div>
                      <UiAction
                        label={"Pengaturan Slot Mingguan"}
                        className="box-border w-fit shrink-0 h-[36px] flex flex-col gap-0 p-[6px] justify-start items-start bg-[#f0f0f0] hover:bg-[#e4e4e7] transition-colors rounded-[8px] cursor-pointer"
                        data-pencil-name="button"
                      >
                        <div
                          data-pencil-name="settings"
                          className="text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          aria-hidden="true"
                        >
                          {"settings"}
                        </div>
                      </UiAction>
                    </div>
                    <div
                      data-pencil-name="spacer"
                      className="box-border w-full h-[12px] shrink-0"
                    ></div>
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    >
                      <div
                        data-pencil-name="div"
                        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_4px_0px] justify-between items-center"
                      >
                        <div
                          data-pencil-name="div"
                          className="box-border w-fit shrink-0 h-[18px] flex flex-row gap-[8px] justify-start items-center"
                        >
                          <div
                            data-pencil-name="span"
                            className="box-border w-[10px] shrink-0 h-[10px] bg-[#82b440] rounded-[50%]"
                          ></div>
                          <div
                            data-pencil-name="Senin s/d Jumat"
                            className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"Senin s/d Jumat"}
                          </div>
                        </div>
                        <div
                          data-pencil-name="4 Slot / Hari"
                          className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                        >
                          <div
                            className="text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"4 Slot / Hari"}
                          </div>
                        </div>
                      </div>
                      <div
                        data-pencil-name="div"
                        className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                      >
                        <div className="box-border w-full h-[50px] shrink-0 flex flex-row gap-[4px] justify-start items-start">
                          <div
                            data-pencil-name="div"
                            className="box-border [flex:1_1_0] h-[50px] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                          >
                            <div
                              data-pencil-name="div"
                              className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            >
                              <div
                                data-pencil-name="Slot 1"
                                className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"Slot 1"}
                              </div>
                              <div
                                data-pencil-name="09:00 - 11:00"
                                className="text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"09:00 - 11:00"}
                              </div>
                            </div>
                            <div
                              data-pencil-name="check_circle"
                              className="text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            data-pencil-name="div"
                            className="box-border [flex:1_1_0] h-[50px] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                          >
                            <div
                              data-pencil-name="div"
                              className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            >
                              <div
                                data-pencil-name="Slot 2"
                                className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"Slot 2"}
                              </div>
                              <div
                                data-pencil-name="13:00 - 15:00"
                                className="text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"13:00 - 15:00"}
                              </div>
                            </div>
                            <div
                              data-pencil-name="check_circle"
                              className="text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                        </div>
                        <div className="box-border w-full h-[50px] shrink-0 flex flex-row gap-[4px] justify-start items-start">
                          <div
                            data-pencil-name="div"
                            className="box-border [flex:1_1_0] h-[50px] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                          >
                            <div
                              data-pencil-name="div"
                              className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            >
                              <div
                                data-pencil-name="Slot 3"
                                className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"Slot 3"}
                              </div>
                              <div
                                data-pencil-name="16:00 - 18:00"
                                className="text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"16:00 - 18:00"}
                              </div>
                            </div>
                            <div
                              data-pencil-name="check_circle"
                              className="text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            data-pencil-name="div"
                            className="box-border [flex:1_1_0] h-[50px] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                          >
                            <div
                              data-pencil-name="div"
                              className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            >
                              <div
                                data-pencil-name="Slot 4"
                                className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"Slot 4"}
                              </div>
                              <div
                                data-pencil-name="19:30 - 21:30"
                                className="text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                                data-text="true"
                              >
                                {"19:30 - 21:30"}
                              </div>
                            </div>
                            <div
                              data-pencil-name="check_circle"
                              className="text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      data-pencil-name="spacer"
                      className="box-border w-full h-[12px] shrink-0"
                    ></div>
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f080] rounded-[12px]"
                    >
                      <div
                        data-pencil-name="div"
                        className="box-border w-fit shrink-0 h-[18px] flex flex-row gap-[8px] justify-start items-center"
                      >
                        <div
                          data-pencil-name="span"
                          className="box-border w-[10px] shrink-0 h-[10px] bg-[#9ca3af] rounded-[50%]"
                        ></div>
                        <div
                          data-pencil-name="Sabtu & Minggu"
                          className="text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"Sabtu & Minggu"}
                        </div>
                      </div>
                      <div
                        data-pencil-name="NONAKTIF (TUTUP)"
                        className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"NONAKTIF (TUTUP)"}
                      </div>
                    </div>
                    <div
                      data-pencil-name="spacer"
                      className="box-border w-full h-[16px] shrink-0"
                    ></div>
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#18181a] rounded-[12px]"
                    >
                      <div
                        data-pencil-name="div"
                        className="box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      >
                        <div
                          data-pencil-name="shield"
                          className="text-[16px]/[16px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          aria-hidden="true"
                        >
                          {"shield"}
                        </div>
                        <div
                          data-pencil-name="PROTEKSI ANTI DOUBLE-BOOKING"
                          className="text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"PROTEKSI ANTI DOUBLE-BOOKING"}
                        </div>
                      </div>
                      <div
                        data-pencil-name="Security Desc"
                        className="text-[12px]/[17px] box-border w-full text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        data-text="true"
                      >
                        {
                          "Sistem mengunci slot secara otomatis pada layer database untuk mencegah bentrok jadwal."
                        }
                      </div>
                      <div
                        data-pencil-name="div"
                        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                      >
                        <div
                          data-pencil-name="Pencegahan bentrok perlu diverifikasi"
                          className="text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"Pencegahan bentrok perlu diverifikasi"}
                        </div>
                        <div
                          data-pencil-name="Implementasi perlu diverifikasi"
                          className="text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"Implementasi perlu diverifikasi"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    data-pencil-name="div"
                    className="box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#00000008] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                  >
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    >
                      <div
                        data-pencil-name="div"
                        className="box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                      >
                        <div
                          data-pencil-name="BLACKOUT CALENDAR"
                          className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"BLACKOUT CALENDAR"}
                        </div>
                        <div
                          data-pencil-name="Tanggal Terblokir"
                          className="text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"Tanggal Terblokir"}
                        </div>
                      </div>
                      <div
                        data-pencil-name="Ketersediaan contoh • belum dikonfigurasi"
                        className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      >
                        <div
                          className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          data-text="true"
                        >
                          {"Ketersediaan contoh • belum dikonfigurasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      data-pencil-name="div"
                      className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                    >
                      <div
                        data-pencil-name="div"
                        className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      >
                        <div
                          data-pencil-name="div"
                          className="box-border w-[40px] shrink-0 h-[40px] flex flex-col gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                        >
                          <div
                            data-pencil-name="MEI"
                            className="text-[10px]/[13px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center [white-space:nowrap]"
                            data-text="true"
                          >
                            {"MEI"}
                          </div>
                          <div
                            data-pencil-name="23"
                            className="text-[16px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center [white-space:nowrap]"
                            data-text="true"
                          >
                            {"23"}
                          </div>
                        </div>
                        <div
                          data-pencil-name="div"
                          className="box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 justify-start items-start"
                        >
                          <div
                            data-pencil-name="Libur Nasional Waisak"
                            className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"Libur Nasional Waisak"}
                          </div>
                          <div
                            data-pencil-name="Full Day Blocked (Semua Slot Tertutup)"
                            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            data-text="true"
                          >
                            {"Full Day Blocked (Semua Slot Tertutup)"}
                          </div>
                        </div>
                      </div>
                      <UiAction
                        label={"Hapus Blokir 23 Mei"}
                        className="box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start hover:bg-[#e4e4e7] rounded-[6px] transition-colors cursor-pointer"
                        data-pencil-name="button"
                      >
                        <div
                          data-pencil-name="delete"
                          className="text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          aria-hidden="true"
                        >
                          {"delete"}
                        </div>
                      </UiAction>
                    </div>
                    <UiAction
                      label={"Tambah Hari Libur / Blokir Tanggal"}
                      className="box-border w-full h-[38px] shrink-0 flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] transition-colors rounded-[12px] cursor-pointer"
                      data-pencil-name="button"
                    >
                      <div
                        data-pencil-name="add_circle"
                        className="text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        aria-hidden="true"
                      >
                        {"add_circle"}
                      </div>
                      <div
                        data-pencil-name="Tambah Hari Libur / Blokir Tanggal"
                        className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Tambah Hari Libur / Blokir Tanggal"}
                      </div>
                    </UiAction>
                  </div>
                  <div
                    data-pencil-name="div"
                    className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                  >
                    <div
                      data-pencil-name="div"
                      className="box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_4px_#00000005] flex flex-col gap-[4px] p-[16px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    >
                      <div
                        data-pencil-name="KAPASITAS SLOT MINGGU INI"
                        className="text-[12px]/[15px] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Kapasitas Slot"}
                      </div>
                      <div
                        data-pencil-name="20 Slot"
                        className="text-[28px]/[42px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"20 Slot"}
                      </div>
                      <div
                        data-pencil-name="Kapasitas contoh"
                        className="text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Kapasitas contoh • belum diverifikasi"}
                      </div>
                    </div>
                    <div
                      data-pencil-name="div"
                      className="box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_4px_#00000005] flex flex-col gap-[4px] p-[16px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    >
                      <div
                        data-pencil-name="TINGKAT KEHADIRAN KLIEN"
                        className="text-[12px]/[15px] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Tingkat Kehadiran"}
                      </div>
                      <div
                        data-pencil-name="Status kehadiran contoh"
                        className="text-[28px]/[42px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Belum diverifikasi"}
                      </div>
                      <div
                        data-pencil-name="Integrasi notifikasi belum diverifikasi"
                        className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        data-text="true"
                      >
                        {"Integrasi notifikasi belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ScreenState>
  );
}
