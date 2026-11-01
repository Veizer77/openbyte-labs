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

const sections: Array<{ id: SettingsSection; label: string }> = [
  { id: "general", label: "Umum" },
  { id: "hero", label: "Hero" },
  { id: "navigation", label: "Navigasi & Footer" },
  { id: "seo", label: "SEO" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "calculator", label: "Kalkulator" },
  { id: "booking", label: "Booking" },
  { id: "tracking", label: "Tracking" },
  { id: "legal", label: "Legal" },
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
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return { ...source, [head]: updatePath(source[head], tail, nextValue) };
}

function settingLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

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
    void readSettingsAction(section).then((result) => {
      if (!active) return;
      if (result.ok) setValue(result.data);
      else setError(result.message);
      setLoading(false);
    }).catch(() => {
      if (active) {
        setError("Pengaturan tidak dapat dimuat.");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [section]);

  function renderFields(item: unknown, path: string[] = []): ReactNode {
    if (Array.isArray(item) || (item && typeof item === "object" && "version" in item && "blocks" in item)) {
      const key = path.join(".");
      const text = raw[key] ?? JSON.stringify(item, null, 2);
      return (
        <label key={key} className="field sm:col-span-2">
          {path.length ? settingLabel(path[path.length - 1]) : "Nilai"}
          <textarea
            rows={Math.min(12, Math.max(4, text.split("\n").length))}
            value={text}
            spellCheck={false}
            onChange={(event) => {
              const nextText = event.target.value;
              setRaw((current) => ({ ...current, [key]: nextText }));
              try {
                const parsed = JSON.parse(nextText) as unknown;
                setValue((current: unknown) => updatePath(current, path, parsed));
              } catch {
                // Preserve text for correction; validation is shown on save.
              }
            }}
          />
          <span className="text-[11px] font-normal text-[#71717a]">
            JSON tersimpan sebagai data terstruktur; jangan memasukkan HTML.
          </span>
        </label>
      );
    }
    if (item && typeof item === "object") {
      return Object.entries(item as Record<string, unknown>).map(([key, child]) => (
        <fieldset key={[...path, key].join(".")} className="contents">
          {renderFields(child, [...path, key])}
        </fieldset>
      ));
    }
    const key = path.join(".");
    const label = settingLabel(path[path.length - 1] ?? "Nilai");
    if (typeof item === "boolean") {
      return (
        <label key={key} className="flex min-h-11 items-center gap-3 rounded-lg border border-neutral-200 px-3 text-sm">
          <input
            type="checkbox"
            checked={item}
            onChange={(event) => setValue((current: unknown) => updatePath(current, path, event.target.checked))}
          />
          {label}
        </label>
      );
    }
    const isLong = typeof item === "string" && (item.length > 100 || /text|description|policy|template|consent|footer/i.test(path.at(-1) ?? ""));
    const displayValue = item === null ? "" : String(item ?? "");
    return (
      <label key={key} className="field">
        {label}
        {isLong ? (
          <textarea
            rows={4}
            value={displayValue}
            onChange={(event) => setValue((current: unknown) => updatePath(current, path, event.target.value))}
          />
        ) : (
          <input
            value={displayValue}
            inputMode={typeof item === "number" ? "numeric" : undefined}
            onChange={(event) => {
              const next = event.target.value;
              const parsed = typeof item === "number" ? (next === "" ? 0 : Number(next)) : (item === null && next === "" ? null : next);
              setValue((current: unknown) => updatePath(current, path, parsed));
            }}
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
        candidate = updatePath(candidate, path.split("."), JSON.parse(text) as unknown);
      }
    } catch {
      setError("Perbaiki sintaks JSON pada bagian yang ditandai sebelum menyimpan.");
      setStatus("");
      return;
    }
    const parsed = settingsSchemas[section].safeParse(candidate);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali nilai pengaturan.");
      setStatus("");
      return;
    }
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await updateSettingsAction({ section, value: parsed.data });
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
      title="Site Settings"
      description="Kelola konfigurasi website yang dibaca dari database. Hak akses untuk WhatsApp, booking, dan tracking tetap diperiksa per bagian di server."
      actions={<button type="button" className="primary-button min-h-11" disabled={saving || loading || value === null} onClick={() => void save()}>{saving ? "Menyimpan…" : "Simpan perubahan"}</button>}
    >
      <div className="grid items-start gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Bagian Site Settings" className="grid grid-cols-2 gap-2 rounded-2xl border border-neutral-200 bg-white p-3 sm:grid-cols-3 xl:grid-cols-1">
              {sections.map((item) => (
              <button key={item.id} type="button" disabled={saving} aria-pressed={section === item.id} className={`min-h-11 rounded-lg px-3 text-left text-sm ${section === item.id ? "bg-[#18181a] text-white" : "hover:bg-neutral-100"}`} onClick={() => { if (section === item.id) return; setSection(item.id); setValue(null); setRaw({}); setLoading(true); setError(""); setStatus(""); }}>
              {item.label}
            </button>
          ))}
        </nav>
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="mb-5 border-b border-neutral-100 pb-4">
            <h2 className="m-0 text-lg font-semibold">{sections.find((item) => item.id === section)?.label}</h2>
            <p className="mb-0 mt-1 text-sm text-[#71717a]">Perubahan divalidasi dengan kontrak data dan disimpan atomik.</p>
          </div>
          {error ? <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
          {status ? <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
          {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat pengaturan…</p> : null}
          {value !== null ? <div className="grid gap-4 sm:grid-cols-2">{renderFields(value)}</div> : null}
        </section>
      </div>
    </AdminFrame>
  );
}
