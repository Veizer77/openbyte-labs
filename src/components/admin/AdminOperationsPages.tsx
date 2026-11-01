"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AdminHeader, AdminSidebar } from "./AdminShell";
import {
  confirmBookingAction,
  listBookingsAction,
} from "@/actions/admin/bookings";
import {
  deleteAvailabilityAction,
  deleteBlockedDateAction,
  listScheduleAction,
  saveAvailabilityAction,
  saveBlockedDateAction,
} from "@/actions/admin/schedule";
import {
  listInquiriesAction,
  updateInquiryAction,
} from "@/actions/admin/inquiries";
import {
  listQuotesAction,
  updateQuoteStatusAction,
} from "@/actions/admin/quotes";
import type { BookingAdminDto } from "@/services/booking-admin";
import type { InquiryAdminDto } from "@/services/inquiry-admin";
import type { QuoteAdminDto } from "@/services/quote-admin";

type BookingStatus = BookingAdminDto["status"];
type InquiryStatus = InquiryAdminDto["status"];
type QuoteStatus = QuoteAdminDto["status"];

const bookingStatusLabel: Record<BookingStatus, string> = {
  pending: "Menunggu",
  confirmed: "Terkonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};
const inquiryStatusLabel: Record<InquiryStatus, string> = {
  new: "Baru",
  contacted: "Sudah dihubungi",
  converted: "Menjadi klien",
  dropped: "Tidak dilanjutkan",
};
const quoteStatusLabel: Record<QuoteStatus, string> = {
  new: "Baru",
  contacted: "Sudah dihubungi",
  converted: "Menjadi klien",
  dropped: "Tidak dilanjutkan",
};
const weekdayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function dateTime(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function dateOnly(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
  }).format(new Date(value));
}

function currency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function phoneUrl(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function PageFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="screen admin-screen relative flex min-h-screen w-full flex-col bg-[#f9f9f9]">
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[288px]">
        <AdminHeader />
        <main className="mx-auto flex w-full max-w-[1920px] flex-1 flex-col gap-5 bg-[#f9f9f9] px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-1">
            <div className="text-[11px] font-medium tracking-wide text-[#71717a]">
              ADMIN / OPERASIONAL KLIEN
            </div>
            <h1 className="m-0 text-2xl font-semibold tracking-tight text-[#18181a] sm:text-[28px]">
              {title}
            </h1>
            <p className="m-0 max-w-3xl text-sm leading-6 text-[#52525b]">
              {description}
            </p>
      </header>
          {children}
        </main>
      </div>
    </div>
  );
}

function Feedback({ error, status }: { error: string; status: string }) {
  return (
    <>
      {error ? (
        <p className="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="m-0 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">
          {status}
        </p>
      ) : null}
    </>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e4e4e7] bg-white p-4 shadow-[0px_1px_6px_#00000008] sm:p-5">
      {children}
    </section>
  );
}

const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#18181a] px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d4d4d8] bg-white px-3 py-2 text-sm font-medium text-[#27272a] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-50";
const inputClass =
  "min-h-10 w-full rounded-lg border border-[#d4d4d8] bg-white px-3 py-2 text-sm text-[#18181a] outline-none focus:border-[#586016] focus:ring-2 focus:ring-[#586016]/15";

function LoadingMessage({ loading }: { loading: boolean }) {
  return loading ? (
    <p className="m-0 text-sm text-[#71717a]" role="status">
      Memuat data…
    </p>
  ) : null;
}

export function AdminBookingPage() {
  const [tab, setTab] = useState<"bookings" | "weekly" | "blocked">("bookings");
  const [bookings, setBookings] = useState<BookingAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [meetingUrls, setMeetingUrls] = useState<Record<string, string>>({});
  const [whatsappLinks, setWhatsappLinks] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listBookingsAction({ limit: 100, offset: 0 });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setBookings(result.data);
    } catch {
      setError("Daftar booking tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function loadInitialBookings() {
      try {
        const result = await listBookingsAction({ limit: 100, offset: 0 });
        if (!active) return;
        if (!result.ok) setError(result.message);
        else setBookings(result.data);
      } catch {
        if (active) setError("Daftar booking tidak dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInitialBookings();
    return () => {
      active = false;
    };
  }, []);

  async function confirm(booking: BookingAdminDto) {
    const meetingUrl = meetingUrls[booking.id]?.trim() ?? "";
    if (booking.consultationMode === "google_meet" && !meetingUrl) {
      setError("Isi link Google Meet sebelum mengonfirmasi booking ini.");
      return;
    }
    setBusyId(booking.id);
    setError("");
    setStatus("");
    try {
      const result = await confirmBookingAction({ id: booking.id, meetingUrl });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setWhatsappLinks((current) => ({
        ...current,
        [booking.id]: result.data.whatsappUrl,
      }));
      setStatus(`Booking ${booking.reference} dikonfirmasi. Buka tautan WhatsApp untuk mengirim konfirmasi ke klien.`);
      await loadBookings();
    } catch {
      setError("Booking tidak dapat dikonfirmasi. Coba lagi.");
    } finally {
      setBusyId("");
    }
  }

  const visibleBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter,
  );
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <PageFrame
      title="Booking Konsultasi"
      description="Tinjau reservasi klien, konfirmasi jadwal, dan kelola slot mingguan serta tanggal libur."
    >
      <nav aria-label="Booking dan jadwal" className="flex flex-wrap gap-2">
        {([
          ["bookings", "Daftar Reservasi"],
          ["weekly", "Slot Mingguan"],
          ["blocked", "Tanggal Libur"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            className={tab === value ? buttonClass : secondaryButtonClass}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "bookings" ? (
        <>
          <Feedback error={error} status={status} />
          <Panel>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">Reservasi terbaru</h2>
                <p className="mb-0 mt-1 text-xs text-[#71717a]">
                  {pendingCount} menunggu konfirmasi · menampilkan maksimal 100 data terbaru
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  className={inputClass + " w-auto min-w-40"}
                  aria-label="Filter status booking"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as "all" | BookingStatus)}
                >
                  <option value="all">Semua status</option>
                  {Object.entries(bookingStatusLabel).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <button type="button" className={secondaryButtonClass} onClick={() => void loadBookings()}>
                  Muat ulang
                </button>
              </div>
            </div>
            <LoadingMessage loading={loading} />
            {!loading && visibleBookings.length === 0 ? (
              <p className="m-0 rounded-lg bg-[#f9f9f9] p-4 text-sm text-[#52525b]" role="status">
                Belum ada reservasi untuk filter ini.
              </p>
            ) : null}
            <div className="grid gap-3">
              {visibleBookings.map((booking) => (
                <article key={booking.id} className="grid gap-3 rounded-xl border border-[#e4e4e7] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="m-0 text-sm font-semibold text-[#18181a]">{booking.name}</h3>
                      <span className="rounded-full bg-[#f4f4f5] px-2 py-1 text-[11px] font-medium text-[#52525b]">
                        {bookingStatusLabel[booking.status]}
                      </span>
                      <span className="text-xs text-[#71717a]">{booking.reference}</span>
                    </div>
                    <dl className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                      <div><dt className="text-xs text-[#71717a]">Jadwal</dt><dd className="m-0 text-[#27272a]">{dateTime(booking.slotStart)}</dd></div>
                      <div><dt className="text-xs text-[#71717a]">Mode konsultasi</dt><dd className="m-0 text-[#27272a]">{booking.consultationMode === "google_meet" ? "Google Meet" : booking.consultationMode === "whatsapp_call" ? "WhatsApp Call" : "Tatap muka"}</dd></div>
                      <div><dt className="text-xs text-[#71717a]">WhatsApp</dt><dd className="m-0">{phoneUrl(booking.whatsapp) ? <a className="font-medium text-[#454a10] underline" href={phoneUrl(booking.whatsapp)!} target="_blank" rel="noreferrer">{booking.whatsapp}</a> : booking.whatsapp}</dd></div>
                      {booking.meetingUrl ? <div><dt className="text-xs text-[#71717a]">Link meeting</dt><dd className="m-0 break-all"><a className="text-[#454a10] underline" href={booking.meetingUrl} target="_blank" rel="noreferrer">Buka Google Meet</a></dd></div> : null}
                    </dl>
                    {whatsappLinks[booking.id] ? (
                      <a className="mt-3 inline-flex text-sm font-semibold text-[#454a10] underline" href={whatsappLinks[booking.id]} target="_blank" rel="noreferrer">
                        Buka pesan konfirmasi WhatsApp
                      </a>
                    ) : null}
                  </div>
                  {booking.status === "pending" ? (
                    <div className="flex flex-col justify-end gap-2">
                      {booking.consultationMode === "google_meet" ? (
                        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                          Link Google Meet
                          <input className={inputClass} type="url" inputMode="url" placeholder="https://meet.google.com/..." value={meetingUrls[booking.id] ?? ""} onChange={(event) => setMeetingUrls((current) => ({ ...current, [booking.id]: event.target.value }))} />
                        </label>
                      ) : null}
                      <button type="button" className={buttonClass} disabled={busyId === booking.id} onClick={() => void confirm(booking)}>
                        {busyId === booking.id ? "Mengonfirmasi…" : "Konfirmasi & siapkan WhatsApp"}
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </Panel>
        </>
      ) : tab === "weekly" ? (
        <WeeklySchedulePanel />
      ) : (
        <BlockedDatesPanel />
      )}
    </PageFrame>
  );
}

type ScheduleData = {
  availabilityRules: Array<{
    id: string;
    weekday: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
  blockedDates: Array<{
    id: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    reason: string;
  }>;
};

function useScheduleData() {
  const [data, setData] = useState<ScheduleData>({ availabilityRules: [], blockedDates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listScheduleAction();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setData(result.data);
    } catch {
      setError("Jadwal tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    async function loadInitialSchedule() {
      try {
        const result = await listScheduleAction();
        if (!active) return;
        if (!result.ok) setError(result.message);
        else setData(result.data);
      } catch {
        if (active) setError("Jadwal tidak dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInitialSchedule();
    return () => {
      active = false;
    };
  }, []);
  return { data, loading, error, setError, status, setStatus, refresh };
}

function WeeklySchedulePanel() {
  const { data, loading, error, setError, status, setStatus, refresh } = useScheduleData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setEditingId(null);
    setWeekday(1);
    setStartTime("09:00");
    setEndTime("17:00");
    setIsActive(true);
  }

  function edit(rule: ScheduleData["availabilityRules"][number]) {
    setEditingId(rule.id);
    setWeekday(rule.weekday);
    setStartTime(rule.startTime);
    setEndTime(rule.endTime);
    setIsActive(rule.isActive);
    setError("");
    setStatus("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await saveAvailabilityAction({
        id: editingId,
        value: { weekday, startTime, endTime, isActive },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Aturan slot mingguan tersimpan.");
      resetForm();
      await refresh();
    } catch {
      setError("Aturan jadwal gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Hapus aturan slot mingguan ini?")) return;
    setError("");
    setStatus("");
    try {
      const result = await deleteAvailabilityAction(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Aturan slot berhasil dihapus.");
      if (editingId === id) resetForm();
      await refresh();
    } catch {
      setError("Aturan slot gagal dihapus.");
    }
  }

  return (
    <>
      <Feedback error={error} status={status} />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-semibold">Aturan slot mingguan</h2>
              <p className="mb-0 mt-1 text-xs text-[#71717a]">Perubahan tersinkron dengan validasi booking dan anti double-booking.</p>
            </div>
            <button type="button" className={secondaryButtonClass} onClick={() => void refresh()}>Muat ulang</button>
          </div>
          <LoadingMessage loading={loading} />
          {!loading && data.availabilityRules.length === 0 ? <p className="m-0 rounded-lg bg-[#f9f9f9] p-4 text-sm text-[#52525b]">Belum ada slot mingguan yang dikonfigurasi.</p> : null}
          <div className="grid gap-2">
            {data.availabilityRules.map((rule) => (
              <div key={rule.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e4e4e7] p-3">
                <div>
                  <p className="m-0 text-sm font-semibold">{weekdayNames[rule.weekday]} · {rule.startTime}–{rule.endTime}</p>
                  <p className="mb-0 mt-1 text-xs text-[#71717a]">{rule.isActive ? "Aktif" : "Nonaktif"}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className={secondaryButtonClass} onClick={() => edit(rule)}>Edit</button>
                  <button type="button" className={secondaryButtonClass} onClick={() => void remove(rule.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 mt-0 text-base font-semibold">{editingId ? "Ubah aturan" : "Tambah slot mingguan"}</h2>
          <form className="grid gap-3" onSubmit={(event) => void save(event)}>
            <label className="grid gap-1.5 text-sm font-medium">Hari
              <select className={inputClass} value={weekday} onChange={(event) => setWeekday(Number(event.target.value))}>
                {weekdayNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-sm font-medium">Mulai<input className={inputClass} type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Selesai<input className={inputClass} type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />Aktif untuk booking publik</label>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className={buttonClass} disabled={saving}>{saving ? "Menyimpan…" : editingId ? "Simpan perubahan" : "Tambah slot"}</button>
              {editingId ? <button type="button" className={secondaryButtonClass} onClick={resetForm}>Batal</button> : null}
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}

function BlockedDatesPanel() {
  const { data, loading, error, setError, status, setStatus, refresh } = useScheduleData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setEditingId(null);
    setDate("");
    setAllDay(true);
    setStartTime("09:00");
    setEndTime("17:00");
    setReason("");
  }

  function edit(item: ScheduleData["blockedDates"][number]) {
    setEditingId(item.id);
    setDate(item.date);
    setAllDay(item.startTime === null);
    setStartTime(item.startTime ?? "09:00");
    setEndTime(item.endTime ?? "17:00");
    setReason(item.reason);
    setError("");
    setStatus("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await saveBlockedDateAction({
        id: editingId,
        value: {
          date,
          startTime: allDay ? null : startTime,
          endTime: allDay ? null : endTime,
          reason,
        },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Tanggal libur tersimpan.");
      resetForm();
      await refresh();
    } catch {
      setError("Tanggal libur gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Hapus tanggal libur ini?")) return;
    setError("");
    setStatus("");
    try {
      const result = await deleteBlockedDateAction(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Tanggal libur berhasil dihapus.");
      if (editingId === id) resetForm();
      await refresh();
    } catch {
      setError("Tanggal libur gagal dihapus.");
    }
  }

  return (
    <>
      <Feedback error={error} status={status} />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="m-0 text-base font-semibold">Tanggal yang diblokir</h2><p className="mb-0 mt-1 text-xs text-[#71717a]">Blokir satu hari penuh atau rentang waktu tertentu.</p></div>
            <button type="button" className={secondaryButtonClass} onClick={() => void refresh()}>Muat ulang</button>
          </div>
          <LoadingMessage loading={loading} />
          {!loading && data.blockedDates.length === 0 ? <p className="m-0 rounded-lg bg-[#f9f9f9] p-4 text-sm text-[#52525b]">Belum ada tanggal libur.</p> : null}
          <div className="grid gap-2">
            {data.blockedDates.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e4e4e7] p-3">
                <div><p className="m-0 text-sm font-semibold">{dateOnly(`${item.date}T12:00:00Z`)}{item.startTime ? ` · ${item.startTime}–${item.endTime}` : " · Seharian"}</p><p className="mb-0 mt-1 text-xs text-[#71717a]">{item.reason || "Tanpa keterangan"}</p></div>
                <div className="flex gap-2"><button type="button" className={secondaryButtonClass} onClick={() => edit(item)}>Edit</button><button type="button" className={secondaryButtonClass} onClick={() => void remove(item.id)}>Hapus</button></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 mt-0 text-base font-semibold">{editingId ? "Ubah tanggal libur" : "Tambah tanggal libur"}</h2>
          <form className="grid gap-3" onSubmit={(event) => void save(event)}>
            <label className="grid gap-1.5 text-sm font-medium">Tanggal<input className={inputClass} type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allDay} onChange={(event) => setAllDay(event.target.checked)} />Blokir sepanjang hari</label>
            {!allDay ? <div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-sm font-medium">Mulai<input className={inputClass} type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label className="grid gap-1.5 text-sm font-medium">Selesai<input className={inputClass} type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div> : null}
            <label className="grid gap-1.5 text-sm font-medium">Keterangan<input className={inputClass} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Contoh: cuti atau hari libur" /></label>
            <div className="flex flex-wrap gap-2"><button type="submit" className={buttonClass} disabled={saving}>{saving ? "Menyimpan…" : editingId ? "Simpan perubahan" : "Tambah tanggal"}</button>{editingId ? <button type="button" className={secondaryButtonClass} onClick={resetForm}>Batal</button> : null}</div>
          </form>
        </Panel>
      </div>
    </>
  );
}

export function AdminInquiryPage() {
  const [items, setItems] = useState<InquiryAdminDto[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { status: InquiryStatus; adminNotes: string }>>({});
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listInquiriesAction({ limit: 100, offset: 0 });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems(result.data);
      setDrafts(Object.fromEntries(result.data.map((item) => [
        item.id,
        { status: item.status, adminNotes: item.adminNotes },
      ])));
    } catch {
      setError("Daftar inquiry tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    async function loadInitialInquiries() {
      try {
        const result = await listInquiriesAction({ limit: 100, offset: 0 });
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setItems(result.data);
        setDrafts(Object.fromEntries(result.data.map((item) => [item.id, { status: item.status, adminNotes: item.adminNotes }])));
      } catch {
        if (active) setError("Daftar inquiry tidak dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInitialInquiries();
    return () => {
      active = false;
    };
  }, []);

  const visible = items.filter((item) => {
    const matchesStatus = filter === "all" || (drafts[item.id]?.status ?? item.status) === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [item.name, item.reference, item.message, item.email ?? ""].some((value) => value.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;
  const newCount = items.filter((item) => item.status === "new").length;

  async function saveInquiry(item: InquiryAdminDto) {
    const draft = drafts[item.id] ?? { status: item.status, adminNotes: item.adminNotes };
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await updateInquiryAction({ id: item.id, value: draft });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, ...draft } : row));
      setStatus(`Inquiry ${item.reference} berhasil diperbarui.`);
    } catch {
      setError("Inquiry gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  }

  const selectedDraft = selected ? drafts[selected.id] ?? { status: selected.status, adminNotes: selected.adminNotes } : null;
  const contactLink = selected ? phoneUrl(selected.whatsapp) : null;

  return (
    <PageFrame title="Inquiry & Pemesanan" description="Tindak lanjuti permintaan dari formulir publik, catat komunikasi, dan kelola status prospek.">
      <Feedback error={error} status={status} />
      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="m-0 text-base font-semibold">Pipa inquiry</h2><p className="mb-0 mt-1 text-xs text-[#71717a]">{newCount} inquiry baru · maksimal 100 data terbaru</p></div>
          <button type="button" className={secondaryButtonClass} onClick={() => void refresh()}>Muat ulang</button>
        </div>
        <LoadingMessage loading={loading} />
        <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px]">
          <input className={inputClass} type="search" placeholder="Cari nama, referensi, email, atau pesan" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className={inputClass} aria-label="Filter status inquiry" value={filter} onChange={(event) => setFilter(event.target.value as "all" | InquiryStatus)}>
            <option value="all">Semua status</option>{Object.entries(inquiryStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        {!loading && visible.length === 0 ? <p className="m-0 rounded-lg bg-[#f9f9f9] p-4 text-sm text-[#52525b]" role="status">Tidak ada inquiry yang cocok.</p> : null}
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.5fr)]">
          <div className="grid content-start gap-2">
            {visible.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`rounded-xl border p-3 text-left ${selected?.id === item.id ? "border-[#586016] bg-[#f7f8ec]" : "border-[#e4e4e7] bg-white hover:bg-[#fafafa]"}`}>
                <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-[#18181a]">{item.name}</span><span className="shrink-0 text-[11px] text-[#71717a]">{inquiryStatusLabel[drafts[item.id]?.status ?? item.status]}</span></span>
                <span className="mt-1 block text-xs text-[#52525b]">{item.reference} · {dateOnly(item.createdAt)}</span>
                <span className="mt-2 line-clamp-2 block text-xs text-[#71717a]">{item.message}</span>
              </button>
            ))}
          </div>
          {selected && selectedDraft ? (
            <section className="rounded-xl border border-[#e4e4e7] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="m-0 text-lg font-semibold">{selected.name}</h3><p className="mb-0 mt-1 text-xs text-[#71717a]">{selected.reference} · {dateTime(selected.createdAt)}</p></div>
                <span className="rounded-full bg-[#f4f4f5] px-2 py-1 text-xs">{selected.source === "package" ? "Paket" : selected.source === "calculator" ? "Kalkulator" : "Kontak"}</span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-[#71717a]">WhatsApp</dt><dd className="m-0">{contactLink ? <a className="font-medium text-[#454a10] underline" href={contactLink} target="_blank" rel="noreferrer">{selected.whatsapp}</a> : selected.whatsapp}</dd></div>
                <div><dt className="text-xs text-[#71717a]">Email</dt><dd className="m-0 break-all">{selected.email || "—"}</dd></div>
                <div><dt className="text-xs text-[#71717a]">Organisasi</dt><dd className="m-0">{selected.organizationOrBusiness || "—"}</dd></div>
                <div><dt className="text-xs text-[#71717a]">Paket</dt><dd className="m-0">{selected.packageName || "—"}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs text-[#71717a]">Pesan</dt><dd className="m-0 whitespace-pre-wrap">{selected.message}</dd></div>
              </dl>
              <div className="mt-5 grid gap-3 border-t border-[#e4e4e7] pt-4">
                <label className="grid gap-1.5 text-sm font-medium">Status
                  <select className={inputClass} value={selectedDraft.status} onChange={(event) => setDrafts((current) => ({ ...current, [selected.id]: { ...selectedDraft, status: event.target.value as InquiryStatus } }))}>
                    {Object.entries(inquiryStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium">Catatan internal
                  <textarea className={inputClass + " min-h-28 resize-y"} maxLength={5000} value={selectedDraft.adminNotes} onChange={(event) => setDrafts((current) => ({ ...current, [selected.id]: { ...selectedDraft, adminNotes: event.target.value } }))} placeholder="Catatan tindak lanjut, kebutuhan klien, atau jadwal komunikasi" />
                </label>
                <button type="button" className={buttonClass} disabled={saving} onClick={() => void saveInquiry(selected)}>{saving ? "Menyimpan…" : "Simpan tindak lanjut"}</button>
              </div>
            </section>
          ) : null}
        </div>
      </Panel>
    </PageFrame>
  );
}

export function AdminQuotePage() {
  const [items, setItems] = useState<QuoteAdminDto[]>([]);
  const [filter, setFilter] = useState<"all" | QuoteStatus>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listQuotesAction({ limit: 100, offset: 0 });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems(result.data);
    } catch {
      setError("Daftar quote tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    async function loadInitialQuotes() {
      try {
        const result = await listQuotesAction({ limit: 100, offset: 0 });
        if (!active) return;
        if (!result.ok) setError(result.message);
        else setItems(result.data);
      } catch {
        if (active) setError("Daftar quote tidak dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInitialQuotes();
    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(item: QuoteAdminDto, nextStatus: QuoteStatus) {
    setBusyId(item.id);
    setError("");
    setStatus("");
    try {
      const result = await updateQuoteStatusAction({ id: item.id, status: nextStatus });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, status: nextStatus } : row));
      setStatus(`Status quote ${item.reference} diperbarui menjadi “${quoteStatusLabel[nextStatus]}”.`);
    } catch {
      setError("Status quote gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  const visible = items.filter((item) => filter === "all" || item.status === filter);
  const newCount = items.filter((item) => item.status === "new").length;

  return (
    <PageFrame title="Quote Kalkulator" description="Tinjau snapshot estimasi dari kalkulator publik dan catat tindak lanjut status penawaran.">
      <Feedback error={error} status={status} />
      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="m-0 text-base font-semibold">Riwayat estimasi</h2><p className="mb-0 mt-1 text-xs text-[#71717a]">{newCount} quote baru · maksimal 100 data terbaru</p></div>
          <div className="flex gap-2">
            <select className={inputClass + " w-auto min-w-40"} aria-label="Filter status quote" value={filter} onChange={(event) => setFilter(event.target.value as "all" | QuoteStatus)}><option value="all">Semua status</option>{Object.entries(quoteStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <button type="button" className={secondaryButtonClass} onClick={() => void refresh()}>Muat ulang</button>
          </div>
        </div>
        <LoadingMessage loading={loading} />
        {!loading && visible.length === 0 ? <p className="m-0 rounded-lg bg-[#f9f9f9] p-4 text-sm text-[#52525b]" role="status">Belum ada quote untuk filter ini.</p> : null}
        <div className="grid gap-3">
          {visible.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#e4e4e7] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="m-0 text-sm font-semibold">{item.contactName || "Klien tanpa nama"}</h3><p className="mb-0 mt-1 text-xs text-[#71717a]">{item.reference} · {dateTime(item.createdAt)}</p></div>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">Status
                  <select className={inputClass + " min-w-44"} value={item.status} disabled={busyId === item.id} onChange={(event) => void updateStatus(item, event.target.value as QuoteStatus)}>
                    {Object.entries(quoteStatusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-[#f9f9f9] p-3"><p className="m-0 text-xs text-[#71717a]">Estimasi biaya</p><p className="mb-0 mt-1 text-sm font-semibold">{currency(item.priceMin)}{item.priceMax !== item.priceMin ? ` – ${currency(item.priceMax)}` : ""}</p></div>
                <div className="rounded-lg bg-[#f9f9f9] p-3"><p className="m-0 text-xs text-[#71717a]">Estimasi durasi</p><p className="mb-0 mt-1 text-sm font-semibold">{item.daysMin === item.daysMax ? `${item.daysMin} hari` : `${item.daysMin}–${item.daysMax} hari`}</p></div>
                <div className="rounded-lg bg-[#f9f9f9] p-3"><p className="m-0 text-xs text-[#71717a]">WhatsApp</p><p className="mb-0 mt-1 text-sm font-semibold">{item.contactWhatsapp ? phoneUrl(item.contactWhatsapp) ? <a className="text-[#454a10] underline" href={phoneUrl(item.contactWhatsapp)!} target="_blank" rel="noreferrer">{item.contactWhatsapp}</a> : item.contactWhatsapp : "Belum diberikan"}</p></div>
              </div>
              <details className="mt-3 rounded-lg border border-[#e4e4e7] px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium">Rincian pilihan ({item.selection.length})</summary>
                {item.selection.length ? <ul className="mb-1 mt-3 grid gap-1 pl-5 text-sm text-[#52525b]">{item.selection.map((selection) => <li key={selection.itemId}>{selection.label}{selection.units > 1 ? ` × ${selection.units}` : ""}</li>)}</ul> : <p className="mb-1 mt-3 text-sm text-[#71717a]">Tidak ada rincian pilihan.</p>}
              </details>
            </article>
          ))}
        </div>
      </Panel>
    </PageFrame>
  );
}
