<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorisHarmonisasi extends Model
{
    use HasFactory;

    protected $table = 'historis_harmonisasi';

    protected $fillable = [
        'tahun',
        'kabupaten_id',
        'jenis_regulasi_id',
        'jumlah_rencana',
        'jumlah_harmonisasi',
        'sumber',
        'catatan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'kabupaten_id' => 'integer',
        'jenis_regulasi_id' => 'integer',
        'jumlah_rencana' => 'integer',
        'jumlah_harmonisasi' => 'integer',
    ];

    public function kabupaten(): BelongsTo
    {
        return $this->belongsTo(Kabupaten::class, 'kabupaten_id', 'kabupaten_id');
    }

    public function jenisRegulasi(): BelongsTo
    {
        return $this->belongsTo(JenisRegulasi::class, 'jenis_regulasi_id', 'jenis_regulasi_id');
    }
}
