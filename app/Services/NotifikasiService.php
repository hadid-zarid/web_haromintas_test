<?php

namespace App\Services;

use App\Mail\NotifikasiWorkflowMail;
use App\Models\Notifikasi;
use App\Models\RancanganRegulasi;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotifikasiService
{
    /**
     * Kirim notifikasi ke Biro Hukum Provinsi Riau (role_id = 3)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyBiroHukum(RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::with(['roleRelation'])
            ->where('role_id', 3)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan, $judul, $pesan, 'Pemberitahuan Biro Hukum');
    }

    /**
     * Kirim notifikasi ke Tim Kerja terkait berdasarkan tim_kerja_id (role_id = 2)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyTimKerja(int $timKerjaId, RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::with(['roleRelation', 'timKerja'])
            ->where('tim_kerja_id', $timKerjaId)
            ->where('role_id', 2)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan, $judul, $pesan, 'Pemberitahuan Tim Kerja');
    }

    /**
     * Kirim notifikasi pencapaian tuntas (Milestone Selesai) ke Pimpinan (Kakanwil & Kadiv, role_id = 4)
     * Admin (role_id = 1) TIDAK menerima notifikasi ini.
     */
    public static function notifyPimpinan(RancanganRegulasi $rancangan, string $judul, string $pesan): array
    {
        $users = User::with(['roleRelation'])
            ->where('role_id', 4)
            ->where('status', 'ACTIVE')
            ->get();

        return self::createNotificationsForUsers($users, $rancangan, $judul, $pesan, 'Laporan Milestone Pimpinan');
    }

    /**
     * Kirim notifikasi ke user individual secara spesifik (selama bukan Admin)
     */
    public static function notifyUser(int $userId, RancanganRegulasi $rancangan, string $judul, string $pesan, ?string $badgeText = null): ?Notifikasi
    {
        $user = User::with(['roleRelation', 'timKerja'])->find($userId);
        if (! $user || (int) $user->role_id === 1 || $user->status !== 'ACTIVE') {
            return null;
        }

        // Pastikan relasi rancangan termuat untuk email
        $rancangan->loadMissing(['kabupaten', 'jenisRegulasi', 'status']);

        $notif = Notifikasi::create([
            'user_id' => $user->user_id,
            'rancangan_id' => $rancangan->rancangan_id,
            'judul' => $judul,
            'pesan' => $pesan,
            'is_read' => false,
            'created_at' => now(),
        ]);

        // Kirim email dinas (fail-safe)
        self::sendEmailNotificationSafe($user, $rancangan, $judul, $pesan, $badgeText ?? 'Pemberitahuan Alur Kerja');

        return $notif;
    }

    /**
     * Helper untuk membuat batch notifikasi in-app & mengirim email bagi kumpulan user
     */
    protected static function createNotificationsForUsers(
        Collection $users,
        RancanganRegulasi $rancangan,
        string $judul,
        string $pesan,
        ?string $badgeText = null
    ): array {
        $created = [];
        $now = now();

        // Pastikan relasi rancangan termuat untuk kelengkapan email
        $rancangan->loadMissing(['kabupaten', 'jenisRegulasi', 'status']);

        foreach ($users as $user) {
            // Abaikan admin secara eksplisit
            if ((int) $user->role_id === 1) {
                continue;
            }

            $created[] = Notifikasi::create([
                'user_id' => $user->user_id,
                'rancangan_id' => $rancangan->rancangan_id,
                'judul' => $judul,
                'pesan' => $pesan,
                'is_read' => false,
                'created_at' => $now,
            ]);

            // Kirim notifikasi email ke masing-masing pengguna (Fail-safe)
            self::sendEmailNotificationSafe($user, $rancangan, $judul, $pesan, $badgeText);
        }

        return $created;
    }

    /**
     * Pengiriman email notifikasi dengan pengaman try-catch (Fail-Safe)
     * Kegagalan koneksi SMTP/jaringan tidak akan menggagalkan transaksi alur kerja sistem.
     */
    protected static function sendEmailNotificationSafe(
        User $user,
        RancanganRegulasi $rancangan,
        string $judul,
        string $pesan,
        ?string $badgeText = null
    ): void {
        if (empty($user->email)) {
            return;
        }

        try {
            $actionUrl = url("/peraturan/{$rancangan->rancangan_id}");
            
            Mail::to($user->email)->queue(
                new NotifikasiWorkflowMail(
                    user: $user,
                    rancangan: $rancangan,
                    judul: $judul,
                    pesan: $pesan,
                    actionUrl: $actionUrl,
                    badgeText: $badgeText ?? 'Pemberitahuan Alur Kerja'
                )
            );

            Log::info("[NotifikasiService] Email notifikasi alur kerja dimasukkan ke antrean background untuk: {$user->email} (Rancangan ID: {$rancangan->rancangan_id})");
        } catch (\Throwable $e) {
            // Log peringatan tanpa melempar exception fatal
            Log::warning("[NotifikasiService] Gagal memproses antrean email notifikasi ke {$user->email}: " . $e->getMessage());
        }
    }
}
