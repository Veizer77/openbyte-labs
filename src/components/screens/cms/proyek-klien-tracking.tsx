// Ported from prototype/stitch/cms/proyek-klien-tracking.html. Prototype remains read-only.
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  FilterButton,
  DataRows,
  ScreenState,
  ToggleControl,
} from "@/components/preview/Controls";
export default function CmsProyekKlienTracking() {
  return (
    <ScreenState screen={"cms/proyek-klien-tracking"}>
      <div
        className={
          "box-border w-full min-h-screen bg-[#f9f9f9] relative screen admin-screen flex flex-col"
        }
        data-pencil-name={"CMS / 02 - Proyek Klien & Tracking"}
        data-screen={"cms/proyek-klien-tracking"}
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
                "box-border w-full max-w-[1920px] mx-auto flex flex-col gap-6 p-4 sm:p-6 lg:p-8 justify-start items-start"
              }
              data-pencil-name={"div"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-1 min-w-0 h-auto flex flex-col gap-[4px] justify-start items-start"
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
                      data-pencil-name={"Proyek Klien & Tracking"}
                      data-text="true"
                    >
                      {"Proyek Klien & Tracking"}
                    </div>
                  </nav>
                  <h1
                    className={
                      "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                    }
                    data-pencil-name={"Manajemen Proyek Klien & Akses Tracking"}
                    data-text="true"
                    data-heading="true"
                  >
                    {"Manajemen Proyek Klien & Akses Tracking"}
                  </h1>
                  <div
                    className={
                      "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={
                      "Kelola tahap pengerjaan, milestone check"
                    }
                    data-text="true"
                  >
                    {
                      "Pratinjau statis dengan data contoh. Status proyek, PIN, pembayaran, dan lampiran tidak terhubung serta tidak boleh dianggap sebagai catatan nyata."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-wrap gap-2 sm:gap-3 items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <UiAction
                    label={"Export Rekap"}
                    className={
                      "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"file_download"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"file_download"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Export Rekap"}
                      data-text="true"
                    >
                      {"Export Rekap"}
                    </div>
                  </UiAction>
                  <UiAction
                    label={"Tambah Proyek Klien Baru"}
                    className={
                      "box-border w-fit shrink-0 h-[38px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[10px_20px] justify-start items-center bg-[#18181a] rounded-[12px]"
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
                      data-pencil-name={"Tambah Proyek Klien Baru"}
                      data-text="true"
                    >
                      {"Tambah Proyek Klien Baru"}
                    </div>
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col md:flex-row gap-3 p-2 justify-between items-start md:items-center bg-[#ffffff] rounded-[12px]"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full md:w-fit shrink-0 h-fit flex flex-wrap gap-[4px] p-[4px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <FilterButton
                    value={"Semua"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#18181a] rounded-[6px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Semua"}
                      data-text="true"
                    >
                      {"Semua"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#ffffff33] rounded-[4px]"
                      }
                      data-pencil-name={"18"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                         {"0"}
                      </div>
                    </div>
                  </FilterButton>
                  <FilterButton
                     value={"Contoh"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center rounded-[6px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                       data-pencil-name={"Draf"}
                      data-text="true"
                    >
                       {"Draf"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#eeeeee] rounded-[4px]"
                      }
                      data-pencil-name={"11"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                         {"0"}
                      </div>
                    </div>
                  </FilterButton>
                  <UiAction
                     label={"Review contoh"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center rounded-[6px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "box-border w-[8px] shrink-0 h-[8px] bg-[#f97316] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Review Terbuka"}
                      data-text="true"
                    >
                       {"Review contoh • status belum diverifikasi"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#eeeeee] rounded-[4px]"
                      }
                      data-pencil-name={"3"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                         {"0"}
                      </div>
                    </div>
                  </UiAction>
                  <UiAction
                     label={"Serah terima contoh"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center rounded-[6px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Selesai / Handover"}
                      data-text="true"
                    >
                       {"Serah terima contoh • status belum diverifikasi"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#eeeeee] rounded-[4px]"
                      }
                      data-pencil-name={"4"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                         {"0"}
                      </div>
                    </div>
                  </UiAction>
                  <UiAction
                    label={"Diarsipkan"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center rounded-[6px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Diarsipkan"}
                      data-text="true"
                    >
                      {"Diarsipkan"}
                    </div>
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-full md:w-fit shrink-0 h-fit flex flex-row gap-2 justify-between md:justify-end items-center"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border flex-1 sm:w-[360px] sm:flex-initial h-[36px] relative flex items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border absolute left-3 top-1/2 -translate-y-1/2 text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] z-10 symbol"
                      }
                      data-pencil-name={"search"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"search"}
                    </div>
                    <div
                      className={
                        "box-border w-full h-[36px] shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col justify-center items-start bg-[#f0f0f0] rounded-[8px] overflow-hidden pl-9 pr-9"
                      }
                      data-pencil-name={"PRJ-DEMO-001"}
                    >
                      <div
                        className={
                          "text-[14px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"PRJ-DEMO-001"}
                      </div>
                    </div>
                    <UiAction
                      label={"close"}
                      className={
                        "box-border w-fit h-[24px] absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center z-20"
                      }
                      data-pencil-name={"button"}
                    >
                      <div
                        className={
                          "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"close"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"close"}
                      </div>
                    </UiAction>
                  </div>
                  <UiAction
                    label={"filter_list"}
                    className={
                      "box-border w-fit shrink-0 h-[36px] flex flex-col gap-0 p-[8px] justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[20px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"filter_list"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"filter_list"}
                    </div>
                  </UiAction>
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
                    "box-border xl:col-span-4 flex flex-col gap-6 justify-start items-start w-full order-2 xl:order-2"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"vpn_key"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"vpn_key"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Akses Kredensial Tracking"}
                          data-text="true"
                        >
                          {"Akses Kredensial Tracking"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Autentikasi kode & PIN portal publik kli"
                          }
                          data-text="true"
                        >
                          {"Autentikasi kode & PIN portal publik klien"}
                        </div>
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
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"NOMOR REGISTRASI TRACKING"}
                        data-text="true"
                      >
                        {"NOMOR REGISTRASI TRACKING"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[0.9px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"PRJ-DEMO-001"}
                          data-text="true"
                        >
                          {"PRJ-DEMO-001"}
                        </div>
                        <UiAction
                          label={"content_copy"}
                          className={
                            "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"content_copy"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"content_copy"}
                          </div>
                        </UiAction>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
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
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"PIN KEMANAN AKSES"}
                          data-text="true"
                        >
                          {"PIN KEMANAN AKSES"}
                        </div>
                        <div
                          className={
                            "box-border w-[114.92px] shrink-0 h-[16.5px] flex flex-row gap-[2px] justify-start items-center"
                          }
                          data-pencil-name={"span"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[12px]/[12px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"lock"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"lock"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[17px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Status keamanan kredensial belum diverifikasi"}
                            data-text="true"
                          >
                            {"Status keamanan kredensial belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[4px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[1.6px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"••••••"}
                          data-text="true"
                        >
                          {"••••••"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <UiAction
                            label={"visibility"}
                            className={
                              "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"visibility"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"visibility"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"refresh"}
                            className={
                              "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"refresh"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"refresh"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[6px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[11px]/[15px] box-border w-full h-[45.38px] shrink-0 text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "Preview nonaktif; jangan gunakan untuk kredensial "
                        }
                        data-text="true"
                      >
                        {
                          "Preview nonaktif. Pembuatan, penyimpanan, atau pengiriman PIN tidak dilakukan pada halaman ini."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <Link
                        href={"#preview-only"}
                        className={
                          "box-border w-full h-[38px] shrink-0 flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#82b440] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
                          data-pencil-name={"Kirim Link Tracking ke WhatsApp"}
                          data-text="true"
                        >
                          {"Kirim Link Tracking ke WhatsApp"}
                        </div>
                      </Link>
                      <UiAction
                        label={"Kirim Notifikasi Revisi Selesai"}
                        className={
                          "box-border w-full h-[34px] shrink-0 flex flex-row gap-[8px] p-[8px_12px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"notifications_active"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"notifications_active"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Kirim Notifikasi Revisi Selesai"}
                          data-text="true"
                        >
                          {"Kirim Notifikasi Revisi Selesai"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
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
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"span"}
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
                            "box-border w-fit shrink-0 h-[48px] flex flex-col gap-[7px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Kontrol Status Revisi"}
                            data-text="true"
                          >
                            {"Kontrol Status Revisi"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Jadwal pengerjaan • draf"}
                            data-text="true"
                          >
                            {"Jadwal pengerjaan • draf"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[44px] shrink-0 h-[24px] bg-[#82b440] rounded-[9999px] relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[20px] h-[20px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                          }
                          data-pencil-name={"Icon"}
                        ></div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[62.25px] shrink-0 bg-[#e1e89c4d] rounded-[8px] relative"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[20px]/[20px] box-border absolute left-[8px] top-[10px] text-[#454a10] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                        }
                        data-pencil-name={"lock_open"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"lock_open"}
                      </div>
                      <div
                        className={
                          "box-border w-[270.66px] h-fit absolute left-[36px] top-[8px] flex flex-col gap-[2px] justify-start items-start [z-index:1]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[13px]/[16px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Review Klien: TERBUKA"}
                          data-text="true"
                        >
                          {"Review Klien: TERBUKA"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#454a10e6] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={
                            "Klien dapat menekan tombol “Setujui Hasi"
                          }
                          data-text="true"
                        >
                          {
                            "Klien dapat menekan tombol “Setujui Hasil” atau mengajukan feedback via form tracking."
                          }
                        </div>
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
                          "box-border [flex:1_1_0] h-[71px] flex flex-col gap-0 p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kuota Revisi Digunakan"}
                          data-text="true"
                        >
                          {"Kuota Revisi Digunakan"}
                        </div>
                        <div
                          className={"box-border w-full h-[2px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"1 / 3 Revisi"}
                          data-text="true"
                        >
                          {"1 / 3 Revisi"}
                        </div>
                        <div
                          className={"box-border w-full h-[4px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[10px]/[15px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Sisa 2 Sesi Gratis"}
                          data-text="true"
                        >
                          {"Sisa 2 Sesi Gratis"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[71px] flex flex-col gap-0 p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Biaya Revisi Tambahan"}
                          data-text="true"
                        >
                          {"Biaya Revisi Tambahan"}
                        </div>
                        <div
                          className={"box-border w-full h-[2px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum tersedia"}
                          data-text="true"
                        >
                          {"Belum tersedia"}
                        </div>
                        <div
                          className={"box-border w-full h-[4px] shrink-0"}
                          data-pencil-name={"spacer"}
                        ></div>
                        <div
                          className={
                            "text-[10px]/[15px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Per sesi jika kuota habis"}
                          data-text="true"
                        >
                          {"Per sesi jika kuota habis"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[5px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <ToggleControl
                          label={
                            "Contoh nonaktif; izin publikasi belum diverifikasi"
                          }
                          className={"box-border w-[14.61px] shrink-0 h-[16px]"}
                          data-pencil-name={"input"}
                        />
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-[292.05px] shrink-0 h-[28px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={
                            "Contoh nonaktif; izin publikasi belum diverifikasi"
                          }
                          data-text="true"
                          data-responsive="fixed"
                        >
                          {
                            "Contoh nonaktif; izin publikasi belum diverifikasi"
                          }
                        </div>
                      </div>
                      <UiAction
                        label={"Jadikan Proyek Portofolio"}
                        className={
                          "box-border w-full h-[38px] shrink-0 flex flex-row gap-0 p-[10px_12px] justify-between items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"auto_awesome"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"auto_awesome"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-pencil-name={"Jadikan Proyek Portofolio"}
                            data-text="true"
                          >
                            {"Jadikan Proyek Portofolio"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[16px]/[16px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"arrow_forward"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"arrow_forward"}
                        </div>
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[17px] box-border w-full h-[33px] shrink-0 text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-center"
                        }
                        data-pencil-name={
                          "Menghasilkan draft showcase bento & cupl"
                        }
                        data-text="true"
                      >
                        {
                          "Menghasilkan draft showcase bento & cuplikan teknologi secara otomatis."
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-[24px] shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Ringkasan Pembayaran"}
                        data-text="true"
                      >
                        {"Ringkasan Pembayaran"}
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                        }
                        data-pencil-name={"Termin 2 Berjalan"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Termin 2 Berjalan"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Total Nilai Proyek"}
                          data-text="true"
                        >
                          {"Total Nilai Proyek"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum tersedia"}
                          data-text="true"
                        >
                          {"Belum tersedia"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[100.97px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right"
                          }
                          data-pencil-name={"Status belum tersedia"}
                          data-text="true"
                        >
                          {"Status belum tersedia"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-right [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum tersedia"}
                          data-text="true"
                        >
                          {"Belum tersedia"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start bg-[#f0f0f0] rounded-[9999px] overflow-hidden"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[157.33px] shrink-0 h-[8px] bg-[#82b440]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      ></div>
                      <div
                        className={
                          "box-border w-[157.33px] shrink-0 h-[8px] bg-[#eeeeee]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      ></div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
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
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tahap pembayaran contoh"}
                          data-text="true"
                        >
                          {"Tahap pembayaran contoh"}
                        </div>
                        <div
                          className={
                            "box-border w-[85.64px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"span"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[13px]/[13px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"check_circle"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check_circle"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Lunas • BCA"}
                            data-text="true"
                          >
                            {"Lunas • BCA"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-[173.83px] shrink-0 h-[28px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Tahap serah terima contoh"}
                          data-text="true"
                          data-responsive="fixed"
                        >
                          {"Tahap serah terima contoh"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-[140.83px] shrink-0 h-[28px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"Contoh nonaktif • menunggu kesepakatan"}
                          data-text="true"
                          data-responsive="fixed"
                        >
                          {"Contoh nonaktif • menunggu kesepakatan"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[34px] shrink-0 flex flex-col gap-0 p-[8px_0px] justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"Catat Pembayaran Masuk"}
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Catat Pembayaran Masuk"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border xl:col-span-8 flex flex-col gap-6 justify-start items-start w-full order-1 xl:order-1"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-0 p-[24px] justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-[256px] h-[256px] [filter:blur(32px)] absolute left-[537.33px] top-[-64px] bg-[#e1e89c1a] rounded-[50%] [z-index:0]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="fixed"
                    ></div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start relative [z-index:1]"
                      }
                      data-pencil-name={"div"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border flex-1 min-w-0 h-fit flex flex-row gap-[12px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-[56px] shrink-0 h-[56px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[28px]/[28px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"domain_verification"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"domain_verification"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border flex-1 min-w-0 h-auto flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full h-[46px] shrink-0 flex flex-col gap-[8px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                                }
                                data-pencil-name={"TAHAP 5: REVIEW KLIEN AKTIF"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"TAHAP 5: REVIEW KLIEN AKTIF"}
                                </div>
                              </div>
                              <div
                                className={
                                  "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[4px]"
                                }
                                data-pencil-name={
                                  "Sistem Informasi Contoh"
                                }
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                   {"Sistem Informasi Contoh"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "text-[20px]/[26px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                        "Proyek Contoh — Sistem Informasi"
                              }
                              data-text="true"
                            >
                      {"Proyek Contoh — Sistem Informasi"}
                            </div>
                            <div
                              className={
                                "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                              }
                              data-pencil-name={
                        "Klien: Organisasi Demo"
                              }
                              data-text="true"
                            >
                              {
                        "Klien: Organisasi Demo • Kontak dan detail proyek tidak dimuat di preview."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-end"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit h-[24px] shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[10px] shrink-0 h-[10px] opacity-[0.94] bg-[#f97316] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[18px]/[24px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Draft"}
                              data-text="true"
                            >
                              {"Draft"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Data preview sintetis"}
                            data-text="true"
                          >
                            {"Data preview sintetis"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#242427] rounded-[9999px] overflow-hidden"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[531.42px] h-[8px] shrink-0 bg-[#e2e89d] rounded-[9999px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        ></div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] p-[4px_0.02px_0px_0px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"T-01"}
                              data-text="true"
                            >
                              {"T-01"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check_circle"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"DP & Brief"}
                            data-text="true"
                          >
                            {"DP & Brief"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Contoh nonaktif"}
                            data-text="true"
                          >
                            {"Contoh nonaktif"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"T-02"}
                              data-text="true"
                            >
                              {"T-02"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check_circle"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"UI/UX Figma"}
                            data-text="true"
                          >
                            {"UI/UX Figma"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Approved"}
                            data-text="true"
                          >
                            {"Approved"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"T-03"}
                              data-text="true"
                            >
                              {"T-03"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check_circle"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Coding Core"}
                            data-text="true"
                          >
                            {"Coding Core"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"v1.2 Staging"}
                            data-text="true"
                          >
                            {"v1.2 Staging"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"T-04"}
                              data-text="true"
                            >
                              {"T-04"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"check_circle"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"check_circle"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Testing QA"}
                            data-text="true"
                          >
                            {"Testing QA"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Zero Critical Bug"}
                            data-text="true"
                          >
                            {"Zero Critical Bug"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] [box-shadow:0px_0px_1px_#e1e89c80] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#e1e89c33] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border absolute left-0 top-0 text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap] [z-index:0]"
                              }
                              data-pencil-name={"T-05"}
                              data-text="true"
                            >
                              {"T-05"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border [transform:rotate(-86.47deg)] [transform-origin:top_left] absolute left-[75.8px] top-[13.55px] text-[#f97316] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:1] symbol"
                              }
                              data-pencil-name={"sync"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"sync"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Review Klien"}
                            data-text="true"
                          >
                            {"Review Klien"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"1 Revisi Masuk"}
                            data-text="true"
                          >
                            {"1 Revisi Masuk"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[72.5px] opacity-[0.7] flex flex-col gap-[4px] p-[10px] justify-start items-start bg-[#24242766] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "box-border w-full h-[14px] shrink-0 flex flex-row gap-0 justify-between items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"T-06"}
                              data-text="true"
                            >
                              {"T-06"}
                            </div>
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"lock"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"lock"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Deployment belum diverifikasi"}
                            data-text="true"
                          >
                            {"Deployment belum diverifikasi"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[13px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Menunggu kesepakatan"}
                            data-text="true"
                          >
                            {"Menunggu kesepakatan"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_8px_0px] justify-between items-center bg-[#ffffff]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"span"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"checklist"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"checklist"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Milestone Checklist — Tahap 5: Review Kl"
                            }
                            data-text="true"
                          >
                            {"Milestone Checklist — Tahap 5: Review Klien"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Tandai milestone yang telah dipenuhi unt"
                            }
                            data-text="true"
                          >
                            {
                              "Tandai milestone yang telah dipenuhi untuk membuka opsi submit BAST pengerjaan."
                            }
                          </div>
                        </div>
                      </div>
                      <UiAction
                        label={"Tambah Butir Checklist"}
                        className={
                          "box-border w-fit shrink-0 h-[26px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Tambah Butir Checklist"}
                          data-text="true"
                        >
                          {"Tambah Butir Checklist"}
                        </div>
                      </UiAction>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full min-h-[50px] p-2.5 sm:px-3 bg-[#f0f0f099] rounded-[8px] flex flex-row gap-3 items-center justify-between"
                        }
                        data-pencil-name={"label"}
                      >
                        <div className="flex flex-row gap-2.5 items-start flex-1 min-w-0">
                          <ToggleControl
                            label={
                              "Deploy Staging Server v1.2.0 (Render & Supabase Cloud) Otomatisasi CI/CD Tervalidasi pada commit #8b"
                            }
                            className={
                              "box-border w-[16px] h-[16px] mt-0.5 shrink-0"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "box-border flex-1 min-w-0 flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full flex flex-wrap gap-2 items-center"
                              }
                              data-pencil-name={"div"}
                              data-responsive="row"
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border opacity-[0.7] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={
                                  "Deploy Staging Server v1.2.0 (Render & S"
                                }
                                data-text="true"
                              >
                                {
                                  "Deploy Staging Server v1.2.0 (Render & Supabase Cloud)"
                                }
                              </div>
                              <div
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#e8e8e8] rounded-[4px]"
                                }
                                data-pencil-name={"Otomatisasi CI/CD"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Otomatisasi CI/CD"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left truncate w-full"
                              }
                              data-pencil-name={
                                "Catatan validasi demo; tidak merepresentasikan hasil aktual"
                              }
                              data-text="true"
                            >
                              {
                                "Data preview sintetis; tidak ada hasil validasi aktual."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right [white-space:nowrap] shrink-0 ml-2"
                          }
                          data-pencil-name={"Selesai"}
                          data-text="true"
                        >
                          {"Selesai"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full min-h-[50px] p-2.5 sm:px-3 bg-[#f0f0f099] rounded-[8px] flex flex-row gap-3 items-center justify-between"
                        }
                        data-pencil-name={"label"}
                      >
                        <div className="flex flex-row gap-2.5 items-start flex-1 min-w-0">
                          <ToggleControl
                            label={
                              "Tinjau alur formulir dan keluaran laporan pada preview "
                            }
                            className={
                              "box-border w-[16px] h-[16px] mt-0.5 shrink-0"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "box-border flex-1 min-w-0 flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full flex flex-wrap gap-2 items-center"
                              }
                              data-pencil-name={"div"}
                              data-responsive="row"
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border opacity-[0.7] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={
                                  "Tinjau alur formulir dan keluaran laporan"
                                }
                                data-text="true"
                              >
                                {
                                   "Tinjau alur formulir dan keluaran laporan"
                                }
                              </div>
                              <div
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#e8e8e8] rounded-[4px]"
                                }
                                data-pencil-name={"QA Engine"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"QA Engine"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left truncate w-full"
                              }
                              data-pencil-name={
                                "Status audit belum diverifikasi"
                              }
                              data-text="true"
                            >
                              {
                                "Tidak ada hasil audit atau pengujian proyek yang diverifikasi pada preview ini."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right [white-space:nowrap] shrink-0 ml-2"
                          }
                          data-pencil-name={"Selesai"}
                          data-text="true"
                        >
                          {"Selesai"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full min-h-[50px] p-2.5 sm:px-3 bg-[#ffffff] rounded-[8px] flex flex-row gap-3 items-center justify-between"
                        }
                        data-pencil-name={"label"}
                      >
                        <div className="flex flex-row gap-2.5 items-start flex-1 min-w-0">
                          <ToggleControl
                            label={
                              "Draf serah terima contoh Action Required Klien saat ini sedang memeriksa t"
                            }
                            className={
                              "box-border w-[16px] h-[16px] mt-0.5 shrink-0"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "box-border flex-1 min-w-0 flex flex-col gap-[2px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full flex flex-wrap gap-2 items-center"
                              }
                              data-pencil-name={"div"}
                              data-responsive="row"
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={
                                  "Draf serah terima contoh"
                                }
                                data-text="true"
                              >
                                {
                                  "Draf serah terima contoh"
                                }
                              </div>
                              <div
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#eeeeee] rounded-[4px]"
                                }
                                data-pencil-name={"Action Required"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Action Required"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left truncate w-full"
                              }
                              data-pencil-name={
                                "Klien saat ini sedang memeriksa tiket re"
                              }
                              data-text="true"
                            >
                              {
                                "Catatan revisi contoh; rincian proyek dan data operasional disembunyikan."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right [white-space:nowrap] shrink-0 ml-2"
                          }
                          data-pencil-name={"Tertunda"}
                          data-text="true"
                        >
                          {"Tertunda"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
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
                          "box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Visibilitas Portal Tracking Klien"}
                          data-text="true"
                        >
                          {"Visibilitas Portal Tracking Klien"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Tentukan modul dan tautan teknis yang da"
                          }
                          data-text="true"
                        >
                          {
                            "Tentukan modul dan tautan teknis yang dapat dilihat klien saat login menggunakan kode & PIN."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                        }
                        data-pencil-name={"PRD 3.6 Sync"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"PRD 3.6 Sync"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[0px_0.02px_0px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[48px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[137.95px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"open_in_browser"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"open_in_browser"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Staging URL"}
                                data-text="true"
                              >
                                {"Staging URL"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Pratinjau belum dikonfigurasi"}
                              data-text="true"
                            >
                              {"Pratinjau belum dikonfigurasi"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#18181a] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] opacity-[0.6] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-fit h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"public"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"public"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Tautan contoh"}
                                data-text="true"
                              >
                                {"Tautan contoh"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"organisasi-demo.example"}
                              data-text="true"
                            >
                              {"organisasi-demo.example"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#eeeeee] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#d1d5db] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[164.44px] h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"code"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"code"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Source Repo (Private)"}
                                data-text="true"
                              >
                                {"Source Repo (Private)"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[164.44px] h-[14px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={
                                "example.com/project-demo"
                              }
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"example.com/project-demo"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#18181a] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-[48px] shrink-0 flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[161.31px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"payments"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"payments"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Invoice & Termin Tab"}
                                data-text="true"
                              >
                                {"Invoice & Termin Tab"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Rincian invoice termin & bukti"
                              }
                              data-text="true"
                            >
                              {"Rincian invoice termin & bukti"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#18181a] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-fit h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"folder_zip"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"folder_zip"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Dokumen & Kontrak"}
                                data-text="true"
                              >
                                {"Dokumen & Kontrak"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Lampiran SPK & BAST"}
                              data-text="true"
                            >
                              {"Lampiran SPK & BAST"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#18181a] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[48px] flex flex-row gap-[8px] p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[8px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[164.44px] h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"history"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"history"}
                              </div>
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Audit Log Aktivitas"}
                                data-text="true"
                              >
                                {"Audit Log Aktivitas"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[164.44px] h-[14px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"Catatan timestamp pengerjaan"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Catatan timestamp pengerjaan"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[36px] shrink-0 h-[20px] bg-[#18181a] rounded-[9999px] relative"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[16px] h-[16px] absolute left-[2px] top-[2px] bg-[#ffffff] [border:1px_solid_#ffffff] rounded-[50%] [z-index:0]"
                              }
                              data-pencil-name={"Icon"}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-0 justify-start items-start bg-[#ffffff] rounded-[12px] overflow-hidden"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] p-[4px_12px_1px_12px] justify-start items-center bg-[#ffffff] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#f0f0f0] overflow-hidden"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <UiAction
                        label={"Permintaan Revisi Data contoh"}
                        className={
                          "box-border w-fit shrink-0 h-[44px] flex flex-row gap-[8px] p-[12px_12px_14px_12px] justify-start items-center [border-width:0px_0px_2px_0px] [border-style:solid] [border-color:#18181a]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"rate_review"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"rate_review"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Permintaan Revisi"}
                          data-text="true"
                        >
                          {"Permintaan Revisi"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#f97316] rounded-[9999px]"
                          }
                          data-pencil-name={"Data contoh"}
                        >
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Data contoh"}
                          </div>
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Status pembayaran belum tersedia"}
                        className={
                          "box-border w-fit shrink-0 h-[44px] flex flex-row gap-[8px] p-[12px_12px_14px_12px] justify-start items-center"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"account_balance_wallet"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"account_balance_wallet"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Pembayaran Termin"}
                          data-text="true"
                        >
                          {"Pembayaran Termin"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                          }
                          data-pencil-name={"Belum tersedia"}
                        >
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Belum tersedia"}
                          </div>
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Log komentar contoh"}
                        className={
                          "box-border w-fit shrink-0 h-[44px] flex flex-row gap-[8px] p-[12px_12px_14px_12px] justify-start items-center"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"chat"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"chat"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Log Komentar & Feed"}
                          data-text="true"
                        >
                          {"Log Komentar & Feed"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                          }
                          data-pencil-name={"8"}
                        >
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"8"}
                          </div>
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Dokumen BAST & Kontrak Belum tersedia"}
                        className={
                          "box-border w-fit shrink-0 h-[44px] flex flex-row gap-[8px] p-[12px_12px_14px_12px] justify-start items-center"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"attachment"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"attachment"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Dokumen BAST & Kontrak"}
                          data-text="true"
                        >
                          {"Dokumen BAST & Kontrak"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                          }
                          data-pencil-name={"Belum tersedia"}
                        >
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Belum tersedia"}
                          </div>
                        </div>
                      </UiAction>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-between items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                            data-responsive="row"
                          >
                            <div
                              className={
                                "box-border w-[53.48px] shrink-0 h-[36px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[4px]"
                              }
                              data-pencil-name={"#REV-01"}
                            >
                              <div
                                className={
                                  "text-[12px]/[16px] box-border w-[37.48px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[0.12px] text-left"
                                }
                                data-text="true"
                              >
                                {"#REV-01"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[92.75px] shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                              }
                              data-pencil-name={"Revisi Gratis Ke-1"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border w-[76.75px] text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left"
                                }
                                data-text="true"
                              >
                                {"Revisi Gratis Ke-1"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border w-[265.06px] shrink-0 h-[28px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "• Catatan revisi contoh • data sintetis"
                              }
                              data-text="true"
                              data-responsive="fixed"
                            >
                              {
                                "• Catatan revisi contoh; bukan permintaan klien aktual"
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[120.39px] shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#18181a] rounded-[4px]"
                              }
                              data-pencil-name={"Terima & Jadwalkan Fix"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border w-[100.39px] text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center"
                                }
                                data-text="true"
                                data-responsive="fixed"
                              >
                                {"Terima & Jadwalkan Fix"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-[107.64px] shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#ffffff] rounded-[4px]"
                              }
                              data-pencil-name={"Tolak (Out of Scope)"}
                              data-responsive="fixed"
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border w-[87.64px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center"
                                }
                                data-text="true"
                                data-responsive="fixed"
                              >
                                {"Tolak (Out of Scope)"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[14px]/[23px] box-border w-full h-[68.25px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                          }
                          data-pencil-name={
                            "“Mohon tambahkan 2 filter baru pada tabe"
                          }
                          data-text="true"
                        >
                          {
                            "“Mohon tambahkan filter pada tabel data operasional dan perbaiki tata letak logo di laporan cetak.”"
                          }
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[4px_0px_0px_0px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-0 justify-center items-center bg-[#eeeeee] rounded-[8px] overflow-hidden"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              aria-label={"Lampiran contoh disembunyikan"}
                              className={
                                "box-border w-[64px] shrink-0 h-[48px] bg-[#e5e5e5]"
                              }
                              data-pencil-name={"Placeholder lampiran"}
                            />
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"lampiran-contoh.png"}
                              data-text="true"
                            >
                              {"lampiran-contoh.png"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Contoh tidak aktif • menunggu persetujuan"
                              }
                              data-text="true"
                            >
                              {"Contoh tidak aktif • menunggu persetujuan"}
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
                            "Daftar contoh nonaktif • tidak terhubung ke data operasional"
                          }
                          data-text="true"
                        >
                          {"Daftar contoh nonaktif • tidak terhubung ke data operasional"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Buka arsip revisi masa lampau"}
                          data-text="true"
                        >
                          {"Buka arsip revisi masa lampau"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_8px_#0000000a] flex flex-col gap-[12px] p-[20px_0px] justify-start items-start bg-[#ffffff] rounded-[12px]"
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
                      "box-border w-full px-5 h-fit shrink-0 flex flex-row gap-[8px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Daftar Antrean & Proyek Klien Lainnya"
                        }
                        data-text="true"
                      >
                        {"Daftar Antrean & Proyek Klien Lainnya"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Menampilkan seluruh proyek yang saat ini"
                        }
                        data-text="true"
                      >
                        {
                          "Daftar ini hanya contoh statis dan tidak terhubung ke sistem tracking."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                       data-pencil-name={"Jumlah proyek belum diverifikasi"}
                      data-text="true"
                    >
                       {"Jumlah proyek belum diverifikasi"}
                    </div>
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
                      "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"table"}
                    role="table"
                  >
                    <div
                      className={
                        "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_1px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#f0f0f0]"
                      }
                      data-pencil-name={"tr"}
                    >
                      <div
                        className={
                          "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"KODE TRACKING"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"KODE TRACKING"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-[3] min-w-[240px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"NAMA PROYEK & KLIEN"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"NAMA PROYEK & KLIEN"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"TAHAP SAAT INI"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"TAHAP SAAT INI"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-[1.2] min-w-[110px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"PROGRES"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"PROGRES"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-[1.6] min-w-[140px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"STATUS KLIEN"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"STATUS KLIEN"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-start"
                        }
                        data-pencil-name={"NILAI KONTRAK"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"NILAI KONTRAK"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_8px] justify-center items-end"
                        }
                        data-pencil-name={"AKSI"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-right [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"AKSI"}
                        </div>
                      </div>
                    </div>
                    <DataRows
                      texts={[
                         "PRJ-DEMO-001   Data contoh   Proyek Contoh 1   Organisasi Demo   Draft   Status belum ditentukan   —   Tinjauan belum dilakukan   —   edit",
                         "PRJ-DEMO-002   Data contoh   Proyek Contoh 2   Organisasi Demo   Draft   Status belum ditentukan   —   Tinjauan belum dilakukan   —   more_vert",
                         "PRJ-DEMO-003   Data contoh   Proyek Contoh 3   Organisasi Demo   Draft   Status belum ditentukan   —   Tinjauan belum dilakukan   —   more_vert",
                      ]}
                      className={
                        "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"tbody"}
                    >
                      <div
                        className={
                          "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 justify-between items-center bg-[#e1e89c1a]"
                        }
                        data-pencil-name={"tr"}
                      >
                        <div
                          className={
                            "box-border flex-[1.5] min-w-[130px] shrink-0 h-[66px] flex flex-col gap-[2px] p-[16.5px_8px_14.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PRJ-DEMO-001"}
                            data-text="true"
                          >
                            {"PRJ-DEMO-001"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PIN dikirim terpisah"}
                            data-text="true"
                          >
                            {"PIN dikirim terpisah"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[3] min-w-[240px] shrink-0 h-[66px] flex flex-col gap-0 p-[17px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Proyek Contoh 1"}
                            data-text="true"
                          >
                            {"Proyek Contoh 1"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Klien Demo"}
                            data-text="true"
                          >
                            {"Klien Demo"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-0 p-[25px_8px_23px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                            }
                            data-pencil-name={"Tahap 5: Review Klien"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tahap 5: Review Klien"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[26px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[105.31px] h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[64px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#eeeeee] rounded-[9999px] overflow-hidden"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[49.91px] h-[6px] shrink-0 bg-[#f97316]"
                                }
                                data-pencil-name={"div"}
                              ></div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Belum diverifikasi"}
                              data-text="true"
                            >
                              {"Belum diverifikasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.6] min-w-[140px] shrink-0 h-fit flex flex-col gap-0 p-[27px_8px_25px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[100.77px] h-[14px] shrink-0 flex flex-row gap-0 p-[0px_0px_0px_14px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Review Terbuka"}
                              data-text="true"
                            >
                              {"Review Terbuka"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.4] min-w-[120px] shrink-0 h-[66px] flex flex-col gap-0 p-[14px_8px] justify-center items-start"
                          }
                          data-pencil-name={"Belum tersedia"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Belum tersedia"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[18px_8px_18px_16.03px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"edit"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[4px] justify-start items-start bg-[#ffffff] rounded-[4px]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"edit"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"edit"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                        }
                        data-pencil-name={"tr"}
                      >
                        <div
                          className={
                            "box-border flex-[1.5] min-w-[130px] shrink-0 h-[66px] flex flex-col gap-[2px] p-[16.5px_8px_14.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PRJ-DEMO-002"}
                            data-text="true"
                          >
                            {"PRJ-DEMO-002"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PIN dikirim terpisah"}
                            data-text="true"
                          >
                            {"PIN dikirim terpisah"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[3] min-w-[240px] shrink-0 h-[66px] flex flex-col gap-0 p-[17px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Proyek Contoh 2"
                            }
                            data-text="true"
                          >
                            {"Proyek Contoh 2"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Klien Demo"}
                            data-text="true"
                          >
                            {"Klien Demo"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-0 p-[25px_8px_23px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                            }
                            data-pencil-name={"Tahap 3: Coding Core"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tahap 3: Coding Core"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[26px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[105.31px] h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[64px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#eeeeee] rounded-[9999px] overflow-hidden"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[32px] h-[6px] shrink-0 bg-[#18181a]"
                                }
                                data-pencil-name={"div"}
                              ></div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Belum diverifikasi"}
                              data-text="true"
                            >
                              {"Belum diverifikasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.6] min-w-[140px] shrink-0 h-fit flex flex-col gap-0 p-[27px_8px_25px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[120.52px] h-[14px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                          >
                            <div
                              className={
                                "box-border w-[8px] shrink-0 h-[8px] bg-[#9ca3af] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Pengerjaan Internal"}
                              data-text="true"
                            >
                              {"Pengerjaan Internal"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.4] min-w-[120px] shrink-0 h-[66px] flex flex-col gap-0 p-[14px_8px] justify-center items-start"
                          }
                          data-pencil-name={"Belum tersedia"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Belum tersedia"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[18px_8px_18px_16.03px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"more_vert"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"more_vert"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"more_vert"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                        }
                        data-pencil-name={"tr"}
                      >
                        <div
                          className={
                            "box-border flex-[1.5] min-w-[130px] shrink-0 h-[65.5px] flex flex-col gap-[2px] p-[16.5px_8px_14px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PRJ-DEMO-003"}
                            data-text="true"
                          >
                            {"PRJ-DEMO-003"}
                          </div>
                          <div
                            className={
                              "text-[10px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PIN dikirim terpisah"}
                            data-text="true"
                          >
                            {"PIN dikirim terpisah"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[3] min-w-[240px] shrink-0 h-[65.5px] flex flex-col gap-0 p-[17px_8px_16.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Proyek Contoh 3"
                            }
                            data-text="true"
                          >
                            {"Proyek Contoh 3"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Klien Demo"}
                            data-text="true"
                          >
                            {"Klien Demo"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-0 p-[25px_8px_22.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                            }
                            data-pencil-name={"Tahap 2: UI/UX Figma"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tahap 2: UI/UX Figma"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[26px_8px_25.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[105.31px] h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[64px] shrink-0 h-fit flex flex-col gap-0 justify-start items-start bg-[#eeeeee] rounded-[9999px] overflow-hidden"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[16px] h-[6px] shrink-0 bg-[#18181a]"
                                }
                                data-pencil-name={"div"}
                              ></div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Belum diverifikasi"}
                              data-text="true"
                            >
                              {"Belum diverifikasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.6] min-w-[140px] shrink-0 h-fit flex flex-col gap-0 p-[27px_8px_24.5px_8px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "box-border w-[113.34px] h-[14px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                            }
                            data-pencil-name={"span"}
                          >
                            <div
                              className={
                                "box-border w-[8px] shrink-0 h-[8px] bg-[#9ca3af] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Review Wireframe"}
                              data-text="true"
                            >
                              {"Review Wireframe"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border flex-[1.4] min-w-[120px] shrink-0 h-[65.5px] flex flex-col gap-0 p-[14px_8px] justify-center items-start"
                          }
                          data-pencil-name={"Belum tersedia"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Belum tersedia"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[18px_8px_17.5px_16.03px] justify-start items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"more_vert"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"more_vert"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"more_vert"}
                            </div>
                          </UiAction>
                        </div>
                      </div>
                    </DataRows>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-full px-5 h-fit shrink-0 flex flex-row gap-[8px] p-[4px_20px_0px_20px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={
                        "Menampilkan 1 hingga 3 dari 18 total cat"
                      }
                      data-text="true"
                    >
                      {"Menampilkan 1 hingga 3 dari 18 total catatan proyek"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[3.99px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit opacity-[0.5] flex flex-col gap-0 p-[4px_8px] justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                        }
                        data-pencil-name={"Sebelumnya"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Sebelumnya"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#18181a] rounded-[4px]"
                        }
                        data-pencil-name={"1"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"1"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                        }
                        data-pencil-name={"2"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"2"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                        }
                        data-pencil-name={"3"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"3"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_8px] justify-center items-center bg-[#f0f0f0] rounded-[4px]"
                        }
                        data-pencil-name={"Berikutnya"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Berikutnya"}
                        </div>
                      </div>
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
