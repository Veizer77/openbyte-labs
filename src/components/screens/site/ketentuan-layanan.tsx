// Ported from prototype/stitch/site/ketentuan-layanan.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
export default function SiteKetentuanLayanan() {
  return (
    <ScreenState screen={"site/ketentuan-layanan"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 12 - Informasi Layanan"}
        data-screen={"site/ketentuan-layanan"}
        id="konten"
        tabIndex={-1}
      >
        <main
          className={
            "box-border w-full h-fit shrink-0 flex flex-col gap-0 pt-[64px] pb-16 justify-start items-stretch bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-col justify-center items-center bg-[#18181A] py-14"
            }
            data-pencil-name={"Hero Section"}
          >
            <div
              className={
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-[16px] justify-start items-start"
              }
            >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#D2D88F26] rounded-[9999px]"
              }
            >
              <div
                className={
                  "box-border w-[6px] shrink-0 h-[6px] bg-[#D2D88F] rounded-[50%]"
                }
              ></div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"INFORMASI LAYANAN"}
              </div>
            </div>
            <div
              className={
                "text-[42px]/[48px] box-border w-full text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-1px] text-left"
              }
              data-text="true"
            >
              {"Informasi Layanan"}
            </div>
            <div
              className={
                "text-[15px]/[24px] box-border w-full text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
              }
              data-text="true"
            >
              {
                "Halaman contoh ini belum disetujui sebagai ketentuan resmi. Ruang lingkup layanan, dukungan, keamanan, kepemilikan, dan pembayaran disepakati tertulis untuk setiap proyek."
              }
            </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-row gap-0 justify-start items-start"
            }
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start"
              }
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Legal Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[18px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified_user"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {
                      "1. Dukungan & Pemeliharaan"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_42px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Waktu respons, cakupan dukungan, dan jalur eskalasi belum ditetapkan pada halaman contoh ini."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Garansi dan masa pemeliharaan, jika disepakati, mengikuti dokumen proyek yang telah disetujui para pihak."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Dokumen kebutuhan dan teknis ditentukan berdasarkan ruang lingkup proyek yang disepakati."
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Legal Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[18px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"lock"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {
                      "2. Data & Kerahasiaan"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_42px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Ketentuan kerahasiaan dan akses data dibahas sebelum data atau sistem diberikan untuk pekerjaan proyek."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Penggunaan data uji perlu disepakati; gunakan data sintetis atau tersanitasi bila memungkinkan."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Praktik penyimpanan dan akses kredensial harus dijelaskan dalam kesepakatan dan implementasi proyek; halaman ini tidak menyatakan kontrol teknis tertentu."
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Legal Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                  }
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[18px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"code"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {
                      "3. Hak Cipta & Transfer Repositori"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_42px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Kepemilikan source code, aset desain, dan materi proyek ditetapkan dalam kontrak atau dokumen proyek yang disetujui."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Ketentuan penggunaan, pemeliharaan, dan transfer akses dibahas sesuai kebutuhan masing-masing proyek."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Komponen pihak ketiga dan lisensinya perlu ditinjau sesuai teknologi yang digunakan pada proyek."
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Legal Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[8px]"
                    }
                  >
                    <div
                      className={
                        "text-[18px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"payments"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"4. Pembayaran & Serah Terima"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_42px] justify-start items-start"
                  }
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Termin dan jadwal pembayaran ditentukan dalam kesepakatan tertulis untuk setiap proyek."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Tahapan review dan penerimaan hasil ditentukan berdasarkan ruang lingkup yang disepakati."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
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
                        "text-[13px]/[20px] box-border [flex:1_1_0] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Dokumen serah terima, bila diperlukan, disiapkan sesuai kesepakatan para pihak."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
        <PublicHeader />
      </div>
    </ScreenState>
  );
}
