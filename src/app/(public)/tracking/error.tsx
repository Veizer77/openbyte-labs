"use client";

export default function TrackingErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl space-y-5 px-4 py-20">
      <h1 className="text-2xl font-semibold">Portal belum dapat dimuat</h1>
      <p role="alert" className="text-sm leading-6">
        Koneksi ke data proyek belum tersedia. Tidak ada data contoh yang
        ditampilkan. Silakan coba kembali atau hubungi pengembang.
      </p>
      <button
        onClick={reset}
        className="min-h-11 rounded-xl bg-[#18181a] px-4 py-2 text-white"
      >
        Coba lagi
      </button>
    </main>
  );
}
