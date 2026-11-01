// Ported from prototype/stitch/site/portal-pelacakan-proyek-klien.html. Prototype remains read-only.
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { UiAction, ScreenState } from "@/components/preview/Controls";
export default function SitePortalPelacakanProyekKlien() {
  return (
    <ScreenState screen={"site/portal-pelacakan-proyek-klien"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 07 - Portal Pelacakan Proyek Klien"}
        data-screen={"site/portal-pelacakan-proyek-klien"}
        id="konten"
        tabIndex={-1}
      >
        <main
          className={
            "box-border w-full h-fit shrink-0 flex flex-col gap-0 pt-[72px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-6 px-4 sm:px-6 lg:px-8 justify-start items-stretch"
            }
            data-pencil-name={"div"}
          >
            <div
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[12px] p-[20px] justify-between items-center bg-[#ffffff] rounded-[12px]"
              }
              data-pencil-name={"div"}
              data-responsive="row"
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit min-w-[305px] shrink-0 h-fit flex flex-row gap-[8px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "text-[14px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"tag"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"tag"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"TRACKING CODE"}
                    data-text="true"
                  >
                    {"TRACKING CODE"}
                  </div>
                  <div
                    className={
                      "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"DRAF-001"}
                    data-text="true"
                  >
                    {"DRAF-001"}
                  </div>
                  <UiAction
                    label={"content_copy"}
                    className={
                      "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center hover:opacity-75 transition-opacity cursor-pointer p-0"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[14px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"content_copy"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"content_copy"}
                    </div>
                  </UiAction>
                </div>
                <div
                  className={
                    "box-border w-[1px] shrink-0 h-[16px] bg-[#f0f0f0]"
                  }
                  data-pencil-name={"div"}
                ></div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-[42px] flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <ReferenceImage
                      src={"/images/5f9e6a2ac345b8dc.png"}
                      alt={"OpenByte Labs"}
                      contain={true}
                      className={
                        "box-border w-[24px] shrink-0 h-[24px]  bg-no-repeat bg-contain bg-center rounded-[6px]"
                      }
                      data-pencil-name={"img"}
                    />
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Proyek Demo"}
                      data-text="true"
                    >
                      {"Proyek Demo"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                      }
                      data-pencil-name={"Sistem Informasi"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Sistem Informasi"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                      data-pencil-name={"Klien: Belum disetujui"}
                    data-text="true"
                  >
                      {"Klien: Belum disetujui"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[16px]/[24px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"calendar_today"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"calendar_today"}
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Mulai • Target Selesai"}
                      data-text="true"
                    >
                      {"Mulai • Target Selesai"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                    data-pencil-name={"Jadwal contoh belum disetujui"}
                      data-text="true"
                    >
                    {"Jadwal contoh belum disetujui"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[8px_12px] justify-start items-center bg-[#f0f0f0] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-[8px] shrink-0 h-[8px] opacity-[0.5] bg-[#82b440] rounded-[50%]"
                    }
                    data-pencil-name={"span"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Sesi contoh tidak aktif"}
                    data-text="true"
                  >
                    {"Sesi contoh tidak aktif"}
                  </div>
                </div>
                <UiAction
                  label={"Keluar Sesi"}
                  className={
                    "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                >
                  <div
                    className={
                      "text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"logout"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"logout"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Keluar Sesi"}
                    data-text="true"
                  >
                    {"Keluar Sesi"}
                  </div>
                </UiAction>
              </div>
            </div>
            <div
              className={"box-border w-full h-[20px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-start items-start bg-[#e2e89d] rounded-[16px] overflow-hidden relative"
              }
              data-pencil-name={"div"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-[192px] h-[192px] absolute right-[-40px] top-[20px] bg-[#1b1d000d] rounded-[50%] [z-index:0]"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
                data-section-padding="true"
              ></div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-between items-center relative [z-index:1]"
                }
                data-pencil-name={"div"}
                data-responsive="row"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-[48px] shrink-0 h-[48px] flex flex-row gap-0 justify-center items-center bg-[#1b1d00] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[24px]/[32px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"rate_review"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"rate_review"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-[672px] shrink-0 h-[124px] flex flex-col gap-0 justify-start items-start mobile-auto-height"
                    }
                    data-pencil-name={"div"}
                    data-responsive="fixed"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#1b1d0026] rounded-[9999px]"
                        }
                        data-pencil-name={"TAHAP 5 AKTIF"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"TAHAP 5 AKTIF"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"• Menunggu Validasi Klien"}
                        data-text="true"
                      >
                        {"• Menunggu Validasi Klien"}
                      </div>
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[20px]/[26px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.5px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Sesi Peninjauan & Umpan Balik Dibuka"}
                      data-text="true"
                    >
                      {"Sesi Peninjauan & Umpan Balik Dibuka"}
                    </div>
                    <div
                      className={"box-border w-full h-[4px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-[36px] shrink-0 text-[#1b1d00e6] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Sistem telah lolos uji fungsional intern"
                      }
                      data-text="true"
                    >
                      {
                         "Contoh pesan status untuk preview. Tidak menunjukkan kondisi proyek, server, atau rilis nyata."
                      }
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <div
                      className={
                        "box-border w-fit h-[28px] shrink-0 flex flex-row gap-[8px] p-[4px_12px] justify-start items-center bg-[#1b1d001a] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[14px]/[20px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"history_edu"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"history_edu"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Sisa Kuota Revisi: 1 dari 3 Sesi Gratis "
                        }
                        data-text="true"
                      >
                        {"Contoh draf • kuota revisi belum disepakati"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[7.99px] justify-start items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <UiAction
                    label={"Ajukan Revisi / Catatan"}
                    className={
                      "box-border w-fit shrink-0 h-[44px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#1b1d00] rounded-[12px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"edit_note"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"edit_note"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Ajukan Revisi / Catatan"}
                      data-text="true"
                    >
                      {"Ajukan Revisi / Catatan"}
                    </div>
                  </UiAction>
                  <UiAction
                    label={"Setujui Hasil Pekerjaan (Approve)"}
                    className={
                      "box-border w-fit shrink-0 h-[44px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#ffffff] rounded-[12px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"verified"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"verified"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Setujui Hasil Pekerjaan (Approve)"}
                      data-text="true"
                    >
                      {"Setujui Hasil Pekerjaan (Approve)"}
                    </div>
                  </UiAction>
                </div>
              </div>
            </div>
            <div
              className={"box-border w-full h-[24px] shrink-0"}
              data-pencil-name={"spacer"}
            ></div>
            <div
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[20px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
              }
              data-pencil-name={"div"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_1px_0px_#f0f0f0)] flex flex-row gap-0 p-[0px_0px_12px_0px] justify-between items-center"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-[44px] flex flex-col gap-[2px] p-[4px_0px_0px_0px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"METODOLOGI DELIVERY"}
                    data-text="true"
                  >
                    {"METODOLOGI DELIVERY"}
                  </div>
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Alur Progres 6 Tahap Produksi"}
                    data-text="true"
                  >
                    {"Alur Progres 6 Tahap Produksi"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Progres Keseluruhan"}
                    data-text="true"
                  >
                    {"Progres Keseluruhan"}
                  </div>
                  <div
                    className={
                      "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum diukur"}
                    data-text="true"
                  >
                    {"Belum diukur"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[0px_0.02px_0px_0px] justify-start items-start"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
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
                      data-pencil-name={"TAHAP 01"}
                      data-text="true"
                    >
                      {"TAHAP 01"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] flex flex-row gap-0 justify-center items-center bg-[#82b440] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-bold text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Kebutuhan & DP"}
                    data-text="true"
                  >
                    {"Kebutuhan & DP"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum diverifikasi"}
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Form FRS disetujui"}
                        data-text="true"
                      >
                        {"Form FRS disetujui"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Status pembayaran belum diverifikasi"}
                        data-text="true"
                      >
                        {"Status pembayaran belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
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
                      data-pencil-name={"TAHAP 02"}
                      data-text="true"
                    >
                      {"TAHAP 02"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] flex flex-row gap-0 justify-center items-center bg-[#82b440] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-bold text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Arsitektur & UI/UX"}
                    data-text="true"
                  >
                    {"Arsitektur & UI/UX"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum diverifikasi"}
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"ERD & Skema DB"}
                        data-text="true"
                      >
                        {"ERD & Skema DB"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Desain Mockup Figma"}
                        data-text="true"
                      >
                        {"Desain Mockup Figma"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
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
                      data-pencil-name={"TAHAP 03"}
                      data-text="true"
                    >
                      {"TAHAP 03"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] flex flex-row gap-0 justify-center items-center bg-[#82b440] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-bold text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Coding & Database"}
                    data-text="true"
                  >
                    {"Coding & Database"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum diverifikasi"}
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"REST API Backend"}
                        data-text="true"
                      >
                        {"REST API Backend"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"UI Dashboard Selesai"}
                        data-text="true"
                      >
                        {"UI Dashboard Selesai"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
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
                      data-pencil-name={"TAHAP 04"}
                      data-text="true"
                    >
                      {"TAHAP 04"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] flex flex-row gap-0 justify-center items-center bg-[#82b440] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-bold text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Testing & QA"}
                    data-text="true"
                  >
                    {"Testing & QA"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Belum diverifikasi"}
                    data-text="true"
                  >
                    {"Belum diverifikasi"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Test Matrix 100/100"}
                        data-text="true"
                      >
                        {"Test Matrix 100/100"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"check_circle"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_circle"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Vulnerability Scan Pass"}
                        data-text="true"
                      >
                        {"Vulnerability Scan Pass"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#18181a] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"TAHAP 05 • LIVE"}
                      data-text="true"
                    >
                      {"TAHAP 05 • LIVE"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] opacity-[0.5] flex flex-row gap-0 justify-center items-center bg-[#f97316] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-bold text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"pending"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"pending"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Review & Revisi"}
                    data-text="true"
                  >
                    {"Review & Revisi"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"In Progress (Review Open)"}
                    data-text="true"
                  >
                    {"In Progress (Review Open)"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"radio_button_checked"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"radio_button_checked"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Validasi Klien Berjalan"}
                        data-text="true"
                      >
                        {"Validasi Klien Berjalan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"hourglass_empty"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"hourglass_empty"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Sisa 2 Kesempatan Revisi"}
                        data-text="true"
                      >
                        {"Sisa 2 Kesempatan Revisi"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border [flex:1_1_0] h-[146px] opacity-[0.7] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f099] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
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
                      data-pencil-name={"TAHAP 06"}
                      data-text="true"
                    >
                      {"TAHAP 06"}
                    </div>
                    <div
                      className={
                        "box-border w-[24px] shrink-0 h-[24px] flex flex-row gap-0 justify-center items-center bg-[#9ca3af] rounded-[9999px]"
                      }
                      data-pencil-name={"span"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"lock"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"lock"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Deployment Live"}
                    data-text="true"
                  >
                    {"Deployment Live"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Menunggu Pelunasan"}
                    data-text="true"
                  >
                    {"Menunggu Pelunasan"}
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[4px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"ul"}
                  >
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"radio_button_unchecked"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"radio_button_unchecked"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Setup Domain & SSL"}
                        data-text="true"
                      >
                        {"Setup Domain & SSL"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[16px] shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"li"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"radio_button_unchecked"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"radio_button_unchecked"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Serah Terima Source Code"}
                        data-text="true"
                      >
                        {"Serah Terima Source Code"}
                      </div>
                    </div>
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
                "box-border w-full h-[807px] shrink-0 relative mobile-auto-height"
              }
              data-pencil-name={"div"}
              data-responsive="absolute-layout"
            >
              <div
                className={
                  "box-border w-[566px] h-fit absolute left-0 top-0 flex flex-col gap-[20px] justify-start items-start [z-index:0]"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_1px_0px_#f0f0f0)] flex flex-row gap-0 p-[0px_0px_8px_0px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"account_balance_wallet"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"account_balance_wallet"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Status Keuangan"}
                        data-text="true"
                      >
                        {"Status Keuangan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"SOP Termin 50 : 50"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"SOP Termin 50 : 50"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Total Kontrak"}
                        data-text="true"
                      >
                        {"Total Kontrak"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Belum ditetapkan"}
                        data-text="true"
                      >
                        {"Belum ditetapkan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Pembayaran belum diverifikasi"}
                        data-text="true"
                      >
                        {"Pembayaran belum diverifikasi"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Belum ditetapkan"}
                        data-text="true"
                      >
                        {"Belum ditetapkan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-[52px] flex flex-col gap-[4px] p-[8px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Sisa Tagihan"}
                        data-text="true"
                      >
                        {"Sisa Tagihan"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rp 1.750.000"}
                        data-text="true"
                      >
                        {"Rp 1.750.000"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f080] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[20px] flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"check_circle"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"check_circle"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Termin 1: Down Payment (DP)"}
                          data-text="true"
                        >
                          {"Termin 1: Down Payment (DP)"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[4px]"
                        }
                         data-pencil-name={"Status contoh • belum diverifikasi"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                           {"Status contoh • belum diverifikasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f080] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[20px] flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"schedule"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"schedule"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Termin 2: Pelunasan Akhir"}
                          data-text="true"
                        >
                          {"Termin 2: Pelunasan Akhir"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[4px]"
                        }
                        data-pencil-name={"Jatuh Tempo: Rilis Live"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-text="true"
                        >
                          {"Jatuh Tempo: Rilis Live"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-[34px] shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Nomor Rekening Escrow / BCA:"}
                      data-text="true"
                    >
                      {"Nomor Rekening Escrow / BCA:"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Informasi rekening tidak dimuat di preview"}
                      data-text="true"
                    >
                      {"Informasi rekening tersedia melalui kanal resmi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#18181a] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_1px_0px_#2e2e32)] flex flex-row gap-0 p-[0px_0px_8px_0px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"cloud_queue"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"cloud_queue"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Akses Staging & Kode"}
                        data-text="true"
                      >
                        {"Akses Staging & Kode"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-[10px] shrink-0 h-[10px] bg-[#82b440] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit min-h-[85px] shrink-0 flex flex-col gap-[6px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"LIVE STAGING INSTANCE"}
                        data-text="true"
                      >
                        {"LIVE STAGING INSTANCE"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"v1.2.0-rc3"}
                        data-text="true"
                      >
                        {"v1.2.0-rc3"}
                      </div>
                    </div>
                    <a
                      href="https://example.com/staging"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        "box-border w-fit h-[24px] shrink-0 flex flex-row gap-[6px] justify-start items-center group cursor-pointer"
                      }
                      data-pencil-name={"a"}
                      title="Buka staging instance demo di tab baru"
                    >
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#ffffff] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] font-semibold tracking-[-0.16px] text-left [white-space:nowrap] group-hover:text-[#e2e89d] transition-colors"
                        }
                        data-pencil-name={"example.com/staging"}
                        data-text="true"
                      >
                        {"example.com/staging"}
                      </div>
                      <div
                        className={
                          "text-[14px]/[20px] box-border text-[#ffffff] group-hover:text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol transition-colors"
                        }
                        data-pencil-name={"open_in_new"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"open_in_new"}
                      </div>
                    </a>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={
                        "Kredensial demo peninjauan: Akun Penguru"
                      }
                      data-text="true"
                    >
                      {
                        "Kredensial contoh dihapus. Masuk memerlukan kode proyek dan PIN yang diberikan admin secara terpisah."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-between items-center bg-[#242427] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#18181a] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[18px]/[28px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"terminal"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"terminal"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"GitHub Repository (Private)"}
                          data-text="true"
                        >
                          {"GitHub Repository (Private)"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"example/project-demo"}
                          data-text="true"
                        >
                          {"example/project-demo"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181a] rounded-[9999px]"
                      }
                      data-pencil-name={"Branch: staging"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"Branch: staging"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_-1px_0px_#2e2e32)] flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"picture_as_pdf"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"picture_as_pdf"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Dokumen Uji Fungsional (.PDF)"}
                        data-text="true"
                      >
                        {"Dokumen Uji Fungsional (.PDF)"}
                      </div>
                    </div>
                    <UiAction
                      label={"Unduh Laporan"}
                      className={
                        "box-border w-fit shrink-0 h-[16px] flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"a"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Unduh Laporan"}
                        data-text="true"
                      >
                        {"Unduh Laporan"}
                      </div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"download"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"download"}
                      </div>
                    </UiAction>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[12px] justify-between items-center bg-[#f0f0f0] rounded-[16px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#18181a] text-xs font-semibold text-white">
                      AC
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[32px] flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Admin Contoh"}
                        data-text="true"
                      >
                        {"Admin Contoh"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"System Architect & Lead Engineer"}
                        data-text="true"
                      >
                        {"Peran contoh • belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                  <UiAction
                    label={"Direct"}
                    className={
                      "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[6px_12px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                    }
                    data-pencil-name={"a"}
                  >
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"chat"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"chat"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Direct"}
                      data-text="true"
                    >
                      {"Direct"}
                    </div>
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-[802px] h-fit [box-shadow:0px_1px_2px_#0000000d] absolute left-[590px] top-0 flex flex-col gap-[20px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px] [z-index:1]"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_1px_0px_#f0f0f0)] flex flex-row gap-0 p-[0px_0px_8px_0px] justify-between items-center"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[16px]/[24px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"forum"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"forum"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Log Aktivitas & Riwayat Revisi"}
                      data-text="true"
                    >
                      {"Log Aktivitas & Riwayat Revisi"}
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Contoh draf • sinkronisasi tidak aktif"}
                    data-text="true"
                  >
                    {"Contoh draf • sinkronisasi tidak aktif"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start relative"
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border w-[2px] h-[398px] absolute left-[14px] top-0 bg-[#f0f0f0] [z-index:0]"
                    }
                    data-pencil-name={"Icon"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start relative [z-index:1]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"verified_user"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified_user"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Admin Contoh"}
                          data-text="true"
                        >
                          {"Admin Contoh"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Waktu contoh"}
                          data-text="true"
                        >
                          {"Waktu contoh"}
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[4px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "Tahap 4 (Pengujian Fungsional) telah sel"
                        }
                        data-text="true"
                      >
                        {
                           "Contoh catatan pembaruan untuk preview. Detail proyek dan status operasional tidak dimuat."
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"check_box"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check_box"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Uji 42 Skenario Form Input: PASS"
                            }
                            data-text="true"
                          >
                            {"Uji 42 Skenario Form Input: PASS"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                           data-pencil-name={"Belum diverifikasi"}
                          data-text="true"
                        >
                           {"Belum diverifikasi"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start relative [z-index:2]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-col gap-0 justify-center items-center bg-[#e2e89d] rounded-[9999px]"
                      }
                      data-pencil-name={"01"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"01"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-center"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Kontak Demo"}
                            data-text="true"
                          >
                            {"Kontak Demo"}
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#63682c1a] rounded-[4px]"
                            }
                            data-pencil-name={"Sesi Revisi #1 Selesai"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#63682c] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Sesi Revisi #1 Selesai"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Kemarin, 14:30 WIB"}
                          data-text="true"
                        >
                          {"Kemarin, 14:30 WIB"}
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[4px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "“Mohon field Nomor Kartu Keluarga (KK) d"
                        }
                        data-text="true"
                      >
                        {
                           "“Mohon tinjau alur formulir dan ringkasan laporan pada contoh ini.”"
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-[40px] shrink-0 flex flex-row gap-[8px] p-[10px] justify-start items-center bg-[#ffffff] rounded-[8px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"task_alt"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"task_alt"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Status: Selesai diterapkan di branch sta"
                          }
                          data-text="true"
                        >
                          {
                            "Status: Selesai diterapkan di branch staging-v1.2.0-rc2"
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start relative [z-index:3]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"rocket_launch"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"rocket_launch"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-[18px] shrink-0 flex flex-row gap-[8px] justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"CI/CD Automated Bot"}
                          data-text="true"
                        >
                          {"CI/CD Automated Bot"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                           data-pencil-name={"Waktu contoh"}
                          data-text="true"
                        >
                           {"Waktu contoh"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[14px]/[20px] box-border w-full h-[40px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                        }
                        data-pencil-name={
                          "Staging build deployment triggered via c"
                        }
                        data-text="true"
                      >
                        {
                           "Catatan deployment contoh. Tidak ada deployment, migrasi, atau sinkronisasi database yang dijalankan."
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-[297px] shrink-0 [filter:drop-shadow(0px_-1px_0px_#f0f0f0)] flex flex-col gap-0 p-[20px_0px_0px_0px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Tulis Feedback / Permintaan Penyesuaian"}
                    data-text="true"
                  >
                    {"Tulis Feedback / Permintaan Penyesuaian"}
                  </div>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={
                      "Masukkan catatan secara rinci. Masih ter"
                    }
                    data-text="true"
                  >
                    {
                      "Masukkan catatan secara rinci. Masih tersedia 2 sesi revisi gratis."
                    }
                  </div>
                  <div
                    className={"box-border w-full h-[12px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                    }
                    data-pencil-name={"form"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"BAGIAN / MODUL YANG DIKOREKSI"}
                        data-text="true"
                      >
                        {"BAGIAN / MODUL YANG DIKOREKSI"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-[38px] shrink-0 bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={"select"}
                      ></div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-[107px] shrink-0 flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"URAIAN CATATAN PENYESUAIAN"}
                        data-text="true"
                      >
                        {"URAIAN CATATAN PENYESUAIAN"}
                      </div>
                      <div
                        className={
                          "box-border w-full h-[84px] shrink-0 flex flex-col gap-0 p-[12px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden"
                        }
                        data-pencil-name={
                          "Jelaskan kebutuhan penyesuaian Anda seca"
                        }
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border w-[738px] text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                          }
                          data-text="true"
                          data-responsive="fixed"
                        >
                          {
                            "Jelaskan kebutuhan penyesuaian Anda secara spesifik (misal: tata letak laporan)..."
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[237.06px] shrink-0 h-[16px] flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"span"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"shield"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"shield"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Teks diproses secara aman & terenkripsi"
                          }
                          data-text="true"
                        >
                          {"Teks diproses secara aman & terenkripsi"}
                        </div>
                      </div>
                      <UiAction
                        label={"Kirimkan Revisi"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"button"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"send"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"send"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                          }
                          data-pencil-name={"Kirimkan Revisi"}
                          data-text="true"
                        >
                          {"Kirimkan Revisi"}
                        </div>
                      </UiAction>
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
