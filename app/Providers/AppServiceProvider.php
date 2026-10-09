<?php

namespace App\Providers;

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
    }
}
