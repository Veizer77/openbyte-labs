import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";

/**
 * Public / 11 — Blog & Wawasan Rekayasa (prototype/stitch/site/blog.html).
 * There is no editorial table yet, so the screen renders the design's hero and
 * an explicit empty state instead of mock articles.
 */
export function PublicBlog({ settings }: { settings?: PublicSiteSettings }) {
  return (
    <div className="screen public-screen has-editorial-hero relative flex min-h-screen w-full flex-col items-stretch overflow-x-hidden bg-[#ffffff]">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="relative z-0 flex w-full flex-1 flex-col items-stretch pb-16 pt-[104px] lg:pt-[68px]"
      >
        <section
          aria-labelledby="blog-heading"
          className="flex w-full flex-col items-center justify-center bg-[#18181a] border-b border-[#2e2e32] arch-grid-dark py-14 sm:py-16 hero-band"
        >
          <div className="mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1600px] flex-col items-start gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#e2e89d]">
              <span className="h-2 w-2 rounded-full bg-[#82b440]" />
              <span>Jurnal Rekayasa &amp; Arsitektur</span>
            </div>
            <h1
              id="blog-heading"
              className="m-0 max-w-3xl text-[32px]/[1.14] font-semibold tracking-[-0.03em] text-[#ffffff] sm:text-[44px]/[1.1]"
              data-heading="true"
            >
              Wawasan Rekayasa &amp; Catatan Arsitektur Sistem
            </h1>
            <p className="m-0 max-w-2xl text-[15px]/[1.65] text-[#a8a8ad]">
              Catatan teknis dari tim engineer OpenByte Labs: keputusan arsitektur, praktik keamanan, dan efisiensi infrastruktur pada proyek yang benar-benar dikerjakan.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="blog-list-heading"
          className="mx-auto w-full max-w-[1440px] px-4 pt-10 sm:px-6 lg:px-8 2xl:max-w-[1600px]"
        >
          <h2
            id="blog-list-heading"
            className="m-0 text-[12px] font-bold tracking-[0.6px] text-[#71717A]"
          >
            ARTIKEL TERBIT
          </h2>
          <div className="mt-4 flex flex-col gap-4 rounded-[16px] border border-[#E4E4E7] bg-[#F9F9FB] p-6 sm:p-8">
            <p className="m-0 text-[16px]/[22px] font-bold text-[#18181A]">
              Belum ada artikel yang diterbitkan.
            </p>
            <p className="m-0 max-w-3xl text-[13px]/[20px] text-[#52525B]">
              Modul editorial (tulis, jadwalkan, dan terbitkan artikel) belum
              tersedia, sehingga halaman ini belum menampilkan tulisan apa pun.
              Struktur halaman, kategori, dan kartu artikel sudah disiapkan dan
              akan terisi otomatis begitu modul tersebut diaktifkan.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                href="/konsultasi"
                className="rounded-[8px] bg-[#18181A] px-5 py-3 text-[13px] font-semibold text-white no-underline hover:opacity-90"
              >
                Diskusikan kebutuhan Anda
              </Link>
              <Link
                href="/paket"
                className="rounded-[8px] border border-[#D4D4D8] bg-white px-5 py-3 text-[13px] font-semibold text-[#18181A] no-underline hover:bg-[#f4f4f5]"
              >
                Lihat paket layanan
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
