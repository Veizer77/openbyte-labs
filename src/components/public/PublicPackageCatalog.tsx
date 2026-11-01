import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { PublicAddonsSection } from "./PublicContentSections";
import { rupiah } from "@/lib/format";
import type { PublicCatalog } from "@/lib/server/public-catalog";

export function PublicPackageCatalog({
  catalog,
}: {
  catalog: PublicCatalog;
}) {
  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen">
      <PublicHeader settings={catalog.settings} />
      <main
        id="konten"
        className="box-border w-full flex-1 flex flex-col pt-[72px] pb-16 justify-start items-center bg-[#ffffff] relative"
      >
        <div className="box-border w-full max-w-[1440px] 2xl:max-w-[1600px] flex flex-col gap-8 px-4 sm:px-6 lg:px-8 justify-start items-stretch">
          {/* Header Section */}
          <section className="box-border w-full flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end py-2">
            <div className="box-border w-full max-w-[672px] flex flex-col gap-1 justify-start items-start">
              <div className="box-border w-fit flex flex-row gap-2 p-[4px_10px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]">
                <span className="w-2 h-2 rounded-full bg-[#82b440]" />
                <span className="text-[11px]/[14px] text-[#52525b] font-medium tracking-[0.55px]">
                  KATALOG RESMI &amp; PENAWARAN TERSTANDAR
                </span>
              </div>
              <h1 className="text-[28px]/[36px] sm:text-[34px]/[42px] text-[#18181a] font-semibold tracking-[-0.7px] m-0 mt-2">
                Pilihan Paket Layanan &amp; Investasi Sistem
              </h1>
              <p className="text-[14px]/[22px] text-[#52525b] font-normal m-0 mt-1 max-w-2xl">
                Transparansi spesifikasi teknis, estimasi waktu kerja terukur, serta kuota revisi definitif tanpa biaya tersembunyi. Didukung standar arsitektur modular dan audit keamanan.
              </p>
            </div>

            {/* Guarantee / SLA Badges */}
            <div className="box-border w-fit shrink-0 flex flex-row gap-3 justify-start items-center">
              <div className="box-border flex flex-row gap-2.5 p-[10px_14px] justify-start items-center bg-[#f0f0f0] rounded-[12px] shadow-[0px_1px_2px_#0000000d]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl text-[#82b440] symbol">
                  verified_user
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px]/[14px] text-[#52525b] font-medium tracking-[0.22px]">
                    Garansi Purna Jual
                  </span>
                  <span className="text-[14px]/[18px] text-[#18181a] font-semibold">
                    30 Hari Bug-Free
                  </span>
                </div>
              </div>
              <div className="box-border flex flex-row gap-2.5 p-[10px_14px] justify-start items-center bg-[#f0f0f0] rounded-[12px] shadow-[0px_1px_2px_#0000000d]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl text-[#5d6226] symbol">
                  contract_edit
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px]/[14px] text-[#52525b] font-medium tracking-[0.22px]">
                    Legalitas Kerja
                  </span>
                  <span className="text-[14px]/[18px] text-[#18181a] font-semibold">
                    SLA &amp; SPK Resmi
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Packages Bento Grid */}
          {catalog.packages.length ? (
            <section
              aria-label="Pilihan paket layanan"
              className="box-border w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-2"
            >
              {catalog.packages.map((pkg, index) => {
                const isPopular = pkg.isPopular;
                const tierNumber = String(index + 1).padStart(2, "0");

                return (
                  <article
                    key={pkg.id}
                    className={`box-border w-full flex flex-col justify-between p-6 rounded-[16px] shadow-[0px_1px_2px_#0000000d] relative transition-all ${
                      isPopular
                        ? "bg-[#fbfcf3] border-2 border-[#aeb768] shadow-[0px_8px_24px_#0000000f]"
                        : "bg-[#ffffff] border border-neutral-200/80"
                    }`}
                  >
                    {isPopular ? (
                      <div className="absolute -top-3.5 left-6 px-3 py-1 bg-[#18181a] text-[#e2e89d] text-[10px] font-bold tracking-[1px] uppercase rounded-full">
                        REKOMENDASI ARSITEKTUR
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-4">
                      {/* Tier kicker & estimate badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold tracking-[0.55px] text-[#595962] uppercase">
                          TIER {tierNumber} • {pkg.name.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#f0f0f0] text-[#52525b] text-[11px] font-medium rounded-full">
                          Estimasi {pkg.estimatedDays} Hari
                        </span>
                      </div>

                      {/* Package title & target market */}
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[22px]/[28px] font-semibold text-[#18181a] tracking-[-0.3px] m-0">
                          {pkg.name}
                        </h2>
                        {pkg.targetMarket ? (
                          <p className="text-[13px]/[19px] text-[#52525b] m-0">
                            {pkg.targetMarket}
                          </p>
                        ) : null}
                      </div>

                      {/* Pricing block */}
                      <div className="p-4 bg-[#f4f4f5]/60 rounded-[12px] flex flex-col gap-1">
                        {pkg.effectivePrice < pkg.price ? (
                          <span className="text-xs text-[#71717a] line-through">
                            {rupiah(pkg.price)}
                          </span>
                        ) : null}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[28px]/[34px] font-bold text-[#18181a] tracking-[-0.5px]">
                            {pkg.billingType === "custom" ? "Hubungi Kami" : rupiah(pkg.effectivePrice)}
                          </span>
                          {pkg.billingType === "subscription_yearly" ? (
                            <span className="text-xs text-[#71717a]">/ tahun</span>
                          ) : (
                            <span className="text-[11px] text-[#71717a]">/ proyek</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#52525b]">
                          {pkg.billingType === "custom"
                            ? "Sesuai kompleksitas & ruang lingkup kerja"
                            : "Investasi dasar mencakup seluruh deliverable resmi"}
                        </span>
                      </div>

                      {/* Estimates & Revisions Box */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-[#f0f0f0] rounded-[12px] text-xs">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#71717a] font-medium uppercase">
                            Waktu Kerja
                          </span>
                          <span className="text-[13px] font-semibold text-[#18181a] mt-0.5">
                            {pkg.estimatedDays} Hari Kalender
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#71717a] font-medium uppercase">
                            Kuota Revisi
                          </span>
                          <span className="text-[13px] font-semibold text-[#18181a] mt-0.5">
                            {pkg.includedRevisions}x Penyesuaian
                          </span>
                        </div>
                      </div>

                      {/* Deliverables / Features List */}
                      {pkg.features.length ? (
                        <div className="flex flex-col gap-2 pt-2">
                          <span className="text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.5px]">
                            CAKUPAN SPESIFIKASI:
                          </span>
                          <ul className="m-0 p-0 list-none flex flex-col gap-2 text-xs text-[#52525b]">
                            {pkg.features.map((feature, fIndex) => (
                              <li key={fIndex} className="flex items-start gap-2">
                                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] shrink-0 symbol mt-0.5">
                                  check_circle
                                </span>
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6 mt-4 border-t border-neutral-100 flex flex-col gap-2">
                      <Link
                        href={`/pesan?paket=${encodeURIComponent(pkg.slug)}`}
                        className={`w-full py-3 px-4 rounded-[10px] text-center text-sm font-semibold no-underline flex items-center justify-center gap-2 transition-all ${
                          isPopular
                            ? "bg-[#18181a] text-white hover:opacity-90 shadow-[0px_2px_8px_#0000001a]"
                            : "bg-[#18181a] text-white hover:opacity-90"
                        }`}
                      >
                        <span>{pkg.ctaLabel || `Pesan Paket ${pkg.name}`}</span>
                        <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                          arrow_forward
                        </span>
                      </Link>
                      <Link
                        href="/konsultasi"
                        className="text-center text-xs text-[#71717a] hover:text-[#18181a] py-1 no-underline"
                      >
                        Atau diskusikan kebutuhan kustom
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            <p className="p-8 text-center bg-[#f0f0f0] rounded-[16px] text-sm text-[#52525b]">
              Belum ada paket layanan yang dipublikasikan.
            </p>
          )}

          {/* Addons Section */}
          <PublicAddonsSection addons={catalog.addons} />

          {/* SLA & Methodology Guarantee Banner */}
          <section className="box-border w-full p-6 sm:p-8 rounded-[16px] bg-[#18181a] text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-[0px_4px_16px_#0000001a]">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[#e2e89d]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-lg symbol">
                  verified
                </span>
                <span className="text-[11px] font-bold tracking-[0.55px]">
                  JAMINAN KUALITAS &amp; INTEGRITAS KODE
                </span>
              </div>
              <h2 className="text-2xl font-semibold m-0 text-white tracking-[-0.3px]">
                Kepemilikan Penuh Kode Sumber &amp; Dokumentasi
              </h2>
              <p className="text-sm text-[#a8a8ad] m-0 leading-6">
                Seluruh hasil implementasi diserahkan dengan repository privat, panduan deployment, dan checklist serah terima resmi tanpa keterikatan lisensi tersembunyi.
              </p>
            </div>
            <Link
              href="/konsultasi"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-[#e2e89d] text-[#18181a] text-sm font-semibold no-underline hover:opacity-90 shrink-0"
            >
              <span>Konsultasi Proyek</span>
              <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                arrow_forward
              </span>
            </Link>
          </section>
        </div>
      </main>
      <PublicFooter settings={catalog.settings} />
    </div>
  );
}
