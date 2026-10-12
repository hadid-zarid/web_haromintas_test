<?php

namespace App\Http\Controllers\Permohonan;

use App\Http\Controllers\Concerns\AuthorizesRancanganAccess;
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
use App\Services\PermohonanWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PermohonanController extends Controller
{
    use AuthorizesRancanganAccess;

    private const MODUL_AUDIT = 'PERMOHONAN_REGULASI';

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
            'uploader:user_id,nama,role_id',
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

        // RBAC Scoping: Biro Hukum hanya melihat berkas dari kabupaten wilayah kerjanya (+ Pemprov Riau)
        $isBiroHukum = $user && $user->isBiroHukum();
        $wilayahBiroId = $user?->wilayahBiroHukumId();
        if ($isBiroHukum) {
            $query->dalamCakupanBiroHukum($wilayahBiroId);
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
        
        // Kabupaten yang dapat dipilih (tambah permohonan & filter) oleh user saat ini
        if ($user && $user->isTimKerja() && $user->tim_kerja_id) {
            $availableKabupatens = $allKabupatens->where('tim_kerja_id', $user->tim_kerja_id)->values();
        } elseif ($isBiroHukum) {
            $availableKabupatens = $allKabupatens
                ->filter(fn ($k) => $k->wilayah_biro_hukum_id === null || $k->wilayah_biro_hukum_id === $wilayahBiroId)
                ->values();
        } else {
            $availableKabupatens = $allKabupatens;
        }

        $jenisRegulasis = JenisRegulasi::orderBy('jenis_regulasi_id')->get();
        $statuses = StatusRegulasi::orderBy('urutan')->get();
        $timKerjas = TimKerja::orderBy('tim_kerja_id')->get();

        // Ringkasan Statistik Berkas
        $baseStatQuery = RancanganRegulasi::query();
        if ($user && $user->isTimKerja() && $user->tim_kerja_id) {
            $baseStatQuery->where('tim_kerja_id', $user->tim_kerja_id);
        } elseif ($isBiroHukum) {
            $baseStatQuery->dalamCakupanBiroHukum($wilayahBiroId);
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
                    'jenis_dokumen_id' => 1, // Dokumen 1: Draft Rancangan
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
                    'Permohonan Harmonisasi Baru',
                    "Permohonan harmonisasi baru '{$rancangan->judul_rancangan}' ({$kabupaten->nama_kabupaten}) berhasil didaftarkan ke wilayah kerja Anda."
                );
            }

            DB::commit();

            return redirect()->route('peraturan.index')->with(
                'success',
                "Permohonan '{$rancangan->judul_rancangan}' dengan Nomor {$rancangan->nomor_regulasi} berhasil didaftarkan!"
            );
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Gagal mendaftarkan permohonan: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withInput()->with('error', 'Gagal mendaftarkan permohonan. Silakan coba beberapa saat lagi.');
        }
    }

    /**
     * Tampilkan Detail Berkas Permohonan & 7 Dokumen
     */
    public function show(Request $request, $id): Response
    {
        $user = Auth::user();

        $rancangan = RancanganRegulasi::with([
            'jenisRegulasi',
            'kabupaten.timKerja',
            'timKerja',
            'statusRegulasi',
            'uploader:user_id,nama,role_id',
            'dokumens.jenisDokumen',
            'dokumens.uploader:user_id,nama,role_id',
            'suratPenolakan',
        ])->findOrFail($id);

        // RBAC Check for View Details (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $jenisDokumens = JenisDokumen::where('jenis_dokumen_id', '!=', JenisDokumen::SURAT_PENOLAKAN)
            ->orderBy('urutan')
            ->get();
        $statuses = StatusRegulasi::orderBy('urutan')->get();

        // Audit Logs riwayat untuk berkas ini. Wajib difilter per modul: target_id modul lain
        // (id user, id dokumen, tahun rekap) bisa kebetulan sama dengan id berkas.
        $auditLogs = AuditLog::with('user:user_id,nama,role_id')
            ->where('module', self::MODUL_AUDIT)
            ->where('target_id', (string) $rancangan->rancangan_id)
            ->latest('created_at')
            ->latest('id')
            ->get();

        // Rincian penolakan untuk banner "Perlu Perbaikan". Alasan diambil dari log penolakan,
        // bukan dari keterangan berkas yang bisa tertimpa saat data diedit.
        $penolakan = null;
        if ((int) $rancangan->status_id === 5) {
            $logPenolakan = $auditLogs->firstWhere('action', 'REJECT_FASILITASI');
            $penolakan = [
                'oleh' => $logPenolakan?->user?->nama,
                'waktu' => $logPenolakan?->created_at,
                'catatan' => $logPenolakan?->payload['catatan'] ?? $rancangan->keterangan,
                'surat' => $rancangan->suratPenolakan?->only(['dokumen_id', 'nama_file', 'ukuran_file', 'versi']),
                'bisa_kirim' => $this->adaPerbaikanSetelahDitolak($rancangan, $logPenolakan),
            ];
        }

        return Inertia::render('PeraturanDetailPage', [
            'permohonan' => $rancangan->unsetRelation('suratPenolakan'),
            'jenisDokumens' => $jenisDokumens,
            'statuses' => $statuses,
            'auditLogs' => $auditLogs,
            'penolakan' => $penolakan,
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

        // Biro Hukum tidak boleh memindahkan berkas ke kabupaten di luar wilayah kerjanya
        $wilayahBiroId = $user->wilayahBiroHukumId();
        if ($user->isBiroHukum() && $kabupaten->wilayah_biro_hukum_id !== null && $kabupaten->wilayah_biro_hukum_id !== $wilayahBiroId) {
            abort(403, 'Akses Ditolak: Anda hanya dapat memilih kabupaten dalam wilayah kerja Biro Hukum Anda.');
        }

        $payloadUpdate = [
            'judul_rancangan' => $validated['judul_rancangan'],
            'nomor_regulasi' => $validated['nomor_regulasi'] ?? $rancangan->nomor_regulasi,
            'jenis_regulasi_id' => $validated['jenis_regulasi_id'],
            'kabupaten_id' => $validated['kabupaten_id'],
            'tim_kerja_id' => $kabupaten->tim_kerja_id ?? $rancangan->tim_kerja_id,
            'keterangan' => $validated['keterangan'] ?? $rancangan->keterangan,
        ];

        // Perubahan status via form edit hanya diizinkan untuk Biro Hukum & Admin.
        // Tim Kerja mengubah status lewat alur otomatis kelengkapan dokumen, bukan manual.
        if (($validated['status_id'] ?? null) !== null && ($user->isBiroHukum() || $user->isAdmin())) {
            $payloadUpdate['status_id'] = (int) $validated['status_id'];
        }

        $rancangan->update($payloadUpdate);

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
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Delete (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $judul = $rancangan->judul_rancangan;
        $nomor = $rancangan->nomor_regulasi;

        DB::beginTransaction();
        try {
            // Hapus file fisik dari secure drafts & storage (termasuk surat penolakan)
            foreach (Dokumen::where('rancangan_id', $rancangan->rancangan_id)->get() as $dok) {
                $this->hapusFileFisik($dok);
            }

            // Hapus folder direktori jika ada
            $dirPath = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
            if (is_dir($dirPath)) {
                @rmdir($dirPath);
            }

            $rancangan->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Gagal menghapus permohonan: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Gagal menghapus permohonan. Silakan coba beberapa saat lagi.');
        }

        // Catat audit log DI LUAR transaksi agar selalu tersimpan setelah penghapusan berhasil
        try {
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
                    'keterangan' => "Berkas permohonan '{$judul}' ({$nomor}) telah dihapus dari sistem.",
                ],
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Gagal menyimpan audit log hapus permohonan: ' . $e->getMessage());
        }

        return redirect()->route('peraturan.index')->with(
            'success',
            "Permohonan '{$judul}' ({$nomor}) berhasil dihapus dari sistem."
        );
    }

    /**
     * Unggah / Ganti Dokumen pada Dokumen 1-7 dengan Logika Alur Otomatis
     */
    public function uploadDokumen(UploadDokumenRequest $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Territory Scoping (IDOR Defense)
        $this->authorizeRancanganAccess($rancangan, $user);

        $validated = $request->validated();
        $jenisDokumenId = (int) $validated['jenis_dokumen_id'];

        // RBAC upload permission check
        if (! $user->isAdmin()) {
            if ($jenisDokumenId >= 1 && $jenisDokumenId <= 5 && ! $user->isTimKerja()) {
                abort(403, 'Akses Ditolak: Hanya Tim Kerja Kanwil yang berwenang mengunggah Dokumen 1-5.');
            }
            if (($jenisDokumenId === 6 || $jenisDokumenId === 7) && ! $user->isBiroHukum()) {
                abort(403, 'Akses Ditolak: Hanya Biro Hukum Setda Provinsi Riau yang berwenang mengunggah dokumen fasilitasi (Dokumen 6-7).');
            }
        }

        // SYARAT KHUSUS BIRO HUKUM (DOKUMEN 6 & 7):
        // Biro Hukum HANYA DAPAT mengunggah dokumen 6 dan 7 jika 5 dokumen Tahap Harmonisasi (Dokumen 1-5) SUDAH LENGKAP!
        if ($jenisDokumenId === 6 || $jenisDokumenId === 7) {
            $existingHarmonisasiDocs = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
                ->whereIn('jenis_dokumen_id', [1, 2, 3, 4, 5])
                ->pluck('jenis_dokumen_id')
                ->toArray();

            $missingDocs = array_diff([1, 2, 3, 4, 5], $existingHarmonisasiDocs);

            if (! empty($missingDocs)) {
                return back()->with(
                    'error',
                    'Akses Ditolak: Dokumen Tahap Fasilitasi (Dokumen 6 & 7) belum dapat diunggah karena berkas Tahap Harmonisasi (Dokumen 1 s.d. 5) belum lengkap diunggah oleh Tim Kerja Kanwil Kemenkum Riau.'
                );
            }
        }

        $file = $request->file('file');
        $dokumen = $this->simpanBerkasDokumen($rancangan, $jenisDokumenId, $file, $user, "dokumen{$jenisDokumenId}_");

        $statusLama = (int) $rancangan->status_id;
        $isHarmonisasiComplete = PermohonanWorkflowService::isHarmonisasiComplete($this->idDokumenTerunggah($rancangan));

        // Tonggak Harmonisasi Selesai: catat waktu penyelesaian satu kali dan auditabel
        if ($isHarmonisasiComplete && ! $rancangan->harmonisasi_completed_at) {
            $rancangan->update([
                'harmonisasi_completed_at' => now(),
            ]);
        }

        $jenisDoc = JenisDokumen::find($jenisDokumenId);
        $namaDoc = $jenisDoc ? $jenisDoc->nama_dokumen : "Dokumen #{$jenisDokumenId}";

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'UPLOAD_DOKUMEN',
            'module' => self::MODUL_AUDIT,
            'target_id' => (string) $rancangan->rancangan_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'rancangan_id' => $rancangan->rancangan_id,
                'jenis_dokumen_id' => $jenisDokumenId,
                'nama_dokumen' => $namaDoc,
                'file_name' => $dokumen->nama_file,
                'versi' => $dokumen->versi,
            ],
            'created_at' => now(),
        ]);

        // =========================================================================
        // PERUBAHAN STATUS OTOMATIS BERBASIS KELENGKAPAN BERKAS (FILE-DRIVEN)
        // Status Selesai hanya lahir dari Dokumen 7 (wewenang Biro Hukum/Admin). Saat berkas
        // Perlu Perbaikan (5), unggahan Tim Kerja tidak mengubah status: perbaikan dikirim
        // secara eksplisit lewat kirimPerbaikan().
        // =========================================================================
        if ($jenisDokumenId === 7) {
            // Dokumen 1-5 sudah dijamin lengkap oleh syarat di atas; Dokumen 6 opsional.
            if ($statusLama !== 4) {
                $this->selesaikanFasilitasi($request, $rancangan, null, $dokumen->nama_file);
            }
        } elseif ($isHarmonisasiComplete && in_array($statusLama, [1, 2], true)) {
            // 5 dokumen harmonisasi lengkap -> Status beralih ke PROSES FASILITASI (3)
            $rancangan->update([
                'status_id' => 3,
                'keterangan' => 'Tahap Harmonisasi Kanwil selesai (5 dokumen lengkap). Berkas diteruskan ke Biro Hukum Pemprov Riau untuk Tahap Fasilitasi.',
            ]);

            $kabName = $rancangan->kabupaten ? $rancangan->kabupaten->nama_kabupaten : 'Kabupaten/Kota';
            NotifikasiService::notifyBiroHukum(
                $rancangan,
                'Permohonan Siap Difasilitasi',
                "Dokumen harmonisasi Kanwil untuk '{$rancangan->judul_rancangan}' ({$kabName}) telah lengkap 5 dokumen. Berkas siap untuk ditelaah dan difasilitasi oleh Biro Hukum."
            );
        } elseif (in_array($jenisDokumenId, [2, 3, 4], true) && $statusLama === 1) {
            // Tim Kerja mengunggah kelanjutan pembahasan saat masih Draf Awal (1) -> PROSES HARMONISASI (2)
            $rancangan->update([
                'status_id' => 2,
                'keterangan' => 'Dokumen pembahasan harmonisasi sedang dilengkapi dan diproses oleh Tim Kerja Kanwil Kemenkum Riau.',
            ]);
        }

        return back()->with('success', "Berkas '{$namaDoc}' ({$dokumen->nama_file}) berhasil diunggah (Versi {$dokumen->versi}).");
    }

    /**
     * Keputusan Hasil Fasilitasi oleh Biro Hukum / Admin: Terima (Selesai) atau Tolak (Perlu Perbaikan)
     */
    public function updateStatus(UpdateStatusRequest $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        // RBAC Check for Status Change (IDOR / wilayah)
        $this->authorizeRancanganAccess($rancangan, $user);

        // Keputusan hasil fasilitasi (Selesai / Perlu Perbaikan) adalah wewenang
        // Biro Hukum Provinsi Riau & Admin. Tim Kerja hanya menggerakkan status
        // lewat alur otomatis kelengkapan dokumen (lihat uploadDokumen()).
        if (! ($user->isBiroHukum() || $user->isAdmin())) {
            abort(403, 'Akses Ditolak: Hanya Biro Hukum Provinsi Riau yang berwenang memutuskan hasil fasilitasi berkas ini.');
        }

        $validated = $request->validated();
        $newStatusId = (int) $validated['status_id'];
        $catatan = $validated['catatan'] ?? null;
        $statusLama = (int) $rancangan->status_id;
        $idDokumen = $this->idDokumenTerunggah($rancangan);

        if ($statusLama === 4 || ! PermohonanWorkflowService::isHarmonisasiComplete($idDokumen)) {
            return back()->with(
                'error',
                'Keputusan fasilitasi hanya dapat diambil untuk berkas yang Dokumen 1 s.d. 5-nya lengkap dan belum berstatus Selesai.'
            );
        }

        $surat = $request->file('surat_file');

        if ($newStatusId === 4) {
            // Berkas Selesai harus selalu memiliki Surat Hasil Fasilitasi (Dokumen 7)
            if (! $surat && ! in_array(7, $idDokumen, true)) {
                return back()->withErrors([
                    'surat_file' => 'Surat Hasil Fasilitasi wajib dilampirkan untuk menyelesaikan berkas.',
                ]);
            }

            $suratDocName = $surat
                ? $this->simpanBerkasDokumen($rancangan, 7, $surat, $user, 'surat_persetujuan_')->nama_file
                : null;

            $this->selesaikanFasilitasi($request, $rancangan, $catatan, $suratDocName);

            return back()->with(
                'success',
                'Permohonan berhasil disetujui tuntas (Status: Selesai)' . ($suratDocName ? " dengan lampiran Surat: '{$suratDocName}'." : '.')
            );
        }

        // Tolak: surat penolakan punya slot sendiri, tidak boleh menempati Dokumen 7.
        // Slot itu selalu berisi surat dari penolakan terakhir saja.
        $suratDocName = null;
        if ($surat) {
            $suratDocName = $this->simpanBerkasDokumen(
                $rancangan,
                JenisDokumen::SURAT_PENOLAKAN,
                $surat,
                $user,
                'surat_penolakan_'
            )->nama_file;
        } elseif ($suratLama = $rancangan->suratPenolakan) {
            $this->hapusFileFisik($suratLama);
            $suratLama->delete();
        }

        $rancangan->update([
            'status_id' => 5,
            'keterangan' => $catatan,
        ]);

        if ($rancangan->tim_kerja_id) {
            NotifikasiService::notifyTimKerja(
                (int) $rancangan->tim_kerja_id,
                $rancangan,
                'Permohonan Memerlukan Perbaikan',
                "Biro Hukum Provinsi Riau mengembalikan berkas '{$rancangan->judul_rancangan}'. Catatan: {$catatan}"
            );
        }

        $this->catatAudit($request, $rancangan, 'REJECT_FASILITASI', [
            'from_status_id' => $statusLama,
            'to_status_id' => 5,
            'to_status_name' => 'Perlu Perbaikan',
            'catatan' => $catatan,
            'surat_terlampir' => $suratDocName,
        ]);

        return back()->with(
            'success',
            'Permohonan dikembalikan ke Tim Kerja Kanwil (Status: Perlu Perbaikan)' . ($suratDocName ? " dengan lampiran Surat Penolakan: '{$suratDocName}'." : '.')
        );
    }

    /**
     * Tim Kerja mengirim hasil perbaikan berkas yang ditolak kembali ke Biro Hukum
     */
    public function kirimPerbaikan(Request $request, $id): RedirectResponse
    {
        $rancangan = RancanganRegulasi::findOrFail($id);
        $user = Auth::user();

        $this->authorizeRancanganAccess($rancangan, $user);

        if (! ($user->isTimKerja() || $user->isAdmin())) {
            abort(403, 'Akses Ditolak: Hanya Tim Kerja Kanwil yang berwenang mengirim perbaikan berkas.');
        }

        if ((int) $rancangan->status_id !== 5) {
            return back()->with('error', 'Berkas ini tidak sedang berstatus Perlu Perbaikan.');
        }

        if (! $this->adaPerbaikanSetelahDitolak($rancangan, $this->penolakanTerakhir($rancangan))) {
            return back()->with('error', 'Unggah dulu dokumen yang diperbaiki sebelum mengirim perbaikan ke Biro Hukum.');
        }

        $rancangan->update([
            'status_id' => 3,
            'keterangan' => 'Perbaikan berkas telah dikirim Tim Kerja Kanwil. Menunggu telaah ulang Biro Hukum.',
        ]);

        $kabName = $rancangan->kabupaten ? $rancangan->kabupaten->nama_kabupaten : 'Kabupaten/Kota';
        NotifikasiService::notifyBiroHukum(
            $rancangan,
            'Perbaikan Berkas Telah Dikirim',
            "Tim Kerja Kanwil telah memperbaiki berkas '{$rancangan->judul_rancangan}' ({$kabName}) yang sebelumnya dikembalikan. Berkas siap ditelaah ulang oleh Biro Hukum."
        );

        $this->catatAudit($request, $rancangan, 'SUBMIT_PERBAIKAN', [
            'from_status_id' => 5,
            'to_status_id' => 3,
            'to_status_name' => 'Proses Fasilitasi',
        ]);

        return back()->with('success', 'Perbaikan berkas berhasil dikirim ke Biro Hukum untuk ditelaah ulang.');
    }

    /**
     * Satu-satunya jalur menuju status Selesai: ubah status, kabari Tim Kerja & Pimpinan, catat audit.
     */
    private function selesaikanFasilitasi(Request $request, RancanganRegulasi $rancangan, ?string $catatan, ?string $namaSurat): void
    {
        $statusLama = (int) $rancangan->status_id;

        $rancangan->update([
            'status_id' => 4,
            'keterangan' => $catatan ?: 'Seluruh dokumen wajib harmonisasi dan Surat Hasil Fasilitasi telah lengkap dan disahkan tuntas.',
        ]);

        if ($rancangan->tim_kerja_id) {
            NotifikasiService::notifyTimKerja(
                (int) $rancangan->tim_kerja_id,
                $rancangan,
                'Fasilitasi Disetujui & Selesai',
                "Biro Hukum Provinsi Riau telah menyetujui fasilitasi untuk '{$rancangan->judul_rancangan}'" . ($namaSurat ? " dengan lampiran surat: '{$namaSurat}'." : '.')
            );
        }

        // Notifikasi Milestone Selesai ke Pimpinan (Kakanwil & Kadiv)
        $kabName = $rancangan->kabupaten ? $rancangan->kabupaten->nama_kabupaten : 'Kabupaten/Kota';
        NotifikasiService::notifyPimpinan(
            $rancangan,
            'Produk Hukum Daerah Selesai',
            "Harmonisasi & fasilitasi '{$rancangan->judul_rancangan}' ({$kabName}) telah disetujui tuntas oleh Biro Hukum Provinsi Riau."
        );

        $this->catatAudit($request, $rancangan, 'APPROVE_FASILITASI', [
            'from_status_id' => $statusLama,
            'to_status_id' => 4,
            'to_status_name' => 'Selesai',
            'catatan' => $catatan,
            'surat_terlampir' => $namaSurat,
        ]);
    }

    /**
     * Simpan (atau ganti) berkas pada satu slot dokumen di direktori privat, lalu naikkan versinya.
     */
    private function simpanBerkasDokumen(
        RancanganRegulasi $rancangan,
        int $jenisDokumenId,
        UploadedFile $file,
        User $user,
        string $awalanNama
    ): Dokumen {
        $origName = $file->getClientOriginalName();
        $fileSize = $this->formatBytes($file->getSize());
        $mimeType = $this->guessMimeFromExt(strtolower($file->getClientOriginalExtension()));

        $existingDoc = Dokumen::where('rancangan_id', $rancangan->rancangan_id)
            ->where('jenis_dokumen_id', $jenisDokumenId)
            ->first();

        $version = $existingDoc ? ($existingDoc->versi + 1) : 1;

        $cleanFileName = "{$awalanNama}v{$version}_" . time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $origName);
        $targetDir = storage_path("app/secure_drafts/{$rancangan->rancangan_id}");
        if (! file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        $file->move($targetDir, $cleanFileName);

        $atribut = [
            'nama_file' => $origName,
            'path_file' => "secure_drafts/{$rancangan->rancangan_id}/{$cleanFileName}",
            'ukuran_file' => $fileSize,
            'mime_type' => $mimeType,
            'versi' => $version,
            'uploaded_by' => $user->user_id,
            'uploaded_at' => now(),
        ];

        if ($existingDoc) {
            $this->hapusFileFisik($existingDoc);
            $existingDoc->update($atribut);

            return $existingDoc;
        }

        return Dokumen::create($atribut + [
            'rancangan_id' => $rancangan->rancangan_id,
            'jenis_dokumen_id' => $jenisDokumenId,
        ]);
    }

    /**
     * Hanya menghapus path milik dokumen itu sendiri. resolveSecureFilePath() tidak dipakai
     * di sini karena punya fallback ke berkas lain (mis. sample_draft.pdf) yang tidak boleh terhapus.
     */
    private function hapusFileFisik(Dokumen $dokumen): void
    {
        $path = $dokumen->path_file ? storage_path('app/' . $dokumen->path_file) : null;
        if ($path && is_file($path)) {
            @unlink($path);
        }
    }

    /**
     * @return array<int, int>
     */
    private function idDokumenTerunggah(RancanganRegulasi $rancangan): array
    {
        return Dokumen::where('rancangan_id', $rancangan->rancangan_id)
            ->pluck('jenis_dokumen_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function penolakanTerakhir(RancanganRegulasi $rancangan): ?AuditLog
    {
        return AuditLog::where('module', self::MODUL_AUDIT)
            ->where('action', 'REJECT_FASILITASI')
            ->where('target_id', (string) $rancangan->rancangan_id)
            ->latest('created_at')
            ->latest('id')
            ->first();
    }

    /**
     * Perbaikan dianggap ada bila minimal satu Dokumen 1-5 diunggah setelah penolakan terakhir.
     * Berkas lama tanpa log penolakan tidak ditahan.
     */
    private function adaPerbaikanSetelahDitolak(RancanganRegulasi $rancangan, ?AuditLog $penolakan): bool
    {
        if (! $penolakan) {
            return true;
        }

        return Dokumen::where('rancangan_id', $rancangan->rancangan_id)
            ->whereIn('jenis_dokumen_id', [1, 2, 3, 4, 5])
            ->where('uploaded_at', '>=', $penolakan->created_at)
            ->exists();
    }

    private function catatAudit(Request $request, RancanganRegulasi $rancangan, string $action, array $payload): void
    {
        AuditLog::create([
            'user_id' => $request->user()->user_id,
            'action' => $action,
            'module' => self::MODUL_AUDIT,
            'target_id' => (string) $rancangan->rancangan_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => $payload,
            'created_at' => now(),
        ]);
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
