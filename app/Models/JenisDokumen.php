<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisDokumen extends Model
{
    protected $table = 'jenis_dokumen';
    protected $primaryKey = 'jenis_dokumen_id';
    public $timestamps = false;

    /**
     * Surat penolakan Biro Hukum. Bukan bagian dari 7 dokumen berkas: tidak tampil
     * sebagai kartu dan tidak ikut dihitung dalam kelengkapan.
     */
    public const SURAT_PENOLAKAN = 8;

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
