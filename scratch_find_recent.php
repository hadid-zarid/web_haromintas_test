<?php
function findRecent($dir, $since) {
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)
    );
    foreach ($it as $file) {
        if ($file->isFile() && $file->getMTime() > $since) {
            $path = $file->getPathname();
            if (str_contains($path, '.git') || str_contains($path, 'node_modules') || str_contains($path, 'vendor') || str_contains($path, 'scratch_')) continue;
            echo date('Y-m-d H:i:s', $file->getMTime()) . " - " . $path . "\n";
        }
    }
}
findRecent('D:\INTERNSHIP', time() - 7200);
