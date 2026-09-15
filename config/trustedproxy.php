<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trusted Proxies
    |--------------------------------------------------------------------------
    |
    | Proxy/load balancer yang boleh dipercaya untuk meneruskan IP asli pengguna
    | lewat header X-Forwarded-For. Dipakai oleh rate limit login berbasis IP dan
    | kolom ip_address pada log audit.
    |
    | Default 100.64.0.0/10: jaringan internal edge proxy Railway. Rentang ini
    | tidak dipakai klien internet publik, sehingga aman juga di server lain.
    |
    | Jika aplikasi dipindah ke server lain di belakang reverse proxy / load
    | balancer / WAF, isi TRUSTED_PROXIES dengan IP atau CIDR proxy tersebut
    | (pisahkan dengan koma), mis. "10.10.1.5" atau "10.10.0.0/16".
    |
    | JANGAN isi "*": Laravel akan mempercayai semua IP sehingga header
    | X-Forwarded-For dapat dipalsukan untuk menghindari rate limit.
    |
    */

    'proxies' => env('TRUSTED_PROXIES', '100.64.0.0/10'),

];
