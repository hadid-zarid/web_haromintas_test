<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SimpanRekapRequest;
use App\Models\AuditLog;
use App\Models\RekapTahun;
use App\Services\StatistikHarmonisasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Menu "Target ProPem & Progsun": rekap angka per tahun yang tampil di landing page.
 * Semua angka diisi manual oleh Admin; logika ada di StatistikHarmonisasiService.
 */
class AdminRencanaController extends Controller
{
    public function __construct(
        protected StatistikHarmonisasiService $service
    ) {}

    public function index(Request $request): Response
    {
        $daftarTahun = RekapTahun::orderByDesc('tahun')->get();

        $terpilih = $daftarTahun->firstWhere('tahun', (int) $request->query('tahun'))
            ?? $daftarTahun->firstWhere('is_default', true)
            ?? $daftarTahun->first();

        return Inertia::render('Admin/RencanaRegulasiPage', [
            'daftarTahun' => $daftarTahun->map(fn (RekapTahun $r) => [
                'tahun' => $r->tahun,
                'is_published' => $r->is_published,
                'is_default' => $r->is_default,
                'published_at' => $r->published_at?->format('d/m/Y H:i'),
            ])->values(),
            'rekap' => $terpilih ? [
                'tahun' => $terpilih->tahun,
                'sumber' => $terpilih->sumber ?? '',
                'wilayah' => $this->service->rekapWilayah($terpilih->tahun),
            ] : null,
        ]);
    }

    public function storeTahun(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2020', 'max:'.(now()->year + 1), Rule::unique('rekap_statistik_tahun', 'tahun')],
        ], [
            'tahun.required' => 'Tahun wajib diisi.',
            'tahun.integer' => 'Tahun harus berupa angka.',
            'tahun.min' => 'Tahun minimal 2020.',
            'tahun.max' => 'Tahun maksimal :max.',
            'tahun.unique' => 'Rekap tahun ini sudah ada.',
        ]);

        $rekap = RekapTahun::create(['tahun' => $validated['tahun'], 'updated_by' => $request->user()->user_id]);

        $this->catatAudit($request, 'REKAP_TAHUN_CREATE', $rekap->tahun);

        return to_route('admin.rencana.index', ['tahun' => $rekap->tahun])
            ->with('success', "Rekap tahun {$rekap->tahun} dibuat sebagai draf. Isi angkanya lalu simpan.");
    }

    public function update(SimpanRekapRequest $request, int $tahun): RedirectResponse
    {
        $rekap = RekapTahun::findOrFail($tahun);
        $total = function () use ($tahun) {
            $wilayah = $this->service->rekapWilayah($tahun);

            return collect(SimpanRekapRequest::KOLOM_ANGKA)
                ->mapWithKeys(fn ($kolom) => [$kolom => array_sum(array_column($wilayah, $kolom))])
                ->all();
        };

        $sebelum = $total();
        $this->service->simpanRekap($rekap, $request->validated('sumber'), $request->validated('items'), $request->user()->user_id);

        $this->catatAudit($request, 'REKAP_UPDATE', $tahun, ['total_sebelum' => $sebelum, 'total_sesudah' => $total()]);

        return back()->with('success', "Rekap tahun {$tahun} berhasil disimpan.");
    }

    public function updatePublikasi(Request $request, int $tahun): RedirectResponse
    {
        $tayang = $request->validate(['is_published' => ['required', 'boolean']])['is_published'];
        $rekap = RekapTahun::findOrFail($tahun);

        $this->service->setPublikasi($rekap, (bool) $tayang, $request->user()->user_id);
        $this->catatAudit($request, $tayang ? 'REKAP_PUBLISH' : 'REKAP_UNPUBLISH', $tahun);

        return back()->with('success', $tayang
            ? "Rekap tahun {$tahun} sekarang tayang di landing page."
            : "Rekap tahun {$tahun} ditarik dari landing page dan kembali menjadi draf.");
    }

    public function updateUtama(Request $request, int $tahun): RedirectResponse
    {
        $this->service->setTampilPertama(RekapTahun::findOrFail($tahun), $request->user()->user_id);
        $this->catatAudit($request, 'REKAP_SET_UTAMA', $tahun);

        return back()->with('success', "Landing page sekarang pertama kali menampilkan rekap tahun {$tahun}.");
    }

    public function destroy(Request $request, int $tahun): RedirectResponse
    {
        $this->service->hapusDraf(RekapTahun::findOrFail($tahun));
        $this->catatAudit($request, 'REKAP_TAHUN_DELETE', $tahun);

        return to_route('admin.rencana.index')->with('success', "Draf rekap tahun {$tahun} dihapus.");
    }

    private function catatAudit(Request $request, string $action, int $tahun, array $payload = []): void
    {
        AuditLog::create([
            'user_id' => $request->user()->user_id,
            'action' => $action,
            'module' => 'STATISTIK_PROPEM_PROGSUN',
            'target_id' => (string) $tahun,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => ['tahun' => $tahun, ...$payload],
            'created_at' => now(),
        ]);
    }
}
