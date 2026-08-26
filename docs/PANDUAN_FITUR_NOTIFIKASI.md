# 📢 Dokumentasi Lengkap Fitur Notifikasi & Panduan Black Box Testing
**Aplikasi HARMONITAS (Harmonisasi dan Fasilitasi Ranperda & Ranperkada Tuntas)**  
*Kantor Wilayah Kementerian Hukum dan HAM Riau & Biro Hukum Setda Provinsi Riau*

---

## 📑 Daftar Isi
1. [Latar Belakang & Tujuan Fitur](#1-latar-belakang--tujuan-fitur)
2. [Sistem Notifikasi Ganda (Dual-Channel Notifications)](#2-sistem-notifikasi-ganda-dual-channel-notifications)
3. [Matriks Peran (Role) & Aturan Notifikasi](#3-matriks-peran-role--aturan-notifikasi)
4. [Arsitektur & Pemicu Otomatis (Triggers)](#4-arsitektur--pemicu-otomatis-triggers)
5. [Desain Template Email & Logo Kedinasan](#5-desain-template-email--logo-kedinasan)
6. [Panduan Konfigurasi Email (Gmail SMTP / Log) di .env](#6-panduan-konfigurasi-email-gmail-smtp--log-di-env)
7. [Antarmuka Pengguna In-App (UI & UX)](#7-antarmuka-pengguna-in-app-ui--ux)
8. [Struktur Database & Endpoint API](#8-struktur-database--endpoint-api)
9. [Tabel Pengujian Manual Black Box Testing (14 Skenario)](#9-tabel-pengujian-manual-black-box-testing-14-skenario)

---

## 1. Latar Belakang & Tujuan Fitur

Dalam proses harmonisasi dan fasilitasi rancangan peraturan daerah (Ranperda/Ranperkada), terdapat kolaborasi lintas instansi antara **Tim Kerja Kanwil Kemenkumham Riau**, **Biro Hukum Setda Provinsi Riau**, dan pemantauan oleh **Pimpinan Kanwil (Kakanwil & Kadiv)**.

Fitur **Notifikasi Terintegrasi** ini dibangun dengan tujuan:
- **Menghilangkan Bottleneck Komunikasi**: Memberitahu Biro Hukum secara otomatis ketika berkas harmonisasi Kanwil (5 slot dokumen) telah lengkap dan siap difasilitasi.
- **Transparansi Hasil Telaah**: Memberikan info seketika ke Tim Kerja ketika Biro Hukum menyetujui fasilitasi (disertai surat hasil fasilitasi) atau mengembalikan berkas (disertai surat dan catatan perbaikan).
- **Pengiriman ke Gmail / Email Dinas**: Mengirimkan email resmi seketika ke kotak masuk (*inbox*) pegawai sehingga notifikasi tetap tersampaikan meskipun pengguna sedang tidak membuka aplikasi web.
- **Executive Summary bagi Pimpinan**: Memberikan notifikasi pencapaian (*milestone*) saat produk hukum daerah tuntas disahkan.
- **Bebas Spam untuk Administrator**: Akun Admin difokuskan pada pemeliharaan sistem tanpa dibebani notifikasi alur operasional permohonan.

---

## 2. Sistem Notifikasi Ganda (Dual-Channel Notifications)

Sistem HARMONITAS menerapkan mekanisme **Dual-Channel Delivery**:
1. **Channel 1: In-App Notification (Web Database)**
   - Tersimpan di tabel database `notifikasi`.
   - Ditampilkan langsung pada ikon lonceng header dengan *unread badge counter*.
   - Navigasi instan 1-klik menuju halaman berkas terkait.
2. **Channel 2: Email Dispatch (Gmail / SMTP Mailer)**
   - Mengirimkan email berdesain resmi dengan **Logo HARMONITAS**, ringkasan data regulasi, dan tombol aksi langsung (*Direct CTA Link*).
   - Dilengkapi proteksi **Fail-Safe (`try...catch`)** agar jika server mail offline, transaksi alur kerja web tetap berhasil 100%.

---

## 3. Matriks Peran (Role) & Aturan Notifikasi

| Peran (Role) | Role ID | Akun Default | Notifikasi yang Diterima | Notifikasi yang Dikecualikan | Saluran Pengiriman |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Biro Hukum** | `3` | `birohukum.riau@harmonitas.go.id` | 1. Berkas 5 slot harmonisasi lengkap (Siap Fasilitasi)<br>2. Unggah pembaruan berkas revisi oleh Tim Kerja | - Pendaftaran draf awal<br>- Unggah slot perantara (slot 2-4) | In-App + Email |
| **Tim Kerja 1, 2, 3** | `2` | `timkerja1@harmonitas.go.id`<br>`timkerja2@harmonitas.go.id`<br>`timkerja3@harmonitas.go.id` | 1. Permohonan baru terdaftar di wilayah binaannya<br>2. Biro Hukum menyetujui fasilitasi (*Status: Selesai*)<br>3. Biro Hukum mengembalikan berkas (*Status: Perlu Perbaikan*) | - Berkas di luar wilayah binaan kerja masing-masing | In-App + Email |
| **Pimpinan**<br>*(Kakanwil & Kadiv)* | `4` | `kakanwil.riau@harmonitas.go.id`<br>`kadiv.kumham@harmonitas.go.id` | 1. **Milestone Selesai**: Produk hukum daerah selesai & sah difasilitasi (*Status: Selesai*) | - Notifikasi mikro teknis (unggah berkas slot 1-5, revisi draf, dll) | In-App + Email |
| **Administrator** | `1` | `admin@harmonitas.go.id` | **Tidak menerima notifikasi operasional** (Panel pasif sistem) | - Seluruh notifikasi alur kerja regulasi daerah | Panel Pasif |

---

## 4. Arsitektur & Pemicu Otomatis (Triggers)

```
[ Tim Kerja Mengunggah Dokumen Harmonisasi (Slot 1-5 Lengkap) ]
                               │
                               ▼
                [ Status Berubah: 3 - Fasilitasi ]
                               │
                               ▼
         📢 Notifikasi In-App + ✉️ Email ke BIRO HUKUM PROVINSI RIAU
        "Permohonan Siap Difasilitasi: Dokumen 5/5 Lengkap"
                               │
                               ▼
                [ Biro Hukum Menelaah & Mengambil Keputusan ]
                               ├─── (SETUJU / TERIMA) ───► [ Status: 4 - Selesai ]
                               │                                 │
                               │                                 ├─► 📢 Notif + ✉️ Email ke TIM KERJA
                               │                                 │   "Fasilitasi Disetujui & Selesai"
                               │                                 │
                               │                                 └─► 📢 Notif + ✉️ Email ke PIMPINAN
                               │                                     "Produk Hukum Daerah Selesai & Sah"
                               │
                               └─── (TOLAK / REVISI) ────► [ Status: 5 - Perlu Perbaikan ]
                                                                 │
                                                                 └─► 📢 Notif + ✉️ Email ke TIM KERJA
                                                                     "Permohonan Memerlukan Perbaikan (+ Catatan)"
```

### Logika Trigger pada Backend:
1. **`PermohonanController@store`**:
   Memicu `NotifikasiService::notifyTimKerja()` saat permohonan baru selesai dibuat.
2. **`PermohonanController@uploadDokumen`**:
   Memicu `NotifikasiService::notifyBiroHukum()` saat slot 1 s.d. 5 telah lengkap terisi.
3. **`PermohonanController@updateStatus`**:
   - Jika `$newStatusId === 4` (Selesai): Memicu `NotifikasiService::notifyTimKerja()` dan `NotifikasiService::notifyPimpinan()`.
   - Jika `$newStatusId === 5` (Perlu Perbaikan): Memicu `NotifikasiService::notifyTimKerja()` dengan melampirkan catatan evaluasi.

---

## 5. Desain Template Email & Logo Kedinasan

Seluruh template email menggunakan format responsif berbasis tabel standar email client (didukung Gmail, Outlook, Thunderbird, Apple Mail):
1. **Template Notifikasi Alur Kerja (`emails.notifikasi_alur_kerja`)**:
   - Header Dark Navy (`#101B4F`) dengan **Logo Resmi HARMONITAS**.
   - Sapaan nama pejabat/petugas dan penugasan unit kerja.
   - Kartu pemberitahuan berbingkai kuning emas (`#FFC800`).
   - Tabel ringkasan data berkas (Judul, Nomor Berkas, Pemda Pengaju, Jenis Regulasi, Status Terkini).
   - Tombol CTA Emas: *"Buka & Tinjau Berkas di HARMONITAS &rarr;"*.
   - Footer alamat resmi Kanwil Kemenkumham Riau.
2. **Template Reset Kata Sandi (`emails.reset_password`)**:
   - Memuat logo resmi HARMONITAS, instruksi reset password kedinasan, tombol CTA *"Reset Kata Sandi Anda &rarr;"*, dan catatan keamanan masa berlaku tautan 60 menit.

---

## 6. Panduan Konfigurasi Email (Gmail SMTP / Log) di .env

### Mode Development (Default - Tanpa Kirim Email Asli):
Secara default, Laravel menyimpan seluruh pesan email yang terkirim ke dalam file log:
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="notifikasi@harmonitas.go.id"
MAIL_FROM_NAME="HARMONITAS Kanwil Kemenkumham Riau"
```
*Isi email dapat diperiksa langsung di file: `storage/logs/laravel.log`.*

### Mode Produksi (Kirim Langsung ke Gmail Asli via SMTP):
Untuk mengirimkan email langsung ke akun Gmail penerima, gunakan akun Google dengan fitur **App Password (Sandi Aplikasi 16 Digit)**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email_dinas_anda@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # Masukkan 16 digit Sandi Aplikasi Google
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="notifikasi@harmonitas.go.id"
MAIL_FROM_NAME="HARMONITAS Kanwil Kemenkumham Riau"
```

---

## 7. Antarmuka Pengguna In-App (UI & UX)

Komponen utama: `resources/js/components/layout/NotificationDropdown.jsx`
- **Ikon Lonceng Header**: Menampilkan *badge counter* merah menyala dengan jumlah notifikasi yang belum dibaca (`unread_count`).
- **Tab Navigasi**:
  - Tab **"Semua"**: Menampilkan seluruh riwayat notifikasi user.
  - Tab **"Belum Dibaca"**: Filter instan untuk notifikasi yang belum dibuka.
- **Tombol "Tandai dibaca"**: Menandai seluruh notifikasi user sebagai terbaca tanpa *reload* halaman (`is_read = 1`).
- **Interaksi Klik Item**:
  - Mengubah status notifikasi menjadi terbaca secara otomatis.
  - Menavigasi user langsung ke halaman detail regulasi terkait (`/peraturan/{rancangan_id}`).
- **Visual Badge & Warna**:
  - 🟢 **Hijau (Emerald)**: Untuk notifikasi status *Selesai / Disetujui*.
  - 🔴 **Merah (Rose)**: Untuk notifikasi status *Perlu Perbaikan / Revisi*.
  - 🔵 **Biru Muda (Sky Blue)**: Untuk notifikasi status *Fasilitasi / Siap*.
  - 🟣 **Indigo**: Untuk notifikasi umum permohonan regulasi.

---

## 8. Struktur Database & Endpoint API

### Tabel Database (`notifikasi`)
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `notifikasi_id` | `INT (PK, Auto Increment)` | ID unik notifikasi |
| `user_id` | `INT (FK)` | ID user penerima notifikasi |
| `rancangan_id` | `INT (FK, Nullable)` | ID rancangan regulasi terkait |
| `judul` | `VARCHAR(150)` | Judul ringkas notifikasi |
| `pesan` | `TEXT` | Isi pesan penjelasan notifikasi |
| `is_read` | `TINYINT(1)` | Status dibaca (`0 = Belum`, `1 = Sudah`) |
| `created_at` | `DATETIME` | Waktu notifikasi dibuat |

### Endpoint API / Rute Web
| Method | Endpoint | Fungsi | Proteksi Keamanan |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifikasi` | Mengambil daftar notifikasi user yang login | `auth` middleware |
| `POST` | `/notifikasi/{id}/read` | Menandai 1 notifikasi telah dibaca | `auth` + IDOR check (`user_id`) |
| `POST` | `/notifikasi/read-all` | Menandai semua notifikasi user telah dibaca | `auth` middleware |

---

## 9. Tabel Pengujian Manual Black Box Testing (14 Skenario)

Gunakan tabel berikut untuk memverifikasi fungsionalitas notifikasi (In-App & Email) secara menyeluruh:

### Akun Uji Coba:
- **Admin**: `admin@harmonitas.go.id` | Password: `password`
- **Tim Kerja 1**: `timkerja1@harmonitas.go.id` | Password: `password`
- **Tim Kerja 2**: `timkerja2@harmonitas.go.id` | Password: `password`
- **Biro Hukum**: `birohukum.riau@harmonitas.go.id` | Password: `password`
- **Kakanwil**: `kakanwil.riau@harmonitas.go.id` | Password: `password`
- **Kadiv Kumham**: `kadiv.kumham@harmonitas.go.id` | Password: `password`

---

| No | Skenario Pengujian | Langkah Pengujian | Akun Penguji | Hasil yang Diharapkan | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | **Tampilan Lonceng Header** | Login ke aplikasi dan periksa ikon lonceng pada header kanan atas. | Biro Hukum / Tim Kerja | Badge merah dengan angka muncul jika ada notifikasi belum dibaca. | [ ] Pass<br>[ ] Fail |
| **2** | **Buka Dropdown Notifikasi** | Klik ikon lonceng pada header. | Biro Hukum / Tim Kerja | Panel dropdown terbuka dengan mulus, menampilkan tab "Semua", tab "Belum Dibaca", daftar kartu notifikasi, dan tombol aksi. | [ ] Pass<br>[ ] Fail |
| **3** | **Filter Tab "Belum Dibaca"** | Klik tab "Belum Dibaca" pada dropdown notifikasi. | Biro Hukum / Tim Kerja | Hanya notifikasi yang berstatus `is_read = 0` yang ditampilkan dalam daftar. | [ ] Pass<br>[ ] Fail |
| **4** | **Tandai Semua Dibaca** | Klik tombol *"Tandai dibaca"* di kanan atas dropdown. | Biro Hukum / Tim Kerja | Badge angka merah hilang seketika, dan seluruh item beralih ke status normal (terbaca). | [ ] Pass<br>[ ] Fail |
| **5** | **Navigasi Langsung dari Notifikasi** | Klik pada salah satu baris notifikasi atau klik *"Buka Berkas"*. | Biro Hukum / Tim Kerja | Notifikasi otomatis ditandai terbaca dan browser langsung berpindah ke halaman detail regulasi terkait (`/peraturan/{id}`). | [ ] Pass<br>[ ] Fail |
| **6** | **Trigger Notifikasi Biro Hukum (5 Dokumen Lengkap)** | 1. Login sebagai Tim Kerja.<br>2. Buka permohonan yang berstatus Draf Awal.<br>3. Unggah seluruh berkas hingga Slot 1 s.d. 5 terisi lengkap.<br>4. Login sebagai Biro Hukum. | Tim Kerja ➔ Biro Hukum | Biro Hukum menerima notifikasi in-app baru: *"Permohonan Siap Difasilitasi: Dokumen harmonisasi Kanwil lengkap 5 slot"*. | [ ] Pass<br>[ ] Fail |
| **7** | **Trigger Notifikasi Tim Kerja (Biro Hukum Menyetujui)** | 1. Login sebagai Biro Hukum.<br>2. Buka permohonan dengan status Fasilitasi.<br>3. Klik *"Terima & Terbitkan Surat Fasilitasi"*, unggah surat, lalu klik simpan.<br>4. Login sebagai Tim Kerja wilayah tersebut. | Biro Hukum ➔ Tim Kerja | Tim Kerja menerima notifikasi baru: *"Fasilitasi Disetujui & Selesai"*. | [ ] Pass<br>[ ] Fail |
| **8** | **Trigger Notifikasi Tim Kerja (Biro Hukum Menolak / Revisi)** | 1. Login sebagai Biro Hukum.<br>2. Buka permohonan dengan status Fasilitasi.<br>3. Klik *"Tolak & Terbitkan Surat Pengembalian"*, isi catatan evaluasi, lalu simpan.<br>4. Login sebagai Tim Kerja wilayah tersebut. | Biro Hukum ➔ Tim Kerja | Tim Kerja menerima notifikasi baru: *"Permohonan Memerlukan Perbaikan"* lengkap dengan teks catatan dari Biro Hukum. | [ ] Pass<br>[ ] Fail |
| **9** | **Trigger Notifikasi Milestone Pimpinan (Kakanwil & Kadiv)** | 1. Lakukan persetujuan regulasi hingga berstatus *4 - Selesai* oleh Biro Hukum.<br>2. Login sebagai Kakanwil atau Kadiv. | Biro Hukum ➔ Kakanwil / Kadiv | Kakanwil & Kadiv menerima notifikasi pencapaian: *"Produk Hukum Daerah Selesai & Sah"*. | [ ] Pass<br>[ ] Fail |
| **10** | **Verifikasi Pengecualian Akun Admin** | 1. Jalankan proses unggah dan perubahan status.<br>2. Login sebagai Administrator (`admin@harmonitas.go.id`).<br>3. Buka dropdown notifikasi. | Admin | Tidak ada badge angka dan dropdown menampilkan informasi akun administrator sistem (bebas dari notifikasi operasional). | [ ] Pass<br>[ ] Fail |
| **11** | **Proteksi Keamanan Akses (IDOR Defense)** | Coba lakukan request API `POST /notifikasi/{id_milik_user_lain}/read`. | User Lain via Postman / Fetch | Server mengembalikan respon `403 Forbidden` (Akses Ditolak). | [ ] Pass<br>[ ] Fail |
| **12** | **Pengiriman Email Notifikasi Alur Kerja (Workflow Email)** | 1. Lakukan trigger notifikasi (misal: 5 slot lengkap atau persetujuan fasilitasi).<br>2. Buka `storage/logs/laravel.log` atau kotak masuk Gmail penerima. | Tim Kerja / Biro Hukum | Email resmi dengan subjek `[HARMONITAS] ...`, Logo HARMONITAS, ringkasan berkas, dan tombol CTA terkirim dengan rapi. | [ ] Pass<br>[ ] Fail |
| **13** | **Pengiriman Email Reset Password Berlogo** | 1. Buka halaman `/forgot-password`.<br>2. Masukkan email kedinasan terdaftar dan klik kirim.<br>3. Periksa email yang masuk. | Semua Akun | Email pemulihan kata sandi memuat logo HARMONITAS, tombol reset emas, dan catatan keamanan 60 menit. | [ ] Pass<br>[ ] Fail |
| **14** | **Ketahanan Kegagalan Pengiriman Email (Fail-Safe)** | Putuskan koneksi internet / simulasikan error SMTP, lalu lakukan submit alur kerja regulasi di web. | Tim Kerja / Biro Hukum | Transaksi web tetap sukses, notifikasi in-app tetap tersimpan, dan error email hanya dicatat di log tanpa merusak alur kerja user. | [ ] Pass<br>[ ] Fail |

---

*Dokumen ini dibuat otomatis sebagai standarisasi teknis dan instrumen uji kualitas aplikasi HARMONITAS.*
