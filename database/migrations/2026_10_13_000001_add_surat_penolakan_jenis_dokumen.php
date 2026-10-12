<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Surat penolakan Biro Hukum mendapat slot sendiri (jenis_dokumen 8).
 *
 * Sebelumnya surat penolakan disimpan di slot 7 (Surat Hasil Fasilitasi), sehingga berkas
 * yang ditolak terhitung "lengkap" dan otomatis menjadi Selesai saat Tim Kerja mengunggah
 * perbaikan. Migration ini idempotent dan tidak menghapus data apa pun.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('jenis_dokumen')->insertOrIgnore([
            'jenis_dokumen_id' => 8,
            'nama_dokumen' => 'Surat Penolakan Fasilitasi',
            'tahap' => 'Fasilitasi',
            'urutan' => 8,
        ]);

        // Surat penolakan lama dikenali dari awalan nama file yang diberikan updateStatus().
        DB::table('dokumen')
            ->where('jenis_dokumen_id', 7)
            ->where('path_file', 'like', '%/surat_penolakan_%')
            ->update(['jenis_dokumen_id' => 8]);
    }

    /**
     * Sengaja kosong: baris master & pemindahan slot tidak perlu dibatalkan.
     */
    public function down(): void
    {
        //
    }
};
