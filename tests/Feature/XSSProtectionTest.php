<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Kabupaten;
use App\Models\TimKerja;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class XSSProtectionTest extends TestCase
{
    use RefreshDatabase;

    private User $timKerjaUser;
    private Kabupaten $kabupaten;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup: Create Tim Kerja
        $timKerja = TimKerja::create([
            'tim_kerja_id' => 1,
            'nama_tim_kerja' => 'Tim Kerja 1',
            'keterangan' => 'Test',
        ]);

        // Setup: Create Kabupaten
        $this->kabupaten = Kabupaten::create([
            'kabupaten_id' => 1,
            'nama_kabupaten' => 'Kabupaten Test',
            'tim_kerja_id' => 1,
        ]);

        // Setup: Create Tim Kerja User
        $this->timKerjaUser = User::create([
            'user_id' => 2,
            'nama' => 'Tim Kerja User',
            'email' => 'timkerja@test.com',
            'password' => bcrypt('password'),
            'role_id' => 2, // Tim Kerja
            'tim_kerja_id' => 1,
            'status' => 'ACTIVE',
        ]);
    }

    /**
     * Test: Reject HTML tags in judul_rancangan
     */
    public function test_reject_html_tags_in_judul_rancangan()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => '<script>alert(1)</script>Test',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
            'keterangan' => 'Test',
        ]);

        $response->assertSessionHasErrors(['judul_rancangan']);
    }

    /**
     * Test: Reject HTML tags in keterangan
     */
    public function test_reject_html_tags_in_keterangan()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => 'Test Regulasi',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
            'keterangan' => '<div>Malicious</div>',
        ]);

        $response->assertSessionHasErrors(['keterangan']);
    }

    /**
     * Test: Reject img tag with onerror
     */
    public function test_reject_img_onerror_in_judul()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => '<img src=x onerror=alert(1)>',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionHasErrors(['judul_rancangan']);
    }

    /**
     * Test: Reject javascript: protocol
     */
    public function test_reject_javascript_protocol()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => 'javascript:alert(1)',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionHasErrors(['judul_rancangan']);
    }

    /**
     * Test: Accept legitimate text with ampersand
     */
    public function test_accept_legitimate_text_with_ampersand()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => 'Rancangan Peraturan Daerah tentang PT. ABC & Partner',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
            'keterangan' => 'Kegiatan Posbankum - Tahap 1',
        ]);

        $response->assertSessionDoesntHaveErrors(['judul_rancangan', 'keterangan']);
    }

    /**
     * Test: Accept text with parentheses and hyphens
     */
    public function test_accept_text_with_parentheses()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => 'Gedung A (Lantai 2) - Peraturan 2026',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionDoesntHaveErrors(['judul_rancangan']);
    }

    /**
     * Test: Accept legitimate nomor_regulasi
     */
    public function test_accept_legitimate_nomor_regulasi()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => 'Test Regulasi',
            'nomor_regulasi' => '2024/REG/HM-001',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionDoesntHaveErrors(['nomor_regulasi']);
    }

    /**
     * Test: Reject SVG with onload
     */
    public function test_reject_svg_onload()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => '<svg onload=alert(1)>Test</svg>',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionHasErrors(['judul_rancangan']);
    }

    /**
     * Test: Reject iframe
     */
    public function test_reject_iframe()
    {
        $this->actingAs($this->timKerjaUser);

        $response = $this->post('/peraturan', [
            'judul_rancangan' => '<iframe src="http://evil.com"></iframe>',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => $this->kabupaten->kabupaten_id,
        ]);

        $response->assertSessionHasErrors(['judul_rancangan']);
    }
}
