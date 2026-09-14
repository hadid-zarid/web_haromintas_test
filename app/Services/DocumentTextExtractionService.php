<?php

namespace App\Services;

use RuntimeException;
use Smalot\PdfParser\Parser as PdfParser;
use ZipArchive;

/**
 * Ekstraksi teks polos dari berkas naskah regulasi (DOCX/PDF) untuk keperluan
 * analisis lanjutan seperti perbandingan Pasal-per-Pasal.
 */
class DocumentTextExtractionService
{
    public function extractFromPath(string $absolutePath): string
    {
        if (! file_exists($absolutePath)) {
            throw new RuntimeException("Berkas tidak ditemukan: {$absolutePath}");
        }

        $ext = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));

        return match ($ext) {
            'docx' => $this->extractFromDocx($absolutePath),
            'pdf' => $this->extractFromPdf($absolutePath),
            'doc' => throw new RuntimeException(
                'Format .doc lama belum didukung untuk perbandingan otomatis. Silakan unggah ulang naskah dalam format DOCX atau PDF.'
            ),
            default => throw new RuntimeException("Format berkas '.{$ext}' tidak didukung untuk perbandingan otomatis."),
        };
    }

    /**
     * Ekstraksi teks dari DOCX dengan membaca langsung word/document.xml
     * (tanpa dependency tambahan), konsisten dengan pola yang sudah dipakai
     * pada fitur generate surat di routes/web.php.
     */
    private function extractFromDocx(string $path): string
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new RuntimeException('Gagal membuka berkas DOCX (bukan format ZIP yang valid atau berkas rusak).');
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();

        if ($xml === false) {
            throw new RuntimeException('Gagal membaca isi document.xml dari berkas DOCX.');
        }

        // Ganti penanda akhir paragraf, tab, dan line-break Word menjadi whitespace
        // nyata SEBELUM tag XML dibuang, agar batas antar-Pasal tidak ikut hilang
        // saat teks digabung menjadi satu string polos.
        $xml = str_replace('</w:p>', "\n", $xml);
        $xml = preg_replace('/<w:tab\s*\/>/', "\t", $xml);
        $xml = preg_replace('/<w:br\s*\/>/', "\n", $xml);

        $text = strip_tags($xml);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');

        return trim($text);
    }

    private function extractFromPdf(string $path): string
    {
        try {
            $parser = new PdfParser();
            $document = $parser->parseFile($path);

            return trim($document->getText());
        } catch (\Throwable $e) {
            throw new RuntimeException('Gagal mengekstrak teks dari berkas PDF: ' . $e->getMessage());
        }
    }
}
