"use client";

import {
  createContext,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  calculate,
  type CalculatorGroup,
  type CalculatorItem,
  type Selection,
} from "@/lib/calculator";
import { formatNumber, rupiah } from "@/lib/format";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { usePreview } from "@/components/preview/PreviewProvider";
import { submitQuoteAction } from "@/actions/public/quote";
import {
  TurnstileWidget,
  turnstileSiteKey,
} from "@/components/public/TurnstileWidget";

type Props = HTMLAttributes<HTMLDivElement> & { children?: ReactNode };
type CalculatorConfig = {
  groups: Array<CalculatorGroup & { key: string }>;
  items: Array<CalculatorItem & { isDefault: boolean }>;
  minimumPrice: number;
  showRange: boolean;
  disclaimer: string;
  consentText: string;
};

const displayAliases: Record<string, string> = {
  web: "Web Saja",
  android: "Android Saja",
  webandr: "Web + Android",
  landing: "Landing Page Profil",
  katalog: "Katalog & Toko WA",
  sidb: "Sistem Informasi / Web App",
  undangan: "Undangan Digital",
  rbac: "Multi-User RBAC & Autentikasi",
  gis: "Peta & Geolocation GIS",
  laporan: "Export Dokumen PDF & Excel",
  wa: "Notifikasi Otomatis WhatsApp",
  pay: "Integrasi Payment Gateway QRIS",
  halaman: "Halaman Tambahan",
};

interface CalculatorState {
  selection: Selection[];
  groups: CalculatorConfig["groups"];
  items: CalculatorConfig["items"];
  minimumPrice: number;
  showRange: boolean;
  disclaimer: string;
  consentText: string;
  getItem: (id: string) => CalculatorItem | undefined;
  getItemId: (id: string) => string | undefined;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
  units: number;
  setUnits: (units: number) => void;
  name: string;
  setName: (name: string) => void;
  whatsapp: string;
  setWhatsapp: (number: string) => void;
  consent: boolean;
  setConsent: (value: boolean) => void;
  turnstileToken: string;
  setTurnstileToken: (token: string) => void;
  turnstileResetKey: number;
  resetTurnstile: () => void;
}
const Context = createContext<CalculatorState | null>(null);
function useCalculator() {
  const context = useContext(Context);
  if (!context) throw new Error("CalculatorProvider tidak ditemukan.");
  return context;
}

function resolveConfiguredItem(config: CalculatorConfig, id: string) {
  const label = displayAliases[id];
  return (
    config.items.find((item) => item.id === id) ??
    (label ? config.items.find((item) => item.label === label) : undefined)
  );
}

function initialSelection(config: CalculatorConfig): Selection[] {
  return config.groups.flatMap((group) => {
    const groupItems = config.items.filter((item) => item.groupId === group.id);
    const fallbackAlias =
      group.key === "platform"
        ? "web"
        : group.key === "solution"
          ? "sidb"
          : undefined;
    const item =
      groupItems.find((candidate) => candidate.isDefault) ??
      (fallbackAlias ? resolveConfiguredItem(config, fallbackAlias) : undefined) ??
      (group.isRequired ? groupItems[0] : undefined);
    return item ? [{ itemId: item.id }] : [];
  });
}

export function CalculatorProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: CalculatorConfig;
}) {
  const [selected, setSelected] = useState<Selection[]>(() =>
    initialSelection(config),
  );
  const [units, updateUnits] = useState(0);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const getItem = (id: string) => resolveConfiguredItem(config, id);
  const getItemId = (id: string) => getItem(id)?.id;
  const isSelected = (id: string) => {
    const actualId = getItemId(id);
    return !!actualId && selected.some((value) => value.itemId === actualId);
  };
  const selection = [
    ...selected,
    ...(units > 0 && getItemId("halaman")
      ? [{ itemId: getItemId("halaman")!, units }]
      : []),
  ];
  function select(id: string) {
    const item = getItem(id);
    if (!item) return;
    setSelected((current) => {
      const single =
        config.groups.find((group) => group.id === item.groupId)
          ?.selectionType === "single";
      if (!single && current.some((value) => value.itemId === item.id))
        return current.filter((value) => value.itemId !== item.id);
      let next = current.filter(
        (value) =>
          !single ||
          config.items.find((option) => option.id === value.itemId)?.groupId !==
            item.groupId,
      );
      for (const required of item.requires ?? []) {
        const dependency = config.items.find(
          (value) => value.id === required,
        );
        if (!dependency) continue;
        next = next.filter(
          (value) =>
            config.items.find((option) => option.id === value.itemId)?.groupId !==
            dependency.groupId,
        );
        next.push({ itemId: required });
      }
      next.push({ itemId: item.id });
      return next.filter((value) => {
        const option = config.items.find(
          (option) => option.id === value.itemId,
        );
        if (!option) return false;
        return !option.requires?.some(
          (required) => !next.some((value) => value.itemId === required),
        );
      });
    });
  }
  return (
    <Context
      value={{
        selection,
        groups: config.groups,
        items: config.items,
        minimumPrice: config.minimumPrice,
        showRange: config.showRange,
        disclaimer: config.disclaimer,
        consentText: config.consentText,
        getItem,
        getItemId,
        isSelected,
        select,
        units,
        setUnits: (value) =>
          updateUnits(
            Math.min(
              getItem("halaman")?.maxUnits ?? 20,
              Math.max(0, Math.trunc(value)),
            ),
          ),
        name,
        setName,
        whatsapp,
        setWhatsapp,
        consent,
        setConsent,
        turnstileToken,
        setTurnstileToken,
        turnstileResetKey,
        resetTurnstile: () => setTurnstileResetKey((key) => key + 1),
      }}
    >
      {children}
    </Context>
  );
}

export function CalculatorRadioIndicator({ itemId }: { itemId: string }) {
  const { isSelected } = useCalculator();
  const selected = isSelected(itemId);

  if (selected) {
    return (
      <div
        className="box-border w-[16px] shrink-0 h-[16px] flex flex-row gap-0 justify-center items-center bg-[#18181a] rounded-[9999px]"
        data-pencil-name="span"
      >
        <div
          className="box-border w-[6px] shrink-0 h-[6px] bg-[#ffffff] rounded-[50%]"
          data-pencil-name="span"
        />
      </div>
    );
  }

  return (
    <div
      className="box-border w-[16px] shrink-0 h-[16px] rounded-[50%] border-[1.5px] border-[#a1a1aa] bg-[#ffffff]"
      data-pencil-name="span"
    />
  );
}

export function CalculatorOption({
  itemId,
  children,
  className,
  ...props
}: Props & { itemId: string }) {
  const { selection, select, groups, items, getItem, getItemId } =
    useCalculator();
  const item = getItem(itemId);
  if (!item) return null;
  const actualId = item.id;
  const selected = selection.some((value) => value.itemId === actualId);
  const disabled = selection.some((value) => {
    const existing = items.find((item) => item.id === value.itemId);
    if (!existing) return false;
    return (
      existing.excludes?.includes(actualId) ||
      item.excludes?.includes(existing.id)
    );
  });
  const type =
    groups.find((group) => group.id === item.groupId)?.selectionType === "single"
      ? "radio"
      : "checkbox";

  let finalClass = className || "";
  if (type === "radio") {
    if (selected) {
      finalClass = finalClass.replace(/bg-\[#f0f0f0\]/g, "bg-[#e2e2e2]");
    } else {
      finalClass = finalClass.replace(/bg-\[#e2e2e2\]/g, "bg-[#f0f0f0]");
    }
  }

  return (
    <button
      {...(props as HTMLAttributes<HTMLButtonElement>)}
      type="button"
      role={type}
      aria-label={item.label}
      aria-checked={selected}
      disabled={disabled}
      title={
        disabled ? "Tidak tersedia untuk kombinasi yang dipilih." : item.label
      }
      className={`${finalClass} option-control`}
      onClick={() => select(itemId)}
      data-configured-item-id={getItemId(itemId)}
    >
      {children}
    </button>
  );
}

export function CalculatorValue({
  kind,
  ...props
}: Props & { kind: "price" | "days" | "count" }) {
  const { selection, groups, items, minimumPrice, showRange, getItemId } = useCalculator();
  const result = calculate(selection, groups, items, minimumPrice);
  if (!result.ok)
    return (
      <div {...props} role="alert">
        Pilihan belum valid.
      </div>
    );
  return (
    <div {...props} aria-live="polite">
      {kind === "price"
        ? `${formatNumber(result.priceMin)}${showRange && result.priceMin !== result.priceMax ? ` - ${formatNumber(result.priceMax)}` : ""}`
        : kind === "days"
          ? `${result.daysMin} - ${result.daysMax} Hari Kerja`
          : `${selection.filter((value) => value.itemId !== getItemId("web")).length} Komponen`}
    </div>
  );
}

export function CalculatorItemDays({
  itemId,
  prefix,
  ...props
}: Props & { itemId: string; prefix?: string }) {
  const { getItem, groups } = useCalculator();
  const item = getItem(itemId);
  if (!item) return null;
  const isModule = groups.find((group) => group.id === item.groupId)?.key === "modules";
  return (
    <div {...props}>
      {prefix ?? (isModule ? "+" : "")}
      {item.daysMin}
      {item.daysMax !== undefined && item.daysMax !== item.daysMin
        ? ` - ${item.daysMax}`
        : ""}{" "}
      Hari
    </div>
  );
}

export function CalculatorItemPrice({
  itemId,
  prefix = "",
  suffix = "",
  ...props
}: Props & { itemId: string; prefix?: string; suffix?: string }) {
  const { getItem, showRange } = useCalculator();
  const item = getItem(itemId);
  if (!item) return null;
  const compactRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const range =
    showRange && item.priceMax !== undefined && item.priceMax !== item.priceMin
      ? ` – ${compactRupiah.format(item.priceMax)}`
      : "";
  return (
    <div {...props}>
      {prefix}
      {compactRupiah.format(item.priceMin)}
      {range}
      {suffix}
    </div>
  );
}

export function CalculatorUnits(props: Props) {
  const { units, setUnits, getItem } = useCalculator();
  const item = getItem("halaman");
  if (!item) return null;
  const maxUnits = item.maxUnits ?? 20;
  return (
    <div {...props}>
      <div className="flex justify-between items-center gap-3 w-full">
        <label htmlFor="extra-pages" className="text-[13px] text-[#52525b]">
          Jumlah Halaman Kustom
        </label>
        <div className="flex items-center gap-3 bg-[#f0f0f0] rounded-lg p-1">
          <button
            type="button"
            aria-label="Kurangi halaman"
            className="symbol p-2"
            disabled={units === 0}
            onClick={() => setUnits(units - 1)}
          >
            remove
          </button>
          <output className="text-sm w-6 text-center">{units}</output>
          <button
            type="button"
            aria-label="Tambah halaman"
            className="symbol p-2"
            disabled={units === maxUnits}
            onClick={() => setUnits(units + 1)}
          >
            add
          </button>
        </div>
      </div>
      <input
        id="extra-pages"
        aria-label="Jumlah halaman tambahan"
        type="range"
        min={0}
        max={maxUnits}
        value={units}
        onChange={(event) => setUnits(Number(event.target.value))}
        className="w-full my-4 accent-[#18181a]"
      />
      <div className="flex justify-between w-full text-[11px] text-[#52525b]">
        <span>0 (Termasuk Paket)</span>
        <span>10 Halaman</span>
        <span>{maxUnits} Halaman (Maks)</span>
      </div>
    </div>
  );
}

export function CalculatorBreakdown(props: Props) {
  const { selection, items, getItemId, showRange } = useCalculator();
  const payable = selection.filter((value) => value.itemId !== getItemId("web"));
  return (
    <div {...props}>
      <div className="flex justify-between w-full text-[11px]">
        <span className="font-semibold tracking-[.55px] text-[#a8a8ad]">
          RINCIAN KOMPONEN TERPILIH
        </span>
        <span className="text-[#e2e89d]">{payable.length} Komponen</span>
      </div>
      {payable.map((selected) => {
        const item = items.find(
          (item) => item.id === selected.itemId,
        );
        if (!item) return null;
        const k = selected.units ?? 1;
        return (
          <div
            key={selected.itemId}
            className="flex justify-between gap-4 w-full py-[7px] border-0 border-b border-solid border-[#2e2e324d] text-[11px]"
          >
            <span className="text-white">
              {item.label}
              {selected.units ? ` ×${selected.units}` : ""}
            </span>
            <span className="text-[#e2e89d] text-right">
              {showRange
                ? `${rupiah(item.priceMin * k)} - ${formatNumber((item.priceMax ?? item.priceMin) * k)}`
                : rupiah(item.priceMin * k)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CalculatorContact(props: Props) {
  const {
    name,
    setName,
    whatsapp,
    setWhatsapp,
    setTurnstileToken,
    turnstileResetKey,
  } = useCalculator();

  return (
    <div {...props}>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <label
          htmlFor="calc-name"
          className="text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
        >
          Nama / Perusahaan
        </label>
        <div className="box-border w-full h-[38px] shrink-0 flex flex-col gap-0 p-[10px_12px] justify-center items-start bg-[#242427] rounded-[8px] overflow-hidden focus-within:ring-1 focus-within:ring-white">
          <input
            id="calc-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Bpk/Ibu PIC Proyek"
            className="w-full bg-transparent text-[13px]/[18px] text-[#ffffff] placeholder:text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left outline-none border-none p-0"
            autoComplete="name"
          />
        </div>
      </div>

      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <label
          htmlFor="calc-wa"
          className="text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
        >
          Nomor WhatsApp
        </label>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start relative">
          <div className="box-border w-full h-[38px] shrink-0 flex flex-col gap-0 p-[10px_36px_10px_12px] justify-center items-start bg-[#242427] rounded-[8px] overflow-hidden relative [z-index:0] focus-within:ring-1 focus-within:ring-white">
            <input
              id="calc-wa"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="0812xxxxxxx"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-transparent text-[13px]/[18px] text-[#ffffff] placeholder:text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left outline-none border-none p-0"
            />
          </div>
          <div
            className="text-[16px]/[24px] box-border absolute right-[12px] top-[7px] text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:1] pointer-events-none symbol"
            aria-hidden="true"
          >
            chat
          </div>
        </div>
      </div>

      {turnstileSiteKey ? (
        <div className="w-full pt-1">
          <TurnstileWidget
            action="calculator"
            onTokenChange={setTurnstileToken}
            resetKey={turnstileResetKey}
            theme="dark"
          />
        </div>
      ) : null}
    </div>
  );
}

export function CalculatorSend({
  children,
  className,
  ...props
}: Props & { className?: string }) {
  const {
    selection,
    groups,
    items,
    minimumPrice,
    name,
    whatsapp,
    turnstileToken,
    setTurnstileToken,
    resetTurnstile,
  } = useCalculator();
  const { notify } = usePreview();
  const [submission, setSubmission] = useState<{
    configKey: string;
    url?: string;
    reference?: string;
    error?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentConfigKey = JSON.stringify({ selection, name, whatsapp });
  const currentSubmission =
    submission?.configKey === currentConfigKey ? submission : null;

  const handleSend = async () => {
    const cleanWhatsapp = whatsapp.trim();
    const normalizedNumber = cleanWhatsapp ? normalizeWhatsapp(cleanWhatsapp) : null;
    if (cleanWhatsapp && !normalizedNumber) {
      const errMsg = "Mohon masukkan nomor WhatsApp yang valid (contoh: 0812xxxxxxx).";
      setSubmission({ configKey: currentConfigKey, error: errMsg });
      notify(errMsg);
      return;
    }

    if (
      !turnstileToken &&
      turnstileSiteKey &&
      process.env.NODE_ENV === "production"
    ) {
      setSubmission({
        configKey: currentConfigKey,
        error: "Selesaikan verifikasi keamanan sebelum mengirim estimasi.",
      });
      return;
    }

    const result = calculate(
      selection,
      groups,
      items,
      minimumPrice,
    );
    if (!result.ok) {
      notify("Periksa kembali kombinasi pilihan Anda. Terdapat pilihan yang saling bertentangan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitQuoteAction({
        selection,
        contactName: name.trim() || undefined,
        contactWhatsapp: normalizedNumber ?? undefined,
        consent: true,
        turnstileToken,
        honeypot: "",
      });
      if (!response.ok) {
        setSubmission({ configKey: currentConfigKey, error: response.message });
        notify(response.message);
        return;
      }
      setSubmission({
        configKey: currentConfigKey,
        url: response.data.whatsappUrl,
        reference: response.data.reference,
      });
      notify("Estimasi tersimpan. Rincian siap dikirim melalui WhatsApp.");
      if (typeof window !== "undefined" && response.data.whatsappUrl) {
        window.open(response.data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setSubmission({
        configKey: currentConfigKey,
        error: "Gagal menghubungkan ke server. Silakan coba kembali.",
      });
      notify("Gagal menghubungkan ke server. Silakan coba kembali.");
    } finally {
      setTurnstileToken("");
      resetTurnstile();
      setIsSubmitting(false);
    }
  };

  const buttonProps = props as HTMLAttributes<HTMLButtonElement>;

  const buttonClass =
    className ||
    "box-border w-full h-[56px] shrink-0 [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-row gap-[8px] p-[14px_12px] justify-center items-center bg-[#e2e89d] hover:bg-[#d4da8f] active:scale-[0.99] rounded-[12px] cursor-pointer transition-all disabled:opacity-60";

  return (
    <div className="box-border w-full h-fit flex flex-col gap-[10px] items-stretch">
      <button
        {...buttonProps}
        type="button"
        onClick={handleSend}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={buttonClass}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2 text-[#1b1d00] font-bold text-[14px]">
            <span className="symbol animate-spin text-[18px]">progress_activity</span>
            <span>Menyimpan Estimasi…</span>
          </div>
        ) : (
          children
        )}
      </button>

      {currentSubmission?.error ? (
        <p className="m-0 text-xs text-[#fca5a5] bg-[#3f1d1d] p-2.5 rounded-lg border border-[#ef4444]/30" role="alert">
          {currentSubmission.error}
        </p>
      ) : null}

      {currentSubmission?.url ? (
        <div className="flex flex-col gap-2 p-3 bg-[#242427] border border-[#82b440]/40 rounded-xl" role="status">
          <div className="flex items-center gap-1.5 text-[#e2e89d] text-xs font-semibold">
            <span className="symbol text-base text-[#82b440]">check_circle</span>
            <span>Estimasi #{currentSubmission.reference} Berhasil Dicatat</span>
          </div>
          <p className="m-0 text-[11px] text-[#a8a8ad] leading-relaxed">
            WhatsApp telah dibuka di tab baru. Jika peramban memblokir pop-up otomatis, silakan klik tombol berikut:
          </p>
          <a
            href={currentSubmission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="box-border w-full h-[44px] flex flex-row gap-[6px] justify-center items-center bg-[#e2e89d] hover:bg-[#d4da8f] text-[#1b1d00] font-bold text-xs rounded-[8px] transition-all"
          >
            <span className="symbol text-base">chat</span>
            <span>Buka WhatsApp Sekarang</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
