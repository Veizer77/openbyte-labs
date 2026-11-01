// Ported from prototype/stitch/cms/manajemen-staf.html. Prototype remains read-only.
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  SearchField,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
export default function CmsManajemenStaf() {
  return (
    <ScreenState screen={"cms/manajemen-staf"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 15 - Manajemen Staf & Role RBAC"}
        data-screen={"cms/manajemen-staf"}
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
                  {"Pengaturan Sistem"}
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
                  {"Staf & Role RBAC"}
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
                  {"Manajemen Akun Staf & Role RBAC"}
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
                    {"Status MFA dan lingkup akses belum diverifikasi"}
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
                  "Pratinjau pengelolaan staf • peran, MFA, dan status sesi belum dikonfigurasi atau diverifikasi."
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
                  {"Matriks Hak Akses"}
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
                  {"person_add"}
                </div>
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tambah Anggota Staf"}
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
                  {"TOTAL ANGGOTA STAF"}
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
                    {"group"}
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
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Status MFA belum diverifikasi"}
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
                  {"PERAN TERDEFINISI"}
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
                    {"admin_panel_settings"}
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
                    {"Role contoh"}
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
                    {"Granular Policy"}
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
                  {"SESI LOGIN • CONTOH"}
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
                  {"ROTASI KREDENSIAL"}
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
                    {"sync"}
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
                      "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Kebijakan menunggu tinjauan"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DataRows
            texts={[
              "Semua Staf (8)     Superadmin (2)     Lead Engineer (3)     Finance & BAST (2)     Client Auditor (1)      search   Cari nama, email, role...",
              "NAMA & EMAIL STAF   PERAN (ROLE)   KEAMANAN 2FA   LINGKUP AKSES   AKTIVITAS TERAKHIR   AKSI",
              "Akun contoh 1   admin@example.invalid       Owner (contoh)      Status MFA belum diverifikasi     Akses contoh     Data contoh",
              "Akun contoh 2   editor@example.invalid       Editor (contoh)      Status MFA belum diverifikasi     Akses contoh     Data contoh",
              "Akun contoh 3   security@example.invalid       Peran belum ditetapkan      Status MFA belum diverifikasi     Akses contoh     Data contoh",
              "Akun contoh 4   finance@example.invalid       Peran belum ditetapkan      Status MFA belum diverifikasi     Akses contoh     Data contoh",
            ]}
            rowFlags={[false, false, true, true, true, true]}
            className={
              "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] rounded-[16px]"
            }
            data-pencil-name={"Staff RBAC Table Container"}
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
                    {"Semua Staf (8)"}
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
                    {"Superadmin (2)"}
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
                    {"Lead Engineer (3)"}
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
                    {"Finance & BAST (2)"}
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
                    {"Client Auditor (1)"}
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
                  label={"Cari nama, email, role..."}
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
                      "text-[11px]/[normal] box-border flex-[2.5] min-w-[200px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"NAMA & EMAIL STAF"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[1.5] min-w-[130px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"PERAN (ROLE)"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[1.5] min-w-[130px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"KEAMANAN 2FA"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[2] min-w-[180px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"LINGKUP AKSES"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border flex-[1.5] min-w-[130px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"AKTIVITAS TERAKHIR"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-[100px] shrink-0 text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-right [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"AKSI"}
                  </div>
                </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[59px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Staff Row"}
            >
              <div
                className={
                  "box-border flex-[2.5] min-w-[200px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"M"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Admin Contoh"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"admin@example.invalid"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#18181A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Superadmin"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Status MFA belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Lingkup akses belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Aktivitas contoh • alamat jaringan disamarkan"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Izin"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#FEE2E2] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#EF4444] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Cabut"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[59px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Staff Row"}
            >
              <div
                className={
                  "box-border flex-[2.5] min-w-[200px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"R"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Staf Demo 1"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"editor@example.invalid"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Lead GIS & Spatial"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Metode autentikasi contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Modul Spasial & Proyek #03, #07"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"15 Menit Lalu"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Izin"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#FEE2E2] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#EF4444] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Cabut"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[59px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Staff Row"}
            >
              <div
                className={
                  "box-border flex-[2.5] min-w-[200px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"F"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Staf Demo 2"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"security@example.invalid"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#18181A1A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Peran contoh"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Status MFA belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Lingkup akses belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"1 Jam Lalu"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Izin"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#FEE2E2] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#EF4444] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Cabut"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full min-w-[960px] h-auto min-h-[59px] shrink-0 flex flex-row gap-0 p-[14px_16px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#F0F0F0]"
              }
              data-pencil-name={"Staff Row"}
            >
              <div
                className={
                  "box-border flex-[2.5] min-w-[200px] shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"S"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Staf Demo 3"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"finance@example.invalid"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[3px_8px] justify-start items-start bg-[#F59E0B1A] rounded-[4px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#F59E0B] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Finance & BAST"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                }
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Metode autentikasi contoh"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[2] min-w-[180px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Invoicing, BAST, Termin Klien"}
                </div>
              </div>
              <div
                className={
                  "box-border flex-[1.5] min-w-[130px] shrink-0 h-fit flex flex-row gap-0 justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"3 Jam Lalu"}
                </div>
              </div>
              <div
                className={
                  "box-border w-[100px] shrink-0 h-fit flex flex-row gap-[6px] justify-end items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Izin"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[28px] flex flex-row gap-0 p-[4px_8px] justify-start items-center bg-[#FEE2E2] rounded-[6px]"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#EF4444] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Cabut"}
                  </div>
                </div>
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
