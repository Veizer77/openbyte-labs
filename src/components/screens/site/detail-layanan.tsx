// Ported from prototype/stitch/site/detail-layanan.html. Prototype remains read-only.
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
export default function SiteDetailLayanan() {
  return (
    <ScreenState screen={"site/detail-layanan"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 09 - Detail Layanan"}
        data-screen={"site/detail-layanan"}
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
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 justify-start items-start"
              }
            >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#D2D88F26] rounded-[9999px]"
              }
              data-pencil-name={"Badge"}
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
                {"DRAF LAYANAN • MENUNGGU PERSETUJUAN"}
              </div>
            </div>
            <div
              className={
                "text-[44px]/[51px] box-border w-full text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-1px] text-left"
              }
              data-pencil-name={"Hero Title"}
              data-text="true"
            >
              {"Sistem Informasi Sesuai Kebutuhan"}
            </div>
            <div
              className={
                "text-[16px]/[26px] box-border w-full text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
              }
              data-pencil-name={"Hero Desc"}
              data-text="true"
            >
              {
                "Pilihan teknologi, arsitektur, kontrol keamanan, jadwal, dan hasil kerja ditentukan setelah kebutuhan proyek ditinjau dan dicantumkan dalam penawaran tertulis."
              }
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] p-[8px_0px_0px_0px] justify-start items-center"
              }
              data-pencil-name={"CTA Row"}
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#D2D88F] rounded-[8px]"
                }
                data-pencil-name={"Btn Simulasi"}
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Simulasikan di Kalkulator"}
                </div>
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"arrow_forward"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center [outline:1px_solid_#3F3F46] [outline-offset:-0.5px] rounded-[8px]"
                }
                data-pencil-name={"Btn Konsul"}
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Diskusikan Kebutuhan"}
                </div>
              </div>
            </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10"
            }
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              }
              data-pencil-name={"Specs Row"}
            >
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
              }
              data-pencil-name={"Spec Card"}
              data-section-padding="true"
            >
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"speed"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Tingkat Layanan"}
              </div>
              <div
                className={
                  "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Belum disepakati"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Diatur dalam dokumen proyek"}
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
              }
              data-pencil-name={"Spec Card"}
              data-section-padding="true"
            >
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"security"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Standar Keamanan"}
              </div>
              <div
                className={
                  "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Kontrol Keamanan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Ditentukan sesuai ruang lingkup"}
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
              }
              data-pencil-name={"Spec Card"}
              data-section-padding="true"
            >
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"schedule"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Estimasi Pengerjaan"}
              </div>
              <div
                className={
                  "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Belum ditetapkan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Dibahas setelah asesmen"}
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
              }
              data-pencil-name={"Spec Card"}
              data-section-padding="true"
            >
              <div
                className={
                  "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"payments"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Biaya Proyek"}
              </div>
              <div
                className={
                  "text-[20px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Belum ditetapkan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Diatur dalam penawaran"}
              </div>
            </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-6 justify-start items-start"
            }
            data-pencil-name={"Deliverables Section"}
          >
            <div
              className={
                "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.6px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"AREA YANG DAPAT DIBAHAS DALAM PENAWARAN"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[16px] justify-start items-start"
              }
              data-pencil-name={"Grid 2x2"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
                }
              >
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                  }
                  data-pencil-name={"Module Card"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Antarmuka dan aplikasi web"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {
                      "Rancangan antarmuka dan teknologi ditentukan berdasarkan kebutuhan serta batasan proyek."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tag Box"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Teknologi belum ditetapkan"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                  }
                  data-pencil-name={"Module Card"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Data dan integrasi"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {
                      "Kebutuhan penyimpanan, pemindahan, pencadangan, dan retensi data perlu ditinjau serta disepakati."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tag Box"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Komponen belum ditetapkan"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
                }
              >
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                  }
                  data-pencil-name={"Module Card"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Akses dan keamanan"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {
                      "Persyaratan keamanan dan kontrol akses ditentukan menurut risiko serta ruang lingkup proyek."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tag Box"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Belum diverifikasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-fit flex flex-col gap-[10px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                  }
                  data-pencil-name={"Module Card"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Rilis dan pengoperasian"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-text="true"
                  >
                    {
                      "Proses rilis, infrastruktur, sertifikat, dan layanan pihak ketiga ditentukan dalam ruang lingkup proyek."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_8px] justify-start items-start bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Tag Box"}
                  >
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Belum ditetapkan"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12"
            }
          >
            <Link
              href={"/konsultasi"}
              className={
                "box-border w-full h-fit flex flex-col md:flex-row gap-6 p-8 md:p-10 justify-between items-start md:items-center bg-[#F9F9FB] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[16px] hover:shadow-md transition-shadow"
              }
              data-pencil-name={"CTA Banner"}
            >
              <div
                className={
                  "box-border flex-1 min-w-0 h-fit flex flex-col gap-[6px] justify-start items-start"
                }
              >
                <div
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.4px] text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Bahas kebutuhan sistem Anda"}
                </div>
                <div
                  className={
                    "text-[13px]/[19px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Ajukan konsultasi. Ketersediaan, penawaran, jadwal, dan ruang lingkup akan dikonfirmasi sebelum pekerjaan dimulai."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
                }
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[10px_18px] justify-start items-center bg-[#18181A] rounded-[8px]"
                  }
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Jadwalkan Konsultasi"}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </main>
        <PublicFooter />
        <PublicHeader />
      </div>
    </ScreenState>
  );
}
