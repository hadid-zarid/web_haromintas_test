<?php

namespace Tests\Feature;

use App\Mail\PasswordChangedMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfilTest extends TestCase
{
    use RefreshDatabase;

    private const PASSWORD_LAMA = 'Lama@2026x';

    private const PASSWORD_BARU = 'Baru#2026y';

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed', ['--class' => 'MasterDataSeeder']);

        $this->user = User::factory()->create([
            'nama' => 'Nama Awal',
            'email' => 'anggota@harmonitas.go.id',
            'password' => self::PASSWORD_LAMA,
            'no_hp' => '081200000000',
        ]);
    }

    private function gantiPassword(array $overrides = [])
    {
        return $this->actingAs($this->user)->put('/profil/password', array_merge([
            'current_password' => self::PASSWORD_LAMA,
            'password' => self::PASSWORD_BARU,
            'password_confirmation' => self::PASSWORD_BARU,
        ], $overrides));
    }

    public function test_tamu_diarahkan_ke_login(): void
    {
        $this->get('/profil')->assertRedirect(route('login'));
    }

    public function test_halaman_profil_tampil_untuk_user_login(): void
    {
        $this->actingAs($this->user)->get('/profil')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ProfilPage')
                ->where('auth.user.email', 'anggota@harmonitas.go.id')
                ->missing('auth.user.nip')
            );
    }

    public function test_user_bisa_ubah_nama_dan_no_hp(): void
    {
        $this->actingAs($this->user)->put('/profil', [
            'nama' => 'Nama Baru',
            'no_hp' => '081311112222',
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('user', [
            'user_id' => $this->user->user_id,
            'nama' => 'Nama Baru',
            'no_hp' => '081311112222',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->user->user_id,
            'action' => 'PROFIL_UPDATE',
        ]);
    }

    public function test_nama_berisi_html_ditolak(): void
    {
        $this->actingAs($this->user)->put('/profil', [
            'nama' => '<script>alert(1)</script>',
        ])->assertSessionHasErrors('nama');

        $this->assertSame('Nama Awal', $this->user->fresh()->nama);
    }

    public function test_field_terlarang_tidak_bisa_diubah_lewat_profil(): void
    {
        $this->actingAs($this->user)->put('/profil', [
            'nama' => 'Nama Awal',
            'email' => 'penyusup@example.com',
            'role_id' => 1,
            'status' => 'INACTIVE',
            'wilayah_biro_hukum_id' => 1,
        ])->assertSessionHasNoErrors();

        $fresh = $this->user->fresh();
        $this->assertSame('anggota@harmonitas.go.id', $fresh->email);
        $this->assertSame(2, (int) $fresh->role_id);
        $this->assertSame('ACTIVE', $fresh->status);
        $this->assertNull($fresh->wilayah_biro_hukum_id);
    }

    public function test_password_lama_salah_ditolak(): void
    {
        $this->gantiPassword(['current_password' => 'Salah@2026'])
            ->assertSessionHasErrors(['current_password' => 'Kata sandi saat ini tidak sesuai.']);

        $this->assertTrue(Hash::check(self::PASSWORD_LAMA, $this->user->fresh()->password));
    }

    public function test_password_lemah_ditolak_dengan_pesan_indonesia(): void
    {
        $this->gantiPassword(['password' => 'lemahsekali', 'password_confirmation' => 'lemahsekali'])
            ->assertSessionHasErrors('password');

        $errors = session('errors')->get('password');
        $this->assertContains('Kata sandi harus mengandung huruf besar dan huruf kecil.', $errors);
        $this->assertContains('Kata sandi harus mengandung minimal satu angka.', $errors);
    }

    public function test_password_baru_harus_berbeda(): void
    {
        $this->gantiPassword(['password' => self::PASSWORD_LAMA, 'password_confirmation' => self::PASSWORD_LAMA])
            ->assertSessionHasErrors(['password' => 'Kata sandi baru harus berbeda dari kata sandi saat ini.']);
    }

    /**
     * Login lewat form asli agar user tersimpan di sesi. actingAs() hanya menaruh objek
     * user di guard, sehingga perubahan hash kata sandi tidak pernah terbaca ulang.
     */
    private function loginSungguhan(): void
    {
        $this->post('/login', ['email' => 'anggota@harmonitas.go.id', 'password' => self::PASSWORD_LAMA])
            ->assertRedirect(route('home'));
    }

    /** Simulasikan request baru: guard melupakan user dan membacanya ulang dari sesi + DB. */
    private function requestBaru(): void
    {
        $this->app['auth']->forgetGuards();
    }

    public function test_ganti_password_berhasil(): void
    {
        Mail::fake();
        $rememberLama = $this->user->remember_token;

        $this->loginSungguhan();
        $this->get('/profil')->assertOk();
        $this->requestBaru();

        $this->put('/profil/password', [
            'current_password' => self::PASSWORD_LAMA,
            'password' => self::PASSWORD_BARU,
            'password_confirmation' => self::PASSWORD_BARU,
        ])->assertRedirect()->assertSessionHas('success');

        $fresh = $this->user->fresh();
        $this->assertTrue(Hash::check(self::PASSWORD_BARU, $fresh->password));
        $this->assertNotSame($rememberLama, $fresh->remember_token);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->user->user_id,
            'action' => 'AUTH_PASSWORD_CHANGED',
        ]);
        Mail::assertSent(PasswordChangedMail::class, fn ($mail) => $mail->hasTo('anggota@harmonitas.go.id'));

        // Sesi yang mengganti password tetap login.
        $this->requestBaru();
        $this->get('/profil')->assertOk();
        $this->assertAuthenticatedAs($fresh);
    }

    public function test_ganti_password_dibatasi_5_kali_per_menit(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->gantiPassword(['current_password' => 'Salah@2026']);
        }

        $this->gantiPassword(['current_password' => 'Salah@2026'])->assertStatus(429);
    }

    public function test_sesi_lain_keluar_setelah_password_diubah(): void
    {
        // Sesi "perangkat lain" sudah login dan menyimpan hash kata sandi lama.
        $this->loginSungguhan();
        $this->get('/profil')->assertOk();

        // Kontrol: tanpa perubahan kata sandi, sesi tetap valid saat dibaca ulang.
        $this->requestBaru();
        $this->get('/profil')->assertOk();

        // Kata sandi diubah dari tempat lain (perangkat lain / admin / reset).
        $this->user->fresh()->forceFill(['password' => self::PASSWORD_BARU])->save();
        $this->requestBaru();

        $this->get('/profil')->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
