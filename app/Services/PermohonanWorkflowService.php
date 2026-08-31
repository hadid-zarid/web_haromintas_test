<?php

namespace App\Services;

final class PermohonanWorkflowService
{
    private const REQUIRED_HARMONISASI_SLOTS = [1, 2, 3, 4, 5];

    private const REQUIRED_COMPLETION_SLOTS = [1, 2, 3, 4, 5, 7];

    /**
     * @param  array<int, int|string>  $uploadedSlots
     */
    public static function isHarmonisasiComplete(array $uploadedSlots): bool
    {
        return self::containsRequiredSlots($uploadedSlots, self::REQUIRED_HARMONISASI_SLOTS);
    }

    /**
     * Slot 6 (Matriks Hasil Fasilitasi) bersifat opsional.
     *
     * @param  array<int, int|string>  $uploadedSlots
     */
    public static function isFasilitasiComplete(array $uploadedSlots): bool
    {
        return self::containsRequiredSlots($uploadedSlots, self::REQUIRED_COMPLETION_SLOTS);
    }

    /**
     * @param  array<int, int|string>  $uploadedSlots
     * @param  array<int, int>  $requiredSlots
     */
    private static function containsRequiredSlots(array $uploadedSlots, array $requiredSlots): bool
    {
        $normalizedSlots = array_map('intval', $uploadedSlots);

        return empty(array_diff($requiredSlots, $normalizedSlots));
    }
}
