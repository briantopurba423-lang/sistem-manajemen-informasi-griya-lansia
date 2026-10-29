<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Examination extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id', 'user_id', 'type', 'exam_date', 'exam_time', 'status', 'notes',
    ];

    protected $casts = [
        'exam_date' => 'date',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
