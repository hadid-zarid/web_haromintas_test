<?php

namespace App\Services;

use App\Models\HistorisHarmonisasi;
use App\Models\Kabupaten;
use App\Models\RekapTahun;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Rekap statistik ProPem & Progsun untuk landing page.
 *
 * Seluruh angka diisi manual oleh Admin (menu Target ProPem & Progsun) dari rekap resmi
 * Kanwil. Tidak ada angka yang dihitung otomatis dari berkas permohonan.
 * - Angka per wilayah: historis_harmonisasi (jenis_regulasi_id 1 = Ranperda, 2 = Ranperkada)
 * - Status per tahun (tayang / tampil pertama): rekap_statistik_tahun
 */
class StatistikHarmonisasiService
{
    /**
     * Urutan baku resmi sesuai lembar rekapitulasi daerah 2025
     */
    public const URUTAN_BAKU_KABUPATEN = [
        3 => 1,   // Kampar
        7 => 2,   // Indragiri Hulu
        5 => 3,   // Bengkalis
        4 => 4,   // Indragiri Hilir
        11 => 5,  // Pelalawan
        6 => 6,   // Rokan Hulu
        12 => 7,  // Rokan Hilir
        2 => 8,   // Siak
        10 => 9,  // Kuantan Singingi
        8 => 10,  // Kepulauan Meranti
        13 => 11, // Pekanbaru
        9 => 12,  // Dumai
        1 => 13,  // Riau
    ];

    /**
     * Daftar nama pendek / display name untuk visualisasi
     */
    public const NAMA_SINGKAT_WILAYAH = [
        1 => 'Provinsi Riau',
        2 => 'Siak',
        3 => 'Kampar',
        4 => 'Indragiri Hilir',
        5 => 'Bengkalis',
        6 => 'Rokan Hulu',
        7 => 'Indragiri Hulu',
        8 => 'Kepulauan Meranti',
        9 => 'Dumai',
        10 => 'Kuantan Singingi',
        11 => 'Pelalawan',
        12 => 'Rokan Hilir',
        13 => 'Pekanbaru',
    ];

    /**
     * Kategori Wilayah (Kabupaten, Kota, Provinsi)
     */
    public const KELOMPOK_WILAYAH = [
        1 => 'Provinsi',
        2 => 'Kabupaten',
        3 => 'Kabupaten',
        4 => 'Kabupaten',
        5 => 'Kabupaten',
        6 => 'Kabupaten',
        7 => 'Kabupaten',
        8 => 'Kabupaten',
        9 => 'Kota',
        10 => 'Kabupaten',
        11 => 'Kabupaten',
        12 => 'Kabupaten',
        13 => 'Kota',
    ];

    /**
     * Data statistik publik. Hanya tahun berstatus tayang yang bisa diakses; tahun lain
     * (draf atau tidak ada) jatuh ke tahun "tampil pertama". Null jika belum ada yang tayang.
     */
    public function getStatistik(?int $tahun = null): ?array
    {
        $tayang = RekapTahun::where('is_published', true)->orderByDesc('tahun')->get();

        if ($tayang->isEmpty()) {
            return null;
        }

        $rekap = $tayang->firstWhere('tahun', $tahun)
            ?? $tayang->firstWhere('is_default', true)
            ?? $tayang->first();

        $wilayah = array_map(fn (array $w) => [
            ...collect($w)->except(['propem', 'harm_ranperda', 'progsun', 'harm_ranperkada'])->all(),
            'ranperda' => $this->blok($w['propem'], $w['harm_ranperda']),
            'ranperkada' => $this->blok($w['progsun'], $w['harm_ranperkada']),
            'total' => $this->blok($w['propem'] + $w['progsun'], $w['harm_ranperda'] + $w['harm_ranperkada']),
        ], $this->rekapWilayah($rekap->tahun));

        $jumlah = fn (string $jenis, string $kolom) => array_sum(array_column(array_column($wilayah, $jenis), $kolom));

        return [
            'tahun' => $rekap->tahun,
            'label_sumber' => "Rekap tahun {$rekap->tahun}",
            'keterangan_sumber' => 'Sumber: '.($rekap->sumber ?: 'Rekap resmi Kanwil Kemenkum Riau'),
            'ringkasan' => [
                'ranperda' => $this->blok($jumlah('ranperda', 'rencana'), $jumlah('ranperda', 'harmonisasi')),
                'ranperkada' => $this->blok($jumlah('ranperkada', 'rencana'), $jumlah('ranperkada', 'harmonisasi')),
                'gabungan' => $this->blok($jumlah('total', 'rencana'), $jumlah('total', 'harmonisasi')),
            ],
            'wilayah' => $wilayah,
            'available_years' => $tayang->map(fn (RekapTahun $r) => [
                'tahun' => $r->tahun,
                'label' => "Tahun {$r->tahun}",
            ])->values()->all(),
        ];
    }

    /**
     * Angka mentah 13 wilayah untuk satu tahun, urut baku rekap. Wilayah tanpa data bernilai 0.
     */
    public function rekapWilayah(int $tahun): array
    {
        $rows = HistorisHarmonisasi::where('tahun', $tahun)->get()
            ->keyBy(fn ($r) => $r->kabupaten_id.'-'.$r->jenis_regulasi_id);

        $angka = fn (int $kabId, int $jenis, string $kolom) => (int) ($rows->get("{$kabId}-{$jenis}")?->{$kolom} ?? 0);

        return Kabupaten::with('timKerja')->get()
            ->map(function (Kabupaten $kab) use ($angka) {
                $kabId = (int) $kab->kabupaten_id;

                return [
                    'kabupaten_id' => $kabId,
                    'nama_kabupaten' => $kab->nama_kabupaten,
                    'nama_singkat' => self::NAMA_SINGKAT_WILAYAH[$kabId] ?? $kab->nama_kabupaten,
                    'kelompok' => self::KELOMPOK_WILAYAH[$kabId] ?? 'Kabupaten',
                    'tim_kerja_id' => (int) ($kab->tim_kerja_id ?? 1),
                    'tim_kerja_nama' => $kab->timKerja?->nama_tim_kerja ?? "Tim Kerja {$kab->tim_kerja_id}",
                    'urutan' => self::URUTAN_BAKU_KABUPATEN[$kabId] ?? 99,
                    'propem' => $angka($kabId, 1, 'jumlah_rencana'),
                    'harm_ranperda' => $angka($kabId, 1, 'jumlah_harmonisasi'),
                    'progsun' => $angka($kabId, 2, 'jumlah_rencana'),
                    'harm_ranperkada' => $angka($kabId, 2, 'jumlah_harmonisasi'),
                ];
            })
            ->sortBy('urutan')
            ->values()
            ->all();
    }

    /**
     * Simpan angka rekap 13 wilayah (Ranperda & Ranperkada) beserta sumbernya.
     */
    public function simpanRekap(RekapTahun $rekap, ?string $sumber, array $items, ?int $userId): void
    {
        $now = now();
        $records = [];

        foreach ($items as $item) {
            foreach ([1 => ['propem', 'harm_ranperda'], 2 => ['progsun', 'harm_ranperkada']] as $jenis => [$rencana, $harm]) {
                $records[] = [
                    'tahun' => $rekap->tahun,
                    'kabupaten_id' => (int) $item['kabupaten_id'],
                    'jenis_regulasi_id' => $jenis,
                    'jumlah_rencana' => (int) $item[$rencana],
                    'jumlah_harmonisasi' => (int) $item[$harm],
                    'sumber' => (string) $sumber,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::transaction(function () use ($rekap, $sumber, $records, $userId) {
            HistorisHarmonisasi::upsert(
                $records,
                ['tahun', 'kabupaten_id', 'jenis_regulasi_id'],
                ['jumlah_rencana', 'jumlah_harmonisasi', 'sumber', 'updated_at']
            );

            $rekap->update(['sumber' => $sumber, 'updated_by' => $userId]);
        });
    }

    /**
     * Tayangkan / tarik satu tahun dari landing page.
     */
    public function setPublikasi(RekapTahun $rekap, bool $tayang, ?int $userId): void
    {
        if (! $tayang && $rekap->is_default) {
            throw ValidationException::withMessages([
                'rekap' => "Tahun {$rekap->tahun} sedang menjadi tahun yang tampil pertama. Pilih tahun lain sebagai tampil pertama sebelum menariknya.",
            ]);
        }

        if ($tayang && ! HistorisHarmonisasi::where('tahun', $rekap->tahun)->exists()) {
            throw ValidationException::withMessages([
                'rekap' => "Angka rekap tahun {$rekap->tahun} belum pernah disimpan. Isi dan simpan angkanya terlebih dahulu.",
            ]);
        }

        $rekap->update([
            'is_published' => $tayang,
            'published_at' => $tayang ? now() : null,
            'updated_by' => $userId,
        ]);
    }

    /**
     * Jadikan satu tahun tayang sebagai tahun yang dibuka pertama di landing page.
     */
    public function setTampilPertama(RekapTahun $rekap, ?int $userId): void
    {
        if (! $rekap->is_published) {
            throw ValidationException::withMessages([
                'rekap' => "Tahun {$rekap->tahun} belum tayang. Tayangkan terlebih dahulu sebelum dijadikan tampil pertama.",
            ]);
        }

        DB::transaction(function () use ($rekap, $userId) {
            RekapTahun::where('is_default', true)->update(['is_default' => false]);
            $rekap->update(['is_default' => true, 'updated_by' => $userId]);
        });
    }

    /**
     * Hapus tahun berstatus draf beserta angkanya (misalnya karena salah ketik tahun).
     */
    public function hapusDraf(RekapTahun $rekap): void
    {
        if ($rekap->is_published) {
            throw ValidationException::withMessages([
                'rekap' => "Tahun {$rekap->tahun} sedang tayang. Tarik dari landing page terlebih dahulu sebelum menghapus.",
            ]);
        }

        DB::transaction(function () use ($rekap) {
            HistorisHarmonisasi::where('tahun', $rekap->tahun)->delete();
            $rekap->delete();
        });
    }

    /**
     * Satu blok angka: rencana, harmonisasi, rasio (%), dan penanda surplus.
     */
    private function blok(int $rencana, int $harmonisasi): array
    {
        $rasio = $rencana > 0 ? round($harmonisasi / $rencana * 100, 1) : 0;

        return [
            'rencana' => $rencana,
            'harmonisasi' => $harmonisasi,
            'rasio' => $rasio,
            'rasio_label' => number_format($rasio, 1, ',', '.').'%',
            'surplus' => $harmonisasi > $rencana,
            'surplus_selisih' => max(0, $harmonisasi - $rencana),
        ];
    }
}
