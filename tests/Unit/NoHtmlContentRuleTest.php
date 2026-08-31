<?php

namespace Tests\Unit;

use App\Rules\NoHtmlContent;
use PHPUnit\Framework\TestCase;

class NoHtmlContentRuleTest extends TestCase
{
    private NoHtmlContent $rule;

    protected function setUp(): void
    {
        parent::setUp();
        $this->rule = new NoHtmlContent();
    }

    /**
     * Test: Reject HTML tags
     */
    public function test_rejects_html_tags()
    {
        $reject = [
            '<script>alert(1)</script>',
            '<div>Hello</div>',
            '<span>test</span>',
            '<img src=x onerror=alert(1)>',
            '<svg onload=alert(1)>',
            '<iframe src="..."></iframe>',
            '<a href="javascript:alert(1)">Click</a>',
            '<b>text</b>',
            '<i>italic</i>',
            '<p>paragraph</p>',
        ];

        foreach ($reject as $payload) {
            $this->assertValidationFails($payload, "Should reject: {$payload}");
        }
    }

    /**
     * Test: Reject JavaScript protocol
     */
    public function test_rejects_javascript_protocol()
    {
        $reject = [
            'javascript:alert(1)',
            'JavaScript:void(0)',
            'JAVASCRIPT:alert(1)',
        ];

        foreach ($reject as $payload) {
            $this->assertValidationFails($payload, "Should reject: {$payload}");
        }
    }

    /**
     * Test: Reject event handlers
     */
    public function test_rejects_event_handlers()
    {
        $reject = [
            'onclick=alert(1)',
            'onerror=alert(1)',
            'onload=alert(1)',
            'onmouseover=alert(1)',
            'onchange=alert(1)',
        ];

        foreach ($reject as $payload) {
            $this->assertValidationFails($payload, "Should reject: {$payload}");
        }
    }

    /**
     * Test: Reject data: protocol
     */
    public function test_rejects_data_protocol()
    {
        $reject = [
            'data:text/html,<script>alert(1)</script>',
            'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        ];

        foreach ($reject as $payload) {
            $this->assertValidationFails($payload, "Should reject: {$payload}");
        }
    }

    /**
     * Test: Accept legitimate text
     */
    public function test_accepts_legitimate_text()
    {
        $accept = [
            'Project Harmonitas',
            'Project Harmonitas 2026',
            'PT. ABC & Partner',
            'Kegiatan Posbankum - Tahap 1',
            'Gedung A (Lantai 2)',
            'Rancangan Peraturan Daerah tentang Pengelolaan Keuangan',
            'Peraturan Kepala Daerah No. 12/2024',
            'Dokumen: Surat Keputusan (SK)',
            'Monitor kegiatan 2026',
            'Email: test@example.com',
            'Nomor: 2024/REG/HM',
        ];

        foreach ($accept as $payload) {
            $this->assertValidationPasses($payload, "Should accept: {$payload}");
        }
    }

    /**
     * Test: Reject null bytes
     */
    public function test_rejects_null_bytes()
    {
        $payload = "Test\x00Injection";
        $this->assertValidationFails($payload, "Should reject null bytes");
    }

    /**
     * Helper: Assert validation fails
     */
    private function assertValidationFails($value, $message = '')
    {
        $failed = false;
        $this->rule->validate('test_field', $value, function () use (&$failed) {
            $failed = true;
        });
        $this->assertTrue($failed, $message);
    }

    /**
     * Helper: Assert validation passes
     */
    private function assertValidationPasses($value, $message = '')
    {
        $failed = false;
        $this->rule->validate('test_field', $value, function () use (&$failed) {
            $failed = true;
        });
        $this->assertFalse($failed, $message);
    }
}
