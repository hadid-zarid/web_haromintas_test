<?php

namespace App\Services;

use RuntimeException;

/**
 * Memecah naskah regulasi menjadi Pasal-per-Pasal, lalu membandingkan isi
 * Pasal antara dua naskah (mis. Draft Rancangan vs Draft Hasil Harmonisasi)
 * memakai diff kata berbasis Longest Common Subsequence (LCS) — deterministik,
 * tanpa LLM, supaya hasil "apa yang berubah" bisa diaudit dan tidak berisiko
 * halusinasi.
 */
class PasalDiffService
{
    // Heading "Pasal N" HARUS berdiri sendiri di satu baris/paragraf (format baku
    // penyusunan peraturan perundang-undangan — lihat Lampiran II UU 12/2011).
    // Sengaja tidak memakai pola "cari 'Pasal N' di mana saja", karena naskah
    // hukum penuh rujukan silang di tengah kalimat seperti "sebagaimana dimaksud
    // dalam Pasal 2 huruf c" atau "Pasal 18 ayat (6) Undang-Undang Dasar ...".
    // Kalau rujukan semacam itu ikut dianggap heading baru, satu Pasal asli bisa
    // "tercacah" jadi puluhan potongan palsu dengan nomor yang sama berulang,
    // dan isi Pasal yang sesungguhnya jadi hilang dari hasil perbandingan.
    private const PASAL_HEADING_PATTERN = '/^Pasal\s+(\d{1,4}[A-Za-z]?)\s*$/u';

    /**
     * Pecah teks naskah menjadi bagian pembukaan (sebelum Pasal 1) dan daftar Pasal.
     *
     * @return array{preamble: string, pasal: array<int, array{nomor: string, isi: string}>}
     */
    public function splitIntoPasal(string $text): array
    {
        $normalized = $this->normalizeWhitespace($text);
        $lines = explode("\n", $normalized);

        $preambleLines = [];
        $pasal = [];
        $currentNomor = null;
        $currentLines = [];

        foreach ($lines as $line) {
            if (preg_match(self::PASAL_HEADING_PATTERN, trim($line), $m)) {
                if ($currentNomor !== null) {
                    $pasal[] = [
                        'nomor' => $currentNomor,
                        // Isi Pasal terakhir turut memuat bagian penutup naskah
                        // (ditetapkan di.../tanda tangan) karena tidak diawali
                        // heading "Pasal" baru — dibiarkan apa adanya supaya
                        // tidak ada teks yang hilang dari perbandingan.
                        'isi' => trim(implode("\n", $currentLines)),
                    ];
                }

                $currentNomor = $m[1];
                $currentLines = [];
                continue;
            }

            if ($currentNomor === null) {
                $preambleLines[] = $line;
            } else {
                $currentLines[] = $line;
            }
        }

        if ($currentNomor !== null) {
            $pasal[] = [
                'nomor' => $currentNomor,
                'isi' => trim(implode("\n", $currentLines)),
            ];
        }

        return [
            'preamble' => trim(implode("\n", $preambleLines)),
            'pasal' => $pasal,
        ];
    }

    /**
     * Pipeline lengkap: pecah dua naskah mentah menjadi Pasal, cocokkan, hitung
     * diff & ringkasan statistik. Dipakai bersama oleh controller perbandingan
     * dokumen resmi maupun tester mandiri, supaya logikanya satu tempat saja.
     *
     * @return array{summary: array{total_pasal:int, sama:int, diubah:int, ditambahkan:int, dihapus:int}, pasal: array<int, array>}
     */
    public function compareFullText(string $textA, string $textB): array
    {
        $splitA = $this->splitIntoPasal($textA);
        $splitB = $this->splitIntoPasal($textB);

        if (empty($splitA['pasal']) && empty($splitB['pasal'])) {
            throw new RuntimeException(
                'Tidak ditemukan struktur "Pasal" pada kedua dokumen. Pastikan naskah memakai penomoran "Pasal 1", "Pasal 2", dst. secara eksplisit.'
            );
        }

        $pasalResult = $this->alignAndDiff($splitA['pasal'], $splitB['pasal']);

        $summary = [
            'total_pasal' => count($pasalResult),
            'sama' => 0,
            'diubah' => 0,
            'ditambahkan' => 0,
            'dihapus' => 0,
        ];
        foreach ($pasalResult as $p) {
            $summary[$p['status']]++;
        }

        return [
            'summary' => $summary,
            'pasal' => $pasalResult,
        ];
    }

    /**
     * Gabungkan (align) daftar Pasal Dokumen A & Dokumen B berdasarkan nomor Pasal,
     * lalu hitung status & diff kata untuk tiap Pasal yang berpasangan.
     *
     * @param array<int, array{nomor: string, isi: string}> $pasalA
     * @param array<int, array{nomor: string, isi: string}> $pasalB
     * @return array<int, array>
     */
    public function alignAndDiff(array $pasalA, array $pasalB): array
    {
        $mapA = [];
        foreach ($pasalA as $p) {
            $mapA[$this->normalizeNomor($p['nomor'])] = $p;
        }

        $mapB = [];
        foreach ($pasalB as $p) {
            $mapB[$this->normalizeNomor($p['nomor'])] = $p;
        }

        $allKeys = array_unique(array_merge(array_keys($mapA), array_keys($mapB)));
        usort($allKeys, fn ($a, $b) => $this->comparePasalKey($a, $b));

        $result = [];
        foreach ($allKeys as $key) {
            $a = $mapA[$key] ?? null;
            $b = $mapB[$key] ?? null;

            if ($a && $b) {
                $ops = $this->diffWords($a['isi'], $b['isi']);
                $isChanged = false;
                foreach ($ops as $op) {
                    if ($op['type'] !== 'equal') {
                        $isChanged = true;
                        break;
                    }
                }

                $result[] = [
                    'nomor' => $a['nomor'],
                    'status' => $isChanged ? 'diubah' : 'sama',
                    'isi_a' => $a['isi'],
                    'isi_b' => $b['isi'],
                    'diff' => $ops,
                ];
            } elseif ($a && ! $b) {
                $result[] = [
                    'nomor' => $a['nomor'],
                    'status' => 'dihapus',
                    'isi_a' => $a['isi'],
                    'isi_b' => null,
                    'diff' => null,
                ];
            } else {
                $result[] = [
                    'nomor' => $b['nomor'],
                    'status' => 'ditambahkan',
                    'isi_a' => null,
                    'isi_b' => $b['isi'],
                    'diff' => null,
                ];
            }
        }

        return $result;
    }

    /**
     * Diff dua isi Pasal dalam dua tingkat:
     *   1. Level baris/butir (tiap paragraf, mis. butir a/b/c/d) dibandingkan
     *      sebagai unit utuh lebih dulu — persis seperti `git diff` per baris.
     *   2. Baru untuk pasangan baris yang benar-benar berubah, dibedah lagi
     *      per kata (LCS) untuk menyorot bagian yang berbeda.
     *
     * Ini SENGAJA tidak langsung diff kata atas seluruh isi Pasal sekaligus,
     * karena naskah hukum sering punya kalimat template berulang (mis. daftar
     * titik koordinat batas wilayah butir a/b/c/d yang mirip). Kalau langsung
     * di-diff per kata, LCS bisa salah mencocokkan kata dari butir yang
     * dihapus ke kata identik di butir lain, sehingga penghapusan itu jadi
     * tidak kelihatan. Membandingkan per baris dulu menghindari salah-cocok
     * itu karena tiap baris dibandingkan sebagai teks utuh, bukan kata lepas.
     *
     * Setiap elemen hasil merepresentasikan SATU BARIS/BUTIR asli (bukan
     * dilebur jadi satu paragraf panjang), supaya tampilan akhirnya tetap
     * terbaca seperti naskah asli yang berbaris/bernomor, bukan blok teks
     * yang membingungkan. Baris yang isinya berubah ditandai `type: 'modified'`
     * dengan rincian kata di dalam `ops`.
     *
     * @return array<int, array{type: 'equal'|'delete'|'insert', text: string}|array{type: 'modified', ops: array<int, array{type: string, text?: string, text_a?: string, text_b?: string}>}>
     */
    public function diffWords(string $textA, string $textB): array
    {
        $linesA = $this->splitLines($textA);
        $linesB = $this->splitLines($textB);

        if (empty($linesA) && empty($linesB)) {
            return [];
        }

        $lineOps = $this->diffLines($linesA, $linesB);

        return $this->refineLineOps($lineOps);
    }

    /**
     * @return array<int, string>
     */
    private function splitLines(string $text): array
    {
        $lines = preg_split('/\n+/u', trim($text));
        $lines = array_map('trim', $lines);

        return array_values(array_filter($lines, fn ($line) => $line !== ''));
    }

    /**
     * Diff dua daftar baris sebagai unit atomik (LCS berbasis kesamaan baris
     * utuh, bukan kata) — lihat penjelasan lengkap di docblock diffWords().
     *
     * @param array<int, string> $linesA
     * @param array<int, string> $linesB
     * @return array<int, array{type: 'equal'|'delete'|'insert', text: string}>
     */
    private function diffLines(array $linesA, array $linesB): array
    {
        $n = count($linesA);
        $m = count($linesB);

        $lcs = array_fill(0, $n + 1, array_fill(0, $m + 1, 0));
        for ($i = $n - 1; $i >= 0; $i--) {
            for ($j = $m - 1; $j >= 0; $j--) {
                $lcs[$i][$j] = $linesA[$i] === $linesB[$j]
                    ? $lcs[$i + 1][$j + 1] + 1
                    : max($lcs[$i + 1][$j], $lcs[$i][$j + 1]);
            }
        }

        $ops = [];
        $i = 0;
        $j = 0;
        while ($i < $n && $j < $m) {
            if ($linesA[$i] === $linesB[$j]) {
                $ops[] = ['type' => 'equal', 'text' => $linesA[$i]];
                $i++;
                $j++;
            } elseif ($lcs[$i + 1][$j] >= $lcs[$i][$j + 1]) {
                $ops[] = ['type' => 'delete', 'text' => $linesA[$i]];
                $i++;
            } else {
                $ops[] = ['type' => 'insert', 'text' => $linesB[$j]];
                $j++;
            }
        }
        while ($i < $n) {
            $ops[] = ['type' => 'delete', 'text' => $linesA[$i]];
            $i++;
        }
        while ($j < $m) {
            $ops[] = ['type' => 'insert', 'text' => $linesB[$j]];
            $j++;
        }

        return $ops;
    }

    /**
     * Pasangkan blok delete+insert baris yang berurutan (kemungkinan besar
     * baris yang sama tapi diedit) untuk dibedah lagi per kata (dibungkus
     * sebagai satu baris `type: 'modified'`); baris yang murni hilang atau
     * murni baru tanpa pasangan tetap ditampilkan utuh satu baris supaya
     * jelas itu satu butir yang hilang/muncul, bukan sekadar beberapa kata
     * berubah. Setiap baris tetap jadi elemen terpisah (tidak dilebur jadi
     * satu paragraf) supaya struktur baris/butir asli naskah tetap terjaga.
     *
     * @param array<int, array{type: string, text: string}> $lineOps
     * @return array<int, array{type: 'equal'|'delete'|'insert', text: string}|array{type: 'modified', ops: array}>
     */
    private function refineLineOps(array $lineOps): array
    {
        $result = [];
        $i = 0;
        $count = count($lineOps);

        while ($i < $count) {
            if ($lineOps[$i]['type'] !== 'delete') {
                $result[] = $lineOps[$i];
                $i++;
                continue;
            }

            $deletes = [];
            while ($i < $count && $lineOps[$i]['type'] === 'delete') {
                $deletes[] = $lineOps[$i]['text'];
                $i++;
            }

            $inserts = [];
            while ($i < $count && $lineOps[$i]['type'] === 'insert') {
                $inserts[] = $lineOps[$i]['text'];
                $i++;
            }

            $pairCount = min(count($deletes), count($inserts));
            for ($k = 0; $k < $pairCount; $k++) {
                $wordOps = $this->diffWordTokens(
                    $this->tokenize($deletes[$k]),
                    $this->tokenize($inserts[$k])
                );
                $result[] = ['type' => 'modified', 'ops' => $wordOps];
            }
            for ($k = $pairCount; $k < count($deletes); $k++) {
                $result[] = ['type' => 'delete', 'text' => $deletes[$k]];
            }
            for ($k = $pairCount; $k < count($inserts); $k++) {
                $result[] = ['type' => 'insert', 'text' => $inserts[$k]];
            }
        }

        return $result;
    }

    /**
     * Diff kata (word-level) murni berbasis Longest Common Subsequence,
     * dipakai untuk membedah sepasang baris yang berubah (lihat refineLineOps()).
     *
     * @param array<int, string> $tokensA
     * @param array<int, string> $tokensB
     * @return array<int, array{type: 'equal'|'delete'|'insert'|'replace', text?: string, text_a?: string, text_b?: string}>
     */
    private function diffWordTokens(array $tokensA, array $tokensB): array
    {
        $n = count($tokensA);
        $m = count($tokensB);

        if ($n === 0 && $m === 0) {
            return [];
        }

        // Guard rail: hindari tabel DP O(n*m) membengkak untuk satu baris yang
        // sangat panjang (mis. Pasal tanpa jeda paragraf sama sekali).
        if ($n * $m > 400000) {
            $equal = $tokensA === $tokensB;

            return [$equal
                ? ['type' => 'equal', 'text' => implode(' ', $tokensA)]
                : ['type' => 'replace', 'text_a' => implode(' ', $tokensA), 'text_b' => implode(' ', $tokensB)],
            ];
        }

        $lcs = array_fill(0, $n + 1, array_fill(0, $m + 1, 0));
        for ($i = $n - 1; $i >= 0; $i--) {
            for ($j = $m - 1; $j >= 0; $j--) {
                $lcs[$i][$j] = $tokensA[$i] === $tokensB[$j]
                    ? $lcs[$i + 1][$j + 1] + 1
                    : max($lcs[$i + 1][$j], $lcs[$i][$j + 1]);
            }
        }

        $ops = [];
        $i = 0;
        $j = 0;
        while ($i < $n && $j < $m) {
            if ($tokensA[$i] === $tokensB[$j]) {
                $ops[] = ['type' => 'equal', 'text' => $tokensA[$i]];
                $i++;
                $j++;
            } elseif ($lcs[$i + 1][$j] >= $lcs[$i][$j + 1]) {
                $ops[] = ['type' => 'delete', 'text' => $tokensA[$i]];
                $i++;
            } else {
                $ops[] = ['type' => 'insert', 'text' => $tokensB[$j]];
                $j++;
            }
        }
        while ($i < $n) {
            $ops[] = ['type' => 'delete', 'text' => $tokensA[$i]];
            $i++;
        }
        while ($j < $m) {
            $ops[] = ['type' => 'insert', 'text' => $tokensB[$j]];
            $j++;
        }

        return $this->mergeConsecutiveOps($ops);
    }

    private function normalizeWhitespace(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return $text;
    }

    private function normalizeNomor(string $nomor): string
    {
        return strtoupper(trim($nomor));
    }

    /**
     * Urutkan nomor Pasal secara alami: 2 < 5 < 5A < 10 (bukan urutan string biasa
     * yang akan menempatkan "10" sebelum "2").
     */
    private function comparePasalKey(string $a, string $b): int
    {
        preg_match('/^(\d+)([A-Za-z]*)$/', $a, $matchA);
        preg_match('/^(\d+)([A-Za-z]*)$/', $b, $matchB);

        $numA = isset($matchA[1]) ? (int) $matchA[1] : 0;
        $numB = isset($matchB[1]) ? (int) $matchB[1] : 0;

        if ($numA !== $numB) {
            return $numA <=> $numB;
        }

        return strcmp($matchA[2] ?? '', $matchB[2] ?? '');
    }

    /**
     * @return array<int, string>
     */
    private function tokenize(string $text): array
    {
        $text = trim($text);
        if ($text === '') {
            return [];
        }

        return preg_split('/\s+/u', $text);
    }

    /**
     * @param array<int, array{type: string, text: string}> $ops
     * @return array<int, array{type: string, text: string}>
     */
    private function mergeConsecutiveOps(array $ops): array
    {
        $merged = [];
        foreach ($ops as $op) {
            $lastIndex = count($merged) - 1;
            if ($lastIndex >= 0 && $merged[$lastIndex]['type'] === $op['type']) {
                $merged[$lastIndex]['text'] .= ' ' . $op['text'];
            } else {
                $merged[] = $op;
            }
        }

        return $merged;
    }
}
