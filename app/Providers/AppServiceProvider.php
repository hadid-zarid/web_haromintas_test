<?php

namespace App\Providers;

use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Hanya paksa https bila APP_URL memang https, supaya uji lewat http
        // (localhost / IP server sebelum DNS dipindah) tidak memuat asset dari https.
        if (config('app.env') === 'production' && str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        // Satu sumber aturan kekuatan kata sandi untuk seluruh form (admin, reset, profil).
        // Pesan berbahasa Indonesia ada di lang/en/validation.php.
        Password::defaults(fn () => Password::min(8)->letters()->mixedCase()->numbers()->symbols());

        // SQLite (test & verifikasi lokal) tidak punya YEAR() yang dipakai query beranda.
        // Lewat event supaya tidak membuka koneksi saat boot (build Docker belum punya database);
        // produksi memakai MySQL sehingga fungsi ini tidak pernah didaftarkan di sana.
        Event::listen(function (ConnectionEstablished $event) {
            if ($event->connection->getDriverName() === 'sqlite') {
                $event->connection->getPdo()->sqliteCreateFunction('YEAR', fn ($tanggal) => $tanggal ? (int) substr((string) $tanggal, 0, 4) : null);
            }
        });
    }
}
