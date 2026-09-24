<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RencanaRegulasi extends Model
{
    use HasFactory;

    protected $table = 'rencana_regulasi';

    protected $fillable = [
        'tahun',
        'kabupaten_id',
        'jenis_regulasi_id',
        'jumlah_rencana',
        'sumber_resmi',
        'is_published',
        'published_at',
        'updated_by',
        'keterangan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'kabupaten_id' => 'integer',
        'jenis_regulasi_id' => 'integer',
        'jumlah_rencana' => 'integer',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'updated_by' => 'integer',
    ];

    public function kabupaten(): BelongsTo
    {
        return $this->belongsTo(Kabupaten::class, 'kabupaten_id', 'kabupaten_id');
    }

    public function jenisRegulasi(): BelongsTo
    {
        return $this->belongsTo(JenisRegulasi::class, 'jenis_regulasi_id', 'jenis_regulasi_id');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
