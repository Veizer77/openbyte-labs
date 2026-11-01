"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClientPortal } from "@/lib/tracking/dto";
import {
  trackingMutationAction,
  trackingLogoutAction,
} from "@/actions/tracking";
import {
  TrackingAttachments,
  DownloadFile,
  type Attachment,
} from "./TrackingFiles";
import {
  Panel,
  Field,
  Notice,
  RichTextContent,
  buttonClass,
  secondaryClass,
  inputClass,
  money,
  dateTime,
} from "./ui";

const revisionLabels: Record<string, string> = {
  submitted: "Diajukan",
  needs_payment: "Menunggu persetujuan biaya",
  accepted: "Diterima",
  in_progress: "Dikerjakan",
  done: "Selesai",
  rejected: "Ditolak",
};
const stepLabels = {
  pending: "Belum dimulai",
  in_progress: "Dikerjakan",
  done: "Selesai",
};
const typeLabels = {
  revision: "Revisi",
  change_request: "Fitur / perubahan baru",
  bug: "Laporan bug",
};

export function TrackingPortal({ data }: { data: ClientPortal }) {
  const router = useRouter();
  const p = data.project;
  const [tab, setTab] = useState("overview");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [revisionFiles, setRevisionFiles] = useState<Attachment[]>([]);
  const [commentFiles, setCommentFiles] = useState<Attachment[]>([]);
  const [approving, setApproving] = useState(false);
  const done = data.steps.filter((s) => s.status === "done").length;
  const progress = data.steps.length
    ? Math.round((done / data.steps.length) * 100)
    : 0;
  async function run(input: unknown) {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await trackingMutationAction(input);
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      setStatus("Perubahan sudah tersimpan.");
      router.refresh();
      return true;
    } catch {
      setError(
        "Koneksi terputus. Periksa data terbaru sebelum mencoba kembali.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="min-h-screen bg-[#f9f9f9] text-[#18181a]"
      data-screen="tracking/portal"
    >
      <header className="border-b border-[#e4e4e7] bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold">
            OpenByte Labs{" "}
            <span className="font-normal text-[#71717a]">/ Portal Klien</span>
          </Link>
          <button
            className={secondaryClass}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await trackingLogoutAction();
                router.replace("/tracking");
                router.refresh();
              } catch {
                setError("Belum berhasil keluar. Coba kembali.");
                setBusy(false);
              }
            }}
          >
            Keluar Sesi
          </button>
        </div>
      </header>
      <main
        id="konten"
        className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8"
      >
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6">
          <div className="min-w-0">
            <p className="mb-2 text-xs text-[#52525b]">{p.trackingCode}</p>
            <h1 className="break-words text-2xl font-semibold sm:text-3xl">
              {p.projectTitle}
            </h1>
            <p className="mt-2 text-sm text-[#52525b]">Klien: {p.clientName}</p>
          </div>
          <dl className="grid grid-cols-2 gap-5 text-xs">
            <div>
              <dt className="text-[#71717a]">Mulai</dt>
              <dd className="mt-1 font-medium">
                {p.startDate ?? "Belum ditentukan"}
              </dd>
            </div>
            <div>
              <dt className="text-[#71717a]">Target selesai</dt>
              <dd className="mt-1 font-medium">
                {p.targetCompletionDate ?? "Belum ditentukan"}
              </dd>
            </div>
          </dl>
        </section>
        <Notice error={error} status={status} />
        <nav
          aria-label="Bagian portal"
          className="flex gap-1 overflow-x-auto rounded-xl bg-[#ededee] p-1"
        >
          {[
            ["overview", "Progres & Pembayaran"],
            ["revisions", "Review & Revisi"],
            ["comments", "Diskusi Proyek"],
            ["documents", "Dokumen & Timeline"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`min-h-11 shrink-0 rounded-lg px-4 text-sm ${tab === key ? "bg-[#18181a] font-semibold text-white" : "text-[#52525b]"}`}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        {tab === "overview" ? (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel title="Alur Progres 6 Tahap Produksi">
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Progres keseluruhan</span>
                  <strong>{progress}%</strong>
                </div>
                <progress
                  value={progress}
                  max={100}
                  className="h-2 w-full accent-[#82b440]"
                  aria-label="Progres keseluruhan"
                />
              </div>
              {data.steps.length ? (
                <ol className="space-y-3">
                  {data.steps.map((step) => (
                    <li key={step.id}>
                      <details
                        open={step.stepNumber === p.currentStep}
                        className="rounded-xl border border-[#e4e4e7] p-4"
                      >
                        <summary className="cursor-pointer text-sm font-semibold">
                          <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#e2e89d]">
                            {step.stepNumber}
                          </span>
                          {step.title}
                          <span className="mt-2 block pl-10 text-xs font-normal text-[#71717a]">
                            {stepLabels[step.status]}
                          </span>
                        </summary>
                        {step.description ? (
                          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#52525b]">
                            {step.description}
                          </p>
                        ) : null}
                        {step.milestones.length ? (
                          <ul className="mt-4 space-y-2">
                            {step.milestones.map((m) => (
                              <li key={m.id} className="flex gap-2 text-sm">
                                <span
                                  aria-label={
                                    m.isCompleted ? "Selesai" : "Belum selesai"
                                  }
                                >
                                  {m.isCompleted ? "✓" : "○"}
                                </span>
                                <span>{m.title}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-4 text-xs text-[#71717a]">
                            Belum ada milestone untuk tahap ini.
                          </p>
                        )}
                      </details>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-[#71717a]">
                  Tahapan proyek belum diatur admin.
                </p>
              )}
            </Panel>
            <div className="space-y-6">
              {data.payment ? (
                <Panel title="Ringkasan Pembayaran">
                  <dl className="space-y-3 text-sm">
                    {[
                      ["Total biaya", money(data.payment.totalCost)],
                      ["Terbayar", money(data.payment.paidAmount)],
                      ["Sisa pembayaran", money(data.payment.balance)],
                      [
                        "Status",
                        {
                          unpaid: "Belum dibayar",
                          down_payment: "Pembayaran sebagian",
                          paid_off: "Lunas",
                        }[data.payment.status],
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-3">
                        <dt className="text-[#52525b]">{label}</dt>
                        <dd className="font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="mb-3 mt-6 text-sm font-semibold">
                    Riwayat pembayaran
                  </h3>
                  {data.payment.history.length ? (
                    <ul className="space-y-4">
                      {data.payment.history.map((payment) => (
                        <li
                          key={payment.id}
                          className="border-t border-[#ededee] pt-3 text-sm"
                        >
                          <div className="flex justify-between gap-2">
                            <strong>{money(payment.amount)}</strong>
                            <span>{payment.method}</span>
                          </div>
                          <p className="mt-1 text-xs text-[#71717a]">
                            {dateTime(payment.paidAt)}
                          </p>
                          {payment.note ? (
                            <p className="mt-2 whitespace-pre-wrap text-[#52525b]">
                              {payment.note}
                            </p>
                          ) : null}
                          {payment.proofFileId ? (
                            <div className="mt-2">
                              <DownloadFile
                                fileId={payment.proofFileId}
                                label="Unduh bukti pembayaran"
                              />
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#71717a]">
                      Belum ada pembayaran yang ditampilkan.
                    </p>
                  )}
                </Panel>
              ) : null}
              <Panel title="Akses Proyek">
                <div className="flex flex-col gap-3">
                  {[
                    ["Lihat staging", p.stagingUrl],
                    ["Buka aplikasi produksi", p.productionUrl],
                    ["Repositori GitHub", p.githubUrl],
                  ]
                    .filter(([, url]) => url)
                    .map(([label, url]) => (
                      <a
                        key={label}
                        href={url!}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryClass}
                      >
                        {label}
                      </a>
                    ))}
                  {!p.stagingUrl && !p.productionUrl && !p.githubUrl ? (
                    <p className="text-sm text-[#71717a]">
                      Tautan proyek belum dibagikan admin.
                    </p>
                  ) : null}
                </div>
              </Panel>
            </div>
          </div>
        ) : null}
        {tab === "revisions" ? (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Panel title="Review & Revisi">
                <p className="mb-3 text-sm">
                  Revisi terpakai{" "}
                  <strong>
                    {p.revisionsUsed} dari {p.revisionsIncluded}
                  </strong>
                  .
                </p>
                <p className="mb-5 rounded-xl bg-[#f4f4f5] p-3 text-sm text-[#52525b]">
                  {p.isReviewOpen
                    ? "Review sedang dibuka. Ajukan perubahan atau setujui hasil setelah diperiksa."
                    : "Review belum dibuka atau sudah ditutup. Laporan bug dapat diajukan selama masa garansi."}
                </p>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const f = new FormData(form);
                    if (
                      await run({
                        kind: "revision",
                        type: f.get("type"),
                        title: f.get("title"),
                        description: f.get("description"),
                        fileIds: revisionFiles.map((v) => v.fileId),
                      })
                    ) {
                      form.reset();
                      setRevisionFiles([]);
                    }
                  }}
                >
                  <Field label="Jenis pengajuan">
                    <select className={inputClass} name="type">
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Judul revisi">
                    <input
                      className={inputClass}
                      name="title"
                      required
                      maxLength={200}
                    />
                  </Field>
                  <Field label="Rincian perubahan">
                    <textarea
                      className={inputClass}
                      name="description"
                      required
                      maxLength={10000}
                      rows={5}
                    />
                  </Field>
                  <TrackingAttachments
                    value={revisionFiles}
                    onChange={setRevisionFiles}
                    onBusyChange={setUploading}
                  />
                  <button className={buttonClass} disabled={busy || uploading}>
                    Kirim Pengajuan
                  </button>
                </form>
              </Panel>
              <Panel title="Persetujuan Hasil">
                <button
                  className={secondaryClass}
                  onClick={() => setApproving(!approving)}
                  aria-expanded={approving}
                >
                  {approving
                    ? "Tutup formulir persetujuan"
                    : "Setujui Hasil Pekerjaan"}
                </button>
                {approving ? (
                  <form
                    className="mt-5 space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const f = new FormData(form);
                      const input = {
                        kind: "approve",
                        type: f.get("type"),
                        name: f.get("name"),
                        pin: f.get("pin"),
                        note: f.get("note"),
                      };
                      (
                        form.elements.namedItem("pin") as HTMLInputElement
                      ).value = "";
                      if (await run(input)) {
                        form.reset();
                        setApproving(false);
                      }
                    }}
                  >
                    <Field label="Jenis persetujuan">
                      <select className={inputClass} name="type">
                        <option value="step_review">
                          Hasil review tahap 5
                        </option>
                        <option value="final_handover">
                          Serah terima akhir
                        </option>
                      </select>
                    </Field>
                    <Field label="Nama pemberi persetujuan">
                      <input
                        className={inputClass}
                        name="name"
                        defaultValue={p.clientName}
                        required
                        maxLength={200}
                      />
                    </Field>
                    <Field label="Masukkan ulang PIN">
                      <input
                        className={inputClass}
                        name="pin"
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Catatan (opsional)">
                      <textarea
                        className={inputClass}
                        name="note"
                        maxLength={2000}
                        rows={3}
                      />
                    </Field>
                    <p className="text-xs leading-5 text-[#71717a]">
                      Persetujuan dicatat permanen. Serah terima akhir
                      membutuhkan tahap 1–5 selesai dan pembayaran lunas.
                    </p>
                    <button className={buttonClass} disabled={busy}>
                      Catat Persetujuan
                    </button>
                  </form>
                ) : null}
                {data.approvals.map((a) => (
                  <div
                    key={a.id}
                    className="mt-4 border-t border-[#e4e4e7] pt-3 text-sm"
                  >
                    <strong>
                      {a.type === "step_review"
                        ? "Hasil review disetujui"
                        : "Serah terima disetujui"}
                    </strong>
                    <p className="mt-1 text-xs text-[#71717a]">
                      {a.approvedByName} · {dateTime(a.approvedAt)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{a.note}</p>
                  </div>
                ))}
              </Panel>
              <Panel title="Kebijakan Revisi">
                <RichTextContent value={p.revisionPolicy} />
              </Panel>
            </div>
            <Panel title="Riwayat Pengajuan">
              {data.revisions.length ? (
                <div className="space-y-5">
                  {data.revisions.map((r) => (
                    <article
                      key={r.id}
                      className="rounded-xl border border-[#e4e4e7] p-4"
                    >
                      <p className="text-xs text-[#71717a]">
                        Putaran {r.roundNumber} · {typeLabels[r.type]} ·{" "}
                        {dateTime(r.submittedAt)}
                      </p>
                      <h3 className="mt-2 font-semibold">{r.title}</h3>
                      <p className="my-3 text-xs font-medium text-[#586016]">
                        {revisionLabels[r.status]}
                      </p>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {r.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.attachments.map((a) => (
                          <DownloadFile
                            key={a.fileId}
                            fileId={a.fileId}
                            label={a.filename}
                          />
                        ))}
                      </div>
                      {r.adminResponse ? (
                        <p className="mt-3 rounded-lg bg-[#f4f4f5] p-3 text-sm">
                          Tanggapan admin: {r.adminResponse}
                        </p>
                      ) : null}
                      {r.status === "needs_payment" &&
                      r.quotedPrice !== null ? (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm">
                            Biaya yang ditawarkan:{" "}
                            <strong>{money(r.quotedPrice)}</strong>
                          </p>
                          {r.clientAcceptedQuoteAt ? (
                            <p className="text-xs">
                              Biaya sudah disetujui, menunggu admin menerima
                              pengajuan.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                className={buttonClass}
                                disabled={busy}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Setujui biaya tambahan ${money(r.quotedPrice!)}?`,
                                    )
                                  )
                                    void run({
                                      kind: "quote",
                                      revisionId: r.id,
                                      accept: true,
                                    });
                                }}
                              >
                                Setujui Biaya
                              </button>
                              <button
                                className={secondaryClass}
                                disabled={busy}
                                onClick={() => {
                                  if (window.confirm("Tolak penawaran ini?"))
                                    void run({
                                      kind: "quote",
                                      revisionId: r.id,
                                      accept: false,
                                    });
                                }}
                              >
                                Tolak
                              </button>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#71717a]">
                  Belum ada pengajuan revisi.
                </p>
              )}
            </Panel>
          </div>
        ) : null}
        {tab === "comments" ? (
          <Panel title="Diskusi Proyek">
            <form
              className="mb-7 max-w-2xl space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const f = new FormData(form);
                if (
                  await run({
                    kind: "comment",
                    body: f.get("body"),
                    revisionRequestId: f.get("revisionRequestId") || null,
                    fileIds: commentFiles.map((v) => v.fileId),
                  })
                ) {
                  form.reset();
                  setCommentFiles([]);
                }
              }}
            >
              <Field label="Utasan diskusi">
                <select className={inputClass} name="revisionRequestId">
                  <option value="">Diskusi umum</option>
                  {data.revisions.map((r) => (
                    <option key={r.id} value={r.id}>
                      Revisi #{r.roundNumber}: {r.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Pesan untuk pengembang">
                <textarea
                  name="body"
                  className={inputClass}
                  rows={4}
                  required
                  maxLength={10000}
                />
              </Field>
              <TrackingAttachments
                value={commentFiles}
                onChange={setCommentFiles}
                onBusyChange={setUploading}
              />
              <button className={buttonClass} disabled={busy || uploading}>
                Kirim Komentar
              </button>
            </form>
            {data.comments.length ? (
              <div className="space-y-4">
                {data.comments.map((c) => (
                  <article
                    key={c.id}
                    className={`rounded-xl border p-4 ${c.authorType === "admin" ? "border-[#dce3a2] bg-[#fafbf3]" : "border-[#e4e4e7]"}`}
                  >
                    <p className="text-sm font-semibold">
                      {c.authorName}
                      <span className="ml-2 text-xs font-normal text-[#71717a]">
                        {dateTime(c.createdAt)}
                      </span>
                    </p>
                    {c.revisionRequestId ? (
                      <p className="mt-1 text-xs text-[#71717a]">
                        Revisi #
                        {
                          data.revisions.find(
                            (r) => r.id === c.revisionRequestId,
                          )?.roundNumber
                        }
                      </p>
                    ) : null}
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                      {c.body}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.attachments.map((a) => (
                        <DownloadFile
                          key={a.fileId}
                          fileId={a.fileId}
                          label={a.filename}
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#71717a]">
                Belum ada komentar. Mulai diskusi melalui formulir di atas.
              </p>
            )}
          </Panel>
        ) : null}
        {tab === "documents" ? (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Panel title="Dokumen Proyek">
              {data.documents.length ? (
                <ul className="space-y-4">
                  {data.documents.map((d) => (
                    <li key={d.id}>
                      {d.fileId ? (
                        <DownloadFile fileId={d.fileId} label={d.title} />
                      ) : (
                        <a
                          href={d.url!}
                          target="_blank"
                          rel="noreferrer"
                          className={secondaryClass}
                        >
                          {d.title}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#71717a]">
                  Belum ada dokumen yang dibagikan.
                </p>
              )}
            </Panel>
            <Panel title="Log Aktivitas Proyek">
              {data.updates.length ? (
                <ol className="space-y-6">
                  {data.updates.map((u) => (
                    <li key={u.id} className="border-l-2 border-[#e2e89d] pl-4">
                      <p className="text-xs text-[#71717a]">
                        {dateTime(u.createdAt)}
                      </p>
                      <h3 className="my-2 font-semibold">{u.title}</h3>
                      <RichTextContent value={u.body} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-[#71717a]">
                  Belum ada pembaruan yang dibagikan.
                </p>
              )}
            </Panel>
          </div>
        ) : null}
        <p className="text-xs text-[#71717a]">
          Data terakhir diperbarui: {dateTime(p.updatedAt)}.{" "}
          <button
            className="min-h-11 underline"
            onClick={() => router.refresh()}
          >
            Muat ulang data
          </button>
        </p>
      </main>
    </div>
  );
}
