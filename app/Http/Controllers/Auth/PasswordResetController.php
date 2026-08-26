<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\AuditLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetController extends Controller
{
    /**
     * Tampilkan Halaman Lupa Password (Input Email)
     */
    public function showForgotPassword(): Response
    {
        return Inertia::render('ForgotPasswordPage');
    }

    /**
     * Proses Kirim Email Tautan Reset Password
     */
    public function sendResetLinkEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Alamat email kedinasan wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return back()->withErrors([
                'email' => 'Alamat email kedinasan tidak terdaftar di sistem HARMONITAS.',
            ]);
        }

        if (! $user->isActive()) {
            return back()->withErrors([
                'email' => 'Akun Anda sedang nonaktif. Silakan hubungi Administrator Kanwil.',
            ]);
        }

        // Buat token pemulihan acak
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Buat URL reset password lengkap
        $resetUrl = route('password.reset', [
            'token' => $token,
            'email' => $user->email,
        ]);

        $isLogMailer = config('mail.default') === 'log';

        try {
            Mail::to($user->email)->send(new ResetPasswordMail($user->nama, $resetUrl));
        } catch (\Throwable $e) {
            Log::warning('Gagal mengirim email reset password via SMTP.', [
                'email' => $user->email,
                'reset_url' => $resetUrl,
                'error' => $e->getMessage(),
            ]);
        }

        $successMsg = "Tautan pemulihan kata sandi telah dikirim ke email <strong>{$user->email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.";
        if ($isLogMailer) {
            $successMsg .= "<br><div class='mt-2 p-2.5 bg-amber-100/80 border border-amber-300 rounded-xl text-[11px] text-amber-950 leading-relaxed'><strong>[Mode Pengembang Lokal]</strong> Pengiriman email fisik SMTP belum dihubungkan di .env. Anda dapat mengeklik tautan langsung berikut untuk menguji:<br><a href='{$resetUrl}' class='inline-block mt-1.5 px-3 py-1 bg-[#1A1A5E] text-white font-black rounded-lg hover:bg-[#2C3154] transition-all text-xs no-underline'>Buka Form Reset Password Baru &rarr;</a></div>";
        }

        return back()->with('success', $successMsg);
    }

    /**
     * Tampilkan Halaman Form Reset Password Baru
     */
    public function showResetPassword(string $token, Request $request): Response
    {
        return Inertia::render('ResetPasswordPage', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Proses Pembaruan Kata Sandi Baru
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',      // minimal 1 huruf kecil
                'regex:/[A-Z]/',      // minimal 1 huruf besar
                'regex:/[0-9]/',      // minimal 1 angka
                'regex:/[^A-Za-z0-9]/',// minimal 1 karakter khusus
            ],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi baru wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.regex' => 'Kata sandi harus mengandung kombinasi huruf besar, huruf kecil, angka, dan karakter spesial.',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            return back()->withErrors([
                'email' => 'Tautan pemulihan kata sandi tidak valid atau telah digunakan.',
            ]);
        }

        // Cek kedaluwarsa token (60 menit)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return back()->withErrors([
                'email' => 'Tautan pemulihan kata sandi telah kedaluwarsa (lebih dari 60 menit). Silakan minta tautan baru.',
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return back()->withErrors([
                'email' => 'Pengguna tidak ditemukan.',
            ]);
        }

        // Update password pengguna
        $user->password = Hash::make($request->password);
        $user->save();

        // Hapus token yang sudah terpakai
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Audit Log
        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'AUTH_PASSWORD_RESET',
            'module' => 'AUTHENTICATION',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'email' => $user->email,
                'reset_at' => now()->toIso8601String(),
            ],
            'created_at' => now(),
        ]);

        return redirect()->route('login')->with('success', 'Kata sandi Anda berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.');
    }
}
