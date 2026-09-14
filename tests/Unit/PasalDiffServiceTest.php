<?php

namespace Tests\Unit;

use App\Services\PasalDiffService;
use PHPUnit\Framework\TestCase;

class PasalDiffServiceTest extends TestCase
{
    private PasalDiffService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PasalDiffService();
    }

    public function test_split_into_pasal_separates_preamble_and_articles(): void
    {
        $text = <<<TEXT
        PERATURAN DAERAH TENTANG CONTOH
        Menimbang: a. bahwa ...

        Pasal 1
        Dalam Peraturan Daerah ini yang dimaksud dengan Pemerintah Daerah adalah ...

        Pasal 2
        Ruang lingkup pengaturan ini meliputi ...
        TEXT;

        $result = $this->service->splitIntoPasal($text);

        $this->assertStringContainsString('PERATURAN DAERAH TENTANG CONTOH', $result['preamble']);
        $this->assertCount(2, $result['pasal']);
        $this->assertSame('1', $result['pasal'][0]['nomor']);
        $this->assertSame('2', $result['pasal'][1]['nomor']);
        $this->assertStringContainsString('Pemerintah Daerah', $result['pasal'][0]['isi']);
    }

    /**
     * Regresi: rujukan silang di tengah kalimat seperti "sebagaimana dimaksud
     * dalam Pasal 2 huruf c" atau "Pasal 18 ayat (6) Undang-Undang Dasar ..."
     * TIDAK boleh dianggap heading Pasal baru — hanya baris yang isinya
     * PERSIS "Pasal N" saja yang dianggap heading. Sebelum diperbaiki, satu
     * Pasal asli bisa tercacah jadi banyak potongan palsu dengan nomor
     * berulang, dan isinya hilang dari hasil perbandingan.
     */
    public function test_split_into_pasal_ignores_in_text_cross_references(): void
    {
        $text = <<<TEXT
        Mengingat: Pasal 18 ayat (6) Undang-Undang Dasar Negara Republik Indonesia Tahun 1945;

        Pasal 5
        Luas wilayah Desa Bantan Tua sebagaimana dimaksud dalam Pasal 2 huruf c sebesar 27.11 Km2.
        Batas Wilayah Desa Bantan Tua sebagaimana dimaksud pada ayat (1) meliputi:
        a. lalu dilanjutkan mengarah ke Selatan sampai pada TK 001;
        b. lalu dilanjutkan mengarah ke Timur sampai pada TK 002;
        TEXT;

        $result = $this->service->splitIntoPasal($text);

        $this->assertCount(1, $result['pasal'], 'Rujukan "Pasal 2" di tengah kalimat tidak boleh membuat Pasal baru.');
        $this->assertSame('5', $result['pasal'][0]['nomor']);
        $this->assertStringContainsString('TK 002', $result['pasal'][0]['isi']);
        $this->assertStringContainsString('sebagaimana dimaksud dalam Pasal 2 huruf c', $result['pasal'][0]['isi']);
    }

    public function test_split_into_pasal_returns_empty_list_when_no_heading_found(): void
    {
        $result = $this->service->splitIntoPasal('Naskah tanpa struktur pasal sama sekali.');

        $this->assertSame([], $result['pasal']);
        $this->assertNotEmpty($result['preamble']);
    }

    public function test_diff_words_detects_word_level_change(): void
    {
        $ops = $this->service->diffWords(
            'Jangka waktu izin berlaku selama 30 hari kerja.',
            'Jangka waktu izin berlaku selama 60 hari kerja.'
        );

        // Satu baris yang berubah dibungkus sebagai satu entri 'modified'
        // berisi rincian kata di dalamnya (bukan dilebur ke level atas),
        // supaya struktur per-baris naskah asli tetap terjaga.
        $this->assertCount(1, $ops);
        $this->assertSame('modified', $ops[0]['type']);

        $wordOps = $ops[0]['ops'];
        $deleted = array_values(array_filter($wordOps, fn ($op) => $op['type'] === 'delete'));
        $inserted = array_values(array_filter($wordOps, fn ($op) => $op['type'] === 'insert'));

        $this->assertNotEmpty($deleted);
        $this->assertNotEmpty($inserted);
        $this->assertStringContainsString('30', $deleted[0]['text']);
        $this->assertStringContainsString('60', $inserted[0]['text']);
    }

    /**
     * Baris yang tidak berubah harus tetap jadi entri terpisah per baris
     * (bukan dilebur jadi satu paragraf panjang), supaya tampilan akhirnya
     * tetap terbaca seperti naskah asli yang berbutir/bernomor.
     */
    public function test_diff_words_keeps_unchanged_lines_separate_and_wraps_only_changed_line(): void
    {
        $textA = "a. Baris pertama tidak berubah.\nb. Baris kedua nilainya 30.\nc. Baris ketiga tidak berubah.";
        $textB = "a. Baris pertama tidak berubah.\nb. Baris kedua nilainya 60.\nc. Baris ketiga tidak berubah.";

        $ops = $this->service->diffWords($textA, $textB);

        $this->assertCount(3, $ops, 'Harus ada 3 entri baris, bukan dilebur jadi satu paragraf.');
        $this->assertSame('equal', $ops[0]['type']);
        $this->assertSame('a. Baris pertama tidak berubah.', $ops[0]['text']);
        $this->assertSame('modified', $ops[1]['type']);
        $this->assertSame('equal', $ops[2]['type']);
        $this->assertSame('c. Baris ketiga tidak berubah.', $ops[2]['text']);
    }

    public function test_diff_words_returns_all_equal_for_identical_text(): void
    {
        $ops = $this->service->diffWords('Teks yang sama persis.', 'Teks yang sama persis.');

        foreach ($ops as $op) {
            $this->assertSame('equal', $op['type']);
        }
    }

    public function test_align_and_diff_marks_changed_added_removed_and_unchanged_pasal(): void
    {
        $pasalA = [
            ['nomor' => '1', 'isi' => 'Isi pasal satu tidak berubah.'],
            ['nomor' => '2', 'isi' => 'Jangka waktu berlaku selama 30 hari.'],
            ['nomor' => '3', 'isi' => 'Pasal ini dihapus pada revisi.'],
        ];
        $pasalB = [
            ['nomor' => '1', 'isi' => 'Isi pasal satu tidak berubah.'],
            ['nomor' => '2', 'isi' => 'Jangka waktu berlaku selama 60 hari.'],
            ['nomor' => '4', 'isi' => 'Pasal baru ditambahkan Biro Hukum.'],
        ];

        $result = $this->service->alignAndDiff($pasalA, $pasalB);

        $byNomor = [];
        foreach ($result as $p) {
            $byNomor[$p['nomor']] = $p;
        }

        $this->assertSame('sama', $byNomor['1']['status']);
        $this->assertSame('diubah', $byNomor['2']['status']);
        $this->assertSame('dihapus', $byNomor['3']['status']);
        $this->assertSame('ditambahkan', $byNomor['4']['status']);

        // Urutan hasil harus terurut natural berdasarkan nomor Pasal
        $this->assertSame(['1', '2', '3', '4'], array_column($result, 'nomor'));
    }

    public function test_align_and_diff_sorts_natural_order_with_letter_suffix(): void
    {
        $pasalA = [
            ['nomor' => '2', 'isi' => 'Dua'],
            ['nomor' => '10', 'isi' => 'Sepuluh'],
            ['nomor' => '5A', 'isi' => 'Lima A'],
            ['nomor' => '5', 'isi' => 'Lima'],
        ];

        $result = $this->service->alignAndDiff($pasalA, $pasalA);

        $this->assertSame(['2', '5', '5A', '10'], array_column($result, 'nomor'));
    }

    public function test_compare_full_text_returns_summary_and_pasal(): void
    {
        $textA = "Pasal 1\nJangka waktu izin berlaku selama 30 hari kerja.";
        $textB = "Pasal 1\nJangka waktu izin berlaku selama 60 hari kerja.\n\nPasal 2\nKetentuan baru.";

        $result = $this->service->compareFullText($textA, $textB);

        $this->assertSame(2, $result['summary']['total_pasal']);
        $this->assertSame(1, $result['summary']['diubah']);
        $this->assertSame(1, $result['summary']['ditambahkan']);
        $this->assertCount(2, $result['pasal']);
    }

    public function test_compare_full_text_throws_when_no_pasal_structure_found_in_either_text(): void
    {
        $this->expectException(\RuntimeException::class);

        $this->service->compareFullText('Teks bebas tanpa struktur pasal.', 'Teks lain juga tanpa struktur.');
    }

    /**
     * Regresi: menghapus satu butir (mis. butir "d" dalam daftar titik batas
     * wilayah) tidak boleh "tersembunyi" hanya karena butir-butir lain punya
     * kalimat template yang mirip (kata "lalu dilanjutkan mengarah ke ...
     * Mengikuti Jalan Logging Perkebunan sampai pada TK ..." berulang).
     */
    public function test_diff_words_detects_deleted_line_among_similar_boilerplate_lines(): void
    {
        $textA = implode("\n", [
            'a. Dimulai dari TK 14.03.01 dengan koordinat 1 32 28 LU yang merupakan Titik simpul batas antara Desa Jangkang dan Desa Wonosari;',
            'b. lalu dilanjutkan mengarah ke Selatan Mengikuti Jalan Logging Perkebunan sampai pada TK 001 dengan koordinat 1 31 21 LU yang terletak pada Saluran;',
            'c. lalu dilanjutkan mengarah ke Timur Mengikuti Jalan Logging Perkebunan sampai pada TK 002 dengan koordinat 1 31 21 LU yang terletak pada Jalan perkebunan sawit;',
            'd. lalu dilanjutkan mengarah ke Selatan Mengikuti Jalan Logging Perkebunan sampai pada TK 003 dengan koordinat 1 31 18 LU yang terletak pada Jalan perkebunan sawit;',
        ]);

        // Butir d dihapus, butir a/b/c persis sama seperti sebelumnya.
        $textB = implode("\n", [
            'a. Dimulai dari TK 14.03.01 dengan koordinat 1 32 28 LU yang merupakan Titik simpul batas antara Desa Jangkang dan Desa Wonosari;',
            'b. lalu dilanjutkan mengarah ke Selatan Mengikuti Jalan Logging Perkebunan sampai pada TK 001 dengan koordinat 1 31 21 LU yang terletak pada Saluran;',
            'c. lalu dilanjutkan mengarah ke Timur Mengikuti Jalan Logging Perkebunan sampai pada TK 002 dengan koordinat 1 31 21 LU yang terletak pada Jalan perkebunan sawit;',
        ]);

        $ops = $this->service->diffWords($textA, $textB);

        $deleteOps = array_values(array_filter($ops, fn ($op) => $op['type'] === 'delete'));

        $this->assertNotEmpty($deleteOps, 'Butir d yang dihapus harus muncul sebagai operasi delete.');

        $deletedText = implode(' ', array_column($deleteOps, 'text'));
        $this->assertStringContainsString('TK 003', $deletedText);
        $this->assertStringContainsString('1 31 18', $deletedText);

        // Butir a, b, c tidak boleh ikut ditandai berubah karena identik persis.
        foreach ($ops as $op) {
            if ($op['type'] === 'equal') {
                continue;
            }
            $this->assertStringNotContainsString('TK 001', $op['text'] ?? '');
            $this->assertStringNotContainsString('TK 002', $op['text'] ?? '');
        }
    }
}
