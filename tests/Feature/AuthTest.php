<?php

namespace Tests\Feature;

use App\Models\Pokja;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic master data for test environment
        $pokja = Pokja::create([
            'nama_pokja' => 'Pokja 1',
            'keterangan' => 'Membina Pemprov Riau',
        ]);

        Wilayah::create([
            'pokja_id' => $pokja->id,
            'nama_wilayah' => 'Pemerintah Provinsi Riau',
            'jenis_wilayah' => 'PROVINSI',
            'kode_wilayah' => 'RIAU-PROV',
        ]);
    }

    public function test_login_page_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'testuser@harmonitas.go.id',
            'password' => 'password123',
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);

        $response = $this->post('/login', [
            'email' => 'testuser@harmonitas.go.id',
            'password' => 'password123',
            'remember' => true,
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('home'));
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'email' => 'testuser@harmonitas.go.id',
            'password' => 'password123',
            'status' => 'ACTIVE',
        ]);

        $response = $this->post('/login', [
            'email' => 'testuser@harmonitas.go.id',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'inactive@harmonitas.go.id',
            'password' => 'password123',
            'status' => 'INACTIVE',
        ]);

        $response = $this->post('/login', [
            'email' => 'inactive@harmonitas.go.id',
            'password' => 'password123',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create([
            'status' => 'ACTIVE',
        ]);

        $this->actingAs($user);

        $response = $this->post('/logout');

        $this->assertGuest();
        $response->assertRedirect(route('login'));
    }
}
