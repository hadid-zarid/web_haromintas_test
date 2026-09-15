<?php

namespace App\Http\Requests\Auth;

use App\Models\AuditLog;
use App\Models\User;
use App\Rules\Recaptcha;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    private const IP_MAX_ATTEMPTS = 30;
    private const IP_DECAY_SECONDS = 900;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ];

        // CAPTCHA wajib untuk login email/password (standar Pusdatin); login Google SSO tidak melewati request ini
        if (config('services.recaptcha.enabled')) {
            $rules['recaptcha_token'] = ['bail', 'required', 'string', new Recaptcha()];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email kedinasan wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi / password wajib diisi.',
            'recaptcha_token.required' => 'Silakan centang kotak "Saya bukan robot" terlebih dahulu.',
            'recaptcha_token.string' => 'Verifikasi CAPTCHA tidak valid. Silakan centang ulang.',
        ];
    }

    /**
     * Authenticate the request's credentials with rate limiting and active status check.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');
        $remember = $this->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            $this->recordFailedAttempt('INVALID_CREDENTIALS');

            throw ValidationException::withMessages([
                'email' => 'Email atau kata sandi yang Anda masukkan tidak sesuai.',
            ]);
        }

        $user = Auth::user();

        // Check if user account is ACTIVE
        if ($user && $user->status !== 'ACTIVE') {
            Auth::logout();
            $this->recordFailedAttempt('ACCOUNT_INACTIVE', $user->user_id);

            throw ValidationException::withMessages([
                'email' => 'Akun Anda berstatus NON-AKTIF. Silakan hubungi Administrator Sistem Kanwil Kemenkum Riau.',
            ]);
        }

        // Batas per-IP tidak di-reset saat login berhasil agar percobaan ke banyak email tetap terhitung
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Catat percobaan login gagal: tambah hitungan rate limit (per email & per IP) dan simpan log audit.
     */
    private function recordFailedAttempt(string $reason, ?int $userId = null): void
    {
        RateLimiter::hit($this->throttleKey());
        RateLimiter::hit($this->ipThrottleKey(), self::IP_DECAY_SECONDS);

        AuditLog::create([
            'user_id' => $userId,
            'action' => 'AUTH_LOGIN_FAILED',
            'module' => 'AUTHENTICATION',
            'target_id' => $userId !== null ? (string) $userId : null,
            'ip_address' => $this->ip(),
            'user_agent' => Str::limit((string) $this->userAgent(), 500, ''),
            'payload' => [
                'email' => Str::limit((string) $this->input('email'), 150, ''),
                'reason' => $reason,
            ],
            'created_at' => now(),
        ]);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * - Per email + IP: 5 kali gagal per menit (menahan tebak kata sandi satu akun)
     * - Per IP: 30 kali gagal per 15 menit (menahan percobaan ke banyak email dari satu IP).
     *   Batas dibuat longgar karena pegawai satu kantor dapat berbagi satu IP publik.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        $key = null;
        if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            $key = $this->throttleKey();
        } elseif (RateLimiter::tooManyAttempts($this->ipThrottleKey(), self::IP_MAX_ATTEMPTS)) {
            $key = $this->ipThrottleKey();
        }

        if ($key === null) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($key);

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }

    /**
     * Rate limiting key per alamat IP (lintas email).
     */
    public function ipThrottleKey(): string
    {
        return 'login-ip|'.$this->ip();
    }
}
