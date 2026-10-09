<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profil\UpdatePasswordRequest;
use App\Http\Requests\Profil\UpdateProfilRequest;
use App\Mail\PasswordChangedMail;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
    /**
     * Halaman Profil Saya — data akun diambil dari shared prop auth.user.
     */
    public function edit(): Response
    {
        return Inertia::render('ProfilPage');
    }

    /**
     * Perbarui data diri (nama & no HP) milik pengguna yang sedang login.
     */
    public function update(UpdateProfilRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'PROFIL_UPDATE',
            'module' => 'USER_PROFILE',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'changed_fields' => array_keys($user->getChanges()),
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Profil Anda berhasil diperbarui.');
    }

    /**
     * Ganti kata sandi. Sesi di perangkat lain otomatis keluar lewat middleware
     * auth.session (hash kata sandi di sesi lama tidak lagi cocok).
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $user = $request->user();

        // remember_token dirotasi agar cookie "ingat saya" yang lama tidak bisa dipakai lagi.
        $user->forceFill([
            'password' => $request->validated('password'),
            'remember_token' => Str::random(60),
        ])->save();

        $request->session()->regenerate();

        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'AUTH_PASSWORD_CHANGED',
            'module' => 'AUTHENTICATION',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'email' => $user->email,
                'changed_at' => now()->toIso8601String(),
            ],
            'created_at' => now(),
        ]);

        try {
            Mail::to($user->email)->send(new PasswordChangedMail($user->nama, now(), (string) $request->ip()));
        } catch (\Throwable $e) {
            Log::warning('Gagal mengirim email pemberitahuan perubahan kata sandi.', [
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Kata sandi berhasil diubah. Sesi di perangkat lain telah dikeluarkan.');
    }
}
