<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DailyActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'activity_date', 'activity_time', 'status', 'notes',
    ];

    protected $casts = [
        'activity_date' => 'date',
    ];
}
