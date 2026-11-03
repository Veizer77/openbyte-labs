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
    <div className="screen public-screen relative flex min-h-screen w-full flex-col items-stretch overflow-x-hidden bg-[#ffffff]">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="relative z-0 flex w-full flex-1 flex-col items-stretch pb-16 pt-[64px]"
      >
        <section
          aria-labelledby="blog-heading"
          className="flex w-full flex-col items-center justify-center bg-[#18181A] py-14"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-4 px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
            <div className="flex w-fit items-center gap-1.5 rounded-full bg-[#D2D88F26] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D2D88F]" />
              <span className="text-[11px] font-bold tracking-[0.5px] text-[#D2D88F]">
                KUMPULAN INSIGHT &amp; TECH RADAR
              </span>
            </div>
            <h1
              id="blog-heading"
              className="m-0 w-full text-[32px]/[38px] font-extrabold tracking-[-1px] text-[#FFFFFF] sm:text-[42px]/[48px]"
            >
              Wawasan Rekayasa &amp; Catatan Arsitektur Sistem
            </h1>
            <p className="m-0 w-full text-[15px]/[24px] text-[#A1A1AA]">
              Catatan teknis dari tim engineer OpenByte Labs: keputusan
              arsitektur, praktik keamanan, dan efisiensi infrastruktur pada
              proyek yang benar-benar dikerjakan.
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
