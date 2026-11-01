"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "./AdminShell";
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

  return (
    <div className="screen admin-screen relative flex min-h-screen w-full flex-col bg-[#f9f9f9]">
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[288px]">
        <AdminHeader />
        <main
          id="konten"
          className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-2 flex gap-1.5 text-[11px] text-[#52525b]"
              >
                <span>Admin</span>
                <span aria-hidden="true">/</span>
                <span>Konten Website</span>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-[#18181a]">
                  Layanan Bento
                </span>
              </nav>
              <h1 className="m-0 text-2xl font-semibold tracking-[-.5px] text-[#18181a]">
                Manajemen Layanan
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-5 text-[#52525b]">
                Kelola layanan yang ditampilkan pada katalog website. Hanya
                layanan aktif yang tersedia untuk publik.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                target="_blank"
                className="secondary-button min-h-11"
              >
                Lihat Website Publik
              </Link>
              <button
                type="button"
                onClick={startNew}
                className="primary-button min-h-11"
              >
                Tambah Layanan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,.8fr)]">
            <section
              aria-labelledby="service-list-heading"
              className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2
                  id="service-list-heading"
                  className="m-0 text-lg font-semibold text-[#18181a]"
                >
                  Katalog layanan
                </h2>
                <button
                  type="button"
                  onClick={() => void loadServices()}
                  disabled={isLoading || isSubmitting}
                  className="secondary-button min-h-10"
                >
                  Muat ulang
                </button>
              </div>

              {error ? (
                <p role="alert" className="mb-4 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              {status ? (
                <p role="status" className="mb-4 text-sm text-green-800">
                  {status}
                </p>
              ) : null}
              {isLoading ? (
                <p role="status" aria-live="polite" className="text-sm text-[#52525b]">
                  Memuat layanan...
                </p>
              ) : error && services.length === 0 ? null : services.length ? (
                <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-base font-semibold text-[#18181a]">
                            {service.title}
                          </h3>
                          <span
                            className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                              service.isActive
                                ? "bg-[#e8efd8] text-[#3f5212]"
                                : "bg-[#f0f0f0] text-[#52525b]"
                            }`}
                          >
                            {service.isActive ? "Aktif" : "Draft"}
                          </span>
                        </div>
                        <p className="my-2 text-sm leading-5 text-[#52525b]">
                          {service.description || "Deskripsi belum diisi."}
                        </p>
                        {service.highlights.length ? (
                          <p className="m-0 text-xs leading-5 text-[#52525b]">
                            {service.highlights.join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => editService(service)}
                          className="secondary-button min-h-10"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => void removeService(service)}
                          className="secondary-button min-h-10 text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl bg-[#f9f9f9] p-4 text-sm text-[#52525b]">
                  Belum ada layanan. Tambahkan layanan pertama untuk mengisi
                  katalog publik.
                </p>
              )}
            </section>

            <section
              aria-labelledby="service-editor-heading"
              className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <h2
                id="service-editor-heading"
                className="mb-5 mt-0 text-lg font-semibold text-[#18181a]"
              >
                {editingId ? "Ubah layanan" : "Layanan baru"}
              </h2>
              <form onSubmit={save} className="flex flex-col gap-4">
                <fieldset
                  disabled={isSubmitting}
                  className="m-0 flex flex-col gap-4 border-0 p-0"
                >
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Nama layanan
                    <input
                      required
                      maxLength={150}
                      value={form.title}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Deskripsi
                    <textarea
                      rows={4}
                      maxLength={2000}
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Poin layanan, satu per baris
                    <textarea
                      rows={4}
                      value={form.highlights.join("\n")}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          highlights: event.target.value
                            .split("\n")
                            .map((value) => value.trim())
                            .filter(Boolean),
                        }))
                      }
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Ikon
                    <select
                      value={form.icon}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          icon: event.target.value as ServiceInput["icon"],
                        }))
                      }
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    >
                      {serviceIconNames.map((icon) => (
                        <option value={icon} key={icon}>
                          {icon || "Tanpa ikon"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Urutan
                    <input
                      type="number"
                      min={0}
                      max={2_147_483_647}
                      value={form.sortOrder}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          sortOrder: Number(event.target.value),
                        }))
                      }
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                  </label>
                  <label className="flex min-h-11 items-center gap-2 text-sm text-[#18181a]">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                      className="size-4 accent-[#586016]"
                    />
                    Tampilkan pada katalog publik
                  </label>
                </fieldset>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="primary-button min-h-11"
                  >
                    {isSubmitting
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan perubahan"
                        : "Tambah layanan"}
                  </button>
                  {editingId ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={startNew}
                      className="secondary-button min-h-11"
                    >
                      Batal mengubah
                    </button>
                  ) : null}
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
