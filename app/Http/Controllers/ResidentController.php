<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
<<<<<<< HEAD
    public function index(Request $request)
    {
        $query = Resident::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('nik', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('name')->paginate(10));
=======
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
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
<<<<<<< HEAD
            'nik'          => 'nullable|string|max:20|unique:residents',
=======
            'nik'          => 'nullable|string|max:20|unique:residents,nik',
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
            'gender'       => 'required|in:L,P',
            'birth_date'   => 'nullable|date',
            'room'         => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'family_name'  => 'nullable|string|max:255',
            'family_phone' => 'nullable|string|max:20',
<<<<<<< HEAD
            'status'       => 'in:aktif,tidak_aktif,meninggal',
=======
            'status'       => 'required|in:aktif,tidak_aktif,meninggal',
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
            'notes'        => 'nullable|string',
        ]);

        $resident = Resident::create($data);
<<<<<<< HEAD
=======

>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
        return response()->json($resident, 201);
    }

    public function show(Resident $resident)
    {
<<<<<<< HEAD
        return response()->json($resident->load(['healthRecords', 'activities']));
=======
        return response()->json($resident->load(['healthRecords' => fn($q) => $q->latest()->limit(5), 'medications' => fn($q) => $q->where('is_active', true)]));
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }

    public function update(Request $request, Resident $resident)
    {
        $data = $request->validate([
<<<<<<< HEAD
            'name'         => 'sometimes|string|max:255',
            'gender'       => 'sometimes|in:L,P',
=======
            'name'         => 'required|string|max:255',
            'nik'          => 'nullable|string|max:20|unique:residents,nik,' . $resident->id,
            'gender'       => 'required|in:L,P',
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
            'birth_date'   => 'nullable|date',
            'room'         => 'nullable|string|max:20',
            'address'      => 'nullable|string',
            'family_name'  => 'nullable|string|max:255',
            'family_phone' => 'nullable|string|max:20',
<<<<<<< HEAD
            'status'       => 'in:aktif,tidak_aktif,meninggal',
=======
            'status'       => 'required|in:aktif,tidak_aktif,meninggal',
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
            'notes'        => 'nullable|string',
        ]);

        $resident->update($data);
<<<<<<< HEAD
=======

>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
        return response()->json($resident);
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();
<<<<<<< HEAD
        return response()->json(['message' => 'Lansia berhasil dihapus.']);
=======
        return response()->json(['message' => 'Data lansia berhasil dihapus.']);
>>>>>>> f5012a97a1f4601133e43efc514ec51b994869ba
    }
}
