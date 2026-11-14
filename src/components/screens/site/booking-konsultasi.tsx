// Ported from prototype/stitch/site/booking-konsultasi.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
import { ContactForm } from "@/components/public/ContactForm";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import {
  BookingProvider,
  BookingCalendar,
  BookingSlots,
  BookingValue,
} from "@/components/public/Booking";
export default async function SiteBookingKonsultasi() {
  let settings;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    settings = undefined;
  }
  return (
    <ScreenState screen={"site/booking-konsultasi"}>
      <BookingProvider initialNow={new Date().toISOString()}>
        <div
          className={
            "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen has-editorial-hero"
          }
          data-pencil-name={"Public / 06 - Booking Konsultasi"}
          data-screen={"site/booking-konsultasi"}
          id="konten"
          tabIndex={-1}
        >
          <PublicHeader settings={settings} />
          <main
            className={
              "box-border w-full flex-1 flex flex-col gap-0 pt-[104px] lg:pt-[68px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
            }
            data-pencil-name={"main"}
          >
            {/* Architectural Header Band */}
            <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
              <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
                <div className="max-w-3xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
                    <span className="h-2 w-2 rounded-full bg-[#82b440]" />
                    <span>Penjadwalan Konsultasi Teknis · WIB (UTC+7)</span>
                  </div>
                  <h1
                    className="text-[32px]/[1.14] sm:text-[42px]/[1.1] lg:text-[48px]/[1.08] text-[#18181a] font-semibold tracking-[-0.03em] m-0"
                    data-heading="true"
                  >
                    Jadwalkan Sesi Konsultasi Teknis
                  </h1>
                  <p className="text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#52525b] font-normal m-0 max-w-2xl">
                    Diskusikan kebutuhan arsitektur sistem, kelayakan teknologi, dan ruang lingkup pengerjaan proyek bersama tim engineer kami.
                  </p>
                </div>

                {/* Honest Operational Schedule Ledger */}
                <dl className="m-0 grid grid-cols-2 gap-px bg-[#eaeaea] border border-[#eaeaea] rounded-[12px] overflow-hidden shrink-0 w-full sm:w-auto">
                  <div className="bg-white px-5 py-3.5 flex flex-col gap-0.5">
                    <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#52525b]">
                      Hari Operasional
                    </dt>
                    <dd className="m-0 text-[15px] font-semibold text-[#18181a]">
                      Senin s.d. Jumat
                    </dd>
                  </div>
                  <div className="bg-white px-5 py-3.5 flex flex-col gap-0.5">
                    <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#52525b]">
                      Durasi Sesi
                    </dt>
                    <dd className="m-0 text-[15px] font-semibold text-[#454a10] tabular-nums">
                      60 Menit · WIB
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <div
              className={
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-[32px] px-4 sm:px-6 lg:px-8 pt-8 justify-start items-stretch"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative"
                }
                data-pencil-name={"booking-grid"}
              >
                <div
                  className={
                    "box-border w-full lg:col-span-5 h-fit flex flex-col gap-[20px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <BookingCalendar
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-4 sm:p-[20px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  />
                  <BookingSlots
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-[12px] p-4 sm:p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  />
                </div>
                <div
                  className={
                    "box-border w-full lg:col-span-7 h-fit flex flex-col gap-[20px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-6 sm:p-7 justify-start items-start bg-[#18181a] border border-[#2e2e32] rounded-[16px] overflow-hidden relative shadow-[0px_4px_16px_#0000001a]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[176px] h-[176px] [filter:blur(20px)] absolute right-[-20px] top-[-32px] bg-[#e1e89c1a] rounded-[50%] [z-index:0]"
                      }
                      data-pencil-name={"div"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 justify-between items-center relative [z-index:1]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[10px] shrink-0 h-[10px] bg-[#e2e89d] rounded-[50%]"
                          }
                          data-pencil-name={"span"}
                        ></div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"RESERVASI RESMI TERPUSAT"}
                          data-text="true"
                        >
                          {"RESERVASI RESMI TERPUSAT"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[4px]"
                        }
                        data-pencil-name={"PRD v1.1 Encrypted"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"PRD v1.1 Encrypted"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 grid grid-cols-1 min-[420px]:grid-cols-3 gap-[12px] pt-[9px] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#2e2e32] relative [z-index:2]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"TANGGAL SESI"}
                          data-text="true"
                        >
                          {"TANGGAL SESI"}
                        </div>
                        <BookingValue
                          kind={"date"}
                          className={
                            "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left"
                          }
                          data-pencil-name={"18 Mei 2026"}
                          data-text="true"
                        />
                      </div>
                      <div
                        className={
                          "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"JAM WIB"}
                          data-text="true"
                        >
                          {"JAM WIB"}
                        </div>
                        <BookingValue
                          kind={"time"}
                          className={
                            "text-[16px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left"
                          }
                          data-pencil-name={"09:00 - 11:00 WIB"}
                          data-text="true"
                        />
                      </div>
                      <div
                        className={
                          "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={"MEDIA"}
                          data-text="true"
                        >
                          {"MEDIA"}
                        </div>
                        <BookingValue
                          kind={"mode"}
                          className={
                            "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left"
                          }
                          data-pencil-name={"Google Meet"}
                          data-text="true"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-6 sm:p-8 justify-start items-start bg-[#ffffff] border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_3px_#0000000d]"
                    }
                    data-pencil-name={"div"}
                  >
                    <ContactForm
                      kind="booking"
                      consentText={settings?.legal.consentText}
                      className="w-full flex flex-col gap-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <PublicFooter settings={settings} />
        </div>
      </BookingProvider>
    </ScreenState>
  );
}
