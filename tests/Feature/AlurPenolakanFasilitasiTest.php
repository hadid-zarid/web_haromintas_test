<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\RancanganRegulasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AlurPenolakanFasilitasiTest extends TestCase
{
    use RefreshDatabase;

    private string $storageSementara;

    private User $timKerja;

    private User $timKerjaLain;

    private User $biroHukum;

    private User $pimpinan;

    private User $admin;

    private RancanganRegulasi $berkas;

    protected function setUp(): void
    {
        parent::setUp();

        // Unggahan test tidak boleh menyentuh storage/app/secure_drafts milik pengembang.
        $this->storageSementara = sys_get_temp_dir().'/harmonitas-test-'.uniqid();
        File::ensureDirectoryExists($this->storageSementara.'/app');
        $this->app->useStoragePath($this->storageSementara);

        Mail::fake();
        $this->artisan('db:seed', ['--class' => 'MasterDataSeeder']);

        // Domain .invalid tidak punya MX, jadi NotifikasiService melewati pengiriman email.
        $buat = fn (string $nama, array $atribut) => User::factory()->create($atribut + [
            'nama' => $nama,
            'email' => strtolower(str_replace(' ', '', $nama)).'@uji.invalid',
        ]);

        $this->timKerja = $buat('Tim Satu', ['role_id' => 2, 'tim_kerja_id' => 1]);
        $this->timKerjaLain = $buat('Tim Dua', ['role_id' => 2, 'tim_kerja_id' => 2]);
        $this->biroHukum = $buat('Biro Hukum', ['role_id' => 3, 'wilayah_biro_hukum_id' => 1]);
        $this->pimpinan = $buat('Pimpinan', ['role_id' => 4]);
        $this->admin = $buat('Admin', ['role_id' => 1]);

        // Berkas Pemprov Riau (Tim Kerja 1) dengan Dokumen 1-5 lengkap, menunggu fasilitasi
        $this->berkas = RancanganRegulasi::create([
            'nomor_regulasi' => '01/RANPERDA/2026',
            'judul_rancangan' => 'Ranperda Uji Alur',
            'jenis_regulasi_id' => 1,
            'kabupaten_id' => 1,
            'tim_kerja_id' => 1,
            'pokja_id' => $this->timKerja->user_id,
            'user_id' => $this->timKerja->user_id,
            'status_id' => 3,
            'keterangan' => 'Menunggu fasilitasi.',
            'tanggal_dibuat' => now()->toDateString(),
        ]);

        foreach ([1, 2, 3, 4, 5] as $jenis) {
            $this->buatDokumen($jenis);
        }
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->storageSementara);
        parent::tearDown();
    }

    private function buatDokumen(int $jenis): Dokumen
    {
        return Dokumen::create([
            'rancangan_id' => $this->berkas->rancangan_id,
            'jenis_dokumen_id' => $jenis,
            'nama_file' => "dokumen{$jenis}.pdf",
            'path_file' => "secure_drafts/{$this->berkas->rancangan_id}/dokumen{$jenis}.pdf",
            'versi' => 1,
            'uploaded_by' => $this->timKerja->user_id,
            'uploaded_at' => now()->subDay(),
        ]);
    }

    private function pdf(string $nama = 'surat.pdf'): UploadedFile
    {
        return UploadedFile::fake()->create($nama, 20, 'application/pdf');
    }

    private function urlBerkas(string $akhiran = ''): string
    {
        return "/peraturan/{$this->berkas->rancangan_id}{$akhiran}";
    }

    private function tolak(array $data = [])
    {
        return $this->actingAs($this->biroHukum)->post($this->urlBerkas('/status'), $data + [
            'status_id' => 5,
            'catatan' => 'Pasal 8 perlu disesuaikan.',
        ]);
    }

    private function unggah(User $user, int $jenis)
    {
        return $this->actingAs($user)->post($this->urlBerkas('/dokumen'), [
            'jenis_dokumen_id' => $jenis,
            'file' => $this->pdf("perbaikan{$jenis}.pdf"),
        ]);
    }

    private function statusBerkas(): int
    {
        return (int) $this->berkas->fresh()->status_id;
    }

    private function jumlahNotifikasi(User $user, string $judul): int
    {
        return \DB::table('notifikasi')->where('user_id', $user->user_id)->where('judul', $judul)->count();
    }

    public function test_surat_penolakan_tidak_menempati_slot_dokumen_tujuh(): void
    {
        $this->tolak(['surat_file' => $this->pdf('penolakan.pdf')])->assertSessionHas('success');

        $this->assertSame(5, $this->statusBerkas());
        $this->assertDatabaseHas('dokumen', [
            'rancangan_id' => $this->berkas->rancangan_id,
            'jenis_dokumen_id' => JenisDokumen::SURAT_PENOLAKAN,
            'nama_file' => 'penolakan.pdf',
        ]);
        $this->assertDatabaseMissing('dokumen', ['rancangan_id' => $this->berkas->rancangan_id, 'jenis_dokumen_id' => 7]);
        $this->assertSame(1, $this->jumlahNotifikasi($this->timKerja, 'Permohonan Memerlukan Perbaikan'));

        // Surat penolakan bukan salah satu dari 7 dokumen berkas
        $this->assertCount(5, $this->berkas->fresh()->dokumens);
    }

    public function test_unggahan_tim_kerja_setelah_ditolak_tidak_menyelesaikan_berkas(): void
    {
        $this->tolak(['surat_file' => $this->pdf('penolakan.pdf')]);

        $this->unggah($this->timKerja, 5)->assertSessionHas('success');

        $this->assertSame(5, $this->statusBerkas(), 'Berkas yang ditolak tidak boleh berubah status hanya karena unggahan Tim Kerja.');
        $this->assertSame(0, $this->jumlahNotifikasi($this->biroHukum, 'Perbaikan Berkas Telah Dikirim'));
        $this->assertSame(0, $this->jumlahNotifikasi($this->timKerja, 'Fasilitasi Disetujui & Selesai'));
    }

    public function test_kirim_perbaikan_mengembalikan_berkas_ke_biro_hukum(): void
    {
        $this->tolak();
        $this->unggah($this->timKerja, 4);

        $this->actingAs($this->timKerja)->post($this->urlBerkas('/perbaikan'))->assertSessionHas('success');

        $this->assertSame(3, $this->statusBerkas());
        $this->assertSame(1, $this->jumlahNotifikasi($this->biroHukum, 'Perbaikan Berkas Telah Dikirim'));
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'SUBMIT_PERBAIKAN',
            'module' => 'PERMOHONAN_REGULASI',
            'target_id' => (string) $this->berkas->rancangan_id,
            'user_id' => $this->timKerja->user_id,
        ]);
    }

    public function test_kirim_perbaikan_ditolak_bila_belum_ada_dokumen_yang_diperbaiki(): void
    {
        $this->tolak();

        $this->actingAs($this->timKerja)->post($this->urlBerkas('/perbaikan'))->assertSessionHas('error');

        $this->assertSame(5, $this->statusBerkas());
    }

    public function test_kirim_perbaikan_hanya_untuk_berkas_perlu_perbaikan(): void
    {
        $this->actingAs($this->timKerja)->post($this->urlBerkas('/perbaikan'))->assertSessionHas('error');

        $this->assertSame(3, $this->statusBerkas());
        $this->assertSame(0, $this->jumlahNotifikasi($this->biroHukum, 'Perbaikan Berkas Telah Dikirim'));
    }

    public function test_kirim_perbaikan_hanya_oleh_tim_kerja_pemilik_berkas(): void
    {
        $this->tolak();
        $this->unggah($this->timKerja, 4);

        $this->actingAs($this->biroHukum)->post($this->urlBerkas('/perbaikan'))->assertForbidden();
        $this->actingAs($this->pimpinan)->post($this->urlBerkas('/perbaikan'))->assertForbidden();
        $this->actingAs($this->timKerjaLain)->post($this->urlBerkas('/perbaikan'))->assertForbidden();

        $this->assertSame(5, $this->statusBerkas());
    }

    public function test_biro_hukum_mengunggah_dokumen_tujuh_menyelesaikan_berkas_dan_mengirim_notifikasi(): void
    {
        $this->unggah($this->biroHukum, 7)->assertSessionHas('success');

        $this->assertSame(4, $this->statusBerkas());
        $this->assertSame(1, $this->jumlahNotifikasi($this->timKerja, 'Fasilitasi Disetujui & Selesai'));
        $this->assertSame(1, $this->jumlahNotifikasi($this->pimpinan, 'Produk Hukum Daerah Selesai'));
        $this->assertDatabaseHas('audit_logs', ['action' => 'APPROVE_FASILITASI', 'target_id' => (string) $this->berkas->rancangan_id]);
    }

    public function test_terima_wajib_melampirkan_surat_bila_dokumen_tujuh_belum_ada(): void
    {
        $this->actingAs($this->biroHukum)
            ->post($this->urlBerkas('/status'), ['status_id' => 4])
            ->assertSessionHasErrors('surat_file');
        $this->assertSame(3, $this->statusBerkas());

        $this->actingAs($this->biroHukum)
            ->post($this->urlBerkas('/status'), ['status_id' => 4, 'surat_file' => $this->pdf('hasil.pdf')])
            ->assertSessionHas('success');

        $this->assertSame(4, $this->statusBerkas());
        $this->assertDatabaseHas('dokumen', ['rancangan_id' => $this->berkas->rancangan_id, 'jenis_dokumen_id' => 7, 'nama_file' => 'hasil.pdf']);
        $this->assertSame(1, $this->jumlahNotifikasi($this->timKerja, 'Fasilitasi Disetujui & Selesai'));
    }

    public function test_keputusan_fasilitasi_divalidasi_di_server(): void
    {
        // Alasan wajib saat menolak
        $this->actingAs($this->biroHukum)
            ->post($this->urlBerkas('/status'), ['status_id' => 5])
            ->assertSessionHasErrors('catatan');

        // Hanya Selesai / Perlu Perbaikan
        $this->actingAs($this->biroHukum)
            ->post($this->urlBerkas('/status'), ['status_id' => 1, 'catatan' => 'x'])
            ->assertSessionHasErrors('status_id');

        // Tim Kerja tidak berwenang memutuskan
        $this->actingAs($this->timKerja)
            ->post($this->urlBerkas('/status'), ['status_id' => 4, 'surat_file' => $this->pdf()])
            ->assertForbidden();

        $this->assertSame(3, $this->statusBerkas());
    }

    public function test_keputusan_ditolak_bila_dokumen_harmonisasi_belum_lengkap(): void
    {
        Dokumen::where('rancangan_id', $this->berkas->rancangan_id)->where('jenis_dokumen_id', 5)->delete();
        $this->berkas->update(['status_id' => 2]);

        $this->actingAs($this->biroHukum)
            ->post($this->urlBerkas('/status'), ['status_id' => 4, 'surat_file' => $this->pdf()])
            ->assertSessionHas('error');

        $this->assertSame(2, $this->statusBerkas());
    }

    public function test_halaman_detail_menampilkan_rincian_penolakan_dan_tujuh_kartu_dokumen(): void
    {
        $this->tolak(['surat_file' => $this->pdf('penolakan.pdf')]);

        $this->actingAs($this->timKerja)->get($this->urlBerkas())
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('PeraturanDetailPage')
                ->has('jenisDokumens', 7)
                ->has('permohonan.dokumens', 5)
                ->where('penolakan.oleh', 'Biro Hukum')
                ->where('penolakan.catatan', 'Pasal 8 perlu disesuaikan.')
                ->where('penolakan.surat.nama_file', 'penolakan.pdf')
                ->where('penolakan.bisa_kirim', false)
            );
    }

    public function test_riwayat_berkas_tidak_memuat_log_modul_lain_dengan_target_id_sama(): void
    {
        AuditLog::create([
            'user_id' => $this->admin->user_id,
            'action' => 'ADMIN_UPDATE_USER',
            'module' => 'USER_MANAGEMENT',
            'target_id' => (string) $this->berkas->rancangan_id,
            'payload' => ['target_name' => 'Akun Rahasia'],
            'created_at' => now(),
        ]);
        $this->tolak();

        $this->actingAs($this->timKerja)->get($this->urlBerkas())
            ->assertInertia(fn (Assert $page) => $page
                ->has('auditLogs', 1)
                ->where('auditLogs.0.action', 'REJECT_FASILITASI')
                // IP & perangkat pelaku tidak boleh terkirim ke browser pengguna lain
                ->missing('auditLogs.0.ip_address')
                ->missing('auditLogs.0.user_agent')
            );
    }

    public function test_feed_beranda_hanya_berisi_aktivitas_berkas_sesuai_peran(): void
    {
        $this->tolak();
        foreach ([['PROFIL_AVATAR_UPDATE', 'USER_PROFILE', $this->timKerja], ['ADMIN_UPDATE_USER', 'USER_MANAGEMENT', $this->admin]] as [$aksi, $modul, $pelaku]) {
            AuditLog::create([
                'user_id' => $pelaku->user_id,
                'action' => $aksi,
                'module' => $modul,
                'target_id' => (string) $this->berkas->rancangan_id,
                'payload' => [],
                'created_at' => now(),
            ]);
        }

        $aksiDiFeed = function (User $user): array {
            $aksi = [];
            $this->actingAs($user)->get('/home')->assertOk()->assertInertia(function (Assert $page) use (&$aksi) {
                $aksi = collect($page->toArray()['props']['recentActivities'])->pluck('action')->all();
            });

            return $aksi;
        };

        $this->assertSame(['REJECT_FASILITASI'], $aksiDiFeed($this->timKerja));
        $this->assertSame(['REJECT_FASILITASI'], $aksiDiFeed($this->pimpinan));
        $this->assertEqualsCanonicalizing(['REJECT_FASILITASI', 'ADMIN_UPDATE_USER'], $aksiDiFeed($this->admin));

        // Berkas terkait ikut dikirim untuk popup detail
        $this->actingAs($this->timKerja)->get('/home')->assertInertia(fn (Assert $page) => $page
            ->where('recentActivities.0.berkas.judul', 'Ranperda Uji Alur')
        );
    }
}
