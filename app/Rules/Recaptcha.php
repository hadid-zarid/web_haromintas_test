<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Custom Validation Rule: Google reCAPTCHA v2
 *
 * Memverifikasi token dari widget "Saya bukan robot" ke server Google.
 * Bersifat fail-closed: jika key belum dikonfigurasi atau server Google
 * tidak dapat dihubungi, verifikasi dianggap GAGAL.
 */
class Recaptcha implements ValidationRule
{
    private const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

    // Test secret resmi Google untuk development (lihat config/services.php)
    private const GOOGLE_TEST_SECRET = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || trim($value) === '') {
            $fail('Silakan centang kotak "Saya bukan robot" terlebih dahulu.');
            return;
        }

        $secret = config('services.recaptcha.secret_key');
        if (empty($secret)) {
            Log::error('[Recaptcha] RECAPTCHA_SECRET_KEY belum dikonfigurasi, login email/password ditolak.');
            $fail('Verifikasi CAPTCHA belum dikonfigurasi. Silakan hubungi Administrator Sistem.');
            return;
        }

        try {
            $response = Http::asForm()->timeout(5)->post(self::VERIFY_URL, [
                'secret' => $secret,
                'response' => $value,
                'remoteip' => request()->ip(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('[Recaptcha] Gagal menghubungi server verifikasi Google: ' . $e->getMessage());
            $fail('Verifikasi CAPTCHA gagal diproses. Silakan coba beberapa saat lagi.');
            return;
        }

        if (! $response->successful() || $response->json('success') !== true) {
            $fail('Verifikasi CAPTCHA tidak valid atau sudah kedaluwarsa. Silakan centang ulang.');
            return;
        }

        // Pastikan CAPTCHA diselesaikan di domain aplikasi ini, bukan di situs lain yang memakai site key sama.
        // Test key Google selalu mengembalikan hostname "testkey.google.com", jadi dilewati.
        if ($secret !== self::GOOGLE_TEST_SECRET && $response->json('hostname') !== request()->getHost()) {
            Log::warning('[Recaptcha] Hostname tidak cocok: ' . $response->json('hostname') . ' vs ' . request()->getHost());
            $fail('Verifikasi CAPTCHA tidak valid untuk domain ini. Silakan centang ulang.');
        }
    }
}
