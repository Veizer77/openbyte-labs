// Ported from prototype/stitch/cms/layanan-bento.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import { UiAction, ScreenState } from "@/components/preview/Controls";
export default function CmsLayananBento() {
  return (
    <ScreenState screen={"cms/layanan-bento"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 06 - Layanan Bento"}
        data-screen={"cms/layanan-bento"}
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
                  {"Konten Website"}
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
                  {"Layanan Bento"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Title Row"}
              >
                <h1
                  className={
                    "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap] m-0"
                  }
                  data-text="true"
                  data-heading="true"
                >
                  {"Manajemen Layanan & Kartu Bento"}
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
                    {"Konten layanan • draf"}
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
                  "Kelola draf layanan. Cakupan, harga, jadwal, teknologi, dan klaim perlu diverifikasi sebelum publikasi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"Actions Row"}
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-[36px] flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
                data-pencil-name={"Preview Btn"}
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
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Lihat Publik"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#00000014] flex flex-row gap-[6px] p-[8px_16px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
                data-pencil-name={"Add Service Btn"}
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
                  {"Tambah Layanan"}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            }
            data-pencil-name={"KPI Metrics Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card"}
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
                  {"Status Layanan"}
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
                    {"grid_view"}
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
                  {"4 Layanan"}
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
                    {"Status publikasi belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card"}
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
                  {"Total Modul Add-on"}
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
                    {"extension"}
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
                  {"Jumlah modul belum diverifikasi"}
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
                    {"+3 Baru Q2"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card"}
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
                  {"Rata-rata Nilai Kontrak"}
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
                  {"Belum ditetapkan"}
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
                    {"Harga menunggu persetujuan"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[16px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"KPI Card"}
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
                  {"Tingkat Konversi Lead"}
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
                    {"trending_up"}
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
                    {"Belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-col gap-[16px] justify-start items-start"
            }
            data-pencil-name={"Bento Services Container"}
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
              }
              data-pencil-name={"Bento Row 1"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-[680px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
                }
                data-pencil-name={"Card 1 - Web App"}
                data-responsive="fixed"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                      }
                    >
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"code"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Aplikasi Web"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Slug dan posisi ditetapkan setelah persetujuan"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_8px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
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
                        {"Draf • tidak dipublikasikan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                      }
                    >
                      <UiAction
                        label={"edit"}
                        className={
                          "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"edit"}
                      </UiAction>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Kelola"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Draf layanan contoh • ruang lingkup, teknologi, dan kesiapan belum diverifikasi atau disetujui."
                  }
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Next.js 14 App Router"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"PostGIS 3"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Docker & Kubernetes"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Cakupan per proyek"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#F9F9FB] rounded-[8px]"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {
                      "Harga dan jadwal ditetapkan dalam penawaran tertulis"
                    }
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status proyek belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit [box-shadow:0px_2px_4px_#0000001a] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#18181A] rounded-[16px]"
                }
                data-pencil-name={"Card 2 - Mobile Apps"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[8px]"
                      }
                    >
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"phone_android"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Mobile App Ecosystem"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Slug: /layanan/mobile-apps • Posisi: 02"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#242427] rounded-[6px]"
                    }
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Kelola"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[13px]/[20px] box-border w-full text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Draf layanan contoh • ruang lingkup, integrasi, kinerja, dan hasil pengujian belum disetujui."
                  }
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#242427] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Flutter 3.x"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#242427] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Supabase Realtime"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#242427] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Offline Cache"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#242427] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Biometrics"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#242427] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                      {"Harga dan jadwal belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status proyek belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
              }
              data-pencil-name={"Bento Row 2"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-[460px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
                }
                data-pencil-name={"Card 3 - GIS"}
                data-responsive="fixed"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                      }
                    >
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"map"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Sistem Spasial & WebGIS"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Slug: /layanan/web-gis • Posisi: 03"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Kelola"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Pemetaan area operasional dan aset organisasi dengan validasi geospasial dan antarmuka peta digital."
                  }
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"PostGIS Topology"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Leaflet GeoJSON"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"QGIS Integration"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#F9F9FB] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga dan jadwal belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status proyek belum diverifikasi"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
                }
                data-pencil-name={"Card 4 - Security Audit"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                      }
                    >
                      <div
                        className={
                          "text-[20px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"security"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                      }
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Audit Keamanan & Penetrasi Web"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Slug: /layanan/security-audit • Posisi: 04"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[4px] p-[6px_10px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                  >
                    <UiAction
                      label={"edit"}
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit"}
                    </UiAction>
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Kelola"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Cakupan pengujian, kontrol keamanan, dan infrastruktur harus ditinjau serta disepakati untuk setiap proyek."
                  }
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Kontrol belum ditetapkan"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Belum diverifikasi"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Sertifikasi tidak diklaim"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F0F0F0] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Infrastruktur belum ditetapkan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#F9F9FB] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga dan jadwal belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Data keamanan belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
            }
            data-pencil-name={"Add-ons Box"}
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
                    "text-[20px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"extension"}
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Katalog add-on contoh • belum dikonfigurasi"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-[32px] flex flex-row gap-[4px] p-[6px_12px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tambah Add-on"}
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start"
              }
              data-responsive="row"
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Layanan khusus • draf"}
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
                    {"Infrastruktur"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"QR Cryptographic Sign"}
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
                    {"Keamanan"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"WhatsApp Gateway Notif"}
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
                    {"Integrasi"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Retina WebP Compression"}
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
                    {"Performa"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Harga belum ditetapkan"}
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
