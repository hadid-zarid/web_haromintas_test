<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusRegulasi extends Model
{
    protected $table = 'status_regulasi';
    protected $primaryKey = 'status_id';
    public $timestamps = false;

    protected $fillable = [
        'nama_status',
        'urutan',
    ];

    public function rancangans(): HasMany
    {
        return $this->hasMany(RancanganRegulasi::class, 'status_id', 'status_id');
    }
}
