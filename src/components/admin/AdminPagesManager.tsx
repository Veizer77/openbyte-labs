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
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

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
      const result = await listAdminPagesAction({ limit: 100, offset: 0, trashOnly: trash });
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
    void listAdminPagesAction({ limit: 100, offset: 0, trashOnly: false }).then((result) => {
      if (!active) return;
      if (result.ok) setPages(pageRecordSchema.array().parse(result.data));
      else setError(result.message);
      setLoading(false);
    }).catch(() => {
      if (active) {
        setError("Daftar halaman tidak dapat dimuat.");
        setLoading(false);
      }
    });
    return () => { active = false; };
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
      const result = await listPageVersionsAction({ id: page.id, limit: 30, offset: 0 });
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
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali data halaman.");
      setStatus("");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await savePageAction({ id: editing?.id ?? null, value: parsed.data });
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
    if (busy || !window.confirm(`${trashed ? "Pindahkan" : "Pulihkan"} “${page.title}” ${trashed ? "ke" : "dari"} Trash?`)) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = await setPageTrashAction({ id: page.id, trashed });
      if (!result.ok) setError(result.message);
      else {
        setStatus(trashed ? "Halaman dipindahkan ke Trash." : "Halaman berhasil dipulihkan.");
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
    if (!editing || busy || !window.confirm(`Pulihkan versi ${version.version} untuk halaman ini?`)) return;
    setBusy(true);
    setError("");
    try {
      const result = await restorePageVersionAction({ id: editing.id, version: version.version });
      if (!result.ok) setError(result.message);
      else {
        setStatus(`Versi ${version.version} dipulihkan sebagai draft baru.`);
        const refreshedPages = await loadPages();
        const refreshed = refreshedPages?.find((page) => page.id === editing.id);
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
      description="Kelola halaman dari blok konten terstruktur. Draft, publikasi, Trash, dan riwayat versi memakai data database."
      actions={<><button type="button" className="secondary-button min-h-11" onClick={() => { const next = !trashOnly; setTrashOnly(next); void loadPages(next); }}>{trashOnly ? "Lihat halaman aktif" : "Lihat Trash"}</button><button type="button" className="primary-button min-h-11" onClick={startNew}>Tambah halaman</button></>}
    >
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {status ? <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">{trashOnly ? "Trash" : "Daftar halaman"}</h2>
          {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat halaman…</p> : null}
          {!loading && pages.length === 0 ? <p className="text-sm text-[#71717a]">Tidak ada halaman pada daftar ini.</p> : null}
          <ul className="m-0 grid list-none gap-3 p-0">
            {pages.map((page) => (
              <li key={page.id} className="rounded-xl border border-neutral-200 p-3">
                <button type="button" className="block w-full text-left" onClick={() => void editPage(page)}>
                  <span className="block text-sm font-semibold">{page.title}</span>
                  <span className="mt-1 block text-xs text-[#71717a]">/{page.slug} · {page.status} · urutan {page.sortOrder}</span>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trashOnly ? <button type="button" className="secondary-button min-h-9" disabled={busy} onClick={() => void setTrash(page, false)}>Pulihkan</button> : <><button type="button" className="secondary-button min-h-9" disabled={busy || page.status === "published"} onClick={() => void publish(page)}>Terbitkan</button><button type="button" className="secondary-button min-h-9" disabled={busy} onClick={() => void setTrash(page, true)}>Pindah ke Trash</button></>}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">{editing ? "Edit halaman" : "Halaman baru"}</h2>
          <form className="grid gap-4" onSubmit={(event) => void save(event)}>
            <label className="field">Judul halaman<input required maxLength={250} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <label className="field">Slug URL<input required maxLength={150} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /><span className="text-[11px] font-normal text-[#71717a]">Huruf kecil, angka, dan tanda hubung.</span></label>
            <label className="field">Meta title<input maxLength={250} value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} /></label>
            <label className="field">Meta description<textarea rows={3} maxLength={1000} value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} /></label>
            <label className="field">ID media Open Graph<input value={form.ogImageId} onChange={(event) => setForm({ ...form, ogImageId: event.target.value })} placeholder="UUID media atau kosong" /></label>
            <label className="field">Urutan<input type="number" min={0} value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
            <PageLayoutEditor value={layout} onChange={setLayout} />
             <div className="flex flex-wrap gap-2"><button type="submit" className="primary-button min-h-11" disabled={busy}>{busy ? "Menyimpan…" : "Simpan sebagai draft"}</button>{editing ? <><button type="button" className="secondary-button min-h-11" onClick={() => window.open(`/admin/preview/${encodeURIComponent(editing.slug)}`, "_blank", "noopener,noreferrer")}>Preview tersimpan</button><button type="button" className="secondary-button min-h-11" onClick={startNew}>Batal edit</button></> : null}</div>
          </form>
          {editing && versions.length ? <div className="mt-7 border-t border-neutral-100 pt-5"><h3 className="mb-3 mt-0 text-sm font-semibold">Riwayat versi</h3><ul className="m-0 grid list-none gap-2 p-0">{versions.map((version) => <li key={version.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 p-3"><span className="text-xs">v{version.version} · {version.changeType} · {dateLabel(version.createdAt)}</span><button type="button" className="secondary-button min-h-8" disabled={busy} onClick={() => void restoreVersion(version)}>Pulihkan versi</button></li>)}</ul></div> : null}
        </section>
      </div>
    </AdminFrame>
  );
}
