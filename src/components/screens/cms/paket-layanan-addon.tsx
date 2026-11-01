// Ported from prototype/stitch/cms/paket-layanan-addon.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  FilterButton,
  DataRows,
  ScreenState,
  ToggleControl,
} from "@/components/preview/Controls";
export default function CmsPaketLayananAddon() {
  return (
    <ScreenState screen={"cms/paket-layanan-addon"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 09 - Paket Layanan & Add-on"}
        data-screen={"cms/paket-layanan-addon"}
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
                data-pencil-name={"Title Col"}
              >
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                }
                data-pencil-name={"Breadcrumb"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Crumb"}
                  data-text="true"
                >
                  {"CMS"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Chevron"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Crumb"}
                  data-text="true"
                >
                  {"Katalog Layanan"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Chevron"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Crumb"}
                  data-text="true"
                >
                  {"Paket Layanan & Add-on"}
                </div>
              </div>
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Title"}
                data-text="true"
              >
                {"Katalog Paket Layanan & Add-on Modular"}
              </div>
              <div
                className={
                  "text-[13px]/[19px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                }
                data-pencil-name={"Description"}
                data-text="true"
              >
                {
                   "Pratinjau paket contoh • ruang lingkup, revisi, jadwal, dan harga belum disetujui untuk publikasi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
              }
              data-pencil-name={"Header Actions"}
            >
              <UiAction
                label={"Preview Web Publik"}
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000008] flex flex-row gap-[6px] p-[0px_14px] justify-start items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Web Link Button"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"open_in_new"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Preview Web Publik"}
                </div>
              </UiAction>
              <UiAction
                label={"Tambah Item Baru"}
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[0px_16px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
                data-pencil-name={"Add Button"}
              >
                <div
                  className={
                    "text-[18px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Tambah Item Baru"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start"
            }
            data-pencil-name={"KPI Metrics Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card - KATALOG PAKET DRAF"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"KATALOG PAKET • DRAF"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"inventory_2"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Bottom Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"3 Tier Standar"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sub"}
                    data-text="true"
                  >
                    {"Kategori dan isi menunggu persetujuan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#82B4401A] rounded-[9999px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Katalog contoh • nonaktif"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card - KATALOG ADD-ON MODULAR"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"KATALOG ADD-ON MODULAR"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"extension"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Bottom Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Modul contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sub"}
                    data-text="true"
                  >
                    {"Harga belum disetujui"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"4 Kategori"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card - TIER PALING DIMINATI"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"TIER PALING DIMINATI"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#D2D88F33] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"trending_up"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Bottom Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Professional Tier"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sub"}
                    data-text="true"
                  >
                    {"Data contoh • belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#D2D88F] rounded-[9999px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Contoh • belum disetujui"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[10px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card - RATA-RATA ORDER (AOV)"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"RATA-RATA ORDER (AOV)"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
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
                data-pencil-name={"Bottom Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sub"}
                    data-text="true"
                  >
                    {"Jumlah add-on belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#82B4401A] rounded-[9999px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
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
              "box-border w-full h-fit shrink-0 flex flex-col gap-[14px] justify-start items-start"
            }
            data-pencil-name={"Pricing Tiers Section"}
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
              data-pencil-name={"Section Header"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Header Left"}
              >
                <div
                  className={
                    "text-[20px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"layers"}
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Title"}
                  data-text="true"
                >
                  {"Tier Paket Layanan Inti (Core Packages)"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Count Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Text"}
                    data-text="true"
                  >
                    {"3 Tier • draf"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
                data-pencil-name={"Header Right"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px] justify-start items-start bg-[#F0F0F0] rounded-[8px]"
                  }
                  data-pencil-name={"Filter Tabs"}
                >
                  <FilterButton
                    value={"Semua Tier"}
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#18181A] rounded-[6px]"
                    }
                    data-pencil-name={"Tab - Semua Tier (3)"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label"}
                      data-text="true"
                    >
                      {"Semua Tier (3)"}
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Web"}
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start rounded-[6px]"
                    }
                    data-pencil-name={"Tab - Web"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label"}
                      data-text="true"
                    >
                      {"Web"}
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Sistem Informasi"}
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start rounded-[6px]"
                    }
                    data-pencil-name={"Tab - Sistem Informasi"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label"}
                      data-text="true"
                    >
                      {"Sistem Informasi"}
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Mobile"}
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_10px] justify-start items-start rounded-[6px]"
                    }
                    data-pencil-name={"Tab - Mobile"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label"}
                      data-text="true"
                    >
                      {"Mobile"}
                    </div>
                  </FilterButton>
                </div>
                <UiAction
                  label={"Urutan Tampil"}
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#FFFFFF] rounded-[6px]"
                  }
                  data-pencil-name={"Reorder Button"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"drag_indicator"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Urutan Tampil"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start"
              }
              data-pencil-name={"Tiers Grid"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#0000000a] flex flex-col gap-[12px] p-[18px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
                }
                data-pencil-name={"Tier Card - Starter UMKM & Bisnis"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-pencil-name={"Top Badges"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tier Tag"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Tag Text"}
                      data-text="true"
                    >
                      {"TIER 01 • STARTER"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] p-[3px_8px] justify-start items-center bg-[#82B44014] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"Dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Status Text"}
                      data-text="true"
                    >
                      {"Draf • tidak dipublikasikan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"Title Box"}
                >
                  <div
                    className={
                      "text-[17px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tier Name"}
                    data-text="true"
                  >
                    {"Starter UMKM & Bisnis"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[17px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Tagline"}
                    data-text="true"
                  >
                    {
                      "Draf • ruang lingkup, performa, dan spesifikasi belum disetujui."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[2px] p-[10px_12px] justify-start items-start bg-[#F8F9FA] rounded-[10px]"
                  }
                  data-pencil-name={"Price Box"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-end"
                    }
                    data-pencil-name={"Price Row"}
                  >
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Amount"}
                      data-text="true"
                    >
                      {"Harga belum ditetapkan"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Period"}
                      data-text="true"
                    >
                      {"/ project"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Note"}
                    data-text="true"
                  >
                    {"Draf • cakupan dan harga menunggu persetujuan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[8px_10px] justify-start items-start bg-[#FFFFFF] rounded-[8px]"
                  }
                  data-pencil-name={"Specs Box"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"schedule"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Estimasi Sprint:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Durasi belum ditetapkan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"published_with_changes"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Kuota Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"2x Sesi Penuh"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"add_task"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Ekstra Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Harga belum ditetapkan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"Deliverables Col"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Deliv Header"}
                    data-text="true"
                  >
                    {"SPESIFIKASI DELIVERABLE:"}
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Jumlah halaman dan ruang lingkup ditetapkan lewat penawaran tertulis"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Responsive mobile-first & sub-second load"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Tombol WhatsApp Direct order router"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"SEO on-page dasar (Schema & Sitemap)"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Konfigurasi domain dan infrastruktur perlu ditinjau"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_0px_0px_0px] justify-between items-center"
                  }
                  data-pencil-name={"Bottom Action Row"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Toggle Wrap"}
                  >
                    <ToggleControl
                      label={"Draf • tidak dipublikasikan"}
                      initialChecked={false}
                      className={
                        "box-border w-[32px] shrink-0 h-[18px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                      }
                      data-pencil-name={"Toggle Track"}
                    >
                      <div
                        className={
                          "box-border w-[14px] shrink-0 h-[14px] bg-[#FFFFFF] rounded-[50%]"
                        }
                        data-pencil-name={"Knob"}
                      ></div>
                    </ToggleControl>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Toggle Label"}
                      data-text="true"
                    >
                      {"Draf • tidak dipublikasikan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Actions"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                      data-pencil-name={"Edit Btn"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[13px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Edit Tier"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                      data-pencil-name={"More Btn"}
                    >
                      <UiAction
                        label={"more_vert"}
                        className={
                          "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"more_vert"}
                      </UiAction>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#00000026] flex flex-col gap-[12px] p-[18px] justify-start items-start bg-[#18181A] rounded-[14px]"
                }
                data-pencil-name={"Tier Card - Sistem Informasi / Instansi"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-pencil-name={"Top Badges"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#D2D88F] rounded-[6px]"
                    }
                    data-pencil-name={"Tier Tag"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Tag Text"}
                      data-text="true"
                    >
                      {"TIER 02 • PALING DIMINATI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] p-[3px_8px] justify-start items-center bg-[#242427] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Status Text"}
                      data-text="true"
                    >
                      {"Contoh • belum disetujui"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"Title Box"}
                >
                  <div
                    className={
                      "text-[17px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tier Name"}
                    data-text="true"
                  >
                    {"Sistem Informasi / Instansi"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[17px] box-border w-full text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Tagline"}
                    data-text="true"
                  >
                    {
                      "Solusi operasional otomatis, basis data relasional stabil & kontrol berjenjang."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[2px] p-[10px_12px] justify-start items-start bg-[#242427] rounded-[10px]"
                  }
                  data-pencil-name={"Price Box"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-end"
                    }
                    data-pencil-name={"Price Row"}
                  >
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Amount"}
                      data-text="true"
                    >
                    {"Harga belum ditetapkan"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Period"}
                      data-text="true"
                    >
                      {"/ project"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Note"}
                    data-text="true"
                  >
                    {"Draf • serah terima dan tingkat layanan menunggu persetujuan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[8px_10px] justify-start items-start bg-[#1F1F23] rounded-[8px]"
                  }
                  data-pencil-name={"Specs Box"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"schedule"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Estimasi Sprint:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Durasi belum ditetapkan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"published_with_changes"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Kuota Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"3x Sesi Penuh"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"add_task"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Ekstra Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Harga belum ditetapkan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"Deliverables Col"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Deliv Header"}
                    data-text="true"
                  >
                    {"SPESIFIKASI ARSITEKTUR CORE:"}
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Database relasional ACID (PostgreSQL / Supabase)"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Manajemen otentikasi multi-role RBAC"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Dashboard admin analitik & KPI metrik visual"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Engine ekspor laporan PDF & Excel otomatis"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Audit trail log aktivitas & mitigasi rollback"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_0px_0px_0px] justify-between items-center"
                  }
                  data-pencil-name={"Bottom Action Row"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Toggle Wrap"}
                  >
                    <ToggleControl
                      label={"Draf • tidak dipublikasikan"}
                      initialChecked={false}
                      className={
                        "box-border w-[32px] shrink-0 h-[18px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                      }
                      data-pencil-name={"Toggle Track"}
                    >
                      <div
                        className={
                          "box-border w-[14px] shrink-0 h-[14px] bg-[#FFFFFF] rounded-[50%]"
                        }
                        data-pencil-name={"Knob"}
                      ></div>
                    </ToggleControl>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Toggle Label"}
                      data-text="true"
                    >
                      {"Draf • tidak dipublikasikan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Actions"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#D2D88F] rounded-[6px]"
                      }
                      data-pencil-name={"Edit Btn"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[13px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Edit Tier"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[6px]"
                      }
                      data-pencil-name={"More Btn"}
                    >
                      <UiAction
                        label={"more_vert"}
                        className={
                          "text-[16px]/[normal] box-border text-[#A1A1AA] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"more_vert"}
                      </UiAction>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#0000000a] flex flex-col gap-[12px] p-[18px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
                }
                data-pencil-name={"Tier Card - Multiplatform & Flutter App"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-pencil-name={"Top Badges"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tier Tag"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Tag Text"}
                      data-text="true"
                    >
                      {"TIER 03 • MULTIPLATFORM"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] p-[3px_8px] justify-start items-center bg-[#82B44014] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"Dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Status Text"}
                      data-text="true"
                    >
                      {"Draf • tidak dipublikasikan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"Title Box"}
                >
                  <div
                    className={
                      "text-[17px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tier Name"}
                    data-text="true"
                  >
                    {"Multiplatform & Flutter App"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[17px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Tagline"}
                    data-text="true"
                  >
                    {
                      "Draf • spesifikasi, kinerja, dan hasil pengujian belum disetujui."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[2px] p-[10px_12px] justify-start items-start bg-[#F8F9FA] rounded-[10px]"
                  }
                  data-pencil-name={"Price Box"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-end"
                    }
                    data-pencil-name={"Price Row"}
                  >
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Amount"}
                      data-text="true"
                    >
                      {"Harga belum ditetapkan"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Period"}
                      data-text="true"
                    >
                      {"/ start from"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Note"}
                    data-text="true"
                  >
                    {"Draf • spesifikasi distribusi belum disetujui"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[8px_10px] justify-start items-start bg-[#FFFFFF] rounded-[8px]"
                  }
                  data-pencil-name={"Specs Box"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"schedule"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Estimasi Sprint:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Durasi belum ditetapkan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"published_with_changes"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Kuota Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"4x Sesi Penuh"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Spec Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"add_task"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Ekstra Revisi:"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Val"}
                      data-text="true"
                    >
                      {"Harga belum ditetapkan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"Deliverables Col"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Deliv Header"}
                    data-text="true"
                  >
                    {"SPESIFIKASI MOBILE NATIVE:"}
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Aplikasi Android native-feel (Flutter & Dart)"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Arsitektur offline-first SQLite / Hive local DB"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Akses hardware: Geolocation GPS & Kamera"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Integrasi dan autentikasi ditetapkan sesuai ruang lingkup yang disepakati"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Spesifikasi build dan distribusi belum disetujui"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_0px_0px_0px] justify-between items-center"
                  }
                  data-pencil-name={"Bottom Action Row"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Toggle Wrap"}
                  >
                    <ToggleControl
                      label={"Draf • tidak dipublikasikan"}
                      initialChecked={false}
                      className={
                        "box-border w-[32px] shrink-0 h-[18px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                      }
                      data-pencil-name={"Toggle Track"}
                    >
                      <div
                        className={
                          "box-border w-[14px] shrink-0 h-[14px] bg-[#FFFFFF] rounded-[50%]"
                        }
                        data-pencil-name={"Knob"}
                      ></div>
                    </ToggleControl>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Toggle Label"}
                      data-text="true"
                    >
                      {"Draf • tidak dipublikasikan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Actions"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                      data-pencil-name={"Edit Btn"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[13px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Edit Tier"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                      data-pencil-name={"More Btn"}
                    >
                      <UiAction
                        label={"more_vert"}
                        className={
                          "text-[16px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
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
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[12px] p-[18px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
            }
            data-pencil-name={"Modular Addons Section"}
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
              data-pencil-name={"Top Bar"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Left Title"}
              >
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"extension"}
                  </div>
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Title"}
                  data-text="true"
                >
                  {"Katalog Add-on Modular"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Text"}
                    data-text="true"
                  >
                    {"Modul contoh • nonaktif"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
                data-pencil-name={"Right Controls"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-[180px] shrink-0 h-[30px] flex flex-row gap-[6px] p-[0px_8px] justify-start items-center bg-[#F8F9FA] rounded-[6px]"
                  }
                  data-pencil-name={"Mini Search"}
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[15px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"search"}
                  </div>
                  <SearchField
                    label={"Cari modul add-on..."}
                    className={
                      "text-[12px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Placeholder"}
                    data-text="true"
                  />
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[3px] justify-start items-start bg-[#F0F0F0] rounded-[6px]"
                  }
                  data-pencil-name={"Category Filter"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#18181A] rounded-[4px]"
                    }
                    data-pencil-name={"Pill - Semua (6)"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Semua (6)"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start rounded-[4px]"
                    }
                    data-pencil-name={"Pill - Operasional"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Operasional"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start rounded-[4px]"
                    }
                    data-pencil-name={"Pill - Transfer Ilmu"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Transfer Ilmu"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start rounded-[4px]"
                    }
                    data-pencil-name={"Pill - Infrastruktur"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Infrastruktur"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start rounded-[4px]"
                    }
                    data-pencil-name={"Pill - Integrasi"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Integrasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                  data-pencil-name={"Add Addon Btn"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"add"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Tambah Add-on"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_12px] justify-between items-center bg-[#F8F9FA] rounded-[8px]"
              }
              data-pencil-name={"Info Banner"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
                data-pencil-name={"Banner Left"}
              >
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"info"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Text"}
                  data-text="true"
                >
                  {
                    "Draf katalog add-on • integrasi kalkulator dan dokumen belum dikonfigurasi atau diverifikasi."
                  }
                </div>
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat"}
                data-text="true"
              >
                    {"Jumlah add-on dan status order belum diverifikasi"}
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="w-full min-w-[960px] flex flex-col gap-1">
                <div
                  className={
                    "box-border w-full min-w-[960px] h-[32px] shrink-0 flex flex-row gap-0 p-[0px_12px] justify-between items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Table Header"}
                >
                  <div
                    className={
                      "box-border flex-[3.5] min-w-[280px] h-fit flex flex-row gap-0 justify-start items-center"
                    }
                    data-pencil-name={"Th - MODUL & SPESIFIKASI"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"MODUL & SPESIFIKASI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.5] min-w-[130px] h-fit flex flex-row gap-0 justify-start items-center"
                    }
                    data-pencil-name={"Th - KATEGORI"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"KATEGORI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.8] min-w-[150px] h-fit flex flex-row gap-0 justify-start items-center"
                    }
                    data-pencil-name={"Th - SKEMA & INVESTASI"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"SKEMA & INVESTASI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.8] min-w-[150px] h-fit flex flex-row gap-0 justify-start items-center"
                    }
                    data-pencil-name={"Th - DISTRIBUSI KANAL"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"DISTRIBUSI KANAL"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border flex-[1.2] min-w-[100px] h-fit flex flex-row gap-0 justify-start items-center"
                    }
                    data-pencil-name={"Th - STATUS"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"STATUS"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[76px] shrink-0 h-fit flex flex-row gap-0 justify-end items-center"
                    }
                    data-pencil-name={"Th - AKSI"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.4px] text-right [white-space:nowrap]"
                      }
                      data-pencil-name={"Th Text"}
                      data-text="true"
                    >
                      {"AKSI"}
                    </div>
                  </div>
                </div>
            <DataRows
              texts={[
                "Add-on contoh • harga, cakupan, integrasi, dan status menunggu verifikasi serta persetujuan",
              ]}
              rowFlags={[true, true, true, true, true, true]}
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
              }
              data-pencil-name={"Rows Container"}
              data-custom-table="true"
            >
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - Maintenance & Monitoring Bulanan"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"build"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"Opsi pemeliharaan • belum ditetapkan"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Draf dukungan • cakupan pemantauan, perbaikan, backup, dan pembaruan belum ditetapkan."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Operasional • draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                        {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ bulan (Recurring)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Web Publik"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - Opsi pemeliharaan • draf"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#D2D88F33] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"workspace_premium"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"Dukungan Tahunan (Draf)"}
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[1px_5px] justify-start items-start bg-[#D2D88F] rounded-[4px]"
                        }
                        data-pencil-name={"Badge Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Text"}
                          data-text="true"
                        >
                      {"Harga belum disetujui"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Draf deskripsi dukungan. Cakupan, waktu respons, tinjauan kode, dan ketersediaan perlu disetujui tertulis."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                        {"Operasional (Draf)"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                        {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ tahun (Recurring)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Web Publik"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - Pelatihan Admin & Operator Sistem"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"cast_for_education"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"Pelatihan Admin & Operator Sistem"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Sesi workshop interaktif 2 jam (GMeet/Zoom), simulasi use case riil, booklet SOP PDF, & rekaman video."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Transfer Ilmu"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                      {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ sesi (One-time)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Web Publik"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - Setup Domain & Cloud Server VPS"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"dns"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"Setup Domain & Cloud Server VPS"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Rincian hosting, TLS, edge caching, dan kontrol jaringan ditetapkan setelah peninjauan teknis."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Infrastruktur"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                      {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ instalasi (One-time)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Web Publik"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - Integrasi Payment Gateway Otomatis"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"payments"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"Integrasi Payment Gateway Otomatis"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Modul Webhook Midtrans / Xendit, QRIS dinamis, virtual account, mutasi otomatis & notifikasi receipt."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Integrasi Sistem"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                      {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ modul (One-time)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F9731614] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#EA580C] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator Saja"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-w-[960px] h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Row - WhatsApp Gateway & Broadcast API"}
              >
                <div
                  className={
                    "box-border flex-[3.5] min-w-[280px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Col 1"}
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"chat"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Info Col"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Title Row"}
                    >
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Title"}
                        data-text="true"
                      >
                        {"WhatsApp Gateway & Broadcast API"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Desc"}
                      data-text="true"
                    >
                      {
                        "Engine broadcast update milestone tiket klien, reminder invoice otomatis & verifikasi kode OTP WABA."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-center"
                  }
                  data-pencil-name={"Col 2"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Cat Badge"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Integrasi Sistem"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-col gap-[1px] justify-start items-start"
                  }
                  data-pencil-name={"Col 3"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Price"}
                    data-text="true"
                  >
                      {"Harga belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Scheme"}
                    data-text="true"
                  >
                    {"/ modul (One-time)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.8] min-w-[150px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Col 4"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Web Publik"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Channel Pill"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#3F3F46] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Text"}
                      data-text="true"
                    >
                      {"Kalkulator"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-[1.2] min-w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Col 5"}
                >
                  <ToggleControl
                    label={"Nonaktif • draf"}
                    initialChecked={false}
                    className={
                      "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[1px_2px] justify-start items-center bg-[#D4D4D8] rounded-[9999px]"
                    }
                    data-pencil-name={"Switch Track"}
                  >
                    <div
                      className={
                        "box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] rounded-[50%]"
                      }
                      data-pencil-name={"Knob"}
                    ></div>
                  </ToggleControl>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • draf"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[76px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Col 6"}
                >
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Edit Icon"}
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                  </div>
                  <div
                    className={
                      "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                    }
                    data-pencil-name={"Delete Icon"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"delete_outline"}
                    </div>
                  </div>
                </div>
              </div>
            </DataRows>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </ScreenState>
  );
}
