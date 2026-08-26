<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Kabupaten;
use App\Models\RancanganRegulasi;
use App\Models\StatusRegulasi;
use App\Models\TimKerja;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Tampilkan Dashboard Beranda Terintegrasi Database & Real-Time
     * Sesuai Cakupan Kewenangan Masing-Masing Tim Kerja & Role Pengguna
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = RancanganRegulasi::with([
            'jenisRegulasi',
            'kabupaten.timKerja',
            'statusRegulasi',
            'timKerja',
            'dokumens',
        ]);

        // Isolasi Wilayah & Cakupan Kerja
        // Jika Tim Kerja, hanya ambil data regulasi wilayah binaan miliknya
        $isTim = $user && $user->isTimKerja() && $user->tim_kerja_id;
        if ($isTim) {
            $query->where('tim_kerja_id', $user->tim_kerja_id);
        }

        $allData = $query->get();

        $total = $allData->count();
        $draft = $allData->where('status_id', 1)->count();
        $harmonisasi = $allData->where('status_id', 2)->count();
        $fasilitasi = $allData->where('status_id', 3)->count();
        $selesai = $allData->where('status_id', 4)->count();
        $revisi = $allData->where('status_id', 5)->count();

        // 4 Kartu Metrik Utama
        $metrics = [
            'total' => $total,
            'draft' => $draft,
            'harmonisasi' => $harmonisasi,
            'fasilitasi' => $fasilitasi,
            'selesai' => $selesai,
            'revisi' => $revisi,
            'proses' => $harmonisasi,
            'analsis' => $fasilitasi,
        ];

        // Sebaran Tahapan Status Berkas Riil
        $statusProgressItems = [
            [
                'status_id' => 1,
                'label' => 'Draf Awal (Pra-Harmonisasi)',
                'count' => $draft,
                'max' => max($total, 1),
                'color' => 'from-amber-400 to-amber-500',
                'badge' => 'bg-amber-50 text-amber-800 border-amber-200',
                'desc' => 'Draf permohonan baru & telaah awal',
            ],
            [
                'status_id' => 2,
                'label' => 'Proses Harmonisasi Kanwil',
                'count' => $harmonisasi,
                'max' => max($total, 1),
                'color' => 'from-[#FF9800] to-[#F57C00]',
                'badge' => 'bg-orange-50 text-orange-800 border-orange-200',
                'desc' => 'Rapat pleno & matriks hasil harmonisasi',
            ],
            [
                'status_id' => 3,
                'label' => 'Proses Fasilitasi Biro Hukum',
                'count' => $fasilitasi,
                'max' => max($total, 1),
                'color' => 'from-sky-400 to-sky-600',
                'badge' => 'bg-sky-50 text-sky-800 border-sky-200',
                'desc' => 'Telaah & penetapan fasilitasi Provinsi',
            ],
            [
                'status_id' => 4,
                'label' => 'Selesai & Tuntas',
                'count' => $selesai,
                'max' => max($total, 1),
                'color' => 'from-emerald-500 to-emerald-600',
                'badge' => 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'desc' => 'Surat hasil fasilitasi terbit & sah',
            ],
            [
                'status_id' => 5,
                'label' => 'Perlu Perbaikan (Revisi)',
                'count' => $revisi,
                'max' => max($total, 1),
                'color' => 'from-rose-500 to-rose-600',
                'badge' => 'bg-rose-50 text-rose-800 border-rose-200',
                'desc' => 'Dikembalikan untuk penyempurnaan pasal',
            ],
        ];

        // Sebaran Wilayah Sesuai Cakupan Tim Kerja:
        // Jika Tim Kerja: ambil seluruh Kabupaten yang menjadi tanggung jawab timnya
        // Jika Admin/Biro Hukum/Pimpinan: ambil seluruh Kabupaten di Provinsi Riau
        $kabupatenQuery = Kabupaten::with('timKerja');
        if ($isTim) {
            $kabupatenQuery->where('tim_kerja_id', $user->tim_kerja_id);
        }
        $kabupatens = $kabupatenQuery->get();

        $wilayahStats = $kabupatens->map(function ($kab) use ($allData) {
            $regs = $allData->where('kabupaten_id', $kab->kabupaten_id);
            return [
                'kabupaten_id' => $kab->kabupaten_id,
                'nama_kabupaten' => $kab->nama_kabupaten,
                'tim_kerja' => $kab->timKerja?->nama_tim_kerja ?? '-',
                'total' => $regs->count(),
                'selesai' => $regs->where('status_id', 4)->count(),
                'berjalan' => $regs->whereIn('status_id', [1, 2, 3, 5])->count(),
            ];
        })->sortByDesc('total')->values();

        // Notifikasi Tugas Riil Berdasarkan Role Pengguna
        $taskNotifications = [];
        if ($isTim) {
            $timKerjaName = $user->timKerja?->nama_tim_kerja ?? 'Tim Kerja';
            $taskNotifications = [
                [
                    'id' => 1,
                    'title' => 'Berkas Perlu Diproses / Dilengkapi',
                    'desc' => "Permohonan aktif dalam cakupan {$timKerjaName} yang menunggu rapat/dokumen.",
                    'count' => $draft + $harmonisasi,
                    'link' => '/peraturan?status_id=2',
                    'color' => 'bg-amber-500 text-white',
                ],
                [
                    'id' => 2,
                    'title' => 'Permohonan Memerlukan Perbaikan',
                    'desc' => 'Berkas yang dikembalikan Biro Hukum untuk revisi pasal.',
                    'count' => $revisi,
                    'link' => '/peraturan?status_id=5',
                    'color' => 'bg-rose-500 text-white',
                ],
            ];
        } elseif ($user && $user->isBiroHukum()) {
            $taskNotifications = [
                [
                    'id' => 1,
                    'title' => 'Berkas Masuk Siap Difasilitasi',
                    'desc' => 'Dokumen 1-5 Kanwil lengkap (5/5), menunggu telaah Biro Hukum.',
                    'count' => $fasilitasi,
                    'link' => '/peraturan?status_id=3',
                    'color' => 'bg-sky-600 text-white',
                ],
                [
                    'id' => 2,
                    'title' => 'Total Berkas Fasilitasi Selesai',
                    'desc' => 'Seluruh regulasi yang telah disahkan dan diterbitkan surat persetujuannya.',
                    'count' => $selesai,
                    'link' => '/peraturan?status_id=4',
                    'color' => 'bg-emerald-600 text-white',
                ],
            ];
        } else {
            // Admin & Pimpinan
            $taskNotifications = [
                [
                    'id' => 1,
                    'title' => 'Permohonan Aktif Sedang Diproses',
                    'desc' => 'Seluruh rancangan regulasi dalam proses harmonisasi maupun fasilitasi se-Riau.',
                    'count' => $draft + $harmonisasi + $fasilitasi + $revisi,
                    'link' => '/peraturan',
                    'color' => 'bg-[#1A1A5E] text-white',
                ],
                [
                    'id' => 2,
                    'title' => 'Regulasi Selesai & Sah (Tuntas)',
                    'desc' => 'Total produk hukum daerah yang tuntas difasilitasi di Provinsi Riau.',
                    'count' => $selesai,
                    'link' => '/peraturan?status_id=4',
                    'color' => 'bg-emerald-600 text-white',
                ],
            ];
        }

        // Tren Bulanan Riil Sesuai Cakupan Data
        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
            9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $currentYear = (int) date('Y');
        $currentMonth = (int) date('n');

        $trendData = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthData = $allData->filter(function ($item) use ($m, $currentYear) {
                if (! $item->tanggal_dibuat && ! $item->created_at) return false;
                $date = Carbon::parse($item->tanggal_dibuat ?? $item->created_at);
                return (int) $date->year === $currentYear && (int) $date->month === $m;
            });

            $trendData[] = [
                'month_num' => $m,
                'bulan' => $months[$m],
                'Total Masuk' => $monthData->count(),
                'Selesai' => $monthData->where('status_id', 4)->count(),
                'Diproses' => $monthData->whereIn('status_id', [1, 2, 3, 5])->count(),
            ];
        }

        // Recent Audit Logs: Tim Kerja hanya melihat log terkait cakupan kerjanya
        $auditQuery = AuditLog::with('user')->latest('created_at');
        if ($isTim) {
            $rancanganIds = $allData->pluck('rancangan_id')->map(fn($id) => (string) $id)->toArray();
            $auditQuery->where(function ($q) use ($rancanganIds, $user) {
                $q->whereIn('target_id', $rancanganIds)
                  ->orWhere('user_id', $user->user_id);
            });
        }
        $recentActivities = $auditQuery->limit(5)->get();

        return Inertia::render('HomePage', [
            'metrics' => $metrics,
            'statusProgressItems' => $statusProgressItems,
            'wilayahStats' => $wilayahStats,
            'taskNotifications' => $taskNotifications,
            'trendData' => $trendData,
            'recentActivities' => $recentActivities,
            'totalBerkas' => $total,
            'userScope' => [
                'isTimKerja' => $isTim,
                'timKerjaNama' => $user->timKerja?->nama_tim_kerja ?? null,
            ],
        ]);
    }
}
