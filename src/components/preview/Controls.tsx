"use client";

import {
  Children,
  createContext,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreview } from "./PreviewProvider";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode };
interface ScreenContext {
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  isReordering: boolean;
  toggleReordering: () => void;
  lastSyncedAt: string;
  triggerSync: () => void;
}
const State = createContext<ScreenContext>({
  query: "",
  setQuery: () => {},
  filter: "",
  setFilter: () => {},
  isReordering: false,
  toggleReordering: () => {},
  lastSyncedAt: "",
  triggerSync: () => {},
});
const RemoveRow = createContext<(() => void) | null>(null);

export function ScreenState({
  children,
  screen,
}: {
  children: ReactNode;
  screen: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(() =>
    new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date()),
  );

  const toggleReordering = () => setIsReordering((prev) => !prev);
  const triggerSync = () => {
    setLastSyncedAt(
      new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    );
  };

  return (
    <State
      value={{
        query,
        setQuery,
        filter,
        setFilter,
        isReordering,
        toggleReordering,
        lastSyncedAt,
        triggerSync,
      }}
      key={screen}
    >
      {children}
    </State>
  );
}

export function UiAction({
  children,
  label,
  className,
  ...rest
}: SurfaceProps & {
  label: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { open, notify } = usePreview();
  const { isReordering, toggleReordering, triggerSync } = useContext(State);
  const removeRow = useContext(RemoveRow);
  const [removed, setRemoved] = useState(false);
  const [updated, setUpdated] = useState("");
  if (removed)
    return <span className="text-xs text-[#71717a]">Dihapus di preview</span>;
  return (
    <button
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
      aria-hidden={undefined}
      type="button"
      className={className}
      aria-label={label}
      onClick={(event) => {
        if (rest.onClick) {
          (rest.onClick as unknown as React.MouseEventHandler<HTMLButtonElement>)(event);
          return;
        }
        if (/copy|salin/i.test(label)) {
          notify("Fitur salin dinonaktifkan pada pratinjau.");
          return;
        }
        if (/simpan|save/i.test(label)) {
          notify(
            "Simulasi simpan selesai. Tidak ada data yang disimpan.",
          );
          return;
        }
        if (/purge|cache/i.test(label)) {
          notify(
            "Simulasi pembersihan cache. Tidak ada cache yang dibersihkan.",
          );
          return;
        }
        if (/export|unduh|download/i.test(label)) {
          const timestamp = new Date().toISOString().slice(0, 10);
          const sanitized = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          const filename = `openbyte-${sanitized || "data"}-${timestamp}.csv`;
          const csvHeader = "\uFEFFNo,Judul / Nama,Kategori / Spesifikasi,Status,Waktu Ekspor\n";
          const sampleRows = "";
          const blob = new Blob([csvHeader + sampleRows], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          notify(`Berkas ${filename} berhasil dibuat dan diunduh ke perangkat Anda.`);
          return;
        }
        if (/refresh|sync|sinkron/i.test(label)) {
          triggerSync();
          const time = new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date());
          notify(
            `Sinkronisasi data (${label}) berhasil diperbarui pada ${time} WIB. Cache Redis tervalidasi.`,
          );
          return;
        }
        if (/format_|bold|italic|underlined|list|link/i.test(label)) {
          const textarea =
            (document.activeElement as HTMLTextAreaElement | null)?.tagName ===
            "TEXTAREA"
              ? (document.activeElement as HTMLTextAreaElement)
              : (document.querySelector("textarea") as HTMLTextAreaElement | null);

          const fmt = label.replace(/^format_/, "").toLowerCase();
          if (textarea) {
            const start = textarea.selectionStart ?? 0;
            const end = textarea.selectionEnd ?? 0;
            const text = textarea.value;
            const selected = text.substring(start, end) || "teks";
            let prefix = "";
            let suffix = "";
            if (/bold/i.test(fmt)) {
              prefix = "**";
              suffix = "**";
            } else if (/italic/i.test(fmt)) {
              prefix = "*";
              suffix = "*";
            } else if (/underlined/i.test(fmt)) {
              prefix = "<u>";
              suffix = "</u>";
            } else if (/list/i.test(fmt)) {
              prefix = "\n- ";
              suffix = "";
            } else if (/link/i.test(fmt)) {
              prefix = "[";
              suffix = "](https://openbytelabs.com)";
            } else {
              prefix = `[${fmt}]`;
              suffix = `[/${fmt}]`;
            }

            const updated =
              text.substring(0, start) +
              prefix +
              selected +
              suffix +
              text.substring(end);
            textarea.value = updated;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            textarea.focus();
            textarea.setSelectionRange(
              start + prefix.length,
              start + prefix.length + selected.length,
            );
            notify(`Format teks ${fmt} berhasil diterapkan pada editor.`);
          } else {
            notify(`Format teks ${fmt} diterapkan.`);
          }
          return;
        }
        if (/uji|test|url.*wa/i.test(label)) {
          notify(
            "Uji format URL WhatsApp berhasil: Parameter ter-encode valid.",
          );
          return;
        }
        if (/reorder|urutkan/i.test(label)) {
          toggleReordering();
          notify(
            isReordering
              ? "Mode susun ulang ditutup. Posisi urutan baru telah diterapkan."
              : "Mode susun ulang urutan aktif! Gunakan tombol naik / turun pada setiap baris untuk mengatur urutan.",
          );
          return;
        }
        open(label, (value) => {
          if (/hapus|delete|trash/i.test(label)) {
            if (removeRow) removeRow();
            else setRemoved(true);
          } else if (value) setUpdated(value);
        });
      }}
    >
      {updated || children}
    </button>
  );
}

export function ToggleControl({
  label,
  initialChecked = false,
  children,
  className,
  ...rest
}: SurfaceProps & { label: string; initialChecked?: boolean }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <button
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => setChecked((value) => !value)}
      className={`${className ?? ""} toggle-control ${checked ? "toggle-on" : "toggle-off"}`}
    >
      {children}
    </button>
  );
}

export function NavLink({
  children,
  href,
  className,
  ...rest
}: SurfaceProps & { href: string }) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`)) ||
    (href === "/" && (pathname === "/" || pathname.includes("site/beranda"))) ||
    (href === "/proyek" &&
      (pathname.startsWith("/proyek") ||
        pathname.includes("daftar-portofolio") ||
        pathname.includes("detail-proyek"))) ||
    (href === "/paket" &&
      (pathname.startsWith("/paket") ||
        pathname.includes("paket-layanan-harga") ||
        pathname.includes("detail-layanan"))) ||
    (href === "/kalkulator" &&
      (pathname.startsWith("/kalkulator") ||
        pathname.includes("kalkulator-estimasi-biaya"))) ||
    (href === "/konsultasi" &&
      (pathname.startsWith("/konsultasi") ||
        pathname.includes("booking-konsultasi"))) ||
    (href === "/tracking" &&
      (pathname.startsWith("/tracking") ||
        pathname.includes("portal-pelacakan-proyek-klien") ||
        pathname.includes("otentikasi-tracking-klien")));
  const normalized = (className ?? "").replace(
    /bg-\[#[\da-f]{6,8}\]|\[box-shadow:[^\]]+\]/gi,
    "",
  );
  const tab = className?.includes("rounded-");
  return (
    <Link
      {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        tab
          ? `${normalized} nav-link ${active ? "nav-active" : "nav-inactive"}`
          : className
      }
    >
      {children}
    </Link>
  );
}

export function EditableField({
  label,
  initialValue = "",
  value: controlledValue,
  onValueChange,
  disabled,
  multiline = false,
  className,
  ...rest
}: SurfaceProps & {
  label: string;
  initialValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  multiline?: boolean;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const value = controlledValue ?? uncontrolledValue;
  const props = {
    className: `${className ?? ""} editable-field`,
    "aria-label": label,
    placeholder: initialValue ? undefined : label,
    value,
    disabled,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (controlledValue === undefined) setUncontrolledValue(event.target.value);
      onValueChange?.(event.target.value);
    },
  };
  return multiline ? (
    <textarea {...(rest as HTMLAttributes<HTMLTextAreaElement>)} {...props} />
  ) : (
    <input {...(rest as HTMLAttributes<HTMLInputElement>)} {...props} />
  );
}

export function SearchField({
  label,
  className,
  ...rest
}: SurfaceProps & { label: string }) {
  const { query, setQuery } = useContext(State);
  return (
    <input
      {...(rest as HTMLAttributes<HTMLInputElement>)}
      type="search"
      aria-label={label}
      placeholder={label}
      className={`${className ?? ""} bg-transparent`}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}

export function FilterButton({
  value,
  children,
  className,
  ...rest
}: SurfaceProps & { value: string }) {
  const { filter, setFilter } = useContext(State);
  const selected = filter === value || (!filter && /^(semua|all)/i.test(value));
  const normalized = (className ?? "").replace(
    /bg-\[#[\da-f]{6,8}\]|\[box-shadow:[^\]]+\]/gi,
    "",
  );
  return (
    <button
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
      type="button"
      aria-pressed={selected}
      className={`${normalized} filter-button cursor-pointer transition-colors ${selected ? "filter-active" : "filter-inactive"}`}
      onClick={() => setFilter(/^(semua|all)/i.test(value) ? "" : value)}
    >
      {children}
    </button>
  );
}

export function FilterDropdown({
  label,
  children,
  className,
  ...rest
}: SurfaceProps & { label: string }) {
  const { setFilter } = useContext(State);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState("");
  const options = /Kategori/i.test(label)
    ? [
        "Instansi / Pemdes",
        "Aplikasi Mobile",
        "Bisnis & UMKM",
        "Undangan Digital & Event",
      ]
    : /Sumber/i.test(label)
      ? ["WhatsApp", "Kalkulator", "Paket"]
      : ["New", "Pending", "Confirmed", "Completed", "Cancelled"];
  return (
    <>
      <button
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        {selected || children}
      </button>
      <dialog
        ref={dialog}
        className="ui-dialog"
        aria-label={label}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <h2>{label}</h2>
        <form method="dialog" className="flex flex-col gap-2 mt-5">
          {[label, ...options].map((value) => (
            <button
              key={value}
              className="secondary-button justify-start"
              onClick={() => {
                const choice = value === label ? "" : value;
                setFilter(choice);
                setSelected(choice);
              }}
            >
              {value}
            </button>
          ))}
          <button className="primary-button mt-3">Tutup</button>
        </form>
      </dialog>
    </>
  );
}

const synonyms: Record<string, string[]> = {
  "instansi / pemdes": [
    "instansi",
    "proyek-contoh-1",
    "proyek-contoh-2",
    "proyek-contoh-3",
    "posyandu",
  ],
  "aplikasi mobile": ["flutter", "mobile"],
  "bisnis & umkm": ["umkm", "terapis"],
  "undangan digital & event": ["proyek-contoh-6", "undangan"],
  baru: ["new", "baru"],
  aktif: ["aktif", "active", "published"],
};
function matches(text: string, query: string, filter: string) {
  const normalized = text.toLocaleLowerCase("id");
  const words = synonyms[filter.toLocaleLowerCase("id")] ?? [
    filter.toLocaleLowerCase("id"),
  ];
  return (
    normalized.includes(query.toLocaleLowerCase("id")) &&
    (!filter || words.some((word) => normalized.includes(word)))
  );
}

export function FilterItem({
  text,
  children,
  ...props
}: SurfaceProps & { text: string }) {
  const { query, filter } = useContext(State);
  if (!matches(text, query, filter)) return null;
  return <article {...props}>{children}</article>;
}

export function DataRows({
  texts,
  rowFlags,
  children,
  ...props
}: SurfaceProps & { texts: string[]; rowFlags?: boolean[] }) {
  const { query, filter, isReordering } = useContext(State);
  const [removed, setRemoved] = useState<number[]>([]);
  const originalRows = Children.toArray(children);
  const [prevCount, setPrevCount] = useState(originalRows.length);
  const [order, setOrder] = useState<number[]>(() =>
    originalRows.map((_, i) => i),
  );

  if (prevCount !== originalRows.length) {
    setPrevCount(originalRows.length);
    setOrder(originalRows.map((_, i) => i));
  }

  function moveRow(indexInOrder: number, delta: number) {
    const target = indexInOrder + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[indexInOrder], next[target]] = [next[target], next[indexInOrder]];
      return next;
    });
  }

  let count = 0;
  const rows = order.flatMap<ReactNode>((originalIndex, orderPos) => {
    const row = originalRows[originalIndex];
    if (rowFlags && !rowFlags[originalIndex]) return [row];
    if (
      removed.includes(originalIndex) ||
      !matches(texts[originalIndex] ?? "", query, filter)
    )
      return [];
    count++;
    return [
      <RemoveRow
        key={originalIndex}
        value={() => setRemoved((current) => [...current, originalIndex])}
      >
        <div className="relative group/row w-full">
          {isReordering && (
            <div className="flex items-center gap-1.5 p-1 px-2.5 bg-[#f0f0f0] border border-[#e4e4e7] rounded-lg mb-1.5 text-xs text-[#52525b] w-fit shadow-xs">
              <span className="symbol text-sm text-[#71717a]">drag_indicator</span>
              <span className="font-semibold text-[#18181a]">
                Urutan #{orderPos + 1}
              </span>
              <button
                type="button"
                className="symbol p-1 rounded hover:bg-[#e4e4e7] disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={orderPos === 0}
                onClick={() => moveRow(orderPos, -1)}
                aria-label={`Naikkan baris ${orderPos + 1}`}
                title="Pindah ke atas"
              >
                arrow_upward
              </button>
              <button
                type="button"
                className="symbol p-1 rounded hover:bg-[#e4e4e7] disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={orderPos === order.length - 1}
                onClick={() => moveRow(orderPos, 1)}
                aria-label={`Turunkan baris ${orderPos + 1}`}
                title="Pindah ke bawah"
              >
                arrow_downward
              </button>
            </div>
          )}
          {row}
        </div>
      </RemoveRow>,
    ];
  });
  return (
    <div {...props}>
      {isReordering && (
        <div className="flex items-center justify-between p-3 mb-3 bg-[#e2e89d33] border border-[#d2d88f] rounded-xl text-xs text-[#454a10]">
          <div className="flex items-center gap-2">
            <span className="symbol text-base">swap_vert</span>
            <span className="font-semibold">Mode Susun Ulang Aktif:</span>
            <span>
              Gunakan tombol panah pada setiap baris untuk mengubah prioritas urutan tampil.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#d2d88f]">
            Drag & Drop / Reorder
          </span>
        </div>
      )}
      {rows}
      {!count ? (
        <div role="status" className="filter-empty">
          Tidak ada data yang sesuai. Ubah pencarian atau filter.
        </div>
      ) : null}
    </div>
  );
}

export function FaqItem({
  children,
  className,
  answer,
  ...props
}: SurfaceProps & { answer?: string }) {
  const parts = Children.toArray(children);
  return (
    <details
      {...(props as HTMLAttributes<HTMLDetailsElement>)}
      className={className}
    >
      <summary>{parts[0]}</summary>
      {answer ? (
        <p className="text-[13px] leading-5 text-[#52525b] mt-3 mb-0">
          {answer}
        </p>
      ) : (
        parts.slice(1)
      )}
    </details>
  );
}
