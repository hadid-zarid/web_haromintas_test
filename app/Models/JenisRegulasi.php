<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisRegulasi extends Model
{
    protected $table = 'jenis_regulasi';
    protected $primaryKey = 'jenis_regulasi_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_jenis',
    ];

    public function rancangans(): HasMany
    {
        return $this->hasMany(RancanganRegulasi::class, 'jenis_regulasi_id', 'jenis_regulasi_id');
    }
}
