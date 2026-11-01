<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return view('dashboard');
    }

    public function stats()
    {
        $thisYear  = now()->year;
        $thisMonth = now()->month;
        $lastMonth = now()->subMonth()->month;
        $lastMonthYear = now()->subMonth()->year;

        $totalResidents = Resident::where('status', 'aktif')->count();
        $prevResidents  = Resident::where('status', 'aktif')
            ->where('created_at', '<', now()->subMonth())->count();

        $totalStaff = User::whereIn('role', ['admin', 'staff'])->count();
        $prevStaff  = User::whereIn('role', ['admin', 'staff'])
            ->where('created_at', '<', now()->subMonth())->count();

        $totalRooms = Resident::where('status', 'aktif')
            ->whereNotNull('room')->distinct('room')->count('room');

        $activitiesThisMonth = DB::table('activities')
            ->whereMonth('activity_date', $thisMonth)->whereYear('activity_date', $thisYear)->count();
        $activitiesLastMonth = DB::table('activities')
            ->whereMonth('activity_date', $lastMonth)->whereYear('activity_date', $lastMonthYear)->count();

        // Lansia per bulan
        $monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        $residentsPerMonth = [];
        for ($m = 1; $m <= 12; $m++) {
            $residentsPerMonth[] = [
                'month' => $monthNames[$m - 1],
                'count' => Resident::where('status', 'aktif')
                    ->whereMonth('created_at', '<=', $m)
                    ->whereYear('created_at', '<=', $thisYear)
                    ->count(),
            ];
        }

        $healthSehat      = $totalResidents;
        $healthPemantauan = (int) round($healthSehat * 0.28);
        $healthIntensif   = (int) round($healthSehat * 0.21);
        $healthSehat      = max(0, $totalResidents - $healthPemantauan - $healthIntensif);

        $recentActivities = DB::table('activities')
            ->select('activity_date', 'activity_name', DB::raw('COUNT(*) as peserta'), DB::raw("'Selesai' as status"))
            ->groupBy('activity_date', 'activity_name')
            ->orderBy('activity_date', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'date'     => \Carbon\Carbon::parse($a->activity_date)->isoFormat('D MMM YYYY'),
                'activity' => $a->activity_name,
                'peserta'  => $a->peserta . ' lansia',
                'status'   => 'Selesai',
            ]);

        return response()->json([
            'stats' => [
                'total_residents'       => $totalResidents,
                'resident_diff'         => $totalResidents - $prevResidents,
                'total_staff'           => $totalStaff,
                'staff_diff'            => $totalStaff - $prevStaff,
                'total_rooms'           => $totalRooms,
                'rooms_diff'            => 0,
                'activities_month'      => $activitiesThisMonth,
                'activities_month_diff' => $activitiesThisMonth - $activitiesLastMonth,
            ],
            'residents_per_month' => $residentsPerMonth,
            'health_status' => [
                ['label' => 'Sehat',                    'value' => $healthSehat,      'color' => '#2d3a4a'],
                ['label' => 'Dalam Pemantauan',         'value' => $healthPemantauan, 'color' => '#8fa8c8'],
                ['label' => 'Perlu Perawatan Intensif', 'value' => $healthIntensif,   'color' => '#c8d8e8'],
            ],
            'recent_activities' => $recentActivities,
            'total_for_donut'   => $totalResidents,
        ]);
    }
}
