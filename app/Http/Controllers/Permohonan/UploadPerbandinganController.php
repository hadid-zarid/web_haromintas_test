<?php

namespace App\Http\Controllers\Permohonan;

use App\Http\Controllers\Controller;
use App\Services\DocumentTextExtractionService;
use App\Services\PasalDiffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

/**
 * Perbandingan Pasal-per-Pasal dengan mengunggah 2 berkas langsung, tanpa
 * bergantung pada dokumen yang sudah tersimpan di berkas permohonan
 * (RancanganRegulasi/Dokumen). Berguna untuk pengguna yang ingin
 * membandingkan naskah dari luar sistem, atau saat dokumen di suatu berkas
 * belum diunggah lewat alur permohonan resmi. Dilindungi middleware 'auth'
 * (lihat routes/web.php) — beda dari tester dev-only di PasalDiffTesterController
 * yang justru sengaja tanpa login tapi hanya aktif di environment local.
 */
class UploadPerbandinganController extends Controller
{
    public function __construct(
        private readonly DocumentTextExtractionService $extractor,
        private readonly PasalDiffService $pasalDiff,
    ) {
    }

    public function show(): Response
    {
        return Inertia::render('UploadPerbandinganPage');
    }

    public function compare(Request $request): JsonResponse
    {
        $request->validate([
            'file_a' => ['required', 'file', 'mimes:pdf,docx', 'max:20480'],
            'file_b' => ['required', 'file', 'mimes:pdf,docx', 'max:20480'],
        ]);

        $tempDir = storage_path('app/temp/upload_perbandingan');
        if (! is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $fileA = $request->file('file_a');
        $fileB = $request->file('file_b');

        $nameA = uniqid('a_') . '.' . $fileA->getClientOriginalExtension();
        $nameB = uniqid('b_') . '.' . $fileB->getClientOriginalExtension();

        $pathA = $fileA->move($tempDir, $nameA)->getPathname();
        $pathB = $fileB->move($tempDir, $nameB)->getPathname();

        try {
            $textA = $this->extractor->extractFromPath($pathA);
            $textB = $this->extractor->extractFromPath($pathB);

            $result = $this->pasalDiff->compareFullText($textA, $textB);

            return response()->json([
                'success' => true,
                'dokumen_a' => ['nama_file' => $fileA->getClientOriginalName()],
                'dokumen_b' => ['nama_file' => $fileB->getClientOriginalName()],
                'summary' => $result['summary'],
                'pasal' => $result['pasal'],
            ]);
        } catch (Throwable $e) {
            $message = $e instanceof RuntimeException
                ? $e->getMessage()
                : 'Terjadi kesalahan saat memproses berkas. Silakan coba lagi.';

            return response()->json(['success' => false, 'message' => $message], 422);
        } finally {
            @unlink($pathA);
            @unlink($pathB);
        }
    }
}
