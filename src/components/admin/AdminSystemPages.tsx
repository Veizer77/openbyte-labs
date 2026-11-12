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
import { BentoCard, Chip, EmptyState, SearchField, ToolbarButton } from "./AdminUi";

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: "owner" | "editor";
  isActive: boolean;
  resetTwoFactor: boolean;
};
const newUser = (): UserForm => ({
  name: "",
  email: "",
  password: "",
  role: "editor",
  isActive: true,
  resetTwoFactor: false,
});

function dateTime(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

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
      const result = await listAdminUsersAction({
        limit: 100,
        offset: nextOffset,
        query: search,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
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
    void listAdminUsersAction({ limit: 100, offset: 0 })
      .then((result) => {
        if (!active) return;
        if (result.ok) {
          const rows = adminUserRecordSchema.array().parse(result.data);
          setUsers(rows);
          setOffset(0);
          setHasMore(rows.length === 100);
        } else setError(result.message);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Daftar akun admin tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  function edit(user: AdminUserRecord) {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
      resetTwoFactor: false,
    });
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
        ? await updateAdminUserAction({
            id: editing.id,
            value: {
              name: form.name,
              email: form.email,
              role: form.role,
              isActive: form.isActive,
              ...(form.password.trim() ? { password: form.password } : {}),
              ...(form.resetTwoFactor ? { resetTwoFactor: true } : {}),
            },
          })
        : await createAdminUserAction({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setStatus(
        editing
          ? "Akun admin berhasil diperbarui."
          : "Akun dibuat. Pemilik akun harus mengaktifkan MFA saat login pertama."
      );
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
    <AdminFrame
      title="Manajemen Pengguna & Staf"
      description="Kelola hak akses role RBAC dan akun admin internal. Owner terakhir diproteksi oleh sistem."
      screenKey="cms/manajemen-staf"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={loading || busy}
            onClick={() => void load(query, 0)}
          >
            Refresh
          </ToolbarButton>
          <ToolbarButton variant="dark" icon="person_add" onClick={reset}>
            Buat Staf Baru
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
        {/* Left Side: Users Table */}
        <BentoCard>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Daftar Staf &amp; Pengguna
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Total {users.length} staf terdaftar dalam sistem
              </p>
            </div>
            <div className="w-full sm:w-60">
              <SearchField
                value={query}
                onChange={(q) => {
                  setQuery(q);
                  void load(q, 0);
                }}
                placeholder="Cari nama atau email..."
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-xs text-[#71717a] py-8">Memuat pengguna…</p>
          ) : users.length === 0 ? (
            <EmptyState
              icon="badge"
              title="Tidak ada pengguna"
              description="Tidak ditemukan akun staf yang cocok dengan pencarian."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eaeaea] text-[#71717a]">
                    <th className="py-2.5 px-3 font-medium">Staf</th>
                    <th className="py-2.5 px-3 font-medium">Role</th>
                    <th className="py-2.5 px-3 font-medium">MFA 2FA</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#fafafa]">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#18181a]">{user.name}</div>
                        <div className="text-[11px] text-[#71717a]">{user.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <Chip variant={user.role === "owner" ? "dark" : "neutral"} size="sm">
                          {user.role}
                        </Chip>
                      </td>
                      <td className="py-3 px-3">
                        <Chip
                          variant={user.twoFactorEnabled ? "success" : "warning"}
                          size="sm"
                        >
                          {user.twoFactorEnabled ? "2FA Aktif" : "Belum Aktif"}
                        </Chip>
                      </td>
                      <td className="py-3 px-3">
                        <Chip
                          variant={user.isActive ? "lime" : "neutral"}
                          size="sm"
                        >
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </Chip>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <ToolbarButton
                          variant="light"
                          onClick={() => edit(user)}
                        >
                          Edit
                        </ToolbarButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-[#eaeaea] pt-3 text-xs text-[#71717a]">
            <span>
              Menampilkan {offset + (users.length ? 1 : 0)}–{offset + users.length}
            </span>
            <div className="flex gap-2">
              <ToolbarButton
                variant="light"
                disabled={loading || offset === 0}
                onClick={() => void load(query, Math.max(0, offset - 100))}
              >
                Sebelumnya
              </ToolbarButton>
              <ToolbarButton
                variant="light"
                disabled={loading || !hasMore}
                onClick={() => void load(query, offset + 100)}
              >
                Berikutnya
              </ToolbarButton>
            </div>
          </div>
        </BentoCard>

        {/* Right Side: Form Editor */}
        <BentoCard className="sticky top-20">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                {editing ? "Perbarui Akun Staf" : "Buat Akun Staf Baru"}
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                {editing
                  ? "Atur nama, email, role, atau nonaktifkan akun"
                  : "Tambahkan staf baru ke dalam sistem"}
              </p>
            </div>
            {editing ? (
              <button
                type="button"
                disabled={busy}
                onClick={reset}
                className="text-xs font-medium text-[#71717a] hover:text-[#18181a] underline"
              >
                Batal Edit
              </button>
            ) : null}
          </div>

          <form className="grid gap-3.5" onSubmit={(e) => void save(e)}>
            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Nama Lengkap
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Rian Anggoro"
              />
            </label>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Alamat Email
              <input
                required
                type="email"
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="nama@openbytelabs.com"
              />
            </label>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              {editing
                ? "Reset Password (opsional, minimal 12 karakter)"
                : "Password Awal (minimal 12 karakter)"}
              <input
                required={!editing}
                type="password"
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                placeholder={editing ? "Kosongkan bila tidak ingin mengubah password" : ""}
              />
              <span className="text-[11px] text-[#71717a]">
                {editing
                  ? "Isi hanya jika pengguna lupa password dan perlu direset oleh Owner."
                  : "Password sementara untuk aktivasi awal pengguna."}
              </span>
            </label>

            <label className="grid gap-1 text-xs font-medium text-[#52525b]">
              Hak Akses (Role)
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserForm["role"] })
                }
                className={inputClass}
              >
                <option value="editor">Editor Konten (Terbatas)</option>
                <option value="owner">Owner (Hak Akses Penuh)</option>
              </select>
            </label>

            {editing ? (
              <div className="grid gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-[#18181a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="rounded border-[#d4d4d8]"
                  />
                  Akun Aktif (Dapat Login)
                </label>
                {editing.twoFactorEnabled ? (
                  <label className="flex items-center gap-2 text-xs font-medium text-[#b45309] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.resetTwoFactor}
                      onChange={(e) =>
                        setForm({ ...form, resetTwoFactor: e.target.checked })
                      }
                      className="rounded border-[#d4d4d8]"
                    />
                    Reset MFA 2FA (Wajib daftar ulang TOTP saat login berikutnya)
                  </label>
                ) : null}
              </div>
            ) : null}

            <div className="pt-2">
              <ToolbarButton
                type="submit"
                variant="dark"
                disabled={busy}
                className="w-full"
              >
                {busy
                  ? "Menyimpan…"
                  : editing
                  ? "Simpan Perubahan Akun"
                  : "Buat Akun Staf"}
              </ToolbarButton>
            </div>
          </form>
        </BentoCard>
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
      if (!result.ok) {
        setError(result.message);
        return;
      }
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
    void listAuditLogsAction({ limit: 100, offset: 0 })
      .then((result) => {
        if (!active) return;
        if (result.ok) {
          const rows = auditLogRecordSchema.array().parse(result.data);
          setLogs(rows);
          setOffset(0);
          setHasMore(rows.length === 100);
        } else setError(result.message);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Log aktivitas tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminFrame
      title="Log Aktivitas & Audit Trail"
      description="Riwayat audit baca-saja. Semua perubahan tersaring otomatis; log tidak dapat diubah atau dihapus."
      screenKey="cms/log-aktivitas-2fa"
      actions={
        <ToolbarButton
          variant="light"
          icon="sync"
          disabled={loading}
          onClick={() => void load(0)}
        >
          Refresh Data
        </ToolbarButton>
      }
    >
      {error ? (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}

      <BentoCard>
        {/* Filter bar */}
        <form
          className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5 border-b border-[#eaeaea] pb-4"
          onSubmit={(e) => {
            e.preventDefault();
            void load(0);
          }}
        >
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Koleksi Dokumen
            <input
              value={collection}
              maxLength={80}
              onChange={(e) => setCollection(e.target.value)}
              placeholder="Contoh: pages, projects"
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Aksi
            <input
              value={action}
              maxLength={80}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Contoh: publish, save"
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Dari Tanggal
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Sampai Tanggal
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex items-end">
            <ToolbarButton type="submit" variant="dark" className="w-full">
              Terapkan Filter
            </ToolbarButton>
          </div>
        </form>

        {loading ? (
          <p className="text-center text-xs text-[#71717a] py-8">Memuat log aktivitas…</p>
        ) : logs.length === 0 ? (
          <EmptyState
            icon="history"
            title="Tidak ada log aktivitas"
            description="Tidak ditemukan riwayat aktivitas sesuai filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#eaeaea] text-[#71717a]">
                  <th className="py-2.5 px-3 font-medium">Waktu (WIB)</th>
                  <th className="py-2.5 px-3 font-medium">Aktor</th>
                  <th className="py-2.5 px-3 font-medium">Aksi</th>
                  <th className="py-2.5 px-3 font-medium">Koleksi</th>
                  <th className="py-2.5 px-3 font-medium">Ringkasan</th>
                  <th className="py-2.5 px-3 font-medium">ID Dokumen</th>
                  <th className="py-2.5 px-3 font-medium">Diff Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0] align-top">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fafafa]">
                    <td className="py-3 px-3 whitespace-nowrap text-[#52525b]">
                      {dateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#18181a]">
                      {log.actorName ?? log.actorEmail ?? log.actorType}
                    </td>
                    <td className="py-3 px-3">
                      <Chip variant="dark" size="sm">
                        {log.action}
                      </Chip>
                    </td>
                    <td className="py-3 px-3">
                      <Chip variant="neutral" size="sm">
                        {log.collection}
                      </Chip>
                    </td>
                    <td className="py-3 px-3 text-[#52525b] max-w-xs">
                      {log.summary}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#71717a] max-w-36 truncate">
                      {log.docId}
                    </td>
                    <td className="py-3 px-3 max-w-64">
                      {log.diff ? (
                        <pre className="m-0 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-[6px] bg-[#f0f0f0] p-2 text-[10px] font-mono text-[#18181a]">
                          {JSON.stringify(log.diff, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-[#71717a]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#eaeaea] pt-3 text-xs text-[#71717a]">
          <span>
            Menampilkan {offset + (logs.length ? 1 : 0)}–{offset + logs.length}
          </span>
          <div className="flex gap-2">
            <ToolbarButton
              variant="light"
              disabled={loading || offset === 0}
              onClick={() => void load(Math.max(0, offset - 100))}
            >
              Sebelumnya
            </ToolbarButton>
            <ToolbarButton
              variant="light"
              disabled={loading || !hasMore}
              onClick={() => void load(offset + 100)}
            >
              Berikutnya
            </ToolbarButton>
          </div>
        </div>
      </BentoCard>
    </AdminFrame>
  );
}
