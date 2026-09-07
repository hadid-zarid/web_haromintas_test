<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$sessions = DB::table('sessions')->orderBy('last_activity', 'desc')->take(5)->get();
foreach ($sessions as $s) {
    echo "Session ID: {$s->id} | User ID: {$s->user_id} | IP: {$s->ip_address} | Last Activity: " . date('Y-m-d H:i:s', $s->last_activity) . "\n";
}
