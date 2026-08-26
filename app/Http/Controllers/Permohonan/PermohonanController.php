<?php

namespace App\Http\Controllers\Permohonan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permohonan\StorePermohonanRequest;
use App\Http\Requests\Permohonan\UpdatePermohonanRequest;
use App\Http\Requests\Permohonan\UpdateStatusRequest;
use App\Http\Requests\Permohonan\UploadDokumenRequest;
use App\Models\AuditLog;
use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\JenisRegulasi;
use App\Models\Kabupaten;
use App\Models\RancanganRegulasi;
use App\Models\StatusRegulasi;
use App\Models\TimKerja;
use App\Models\User;
use App\Services\NotifikasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PermohonanController extends Controller
{
    /**
     * Tampilkan Daftar Permohonan Peraturan dengan Filter & RBAC Scoping
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $search = $request->query('search');
        $kabupatenFilter = $request->query('kabupaten_id');
        $jenisFilter = $request->query('jenis_regulasi_id');
        $statusFilter = $request->query('status_id');
        $timKerjaFilter = $request->query('tim_kerja_id');
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->query('per_page', 10);
        if ($perPage < 5 || $perPage > 100) {
            $perPage = 10;
        }

        $query = RancanganRegulasi::with([
            'jenisRegulasi',
            'kabupaten.timKerja',
            'timKerja',
            'statusRegulasi',
            'uploader',
            'dokumens.jenisDokumen',
        ]);

        // Sorting mapping
        $allowedSorts = [
            'nomor_regulasi' => 'nomor_regulasi',
            'judul_rancangan' => 'judul_rancangan',
            'jenis_regulasi_id' => 'jenis_regulasi_id',
            'status_id' => 'status_id',
            'tanggal_dibuat' => 'tanggal_dibuat',
            'created_at' => 'created_at',
        ];

        $sortColumn = $allowedSorts[$sortBy] ?? 'created_at';
        $query->orderBy($sortColumn, $sortDir);

        // RBAC Scoping: Jika role Tim Kerja, default batasi ke Tim Kerja mereka kecuali di-override
        if ($user && $user->isTimKerja() && $user->tim_kerja_id) {
            $query->where('tim_kerja_id', $user->tim_kerja_id);
        } elseif (! empty($timKerjaFilter) && $timKerjaFilter !== 'ALL') {
            $query->where('tim_kerja_id', $timKerjaFilter);
        }

        // Filter Pencarian (Judul / Nomor)
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('judul_rancangan', 'like', "%{$search}%")
                  ->orWhere('nomor_regulasi', 'like', "%{$search}%");
            });
        }

        // Filter Kabupaten
        if (! empty($kabupatenFilter) && $kabupatenFilter !== 'ALL') {
            $query->where('kabupaten_id', $kabupatenFilter);
        }

        // Filter Jenis (Ranperda / Ranperkada)
        if (! empty($jenisFilter) && $jenisFilter !== 'ALL') {
            $query->where('jenis_regulasi_id', $jenisFilter);
        }

        // Filter Status
        if (! empty($statusFilter) && $statusFilter !== 'ALL') {
            $query->where('status_id', $statusFilter);
        }

        $permohonans = $query->paginate($perPage)->withQueryString();

        // Master Data untuk Dropdown & Filter
        $allKabupatens = Kabupaten::with('timKerja')->orderBy('kabupaten_id')->get();
        
        // Kabupaten yang dapat dipilih saat Tambah Permohonan oleh user saat ini
        $availableKabupatens = ($user && $user->isTimKerja() && $user->tim_kerja_id)
            ? $allKabupatens->where('tim_kerja_id', $user->tim_kerja_id)->values()
            : $allKabupatens;

        $jenisRegulasis = JenisRegulasi::orderBy('jenis_regulasi_id')->get();
        $statuses = StatusRegulasi::orderBy('urutan')->get();
        $timKerjas = TimKerja::orderBy('tim_kerja_id')->get();

        // Ringkasan Statistik Berkas
        $baseStatQuery = RancanganRegulasi::query();
        if ($user && $user->isTimKerja() && $user->tim_kerja_id) {
            $baseStatQuery->where('tim_kerja_id', $user->tim_kerja_id);
        }

        $stats = [
            'total' => (clone $baseStatQuery)->count(),
            'draft' => (clone $baseStatQuery)->where('status_id', 1)->count(),
            'harmonisasi' => (clone $baseStatQuery)->where('status_id', 2)->count(),
            'fasilitasi' => (clone $baseStatQuery)->where('status_id', 3)->count(),
            'selesai' => (clone $baseStatQuery)->where('status_id', 4)->count(),
            'revisi' => (clone $baseStatQuery)->where('status_id', 5)->count(),
        ];

        return Inertia::render('PeraturanListPage', [
            'permohonans' => $permohonans,
            'stats' => $stats,
            'availableKabupatens' => $availableKabupatens,
            'allKabupatens' => $allKabupatens,
            'jenisRegulasis' => $jenisRegulasis,
            'statuses' => $statuses,
            'timKerjas' => $timKerjas,
            'filters' => [
                'search' => $search ?? '',
                'kabupaten_id' => $kabupatenFilter ?? 'ALL',
                'jenis_regulasi_id' => $jenisFilter ?? 'ALL',
                'status_id' => $statusFilter ?? 'ALL',
                'tim_kerja_id' => $timKerjaFilter ?? 'ALL',
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Simpan Permohonan Peraturan Baru & Upload Draf Awal
     */
    public function store(StorePermohonanRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = Auth::user();

        $kabupaten = Kabupaten::findOrFail($validated['kabupaten_id']);
        $timKerjaId = $kabupaten->tim_kerja_id ?? ($user->tim_kerja_id ?? 1);

        // Jika user adalah Tim Kerja, pastikan kabupaten yang dipilih sesuai dengan wilayahnya
        if ($user && $user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $timKerjaId !== (int) $user->tim_kerja_id) {
                abort(403, 'Akses Ditolak: Anda hanya dapat membuat permohonan untuk kabupaten dalam wilayah binaan Tim Kerja Anda.');
            }
        }

        // Buat nomor registrasi otomatis jika tidak diisi manual
        $nomorRegulasi = ! empty($validated['nomor_regulasi'])
            ? $validated['nomor_regulasi']
            : $this->generateNomorRegister($validated['jenis_regulasi_id']);

        DB::beginTransaction();
        try {
            $rancangan = RancanganRegulasi::create([
                'nomor_regulasi' => $nomorRegulasi,
                'judul_rancangan' => $validated['judul_rancangan'],
                'jenis_regulasi_id' => $validated['jenis_regulasi_id'],
                'kabupaten_id' => $validated['kabupaten_id'],
                'tim_kerja_id' => $timKerjaId,
                'pokja_id' => $user->user_id,
                'user_id' => $user->user_id,
                'status_id' => 1, // Status 1: Draf Awal
                'keterangan' => $validated['keterangan'] ?? 'Permohonan baru dimasukkan ke sistem HARMONITAS.',
                'tanggal_dibuat' => now()->toDateString(),
            ]);

            // Jika ada file draf awal yang diunggah
            if ($request->hasFile('initial_file')) {
                $file = $request->file('initial_file');
                $origName = $file->getClientOriginalName();
                $fileSize = $this->formatBytes($file->getSize());
                $ext = strtolower($file->getClientOriginalExtension());
                $mimeType = $this->guessMimeFromExt($ext);

                $cleanFileName = "draft_awal_" . time() . "_" . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $origName);
                
                // Simpan di direktori privat yang aman (bukan public)
                $targetDir = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
                if (! file_exists($targetDir)) {
                    mkdir($targetDir, 0755, true);
                }
                $file->move($targetDir, $cleanFileName);

                $storagePath = "secure_drafts/{$rancangan->rancangan_id}/{$cleanFileName}";

                Dokumen::create([
                    'rancangan_id' => $rancangan->rancangan_id,
                    'jenis_dokumen_id' => 1, // Slot 1: Draft Rancangan
                    'nama_file' => $origName,
                    'path_file' => $storagePath,
                    'ukuran_file' => $fileSize,
                    'mime_type' => $mimeType,
                    'versi' => 1,
                    'uploaded_by' => $user->user_id,
                    'uploaded_at' => now(),
                ]);
            }

            // Audit Log
            AuditLog::create([
                'user_id' => $user->user_id,
                'action' => 'CREATE_PERMOHONAN',
                'module' => 'PERMOHONAN_REGULASI',
                'target_id' => (string) $rancangan->rancangan_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => [
                    'nomor_regulasi' => $rancangan->nomor_regulasi,
                    'judul_rancangan' => $rancangan->judul_rancangan,
                    'kabupaten' => $kabupaten->nama_kabupaten,
                    'tim_kerja_id' => $timKerjaId,
                ],
                'created_at' => now(),
            ]);

            // Notifikasi ke Tim Kerja terkait
            if ($timKerjaId) {
                NotifikasiService::notifyTimKerja(
                    (int) $timKerjaId,
                    $rancangan,
                    'Permohonan Regulasi Baru',
                    "Permohonan baru '{$rancangan->judul_rancangan}' ({$kabupaten->nama_kabupaten}) berhasil didaftarkan ke wilayah kerja Anda."
                );
            }

            DB::commit();

            return redirect()->route('peraturan.index')->with(
                'success',
                "Permohonan '{$rancangan->judul_rancangan}' dengan Nomor {$rancangan->nomor_regulasi} berhasil didaftarkan!"
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', 'Gagal mendaftarkan permohonan: ' . $e->getMessage());
        }
    }

    /**
     * Tampilkan Detail Berkas Permohonan & 7 Slot Dokumen
     */
    public function show(Request $request, $id): Response
    {
        $user = Auth::user();

        $rancangan = RancanganRegulasi::with([
            'jenisRegulasi',
            'kabupaten.timKerja',
            'timKerja',
            'statusRegulasi',
            'uploader',
            'dokumens.jenisDokumen',
            'dokumens.uploader',
        ])->findOrFail($id);

        // RBAC Check for View Details (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $jenisDokumens = JenisDokumen::orderBy('urutan')->get();
        $statuses = StatusRegulasi::orderBy('urutan')->get();

        // Audit Logs riwayat untuk berkas ini
        $auditLogs = AuditLog::with('user')
            ->where('target_id', (string) $rancangan->rancangan_id)
            ->latest('created_at')
            ->get();

        return Inertia::render('PeraturanDetailPage', [
            'permohonan' => $rancangan,
            'jenisDokumens' => $jenisDokumens,
            'statuses' => $statuses,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Perbarui Data Umum Permohonan Peraturan
     */
    public function update(UpdatePermohonanRequest $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Update (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $validated = $request->validated();
        $kabupaten = Kabupaten::findOrFail($validated['kabupaten_id']);

        $rancangan->update([
            'judul_rancangan' => $validated['judul_rancangan'],
            'nomor_regulasi' => $validated['nomor_regulasi'] ?? $rancangan->nomor_regulasi,
            'jenis_regulasi_id' => $validated['jenis_regulasi_id'],
            'kabupaten_id' => $validated['kabupaten_id'],
            'tim_kerja_id' => $kabupaten->tim_kerja_id ?? $rancangan->tim_kerja_id,
            'status_id' => $validated['status_id'] ?? $rancangan->status_id,
            'keterangan' => $validated['keterangan'] ?? $rancangan->keterangan,
        ]);

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'UPDATE_PERMOHONAN',
            'module' => 'PERMOHONAN_REGULASI',
            'target_id' => (string) $rancangan->rancangan_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'nomor_regulasi' => $rancangan->nomor_regulasi,
                'judul' => $rancangan->judul_rancangan,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Data permohonan '{$rancangan->judul_rancangan}' berhasil diperbarui.");
    }

    /**
     * Hapus Permohonan Peraturan beserta File-filenya
     */
    public function destroy(Request $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::with('dokumens')->findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Delete (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $judul = $rancangan->judul_rancangan;
        $nomor = $rancangan->nomor_regulasi;

        DB::beginTransaction();
        try {
            // Hapus file fisik dari secure drafts & storage
            foreach ($rancangan->dokumens as $dok) {
                if ($dok->path_file) {
                    $resolved = $this->resolveSecureFilePath($dok);
                    if ($resolved && file_exists($resolved)) {
                        @unlink($resolved);
                    }
                }
            }

            // Hapus folder direktori jika ada
            $dirPath = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
            if (is_dir($dirPath)) {
                @rmdir($dirPath);
            }

            $rancangan->delete();

            AuditLog::create([
                'user_id' => $user->user_id,
                'action' => 'DELETE_PERMOHONAN',
                'module' => 'PERMOHONAN_REGULASI',
                'target_id' => (string) $id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => [
                    'nomor_regulasi' => $nomor,
                    'judul_rancangan' => $judul,
                ],
                'created_at' => now(),
            ]);

            DB::commit();

            return redirect()->route('peraturan.index')->with(
                'success',
                "Permohonan '{$judul}' ({$nomor}) berhasil dihapus dari sistem."
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus permohonan: ' . $e->getMessage());
        }
    }

    /**
     * Unggah / Ganti Dokumen pada Slot Dokumen 1-7 dengan Logika Alur Otomatis
     */
    public function uploadDokumen(UploadDokumenRequest $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Territory Scoping (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $validated = $request->validated();
        $slotId = (int) $validated['jenis_dokumen_id'];

        // RBAC upload permission check
        if (! $user->isAdmin()) {
            if ($slotId >= 1 && $slotId <= 5 && ! $user->isTimKerja()) {
                abort(403, 'Akses Ditolak: Hanya Tim Kerja Kanwil yang berwenang mengunggah dokumen slot 1-5.');
            }
            if (($slotId === 6 || $slotId === 7) && ! $user->isBiroHukum()) {
                abort(403, 'Akses Ditolak: Hanya Biro Hukum Setda Provinsi Riau yang berwenang mengunggah dokumen fasilitasi (slot 6-7).');
            }
        }

        // SYARAT KHUSUS BIRO HUKUM (SLOT 6 & 7):
        // Biro Hukum HANYA DAPAT mengunggah dokumen slot 6 dan 7 jika 5 dokumen Tahap Harmonisasi (Slot 1-5) SUDAH LENGKAP!
        if ($slotId === 6 || $slotId === 7) {
            $existingHarmonisasiSlots = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
                ->whereIn('jenis_dokumen_id', [1, 2, 3, 4, 5])
                ->pluck('jenis_dokumen_id')
                ->toArray();

            $missingSlots = array_diff([1, 2, 3, 4, 5], $existingHarmonisasiSlots);

            if (! empty($missingSlots)) {
                return back()->with(
                    'error',
                    'Akses Ditolak: Dokumen Tahap Fasilitasi (Slot 6 & 7) belum dapat diunggah karena berkas Tahap Harmonisasi (Slot 1 s.d. 5) belum lengkap diunggah oleh Tim Kerja Kanwil Kemenkumham Riau.'
                );
            }
        }

        $file = $request->file('file');
        $origName = $file->getClientOriginalName();
        $fileSize = $this->formatBytes($file->getSize());
        $ext = strtolower($file->getClientOriginalExtension());
        $mimeType = $this->guessMimeFromExt($ext);

        $existingDoc = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
            ->where('jenis_dokumen_id', $slotId)
            ->first();

        $version = $existingDoc ? ($existingDoc->versi + 1) : 1;

        $cleanFileName = "slot{$slotId}_v{$version}_" . time() . "_" . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $origName);
        $targetDir = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
        if (! file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        $file->move($targetDir, $cleanFileName);

        $storagePath = "secure_drafts/{$rancangan->rancangan_id}/{$cleanFileName}";

        if ($existingDoc) {
            // Hapus file lama jika ada
            if ($existingDoc->path_file) {
                $oldPath = $this->resolveSecureFilePath($existingDoc);
                if ($oldPath && file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $existingDoc->update([
                'nama_file' => $origName,
                'path_file' => $storagePath,
                'ukuran_file' => $fileSize,
                'mime_type' => $mimeType,
                'versi' => $version,
                'uploaded_by' => $user->user_id,
                'uploaded_at' => now(),
            ]);
        } else {
            Dokumen::create([
                'rancangan_id' => $rancangan->rancangan_id,
                'jenis_dokumen_id' => $slotId,
                'nama_file' => $origName,
                'path_file' => $storagePath,
                'ukuran_file' => $fileSize,
                'mime_type' => $mimeType,
                'versi' => 1,
                'uploaded_by' => $user->user_id,
                'uploaded_at' => now(),
            ]);
        }

        // =========================================================================
        // PERUBAHAN STATUS OTOMATIS BERBASIS KELENGKAPAN BERKAS (FILE-DRIVEN)
        // =========================================================================
        $allUploadedSlots = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
            ->pluck('jenis_dokumen_id')
            ->toArray();

        $isHarmonisasiComplete = empty(array_diff([1, 2, 3, 4, 5], $allUploadedSlots));
        $isFasilitasiComplete = empty(array_diff([1, 2, 3, 4, 5, 6, 7], $allUploadedSlots));

        if ($isFasilitasiComplete) {
            // Jika seluruh 7 slot dokumen lengkap -> Status beralih ke SELESAI (4)
            if ($rancangan->status_id !== 4) {
                $rancangan->update([
                    'status_id' => 4,
                    'keterangan' => 'Seluruh rangkaian dokumen harmonisasi dan fasilitasi (7 slot) telah lengkap dan disahkan tuntas.',
                ]);
            }
        } elseif ($isHarmonisasiComplete) {
            // Jika 5 slot dokumen harmonisasi lengkap -> Status beralih ke PROSES FASILITASI (3)
            if ($rancangan->status_id !== 3 && $rancangan->status_id !== 4) {
                $rancangan->update([
                    'status_id' => 3,
                    'keterangan' => 'Tahap Harmonisasi Kanwil selesai (5 dokumen lengkap). Berkas diteruskan ke Biro Hukum Pemprov Riau untuk Tahap Fasilitasi.',
                ]);

                // Notifikasi ke Biro Hukum bahwa berkas siap difasilitasi
                $kabName = $rancangan->kabupaten ? $rancangan->kabupaten->nama_kabupaten : 'Kabupaten/Kota';
                NotifikasiService::notifyBiroHukum(
                    $rancangan,
                    'Permohonan Siap Difasilitasi',
                    "Dokumen harmonisasi Kanwil untuk '{$rancangan->judul_rancangan}' ({$kabName}) telah lengkap 5 slot. Berkas siap untuk ditelaah dan difasilitasi oleh Biro Hukum."
                );
            }
        } else {
            // Jika Tim Kerja mengunggah kelanjutan pembahasan (Slot 2, 3, atau 4) saat status masih Draf Awal (1) -> Otomatis beralih ke PROSES HARMONISASI (2)
            if (in_array($slotId, [2, 3, 4]) && $rancangan->status_id === 1) {
                $rancangan->update([
                    'status_id' => 2,
                    'keterangan' => 'Dokumen pembahasan harmonisasi sedang dilengkapi dan diproses oleh Tim Kerja Kanwil Kemenkumham Riau.',
                ]);
            }
        }

        $jenisDoc = JenisDokumen::find($slotId);
        $namaDoc = $jenisDoc ? $jenisDoc->nama_dokumen : "Dokumen Slot #{$slotId}";

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'UPLOAD_DOKUMEN',
            'module' => 'PERMOHONAN_REGULASI',
            'target_id' => (string) $rancangan->rancangan_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'rancangan_id' => $rancangan->rancangan_id,
                'slot_id' => $slotId,
                'nama_dokumen' => $namaDoc,
                'file_name' => $origName,
                'versi' => $version,
                'current_status_id' => $rancangan->fresh()->status_id,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Berkas '{$namaDoc}' ({$origName}) berhasil diunggah (Versi {$version}).");
    }

    /**
     * Ubah Status Permohonan (Setujui / Tolak Revisi oleh Biro Hukum atau Tim Kerja beserta Surat Keputusan)
     */
    public function updateStatus(UpdateStatusRequest $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Status Change
        $this->authorizeRancanganAccess($rancangan, $user);

        $validated = $request->validated();
        $oldStatusId = $rancangan->status_id;
        $newStatusId = (int) $validated['status_id'];
        $catatan = $validated['catatan'] ?? null;

        $newStatus = StatusRegulasi::find($newStatusId);
        $statusName = $newStatus ? $newStatus->nama_status : "Status #{$newStatusId}";

        // Proses Unggah Surat Keputusan (Surat Penerimaan / Surat Penolakan)
        $suratDocName = null;
        if ($request->hasFile('surat_file')) {
            $file = $request->file('surat_file');
            $origName = $file->getClientOriginalName();
            $fileSize = $this->formatBytes($file->getSize());
            $ext = strtolower($file->getClientOriginalExtension());
            $mimeType = $this->guessMimeFromExt($ext);

            $existingSlot7 = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
                ->where('jenis_dokumen_id', 7)
                ->first();

            $version = $existingSlot7 ? ($existingSlot7->versi + 1) : 1;
            $prefix = $newStatusId === 4 ? 'surat_persetujuan_' : 'surat_penolakan_';
            $cleanFileName = "{$prefix}v{$version}_" . time() . "_" . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $origName);

            $targetDir = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
            if (! file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }
            $file->move($targetDir, $cleanFileName);

            $storagePath = "secure_drafts/{$rancangan->rancangan_id}/{$cleanFileName}";

            if ($existingSlot7) {
                if ($existingSlot7->path_file) {
                    $oldPath = $this->resolveSecureFilePath($existingSlot7);
                    if ($oldPath && file_exists($oldPath)) {
                        @unlink($oldPath);
                    }
                }

                $existingSlot7->update([
                    'nama_file' => $origName,
                    'path_file' => $storagePath,
                    'ukuran_file' => $fileSize,
                    'mime_type' => $mimeType,
                    'versi' => $version,
                    'uploaded_by' => $user->user_id,
                    'uploaded_at' => now(),
                ]);
            } else {
                Dokumen::create([
                    'rancangan_id' => $rancangan->rancangan_id,
                    'jenis_dokumen_id' => 7,
                    'nama_file' => $origName,
                    'path_file' => $storagePath,
                    'ukuran_file' => $fileSize,
                    'mime_type' => $mimeType,
                    'versi' => 1,
                    'uploaded_by' => $user->user_id,
                    'uploaded_at' => now(),
                ]);
            }

            $suratDocName = $origName;
        }

        $rancangan->update([
            'status_id' => $newStatusId,
            'keterangan' => $catatan ?: $rancangan->keterangan,
        ]);

        $actionName = match ($newStatusId) {
            4 => 'APPROVE_FASILITASI',
            5 => 'REJECT_FASILITASI',
            default => 'CHANGE_PERATURAN_STATUS',
        };

        // Notifikasi ke Tim Kerja terkait & Pimpinan saat Biro Hukum mengambil keputusan
        if ($newStatusId === 4) {
            if ($rancangan->tim_kerja_id) {
                NotifikasiService::notifyTimKerja(
                    (int) $rancangan->tim_kerja_id,
                    $rancangan,
                    'Fasilitasi Disetujui & Selesai',
                    "Biro Hukum Provinsi Riau telah menyetujui fasilitasi untuk '{$rancangan->judul_rancangan}'" . ($suratDocName ? " dengan lampiran surat: '{$suratDocName}'." : ".")
                );
            }

            // Notifikasi Milestone Selesai ke Pimpinan (Kakanwil & Kadiv)
            $kabName = $rancangan->kabupaten ? $rancangan->kabupaten->nama_kabupaten : 'Kabupaten/Kota';
            NotifikasiService::notifyPimpinan(
                $rancangan,
                'Produk Hukum Daerah Selesai & Sah',
                "Harmonisasi & fasilitasi '{$rancangan->judul_rancangan}' ({$kabName}) telah disetujui tuntas oleh Biro Hukum Provinsi Riau."
            );
        } elseif ($newStatusId === 5 && $rancangan->tim_kerja_id) {
            NotifikasiService::notifyTimKerja(
                (int) $rancangan->tim_kerja_id,
                $rancangan,
                'Permohonan Memerlukan Perbaikan',
                "Biro Hukum Provinsi Riau mengembalikan berkas '{$rancangan->judul_rancangan}'. Catatan: " . ($catatan ?: 'Harap periksa dan perbaiki draf regulasi.')
            );
        }

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => $actionName,
            'module' => 'PERMOHONAN_REGULASI',
            'target_id' => (string) $rancangan->rancangan_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'from_status_id' => $oldStatusId,
                'to_status_id' => $newStatusId,
                'to_status_name' => $statusName,
                'catatan' => $catatan,
                'surat_terlampir' => $suratDocName,
            ],
            'created_at' => now(),
        ]);

        $pesanSukses = match ($newStatusId) {
            4 => "Permohonan berhasil disetujui tuntas (Status: Selesai)" . ($suratDocName ? " dengan lampiran Surat: '{$suratDocName}'." : "."),
            5 => "Permohonan dikembalikan ke Tim Kerja Kanwil (Status: Perlu Perbaikan)" . ($suratDocName ? " dengan lampiran Surat Penolakan: '{$suratDocName}'." : "."),
            default => "Status permohonan berhasil diubah menjadi: {$statusName}.",
        };

        return back()->with('success', $pesanSukses);
    }

    /**
     * Tampilkan Dokumen Langsung di Web (Inline Secure Preview)
     */
    public function viewDokumen($dokumenId)
    {
        $dokumen = Dokumen::with('rancanganRegulasi')->findOrFail($dokumenId);
        $user = Auth::user();

        $this->authorizeDocumentAccess($dokumen, $user);

        $fullPath = $this->resolveSecureFilePath($dokumen);
        if (! $fullPath || ! file_exists($fullPath)) {
            $namaFile = htmlspecialchars($dokumen->nama_file ?? 'Dokumen', ENT_QUOTES, 'UTF-8');
            $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Berkas Fisik Belum Tersedia - HARMONITAS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #F8FAFC;
            color: #1E293B;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
        }
        .card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 24px;
            padding: 40px 32px;
            max-width: 460px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 30px -5px rgba(43, 48, 86, 0.07);
        }
        .icon-box {
            width: 64px;
            height: 64px;
            border-radius: 20px;
            background: #EFF6FF;
            color: #2B3056;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin: 0 auto 18px;
            border: 1px solid #DBEAFE;
        }
        h2 {
            font-size: 18px;
            font-weight: 800;
            color: #2B3056;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }
        p {
            font-size: 13px;
            color: #64748B;
            line-height: 1.6;
            margin-bottom: 18px;
        }
        .file-box {
            background: #F1F5F9;
            border: 1px solid #CBD5E1;
            padding: 10px 16px;
            border-radius: 12px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            font-weight: 600;
            color: #334155;
            display: inline-block;
            margin-bottom: 20px;
            word-break: break-all;
        }
        .footer-note {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
            background: #FEF3C7;
            color: #92400E;
            border: 1px solid #FDE68A;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-box">📁</div>
        <h2>Berkas Fisik Belum Tersedia</h2>
        <p>File fisik untuk dokumen ini belum diunggah ke penyimpanan server atau telah dipindahkan.</p>
        <div class="file-box">{$namaFile}</div>
        <div>
            <span class="footer-note">Silakan unggah dokumen fisik melalui menu Unggah Dokumen</span>
        </div>
    </div>
</body>
</html>
HTML;
            return response($html, 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
                'X-Frame-Options' => 'SAMEORIGIN',
            ]);
        }

        // Catat jejak audit akses berkas rahasia
        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'PREVIEW_CONFIDENTIAL_DOKUMEN',
            'module' => 'DOKUMEN_REGULASI',
            'target_id' => (string) $dokumen->dokumen_id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'payload' => [
                'nama_file' => $dokumen->nama_file,
                'rancangan_id' => $dokumen->rancangan_id,
                'nomor_regulasi' => $dokumen->rancanganRegulasi?->nomor_regulasi,
            ],
            'created_at' => now(),
        ]);

        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mimeType = $this->guessMimeFromExt($ext);

        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $dokumen->nama_file . '"',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'SAMEORIGIN',
            'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
        ]);
    }

    /**
     * Unduh Berkas Dokumen secara Aman (Protected Download)
     */
    public function downloadDokumen($dokumenId): BinaryFileResponse|RedirectResponse
    {
        $dokumen = Dokumen::with('rancanganRegulasi')->findOrFail($dokumenId);
        $user = Auth::user();

        $this->authorizeDocumentAccess($dokumen, $user);

        $fullPath = $this->resolveSecureFilePath($dokumen);
        if (! $fullPath || ! file_exists($fullPath)) {
            return back()->with('error', "Berkas fisik '{$dokumen->nama_file}' tidak ditemukan di server.");
        }

        // Catat jejak audit pengunduhan
        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'DOWNLOAD_CONFIDENTIAL_DOKUMEN',
            'module' => 'DOKUMEN_REGULASI',
            'target_id' => (string) $dokumen->dokumen_id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'payload' => [
                'nama_file' => $dokumen->nama_file,
                'rancangan_id' => $dokumen->rancangan_id,
                'nomor_regulasi' => $dokumen->rancanganRegulasi?->nomor_regulasi,
            ],
            'created_at' => now(),
        ]);

        return response()->download($fullPath, $dokumen->nama_file, [
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store, must-revalidate',
        ]);
    }

    /**
     * Validasi Hak Akses Rancangan Regulasi (RBAC & IDOR Defense)
     */
    private function authorizeRancanganAccess(RancanganRegulasi $rancangan, ?User $user): void
    {
        if (! $user) {
            abort(401, 'Silakan login terlebih dahulu untuk mengakses berkas ini.');
        }

        // Admin, Biro Hukum, dan Pimpinan dapat mengakses seluruh berkas regulasi daerah se-Riau
        if ($user->isAdmin() || $user->isBiroHukum() || $user->isPimpinan()) {
            return;
        }

        // Jika Tim Kerja, batasi hanya pada wilayah binaannya
        if ($user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $rancangan->tim_kerja_id === (int) $user->tim_kerja_id) {
                return;
            }
        }

        abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka atau mengubah berkas di luar wilayah binaan Tim Kerja Anda.');
    }

    /**
     * Validasi Hak Akses Dokumen Rahasia (RBAC Scoping)
     */
    private function authorizeDocumentAccess(Dokumen $dokumen, ?User $user): void
    {
        if (! $user) {
            abort(401, 'Silakan login terlebih dahulu untuk mengakses dokumen ini.');
        }

        // Admin, Biro Hukum, dan Pimpinan dapat mengakses seluruh dokumen regulasi
        if ($user->isAdmin() || $user->isBiroHukum() || $user->isPimpinan()) {
            return;
        }

        // Jika Tim Kerja, harus sesuai dengan wilayah binaan Tim Kerja miliknya
        $rancangan = $dokumen->rancanganRegulasi;
        if ($rancangan && $user->isTimKerja() && $user->tim_kerja_id) {
            if ((int) $rancangan->tim_kerja_id === (int) $user->tim_kerja_id) {
                return;
            }
        }

        abort(403, 'Akses Ditolak: Dokumen ini bersifat RAHASIA dan berada di luar wewenang wilayah binaan Tim Kerja Anda.');
    }

    /**
     * Resolusi File Fisik di Direktori Aman
     */
    private function resolveSecureFilePath(Dokumen $dokumen): ?string
    {
        if (! $dokumen->path_file) {
            return null;
        }

        $candidates = [
            storage_path('app/' . $dokumen->path_file),
            storage_path('app/secure_drafts/' . $dokumen->path_file),
            storage_path('app/secure_drafts/' . basename($dokumen->path_file)),
            storage_path('app/public/' . $dokumen->path_file),
            storage_path('app/secure_drafts/sample_draft.pdf'),
        ];

        foreach ($candidates as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return null;
    }

    /**
     * Helper Pemetaan Ekstensi ke MIME Type Aman (Tanpa finfo)
     */
    private function guessMimeFromExt(string $ext): string
    {
        return match ($ext) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream',
        };
    }

    /**
     * Generator Nomor Registrasi Otomatis (Format: 01/RANPERDA/2026 atau 01/RANPERKADA/2026)
     */
    private function generateNomorRegister(int $jenisRegulasiId): string
    {
        $year = date('Y');
        $prefix = $jenisRegulasiId === 1 ? 'RANPERDA' : 'RANPERKADA';
        $count = RancanganRegulasi::where('jenis_regulasi_id', $jenisRegulasiId)
            ->whereYear('created_at', $year)
            ->count() + 1;

        $padded = str_pad($count, 2, '0', STR_PAD_LEFT);

        return "{$padded}/{$prefix}/{$year}";
    }

    /**
     * Format Bytes ke string manusiawi (KB/MB)
     */
    private function formatBytes(int $bytes, int $precision = 1): string
    {
        if ($bytes <= 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB'];
        $power = floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);
        return round($bytes / pow(1024, $power), $precision) . ' ' . $units[$power];
    }
}
