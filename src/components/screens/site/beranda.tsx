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
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-center bg-[#ffffff] overflow-x-hidden relative screen public-screen mobile-auto-height has-editorial-hero"
        }
        data-pencil-name={"Public / 01 - Beranda"}
        data-screen={"site/beranda"}
        id="konten"
        tabIndex={-1}
      >
        <PublicHeader settings={siteSettings} />
        <main
          className={
            "box-border w-full h-fit shrink-0 flex flex-col gap-0 pt-[104px] lg:pt-[68px] pb-12 justify-start items-center bg-[#ffffff] relative [z-index:0]"
          }
          data-pencil-name={"main"}
        >
          {/* HERO BAND: Open Architectural Canvas + Obsidian Blueprint Sheet */}
          <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
            <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Editorial Column (Open Canvas, No Card Box) */}
                <div className="lg:col-span-7 flex flex-col gap-7">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#82b440]" />
                    <span>OpenByte Labs · Rekayasa Sistem</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h1
                      className="m-0 text-[36px]/[1.12] sm:text-[46px]/[1.08] lg:text-[54px]/[1.06] font-semibold tracking-[-0.035em] text-[#18181a]"
                      data-heading="true"
                    >
                      {siteSettings?.hero.headline ??
                        "Website, aplikasi, dan sistem informasi"}
                    </h1>
                    <p className="m-0 max-w-[58ch] text-[16px]/[1.65] sm:text-[17px]/[1.65] text-[#52525b]">
                      {siteSettings?.hero.subheadline ??
                        "Kami membantu merancang dan mengembangkan solusi digital berdasarkan kebutuhan dan ruang lingkup proyek."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/kalkulator"
                      className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-[10px] bg-[#18181a] px-6 py-3 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[#242427]"
                    >
                      <span>
                        {siteSettings?.hero.primaryCtaLabel ||
                          "Hitung Estimasi Biaya"}
                      </span>
                      <span
                        className="symbol text-[17px] text-[#e2e89d]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </Link>

                    <Link
                      href={
                        whatsappDigits
                          ? `https://wa.me/${whatsappDigits}`
                          : "/konsultasi"
                      }
                      className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] border border-[#eaeaea] bg-white px-5 py-3 text-[14px] font-medium text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0]"
                    >
                      <span
                        className="symbol text-[17px] text-[#82b440]"
                        aria-hidden="true"
                      >
                        chat
                      </span>
                      <span>
                        {siteSettings?.hero.secondaryCtaLabel ||
                          (whatsappDigits
                            ? "Hubungi WhatsApp"
                            : "Tanya kebutuhan Anda")}
                      </span>
                    </Link>
                  </div>

                  {siteSettings?.hero.trustMetrics.length ? (
                    <dl className="m-0 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-[#eaeaea] pt-7 mt-2">
                      {siteSettings.hero.trustMetrics
                        .slice(0, 6)
                        .map((metric, index) => (
                          <div
                            key={`${metric.label}-${index}`}
                            className="flex flex-col gap-1 border-l-2 border-[#d2d88f] pl-3.5"
                          >
                            <dt className="text-[11px] font-medium tracking-[0.04em] uppercase text-[#52525b]">
                              {metric.label}
                            </dt>
                            <dd className="m-0 text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] text-[#18181a] tabular-nums">
                              {metric.value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  ) : null}
                </div>

                {/* Right Blueprint Specification Panel (Obsidian #18181A) */}
                <div className="lg:col-span-5">
                  <div className="rounded-[16px] border border-[#2e2e32] bg-[#18181a] text-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#2e2e32] px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="symbol text-[18px] text-[#e2e89d]"
                          aria-hidden="true"
                        >
                          architecture
                        </span>
                        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#a8a8ad]">
                          Lembar Ruang Lingkup
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242427] px-2.5 py-1 text-[11px] font-medium text-[#e2e89d]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#82b440]" />
                        Terstruktur
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-6">
                      {siteSettings?.hero.heroImageUrl ? (
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-[#2e2e32] bg-[#242427]">
                          <Image
                            src={siteSettings.hero.heroImageUrl}
                            alt={siteSettings.hero.heroImageAlt}
                            fill
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-1.5">
                        <h2 className="m-0 text-[19px] font-semibold tracking-[-0.015em] text-white">
                          Kerangka Eksekusi Proyek
                        </h2>
                        <p className="m-0 text-[13px]/[1.6] text-[#a8a8ad]">
                          Kebutuhan fungsional, arsitektur data, serta batasan kerja disepakati sebelum penawaran tertulis diterbitkan.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-px bg-[#2e2e32] border border-[#2e2e32] rounded-[10px] overflow-hidden">
                        <div className="bg-[#242427] p-3.5 flex flex-col gap-1">
                          <span className="text-[11px] text-[#a8a8ad]">
                            Analisis Kebutuhan
                          </span>
                          <span className="text-[14px] font-semibold text-[#82b440]">
                            Dibahas bersama
                          </span>
                        </div>
                        <div className="bg-[#242427] p-3.5 flex flex-col gap-1">
                          <span className="text-[11px] text-[#a8a8ad]">
                            Estimasi Pengerjaan
                          </span>
                          <span className="text-[14px] font-semibold text-[#e2e89d]">
                            Sesuai cakupan
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col divide-y divide-[#2e2e32] border-t border-b border-[#2e2e32]">
                        <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-[13px]">
                          <span className="inline-flex items-center gap-2 text-[#a8a8ad]">
                            <span className="symbol text-[15px]" aria-hidden="true">
                              database
                            </span>
                            Data &amp; integrasi API
                          </span>
                          <span className="font-medium text-white">
                            Sesuai proyek
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-[13px]">
                          <span className="inline-flex items-center gap-2 text-[#a8a8ad]">
                            <span className="symbol text-[15px]" aria-hidden="true">
                              lock
                            </span>
                            Kontrol akses &amp; keamanan
                          </span>
                          <span className="font-medium text-[#82b440]">
                            Dibahas di penawaran
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a8a8ad]">
                        <span>Dokumen teknis &amp; cakupan tertulis</span>
                        <Link
                          href="/paket"
                          className="font-semibold text-[#e2e89d] no-underline hover:underline"
                        >
                          Lihat Paket Layanan
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-[28px] px-4 sm:px-6 lg:px-8 pt-8 justify-start items-start"
            }
            data-pencil-name={"div"}
            data-responsive="flow"
          >
            <PublicHomeServices services={catalog?.services ?? []} />
            <PublicHomeProjects projects={catalog?.projects ?? []} />
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
                  "box-border w-full sm:w-fit shrink-0 h-fit flex flex-row flex-wrap gap-[8px] justify-start items-center relative [z-index:2]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full sm:w-auto shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] [backdrop-filter:blur(4px)] flex flex-col gap-0 p-[8px_12px] justify-start items-center sm:items-start bg-[#ffffffe6] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
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
                      "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.16px] text-center"
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
                    "box-border w-full sm:w-fit shrink-0 min-h-[52px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[14px_24px] justify-center items-center bg-[#18181a] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-center sm:text-left"
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
            <section
              aria-label="Testimoni dan Informasi Proyek"
              className="box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-stretch"
            >
              <div className="box-border lg:col-span-5 flex flex-col justify-start items-stretch">
                <PublicTestimonials testimonials={catalog?.testimonials ?? []} />
              </div>
              <div className="box-border lg:col-span-7 flex flex-col justify-start items-stretch">
                <PublicHomeFaqs faqs={catalog?.faqs ?? []} />
              </div>
            </section>
          </div>
        </main>
        <PublicFooter settings={siteSettings} />
      </div>
    </ScreenState>
  );
}
