"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "./AdminFrame";
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
import { BentoCard, Chip, EmptyState, SearchField, TabFilter, ToolbarButton } from "./AdminUi";
import { LeadConversionPanel } from "./LeadConversionPanel";

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

function Feedback({ error, status }: { error: string; status: string }) {
  return (
    <>
      {error ? (
        <div
          className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2"
          role="alert"
        >
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}
      {status ? (
        <div
          className="mb-4 rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900 flex items-center gap-2"
          role="status"
        >
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}
    </>
  );
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

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
      setStatus(
        `Booking ${booking.reference} dikonfirmasi. Buka tautan WhatsApp untuk mengirim konfirmasi ke klien.`
      );
      await loadBookings();
    } catch {
      setError("Booking tidak dapat dikonfirmasi. Coba lagi.");
    } finally {
      setBusyId("");
    }
  }

  const visibleBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <AdminFrame
      title="Manajemen Booking & Jadwal Konsultasi"
      description="Verifikasi reservasi klien, atur link Google Meet, dan kelola slot mingguan serta tanggal libur."
      screenKey="cms/booking-konsultasi"
      actions={
        <ToolbarButton
          variant="light"
          icon="sync"
          onClick={() => void loadBookings()}
        >
          Refresh Data
        </ToolbarButton>
      }
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#eaeaea] pb-4">
        <TabFilter
          tabs={[
            { id: "bookings", label: "Daftar Reservasi", count: bookings.length },
            { id: "weekly", label: "Slot Mingguan" },
            { id: "blocked", label: "Tanggal Libur" },
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab === "bookings" ? (
          <div className="flex items-center gap-2">
            <select
              className="h-[34px] rounded-[10px] bg-[#f0f0f0] px-3 text-xs font-medium text-[#18181a] outline-none"
              aria-label="Filter status booking"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | BookingStatus)}
            >
              <option value="all">Semua Status</option>
              {Object.entries(bookingStatusLabel).map(([val, lbl]) => (
                <option key={val} value={val}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <Feedback error={error} status={status} />

      {tab === "bookings" ? (
        <div className="flex flex-col gap-4">
          {pendingCount > 0 && filter === "all" ? (
            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#ffedd5] bg-[#fff7ed] p-3.5 text-xs text-[#c2410c]">
              <div className="flex items-center gap-2">
                <span className="symbol text-lg">priority_high</span>
                <span className="font-semibold">{pendingCount} reservasi menunggu konfirmasi</span>
              </div>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className="font-medium underline hover:text-[#9a3412]"
              >
                Tampilkan Hanya Menunggu
              </button>
            </div>
          ) : null}

          {loading ? (
            <BentoCard>
              <p className="m-0 text-center text-xs text-[#71717a]">Memuat data booking…</p>
            </BentoCard>
          ) : visibleBookings.length === 0 ? (
            <EmptyState
              icon="calendar_month"
              title="Belum ada reservasi"
              description="Tidak ditemukan data reservasi konsultasi yang sesuai dengan filter yang dipilih."
            />
          ) : (
            <div className="grid gap-3">
              {visibleBookings.map((booking) => {
                const isPending = booking.status === "pending";
                const isConfirmed = booking.status === "confirmed";
                const statusVariant = isPending
                  ? "warning"
                  : isConfirmed
                  ? "success"
                  : booking.status === "cancelled"
                  ? "danger"
                  : "neutral";

                return (
                  <BentoCard key={booking.id} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                            {booking.name}
                          </h3>
                          <Chip variant={statusVariant} size="sm">
                            {bookingStatusLabel[booking.status]}
                          </Chip>
                          <span className="text-[11px] text-[#71717a] font-mono">
                            {booking.reference}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[#52525b]">
                          <div className="flex items-center gap-1.5">
                            <span className="symbol text-base text-[#71717a]">schedule</span>
                            <span>{dateTime(booking.slotStart)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="symbol text-base text-[#71717a]">videocam</span>
                            <span>
                              {booking.consultationMode === "google_meet"
                                ? "Google Meet"
                                : booking.consultationMode === "whatsapp_call"
                                ? "WhatsApp Call"
                                : "Tatap Muka"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="symbol text-base text-[#71717a]">chat</span>
                            {phoneUrl(booking.whatsapp) ? (
                              <a
                                href={phoneUrl(booking.whatsapp)!}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#18181a] font-medium underline"
                              >
                                {booking.whatsapp}
                              </a>
                            ) : (
                              booking.whatsapp
                            )}
                          </div>
                        </div>

                        {booking.meetingUrl ? (
                          <div className="mt-2 text-xs">
                            <a
                              href={booking.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#454a10] font-medium underline"
                            >
                              <span className="symbol text-sm">open_in_new</span>
                              Buka Link Google Meet
                            </a>
                          </div>
                        ) : null}

                        {whatsappLinks[booking.id] ? (
                          <div className="mt-3">
                            <a
                              href={whatsappLinks[booking.id]}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#e2e89d] px-3 py-1.5 text-xs font-semibold text-[#454a10] hover:bg-[#d2d88f] transition-colors"
                            >
                              <span className="symbol text-base">send</span>
                              Buka Pesan Konfirmasi WhatsApp
                            </a>
                          </div>
                        ) : null}
                      </div>

                      {isPending ? (
                        <div className="flex flex-col gap-2 min-w-[280px]">
                          {booking.consultationMode === "google_meet" ? (
                            <input
                              className={inputClass}
                              type="url"
                              placeholder="https://meet.google.com/..."
                              value={meetingUrls[booking.id] ?? ""}
                              onChange={(e) =>
                                setMeetingUrls((curr) => ({
                                  ...curr,
                                  [booking.id]: e.target.value,
                                }))
                              }
                            />
                          ) : null}
                          <ToolbarButton
                            variant="dark"
                            icon="task_alt"
                            disabled={busyId === booking.id}
                            onClick={() => void confirm(booking)}
                          >
                            {busyId === booking.id
                              ? "Mengonfirmasi…"
                              : "Konfirmasi & Kirim WA"}
                          </ToolbarButton>
                        </div>
                      ) : null}
                    </div>
                  </BentoCard>
                );
              })}
            </div>
          )}
        </div>
      ) : tab === "weekly" ? (
        <WeeklySchedulePanel />
      ) : (
        <BlockedDatesPanel />
      )}
    </AdminFrame>
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
  const [data, setData] = useState<ScheduleData>({
    availabilityRules: [],
    blockedDates: [],
  });
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
  const { data, loading, error, setError, status, setStatus, refresh } =
    useScheduleData();
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
      setStatus("Aturan jadwal mingguan berhasil disimpan.");
      resetForm();
      await refresh();
    } catch {
      setError("Aturan jadwal gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Hapus aturan jadwal ini?")) return;
    setError("");
    setStatus("");
    try {
      const result = await deleteAvailabilityAction(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Aturan jadwal dihapus.");
      if (editingId === id) resetForm();
      await refresh();
    } catch {
      setError("Aturan jadwal gagal dihapus.");
    }
  }

  return (
    <>
      <Feedback error={error} status={status} />
      <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Slot Mingguan Aktif
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Jam operasional reservasi konsultasi rutin setiap minggu
              </p>
            </div>
            <ToolbarButton variant="light" icon="sync" onClick={() => void refresh()}>
              Refresh
            </ToolbarButton>
          </div>

          {loading ? (
            <p className="text-xs text-[#71717a]">Memuat slot mingguan…</p>
          ) : data.availabilityRules.length === 0 ? (
            <EmptyState
              icon="calendar_today"
              title="Belum ada slot mingguan"
              description="Tambahkan jam operasional mingguan lewat formulir di samping."
            />
          ) : (
            <div className="grid gap-2">
              {data.availabilityRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eaeaea] p-3.5 bg-[#fafafa] hover:bg-white transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#18181a]">
                        {weekdayNames[rule.weekday]}
                      </span>
                      <Chip variant={rule.isActive ? "success" : "neutral"} size="sm">
                        {rule.isActive ? "Aktif" : "Nonaktif"}
                      </Chip>
                    </div>
                    <div className="mt-1 text-xs text-[#71717a]">
                      {rule.startTime} – {rule.endTime} WIB
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <ToolbarButton variant="light" onClick={() => edit(rule)}>
                      Edit
                    </ToolbarButton>
                    <ToolbarButton
                      variant="danger"
                      onClick={() => void remove(rule.id)}
                    >
                      Hapus
                    </ToolbarButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>

        <BentoCard>
          <h2 className="mb-4 mt-0 text-base font-semibold text-[#18181a]">
            {editingId ? "Ubah Slot Mingguan" : "Tambah Slot Mingguan"}
          </h2>
          <form className="grid gap-3.5" onSubmit={(e) => void save(e)}>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Hari
              <select
                className={inputClass}
                value={weekday}
                onChange={(e) => setWeekday(Number(e.target.value))}
              >
                {weekdayNames.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Jam Mulai
                <input
                  className={inputClass}
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Jam Selesai
                <input
                  className={inputClass}
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-[#d4d4d8]"
              />
              Slot Aktif
            </label>

            <div className="flex gap-2 pt-2">
              <ToolbarButton
                variant="dark"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan…"
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Slot"}
              </ToolbarButton>
              {editingId ? (
                <ToolbarButton variant="light" onClick={resetForm}>
                  Batal
                </ToolbarButton>
              ) : null}
            </div>
          </form>
        </BentoCard>
      </div>
    </>
  );
}

function BlockedDatesPanel() {
  const { data, loading, error, setError, status, setStatus, refresh } =
    useScheduleData();
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
      <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Tanggal yang Diblokir
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Blokir satu hari penuh atau rentang jam tertentu dari kalender publik
              </p>
            </div>
            <ToolbarButton variant="light" icon="sync" onClick={() => void refresh()}>
              Refresh
            </ToolbarButton>
          </div>

          {loading ? (
            <p className="text-xs text-[#71717a]">Memuat tanggal libur…</p>
          ) : data.blockedDates.length === 0 ? (
            <EmptyState
              icon="event_busy"
              title="Belum ada tanggal libur"
              description="Tidak ada tanggal yang sedang diblokir untuk reservasi."
            />
          ) : (
            <div className="grid gap-2">
              {data.blockedDates.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eaeaea] p-3.5 bg-[#fafafa] hover:bg-white transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#18181a]">
                      {dateOnly(`${item.date}T12:00:00Z`)}
                      {item.startTime
                        ? ` · ${item.startTime}–${item.endTime}`
                        : " · Seharian"}
                    </div>
                    <div className="mt-1 text-xs text-[#71717a]">
                      {item.reason || "Tanpa keterangan"}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <ToolbarButton variant="light" onClick={() => edit(item)}>
                      Edit
                    </ToolbarButton>
                    <ToolbarButton
                      variant="danger"
                      onClick={() => void remove(item.id)}
                    >
                      Hapus
                    </ToolbarButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>

        <BentoCard>
          <h2 className="mb-4 mt-0 text-base font-semibold text-[#18181a]">
            {editingId ? "Ubah Tanggal Libur" : "Tambah Tanggal Libur"}
          </h2>
          <form className="grid gap-3.5" onSubmit={(e) => void save(e)}>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Tanggal
              <input
                className={inputClass}
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="rounded border-[#d4d4d8]"
              />
              Blokir Sepanjang Hari
            </label>

            {!allDay ? (
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Jam Mulai
                  <input
                    className={inputClass}
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Jam Selesai
                  <input
                    className={inputClass}
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </label>
              </div>
            ) : null}

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Keterangan
              <input
                className={inputClass}
                maxLength={1000}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: cuti bersama atau hari libur nasional"
              />
            </label>

            <div className="flex gap-2 pt-2">
              <ToolbarButton
                variant="dark"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan…"
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Tanggal"}
              </ToolbarButton>
              {editingId ? (
                <ToolbarButton variant="light" onClick={resetForm}>
                  Batal
                </ToolbarButton>
              ) : null}
            </div>
          </form>
        </BentoCard>
      </div>
    </>
  );
}

export function AdminInquiryPage() {
  const [items, setItems] = useState<InquiryAdminDto[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [drafts, setDrafts] = useState<
    Record<string, { status: InquiryStatus; adminNotes: string }>
  >({});
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
      setDrafts(
        Object.fromEntries(
          result.data.map((item) => [
            item.id,
            { status: item.status, adminNotes: item.adminNotes },
          ])
        )
      );
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
        setDrafts(
          Object.fromEntries(
            result.data.map((item) => [
              item.id,
              { status: item.status, adminNotes: item.adminNotes },
            ])
          )
        );
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
    const matchesStatus =
      filter === "all" || (drafts[item.id]?.status ?? item.status) === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [item.name, item.reference, item.message, item.email ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      );
    return matchesStatus && matchesSearch;
  });

  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;
  const newCount = items.filter((item) => item.status === "new").length;

  async function saveInquiry(item: InquiryAdminDto) {
    const draft = drafts[item.id] ?? {
      status: item.status,
      adminNotes: item.adminNotes,
    };
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await updateInquiryAction({ id: item.id, value: draft });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, ...draft } : row))
      );
      setStatus(`Inquiry ${item.reference} berhasil diperbarui.`);
    } catch {
      setError("Inquiry gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  }

  const selectedDraft = selected
    ? drafts[selected.id] ?? {
        status: selected.status,
        adminNotes: selected.adminNotes,
      }
    : null;
  const contactLink = selected ? phoneUrl(selected.whatsapp) : null;

  return (
    <AdminFrame
      title="Inquiry & Pemesanan"
      description="Tindak lanjuti prospek masuk dari formulir paket dan tombol WhatsApp resmi."
      screenKey="cms/inquiry-pemesanan"
      actions={
        <ToolbarButton variant="light" icon="sync" onClick={() => void refresh()}>
          Refresh Data
        </ToolbarButton>
      }
    >
      <Feedback error={error} status={status} />

      {/* Pipeline Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Total Leads</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{items.length}</div>
        </div>
        <div className="rounded-[14px] border border-[#ffedd5] bg-[#fff7ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#c2410c]">Inquiry Baru</div>
          <div className="text-2xl font-semibold text-[#c2410c] mt-1">{newCount}</div>
        </div>
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Sudah Dihubungi</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">
            {items.filter((i) => i.status === "contacted").length}
          </div>
        </div>
        <div className="rounded-[14px] border border-[#d6eed3] bg-[#eef8ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#457c1d]">Jadi Klien</div>
          <div className="text-2xl font-semibold text-[#457c1d] mt-1">
            {items.filter((i) => i.status === "converted").length}
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Cari nama, email, pesan..."
          />
        </div>
        <TabFilter
          tabs={[
            { id: "all", label: "Semua", count: items.length },
            { id: "new", label: "Baru", count: newCount },
            {
              id: "contacted",
              label: "Dihubungi",
              count: items.filter((i) => i.status === "contacted").length,
            },
            {
              id: "converted",
              label: "Klien",
              count: items.filter((i) => i.status === "converted").length,
            },
            {
              id: "dropped",
              label: "Dibatalkan",
              count: items.filter((i) => i.status === "dropped").length,
            },
          ]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {loading ? (
        <BentoCard>
          <p className="text-center text-xs text-[#71717a]">Memuat data inquiry…</p>
        </BentoCard>
      ) : visible.length === 0 ? (
        <EmptyState
          icon="contact_mail"
          title="Tidak ada inquiry yang cocok"
          description="Coba ubah kata kunci pencarian atau ganti filter status."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1.4fr] items-start">
          {/* List leads */}
          <div className="flex flex-col gap-2.5">
            {visible.map((item) => {
              const isSelected = selected?.id === item.id;
              const currentStatus = drafts[item.id]?.status ?? item.status;
              const statusVariant =
                currentStatus === "new"
                  ? "warning"
                  : currentStatus === "converted"
                  ? "success"
                  : currentStatus === "dropped"
                  ? "danger"
                  : "neutral";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-[14px] border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#18181a] bg-white shadow-md ring-1 ring-[#18181a]"
                      : "border-[#eaeaea] bg-white hover:bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#18181a] truncate">
                      {item.name}
                    </span>
                    <Chip variant={statusVariant} size="sm">
                      {inquiryStatusLabel[currentStatus]}
                    </Chip>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#71717a]">
                    <span className="font-mono">{item.reference}</span>
                    <span>·</span>
                    <span>{dateOnly(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#52525b] line-clamp-2 m-0">
                    {item.message}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Inspector Panel */}
          {selected && selectedDraft ? (
            <BentoCard className="sticky top-20">
              <div className="flex items-start justify-between gap-3 border-b border-[#eaeaea] pb-4">
                <div>
                  <h3 className="m-0 text-base font-semibold text-[#18181a]">
                    {selected.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#71717a]">
                    {selected.reference} · Masuk pada {dateTime(selected.createdAt)}
                  </p>
                </div>
                <Chip variant="neutral">
                  Sumber:{" "}
                  {selected.source === "package"
                    ? "Paket"
                    : selected.source === "calculator"
                    ? "Kalkulator"
                    : "Form Kontak"}
                </Chip>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-[10px] bg-[#f9f9f9] p-3">
                  <span className="text-[11px] text-[#71717a] block mb-1">WhatsApp</span>
                  {contactLink ? (
                    <a
                      href={contactLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#18181a] underline flex items-center gap-1"
                    >
                      <span className="symbol text-sm text-[#82b440]">chat</span>
                      {selected.whatsapp}
                    </a>
                  ) : (
                    <span>{selected.whatsapp}</span>
                  )}
                </div>

                <div className="rounded-[10px] bg-[#f9f9f9] p-3">
                  <span className="text-[11px] text-[#71717a] block mb-1">Email</span>
                  <span className="font-medium text-[#18181a] break-all">
                    {selected.email || "—"}
                  </span>
                </div>

                <div className="rounded-[10px] bg-[#f9f9f9] p-3">
                  <span className="text-[11px] text-[#71717a] block mb-1">Organisasi / Usaha</span>
                  <span className="font-medium text-[#18181a]">
                    {selected.organizationOrBusiness || "—"}
                  </span>
                </div>

                <div className="rounded-[10px] bg-[#f9f9f9] p-3">
                  <span className="text-[11px] text-[#71717a] block mb-1">Paket yang Diminati</span>
                  <span className="font-medium text-[#18181a]">
                    {selected.packageName || "—"}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-[12px] border border-[#eaeaea] p-3.5 bg-[#fcfcfc]">
                <span className="text-[11px] font-medium text-[#71717a] block mb-1">
                  Pesan Klien
                </span>
                <p className="m-0 text-xs text-[#18181a] whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="mt-5 border-t border-[#eaeaea] pt-4 grid gap-3.5">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Status Tindak Lanjut
                  <select
                    className={inputClass}
                    value={selectedDraft.status}
                    onChange={(e) =>
                      setDrafts((curr) => ({
                        ...curr,
                        [selected.id]: {
                          ...selectedDraft,
                          status: e.target.value as InquiryStatus,
                        },
                      }))
                    }
                  >
                    {Object.entries(inquiryStatusLabel).map(([val, lbl]) => (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Catatan Internal
                  <textarea
                    className="min-h-24 w-full rounded-[10px] bg-[#f0f0f0] p-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all resize-y"
                    maxLength={5000}
                    value={selectedDraft.adminNotes}
                    onChange={(e) =>
                      setDrafts((curr) => ({
                        ...curr,
                        [selected.id]: {
                          ...selectedDraft,
                          adminNotes: e.target.value,
                        },
                      }))
                    }
                    placeholder="Catatan tindak lanjut, kebutuhan spesifik klien, atau hasil diskusi..."
                  />
                </label>

                <ToolbarButton
                  variant="dark"
                  icon="save"
                  disabled={saving}
                  onClick={() => void saveInquiry(selected)}
                >
                  {saving ? "Menyimpan…" : "Simpan Tindak Lanjut"}
                </ToolbarButton>
              </div>

              <LeadConversionPanel
                source="inquiry"
                sourceId={selected.id}
                suggestedTitle={
                  selected.packageName
                    ? `${selected.packageName} — ${selected.organizationOrBusiness || selected.name}`
                    : `Proyek ${selected.organizationOrBusiness || selected.name}`
                }
                suggestedCost={selected.packagePrice}
                disabled={selectedDraft.status === "converted"}
                onConverted={(message) => {
                  setStatus(message);
                  setDrafts((curr) => ({
                    ...curr,
                    [selected.id]: { ...selectedDraft, status: "converted" },
                  }));
                  setItems((curr) =>
                    curr.map((row) =>
                      row.id === selected.id ? { ...row, status: "converted" } : row
                    )
                  );
                }}
              />
            </BentoCard>
          ) : null}
        </div>
      )}
    </AdminFrame>
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
      const result = await updateQuoteStatusAction({
        id: item.id,
        status: nextStatus,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setItems((current) =>
        current.map((row) =>
          row.id === item.id ? { ...row, status: nextStatus } : row
        )
      );
      setStatus(
        `Status quote ${item.reference} diperbarui menjadi “${quoteStatusLabel[nextStatus]}”.`
      );
    } catch {
      setError("Status quote gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  const visible = items.filter((item) => filter === "all" || item.status === filter);
  const newCount = items.filter((item) => item.status === "new").length;

  return (
    <AdminFrame
      title="Manajemen Pengajuan Quote Kalkulator"
      description="Tinjau snapshot estimasi dari kalkulator publik dan catat tindak lanjut status penawaran."
      screenKey="cms/quote-kalkulator"
      actions={
        <ToolbarButton variant="light" icon="sync" onClick={() => void refresh()}>
          Refresh Data
        </ToolbarButton>
      }
    >
      <Feedback error={error} status={status} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#eaeaea] pb-4">
        <div>
          <h2 className="m-0 text-base font-semibold text-[#18181a]">
            Riwayat Estimasi Kalkulator
          </h2>
          <p className="mt-0.5 text-xs text-[#71717a]">
            {newCount} quote baru membutuhkan tindak lanjut · maksimal 100 data terbaru
          </p>
        </div>

        <TabFilter
          tabs={[
            { id: "all", label: "Semua", count: items.length },
            { id: "new", label: "Baru", count: newCount },
            {
              id: "contacted",
              label: "Dihubungi",
              count: items.filter((i) => i.status === "contacted").length,
            },
            {
              id: "converted",
              label: "Klien",
              count: items.filter((i) => i.status === "converted").length,
            },
            {
              id: "dropped",
              label: "Dibatalkan",
              count: items.filter((i) => i.status === "dropped").length,
            },
          ]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {loading ? (
        <BentoCard>
          <p className="text-center text-xs text-[#71717a]">Memuat data quote…</p>
        </BentoCard>
      ) : visible.length === 0 ? (
        <EmptyState
          icon="request_quote"
          title="Belum ada pengajuan quote"
          description="Tidak ditemukan riwayat estimasi dari kalkulator untuk filter ini."
        />
      ) : (
        <div className="grid gap-4">
          {visible.map((item) => {
            const isNew = item.status === "new";
            const statusVariant = isNew
              ? "warning"
              : item.status === "converted"
              ? "success"
              : item.status === "dropped"
              ? "danger"
              : "neutral";

            return (
              <BentoCard key={item.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eaeaea] pb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                        {item.contactName || "Klien Tanpa Nama"}
                      </h3>
                      <Chip variant={statusVariant} size="sm">
                        {quoteStatusLabel[item.status]}
                      </Chip>
                    </div>
                    <div className="mt-1 text-xs text-[#71717a] font-mono">
                      {item.reference} · Diajukan {dateTime(item.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#71717a]">Ubah Status:</span>
                    <select
                      className="h-[34px] rounded-[10px] bg-[#f0f0f0] px-3 text-xs font-medium text-[#18181a] outline-none"
                      value={item.status}
                      disabled={busyId === item.id}
                      onChange={(e) => void updateStatus(item, e.target.value as QuoteStatus)}
                    >
                      {Object.entries(quoteStatusLabel).map(([val, lbl]) => (
                        <option key={val} value={val}>
                          {lbl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-[12px] bg-[#f9f9f9] p-3.5 border border-[#f0f0f0]">
                    <span className="text-[11px] font-medium text-[#71717a] block mb-1">
                      Estimasi Biaya
                    </span>
                    <span className="text-base font-semibold text-[#18181a]">
                      {currency(item.priceMin)}
                      {item.priceMax !== item.priceMin ? ` – ${currency(item.priceMax)}` : ""}
                    </span>
                  </div>

                  <div className="rounded-[12px] bg-[#f9f9f9] p-3.5 border border-[#f0f0f0]">
                    <span className="text-[11px] font-medium text-[#71717a] block mb-1">
                      Estimasi Durasi
                    </span>
                    <span className="text-base font-semibold text-[#18181a]">
                      {item.daysMin === item.daysMax
                        ? `${item.daysMin} hari kerja`
                        : `${item.daysMin}–${item.daysMax} hari kerja`}
                    </span>
                  </div>

                  <div className="rounded-[12px] bg-[#f9f9f9] p-3.5 border border-[#f0f0f0]">
                    <span className="text-[11px] font-medium text-[#71717a] block mb-1">
                      Kontak WhatsApp
                    </span>
                    {item.contactWhatsapp ? (
                      phoneUrl(item.contactWhatsapp) ? (
                        <a
                          className="font-semibold text-xs text-[#18181a] underline flex items-center gap-1 mt-0.5"
                          href={phoneUrl(item.contactWhatsapp)!}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="symbol text-sm text-[#82b440]">chat</span>
                          {item.contactWhatsapp}
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-[#18181a]">
                          {item.contactWhatsapp}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-[#71717a]">Belum diberikan</span>
                    )}
                  </div>
                </div>

                <details className="mt-3.5 rounded-[10px] border border-[#eaeaea] px-3.5 py-2.5 bg-[#fcfcfc] text-xs">
                  <summary className="cursor-pointer font-medium text-[#18181a] hover:text-[#52525b]">
                    Rincian Pilihan Modul &amp; Fitur ({item.selection.length} item)
                  </summary>
                  {item.selection.length ? (
                    <ul className="mt-3 mb-1 grid gap-1.5 pl-4 text-xs text-[#52525b]">
                      {item.selection.map((sel) => (
                        <li key={sel.itemId}>
                          <span className="font-medium text-[#18181a]">{sel.label}</span>
                          {sel.units > 1 ? (
                            <span className="ml-1 text-[11px] text-[#71717a]">
                              ({sel.units} unit)
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 mb-1 text-xs text-[#71717a]">Tidak ada rincian pilihan.</p>
                  )}
                </details>

                <LeadConversionPanel
                  source="quote"
                  sourceId={item.id}
                  suggestedTitle={
                    item.contactName
                      ? `Proyek ${item.contactName}`
                      : "Proyek Baru dari Estimasi Kalkulator"
                  }
                  suggestedCost={null}
                  disabled={item.status === "converted"}
                  onConverted={(message) => {
                    setStatus(message);
                    setItems((curr) =>
                      curr.map((row) =>
                        row.id === item.id ? { ...row, status: "converted" } : row
                      )
                    );
                  }}
                />
              </BentoCard>
            );
          })}
        </div>
      )}
    </AdminFrame>
  );
}
