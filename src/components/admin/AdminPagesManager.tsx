"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  listAdminPagesAction,
  listPageVersionsAction,
  publishPageAction,
  restorePageVersionAction,
  savePageAction,
  setPageTrashAction,
} from "@/actions/admin/pages";
import { pageInputSchema, pageRecordSchema, type PageRecord } from "@/schemas/pages";
import type { ContentVersionRecord } from "@/schemas/content-versions";
import { AdminFrame } from "./AdminFrame";
import { PageLayoutEditor } from "./PageLayoutEditor";
import { BentoCard, Chip, EmptyState, TabFilter, ToolbarButton } from "./AdminUi";

type PageForm = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImageId: string;
  sortOrder: number;
};

const blankPage = (): PageForm => ({
  slug: "",
  title: "",
  metaTitle: "",
  metaDescription: "",
  ogImageId: "",
  sortOrder: 0,
});

function formFromPage(page: PageRecord): PageForm {
  return {
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle ?? "",
    metaDescription: page.metaDescription ?? "",
    ogImageId: page.ogImageId ?? "",
    sortOrder: page.sortOrder,
  };
}

function dateLabel(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminPagesManager() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [editing, setEditing] = useState<PageRecord | null>(null);
  const [form, setForm] = useState<PageForm>(blankPage);
  const [layout, setLayout] = useState("[]");
  const [trashOnly, setTrashOnly] = useState(false);
  const [versions, setVersions] = useState<ContentVersionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadPages(trash = trashOnly): Promise<PageRecord[] | null> {
    setLoading(true);
    setError("");
    try {
      const result = await listAdminPagesAction({
        limit: 100,
        offset: 0,
        trashOnly: trash,
      });
      if (!result.ok) {
        setError(result.message);
        return null;
      }
      const rows = pageRecordSchema.array().parse(result.data);
      setPages(rows);
      return rows;
    } catch {
      setError("Daftar halaman tidak dapat dimuat.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void listAdminPagesAction({ limit: 100, offset: 0, trashOnly: false })
      .then((result) => {
        if (!active) return;
        if (result.ok) setPages(pageRecordSchema.array().parse(result.data));
        else setError(result.message);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Daftar halaman tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  function startNew() {
    setEditing(null);
    setForm(blankPage());
    setLayout("[]");
    setVersions([]);
    setError("");
    setStatus("");
  }

  async function editPage(page: PageRecord) {
    setEditing(page);
    setForm(formFromPage(page));
    setLayout(JSON.stringify(page.layout, null, 2));
    setVersions([]);
    setError("");
    setStatus("");
    try {
      const result = await listPageVersionsAction({
        id: page.id,
        limit: 30,
        offset: 0,
      });
      if (result.ok) setVersions(result.data);
      else setError(result.message);
    } catch {
      setError("Riwayat versi halaman tidak dapat dimuat.");
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    let parsedLayout: unknown;
    try {
      parsedLayout = JSON.parse(layout) as unknown;
    } catch {
      setError("Susunan blok harus berupa JSON yang valid.");
      setStatus("");
      return;
    }
    const parsed = pageInputSchema.safeParse({
      slug: form.slug,
      title: form.title,
      layout: parsedLayout,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      ogImageId: form.ogImageId || null,
      sortOrder: Number(form.sortOrder),
    });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Periksa kembali data halaman."
      );
      setStatus("");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await savePageAction({
        id: editing?.id ?? null,
        value: parsed.data,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus("Draft halaman berhasil disimpan.");
      const refreshedPages = await loadPages();
      const saved = refreshedPages?.find((page) => page.id === result.data);
      if (saved) {
        await editPage(saved);
        setStatus("Draft halaman berhasil disimpan.");
      }
    } catch {
      setError("Halaman tidak dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function publish(page: PageRecord) {
    if (busy || !window.confirm(`Terbitkan halaman “${page.title}”?`)) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await publishPageAction({ id: page.id });
      if (!result.ok) setError(result.message);
      else {
        setStatus("Halaman berhasil diterbitkan.");
        await loadPages();
      }
    } catch {
      setError("Halaman tidak dapat diterbitkan.");
    } finally {
      setBusy(false);
    }
  }

  async function setTrash(page: PageRecord, trashed: boolean) {
    if (
      busy ||
      !window.confirm(
        `${trashed ? "Pindahkan" : "Pulihkan"} “${page.title}” ${
          trashed ? "ke" : "dari"
        } Trash?`
      )
    )
      return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await setPageTrashAction({ id: page.id, trashed });
      if (!result.ok) setError(result.message);
      else {
        setStatus(
          trashed
            ? "Halaman dipindahkan ke Trash."
            : "Halaman berhasil dipulihkan."
        );
        if (editing?.id === page.id) startNew();
        await loadPages();
      }
    } catch {
      setError("Status Trash halaman tidak dapat diperbarui.");
    } finally {
      setBusy(false);
    }
  }

  async function restoreVersion(version: ContentVersionRecord) {
    if (
      !editing ||
      busy ||
      !window.confirm(
        `Pulihkan versi ${version.version} untuk halaman ini?`
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const result = await restorePageVersionAction({
        id: editing.id,
        version: version.version,
      });
      if (!result.ok) setError(result.message);
      else {
        setStatus(`Versi ${version.version} dipulihkan sebagai draft baru.`);
        const refreshedPages = await loadPages();
        const refreshed = refreshedPages?.find(
          (page) => page.id === editing.id
        );
        if (refreshed) await editPage(refreshed);
      }
    } catch {
      setError("Versi halaman tidak dapat dipulihkan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminFrame
      title="Halaman & Page Builder"
      description="Kelola halaman kustom dari blok konten terstruktur. Draft, publikasi, Trash, dan riwayat versi disimpan di database."
      screenKey="cms/halaman-builder"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={loading || busy}
            onClick={() => void loadPages()}
          >
            Refresh
          </ToolbarButton>
          <ToolbarButton variant="dark" icon="add" onClick={startNew}>
            Tambah Halaman
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

      <div className="grid items-start gap-5 xl:grid-cols-[1.3fr_1fr]">
        {/* Left Side: Pages List */}
        <BentoCard>
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                {trashOnly ? "Trash Halaman" : "Daftar Halaman Website"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Total {pages.length} halaman terdaftar
              </p>
            </div>
            <TabFilter
              tabs={[
                { id: "active", label: "Aktif" },
                { id: "trash", label: "Trash" },
              ]}
              active={trashOnly ? "trash" : "active"}
              onChange={(tab) => {
                const nextTrash = tab === "trash";
                setTrashOnly(nextTrash);
                void loadPages(nextTrash);
              }}
            />
          </div>

          {loading ? (
            <p className="py-8 text-center text-xs text-[#71717a]">
              Memuat halaman…
            </p>
          ) : pages.length === 0 ? (
            <EmptyState
              icon="layers"
              title="Tidak ada halaman"
              description={
                trashOnly
                  ? "Trash kosong. Tidak ada halaman terhapus."
                  : "Belum ada halaman. Tambahkan halaman kustom baru."
              }
            />
          ) : (
            <div className="grid gap-2.5">
              {pages.map((page) => {
                const isSelected = editing?.id === page.id;
                const statusVariant =
                  page.status === "published"
                    ? "lime"
                    : page.deletedAt
                    ? "neutral"
                    : "warning";

                return (
                  <div
                    key={page.id}
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
                            {page.title}
                          </h3>
                          <Chip variant={statusVariant} size="sm">
                            {page.status === "published" ? "Published" : "Draft"}
                          </Chip>
                          <span className="font-mono text-xs text-[#71717a]">
                            /{page.slug}
                          </span>
                        </div>
                        <p className="m-0 mt-1 text-xs text-[#71717a]">
                          Urutan: {page.sortOrder} · Modul layout:{" "}
                          {Array.isArray(page.layout) ? page.layout.length : 0} blok
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5 self-end sm:self-start">
                        <ToolbarButton
                          variant="light"
                          disabled={busy}
                          onClick={() => void editPage(page)}
                        >
                          Ubah
                        </ToolbarButton>
                        {trashOnly ? (
                          <ToolbarButton
                            variant="light"
                            disabled={busy}
                            onClick={() => void setTrash(page, false)}
                          >
                            Pulihkan
                          </ToolbarButton>
                        ) : (
                          <>
                            {page.status !== "published" ? (
                              <ToolbarButton
                                variant="dark"
                                disabled={busy}
                                onClick={() => void publish(page)}
                              >
                                Terbitkan
                              </ToolbarButton>
                            ) : null}
                            <ToolbarButton
                              variant="danger"
                              disabled={busy}
                              onClick={() => void setTrash(page, true)}
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
          <div className="mb-4 flex items-center justify-between border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                {editing ? `Edit: ${editing.title}` : "Halaman Baru"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Atur rincian slug, meta tag, dan susunan blok konten
              </p>
            </div>
            {editing ? (
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

          <form className="grid gap-3.5" onSubmit={(event) => void save(event)}>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Judul Halaman
              <input
                required
                maxLength={250}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Tentang Kami"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Slug URL
                <input
                  required
                  maxLength={150}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass}
                  placeholder="tentang-kami"
                />
              </label>

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Urutan Tampil
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </label>
            </div>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Meta Title (SEO)
              <input
                maxLength={250}
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className={inputClass}
                placeholder="Judul untuk tab peramban dan SERP"
              />
            </label>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Meta Description (SEO)
              <textarea
                rows={2}
                maxLength={1000}
                value={form.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
                className="w-full rounded-[10px] bg-[#f0f0f0] p-2.5 text-xs text-[#18181a] outline-none border border-transparent focus:border-[#18181a] resize-y"
                placeholder="Ringkasan konten untuk mesin pencari..."
              />
            </label>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              ID Media Open Graph (UUID gambar preview sosial)
              <input
                value={form.ogImageId}
                onChange={(e) => setForm({ ...form, ogImageId: e.target.value })}
                className={inputClass}
                placeholder="UUID media atau kosongkan"
              />
            </label>

            {/* Layout Block Editor */}
            <div className="pt-2">
              <span className="mb-2 block text-xs font-semibold text-[#18181a]">
                Susunan Blok Konten (Page Builder)
              </span>
              <PageLayoutEditor value={layout} onChange={setLayout} />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <ToolbarButton
                type="submit"
                variant="dark"
                disabled={busy}
                className="flex-1"
              >
                {busy ? "Menyimpan…" : "Simpan Draft Halaman"}
              </ToolbarButton>
              {editing ? (
                <a
                  className="inline-flex items-center justify-center gap-1.5 h-[34px] px-3.5 rounded-[12px] text-[13px] font-medium bg-white border border-[#eaeaea] text-[#18181a] hover:bg-[#f9f9f9]"
                  href={`/admin/preview/${encodeURIComponent(editing.slug)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="symbol text-base">visibility</span>
                  Preview
                </a>
              ) : null}
            </div>
          </form>

          {editing && versions.length ? (
            <details className="mt-4 rounded-[10px] border border-[#eaeaea] p-3 text-xs">
              <summary className="cursor-pointer font-medium text-[#18181a]">
                Riwayat Versi Halaman ({versions.length})
              </summary>
              <div className="mt-2.5 grid gap-2">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between rounded bg-[#f9f9f9] p-2"
                  >
                    <span className="font-mono text-[11px] text-[#52525b]">
                      v{version.version} · {version.changeType} ·{" "}
                      {dateLabel(version.createdAt)}
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void restoreVersion(version)}
                      className="text-xs font-medium text-[#18181a] underline"
                    >
                      Pulihkan
                    </button>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
