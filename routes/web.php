<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
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

Route::get('/error-preview/{status?}', function ($status = 404) {
    return Inertia::render('ErrorPage', [
        'status' => (int) $status,
    ]);
})->name('error.preview');

// ==========================================
// 2. GUEST AUTH ROUTES (LOGIN, FORGOT PASSWORD & GOOGLE SSO)
// ==========================================
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    // Lupa Password & Reset Password Routes
    Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');

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
    Route::post('/api/generate-surat-docx', function (Request $request) {
        $type = strtolower($request->input('type', 'perda'));

        // Batasi ketat ke dua nilai valid — 'type' dipakai untuk menyusun path file.
        abort_unless(in_array($type, ['perda', 'perkada'], true), 400, 'Jenis surat tidak valid.');

        // Helper closure to read XML from zip/docx file
        $readXmlFromZip = function ($zipFilePath) {
            if (class_exists('ZipArchive')) {
                $zip = new \ZipArchive();
                if ($zip->open($zipFilePath) === true) {
                    $xml = $zip->getFromName('word/document.xml');
                    $zip->close();
                    return $xml !== false ? $xml : null;
                }
            }
            try {
                $phar = new \PharData($zipFilePath);
                if (isset($phar['word/document.xml'])) {
                    return file_get_contents($phar['word/document.xml']->getPathname());
                }
            } catch (\Throwable $e) {
                \Log::error('Failed to read XML from zip using PharData: ' . $e->getMessage());
            }
            return null;
        };

        // Helper closure to write XML into zip/docx file
        $writeXmlToZip = function ($zipFilePath, $xmlContent) {
            if (class_exists('ZipArchive')) {
                $zip = new \ZipArchive();
                if ($zip->open($zipFilePath) === true) {
                    $zip->addFromString('word/document.xml', $xmlContent);
                    $zip->close();
                    return true;
                }
            }
            try {
                $phar = new \PharData($zipFilePath);
                $phar->addFromString('word/document.xml', $xmlContent);
                return true;
            } catch (\Throwable $e) {
                \Log::error('Failed to write XML to zip using PharData: ' . $e->getMessage());
            }
            return false;
        };

        $filename = $type === 'perda' ? 'SURAT SELESAI PERDA.docx' : 'SURAT SELESAI PERKADA.docx';
        $templatePath = base_path($filename);

        if (! file_exists($templatePath)) {
            return response()->json([
                'error' => 'Template file not found at ' . $templatePath,
            ], 404);
        }

        $rawNomorSurat = (string) $request->input('nomor_surat', '1489');
        $nomorSurat = preg_replace('/^W\.4-PP\.04\.02-/i', '', trim($rawNomorSurat));
        $tanggalSurat = (string) $request->input('tanggal_surat', date('d F Y'));
        $hal = (string) $request->input('hal', 'Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi');
        $jabatanPemrakarsa = (string) $request->input('jabatan_pemrakarsa', 'Wali Kota Pekanbaru');
        $ibukota = (string) $request->input('ibukota', 'Pekanbaru');
        $nomorSuratP = (string) $request->input('nomor_surat_p', '180/HK/2024/045');
        $tanggalSuratP = (string) $request->input('tanggal_surat_p', '12 Juli 2024');
        $jenisPeraturan = (string) $request->input('jenis_peraturan', $type === 'perda' ? 'Peraturan Daerah' : 'Peraturan Wali Kota');
        $asalPemrakarsa = (string) $request->input('asal_pemrakarsa', 'Kota Pekanbaru');
        $judulPeraturan = (string) $request->input('judul_peraturan', 'Pajak Daerah dan Retribusi Daerah');
        $jabatanKakanwil = (string) $request->input('jabatan_kakanwil', 'Kepala Kantor Wilayah');
        $namaKakanwil = (string) $request->input('nama_kakanwil', 'Rudy Hendra Pakpahan');

        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0775, true);
        }

        $tempFile = $tempDir . '/Surat_Selesai_' . strtoupper($type) . '_' . uniqid() . '.docx';
        if (! copy($templatePath, $tempFile)) {
            return response()->json([
                'error' => 'Gagal membuat file temporary DOCX.',
            ], 500);
        }

        $xml = $readXmlFromZip($tempFile);
        if ($xml === null) {
            if (file_exists($tempFile)) {
                unlink($tempFile);
            }
            return response()->json([
                'error' => 'Gagal membaca document.xml dari template Word.',
            ], 500);
        }

        // Dasar hukum PERKADA berbeda dari PERDA — terapkan pada salinan sementara ini
        // (bukan dengan menimpa file template di root proyek).
        if ($type === 'perkada') {
            $xml = str_replace(
                'Pasal 58 Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan',
                'Pasal 97D Undang-Undang Nomor 13 Tahun 2022 tentang Perubahan Kedua Atas Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan',
                $xml
            );
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
            'JABATAN_KAKANWIL' => $jabatanKakanwil,
            'NAMA_KAKANWIL' => $namaKakanwil,
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

        // 5. Ganti nomor surat hardcoded (seperti 3375) jika ada
        $safeNomor = htmlspecialchars($nomorSurat, ENT_XML1, 'UTF-8');
        $xml = preg_replace('/(W\.4-PP\.04\.02-)[0-9A-Za-z\-_]+/i', '${1}' . $safeNomor, $xml);
        $xml = str_replace('>3375<', '>' . $safeNomor . '<', $xml);

        $written = $writeXmlToZip($tempFile, $xml);

        if ($written && file_exists($tempFile)) {
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