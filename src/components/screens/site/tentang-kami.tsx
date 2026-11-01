// Ported from prototype/stitch/site/tentang-kami.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { UiAction, ScreenState } from "@/components/preview/Controls";
export default function SiteTentangKami() {
  return (
    <ScreenState screen={"site/tentang-kami"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 10 - Tentang Kami & Metodologi"}
        data-screen={"site/tentang-kami"}
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
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-[18px] justify-start items-start"
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
                {"PROFIL STUDIO & PRINSIP REKAYASA"}
              </div>
            </div>
            <div
              className={
                "text-[42px]/[48px] box-border w-full text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-1px] text-left"
              }
              data-pencil-name={"Title"}
              data-text="true"
            >
              {"Rekayasa Perangkat Lunak Presisi Tinggi untuk Sektor Strategis"}
            </div>
            <div
              className={
                "text-[15px]/[24px] box-border w-full text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
              }
              data-pencil-name={"Desc"}
              data-text="true"
            >
              {
                "OpenByte Labs mengerjakan website, aplikasi, dan sistem informasi. Bentuk solusi, teknologi, jadwal, dan biaya ditentukan berdasarkan kebutuhan serta ruang lingkup setiap proyek."
              }
            </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-[20px] justify-start items-start"
            }
            data-pencil-name={"Principles Section"}
          >
            <div
              className={
                "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.6px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"4 PRINSIP FUNDAMENTAL KAMI"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              }
              data-pencil-name={"Principles Grid"}
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Principle Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"architecture"}
                </div>
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Arsitektur Modular"}
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Rancangan teknis dibahas berdasarkan kebutuhan, batasan, dan ruang lingkup setiap proyek."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Principle Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Security by Design"}
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Praktik keamanan ditentukan dan diverifikasi sesuai ruang lingkup proyek; halaman ini tidak menyatakan sertifikasi atau kontrol tertentu."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Principle Card"}
                data-section-padding="true"
              >
                <UiAction
                  label={"visibility"}
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"visibility"}
                </UiAction>
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tracking Transparan"}
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Fitur pelaporan progres dan akses klien dibahas per proyek dan belum dinyatakan tersedia secara umum."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Principle Card"}
                data-section-padding="true"
              >
                <div
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-text="true"
                  aria-hidden="true"
                >
                  {"handshake"}
                </div>
                <div
                  className={
                    "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Ketentuan per proyek"}
                </div>
                <div
                  className={
                    "text-[12px]/[18px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Cakupan dukungan, garansi, dan masa pemeliharaan hanya berlaku bila disepakati tertulis."
                  }
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-[20px] justify-start items-start"
            }
            data-pencil-name={"Methodology Section"}
          >
            <div
              className={
                "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.6px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"ALUR KERJA & METODOLOGI REKAYASA"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              }
              data-pencil-name={"Pipeline Row"}
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Step Box"}
              >
                <div
                  className={
                    "text-[24px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-black text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"01"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Blueprint & Arsitektur"}
                </div>
                <div
                  className={
                    "text-[12px]/[17px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Kebutuhan dan dokumen teknis disepakati sesuai ruang lingkup proyek."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Step Box"}
              >
                <div
                  className={
                    "text-[24px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-black text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"02"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tahapan sesuai proyek"}
                </div>
                <div
                  className={
                    "text-[12px]/[17px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Jadwal peninjauan dan lingkungan uji ditetapkan untuk setiap proyek."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Step Box"}
              >
                <div
                  className={
                    "text-[24px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-black text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"03"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Pengujian sesuai ruang lingkup"}
                </div>
                <div
                  className={
                    "text-[12px]/[17px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Jenis pengujian dan kriteria penerimaan belum ditetapkan pada halaman contoh ini."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
                }
                data-pencil-name={"Step Box"}
              >
                <div
                  className={
                    "text-[24px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-black text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"04"}
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Serah terima & dukungan"}
                </div>
                <div
                  className={
                    "text-[12px]/[17px] box-border w-full text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {
                    "Hasil kerja, hak penggunaan, serah terima, dan dukungan mengikuti dokumen proyek yang disetujui."
                  }
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-[20px] justify-start items-start"
            }
            data-pencil-name={"Team Section"}
          >
            <div
              className={
                "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.6px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"TIM INTI REKAYASA"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              }
              data-pencil-name={"Team Grid"}
            >
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Team Card"}
              >
                <div
                  className={
                    "box-border w-[44px] h-[44px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"M"}
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tim Contoh 1"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Peran belum diverifikasi"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Profil dan pengalaman belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Team Card"}
              >
                <div
                  className={
                    "box-border w-[44px] h-[44px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"R"}
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tim Engineering"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Peran belum diverifikasi"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Profil dan pengalaman belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Team Card"}
              >
                <div
                  className={
                    "box-border w-[44px] h-[44px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"F"}
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tim Security"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Peran belum diverifikasi"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Profil dan pengalaman belum diverifikasi"}
                </div>
              </div>
              <div
                className={
                  "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#F9F9FB] rounded-[12px]"
                }
                data-pencil-name={"Team Card"}
              >
                <div
                  className={
                    "box-border w-[44px] h-[44px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[9999px]"
                  }
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-text="true"
                  >
                    {"A"}
                  </div>
                </div>
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Tim Contoh 2"}
                </div>
                <div
                  className={
                    "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-text="true"
                >
                  {"Peran belum diverifikasi"}
                </div>
                <div
                  className={
                    "text-[11px]/[15px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-text="true"
                >
                  {"Profil dan pengalaman belum diverifikasi"}
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
