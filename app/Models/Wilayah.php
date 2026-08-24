<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wilayah extends Model
{
    use HasFactory;

    protected $table = 'wilayahs';

    protected $fillable = [
        'pokja_id',
        'nama_wilayah',
        'jenis_wilayah',
        'kode_wilayah',
    ];

    /**
     * Pokja Kanwil yang membina wilayah ini
     */
    public function pokja(): BelongsTo
    {
        return $this->belongsTo(Pokja::class, 'pokja_id');
    }

    /**
     * Pengguna Biro Hukum/Bagian Hukum di wilayah ini
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'wilayah_id');
    }
}
