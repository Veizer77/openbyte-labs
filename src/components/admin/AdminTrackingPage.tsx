"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, TabFilter, ToolbarButton } from "./AdminUi";
import {
  convertClientProjectToPortfolioAction,
  createClientProjectAction,
  listClientProjectsAction,
  readClientProjectAction,
  toggleTrackingAction,
  updateClientProjectAction,
} from "@/actions/admin/tracking";
import type {
  AdminClientProject,
  AdminTrackingDetail,
} from "@/lib/tracking/dto";
import type { ClientProjectInput } from "@/schemas/tracking";
import {
  TrackingAttachments,
  DownloadFile,
  type Attachment,
} from "@/components/tracking/TrackingFiles";
import { RichTextContent, dateTime, money } from "@/components/tracking/ui";

type Options = {
  categories: { id: string; name: string }[];
  packages: { id: string; name: string }[];
};
const closed = {
  staging: false,
  production: false,
  github: false,
  payments: false,
  documents: false,
  timeline: false,
};
const visibilityLabels = {
  staging: "Staging",
  production: "Produksi",
  github: "GitHub",
  payments: "Pembayaran",
  documents: "Dokumen",
  timeline: "Timeline",
};

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

function ProjectForm({
  project,
  options,
  busy,
  onSave,
}: {
  project?: AdminClientProject;
  options: Options;
  busy: boolean;
  onSave: (value: ClientProjectInput) => Promise<void>;
}) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const str = (k: string) => String(f.get(k) ?? "");
    await onSave({
      clientName: str("clientName"),
      clientWhatsapp: str("clientWhatsapp"),
      clientEmail: str("clientEmail"),
      projectTitle: str("projectTitle"),
      categoryId: str("categoryId") || null,
      servicePackageId: str("servicePackageId") || null,
      totalCost: Number(f.get("totalCost")),
      revisionsIncluded: Number(f.get("revisionsIncluded")),
      extraRevisionPrice: str("extraRevisionPrice")
        ? Number(f.get("extraRevisionPrice"))
        : null,
      startDate: str("startDate"),
      targetCompletionDate: str("targetCompletionDate"),
      stagingUrl: str("stagingUrl"),
      productionUrl: str("productionUrl"),
      githubUrl: str("githubUrl"),
      internalNotes: str("internalNotes"),
      clientVisibility: Object.fromEntries(
        Object.keys(closed).map((key) => [key, f.has(`visibility-${key}`)]),
      ) as typeof closed,
    });
  }
  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Nama Proyek
          <input
            name="projectTitle"
            className={inputClass}
            required
            maxLength={200}
            defaultValue={project?.projectTitle}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Nama Klien
          <input
            name="clientName"
            className={inputClass}
            required
            maxLength={200}
            defaultValue={project?.clientName}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          WhatsApp Klien
          <input
            name="clientWhatsapp"
            className={inputClass}
            required
            defaultValue={project?.clientWhatsapp}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Email Klien (opsional)
          <input
            name="clientEmail"
            type="email"
            className={inputClass}
            defaultValue={project?.clientEmail ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Kategori
          <select
            name="categoryId"
            className={inputClass}
            defaultValue={project?.categoryId ?? ""}
          >
            <option value="">Tanpa kategori</option>
            {options.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Paket Layanan
          <select
            name="servicePackageId"
            className={inputClass}
            defaultValue={project?.servicePackageId ?? ""}
          >
            <option value="">Proyek custom</option>
            {options.packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Total Biaya (IDR)
          <input
            name="totalCost"
            type="number"
            min={0}
            max={2147483647}
            step={1}
            className={inputClass}
            required
            defaultValue={project?.totalCost ?? 0}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Kuota Revisi Termasuk
          <input
            name="revisionsIncluded"
            type="number"
            min={0}
            max={32767}
            className={inputClass}
            required
            defaultValue={project?.revisionsIncluded ?? 2}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Biaya Revisi Tambahan (IDR, opsional)
          <input
            name="extraRevisionPrice"
            type="number"
            min={0}
            max={2147483647}
            className={inputClass}
            defaultValue={project?.extraRevisionPrice ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Tanggal Mulai
          <input
            name="startDate"
            type="date"
            className={inputClass}
            defaultValue={project?.startDate ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Target Selesai
          <input
            name="targetCompletionDate"
            type="date"
            className={inputClass}
            defaultValue={project?.targetCompletionDate ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          URL Staging
          <input
            name="stagingUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.stagingUrl ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          URL Produksi
          <input
            name="productionUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.productionUrl ?? ""}
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          URL Repository GitHub
          <input
            name="githubUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.githubUrl ?? ""}
          />
        </label>
      </div>

      <div className="rounded-[10px] border border-[#eaeaea] p-3">
        <span className="text-xs font-medium text-[#18181a] block mb-2">
          Visibilitas Menu ke Klien
        </span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {Object.entries(visibilityLabels).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-1.5 text-xs text-[#52525b] cursor-pointer"
            >
              <input
                type="checkbox"
                name={`visibility-${key}`}
                className="rounded border-[#d4d4d8]"
                defaultChecked={
                  project?.clientVisibility[key as keyof typeof closed] ?? false
                }
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <label className="grid gap-1 text-xs font-medium text-[#52525b]">
        Catatan Internal (rahasia, tidak tampil ke klien)
        <textarea
          name="internalNotes"
          className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
          rows={3}
          maxLength={20000}
          defaultValue={project?.internalNotes ?? ""}
        />
      </label>

      <div className="pt-2">
        <ToolbarButton type="submit" variant="dark" disabled={busy} className="w-full">
          {project ? "Simpan Perubahan Proyek" : "Buat Proyek & Terbitkan PIN"}
        </ToolbarButton>
      </div>
    </form>
  );
}

type Mutate = (input: unknown) => Promise<boolean>;

function Steps({
  data,
  mutate,
  busy,
}: {
  data: AdminTrackingDetail;
  mutate: Mutate;
  busy: boolean;
}) {
  return (
    <div className="grid gap-3">
      {data.steps.map((step) => (
        <details
          key={`${step.id}:${String(step.updatedAt)}`}
          className="rounded-[12px] border border-[#eaeaea] bg-white p-3.5"
        >
          <summary className="cursor-pointer text-xs font-semibold text-[#18181a] flex items-center justify-between">
            <span>
              {step.stepNumber}. {step.title}
            </span>
            <Chip
              variant={
                step.status === "done"
                  ? "success"
                  : step.status === "in_progress"
                  ? "warning"
                  : "neutral"
              }
              size="sm"
            >
              {step.status}
            </Chip>
          </summary>
          <form
            className="mt-4 grid gap-3 border-t border-[#f0f0f0] pt-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const milestones = String(f.get("milestones"))
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => ({
                  title: s.replace(/^\[[x ]\]\s*/i, ""),
                  isCompleted: /^\[x\]/i.test(s),
                }));
              await mutate({
                kind: "step",
                stepNumber: step.stepNumber,
                title: f.get("title"),
                description: f.get("description"),
                status: f.get("status"),
                milestones,
              });
            }}
          >
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Judul Tahap
              <input
                className={inputClass}
                name="title"
                defaultValue={step.title}
                maxLength={200}
                required
              />
            </label>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Keterangan
              <textarea
                className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none resize-y"
                name="description"
                defaultValue={step.description}
                maxLength={2000}
                rows={2}
              />
            </label>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Status
              <select
                className={inputClass}
                name="status"
                defaultValue={step.status}
              >
                <option value="pending">Belum dimulai</option>
                <option value="in_progress">Sedang dikerjakan</option>
                <option value="done">Selesai</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Milestone (satu per baris, awali [x] untuk selesai)
              <textarea
                className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none font-mono resize-y"
                name="milestones"
                rows={4}
                defaultValue={data.milestones
                  .filter((m) => m.projectStepId === step.id)
                  .map((m) => `${m.isCompleted ? "[x]" : "[ ]"} ${m.title}`)
                  .join("\n")}
              />
            </label>
            <ToolbarButton type="submit" variant="dark" disabled={busy}>
              Simpan Tahap {step.stepNumber}
            </ToolbarButton>
          </form>
        </details>
      ))}
    </div>
  );
}

function Payments({
  data,
  mutate,
  busy,
}: {
  data: AdminTrackingDetail;
  mutate: Mutate;
  busy: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [files, setFiles] = useState<Attachment[]>([]);
  const row = data.payments.find((p) => p.id === editing);
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[10px] bg-[#f9f9f9] p-3 border border-[#eaeaea]">
          <span className="text-[11px] text-[#71717a] block">Total Biaya</span>
          <span className="text-sm font-semibold text-[#18181a]">
            {money(data.project.totalCost)}
          </span>
        </div>
        <div className="rounded-[10px] bg-[#f9f9f9] p-3 border border-[#eaeaea]">
          <span className="text-[11px] text-[#71717a] block">Terbayar</span>
          <span className="text-sm font-semibold text-[#457c1d]">
            {money(data.project.paidAmount)}
          </span>
        </div>
        <div className="rounded-[10px] bg-[#f9f9f9] p-3 border border-[#eaeaea]">
          <span className="text-[11px] text-[#71717a] block">Sisa Saldo</span>
          <span className="text-sm font-semibold text-[#c2410c]">
            {money(data.project.balance)}
          </span>
        </div>
      </div>

      <form
        key={editing ?? "new"}
        className="grid gap-3.5 rounded-[12px] border border-[#eaeaea] p-4 bg-[#fafafa]"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          if (
            await mutate({
              kind: "payment",
              id: editing,
              amount: Number(f.get("amount")),
              paidAt: new Date(String(f.get("paidAt"))).toISOString(),
              method: f.get("method"),
              note: f.get("note"),
              isVisibleToClient: f.has("visible"),
              proofFileId: files[0]?.fileId ?? row?.proofFileId ?? null,
            })
          ) {
            form.reset();
            setFiles([]);
            setEditing(null);
          }
        }}
      >
        <h3 className="m-0 text-sm font-semibold text-[#18181a]">
          {editing ? "Ubah Pembayaran" : "Catat Pembayaran Baru"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Nominal (IDR)
            <input
              className={inputClass}
              name="amount"
              type="number"
              min={1}
              max={2147483647}
              defaultValue={row?.amount}
              required
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Metode
            <select
              name="method"
              className={inputClass}
              defaultValue={row?.method ?? "transfer"}
            >
              <option value="transfer">Transfer Bank</option>
              <option value="tunai">Tunai</option>
              <option value="qris">QRIS</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Waktu Pembayaran
          <input
            className={inputClass}
            name="paidAt"
            type="datetime-local"
            required
            defaultValue={
              row
                ? new Date(
                    new Date(row.paidAt).getTime() -
                      new Date(row.paidAt).getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
          />
        </label>

        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Catatan
          <textarea
            className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none resize-y"
            name="note"
            rows={2}
            maxLength={2000}
            defaultValue={row?.note}
          />
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
          <input
            type="checkbox"
            name="visible"
            className="rounded border-[#d4d4d8]"
            defaultChecked={row?.isVisibleToClient ?? true}
          />
          Tampilkan pembayaran ke portal klien
        </label>

        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
          max={1}
        />

        <div className="flex gap-2">
          <ToolbarButton type="submit" variant="dark" disabled={busy}>
            Simpan Pembayaran
          </ToolbarButton>
          {editing ? (
            <ToolbarButton
              variant="light"
              onClick={() => {
                setEditing(null);
                setFiles([]);
              }}
            >
              Batal
            </ToolbarButton>
          ) : null}
        </div>
      </form>

      {data.payments.length ? (
        <div className="grid gap-2">
          {data.payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eaeaea] p-3.5 bg-white text-xs"
            >
              <div>
                <span className="font-semibold text-sm text-[#18181a]">
                  {money(p.amount)}
                </span>
                <span className="ml-2 text-[#71717a]">· {p.method}</span>
                <p className="m-0 mt-1 text-[11px] text-[#71717a]">
                  {dateTime(p.paidAt)} ·{" "}
                  {p.isVisibleToClient ? "Tampil di portal" : "Internal"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <ToolbarButton
                  variant="light"
                  onClick={() => {
                    setEditing(p.id);
                    setFiles([]);
                  }}
                >
                  Ubah
                </ToolbarButton>
                {p.proofFileId ? (
                  <DownloadFile
                    fileId={p.proofFileId}
                    label="Bukti"
                    adminProjectId={data.project.id}
                  />
                ) : null}
                <ToolbarButton
                  variant="danger"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("Hapus pembayaran ini dan hitung ulang saldo?"))
                      void mutate({ kind: "deletePayment", id: p.id });
                  }}
                >
                  Hapus
                </ToolbarButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#71717a]">Belum ada riwayat pembayaran.</p>
      )}
    </div>
  );
}

function Documents({
  data,
  mutate,
  busy,
}: {
  data: AdminTrackingDetail;
  mutate: Mutate;
  busy: boolean;
}) {
  const [files, setFiles] = useState<Attachment[]>([]);
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3.5 rounded-[12px] border border-[#eaeaea] p-4 bg-[#fafafa]"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          if (
            await mutate({
              kind: "document",
              title: f.get("title"),
              url: String(f.get("url")) || null,
              fileId: files[0]?.fileId ?? null,
              isVisibleToClient: f.has("visible"),
            })
          ) {
            form.reset();
            setFiles([]);
          }
        }}
      >
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Judul Dokumen
          <input name="title" className={inputClass} required maxLength={200} />
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          URL HTTPS (kosongkan jika mengunggah berkas)
          <input type="url" name="url" className={inputClass} />
        </label>
        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
          max={1}
        />
        <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
          <input
            type="checkbox"
            name="visible"
            className="rounded border-[#d4d4d8]"
            defaultChecked
          />
          Tampilkan dokumen ke portal klien
        </label>
        <ToolbarButton type="submit" variant="dark" disabled={busy}>
          Tambahkan Dokumen
        </ToolbarButton>
      </form>

      <div className="grid gap-2">
        {data.documents.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between gap-3 rounded-[12px] border border-[#eaeaea] p-3 bg-white text-xs"
          >
            <div>
              <span className="font-semibold text-[#18181a]">{d.title}</span>
              <span className="ml-2 text-[11px] text-[#71717a]">
                · {d.isVisibleToClient ? "Tampil" : "Internal"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {d.fileId ? (
                <DownloadFile
                  fileId={d.fileId}
                  label="Unduh"
                  adminProjectId={data.project.id}
                />
              ) : (
                <a
                  href={d.url!}
                  className="inline-flex items-center justify-center gap-1.5 h-[34px] px-3.5 rounded-[12px] text-[13px] font-medium bg-white border border-[#eaeaea] text-[#18181a] hover:bg-[#f9f9f9]"
                  rel="noreferrer"
                  target="_blank"
                >
                  Buka
                </a>
              )}
              <ToolbarButton
                variant="danger"
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Hapus dokumen dari proyek?"))
                    void mutate({ kind: "deleteDocument", id: d.id });
                }}
              >
                Hapus
              </ToolbarButton>
            </div>
          </div>
        ))}
      </div>
      {!data.documents.length ? (
        <p className="text-xs text-[#71717a]">Belum ada dokumen proyek.</p>
      ) : null}
    </div>
  );
}

function Revisions({
  data,
  mutate,
  busy,
}: {
  data: AdminTrackingDetail;
  mutate: Mutate;
  busy: boolean;
}) {
  return (
    <div className="grid gap-4">
      {data.revisions.map((r) => (
        <div
          key={`${r.id}:${String(r.updatedAt)}`}
          className="rounded-[12px] border border-[#eaeaea] bg-white p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#71717a]">
              #{r.roundNumber} · {r.type}
            </span>
            <Chip
              variant={
                r.status === "done"
                  ? "success"
                  : r.status === "rejected"
                  ? "danger"
                  : "warning"
              }
              size="sm"
            >
              {r.status}
            </Chip>
          </div>
          <h3 className="my-2 text-sm font-semibold text-[#18181a]">{r.title}</h3>
          <p className="m-0 text-xs text-[#52525b] whitespace-pre-wrap leading-relaxed">
            {r.description}
          </p>
          {r.attachments.length ? (
            <div className="my-3 flex flex-wrap gap-2">
              {r.attachments.map((a) => (
                <DownloadFile
                  key={a.fileId}
                  fileId={a.fileId}
                  label={a.filename}
                  adminProjectId={data.project.id}
                />
              ))}
            </div>
          ) : null}

          {r.quotedPrice !== null ? (
            <div className="my-3 rounded-[8px] bg-[#f9f9f9] p-2.5 text-xs text-[#18181a]">
              Penawaran Biaya: <strong>{money(r.quotedPrice)}</strong> ·{" "}
              {r.clientAcceptedQuoteAt ? "Disetujui klien" : "Belum disetujui"}
            </div>
          ) : null}

          {!["done", "rejected"].includes(r.status) ? (
            <form
              className="mt-3 grid gap-3 border-t border-[#f0f0f0] pt-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const amount = String(f.get("quotedPrice") ?? "");
                await mutate({
                  kind: "revision",
                  id: r.id,
                  event: f.get("event"),
                  adminResponse: f.get("response"),
                  ...(amount ? { quotedPrice: Number(amount) } : {}),
                });
              }}
            >
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Aksi Tanggapan Revisi
                <select className={inputClass} name="event">
                  {r.status === "submitted" || r.status === "needs_payment" ? (
                    <>
                      <option value="ACCEPT">Terima pengajuan</option>
                      {r.status === "needs_payment" ? (
                        <option value="SET_QUOTE">
                          Tetapkan / ubah penawaran biaya
                        </option>
                      ) : null}
                      <option value="REJECT">Tolak (wajib beri tanggapan)</option>
                    </>
                  ) : null}
                  {r.status === "accepted" ? (
                    <option value="START">Mulai pengerjaan</option>
                  ) : null}
                  {r.status === "in_progress" ? (
                    <option value="DONE">Tandai selesai</option>
                  ) : null}
                </select>
              </label>

              {r.status === "needs_payment" ? (
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Biaya Penawaran (IDR)
                  <input
                    type="number"
                    className={inputClass}
                    name="quotedPrice"
                    min={0}
                    max={2147483647}
                    defaultValue={r.quotedPrice ?? ""}
                  />
                </label>
              ) : null}

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Tanggapan Admin
                <textarea
                  className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none resize-y"
                  name="response"
                  rows={2}
                  maxLength={2000}
                  defaultValue={r.adminResponse ?? ""}
                />
              </label>

              <ToolbarButton type="submit" variant="dark" disabled={busy}>
                Proses Revisi #{r.roundNumber}
              </ToolbarButton>
            </form>
          ) : (
            <p className="mt-2 text-xs text-[#52525b] italic">
              {r.adminResponse || "Tidak ada tanggapan tertulis."}
            </p>
          )}
        </div>
      ))}
      {!data.revisions.length ? (
        <p className="text-xs text-[#71717a]">
          Belum ada pengajuan revisi dari klien.
        </p>
      ) : null}
    </div>
  );
}

function Discussion({
  data,
  mutate,
  busy,
}: {
  data: AdminTrackingDetail;
  mutate: Mutate;
  busy: boolean;
}) {
  const [files, setFiles] = useState<Attachment[]>([]);
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3.5 rounded-[12px] border border-[#eaeaea] p-4 bg-[#fafafa]"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          if (
            await mutate({
              kind: "comment",
              body: f.get("body"),
              revisionRequestId: f.get("revisionRequestId") || null,
              isInternal: f.has("internal"),
              fileIds: files.map((v) => v.fileId),
            })
          ) {
            form.reset();
            setFiles([]);
          }
        }}
      >
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Utasan Diskusi
          <select className={inputClass} name="revisionRequestId">
            <option value="">Diskusi umum proyek</option>
            {data.revisions.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.roundNumber}: {r.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Pesan / Catatan
          <textarea
            className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none resize-y"
            name="body"
            required
            maxLength={10000}
            rows={3}
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
          <input
            type="checkbox"
            name="internal"
            className="rounded border-[#d4d4d8]"
          />
          Catatan internal rahasia (jangan tampilkan ke klien)
        </label>
        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
        />
        <ToolbarButton type="submit" variant="dark" disabled={busy}>
          Kirim Tanggapan
        </ToolbarButton>
      </form>

      <div className="grid gap-2.5">
        {data.comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-[12px] border p-3.5 text-xs ${
              c.isInternal
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-[#eaeaea] bg-white text-[#18181a]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">
                {c.authorName} {c.isInternal ? "(Internal Only)" : ""}
              </span>
              <span className="text-[11px] text-[#71717a]">
                {dateTime(c.createdAt)}
              </span>
            </div>
            <p className="m-0 mt-1.5 whitespace-pre-wrap leading-relaxed">
              {c.body}
            </p>
            {c.attachments.length ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {c.attachments.map((a) => (
                  <DownloadFile
                    key={a.fileId}
                    fileId={a.fileId}
                    label={a.filename}
                    adminProjectId={data.project.id}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {!data.comments.length ? (
        <p className="text-xs text-[#71717a]">Belum ada diskusi.</p>
      ) : null}
    </div>
  );
}

export function AdminTrackingPage() {
  const [projects, setProjects] = useState<AdminClientProject[]>([]);
  const [options, setOptions] = useState<Options>({
    categories: [],
    packages: [],
  });
  const [enabled, setEnabled] = useState(false);
  const [detail, setDetail] = useState<AdminTrackingDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState("project");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [portfolioNameConsent, setPortfolioNameConsent] = useState(false);
  const [credentials, setCredentials] = useState<{
    code: string;
    pin: string;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await listClientProjectsAction();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setProjects(result.data.projects);
      setEnabled(result.data.settings.trackingEnabled);
      setOptions(result.data.options);
    } catch {
      setError("Data proyek belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void listClientProjectsAction()
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setProjects(result.data.projects);
        setEnabled(result.data.settings.trackingEnabled);
        setOptions(result.data.options);
      })
      .catch(() => {
        if (active) setError("Data proyek belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function select(id: string) {
    setBusy(true);
    setError("");
    setCreating(false);
    try {
      const result = await readClientProjectAction(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDetail(result.data);
    } catch {
      setError("Rincian proyek belum dapat dimuat.");
    } finally {
      setBusy(false);
    }
  }

  async function mutate(input: unknown) {
    if (!detail) return false;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await updateClientProjectAction(detail.project.id, input);
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      if (result.data.pin)
        setCredentials({
          code: detail.project.trackingCode,
          pin: result.data.pin,
        });
      const fresh = await readClientProjectAction(detail.project.id);
      if (fresh.ok) setDetail(fresh.data);
      else setError(fresh.message);
      await load();
      setStatus("Perubahan proyek sudah tersimpan.");
      return true;
    } catch {
      setError("Koneksi terputus. Muat ulang data sebelum mencoba kembali.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminFrame
      title="Proyek Klien & Tracking"
      description="Kelola progres, kredensial PIN klien, pencatatan termin, dan persetujuan serah terima."
      screenKey="cms/proyek-klien-tracking"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={busy || loading}
            onClick={() => void load()}
          >
            Refresh Data
          </ToolbarButton>
          <ToolbarButton
            variant="dark"
            icon="add"
            disabled={busy || loading}
            onClick={() => {
              setCreating(true);
              setDetail(null);
              setError("");
              setTab("project");
            }}
          >
            Buat Proyek Klien
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

      {/* Credentials Banner */}
      {credentials ? (
        <div className="mb-5 rounded-[14px] border border-[#d2d88f] bg-[#f9faeb] p-4 text-xs text-[#454a10]">
          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
            Simpan PIN ini sekarang (hanya ditampilkan sekali)
          </h3>
          <p className="mt-1 text-xs">
            Kode Tracking: <strong>{credentials.code}</strong>
          </p>
          <p className="mt-1 text-xs">
            PIN Akses:{" "}
            <strong className="font-mono text-base tracking-[.2em] text-[#18181a]">
              {credentials.pin}
            </strong>
          </p>
          <p className="mt-1 text-[11px] text-[#71717a]">
            Kirim kode dan PIN secara terpisah melalui kanal pribadi klien.
          </p>
          <div className="mt-3">
            <ToolbarButton
              variant="light"
              onClick={() => setCredentials(null)}
            >
              Saya Sudah Menyimpan PIN
            </ToolbarButton>
          </div>
        </div>
      ) : null}

      {/* Portal Status Card */}
      <BentoCard className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-sm font-semibold text-[#18181a]">
              Portal Tracking Publik:
            </h3>
            <Chip variant={enabled ? "success" : "neutral"} size="sm">
              {enabled ? "Aktif" : "Nonaktif"}
            </Chip>
          </div>
          <p className="mt-0.5 text-xs text-[#71717a]">
            {enabled
              ? "Klien dapat mengakses link tracking dengan kode & PIN."
              : "Semua akses portal klien saat ini diblokir."}
          </p>
        </div>
        <div className="flex gap-2">
          <ToolbarButton href="/tracking" variant="light" icon="open_in_new">
            Buka Portal
          </ToolbarButton>
          <ToolbarButton
            variant={enabled ? "light" : "dark"}
            disabled={busy || loading}
            onClick={async () => {
              if (
                !window.confirm(
                  enabled
                    ? "Nonaktifkan seluruh akses portal klien?"
                    : "Aktifkan portal dan menu Tracking Klien untuk pengunjung?"
                )
              )
                return;
              setBusy(true);
              setError("");
              try {
                const result = await toggleTrackingAction(!enabled);
                if (!result.ok) {
                  setError(result.message);
                  return;
                }
                setEnabled(!enabled);
                setStatus("Pengaturan status portal disimpan.");
              } catch {
                setError("Pengaturan belum dapat disimpan.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {enabled ? "Nonaktifkan Portal" : "Aktifkan Portal"}
          </ToolbarButton>
        </div>
      </BentoCard>

      <div className="grid items-start gap-5 xl:grid-cols-[300px_1fr]">
        {/* Left Side: Client Projects List */}
        <BentoCard>
          <div className="mb-3 flex items-center justify-between border-b border-[#eaeaea] pb-2.5">
            <h2 className="m-0 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
              Proyek Klien ({projects.length})
            </h2>
            <button
              className="text-xs text-[#71717a] hover:text-[#18181a] underline"
              onClick={() => {
                setError("");
                void load();
              }}
              disabled={busy}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-center text-xs text-[#71717a] py-6">Memuat proyek…</p>
          ) : projects.length === 0 ? (
            <EmptyState
              icon="assignment"
              title="Belum ada proyek"
              description="Buat proyek klien pertama untuk menerbitkan kode tracking."
            />
          ) : (
            <div className="grid gap-2 max-h-[700px] overflow-y-auto">
              {projects.map((p) => {
                const isSelected = detail?.project.id === p.id;
                return (
                  <button
                    key={p.id}
                    className={`w-full rounded-[10px] border p-3 text-left transition-all ${
                      isSelected
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                    disabled={busy}
                    onClick={() => {
                      setTab("project");
                      void select(p.id);
                    }}
                  >
                    <strong className="block text-xs font-semibold text-[#18181a] truncate">
                      {p.projectTitle}
                    </strong>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#52525b]">
                      <span className="truncate">{p.clientName}</span>
                      <Chip variant="neutral" size="sm">
                        Tahap {p.currentStep}
                      </Chip>
                    </div>
                    <div className="mt-1 text-[10px] text-[#71717a] font-mono">
                      {p.trackingCode}
                      {p.archivedAt ? " · Diarsipkan" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </BentoCard>

        {/* Right Side: Detail & Action Tabs */}
        <div className="min-w-0">
          {creating ? (
            <BentoCard>
              <h2 className="mb-4 mt-0 text-base font-semibold text-[#18181a]">
                Buat Proyek Klien Baru
              </h2>
              <ProjectForm
                options={options}
                busy={busy}
                onSave={async (value) => {
                  setBusy(true);
                  setError("");
                  try {
                    const result = await createClientProjectAction(value);
                    if (!result.ok) {
                      setError(result.message);
                      return;
                    }
                    setCredentials({
                      code: result.data.project.trackingCode,
                      pin: result.data.pin,
                    });
                    await load();
                    await select(result.data.project.id);
                    setStatus("Proyek dan enam tahap berhasil dibuat.");
                  } catch {
                    setError("Koneksi terputus. Gagal membuat proyek.");
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </BentoCard>
          ) : detail ? (
            <div className="grid gap-4">
              {/* Project Header Info */}
              <BentoCard className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="m-0 text-base font-semibold text-[#18181a]">
                      {detail.project.projectTitle}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#71717a] font-mono">
                      Kode: {detail.project.trackingCode} · Klien:{" "}
                      {detail.project.clientName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <a
                      className="inline-flex items-center justify-center gap-1.5 h-[34px] px-3 rounded-[12px] text-xs font-medium bg-[#e2e89d] text-[#454a10] hover:bg-[#d2d88f]"
                      href={`https://wa.me/${detail.project.clientWhatsapp}?text=${encodeURIComponent(
                        `Halo ${detail.project.clientName}, pantau proyek "${
                          detail.project.projectTitle
                        }" di ${
                          typeof window !== "undefined"
                            ? window.location.origin
                            : ""
                        }/tracking\nKode Tracking: ${
                          detail.project.trackingCode
                        }\nPIN dikirim terpisah.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="symbol text-base">chat</span>
                      Kirim WA
                    </a>

                    <ToolbarButton
                      variant="light"
                      disabled={busy}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Buat PIN baru? Semua sesi klien yang lama langsung tidak berlaku."
                          )
                        )
                          void mutate({ kind: "pin" });
                      }}
                    >
                      Reset PIN
                    </ToolbarButton>

                    <ToolbarButton
                      variant="light"
                      disabled={busy}
                      onClick={() => {
                        if (
                          window.confirm(
                            detail.project.archivedAt
                              ? "Pulihkan akses proyek ini?"
                              : "Arsipkan proyek dan tutup akses klien?"
                          )
                        )
                          void mutate({
                            kind: "archive",
                            archived: !detail.project.archivedAt,
                          });
                      }}
                    >
                      {detail.project.archivedAt ? "Pulihkan" : "Arsipkan"}
                    </ToolbarButton>

                    <label className="flex items-center gap-2 text-[11px] text-[#52525b] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portfolioNameConsent}
                        onChange={(e) => setPortfolioNameConsent(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[#18181a] cursor-pointer"
                      />
                      Klien mengizinkan nama publikasi
                    </label>

                    <ToolbarButton
                      variant="light"
                      disabled={busy || detail.project.currentStep !== 6}
                      title={
                        detail.project.currentStep !== 6
                          ? "Selesaikan seluruh tahap terlebih dahulu"
                          : undefined
                      }
                      onClick={async () => {
                        if (
                          !window.confirm(
                            portfolioNameConsent
                              ? `Buat draft portofolio DENGAN nama klien "${detail.project.clientName}"? Pastikan klien sudah memberi izin publikasi.`
                              : "Buat draft portofolio anonim (tanpa nama klien)? Kategori dan tahun proyek tetap disalin. Draft perlu dilengkapi gambar dan konten sebelum diterbitkan."
                          )
                        )
                          return;
                        setBusy(true);
                        setError("");
                        setStatus("");
                        try {
                          const result =
                            await convertClientProjectToPortfolioAction(
                              detail.project.id,
                              portfolioNameConsent
                            );
                          if (!result.ok) setError(result.message);
                          else
                            setStatus(
                              result.data.alreadyLinked
                                ? "Proyek ini sudah terhubung ke draft portofolio."
                                : `Draft portofolio /${result.data.slug} dibuat tanpa data identitas klien.`
                            );
                        } catch {
                          setError("Draft portofolio tidak dapat dibuat.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Ke Portofolio
                    </ToolbarButton>
                  </div>
                </div>

                {/* Subnavigation Tabs */}
                <div className="mt-4 border-t border-[#eaeaea] pt-3">
                  <TabFilter
                    tabs={[
                      { id: "project", label: "Proyek" },
                      { id: "steps", label: "Tahap & Milestone" },
                      { id: "payments", label: "Pembayaran" },
                      { id: "revisions", label: "Revisi" },
                      { id: "discussion", label: "Diskusi" },
                      { id: "documents", label: "Dokumen" },
                      { id: "updates", label: "Timeline" },
                      { id: "approvals", label: "Persetujuan" },
                    ]}
                    active={tab}
                    onChange={setTab}
                  />
                </div>
              </BentoCard>

              {/* Tab Contents */}
              <BentoCard>
                {tab === "project" ? (
                  <ProjectForm
                    key={detail.project.id}
                    project={detail.project}
                    options={options}
                    busy={busy}
                    onSave={async (value) => {
                      await mutate({ kind: "update", value });
                    }}
                  />
                ) : null}

                {tab === "steps" ? (
                  <Steps data={detail} mutate={mutate} busy={busy} />
                ) : null}

                {tab === "payments" ? (
                  <Payments data={detail} mutate={mutate} busy={busy} />
                ) : null}

                {tab === "documents" ? (
                  <Documents data={detail} mutate={mutate} busy={busy} />
                ) : null}

                {tab === "discussion" ? (
                  <Discussion data={detail} mutate={mutate} busy={busy} />
                ) : null}

                {tab === "revisions" ? (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f9f9f9] p-3 border border-[#eaeaea] text-xs">
                      <span>
                        Revisi terpakai:{" "}
                        <strong className="text-[#18181a]">
                          {detail.project.revisionsUsed} /{" "}
                          {detail.project.revisionsIncluded}
                        </strong>
                      </span>
                      <ToolbarButton
                        variant={detail.project.isReviewOpen ? "light" : "dark"}
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              detail.project.isReviewOpen
                                ? "Tutup review klien?"
                                : "Buka periode review dan tahap 5 untuk klien?"
                            )
                          )
                            void mutate({
                              kind: "review",
                              open: !detail.project.isReviewOpen,
                            });
                        }}
                      >
                        {detail.project.isReviewOpen
                          ? "Tutup Review"
                          : "Buka Review Klien"}
                      </ToolbarButton>
                    </div>
                    <Revisions data={detail} mutate={mutate} busy={busy} />
                  </div>
                ) : null}

                {tab === "updates" ? (
                  <div className="grid gap-4">
                    <form
                      className="grid gap-3 rounded-[12px] border border-[#eaeaea] p-4 bg-[#fafafa]"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const f = new FormData(form);
                        if (
                          await mutate({
                            kind: "updatePost",
                            title: f.get("title"),
                            body: f.get("body"),
                            isVisibleToClient: f.has("visible"),
                          })
                        )
                          form.reset();
                      }}
                    >
                      <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                        Judul Pembaruan
                        <input
                          className={inputClass}
                          name="title"
                          required
                          maxLength={200}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                        Isi Pembaruan
                        <textarea
                          className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none resize-y"
                          name="body"
                          rows={3}
                          required
                          maxLength={10000}
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
                        <input
                          type="checkbox"
                          name="visible"
                          className="rounded border-[#d4d4d8]"
                          defaultChecked
                        />
                        Tampilkan ke portal klien
                      </label>
                      <ToolbarButton type="submit" variant="dark" disabled={busy}>
                        Terbitkan Pembaruan
                      </ToolbarButton>
                    </form>

                    <div className="grid gap-2.5">
                      {detail.updates.map((u) => (
                        <div
                          key={u.id}
                          className="rounded-[12px] border border-[#eaeaea] p-3.5 bg-white text-xs"
                        >
                          <h4 className="m-0 font-semibold text-[#18181a]">{u.title}</h4>
                          <p className="m-0 my-1 text-[11px] text-[#71717a]">
                            {dateTime(u.createdAt)} ·{" "}
                            {u.isVisibleToClient ? "Tampil ke klien" : "Internal"}
                          </p>
                          <div className="mt-2 text-xs text-[#52525b]">
                            <RichTextContent value={u.body} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {tab === "approvals" ? (
                  <div className="grid gap-3">
                    {detail.approvals.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-[12px] border border-[#eaeaea] p-3.5 bg-white text-xs"
                      >
                        <h4 className="m-0 font-semibold text-[#18181a]">
                          {a.type === "step_review"
                            ? "Persetujuan Hasil Review"
                            : "Serah Terima Akhir Proyek"}
                        </h4>
                        <p className="my-1 text-[11px] text-[#71717a]">
                          Disetujui oleh: {a.approvedByName} · {dateTime(a.approvedAt)}
                        </p>
                        <p className="m-0 mt-1.5 text-xs text-[#52525b] whitespace-pre-wrap">
                          {a.note}
                        </p>
                        <p className="mt-2 font-mono text-[10px] text-[#a1a1aa]">
                          ID Bukti Hash: {a.id}
                        </p>
                      </div>
                    ))}
                    {!detail.approvals.length ? (
                      <p className="text-xs text-[#71717a]">
                        Belum ada persetujuan. Bukti hanya dibuat oleh klien dengan
                        memasukkan ulang PIN.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </BentoCard>
            </div>
          ) : (
            <BentoCard>
              <EmptyState
                icon="touch_app"
                title="Pilih proyek klien"
                description="Pilih salah satu proyek dari daftar di sebelah kiri untuk melihat detail, checklist tahapan, atau mencatat pembayaran termin."
              />
            </BentoCard>
          )}
        </div>
      </div>
    </AdminFrame>
  );
}
