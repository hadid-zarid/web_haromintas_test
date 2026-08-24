<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kabupaten extends Model
{
    protected $table = 'kabupaten';
    protected $primaryKey = 'kabupaten_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_kabupaten',
        'kode_kabupaten',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_kabupaten', 'kabupaten_id', 'user_id');
    }
}
