<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MasterDataSeeder::class);

        // Akun default hanya untuk lokal/pengujian. Di production akun dibuat
        // lewat menu Kelola Akun agar tidak ada kata sandi bawaan / tercetak di log deploy.
        if (! app()->isProduction()) {
            $this->call(AkunDefaultSeeder::class);
        }
    }
}
