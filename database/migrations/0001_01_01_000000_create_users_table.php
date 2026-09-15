<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Struktur disesuaikan dengan database HARMONITAS (harmonitas_fix).
 * Tabel inti autentikasi: role, tim_kerja, user, password_reset_tokens, sessions.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Master Role (1: ADMIN, 2: TIM_KERJA, 3: BIRO_HUKUM, 4: PIMPINAN)
        Schema::create('role', function (Blueprint $table) {
            $table->integer('role_id', true);
            $table->string('nama_role', 100);
        });

        // 2. Tim Kerja Kanwil (wilayah binaan harmonisasi)
        Schema::create('tim_kerja', function (Blueprint $table) {
            $table->integer('tim_kerja_id', true);
            $table->string('nama_tim_kerja', 100);
            $table->text('keterangan')->nullable();
        });

        // 3. User
        Schema::create('user', function (Blueprint $table) {
            $table->integer('user_id', true);
            $table->string('nama', 150);
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->string('nip', 30)->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->integer('tim_kerja_id')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->string('google_id')->nullable();
            $table->string('avatar_path')->nullable();
            $table->dateTime('email_verified_at')->nullable();
            $table->rememberToken();
            $table->integer('role_id');
            $table->dateTime('created_at')->nullable()->useCurrent();
            $table->dateTime('updated_at')->nullable();

            $table->foreign('tim_kerja_id', 'fk_user_tim_kerja')
                ->references('tim_kerja_id')->on('tim_kerja')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('role_id', 'user_ibfk_1')
                ->references('role_id')->on('role')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // 4. Password Reset Tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->dateTime('created_at')->nullable();
        });

        // 5. Sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('user');
        Schema::dropIfExists('tim_kerja');
        Schema::dropIfExists('role');
    }
};
