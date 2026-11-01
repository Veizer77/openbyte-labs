# Bootstrap akun owner

Panduan ini untuk bootstrap **satu akun owner pada database yang sudah dimigrasi**. Perintah ini tidak membuat database, menjalankan migrasi, atau menyiapkan layanan produksi. Target harus disetujui pemilik sebelum dijalankan. Jangan menyimpan password, secret TOTP, recovery code, atau connection string di repository, chat, issue, atau screenshot.

## Prasyarat dan target

- Pastikan database sudah dimigrasi dan target direct-nya memang lingkungan yang dimaksud.
- Atur `DATABASE_URI_DIRECT` (atau alias lama `DATABASE_DIRECT_URL`) pada `.env.local`/`.env` lokal yang diabaikan Git.
- Atur `OWNER_BOOTSTRAP_TARGET` sebagai `host/nama_database` yang disetujui. Nilai ini harus cocok dengan host dan database pada URL direct; skrip hanya menampilkan host/database, bukan kredensial.
- Bootstrap owner selalu memilih koneksi direct dan mengabaikan `TEST_DATABASE_URL`.
- Perintah mewajibkan terminal interaktif, konfirmasi nama database, dan kata kunci `CREATE-OWNER`. Jangan jalankan dari CI atau pipeline.

## Jalankan

```powershell
pnpm owner:create
```

1. Cocokkan host/database yang ditampilkan dengan target yang disetujui, lalu ketik nama database persis.
2. Ketik `CREATE-OWNER` untuk konfirmasi kedua.
3. Masukkan nama, email, dan password melalui prompt lokal. Password tidak dicetak dan harus 12–128 karakter.
4. Selesaikan enrollment TOTP pada aplikasi lokal dengan `DATABASE_URI` pooled yang sesuai, `BETTER_AUTH_SECRET` dan `IP_HASH_SALT` lokal masing-masing minimal 32 karakter, serta `SITE_URL` sesuai origin lokal.
5. Simpan recovery codes di password manager atau media offline yang aman. Keluar dan login kembali untuk memastikan MFA berfungsi.

Bootstrap hanya dapat berhasil sekali pada database tersebut. Jika akun mungkin sudah dibuat, jangan ulangi perintah dan jangan reset sebelum status serta target diperiksa read-only.

## Batas keselamatan

- Jangan gunakan database produksi kecuali pemilik secara eksplisit menyetujui targetnya dan operator mengonfirmasi target serta `CREATE-OWNER` secara manual.
- Jangan menyalin target/kredensial dari dokumen ini ke lingkungan lain. Setiap host, database, dan secret harus datang dari pemilik atau secret manager yang berwenang.
- Jangan menjalankan bootstrap, reset password, atau enrollment MFA atas nama pemilik tanpa persetujuan langsung.
- Bila terjadi kegagalan, pesan driver sengaja dibuat generik agar tidak membocorkan detail koneksi. Periksa konfigurasi lokal tanpa membagikan nilainya.
