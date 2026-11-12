"use client";

import { useState, type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { dateWib } from "@/lib/format";
import { contactSchema, type ContactValues } from "@/schemas/contact";
import { consultationModeLabels, useBooking } from "./Booking";
import { submitBookingAction } from "@/actions/public/booking";
import { submitInquiryAction } from "@/actions/public/inquiry";
import {
  TurnstileWidget,
  turnstileSiteKey,
} from "@/components/public/TurnstileWidget";

export function ContactForm({
  kind = "inquiry",
  packageName,
  packageId,
  consentText,
  ...props
}: HTMLAttributes<HTMLFormElement> & {
  kind?: "booking" | "inquiry";
  packageName?: string;
  packageId?: string;
  consentText?: string;
}) {
  const booking = useBooking();

  const [serverError, setServerError] = useState<string>("");
  const [slotError, setSlotError] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const [success, setSuccess] = useState<{
    reference: string;
    name: string;
    slotStart?: string;
    calendarUrl?: string;
    whatsappUrl?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      email: "",
      organization: "",
      service: packageName ?? "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (values: ContactValues) => {
    setServerError("");
    setSlotError("");

    if (kind === "booking") {
      if (!booking?.slot) {
        setSlotError(
          booking?.error ||
            "Pilih tanggal, jam, dan mode konsultasi yang tersedia terlebih dahulu.",
        );
        return;
      }
      if (Date.parse(booking.slot) <= booking.now.getTime()) {
        setSlotError(
          "Jam sesi konsultasi yang dipilih sudah terlewat. Silakan pilih sesi lain yang masih aktif pada kalender.",
        );
        return;
      }
      if (!booking.availability?.consultationModes.includes(booking.mode)) {
        setSlotError("Pilih mode konsultasi yang tersedia terlebih dahulu.");
        return;
      }
    }
    if (
      !turnstileToken &&
      (turnstileSiteKey || process.env.NODE_ENV === "production")
    ) {
      setServerError("Selesaikan verifikasi keamanan sebelum mengirim formulir.");
      return;
    }

    try {
      if (kind === "booking" && booking) {
        const result = await submitBookingAction({
          name: values.name,
          whatsapp: values.whatsapp,
          email: values.email || "",
          organizationOrBusiness: values.organization || "-",
          serviceInterest: values.service,
          projectBrief: values.message,
          slotStart: new Date(booking.slot).toISOString(),
          consultationMode: booking.mode,
          consent: true,
          turnstileToken,
          honeypot,
        });

        if (result.ok) {
          setSuccess({
            reference: result.data.reference,
            name: values.name,
            slotStart: result.data.slotStart,
            calendarUrl: result.data.calendarUrl,
            whatsappUrl: result.data.whatsappUrl,
          });
        } else {
          // Specific server error messages
          if (result.code === "slot_unavailable") {
            setServerError(
              "Slot jam konsultasi ini tidak tersedia atau baru saja terisi. Silakan pilih jam lain pada kalender.",
            );
          } else if (result.code === "rate_limit") {
            setServerError(
              "Batas pengiriman reservasi tercapai. Mohon tunggu beberapa saat sebelum mencoba kembali.",
            );
          } else if (result.code === "anti_spam") {
            setServerError("Verifikasi keamanan anti-spam gagal. Silakan muat ulang halaman.");
          } else if (result.code === "mode_unavailable") {
            setServerError("Mode konsultasi yang dipilih sedang tidak tersedia.");
          } else if (result.code === "input_tidak_valid") {
            setServerError("Data yang dikirim tidak valid. Mohon periksa kembali isian formulir.");
          } else {
            setServerError(
              result.message || "Permintaan tidak dapat diproses saat ini. Silakan coba beberapa saat lagi.",
            );
          }
        }
      } else {
        // Inquiry Submission (treat package inquiry gracefully as contact source with package label)
        const result = await submitInquiryAction({
          source: packageId ? "package" : "contact",
          servicePackageId: packageId ?? null,
          name: values.name,
          whatsapp: values.whatsapp,
          email: values.email || "",
          organizationOrBusiness: values.organization || "-",
          message: packageName
            ? `[Paket Layanan: ${packageName}] [Kategori: ${values.service}] ${values.message}`
            : `[Kategori: ${values.service}] ${values.message}`,
          consent: true,
          turnstileToken,
          honeypot,
        });

        if (result.ok) {
          setSuccess({
            reference: result.data.reference,
            name: values.name,
            whatsappUrl: result.data.whatsappUrl || undefined,
          });
        } else {
          if (result.code === "rate_limit") {
            setServerError("Batas pengiriman pesan tercapai. Silakan coba lagi dalam beberapa menit.");
          } else if (result.code === "anti_spam") {
            setServerError("Verifikasi keamanan anti-spam gagal. Silakan muat ulang halaman.");
          } else if (result.code === "package_unavailable") {
            setServerError("Paket layanan yang dipilih sedang tidak tersedia dalam sistem.");
          } else if (result.code === "input_tidak_valid") {
            setServerError("Data yang dikirim tidak valid. Mohon periksa kembali isian formulir.");
          } else {
            setServerError(
              result.message || "Permintaan tidak dapat diproses saat ini. Silakan coba beberapa saat lagi.",
            );
          }
        }
      }
    } catch {
      setServerError("Gagal menghubungkan ke server. Periksa koneksi internet dan coba lagi.");
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    }
  };

  const copyReference = () => {
    if (!success?.reference) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(success.reference)
        .then(() => {
          setCopiedRef(true);
          setTimeout(() => setCopiedRef(false), 2500);
        })
        .catch(() => {
          setCopiedRef(false);
        });
    }
  };

  if (success) {
    const calendar = success.calendarUrl || (booking?.slot
      ? `https://calendar.google.com/calendar/render?${new URLSearchParams({
          action: "TEMPLATE",
          text: `Konsultasi Teknis OpenByte Labs - ${success.reference}`,
          dates: `${booking.slot.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${new Date(
            Date.parse(booking.slot) + 3_600_000,
          )
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "")}`,
          details: `Permintaan Reservasi Terkirim.\nKode Rujukan: ${success.reference}\nPIC: ${success.name}\nMode: ${booking.mode}\nStatus: Menunggu Konfirmasi Admin`,
        })}`
      : null);

    return (
      <div className="flex flex-col gap-5 py-6" role="status" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="symbol text-4xl text-[#82b440]">task_alt</span>
          <div>
            <div className="text-xs font-bold text-[#82b440] uppercase tracking-wider">
              {kind === "booking" ? "Permintaan Reservasi Terkirim" : "Permintaan Penawaran Diterima"}
            </div>
            <h2 className="text-xl font-bold text-[#18181a] m-0">
              Terima kasih, {success.name}.
            </h2>
          </div>
        </div>

        {/* Official Reference Number Box */}
        <div className="p-4 rounded-xl bg-[#f4f7ea] border border-[#d2d88f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-[#586016] uppercase tracking-wide">
              Nomor Referensi Tiket Server
            </div>
            <div className="text-2xl font-mono font-bold text-[#18181a] tracking-wider mt-0.5">
              {success.reference}
            </div>
            <div className="text-xs text-[#52525b] mt-1">
              {kind === "booking"
                ? "Permintaan jadwal berhasil dicatat di server dan menunggu konfirmasi ketersediaan oleh admin."
                : "Permintaan penawaran telah tercatat di server. Tim kami akan menghubungi Anda segera."}
            </div>
          </div>
          <button
            type="button"
            onClick={copyReference}
            className="secondary-button text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto !bg-white"
          >
            <span className="symbol text-sm">{copiedRef ? "check" : "content_copy"}</span>
            {copiedRef ? "Tersalin!" : "Salin Kode"}
          </button>
        </div>

        {kind === "booking" && booking?.slot && (
          <div className="p-3 bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl flex items-center gap-3 text-xs text-[#52525b]">
            <span className="symbol text-lg text-[#18181a]">schedule</span>
            <div className="flex-1">
              <span className="font-semibold text-[#18181a]">Waktu Konsultasi yang Diajukan: </span>
              <span>
                {dateWib(success.slotStart || `${booking.date}T00:00:00+07:00`)} ·{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  timeZone: "Asia/Jakarta",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(success.slotStart || booking.slot))}{" "}
                WIB ({consultationModeLabels[booking.mode]})
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          {success.whatsappUrl && (
            <a
              className="primary-button text-center w-full justify-center gap-2"
              href={success.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="symbol text-lg">chat</span>
              Konfirmasi via WhatsApp
            </a>
          )}
          {kind === "booking" && calendar && (
            <a
              className="secondary-button text-center w-full justify-center gap-2"
              href={calendar}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="symbol text-lg">calendar_today</span>
              Simpan Jadwal ke Google Calendar
            </a>
          )}
          <button
            type="button"
            className="secondary-button text-center w-full justify-center"
            onClick={() => setSuccess(null)}
          >
            Kembali ke Formulir
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      {...props}
      className={`flex flex-col gap-5 ${props.className ?? ""}`.trim()}
    >
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3.5 bg-[#fee2e2] border border-[#fca5a5] rounded-xl flex items-center gap-2.5 text-xs text-[#991b1b]"
        >
          <span className="symbol text-lg text-[#b91c1c] shrink-0" aria-hidden="true">error</span>
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      {/* Honeypot field (hidden from legitimate users, captures bots) */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="opacity-0 absolute -z-50 w-0 h-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <label className="field" htmlFor="contact-name">
          NAMA LENGKAP *
          <input
            id="contact-name"
            {...register("name")}
            autoComplete="name"
            placeholder="cth. Nama Anda"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <span id="name-error" className="field-error">{errors.name.message}</span>
          ) : null}
        </label>
        <label className="field" htmlFor="contact-whatsapp">
          NOMOR WHATSAPP *
          <input
            id="contact-whatsapp"
            {...register("whatsapp")}
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            placeholder="08xxxxxxxxxx"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
          />
          {errors.whatsapp ? (
            <span id="whatsapp-error" className="field-error">{errors.whatsapp.message}</span>
          ) : (
            <span className="text-[10px]">
              Nomor Indonesia, format 08 atau 628.
            </span>
          )}
        </label>
        <label className="field" htmlFor="contact-email">
          ALAMAT EMAIL (OPSIONAL)
          <input
            id="contact-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="nama@instansi.go.id"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <span id="email-error" className="field-error">{errors.email.message}</span>
          ) : null}
        </label>
        <label className="field" htmlFor="contact-org">
          INSTANSI / BISNIS UMKM
          <input
            id="contact-org"
            {...register("organization")}
            autoComplete="organization"
            disabled={isSubmitting}
            placeholder="cth. Organisasi atau usaha Anda"
          />
        </label>
      </div>

      <label className="field" htmlFor="contact-service">
        KATEGORI MINAT LAYANAN *
        <select
          id="contact-service"
          {...register("service")}
          disabled={isSubmitting}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? "service-error" : undefined}
        >
          <option value="">Pilih kategori layanan</option>
          {[
            "Starter UMKM & Bisnis",
            "Sistem Informasi / Instansi",
            "Mobile Application (Flutter)",
            "Undangan Digital",
            "Kebutuhan Lainnya",
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        {errors.service ? (
          <span id="service-error" className="field-error">{errors.service.message}</span>
        ) : null}
      </label>

      <label className="field" htmlFor="contact-message">
        RINGKASAN KEBUTUHAN PROYEK *
        <textarea
          id="contact-message"
          {...register("message")}
          disabled={isSubmitting}
          placeholder="Jelaskan gambaran umum sistem yang ingin dibangun, target pengguna, atau ekspektasi tanggal peluncuran..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <span id="message-error" className="field-error">{errors.message.message}</span>
        ) : null}
      </label>

      <TurnstileWidget
        action={kind === "booking" ? "booking" : "inquiry"}
        onTokenChange={setTurnstileToken}
        resetKey={turnstileResetKey}
      />

      <label className="flex gap-3 items-start p-3 rounded-xl bg-[#f0f0f0] text-xs leading-4 text-[#52525b] w-full cursor-pointer">
        <input
          {...register("consent")}
          type="checkbox"
          disabled={isSubmitting}
          className="mt-1 accent-[#18181a]"
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />{" "}
        <span>
          {consentText || "Saya menyetujui OpenByte Labs memproses data yang saya kirim untuk menanggapi permintaan ini, sesuai"}{" "}
          {!consentText?.toLowerCase().includes("kebijakan privasi") ? (
            <Link href="/kebijakan-privasi" className="underline font-medium text-[#18181a]">
              Kebijakan Privasi
            </Link>
          ) : null}
          {consentText?.trim().endsWith(".") ? null : "."}
        </span>
      </label>
      {errors.consent ? (
        <span id="consent-error" className="field-error" role="alert">
          {errors.consent.message}
        </span>
      ) : null}
      {slotError ? (
        <span className="field-error" role="alert">
          {slotError}
        </span>
      ) : null}

      <button
        className="primary-button w-full min-h-[56px] justify-center text-sm font-semibold gap-2 disabled:opacity-50"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="symbol text-lg animate-spin" aria-hidden="true">
              refresh
            </span>
            <span>Memproses Permintaan...</span>
          </>
        ) : (
          <>
            <span className="symbol text-lg" aria-hidden="true">
              {kind === "booking" ? "event_available" : "send"}
            </span>
            <span>
              {kind === "booking"
                ? "Konfirmasi Reservasi Jadwal"
                : "Kirim Permintaan Penawaran"}
            </span>
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-2 text-[11px] leading-[14px] font-medium tracking-[0.22px] text-[#52525b] text-center w-full m-0">
        <span className="symbol text-base text-[#82b440]" aria-hidden="true">
          check_circle
        </span>
        {kind === "booking"
          ? "Setelah pengajuan, sistem menerbitkan nomor referensi unik dan tautan otomatis untuk ditambahkan ke Google Calendar."
          : "Setelah pengajuan, sistem menerbitkan nomor referensi unik yang dapat Anda simpan sebagai bukti permintaan."}
      </p>
    </form>
  );
}
