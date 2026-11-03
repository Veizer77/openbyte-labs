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
import { BentoCard, ToolbarButton } from "./AdminUi";

const fallback = (): StepTemplateRecord[] =>
  defaultSteps.map((title, index) => ({
    stepNumber: index + 1,
    title,
    description: "",
    defaultMilestones: [],
  }));

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminStepTemplatesPage() {
  const [templates, setTemplates] = useState<StepTemplateRecord[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void listStepTemplatesAction()
      .then((result) => {
        if (!active) return;
        if (!result.ok) setError(result.message);
        else if (result.data.length) {
          const existing = new Map(
            result.data.map((item) => [item.stepNumber, item])
          );
          setTemplates(
            fallback().map((item) => existing.get(item.stepNumber) ?? item)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Template tahap tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  function update(index: number, patch: Partial<StepTemplateRecord>) {
    setTemplates((current) =>
      current.map((template, itemIndex) =>
        itemIndex === index ? { ...template, ...patch } : template
      )
    );
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
        setStatus(
          "Enam template berhasil disimpan. Template ini otomatis diterapkan pada proyek klien baru."
        );
      }
    } catch {
      setError("Template tahap tidak dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminFrame
      title="Template Tahap & Milestone"
      description="Konfigurasi enam tahap default untuk proyek klien baru. Perubahan tidak menimpa proyek yang sedang berjalan."
      screenKey="cms/template-tahap"
      actions={
        <ToolbarButton
          variant="dark"
          icon="save"
          disabled={busy || loading}
          onClick={() => void save()}
        >
          {busy ? "Menyimpan…" : "Simpan Semua Template"}
        </ToolbarButton>
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
      {loading ? (
        <p className="rounded-[12px] bg-white p-5 text-center text-xs text-[#71717a]">
          Memuat template tahapan…
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template, index) => (
          <BentoCard key={template.stepNumber} className="flex flex-col justify-between">
            <div>
              <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#eaeaea] pb-3">
                <span className="flex size-7 items-center justify-center rounded-[8px] bg-[#18181a] text-xs font-semibold text-white">
                  {template.stepNumber}
                </span>
                <h2 className="m-0 text-sm font-semibold text-[#18181a]">
                  Tahap {template.stepNumber}
                </h2>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Judul Tahap
                  <input
                    value={template.title}
                    maxLength={250}
                    onChange={(e) => update(index, { title: e.target.value })}
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Deskripsi Tahap
                  <textarea
                    rows={2}
                    value={template.description}
                    maxLength={2000}
                    onChange={(e) =>
                      update(index, { description: e.target.value })
                    }
                    className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Milestone Default (satu per baris)
                  <textarea
                    rows={4}
                    value={template.defaultMilestones.join("\n")}
                    onChange={(e) =>
                      update(index, {
                        defaultMilestones: e.target.value.split("\n"),
                      })
                    }
                    className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  />
                  <span className="text-[10px] text-[#71717a]">
                    Maksimal 50 checklist per tahap pengerjaan.
                  </span>
                </label>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>
    </AdminFrame>
  );
}
