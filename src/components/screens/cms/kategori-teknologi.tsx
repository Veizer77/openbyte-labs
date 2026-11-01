// Ported from prototype/stitch/cms/kategori-teknologi.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  FilterButton,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsKategoriTeknologi() {
  return (
    <ScreenState screen={"cms/kategori-teknologi"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 10 - Kategori & Teknologi"}
        data-screen={"cms/kategori-teknologi"}
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
                  data-pencil-name={"CMS"}
                  data-text="true"
                >
                  {"CMS"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"sep"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Konten Website"}
                  data-text="true"
                >
                  {"Konten Website"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"sep"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Kategori & Teknologi"}
                  data-text="true"
                >
                  {"Kategori & Teknologi"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                }
                data-pencil-name={"Title Row"}
                data-responsive="row"
              >
                <div
                  className={
                    "text-[24px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Title"}
                  data-text="true"
                >
                  {"Taksonomi Kategori & Pustaka Teknologi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[5px] p-[3px_9px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                  }
                  data-pencil-name={"Taxonomy Badge"}
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                    }
                    data-pencil-name={"dot"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"label"}
                    data-text="true"
                  >
                    {"Katalog kategori contoh • belum disetujui"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "text-[13px]/[19px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                }
                data-pencil-name={"Subtitle"}
                data-text="true"
              >
                {
                  "Kelola arsitektur taksonomi domain industri, pemetaan hierarki portofolio, dan standarisasi pustaka teknologi OpenByte Labs."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"Actions Row"}
            >
              <UiAction
                label={"Ekspor Taksonomi"}
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[8px] cursor-pointer border-0"
                }
                data-pencil-name={"Export Taxonomy Btn"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-pencil-name={"icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"download"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Ekspor Taksonomi"}
                </div>
              </UiAction>
              <UiAction
                label={"Tambah Stack"}
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[8px] cursor-pointer border-0"
                }
                data-pencil-name={"Add Stack Btn"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-pencil-name={"icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"layers"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Tambah Stack"}
                </div>
              </UiAction>
              <UiAction
                label={"Tambah Kategori"}
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] hover:bg-[#27272A] transition-colors rounded-[8px] cursor-pointer border-0"
                }
                data-pencil-name={"Add Category Btn"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-pencil-name={"icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Tambah Kategori"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"Project Counter Metrics"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric Card - Total Kategori Induk"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.2px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Total Kategori Induk"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Wrap"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"category"}
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
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Value"}
                  data-text="true"
                >
                  {"8 Domain"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"text"}
                    data-text="true"
                  >
                    {"+2 Baru Q2"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric Card - Pustaka Standar Stack"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.2px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Pustaka Standar Stack"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Wrap"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"terminal"}
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
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Value"}
                  data-text="true"
                >
                  {"Jumlah modul belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"text"}
                    data-text="true"
                  >
                    {"4 Kategori"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric Card - Portofolio Terkatalog"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.2px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Portofolio Terkatalog"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Wrap"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"icon"}
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
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Value"}
                  data-text="true"
                >
                  {"Data belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"text"}
                    data-text="true"
                  >
                    {"Status contoh • belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric Card - Rata-rata Stack / Proyek"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.2px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Rata-rata Stack / Proyek"}
                </div>
                <div
                  className={
                    "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Wrap"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"hub"}
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
                    "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Value"}
                  data-text="true"
                >
                  {"Data katalog belum diverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#D2D88F33] rounded-[4px]"
                  }
                  data-pencil-name={"Badge"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#5D661E] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"text"}
                    data-text="true"
                  >
                    {"Contoh teknologi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
            }
            data-pencil-name={"Category Taxonomy Tree Card"}
            data-section-padding="true"
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
              data-pencil-name={"Card Header"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                }
                data-pencil-name={"Title Box"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Title"}
                  data-text="true"
                >
                  {"Hierarki Taksonomi Kategori & Pemetaan Portofolio"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Subtitle"}
                  data-text="true"
                >
                  {
                    "Struktur hierarki tree 2-tingkat domain industri menuju spesialisasi teknis OpenByte Labs"
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Header Controls"}
              >
                <div
                  className={
                    "box-border w-[230px] shrink-0 h-[32px] flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Table Search"}
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"search"}
                  </div>
                  <SearchField
                    label={"Cari taksonomi..."}
                    className={
                      "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap] focus:outline-none w-full bg-transparent"
                    }
                    data-pencil-name={"placeholder"}
                    data-text="true"
                  />
                </div>
                <UiAction
                  label={"Buka Semua"}
                  className={
                    "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors rounded-[6px] cursor-pointer border-0"
                  }
                  data-pencil-name={"Expand All Btn"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"unfold_more"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"label"}
                    data-text="true"
                  >
                    {"Buka Semua"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"Filter Tabs Row"}
              data-responsive="row"
            >
              <FilterButton
                value={"Semua Taksonomi"}
                className={
                  "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#18181A] rounded-[6px] cursor-pointer transition-colors hover:opacity-90"
                }
                data-pencil-name={"Tab - Semua Taksonomi (12)"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Semua Taksonomi (12)"}
                </div>
              </FilterButton>
              <FilterButton
                value={"Enterprise Web"}
                className={
                  "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[6px] cursor-pointer transition-colors hover:opacity-90"
                }
                data-pencil-name={"Tab - Enterprise Web (4)"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Enterprise Web (4)"}
                </div>
              </FilterButton>
              <FilterButton
                value={"Mobile Ecosystem"}
                className={
                  "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[6px] cursor-pointer transition-colors hover:opacity-90"
                }
                data-pencil-name={"Tab - Mobile Ecosystem (3)"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Mobile Ecosystem (3)"}
                </div>
              </FilterButton>
              <FilterButton
                value={"Geospasial & GIS"}
                className={
                  "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[6px] cursor-pointer transition-colors hover:opacity-90"
                }
                data-pencil-name={"Tab - Geospasial & GIS (3)"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Geospasial & GIS (3)"}
                </div>
              </FilterButton>
              <FilterButton
                value={"Cloud & Keamanan"}
                className={
                  "box-border w-fit shrink-0 h-[30px] flex flex-row gap-0 p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[6px] cursor-pointer transition-colors hover:opacity-90"
                }
                data-pencil-name={"Tab - Cloud & Keamanan (2)"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Cloud & Keamanan (2)"}
                </div>
              </FilterButton>
            </div>
            <DataRows
              texts={[
                "DOMAIN & SUB-KATEGORI     SLUG ROUTE     STANDAR TECH STACK     PROYEK     STATUS     AKSI",
                "language     Web & Enterprise Ecosystem    INDUK       /kategori/enterprise-web     Jumlah subkategori belum diverifikasi      Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   Sistem Informasi Manajemen (SIM & ERP)     /kategori/sim-erp      code   Next.js 14     storage   PostgreSQL     palette   Tailwind CSS       Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   Custom SaaS & Digital Workflow     /kategori/saas-workflow      code   React 18     terminal   Node.js     memory   Redis       Data belum diverifikasi        Draf       edit     more_vert",
                "smartphone     Mobile Ecosystem & Cross-Platform    INDUK       /kategori/mobile-ecosystem     Jumlah subkategori belum diverifikasi      Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   Mobile GIS & Offline Field Collector     /kategori/mobile-gis      phone_iphone   Flutter 3.x     save   SQLite Offline     map   Mapbox SDK       Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   SuperApp Layanan Warga & Publik     /kategori/superapp-warga      phone_iphone   Flutter 3.x     bolt   Supabase Realtime     notifications   OneSignal       Data belum diverifikasi        Draf       edit     more_vert",
                "explore     Geospasial, GIS & Pemetaan Presisi    INDUK       /kategori/gis-pemetaan     Jumlah subkategori belum diverifikasi      Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   WebGIS Monitoring Afdeling & Sawit     /kategori/webgis-agraria      layers   PostGIS 3     public   GeoServer     map   Leaflet.js       Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   Spatial Analytics & Polygon Engine     /kategori/spatial-engine      terminal   Python GDAL     speed   FastAPI     polyline   Turf.js       Data belum diverifikasi        Draf       edit     more_vert",
                "verified_user     Keamanan Siber & Kepatuhan PDP    INDUK       /kategori/keamanan-pdp     Jumlah subkategori belum diverifikasi      Data belum diverifikasi        Draf       edit     more_vert",
                "subdirectory_arrow_right   Kategori keamanan (contoh)     /kategori/contoh-keamanan      teknologi dan status perlu diverifikasi",
              ]}
              rowFlags={[
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
              ]}
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start [outline:1px_solid_#F0F0F0] [outline-offset:-0.5px] rounded-[8px]"
              }
              data-pencil-name={"Table Container"}
              data-custom-table="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F0F0F099]"
                }
                data-pencil-name={"Table Header"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Col Domain"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"DOMAIN & SUB-KATEGORI"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Col Slug"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"SLUG ROUTE"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Col Stacks"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"STANDAR TECH STACK"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Col Projects"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"PROYEK"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Col Status"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"STATUS"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-0 justify-end items-start"
                  }
                  data-pencil-name={"Col Actions"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"th"}
                    data-text="true"
                  >
                    {"AKSI"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F9F9FB] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Web & Enterprise Ecosystem"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                    }
                    data-pencil-name={"Parent Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"language"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Parent Title Col"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"name"}
                      data-text="true"
                    >
                      {"Web & Enterprise Ecosystem"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0F] rounded-[4px]"
                      }
                      data-pencil-name={"Parent Badge"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"txt"}
                        data-text="true"
                      >
                        {"INDUK"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/enterprise-web"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"note"}
                    data-text="true"
                  >
                    {"Jumlah subkategori belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#18181A] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={
                  "Row - Sistem Informasi Manajemen (SIM & ERP)"
                }
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"Sistem Informasi Manajemen (SIM & ERP)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/sim-erp"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Next.js 14"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"code"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Next.js 14"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#3367911A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - PostgreSQL"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#205081] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"storage"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#205081] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"PostgreSQL"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Tailwind CSS"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"palette"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Tailwind CSS"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Custom SaaS & Digital Workflow"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"Custom SaaS & Digital Workflow"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/saas-workflow"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - React 18"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"code"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"React 18"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Node.js"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"terminal"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Node.js"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Redis"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"memory"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Redis"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F9F9FB] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Mobile Ecosystem & Cross-Platform"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                    }
                    data-pencil-name={"Parent Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"smartphone"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Parent Title Col"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"name"}
                      data-text="true"
                    >
                      {"Mobile Ecosystem & Cross-Platform"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0F] rounded-[4px]"
                      }
                      data-pencil-name={"Parent Badge"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"txt"}
                        data-text="true"
                      >
                        {"INDUK"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/mobile-ecosystem"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"note"}
                    data-text="true"
                  >
                    {"Jumlah subkategori belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#18181A] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Mobile GIS & Offline Field Collector"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"Mobile GIS & Offline Field Collector"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/mobile-gis"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#02569B1A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Flutter 3.x"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#02569B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"phone_iphone"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#02569B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Flutter 3.x"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - SQLite Offline"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"save"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"SQLite Offline"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Mapbox SDK"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"map"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Mapbox SDK"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - SuperApp Layanan Warga & Publik"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"SuperApp Layanan Warga & Publik"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/superapp-warga"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#02569B1A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Flutter 3.x"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#02569B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"phone_iphone"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#02569B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Flutter 3.x"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#3ECF8E1A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Supabase Realtime"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#00854D] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"bolt"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#00854D] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Supabase Realtime"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - OneSignal"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"notifications"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"OneSignal"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F9F9FB] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Geospasial, GIS & Pemetaan Presisi"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                    }
                    data-pencil-name={"Parent Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"explore"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Parent Title Col"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"name"}
                      data-text="true"
                    >
                      {"Geospasial, GIS & Pemetaan Presisi"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0F] rounded-[4px]"
                      }
                      data-pencil-name={"Parent Badge"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"txt"}
                        data-text="true"
                      >
                        {"INDUK"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/gis-pemetaan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"note"}
                    data-text="true"
                  >
                    {"Jumlah subkategori belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#18181A] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - WebGIS Monitoring Afdeling & Sawit"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"WebGIS Monitoring Afdeling & Sawit"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/webgis-agraria"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#3367911A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - PostGIS 3"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#205081] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"layers"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#205081] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"PostGIS 3"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - GeoServer"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"public"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"GeoServer"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Leaflet.js"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"map"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Leaflet.js"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Spatial Analytics & Polygon Engine"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"Spatial Analytics & Polygon Engine"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/spatial-engine"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Python GDAL"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"terminal"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Python GDAL"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#0096881A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - FastAPI"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#00796B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"speed"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#00796B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"FastAPI"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Turf.js"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"polyline"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Turf.js"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F9F9FB] border-b border-[#F0F0F0]"
                }
                data-pencil-name={"Row - Keamanan Siber & Kepatuhan PDP"}
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                    }
                    data-pencil-name={"Parent Icon Box"}
                  >
                    <div
                      className={
                        "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified_user"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Parent Title Col"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"name"}
                      data-text="true"
                    >
                      {"Keamanan Siber & Kepatuhan PDP"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0F] rounded-[4px]"
                      }
                      data-pencil-name={"Parent Badge"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"txt"}
                        data-text="true"
                      >
                        {"INDUK"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/keamanan-pdp"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"note"}
                    data-text="true"
                  >
                    {"Jumlah subkategori belum diverifikasi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#18181A] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full min-h-[48px] shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#FFFFFF] border-b border-[#F0F0F0]"
                }
                data-pencil-name={
                  "Row - Audit Kerentanan & Standarisasi UU PDP"
                }
              >
                <div
                  className={
                    "box-border w-[320px] shrink-0 h-fit flex flex-row gap-[8px] p-[0px_0px_0px_28px] justify-start items-center"
                  }
                  data-pencil-name={"Domain Cell"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"branch"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"subdirectory_arrow_right"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"name"}
                    data-text="true"
                  >
                    {"Audit Kerentanan & Standarisasi UU PDP"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[155px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Slug Cell"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"slug"}
                    data-text="true"
                  >
                    {"/kategori/audit-pdp"}
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Stacks Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - OWASP ZAP"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"security"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"OWASP ZAP"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#F0F0F0] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - SonarQube"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"SonarQube"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#2496ED1A] rounded-[4px]"
                    }
                    data-pencil-name={"Badge - Docker Hardened"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#0275D8] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"inventory"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#0275D8] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"label"}
                      data-text="true"
                    >
                      {"Docker Hardened"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[90px] shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Projects Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#F4F4F5] rounded-[9999px]"
                    }
                    data-pencil-name={"Count Pill"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"count"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[70px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                  }
                  data-pencil-name={"Status Cell"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
                    }
                    data-pencil-name={"Status Pill"}
                  >
                    <div
                      className={
                        "box-border w-[5px] shrink-0 h-[5px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"dot"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Draf"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[64px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                  }
                  data-pencil-name={"Actions Cell"}
                >
                  <UiAction
                    label={"Edit Kategori"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"Edit Btn"}
                  >
                    {"edit"}
                  </UiAction>
                  <UiAction
                    label={"Menu Lainnya"}
                    className={
                      "box-border w-[28px] h-[28px] shrink-0 flex items-center justify-center bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181A] transition-colors rounded-[6px] cursor-pointer border-0 p-0 text-[16px] symbol leading-none"
                    }
                    data-pencil-name={"More Btn"}
                  >
                    {"more_vert"}
                  </UiAction>
                </div>
              </div>
            </DataRows>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px_16px] justify-between items-center bg-[#F9F9FB] rounded-[8px]"
              }
              data-pencil-name={"Table Footer"}
              data-responsive="row"
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"footer note"}
                data-text="true"
              >
                {
                  "Menampilkan 4 Domain Utama dan 7 Sub-Kategori Terkoneksi • Sinkronisasi otomatis ke showcase website publik"
                }
              </div>
              <UiAction
                label={"Tambah Sub-Kategori Cepat"}
                className={
                  "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_10px] justify-start items-center bg-[#18181A] hover:bg-[#27272A] transition-colors rounded-[6px] cursor-pointer border-0"
                }
                data-pencil-name={"Quick Add Subcategory Btn"}
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                  }
                  data-pencil-name={"icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"label"}
                  data-text="true"
                >
                  {"Tambah Sub-Kategori Cepat"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"Modular Bento Tech Library Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-[660px] shrink-0 h-fit [box-shadow:0px_2px_6px_#00000026] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#18181A] rounded-[16px]"
              }
              data-pencil-name={"Obsidian Capsule - Core Tech Library"}
              data-responsive="fixed"
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Header"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Left Group"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[8px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"terminal"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Title Col"}
                  >
                    <div
                      className={
                        "text-[15px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Title"}
                      data-text="true"
                    >
                      {"Pustaka Standar Teknologi Inti"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Subtitle"}
                      data-text="true"
                    >
                       {"Daftar teknologi contoh • bukan standar atau sertifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"Right Group"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                    }
                    data-pencil-name={"Tier Badge"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"txt"}
                      data-text="true"
                    >
                      {"Contoh • belum diverifikasi"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Grid Row 1"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - Flutter 3.22"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"phone_iphone"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"Flutter 3.22"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"Mobile"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"Teknologi, kinerja, dan pengujian belum diverifikasi"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - Next.js 14"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"code"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"Next.js 14"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"Fullstack"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"App Router, SSR, Server Actions"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - PostGIS 3 & PG"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"storage"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"PostGIS 3 & PG"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"Spatial DB"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"ST_Intersects, Afdeling Polygon"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Grid Row 2"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - FastAPI Python"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"speed"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"FastAPI Python"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"API & Micro"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"Pydantic v2, Async REST Worker"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - Supabase BaaS"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#3ECF8E] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"bolt"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"Supabase BaaS"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#3ECF8E] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"Realtime"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"Row Level Security, Webhooks Sync"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[6px] p-[10px] justify-start items-start bg-[#242427] rounded-[8px]"
                  }
                  data-pencil-name={"Tech Card - Docker & K8s"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#2496ED] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"inventory_2"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left truncate min-w-0"
                        }
                        data-pencil-name={"title"}
                        data-text="true"
                      >
                        {"Docker & K8s"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[4px]"
                      }
                      data-pencil-name={"Tag"}
                    >
                      <div
                        className={
                          "text-[9px]/[normal] box-border text-[#2496ED] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"tag txt"}
                        data-text="true"
                      >
                        {"DevOps"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Bottom Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left truncate flex-1 min-w-0"
                      }
                      data-pencil-name={"desc"}
                      data-text="true"
                    >
                      {"Kontrol dan ketersediaan perlu ditinjau per proyek"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-right shrink-0 whitespace-nowrap ml-1"
                      }
                      data-pencil-name={"projects"}
                      data-text="true"
                    >
                      {"Data belum diverifikasi"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#242427] rounded-[8px]"
                }
                data-pencil-name={"Compliance Banner"}
                data-responsive="row"
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"compliance text"}
                  data-text="true"
                >
                  {
                    "Persyaratan lisensi, enkripsi, dan privasi harus ditinjau untuk tiap proyek; kepatuhan atau sertifikasi tidak diklaim."
                  }
                </div>
                <UiAction
                  label={"Kelola Versi"}
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[2px] justify-start items-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  }
                  data-pencil-name={"Manage Link"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"txt"}
                    data-text="true"
                  >
                    {"Kelola Versi"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chevron_right"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
              }
              data-pencil-name={"Bento Card - Stack Adoption & Action"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Header"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-pencil-name={"Left Group"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                    data-pencil-name={"Icon Box"}
                  >
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"pie_chart"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Title Col"}
                  >
                    <div
                      className={
                        "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Title"}
                      data-text="true"
                    >
                      {"Distribusi Utilisasi Stack"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Subtitle"}
                      data-text="true"
                    >
                      {"Distribusi teknologi contoh • data penggunaan belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                  }
                  data-pencil-name={"Year Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"txt"}
                    data-text="true"
                  >
                    {"Data penggunaan belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Progress Group"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={
                    "Bar Item - Frontend & Mobile (Flutter, Next.js, React)"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Labels Row"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"category"}
                      data-text="true"
                    >
                      {"Frontend & Mobile (Flutter, Next.js, React)"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Values"}
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"count"}
                        data-text="true"
                      >
                        {"Data belum diverifikasi"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"pct"}
                        data-text="true"
                      >
                        {"(belum diverifikasi)"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0F0F0] rounded-[3px]"
                    }
                    data-pencil-name={"Track Bar"}
                  >
                    <div
                      className={
                        "box-border w-[180px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#18181A] rounded-[3px]"
                      }
                      data-pencil-name={"Fill Bar"}
                      data-responsive="fixed"
                    ></div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={
                    "Bar Item - Database & Geospasial (PostGIS, SQLite, Postgres)"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Labels Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"category"}
                      data-text="true"
                    >
                      {"Database & Geospasial (PostGIS, SQLite, Postgres)"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Values"}
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"count"}
                        data-text="true"
                      >
                        {"Data belum diverifikasi"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"pct"}
                        data-text="true"
                      >
                        {"(belum diverifikasi)"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0F0F0] rounded-[3px]"
                    }
                    data-pencil-name={"Track Bar"}
                  >
                    <div
                      className={
                        "box-border w-[140px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#82B440] rounded-[3px]"
                      }
                      data-pencil-name={"Fill Bar"}
                      data-responsive="fixed"
                    ></div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={
                    "Bar Item - Cloud, DevOps & Microservices (Docker, FastAPI, Redis)"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Labels Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"category"}
                      data-text="true"
                    >
                      {"Cloud, DevOps & Microservices (Docker, FastAPI, Redis)"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Values"}
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"count"}
                        data-text="true"
                      >
                        {"Data belum diverifikasi"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"pct"}
                        data-text="true"
                      >
                        {"(belum diverifikasi)"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[6px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#F0F0F0] rounded-[3px]"
                    }
                    data-pencil-name={"Track Bar"}
                  >
                    <div
                      className={
                        "box-border w-[105px] shrink-0 h-[6px] flex flex-row gap-0 justify-start items-start bg-[#D2D88F] rounded-[3px]"
                      }
                      data-pencil-name={"Fill Bar"}
                      data-responsive="fixed"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#F9F9FB] [outline:1px_solid_#F0F0F0] [outline-offset:-0.5px] rounded-[8px]"
                }
                data-pencil-name={"Register Stack CTA Box"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"CTA Left"}
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"cta title"}
                    data-text="true"
                  >
                    {"Daftarkan Pustaka Stack Baru"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"cta desc"}
                    data-text="true"
                  >
                    {"Otomatis sinkron ke opsi kalkulator & form portofolio."}
                  </div>
                </div>
                <UiAction
                  label={"Daftar Stack"}
                  className={
                    "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_12px] justify-start items-center bg-[#D2D88F] hover:bg-[#C2C87F] transition-colors rounded-[6px] cursor-pointer border-0"
                  }
                  data-pencil-name={"CTA Action Btn"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol leading-none"
                    }
                    data-pencil-name={"icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"add"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"label"}
                    data-text="true"
                  >
                    {"Daftar Stack"}
                  </div>
                </UiAction>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </ScreenState>
  );
}
