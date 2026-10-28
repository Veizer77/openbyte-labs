import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eaeaea] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/openbyte-labs-official-brand-logo.svg"
            alt="OpenByte Labs"
            width={160}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#18181a] hover:bg-[#f0f0f0]"
          >
            Beranda
          </Link>
          <Link
            href="/portofolio"
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#52525b] hover:bg-[#f0f0f0] hover:text-[#18181a]"
          >
            Portofolio
          </Link>
          <Link
            href="/layanan"
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#52525b] hover:bg-[#f0f0f0] hover:text-[#18181a]"
          >
            Paket Layanan
          </Link>
          <Link
            href="/tentang-kami"
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#52525b] hover:bg-[#f0f0f0] hover:text-[#18181a]"
          >
            Tentang Kami
          </Link>
        </nav>

        {/* Action & Availability */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-[#f0f0f0] px-3 py-1 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
            <span className="text-[11px] font-medium text-[#52525b]">
              Tersedia untuk Proyek
            </span>
          </div>

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-[#eaeaea] bg-white px-3 py-1.5 text-[13px] font-medium text-[#18181a] shadow-sm hover:bg-[#f9f9f9]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#82b440]">chat</span>
            <span>WhatsApp</span>
          </a>

          <Link
            href="/layanan"
            className="flex items-center gap-1.5 rounded-xl bg-[#18181a] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-[#242427]"
          >
            <span>Konsultasi</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
