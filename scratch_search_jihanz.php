<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pdo = DB::connection()->getPdo();
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    $cols = $pdo->query("SHOW COLUMNS FROM `$table`")->fetchAll(PDO::FETCH_COLUMN);
    $where = [];
    foreach ($cols as $c) {
        $where[] = "`$c` LIKE '%jihanz%'";
    }
    $sql = "SELECT * FROM `$table` WHERE " . implode(' OR ', $where);
    try {
        $res = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($res)) {
            echo "FOUND IN TABLE: $table (" . count($res) . " rows)\n";
            print_r($res);
        }
    } catch (\Exception $e) {}
}
echo "Done search.\n";
