# 🚀 Panduan Hosting HARMONITAS ke Vercel (Lengkap & Siap Pakai)

Dokumen ini berisi panduan lengkap untuk melakukan deployment sementara / produksi aplikasi **HARMONITAS** (Laravel 12 + Inertia React) ke **Vercel**.

---

## 📋 Ringkasan Konfigurasi yang Sudah Dibuat

File-file pendukung deployment Vercel telah disiapkan di root proyek:
1. `vercel.json` &rarr; Menghubungkan runtime `vercel-php@0.7.3`, routing aset statis (`/build/*`, icon, gambar), serta konfigurasi cache & session serverless.
2. `api/index.php` &rarr; Entrypoint serverless function yang otomatis menyiapkan direktori `/tmp` (views, cache, sessions, SQLite).
3. `.vercelignore` &rarr; Mencegah file yang tidak dibutuhkan terunggah ke Vercel.
4. `bootstrap/app.php` &rarr; Dilengkapi `$middleware->trustProxies(at: '*');` untuk HTTPS reverse proxy Vercel.
5. `package.json` &rarr; Dilengkapi skrip `"vercel-build": "vite build"`.

---

## 🛠️ Langkah-Langkah Deployment ke Vercel

### Langkah 1: Push Perubahan Terbaru ke GitHub

Buka terminal di folder proyek Anda dan jalankan:

```bash
# 1. Tambahkan semua file konfigurasi baru
git add .

# 2. Buat commit
git commit -m "feat: konfigurasi vercel serverless runtime untuk laravel inertia"

# 3. Push ke repository GitHub Anda
git push origin main
```

---

### Langkah 2: Hubungkan Repository ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login (disarankan login menggunakan akun GitHub).
2. Klik tombol **"Add New..."** &rarr; **"Project"**.
3. Cari repository **`web_haromintas_test`** lalu klik **"Import"**.
4. Pada form konfigurasi proyek:
   - **Framework Preset**: Pilih **`Other`** (atau biarkan default).
   - **Root Directory**: Biarkan `./`.
   - **Build and Output Settings**: Biarkan default (Vercel akan otomatis membaca `vercel.json` dan `package.json`).

---

### Langkah 3: Isi Environment Variables di Vercel

Sebelum menekan tombol *Deploy*, buka bagian **"Environment Variables"** dan tambahkan variabel berikut:

| Key | Value | Keterangan |
| :--- | :--- | :--- |
| `APP_NAME` | `HARMONITAS` | Nama Aplikasi |
| `APP_ENV` | `production` | Mode Produksi |
| `APP_KEY` | `base64:XEFOrWG/Mu8/bm70FUacJhYHV+kosLzvFSFRe5ExJ4E=` | Kunci enkripsi aplikasi |
| `APP_DEBUG` | `false` | Nonaktifkan debug di prod |
| `APP_URL` | `https://nama-project-anda.vercel.app` | Ganti dengan domain Vercel Anda |
| `SESSION_DRIVER` | `cookie` | Penyimpanan sesi stateless |
| `CACHE_STORE` | `array` | Cache memori serverless |
| `LOG_CHANNEL` | `stderr` | Log streaming ke Vercel dashboard |

> [!TIP]
> **Opsi Database untuk Vercel:**
> - **Opsi 1 (Temporary / Demo)**: Jika tidak mengisi database eksternal, sistem akan otomatis menggunakan **SQLite** di `/tmp/database.sqlite`.
> - **Opsi 2 (Database Cloud Persisten - Sangat Disarankan)**: Anda bisa menggunakan database MySQL / PostgreSQL gratis dari:
>   - **TiDB Cloud Serverless** (Gratis MySQL compatible)
>   - **Aiven MySQL** (Free tier)
>   - **Railway / Supabase**
>   Cukup tambahkan env:
>   - `DB_CONNECTION`: `mysql`
>   - `DB_HOST`: `host-database-cloud.com`
>   - `DB_PORT`: `3306`
>   - `DB_DATABASE`: `nama_database`
>   - `DB_USERNAME`: `username_db`
>   - `DB_PASSWORD`: `password_db`

---

### Langkah 4: Klik Deploy!

1. Klik tombol **"Deploy"**.
2. Tunggu proses build selesai (~1 - 2 menit).
3. Setelah selesai, Vercel akan memberikan URL live website Anda (misal: `https://web-haromintas-test.vercel.app`).

---

## 🔍 Tips & Troubleshooting

1. **Mixed Content / HTTPS Issue**:
   Sudah ditangani secara otomatis melalui `trustProxies(at: '*')` di `bootstrap/app.php`.
2. **Lihat Log Error**:
   Jika terjadi kendala saat aplikasi dibuka, Anda bisa melihat log langsung di tab **Runtime Logs** pada dashboard Vercel project Anda.
