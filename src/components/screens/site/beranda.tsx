// Ported from prototype/stitch/site/beranda.html. Prototype remains read-only.
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ScreenState } from "@/components/preview/Controls";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import {
  PublicHomeFaqs,
  PublicHomeProjects,
  PublicHomeServices,
  PublicTestimonials,
} from "@/components/public/HomeDynamicSections";

export default function SiteBeranda({
  catalog,
  settings,
}: {
  catalog?: PublicCatalog;
  settings?: PublicSiteSettings;
} = {}) {
  const siteSettings = catalog?.settings ?? settings;
  const whatsappDigits = siteSettings?.general.whatsappNumber
    ? normalizeWhatsapp(siteSettings.general.whatsappNumber)
    : null;
  return (
    <ScreenState screen={"site/beranda"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-center bg-[#ffffff] overflow-x-hidden relative screen public-screen mobile-auto-height"
        }
        data-pencil-name={"Public / 01 - Beranda"}
        data-screen={"site/beranda"}
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
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-[28px] px-4 sm:px-6 lg:px-8 justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <section
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
              }
              data-pencil-name={"section"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border lg:col-span-7 [box-shadow:0px_1px_3px_#0000000d] border border-neutral-200/80 flex flex-col gap-6 p-[24px] sm:p-[28px] justify-between items-start bg-[#ffffff] rounded-[16px]"
                }
                data-pencil-name={"div"}
                data-responsive="flow"
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[4px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"OPENBYTE • SOLUSI DIGITAL"}
                      data-text="true"
                    >
                      {"OPENBYTE • SOLUSI DIGITAL"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                    }
                    data-pencil-name={"Text Group"}
                  >
                    <h1
                      className={
                        "text-[34px]/[43px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.85px] text-left m-0"
                      }
                      data-pencil-name={
                        "Rekayasa Perangkat Lunak & Sistem Presis"
                      }
                      data-text="true"
                      data-heading="true"
                    >
                      {siteSettings?.hero.headline ??
                        "Website, aplikasi, dan sistem informasi"}
                    </h1>
                    <div
                      className={
                        "text-[15px]/[24px] box-border w-[620px] max-w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                      }
                      data-pencil-name={
                        "Membangun arsitektur web dan mobile mode"
                      }
                      data-text="true"
                    >
                      {siteSettings?.hero.subheadline ??
                        "Kami membantu merancang dan mengembangkan solusi digital berdasarkan kebutuhan dan ruang lingkup proyek."}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-wrap gap-[12px] justify-start items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <Link
                      href={"/kalkulator"}
                      className={
                        "box-border w-fit shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_24px] justify-center items-center bg-[#18181a] hover:bg-neutral-800 transition-colors rounded-[12px]"
                      }
                      data-pencil-name={"a"}
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Konsultasi Proyek"}
                        data-text="true"
                      >
                        {siteSettings?.hero.primaryCtaLabel || "Hitung Estimasi Biaya"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"arrow_forward"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"arrow_forward"}
                      </div>
                    </Link>
                    <Link
                      href={
                        whatsappDigits
                          ? `https://wa.me/${whatsappDigits}`
                          : "/konsultasi"
                      }
                      className={
                        "box-border w-fit shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200 flex flex-row gap-[8px] p-[12px_20px] justify-center items-center bg-[#ffffff] hover:bg-neutral-50 transition-colors rounded-[12px]"
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
                        data-pencil-name={"Hubungi Kami"}
                        data-text="true"
                      >
                        {siteSettings?.hero.secondaryCtaLabel || (whatsappDigits ? "Hubungi WhatsApp" : "Tanya kebutuhan Anda")}
                      </div>
                    </Link>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-0 pt-2 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  {siteSettings?.hero.trustMetrics.length ? (
                    <dl className="grid w-full max-w-[755px] grid-cols-1 gap-3 sm:grid-cols-3">
                      {siteSettings.hero.trustMetrics.slice(0, 6).map((metric, index) => (
                        <div key={`${metric.label}-${index}`} className="flex min-h-[63px] flex-col justify-center gap-1 rounded-xl bg-[#f0f0f0] p-3">
                          <dt className="text-[11px] font-medium tracking-[.22px] text-[#52525b]">{metric.label}</dt>
                          <dd className="m-0 text-base font-bold text-[#18181a]">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "box-border lg:col-span-5 [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-6 p-[24px] sm:p-[28px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden"
                }
                data-pencil-name={"div"}
                data-responsive="flow"
              >
                {siteSettings?.hero.heroImageUrl ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#242427]">
                    <Image src={siteSettings.hero.heroImageUrl} alt={siteSettings.hero.heroImageAlt} fill unoptimized sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                  </div>
                ) : null}
                <div
                  className={"box-border w-full flex flex-col gap-[32px]"}
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[18px]/[28px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"dns"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"dns"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"RINGKASAN PROYEK"}
                        data-text="true"
                      >
                        {"RINGKASAN PROYEK"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-[28px] flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#242427] rounded-[9999px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-[6px] shrink-0 h-[6px] opacity-[0.58] bg-[#82b440] rounded-[50%]"
                        }
                        data-pencil-name={"span"}
                      ></div>
                      <div
                        className={
                          "text-[11px]/[20px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Ruang Lingkup"}
                        data-text="true"
                      >
                        {"Ruang Lingkup"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div
                      className={
                        "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Ruang Lingkup Proyek"}
                      data-text="true"
                    >
                      {"Ruang Lingkup Proyek"}
                    </div>
                    <div
                      className={
                        "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-pencil-name={
                        "Kebutuhan, teknologi, dan hasil kerja"
                      }
                      data-text="true"
                    >
                      {
                        "Kebutuhan, teknologi, dan hasil kerja dibahas sebelum penawaran disusun."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit grid grid-cols-2 gap-[12px] justify-start items-start pt-1 -mt-[14px]"
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border h-[63px] flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Kebutuhan"}
                        data-text="true"
                      >
                        {"Kebutuhan"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Dibahas bersama"}
                        data-text="true"
                      >
                        {"Dibahas bersama"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border h-[63px] flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#242427] rounded-[12px]"
                      }
                      data-pencil-name={"div"}
                      data-responsive="flow"
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Estimasi kerja"}
                        data-text="true"
                      >
                        {"Estimasi kerja"}
                      </div>
                      <div
                        className={
                          "text-[16px]/[20px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Sesuai ruang lingkup"}
                        data-text="true"
                      >
                        {"Sesuai ruang lingkup"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit flex flex-col gap-[4px] justify-start items-start pt-1 -mt-4"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#242427] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[20px] flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"span"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"database"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"database"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Data & integrasi"}
                          data-text="true"
                        >
                          {"Data & integrasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Sesuai proyek"}
                        data-text="true"
                      >
                        {"Sesuai proyek"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px] justify-between items-center bg-[#242427] rounded-[8px]"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-[20px] flex flex-row gap-[8px] justify-start items-center"
                        }
                        data-pencil-name={"span"}
                      >
                        <div
                          className={
                            "text-[14px]/[20px] box-border text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"lock"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"lock"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Keamanan aplikasi"}
                          data-text="true"
                        >
                          {"Keamanan aplikasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[13px]/[18px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Dibahas di penawaran"}
                        data-text="true"
                      >
                        {"Dibahas di penawaran"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 pt-4 justify-between items-center border-t border-[#242427]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Cakupan dibahas per proyek"}
                    data-text="true"
                  >
                    {"Cakupan dibahas per proyek"}
                  </div>
                  <div
                    className={
                      "text-[14px]/[14px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"description"}
                  </div>
                </div>
              </div>
            </section>
            <PublicHomeServices services={catalog?.services ?? []} />
            <PublicHomeProjects projects={catalog?.projects ?? []} />
            {catalog?.testimonials.length ? (
              <PublicTestimonials testimonials={catalog.testimonials} />
            ) : null}
            <div
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col lg:flex-row gap-[24px] p-[24px] justify-between items-center bg-[#e2e89d] rounded-[16px] overflow-hidden relative"
              }
              data-pencil-name={"div"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border w-[192px] h-[192px] absolute left-[-48px] top-[54px] bg-[#c6cc8566] rounded-[50%] pointer-events-none [z-index:0]"
                }
                data-pencil-name={"div"}
                data-responsive="fixed"
              ></div>
              <div
                className={
                  "box-border w-full lg:max-w-2xl shrink-0 h-fit flex flex-col gap-0 justify-start items-start relative [z-index:1]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-fit h-[28px] shrink-0 flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#1b1d001a] rounded-[9999px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[14px]/[20px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"calculate"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"calculate"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"ESTIMASI ANGGARAN"}
                    data-text="true"
                  >
                    {"ESTIMASI ANGGARAN"}
                  </div>
                </div>
                <div
                  className={"box-border w-full h-[8px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <h2
                  className={
                    "text-[28px]/[35px] box-border w-full text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.56px] text-left m-0"
                  }
                    data-pencil-name={"Rencanakan kebutuhan sebelum penawaran"}
                  data-text="true"
                  data-heading="true"
                >
                    {"Rencanakan kebutuhan sebelum penawaran."}
                </h2>
                <div
                  className={"box-border w-full h-[4px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[14px]/[20px] box-border w-full text-[#1b1d00cc] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-pencil-name={"Gunakan simulasi interaktif kami untuk m"}
                  data-text="true"
                >
                  {siteSettings?.calculator.disclaimer ?? "Gunakan kalkulator sebagai estimasi awal. Rincian biaya final dikonfirmasi setelah konsultasi kebutuhan."}
                </div>
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center relative [z-index:2]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[140.31px] shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] [backdrop-filter:blur(4px)] flex flex-col gap-0 p-[8px_12px] justify-start items-start bg-[#ffffffe6] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center"
                    }
                    data-pencil-name={"Kalkulator Biaya"}
                    data-text="true"
                  >
                    {"Kalkulator Biaya"}
                  </div>
                  <div
                    className={
                      "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-center [white-space:nowrap]"
                    }
                    data-pencil-name={"Simulasi mandiri"}
                    data-text="true"
                  >
                    {"Simulasi mandiri"}
                  </div>
                </div>
                <Link
                  href="/kalkulator"
                  aria-label="Mulai Simulasi Biaya"
                  className={
                    "box-border w-fit shrink-0 h-[52px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[14px_24px] justify-center items-center bg-[#18181a] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Mulai Simulasi Biaya"}
                    data-text="true"
                  >
                    {siteSettings?.hero.primaryCtaLabel || "Hitung Estimasi Biaya"}
                  </div>
                  <div
                    className={
                      "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
            <PublicHomeFaqs faqs={catalog?.faqs ?? []} />
          </div>
        </main>
        <PublicFooter settings={siteSettings} />
        <PublicHeader settings={siteSettings} />
      </div>
    </ScreenState>
  );
}
