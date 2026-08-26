<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Dokumen extends Model
{
    protected $table = 'dokumen';
    protected $primaryKey = 'dokumen_id';
    public $timestamps = false;

    protected $fillable = [
        'rancangan_id',
        'jenis_dokumen_id',
        'nama_file',
        'path_file',
        'ukuran_file',
        'mime_type',
        'versi',
        'uploaded_by',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    protected $appends = [
        'file_url',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->path_file) {
            return null;
        }

        return '/storage/' . ltrim($this->path_file, '/');
    }

    public function rancanganRegulasi(): BelongsTo
    {
        return $this->belongsTo(RancanganRegulasi::class, 'rancangan_id', 'rancangan_id');
    }

    public function jenisDokumen(): BelongsTo
    {
        return $this->belongsTo(JenisDokumen::class, 'jenis_dokumen_id', 'jenis_dokumen_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }
}
