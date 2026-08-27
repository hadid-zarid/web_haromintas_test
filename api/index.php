<?php

// 1. Siapkan direktori /tmp untuk storage & cache sementara di serverless environment
$tmpDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/app/public',
    '/tmp/storage/app/temp',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($tmpDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// 2. Set Environment Variables runtime jika belum ditentukan
putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
putenv('APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php');
putenv('APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php');
putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');
putenv('APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes.php');
putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');

// 3. Setup SQLite database di /tmp jika menggunakan mode SQLite
$dbConnection = getenv('DB_CONNECTION') ?: ($_ENV['DB_CONNECTION'] ?? 'sqlite');
if ($dbConnection === 'sqlite') {
    $sqlitePath = '/tmp/database.sqlite';
    if (!file_exists($sqlitePath)) {
        $sourceSqlite = __DIR__ . '/../database/database.sqlite';
        if (file_exists($sourceSqlite) && filesize($sourceSqlite) > 0) {
            @copy($sourceSqlite, $sqlitePath);
        } else {
            @touch($sqlitePath);
        }
    }
    
    if (!getenv('DB_DATABASE')) {
        putenv("DB_DATABASE={$sqlitePath}");
        $_ENV['DB_DATABASE'] = $sqlitePath;
        $_SERVER['DB_DATABASE'] = $sqlitePath;
    }
}

// 4. Forward eksekusi ke Laravel Kernel entrypoint
require __DIR__ . '/../public/index.php';
