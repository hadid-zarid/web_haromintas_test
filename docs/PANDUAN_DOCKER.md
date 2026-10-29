# Panduan Menjalankan HARMONITAS dengan Docker

Panduan ini dimulai **setelah repo di-clone/pull**, untuk tiga keadaan:

- **Jalur A — instalasi baru** (database kosong).
- **Jalur B — dari backup** (memindahkan data, mis. ke server Pusdatin atau ke laptop lain).
- **Laptop sebagai server sementara** (Windows + Docker Desktop), termasuk serah-terima antar dua laptop.

Semua perintah ditulis untuk **bash**: terminal server Linux, atau **Git Bash** di Windows (bukan PowerShell/CMD).
Jalankan dari folder proyek (yang berisi `docker-compose.yml`).

---

## 1. Konsep singkat

| Istilah | Artinya di sini |
|---|---|
| **Image** | "Cetakan" aplikasi yang sudah jadi (kode + PHP + library). Dibuat dengan `build`, bisa disimpan ke file (`docker save`) dan dimuat lagi (`docker load`). |
| **Container** | Image yang sedang **berjalan**. Bisa dimatikan/dihapus tanpa kehilangan data, selama data ada di volume/folder. |
| **Bind mount** | Folder biasa di komputer yang "ditempelkan" ke container, mis. `./data/storage`. Mudah dilihat dan dibackup. |
| **Volume** | Penyimpanan yang dikelola Docker (tidak terlihat sebagai folder biasa). Dipakai untuk database di laptop Windows. |
| **Compose** | `docker-compose.yml` = daftar semua container + pengaturannya; dijalankan bersama dengan `docker compose ...`. |

HARMONITAS terdiri dari 5 layanan (container):

| Layanan | Isi | Data tersimpan di |
|---|---|---|
| `web` | Caddy: pintu masuk HTTP/HTTPS, file statis, meneruskan ke `app` dan `/ai-api/*` ke `ai-checker` | `data/caddy` (sertifikat HTTPS) |
| `app` | Laravel (PHP-FPM) | `data/storage` (dokumen unggahan, foto profil, log) |
| `db` | MySQL 8.4 — database aplikasi | `data/mysql` (server Linux) / volume `latihan-mysql` (laptop) |
| `pg` | Postgres + pgvector — database AI | `data/postgres` / volume `latihan-pg` |
| `ai-checker` | Layanan AI Document Checker (repo terpisah `ai-dokumen`) | `data/ai-cache` (model, bisa diunduh ulang) |

**Yang wajib dijaga / dibackup:** database `db`, database `pg`, `data/storage`, dan file `.env` + `ai-dokumen/.env` (berisi semua kunci rahasia; tidak ada di git).

---

## 2. Prasyarat

**Server Linux:** Docker Engine + plugin compose (`docker compose version` harus jalan), git.

**Laptop Windows:**

1. Pasang WSL (PowerShell **Run as administrator**), lalu **restart**:
   ```bash
   wsl --install --no-distribution
   ```
   Cek setelah restart: `wsl --status` → harus `Default Version: 2`.
2. Pasang **Docker Desktop**, buka, tunggu kiri bawah **Engine running**.
3. (Disarankan bila C: sempit) Docker Desktop → Settings → Resources → Advanced → **Disk image location** ke `D:\DockerData`.
4. **Git Bash** (ikut terpasang bersama Git for Windows) untuk menjalankan perintah di panduan ini.

---

## 3. Ambil kode

```bash
git clone -b docker-vps https://github.com/hadid-zarid/web_haromintas_test.git harmonitas
cd harmonitas
git clone https://github.com/dream321team-arch/ai-dokumen.git ai-dokumen
```

Folder proyek sebaiknya bernama `harmonitas`. Nama folder menjadi nama proyek compose, sehingga nama image (`harmonitas-app`, `harmonitas-ai-checker`, …) cocok dengan file image di backup. Di laptop Windows, taruh **di luar** folder pengembangan, mis. `D:\HARMONITAS-Docker\harmonitas`.

Sudah punya clone? Cukup `git pull`.

---

## 4. Isi `.env`

- **Dari backup** (Jalur B): ambil `.env` dan `ai-dokumen/.env` asli dari `harmonitas-config.tar.gz` (ada di backup lengkap/7z):
  ```bash
  tar -xzf /path/ke/harmonitas-config.tar.gz .env ai-dokumen/.env
  ```
- **Instalasi baru** (Jalur A): `cp .env.docker.example .env`, lalu isi yang kosong. Untuk `ai-dokumen/.env`, pakai `ai-dokumen/.env.example` dari repo AI.

Lalu sesuaikan dengan tempat menjalankan:

| Kunci | Server ber-domain | Laptop |
|---|---|---|
| `APP_URL` | `https://harmonitas-riau.web.id` | `http://localhost:8000` |
| `SITE_ADDRESS` | `harmonitas-riau.web.id` (Caddy membuat HTTPS otomatis) | `:80` |
| `GOOGLE_REDIRECT_URI` | `https://<domain>/auth/google/callback` | `http://localhost:8000/auth/google/callback` |
| `RECAPTCHA_ENABLED` | `true` (kunci terdaftar untuk domain itu) | `false` |
| `MAIL_MAILER` | `resend` | `resend` (email sungguhan) atau `log` (tidak terkirim) |

`DB_HOST` harus `db`. Jangan isi `TRUSTED_PROXIES` dengan `*`.

---

## 5. (Hanya laptop Windows) `docker-compose.override.yml`

Buat file ini di folder proyek. Compose membacanya otomatis bersama `docker-compose.yml`. **Jangan** dipakai di server Linux.

```yaml
# KHUSUS LAPTOP WINDOWS — jangan dipakai di server Linux.
services:
  web:
    ports: !override
      - "127.0.0.1:8000:80"
  db:
    volumes:
      - latihan-mysql:/var/lib/mysql
  pg:
    volumes:
      - latihan-pg:/var/lib/postgresql/data

volumes:
  latihan-mysql:
  latihan-pg:
```

Kenapa perlu file ini:

- **Database di volume, bukan di folder Windows.** MySQL menolak menyimpan data di folder Windows, karena Windows tidak membedakan huruf besar/kecil.
- **Hanya port `127.0.0.1:8000`.** Web hanya bisa dibuka dari laptop itu sendiri, bukan oleh orang lain di Wi-Fi yang sama. `!override` mengganti port 80/443 bawaan.
- **Nama volume `latihan-*` jangan diganti** setelah berisi data. Mengganti nama berarti volume baru yang kosong.

---

## 6. Jalur A — instalasi baru (database kosong)

Butuh internet (build mengunduh paket).

```bash
docker compose build
docker compose run --rm app php artisan key:generate --show
```

Tempel hasil `base64:...` ke `APP_KEY=` di `.env`, lalu:

```bash
docker compose up -d
docker compose exec app php artisan migrate --seed --force
docker compose exec app php artisan db:seed --class=AkunDefaultSeeder --force
```

Perintah terakhir membuat akun awal (`admin@harmonitas.go.id`, dll.) dan **menampilkan kata sandi acaknya sekali**. Setelah itu:

1. Login sebagai admin.
2. Ganti kata sandi di **Profil Saya**.
3. Buat akun asli lewat **Kelola Akun**.
4. Nonaktifkan akun bawaan yang tidak dipakai.

---

## 7. Jalur B — dari backup

Isi backup:

| File | Isi |
|---|---|
| `harmonitas-mysql.sql.gz` | Database aplikasi |
| `ai-postgres.dump` | Database AI |
| `harmonitas-storage.tar.gz` | Dokumen unggahan |
| `jumlah-baris.txt` | Jumlah baris per tabel, untuk pengecekan |
| `SHA256SUMS` | Hash untuk cek keutuhan |

Backup lengkap pertama (23 Okt 2026) juga berisi `harmonitas-config.tar.gz` (.env), `images-*.tar.gz` (image siap pakai), dan `ai-cache.tar.gz`.

1. **Siapkan image.** Pilih salah satu:
   ```bash
   # a) tanpa internet: muat dari backup
   docker load -i /path/ke/images-app-web-db.tar.gz
   docker load -i /path/ke/images-ai-checker.tar.gz
   # b) ada internet: build dari kode
   docker compose build
   ```
2. (Opsional) Cache model AI, supaya tidak mengunduh ulang:
   ```bash
   mkdir -p data
   tar -xzf /path/ke/ai-cache.tar.gz -C data
   ```
3. **Pulihkan data.** Skrip ini menyalakan `db` dan `pg`, lalu:
   - mengecek keutuhan file (SHA256);
   - meminta konfirmasi `YA`;
   - **membackup kondisi sekarang** ke `<induk folder backup>/sebelum-restore/`;
   - mengganti database dan dokumen;
   - mencocokkan jumlah baris;
   - menyalakan semua layanan.

   ```bash
   bash deploy/restore.sh /path/ke/folder-backup
   ```

   Harus muncul `SAMA dengan backup`.
4. **Cek:**
   ```bash
   docker compose ps
   docker compose exec app php artisan migrate:status
   ```
   Kalau ada migrasi berstatus `Pending` (kode lebih baru dari backup), jalankan `docker compose exec app php artisan migrate --force`.
5. Buka web. Lalu uji:
   - login;
   - buka satu berkas dan pratinjau dokumennya;
   - halaman Asisten AI.

---

## 8. Operasional harian

```bash
docker compose ps                  # status semua layanan
docker compose logs -f app         # log Laravel (Ctrl+C untuk keluar); ganti app dengan web/db/ai-checker
docker compose stop                # matikan (data aman)
docker compose up -d               # nyalakan lagi (laptop tanpa internet: tambah --no-build)
docker compose restart app         # restart satu layanan
```

Setelah laptop dinyalakan ulang: buka Docker Desktop. Container ikut menyala sendiri (`restart: unless-stopped`).

**Update kode** (setelah ada commit baru):

```bash
git pull
docker compose up -d --build app web
docker compose exec app php artisan migrate:status
docker compose exec app php artisan migrate --force   # hanya bila ada Pending
```

Aset frontend dibangun **di dalam image**, jadi `git pull` saja tidak cukup; wajib `--build`.

**Backup:**

```bash
bash deploy/backup.sh /path/ke/folder-backup     # Windows: mis. /d/Backup-HARMONITAS
```

Hasilnya satu folder bertanggal. Lakukan **setiap akhir hari kerja** selama laptop menjadi server. Salin juga ke tempat lain (flashdisk/Drive; kalau ke cloud, bungkus 7-Zip ber-password).

---

## 9. Dua laptop: "satu aktif, satu cadangan"

Dua laptop **tidak bisa** sama-sama dipakai input lalu datanya digabung. Berkas yang diunggah di laptop A tidak ada di laptop B. Jadi **hanya satu laptop yang aktif** dalam satu waktu.

Persiapan laptop kedua (sekali saja): bagian 2–5, lalu image (bagian 7 langkah 1). Untuk `.env`, pakai `.env` dari backup dengan penyesuaian kolom "Laptop".

**Serah-terima dari laptop A ke laptop B:**

1. **Laptop A** — backup, lalu matikan supaya tidak dipakai lagi:
   ```bash
   bash deploy/backup.sh /d/Backup-HARMONITAS
   docker compose stop
   ```
2. Salin folder backup terbaru (yang barusan dibuat) ke laptop B.
3. **Laptop B:**
   ```bash
   bash deploy/restore.sh /d/Backup-HARMONITAS/<folder-dari-laptop-A>
   ```
4. Mulai sekarang yang aktif adalah laptop B. Kembali ke A? Ulangi dengan arah terbalik.

Salah arah (data lama menimpa yang baru)? Kondisi sebelum restore tersimpan di `…/sebelum-restore/<waktu>`. Restore folder itu untuk mengembalikannya.

Pilihan yang lebih rapi adalah **satu server yang diakses semua orang** (VPS / server Pusdatin). Laptop hanya solusi sementara.

---

## 10. Login Google, reCAPTCHA, email

- **Google:** alamat di `GOOGLE_REDIRECT_URI` harus terdaftar di Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client → *Authorized redirect URIs*. Kalau muncul `redirect_uri_mismatch`, tambahkan alamat itu persis (termasuk `http`/`https` dan port). Google **tidak** menerima alamat IP lokal (`192.168.x.x`), jadi login Google hanya bisa lewat `localhost` atau domain.
- **reCAPTCHA:** kuncinya terikat ke domain. Di laptop matikan (`RECAPTCHA_ENABLED=false`), atau tambahkan `localhost` di admin reCAPTCHA.
- **Email:** `MAIL_MAILER=resend` mengirim lewat API Resend (cukup `RESEND_API_KEY`, tidak bergantung IP server). Di laptop, tautan di dalam email mengarah ke `http://localhost:8000`, sehingga hanya bisa dibuka di laptop server itu.

---

## 11. Masalah yang pernah terjadi

| Gejala | Penyebab / solusi |
|---|---|
| Docker Desktop: *Virtualization support not detected* | WSL belum terpasang → bagian 2 langkah 1, lalu restart. |
| Update Docker Desktop: *failed to install update* | Abaikan dulu; coba lagi setelah *Quit Docker Desktop* lalu buka sebagai administrator. |
| Halaman tidak terbuka di `localhost:8000` | `php artisan serve` (pengembangan) memakai port 8000 juga. Matikan, atau jalankan serve di `--port=8001`. |
| Git Bash: path `/d/...` tidak dikenali `git`/program Windows | Di Git Bash pakai `D:/folder/...` untuk program Windows. Selalu beri tanda kutip pada path berspasi. |
| MySQL gagal start di laptop | Data MySQL di folder Windows → pakai `docker-compose.override.yml` (bagian 5). |
| Dokumen berkas lama "tidak ditemukan" | 14 file unggahan 8–11 Sept 2026 sudah hilang sejak sebelum pindah ke VPS (bukan karena backup). Minta pengunggah mengunggah ulang. |

---

## 12. Keamanan

- `.env`, `ai-dokumen/.env`, dan folder backup berisi **semua kunci rahasia dan data pribadi pengguna**:
  - jangan di-commit;
  - jangan dikirim lewat chat;
  - jangan diunggah ke cloud tanpa enkripsi (7-Zip, AES-256, centang *Encrypt file names*).
- Laptop yang menjadi server: kunci layar saat ditinggal, dan aktifkan BitLocker bila tersedia.
- Di laptop, web hanya terbuka untuk `127.0.0.1`. Jangan mengubahnya menjadi `0.0.0.0` tanpa reCAPTCHA aktif.
- Password tidak pernah ditulis di perintah. Skrip backup/restore membaca password database dari dalam container.
