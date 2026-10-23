<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use App\Models\Resident;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    public function index()
    {
        return view('kesehatan.index');
    }

    public function list(Request $request)
    {
        $q = $request->get('q');
        $residentId = $request->get('resident_id');

        $query = HealthRecord::with(['resident:id,name,room', 'staff:id,name'])
            ->orderBy('check_date', 'desc');

        if ($q) {
            $query->whereHas('resident', fn($r) => $r->where('name', 'like', "%$q%"));
        }

        if ($residentId) {
            $query->where('resident_id', $residentId);
        }

        return response()->json($query->paginate(10));
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

        $data['user_id'] = auth()->id();
        $record = HealthRecord::create($data);

        return response()->json($record->load('resident:id,name'), 201);
    }

    public function show(HealthRecord $healthRecord)
    {
        return response()->json($healthRecord->load(['resident:id,name,room', 'staff:id,name']));
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $data = $request->validate([
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

        $healthRecord->update($data);
        return response()->json($healthRecord->load('resident:id,name'));
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $healthRecord->delete();
        return response()->json(['message' => 'Rekam kesehatan berhasil dihapus.']);
    }

    public function residents()
    {
        return response()->json(
            Resident::where('status', 'aktif')->orderBy('name')->get(['id', 'name', 'room'])
        );
    }
}
