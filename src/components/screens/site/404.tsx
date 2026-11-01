// Ported from prototype/stitch/site/404.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
export default function Site404() {
  return (
    <ScreenState screen={"site/404"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 13 - Halaman 404 & Token Invalid"}
        data-screen={"site/404"}
        id="konten"
        tabIndex={-1}
      >
        <main
          className={
            "box-border w-full flex-1 flex flex-col gap-[24px] pt-[120px] pb-16 px-4 justify-center items-center bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          <div
            className={
              "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[6px_14px] justify-start items-center bg-[#F4F4F5] rounded-[9999px]"
            }
          >
            <div
              className={
                "box-border w-[8px] shrink-0 h-[8px] bg-[#EF4444] rounded-[50%]"
              }
            ></div>
            <div
              className={
                "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"KODE HTTP 404 • ROUTE NOT FOUND"}
            </div>
          </div>
          <div
            className={
              "text-[84px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-black tracking-[-3px] text-left [white-space:nowrap]"
            }
            data-text="true"
          >
            {"404"}
          </div>
          <h1
            className={
              "text-[26px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[-0.5px] text-left [white-space:nowrap] m-0"
            }
            data-text="true"
            data-heading="true"
          >
            {"Halaman Tidak Ditemukan atau Sesi Kedaluwarsa"}
          </h1>
          <div
            className={
              "text-[14px]/[21px] box-border w-[580px] text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-center"
            }
            data-text="true"
            data-responsive="fixed"
          >
            {
              "URL modul yang Anda tuju mungkin telah diarsipkan, atau token tracking proyek klien Anda sudah tidak aktif demi perlindungan privasi data instansi."
            }
          </div>
          <div
            className={
              "box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] p-[12px_0px_0px_0px] justify-start items-center"
            }
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#18181A] rounded-[8px]"
              }
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"arrow_back"}
              </div>
              <div
                className={
                  "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Kembali ke Beranda"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[12px_20px] justify-start items-center bg-[#F4F4F5] rounded-[8px]"
              }
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"track_changes"}
              </div>
              <div
                className={
                  "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Portal Pelacakan Proyek"}
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full max-w-[580px] h-fit shrink-0 flex flex-row gap-0 p-[16px] justify-between items-center bg-[#F9F9FB] [outline:1px_solid_#E4E4E7] [outline-offset:-0.5px] rounded-[12px]"
            }
            data-responsive="fixed"
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
              }
            >
              <div
                className={
                  "text-[20px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-text="true"
                aria-hidden="true"
              >
                {"support_agent"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Butuh bantuan verifikasi token proyek Anda?"}
              </div>
            </div>
            <div
              className={
                "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"Hubungi Engineer →"}
            </div>
          </div>
        </main>
        <PublicFooter />
        <PublicHeader />
      </div>
    </ScreenState>
  );
}
