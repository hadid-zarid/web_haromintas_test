# 📑 Panduan Fitur Riwayat Aktivitas, Tugas Perlu Tindakan, dan Live Audit Feed
**Aplikasi HARMONITAS (Harmonisasi & Fasilitasi Ranperda / Ranperkada Tuntas)**  
*Kantor Wilayah Kementerian Hukum dan HAM Riau & Biro Hukum Setda Provinsi Riau*

---

## 📑 Daftar Isi
1. [Fitur Riwayat Aktivitas & Perjalanan Berkas (Halaman Detail)](#1-fitur-riwayat-aktivitas--perjalanan-berkas-halaman-detail)
2. [Fitur Tugas Perlu Tindakan di Dashboard per Role](#2-fitur-tugas-perlu-tindakan-di-dashboard-per-role)
3. [Fitur Aktivitas Berkas Terbaru di Dashboard (Live Audit Feed)](#3-fitur-aktivitas-berkas-terbaru-di-dashboard-live-audit-feed)
4. [Tabel Matriks Akses & Lingkup Data Berdasarkan Role](#4-tabel-matriks-akses--lingkup-data-berdasarkan-role)

---

## 1. Fitur Riwayat Aktivitas & Perjalanan Berkas (Halaman Detail)

### 📌 Tujuan & Fungsi
Fitur ini bertindak sebagai **Audit Trail & Digital Timeline** yang merekam setiap peristiwa perubahan pada berkas regulasi daerah secara kronologis dan tidak dapat dimanipulasi (*tamper-proof*).

### 🔍 Komponen & Informasi yang Ditampilkan:
1. **Identitas Petugas Pelaksana:** Menampilkan nama lengkap petugas atau pejabat yang melakukan aksi (misal: *Tim Kerja 1 Kanwil Riau*, *Biro Hukum Provinsi Riau*, dll.).
2. **Timestamp Presisi:** Waktu pencatatan kejadian dengan format bahasa Indonesia (Tanggal, Bulan, Jam, dan Menit).
3. **Deskripsi Aksi yang Spesifik & Transparan (Bebas Ambiguitas):**
   - ➕ **Pendaftaran Baru:** *"Mendaftarkan permohonan regulasi baru: [Judul Regulasi] (Tahap: Draf Awal)."*
   - 📤 **Unggah Berkas:** *"Mengunggah naskah [Nama Dokumen] ([Nama File]) versi [N]."*
   - 🔄 **Perubahan Status:** *"Mengubah status berkas dari [Status Lama] menjadi [Status Baru]."* (Menghilangkan istilah ambigu "Status Baru").
   - 🟢 **Persetujuan Fasilitasi:** *"Mengesahkan hasil fasilitasi regulasi sebagai Selesai (Tuntas) dengan lampiran Surat: [Nama Surat]."*
   - 🔴 **Pengembalian / Revisi:** *"Mengembalikan berkas fasilitasi (Perlu Perbaikan). Catatan: [Catatan Evaluasi Biro Hukum]."*
4. **Ikon Visual Berdasarkan Kategori Aksi:**
   - 🟢 *Hijau (CheckCircle2)*: Persetujuan fasilitasi & pendaftaran permohonan.
   - 🔵 *Biru (Upload)*: Pengunggahan dokumen naskah hukum.
   - 🟡 *Kuning / Amber (RefreshCw)*: Perubahan tahapan status SOP.
   - 🔴 *Merah (XCircle)*: Penolakan atau pengembalian berkas revisi.
5. **Paginasi Interaktif (Client-Side Pagination):**
   - Menampilkan **5 catatan per halaman** secara rapi.
   - Dilengkapi tombol navigasi *"Sebelumnya"* dan *"Selanjutnya"* serta indikator *"Halaman X dari Y"* sehingga halaman tetap ringkas meskipun riwayat berkas telah mencapai puluhan catatan.

---

## 2. Fitur Tugas Perlu Tindakan di Dashboard per Role

### 📌 Tujuan & Fungsi
Panel **Tugas Perlu Tindakan** dirancang sebagai *Action-Oriented Dashboard Widget* yang memberikan gambaran instan kepada setiap pengguna mengenai berkas apa saja yang **memerlukan perhatian atau tindak lanjut segera** sesuai wewenang peran (*role*) masing-masing.

### 👥 Matriks Tugas Berdasarkan Role:

#### A. Tim Kerja Kanwil (Role ID: 2)
Fokus pada pemrosesan draf pra-harmonisasi, pengunggahan 5 dokumen kelengkapan, dan perbaikan naskah:
| Kartu Tugas | Kriteria Berkas | Keterangan & Aksi 1-Klik |
| :--- | :--- | :--- |
| **Berkas Perlu Diproses / Dilengkapi** | Status: *Draf Awal (1)* + *Dalam Harmonisasi (2)* | Menampilkan total berkas aktif di wilayah binaan yang menunggu rapat pleno atau kelengkapan slot 1–5. Klik kartu langsung memfilter tabel permohonan. |
| **Permohonan Memerlukan Perbaikan** | Status: *Perlu Perbaikan (5)* | Menampilkan berkas yang dikembalikan oleh Biro Hukum untuk revisi pasal. Membantu Tim Kerja langsung fokus memperbaiki berkas yang tertunda. |

#### B. Biro Hukum Provinsi Riau (Role ID: 3)
Fokus pada penelaahan fasilitasi provinsi dan penerbitan surat keputusan:
| Kartu Tugas | Kriteria Berkas | Keterangan & Aksi 1-Klik |
| :--- | :--- | :--- |
| **Berkas Masuk Siap Difasilitasi** | Status: *Dalam Fasilitasi (3)* | Berkas yang telah lengkap 5/5 dokumen harmonisasi Kanwil dan siap ditelaah serta diterbitkan Surat Hasil Fasilitasi. |
| **Total Berkas Fasilitasi Selesai** | Status: *Selesai (4)* | Seluruh produk hukum daerah yang telah disahkan dan diterbitkan surat persetujuan resminya. |

#### C. Pimpinan Kanwil (Kakanwil & Kadiv - Role ID: 4) & Administrator (Role ID: 1)
Fokus pada pengawasan eksekutif se-Provinsi Riau:
| Kartu Tugas | Kriteria Berkas | Keterangan & Aksi 1-Klik |
| :--- | :--- | :--- |
| **Permohonan Aktif Sedang Diproses** | Status: *1, 2, 3, 5* (Seluruh Berkas Berjalan) | Total akumulasi permohonan yang sedang berproses di seluruh 12 Kabupaten/Kota dan Pemprov Riau. |
| **Regulasi Selesai** | Status: *Selesai (4)* | Total produk hukum daerah yang tuntas disahkan di tingkat Provinsi Riau. |

---

## 3. Fitur Aktivitas Berkas Terbaru di Dashboard (Live Audit Feed)

### 📌 Tujuan & Fungsi
Widget **Aktivitas Berkas Terbaru** di sisi kanan Dashboard menampilkan umpan riwayat (*live feed*) dari 5 aktivitas mutakhir di dalam sistem.

### 🔍 Karakteristik Utama:
1. **Role-Based Data Scoping (Keamanan & Privasi Data):**
   - **Tim Kerja Kanwil:** Hanya melihat aktivitas yang berkaitan dengan berkas di wilayah kerja binaannya atau aktivitas yang dilakukan oleh akunnya sendiri.
   - **Biro Hukum & Pimpinan:** Melihat seluruh aktivitas lintas daerah se-Provinsi Riau untuk kebutuhan koordinasi dan pemantauan menyeluruh.
2. **Badge Kategori Aksi:**
   - `Daftar` (Hijau Emerald): Registrasi berkas baru.
   - `Unggah` (Biru): Pengunggahan draf/naskah baru.
   - `Disetujui` (Hijau): Keputusan persetujuan fasilitasi.
   - `Revisi` (Merah Rose): Pengembalian berkas untuk perbaikan.
   - `Status` (Slate/Netral): Pembaruan tahapan regulasi.
3. **Modal Pratinjau Detail Interaktif:**
   - Setiap baris aktivitas pada widget dapat diklik untuk membuka **ActivityDetailModal**.
   - Menampilkan rincian teknis payload audit log, nama operator, peran kedinasan, timestamp lengkap, dan judul regulasi terkait.

---

## 4. Tabel Matriks Akses & Lingkup Data Berdasarkan Role

| Fitur | Tim Kerja Kanwil | Biro Hukum Pemprov | Pimpinan Kanwil | Administrator |
| :--- | :---: | :---: | :---: | :---: |
| **Riwayat Detail Berkas** | Sesuai Berkas Wilayah | Seluruh Berkas | Seluruh Berkas | Seluruh Berkas |
| **Paginasi Riwayat Detail** | 5 Catatan / Halaman | 5 Catatan / Halaman | 5 Catatan / Halaman | 5 Catatan / Halaman |
| **Tugas Perlu Tindakan** | Draf/Harmonisasi + Perbaikan | Siap Fasilitasi + Selesai | Akumulasi Berjalan + Tuntas | Akumulasi Berjalan + Tuntas |
| **Live Feed Dashboard** | Filter Wilayah Binaan | Seluruh Provinsi Riau | Seluruh Provinsi Riau | Seluruh Provinsi Riau |
| **Modal Rincian Audit** | Aktif | Aktif | Aktif | Aktif |

---

*Dokumen ini diperbarui secara resmi sebagai pedoman arsitektur fungsional antarmuka HARMONITAS.*
