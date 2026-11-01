// Ported from prototype/stitch/site/blog.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
export default function SiteBlog() {
  return (
    <ScreenState screen={"site/blog"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 11 - Blog & Wawasan Rekayasa"}
        data-screen={"site/blog"}
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
                {"KUMPULAN INSIGHT & TECH RADAR"}
              </div>
            </div>
            <div
              className={
                "text-[42px]/[48px] box-border w-full text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-1px] text-left"
              }
              data-text="true"
            >
              {"Wawasan Rekayasa & Catatan Arsitektur Sistem"}
            </div>
            <div
              className={
                "text-[15px]/[24px] box-border w-full text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
              }
              data-text="true"
            >
              {
                "Analisis teknis mendalam, praktik terbaik implementasi PostGIS, pengujian penetrasi OWASP, dan strategi efisiensi infrastruktur cloud langsung dari tim engineer OpenByte Labs."
              }
            </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-row gap-0 justify-start items-start overflow-x-auto"
            }
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-center bg-[#18181A] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Semua Artikel (14)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Arsitektur Sistem (5)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"WebGIS & Spasial (4)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Keamanan Siber (3)"}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[8px_14px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
                }
              >
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"DevOps & Cloud (2)"}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-row gap-0 justify-start items-start"
            }
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit flex flex-row gap-[24px] p-[28px] justify-start items-center bg-[#F9F9FB] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[16px]"
              }
              data-pencil-name={"Featured Post"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[12px] justify-start items-start"
                }
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
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
                      {"WEBGIS & SPASIAL"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"• 8 Menit Baca • 14 April 2026"}
                  </div>
                </div>
                <div
                  className={
                    "text-[22px]/[normal] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.4px] text-left"
                  }
                  data-text="true"
                >
                  {
                    "Membangun Engine WebGIS Skala Wilayah: Mengolah 50.000 Poligon Batas Afdeling dengan PostGIS dan Leaflet"
                  }
                </div>
                <div
                  className={
                    "text-[13px]/[20px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Bagaimana kami mengoptimalkan query spasial ST_Intersects dan ST_SimplifyPreserveTopology agar rendering peta perkebunan sawit berjalan 60fps tanpa memory leak di browser klien."
                  }
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] p-[4px_0px_0px_0px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"R"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Tim OpenByte Labs • Engineering"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8"
            }
          >
            <div
              className={
                "box-border w-full h-fit grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
              }
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Article Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"KEAMANAN SIBER"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"• 6 min baca"}
                  </div>
                </div>
                <div
                  className={
                    "text-[15px]/[20px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left"
                  }
                  data-text="true"
                >
                  {
                    "Pencegahan Kerentanan XSS & CSRF pada Next.js 14 Server Actions"
                  }
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Panduan praktis validasi skema Zod pada level edge runtime dan penggunaan HttpOnly Secure Cookie untuk token sesi admin."
                  }
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Penulis: Tim OpenByte Labs"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Baca"}
                    </div>
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"arrow_forward"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Article Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"ARSITEKTUR SISTEM"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"• 5 min baca"}
                  </div>
                </div>
                <div
                  className={
                    "text-[15px]/[20px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left"
                  }
                  data-text="true"
                >
                  {
                    "Immutable Audit Log: Verifikasi Hash SHA-256 pada Tracking Proyek"
                  }
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Mekanisme rantai kriptografi sederhana untuk menjamin setiap mutasi dokumen BAST tidak dapat dimanipulasi tanpa terdeteksi."
                  }
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Penulis: M. Izzat"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Baca"}
                    </div>
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"arrow_forward"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Article Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                    }
                  >
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"DEVOPS & CLOUD"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"• 7 min baca"}
                  </div>
                </div>
                <div
                  className={
                    "text-[15px]/[20px] box-border w-full text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left"
                  }
                  data-text="true"
                >
                  {
                    "Pangkas Biaya Cloud 70% dengan Docker Swarm & Cloudflare R2"
                  }
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Studi perbandingan arsitektur VM mandiri vs managed cloud k8s untuk beban sistem korporasi 500 pengguna bersamaan."
                  }
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                  }
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"Penulis: Annisa R."}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-text="true"
                    >
                      {"Baca"}
                    </div>
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"arrow_forward"}
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
