<?php

namespace App\Services;

use App\Models\Notifikasi;
use App\Models\RancanganRegulasi;
use App\Models\User;
use Illuminate\Support\Collection;

class NotifikasiService
{
    /**
     * Kirim notifikasi ke Biro Hukum Provinsi Riau (role_id = 3)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyBiroHukum(RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::where('role_id', 3)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan->rancangan_id, $judul, $pesan);
    }

    /**
     * Kirim notifikasi ke Tim Kerja terkait berdasarkan tim_kerja_id (role_id = 2)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyTimKerja(int $timKerjaId, RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::where('tim_kerja_id', $timKerjaId)
            ->where('role_id', 2)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan->rancangan_id, $judul, $pesan);
    }

    /**
     * Kirim notifikasi pencapaian tuntas (Milestone Selesai) ke Pimpinan (Kakanwil & Kadiv, role_id = 4)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyPimpinan(RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::where('role_id', 4)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan->rancangan_id, $judul, $pesan);
    }

    /**
     * Kirim notifikasi ke user individual secara spesifik (selama bukan Admin)
     */
    public static function notifyUser(int $userId, RancanganRegulasi $rancangan, string $judul, string $pesan): ?Notifikasi
    {
        $user = User::find($userId);
        if (! $user || (int) $user->role_id === 1 || $user->status !== 'ACTIVE') {
            return null;
        }

        return Notifikasi::create([
            'user_id' => $user->user_id,
            'rancangan_id' => $rancangan->rancangan_id,
            'judul' => $judul,
            'pesan' => $pesan,
            'is_read' => false,
            'created_at' => now(),
        ]);
    }

    /**
     * Helper untuk membuat batch notifikasi bagi kumpulan user
     */
    protected static function createNotificationsForUsers(Collection $users, int $rancanganId, string $judul, string $pesan): array
    {
        $created = [];
        $now = now();

        foreach ($users as $user) {
            // Abaikan admin secara eksplisit
            if ((int) $user->role_id === 1) {
                continue;
            }

            $created[] = Notifikasi::create([
                'user_id' => $user->user_id,
                'rancangan_id' => $rancanganId,
                'judul' => $judul,
                'pesan' => $pesan,
                'is_read' => false,
                'created_at' => $now,
            ]);
        }

        return $created;
    }
}
