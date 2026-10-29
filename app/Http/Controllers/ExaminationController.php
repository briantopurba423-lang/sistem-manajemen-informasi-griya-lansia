<?php

namespace App\Http\Controllers;

use App\Models\Examination;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ExaminationController extends Controller
{
    public function index(Request $request)
    {
        $query = Examination::with('resident');

        if ($request->date) {
            $query->whereDate('exam_date', $request->date);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->orderBy('exam_date')->orderBy('exam_time')->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'type'        => 'required|string|max:255',
            'exam_date'   => 'required|date',
            'exam_time'   => 'required|date_format:H:i',
            'status'      => 'in:belum_mulai,dalam_proses,selesai',
            'notes'       => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $exam = Examination::create($data);

        return response()->json($exam->load('resident'), 201);
    }

    public function update(Request $request, Examination $examination)
    {
        $data = $request->validate([
            'type'      => 'sometimes|string|max:255',
            'exam_date' => 'sometimes|date',
            'exam_time' => 'sometimes|date_format:H:i',
            'status'    => 'in:belum_mulai,dalam_proses,selesai',
            'notes'     => 'nullable|string',
        ]);

        $examination->update($data);
        return response()->json($examination->load('resident'));
    }

    public function destroy(Examination $examination)
    {
        $examination->delete();
        return response()->json(['message' => 'Pemeriksaan berhasil dihapus.']);
    }
}
