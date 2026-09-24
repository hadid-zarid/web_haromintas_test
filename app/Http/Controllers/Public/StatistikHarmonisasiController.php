<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\StatistikHarmonisasiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatistikHarmonisasiController extends Controller
{
    public function __construct(
        protected StatistikHarmonisasiService $service
    ) {}

    /**
     * Endpoint API Publik untuk Visualisasi Data ProPem & Progsun HARMONITAS
     * Hanya mengembalikan agregat aman tanpa informasi sensitif atau internal berkas.
     */
    public function getStatistik(Request $request): JsonResponse
    {
        $request->validate([
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        $tahun = $request->query('tahun') ? (int) $request->query('tahun') : null;

        $data = $this->service->getStatistik($tahun);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], 200, [
            'Cache-Control' => 'no-cache, private',
        ]);
    }
}
