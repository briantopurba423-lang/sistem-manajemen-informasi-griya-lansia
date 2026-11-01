<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    /** View route — returns blade view */
    public function index()
    {
        return view('lansia.index');
    }

    /** API — paginated list (used by React admin pages) */
    public function list(Request $request)
    {
        $query = Resident::query();

        if ($request->q) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                  ->orWhere('nik',  'like', "%{$request->q}%")
                  ->orWhere('room', 'like', "%{$request->q}%");
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

        return response()->json(Resident::create($data), 201);
    }

    public function show(Resident $resident)
    {
        return response()->json(
            $resident->load(['healthRecords' => fn($q) => $q->latest()->limit(5)])
        );
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
