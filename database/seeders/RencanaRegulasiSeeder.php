<?php

namespace Database\Seeders;

use App\Models\RencanaRegulasi;
use Illuminate\Database\Seeder;

/**
 * Seeder Target Rencana Regulasi (ProPem & Progsun)
 * 
 * Catatan:
 * Target resmi ProPem & Progsun diinput oleh Admin Kanwil setelah ada penetapan
 * resmi dari Pemda & DPRD. Jika belum diisi, sistem HARMONITAS secara otomatis
 * menghitung dari akumulasi permohonan rancangan yang diajukan pada tahun berjalan.
 */
class RencanaRegulasiSeeder extends Seeder
{
    public function run(): void
    {
        // Kosongkan target buatan agar data tahun 2026 mencerminkan data aktual permohonan masuk
        // Admin dapat menambahkan target rencana resmi sewaktu-waktu melalui sistem.
    }
}

