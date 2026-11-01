// Ported from prototype/stitch/cms/invoice-penagihan.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsInvoicePenagihan() {
  return (
    <ScreenState screen={"cms/invoice-penagihan"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 14 - Invoice & Penagihan Termin"}
        data-screen={"cms/invoice-penagihan"}
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
                  {"Invoice & Penagihan"}
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
                  {"Manajemen Invoice & Penagihan Termin"}
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
                    {"Data dan status contoh • belum diverifikasi"}
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
                  "Tampilan contoh penagihan. Nilai, tahapan pembayaran, dan status bukan data transaksi atau ketentuan operasional."
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
                  {"file_download"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Ekspor Rekap (CSV)"}
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
                  {"Terbitkan Invoice"}
                </div>
              </div>
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
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"TOTAL PIUTANG BERJALAN"}
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
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
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
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"TERIMA BULAN INI"}
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
                    {"account_balance_wallet"}
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
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status contoh"}
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
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"MENUNGGU BAST RESMI"}
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
                    {"draw"}
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
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                  {"Termin sesuai kesepakatan"}
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
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"RINGKASAN PEMBAYARAN"}
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
                    {"speed"}
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
                  {"Belum tersedia"}
                </div>
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
                    {"Metrik belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DataRows
            texts={[
              "Invoice contoh • status belum diverifikasi     search   Cari No. Invoice / organisasi...",
              "INVOICE & KLIEN   PROYEK & TAHAP TERMIN   NILAI TAGIHAN   JATUH TEMPO   STATUS & DOKUMEN   AKSI",
              "Data invoice contoh   Organisasi Contoh     Proyek Contoh   Termin sesuai kesepakatan     —     —       Status belum diverifikasi    Dokumen contoh      Pratinjau",
              "Data invoice contoh   Organisasi Contoh     Proyek Contoh   Termin sesuai kesepakatan     —     —       Status belum diverifikasi    Dokumen contoh      Pratinjau",
              "Data invoice contoh   Organisasi Contoh     Proyek Contoh   Termin sesuai kesepakatan     —     —       Status belum diverifikasi    Dokumen contoh      Pratinjau",
              "Data invoice contoh   Organisasi Contoh     Proyek Contoh   Termin sesuai kesepakatan     —     —       Status belum diverifikasi    Dokumen contoh      Pratinjau",
            ]}
            rowFlags={[false, false, true, true, true, true]}
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
            }
            data-pencil-name={"Invoice Table Container"}
            data-section-padding="true"
            data-custom-table="true"
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
              data-pencil-name={"Filter Bar"}
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[2px] p-[2px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Invoice contoh"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#00000000] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status pembayaran belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#00000000] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status pembayaran belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#00000000] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status serah terima belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-[220px] shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
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
                  label={"Cari No. Invoice / Klien..."}
                  className={
                    "text-[12px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-text="true"
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="w-full min-w-[960px] flex flex-col gap-0">
                <div
                  className={
                    "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F0F0F099] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[2] min-w-[180px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"INVOICE & KLIEN"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[2.5] min-w-[220px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PROYEK & TAHAP TERMIN"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[1.4] min-w-[120px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"NILAI TAGIHAN"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[1.3] min-w-[110px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"JATUH TEMPO"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[2] min-w-[170px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"STATUS & DOKUMEN"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-[120px] shrink-0 text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-right [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"AKSI"}
                  </div>
                </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[60px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Invoice Row"}
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Data invoice contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2.5] min-w-[220px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Proyek Contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Termin sesuai kesepakatan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.3] min-w-[110px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[170px] shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F59E0B1A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#F59E0B] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#F59E0B] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Dokumen contoh • belum disetujui"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"description"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PDF"}
                  </div>
                </div>
                <UiAction
                  label={"Kirim WA"}
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Pratinjau"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[60px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Invoice Row"}
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Data invoice contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2.5] min-w-[220px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Proyek Contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Termin sesuai kesepakatan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.3] min-w-[110px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[170px] shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Dokumen contoh • belum disetujui"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"description"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PDF"}
                  </div>
                </div>
                <UiAction
                  label={"Kirim WA"}
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Pratinjau"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[60px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Invoice Row"}
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Data invoice contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2.5] min-w-[220px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Proyek Contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Termin sesuai kesepakatan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.3] min-w-[110px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[170px] shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status serah terima belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Dokumen contoh • belum disetujui"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"description"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PDF"}
                  </div>
                </div>
                <UiAction
                  label={"Kirim WA"}
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Pratinjau"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[60px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Invoice Row"}
            >
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Data invoice contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Organisasi Contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2.5] min-w-[220px] shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Proyek Contoh"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Termin sesuai kesepakatan"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.4] min-w-[120px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.3] min-w-[110px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"—"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[170px] shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F59E0B1A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#F59E0B] rounded-[50%]"
                    }
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#F59E0B] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Dokumen contoh • belum disetujui"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[120px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"description"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PDF"}
                  </div>
                </div>
                <UiAction
                  label={"Kirim WA"}
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Pratinjau"}
                  </div>
                </UiAction>
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
