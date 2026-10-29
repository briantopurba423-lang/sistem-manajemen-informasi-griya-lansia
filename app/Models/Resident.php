<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'nik', 'gender', 'birth_date', 'room',
        'address', 'family_name', 'family_phone', 'status', 'notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
}
