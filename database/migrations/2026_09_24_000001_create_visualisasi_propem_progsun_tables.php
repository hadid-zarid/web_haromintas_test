<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah kolom tonggak penyelesaian harmonisasi (harmonisasi_completed_at) pada tabel rancangan_regulasi
        if (Schema::hasTable('rancangan_regulasi')) {
            Schema::table('rancangan_regulasi', function (Blueprint $table) {
                if (! Schema::hasColumn('rancangan_regulasi', 'harmonisasi_completed_at')) {
                    $table->dateTime('harmonisasi_completed_at')
                        ->nullable()
                        ->after('tanggal_dibuat')
                        ->index('idx_rancangan_harmonisasi_completed_at');
                }
            });

            // Backfill otomatis untuk data yang sudah ada di database jika Dokumen 5 (Surat Hasil Harmonisasi) sudah terunggah
            try {
                $selesaiHarmonisasiRows = DB::table('dokumen')
                    ->where('jenis_dokumen_id', 5)
                    ->select('rancangan_id', DB::raw('MIN(uploaded_at) as completed_at'))
                    ->groupBy('rancangan_id')
                    ->get();

                foreach ($selesaiHarmonisasiRows as $row) {
                    DB::table('rancangan_regulasi')
                        ->where('rancangan_id', $row->rancangan_id)
                        ->whereNull('harmonisasi_completed_at')
                        ->update(['harmonisasi_completed_at' => $row->completed_at ?? now()]);
                }
            } catch (\Throwable $e) {
                // Jangan batalkan migrasi jika terjadi kegagalan data query lama
            }
        }

        // 2. Tabel Snapshot Agregat Historis (misal 2025 dari rekap resmi)
        if (! Schema::hasTable('historis_harmonisasi')) {
            Schema::create('historis_harmonisasi', function (Blueprint $table) {
                $table->id();
                $table->unsignedSmallInteger('tahun')->index('idx_historis_tahun');
                $table->integer('kabupaten_id');
                $table->integer('jenis_regulasi_id');
                $table->unsignedInteger('jumlah_rencana')->default(0); // ProPem (Ranperda) / Progsun (Ranperkada)
                $table->unsignedInteger('jumlah_harmonisasi')->default(0); // Jumlah yang telah selesai diharmonisasi
                $table->string('sumber', 255)->default('rekap 2025 yang diberikan');
                $table->text('catatan')->nullable();
                $table->timestamps();

                $table->unique(['tahun', 'kabupaten_id', 'jenis_regulasi_id'], 'uq_historis_tahun_kab_jenis');

                $table->foreign('kabupaten_id', 'fk_historis_kabupaten')
                    ->references('kabupaten_id')->on('kabupaten')
                    ->cascadeOnDelete()->cascadeOnUpdate();

                $table->foreign('jenis_regulasi_id', 'fk_historis_jenis_regulasi')
                    ->references('jenis_regulasi_id')->on('jenis_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 3. Tabel Rencana Regulasi Resmi Tahunan (ProPem / Progsun) untuk data operasional/berjalan
        if (! Schema::hasTable('rencana_regulasi')) {
            Schema::create('rencana_regulasi', function (Blueprint $table) {
                $table->id();
                $table->unsignedSmallInteger('tahun')->index('idx_rencana_tahun');
                $table->integer('kabupaten_id');
                $table->integer('jenis_regulasi_id');
                $table->unsignedInteger('jumlah_rencana')->default(0); // Nilai target resmi (termasuk 0 terkonfirmasi)
                $table->string('sumber_resmi', 255)->nullable(); // Misal: SK DPRD / SK Bupati
                $table->boolean('is_published')->default(false)->index('idx_rencana_published'); // Siap tayang publik
                $table->dateTime('published_at')->nullable();
                $table->integer('updated_by')->nullable();
                $table->text('keterangan')->nullable();
                $table->timestamps();

                $table->unique(['tahun', 'kabupaten_id', 'jenis_regulasi_id'], 'uq_rencana_tahun_kab_jenis');

                $table->foreign('kabupaten_id', 'fk_rencana_kabupaten')
                    ->references('kabupaten_id')->on('kabupaten')
                    ->cascadeOnDelete()->cascadeOnUpdate();

                $table->foreign('jenis_regulasi_id', 'fk_rencana_jenis_regulasi')
                    ->references('jenis_regulasi_id')->on('jenis_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();

                if (Schema::hasTable('user')) {
                    $table->foreign('updated_by', 'fk_rencana_user')
                        ->references('user_id')->on('user')
                        ->nullOnDelete()->cascadeOnUpdate();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rencana_regulasi');
        Schema::dropIfExists('historis_harmonisasi');

        if (Schema::hasTable('rancangan_regulasi') && Schema::hasColumn('rancangan_regulasi', 'harmonisasi_completed_at')) {
            Schema::table('rancangan_regulasi', function (Blueprint $table) {
                $table->dropIndex('idx_rancangan_harmonisasi_completed_at');
                $table->dropColumn('harmonisasi_completed_at');
            });
        }
    }
};
