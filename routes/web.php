<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
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
// 2. GUEST AUTH ROUTES
// ==========================================

Route::middleware('guest')->group(function () {

    Route::get('/login', [AuthController::class, 'showLogin'])
        ->name('login');

    Route::post('/login', [AuthController::class, 'login']);

    // Google OAuth SSO
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])
        ->name('auth.google.redirect');

    Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])
        ->name('auth.google.callback');
});


// ==========================================
// 3. AUTHENTICATED USER ROUTES
// ==========================================

Route::middleware('auth')->group(function () {

    // ==========================================
    // LOGOUT
    // ==========================================

    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');


    // ==========================================
    // DASHBOARD
    // ==========================================

    Route::get('/home', function () {
        return Inertia::render('HomePage');
    })->name('home');


    // ==========================================
    // PERMOHONAN PERATURAN
    // ==========================================

    Route::get('/peraturan', function () {
        return Inertia::render('PeraturanListPage');
    })->name('peraturan.index');

    Route::get('/peraturan/{id}', function (string $id) {
        return Inertia::render('PeraturanDetailPage', [
            'id' => $id,
        ]);
    })->name('peraturan.show');


    // ==========================================
    // DRAFT GENERATE SURAT
    // ==========================================

    Route::get('/draft-generate', function () {
        return Inertia::render('DraftGeneratePage');
    })->name('draft.generate');


    // ==========================================
    // HARMONITAS AI
    // ==========================================

    Route::get('/ai', function () {
        return Inertia::render('AIAssistantPage');
    })->name('ai');


    // ==========================================
    // API - GENERATE SURAT DOCX
    // ==========================================

    Route::match(['get', 'post'], '/api/generate-surat-docx', function (Request $request) {

        $type = strtolower(
            $request->input('type', 'perda')
        );

        $filename = $type === 'perda'
            ? 'SURAT SELESAI PERDA.docx'
            : 'SURAT SELESAI PERKADA.docx';

        $templatePath = base_path($filename);

        if (!file_exists($templatePath)) {
            return response()->json([
                'error' => 'Template file not found at ' . $templatePath,
            ], 404);
        }


        // ==========================================
        // INPUT DATA
        // ==========================================

        $nomorSurat = $request->input(
            'nomor_surat',
            '1489'
        );

        $tanggalSurat = $request->input(
            'tanggal_surat',
            date('d F Y')
        );

        $hal = $request->input(
            'hal',
            'Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi'
        );

        $jabatanPemrakarsa = $request->input(
            'jabatan_pemrakarsa',
            'Wali Kota Pekanbaru'
        );

        $ibukota = $request->input(
            'ibukota',
            'Pekanbaru'
        );

        $nomorSuratP = $request->input(
            'nomor_surat_p',
            '180/HK/2024/045'
        );

        $tanggalSuratP = $request->input(
            'tanggal_surat_p',
            '12 Juli 2024'
        );

        $jenisPeraturan = $request->input(
            'jenis_peraturan',
            $type === 'perda'
                ? 'Peraturan Daerah'
                : 'Peraturan Wali Kota'
        );

        $asalPemrakarsa = $request->input(
            'asal_pemrakarsa',
            'Kota Pekanbaru'
        );

        $judulPeraturan = $request->input(
            'judul_peraturan',
            'Pajak Daerah dan Retribusi Daerah'
        );


        // ==========================================
        // TEMPORARY DIRECTORY
        // ==========================================

        $tempDir = storage_path('app/temp');

        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }


        // ==========================================
        // CREATE TEMPORARY DOCX
        // ==========================================

        $tempFile =
            $tempDir
            . '/Surat_Selesai_'
            . strtoupper($type)
            . '_'
            . uniqid()
            . '.docx';

        if (!copy($templatePath, $tempFile)) {
            return response()->json([
                'error' => 'Gagal membuat file temporary DOCX.',
            ], 500);
        }


        // ==========================================
        // PROCESS DOCX
        // ==========================================

        $zip = new ZipArchive();

        if ($zip->open($tempFile) === true) {

            $xml = $zip->getFromName(
                'word/document.xml'
            );

            if ($xml === false) {

                $zip->close();

                if (file_exists($tempFile)) {
                    unlink($tempFile);
                }

                return response()->json([
                    'error' => 'File document.xml tidak ditemukan dalam template Word.',
                ], 500);
            }


            // ==========================================
            // FIELD MAPPING
            // ==========================================

            $fieldMap = [

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


            // ==========================================
            // REPLACE TEMPLATE FIELDS
            // ==========================================

            foreach ($fieldMap as $fieldName => $value) {

                $escaped = htmlspecialchars(
                    (string) $value,
                    ENT_XML1,
                    'UTF-8'
                );


                // 1. Replace simple fields

                $patternSimple =
                    '/<w:fldSimple\s+w:instr="[^"]*MERGEFIELD\s+'
                    . preg_quote($fieldName, '/')
                    . '\s*[^"]*">.*?<\/w:fldSimple>/s';

                $xml = preg_replace(
                    $patternSimple,
                    '<w:r><w:t>' . $escaped . '</w:t></w:r>',
                    $xml
                );


                // 2. Replace direct guillemets

                $xml = str_replace(
                    '«' . $fieldName . '»',
                    $escaped,
                    $xml
                );

                $xml = str_replace(
                    '&laquo;' . $fieldName . '&raquo;',
                    $escaped,
                    $xml
                );

                $xml = str_replace(
                    '&#171;' . $fieldName . '&#187;',
                    $escaped,
                    $xml
                );

                $xml = str_replace(
                    '&#xAB;' . $fieldName . '&#xBB;',
                    $escaped,
                    $xml
                );


                // 3. Fallback regex for spaced guillemets

                $patternGuillemets =
                    '/[«\x{00AB}]\s*'
                    . preg_quote($fieldName, '/')
                    . '\s*[»\x{00BB}]/u';

                $xml = preg_replace(
                    $patternGuillemets,
                    $escaped,
                    $xml
                );
            }


            // ==========================================
            // SAVE DOCX
            // ==========================================

            $zip->addFromString(
                'word/document.xml',
                $xml
            );

            $zip->close();


            // ==========================================
            // DOWNLOAD
            // ==========================================

            $downloadName =
                'Surat_Selesai_'
                . strtoupper($type)
                . '_'
                . preg_replace(
                    '/[^a-zA-Z0-9_-]/',
                    '_',
                    $nomorSurat
                )
                . '.docx';

            return response()
                ->download(
                    $tempFile,
                    $downloadName,
                    [
                        'Content-Type' =>
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

                        'Content-Disposition' =>
                            'attachment; filename="' . $downloadName . '"',
                    ]
                )
                ->deleteFileAfterSend(true);
        }


        // Gagal membuka ZIP/DOCX

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

    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:ADMIN')
        ->group(function () {

            Route::get(
                '/users',
                [AdminUserController::class, 'index']
            )->name('users.index');

            Route::post(
                '/users',
                [AdminUserController::class, 'store']
            )->name('users.store');

            Route::put(
                '/users/{user}',
                [AdminUserController::class, 'update']
            )->name('users.update');

            Route::delete(
                '/users/{user}',
                [AdminUserController::class, 'destroy']
            )->name('users.destroy');

            Route::post(
                '/users/{user}/toggle-status',
                [AdminUserController::class, 'toggleStatus']
            )->name('users.toggle-status');
        });
});