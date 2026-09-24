<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Kabupaten;
use App\Models\RancanganRegulasi;
use App\Models\RencanaRegulasi;
use App\Services\StatistikHarmonisasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminRencanaController extends Controller
{
    /**
     * Tampilkan Halaman Pengelolaan Target Rencana ProPem & Progsun (Admin)
     */
    public function index(Request $request): Response
    {
        $currentYear = (int) date('Y');
        $selectedYear = (int) $request->query('tahun', $currentYear);

        $allKabupaten = Kabupaten::with('timKerja')->orderBy('kabupaten_id')->get();

        // Ambil data rencana yang tersimpan di DB untuk tahun terpilih
        $rencanaRows = RencanaRegulasi::where('tahun', $selectedYear)->get();

        // Hitung realisasi harmonisasi yang sudah selesai di sistem pada tahun tersebut
        $realisasiHarmonisasi = RancanganRegulasi::whereNotNull('harmonisasi_completed_at')
            ->whereYear('harmonisasi_completed_at', $selectedYear)
            ->select('kabupaten_id', 'jenis_regulasi_id', DB::raw('COUNT(DISTINCT rancangan_id) as total_selesai'))
            ->groupBy('kabupaten_id', 'jenis_regulasi_id')
            ->get();

        // Cek status publikasi tahun ini
        $isPublished = $rencanaRows->first()?->is_published ?? false;
        $publishedAt = $rencanaRows->first()?->published_at?->format('d/m/Y H:i');
        $sumberResmi = $rencanaRows->first()?->sumber_resmi ?? '';

        $items = [];
        foreach ($allKabupaten as $kab) {
            $kabId = (int) $kab->kabupaten_id;

            $rowPerda = $rencanaRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            );
            $rowPerkada = $rencanaRows->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            );

            $propem = $rowPerda ? (int) $rowPerda->jumlah_rencana : 0;
            $progsun = $rowPerkada ? (int) $rowPerkada->jumlah_rencana : 0;

            $harmPerda = (int) ($realisasiHarmonisasi->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 1
            )?->total_selesai ?? 0);

            $harmPerkada = (int) ($realisasiHarmonisasi->first(
                fn ($r) => (int) $r->kabupaten_id === $kabId && (int) $r->jenis_regulasi_id === 2
            )?->total_selesai ?? 0);

            $items[] = [
                'kabupaten_id' => $kabId,
                'nama_kabupaten' => $kab->nama_kabupaten,
                'nama_singkat' => StatistikHarmonisasiService::NAMA_SINGKAT_WILAYAH[$kabId] ?? $kab->nama_kabupaten,
                'kelompok' => StatistikHarmonisasiService::KELOMPOK_WILAYAH[$kabId] ?? 'Kabupaten',
                'urutan' => StatistikHarmonisasiService::URUTAN_BAKU_KABUPATEN[$kabId] ?? 99,
                'propem' => $propem,
                'progsun' => $progsun,
                'harm_ranperda' => $harmPerda,
                'harm_ranperkada' => $harmPerkada,
            ];
        }

        // Urutkan baku
        usort($items, fn ($a, $b) => $a['urutan'] <=> $b['urutan']);

        // Daftar tahun yang ada rencananya di database
        $distinctYears = RencanaRegulasi::select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun')
            ->toArray();

        if (! in_array($currentYear, $distinctYears)) {
            $distinctYears[] = $currentYear;
            sort($distinctYears);
        }

        return Inertia::render('Admin/RencanaRegulasiPage', [
            'selectedYear' => $selectedYear,
            'availableYears' => array_values(array_unique($distinctYears)),
            'items' => $items,
            'isPublished' => $isPublished,
            'publishedAt' => $publishedAt,
            'sumberResmi' => $sumberResmi,
        ]);
    }

    /**
     * Simpan / Perbarui Rencana ProPem & Progsun Per Wilayah
     */
    public function storeOrUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2020', 'max:2100'],
            'sumber_resmi' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.kabupaten_id' => ['required', 'integer', 'exists:kabupaten,kabupaten_id'],
            'items.*.propem' => ['required', 'integer', 'min:0'],
            'items.*.progsun' => ['required', 'integer', 'min:0'],
        ]);

        $tahun = (int) $validated['tahun'];
        $sumberResmi = $validated['sumber_resmi'] ?? 'Surat Keputusan Resmi Pemda/DPRD';
        $user = Auth::user();
        $now = now();

        // Cek status publikasi saat ini untuk tahun tersebut
        $currentPublished = RencanaRegulasi::where('tahun', $tahun)->value('is_published') ?? false;

        DB::transaction(function () use ($validated, $tahun, $sumberResmi, $user, $now, $currentPublished) {
            foreach ($validated['items'] as $item) {
                $kabId = (int) $item['kabupaten_id'];
                $propem = (int) $item['propem'];
                $progsun = (int) $item['progsun'];

                // Ranperda (1)
                RencanaRegulasi::updateOrCreate(
                    [
                        'tahun' => $tahun,
                        'kabupaten_id' => $kabId,
                        'jenis_regulasi_id' => 1,
                    ],
                    [
                        'jumlah_rencana' => $propem,
                        'sumber_resmi' => $sumberResmi,
                        'is_published' => $currentPublished,
                        'updated_by' => $user?->user_id,
                        'updated_at' => $now,
                    ]
                );

                // Ranperkada (2)
                RencanaRegulasi::updateOrCreate(
                    [
                        'tahun' => $tahun,
                        'kabupaten_id' => $kabId,
                        'jenis_regulasi_id' => 2,
                    ],
                    [
                        'jumlah_rencana' => $progsun,
                        'sumber_resmi' => $sumberResmi,
                        'is_published' => $currentPublished,
                        'updated_by' => $user?->user_id,
                        'updated_at' => $now,
                    ]
                );
            }
        });

        AuditLog::create([
            'user_id' => $user?->user_id,
            'action' => 'UPDATE_RENCANA_REGULASI',
            'module' => 'STATISTIK_PROPEM_PROGSUN',
            'target_id' => (string) $tahun,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'tahun' => $tahun,
                'sumber_resmi' => $sumberResmi,
                'total_wilayah' => count($validated['items']),
            ],
            'created_at' => $now,
        ]);

        return back()->with('success', "Target rencana ProPem dan Progsun tahun {$tahun} berhasil disimpan.");
    }

    /**
     * Aktifkan / Nonaktifkan Publikasi Dataset Tahun Berjalan ke Landing Page
     */
    public function togglePublishYear(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2020', 'max:2100'],
            'is_published' => ['required', 'boolean'],
        ]);

        $tahun = (int) $validated['tahun'];
        $isPublished = (bool) $validated['is_published'];
        $user = Auth::user();
        $now = now();

        $rowsCount = RencanaRegulasi::where('tahun', $tahun)->count();
        if ($rowsCount === 0 && $isPublished) {
            return back()->with('error', "Gagal mempublikasikan: data rencana tahun {$tahun} belum diinput.");
        }

        RencanaRegulasi::where('tahun', $tahun)->update([
            'is_published' => $isPublished,
            'published_at' => $isPublished ? $now : null,
            'updated_by' => $user?->user_id,
            'updated_at' => $now,
        ]);

        AuditLog::create([
            'user_id' => $user?->user_id,
            'action' => $isPublished ? 'PUBLISH_RENCANA_REGULASI' : 'UNPUBLISH_RENCANA_REGULASI',
            'module' => 'STATISTIK_PROPEM_PROGSUN',
            'target_id' => (string) $tahun,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'tahun' => $tahun,
                'is_published' => $isPublished,
            ],
            'created_at' => $now,
        ]);

        $msg = $isPublished
            ? "Publikasi data sistem tahun {$tahun} BERHASIL DIAKTIFKAN pada landing page publik."
            : "Publikasi data sistem tahun {$tahun} DINONAKTIFKAN. Tampilan publik kembali ke data historis 2025.";

        return back()->with('success', $msg);
    }
}
