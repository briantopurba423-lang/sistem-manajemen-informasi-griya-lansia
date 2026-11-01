<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Resident;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    /** View route */
    public function index()
    {
        return view('kesehatan.index');
    }

    /** API — paginated list */
    public function list(Request $request)
    {
        $query = HealthRecord::with(['resident:id,name,room', 'staff:id,name'])
            ->orderByDesc('check_date');

        if ($request->q) {
            $query->whereHas('resident', fn($r) => $r->where('name', 'like', "%{$request->q}%"));
        }

        if ($request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        return response()->json($query->paginate(10));
    }

    /** API — list active residents for dropdown */
    public function residents()
    {
        return response()->json(
            Resident::where('status', 'aktif')->orderBy('name')->get(['id', 'name', 'room'])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id'              => 'required|exists:residents,id',
            'check_date'               => 'required|date',
            'blood_pressure_systolic'  => 'nullable|numeric',
            'blood_pressure_diastolic' => 'nullable|numeric',
            'heart_rate'               => 'nullable|numeric',
            'temperature'              => 'nullable|numeric',
            'weight'                   => 'nullable|numeric',
            'blood_sugar'              => 'nullable|string',
            'diagnosis'                => 'nullable|string',
            'treatment'                => 'nullable|string',
            'notes'                    => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $record = HealthRecord::create($data);

        return response()->json($record->load('resident:id,name'), 201);
    }

    public function show(HealthRecord $healthRecord)
    {
        return response()->json(
            $healthRecord->load(['resident:id,name,room', 'staff:id,name'])
        );
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $data = $request->validate([
            'check_date'               => 'sometimes|date',
            'blood_pressure_systolic'  => 'nullable|numeric',
            'blood_pressure_diastolic' => 'nullable|numeric',
            'heart_rate'               => 'nullable|numeric',
            'temperature'              => 'nullable|numeric',
            'weight'                   => 'nullable|numeric',
            'blood_sugar'              => 'nullable|string',
            'diagnosis'                => 'nullable|string',
            'treatment'                => 'nullable|string',
            'notes'                    => 'nullable|string',
        ]);

        $healthRecord->update($data);
        return response()->json($healthRecord->load('resident:id,name'));
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $healthRecord->delete();
        return response()->json(['message' => 'Rekam kesehatan berhasil dihapus.']);
    }
}
