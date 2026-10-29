<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\HealthRecord;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Admin ──────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@griyalansia.id'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        // ── Staff ──────────────────────────────────────────────
        $staff = User::firstOrCreate(
            ['email' => 'staff@griyalansia.id'],
            [
                'name'     => 'Perawat Sari',
                'password' => Hash::make('password'),
                'role'     => 'staff',
            ]
        );

        // ── Lansia contoh ──────────────────────────────────────
        $resident = Resident::firstOrCreate(
            ['nik' => '3201010101010001'],
            [
                'name'         => 'Siti Aminah',
                'gender'       => 'P',
                'birth_date'   => '1952-03-14',
                'room'         => 'C-101',
                'address'      => 'Jl. Mawar No. 5, Jakarta Selatan',
                'family_name'  => 'Ibu Rina',
                'family_phone' => '08123456789',
                'status'       => 'aktif',
                'notes'        => 'Kondisi stabil, rutin senam pagi.',
            ]
        );

        // ── Akun keluarga ──────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'keluarga@griyalansia.id'],
            [
                'name'        => 'Ibu Rina',
                'password'    => Hash::make('password'),
                'role'        => 'keluarga',
                'resident_id' => $resident->id,
            ]
        );

        // ── Rekam kesehatan contoh ─────────────────────────────
        if (HealthRecord::where('resident_id', $resident->id)->count() === 0) {
            $healthData = [
                ['check_date' => now()->subDays(3), 'blood_pressure_systolic' => 120, 'blood_pressure_diastolic' => 80, 'heart_rate' => 90, 'temperature' => 36.5, 'weight' => 58, 'blood_sugar' => '90', 'notes' => 'Kondisi stabil dan mengikuti kegiatan dengan baik.'],
                ['check_date' => now()->subDays(10), 'blood_pressure_systolic' => 125, 'blood_pressure_diastolic' => 82, 'heart_rate' => 88, 'temperature' => 36.7, 'weight' => 57.5, 'blood_sugar' => '95', 'notes' => 'Sedikit lelah, sudah beristirahat cukup.'],
                ['check_date' => now()->subDays(17), 'blood_pressure_systolic' => 118, 'blood_pressure_diastolic' => 78, 'heart_rate' => 85, 'temperature' => 36.4, 'weight' => 58, 'blood_sugar' => '88', 'notes' => 'Kondisi sangat baik minggu ini.'],
            ];

            foreach ($healthData as $h) {
                HealthRecord::create(array_merge($h, [
                    'resident_id' => $resident->id,
                    'user_id'     => $staff->id,
                ]));
            }
        }

        // ── Kegiatan contoh ────────────────────────────────────
        if (Activity::where('resident_id', $resident->id)->count() === 0) {
            $activities = [
                ['activity_name' => 'Senam Pagi',                'category' => 'fisik',   'activity_date' => now()->addDays(1), 'start_time' => '08:00', 'end_time' => '09:00', 'participation' => 'aktif'],
                ['activity_name' => 'Pemeriksaan Kesehatan Rutin','category' => 'fisik',   'activity_date' => now()->addDays(3), 'start_time' => '09:00', 'end_time' => '10:00', 'participation' => 'aktif'],
                ['activity_name' => 'Terapi Relaksasi',           'category' => 'fisik',   'activity_date' => now()->addDays(4), 'start_time' => '10:00', 'end_time' => '11:00', 'participation' => 'aktif'],
                ['activity_name' => 'Pengajian Rutin',            'category' => 'rohani',  'activity_date' => now()->addDays(6), 'start_time' => '08:00', 'end_time' => '09:00', 'participation' => 'aktif'],
                ['activity_name' => 'Senam Pagi',                'category' => 'fisik',   'activity_date' => now()->subDays(3), 'start_time' => '08:00', 'end_time' => '09:00', 'participation' => 'aktif'],
                ['activity_name' => 'Penyuluhan Gizi',            'category' => 'edukasi', 'activity_date' => now()->subDays(5), 'start_time' => '10:00', 'end_time' => '11:00', 'participation' => 'aktif'],
                ['activity_name' => 'Ibadah Bersama',             'category' => 'rohani',  'activity_date' => now()->subDays(7), 'start_time' => '08:00', 'end_time' => '09:00', 'participation' => 'aktif'],
            ];

            foreach ($activities as $a) {
                Activity::create(array_merge($a, [
                    'resident_id' => $resident->id,
                    'user_id'     => $staff->id,
                ]));
            }
        }
    }
}
