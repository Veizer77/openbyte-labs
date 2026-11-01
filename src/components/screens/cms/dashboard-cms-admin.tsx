// Ported from prototype/stitch/cms/dashboard-cms-admin.html. Prototype remains read-only.
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import { UiAction, DataRows, ScreenState } from "@/components/preview/Controls";
export default function CmsDashboardCmsAdmin() {
  return (
    <ScreenState screen={"cms/dashboard-cms-admin"}>
      <div
        className={
          "box-border w-full min-h-screen bg-[#f9f9f9] relative screen admin-screen flex flex-col"
        }
        data-pencil-name={"CMS / 01 - Dashboard Admin"}
        data-screen={"cms/dashboard-cms-admin"}
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
              "box-border w-full h-fit flex flex-col gap-0 pt-16 bg-[#f9f9f9] relative z-0 flex-1"
            }
            data-pencil-name={"main"}
          >
            <div
              className={
                "box-border w-full max-w-[1920px] mx-auto flex flex-col gap-5 p-4 sm:p-6 lg:p-[20px_24px] justify-start items-start"
              }
              data-pencil-name={"div"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-1 min-w-0 h-auto flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <nav
                    className={
                      "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"nav"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"OpenByte Labs"}
                      data-text="true"
                    >
                      {"OpenByte Labs"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"/"}
                      data-text="true"
                    >
                      {"/"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Dashboard"}
                      data-text="true"
                    >
                      {"Dashboard"}
                    </div>
                  </nav>
                  <h1
                    className={
                      "text-[24px]/[32px] sm:text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left m-0"
                    }
                    data-pencil-name={"Dasbor Operasional & Analitik Agensi"}
                    data-text="true"
                    data-heading="true"
                  >
                    {"Dasbor Operasional & Analitik Agensi"}
                  </h1>
                  <div
                    className={
                      "text-[13px]/[18px] sm:text-[14px]/[20px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={
                      "Ringkasan performa bisnis, aktivitas kli"
                    }
                    data-text="true"
                  >
                    {
                      "Pratinjau statis dashboard • data bisnis dan status operasional belum diverifikasi."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full sm:w-fit shrink-0 h-fit flex flex-wrap gap-2.5 justify-start items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[34px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"calendar_month"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"calendar_month"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Bulan Ini (Mei 2026)"}
                      data-text="true"
                    >
                      {"Bulan Ini (Mei 2026)"}
                    </div>
                    <div
                      className={
                        "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"expand_more"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"expand_more"}
                    </div>
                  </div>
                  <UiAction
                    label={"Buat Proyek Klien Baru +"}
                    className={
                      "box-border w-fit shrink-0 h-[34px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181a] hover:bg-[#2e2e33] transition-colors rounded-[12px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"add_circle"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"add_circle"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Buat Proyek Klien Baru +"}
                      data-text="true"
                    >
                      {"Buat Proyek Klien Baru +"}
                    </div>
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 justify-start items-start"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full min-h-[132px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Portofolio • status belum diverifikasi"}
                      data-text="true"
                    >
                      {"Portofolio • status belum diverifikasi"}
                    </div>
                    <div
                      className={
                        "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"view_carousel"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"view_carousel"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full flex items-baseline justify-between gap-2"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[36px]/[40px] lg:text-[40px]/[44px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-1px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"6"}
                      data-text="true"
                    >
                      {"6"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"+1 rilis"}
                      data-text="true"
                      data-section-padding="true"
                    >
                      {"+1 rilis"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[132px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Proyek Berjalan"}
                      data-text="true"
                    >
                      {"Proyek Berjalan"}
                    </div>
                    <div
                      className={
                        "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"domain_verification"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"domain_verification"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full flex items-baseline justify-between gap-2"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[36px]/[40px] lg:text-[40px]/[44px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-1px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"4"}
                      data-text="true"
                    >
                      {"4"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"Nilai contoh • belum diverifikasi"}
                      data-text="true"
                      data-section-padding="true"
                    >
                      {"Nilai contoh • belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[132px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Booking Bulan Ini"}
                      data-text="true"
                    >
                      {"Booking Bulan Ini"}
                    </div>
                    <div
                      className={
                        "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"event_available"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"event_available"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full flex items-baseline justify-between gap-2"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[36px]/[40px] lg:text-[40px]/[44px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-1px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"8"}
                      data-text="true"
                    >
                      {"8"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"Target: 12"}
                      data-text="true"
                      data-section-padding="true"
                    >
                      {"Target: 12"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[132px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Inquiry Baru"}
                      data-text="true"
                    >
                      {"Inquiry Baru"}
                    </div>
                    <div
                      className={
                        "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"contact_mail"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"contact_mail"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full flex items-baseline justify-between gap-2"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[36px]/[40px] lg:text-[40px]/[44px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-1px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"5"}
                      data-text="true"
                    >
                      {"5"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"3 butuh WA"}
                      data-text="true"
                      data-section-padding="true"
                    >
                      {"3 butuh WA"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[132px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Tiket Revisi"}
                      data-text="true"
                    >
                      {"Tiket Revisi"}
                    </div>
                    <div
                      className={
                        "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#ffdad6] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#ba1a1a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"pending_actions"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"pending_actions"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full flex items-baseline justify-between gap-2"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[36px]/[40px] lg:text-[40px]/[44px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-1px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"2"}
                      data-text="true"
                    >
                      {"2"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"Perlu respon"}
                      data-text="true"
                      data-section-padding="true"
                    >
                      {"Perlu respon"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-auto shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border xl:col-span-7 2xl:col-span-8 flex flex-col gap-6 justify-start items-start w-full"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px_0px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                      }
                    >
                      <div
                        className={
                          "box-border w-full px-5 h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[10px] shrink-0 h-[10px] opacity-[0.6] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Proyek contoh • status belum diverifikasi"}
                            data-text="true"
                          >
                            {"Proyek contoh • status belum diverifikasi"}
                          </div>
                        </div>
                        <Link
                          href={"/admin/showcase"}
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"a"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Semua Proyek"}
                            data-text="true"
                          >
                            {"Semua Proyek"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_20px] justify-start items-start overflow-x-auto"
                      }
                      data-pencil-name={"div"}
                      data-table-scroll="true"
                    >
                      <div
                        className={
                          "box-border w-fit min-w-[620px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"table"}
                        role="table"
                      >
                        <div
                          className={
                            "box-border w-fit min-w-[620px] h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_1px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#eaeaea]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[137.61px] shrink-0 h-[60.5px] flex flex-col gap-0 p-[14px_16px] justify-center items-start"
                            }
                            data-pencil-name={"Proyek & Klien"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Proyek & Klien"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[148.78px] shrink-0 h-[60.5px] flex flex-col gap-0 p-[14px_16px] justify-center items-start"
                            }
                            data-pencil-name={"Tahapan"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tahapan"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[93.83px] shrink-0 h-[60.5px] flex flex-col gap-0 p-[14px_16px] justify-center items-start"
                            }
                            data-pencil-name={"Sisa Revisi"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left"
                              }
                              data-text="true"
                            >
                              {"Sisa Revisi"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[133.75px] shrink-0 h-[60.5px] flex flex-col gap-0 p-[14px_16px] justify-center items-start"
                            }
                            data-pencil-name={"Status Finansial"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Status Finansial"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[106.03px] shrink-0 h-[60.5px] flex flex-col gap-0 p-[14px_16px] justify-center items-end"
                            }
                            data-pencil-name={"Aksi"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-right [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Aksi"}
                            </div>
                          </div>
                        </div>
                        <DataRows
                          texts={[
                            "Instansi Demo   Proyek Contoh 1       Status belum diverifikasi      —      Catatan demo   —       open_in_new     chat",
                            "Organisasi Demo   Proyek Contoh 2       Status belum diverifikasi      —      Catatan demo   —       open_in_new     chat",
                            "Organisasi Demo   Proyek Contoh 3       Status belum diverifikasi      —      Catatan demo   —       open_in_new     chat",
                          ]}
                          className={
                            "box-border w-fit min-w-[620px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"tbody"}
                        >
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_1px_0px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#eaeaea]"
                            }
                            data-pencil-name={"tr"}
                          >
                            <div
                              className={
                                "box-border w-[137.61px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                                }
                                data-pencil-name={"Instansi Demo"}
                                data-text="true"
                              >
                                {"Instansi Demo"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Web Desentral"}
                                data-text="true"
                              >
                                {"Web Desentral"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[148.78px] shrink-0 h-[87px] flex flex-col gap-0 p-[16px] justify-center items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "box-border w-fit h-[24px] shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e1e89c4d] rounded-[9999px]"
                                }
                                data-pencil-name={"span"}
                              >
                                <div
                                  className={
                                    "box-border w-[6px] shrink-0 h-[6px] bg-[#f97316] rounded-[50%]"
                                  }
                                  data-pencil-name={"span"}
                                ></div>
                                <div
                                  className={
                                    "text-[12px]/[16px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Review Klien"}
                                  data-text="true"
                                >
                                  {"Review Klien"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[93.83px] shrink-0 h-fit flex flex-col gap-[5px] p-[25.5px_35.35px_25.5px_16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"2 / 3"}
                                data-text="true"
                              >
                                {"2 / 3"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border pl-1 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"tersisa"}
                                data-text="true"
                              >
                                {"tersisa"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[133.75px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-center items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Status pembayaran contoh • belum diverifikasi"}
                                data-text="true"
                              >
                                {"Status pembayaran belum diverifikasi"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border w-full h-[32px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-pencil-name={"Saldo contoh • belum diverifikasi"}
                                data-text="true"
                              >
                                {"Data contoh"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[106.03px] shrink-0 h-[87px] flex flex-row gap-[6px] p-[16px] justify-end items-center"
                              }
                              data-pencil-name={"td"}
                              data-section-padding="true"
                            >
                              <UiAction
                                label={"open_in_new"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"open_in_new"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"open_in_new"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"chat"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"chat"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"chat"}
                                </div>
                              </UiAction>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_1px_0px] justify-start items-start [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#eaeaea]"
                            }
                            data-pencil-name={"tr"}
                          >
                            <div
                              className={
                                "box-border w-[137.61px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                                }
                                data-pencil-name={"Organisasi Demo"}
                                data-text="true"
                              >
                                {"Organisasi Demo"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Billing Engine"}
                                data-text="true"
                              >
                                {"Billing Engine"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[148.78px] shrink-0 h-[87px] flex flex-col gap-0 p-[16px] justify-center items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "box-border w-fit h-[24px] shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                                }
                                data-pencil-name={"span"}
                              >
                                <div
                                  className={
                                    "box-border w-[6px] shrink-0 h-[6px] bg-[#82b440] rounded-[50%]"
                                  }
                                  data-pencil-name={"span"}
                                ></div>
                                <div
                                  className={
                                    "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Coding & API"}
                                  data-text="true"
                                >
                                  {"Coding & API"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-fit shrink-0 h-fit flex flex-row gap-[7.94px] p-[35.5px_16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"3 / 3"}
                                data-text="true"
                              >
                                {"3 / 3"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"utuh"}
                                data-text="true"
                              >
                                {"utuh"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[133.75px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-center items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Status pembayaran contoh • belum diverifikasi"}
                                data-text="true"
                              >
                                {"Status pembayaran belum diverifikasi"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border w-full h-[32px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-pencil-name={"Saldo contoh • belum diverifikasi"}
                                data-text="true"
                              >
                                {"Data contoh"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[106.03px] shrink-0 h-[87px] flex flex-row gap-[6px] p-[16px] justify-end items-center"
                              }
                              data-pencil-name={"td"}
                              data-section-padding="true"
                            >
                              <UiAction
                                label={"open_in_new"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"open_in_new"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"open_in_new"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"chat"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"chat"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"chat"}
                                </div>
                              </UiAction>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start"
                            }
                            data-pencil-name={"tr"}
                          >
                            <div
                              className={
                                "box-border w-[137.61px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                                }
                                data-pencil-name={"Organisasi Demo"}
                                data-text="true"
                              >
                                {"Organisasi Demo"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Antrean & EMR"}
                                data-text="true"
                              >
                                {"Antrean & EMR"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[148.78px] shrink-0 h-fit flex flex-col gap-0 p-[23.5px_16px_23px_16px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "box-border w-[116.78px] h-[40px] shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#ffdad6] rounded-[9999px]"
                                }
                                data-pencil-name={"span"}
                              >
                                <div
                                  className={
                                    "box-border w-[5.11px] shrink-0 h-[6px] bg-[#ba1a1a] rounded-[50%]"
                                  }
                                  data-pencil-name={"span"}
                                ></div>
                                <div
                                  className={
                                    "text-[12px]/[16px] box-border w-[57.11px] shrink-0 text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left"
                                  }
                                  data-pencil-name={"UAT & Feedback"}
                                  data-text="true"
                                >
                                  {"UAT & Feedback"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[93.83px] shrink-0 h-fit flex flex-col gap-0 p-[25.5px_0px_0px_0px] justify-start items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"1 / 3"}
                                data-text="true"
                              >
                                {"1 / 3"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-pencil-name={"sisa 1"}
                                data-text="true"
                              >
                                {"sisa 1"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[133.75px] shrink-0 h-[87px] flex flex-col gap-[2px] p-[16px] justify-center items-start"
                              }
                              data-pencil-name={"td"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                                }
                                data-pencil-name={"Invoice Jatuh Tempo"}
                                data-text="true"
                              >
                                {"Invoice Jatuh Tempo"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"3 Hari Lagi"}
                                data-text="true"
                              >
                                {"3 Hari Lagi"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[106.03px] shrink-0 h-[87px] flex flex-row gap-[6px] p-[16px] justify-end items-center"
                              }
                              data-pencil-name={"td"}
                              data-section-padding="true"
                            >
                              <UiAction
                                label={"open_in_new"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"open_in_new"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"open_in_new"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"chat"}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[8px] justify-start items-start rounded-[8px] hover:bg-neutral-100 transition-colors"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"chat"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"chat"}
                                </div>
                              </UiAction>
                            </div>
                          </div>
                        </DataRows>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#ba1a1a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"assignment_late"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"assignment_late"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Permintaan Revisi & Approval Menunggu Ti"
                          }
                          data-text="true"
                        >
                          {"Permintaan Revisi & Approval Menunggu Tindakan"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffdad6] rounded-[9999px]"
                        }
                        data-pencil-name={"Tiket contoh • status belum diverifikasi"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Tiket contoh • status belum diverifikasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f0b3] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
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
                            "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px]"
                            }
                            data-pencil-name={"DRAF-001"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"DRAF-001"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Instansi Demo"}
                            data-text="true"
                          >
                            {"Instansi Demo"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"•"}
                            data-text="true"
                          >
                            {"•"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Round #2 Revisi Desain Form"}
                            data-text="true"
                          >
                            {"Round #2 Revisi Desain Form"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f9731633] rounded-[4px]"
                          }
                          data-pencil-name={"Submitted 3 jam lalu"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Submitted 3 jam lalu"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            '"Penyesuaian kop cetak surat RT & integr'
                          }
                          data-text="true"
                        >
                          {
                            '"Penyesuaian kop cetak surat RT & integrasi tanda tangan barcode dinamis pada PDF export."'
                          }
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[167.38px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"attach_file"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"attach_file"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Lampiran klien tidak ditampilkan • draf contoh"}
                              data-text="true"
                            >
                              {"Lampiran klien tidak ditampilkan • draf contoh"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[176.3px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"timelapse"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"timelapse"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Estimasi pengerjaan: 1.5 Jam"}
                              data-text="true"
                            >
                              {"Estimasi pengerjaan: 1.5 Jam"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_0px] justify-between items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Klien memiliki sisa 2 dari 3 jatah revis"
                          }
                          data-text="true"
                        >
                          {"Klien memiliki sisa 2 dari 3 jatah revisi gratis."}
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <UiAction
                            label={"Terima (Hitung Kuota)"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#18181a] rounded-[8px]"
                            }
                            data-pencil-name={"Terima (Hitung Kuota)"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Terima (Hitung Kuota)"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"Tolak"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"Tolak"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tolak"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"Tandai sbg Bug (Free)"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#e2e89d] rounded-[8px]"
                            }
                            data-pencil-name={"Tandai sbg Bug (Free)"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tandai sbg Bug (Free)"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f0b3] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
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
                            "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px]"
                            }
                            data-pencil-name={"DRAF-002"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"DRAF-002"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Organisasi Demo"}
                            data-text="true"
                          >
                            {"Organisasi Demo"}
                          </div>
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"•"}
                            data-text="true"
                          >
                            {"•"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Catatan Demo"}
                            data-text="true"
                          >
                            {"Catatan Demo"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f9731633] rounded-[4px]"
                          }
                          data-pencil-name={"Submitted 7 jam lalu"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Submitted 7 jam lalu"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-[66px] shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                             '"Contoh permintaan penyesuaian pada modul'
                          }
                          data-text="true"
                        >
                          {
                             '"Contoh permintaan penyesuaian. Detail klien tidak dimuat."'
                          }
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[139.84px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"receipt_long"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"receipt_long"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Layanan Contoh 1"}
                              data-text="true"
                            >
                              {"Layanan Contoh 1"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_0px] justify-between items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Perhatian: ini adalah tiket revisi terak"
                          }
                          data-text="true"
                        >
                          {
                            "Perhatian: ini adalah tiket revisi terakhir (3/3) untuk paket ini."
                          }
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <UiAction
                            label={"Terima (Hitung Kuota)"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#18181a] rounded-[8px]"
                            }
                            data-pencil-name={"Terima (Hitung Kuota)"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Terima (Hitung Kuota)"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"Tolak"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"Tolak"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#ba1a1a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tolak"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"Tandai sbg Bug (Free)"}
                            className={
                              "box-border w-fit shrink-0 h-[30px] flex flex-col gap-0 p-[6px_12px] justify-center items-center bg-[#e2e89d] rounded-[8px]"
                            }
                            data-pencil-name={"Tandai sbg Bug (Free)"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tandai sbg Bug (Free)"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border xl:col-span-5 2xl:col-span-4 flex flex-col gap-6 justify-start items-start w-full"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#18181a] rounded-[16px] overflow-hidden"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_4px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
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
                            "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Telemetri Sistem"}
                          data-text="true"
                        >
                          {"Telemetri Sistem"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Semua Sistem Normal"}
                        data-text="true"
                      >
                        {"Semua Sistem Normal"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[92px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#242427] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"PostgreSQL"}
                          data-text="true"
                        >
                          {"PostgreSQL"}
                        </div>
                        <div
                          className={
                            "box-border w-full h-[40px] shrink-0 flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"4.2 ms"}
                            data-text="true"
                          >
                            {"4.2 ms"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Neon SG"}
                            data-text="true"
                          >
                            {"Neon SG"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[92px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#242427] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Render App"}
                          data-text="true"
                        >
                          {"Render App"}
                        </div>
                        <div
                          className={
                            "box-border w-full h-[40px] shrink-0 flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Sehat"}
                            data-text="true"
                          >
                            {"Sehat"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Metrik contoh"}
                            data-text="true"
                          >
                            {"Metrik contoh • belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[92px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#242427] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Asset Storage"}
                          data-text="true"
                        >
                          {"Asset Storage"}
                        </div>
                        <div
                          className={
                            "box-border w-full h-[40px] shrink-0 flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Ukuran data belum diverifikasi"}
                            data-text="true"
                          >
                            {"Belum diverifikasi"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Status penyimpanan belum diverifikasi"}
                            data-text="true"
                          >
                            {"Status penyimpanan belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[5px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#2e2e32]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Aktivitas penyimpanan contoh"}
                        data-text="true"
                      >
                        {"Aktivitas penyimpanan contoh • bukan snapshot aktual"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Status penyimpanan belum diverifikasi"}
                        data-text="true"
                      >
                        {"Status belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"calendar_today"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"calendar_today"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Booking Konsultasi Terbaru"}
                          data-text="true"
                        >
                          {"Booking Konsultasi Terbaru"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Lihat Semua"}
                        data-text="true"
                      >
                        {"Lihat Semua"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-between items-center bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Narasumber Demo"}
                              data-text="true"
                            >
                              {"Narasumber Demo"}
                            </div>
                            <div
                              className={
                                "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#82b44033] rounded-[9999px]"
                              }
                              data-pencil-name={"Terkonfirmasi"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Terkonfirmasi"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[7.99px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Besok, 10:00 WIB"}
                              data-text="true"
                            >
                              {"Besok, 10:00 WIB"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"•"}
                              data-text="true"
                            >
                              {"•"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Layanan Contoh 2"}
                              data-text="true"
                            >
                              {"Layanan Contoh 2"}
                            </div>
                          </div>
                        </div>
                        <UiAction
                          label={"chat"}
                          className={
                            "box-border w-fit shrink-0 h-[40px] flex flex-col gap-0 p-[10px_8px_14px_8px] justify-start items-start bg-[#18181a] rounded-[8px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"chat"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"chat"}
                          </div>
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-between items-center bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Kontak Demo (Organisasi)"}
                              data-text="true"
                            >
                              {"Kontak Demo (Organisasi)"}
                            </div>
                            <div
                              className={
                                "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#f9731633] rounded-[9999px]"
                              }
                              data-pencil-name={"Menunggu Review"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Menunggu Review"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Jumat, 14:00 WIB"}
                              data-text="true"
                            >
                              {"Jumat, 14:00 WIB"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"•"}
                              data-text="true"
                            >
                              {"•"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Add-on Payment Gateway"}
                              data-text="true"
                            >
                              {"Add-on Payment Gateway"}
                            </div>
                          </div>
                        </div>
                        <UiAction
                          label={"check"}
                          className={
                            "box-border w-fit shrink-0 h-[40px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[10px_8px_14px_8px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"check"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check"}
                          </div>
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-between items-center bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[7.99px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Kontak Contoh"}
                              data-text="true"
                            >
                              {"Kontak Contoh"}
                            </div>
                            <div
                              className={
                                "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#82b44033] rounded-[9999px]"
                              }
                              data-pencil-name={"Terkonfirmasi"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Terkonfirmasi"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[7.99px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Sabtu, 11:30 WIB"}
                              data-text="true"
                            >
                              {"Sabtu, 11:30 WIB"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"•"}
                              data-text="true"
                            >
                              {"•"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Audit Arsitektur Web"}
                              data-text="true"
                            >
                              {"Audit Arsitektur Web"}
                            </div>
                          </div>
                        </div>
                        <UiAction
                          label={"chat"}
                          className={
                            "box-border w-fit shrink-0 h-[40px] flex flex-col gap-0 p-[10px_8px_14px_8px] justify-start items-start bg-[#18181a] rounded-[8px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"chat"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"chat"}
                          </div>
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-between items-center bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Instansi Demo"}
                              data-text="true"
                            >
                              {"Instansi Demo"}
                            </div>
                            <div
                              className={
                                "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#f9731633] rounded-[9999px]"
                              }
                              data-pencil-name={"Menunggu Review"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Menunggu Review"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-fit shrink-0 flex flex-row gap-[7.99px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"22 Mei, 09:00 WIB"}
                              data-text="true"
                            >
                              {"22 Mei, 09:00 WIB"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"•"}
                              data-text="true"
                            >
                              {"•"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Portal Wisata"}
                              data-text="true"
                            >
                              {"Portal Wisata"}
                            </div>
                          </div>
                        </div>
                        <UiAction
                          label={"check"}
                          className={
                            "box-border w-fit shrink-0 h-[40px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[10px_8px_14px_8px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"check"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check"}
                          </div>
                        </UiAction>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[190px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Aksi Cepat Admin"}
                      data-text="true"
                    >
                      {"Aksi Cepat Admin"}
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <UiAction
                        label={"Site Settings Konfigurasi SEO & WA"}
                        className={
                          "box-border [flex:1_1_0] h-[114px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"tune"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"tune"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[46px] shrink-0 flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#1a1c1c] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Site Settings"}
                            data-text="true"
                          >
                            {"Site Settings"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Konfigurasi SEO & WA"}
                            data-text="true"
                          >
                            {"Konfigurasi SEO & WA"}
                          </div>
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Kalkulator Ubah tarif & add-on"}
                        className={
                          "box-border [flex:1_1_0] h-[114px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"calculate"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"calculate"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[46px] shrink-0 flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#1a1c1c] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Kalkulator"}
                            data-text="true"
                          >
                            {"Kalkulator"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Ubah tarif & add-on"}
                            data-text="true"
                          >
                            {"Ubah tarif & add-on"}
                          </div>
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Backup contoh • nonaktif"}
                        className={
                          "box-border [flex:1_1_0] h-[114px] flex flex-col gap-0 p-[12px] justify-between items-start bg-[#e2e89d] rounded-[12px]"
                        }
                        data-pencil-name={"button"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-[32px] h-[32px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#454a10] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"backup"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"backup"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[46px] shrink-0 flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Backup contoh • nonaktif"}
                            data-text="true"
                          >
                            {"Backup contoh • nonaktif"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#454a10cc] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"Backup contoh • nonaktif"}
                            data-text="true"
                          >
                            {"Backup contoh • nonaktif"}
                          </div>
                        </div>
                      </UiAction>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ScreenState>
  );
}
