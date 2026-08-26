<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="{{ asset('LOGO HARMONITAS.png') }}" />
    <link rel="shortcut icon" type="image/png" href="{{ asset('LOGO HARMONITAS.png') }}" />
    <link rel="apple-touch-icon" href="{{ asset('LOGO HARMONITAS.png') }}" />
    <meta name="description" content="HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas) - Solusi menyederhanakan proses harmonisasi rancangan peraturan daerah dan rancangan peraturan kepala daerah di Provinsi Riau." />

    <title inertia>{{ config('app.name', 'HARMONITAS') }}</title>

    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet">

    <!-- Scripts & Styles -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="bg-[#F5F5F0] text-[#3D3D3A] antialiased">
    @inertia
</body>
</html>
