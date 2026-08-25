<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Permohonan\PermohonanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - HARMONITAS (Laravel + Inertia React)
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('landing');

Route::get('/panduan', function () {
    return Inertia::render('PanduanPage');
})->name('panduan');

// ==========================================
// 2. GUEST AUTH ROUTES (LOGIN & GOOGLE SSO)
// ==========================================
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    // Google OAuth SSO
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// ==========================================
// 3. AUTHENTICATED USER ROUTES
// ==========================================
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard Beranda Real-Time
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // Permohonan Regulasi (Ranperda & Ranperkada)
    Route::get('/peraturan', [PermohonanController::class, 'index'])->name('peraturan.index');
    Route::post('/peraturan', [PermohonanController::class, 'store'])->name('peraturan.store');
    Route::get('/peraturan/{id}', [PermohonanController::class, 'show'])->name('peraturan.show');
    Route::put('/peraturan/{id}', [PermohonanController::class, 'update'])->name('peraturan.update');
    Route::delete('/peraturan/{id}', [PermohonanController::class, 'destroy'])->name('peraturan.destroy');
    Route::post('/peraturan/{id}/dokumen', [PermohonanController::class, 'uploadDokumen'])->name('peraturan.dokumen.upload');
    Route::post('/peraturan/{id}/status', [PermohonanController::class, 'updateStatus'])->name('peraturan.status.update');
    Route::get('/dokumen/{dokumen}/view', [PermohonanController::class, 'viewDokumen'])->name('dokumen.view');
    Route::get('/dokumen/{dokumen}/download', [PermohonanController::class, 'downloadDokumen'])->name('dokumen.download');

    // Draft Generate Surat
    Route::get('/draft-generate', function () {
        return Inertia::render('DraftGeneratePage');
    })->name('draft.generate');

    // Notifikasi Sistem
    Route::get('/notifikasi', [\App\Http\Controllers\NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::post('/notifikasi/{id}/read', [\App\Http\Controllers\NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
    Route::post('/notifikasi/read-all', [\App\Http\Controllers\NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.read-all');

    // HARMONITAS AI
    Route::get('/ai', function () {
        return Inertia::render('AIAssistantPage');
    })->name('ai');

    // API - Generate Surat DOCX
    Route::match(['get', 'post'], '/api/generate-surat-docx', function (Request $request) {
        $type = strtolower($request->input('type', 'perda'));
        $filename = $type === 'perda' ? 'SURAT SELESAI PERDA.docx' : 'SURAT SELESAI PERKADA.docx';
        $templatePath = base_path($filename);

        if (! file_exists($templatePath)) {
            return response()->json([
                'error' => 'Template file not found at ' . $templatePath,
            ], 404);
        }

        $nomorSurat = $request->input('nomor_surat', '1489');
        $tanggalSurat = $request->input('tanggal_surat', date('d F Y'));
        $hal = $request->input('hal', 'Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi');
        $jabatanPemrakarsa = $request->input('jabatan_pemrakarsa', 'Wali Kota Pekanbaru');
        $ibukota = $request->input('ibukota', 'Pekanbaru');
        $nomorSuratP = $request->input('nomor_surat_p', '180/HK/2024/045');
        $tanggalSuratP = $request->input('tanggal_surat_p', '12 Juli 2024');
        $jenisPeraturan = $request->input('jenis_peraturan', $type === 'perda' ? 'Peraturan Daerah' : 'Peraturan Wali Kota');
        $asalPemrakarsa = $request->input('asal_pemrakarsa', 'Kota Pekanbaru');
        $judulPeraturan = $request->input('judul_peraturan', 'Pajak Daerah dan Retribusi Daerah');

        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $tempFile = $tempDir . '/Surat_Selesai_' . strtoupper($type) . '_' . uniqid() . '.docx';
        if (! copy($templatePath, $tempFile)) {
            return response()->json([
                'error' => 'Gagal membuat file temporary DOCX.',
            ], 500);
        }

        $zip = new ZipArchive();
        if ($zip->open($tempFile) === true) {
            $xml = $zip->getFromName('word/document.xml');
            if ($xml === false) {
                $zip->close();
                if (file_exists($tempFile)) {
                    unlink($tempFile);
                }
                return response()->json([
                    'error' => 'Gagal membaca document.xml dari template Word.',
                ], 500);
            }

            $replacements = [
                'NOMOR_SURAT' => $nomorSurat,
                'TANGGAL_SURAT' => $tanggalSurat,
                'HAL' => $hal,
                'JABATAN_PEMRAKARSA' => $jabatanPemrakarsa,
                'IBUKOTA' => $ibukota,
                'NOMOR_SURAT_P' => $nomorSuratP,
                'TANGGAL_SURAT_P' => $tanggalSuratP,
                'JENIS_PERATURAN' => $jenisPeraturan,
                'ASAL_PEMRAKARSA' => $asalPemrakarsa,
                'JUDUL_PERATURAN' => $judulPeraturan,
            ];

            // 1. Hapus tag fldSimple agar tidak dianggap sebagai Word Field kosong
            $xml = preg_replace('/<\/?w:fldSimple[^>]*>/i', '', $xml);

            // 2. Hapus marker fldChar (begin, separate, end) agar Word memperlakukan teks sebagai teks polos permanen
            $xml = preg_replace('/<w:fldChar[^>]*\/>/i', '', $xml);

            // 3. Hapus tag instruksi MERGEFIELD
            $xml = preg_replace('/<w:instrText[^>]*>.*?<\/w:instrText>/i', '', $xml);

            // 4. Ganti placeholder «KEY» dan {{KEY}} dengan nilai input dari form
            foreach ($replacements as $key => $val) {
                $safeVal = htmlspecialchars($val, ENT_XML1, 'UTF-8');
                $xml = str_replace("«{$key}»", $safeVal, $xml);
                $xml = str_replace("{{{$key}}}", $safeVal, $xml);
            }

            $zip->addFromString('word/document.xml', $xml);
            $zip->close();

            $downloadName = 'Surat_Selesai_' . strtoupper($type) . '_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $nomorSurat) . '.docx';

            return response()->download($tempFile, $downloadName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="' . $downloadName . '"',
            ])->deleteFileAfterSend(true);
        }

        if (file_exists($tempFile)) {
            unlink($tempFile);
        }

        return response()->json([
            'error' => 'Gagal memproses file template Word.',
        ], 500);
    });

    // ==========================================
    // 4. ADMIN ONLY - MANAGE ACCOUNTS / RBAC
    // ==========================================
    Route::prefix('admin')->name('admin.')->middleware('role:ADMIN')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
    });
});