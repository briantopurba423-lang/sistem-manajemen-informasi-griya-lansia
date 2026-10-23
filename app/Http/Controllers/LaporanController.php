<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\HealthRecord;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function index()
    {
        return view('laporan.index');
    }

    public function summary(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year  = $request->get('year', now()->year);

        $totalResidents = Resident::where('status', 'aktif')->count();
        $totalStaff     = User::whereIn('role', ['admin', 'staff'])->count();
        $totalRooms     = Resident::where('status', 'aktif')->whereNotNull('room')->distinct('room')->count('room');

        $activitiesMonth = Activity::whereMonth('activity_date', $month)
            ->whereYear('activity_date', $year)->count();

        $healthChecksMonth = HealthRecord::whereMonth('check_date', $month)
            ->whereYear('check_date', $year)->count();

        // Kegiatan per kategori bulan ini
        $activitiesByCategory = Activity::whereMonth('activity_date', $month)
            ->whereYear('activity_date', $year)
            ->select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get();

        // Lansia per status
        $residentsByStatus = Resident::select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get();

        // Pemeriksaan kesehatan per bulan (tahun ini)
        $monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        $healthPerMonth = [];
        for ($m = 1; $m <= 12; $m++) {
            $healthPerMonth[] = [
                'month' => $monthNames[$m - 1],
                'count' => HealthRecord::whereMonth('check_date', $m)->whereYear('check_date', $year)->count(),
            ];
        }

        // Top 5 kegiatan
        $topActivities = Activity::select('activity_name', DB::raw('COUNT(*) as total'))
            ->whereYear('activity_date', $year)
            ->groupBy('activity_name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'total_residents'     => $totalResidents,
                'total_staff'         => $totalStaff,
                'total_rooms'         => $totalRooms,
                'activities_month'    => $activitiesMonth,
                'health_checks_month' => $healthChecksMonth,
            ],
            'activities_by_category' => $activitiesByCategory,
            'residents_by_status'    => $residentsByStatus,
            'health_per_month'       => $healthPerMonth,
            'top_activities'         => $topActivities,
            'month'                  => $month,
            'year'                   => $year,
        ]);
    }
}
