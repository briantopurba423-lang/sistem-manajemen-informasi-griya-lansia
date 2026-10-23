<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    public function index()
    {
        return view('kamar.index');
    }

    public function list(Request $request)
    {
        $q = $request->get('q');

        // Aggregate room data from residents
        $rooms = Resident::whereNotNull('room')
            ->select('room',
                DB::raw('COUNT(*) as total_penghuni'),
                DB::raw("SUM(CASE WHEN status='aktif' THEN 1 ELSE 0 END) as penghuni_aktif")
            )
            ->groupBy('room')
            ->when($q, fn($query) => $query->where('room', 'like', "%$q%"))
            ->orderBy('room')
            ->get()
            ->map(fn($r) => [
                'room'           => $r->room,
                'total_penghuni' => $r->total_penghuni,
                'penghuni_aktif' => $r->penghuni_aktif,
                'status'         => $r->penghuni_aktif > 0 ? 'Terisi' : 'Kosong',
            ]);

        return response()->json(['data' => $rooms]);
    }

    public function residents(Request $request, string $room)
    {
        $residents = Resident::where('room', $room)
            ->where('status', 'aktif')
            ->get(['id', 'name', 'gender', 'birth_date', 'status']);

        return response()->json($residents);
    }
}
