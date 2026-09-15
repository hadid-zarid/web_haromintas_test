<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Struktur disesuaikan dengan database HARMONITAS (harmonitas_fix).
 * Alur permohonan: rancangan_regulasi, dokumen, notifikasi, perbandingan_ai, rapat_harmonisasi, rapat_fasilitasi.
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
        // 1. Rancangan Regulasi (berkas permohonan)
        if (! Schema::hasTable('rancangan_regulasi')) {
            Schema::create('rancangan_regulasi', function (Blueprint $table) {
                $table->integer('rancangan_id', true);
                $table->text('judul_rancangan');
                $table->string('nomor_regulasi', 100)->nullable();
                $table->integer('jenis_regulasi_id');
                $table->integer('kabupaten_id');
                $table->integer('tim_kerja_id')->nullable();
                $table->integer('user_id')->nullable();
                $table->integer('pokja_id');
                $table->integer('status_id');
                $table->text('keterangan')->nullable();
                $table->date('tanggal_dibuat')->nullable();
                $table->dateTime('created_at')->nullable()->useCurrent();
                $table->dateTime('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

                $table->foreign('jenis_regulasi_id', 'rancangan_regulasi_ibfk_1')
                    ->references('jenis_regulasi_id')->on('jenis_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('kabupaten_id', 'rancangan_regulasi_ibfk_2')
                    ->references('kabupaten_id')->on('kabupaten')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('pokja_id', 'rancangan_regulasi_ibfk_3')
                    ->references('user_id')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('status_id', 'rancangan_regulasi_ibfk_4')
                    ->references('status_id')->on('status_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 2. Dokumen Berkas
        if (! Schema::hasTable('dokumen')) {
            Schema::create('dokumen', function (Blueprint $table) {
                $table->integer('dokumen_id', true);
                $table->integer('rancangan_id');
                $table->integer('jenis_dokumen_id');
                $table->string('nama_file');
                $table->string('path_file');
                $table->string('ukuran_file', 50)->nullable();
                $table->string('mime_type', 100)->nullable();
                $table->integer('versi')->nullable()->default(1);
                $table->integer('uploaded_by');
                $table->dateTime('uploaded_at')->nullable()->useCurrent();

                $table->foreign('rancangan_id', 'dokumen_ibfk_1')
                    ->references('rancangan_id')->on('rancangan_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('jenis_dokumen_id', 'dokumen_ibfk_2')
                    ->references('jenis_dokumen_id')->on('jenis_dokumen')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('uploaded_by', 'dokumen_ibfk_3')
                    ->references('user_id')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 3. Notifikasi In-App
        if (! Schema::hasTable('notifikasi')) {
            Schema::create('notifikasi', function (Blueprint $table) {
                $table->integer('notifikasi_id', true);
                $table->integer('user_id');
                $table->integer('rancangan_id');
                $table->string('judul', 150);
                $table->text('pesan');
                $table->boolean('is_read')->nullable()->default(false);
                $table->dateTime('created_at')->nullable()->useCurrent();

                $table->foreign('user_id', 'notifikasi_ibfk_1')
                    ->references('user_id')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('rancangan_id', 'notifikasi_ibfk_2')
                    ->references('rancangan_id')->on('rancangan_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 4. Perbandingan AI (dokumen harmonisasi vs fasilitasi)
        if (! Schema::hasTable('perbandingan_ai')) {
            Schema::create('perbandingan_ai', function (Blueprint $table) {
                $table->integer('perbandingan_id', true);
                $table->integer('rancangan_id');
                $table->integer('dokumen_harmonisasi_id');
                $table->integer('dokumen_fasilitasi_id');
                $table->text('hasil_analisis')->nullable();
                $table->decimal('skor_similarity', 5, 2)->nullable();
                $table->string('status_hasil', 100)->nullable();
                $table->integer('dibuat_oleh');
                $table->dateTime('created_at')->nullable()->useCurrent();

                $table->foreign('rancangan_id', 'perbandingan_ai_ibfk_1')
                    ->references('rancangan_id')->on('rancangan_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('dokumen_harmonisasi_id', 'perbandingan_ai_ibfk_2')
                    ->references('dokumen_id')->on('dokumen')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('dokumen_fasilitasi_id', 'perbandingan_ai_ibfk_3')
                    ->references('dokumen_id')->on('dokumen')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('dibuat_oleh', 'perbandingan_ai_ibfk_4')
                    ->references('user_id')->on('user')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 5. Rapat Harmonisasi
        if (! Schema::hasTable('rapat_harmonisasi')) {
            Schema::create('rapat_harmonisasi', function (Blueprint $table) {
                $table->integer('rapat_harmonisasi_id', true);
                $table->integer('rancangan_id');
                $table->date('tanggal_rapat')->nullable();
                $table->string('tempat')->nullable();
                $table->text('catatan')->nullable();
                $table->string('status', 100)->nullable();

                $table->foreign('rancangan_id', 'rapat_harmonisasi_ibfk_1')
                    ->references('rancangan_id')->on('rancangan_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        // 6. Rapat Fasilitasi
        if (! Schema::hasTable('rapat_fasilitasi')) {
            Schema::create('rapat_fasilitasi', function (Blueprint $table) {
                $table->integer('rapat_fasilitasi_id', true);
                $table->integer('rancangan_id');
                $table->date('tanggal_rapat')->nullable();
                $table->string('tempat')->nullable();
                $table->text('catatan')->nullable();
                $table->string('status', 100)->nullable();

                $table->foreign('rancangan_id', 'rapat_fasilitasi_ibfk_1')
                    ->references('rancangan_id')->on('rancangan_regulasi')
                    ->cascadeOnDelete()->cascadeOnUpdate();
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
