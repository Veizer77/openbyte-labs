// Ported from prototype/stitch/cms/inquiry-pemesanan.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsInquiryPemesanan() {
  return (
    <ScreenState screen={"cms/inquiry-pemesanan"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 07 - Inquiry & Pemesanan"}
        data-screen={"cms/inquiry-pemesanan"}
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
                  {"Inquiry & Pemesanan"}
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
                  {"Pipa Masuk & Permintaan Penawaran"}
                </h1>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#F973161A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#F97316] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Data contoh"}
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
                  "Tampilan contoh. Jumlah prospek, nilai, status, dan konversi bukan data operasional."
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
                <UiAction
                  label={"download"}
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"download"}
                </UiAction>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Export CSV"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Input Prospek Manual"}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"Pipeline Metrics"}
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
                  {"Permintaan Baru"}
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
                    {"inbox"}
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
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F973161A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
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
                  {"Kualifikasi Teknis"}
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
                    {"rule"}
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
                    {"Nilai belum ditetapkan"}
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
                  {"Proposal Terkirim"}
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
                    {"send"}
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
                    {"Menunggu approval"}
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
                  {"Closing Won (Bulan Ini)"}
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
                    {"task_alt"}
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
                    {"Status proyek belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#FFFFFF] rounded-[12px]"
            }
            data-pencil-name={"Filter Bar"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[2px] p-[2px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_12px] justify-center items-center bg-[#18181A] rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Semua (26)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_12px] justify-center items-center rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Baru (12)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_12px] justify-center items-center rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Kualifikasi (6)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_12px] justify-center items-center rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Proposal (5)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 p-[6px_12px] justify-center items-center rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Deal Won (3)"}
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
            >
              <div
                className={
                  "box-border w-[240px] shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
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
                  label={"Cari nama atau instansi..."}
                  className={
                    "text-[12px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-text="true"
                />
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"filter_list"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Semua Sumber"}
                </div>
              </div>
            </div>
          </div>
          <DataRows
            texts={[
              "KLIEN & INSTANSI     KEBUTUHAN & STACK     ESTIMASI BIAYA     SUMBER     STATUS     AKSI",
              "Organisasi Demo 1   Kontak disamarkan     Kebutuhan proyek contoh   Teknologi contoh     —     chat   Sumber demo       Status demo       chat     visibility     more_vert",
              "Organisasi Demo 2   Kontak disamarkan     Kebutuhan proyek contoh   Teknologi contoh     —     language   Sumber demo       Status demo       chat     visibility     more_vert",
              "Organisasi Demo 3   Kontak disamarkan     Kebutuhan proyek contoh   Teknologi contoh     —     calendar_today   Sumber demo       Status demo       chat     visibility     more_vert",
              "Organisasi Demo 4   Kontak disamarkan     Kebutuhan proyek contoh   Teknologi contoh     —     language   Sumber demo       Status demo       chat     visibility     more_vert",
              "Organisasi Demo 5   Kontak disamarkan     Kebutuhan proyek contoh   Teknologi contoh     —     handshake   Sumber demo       Status demo       chat     visibility     more_vert",
              "Data contoh • bukan prospek atau status database aktual",
            ]}
            rowFlags={[false, true, true, true, true, true, false]}
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
            }
            data-pencil-name={"Leads Table Card"}
            data-custom-table="true"
          >
            <div className="w-full overflow-x-auto">
              <div className="w-full min-w-[960px] flex flex-col gap-0">
                <div
                  className={
                    "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F0F0F099] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"KLIEN & INSTANSI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[3] min-w-[240px] h-fit flex flex-row gap-0 justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"KEBUTUHAN & STACK"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"ESTIMASI BIAYA"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"SUMBER"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
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
                  <div
                    className={
                      "box-border w-[90px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"AKSI"}
                    </div>
                  </div>
                </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[70px] shrink-0 flex flex-row gap-0 p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo"}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Kontak disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[3] min-w-[240px] h-fit flex flex-col gap-[2px] p-[0px_16px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Sistem Monitoring IoT Lahan Sawit & Batas Afdeling"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Next.js 14, PostGIS, MQTT Gateway"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chat"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"WhatsApp Direct"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#F0F0F0] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#52525B] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Proposal Terkirim"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#82B4401A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"visibility"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"visibility"}
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"more_vert"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[70px] shrink-0 flex flex-row gap-0 p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo"}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Kontak disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[3] min-w-[240px] h-fit flex flex-col gap-[2px] p-[0px_16px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Proyek Contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Enterprise Web App, Filament CMS"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"language"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Website Form"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#F3E8FF] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#9333EA] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#6B21A8] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Kualifikasi Teknis"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#82B4401A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"visibility"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"visibility"}
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"more_vert"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[70px] shrink-0 flex flex-row gap-0 p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 3"}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Kontak disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[3] min-w-[240px] h-fit flex flex-col gap-[2px] p-[0px_16px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Fleet Telematics & Driver Fuel Sensor Mobile App"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Flutter, Offline SQLite, Supabase Realtime"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"calendar_today"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Booking Meet"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#FFEDD5] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#EA580C] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#C2410C] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Negosiasi Final"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#82B4401A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"visibility"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"visibility"}
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"more_vert"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[58px] shrink-0 flex flex-row gap-0 p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 4"}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Kontak disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[3] min-w-[240px] h-fit flex flex-col gap-[2px] p-[0px_16px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Katalog Portofolio Fotografi & Booking Studio"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Teknologi contoh • belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"language"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Website Form"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#DCFCE7] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#22C55E] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#15803D] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Lead Baru"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#82B4401A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"visibility"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"visibility"}
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"more_vert"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[70px] shrink-0 flex flex-row gap-0 p-[12px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0] rounded-[8px]"
              }
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                  }
                  data-text="true"
                >
                  {"Organisasi Demo 5"}
                </div>
                <div
                  className={
                    "text-[11px]/[14px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Kontak disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[3] min-w-[240px] h-fit flex flex-col gap-[2px] p-[0px_16px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-text="true"
                >
                  {"Contoh Sistem Layanan Digital"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Desktop Electron + Node.js Crypto SHA-256"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"handshake"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Rekomendasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#D2D88F] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Deal Won"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#82B4401A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"visibility"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"visibility"}
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <UiAction
                    label={"more_vert"}
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_4px_0px_4px] justify-between items-center"
          }
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {
                  "Data contoh • bukan prospek atau status database aktual"
                }
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
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
                </div>
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
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
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
                </div>
              </div>
            </div>
          </DataRows>
        </main>
        </div>
      </div>
    </ScreenState>
  );
}
