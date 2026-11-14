import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { ContactForm } from "./ContactForm";
import { notFound } from "next/navigation";
import { getPublicCatalog } from "@/lib/server/public-catalog";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import { PublicRichText } from "@/components/public/PublicRichText";

function PageFrame({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: PublicSiteSettings;
}) {
  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-stretch bg-white overflow-x-hidden relative screen public-screen has-editorial-hero">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="pt-[104px] lg:pt-[68px] pb-16 w-full flex-1 flex flex-col items-stretch"
      >
        {children}
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}

export async function OrderPage({
  packageSlug,
}: {
  packageSlug?: string;
}) {
  let packageName: string | undefined;
  let packageId: string | undefined;
  let settings: PublicSiteSettings | undefined;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    settings = undefined;
  }
  if (packageSlug) {
    let catalog: Awaited<ReturnType<typeof getPublicCatalog>>;
    try {
      catalog = await getPublicCatalog();
    } catch {
      return (
        <PageFrame>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="text-2xl font-semibold text-[#18181a]">
              Paket belum dapat dimuat
            </h1>
            <p role="alert" className="text-sm leading-6 text-[#52525b] mt-2">
              Rincian paket belum dapat dimuat. Silakan coba kembali beberapa saat lagi.
            </p>
          </div>
        </PageFrame>
      );
    }
    const selectedPackage = catalog.packages.find(
      (item) => item.slug === packageSlug,
    );
    if (!selectedPackage) notFound();
    packageName = selectedPackage.name;
    packageId = selectedPackage.id;
    settings = catalog.settings;
  }
  return (
    <PageFrame settings={settings}>
      <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
        <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
            <span className="h-2 w-2 rounded-full bg-[#82b440]" />
            <span>Pengajuan Penawaran &amp; Ruang Lingkup</span>
          </div>
          <h1
            className="text-[32px]/[1.14] sm:text-[42px]/[1.1] font-semibold text-[#18181a] tracking-[-0.03em] m-0 max-w-3xl"
            data-heading="true"
          >
            Ceritakan Kebutuhan Proyek Anda
          </h1>
          <p className="text-[15px]/[1.65] text-[#52525b] m-0 max-w-2xl">
            {packageName
              ? `Paket dipilih: ${packageName}. `
              : "Pilih layanan dan sampaikan kebutuhan spesifik Anda. "}
            Rincian penawaran resmi, jadwal pengerjaan, dan estimasi biaya tertulis akan kami kirimkan.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-3xl mx-auto py-2 flex flex-col gap-6">
          <section className="p-6 sm:p-8 rounded-[16px] bg-[#ffffff] border border-neutral-200/80 shadow-[0px_1px_3px_#0000000d]">
            <ContactForm
              packageName={packageName}
              packageId={packageId}
              consentText={settings?.legal.consentText}
              className="flex flex-col gap-5"
            />
          </section>
        </div>
      </div>
    </PageFrame>
  );
}

export function PrivacyPage({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  const email = settings?.general.contactEmail;
  const whatsapp = settings?.general.whatsappNumber;
  const privacyPolicy = settings?.legal.privacyPolicy;
  const policyText = privacyPolicy?.blocks.flatMap((block) =>
    block.type === "list"
      ? block.items.flatMap((item) => item.map((node) => node.text))
      : block.children.map((node) => node.text),
  ).join(" ") ?? "";
  const policyIsReady = Boolean(
    privacyPolicy?.blocks.length &&
      !/\[ISI(?::|\])/i.test(policyText) &&
      !/\{(?!whatsappNumber\}|contactEmail\})[a-zA-Z][a-zA-Z0-9]*\}/.test(policyText),
  );

  return (
    <PageFrame settings={settings}>
      <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
        <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
            <span className="h-2 w-2 rounded-full bg-[#82b440]" />
            <span>Tata Kelola &amp; Privasi Data</span>
          </div>
          <h1
            className="text-[32px]/[1.14] sm:text-[42px]/[1.1] font-semibold text-[#18181a] tracking-[-0.03em] m-0"
            data-heading="true"
          >
            Kebijakan Privasi
          </h1>
          <p className="text-[15px]/[1.65] text-[#52525b] m-0 max-w-2xl">
            Komitmen OpenByte Labs terhadap perlindungan privasi, integritas informasi, dan kepatuhan pengolahan data klien.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* 2-Column Stitch Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 flex flex-col gap-4 p-5 bg-[#f0f0f0] rounded-[16px] lg:sticky lg:top-24">
            <span className="text-[11px] font-bold tracking-[0.55px] text-[#595962] uppercase">
              RINGKASAN KEBIJAKAN
            </span>
            <ul className="m-0 p-0 list-none flex flex-col gap-2 text-xs text-[#52525b]">
              <li className="flex items-center gap-2">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check_circle
                </span>
                <span>Tidak ada penjualan data kepada pihak ketiga</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check_circle
                </span>
                <span>Enkripsi transmisi SSL/TLS standar industri</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check_circle
                </span>
                <span>Hak koreksi &amp; penghapusan data mandiri</span>
              </li>
            </ul>
            <div className="pt-3 border-t border-neutral-200/80 text-xs text-[#71717a]">
              Kontak resmi: {email || whatsapp || "Hubungi melalui formulir konsultasi"}
            </div>
          </aside>

          <div className="lg:col-span-8 flex flex-col gap-6">
            {policyIsReady && privacyPolicy ? (
              <div className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d]">
                <PublicRichText value={privacyPolicy} replacements={{ whatsappNumber: whatsapp ?? "", contactEmail: email ?? "" }} />
              </div>
            ) : (
              <>
                <div className="rounded-[12px] border border-neutral-200 bg-[#f0f0f0] p-4 text-xs sm:text-sm leading-6 text-[#52525b]">
                  Ringkasan kebijakan privasi ini menjelaskan data yang kami kumpulkan melalui formulir publik dan cara kami menggunakannya sesuai kerangka pelindungan data pribadi yang berlaku di Indonesia (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).
                </div>

                <div className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d] flex flex-col gap-6 text-sm leading-7 text-[#52525b]">
                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      1. Identitas Pengendali Data
                    </h2>
                    <p className="m-0">
                      Pengendali data untuk situs dan layanan ini adalah {settings?.general.brandName || "OpenByte Labs"} ({settings?.general.address || "Indonesia"}). Permintaan terkait pelindungan data pribadi dapat disampaikan melalui saluran kontak resmi ({email || whatsapp || "formulir konsultasi resmi"}).
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      2. Kategori Data Pribadi yang Dikumpulkan
                    </h2>
                    <p className="m-0">
                      Formulir konsultasi, pemesanan, dan kalkulator estimasi meminta data minimum yang diperlukan untuk komunikasi pra-kontrak: nama lengkap, nomor WhatsApp, alamat email, nama instansi/usaha, rincian kebutuhan proyek, serta metadata teknis keamanan (token verifikasi anti-bot dan cap waktu). Kami tidak mengumpulkan data keuangan sensitif atau kata sandi melalui formulir publik.
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      3. Tujuan &amp; Dasar Pemrosesan Data
                    </h2>
                    <p className="m-0">
                      Data diproses berdasarkan persetujuan eksplisit pengirim dan kebutuhan pelaksanaan langkah pra-kontrak untuk: (a) menanggapi pertanyaan dan menjadwalkan sesi konsultasi, (b) menyusun estimasi biaya dan proposal teknis, (c) menyediakan pelacakan progres proyek bila fitur pelacakan diaktifkan, serta (d) melindungi layanan dari penyalahgunaan otomatis.
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      4. Pihak Ketiga / Sub-Pemroses Infrastruktur
                    </h2>
                    <p className="m-0">
                      Kami tidak menjual atau menyewakan data pribadi kepada pihak ketiga. Dalam penyelenggaraan teknis, data disimpan dan diproses melalui penyedia infrastruktur terenkripsi: Vercel (hosting aplikasi), Neon PostgreSQL (penyimpanan basis data), Cloudflare Turnstile &amp; R2 (verifikasi keamanan anti-bot dan penyimpanan media), serta WhatsApp (saluran komunikasi tindak lanjut atas permintaan pengguna).
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      5. Masa Retensi &amp; Penghapusan Data
                    </h2>
                    <p className="m-0">
                      Data pengajuan formulir dan sesi konsultasi disimpan selama masa komunikasi aktif dan ditinjau secara berkala (hingga 24 bulan sejak interaksi terakhir, kecuali diwajibkan lebih lama oleh perjanjian kerja sama atau ketentuan hukum), sebelum dihapus atau dianonimkan secara permanen.
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold text-[#18181a] m-0">
                      6. Hak Subjek Data Pribadi
                    </h2>
                    <p className="m-0">
                      Anda berhak meminta akses, koreksi/pembaruan, pembatasan pemrosesan, penarikan persetujuan, maupun penghapusan data pribadi yang telah Anda kirimkan kapan saja dengan menghubungi saluran kontak resmi kami.
                    </p>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

export function TermsPage({ settings }: { settings?: PublicSiteSettings }) {
  return (
    <PageFrame settings={settings}>
      <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
        <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
            <span className="h-2 w-2 rounded-full bg-[#82b440]" />
            <span>Standar Kontrak &amp; Kerjasama</span>
          </div>
          <h1
            className="text-[32px]/[1.14] sm:text-[42px]/[1.1] font-semibold text-[#18181a] tracking-[-0.03em] m-0"
            data-heading="true"
          >
            Ketentuan Layanan
          </h1>
          <p className="text-[15px]/[1.65] text-[#52525b] m-0 max-w-2xl">
            Prinsip kerja, transparansi ruang lingkup, dan jaminan purna jual dalam setiap kesepakatan implementasi perangkat lunak OpenByte Labs.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* 2-Column Stitch Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 flex flex-col gap-4 p-5 bg-[#f0f0f0] rounded-[16px] lg:sticky lg:top-24">
            <span className="text-[11px] font-bold tracking-[0.55px] text-[#595962] uppercase">
              PASAL POKOK
            </span>
            <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-xs text-[#52525b]">
              <li className="flex items-center gap-2 font-medium text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check
                </span>
                <span>1. Ruang Lingkup &amp; Penawaran Resmi</span>
              </li>
              <li className="flex items-center gap-2 font-medium text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check
                </span>
                <span>2. Hak Kepemilikan Kode Sumber</span>
              </li>
              <li className="flex items-center gap-2 font-medium text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol">
                  check
                </span>
                <span>3. Garansi 30 Hari &amp; BAST</span>
              </li>
            </ul>
          </aside>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="rounded-[12px] border border-neutral-200 bg-[#f0f0f0] p-4 text-xs sm:text-sm leading-6 text-[#52525b]">
              Ketentuan spesifik seperti jadwal pencairan, milestone, dan kuota revisi final dicantumkan dalam Surat Perjanjian Kerja (SPK) resmi sebelum eksekusi proyek dimulai.
            </div>

            <div className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d] flex flex-col gap-6 text-sm leading-7 text-[#52525b]">
              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-[#18181a] m-0">
                  1. Ruang Lingkup Kerja &amp; Estimasi
                </h2>
                <p className="m-0">
                  Seluruh estimasi biaya yang dihasilkan melalui kalkulator daring merupakan simulasi awal. Ruang lingkup resmi, rincian fungsionalitas, jadwal milestone, dan toleransi revisi dicantumkan secara definitif dalam dokumen proposal teknis dan SPK tertulis.
                </p>
              </section>

              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-[#18181a] m-0">
                  2. Penyerahan Kode Sumber &amp; Lisensi
                </h2>
                <p className="m-0">
                  Setelah pelunasan komitmen proyek dan penandatanganan Berita Acara Serah Terima (BAST), klien memegang hak kepemilikan penuh atas kode sumber kustom yang dibangun, bebas dari keterikatan biaya lisensi vendor tersembunyi.
                </p>
              </section>

              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-[#18181a] m-0">
                  3. Garansi Purna Jual 30 Hari
                </h2>
                <p className="m-0">
                  OpenByte Labs memberikan jaminan perbaikan bug dan penyesuaian non-perubahan arsitektur selama 30 hari kalender sejak sistem resmi diserahterimakan pada lingkungan produksi.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

export function AboutPage({ settings }: { settings?: PublicSiteSettings }) {
  return (
    <PageFrame settings={settings}>
      <section className="w-full bg-[#18181a] border-b border-[#2e2e32] arch-grid-dark hero-band text-white py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#e2e89d]">
            <span className="h-2 w-2 rounded-full bg-[#82b440]" />
            <span>Profil Studio &amp; Prinsip Rekayasa</span>
          </div>
          <h1
            className="text-[32px]/[1.14] sm:text-[44px]/[1.1] lg:text-[50px]/[1.08] font-semibold tracking-[-0.03em] text-white m-0 max-w-4xl"
            data-heading="true"
          >
            Rekayasa Perangkat Lunak Presisi Tinggi untuk Sektor Strategis
          </h1>
          <p className="text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#a8a8ad] m-0 max-w-3xl">
            OpenByte Labs adalah software engineering studio yang berfokus pada pembangunan sistem informasi instansi, aplikasi mobile Flutter, dan arsitektur data berperforma tinggi tanpa kompromi integritas.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col gap-10">
        {/* 4 Engineering Principles Bento Grid */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[0.55px] text-[#595962] uppercase">
              STANDAR ARSITEKTUR
            </span>
            <h2 className="text-2xl font-bold text-[#18181a] tracking-[-0.3px] m-0">
              Empat Pilar Rekayasa Sistem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            <div className="p-6 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-3 shadow-[0px_1px_2px_#0000000d]">
              <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                  code
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#18181a] m-0">
                Arsitektur Bersih &amp; Modular
              </h3>
              <p className="text-sm text-[#52525b] m-0 leading-6">
                Pemisahan tanggung jawab yang tegas antara lapisan data, service layer, dan antarmuka untuk kemudahan audit dan skalabilitas jangka panjang.
              </p>
            </div>

            <div className="p-6 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-3 shadow-[0px_1px_2px_#0000000d]">
              <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                  security
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#18181a] m-0">
                Keamanan Default-Deny &amp; 2FA
              </h3>
              <p className="text-sm text-[#52525b] m-0 leading-6">
                Kebijakan proteksi tanpa celah: otorisasi wajib di tingkat server, sanitasi input Zod, autentikasi berbasis MFA/TOTP, dan isolasi hak akses data.
              </p>
            </div>

            <div className="p-6 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-3 shadow-[0px_1px_2px_#0000000d]">
              <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                  database
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#18181a] m-0">
                Integritas Transaksi Relasional
              </h3>
              <p className="text-sm text-[#52525b] m-0 leading-6">
                PostgreSQL terindeks dengan exclusion constraint untuk proteksi konkurensi data tumpang tindih dan keandalan atomik setiap transaksi operasional.
              </p>
            </div>

            <div className="p-6 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-3 shadow-[0px_1px_2px_#0000000d]">
              <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-[#18181a]">
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                  verified
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#18181a] m-0">
                Transparansi &amp; Bebas Vendor-Lock
              </h3>
              <p className="text-sm text-[#52525b] m-0 leading-6">
                Penyerahan kode sumber penuh beserta repository dan dokumentasi teknis komprehensif, memberi kebebasan penuh kepada instansi Anda.
              </p>
            </div>
          </div>
        </section>

        {/* Founder / Engineering Profile Card */}
        <section className="p-6 sm:p-8 bg-[#ffffff] border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_3px_#0000000d] flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-16 h-16 rounded-full bg-[#18181a] text-[#e2e89d] flex items-center justify-center font-bold text-xl shrink-0">
              MIF
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold text-[#18181a]">
                  Muhammad Izzat Farahidi
                </span>
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-lg text-[#82b440] symbol">
                  verified
                </span>
              </div>
              <span className="text-xs font-medium text-[#52525b]">
                Founder &amp; Lead Systems Engineer OpenByte Labs
              </span>
              <p className="text-xs text-[#71717a] m-0 mt-1 max-w-xl leading-5">
                Spesialis rekayasa perangkat lunak dengan fokus pada sistem informasi pemerintahan desa, platform kesehatan terpadu, dan aplikasi mobile enterprise.
              </p>
            </div>
          </div>

          <Link
            href="/konsultasi"
            className="px-5 py-3 rounded-[10px] bg-[#18181a] text-white text-xs font-semibold no-underline hover:opacity-90 shrink-0 flex items-center gap-1.5"
          >
            <span>Diskusi Bersama</span>
            <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
              arrow_forward
            </span>
          </Link>
        </section>
      </div>
    </PageFrame>
  );
}

