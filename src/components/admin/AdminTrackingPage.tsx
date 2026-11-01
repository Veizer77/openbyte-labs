"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "./AdminShell";
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
import {
  Panel,
  Field,
  Notice,
  RichTextContent,
  inputClass,
  buttonClass,
  secondaryClass,
  dateTime,
  money,
} from "@/components/tracking/ui";

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
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama proyek">
          <input
            name="projectTitle"
            className={inputClass}
            required
            maxLength={200}
            defaultValue={project?.projectTitle}
          />
        </Field>
        <Field label="Nama klien">
          <input
            name="clientName"
            className={inputClass}
            required
            maxLength={200}
            defaultValue={project?.clientName}
          />
        </Field>
        <Field label="WhatsApp klien">
          <input
            name="clientWhatsapp"
            className={inputClass}
            required
            defaultValue={project?.clientWhatsapp}
          />
        </Field>
        <Field label="Email (opsional)">
          <input
            name="clientEmail"
            type="email"
            className={inputClass}
            defaultValue={project?.clientEmail ?? ""}
          />
        </Field>
        <Field label="Kategori">
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
        </Field>
        <Field label="Paket (kuota disalin saat pembuatan)">
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
        </Field>
        <Field label="Total biaya (Rp)">
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
        </Field>
        <Field label="Kuota revisi (proyek custom)">
          <input
            name="revisionsIncluded"
            type="number"
            min={0}
            max={32767}
            className={inputClass}
            required
            defaultValue={project?.revisionsIncluded ?? 2}
          />
        </Field>
        <Field label="Biaya revisi tambahan (Rp, opsional)">
          <input
            name="extraRevisionPrice"
            type="number"
            min={0}
            max={2147483647}
            className={inputClass}
            defaultValue={project?.extraRevisionPrice ?? ""}
          />
        </Field>
        <Field label="Tanggal mulai">
          <input
            name="startDate"
            type="date"
            className={inputClass}
            defaultValue={project?.startDate ?? ""}
          />
        </Field>
        <Field label="Target selesai">
          <input
            name="targetCompletionDate"
            type="date"
            className={inputClass}
            defaultValue={project?.targetCompletionDate ?? ""}
          />
        </Field>
        <Field label="URL staging">
          <input
            name="stagingUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.stagingUrl ?? ""}
          />
        </Field>
        <Field label="URL produksi">
          <input
            name="productionUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.productionUrl ?? ""}
          />
        </Field>
        <Field label="URL GitHub">
          <input
            name="githubUrl"
            type="url"
            className={inputClass}
            defaultValue={project?.githubUrl ?? ""}
          />
        </Field>
      </div>
      <fieldset className="rounded-xl border border-[#e4e4e7] p-4">
        <legend className="px-1 text-sm font-semibold">
          Tampilkan ke klien
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(visibilityLabels).map(([key, label]) => (
            <label
              key={key}
              className="flex min-h-11 items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                name={`visibility-${key}`}
                defaultChecked={
                  project?.clientVisibility[key as keyof typeof closed] ?? false
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Catatan internal (tidak tampil ke klien)">
        <textarea
          name="internalNotes"
          className={inputClass}
          rows={3}
          maxLength={20000}
          defaultValue={project?.internalNotes ?? ""}
        />
      </Field>
      <button className={buttonClass} disabled={busy}>
        {project ? "Simpan Proyek" : "Buat Proyek & PIN"}
      </button>
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
    <div className="space-y-4">
      {data.steps.map((step) => (
        <details
          key={`${step.id}:${String(step.updatedAt)}`}
          className="rounded-xl border border-[#e4e4e7] p-4"
        >
          <summary className="cursor-pointer text-sm font-semibold">
            {step.stepNumber}. {step.title} ({step.status})
          </summary>
          <form
            className="mt-5 space-y-4"
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
            <Field label="Judul tahap">
              <input
                className={inputClass}
                name="title"
                defaultValue={step.title}
                maxLength={200}
                required
              />
            </Field>
            <Field label="Keterangan">
              <textarea
                className={inputClass}
                name="description"
                defaultValue={step.description}
                maxLength={2000}
                rows={3}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                name="status"
                defaultValue={step.status}
              >
                <option value="pending">Belum dimulai</option>
                <option value="in_progress">Dikerjakan</option>
                <option value="done">Selesai</option>
              </select>
            </Field>
            <Field label="Milestone, satu per baris. Awali [x] untuk selesai.">
              <textarea
                className={inputClass}
                name="milestones"
                rows={5}
                defaultValue={data.milestones
                  .filter((m) => m.projectStepId === step.id)
                  .map((m) => `${m.isCompleted ? "[x]" : "[ ]"} ${m.title}`)
                  .join("\n")}
              />
            </Field>
            <button className={buttonClass} disabled={busy}>
              Simpan Tahap {step.stepNumber}
            </button>
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
    <div className="space-y-6">
      <dl className="flex flex-wrap gap-6 text-sm">
        <div>
          <dt>Total</dt>
          <dd className="font-semibold">{money(data.project.totalCost)}</dd>
        </div>
        <div>
          <dt>Terbayar</dt>
          <dd className="font-semibold">{money(data.project.paidAmount)}</dd>
        </div>
        <div>
          <dt>Sisa</dt>
          <dd className="font-semibold">{money(data.project.balance)}</dd>
        </div>
      </dl>
      <form
        key={editing ?? "new"}
        className="max-w-2xl space-y-4"
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
        <h3 className="font-semibold">
          {editing ? "Ubah pembayaran" : "Catat pembayaran"}
        </h3>
        <Field label="Jumlah (Rp)">
          <input
            className={inputClass}
            name="amount"
            type="number"
            min={1}
            max={2147483647}
            defaultValue={row?.amount}
            required
          />
        </Field>
        <Field label="Tanggal dan jam pembayaran (waktu perangkat)">
          <input
            className={inputClass}
            name="paidAt"
            type="datetime-local"
            required
            defaultValue={
              row
                ? new Date(
                    new Date(row.paidAt).getTime() -
                      new Date(row.paidAt).getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
          />
        </Field>
        <Field label="Metode">
          <select
            name="method"
            className={inputClass}
            defaultValue={row?.method ?? "transfer"}
          >
            <option value="transfer">Transfer</option>
            <option value="tunai">Tunai</option>
            <option value="qris">QRIS</option>
          </select>
        </Field>
        <Field label="Catatan">
          <textarea
            className={inputClass}
            name="note"
            rows={2}
            maxLength={2000}
            defaultValue={row?.note}
          />
        </Field>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={row?.isVisibleToClient ?? true}
          />
          Tampilkan pembayaran ke klien
        </label>
        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
          max={1}
        />
        <button className={buttonClass} disabled={busy}>
          Simpan Pembayaran
        </button>
        {editing ? (
          <button
            type="button"
            className={`${secondaryClass} ml-2`}
            onClick={() => {
              setEditing(null);
              setFiles([]);
            }}
          >
            Batal Ubah
          </button>
        ) : null}
      </form>
      {data.payments.length ? (
        <ul className="space-y-3">
          {data.payments.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4e4e7] p-3 text-sm"
            >
              <div>
                <strong>{money(p.amount)}</strong> · {p.method}
                <p className="mt-1 text-xs text-[#71717a]">
                  {dateTime(p.paidAt)} ·{" "}
                  {p.isVisibleToClient ? "Tampil ke klien" : "Internal"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className={secondaryClass}
                  onClick={() => {
                    setEditing(p.id);
                    setFiles([]);
                  }}
                >
                  Ubah
                </button>
                {p.proofFileId ? (
                  <DownloadFile
                    fileId={p.proofFileId}
                    label="Bukti"
                    adminProjectId={data.project.id}
                  />
                ) : null}
                <button
                  className={secondaryClass}
                  disabled={busy}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Hapus pembayaran ini dan hitung ulang saldo?",
                      )
                    )
                      void mutate({ kind: "deletePayment", id: p.id });
                  }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#71717a]">Belum ada pembayaran.</p>
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
    <div className="space-y-6">
      <form
        className="max-w-2xl space-y-4"
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
        <Field label="Judul dokumen">
          <input name="title" className={inputClass} required maxLength={200} />
        </Field>
        <Field label="URL HTTPS (kosongkan jika mengunggah berkas)">
          <input type="url" name="url" className={inputClass} />
        </Field>
        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
          max={1}
        />
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="visible" defaultChecked />
          Tampilkan dokumen ke klien
        </label>
        <button className={buttonClass} disabled={busy}>
          Tambahkan Dokumen
        </button>
      </form>
      <ul className="space-y-3">
        {data.documents.map((d) => (
          <li
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4e4e7] p-3 text-sm"
          >
            <span>
              {d.title} · {d.isVisibleToClient ? "Tampil" : "Internal"}
            </span>
            <div className="flex gap-2">
              {d.fileId ? (
                <DownloadFile
                  fileId={d.fileId}
                  label="Unduh"
                  adminProjectId={data.project.id}
                />
              ) : (
                <a
                  href={d.url!}
                  className={secondaryClass}
                  rel="noreferrer"
                  target="_blank"
                >
                  Buka
                </a>
              )}
              <button
                className={secondaryClass}
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Hapus dokumen dari proyek?"))
                    void mutate({ kind: "deleteDocument", id: d.id });
                }}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!data.documents.length ? (
        <p className="text-sm text-[#71717a]">Belum ada dokumen.</p>
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
    <div className="space-y-5">
      {data.revisions.map((r) => (
        <article
          key={`${r.id}:${String(r.updatedAt)}`}
          className="rounded-xl border border-[#e4e4e7] p-4"
        >
          <p className="text-xs text-[#71717a]">
            #{r.roundNumber} · {r.type} · {r.status}
          </p>
          <h3 className="my-3 font-semibold">{r.title}</h3>
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {r.description}
          </p>
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
          {r.quotedPrice !== null ? (
            <p className="my-3 text-sm">
              Penawaran: {money(r.quotedPrice)} ·{" "}
              {r.clientAcceptedQuoteAt ? "Disetujui klien" : "Belum disetujui"}
            </p>
          ) : null}
          {!["done", "rejected"].includes(r.status) ? (
            <form
              className="mt-5 space-y-3"
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
              <Field label="Aksi revisi">
                <select className={inputClass} name="event">
                  {r.status === "submitted" || r.status === "needs_payment" ? (
                    <>
                      <option value="ACCEPT">Terima pengajuan</option>
                      {r.status === "needs_payment" ? (
                        <option value="SET_QUOTE">
                          Tetapkan / ubah penawaran biaya
                        </option>
                      ) : null}
                      <option value="REJECT">Tolak (tanggapan wajib)</option>
                    </>
                  ) : null}
                  {r.status === "accepted" ? (
                    <option value="START">Mulai pengerjaan</option>
                  ) : null}
                  {r.status === "in_progress" ? (
                    <option value="DONE">Tandai selesai</option>
                  ) : null}
                </select>
              </Field>
              {r.status === "needs_payment" ? (
                <Field label="Biaya penawaran (Rp)">
                  <input
                    type="number"
                    className={inputClass}
                    name="quotedPrice"
                    min={0}
                    max={2147483647}
                    defaultValue={r.quotedPrice ?? ""}
                  />
                </Field>
              ) : null}
              <Field label="Tanggapan admin">
                <textarea
                  className={inputClass}
                  name="response"
                  rows={2}
                  maxLength={2000}
                  defaultValue={r.adminResponse ?? ""}
                />
              </Field>
              <button className={buttonClass} disabled={busy}>
                Proses Revisi #{r.roundNumber}
              </button>
            </form>
          ) : (
            <p className="mt-3 text-sm">{r.adminResponse}</p>
          )}
        </article>
      ))}
      {!data.revisions.length ? (
        <p className="text-sm text-[#71717a]">
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
    <div className="space-y-5">
      <form
        className="max-w-2xl space-y-4"
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
        <Field label="Utasan">
          <select className={inputClass} name="revisionRequestId">
            <option value="">Diskusi umum</option>
            {data.revisions.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.roundNumber}: {r.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tanggapan atau catatan">
          <textarea
            className={inputClass}
            name="body"
            required
            maxLength={10000}
            rows={4}
          />
        </Field>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="internal" />
          Catatan internal (jangan tampilkan ke klien)
        </label>
        <TrackingAttachments
          value={files}
          onChange={setFiles}
          adminProjectId={data.project.id}
        />
        <button className={buttonClass} disabled={busy}>
          Kirim Tanggapan
        </button>
      </form>
      {data.comments.map((c) => (
        <article
          key={c.id}
          className={`rounded-xl border p-4 ${c.isInternal ? "border-amber-200 bg-amber-50" : "border-[#e4e4e7]"}`}
        >
          <p className="text-sm font-semibold">
            {c.authorName} {c.isInternal ? "(Internal)" : ""}
          </p>
          <p className="my-2 text-xs text-[#71717a]">{dateTime(c.createdAt)}</p>
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {c.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.attachments.map((a) => (
              <DownloadFile
                key={a.fileId}
                fileId={a.fileId}
                label={a.filename}
                adminProjectId={data.project.id}
              />
            ))}
          </div>
        </article>
      ))}
      {!data.comments.length ? (
        <p className="text-sm text-[#71717a]">Belum ada diskusi.</p>
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
    <div
      className="screen admin-screen relative min-h-screen w-full bg-[#f9f9f9] text-[#18181a]"
      data-screen="admin/client-projects"
    >
      <AdminSidebar />
      <div className="min-h-screen lg:pl-[288px]">
        <AdminHeader />
        <main
          id="konten"
          className="mx-auto flex max-w-[1920px] flex-col gap-6 px-4 pb-12 pt-24 sm:px-6 lg:px-8"
        >
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs text-[#71717a]">
                ADMIN / OPERASIONAL KLIEN
              </p>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Proyek Klien & Tracking
              </h1>
              <p className="mt-2 text-sm text-[#52525b]">
                Kelola proyek, akses PIN, progres, pembayaran, dan komunikasi
                klien dari database.
              </p>
            </div>
            <button
              className={buttonClass}
              disabled={busy || loading}
              onClick={() => {
                setCreating(true);
                setDetail(null);
                setError("");
                setTab("project");
              }}
            >
              Buat Proyek Klien
            </button>
          </header>
          <Notice error={error} status={status} />
          {credentials ? (
            <section
              className="rounded-xl border border-[#c5ce78] bg-[#f6f8e7] p-5"
              aria-label="Kredensial baru"
            >
              <h2 className="font-semibold">
                Simpan PIN ini sekarang, hanya ditampilkan sekali
              </h2>
              <p className="mt-2 text-sm">
                Kode: <strong>{credentials.code}</strong>
              </p>
              <p className="mt-2 text-sm">
                PIN:{" "}
                <strong className="font-mono text-lg tracking-[.3em]">
                  {credentials.pin}
                </strong>
              </p>
              <p className="my-3 text-xs">
                Kirim kode dan PIN secara terpisah melalui kanal pribadi. PIN
                tidak dapat dibaca kembali dari database.
              </p>
              <button
                className={secondaryClass}
                onClick={() => setCredentials(null)}
              >
                Saya sudah menyimpan PIN
              </button>
            </section>
          ) : null}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e4e4e7] bg-white p-5">
            <div>
              <h2 className="text-sm font-semibold">
                Portal klien: {enabled ? "Aktif" : "Nonaktif"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#71717a]">
                Aktifkan setelah data proyek siap. Menonaktifkan portal
                memblokir semua akses klien.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/tracking" className={secondaryClass}>
                Buka Portal
              </Link>
              <button
                className={buttonClass}
                disabled={busy || loading}
                onClick={async () => {
                  if (
                    !window.confirm(
                      enabled
                        ? "Nonaktifkan seluruh akses portal klien?"
                        : "Aktifkan portal dan menu Tracking Klien untuk pengunjung?",
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
                    setStatus("Pengaturan portal sudah disimpan.");
                  } catch {
                    setError("Pengaturan belum dapat disimpan.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {enabled ? "Nonaktifkan Portal" : "Aktifkan Portal"}
              </button>
            </div>
          </section>
          {loading ? <p role="status">Memuat proyek klien…</p> : null}
          <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <section aria-label="Daftar proyek klien" className="space-y-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">200 proyek terbaru</h2>
                <button
                  className="min-h-11 px-2 text-xs underline"
                  onClick={() => {
                    setError("");
                    void load();
                  }}
                  disabled={busy}
                >
                  Muat ulang
                </button>
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  className={`w-full rounded-xl border p-4 text-left ${detail?.project.id === p.id ? "border-[#c5ce78] bg-[#f6f8e7]" : "border-[#e4e4e7] bg-white"}`}
                  disabled={busy}
                  onClick={() => {
                    setTab("project");
                    void select(p.id);
                  }}
                >
                  <strong className="block break-words text-sm">
                    {p.projectTitle}
                  </strong>
                  <span className="mt-2 block text-xs text-[#52525b]">
                    {p.clientName} · Tahap {p.currentStep}
                  </span>
                  <span className="mt-1 block text-xs text-[#71717a]">
                    {p.trackingCode}
                    {p.archivedAt ? " · Diarsipkan" : ""}
                  </span>
                </button>
              ))}
              {!projects.length && !loading ? (
                <p className="text-sm text-[#71717a]">
                  Belum ada proyek. Buat proyek klien pertama untuk menerbitkan
                  kode dan PIN.
                </p>
              ) : null}
            </section>
            <div className="min-w-0 space-y-5">
              {creating ? (
                <Panel title="Proyek Klien Baru">
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
                        setError(
                          "Koneksi terputus. Muat ulang daftar sebelum mencoba membuat proyek lagi.",
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  />
                </Panel>
              ) : null}
              {detail ? (
                <>
                  <section className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {detail.project.projectTitle}
                      </h2>
                      <p className="mt-1 text-xs text-[#71717a]">
                        {detail.project.trackingCode}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        className={secondaryClass}
                        href={`https://wa.me/${detail.project.clientWhatsapp}?text=${encodeURIComponent(`Halo ${detail.project.clientName}, pantau proyek "${detail.project.projectTitle}" di ${typeof window !== "undefined" ? window.location.origin : ""}/tracking\nKode Tracking: ${detail.project.trackingCode}\nPIN dikirim terpisah.`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Kirim Link via WhatsApp
                      </a>
                      <button
                        className={secondaryClass}
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Buat PIN baru? Semua sesi klien yang lama langsung tidak berlaku.",
                            )
                          )
                            void mutate({ kind: "pin" });
                        }}
                      >
                        Regenerasi PIN
                      </button>
                      <button
                        className={secondaryClass}
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm(
                              detail.project.archivedAt
                                ? "Pulihkan akses proyek ini?"
                                : "Arsipkan proyek dan tutup akses klien?",
                            )
                          )
                            void mutate({
                              kind: "archive",
                              archived: !detail.project.archivedAt,
                            });
                        }}
                      >
                        {detail.project.archivedAt ? "Pulihkan" : "Arsipkan"}
                      </button>
                      <button
                        className={secondaryClass}
                        disabled={busy || detail.project.currentStep !== 6}
                        title={detail.project.currentStep !== 6 ? "Selesaikan seluruh tahap terlebih dahulu" : undefined}
                        onClick={async () => {
                          if (!window.confirm("Buat draft portofolio tanpa nama atau data identitas klien? Draft tetap perlu dilengkapi gambar dan konten sebelum diterbitkan.")) return;
                          setBusy(true);
                          setError("");
                          setStatus("");
                          try {
                            const result = await convertClientProjectToPortfolioAction(detail.project.id);
                            if (!result.ok) setError(result.message);
                            else setStatus(result.data.alreadyLinked ? "Proyek ini sudah terhubung ke draft portofolio." : `Draft portofolio /${result.data.slug} dibuat tanpa data identitas klien. Lengkapi dari Showcase sebelum diterbitkan.`);
                          } catch {
                            setError("Draft portofolio tidak dapat dibuat.");
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Buat draft portofolio
                      </button>
                      <Link href="/admin/showcase" className={secondaryClass}>
                        Buka Showcase
                      </Link>
                    </div>
                  </section>
                  <nav
                    className="flex gap-1 overflow-x-auto rounded-xl bg-[#ededee] p-1"
                    aria-label="Pengelolaan proyek"
                  >
                    {[
                      ["project", "Proyek"],
                      ["steps", "Tahap & Milestone"],
                      ["payments", "Pembayaran"],
                      ["revisions", "Revisi"],
                      ["discussion", "Diskusi"],
                      ["documents", "Dokumen"],
                      ["updates", "Timeline"],
                      ["approvals", "Persetujuan"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        className={`min-h-11 shrink-0 rounded-lg px-3 text-xs ${tab === key ? "bg-[#18181a] text-white" : "text-[#52525b]"}`}
                        aria-pressed={tab === key}
                        onClick={() => setTab(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </nav>
                  <Panel
                    title={
                      {
                        project: "Rincian Proyek",
                        steps: "Progres Produksi",
                        payments: "Pembayaran",
                        revisions: "Review & Revisi",
                        discussion: "Diskusi & Catatan Internal",
                        documents: "Dokumen Proyek",
                        updates: "Timeline Proyek",
                        approvals: "Bukti Persetujuan Klien",
                      }[tab] ?? "Proyek"
                    }
                  >
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
                      <div className="space-y-5">
                        <p className="text-sm">
                          Revisi terpakai: {detail.project.revisionsUsed} /{" "}
                          {detail.project.revisionsIncluded}
                        </p>
                        <button
                          className={buttonClass}
                          disabled={busy}
                          onClick={() => {
                            if (
                              window.confirm(
                                detail.project.isReviewOpen
                                  ? "Tutup review klien?"
                                  : "Buka periode review dan tahap 5 untuk klien?",
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
                        </button>
                        <Revisions data={detail} mutate={mutate} busy={busy} />
                      </div>
                    ) : null}
                    {tab === "updates" ? (
                      <div className="space-y-6">
                        <form
                          className="space-y-4"
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
                          <Field label="Judul pembaruan">
                            <input
                              className={inputClass}
                              name="title"
                              required
                              maxLength={200}
                            />
                          </Field>
                          <Field label="Isi pembaruan">
                            <textarea
                              className={inputClass}
                              name="body"
                              rows={4}
                              required
                              maxLength={10000}
                            />
                          </Field>
                          <label className="flex min-h-11 items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="visible"
                              defaultChecked
                            />
                            Tampilkan ke klien
                          </label>
                          <button className={buttonClass} disabled={busy}>
                            Terbitkan Pembaruan
                          </button>
                        </form>
                        {detail.updates.map((u) => (
                          <article
                            key={u.id}
                            className="border-t border-[#e4e4e7] pt-4"
                          >
                            <h3 className="font-semibold">{u.title}</h3>
                            <p className="my-2 text-xs text-[#71717a]">
                              {dateTime(u.createdAt)} ·{" "}
                              {u.isVisibleToClient
                                ? "Tampil ke klien"
                                : "Internal"}
                            </p>
                            <RichTextContent value={u.body} />
                          </article>
                        ))}
                      </div>
                    ) : null}
                    {tab === "approvals" ? (
                      <div className="space-y-4">
                        {detail.approvals.map((a) => (
                          <article
                            key={a.id}
                            className="rounded-xl border border-[#e4e4e7] p-4"
                          >
                            <h3 className="text-sm font-semibold">
                              {a.type === "step_review"
                                ? "Persetujuan hasil review"
                                : "Serah terima akhir"}
                            </h3>
                            <p className="my-2 text-sm">
                              {a.approvedByName} · {dateTime(a.approvedAt)}
                            </p>
                            <p className="whitespace-pre-wrap text-sm">
                              {a.note}
                            </p>
                            <p className="mt-3 break-all text-xs text-[#71717a]">
                              ID bukti: {a.id}
                            </p>
                          </article>
                        ))}
                        {!detail.approvals.length ? (
                          <p className="text-sm text-[#71717a]">
                            Belum ada persetujuan. Bukti hanya dibuat oleh klien
                            dengan memasukkan ulang PIN dan tidak dapat diedit.
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </Panel>
                </>
              ) : !creating ? (
                <Panel title="Pilih Proyek">
                  <p className="text-sm text-[#71717a]">
                    Pilih proyek dari daftar untuk mengelola akses dan data
                    klien.
                  </p>
                </Panel>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
