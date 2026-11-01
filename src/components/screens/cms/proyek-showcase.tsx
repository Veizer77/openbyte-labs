// Ported from prototype/stitch/cms/proyek-showcase.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  SearchField,
  FilterButton,
  FilterDropdown,
  DataRows,
  ScreenState,
  ToggleControl,
} from "@/components/preview/Controls";
export default function CmsProyekShowcase() {
  return (
    <ScreenState screen={"cms/proyek-showcase"}>
      <div
        className={
          "box-border w-full min-h-screen bg-[#f9f9f9] relative screen admin-screen flex flex-col"
        }
        data-pencil-name={"CMS / 03 - Proyek Showcase"}
        data-screen={"cms/proyek-showcase"}
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
                "box-border w-full max-w-[1920px] mx-auto flex flex-col gap-0 justify-start items-start"
              }
              data-pencil-name={"div"}
            >
              <section
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-5 p-4 sm:p-6 pb-3 justify-start items-start"
                }
                data-pencil-name={"section"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border flex-1 min-w-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <nav
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-wrap gap-[6px] justify-start items-center"
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
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"/"}
                        data-text="true"
                      >
                        {"/"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Konten Website"}
                        data-text="true"
                      >
                        {"Konten Website"}
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
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Proyek Showcase"}
                        data-text="true"
                      >
                        {"Proyek Showcase"}
                      </div>
                    </nav>
                    <div
                      className={
                        "box-border w-full h-auto flex flex-wrap gap-2.5 items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <h1
                        className={
                          "text-[24px]/[32px] sm:text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left m-0"
                        }
                        data-pencil-name={"Katalog Portofolio & Studi Kasus"}
                        data-text="true"
                        data-heading="true"
                      >
                        {"Katalog Portofolio & Studi Kasus"}
                      </h1>
                      <div
                        className={
                          "box-border w-fit h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                        }
                        data-pencil-name={"Filament Engine v3.4"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Next.js App Router"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "text-[13px]/[20px] sm:text-[14px]/[23px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Kelola portofolio sistem, sinkronisasi a"
                      }
                      data-text="true"
                    >
                      {
                        "Pratinjau pengelolaan contoh proyek. Status publikasi, media, dan sinkronisasi tidak terhubung ke layanan dan belum diverifikasi."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[4px] p-[4px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[6px_12px] justify-start items-center bg-[#ffffff] rounded-[8px]"
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
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"DRAF • BELUM DISETUJUI"}
                          data-text="true"
                        >
                          {"DRAF • BELUM DISETUJUI"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"0 Proyek"}
                          data-text="true"
                        >
                          {"0 Proyek"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[6px_12px] justify-start items-center rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[8px] shrink-0 h-[8px] bg-[#f97316] rounded-[50%]"
                        }
                        data-pencil-name={"span"}
                      ></div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"DRAFT PIPELINE"}
                          data-text="true"
                        >
                          {"DRAFT PIPELINE"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"5 Draft"}
                          data-text="true"
                        >
                          {"5 Draft"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col md:flex-row gap-3 p-3 justify-between items-start md:items-center bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-full md:w-auto flex-1 flex flex-wrap gap-2 items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border flex-1 sm:w-[260px] sm:flex-initial h-[34px] flex flex-row gap-[6px] px-3 justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"search"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"search"}
                      </div>
                      <div
                        className={
                          "box-border flex-1 min-w-0 h-[18px] flex flex-col gap-0 justify-center items-start overflow-hidden"
                        }
                        data-pencil-name={"Filter judul, slug, atau klien..."}
                      >
                        <SearchField
                          label={"Filter judul, slug, atau klien..."}
                          className={
                            "text-[13px]/[18px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        />
                      </div>
                    </div>
                    <FilterDropdown
                      label={"Semua Kategori"}
                      className={
                        "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[4px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"button"}
                    >
                      <div
                        className={
                          "text-[16px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"filter_list"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"filter_list"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"Semua Kategori"}
                        data-text="true"
                      >
                        {"Semua Kategori"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"expand_more"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"expand_more"}
                      </div>
                    </FilterDropdown>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <FilterButton
                        value={"Semua"}
                        className={
                          "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_8px] justify-start items-center bg-[#18181a] rounded-[6px]"
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
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_6px] justify-center items-start bg-[#ffffff33] rounded-[9999px]"
                          }
                          data-pencil-name={"5"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"5"}
                          </div>
                        </div>
                      </FilterButton>
                      <FilterButton
                        value={"Draft"}
                        className={
                          "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_8px] justify-start items-center rounded-[6px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Draf • belum disetujui"}
                          data-text="true"
                        >
                          {"Draf • belum disetujui"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                            data-pencil-name={"0"}
                          data-text="true"
                        >
                            {"0"}
                        </div>
                      </FilterButton>
                      <FilterButton
                        value={"Draft"}
                        className={
                          "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_8px] justify-start items-center rounded-[6px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Draft"}
                          data-text="true"
                        >
                          {"Draft"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"1"}
                          data-text="true"
                        >
                          {"1"}
                        </div>
                      </FilterButton>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full md:w-auto shrink-0 flex flex-wrap gap-2 justify-start md:justify-end items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <UiAction
                      label={"Reorder Proyek (Drag & Drop)"}
                      className={
                        "box-border w-fit shrink-0 h-[34px] flex flex-row gap-[4px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                      }
                      data-pencil-name={"button"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"drag_indicator"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"drag_indicator"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"Reorder Proyek (Drag & Drop)"}
                        data-text="true"
                      >
                        {"Reorder Proyek (Drag & Drop)"}
                      </div>
                    </UiAction>
                    <UiAction
                      label={"Tambah Portofolio Baru"}
                      className={
                        "box-border w-fit shrink-0 h-[34px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[4px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[8px]"
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
                        data-pencil-name={"Tambah Portofolio Baru"}
                        data-text="true"
                      >
                        {"Tambah Portofolio Baru"}
                      </div>
                    </UiAction>
                  </div>
                </div>
              </section>
              <section
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 px-4 sm:px-6 pb-6 justify-start items-start"
                }
                data-pencil-name={"section"}
                data-responsive="row"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border xl:col-span-5 flex flex-col gap-[16px] justify-start items-start w-full"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px] overflow-hidden"
                    }
                    data-pencil-name={"div"}
                    data-table-scroll="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_8px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"view_stream"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"view_stream"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Daftar Proyek Contoh • Draf"}
                          data-text="true"
                        >
                          {"Daftar Proyek Contoh • Draf"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Pinned Badge"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"push_pin"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"label"}
                          data-text="true"
                        >
                          {"Sticky Master Pane"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start overflow-hidden"
                      }
                      data-pencil-name={"table"}
                      role="table"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center bg-[#f0f0f099]"
                        }
                        data-pencil-name={"tr"}
                      >
                        <div
                          className={
                            "box-border w-[40px] shrink-0 h-fit flex flex-col gap-0 p-[10px_4px] justify-center items-center rounded-[8px_0px_0px_8px]"
                          }
                          data-pencil-name={"POS"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"POS"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[10px_8px] justify-center items-start"
                          }
                          data-pencil-name={"ENTITAS & STACK"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"ENTITAS & STACK"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[10px_4px] justify-center items-center"
                          }
                          data-pencil-name={"STATUS"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-center [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"STATUS"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[96px] shrink-0 h-fit flex flex-col gap-0 p-[10px_8px] justify-center items-end rounded-[0px_8px_8px_0px]"
                          }
                          data-pencil-name={"AKSI"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-right [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"AKSI"}
                          </div>
                        </div>
                      </div>
                      <DataRows
                        texts={[
                          "1    star        Proyek Contoh    Instansi / Pemdes     Next.js, PostgreSQL, Maps    cloud_off   Media belum disinkronkan    Draft        edit_note     content_copy     more_vert",
                          "2    star        Proyek Contoh 2    Instansi / Pemdes     React, PostgreSQL        Draft        edit     more_vert",
                          "3    star        Proyek Contoh 3    Mobile & IoT     Flutter, PostgreSQL        Draft        edit     more_vert",
                          "4    star_border        Proyek Contoh 4    Bisnis / Retail     React, PostgreSQL        Draft        edit     more_vert",
                           "5    star_border        Proyek Contoh 5    Organisasi Demo      warning   Aset menunggu tinjauan         Draft        edit     delete_outline",
                        ]}
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"tbody"}
                      >
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start bg-[#e8e8e866]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[111.25px] flex flex-col gap-0 p-[12px_4px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[32px] h-[44px] shrink-0 flex flex-col gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[24px] h-[24px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#18181a] rounded-[6px]"
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
                                  "text-[16px]/[16px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"star"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"star"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px_8px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-full min-w-0 h-auto shrink-0 flex flex-col gap-[4px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-[42px] shrink-0 flex flex-col gap-[6px] justify-start items-start"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Proyek Demo"}
                                  data-text="true"
                                >
                                  {"Proyek Demo"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                                  }
                                  data-pencil-name={"Instansi / Pemdes"}
                                >
                                  <div
                                    className={
                                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"Instansi / Pemdes"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={
                                  "Next.js 14, PostGIS 3, Leaflet"
                                }
                                data-text="true"
                              >
                                {"Next.js 14, PostGIS 3, Leaflet"}
                              </div>
                              <div
                                className={
                                  "box-border w-[131.92px] h-[16.5px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[13px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"cloud_off"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"cloud_off"}
                                </div>
                                <div
                                  className={
                                    "text-[11px]/[17px] box-border text-[#82b440] font-[SFMono-Regular,system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Belum disinkronkan"}
                                  data-text="true"
                                >
                                  {"Belum disinkronkan"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_4px] justify-start items-center"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[48.45px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82b4401a] rounded-[9999px]"
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
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"Draft"}
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[96px] shrink-0 h-[111.25px] flex flex-col gap-0 p-[12px_8px] justify-start items-end"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-end items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"edit_note"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"edit_note"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"edit_note"}
                                </div>
                              </UiAction>
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
                              <UiAction
                                label={"more_vert"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
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
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_4px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[32px] h-[44px] shrink-0 flex flex-col gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[24px] h-[24px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                                }
                                data-pencil-name={"2"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"2"}
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"star"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"star"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px_8px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-full min-w-0 h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-[42px] shrink-0 flex flex-col gap-[6px] justify-start items-start"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Proyek Contoh 2"}
                                  data-text="true"
                                >
                                  {"Proyek Contoh 2"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                                  }
                                  data-pencil-name={"Instansi / Pemdes"}
                                >
                                  <div
                                    className={
                                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"Instansi / Pemdes"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"React 18, InsForge, Vitest"}
                                data-text="true"
                              >
                                {"React 18, InsForge, Vitest"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_4px] justify-start items-center"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[48.45px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82b4401a] rounded-[9999px]"
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
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"Draft"}
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[96px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_8px] justify-start items-end"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[86px] h-fit shrink-0 flex flex-row gap-[4px] justify-end items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"edit"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"edit"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"edit"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"more_vert"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
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
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_4px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[32px] h-[44px] shrink-0 flex flex-col gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[24px] h-[24px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                                }
                                data-pencil-name={"3"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"3"}
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"star"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"star"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px_8px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-full min-w-0 h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-[42px] shrink-0 flex flex-col gap-[6px] justify-start items-start"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Proyek Contoh 3"}
                                  data-text="true"
                                >
                                  {"Proyek Contoh 3"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                                  }
                                  data-pencil-name={"Mobile & IoT"}
                                >
                                  <div
                                    className={
                                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"Mobile & IoT"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Flutter, Supabase, Next.js"}
                                data-text="true"
                              >
                                {"Flutter, Supabase, Next.js"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_4px] justify-start items-center"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[48.45px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82b4401a] rounded-[9999px]"
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
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"Draft"}
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[96px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_8px] justify-start items-end"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[86px] h-fit shrink-0 flex flex-row gap-[4px] justify-end items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"edit"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"edit"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"edit"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"more_vert"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
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
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_4px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[32px] h-[44px] shrink-0 flex flex-col gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[24px] h-[24px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                                }
                                data-pencil-name={"4"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"4"}
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"star_border"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"star_border"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px_8px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-full min-w-0 h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-[42px] shrink-0 flex flex-col gap-[6px] justify-start items-start"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Proyek Contoh 4"}
                                  data-text="true"
                                >
                                  {"Proyek Contoh 4"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                                  }
                                  data-pencil-name={"Bisnis / Retail"}
                                >
                                  <div
                                    className={
                                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"Bisnis / Retail"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"React Router v7, Neon DB"}
                                data-text="true"
                              >
                                {"React Router v7, Neon DB"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_4px] justify-start items-center"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[48.45px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#82b4401a] rounded-[9999px]"
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
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"Draft"}
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[96px] shrink-0 h-[87px] flex flex-col gap-0 p-[12px_8px] justify-start items-end"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[86px] h-fit shrink-0 flex flex-row gap-[4px] justify-end items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"edit"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"edit"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"edit"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"more_vert"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
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
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[1px_0px_0px_0px] justify-between items-start bg-[#f0f0f033] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#f0f0f0]"
                          }
                          data-pencil-name={"tr"}
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[84.5px] flex flex-col gap-0 p-[12px_4px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[32px] h-[44px] shrink-0 flex flex-col gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-[24px] h-[24px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                                }
                                data-pencil-name={"5"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"5"}
                                </div>
                              </div>
                              <div
                                className={
                                  "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"star_border"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"star_border"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px_8px] justify-start items-start"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-full min-w-0 h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "box-border w-full h-[42px] shrink-0 flex flex-col gap-[6px] justify-start items-start"
                                }
                                data-pencil-name={"div"}
                              >
                                <div
                                  className={
                                    "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                  }
                                   data-pencil-name={"Proyek Contoh 5"}
                                  data-text="true"
                                >
                                   {"Proyek Contoh 5"}
                                </div>
                                <div
                                  className={
                                    "box-border w-fit h-fit shrink-0 flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                                  }
                                  data-pencil-name={"Instansi"}
                                >
                                  <div
                                    className={
                                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                    }
                                    data-text="true"
                                  >
                                    {"Instansi"}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  "box-border w-full h-[14px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                                }
                                data-pencil-name={"p"}
                              >
                                <div
                                  className={
                                    "text-[14px]/[14px] box-border text-[#f97316] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"warning"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"warning"}
                                </div>
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Menanti WebP Hero image"}
                                  data-text="true"
                                >
                                  {"Menanti WebP Hero image"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[60px] shrink-0 h-fit flex flex-col gap-0 p-[12px_4px] justify-start items-center"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[53.02px] h-[18px] shrink-0 flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
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
                                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"Draft"}
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[96px] shrink-0 h-[84.5px] flex flex-col gap-0 p-[12px_8px] justify-start items-end"
                            }
                            data-pencil-name={"td"}
                          >
                            <div
                              className={
                                "box-border w-[86px] h-fit shrink-0 flex flex-row gap-[4px] justify-end items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"edit"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"edit"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"edit"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"delete_outline"}
                                className={
                                  "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                                }
                                data-pencil-name={"button"}
                              >
                                <div
                                  className={
                                    "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"delete_outline"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"delete_outline"}
                                </div>
                              </UiAction>
                            </div>
                          </div>
                        </div>
                      </DataRows>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
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
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"cloud_sync"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"cloud_sync"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[19px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                           data-pencil-name={"Status media contoh"}
                          data-text="true"
                        >
                           {"Status media contoh • belum diverifikasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-[128px] shrink-0 h-[24px] flex flex-row gap-[6px] p-[3px_8px] justify-start items-center bg-[#82B4401A] rounded-[9999px]"
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
                          data-pencil-name={"Belum dikonfigurasi"}
                          data-text="true"
                        >
                          {"Belum dikonfigurasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border w-full h-[48px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-pencil-name={
                        "Setiap gambar thumbnail & galeri dioptim"
                      }
                      data-text="true"
                    >
                      {
                        "Ketersediaan penyimpanan, konversi gambar, ukuran file, dan proses sinkronisasi belum dikonfigurasi atau diverifikasi pada preview."
                      }
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-full h-auto min-h-[50px] flex flex-col gap-0.5 p-2 justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Storage Terpakai"}
                          data-text="true"
                        >
                          {"Storage Terpakai"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum tersedia"}
                          data-text="true"
                        >
                          {"Belum tersedia"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto min-h-[50px] flex flex-col gap-0.5 p-2 justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Aset Terkompresi"}
                          data-text="true"
                        >
                          {"Aset Terkompresi"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum tersedia"}
                          data-text="true"
                        >
                          {"Belum tersedia"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto min-h-[50px] flex flex-col gap-0.5 p-2 justify-start items-start bg-[#f0f0f0] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Bandwidth Save"}
                          data-text="true"
                        >
                          {"Bandwidth Save"}
                        </div>
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Belum diukur"}
                          data-text="true"
                        >
                          {"Belum diukur"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border xl:col-span-7 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[20px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px] w-full"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[0px_0px_16px_0px] justify-start items-start bg-[#FFFFFF]"
                    }
                    data-pencil-name={"Editor Header"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-between items-center"
                      }
                      data-pencil-name={"Header Row 1"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center bg-[#FFFFFF]"
                        }
                        data-pencil-name={"Title Group"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-center bg-[#18181A] rounded-[6px]"
                          }
                          data-pencil-name={"Badge"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Badge Text"}
                            data-text="true"
                          >
                            {"Editor contoh • pratinjau"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Project Title"}
                          data-text="true"
                        >
                          {"Proyek Demo — Sistem Informasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center bg-[#FFFFFF]"
                        }
                        data-pencil-name={"Actions Group"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                          }
                          data-pencil-name={"Preview Btn"}
                        >
                          <UiAction
                            label={"visibility"}
                            className={
                              "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"visibility"}
                          </UiAction>
                          <div
                            className={
                              "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"label"}
                            data-text="true"
                          >
                            {"Pratinjau"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[32px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[6px_14px] justify-start items-center bg-[#18181A] rounded-[8px]"
                          }
                          data-pencil-name={"Save Btn"}
                        >
                          <div
                            className={
                              "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"save"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"label"}
                            data-text="true"
                          >
                            {"Simpan"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "text-[12px]/[17px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Subtitle"}
                      data-text="true"
                    >
                      {
                         "Contoh sistem informasi organisasi; rincian belum disetujui"
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-[24px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"badge"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"badge"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"1. Metadata & Identitas Klien"}
                        data-text="true"
                      >
                        {"1. Metadata & Identitas Klien"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[52px] shrink-0 flex flex-row gap-[12px] justify-start items-start mobile-auto-height"
                        }
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"JUDUL PORTOFOLIO (H1 PUBLIK)"}
                            data-text="true"
                          >
                            {"JUDUL PORTOFOLIO (H1 PUBLIK)"}
                          </div>
                          <div
                            className={
                              "box-border w-full h-[34px] shrink-0 flex flex-col gap-0 p-[8px_12px] justify-center items-start bg-[#ffffff] rounded-[8px] overflow-hidden"
                            }
                            data-pencil-name={
                              "Proyek Demo: Sistem Informasi"
                            }
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Proyek Demo: Sistem Informasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"SLUG URL (PERMALINK SEO)"}
                            data-text="true"
                          >
                            {"SLUG URL (PERMALINK SEO)"}
                          </div>
                          <div
                            className={
                              "box-border w-full h-[34px] shrink-0 flex flex-row gap-0 px-3 justify-start items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"/portofolio/"}
                              data-text="true"
                            >
                              {"/portofolio/"}
                            </div>
                            <div
                              className={
                                "box-border flex-1 min-w-0 h-[18px] flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"proyek-contoh"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"proyek-contoh"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-[52px] shrink-0 flex flex-row gap-[12px] justify-start items-start mobile-auto-height"
                        }
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"NAMA KLIEN / LEMBAGA"}
                            data-text="true"
                          >
                            {"NAMA KLIEN / LEMBAGA"}
                          </div>
                          <div
                            className={
                              "box-border w-full h-[34px] shrink-0 flex flex-col gap-0 p-[8px_12px] justify-center items-start bg-[#ffffff] rounded-[8px] overflow-hidden"
                            }
                            data-pencil-name={
                              "Organisasi Demo"
                            }
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Organisasi Demo"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[52px] flex flex-row gap-[8px] justify-start items-start mobile-auto-height"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"STATUS REVIEW"}
                              data-text="true"
                            >
                              {"STATUS REVIEW"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[34px] shrink-0 flex flex-col gap-0 p-[8px_12px] justify-center items-start bg-[#ffffff] rounded-[8px] overflow-hidden"
                              }
                              data-pencil-name={"Draft"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Draft"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"URUTAN DISPLAY"}
                              data-text="true"
                            >
                              {"URUTAN DISPLAY"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[34px] shrink-0 flex flex-col gap-0 p-[8px_12px] justify-center items-start bg-[#ffffff] rounded-[8px] overflow-hidden"
                              }
                              data-pencil-name={"1"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"1"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "MULTI-KATEGORI PROYEK (PILIH YANG RELEVA"
                        }
                        data-text="true"
                      >
                        {"MULTI-KATEGORI PROYEK (PILIH YANG RELEVAN)"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-wrap gap-2 items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_8px] justify-start items-center bg-[#18181a] rounded-[8px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <ToggleControl
                            label={"Instansi & Pemdes"}
                            className={
                              "box-border w-[13px] shrink-0 h-[13px]"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Instansi & Pemdes"}
                            data-text="true"
                          >
                            {"Instansi & Pemdes"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_8px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <ToggleControl
                            label={"Bisnis & UMKM"}
                            className={
                              "box-border w-[13px] shrink-0 h-[13px]"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Bisnis & UMKM"}
                            data-text="true"
                          >
                            {"Bisnis & UMKM"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_8px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <ToggleControl
                            label={"Mobile App Ecosystem"}
                            className={
                              "box-border w-[13px] shrink-0 h-[13px]"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Mobile App Ecosystem"}
                            data-text="true"
                          >
                            {"Mobile App Ecosystem"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[6px] p-[6px_8px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                          }
                          data-pencil-name={"label"}
                        >
                          <ToggleControl
                            label={"Sistem Spasial GIS"}
                            className={
                              "box-border w-[13px] shrink-0 h-[13px]"
                            }
                            data-pencil-name={"input"}
                          />
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Sistem Spasial GIS"}
                            data-text="true"
                          >
                            {"Sistem Spasial GIS"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
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
                          data-pencil-name={"TEKNOLOGI & SPESIFIKASI TEKNIS"}
                          data-text="true"
                        >
                          {"TEKNOLOGI & SPESIFIKASI TEKNIS"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"+ Tambah Tag Stack"}
                          data-text="true"
                        >
                          {"+ Tambah Tag Stack"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-wrap gap-2 p-[8px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[26px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                        >
                          <div
                            className={
                              "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Next.js 14 App Router"}
                            data-text="true"
                          >
                            {"Next.js 14 App Router"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"close"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"close"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[26px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                        >
                          <div
                            className={
                              "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PostGIS 3 Relational"}
                            data-text="true"
                          >
                            {"PostGIS 3 Relational"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"close"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"close"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[26px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                        >
                          <div
                            className={
                              "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Leaflet GeoJSON Engine"}
                            data-text="true"
                          >
                            {"Leaflet GeoJSON Engine"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"close"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"close"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[26px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"span"}
                        >
                          <div
                            className={
                              "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"SHA-256 QR Crypto Sign"}
                            data-text="true"
                          >
                            {"SHA-256 QR Crypto Sign"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"close"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"close"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-auto min-w-[140px] flex-1 h-[26px] flex flex-col gap-0 px-2 justify-center items-start overflow-hidden"
                          }
                          data-pencil-name={"Ketik tag stack..."}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Ketik tag stack..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
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
                          "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"photo_library"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"photo_library"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "2. Manajemen Media & Auto WebP Engine"
                          }
                          data-text="true"
                        >
                          {"2. Manajemen Media & Auto WebP Engine"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                        }
                        data-pencil-name={"Bucket belum dikonfigurasi"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Bucket belum dikonfigurasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-full sm:w-[240px] shrink-0 h-fit flex flex-col gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"GAMBAR UTAMA (HERO SHOWCASE)"}
                          data-text="true"
                        >
                          {"GAMBAR UTAMA (HERO SHOWCASE)"}
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            aria-label={"Gambar proyek contoh disembunyikan"}
                            className={
                              "box-border w-full h-[130px] shrink-0 opacity-[0.9] bg-[#18181a] relative [z-index:0]"
                            }
                            data-pencil-name={"Placeholder gambar"}
                          />
                          <div
                            className={
                              "box-border w-fit h-fit [backdrop-filter:blur(6px)] absolute left-[8px] top-[8px] flex flex-row gap-[4px] p-[2px_8px] justify-start items-center bg-[#18181acc] rounded-[4px] [z-index:1]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[12px]/[12px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"pending"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"pending"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Status optimasi media belum diverifikasi"}
                              data-text="true"
                            >
                              {"Status optimasi media belum diverifikasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={
                              "Informasi media contoh"
                          }
                          data-text="true"
                        >
                          {
                            "Resolusi, format, dan optimasi gambar belum diverifikasi."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border flex-1 min-w-0 w-full h-fit flex flex-col gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border flex-1 min-w-0 h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left truncate"
                            }
                            data-pencil-name={
                              "GALERI CUPLIKAN LAYAR (SCREENSHOTS REPEA"
                            }
                            data-text="true"
                          >
                            {"GALERI CUPLIKAN LAYAR (SCREENSHOTS REPEATER)"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border w-fit shrink-0 h-auto text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-right [white-space:nowrap]"
                            }
                            data-pencil-name={"Maksimal 6 slide"}
                            data-text="true"
                          >
                            {"Maksimal 6 slide"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-full h-[70px] flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[8px] overflow-hidden relative"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              aria-label={"Gambar contoh disembunyikan"}
                              className={
                                "box-border w-full h-full shrink-0 bg-[#18181a] relative [z-index:0]"
                              }
                              data-pencil-name={"Placeholder gambar"}
                            />
                            <div
                              className={
                                "box-border w-fit h-[16px] absolute right-2 bottom-1.5 flex flex-col gap-0 px-1.5 justify-center items-start bg-[#18181ae6] rounded-[4px] [z-index:1]"
                              }
                              data-pencil-name={"Ukuran media belum diverifikasi"}
                            >
                              <div
                                className={
                                  "text-[9px]/[14px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Ukuran media belum diverifikasi"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-[70px] flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[8px] overflow-hidden relative"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              aria-label={"Gambar contoh disembunyikan"}
                              className={
                                "box-border w-full h-full shrink-0 bg-[#18181a] relative [z-index:0]"
                              }
                              data-pencil-name={"Placeholder gambar"}
                            />
                            <div
                              className={
                                "box-border w-fit h-[16px] absolute right-2 bottom-1.5 flex flex-col gap-0 px-1.5 justify-center items-start bg-[#18181ae6] rounded-[4px] [z-index:1]"
                              }
                              data-pencil-name={"Ukuran media belum diverifikasi"}
                            >
                              <div
                                className={
                                  "text-[9px]/[14px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Ukuran media belum diverifikasi"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-[70px] flex flex-col gap-1 p-2 justify-center items-center bg-[#ffffff] border border-dashed border-neutral-300 hover:border-neutral-400 rounded-[8px] cursor-pointer transition-colors"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[20px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"cloud_upload"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"cloud_upload"}
                            </div>
                            <div
                              className={
                                "text-[10px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                              }
                              data-pencil-name={"Unggah media • pratinjau saja"}
                              data-text="true"
                            >
                              {"Unggah media • pratinjau saja"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border flex-1 min-w-0 h-fit flex flex-row gap-2 justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol shrink-0"
                          }
                          data-pencil-name={"schema"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"schema"}
                        </div>
                        <div
                          className={
                            "box-border flex-1 min-w-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "3. Blok Arsitektur Konten (Filament Cont"
                            }
                            data-text="true"
                          >
                            {
                              "3. Blok Arsitektur Konten (Filament Content Builder)"
                            }
                          </div>
                          <div
                            className={
                              "text-[12px]/[16px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Struktur narasi teknis: Masalah Lapangan"
                            }
                            data-text="true"
                          >
                            {
                              "Struktur narasi teknis: Masalah Lapangan → Solusi Rekayasa → Dampak Terukur"
                            }
                          </div>
                        </div>
                      </div>
                      <UiAction
                        label={"Preset Standar"}
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[6px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[14px]/[14px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"tune"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"tune"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border w-fit shrink-0 h-auto text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Preset Standar"}
                          data-text="true"
                        >
                          {"Preset Standar"}
                        </div>
                      </UiAction>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_4px_0px] justify-between items-center"
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
                                "box-border w-[24px] shrink-0 h-[24px] flex flex-col gap-0 justify-center items-center bg-[#f9731633] rounded-[4px]"
                              }
                              data-pencil-name={"01"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"01"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Blok: Tantangan & Hambatan Lapangan (3 C"
                              }
                              data-text="true"
                            >
                              {"Blok: Tantangan & Hambatan Lapangan (3 Cards)"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <UiAction
                              label={"drag_handle"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"drag_handle"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"drag_handle"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"expand_less"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"expand_less"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"expand_less"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"delete"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"delete"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"delete"}
                              </div>
                            </UiAction>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-full h-auto min-h-[104px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"POIN 1"}
                              data-text="true"
                            >
                              {"POIN 1"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"Fragmentasi Arsip Kertas"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Informasi Tersebar"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-center items-start"
                              }
                              data-pencil-name={
                                 "Data operasional tersebar di beberapa media"
                              }
                            >
                              <div
                                className={
                                  "text-[12px]/[15px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-text="true"
                              >
                                {
                                   "Informasi yang tersebar sulit diselaraskan dan ditinjau."
                                }
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[104px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"POIN 2"}
                              data-text="true"
                            >
                              {"POIN 2"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                               data-pencil-name={"Informasi Sulit Ditelusuri"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                 {"Informasi Sulit Ditelusuri"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-center items-start"
                              }
                              data-pencil-name={
                                 "Dokumen operasional sulit ditinjau"
                              }
                            >
                              <div
                                className={
                                  "text-[12px]/[15px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-text="true"
                              >
                                {
                                   "Tanpa sumber informasi terpusat, status dan perubahan sulit dilacak."
                                }
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[104px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"POIN 3"}
                              data-text="true"
                            >
                              {"POIN 3"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                               data-pencil-name={"Alur Persetujuan Manual"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                 {"Alur Persetujuan Manual"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-auto shrink-0 flex flex-col gap-0 justify-center items-start"
                              }
                              data-pencil-name={
                                "Proses legalisir surat pengantar membutu"
                              }
                            >
                              <div
                                className={
                                  "text-[12px]/[15px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                                }
                                data-text="true"
                              >
                                {
                                  "Alur persetujuan dokumen masih bergantung pada proses manual dan sulit dilacak."
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-2 p-[0px_0px_4px_0px] justify-between items-start sm:items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border flex-1 min-w-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                            data-responsive="row"
                          >
                            <div
                              className={
                                "box-border w-[24px] shrink-0 h-[24px] flex flex-col gap-0 justify-center items-center bg-[#e2e89d] rounded-[4px]"
                              }
                              data-pencil-name={"02"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"02"}
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
                                  "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={
                                  "Blok: Solusi Rekayasa & Arsitektur Siste"
                                }
                                data-text="true"
                              >
                                {"Blok: Solusi Rekayasa & Arsitektur Sistem"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#c6cc84] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={"Obsidian Bento Mode"}
                                data-text="true"
                              >
                                {"Obsidian Bento Mode"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <UiAction
                              label={"drag_handle"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"drag_handle"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"drag_handle"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"expand_less"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"expand_less"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"expand_less"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"delete"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"delete"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"delete"}
                              </div>
                            </UiAction>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-full h-auto min-h-[133px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#242427] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full h-[14px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[14px]/[14px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"database"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"database"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#c6cc84] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"PONDASI DATA"}
                                data-text="true"
                              >
                                {"PONDASI DATA"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-[20px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"PostGIS Relasional"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"PostGIS Relasional"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[12px]/[15px] box-border w-full h-auto shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                              }
                              data-pencil-name={
                                "Arsitektur schema PostGIS menyimpan koor"
                              }
                              data-text="true"
                            >
                              {
                                "Arsitektur schema PostGIS menyimpan koordinat poligon batas RT dengan validasi topology otomatis."
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[133px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#242427] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full h-[14px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[14px]/[14px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"layers"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"layers"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#c6cc84] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"FRONTEND MAPS"}
                                data-text="true"
                              >
                                {"FRONTEND MAPS"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-[20px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"Leaflet GeoJSON Canvas"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"Leaflet GeoJSON Canvas"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[12px]/[15px] box-border w-full h-auto shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                              }
                              data-pencil-name={
                                "Rendering vector cepat pada perangkat mo"
                              }
                              data-text="true"
                            >
                              {
                                 "Performa dan penggunaan sumber daya belum diuji atau diverifikasi."
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[133px] flex flex-col gap-[6px] p-3 justify-start items-start bg-[#242427] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-full h-[14px] shrink-0 flex flex-row gap-[4px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[14px]/[14px] box-border text-[#c6cc84] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"qr_code_scanner"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"qr_code_scanner"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#c6cc84] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"VERIFIKASI INTEGRITI"}
                                data-text="true"
                              >
                                {"VERIFIKASI INTEGRITI"}
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-[20px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                              }
                              data-pencil-name={"SHA-256 Cryptographic QR"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"SHA-256 Cryptographic QR"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[12px]/[15px] box-border w-full h-auto shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                              }
                              data-pencil-name={
                                "Surat pengantar dibubuhi tanda tangan di"
                              }
                              data-text="true"
                            >
                              {
                                "Surat pengantar dibubuhi tanda tangan digital terenkripsi yang dapat divalidasi seketika tanpa login."
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_4px_0px] justify-between items-center"
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
                                "box-border w-[24px] shrink-0 h-[24px] flex flex-col gap-0 justify-center items-center bg-[#82b44033] rounded-[4px]"
                              }
                              data-pencil-name={"03"}
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-text="true"
                              >
                                {"03"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Blok: Hasil & Pengukuran Pasca Rilis (KP"
                              }
                              data-text="true"
                            >
                              {
                                "Blok: Hasil & Pengukuran Pasca Rilis (KPI Impact)"
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <UiAction
                              label={"drag_handle"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"drag_handle"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"drag_handle"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"expand_less"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"expand_less"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"expand_less"}
                              </div>
                            </UiAction>
                            <UiAction
                              label={"delete"}
                              className={
                                "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[4px]"
                              }
                              data-pencil-name={"button"}
                            >
                              <div
                                className={
                                  "text-[18px]/[18px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"delete"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"delete"}
                              </div>
                            </UiAction>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-full h-auto min-h-[76px] flex flex-col gap-2 p-3 justify-center items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[32px]/[32px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center"
                              }
                                data-pencil-name={"Belum diukur"}
                              data-text="true"
                            >
                                {"Belum diukur"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                              }
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"VALIDITAS ARSIP DIGITAL"}
                                data-text="true"
                              >
                                {"VALIDITAS ARSIP DIGITAL"}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[76px] flex flex-col gap-2 p-3 justify-center items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[32px]/[32px] box-border w-full text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center"
                              }
                              data-pencil-name={"Belum diukur"}
                              data-text="true"
                            >
                              {"Belum diukur"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                              }
                              data-pencil-name={"HASIL BELUM DIUKUR"}
                              data-text="true"
                            >
                                {"HASIL BELUM DIUKUR"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-full h-auto min-h-[76px] flex flex-col gap-2 p-3 justify-center items-center bg-[#ffffff] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[32px]/[32px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-center"
                              }
                              data-pencil-name={"Belum tersedia"}
                              data-text="true"
                            >
                              {"Belum tersedia"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                              }
                            >
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                }
                                data-pencil-name={"DATA OPERASIONAL BELUM TERSEDIA"}
                                data-text="true"
                              >
                                {"DATA OPERASIONAL BELUM TERSEDIA"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-center items-center bg-[#f0f0f04d] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[20px] flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"add_circle_outline"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"add_circle_outline"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Sisipkan Blok Konten Baru (Accordion, Ga"
                          }
                          data-text="true"
                        >
                          {
                            "Sisipkan Blok Konten Baru (Accordion, Galeri Teknis, atau Cuplikan Kode)"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f080] rounded-[12px]"
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
                          "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"link"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"link"}
                        </div>
                        <div
                          className={
                            "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"4. Tautan Publik & Repository"}
                          data-text="true"
                        >
                          {"4. Tautan Publik & Repository"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"+ Tambah Tautan"}
                        data-text="true"
                      >
                        {"+ Tambah Tautan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-full min-h-[54px] h-auto flex flex-row gap-2.5 p-3 justify-start items-center bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"public"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"public"}
                        </div>
                        <div
                          className={
                            "box-border flex-1 min-w-0 h-fit flex flex-col gap-[3px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"URL publik (belum ditetapkan)"}
                            data-text="true"
                          >
                            {"URL publik (belum ditetapkan)"}
                          </div>
                          <div
                            className={
                              "box-border w-full h-[18px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                            }
                            data-pencil-name={
                              "Belum ada tautan publik"
                            }
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left truncate w-full"
                              }
                              data-text="true"
                            >
                              {"Belum ada tautan publik"}
                            </div>
                          </div>
                        </div>
                        <UiAction
                          label={"open_in_new"}
                          className={
                            "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"open_in_new"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"open_in_new"}
                          </div>
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-full min-h-[54px] h-auto flex flex-row gap-2.5 p-3 justify-start items-center bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "text-[18px]/[18px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"code"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"code"}
                        </div>
                        <div
                          className={
                            "box-border flex-1 min-w-0 h-fit flex flex-col gap-[3px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "GitHub Repository (Private Client)"
                            }
                            data-text="true"
                          >
                            {"GitHub Repository (Private Client)"}
                          </div>
                          <div
                            className={
                              "box-border w-full h-[18px] shrink-0 flex flex-col gap-0 justify-center items-start overflow-hidden"
                            }
                            data-pencil-name={
                              "https://github.com/example/project-demo"
                            }
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-medium text-left truncate w-full"
                              }
                              data-text="true"
                            >
                              {"https://github.com/example/project-demo"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_6px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"Private"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Private"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-3 pt-3 border-t border-neutral-200/60 justify-between items-start sm:items-center"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-full sm:w-auto h-fit flex flex-row gap-2 justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol shrink-0"
                        }
                        data-pencil-name={"cloud_off"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"cloud_off"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border flex-1 sm:w-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                        }
                        data-pencil-name={
                          "Preview tidak terhubung ke penyimpanan"
                        }
                        data-text="true"
                      >
                        {
                          "Preview tidak terhubung ke penyimpanan; belum ada sinkronisasi."
                        }
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full sm:w-auto shrink-0 h-fit flex flex-row gap-2 justify-end items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[36px] flex flex-col gap-0 px-4 justify-center items-center bg-[#f0f0f0] hover:bg-neutral-200 transition-colors rounded-[8px] cursor-pointer"
                        }
                        data-pencil-name={"Batal"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Batal"}
                        </div>
                      </div>
                      <UiAction
                        label={"Publikasikan ke Showcase"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-2 px-4 justify-center items-center bg-[#18181a] hover:bg-neutral-800 transition-colors rounded-[8px] cursor-pointer"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[16px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"check_circle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"check_circle"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center whitespace-nowrap"
                          }
                          data-pencil-name={"Publikasikan ke Showcase"}
                          data-text="true"
                        >
                          {"Publikasikan ke Showcase"}
                        </div>
                      </UiAction>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </ScreenState>
  );
}
