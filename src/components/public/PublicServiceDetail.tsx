import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { ServiceRecord } from "@/schemas/services";

const specs = [
  {
    icon: "speed",
    label: "Tingkat Layanan",
    value: "Belum disepakati",
    note: "Diatur dalam dokumen proyek",
  },
  {
    icon: "security",
    label: "Standar Keamanan",
    value: "Kontrol keamanan",
    note: "Ditinjau dan disepakati per proyek",
  },
  {
    icon: "schedule",
    label: "Jadwal Pengerjaan",
    value: "Belum ditetapkan",
    note: "Disepakati berdasarkan ruang lingkup",
  },
  {
    icon: "payments",
    label: "Biaya Proyek",
    value: "Belum ditetapkan",
    note: "Diatur dalam penawaran tertulis",
  },
] as const;

/**
 * The design's four deliverable areas. The design intentionally leaves the
 * technology undecided ("Komponen belum ditetapkan"), so the tags say exactly
 * that instead of claiming a stack the project has not agreed on.
 */
const deliverables = [
  {
    title: "Antarmuka dan aplikasi web",
    text: "Teknologi, performa, aksesibilitas, dan optimasi ditentukan serta diuji sesuai kebutuhan proyek.",
    tag: "Teknologi belum ditetapkan",
  },
  {
    title: "Data dan integrasi",
    text: "Penyimpanan, pemindahan, pencadangan, dan retensi data ditinjau serta disepakati untuk setiap proyek.",
    tag: "Komponen belum ditetapkan",
  },
  {
    title: "Akses dan keamanan",
    text: "Persyaratan keamanan, kontrol akses, dan pengujian ditetapkan berdasarkan risiko serta ruang lingkup proyek.",
    tag: "Kontrol belum diverifikasi",
  },
  {
    title: "Rilis dan pengoperasian",
    text: "Proses rilis, infrastruktur, sertifikat, dan layanan pihak ketiga ditentukan dalam ruang lingkup proyek.",
    tag: "Komponen belum ditetapkan",
  },
] as const;

/**
 * Public / 09 — Detail Layanan (prototype/stitch/site/detail-layanan.html).
 * Only the service title, description, and highlight points come from the
 * database; specs that the design leaves undecided stay explicitly undecided.
 */
export function PublicServiceDetail({
  service,
  settings,
}: {
  service: ServiceRecord;
  settings?: PublicSiteSettings;
}) {
  return (
    <div className="screen public-screen has-editorial-hero relative flex min-h-screen w-full flex-col items-stretch overflow-x-hidden bg-[#ffffff]">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="relative z-0 flex w-full flex-1 flex-col items-stretch pb-16 pt-[104px] lg:pt-[68px]"
      >
        <section className="flex w-full flex-col items-center justify-center bg-[#18181a] border-b border-[#2e2e32] arch-grid-dark hero-band py-14 sm:py-16">
          <div className="mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1600px] flex-col items-start gap-5 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#e2e89d]">
              <span className="h-2 w-2 rounded-full bg-[#82b440]" />
              <span>Spesifikasi Layanan · OpenByte Labs</span>
            </div>
            <h1
              className="m-0 max-w-3xl text-[32px]/[1.14] font-semibold tracking-[-0.03em] text-[#ffffff] sm:text-[44px]/[1.1]"
              data-heading="true"
            >
              {service.title}
            </h1>
            <p className="m-0 max-w-2xl text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#a8a8ad]">
              {service.description ||
                "Pilihan teknologi, arsitektur, kontrol keamanan, jadwal, dan hasil kerja ditentukan setelah kebutuhan proyek ditinjau dan dicantumkan dalam penawaran tertulis."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/kalkulator"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-[#e2e89d] px-5 py-3 text-[13px] font-semibold text-[#18181a] no-underline transition-colors hover:bg-[#d2d88f]"
              >
                <span>Simulasikan di Kalkulator</span>
                <span
                  className="symbol text-[16px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/konsultasi"
                className="inline-flex min-h-[48px] items-center rounded-[10px] border border-[#2e2e32] bg-[#242427] px-5 py-3 text-[13px] font-semibold text-[#ffffff] no-underline transition-colors hover:border-[#e2e89d]"
              >
                Diskusikan Kebutuhan
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-label="Ringkasan spesifikasi"
          className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 px-4 pt-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 2xl:max-w-[1600px]"
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col items-start gap-2 rounded-[12px] bg-[#F9F9FB] p-5"
            >
              <span
                className="symbol text-[22px] text-[#18181A]"
                aria-hidden="true"
              >
                {spec.icon}
              </span>
              <span className="text-[12px] font-medium text-[#71717A]">
                {spec.label}
              </span>
              <span className="text-[20px] font-extrabold tracking-[-0.3px] text-[#18181A]">
                {spec.value}
              </span>
              <span className="text-[11px] text-[#71717A]">{spec.note}</span>
            </div>
          ))}
        </section>

        <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pt-12 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
          <h2 className="m-0 text-[12px] font-bold tracking-[0.6px] text-[#71717A]">
            AREA YANG DAPAT DIBAHAS DALAM PENAWARAN
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
            {deliverables.map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-start gap-2 rounded-[12px] border border-[#E4E4E7] bg-[#FFFFFF] p-5"
              >
                <h3 className="m-0 text-[15px]/[21px] font-bold text-[#18181A]">
                  {item.title}
                </h3>
                <p className="m-0 text-[13px]/[20px] text-[#52525B]">
                  {item.text}
                </p>
                <span className="rounded-[6px] bg-[#F4F4F5] px-2 py-1 text-[11px] font-medium text-[#71717A]">
                  {item.tag}
                </span>
              </li>
            ))}
          </ul>
          {service.highlights.length ? (
            <ul className="m-0 mt-2 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-[12px] border border-[#E4E4E7] bg-[#F9F9FB] p-5 text-[13px]/[20px] text-[#52525B]"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-4 pt-12 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
          <div className="flex flex-col justify-between gap-6 rounded-[16px] border border-[#E4E4E7] bg-[#F9F9FB] p-8 md:flex-row md:items-center md:p-10">
            <div className="flex min-w-0 flex-col items-start gap-1.5">
              <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.4px] text-[#18181A]">
                Bahas kebutuhan sistem Anda
              </h2>
              <p className="m-0 text-[13px]/[19px] text-[#52525B]">
                Ajukan konsultasi. Ketersediaan, penawaran, jadwal, dan ruang
                lingkup akan dikonfirmasi sebelum pekerjaan dimulai.
              </p>
            </div>
            <Link
              href="/konsultasi"
              className="shrink-0 rounded-[8px] bg-[#18181A] px-4 py-2.5 text-[13px] font-semibold text-white no-underline hover:opacity-90"
            >
              Jadwalkan Konsultasi
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
