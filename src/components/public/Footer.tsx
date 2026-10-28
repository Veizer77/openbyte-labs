import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full border-t border-[#eaeaea] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3 max-w-sm">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/openbyte-labs-official-brand-logo.svg"
              alt="OpenByte Labs"
              width={160}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
          <p className="text-[13px] leading-relaxed text-[#52525b]">
            Rekayasa Perangkat Lunak & Sistem Presisi Tinggi. Membangun arsitektur web dan mobile modern untuk instansi dan bisnis dengan jaminan kode produksi yang siap diaudit.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
            <span className="text-[11px] font-medium text-[#71717a]">
              SLA Respons Cepat • Waktu Indonesia Barat (WIB)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[12px] font-semibold tracking-wider text-[#18181a] uppercase">Navigasi</h4>
            <Link href="/" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Beranda</Link>
            <Link href="/portofolio" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Portofolio</Link>
            <Link href="/layanan" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Paket Layanan</Link>
            <Link href="/tentang-kami" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Tentang Kami</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-[12px] font-semibold tracking-wider text-[#18181a] uppercase">Kepatuhan & Legal</h4>
            <Link href="/ketentuan-layanan" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Ketentuan Layanan</Link>
            <Link href="/ketentuan-layanan" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Kebijakan Privasi (PDP)</Link>
            <Link href="/ketentuan-layanan" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Garansi & SLA</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-[12px] font-semibold tracking-wider text-[#18181a] uppercase">Internal Staf</h4>
            <Link href="/admin/login" className="text-[13px] text-[#52525b] hover:text-[#18181a]">Panel Admin CMS</Link>
            <span className="text-[11px] text-[#9ca3af]">Akses terotentikasi Better Auth + 2FA TOTP</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#eaeaea] py-4">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 text-[12px] text-[#71717a] sm:flex-row">
          <p>© 2026 OpenByte Labs. Hak cipta dilindungi undang-undang.</p>
          <p>Jakarta, Indonesia • Standar Rekayasa Presisi Tinggi</p>
        </div>
      </div>
    </footer>
  )
}
