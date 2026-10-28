import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex items-center gap-2 rounded-full bg-[#f4f4f5] px-3.5 py-1 text-[11px] font-bold text-[#71717a]">
        <span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>
        <span>KODE HTTP 404 • ROUTE NOT FOUND</span>
      </div>

      <div className="my-3 text-[80px] font-black tracking-tighter text-[#18181a] sm:text-[96px]">
        404
      </div>

      <h1 className="text-[22px] font-bold tracking-tight text-[#18181a] sm:text-[26px]">
        Halaman Tidak Ditemukan atau Sesi Kedaluwarsa
      </h1>

      <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-[#52525b]">
        URL modul yang Anda tuju mungkin telah dipindahkan, atau halaman yang Anda cari tidak tersedia dalam rilis ini demi integritas arsitektur sistem.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[#18181a] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm hover:bg-[#242427]"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/layanan"
          className="flex items-center gap-2 rounded-xl border border-[#eaeaea] bg-[#f4f4f5] px-5 py-2.5 text-[13px] font-medium text-[#18181a] hover:bg-[#eaeaea]"
        >
          <span className="material-symbols-outlined text-[16px]">explore</span>
          <span>Eksplorasi Layanan</span>
        </Link>
      </div>

      <div className="mt-12 flex w-full max-w-md items-center justify-between rounded-xl border border-[#e4e4e7] bg-[#f9f9fb] p-4 text-left">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-[#71717a]">support_agent</span>
          <div>
            <div className="text-[13px] font-bold text-[#18181a]">Butuh Bantuan Navigasi?</div>
            <div className="text-[11px] text-[#71717a]">Hubungi staf teknis kami melalui WhatsApp</div>
          </div>
        </div>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-[#18181a] shadow-sm hover:bg-[#f0f0f0]"
        >
          Hubungi
        </a>
      </div>
    </div>
  )
}
