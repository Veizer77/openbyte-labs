"use client";

import { useEffect, useState } from "react";
import {
  listStepTemplatesAction,
  saveStepTemplatesAction,
  type StepTemplateRecord,
} from "@/actions/admin/step-templates";
import { defaultSteps } from "@/lib/tracking/policy";
import { stepTemplatesInputSchema } from "@/schemas/step-templates";
import { AdminFrame } from "./AdminFrame";

const fallback = (): StepTemplateRecord[] => defaultSteps.map((title, index) => ({
  stepNumber: index + 1,
  title,
  description: "",
  defaultMilestones: [],
}));

export function AdminStepTemplatesPage() {
  const [templates, setTemplates] = useState<StepTemplateRecord[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void listStepTemplatesAction().then((result) => {
      if (!active) return;
      if (!result.ok) setError(result.message);
      else if (result.data.length) {
        const existing = new Map(result.data.map((item) => [item.stepNumber, item]));
        setTemplates(fallback().map((item) => existing.get(item.stepNumber) ?? item));
      }
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Template tahap tidak dapat dimuat."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  function update(index: number, patch: Partial<StepTemplateRecord>) {
    setTemplates((current) => current.map((template, itemIndex) => itemIndex === index ? { ...template, ...patch } : template));
  }

  async function save() {
    if (busy) return;
    const value = templates.map((template) => ({
      ...template,
      defaultMilestones: template.defaultMilestones
        .map((item) => item.trim())
        .filter(Boolean),
    }));
    const parsed = stepTemplatesInputSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali template.");
      setStatus("");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await saveStepTemplatesAction(parsed.data);
      if (!result.ok) setError(result.message);
      else {
        setTemplates(result.data);
        setStatus("Enam template tersimpan. Template ini berlaku untuk proyek yang dibuat setelahnya.");
      }
    } catch {
      setError("Template tahap tidak dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminFrame title="Template Tahap & Milestone" description="Atur enam tahap default untuk proyek klien yang baru dibuat. Perubahan tidak menimpa progres atau checklist proyek yang sudah berjalan." actions={<button type="button" className="primary-button min-h-11" disabled={busy || loading} onClick={() => void save()}>{busy ? "Menyimpan…" : "Simpan semua template"}</button>}>
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {status ? <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
      {loading ? <p role="status" className="rounded-xl bg-white p-5 text-sm text-[#71717a]">Memuat template…</p> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {templates.map((template, index) => (
          <section key={template.stepNumber} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#18181a] text-sm font-semibold text-white">{template.stepNumber}</span><h2 className="m-0 text-base font-semibold">Tahap {template.stepNumber}</h2></div>
            <div className="grid gap-4">
              <label className="field">Judul<input value={template.title} maxLength={250} onChange={(event) => update(index, { title: event.target.value })} /></label>
              <label className="field">Deskripsi<textarea rows={3} value={template.description} maxLength={2000} onChange={(event) => update(index, { description: event.target.value })} /></label>
              <label className="field">Milestone default (satu per baris)<textarea rows={5} value={template.defaultMilestones.join("\n")} onChange={(event) => update(index, { defaultMilestones: event.target.value.split("\n") })} /><span className="text-[11px] font-normal text-[#71717a]">Checklist dibuat saat proyek baru disimpan. Maksimal 50 milestone per tahap.</span></label>
            </div>
          </section>
        ))}
      </div>
    </AdminFrame>
  );
}
