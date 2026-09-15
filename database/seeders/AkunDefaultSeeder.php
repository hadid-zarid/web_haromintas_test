<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Akun default per role untuk instalasi baru.
 * Akun yang emailnya sudah ada tidak diubah (kata sandi tidak ditimpa).
 *
 * Kata sandi diambil dari env SEEDER_DEFAULT_PASSWORD. Jika kosong, dibuat
 * kata sandi acak dan ditampilkan sekali di terminal.
 */
class AkunDefaultSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('SEEDER_DEFAULT_PASSWORD') ?: Str::password(16);

        $akun = [
            ['nama' => 'Administrator Sistem Kanwil', 'email' => 'admin@harmonitas.go.id', 'role_id' => 1],
            ['nama' => 'Tim Kerja 1 Kanwil Riau', 'email' => 'timkerja1@harmonitas.go.id', 'role_id' => 2, 'tim_kerja_id' => 1],
            ['nama' => 'Tim Kerja 2 Kanwil Riau', 'email' => 'timkerja2@harmonitas.go.id', 'role_id' => 2, 'tim_kerja_id' => 2],
            ['nama' => 'Tim Kerja 3 Kanwil Riau', 'email' => 'timkerja3@harmonitas.go.id', 'role_id' => 2, 'tim_kerja_id' => 3],
            ['nama' => 'Biro Hukum Provinsi Riau', 'email' => 'birohukum.riau@harmonitas.go.id', 'role_id' => 3, 'wilayah_biro_hukum_id' => 1],
            ['nama' => 'Biro Hukum Wilayah 1 Setda Provinsi Riau', 'email' => 'birohukum1@harmonitas.go.id', 'role_id' => 3, 'wilayah_biro_hukum_id' => 1],
            ['nama' => 'Biro Hukum Wilayah 2 Setda Provinsi Riau', 'email' => 'birohukum2@harmonitas.go.id', 'role_id' => 3, 'wilayah_biro_hukum_id' => 2],
            ['nama' => 'Biro Hukum Wilayah 3 Setda Provinsi Riau', 'email' => 'birohukum3@harmonitas.go.id', 'role_id' => 3, 'wilayah_biro_hukum_id' => 3],
            ['nama' => 'Kepala Kantor Wilayah Kemenkumham Riau', 'email' => 'kakanwil.riau@harmonitas.go.id', 'role_id' => 4],
            ['nama' => 'Kepala Divisi Pelayanan Hukum dan HAM', 'email' => 'kadiv.kumham@harmonitas.go.id', 'role_id' => 4],
        ];

        $dibuat = 0;
        foreach ($akun as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                $data + ['password' => $password, 'status' => 'ACTIVE']
            );
            $dibuat += $user->wasRecentlyCreated ? 1 : 0;
        }

        if ($dibuat > 0 && ! env('SEEDER_DEFAULT_PASSWORD')) {
            $this->command?->warn("{$dibuat} akun default dibuat dengan kata sandi acak: {$password}");
            $this->command?->warn('Simpan kata sandi ini atau set SEEDER_DEFAULT_PASSWORD di .env sebelum seeding.');
        }
    }
}
