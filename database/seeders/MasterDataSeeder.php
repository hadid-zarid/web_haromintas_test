<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Data master HARMONITAS (ID dipakai langsung oleh kode aplikasi, jangan diubah).
 * Aman dijalankan ulang: baris dengan ID yang sama akan diperbarui.
 */
class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('role')->upsert([
            ['role_id' => 1, 'nama_role' => 'ADMIN'],
            ['role_id' => 2, 'nama_role' => 'TIM_KERJA'],
            ['role_id' => 3, 'nama_role' => 'BIRO_HUKUM'],
            ['role_id' => 4, 'nama_role' => 'PIMPINAN'],
        ], ['role_id'], ['nama_role']);

        DB::table('tim_kerja')->upsert([
            ['tim_kerja_id' => 1, 'nama_tim_kerja' => 'Tim Kerja 1', 'keterangan' => 'Membina Pemprov Riau, Kab. Siak, Kab. Kampar, Kab. Inhil, Kab. Bengkalis'],
            ['tim_kerja_id' => 2, 'nama_tim_kerja' => 'Tim Kerja 2', 'keterangan' => 'Membina Kab. Rohul, Kab. Inhu, Kab. Kep. Meranti, Kota Dumai'],
            ['tim_kerja_id' => 3, 'nama_tim_kerja' => 'Tim Kerja 3', 'keterangan' => 'Membina Kab. Kuansing, Kab. Pelalawan, Kab. Rohil, Kota Pekanbaru'],
        ], ['tim_kerja_id'], ['nama_tim_kerja', 'keterangan']);

        // tim_kerja_id = wilayah binaan Tim Kerja Kanwil
        // wilayah_biro_hukum_id = wilayah kerja Biro Hukum Setda Prov. Riau (NULL = seluruh petugas Biro Hukum)
        DB::table('kabupaten')->upsert([
            ['kabupaten_id' => 1, 'nama_kabupaten' => 'Pemerintah Provinsi Riau', 'kode_kabupaten' => 'RIAU-PROV', 'tim_kerja_id' => 1, 'wilayah_biro_hukum_id' => null],
            ['kabupaten_id' => 2, 'nama_kabupaten' => 'Kabupaten Siak', 'kode_kabupaten' => 'SIAK', 'tim_kerja_id' => 1, 'wilayah_biro_hukum_id' => 3],
            ['kabupaten_id' => 3, 'nama_kabupaten' => 'Kabupaten Kampar', 'kode_kabupaten' => 'KAMPAR', 'tim_kerja_id' => 1, 'wilayah_biro_hukum_id' => 3],
            ['kabupaten_id' => 4, 'nama_kabupaten' => 'Kabupaten Indragiri Hilir', 'kode_kabupaten' => 'INHIL', 'tim_kerja_id' => 1, 'wilayah_biro_hukum_id' => 1],
            ['kabupaten_id' => 5, 'nama_kabupaten' => 'Kabupaten Bengkalis', 'kode_kabupaten' => 'BENGKALIS', 'tim_kerja_id' => 1, 'wilayah_biro_hukum_id' => 2],
            ['kabupaten_id' => 6, 'nama_kabupaten' => 'Kabupaten Rokan Hulu', 'kode_kabupaten' => 'ROHUL', 'tim_kerja_id' => 2, 'wilayah_biro_hukum_id' => 3],
            ['kabupaten_id' => 7, 'nama_kabupaten' => 'Kabupaten Indragiri Hulu', 'kode_kabupaten' => 'INHU', 'tim_kerja_id' => 2, 'wilayah_biro_hukum_id' => 1],
            ['kabupaten_id' => 8, 'nama_kabupaten' => 'Kabupaten Kepulauan Meranti', 'kode_kabupaten' => 'MERANTI', 'tim_kerja_id' => 2, 'wilayah_biro_hukum_id' => 2],
            ['kabupaten_id' => 9, 'nama_kabupaten' => 'Kota Dumai', 'kode_kabupaten' => 'DUMAI', 'tim_kerja_id' => 2, 'wilayah_biro_hukum_id' => 2],
            ['kabupaten_id' => 10, 'nama_kabupaten' => 'Kabupaten Kuantan Singingi', 'kode_kabupaten' => 'KUANSING', 'tim_kerja_id' => 3, 'wilayah_biro_hukum_id' => 3],
            ['kabupaten_id' => 11, 'nama_kabupaten' => 'Kabupaten Pelalawan', 'kode_kabupaten' => 'PELALAWAN', 'tim_kerja_id' => 3, 'wilayah_biro_hukum_id' => 1],
            ['kabupaten_id' => 12, 'nama_kabupaten' => 'Kabupaten Rokan Hilir', 'kode_kabupaten' => 'ROHIL', 'tim_kerja_id' => 3, 'wilayah_biro_hukum_id' => 2],
            ['kabupaten_id' => 13, 'nama_kabupaten' => 'Kota Pekanbaru', 'kode_kabupaten' => 'PEKANBARU', 'tim_kerja_id' => 3, 'wilayah_biro_hukum_id' => 1],
        ], ['kabupaten_id'], ['nama_kabupaten', 'kode_kabupaten', 'tim_kerja_id', 'wilayah_biro_hukum_id']);

        DB::table('jenis_regulasi')->upsert([
            ['jenis_regulasi_id' => 1, 'nama_jenis' => 'Ranperda'],
            ['jenis_regulasi_id' => 2, 'nama_jenis' => 'Ranperkada'],
        ], ['jenis_regulasi_id'], ['nama_jenis']);

        DB::table('status_regulasi')->upsert([
            ['status_id' => 1, 'nama_status' => 'Draf Awal', 'urutan' => 1],
            ['status_id' => 2, 'nama_status' => 'Proses Harmonisasi', 'urutan' => 2],
            ['status_id' => 3, 'nama_status' => 'Proses Fasilitasi', 'urutan' => 3],
            ['status_id' => 4, 'nama_status' => 'Selesai', 'urutan' => 4],
            ['status_id' => 5, 'nama_status' => 'Perlu Perbaikan', 'urutan' => 5],
        ], ['status_id'], ['nama_status', 'urutan']);

        DB::table('jenis_dokumen')->upsert([
            ['jenis_dokumen_id' => 1, 'nama_dokumen' => 'Draft Rancangan', 'tahap' => 'Pra-Harmonisasi', 'urutan' => 1],
            ['jenis_dokumen_id' => 2, 'nama_dokumen' => 'Dokumen Analisis Konsepsi', 'tahap' => 'Harmonisasi', 'urutan' => 2],
            ['jenis_dokumen_id' => 3, 'nama_dokumen' => 'Matriks Hasil Harmonisasi', 'tahap' => 'Harmonisasi', 'urutan' => 3],
            ['jenis_dokumen_id' => 4, 'nama_dokumen' => 'Draft Hasil Harmonisasi', 'tahap' => 'Harmonisasi', 'urutan' => 4],
            ['jenis_dokumen_id' => 5, 'nama_dokumen' => 'Surat Hasil Harmonisasi', 'tahap' => 'Harmonisasi', 'urutan' => 5],
            ['jenis_dokumen_id' => 6, 'nama_dokumen' => 'Matriks Hasil Fasilitasi', 'tahap' => 'Fasilitasi', 'urutan' => 6],
            ['jenis_dokumen_id' => 7, 'nama_dokumen' => 'Surat Hasil Fasilitasi', 'tahap' => 'Fasilitasi', 'urutan' => 7],
        ], ['jenis_dokumen_id'], ['nama_dokumen', 'tahap', 'urutan']);
    }
}
