<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index()
    {
        return view('lansia.index');
    }

    public function list(Request $request)
    {
        $q = $request->get('q');
        $status = $request->get('status');

        $query = Resident::query()->orderBy('name');

        if ($q) {
            $query->where(function ($query) use ($q) {
                $query->where('name', 'like', "%$q%")
                      ->orWhere('nik', 'like', "%$q%")
                      ->orWhere('room', 'like', "%$q%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(10));
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
            'status'       => 'required|in:aktif,tidak_aktif,meninggal',
            'notes'        => 'nullable|string',
        ]);

        $resident = Resident::create($data);

        return response()->json($resident, 201);
    }

    public function show(Resident $resident)
    {
        return response()->json($resident->load(['healthRecords' => fn($q) => $q->latest()->limit(5), 'medications' => fn($q) => $q->where('is_active', true)]));
    }

    public function update(Request $request, Resident $resident)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'nik'          => 'nullable|string|max:20|unique:residents,nik,' . $resident->id,
            'gender'       => 'required|in:L,P',
            'birth_date'   => 'nullable|date',
            'room'         => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'family_name'  => 'nullable|string|max:255',
            'family_phone' => 'nullable|string|max:20',
            'status'       => 'required|in:aktif,tidak_aktif,meninggal',
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
