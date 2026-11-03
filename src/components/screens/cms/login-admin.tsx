"use client";

// Ported from prototype/stitch/cms/login-admin.html. Prototype remains read-only.
import Link from "next/link";
import { ScreenState } from "@/components/preview/Controls";
import { LoginForm } from "@/components/admin/LoginForm";

export default function CmsLoginAdmin({ quickLogin = false }: { quickLogin?: boolean }) {
  return (
    <ScreenState screen={"cms/login-admin"}>
      <div
        data-pencil-name="CMS / 00 - Login Admin"
        data-screen="cms/login-admin"
        id="konten"
        tabIndex={-1}
        className="box-border w-full min-h-screen flex flex-col lg:flex-row gap-0 justify-start items-stretch screen admin-screen login-screen"
      >
        {/* Brand & Architecture Showcase (Left Column) */}
        <div
          data-pencil-name="Brand & Architecture Showcase"
          className="box-border w-full lg:w-[560px] shrink-0 min-h-0 lg:min-h-screen flex flex-col gap-8 lg:gap-0 p-8 sm:p-10 lg:p-12 xl:p-[56px] justify-between items-start bg-[#18181A]"
        >
          {/* Showcase Top Content */}
          <div
            data-pencil-name="Showcase Top Content"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-6 lg:gap-[32px] justify-start items-start"
          >
            {/* Brand & Badge Header */}
            <div
              data-pencil-name="Brand & Badge Header"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] max-xl:gap-[10px] justify-start items-start"
            >
              {/* System Status Badge */}
              <div
                data-pencil-name="System Status Badge"
                className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[6px_14px] justify-start items-center bg-[#242427] rounded-[9999px]"
              >
                <div
                  data-pencil-name="Pulse Indicator"
                  className="box-border w-[8px] shrink-0 h-[8px] bg-[#82B440] rounded-[50%]"
                ></div>
                <div
                  data-pencil-name="Badge Label"
                  className="text-[11px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
                >
                  CMS PREVIEW • DATA CONTOH
                </div>
              </div>

              {/* Dark Brand Lockup */}
              <div
                data-pencil-name="Dark Brand Lockup"
                className="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
              >
                <div
                  data-pencil-name="Brand App Icon"
                  className="box-border w-[44px] shrink-0 h-[44px] bg-no-repeat bg-contain bg-center [outline:1px_solid_#333338] [outline-offset:-0.5px] rounded-[10px]"
                  style={{
                    backgroundImage: "url('/images/5f9e6a2ac345b8dc.png')",
                  }}
                ></div>
                <div
                  data-pencil-name="Brand Text Col"
                  className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Brand Name"
                    className="text-[18px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.2px] text-left [white-space:nowrap]"
                  >
                    OPENBYTE LABS
                  </div>
                  <div
                    data-pencil-name="Brand Subtitle"
                    className="text-[10px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[1px] text-left [white-space:nowrap]"
                  >
                    CMS • PREVIEW
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Copy */}
            <div
              data-pencil-name="Hero Copy"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] max-xl:gap-[8px] justify-start items-start"
            >
              <h1
                data-pencil-name="Hero Title"
                className="text-[28px]/[36px] lg:text-[32px]/[40px] box-border w-full text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.8px] text-left m-0"
              >
                Pratinjau Panel Admin OpenByte Labs
              </h1>
              <div
                data-pencil-name="Hero Subtitle"
                className="text-[14px]/[21px] max-xl:text-[13px]/[18px] box-border w-full text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
              >
                Pratinjau antarmuka panel admin. Data, autentikasi, izin, integrasi,
                dan kontrol privasi perlu dikonfigurasi serta diverifikasi.
              </div>
            </div>

            {/* Security Specs Card */}
            <div
              data-pencil-name="Security Specs Card"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] max-xl:gap-[10px] p-[20px] max-xl:p-[14px] justify-start items-start bg-[#242427] [outline:1px_solid_#333338] [outline-offset:-0.5px] rounded-[16px]"
            >
              {/* Security Card Header */}
              <div
                data-pencil-name="Security Card Header"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
              >
                <div
                  data-pencil-name="Security Title Row"
                  className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                >
                  <span
                    data-pencil-name="Security Icon"
                    className="text-[18px]/[normal] box-border text-[#D2D88F] symbol text-left [white-space:nowrap]"
                    aria-hidden="true"
                  >
                    verified_user
                  </span>
                  <div
                    data-pencil-name="Security Label"
                    className="text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  >
                    Konfigurasi keamanan • draf
                  </div>
                </div>
                <div
                  data-pencil-name="Security Tag"
                  className="text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                >
                  STATUS MFA BELUM DIVERIFIKASI
                </div>
              </div>

              {/* Spec - Autentikasi Dua Faktor (2FA) */}
              <div
                data-pencil-name="Spec - Autentikasi Dua Faktor (2FA)"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
              >
                <div
                  data-pencil-name="Icon Circle"
                  className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                >
                  <span
                    data-pencil-name="Item Icon"
                    className="text-[16px]/[normal] box-border text-[#D2D88F] symbol text-left [white-space:nowrap]"
                    aria-hidden="true"
                  >
                    vpn_key
                  </span>
                </div>
                <div
                  data-pencil-name="Text Col"
                  className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Item Title"
                    className="text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  >
                    Autentikasi Dua Faktor (2FA)
                  </div>
                  <div
                    data-pencil-name="Item Desc"
                    className="text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  >
                    Metode autentikasi belum diverifikasi
                  </div>
                </div>
              </div>

              {/* Spec - Role-Based Access Control */}
              <div
                data-pencil-name="Spec - Role-Based Access Control"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
              >
                <div
                  data-pencil-name="Icon Circle"
                  className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                >
                  <span
                    data-pencil-name="Item Icon"
                    className="text-[16px]/[normal] box-border text-[#D2D88F] symbol text-left [white-space:nowrap]"
                    aria-hidden="true"
                  >
                    fingerprint
                  </span>
                </div>
                <div
                  data-pencil-name="Text Col"
                  className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Item Title"
                    className="text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  >
                    Role-Based Access Control
                  </div>
                  <div
                    data-pencil-name="Item Desc"
                    className="text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  >
                    Role dan izin akses ditetapkan setelah ditinjau
                  </div>
                </div>
              </div>

              {/* Spec - Audit Trail Otomatis */}
              <div
                data-pencil-name="Spec - Audit Trail Otomatis"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
              >
                <div
                  data-pencil-name="Icon Circle"
                  className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[8px]"
                >
                  <span
                    data-pencil-name="Item Icon"
                    className="text-[16px]/[normal] box-border text-[#D2D88F] symbol text-left [white-space:nowrap]"
                    aria-hidden="true"
                  >
                    history_toggle_off
                  </span>
                </div>
                <div
                  data-pencil-name="Text Col"
                  className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Item Title"
                    className="text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  >
                    Audit Trail Otomatis
                  </div>
                  <div
                    data-pencil-name="Item Desc"
                    className="text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                  >
                    Draf tampilan; pencatatan aktivitas perlu diverifikasi
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Showcase Bottom Node Info */}
          <div
            data-pencil-name="Showcase Bottom Node Info"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[16px_0px_0px_0px] justify-between items-center"
          >
            <div
              data-pencil-name="Node Status"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
            >
              <div
                data-pencil-name="Green Ping"
                className="box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
              ></div>
              <div
                data-pencil-name="Node Text"
                className="text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
              >
                Status layanan belum diverifikasi
              </div>
            </div>
            <div
              data-pencil-name="Copyright Text"
              className="text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
            >
              OpenByte Labs • Pratinjau
            </div>
          </div>
        </div>

        {/* Form Surface Container (Right Column) */}
        <div
          data-pencil-name="Form Surface Container"
          className="box-border flex-1 w-full min-h-0 lg:min-h-screen flex flex-col gap-0 p-6 sm:p-8 lg:p-10 justify-center items-center bg-[#F9F9FA]"
        >
          <LoginForm quickLogin={quickLogin} />

          {/* Footer Navigation Row */}
          <Link
            href="/tracking"
            data-pencil-name="Footer Navigation Row"
            className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[16px_0px_0px_0px] justify-start items-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span
              data-pencil-name="Back Arrow"
              className="text-[16px]/[16px] box-border text-[#71717A] symbol text-left [white-space:nowrap]"
              aria-hidden="true"
            >
              arrow_back
            </span>
            <div
              data-pencil-name="Back to Public Portal Text"
              className="text-[12px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
            >
              Kembali ke Website Utama / Tracking Klien
            </div>
          </Link>
        </div>
      </div>
    </ScreenState>
  );
}
