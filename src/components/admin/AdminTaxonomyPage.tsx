"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, SearchField, TabFilter, ToolbarButton } from "./AdminUi";
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

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminTaxonomyPage() {
  const [tab, setTab] = useState<TaxonomyTab>("categories");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyRecord[]>([]);
  const [categoryValue, setCategoryValue] = useState<CategoryInput>(newCategory);
  const [technologyValue, setTechnologyValue] =
    useState<TechnologyInput>(newTechnology);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingTechnologyId, setEditingTechnologyId] = useState<string | null>(
    null
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
              : "Data kategori dan teknologi tidak dapat dimuat."
          );
          return;
        }
        setCategories(z.array(categoryRecordSchema).parse(categoryResult.data));
        setTechnologies(
          z.array(technologyRecordSchema).parse(technologyResult.data)
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
    `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const filteredTechnologies = technologies.filter((item) =>
    `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase())
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
        `Hapus kategori “${item.name}”? Kategori yang digunakan paket atau proyek tidak dapat dihapus.`
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
        `Hapus teknologi “${item.name}”? Teknologi yang digunakan proyek tidak dapat dihapus.`
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
    <AdminFrame
      title="Kategori & Teknologi"
      description="Kelola taksonomi untuk filter katalog proyek portofolio dan paket layanan publik."
      screenKey="cms/kategori-teknologi"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton href="/admin/showcase" variant="light" icon="collections">
            Buka Showcase
          </ToolbarButton>
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={isLoading || isSaving}
            onClick={() => setReloadKey((c) => c + 1)}
          >
            Refresh
          </ToolbarButton>
          <ToolbarButton variant="dark" icon="add" onClick={startNew}>
            Item Baru
          </ToolbarButton>
        </div>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Total Kategori</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{categories.length}</div>
        </div>
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Total Teknologi</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{technologies.length}</div>
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

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Left Side: Taxonomy items list */}
        <BentoCard>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Daftar Taksonomi
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Pilih tab untuk mengelola kategori atau teknologi
              </p>
            </div>
            <TabFilter
              tabs={[
                { id: "categories", label: "Kategori", count: categories.length },
                { id: "technologies", label: "Teknologi", count: technologies.length },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>

          <div className="mb-4">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Cari nama atau slug..."
            />
          </div>

          {isLoading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat data taksonomi...</p>
          ) : tab === "categories" ? (
            filteredCategories.length === 0 ? (
              <EmptyState
                icon="category"
                title="Tidak ada kategori"
                description="Kategori tidak ditemukan untuk pencarian ini."
              />
            ) : (
              <div className="grid gap-2">
                {filteredCategories.map((item) => {
                  const isSelected = editingCategoryId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 rounded-[12px] border p-3 transition-all ${
                        isSelected
                          ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                          : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {item.icon ? (
                            <span className="symbol text-base text-[#52525b]">
                              {item.icon}
                            </span>
                          ) : null}
                          <span className="text-xs font-semibold text-[#18181a]">
                            {item.name}
                          </span>
                          <Chip variant={item.isActive ? "success" : "neutral"} size="sm">
                            {item.isActive ? "Aktif" : "Nonaktif"}
                          </Chip>
                          {item.showInFilter ? (
                            <Chip variant="lime" size="sm">
                              Filter
                            </Chip>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-[#71717a] font-mono">
                          {item.slug} · urutan: {item.sortOrder}
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <ToolbarButton
                          variant="light"
                          disabled={isSaving}
                          onClick={() => editCategory(item)}
                        >
                          Ubah
                        </ToolbarButton>
                        <ToolbarButton
                          variant="danger"
                          disabled={isSaving}
                          onClick={() => void removeCategory(item)}
                        >
                          Hapus
                        </ToolbarButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : filteredTechnologies.length === 0 ? (
            <EmptyState
              icon="code"
              title="Tidak ada teknologi"
              description="Teknologi tidak ditemukan untuk pencarian ini."
            />
          ) : (
            <div className="grid gap-2">
              {filteredTechnologies.map((item) => {
                const isSelected = editingTechnologyId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 rounded-[12px] border p-3 transition-all ${
                      isSelected
                        ? "border-[#18181a] bg-[#fafafa] shadow-sm ring-1 ring-[#18181a]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fcfcfc]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        aria-hidden="true"
                        className="size-5 shrink-0 rounded-[6px] border border-neutral-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[#18181a]">
                          {item.name}
                        </span>
                        <div className="text-xs text-[#71717a] font-mono">
                          {item.slug} · {item.color}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <ToolbarButton
                        variant="light"
                        disabled={isSaving}
                        onClick={() => editTechnology(item)}
                      >
                        Ubah
                      </ToolbarButton>
                      <ToolbarButton
                        variant="danger"
                        disabled={isSaving}
                        onClick={() => void removeTechnology(item)}
                      >
                        Hapus
                      </ToolbarButton>
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
                {tab === "categories"
                  ? editingCategoryId
                    ? "Ubah Kategori"
                    : "Tambah Kategori"
                  : editingTechnologyId
                  ? "Ubah Teknologi"
                  : "Tambah Teknologi"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                {tab === "categories"
                  ? "Atur slug, visibilitas filter, dan urutan"
                  : "Atur nama, slug, ikon, dan kode warna"}
              </p>
            </div>
            {editingCategoryId || editingTechnologyId ? (
              <button
                type="button"
                disabled={isSaving}
                onClick={startNew}
                className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
              >
                Batal Edit
              </button>
            ) : null}
          </div>

          {tab === "categories" ? (
            <form onSubmit={(e) => void saveCategory(e)} className="grid gap-3.5">
              <fieldset disabled={isSaving} className="m-0 grid gap-3 border-0 p-0">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nama Kategori
                  <input
                    required
                    maxLength={150}
                    value={categoryValue.name}
                    onChange={(e) =>
                      setCategoryValue((c) => ({ ...c, name: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Contoh: Instansi Pemdes"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Slug URL
                  <input
                    required
                    maxLength={100}
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    value={categoryValue.slug}
                    onChange={(e) =>
                      setCategoryValue((c) => ({ ...c, slug: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="contoh: instansi-pemdes"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Ikon (Material Symbol)
                    <input
                      maxLength={80}
                      value={categoryValue.icon}
                      onChange={(e) =>
                        setCategoryValue((c) => ({ ...c, icon: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="apartment"
                    />
                  </label>

                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Urutan
                    <input
                      type="number"
                      min={0}
                      max={2_147_483_647}
                      value={categoryValue.sortOrder}
                      onChange={(e) =>
                        setCategoryValue((c) => ({
                          ...c,
                          sortOrder: Number(e.target.value),
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                </div>

                <div className="grid gap-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryValue.isActive}
                      onChange={(e) =>
                        setCategoryValue((c) => ({
                          ...c,
                          isActive: e.target.checked,
                        }))
                      }
                      className="rounded border-[#d4d4d8]"
                    />
                    Kategori Aktif
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryValue.showInFilter}
                      onChange={(e) =>
                        setCategoryValue((c) => ({
                          ...c,
                          showInFilter: e.target.checked,
                        }))
                      }
                      className="rounded border-[#d4d4d8]"
                    />
                    Tampilkan pada Filter Showcase Publik
                  </label>
                </div>
              </fieldset>

              <div className="pt-2">
                <ToolbarButton
                  type="submit"
                  variant="dark"
                  disabled={isSaving || isLoading}
                  className="w-full"
                >
                  {isSaving ? "Menyimpan…" : "Simpan Kategori"}
                </ToolbarButton>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => void saveTechnology(e)} className="grid gap-3.5">
              <fieldset disabled={isSaving} className="m-0 grid gap-3 border-0 p-0">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nama Teknologi
                  <input
                    required
                    maxLength={100}
                    value={technologyValue.name}
                    onChange={(e) =>
                      setTechnologyValue((c) => ({ ...c, name: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Contoh: Next.js"
                  />
                </label>

                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Slug URL
                  <input
                    required
                    maxLength={100}
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    value={technologyValue.slug}
                    onChange={(e) =>
                      setTechnologyValue((c) => ({ ...c, slug: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="contoh: next-js"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Ikon Simbol
                    <input
                      maxLength={100}
                      value={technologyValue.icon}
                      onChange={(e) =>
                        setTechnologyValue((c) => ({ ...c, icon: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="code"
                    />
                  </label>

                  <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                    Warna Badge
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={technologyValue.color}
                        onChange={(e) =>
                          setTechnologyValue((c) => ({ ...c, color: e.target.value }))
                        }
                        className="h-[38px] w-12 cursor-pointer rounded-[8px] border border-[#eaeaea] bg-white p-1"
                      />
                      <span className="font-mono text-xs text-[#52525b]">
                        {technologyValue.color}
                      </span>
                    </div>
                  </label>
                </div>
              </fieldset>

              <div className="pt-2">
                <ToolbarButton
                  type="submit"
                  variant="dark"
                  disabled={isSaving || isLoading}
                  className="w-full"
                >
                  {isSaving ? "Menyimpan…" : "Simpan Teknologi"}
                </ToolbarButton>
              </div>
            </form>
          )}
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
