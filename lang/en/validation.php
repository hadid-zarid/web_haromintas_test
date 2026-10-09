<?php

// Hanya menimpa pesan rule Password bawaan Laravel; key lain tetap dari framework
// (FileLoader menggabungkan file ini dengan bawaan via array_replace_recursive).
// ponytail: locale aplikasi masih 'en' walau UI berbahasa Indonesia — pindahkan ke
// lang/id/ bila suatu saat APP_LOCALE diganti ke 'id'.
return [
    'password' => [
        'letters' => 'Kata sandi harus mengandung minimal satu huruf.',
        'mixed' => 'Kata sandi harus mengandung huruf besar dan huruf kecil.',
        'numbers' => 'Kata sandi harus mengandung minimal satu angka.',
        'symbols' => 'Kata sandi harus mengandung minimal satu karakter spesial.',
    ],
];
