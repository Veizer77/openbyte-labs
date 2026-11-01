// Ported from prototype/stitch/site/daftar-portofolio.html. Prototype remains read-only.
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  UiAction,
  FilterButton,
  FilterItem,
  ScreenState,
} from "@/components/preview/Controls";
export default function SiteDaftarPortofolio() {
  return (
    <ScreenState screen={"site/daftar-portofolio"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen"
        }
        data-pencil-name={"Public / 03 - Daftar Portofolio"}
        data-screen={"site/daftar-portofolio"}
        id="konten"
        tabIndex={-1}
      >
        <main
          className={
            "box-border w-full flex-1 flex flex-col gap-0 pt-[72px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-6 px-4 sm:px-6 lg:px-8 justify-start items-stretch"
            }
            data-pencil-name={"div"}
          >
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-0 py-4 justify-start items-start"
              }
              data-pencil-name={"section"}
            >
              <h2 className="sr-only">Proyek yang telah diterbitkan</h2>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full max-w-[768px] h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] opacity-[0.53] bg-[#82b440] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"CONTOH PORTOFOLIO — BELUM DIVERIFIKASI"}
                      data-text="true"
                    >
                      {"CONTOH PORTOFOLIO — BELUM DIVERIFIKASI"}
                    </div>
                  </div>
                  <div
                    className={"box-border w-full h-[8px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <h1
                    className={
                      "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                    }
                    data-pencil-name={
                      "Portofolio Sistem & Rekayasa Perangkat L"
                    }
                    data-text="true"
                    data-heading="true"
                  >
                    {"Portofolio Sistem & Rekayasa Perangkat Lunak"}
                  </h1>
                  <div
                    className={"box-border w-full h-[4px] shrink-0"}
                    data-pencil-name={"spacer"}
                  ></div>
                  <div
                    className={
                      "text-[14px]/[23px] box-border w-full h-[68.25px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={
                      "Eksplorasi kurasi arsitektur modular, pl"
                    }
                    data-text="true"
                  >
                    {
                      "Contoh visual portofolio untuk menampilkan ragam kebutuhan digital. Rincian, klaim, aset, dan persetujuan proyek harus diverifikasi sebelum publikasi."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[11.99px] justify-start items-center"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[20px]/[28px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"database"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"database"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Status contoh"}
                        data-text="true"
                      >
                        {"Status contoh"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
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
                      "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[20px]/[28px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
                        "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Kepatuhan Regulasi"}
                        data-text="true"
                      >
                        {"Kepatuhan Regulasi"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Belum diverifikasi"}
                        data-text="true"
                      >
                        {"Belum diverifikasi"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-0 py-2 justify-start items-start"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[0px_0px_4px_0px] justify-between items-center overflow-hidden"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                >
                  <FilterButton
                    value={"Semua Proyek"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[6px_12px] justify-start items-center bg-[#18181a] rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Semua Proyek"}
                      data-text="true"
                    >
                      {"Semua Proyek"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[15px] flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#ffffff33] rounded-[9999px]"
                      }
                      data-pencil-name={"6"}
                    >
                      <div
                        className={
                          "text-[11px]/[11px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"6"}
                      </div>
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Instansi / Pemdes"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[7.99px] p-[6px_12px] justify-start items-center rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Instansi / Pemdes"}
                      data-text="true"
                    >
                      {"Instansi / Pemdes"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[15px] flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#e2e2e2] rounded-[9999px]"
                      }
                      data-pencil-name={"3"}
                    >
                      <div
                        className={
                          "text-[11px]/[11px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"3"}
                      </div>
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Aplikasi Mobile"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[8px] p-[6px_12px] justify-start items-center rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Aplikasi Mobile"}
                      data-text="true"
                    >
                      {"Aplikasi Mobile"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[15px] flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#e2e2e2] rounded-[9999px]"
                      }
                      data-pencil-name={"2"}
                    >
                      <div
                        className={
                          "text-[11px]/[11px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"2"}
                      </div>
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Bisnis & UMKM"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[8px] p-[6px_12px] justify-start items-center rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Bisnis & UMKM"}
                      data-text="true"
                    >
                      {"Bisnis & UMKM"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[15px] flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#e2e2e2] rounded-[9999px]"
                      }
                      data-pencil-name={"2"}
                    >
                      <div
                        className={
                          "text-[11px]/[11px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"2"}
                      </div>
                    </div>
                  </FilterButton>
                  <FilterButton
                    value={"Undangan Digital & Event"}
                    className={
                      "box-border w-fit shrink-0 h-[30px] flex flex-row gap-[8px] p-[6px_12px] justify-start items-center rounded-[8px]"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Undangan Digital & Event"}
                      data-text="true"
                    >
                      {"Undangan Digital & Event"}
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[15px] flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#e2e2e2] rounded-[9999px]"
                      }
                      data-pencil-name={"1"}
                    >
                      <div
                        className={
                          "text-[11px]/[11px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {"1"}
                      </div>
                    </div>
                  </FilterButton>
                </div>
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
                    data-pencil-name={"tune"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"tune"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Menampilkan 6 arsitektur sistem"}
                    data-text="true"
                  >
                    {"Menampilkan 6 arsitektur sistem"}
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-auto shrink-0 flex flex-col gap-6 py-2 justify-start items-start"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-6 justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                  }
                  data-pencil-name={"div"}
                >
                  <FilterItem
                    text={
                      "Instansi / Pemdes     Contoh Sistem Informasi       WEB APPLICATION   PostgreSQL + Maps      Draft        Proyek Contoh   Ringkasan sistem informasi untuk kebutuhan organisasi        Next.js App Router     PostgreSQL     Peta Digital        PROBLEM   Data operasional tersebar di beberapa media.     SOLUTION   Alur kerja digital dan ringkasan data terpusat.     IMPACT   Dampak belum dinilai; konten ini hanya contoh.         Detail Proyek   arrow_forward     Draft"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[288px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[288px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181acc] rounded-[9999px]"
                            }
                            data-pencil-name={"Instansi / Pemdes"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Instansi / Pemdes"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"Contoh Sistem Informasi"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Contoh Sistem Informasi"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[calc(100%-24px)] h-fit absolute left-[12px] top-[232px] flex flex-row gap-0 justify-between items-end [z-index:3]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[44px] flex flex-col gap-[1px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[10px]/[20px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[1px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"GEOSPATIAL ENGINE"}
                              data-text="true"
                            >
                              {"GEOSPATIAL ENGINE"}
                            </div>
                            <div
                              className={
                                "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Leaflet GIS + PostGIS 3 Cluster"
                              }
                              data-text="true"
                            >
                              {"Leaflet GIS + PostGIS 3 Cluster"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#242427] rounded-[8px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                        "box-border w-[8px] shrink-0 h-[8px] bg-[#a8a8ad] rounded-[50%]"
                              }
                              data-pencil-name={"span"}
                            ></div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Draft • Belum disetujui"}
                              data-text="true"
                            >
                              {"Draft • Belum disetujui"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[44px] flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <Link
                            href={"/proyek/proyek-contoh"}
                            className={
                              "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Proyek Contoh"}
                            data-text="true"
                          >
                            {"Proyek Contoh"}
                          </Link>
                          <div
                            className={
                              "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                               "Contoh sistem informasi dan alur layanan"
                            }
                            data-text="true"
                          >
                            {
                               "Ilustrasi sistem informasi. Fakta dan hasil belum diverifikasi."
                            }
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                            data-pencil-name={"Aplikasi Web"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                              {"Aplikasi Web"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                            data-pencil-name={"Penyimpanan Data"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                              {"Penyimpanan Data"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                            data-pencil-name={"Peta Digital"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                              {"Peta Digital"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                            data-pencil-name={"Alur Dokumen"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                              {"Alur Dokumen"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[71.63px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"PROBLEM"}
                            data-text="true"
                          >
                            {"PROBLEM"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border w-full h-[53.63px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                            }
                            data-pencil-name={
                               "Data operasional tersebar"
                            }
                            data-text="true"
                          >
                            {
                               "Data yang tersebar di beberapa media sulit diselaraskan."
                            }
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[71.63px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"SOLUTION"}
                            data-text="true"
                          >
                            {"SOLUTION"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border w-full h-[53.63px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                            }
                            data-pencil-name={
                               "Pengelolaan informasi dan alur layanan terpusat"
                            }
                            data-text="true"
                          >
                            {
                               "Contoh pendekatan sistem informasi; detail implementasi belum ditinjau."
                            }
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[71.63px] flex flex-col gap-[4px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                          data-responsive="flow"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"IMPACT"}
                            data-text="true"
                          >
                            {"IMPACT"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border w-full h-[53.63px] shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                            }
                            data-pencil-name={
                               "Hasil belum diukur"
                            }
                            data-text="true"
                          >
                            {
                               "Dampak, hasil, dan klaim belum diverifikasi atau disetujui."
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <Link
                          href={"/konsultasi"}
                          className={
                            "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                          }
                          data-pencil-name={"a"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Request Sandbox Access"}
                            data-text="true"
                          >
                            {"Request Sandbox Access"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"open_in_new"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"open_in_new"}
                          </div>
                        </Link>
                        <Link
                          href={"/proyek/proyek-contoh"}
                          className={
                            "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[4px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[12px]"
                          }
                          data-pencil-name={"a"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Studi Kasus Teknis"}
                            data-text="true"
                          >
                            {"Studi Kasus Teknis"}
                          </div>
                          <div
                            className={
                              "text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"arrow_forward"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"arrow_forward"}
                          </div>
                        </Link>
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Rilis belum disetujui"}
                        data-text="true"
                      >
                        {"Rilis belum disetujui"}
                      </div>
                    </div>
                  </FilterItem>
                  <FilterItem
                    text={
                      "Instansi / Kesehatan     Contoh Sistem Layanan     Dashboard & Pencatatan      Alur Operasional      Proyek Contoh 2    Contoh aplikasi pencatatan layanan dan ringkasan data      React     PostgreSQL     Pengujian Otomatis        ENGINE:   Pencatatan terstruktur     WORKFLOW:   Input → Proses → Tinjauan     OUTPUT:   Dampak belum diukur; konten hanya contoh        Detail Proyek   open_in_new    Draft"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-auto shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[288px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[288px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181acc] rounded-[9999px]"
                            }
                            data-pencil-name={"Instansi / Kesehatan"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Instansi / Kesehatan"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"Organisasi Demo"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Organisasi Demo"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[calc(100%-24px)] h-fit [backdrop-filter:blur(6px)] absolute left-[12px] top-[236px] flex flex-row gap-0 p-[8px] justify-between items-center bg-[#242427e6] rounded-[8px] [z-index:3]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "box-border w-[40px] shrink-0 h-[24px] overflow-hidden relative"
                              }
                              data-pencil-name={"svg"}
                            >
                              <svg
                                viewBox="0 -0.00000476837158203125 100 38.020833015441895"
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="box-border w-[40px] h-[15.208px] absolute left-0 top-[2.79px] overflow-visible [z-index:0]"
                              >
                                <path
                                  d="M0 38.02083q25 0 45-25 20-25 25-2 5 23 30 24"
                                  fill="none"
                                  stroke="#82B440"
                                  strokeWidth="1"
                                  strokeLinecap="round"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Perlu verifikasi"}
                              data-text="true"
                            >
                              {"Perlu verifikasi"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[10px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"5-Meja Standard"}
                            data-text="true"
                          >
                            {"5-Meja Standard"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <Link
                        href={"/proyek/proyek-contoh-2"}
                        className={
                          "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                        }
                            data-pencil-name={"Proyek Contoh 2"}
                        data-text="true"
                      >
                            {"Proyek Contoh 2"}
                      </Link>
                      <div
                        className={"box-border w-full h-[2px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border w-full h-[32px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                        }
                        data-pencil-name={
                          "Contoh aplikasi pencatatan layanan"
                        }
                        data-text="true"
                      >
                        {
                          "Contoh aplikasi layanan; rincian belum diverifikasi."
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[5.99px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"React 18"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"React 18"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"InsForge SDK"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"InsForge SDK"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Vitest Suite"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Vitest Suite"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Konten belum diverifikasi"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Konten belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-[18px] shrink-0 relative"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border absolute left-0 top-[3px] text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap] [z-index:0]"
                            }
                            data-pencil-name={"ENGINE:"}
                            data-text="true"
                          >
                            {"ENGINE:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border absolute left-[199.2px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap] [z-index:1]"
                            }
                            data-pencil-name={
                              "Perhitungan Z-Score TB/U, BB/U, BB/TB ot"
                            }
                            data-text="true"
                          >
                            {"Perhitungan Z-Score TB/U, BB/U, BB/TB otomatis"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[18px] shrink-0 relative"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border absolute left-0 top-[3px] text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap] [z-index:0]"
                            }
                            data-pencil-name={"WORKFLOW:"}
                            data-text="true"
                          >
                            {"WORKFLOW:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border absolute left-[211.37px] top-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap] [z-index:1]"
                            }
                            data-pencil-name={
                              "Alur Registrasi → Pengukuran → Konseling"
                            }
                            data-text="true"
                          >
                             {"Alur Registrasi → Pemrosesan → Tinjauan"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[18px] shrink-0 relative"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border absolute left-0 top-[3px] text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap] [z-index:0]"
                            }
                            data-pencil-name={"OUTPUT:"}
                            data-text="true"
                          >
                            {"OUTPUT:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border absolute left-[252.28px] top-0 text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap] [z-index:1]"
                            }
                            data-pencil-name={
                              "Hasil belum diverifikasi"
                            }
                            data-text="true"
                          >
                            {"Hasil belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <UiAction
                        label={"Uji Coba Sistem"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Uji Coba Sistem"}
                          data-text="true"
                        >
                          {"Uji Coba Sistem"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"open_in_new"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"open_in_new"}
                        </div>
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Posyandu Mandiri"}
                        data-text="true"
                      >
                        {"Posyandu Mandiri"}
                      </div>
                    </div>
                  </FilterItem>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                  }
                  data-pencil-name={"div"}
                >
                  <FilterItem
                    text={
                      "Utilitas Publik     Aplikasi Operasional      web   Pencatatan & Ringkasan       Proyek Contoh 3    Aplikasi layanan lintas perangkat      Next.js     Flutter     PostgreSQL        Rekonsiliasi data:   menunggu validasi       Detail proyek menunggu tinjauan dan persetujuan pemilik.       Lihat Proyek Contoh   north_east    Sinkronisasi data"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#18181a] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#242427] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[256px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[256px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#ffffff33] rounded-[9999px]"
                            }
                            data-pencil-name={"Utilitas Publik"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Utilitas Publik"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"Mobile & Web Engine"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Mobile & Web Engine"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-[28px] absolute left-[12px] top-[216px] flex flex-row gap-[8px] justify-start items-center [z-index:3]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[28px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"water_drop"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"water_drop"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Contoh aplikasi operasional"
                            }
                            data-text="true"
                          >
                            {"Contoh aplikasi operasional"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-[26px] shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <Link
                          href={"/proyek/proyek-contoh-3"}
                          className={
                            "text-[20px]/[26px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Proyek Contoh 3"}
                          data-text="true"
                        >
                          {"Proyek Contoh 3"}
                        </Link>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[9999px]"
                          }
                          data-pencil-name={"Cross-Platform"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Cross-Platform"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[4px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Contoh aplikasi operasional lintas perangkat"
                        }
                        data-text="true"
                      >
                        {
                          "Ilustrasi alur kerja digital. Fitur dan dampak belum diverifikasi."
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[6px]"
                          }
                          data-pencil-name={"Next.js 16"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Next.js 16"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[6px]"
                          }
                          data-pencil-name={"Flutter 3.x Engine"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Flutter 3.x Engine"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[6px]"
                          }
                          data-pencil-name={"Supabase Postgres"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Supabase Postgres"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[6px]"
                          }
                          data-pencil-name={"Thermal Print ESC/POS"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Thermal Print ESC/POS"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-[84px] shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "box-border w-full h-[18px] shrink-0 flex flex-row gap-0 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Ketepatan Rekonsiliasi Kas:"}
                            data-text="true"
                          >
                            {"Ketepatan Rekonsiliasi Kas:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Belum diverifikasi"}
                            data-text="true"
                          >
                            {"Belum diverifikasi"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[9999px] overflow-hidden"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-full h-[6px] shrink-0 bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"div"}
                          ></div>
                        </div>
                        <div
                          className={
                            "text-[11px]/[20px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={
                            "Menangani kalkulasi progresif (0-10m³, 1"
                          }
                          data-text="true"
                        >
                          {
                            "Menangani kalkulasi progresif (0-10m³, 11-20m³, >20m³) + biaya abonemen tanpa selisih pembukuan."
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <Link
                          href={"/proyek/proyek-contoh-3"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Lihat Proyek Contoh"}
                          data-text="true"
                        >
                          {"Lihat Proyek Contoh"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"north_east"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"north_east"}
                        </div>
                      </Link>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Offline-first Sync"}
                        data-text="true"
                      >
                        {"Offline-first Sync"}
                      </div>
                    </div>
                  </FilterItem>
                  <FilterItem
                    text={
                      "Bisnis & UMKM     Katalog Digital      PostgreSQL Scaling    Pemesanan Online       Proyek Contoh 4    Contoh katalog produk dengan alur pemesanan digital      React     PostgreSQL     Object Storage     Drizzle ORM        Optimasi Media:   menunggu pengukuran     Konversi:   belum tersedia        Detail Proyek   open_in_new    Draft"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-auto shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[256px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[256px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181acc] rounded-[9999px]"
                            }
                            data-pencil-name={"Bisnis & UMKM"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Bisnis & UMKM"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"Direktori Komersial"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Direktori Komersial"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[calc(100%-24px)] h-fit absolute left-[12px] top-[220px] flex flex-row gap-0 justify-between items-center [z-index:3]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Serverless Postgres Scaling"}
                            data-text="true"
                          >
                            {"Serverless Postgres Scaling"}
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[24px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#242427] rounded-[4px]"
                            }
                            data-pencil-name={"WA Cart API"}
                          >
                            <div
                              className={
                                "text-[11px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"WA Cart API"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <Link
                          href={"/proyek/proyek-contoh-4"}
                        className={
                          "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Proyek Contoh 4"}
                        data-text="true"
                      >
                        {"Proyek Contoh 4"}
                      </Link>
                      <div
                        className={"box-border w-full h-[2px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Contoh katalog produk digital"
                        }
                        data-text="true"
                      >
                        {
                          "Ilustrasi katalog produk dan alur pemesanan; rincian belum disetujui."
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"React Router v7"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"React Router v7"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Neon Serverless Postgres"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Neon Serverless Postgres"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"AWS S3 Assets"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"AWS S3 Assets"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Drizzle ORM"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Drizzle ORM"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[34px] flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Optimasi Media:"}
                            data-text="true"
                          >
                            {"Optimasi Media:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "WebP auto-compression under 45kb"
                            }
                            data-text="true"
                          >
                            {"WebP auto-compression under 45kb"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[34px] flex flex-col gap-[2px] justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Konversi Chat:"}
                            data-text="true"
                          >
                            {"Konversi Chat:"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Dampak belum diukur"}
                            data-text="true"
                          >
                            {"Dampak belum diukur"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <UiAction
                        label={"Akses Showcase"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Akses Showcase"}
                          data-text="true"
                        >
                          {"Akses Showcase"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"open_in_new"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"open_in_new"}
                        </div>
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                         data-pencil-name={"Contoh katalog digital"}
                        data-text="true"
                      >
                         {"Contoh katalog digital"}
                      </div>
                    </div>
                  </FilterItem>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                  }
                  data-pencil-name={"div"}
                >
                  <FilterItem
                    text={
                      "Bisnis Jasa     Contoh Website Layanan     Draft     Proyek Contoh 5    Contoh website layanan dengan alur pemesanan digital      HTML     CSS     Integrasi Formulir     Perlu tinjauan       Klaim, fitur, identitas, dan metrik belum diverifikasi.       Detail Proyek    Draft"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-auto shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[224px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[224px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181acc] rounded-[9999px]"
                            }
                            data-pencil-name={"Bisnis Jasa"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Bisnis Jasa"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"High-Converting Landing"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"High-Converting Landing"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[calc(100%-24px)] h-fit absolute left-[12px] top-[188px] flex flex-row gap-0 justify-between items-center [z-index:3]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "box-border w-[215.19px] shrink-0 h-[24px] flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                               data-pencil-name={"radio_button_unchecked"}
                              data-text="true"
                              aria-hidden="true"
                            >
                               {"radio_button_unchecked"}
                            </div>
                            <div
                              className={
                                "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                               data-pencil-name={"radio_button_unchecked"}
                              data-text="true"
                              aria-hidden="true"
                            >
                               {"radio_button_unchecked"}
                            </div>
                            <div
                              className={
                                "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                               data-pencil-name={"radio_button_unchecked"}
                              data-text="true"
                              aria-hidden="true"
                            >
                               {"radio_button_unchecked"}
                            </div>
                            <div
                              className={
                                "text-[16px]/[24px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                               data-pencil-name={"radio_button_unchecked"}
                              data-text="true"
                              aria-hidden="true"
                            >
                               {"radio_button_unchecked"}
                            </div>
                            <div
                              className={
                                "text-[16px]/[24px] box-border [flex:1_1_0] text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left symbol"
                              }
                               data-pencil-name={"radio_button_unchecked"}
                              data-text="true"
                              aria-hidden="true"
                            >
                               {"radio_button_unchecked"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Belum diverifikasi"}
                              data-text="true"
                            >
                              {"Belum diverifikasi"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Belum diukur"}
                            data-text="true"
                          >
                            {"Belum diukur"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <Link
                        href={"/proyek/proyek-contoh-5"}
                        className={
                          "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Proyek Contoh 5"}
                        data-text="true"
                      >
                        {"Proyek Contoh 5"}
                      </Link>
                      <div
                        className={"box-border w-full h-[2px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Website Profil Praktisi Terapi Tradision"
                        }
                        data-text="true"
                      >
                        {
                          "Website Profil Praktisi Terapi Tradisional & Sistem Reservasi Direct WhatsApp Terotomasi"
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[5.99px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Semantic HTML5"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Semantic HTML5"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Modular CSS Variables"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Modular CSS Variables"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"WhatsApp Deep Linking"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"WhatsApp Deep Linking"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Zero Dependency"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Zero Dependency"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[21px] box-border w-full h-[42.25px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Memecahkan kendala konversi jadwal pasie"
                          }
                          data-text="true"
                        >
                          {
                            "Memecahkan kendala konversi jadwal pasien offline melalui penataan hierarki layanan terstruktur, daftar harga transparan, dan tombol booking tanpa hambatan formulir rumit."
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <UiAction
                        label={"Lihat Website"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Lihat Website"}
                          data-text="true"
                        >
                          {"Lihat Website"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"open_in_new"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"open_in_new"}
                        </div>
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Instant Booking"}
                        data-text="true"
                      >
                        {"Instant Booking"}
                      </div>
                    </div>
                  </FilterItem>
                  <FilterItem
                    text={
                      "Undangan Digital & Event     Microsite Acara       music_note   RSVP Digital    Desain Responsif      Proyek Contoh 6    Contoh microsite acara dengan formulir RSVP      HTML5     CSS     Web Audio API     Form Integration       Fitur:   halaman informasi dan konfirmasi kehadiran.       Lihat Proyek   open_in_new    Draft"
                    }
                    className={
                      "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[20px] justify-between items-start bg-[#f0f0f0] rounded-[16px]"
                    }
                    data-pencil-name={"article"}
                  >
                    <div
                      className={
                        "box-border w-full h-auto shrink-0 flex flex-col gap-0 p-[0px_0px_12px_0px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#18181a] rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className="box-border w-full h-[224px] shrink-0 bg-[#242427] relative [z-index:0]"
                          role="img"
                          aria-label="Tangkapan layar contoh disembunyikan sampai disetujui"
                        />
                        <div
                          className={
                            "box-border w-full h-[224px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#18181a_0%,_#18181a66_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]"
                          }
                          data-pencil-name={"div"}
                        ></div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-[6px] justify-start items-start [z-index:2]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [backdrop-filter:blur(6px)] flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#18181acc] rounded-[9999px]"
                            }
                            data-pencil-name={"Undangan Digital & Event"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Undangan Digital & Event"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-start bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"Interactive Canvas"}
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Interactive Canvas"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-[calc(100%-24px)] h-fit absolute left-[12px] top-[188px] flex flex-row gap-0 justify-between items-center [z-index:3]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
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
                              data-pencil-name={"music_note"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"music_note"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Web Audio API Background Player"
                              }
                              data-text="true"
                            >
                              {"Web Audio API Background Player"}
                            </div>
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"60 FPS Render"}
                            data-text="true"
                          >
                            {"60 FPS Render"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <Link
                          href={"/proyek/proyek-contoh-6"}
                        className={
                          "text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[-0.3px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Proyek Contoh 6"
                        }
                        data-text="true"
                      >
                        {"Proyek Contoh 6"}
                      </Link>
                      <div
                        className={"box-border w-full h-[2px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={
                          "Pengalaman Multimedia Interaktif dengan "
                        }
                        data-text="true"
                      >
                        {
                          "Pengalaman Multimedia Interaktif dengan Animasi Fisika Kelopak Bunga & Sinkronisasi RSVP Cloud"
                        }
                      </div>
                      <div
                        className={"box-border w-full h-[8px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"HTML5 Canvas Engine"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"HTML5 Canvas Engine"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Web Audio API"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Web Audio API"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Integrasi Demo"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Integrasi Demo"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[24px] [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[6px]"
                          }
                          data-pencil-name={"Guest Slug Engine"}
                        >
                          <div
                            className={
                              "text-[11px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Guest Slug Engine"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={"box-border w-full h-[12px] shrink-0"}
                        data-pencil-name={"spacer"}
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[12px] justify-start items-start bg-[#ffffff] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[21px] box-border w-full h-[42.25px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Dampak dan jumlah pengguna belum diverifikasi"
                          }
                          data-text="true"
                        >
                          {
                            "Ilustrasi microsite acara; fitur, data penggunaan, dan dampak belum diverifikasi atau disetujui."
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_0px_0px_0px] justify-between items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <UiAction
                        label={"Buka Undangan"}
                        className={
                          "box-border w-fit shrink-0 h-[36px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#18181a] rounded-[12px]"
                        }
                        data-pencil-name={"a"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Buka Undangan"}
                          data-text="true"
                        >
                          {"Buka Undangan"}
                        </div>
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"open_in_new"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"open_in_new"}
                        </div>
                      </UiAction>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Jumlah pengguna belum diverifikasi"}
                        data-text="true"
                      >
                        {"Jumlah pengguna belum diverifikasi"}
                      </div>
                    </div>
                  </FilterItem>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-0 py-4 justify-start items-start"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-start items-start bg-[#f0f0f0] rounded-[16px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-auto flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"01 / ARSITEKTUR"}
                      data-text="true"
                    >
                      {"01 / ARSITEKTUR"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Modular & Scalable"}
                      data-text="true"
                    >
                      {"Modular & Scalable"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Komponen terisolasi dengan dokumentasi t"
                      }
                      data-text="true"
                    >
                      {
                        "Komponen terisolasi dengan dokumentasi typed schema, mempermudah ekspansi fitur tanpa merusak logic inti."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"02 / KEPATUHAN DATA"}
                      data-text="true"
                    >
                      {"02 / KEPATUHAN DATA"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Perlindungan & akses data"}
                      data-text="true"
                    >
                      {"Perlindungan & akses data"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Penyimpanan data terenkripsi, row-level "
                      }
                      data-text="true"
                    >
                      {
                        "Praktik akses, perlindungan, dan pencadangan ditentukan sesuai kebutuhan proyek; detail belum diverifikasi."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"03 / OPTIMASI PERFORMA"}
                      data-text="true"
                    >
                      {"03 / OPTIMASI PERFORMA"}
                    </div>
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Performa belum diukur"}
                      data-text="true"
                    >
                      {"Performa belum diukur"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Edge-rendered caching, bundling minim, d"
                      }
                      data-text="true"
                    >
                      {
                        "Hasil performa dan Core Web Vitals belum diukur atau diverifikasi untuk contoh proyek ini."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto flex flex-col gap-3 justify-between items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-auto shrink-0 flex flex-col gap-[4px] justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"04 / KUSTOMISASI"}
                        data-text="true"
                      >
                        {"04 / KUSTOMISASI"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Punya Kebutuhan Khusus?"}
                        data-text="true"
                      >
                        {"Punya Kebutuhan Khusus?"}
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-full h-auto shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-pencil-name={
                          "Diskusikan arsitektur sistem khusus inst"
                        }
                        data-text="true"
                      >
                        {
                          "Diskusikan arsitektur sistem khusus instansi atau bisnismu langsung dengan engineer."
                        }
                      </div>
                    </div>
                    <Link
                      href={"/konsultasi"}
                      className={
                        "box-border w-full h-[40px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[10px_12px] justify-center items-center bg-[#18181a] rounded-[12px]"
                      }
                      data-pencil-name={"a"}
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Jadwalkan Technical Discovery"}
                        data-text="true"
                      >
                        {"Jadwalkan Technical Discovery"}
                      </div>
                      <div
                        className={
                          "text-[14px]/[20px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"arrow_forward"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"arrow_forward"}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <PublicFooter />
        <PublicHeader />
      </div>
    </ScreenState>
  );
}
