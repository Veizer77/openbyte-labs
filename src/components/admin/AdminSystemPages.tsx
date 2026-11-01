"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createAdminUserAction,
  listAdminUsersAction,
  updateAdminUserAction,
} from "@/actions/admin/users";
import { listAuditLogsAction } from "@/actions/admin/audit-logs";
import { adminUserRecordSchema, type AdminUserRecord } from "@/schemas/admin-users";
import { auditLogRecordSchema, type AuditLogRecord } from "@/schemas/audit-logs";
import { AdminFrame } from "./AdminFrame";

type UserForm = { name: string; email: string; password: string; role: "owner" | "editor"; isActive: boolean };
const newUser = (): UserForm => ({ name: "", email: "", password: "", role: "editor", isActive: true });

function dateTime(value: Date) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [editing, setEditing] = useState<AdminUserRecord | null>(null);
  const [form, setForm] = useState<UserForm>(newUser);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function load(search = query, nextOffset = offset) {
    setLoading(true);
    setError("");
    try {
      const result = await listAdminUsersAction({ limit: 100, offset: nextOffset, query: search });
      if (!result.ok) { setError(result.message); return; }
      const rows = adminUserRecordSchema.array().parse(result.data);
      setUsers(rows);
      setHasMore(rows.length === 100);
      setOffset(nextOffset);
    } catch {
      setError("Daftar akun admin tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void listAdminUsersAction({ limit: 100, offset: 0 }).then((result) => {
      if (!active) return;
      if (result.ok) {
        const rows = adminUserRecordSchema.array().parse(result.data);
        setUsers(rows);
        setOffset(0);
        setHasMore(rows.length === 100);
      }
      else setError(result.message);
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Daftar akun admin tidak dapat dimuat."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  function edit(user: AdminUserRecord) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role, isActive: user.isActive });
    setError("");
    setStatus("");
  }

  function reset() {
    setEditing(null);
    setForm(newUser());
    setError("");
    setStatus("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const result = editing
        ? await updateAdminUserAction({ id: editing.id, value: { name: form.name, email: form.email, role: form.role, isActive: form.isActive } })
        : await createAdminUserAction({ name: form.name, email: form.email, password: form.password, role: form.role });
      if (!result.ok) { setError(result.message); return; }
      setStatus(editing ? "Akun admin berhasil diperbarui." : "Akun dibuat. Pastikan pemilik akun menyelesaikan enrollment MFA sebelum menggunakannya.");
      setEditing(null);
      setForm(newUser());
      await load(query, 0);
    } catch {
      setError("Akun admin tidak dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminFrame title="Pengguna & Staf" description="Kelola akun, role, dan status admin. Owner aktif terakhir dilindungi oleh service; MFA tetap diperlukan untuk mengakses panel.">
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      {status ? <p role="status" className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{status}</p> : null}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,.75fr)]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="m-0 text-lg font-semibold">Akun admin</h2><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void load(query); }}><label className="sr-only" htmlFor="admin-user-search">Cari nama atau email</label><input id="admin-user-search" className="min-h-10 rounded-lg border border-neutral-300 px-3 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nama atau email" /><button className="secondary-button min-h-10" type="submit">Cari</button></form></div>
          {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat pengguna…</p> : null}
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr className="border-b border-neutral-200 text-xs text-[#71717a]"><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">MFA</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-neutral-100"><td className="p-3 font-medium">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{user.role}</td><td className="p-3">{user.twoFactorEnabled ? "Aktif" : "Belum aktif"}</td><td className="p-3">{user.isActive ? "Aktif" : "Nonaktif"}</td><td className="p-3"><button type="button" className="secondary-button min-h-8" onClick={() => edit(user)}>Edit</button></td></tr>)}</tbody></table></div>
          <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-[#71717a]">Menampilkan {offset + (users.length ? 1 : 0)}–{offset + users.length}</span><div className="flex gap-2"><button type="button" className="secondary-button min-h-9" disabled={loading || offset === 0} onClick={() => void load(query, Math.max(0, offset - 100))}>Sebelumnya</button><button type="button" className="secondary-button min-h-9" disabled={loading || !hasMore} onClick={() => void load(query, offset + 100)}>Berikutnya</button></div></div>
          {!loading && users.length === 0 ? <p className="mt-4 text-sm text-[#71717a]">Tidak ada akun sesuai pencarian.</p> : null}
        </section>
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 mt-0 text-lg font-semibold">{editing ? "Perbarui akun" : "Buat akun admin"}</h2>
          <form className="grid gap-4" onSubmit={(event) => void save(event)}>
            <label className="field">Nama<input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="field">Email<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            {!editing ? <label className="field">Password awal<input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><span className="text-[11px] font-normal text-[#71717a]">Password hanya dipakai saat pembuatan, tidak ditampilkan kembali.</span></label> : null}
            <label className="field">Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserForm["role"] })}><option value="editor">Editor konten</option><option value="owner">Owner</option></select></label>
            {editing ? <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Akun aktif</label> : null}
            <div className="flex flex-wrap gap-2"><button type="submit" className="primary-button min-h-11" disabled={busy}>{busy ? "Menyimpan…" : editing ? "Simpan perubahan" : "Buat akun"}</button>{editing ? <button type="button" className="secondary-button min-h-11" onClick={reset}>Batal</button> : null}</div>
          </form>
        </section>
      </div>
    </AdminFrame>
  );
}

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [collection, setCollection] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(nextOffset = offset) {
    setLoading(true);
    setError("");
    try {
      const result = await listAuditLogsAction({
        limit: 100,
        offset: nextOffset,
        ...(collection ? { collection } : {}),
        ...(action ? { action } : {}),
        ...(from ? { from: new Date(from).toISOString() } : {}),
        ...(to ? { to: new Date(to).toISOString() } : {}),
      });
      if (!result.ok) { setError(result.message); return; }
      const rows = auditLogRecordSchema.array().parse(result.data);
      setLogs(rows);
      setHasMore(rows.length === 100);
      setOffset(nextOffset);
    } catch {
      setError("Log aktivitas tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void listAuditLogsAction({ limit: 100, offset: 0 }).then((result) => {
      if (!active) return;
      if (result.ok) {
        const rows = auditLogRecordSchema.array().parse(result.data);
        setLogs(rows);
        setOffset(0);
        setHasMore(rows.length === 100);
      }
      else setError(result.message);
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Log aktivitas tidak dapat dimuat."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  return (
    <AdminFrame title="Log Aktivitas" description="Riwayat audit baca-saja. Data diff dibersihkan di service sebelum dikirim ke browser; log tidak bisa diubah atau dihapus dari CMS.">
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5">
        <form className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" onSubmit={(event) => { event.preventDefault(); void load(0); }}>
          <label className="field">Koleksi<input value={collection} maxLength={80} onChange={(event) => setCollection(event.target.value)} placeholder="contoh: pages" /></label>
          <label className="field">Aksi<input value={action} maxLength={80} onChange={(event) => setAction(event.target.value)} placeholder="contoh: publish" /></label>
          <label className="field">Dari<input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label className="field">Sampai<input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <div className="flex items-end"><button type="submit" className="primary-button min-h-11 w-full">Terapkan filter</button></div>
        </form>
        {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat log…</p> : null}
        <div className="overflow-x-auto"><table className="w-full min-w-[920px] border-collapse text-left text-sm"><thead><tr className="border-b border-neutral-200 text-xs text-[#71717a]"><th className="p-3">Waktu</th><th className="p-3">Aktor</th><th className="p-3">Aksi</th><th className="p-3">Koleksi</th><th className="p-3">Ringkasan</th><th className="p-3">ID dokumen</th><th className="p-3">Perubahan tersaring</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-b border-neutral-100 align-top"><td className="whitespace-nowrap p-3">{dateTime(log.createdAt)}</td><td className="p-3">{log.actorName ?? log.actorEmail ?? log.actorType}</td><td className="p-3">{log.action}</td><td className="p-3">{log.collection}</td><td className="p-3">{log.summary}</td><td className="max-w-44 break-all p-3 font-mono text-xs">{log.docId}</td><td className="max-w-72 p-3"><pre className="m-0 max-h-40 overflow-auto whitespace-pre-wrap break-all text-[11px]">{log.diff ? JSON.stringify(log.diff, null, 2) : "—"}</pre></td></tr>)}</tbody></table></div>
        <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-[#71717a]">Menampilkan {offset + (logs.length ? 1 : 0)}–{offset + logs.length}</span><div className="flex gap-2"><button type="button" className="secondary-button min-h-9" disabled={loading || offset === 0} onClick={() => void load(Math.max(0, offset - 100))}>Sebelumnya</button><button type="button" className="secondary-button min-h-9" disabled={loading || !hasMore} onClick={() => void load(offset + 100)}>Berikutnya</button></div></div>
        {!loading && logs.length === 0 ? <p className="mt-4 text-sm text-[#71717a]">Tidak ada log untuk filter ini.</p> : null}
      </section>
    </AdminFrame>
  );
}
