<?php

namespace App\Http\Controllers\Permohonan;

use App\Http\Controllers\Concerns\AuthorizesRancanganAccess;
use App\Http\Controllers\Controller;
use App\Models\Dokumen;
use App\Models\RancanganRegulasi;
use App\Models\User;
use App\Services\DocumentTextExtractionService;
use App\Services\PasalDiffService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

/**
 * Perbandingan naskah Pasal-per-Pasal antar dua dokumen pada satu berkas
 * permohonan — paling relevan untuk "Draft Rancangan" vs "Draft Hasil
 * Harmonisasi" (dua-dunya jenis dokumen yang berisi naskah regulasi utuh),
 * namun pengguna bebas memilih dokumen lain. Menggunakan diff algoritmik (LCS)
 * yang deterministik, bukan LLM, agar hasil "apa yang berubah" bisa diaudit
 * dan tidak berisiko halusinasi pada naskah hukum resmi.
 */
class DokumenPerbandinganController extends Controller
{
    use AuthorizesRancanganAccess;

    public function __construct(
        private readonly DocumentTextExtractionService $extractor,
        private readonly PasalDiffService $pasalDiff,
    ) {
    }

    public function show(Request $request, $id): Response
    {
        $user = Auth::user();

        $rancangan = RancanganRegulasi::with([
            'jenisRegulasi',
            'kabupaten.timKerja',
            'timKerja',
            'dokumens.jenisDokumen',
        ])->findOrFail($id);

        $this->authorizeRancanganAccess($rancangan, $user);

        $dokumenAId = $request->query('dokumen_a_id');
        $dokumenBId = $request->query('dokumen_b_id');

        $comparison = null;
        $comparisonError = null;

        if ($dokumenAId && $dokumenBId) {
            try {
                $comparison = $this->compareDokumen($rancangan, (int) $dokumenAId, (int) $dokumenBId, $user);
            } catch (Throwable $e) {
                Log::warning('Gagal membandingkan dokumen rancangan #' . $rancangan->rancangan_id . ': ' . $e->getMessage());
                $comparisonError = $e instanceof RuntimeException
                    ? $e->getMessage()
                    : 'Terjadi kesalahan saat memproses perbandingan dokumen. Silakan coba lagi.';
            }
        }

        return Inertia::render('PerbandinganDokumenPage', [
            'permohonan' => $rancangan,
            'selected' => [
                'dokumen_a_id' => $dokumenAId ? (int) $dokumenAId : null,
                'dokumen_b_id' => $dokumenBId ? (int) $dokumenBId : null,
            ],
            'comparison' => $comparison,
            'comparisonError' => $comparisonError,
        ]);
    }

    private function compareDokumen(RancanganRegulasi $rancangan, int $dokumenAId, int $dokumenBId, ?User $user): array
    {
        if ($dokumenAId === $dokumenBId) {
            throw new RuntimeException('Pilih dua dokumen yang berbeda untuk dibandingkan.');
        }

        $dokumenA = Dokumen::with('jenisDokumen')
            ->where('rancangan_id', $rancangan->rancangan_id)
            ->findOrFail($dokumenAId);
        $dokumenB = Dokumen::with('jenisDokumen')
            ->where('rancangan_id', $rancangan->rancangan_id)
            ->findOrFail($dokumenBId);

        $this->authorizeDocumentAccess($dokumenA, $user);
        $this->authorizeDocumentAccess($dokumenB, $user);

        $pathA = $this->resolveDokumenPath($dokumenA);
        $pathB = $this->resolveDokumenPath($dokumenB);

        if (! $pathA) {
            throw new RuntimeException("Berkas fisik '{$dokumenA->nama_file}' tidak ditemukan di server.");
        }
        if (! $pathB) {
            throw new RuntimeException("Berkas fisik '{$dokumenB->nama_file}' tidak ditemukan di server.");
        }

        $textA = $this->extractor->extractFromPath($pathA);
        $textB = $this->extractor->extractFromPath($pathB);

        $result = $this->pasalDiff->compareFullText($textA, $textB);

        return [
            'dokumen_a' => [
                'dokumen_id' => $dokumenA->dokumen_id,
                'nama_file' => $dokumenA->nama_file,
                'nama_dokumen' => $dokumenA->jenisDokumen?->nama_dokumen,
                'versi' => $dokumenA->versi,
            ],
            'dokumen_b' => [
                'dokumen_id' => $dokumenB->dokumen_id,
                'nama_file' => $dokumenB->nama_file,
                'nama_dokumen' => $dokumenB->jenisDokumen?->nama_dokumen,
                'versi' => $dokumenB->versi,
            ],
            'summary' => $result['summary'],
            'pasal' => $result['pasal'],
        ];
    }

    /**
     * Resolusi lokasi file fisik dokumen di direktori penyimpanan aman.
     * Sengaja tidak memakai fallback berkas contoh/demo — jika berkas tidak
     * ditemukan, perbandingan harus gagal dengan jelas, bukan diam-diam
     * membandingkan berkas yang salah.
     */
    private function resolveDokumenPath(Dokumen $dokumen): ?string
    {
        if (! $dokumen->path_file) {
            return null;
        }

        $candidates = [
            storage_path('app/' . $dokumen->path_file),
            storage_path('app/secure_drafts/' . $dokumen->path_file),
            storage_path('app/secure_drafts/' . basename($dokumen->path_file)),
            storage_path('app/public/' . $dokumen->path_file),
        ];

        foreach ($candidates as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return null;
    }
}
