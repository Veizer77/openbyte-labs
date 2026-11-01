// Ported from prototype/stitch/system/design-system-guidelines.html. Prototype remains read-only.
import { ScreenState } from "@/components/preview/Controls";
export default function SystemDesignSystemGuidelines() {
  return (
    <ScreenState screen={"system/design-system-guidelines"}>
      <div
        className={
          "box-border w-[2400px] h-[420px] flex flex-col gap-[20px] p-[36px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#EAEAEA] [outline-offset:-0.5px] rounded-[24px] overflow-hidden screen public-screen mobile-auto-height"
        }
        data-pencil-name={"System / 00 - UI/UX Design System Guidelines"}
        data-screen={"system/design-system-guidelines"}
        id="konten"
        tabIndex={-1}
        data-responsive="fixed"
        data-section-padding="true"
      >
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          }
          data-pencil-name={"Top Row"}
          data-responsive="row"
        >
          <div
            className={
              "box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
            }
            data-pencil-name={"Title Col"}
          >
            <div
              className={
                "text-[22px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"Section Title"}
              data-text="true"
            >
              {"Prinsip & Standar Implementasi UI/UX (MoveIQ Framework)"}
            </div>
            <div
              className={
                "text-[13px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
              }
              data-pencil-name={"Section Subtitle"}
              data-text="true"
            >
              {
                "Audit integrasi UX Intuitif, Alur Seamless, Aksesibilitas WCAG AA, Hierarki Visual Tegas, dan Optimasi Rasio Konversi Bisnis."
              }
            </div>
          </div>
          <div
            className={
              "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[6px_14px] justify-start items-center bg-[#E2E89D] rounded-[9999px]"
            }
            data-pencil-name={"Audit Tag"}
          >
            <div
              className={
                "box-border w-[6px] shrink-0 h-[6px] bg-[#1B1D00] rounded-[50%]"
              }
              data-pencil-name={"Tag Dot"}
            ></div>
            <div
              className={
                "text-[11px]/[normal] box-border text-[#1B1D00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"Tag Label"}
              data-text="true"
            >
              {"AUDITED & COMPLIANT v1.1"}
            </div>
          </div>
        </div>
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start"
          }
          data-pencil-name={"Cards Row"}
          data-responsive="row"
          data-section-padding="true"
        >
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#F0F0F0] rounded-[16px]"
            }
            data-pencil-name={"Pillar 1 UX"}
            data-section-padding="true"
          >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
              }
              data-pencil-name={"Header"}
            >
              <div
                className={
                  "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[10px]"
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
                  {"psychology"}
                </div>
              </div>
              <div
                className={
                  "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Pillar Title"}
                data-text="true"
              >
                {"1. Pengalaman Pengguna (UX)"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Usability Intuitif"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Usability Intuitif"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Pola interaksi familier tanpa manual book (bento card, standard table, segmented nav)."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Seamless User Flow"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Seamless User Flow"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Alur konversi ringkas (Kalkulator -> Preview Biaya -> WhatsApp Order 1-klik)."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Solutif Nyata"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Solutif Nyata"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Contoh manfaat hanya ditampilkan setelah bukti dan persetujuan pemilik diverifikasi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Aksesibilitas (WCAG AA)"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Aksesibilitas (WCAG AA)"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Kontras teks ditingkatkan ke >= 4.8:1, font label minimal 12-14px, focus state tegas."
                }
              </div>
            </div>
          </div>
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#18181A] rounded-[16px]"
            }
            data-pencil-name={"Pillar 2 UI"}
            data-section-padding="true"
          >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
              }
              data-pencil-name={"Header"}
            >
              <div
                className={
                  "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[10px]"
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
                  {"palette"}
                </div>
              </div>
              <div
                className={
                  "text-[15px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Pillar Title"}
                data-text="true"
              >
                {"2. Tampilan Visual (UI)"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Konsistensi Design System"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Konsistensi Design System"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Palet MoveIQ terpadu (#FFFFFF canvas, #18181A obsidian, #D2D88F lime, Inter font)."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Hierarki Visual Tegas"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Hierarki Visual Tegas"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "CTA primer kontras hitam/lime pekat, tombol sekunder outline/subtle bernapas."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Dual-Surface Modern"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Dual-Surface Modern"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Kanvas putih terang dipadukan kontainer analitik gelap (Obsidian Capsule) berelevasi tinggi."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Responsif & Terstruktur"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Responsif & Terstruktur"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#A8A8AD] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Sistem grid 12-kolom asimetris, perataan flexbox konsisten, zero broken layout."
                }
              </div>
            </div>
          </div>
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#F0F0F0] rounded-[16px]"
            }
            data-pencil-name={"Pillar 3 Business"}
            data-section-padding="true"
          >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
              }
              data-pencil-name={"Header"}
            >
              <div
                className={
                  "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[10px]"
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
                  {"monitoring"}
                </div>
              </div>
              <div
                className={
                  "text-[15px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Pillar Title"}
                data-text="true"
              >
                {"3. Indikator Data & Bisnis"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Rasio Konversi Tinggi"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Rasio Konversi Tinggi"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "WhatsApp Direct Router terpasang di setiap tier harga dan kalkulator interaktif."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Trust & Retensi Klien"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Trust & Retensi Klien"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Ketentuan garansi, serah terima, dan tingkat layanan hanya dicantumkan setelah disepakati tertulis."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Minim Human Error"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Minim Human Error"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Validasi input dan aturan konsistensi ditentukan sesuai kebutuhan yang telah ditinjau."
                }
              </div>
            </div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              }
              data-pencil-name={"Kepatuhan UU PDP No. 27"}
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Title"}
                data-text="true"
              >
                {"• Kepatuhan UU PDP No. 27"}
              </div>
              <div
                className={
                  "text-[11px]/[15px] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Item Desc"}
                data-text="true"
              >
                {
                  "Sesi PIN 120 menit, auto-lockout 5x gagal, audit trail log tersimpan aman."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenState>
  );
}
