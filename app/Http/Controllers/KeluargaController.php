<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\HealthRecord;
use App\Models\Resident;
use Illuminate\Http\Request;

class KeluargaController extends Controller
{
    /** Pastikan user adalah keluarga dan punya resident_id */
    private function getResident(): ?Resident
    {
        $user = auth()->user();
        if (!$user->resident_id) return null;
        return Resident::find($user->resident_id);
    }

    public function index()
    {
        return view('keluarga.dashboard');
    }

    /** Ringkasan beranda */
    public function home()
    {
        $resident = $this->getResident();
        if (!$resident) {
            return response()->json(['error' => 'Lansia tidak ditemukan.'], 404);
        }

        // Profil lansia
        $age = $resident->birth_date
            ? (int) now()->diffInYears($resident->birth_date)
            : null;

        // Kesehatan terbaru
        $latestHealth = HealthRecord::where('resident_id', $resident->id)
            ->latest('check_date')
            ->first();

        // Kegiatan mendatang (3 terdekat)
        $upcomingActivities = Activity::where('resident_id', $resident->id)
            ->where('activity_date', '>=', now()->toDateString())
            ->orderBy('activity_date')
            ->orderBy('start_time')
            ->limit(3)
            ->get()
            ->map(fn ($a) => [
                'id'            => $a->id,
                'activity_name' => $a->activity_name,
                'category'      => $a->category,
                'activity_date' => $a->activity_date->format('Y-m-d'),
                'start_time'    => $a->start_time ? substr($a->start_time, 0, 5) : null,
                'end_time'      => $a->end_time   ? substr($a->end_time, 0, 5)   : null,
                'participation' => $a->participation,
            ]);

        // Pengumuman statis (bisa dikembangkan ke tabel sendiri)
        $announcements = [
            [
                'id'      => 1,
                'title'   => 'Perubahan Jadwal Senam Pagi',
                'content' => 'Senam pagi minggu ini diadakan di aula utama.',
                'date'    => now()->subDays(1)->format('Y-m-d'),
                'color'   => 'blue',
            ],
            [
                'id'      => 2,
                'title'   => 'Kegiatan Rekreasi',
                'content' => 'Akan diadakan rekreasi ke taman kota pada 20 Nov 2024.',
                'date'    => now()->subDays(3)->format('Y-m-d'),
                'color'   => 'orange',
            ],
        ];

        return response()->json([
            'resident' => [
                'id'          => $resident->id,
                'name'        => $resident->name,
                'age'         => $age,
                'room'        => $resident->room,
                'status'      => $resident->status,
                'family_name' => $resident->family_name,
                'gender'      => $resident->gender,
            ],
            'latest_health'       => $latestHealth,
            'upcoming_activities' => $upcomingActivities,
            'announcements'       => $announcements,
            'services' => [
                ['name' => 'Layanan Makan',     'status' => 'Tersedia', 'color' => 'red'],
                ['name' => 'Layanan Kamar',     'status' => 'Tersedia', 'color' => 'blue'],
                ['name' => 'Layanan Kesehatan', 'status' => 'Tersedia', 'color' => 'orange'],
                ['name' => 'Pendampingan',      'status' => 'Tersedia', 'color' => 'purple'],
            ],
        ]);
    }

    /** Profil lengkap lansia */
    public function profile()
    {
        $resident = $this->getResident();
        if (!$resident) return response()->json(['error' => 'Lansia tidak ditemukan.'], 404);

        $age = $resident->birth_date
            ? (int) now()->diffInYears($resident->birth_date)
            : null;

        return response()->json([
            'resident' => array_merge($resident->toArray(), ['age' => $age]),
        ]);
    }

    /** Riwayat kesehatan */
    public function healthHistory(Request $request)
    {
        $resident = $this->getResident();
        if (!$resident) return response()->json(['error' => 'Lansia tidak ditemukan.'], 404);

        $records = HealthRecord::where('resident_id', $resident->id)
            ->with('staff:id,name')
            ->latest('check_date')
            ->paginate(10);

        return response()->json($records);
    }

    /** Jadwal kegiatan */
    public function activities(Request $request)
    {
        $resident = $this->getResident();
        if (!$resident) return response()->json(['error' => 'Lansia tidak ditemukan.'], 404);

        $month = $request->get('month', now()->month);
        $year  = $request->get('year',  now()->year);

        $activities = Activity::where('resident_id', $resident->id)
            ->whereMonth('activity_date', $month)
            ->whereYear('activity_date', $year)
            ->orderBy('activity_date')
            ->orderBy('start_time')
            ->get()
            ->map(fn ($a) => [
                'id'            => $a->id,
                'activity_name' => $a->activity_name,
                'category'      => $a->category,
                'activity_date' => $a->activity_date->format('Y-m-d'),
                'start_time'    => $a->start_time ? substr($a->start_time, 0, 5) : null,
                'end_time'      => $a->end_time   ? substr($a->end_time, 0, 5)   : null,
                'participation' => $a->participation,
                'notes'         => $a->notes,
            ]);

        return response()->json(['data' => $activities, 'month' => $month, 'year' => $year]);
    }
}
