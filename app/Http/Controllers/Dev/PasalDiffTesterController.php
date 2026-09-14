<?php

namespace App\Http\Controllers\Dev;

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
 * Tester mandiri untuk fitur perbandingan Pasal-per-Pasal — upload 2 berkas
 * langsung tanpa perlu login atau data Rancangan Regulasi apa pun. Dipakai
 * untuk mencoba cepat DocumentTextExtractionService + PasalDiffService secara
 * terisolasi dari alur RBAC/berkas permohonan yang sesungguhnya.
 *
 * SENGAJA tidak dilindungi middleware 'auth' karena tujuannya justru supaya
 * bisa dicoba tanpa login — karena itu HANYA aktif di environment local, dan
 * mengembalikan 404 di environment lain (staging/production) agar tidak
 * pernah bisa dipakai untuk membaca berkas server tanpa autentikasi.
 */
class PasalDiffTesterController extends Controller
{
    public function __construct(
        private readonly DocumentTextExtractionService $extractor,
        private readonly PasalDiffService $pasalDiff,
    ) {
    }

    public function show(): Response
    {
        $this->guardLocalOnly();

        return Inertia::render('TestPerbandinganPage');
    }

    public function compare(Request $request): JsonResponse
    {
        $this->guardLocalOnly();

        $validated = $request->validate([
            'file_a' => ['required', 'file', 'mimes:pdf,docx', 'max:20480'],
            'file_b' => ['required', 'file', 'mimes:pdf,docx', 'max:20480'],
        ]);

        $tempDir = storage_path('app/temp/test_perbandingan');
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

    private function guardLocalOnly(): void
    {
        abort_unless(app()->environment('local'), 404);
    }
}
