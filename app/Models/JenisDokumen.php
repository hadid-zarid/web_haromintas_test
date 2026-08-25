<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisDokumen extends Model
{
    protected $table = 'jenis_dokumen';
    protected $primaryKey = 'jenis_dokumen_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_dokumen',
        'tahap',
        'urutan',
    ];

    public function dokumens(): HasMany
    {
        return $this->hasMany(Dokumen::class, 'jenis_dokumen_id', 'jenis_dokumen_id');
    }
}
