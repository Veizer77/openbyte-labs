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
    <div className="screen public-screen relative w-full min-h-screen flex flex-col justify-start items-stretch bg-white">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="pt-[96px] pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex-1"
      >
        <div className="max-w-[1000px] mx-auto">
          {children}
        </div>
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
          <h1 className="text-2xl font-semibold text-[#18181a]">
            Paket belum dapat dimuat
          </h1>
          <p role="alert" className="text-sm leading-6 text-[#52525b]">
            Rincian paket belum dapat dimuat. Silakan coba kembali beberapa
            saat lagi.
          </p>
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
      <div className="text-[11px] text-[#52525b]">PAKET & PENAWARAN</div>
      <h1 className="text-[28px] tracking-[-.7px] mt-3 mb-2">
        Ceritakan kebutuhan proyek Anda.
      </h1>
      <p className="text-sm text-[#52525b] leading-6 mb-6">
        {packageName
          ? `Paket dipilih: ${packageName}. `
          : "Pilih layanan yang sesuai. "}
        Harga final dan ruang lingkup dicantumkan dalam penawaran tertulis.
      </p>
      <section className="p-6 rounded-2xl bg-white shadow-[0_1px_8px_#0000000a]">
        <ContactForm
          packageName={packageName}
          packageId={packageId}
          consentText={settings?.legal.consentText}
          className="flex flex-col gap-4"
        />
      </section>
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
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#71717a]">
        Informasi privasi
      </p>
      <h1 className="mb-3 mt-0 text-[32px] font-bold tracking-[-.8px] text-[#18181a]">
        Kebijakan Privasi
      </h1>
      {policyIsReady && privacyPolicy ? (
        <PublicRichText value={privacyPolicy} replacements={{ whatsappNumber: whatsapp ?? "", contactEmail: email ?? "" }} />
      ) : <>
      <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Draf untuk ditinjau dan disetujui sebelum penggunaan produksi. Rincian
        pengendali data, dasar hukum, penyedia pemroses, dan jadwal retensi
        perlu dikonfirmasi oleh pemilik dan penasihat hukum.
      </div>

      <div className="space-y-6 text-sm leading-7 text-[#52525b]">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Data yang dikirim melalui formulir
          </h2>
          <p className="m-0">
            Formulir konsultasi dan pertanyaan meminta nama, nomor WhatsApp,
            layanan yang diminati, serta ringkasan kebutuhan. Email dan nama
            organisasi bersifat opsional. Permintaan booking juga memproses
            waktu dan metode konsultasi yang dipilih. Jangan kirim kata sandi,
            data pembayaran, atau data sensitif yang tidak diperlukan.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Tujuan dan pengamanan formulir
          </h2>
          <p className="m-0">
            Informasi digunakan untuk menindaklanjuti permintaan yang Anda
            kirim, mengelola booking, dan mencegah penyalahgunaan formulir.
            Formulir meminta persetujuan sebelum dikirim dan dapat memakai
            verifikasi anti-bot Cloudflare Turnstile. Detail penyedia layanan,
            lokasi pemrosesan, dan retensi harus ditetapkan sebelum peluncuran.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Permintaan terkait data
          </h2>
          <p className="m-0">
            Anda dapat meminta informasi, koreksi, atau penghapusan data yang
            Anda kirim, sepanjang tidak ada kewajiban hukum yang mengharuskan
            penyimpanannya. Saluran kontak untuk permintaan privasi:
          </p>
          {email || whatsapp ? (
            <ul className="mt-2 list-disc pl-5">
              {email ? (
                <li>
                  Email: <a className="underline" href={`mailto:${email}`}>{email}</a>
                </li>
              ) : null}
              {whatsapp ? <li>WhatsApp: {whatsapp}</li> : null}
            </ul>
          ) : (
            <p className="mt-2 rounded-lg bg-neutral-100 p-3 text-xs">
              Kontak privasi resmi belum dikonfigurasi. Jangan mengirim data
              sensitif melalui saluran yang belum diverifikasi.
            </p>
          )}
        </section>
      </div>
      </>}
    </PageFrame>
  );
}

export function AboutPage({ settings }: { settings?: PublicSiteSettings }) {
  return (
    <PageFrame settings={settings}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#71717a]">
        Tentang OpenByte Labs
      </p>
      <h1 className="mb-4 mt-0 text-[32px] font-bold tracking-[-.8px] text-[#18181a]">
        Perangkat lunak yang dirancang untuk kebutuhan nyata.
      </h1>
      <div className="space-y-5 text-sm leading-7 text-[#52525b]">
        <p>
          OpenByte Labs mengerjakan website, aplikasi, dan sistem informasi.
          Bentuk solusi, teknologi, jadwal, dan biaya ditentukan berdasarkan
          kebutuhan serta ruang lingkup setiap proyek.
        </p>
        <p>
          Sebelum pekerjaan dimulai, kebutuhan dan hasil yang diharapkan perlu
          dibahas bersama. Rincian pekerjaan, penyerahan, dukungan, serta
          ketentuan lainnya dicantumkan pada penawaran atau perjanjian proyek.
        </p>
        <Link
          href="/konsultasi"
          className="inline-flex rounded-lg bg-[#18181a] px-4 py-3 text-sm font-medium text-white"
        >
          Bahas kebutuhan proyek
        </Link>
      </div>
    </PageFrame>
  );
}

export function ServiceDetailPage({
  settings,
}: {
  settings?: PublicSiteSettings;
}) {
  return (
    <PageFrame settings={settings}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#71717a]">
        Layanan
      </p>
      <h1 className="mb-4 mt-0 text-[32px] font-bold tracking-[-.8px] text-[#18181a]">
        Sistem informasi sesuai alur kerja Anda.
      </h1>
      <div className="space-y-5 text-sm leading-7 text-[#52525b]">
        <p>
          Kami dapat membantu merancang dan membangun aplikasi web untuk
          mengelola data, proses kerja, dan akses pengguna. Fitur serta
          integrasi ditentukan setelah kebutuhan dan batasan proyek dipahami.
        </p>
        <p>
          Teknologi, keamanan, migrasi data, dukungan operasional, dan target
          waktu dibahas dan ditulis dalam ruang lingkup proyek. Tidak ada
          jaminan uptime, waktu respons insiden, atau hasil tertentu kecuali
          disepakati secara tertulis.
        </p>
        <Link
          href="/konsultasi"
          className="inline-flex rounded-lg bg-[#18181a] px-4 py-3 text-sm font-medium text-white"
        >
          Diskusikan sistem yang dibutuhkan
        </Link>
      </div>
    </PageFrame>
  );
}

export function TermsPage({ settings }: { settings?: PublicSiteSettings }) {
  return (
    <PageFrame settings={settings}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#71717a]">
        Ketentuan layanan
      </p>
      <h1 className="mb-4 mt-0 text-[32px] font-bold tracking-[-.8px] text-[#18181a]">
        Informasi sebelum memulai proyek
      </h1>
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Draf informasi umum untuk ditinjau. Ini bukan pengganti penawaran atau
          perjanjian; ketentuan final harus disetujui para pihak sebelum pekerjaan
          dimulai.
      </div>
      <div className="space-y-6 text-sm leading-7 text-[#52525b]">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Ruang lingkup dan estimasi
          </h2>
          <p className="m-0">
            Formulir konsultasi, kalkulator, dan katalog paket membantu
            mengawali pembahasan. Estimasi bukan penawaran mengikat. Fitur,
            jadwal, biaya, kriteria penerimaan, serta perubahan pekerjaan perlu
            dicantumkan dalam penawaran atau perjanjian tertulis.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Pembayaran, penyerahan, dan dukungan
          </h2>
          <p className="m-0">
            Jadwal pembayaran, hasil kerja yang diserahkan, hak penggunaan dan
            kepemilikan, masa dukungan, garansi, serta tingkat layanan hanya
            berlaku jika dirinci dan disepakati dalam dokumen proyek. Tidak ada
            tingkat uptime, waktu respons, atau garansi tertentu yang dijanjikan
            oleh halaman ini.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-[#18181a]">
            Data dan komunikasi
          </h2>
          <p className="m-0">
            Informasi yang dikirim melalui formulir digunakan untuk
            menindaklanjuti permintaan Anda. Baca{" "}
            <Link className="underline" href="/kebijakan-privasi">
              Kebijakan Privasi
            </Link>{" "}
            untuk informasi tentang data formulir. Jangan kirim kata sandi,
            informasi pembayaran, atau data sensitif melalui formulir.
          </p>
        </section>
      </div>
    </PageFrame>
  );
}
