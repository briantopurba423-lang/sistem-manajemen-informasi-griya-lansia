<?php

namespace App\Http\Controllers;

use App\Models\DailyActivity;
use App\Models\Examination;
use App\Models\HealthRecord;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();

        $totalResidents = Resident::where('status', 'aktif')->count();
        $todayExams = Examination::whereDate('exam_date', $today)->count();
        $todayExamsDone = Examination::whereDate('exam_date', $today)->where('status', 'selesai')->count();
        $todayActivities = DailyActivity::whereDate('activity_date', $today)->count();
        $todayActivitiesDone = DailyActivity::whereDate('activity_date', $today)->where('status', 'selesai')->count();

        $examinations = Examination::with('resident')
            ->whereDate('exam_date', $today)
            ->orderBy('exam_time')
            ->get()
            ->map(fn($e) => [
                'id'        => $e->id,
                'resident'  => $e->resident->name ?? '-',
                'type'      => $e->type,
                'time'      => substr($e->exam_time, 0, 5),
                'status'    => $e->status,
            ]);

        $activities = DailyActivity::whereDate('activity_date', $today)
            ->orderBy('activity_time')
            ->get()
            ->map(fn($a) => [
                'id'     => $a->id,
                'name'   => $a->name,
                'time'   => substr($a->activity_time, 0, 5),
                'status' => $a->status,
            ]);

        $healthConditions = HealthRecord::with('resident')
            ->orderByDesc('check_date')
            ->limit(5)
            ->get()
            ->map(fn($h) => [
                'id'        => $h->id,
                'resident'  => $h->resident->name ?? '-',
                'complaint' => $h->diagnosis ?? '-',
                'treatment' => $h->treatment ?? '-',
                'date'      => $h->check_date->format('d M Y'),
            ]);

        return response()->json([
            'stats' => [
                'total_residents'      => $totalResidents,
                'today_exams'          => $todayExams,
                'today_exams_done'     => $todayExamsDone,
                'today_activities'     => $todayActivities,
                'today_activities_done'=> $todayActivitiesDone,
            ],
            'examinations'     => $examinations,
            'activities'       => $activities,
            'health_conditions'=> $healthConditions,
        ]);
    }
}
