<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Struktur disesuaikan dengan database HARMONITAS (harmonitas_fix).
 *
 * Tabel dilewati jika sudah ada, karena database yang berjalan (lokal/Railway)
 * dibuat dari import SQL sebelum migration ini disesuaikan.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('audit_logs')) {
            return;
        }

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable()->index();
            $table->string('action', 100)->index();
            $table->string('module', 100);
            $table->string('target_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('payload')->nullable();
            $table->dateTime('created_at')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * Sengaja tidak menghapus tabel: berisi log audit live. Untuk mengulang
     * database lokal dari nol gunakan `migrate:fresh`.
     */
    public function down(): void
    {
        //
    }
};
