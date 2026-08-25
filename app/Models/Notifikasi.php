<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';
    protected $primaryKey = 'notifikasi_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'rancangan_id',
        'judul',
        'pesan',
        'is_read',
        'created_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
    ];

    /**
     * User penerima notifikasi
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Rancangan regulasi terkait
     */
    public function rancangan(): BelongsTo
    {
        return $this->belongsTo(RancanganRegulasi::class, 'rancangan_id', 'rancangan_id');
    }

    /**
     * Scope notifikasi yang belum dibaca
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope notifikasi untuk user tertentu
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
