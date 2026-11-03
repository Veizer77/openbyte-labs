"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
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
import { BentoCard, Chip, EmptyState, ToolbarButton } from "./AdminUi";

export type ContentCollection = "faqs" | "testimonials" | "packages" | "addons";
type CmsRecord = { id: string; [key: string]: unknown };
type FormValue = string | boolean;
type FormData = Record<string, FormValue>;
type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "checkbox" | "select";
  options?: Array<{ value: string; label: string }>;
};

const descriptions: Record<
  ContentCollection,
  { title: string; description: string; add: string; screenKey: string }
> = {
  faqs: {
    title: "FAQ Pertanyaan Umum",
    description:
      "Kelola daftar tanya jawab publik. FAQ yang aktif divalidasi agar jawabannya lengkap dan jelas.",
    add: "Tambah FAQ",
    screenKey: "cms/testimoni-faq",
  },
  testimonials: {
    title: "Testimoni Klien",
    description:
      "Kelola kutipan ulasan klien, relasi proyek atau media, status publikasi, dan urutan tampil.",
    add: "Tambah Testimoni",
    screenKey: "cms/testimoni-faq",
  },
  packages: {
    title: "Paket Layanan",
    description:
      "Kelola katalog paket, harga promo, kuota revisi, kategori produk, dan status ketersediaan.",
    add: "Tambah Paket",
    screenKey: "cms/paket-layanan-addon",
  },
  addons: {
    title: "Add-on Layanan",
    description:
      "Kelola opsi modul tambahan untuk estimasi kalkulator harga dan periode penagihan.",
    add: "Tambah Add-on",
    screenKey: "cms/paket-layanan-addon",
  },
};

const fields: Record<ContentCollection, Field[]> = {
  faqs: [
    { key: "question", label: "Pertanyaan", type: "text" },
    { key: "answer", label: "Jawaban (RichText JSON)", type: "textarea" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    {
      key: "requiresTracking",
      label: "Khusus portal tracking (belum dirilis publik)",
      type: "checkbox",
    },
    { key: "sortOrder", label: "Urutan Tampil", type: "number" },
  ],
  testimonials: [
    { key: "authorName", label: "Nama Pemberi Testimoni", type: "text" },
    { key: "authorRole", label: "Jabatan / Organisasi", type: "text" },
    { key: "quote", label: "Kutipan Ulasan", type: "textarea" },
    { key: "photoId", label: "ID Media Foto (UUID opsional)", type: "text" },
    { key: "projectId", label: "ID Proyek Terkait (UUID opsional)", type: "text" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan Tampil", type: "number" },
  ],
  packages: [
    { key: "categoryId", label: "Kategori Produk", type: "select" },
    { key: "name", label: "Nama Paket", type: "text" },
    { key: "slug", label: "Slug URL", type: "text" },
    { key: "targetMarket", label: "Target Pasar", type: "text" },
    { key: "price", label: "Harga Normal (IDR)", type: "number" },
    { key: "discountPrice", label: "Harga Diskon (opsional)", type: "number" },
    { key: "discountEndsAt", label: "Masa Diskon Berakhir", type: "text" },
    {
      key: "billingType",
      label: "Jenis Penagihan",
      type: "select",
      options: [
        { value: "one_time", label: "Sekali bayar" },
        { value: "subscription_yearly", label: "Langganan tahunan" },
        { value: "custom", label: "Kustom" },
      ],
    },
    { key: "estimatedDays", label: "Estimasi Pengerjaan (Hari)", type: "number" },
    { key: "features", label: "Fitur Unggulan (satu per baris)", type: "textarea" },
    { key: "includedRevisions", label: "Kuota Revisi", type: "number" },
    { key: "extraRevisionPrice", label: "Biaya Revisi Tambahan (opsional)", type: "number" },
    {
      key: "revisionPolicy",
      label: "Kebijakan Revisi (JSON RichText, opsional)",
      type: "textarea",
    },
    { key: "ctaLabel", label: "Label Tombol CTA", type: "text" },
    { key: "isPopular", label: "Tandai sebagai Paket Populer", type: "checkbox" },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan Tampil", type: "number" },
  ],
  addons: [
    { key: "name", label: "Nama Add-on", type: "text" },
    { key: "description", label: "Deskripsi Singkat", type: "textarea" },
    { key: "price", label: "Harga (IDR)", type: "number" },
    {
      key: "billingType",
      label: "Jenis Penagihan",
      type: "select",
      options: [
        { value: "one_time", label: "Sekali bayar" },
        { value: "monthly", label: "Bulanan" },
        { value: "yearly", label: "Tahunan" },
      ],
    },
    { key: "isActive", label: "Tampilkan di website", type: "checkbox" },
    { key: "sortOrder", label: "Urutan Tampil", type: "number" },
  ],
};

function blankForm(kind: ContentCollection): FormData {
  if (kind === "faqs")
    return {
      question: "",
      answer: JSON.stringify({ version: 1, blocks: [] }, null, 2),
      isActive: false,
      requiresTracking: false,
      sortOrder: "0",
    };
  if (kind === "testimonials")
    return {
      authorName: "",
      authorRole: "",
      quote: "",
      photoId: "",
      projectId: "",
      isActive: false,
      sortOrder: "0",
    };
  if (kind === "packages")
    return {
      categoryId: "",
      name: "",
      slug: "",
      targetMarket: "",
      price: "0",
      discountPrice: "",
      discountEndsAt: "",
      billingType: "one_time",
      estimatedDays: "0",
      features: "",
      includedRevisions: "2",
      extraRevisionPrice: "",
      revisionPolicy: "",
      ctaLabel: "Pilih paket",
      isPopular: false,
      isActive: false,
      sortOrder: "0",
    };
  return {
    name: "",
    description: "",
    price: "0",
    billingType: "one_time",
    isActive: false,
    sortOrder: "0",
  };
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
      initial.discountEndsAt = value
        ? new Date(String(value)).toISOString().slice(0, 16)
        : "";
    } else if (field.key === "revisionPolicy" && kind === "packages") {
      initial.revisionPolicy = record.revisionPolicy
        ? JSON.stringify(record.revisionPolicy, null, 2)
        : "";
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
    blocks: value.trim()
      ? [{ type: "paragraph", children: [{ type: "text", text: value.trim() }] }]
      : [],
  };
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

function formatFieldErrorMessage(key: string, message: string): string {
  const lower = message.toLowerCase();
  if (
    key === "categoryId" &&
    (lower.includes("uuid") ||
      lower.includes("required") ||
      lower.includes("expected string") ||
      lower.includes("invalid"))
  ) {
    return "Pilih kategori produk terlebih dahulu.";
  }
  if (
    key === "name" &&
    (lower.includes("too short") ||
      lower.includes("expected string") ||
      lower.includes("min") ||
      lower.includes("invalid"))
  ) {
    return "Nama wajib diisi.";
  }
  if (
    key === "slug" &&
    (lower.includes("regex") ||
      lower.includes("invalid") ||
      lower.includes("pattern"))
  ) {
    return "Format slug URL hanya boleh berupa huruf kecil, angka, dan tanda hubung (-).";
  }
  if (
    key === "discountEndsAt" &&
    (lower.includes("date") ||
      lower.includes("string") ||
      lower.includes("datetime") ||
      lower.includes("invalid"))
  ) {
    return "Format tanggal berakhir diskon tidak valid.";
  }
  if (key === "revisionPolicy" && lower.includes("json")) {
    return "Format JSON kebijakan revisi tidak valid.";
  }
  return message;
}

export function AdminContentCollectionsPage({
  kind,
}: {
  kind: ContentCollection;
}) {
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [selected, setSelected] = useState<CmsRecord | null>(null);
  const [form, setForm] = useState<FormData>(() => blankForm(kind));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setRecords(faqRecordSchema.array().parse(result.data) as CmsRecord[]);
      } else if (kind === "testimonials") {
        const result = await listTestimonialsAction({ limit: 100, offset: 0 });
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setRecords(testimonialRecordSchema.array().parse(result.data) as CmsRecord[]);
      } else if (kind === "packages") {
        const [packages, categoryResult] = await Promise.all([
          listPackagesAction({ limit: 100, offset: 0 }),
          listCategoriesAction({ limit: 100, offset: 0 }),
        ]);
        if (!packages.ok) {
          setError(packages.message);
          return;
        }
        if (!categoryResult.ok) {
          setError(categoryResult.message);
          return;
        }
        setRecords(packageRecordSchema.array().parse(packages.data) as CmsRecord[]);
        setCategories(categoryRecordSchema.array().parse(categoryResult.data));
      } else {
        const result = await listServiceAddonsAction({ limit: 100, offset: 0 });
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setRecords(
          serviceAddonRecordSchema.array().parse(result.data) as CmsRecord[]
        );
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
          else
            setRecords(
              testimonialRecordSchema.array().parse(result.data) as CmsRecord[]
            );
        } else if (kind === "packages") {
          const [packages, categoryResult] = await Promise.all([
            listPackagesAction({ limit: 100, offset: 0 }),
            listCategoriesAction({ limit: 100, offset: 0 }),
          ]);
          if (!active) return;
          if (!packages.ok) setError(packages.message);
          else
            setRecords(
              packageRecordSchema.array().parse(packages.data) as CmsRecord[]
            );
          if (!categoryResult.ok) setError(categoryResult.message);
          else setCategories(categoryRecordSchema.array().parse(categoryResult.data));
        } else {
          const result = await listServiceAddonsAction({ limit: 100, offset: 0 });
          if (!active) return;
          if (!result.ok) setError(result.message);
          else
            setRecords(
              serviceAddonRecordSchema.array().parse(result.data) as CmsRecord[]
            );
        }
      } catch {
        if (active) setError(`Daftar ${meta.title.toLowerCase()} tidak dapat dimuat.`);
      } finally {
        if (active) setLoading(false);
      }
    };
    void task();
    return () => {
      active = false;
    };
  }, [kind, meta.title]);

  function clearFieldError(key: string) {
    setFieldErrors((curr) => {
      if (
        !curr[key] &&
        !(
          (key === "discountPrice" || key === "discountEndsAt") &&
          (curr["discountPrice"] || curr["discountEndsAt"])
        )
      ) {
        return curr;
      }
      const next = { ...curr };
      delete next[key];
      if (key === "discountPrice" || key === "discountEndsAt") {
        if (next["discountPrice"]?.includes("bersama")) delete next["discountPrice"];
        if (next["discountEndsAt"]?.includes("bersama")) delete next["discountEndsAt"];
      }
      return next;
    });
  }

  function startNew() {
    setSelected(null);
    setForm(blankForm(kind));
    setError("");
    setStatus("");
    setFieldErrors({});
  }

  function edit(record: CmsRecord) {
    setSelected(record);
    setForm(formFromRecord(kind, record));
    setError("");
    setStatus("");
    setFieldErrors({});
  }

  function makeInput(): unknown {
    if (kind === "faqs")
      return faqInputSchema.parse({
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
    if (kind === "testimonials")
      return testimonialInputSchema.parse({
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
      if (text) {
        try {
          revisionPolicy = JSON.parse(text) as unknown;
        } catch {
          throw new z.ZodError([
            {
              code: "custom",
              path: ["revisionPolicy"],
              message: "Format JSON kebijakan revisi tidak valid.",
            },
          ]);
        }
      }
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
        features: String(form.features ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
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
    setFieldErrors({});
    setError("");
    setStatus("");

    let value: unknown;
    try {
      value = makeInput();
    } catch (cause) {
      if (cause && typeof cause === "object" && "issues" in cause) {
        const issues = (
          cause as {
            issues: Array<{
              path?: (string | number)[];
              message?: string;
              code?: string;
            }>;
          }
        ).issues;
        const newFieldErrors: Record<string, string> = {};
        const errorList: string[] = [];

        for (const issue of issues) {
          const fieldKey = issue.path?.[0] ? String(issue.path[0]) : "";
          const fieldDef = fields[kind].find((f) => f.key === fieldKey);
          const fieldLabel = fieldDef?.label ?? fieldKey;
          const msg = formatFieldErrorMessage(fieldKey, issue.message ?? "Data tidak valid");

          if (fieldKey) {
            if (!newFieldErrors[fieldKey]) {
              newFieldErrors[fieldKey] = msg;
            }
          }

          const formattedMessage = fieldLabel ? `${fieldLabel}: ${msg}` : msg;
          if (!errorList.includes(formattedMessage)) {
            errorList.push(formattedMessage);
          }
        }

        setFieldErrors(newFieldErrors);
        setError(
          errorList.length > 0
            ? errorList.join(" • ")
            : "Terdapat data yang tidak valid. Periksa kembali isian formulir."
        );
        return;
      }
      setError(cause instanceof Error ? cause.message : "Periksa kembali data.");
      return;
    }

    setBusy(true);
    try {
      const input = { id: selected?.id ?? null, value };
      const result =
        kind === "faqs"
          ? await saveFaqAction(input)
          : kind === "testimonials"
          ? await saveTestimonialAction(input)
          : kind === "packages"
          ? await savePackageAction(input)
          : await saveServiceAddonAction(input);
      if (!result.ok) {
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          const mappedErrors: Record<string, string> = {};
          const errorList: string[] = [];
          for (const [key, rawMsg] of Object.entries(result.fieldErrors)) {
            const fieldDef = fields[kind].find((f) => f.key === key);
            const label = fieldDef?.label ?? key;
            const msg = formatFieldErrorMessage(key, rawMsg);
            mappedErrors[key] = msg;
            errorList.push(`${label}: ${msg}`);
          }
          setFieldErrors(mappedErrors);
          setError(errorList.join(" • "));
        } else {
          const msg = result.message;
          const lower = msg.toLowerCase();
          if (lower.includes("kategori")) {
            setFieldErrors({ categoryId: msg });
            setError(`Kategori Produk: ${msg}`);
          } else if (lower.includes("diskon")) {
            setFieldErrors({ discountEndsAt: msg, discountPrice: msg });
            setError(`Diskon: ${msg}`);
          } else {
            setError(msg);
          }
        }
        return;
      }
      setStatus(`${meta.title} berhasil disimpan ke database.`);
      setFieldErrors({});
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
    const name = getString(
      record,
      kind === "faqs" ? "question" : kind === "testimonials" ? "authorName" : "name"
    );
    const isDeleted = kind === "packages" && Boolean(record.deletedAt);
    if (
      busy ||
      !window.confirm(
        `${
          isDeleted
            ? "Pulihkan"
            : kind === "packages"
            ? "Pindahkan paket"
            : "Hapus"
        } “${name}”?`
      )
    )
      return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result =
        kind === "faqs"
          ? await deleteFaqAction(record.id)
          : kind === "testimonials"
          ? await deleteTestimonialAction(record.id)
          : kind === "addons"
          ? await deleteServiceAddonAction(record.id)
          : await trashPackageAction({ id: record.id, deleted: !isDeleted });
      if (!result.ok) setError(result.message);
      else {
        setStatus(
          isDeleted
            ? "Paket dipulihkan."
            : kind === "packages"
            ? "Paket dipindahkan ke Trash."
            : `${meta.title} dihapus.`
        );
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
    const fieldError = fieldErrors[field.key];
    const hasError = Boolean(fieldError);

    if (field.type === "checkbox")
      return (
        <div key={field.key} className="sm:col-span-2 pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => {
                setForm((curr) => ({ ...curr, [field.key]: e.target.checked }));
                clearFieldError(field.key);
              }}
              className="rounded border-[#d4d4d8]"
            />
            <span className={hasError ? "text-red-700 font-semibold" : ""}>{field.label}</span>
          </label>
          {hasError ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
              <span className="symbol text-xs">error</span>
              <span>{fieldError}</span>
            </p>
          ) : null}
        </div>
      );
    if (field.type === "select") {
      const options =
        field.key === "categoryId"
          ? categories.map((cat) => ({
              value: cat.id,
              label: cat.name + (cat.isActive ? "" : " (nonaktif)"),
            }))
          : field.options ?? [];
      return (
        <label key={field.key} className={`grid gap-1 text-xs font-medium ${hasError ? "text-red-700" : "text-[#52525b]"}`}>
          <div className="flex items-center justify-between">
            <span>{field.label}</span>
            {hasError ? (
              <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Periksa Kolom</span>
            ) : null}
          </div>
          <select
            required
            value={String(value)}
            onChange={(e) => {
              setForm((curr) => ({ ...curr, [field.key]: e.target.value }));
              clearFieldError(field.key);
            }}
            className={`${inputClass} ${
              hasError
                ? "!border-red-500 !bg-red-50/40 text-red-950 focus:!border-red-600 focus:ring-1 focus:ring-red-500"
                : ""
            }`}
          >
            <option value="">Pilih…</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasError ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
              <span className="symbol text-xs">error</span>
              <span>{fieldError}</span>
            </p>
          ) : null}
        </label>
      );
    }
    if (field.type === "textarea")
      return (
        <label
          key={field.key}
          className={`grid gap-1 text-xs font-medium sm:col-span-2 ${hasError ? "text-red-700" : "text-[#52525b]"}`}
        >
          <div className="flex items-center justify-between">
            <span>{field.label}</span>
            {hasError ? (
              <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Periksa Kolom</span>
            ) : null}
          </div>
          <textarea
            rows={
              field.key === "quote" ||
              field.key === "answer" ||
              field.key === "features"
                ? 4
                : 3
            }
            value={String(value)}
            onChange={(e) => {
              setForm((curr) => ({ ...curr, [field.key]: e.target.value }));
              clearFieldError(field.key);
            }}
            className={`w-full rounded-[10px] p-3 text-xs outline-none border resize-y transition-all ${
              hasError
                ? "border-red-500 bg-red-50/40 text-red-950 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                : "border-transparent bg-[#f0f0f0] text-[#18181a] focus:border-[#18181a]"
            }`}
          />
          {hasError ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
              <span className="symbol text-xs">error</span>
              <span>{fieldError}</span>
            </p>
          ) : null}
        </label>
      );
    return (
      <label key={field.key} className={`grid gap-1 text-xs font-medium ${hasError ? "text-red-700" : "text-[#52525b]"}`}>
        <div className="flex items-center justify-between">
          <span>{field.label}</span>
          {hasError ? (
            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Periksa Kolom</span>
          ) : null}
        </div>
        <input
          type={
            field.type === "number"
              ? "number"
              : field.key === "discountEndsAt"
              ? "datetime-local"
              : "text"
          }
          min={field.type === "number" ? 0 : undefined}
          required={
            field.type === "number" &&
            !["discountPrice", "extraRevisionPrice"].includes(field.key)
          }
          value={String(value)}
          onChange={(e) => {
            setForm((curr) => ({ ...curr, [field.key]: e.target.value }));
            clearFieldError(field.key);
          }}
          className={`${inputClass} ${
            hasError
              ? "!border-red-500 !bg-red-50/40 text-red-950 focus:!border-red-600 focus:ring-1 focus:ring-red-500"
              : ""
          }`}
        />
        {hasError ? (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
            <span className="symbol text-xs">error</span>
            <span>{fieldError}</span>
          </p>
        ) : null}
      </label>
    );
  }

  return (
    <AdminFrame
      title={meta.title}
      description={meta.description}
      screenKey={meta.screenKey}
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
          <ToolbarButton variant="dark" icon="add" onClick={startNew}>
            {meta.add}
          </ToolbarButton>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <div className="flex items-start gap-2">
            <span className="symbol text-base shrink-0 mt-0.5">error</span>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-red-900 m-0">
                Terjadi kesalahan input data:
              </p>
              <div className="text-red-800">
                {error.includes(" • ") ? (
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {error.split(" • ").map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 mt-0.5">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {status ? (
        <div className="mb-4 rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900 flex items-center gap-2">
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Left Side: List Cards */}
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Daftar {meta.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Total {records.length} item tersimpan dalam basis data
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat data…</p>
          ) : records.length === 0 ? (
            <EmptyState
              icon="inventory_2"
              title={`Belum ada ${meta.title.toLowerCase()}`}
              description="Tambahkan entri baru melalui formulir di samping."
            />
          ) : (
            <div className="grid gap-2.5">
              {records.map((record) => {
                const title = getString(
                  record,
                  kind === "faqs"
                    ? "question"
                    : kind === "testimonials"
                    ? "authorName"
                    : "name"
                );
                const deleted = kind === "packages" && Boolean(record.deletedAt);
                const active = record.isActive === true;
                const isSelected = selected?.id === record.id;

                return (
                  <div
                    key={record.id}
                    className={`rounded-[12px] border p-3.5 transition-all ${
                      isSelected
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                            {title || "(tanpa judul)"}
                          </h3>
                          <Chip
                            variant={deleted ? "neutral" : active ? "success" : "neutral"}
                            size="sm"
                          >
                            {deleted ? "Trash" : active ? "Aktif" : "Draft"}
                          </Chip>
                          {record.isPopular ? (
                            <Chip variant="lime" size="sm">
                              Populer
                            </Chip>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-[#71717a]">
                          {typeof record.sortOrder === "number"
                            ? `Urutan: ${record.sortOrder}`
                            : ""}
                          {record.price ? ` · Rp ${Number(record.price).toLocaleString("id-ID")}` : ""}
                          {record.authorRole ? ` · ${record.authorRole}` : ""}
                        </div>
                        {record.quote ? (
                          <p className="m-0 mt-1.5 text-xs text-[#52525b] line-clamp-2 italic">
                            “{String(record.quote)}”
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 gap-1.5 self-end sm:self-start">
                        <ToolbarButton
                          variant="light"
                          onClick={() => edit(record)}
                        >
                          Ubah
                        </ToolbarButton>
                        <ToolbarButton
                          variant="danger"
                          disabled={busy}
                          onClick={() => void remove(record)}
                        >
                          {deleted
                            ? "Pulihkan"
                            : kind === "packages"
                            ? "Trash"
                            : "Hapus"}
                        </ToolbarButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>

        {/* Right Side: Form Editor */}
        <BentoCard className="sticky top-20">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                {selected ? "Ubah" : "Tambah"} {meta.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Pastikan seluruh kolom wajib telah terisi dengan benar
              </p>
            </div>
            {selected ? (
              <button
                type="button"
                disabled={busy}
                onClick={startNew}
                className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
              >
                Batal Edit
              </button>
            ) : null}
          </div>

          {kind === "packages" && categories.length === 0 ? (
            <div className="mb-4 rounded-[10px] border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Buat atau aktifkan kategori terlebih dahulu sebelum menyimpan paket.
            </div>
          ) : null}

          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => void save(e)}
          >
            {fields[kind].map(renderField)}

            {kind === "packages" ? (
              <p className="m-0 text-[11px] text-[#71717a] sm:col-span-2">
                Paket aktif wajib memiliki fitur dan kategori produk aktif.
              </p>
            ) : null}

            <div className="pt-2 sm:col-span-2">
              <ToolbarButton
                type="submit"
                variant="dark"
                disabled={busy || (kind === "packages" && categories.length === 0)}
                className="w-full"
              >
                {busy ? "Menyimpan…" : "Simpan Data"}
              </ToolbarButton>
            </div>
          </form>
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
