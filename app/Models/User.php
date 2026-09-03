<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'user';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role_id',
        'nip',
        'no_hp',
        'tim_kerja_id',
        'status',
        'google_id',
        'avatar_path',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    protected $appends = [
        'name',
        'role',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Accessor 'name' untuk kompatibilitas frontend & Laravel auth ($user->name)
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->nama,
            set: fn ($value) => ['nama' => $value],
        );
    }

    /**
     * Accessor 'role' string (ADMIN, TIM_KERJA, BIRO_HUKUM, PIMPINAN)
     */
    protected function role(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->roleRelation?->nama_role ?? match ($this->role_id) {
                1 => 'ADMIN',
                2 => 'TIM_KERJA',
                3 => 'BIRO_HUKUM',
                4 => 'PIMPINAN',
                default => 'TIM_KERJA',
            },
        );
    }

    /**
     * Relasi ke Tabel Role
     */
    public function roleRelation(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    /**
     * Relasi ke Tabel Tim Kerja (Pengganti Pokja)
     */
    public function timKerja(): BelongsTo
    {
        return $this->belongsTo(TimKerja::class, 'tim_kerja_id', 'tim_kerja_id');
    }

    /**
     * Relasi ke Kabupaten (Pivot user_kabupaten)
     */
    public function kabupatens(): BelongsToMany
    {
        return $this->belongsToMany(Kabupaten::class, 'user_kabupaten', 'user_id', 'kabupaten_id');
    }

    /**
     * Helper Role Checks
     */
    public function isAdmin(): bool
    {
        return $this->role_id === 1 || ($this->roleRelation?->nama_role === 'ADMIN');
    }

    public function isTimKerja(): bool
    {
        return $this->role_id === 2 || in_array($this->roleRelation?->nama_role, ['TIM_KERJA', 'POKJA']);
    }

    public function isPokja(): bool
    {
        return $this->isTimKerja();
    }

    public function isBiroHukum(): bool
    {
        return $this->role_id === 3 || ($this->roleRelation?->nama_role === 'BIRO_HUKUM');
    }

    public function isPimpinan(): bool
    {
        return $this->role_id === 4 || ($this->roleRelation?->nama_role === 'PIMPINAN');
    }

    public function isActive(): bool
    {
        return $this->status === 'ACTIVE';
    }
}
