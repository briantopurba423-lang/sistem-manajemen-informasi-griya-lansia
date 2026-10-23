<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin utama
        User::firstOrCreate(
            ['email' => 'admin@griyalansia.id'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@griyalansia.id',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        // Staff contoh
        User::firstOrCreate(
            ['email' => 'staff@griyalansia.id'],
            [
                'name'     => 'Perawat Sari',
                'email'    => 'staff@griyalansia.id',
                'password' => Hash::make('password'),
                'role'     => 'staff',
            ]
        );
    }
}
