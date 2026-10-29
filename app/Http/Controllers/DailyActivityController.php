<?php

namespace App\Http\Controllers;

use App\Models\DailyActivity;
use Illuminate\Http\Request;

class DailyActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = DailyActivity::query();

        if ($request->date) {
            $query->whereDate('activity_date', $request->date);
        }

        return response()->json(
            $query->orderBy('activity_time')->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'activity_date' => 'required|date',
            'activity_time' => 'required|date_format:H:i',
            'status'        => 'in:akan_datang,dalam_proses,selesai',
            'notes'         => 'nullable|string',
        ]);

        $activity = DailyActivity::create($data);
        return response()->json($activity, 201);
    }

    public function update(Request $request, DailyActivity $dailyActivity)
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'activity_date' => 'sometimes|date',
            'activity_time' => 'sometimes|date_format:H:i',
            'status'        => 'in:akan_datang,dalam_proses,selesai',
            'notes'         => 'nullable|string',
        ]);

        $dailyActivity->update($data);
        return response()->json($dailyActivity);
    }

    public function destroy(DailyActivity $dailyActivity)
    {
        $dailyActivity->delete();
        return response()->json(['message' => 'Kegiatan berhasil dihapus.']);
    }
}
