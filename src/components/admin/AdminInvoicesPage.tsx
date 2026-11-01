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

type ProjectOption = { id: string; projectTitle: string; clientName: string; totalCost: number };
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
const money = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
const localDate = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(`${value}T12:00:00+07:00`));

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
      if (!invoiceResult.ok) { setError(invoiceResult.message); return null; }
      if (!projectResult.ok) { setError(projectResult.message); return null; }
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
    void Promise.all([listInvoicesAction(), listInvoiceProjectsAction()]).then(([invoiceResult, projectResult]) => {
      if (!active) return;
      if (!invoiceResult.ok) setError(invoiceResult.message);
      else setInvoices(invoiceResult.data);
      if (!projectResult.ok) setError(projectResult.message);
      else {
        setProjects(projectResult.data);
        setForm(blankInvoice(projectResult.data[0]?.id ?? ""));
      }
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Data invoice dan proyek tidak dapat dimuat."); setLoading(false); }
    });
    return () => { active = false; };
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
      const result = await saveInvoiceAction({ id: selected?.id ?? null, value });
      if (!result.ok) { setError(result.message); return; }
      setStatus("Invoice berhasil disimpan. Nilai pembayaran tetap dihitung dari ledger pembayaran proyek.");
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
      if (!result.ok) { setError(result.message); return; }
      setStatus("Pembayaran dicatat di ledger proyek dan dialokasikan ke invoice ini.");
      setPayment(blankPayment());
      const refreshedInvoices = await load();
      const refreshed = refreshedInvoices?.find((item) => item.id === selected.id);
      if (refreshed) editInvoice(refreshed);
    } catch {
      setError("Pembayaran tidak dapat dicatat.");
    } finally {
      setBusy(false);
    }
  }

  const selectedProject = projects.find((item) => item.id === form.clientProjectId);

  return (
    <AdminFrame title="Invoice & Penagihan Termin" description="Kelola invoice manual dan alokasikan pembayaran ke ledger proyek yang sama. Pembayaran dan saldo proyek tidak disalin ke tabel tagihan." actions={<button type="button" className="primary-button min-h-11" onClick={newInvoice}>Buat invoice</button>}>
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {status ? <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4"><p className="m-0 text-xs text-[#71717a]">Invoice aktif</p><p className="mb-0 mt-2 text-xl font-semibold">{invoices.filter((invoice) => invoice.status !== "void").length}</p></div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4"><p className="m-0 text-xs text-[#71717a]">Menunggu pembayaran</p><p className="mb-0 mt-2 text-xl font-semibold">{invoices.filter((invoice) => invoice.status === "issued" && invoice.paidAmount < invoice.amount).length}</p></div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4"><p className="m-0 text-xs text-[#71717a]">Total pembayaran dialokasikan</p><p className="mb-0 mt-2 text-xl font-semibold">{money(invoices.reduce((total, invoice) => total + invoice.paidAmount, 0))}</p></div>
      </section>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">Daftar invoice</h2>
          {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat invoice…</p> : null}
          {!loading && invoices.length === 0 ? <p className="text-sm text-[#71717a]">Belum ada invoice.</p> : null}
          <ul className="m-0 grid list-none gap-3 p-0">
            {invoices.map((invoice) => {
              const remaining = Math.max(0, invoice.amount - invoice.paidAmount);
              return <li key={invoice.id} className={`rounded-xl border p-4 ${selected?.id === invoice.id ? "border-[#18181a]" : "border-neutral-200"}`}>
                <button type="button" className="block w-full text-left" onClick={() => editInvoice(invoice)}>
                  <span className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{invoice.invoiceNumber} · {invoice.title}</strong><span className={`rounded-full px-2 py-1 text-[11px] ${invoice.status === "issued" ? "bg-amber-50 text-amber-900" : invoice.status === "void" ? "bg-neutral-100 text-neutral-600" : "bg-blue-50 text-blue-800"}`}>{invoice.status}</span></span>
                  <span className="mt-2 block text-xs text-[#52525b]">{invoice.clientName} · {invoice.projectTitle}</span>
                  <span className="mt-2 block text-xs text-[#71717a]">Tagihan {money(invoice.amount)} · dibayar {money(invoice.paidAmount)} · sisa {money(remaining)} · jatuh tempo {localDate(invoice.dueAt)}</span>
                </button>
              </li>;
            })}
          </ul>
        </section>
        <div className="grid gap-5">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 mt-0 text-lg font-semibold">{selected ? "Edit invoice" : "Invoice baru"}</h2>
            {projects.length === 0 ? <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Buat proyek klien terlebih dahulu sebelum menerbitkan invoice.</p> : null}
            {selectedProject ? <p className="mb-4 rounded-lg bg-neutral-50 p-3 text-xs text-[#52525b]">Nilai proyek: {money(selectedProject.totalCost)} · batas total invoice aktif mengikuti nilai proyek.</p> : null}
            <form className="grid gap-4" onSubmit={(event) => void saveInvoice(event)}>
              <label className="field">Proyek klien<select required value={form.clientProjectId} onChange={(event) => setForm({ ...form, clientProjectId: event.target.value })}><option value="">Pilih proyek…</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.clientName} — {project.projectTitle}</option>)}</select></label>
              <label className="field">Nomor invoice<input required pattern="INV-[0-9]{4}-[A-Za-z0-9-]{3,32}" placeholder="INV-2026-041" value={form.invoiceNumber} onChange={(event) => setForm({ ...form, invoiceNumber: event.target.value.toUpperCase() })} /></label>
              <label className="field">Nama termin / tagihan<input required maxLength={250} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label className="field">Nominal (rupiah)<input type="number" required min={1} value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
              <label className="field">Jatuh tempo<input type="date" required value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} /></label>
              <label className="field">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as InvoiceForm["status"] })}><option value="draft">Draft</option><option value="issued">Terbit</option>{selected ? <option value="void">Batalkan</option> : null}</select></label>
              <label className="field">Catatan<textarea rows={3} maxLength={2000} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
              <div className="flex flex-wrap gap-2"><button type="submit" className="primary-button min-h-11" disabled={busy || projects.length === 0}>{busy ? "Menyimpan…" : "Simpan invoice"}</button>{selected ? <button type="button" className="secondary-button min-h-11" onClick={newInvoice}>Batal edit</button> : null}</div>
            </form>
          </section>
          {selected?.status === "issued" ? <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-1 mt-0 text-lg font-semibold">Catat pembayaran</h2>
            <p className="mb-4 text-sm text-[#71717a]">Sisa invoice {money(Math.max(0, selected.amount - selected.paidAmount))}. Nilai akan masuk ke ledger proyek serta memperbarui saldo portal.</p>
            <form className="grid gap-4" onSubmit={(event) => void recordPayment(event)}>
              <label className="field">Nominal diterima<input type="number" min={1} max={Math.max(1, selected.amount - selected.paidAmount)} required value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} /></label>
              <label className="field">Waktu pembayaran<input type="datetime-local" required value={payment.paidAt} onChange={(event) => setPayment({ ...payment, paidAt: event.target.value })} /></label>
              <label className="field">Metode<select value={payment.method} onChange={(event) => setPayment({ ...payment, method: event.target.value as PaymentForm["method"] })}><option value="transfer">Transfer</option><option value="tunai">Tunai</option><option value="qris">QRIS</option></select></label>
              <label className="field">Catatan<textarea rows={2} maxLength={2000} value={payment.note} onChange={(event) => setPayment({ ...payment, note: event.target.value })} /></label>
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={payment.isVisibleToClient} onChange={(event) => setPayment({ ...payment, isVisibleToClient: event.target.checked })} /> Tampilkan di portal klien</label>
              <button type="submit" className="primary-button min-h-11" disabled={busy || selected.paidAmount >= selected.amount}>{busy ? "Mencatat…" : "Catat pembayaran"}</button>
            </form>
          </section> : null}
        </div>
      </div>
    </AdminFrame>
  );
}
