"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { wibDay } from "@/lib/booking";
import { dateWib } from "@/lib/format";
import {
  getPublicBookingMonthAvailabilityAction,
  type PublicBookingMonthAvailabilityResult,
} from "@/actions/public/booking";

type Props = HTMLAttributes<HTMLDivElement>;
export type ConsultationMode = "google_meet" | "whatsapp_call" | "offline";
export const consultationModeLabels: Record<ConsultationMode, string> = {
  google_meet: "Google Meet",
  whatsapp_call: "WA Call",
  offline: "Tatap Muka",
};

interface BookingState {
  date: string;
  setDate: (date: string) => void;
  slot: string;
  setSlot: (slot: string) => void;
  mode: ConsultationMode;
  setMode: (mode: ConsultationMode) => void;
  now: Date;
  month: string;
  setMonth: (month: string) => void;
  availability: PublicBookingMonthAvailabilityResult | null;
  loading: boolean;
  error: string;
}
const Context = createContext<BookingState | null>(null);
export function useBooking() {
  return useContext(Context);
}

export function BookingProvider({
  children,
  initialNow,
}: {
  children: ReactNode;
  initialNow: string;
}) {
  const [now, setNow] = useState(() => new Date(initialNow));
  const [initialMonth] = useState(
    () => `${wibDay(new Date(initialNow)).slice(0, 7)}-01`,
  );
  const [month, updateMonth] = useState(initialMonth);
  const [date, updateDate] = useState("");
  const [slot, updateSlot] = useState("");
  const [mode, updateMode] = useState<ConsultationMode>("google_meet");
  const [availabilityState, setAvailabilityState] = useState<{
    month: string;
    data: PublicBookingMonthAvailabilityResult | null;
    error: string;
  }>(() => ({ month: initialMonth, data: null, error: "" }));
  const loading =
    availabilityState.month !== month ||
    (!availabilityState.data && !availabilityState.error);
  const availability = loading ? null : availabilityState.data;
  const error = loading ? "" : availabilityState.error;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    void getPublicBookingMonthAvailabilityAction({ month })
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setAvailabilityState({ month, data: null, error: result.message });
          updateDate("");
          updateSlot("");
          return;
        }
        const data = result.data;
        const openDay = data.days.find((day) =>
          day.slots.some((candidate) => candidate.isAvailable),
        );
        setAvailabilityState({ month, data, error: "" });
        updateDate(openDay?.date ?? "");
        updateSlot(
          openDay?.slots.find((candidate) => candidate.isAvailable)?.start ??
            "",
        );
        if (data.consultationModes.length) {
          updateMode((prev) =>
            data.consultationModes.includes(prev)
              ? prev
              : data.consultationModes[0],
          );
        }
      })
      .catch(() => {
        if (!active) return;
        setAvailabilityState({
          month,
          data: null,
          error: "Jadwal konsultasi tidak dapat dimuat. Silakan coba lagi nanti.",
        });
        updateDate("");
        updateSlot("");
      });

    return () => {
      active = false;
    };
  }, [month]);

  const setDate = (newDate: string) => {
    const day = availability?.days.find((candidate) => candidate.date === newDate);
    const nextSlot = day?.slots.find((candidate) => candidate.isAvailable);
    if (!nextSlot) return;
    updateDate(newDate);
    updateSlot(nextSlot.start);
  };

  const setMonth = (nextMonth: string) => {
    if (nextMonth === month) return;
    setAvailabilityState({ month: nextMonth, data: null, error: "" });
    updateDate("");
    updateSlot("");
    updateMonth(nextMonth);
  };

  return (
    <Context
      value={{
        date,
        setDate,
        slot,
        setSlot: updateSlot,
        mode,
        setMode: updateMode,
        now,
        month,
        setMonth,
        availability,
        loading,
        error,
      }}
    >
      {children}
    </Context>
  );
}

function getSessionPeriod(label: string, index: number): string {
  const startHour = parseInt(label.split(":")[0], 10);
  if (isNaN(startHour)) {
    const defaultPeriods = ["PAGI", "SIANG", "SORE", "MALAM"];
    return defaultPeriods[index % defaultPeriods.length];
  }
  if (startHour < 12) return "PAGI";
  if (startHour < 15) return "SIANG";
  if (startHour < 18) return "SORE";
  return "MALAM";
}

export function BookingCalendar(props: Props) {
  const context = useBooking()!;
  const {
    date,
    setDate,
    now,
    month,
    setMonth,
    availability,
    loading,
    error,
  } = context;
  const first = new Date(`${month}T00:00:00Z`);
  const year = first.getUTCFullYear(),
    monthIndex = first.getUTCMonth();
  const numberOfDays = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const currentMonth = `${wibDay(now).slice(0, 7)}-01`;
  const lastAvailableMonth = availability
    ? `${availability.maxDate.slice(0, 7)}-01`
    : month;
  const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1))
    .toISOString()
    .slice(0, 7);
  function changeMonth(delta: number) {
    const nextDate = new Date(Date.UTC(year, monthIndex + delta, 1));
    setMonth(nextDate.toISOString().slice(0, 7) + "-01");
  }

  const monthYearFormatted = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(first);
  const formattedTitle =
    monthYearFormatted.charAt(0).toUpperCase() + monthYearFormatted.slice(1);

  return (
    <div {...props}>
      <div
        className="box-border w-full h-[44px] shrink-0 flex flex-row gap-0 justify-between items-center"
        data-pencil-name="div"
      >
        <div
          className="box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
          data-pencil-name="div"
        >
          <div
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
            data-pencil-name="PILIH TANGGAL"
          >
            PILIH TANGGAL
          </div>
          <div
            className="text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
            data-pencil-name={formattedTitle}
          >
            {formattedTitle}
          </div>
        </div>
        <div
          className="box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[4px] p-[4px] justify-start items-center bg-[#ffffff] rounded-[8px]"
          data-pencil-name="div"
        >
          <button
            type="button"
            className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center rounded-[4px] hover:bg-[#f0f0f0] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => changeMonth(-1)}
            disabled={month <= currentMonth || loading}
            aria-label="Bulan sebelumnya"
            data-pencil-name="button"
          >
            <div
              className="text-[14px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
              data-pencil-name="chevron_left"
              aria-hidden="true"
            >
              chevron_left
            </div>
          </button>
          <button
            type="button"
            className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center rounded-[4px] hover:bg-[#f0f0f0] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => changeMonth(1)}
            disabled={loading || nextMonth > lastAvailableMonth}
            aria-label="Bulan berikutnya"
            data-pencil-name="button"
          >
            <div
              className="text-[14px]/[20px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
              data-pencil-name="chevron_right"
              aria-hidden="true"
            >
              chevron_right
            </div>
          </button>
        </div>
      </div>

      <div
        className="box-border w-full h-[14px] shrink-0 grid grid-cols-7 gap-[6px] text-center"
        data-pencil-name="div"
      >
        {["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map((day) => (
          <div
            key={day}
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
            data-pencil-name={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className="box-border w-full h-fit shrink-0 grid grid-cols-7 gap-[6px]"
        data-pencil-name="div"
      >
        {Array.from({ length: first.getUTCDay() }, (_, i) => (
          <div
            key={`space-${i}`}
            className="box-border w-full h-[34px]"
            data-pencil-name="div"
          />
        ))}
        {Array.from({ length: numberOfDays }, (_, index) => {
          const day = `${month.slice(0, 7)}-${String(index + 1).padStart(2, "0")}`;
          const daySlots = availability?.days.find(
            (entry) => entry.date === day,
          )?.slots;
          const available =
            !loading && !!daySlots?.some((candidate) => candidate.isAvailable);
          const isSelected = date === day;
          return (
            <button
              key={day}
              type="button"
              disabled={!available || loading}
              aria-label={dateWib(`${day}T00:00:00+07:00`)}
              aria-pressed={isSelected}
              onClick={() => setDate(day)}
              className={`box-border w-full h-[34px] flex flex-col gap-0 p-[8px] justify-center items-center rounded-[8px] transition-colors ${
                isSelected
                  ? "[box-shadow:0px_1px_2px_#0000000d] bg-[#18181a] cursor-pointer"
                  : available
                    ? "[box-shadow:0px_1px_2px_#0000000d] bg-[#ffffff] hover:bg-[#e4e4e7] cursor-pointer"
                    : "bg-transparent opacity-60 cursor-not-allowed"
              }`}
              data-pencil-name={String(index + 1)}
            >
              <div
                className={`text-[13px]/[18px] box-border font-[var(--font-inter),system-ui,sans-serif] text-center [white-space:nowrap] ${
                  isSelected
                    ? "text-[#ffffff] font-bold"
                    : available
                      ? "text-[#18181a] font-medium"
                      : "text-[#9ca3af99] font-medium"
                }`}
              >
                {index + 1}
              </div>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="m-0 text-[11px] text-[#71717a]" role="status">
          Memuat jadwal terbaru…
        </p>
      ) : error ? (
        <p className="m-0 text-[11px] text-[#b91c1c]" role="alert">
          {error}
        </p>
      ) : availability &&
        !availability.days.some((day) =>
          day.slots.some((candidate) => candidate.isAvailable),
        ) ? (
        <p className="m-0 text-[11px] text-[#71717a]" role="status">
          Tidak ada slot konsultasi yang tersedia pada bulan ini.
        </p>
      ) : null}

      <div
        className="box-border w-full h-fit shrink-0 [filter:drop-shadow(0px_-1px_0px_#eaeaea)] flex flex-row gap-0 p-[12px_0px_0px_0px] justify-between items-center"
        data-pencil-name="div"
      >
        <div
          className="box-border w-fit shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
          data-pencil-name="span"
        >
          <div
            className="box-border w-[8px] shrink-0 h-[8px] bg-[#18181a] rounded-[50%]"
            data-pencil-name="span"
          />
          <div
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
            data-pencil-name="Terpilih"
          >
            Terpilih
          </div>
        </div>
        <div
          className="box-border w-fit shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
          data-pencil-name="span"
        >
          <div
            className="box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
            data-pencil-name="span"
          />
          <div
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
            data-pencil-name="Slot Tersedia"
          >
            Slot Tersedia
          </div>
        </div>
        <div
          className="box-border w-fit shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
          data-pencil-name="span"
        >
          <div
            className="box-border w-[8px] shrink-0 h-[8px] bg-[#9ca3af66] rounded-[50%]"
            data-pencil-name="span"
          />
          <div
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
            data-pencil-name="Akhir Pekan (Tutup)"
          >
            Akhir Pekan (Tutup)
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingSlots(props: Props) {
  const { date, slot, setSlot, mode, setMode, availability, loading, error } =
    useBooking()!;
  const allSlots =
    availability?.days.find((day) => day.date === date)?.slots ?? [];
  const availableSlotsCount = allSlots.filter((s) => s.isAvailable).length;
  const modes = availability?.consultationModes ?? [];

  return (
    <div {...props}>
      <div
        className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
        data-pencil-name="div"
      >
        <div
          className="box-border w-fit shrink-0 h-[38px] flex flex-col gap-0 justify-start items-start"
          data-pencil-name="div"
        >
          <div
            className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
            data-pencil-name="SLOT WAKTU SESI"
          >
            SLOT WAKTU SESI
          </div>
          <div
            className="text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
            data-pencil-name="Pilih Jam Pertemuan"
          >
            Pilih Jam Pertemuan
          </div>
        </div>
        <div
          className="box-border w-fit shrink-0 h-[24px] flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#f0f0f0] rounded-[6px]"
          data-pencil-name="div"
        >
          <div
            className="text-[12px]/[16px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
            data-pencil-name="schedule"
            aria-hidden="true"
          >
            schedule
          </div>
          <div
            className="text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
            data-pencil-name="WIB (UTC+7)"
          >
            WIB (UTC+7)
          </div>
        </div>
      </div>

      {loading ? (
        <div className="box-border w-full p-[16px] bg-[#f0f0f0] rounded-[12px] text-center">
          <p role="status" className="text-[13px] text-[#52525b] m-0 font-medium">
            Memuat slot yang tersedia…
          </p>
        </div>
      ) : error ? (
        <div className="box-border w-full p-[16px] bg-[#fff7ed] rounded-[12px] text-center">
          <p role="alert" className="text-[13px] text-[#9a3412] m-0 font-medium">
            {error}
          </p>
        </div>
      ) : allSlots.length ? (
        <div className="grid grid-cols-2 gap-[8px] w-full" data-pencil-name="div">
          {allSlots.map((option, index) => {
            const isSelected = slot === option.start;
            const period = getSessionPeriod(option.label, index);
            const isPast = option.isPast;
            const isBooked = option.isBooked;
            const isBlocked = option.isBlocked;
            const isAvailable = option.isAvailable;

            let statusText = "Tersedia untuk Booking";
            let dotColor = "bg-[#82b440]";
            let statusTextColor = "text-[#82b440]";

            if (isPast) {
              statusText = "Waktu Terlewat";
              dotColor = "bg-[#a1a1aa]";
              statusTextColor = "text-[#71717a]";
            } else if (isBooked) {
              statusText = "Terpesan (In Review)";
              dotColor = "bg-[#f97316]";
              statusTextColor = "text-[#f97316]";
            } else if (isBlocked) {
              statusText = "Tidak Tersedia";
              dotColor = "bg-[#a1a1aa]";
              statusTextColor = "text-[#71717a]";
            }

            return (
              <button
                key={option.start}
                type="button"
                disabled={!isAvailable}
                aria-disabled={!isAvailable}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isAvailable) {
                    setSlot(option.start);
                  }
                }}
                className={`box-border w-full h-[82px] flex flex-col gap-[2px] p-[12px] justify-start items-start rounded-[12px] text-left transition-colors ${
                  !isAvailable
                    ? "bg-[#f4f4f5] opacity-60 cursor-not-allowed"
                    : isSelected
                      ? "bg-[#18181a] shadow-sm cursor-pointer"
                      : "bg-[#f0f0f0] hover:bg-[#e4e4e7] cursor-pointer"
                }`}
                data-pencil-name="button"
                title={!isAvailable ? (isPast ? "Jam sesi ini sudah terlewat" : statusText) : undefined}
              >
                <div
                  className="box-border w-full h-[16px] shrink-0 flex flex-row gap-0 justify-between items-center"
                  data-pencil-name="div"
                >
                  <div
                    className={`text-[11px]/[14px] box-border font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap] ${
                      !isAvailable
                        ? "text-[#71717a]"
                        : isSelected
                          ? "text-[#a8a8ad]"
                          : "text-[#52525b]"
                    }`}
                    data-pencil-name={`SESI ${index + 1} • ${period}`}
                  >
                    {`SESI ${index + 1} • ${period}`}
                  </div>
                  <div
                    className={`box-border w-[8px] shrink-0 h-[8px] rounded-[50%] ${dotColor}`}
                    data-pencil-name="span"
                  />
                </div>
                <div
                  className={`text-[18px]/[24px] box-border font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap] ${
                    !isAvailable
                      ? "text-[#71717a]"
                      : isSelected
                        ? "text-[#ffffff]"
                        : "text-[#18181a]"
                  }`}
                  data-pencil-name={option.label}
                >
                  {option.label}
                </div>
                <div
                  className={`text-[11px]/[14px] box-border font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap] ${
                    !isAvailable
                      ? statusTextColor
                      : isSelected
                        ? "text-[#82b440]"
                        : "text-[#82b440]"
                  }`}
                  data-pencil-name={statusText}
                >
                  {statusText}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="box-border w-full p-[16px] bg-[#f0f0f0] rounded-[12px] text-center">
          <p role="status" className="text-[13px] text-[#52525b] m-0 font-medium">
            Tidak ada slot jadwal yang dibuka pada hari ini. Silakan pilih hari kerja (Senin – Jumat).
          </p>
        </div>
      )}

      {allSlots.length > 0 && availableSlotsCount === 0 && (
        <div className="box-border w-full p-[12px] bg-[#fff7ed] border border-[#ffedd5] rounded-[8px] text-left">
          <p role="status" className="text-[12px] text-[#c2410c] m-0 font-medium flex items-center gap-[6px]">
            <span className="material-symbols-outlined text-[16px] symbol">info</span>
            Semua sesi pada tanggal ini sudah terlewat atau tidak tersedia. Silakan pilih tanggal berikutnya pada kalender.
          </p>
        </div>
      )}

      <div
        className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
        data-pencil-name="div"
      >
        <div
          className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
          data-pencil-name="MODE KONSULTASI"
        >
          MODE KONSULTASI
        </div>
        <div
          className="box-border w-full h-fit shrink-0 grid grid-cols-3 gap-[8px]"
          data-pencil-name="div"
        >
          {[
            {
              id: "google_meet" as const,
              icon: "video_camera_front",
              title: "Google Meet",
              subtitle: "Online HD",
              inactiveIconColor: "text-[#18181a]",
            },
            {
              id: "whatsapp_call" as const,
              icon: "call",
              title: "WA Call",
              subtitle: "Voice Audio",
              inactiveIconColor: "text-[#82b440]",
            },
            {
              id: "offline" as const,
              icon: "handshake",
              title: "Tatap Muka",
              subtitle: "Jadwal konsultasi online",
              inactiveIconColor: "text-[#18181a]",
            },
          ].filter((item) => modes.includes(item.id)).map((item) => {
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                aria-label={item.title}
                aria-pressed={isSelected}
                className={`box-border w-full h-[90px] flex flex-col gap-0 p-[10px] justify-start items-center rounded-[12px] cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#18181a]"
                    : "bg-[#f0f0f0] hover:bg-[#e4e4e7]"
                }`}
                data-pencil-name={item.title}
              >
                <div
                  className={`text-[18px]/[28px] box-border font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol ${
                    isSelected ? "text-[#ffffff]" : item.inactiveIconColor
                  }`}
                  data-pencil-name={item.icon}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <div className="box-border w-full h-[4px] shrink-0" data-pencil-name="spacer" />
                <div
                  className={`text-[13px]/[18px] box-border font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap] ${
                    isSelected ? "text-[#ffffff]" : "text-[#18181a]"
                  }`}
                  data-pencil-name={item.title}
                >
                  {item.title}
                </div>
                <div
                  className={`text-[10px]/[20px] box-border font-[var(--font-inter),system-ui,sans-serif] font-normal text-center [white-space:nowrap] ${
                    isSelected ? "opacity-[0.75] text-[#ffffff]" : "opacity-[0.75] text-[#18181a]"
                  }`}
                  data-pencil-name={item.subtitle}
                >
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>
        {modes.length === 0 ? (
          <p className="m-0 text-[11px] text-[#71717a]" role="status">
            Belum ada mode konsultasi yang tersedia.
          </p>
        ) : null}
      </div>

      <div
        className="box-border w-full min-h-[64px] shrink-0 rounded-[12px] flex flex-col p-[14px] gap-[8px] transition-all bg-[#f0f0f0] border border-[#e4e4e7]"
        data-pencil-name="Booking Availability Notice"
      >
        <div className="flex items-center gap-2">
          <span className="text-[18px] symbol text-[#586016]">info</span>
          <span className="text-xs font-semibold text-[#18181a]">
            Ketentuan Jadwal Konsultasi
          </span>
        </div>
        <div className="text-[12px]/[16px] text-[#52525b] font-normal">
          Jadwal di atas menampilkan slot sesi kerja standar (Senin – Jumat). Ketersediaan akhir diverifikasi langsung saat formulir reservasi dikirimkan. Memilih sesi belum melakukan penguncian atau pemesanan permanen.
        </div>
      </div>
    </div>
  );
}

export function BookingValue({
  kind,
  ...props
}: Props & { kind: "date" | "time" | "mode" }) {
  const { date, slot, mode, availability } = useBooking()!;
  const slots = availability?.days.find((day) => day.date === date)?.slots ?? [];
  const matchingSlot = slots.find((s) => s.start === slot);

  return (
    <div {...props} aria-live="polite">
      {kind === "date"
        ? date
          ? dateWib(`${date}T00:00:00+07:00`)
          : "Pilih tanggal"
        : kind === "mode"
          ? consultationModeLabels[mode]
          : matchingSlot
            ? `${matchingSlot.label} WIB`
            : slot
              ? `${new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(slot)).replace(".", ":")} WIB`
              : "Pilih jam sesi"}
    </div>
  );
}
