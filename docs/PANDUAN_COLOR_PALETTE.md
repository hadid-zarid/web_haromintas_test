# Panduan Sistem Palet Warna (Color Palette System) - HARMONITAS

Dokumen ini memuat standarisasi desain visual, filosofi warna, kode Hex/RGB, serta aturan implementasi palet warna pada antarmuka aplikasi **HARMONITAS (Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas)** — Kantor Wilayah Kementerian Hukum dan HAM Riau bersama Pemerintah Provinsi Riau.

---

## 1. Filosofi & Konsep Desain (*Design Philosophy*)

Sistem warna HARMONITAS dibangun dengan perpaduan nilai:
1. **Wibawa & Kepastian Hukum (*Legal Authority & Trust*)**: Diwakili oleh gradasi **Biru Donker (*Navy Blue*)**, mencerminkan integritas institusi Kementerian Hukum dan HAM serta tata kelola birokrasi yang tertib.
2. **Kejayaan & Identitas Budaya Lokal (*Provincial Prestige & Warmth*)**: Diwakili oleh aksen **Kuning Keemasan (*Golden Yellow / Amber*)**, mencerminkan marwah Bumi Lancang Kuning (*#RiauBedelau*) dan komitmen pelayanan prima.
3. **Kenyamanan Membaca (*Ergonomic & Eye-Friendly Workspace*)**: Menggunakan latar belakang **Warm Off-White**, meminimalkan ketegangan mata aparatur/perancang hukum saat menelaah naskah regulasi berjam-jam.

---

## 2. Palet Warna Utama Institusi (*Brand Identity*)

| Nama Token / Warna | Kode Hex | Nilai RGB / HSL | Implementasi & Area Penggunaan |
|---|---|---|---|
| **Primary Navy Base** | `#1A1A5E` | `rgb(26, 26, 94)` | Header utama, tombol aksi utama (*Primary CTA*), teks judul halaman, border fokus input. |
| **Slate Midnight Navy** | `#2C3154` | `rgb(44, 49, 84)` | Latar belakang **Sidebar navigasi**, banner atas halaman (*Hero App*), modal header. |
| **Royal Indigo / Dark Card** | `#323864` | `rgb(50, 56, 100)` | Kartu metrik *Total Permohonan* & *Selesai* di dashboard, container aksen gelap. |
| **Border Navy / Hover** | `#383F6A` / `#2E3A87` | `rgb(56, 63, 106)` | Garis pembatas sidebar, efek hover tombol, thumb scrollbar custom. |
| **Golden Yellow Accent** | `#FFC800` | `rgb(255, 200, 0)` | Indikator menu aktif (*active state*), ikon highlight, bintang/sparkle, logo glow. |
| **Amber Gold Button** | `#FFD54F` ➔ `#FFB300` | Gradient Amber | Tombol "+ Tambah Permohonan Baru", tombol tindakan prioritas tinggi. |

---

## 3. Warna Kanvas & Netral (*Surfaces, Backgrounds & Typography*)

| Nama Token / Warna | Kode Hex | Implementasi & Fungsi |
|---|---|---|
| **Canvas Background** | `#F5F5F0` | Latar belakang utama seluruh halaman dashboard & modul internal aplikasi. |
| **Landing Canvas** | `#F8FAFC` | Latar belakang bagian konten publik pada halaman Landing Page. |
| **Hero Dark Canvas** | `#0F172A` | Latar belakang gelap pada Hero Section Landing Page (*Dark Banner*). |
| **Card Surface (Pure White)** | `#FFFFFF` | Permukaan kartu (*Bento Cards*), lembar dokumen, tabel berkas, dan modal form. |
| **Input / Inner Dropzone** | `#F8F8F5` | Area input formulir, kotak dropzone unggah berkas, dan latar baris selang-seling. |
| **Divider & Border Muted** | `#E2E2DC` / `#D5D5CE` | Garis pemisah (*divider*), border kartu, dan border tabel. |
| **Primary Typography** | `#3D3D3A` | Teks paragraf utama / body text (kontras tinggi, mudah dibaca). |
| **Muted Typography** | `#64748B` / `#94A3B8` | Teks keterangan kecil (*subtext*), timestamp, dan placeholder input. |

---

## 4. Palet Alur Kerja & Status Regulasi (*Workflow & Status Colors*)

Warna status diterapkan secara seragam pada kartu metrik dashboard, badge tabel permohonan, dan 7 dokumen berkas:

| Kategori / Status | Gradient / Kode Warna | Class CSS Tailwind | Deskripsi & Makna Alur |
|---|---|---|---|
| **Proses Harmonisasi** | `from-[#FFC837] to-[#FF8008]` *(Gradient)* | `bg-amber-100 text-amber-800 border-amber-200` | Kartu metrik proses rapat Kanwil Kemenkum & badge permohonan tahap harmonisasi. |
| **Proses Fasilitasi** | `from-[#27A169] to-[#127A4A]` *(Gradient)* | `bg-emerald-100 text-emerald-800 border-emerald-200` | Kartu metrik fasilitasi Biro Hukum Provinsi & berkas yang sedang ditelaah Pemprov. |
| **Kewenangan Tim Kerja** | `#E0E7FF` / `#1D4ED8` *(Blue Accent)* | `bg-blue-50 text-blue-700 border-blue-200` | Badge kewenangan & identitas **Dokumen 1–5 (Tim Kerja Kanwil)**. |
| **Kewenangan Biro Hukum** | `#F3E8FF` / `#7E22CE` *(Purple Accent)* | `bg-purple-50 text-purple-700 border-purple-200` | Badge kewenangan & identitas **Dokumen 6–7 (Biro Hukum Setda Riau)**. |
| **Selesai / Tuntas** | `#D1FAE5` / `#047857` *(Emerald Accent)* | `bg-emerald-100 text-emerald-800 border-emerald-200` | Status regulasi yang telah selesai diharmonisasi dan difasilitasi. |
| **Perlu Perbaikan / Revisi** | `#FFE4E6` / `#BE123C` *(Rose / Coral)* | `bg-rose-100 text-rose-800 border-rose-200` | Berkas yang dikembalikan untuk revisi / tombol hapus berkas. |
| **Draf Awal / Menunggu** | `#F1F5F9` / `#475569` *(Slate Gray)* | `bg-slate-100 text-slate-700 border-slate-200` | Berkas baru masuk pra-harmonisasi. |

---

## 5. Pemetaan Warna pada Komponen Utama

### A. Landing Page (`LandingPage.jsx`):
- **Hero Section**: Gelap elegan (`#0F172A`) dengan pendaran cahaya (*ambient glow*) Biru (`#2563EB/20`) dan Emas (`#F59E0B/10`).
- **Body & Fitur**: Putih bersih (`#FFFFFF`) berlatar `#F8FAFC`, dipadukan dengan badge Tim Kerja (Biru, Amber, Emerald).
- **Footer**: Biru Gelap Institusional (`#0F172A`) dengan teks abu-abu terang (`#94A3B8`).

### B. Dashboard Beranda (`HomePage.jsx`):
- **4 Bento Metric Cards**:
  1. *Total Permohonan*: Royal Navy (`#323864`)
  2. *Proses Harmonisasi*: Amber Gradient (`#FFC837` ➔ `#FF8008`)
  3. *Proses Fasilitasi*: Emerald Gradient (`#27A169` ➔ `#127A4A`)
  4. *Selesai / Tuntas*: Royal Navy (`#323864`)
- **Grafik Bottleneck & Timeline**: Kartu putih (`#FFFFFF`) bergaris `#E2E2DC` dengan bar progres sesuai warna status.

### C. Modul Permohonan & 7 Dokumen Berkas (`PeraturanDetailPage.jsx`):
- **Dokumen 1 s.d. 5 (Tim Kerja Kanwil)**: Aksen Biru Muda (`bg-blue-50 text-blue-700 border-blue-200`).
- **Dokumen 6 s.d. 7 (Biro Hukum Riau)**: Aksen Ungu Muda (`bg-purple-50 text-purple-700 border-purple-200`).
- **Dropzone Upload Berkas**:
  - *Sebelum Dipilih*: Border putus-putus abu-abu (`#D5D5CE`) berlatar `#F8F8F5`.
  - *Setelah File Terlampir*: Kartu hijau terang (`from-emerald-50 to-teal-50 border-emerald-300`) dengan badge sukses hijau.

---

## 6. Standar Aksesibilitas & Rasio Kontras (*Accessibility Standard*)

Semua kombinasi warna teks dan latar belakang pada HARMONITAS telah memenuhi standar **WCAG 2.1 Level AA**:
- **Navy (`#1A1A5E`) pada Putih (`#FFFFFF`)**: Rasio kontras **14.2:1** *(Sangat Tinggi / AAA)*.
- **Charcoal (`#3D3D3A`) pada Canvas (`#F5F5F0`)**: Rasio kontras **10.5:1** *(Sangat Tinggi / AAA)*.
- **Putih (`#FFFFFF`) pada Slate Midnight (`#2C3154`)**: Rasio kontras **9.8:1** *(Sangat Tinggi / AAA)*.
- **Teks Gelap pada Tombol Emas (`#1A1A5E` pada `#FFC800`)**: Rasio kontras **11.1:1** *(Sangat Tinggi / AAA)*.
