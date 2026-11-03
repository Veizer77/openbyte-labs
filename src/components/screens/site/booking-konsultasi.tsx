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
            "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
          }
          data-pencil-name={"Public / 06 - Booking Konsultasi"}
          data-screen={"site/booking-konsultasi"}
          id="konten"
          tabIndex={-1}
        >
          <PublicHeader settings={settings} />
          <main
            className={
              "box-border w-full flex-1 flex flex-col gap-0 pt-[72px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
            }
            data-pencil-name={"main"}
          >
            <div
              className={
                "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-[32px] px-4 sm:px-6 lg:px-8 justify-start items-stretch"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-[188.38px] shrink-0 h-[22px] flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                    }
                    data-pencil-name={"span"}
                    data-responsive="fixed"
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] opacity-[0.73] bg-[#82b440] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"PRD 8.3 Guaranteed SLA"}
                      data-text="true"
                    >
                      {"PRD 8.3 Guaranteed SLA"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[201.53px] shrink-0 h-[22px] flex flex-row gap-[4px] p-[4px_10px] justify-start items-center bg-[#e1e89c80] rounded-[9999px]"
                    }
                    data-pencil-name={"span"}
                    data-responsive="fixed"
                  >
                    <div
                      className={
                        "text-[13px]/[13px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"bolt"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"bolt"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Real-time Sync (WIB / UTC+7)"}
                      data-text="true"
                    >
                      {"Real-time Sync (WIB / UTC+7)"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-between items-end"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-[768px] shrink-0 h-fit flex flex-col gap-[8px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="fixed"
                  >
                    <h1
                      className={
                        "text-[28px]/[35px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                      }
                      data-pencil-name={"Jadwalkan Sesi Konsultasi Teknis"}
                      data-text="true"
                      data-heading="true"
                    >
                      {"Jadwalkan Sesi Konsultasi Teknis"}
                    </h1>
                    <div
                      className={
                        "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Diskusikan arsitektur sistem, kelayakan teknologi, dan roadmap digital Anda bersama Senior System Specialist."
                      }
                      data-text="true"
                    >
                      {
                        "Diskusikan arsitektur sistem, kelayakan teknologi, dan roadmap digital Anda bersama Senior System Specialist."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[8px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[85.45px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[10px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"SLOT AKTIF"}
                        data-text="true"
                      >
                        {"SLOT AKTIF"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                        }
                      >
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"16"}
                          data-text="true"
                        >
                          {"16"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[70px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[10px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center"
                        }
                        data-pencil-name={"TERISI"}
                        data-text="true"
                      >
                        {"TERISI"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                        }
                      >
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"4"}
                          data-text="true"
                        >
                          {"4"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[80.19px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[10px] justify-start items-start bg-[#ffffff] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                        }
                        data-pencil-name={"RESPONSE"}
                        data-text="true"
                      >
                        {"RESPONSE"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
                        }
                      >
                        <div
                          className={
                            "text-[16px]/[20px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"< 1 Jam"}
                          data-text="true"
                        >
                          {"< 1 Jam"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  data-section-padding="true"
                >
                  <BookingCalendar
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  />
                  <BookingSlots
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  />
                </div>
                <div
                  className={
                    "box-border w-full lg:col-span-7 h-fit flex flex-col gap-[20px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-[8px] p-[20px] justify-start items-start bg-[#18181a] rounded-[16px] overflow-hidden relative"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-[176px] h-[176px] [filter:blur(20px)] absolute right-[-20px] top-[-32px] bg-[#e1e89c1a] rounded-[50%] [z-index:0]"
                      }
                      data-pencil-name={"div"}
                    ></div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center relative [z-index:1]"
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
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[9px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#2e2e32] relative [z-index:2]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[35px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"TANGGAL SESI"}
                          data-text="true"
                        >
                          {"TANGGAL SESI"}
                        </div>
                        <BookingValue
                          kind={"date"}
                          className={
                            "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"18 Mei 2026"}
                          data-text="true"
                        />
                      </div>
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[35px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"JAM WIB"}
                          data-text="true"
                        >
                          {"JAM WIB"}
                        </div>
                        <BookingValue
                          kind={"time"}
                          className={
                            "text-[16px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"09:00 - 11:00 WIB"}
                          data-text="true"
                        />
                      </div>
                      <div
                        className={
                          "box-border [flex:1_1_0] h-[35px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"MEDIA"}
                          data-text="true"
                        >
                          {"MEDIA"}
                        </div>
                        <BookingValue
                          kind={"mode"}
                          className={
                            "text-[16px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Google Meet"}
                          data-text="true"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-0 p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                    }
                    data-pencil-name={"div"}
                    data-section-padding="true"
                  >
                    <ContactForm
                      kind="booking"
                      consentText={settings?.legal.consentText}
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                      }
                      data-pencil-name={"form"}
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
