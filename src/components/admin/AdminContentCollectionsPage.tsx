"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  deleteFaqAction,
  listFaqsAction,
  saveFaqAction,
} from "@/actions/admin/faqs";
import {
  deleteTestimonialAction,
  listTestimonialsAction,
  saveTestimonialAction,
} from "@/actions/admin/testimonials";
import {
  listPackagesAction,
  savePackageAction,
  trashPackageAction,
} from "@/actions/admin/packages";
import {
  deleteServiceAddonAction,
  listServiceAddonsAction,
  saveServiceAddonAction,
} from "@/actions/admin/service-addons";
import { listCategoriesAction } from "@/actions/admin/categories";
import { faqInputSchema, faqRecordSchema } from "@/schemas/faqs";
import { testimonialInputSchema, testimonialRecordSchema } from "@/schemas/testimonials";
import { packageInputSchema, packageRecordSchema } from "@/schemas/packages";
import { serviceAddonInputSchema, serviceAddonRecordSchema } from "@/schemas/service-addons";
import { categoryRecordSchema, type CategoryRecord } from "@/schemas/categories";
import { richTextSchema, type RichText } from "@/schemas/rich-text";
import { AdminFrame } from "./AdminFrame";

export type ContentCollection = "faqs" | "testimonials" | "packages" | "addons";
type CmsRecord = { id: string; [key: string]: unknown };
type FormValue = string | boolean;
type FormData = Record<string, FormValue>;
type Field = { key: string; label: string; type: "text" | "number" | "textarea" | "checkbox" | "select"; options?: Array<{ value: string; label: string }> };

const descriptions: Record<ContentCollection, { title: string; description: string; add: string }> = {
  faqs: { title: "FAQ", description: "Kelola pertanyaan publik. FAQ yang aktif divalidasi agar jawabannya lengkap dan bebas placeholder.", add: "Tambah FAQ" },
  testimonials: { title: "Testimoni", description: "Kelola kutipan klien, relasi proyek/media, status publikasi, dan urutan tampil.", add: "Tambah testimoni" },
  packages: { title: "Paket layanan", description: "Kelola katalog paket, harga, periode diskon, kategori, kuota revisi, dan status publikasi.", add: "Tambah paket" },
  addons: { title: "Add-on layanan", description: "Kelola item tambahan kalkulasi harga dan periode penagihannya.", add: "Tambah add-on" },
};

const fields: Record<ContentCollection, Field[]> = {
  faqs: [
    { key: "question", label: "Pertanyaan", type: "text" },
    { key: "answer", label: "Jawaban (RichText JSON)", type: "textarea" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "requiresTracking", label: "Khusus portal tracking (belum dirilis publik)", type: "checkbox" },
    { key: "sortOrder", label: "Urutan", type: "number" },
  ],
  testimonials: [
    { key: "authorName", label: "Nama pemberi testimoni", type: "text" },
    { key: "authorRole", label: "Jabatan/organisasi", type: "text" },
    { key: "quote", label: "Kutipan", type: "textarea" },
    { key: "photoId", label: "ID media foto (opsional UUID)", type: "text" },
    { key: "projectId", label: "ID proyek terkait (opsional UUID)", type: "text" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan", type: "number" },
  ],
  packages: [
    { key: "categoryId", label: "Kategori", type: "select" },
    { key: "name", label: "Nama paket", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "targetMarket", label: "Target pasar", type: "text" },
    { key: "price", label: "Harga (rupiah)", type: "number" },
    { key: "discountPrice", label: "Harga diskon (opsional)", type: "number" },
    { key: "discountEndsAt", label: "Diskon berakhir", type: "text" },
    { key: "billingType", label: "Jenis penagihan", type: "select", options: [{ value: "one_time", label: "Sekali bayar" }, { value: "subscription_yearly", label: "Langganan tahunan" }, { value: "custom", label: "Kustom" }] },
    { key: "estimatedDays", label: "Estimasi hari kerja", type: "number" },
    { key: "features", label: "Fitur (satu per baris)", type: "textarea" },
    { key: "includedRevisions", label: "Kuota revisi", type: "number" },
    { key: "extraRevisionPrice", label: "Biaya revisi tambahan (opsional)", type: "number" },
    { key: "revisionPolicy", label: "Kebijakan revisi (JSON RichText, opsional)", type: "textarea" },
    { key: "ctaLabel", label: "Label tombol", type: "text" },
    { key: "isPopular", label: "Tandai sebagai populer", type: "checkbox" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan", type: "number" },
  ],
  addons: [
    { key: "name", label: "Nama add-on", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "price", label: "Harga (rupiah)", type: "number" },
    { key: "billingType", label: "Jenis penagihan", type: "select", options: [{ value: "one_time", label: "Sekali bayar" }, { value: "monthly", label: "Bulanan" }, { value: "yearly", label: "Tahunan" }] },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan", type: "number" },
  ],
};

function blankForm(kind: ContentCollection): FormData {
  if (kind === "faqs") return { question: "", answer: JSON.stringify({ version: 1, blocks: [] }, null, 2), isActive: false, requiresTracking: false, sortOrder: "0" };
  if (kind === "testimonials") return { authorName: "", authorRole: "", quote: "", photoId: "", projectId: "", isActive: false, sortOrder: "0" };
  if (kind === "packages") return { categoryId: "", name: "", slug: "", targetMarket: "", price: "0", discountPrice: "", discountEndsAt: "", billingType: "one_time", estimatedDays: "0", features: "", includedRevisions: "2", extraRevisionPrice: "", revisionPolicy: "", ctaLabel: "Pilih paket", isPopular: false, isActive: false, sortOrder: "0" };
  return { name: "", description: "", price: "0", billingType: "one_time", isActive: false, sortOrder: "0" };
}

function getString(record: CmsRecord, key: string) {
  const value = record[key];
  return value === null || value === undefined ? "" : String(value);
}

function formFromRecord(kind: ContentCollection, record: CmsRecord): FormData {
  const initial = blankForm(kind);
  for (const field of fields[kind]) {
    if (field.key === "answer" && kind === "faqs") {
      initial.answer = JSON.stringify(record.answer, null, 2);
    } else if (field.key === "features" && kind === "packages") {
      const value = record.features;
      initial.features = Array.isArray(value) ? value.join("\n") : "";
    } else if (field.key === "discountEndsAt" && kind === "packages") {
      const value = record.discountEndsAt;
      initial.discountEndsAt = value ? new Date(String(value)).toISOString().slice(0, 16) : "";
    } else if (field.key === "revisionPolicy" && kind === "packages") {
      initial.revisionPolicy = record.revisionPolicy ? JSON.stringify(record.revisionPolicy, null, 2) : "";
    } else if (field.type === "checkbox") {
      initial[field.key] = record[field.key] === true;
    } else {
      initial[field.key] = getString(record, field.key);
    }
  }
  return initial;
}

function numberOrNull(value: FormValue | undefined) {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
}

function faqRichText(value: string): RichText {
  return {
    version: 1,
    blocks: value.trim() ? [{ type: "paragraph", children: [{ type: "text", text: value.trim() }] }] : [],
  };
}

export function AdminContentCollectionsPage({ kind }: { kind: ContentCollection }) {
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [selected, setSelected] = useState<CmsRecord | null>(null);
  const [form, setForm] = useState<FormData>(() => blankForm(kind));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const meta = descriptions[kind];

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (kind === "faqs") {
        const result = await listFaqsAction({ limit: 100, offset: 0 });
        if (!result.ok) { setError(result.message); return; }
        setRecords(faqRecordSchema.array().parse(result.data) as CmsRecord[]);
      } else if (kind === "testimonials") {
        const result = await listTestimonialsAction({ limit: 100, offset: 0 });
        if (!result.ok) { setError(result.message); return; }
        setRecords(testimonialRecordSchema.array().parse(result.data) as CmsRecord[]);
      } else if (kind === "packages") {
        const [packages, categoryResult] = await Promise.all([
          listPackagesAction({ limit: 100, offset: 0 }),
          listCategoriesAction({ limit: 100, offset: 0 }),
        ]);
        if (!packages.ok) { setError(packages.message); return; }
        if (!categoryResult.ok) { setError(categoryResult.message); return; }
        setRecords(packageRecordSchema.array().parse(packages.data) as CmsRecord[]);
        setCategories(categoryRecordSchema.array().parse(categoryResult.data));
      } else {
        const result = await listServiceAddonsAction({ limit: 100, offset: 0 });
        if (!result.ok) { setError(result.message); return; }
        setRecords(serviceAddonRecordSchema.array().parse(result.data) as CmsRecord[]);
      }
    } catch {
      setError(`Daftar ${meta.title.toLowerCase()} tidak dapat dimuat.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    const task = async () => {
      try {
        if (kind === "faqs") {
          const result = await listFaqsAction({ limit: 100, offset: 0 });
          if (!active) return;
          if (!result.ok) setError(result.message);
          else setRecords(faqRecordSchema.array().parse(result.data) as CmsRecord[]);
        } else if (kind === "testimonials") {
          const result = await listTestimonialsAction({ limit: 100, offset: 0 });
          if (!active) return;
          if (!result.ok) setError(result.message);
          else setRecords(testimonialRecordSchema.array().parse(result.data) as CmsRecord[]);
        } else if (kind === "packages") {
          const [packages, categoryResult] = await Promise.all([listPackagesAction({ limit: 100, offset: 0 }), listCategoriesAction({ limit: 100, offset: 0 })]);
          if (!active) return;
          if (!packages.ok) setError(packages.message);
          else setRecords(packageRecordSchema.array().parse(packages.data) as CmsRecord[]);
          if (!categoryResult.ok) setError(categoryResult.message);
          else setCategories(categoryRecordSchema.array().parse(categoryResult.data));
        } else {
          const result = await listServiceAddonsAction({ limit: 100, offset: 0 });
          if (!active) return;
          if (!result.ok) setError(result.message);
          else setRecords(serviceAddonRecordSchema.array().parse(result.data) as CmsRecord[]);
        }
      } catch {
        if (active) setError(`Daftar ${meta.title.toLowerCase()} tidak dapat dimuat.`);
      } finally {
        if (active) setLoading(false);
      }
    };
    void task();
    return () => { active = false; };
  }, [kind, meta.title]);

  function startNew() {
    setSelected(null);
    setForm(blankForm(kind));
    setError("");
    setStatus("");
  }

  function edit(record: CmsRecord) {
    setSelected(record);
    setForm(formFromRecord(kind, record));
    setError("");
    setStatus("");
  }

  function makeInput(): unknown {
    if (kind === "faqs") return faqInputSchema.parse({
      question: form.question,
      answer: (() => {
        const answerText = String(form.answer ?? "").trim();
        if (!answerText) return faqRichText("");
        if (answerText.startsWith("{") || answerText.startsWith("["))
          return richTextSchema.parse(JSON.parse(answerText) as unknown);
        return faqRichText(answerText);
      })(),
      isActive: form.isActive === true,
      requiresTracking: form.requiresTracking === true,
      sortOrder: Number(form.sortOrder),
    });
    if (kind === "testimonials") return testimonialInputSchema.parse({
      authorName: form.authorName,
      authorRole: form.authorRole,
      quote: form.quote,
      photoId: String(form.photoId ?? "").trim() || null,
      projectId: String(form.projectId ?? "").trim() || null,
      isActive: form.isActive === true,
      sortOrder: Number(form.sortOrder),
    });
    if (kind === "packages") {
      let revisionPolicy: unknown = null;
      const text = String(form.revisionPolicy ?? "").trim();
      if (text) revisionPolicy = JSON.parse(text) as unknown;
      const discountEndsAt = String(form.discountEndsAt ?? "").trim();
      return packageInputSchema.parse({
        categoryId: form.categoryId,
        name: form.name,
        slug: form.slug,
        targetMarket: form.targetMarket,
        price: Number(form.price),
        discountPrice: numberOrNull(form.discountPrice),
        discountEndsAt: discountEndsAt ? new Date(discountEndsAt) : null,
        billingType: form.billingType,
        estimatedDays: Number(form.estimatedDays),
        features: String(form.features ?? "").split("\n").map((line) => line.trim()).filter(Boolean),
        includedRevisions: Number(form.includedRevisions),
        extraRevisionPrice: numberOrNull(form.extraRevisionPrice),
        revisionPolicy,
        ctaLabel: form.ctaLabel,
        isPopular: form.isPopular === true,
        isActive: form.isActive === true,
        sortOrder: Number(form.sortOrder),
      });
    }
    return serviceAddonInputSchema.parse({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      billingType: form.billingType,
      isActive: form.isActive === true,
      sortOrder: Number(form.sortOrder),
    });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    let value: unknown;
    try {
      value = makeInput();
    } catch (cause) {
      const first = cause && typeof cause === "object" && "issues" in cause
        ? (cause as { issues?: Array<{ message?: string }> }).issues?.[0]?.message
        : undefined;
      setError(first ?? (cause instanceof Error ? cause.message : "Periksa kembali data."));
      setStatus("");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const input = { id: selected?.id ?? null, value };
      const result = kind === "faqs" ? await saveFaqAction(input)
        : kind === "testimonials" ? await saveTestimonialAction(input)
          : kind === "packages" ? await savePackageAction(input)
            : await saveServiceAddonAction(input);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus(`${meta.title} berhasil disimpan ke database.`);
      await load();
      setSelected(null);
      setForm(blankForm(kind));
    } catch {
      setError(`${meta.title} tidak dapat disimpan.`);
    } finally {
      setBusy(false);
    }
  }

  async function remove(record: CmsRecord) {
    const name = getString(record, kind === "faqs" ? "question" : kind === "testimonials" ? "authorName" : "name");
    const isDeleted = kind === "packages" && Boolean(record.deletedAt);
    if (busy || !window.confirm(`${isDeleted ? "Pulihkan" : kind === "packages" ? "Pindahkan paket" : "Hapus"} “${name}”?`)) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = kind === "faqs" ? await deleteFaqAction(record.id)
        : kind === "testimonials" ? await deleteTestimonialAction(record.id)
          : kind === "addons" ? await deleteServiceAddonAction(record.id)
            : await trashPackageAction({ id: record.id, deleted: !isDeleted });
      if (!result.ok) setError(result.message);
      else {
        setStatus(isDeleted ? "Paket dipulihkan." : kind === "packages" ? "Paket dipindahkan ke Trash." : `${meta.title} dihapus.`);
        if (selected?.id === record.id) startNew();
        await load();
      }
    } catch {
      setError(`${meta.title} tidak dapat diperbarui.`);
    } finally {
      setBusy(false);
    }
  }

  function renderField(field: Field): ReactNode {
    const value = form[field.key] ?? "";
    if (field.type === "checkbox") return (
      <label key={field.key} className="flex min-h-11 items-center gap-3 rounded-lg border border-neutral-200 px-3 text-sm sm:col-span-2">
        <input type="checkbox" checked={value === true} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.checked }))} />
        {field.label}
      </label>
    );
    if (field.type === "select") {
      const options = field.key === "categoryId"
        ? categories.map((category) => ({ value: category.id, label: category.name + (category.isActive ? "" : " (nonaktif)") }))
        : field.options ?? [];
      return <label key={field.key} className="field">{field.label}<select required value={String(value)} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}><option value="">Pilih…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
    }
    if (field.type === "textarea") return <label key={field.key} className="field sm:col-span-2">{field.label}<textarea rows={field.key === "quote" || field.key === "answer" || field.key === "features" ? 5 : 3} value={String(value)} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} /></label>;
    return <label key={field.key} className="field">{field.label}<input type={field.type === "number" ? "number" : field.key === "discountEndsAt" ? "datetime-local" : "text"} min={field.type === "number" ? 0 : undefined} required={field.type === "number" && !["discountPrice", "extraRevisionPrice"].includes(field.key)} value={String(value)} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} /></label>;
  }

  return (
    <AdminFrame title={meta.title} description={meta.description} actions={<button type="button" className="primary-button min-h-11" onClick={startNew}>{meta.add}</button>}>
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {status ? <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">Daftar {meta.title}</h2>
          {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat data…</p> : null}
          {!loading && !records.length ? <p className="text-sm text-[#71717a]">Belum ada data. Buat konten hanya setelah materi disetujui.</p> : null}
          <ul className="m-0 grid list-none gap-3 p-0">
            {records.map((record) => {
              const title = getString(record, kind === "faqs" ? "question" : kind === "testimonials" ? "authorName" : "name");
              const deleted = kind === "packages" && Boolean(record.deletedAt);
              const active = record.isActive === true;
              return <li key={record.id} className="rounded-xl border border-neutral-200 p-3">
                <button type="button" className="block w-full text-left" onClick={() => edit(record)}>
                  <span className="block text-sm font-semibold">{title || "(tanpa judul)"}</span>
                  <span className="mt-1 block text-xs text-[#71717a]">{deleted ? "Trash" : active ? "Aktif" : "Draft/nonaktif"}{typeof record.sortOrder === "number" ? ` · urutan ${record.sortOrder}` : ""}</span>
                </button>
                <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="secondary-button min-h-9" onClick={() => edit(record)}>Edit</button><button type="button" className="secondary-button min-h-9" disabled={busy} onClick={() => void remove(record)}>{deleted ? "Pulihkan" : kind === "packages" ? "Pindah ke Trash" : "Hapus"}</button></div>
              </li>;
            })}
          </ul>
        </section>
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">{selected ? "Edit" : "Tambah"} {meta.title}</h2>
          {kind === "packages" && categories.length === 0 ? <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Buat atau aktifkan kategori terlebih dahulu sebelum menyimpan paket.</p> : null}
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void save(event)}>
            {fields[kind].map(renderField)}
            {kind === "packages" ? <p className="m-0 text-xs leading-5 text-[#71717a] sm:col-span-2">Paket aktif wajib memiliki fitur, kategori aktif, dan data lengkap. Tindakan Trash tidak menghapus referensi historis.</p> : null}
            <div className="flex flex-wrap gap-2 sm:col-span-2"><button type="submit" className="primary-button min-h-11" disabled={busy || (kind === "packages" && categories.length === 0)}>{busy ? "Menyimpan…" : "Simpan"}</button>{selected ? <button type="button" className="secondary-button min-h-11" onClick={startNew}>Batal edit</button> : null}</div>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}
