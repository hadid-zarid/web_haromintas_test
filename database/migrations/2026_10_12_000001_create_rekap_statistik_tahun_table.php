<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Status per tahun rekap statistik landing page (tayang / tampil pertama).
     * Angka per wilayah tetap di tabel historis_harmonisasi.
     */
    public function up(): void
    {
        if (! Schema::hasTable('rekap_statistik_tahun')) {
            Schema::create('rekap_statistik_tahun', function (Blueprint $table) {
                $table->unsignedSmallInteger('tahun')->primary();
                $table->string('sumber', 255)->nullable();
                $table->boolean('is_published')->default(false);
                $table->boolean('is_default')->default(false);
                $table->dateTime('published_at')->nullable();
                $table->integer('updated_by')->nullable();
                $table->timestamps();
            });
        }

        // Database yang sudah berisi rekap 2025: tetap tayang dan tampil pertama seperti sebelumnya.
        if (Schema::hasTable('historis_harmonisasi')) {
            $sumber2025 = DB::table('historis_harmonisasi')->where('tahun', 2025)->value('sumber');

            if ($sumber2025 !== null) {
                DB::table('rekap_statistik_tahun')->insertOrIgnore([
                    'tahun' => 2025,
                    'sumber' => $sumber2025,
                    'is_published' => true,
                    'is_default' => true,
                    'published_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Sengaja tidak menghapus tabel: berisi pengaturan publikasi yang diisi admin.
     */
    public function down(): void {}
};
