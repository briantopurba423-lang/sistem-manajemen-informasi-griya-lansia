<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Resident;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return view('kegiatan.index');
    }

    public function list(Request $request)
    {
        $q        = $request->get('q');
        $category = $request->get('category');
        $month    = $request->get('month');
        $year     = $request->get('year', now()->year);

        $query = Activity::with(['resident:id,name', 'staff:id,name'])
            ->orderBy('activity_date', 'desc');

        if ($q) {
            $query->where('activity_name', 'like', "%$q%");
        }
        if ($category) {
            $query->where('category', $category);
        }
        if ($month) {
            $query->whereMonth('activity_date', $month)->whereYear('activity_date', $year);
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id'   => 'required|exists:residents,id',
            'activity_name' => 'required|string|max:255',
            'category'      => 'required|in:fisik,sosial,rohani,edukasi,lainnya',
            'activity_date' => 'required|date',
            'start_time'    => 'nullable|date_format:H:i',
            'end_time'      => 'nullable|date_format:H:i',
            'participation' => 'required|in:aktif,pasif,tidak_hadir',
            'notes'         => 'nullable|string',
        ]);

        $data['user_id'] = auth()->id();
        $activity = Activity::create($data);

        return response()->json($activity->load('resident:id,name'), 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity->load(['resident:id,name', 'staff:id,name']));
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'activity_name' => 'required|string|max:255',
            'category'      => 'required|in:fisik,sosial,rohani,edukasi,lainnya',
            'activity_date' => 'required|date',
            'start_time'    => 'nullable|date_format:H:i',
            'end_time'      => 'nullable|date_format:H:i',
            'participation' => 'required|in:aktif,pasif,tidak_hadir',
            'notes'         => 'nullable|string',
        ]);

        $activity->update($data);
        return response()->json($activity->load('resident:id,name'));
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(['message' => 'Data kegiatan berhasil dihapus.']);
    }

    public function residents()
    {
        return response()->json(
            Resident::where('status', 'aktif')->orderBy('name')->get(['id', 'name'])
        );
    }
}
