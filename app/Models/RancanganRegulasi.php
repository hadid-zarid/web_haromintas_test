<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RancanganRegulasi extends Model
{
    use HasFactory;

    protected $table = 'rancangan_regulasi';
    protected $primaryKey = 'rancangan_id';

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'nomor_regulasi',
        'judul_rancangan',
        'jenis_regulasi_id',
        'kabupaten_id',
        'tim_kerja_id',
        'pokja_id',
        'user_id',
        'status_id',
        'keterangan',
        'tanggal_dibuat',
    ];

    protected $casts = [
        'tanggal_dibuat' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke Master Jenis Regulasi (Ranperda / Ranperkada)
     */
    public function jenisRegulasi(): BelongsTo
    {
        return $this->belongsTo(JenisRegulasi::class, 'jenis_regulasi_id', 'jenis_regulasi_id');
    }

    /**
     * Relasi ke Kabupaten / Kota
     */
    public function kabupaten(): BelongsTo
    {
        return $this->belongsTo(Kabupaten::class, 'kabupaten_id', 'kabupaten_id');
    }

    /**
     * Relasi ke Tim Kerja Kanwil
     */
    public function timKerja(): BelongsTo
    {
        return $this->belongsTo(TimKerja::class, 'tim_kerja_id', 'tim_kerja_id');
    }

    /**
     * Relasi ke Status Regulasi
     */
    public function statusRegulasi(): BelongsTo
    {
        return $this->belongsTo(StatusRegulasi::class, 'status_id', 'status_id');
    }

    /**
     * Relasi ke User Pengunggah / Pembuat
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Relasi ke Dokumen-Dokumen Berkas
     */
    public function dokumens(): HasMany
    {
        return $this->hasMany(Dokumen::class, 'rancangan_id', 'rancangan_id');
    }

    /**
     * Scope Filter Berdasarkan Wilayah Tim Kerja Pengguna Aktif
     */
    public function scopeForUser($query, ?User $user)
    {
        if (! $user) {
            return $query;
        }

        // Jika user adalah Tim Kerja, batasi ke rancangan pada Tim Kerja miliknya
        if ($user->isTimKerja() && $user->tim_kerja_id) {
            return $query->where('tim_kerja_id', $user->tim_kerja_id);
        }

        // Admin, Biro Hukum, dan Pimpinan dapat melihat seluruh rancangan
        return $query;
    }
}
