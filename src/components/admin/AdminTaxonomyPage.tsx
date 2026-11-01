"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "./AdminShell";
import {
  deleteCategoryAction,
  listCategoriesAction,
  saveCategoryAction,
} from "@/actions/admin/categories";
import {
  deleteTechnologyAction,
  listTechnologiesAction,
  saveTechnologyAction,
} from "@/actions/admin/technologies";
import {
  categoryInputSchema,
  categoryRecordSchema,
  type CategoryInput,
  type CategoryRecord,
} from "@/schemas/categories";
import {
  technologyInputSchema,
  technologyRecordSchema,
  type TechnologyInput,
  type TechnologyRecord,
} from "@/schemas/technologies";
import { z } from "zod";

type TaxonomyTab = "categories" | "technologies";

function newCategory(): CategoryInput {
  return {
    name: "",
    slug: "",
    icon: "",
    showInFilter: true,
    isActive: true,
    sortOrder: 0,
  };
}

function newTechnology(): TechnologyInput {
  return { name: "", slug: "", icon: "", color: "#586016" };
}

export function AdminTaxonomyPage() {
  const [tab, setTab] = useState<TaxonomyTab>("categories");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyRecord[]>([]);
  const [categoryValue, setCategoryValue] = useState<CategoryInput>(newCategory);
  const [technologyValue, setTechnologyValue] =
    useState<TechnologyInput>(newTechnology);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTechnologyId, setEditingTechnologyId] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [categoryResult, technologyResult] = await Promise.all([
          listCategoriesAction({ limit: 100, offset: 0 }),
          listTechnologiesAction({ limit: 100, offset: 0 }),
        ]);
        if (!active) return;
        if (!categoryResult.ok || !technologyResult.ok) {
          setError(
            !categoryResult.ok
              ? categoryResult.message
              : !technologyResult.ok
                ? technologyResult.message
                : "Data kategori dan teknologi tidak dapat dimuat.",
          );
          return;
        }
        setCategories(z.array(categoryRecordSchema).parse(categoryResult.data));
        setTechnologies(
          z.array(technologyRecordSchema).parse(technologyResult.data),
        );
      } catch {
        if (active) setError("Data kategori dan teknologi tidak dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredCategories = categories.filter((item) =>
    `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const filteredTechnologies = technologies.filter((item) =>
    `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function editCategory(item: CategoryRecord) {
    setEditingCategoryId(item.id);
    setEditingTechnologyId(null);
    setCategoryValue({
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      showInFilter: item.showInFilter,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setError("");
    setStatus("");
  }

  function editTechnology(item: TechnologyRecord) {
    setEditingTechnologyId(item.id);
    setEditingCategoryId(null);
    setTechnologyValue({
      name: item.name,
      slug: item.slug,
      icon: item.icon,
      color: item.color,
    });
    setError("");
    setStatus("");
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    const parsed = categoryInputSchema.safeParse(categoryValue);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa data kategori.");
      setStatus("");
      return;
    }
    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await saveCategoryAction({
        id: editingCategoryId,
        value: parsed.data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Kategori berhasil disimpan.");
      setEditingCategoryId(null);
      setCategoryValue(newCategory());
      setReloadKey((current) => current + 1);
    } catch {
      setError("Kategori tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveTechnology(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    const parsed = technologyInputSchema.safeParse(technologyValue);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa data teknologi.");
      setStatus("");
      return;
    }
    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await saveTechnologyAction({
        id: editingTechnologyId,
        value: parsed.data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Teknologi berhasil disimpan.");
      setEditingTechnologyId(null);
      setTechnologyValue(newTechnology());
      setReloadKey((current) => current + 1);
    } catch {
      setError("Teknologi tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCategory(item: CategoryRecord) {
    if (
      isSaving ||
      !window.confirm(
        `Hapus kategori “${item.name}”? Kategori yang digunakan paket atau proyek tidak dapat dihapus.`,
      )
    )
      return;
    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await deleteCategoryAction(item.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (editingCategoryId === item.id) {
        setEditingCategoryId(null);
        setCategoryValue(newCategory());
      }
      setStatus("Kategori berhasil dihapus.");
      setReloadKey((current) => current + 1);
    } catch {
      setError("Kategori tidak dapat dihapus.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeTechnology(item: TechnologyRecord) {
    if (
      isSaving ||
      !window.confirm(
        `Hapus teknologi “${item.name}”? Teknologi yang digunakan proyek tidak dapat dihapus.`,
      )
    )
      return;
    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      const result = await deleteTechnologyAction(item.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (editingTechnologyId === item.id) {
        setEditingTechnologyId(null);
        setTechnologyValue(newTechnology());
      }
      setStatus("Teknologi berhasil dihapus.");
      setReloadKey((current) => current + 1);
    } catch {
      setError("Teknologi tidak dapat dihapus.");
    } finally {
      setIsSaving(false);
    }
  }

  function startNew() {
    setEditingCategoryId(null);
    setEditingTechnologyId(null);
    setCategoryValue(newCategory());
    setTechnologyValue(newTechnology());
    setError("");
    setStatus("");
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
                  Kategori & Teknologi
                </span>
              </nav>
              <h1 className="m-0 text-2xl font-semibold tracking-[-.5px] text-[#18181a]">
                Kategori & Teknologi
              </h1>
              <p className="mb-0 mt-2 max-w-3xl text-sm leading-5 text-[#52525b]">
                Data ini dipakai pada filter katalog publik dan editor proyek.
                Item yang masih digunakan tidak dapat dihapus.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/showcase" className="secondary-button min-h-11">
                Buka proyek showcase
              </Link>
              <button
                type="button"
                disabled={isLoading || isSaving}
                onClick={() => setReloadKey((current) => current + 1)}
                className="secondary-button min-h-11"
              >
                Muat ulang
              </button>
            </div>
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

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
            <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#18181a]">
                    Referensi konten
                  </h2>
                  <p className="mb-0 mt-1 text-xs text-[#52525b]">
                    {tab === "categories"
                      ? `${categories.length} kategori tersimpan`
                      : `${technologies.length} teknologi tersimpan`}
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Pilih jenis referensi"
                  className="flex flex-wrap gap-2"
                >
                  <button
                    type="button"
                    aria-pressed={tab === "categories"}
                    onClick={() => setTab("categories")}
                    className={
                      tab === "categories"
                        ? "primary-button min-h-11"
                        : "secondary-button min-h-11"
                    }
                  >
                    Kategori
                  </button>
                  <button
                    type="button"
                    aria-pressed={tab === "technologies"}
                    onClick={() => setTab("technologies")}
                    className={
                      tab === "technologies"
                        ? "primary-button min-h-11"
                        : "secondary-button min-h-11"
                    }
                  >
                    Teknologi
                  </button>
                </div>
              </div>

              <label className="mb-4 flex flex-col gap-1.5 text-xs font-medium text-[#52525b]">
                Cari berdasarkan nama atau slug
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-[#18181a]"
                />
              </label>

              {isLoading ? (
                <p role="status" className="text-sm text-[#52525b]">
                  Memuat kategori dan teknologi...
                </p>
              ) : tab === "categories" ? (
                filteredCategories.length ? (
                  <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
                    {filteredCategories.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                              {item.name}
                            </h3>
                            <span className="rounded-md bg-[#f0f0f0] px-2 py-1 text-[11px] text-[#52525b]">
                              {item.isActive ? "Aktif" : "Nonaktif"}
                            </span>
                            {item.showInFilter ? (
                              <span className="rounded-md bg-[#e8efd8] px-2 py-1 text-[11px] text-[#3f5212]">
                                Filter publik
                              </span>
                            ) : null}
                          </div>
                          <p className="mb-0 mt-1 break-all text-xs text-[#52525b]">
                            {item.slug}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => editCategory(item)}
                            className="secondary-button min-h-11"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => void removeCategory(item)}
                            className="secondary-button min-h-11 text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-neutral-200 bg-[#f9f9f9] p-5 text-sm text-[#52525b]">
                    Tidak ada kategori yang cocok dengan pencarian.
                  </p>
                )
              ) : filteredTechnologies.length ? (
                <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
                  {filteredTechnologies.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="size-5 shrink-0 rounded-md border border-neutral-300"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="min-w-0">
                          <h3 className="m-0 truncate text-sm font-semibold text-[#18181a]">
                            {item.name}
                          </h3>
                          <p className="mb-0 mt-1 break-all text-xs text-[#52525b]">
                            {item.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => editTechnology(item)}
                          className="secondary-button min-h-11"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => void removeTechnology(item)}
                          className="secondary-button min-h-11 text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-neutral-200 bg-[#f9f9f9] p-5 text-sm text-[#52525b]">
                  Tidak ada teknologi yang cocok dengan pencarian.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="m-0 text-lg font-semibold text-[#18181a]">
                  {tab === "categories"
                    ? editingCategoryId
                      ? "Ubah kategori"
                      : "Kategori baru"
                    : editingTechnologyId
                      ? "Ubah teknologi"
                      : "Teknologi baru"}
                </h2>
                {(editingCategoryId || editingTechnologyId) && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={startNew}
                    className="text-xs font-medium text-[#52525b] underline underline-offset-4"
                  >
                    Batalkan edit
                  </button>
                )}
              </div>

              {tab === "categories" ? (
                <form onSubmit={(event) => void saveCategory(event)}>
                  <fieldset
                    disabled={isSaving}
                    className="m-0 flex flex-col gap-4 border-0 p-0"
                  >
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Nama kategori
                      <input
                        required
                        maxLength={150}
                        value={categoryValue.name}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Slug
                      <input
                        required
                        maxLength={100}
                        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                        value={categoryValue.slug}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
                            ...current,
                            slug: event.target.value,
                          }))
                        }
                        placeholder="contoh: instansi-pemdes"
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Ikon (nama Material Symbol)
                      <input
                        maxLength={80}
                        value={categoryValue.icon}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
                            ...current,
                            icon: event.target.value,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Urutan
                      <input
                        type="number"
                        min={0}
                        max={2_147_483_647}
                        value={categoryValue.sortOrder}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
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
                        checked={categoryValue.isActive}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
                            ...current,
                            isActive: event.target.checked,
                          }))
                        }
                        className="size-4 accent-[#586016]"
                      />
                      Aktif untuk data baru
                    </label>
                    <label className="flex min-h-11 items-center gap-2 text-sm text-[#18181a]">
                      <input
                        type="checkbox"
                        checked={categoryValue.showInFilter}
                        onChange={(event) =>
                          setCategoryValue((current) => ({
                            ...current,
                            showInFilter: event.target.checked,
                          }))
                        }
                        className="size-4 accent-[#586016]"
                      />
                      Tampilkan pada filter proyek publik
                    </label>
                    <button
                      type="submit"
                      disabled={isSaving || isLoading}
                      className="primary-button min-h-11 self-start"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan kategori"}
                    </button>
                  </fieldset>
                </form>
              ) : (
                <form onSubmit={(event) => void saveTechnology(event)}>
                  <fieldset
                    disabled={isSaving}
                    className="m-0 flex flex-col gap-4 border-0 p-0"
                  >
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Nama teknologi
                      <input
                        required
                        maxLength={100}
                        value={technologyValue.name}
                        onChange={(event) =>
                          setTechnologyValue((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Slug
                      <input
                        required
                        maxLength={100}
                        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                        value={technologyValue.slug}
                        onChange={(event) =>
                          setTechnologyValue((current) => ({
                            ...current,
                            slug: event.target.value,
                          }))
                        }
                        placeholder="contoh: next-js"
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Ikon (nama Material Symbol)
                      <input
                        maxLength={100}
                        value={technologyValue.icon}
                        onChange={(event) =>
                          setTechnologyValue((current) => ({
                            ...current,
                            icon: event.target.value,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-[#18181a]">
                      Warna
                      <input
                        type="color"
                        value={technologyValue.color}
                        onChange={(event) =>
                          setTechnologyValue((current) => ({
                            ...current,
                            color: event.target.value,
                          }))
                        }
                        className="size-11 cursor-pointer rounded-md border border-neutral-300 bg-white p-1"
                      />
                      <span className="font-mono text-xs font-normal text-[#52525b]">
                        {technologyValue.color}
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={isSaving || isLoading}
                      className="primary-button min-h-11 self-start"
                    >
                      {isSaving ? "Menyimpan..." : "Simpan teknologi"}
                    </button>
                  </fieldset>
                </form>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
