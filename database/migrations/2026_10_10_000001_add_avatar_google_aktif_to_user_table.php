<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Penanda apakah foto akun Google boleh dipakai sebagai foto profil.
 * Bernilai false setelah user menghapus fotonya sendiri, agar login Google
 * berikutnya tidak memasang foto Google lagi (tetap inisial).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('user', 'avatar_google_aktif')) {
            Schema::table('user', function (Blueprint $table) {
                $table->boolean('avatar_google_aktif')->default(true)->after('avatar_path');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('user', 'avatar_google_aktif')) {
            Schema::table('user', function (Blueprint $table) {
                $table->dropColumn('avatar_google_aktif');
            });
        }
    }
};
