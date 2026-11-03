"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  readSettingsAction,
  updateSettingsAction,
} from "@/actions/admin/settings";
import {
  settingsSchemas,
  type SettingsSection,
} from "@/schemas/site-settings";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, ToolbarButton } from "./AdminUi";

const sections: Array<{ id: SettingsSection; label: string }> = [
  { id: "general", label: "Umum & Brand" },
  { id: "hero", label: "Hero & Beranda" },
  { id: "navigation", label: "Navigasi & Footer" },
  { id: "seo", label: "SEO & Meta" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "calculator", label: "Kalkulator" },
  { id: "booking", label: "Booking" },
  { id: "tracking", label: "Tracking" },
  { id: "legal", label: "Legal & Privasi" },
];

type JsonRaw = Record<string, string>;

function updatePath(value: unknown, path: string[], nextValue: unknown): unknown {
  if (!path.length) return nextValue;
  const [head, ...tail] = path;
  if (Array.isArray(value)) {
    const index = Number(head);
    const copy = [...value];
    copy[index] = updatePath(copy[index], tail, nextValue);
    return copy;
  }
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return { ...source, [head]: updatePath(source[head], tail, nextValue) };
}

function settingLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminSettingsPage() {
  const [section, setSection] = useState<SettingsSection>("general");
  const [value, setValue] = useState<unknown>(null);
  const [raw, setRaw] = useState<JsonRaw>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void readSettingsAction(section)
      .then((result) => {
        if (!active) return;
        if (result.ok) setValue(result.data);
        else setError(result.message);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Pengaturan tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [section]);

  function renderFields(item: unknown, path: string[] = []): ReactNode {
    if (
      Array.isArray(item) ||
      (item &&
        typeof item === "object" &&
        "version" in item &&
        "blocks" in item)
    ) {
      const key = path.join(".");
      const text = raw[key] ?? JSON.stringify(item, null, 2);
      return (
        <label key={key} className="grid gap-1 text-xs font-medium text-[#52525b] sm:col-span-2">
          {path.length ? settingLabel(path[path.length - 1]) : "Nilai (JSON)"}
          <textarea
            rows={Math.min(12, Math.max(4, text.split("\n").length))}
            value={text}
            spellCheck={false}
            className="w-full rounded-[10px] bg-[#f0f0f0] p-3 font-mono text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
            onChange={(event) => {
              const nextText = event.target.value;
              setRaw((current) => ({ ...current, [key]: nextText }));
              try {
                const parsed = JSON.parse(nextText) as unknown;
                setValue((current: unknown) =>
                  updatePath(current, path, parsed)
                );
              } catch {
                // Preserve text for correction; validation is shown on save.
              }
            }}
          />
          <span className="text-[11px] text-[#71717a]">
            JSON tersimpan sebagai data terstruktur; jangan memasukkan kode berbahaya.
          </span>
        </label>
      );
    }
    if (item && typeof item === "object") {
      return Object.entries(item as Record<string, unknown>).map(
        ([key, child]) => (
          <fieldset key={[...path, key].join(".")} className="contents">
            {renderFields(child, [...path, key])}
          </fieldset>
        )
      );
    }
    const key = path.join(".");
    const label = settingLabel(path[path.length - 1] ?? "Nilai");
    if (typeof item === "boolean") {
      return (
        <label
          key={key}
          className="flex min-h-[38px] items-center gap-2.5 rounded-[10px] border border-[#eaeaea] bg-white px-3 text-xs font-medium text-[#18181a] cursor-pointer hover:bg-[#fafafa]"
        >
          <input
            type="checkbox"
            checked={item}
            onChange={(event) =>
              setValue((current: unknown) =>
                updatePath(current, path, event.target.checked)
              )
            }
            className="rounded border-[#d4d4d8]"
          />
          {label}
        </label>
      );
    }
    const isLong =
      typeof item === "string" &&
      (item.length > 100 ||
        /text|description|policy|template|consent|footer/i.test(
          path.at(-1) ?? ""
        ));
    const displayValue = item === null ? "" : String(item ?? "");
    return (
      <label key={key} className="grid gap-1 text-xs font-medium text-[#52525b]">
        {label}
        {isLong ? (
          <textarea
            rows={3}
            value={displayValue}
            onChange={(event) =>
              setValue((current: unknown) =>
                updatePath(current, path, event.target.value)
              )
            }
            className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
          />
        ) : (
          <input
            value={displayValue}
            inputMode={typeof item === "number" ? "numeric" : undefined}
            onChange={(event) => {
              const next = event.target.value;
              const parsed =
                typeof item === "number"
                  ? next === ""
                    ? 0
                    : Number(next)
                  : item === null && next === ""
                  ? null
                  : next;
              setValue((current: unknown) =>
                updatePath(current, path, parsed)
              );
            }}
            className={inputClass}
          />
        )}
      </label>
    );
  }

  async function save() {
    if (saving || value === null) return;
    let candidate: unknown = value;
    try {
      for (const [path, text] of Object.entries(raw)) {
        candidate = updatePath(
          candidate,
          path.split("."),
          JSON.parse(text) as unknown
        );
      }
    } catch {
      setError(
        "Perbaiki sintaks JSON pada bagian yang ditandai sebelum menyimpan."
      );
      setStatus("");
      return;
    }
    const parsed = settingsSchemas[section].safeParse(candidate);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Periksa kembali nilai pengaturan."
      );
      setStatus("");
      return;
    }
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await updateSettingsAction({
        section,
        value: parsed.data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setValue(result.data);
      setRaw({});
      setStatus("Pengaturan berhasil disimpan dan cache website diperbarui.");
    } catch {
      setError("Pengaturan tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminFrame
      title="Site Settings & Konfigurasi Global"
      description="Pengaturan terpusat untuk teks brand, nomor kontak, batasan kalkulator, kuota revisi, dan ketentuan privasi."
      screenKey="cms/site-settings"
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-3 py-1.5 text-[11px] font-medium text-[#18181a]">
            <span className="size-1.5 rounded-full bg-[#82b440]" />
            <span className="font-semibold">Auto-Cache Clean</span>
            <span className="text-[#71717a]">· Aktif</span>
          </div>
          <ToolbarButton
            variant="dark"
            icon="save"
            disabled={saving || loading || value === null}
            onClick={() => void save()}
          >
            {saving ? "Menyimpan…" : "Simpan Semua Perubahan"}
          </ToolbarButton>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}
      {status ? (
        <div className="mb-4 rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900 flex items-center gap-2">
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[240px_1fr]">
        {/* Navigation Section Pills */}
        <BentoCard className="p-2 sm:p-2.5">
          <nav aria-label="Bagian Site Settings" className="flex flex-col gap-1">
            {sections.map((item) => {
              const isSelected = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={saving}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (section === item.id) return;
                    setSection(item.id);
                    setValue(null);
                    setRaw({});
                    setLoading(true);
                    setError("");
                    setStatus("");
                  }}
                  className={`flex items-center justify-between rounded-[8px] px-3 py-2 text-left text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#18181a] text-white shadow-xs"
                      : "text-[#52525b] hover:bg-[#f0f0f0] hover:text-[#18181a]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected ? (
                    <span className="symbol text-sm text-white">chevron_right</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </BentoCard>

        {/* Form Body for Selected Section */}
        <BentoCard>
          <div className="mb-4 flex items-center justify-between border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                {sections.find((item) => item.id === section)?.label}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Perubahan divalidasi dengan kontrak data skema dan disimpan secara atomik
              </p>
            </div>
            <Chip variant="lime" size="sm">
              Live Config
            </Chip>
          </div>

          {loading ? (
            <p className="py-8 text-center text-xs text-[#71717a]">
              Memuat konfigurasi {section}…
            </p>
          ) : value !== null ? (
            <div className="grid gap-3.5 sm:grid-cols-2">
              {renderFields(value)}
            </div>
          ) : null}

          <div className="mt-5 border-t border-[#eaeaea] pt-3.5 flex justify-end">
            <ToolbarButton
              variant="dark"
              icon="save"
              disabled={saving || loading || value === null}
              onClick={() => void save()}
            >
              {saving ? "Menyimpan…" : "Simpan Pengaturan"}
            </ToolbarButton>
          </div>
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
