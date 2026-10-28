'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      // Endpoint Better Auth sign in
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.message || 'Kredensial atau kode TOTP tidak valid.')
      } else {
        router.push('/admin')
      }
    } catch {
      setErrorMsg('Gagal menghubungkan ke server autentikasi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#18181a]">
      {/* Kolom Kiri: Showcase & Info Keamanan Sistem */}
      <div className="flex w-full flex-col justify-between p-8 text-white lg:w-[480px] xl:w-[540px] lg:p-12">
        <div className="flex flex-col gap-8">
          {/* Header Status */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#242427] px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
              <span className="text-[11px] font-semibold tracking-wider text-[#d2d88f] uppercase">
                PRODUCTION SECURED • BETTER AUTH + TOTP
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/brand/openbyte-labs-square-icon-1-1-logo-only.svg"
                alt="OpenByte"
                width={38}
                height={38}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-[17px] font-bold tracking-tight text-white">
                  OPENBYTE LABS
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#d2d88f]">
                  ENTERPRISE CMS PLATFORM
                </span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold tracking-tight sm:text-[32px]">
              Portal Kontrol Sentral & Ekosistem Layanan
            </h1>
            <p className="text-[13px] leading-relaxed text-[#9ca3af]">
              Akses terotentikasi ke sistem manajemen konten bento, katalog proyek, dan logging audit kepatuhan dengan hak akses berjenjang.
            </p>
          </div>

          {/* Spesifikasi Keamanan */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#333338] bg-[#242427] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#d2d88f]">
                  verified_user
                </span>
                <span className="text-[12px] font-semibold text-white">
                  Protokol Keamanan Tingkat Lanjut
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#82b440]">2FA ENFORCED</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181a] text-[#d2d88f]">
                <span className="material-symbols-outlined text-[16px]">vpn_key</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-white">
                  Autentikasi Dua Faktor (2FA)
                </span>
                <span className="text-[11px] text-[#71717a]">
                  TOTP RFC 6238 via Google/MS Authenticator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181a] text-[#d2d88f]">
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-white">
                  Role-Based Access Control (RBAC)
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Hak akses granular: Owner vs Editor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181a] text-[#d2d88f]">
                <span className="material-symbols-outlined text-[16px]">history_toggle_off</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold text-white">
                  Audit Trail Otomatis
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Append-only logging untuk setiap mutasi data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info Node */}
        <div className="mt-8 flex items-center justify-between border-t border-[#2e2e32] pt-4 text-[11px] text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#82b440]"></span>
            <span>NODE • ID-JKT-01 • UPTIME 99.98%</span>
          </div>
          <span>OpenByte Labs © 2026</span>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex flex-1 items-center justify-center bg-[#f9f9fa] p-6 sm:p-12">
        <div className="w-full max-w-[460px] rounded-2xl border border-[#eaeaea] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#eaeaea] pb-6">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#18181a] uppercase">
                CMS ADMIN PORTAL
              </span>
              <span className="rounded bg-[#d2d88f]/20 px-2 py-0.5 text-[10px] font-bold text-[#586016] uppercase">
                TLS 1.3 ENCRYPTED
              </span>
            </div>
            <h2 className="text-[24px] font-bold text-[#18181a]">Masuk ke Panel Admin</h2>
            <p className="text-[13px] text-[#71717a]">
              Otentikasi kredensial internal untuk mengakses dashboard operasional dan konfigurasi sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-[#52525b] uppercase">
                Email Admin
              </label>
              <div className="flex items-center rounded-xl border border-[#e4e4e7] bg-[#f0f0f0] px-3 py-2.5">
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#71717a]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@openbyte.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#18181a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider text-[#52525b] uppercase">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-[#71717a]">Minimal 12 karakter</span>
              </div>
              <div className="flex items-center rounded-xl border border-[#e4e4e7] bg-[#f0f0f0] px-3 py-2.5">
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#71717a]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#18181a] placeholder:text-[#9ca3af] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#71717a] hover:text-[#18181a]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Kode 2FA TOTP */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider text-[#52525b] uppercase">
                  Kode 2FA TOTP (6-Digit)
                </label>
                <span className="text-[11px] text-[#71717a]">Authenticator App</span>
              </div>
              <div className="flex items-center rounded-xl border border-[#e4e4e7] bg-[#f0f0f0] px-3 py-2.5">
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#71717a]">
                  security
                </span>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000 000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent font-mono text-[16px] font-bold tracking-[4px] text-[#18181a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#18181a] py-3 text-[13px] font-semibold text-white shadow-md hover:bg-[#242427] disabled:opacity-50"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard CMS'}</span>
              <span className="material-symbols-outlined text-[16px] text-[#d2d88f]">
                arrow_forward
              </span>
            </button>

            {/* Proteksi Lockout */}
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#eaeaea] bg-[#f0f0f0] p-3 text-[11px] text-[#71717a]">
              <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              <span>Proteksi brute-force aktif: Lockout 15 menit setelah 5 kegagalan.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
