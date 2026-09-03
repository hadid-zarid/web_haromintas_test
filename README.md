# HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas)
### Kanwil Kementerian Hukum dan HAM Riau

Aplikasi Sistem Informasi Harmonisasi dan Fasilitasi Ranperda & Ranperkada berbasis **Full-Stack Monolith (Laravel 13 + Inertia.js + React 19)**.

---

## 🚀 Tech Stack

- **Backend Framework**: Laravel 13 (v13.26.1)
- **PHP Version**: PHP 8.3 (v8.3.6+)
- **Frontend Framework**: React 19 (v19.2.0)
- **Glue / Adapter**: Inertia.js (`@inertiajs/react` v2.0 & `inertiajs/inertia-laravel` v3.3)
- **Styling**: Tailwind CSS v4 + Custom Flat Navy & Golden Yellow Token System
- **Icons & Charts**: Lucide React, Recharts
- **Build Tool**: Vite + `laravel-vite-plugin`

---

## 📂 Struktur Proyek

```
web_harmonitas/
├── app/
│   ├── Http/
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php   # Inertia Middleware
│   └── Models/
├── resources/
│   ├── css/
│   │   └── app.css                         # Tailwind CSS & Color Tokens
│   ├── js/
│   │   ├── app.jsx                         # Main Inertia App Entrypoint
│   │   ├── Pages/                          # Halaman React (Inertia Views)
│   │   │   ├── LandingPage.jsx             # Beranda Publik
│   │   │   ├── LoginPage.jsx               # Login & Simulasi Role
│   │   │   ├── HomePage.jsx                # Dashboard & Statistik
│   │   │   ├── PeraturanListPage.jsx       # Daftar Berkas Permohonan
│   │   │   ├── PeraturanDetailPage.jsx     # Detail & Dokumen 6 Tahap
│   │   │   ├── PanduanPage.jsx             # Buku Panduan SOP
│   │   │   └── AIAssistantPage.jsx         # Asisten AI Regulasi
│   │   ├── components/                     # Reusable Components
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── modals/
│   │   ├── context/                        # Global State (Auth, Peraturan, Toast)
│   │   └── mock/                           # Data Simulasi Awal
│   └── views/
│       └── app.blade.php                   # Root Blade Template (@inertia)
├── routes/
│   └── web.php                             # Laravel Web Routes
└── vite.config.js                          # Vite Configuration
```

---

## ⚡ Cara Menjalankan Proyek (Untuk Pertama Kali / Baru Clone)

### 1. Prasyarat Sistem
* **PHP** >= 8.3 (Extension wajib aktif: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `zip`)
* **Composer** >= 2.x
* **Node.js** >= 18.x & **npm**
* **MySQL / MariaDB** (via XAMPP, Laragon, atau native service)

---

### 2. Langkah Setup Lengkap (Step-by-Step)

Buka terminal di folder proyek dan jalankan perintah berikut secara berurutan:

```bash
# 1. Install dependencies backend (PHP)
composer install

# 2. Install dependencies frontend (JavaScript/React)
npm install

# 3. Buat file konfigurasi environment (.env)
cp .env.example .env
# Jika di Windows PowerShell:
# copy .env.example .env

# 4. Generate Application Key Laravel
php artisan key:generate

# 5. Hubungkan direktori storage file dokumen
php artisan storage:link
```

---

### 3. Setup Database (MySQL)

1. Pastikan **MySQL di XAMPP / Laragon** sudah berjalan (*Start*).
2. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Masuk ke tab **SQL** atau **Import**, lalu jalankan file:
   📂 `database/schema_harmonitas.sql`
   *(Database `harmonitas` dan seluruh tabel + akun demo akan otomatis dibuat)*.
4. Sesuaikan file `.env` jika username/password database berbeda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=harmonitas
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

### 4. Menjalankan Server Aplikasi

Jalankan **dua terminal**:

**Terminal 1 (Backend Laravel Server):**
```bash
php artisan serve
```
*(Server backend berjalan di `http://127.0.0.1:8000`)*

**Terminal 2 (Frontend Vite Server):**
```bash
npm run dev
```

Buka browser dan akses **`http://127.0.0.1:8000`**.

---

### 🔑 Akun Demo Pengguna (Default Password: `password`)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@harmonitas.go.id` | `password` |
| **Pokja 1** | `pokja1@harmonitas.go.id` | `password` |
| **Pokja 2** | `pokja2@harmonitas.go.id` | `password` |
| **Pokja 3** | `pokja3@harmonitas.go.id` | `password` |
| **Biro Hukum Prov** | `birohukum.riau@harmonitas.go.id` | `password` |
| **Bagian Hukum Siak** | `baghukum.siak@harmonitas.go.id` | `password` |
| **Pimpinan Kakanwil** | `kakanwil.riau@harmonitas.go.id` | `password` |

---

## 📤 Cara Push ke Repository GitHub Baru

Jika Anda ingin mengunggah proyek ini ke repository GitHub yang baru:

```bash
# 1. Hapus koneksi git lama (opsional, jika ingin membuat history fresh)
rm -rf .git
git init

# 2. Tambahkan semua file dan buat commit pertama
git add .
git commit -m "feat: Inisialisasi Full-stack Laravel + Inertia.js React untuk HARMONITAS"

# 3. Ganti branch utama menjadi main
git branch -M main

# 4. Hubungkan ke remote GitHub baru Anda (ganti URL dengan repo Anda)
git remote add origin https://github.com/USERNAME/NAMA_REPO_BARU.git

# 5. Push ke GitHub
git push -u origin main
```
