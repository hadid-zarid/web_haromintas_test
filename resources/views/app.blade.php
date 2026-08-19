<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="description" content="HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas) - Solusi menyederhanakan proses harmonisasi rancangan peraturan daerah dan rancangan peraturan kepala daerah di Provinsi Riau." />

    <title inertia>{{ config('app.name', 'HARMONITAS') }}</title>

    <!-- Scripts & Styles -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="bg-[#F5F5F0] text-[#3D3D3A] antialiased">
    @inertia
</body>
</html>
