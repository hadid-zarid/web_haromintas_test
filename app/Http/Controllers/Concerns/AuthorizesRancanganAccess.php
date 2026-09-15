<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Dokumen;
use App\Models\RancanganRegulasi;
use App\Models\User;

/**
 * Aturan RBAC & IDOR defense untuk akses Rancangan Regulasi dan Dokumennya.
 * Dipakai bersama oleh controller yang membaca/mengubah berkas permohonan
 * (PermohonanController) maupun yang hanya membaca dokumennya (mis. perbandingan)
 * agar aturan wilayah binaan Tim Kerja & wilayah kerja Biro Hukum tetap konsisten di satu tempat.
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

        // Admin dan Pimpinan dapat mengakses seluruh berkas regulasi daerah se-Riau
        if ($user->isAdmin() || $user->isPimpinan()) {
            return;
        }

        // Biro Hukum dibatasi wilayah kerjanya
        if ($user->isBiroHukum()) {
            if ($this->rancanganDalamCakupanBiroHukum($rancangan, $user)) {
                return;
            }

            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka atau mengubah berkas di luar wilayah kerja Biro Hukum Anda.');
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

        // Admin dan Pimpinan dapat mengakses seluruh dokumen regulasi
        if ($user->isAdmin() || $user->isPimpinan()) {
            return;
        }

        $rancangan = $dokumen->rancanganRegulasi;

        // Biro Hukum harus sesuai dengan wilayah kerja Biro Hukum miliknya
        if ($user->isBiroHukum()) {
            if ($rancangan && $this->rancanganDalamCakupanBiroHukum($rancangan, $user)) {
                return;
            }

            abort(403, 'Akses Ditolak: Dokumen ini bersifat RAHASIA dan berada di luar wewenang wilayah kerja Biro Hukum Anda.');
        }

        // Jika Tim Kerja, harus sesuai dengan wilayah binaan Tim Kerja miliknya
        if ($rancangan && $user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $rancangan->tim_kerja_id === (int) $user->tim_kerja_id) {
                return;
            }
        }

        abort(403, 'Akses Ditolak: Dokumen ini bersifat RAHASIA dan berada di luar wewenang wilayah binaan Tim Kerja Anda.');
    }

    /**
     * Berkas masuk cakupan Biro Hukum jika kabupaten berkas tidak memiliki wilayah
     * (mis. Pemprov Riau) atau wilayahnya sama dengan wilayah kerja user.
     * User Biro Hukum yang belum ditetapkan wilayahnya hanya mendapat berkas tanpa wilayah.
     */
    private function rancanganDalamCakupanBiroHukum(RancanganRegulasi $rancangan, User $user): bool
    {
        $wilayahUser = $user->wilayahBiroHukumId();
        $wilayahBerkas = $rancangan->kabupaten?->wilayah_biro_hukum_id;

        return $wilayahBerkas === null || ($wilayahUser !== null && (int) $wilayahBerkas === $wilayahUser);
    }
}
