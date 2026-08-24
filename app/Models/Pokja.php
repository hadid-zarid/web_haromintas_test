<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pokja extends Model
{
    use HasFactory;

    protected $table = 'pokjas';

    protected $fillable = [
        'nama_pokja',
        'keterangan',
    ];

    /**
     * Wilayah-wilayah yang dibina oleh Pokja ini
     */
    public function wilayahs(): HasMany
    {
        return $this->hasMany(Wilayah::class, 'pokja_id');
    }

    /**
     * Pengguna/Operator yang terdaftar pada Pokja ini
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'pokja_id');
    }
}
