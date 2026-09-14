<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Dokumen;
use App\Models\RancanganRegulasi;
use App\Models\User;

/**
 * Aturan RBAC & IDOR defense untuk akses Rancangan Regulasi dan Dokumennya.
 * Dipakai bersama oleh controller yang membaca/mengubah berkas permohonan
 * (PermohonanController) maupun yang hanya membaca dokumennya (mis. perbandingan)
 * agar aturan wilayah binaan Tim Kerja tetap konsisten di satu tempat.
 */
trait AuthorizesRancanganAccess
{
    /**
     * Validasi Hak Akses Rancangan Regulasi (RBAC & IDOR Defense)
     */
    private function authorizeRancanganAccess(RancanganRegulasi $rancangan, ?User $user): void
    {
        if (! $user) {
            abort(401, 'Silakan login terlebih dahulu untuk mengakses berkas ini.');
        }

        // Admin, Biro Hukum, dan Pimpinan dapat mengakses seluruh berkas regulasi daerah se-Riau
        if ($user->isAdmin() || $user->isBiroHukum() || $user->isPimpinan()) {
            return;
        }

        // Jika Tim Kerja, batasi hanya pada wilayah binaannya
        if ($user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $rancangan->tim_kerja_id === (int) $user->tim_kerja_id) {
                return;
            }
        }

        abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka atau mengubah berkas di luar wilayah binaan Tim Kerja Anda.');
    }

    /**
     * Validasi Hak Akses Dokumen Rahasia (RBAC Scoping)
     */
    private function authorizeDocumentAccess(Dokumen $dokumen, ?User $user): void
    {
        if (! $user) {
            abort(401, 'Silakan login terlebih dahulu untuk mengakses dokumen ini.');
        }

        // Admin, Biro Hukum, dan Pimpinan dapat mengakses seluruh dokumen regulasi
        if ($user->isAdmin() || $user->isBiroHukum() || $user->isPimpinan()) {
            return;
        }

        // Jika Tim Kerja, harus sesuai dengan wilayah binaan Tim Kerja miliknya
        $rancangan = $dokumen->rancanganRegulasi;
        if ($rancangan && $user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $rancangan->tim_kerja_id === (int) $user->tim_kerja_id) {
                return;
            }
        }

        abort(403, 'Akses Ditolak: Dokumen ini bersifat RAHASIA dan berada di luar wewenang wilayah binaan Tim Kerja Anda.');
    }
}
