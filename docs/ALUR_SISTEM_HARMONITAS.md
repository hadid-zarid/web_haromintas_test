# DOKUMEN SPESIFIKASI PROSES BISNIS & ALUR KERJA SISTEM
## APLIKASI HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas)
**Kantor Wilayah Kementerian Hukum Provinsi Riau**

---

## 1. PENDAHULUAN & GAMBARAN UMUM SISTEM

### 1.1 Latar Belakang
**HARMONITAS** adalah sistem informasi terintegrasi yang dirancang khusus untuk memfasilitasi, mengkaji, dan memantau proses pengharmonisasian **Rancangan Peraturan Daerah (Ranperda)** dan **Rancangan Peraturan Kepala Daerah (Ranperkada)** di lingkungan **Provinsi Riau**. Sistem ini menghubungkan secara langsung **Kantor Wilayah Kementerian Hukum Provinsi Riau** dengan **Biro Hukum Sekretariat Daerah Provinsi Riau** serta **Bagian Hukum Pemerintah Kabupaten/Kota se-Provinsi Riau**.

### 1.2 Cakupan Wilayah Kerja & Pembagian Pokja
Sistem ini mencakup **1 Pemerintah Provinsi dan 12 Pemerintah Kabupaten/Kota** di Provinsi Riau yang dibagi ke dalam 3 (tiga) Kelompok Kerja (Pokja) Kanwil Kementerian Hukum Provinsi Riau:

```
PROVINSI RIAU (13 Entitas Wilayah)
├── POKJA 1
│   ├── 1. Pemerintah Provinsi Riau
│   ├── 2. Kabupaten Siak
│   ├── 3. Kabupaten Kampar
│   ├── 4. Kabupaten Indragiri Hilir
│   └── 5. Kabupaten Bengkalis
│
├── POKJA 2
│   ├── 6. Kabupaten Rokan Hulu
│   ├── 7. Kabupaten Indragiri Hulu
│   ├── 8. Kabupaten Kepulauan Meranti
│   └── 9. Kota Dumai
│
└── POKJA 3
    ├── 10. Kabupaten Kuantan Singingi
    ├── 11. Kabupaten Pelalawan
    ├── 12. Kabupaten Rokan Hilir
    └── 13. Kota Pekanbaru
```

---

## 2. MATRIKS HAK AKSES PENGGUNA (ROLE-BASED ACCESS CONTROL)

| No | Peran (*Role*) | Lingkup Wilayah | Wewenang & Tanggung Jawab Utama |
| :--- | :--- | :--- | :--- |
| **1** | **Pokja (Pokja 1, 2, 3)** | Kabupaten/Kota binaan masing-masing Pokja | • Mengunggah draf permohonan Ranperda/Ranperkada.<br>• Menggunakan **Fitur AI Pra-Harmonisasi** untuk memeriksa format & kaidah hukum dokumen sebelum rapat.<br>• Mengunggah dokumen luaran hasil rapat harmonisasi.<br>• Mengelola dan memantau progres berkas dari awal hingga selesai. |
| **2** | **Pimpinan (Kakanwil & Kadiv)** | Seluruh Provinsi Riau (13 Wilayah) | • *Executive Monitoring Dashboard*.<br>• Memantau status berkas di seluruh wilayah lintas Pokja 1, 2, dan 3.<br>• Meninjau statistik penyelesaian, beban kerja Pokja, dan rekapitulasi kepatuhan. |
| **3** | **Biro Hukum / Bagian Hukum** | Sesuai daerah masing-masing (Provinsi / Kab / Kota) | • Menerima notifikasi otomatis saat hasil rapat harmonisasi selesai diunggah Pokja.<br>• Menelaah dan mengunduh paket dokumen hasil harmonisasi.<br>• Memberikan respon validasi akhir: **Setujui** (*Disetujui/Tuntas*) atau **Tolak** (*Perlu Perbaikan/Revisi*). |
| **4** | **Administrator Sistem** | Seluruh Sistem | • Mengelola manajemen akun pengguna (*User Management* & *RBAC*).<br>• Mengatur pemetaan wilayah kabupaten/kota untuk Pokja 1, 2, dan 3.<br>• Mengelola master data regulasi, template berkas, dan log audit sistem. |

---

## 3. RINCIAN ALUR PROSES BISNIS (*BUSINESS PROCESS WORKFLOW*)

Alur kerja sistem HARMONITAS terbagi menjadi 5 (lima) tahapan utama yang berurutan:

```mermaid
sequenceDiagram
    autonumber
    actor PK as Pokja Kanwil Riau (1/2/3)
    participant AI as Asisten AI HARMONITAS
    participant SYS as Sistem HARMONITAS
    actor BH as Biro / Bagian Hukum Daerah
    actor PIM as Pimpinan (Kakanwil/Kadiv)

    Note over PK,AI: Tahap 1 & 2: Input Draf & Pemeriksaan AI Pra-Harmonisasi
    PK->>SYS: Input & Unggah Draf Awal Ranperda/Ranperkada
    PK->>AI: Jalankan Pemeriksaan AI (Format & Sistematika UU 12/2011)
    AI-->>PK: Hasil Analisis Kesesuaian Format, Struktur, & Redaksi
Marker
    Note over PK,SYS: Tahap 3: Pelaksanaan Rapat Harmonisasi & Unggah Hasil
    Note over PK: Rapat Harmonisasi Kanwil Dilaksanakan
    PK->>SYS: Unggah Paket Dokumen Hasil Harmonisasi
    PIM-->>SYS: Memantau Progres Masuk di Dashboard Eksekutif
    SYS->>BH: Kirim Notifikasi Otomatis (Harmonisasi Selesai)

    Note over BH,SYS: Tahap 4 & 5: Penelaahan & Respon Biro Hukum
    BH->>SYS: Buka Notifikasi & Telusuri Dokumen Hasil Harmonisasi
    alt Biro Hukum Menyetujui
        BH->>SYS: Klik Tombol [Setujui / Selesai]
        SYS-->>PIM: Status Berkas Berubah Menjadi [TUNTAS]
    else Biro Hukum Menolak / Minta Revisi
        BH->>SYS: Klik Tombol [Tolak / Perlu Revisi] + Catatan Alasan
        SYS-->>PK: Notifikasi Pengembalian Berkas ke Pokja
    end
```

---

### Tahap 1: Penginputan Draf Awal Ranperda / Ranperkada
1. Pokja (Pokja 1, 2, atau 3) mengunduh permohonan draf peraturan dari aplikasi *e-Harmonisasi* atau berkas resmi yang masuk.
2. Pokja membuat register berkas baru di sistem HARMONITAS sesuai wilayah kabupaten/kota binaannya.
3. Pokja mengunggah dokumen draf regulasi (format PDF/DOC/DOCX).

---

### Tahap 2: Pemeriksaan Draf oleh AI Pra-Harmonisasi (*AI Legal Drafting Checker*)
Sebelum dokumen dibawa ke forum Rapat Harmonisasi resmi, Pokja memanfaatkan fitur **Asisten AI**:
1. **Analisis Sistematika & Kaidah**:
   - AI memindai seluruh naskah draf peraturan berdasarkan standar teknik penyusunan peraturan perundang-undangan (sesuai **UU No. 12 Tahun 2011** jo. **UU No. 13 Tahun 2022**).
2. **Kategori yang Diperiksa oleh AI**:
   - **Kesesuaian Format & Struktur**: Kerangka judul, pembukaan (*opening*), konsiderans menimbang, dasar hukum mengingat, diktum, batang tubuh (bab, bagian, paragraf, pasal, ayat), hingga ketentuan penutup.
   - **Kaidah Bahasa & Penulisan Hukum**: Konsistensi peristilahan, kata baku, penggunaan singkatan/akronim, dan ketepatan frasa perundang-undangan.
   - **Konsistensi Penomoran**: Pengecekan urutan pasal, ayat, huruf, dan angka agar tidak ada yang melompat atau ganda.
3. **Luaran Pemeriksaan AI**:
   - Skor tingkat kesesuaian draf (misal: 85%).
   - Ringkasan temuan potensi kesalahan dan rekomendasi perbaikan sebelum rapat.
   - Pokja dan perancang peraturan dapat melakukan perbaikan awal sehingga saat rapat harmonisasi pembahasan menjadi jauh lebih efisien.

---

### Tahap 3: Pelaksanaan Rapat Harmonisasi & Pengunggahan Dokumen Luaran
1. Kanwil Kementerian Hukum Provinsi Riau menggelar **Rapat Harmonisasi** bersama perancang peraturan dan pihak pemrakarsa daerah.
2. Setelah rapat harmonisasi selesai, dihasilkan dokumen resmi luaran hasil rapat:
   1. **Surat Hasil / Surat Keterangan Selesai Harmonisasi** (*Surat Selesai*)
   2. **Draf Rancangan Hasil Harmonisasi** (*Naskah Ranperda/Ranperkada final hasil perbaikan rapat*)
   3. **Dokumen Analisis Konsepsi**
   4. *(Dokumen pendukung lainnya jika ada, seperti Berita Acara / Matriks)*
3. Pokja mengunggah dokumen-dokumen hasil harmonisasi tersebut ke sistem HARMONITAS.
4. Sistem secara otomatis memperbarui status berkas dan mengirimkan **notifikasi ke akun Biro Hukum / Bagian Hukum** daerah terkait.

---

### Tahap 4: Notifikasi & Penelaahan oleh Biro Hukum
1. Biro Hukum Pemprov Riau atau Bagian Hukum Pemerintah Kabupaten/Kota menerima notifikasi otomatis di sistem.
2. Biro Hukum membuka berkas pada sistem HARMONITAS untuk memeriksa, menelaah, dan mengunduh seluruh dokumen hasil harmonisasi yang telah diunggah oleh Pokja.

---

### Tahap 5: Keputusan Akhir oleh Biro Hukum (*Approval / Rejection*)
Biro Hukum melakukan evaluasi atas naskah hasil harmonisasi, kemudian memilih salah satu tindakan di sistem:
* **Opsi A: [SETUJUI / SELESAI]**
  - Jika hasil harmonisasi telah sesuai dengan substansi daerah.
  - Status berkas otomatis berubah menjadi: `SELESAI (TUNTAS)`.
  - Berkas masuk ke arsip final dan dapat dicetak/didistribusikan untuk proses penetapan/pengundangan.
* **Opsi B: [TOLAK / PERLU PERBAIKAN]**
  - Jika terdapat klausul atau substansi yang masih belum disepakati atau memerlukan koordinasi tambahan.
  - Biro Hukum wajib mengisi **kolom catatan / alasan penolakan**.
  - Status berkas berubah menjadi: `PERLU PERBAIKAN (REVISI)` dan notifikasi terkirim kembali ke Pokja terkait untuk ditindaklanjuti.

---

## 4. INVENTARIS DOKUMEN DALAM SISTEM

```
Siklus Berkas di HARMONITAS:
├── 1. TAHAP PRA-HARMONISASI
│   ├── Draf Awal Ranperda / Ranperkada (Diuji dengan AI Format Checker)
│   └── Surat Permohonan / Pengantar
│
└── 2. TAHAP PASCA-RAPAT HARMONISASI (Diunggah oleh Pokja Kanwil Riau)
    ├── 1. Surat Selesai / Hasil Harmonisasi
    ├── 2. Draf Rancangan Hasil Harmonisasi (Naskah Regulasi)
    ├── 3. Dokumen Analisis Konsepsi
    └── 4. Dokumen Pendukung Lainnya (Matriks/Lampiran jika ada)
```

---

## 5. SPESIFIKASI FITUR KECERDASAN BUATAN (AI PRA-HARMONISASI)

Fitur AI pada sistem difokuskan pada tahap **Pra-Harmonisasi** sebagai asisten perancang peraturan (*Legal Drafter Assistant*):

| Komponen Analisis | Aspek yang Diperiksa AI | Dasar Acuan / Standar |
| :--- | :--- | :--- |
| **Format & Kerangka** | Judul, Konsiderans Menimbang, Dasar Hukum Mengingat, Batang Tubuh, Penutup | UU 12/2011 & UU 13/2022 (Lampiran II) |
| **Struktur Pasal & Ayat** | Konsistensi penomoran pasal, ayat bertingkat, rincian huruf/angka | Sistematika Peraturan Perundang-undangan |
| **Kaidah Bahasa Hukum** | Baku kata, ejaan, konsistensi istilah teknis, larangan frasa multitafsir | Pedoman Bahasa Perundang-undangan |
| **Rekomendasi Perbaikan** | Memberikan saran alternatif perbaikan kalimat/frasa secara otomatis | AI Rule-based & LLM Analysis |

---

## 6. STATUS TAHAPAN BERKAS (*LIFECYCLE STATUS*)

| Kode Status | Label Status | Penanggung Jawab Aktif | Keterangan |
| :--- | :--- | :--- | :--- |
| `DRAFT_INPUTTED` | Draf Awal Diinput & Dianalisis AI | Pokja Kanwil Riau | Draf masuk dan dicek formatnya via AI |
| `IN_HARMONISASI` | Dalam Pelaksanaan Rapat Harmonisasi | Pokja Kanwil & Perancang | Rapat harmonisasi sedang berlangsung |
| `HARMONISASI_UPLOADED` | Dokumen Hasil Harmonisasi Diunggah | Pokja Kanwil Riau | Surat Selesai, Draf, & Analisis Konsepsi siap |
| `WAITING_BIRO_APPROVAL` | Menunggu Persetujuan Biro Hukum | Biro / Bagian Hukum | Notifikasi terkirim ke Pemda |
| `COMPLETED_APPROVED` | Disetujui & Selesai (Tuntas) | Arsip Sistem | Berkas selesai dan disetujui Biro Hukum |
| `REJECTED_REVISION` | Ditolak / Perlu Perbaikan | Pokja Kanwil Riau | Berkas dikembalikan dengan catatan revisi |
