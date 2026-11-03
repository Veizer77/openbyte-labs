"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  listInvoiceProjectsAction,
  listInvoicesAction,
  recordInvoicePaymentAction,
  saveInvoiceAction,
  type InvoiceListRecord,
} from "@/actions/admin/invoices";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, ToolbarButton } from "./AdminUi";

type ProjectOption = {
  id: string;
  projectTitle: string;
  clientName: string;
  totalCost: number;
};
type InvoiceForm = {
  clientProjectId: string;
  invoiceNumber: string;
  title: string;
  amount: string;
  dueAt: string;
  status: "draft" | "issued" | "void";
  note: string;
};
type PaymentForm = {
  amount: string;
  paidAt: string;
  method: "transfer" | "tunai" | "qris";
  note: string;
  isVisibleToClient: boolean;
};

const blankPayment = (): PaymentForm => ({
  amount: "",
  paidAt: new Date().toISOString().slice(0, 16),
  method: "transfer",
  note: "",
  isVisibleToClient: true,
});
const blankInvoice = (projectId = ""): InvoiceForm => ({
  clientProjectId: projectId,
  invoiceNumber: "",
  title: "",
  amount: "",
  dueAt: new Date().toISOString().slice(0, 10),
  status: "draft",
  note: "",
});

const money = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const localDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value}T12:00:00+07:00`));

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListRecord[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selected, setSelected] = useState<InvoiceListRecord | null>(null);
  const [form, setForm] = useState<InvoiceForm>(blankInvoice);
  const [payment, setPayment] = useState<PaymentForm>(blankPayment);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function load(): Promise<InvoiceListRecord[] | null> {
    setLoading(true);
    setError("");
    try {
      const [invoiceResult, projectResult] = await Promise.all([
        listInvoicesAction(),
        listInvoiceProjectsAction(),
      ]);
      if (!invoiceResult.ok) {
        setError(invoiceResult.message);
        return null;
      }
      if (!projectResult.ok) {
        setError(projectResult.message);
        return null;
      }
      setInvoices(invoiceResult.data);
      setProjects(projectResult.data);
      return invoiceResult.data;
    } catch {
      setError("Data invoice dan proyek tidak dapat dimuat.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void Promise.all([
      listInvoicesAction(),
      listInvoiceProjectsAction(),
    ])
      .then(([invoiceResult, projectResult]) => {
        if (!active) return;
        if (!invoiceResult.ok) setError(invoiceResult.message);
        else setInvoices(invoiceResult.data);
        if (!projectResult.ok) setError(projectResult.message);
        else {
          setProjects(projectResult.data);
          setForm(blankInvoice(projectResult.data[0]?.id ?? ""));
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Data invoice dan proyek tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  function newInvoice() {
    setSelected(null);
    setForm(blankInvoice(projects[0]?.id ?? ""));
    setError("");
    setStatus("");
  }

  function editInvoice(invoice: InvoiceListRecord) {
    setSelected(invoice);
    setForm({
      clientProjectId: invoice.clientProjectId,
      invoiceNumber: invoice.invoiceNumber,
      title: invoice.title,
      amount: String(invoice.amount),
      dueAt: invoice.dueAt,
      status: invoice.status,
      note: invoice.note,
    });
    setPayment(blankPayment());
    setError("");
    setStatus("");
  }

  async function saveInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const value = {
      clientProjectId: form.clientProjectId,
      invoiceNumber: form.invoiceNumber,
      title: form.title,
      amount: Number(form.amount),
      dueAt: form.dueAt,
      status: form.status,
      note: form.note,
    };
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await saveInvoiceAction({
        id: selected?.id ?? null,
        value,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus(
        "Invoice berhasil disimpan. Pembayaran tetap dihitung dari ledger proyek."
      );
      setSelected(null);
      await load();
    } catch {
      setError("Invoice tidak dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function recordPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || busy) return;
    const amount = Number(payment.amount);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      setError("Masukkan nominal pembayaran yang valid.");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await recordInvoicePaymentAction({
        invoiceId: selected.id,
        amount,
        paidAt: new Date(payment.paidAt).toISOString(),
        method: payment.method,
        note: payment.note,
        isVisibleToClient: payment.isVisibleToClient,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus(
        "Pembayaran dicatat di ledger proyek dan dialokasikan ke invoice ini."
      );
      setPayment(blankPayment());
      const refreshedInvoices = await load();
      const refreshed = refreshedInvoices?.find(
        (item) => item.id === selected.id
      );
      if (refreshed) editInvoice(refreshed);
    } catch {
      setError("Pembayaran tidak dapat dicatat.");
    } finally {
      setBusy(false);
    }
  }

  const selectedProject = projects.find(
    (item) => item.id === form.clientProjectId
  );

  return (
    <AdminFrame
      title="Invoice & Penagihan Termin"
      description="Kelola invoice manual dan alokasikan pembayaran klien ke ledger proyek secara sinkron."
      screenKey="cms/invoice-penagihan"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={loading || busy}
            onClick={() => void load()}
          >
            Refresh
          </ToolbarButton>
          <ToolbarButton variant="dark" icon="receipt_long" onClick={newInvoice}>
            Buat Invoice
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

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Invoice Aktif</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">
            {invoices.filter((inv) => inv.status !== "void").length}
          </div>
        </div>
        <div className="rounded-[14px] border border-[#ffedd5] bg-[#fff7ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#c2410c]">Menunggu Pembayaran</div>
          <div className="text-2xl font-semibold text-[#c2410c] mt-1">
            {
              invoices.filter(
                (inv) => inv.status === "issued" && inv.paidAmount < inv.amount
              ).length
            }
          </div>
        </div>
        <div className="rounded-[14px] border border-[#d6eed3] bg-[#eef8ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#457c1d]">Total Dialokasikan</div>
          <div className="text-2xl font-semibold text-[#457c1d] mt-1">
            {money(invoices.reduce((acc, inv) => acc + inv.paidAmount, 0))}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Left Side: Invoice List */}
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Daftar Invoice
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Total {invoices.length} tagihan termin tersimpan
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat invoice…</p>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon="receipt"
              title="Belum ada invoice"
              description="Buat invoice pertama untuk menagih termin proyek klien."
            />
          ) : (
            <div className="grid gap-2.5">
              {invoices.map((inv) => {
                const remaining = Math.max(0, inv.amount - inv.paidAmount);
                const isSelected = selected?.id === inv.id;
                const statusVariant =
                  inv.status === "issued"
                    ? remaining === 0
                      ? "success"
                      : "warning"
                    : inv.status === "void"
                    ? "danger"
                    : "neutral";

                return (
                  <div
                    key={inv.id}
                    className={`rounded-[12px] border p-3.5 transition-all ${
                      isSelected
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                            {inv.invoiceNumber} · {inv.title}
                          </h3>
                          <Chip variant={statusVariant} size="sm">
                            {inv.status}
                          </Chip>
                        </div>
                        <div className="mt-1 text-xs text-[#52525b]">
                          {inv.clientName} · {inv.projectTitle}
                        </div>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#71717a]">
                          <div>
                            <span className="block text-[#a1a1aa]">Tagihan:</span>
                            <span className="font-semibold text-[#18181a]">
                              {money(inv.amount)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[#a1a1aa]">Dibayar:</span>
                            <span className="font-semibold text-[#457c1d]">
                              {money(inv.paidAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[#a1a1aa]">Sisa:</span>
                            <span className="font-semibold text-[#c2410c]">
                              {money(remaining)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[#a1a1aa]">Jatuh Tempo:</span>
                            <span className="font-medium text-[#18181a]">
                              {localDate(inv.dueAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1.5 self-end sm:self-start">
                        <ToolbarButton
                          variant="light"
                          onClick={() => editInvoice(inv)}
                        >
                          Ubah
                        </ToolbarButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>

        {/* Right Side: Form & Payment Allocation */}
        <div className="grid gap-5">
          <BentoCard>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
              <div>
                <h2 className="m-0 text-base font-semibold text-[#18181a]">
                  {selected ? "Edit Invoice" : "Invoice Baru"}
                </h2>
                <p className="mt-0.5 text-xs text-[#71717a]">
                  Pilih proyek dan tentukan termin pembayaran
                </p>
              </div>
              {selected ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={newInvoice}
                  className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
                >
                  Batal Edit
                </button>
              ) : null}
            </div>

            {projects.length === 0 ? (
              <p className="rounded-[10px] bg-amber-50 p-3 text-xs text-amber-900">
                Buat proyek klien terlebih dahulu sebelum menerbitkan invoice.
              </p>
            ) : null}

            {selectedProject ? (
              <div className="mb-3.5 rounded-[10px] bg-[#f9f9f9] p-3 text-xs text-[#52525b]">
                Nilai proyek:{" "}
                <span className="font-semibold text-[#18181a]">
                  {money(selectedProject.totalCost)}
                </span>
                . Batas total invoice aktif mengikuti nilai proyek.
              </div>
            ) : null}

            <form onSubmit={saveInvoice} className="grid gap-3.5">
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Proyek Klien
                <select
                  required
                  value={form.clientProjectId}
                  onChange={(e) =>
                    setForm({ ...form, clientProjectId: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Pilih proyek…</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName} — {p.projectTitle}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nomor Invoice
                  <input
                    required
                    pattern="INV-[0-9]{4}-[A-Za-z0-9-]{3,32}"
                    placeholder="INV-2026-001"
                    value={form.invoiceNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        invoiceNumber: e.target.value.toUpperCase(),
                      })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as InvoiceForm["status"],
                      })
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="issued">Terbit</option>
                    {selected ? <option value="void">Batalkan</option> : null}
                  </select>
                </label>
              </div>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Nama Termin / Uraian
                <input
                  required
                  maxLength={250}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: DP 50% Pengembangan Awal"
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nominal (IDR)
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Jatuh Tempo
                  <input
                    type="date"
                    required
                    value={form.dueAt}
                    onChange={(e) =>
                      setForm({ ...form, dueAt: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Catatan Penagihan
                <textarea
                  rows={2}
                  maxLength={2000}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  placeholder="Informasi rekening atau instruksi pembayaran..."
                />
              </label>

              <div className="pt-2">
                <ToolbarButton
                  type="submit"
                  variant="dark"
                  disabled={busy || projects.length === 0}
                  className="w-full"
                >
                  {busy ? "Menyimpan…" : "Simpan Invoice"}
                </ToolbarButton>
              </div>
            </form>
          </BentoCard>

          {/* Payment Allocation Form for Issued Invoice */}
          {selected?.status === "issued" ? (
            <BentoCard>
              <h2 className="mb-1 mt-0 text-base font-semibold text-[#18181a]">
                Catat Pembayaran Termin
              </h2>
              <p className="mb-4 text-xs text-[#71717a]">
                Sisa invoice:{" "}
                <span className="font-semibold text-[#c2410c]">
                  {money(Math.max(0, selected.amount - selected.paidAmount))}
                </span>
                . Alokasi ini akan masuk ke ledger proyek dan mengupdate status portal.
              </p>

              <form onSubmit={recordPayment} className="grid gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Nominal Diterima (IDR)
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, selected.amount - selected.paidAmount)}
                      required
                      value={payment.amount}
                      onChange={(e) =>
                        setPayment({ ...payment, amount: e.target.value })
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Metode Pembayaran
                    <select
                      value={payment.method}
                      onChange={(e) =>
                        setPayment({
                          ...payment,
                          method: e.target.value as PaymentForm["method"],
                        })
                      }
                      className={inputClass}
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
                    type="datetime-local"
                    required
                    value={payment.paidAt}
                    onChange={(e) =>
                      setPayment({ ...payment, paidAt: e.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Catatan Pembayaran
                  <textarea
                    rows={2}
                    maxLength={2000}
                    value={payment.note}
                    onChange={(e) =>
                      setPayment({ ...payment, note: e.target.value })
                    }
                    className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                    placeholder="Nomor referensi mutasi bank..."
                  />
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payment.isVisibleToClient}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        isVisibleToClient: e.target.checked,
                      })
                    }
                    className="rounded border-[#d4d4d8]"
                  />
                  Tampilkan bukti pembayaran di portal klien
                </label>

                <div className="pt-2">
                  <ToolbarButton
                    type="submit"
                    variant="dark"
                    disabled={busy || selected.paidAmount >= selected.amount}
                    className="w-full"
                  >
                    {busy ? "Mencatat…" : "Catat Pembayaran Sekarang"}
                  </ToolbarButton>
                </div>
              </form>
            </BentoCard>
          ) : null}
        </div>
      </div>
    </AdminFrame>
  );
}
