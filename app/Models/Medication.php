<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medication extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id', 'user_id', 'medicine_name', 'dosage',
        'frequency', 'route', 'start_date', 'end_date', 'notes', 'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'is_active'  => 'boolean',
    ];

    public function resident() { return $this->belongsTo(Resident::class); }
    public function staff()    { return $this->belongsTo(User::class, 'user_id'); }
}
