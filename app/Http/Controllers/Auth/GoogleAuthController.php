<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect pengguna ke halaman login Google
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Tangkap callback otentikasi dari Google
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $driver = Socialite::driver('google')->stateless();

            // Verifikasi sertifikat TLS WAJIB aktif di luar lingkungan lokal/testing.
            // Hanya dev lokal yang boleh menonaktifkannya (workaround cURL error 60 di
            // sebagian instalasi PHP Windows) lewat GOOGLE_OAUTH_INSECURE_TLS=true di .env.
            $verifyTls = app()->environment('local', 'testing')
                ? filter_var(env('GOOGLE_OAUTH_INSECURE_TLS', false), FILTER_VALIDATE_BOOLEAN)
                : true;

            $client = new Client([
                'verify' => $verifyTls,
                'timeout' => 15,
            ]);
            $driver->setHttpClient($client);

            $googleUser = $driver->user();

            $email = $googleUser->getEmail();
            $googleId = $googleUser->getId();

            // 1. Cari user di database berdasarkan email atau google_id
            $user = User::where('email', $email)
                ->orWhere('google_id', $googleId)
                ->first();

            // 2. Jika akun belum didaftarkan oleh Admin
            if (! $user) {
                return redirect()->route('login')->with(
                    'error',
                    "Akun Google ({$email}) belum terdaftar sebagai petugas di HARMONITAS. Silakan hubungi Administrator Sistem Kanwil Riau."
                );
            }

            // 3. Pengecekan status akun (Harus ACTIVE)
            if ($user->status !== 'ACTIVE') {
                return redirect()->route('login')->with(
                    'error',
                    'Akun Anda berstatus NON-AKTIF. Silakan hubungi Administrator Sistem Kanwil Kemenkum Riau.'
                );
            }

            // 4. Hubungkan google_id dan perbarui avatar jika ada
            $user->update([
                'google_id' => $googleId,
                'avatar_path' => $user->avatar_path ?: $googleUser->getAvatar(),
            ]);

            // 5. Login pengguna dan regenerasi sesi
            Auth::login($user, remember: true);
            $request->session()->regenerate();

            // 6. Catat riwayat ke audit_logs
            AuditLog::create([
                'user_id' => $user->user_id,
                'action' => 'AUTH_LOGIN_GOOGLE',
                'module' => 'AUTHENTICATION',
                'target_id' => (string) $user->user_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => [
                    'email' => $user->email,
                    'role' => $user->role,
                    'google_id' => $googleId,
                    'login_at' => now()->toIso8601String(),
                ],
                'created_at' => now(),
            ]);

            return redirect()->intended(route('home'))->with(
                'success',
                "Selamat datang kembali, {$user->nama}!"
            );

        } catch (Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            $errorMessage = config('app.debug') 
                ? 'Gagal masuk dengan Google: ' . $e->getMessage()
                : 'Proses masuk dengan Google dibatalkan atau terjadi kendala. Silakan coba kembali.';

            return redirect()->route('login')->with('error', $errorMessage);
        }
    }
}
