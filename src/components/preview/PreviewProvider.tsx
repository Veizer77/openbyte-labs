"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface PreviewActions {
  open: (label: string, onConfirm?: (value: string) => void) => void;
  notify: (message: string) => void;
}
const Context = createContext<PreviewActions | null>(null);
export const usePreview = () => {
  const value = useContext(Context);
  if (!value) throw new Error("PreviewProvider tidak ditemukan.");
  return value;
};

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const previewUiEnabled = process.env.NODE_ENV === "development";
  const dialog = useRef<HTMLDialogElement>(null);
  const [action, setAction] = useState("");
  const confirm = useRef<((value: string) => void) | undefined>(undefined);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 5500);
  }, []);
  const open = useCallback(
    (label: string, onConfirm?: (value: string) => void) => {
      if (!previewUiEnabled) return;
      setAction(label);
      confirm.current = onConfirm;
      dialog.current?.showModal();
    },
    [previewUiEnabled],
  );
  const destructive = /hapus|delete|trash|buang/i.test(action);
  const editing = /tambah|buat|edit|ubah|baru|duplicate|duplikat/i.test(action);
  return (
    <Context value={{ open, notify }}>
      {children}
      {previewUiEnabled ? <dialog
        ref={dialog}
        className={`ui-dialog transition-all ${
          editing ? "!max-w-[760px] !w-[min(760px,calc(100vw-32px))]" : ""
        }`}
        aria-labelledby="preview-dialog-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <form
          method="dialog"
          key={action}
          onSubmit={(event) => {
            const submitter = (event.nativeEvent as SubmitEvent)
              .submitter as HTMLButtonElement | null;
            if (submitter?.value === "cancel") return;
            const data = new FormData(event.currentTarget);
            confirm.current?.(String(data.get("title") ?? ""));
            notify(
              destructive
                ? "Aksi hapus diterapkan pada preview lokal. Tidak ada perubahan di server."
                : "Perubahan preview diterapkan pada sesi ini. Belum disimpan ke server.",
            );
          }}
        >
          <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#f0f0f0]">
            <div>
              <h2 id="preview-dialog-title" className="text-lg font-semibold text-[#18181a]">
                {action}
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5 m-0">
                {destructive
                  ? "Hapus data contoh ini dari preview lokal."
                  : editing
                    ? "Kelola spesifikasi dan konten formulir modul terkait."
                    : "Informasi dialog operasional sistem."}
              </p>
            </div>
            <button
              type="submit"
              value="cancel"
              aria-label="Tutup dialog"
              className="symbol text-xl text-[#71717a] hover:text-[#18181a] p-1 rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              close
            </button>
          </div>

          {editing ? (
            <div className="flex flex-col gap-4 my-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Form Spesifik: Proyek / Portofolio / Showcase */}
              {/portofolio|proyek|showcase/i.test(action) ? (
                <>
                  <div className="p-3 bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl flex items-center gap-2 text-xs text-[#52525b]">
                    <span className="symbol text-base text-[#18181a]">folder_special</span>
                    <span className="font-semibold text-[#18181a]">Formulir Proyek Portofolio:</span>
                    <span>Lengkapi kategori, teknologi, aset gambar, tautan, dan blok studi kasus.</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Judul / Nama Proyek *
                      <input
                        name="title"
                        required
                        autoComplete="off"
                        defaultValue={action.includes("Edit") ? "Proyek Contoh" : ""}
                        placeholder="Contoh: Sistem Informasi"
                      />
                    </label>
                    <label className="field">
                      Slug URL *
                      <div className="flex items-center rounded-xl bg-[#f0f0f0] px-3 py-2 text-sm text-[#52525b]">
                        <span className="text-[#a1a1aa] mr-1 select-none text-xs">openbyte.id/proyek/</span>
                        <input
                          name="slug"
                          className="!bg-transparent !p-0 !text-sm text-[#18181a] font-medium w-full outline-none"
                          defaultValue={action.includes("Edit") ? "proyek-contoh" : ""}
                          placeholder="proyek-contoh"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className="field">
                      Kategori Modul
                      <select name="category" defaultValue="Belum diverifikasi">
                        <option>Belum diverifikasi</option>
                        <option>Aplikasi Mobile</option>
                        <option>Bisnis & UMKM</option>
                        <option>Sistem Informasi & Web</option>
                        <option>Undangan Digital & Event</option>
                      </select>
                    </label>
                    <label className="field">
                      Klien / Lembaga Mitra
                      <input
                        name="client"
                        placeholder="cth. Organisasi Anda"
                        defaultValue=""
                      />
                    </label>
                    <label className="field">
                      Status Tayang
                      <select name="status" defaultValue="Draft">
                        <option value="Published">Published (Tampil)</option>
                        <option value="Draft">Draft (Internal)</option>
                        <option value="Archived">Diarsipkan</option>
                      </select>
                    </label>
                  </div>

                  <label className="field">
                    Stack Teknologi Digunakan (pisahkan dengan koma)
                    <input
                      name="tech_stack"
                      placeholder="Cantumkan teknologi yang sudah diverifikasi"
                      defaultValue=""
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {["Teknologi", "Integrasi", "Infrastruktur"].map((chip) => (
                        <span key={chip} className="text-[10px] px-2 py-0.5 rounded-md bg-[#f0f0f0] text-[#52525b] border border-[#e4e4e7]">
                          +{chip}
                        </span>
                      ))}
                    </div>
                  </label>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Gambar Utama / Cover Hero (URL atau Path)
                      <input
                        name="cover_image"
                        placeholder="/images/contoh-proyek.webp"
                        defaultValue=""
                      />
                    </label>
                    <label className="field">
                      Tautan Demo Live / Website
                      <input
                        name="live_url"
                        placeholder="https://example.com"
                        defaultValue=""
                      />
                    </label>
                  </div>

                  <label className="field">
                    Galeri Tangkapan Layar (pisahkan URL per baris)
                    <textarea
                      name="gallery_images"
                      rows={2}
                        placeholder="/images/contoh-proyek.webp"
                        defaultValue=""
                    />
                  </label>

                  {/* Blok Konten Studi Kasus */}
                  <div className="flex flex-col gap-3 pt-2 border-t border-[#f0f0f0]">
                    <span className="text-xs font-semibold text-[#18181a] flex items-center gap-1.5">
                      <span className="symbol text-sm text-[#82b440]">article</span>
                      Blok Konten Studi Kasus & Deliverable
                    </span>

                    <label className="field">
                      1. Ringkasan & Latar Belakang Proyek
                      <textarea
                        name="description"
                        rows={2}
                        placeholder="Uraikan gambaran umum sistem dan tujuan strategis pengembangan..."
                        defaultValue={action.includes("Edit") ? "Contoh deskripsi proyek yang dapat diganti sebelum dipublikasikan." : ""}
                      />
                    </label>

                    <label className="field">
                      2. Tantangan Klien & Batasan Teknis
                      <textarea
                        name="challenges"
                        rows={2}
                        placeholder="Ringkasan tantangan yang telah disetujui untuk publikasi"
                        defaultValue={action.includes("Edit") ? "Draf tantangan proyek; menunggu verifikasi dan persetujuan." : ""}
                      />
                    </label>

                    <label className="field">
                      3. Solusi Arsitektur & Rekayasa
                      <textarea
                        name="solution"
                        rows={2}
                        placeholder="Solusi yang telah diverifikasi dan disetujui untuk publikasi"
                        defaultValue={action.includes("Edit") ? "Draf solusi proyek; menunggu verifikasi dan persetujuan." : ""}
                      />
                    </label>

                    <label className="field">
                      4. Dampak Utama & Metrik Hasil
                      <input
                        name="impact"
                        placeholder="Metrik dan bukti hasil yang telah diverifikasi"
                        defaultValue={action.includes("Edit") ? "Belum ada metrik yang disetujui untuk publikasi." : ""}
                      />
                    </label>
                  </div>
                </>
              ) : /settings|pengaturan|konfigurasi/i.test(action) ? (
                /* Form Spesifik: Pengaturan & Konfigurasi */
                <>
                  <div className="p-3 bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl flex items-center gap-2 text-xs text-[#52525b]">
                    <span className="symbol text-base text-[#18181a]">settings</span>
                    <span className="font-semibold text-[#18181a]">Formulir Pengaturan Sistem:</span>
                    <span>Atur identitas dan konfigurasi yang telah ditinjau.</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Nama Agensi / Brand
                      <input
                        name="title"
                        required
                        defaultValue="OpenByte Labs"
                        placeholder="OpenByte Labs"
                      />
                    </label>
                    <label className="field">
                      Email Resmi DPO (Data Protection Officer)
                      <input
                        name="dpo_email"
                        type="email"
                        defaultValue=""
                        placeholder="nama@domain.example"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Nomor WhatsApp Helpdesk
                      <input
                        name="wa_support"
                        defaultValue=""
                        placeholder="Belum dikonfigurasi"
                      />
                    </label>
                    <label className="field">
                      Durasi Sesi Admin (Menit)
                      <input
                        name="session_timeout"
                        type="number"
                        defaultValue={120}
                        placeholder="120"
                      />
                    </label>
                  </div>

                  <label className="field">
                    Batas Percobaan Login Sebelum Lockout
                    <input
                      name="lockout_threshold"
                      type="number"
                      defaultValue={5}
                      placeholder="5 kali berturut-turut"
                    />
                  </label>

                  <label className="field">
                    Pemberitahuan Cookie & Kebijakan Data
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue="Draf pemberitahuan data. Tinjau tujuan, dasar pemrosesan, retensi, dan kanal permintaan sebelum digunakan."
                    />
                  </label>
                </>
              ) : /layanan|bento/i.test(action) ? (
                /* Form Spesifik: Layanan Bento */
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Nama Layanan *
                      <input
                        name="title"
                        required
                        placeholder="cth. Sistem Informasi & Satu Data"
                      />
                    </label>
                    <label className="field">
                      Ikon Material Symbols
                      <input
                        name="icon"
                        placeholder="terminal, phone_iphone, database, verified"
                        defaultValue="terminal"
                      />
                    </label>
                  </div>

                  <label className="field">
                    Ringkasan Singkat
                    <input
                      name="summary"
                      placeholder="Ringkasan layanan yang telah diverifikasi dan disetujui."
                    />
                  </label>

                  <label className="field">
                    Deskripsi Lengkap
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Rincian solusi yang ditawarkan kepada klien..."
                    />
                  </label>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Investasi Mulai Dari
                      <input name="price" placeholder="Rp 4.500.000" />
                    </label>
                    <label className="field">
                      Status
                      <select name="status" defaultValue="Draft">
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : /paket|addon|harga/i.test(action) ? (
                /* Form Spesifik: Paket Layanan */
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Nama Paket Layanan *
                      <input
                        name="title"
                        required
                        placeholder="cth. Starter UMKM & Bisnis"
                      />
                    </label>
                    <label className="field">
                      Kategori Solusi
                      <select name="category">
                        <option>Web Profil & Bisnis</option>
                        <option>Sistem Informasi / Instansi</option>
                        <option>Mobile App (Flutter)</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className="field">
                      Harga Dasar (Rp)
                      <input name="price" placeholder="2500000" type="number" />
                    </label>
                    <label className="field">
                      Siklus Penagihan
                      <select name="billing">
                        <option>One-time (Sekali Bayar)</option>
                        <option>Bulanan</option>
                        <option>Tahunan</option>
                      </select>
                    </label>
                    <label className="field">
                      Masa Garansi (Hari, jika disepakati)
                      <input name="warranty" defaultValue={0} min={0} type="number" />
                    </label>
                  </div>

                  <label className="field">
                    Daftar Fitur (pisahkan per baris)
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Cantumkan fitur dan kontrol yang telah diverifikasi"
                    />
                  </label>
                </>
              ) : /staf|pengguna|user|admin/i.test(action) ? (
                /* Form Spesifik: Manajemen Staf */
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Nama Lengkap Staf *
                      <input name="title" required placeholder="cth. Admin Contoh" />
                    </label>
                    <label className="field">
                      Email Kredensial *
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="admin@example.invalid"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="field">
                      Peran Akses (RBAC)
                      <select name="role">
                        <option>CMS Superadmin</option>
                        <option>Lead Developer</option>
                        <option>Content Manager</option>
                      </select>
                    </label>
                    <label className="field">
                      Kebijakan Autentikasi 2FA
                      <select name="two_factor">
                        <option>Wajib Aktif (Enforced TOTP)</option>
                        <option>Opsional</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : (
                /* Fallback Form Lengkap */
                <>
                  <label className="field">
                    Judul / Nama *
                    <input
                      name="title"
                      required
                      autoComplete="off"
                      placeholder="Masukkan judul"
                    />
                  </label>
                  <label className="field">
                    Deskripsi / Rincian
                    <textarea name="description" placeholder="Tambahkan rincian keterangan" />
                  </label>
                  <label className="field">
                    Status
                    <select name="status">
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </label>
                </>
              )}
            </div>
          ) : null}

          {!editing && !destructive ? (
            <p className="my-4">
              Aksi ini hanya menampilkan informasi preview; belum tersambung ke penyimpanan.
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f0]">
            <button className="secondary-button" value="cancel">
              Batal
            </button>
            <button className="primary-button" value="confirm">
              {destructive
                ? "Hapus data contoh"
                : editing
                  ? "Terapkan preview"
                  : "Mengerti"}
            </button>
          </div>
        </form>
      </dialog> : null}
      {toast ? (
        <div role="status" className="toast">
          {toast}
        </div>
      ) : null}
    </Context>
  );
}
