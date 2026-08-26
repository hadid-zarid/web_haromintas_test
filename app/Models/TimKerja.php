<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimKerja extends Model
{
    protected $table = 'tim_kerja';
    protected $primaryKey = 'tim_kerja_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_tim_kerja',
        'keterangan',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'tim_kerja_id', 'tim_kerja_id');
    }

    public function kabupatens(): HasMany
    {
        return $this->hasMany(Kabupaten::class, 'tim_kerja_id', 'tim_kerja_id');
    }

    public function rancangans(): HasMany
    {
        return $this->hasMany(RancanganRegulasi::class, 'tim_kerja_id', 'tim_kerja_id');
    }
}
