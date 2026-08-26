<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kabupaten extends Model
{
    protected $table = 'kabupaten';
    protected $primaryKey = 'kabupaten_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_kabupaten',
        'kode_kabupaten',
        'tim_kerja_id',
    ];

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
