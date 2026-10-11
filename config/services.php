<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, Google, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', 'http://localhost:8000/auth/google/callback'),
        // Hanya dihormati di local/testing (lihat GoogleAuthController).
        'insecure_tls' => filter_var(env('GOOGLE_OAUTH_INSECURE_TLS', false), FILTER_VALIDATE_BOOLEAN),
    ],

    /*
     * Google reCAPTCHA v2 (checkbox "Saya bukan robot") untuk login email/password.
     * Di luar production, jika key kosong dipakai test key resmi Google (selalu lolos,
     * widget menampilkan peringatan "for testing purposes only").
     * Di production key WAJIB diisi; jika kosong login email/password akan ditolak.
     */
    /*
     * Chatbot bantuan di landing page. Memakai API yang kompatibel dengan OpenAI (JuanRouter).
     * Kunci WAJIB diisi agar fitur aktif; jika kosong, tombol chat tidak tampil dan endpoint mati.
     * `daily_limit` = batas total pesan per hari untuk seluruh pengunjung, agar saldo API
     * tidak habis jika ada yang menyalahgunakan.
     */
    'chatbot' => [
        'api_key' => env('CHATBOT_API_KEY'),
        'base_url' => env('CHATBOT_BASE_URL', 'https://api.juanrouter.com/v1'),
        'model' => env('CHATBOT_MODEL', 'gemini-3.8-flash-high'),
        'daily_limit' => (int) env('CHATBOT_DAILY_LIMIT', 1000),
        'timeout' => (int) env('CHATBOT_TIMEOUT', 40),
    ],

    'recaptcha' => [
        'enabled' => (bool) env('RECAPTCHA_ENABLED', true),
        'site_key' => env('RECAPTCHA_SITE_KEY') ?: (env('APP_ENV') === 'production' ? null : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
        'secret_key' => env('RECAPTCHA_SECRET_KEY') ?: (env('APP_ENV') === 'production' ? null : '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'),
    ],

];
