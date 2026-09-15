<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kabupaten extends Model
{
    protected $table = 'kabupaten';
    protected $primaryKey = 'kabupaten_id';
    public $timestamps = false;

    /**
     * Pembagian Wilayah Kerja Biro Hukum Setda Provinsi Riau.
     * Terpisah dari wilayah binaan Tim Kerja Kanwil (tim_kerja_id).
     * Kabupaten dengan wilayah NULL (mis. Pemprov Riau) ditangani seluruh petugas Biro Hukum.
     */
    public const WILAYAH_BIRO_HUKUM = [
        1 => 'Wilayah 1',
        2 => 'Wilayah 2',
        3 => 'Wilayah 3',
    ];

    protected $fillable = [
        'nama_kabupaten',
        'kode_kabupaten',
        'tim_kerja_id',
        'wilayah_biro_hukum_id',
    ];

    protected $casts = [
        'wilayah_biro_hukum_id' => 'integer',
    ];

    public static function namaWilayahBiroHukum(?int $wilayahId): ?string
    {
        return $wilayahId !== null ? (self::WILAYAH_BIRO_HUKUM[$wilayahId] ?? "Wilayah {$wilayahId}") : null;
    }

    /**
     * Kabupaten yang dapat ditangani petugas Biro Hukum pada wilayah tertentu:
     * kabupaten di wilayah tersebut + kabupaten tanpa wilayah (Pemprov Riau).
     * Petugas yang belum ditetapkan wilayahnya ($wilayahId NULL) hanya mendapat kabupaten tanpa wilayah.
     */
    public function scopeDalamCakupanBiroHukum(Builder $query, ?int $wilayahId): Builder
    {
        return $query->where(function (Builder $q) use ($wilayahId) {
            $q->whereNull('wilayah_biro_hukum_id')
              ->when($wilayahId !== null, fn (Builder $w) => $w->orWhere('wilayah_biro_hukum_id', $wilayahId));
        });
    }

    public function timKerja(): BelongsTo
    {
        return $this->belongsTo(TimKerja::class, 'tim_kerja_id', 'tim_kerja_id');
    }

    public function rancangans(): HasMany
    {
        return $this->hasMany(RancanganRegulasi::class, 'kabupaten_id', 'kabupaten_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_kabupaten', 'kabupaten_id', 'user_id');
    }
}
