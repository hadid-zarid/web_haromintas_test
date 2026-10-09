<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Status satu tahun rekap statistik landing page.
 * Angka per wilayah ada di HistorisHarmonisasi (tabel historis_harmonisasi).
 */
class RekapTahun extends Model
{
    protected $table = 'rekap_statistik_tahun';

    protected $primaryKey = 'tahun';

    public $incrementing = false;

    protected $fillable = [
        'tahun',
        'sumber',
        'is_published',
        'is_default',
        'published_at',
        'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'is_published' => 'boolean',
        'is_default' => 'boolean',
        'published_at' => 'datetime',
        'updated_by' => 'integer',
    ];
}
