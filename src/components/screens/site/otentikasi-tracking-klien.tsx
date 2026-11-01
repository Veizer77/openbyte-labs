// Ported from prototype/stitch/site/otentikasi-tracking-klien.html. Prototype remains read-only.
import Link from "next/link";
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { UiAction, ScreenState } from "@/components/preview/Controls";
export default function SiteOtentikasiTrackingKlien() {
  return (
    <ScreenState screen={"site/otentikasi-tracking-klien"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-center items-center bg-[#ffffff] px-4 py-12 relative screen public-screen"
        }
        data-pencil-name={"Public / 08 - Otentikasi Tracking Klien"}
        data-screen={"site/otentikasi-tracking-klien"}
        id="konten"
        tabIndex={-1}
      >
        <div
          className={
            "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-center items-center"
          }
          data-pencil-name={"div"}
        >
          <div
            className={
              "box-border w-full max-w-[540px] h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
            }
            data-pencil-name={"div"}
            data-responsive="fixed"
          >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-[6px] shrink-0 h-[6px] opacity-[0.73] bg-[#82b440] rounded-[50%]"
                }
                data-pencil-name={"span"}
              ></div>
              <div
                className={
                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                }
                data-pencil-name={"SYSTEM OPERATIONAL • PROTOKOL v1.1 PDP A"}
                data-text="true"
              >
                {"SYSTEM OPERATIONAL • PROTOKOL v1.1 PDP AKTIF"}
              </div>
            </div>
            <div
              className={"box-border w-full h-[16px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-[32px] p-[40px] justify-start items-start bg-[#ffffff] rounded-[20px] overflow-hidden relative"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-[540px] h-[4px] absolute left-0 top-0 [background-image:linear-gradient(90deg,_#000000_0%,_#e2e89d_50%,_#000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:0]"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
              ></div>
              <div
                className={
                  "box-border w-full h-[198px] shrink-0 flex flex-col gap-0 justify-start items-center relative [z-index:1]"
                }
                data-pencil-name={"div"}
                data-responsive="flow"
              >
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 p-[8px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                >
                  <ReferenceImage
                    src={"/images/5f9e6a2ac345b8dc.png"}
                    alt={"OpenByte Labs"}
                    contain={true}
                    className={
                      "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d]  bg-no-repeat bg-contain bg-center rounded-[8px]"
                    }
                    data-pencil-name={"img"}
                  />
                </div>
                <div
                  className={"box-border w-full h-[24px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"OPENBYTE LABS PORTAL"}
                    data-text="true"
                  >
                    {"OPENBYTE LABS PORTAL"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"•"}
                    data-text="true"
                  >
                    {"•"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"SESI KLIEN AMAN"}
                    data-text="true"
                  >
                    {"SESI KLIEN AMAN"}
                  </div>
                </div>
                <div
                  className={"box-border w-full h-[8px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <h1
                  className={
                    "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-center [white-space:nowrap] m-0"
                  }
                  data-pencil-name={"Portal Pelacakan Proyek Klien"}
                  data-text="true"
                  data-heading="true"
                >
                  {"Portal Pelacakan Proyek Klien"}
                </h1>
                <div
                  className={"box-border w-full h-[12px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[14px]/[20px] box-border w-[420px] h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-center"
                  }
                  data-pencil-name={"Akses transparansi progres sprint, miles"}
                  data-text="true"
                  data-responsive="fixed"
                >
                  {
                    "Akses transparansi progres sprint, milestone pengujian, dokumen, dan persetujuan revisi tanpa perlu membuat akun."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start relative [z-index:2]"
                }
                data-pencil-name={"form"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"KODE TRACKING PROYEK"}
                      data-text="true"
                    >
                      {"KODE TRACKING PROYEK"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Format: PRJ-XXXXXXXX"}
                      data-text="true"
                    >
                      {"Format: PRJ-XXXXXXXX"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-center relative"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border absolute left-[14px] top-[13px] text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                      }
                      data-pencil-name={"tag"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"tag"}
                    </div>
                    <div
                      className={
                        "box-border w-[460px] shrink-0 h-[44px] flex flex-col gap-0 p-[12px_16px_12px_40px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden relative [z-index:1]"
                      }
                      data-pencil-name={"Kode tracking tidak dimuat"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.8px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Kode tracking tidak dimuat"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={"box-border w-full h-[20px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"PIN AKSES KEAMANAN"}
                      data-text="true"
                    >
                      {"PIN AKSES KEAMANAN"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"6 Digit Rahasia"}
                      data-text="true"
                    >
                      {"6 Digit Rahasia"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-center relative"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border absolute left-[14px] top-[13px] text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                      }
                      data-pencil-name={"encrypted"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"encrypted"}
                    </div>
                    <div
                      className={
                        "box-border w-[460px] shrink-0 h-[44px] flex flex-col gap-0 p-[12px_48px_12px_40px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden relative [z-index:1]"
                      }
                      data-pencil-name={"••••••"}
                      data-responsive="fixed"
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[5.6px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"••••••"}
                      </div>
                    </div>
                    <UiAction
                      label={"visibility"}
                      className={
                        "box-border w-fit h-fit absolute left-[422px] top-[6.5px] flex flex-col gap-0 p-[4px] justify-start items-start rounded-[6px] [z-index:2]"
                      }
                      data-pencil-name={"button"}
                    >
                      <div
                        className={
                          "text-[18px]/[18px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"visibility"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"visibility"}
                      </div>
                    </UiAction>
                  </div>
                </div>
                <div
                  className={"box-border w-full h-[24px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "box-border w-full h-[61px] shrink-0 bg-[#f0f0f0] rounded-[12px] relative"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "box-border w-[24px] h-[24px] [box-shadow:0px_1px_2px_#0000000d] absolute left-[14px] top-[16px] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[6px] [z-index:0]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[15px]/[15px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"security"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"security"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[12px]/[17px] box-border w-[396px] h-[33px] absolute left-[50px] top-[14px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [z-index:1]"
                    }
                    data-pencil-name={
                      "Dilindungi sistem keamanan lockout 5 kal"
                    }
                    data-text="true"
                    data-responsive="fixed"
                  >
                    {
                      "Dilindungi sistem keamanan lockout 5 kali percobaan gagal dan sesi terenkripsi 120 menit sesuai regulasi UU PDP."
                    }
                  </div>
                </div>
                <div
                  className={"box-border w-full h-[28px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <UiAction
                  label={"Verifikasi & Buka Dasbor Proyek"}
                  className={
                    "box-border w-full h-[46px] shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[10px] p-[14px_24px] justify-center items-center bg-[#18181a] rounded-[12px]"
                  }
                  data-pencil-name={"button"}
                >
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"Verifikasi & Buka Dasbor Proyek"}
                    data-text="true"
                  >
                    {"Verifikasi & Buka Dasbor Proyek"}
                  </div>
                  <div
                    className={
                      "text-[18px]/[18px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"arrow_forward"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"arrow_forward"}
                  </div>
                </UiAction>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[24px_0px_0px_0px] justify-start items-start relative [z-index:3]"
                }
                data-pencil-name={"div"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[12px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum menerima PIN akses proyek?"}
                    data-text="true"
                  >
                    {"Belum menerima PIN akses proyek?"}
                  </div>
                  <Link
                    href={"/konsultasi"}
                    className={
                      "box-border w-fit h-[18px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"a"}
                  >
                    <div
                      className={
                        "text-[16px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"chat"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"chat"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-center [white-space:nowrap]"
                      }
                      data-pencil-name={
                        "Kontak pengelola belum dikonfigurasi"
                      }
                      data-text="true"
                    >
                      {
                        "Kontak pengelola belum dikonfigurasi. Gunakan formulir konsultasi."
                      }
                    </div>
                  </Link>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] p-[0px_4px] justify-between items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[14px] flex flex-row gap-[6px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[14px]/[14px] box-border text-[#595962] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"lock"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"lock"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Status keamanan belum diverifikasi"}
                      data-text="true"
                    >
                      {"Status keamanan belum diverifikasi"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Status server belum tersedia"}
                    data-text="true"
                  >
                    {"Status server belum tersedia"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={"box-border w-full h-[24px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-center items-center"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                }
                data-pencil-name={"MoveIQ Architecture Platform"}
                data-text="true"
              >
                {"MoveIQ Architecture Platform"}
              </div>
              <div
                className={
                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                }
                data-pencil-name={"•"}
                data-text="true"
              >
                {"•"}
              </div>
              <div
                className={
                  "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                }
                data-pencil-name={"OpenByte Labs"}
                data-text="true"
              >
                {"OpenByte Labs"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenState>
  );
}
