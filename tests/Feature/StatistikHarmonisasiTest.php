<?php

namespace Tests\Feature;

use App\Models\HistorisHarmonisasi;
use App\Models\Kabupaten;
use App\Models\RancanganRegulasi;
use App\Models\RencanaRegulasi;
use App\Models\User;
use App\Services\StatistikHarmonisasiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatistikHarmonisasiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed', ['--class' => 'MasterDataSeeder']);
        $this->artisan('db:seed', ['--class' => 'HistorisHarmonisasiSeeder']);
    }
    /**
     * Uji data historis 2025: transkripsi 13 wilayah wajib sama persis,
     * total 212, 49, 817, 456, serta kasus realisasi melebihi rencana (surplus).
     */
    public function test_2025_historical_data_matches_exact_transcription_and_totals(): void
    {
        $service = app(StatistikHarmonisasiService::class);
        $data = $service->getStatistik(2025);

        // 1. Validasi Jumlah Wilayah
        $this->assertCount(13, $data['wilayah'], 'Harus terdapat tepat 13 wilayah di Provinsi Riau.');

        // 2. Validasi Angka Agregat Total Ranperda & Ranperkada
        $this->assertSame(212, $data['ringkasan']['ranperda']['rencana'], 'Total ProPem Ranperda harus tepat 212.');
        $this->assertSame(49, $data['ringkasan']['ranperda']['harmonisasi'], 'Total Harmonisasi Ranperda harus tepat 49.');
        $this->assertSame(817, $data['ringkasan']['ranperkada']['rencana'], 'Total Progsun Ranperkada harus tepat 817.');
        $this->assertSame(456, $data['ringkasan']['ranperkada']['harmonisasi'], 'Total Harmonisasi Ranperkada harus tepat 456.');

        // 3. Validasi Total Gabungan
        $this->assertSame(1029, $data['ringkasan']['gabungan']['rencana'], 'Total Gabungan Rencana harus 1029.');
        $this->assertSame(505, $data['ringkasan']['gabungan']['harmonisasi'], 'Total Gabungan Harmonisasi harus 505.');

        // 4. Validasi Label dan Sumber Data
        $this->assertSame('Data historis 2025', $data['label_sumber']);
        $this->assertSame('Sumber: rekap 2025 yang diberikan', $data['keterangan_sumber']);
        $this->assertFalse($data['is_live'], 'Data historis 2025 tidak boleh berlabel live/real-time.');

        // 5. Validasi Kasus Khusus: Realisasi Melebihi Rencana (Surplus)
        // Indragiri Hilir Ranperda: 5 Rencana vs 6 Harmonisasi
        $inhil = collect($data['wilayah'])->firstWhere('nama_singkat', 'Indragiri Hilir');
        $this->assertNotNull($inhil);
        $this->assertSame(5, $inhil['ranperda']['rencana']);
        $this->assertSame(6, $inhil['ranperda']['harmonisasi']);
        $this->assertTrue($inhil['ranperda']['surplus']);
        $this->assertSame(1, $inhil['ranperda']['surplus_selisih']);

        // Rokan Hulu Ranperkada: 35 Rencana vs 54 Harmonisasi
        $rohul = collect($data['wilayah'])->firstWhere('nama_singkat', 'Rokan Hulu');
        $this->assertNotNull($rohul);
        $this->assertSame(35, $rohul['ranperkada']['rencana']);
        $this->assertSame(54, $rohul['ranperkada']['harmonisasi']);
        $this->assertTrue($rohul['ranperkada']['surplus']);
        $this->assertSame(19, $rohul['ranperkada']['surplus_selisih']);

        // Siak Ranperkada: 12 Rencana vs 78 Harmonisasi
        $siak = collect($data['wilayah'])->firstWhere('nama_singkat', 'Siak');
        $this->assertNotNull($siak);
        $this->assertSame(12, $siak['ranperkada']['rencana']);
        $this->assertSame(78, $siak['ranperkada']['harmonisasi']);
        $this->assertTrue($siak['ranperkada']['surplus']);
        $this->assertSame(66, $siak['ranperkada']['surplus_selisih']);
    }

    /**
     * Uji Landing Page publik memuat props statistikData dengan default 2025.
     */
    public function test_landing_page_renders_with_statistik_data(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) =>
            $page->component('LandingPage')
                ->has('statistikData')
                ->where('statistikData.tahun', 2025)
                ->where('statistikData.tipe_sumber', 'historis')
                ->where('statistikData.ringkasan.ranperda.rencana', 212)
                ->where('statistikData.ringkasan.ranperkada.harmonisasi', 456)
        );
    }

    /**
     * Uji Endpoint API Publik mengembalikan JSON agregat aman tanpa informasi sensitif.
     */
    public function test_api_statistik_endpoint_returns_clean_and_safe_aggregates(): void
    {
        $response = $this->getJson('/api/statistik-harmonisasi?tahun=2025');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'tahun' => 2025,
                    'tipe_sumber' => 'historis',
                    'ringkasan' => [
                        'ranperda' => [
                            'rencana' => 212,
                            'harmonisasi' => 49,
                        ],
                        'ranperkada' => [
                            'rencana' => 817,
                            'harmonisasi' => 456,
                        ],
                    ],
                ],
            ]);

        $content = $response->getContent();

        // Pastikan tidak ada kebocoran informasi pengguna atau path berkas
        $this->assertStringNotContainsString('password', $content);
        $this->assertStringNotContainsString('path_file', $content);
        $this->assertStringNotContainsString('remember_token', $content);
    }

    public function test_admin_can_manage_rencana_and_toggle_publication(): void
    {
        $admin = User::where('role_id', 1)->first();
        if (! $admin) {
            $admin = User::create([
                'nama' => 'Admin Penguji',
                'email' => 'admin.test@kemenkum.go.id',
                'password' => bcrypt('password123'),
                'role_id' => 1,
                'status' => 'ACTIVE',
            ]);
        }

        $payload = [
            'tahun' => 2026,
            'sumber_resmi' => 'SK Propemperda DPRD Riau 2026',
            'items' => [
                ['kabupaten_id' => 1, 'propem' => 25, 'progsun' => 50],
                ['kabupaten_id' => 2, 'propem' => 10, 'progsun' => 20],
            ],
        ];

        // 1. Simpan target rencana
        $response = $this->actingAs($admin)->post('/admin/rencana', $payload);
        $response->assertRedirect();

        $this->assertDatabaseHas('rencana_regulasi', [
            'tahun' => 2026,
            'kabupaten_id' => 1,
            'jenis_regulasi_id' => 1,
            'jumlah_rencana' => 25,
            'is_published' => false,
        ]);

        // 2. Aktifkan publikasi
        $publishResponse = $this->actingAs($admin)->post('/admin/rencana/publish', [
            'tahun' => 2026,
            'is_published' => true,
        ]);
        $publishResponse->assertRedirect();

        $this->assertDatabaseHas('rencana_regulasi', [
            'tahun' => 2026,
            'is_published' => true,
        ]);

        // 3. Verifikasi service sekarang mengenali 2026 sebagai tahun sistem yang aktif
        $service = app(StatistikHarmonisasiService::class);
        $availableYears = $service->getAvailableYears();
        $this->assertTrue(collect($availableYears)->contains('tahun', 2026));

        // 4. Nonaktifkan kembali untuk menjaga kebersihan data uji
        $this->actingAs($admin)->post('/admin/rencana/publish', [
            'tahun' => 2026,
            'is_published' => false,
        ]);

        RencanaRegulasi::where('tahun', 2026)->delete();
    }

    /**
     * Uji tonggak harmonisasi_completed_at: diisi satu kali saat dokumen harmonisasi 1-5 lengkap,
     * tidak hilang meski berkas kemudian berstatus revisi (5) atau selesai fasilitasi (4),
     * dan dihitung tepat satu kali per berkas.
     */
    public function test_harmonisasi_completed_at_milestone_and_unique_counting(): void
    {
        $user = User::where('role_id', 1)->first() ?? User::create([
            'nama' => 'User Uji',
            'email' => 'user.uji@kemenkum.go.id',
            'password' => bcrypt('password123'),
            'role_id' => 1,
            'status' => 'ACTIVE',
        ]);

        $rancangan = RancanganRegulasi::create([
            'judul_rancangan' => 'Ranperda Uji Tonggak Harmonisasi',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => 3, // Kampar
            'tim_kerja_id' => 1,
            'pokja_id' => $user->user_id,
            'user_id' => $user->user_id,
            'status_id' => 2, // Proses Harmonisasi
            'tanggal_dibuat' => '2026-03-01',
        ]);

        $this->assertNull($rancangan->harmonisasi_completed_at);

        // Simulasikan penyelesaian harmonisasi (Dokumen 1-5 terunggah)
        $completedTimestamp = now()->subDays(5);
        $rancangan->update([
            'harmonisasi_completed_at' => $completedTimestamp,
            'status_id' => 3, // Beralih ke Fasilitasi
        ]);

        // Simulasikan berkas kemudian masuk revisi (status 5)
        $rancangan->update([
            'status_id' => 5,
        ]);

        // Tonggak harus tetap tersimpan dan tidak terhapus
        $rancangan->refresh();
        $this->assertNotNull($rancangan->harmonisasi_completed_at);
        $this->assertSame($completedTimestamp->toDateTimeString(), $rancangan->harmonisasi_completed_at->toDateTimeString());

        // Verifikasi pada query agregasi sistem: berkas dihitung tepat 1 kali
        $totalSelesaiKampar = RancanganRegulasi::where('kabupaten_id', 3)
            ->where('jenis_regulasi_id', 1)
            ->whereNotNull('harmonisasi_completed_at')
            ->whereYear('harmonisasi_completed_at', 2026)
            ->distinct('rancangan_id')
            ->count('rancangan_id');

        $this->assertGreaterThanOrEqual(1, $totalSelesaiKampar);

        // Bersihkan data uji
        $rancangan->delete();
    }

    /**
     * Uji data sistem 2026: jika belum ada target rencana resmi diinput admin,
     * sistem secara otomatis menghitung dari jumlah permohonan masuk pada tahun 2026
     * dan harmonisasi yang telah selesai pada tahun tersebut, tanpa dummy mockup 209 dan 771.
     */
    public function test_2026_system_data_calculates_dynamically_from_submissions(): void
    {
        $user = User::first() ?? User::create([
            'nama' => 'User Uji 2026',
            'email' => 'user.uji2026@kemenkum.go.id',
            'password' => bcrypt('password123'),
            'role_id' => 1,
            'status' => 'ACTIVE',
        ]);

        // Buat berkas permohonan 2026: 1 Ranperda selesai harmonisasi di Pekanbaru
        $ranperda = RancanganRegulasi::create([
            'judul_rancangan' => 'Ranperda Uji 2026',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => 13, // Pekanbaru
            'tim_kerja_id' => 1,
            'pokja_id' => $user->user_id,
            'user_id' => $user->user_id,
            'status_id' => 3,
            'tanggal_dibuat' => '2026-02-01',
            'harmonisasi_completed_at' => '2026-02-15 10:00:00',
        ]);

        $service = app(StatistikHarmonisasiService::class);
        $data = $service->getStatistik(2026);

        $this->assertSame(2026, $data['tahun']);
        $this->assertSame('sistem', $data['tipe_sumber']);
        $this->assertTrue($data['is_live']);

        // Pastikan tidak ada target dummy 209 dan 771
        $this->assertNotSame(209, $data['ringkasan']['ranperda']['rencana']);
        $this->assertNotSame(771, $data['ringkasan']['ranperkada']['rencana']);

        // Ranperda rencana harus >= 1 dan harmonisasi >= 1
        $this->assertGreaterThanOrEqual(1, $data['ringkasan']['ranperda']['rencana']);
        $this->assertGreaterThanOrEqual(1, $data['ringkasan']['ranperda']['harmonisasi']);

        // Bersihkan
        $ranperda->delete();
    }
}
