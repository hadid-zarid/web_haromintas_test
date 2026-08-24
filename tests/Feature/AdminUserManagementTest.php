<?php

namespace Tests\Feature;

use App\Models\Pokja;
use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed master Pokja & Wilayah
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

    public function test_admin_can_view_manage_accounts_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_manage_accounts_page(): void
    {
        $pokja = User::factory()->create([
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($pokja)->get('/admin/users');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_manage_accounts_page(): void
    {
        $response = $this->get('/admin/users');

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_create_new_pokja_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $pokja = Pokja::first();

        $response = $this->actingAs($admin)->post('/admin/users', [
            'name' => 'Operator Pokja Baru',
            'email' => 'operator.pokjabaru@harmonitas.go.id',
            'password' => 'Harmonitas@2026',
            'nip' => '199501012022011002',
            'no_hp' => '081345678901',
            'role' => 'POKJA',
            'pokja_id' => $pokja->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'email' => 'operator.pokjabaru@harmonitas.go.id',
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $targetUser = User::factory()->create([
            'name' => 'Nama Awal',
            'email' => 'target.user@harmonitas.go.id',
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($admin)->put("/admin/users/{$targetUser->id}", [
            'name' => 'Nama Telah Diubah',
            'email' => 'target.user@harmonitas.go.id',
            'nip' => '1990000000',
            'no_hp' => '081234567890',
            'role' => 'POKJA',
            'status' => 'ACTIVE',
            'pokja_id' => $targetUser->pokja_id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Nama Telah Diubah',
        ]);
    }

    public function test_admin_can_toggle_user_status(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $targetUser = User::factory()->create([
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($admin)->post("/admin/users/{$targetUser->id}/toggle-status");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'status' => 'INACTIVE',
        ]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
        ]);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);

        $targetUser = User::factory()->create([
            'role' => 'POKJA',
            'status' => 'ACTIVE',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/users/{$targetUser->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('users', [
            'id' => $targetUser->id,
        ]);
    }
}
