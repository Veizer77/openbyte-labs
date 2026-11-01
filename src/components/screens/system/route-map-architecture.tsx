// Ported from prototype/stitch/system/route-map-architecture.html. Prototype remains read-only.
import { ScreenState } from "@/components/preview/Controls";
export default function SystemRouteMapArchitecture() {
  return (
    <ScreenState screen={"system/route-map-architecture"}>
      <div
        className={
          "box-border w-[2400px] h-[420px] flex flex-col gap-[16px] p-[32px] justify-start items-start bg-[#18181A] rounded-[24px] overflow-hidden screen public-screen mobile-auto-height"
        }
        data-pencil-name={"System / 00 - Route Map & URL Architecture"}
        data-screen={"system/route-map-architecture"}
        id="konten"
        tabIndex={-1}
        data-responsive="fixed"
      >
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          }
          data-responsive="row"
        >
          <div
            className={
              "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
            }
            data-responsive="row"
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[6px_14px] justify-start items-center bg-[#242427] rounded-[9999px]"
              }
            >
              <div
                className={
                  "box-border w-[8px] shrink-0 h-[8px] bg-[#82B440] rounded-[50%]"
                }
              ></div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.5px] text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"PRODUCTION URL ROUTE SPECIFICATION (NEXT.JS 14 & FILAMENT)"}
              </div>
            </div>
            <div
              className={
                "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {
                "Pemetaan Lengkap Rute URL & Hak Akses Seluruh Layar (32 Screen)"
              }
            </div>
          </div>
          <div
            className={
              "text-[12px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
            }
            data-text="true"
          >
            {"Status: 100% Fully Mapped"}
          </div>
        </div>
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
          }
          data-responsive="row"
        >
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#242427] rounded-[16px]"
            }
            data-pencil-name={"Public Core Routes"}
          >
            <div
              className={
                "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"PUBLIC WEB ENGINE (NEXT.JS 14)"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Beranda"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/layanan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Paket Layanan & Harga"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/layanan/[slug]"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Detail Layanan Tunggal"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/portofolio"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Daftar Portofolio"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/portofolio/[slug]"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Detail Studi Kasus"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/kalkulator"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Estimasi Biaya Modular"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/booking"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Reservasi Konsultasi"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/tentang-kami"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Metodologi & Profil Tim"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/blog"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Wawasan & Catatan Arsitektur"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/ketentuan-layanan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Legalitas, NDA & SLA"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/404"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Fallback & Route Invalid"}
              </div>
            </div>
          </div>
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#242427] rounded-[16px]"
            }
            data-pencil-name={"Client Portal Routes"}
          >
            <div
              className={
                "text-[11px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"PORTAL KLIEN (TOKEN PROTECTED)"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/tracking"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Input Token & Otentikasi Tracking"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/tracking/[token]"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Live Pelacakan Proyek Klien"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/tracking/[token]/bast"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Verifikasi BAST Digital SHA-256"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/tracking/[token]/invoice"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Detail Termin & QRIS/VA Pay"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/api/tracking/verify"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Endpoint Validasi Token Kripto"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/api/kalkulator/quote"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Endpoint Submit Simulasi Biaya"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/api/booking/slot"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"Endpoint Cek Slot Konsultasi"}
              </div>
            </div>
          </div>
          <div
            className={
              "box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[18px] justify-start items-start bg-[#242427] rounded-[16px]"
            }
            data-pencil-name={"Admin CMS Routes"}
          >
            <div
              className={
                "text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-text="true"
            >
              {"ADMIN CMS ENGINE (FILAMENT & 2FA)"}
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/login"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 00 - Login & OTP 2FA"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/dashboard"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 01 - Dashboard Admin"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/proyek"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 02 - Proyek Klien & Tracking"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/showcase"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 03 - Proyek Portofolio"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/booking"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 04 - Booking Konsultasi"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/settings"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 05 - Site Settings"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/layanan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 06 - Layanan Bento"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/inquiry"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 07 - Inquiry & Pemesanan"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/quotes"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 08 - Quote Kalkulator"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/paket"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 09 - Paket & Add-on"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/invoice"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 14 - Invoice & Termin BAST"}
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              }
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"/admin/staf"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-text="true"
              >
                {"CMS 15 - Staf & Role RBAC"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenState>
  );
}
