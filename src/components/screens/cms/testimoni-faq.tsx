// Ported from prototype/stitch/cms/testimoni-faq.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  FilterButton,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsTestimoniFaq() {
  return (
    <ScreenState screen={"cms/testimoni-faq"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 12 - Testimoni & FAQ"}
        data-screen={"cms/testimoni-faq"}
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
                  data-pencil-name={"Crumb 1"}
                  data-text="true"
                >
                  {"CMS"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Crumb Sep 1"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Crumb 2"}
                  data-text="true"
                >
                  {"Konten Website"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Crumb Sep 2"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"chevron_right"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Crumb Current"}
                  data-text="true"
                >
                  {"Testimoni & FAQ"}
                </div>
              </div>
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Page Title"}
                data-text="true"
              >
                {"Tata Kelola Testimoni & FAQ Publik"}
              </div>
              <div
                className={
                  "text-[13px]/[19px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                }
                data-pencil-name={"Page Subtitle"}
                data-text="true"
              >
                {
                  "Kelola draf ulasan dan FAQ. Konten contoh tetap nonaktif sampai identitas, izin, dan isinya diverifikasi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"Header Actions"}
            >
              <UiAction
                label={"Sinkronisasi nonaktif"}
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000a] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#FFFFFF] rounded-[8px]"
                }
                data-pencil-name={"Sync Button"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"sync"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Sinkronisasi nonaktif"}
                </div>
              </UiAction>
              <UiAction
                label={"+ Tambah FAQ"}
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
                data-pencil-name={"Add FAQ Button"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"quiz"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"+ Tambah FAQ"}
                </div>
              </UiAction>
              <UiAction
                label={"+ Draf Ulasan"}
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_3px_#0000001a] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
                data-pencil-name={"Add Review Button"}
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
                    "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"+ Draf Ulasan"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start"
            }
            data-pencil-name={"Governance Metrics Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
              }
              data-pencil-name={"Card 1 - Client Rating"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Ringkasan Ulasan"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#D2D88F33] rounded-[4px]"
                  }
                  data-pencil-name={"BAST Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Score"}
                  data-text="true"
                >
                  {"—"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Scale"}
                  data-text="true"
                >
                  {"Data belum tersedia"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[2px] p-[0px_0px_0px_6px] justify-start items-center"
                  }
                  data-pencil-name={"Stars"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Star"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Star"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Star"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Star"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Star"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Footer Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Subtext"}
                  data-text="true"
                >
                  {"Belum ada data terverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                  }
                  data-pencil-name={"Trend Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Trend Text"}
                    data-text="true"
                  >
                    {"Belum dihitung"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_2px_4px_#0000001a] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#18181A] rounded-[14px]"
              }
              data-pencil-name={"Card 2 - Approval Queue"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Antrean Ulasan (Queue)"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F9731633] rounded-[4px]"
                  }
                  data-pencil-name={"Alert Badge"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Alert Text"}
                    data-text="true"
                  >
                    {"Perlu Review"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "text-[26px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Score"}
                  data-text="true"
                >
                  {"Belum tersedia"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Sub"}
                  data-text="true"
                >
                  {"Data antrean belum tersedia"}
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Footer Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Subtext"}
                  data-text="true"
                >
                  {"Waktu moderasi belum ditetapkan"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-center bg-[#242427] rounded-[4px]"
                  }
                  data-pencil-name={"Quick Action"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Btn Text"}
                    data-text="true"
                  >
                    {"Proses Antrean"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
              }
                  data-pencil-name={"Card 3 - Ulasan Contoh"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Ulasan contoh • belum disetujui"}
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Score"}
                  data-text="true"
                >
                  {"Belum tersedia"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Sub"}
                  data-text="true"
                >
                  {"Tidak ada data aktif"}
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Footer Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Subtext"}
                  data-text="true"
                >
                  {"Tidak ada data terverifikasi"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#D2D88F33] rounded-[4px]"
                  }
                  data-pencil-name={"Trust Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Trust Text"}
                    data-text="true"
                  >
                    {"Metrik belum tersedia"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
              }
              data-pencil-name={"Card 4 - FAQ Knowledge Base"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Top Row"}
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Basis FAQ Publik"}
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"quiz"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Score"}
                  data-text="true"
                >
                  {"Belum tersedia"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Sub"}
                  data-text="true"
                >
                  {"Kategori belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Footer Row"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Subtext"}
                  data-text="true"
                >
                  {"Dampak belum diukur"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                  }
                  data-pencil-name={"Sync Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sync Text"}
                    data-text="true"
                  >
                    {"Sinkronisasi nonaktif"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"Split Workspace"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-[536px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[14px] p-[18px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
              }
              data-pencil-name={"Review Approval Queue Column"}
              data-responsive="fixed"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Queue Header"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Title Wrap"}
                >
                  <div
                    className={
                      "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Title"}
                    data-text="true"
                  >
                    {"Antrean Ulasan Klien (Approval Queue)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-center bg-[#F973161a] rounded-[9999px]"
                  }
                  data-pencil-name={"Pending Count Pill"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Count Text"}
                    data-text="true"
                  >
                    {"Konten contoh"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Queue Subtitle"}
                data-text="true"
              >
                {
                  "Tinjau identitas, isi, izin, dan klaim sebelum konten apa pun dipublikasikan."
                }
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] p-[3px] justify-start items-start bg-[#F4F4F5] rounded-[8px]"
                }
                data-pencil-name={"Filter Tabs"}
              >
                <FilterButton
                  value={"Pending"}
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_12px] justify-start items-center bg-[#18181A] rounded-[6px]"
                  }
                  data-pencil-name={"Tab Active"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tab Text"}
                    data-text="true"
                  >
                    {"Pending"}
                  </div>
                </FilterButton>
                <FilterButton
                  value={"Disetujui"}
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-center rounded-[6px]"
                  }
                  data-pencil-name={"Tab Disetujui"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tab Text"}
                    data-text="true"
                  >
                    {"Disetujui"}
                  </div>
                </FilterButton>
                <FilterButton
                  value={"Ditolak"}
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-center rounded-[6px]"
                  }
                  data-pencil-name={"Tab Ditolak"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tab Text"}
                    data-text="true"
                  >
                    {"Ditolak"}
                  </div>
                </FilterButton>
                <FilterButton
                  value={"Semua"}
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[5px_10px] justify-start items-center rounded-[6px]"
                  }
                  data-pencil-name={"Tab Semua"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tab Text"}
                    data-text="true"
                  >
                    {"Semua"}
                  </div>
                </FilterButton>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Search Sort Row"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border [flex:1_1_0] h-[32px] flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Search Input"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Search Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"search"}
                  </div>
                  <SearchField
                    label={"Cari draf ulasan..."}
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Placeholder"}
                    data-text="true"
                  />
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[4px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Sort Dropdown"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Sort Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"star_outline"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sort Text"}
                    data-text="true"
                  >
                    {"Urutan standar"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Caret"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"expand_more"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Review Queue List"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FAFAFC] [outline:1.5px_solid_#18181A] [outline-offset:-0.75px] rounded-[12px]"
                  }
                  data-pencil-name={"Review Card 1 - Focused"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Client Header"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"Client Info"}
                    >
                      <div
                        className={
                          "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                        }
                        data-pencil-name={"Avatar"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Initials"}
                          data-text="true"
                        >
                          {"DM"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                        }
                        data-pencil-name={"Name Col"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Client Name"}
                          data-text="true"
                        >
                          {"Kontak Demo 1"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Client Role"}
                          data-text="true"
                        >
                          {"Perwakilan Organisasi Demo"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Rating Block"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[1px] justify-start items-center"
                        }
                        data-pencil-name={"Stars"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Score"}
                        data-text="true"
                      >
                        {"—"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Badges Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                      }
                      data-pencil-name={"Project Tag"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Proj Text"}
                        data-text="true"
                      >
                        {"Proyek Contoh"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                      }
                      data-pencil-name={"BAST Tag"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"BAST Text"}
                        data-text="true"
                      >
                        {"Contoh tidak aktif • menunggu persetujuan"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[10px] justify-start items-start bg-[#FFFFFF] rounded-[8px]"
                    }
                    data-pencil-name={"Quote Box"}
                  >
                    <div
                      className={
                        "text-[12px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Quote Text"}
                      data-text="true"
                    >
                      {
                        "Testimoni contoh ditahan sampai kutipan, identitas, dan izin publikasi diverifikasi."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Meta Row"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Meta Info"}
                      data-text="true"
                    >
                      {"Status: tidak aktif • belum diverifikasi"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#D2D88F] rounded-[4px]"
                      }
                      data-pencil-name={"Pin Badge"}
                    >
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Pin Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"push_pin"}
                      </div>
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Pin Label"}
                        data-text="true"
                      >
                        {"Tidak ditampilkan"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Action Bar"}
                  >
                    <UiAction
                      label={"Setujui & Publikasikan"}
                      className={
                        "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[6px] p-[0px_12px] justify-start items-center bg-[#18181A] rounded-[6px]"
                      }
                      data-pencil-name={"Approve Button"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Setujui & Publikasikan"}
                      </div>
                    </UiAction>
                    <UiAction
                      label={"Koreksi"}
                      className={
                        "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                      data-pencil-name={"Edit Button"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Koreksi"}
                      </div>
                    </UiAction>
                    <UiAction
                      label={"Tolak"}
                      className={
                        "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[0px_10px] justify-start items-center bg-[#FEE2E2] rounded-[6px]"
                      }
                      data-pencil-name={"Reject Button"}
                    >
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#DC2626] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"close"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#DC2626] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Label"}
                        data-text="true"
                      >
                        {"Tolak"}
                      </div>
                    </UiAction>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
                  }
                  data-pencil-name={"Review Card 2"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Client Header"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                      }
                      data-pencil-name={"Client Info"}
                    >
                      <div
                        className={
                          "box-border w-[34px] shrink-0 h-[34px] flex flex-row gap-0 justify-center items-center bg-[#82B440] rounded-[9999px]"
                        }
                        data-pencil-name={"Avatar"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Initials"}
                          data-text="true"
                        >
                          {"RP"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                        }
                        data-pencil-name={"Name Col"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Client Name"}
                          data-text="true"
                        >
                          {"Kontak Demo 2"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Client Role"}
                          data-text="true"
                        >
                          {"Perwakilan Organisasi Demo"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Rating Block"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[1px] justify-start items-center"
                        }
                        data-pencil-name={"Stars"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#F59E0B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star_outline"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Score"}
                        data-text="true"
                      >
                        {"—"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"Badges Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                      }
                      data-pencil-name={"Project Tag"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Proj Text"}
                        data-text="true"
                      >
                        {"Proyek Contoh"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                      }
                      data-pencil-name={"BAST Tag"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"BAST Text"}
                        data-text="true"
                      >
                        {"Testimoni contoh • ditahan untuk review"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[10px] justify-start items-start bg-[#F9F9FB] rounded-[8px]"
                    }
                    data-pencil-name={"Quote Box"}
                  >
                    <div
                      className={
                        "text-[12px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Quote Text"}
                      data-text="true"
                    >
                      {
                        "Kutipan testimoni contoh; belum disetujui untuk publikasi."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Action Bar"}
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Meta Info"}
                      data-text="true"
                    >
                      {"Diajukan: 5 jam lalu • Pending"}
                    </div>
                    <UiAction
                      label={"Setujui Tolak"}
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Buttons"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[0px_10px] justify-start items-center bg-[#18181A] rounded-[6px]"
                        }
                        data-pencil-name={"Approve Button"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Label"}
                          data-text="true"
                        >
                          {"Setujui"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[0px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Reject Button"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Label"}
                          data-text="true"
                        >
                          {"Tolak"}
                        </div>
                      </div>
                    </UiAction>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                  }
                  data-pencil-name={"Review Card 3 - Draf"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Client Header"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Client Info"}
                    >
                      <div
                        className={
                          "box-border w-[30px] shrink-0 h-[30px] flex flex-row gap-0 justify-center items-center bg-[#6366F1] rounded-[9999px]"
                        }
                        data-pencil-name={"Avatar"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Initials"}
                          data-text="true"
                        >
                          {"BS"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Name"}
                        data-text="true"
                      >
                        {"Kontak Demo 3 (Organisasi Demo)"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                      }
                      data-pencil-name={"Status Pill"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Text"}
                        data-text="true"
                      >
                  {"DRAFT • NONAKTIF"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[15px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Quote Snippet"}
                    data-text="true"
                  >
                    {
                      "“Dashboard analitik spasial GIS satu peta mempermudah musrenbang dan validasi usulan desa secara akurat.”"
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                }
                data-pencil-name={"Queue Footer"}
                data-responsive="row"
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Page Info"}
                  data-text="true"
                >
                  {"Contoh antrean nonaktif • jumlah belum tersedia"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"View All Link"}
                  data-text="true"
                >
                  {"Tinjau antrean →"}
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000a] flex flex-col gap-[14px] p-[18px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
              }
              data-pencil-name={"FAQ Editor Column"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"FAQ Header"}
              >
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Title"}
                  data-text="true"
                >
                  {"Editor Accordion FAQ Publik"}
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#82B4401a] rounded-[9999px]"
                  }
                  data-pencil-name={"Sync Status Pill"}
                >
                  <div
                    className={
                      "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                    }
                    data-pencil-name={"Dot"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status Text"}
                    data-text="true"
                  >
                    {"Nonaktif • menunggu persetujuan"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"FAQ Subtitle"}
                data-text="true"
              >
                {
                  "Kelola pertanyaan interaktif accordion publik berdasarkan kategori & urutan."
                }
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                }
                data-pencil-name={"Category Filter Chips"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Cat Chip Inactive"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Semua"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#18181A] rounded-[9999px]"
                  }
                  data-pencil-name={"Cat Chip Active"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Umum & Legal (5)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Cat Chip Paket & Biaya"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Paket & Biaya (6)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Cat Chip Teknis & Hosting"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Teknis (5)"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[9999px]"
                  }
                  data-pencil-name={"Cat Chip Ketentuan Layanan"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"Ketentuan layanan • draf"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Sub Toolbar"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"Drag Notice"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Drag Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"drag_indicator"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Notice Text"}
                    data-text="true"
                  >
                          {"Urutan tampil setelah konten disetujui dan dipublikasikan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[4px] p-[4px_10px] justify-start items-center bg-[#D2D88F] rounded-[6px]"
                  }
                  data-pencil-name={"Add In Category Btn"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Plus"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"add"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Label"}
                    data-text="true"
                  >
                    {"+ Tambah FAQ di Kategori Ini"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Accordion FAQ List"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FAFAFC] [outline:1.5px_solid_#18181A] [outline-offset:-0.75px] rounded-[12px]"
                  }
                  data-pencil-name={"Accordion Item 1 - Expanded"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                    }
                    data-pencil-name={"Item Title Bar"}
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start"
                      }
                      data-pencil-name={"Title Left"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Meta Row"}
                      >
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Handle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_indicator"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                          }
                          data-pencil-name={"Category Tag"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Text"}
                            data-text="true"
                          >
                            {"Umum & Legalitas"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Order Tag"}
                          data-text="true"
                        >
                          {"Urutan: — • Status: Nonaktif"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left"
                        }
                        data-pencil-name={"Question Title"}
                        data-text="true"
                      >
                        {
                          "Contoh pertanyaan FAQ — belum disetujui untuk publikasi"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "text-[20px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Collapse Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"expand_less"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[10px] justify-start items-start bg-[#FFFFFF] rounded-[8px]"
                    }
                    data-pencil-name={"Answer Editor Box"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Micro Toolbar"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"Tools Group"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                          }
                          data-pencil-name={"Tool B"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"TLabel"}
                            data-text="true"
                          >
                            {"B"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                          }
                          data-pencil-name={"Tool I"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"TLabel"}
                            data-text="true"
                          >
                            {"I"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                          }
                          data-pencil-name={"Tool Link"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"TLabel"}
                            data-text="true"
                          >
                            {"Link"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                          }
                          data-pencil-name={"Tool List"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"TLabel"}
                            data-text="true"
                          >
                            {"List"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                          }
                          data-pencil-name={"Tool Code"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"TLabel"}
                            data-text="true"
                          >
                            {"Code"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Format Note"}
                        data-text="true"
                      >
                        {"Markdown Tersedia"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[12px]/[18px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={"Answer Text"}
                      data-text="true"
                    >
                      {
                        "Draf jawaban contoh. Ketentuan serah terima, garansi, dukungan, atau SLA harus ditinjau dan disepakati sebelum publikasi."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Controls Bar"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Meta Group"}
                    >
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Slug Text"}
                        data-text="true"
                      >
                        {"slug: /faq-contoh-draft"}
                      </div>
                      <div
                        className={
                          "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Order Text"}
                        data-text="true"
                      >
                        {"Urutan: #01"}
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401a] rounded-[4px]"
                        }
                        data-pencil-name={"Draft Badge"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Text"}
                          data-text="true"
                        >
                          {"Draf • belum disetujui"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Btn Group"}
                    >
                      <UiAction
                        label={"Simpan Revisi"}
                        className={
                          "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_10px] justify-start items-center bg-[#18181A] rounded-[6px]"
                        }
                        data-pencil-name={"Save Button"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Save Label"}
                          data-text="true"
                        >
                          {"Simpan Revisi"}
                        </div>
                      </UiAction>
                      <UiAction
                        label={"Batal"}
                        className={
                          "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Cancel Button"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Cancel Label"}
                          data-text="true"
                        >
                          {"Batal"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Accordion Item 2 - Collapsed"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                    }
                    data-pencil-name={"Title Bar"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"Left Column"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Meta Row"}
                      >
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Handle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_indicator"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                          }
                          data-pencil-name={"Cat Pill"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Cat Text"}
                            data-text="true"
                          >
                            {"Umum & Legalitas"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Order Text"}
                          data-text="true"
                        >
                          {"Urutan: #02"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                        }
                        data-pencil-name={"Question Title"}
                        data-text="true"
                      >
                        {
                          "Bagaimana tahapan alur kerja dan skema pembayaran proyek?"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Group"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Edit Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Expand Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"expand_more"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Meta"}
                    data-text="true"
                  >
                    {
                      "FAQ contoh • penempatan dan status belum disetujui"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Accordion Item 3 - Collapsed"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                    }
                    data-pencil-name={"Title Bar"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"Left Column"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Meta Row"}
                      >
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Handle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_indicator"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                          }
                          data-pencil-name={"Cat Pill"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Cat Text"}
                            data-text="true"
                          >
                            {"Umum & Legalitas"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Order Text"}
                          data-text="true"
                        >
                          {"Draf • menunggu persetujuan"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                        }
                        data-pencil-name={"Question Title"}
                        data-text="true"
                      >
                        {
                           "Bagaimana kepemilikan dan penyerahan kode sumber ditetapkan?"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Group"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Edit Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Expand Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"expand_more"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Meta"}
                    data-text="true"
                  >
                    {
                       "Jawaban dan ketentuan kepemilikan menunggu tinjauan serta persetujuan tertulis."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Accordion Item 4 - Collapsed"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                    }
                    data-pencil-name={"Title Bar"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"Left Column"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Meta Row"}
                      >
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Handle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_indicator"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                          }
                          data-pencil-name={"Cat Pill"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Cat Text"}
                            data-text="true"
                          >
                            {"Paket & Biaya"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Order Text"}
                          data-text="true"
                        >
                          {"Urutan: #04"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                        }
                        data-pencil-name={"Question Title"}
                        data-text="true"
                      >
                        {
                          "Apakah ada biaya tak terduga di luar estimasi kalkulator harga?"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Group"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Edit Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Expand Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"expand_more"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Meta"}
                    data-text="true"
                  >
                    {
                      "Urutan: #04 • Fixed-Scope Guarantee • Tampil di Kalkulator Estimasi"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px_14px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Accordion Item 5 - Collapsed"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                    }
                    data-pencil-name={"Title Bar"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"Left Column"}
                    >
                      <div
                        className={
                          "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Meta Row"}
                      >
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Handle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_indicator"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                          }
                          data-pencil-name={"Cat Pill"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Cat Text"}
                            data-text="true"
                          >
                            {"Teknis & Hosting"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Order Text"}
                          data-text="true"
                        >
                          {"Urutan: #05"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[17px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                        }
                        data-pencil-name={"Question Title"}
                        data-text="true"
                      >
                        {
                           "Bagaimana kebijakan privasi dan pemrosesan data ditetapkan?"
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Group"}
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Edit Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Expand Icon"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"expand_more"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Meta"}
                    data-text="true"
                  >
                    {
                      "FAQ contoh • klaim keamanan dan publikasi belum diverifikasi"
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                }
                data-pencil-name={"FAQ Footer"}
                data-responsive="row"
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Status Info"}
                  data-text="true"
                >
                  {
                    "Contoh nonaktif • Belum disinkronkan atau dipublikasikan"
                  }
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Preview Link"}
                  data-text="true"
                >
                  {"Pratinjau Accordion Publik ↗"}
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
