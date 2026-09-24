<?php

namespace Database\Seeders;

use App\Models\HistorisHarmonisasi;
use App\Models\Kabupaten;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeder Snapshot Data Historis Tahun 2025 HARMONITAS
 * Transkripsi data resmi rekap 2025 (13 Wilayah di Provinsi Riau).
 *
 * Sifat: Idempotent (menggunakan upsert pada unique [tahun, kabupaten_id, jenis_regulasi_id]),
 * aman dijalankan berulang kali tanpa membuat duplikasi data atau membuat permohonan palsu.
 */
class HistorisHarmonisasiSeeder extends Seeder
{
    public function run(): void
    {
        $sumber = 'rekap 2025 yang diberikan';
        $now = now();

        // Pemetaan data tabel resmi 2025:
        // [nama_alias, kabupaten_id, propem_ranperda, harm_ranperda, progsun_ranperkada, harm_ranperkada]
        $rekap2025 = [
            // Kabupaten (10 Daerah)
            ['Kampar', 3, 30, 5, 65, 44],
            ['Indragiri Hulu', 7, 12, 2, 145, 33],
            ['Bengkalis', 5, 19, 3, 111, 22],
            ['Indragiri Hilir', 4, 5, 6, 102, 85],
            ['Pelalawan', 11, 18, 1, 9, 7],
            ['Rokan Hulu', 6, 9, 2, 35, 54],
            ['Rokan Hilir', 12, 19, 4, 117, 21],
            ['Siak', 2, 11, 4, 12, 78],
            ['Kuantan Singingi', 10, 15, 2, 27, 20],
            ['Kepulauan Meranti', 8, 16, 9, 52, 20],

            // Kota (2 Daerah)
            ['Pekanbaru', 13, 22, 1, 57, 30],
            ['Dumai', 9, 14, 5, 30, 10],

            // Provinsi (1 Daerah)
            ['Riau', 1, 22, 5, 55, 32],
        ];

        $records = [];
        foreach ($rekap2025 as $item) {
            [$nama, $kabId, $propem, $harmPerda, $progsun, $harmPerkada] = $item;

            // Ranperda (jenis_regulasi_id: 1)
            $records[] = [
                'tahun' => 2025,
                'kabupaten_id' => $kabId,
                'jenis_regulasi_id' => 1,
                'jumlah_rencana' => $propem,
                'jumlah_harmonisasi' => $harmPerda,
                'sumber' => $sumber,
                'catatan' => "Data historis 2025 wilayah {$nama} (ProPem Ranperda)",
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Ranperkada (jenis_regulasi_id: 2)
            $records[] = [
                'tahun' => 2025,
                'kabupaten_id' => $kabId,
                'jenis_regulasi_id' => 2,
                'jumlah_rencana' => $progsun,
                'jumlah_harmonisasi' => $harmPerkada,
                'sumber' => $sumber,
                'catatan' => "Data historis 2025 wilayah {$nama} (Progsun Ranperkada)",
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('historis_harmonisasi')->upsert(
            $records,
            ['tahun', 'kabupaten_id', 'jenis_regulasi_id'],
            ['jumlah_rencana', 'jumlah_harmonisasi', 'sumber', 'catatan', 'updated_at']
        );
    }
}
