# Checklist Sebelum Deploy ke Server — HARMONITAS

Dibuat setelah review keamanan 2026-09-03. Kerjakan **semua** poin sebelum aplikasi
diakses publik / instansi. Tanda `⚠️` = berkaitan langsung dengan temuan keamanan.

---

## 1. File `.env` produksi

| Kunci | Nilai wajib | Alasan |
|---|---|---|
| `APP_ENV` | `production` | mengaktifkan `URL::forceScheme('https')` + mematikan mode debug default |
| ⚠️ `APP_DEBUG` | `false` | kalau `true`, exception handler membocorkan stack trace + path file ke browser (`bootstrap/app.php`) |
| `APP_KEY` | hasil `php artisan key:generate` (baru, unik per server) | kunci enkripsi sesi & cookie |
| `APP_URL` | `https://domain-asli` | dipakai untuk redirect OAuth, email, aset |
| ⚠️ `SESSION_SECURE_COOKIE` | `true` | cookie sesi hanya dikirim lewat HTTPS |
| ⚠️ `SESSION_SAME_SITE` | `lax` (jangan `none`) | proteksi CSRF lintas-situs untuk endpoint yang tersisa |
| `SESSION_DRIVER` | `database` atau `redis` | `file` boros I/O di produksi; pastikan tabel `sessions` ada |
| ⚠️ `GOOGLE_OAUTH_INSECURE_TLS` | **kosong / tidak ada** | flag ini hanya berlaku di `local`/`testing`; pastikan tidak terbawa |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | kredensial produksi | jangan pakai kredensial dev |
| `GOOGLE_REDIRECT_URI` | `https://domain-asli/auth/google/callback` | harus terdaftar di Google Cloud Console |
| `MAIL_MAILER` | `smtp` (bukan `log`) | `log` + salah konfigurasi bisa membocorkan tautan reset |
| `LOG_LEVEL` | `warning` atau `error` | jangan `debug` di produksi |

- [ ] `.env` **tidak** ikut ter-commit / ter-upload ke folder publik
- [ ] Jalankan `php artisan config:cache` **setelah** `.env` final (dan ulangi tiap ubah `.env`)

---

## 2. Web server

- [ ] **Document root diarahkan ke folder `public/` saja** — bukan root proyek.
      Kalau tidak, `.env`, `.git/`, `storage/`, `composer.json`, dan
      **`SURAT SELESAI PERDA.docx` / `SURAT SELESAI PERKADA.docx`** bisa diunduh siapa saja.
- [ ] HTTPS aktif dengan sertifikat valid (Let's Encrypt / dll). Redirect HTTP → HTTPS.
- [ ] ⚠️ **`curl.cainfo`** di `php.ini` menunjuk ke `cacert.pem` yang valid
      (unduh dari https://curl.se/ca/cacert.pem). Tanpa ini, login Google **gagal total**
      di produksi karena verifikasi TLS kini selalu aktif (ini disengaja — lihat temuan 3).
      Uji: login Google harus berhasil setelah deploy.
- [ ] Header keamanan dasar di web server / middleware (belum ada di aplikasi):
      `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
      `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`,
      dan idealnya `Content-Security-Policy`.
- [ ] Nonaktifkan directory listing.

---

## 3. Build & dependency

- [ ] `composer install --no-dev --optimize-autoloader`
- [ ] `npm ci && npm run build` — folder `public/build/` **tidak** ikut Git, harus di-build di server
- [ ] `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- [ ] `php artisan storage:link`
- [ ] `composer audit` — cek dependency yang punya kerentanan diketahui

---

## 4. Database & penyimpanan

- [ ] Import `database/schema_harmonitas.sql` ke database produksi
- [ ] User database khusus (bukan `root`), password kuat, hanya akses ke DB `harmonitas`
- [ ] Folder writable oleh web server **hanya**: `storage/`, `bootstrap/cache/`
- [ ] `storage/app/secure_drafts/` dan `storage/app/temp/` ada, writable, **tidak** di dalam `public/`
- [ ] ⚠️ Pastikan **tidak ada** upload yang tersimpan di `storage/app/public/`
      (accessor `Dokumen::file_url` menghasilkan `/storage/...`; kalau file benar-benar
      ada di situ, dokumen rahasia bisa diunduh tanpa cek izin)
- [ ] Izin `storage/logs/` dibatasi (log bisa memuat email pengguna). Aktifkan rotasi log.
- [ ] Backup terjadwal: dump DB + folder `storage/app/secure_drafts/`

---

## 5. Akun & data awal

- [ ] ⚠️ Ganti / hapus password default `password` untuk semua akun demo di
      `database/schema_harmonitas.sql`, atau hapus akun demo sebelum go-live.
      (Pilihan "isi cepat" di halaman login sudah dinonaktifkan — commit `0fe86f0`.)
- [ ] Buat akun admin asli dengan password kuat
- [ ] Daftarkan email Google (@gmail.com) tiap petugas **secara persis** lewat menu Admin
      sebelum mereka mencoba login (sistem tidak membuat akun otomatis)
- [ ] Prosedur offboarding: set status akun → `INACTIVE` (langsung menendang user di request berikutnya)

---

## 6. Bersih-bersih kode (opsional tapi disarankan)

- [ ] Route `GET /error-preview/{status?}` di `routes/web.php` — publik, hanya untuk pratinjau
      desain. Batasi ke `local` atau hapus sebelum produksi.
- [ ] `app/Http/Requests/Auth/RegisterRequest.php` — tampaknya kode mati (tidak ada route
      `/register`). Verifikasi, lalu hapus. Kalau nanti route register dibuka, **wajib**
      cegah user memilih `role` sendiri (BIRO_HUKUM / PIMPINAN = akses baca semua berkas).
- [ ] Perbaiki test suite (`php artisan test`) — 20/23 test Feature gagal karena skema/factory
      lama. Tidak ada jaring pengaman otomatis saat ini.

---

## 7. Verifikasi pasca-deploy (uji manual)

- [ ] Login email/password berhasil; salah password 5× → terkunci sementara
- [ ] Login Google berhasil (membuktikan `curl.cainfo` benar)
- [ ] Buka halaman mana pun yang error → **tidak** muncul stack trace / path file
- [ ] Login sebagai Tim Kerja → tidak bisa mengubah status berkas ke "Selesai" secara manual
      (baik lewat form edit maupun panggilan API langsung) → dapat `403`
- [ ] Generator Surat DOCX (Unduh Word) tetap berfungsi
- [ ] Unduh/pratinjau dokumen rahasia di luar wilayah binaan → `403`
