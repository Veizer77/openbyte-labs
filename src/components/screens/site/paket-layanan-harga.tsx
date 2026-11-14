// Ported from prototype/stitch/site/paket-layanan-harga.html. Prototype remains read-only.
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  UiAction,
  DataRows,
  ScreenState,
} from "@/components/preview/Controls";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { rupiah } from "@/lib/format";

/**
 * Satu baris spesifikasi: ikon di kiri, teks di kanan.
 *
 * Prototype memakai dua bentuk baris berbeda — sebagian `h-[26px]` dengan
 * `items-center` dan `whitespace-nowrap`, sebagian lagi `h-[36px]` dengan
 * posisi absolut. Karena teksnya kini berasal dari database (panjangnya
 * bervariasi), bentuk campuran itu menghasilkan jarak yang tidak konsisten:
 * tinggi baris 26px vs 36px, ikon meleset +3px atau −2px terhadap teks, dan
 * teks panjang terpotong karena `nowrap`.
 *
 * Satu bentuk untuk semua baris: tinggi mengikuti isi, ikon sejajar di baris
 * pertama teks, dan teks boleh membungkus. Jarak antar baris diatur oleh
 * `gap` pada daftar induk, bukan oleh spacer manual.
 */
function PackageFeatureRow({
  icon,
  text,
  tone,
}: {
  icon: "check_circle" | "verified";
  text: string;
  tone: "light" | "dark";
}) {
  const iconColor = tone === "dark" ? "text-[#e2e89d]" : "text-[#82b440]";
  const textColor = tone === "dark" ? "text-[#ffffff]" : "text-[#18181a]";
  return (
    <li className="box-border w-full flex flex-row gap-[10px] justify-start items-start">
      <span
        className={`${iconColor} box-border shrink-0 w-[24px] text-[16px]/[24px] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left symbol`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span
        className={`${textColor} box-border [flex:1_1_0] min-w-0 text-[13px]/[18px] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left break-words`}
      >
        {text}
      </span>
    </li>
  );
}

/**
 * Halaman ini tetap memakai tata letak hasil porting prototype, tetapi seluruh
 * isi kartu (nama, harga, estimasi, revisi, fitur, CTA) dibaca dari database.
 * Tanpa ini, perubahan paket di admin panel tidak pernah muncul di halaman
 * publik: harga dan tautan CTA tertinggal sebagai teks statis.
 */
export default function SitePaketLayananHarga({
  catalog,
}: {
  catalog?: PublicCatalog;
} = {}) {
  const whatsappNumber = catalog?.settings?.general.whatsappNumber ?? "";
  const whatsappDigits = whatsappNumber ? normalizeWhatsapp(whatsappNumber) : null;
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Halo OpenByte Labs, saya ingin mendiskusikan paket layanan.")}`
    : "/konsultasi";

  const packages = catalog?.packages ?? [];
  const packageBySlug = (slug: string) =>
    packages.find((item) => item.slug === slug);
  const starter = packageBySlug("starter-umkm");
  const mobile = packageBySlug("mobile-application");
  const informasi = packageBySlug("sistem-informasi");
  const extraPackages = packages.filter(
    (item) =>
      item.slug !== "starter-umkm" &&
      item.slug !== "mobile-application" &&
      item.slug !== "sistem-informasi",
  );
  const isStarterPopular = Boolean(starter?.isPopular);
  const isMobilePopular = Boolean(mobile?.isPopular);
  const isInformasiPopular = Boolean(informasi?.isPopular);

  // Penempatan posisi kartu: Paket populer ditempatkan di tengah (order-2)
  // sesuai kaidah psikologi harga (Center-Stage Effect) agar menjadi fokus utama.
  let starterOrder = "order-1";
  let informasiOrder = "order-2";
  let mobileOrder = "order-3";

  if (isStarterPopular) {
    starterOrder = "order-2";
    informasiOrder = "order-1";
    mobileOrder = "order-3";
  } else if (isMobilePopular) {
    starterOrder = "order-1";
    mobileOrder = "order-2";
    informasiOrder = "order-3";
  } else {
    starterOrder = "order-1";
    informasiOrder = "order-2";
    mobileOrder = "order-3";
  }
  const addons = catalog?.addons ?? [];
  const labelAddonBilling = (billingType: "one_time" | "monthly" | "yearly") =>
    billingType === "monthly"
      ? "/ bulan"
      : billingType === "yearly"
        ? "/ tahun"
        : "/ sekali bayar";
  const jumlahRevisi = (value: number | undefined) =>
    typeof value === "number" ? `${value}x` : "—";
  const hargaRevisi = (value: number | null | undefined) =>
    typeof value === "number" ? `${rupiah(value)}/sesi` : "—";
  const labelCta = (pkg: { ctaLabel: string; name: string } | undefined, fallback: string) =>
    pkg?.ctaLabel?.trim() ? pkg.ctaLabel : fallback;
  /** Kartu menampilkan "Rp" terpisah dari angkanya, jadi hanya digit yang diisi. */
  const angkaRupiah = (value: number | undefined) =>
    typeof value === "number" ? new Intl.NumberFormat("id-ID").format(value) : "—";
  const labelBilling = (
    pkg:
      | { billingType: string; price: number; effectivePrice: number }
      | undefined,
  ) => {
    if (!pkg) return "Investasi awal • One-time payment";
    if (pkg.billingType === "subscription_yearly") return "Langganan tahunan";
    if (pkg.billingType === "custom") return "Sesuai ruang lingkup";
    return "Investasi awal • One-time payment";
  };
  /** Baris fitur kosong tidak dirender supaya tidak ada centang tanpa isi. */
  const isiFitur = (feature: string | null | undefined): feature is string =>
    typeof feature === "string" && feature.trim() !== "";

  return (
    <ScreenState screen={"site/paket-layanan-harga"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col gap-0 justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen has-editorial-hero"
        }
        data-pencil-name={"Public / 02 - Paket Layanan & Harga"}
        data-screen={"site/paket-layanan-harga"}
        id="konten"
        tabIndex={-1}
      >
        <PublicHeader settings={catalog?.settings} />
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
                  <span>Struktur Investasi &amp; Cakupan Teknis</span>
                </div>
                <h1
                  className="text-[32px]/[1.14] sm:text-[42px]/[1.1] lg:text-[48px]/[1.08] text-[#18181a] font-semibold tracking-[-0.03em] m-0"
                  data-heading="true"
                >
                  Pilihan Paket Layanan &amp; Investasi Sistem
                </h1>
                <p className="text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#52525b] font-normal m-0 max-w-2xl">
                  Setiap paket dirancang dengan batasan ruang lingkup tertulis, rincian kuota revisi, serta penyerahan kode sumber sesuai kesepakatan proyek.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/kalkulator"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] border border-[#eaeaea] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0]"
                >
                  <span className="symbol text-[17px]" aria-hidden="true">
                    calculate
                  </span>
                  <span>Simulasi Modul Kustom</span>
                </Link>
              </div>
            </div>
          </section>

          <div
            className={
              "box-border w-full max-w-[1440px] 2xl:max-w-[1600px] h-fit shrink-0 flex flex-col gap-8 px-4 sm:px-6 lg:px-8 pt-6 justify-start items-stretch"
            }
            data-pencil-name={"div"}
          >
            <section
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-4"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  isStarterPopular
                    ? `box-border w-full h-auto [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden relative ${starterOrder} lg:-translate-y-2`
                    : `box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] ${starterOrder}`
                }
                data-pencil-name={"div"}
              >
                {isStarterPopular && (
                  <div
                    className={
                      "box-border w-[224px] h-[224px] [filter:blur(32px)] absolute right-[-40px] top-[-96px] bg-[#e1e89c26] rounded-[50%] [z-index:0]"
                    }
                    data-pencil-name={"div"}
                  ></div>
                )}
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start ${isStarterPopular ? "relative [z-index:1]" : ""}`
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    {isStarterPopular ? (
                      <div
                        className={
                          "box-border w-fit shrink-0 h-auto flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e2e89d] rounded-[9999px]"
                        }
                        data-pencil-name={"span"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.28px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Paling Populer"}
                          data-text="true"
                        >
                          {"Paling Populer"}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                        }
                        data-pencil-name={"TIER 01 • WEB PRESENTASI"}
                        data-text="true"
                      >
                        {"TIER 01 • WEB PRESENTASI"}
                      </div>
                    )}
                    <div
                      className={
                        isStarterPopular
                          ? "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#242427] rounded-[9999px]"
                          : "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 7 Hari"}
                    >
                      <div
                        className={
                          isStarterPopular
                            ? "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            : "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {starter
                          ? `Estimasi ${starter.estimatedDays} Hari`
                          : "Estimasi —"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-[6px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        `text-[20px]/[26px] box-border w-full ${isStarterPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left`
                      }
                      data-pencil-name={"Starter UMKM & Bisnis"}
                      data-text="true"
                    >
                      {starter?.name ?? "Starter UMKM & Bisnis"}
                    </div>
                    <div
                      className={
                        `text-[13px]/[18px] box-border w-full h-auto shrink-0 ${isStarterPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium text-left`
                      }
                      data-pencil-name={
                        "Landing page konversi tinggi dengan arsi"
                      }
                      data-text="true"
                    >
                      {
                        starter?.targetMarket?.trim()
                          ? starter.targetMarket
                          : "Landing page konversi tinggi dengan arsitektur modern & loading sub-detik."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full min-h-[72px] h-auto shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    {starter && typeof starter.price === "number" && starter.effectivePrice < starter.price && (
                      <div className="box-border w-full flex flex-row flex-wrap items-center gap-[8px] mb-[2px]">
                        <span
                          className={`text-[13px]/[16px] line-through font-semibold tracking-tight ${
                            isStarterPopular ? "text-[#a8a8ad]" : "text-[#71717a]"
                          }`}
                        >
                          Rp {angkaRupiah(starter.price)}
                        </span>
                        <span className="text-[10px]/[12px] font-bold px-[6px] py-[2px] rounded-[4px] bg-[#e2e89d] text-[#18181a] uppercase tracking-wide">
                          Hemat {Math.round((1 - starter.effectivePrice / starter.price) * 100)}%
                        </span>
                      </div>
                    )}
                    <div
                      className={"box-border w-full h-auto shrink-0 flex flex-row flex-wrap items-baseline gap-1.5"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[12px]/[16px] box-border shrink-0 ${isStarterPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]`
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          `text-[32px]/[38px] sm:text-[36px]/[40px] xl:text-[40px]/[44px] box-border ${isStarterPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left break-words`
                        }
                        data-pencil-name={"1.000.000"}
                        data-text="true"
                      >
                        {angkaRupiah(starter?.effectivePrice)}
                      </div>
                    </div>
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isStarterPopular ? "text-[#e2e89d]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                      }
                      data-pencil-name={"Investasi awal • One-time payment"}
                      data-text="true"
                    >
                      {isStarterPopular
                        ? "Direkomendasikan untuk Efisiensi Bisnis"
                        : labelBilling(starter)}
                    </div>
                  </div>
                  <div
                    className={
                      `box-border w-full h-fit shrink-0 grid grid-cols-1 min-[340px]:grid-cols-2 gap-[10px] p-[10px] ${isStarterPopular ? "bg-[#242427]" : "bg-[#f0f0f0]"} rounded-[8px]`
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isStarterPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Revisi Gratis"}
                        data-text="true"
                      >
                        {isStarterPopular ? "Kuota Revisi Gratis" : "Revisi Gratis"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isStarterPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"2x Sesi"}
                        data-text="true"
                      >
                        {isStarterPopular
                          ? (typeof starter?.includedRevisions === "number"
                              ? `${starter.includedRevisions}x Sesi Penuh`
                              : "—")
                          : jumlahRevisi(starter?.includedRevisions)}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isStarterPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Ekstra Revisi"}
                        data-text="true"
                      >
                        {isStarterPopular ? "Biaya Ekstra Revisi" : "Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isStarterPopular ? "text-[#e2e89d]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"Rp 100.000/sesi"}
                        data-text="true"
                      >
                        {hargaRevisi(starter?.extraRevisionPrice)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isStarterPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]`
                      }
                      data-pencil-name={"SPESIFIKASI DELIVERABLE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI DELIVERABLE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <ul className="box-border w-full m-0 p-0 list-none flex flex-col gap-[6px] justify-start items-start">
                      {(starter?.features ?? []).filter(isiFitur).map((feature, index) => (
                        <PackageFeatureRow
                          key={`${feature}-${index}`}
                          icon={isStarterPopular ? "verified" : "check_circle"}
                          text={feature}
                          tone={isStarterPopular ? "dark" : "light"}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start ${isStarterPopular ? "relative [z-index:2]" : ""}`
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={`/pesan?paket=${encodeURIComponent(starter?.slug ?? "starter-umkm")}`}
                    className={
                      isStarterPopular
                        ? "box-border w-full h-[52px] shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-row gap-[7.99px] p-[14px_16px] justify-center items-center bg-[#e2e89d] rounded-[12px]"
                        : "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                    {...(isStarterPopular ? { "data-responsive": "flow" } : {})}
                  >
                    <div
                      className={
                        isStarterPopular
                          ? "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          : "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Starter"}
                      data-text="true"
                    >
                      {labelCta(starter, "Pilih Paket Starter")}
                    </div>
                    <div
                      className={
                        isStarterPopular
                          ? "text-[16px]/[24px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          : "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={isStarterPopular ? "bolt" : "arrow_forward"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {isStarterPopular ? "bolt" : "arrow_forward"}
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className={
                  isMobilePopular
                    ? `box-border w-full h-auto [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden relative ${mobileOrder} lg:-translate-y-2`
                    : `box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] ${mobileOrder}`
                }
                data-pencil-name={"div"}
              >
                {isMobilePopular && (
                  <div
                    className={
                      "box-border w-[224px] h-[224px] [filter:blur(32px)] absolute right-[-40px] top-[-96px] bg-[#e1e89c26] rounded-[50%] [z-index:0]"
                    }
                    data-pencil-name={"div"}
                  ></div>
                )}
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start ${isMobilePopular ? "relative [z-index:1]" : ""}`
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    {isMobilePopular ? (
                      <div
                        className={
                          "box-border w-fit shrink-0 h-auto flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e2e89d] rounded-[9999px]"
                        }
                        data-pencil-name={"span"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.28px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Paling Populer"}
                          data-text="true"
                        >
                          {"Paling Populer"}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                        }
                        data-pencil-name={"TIER 03 • MULTIPLATFORM"}
                        data-text="true"
                      >
                        {"TIER 03 • MULTIPLATFORM"}
                      </div>
                    )}
                    <div
                      className={
                        isMobilePopular
                          ? "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#242427] rounded-[9999px]"
                          : "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 30 Hari"}
                    >
                      <div
                        className={
                          isMobilePopular
                            ? "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            : "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {mobile
                          ? `Estimasi ${mobile.estimatedDays} Hari`
                          : "Estimasi —"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-[6px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        `text-[20px]/[26px] box-border w-full ${isMobilePopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left`
                      }
                      data-pencil-name={"Mobile Application Flutter"}
                      data-text="true"
                    >
                      {mobile?.name ?? "Mobile Application Flutter"}
                    </div>
                    <div
                      className={
                        `text-[13px]/[18px] box-border w-full h-auto shrink-0 ${isMobilePopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium text-left`
                      }
                      data-pencil-name={
                        "Aplikasi ponsel berperforma 60fps dengan"
                      }
                      data-text="true"
                    >
                      {
                        mobile?.targetMarket?.trim()
                          ? mobile.targetMarket
                          : "Aplikasi ponsel berperforma 60fps dengan kemampuan sinkronisasi offline-first."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full min-h-[72px] h-auto shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    {mobile && typeof mobile.price === "number" && mobile.effectivePrice < mobile.price && (
                      <div className="box-border w-full flex flex-row flex-wrap items-center gap-[8px] mb-[2px]">
                        <span
                          className={`text-[13px]/[16px] line-through font-semibold tracking-tight ${
                            isMobilePopular ? "text-[#a8a8ad]" : "text-[#71717a]"
                          }`}
                        >
                          Rp {angkaRupiah(mobile.price)}
                        </span>
                        <span className="text-[10px]/[12px] font-bold px-[6px] py-[2px] rounded-[4px] bg-[#e2e89d] text-[#18181a] uppercase tracking-wide">
                          Hemat {Math.round((1 - mobile.effectivePrice / mobile.price) * 100)}%
                        </span>
                      </div>
                    )}
                    <div
                      className={"box-border w-full h-auto shrink-0 flex flex-row flex-wrap items-baseline gap-1.5"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[12px]/[16px] box-border shrink-0 ${isMobilePopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]`
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          `text-[32px]/[38px] sm:text-[36px]/[40px] xl:text-[40px]/[44px] box-border ${isMobilePopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left break-words`
                        }
                        data-pencil-name={"4.500.000"}
                        data-text="true"
                      >
                        {angkaRupiah(mobile?.effectivePrice)}
                      </div>
                    </div>
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isMobilePopular ? "text-[#e2e89d]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                      }
                      data-pencil-name={"Siap rilis produksi Android"}
                      data-text="true"
                    >
                      {isMobilePopular
                        ? "Direkomendasikan untuk Efisiensi Bisnis"
                        : labelBilling(mobile)}
                    </div>
                  </div>
                  <div
                    className={
                      `box-border w-full h-fit shrink-0 grid grid-cols-1 min-[340px]:grid-cols-2 gap-[10px] p-[10px] ${isMobilePopular ? "bg-[#242427]" : "bg-[#f0f0f0]"} rounded-[8px]`
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isMobilePopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Revisi Gratis"}
                        data-text="true"
                      >
                        {isMobilePopular ? "Kuota Revisi Gratis" : "Revisi Gratis"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isMobilePopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"4x Sesi"}
                        data-text="true"
                      >
                        {isMobilePopular
                          ? (typeof mobile?.includedRevisions === "number"
                              ? `${mobile.includedRevisions}x Sesi Penuh`
                              : "—")
                          : jumlahRevisi(mobile?.includedRevisions)}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isMobilePopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Ekstra Revisi"}
                        data-text="true"
                      >
                        {isMobilePopular ? "Biaya Ekstra Revisi" : "Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isMobilePopular ? "text-[#e2e89d]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"Rp 300.000/sesi"}
                        data-text="true"
                      >
                        {hargaRevisi(mobile?.extraRevisionPrice)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isMobilePopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]`
                      }
                      data-pencil-name={"SPESIFIKASI MOBILE NATIVE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI MOBILE NATIVE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <ul className="box-border w-full m-0 p-0 list-none flex flex-col gap-[6px] justify-start items-start">
                      {(mobile?.features ?? []).filter(isiFitur).map((feature, index) => (
                        <PackageFeatureRow
                          key={`${feature}-${index}`}
                          icon={isMobilePopular ? "verified" : "check_circle"}
                          text={feature}
                          tone={isMobilePopular ? "dark" : "light"}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start ${isMobilePopular ? "relative [z-index:2]" : ""}`
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={`/pesan?paket=${encodeURIComponent(mobile?.slug ?? "mobile-application")}`}
                    className={
                      isMobilePopular
                        ? "box-border w-full h-[52px] shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-row gap-[7.99px] p-[14px_16px] justify-center items-center bg-[#e2e89d] rounded-[12px]"
                        : "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                    {...(isMobilePopular ? { "data-responsive": "flow" } : {})}
                  >
                    <div
                      className={
                        isMobilePopular
                          ? "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          : "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Mobile App"}
                      data-text="true"
                    >
                      {labelCta(mobile, "Pilih Paket Mobile App")}
                    </div>
                    <div
                      className={
                        isMobilePopular
                          ? "text-[16px]/[24px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          : "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={isMobilePopular ? "bolt" : "arrow_forward"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {isMobilePopular ? "bolt" : "arrow_forward"}
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className={
                  isInformasiPopular
                    ? `box-border w-full h-auto [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden relative ${informasiOrder} lg:-translate-y-2`
                    : `box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] ${informasiOrder}`
                }
                data-pencil-name={"div"}
              >
                {isInformasiPopular && (
                  <div
                    className={
                      "box-border w-[224px] h-[224px] [filter:blur(32px)] absolute right-[-40px] top-[-96px] bg-[#e1e89c26] rounded-[50%] [z-index:0]"
                    }
                    data-pencil-name={"div"}
                  ></div>
                )}
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start ${isInformasiPopular ? "relative [z-index:1]" : ""}`
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"div"}
                  >
                    {isInformasiPopular ? (
                      <div
                        className={
                          "box-border w-fit shrink-0 h-auto flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e2e89d] rounded-[9999px]"
                        }
                        data-pencil-name={"span"}
                        data-responsive="fixed"
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"star"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"star"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.28px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Paling Populer"}
                          data-text="true"
                        >
                          {"Paling Populer"}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                        }
                        data-pencil-name={"TIER 02 • SISTEM INFORMASI"}
                        data-text="true"
                      >
                        {"TIER 02 • SISTEM INFORMASI"}
                      </div>
                    )}
                    <div
                      className={
                        isInformasiPopular
                          ? "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#242427] rounded-[9999px]"
                          : "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                      }
                      data-pencil-name={"Estimasi 21 Hari"}
                    >
                      <div
                        className={
                          isInformasiPopular
                            ? "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            : "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                        }
                        data-text="true"
                      >
                        {informasi
                          ? `Estimasi ${informasi.estimatedDays} Hari`
                          : "Estimasi —"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-auto shrink-0 flex flex-col gap-[6px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    <div
                      className={
                        `text-[20px]/[26px] box-border w-full ${isInformasiPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left`
                      }
                      data-pencil-name={"Sistem Informasi / Instansi"}
                      data-text="true"
                    >
                      {informasi?.name ?? "Sistem Informasi / Instansi"}
                    </div>
                    <div
                      className={
                        `text-[13px]/[18px] box-border w-full h-auto shrink-0 ${isInformasiPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium text-left`
                      }
                      data-pencil-name={
                        "Solusi operasional otomatis, basis data "
                      }
                      data-text="true"
                    >
                      {
                        informasi?.targetMarket?.trim()
                          ? informasi.targetMarket
                          : "Solusi operasional otomatis, basis data relasional stabil, dan kontrol akses berjenjang."
                      }
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full min-h-[72px] h-auto shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                  >
                    {informasi && typeof informasi.price === "number" && informasi.effectivePrice < informasi.price && (
                      <div className="box-border w-full flex flex-row flex-wrap items-center gap-[8px] mb-[2px]">
                        <span
                          className={`text-[13px]/[16px] line-through font-semibold tracking-tight ${
                            isInformasiPopular ? "text-[#a8a8ad]" : "text-[#71717a]"
                          }`}
                        >
                          Rp {angkaRupiah(informasi.price)}
                        </span>
                        <span className="text-[10px]/[12px] font-bold px-[6px] py-[2px] rounded-[4px] bg-[#e2e89d] text-[#18181a] uppercase tracking-wide">
                          Hemat {Math.round((1 - informasi.effectivePrice / informasi.price) * 100)}%
                        </span>
                      </div>
                    )}
                    <div
                      className={"box-border w-full h-auto shrink-0 flex flex-row flex-wrap items-baseline gap-1.5"}
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[12px]/[16px] box-border shrink-0 ${isInformasiPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]`
                        }
                        data-pencil-name={"Rp"}
                        data-text="true"
                        data-section-padding="true"
                      >
                        {"Rp"}
                      </div>
                      <div
                        className={
                          `text-[32px]/[38px] sm:text-[36px]/[40px] xl:text-[40px]/[44px] box-border ${isInformasiPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left break-words`
                        }
                        data-pencil-name={"3.500.000"}
                        data-text="true"
                      >
                        {angkaRupiah(informasi?.effectivePrice)}
                      </div>
                    </div>
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isInformasiPopular ? "text-[#e2e89d]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                      }
                      data-pencil-name={
                        "Direkomendasikan untuk Efisiensi Bisnis"
                      }
                      data-text="true"
                    >
                      {isInformasiPopular
                        ? "Direkomendasikan untuk Efisiensi Bisnis"
                        : labelBilling(informasi)}
                    </div>
                  </div>
                  <div
                    className={
                      `box-border w-full h-fit shrink-0 grid grid-cols-1 min-[340px]:grid-cols-2 gap-[10px] p-[10px] ${isInformasiPopular ? "bg-[#242427]" : "bg-[#f0f0f0]"} rounded-[8px]`
                    }
                    data-pencil-name={"div"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isInformasiPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Kuota Revisi Gratis"}
                        data-text="true"
                      >
                        {isInformasiPopular ? "Kuota Revisi Gratis" : "Revisi Gratis"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isInformasiPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"3x Sesi Penuh"}
                        data-text="true"
                      >
                        {isInformasiPopular
                          ? (typeof informasi?.includedRevisions === "number"
                              ? `${informasi.includedRevisions}x Sesi Penuh`
                              : "—")
                          : jumlahRevisi(informasi?.includedRevisions)}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          `text-[11px]/[14px] box-border ${isInformasiPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                        }
                        data-pencil-name={"Biaya Ekstra Revisi"}
                        data-text="true"
                      >
                        {isInformasiPopular ? "Biaya Ekstra Revisi" : "Ekstra Revisi"}
                      </div>
                      <div
                        className={
                          `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isInformasiPopular ? "text-[#e2e89d]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                        }
                        data-pencil-name={"Rp 250.000/sesi"}
                        data-text="true"
                      >
                        {hargaRevisi(informasi?.extraRevisionPrice)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        `text-[11px]/[14px] box-border ${isInformasiPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]`
                      }
                      data-pencil-name={"SPESIFIKASI ARSITEKTUR CORE:"}
                      data-text="true"
                    >
                      {"SPESIFIKASI ARSITEKTUR CORE:"}
                    </div>
                    <div
                      className={"box-border w-full h-[8px] shrink-0"}
                      data-pencil-name={"spacer"}
                    ></div>
                    <ul className="box-border w-full m-0 p-0 list-none flex flex-col gap-[6px] justify-start items-start">
                      {(informasi?.features ?? []).filter(isiFitur).map((feature, index) => (
                        <PackageFeatureRow
                          key={`${feature}-${index}`}
                          icon={isInformasiPopular ? "verified" : "check_circle"}
                          text={feature}
                          tone={isInformasiPopular ? "dark" : "light"}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={
                    `box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start ${isInformasiPopular ? "relative [z-index:2]" : ""}`
                  }
                  data-pencil-name={"div"}
                  data-section-padding="true"
                >
                  <Link
                    href={`/pesan?paket=${encodeURIComponent(informasi?.slug ?? "sistem-informasi")}`}
                    className={
                      isInformasiPopular
                        ? "box-border w-full h-[52px] shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-row gap-[7.99px] p-[14px_16px] justify-center items-center bg-[#e2e89d] rounded-[12px]"
                        : "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                    }
                    data-pencil-name={"a"}
                    {...(isInformasiPopular ? { "data-responsive": "flow" } : {})}
                  >
                    <div
                      className={
                        isInformasiPopular
                          ? "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          : "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Pilih Paket Sistem Informasi"}
                      data-text="true"
                    >
                      {labelCta(informasi, "Pilih Paket Sistem Informasi")}
                    </div>
                    <div
                      className={
                        isInformasiPopular
                          ? "text-[16px]/[24px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          : "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={isInformasiPopular ? "bolt" : "arrow_forward"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {isInformasiPopular ? "bolt" : "arrow_forward"}
                    </div>
                  </Link>
                </div>
              </div>
              {extraPackages.map((pkg, idx) => {
                const isPkgPopular = Boolean(pkg.isPopular);
                return (
                  <div
                    key={pkg.slug}
                    className={
                      isPkgPopular
                        ? "box-border w-full h-auto [box-shadow:0px_20px_20px_#0000001a,_0px_8px_4px_#0000001a] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#18181a] rounded-[16px] overflow-hidden relative order-4 lg:-translate-y-2"
                        : "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 p-[24px] justify-between items-start bg-[#ffffff] rounded-[16px] order-4"
                    }
                  >
                    {isPkgPopular && (
                      <div
                        className={
                          "box-border w-[224px] h-[224px] [filter:blur(32px)] absolute right-[-40px] top-[-96px] bg-[#e1e89c26] rounded-[50%] [z-index:0]"
                        }
                        data-pencil-name={"div"}
                      ></div>
                    )}
                    <div
                      className={
                        `box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start ${isPkgPopular ? "relative [z-index:1]" : ""}`
                      }
                    >
                      <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-2 justify-between items-center">
                        {isPkgPopular ? (
                          <div
                            className={
                              "box-border w-fit shrink-0 h-auto flex flex-row gap-[6px] p-[4px_12px] justify-start items-center bg-[#e2e89d] rounded-[9999px]"
                            }
                            data-pencil-name={"span"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"star"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"star"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.28px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Paling Populer"}
                              data-text="true"
                            >
                              {"Paling Populer"}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left">
                            {`TIER 0${idx + 4} • PAKET LAYANAN`}
                          </div>
                        )}
                        <div
                          className={
                            isPkgPopular
                              ? "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_10px] justify-center items-start bg-[#242427] rounded-[9999px]"
                              : "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[9999px]"
                          }
                        >
                          <div
                            className={
                              isPkgPopular
                                ? "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                : "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                          >
                            {`Estimasi ${pkg.estimatedDays} Hari`}
                          </div>
                        </div>
                      </div>
                      <div className="box-border w-full h-auto shrink-0 flex flex-col gap-[6px] justify-start items-start">
                        <div
                          className={
                            `text-[20px]/[26px] box-border w-full ${isPkgPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left`
                          }
                        >
                          {pkg.name}
                        </div>
                        <div
                          className={
                            `text-[13px]/[18px] box-border w-full h-auto shrink-0 ${isPkgPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium text-left`
                          }
                        >
                          {pkg.targetMarket?.trim() || "Solusi perangkat lunak kustom terukur."}
                        </div>
                      </div>
                      <div className="box-border w-full min-h-[72px] h-auto shrink-0 flex flex-col gap-[4px] p-[8px_0px_0px_0px] justify-start items-start">
                        {typeof pkg.price === "number" && pkg.effectivePrice < pkg.price && (
                          <div className="box-border w-full flex flex-row flex-wrap items-center gap-[8px] mb-[2px]">
                            <span
                              className={`text-[13px]/[16px] line-through font-semibold tracking-tight ${
                                isPkgPopular ? "text-[#a8a8ad]" : "text-[#71717a]"
                              }`}
                            >
                              Rp {angkaRupiah(pkg.price)}
                            </span>
                            <span className="text-[10px]/[12px] font-bold px-[6px] py-[2px] rounded-[4px] bg-[#e2e89d] text-[#18181a] uppercase tracking-wide">
                              Hemat {Math.round((1 - pkg.effectivePrice / pkg.price) * 100)}%
                            </span>
                          </div>
                        )}
                        <div className="box-border w-full h-auto shrink-0 flex flex-row flex-wrap items-baseline gap-1.5">
                          <div
                            className={
                              `text-[12px]/[16px] box-border shrink-0 ${isPkgPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]`
                            }
                          >
                            {"Rp"}
                          </div>
                          <div
                            className={
                              `text-[32px]/[38px] sm:text-[36px]/[40px] xl:text-[40px]/[44px] box-border ${isPkgPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left break-words`
                            }
                          >
                            {angkaRupiah(pkg.effectivePrice)}
                          </div>
                        </div>
                        <div
                          className={
                            `text-[11px]/[14px] box-border ${isPkgPopular ? "text-[#e2e89d]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                          }
                        >
                          {isPkgPopular ? "Direkomendasikan untuk Efisiensi Bisnis" : labelBilling(pkg)}
                        </div>
                      </div>
                      <div
                        className={
                          `box-border w-full h-fit shrink-0 grid grid-cols-1 min-[340px]:grid-cols-2 gap-[10px] p-[10px] ${isPkgPopular ? "bg-[#242427]" : "bg-[#f0f0f0]"} rounded-[8px]`
                        }
                      >
                        <div className="box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start">
                          <div
                            className={
                              `text-[11px]/[14px] box-border ${isPkgPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                            }
                          >
                            {isPkgPopular ? "Kuota Revisi Gratis" : "Revisi Gratis"}
                          </div>
                          <div
                            className={
                              `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isPkgPopular ? "text-[#ffffff]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                            }
                          >
                            {isPkgPopular
                              ? (typeof pkg.includedRevisions === "number"
                                  ? `${pkg.includedRevisions}x Sesi Penuh`
                                  : "—")
                              : jumlahRevisi(pkg.includedRevisions)}
                          </div>
                        </div>
                        <div className="box-border min-w-0 h-auto flex flex-col gap-0 justify-start items-start">
                          <div
                            className={
                              `text-[11px]/[14px] box-border ${isPkgPopular ? "text-[#a8a8ad]" : "text-[#52525b]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left`
                            }
                          >
                            {isPkgPopular ? "Biaya Ekstra Revisi" : "Ekstra Revisi"}
                          </div>
                          <div
                            className={
                              `text-[15px]/[20px] sm:text-[16px]/[20px] box-border ${isPkgPopular ? "text-[#e2e89d]" : "text-[#18181a]"} font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left`
                            }
                          >
                            {hargaRevisi(pkg.extraRevisionPrice)}
                          </div>
                        </div>
                      </div>
                      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[8px_0px_0px_0px] justify-start items-start">
                        <div
                          className={
                            `text-[11px]/[14px] box-border ${isPkgPopular ? "text-[#a8a8ad]" : "text-[#595962]"} font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]`
                          }
                        >
                          {"SPESIFIKASI DELIVERABLE:"}
                        </div>
                        <div className="box-border w-full h-[8px] shrink-0" />
                        <ul className="box-border w-full m-0 p-0 list-none flex flex-col gap-[6px] justify-start items-start">
                          {(pkg.features ?? []).filter(isiFitur).map((feature, index) => (
                            <PackageFeatureRow
                              key={`${feature}-${index}`}
                              icon={isPkgPopular ? "verified" : "check_circle"}
                              text={feature}
                              tone={isPkgPopular ? "dark" : "light"}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div
                      className={
                        `box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[24px_0px_0px_0px] justify-start items-start ${isPkgPopular ? "relative [z-index:2]" : ""}`
                      }
                    >
                      <Link
                        href={`/pesan?paket=${encodeURIComponent(pkg.slug)}`}
                        className={
                          isPkgPopular
                            ? "box-border w-full h-[52px] shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-row gap-[7.99px] p-[14px_16px] justify-center items-center bg-[#e2e89d] rounded-[12px]"
                            : "box-border w-full h-[48px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_16px] justify-center items-center bg-[#18181a] rounded-[12px]"
                        }
                      >
                        <div
                          className={
                            isPkgPopular
                              ? "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                              : "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                        >
                          {labelCta(pkg, `Pilih ${pkg.name}`)}
                        </div>
                        <div
                          className={
                            isPkgPopular
                              ? "text-[16px]/[24px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              : "text-[16px]/[24px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          aria-hidden="true"
                        >
                          {isPkgPopular ? "bolt" : "arrow_forward"}
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch py-2"
              }
              data-pencil-name={"section"}
            >
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"timer"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"timer"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-1 min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                    }
                    data-pencil-name={"Timeline Presisi"}
                    data-text="true"
                  >
                    {"Timeline Presisi"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Siklus sprint terpantau via portal live-"
                    }
                    data-text="true"
                  >
                    {
                      "Siklus sprint terpantau via portal live-tracking real-time."
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
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
                    "box-border flex-1 min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                    }
                    data-pencil-name={"Kepemilikan Penuh"}
                    data-text="true"
                  >
                    {"Kepemilikan Penuh"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Seluruh source code repository diserahte"
                    }
                    data-text="true"
                  >
                    {
                      "Seluruh source code repository diserahterimakan seutuhnya."
                    }
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-auto flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-[48px] shrink-0 h-[48px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 justify-center items-center bg-[#ffffff] rounded-[8px]"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[24px]/[32px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"support_agent"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"support_agent"}
                  </div>
                </div>
                <div
                  className={
                    "box-border flex-1 min-w-0 h-auto flex flex-col gap-0 justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <div
                    className={
                      "text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                    }
                    data-pencil-name={"Konsultasi Teknis"}
                    data-text="true"
                  >
                    {"Konsultasi Teknis"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                    }
                    data-pencil-name={
                      "Dukungan arsitektur langsung oleh Senior"
                    }
                    data-text="true"
                  >
                    {
                      "Dukungan arsitektur langsung oleh Senior System Specialist."
                    }
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[20px] p-4 sm:p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
              }
              data-pencil-name={"section"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-start sm:items-end"
                }
                data-pencil-name={"div"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-full sm:w-fit sm:shrink-0 min-w-0 flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                    }
                    data-pencil-name={"FLEKSIBILITAS SKALABILITAS"}
                    data-text="true"
                  >
                    {"FLEKSIBILITAS SKALABILITAS"}
                  </div>
                  <h2
                    className={
                      "text-[22px]/[28px] sm:text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left m-0"
                    }
                    data-pencil-name={"Katalog Add-on Layanan Tambahan"}
                    data-text="true"
                    data-heading="true"
                  >
                    {"Katalog Add-on Layanan Tambahan"}
                  </h2>
                </div>
                <div
                  className={
                    "text-[13px]/[18px] box-border max-w-[420px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-pencil-name={"Tingkatkan kapabilitas sistem Anda sesua"}
                  data-text="true"
                >
                  {
                    "Tingkatkan kapabilitas sistem Anda sesuai kebutuhan operasional dan ketersediaan sumber daya internal."
                  }
                </div>
              </div>

              <div className="box-border w-full md:overflow-x-auto">
                <div
                  className={
                    "box-border w-full min-w-0 flex flex-col gap-3 md:gap-0 justify-start items-start"
                  }
                  data-pencil-name={"table"}
                  role="table"
                >
                  <div
                    className={
                      "box-border hidden md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] w-full gap-0 items-center bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={"tr"}
                  >
                    <div
                      className={
                        "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-[12px_16px] justify-center items-start rounded-[8px_0px_0px_8px]"
                      }
                      data-pencil-name={"LAYANAN TAMBAHAN"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left"
                        }
                        data-text="true"
                      >
                        {"LAYANAN TAMBAHAN"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-[12px_16px] justify-center items-start"
                      }
                      data-pencil-name={"CAKUPAN TEKNIS & DESKRIPSI PEKERJAAN"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left"
                        }
                        data-text="true"
                      >
                        {"CAKUPAN TEKNIS & DESKRIPSI PEKERJAAN"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-[12px_16px] justify-center items-start"
                      }
                      data-pencil-name={"INVESTASI"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left"
                        }
                        data-text="true"
                      >
                        {"INVESTASI"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-[12px_16px] justify-center items-end rounded-[0px_8px_8px_0px]"
                      }
                      data-pencil-name={"TINDAKAN"}
                    >
                      <div
                        className={
                          "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-right"
                        }
                        data-text="true"
                      >
                        {"TINDAKAN"}
                      </div>
                    </div>
                  </div>
                  {addons.length > 0 ? (
                    <div
                      className="box-border w-full flex flex-col gap-3 md:gap-0 justify-start items-start"
                      data-pencil-name="tbody"
                    >
                      {addons.map((addon, idx) => (
                        <div
                          key={`${addon.name}-${idx}`}
                          className={`box-border w-full flex flex-col gap-3 p-4 rounded-[12px] bg-[#fafafa] border border-[#e4e4e7]/80 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] md:gap-0 md:items-center ${idx < addons.length - 1 ? "md:border-b md:border-[#f0f0f0]" : ""} md:py-1`}
                        >
                          <div className="box-border w-full min-w-0 h-fit flex flex-row gap-[10px] p-0 md:p-[16px_12px] justify-start items-center">
                            <div className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]">
                              <span
                                className="text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                aria-hidden="true"
                              >
                                {addon.billingType === "yearly"
                                  ? "workspace_premium"
                                  : addon.billingType === "monthly"
                                    ? "build"
                                    : "dns"}
                              </span>
                            </div>
                            <span className="text-[13px]/[18px] box-border min-w-0 flex-1 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left">
                              {addon.name}
                            </span>
                          </div>
                          <div className="box-border w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start">
                            <p className="text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left m-0">
                              {addon.description}
                            </p>
                          </div>
                          <div className="box-border flex flex-wrap items-center justify-between gap-3 w-full pt-3 border-t border-[#e4e4e7]/70 md:contents">
                            <div className="box-border w-fit md:w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start">
                              <div className="text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]">
                                {rupiah(addon.price)}
                              </div>
                              <div className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left">
                                {labelAddonBilling(addon.billingType)}
                              </div>
                            </div>
                            <div className="box-border w-fit md:w-full h-fit flex flex-row p-0 md:p-[16px_12px] justify-end items-center">
                              <Link
                                href="/pesan"
                                className="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[8px] transition-colors"
                              >
                                <span className="text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]">
                                  {"Pilih Add-on"}
                                </span>
                                <span
                                  className="text-[14px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                                  aria-hidden="true"
                                >
                                  {"add"}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <DataRows
                    texts={[
                      "build    Maintenance Bulanan      Pemantauan proaktif, penanganan bug fixing operasional, automated database backup berkala, dan update library minor.     Rp 150.000   / bulan      Pilih Add-on   add",
                      "workspace_premium     Maintenance Tahunan    Hemat 17%        Semua fitur paket bulanan ditambah jalur prioritas penanganan insiden 24/7, review keamanan per kuartal, dan alokasi resource siaga.     Rp 1.500.000   / tahun      Pilih Add-on   add",
                      "cast_for_education    Pelatihan Admin & Operator      Sesi pelatihan interaktif komprehensif selama 2 jam (Google Meet/Zoom), simulasi skenario riil, panduan booklet PDF, & rekaman video.     Rp 250.000   / sesi transfer ilmu      Pilih Add-on   add",
                      "dns    Setup Domain & Cloud Server      Penyusunan arsitektur Docker containerized pada cloud provider (Render / VPS Ubuntu), konfigurasi SSL/TLS, edge caching, & Cloudflare firewall.     Rp 200.000   / instalasi setup      Pilih Add-on   add",
                    ]}
                    className={
                      "box-border w-full flex flex-col gap-3 md:gap-0 justify-start items-start"
                    }
                    data-pencil-name={"tbody"}
                  >
                    <div
                      className={
                        "box-border w-full flex flex-col gap-3 p-4 rounded-[12px] bg-[#fafafa] border border-[#e4e4e7]/80 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] md:gap-0 md:items-center md:border-b md:border-[#f0f0f0] md:py-1"
                      }
                      data-pencil-name={"tr"}
                    >
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-row gap-[10px] p-0 md:p-[16px_12px] justify-start items-center"
                        }
                        data-pencil-name={"td"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <span
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"build"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"build"}
                          </span>
                        </div>
                        <span
                          className={
                            "text-[13px]/[18px] box-border min-w-0 flex-1 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Maintenance Bulanan"}
                          data-text="true"
                        >
                          {"Maintenance Bulanan"}
                        </span>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                        }
                        data-pencil-name={
                          "Pemantauan proaktif, penanganan bug fixi"
                        }
                      >
                        <p
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left m-0"
                          }
                          data-text="true"
                        >
                          {
                            "Pemantauan proaktif, penanganan bug fixing operasional, automated database backup berkala, dan update library minor."
                          }
                        </p>
                      </div>
                      <div className="box-border flex flex-wrap items-center justify-between gap-3 w-full pt-3 border-t border-[#e4e4e7]/70 md:contents">
                        <div
                          className={
                            "box-border w-fit md:w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Rp 150.000"}
                            data-text="true"
                          >
                            {"Rp 150.000"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"/ bulan"}
                            data-text="true"
                          >
                            {"/ bulan"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit md:w-full h-fit flex flex-row p-0 md:p-[16px_12px] justify-end items-center"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"Pilih Add-on"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[8px] transition-colors"
                            }
                            data-pencil-name={"a"}
                          >
                            <span
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]"
                              }
                              data-pencil-name={"Pilih Add-on"}
                              data-text="true"
                            >
                              {"Pilih Add-on"}
                            </span>
                            <span
                              className={
                                "text-[14px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"add"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"add"}
                            </span>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full flex flex-col gap-3 p-4 rounded-[12px] bg-[#fafafa] border border-[#e4e4e7]/80 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] md:gap-0 md:items-center md:border-b md:border-[#f0f0f0] md:py-1"
                      }
                      data-pencil-name={"tr"}
                    >
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-row gap-[10px] p-0 md:p-[16px_12px] justify-start items-center"
                        }
                        data-pencil-name={"td"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <span
                            className={
                              "text-[16px]/[24px] box-border text-[#5d6226] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"workspace_premium"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"workspace_premium"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
                          <span
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                            }
                            data-pencil-name={"Maintenance Tahunan"}
                            data-text="true"
                          >
                            {"Maintenance Tahunan"}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#e2e89d] rounded text-[10px] font-bold text-[#1b1d00]">
                            {"Hemat 17%"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                        }
                        data-pencil-name={
                          "Semua fitur paket bulanan ditambah jalur"
                        }
                      >
                        <p
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left m-0"
                          }
                          data-text="true"
                        >
                          {
                            "Semua fitur paket bulanan ditambah jalur prioritas penanganan insiden 24/7, review keamanan per kuartal, dan alokasi resource siaga."
                          }
                        </p>
                      </div>
                      <div className="box-border flex flex-wrap items-center justify-between gap-3 w-full pt-3 border-t border-[#e4e4e7]/70 md:contents">
                        <div
                          className={
                            "box-border w-fit md:w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Rp 1.500.000"}
                            data-text="true"
                          >
                            {"Rp 1.500.000"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"/ tahun"}
                            data-text="true"
                          >
                            {"/ tahun"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit md:w-full h-fit flex flex-row p-0 md:p-[16px_12px] justify-end items-center"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"Pilih Add-on"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[8px] transition-colors"
                            }
                            data-pencil-name={"a"}
                          >
                            <span
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]"
                              }
                              data-pencil-name={"Pilih Add-on"}
                              data-text="true"
                            >
                              {"Pilih Add-on"}
                            </span>
                            <span
                              className={
                                "text-[14px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"add"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"add"}
                            </span>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full flex flex-col gap-3 p-4 rounded-[12px] bg-[#fafafa] border border-[#e4e4e7]/80 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] md:gap-0 md:items-center md:border-b md:border-[#f0f0f0] md:py-1"
                      }
                      data-pencil-name={"tr"}
                    >
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-row gap-[10px] p-0 md:p-[16px_12px] justify-start items-center"
                        }
                        data-pencil-name={"td"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <span
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"cast_for_education"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"cast_for_education"}
                          </span>
                        </div>
                        <span
                          className={
                            "text-[13px]/[18px] box-border min-w-0 flex-1 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Pelatihan Admin & Operator"}
                          data-text="true"
                        >
                          {"Pelatihan Admin & Operator"}
                        </span>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                        }
                        data-pencil-name={
                          "Sesi pelatihan interaktif komprehensif s"
                        }
                      >
                        <p
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left m-0"
                          }
                          data-text="true"
                        >
                          {
                            "Sesi pelatihan interaktif komprehensif selama 2 jam (Google Meet/Zoom), simulasi skenario riil, panduan booklet PDF, & rekaman video."
                          }
                        </p>
                      </div>
                      <div className="box-border flex flex-wrap items-center justify-between gap-3 w-full pt-3 border-t border-[#e4e4e7]/70 md:contents">
                        <div
                          className={
                            "box-border w-fit md:w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Rp 250.000"}
                            data-text="true"
                          >
                            {"Rp 250.000"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"/ sesi transfer ilmu"}
                            data-text="true"
                          >
                            {"/ sesi transfer ilmu"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit md:w-full h-fit flex flex-row p-0 md:p-[16px_12px] justify-end items-center"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"Pilih Add-on"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[8px] transition-colors"
                            }
                            data-pencil-name={"a"}
                          >
                            <span
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]"
                              }
                              data-pencil-name={"Pilih Add-on"}
                              data-text="true"
                            >
                              {"Pilih Add-on"}
                            </span>
                            <span
                              className={
                                "text-[14px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"add"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"add"}
                            </span>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full flex flex-col gap-3 p-4 rounded-[12px] bg-[#fafafa] border border-[#e4e4e7]/80 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_125px_125px] lg:grid-cols-[260px_minmax(0,1fr)_140px_130px] md:gap-0 md:items-center md:py-1"
                      }
                      data-pencil-name={"tr"}
                    >
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-row gap-[10px] p-0 md:p-[16px_12px] justify-start items-center"
                        }
                        data-pencil-name={"td"}
                      >
                        <div
                          className={
                            "box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[6px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <span
                            className={
                              "text-[16px]/[24px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"dns"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"dns"}
                          </span>
                        </div>
                        <span
                          className={
                            "text-[13px]/[18px] box-border min-w-0 flex-1 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left"
                          }
                          data-pencil-name={"Setup Domain & Cloud Server"}
                          data-text="true"
                        >
                          {"Setup Domain & Cloud Server"}
                        </span>
                      </div>
                      <div
                        className={
                          "box-border w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                        }
                        data-pencil-name={
                          "Penyusunan arsitektur Docker containeriz"
                        }
                      >
                        <p
                          className={
                            "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left m-0"
                          }
                          data-text="true"
                        >
                          {
                            "Penyusunan arsitektur Docker containerized pada cloud provider (Render / VPS Ubuntu), konfigurasi SSL/TLS, edge caching, & Cloudflare firewall."
                          }
                        </p>
                      </div>
                      <div className="box-border flex flex-wrap items-center justify-between gap-3 w-full pt-3 border-t border-[#e4e4e7]/70 md:contents">
                        <div
                          className={
                            "box-border w-fit md:w-full min-w-0 h-fit flex flex-col gap-0 p-0 md:p-[16px_12px] justify-center items-start"
                          }
                          data-pencil-name={"td"}
                        >
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Rp 200.000"}
                            data-text="true"
                          >
                            {"Rp 200.000"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                            }
                            data-pencil-name={"/ instalasi setup"}
                            data-text="true"
                          >
                            {"/ instalasi setup"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit md:w-full h-fit flex flex-row p-0 md:p-[16px_12px] justify-end items-center"
                          }
                          data-pencil-name={"td"}
                        >
                          <UiAction
                            label={"Pilih Add-on"}
                            className={
                              "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] p-[6px_12px] justify-center items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[8px] transition-colors"
                            }
                            data-pencil-name={"a"}
                          >
                            <span
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-right [white-space:nowrap]"
                              }
                              data-pencil-name={"Pilih Add-on"}
                              data-text="true"
                            >
                              {"Pilih Add-on"}
                            </span>
                            <span
                              className={
                                "text-[14px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-right [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"add"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"add"}
                            </span>
                          </UiAction>
                        </div>
                      </div>
                    </div>
                  </DataRows>
                  )}
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-4 sm:p-[24px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
              }
              data-pencil-name={"section"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full max-w-[768px] h-auto flex flex-col gap-[6px] pt-[4px] justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left"
                  }
                  data-pencil-name={"KEPASTIAN REGULASI KERJA"}
                  data-text="true"
                >
                  {"KEPASTIAN REGULASI KERJA"}
                </div>
                <h2
                  className={
                    "text-[22px]/[28px] sm:text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left m-0"
                  }
                  data-pencil-name={"Kebijakan Revisi & Standar Garansi Bug 3"}
                  data-text="true"
                  data-heading="true"
                >
                  {"Kebijakan Revisi & Standar Garansi Bug 30 Hari"}
                </h2>
                <div
                  className={
                    "text-[14px]/[20px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-pencil-name={"Proses rekayasa perangkat lunak mengacu "}
                  data-text="true"
                >
                  {
                    "Proses rekayasa perangkat lunak mengacu pada batasan ruang lingkup kerja (Scope of Work) yang disepakati guna mencegah terjadinya scope creep dan memastikan ketepatan jadwal rilis."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-stretch"
                }
                data-pencil-name={"div"}
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col justify-between gap-[12px] p-4 sm:p-[20px] items-start bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div className="box-border w-full flex flex-col gap-[12px] items-start">
                    <div
                      className={
                        "box-border w-full min-h-[32px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-start sm:items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[24px]/[32px] box-border shrink-0 text-[#f97316] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"published_with_changes"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"published_with_changes"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border flex-1 min-w-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                        }
                        data-pencil-name={"Kerangka Kuota Revisi"}
                        data-text="true"
                      >
                        {"Kerangka Kuota Revisi"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[13px]/[21px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Satu sesi revisi didefinisikan sebagai 1"
                      }
                      data-text="true"
                    >
                      {
                        "Satu sesi revisi didefinisikan sebagai 1 batch dokumen feedback yang memuat daftar perbaikan minor. Modifikasi yang tercakup dalam revisi meliputi:"
                      }
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                      }
                      data-pencil-name={"ul"}
                    >
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"•"}
                          data-text="true"
                        >
                          {"•"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Penyesuaian tata letak (layout), tipogra"
                          }
                          data-text="true"
                        >
                          {
                            "Penyesuaian tata letak (layout), tipografi, dan skema warna tanpa merombak wireframe inti."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"•"}
                          data-text="true"
                        >
                          {"•"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Penggantian aset grafis, teks/konten (co"
                          }
                          data-text="true"
                        >
                          {
                            "Penggantian aset grafis, teks/konten (copywriting), dan label interaktif antarmuka."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"•"}
                          data-text="true"
                        >
                          {"•"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Validasi field form dan responsivitas el"
                          }
                          data-text="true"
                        >
                          {
                            "Validasi field form dan responsivitas elemen pada viewport perangkat spesifik."
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[10px] justify-center items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={
                      "Catatan: Perubahan logika bisnis fundame"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Catatan: Perubahan logika bisnis fundamental atau penambahan modul di luar perjanjian awal dihitung sebagai Change Request (CR) terpisah."
                      }
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-auto [box-shadow:0px_1px_2px_#0000000d] flex flex-col justify-between gap-[12px] p-4 sm:p-[20px] items-start bg-[#ffffff] rounded-[12px]"
                  }
                  data-pencil-name={"div"}
                  data-responsive="flow"
                  data-section-padding="true"
                >
                  <div className="box-border w-full flex flex-col gap-[12px] items-start">
                    <div
                      className={
                        "box-border w-full min-h-[32px] h-auto shrink-0 flex flex-row gap-[8px] justify-start items-start sm:items-center"
                      }
                      data-pencil-name={"div"}
                    >
                      <div
                        className={
                          "text-[24px]/[32px] box-border shrink-0 text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"verified_user"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"verified_user"}
                      </div>
                      <div
                        className={
                          "text-[18px]/[24px] box-border flex-1 min-w-0 text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left"
                        }
                        data-pencil-name={"Klausul Garansi Purna Jual 30 Hari"}
                        data-text="true"
                      >
                        {"Klausul Garansi Purna Jual 30 Hari"}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[13px]/[21px] box-border w-full h-auto text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                      }
                      data-pencil-name={
                        "Terhitung sejak penandatanganan Berita A"
                      }
                      data-text="true"
                    >
                      {
                        "Terhitung sejak penandatanganan Berita Acara Serah Terima (BAST) dan perilisan ke environment production, klien terlindungi klausul perlindungan teknis mutlak:"
                      }
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                      }
                      data-pencil-name={"ul"}
                    >
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"✓"}
                          data-text="true"
                        >
                          {"✓"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Perbaikan 100% bebas biaya untuk anomali"
                          }
                          data-text="true"
                        >
                          {
                            "Perbaikan 100% bebas biaya untuk anomali, crash, query timeout, atau error fungsional yang tidak sesuai spesifikasi."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"✓"}
                          data-text="true"
                        >
                          {"✓"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Respon SLA darurat maksimal 4 jam untuk "
                          }
                          data-text="true"
                        >
                          {
                            "Respon SLA darurat maksimal 4 jam untuk insiden server fatal (down/unresponsive)."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-auto flex flex-row gap-[8px] justify-start items-start"
                        }
                        data-pencil-name={"li"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border shrink-0 text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"✓"}
                          data-text="true"
                        >
                          {"✓"}
                        </div>
                        <div
                          className={
                            "text-[13px]/[18px] box-border flex-1 min-w-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                          }
                          data-pencil-name={
                            "Audit integritas data dan backup snapsho"
                          }
                          data-text="true"
                        >
                          {
                            "Audit integritas data dan backup snapshot mingguan selama periode masa garansi aktif."
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[10px] justify-center items-start bg-[#f0f0f0] rounded-[8px]"
                    }
                    data-pencil-name={
                      "Syarat Garansi: Berlaku selama source co"
                    }
                  >
                    <div
                      className={
                        "text-[12px]/[16px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                      }
                      data-text="true"
                    >
                      {
                        "Syarat Garansi: Berlaku selama source code tidak dimodifikasi oleh pihak ketiga tanpa otorisasi tertulis pengembang."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={
                "box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] p-5 sm:p-[24px] justify-between items-start lg:items-center bg-[#18181a] rounded-[12px]"
              }
              data-pencil-name={"section"}
              data-section-padding="true"
            >
              <div
                className={
                  "box-border w-full lg:flex-1 lg:max-w-[576px] min-w-0 h-auto flex flex-col gap-0 pt-[4px] justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.55px] text-left"
                  }
                  data-pencil-name={"KUSTOMISASI SKALA ENTERPRISE"}
                  data-text="true"
                >
                  {"KUSTOMISASI SKALA ENTERPRISE"}
                </div>
                <div
                  className={"box-border w-full h-[6px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[20px]/[26px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left"
                  }
                  data-pencil-name={"Butuh arsitektur khusus di luar paket st"}
                  data-text="true"
                >
                  {"Butuh arsitektur khusus di luar paket standar?"}
                </div>
                <div
                  className={"box-border w-full h-[4px] shrink-0"}
                  data-pencil-name={"spacer"}
                ></div>
                <div
                  className={
                    "text-[13px]/[18px] box-border w-full h-auto text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                  }
                  data-pencil-name={"Konsultasikan kebutuhan infrastruktur mi"}
                  data-text="true"
                >
                  {
                    "Konsultasikan kebutuhan infrastruktur microservices, migrasi database legacy, atau arsitektur multi-tenant dengan estimasi transparan."
                  }
                </div>
              </div>
              <div
                className={
                  "box-border w-full lg:w-fit shrink-0 h-fit flex flex-col sm:flex-row flex-wrap gap-[8px] justify-start sm:justify-end items-stretch sm:items-center"
                }
                data-pencil-name={"div"}
              >
                <a
                  href={whatsappUrl}
                  target={whatsappDigits ? "_blank" : undefined}
                  rel={whatsappDigits ? "noopener noreferrer" : undefined}
                  className={
                    "box-border w-full sm:w-fit shrink-0 min-h-[48px] sm:h-[52px] [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[12px_20px] justify-center sm:justify-start items-center bg-[#242427] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"chat"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"chat"}
                  </div>
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Diskusi via WhatsApp"}
                    data-text="true"
                  >
                    {"Diskusi via WhatsApp"}
                  </div>
                </a>
                <Link
                  href={"/konsultasi"}
                  className={
                    "box-border w-full sm:w-fit shrink-0 min-h-[48px] sm:h-[52px] [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[12px_20px] justify-center sm:justify-start items-center bg-[#e2e89d] rounded-[12px]"
                  }
                  data-pencil-name={"a"}
                  data-responsive="flow"
                >
                  <div
                    className={
                      "text-[13px]/[18px] box-border text-[#1b1d00] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left"
                    }
                    data-pencil-name={"Isi Form Spesifikasi Kustom"}
                    data-text="true"
                  >
                    {"Isi Form Spesifikasi Kustom"}
                  </div>
                  <div
                    className={
                      "text-[18px]/[28px] box-border text-[#1b1d00] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"arrow_forward"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"arrow_forward"}
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </main>
        <PublicFooter settings={catalog?.settings} />
      </div>
    </ScreenState>
  );
}
