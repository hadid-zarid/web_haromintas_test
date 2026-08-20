-- ==============================================================================
-- SKRIP DATABASE APLIKASI HARMONITAS
-- Kantor Wilayah Kementerian Hukum Provinsi Riau
-- RDBMS: MySQL 8.0+ / MariaDB 10.4+
-- Kompatibel: phpMyAdmin / MySQL CLI / DBeaver / Navicat
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- ------------------------------------------------------------------------------
-- 1. DATABASE INITIALIZATION (Opsional jika database sudah dipilih di phpMyAdmin)
-- ------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `harmonitas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `harmonitas`;

-- ------------------------------------------------------------------------------
-- 2. DROP EXISTING TABLES (Untuk Clean Install)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `harmonisasi_status_histories`;
DROP TABLE IF EXISTS `biro_hukum_responses`;
DROP TABLE IF EXISTS `ai_analisis_findings`;
DROP TABLE IF EXISTS `ai_analisis_drafts`;
DROP TABLE IF EXISTS `dokumen_harmonisasi`;
DROP TABLE IF EXISTS `harmonisasi_requests`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `wilayahs`;
DROP TABLE IF EXISTS `pokjas`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;

-- ------------------------------------------------------------------------------
-- 3. TABEL SISTEM & LARAVEL CORE
-- ------------------------------------------------------------------------------

-- Tabel Sesi Login
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Cache Laravel
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Queue Jobs (Pemrosesan Asynchronous AI & File)
CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Reset Password
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Notifikasi Sistem
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABEL MASTER DATA (POKJA & WILAYAH)
-- ------------------------------------------------------------------------------

-- Tabel Master Pokja Kanwil Riau
CREATE TABLE `pokjas` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_pokja` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Pokja 1, Pokja 2, Pokja 3',
  `keterangan` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Master 13 Wilayah di Riau
CREATE TABLE `wilayahs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pokja_id` bigint(20) UNSIGNED NOT NULL,
  `nama_wilayah` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_wilayah` enum('PROVINSI','KABUPATEN','KOTA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_wilayah` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wilayahs_kode_unique` (`kode_wilayah`),
  KEY `wilayahs_pokja_id_foreign` (`pokja_id`),
  CONSTRAINT `fk_wilayahs_pokja` FOREIGN KEY (`pokja_id`) REFERENCES `pokjas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABEL PENGGUNA & RBAC (USERS)
-- ------------------------------------------------------------------------------

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pokja_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Terisi jika role = POKJA',
  `wilayah_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'Terisi jika role = BIRO_HUKUM',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','POKJA','BIRO_HUKUM','PIMPINAN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'POKJA',
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `avatar_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_pokja_id_foreign` (`pokja_id`),
  KEY `users_wilayah_id_foreign` (`wilayah_id`),
  KEY `users_role_index` (`role`),
  CONSTRAINT `fk_users_pokja` FOREIGN KEY (`pokja_id`) REFERENCES `pokjas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_users_wilayah` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayahs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL UTAMA PERMOHONAN & REGULASI (HARMONISASI_REQUESTS)
-- ------------------------------------------------------------------------------

CREATE TABLE `harmonisasi_requests` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomor_register` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Format: REG-HAR/YYYY/MM/XXXX',
  `wilayah_id` bigint(20) UNSIGNED NOT NULL,
  `pokja_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL COMMENT 'User Pokja yang menginput',
  `judul_peraturan` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_peraturan` enum('RANPERDA','RANPERKADA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori_peraturan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Umum',
  `tahun_pengajuan` year(4) NOT NULL,
  `status` enum(
    'DRAFT_INPUTTED',
    'IN_HARMONISASI',
    'HARMONISASI_UPLOADED',
    'WAITING_BIRO_APPROVAL',
    'COMPLETED_APPROVED',
    'REJECTED_REVISION'
  ) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT_INPUTTED',
  `tgl_pengajuan` date NOT NULL,
  `tgl_rapat_harmonisasi` date DEFAULT NULL,
  `tgl_selesai_harmonisasi` date DEFAULT NULL,
  `tgl_persetujuan_biro` date DEFAULT NULL,
  `ringkasan_materi` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan_umum` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft Delete',
  PRIMARY KEY (`id`),
  UNIQUE KEY `harmonisasi_requests_nomor_unique` (`nomor_register`),
  KEY `harmonisasi_requests_wilayah_id_foreign` (`wilayah_id`),
  KEY `harmonisasi_requests_pokja_id_foreign` (`pokja_id`),
  KEY `harmonisasi_requests_created_by_foreign` (`created_by`),
  KEY `harmonisasi_requests_status_index` (`status`),
  KEY `harmonisasi_requests_jenis_index` (`jenis_peraturan`),
  KEY `harmonisasi_requests_tahun_index` (`tahun_pengajuan`),
  CONSTRAINT `fk_harmonisasi_wilayah` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayahs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_harmonisasi_pokja` FOREIGN KEY (`pokja_id`) REFERENCES `pokjas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_harmonisasi_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABEL DOKUMEN DIGITAL BERKAS (DOKUMEN_HARMONISASI)
-- ------------------------------------------------------------------------------

CREATE TABLE `dokumen_harmonisasi` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `harmonisasi_request_id` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED NOT NULL,
  `jenis_dokumen` enum(
    'DRAFT_AWAL',
    'SURAT_PERMOHONAN',
    'SURAT_SELESAI',
    'DRAFT_HASIL_HARMONISASI',
    'ANALISIS_KONSEPSI',
    'DOKUMEN_PENDUKUNG'
  ) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_file_asli` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ukuran_file_bytes` bigint(20) UNSIGNED NOT NULL,
  `versi` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `keterangan` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dokumen_harmonisasi_request_foreign` (`harmonisasi_request_id`),
  KEY `dokumen_harmonisasi_uploaded_by_foreign` (`uploaded_by`),
  KEY `dokumen_harmonisasi_jenis_index` (`jenis_dokumen`),
  CONSTRAINT `fk_dokumen_harmonisasi_request` FOREIGN KEY (`harmonisasi_request_id`) REFERENCES `harmonisasi_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dokumen_harmonisasi_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABEL AI PRA-HARMONISASI (AI_ANALISIS_DRAFTS & AI_ANALISIS_FINDINGS)
-- ------------------------------------------------------------------------------

CREATE TABLE `ai_analisis_drafts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `harmonisasi_request_id` bigint(20) UNSIGNED NOT NULL,
  `dokumen_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Berkas draf awal yang diuji',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Pokja yang mentrigger proses AI',
  `model_ai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gemini-2.0-flash',
  `skor_kesesuaian` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT '0.00 - 100.00%',
  `skor_format_kerangka` decimal(5,2) NOT NULL DEFAULT 0.00,
  `skor_struktur_pasal` decimal(5,2) NOT NULL DEFAULT 0.00,
  `skor_bahasa_hukum` decimal(5,2) NOT NULL DEFAULT 0.00,
  `total_temuan` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `ringkasan_eksekutif` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_analisis` enum('PENDING','PROCESSING','COMPLETED','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `raw_response_json` json DEFAULT NULL,
  `total_tokens_used` int(10) UNSIGNED DEFAULT NULL,
  `execution_time_seconds` decimal(6,2) DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ai_drafts_request_foreign` (`harmonisasi_request_id`),
  KEY `ai_drafts_dokumen_foreign` (`dokumen_id`),
  KEY `ai_drafts_user_foreign` (`user_id`),
  KEY `ai_drafts_status_index` (`status_analisis`),
  CONSTRAINT `fk_ai_drafts_request` FOREIGN KEY (`harmonisasi_request_id`) REFERENCES `harmonisasi_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ai_drafts_dokumen` FOREIGN KEY (`dokumen_id`) REFERENCES `dokumen_harmonisasi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ai_drafts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ai_analisis_findings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ai_analisis_draft_id` bigint(20) UNSIGNED NOT NULL,
  `kategori` enum(
    'FORMAT_KERANGKA',
    'STRUKTUR_PASAL_AYAT',
    'BAHASA_HUKUM',
    'KONSISTENSI_PENOMORAN',
    'KONSIDERANS_DASAR_HUKUM'
  ) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tingkat_urgensi` enum('CRITICAL','WARNING','SUGGESTION','INFO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WARNING',
  `lokasi_bagian` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Misal: Konsiderans Menimbang b, Pasal 14',
  `teks_asli` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskripsi_masalah` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `saran_perbaikan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `dasar_hukum_rujukan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Acuan UU 12/2011 & UU 13/2022',
  `is_resolved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ai_findings_draft_foreign` (`ai_analisis_draft_id`),
  KEY `ai_findings_kategori_index` (`kategori`),
  KEY `ai_findings_urgensi_index` (`tingkat_urgensi`),
  CONSTRAINT `fk_ai_findings_draft` FOREIGN KEY (`ai_analisis_draft_id`) REFERENCES `ai_analisis_drafts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABEL VALIDASI BIRO HUKUM (BIRO_HUKUM_RESPONSES)
-- ------------------------------------------------------------------------------

CREATE TABLE `biro_hukum_responses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `harmonisasi_request_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Pejabat Biro Hukum yang merespon',
  `keputusan` enum('SETUJUI','TOLAK_REVISI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `catatan_alasan` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Wajib diisi jika TOLAK_REVISI',
  `tgl_respon` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_telaah_balasan` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `biro_responses_request_foreign` (`harmonisasi_request_id`),
  KEY `biro_responses_user_foreign` (`user_id`),
  KEY `biro_responses_keputusan_index` (`keputusan`),
  CONSTRAINT `fk_biro_responses_request` FOREIGN KEY (`harmonisasi_request_id`) REFERENCES `harmonisasi_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_biro_responses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TABEL HISTORI STATUS & AUDIT LOG (HARMONISASI_STATUS_HISTORIES & AUDIT_LOGS)
-- ------------------------------------------------------------------------------

CREATE TABLE `harmonisasi_status_histories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `harmonisasi_request_id` bigint(20) UNSIGNED NOT NULL,
  `changed_by` bigint(20) UNSIGNED NOT NULL,
  `status_sebelumnya` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_baru` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status_histories_request_foreign` (`harmonisasi_request_id`),
  KEY `status_histories_changed_by_foreign` (`changed_by`),
  CONSTRAINT `fk_status_histories_request` FOREIGN KEY (`harmonisasi_request_id`) REFERENCES `harmonisasi_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_status_histories_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_foreign` (`user_id`),
  KEY `audit_logs_action_index` (`action`),
  KEY `audit_logs_module_index` (`module`),
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. DATA SEEDER AWAL (MASTER DATA & USER DEMO)
-- Password default semua akun demo: "password"
-- (Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- ------------------------------------------------------------------------------

-- Insert 3 Pokja
INSERT INTO `pokjas` (`id`, `nama_pokja`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'Pokja 1', 'Membina Pemprov Riau, Kab. Siak, Kab. Kampar, Kab. Inhil, Kab. Bengkalis', NOW(), NOW()),
(2, 'Pokja 2', 'Membina Kab. Rokan Hulu, Kab. Inhu, Kab. Meranti, Kota Dumai', NOW(), NOW()),
(3, 'Pokja 3', 'Membina Kab. Kuansing, Kab. Pelalawan, Kab. Rohil, Kota Pekanbaru', NOW(), NOW());

-- Insert 13 Wilayah
INSERT INTO `wilayahs` (`id`, `pokja_id`, `nama_wilayah`, `jenis_wilayah`, `kode_wilayah`, `created_at`, `updated_at`) VALUES
-- Pokja 1
(1, 1, 'Pemerintah Provinsi Riau', 'PROVINSI', 'RIAU-PROV', NOW(), NOW()),
(2, 1, 'Kabupaten Siak', 'KABUPATEN', 'KAB-SIAK', NOW(), NOW()),
(3, 1, 'Kabupaten Kampar', 'KABUPATEN', 'KAB-KMP', NOW(), NOW()),
(4, 1, 'Kabupaten Indragiri Hilir', 'KABUPATEN', 'KAB-INHIL', NOW(), NOW()),
(5, 1, 'Kabupaten Bengkalis', 'KABUPATEN', 'KAB-BKL', NOW(), NOW()),
-- Pokja 2
(6, 2, 'Kabupaten Rokan Hulu', 'KABUPATEN', 'KAB-ROHUL', NOW(), NOW()),
(7, 2, 'Kabupaten Indragiri Hulu', 'KABUPATEN', 'KAB-INHU', NOW(), NOW()),
(8, 2, 'Kabupaten Kepulauan Meranti', 'KABUPATEN', 'KAB-MERANTI', NOW(), NOW()),
(9, 2, 'Kota Dumai', 'KOTA', 'KOTA-DUMAI', NOW(), NOW()),
-- Pokja 3
(10, 3, 'Kabupaten Kuantan Singingi', 'KABUPATEN', 'KAB-KUANSING', NOW(), NOW()),
(11, 3, 'Kabupaten Pelalawan', 'KABUPATEN', 'KAB-PELALAWAN', NOW(), NOW()),
(12, 3, 'Kabupaten Rokan Hilir', 'KABUPATEN', 'KAB-ROHIL', NOW(), NOW()),
(13, 3, 'Kota Pekanbaru', 'KOTA', 'KOTA-PEKANBARU', NOW(), NOW());

-- Insert Akun Demo Pengguna untuk Setiap Peran
INSERT INTO `users` (`id`, `pokja_id`, `wilayah_id`, `name`, `email`, `password`, `nip`, `jabatan`, `no_hp`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 'Administrator Sistem Kanwil', 'admin@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198801012015011001', 'Pranata Komputer Ahli', '081234567890', 'ADMIN', 'ACTIVE', NOW(), NOW()),
(2, 1, NULL, 'Tim Pokja 1 Kanwil Riau', 'pokja1@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198505122010011002', 'Perancang Peraturan Ahli Muda', '081234567891', 'POKJA', 'ACTIVE', NOW(), NOW()),
(3, 2, NULL, 'Tim Pokja 2 Kanwil Riau', 'pokja2@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198708202012011003', 'Perancang Peraturan Ahli Muda', '081234567892', 'POKJA', 'ACTIVE', NOW(), NOW()),
(4, 3, NULL, 'Tim Pokja 3 Kanwil Riau', 'pokja3@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198903152014012001', 'Perancang Peraturan Ahli Muda', '081234567893', 'POKJA', 'ACTIVE', NOW(), NOW()),
(5, NULL, 1, 'Biro Hukum Setda Provinsi Riau', 'birohukum.riau@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '197911022005011004', 'Kepala Biro Hukum Setda Prov Riau', '081234567894', 'BIRO_HUKUM', 'ACTIVE', NOW(), NOW()),
(6, NULL, 2, 'Bagian Hukum Setda Kab. Siak', 'baghukum.siak@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198207182008011005', 'Kepala Bagian Hukum Setda Siak', '081234567895', 'BIRO_HUKUM', 'ACTIVE', NOW(), NOW()),
(7, NULL, 13, 'Bagian Hukum Setda Kota Pekanbaru', 'baghukum.pekanbaru@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '198104252006012003', 'Kepala Bagian Hukum Setda Pekanbaru', '081234567896', 'BIRO_HUKUM', 'ACTIVE', NOW(), NOW()),
(8, NULL, NULL, 'Kepala Kantor Wilayah Kemenkumham Riau', 'kakanwil.riau@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '196803201994031001', 'Kepala Kantor Wilayah', '081234567897', 'PIMPINAN', 'ACTIVE', NOW(), NOW()),
(9, NULL, NULL, 'Kepala Divisi Pelayanan Hukum dan HAM', 'kadiv.kumham@harmonitas.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '197209141998031002', 'Kepala Divisi Pelayanan Hukum', '081234567898', 'PIMPINAN', 'ACTIVE', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
