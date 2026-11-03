"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  listAdminProjectsAction,
  publishProjectAction,
  saveProjectAction,
  setProjectTrashAction,
  reorderProjectsAction,
  listProjectVersionsAction,
  restoreProjectVersionAction,
} from "@/actions/admin/projects";
import { listCategoriesAction } from "@/actions/admin/categories";
import { listTechnologiesAction } from "@/actions/admin/technologies";
import { listMediaAction } from "@/actions/admin/media";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, SearchField, TabFilter, ToolbarButton } from "./AdminUi";
import {
  projectInputSchema,
  projectRecordSchema,
  type ProjectInput,
  type ProjectRecord,
} from "@/schemas/projects";
import {
  categoryRecordSchema,
  type CategoryRecord,
} from "@/schemas/categories";
import {
  technologyRecordSchema,
  type TechnologyRecord,
} from "@/schemas/technologies";
import { dateWib } from "@/lib/format";
import { z } from "zod";
import { mediaAssetSchema, type MediaAsset } from "@/schemas/media";
import { moveBlock } from "@/lib/page-blocks";
import type { ContentVersionRecord } from "@/schemas/content-versions";

type ProjectFilter = "all" | "published" | "draft" | "trash";

function blankProject(): ProjectInput {
  return {
    title: "",
    slug: "",
    tagline: "",
    clientName: null,
    year: null,
    featuredImageId: null,
    gallery: [],
    summary: "",
    contentBlocks: [],
    links: [],
    isFeatured: false,
    categoryIds: [],
    technologyIds: [],
    metaTitle: null,
    metaDescription: null,
    ogImageId: null,
    sortOrder: 0,
  };
}

function inputFromProject(project: ProjectRecord): ProjectInput {
  return projectInputSchema.parse({
    title: project.title,
    slug: project.slug,
    tagline: project.tagline,
    clientName: project.clientName,
    year: project.year,
    featuredImageId: project.featuredImageId,
    gallery: project.gallery,
    summary: project.summary,
    contentBlocks: project.contentBlocks,
    links: project.links,
    isFeatured: project.isFeatured,
    categoryIds: project.categoryIds,
    technologyIds: project.technologyIds,
    metaTitle: project.metaTitle,
    metaDescription: project.metaDescription,
    ogImageId: project.ogImageId,
    sortOrder: project.sortOrder,
  });
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyRecord[]>([]);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState<ProjectInput>(blankProject);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReferences, setIsLoadingReferences] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [status, setStatus] = useState("");
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [mediaQuery, setMediaQuery] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [hasMoreMedia, setHasMoreMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const editorForm = useRef<HTMLFormElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [versions, setVersions] = useState<ContentVersionRecord[]>([]);
  const [advanced, setAdvanced] = useState({
    gallery: "[]",
    contentBlocks: "[]",
    links: "[]",
  });
  const reorderEnabled =
    filter === "all" && !query.trim() && !isSubmitting && !isLoading;

  async function reorder(from: number, to: number) {
    if (!reorderEnabled || from === to) return;
    const next = moveBlock(projects, from, to);
    setIsSubmitting(true);
    setError("");
    try {
      const result = await reorderProjectsAction(
        next.map((project) => project.id)
      );
      if (!result.ok) setError(result.message);
      else {
        setProjects(next);
        setStatus("Urutan proyek publik diperbarui.");
      }
    } catch {
      setError("Urutan tidak dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const options = {
          limit: 100,
          offset: 0,
          ...(filter === "published" || filter === "draft"
            ? { status: filter }
            : {}),
          ...(filter === "trash" ? { trashOnly: true } : {}),
          ...(query.trim() ? { query: query.trim() } : {}),
        };
        const result = await listAdminProjectsAction(options);
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setProjects(z.array(projectRecordSchema).parse(result.data));
      } catch {
        if (active) setError("Daftar proyek tidak dapat dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [filter, query, reloadKey]);

  useEffect(() => {
    let active = true;
    async function loadReferences() {
      setIsLoadingReferences(true);
      setReferenceError("");
      try {
        const [categoryResult, technologyResult] = await Promise.all([
          listCategoriesAction({ limit: 100, offset: 0 }),
          listTechnologiesAction({ limit: 100, offset: 0 }),
        ]);
        if (!active) return;
        if (!categoryResult.ok || !technologyResult.ok) {
          setReferenceError(
            !categoryResult.ok
              ? categoryResult.message
              : !technologyResult.ok
              ? technologyResult.message
              : "Kategori dan teknologi tidak dapat dimuat."
          );
          return;
        }
        setCategories(z.array(categoryRecordSchema).parse(categoryResult.data));
        setTechnologies(
          z.array(technologyRecordSchema).parse(technologyResult.data)
        );
      } catch {
        if (active)
          setReferenceError("Pilihan kategori dan teknologi tidak dapat dimuat.");
      } finally {
        if (active) setIsLoadingReferences(false);
      }
    }
    void loadReferences();
    return () => {
      active = false;
    };
  }, []);

  function startNewProject() {
    setEditingId(null);
    setValue(blankProject());
    setError("");
    setStatus("");
    setSelectedMedia(null);
    setMediaError("");
    setAdvanced({ gallery: "[]", contentBlocks: "[]", links: "[]" });
    setVersions([]);
  }

  function editProject(project: ProjectRecord) {
    setEditingId(project.id);
    setValue(inputFromProject(project));
    setError("");
    setStatus("");
    setSelectedMedia(null);
    setMediaError("");
    setAdvanced({
      gallery: JSON.stringify(project.gallery, null, 2),
      contentBlocks: JSON.stringify(project.contentBlocks, null, 2),
      links: JSON.stringify(project.links, null, 2),
    });
    setVersions([]);
    void listProjectVersionsAction({ id: project.id, limit: 30, offset: 0 })
      .then((result) => {
        if (result.ok) setVersions(result.data);
        else setError(result.message);
      })
      .catch(() => setError("Riwayat versi tidak dapat dimuat."));
  }

  async function loadMedia(query: string, offset: number, append: boolean) {
    if (isLoadingMedia) return;
    setIsLoadingMedia(true);
    setMediaError("");
    try {
      const result = await listMediaAction({
        query: query.trim() || undefined,
        limit: 30,
        offset,
      });
      if (!result.ok) {
        setMediaError(result.message);
        return;
      }
      const assets = z.array(mediaAssetSchema).parse(result.data);
      setMediaAssets((current) => (append ? [...current, ...assets] : assets));
      setHasMoreMedia(assets.length === 30);
    } catch {
      setMediaError("Daftar media tidak dapat dimuat.");
    } finally {
      setIsLoadingMedia(false);
    }
  }

  function toggleMediaPicker() {
    const nextOpen = !isMediaPickerOpen;
    setIsMediaPickerOpen(nextOpen);
    if (nextOpen) void loadMedia(mediaQuery, 0, false);
  }

  async function save(publish = false) {
    if (isSubmitting) return;
    let content;
    try {
      content = {
        gallery: JSON.parse(advanced.gallery),
        contentBlocks: JSON.parse(advanced.contentBlocks),
        links: JSON.parse(advanced.links),
      };
    } catch {
      setError("Periksa JSON galeri, blok konten, dan tautan.");
      return;
    }
    const parsed = projectInputSchema.safeParse({ ...value, ...content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali data proyek.");
      setStatus("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const saved = await saveProjectAction({
        id: editingId,
        value: parsed.data,
      });
      if (!saved.ok) {
        setError(saved.message);
        return;
      }
      if (publish) {
        const published = await publishProjectAction({ id: saved.data });
        if (!published.ok) {
          setError(published.message);
          setStatus(
            "Draft tersimpan. Lengkapi syarat publikasi lalu terbitkan kembali."
          );
          setEditingId(saved.data);
          setReloadKey((current) => current + 1);
          return;
        }
      }
      setStatus(
        publish
          ? "Proyek berhasil disimpan dan diterbitkan."
          : "Draft proyek berhasil disimpan."
      );
      setEditingId(saved.data);
      setReloadKey((current) => current + 1);
    } catch {
      setError("Proyek tidak dapat disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(false);
  }

  async function setTrash(project: ProjectRecord, trashed: boolean) {
    const prompt = trashed
      ? `Pindahkan “${project.title}” ke Trash? Proyek akan langsung hilang dari website publik.`
      : `Pulihkan “${project.title}” dari Trash sebagai draft?`;
    if (isSubmitting || !window.confirm(prompt)) return;
    setIsSubmitting(true);
    setError("");
    setStatus("");
    try {
      const result = await setProjectTrashAction({ id: project.id, trashed });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (editingId === project.id) startNewProject();
      setStatus(
        trashed
          ? "Proyek dipindahkan ke Trash."
          : "Proyek dipulihkan sebagai draft."
      );
      setReloadKey((current) => current + 1);
    } catch {
      setError("Status proyek tidak dapat diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleId(
    key: "categoryIds" | "technologyIds",
    id: string,
    checked: boolean
  ) {
    setValue((current) => ({
      ...current,
      [key]: checked
        ? [...current[key], id]
        : current[key].filter((valueId) => valueId !== id),
    }));
  }

  return (
    <AdminFrame
      title="Katalog Portofolio & Studi Kasus"
      description="Proyek publik dibaca langsung dari status terbit. Menyimpan perubahan menjadikannya draft sampai diterbitkan kembali."
      screenKey="cms/proyek-showcase"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton href="/admin/media" variant="light" icon="perm_media">
            Media Library
          </ToolbarButton>
          <ToolbarButton
            href="/proyek"
            variant="light"
            icon="open_in_new"
          >
            Lihat Publik
          </ToolbarButton>
          <ToolbarButton
            variant="dark"
            icon="add"
            onClick={startNewProject}
          >
            Tambah Proyek
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
      {referenceError ? (
        <div className="mb-4 rounded-[12px] border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-center gap-2">
          <span className="symbol text-base">warning</span>
          <span>{referenceError}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Left Side: Projects List */}
        <BentoCard>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Daftar Proyek Showcase
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Kelola urutan dan publikasi studi kasus portofolio
              </p>
            </div>
            <ToolbarButton
              variant="light"
              icon="sync"
              onClick={() => setReloadKey((c) => c + 1)}
              disabled={isLoading || isSubmitting}
            >
              Refresh
            </ToolbarButton>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-64">
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Cari judul, slug, tagline..."
              />
            </div>
            <TabFilter
              tabs={[
                { id: "all", label: "Semua" },
                { id: "published", label: "Terbit" },
                { id: "draft", label: "Draft" },
                { id: "trash", label: "Trash" },
              ]}
              active={filter}
              onChange={setFilter}
            />
          </div>

          {isLoading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat proyek...</p>
          ) : projects.length === 0 ? (
            <EmptyState
              icon="folder_open"
              title="Tidak ada proyek"
              description="Tidak ditemukan portofolio pada filter atau pencarian ini."
            />
          ) : (
            <div className="grid gap-2.5">
              {projects.map((project, index) => {
                const isSelected = editingId === project.id;
                const statusVariant = project.deletedAt
                  ? "neutral"
                  : project.status === "published"
                  ? "lime"
                  : "warning";

                return (
                  <div
                    key={project.id}
                    draggable={reorderEnabled}
                    onDragStart={() => setDragging(index)}
                    onDragEnd={() => setDragging(null)}
                    onDragOver={(e) => {
                      if (reorderEnabled) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragging !== null) void reorder(dragging, index);
                      setDragging(null);
                    }}
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
                            {project.title}
                          </h3>
                          <Chip variant={statusVariant} size="sm">
                            {project.deletedAt
                              ? "Trash"
                              : project.status === "published"
                              ? "Published"
                              : "Draft"}
                          </Chip>
                          {project.isFeatured ? (
                            <Chip variant="dark" size="sm">
                              Unggulan
                            </Chip>
                          ) : null}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#71717a] font-mono">
                          <span>/proyek/{project.slug}</span>
                          {project.clientName ? (
                            <span>· {project.clientName}</span>
                          ) : null}
                          {project.year ? <span>· {project.year}</span> : null}
                        </div>
                        {project.tagline ? (
                          <p className="m-0 mt-1.5 text-xs text-[#52525b] line-clamp-2">
                            {project.tagline}
                          </p>
                        ) : null}
                        {project.publishedAt && !project.deletedAt ? (
                          <p className="m-0 mt-1 text-[11px] text-[#71717a]">
                            Terbit: {dateWib(project.publishedAt)}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-end sm:self-start">
                        {filter === "all" && !query.trim() ? (
                          <>
                            <button
                              type="button"
                              disabled={!reorderEnabled || index === 0}
                              aria-label={`Naikkan proyek ${project.title}`}
                              className="symbol h-7 w-7 rounded-[6px] bg-[#f0f0f0] text-sm text-[#18181a] hover:bg-[#e4e4e7] disabled:opacity-30"
                              onClick={() => void reorder(index, index - 1)}
                            >
                              arrow_upward
                            </button>
                            <button
                              type="button"
                              disabled={!reorderEnabled || index === projects.length - 1}
                              aria-label={`Turunkan proyek ${project.title}`}
                              className="symbol h-7 w-7 rounded-[6px] bg-[#f0f0f0] text-sm text-[#18181a] hover:bg-[#e4e4e7] disabled:opacity-30"
                              onClick={() => void reorder(index, index + 1)}
                            >
                              arrow_downward
                            </button>
                          </>
                        ) : null}

                        {project.deletedAt ? (
                          <ToolbarButton
                            variant="light"
                            disabled={isSubmitting}
                            onClick={() => void setTrash(project, false)}
                          >
                            Pulihkan
                          </ToolbarButton>
                        ) : (
                          <>
                            <ToolbarButton
                              variant="light"
                              disabled={isSubmitting}
                              onClick={() => editProject(project)}
                            >
                              Ubah
                            </ToolbarButton>
                            {project.status === "published" ? (
                              <ToolbarButton
                                variant="light"
                                href={`/proyek/${encodeURIComponent(project.slug)}`}
                              >
                                Lihat
                              </ToolbarButton>
                            ) : null}
                            <ToolbarButton
                              variant="danger"
                              disabled={isSubmitting}
                              onClick={() => void setTrash(project, true)}
                            >
                              Trash
                            </ToolbarButton>
                          </>
                        )}
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
                {editingId ? "Ubah Proyek" : "Buat Proyek Baru"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Simpan draft atau publikasikan secara langsung
              </p>
            </div>
            {editingId ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={startNewProject}
                className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
              >
                Batal Edit
              </button>
            ) : null}
          </div>

          <form ref={editorForm} onSubmit={submitDraft} className="grid gap-3.5">
            <fieldset
              disabled={isSubmitting || (filter === "trash" && !!editingId)}
              className="m-0 grid gap-3 border-0 p-0"
            >
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Judul Proyek
                <input
                  required
                  maxLength={250}
                  value={value.title}
                  onChange={(e) =>
                    setValue((c) => ({ ...c, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Nama aplikasi, web, atau proyek"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Slug URL
                  <input
                    maxLength={120}
                    value={value.slug}
                    onChange={(e) =>
                      setValue((c) => ({ ...c, slug: e.target.value }))
                    }
                    placeholder="Otomatis dari judul jika kosong"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Tahun Rilis
                  <input
                    type="number"
                    min={1900}
                    max={2200}
                    value={value.year ?? ""}
                    onChange={(e) =>
                      setValue((c) => ({
                        ...c,
                        year: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="Contoh: 2026"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                  Nama Klien
                  <input
                    maxLength={250}
                    value={value.clientName ?? ""}
                    onChange={(e) =>
                      setValue((c) => ({
                        ...c,
                        clientName: e.target.value || null,
                      }))
                    }
                    placeholder="Contoh: Bank BSI / Internal"
                    className={inputClass}
                  />
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    checked={value.isFeatured}
                    onChange={(e) =>
                      setValue((c) => ({ ...c, isFeatured: e.target.checked }))
                    }
                    className="rounded border-[#d4d4d8]"
                  />
                  Tandai Proyek Unggulan
                </label>
              </div>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Tagline Singkat
                <input
                  maxLength={500}
                  value={value.tagline}
                  onChange={(e) =>
                    setValue((c) => ({ ...c, tagline: e.target.value }))
                  }
                  placeholder="Satu kalimat deskripsi utama"
                  className={inputClass}
                />
              </label>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Ringkasan Ringkas
                <textarea
                  rows={3}
                  maxLength={4000}
                  value={value.summary}
                  onChange={(e) =>
                    setValue((c) => ({ ...c, summary: e.target.value }))
                  }
                  className="w-full rounded-[10px] bg-[#f0f0f0] p-3 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                  placeholder="Gambaran umum masalah dan solusi sistem..."
                />
              </label>

              {/* Media Picker */}
              <div className="rounded-[12px] border border-[#eaeaea] bg-[#f9f9f9] p-3">
                <span className="text-xs font-medium text-[#18181a] block mb-2">
                  Gambar Utama Portofolio
                </span>
                {selectedMedia ? (
                  <div className="flex items-center gap-3 rounded-[8px] bg-white p-2 border border-[#eaeaea]">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-[6px] bg-[#f0f0f0]">
                      <Image
                        src={selectedMedia.urls.thumb}
                        alt={selectedMedia.alt || selectedMedia.filename}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="m-0 truncate font-medium text-[#18181a]">
                        {selectedMedia.filename}
                      </p>
                      <p className="m-0 text-[11px] text-[#71717a]">
                        {selectedMedia.width} × {selectedMedia.height} px
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setSelectedMedia(null);
                        setValue((c) => ({ ...c, featuredImageId: null }));
                      }}
                      className="text-xs text-[#ba1a1a] hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ) : value.featuredImageId ? (
                  <p className="m-0 text-xs text-[#52525b] font-mono">
                    ID Media: {value.featuredImageId}
                  </p>
                ) : (
                  <p className="m-0 text-xs text-[#71717a]">
                    Belum ada gambar utama dipilih.
                  </p>
                )}

                <div className="mt-2.5">
                  <ToolbarButton
                    variant="light"
                    icon="image"
                    disabled={isSubmitting || isLoadingMedia}
                    onClick={toggleMediaPicker}
                  >
                    {isLoadingMedia
                      ? "Memuat media..."
                      : isMediaPickerOpen
                      ? "Tutup Pilihan Media"
                      : "Pilih dari Media Library"}
                  </ToolbarButton>
                </div>

                {isMediaPickerOpen ? (
                  <div className="mt-3 rounded-[10px] border border-[#eaeaea] bg-white p-3">
                    <div className="mb-2 flex gap-2">
                      <input
                        type="search"
                        value={mediaQuery}
                        onChange={(e) => setMediaQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void loadMedia(mediaQuery, 0, false);
                          }
                        }}
                        placeholder="Cari berkas..."
                        className="h-8 flex-1 rounded-[6px] bg-[#f0f0f0] px-2.5 text-xs outline-none"
                      />
                      <ToolbarButton
                        variant="light"
                        onClick={() => void loadMedia(mediaQuery, 0, false)}
                      >
                        Cari
                      </ToolbarButton>
                    </div>

                    {mediaError ? (
                      <p className="text-xs text-red-700">{mediaError}</p>
                    ) : null}

                    {mediaAssets.length ? (
                      <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto p-1">
                        {mediaAssets.map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => {
                              setSelectedMedia(asset);
                              setValue((c) => ({
                                ...c,
                                featuredImageId: asset.id,
                              }));
                              setIsMediaPickerOpen(false);
                            }}
                            className="flex items-center gap-2 rounded-[6px] border border-[#eaeaea] p-1.5 text-left hover:border-[#18181a]"
                          >
                            <span className="relative size-8 shrink-0 overflow-hidden rounded bg-[#f0f0f0]">
                              <Image
                                src={asset.urls.thumb}
                                alt=""
                                fill
                                unoptimized
                                sizes="32px"
                                className="object-cover"
                              />
                            </span>
                            <span className="truncate text-[11px] font-medium text-[#18181a]">
                              {asset.filename}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#71717a]">
                        Belum ada aset media.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Taxonomy Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-[10px] border border-[#eaeaea] p-3">
                  <span className="text-xs font-semibold text-[#18181a] block mb-2">
                    Kategori
                  </span>
                  <div className="max-h-32 overflow-y-auto grid gap-1.5">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-xs text-[#52525b] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value.categoryIds.includes(cat.id)}
                          onChange={(e) =>
                            toggleId("categoryIds", cat.id, e.target.checked)
                          }
                          className="rounded border-[#d4d4d8]"
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#eaeaea] p-3">
                  <span className="text-xs font-semibold text-[#18181a] block mb-2">
                    Teknologi
                  </span>
                  <div className="max-h-32 overflow-y-auto grid gap-1.5">
                    {technologies.map((tech) => (
                      <label
                        key={tech.id}
                        className="flex items-center gap-2 text-xs text-[#52525b] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value.technologyIds.includes(tech.id)}
                          onChange={(e) =>
                            toggleId("technologyIds", tech.id, e.target.checked)
                          }
                          className="rounded border-[#d4d4d8]"
                        />
                        {tech.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Advanced JSON details */}
            <details className="rounded-[10px] border border-[#eaeaea] p-3 text-xs bg-[#fcfcfc]">
              <summary className="cursor-pointer font-medium text-[#18181a]">
                Galeri, Studi Kasus, &amp; Tautan (JSON)
              </summary>
              <div className="mt-3 grid gap-2.5">
                {(["gallery", "contentBlocks", "links"] as const).map((key) => (
                  <label key={key} className="grid gap-1 font-medium text-[#52525b]">
                    {{
                      gallery: "Galeri (JSON mediaId & alt)",
                      contentBlocks: "Blok Studi Kasus (JSON)",
                      links: "Tautan Proyek (JSON label, type, url)",
                    }[key]}
                    <textarea
                      rows={4}
                      spellCheck={false}
                      value={advanced[key]}
                      onChange={(e) =>
                        setAdvanced((curr) => ({ ...curr, [key]: e.target.value }))
                      }
                      className="font-mono rounded-[8px] bg-[#f0f0f0] p-2 text-[11px] text-[#18181a] outline-none"
                    />
                  </label>
                ))}
              </div>
            </details>

            {editingId ? (
              <div className="flex flex-col gap-2">
                <a
                  className="inline-flex items-center justify-center gap-1.5 h-[34px] rounded-[10px] border border-[#eaeaea] bg-white text-xs font-medium text-[#18181a] hover:bg-[#f9f9f9]"
                  href={`/admin/preview/proyek/${editingId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="symbol text-base">visibility</span>
                  Preview Draft Tersimpan
                </a>

                {versions.length ? (
                  <details className="rounded-[10px] border border-[#eaeaea] p-2.5 text-xs">
                    <summary className="cursor-pointer font-medium text-[#18181a]">
                      Riwayat Versi ({versions.length})
                    </summary>
                    <div className="mt-2 grid gap-1.5">
                      {versions.map((ver) => (
                        <div
                          key={ver.id}
                          className="flex items-center justify-between gap-2 rounded bg-[#f9f9f9] p-1.5"
                        >
                          <span className="font-mono text-[11px]">
                            v{ver.version} · {ver.changeType}
                          </span>
                          <button
                            type="button"
                            className="text-[11px] font-medium text-[#18181a] underline"
                            disabled={isSubmitting}
                            onClick={async () => {
                              if (!window.confirm(`Pulihkan versi ${ver.version}?`))
                                return;
                              setIsSubmitting(true);
                              try {
                                const res = await restoreProjectVersionAction({
                                  id: editingId,
                                  version: ver.version,
                                });
                                if (!res.ok) setError(res.message);
                                else {
                                  startNewProject();
                                  setReloadKey((k) => k + 1);
                                  setStatus("Versi dipulihkan sebagai draft.");
                                }
                              } catch {
                                setError("Versi tidak dapat dipulihkan.");
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                          >
                            Pulihkan
                          </button>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            ) : null}

            <div className="flex gap-2 pt-2">
              <ToolbarButton
                type="submit"
                variant="light"
                disabled={isSubmitting || isLoadingReferences}
                className="flex-1"
              >
                {isSubmitting ? "Menyimpan…" : "Simpan Draft"}
              </ToolbarButton>
              <ToolbarButton
                type="button"
                variant="dark"
                disabled={isSubmitting || isLoadingReferences}
                onClick={() => {
                  if (!editorForm.current?.reportValidity()) return;
                  void save(true);
                }}
                className="flex-1"
              >
                Simpan &amp; Terbitkan
              </ToolbarButton>
            </div>
          </form>
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
