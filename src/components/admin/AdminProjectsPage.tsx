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
import { AdminHeader, AdminSidebar } from "./AdminShell";
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
  const [advanced, setAdvanced] = useState({ gallery: "[]", contentBlocks: "[]", links: "[]" });
  const reorderEnabled = filter === "all" && !query.trim() && !isSubmitting && !isLoading;

  async function reorder(from: number, to: number) {
    if (!reorderEnabled || from === to) return;
    const next = moveBlock(projects, from, to);
    setIsSubmitting(true); setError("");
    try {
      const result = await reorderProjectsAction(next.map((project) => project.id));
      if (!result.ok) setError(result.message);
      else { setProjects(next); setStatus("Urutan proyek publik diperbarui."); }
    } catch { setError("Urutan tidak dapat disimpan."); }
    finally { setIsSubmitting(false); }
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
                : "Kategori dan teknologi tidak dapat dimuat.",
          );
          return;
        }
        setCategories(z.array(categoryRecordSchema).parse(categoryResult.data));
        setTechnologies(
          z.array(technologyRecordSchema).parse(technologyResult.data),
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
    setAdvanced({ gallery: JSON.stringify(project.gallery, null, 2), contentBlocks: JSON.stringify(project.contentBlocks, null, 2), links: JSON.stringify(project.links, null, 2) });
    setVersions([]);
    void listProjectVersionsAction({ id: project.id, limit: 30, offset: 0 }).then((result) => { if (result.ok) setVersions(result.data); else setError(result.message); }).catch(() => setError("Riwayat versi tidak dapat dimuat."));
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
    try { content = { gallery: JSON.parse(advanced.gallery), contentBlocks: JSON.parse(advanced.contentBlocks), links: JSON.parse(advanced.links) }; }
    catch { setError("Periksa JSON galeri, blok konten, dan tautan."); return; }
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
            "Draft tersimpan. Lengkapi syarat publikasi lalu terbitkan kembali.",
          );
          setEditingId(saved.data);
          setReloadKey((current) => current + 1);
          return;
        }
      }
      setStatus(
        publish
          ? "Proyek berhasil disimpan dan diterbitkan."
          : "Draft proyek berhasil disimpan.",
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
        trashed ? "Proyek dipindahkan ke Trash." : "Proyek dipulihkan sebagai draft.",
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
    checked: boolean,
  ) {
    setValue((current) => ({
      ...current,
      [key]: checked
        ? [...current[key], id]
        : current[key].filter((valueId) => valueId !== id),
    }));
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
                  Proyek Showcase
                </span>
              </nav>
              <h1 className="m-0 text-2xl font-semibold tracking-[-.5px] text-[#18181a]">
                Katalog Portofolio & Studi Kasus
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-5 text-[#52525b]">
                Proyek publik dibaca langsung dari status terbit. Menyimpan
                perubahan menjadikannya draft sampai diterbitkan kembali.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/media" className="secondary-button min-h-11">
                Media Library
              </Link>
              <Link
                href="/proyek"
                target="_blank"
                className="secondary-button min-h-11"
              >
                Lihat katalog publik
              </Link>
              <button
                type="button"
                onClick={startNewProject}
                className="primary-button min-h-11"
              >
                Tambah proyek
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
          {referenceError ? (
            <p role="alert" className="mb-4 text-sm text-amber-800">
              {referenceError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)]">
            <section
              aria-labelledby="project-list-title"
              className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <h2
                  id="project-list-title"
                  className="m-0 text-lg font-semibold text-[#18181a]"
                >
                  Daftar proyek
                </h2>
                <button
                  type="button"
                  onClick={() => setReloadKey((current) => current + 1)}
                  disabled={isLoading || isSubmitting}
                  className="secondary-button min-h-10"
                >
                  Muat ulang
                </button>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-[#52525b]">
                  Cari proyek
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Judul, slug, atau tagline"
                    className="min-h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-[#18181a]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-[#52525b]">
                  Tampilan
                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as ProjectFilter)
                    }
                    className="min-h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-[#18181a]"
                  >
                    <option value="all">Semua proyek</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="trash">Trash</option>
                  </select>
                </label>
              </div>

              {isLoading ? (
                <p role="status" className="text-sm text-[#52525b]">
                  Memuat proyek...
                </p>
              ) : projects.length ? (
                <ul className="m-0 list-none divide-y divide-neutral-200 p-0">
                  {projects.map((project, index) => (
                    <li
                      key={project.id}
                      draggable={reorderEnabled}
                      onDragStart={() => setDragging(index)}
                      onDragEnd={() => setDragging(null)}
                      onDragOver={(event) => { if (reorderEnabled) event.preventDefault(); }}
                      onDrop={(event) => { event.preventDefault(); if (dragging !== null) void reorder(dragging, index); setDragging(null); }}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="m-0 text-sm font-semibold text-[#18181a]">
                            {project.title}
                          </h3>
                          <span
                            className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                              project.deletedAt
                                ? "bg-[#f0f0f0] text-[#52525b]"
                                : project.status === "published"
                                  ? "bg-[#e8efd8] text-[#3f5212]"
                                  : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {project.deletedAt
                              ? "Trash"
                              : project.status === "published"
                                ? "Published"
                                : "Draft"}
                          </span>
                        </div>
                        <p className="mb-0 mt-1 break-all text-xs text-[#71717a]">
                          /proyek/{project.slug}
                        </p>
                        <p className="mb-0 mt-2 text-xs leading-5 text-[#52525b]">
                          {project.tagline || "Belum ada tagline."}
                        </p>
                        {project.publishedAt && !project.deletedAt ? (
                          <p className="mb-0 mt-1 text-[11px] text-[#71717a]">
                            Terbit {dateWib(project.publishedAt)}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {filter === "all" && !query.trim() ? <><button type="button" disabled={!reorderEnabled || index === 0} aria-label={`Naikkan proyek ${project.title}`} className="secondary-button min-h-11" onClick={() => void reorder(index, index - 1)}>Naik</button><button type="button" disabled={!reorderEnabled || index === projects.length - 1} aria-label={`Turunkan proyek ${project.title}`} className="secondary-button min-h-11" onClick={() => void reorder(index, index + 1)}>Turun</button></> : null}
                        {project.deletedAt ? (
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void setTrash(project, false)}
                            className="secondary-button min-h-10"
                          >
                            Pulihkan
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => editProject(project)}
                              className="secondary-button min-h-10"
                            >
                              Ubah
                            </button>
                            {project.status === "published" ? (
                              <Link
                                href={`/proyek/${encodeURIComponent(project.slug)}`}
                                target="_blank"
                                className="secondary-button min-h-10"
                              >
                                Buka publik
                              </Link>
                            ) : (
                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                  editProject(project);
                                }}
                                className="primary-button min-h-10"
                              >
                                Edit draft
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => void setTrash(project, true)}
                              className="secondary-button min-h-10 text-red-700"
                            >
                              Trash
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl bg-[#f9f9f9] p-4 text-sm text-[#52525b]">
                  Tidak ada proyek pada filter ini.
                </p>
              )}
            </section>

            <section
              aria-labelledby="project-editor-title"
              className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <h2
                  id="project-editor-title"
                  className="m-0 text-lg font-semibold text-[#18181a]"
                >
                  {editingId ? "Ubah proyek" : "Proyek baru"}
                </h2>
                {editingId ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={startNewProject}
                    className="text-xs font-medium text-[#52525b] underline underline-offset-4"
                  >
                    Batalkan edit
                  </button>
                ) : null}
              </div>
              <p className="mb-5 mt-2 text-xs leading-5 text-[#71717a]">
                Simpan draft untuk meninjau perubahan sebelum menerbitkannya.
              </p>
              <form
                ref={editorForm}
                onSubmit={submitDraft}
                className="flex flex-col gap-4"
              >
                <fieldset
                  disabled={isSubmitting || (filter === "trash" && !!editingId)}
                  className="m-0 flex flex-col gap-4 border-0 p-0"
                >
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Judul proyek
                    <input
                      required
                      maxLength={250}
                      value={value.title}
                      onChange={(event) =>
                        setValue((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Slug
                    <input
                      maxLength={120}
                      value={value.slug}
                      onChange={(event) =>
                        setValue((current) => ({
                          ...current,
                          slug: event.target.value,
                        }))
                      }
                      placeholder="Otomatis dari judul jika kosong"
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Tagline
                    <input
                      maxLength={500}
                      value={value.tagline}
                      onChange={(event) =>
                        setValue((current) => ({
                          ...current,
                          tagline: event.target.value,
                        }))
                      }
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Klien
                      <input
                        maxLength={250}
                        value={value.clientName ?? ""}
                        onChange={(event) =>
                          setValue((current) => ({
                            ...current,
                            clientName: event.target.value || null,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                      Tahun
                      <input
                        type="number"
                        min={1900}
                        max={2200}
                        value={value.year ?? ""}
                        onChange={(event) =>
                          setValue((current) => ({
                            ...current,
                            year: event.target.value
                              ? Number(event.target.value)
                              : null,
                          }))
                        }
                        className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Ringkasan
                    <textarea
                      rows={4}
                      maxLength={4000}
                      value={value.summary}
                      onChange={(event) =>
                        setValue((current) => ({
                          ...current,
                          summary: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <div className="flex flex-col gap-2 text-sm font-medium text-[#18181a]">
                    <span>Gambar utama</span>
                    {selectedMedia ? (
                      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-[#f9f9f9] p-2">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[#f0f0f0]">
                          <Image
                            src={selectedMedia.urls.thumb}
                            alt={selectedMedia.alt || selectedMedia.filename}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="m-0 truncate text-sm font-medium text-[#18181a]">
                            {selectedMedia.filename}
                          </p>
                          <p className="m-0 mt-1 text-xs font-normal text-[#52525b]">
                            {selectedMedia.width} × {selectedMedia.height} px
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => {
                            setSelectedMedia(null);
                            setValue((current) => ({
                              ...current,
                              featuredImageId: null,
                            }));
                          }}
                          className="min-h-11 px-3 text-xs font-medium text-[#52525b] underline underline-offset-4"
                        >
                          Hapus pilihan
                        </button>
                      </div>
                    ) : value.featuredImageId ? (
                      <p className="m-0 break-all text-xs font-normal text-[#52525b]">
                        Media tersimpan: {value.featuredImageId}
                      </p>
                    ) : (
                      <p className="m-0 text-xs font-normal text-[#71717a]">
                        Belum ada gambar utama yang dipilih.
                      </p>
                    )}
                    <p className="m-0 text-xs font-normal leading-5 text-[#52525b]">
                      Pilih aset final dari Media Library. Media yang masih
                      diproses atau sudah dihapus tidak ditampilkan.
                    </p>
                    <button
                      type="button"
                      aria-expanded={isMediaPickerOpen}
                      aria-controls="featured-media-picker"
                      disabled={isSubmitting || isLoadingMedia}
                      onClick={toggleMediaPicker}
                      className="secondary-button min-h-11 w-fit"
                    >
                      {isLoadingMedia
                        ? "Memuat media..."
                        : isMediaPickerOpen
                          ? "Tutup pilihan media"
                          : "Pilih dari Media Library"}
                    </button>
                    {isMediaPickerOpen ? (
                      <div
                        id="featured-media-picker"
                        className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-[#f9f9f9] p-3"
                      >
                        <div
                          role="search"
                          className="flex flex-col gap-2 sm:flex-row"
                        >
                          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-[#52525b]">
                            Cari nama berkas atau teks alternatif
                            <input
                              type="search"
                              value={mediaQuery}
                              onChange={(event) =>
                                setMediaQuery(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void loadMedia(mediaQuery, 0, false);
                                }
                              }}
                              className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-[#18181a]"
                            />
                          </label>
                          <button
                            type="button"
                            disabled={isLoadingMedia}
                            onClick={() =>
                              void loadMedia(mediaQuery, 0, false)
                            }
                            className="secondary-button min-h-11 self-end"
                          >
                            Cari media
                          </button>
                        </div>
                        {mediaError ? (
                          <p role="alert" className="m-0 text-xs text-red-700">
                            {mediaError}
                          </p>
                        ) : null}
                        {isLoadingMedia ? (
                          <p role="status" className="m-0 text-xs text-[#52525b]">
                            Memuat aset media...
                          </p>
                        ) : mediaAssets.length ? (
                          <ul className="m-0 grid max-h-80 list-none grid-cols-1 gap-2 overflow-y-auto p-0 sm:grid-cols-2">
                            {mediaAssets.map((asset) => (
                              <li key={asset.id}>
                                <button
                                  type="button"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    setSelectedMedia(asset);
                                    setValue((current) => ({
                                      ...current,
                                      featuredImageId: asset.id,
                                    }));
                                    setIsMediaPickerOpen(false);
                                  }}
                                  className="flex min-h-16 w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 text-left hover:border-[#586016] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                                >
                                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#f0f0f0]">
                                    <Image
                                      src={asset.urls.thumb}
                                      alt=""
                                      fill
                                      unoptimized
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-xs font-medium text-[#18181a]">
                                      {asset.filename}
                                    </span>
                                    <span className="mt-1 block truncate text-[11px] font-normal text-[#52525b]">
                                      {asset.alt || "Tanpa teks alternatif"}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="m-0 rounded-lg bg-white p-3 text-xs text-[#52525b]">
                            Belum ada media final yang cocok. Upload dan
                            finalisasi aset melalui Media Library terlebih
                            dahulu.
                          </p>
                        )}
                        {hasMoreMedia && !isLoadingMedia ? (
                          <button
                            type="button"
                            onClick={() =>
                              void loadMedia(mediaQuery, mediaAssets.length, true)
                            }
                            className="secondary-button min-h-11 self-start"
                          >
                            Muat media berikutnya
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <label className="flex min-h-10 items-center gap-2 text-sm text-[#18181a]">
                    <input
                      type="checkbox"
                      checked={value.isFeatured}
                      onChange={(event) =>
                        setValue((current) => ({
                          ...current,
                          isFeatured: event.target.checked,
                        }))
                      }
                      className="size-4 accent-[#586016]"
                    />
                    Tandai sebagai proyek unggulan
                  </label>
                  <fieldset className="m-0 rounded-lg border border-neutral-200 p-3">
                    <legend className="px-1 text-sm font-medium text-[#18181a]">
                      Kategori proyek
                    </legend>
                    {categories.length ? (
                      <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center gap-2 text-xs text-[#52525b]"
                          >
                            <input
                              type="checkbox"
                              checked={value.categoryIds.includes(category.id)}
                              onChange={(event) =>
                                toggleId(
                                  "categoryIds",
                                  category.id,
                                  event.target.checked,
                                )
                              }
                              className="size-4 accent-[#586016]"
                            />
                            {category.name}
                            {!category.isActive ? " (nonaktif)" : ""}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="m-0 text-xs text-[#71717a]">
                        {isLoadingReferences
                          ? "Memuat kategori..."
                          : "Belum ada kategori."}
                      </p>
                    )}
                  </fieldset>
                  <fieldset className="m-0 rounded-lg border border-neutral-200 p-3">
                    <legend className="px-1 text-sm font-medium text-[#18181a]">
                      Teknologi
                    </legend>
                    {technologies.length ? (
                      <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                        {technologies.map((technology) => (
                          <label
                            key={technology.id}
                            className="flex items-center gap-2 text-xs text-[#52525b]"
                          >
                            <input
                              type="checkbox"
                              checked={value.technologyIds.includes(technology.id)}
                              onChange={(event) =>
                                toggleId(
                                  "technologyIds",
                                  technology.id,
                                  event.target.checked,
                                )
                              }
                              className="size-4 accent-[#586016]"
                            />
                            {technology.name}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="m-0 text-xs text-[#71717a]">
                        {isLoadingReferences
                          ? "Memuat teknologi..."
                          : "Belum ada teknologi."}
                      </p>
                    )}
                  </fieldset>
                </fieldset>
                <details><summary className="cursor-pointer py-3 text-sm">Galeri, studi kasus, dan tautan</summary><div className="grid gap-3">{(["gallery", "contentBlocks", "links"] as const).map((key) => <label key={key} className="field">{{ gallery: "Galeri (JSON mediaId dan alt)", contentBlocks: "Blok studi kasus (JSON)", links: "Tautan proyek (JSON label, type, url HTTPS)" }[key]}<textarea rows={8} spellCheck={false} value={advanced[key]} onChange={(event) => setAdvanced((current) => ({ ...current, [key]: event.target.value }))} /></label>)}</div></details>
                {editingId ? <div className="grid gap-3"><a className="secondary-button min-h-11" href={`/admin/preview/proyek/${editingId}`} target="_blank" rel="noreferrer">Preview draft tersimpan</a>{versions.length ? <details><summary className="cursor-pointer py-3 text-sm">Riwayat versi</summary><ul className="grid list-none gap-2 p-0">{versions.map((version) => <li key={version.id} className="flex flex-wrap items-center justify-between gap-2"><span>v{version.version} · {version.changeType}</span><button type="button" className="secondary-button min-h-11" disabled={isSubmitting} onClick={async () => { if (!window.confirm(`Pulihkan versi ${version.version}?`)) return; setIsSubmitting(true); try { const result = await restoreProjectVersionAction({ id: editingId, version: version.version }); if (!result.ok) setError(result.message); else { startNewProject(); setReloadKey((key) => key + 1); setStatus("Versi dipulihkan sebagai draft. Buka kembali proyek untuk mengedit."); } } catch { setError("Versi tidak dapat dipulihkan."); } finally { setIsSubmitting(false); } }}>Pulihkan versi {version.version}</button></li>)}</ul></details> : null}</div> : null}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingReferences}
                    className="secondary-button min-h-11"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan sebagai draft"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || isLoadingReferences}
                    onClick={() => {
                      if (!editorForm.current?.reportValidity()) return;
                      void save(true);
                    }}
                    className="primary-button min-h-11"
                  >
                    Simpan & terbitkan
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
