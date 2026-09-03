# Test Manual (Black-Box) — Perubahan Branch `fix/security-review-findings`

Hanya menguji bagian yang **diubah** oleh 5 perbaikan keamanan. Kerjakan setelah:

```bash
git checkout fix/security-review-findings
npm run build
php artisan config:clear
```

Legenda hasil: ✅ = harus berhasil / tampil · ⛔ = harus ditolak / tidak terjadi

---

## 0. Persiapan

- [ ] Siapkan 3 sesi browser (atau mode incognito terpisah), login sebagai:
  **Admin**, **Tim Kerja** (mis. Tim Kerja 1), **Biro Hukum**. Password default `password`.
- [ ] Siapkan minimal 1 berkas permohonan di wilayah binaan Tim Kerja 1, status masih
  "Draf Awal" atau "Proses Harmonisasi" (belum "Selesai").
- [ ] Buka DevTools (F12) → tab **Network** di tiap sesi.

---

## 1. Perubahan status berkas (Temuan 1) — paling penting

### 1a. Alur OTOMATIS harus tetap jalan (regresi)
| Langkah | Hasil |
|---|---|
| Login **Tim Kerja**. Buka sebuah berkas. Upload Dokumen 1 sampai 5. | ✅ Setelah dokumen ke-5, status berkas otomatis berubah jadi **"Proses Fasilitasi"** + notifikasi ke Biro Hukum |
| Login **Biro Hukum**. Buka berkas yang sama. Upload Dokumen 7 (PDF). | ✅ Status otomatis berubah jadi **"Selesai"** |

### 1b. Biro Hukum & Admin tetap bisa memutuskan manual (regresi)
| Langkah | Hasil |
|---|---|
| Login **Biro Hukum**. Buka berkas berstatus "Proses Fasilitasi" dengan Dok 1-5 lengkap. Klik tombol **Setujui / Selesai**, isi catatan, lampirkan surat PDF, submit. | ✅ Status jadi "Selesai", surat tersimpan, muncul notifikasi sukses |
| Login **Biro Hukum**. Berkas lain → klik **Tolak / Perlu Perbaikan**, isi catatan, submit. | ✅ Status jadi "Perlu Perbaikan" |
| Login **Admin**. Ulangi salah satu di atas. | ✅ Berhasil |

### 1c. Tim Kerja TIDAK bisa mengubah status manual (inti perbaikan)
| Langkah | Hasil |
|---|---|
| Login **Tim Kerja**. Buka daftar permohonan → tombol Edit sebuah berkas. Kalau ada dropdown "Status", ganti ke "Selesai", ubah juga judul/keterangan, simpan. | ✅ Judul/keterangan **tersimpan**, ⛔ **status TIDAK berubah** (tetap seperti semula) |
| Login **Tim Kerja**. DevTools → Console, jalankan panggilan langsung ke endpoint keputusan: <br>`fetch('/peraturan/<ID_BERKAS>/status', {method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]').content}, body: JSON.stringify({status_id:4, catatan:'test'})}).then(r=>console.log(r.status))` | ⛔ Response **403** (Akses Ditolak) |
| Cek berkas tadi setelah percobaan itu. | ✅ Status tidak berubah |
| Login **Tim Kerja**, buka berkas di **luar** wilayah binaannya, coba hal yang sama. | ⛔ 403 (tetap seperti sebelumnya) |

---

## 2. Generator Surat DOCX (Temuan 2)

### 2a. Fungsi normal (regresi)
| Langkah | Hasil |
|---|---|
| Buka menu Draft Generator / modal "Generator Surat". Pilih **PERDA**, isi form, klik **Unduh Word (.docx)**. | ✅ File `.docx` terunduh, dibuka di Word tampil rapi, nilai form terisi benar |
| Di dalam surat PERDA, cek dasar hukumnya. | ✅ Tertulis **"Pasal 58 Undang-Undang Nomor 12 Tahun 2011"** |
| Ganti ke **PERKADA**, unduh lagi. | ✅ File terunduh; dasar hukum tertulis **"Pasal 97D Undang-Undang Nomor 13 Tahun 2022..."** |
| Klik tombol **Cetak / PDF**. | ✅ Dialog cetak muncul dengan isi surat |

### 2b. File template tidak ikut berubah (inti perbaikan)
| Langkah | Hasil |
|---|---|
| Catat tanggal-modifikasi file `SURAT SELESAI PERKADA.docx` di folder proyek (klik kanan → Properties). | — |
| Generate surat **PERKADA** 2-3 kali lewat aplikasi. | — |
| Cek lagi tanggal-modifikasi file itu. | ✅ **Tidak berubah** (sebelum perbaikan, file ini ditimpa tiap generate PERKADA) |

### 2c. Endpoint hanya menerima POST + input divalidasi (inti perbaikan)
| Langkah | Hasil |
|---|---|
| Tempel di address bar browser (saat sudah login): `https://<site>/api/generate-surat-docx?type=perda` | ⛔ **405 Method Not Allowed** (bukan file terunduh) |
| DevTools Console: `fetch('/api/generate-surat-docx',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]').content},body:JSON.stringify({type:'xxx'})}).then(r=>console.log(r.status))` | ⛔ **400** |
| Sama seperti di atas tapi `type:'../../public/tes'` | ⛔ **400**, dan ✅ tidak ada file baru muncul di folder `public/` atau `storage/` |
| Console: `fetch('/api/generate-surat-docx',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'perda'})}).then(r=>console.log(r.status))` (tanpa token CSRF) | ⛔ **419** (Page Expired / token mismatch) |

---

## 3. Login Google (Temuan 3)

| Langkah | Hasil |
|---|---|
| Di dev server (`APP_ENV=local`), login lewat tombol **Masuk dengan Google** pakai akun @gmail.com yang sudah didaftarkan Admin. | ✅ Berhasil masuk (perilaku sama seperti sebelumnya di lokal) |
| Login Google pakai akun @gmail.com yang **belum** didaftarkan Admin. | ⛔ Ditolak dengan pesan "belum terdaftar" (tetap seperti sebelumnya) |
| *(Opsional, uji proteksi produksi)* Ubah sementara `.env` → `APP_ENV=production`, `php artisan config:clear`, lalu coba login Google **tanpa** `curl.cainfo` di php.ini. | ⛔ Login Google **gagal** ("terjadi kendala") — membuktikan verifikasi TLS kini wajib. **Kembalikan `.env` ke `local` setelah tes.** |

---

## 4. Lupa Password (Temuan 4)

| Langkah | Hasil |
|---|---|
| Pastikan `.env` `MAIL_MAILER=log` dan `APP_ENV=local`. Buka **Lupa Password**, masukkan email petugas yang valid, submit. | ✅ Pesan sukses muncul **dengan** kotak kuning "[Mode Pengembang Lokal]" berisi tautan reset |
| Buka `storage/logs/laravel.log`, cari baris terbaru "Gagal mengirim email reset password". | ✅ Ada baris `email` + `error`, ⛔ **TIDAK ada** `reset_url` / token di log |
| *(Opsional)* Ubah `.env` → `APP_ENV=staging`, `config:clear`, ulangi Lupa Password. | ⛔ Pesan sukses muncul **tanpa** kotak tautan reset. Kembalikan ke `local` setelah tes. |
| Selesaikan 1 alur reset password normal sampai bisa login dengan password baru. | ✅ Berfungsi (regresi) |

---

## 5. Data pengguna di halaman (Temuan 5)

Cara lihat data mentah: DevTools → **Network** → reload halaman → klik request paling atas (dokumen/`X-Inertia`) → tab **Response/Preview** → cari objek yang dimaksud.

| Langkah | Hasil |
|---|---|
| Login user apa saja. Buka **Detail Berkas** sebuah permohonan. Di Network response, cari objek `permohonan.uploader`. | ✅ Hanya berisi kira-kira `user_id`, `nama`, `role_id`, `name`, `role`. ⛔ **Tidak ada** `email`, `nip`, `no_hp`, `google_id`, `password` |
| Di response yang sama, cari `auditLogs[].user` (atau `dokumens[].uploader`). | ✅ Sama — hanya field minimal, ⛔ tanpa `email`/`nip`/`no_hp`/`google_id` |
| Buka **Dashboard / Beranda**. Di response cari `recentActivities[].user`. | ✅ Field minimal saja |
| Regresi tampilan: di Detail Berkas, nama petugas pengunggah tetap tampil ("Petugas: ..."). Di riwayat aktivitas, nama pelaku tetap tampil. | ✅ Nama tetap muncul benar |
| Buka halaman **Kelola Akun** sebagai Admin, klik Edit sebuah user. | ✅ Form tetap terisi `email`, `nip`, `no_hp` (halaman admin memang boleh — ini via endpoint berbeda) |

---

## Ringkasan yang wajib lolos sebelum merge

- [ ] 1a + 1b (alur status normal tidak rusak)
- [ ] 1c (Tim Kerja dapat 403 saat paksa ubah status)
- [ ] 2a (unduh & cetak surat masih jalan, PERDA vs PERKADA benar)
- [ ] 2c baris CSRF (tanpa token → 419) dan GET → 405
- [ ] 3 baris pertama (login Google lokal masih jalan)
- [ ] 4 baris kedua (tidak ada token di log)
- [ ] 5 baris pertama (uploader tanpa email/nip/no_hp/google_id)
