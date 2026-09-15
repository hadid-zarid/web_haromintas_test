<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Struktur disesuaikan dengan database HARMONITAS (harmonitas_fix).
 * Master wilayah & regulasi: kabupaten, user_kabupaten, jenis_regulasi, status_regulasi, jenis_dokumen.
 *
 * Tabel yang sudah ada dilewati, karena database yang berjalan (lokal/Railway)
 * dibuat dari import SQL sebelum migration ini disesuaikan.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Kabupaten / Kota (termasuk Pemerintah Provinsi Riau)
        if (! Schema::hasTable('kabupaten')) {
            Schema::create('kabupaten', function (Blueprint $table) {
                $table->integer('kabupaten_id', true);
                $table->string('nama_kabupaten', 150);
                $table->string('kode_kabupaten', 50);
                $table->integer('tim_kerja_id')->nullable();

                $table->foreign('tim_kerja_id', 'fk_kabupaten_tim_kerja')
                    ->references('tim_kerja_id')->on('tim_kerja')
                    ->nullOnDelete()->cascadeOnUpdate();
            });
        }

        // 2. Pivot User - Kabupaten
        if (! Schema::hasTable('user_kabupaten')) {
            Schema::create('user_kabupaten', function (Blueprint $table) {
                $table->integer('id', true);
                $table->integer('user_id');
                $table->integer('kabupaten_id');

                $table->foreign('user_id', 'user_kabupaten_ibfk_1')
                    ->references('user_id')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('kabupaten_id', 'user_kabupaten_ibfk_2')
                    ->references('kabupaten_id')->on('kabupaten')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 3. Master Jenis Regulasi (Ranperda / Ranperkada)
        if (! Schema::hasTable('jenis_regulasi')) {
            Schema::create('jenis_regulasi', function (Blueprint $table) {
                $table->integer('jenis_regulasi_id', true);
                $table->string('nama_jenis', 150);
            });
        }

        // 4. Master Status Regulasi
        if (! Schema::hasTable('status_regulasi')) {
            Schema::create('status_regulasi', function (Blueprint $table) {
                $table->integer('status_id', true);
                $table->string('nama_status', 100);
                $table->integer('urutan');
            });
        }

        // 5. Master Jenis Dokumen (7 slot dokumen harmonisasi & fasilitasi)
        if (! Schema::hasTable('jenis_dokumen')) {
            Schema::create('jenis_dokumen', function (Blueprint $table) {
                $table->integer('jenis_dokumen_id', true);
                $table->string('nama_dokumen', 150);
                $table->string('tahap', 100);
                $table->integer('urutan');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * Sengaja tidak menghapus tabel: tabel bisa berasal dari import SQL dan berisi
     * data live. Untuk mengulang database lokal dari nol gunakan `migrate:fresh`.
     */
    public function down(): void
    {
        //
    }
};
