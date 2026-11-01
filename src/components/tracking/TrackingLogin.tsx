"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { trackingLoginAction } from "@/actions/tracking";
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { inputClass, buttonClass, Field, Notice } from "./ui";

export function TrackingLogin({
  whatsappUrl,
  sessionMinutes,
  maxAttempts,
}: {
  whatsappUrl: string | null;
  sessionMinutes: number;
  maxAttempts: number;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await trackingLoginAction({ code, pin });
      setPin("");
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/tracking/proyek");
      router.refresh();
    } catch {
      setError("Portal belum dapat dihubungi. Coba kembali.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main
      id="konten"
      className="flex min-h-screen items-center justify-center bg-white px-4 py-12"
      data-screen="tracking/login"
    >
      <div className="w-full max-w-[540px]">
        <div className="overflow-hidden rounded-[20px] border border-[#e4e4e7] bg-white shadow-[0_20px_40px_#0000000d]">
          <div className="h-1 bg-[#e2e89d]" />
          <div className="space-y-7 p-6 sm:p-10">
            <div className="text-center">
              <ReferenceImage
                src="/images/5f9e6a2ac345b8dc.png"
                alt="OpenByte Labs"
                contain
                className="mx-auto mb-6 h-14 w-14 rounded-xl bg-[#f4f4f5]"
              />
              <p className="mb-3 text-[11px] font-medium text-[#52525b]">
                OPENBYTE LABS PORTAL · AKSES KLIEN
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-[#18181a] sm:text-[28px]">
                Portal Pelacakan Proyek Klien
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#52525b]">
                Pantau progres, pembayaran, dokumen, dan revisi proyek
                menggunakan kode tracking dan PIN dari admin.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <Field label="KODE TRACKING PROYEK">
                <input
                  className={`${inputClass} font-semibold tracking-wider`}
                  name="trackingCode"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="PRJ-XXXXXXXX"
                  required
                  maxLength={12}
                  pattern="PRJ-[A-HJ-NP-Z2-9]{8}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </Field>
              <Field label="PIN AKSES KEAMANAN (6 digit)">
                <span className="relative">
                  <input
                    className={`${inputClass} pr-24 tracking-[.3em]`}
                    name="pin"
                    type={visible ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-0 min-h-11 px-2 text-xs"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible ? "Sembunyikan PIN" : "Tampilkan PIN"}
                  >
                    {visible ? "Sembunyikan" : "Lihat PIN"}
                  </button>
                </span>
              </Field>
              <p className="rounded-xl bg-[#f4f4f5] p-3 text-xs leading-5 text-[#52525b]">
                Akses dibatasi setelah {maxAttempts} percobaan gagal. Sesi
                berlaku {sessionMinutes} menit. PIN tidak disimpan di browser.
              </p>
              <Notice error={error} />
              <button className={`${buttonClass} w-full`} disabled={busy}>
                {busy ? "Memverifikasi…" : "Verifikasi & Buka Dasbor Proyek"}
              </button>
            </form>
            {whatsappUrl ? (
              <div className="rounded-xl bg-[#f4f4f5] p-3 text-center text-xs leading-6 text-[#52525b]">
                Belum menerima PIN akses proyek?
                <br />
                <a
                  href={whatsappUrl}
                  className="font-semibold text-[#18181a] underline"
                >
                  Hubungi WhatsApp resmi pengembang
                </a>
              </div>
            ) : null}
          </div>
        </div>
        <Link
          href="/"
          className="mt-6 block text-center text-sm text-[#52525b] underline"
        >
          Kembali ke website
        </Link>
      </div>
    </main>
  );
}
