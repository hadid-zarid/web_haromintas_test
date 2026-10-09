<?php

namespace Tests\Feature;

use App\Models\HistorisHarmonisasi;
use App\Models\Kabupaten;
use App\Models\RekapTahun;
use App\Models\User;
use App\Services\StatistikHarmonisasiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StatistikHarmonisasiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed', ['--class' => 'MasterDataSeeder']);
        $this->artisan('db:seed', ['--class' => 'HistorisHarmonisasiSeeder']);

        $this->admin = User::factory()->create(['role_id' => 1]);
    }

    /**
     * 13 wilayah dengan angka yang sama untuk dikirim ke form admin.
     */
    private function items(array $angka = ['propem' => 2, 'harm_ranperda' => 1, 'progsun' => 3, 'harm_ranperkada' => 4]): array
    {
        return Kabupaten::pluck('kabupaten_id')
            ->map(fn ($id) => ['kabupaten_id' => $id, ...$angka])
            ->all();
    }

    private function buatTahun(int $tahun)
    {
        return $this->actingAs($this->admin)->post('/admin/rencana/tahun', ['tahun' => $tahun]);
    }

    private function simpan(int $tahun, ?array $items = null)
    {
        return $this->actingAs($this->admin)->put("/admin/rencana/{$tahun}", [
            'sumber' => "Rekap Kanwil {$tahun}",
            'items' => $items ?? $this->items(),
        ]);
    }

    private function publikasi(int $tahun, bool $tayang)
    {
        return $this->actingAs($this->admin)->put("/admin/rencana/{$tahun}/publikasi", ['is_published' => $tayang]);
    }

    /**
     * Data 2025: transkripsi 13 wilayah wajib sama persis dengan rekap Excel,
     * total 212, 49, 817, 456, serta kasus realisasi melebihi rencana (surplus).
     */
    public function test_2025_historical_data_matches_exact_transcription_and_totals(): void
    {
        $data = app(StatistikHarmonisasiService::class)->getStatistik(2025);

        $this->assertCount(13, $data['wilayah']);
        $this->assertSame(212, $data['ringkasan']['ranperda']['rencana']);
        $this->assertSame(49, $data['ringkasan']['ranperda']['harmonisasi']);
        $this->assertSame(817, $data['ringkasan']['ranperkada']['rencana']);
        $this->assertSame(456, $data['ringkasan']['ranperkada']['harmonisasi']);
        $this->assertSame(1029, $data['ringkasan']['gabungan']['rencana']);
        $this->assertSame(505, $data['ringkasan']['gabungan']['harmonisasi']);
        $this->assertSame('Sumber: rekap 2025 yang diberikan', $data['keterangan_sumber']);

        // Urutan baku rekap: Kampar pertama, Provinsi Riau terakhir
        $this->assertSame('Kampar', $data['wilayah'][0]['nama_singkat']);
        $this->assertSame('Provinsi Riau', $data['wilayah'][12]['nama_singkat']);

        $surplus = [
            'Indragiri Hilir' => ['ranperda', 5, 6, 1],
            'Rokan Hulu' => ['ranperkada', 35, 54, 19],
            'Siak' => ['ranperkada', 12, 78, 66],
        ];
        foreach ($surplus as $nama => [$jenis, $rencana, $harm, $selisih]) {
            $w = collect($data['wilayah'])->firstWhere('nama_singkat', $nama);
            $this->assertSame($rencana, $w[$jenis]['rencana'], $nama);
            $this->assertSame($harm, $w[$jenis]['harmonisasi'], $nama);
            $this->assertTrue($w[$jenis]['surplus'], $nama);
            $this->assertSame($selisih, $w[$jenis]['surplus_selisih'], $nama);
        }
    }

    public function test_landing_page_renders_with_statistik_data(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('LandingPage')
            ->where('statistikData.tahun', 2025)
            ->where('statistikData.ringkasan.ranperda.rencana', 212)
            ->where('statistikData.ringkasan.ranperkada.harmonisasi', 456)
            ->where('statistikData.available_years', [['tahun' => 2025, 'label' => 'Tahun 2025']])
        );
    }

    public function test_api_statistik_endpoint_returns_clean_and_safe_aggregates(): void
    {
        $response = $this->getJson('/api/statistik-harmonisasi?tahun=2025')
            ->assertOk()
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'tahun' => 2025,
                    'ringkasan' => [
                        'ranperda' => ['rencana' => 212, 'harmonisasi' => 49],
                        'ranperkada' => ['rencana' => 817, 'harmonisasi' => 456],
                    ],
                ],
            ]);

        $content = $response->getContent();
        $this->assertStringNotContainsString('password', $content);
        $this->assertStringNotContainsString('path_file', $content);
        $this->assertStringNotContainsString('remember_token', $content);
    }

    public function test_tahun_draf_tidak_bocor_ke_landing_maupun_api(): void
    {
        $this->buatTahun(2026)->assertRedirect()->assertSessionHasNoErrors();
        $this->simpan(2026, $this->items(['propem' => 7, 'harm_ranperda' => 7, 'progsun' => 7, 'harm_ranperkada' => 7]));

        $this->getJson('/api/statistik-harmonisasi?tahun=2026')
            ->assertOk()
            ->assertJsonPath('data.tahun', 2025)
            ->assertJsonPath('data.available_years', [['tahun' => 2025, 'label' => 'Tahun 2025']]);
    }

    public function test_alur_admin_buat_isi_tayangkan_dan_jadikan_tampil_pertama(): void
    {
        $this->buatTahun(2026)->assertRedirect(route('admin.rencana.index', ['tahun' => 2026]));
        $this->assertDatabaseHas('rekap_statistik_tahun', ['tahun' => 2026, 'is_published' => false, 'is_default' => false]);

        $this->simpan(2026)->assertRedirect()->assertSessionHasNoErrors();
        $this->assertSame(26, HistorisHarmonisasi::where('tahun', 2026)->count());

        $this->publikasi(2026, true)->assertSessionHasNoErrors();
        $this->actingAs($this->admin)->put('/admin/rencana/2026/utama')->assertSessionHasNoErrors();

        $this->assertFalse(RekapTahun::find(2025)->is_default);
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('statistikData.tahun', 2026)
            ->where('statistikData.keterangan_sumber', 'Sumber: Rekap Kanwil 2026')
            ->where('statistikData.ringkasan.ranperda.rencana', 26)
            ->where('statistikData.ringkasan.ranperkada.harmonisasi', 52)
            ->where('statistikData.available_years.0.tahun', 2026)
            ->where('statistikData.available_years.1.tahun', 2025)
        );

        // 2025 tetap bisa dipilih pengunjung
        $this->getJson('/api/statistik-harmonisasi?tahun=2025')->assertJsonPath('data.ringkasan.ranperda.rencana', 212);

        foreach (['REKAP_TAHUN_CREATE', 'REKAP_UPDATE', 'REKAP_PUBLISH', 'REKAP_SET_UTAMA'] as $aksi) {
            $this->assertDatabaseHas('audit_logs', ['action' => $aksi, 'target_id' => '2026', 'user_id' => $this->admin->user_id]);
        }
    }

    public function test_admin_bisa_mengedit_angka_2025(): void
    {
        $items = collect($this->items())->map(fn ($it) => $it['kabupaten_id'] === 3 ? [...$it, 'propem' => 31] : $it)->all();
        $this->simpan(2025, $items)->assertSessionHasNoErrors();

        $kampar = collect(app(StatistikHarmonisasiService::class)->getStatistik(2025)['wilayah'])->firstWhere('kabupaten_id', 3);
        $this->assertSame(31, $kampar['ranperda']['rencana']);
    }

    public function test_aksi_yang_melanggar_aturan_ditolak(): void
    {
        // Tahun tampil pertama tidak boleh ditarik
        $this->publikasi(2025, false)->assertSessionHasErrors('rekap');
        $this->assertTrue(RekapTahun::find(2025)->is_published);

        // Tahun tanpa angka tidak boleh ditayangkan
        $this->buatTahun(2026);
        $this->publikasi(2026, true)->assertSessionHasErrors('rekap');

        // Draf tidak boleh dijadikan tampil pertama
        $this->actingAs($this->admin)->put('/admin/rencana/2026/utama')->assertSessionHasErrors('rekap');

        // Tahun yang tayang tidak boleh dihapus
        $this->actingAs($this->admin)->delete('/admin/rencana/2025')->assertSessionHasErrors('rekap');
        $this->assertDatabaseHas('rekap_statistik_tahun', ['tahun' => 2025]);

        // Tahun ganda dan di luar rentang ditolak
        $this->buatTahun(2026)->assertSessionHasErrors('tahun');
        $this->buatTahun(2019)->assertSessionHasErrors('tahun');
        $this->buatTahun(now()->year + 2)->assertSessionHasErrors('tahun');

        // Draf boleh dihapus beserta angkanya
        $this->simpan(2026);
        $this->actingAs($this->admin)->delete('/admin/rencana/2026')->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('rekap_statistik_tahun', ['tahun' => 2026]);
        $this->assertSame(0, HistorisHarmonisasi::where('tahun', 2026)->count());
    }

    public function test_validasi_angka_rekap(): void
    {
        $this->buatTahun(2026);
        $valid = $this->items();

        $kasus = [
            'negatif' => [[...$valid[0], 'propem' => -1], ...array_slice($valid, 1)],
            'pecahan' => [[...$valid[0], 'progsun' => 1.5], ...array_slice($valid, 1)],
            'kosong' => [[...$valid[0], 'harm_ranperda' => ''], ...array_slice($valid, 1)],
            'terlalu besar' => [[...$valid[0], 'harm_ranperkada' => 10000], ...array_slice($valid, 1)],
            'wilayah tidak dikenal' => [[...$valid[0], 'kabupaten_id' => 999], ...array_slice($valid, 1)],
            'wilayah ganda' => [$valid[0], $valid[0], ...array_slice($valid, 2)],
            'kurang dari 13 wilayah' => array_slice($valid, 1),
        ];

        foreach ($kasus as $nama => $items) {
            $this->assertNotEmpty($this->simpan(2026, $items)->getSession()->get('errors'), "Kasus '{$nama}' seharusnya ditolak.");
            $this->flushSession();
        }

        $this->assertSame(0, HistorisHarmonisasi::where('tahun', 2026)->count());
        $this->simpan(2026, $this->items(['propem' => 0, 'harm_ranperda' => 5, 'progsun' => 0, 'harm_ranperkada' => 0]))
            ->assertSessionHasNoErrors(); // surplus (harmonisasi > target) boleh
    }

    public function test_non_admin_tidak_bisa_mengakses(): void
    {
        $timKerja = User::factory()->create(['role_id' => 2]);

        $this->actingAs($timKerja)->get('/admin/rencana')->assertForbidden();
        $this->actingAs($timKerja)->put('/admin/rencana/2025', ['items' => $this->items()])->assertForbidden();
        $this->actingAs($timKerja)->put('/admin/rencana/2025/publikasi', ['is_published' => false])->assertForbidden();
        $this->assertSame(212, app(StatistikHarmonisasiService::class)->getStatistik(2025)['ringkasan']['ranperda']['rencana']);
    }

    public function test_seed_ulang_tidak_menimpa_angka_yang_diedit_admin(): void
    {
        $this->simpan(2025, $this->items());
        $this->artisan('db:seed', ['--class' => 'HistorisHarmonisasiSeeder']);

        $this->assertSame(26, app(StatistikHarmonisasiService::class)->getStatistik(2025)['ringkasan']['ranperda']['rencana']);

        // Tahun yang sudah dihapus admin juga tidak muncul lagi setelah seed ulang
        $this->buatTahun(2026);
        $this->simpan(2026);
        $this->publikasi(2026, true);
        $this->actingAs($this->admin)->put('/admin/rencana/2026/utama');
        $this->publikasi(2025, false);
        $this->actingAs($this->admin)->delete('/admin/rencana/2025')->assertSessionHasNoErrors();

        $this->artisan('db:seed', ['--class' => 'HistorisHarmonisasiSeeder']);
        $this->assertDatabaseMissing('rekap_statistik_tahun', ['tahun' => 2025]);
        $this->assertSame(1, RekapTahun::where('is_default', true)->count());
    }

    public function test_landing_tanpa_tahun_tayang_tidak_error(): void
    {
        RekapTahun::query()->update(['is_published' => false, 'is_default' => false]);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->where('statistikData', null));
        $this->getJson('/api/statistik-harmonisasi')->assertOk()->assertJsonPath('data', null);
    }

    public function test_halaman_admin_menampilkan_daftar_tahun_dan_rekap(): void
    {
        $this->buatTahun(2026);

        $this->actingAs($this->admin)->get('/admin/rencana')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Admin/RencanaRegulasiPage')
            ->where('daftarTahun.0.tahun', 2026)
            ->where('daftarTahun.1.is_default', true)
            ->where('rekap.tahun', 2025) // default membuka tahun tampil pertama
            ->has('rekap.wilayah', 13)
            ->where('rekap.wilayah.0.propem', 30)
        );

        $this->actingAs($this->admin)->get('/admin/rencana?tahun=2026')
            ->assertInertia(fn (Assert $page) => $page->where('rekap.tahun', 2026)->where('rekap.wilayah.0.propem', 0));
    }
}
