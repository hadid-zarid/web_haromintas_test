<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Custom Validation Rule: No HTML Content
 *
 * Rejects input containing HTML tags, JavaScript, and XSS payloads.
 * Allows safe punctuation like &, -, (), [], etc. for natural language.
 *
 * Examples that are REJECTED:
 * - <script>alert(1)</script>
 * - <div>Hello</div>
 * - <img src=x onerror=alert(1)>
 * - <svg onload=alert(1)>
 * - <iframe src="..."></iframe>
 * - <a href="javascript:alert(1)">Click</a>
 * - onclick=alert(1)
 * - onerror=alert(1)
 *
 * Examples that are ACCEPTED:
 * - Project Harmonitas
 * - PT. ABC & Partner
 * - Kegiatan Posbankum - Tahap 1
 * - Gedung A (Lantai 2)
 */
class NoHtmlContent implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        // Trim the value
        $value = trim($value);

        // Check 1: Detect HTML/XML tags (including nested and malformed)
        // Pattern covers: <anything...>
        if (preg_match('/<[^>]*>/i', $value)) {
            $fail("'{$attribute}' tidak boleh mengandung tag HTML atau markup.");
            return;
        }

        // Check 2: Detect JavaScript protocol
        if (preg_match('/javascript:/i', $value)) {
            $fail("'{$attribute}' tidak boleh mengandung javascript: protocol.");
            return;
        }

        // Check 3: Detect event handlers (on* attributes)
        // Covers: onclick, onerror, onload, onmouseover, etc.
        if (preg_match('/\bon\w+\s*=/i', $value)) {
            $fail("'{$attribute}' tidak boleh mengandung event handler (onclick, onerror, dll).");
            return;
        }

        // Check 4: Detect data: protocol (can execute scripts)
        if (preg_match('/data:text\/html/i', $value)) {
            $fail("'{$attribute}' tidak boleh mengandung data: protocol.");
            return;
        }

        // Check 5: Detect encoded HTML entities yang mencurigakan
        // Reject excessive HTML entity encoding (sign of obfuscation)
        if (preg_match('/&#x?[0-9a-f]+;/i', $value) && preg_match_all('/&#x?[0-9a-f]+;/i', $value) > 3) {
            $fail("'{$attribute}' tidak boleh mengandung encoded HTML entities yang mencurigakan.");
            return;
        }

        // Check 6: Detect null bytes (file path traversal attempt)
        if (strpos($value, "\x00") !== false) {
            $fail("'{$attribute}' mengandung karakter tidak valid.");
            return;
        }
    }
}
