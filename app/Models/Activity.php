<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id', 'user_id', 'activity_name', 'category',
        'activity_date', 'start_time', 'end_time', 'participation', 'notes',
    ];

    protected $casts = ['activity_date' => 'date'];

    public function resident() { return $this->belongsTo(Resident::class); }
    public function staff()    { return $this->belongsTo(User::class, 'user_id'); }
}
