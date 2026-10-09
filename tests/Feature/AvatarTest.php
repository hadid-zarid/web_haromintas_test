<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;
use Mockery;
use Tests\TestCase;

class AvatarTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed', ['--class' => 'MasterDataSeeder']);
        Storage::fake('local');

        $this->user = User::factory()->create(['email' => 'anggota@harmonitas.go.id']);
    }

    private function unggah(UploadedFile $file)
    {
        return $this->actingAs($this->user)->post('/profil/avatar', ['avatar' => $file]);
    }

    public function test_unggah_foto_disimpan_sebagai_jpeg_256_persegi(): void
    {
        $this->unggah(UploadedFile::fake()->image('foto.png', 600, 400))
            ->assertRedirect()->assertSessionHasNoErrors();

        $path = $this->user->fresh()->avatar_path;
        $this->assertMatchesRegularExpression('#^avatars/[A-Za-z0-9]{40}\.jpg$#', $path);
        Storage::disk('local')->assertExists($path);

        [$lebar, $tinggi, $tipe] = getimagesizefromstring(Storage::disk('local')->get($path));
        $this->assertSame([256, 256, IMAGETYPE_JPEG], [$lebar, $tinggi, $tipe]);
        $this->assertDatabaseHas('audit_logs', ['user_id' => $this->user->user_id, 'action' => 'PROFIL_AVATAR_UPDATE']);
    }

    public function test_unggah_kedua_menghapus_file_lama(): void
    {
        $this->unggah(UploadedFile::fake()->image('a.jpg', 300, 300));
        $lama = $this->user->fresh()->avatar_path;

        $this->unggah(UploadedFile::fake()->image('b.jpg', 300, 300));

        Storage::disk('local')->assertMissing($lama);
        Storage::disk('local')->assertExists($this->user->fresh()->avatar_path);
    }

    public function test_file_berbahaya_atau_tidak_sesuai_ditolak(): void
    {
        $tolak = [
            'teks menyamar jpg' => UploadedFile::fake()->createWithContent('foto.jpg', 'bukan gambar <?php echo 1; ?>'),
            'svg' => UploadedFile::fake()->createWithContent('foto.svg', '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>'),
            'lebih dari 2 MB' => UploadedFile::fake()->image('besar.jpg', 300, 300)->size(3000),
            'kurang dari 64 px' => UploadedFile::fake()->image('kecil.png', 32, 32),
        ];

        foreach ($tolak as $kasus => $file) {
            $this->unggah($file)->assertSessionHasErrors('avatar', "Kasus '{$kasus}' seharusnya ditolak.");
        }

        $this->assertNull($this->user->fresh()->avatar_path);
        $this->assertSame([], Storage::disk('local')->allFiles());
    }

    public function test_foto_bisa_dilihat_user_lain_yang_login_tapi_tidak_oleh_tamu(): void
    {
        $this->unggah(UploadedFile::fake()->image('foto.jpg', 300, 300));
        $lain = User::factory()->create();

        $this->actingAs($lain)->get(route('avatar.show', $this->user))
            ->assertOk()
            ->assertHeader('Content-Type', 'image/jpeg')
            ->assertHeader('X-Content-Type-Options', 'nosniff');

        auth()->logout();
        $this->get(route('avatar.show', $this->user))->assertRedirect(route('login'));
    }

    public function test_user_tanpa_foto_unggahan_mendapat_404(): void
    {
        $google = User::factory()->create(['avatar_path' => 'https://lh3.googleusercontent.com/a/foto']);

        $traversal = User::factory()->create(['avatar_path' => 'avatars/../../.env']);
        Storage::disk('local')->put('rahasia.txt', 'jangan bocor');
        $diluarFolder = User::factory()->create(['avatar_path' => 'avatars/../rahasia.txt']);

        $this->actingAs($this->user)->get(route('avatar.show', $this->user))->assertNotFound();
        $this->actingAs($this->user)->get(route('avatar.show', $google))->assertNotFound();
        $this->actingAs($this->user)->get(route('avatar.show', $traversal))->assertNotFound();
        $this->actingAs($this->user)->get(route('avatar.show', $diluarFolder))->assertNotFound();
    }

    public function test_hapus_foto_menghapus_file_dan_menonaktifkan_foto_google(): void
    {
        $this->unggah(UploadedFile::fake()->image('foto.jpg', 300, 300));
        $path = $this->user->fresh()->avatar_path;

        $this->actingAs($this->user)->delete('/profil/avatar')->assertRedirect();

        $fresh = $this->user->fresh();
        Storage::disk('local')->assertMissing($path);
        $this->assertNull($fresh->avatar_path);
        $this->assertFalse($fresh->avatar_google_aktif);
    }

    public function test_shared_prop_mengirim_avatar_url_bukan_path(): void
    {
        $this->unggah(UploadedFile::fake()->image('foto.jpg', 300, 300));
        $nama = basename($this->user->fresh()->avatar_path, '.jpg');

        $this->actingAs($this->user)->get('/profil')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.avatar_url', route('avatar.show', ['user' => $this->user->user_id, 'v' => $nama]))
                ->missing('auth.user.avatar_path')
            );
    }

    private function loginGoogle(): void
    {
        $googleUser = (new GoogleUser)->map([
            'id' => 'google-123',
            'email' => 'anggota@harmonitas.go.id',
            'avatar' => 'https://lh3.googleusercontent.com/a/foto-google',
        ]);

        $provider = Mockery::mock();
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('setHttpClient')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($googleUser);
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $this->get('/auth/google/callback')->assertRedirect(route('home'));
    }

    public function test_login_google_memasang_foto_google_bila_belum_pernah_dihapus(): void
    {
        $this->loginGoogle();

        $this->assertSame('https://lh3.googleusercontent.com/a/foto-google', $this->user->fresh()->avatar_path);
    }

    public function test_login_google_tidak_memasang_foto_setelah_user_menghapusnya(): void
    {
        $this->actingAs($this->user)->delete('/profil/avatar');
        auth()->logout();

        $this->loginGoogle();

        $this->assertNull($this->user->fresh()->avatar_path);
    }
}
