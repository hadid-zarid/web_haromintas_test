<?php

namespace App\Services;

final class PermohonanWorkflowService
{
    private const REQUIRED_HARMONISASI_DOCUMENTS = [1, 2, 3, 4, 5];

    private const REQUIRED_COMPLETION_DOCUMENTS = [1, 2, 3, 4, 5, 7];

    /**
     * @param  array<int, int|string>  $uploadedDocs
     */
    public static function isHarmonisasiComplete(array $uploadedDocs): bool
    {
        return self::containsRequiredDocs($uploadedDocs, self::REQUIRED_HARMONISASI_DOCUMENTS);
    }

    /**
     * Dokumen 6 (Matriks Hasil Fasilitasi) bersifat opsional.
     *
     * @param  array<int, int|string>  $uploadedDocs
     */
    public static function isFasilitasiComplete(array $uploadedDocs): bool
    {
        return self::containsRequiredDocs($uploadedDocs, self::REQUIRED_COMPLETION_DOCUMENTS);
    }

    /**
     * @param  array<int, int|string>  $uploadedDocs
     * @param  array<int, int>  $requiredDocs
     */
    private static function containsRequiredDocs(array $uploadedDocs, array $requiredDocs): bool
    {
        $normalizedDocs = array_map('intval', $uploadedDocs);

        return empty(array_diff($requiredDocs, $normalizedDocs));
    }
}

