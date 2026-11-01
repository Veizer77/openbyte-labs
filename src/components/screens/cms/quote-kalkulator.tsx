// Ported from prototype/stitch/cms/quote-kalkulator.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsQuoteKalkulator() {
  return (
    <ScreenState screen={"cms/quote-kalkulator"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 08 - Quote Kalkulator"}
        data-screen={"cms/quote-kalkulator"}
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
                  {"Quote Kalkulator"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                }
              >
                <h1
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap] m-0"
                  }
                  data-text="true"
                  data-heading="true"
                >
                  {"Log Simulasi & Estimasi Biaya Klien"}
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
                    {"Kalkulator • pratinjau statis"}
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
                  "Riwayat submission simulasi harga otomatis dari publik, rincian add-on arsitektur, dan konversi cepat ke proposal penawaran resmi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"tune"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Konfigurasi Formula"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
              >
                <UiAction
                  label={"download"}
                  className={
                    "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"download"}
                </UiAction>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Unduh Rekap Excel"}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start"
            }
            data-pencil-name={"Quote Metrics"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
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
                  {"Total Simulasi (30 Hari)"}
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
                    {"calculate"}
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
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Metrik belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
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
                  {"Rata-rata Nilai Quote"}
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
                    {"payments"}
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
                    {"—"}
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
                    {"Data contoh"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
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
                  {"Konversi ke Konsultasi"}
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
                    {"conversion_path"}
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
                    {"—"}
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
                    {"Jumlah prospek belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
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
                  {"Kombinasi Terpopuler"}
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
                    {"pie_chart"}
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
                  {"Web + GIS"}
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
                    {"Metrik belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
            }
            data-pencil-name={"Split Workspace"}
            data-responsive="row"
          >
            <div
              className={
                "box-border xl:col-span-7 w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-4 sm:p-5 justify-start items-start bg-[#FFFFFF] rounded-[16px]"
              }
              data-pencil-name={"Left Log List"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full sm:w-[320px] shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
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
                    label={"Cari ID quote atau instansi..."}
                    className={
                      "text-[12px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  />
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status: Semua"}
                  </div>
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"expand_more"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#F4F4F580] [outline:1.5px_solid_#18181A] [outline-offset:-0.75px] rounded-[12px]"
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
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Ref contoh"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"• 14 mnt lalu"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#FFEDD5] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#C2410C] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Menunggu Follow-up"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 1"}
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Enterprise Web + Cloud GIS PostGIS"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#F0F0F0] [outline-offset:-0.5px] rounded-[12px]"
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
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Ref contoh"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"• 2 jam lalu"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#EFF6FF] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#1D4ED8] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Dikontak via WA"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 2"}
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Mobile App Flutter + API Gateway"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#F0F0F0] [outline-offset:-0.5px] rounded-[12px]"
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
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Ref contoh"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"• Kemarin"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Deal Won (Proyek #09)"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 3"}
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Paket Layanan Demo"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#F0F0F0] [outline-offset:-0.5px] rounded-[12px]"
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
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Ref contoh"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"• 2 hari lalu"}
                    </div>
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
                      {"Proposal Terkirim"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 4"}
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Paket Layanan Demo"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border xl:col-span-5 w-full h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[16px] p-4 sm:p-6 justify-start items-start bg-[#FFFFFF] rounded-[16px]"
              }
              data-pencil-name={"Right Inspector"}
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
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#18181A] rounded-[6px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"DETAIL SIMULASI"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Ref contoh"}
                  </div>
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Hari ini, 13:42 WIB"}
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#F9F9FB] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                    {"Organisasi Demo 1"}
                </div>
                <div
                  className={
                    "text-[12px]/[17px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Kontak: disamarkan untuk data contoh"
                  }
                </div>
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"RINCIAN PILIHAN MODUL & SPESIFIKASI"}
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-full min-h-[44.5px] shrink-0 flex flex-row gap-0 p-[8px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Enterprise Web Base Architecture (Next.js 14)"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Fondasi"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[44.5px] shrink-0 flex flex-row gap-0 p-[8px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"PostGIS WebGIS Batas Afdeling & Geospasial"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Add-on Spasial"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[44.5px] shrink-0 flex flex-row gap-0 p-[8px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"SHA-256 QR Tanda Tangan Kriptografi"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Keamanan"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[44.5px] shrink-0 flex flex-row gap-0 p-[8px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                    {"Dukungan, SLA, dan biaya ditetapkan hanya lewat kesepakatan tertulis"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Infrastruktur"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full min-h-[44.5px] shrink-0 flex flex-row gap-0 p-[8px_0px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
                  }
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Infrastruktur dan penyimpanan ditinjau per proyek"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Deployment"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"—"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[16px] justify-between items-center bg-[#18181A] rounded-[12px]"
                }
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"TOTAL ESTIMASI BIAYA PROYEK"}
                  </div>
                  <div
                    className={
                      "text-[22px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-end"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Target Delivery"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"5 - 6 Minggu"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-full h-[40px] shrink-0 flex flex-row gap-[8px] justify-center items-center bg-[#82B440] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Hubungi Klien via WhatsApp Direct"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border [flex:1_1_0] h-[36px] flex flex-row gap-[6px] justify-center items-center bg-[#18181A] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"picture_as_pdf"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Kirim PDF Penawaran"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-[36px] flex flex-row gap-[6px] justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"assignment_turned_in"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Konversi ke Proyek"}
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
