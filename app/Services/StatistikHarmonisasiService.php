<?php

namespace App\Services;

use App\Models\HistorisHarmonisasi;
use App\Models\Kabupaten;
use App\Models\RancanganRegulasi;
use App\Models\RencanaRegulasi;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

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
     * Ambil data statistik agregat publik yang aman dan lengkap
     */
    public function getStatistik(?int $tahun = null): array
    {
        $availableYears = $this->getAvailableYears();
        $defaultYear = $this->getDefaultYear($availableYears);

        $selectedYear = $tahun ?: $defaultYear;

        // Validasi tahun yang dipilih
        $yearExists = collect($availableYears)->contains('tahun', $selectedYear);
        if (! $yearExists) {
            $selectedYear = $defaultYear;
        }

        $yearMeta = collect($availableYears)->firstWhere('tahun', $selectedYear) ?? [
            'tahun' => 2025,
            'tipe' => 'historis',
            'is_published' => true,
        ];

        if ($yearMeta['tipe'] === 'historis') {
            return $this->getHistorisData($selectedYear, $availableYears);
        }

        return $this->getSistemData($selectedYear, $availableYears);
    }

    /**
     * Ambil daftar tahun yang sah untuk ditampilkan ke publik
     */
    public function getAvailableYears(): array
    {
        $years = [];

        // 1. Tahun dari data historis
        $historisYears = HistorisHarmonisasi::select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun')
            ->toArray();

        foreach ($historisYears as $y) {
            $years[] = [
                'tahun' => (int) $y,
                'label' => "Tahun {$y}",
                'badge' => "Data historis {$y}",
                'tipe' => 'historis',
                'is_published' => true,
                'is_current' => false,
            ];
        }

        // 2. Tahun dari rencana operasional yang berstatus is_published = true
        $publishedRencanaYears = RencanaRegulasi::where('is_published', true)
            ->select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun')
            ->toArray();

        $currentCalendarYear = (int) date('Y');

        foreach ($publishedRencanaYears as $y) {
            // Hindari duplikasi jika tahun historis dan rencana beririsan
            if (! collect($years)->contains('tahun', (int) $y)) {
                $years[] = [
                    'tahun' => (int) $y,
                    'label' => "Tahun {$y}",
                    'badge' => "Data sistem tahun berjalan",
                    'tipe' => 'sistem',
                    'is_published' => true,
                    'is_current' => (int) $y === $currentCalendarYear,
                ];
            }
        }

        // 3. Pastikan tahun berjalan real-time (2026) selalu tersedia dalam filter
        if (! collect($years)->contains('tahun', $currentCalendarYear)) {
            $years[] = [
                'tahun' => $currentCalendarYear,
                'label' => "Tahun {$currentCalendarYear}",
                'badge' => "Data real-time sistem berjalan",
                'tipe' => 'sistem',
                'is_published' => true,
                'is_current' => true,
            ];
        }

        // Urutkan tahun dari yang terbaru (2026, 2025)
        usort($years, fn ($a, $b) => $b['tahun'] <=> $a['tahun']);

        // Fallback jika kosong, pastikan 2025 tersedia
        if (empty($years)) {
            $years = [
                [
                    'tahun' => 2025,
                    'label' => 'Tahun 2025',
                    'badge' => 'Data historis 2025',
                    'tipe' => 'historis',
                    'is_published' => true,
                    'is_current' => false,
                ],
            ];
        }

        return $years;
    }

    /**
     * Tentukan tahun default: 2025 menjadi default agar data rekap historis resmi tampil utuh
     * saat pertama dibuka, dengan opsi filter tahun berjalan (2026) yang dapat dipilih kapan saja.
     */
    public function getDefaultYear(array $availableYears): int
    {
        return 2025;
    }

    /**
     * Ambil data snapshot historis (misal 2025)
     */
    protected function getHistorisData(int $tahun, array $availableYears): array
    {
        $allKabupaten = Kabupaten::with('timKerja')->orderBy('kabupaten_id')->get();
        $historisRows = HistorisHarmonisasi::where('tahun', $tahun)->get();

        $sumberResmi = $historisRows->first()?->sumber ?? 'rekap 2025 yang diberikan';

        $wilayahList = [];

        $totalPropem = 0;
        $totalHarmPerda = 0;
        $totalProgsun = 0;
        $totalHarmPerkada = 0;

        foreach ($allKabupaten as $kab) {
            $kabId = (int) $kab->kabupaten_id;

            $rowPerda = $historisRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            );
            $rowPerkada = $historisRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            );

            $propem = (int) ($rowPerda?->jumlah_rencana ?? 0);
            $harmPerda = (int) ($rowPerda?->jumlah_harmonisasi ?? 0);
            $progsun = (int) ($rowPerkada?->jumlah_rencana ?? 0);
            $harmPerkada = (int) ($rowPerkada?->jumlah_harmonisasi ?? 0);

            $totalRencanaWilayah = $propem + $progsun;
            $totalHarmWilayah = $harmPerda + $harmPerkada;

            $rasioPerda = $propem > 0 ? round(($harmPerda / $propem) * 100, 1) : 0;
            $rasioPerkada = $progsun > 0 ? round(($harmPerkada / $progsun) * 100, 1) : 0;
            $rasioTotalWilayah = $totalRencanaWilayah > 0 ? round(($totalHarmWilayah / $totalRencanaWilayah) * 100, 1) : 0;

            $totalPropem += $propem;
            $totalHarmPerda += $harmPerda;
            $totalProgsun += $progsun;
            $totalHarmPerkada += $harmPerkada;

            $namaSingkat = self::NAMA_SINGKAT_WILAYAH[$kabId] ?? $kab->nama_kabupaten;
            $kelompok = self::KELOMPOK_WILAYAH[$kabId] ?? ($kabId === 1 ? 'Provinsi' : (str_contains(strtolower($kab->nama_kabupaten), 'kota') ? 'Kota' : 'Kabupaten'));
            $urutan = self::URUTAN_BAKU_KABUPATEN[$kabId] ?? 99;

            $wilayahList[] = [
                'kabupaten_id' => $kabId,
                'nama_kabupaten' => $kab->nama_kabupaten,
                'nama_singkat' => $namaSingkat,
                'kelompok' => $kelompok,
                'tim_kerja_id' => (int) ($kab->tim_kerja_id ?? 1),
                'tim_kerja_nama' => $kab->timKerja?->nama_tim_kerja ?? "Tim Kerja {$kab->tim_kerja_id}",
                'urutan' => $urutan,
                'ranperda' => [
                    'rencana' => $propem,
                    'harmonisasi' => $harmPerda,
                    'rasio' => $rasioPerda,
                    'surplus' => $harmPerda > $propem,
                    'surplus_selisih' => max(0, $harmPerda - $propem),
                ],
                'ranperkada' => [
                    'rencana' => $progsun,
                    'harmonisasi' => $harmPerkada,
                    'rasio' => $rasioPerkada,
                    'surplus' => $harmPerkada > $progsun,
                    'surplus_selisih' => max(0, $harmPerkada - $progsun),
                ],
                'total' => [
                    'rencana' => $totalRencanaWilayah,
                    'harmonisasi' => $totalHarmWilayah,
                    'rasio' => $rasioTotalWilayah,
                    'surplus' => $totalHarmWilayah > $totalRencanaWilayah,
                    'surplus_selisih' => max(0, $totalHarmWilayah - $totalRencanaWilayah),
                ],
            ];
        }

        // Urutkan default sesuai tabel rekap resmi 2025
        usort($wilayahList, fn ($a, $b) => $a['urutan'] <=> $b['urutan']);

        $totalRencanaGabungan = $totalPropem + $totalProgsun;
        $totalHarmGabungan = $totalHarmPerda + $totalHarmPerkada;

        $rasioTotalPerda = $totalPropem > 0 ? round(($totalHarmPerda / $totalPropem) * 100, 1) : 0;
        $rasioTotalPerkada = $totalProgsun > 0 ? round(($totalHarmPerkada / $totalProgsun) * 100, 1) : 0;
        $rasioTotalGabungan = $totalRencanaGabungan > 0 ? round(($totalHarmGabungan / $totalRencanaGabungan) * 100, 1) : 0;

        return [
            'tahun' => $tahun,
            'tipe_sumber' => 'historis',
            'label_sumber' => "Data historis {$tahun}",
            'keterangan_sumber' => "Sumber: {$sumberResmi}",
            'is_live' => false,
            'last_updated_at' => Carbon::now()->toIso8601String(),
            'ringkasan' => [
                'ranperda' => [
                    'label_rencana' => 'ProPem Ranperda',
                    'label_target' => 'Target Direncanakan',
                    'sublabel_target' => 'Target kesepakatan Pemda & DPRD',
                    'footnote_target' => 'target program',
                    'rencana' => $totalPropem,
                    'harmonisasi' => $totalHarmPerda,
                    'rasio' => $rasioTotalPerda,
                    'rasio_label' => number_format($rasioTotalPerda, 1, ',', '.') . '%',
                    'istilah' => 'Program Pembentukan Peraturan Daerah',
                ],
                'ranperkada' => [
                    'label_rencana' => 'Progsun Ranperkada',
                    'label_target' => 'Target Direncanakan',
                    'sublabel_target' => 'Rencana tahunan Pergub / Perbup / Perwali',
                    'footnote_target' => 'target program',
                    'rencana' => $totalProgsun,
                    'harmonisasi' => $totalHarmPerkada,
                    'rasio' => $rasioTotalPerkada,
                    'rasio_label' => number_format($rasioTotalPerkada, 1, ',', '.') . '%',
                    'istilah' => 'Program Penyusunan Peraturan Kepala Daerah',
                ],
                'gabungan' => [
                    'label_rencana' => 'Total Rencana Regulasi',
                    'label_target' => 'Target Direncanakan',
                    'sublabel_target' => 'Total rencana regulasi daerah',
                    'footnote_target' => 'target program',
                    'rencana' => $totalRencanaGabungan,
                    'harmonisasi' => $totalHarmGabungan,
                    'rasio' => $rasioTotalGabungan,
                    'rasio_label' => number_format($rasioTotalGabungan, 1, ',', '.') . '%',
                ],
            ],
            'wilayah' => $wilayahList,
            'available_years' => $availableYears,
        ];
    }

    /**
     * Ambil data operasional sistem untuk tahun yang dipilih
     * Rencana: dari tabel rencana_regulasi resmi jika ada, atau dihitung otomatis dari jumlah permohonan masuk pada tahun tersebut.
     * Harmonisasi: dihitung dari rancangan_regulasi yang memiliki harmonisasi_completed_at pada tahun tersebut.
     */
    protected function getSistemData(int $tahun, array $availableYears): array
    {
        $allKabupaten = Kabupaten::with('timKerja')->orderBy('kabupaten_id')->get();

        // 1. Cek apakah ada target rencana resmi yang dipublikasikan untuk tahun tersebut
        $rencanaRows = RencanaRegulasi::where('tahun', $tahun)->where('is_published', true)->get();
        $hasOfficialPlan = $rencanaRows->where('jumlah_rencana', '>', 0)->isNotEmpty();

        // 2. Hitung permohonan masuk/diajukan pada tahun yang dipilih
        // Filter tahun dibuatnya rancangan (tanggal_dibuat atau created_at)
        $startDate = "{$tahun}-01-01 00:00:00";
        $endDate = "{$tahun}-12-31 23:59:59";

        $permohonanMasuk = RancanganRegulasi::where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_dibuat', [$startDate, $endDate])
                    ->orWhere(function ($q2) use ($startDate, $endDate) {
                        $q2->whereNull('tanggal_dibuat')
                            ->whereBetween('created_at', [$startDate, $endDate]);
                    });
            })
            ->select('kabupaten_id', 'jenis_regulasi_id', DB::raw('COUNT(DISTINCT rancangan_id) as total_masuk'))
            ->groupBy('kabupaten_id', 'jenis_regulasi_id')
            ->get();

        // 3. Hitung realisasi harmonisasi yang telah selesai pada tahun yang dipilih
        // Satu rancangan_id dihitung tepat 1 kali menurut kabupaten_id, jenis_regulasi_id, dan tahun selesai
        $realisasiHarmonisasi = RancanganRegulasi::whereNotNull('harmonisasi_completed_at')
            ->whereYear('harmonisasi_completed_at', $tahun)
            ->select('kabupaten_id', 'jenis_regulasi_id', DB::raw('COUNT(DISTINCT rancangan_id) as total_selesai'))
            ->groupBy('kabupaten_id', 'jenis_regulasi_id')
            ->get();

        $sumberResmi = $hasOfficialPlan
            ? ($rencanaRows->first()?->sumber_resmi ?? "Target Rencana ProPem & Progsun Tahun {$tahun}")
            : "Permohonan Masuk Sistem HARMONITAS Tahun {$tahun}";

        $labelTargetPerda = $hasOfficialPlan ? 'Target Direncanakan' : 'Permohonan Masuk';
        $sublabelTargetPerda = $hasOfficialPlan ? 'Target kesepakatan Pemda & DPRD' : "Total permohonan Ranperda diajukan tahun {$tahun}";
        $footnoteTargetPerda = $hasOfficialPlan ? 'target program' : 'permohonan masuk';

        $labelTargetPerkada = $hasOfficialPlan ? 'Target Direncanakan' : 'Permohonan Masuk';
        $sublabelTargetPerkada = $hasOfficialPlan ? 'Rencana tahunan Pergub / Perbup / Perwali' : "Total permohonan Ranperkada diajukan tahun {$tahun}";
        $footnoteTargetPerkada = $hasOfficialPlan ? 'target program' : 'permohonan masuk';

        $wilayahList = [];

        $totalPropem = 0;
        $totalHarmPerda = 0;
        $totalProgsun = 0;
        $totalHarmPerkada = 0;

        foreach ($allKabupaten as $kab) {
            $kabId = (int) $kab->kabupaten_id;

            $rencanaPerda = $rencanaRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            );
            $rencanaPerkada = $rencanaRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            );

            $propemOfficial = (int) ($rencanaPerda?->jumlah_rencana ?? 0);
            $progsunOfficial = (int) ($rencanaPerkada?->jumlah_rencana ?? 0);

            $masukPerdaRow = $permohonanMasuk->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            );
            $masukPerkadaRow = $permohonanMasuk->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            );

            $masukPerda = (int) ($masukPerdaRow?->total_masuk ?? 0);
            $masukPerkada = (int) ($masukPerkadaRow?->total_masuk ?? 0);

            // Jika ada rencana target resmi yang dipublikasikan (> 0), gunakan target resmi.
            // Jika belum ada/0, gunakan jumlah permohonan yang diajukan pada tahun yang dipilih.
            $propem = $hasOfficialPlan ? $propemOfficial : $masukPerda;
            $progsun = $hasOfficialPlan ? $progsunOfficial : $masukPerkada;

            $harmPerdaRow = $realisasiHarmonisasi->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            );
            $harmPerkadaRow = $realisasiHarmonisasi->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            );

            $harmPerda = (int) ($harmPerdaRow?->total_selesai ?? 0);
            $harmPerkada = (int) ($harmPerkadaRow?->total_selesai ?? 0);

            $totalRencanaWilayah = $propem + $progsun;
            $totalHarmWilayah = $harmPerda + $harmPerkada;

            $rasioPerda = $propem > 0 ? round(($harmPerda / $propem) * 100, 1) : 0;
            $rasioPerkada = $progsun > 0 ? round(($harmPerkada / $progsun) * 100, 1) : 0;
            $rasioTotalWilayah = $totalRencanaWilayah > 0 ? round(($totalHarmWilayah / $totalRencanaWilayah) * 100, 1) : 0;

            $totalPropem += $propem;
            $totalHarmPerda += $harmPerda;
            $totalProgsun += $progsun;
            $totalHarmPerkada += $harmPerkada;

            $namaSingkat = self::NAMA_SINGKAT_WILAYAH[$kabId] ?? $kab->nama_kabupaten;
            $kelompok = self::KELOMPOK_WILAYAH[$kabId] ?? ($kabId === 1 ? 'Provinsi' : (str_contains(strtolower($kab->nama_kabupaten), 'kota') ? 'Kota' : 'Kabupaten'));
            $urutan = self::URUTAN_BAKU_KABUPATEN[$kabId] ?? 99;

            $wilayahList[] = [
                'kabupaten_id' => $kabId,
                'nama_kabupaten' => $kab->nama_kabupaten,
                'nama_singkat' => $namaSingkat,
                'kelompok' => $kelompok,
                'tim_kerja_id' => (int) ($kab->tim_kerja_id ?? 1),
                'tim_kerja_nama' => $kab->timKerja?->nama_tim_kerja ?? "Tim Kerja {$kab->tim_kerja_id}",
                'urutan' => $urutan,
                'ranperda' => [
                    'rencana' => $propem,
                    'harmonisasi' => $harmPerda,
                    'rasio' => $rasioPerda,
                    'surplus' => $harmPerda > $propem,
                    'surplus_selisih' => max(0, $harmPerda - $propem),
                ],
                'ranperkada' => [
                    'rencana' => $progsun,
                    'harmonisasi' => $harmPerkada,
                    'rasio' => $rasioPerkada,
                    'surplus' => $harmPerkada > $progsun,
                    'surplus_selisih' => max(0, $harmPerkada - $progsun),
                ],
                'total' => [
                    'rencana' => $totalRencanaWilayah,
                    'harmonisasi' => $totalHarmWilayah,
                    'rasio' => $rasioTotalWilayah,
                    'surplus' => $totalHarmWilayah > $totalRencanaWilayah,
                    'surplus_selisih' => max(0, $totalHarmWilayah - $totalRencanaWilayah),
                ],
            ];
        }

        // Urutkan default sesuai tabel rekap baku
        usort($wilayahList, fn ($a, $b) => $a['urutan'] <=> $b['urutan']);

        $totalRencanaGabungan = $totalPropem + $totalProgsun;
        $totalHarmGabungan = $totalHarmPerda + $totalHarmPerkada;

        $rasioTotalPerda = $totalPropem > 0 ? round(($totalHarmPerda / $totalPropem) * 100, 1) : 0;
        $rasioTotalPerkada = $totalProgsun > 0 ? round(($totalHarmPerkada / $totalProgsun) * 100, 1) : 0;
        $rasioTotalGabungan = $totalRencanaGabungan > 0 ? round(($totalHarmGabungan / $totalRencanaGabungan) * 100, 1) : 0;

        return [
            'tahun' => $tahun,
            'tipe_sumber' => 'sistem',
            'label_sumber' => "Data sistem tahun berjalan ({$tahun})",
            'keterangan_sumber' => "Sumber: {$sumberResmi}",
            'is_live' => true,
            'last_updated_at' => Carbon::now()->toIso8601String(),
            'ringkasan' => [
                'ranperda' => [
                    'label_rencana' => 'ProPem Ranperda',
                    'label_target' => $labelTargetPerda,
                    'sublabel_target' => $sublabelTargetPerda,
                    'footnote_target' => $footnoteTargetPerda,
                    'rencana' => $totalPropem,
                    'harmonisasi' => $totalHarmPerda,
                    'rasio' => $rasioTotalPerda,
                    'rasio_label' => number_format($rasioTotalPerda, 1, ',', '.') . '%',
                    'istilah' => 'Program Pembentukan Peraturan Daerah',
                ],
                'ranperkada' => [
                    'label_rencana' => 'Progsun Ranperkada',
                    'label_target' => $labelTargetPerkada,
                    'sublabel_target' => $sublabelTargetPerkada,
                    'footnote_target' => $footnoteTargetPerkada,
                    'rencana' => $totalProgsun,
                    'harmonisasi' => $totalHarmPerkada,
                    'rasio' => $rasioTotalPerkada,
                    'rasio_label' => number_format($rasioTotalPerkada, 1, ',', '.') . '%',
                    'istilah' => 'Program Penyusunan Peraturan Kepala Daerah',
                ],
                'gabungan' => [
                    'label_rencana' => 'Total Rencana Regulasi',
                    'label_target' => $hasOfficialPlan ? 'Target Direncanakan' : 'Permohonan Masuk',
                    'sublabel_target' => $hasOfficialPlan ? 'Total rencana regulasi daerah' : "Total permohonan regulasi diajukan tahun {$tahun}",
                    'footnote_target' => $hasOfficialPlan ? 'target program' : 'permohonan masuk',
                    'rencana' => $totalRencanaGabungan,
                    'harmonisasi' => $totalHarmGabungan,
                    'rasio' => $rasioTotalGabungan,
                    'rasio_label' => number_format($rasioTotalGabungan, 1, ',', '.') . '%',
                ],
            ],
            'wilayah' => $wilayahList,
            'available_years' => $availableYears,
        ];
    }
}
