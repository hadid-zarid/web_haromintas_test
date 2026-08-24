<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Pokjas
        Schema::create('pokjas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pokja', 50);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 2. Wilayahs
        Schema::create('wilayahs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pokja_id')->constrained('pokjas')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('nama_wilayah', 100);
            $table->enum('jenis_wilayah', ['PROVINSI', 'KABUPATEN', 'KOTA']);
            $table->string('kode_wilayah', 20)->unique();
            $table->timestamps();
        });

        // 3. Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pokja_id')->nullable()->constrained('pokjas')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayahs')->nullOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('nip', 30)->nullable();
            $table->string('jabatan', 100)->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->enum('role', ['ADMIN', 'POKJA', 'BIRO_HUKUM', 'PIMPINAN'])->default('POKJA')->index();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->string('avatar_path', 255)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 4. Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->string('action', 100)->index();
            $table->string('module', 50)->index();
            $table->string('target_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 5. Password Reset Tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 6. Sessions
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
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('wilayahs');
        Schema::dropIfExists('pokjas');
    }
};
