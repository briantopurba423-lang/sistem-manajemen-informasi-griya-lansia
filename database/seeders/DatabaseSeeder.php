<?php

namespace Database\Seeders;

use App\Models\DailyActivity;
use App\Models\Examination;
use App\Models\HealthRecord;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $perawat = User::firstOrCreate(['email' => 'perawat@griya.com'], [
            'name'     => 'Siti Aisyah',
            'password' => bcrypt('password'),
            'role'     => 'perawat',
        ]);

        User::firstOrCreate(['email' => 'admin@griya.com'], [
            'name'     => 'Administrator',
            'password' => bcrypt('password'),
            'role'     => 'admin',
        ]);

        User::firstOrCreate(['email' => 'keluarga@griya.com'], [
            'name'     => 'Keluarga Demo',
            'password' => bcrypt('password'),
            'role'     => 'keluarga',
        ]);

        $names = ['Sutrisno', 'Maryati', 'Rukmini', 'Widodo', 'Sulastri'];
        $residents = [];
        foreach ($names as $i => $name) {
            $residents[] = Resident::firstOrCreate(['name' => $name], [
                'gender'     => $i % 2 === 0 ? 'L' : 'P',
                'birth_date' => Carbon::now()->subYears(65 + $i),
                'room'       => 'A' . ($i + 1),
                'status'     => 'aktif',
            ]);
        }

        $today = Carbon::today()->toDateString();

        $examTypes  = ['Pemeriksaan Rutin','Cek Tekanan Darah','Cek Gula Darah','Pemeriksaan Rutin','Cek Kolesterol'];
        $examTimes  = ['08:00','09:00','10:00','11:00','13:00'];
        $examStatus = ['selesai','selesai','dalam_proses','belum_mulai','belum_mulai'];

        foreach ($residents as $i => $r) {
            Examination::firstOrCreate(
                ['resident_id' => $r->id, 'exam_date' => $today, 'exam_time' => $examTimes[$i]],
                ['user_id' => $perawat->id, 'type' => $examTypes[$i], 'status' => $examStatus[$i]]
            );
        }

        $acts = [
            ['name' => 'Senam Pagi',      'time' => '08:00', 'status' => 'selesai'],
            ['name' => 'Terapi Rekreasi', 'time' => '10:00', 'status' => 'selesai'],
            ['name' => 'Penyuluhan Gizi', 'time' => '14:00', 'status' => 'akan_datang'],
        ];
        foreach ($acts as $a) {
            DailyActivity::firstOrCreate(
                ['name' => $a['name'], 'activity_date' => $today],
                ['activity_time' => $a['time'], 'status' => $a['status']]
            );
        }

        $conditions = [
            ['diagnosis' => 'Nyeri lutut',          'treatment' => 'Pemberian obat'],
            ['diagnosis' => 'Pusing',               'treatment' => 'Observasi'],
            ['diagnosis' => 'Tekanan darah tinggi', 'treatment' => 'Pemberian obat'],
            ['diagnosis' => 'Batuk',                'treatment' => 'Pemeriksaan lanjutan'],
            ['diagnosis' => 'Tidak ada keluhan',    'treatment' => '-'],
        ];
        foreach ($residents as $i => $r) {
            HealthRecord::firstOrCreate(
                ['resident_id' => $r->id, 'check_date' => $today],
                ['user_id' => $perawat->id, 'diagnosis' => $conditions[$i]['diagnosis'], 'treatment' => $conditions[$i]['treatment']]
            );
        }
    }
}
