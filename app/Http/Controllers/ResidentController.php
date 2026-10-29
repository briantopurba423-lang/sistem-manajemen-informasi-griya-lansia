<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%")
                  ->orWhere('room', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('name')->paginate(10));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'nik'          => 'nullable|string|max:20|unique:residents,nik',
            'gender'       => 'required|in:L,P',
            'birth_date'   => 'nullable|date',
            'room'         => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'family_name'  => 'nullable|string|max:255',
            'family_phone' => 'nullable|string|max:20',
            'status'       => 'in:aktif,tidak_aktif,meninggal',
            'notes'        => 'nullable|string',
        ]);

        $resident = Resident::create($data);
        return response()->json($resident, 201);
    }

    public function show(Resident $resident)
    {
        return response()->json($resident->load(['healthRecords' => fn($q) => $q->latest()->limit(5)]));
    }

    public function update(Request $request, Resident $resident)
    {
        $data = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'nik'          => 'nullable|string|max:20|unique:residents,nik,' . $resident->id,
            'gender'       => 'sometimes|in:L,P',
            'birth_date'   => 'nullable|date',
            'room'         => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'family_name'  => 'nullable|string|max:255',
            'family_phone' => 'nullable|string|max:20',
            'status'       => 'in:aktif,tidak_aktif,meninggal',
            'notes'        => 'nullable|string',
        ]);

        $resident->update($data);
        return response()->json($resident);
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();
        return response()->json(['message' => 'Data lansia berhasil dihapus.']);
    }
}
