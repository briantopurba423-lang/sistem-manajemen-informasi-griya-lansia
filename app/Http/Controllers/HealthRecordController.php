<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = HealthRecord::with('resident');

        if ($request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        return response()->json(
            $query->orderByDesc('check_date')->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id'               => 'required|exists:residents,id',
            'check_date'                => 'required|date',
            'blood_pressure_systolic'   => 'nullable|numeric',
            'blood_pressure_diastolic'  => 'nullable|numeric',
            'heart_rate'                => 'nullable|numeric',
            'temperature'               => 'nullable|numeric',
            'weight'                    => 'nullable|numeric',
            'blood_sugar'               => 'nullable|string',
            'diagnosis'                 => 'nullable|string',
            'treatment'                 => 'nullable|string',
            'notes'                     => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $record = HealthRecord::create($data);

        return response()->json($record->load('resident'), 201);
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $data = $request->validate([
            'check_date'                => 'sometimes|date',
            'blood_pressure_systolic'   => 'nullable|numeric',
            'blood_pressure_diastolic'  => 'nullable|numeric',
            'heart_rate'                => 'nullable|numeric',
            'temperature'               => 'nullable|numeric',
            'weight'                    => 'nullable|numeric',
            'blood_sugar'               => 'nullable|string',
            'diagnosis'                 => 'nullable|string',
            'treatment'                 => 'nullable|string',
            'notes'                     => 'nullable|string',
        ]);

        $healthRecord->update($data);
        return response()->json($healthRecord->load('resident'));
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $healthRecord->delete();
        return response()->json(['message' => 'Data kesehatan berhasil dihapus.']);
    }
}
