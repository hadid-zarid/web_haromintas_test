<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profil\UpdateAvatarRequest;
use App\Http\Requests\Profil\UpdatePasswordRequest;
use App\Http\Requests\Profil\UpdateProfilRequest;
use App\Mail\PasswordChangedMail;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

        $this->catatAudit($request, 'PROFIL_UPDATE', 'USER_PROFILE', [
            'changed_fields' => array_keys($user->getChanges()),
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

        $this->catatAudit($request, 'AUTH_PASSWORD_CHANGED', 'AUTHENTICATION', [
            'email' => $user->email,
            'changed_at' => now()->toIso8601String(),
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

    /**
     * Ganti foto profil (gambar sudah dipotong persegi di browser; server tetap meng-encode ulang).
     */
    public function updateAvatar(UpdateAvatarRequest $request, AvatarService $avatar): RedirectResponse
    {
        $avatar->simpan($request->user(), $request->file('avatar'));
        $this->catatAudit($request, 'PROFIL_AVATAR_UPDATE', 'USER_PROFILE', []);

        return back()->with('success', 'Foto profil berhasil diperbarui.');
    }

    public function destroyAvatar(Request $request, AvatarService $avatar): RedirectResponse
    {
        $avatar->hapus($request->user());
        $this->catatAudit($request, 'PROFIL_AVATAR_DELETE', 'USER_PROFILE', []);

        return back()->with('success', 'Foto profil berhasil dihapus.');
    }

    /**
     * Sajikan foto profil unggahan. Boleh dilihat semua pengguna yang login (rute di grup auth).
     */
    public function showAvatar(User $user): StreamedResponse
    {
        abort_unless(
            AvatarService::fileLokal($user->avatar_path) && AvatarService::disk()->exists($user->avatar_path),
            404
        );

        // URL selalu memuat ?v=<nama file acak>, jadi aman di-cache lama.
        return AvatarService::disk()->response($user->avatar_path, null, [
            'Content-Type' => 'image/jpeg',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, max-age=31536000, immutable',
        ]);
    }

    private function catatAudit(Request $request, string $action, string $module, array $payload): void
    {
        AuditLog::create([
            'user_id' => $request->user()->user_id,
            'action' => $action,
            'module' => $module,
            'target_id' => (string) $request->user()->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => $payload,
            'created_at' => now(),
        ]);
    }
}
