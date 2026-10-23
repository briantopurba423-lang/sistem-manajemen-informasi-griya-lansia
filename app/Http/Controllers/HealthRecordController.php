<?php

namespace App\Http\Controllers;

use App\Models\HealthRecord;
<<<<<<< HEAD
=======
use App\Models\Resident;
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
use Illuminate\Http\Request;

class HealthRecordController extends Controller
{
<<<<<<< HEAD
    public function index(Request $request)
    {
        $query = HealthRecord::with('resident');

        if ($request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        return response()->json(
            $query->orderByDesc('check_date')->paginate(10)
        );
=======
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
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }

    public function store(Request $request)
    {
        $data = $request->validate([
<<<<<<< HEAD
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
=======
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
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }

    public function update(Request $request, HealthRecord $healthRecord)
    {
        $data = $request->validate([
<<<<<<< HEAD
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
=======
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
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }

    public function destroy(HealthRecord $healthRecord)
    {
        $healthRecord->delete();
<<<<<<< HEAD
        return response()->json(['message' => 'Data kesehatan berhasil dihapus.']);
=======
        return response()->json(['message' => 'Rekam kesehatan berhasil dihapus.']);
    }

    public function residents()
    {
        return response()->json(
            Resident::where('status', 'aktif')->orderBy('name')->get(['id', 'name', 'room'])
        );
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }
}
