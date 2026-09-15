<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pembagian Wilayah Kerja Biro Hukum Setda Provinsi Riau (terpisah dari Tim Kerja Kanwil).
 * Padanan database yang sudah berjalan: database/update_wilayah_biro_hukum.sql
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // NULL = kabupaten ditangani seluruh petugas Biro Hukum (mis. Pemprov Riau)
        if (! Schema::hasColumn('kabupaten', 'wilayah_biro_hukum_id')) {
            Schema::table('kabupaten', function (Blueprint $table) {
                $table->unsignedTinyInteger('wilayah_biro_hukum_id')->nullable()->after('tim_kerja_id');
            });
        }

        // Wajib diisi (1-3) untuk role Biro Hukum; NULL untuk role lain
        if (! Schema::hasColumn('user', 'wilayah_biro_hukum_id')) {
            Schema::table('user', function (Blueprint $table) {
                $table->unsignedTinyInteger('wilayah_biro_hukum_id')->nullable()->after('tim_kerja_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('user', 'wilayah_biro_hukum_id')) {
            Schema::table('user', function (Blueprint $table) {
                $table->dropColumn('wilayah_biro_hukum_id');
            });
        }

        if (Schema::hasColumn('kabupaten', 'wilayah_biro_hukum_id')) {
            Schema::table('kabupaten', function (Blueprint $table) {
                $table->dropColumn('wilayah_biro_hukum_id');
            });
        }
    }
};
