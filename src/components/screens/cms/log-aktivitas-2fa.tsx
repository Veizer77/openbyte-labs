// Ported from prototype/stitch/cms/log-aktivitas-2fa.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsLogAktivitas2fa() {
  return (
    <ScreenState screen={"cms/log-aktivitas-2fa"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 13 - Log Aktivitas & 2FA"}
        data-screen={"cms/log-aktivitas-2fa"}
        id="konten"
        tabIndex={-1}
      >
        <AdminSidebar />
        <div
          className="box-border w-full min-h-screen flex flex-col lg:pl-[288px] relative z-0"
          data-layout="canvas-content"
        >
          <AdminHeader />
          <main
            className={
              "box-border w-full h-fit flex flex-col gap-[20px] pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto bg-[#f9f9f9] relative z-0 flex-1"
            }
            data-pencil-name={"main"}
            data-section-padding="true"
          >
            <div
              className={
                "box-border w-full h-fit flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end"
              }
              data-pencil-name={"Page Header"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border flex-1 min-w-0 h-fit flex flex-col gap-[6px] justify-start items-start"
                }
                data-pencil-name={"Title Column"}
              >
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                }
                data-pencil-name={"Breadcrumb"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"CMS"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Operasional Klien"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Log Aktivitas & 2FA"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                }
                data-responsive="row"
              >
                <h1
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap] m-0"
                  }
                  data-text="true"
                  data-heading="true"
                >
                  {"Aktivitas Admin • Draf Tampilan"}
                </h1>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status keamanan belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "text-[13px]/[19px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                }
                data-text="true"
              >
                {
                  "Tampilan contoh. Implementasi pencatatan, autentikasi, enkripsi, dan retensi belum diverifikasi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
            >
              <UiAction
                label={"Export Audit Log (JSON)"}
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[8px] cursor-pointer border-0"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"download"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Export Audit Log (JSON)"}
                </div>
              </UiAction>
              <UiAction
                label={"Kebijakan Akses 2FA"}
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] hover:bg-[#27272A] transition-colors rounded-[8px] cursor-pointer border-0"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"shield"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Kebijakan Akses 2FA"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"KPI Metrics"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Status Keamanan Platform"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"verified"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
              >
                <div
                  className={
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Status belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"0 insiden anomali"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                    {"Status MFA"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"lock"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
              >
                <div
                  className={
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Status MFA belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"4 TOTP Keypair"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Sesi contoh • status belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"devices"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
              >
                <div
                  className={
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Sesi contoh • status belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Lokasi tidak ditampilkan"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Aktivitas log contoh"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"history_edu"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
              >
                <div
                  className={
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Data contoh"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Pencatatan contoh"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
            }
            data-pencil-name={"Audit Workspace"}
            data-responsive="row"
          >
            <div
              className={
                "box-border xl:col-span-4 shrink-0 h-fit [box-shadow:0px_2px_4px_#0000001a] flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#18181A] rounded-[16px] w-full"
              }
              data-pencil-name={"2FA Governance Card"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[18px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"security"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Konfigurasi autentikasi (contoh)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#E2E89D] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#454A10] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Konfigurasi contoh • belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                }
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"smartphone"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Metode autentikasi contoh"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "text-[11px]/[16px] box-border w-full text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Informasi perangkat dan kode pemulihan tidak dimuat dalam tampilan contoh."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                }
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"SESI LOGIN SAAT INI"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                      }
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Status belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Alamat jaringan tidak ditampilkan"}
                </div>
                <div
                  className={
                    "text-[11px]/[16px] box-border w-full text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Perangkat, koneksi, dan waktu aktivitas contoh; belum mencerminkan status operasional."
                  }
                </div>
              </div>
              <div
                className={
                  "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"KEBIJAKAN GOVERNANCE • DRAF"}
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"check_circle"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border [flex:1_1_0] text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Kebijakan MFA perlu ditinjau sebelum diaktifkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"check_circle"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border [flex:1_1_0] text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Durasi sesi belum ditetapkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"check_circle"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border [flex:1_1_0] text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Deteksi dan geofencing belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"check_circle"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border [flex:1_1_0] text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Metode integritas log belum diverifikasi"}
                  </div>
                </div>
              </div>
              <UiAction
                label={"Revoke Semua Sesi Lain"}
                className={
                  "box-border w-full h-[36px] shrink-0 flex flex-row gap-[6px] justify-center items-center bg-[#333338] hover:bg-[#3f3f46] transition-colors rounded-[8px] cursor-pointer border-0"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"logout"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Revoke Semua Sesi Lain"}
                </div>
              </UiAction>
            </div>
            <div
              className={
                "box-border xl:col-span-8 shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[16px] w-full"
              }
              data-pencil-name={"Audit Trail Card"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[2px] p-[2px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-center items-center bg-[#18181A] rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                    {"Log contoh • jumlah belum diverifikasi"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-center items-center rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                    {"Autentikasi • contoh"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-center items-center rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                    {"Mutasi proyek • contoh"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-center items-center rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                    {"Audit keamanan • contoh"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[220px] shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"search"}
                  </div>
                  <SearchField
                    label={"Cari IP, aksi, atau hash..."}
                    className={
                      "text-[12px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  />
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="w-full min-w-[700px] flex flex-col gap-0">
                  <div
                    className={
                      "box-border w-full min-w-[700px] h-fit shrink-0 flex flex-row gap-[14px] p-[10px_16px] justify-between items-center bg-[#F0F0F099] rounded-[8px]"
                    }
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"WAKTU"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"AKTOR & IP"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border flex-[3] min-w-[220px] h-fit flex flex-row gap-0 justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"AKTIVITAS & MUTASI"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                    {"ID log"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                      }
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"STATUS"}
                      </div>
                    </div>
                  </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"14:02:18 WIB"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Hari ini"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Akun admin contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Aktivitas contoh • metadata media belum diverifikasi"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Target: Portofolio ID #01"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:7f4a...9b12"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Contoh"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"13:48:02 WIB"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Hari ini"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Akun admin contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Peristiwa autentikasi contoh • belum diverifikasi"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Target: Auth Session #889"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:3e8c...1a4f"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Contoh"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"11:20:44 WIB"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Hari ini"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"system (Worker)"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Aktivitas contoh • penyimpanan belum diverifikasi"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Target penyimpanan tidak ditampilkan • belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:9d11...55be"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Contoh"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"09:15:30 WIB"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Hari ini"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Akun admin contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Generate Token Akses Pelacakan Klien (Proyek Demo)"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Target: token contoh disamarkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:b402...ee31"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Contoh"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Kemarin, 22:10"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"22 Okt 2025"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Akun admin contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Perubahan Konfigurasi SEO Meta & Webhook Telegram"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Target: Site Settings CMS"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:1f90...8c22"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Contoh"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[700px] h-auto min-h-[72px] shrink-0 flex flex-row gap-[14px] p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px] mobile-auto-height"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Kemarin, 16:32"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"22 Okt 2025"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[140px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"system (Security)"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Alamat jaringan tidak ditampilkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-text="true"
                  >
                    {"Blokir Percobaan Brute Force Login (5x Salah Password)"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {"Kontrol akses belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 p-[3px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"sha256:6a55...dd01"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[75px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#FFEDD5] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#C2410C] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Blocked"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_4px_0px_4px] justify-between items-center"
            }
                data-responsive="row"
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                    {"Data aktivitas contoh • bukan catatan sistem aktual"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <UiAction
                    label={"Sebelumnya"}
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[6px] cursor-pointer border-0"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Sebelumnya"}
                    </div>
                  </UiAction>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#18181A] rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"1"}
                    </div>
                  </div>
                  <UiAction
                    label={"Berikutnya"}
                    className={
                      "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[6px] cursor-pointer border-0"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Berikutnya"}
                    </div>
                  </UiAction>
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
