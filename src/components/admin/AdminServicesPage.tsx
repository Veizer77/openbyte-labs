"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, ToolbarButton } from "./AdminUi";
import {
  deleteServiceAction,
  listServicesAction,
  saveServiceAction,
} from "@/actions/admin/services";
import {
  serviceIconNames,
  serviceInputSchema,
  serviceRecordSchema,
  type ServiceInput,
  type ServiceRecord,
} from "@/schemas/services";
import { z } from "zod";

const newService = (): ServiceInput => ({
  title: "",
  description: "",
  highlights: [],
  icon: "",
  isActive: false,
  sortOrder: 0,
});

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [form, setForm] = useState<ServiceInput>(newService);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadServices() {
    setIsLoading(true);
    setError("");
    try {
      const result = await listServicesAction({ limit: 100, offset: 0 });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setServices(z.array(serviceRecordSchema).parse(result.data));
    } catch {
      setError("Daftar layanan tidak dapat dimuat.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function fetchInitialServices() {
      try {
        const result = await listServicesAction({ limit: 100, offset: 0 });
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setServices(z.array(serviceRecordSchema).parse(result.data));
      } catch {
        if (active) setError("Daftar layanan tidak dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void fetchInitialServices();
    return () => {
      active = false;
    };
  }, []);

  function startNew() {
    setEditingId(null);
    setForm(newService());
    setError("");
    setStatus("");
  }

  function editService(service: ServiceRecord) {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      highlights: [...service.highlights],
      icon: service.icon,
      isActive: service.isActive,
      sortOrder: service.sortOrder,
    });
    setError("");
    setStatus("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = serviceInputSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali data layanan.");
      setStatus("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await saveServiceAction({
        id: editingId,
        value: parsed.data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Perubahan layanan berhasil disimpan.");
      await loadServices();
      setEditingId(null);
      setForm(newService());
    } catch {
      setError("Layanan tidak dapat disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeService(service: ServiceRecord) {
    if (
      isSubmitting ||
      !window.confirm(`Hapus layanan “${service.title}” dari katalog?`)
    )
      return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await deleteServiceAction(service.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (editingId === service.id) startNew();
      setStatus("Layanan berhasil dihapus.");
      await loadServices();
    } catch {
      setError("Layanan tidak dapat dihapus. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeCount = services.filter((s) => s.isActive).length;
  const draftCount = services.length - activeCount;

  return (
    <AdminFrame
      title="Manajemen Layanan & Kartu Bento"
      description="Kelola modul layanan yang ditampilkan pada landing page publik. Hanya layanan aktif yang ditampilkan."
      screenKey="cms/layanan-bento"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton href="/" variant="light" icon="open_in_new">
            Lihat Publik
          </ToolbarButton>
          <ToolbarButton variant="dark" icon="add" onClick={startNew}>
            Tambah Layanan
          </ToolbarButton>
        </div>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Total Layanan</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{services.length}</div>
        </div>
        <div className="rounded-[14px] border border-[#d6eed3] bg-[#eef8ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#457c1d]">Layanan Aktif</div>
          <div className="text-2xl font-semibold text-[#457c1d] mt-1">{activeCount}</div>
        </div>
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Draft / Nonaktif</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{draftCount}</div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Left Side: Services List */}
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Katalog Layanan
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Daftar kartu bento di beranda dan halaman layanan
              </p>
            </div>
            <ToolbarButton
              variant="light"
              icon="sync"
              disabled={isLoading || isSubmitting}
              onClick={() => void loadServices()}
            >
              Refresh
            </ToolbarButton>
          </div>

          {isLoading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat layanan...</p>
          ) : services.length === 0 ? (
            <EmptyState
              icon="grid_view"
              title="Belum ada layanan"
              description="Tambahkan layanan pertama untuk mengisi katalog bento publik."
            />
          ) : (
            <div className="grid gap-3">
              {services.map((service) => {
                const isSelected = editingId === service.id;
                return (
                  <div
                    key={service.id}
                    className={`rounded-[12px] border p-4 transition-all ${
                      isSelected
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f0f0f0] text-[#18181a]">
                          <span className="symbol text-xl">
                            {service.icon || "view_quilt"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                              {service.title}
                            </h3>
                            <Chip
                              variant={service.isActive ? "success" : "neutral"}
                              size="sm"
                            >
                              {service.isActive ? "Aktif" : "Draft"}
                            </Chip>
                            <span className="text-[11px] text-[#71717a] font-mono">
                              Urutan: {service.sortOrder}
                            </span>
                          </div>
                          <p className="m-0 mt-1.5 text-xs text-[#52525b] leading-relaxed">
                            {service.description || "Deskripsi belum diisi."}
                          </p>
                          {service.highlights.length ? (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {service.highlights.map((h, i) => (
                                <span
                                  key={i}
                                  className="rounded-[6px] bg-[#f0f0f0] px-2 py-0.5 text-[11px] text-[#52525b]"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1.5 self-end sm:self-start">
                        <ToolbarButton
                          variant="light"
                          disabled={isSubmitting}
                          onClick={() => editService(service)}
                        >
                          Ubah
                        </ToolbarButton>
                        <ToolbarButton
                          variant="danger"
                          disabled={isSubmitting}
                          onClick={() => void removeService(service)}
                        >
                          Hapus
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
                {editingId ? "Ubah Layanan" : "Tambah Layanan Baru"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Konfigurasi judul, ikon, urutan bento, dan sorotan
              </p>
            </div>
            {editingId ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={startNew}
                className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
              >
                Batal Edit
              </button>
            ) : null}
          </div>

          <form onSubmit={save} className="grid gap-3.5">
            <fieldset disabled={isSubmitting} className="m-0 grid gap-3 border-0 p-0">
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Nama Layanan
                <input
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Contoh: Modern Web Development"
                />
              </label>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Deskripsi Singkat
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={form.description}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, description: e.target.value }))
                  }
                  className="w-full rounded-[10px] bg-[#f0f0f0] p-3 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  placeholder="Penjelasan ringkas nilai lebih layanan..."
                />
              </label>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Sorotan Utama (satu poin per baris)
                <textarea
                  rows={3}
                  value={form.highlights.join("\n")}
                  onChange={(e) =>
                    setForm((c) => ({
                      ...c,
                      highlights: e.target.value
                        .split("\n")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full rounded-[10px] bg-[#f0f0f0] p-3 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  placeholder="Next.js App Router&#10;Cloudflare Edge Deploy&#10;Audit Lighthouse 95+"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Ikon Simbol
                  <select
                    value={form.icon}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        icon: e.target.value as ServiceInput["icon"],
                      }))
                    }
                    className={inputClass}
                  >
                    {serviceIconNames.map((icon) => (
                      <option value={icon} key={icon}>
                        {icon || "Tanpa Ikon"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Urutan Tampil
                  <input
                    type="number"
                    min={0}
                    max={2_147_483_647}
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        sortOrder: Number(e.target.value),
                      }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, isActive: e.target.checked }))
                  }
                  className="rounded border-[#d4d4d8]"
                />
                Tampilkan pada Katalog Publik
              </label>
            </fieldset>

            <div className="flex gap-2 pt-2">
              <ToolbarButton
                type="submit"
                variant="dark"
                disabled={isSubmitting || isLoading}
                className="w-full"
              >
                {isSubmitting
                  ? "Menyimpan…"
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Layanan"}
              </ToolbarButton>
            </div>
          </form>
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
