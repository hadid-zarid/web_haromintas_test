# HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas)
### Kanwil Kementerian Hukum dan HAM Riau

Aplikasi Sistem Informasi Harmonisasi dan Fasilitasi Ranperda & Ranperkada berbasis **Full-Stack Monolith (Laravel 11 + Inertia.js + React 19)**.

---

## 🚀 Tech Stack

- **Backend Framework**: Laravel 11 / 12 (PHP 8.3+)
- **Frontend Framework**: React 19
- **Glue / Adapter**: Inertia.js (`@inertiajs/react` & `inertiajs/inertia-laravel`)
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

## ⚡ Cara Menjalankan Proyek

### 1. Prasyarat
- PHP >= 8.2 (dengan extension `curl`, `mbstring`, `openssl`, `pdo_mysql`)
- Composer >= 2.0
- Node.js >= 18.0 & npm

### 2. Jalankan Dev Server

Buka **dua terminal**:

**Terminal 1 (Backend Laravel Server):**
```bash
php artisan serve
```
*(Server berjalan di `http://127.0.0.1:8000`)*

**Terminal 2 (Frontend Vite Server):**
```bash
npm run dev
```

Buka browser dan akses **`http://127.0.0.1:8000`**.

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
